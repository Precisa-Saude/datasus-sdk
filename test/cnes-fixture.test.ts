/**
 * E2E contra fixture real CNES-ST AC 2024/01.
 * Baixada de ftp.datasus.gov.br/dissemin/publicos/CNES/200508_/Dados/ST/STAC2401.dbc
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { readDbcRecords } from '@precisa-saude/datasus-dbc';
import { describe, expect, it } from 'vitest';

import type { CnesEstabelecimentoRecord } from '../src/index.js';
import { countBy, findMunicipio, labelTipoUnidade } from '../src/index.js';

const FIXTURE_PATH = fileURLToPath(new URL('./fixtures/STAC2401.dbc', import.meta.url));
const fixture = new Uint8Array(readFileSync(FIXTURE_PATH));

describe('CNES-ST AC 2024/01 — fixture', () => {
  it('decodifica estabelecimentos com campos canônicos', async () => {
    const records: CnesEstabelecimentoRecord[] = [];
    for await (const record of readDbcRecords(fixture)) {
      records.push(record as CnesEstabelecimentoRecord);
      if (records.length >= 10) break;
    }

    expect(records.length).toBeGreaterThan(0);
    for (const record of records) {
      expect(record).toHaveProperty('CNES');
      expect(record).toHaveProperty('CODUFMUN');
      expect(record).toHaveProperty('TP_UNID');
    }
  });

  it('compõe labels de tipo de unidade + município em JSON', async () => {
    const records: CnesEstabelecimentoRecord[] = [];
    for await (const record of readDbcRecords(fixture)) {
      records.push(record as CnesEstabelecimentoRecord);
    }

    expect(records.length).toBeGreaterThan(0);

    const enriched = records.slice(0, 5).map((r) => ({
      cnes: r.CNES,
      fantasia: r.FANTASIA,
      municipio: findMunicipio(String(r.CODUFMUN))?.nome ?? null,
      tipo: labelTipoUnidade(r.TP_UNID),
    }));

    expect(() => JSON.stringify(enriched, null, 2)).not.toThrow();

    // AC inteiro → todos municípios devem ter UF 'AC' quando encontrados
    for (const r of records.slice(0, 20)) {
      const m = findMunicipio(String(r.CODUFMUN));
      if (m) expect(m.uf).toBe('AC');
    }
  });

  it('agrega estabelecimentos por tipo de unidade', async () => {
    const records: CnesEstabelecimentoRecord[] = [];
    for await (const record of readDbcRecords(fixture)) {
      records.push(record as CnesEstabelecimentoRecord);
    }

    const byTipo = countBy(records, (r) => labelTipoUnidade(r.TP_UNID) ?? 'Desconhecido');
    expect(Object.keys(byTipo).length).toBeGreaterThan(0);
  });
});
