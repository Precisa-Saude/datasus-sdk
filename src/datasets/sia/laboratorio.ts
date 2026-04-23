/**
 * Helpers opt-in para filtrar exames laboratoriais e enriquecer
 * registros SIA-PA com mapeamento LOINC.
 *
 * Mantidos fora de `load.ts`/`label.ts` para preservar o contrato
 * "load retorna raw, label retorna projeção pt-BR" — consumidores que
 * não precisam de LOINC não pagam custo de enrichment.
 */

import { sigtapToLoinc } from '../../terminology/loinc.js';
import type { LoincMapping } from '../../terminology/types.js';
import type { SiaProducaoAmbulatorialRecord } from './types.js';

/**
 * Grupo SIGTAP `02.02 — Diagnóstico em Laboratório Clínico`. Todo
 * código SIGTAP de laboratório começa com esses 4 dígitos.
 */
const SIGTAP_PREFIX_LABORATORIO = '0202';

/**
 * `true` sse o código SIGTAP pertence ao grupo 02.02 (Diagnóstico em
 * Laboratório Clínico). Aceita códigos com ou sem zeros à esquerda.
 */
export function isSigtapLaboratorio(procId: null | string | undefined): boolean {
  if (!procId) return false;
  const trimmed = String(procId).trim();
  if (trimmed === '') return false;
  const padded = trimmed.padStart(10, '0');
  return padded.startsWith(SIGTAP_PREFIX_LABORATORIO);
}

/**
 * Enriquece um registro SIA-PA com o mapeamento LOINC correspondente
 * ao `PA_PROC_ID`, quando houver. `loinc = null` significa "SIGTAP sem
 * equivalente LOINC conhecido no catálogo" — não é um erro.
 */
export function enrichWithLoinc<R extends { PA_PROC_ID?: unknown }>(
  record: R,
): R & { loinc: LoincMapping | null } {
  const procId = record.PA_PROC_ID;
  const mapping = typeof procId === 'string' && procId !== '' ? sigtapToLoinc(procId) : null;
  return { ...record, loinc: mapping };
}

/**
 * Filtra um stream/iterable para reter apenas registros de laboratório
 * (SIGTAP `02.02.*`). Mantém memória constante — não bufferiza.
 */
export async function* filterLaboratorio(
  source: AsyncIterable<SiaProducaoAmbulatorialRecord>,
): AsyncIterable<SiaProducaoAmbulatorialRecord> {
  for await (const record of source) {
    if (isSigtapLaboratorio(record.PA_PROC_ID)) yield record;
  }
}
