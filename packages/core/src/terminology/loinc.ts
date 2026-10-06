/**
 * Mapeamento LOINC → TUSS → SIGTAP para biomarcadores laboratoriais.
 *
 * Fonte dos dados: pipeline de fuzzy matching (TUSS↔SIGTAP oficial da ANS
 * + catálogo SIGTAP completo + 164 biomarcadores LOINC do
 * `@precisa-saude/fhir`) refinada por Gemini 3.1 Pro via OpenRouter pra
 * resolver colisões (ex: Apo A × Apo B com mesmo score fuzzy), seguida
 * de revisão manual (entradas com `review` no JSON) que corrigiu LOINCs,
 * acrescentou biomarcadores e elegeu o representante de cada SIGTAP
 * compartilhado no sentido reverso.
 *
 * Use este módulo quando o app tiver um biomarcador FHIR em mãos e
 * precisar do código SIGTAP equivalente pra cruzar com SIA-SUS.
 */

import rawData from './data/loinc-biomarkers.json';
import type { LoincMapping } from './types.js';

interface RawLlmDecision {
  confidence: null | string;
  no_match_reason: null | string;
  reasoning: string;
  selected_sigtap: null | string;
  selected_tuss: null | string;
}

interface RawReview {
  date: string;
  note: string;
}

interface RawLoincEntry {
  biomarker_code: string;
  biomarker_display: string;
  llm: RawLlmDecision;
  loinc: null | string;
  /**
   * Explícito só quando o SIGTAP é compartilhado por mais de um
   * biomarcador (ou quando a entrada deve ficar fora do sentido reverso).
   * Ausente = representante único do seu SIGTAP.
   */
  reverse_primary?: boolean;
  review?: RawReview;
  sigtap_also?: string[];
}

interface RawLoincFile {
  mapping: RawLoincEntry[];
}

const raw = rawData as RawLoincFile;

function normalizeConfidence(value: null | string): LoincMapping['confidence'] {
  if (value === 'high' || value === 'medium' || value === 'low') return value;
  return null;
}

function toMapping(entry: RawLoincEntry, reversePrimary: boolean): LoincMapping {
  return {
    biomarker: { code: entry.biomarker_code, display: entry.biomarker_display },
    confidence: normalizeConfidence(entry.llm.confidence),
    loinc: entry.loinc,
    noMatchReason: entry.llm.no_match_reason,
    reasoning: entry.llm.reasoning,
    reversePrimary,
    reviewNote: entry.review?.note ?? null,
    sigtap: entry.llm.selected_sigtap,
    sigtapAlso: entry.sigtap_also ?? [],
    source: entry.review === undefined ? 'llm-refined' : 'manual-review',
    tuss: entry.llm.selected_tuss,
  };
}

function sigtapsOf(entry: RawLoincEntry): string[] {
  const all = [entry.llm.selected_sigtap, ...(entry.sigtap_also ?? [])];
  return all.filter((s): s is string => s !== null);
}

// Quantos biomarcadores apontam para cada SIGTAP. Decide, junto com
// `reverse_primary`, quem representa o SIGTAP no sentido reverso: uma
// entrada sem flag só é representante quando está sozinha no seu SIGTAP.
const sigtapShareCount = new Map<string, number>();
for (const entry of raw.mapping) {
  for (const s of sigtapsOf(entry)) sigtapShareCount.set(s, (sigtapShareCount.get(s) ?? 0) + 1);
}

function isReversePrimary(entry: RawLoincEntry): boolean {
  if (entry.reverse_primary !== undefined) return entry.reverse_primary;
  return sigtapsOf(entry).every((s) => sigtapShareCount.get(s) === 1);
}

const byLoinc = new Map<string, LoincMapping>();
const byBiomarkerCode = new Map<string, LoincMapping>();
const bySigtap = new Map<string, LoincMapping>();

for (const entry of raw.mapping) {
  const mapping = toMapping(entry, isReversePrimary(entry));
  if (mapping.loinc !== null) byLoinc.set(mapping.loinc, mapping);
  byBiomarkerCode.set(mapping.biomarker.code, mapping);
  if (!mapping.reversePrimary) continue;
  for (const s of sigtapsOf(entry)) {
    const previous = bySigtap.get(s);
    if (previous !== undefined) {
      // Dado inválido: dois representantes para o mesmo SIGTAP tornariam
      // o sentido reverso dependente da ordem do arquivo — exatamente o
      // bug que `reverse_primary` existe para impedir.
      throw new Error(
        `loinc-biomarkers.json: SIGTAP ${s} tem dois representantes reversos ` +
          `(${previous.biomarker.code} e ${mapping.biomarker.code})`,
      );
    }
    bySigtap.set(s, mapping);
  }
}

/**
 * Retorna o mapeamento LOINC → TUSS/SIGTAP refinado pelo LLM.
 *
 * Aceita o código LOINC canônico (ex: `"2085-9"`) ou o código curto do
 * biomarcador (`"HDL"`). Retorna `null` se não houver entrada no
 * catálogo. Um mapeamento presente com `sigtap === null` indica que o
 * LLM analisou mas decidiu "sem equivalente SIGTAP confiável" —
 * diferente de não conhecer o biomarcador (consulte `noMatchReason`).
 */
export function loincToSigtap(code: string): LoincMapping | null {
  const trimmed = code.trim();
  if (trimmed === '') return null;
  return byLoinc.get(trimmed) ?? byBiomarkerCode.get(trimmed) ?? null;
}

/**
 * Retorna o mapeamento LOINC correspondente a um código SIGTAP, quando
 * houver. Útil para enriquecer registros SIA-SUS (onde o eixo de join
 * é SIGTAP) com o biomarcador e o LOINC equivalente.
 *
 * Quando vários biomarcadores apontam para o mesmo SIGTAP, volta o que
 * tem `reversePrimary` — o que descreve o que o procedimento SUS mede
 * (ex: "Dosagem de glicose" → glicose sérica 2345-7, não glicose na
 * urina). SIGTAPs cujo grupo não elegeu representante (ex: IgE
 * alérgeno-específica) retornam `null` mesmo tendo mapeamentos no
 * sentido LOINC → SIGTAP.
 *
 * Aceita o código SIGTAP com ou sem zeros à esquerda (a tabela usa
 * sempre 10 dígitos como chave canônica). Retorna `null` se o SIGTAP
 * não estiver mapeado a nenhum LOINC no catálogo.
 */
export function sigtapToLoinc(sigtap: string): LoincMapping | null {
  const trimmed = sigtap.trim();
  if (trimmed === '') return null;
  return bySigtap.get(trimmed) ?? bySigtap.get(trimmed.padStart(10, '0')) ?? null;
}

/** Lista todos os biomarcadores do catálogo (imutável). */
export function listBiomarkers(): readonly LoincMapping[] {
  return Array.from(byBiomarkerCode.values());
}
