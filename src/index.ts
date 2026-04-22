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

// Re-exports planos para os consumidores que preferem API achatada
export { countBy, countByNested, topN } from './aggregations/index.js';
export type { CnesEstabelecimentoRecord, CnesProfissionalRecord } from './datasets/cnes/index.js';
export { labelTipoUnidade } from './datasets/cnes/index.js';
export { cnes } from './datasets/index.js';
export type { DownloadOptions, ProgressEvent } from './ftp/index.js';
export { download } from './ftp/index.js';
export type { Municipio } from './labeling/index.js';
export { allMunicipios, findMunicipio } from './labeling/index.js';

export const VERSION = '0.1.0';
