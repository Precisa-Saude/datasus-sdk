/**
 * Tabela TPGESTAO — tipo de gestão do estabelecimento CNES.
 *
 * Fonte: dicionário CNES DATASUS.
 */

const LABELS: Record<string, string> = {
  D: 'Dupla (estadual + municipal)',
  E: 'Estadual',
  M: 'Municipal',
  S: 'Sem gestão definida',
};

export function labelGestao(code: null | string | undefined): null | string {
  if (!code) return null;
  return LABELS[code.trim().toUpperCase()] ?? null;
}

/** Tabela ESFERA_A — esfera administrativa. */
const ESFERA: Record<string, string> = {
  '1': 'Federal',
  '2': 'Estadual',
  '3': 'Municipal',
  '4': 'Privada',
};

export function labelEsferaAdmin(code: null | string | undefined): null | string {
  if (!code) return null;
  return ESFERA[code.trim()] ?? null;
}
