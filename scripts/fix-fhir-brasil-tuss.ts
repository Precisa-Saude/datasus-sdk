/**
 * Gera uma versão corrigida do `BRTUSSProcedimentosLabVS.fsh` do fhir-brasil
 * usando os códigos TUSS oficiais da planilha ANS 2017/04 como verdade.
 *
 * ## Por que
 *
 * O VS atual tem 57/59 códigos TUSS desalinhados com a tabela oficial ANS
 * (provavelmente usou numeração CBHPM ou portal de laboratório privado).
 * Este script mantém os nomes exibíveis declarados pelo fhir-brasil mas
 * substitui cada código pelo TUSS oficial correspondente, encontrado via
 * matching fuzzy por nome contra `ans-tuss-sigtap-oficial.json`.
 *
 * ## Saída
 *
 *   packages/core/data/BRTUSSProcedimentosLabVS.fixed.fsh
 *     VS corrigido, pronto pra ser copiado sobre o original num PR ao
 *     fhir-brasil. Cada linha tem comentário indicando se foi `verified`,
 *     `fixed` ou `needs-review` (sem match confiável encontrado).
 *
 *   packages/core/data/BRTUSSProcedimentosLabVS.diff.md
 *     Resumo humano-legível das mudanças.
 *
 * ## Uso
 *
 *   pnpm -F @precisa-saude/datasus run fix:fhir-brasil-tuss
 *
 * Pré-requisito: `data/ans-tuss-sigtap-oficial.json` gerado por
 * `scripts/extract-ans-xlsx.ts`.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const CORE_ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const MONOREPO_ROOT = resolve(CORE_ROOT, '..', '..');
const PRECISA_ROOT = resolve(MONOREPO_ROOT, '..');
const DATA_DIR = join(CORE_ROOT, 'data');
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
const OUT_FSH = join(DATA_DIR, 'BRTUSSProcedimentosLabVS.fixed.fsh');
const OUT_DIFF = join(DATA_DIR, 'BRTUSSProcedimentosLabVS.diff.md');

interface AnsRow {
  tuss: null | string;
  tuss_name: null | string;
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
  rows: AnsRow[];
}

type EntryAction = 'fixed' | 'needs-review' | 'verified';

interface FixedEntry {
  action: EntryAction;
  ans_name: null | string;
  confidence: null | number;
  display: string;
  new_tuss: string;
  original_tuss: string;
}

async function main(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });

  const source = await readFile(TUSS_VS_FSH, 'utf8');
  const ansEnvelope = JSON.parse(await readFile(ANS_OFFICIAL_JSON, 'utf8')) as AnsEnvelope;
  const ans = ansEnvelope.rows;
  const ansSource = ansEnvelope._source;

  const tussUniverse = extractUniqueTuss(ans);
  // Lookup reverso por código TUSS (pra saber o nome oficial de um código já declarado)
  const ansByCode = new Map<string, string>();
  for (const entry of tussUniverse) {
    ansByCode.set(entry.tuss, entry.name);
  }
  console.error(`[ans] ${tussUniverse.length} TUSS únicos carregados.`);

  const lines = source.split(/\r?\n/);
  const outLines: string[] = [];
  const fixed: FixedEntry[] = [];

  const entryRe = /^\*\s+\$TUSS#(\d+)\s+"([^"]+)"\s*(\/\/.*)?$/;

  for (const line of lines) {
    const m = entryRe.exec(line.trim());
    if (!m) {
      outLines.push(line);
      continue;
    }

    const originalTuss = m[1]!;
    const display = m[2]!;

    const ansNameForOriginalCode = ansByCode.get(originalTuss);
    const originalAligned =
      ansNameForOriginalCode !== undefined &&
      namesMatchScore(display, ansNameForOriginalCode) >= 0.6;

    if (originalAligned) {
      outLines.push(`* $TUSS#${originalTuss} "${display}"   // verified`);
      fixed.push({
        action: 'verified',
        ans_name: ansNameForOriginalCode ?? null,
        confidence: 1,
        display,
        new_tuss: originalTuss,
        original_tuss: originalTuss,
      });
      continue;
    }

    // Código original errado — buscar o correto pelo display
    const best = findBestTussByName(display, tussUniverse);
    if (best === null) {
      outLines.push(
        `// * $TUSS#${originalTuss} "${display}"   // needs-review: sem match ANS confiável`,
      );
      fixed.push({
        action: 'needs-review',
        ans_name: null,
        confidence: null,
        display,
        new_tuss: originalTuss,
        original_tuss: originalTuss,
      });
      continue;
    }

    outLines.push(
      `* $TUSS#${best.tuss} "${display}"   // fixed from ${originalTuss} — ANS: "${best.name}" (score ${best.score.toFixed(2)})`,
    );
    fixed.push({
      action: 'fixed',
      ans_name: best.name,
      confidence: best.score,
      display,
      new_tuss: best.tuss,
      original_tuss: originalTuss,
    });
  }

  const fshHeader = [
    '// ============================================================',
    '// BRTUSSProcedimentosLabVS — VERSÃO CORRIGIDA (candidata)',
    '//',
    '// Gerada por `scripts/fix-fhir-brasil-tuss.ts` no repo',
    '// datasus-brasil. Códigos TUSS foram realinhados usando a tabela',
    '// oficial publicada pela ANS como fonte autoritativa.',
    '//',
    `// Fonte: ${ansSource.url}`,
    `// Publicador: ${ansSource.publisher}`,
    `// Competência: ${ansSource.competence ?? 'não identificada'}`,
    `// Arquivo: ${ansSource.file}`,
    `// Licença: ${ansSource.license}`,
    `// Regerado em: ${new Date().toISOString()}`,
    '//',
    '// Ver `data/BRTUSSProcedimentosLabVS.diff.md` para resumo das mudanças.',
    '// ============================================================',
    '',
  ];
  await writeFile(OUT_FSH, [...fshHeader, ...outLines].join('\n'));
  await writeFile(OUT_DIFF, renderDiff(fixed, ansSource));

  const summary = {
    fixed: fixed.filter((e) => e.action === 'fixed').length,
    needsReview: fixed.filter((e) => e.action === 'needs-review').length,
    total: fixed.length,
    verified: fixed.filter((e) => e.action === 'verified').length,
  };
  console.error(
    `[fix] ${summary.verified} verified / ${summary.fixed} fixed / ` +
      `${summary.needsReview} needs-review (total ${summary.total}).`,
  );
  console.error(`[output] ${OUT_FSH}`);
  console.error(`[output] ${OUT_DIFF}`);
}

function extractUniqueTuss(rows: AnsRow[]): Array<{ name: string; tuss: string }> {
  const seen = new Map<string, string>();
  for (const r of rows) {
    if (r.tuss === null || r.tuss_name === null) continue;
    if (!seen.has(r.tuss)) seen.set(r.tuss, r.tuss_name);
  }
  return Array.from(seen, ([tuss, name]) => ({ name, tuss }));
}

function findBestTussByName(
  displayName: string,
  universe: Array<{ name: string; tuss: string }>,
): { name: string; score: number; tuss: string } | null {
  const displayTokens = new Set(tokenize(displayName));
  if (displayTokens.size === 0) return null;

  let best: { name: string; score: number; tuss: string } | null = null;
  for (const { name, tuss } of universe) {
    const tussTokens = new Set(tokenize(name));
    if (tussTokens.size === 0) continue;
    let intersection = 0;
    for (const t of displayTokens) if (tussTokens.has(t)) intersection++;
    if (intersection === 0) continue;

    const overlap = intersection / Math.min(displayTokens.size, tussTokens.size);
    const jac = intersection / (displayTokens.size + tussTokens.size - intersection);
    const score = 0.7 * overlap + 0.3 * jac;

    const minMatch = displayTokens.size <= 1 ? 1 : 2;
    if (intersection < minMatch && overlap < 1) continue;

    if (best === null || score > best.score) best = { name, score, tuss };
  }
  return best && best.score >= 0.55 ? best : null;
}

function namesMatchScore(a: string, b: string): number {
  const ta = new Set(tokenize(a));
  const tb = new Set(tokenize(b));
  if (ta.size === 0 || tb.size === 0) return 0;
  let intersection = 0;
  for (const t of ta) if (tb.has(t)) intersection++;
  return intersection / Math.min(ta.size, tb.size);
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
    'tipo',
  ]);
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2 && !stop.has(t));
}

function renderDiff(entries: FixedEntry[], source: AnsEnvelope['_source']): string {
  const fixed = entries.filter((e) => e.action === 'fixed');
  const verified = entries.filter((e) => e.action === 'verified');
  const needs = entries.filter((e) => e.action === 'needs-review');

  const lines: string[] = [];
  lines.push('# BRTUSSProcedimentosLabVS — códigos TUSS corrigidos');
  lines.push('');
  lines.push('Gerado por `scripts/fix-fhir-brasil-tuss.ts`.');
  lines.push('');
  lines.push('## Fonte autoritativa');
  lines.push('');
  lines.push(`- **Arquivo:** \`${source.file}\``);
  lines.push(`- **Publicador:** ${source.publisher}`);
  lines.push(`- **Página de origem:** ${source.landing_page}`);
  lines.push(`- **Download direto:** ${source.url}`);
  lines.push(`- **Licença:** ${source.license}`);
  lines.push(`- **Competência:** ${source.competence ?? 'não identificada'}`);
  lines.push('');
  lines.push(`> ${source.notice}`);
  lines.push('');
  lines.push(
    'Compara cada entrada `* $TUSS#CODE "Display"` contra a tabela ANS oficial. ' +
      'Quando o `CODE` não bate com o nome oficial desse TUSS na ANS, busca ' +
      'por nome pra achar o código correto.',
  );
  lines.push('');
  lines.push(`- Total de entradas: **${entries.length}**`);
  lines.push(`- \`verified\` (código original correto): **${verified.length}**`);
  lines.push(`- \`fixed\` (código substituído): **${fixed.length}**`);
  lines.push(`- \`needs-review\` (sem match confiável): **${needs.length}**`);
  lines.push('');

  if (fixed.length > 0) {
    lines.push('## `fixed` — códigos TUSS substituídos');
    lines.push('');
    lines.push(
      '| Display (fhir-brasil) | TUSS antigo | TUSS novo | Nome oficial ANS | Confiança |',
    );
    lines.push('|---|---|---|---|---|');
    for (const e of fixed) {
      lines.push(
        `| ${e.display} | \`${e.original_tuss}\` | \`${e.new_tuss}\` | ${e.ans_name ?? '—'} | ${(e.confidence ?? 0).toFixed(2)} |`,
      );
    }
    lines.push('');
  }

  if (needs.length > 0) {
    lines.push('## `needs-review` — sem correspondência ANS confiável');
    lines.push('');
    lines.push(
      'Nenhum TUSS oficial teve nome suficientemente próximo do display. ' +
        'Comentadas no `.fsh.fixed` — decidir manualmente se o código ' +
        'original está certo, se o nome precisa virar mais claro, ou se o ' +
        'biomarcador deve ser removido do VS.',
    );
    lines.push('');
    for (const e of needs) {
      lines.push(`- ${e.display} (TUSS original \`${e.original_tuss}\`)`);
    }
    lines.push('');
  }

  if (verified.length > 0) {
    lines.push('## `verified` — códigos confirmados sem mudança');
    lines.push('');
    for (const e of verified) {
      lines.push(`- ${e.display} — TUSS \`${e.original_tuss}\``);
    }
    lines.push('');
  }

  return lines.join('\n');
}

await main();
