import { mkdir, mkdtemp, readdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import type { Writable } from 'node:stream';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * FTP falso: `remote` mapeia caminho → bytes servidos. `sizeOverride` faz o
 * SIZE mentir (simula download truncado), `offline` faz o access falhar e
 * `noSize` simula servidor sem suporte a SIZE. Caminho ausente em `remote`
 * responde 550 tanto no SIZE quanto no download.
 */
const ftp = vi.hoisted(() => ({
  clients: 0,
  downloads: 0,
  noSize: false,
  offline: false,
  remote: new Map<string, Buffer>(),
  sizeOverride: new Map<string, number>(),
}));

vi.mock('basic-ftp', () => ({
  Client: class {
    ftp = { verbose: false };
    constructor() {
      ftp.clients += 1;
    }
    async access(): Promise<void> {
      if (ftp.offline) throw new Error('ECONNREFUSED');
    }
    async size(path: string): Promise<number> {
      if (ftp.noSize) throw new Error('502 SIZE not implemented');
      const override = ftp.sizeOverride.get(path);
      if (override !== undefined) return override;
      const bytes = ftp.remote.get(path);
      if (!bytes) throw new Error('550 not found');
      return bytes.byteLength;
    }
    async downloadTo(stream: Writable, path: string): Promise<void> {
      ftp.downloads += 1;
      const bytes = ftp.remote.get(path);
      if (!bytes) {
        stream.end();
        throw new Error('550 not found');
      }
      await new Promise<void>((res, rej) => {
        stream.on('error', rej);
        stream.end(bytes, () => res());
      });
    }
    trackProgress(): void {}
    close(): void {}
  },
}));

import type { ProgressEvent } from '../src/ftp/client.js';
import { download, resolveCachePath } from '../src/ftp/client.js';

describe('download (cache hit)', () => {
  let cacheDir: string;

  beforeEach(async () => {
    cacheDir = await mkdtemp(join(tmpdir(), 'datasus-test-'));
  });

  afterEach(async () => {
    // vitest cleanup não necessário — tmpdir some no reboot; evitamos rm
    // pra não depender de node:fs rm recursivo aqui.
  });

  it('retorna bytes do cache sem conectar ao FTP', async () => {
    const remotePath = '/dissemin/publicos/TEST/fake.dbc';
    const localPath = join(cacheDir, remotePath);
    await mkdir(dirname(localPath), { recursive: true });
    const payload = Buffer.from('hello-datasus');
    await writeFile(localPath, payload);

    const bytes = await download({ cache: cacheDir, path: remotePath });

    expect(Buffer.from(bytes).toString()).toBe('hello-datasus');
  });

  it('emite um único evento de progresso com fromCache=true em cache hit', async () => {
    const remotePath = '/dissemin/publicos/TEST/fake2.dbc';
    const localPath = join(cacheDir, remotePath);
    await mkdir(dirname(localPath), { recursive: true });
    const payload = Buffer.alloc(1234, 'x');
    await writeFile(localPath, payload);

    const events: ProgressEvent[] = [];
    await download({
      cache: cacheDir,
      onProgress: (ev) => events.push(ev),
      path: remotePath,
    });

    expect(events).toHaveLength(1);
    expect(events[0]).toEqual({
      fromCache: true,
      path: remotePath,
      total: 1234,
      transferred: 1234,
    });
  });

  it('não chama onProgress quando nenhum callback é fornecido (cache hit)', async () => {
    const remotePath = '/dissemin/publicos/TEST/fake3.dbc';
    const localPath = join(cacheDir, remotePath);
    await mkdir(dirname(localPath), { recursive: true });
    await writeFile(localPath, Buffer.from('ok'));

    // sem onProgress — deve completar sem erros
    const bytes = await download({ cache: cacheDir, path: remotePath });
    expect(bytes.byteLength).toBe(2);
  });
});

describe('resolveCachePath (contenção)', () => {
  const cacheDir = '/tmp/test-cache';

  it('resolve caminhos normais sob o cacheDir', () => {
    expect(resolveCachePath(cacheDir, '/dissemin/publicos/CNES/fake.dbc')).toBe(
      '/tmp/test-cache/dissemin/publicos/CNES/fake.dbc',
    );
    expect(resolveCachePath(cacheDir, 'relative/file.dbc')).toBe(
      '/tmp/test-cache/relative/file.dbc',
    );
  });

  it('rejeita traversal via ..', () => {
    expect(() => resolveCachePath(cacheDir, '../outside.dbc')).toThrow(/escapa do cacheDir/);
    expect(() => resolveCachePath(cacheDir, 'nested/../../outside.dbc')).toThrow(
      /escapa do cacheDir/,
    );
  });

  it('rejeita absolutos que escapam após normalização', () => {
    // Path absoluto direto pra outro lugar, após strip do slash inicial:
    // vira relativo e é contido no cacheDir; aceitável. Porém traversal
    // explícito com .. precisa falhar.
    expect(() => resolveCachePath('/tmp/test-cache', '/../../etc/passwd')).toThrow(
      /escapa do cacheDir/,
    );
  });
});

describe('download (revalidação e escrita atômica)', () => {
  let cacheDir: string;
  const remotePath = '/dissemin/publicos/SIASUS/200801_/Dados/PARR2508.dbc';

  beforeEach(async () => {
    cacheDir = await mkdtemp(join(tmpdir(), 'datasus-test-'));
    ftp.clients = 0;
    ftp.downloads = 0;
    ftp.noSize = false;
    ftp.offline = false;
    ftp.remote.clear();
    ftp.sizeOverride.clear();
  });

  async function seedCache(content: string): Promise<string> {
    const localPath = join(cacheDir, remotePath);
    await mkdir(dirname(localPath), { recursive: true });
    await writeFile(localPath, content);
    return localPath;
  }

  async function leftovers(): Promise<string[]> {
    const dir = dirname(join(cacheDir, remotePath));
    return (await readdir(dir).catch(() => [])).filter((f) => f.includes('.part-'));
  }

  it('reusa o cache quando o tamanho no servidor bate', async () => {
    await seedCache('versao-1');
    ftp.remote.set(remotePath, Buffer.from('versao-2'));
    const bytes = await download({ cache: cacheDir, path: remotePath });
    expect(Buffer.from(bytes).toString()).toBe('versao-1');
    expect(ftp.downloads).toBe(0);
  });

  it('baixa de novo quando o servidor tem tamanho diferente (arquivo republicado)', async () => {
    const localPath = await seedCache('antigo');
    ftp.remote.set(remotePath, Buffer.from('republicado-maior'));
    const events: ProgressEvent[] = [];
    const bytes = await download({
      cache: cacheDir,
      onProgress: (e) => events.push(e),
      path: remotePath,
    });
    expect(Buffer.from(bytes).toString()).toBe('republicado-maior');
    expect((await readFile(localPath)).toString()).toBe('republicado-maior');
    expect(events.every((e) => !e.fromCache)).toBe(true);
    expect(await leftovers()).toEqual([]);
  });

  it('com revalidate: false não acessa a rede em cache hit', async () => {
    await seedCache('qualquer');
    ftp.remote.set(remotePath, Buffer.from('outro tamanho'));
    const bytes = await download({ cache: cacheDir, path: remotePath, revalidate: false });
    expect(Buffer.from(bytes).toString()).toBe('qualquer');
    expect(ftp.clients).toBe(0);
  });

  it('usa o cache se o servidor estiver inacessível', async () => {
    await seedCache('offline-ok');
    ftp.offline = true;
    const bytes = await download({ cache: cacheDir, path: remotePath });
    expect(Buffer.from(bytes).toString()).toBe('offline-ok');
  });

  it('usa o cache se o servidor não suportar SIZE', async () => {
    await seedCache('sem-size');
    ftp.noSize = true;
    ftp.remote.set(remotePath, Buffer.from('outro'));
    const bytes = await download({ cache: cacheDir, path: remotePath });
    expect(Buffer.from(bytes).toString()).toBe('sem-size');
    expect(ftp.downloads).toBe(0);
  });

  it('download novo grava no cache e não deixa temporário', async () => {
    ftp.remote.set(remotePath, Buffer.from('conteudo'));
    const bytes = await download({ cache: cacheDir, path: remotePath });
    expect(Buffer.from(bytes).toString()).toBe('conteudo');
    expect((await readFile(join(cacheDir, remotePath))).toString()).toBe('conteudo');
    expect(await leftovers()).toEqual([]);
  });

  it('download truncado falha e não envenena o cache', async () => {
    ftp.remote.set(remotePath, Buffer.from('metade'));
    ftp.sizeOverride.set(remotePath, 1000);
    await expect(download({ cache: cacheDir, path: remotePath })).rejects.toThrow(
      /incompleto — 6 de 1000 bytes/,
    );
    await expect(readFile(join(cacheDir, remotePath))).rejects.toThrow();
    expect(await leftovers()).toEqual([]);
  });

  it('download truncado não substitui uma cópia boa já em cache', async () => {
    const localPath = await seedCache('copia-boa');
    ftp.remote.set(remotePath, Buffer.from('parcial'));
    ftp.sizeOverride.set(remotePath, 5000);
    await expect(download({ cache: cacheDir, path: remotePath })).rejects.toThrow(/incompleto/);
    expect((await readFile(localPath)).toString()).toBe('copia-boa');
  });

  it('550 não deixa arquivo de 0 byte no cache', async () => {
    await expect(download({ cache: cacheDir, path: remotePath })).rejects.toThrow(/550/);
    await expect(readFile(join(cacheDir, remotePath))).rejects.toThrow();
    expect(await leftovers()).toEqual([]);
  });

  it('sem SIZE no servidor, aceita o que foi baixado', async () => {
    ftp.noSize = true;
    ftp.remote.set(remotePath, Buffer.from('sem-tamanho'));
    const bytes = await download({ cache: cacheDir, path: remotePath });
    expect(Buffer.from(bytes).toString()).toBe('sem-tamanho');
  });
});
