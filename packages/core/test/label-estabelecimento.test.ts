/**
 * Testes unitários do `labelEstabelecimento` com registros sintéticos +
 * fixture real CNES-ST AC 2024/01.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { readDbcRecords } from '@precisa-saude/datasus-dbc';
import { describe, expect, it } from 'vitest';

import type { CnesEstabelecimentoRecord } from '../src/index.js';
import { labelEstabelecimento } from '../src/index.js';

const FIXTURE_PATH = fileURLToPath(new URL('./fixtures/STAC2401.dbc', import.meta.url));
const fixture = new Uint8Array(readFileSync(FIXTURE_PATH));

describe('labelEstabelecimento — registros sintéticos', () => {
  it('decodifica UBS municipal padrão com capacidade pequena', () => {
    const raw = {
      AP01CV01: '1',
      AP02CV01: '1',
      ATEND_PR: '1',
      ATENDAMB: '1',
      ATIVIDAD: '01',
      CENTRCIR: '0',
      CLIENTEL: '01',
      CNES: '1234567',
      CNPJ_MAN: '43008291000177',
      CODUFMUN: '120040', // Rio Branco/AC
      COMPETEN: '202401',
      ESFERA_A: null,
      FANTASIA: 'UBS CENTRO',
      LATITUDE: '-9.974',
      LEITHOSP: '0',
      LONGITUDE: '-67.810',
      NAT_JUR: '1244',
      NIV_DEP: '3',
      NIVATE_A: '1',
      NIVATE_H: '0',
      PF_PJ: '3',
      QTINST15: 2,
      QTINST23: 1,
      QTINST26: 1,
      QTINST29: 1,
      RAZAO: 'SMS RIO BRANCO',
      RES_BIOL: '1',
      RES_COMU: '1',
      SERAP01P: '1',
      SERAP03P: '1',
      SERAPOIO: '1',
      TP_PREST: '99',
      TP_UNID: '02',
      TPGESTAO: 'M',
      TURNO_AT: '01',
      URGEMERG: '0',
      VINC_SUS: '1',
    } as unknown as CnesEstabelecimentoRecord;

    const labeled = labelEstabelecimento(raw);

    // Identificação
    expect(labeled.cnes).toBe('1234567');
    expect(labeled.cnpj).toBe('43008291000177');
    expect(labeled.nomeFantasia).toBe('UBS CENTRO');
    expect(labeled.municipio).toMatchObject({ codigo: '120040', uf: 'AC' });
    expect(labeled.competencia).toBe('2024-01');
    expect(labeled.geo).toEqual({ latitude: '-9.974', longitude: '-67.810' });

    // Classificação
    expect(labeled.tipo).toEqual({ codigo: '02', rotulo: 'Centro de Saúde / Unidade Básica' });
    expect(labeled.gestao).toEqual({ codigo: 'M', rotulo: 'Municipal' });
    expect(labeled.clientela.rotulo).toBe('Atendimento exclusivo SUS');
    expect(labeled.turno.rotulo).toBe('Manhã');
    expect(labeled.vinculoSUS.rotulo).toBe('Vinculada ao SUS');
    expect(labeled.naturezaJuridica.codigo).toBe('1244');
    expect(labeled.naturezaJuridica.rotulo).toMatch(/Município/i);
    expect(labeled.nivelAtencaoAmbulatorial.rotulo).toBe('Atenção básica');
    expect(labeled.tipoPrestador.rotulo).toBe('Sem informação');

    // Capacidade — só instalações com quantidade > 0 aparecem
    const codigosInst = labeled.instalacoes.map((i) => i.codigo);
    expect(codigosInst).toEqual(
      expect.arrayContaining(['QTINST15', 'QTINST23', 'QTINST26', 'QTINST29']),
    );
    expect(labeled.instalacoes.find((i) => i.codigo === 'QTINST15')?.quantidade).toBe(2);
    expect(labeled.leitos.total).toBe(0);
    expect(labeled.leitos.porEspecialidade).toHaveLength(0);

    // Serviços de apoio — SERAP01P e SERAP03P estão ativos
    const codigosServ = labeled.servicosApoio.map((s) => s.codigo);
    expect(codigosServ).toEqual(expect.arrayContaining(['SERAP01', 'SERAP03']));
    expect(labeled.servicosApoio.find((s) => s.codigo === 'SERAP01')?.modalidade).toBe('proprio');

    // Atendimentos (flags booleanas ativas)
    expect(labeled.atendimentos).toEqual(expect.arrayContaining(['Atende ambulatorial']));
    expect(labeled.atendimentos).not.toContain('Possui centro cirúrgico');

    // Matriz atividade × convênio
    expect(labeled.matrizAtividadeConvenio.length).toBe(2);
    expect(labeled.matrizAtividadeConvenio[0]).toEqual({
      atividade: 'AP01',
      atividadeRotulo: 'Atenção básica',
      convenio: 'CV01',
      convenioRotulo: 'SUS',
    });
  });

  it('retorna null em todos os campos categóricos quando ausentes', () => {
    const raw = { CNES: '9999999' } as unknown as CnesEstabelecimentoRecord;
    const labeled = labelEstabelecimento(raw);

    expect(labeled.cnes).toBe('9999999');
    expect(labeled.cnpj).toBeNull();
    expect(labeled.nomeFantasia).toBeNull();
    expect(labeled.municipio).toEqual({ codigo: null, nome: null, uf: null });
    expect(labeled.competencia).toBeNull();
    expect(labeled.tipo).toEqual({ codigo: null, rotulo: null });
    expect(labeled.gestao).toEqual({ codigo: null, rotulo: null });
    expect(labeled.instalacoes).toEqual([]);
    expect(labeled.leitos.total).toBe(0);
    expect(labeled.servicosApoio).toEqual([]);
    expect(labeled.atendimentos).toEqual([]);
    expect(labeled.matrizAtividadeConvenio).toEqual([]);
  });

  it('falha rápido quando CNES está ausente', () => {
    expect(() => labelEstabelecimento({} as unknown as CnesEstabelecimentoRecord)).toThrow(
      /CNES ausente/,
    );
  });

  it('preserva codigo cru quando slot QTINST não tem label conhecido', () => {
    const raw = {
      CNES: '1',
      QTINST25: 2,
      QTINST98: 1, // slot hipotético sem label
    } as unknown as CnesEstabelecimentoRecord;
    const labeled = labelEstabelecimento(raw);
    const codigos = labeled.instalacoes.map((i) => ({ codigo: i.codigo, rotulo: i.rotulo }));
    expect(codigos).toContainEqual({ codigo: 'QTINST25', rotulo: null });
    expect(codigos).toContainEqual({ codigo: 'QTINST98', rotulo: null });
  });

  it('soma leitos corretamente quando há múltiplas especialidades', () => {
    const raw = {
      CNES: '1111111',
      LEITHOSP: '8',
      QTLEIT05: 3, // Cirúrgicos
      QTLEIT06: 5, // Clínicos
      QTLEIT23: 2, // UTI adulto
    } as unknown as CnesEstabelecimentoRecord;
    const labeled = labelEstabelecimento(raw);
    expect(labeled.leitos.total).toBe(10); // max(8, 3+5+2) = 10
    expect(labeled.leitos.porEspecialidade).toHaveLength(3);
  });

  it('converte competência "202401" em "2024-01" e rejeita formatos inválidos', () => {
    const valido = labelEstabelecimento({
      CNES: '1',
      COMPETEN: '202401',
    } as unknown as CnesEstabelecimentoRecord);
    expect(valido.competencia).toBe('2024-01');

    const invalido = labelEstabelecimento({
      CNES: '1',
      COMPETEN: '2024',
    } as unknown as CnesEstabelecimentoRecord);
    expect(invalido.competencia).toBeNull();
  });
});

describe('labelEstabelecimento — fixture CNES-ST AC 2024/01', () => {
  it('decodifica todos os registros sem jogar exceção', async () => {
    const records: CnesEstabelecimentoRecord[] = [];
    for await (const record of readDbcRecords(fixture)) {
      records.push(record as CnesEstabelecimentoRecord);
    }
    expect(records.length).toBeGreaterThan(100);

    for (const r of records) {
      const labeled = labelEstabelecimento(r);
      expect(labeled.cnes).not.toBeNull();
      expect(() => JSON.stringify(labeled)).not.toThrow();
    }
  });

  it('amostra de 20 estabelecimentos rende município com UF=AC quando conhecido', async () => {
    const sample: CnesEstabelecimentoRecord[] = [];
    for await (const record of readDbcRecords(fixture)) {
      sample.push(record as CnesEstabelecimentoRecord);
      if (sample.length >= 20) break;
    }

    for (const r of sample) {
      const labeled = labelEstabelecimento(r);
      if (labeled.municipio.nome !== null) expect(labeled.municipio.uf).toBe('AC');
      // Competência no formato ISO quando presente
      if (labeled.competencia !== null) expect(labeled.competencia).toMatch(/^\d{4}-\d{2}$/);
    }
  });

  it('output labeled não contém campos crus QTINST/SERAP/APxCVy no root', async () => {
    const first = await readDbcRecords(fixture)[Symbol.asyncIterator]().next();
    const r = first.value as CnesEstabelecimentoRecord;
    const labeled = labelEstabelecimento(r);
    const keys = Object.keys(labeled);

    for (const k of keys) {
      expect(k).not.toMatch(/^QTINST\d+$/);
      expect(k).not.toMatch(/^QTLEIT\d+$/);
      expect(k).not.toMatch(/^SERAP\d+[PT]$/);
      expect(k).not.toMatch(/^AP\d+CV\d+$/);
    }
  });
});
