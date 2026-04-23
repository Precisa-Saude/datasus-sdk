/**
 * Projeta um registro SIA-PA cru em um objeto legível em pt-BR, pronto
 * pra consumo por apps web ou CLI.
 *
 * Campos categóricos vêm como `{ codigo, rotulo }` — o código original
 * é preservado pra permitir filtros e joins sem perda; o rótulo é o
 * texto humano (ou `null` quando o código não está mapeado).
 *
 * Enrichment LOINC é opt-in via `enrichWithLoinc` em `laboratorio.ts` —
 * não é aplicado aqui pra manter o labeler barato em cenários que só
 * querem rotular.
 */

import { findMunicipio } from '../../labeling/index.js';
import { lookupSigtap } from '../../terminology/sigtap.js';
import type { CodigoRotulo } from '../cnes/label-estabelecimento.js';
import { parseIdade } from './tabelas/idade.js';
import { labelRacaCor } from './tabelas/raca-cor.js';
import { labelSexo } from './tabelas/sexo.js';
import type { SiaProducaoAmbulatorialRecord } from './types.js';

/** Competência decomposta (ex: `{ iso: "2024-01", ano: 2024, mes: 1 }`). */
export interface Competencia {
  ano: null | number;
  iso: null | string;
  mes: null | number;
}

export interface LabeledProducaoAmbulatorial {
  cbo: CodigoRotulo;
  cidPrincipal: null | string;
  competencia: Competencia;
  /** Município do estabelecimento executor. */
  estabelecimento: {
    cnes: null | string;
    municipio: {
      codigo: null | string;
      nome: null | string;
      uf: null | string;
    };
  };
  idadeAnos: null | number;
  /** Município de residência do paciente. */
  municipioPaciente: {
    codigo: null | string;
    nome: null | string;
    uf: null | string;
  };
  procedimento: {
    codigo: null | string;
    rotulo: null | string;
  };
  quantidade: {
    aprovada: null | number;
    apresentada: null | number;
  };
  racaCor: CodigoRotulo;
  sexo: CodigoRotulo;
  valor: {
    aprovadoBRL: null | number;
    apresentadoBRL: null | number;
  };
}

function toCompetencia(code: null | string | undefined): Competencia {
  if (!code) return { ano: null, iso: null, mes: null };
  const trimmed = String(code).trim();
  if (!/^\d{6}$/.test(trimmed)) return { ano: null, iso: null, mes: null };
  const ano = Number(trimmed.slice(0, 4));
  const mes = Number(trimmed.slice(4, 6));
  if (mes < 1 || mes > 12) return { ano: null, iso: null, mes: null };
  return { ano, iso: `${trimmed.slice(0, 4)}-${trimmed.slice(4, 6)}`, mes };
}

function toNullableString(value: unknown): null | string {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (trimmed === '') return null;
  return trimmed;
}

function toNullableNumber(value: unknown): null | number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return value;
}

function municipioInfo(
  code: null | string,
): LabeledProducaoAmbulatorial['estabelecimento']['municipio'] {
  if (!code) return { codigo: null, nome: null, uf: null };
  const m = findMunicipio(code);
  return {
    codigo: code,
    nome: m?.nome ?? null,
    uf: m?.uf ?? null,
  };
}

/**
 * Projeta um registro SIA-PA num objeto pt-BR legível. Não enriquece
 * com LOINC — use `enrichWithLoinc` em cima do resultado se precisar.
 */
export function labelProducaoAmbulatorial(
  r: SiaProducaoAmbulatorialRecord,
): LabeledProducaoAmbulatorial {
  const procId = toNullableString(r.PA_PROC_ID);
  const sigtap = procId !== null ? lookupSigtap(procId) : null;
  const cbo = toNullableString(r.PA_CBOCOD);
  const cid = toNullableString(r.PA_CIDPRI);

  return {
    cbo: { codigo: cbo, rotulo: null },
    cidPrincipal: cid && cid !== '0000' ? cid : null,
    competencia: toCompetencia(toNullableString(r.PA_CMP)),
    estabelecimento: {
      cnes: toNullableString(r.PA_CODUNI),
      municipio: municipioInfo(toNullableString(r.PA_UFMUN)),
    },
    idadeAnos: parseIdade(toNullableString(r.PA_IDADE)),
    municipioPaciente: municipioInfo(
      toNullableString(r.PA_MUNPCN) === '999999' ? null : toNullableString(r.PA_MUNPCN),
    ),
    procedimento: {
      codigo: procId,
      rotulo: sigtap?.name ?? null,
    },
    quantidade: {
      apresentada: toNullableNumber(r.PA_QTDPRO),
      aprovada: toNullableNumber(r.PA_QTDAPR),
    },
    racaCor: {
      codigo: toNullableString(r.PA_RACACOR),
      rotulo: labelRacaCor(toNullableString(r.PA_RACACOR)),
    },
    sexo: {
      codigo: toNullableString(r.PA_SEXO),
      rotulo: labelSexo(toNullableString(r.PA_SEXO)),
    },
    valor: {
      apresentadoBRL: toNullableNumber(r.PA_VALPRO),
      aprovadoBRL: toNullableNumber(r.PA_VALAPR),
    },
  };
}
