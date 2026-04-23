/**
 * E2E contra fixture real SIA-PA AC 2024/01.
 * Baixada de ftp.datasus.gov.br/dissemin/publicos/SIASUS/200801_/Dados/PAAC2401.dbc
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { readDbcRecords } from '@precisa-saude/datasus-dbc';
import { describe, expect, it } from 'vitest';

import type { SiaProducaoAmbulatorialRecord } from '../src/index.js';
import {
  countBy,
  enrichWithLoinc,
  findMunicipio,
  isSigtapLaboratorio,
  labelProducaoAmbulatorial,
} from '../src/index.js';

const FIXTURE_PATH = fileURLToPath(new URL('./fixtures/PAAC2401.dbc', import.meta.url));
const fixture = new Uint8Array(readFileSync(FIXTURE_PATH));

async function takeFirst(n: number): Promise<SiaProducaoAmbulatorialRecord[]> {
  const records: SiaProducaoAmbulatorialRecord[] = [];
  for await (const record of readDbcRecords(fixture)) {
    records.push(record as SiaProducaoAmbulatorialRecord);
    if (records.length >= n) break;
  }
  return records;
}

describe('SIA-PA AC 2024/01 — fixture', () => {
  it('decodifica registros com campos canônicos PA_*', async () => {
    const records = await takeFirst(10);
    expect(records.length).toBeGreaterThan(0);
    for (const record of records) {
      expect(record).toHaveProperty('PA_CODUNI');
      expect(record).toHaveProperty('PA_PROC_ID');
      expect(record).toHaveProperty('PA_CMP');
      expect(record).toHaveProperty('PA_UFMUN');
    }
  });

  it('labela competência, procedimento e município do estabelecimento', async () => {
    const records = await takeFirst(20);
    expect(records.length).toBeGreaterThan(0);

    const labeled = records.map((r) => labelProducaoAmbulatorial(r));
    expect(() => JSON.stringify(labeled, null, 2)).not.toThrow();

    const sample = labeled[0]!;
    expect(sample.competencia.iso).toBe('2024-01');
    expect(sample.competencia.ano).toBe(2024);
    expect(sample.competencia.mes).toBe(1);
    expect(sample.estabelecimento.cnes).toMatch(/^\d+$/);

    // AC inteiro → todos municípios do estabelecimento devem ter UF 'AC'
    for (const r of records) {
      if (typeof r.PA_UFMUN === 'string') {
        const m = findMunicipio(r.PA_UFMUN);
        if (m) expect(m.uf).toBe('AC');
      }
    }
  });

  it('isSigtapLaboratorio filtra procedimentos do grupo 02.02', async () => {
    const records = await takeFirst(500);
    const laboratorio = records.filter((r) =>
      isSigtapLaboratorio(typeof r.PA_PROC_ID === 'string' ? r.PA_PROC_ID : null),
    );
    // Todo exame retido deve ter SIGTAP começando com 0202
    for (const r of laboratorio) {
      expect(String(r.PA_PROC_ID)).toMatch(/^0202/);
    }
    // Os excluídos devem NÃO começar com 0202
    for (const r of records) {
      if (!laboratorio.includes(r)) {
        expect(String(r.PA_PROC_ID).startsWith('0202')).toBe(false);
      }
    }
  });

  it('enrichWithLoinc anexa mapeamento para SIGTAP reconhecido', async () => {
    const records = await takeFirst(2000);
    const enriched = records.map((r) => enrichWithLoinc(r));
    const comMapeamento = enriched.filter((r) => r.loinc !== null);
    // Em 2000 registros do AC, esperamos pelo menos um SIGTAP mapeado
    // no catálogo LOINC (164 biomarcadores).
    expect(comMapeamento.length).toBeGreaterThan(0);
    const first = comMapeamento[0]!;
    expect(first.loinc?.biomarker.code).toBeTruthy();
    expect(first.loinc?.sigtap).toBeTruthy();
  });

  it('agrega por SIGTAP', async () => {
    const records = await takeFirst(500);
    const byProc = countBy(records, (r) =>
      typeof r.PA_PROC_ID === 'string' ? r.PA_PROC_ID : 'desconhecido',
    );
    expect(Object.keys(byProc).length).toBeGreaterThan(0);
  });
});
