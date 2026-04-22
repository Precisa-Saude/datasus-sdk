/**
 * Tabelas SERAP01..SERAP11 P/T — serviços de apoio diagnóstico e terapêutico
 * (SADT). Cada serviço aparece em par: `*P` (próprio) e `*T` (terceirizado).
 * Valor "1" significa que o estabelecimento oferece o serviço naquela
 * modalidade.
 *
 * Fonte: dicionário CNES DATASUS, tabela de serviços de apoio.
 */

export const SERVICOS_APOIO_LABELS: Record<string, string> = {
  SERAP01: 'Laboratório de análises clínicas',
  SERAP02: 'Laboratório de anatomia patológica',
  SERAP03: 'Radiologia convencional',
  SERAP04: 'Ultrassonografia',
  SERAP05: 'Tomografia computadorizada',
  SERAP06: 'Ressonância magnética',
  SERAP07: 'Medicina nuclear',
  SERAP08: 'Hemodiálise',
  SERAP09: 'Hemoterapia',
  SERAP10: 'Reabilitação',
  SERAP11: 'Endoscopia',
};

export type Modalidade = 'ambos' | 'proprio' | 'terceirizado';

export interface ServicoApoio {
  /** Código base (ex: "SERAP03"). */
  codigo: string;
  /** Modalidade da oferta. */
  modalidade: Modalidade;
  /** Rótulo pt-BR do serviço. */
  rotulo: string;
}

/** Extrai os serviços de apoio ativos (P ou T = "1") do registro CNES. */
export function labelServicosApoio(record: Record<string, unknown>): readonly ServicoApoio[] {
  const out: ServicoApoio[] = [];
  for (const [codigo, rotulo] of Object.entries(SERVICOS_APOIO_LABELS)) {
    const proprio = String(record[`${codigo}P`] ?? '').trim() === '1';
    const terceiro = String(record[`${codigo}T`] ?? '').trim() === '1';
    if (!proprio && !terceiro) continue;
    const modalidade: Modalidade =
      proprio && terceiro ? 'ambos' : proprio ? 'proprio' : 'terceirizado';
    out.push({ codigo, modalidade, rotulo });
  }
  return out;
}

/**
 * Campos booleanos individuais ("1"/"0") relacionados a tipos de
 * atendimento e infraestrutura.
 */
const FLAGS: Record<string, string> = {
  ATEND_HOS: 'Atende hospitalar',
  ATEND_PR: 'Atende pré-natal',
  ATENDAMB: 'Atende ambulatorial',
  CENTRCIR: 'Possui centro cirúrgico',
  CENTRNEO: 'Possui centro de parto neonatal',
  CENTROBS: 'Possui centro obstétrico',
  COLETRES: 'Possui coleta de resíduos',
  RES_BIOL: 'Gera resíduos biológicos',
  RES_COMU: 'Gera resíduos comuns',
  RES_QUIM: 'Gera resíduos químicos',
  RES_RADI: 'Gera resíduos radiológicos',
  SERAPOIO: 'Possui serviço de apoio',
  URGEMERG: 'Atende urgência/emergência',
};

/** Retorna as flags booleanas ativas ("1") com rótulo humano. */
export function labelFlagsGerais(record: Record<string, unknown>): readonly string[] {
  const out: string[] = [];
  for (const [codigo, rotulo] of Object.entries(FLAGS)) {
    if (String(record[codigo] ?? '').trim() === '1') out.push(rotulo);
  }
  return out;
}
