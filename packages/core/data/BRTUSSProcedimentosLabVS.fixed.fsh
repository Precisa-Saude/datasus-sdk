// ============================================================
// BRTUSSProcedimentosLabVS — VERSÃO CORRIGIDA (candidata)
//
// Gerada por `scripts/fix-fhir-brasil-tuss.ts` no repo
// datasus-brasil. Códigos TUSS foram realinhados usando a tabela
// oficial publicada pela ANS como fonte autoritativa.
//
// Fonte: https://www.gov.br/ans/pt-br/arquivos/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-tiss/padrao-tiss-tabelas-relacionadas/padraotiss_mapeamento_tuss_sigtap.zip
// Publicador: Agência Nacional de Saúde Suplementar (ANS)
// Competência: 2017-04
// Arquivo: MAPEAMENTO TUSS x SIGTAP 2017 04.xlsx
// Licença: Dado aberto — Lei de Acesso à Informação (Lei 12.527/2011)
// Regerado em: 2026-04-21T20:54:12.118Z
//
// Ver `data/BRTUSSProcedimentosLabVS.diff.md` para resumo das mudanças.
// ============================================================

ValueSet: BRTUSSProcedimentosLabVS
Id: tuss-procedimentos-lab-vs
Title: "TUSS Procedimentos Laboratoriais ValueSet"
Description: "Subconjunto de códigos TUSS para procedimentos laboratoriais relevantes aos biomarcadores suportados pelo fhir-brasil. Códigos da Tabela 22 (Procedimentos e Eventos em Saúde) da TUSS."

// Hematologia
* $TUSS#40304361 "Hemograma completo (eritrograma, leucograma e plaquetas)"   // fixed from 40304370 — ANS: "Hemograma com contagem de plaquetas ou frações (eritrograma, leucograma, plaquetas)" (score 0.73)
* $TUSS#40304558 "Reticulócitos, contagem"   // fixed from 40304540 — ANS: "Reticulócitos, contagem" (score 1.00)
* $TUSS#40304370 "Velocidade de hemossedimentação (VHS)"   // fixed from 40304060 — ANS: "Hemossedimentação, (VHS) - pesquisa e/ou dosagem" (score 0.90)

// Bioquímica — glicose e metabolismo
* $TUSS#40302040 "Glicose"   // fixed from 40301630 — ANS: "Glicose - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40302733 "Hemoglobina glicada (A1C)"   // fixed from 40302040 — ANS: "Hemoglobina glicada (Fração A1c) - pesquisa e/ou dosagem" (score 0.92)
* $TUSS#40316360 "Insulina"   // fixed from 40301770 — ANS: "Insulina - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40301150 "Ácido úrico"   // fixed from 40301354 — ANS: "Ácido úrico - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40301621 "Creatina quinase (CK total)"   // fixed from 40301460 — ANS: "Creatina - pesquisa e/ou dosagem" (score 0.80)

// Bioquímica — perfil lipídico
* $TUSS#40301605 "Colesterol total"   // fixed from 40301397 — ANS: "Colesterol total - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40301583 "Colesterol HDL"   // fixed from 40301400 — ANS: "Colesterol (HDL) - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40301591 "Colesterol LDL"   // fixed from 40301419 — ANS: "Colesterol (LDL) - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40302547 "Triglicerídeos"   // fixed from 40302695 — ANS: "Triglicerídeos - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40302695 "Colesterol VLDL"   // fixed from 40301427 — ANS: "Colesterol (VLDL) - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40301354 "Apolipoproteína A-1"   // fixed from 40301338 — ANS: "Apolipoproteína A (Apo A) - pesquisa e/ou dosagem" (score 0.85)
* $TUSS#40301362 "Apolipoproteína B"   // manual override — ANS: "Apolipoproteína B (Apo B) - pesquisa e/ou dosagem" (fuzzy colide com Apo A, score 0.85; Apo B é biomarcador distinto)
* $TUSS#40302210 "Lipoproteína (a)"   // fixed from 40302580 — ANS: "Lipoproteína (a) - Lp (a) - pesquisa e/ou dosagem" (score 0.85)

// Bioquímica — função hepática
* $TUSS#40301222 "Albumina"   // fixed from 40301311 — ANS: "Albumina - pesquisa e/ou dosagem" (score 1.00)
// * $TUSS#40301370 "Bilirrubina total e frações"   // needs-review: sem match ANS confiável
* $TUSS#40302377 "Proteínas totais"   // fixed from 40302610 — ANS: "Proteínas totais - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40301885 "Fosfatase alcalina"   // fixed from 40301575 — ANS: "Fosfatase alcalina - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40301990 "Gama-glutamil transferase (GGT)"   // fixed from 40302903 — ANS: "Gama-glutamil transferase - pesquisa e/ou dosagem" (score 0.92)
// * $TUSS#40301680 "Transaminase glutâmico-oxalacética (TGO/AST)"   // needs-review: sem match ANS confiável
* $TUSS#40403840 "Transaminase glutâmico-pirúvica (TGP/ALT)"   // fixed from 40301699 — ANS: "Transaminase pirúvica - TGP ou ALT por componente hemoterápico - pesquisa e/ou dosagem" (score 0.73)

// Bioquímica — função renal
* $TUSS#40301630 "Creatinina"   // fixed from 40301443 — ANS: "Creatinina - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40302580 "Ureia"   // fixed from 40302709 — ANS: "Uréia - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40302318 "Potássio"   // fixed from 40301885 — ANS: "Potássio - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40302423 "Sódio"   // fixed from 40301915 — ANS: "Sódio - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40301508 "Clearance de creatinina"   // fixed from 40302857 — ANS: "Clearance de creatinina" (score 1.00)

// Bioquímica — minerais e eletrólitos
* $TUSS#40301400 "Cálcio"   // fixed from 40301389 — ANS: "Cálcio - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40302237 "Magnésio"   // fixed from 40301826 — ANS: "Magnésio - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40301842 "Ferro sérico"   // fixed from 40301567 — ANS: "Ferro sérico - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40316270 "Ferritina"   // fixed from 40301559 — ANS: "Ferritina - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40301427 "Capacidade de ligação do ferro (TIBC)"   // fixed from 40301362 — ANS: "Capacidade de fixação de ferro - pesquisa e/ou dosagem" (score 0.59)

// Hormônios — tireoide
* $TUSS#40316521 "TSH"   // fixed from 40316491 — ANS: "Tireoestimulante, hormônio (TSH) - pesquisa e/ou dosagem" (score 0.80)
* $TUSS#40316491 "T4 livre"   // fixed from 40316556 — ANS: "T4 livre - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40316467 "T3 livre"   // fixed from 40316548 — ANS: "T3 livre - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40316530 "Anticorpos anti-tireoglobulina"   // fixed from 40316130 — ANS: "Tireoglobulina - pesquisa e/ou dosagem" (score 0.80)
* $TUSS#40316157 "Anticorpos anti-peroxidase tireoidiana (anti-TPO)"   // fixed from 40316122 — ANS: "Anti-TPO - pesquisa e/ou dosagem" (score 0.82)

// Hormônios — reprodutivos
* $TUSS#40316246 "Estradiol"   // fixed from 40316220 — ANS: "Estradiol - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40316289 "FSH — Hormônio folículo-estimulante"   // fixed from 40316360 — ANS: "Folículo estimulante, hormônio (FSH) - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40316335 "LH — Hormônio luteinizante"   // fixed from 40316378 — ANS: "Hormônio luteinizante (LH) - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40316408 "Progesterona"   // fixed from 40316440 — ANS: "Progesterona - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40316416 "Prolactina"   // fixed from 40316459 — ANS: "Prolactina - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40316513 "Testosterona total"   // fixed from 40316521 — ANS: "Testosterona total - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40316505 "Testosterona livre"   // fixed from 40316530 — ANS: "Testosterona livre - pesquisa e/ou dosagem" (score 1.00)

// Hormônios — outros
* $TUSS#40316190 "Cortisol"   // verified
* $TUSS#40316459 "DHEA-Sulfato"   // fixed from 40316203 — ANS: "Sulfato de dehidroepiandrosterona (S-DHEA) - pesquisa e/ou dosagem" (score 0.90)

// Vitaminas
* $TUSS#40316572 "Vitamina B12"   // fixed from 40302750 — ANS: "Vitamina B12 - pesquisa e/ou dosagem" (score 1.00)
* $TUSS#40301087 "Folato (ácido fólico)"   // fixed from 40301583 — ANS: "Ácido fólico, pesquisa e/ou dosagem nos eritrócitos" (score 0.62)
* $TUSS#40302830 "Vitamina D (25-hidroxi)"   // fixed from 40302717 — ANS: "Vitamina "D" 25 HIDROXI, pesquisa e/ou dosagem (Vitamina D3)" (score 0.92)

// Marcadores tumorais
* $TUSS#40316068 "Alfa-fetoproteína (AFP)"   // fixed from 40308014 — ANS: "Alfa-fetoproteína - pesquisa e/ou dosagem" (score 0.90)
* $TUSS#40316378 "CA-125"   // fixed from 40308049 — ANS: "Marcadores tumorais (CA 19.9, CA 125, CA 72-4, CA 15-3, etc.) cada - pesquisa e/ou dosagem" (score 0.77)
* $TUSS#40316122 "Antígeno carcinoembrionário (CEA)"   // fixed from 40308120 — ANS: "Antígeno carcinoembriogênico (CEA) - pesquisa e/ou dosagem" (score 0.62)
* $TUSS#40316149 "PSA total"   // fixed from 40308189 — ANS: "Antígeno específico prostático total (PSA) - pesquisa e/ou dosagem" (score 0.77)
* $TUSS#40316130 "PSA livre"   // fixed from 40308197 — ANS: "Antígeno específico prostático livre (PSA livre) - pesquisa e/ou dosagem" (score 0.82)

// Marcadores inflamatórios
* $TUSS#40304507 "Proteína C-reativa (PCR)"   // fixed from 40302466 — ANS: "Proteína C - pesquisa e/ou dosagem" (score 0.80)

// Urinálise
// * $TUSS#40311104 "Urina tipo I (EAS)"   // needs-review: sem match ANS confiável
* $TUSS#40311171 "Microalbuminúria"   // fixed from 40311295 — ANS: "Microalbuminúria" (score 1.00)
