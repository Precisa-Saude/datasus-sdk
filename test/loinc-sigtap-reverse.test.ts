import { describe, expect, it } from 'vitest';

import { listBiomarkers, loincToSigtap, sigtapToLoinc } from '../src/index.js';

describe('sigtapToLoinc', () => {
  it('resolve SIGTAP de volta ao mesmo código SIGTAP (evita regressão de chave)', () => {
    // Nota: o catálogo pode ter múltiplos biomarcadores mapeando pro mesmo
    // SIGTAP (ex: painéis de IgE específica compartilham 0202030300).
    // Por isso testamos que sigtapToLoinc(s).sigtap === s, não que o
    // biomarcador volte idêntico.
    const comSigtap = listBiomarkers().filter((b) => b.sigtap !== null);
    expect(comSigtap.length).toBeGreaterThan(0);

    for (const b of comSigtap) {
      const reverso = sigtapToLoinc(b.sigtap!);
      expect(reverso).not.toBeNull();
      expect(reverso?.sigtap).toBe(b.sigtap);
    }
  });

  it('aceita códigos SIGTAP sem zero à esquerda (padStart de 10 dígitos)', () => {
    const comSigtap = listBiomarkers().find((b) => b.sigtap !== null);
    expect(comSigtap).toBeDefined();
    const sigtap = comSigtap!.sigtap!;
    // Simula um caminho onde o usuário passa sem zero à esquerda
    const semZeroEsquerda = sigtap.replace(/^0+/, '');
    if (semZeroEsquerda !== sigtap) {
      expect(sigtapToLoinc(semZeroEsquerda)).not.toBeNull();
    }
  });

  it('retorna null para SIGTAP desconhecido ou vazio', () => {
    expect(sigtapToLoinc('')).toBeNull();
    expect(sigtapToLoinc('9999999999')).toBeNull();
    expect(sigtapToLoinc('   ')).toBeNull();
  });

  it('loincToSigtap continua funcionando (não regredimos o sentido original)', () => {
    const comSigtap = listBiomarkers().find((b) => b.loinc !== null && b.sigtap !== null);
    expect(comSigtap).toBeDefined();
    const loinc = comSigtap!.loinc!;
    const mapping = loincToSigtap(loinc);
    expect(mapping?.sigtap).toBe(comSigtap!.sigtap);
  });
});
