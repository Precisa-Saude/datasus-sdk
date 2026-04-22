/**
 * Extrai o mapeamento oficial TUSS x SIGTAP publicado pela ANS em formato
 * XLSX para JSON consumível pelo build-sigtap-mapping.ts.
 *
 * Fluxo: baixa o zip via curl → unzip → parser OOXML mínimo em TS puro
 * (sem libs externas) → JSON.
 *
 * Fonte:
 *   https://www.gov.br/ans/.../padraotiss_mapeamento_tuss_sigtap.zip
 *     → MAPEAMENTO TUSS x SIGTAP 2017 04.xlsx
 *
 * One-shot: rode quando a ANS publicar nova competência.
 *
 * Uso:
 *   pnpm -F @precisa-saude/datasus run build:ans-mapping
 *
 * Saída: `packages/core/data/ans-tuss-sigtap-oficial.json`
 *
 * Colunas do "Mapeamento ativos" (sheet1):
 *   A  Código TUSS (8 dígitos)
 *   B  Termo TUSS
 *   C  Código Sigtap Final (10 dígitos, zero-pad manual)
 *   D  Procedimento Sigtap Final
 *   E  Status Final ("Mapeado", "Não mapeado", ...)
 *   F  Grau de equivalência (1-5 conforme ISO/TR 12300:2014)
 *     1 = léxico + conceitual idêntico
 *     2 = sinonímia
 *     3 = TUSS menos específico que SIGTAP
 *     4 = TUSS mais específico que SIGTAP
 *     5 = sem mapeamento possível
 *   G  Situação do Mapeamento (frequentemente vazio)
 */

import { execFileSync } from 'node:child_process';
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const CORE_ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const MONOREPO_ROOT = resolve(CORE_ROOT, '..', '..');
const CACHE_DIR = join(MONOREPO_ROOT, '.cache', 'ans-tuss-sigtap');
const DATA_DIR = join(CORE_ROOT, 'data');
const OUT_PATH = join(DATA_DIR, 'ans-tuss-sigtap-oficial.json');

const ANS_ZIP_URL =
  'https://www.gov.br/ans/pt-br/arquivos/assuntos/prestadores/' +
  'padrao-para-troca-de-informacao-de-saude-suplementar-tiss/' +
  'padrao-tiss-tabelas-relacionadas/padraotiss_mapeamento_tuss_sigtap.zip';

const ANS_LANDING_PAGE =
  'https://www.gov.br/ans/pt-br/assuntos/prestadores/' +
  'padrao-para-troca-de-informacao-de-saude-suplementar-2013-tiss/' +
  'padrao-tiss-tabelas-relacionadas';

const ANS_XLSX_FILENAME = 'MAPEAMENTO TUSS x SIGTAP 2017 04.xlsx';

interface AnsRow {
  grau_equivalencia: null | string;
  sigtap: null | string;
  sigtap_name: null | string;
  situacao: null | string;
  status: null | string;
  tuss: null | string;
  tuss_name: null | string;
}

async function main(): Promise<void> {
  await mkdir(CACHE_DIR, { recursive: true });
  await mkdir(DATA_DIR, { recursive: true });

  const zipPath = await downloadZip();
  const xlsxPath = await extractXlsxFromZip(zipPath);
  const extractedDir = await extractXlsxContents(xlsxPath);

  const sharedStrings = await loadSharedStrings(join(extractedDir, 'xl', 'sharedStrings.xml'));
  console.error(`[xlsx] ${sharedStrings.length} shared strings`);

  const rows = await parseSheet1(
    join(extractedDir, 'xl', 'worksheets', 'sheet1.xml'),
    sharedStrings,
  );
  console.error(`[xlsx] ${rows.length} mapping rows`);

  let mapeado = 0;
  const byGrau: Record<string, number> = {};
  for (const r of rows) {
    if (r.status === 'Mapeado') mapeado++;
    const g = r.grau_equivalencia ?? '?';
    byGrau[g] = (byGrau[g] ?? 0) + 1;
  }
  console.error(`[xlsx] status=Mapeado: ${mapeado}/${rows.length}`);
  console.error(`[xlsx] grau distribution: ${JSON.stringify(byGrau)}`);

  const envelope = {
    _source: {
      competence: extractCompetenceFromFilename(ANS_XLSX_FILENAME),
      extracted_at: new Date().toISOString(),
      extractor: 'packages/core/scripts/extract-ans-xlsx.ts',
      file: ANS_XLSX_FILENAME,
      landing_page: ANS_LANDING_PAGE,
      license: 'Dado aberto — Lei de Acesso à Informação (Lei 12.527/2011)',
      notice:
        'Trabalho conjunto ANS (Agência Nacional de Saúde Suplementar) + COPISS + ' +
        'Ministério da Saúde, conduzido de 2015 a 2017 (baseado em ISO/TR 12300:2014). ' +
        'A versão em uso é a competência 2017-04.',
      publisher: 'Agência Nacional de Saúde Suplementar (ANS)',
      url: ANS_ZIP_URL,
    },
    rows,
  };
  await writeFile(OUT_PATH, `${JSON.stringify(envelope, null, 2)}\n`);
  console.error(`[xlsx] wrote ${OUT_PATH}`);
}

function extractCompetenceFromFilename(name: string): null | string {
  const m = /(\d{4})\s*(\d{2})/.exec(name);
  return m ? `${m[1]}-${m[2]}` : null;
}

async function downloadZip(): Promise<string> {
  const zipPath = join(CACHE_DIR, 'padraotiss_mapeamento_tuss_sigtap.zip');
  const existing = await safeStat(zipPath);
  if (existing && existing.size > 1000) {
    console.error(`[http] cache hit: ${zipPath}`);
    return zipPath;
  }
  console.error(`[http] baixando ${ANS_ZIP_URL}...`);
  execFileSync('curl', ['-sSL', '-o', zipPath, ANS_ZIP_URL], { stdio: 'inherit' });
  return zipPath;
}

async function extractXlsxFromZip(zipPath: string): Promise<string> {
  const outDir = join(CACHE_DIR, 'zip-content');
  await rm(outDir, { force: true, recursive: true });
  await mkdir(outDir, { recursive: true });
  execFileSync('unzip', ['-o', '-q', zipPath, '-d', outDir], { stdio: 'inherit' });

  const entries = await readdir(outDir);
  const xlsx = entries.find((e) => e.toLowerCase().endsWith('.xlsx'));
  if (!xlsx) throw new Error('XLSX não encontrado dentro do zip ANS.');
  return join(outDir, xlsx);
}

async function extractXlsxContents(xlsxPath: string): Promise<string> {
  const outDir = join(CACHE_DIR, 'xlsx-content');
  await rm(outDir, { force: true, recursive: true });
  await mkdir(outDir, { recursive: true });
  execFileSync('unzip', ['-o', '-q', xlsxPath, '-d', outDir], { stdio: 'inherit' });
  return outDir;
}

/**
 * Parser OOXML sharedStrings.xml mínimo. Cada `<si>` é uma entrada (com
 * possível rich text via múltiplos `<t>`). Entidades XML decodificadas.
 */
async function loadSharedStrings(path: string): Promise<string[]> {
  const xml = await readFile(path, 'utf8');
  const strings: string[] = [];
  const siRe = /<si\b[^>]*>([\s\S]*?)<\/si>/g;
  const tRe = /<t\b[^>]*>([\s\S]*?)<\/t>/g;
  let siMatch;
  while ((siMatch = siRe.exec(xml))) {
    const inner = siMatch[1] ?? '';
    let text = '';
    let tMatch;
    while ((tMatch = tRe.exec(inner))) {
      text += decodeXmlEntities(tMatch[1] ?? '');
    }
    strings.push(text);
  }
  return strings;
}

/**
 * Parser OOXML worksheet mínimo. Duas formas de célula:
 *   <c r="A1" t="s"><v>42</v></c>   — string via índice em sharedStrings
 *   <c r="A1"><v>3.14</v></c>       — número (tipo default)
 *   <c r="A1" t="inlineStr"><is><t>x</t></is></c>
 *   <c r="A1"/>                     — célula vazia
 */
async function parseSheet1(path: string, strings: string[]): Promise<AnsRow[]> {
  const xml = await readFile(path, 'utf8');
  const rowRe = /<row\b[^>]*>([\s\S]*?)<\/row>/g;
  const cellRe = /<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g;

  const rawRows: Array<(null | string)[]> = [];
  let rowMatch;
  while ((rowMatch = rowRe.exec(xml))) {
    const cells: (null | string)[] = [];
    const inner = rowMatch[1] ?? '';
    let cellMatch;
    while ((cellMatch = cellRe.exec(inner))) {
      const attrs = cellMatch[1] ?? '';
      const body = cellMatch[2];
      const rMatch = /r="([^"]+)"/.exec(attrs);
      const tMatch = /t="([^"]+)"/.exec(attrs);
      if (!rMatch) continue;
      const col = colFromRef(rMatch[1]!);
      const type = tMatch ? tMatch[1] : 'n';

      let value: null | string = null;
      if (body !== undefined) {
        if (type === 'inlineStr') {
          const m = /<t\b[^>]*>([\s\S]*?)<\/t>/.exec(body);
          value = m ? decodeXmlEntities(m[1]!) : null;
        } else {
          const vMatch = /<v>([\s\S]*?)<\/v>/.exec(body);
          if (vMatch) {
            const raw = decodeXmlEntities(vMatch[1]!);
            if (type === 's') {
              value = strings[Number.parseInt(raw, 10)] ?? null;
            } else if (type === 'b') {
              value = raw === '1' ? 'TRUE' : 'FALSE';
            } else {
              value = raw;
            }
          }
        }
      }
      cells[col] = value;
    }
    rawRows.push(cells);
  }

  // Primeira linha é cabeçalho; descartar.
  const dataRows = rawRows.slice(1);

  return dataRows.map((cells): AnsRow => {
    let sigtap = cells[2] ?? null;
    // SIGTAP vem como número em algumas células; perde zero inicial. Zero-pad 10.
    if (sigtap !== null && /^\d+$/.test(sigtap) && sigtap.length < 10) {
      sigtap = sigtap.padStart(10, '0');
    }
    return {
      grau_equivalencia: cells[5] ?? null,
      sigtap,
      sigtap_name: cells[3] ?? null,
      situacao: cells[6] ?? null,
      status: cells[4] ?? null,
      tuss: cells[0] ?? null,
      tuss_name: cells[1] ?? null,
    };
  });
}

function colFromRef(ref: string): number {
  const m = /^([A-Z]+)/.exec(ref);
  if (!m) return 0;
  let col = 0;
  for (const ch of m[1]!) {
    col = col * 26 + (ch.charCodeAt(0) - 64);
  }
  return col - 1;
}

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h: string) => String.fromCodePoint(Number.parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(Number.parseInt(d, 10)))
    .replace(/&amp;/g, '&');
}

async function safeStat(path: string): Promise<{ size: number } | null> {
  try {
    const s = await stat(path);
    return s.isFile() ? { size: s.size } : null;
  } catch {
    return null;
  }
}

await main();
