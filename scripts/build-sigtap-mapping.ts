/**
 * Constrói mapeamento **Biomarcador (LOINC) → TUSS → SIGTAP** usando o
 * mapeamento oficial ANS TUSS↔SIGTAP (2017/04) como fonte autoritativa.
 *
 * ## Fluxo
 *
 *     biomarkers.ts (LOINC + nomes pt-BR)
 *        ↓ fuzzy match contra os nomes TUSS OFICIAIS
 *     TUSS code (encontrado direto na planilha ANS)
 *        ↓ lookup no mapeamento oficial ANS (com grau 1-5)
 *     SIGTAP candidates com grau de equivalência
 *
 * ## Por que ignorar o `BRTUSSProcedimentosLabVS.fsh` do fhir-brasil
 *
 * Descoberto na investigação: 14/15 códigos TUSS verificados no
 * `BRTUSSProcedimentosLabVS.fsh` estão **desalinhados** com a tabela
 * oficial ANS. Exemplos:
 *
 *   fhir-brasil 40301630 (Glicose)      ≠ ANS 40301630 (Creatinina)
 *   fhir-brasil 40301397 (Colest. Total)≠ ANS 40301397 (Bilirrubinas)
 *   fhir-brasil 40316491 (TSH)          ≠ ANS 40316491 (T4 livre)
 *
 * Provável causa: o fhir-brasil usou uma fonte não-ANS (talvez CBHPM
 * antecessor, ou uma numeração de portal de laboratório privado). Reportar
 * ao time do fhir-brasil pra corrigir. Enquanto isso, o presente script
 * busca códigos TUSS corretos direto no ANS via nome.
 *
 * ## Graus de equivalência (ANS/ISO TR 12300:2014)
 *
 *   1 - Léxico + conceitual idênticos
 *   2 - Sinonímia (conceito igual, nomes diferentes)
 *   3 - TUSS MENOS específico que SIGTAP (SIGTAP mais granular)
 *   4 - TUSS MAIS específico que SIGTAP (TUSS mais granular)
 *   5 - Sem mapeamento possível
 *
 * ## Status
 *
 *   auto              - 1 candidato grau 1 ou 2
 *   ambiguous_strong  - múltiplos graus 1 ou 2
 *   ambiguous_weak    - só graus 3 ou 4 (relação hierárquica)
 *   no_sigtap_match   - só grau 5, ou biomarcador sem TUSS via nome
 *
 * ## Saída
 *
 *   packages/core/data/sigtap.json                   SIGTAP completo
 *   packages/core/data/loinc-tuss-sigtap.json        mapeamento
 *   packages/core/data/loinc-tuss-sigtap.report.md   resumo revisão
 *   packages/core/data/fhir-brasil-tuss-audit.md     mismatches no fhir-brasil
 *
 * Uso: `pnpm -F @precisa-saude/datasus run build:sigtap-mapping`
 *
 * Pré-requisito (one-shot): `data/ans-tuss-sigtap-oficial.json` gerado
 * via `python3 scripts/extract-ans-xlsx.py .cache/.../xlsx OUTPUT`. Rode
 * quando a ANS publicar nova competência.
 */

import { execFileSync } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Client } from 'basic-ftp';

const CORE_ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const MONOREPO_ROOT = resolve(CORE_ROOT, '..', '..');
const PRECISA_ROOT = resolve(MONOREPO_ROOT, '..');
const CACHE_DIR = join(MONOREPO_ROOT, '.cache', 'sigtap');
const DATA_DIR = join(CORE_ROOT, 'data');
const BIOMARKERS_TS = join(PRECISA_ROOT, 'fhir-brasil', 'packages', 'core', 'src', 'biomarkers.ts');
const TUSS_VS_FSH = join(
  PRECISA_ROOT,
  'fhir-brasil',
  'ig',
  'input',
  'fsh',
  'valuesets',
  'BRTUSSProcedimentosLabVS.fsh',
);
const ANS_OFFICIAL_JSON = join(DATA_DIR, 'ans-tuss-sigtap-oficial.json');

const PROC_OFFSETS = {
  code: [0, 10] as const,
  name: [10, 260] as const,
};

interface SigtapProcedure {
  code: string;
  name: string;
}

interface BiomarkerDefinition {
  category: string | string[];
  code: string;
  hidden?: boolean;
  loinc?: string;
  names: { en: string[]; pt: string[] };
  unit?: string;
}

interface AnsMappingRow {
  grau_equivalencia: null | string;
  sigtap: null | string;
  sigtap_name: null | string;
  situacao: null | string;
  status: null | string;
  tuss: null | string;
  tuss_name: null | string;
}

interface TussEntry {
  name: string;
  tuss: string;
}

interface SigtapCandidate {
  equivalencia: null | string;
  sigtap: string;
  sigtap_name: string;
  status: null | string;
}

export type MappingStatus = 'ambiguous_strong' | 'ambiguous_weak' | 'auto' | 'no_sigtap_match';

interface MappingEntry {
  biomarker_code: string;
  biomarker_display: string;
  candidates: SigtapCandidate[];
  category: string;
  loinc: null | string;
  notes: null | string;
  selected: null | string;
  status: MappingStatus;
  tuss: null | string;
  tuss_match_score: null | number;
  tuss_name: null | string;
}

async function main(): Promise<void> {
  await mkdir(CACHE_DIR, { recursive: true });
  await mkdir(DATA_DIR, { recursive: true });

  const zipPath = await downloadLatestSigtap();
  const extractDir = await extractZip(zipPath);
  const procedures = await parseProcedures(extractDir);
  console.error(`[sigtap] ${procedures.length} procedimentos parseados.`);
  await writeFile(join(DATA_DIR, 'sigtap.json'), `${JSON.stringify(procedures, null, 2)}\n`);

  const ansEnvelope = await loadAnsOfficial();
  const ansRows = ansEnvelope.rows;
  console.error(`[ans] ${ansRows.length} linhas do mapeamento oficial ANS.`);

  const biomarkers = await loadBiomarkers();
  const visible = biomarkers.filter((b) => !b.hidden);
  console.error(`[biomarkers] ${visible.length} biomarcadores visíveis em biomarkers.ts.`);

  const tussUniverse = extractUniqueTuss(ansRows);
  const ansByTuss = indexAnsByTuss(ansRows);

  const mapping = buildMapping(visible, tussUniverse, ansByTuss);

  await writeFile(
    join(DATA_DIR, 'loinc-tuss-sigtap.json'),
    `${JSON.stringify({ _source: ansEnvelope._source, mapping }, null, 2)}\n`,
  );
  await writeFile(
    join(DATA_DIR, 'loinc-tuss-sigtap.report.md'),
    renderReport(mapping, ansEnvelope._source),
  );

  await writeFhirBrasilAudit(ansRows, ansEnvelope._source);

  const counts = countByStatus(mapping);
  console.error(
    `[mapping] auto=${counts.auto} ` +
      `ambiguous_strong=${counts.ambiguous_strong} ` +
      `ambiguous_weak=${counts.ambiguous_weak} ` +
      `no_sigtap_match=${counts.no_sigtap_match} ` +
      `(total ${mapping.length} biomarcadores).`,
  );
  console.error(`[output] ${DATA_DIR}/`);
}

async function downloadLatestSigtap(): Promise<string> {
  const client = new Client();
  client.ftp.verbose = false;
  try {
    console.error('[ftp] conectando em ftp2.datasus.gov.br...');
    await client.access({ host: 'ftp2.datasus.gov.br', port: 21, secure: false });
    const list = await client.list('/public/sistemas/tup/downloads/');
    const zips = list
      .filter((e) => /^TabelaUnificada_\d+_v.*\.zip$/i.test(e.name))
      .sort((a, b) => a.name.localeCompare(b.name));
    const latest = zips.at(-1);
    if (!latest) throw new Error('Nenhum TabelaUnificada_*.zip encontrado no FTP.');

    const localPath = join(CACHE_DIR, latest.name);
    const existing = await safeStat(localPath);
    if (existing && existing.size === latest.size) {
      console.error(`[ftp] cache hit: ${latest.name} (${formatSize(existing.size)})`);
      return localPath;
    }

    console.error(`[ftp] baixando ${latest.name} (${formatSize(latest.size)})...`);
    const ws = createWriteStream(localPath);
    await client.downloadTo(ws, `/public/sistemas/tup/downloads/${latest.name}`);
    return localPath;
  } finally {
    client.close();
  }
}

async function extractZip(zipPath: string): Promise<string> {
  const target = join(CACHE_DIR, 'extracted');
  await mkdir(target, { recursive: true });
  console.error('[unzip] extraindo SIGTAP...');
  execFileSync('unzip', ['-o', '-q', zipPath, '-d', target], { stdio: 'inherit' });
  return target;
}

async function parseProcedures(extractDir: string): Promise<SigtapProcedure[]> {
  const procFile = await findFile(extractDir, /tb_procedimento\.txt$/i);
  if (!procFile) {
    throw new Error(`tb_procedimento.txt não encontrado em ${extractDir}`);
  }
  const buf = await readFile(procFile);
  const text = new TextDecoder('latin1').decode(buf);
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

interface AnsEnvelope {
  _source: {
    competence: null | string;
    extracted_at: string;
    file: string;
    landing_page: string;
    license: string;
    notice: string;
    publisher: string;
    url: string;
  };
  rows: AnsMappingRow[];
}

async function loadAnsOfficial(): Promise<AnsEnvelope> {
  const raw = await readFile(ANS_OFFICIAL_JSON, 'utf8');
  return JSON.parse(raw) as AnsEnvelope;
}

function extractUniqueTuss(rows: AnsMappingRow[]): TussEntry[] {
  const seen = new Map<string, string>();
  for (const r of rows) {
    if (r.tuss === null || r.tuss_name === null) continue;
    if (!seen.has(r.tuss)) seen.set(r.tuss, r.tuss_name);
  }
  return Array.from(seen, ([tuss, name]) => ({ name, tuss }));
}

function indexAnsByTuss(rows: AnsMappingRow[]): Map<string, AnsMappingRow[]> {
  const idx = new Map<string, AnsMappingRow[]>();
  for (const row of rows) {
    if (row.tuss === null) continue;
    const arr = idx.get(row.tuss) ?? [];
    arr.push(row);
    idx.set(row.tuss, arr);
  }
  return idx;
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

async function loadBiomarkers(): Promise<BiomarkerDefinition[]> {
  const mod = (await import(`file://${BIOMARKERS_TS}`)) as {
    BIOMARKER_DEFINITIONS: BiomarkerDefinition[];
  };
  return mod.BIOMARKER_DEFINITIONS;
}

function buildMapping(
  biomarkers: BiomarkerDefinition[],
  tussUniverse: TussEntry[],
  ansByTuss: Map<string, AnsMappingRow[]>,
): MappingEntry[] {
  const entries: MappingEntry[] = [];
  for (const b of biomarkers) {
    const tussMatch = findBestTussByName(b, tussUniverse);
    const ansRows = tussMatch ? (ansByTuss.get(tussMatch.tuss) ?? []) : [];

    const candidates: SigtapCandidate[] = ansRows
      .filter((r) => r.sigtap !== null)
      .map((r) => ({
        equivalencia: r.grau_equivalencia,
        sigtap: r.sigtap!,
        sigtap_name: r.sigtap_name ?? '',
        status: r.status,
      }))
      .sort((a, b) => grauOrder(a.equivalencia) - grauOrder(b.equivalencia));

    const { selected, status } = decideStatus(candidates, tussMatch !== null);

    entries.push({
      biomarker_code: b.code,
      biomarker_display: b.names.pt[0] ?? b.names.en[0] ?? b.code,
      candidates,
      category: Array.isArray(b.category) ? b.category.join(',') : b.category,
      loinc: b.loinc ?? null,
      notes: null,
      selected,
      status,
      tuss: tussMatch?.tuss ?? null,
      tuss_match_score: tussMatch?.score ?? null,
      tuss_name: tussMatch?.name ?? null,
    });
  }
  return entries;
}

function findBestTussByName(
  biomarker: BiomarkerDefinition,
  tussUniverse: TussEntry[],
): { name: string; score: number; tuss: string } | null {
  const biomarkerTokens = new Set<string>();
  for (const n of biomarker.names.pt) {
    for (const tok of tokenize(n)) biomarkerTokens.add(tok);
  }
  if (biomarkerTokens.size === 0) return null;

  let best: { name: string; score: number; tuss: string } | null = null;
  for (const t of tussUniverse) {
    const tussTokens = new Set(tokenize(t.name));
    if (tussTokens.size === 0) continue;

    let intersection = 0;
    for (const tok of biomarkerTokens) if (tussTokens.has(tok)) intersection++;
    if (intersection === 0) continue;

    const overlap = intersection / Math.min(biomarkerTokens.size, tussTokens.size);
    const jac = intersection / (biomarkerTokens.size + tussTokens.size - intersection);
    const score = 0.7 * overlap + 0.3 * jac;

    const minMatch = biomarkerTokens.size <= 1 ? 1 : 2;
    if (intersection < minMatch && overlap < 1) continue;

    if (best === null || score > best.score) {
      best = { name: t.name, score, tuss: t.tuss };
    }
  }
  return best && best.score >= 0.5 ? best : null;
}

function grauOrder(grau: null | string): number {
  const g = grau ?? '?';
  if (g === '1') return 1;
  if (g === '2') return 2;
  if (g === '3') return 3;
  if (g === '4') return 4;
  if (g === '5') return 5;
  return 6;
}

function decideStatus(
  candidates: SigtapCandidate[],
  hasTuss: boolean,
): { selected: null | string; status: MappingStatus } {
  if (!hasTuss) return { selected: null, status: 'no_sigtap_match' };

  const mapped = candidates.filter((c) => c.status === 'Mapeado');
  const strong = mapped.filter((c) => c.equivalencia === '1' || c.equivalencia === '2');
  const weak = mapped.filter((c) => c.equivalencia === '3' || c.equivalencia === '4');

  if (strong.length === 1) return { selected: strong[0]!.sigtap, status: 'auto' };
  if (strong.length > 1) return { selected: null, status: 'ambiguous_strong' };
  if (weak.length >= 1) return { selected: null, status: 'ambiguous_weak' };
  return { selected: null, status: 'no_sigtap_match' };
}

function tokenize(s: string): string[] {
  const stop = new Set([
    'a',
    'de',
    'da',
    'do',
    'dos',
    'das',
    'e',
    'ou',
    'em',
    'no',
    'na',
    'nos',
    'nas',
    'para',
    'por',
    'com',
    'sem',
    'pesquisa',
    'dosagem',
    'determinacao',
    'nivel',
    'total',
    'exame',
  ]);
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2 && !stop.has(t));
}

function countByStatus(mapping: MappingEntry[]): Record<MappingStatus, number> {
  const counts: Record<MappingStatus, number> = {
    ambiguous_strong: 0,
    ambiguous_weak: 0,
    auto: 0,
    no_sigtap_match: 0,
  };
  for (const m of mapping) counts[m.status]++;
  return counts;
}

function renderReport(mapping: MappingEntry[], source: AnsEnvelope['_source']): string {
  const counts = countByStatus(mapping);
  const auto = mapping.filter((m) => m.status === 'auto');
  const ambStrong = mapping.filter((m) => m.status === 'ambiguous_strong');
  const ambWeak = mapping.filter((m) => m.status === 'ambiguous_weak');
  const noMatch = mapping.filter((m) => m.status === 'no_sigtap_match');

  const lines: string[] = [];
  lines.push('# Mapeamento Biomarcador (LOINC) → TUSS → SIGTAP');
  lines.push('');
  lines.push('Gerado por `scripts/build-sigtap-mapping.ts`.');
  lines.push('');
  lines.push('## Fonte');
  lines.push('');
  lines.push(`- **Arquivo:** \`${source.file}\``);
  lines.push(`- **Publicador:** ${source.publisher}`);
  lines.push(`- **Página de origem:** ${source.landing_page}`);
  lines.push(`- **Download direto:** ${source.url}`);
  lines.push(`- **Licença:** ${source.license}`);
  lines.push(`- **Competência:** ${source.competence ?? 'não identificada'}`);
  lines.push(`- **Extraído em:** ${source.extracted_at}`);
  lines.push('');
  lines.push(`> ${source.notice}`);
  lines.push('');
  lines.push('');
  lines.push(
    '**Escopo**: todos os biomarcadores visíveis em `biomarkers.ts` do ' +
      'fhir-brasil. TUSS encontrado via matching fuzzy por nome pt-BR contra ' +
      'os termos TUSS oficiais — o `BRTUSSProcedimentosLabVS.fsh` do ' +
      'fhir-brasil foi **ignorado** porque os códigos TUSS lá estão ' +
      'desalinhados com a tabela ANS (ver `fhir-brasil-tuss-audit.md`).',
  );
  lines.push('');

  lines.push('## Graus de equivalência (ANS/ISO TR 12300:2014)');
  lines.push('');
  lines.push('1. Léxico + conceitual idêntico');
  lines.push('2. Sinonímia (conceito igual, nomes diferentes)');
  lines.push('3. TUSS **menos específico** que SIGTAP (SIGTAP mais granular)');
  lines.push('4. TUSS **mais específico** que SIGTAP (TUSS mais granular)');
  lines.push('5. Sem mapeamento possível');
  lines.push('');

  lines.push('## Status');
  lines.push('');
  lines.push('- **`auto`** — 1 SIGTAP grau 1 ou 2. Revisão opcional.');
  lines.push(
    '- **`ambiguous_strong`** — múltiplos SIGTAPs grau 1 ou 2. ' +
      '**Ação**: escolher `selected` no JSON.',
  );
  lines.push(
    '- **`ambiguous_weak`** — só grau 3 ou 4 (relação hierárquica, 1-pra-N ou N-pra-1). ' +
      '**Ação**: avaliar se a relação é aceitável pro caso de uso.',
  );
  lines.push(
    '- **`no_sigtap_match`** — biomarcador sem TUSS identificado, ou TUSS ' +
      'com grau 5 apenas. Tipicamente exame privado/genético/não-SUS.',
  );
  lines.push('');

  lines.push(`- Biomarcadores totais: **${mapping.length}**`);
  lines.push(`- \`auto\`: **${counts.auto}**`);
  lines.push(`- \`ambiguous_strong\`: **${counts.ambiguous_strong}**`);
  lines.push(`- \`ambiguous_weak\`: **${counts.ambiguous_weak}**`);
  lines.push(`- \`no_sigtap_match\`: **${counts.no_sigtap_match}**`);
  lines.push('');

  lines.push('## `auto` — 1 SIGTAP grau 1 ou 2');
  lines.push('');
  lines.push('| Biomarcador | LOINC | TUSS | SIGTAP | Grau | Procedimento SIGTAP |');
  lines.push('|---|---|---|---|---|---|');
  for (const e of auto) {
    const c = e.candidates.find((x) => x.sigtap === e.selected)!;
    lines.push(
      `| ${e.biomarker_display} | ${e.loinc ?? '—'} | \`${e.tuss}\` | ` +
        `\`${c.sigtap}\` | ${c.equivalencia} | ${c.sigtap_name} |`,
    );
  }
  lines.push('');

  renderAmbSection(lines, ambStrong, 'ambiguous_strong', 'Múltiplos SIGTAPs grau 1 ou 2');
  renderAmbSection(lines, ambWeak, 'ambiguous_weak', 'Só grau 3 ou 4 (hierárquico)');

  lines.push('## `no_sigtap_match`');
  lines.push('');
  for (const e of noMatch) {
    const reason = e.tuss === null ? 'sem TUSS' : 'só grau 5';
    lines.push(`- ${e.biomarker_display} (LOINC ${e.loinc ?? '—'}) — _${reason}_`);
  }
  lines.push('');

  return lines.join('\n');
}

function renderAmbSection(
  lines: string[],
  entries: MappingEntry[],
  status: 'ambiguous_strong' | 'ambiguous_weak',
  title: string,
): void {
  lines.push(`## \`${status}\` — ${title}`);
  lines.push('');
  for (const e of entries) {
    lines.push(
      `### ${e.biomarker_display} (LOINC ${e.loinc ?? '—'}) — TUSS \`${e.tuss}\` (${e.tuss_name})`,
    );
    for (const c of e.candidates.filter((x) => x.status === 'Mapeado')) {
      lines.push(`- \`${c.sigtap}\` — ${c.sigtap_name} _(grau ${c.equivalencia ?? '—'})_`);
    }
    lines.push('');
  }
}

/**
 * Audita o BRTUSSProcedimentosLabVS.fsh contra a tabela oficial ANS.
 * Gera um relatório comparando, pra cada código TUSS no VS, o nome que o
 * fhir-brasil diz vs o nome oficial. Útil pra reportar/corrigir o VS.
 */
async function writeFhirBrasilAudit(
  ansRows: AnsMappingRow[],
  source: AnsEnvelope['_source'],
): Promise<void> {
  const vsContent = await readFile(TUSS_VS_FSH, 'utf8');
  const vsEntries: Array<{ code: string; name: string }> = [];
  for (const line of vsContent.split(/\r?\n/)) {
    const m = /^\*\s+\$TUSS#(\d+)\s+"([^"]+)"/.exec(line.trim());
    if (m) vsEntries.push({ code: m[1]!, name: m[2]!.trim() });
  }

  const ansByTussName = new Map<string, string>();
  for (const r of ansRows) {
    if (r.tuss && r.tuss_name && !ansByTussName.has(r.tuss)) {
      ansByTussName.set(r.tuss, r.tuss_name);
    }
  }

  const lines: string[] = [];
  lines.push('# Auditoria: BRTUSSProcedimentosLabVS.fsh vs ANS TUSS oficial');
  lines.push('');
  lines.push(
    'Gerado por `scripts/build-sigtap-mapping.ts`. Compara cada código TUSS ' +
      'declarado no ValueSet curado pelo fhir-brasil contra o termo oficial ' +
      `do mesmo código no arquivo \`${source.file}\` da ANS.`,
  );
  lines.push('');
  lines.push(`**Fonte autoritativa:** ${source.url}`);
  lines.push(`**Competência:** ${source.competence ?? 'não identificada'}`);
  lines.push('');
  lines.push(
    'Resultado esperado: os nomes devem ser iguais ou sinônimos. Se ' +
      'mismatches aparecerem, o VS do fhir-brasil está usando uma numeração ' +
      'TUSS diferente (possivelmente CBHPM ou tabela não-oficial). **Reporte ' +
      'ao time do fhir-brasil para correção.**',
  );
  lines.push('');

  let aligned = 0;
  let mismatched = 0;
  let missing = 0;
  const mismatchRows: string[] = [];

  for (const { code, name } of vsEntries) {
    const ansName = ansByTussName.get(code);
    if (!ansName) {
      missing++;
      mismatchRows.push(`| \`${code}\` | ${name} | _(ausente na ANS)_ | ❌ missing |`);
      continue;
    }
    if (namesLikelySame(name, ansName)) {
      aligned++;
    } else {
      mismatched++;
      mismatchRows.push(`| \`${code}\` | ${name} | ${ansName} | ❌ mismatch |`);
    }
  }

  lines.push(`- Entradas no VS: **${vsEntries.length}**`);
  lines.push(`- Alinhadas com ANS: **${aligned}**`);
  lines.push(`- Desalinhadas: **${mismatched}**`);
  lines.push(`- Ausentes na planilha ANS: **${missing}**`);
  lines.push('');

  if (mismatchRows.length > 0) {
    lines.push('## Mismatches');
    lines.push('');
    lines.push('| TUSS | Nome no fhir-brasil | Nome na ANS | Status |');
    lines.push('|---|---|---|---|');
    for (const r of mismatchRows) lines.push(r);
    lines.push('');
  }

  await writeFile(join(DATA_DIR, 'fhir-brasil-tuss-audit.md'), lines.join('\n'));
  console.error(
    `[audit] fhir-brasil VS: ${aligned} aligned, ${mismatched} mismatch, ${missing} missing`,
  );
}

function namesLikelySame(a: string, b: string): boolean {
  const ta = new Set(tokenize(a));
  const tb = new Set(tokenize(b));
  if (ta.size === 0 || tb.size === 0) return false;
  let intersection = 0;
  for (const t of ta) if (tb.has(t)) intersection++;
  const overlap = intersection / Math.min(ta.size, tb.size);
  return overlap >= 0.6;
}

async function safeStat(path: string): Promise<{ size: number } | null> {
  try {
    const s = await stat(path);
    return s.isFile() ? { size: s.size } : null;
  } catch {
    return null;
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

await main();
