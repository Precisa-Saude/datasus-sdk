# Mapeamento Biomarcador (LOINC) → TUSS → SIGTAP

Gerado por `scripts/build-sigtap-mapping.ts`.

## Fonte

- **Arquivo:** `MAPEAMENTO TUSS x SIGTAP 2017 04.xlsx`
- **Publicador:** Agência Nacional de Saúde Suplementar (ANS)
- **Página de origem:** https://www.gov.br/ans/pt-br/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-2013-tiss/padrao-tiss-tabelas-relacionadas
- **Download direto:** https://www.gov.br/ans/pt-br/arquivos/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-tiss/padrao-tiss-tabelas-relacionadas/padraotiss_mapeamento_tuss_sigtap.zip
- **Licença:** Dado aberto — Lei de Acesso à Informação (Lei 12.527/2011)
- **Competência:** 2017-04
- **Extraído em:** 2026-04-21T20:53:59.112Z

> Trabalho conjunto ANS (Agência Nacional de Saúde Suplementar) + COPISS + Ministério da Saúde, conduzido de 2015 a 2017 (baseado em ISO/TR 12300:2014). A versão em uso é a competência 2017-04.

**Escopo**: todos os biomarcadores visíveis em `biomarkers.ts` do fhir-brasil. TUSS encontrado via matching fuzzy por nome pt-BR contra os termos TUSS oficiais — o `BRTUSSProcedimentosLabVS.fsh` do fhir-brasil foi **ignorado** porque os códigos TUSS lá estão desalinhados com a tabela ANS (ver `fhir-brasil-tuss-audit.md`).

## Graus de equivalência (ANS/ISO TR 12300:2014)

1. Léxico + conceitual idêntico
2. Sinonímia (conceito igual, nomes diferentes)
3. TUSS **menos específico** que SIGTAP (SIGTAP mais granular)
4. TUSS **mais específico** que SIGTAP (TUSS mais granular)
5. Sem mapeamento possível

## Status

- **`auto`** — 1 SIGTAP grau 1 ou 2. Revisão opcional.
- **`ambiguous_strong`** — múltiplos SIGTAPs grau 1 ou 2. **Ação**: escolher `selected` no JSON.
- **`ambiguous_weak`** — só grau 3 ou 4 (relação hierárquica, 1-pra-N ou N-pra-1). **Ação**: avaliar se a relação é aceitável pro caso de uso.
- **`no_sigtap_match`** — biomarcador sem TUSS identificado, ou TUSS com grau 5 apenas. Tipicamente exame privado/genético/não-SUS.

- Biomarcadores totais: **164**
- `auto`: **15**
- `ambiguous_strong`: **0**
- `ambiguous_weak`: **64**
- `no_sigtap_match`: **85**

## `auto` — 1 SIGTAP grau 1 ou 2

| Biomarcador                                   | LOINC   | TUSS       | SIGTAP       | Grau | Procedimento SIGTAP                                    |
| --------------------------------------------- | ------- | ---------- | ------------ | ---- | ------------------------------------------------------ |
| Fator Reumatoide                              | 11572-5 | `40304175` | `0202020207` | 1    | DOSAGEM DE FATOR V                                     |
| Contagem de Leucócitos                        | 6690-2  | `40304418` | `0202020398` | 2    | LEUCOGRAMA                                             |
| Hemoglobina Glicada                           | 4548-4  | `40304345` | `0202020304` | 1    | DOSAGEM DE HEMOGLOBINA                                 |
| Hematócrito                                   | 4544-3  | `40304337` | `0202020371` | 1    | HEMATOCRITO                                            |
| Hemoglobina                                   | 718-7   | `40304345` | `0202020304` | 1    | DOSAGEM DE HEMOGLOBINA                                 |
| Hemoglobina Corpuscular Média                 | 785-6   | `40304345` | `0202020304` | 1    | DOSAGEM DE HEMOGLOBINA                                 |
| Concentração de Hemoglobina Corpuscular Média | 786-4   | `40304345` | `0202020304` | 1    | DOSAGEM DE HEMOGLOBINA                                 |
| Contagem de Plaquetas                         | 777-3   | `40304361` | `0202020380` | 2    | HEMOGRAMA COMPLETO                                     |
| Tempo de Protrombina                          | 5902-2  | `40304590` | `0202020142` | 2    | DETERMINACAO DE TEMPO E ATIVIDADE DA PROTROMBINA (TAP) |
| Reticulócitos                                 | 4679-7  | `40304558` | `0202020037` | 1    | CONTAGEM DE RETICULOCITOS                              |
| Taxa de Filtração Glomerular Estimada         | 98979-8 | `40704076` | `0208040080` | 1    | DETERMINACAO DE FILTRACAO GLOMERULAR                   |
| Sangue Oculto na Urina                        | 5794-3  | `40303136` | `0202040143` | 1    | PESQUISA DE SANGUE OCULTO NAS FEZES                    |
| DMO Corpo Total                               | —       | `40706010` | `0208050027` | 2    | CINTILOGRAFIA DE ESQUELETO (CORPO INTEIRO)             |
| T-Score Corpo Total                           | —       | `40706010` | `0208050027` | 2    | CINTILOGRAFIA DE ESQUELETO (CORPO INTEIRO)             |
| Z-Score Corpo Total                           | —       | `40706010` | `0208050027` | 2    | CINTILOGRAFIA DE ESQUELETO (CORPO INTEIRO)             |

## `ambiguous_strong` — Múltiplos SIGTAPs grau 1 ou 2

## `ambiguous_weak` — Só grau 3 ou 4 (hierárquico)

### Colesterol HDL (LOINC 2085-9) — TUSS `40301583` (Colesterol (HDL) - pesquisa e/ou dosagem)

- `0202010279` — DOSAGEM DE COLESTEROL HDL _(grau 3)_

### Proteína C-Reativa (LOINC 1988-5) — TUSS `40304507` (Proteína C - pesquisa e/ou dosagem)

- `0202030202` — DOSAGEM DE PROTEINA C REATIVA _(grau 4)_

### Colesterol LDL (LOINC 2089-1) — TUSS `40301591` (Colesterol (LDL) - pesquisa e/ou dosagem)

- `0202010287` — DOSAGEM DE COLESTEROL LDL _(grau 3)_

### Colesterol Não-HDL (LOINC 43396-1) — TUSS `40301583` (Colesterol (HDL) - pesquisa e/ou dosagem)

- `0202010279` — DOSAGEM DE COLESTEROL HDL _(grau 3)_

### Colesterol Total (LOINC 2093-3) — TUSS `40301605` (Colesterol total - pesquisa e/ou dosagem)

- `0202010295` — DOSAGEM DE COLESTEROL TOTAL _(grau 3)_

### Razão Colesterol Total / HDL (LOINC 9830-1) — TUSS `40301583` (Colesterol (HDL) - pesquisa e/ou dosagem)

- `0202010279` — DOSAGEM DE COLESTEROL HDL _(grau 3)_

### Triglicerídeos (LOINC 2571-8) — TUSS `40302547` (Triglicerídeos - pesquisa e/ou dosagem)

- `0202010678` — DOSAGEM DE TRIGLICERIDEOS _(grau 3)_

### Percentil CAC (LOINC —) — TUSS `40301400` (Cálcio - pesquisa e/ou dosagem)

- `0202010210` — DOSAGEM DE CALCIO _(grau 3)_

### Anticorpos Anti-Tireoglobulina (LOINC 8098-6) — TUSS `40316530` (Tireoglobulina - pesquisa e/ou dosagem)

- `0202060365` — DOSAGEM DE TIREOGLOBULINA _(grau 3)_

### Hormônio Tireoestimulante (LOINC 3016-3) — TUSS `40316521` (Tireoestimulante, hormônio (TSH) - pesquisa e/ou dosagem)

- `0202060250` — DOSAGEM DE HORMONIO TIREOESTIMULANTE (TSH) _(grau 3)_

### Tiroxina Livre (LOINC 3024-7) — TUSS `40316491` (T4 livre - pesquisa e/ou dosagem)

- `0202060381` — DOSAGEM DE TIROXINA LIVRE (T4 LIVRE) _(grau 3)_
- `0202060012` — DETERMINACAO DE INDICE DE TIROXINA LIVRE _(grau —)_

### Triiodotironina Livre (LOINC 3051-0) — TUSS `40316467` (T3 livre - pesquisa e/ou dosagem)

- `0202060390` — DOSAGEM DE TRIIODOTIRONINA (T3) _(grau 3)_

### Tiroxina (LOINC 3026-2) — TUSS `40316548` (Tiroxina (T4) - pesquisa e/ou dosagem)

- `0202060373` — DOSAGEM DE TIROXINA (T4) _(grau 3)_

### Eosinófilos (LOINC 713-8) — TUSS `40303047` (Eosinófilos, pesquisa nas fezes)

- `0202040062` — PESQUISA DE EOSINOFILOS _(grau 4)_

### Imunoglobulina A (LOINC 2458-8) — TUSS `40307220` (IgA - pesquisa e/ou dosagem)

- `0202030156` — DOSAGEM DE IMUNOGLOBULINA A (IGA) _(grau 3)_

### Imunoglobulina G (LOINC 2465-3) — TUSS `40307280` (IgG - pesquisa e/ou dosagem)

- `0202030172` — DOSAGEM DE IMUNOGLOBULINA G (IGG) _(grau 3)_

### IgE Total (LOINC 19113-0) — TUSS `40316343` (Imunoglobulina (IGE) - pesquisa e/ou dosagem)

- `0202030164` — DOSAGEM DE IMUNOGLOBULINA E (IGE) _(grau 3)_

### IgE E1 Epitélio de Gato (LOINC 6833-8) — TUSS `40307271` (IgE, total - pesquisa e/ou dosagem)

- `0202030164` — DOSAGEM DE IMUNOGLOBULINA E (IGE) _(grau 3)_

### IgE GX1 Gramíneas (LOINC 30189-5) — TUSS `40307271` (IgE, total - pesquisa e/ou dosagem)

- `0202030164` — DOSAGEM DE IMUNOGLOBULINA E (IGE) _(grau 3)_

### DHEA-Sulfato (LOINC 2191-5) — TUSS `40316459` (Sulfato de dehidroepiandrosterona (S-DHEA) - pesquisa e/ou dosagem)

- `0202060330` — DOSAGEM DE SULFATO DE HIDROEPIANDROSTERONA (DHEAS) _(grau 3)_

### Estradiol (LOINC 2243-4) — TUSS `40316246` (Estradiol - pesquisa e/ou dosagem)

- `0202060160` — DOSAGEM DE ESTRADIOL _(grau 3)_

### Hormônio Folículo-Estimulante (LOINC 15067-2) — TUSS `40316289` (Folículo estimulante, hormônio (FSH) - pesquisa e/ou dosagem)

- `0202060233` — DOSAGEM DE HORMONIO FOLICULO-ESTIMULANTE (FSH) _(grau 3)_

### Hormônio Luteinizante (LOINC 10501-5) — TUSS `40316335` (Hormônio luteinizante (LH) - pesquisa e/ou dosagem)

- `0202060241` — DOSAGEM DE HORMONIO LUTEINIZANTE (LH) _(grau 3)_

### Prolactina (LOINC 2842-3) — TUSS `40316416` (Prolactina - pesquisa e/ou dosagem)

- `0202060306` — DOSAGEM DE PROLACTINA _(grau 3)_

### Testosterona Livre (LOINC 2991-8) — TUSS `40316505` (Testosterona livre - pesquisa e/ou dosagem)

- `0202060357` — DOSAGEM DE TESTOSTERONA LIVRE _(grau 3)_

### Testosterona Total (LOINC 2986-8) — TUSS `40316513` (Testosterona total - pesquisa e/ou dosagem)

- `0202060349` — DOSAGEM DE TESTOSTERONA _(grau 3)_

### Progesterona (LOINC 2839-9) — TUSS `40316408` (Progesterona - pesquisa e/ou dosagem)

- `0202060292` — DOSAGEM DE PROGESTERONA _(grau 3)_

### Antígeno Prostático Específico (LOINC 2857-1) — TUSS `40316149` (Antígeno específico prostático total (PSA) - pesquisa e/ou dosagem)

- `0202030105` — DOSAGEM DE ANTIGENO PROSTATICO ESPECIFICO (PSA) _(grau 4)_

### PSA Livre (LOINC 10886-0) — TUSS `40316130` (Antígeno específico prostático livre (PSA livre) - pesquisa e/ou dosagem)

- `0202030105` — DOSAGEM DE ANTIGENO PROSTATICO ESPECIFICO (PSA) _(grau 4)_

### Glicose (LOINC 2345-7) — TUSS `40302040` (Glicose - pesquisa e/ou dosagem)

- `0202010473` — DOSAGEM DE GLICOSE _(grau 3)_
- `0202090124` — DOSAGEM DE GLICOSE NO LIQUIDO SINOVIAL E DERRAMES _(grau —)_

### Glicemia Média Estimada (LOINC 27353-2) — TUSS `40302040` (Glicose - pesquisa e/ou dosagem)

- `0202010473` — DOSAGEM DE GLICOSE _(grau 3)_
- `0202090124` — DOSAGEM DE GLICOSE NO LIQUIDO SINOVIAL E DERRAMES _(grau —)_

### Insulina (LOINC 20448-7) — TUSS `40316360` (Insulina - pesquisa e/ou dosagem)

- `0202060268` — DOSAGEM DE INSULINA _(grau 3)_

### Ácido Úrico (LOINC 3084-1) — TUSS `40301150` (Ácido úrico - pesquisa e/ou dosagem)

- `0202010120` — DOSAGEM DE ACIDO URICO _(grau 3)_

### Chumbo (LOINC 77307-7) — TUSS `40313107` (Chumbo - pesquisa e/ou dosagem)

- `0202070174` — DOSAGEM DE CHUMBO _(grau 3)_
- `0213020041` — ANALISE DE METAIS PESADOS _(grau —)_

### Cálcio (LOINC 17861-6) — TUSS `40301400` (Cálcio - pesquisa e/ou dosagem)

- `0202010210` — DOSAGEM DE CALCIO _(grau 3)_

### Ferritina (LOINC 2276-4) — TUSS `40316270` (Ferritina - pesquisa e/ou dosagem)

- `0202010384` — DOSAGEM DE FERRITINA _(grau 3)_

### Ferro (LOINC 2498-4) — TUSS `40301842` (Ferro sérico - pesquisa e/ou dosagem)

- `0202010392` — DOSAGEM DE FERRO SERICO _(grau 3)_

### Saturação de Ferro (LOINC 2502-3) — TUSS `40302520` (Transferrina - pesquisa e/ou dosagem)

- `0202010660` — DOSAGEM DE TRANSFERRINA _(grau 3)_

### Capacidade de Ligação do Ferro (LOINC 2500-7) — TUSS `40301427` (Capacidade de fixação de ferro - pesquisa e/ou dosagem)

- `0202010023` — DETERMINACAO DE CAPACIDADE DE FIXACAO DO FERRO _(grau 3)_

### Magnésio RBC (LOINC 26746-8) — TUSS `40302237` (Magnésio - pesquisa e/ou dosagem)

- `0202010562` — DOSAGEM DE MAGNESIO _(grau 3)_

### Vitamina B12 (LOINC 2132-9) — TUSS `40316572` (Vitamina B12 - pesquisa e/ou dosagem)

- `0202010708` — DOSAGEM DE VITAMINA B12 _(grau 3)_

### Vitamina C (LOINC 1903-4) — TUSS `40301060` (Ácido ascórbico (vitamina C) - pesquisa e/ou dosagem)

- `0202010112` — DOSAGEM DE ACIDO ASCORBICO _(grau 3)_

### Zinco (LOINC 8245-3) — TUSS `40313328` (Zinco - pesquisa e/ou dosagem)

- `0202070352` — DOSAGEM DE ZINCO _(grau 3)_

### Cortisol (LOINC 2143-6) — TUSS `40316190` (Cortisol - pesquisa e/ou dosagem)

- `0202060136` — DOSAGEM DE CORTISOL _(grau 3)_

### Fosfatase Alcalina (LOINC 6768-6) — TUSS `40301885` (Fosfatase alcalina - pesquisa e/ou dosagem)

- `0202010422` — DOSAGEM DE FOSFATASE ALCALINA _(grau 3)_
- `0202090094` — DOSAGEM DE FOSFATASE ALCALINA NO ESPERMA _(grau —)_

### Gama-Glutamil Transferase (LOINC 2324-2) — TUSS `40301990` (Gama-glutamil transferase - pesquisa e/ou dosagem)

- `0202010465` — DOSAGEM DE GAMA-GLUTAMIL-TRANSFERASE (GAMA GT) _(grau 3)_

### Proteína Total (LOINC 2885-2) — TUSS `40302377` (Proteínas totais - pesquisa e/ou dosagem)

- `0202010619` — DOSAGEM DE PROTEINAS TOTAIS _(grau 3)_

### Velocidade de Hemossedimentação (LOINC 30341-2) — TUSS `40304370` (Hemossedimentação, (VHS) - pesquisa e/ou dosagem)

- `0202020150` — DETERMINACAO DE VELOCIDADE DE HEMOSSEDIMENTACAO (VHS) _(grau 3)_

### Ureia (LOINC 3094-0) — TUSS `40302580` (Uréia - pesquisa e/ou dosagem)

- `0202010694` — DOSAGEM DE UREIA _(grau 3)_

### Razão Ureia / Creatinina (LOINC 3097-3) — TUSS `40301630` (Creatinina - pesquisa e/ou dosagem)

- `0202010317` — DOSAGEM DE CREATININA _(grau 3)_

### Creatinina (LOINC 2160-0) — TUSS `40301630` (Creatinina - pesquisa e/ou dosagem)

- `0202010317` — DOSAGEM DE CREATININA _(grau 3)_

### Potássio (LOINC 2823-3) — TUSS `40302318` (Potássio - pesquisa e/ou dosagem)

- `0202010600` — DOSAGEM DE POTASSIO _(grau 3)_

### Sódio (LOINC 2951-2) — TUSS `40302423` (Sódio - pesquisa e/ou dosagem)

- `0202010635` — DOSAGEM DE SODIO _(grau 3)_

### Creatinina Urinária (LOINC 2161-8) — TUSS `40301630` (Creatinina - pesquisa e/ou dosagem)

- `0202010317` — DOSAGEM DE CREATININA _(grau 3)_

### Amilase (LOINC 1798-8) — TUSS `40301281` (Amilase - pesquisa e/ou dosagem)

- `0202010180` — DOSAGEM DE AMILASE _(grau 3)_

### Lipase (LOINC 3040-3) — TUSS `40302199` (Lipase - pesquisa e/ou dosagem)

- `0202010554` — DOSAGEM DE LIPASE _(grau 3)_

### Glicose na Urina (LOINC 5792-7) — TUSS `40302040` (Glicose - pesquisa e/ou dosagem)

- `0202010473` — DOSAGEM DE GLICOSE _(grau 3)_
- `0202090124` — DOSAGEM DE GLICOSE NO LIQUIDO SINOVIAL E DERRAMES _(grau —)_

### Esterase Leucocitária na Urina (LOINC 5799-2) — TUSS `40304094` (Citoquímica para classificar leucemia: esterase, fosfatase leucocitária, PAS, peroxidase ou SB, etc - cada)

- `0202020010` — CITOQUIMICA HEMATOLOGICA _(grau 4)_

### Proteína na Urina (LOINC 5804-0) — TUSS `40304507` (Proteína C - pesquisa e/ou dosagem)

- `0202030202` — DOSAGEM DE PROTEINA C REATIVA _(grau 4)_

### Alfa-Fetoproteína (LOINC 1834-1) — TUSS `40316068` (Alfa-fetoproteína - pesquisa e/ou dosagem)

- `0202030091` — DOSAGEM DE ALFA-FETOPROTEINA _(grau 3)_

### Antígeno Carcinoembrionário (LOINC 2039-6) — TUSS `40316122` (Antígeno carcinoembriogênico (CEA) - pesquisa e/ou dosagem)

- `0202030962` — PESQUISA DE ANTIGENO CARCINOEMBRIONARIO (CEA) _(grau 3)_

### Anticorpos Anti-Gliadina Deamidada IgA (LOINC 63453-5) — TUSS `40307220` (IgA - pesquisa e/ou dosagem)

- `0202030156` — DOSAGEM DE IMUNOGLOBULINA A (IGA) _(grau 3)_

### Anticorpos Anti-Gliadina Deamidada IgG (LOINC 63459-2) — TUSS `40307280` (IgG - pesquisa e/ou dosagem)

- `0202030172` — DOSAGEM DE IMUNOGLOBULINA G (IGG) _(grau 3)_

### Massa Total (LOINC 29463-7) — TUSS `40808149` (Densitometria óssea - corpo inteiro (avaliação de massa óssea ou de composição corporal))

- `0204060028` — DENSITOMETRIA OSSEA DUO-ENERGETICA DE COLUNA (VERTEBRAS LOMBARES) _(grau 4)_

## `no_sigtap_match`

- Apolipoproteína B (LOINC 1884-6) — _sem TUSS_
- HDL Grande (LOINC 43729-3) — _sem TUSS_
- LDL Médio (LOINC 96735-6) — _sem TUSS_
- Número de Partículas LDL (LOINC 54434-6) — _sem TUSS_
- Padrão LDL (LOINC 35505-7) — _sem TUSS_
- Tamanho de Pico LDL (LOINC 17782-4) — _sem TUSS_
- LDL Pequeno (LOINC 43727-7) — _sem TUSS_
- Lipoproteína (a) (LOINC 10835-7) — _só grau 5_
- Colesterol VLDL (LOINC 13458-5) — _só grau 5_
- Apolipoproteína A-1 (LOINC 1869-7) — _só grau 5_
- Anticorpos Anti-Peroxidase Tireoidiana (LOINC 8099-4) — _só grau 5_
- Triagem de Anticorpos Antinucleares (LOINC 8061-4) — _sem TUSS_
- Basófilos (LOINC 706-2) — _sem TUSS_
- Linfócitos (LOINC 736-9) — _só grau 5_
- Monócitos (LOINC 5905-5) — _sem TUSS_
- Neutrófilos (LOINC 770-8) — _só grau 5_
- Hormônio Anti-Mülleriano (LOINC 38476-8) — _só grau 5_
- Globulina Ligadora de Hormônios Sexuais (LOINC 13967-5) — _só grau 5_
- Relação PSA Livre/Total (LOINC 12841-3) — _sem TUSS_
- Diidrotestosterona (LOINC 1848-1) — _sem TUSS_
- HOMA-IR (LOINC 47214-2) — _sem TUSS_
- Leptina (LOINC 21365-2) — _só grau 5_
- Creatina Quinase (LOINC 2157-6) — _só grau 5_
- Mercúrio (LOINC 5685-3) — _sem TUSS_
- Razão Ácido Araquidônico/EPA (LOINC 90909-3) — _sem TUSS_
- Folato (LOINC 2284-8) — _só grau 5_
- Homocisteína (LOINC 13965-9) — _só grau 5_
- Ácido Metilmalônico (LOINC 13964-2) — _sem TUSS_
- Ômega-3 Total (LOINC 35178-3) — _sem TUSS_
- Ômega-3: DHA (LOINC 75095-0) — _sem TUSS_
- Ômega-3: DPA (LOINC 48371-9) — _sem TUSS_
- Ômega-3: EPA (LOINC 75097-6) — _sem TUSS_
- Ômega-3: EPA+DPA+DHA (LOINC 90908-5) — _sem TUSS_
- Razão Ômega-6 / Ômega-3 (LOINC 90910-1) — _sem TUSS_
- Ômega-6 Total (LOINC 35177-5) — _sem TUSS_
- Ômega-6: Ácido Araquidônico (LOINC 75110-7) — _sem TUSS_
- Ômega-6: Ácido Linoleico (LOINC 75117-2) — _sem TUSS_
- Vitamina A (LOINC 2923-1) — _só grau 5_
- Vitamina D (LOINC 1989-3) — _só grau 5_
- Alanina Aminotransferase (LOINC 1742-6) — _sem TUSS_
- Albumina (LOINC 1751-7) — _só grau 5_
- Razão Albumina / Globulina (LOINC 1759-0) — _só grau 5_
- Aspartato Aminotransferase (LOINC 1920-8) — _sem TUSS_
- Globulina (LOINC 2336-6) — _só grau 5_
- Bilirrubina Total (LOINC 1975-2) — _só grau 5_
- Bilirrubina Direta (LOINC 1968-7) — _sem TUSS_
- Bilirrubina Indireta (LOINC 1971-1) — _sem TUSS_
- Volume Corpuscular Médio (LOINC 787-2) — _sem TUSS_
- Volume Plaquetário Médio (LOINC 32623-1) — _sem TUSS_
- Contagem de Hemácias (LOINC 789-8) — _só grau 5_
- Amplitude de Distribuição dos Eritrócitos (LOINC 788-0) — _sem TUSS_
- Razão Normalizada Internacional (LOINC 6301-6) — _sem TUSS_
- Albumina Urina (LOINC 14957-5) — _só grau 5_
- Razão Albumina/Creatinina (LOINC 9318-7) — _só grau 5_
- Dióxido de Carbono (LOINC 2028-9) — _só grau 5_
- Cloreto (LOINC 2075-0) — _sem TUSS_
- Aparência da Urina (LOINC 5767-9) — _sem TUSS_
- Bactérias na Urina (LOINC 630-4) — _sem TUSS_
- Bilirrubina na Urina (LOINC 5770-3) — _sem TUSS_
- Cor da Urina (LOINC 5778-6) — _sem TUSS_
- Cilindros Hialinos na Urina (LOINC 5796-8) — _sem TUSS_
- Cetonas na Urina (LOINC 5797-6) — _sem TUSS_
- Leucócitos na Urina (LOINC 5821-4) — _sem TUSS_
- Nitrito na Urina (LOINC 5802-4) — _sem TUSS_
- pH Urinário (LOINC 5803-2) — _só grau 5_
- Hemácias na Urina (LOINC 5808-1) — _sem TUSS_
- Densidade da Urina (LOINC 5811-5) — _sem TUSS_
- Células Epiteliais Escamosas na Urina (LOINC 11277-1) — _sem TUSS_
- Urobilinogênio Urinário (LOINC 20405-7) — _só grau 5_
- CA-125 (LOINC 10334-1) — _só grau 5_
- Transglutaminase Tecidual IgA (LOINC 31017-7) — _só grau 5_
- Transglutaminase Tecidual IgG (LOINC 32998-7) — _só grau 5_
- Genótipo APOE (LOINC 21619-2) — _sem TUSS_
- Adiponectina (LOINC 47828-9) — _só grau 5_
- Índice de Massa Corporal (LOINC 39156-5) — _sem TUSS_
- Percentual de Gordura Corporal (LOINC 41982-0) — _sem TUSS_
- Massa de Gordura (LOINC 73708-0) — _sem TUSS_
- Massa Magra (LOINC 73964-9) — _sem TUSS_
- Conteúdo Mineral Ósseo (LOINC —) — _sem TUSS_
- Massa Livre de Gordura (LOINC —) — _sem TUSS_
- Volume de Gordura Visceral (LOINC —) — _sem TUSS_
- Massa de Gordura Visceral (LOINC —) — _sem TUSS_
- Razão Androide/Ginoide (LOINC —) — _sem TUSS_
- Percentual de Gordura Androide (LOINC —) — _sem TUSS_
- Percentual de Gordura Ginoide (LOINC —) — _sem TUSS_
