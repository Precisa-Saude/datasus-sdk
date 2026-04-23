import { describe, expect, it } from 'vitest';

import { siaFtpPath } from '../src/datasets/sia/index.js';

describe('siaFtpPath', () => {
  it('builds canonical PA path (AC 2024/01)', () => {
    expect(siaFtpPath({ month: 1, sub: 'PA', uf: 'AC', year: 2024 })).toBe(
      '/dissemin/publicos/SIASUS/200801_/Dados/PAAC2401.dbc',
    );
  });

  it('builds canonical PA path (SP 2024/12)', () => {
    expect(siaFtpPath({ month: 12, sub: 'PA', uf: 'SP', year: 2024 })).toBe(
      '/dissemin/publicos/SIASUS/200801_/Dados/PASP2412.dbc',
    );
  });

  it('uppercases UF', () => {
    expect(siaFtpPath({ month: 1, sub: 'PA', uf: 'ac', year: 2024 })).toContain('PAAC');
  });

  it('rejects invalid subdataset', () => {
    // @ts-expect-error — passing invalid sub on purpose
    expect(() => siaFtpPath({ month: 1, sub: 'XX', uf: 'AC', year: 2024 })).toThrow(
      /Subdataset SIA inválido/,
    );
  });

  it('rejects invalid UF', () => {
    expect(() => siaFtpPath({ month: 1, sub: 'PA', uf: 'XX', year: 2024 })).toThrow(/UF/);
  });

  it('rejects year before 2008 (PA no formato atual começa em 2008/01)', () => {
    expect(() => siaFtpPath({ month: 1, sub: 'PA', uf: 'AC', year: 2007 })).toThrow(/Ano/);
  });

  it('rejects invalid month', () => {
    expect(() => siaFtpPath({ month: 0, sub: 'PA', uf: 'AC', year: 2024 })).toThrow(/Mês/);
    expect(() => siaFtpPath({ month: 13, sub: 'PA', uf: 'AC', year: 2024 })).toThrow(/Mês/);
  });
});
