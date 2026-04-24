/**
 * Lookup de procedimentos TUSS (Terminologia Unificada da Saúde
 * Suplementar — ANS) com os procedimentos SIGTAP equivalentes.
 *
 * Fonte: mapeamento oficial ANS × SUS, competência 2017-04. Trabalho
 * conjunto ANS + COPISS + Ministério da Saúde baseado em ISO/TR
 * 12300:2014. É o último mapeamento publicado oficialmente.
 */

import rawData from './data/ans-tuss-sigtap.json';
import type { SigtapEquivalent, TussProcedure } from './types.js';

interface RawAnsRow {
  grau_equivalencia: string;
  sigtap: string;
  sigtap_name: string;
  situacao: null | string;
  status: null | string;
  tuss: string;
  tuss_name: string;
}

interface RawAnsFile {
  rows: RawAnsRow[];
}

const raw = rawData as RawAnsFile;

const byCode = new Map<string, TussProcedure>();

for (const row of raw.rows) {
  let entry = byCode.get(row.tuss);
  if (!entry) {
    entry = { code: row.tuss, name: row.tuss_name, sigtapEquivalents: [] };
    byCode.set(row.tuss, entry);
  }
  const equivalent: SigtapEquivalent = {
    code: row.sigtap,
    equivalencia: row.grau_equivalencia,
    name: row.sigtap_name,
  };
  (entry.sigtapEquivalents as SigtapEquivalent[]).push(equivalent);
}

/**
 * Busca um procedimento TUSS pelo código de 8 dígitos e retorna o
 * procedimento com todos os SIGTAP equivalentes publicados pela ANS.
 */
export function lookupTuss(code: string): TussProcedure | null {
  const trimmed = code.trim();
  if (trimmed === '') return null;
  return byCode.get(trimmed) ?? null;
}
