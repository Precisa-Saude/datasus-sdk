import { describe, expect, it } from 'vitest';

import { allMunicipios, findMunicipio } from '../src/labeling/index.js';

describe('findMunicipio', () => {
  it('resolves São Paulo by 7-digit IBGE code', () => {
    const m = findMunicipio(3550308);
    expect(m).toEqual({ id: 3550308, nome: 'São Paulo', uf: 'SP' });
  });

  it('resolves São Paulo by 6-digit DATASUS code (dropped check digit)', () => {
    const m = findMunicipio('355030');
    expect(m?.nome).toBe('São Paulo');
    expect(m?.uf).toBe('SP');
  });

  it('accepts string or number input', () => {
    expect(findMunicipio(3550308)).toEqual(findMunicipio('3550308'));
  });

  it('returns null for unknown code', () => {
    expect(findMunicipio(9999999)).toBeNull();
    expect(findMunicipio('')).toBeNull();
    expect(findMunicipio('abc')).toBeNull();
  });

  it('resolves Rio Branco (AC) both widths', () => {
    expect(findMunicipio(1200401)?.nome).toBe('Rio Branco');
    expect(findMunicipio('120040')?.nome).toBe('Rio Branco');
  });
});

describe('allMunicipios', () => {
  it('contains 5571 entries', () => {
    expect(allMunicipios()).toHaveLength(5571);
  });

  it('every entry has id, nome, uf', () => {
    for (const m of allMunicipios().slice(0, 10)) {
      expect(typeof m.id).toBe('number');
      expect(typeof m.nome).toBe('string');
      expect(typeof m.uf).toBe('string');
      expect(m.uf).toHaveLength(2);
    }
  });
});
