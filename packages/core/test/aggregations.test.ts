import { describe, expect, it } from 'vitest';

import { countBy, countByNested, topN } from '../src/aggregations/index.js';

describe('countBy', () => {
  it('counts by single key', () => {
    const records = [{ uf: 'AC' }, { uf: 'AC' }, { uf: 'SP' }, { uf: 'SP' }, { uf: 'SP' }];
    const result = countBy(records, (r) => r.uf);
    expect(result).toEqual({ AC: 2, SP: 3 });
  });

  it('counts by two keys (nested) via countByNested', () => {
    const records = [
      { uf: 'AC', cid: 'E11' },
      { uf: 'AC', cid: 'E11' },
      { uf: 'AC', cid: 'I10' },
      { uf: 'SP', cid: 'E11' },
    ];
    const result = countByNested(
      records,
      (r) => r.uf,
      (r) => r.cid,
    );
    expect(result).toEqual({
      AC: { E11: 2, I10: 1 },
      SP: { E11: 1 },
    });
  });

  it('converts null/undefined keys to literal "null"', () => {
    const records = [{ uf: null }, { uf: undefined }, { uf: 'AC' }];
    const result = countBy(records, (r) => r.uf);
    expect(result).toEqual({ null: 2, AC: 1 });
  });

  it('output is JSON-serializable', () => {
    const records = [{ x: 1 }, { x: 1 }, { x: 2 }];
    const result = countBy(records, (r) => r.x);
    expect(() => JSON.stringify(result)).not.toThrow();
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
  });
});

describe('topN', () => {
  it('returns top N by count descending', () => {
    const counts = { a: 1, b: 5, c: 3, d: 2 };
    expect(topN(counts, 2)).toEqual([
      { count: 5, key: 'b' },
      { count: 3, key: 'c' },
    ]);
  });

  it('returns all entries if N exceeds size', () => {
    const counts = { a: 1, b: 2 };
    expect(topN(counts, 10)).toHaveLength(2);
  });

  it('returns empty array for empty input', () => {
    expect(topN({}, 5)).toEqual([]);
  });
});
