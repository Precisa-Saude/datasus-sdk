import { describe, expect, it } from 'vitest';

import {
  listBiomarkers,
  loincToSigtap,
  lookupSigtap,
  lookupTuss,
} from '../src/terminology/index.js';

describe('loincToSigtap', () => {
  it('resolve Colesterol HDL por LOINC', () => {
    const m = loincToSigtap('2085-9');
    expect(m).not.toBeNull();
    expect(m?.biomarker).toEqual({ code: 'HDL', display: 'Colesterol HDL' });
    expect(m?.sigtap).toBe('0202010279');
    expect(m?.tuss).toBe('40301583');
    expect(m?.confidence).toBe('high');
    expect(m?.source).toBe('llm-refined');
  });

  it('resolve também pelo código curto do biomarcador', () => {
    expect(loincToSigtap('HDL')?.loinc).toBe('2085-9');
    expect(loincToSigtap('TSH')?.loinc).toBe('3016-3');
  });

  it('resolve Colesterol total (2093-3)', () => {
    const m = loincToSigtap('2093-3');
    expect(m?.sigtap).toBe('0202010295');
    expect(m?.tuss).toBe('40301605');
  });

  it('resolve Creatinina (2160-0)', () => {
    const m = loincToSigtap('2160-0');
    expect(m?.sigtap).toBe('0202010317');
    expect(m?.tuss).toBe('40301630');
  });

  it('Apo A-1 e Apo B têm TUSS distintos — sem colisão fuzzy', () => {
    const apoA = loincToSigtap('1869-7');
    const apoB = loincToSigtap('1884-6');
    expect(apoA?.biomarker.display).toBe('Apolipoproteína A-1');
    expect(apoB?.biomarker.display).toBe('Apolipoproteína B');
    // ApoB tem TUSS confiável; ApoA1 ficou sem TUSS após refinamento.
    expect(apoB?.tuss).toBe('40301362');
    expect(apoA?.tuss).not.toBe(apoB?.tuss);
  });

  it('retorna null para código desconhecido', () => {
    expect(loincToSigtap('99999-9')).toBeNull();
    expect(loincToSigtap('DESCONHECIDO')).toBeNull();
  });

  it('ignora whitespace e rejeita string vazia', () => {
    expect(loincToSigtap('  2085-9  ')?.loinc).toBe('2085-9');
    expect(loincToSigtap('')).toBeNull();
    expect(loincToSigtap('   ')).toBeNull();
  });
});

describe('listBiomarkers', () => {
  it('expõe 164 biomarcadores do catálogo LOINC', () => {
    const all = listBiomarkers();
    expect(all.length).toBe(164);
  });

  it('todos os entries têm source llm-refined; loinc é null ou no formato padrão', () => {
    for (const m of listBiomarkers()) {
      expect(m.source).toBe('llm-refined');
      if (m.loinc !== null) expect(m.loinc).toMatch(/^\d+-\d+$/);
      expect(m.biomarker.code.length).toBeGreaterThan(0);
    }
  });
});

describe('lookupSigtap', () => {
  it('resolve DOSAGEM DE COLESTEROL HDL', () => {
    expect(lookupSigtap('0202010279')).toEqual({
      code: '0202010279',
      name: 'DOSAGEM DE COLESTEROL HDL',
    });
  });

  it('normaliza código com zeros à esquerda implícitos', () => {
    expect(lookupSigtap('202010279')?.code).toBe('0202010279');
  });

  it('retorna null para código desconhecido ou vazio', () => {
    expect(lookupSigtap('9999999999')).toBeNull();
    expect(lookupSigtap('')).toBeNull();
  });
});

describe('lookupTuss', () => {
  it('resolve Colesterol HDL e inclui o SIGTAP equivalente', () => {
    const tuss = lookupTuss('40301583');
    expect(tuss?.name).toMatch(/HDL/i);
    const hdl = tuss?.sigtapEquivalents.find((s) => s.code === '0202010279');
    expect(hdl?.name).toBe('DOSAGEM DE COLESTEROL HDL');
    expect(hdl?.equivalencia).toMatch(/^[123]$/);
  });

  it('retorna null para TUSS desconhecido', () => {
    expect(lookupTuss('99999999')).toBeNull();
    expect(lookupTuss('')).toBeNull();
  });
});

describe('fluxo fim-a-fim: LOINC → SIGTAP → nome pt-BR', () => {
  it('biomarcador Colesterol HDL resolve até o nome SIGTAP', () => {
    const mapping = loincToSigtap('2085-9');
    expect(mapping?.sigtap).toBe('0202010279');
    const sigtap = lookupSigtap(mapping!.sigtap!);
    expect(sigtap?.name).toBe('DOSAGEM DE COLESTEROL HDL');
  });
});
