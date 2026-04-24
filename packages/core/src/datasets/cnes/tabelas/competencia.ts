/**
 * Converte a competência CNES (formato `"YYYYMM"`) pra o formato ISO-8601
 * de mês (`"YYYY-MM"`), mais amigável pra consumo JSON e filtros.
 */

export function formatarCompetencia(code: null | string | undefined): null | string {
  if (!code) return null;
  const trimmed = String(code).trim();
  if (!/^\d{6}$/.test(trimmed)) return null;
  return `${trimmed.slice(0, 4)}-${trimmed.slice(4, 6)}`;
}
