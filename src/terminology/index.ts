/**
 * Terminologia LOINC ↔ TUSS ↔ SIGTAP.
 *
 * Ponte entre:
 * - biomarcadores/LOINC usados pelo `@precisa-saude/fhir`
 * - códigos TUSS (ANS, saúde suplementar)
 * - códigos SIGTAP (SUS, procedimentos faturáveis)
 *
 * Fluxo típico: app recebe um código LOINC do FHIR, chama
 * `loincToSigtap` pra pegar o procedimento SUS correspondente, depois
 * `lookupSigtap`/`lookupTuss` pra detalhes adicionais.
 */

export { listBiomarkers, loincToSigtap, sigtapToLoinc } from './loinc.js';
export { lookupSigtap } from './sigtap.js';
export { lookupTuss } from './tuss.js';
export type {
  Biomarker,
  LoincMapping,
  SigtapEquivalent,
  SigtapProcedure,
  TerminologyConfidence,
  TerminologySource,
  TussProcedure,
} from './types.js';
