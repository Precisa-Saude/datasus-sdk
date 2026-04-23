/**
 * Mapeamento LOINC → TUSS → SIGTAP para biomarcadores laboratoriais.
 *
 * Fonte dos dados: pipeline de fuzzy matching (TUSS↔SIGTAP oficial da ANS
 * + catálogo SIGTAP completo + 164 biomarcadores LOINC do
 * `@precisa-saude/fhir`) refinada por Gemini 3.1 Pro via OpenRouter pra
 * resolver colisões (ex: Apo A × Apo B com mesmo score fuzzy).
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

interface RawLoincEntry {
  biomarker_code: string;
  biomarker_display: string;
  llm: RawLlmDecision;
  loinc: null | string;
}

interface RawLoincFile {
  mapping: RawLoincEntry[];
}

const raw = rawData as RawLoincFile;

function normalizeConfidence(value: null | string): LoincMapping['confidence'] {
  if (value === 'high' || value === 'medium' || value === 'low') return value;
  return null;
}

function toMapping(entry: RawLoincEntry): LoincMapping {
  return {
    biomarker: { code: entry.biomarker_code, display: entry.biomarker_display },
    confidence: normalizeConfidence(entry.llm.confidence),
    loinc: entry.loinc,
    noMatchReason: entry.llm.no_match_reason,
    reasoning: entry.llm.reasoning,
    sigtap: entry.llm.selected_sigtap,
    source: 'llm-refined',
    tuss: entry.llm.selected_tuss,
  };
}

const byLoinc = new Map<string, LoincMapping>();
const byBiomarkerCode = new Map<string, LoincMapping>();
const bySigtap = new Map<string, LoincMapping>();

for (const entry of raw.mapping) {
  const mapping = toMapping(entry);
  if (mapping.loinc !== null) byLoinc.set(mapping.loinc, mapping);
  byBiomarkerCode.set(mapping.biomarker.code, mapping);
  if (mapping.sigtap !== null) bySigtap.set(mapping.sigtap, mapping);
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
