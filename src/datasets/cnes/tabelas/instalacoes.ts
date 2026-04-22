/**
 * Tabela QTINST01..QTINST37 — quantidades de instalações físicas.
 *
 * Cada coluna conta salas/ambientes de um tipo específico. Os rótulos
 * aqui cobrem os slots cujo significado está documentado no dicionário
 * CNES; slots cuja semântica ainda é incerta ficam fora da tabela e o
 * `codigo` aparece cru no output labeled (o consumidor resolve pela
 * vintage específica do dado que está processando).
 *
 * Fonte: dicionário CNES DATASUS (tabela `TP_INST`).
 */

export const INSTALACOES_LABELS: Record<string, string> = {
  QTINST01: 'Consultórios médicos',
  QTINST02: 'Consultórios odontológicos',
  QTINST03: 'Consultórios de outros profissionais (enfermagem, psicologia, etc.)',
  QTINST04: 'Consultórios combinados',
  QTINST05: 'Salas de reabilitação',
  QTINST06: 'Salas de repouso/observação (adulto)',
  QTINST07: 'Salas de repouso/observação (pediátrica)',
  QTINST08: 'Salas de hidratação',
  QTINST09: 'Leitos para exames de eletrofisiologia',
  QTINST10: 'Leitos de hospital-dia',
  QTINST11: 'Salas de higienização',
  QTINST12: 'Salas de coleta de material clínico',
  QTINST13: 'Salas de espera',
  QTINST14: 'Salas de atendimento ambulatorial',
  QTINST15: 'Consultórios indiferenciados',
  QTINST16: 'Salas de pequenas cirurgias',
  QTINST17: 'Salas de gesso',
  QTINST18: 'Salas de repouso/observação indiferenciada',
  QTINST19: 'Salas de sutura',
  QTINST20: 'Salas de nebulização',
  QTINST21: 'Salas de triagem',
  QTINST22: 'Salas de inalação',
  QTINST23: 'Salas de imunização',
  QTINST24: 'Salas de coleta/recepção de exames',
  QTINST27: 'Consultórios de enfermagem',
  QTINST28: 'Consultórios de nutrição',
  QTINST29: 'Salas de curativo',
  QTINST30: 'Salas de eletrocardiografia',
  QTINST31: 'Salas de endoscopia',
  QTINST32: 'Salas de fisioterapia',
  QTINST33: 'Salas de radiologia',
  QTINST34: 'Salas de ultrassonografia',
  QTINST35: 'Salas de tomografia',
  QTINST36: 'Salas de ressonância magnética',
  QTINST37: 'Outras salas especializadas',
};

export interface InstalacaoContagem {
  /** Código da instalação (ex: "QTINST15"). */
  codigo: string;
  /** Quantidade de unidades dessa instalação no estabelecimento. */
  quantidade: number;
  /** Rótulo pt-BR; null quando o código não está mapeado. */
  rotulo: null | string;
}

const MAX_QTINST_SLOT = 99;

/**
 * Extrai todas as instalações com `quantidade > 0` a partir do registro
 * CNES-ST, retornando com rótulo pt-BR. Campos ausentes ou zero são
 * omitidos pra manter o output enxuto; slots cuja semântica não está em
 * `INSTALACOES_LABELS` (ex: QTINST25, QTINST26) aparecem com
 * `rotulo: null` pra que o consumidor consiga resolver pela vintage
 * específica do dado sem silenciar dados.
 *
 * Itera sobre os slots `QTINST01..QTINST99` em ordem numérica fixa —
 * determinístico (independe da ordem dos campos no record) e bounded
 * (pula o scan das ~150 outras colunas do CNES-ST).
 */
export function labelInstalacoes(record: Record<string, unknown>): readonly InstalacaoContagem[] {
  const out: InstalacaoContagem[] = [];
  for (let i = 1; i <= MAX_QTINST_SLOT; i++) {
    const codigo = `QTINST${String(i).padStart(2, '0')}`;
    const raw = record[codigo];
    if (raw === undefined) continue;
    const quantidade = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(quantidade) || quantidade <= 0) continue;
    out.push({ codigo, quantidade, rotulo: INSTALACOES_LABELS[codigo] ?? null });
  }
  return out;
}
