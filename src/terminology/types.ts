/**
 * Tipos do módulo de terminologia LOINC ↔ TUSS ↔ SIGTAP.
 *
 * LOINC vem do `@precisa-saude/fhir` (código universal de observação
 * laboratorial). TUSS é o código comercial brasileiro (ANS, saúde
 * suplementar). SIGTAP é o código do SUS (procedimentos faturáveis
 * pelo Ministério da Saúde).
 */

/** Grau de confiança do refinamento LLM da equivalência LOINC → TUSS/SIGTAP. */
export type TerminologyConfidence = 'high' | 'low' | 'medium';

/** Origem do mapeamento — hoje só temos a pipeline fuzzy + refinamento Gemini. */
export type TerminologySource = 'llm-refined';

export interface Biomarker {
  /** Código curto interno (ex: "HDL"). Vem do `@precisa-saude/fhir`. */
  code: string;
  /** Nome legível em pt-BR (ex: "Colesterol HDL"). */
  display: string;
}

export interface LoincMapping {
  /** Biomarcador associado no catálogo da Precisa Saúde. */
  biomarker: Biomarker;
  /** Confiança do LLM; null quando não foi possível decidir. */
  confidence: null | TerminologyConfidence;
  /**
   * Código LOINC (ex: "2085-9" para Colesterol HDL). Null para
   * biomarcadores que não têm um LOINC canônico (ex: métricas
   * compostas de composição corporal como `VATVolume`).
   */
  loinc: null | string;
  /** Razão do "sem match" (quando `sigtap` e `tuss` são null). */
  noMatchReason: null | string;
  /** Justificativa textual do LLM para a seleção. */
  reasoning: null | string;
  /** Código SIGTAP selecionado (null quando o LLM não achou equivalente). */
  sigtap: null | string;
  /** Pipeline que gerou este mapeamento. */
  source: TerminologySource;
  /** Código TUSS selecionado (null quando o LLM não achou equivalente). */
  tuss: null | string;
}

export interface SigtapProcedure {
  /** Código SIGTAP de 10 dígitos (ex: "0202010279"). */
  code: string;
  /** Nome oficial do procedimento na tabela SIGTAP. */
  name: string;
}

export interface SigtapEquivalent {
  /** Código SIGTAP equivalente. */
  code: string;
  /**
   * Grau de equivalência ANS:
   * - "1": equivalência total (mesmo conteúdo)
   * - "2": equivalência parcial (conteúdo mais amplo/restrito)
   * - "3": mapeamento conceitual (aproximação)
   */
  equivalencia: string;
  /** Nome do procedimento SIGTAP. */
  name: string;
}

export interface TussProcedure {
  /** Código TUSS de 8 dígitos (ex: "40301583"). */
  code: string;
  /** Nome oficial do procedimento na tabela TUSS. */
  name: string;
  /** Procedimentos SIGTAP equivalentes segundo o mapeamento oficial ANS. */
  sigtapEquivalents: readonly SigtapEquivalent[];
}
