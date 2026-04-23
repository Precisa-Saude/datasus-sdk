/**
 * Loaders alto-nível para SIA-SUS (Produção Ambulatorial).
 *
 * Observação de volume: PA é **ordens de magnitude maior** que CNES-ST
 * — uma UF grande × mês recente pode ter milhões de registros. A
 * variante `stream*` é o default recomendado; `load*` existe por
 * simetria com CNES mas só é viável para UFs pequenas (AC/RR/AP/TO) ou
 * com `--limit`.
 *
 * Schema vintage suportado: SIA-PA 2008+ (60 colunas na vintage 2024).
 */

import { readDbcRecords } from '@precisa-saude/datasus-dbc';

import type { DownloadOptions } from '../../ftp/index.js';
import { download } from '../../ftp/index.js';
import type { SiaPathParams } from './paths.js';
import { siaFtpPath } from './paths.js';
import type { SiaProducaoAmbulatorialRecord } from './types.js';

export interface LoadOptions extends Omit<SiaPathParams, 'sub'> {
  /** Opções de cache/FTP. */
  ftp?: Omit<DownloadOptions, 'path'>;
}

/**
 * Baixa e decodifica o SIA-PA de uma UF × mês, buferizando todos os
 * registros. **Use `streamProducaoAmbulatorial` em produção** — esta
 * função é viável apenas para UFs pequenas ou cenários de teste.
 */
export async function loadProducaoAmbulatorial(
  options: LoadOptions,
): Promise<SiaProducaoAmbulatorialRecord[]> {
  const path = siaFtpPath({ ...options, sub: 'PA' });
  const bytes = await download({ ...options.ftp, path });

  const records: SiaProducaoAmbulatorialRecord[] = [];
  for await (const record of readDbcRecords(bytes)) {
    records.push(record as SiaProducaoAmbulatorialRecord);
  }
  return records;
}

/**
 * Versão streaming do SIA-PA — recomendado como default. Memória
 * constante mesmo em UFs grandes × múltiplos meses.
 */
export async function* streamProducaoAmbulatorial(
  options: LoadOptions,
): AsyncIterable<SiaProducaoAmbulatorialRecord> {
  const path = siaFtpPath({ ...options, sub: 'PA' });
  const bytes = await download({ ...options.ftp, path });
  for await (const record of readDbcRecords(bytes)) {
    yield record as SiaProducaoAmbulatorialRecord;
  }
}
