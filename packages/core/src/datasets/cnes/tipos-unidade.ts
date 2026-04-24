/**
 * Tabela TP_UNID do CNES — tipo de estabelecimento.
 *
 * Fonte: dicionário CNES DATASUS. Cobertura dos tipos mais comuns;
 * códigos não mapeados retornam null.
 */

const TP_UNID_LABELS: Record<string, string> = {
  '01': 'Posto de Saúde',
  '02': 'Centro de Saúde / Unidade Básica',
  '04': 'Policlínica',
  '05': 'Hospital Geral',
  '07': 'Hospital Especializado',
  '15': 'Unidade Mista',
  '20': 'Pronto Atendimento',
  '21': 'Pronto Socorro Geral',
  '22': 'Pronto Socorro Especializado',
  '32': 'Unidade Móvel Terrestre',
  '36': 'Clínica / Centro de Especialidade',
  '39': 'Unidade de Apoio Diagnose e Terapia (SADT Isolado)',
  '40': 'Unidade Móvel Terrestre',
  '42': 'Unidade Móvel Pré-Hospitalar — Urgência/Emergência',
  '43': 'Farmácia',
  '50': 'Unidade de Vigilância em Saúde',
  '60': 'Cooperativa ou Empresa de Cessão de Trabalhadores na Saúde',
  '61': 'Centro de Parto Normal — Isolado',
  '62': 'Hospital/Dia — Isolado',
  '67': 'Laboratório Central de Saúde Pública (LACEN)',
  '68': 'Central de Gestão em Saúde',
  '69': 'Centro de Atenção Hemoterápica e/ou Hematológica',
  '70': 'Centro de Atenção Psicossocial',
  '71': 'Centro de Apoio à Saúde da Família',
  '72': 'Unidade de Atenção à Saúde Indígena',
  '73': 'Pronto Atendimento',
  '74': 'Polo Academia da Saúde',
  '75': 'Telessaúde',
  '76': 'Central de Regulação Médica das Urgências',
  '77': 'Serviço de Atenção Domiciliar Isolado (Home Care)',
  '78': 'Unidade de Atenção em Regime Residencial',
  '79': 'Oficina Ortopédica',
  '80': 'Laboratório de Saúde Pública',
  '81': 'Central de Regulação do Acesso',
  '82': 'Central de Notificação, Captação e Distribuição de Órgãos Estadual',
  '83': 'Polo de Prevenção de Doenças e Agravos e Promoção da Saúde',
  '84': 'Central de Abastecimento',
  '85': 'Centro de Imunização',
};

/**
 * Retorna o rótulo pt-BR do tipo de unidade CNES, ou `null` para códigos
 * não mapeados.
 */
export function labelTipoUnidade(code: string | null | undefined): string | null {
  if (!code) return null;
  return TP_UNID_LABELS[String(code).trim().padStart(2, '0')] ?? null;
}
