# @precisa-saude/datasus-sdk

Toolkit alto-nível para microdados abertos do DATASUS — cliente FTP com cache, schemas tipados, labeling (IBGE, TP_UNID) e agregações prontas para consumo por web apps e CLIs.

## Instalação

```bash
npm install @precisa-saude/datasus-sdk
```

## Uso (preview)

```ts
import { cnes, countBy, findMunicipio, topN } from '@precisa-saude/datasus-sdk';

// Streaming — memória constante
const counts: Record<string, number> = {};
for await (const record of cnes.streamEstabelecimentos({ uf: 'SP', year: 2024, month: 3 })) {
  counts[record.CODUFMUN] = (counts[record.CODUFMUN] ?? 0) + 1;
}

const top10 = topN(counts, 10).map(({ count, key }) => {
  const m = findMunicipio(key);
  return { estabelecimentos: count, municipio: m?.nome, uf: m?.uf };
});

console.log(JSON.stringify(top10, null, 2));
```

## Datasets suportados

- **CNES** — Cadastro Nacional de Estabelecimentos de Saúde (ST = estabelecimentos, PF = profissionais)
- **SIA-SUS** — Sistema de Informações Ambulatoriais (PA = produção ambulatorial, incluindo procedimentos laboratoriais faturados via SIGTAP). Stream via `sia.streamProducaoAmbulatorial` + labeling/enriquecimento LOINC em `labelProducaoAmbulatorial` / `enrichWithLoinc`.

Mapeamento LOINC↔TUSS↔SIGTAP usado pelo SIA fica no módulo `terminology` (ver abaixo).

## Terminologia LOINC ↔ TUSS ↔ SIGTAP

Módulo `terminology` fecha a ponte entre o catálogo de biomarcadores LOINC do `@precisa-saude/fhir`, o padrão TUSS da saúde suplementar (ANS) e os códigos SIGTAP faturáveis pelo SUS.

```ts
import {
  listBiomarkers,
  loincToSigtap,
  lookupSigtap,
  lookupTuss,
} from '@precisa-saude/datasus-sdk';

// Biomarcador FHIR → procedimento SUS
const m = loincToSigtap('2085-9'); // Colesterol HDL
// → { loinc: '2085-9', biomarker: { code: 'HDL', display: 'Colesterol HDL' },
//     sigtap: '0202010279', sigtapAlso: [], tuss: '40301583', confidence: 'high',
//     reversePrimary: true, source: 'llm-refined', reasoning: '...',
//     noMatchReason: null, reviewNote: null }

// Procedimento SUS → biomarcador (eixo de join do SIA-SUS)
sigtapToLoinc('0202010473'); // Dosagem de glicose → Glucose (2345-7)

// Nome pt-BR do procedimento SUS
lookupSigtap(m!.sigtap!); // { code: '0202010279', name: 'DOSAGEM DE COLESTEROL HDL' }

// Detalhes TUSS + lista de SIGTAPs equivalentes segundo a ANS
lookupTuss(m!.tuss!);
// → { code: '40301583', name: 'Colesterol (HDL) — pesquisa e/ou dosagem',
//     sigtapEquivalents: [{ code: '0202010279', name: '...', equivalencia: '3' }] }

// Percorrer todos os 166 biomarcadores do catálogo
for (const entry of listBiomarkers()) {
  /* ... */
}
```

`loincToSigtap` aceita tanto o código LOINC canônico (`2085-9`) quanto o código curto do biomarcador (`HDL`). Quando o LLM não conseguiu decidir, `sigtap`/`tuss` vêm `null` e `noMatchReason` traz a explicação — útil pra listar biomarcadores sem procedimento SUS equivalente.

### Sentido reverso: SIGTAP → LOINC

Vários biomarcadores podem apontar para o mesmo SIGTAP — glicose sérica e glicose na urina caem ambas em "Dosagem de glicose", T3 livre e T3 total em "Dosagem de triiodotironina". No sentido direto isso é correto (é como o SUS fatura). No sentido reverso só um pode rotular o procedimento, e `sigtapToLoinc` devolve o que tem `reversePrimary: true`: o analito que o procedimento SUS de fato mede (sérico em vez de urinário, total em vez de livre ou fração). Um SIGTAP cujo grupo não elege representante — como `0202031039` IgE alérgeno-específica, genérica demais para um único LOINC — retorna `null`. A escolha é explícita no JSON (`reverse_primary`), nunca pela ordem do arquivo; o módulo falha ao carregar se dois biomarcadores reivindicarem o mesmo SIGTAP.

`sigtapAlso` lista códigos SIGTAP adicionais que também representam o biomarcador (PCR tem um código genérico, `0202030202`, e um quantitativo, `0202030083`); todos resolvem de volta ao mesmo mapeamento.

Entradas com `source: 'manual-review'` foram criadas, corrigidas ou conferidas à mão depois do refinamento LLM; `reviewNote` explica o quê e por quê. Revisão de 2026-10-06: ureia (`3094-0` BUN → `3091-6`), vitamina D (`1989-3` só D3 → `62292-8` D2+D3), eGFR desfeito (o SIGTAP `0208040080` é medicina nuclear), novas entradas `Magnesium` (`19123-9`) e `T3Total` (`3053-6`), e representantes eleitos para os nove SIGTAPs compartilhados.

## Dados derivados de fontes oficiais

Artefatos de terminologia embutidos no pacote, extraídos de fontes abertas:

| Arquivo                              | Localização             | Conteúdo                                                                                                                                            |
| ------------------------------------ | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ans-tuss-sigtap.json`               | `src/terminology/data/` | Mapeamento **oficial** TUSS ↔ SIGTAP publicado pela ANS (6919 linhas)                                                                               |
| `sigtap.json`                        | `src/terminology/data/` | Tabela SIGTAP completa (4982 procedimentos) da competência mais recente                                                                             |
| `loinc-biomarkers.json`              | `src/terminology/data/` | Mapeamento Biomarcador (LOINC) → TUSS → SIGTAP para 166 biomarcadores (164 do `@precisa-saude/fhir` + 2 manuais), refinado por LLM e revisado à mão |
| `loinc-tuss-sigtap.json`             | `data/`                 | Mapeamento fuzzy (sem LLM) — mantido pra auditoria                                                                                                  |
| `loinc-tuss-sigtap.report.md`        | `data/`                 | Relatório humano-legível do mapeamento fuzzy, pra revisão manual                                                                                    |
| `loinc-tuss-sigtap.llm.report.md`    | `data/`                 | Relatório do refinamento LLM (modelo, prompts, decisões)                                                                                            |
| `fhir-brasil-tuss-audit.md`          | `data/`                 | Auditoria do `BRTUSSProcedimentosLabVS.fsh` do fhir-brasil vs ANS oficial                                                                           |
| `BRTUSSProcedimentosLabVS.fixed.fsh` | `data/`                 | Versão corrigida do VS fhir-brasil com TUSS alinhados à ANS                                                                                         |
| `BRTUSSProcedimentosLabVS.diff.md`   | `data/`                 | Diff resumido das correções aplicadas                                                                                                               |

### Fontes oficiais

- **Tabela TUSS ↔ SIGTAP** — publicada pela ANS (Agência Nacional de Saúde Suplementar) em parceria com COPISS e Ministério da Saúde. Trabalho conduzido de 2015 a 2017 sob a norma ISO/TR 12300:2014. Distribuída como `MAPEAMENTO TUSS x SIGTAP 2017 04.xlsx`.
  - Página: [gov.br/ans — Padrão TISS, tabelas relacionadas](https://www.gov.br/ans/pt-br/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-2013-tiss/padrao-tiss-tabelas-relacionadas)
  - Download direto: [padraotiss_mapeamento_tuss_sigtap.zip](https://www.gov.br/ans/pt-br/arquivos/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-tiss/padrao-tiss-tabelas-relacionadas/padraotiss_mapeamento_tuss_sigtap.zip)
  - Licença: dado aberto (Lei 12.527/2011 — Lei de Acesso à Informação)

- **Tabela SIGTAP (Procedimentos SUS)** — publicada mensalmente pelo DATASUS:
  - FTP: `ftp2.datasus.gov.br:/public/sistemas/tup/downloads/` (`TabelaUnificada_YYYYMM_vVVVV.zip`)
  - Página: [sigtap.datasus.gov.br](http://sigtap.datasus.gov.br/)

- **Biomarcadores LOINC** — importados de `@precisa-saude/fhir`, ver [fhir-brasil](https://github.com/Precisa-Saude/fhir-brasil).

### Regenerar

Os dados vêm de fontes externas; quando a ANS ou o DATASUS publicar nova versão, rode:

```bash
# 1. Baixa e extrai o XLSX oficial TUSS↔SIGTAP (one-shot; ANS atualiza raramente)
pnpm -F @precisa-saude/datasus-sdk run build:ans-mapping

# 2. Regenera o mapeamento biomarcador→SIGTAP (rápido — consome JSON + biomarkers.ts)
pnpm -F @precisa-saude/datasus-sdk run build:sigtap-mapping

# 3. Gera VS corrigido pra PR upstream no fhir-brasil
pnpm -F @precisa-saude/datasus-sdk run fix:fhir-brasil-tuss

# 4. (Opcional) Refina o mapeamento com LLM via OpenRouter — captura erros
#    semânticos que o fuzzy match comete (Apo A vs Apo B, sangue oculto urina
#    vs fezes, CAC vs cálcio sérico, etc.). Ver /scripts/llm-refine-mapping.ts.
#    Requer OPENROUTER_API_KEY exportada.
pnpm run llm:refine-mapping
```

Scripts in-package em [`scripts/`](./scripts/) — TypeScript, sem deps externas além das já declaradas (`basic-ftp`). Parser XLSX nativo (regex sobre OOXML).

Script de refinamento por LLM fica em [`/scripts/llm-refine-mapping.ts`](../../scripts/llm-refine-mapping.ts) na raiz do monorepo — pode ser reusado em outros contextos (não amarra a terminologia ao pacote core).

## Licença

[Apache-2.0](../../LICENSE)
