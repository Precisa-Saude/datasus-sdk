/**
 * Loaders alto-nível para CNES (estabelecimentos e profissionais).
 */

import { readDbcRecords } from '@precisa-saude/datasus-dbc';

import type { DownloadOptions } from '../../ftp/index.js';
import { download } from '../../ftp/index.js';
import type { CnesPathParams } from './paths.js';
import { cnesFtpPath } from './paths.js';
import type { CnesEstabelecimentoRecord, CnesProfissionalRecord } from './types.js';

export interface LoadOptions extends Omit<CnesPathParams, 'sub'> {
  /** Opções de cache/FTP. */
  ftp?: Omit<DownloadOptions, 'path'>;
}

/** Baixa e decodifica o CNES-ST (estabelecimentos) de uma UF × mês. */
export async function loadEstabelecimentos(
  options: LoadOptions,
): Promise<CnesEstabelecimentoRecord[]> {
  const path = cnesFtpPath({ ...options, sub: 'ST' });
  const bytes = await download({ ...options.ftp, path });

  const records: CnesEstabelecimentoRecord[] = [];
  for await (const record of readDbcRecords(bytes)) {
    records.push(record as CnesEstabelecimentoRecord);
  }
  return records;
}

/** Baixa e decodifica o CNES-PF (profissionais) de uma UF × mês. */
export async function loadProfissionais(options: LoadOptions): Promise<CnesProfissionalRecord[]> {
  const path = cnesFtpPath({ ...options, sub: 'PF' });
  const bytes = await download({ ...options.ftp, path });

  const records: CnesProfissionalRecord[] = [];
  for await (const record of readDbcRecords(bytes)) {
    records.push(record as CnesProfissionalRecord);
  }
  return records;
}

/**
 * Versão streaming do CNES-ST — recomendado para varreduras single-pass ou
 * processamento com `--limit` no CLI. Memória constante.
 */
export async function* streamEstabelecimentos(
  options: LoadOptions,
): AsyncIterable<CnesEstabelecimentoRecord> {
  const path = cnesFtpPath({ ...options, sub: 'ST' });
  const bytes = await download({ ...options.ftp, path });
  for await (const record of readDbcRecords(bytes)) {
    yield record as CnesEstabelecimentoRecord;
  }
}

/** Versão streaming do CNES-PF. */
export async function* streamProfissionais(
  options: LoadOptions,
): AsyncIterable<CnesProfissionalRecord> {
  const path = cnesFtpPath({ ...options, sub: 'PF' });
  const bytes = await download({ ...options.ftp, path });
  for await (const record of readDbcRecords(bytes)) {
    yield record as CnesProfissionalRecord;
  }
}
