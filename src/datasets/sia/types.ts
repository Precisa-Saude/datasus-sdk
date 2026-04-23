/**
 * Tipos para registros SIA-SUS.
 *
 * Schema PA (Produção Ambulatorial). Varia por vintage — este tipa a
 * vintage 2008+ (60 colunas em 2024). Demais colunas permanecem
 * acessíveis via index signature.
 *
 * Valores numéricos vêm já decodificados pelo reader DBC (quantidades
 * e valores já em decimal — `PA_VALAPR` está em reais, não centavos).
 * Campos categóricos vêm como strings zero-padded pra bater com as
 * tabelas SIGTAP/CBO/CID-10.
 */

/**
 * Registro de Produção Ambulatorial (SIA-PA) — um registro por
 * procedimento faturado no mês.
 */
export interface SiaProducaoAmbulatorialRecord {
  [key: string]: unknown;
  /** CBO-Saúde 2002 — ocupação do profissional. */
  PA_CBOCOD: null | string;
  /** CID-10 principal (4 dígitos, `"0000"` quando não informado). */
  PA_CIDPRI: null | string;
  /** Competência no formato `"YYYYMM"` (ex: `"202401"`). */
  PA_CMP: string;
  /** CNES do estabelecimento executor (7 dígitos). */
  PA_CODUNI: string;
  /** Idade zero-padded para 3 dígitos (`"999"` = não informado). */
  PA_IDADE: null | string;
  /** Município de residência do paciente (IBGE 6 dígitos). */
  PA_MUNPCN: null | string;
  /** Código SIGTAP do procedimento (10 dígitos). */
  PA_PROC_ID: string;
  /** Quantidade aprovada. */
  PA_QTDAPR: null | number;
  /** Quantidade apresentada. */
  PA_QTDPRO: null | number;
  /** Raça/cor (tabela IBGE). */
  PA_RACACOR: null | string;
  /** Sexo (`M`/`F`/`0`=não informado). */
  PA_SEXO: null | string;
  /** UF do município do estabelecimento executor (IBGE 6 dígitos). */
  PA_UFMUN: string;
  /** Valor aprovado em reais (já em decimal, não centavos). */
  PA_VALAPR: null | number;
  /** Valor apresentado em reais. */
  PA_VALPRO: null | number;
}
