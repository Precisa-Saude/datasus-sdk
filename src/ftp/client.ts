/**
 * Cliente FTP para DATASUS com cache local.
 *
 * DATASUS distribui microdados em `ftp://ftp.datasus.gov.br` via FTP
 * passivo sem autenticação. Este módulo é somente para Node — o browser
 * não tem suporte nativo a FTP. Consumidores browser devem obter os bytes
 * por outro meio (HTTP mirror, upload do usuário) e passar direto para o
 * decoder em `@precisa-saude/datasus-dbc`.
 */

import { createWriteStream } from 'node:fs';
import { mkdir, readFile, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

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
 * Se o arquivo já estiver em cache, retorna imediatamente sem conectar
 * ao servidor. O diretório de cache preserva a estrutura do servidor
 * para facilitar inspeção manual.
 */
export async function download(options: DownloadOptions): Promise<Uint8Array> {
  const host = options.host ?? DEFAULT_HOST;
  const cacheDir = options.cache ?? defaultCacheDir();
  const localPath = join(cacheDir, options.path);

  if (!options.forceRefresh) {
    const cached = await readIfExists(localPath);
    if (cached) {
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

    const writeStream = createWriteStream(localPath);
    await client.downloadTo(writeStream, options.path);

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
