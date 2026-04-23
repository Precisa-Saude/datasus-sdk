/**
 * Converte `PA_IDADE` (3 dígitos zero-padded, `"999"` = não informado)
 * em número ou `null`.
 *
 * Observação: `PA_IDADE` grava anos completos. Algumas vintages usam
 * `PA_FLIDADE` para indicar unidade (meses/dias) — intencionalmente
 * ignorado aqui: o caso dominante é anos, e adicionamos a unidade mais
 * tarde se aparecer demanda real.
 */

export function parseIdade(code: null | string | undefined): null | number {
  if (!code) return null;
  const trimmed = String(code).trim();
  if (trimmed === '' || trimmed === '999') return null;
  const n = Number(trimmed);
  if (!Number.isInteger(n) || n < 0 || n > 130) return null;
  return n;
}
