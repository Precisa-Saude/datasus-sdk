import { describe, expect, it } from 'vitest';

import { listBiomarkers, loincToSigtap, sigtapToLoinc } from '../src/index.js';

describe('sigtapToLoinc', () => {
  it('todo representante reverso resolve de volta ao próprio SIGTAP', () => {
    const primarios = listBiomarkers().filter((b) => b.sigtap !== null && b.reversePrimary);
    expect(primarios.length).toBeGreaterThan(0);

    for (const b of primarios) {
      const reverso = sigtapToLoinc(b.sigtap!);
      expect(reverso?.biomarker.code).toBe(b.biomarker.code);
      for (const extra of b.sigtapAlso) {
        expect(sigtapToLoinc(extra)?.biomarker.code).toBe(b.biomarker.code);
      }
    }
  });

  it('não-representantes nunca voltam pelo SIGTAP (sentido reverso não depende da ordem do arquivo)', () => {
    const secundarios = listBiomarkers().filter((b) => b.sigtap !== null && !b.reversePrimary);
    expect(secundarios.length).toBeGreaterThan(0);

    for (const b of secundarios) {
      const reverso = sigtapToLoinc(b.sigtap!);
      expect(reverso?.biomarker.code).not.toBe(b.biomarker.code);
      // mas o sentido direto continua válido
      expect(loincToSigtap(b.biomarker.code)?.sigtap).toBe(b.sigtap);
    }
  });

  it('cada SIGTAP compartilhado tem no máximo um representante', () => {
    const porSigtap = new Map<string, string[]>();
    for (const b of listBiomarkers()) {
      if (!b.reversePrimary) continue;
      for (const s of [b.sigtap, ...b.sigtapAlso]) {
        if (s === null) continue;
        porSigtap.set(s, [...(porSigtap.get(s) ?? []), b.biomarker.code]);
      }
    }
    for (const [sigtap, codes] of porSigtap) {
      expect(codes, `SIGTAP ${sigtap}`).toHaveLength(1);
    }
  });

  it('SIGTAP sem espécime declarado volta o exame sérico, não o urinário', () => {
    expect(sigtapToLoinc('0202010473')?.loinc).toBe('2345-7'); // Dosagem de glicose
    expect(sigtapToLoinc('0202010317')?.loinc).toBe('2160-0'); // Dosagem de creatinina
    expect(sigtapToLoinc('0202010562')?.loinc).toBe('19123-9'); // Dosagem de magnésio (sérico, não RBC)
  });

  it('painéis voltam o analito principal', () => {
    expect(sigtapToLoinc('0202010201')?.loinc).toBe('1975-2'); // Bilirrubina total e frações
    expect(sigtapToLoinc('0202010627')?.loinc).toBe('1751-7'); // Proteínas totais e frações → albumina
    expect(sigtapToLoinc('0202030105')?.loinc).toBe('2857-1'); // PSA total
    expect(sigtapToLoinc('0202030164')?.loinc).toBe('19113-0'); // IgE total
    expect(sigtapToLoinc('0202060390')?.loinc).toBe('3053-6'); // T3 total, não T3 livre
    expect(sigtapToLoinc('0204060028')?.biomarker.code).toBe('BMD_Total');
  });

  it('SIGTAP genérico demais para um LOINC fica sem representante', () => {
    // IgE alérgeno-específica: E1 (gato) e GX1 (gramíneas) mapeiam para
    // cá no sentido direto, mas nenhum rotula o procedimento inteiro.
    expect(sigtapToLoinc('0202031039')).toBeNull();
    expect(loincToSigtap('6833-8')?.sigtap).toBe('0202031039');
  });

  it('sigtapAlso: PCR genérica e quantitativa resolvem ao mesmo biomarcador', () => {
    expect(sigtapToLoinc('0202030083')?.loinc).toBe('1988-5');
    expect(sigtapToLoinc('0202030202')?.loinc).toBe('1988-5');
    expect(loincToSigtap('1988-5')?.sigtapAlso).toEqual(['0202030202']);
  });

  it('LOINCs corrigidos na revisão manual', () => {
    expect(sigtapToLoinc('0202010694')?.loinc).toBe('3091-6'); // ureia, não BUN (3094-0)
    expect(loincToSigtap('3094-0')).toBeNull();
    expect(sigtapToLoinc('0202010767')?.loinc).toBe('62292-8'); // 25-OH D2+D3, não só D3 (1989-3)
    expect(loincToSigtap('Urea')?.source).toBe('manual-review');
    expect(loincToSigtap('Urea')?.reviewNote).toContain('3094-0');
    expect(loincToSigtap('HDL')?.source).toBe('llm-refined');
    expect(loincToSigtap('HDL')?.reviewNote).toBeNull();
  });

  it('eGFR por fórmula não tem procedimento SUS (0208040080 é medicina nuclear)', () => {
    const egfr = loincToSigtap('98979-8');
    expect(egfr?.sigtap).toBeNull();
    expect(egfr?.noMatchReason).toContain('medicina nuclear');
    expect(sigtapToLoinc('0208040080')).toBeNull();
  });

  it('aceita códigos SIGTAP sem zero à esquerda (padStart de 10 dígitos)', () => {
    expect(sigtapToLoinc('202010473')?.loinc).toBe('2345-7');
  });

  it('retorna null para SIGTAP desconhecido ou vazio', () => {
    expect(sigtapToLoinc('')).toBeNull();
    expect(sigtapToLoinc('9999999999')).toBeNull();
    expect(sigtapToLoinc('   ')).toBeNull();
  });
});
