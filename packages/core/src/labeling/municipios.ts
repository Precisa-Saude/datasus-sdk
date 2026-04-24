/**
 * Lookup de municípios brasileiros por código IBGE.
 *
 * Dados: IBGE, API de localidades (CC-BY).
 * Fonte: https://servicodados.ibge.gov.br/api/v1/localidades/municipios
 *
 * A tabela contém 5571 municípios. DATASUS usa código IBGE de 6 dígitos
 * (sem o dígito verificador); IBGE e CNES usam 7 dígitos. Esta API aceita
 * ambos e faz a normalização internamente.
 */

import rawData from './ibge-municipios.json';

/** Informação de um município (subset usado em labeling). */
export interface Municipio {
  /** Código IBGE de 7 dígitos (com dígito verificador). */
  id: number;
  /** Nome oficial do município. */
  nome: string;
  /** Sigla da UF (ex: 'SP', 'AC'). */
  uf: string;
}

type RawMunicipio = [number, string, string];

const raw = rawData as RawMunicipio[];

const byId7 = new Map<number, Municipio>();
const byId6 = new Map<number, Municipio>();

for (const [id, nome, uf] of raw) {
  const m: Municipio = { id, nome, uf };
  byId7.set(id, m);
  byId6.set(Math.floor(id / 10), m);
}

/**
 * Busca um município por código IBGE. Aceita 6 ou 7 dígitos
 * (DATASUS usa 6, IBGE/CNES usam 7).
 *
 * @param code - código como string ou number
 * @returns município ou `null` se não encontrado
 */
export function findMunicipio(code: string | number): Municipio | null {
  const str = String(code).trim();
  if (str === '') return null;
  const num = Number(str);
  if (!Number.isFinite(num)) return null;

  if (str.length === 7) return byId7.get(num) ?? null;
  if (str.length === 6) return byId6.get(num) ?? null;
  // Fallback: try both widths
  return byId7.get(num) ?? byId6.get(num) ?? null;
}

/** Lista todos os municípios (imutável). */
export function allMunicipios(): readonly Municipio[] {
  return raw.map(([id, nome, uf]) => ({ id, nome, uf }));
}
