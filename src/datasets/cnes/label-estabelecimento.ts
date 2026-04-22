/**
 * Projeta um registro CNES-ST cru (150+ campos de códigos DATASUS) num
 * objeto legível em pt-BR, pronto pra consumo por apps web ou CLI.
 *
 * Campos categóricos vêm como `{ codigo, rotulo }` — o código original é
 * preservado pra permitir filtros e joins sem perda; o rótulo é o texto
 * humano correspondente (ou `null` quando o código não está mapeado).
 *
 * Agregações (leitos, instalações, serviços de apoio, matriz
 * atividade×convênio) são filtradas para omitir entradas zeradas, o que
 * mantém o JSON enxuto.
 */

import { findMunicipio } from '../../labeling/index.js';
import type { AtividadeConvenio } from './tabelas/atividade-convenio.js';
import { labelAtividadeConvenio } from './tabelas/atividade-convenio.js';
import {
  labelAtividadeEnsino,
  labelClientela,
  labelNivelAtencao,
  labelNivelDependencia,
  labelPessoa,
  labelTipoPrestador,
  labelTurno,
  labelVinculoSUS,
} from './tabelas/clientela.js';
import { formatarCompetencia } from './tabelas/competencia.js';
import { labelEsferaAdmin, labelGestao } from './tabelas/gestao.js';
import type { InstalacaoContagem } from './tabelas/instalacoes.js';
import { labelInstalacoes } from './tabelas/instalacoes.js';
import type { LeitosTotais } from './tabelas/leitos.js';
import { labelLeitos } from './tabelas/leitos.js';
import { labelNaturezaJuridica } from './tabelas/natureza-juridica.js';
import type { ServicoApoio } from './tabelas/servicos-apoio.js';
import { labelFlagsGerais, labelServicosApoio } from './tabelas/servicos-apoio.js';
import { labelTipoUnidade } from './tipos-unidade.js';
import type { CnesEstabelecimentoRecord } from './types.js';

/** Par código/rótulo usado nos campos categóricos. */
export interface CodigoRotulo {
  codigo: null | string;
  rotulo: null | string;
}

export interface LabeledEstabelecimento {
  /** Flags booleanas ativas (ex: "Atende pré-natal", "Possui centro cirúrgico"). */
  atendimentos: readonly string[];
  atividadeEnsino: CodigoRotulo;
  clientela: CodigoRotulo;
  // ----- Identificação -----
  /** CNES do estabelecimento (7 dígitos). Obrigatório; a função falha se ausente. */
  cnes: string;
  cnpj: null | string;
  /** Competência no formato ISO (`"YYYY-MM"`); `null` se ausente ou inválida. */
  competencia: null | string;
  esferaAdministrativa: CodigoRotulo;

  geo: {
    latitude: null | string;
    longitude: null | string;
  };
  gestao: CodigoRotulo;
  // ----- Capacidade -----
  instalacoes: readonly InstalacaoContagem[];
  leitos: LeitosTotais;
  matrizAtividadeConvenio: readonly AtividadeConvenio[];
  municipio: {
    codigo: null | string;
    nome: null | string;
    uf: null | string;
  };
  naturezaJuridica: CodigoRotulo;
  nivelAtencaoAmbulatorial: CodigoRotulo;
  nivelAtencaoHospitalar: CodigoRotulo;
  nivelDependencia: CodigoRotulo;
  nomeFantasia: null | string;
  pessoa: CodigoRotulo;
  razaoSocial: null | string;

  // ----- Serviços & convênios -----
  servicosApoio: readonly ServicoApoio[];
  // ----- Classificação -----
  tipo: CodigoRotulo;

  tipoPrestador: CodigoRotulo;
  turno: CodigoRotulo;
  vinculoSUS: CodigoRotulo;
}

function strOrNull(value: unknown): null | string {
  if (value === null || value === undefined) return null;
  const trimmed = String(value).trim();
  return trimmed === '' ? null : trimmed;
}

function codigoRotulo(code: unknown, labeler: (c: string) => null | string): CodigoRotulo {
  const codigo = strOrNull(code);
  return { codigo, rotulo: codigo === null ? null : labeler(codigo) };
}

/**
 * Converte um registro CNES-ST cru num objeto labeled. O input genérico
 * (`CnesEstabelecimentoRecord`) é aceito pra permitir fixtures tipadas;
 * na prática a função lê só os campos documentados abaixo.
 *
 * Validação: o registro precisa ter pelo menos `CNES` preenchido. Passar
 * um registro de outro subdataset (ex: CNES-PF) produziria um objeto
 * todo com nulls — a exceção aqui falha rápido pra evitar dados
 * silenciosamente vazios.
 */
export function labelEstabelecimento(record: CnesEstabelecimentoRecord): LabeledEstabelecimento {
  const cnes = strOrNull(record['CNES']);
  if (cnes === null) {
    throw new Error(
      'labelEstabelecimento: campo CNES ausente — o registro parece não ser um CNES-ST válido',
    );
  }
  const codMun = strOrNull(record['CODUFMUN']);
  const mun = codMun === null ? null : findMunicipio(codMun);

  return {
    atendimentos: labelFlagsGerais(record),
    atividadeEnsino: codigoRotulo(record['ATIVIDAD'], labelAtividadeEnsino),
    clientela: codigoRotulo(record['CLIENTEL'], labelClientela),
    cnes,
    cnpj: strOrNull(record['CNPJ_MAN']),
    competencia: formatarCompetencia(strOrNull(record['COMPETEN'])),
    esferaAdministrativa: codigoRotulo(record['ESFERA_A'], labelEsferaAdmin),
    geo: {
      latitude: strOrNull(record['LATITUDE']),
      longitude: strOrNull(record['LONGITUDE']),
    },
    gestao: codigoRotulo(record['TPGESTAO'], labelGestao),
    instalacoes: labelInstalacoes(record),
    leitos: labelLeitos(record),
    matrizAtividadeConvenio: labelAtividadeConvenio(record),
    municipio: {
      codigo: codMun,
      nome: mun?.nome ?? null,
      uf: mun?.uf ?? null,
    },
    naturezaJuridica: codigoRotulo(record['NAT_JUR'], labelNaturezaJuridica),
    nivelAtencaoAmbulatorial: codigoRotulo(record['NIVATE_A'], labelNivelAtencao),
    nivelAtencaoHospitalar: codigoRotulo(record['NIVATE_H'], labelNivelAtencao),
    nivelDependencia: codigoRotulo(record['NIV_DEP'], labelNivelDependencia),
    nomeFantasia: strOrNull(record['FANTASIA']),
    pessoa: codigoRotulo(record['PF_PJ'], labelPessoa),
    razaoSocial: strOrNull(record['RAZAO']),
    servicosApoio: labelServicosApoio(record),
    tipo: codigoRotulo(record['TP_UNID'], labelTipoUnidade),
    tipoPrestador: codigoRotulo(record['TP_PREST'], labelTipoPrestador),
    turno: codigoRotulo(record['TURNO_AT'], labelTurno),
    vinculoSUS: codigoRotulo(record['VINC_SUS'], labelVinculoSUS),
  };
}
