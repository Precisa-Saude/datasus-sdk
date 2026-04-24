/**
 * Convenções de caminho no FTP DATASUS para CNES (Cadastro Nacional de
 * Estabelecimentos de Saúde).
 *
 * Estrutura (verificada no FTP oficial):
 *   ftp://ftp.datasus.gov.br/dissemin/publicos/CNES/200508_/Dados/{SUB}/{SUB}{UF}{YYMM}.dbc
 *
 * SUB: subdataset de 2 letras (ST=estabelecimentos, PF=profissionais,
 * EP=equipamentos, LT=leitos, DC=dados complementares, ...).
 *
 * Fase MVP: ST (estabelecimentos) e PF (profissionais) — os dois usados
 * para lookup patient-facing de "laboratórios e médicos próximos".
 */

/**
 * Subdatasets CNES suportados no MVP.
 * - ST: estabelecimentos (dados cadastrais de cada CNES)
 * - PF: profissionais (vínculos de profissionais aos estabelecimentos)
 */
export type CnesSubdataset = 'ST' | 'PF';

const SUPPORTED_SUBS: readonly CnesSubdataset[] = ['ST', 'PF'];

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

export interface CnesPathParams {
  /** Mês 1..12. */
  month: number;
  /** Subdataset: ST (estabelecimentos) ou PF (profissionais). */
  sub: CnesSubdataset;
  /** Sigla UF (2 letras, maiúsculo). */
  uf: string;
  /** Ano completo (>= 2005, histórico CNES começa em 2005/08). */
  year: number;
}

/**
 * Monta o caminho FTP canônico de um arquivo CNES para um subdataset
 * × UF × ano × mês.
 */
export function cnesFtpPath({ month, sub, uf, year }: CnesPathParams): string {
  if (!SUPPORTED_SUBS.includes(sub)) {
    throw new Error(
      `Subdataset CNES inválido: '${sub}' (suportados: ${SUPPORTED_SUBS.join(', ')})`,
    );
  }
  const ufUpper = uf.toUpperCase();
  if (!UF_CODES.has(ufUpper)) {
    throw new Error(`UF inválida: '${uf}'`);
  }
  if (!Number.isInteger(year) || year < 2005 || year > 2100) {
    throw new Error(`Ano inválido: ${year} (esperado entre 2005 e o presente)`);
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error(`Mês inválido: ${month} (esperado entre 1 e 12)`);
  }
  const yy = String(year % 100).padStart(2, '0');
  const mm = String(month).padStart(2, '0');
  return `/dissemin/publicos/CNES/200508_/Dados/${sub}/${sub}${ufUpper}${yy}${mm}.dbc`;
}
