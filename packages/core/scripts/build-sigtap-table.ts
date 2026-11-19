/**
 * Gera `src/terminology/data/sigtap.json`, a tabela SIGTAP que o
 * `lookupSigtap` usa em runtime.
 *
 * A base é a tabela vigente, a `TabelaUnificada_*.zip` mais recente do FTP
 * do DATASUS. Ela só lista procedimentos ativos, e o SIA-SUS histórico
 * fatura códigos que já saíram dela (vários do subgrupo 02.02.03 foram
 * faturados de 2008 a 2025 e não estão mais na tabela). Para esses, o script
 * consulta a primeira tabela de cada ano, de 2008 até o ano da vigente, e
 * usa o nome da mais recente que ainda traz o código, registrando a
 * competência dela em `lastSeenTable`.
 *
 * Um procedimento que entrou e saiu dentro do mesmo ano, entre duas tabelas
 * de janeiro, não aparece em nenhuma das consultadas e continua sem nome.
 *
 * Uso (da raiz do repo): `npx tsx packages/core/scripts/build-sigtap-table.ts`
 */

import { execFileSync } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Client } from 'basic-ftp';

const CORE_ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const MONOREPO_ROOT = resolve(CORE_ROOT, '..', '..');
const CACHE_DIR = join(MONOREPO_ROOT, '.cache', 'sigtap');
const OUTPUT = join(CORE_ROOT, 'src', 'terminology', 'data', 'sigtap.json');
const FTP_DIR = '/public/sistemas/tup/downloads/';

const PROC_OFFSETS = {
  code: [0, 10] as const,
  name: [10, 260] as const,
};

interface Release {
  /** Competência AAAAMM, dos seis dígitos depois de `TabelaUnificada_`. */
  competence: string;
  name: string;
  size: number;
}

interface SigtapProcedure {
  code: string;
  lastSeenTable?: string;
  name: string;
}

async function main(): Promise<void> {
  await mkdir(CACHE_DIR, { recursive: true });

  const client = new Client();
  client.ftp.verbose = false;
  try {
    console.error('[ftp] conectando em ftp2.datasus.gov.br...');
    await client.access({ host: 'ftp2.datasus.gov.br', port: 21, secure: false });
    const releases = await listReleases(client);
    const current = releases.at(-1);
    if (!current) throw new Error('Nenhum TabelaUnificada_*.zip encontrado no FTP.');

    const procedures = await readRelease(client, current);
    const known = new Set(procedures.map((p) => p.code));
    console.error(`[sigtap] vigente ${current.competence}: ${procedures.length} procedimentos.`);

    // Da mais recente para a mais antiga: o primeiro nome achado é o mais novo.
    const history = firstReleaseOfEachYear(releases)
      .filter((r) => r.name !== current.name)
      .reverse();
    for (const release of history) {
      let added = 0;
      for (const p of await readRelease(client, release)) {
        if (known.has(p.code)) continue;
        known.add(p.code);
        procedures.push({ ...p, lastSeenTable: formatCompetence(release.competence) });
        added++;
      }
      console.error(`[sigtap] ${release.competence}: ${added} procedimentos fora da vigente.`);
    }

    procedures.sort((a, b) => a.code.localeCompare(b.code));
    await writeFile(OUTPUT, `${JSON.stringify(procedures, null, 2)}\n`);
    const retired = procedures.filter((p) => p.lastSeenTable).length;
    console.error(`[output] ${OUTPUT}: ${procedures.length} procedimentos, ${retired} retirados.`);
  } finally {
    client.close();
  }
}

async function listReleases(client: Client): Promise<Release[]> {
  const list = await client.list(FTP_DIR);
  return list
    .map((e) => {
      const m = /^TabelaUnificada_(\d{6})(?:_v\d+)?\.zip$/i.exec(e.name);
      return m?.[1] ? { competence: m[1], name: e.name, size: e.size } : null;
    })
    .filter((r): r is Release => r !== null)
    .sort((a, b) => a.competence.localeCompare(b.competence) || a.name.localeCompare(b.name));
}

function firstReleaseOfEachYear(releases: Release[]): Release[] {
  const byYear = new Map<string, Release>();
  for (const r of releases) {
    const year = r.competence.slice(0, 4);
    if (!byYear.has(year)) byYear.set(year, r);
  }
  return [...byYear.values()];
}

async function readRelease(client: Client, release: Release): Promise<SigtapProcedure[]> {
  const zipPath = join(CACHE_DIR, release.name);
  const existing = await safeStat(zipPath);
  if (!existing || existing.size !== release.size) {
    console.error(`[ftp] baixando ${release.name} (${formatSize(release.size)})...`);
    await client.downloadTo(createWriteStream(zipPath), `${FTP_DIR}${release.name}`);
  }
  const target = join(CACHE_DIR, 'extracted', release.competence);
  await mkdir(target, { recursive: true });
  execFileSync('unzip', ['-o', '-q', '-C', zipPath, '*tb_procedimento.txt', '-d', target], {
    stdio: 'inherit',
  });
  return parseProcedures(target);
}

async function parseProcedures(extractDir: string): Promise<SigtapProcedure[]> {
  const procFile = await findFile(extractDir, /^tb_procedimento\.txt$/i);
  if (!procFile) {
    throw new Error(`tb_procedimento.txt não encontrado em ${extractDir}`);
  }
  const text = new TextDecoder('latin1').decode(await readFile(procFile));
  const lines = text.split(/\r?\n/).filter((l) => l.length >= PROC_OFFSETS.name[1]);

  const procedures: SigtapProcedure[] = [];
  for (const line of lines) {
    const code = line.slice(...PROC_OFFSETS.code).trim();
    const name = line.slice(...PROC_OFFSETS.name).trim();
    if (code.length !== 10 || !/^\d{10}$/.test(code) || name.length === 0) continue;
    procedures.push({ code, name });
  }
  return procedures;
}

async function findFile(dir: string, pattern: RegExp): Promise<null | string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      const hit = await findFile(full, pattern);
      if (hit) return hit;
    } else if (pattern.test(entry.name)) {
      return full;
    }
  }
  return null;
}

async function safeStat(path: string): Promise<{ size: number } | null> {
  try {
    const s = await stat(path);
    return s.isFile() ? { size: s.size } : null;
  } catch {
    return null;
  }
}

function formatCompetence(competence: string): string {
  return `${competence.slice(0, 4)}-${competence.slice(4, 6)}`;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

await main();
