/**
 * Cliente FTP para DATASUS com cache local.
 *
 * DATASUS distribui microdados em `ftp://ftp.datasus.gov.br` via FTP
 * passivo sem autenticação. Este módulo é somente para Node — o browser
 * não tem suporte nativo a FTP. Consumidores browser devem obter os bytes
 * por outro meio (HTTP mirror, upload do usuário) e passar direto para o
 * decoder em `@precisa-saude/datasus-dbc`.
 */

import { randomBytes } from 'node:crypto';
import { createWriteStream, type WriteStream } from 'node:fs';
import { mkdir, readFile, rename, rm, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';

import { Client } from 'basic-ftp';

const DEFAULT_HOST = 'ftp.datasus.gov.br';

function defaultCacheDir(): string {
  return process.env['XDG_CACHE_HOME']
    ? join(process.env['XDG_CACHE_HOME'], 'datasus-brasil')
    : join(homedir(), '.cache', 'datasus-brasil');
}

export interface ProgressEvent {
  /** true se os bytes vieram do cache local (sem tráfego de rede). */
  fromCache: boolean;
  /** Caminho remoto sendo transferido. */
  path: string;
  /** Tamanho total em bytes; `null` se o servidor não reportou. */
  total: null | number;
  /** Bytes transferidos até o momento. */
  transferred: number;
}

export interface DownloadOptions {
  /** Diretório de cache local. Default: `~/.cache/datasus-brasil`. */
  cache?: string;
  /** Força re-download mesmo se já existir no cache. Default: false. */
  forceRefresh?: boolean;
  /** Host FTP. Default: `ftp.datasus.gov.br`. */
  host?: string;
  /** Caminho absoluto no servidor FTP (ex: `/dissemin/publicos/CNES/...`). */
  path: string;
  /**
   * Em cache hit, confere o tamanho do arquivo no servidor (`SIZE`) e baixa
   * de novo se divergir — o DATASUS republica arquivos com conteúdo novo no
   * mesmo caminho. Se o servidor estiver inacessível ou não suportar `SIZE`,
   * usa a cópia em cache. Default: true. `false` restaura o comportamento
   * antigo (cache hit sem nenhum acesso à rede).
   */
  revalidate?: boolean;
  /** Modo seguro (FTPS). DATASUS usa FTP plano — default false. */
  secure?: boolean;
  /**
   * Callback chamado com eventos de progresso. Invocado pelo menos uma vez:
   * - cache hit: um único evento com `fromCache: true` e `transferred == total`.
   * - download: evento inicial (transferred 0), N intermediários (intervalo
   *   ~500ms) e um final com `transferred == total`.
   */
  onProgress?: (event: ProgressEvent) => void;
}

/**
 * Baixa um arquivo do FTP (com cache). Retorna os bytes em memória.
 *
 * Em cache hit, confere o tamanho no servidor antes de reusar a cópia
 * (ver `revalidate`). O download vai para um arquivo temporário e só
 * substitui o cache quando termina com o tamanho esperado: um download
 * interrompido ou um 550 nunca deixam arquivo parcial (ou de 0 byte) no
 * caminho final. O diretório de cache preserva a estrutura do servidor
 * para facilitar inspeção manual.
 */
export async function download(options: DownloadOptions): Promise<Uint8Array> {
  const host = options.host ?? DEFAULT_HOST;
  const cacheDir = options.cache ?? defaultCacheDir();
  const localPath = resolveCachePath(cacheDir, options.path);

  if (!options.forceRefresh) {
    const cached = await readIfExists(localPath);
    if (cached && (await cacheIsCurrent(options, host, cached.byteLength))) {
      options.onProgress?.({
        fromCache: true,
        path: options.path,
        total: cached.byteLength,
        transferred: cached.byteLength,
      });
      return cached;
    }
  }

  await mkdir(dirname(localPath), { recursive: true });

  const client = new Client();
  client.ftp.verbose = false;
  try {
    await client.access({
      host,
      port: 21,
      secure: options.secure ?? false,
    });

    let total: null | number = null;
    try {
      total = await client.size(options.path);
    } catch {
      // servidor não suportou SIZE — total fica desconhecido
    }

    options.onProgress?.({
      fromCache: false,
      path: options.path,
      total,
      transferred: 0,
    });

    if (options.onProgress) {
      const onProgress = options.onProgress;
      client.trackProgress((info) => {
        onProgress({
          fromCache: false,
          path: options.path,
          total,
          transferred: info.bytesOverall,
        });
      });
    }

    // Temporário no mesmo diretório: o `rename` final é atômico, e um
    // download que falha no meio não deixa arquivo no caminho do cache.
    const tmpPath = `${localPath}.part-${process.pid}-${randomBytes(4).toString('hex')}`;
    const stream = createWriteStream(tmpPath);
    try {
      await client.downloadTo(stream, options.path);
      const written = (await stat(tmpPath)).size;
      if (total !== null && written !== total) {
        throw new Error(
          `download: ${options.path} incompleto — ${written} de ${total} bytes recebidos`,
        );
      }
      await rename(tmpPath, localPath);
    } catch (err) {
      // Fecha o stream antes de apagar: o `open` do arquivo é assíncrono, e
      // num erro imediato (ex.: 550) ele pode completar depois do `rm` e
      // recriar um temporário vazio.
      await closeStream(stream);
      await rm(tmpPath, { force: true });
      throw err;
    }

    if (options.onProgress) {
      client.trackProgress();
      const finalSize = total ?? (await stat(localPath)).size;
      options.onProgress({
        fromCache: false,
        path: options.path,
        total: finalSize,
        transferred: finalSize,
      });
    }
  } finally {
    client.close();
  }

  const bytes = await readFile(localPath);
  return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

async function closeStream(stream: WriteStream): Promise<void> {
  if (stream.closed) return;
  await new Promise<void>((res) => {
    stream.once('close', () => res());
    stream.destroy();
  });
}

/**
 * `true` se a cópia em cache pode ser reusada: revalidação desligada, ou o
 * tamanho no servidor bate com o local, ou não foi possível consultar o
 * servidor (offline, `SIZE` não suportado) — nesse caso, melhor a cópia em
 * cache do que falhar.
 */
async function cacheIsCurrent(
  options: DownloadOptions,
  host: string,
  cachedSize: number,
): Promise<boolean> {
  if (options.revalidate === false) return true;
  const client = new Client();
  client.ftp.verbose = false;
  try {
    await client.access({ host, port: 21, secure: options.secure ?? false });
    return (await client.size(options.path)) === cachedSize;
  } catch {
    return true;
  } finally {
    client.close();
  }
}

async function readIfExists(path: string): Promise<Uint8Array | null> {
  try {
    const stats = await stat(path);
    if (!stats.isFile() || stats.size === 0) return null;
    const bytes = await readFile(path);
    return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  } catch {
    return null;
  }
}

/**
 * Resolve `remotePath` relativo a `cacheDir` garantindo que o caminho
 * final fica contido no cache. Rejeita traversal (`..`) e caminhos
 * absolutos que escapem de `cacheDir` — evita que um `options.path`
 * malicioso grave fora do diretório de cache esperado.
 */
export function resolveCachePath(cacheDir: string, remotePath: string): string {
  const absoluteCacheDir = resolve(cacheDir);
  // `join` preserva absolutos. Pra garantir contenção, sempre tratamos
  // `remotePath` como relativo removendo separador inicial.
  const normalizedRelative = remotePath.replace(/^[/\\]+/, '');
  const candidate = resolve(absoluteCacheDir, normalizedRelative);
  const rel = relative(absoluteCacheDir, candidate);
  if (rel.startsWith('..') || rel.startsWith(`..${sep}`) || resolve(candidate) !== candidate) {
    throw new Error(
      `download: caminho resolvido escapa do cacheDir (${remotePath} → ${candidate})`,
    );
  }
  return candidate;
}
