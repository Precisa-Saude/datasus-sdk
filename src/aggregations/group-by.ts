/**
 * Helpers de agregação puros — composáveis, retornam objetos JS
 * diretamente serializáveis para JSON.
 */

/**
 * Agrupa registros por uma chave e retorna contagens: `{ chave: count }`.
 *
 * Chaves `null`/`undefined` são convertidas para a string literal 'null'
 * para garantir serialização JSON consistente.
 */
export function countBy<T>(
  records: Iterable<T>,
  key: (record: T) => unknown,
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const record of records) {
    const k = stringKey(key(record));
    result[k] = (result[k] ?? 0) + 1;
  }
  return result;
}

/**
 * Agrupa por duas chaves aninhadas: `{ chaveA: { chaveB: count } }`.
 */
export function countByNested<T>(
  records: Iterable<T>,
  keyA: (record: T) => unknown,
  keyB: (record: T) => unknown,
): Record<string, Record<string, number>> {
  const result: Record<string, Record<string, number>> = {};
  for (const record of records) {
    const a = stringKey(keyA(record));
    const b = stringKey(keyB(record));
    const inner = (result[a] ??= {});
    inner[b] = (inner[b] ?? 0) + 1;
  }
  return result;
}

/**
 * Retorna os N pares `{ key, count }` com maior contagem de um mapa produzido
 * por `countBy`, ordenados decrescente.
 */
export function topN(
  counts: Record<string, number>,
  n: number,
): Array<{ count: number; key: string }> {
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([key, count]) => ({ count, key }));
}

function stringKey(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  return String(value);
}
