import { describe, expect, it } from 'vitest';

import { cnesFtpPath, labelTipoUnidade } from '../src/datasets/cnes/index.js';

describe('cnesFtpPath', () => {
  it('builds canonical ST path (AC 2024/01)', () => {
    expect(cnesFtpPath({ month: 1, sub: 'ST', uf: 'AC', year: 2024 })).toBe(
      '/dissemin/publicos/CNES/200508_/Dados/ST/STAC2401.dbc',
    );
  });

  it('builds canonical PF path (SP 2024/03)', () => {
    expect(cnesFtpPath({ month: 3, sub: 'PF', uf: 'SP', year: 2024 })).toBe(
      '/dissemin/publicos/CNES/200508_/Dados/PF/PFSP2403.dbc',
    );
  });

  it('uppercases UF', () => {
    expect(cnesFtpPath({ month: 1, sub: 'ST', uf: 'ac', year: 2024 })).toContain('STAC');
  });

  it('rejects invalid subdataset', () => {
    // @ts-expect-error — passing invalid sub on purpose
    expect(() => cnesFtpPath({ month: 1, sub: 'XX', uf: 'AC', year: 2024 })).toThrow(
      /Subdataset CNES inválido/,
    );
  });

  it('rejects invalid UF/ano/mês', () => {
    expect(() => cnesFtpPath({ month: 1, sub: 'ST', uf: 'XX', year: 2024 })).toThrow(/UF/);
    expect(() => cnesFtpPath({ month: 1, sub: 'ST', uf: 'AC', year: 2000 })).toThrow(/Ano/);
    expect(() => cnesFtpPath({ month: 13, sub: 'ST', uf: 'AC', year: 2024 })).toThrow(/Mês/);
  });
});

describe('labelTipoUnidade', () => {
  it('returns pt-BR label for common types', () => {
    expect(labelTipoUnidade('05')).toBe('Hospital Geral');
    expect(labelTipoUnidade('02')).toBe('Centro de Saúde / Unidade Básica');
    expect(labelTipoUnidade('39')).toBe('Unidade de Apoio Diagnose e Terapia (SADT Isolado)');
  });

  it('pads single-digit codes', () => {
    expect(labelTipoUnidade('5')).toBe('Hospital Geral');
  });

  it('returns null for unknown or empty codes', () => {
    expect(labelTipoUnidade('99')).toBeNull();
    expect(labelTipoUnidade(null)).toBeNull();
    expect(labelTipoUnidade('')).toBeNull();
  });
});
