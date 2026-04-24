/**
 * Tabela raça/cor do SIA-SUS (campo `PA_RACACOR`).
 *
 * Convenção IBGE + "99 sem informação" usada em sistemas DATASUS.
 */

const RACACOR: Record<string, string> = {
  '01': 'Branca',
  '02': 'Preta',
  '03': 'Parda',
  '04': 'Amarela',
  '05': 'Indígena',
  '99': 'Sem informação',
};

export function labelRacaCor(code: null | string | undefined): null | string {
  if (!code) return null;
  const trimmed = String(code).trim().padStart(2, '0');
  if (trimmed === '00') return null;
  return RACACOR[trimmed] ?? null;
}
