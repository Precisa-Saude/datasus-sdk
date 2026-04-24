/**
 * @precisa-saude/datasus — façade alto-nível para microdados DATASUS.
 *
 * Compõe FTP + decoder DBC + schemas tipados + labeling + agregações
 * em uma API consumível por web apps e CLIs. Saída JSON-first.
 */

export * as aggregations from './aggregations/index.js';
export * as datasets from './datasets/index.js';
export * as ftp from './ftp/index.js';
export * as labeling from './labeling/index.js';
export * as terminology from './terminology/index.js';

// Re-exports planos para os consumidores que preferem API achatada
export { countBy, countByNested, topN } from './aggregations/index.js';
export type {
  AtividadeConvenio,
  CnesEstabelecimentoRecord,
  CnesProfissionalRecord,
  CodigoRotulo,
  InstalacaoContagem,
  LabeledEstabelecimento,
  LeitosTotais,
  ServicoApoio,
} from './datasets/cnes/index.js';
export { labelEstabelecimento, labelTipoUnidade } from './datasets/cnes/index.js';
export { cnes, sia } from './datasets/index.js';
export type {
  Competencia,
  LabeledProducaoAmbulatorial,
  SiaPathParams,
  SiaProducaoAmbulatorialRecord,
  SiaSubdataset,
} from './datasets/sia/index.js';
export {
  enrichWithLoinc,
  filterLaboratorio,
  isSigtapLaboratorio,
  labelProducaoAmbulatorial,
} from './datasets/sia/index.js';
export type { DownloadOptions, ProgressEvent } from './ftp/index.js';
export { download } from './ftp/index.js';
export type { Municipio } from './labeling/index.js';
export { allMunicipios, findMunicipio } from './labeling/index.js';
export type {
  Biomarker,
  LoincMapping,
  SigtapEquivalent,
  SigtapProcedure,
  TussProcedure,
} from './terminology/index.js';
export {
  listBiomarkers,
  loincToSigtap,
  lookupSigtap,
  lookupTuss,
  sigtapToLoinc,
} from './terminology/index.js';

export const VERSION = '0.1.0';
