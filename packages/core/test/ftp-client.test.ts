import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

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
