/**
 * Tabelas dos atributos de tipo de atendimento/clientela do CNES.
 *
 * Fontes: dicionário CNES DATASUS.
 */

const CLIENTEL: Record<string, string> = {
  '01': 'Atendimento exclusivo SUS',
  '02': 'SUS e outras fontes',
  '03': 'Exclusivo outras fontes (não-SUS)',
};

export function labelClientela(code: null | string | undefined): null | string {
  if (!code) return null;
  return CLIENTEL[code.trim().padStart(2, '0')] ?? null;
}

const VINCULO_SUS: Record<string, string> = {
  '0': 'Não vinculada ao SUS',
  '1': 'Vinculada ao SUS',
};

export function labelVinculoSUS(code: null | string | undefined): null | string {
  if (code === null || code === undefined) return null;
  const trimmed = String(code).trim();
  if (trimmed === '') return null;
  return VINCULO_SUS[trimmed] ?? null;
}

/** TURNO_AT — turno de atendimento. */
const TURNO: Record<string, string> = {
  '01': 'Manhã',
  '02': 'Tarde',
  '03': 'Noite',
  '04': 'Manhã e tarde',
  '05': 'Manhã e noite',
  '06': 'Tarde e noite',
  '07': 'Manhã, tarde e noite (contínuo)',
};

export function labelTurno(code: null | string | undefined): null | string {
  if (!code) return null;
  return TURNO[code.trim().padStart(2, '0')] ?? null;
}

/** NIV_DEP — nível de dependência administrativa. */
const NIV_DEP: Record<string, string> = {
  '1': 'Individual',
  '2': 'Mantido',
  '3': 'Mantenedor',
  '4': 'Filial',
};

export function labelNivelDependencia(code: null | string | undefined): null | string {
  if (!code) return null;
  return NIV_DEP[code.trim()] ?? null;
}

/** PF_PJ — pessoa física × jurídica. */
const PF_PJ: Record<string, string> = {
  '1': 'Pessoa física',
  '3': 'Pessoa jurídica',
};

export function labelPessoa(code: null | string | undefined): null | string {
  if (!code) return null;
  return PF_PJ[code.trim()] ?? null;
}

/** NIVATE_A / NIVATE_H — nível de atenção (ambulatorial / hospitalar). */
const NIVEL_ATENCAO: Record<string, string> = {
  '0': 'Não aplicável',
  '1': 'Atenção básica',
  '2': 'Média complexidade',
  '3': 'Alta complexidade',
};

export function labelNivelAtencao(code: null | string | undefined): null | string {
  if (code === null || code === undefined) return null;
  const trimmed = String(code).trim();
  if (trimmed === '') return null;
  return NIVEL_ATENCAO[trimmed] ?? null;
}

/** ATIVIDAD — atividade de ensino / pesquisa. */
const ATIVIDADE: Record<string, string> = {
  '01': 'Sem atividade de ensino',
  '02': 'Atividade de pesquisa',
  '03': 'Hospital de ensino (MEC/MS)',
  '04': 'Hospital auxiliar de ensino',
  '05': 'Unidade auxiliar de ensino',
  '06': 'Centro aprimoramento profissional',
  '07': 'Outras atividades de ensino',
};

export function labelAtividadeEnsino(code: null | string | undefined): null | string {
  if (!code) return null;
  return ATIVIDADE[code.trim().padStart(2, '0')] ?? null;
}

/** TP_PREST — tipo de prestador. */
const TP_PREST: Record<string, string> = {
  '20': 'Público',
  '22': 'Filantrópico',
  '30': 'Privado lucrativo',
  '40': 'Sindicato',
  '50': 'Privado não-lucrativo',
  '60': 'Privado optante SIMPLES',
  '61': 'Privado não optante SIMPLES',
  '99': 'Sem informação',
};

export function labelTipoPrestador(code: null | string | undefined): null | string {
  if (!code) return null;
  return TP_PREST[code.trim().padStart(2, '0')] ?? null;
}
