/**
 * Tipos para registros CNES.
 *
 * ST (estabelecimentos) e PF (profissionais) têm schemas distintos.
 * Demais colunas permanecem acessíveis via index signature.
 */

/**
 * Registro de estabelecimento (CNES-ST).
 */
export interface CnesEstabelecimentoRecord {
  [key: string]: unknown;
  /** CNES de 7 dígitos. */
  CNES: string;
  /** CNPJ. */
  CNPJ_MAN: string | null;
  /** Código IBGE do município (6 dígitos). */
  CODUFMUN: string;
  /** Esfera administrativa (1=Federal, 2=Estadual, 3=Municipal, 4=Privada). */
  ESFERA_A: string | null;
  /** Nome fantasia do estabelecimento. */
  FANTASIA: string | null;
  /** Latitude (string — algumas versões). */
  LATITUDE: string | null;
  /** Longitude. */
  LONGITUDE: string | null;
  /** Razão social. */
  RAZAO: string | null;
  /** Tipo de estabelecimento (tabela TP_UNID). */
  TP_UNID: string | null;
}

/**
 * Registro de profissional (CNES-PF) — um registro por vínculo.
 */
export interface CnesProfissionalRecord {
  [key: string]: unknown;
  /** CBO-Saúde 2002 (ocupação). */
  CBO: string;
  /** CNES do estabelecimento. */
  CNES: string;
  /** CNPJ da entidade contratante. */
  CNPJ_CPF: string | null;
  /** Código do município. */
  CODUFMUN: string;
  /** CPF do profissional (mascarado em algumas vintages). */
  CPF_PROF: string | null;
}
