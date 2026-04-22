# @precisa-saude/datasus

Toolkit alto-nível para microdados abertos do DATASUS — cliente FTP com cache, schemas tipados, labeling (IBGE, TP_UNID) e agregações prontas para consumo por web apps e CLIs.

## Instalação

```bash
npm install @precisa-saude/datasus
```

## Uso (preview)

```ts
import { cnes, countBy, findMunicipio, topN } from '@precisa-saude/datasus';

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

Outros datasets (SIA-SUS — exames ambulatoriais faturados pelo SUS via códigos SIGTAP) estão no roadmap; o mapeamento LOINC/TUSS/SIGTAP necessário já foi construído (ver abaixo).

## Dados derivados em `data/`

Artefatos de terminologia extraídos de fontes oficiais e comprometidos ao pacote para uso pela biblioteca, CLI e downstream:

| Arquivo                              | Conteúdo                                                                                                   |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `ans-tuss-sigtap-oficial.json`       | Mapeamento **oficial** TUSS ↔ SIGTAP publicado pela ANS (6919 linhas)                                      |
| `sigtap.json`                        | Tabela SIGTAP completa (4982 procedimentos) da competência SIGTAP mais recente                             |
| `loinc-tuss-sigtap.json`             | Mapeamento derivado Biomarcador (LOINC) → TUSS → SIGTAP para os 164 biomarcadores do `@precisa-saude/fhir` |
| `loinc-tuss-sigtap.report.md`        | Relatório humano-legível do mapeamento acima, pra revisão manual                                           |
| `fhir-brasil-tuss-audit.md`          | Auditoria do `BRTUSSProcedimentosLabVS.fsh` do fhir-brasil vs ANS oficial                                  |
| `BRTUSSProcedimentosLabVS.fixed.fsh` | Versão corrigida do VS fhir-brasil com códigos TUSS alinhados à ANS                                        |
| `BRTUSSProcedimentosLabVS.diff.md`   | Diff resumido das correções aplicadas                                                                      |

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
pnpm -F @precisa-saude/datasus run build:ans-mapping

# 2. Regenera o mapeamento biomarcador→SIGTAP (rápido — consome JSON + biomarkers.ts)
pnpm -F @precisa-saude/datasus run build:sigtap-mapping

# 3. Gera VS corrigido pra PR upstream no fhir-brasil
pnpm -F @precisa-saude/datasus run fix:fhir-brasil-tuss

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
