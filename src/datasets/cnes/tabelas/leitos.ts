/**
 * Tabelas QTLEIT01..QTLEIT40 — leitos hospitalares por especialidade.
 *
 * Cada coluna conta leitos de uma especialidade. Fonte: tabela `TP_LEITO`
 * do dicionário CNES DATASUS.
 */

export const LEITOS_LABELS: Record<string, string> = {
  QTLEIT05: 'Cirúrgicos',
  QTLEIT06: 'Clínicos',
  QTLEIT07: 'Obstétricos',
  QTLEIT08: 'Pediátricos',
  QTLEIT09: 'Outras especialidades',
  QTLEIT19: 'Hospital-dia',
  QTLEIT20: 'Hospital-dia — cirúrgico',
  QTLEIT21: 'Hospital-dia — psiquiátrico',
  QTLEIT22: 'Hospital-dia — outras',
  QTLEIT23: 'Complementar — UTI adulto',
  QTLEIT32: 'Complementar — UTI infantil',
  QTLEIT34: 'Complementar — UTI neonatal',
  QTLEIT38: 'Complementar — UTI coronariana',
  QTLEIT39: 'Complementar — unidade intermediária',
  QTLEIT40: 'Complementar — unidade intermediária neonatal',
};

export interface LeitosTotais {
  /** Leitos por especialidade (com quantidade > 0). */
  porEspecialidade: readonly { codigo: string; quantidade: number; rotulo: null | string }[];
  /** Soma total de leitos (inclui `LEITHOSP` + todos os `QTLEIT*`). */
  total: number;
}

/** Agrega contagem total de leitos + breakdown por especialidade. */
export function labelLeitos(record: Record<string, unknown>): LeitosTotais {
  const leitHosp = Number(record['LEITHOSP'] ?? 0) || 0;
  const porEspecialidade: { codigo: string; quantidade: number; rotulo: null | string }[] = [];
  let somaEspecialidades = 0;

  for (const [codigo, rotulo] of Object.entries(LEITOS_LABELS)) {
    const raw = record[codigo];
    const quantidade = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(quantidade) || quantidade <= 0) continue;
    porEspecialidade.push({ codigo, quantidade, rotulo });
    somaEspecialidades += quantidade;
  }

  // LEITHOSP é um agregado declarado pelo estabelecimento; usamos o maior
  // entre ele e a soma das especialidades pra evitar total subestimado.
  return { porEspecialidade, total: Math.max(leitHosp, somaEspecialidades) };
}
