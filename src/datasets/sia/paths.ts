/**
 * Convenções de caminho no FTP DATASUS para SIA-SUS (Sistema de
 * Informações Ambulatoriais).
 *
 * Estrutura (verificada no FTP oficial — diferente de CNES, **sem**
 * subpasta por subdataset):
 *   ftp://ftp.datasus.gov.br/dissemin/publicos/SIASUS/200801_/Dados/{SUB}{UF}{YYMM}.dbc
 *
 * SUB: subdataset de 2 ou 3 letras (PA=Produção Ambulatorial, BI=Boletim
 * Individualizado, AM/AN/AQ/AR/AB/ABO/ACF/ATD=APACs diversos, PS=RAAS
 * Psicossocial, AD=RAAS Atenção Domiciliar, IMP=medicamentos...).
 *
 * Fase MVP desta package: só PA (Produção Ambulatorial) — é o arquivo
 * que contém TODOS os procedimentos ambulatoriais faturados ao SUS,
 * incluindo exames laboratoriais (SIGTAP grupo 02.02).
 */

/** Subdatasets SIA suportados no MVP. */
export type SiaSubdataset = 'PA';

const SUPPORTED_SUBS: readonly SiaSubdataset[] = ['PA'];

const UF_CODES = new Set([
  'AC',
  'AL',
  'AM',
  'AP',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MG',
  'MS',
  'MT',
  'PA',
  'PB',
  'PE',
  'PI',
  'PR',
  'RJ',
  'RN',
  'RO',
  'RR',
  'RS',
  'SC',
  'SE',
  'SP',
  'TO',
]);

export interface SiaPathParams {
  /** Mês 1..12. */
  month: number;
  /** Subdataset SIA. Só PA suportado no MVP. */
  sub: SiaSubdataset;
  /** Sigla UF (2 letras, maiúsculo). */
  uf: string;
  /** Ano completo (>= 2008, histórico SIA no formato atual começa em 2008/01). */
  year: number;
}

/**
 * Monta o caminho FTP canônico de um arquivo SIA para um subdataset
 * × UF × ano × mês.
 *
 * SIA usa estrutura plana (sem subpasta `{SUB}/`), diferente de CNES.
 */
export function siaFtpPath({ month, sub, uf, year }: SiaPathParams): string {
  if (!SUPPORTED_SUBS.includes(sub)) {
    throw new Error(`Subdataset SIA inválido: '${sub}' (suportados: ${SUPPORTED_SUBS.join(', ')})`);
  }
  const ufUpper = uf.toUpperCase();
  if (!UF_CODES.has(ufUpper)) {
    throw new Error(`UF inválida: '${uf}'`);
  }
  if (!Number.isInteger(year) || year < 2008 || year > 2100) {
    throw new Error(`Ano inválido: ${year} (esperado entre 2008 e o presente)`);
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error(`Mês inválido: ${month} (esperado entre 1 e 12)`);
  }
  const yy = String(year % 100).padStart(2, '0');
  const mm = String(month).padStart(2, '0');
  return `/dissemin/publicos/SIASUS/200801_/Dados/${sub}${ufUpper}${yy}${mm}.dbc`;
}
