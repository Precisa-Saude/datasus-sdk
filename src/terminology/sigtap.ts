/**
 * Lookup de procedimentos SIGTAP (Sistema de Gerenciamento da Tabela de
 * Procedimentos, Medicamentos e OPM do SUS).
 *
 * Fonte: tabela SIGTAP completa baixada do FTP DATASUS, competência mais
 * recente disponível quando o pacote foi gerado.
 */

import rawData from './data/sigtap.json';
import type { SigtapProcedure } from './types.js';

type RawSigtapRow = { code: string; name: string };

const raw = rawData as readonly RawSigtapRow[];

const byCode = new Map<string, SigtapProcedure>();
for (const row of raw) byCode.set(row.code, row);

/**
 * Busca um procedimento SIGTAP pelo código de 10 dígitos.
 *
 * Aceita o código com ou sem zeros à esquerda implícitos; a tabela usa
 * sempre 10 dígitos como chave canônica.
 */
export function lookupSigtap(code: string): SigtapProcedure | null {
  const trimmed = code.trim();
  if (trimmed === '') return null;
  return byCode.get(trimmed) ?? byCode.get(trimmed.padStart(10, '0')) ?? null;
}
