# Auditoria: BRTUSSProcedimentosLabVS.fsh vs ANS TUSS oficial

Gerado por `scripts/build-sigtap-mapping.ts`. Compara cada código TUSS declarado no ValueSet curado pelo fhir-brasil contra o termo oficial do mesmo código no arquivo `MAPEAMENTO TUSS x SIGTAP 2017 04.xlsx` da ANS.

**Fonte autoritativa:** https://www.gov.br/ans/pt-br/arquivos/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-tiss/padrao-tiss-tabelas-relacionadas/padraotiss_mapeamento_tuss_sigtap.zip
**Competência:** 2017-04

Resultado esperado: os nomes devem ser iguais ou sinônimos. Se mismatches aparecerem, o VS do fhir-brasil está usando uma numeração TUSS diferente (possivelmente CBHPM ou tabela não-oficial). **Reporte ao time do fhir-brasil para correção.**

- Entradas no VS: **59**
- Alinhadas com ANS: **1**
- Desalinhadas: **57**
- Ausentes na planilha ANS: **1**

## Mismatches

| TUSS       | Nome no fhir-brasil                                      | Nome na ANS                                                                                                                      | Status      |
| ---------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `40304361` | Hemograma completo                                       | Hemograma com contagem de plaquetas ou frações (eritrograma, leucograma, plaquetas)                                              | ❌ mismatch |
| `40304370` | Hemograma completo (eritrograma, leucograma e plaquetas) | Hemossedimentação, (VHS) - pesquisa e/ou dosagem                                                                                 | ❌ mismatch |
| `40304540` | Reticulócitos, contagem                                  | Resistência globular, curva de                                                                                                   | ❌ mismatch |
| `40304060` | Velocidade de hemossedimentação (VHS)                    | Antitrombina III, dosagem                                                                                                        | ❌ mismatch |
| `40301630` | Glicose                                                  | Creatinina - pesquisa e/ou dosagem                                                                                               | ❌ mismatch |
| `40302040` | Hemoglobina glicada (A1C)                                | Glicose - pesquisa e/ou dosagem                                                                                                  | ❌ mismatch |
| `40301770` | Insulina                                                 | Eletroforese de glicoproteínas                                                                                                   | ❌ mismatch |
| `40301354` | Ácido úrico                                              | Apolipoproteína A (Apo A) - pesquisa e/ou dosagem                                                                                | ❌ mismatch |
| `40301460` | Creatina quinase (CK total)                              | Caroteno - pesquisa e/ou dosagem                                                                                                 | ❌ mismatch |
| `40301397` | Colesterol total                                         | Bilirrubinas (direta, indireta e total) - pesquisa e/ou dosagem                                                                  | ❌ mismatch |
| `40301400` | Colesterol HDL                                           | Cálcio - pesquisa e/ou dosagem                                                                                                   | ❌ mismatch |
| `40301419` | Colesterol LDL                                           | Cálcio iônico - pesquisa e/ou dosagem                                                                                            | ❌ mismatch |
| `40302695` | Triglicerídeos                                           | Colesterol (VLDL) - pesquisa e/ou dosagem                                                                                        | ❌ mismatch |
| `40301427` | Colesterol VLDL                                          | Capacidade de fixação de ferro - pesquisa e/ou dosagem                                                                           | ❌ mismatch |
| `40301338` | Apolipoproteína A-1                                      | Anfetaminas, pesquisa e/ou dosagem                                                                                               | ❌ mismatch |
| `40301346` | Apolipoproteína B                                        | Antibióticos, pesquisa e/ou dosagem no soro, cada                                                                                | ❌ mismatch |
| `40302580` | Lipoproteína (a)                                         | Uréia - pesquisa e/ou dosagem                                                                                                    | ❌ mismatch |
| `40301311` | Albumina                                                 | Amitriptilina, nortriptilina (cada) - pesquisa e/ou dosagem                                                                      | ❌ mismatch |
| `40301370` | Bilirrubina total e frações                              | Barbitúricos, antidepressivos tricíclicos (cada) - pesquisa e/ou dosagem                                                         | ❌ mismatch |
| `40302610` | Proteínas totais                                         | Vitamina E - pesquisa e/ou dosagem                                                                                               | ❌ mismatch |
| `40301575` | Fosfatase alcalina                                       | Cocaína, pesquisa e/ou dosagem                                                                                                   | ❌ mismatch |
| `40302903` | Gama-glutamil transferase (GGT)                          | Ácidos graxos cadeia muito longa                                                                                                 | ❌ mismatch |
| `40301680` | Transaminase glutâmico-oxalacética (TGO/AST)             | Curva glicêmica (4 dosagens) via oral ou endovenosa                                                                              | ❌ mismatch |
| `40301699` | Transaminase glutâmico-pirúvica (TGP/ALT)                | Desidrogenase alfa-hidroxibutírica - pesquisa e/ou dosagem                                                                       | ❌ mismatch |
| `40301443` | Creatinina                                               | Carnitina livre - pesquisa e/ou dosagem                                                                                          | ❌ mismatch |
| `40302709` | Ureia                                                    | Teste oral de tolerância à glicose - 2 dosagens                                                                                  | ❌ mismatch |
| `40301885` | Potássio                                                 | Fosfatase alcalina - pesquisa e/ou dosagem                                                                                       | ❌ mismatch |
| `40301915` | Sódio                                                    | Fosfatase alcalina termo-estável - pesquisa e/ou dosagem                                                                         | ❌ mismatch |
| `40302857` | Clearance de creatinina                                  | 6-Monoacetilmorfina urinária                                                                                                     | ❌ mismatch |
| `40301389` | Cálcio                                                   | Beta-glicuronidase - pesquisa e/ou dosagem                                                                                       | ❌ mismatch |
| `40301826` | Magnésio                                                 | Fenitoína - pesquisa e/ou dosagem                                                                                                | ❌ mismatch |
| `40301567` | Ferro sérico                                             | Cobre - pesquisa e/ou dosagem                                                                                                    | ❌ mismatch |
| `40301559` | Ferritina                                                | Cloro - pesquisa e/ou dosagem                                                                                                    | ❌ mismatch |
| `40301362` | Capacidade de ligação do ferro (TIBC)                    | Apolipoproteína B (Apo B) - pesquisa e/ou dosagem                                                                                | ❌ mismatch |
| `40316491` | TSH                                                      | T4 livre - pesquisa e/ou dosagem                                                                                                 | ❌ mismatch |
| `40316556` | T4 livre                                                 | Triiodotironina (T3) - pesquisa e/ou dosagem                                                                                     | ❌ mismatch |
| `40316548` | T3 livre                                                 | Tiroxina (T4) - pesquisa e/ou dosagem                                                                                            | ❌ mismatch |
| `40316130` | Anticorpos anti-tireoglobulina                           | Antígeno específico prostático livre (PSA livre) - pesquisa e/ou dosagem                                                         | ❌ mismatch |
| `40316122` | Anticorpos anti-peroxidase tireoidiana (anti-TPO)        | Antígeno carcinoembriogênico (CEA) - pesquisa e/ou dosagem                                                                       | ❌ mismatch |
| `40316220` | Estradiol                                                | Dehidrotestosterona (DHT) - pesquisa e/ou dosagem                                                                                | ❌ mismatch |
| `40316360` | FSH — Hormônio folículo-estimulante                      | Insulina - pesquisa e/ou dosagem                                                                                                 | ❌ mismatch |
| `40316378` | LH — Hormônio luteinizante                               | Marcadores tumorais (CA 19.9, CA 125, CA 72-4, CA 15-3, etc.) cada - pesquisa e/ou dosagem                                       | ❌ mismatch |
| `40316440` | Progesterona                                             | Somatomedina C (IGF1) - pesquisa e/ou dosagem                                                                                    | ❌ mismatch |
| `40316459` | Prolactina                                               | Sulfato de dehidroepiandrosterona (S-DHEA) - pesquisa e/ou dosagem                                                               | ❌ mismatch |
| `40316521` | Testosterona total                                       | Tireoestimulante, hormônio (TSH) - pesquisa e/ou dosagem                                                                         | ❌ mismatch |
| `40316530` | Testosterona livre                                       | Tireoglobulina - pesquisa e/ou dosagem                                                                                           | ❌ mismatch |
| `40316203` | DHEA-Sulfato                                             | Crescimento, hormônio do (HGH) - pesquisa e/ou dosagem                                                                           | ❌ mismatch |
| `40302750` | Vitamina B12                                             | Perfil lipídico / lipidograma (lípidios totais, colesterol, triglicerídios e eletroforese lipoproteínas) - pesquisa e/ou dosagem | ❌ mismatch |
| `40301583` | Folato (ácido fólico)                                    | Colesterol (HDL) - pesquisa e/ou dosagem                                                                                         | ❌ mismatch |
| `40302717` | Vitamina D (25-hidroxi)                                  | Eletroforese de proteínas de alta resolução                                                                                      | ❌ mismatch |
| `40308014` | Alfa-fetoproteína (AFP)                                  | Crioglobulinas, caracterização - imunoeletroforese                                                                               | ❌ mismatch |
| `40308049` | CA-125                                                   | Frei (linfogranuloma venéreo), IDeR - pesquisa e/ou dosagem                                                                      | ❌ mismatch |
| `40308120` | Antígeno carcinoembrionário (CEA)                        | Sarampo - anticorpos IgG - pesquisa e/ou dosagem                                                                                 | ❌ mismatch |
| `40308189` | PSA total                                                | _(ausente na ANS)_                                                                                                               | ❌ missing  |
| `40308197` | PSA livre                                                | Vírus sincicial respiratório - pesquisa direta                                                                                   | ❌ mismatch |
| `40302466` | Proteína C-reativa (PCR)                                 | Tálio, pesquisa e/ou dosagem                                                                                                     | ❌ mismatch |
| `40311104` | Urina tipo I (EAS)                                       | Dismorfismo eritrocitário, pesquisa (contraste de fase) - na urina                                                               | ❌ mismatch |
| `40311295` | Microalbuminúria                                         | Contagem sedimentar de Addis                                                                                                     | ❌ mismatch |
