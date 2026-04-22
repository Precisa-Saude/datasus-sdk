/**
 * Matriz `APxxCVyy` — atividade × tipo de convênio.
 *
 * AP01..AP07 representam atividades (atenção básica, média, alta, etc.)
 * e CV01..CV07 representam convênios/fontes de custeio (SUS, planos,
 * particular, etc.). Cada célula da matriz 7×7 é booleana ("1" = oferece,
 * "0" = não oferece essa combinação).
 *
 * Fonte: dicionário CNES DATASUS.
 */

export const ATIVIDADES: Record<string, string> = {
  AP01: 'Atenção básica',
  AP02: 'Média complexidade',
  AP03: 'Alta complexidade',
  AP04: 'Internação',
  AP05: 'Urgência/emergência',
  AP06: 'Diagnóstico e terapia',
  AP07: 'Ensino e pesquisa',
};

export const CONVENIOS: Record<string, string> = {
  CV01: 'SUS',
  CV02: 'Plano de saúde privado',
  CV03: 'Plano de saúde próprio',
  CV04: 'Planos de saúde de terceiros',
  CV05: 'Particular',
  CV06: 'Outros',
  CV07: 'Não se aplica',
};

export interface AtividadeConvenio {
  atividade: string;
  atividadeRotulo: string;
  convenio: string;
  convenioRotulo: string;
}

/**
 * Extrai as combinações atividade × convênio ativas do registro CNES
 * (onde o campo `AP<NN>CV<MM>` vale "1").
 */
export function labelAtividadeConvenio(
  record: Record<string, unknown>,
): readonly AtividadeConvenio[] {
  const out: AtividadeConvenio[] = [];
  for (const [atividade, atividadeRotulo] of Object.entries(ATIVIDADES)) {
    for (const [convenio, convenioRotulo] of Object.entries(CONVENIOS)) {
      const key = `${atividade}${convenio}`;
      if (String(record[key] ?? '').trim() !== '1') continue;
      out.push({ atividade, atividadeRotulo, convenio, convenioRotulo });
    }
  }
  return out;
}
