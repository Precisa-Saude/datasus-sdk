/**
 * Tabela de sexo usada no SIA-SUS (campo `PA_SEXO`).
 *
 * DATASUS grava `M`/`F` para valores informados e `0` (ou string vazia)
 * para não informado. Algumas vintages antigas também usam `I`.
 */

const SEXO: Record<string, string> = {
  '0': 'Não informado',
  F: 'Feminino',
  I: 'Não informado',
  M: 'Masculino',
};

export function labelSexo(code: null | string | undefined): null | string {
  if (!code) return null;
  const trimmed = String(code).trim().toUpperCase();
  if (trimmed === '') return null;
  return SEXO[trimmed] ?? null;
}
