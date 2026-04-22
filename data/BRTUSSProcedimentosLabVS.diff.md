# BRTUSSProcedimentosLabVS — códigos TUSS corrigidos

Gerado por `scripts/fix-fhir-brasil-tuss.ts`.

## Fonte autoritativa

- **Arquivo:** `MAPEAMENTO TUSS x SIGTAP 2017 04.xlsx`
- **Publicador:** Agência Nacional de Saúde Suplementar (ANS)
- **Página de origem:** https://www.gov.br/ans/pt-br/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-2013-tiss/padrao-tiss-tabelas-relacionadas
- **Download direto:** https://www.gov.br/ans/pt-br/arquivos/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-tiss/padrao-tiss-tabelas-relacionadas/padraotiss_mapeamento_tuss_sigtap.zip
- **Licença:** Dado aberto — Lei de Acesso à Informação (Lei 12.527/2011)
- **Competência:** 2017-04

> Trabalho conjunto ANS (Agência Nacional de Saúde Suplementar) + COPISS + Ministério da Saúde, conduzido de 2015 a 2017 (baseado em ISO/TR 12300:2014). A versão em uso é a competência 2017-04.

Compara cada entrada `* $TUSS#CODE "Display"` contra a tabela ANS oficial. Quando o `CODE` não bate com o nome oficial desse TUSS na ANS, busca por nome pra achar o código correto.

- Total de entradas: **59**
- `verified` (código original correto): **1**
- `fixed` (código substituído): **54**
- `needs-review` (sem match confiável): **4**

## `fixed` — códigos TUSS substituídos

| Display (fhir-brasil)                                    | TUSS antigo | TUSS novo  | Nome oficial ANS                                                                           | Confiança |
| -------------------------------------------------------- | ----------- | ---------- | ------------------------------------------------------------------------------------------ | --------- |
| Hemograma completo (eritrograma, leucograma e plaquetas) | `40304370`  | `40304361` | Hemograma com contagem de plaquetas ou frações (eritrograma, leucograma, plaquetas)        | 0.73      |
| Reticulócitos, contagem                                  | `40304540`  | `40304558` | Reticulócitos, contagem                                                                    | 1.00      |
| Velocidade de hemossedimentação (VHS)                    | `40304060`  | `40304370` | Hemossedimentação, (VHS) - pesquisa e/ou dosagem                                           | 0.90      |
| Glicose                                                  | `40301630`  | `40302040` | Glicose - pesquisa e/ou dosagem                                                            | 1.00      |
| Hemoglobina glicada (A1C)                                | `40302040`  | `40302733` | Hemoglobina glicada (Fração A1c) - pesquisa e/ou dosagem                                   | 0.92      |
| Insulina                                                 | `40301770`  | `40316360` | Insulina - pesquisa e/ou dosagem                                                           | 1.00      |
| Ácido úrico                                              | `40301354`  | `40301150` | Ácido úrico - pesquisa e/ou dosagem                                                        | 1.00      |
| Creatina quinase (CK total)                              | `40301460`  | `40301621` | Creatina - pesquisa e/ou dosagem                                                           | 0.80      |
| Colesterol total                                         | `40301397`  | `40301605` | Colesterol total - pesquisa e/ou dosagem                                                   | 1.00      |
| Colesterol HDL                                           | `40301400`  | `40301583` | Colesterol (HDL) - pesquisa e/ou dosagem                                                   | 1.00      |
| Colesterol LDL                                           | `40301419`  | `40301591` | Colesterol (LDL) - pesquisa e/ou dosagem                                                   | 1.00      |
| Triglicerídeos                                           | `40302695`  | `40302547` | Triglicerídeos - pesquisa e/ou dosagem                                                     | 1.00      |
| Colesterol VLDL                                          | `40301427`  | `40302695` | Colesterol (VLDL) - pesquisa e/ou dosagem                                                  | 1.00      |
| Apolipoproteína A-1                                      | `40301338`  | `40301354` | Apolipoproteína A (Apo A) - pesquisa e/ou dosagem                                          | 0.85      |
| Apolipoproteína B                                        | `40301346`  | `40301354` | Apolipoproteína A (Apo A) - pesquisa e/ou dosagem                                          | 0.85      |
| Lipoproteína (a)                                         | `40302580`  | `40302210` | Lipoproteína (a) - Lp (a) - pesquisa e/ou dosagem                                          | 0.85      |
| Albumina                                                 | `40301311`  | `40301222` | Albumina - pesquisa e/ou dosagem                                                           | 1.00      |
| Proteínas totais                                         | `40302610`  | `40302377` | Proteínas totais - pesquisa e/ou dosagem                                                   | 1.00      |
| Fosfatase alcalina                                       | `40301575`  | `40301885` | Fosfatase alcalina - pesquisa e/ou dosagem                                                 | 1.00      |
| Gama-glutamil transferase (GGT)                          | `40302903`  | `40301990` | Gama-glutamil transferase - pesquisa e/ou dosagem                                          | 0.92      |
| Transaminase glutâmico-pirúvica (TGP/ALT)                | `40301699`  | `40403840` | Transaminase pirúvica - TGP ou ALT por componente hemoterápico - pesquisa e/ou dosagem     | 0.73      |
| Creatinina                                               | `40301443`  | `40301630` | Creatinina - pesquisa e/ou dosagem                                                         | 1.00      |
| Ureia                                                    | `40302709`  | `40302580` | Uréia - pesquisa e/ou dosagem                                                              | 1.00      |
| Potássio                                                 | `40301885`  | `40302318` | Potássio - pesquisa e/ou dosagem                                                           | 1.00      |
| Sódio                                                    | `40301915`  | `40302423` | Sódio - pesquisa e/ou dosagem                                                              | 1.00      |
| Clearance de creatinina                                  | `40302857`  | `40301508` | Clearance de creatinina                                                                    | 1.00      |
| Cálcio                                                   | `40301389`  | `40301400` | Cálcio - pesquisa e/ou dosagem                                                             | 1.00      |
| Magnésio                                                 | `40301826`  | `40302237` | Magnésio - pesquisa e/ou dosagem                                                           | 1.00      |
| Ferro sérico                                             | `40301567`  | `40301842` | Ferro sérico - pesquisa e/ou dosagem                                                       | 1.00      |
| Ferritina                                                | `40301559`  | `40316270` | Ferritina - pesquisa e/ou dosagem                                                          | 1.00      |
| Capacidade de ligação do ferro (TIBC)                    | `40301362`  | `40301427` | Capacidade de fixação de ferro - pesquisa e/ou dosagem                                     | 0.59      |
| TSH                                                      | `40316491`  | `40316521` | Tireoestimulante, hormônio (TSH) - pesquisa e/ou dosagem                                   | 0.80      |
| T4 livre                                                 | `40316556`  | `40316491` | T4 livre - pesquisa e/ou dosagem                                                           | 1.00      |
| T3 livre                                                 | `40316548`  | `40316467` | T3 livre - pesquisa e/ou dosagem                                                           | 1.00      |
| Anticorpos anti-tireoglobulina                           | `40316130`  | `40316530` | Tireoglobulina - pesquisa e/ou dosagem                                                     | 0.80      |
| Anticorpos anti-peroxidase tireoidiana (anti-TPO)        | `40316122`  | `40316157` | Anti-TPO - pesquisa e/ou dosagem                                                           | 0.82      |
| Estradiol                                                | `40316220`  | `40316246` | Estradiol - pesquisa e/ou dosagem                                                          | 1.00      |
| FSH — Hormônio folículo-estimulante                      | `40316360`  | `40316289` | Folículo estimulante, hormônio (FSH) - pesquisa e/ou dosagem                               | 1.00      |
| LH — Hormônio luteinizante                               | `40316378`  | `40316335` | Hormônio luteinizante (LH) - pesquisa e/ou dosagem                                         | 1.00      |
| Progesterona                                             | `40316440`  | `40316408` | Progesterona - pesquisa e/ou dosagem                                                       | 1.00      |
| Prolactina                                               | `40316459`  | `40316416` | Prolactina - pesquisa e/ou dosagem                                                         | 1.00      |
| Testosterona total                                       | `40316521`  | `40316513` | Testosterona total - pesquisa e/ou dosagem                                                 | 1.00      |
| Testosterona livre                                       | `40316530`  | `40316505` | Testosterona livre - pesquisa e/ou dosagem                                                 | 1.00      |
| DHEA-Sulfato                                             | `40316203`  | `40316459` | Sulfato de dehidroepiandrosterona (S-DHEA) - pesquisa e/ou dosagem                         | 0.90      |
| Vitamina B12                                             | `40302750`  | `40316572` | Vitamina B12 - pesquisa e/ou dosagem                                                       | 1.00      |
| Folato (ácido fólico)                                    | `40301583`  | `40301087` | Ácido fólico, pesquisa e/ou dosagem nos eritrócitos                                        | 0.62      |
| Vitamina D (25-hidroxi)                                  | `40302717`  | `40302830` | Vitamina "D" 25 HIDROXI, pesquisa e/ou dosagem (Vitamina D3)                               | 0.92      |
| Alfa-fetoproteína (AFP)                                  | `40308014`  | `40316068` | Alfa-fetoproteína - pesquisa e/ou dosagem                                                  | 0.90      |
| CA-125                                                   | `40308049`  | `40316378` | Marcadores tumorais (CA 19.9, CA 125, CA 72-4, CA 15-3, etc.) cada - pesquisa e/ou dosagem | 0.77      |
| Antígeno carcinoembrionário (CEA)                        | `40308120`  | `40316122` | Antígeno carcinoembriogênico (CEA) - pesquisa e/ou dosagem                                 | 0.62      |
| PSA total                                                | `40308189`  | `40316149` | Antígeno específico prostático total (PSA) - pesquisa e/ou dosagem                         | 0.77      |
| PSA livre                                                | `40308197`  | `40316130` | Antígeno específico prostático livre (PSA livre) - pesquisa e/ou dosagem                   | 0.82      |
| Proteína C-reativa (PCR)                                 | `40302466`  | `40304507` | Proteína C - pesquisa e/ou dosagem                                                         | 0.80      |
| Microalbuminúria                                         | `40311295`  | `40311171` | Microalbuminúria                                                                           | 1.00      |

## `needs-review` — sem correspondência ANS confiável

Nenhum TUSS oficial teve nome suficientemente próximo do display. Comentadas no `.fsh.fixed` — decidir manualmente se o código original está certo, se o nome precisa virar mais claro, ou se o biomarcador deve ser removido do VS.

- Hemograma completo (TUSS original `40304361`)
- Bilirrubina total e frações (TUSS original `40301370`)
- Transaminase glutâmico-oxalacética (TGO/AST) (TUSS original `40301680`)
- Urina tipo I (EAS) (TUSS original `40311104`)

## `verified` — códigos confirmados sem mudança

- Cortisol — TUSS `40316190`
