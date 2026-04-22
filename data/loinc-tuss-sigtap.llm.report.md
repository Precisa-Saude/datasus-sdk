# Mapeamento refinado por LLM

Modelo: **google/gemini-3.1-pro-preview** via OpenRouter.
Gerado por `scripts/llm-refine-mapping.ts`.

## Fonte do mapeamento oficial

- **Arquivo:** `MAPEAMENTO TUSS x SIGTAP 2017 04.xlsx`
- **Publicador:** Agência Nacional de Saúde Suplementar (ANS)
- **URL:** https://www.gov.br/ans/pt-br/arquivos/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-tiss/padrao-tiss-tabelas-relacionadas/padraotiss_mapeamento_tuss_sigtap.zip
- **Competência:** 2017-04

## Resumo

- Total: **164**
- Confiança alta: **160**
- Confiança média: **4**
- Confiança baixa: **0**
- Sem match SUS: **88**
- Erros de API: **0**
- **Divergências vs fuzzy top-1: 59** ← foco da revisão

## Divergências LLM vs fuzzy (prioridade de revisão)

### LDL Médio (LOINC 96735-6)

- **Fuzzy top-1:** TUSS `40301591` → SIGTAP `0202010287` (DOSAGEM DE COLESTEROL LDL)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** O biomarcador refere-se à contagem de partículas médias de LDL (frequentemente medida por ressonância magnética nuclear - NMR), que é diferente da dosagem padrão da massa de colesterol LDL (LDL-C). Não há código TUSS/SIGTAP específico para o fracionamento de partículas de LDL por tamanho.
- **Sem match:** Não há código TUSS ou SIGTAP específico para a dosagem de subfrações de partículas de LDL (como partículas médias de LDL).

### Proteína C-Reativa (LOINC 1988-5)

- **Fuzzy top-1:** TUSS `40304507` → SIGTAP `0202030202` (DOSAGEM DE PROTEINA C REATIVA)
- **LLM escolheu:** TUSS `40308391` → SIGTAP `0202030083` _(high)_
- **Raciocínio:** O TUSS 40308391 e o SIGTAP 0202030083 referem-se especificamente à determinação quantitativa da Proteína C-Reativa (PCR), correspondendo perfeitamente ao biomarcador. É importante não confundir com a Proteína C da coagulação (TUSS 40304507).

### Número de Partículas LDL (LOINC 54434-6)

- **Fuzzy top-1:** TUSS `40301591` → SIGTAP `0202010287` (DOSAGEM DE COLESTEROL LDL)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** O número de partículas LDL (LDL-P) é um exame distinto da dosagem de colesterol LDL (LDL-C), que mede a massa de colesterol nas partículas. Os candidatos oferecem apenas a dosagem de LDL-C ou LDL peroxidada, não havendo correspondência exata.
- **Sem match:** Nenhum dos códigos candidatos representa a contagem do número de partículas LDL (LDL-P), apenas a dosagem de colesterol LDL (LDL-C) ou LDL oxidada.

### HDL Grande (LOINC 43729-3)

- **Fuzzy top-1:** TUSS `40301583` → SIGTAP `0202010279` (DOSAGEM DE COLESTEROL HDL)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** A dosagem de 'HDL Grande' (partículas grandes de HDL, geralmente avaliadas por ressonância magnética nuclear - NMR) é um exame de subfração lipídica específico. A tabela TUSS e o SIGTAP possuem apenas códigos para o Colesterol HDL total, que não é equivalente à contagem de partículas de uma subfração específica.
- **Sem match:** Não há código específico na TUSS ou SIGTAP para subfrações de partículas de HDL (como HDL Grande).

### Padrão LDL (LOINC 35505-7)

- **Fuzzy top-1:** TUSS `40301591` → SIGTAP `0202010287` (DOSAGEM DE COLESTEROL LDL)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** O biomarcador refere-se ao padrão de tamanho e densidade das partículas de LDL (ex: Padrão A ou B), geralmente avaliado por ressonância magnética nuclear ou eletroforese. Os candidatos referem-se à dosagem de colesterol LDL padrão ou LDL oxidada, que são exames diferentes.
- **Sem match:** Nenhum dos candidatos corresponde ao exame de padrão de partículas de LDL.

### LDL Pequeno (LOINC 43727-7)

- **Fuzzy top-1:** TUSS `40301591` → SIGTAP `0202010287` (DOSAGEM DE COLESTEROL LDL)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** O biomarcador refere-se à subfração de LDL denso e pequeno (sdLDL), que é um exame específico e diferente da dosagem de colesterol LDL total ou do LDL peroxidado.
- **Sem match:** Nenhum dos candidatos representa especificamente a subfração de LDL pequeno/denso.

### Colesterol Não-HDL (LOINC 43396-1)

- **Fuzzy top-1:** TUSS `40301583` → SIGTAP `0202010279` (DOSAGEM DE COLESTEROL HDL)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** O Colesterol Não-HDL é um parâmetro calculado (Colesterol Total subtraído do Colesterol HDL) e não possui código específico para faturamento isolado na tabela TUSS ou SIGTAP.
- **Sem match:** Parâmetro calculado a partir do Colesterol Total e HDL, sem código próprio nas terminologias TUSS e SIGTAP.

### Tamanho de Pico LDL (LOINC 17782-4)

- **Fuzzy top-1:** TUSS `40301591` → SIGTAP `0202010287` (DOSAGEM DE COLESTEROL LDL)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** O biomarcador refere-se à medição do tamanho físico das partículas de LDL (em Angstroms), um teste especializado diferente da dosagem da concentração de colesterol LDL.
- **Sem match:** Nenhum dos códigos candidatos representa a medição do tamanho das partículas de LDL; as opções referem-se à dosagem de colesterol LDL, LDL peroxidada ou testes respiratórios.

### Razão Colesterol Total / HDL (LOINC 9830-1)

- **Fuzzy top-1:** TUSS `40301583` → SIGTAP `0202010279` (DOSAGEM DE COLESTEROL HDL)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** A razão Colesterol Total/HDL é um índice matemático calculado a partir das dosagens de colesterol total e HDL, não sendo um exame laboratorial faturado isoladamente.
- **Sem match:** Trata-se de um índice calculado, não possuindo código próprio para faturamento nas tabelas TUSS ou SIGTAP.

### Percentil CAC (LOINC —)

- **Fuzzy top-1:** TUSS `40301400` → SIGTAP `0202010210` (DOSAGEM DE CALCIO)
- **LLM escolheu:** TUSS `41001087` → SIGTAP `—` _(high)_
- **Raciocínio:** O percentil CAC (Coronary Artery Calcium) é um resultado derivado do Escore de Cálcio Coronariano, obtido através de Tomografia Computadorizada do coração. O código TUSS 41001087 representa exatamente este exame de imagem, que não possui mapeamento direto no SIGTAP segundo a ANS.
- **Sem match:** O exame TUSS 41001087 não possui código SIGTAP correspondente mapeado oficialmente pela ANS (equivalência 5).

### Anticorpos Anti-Tireoglobulina (LOINC 8098-6)

- **Fuzzy top-1:** TUSS `40316530` → SIGTAP `0202060365` (DOSAGEM DE TIREOGLOBULINA)
- **LLM escolheu:** TUSS `40316106` → SIGTAP `0202030628` _(high)_
- **Raciocínio:** O código TUSS 40316106 e o SIGTAP 0202030628 referem-se especificamente à pesquisa e/ou dosagem de anticorpos antitireoglobulina, correspondendo perfeitamente ao biomarcador solicitado.

### Eosinófilos (LOINC 713-8)

- **Fuzzy top-1:** TUSS `40303047` → SIGTAP `0202040062` (PESQUISA DE EOSINOFILOS)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** O biomarcador refere-se à contagem de eosinófilos no sangue (geralmente parte do hemograma), enquanto os candidatos apresentados são para pesquisa em espécimes diferentes (fezes e muco nasal).
- **Sem match:** Nenhum dos candidatos corresponde ao exame de sangue; ambos referem-se a outros materiais biológicos (fezes e muco nasal).

### IgE E1 Epitélio de Gato (LOINC 6833-8)

- **Fuzzy top-1:** TUSS `40307271` → SIGTAP `0202030164` (DOSAGEM DE IMUNOGLOBULINA E (IGE))
- **LLM escolheu:** TUSS `40307263` → SIGTAP `0202031039` _(high)_
- **Raciocínio:** O biomarcador refere-se à dosagem de IgE específica para um único alérgeno (epitélio de gato). O código TUSS 40307263 e o SIGTAP 0202031039 representam exatamente a pesquisa/dosagem de IgE alérgeno-específica.

### Relação PSA Livre/Total (LOINC 12841-3)

- **Fuzzy top-1:** TUSS `40316130` → SIGTAP `0202030105` (DOSAGEM DE ANTIGENO PROSTATICO ESPECIFICO (PSA))
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** A relação PSA Livre/Total é um índice calculado a partir das dosagens de PSA Total e PSA Livre. Não existe um código TUSS ou SIGTAP específico para o faturamento isolado dessa relação matemática.
- **Sem match:** Parâmetro calculado sem código específico na terminologia TUSS/SIGTAP.

### Glicemia Média Estimada (LOINC 27353-2)

- **Fuzzy top-1:** TUSS `40302040` → SIGTAP `0202010473` (DOSAGEM DE GLICOSE)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** A Glicemia Média Estimada (eAG) é um parâmetro matemático calculado a partir do resultado da Hemoglobina Glicada (HbA1c), não sendo um exame laboratorial faturado isoladamente.
- **Sem match:** Não há código TUSS/SIGTAP específico para a Glicemia Média Estimada, pois trata-se de um índice calculado reportado em conjunto com a dosagem de Hemoglobina Glicada.

### Saturação de Ferro (LOINC 2502-3)

- **Fuzzy top-1:** TUSS `40302520` → SIGTAP `0202010660` (DOSAGEM DE TRANSFERRINA)
- **LLM escolheu:** TUSS `40321231` → SIGTAP `—` _(high)_
- **Raciocínio:** O código TUSS 40321231 (Índice de saturação de ferro) corresponde exatamente ao biomarcador de saturação de transferrina/ferro.
- **Sem match:** Não há código SIGTAP mapeado para o TUSS selecionado nas opções fornecidas.

### Creatina Quinase (LOINC 2157-6)

- **Fuzzy top-1:** TUSS `40301621` → SIGTAP `—` (—)
- **LLM escolheu:** TUSS `40301648` → SIGTAP `0202010325` _(high)_
- **Raciocínio:** O TUSS 40301648 corresponde exatamente à dosagem de Creatino Fosfoquinase (CK/CPK) total. O código SIGTAP 0202010325 representa o mesmo exame no SUS (embora listado em outro candidato na busca, é a correspondência correta para a enzima total).

### Folato (LOINC 2284-8)

- **Fuzzy top-1:** TUSS `40301087` → SIGTAP `0202010406` (DOSAGEM DE FOLATO)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** O biomarcador refere-se ao folato sérico (LOINC 2284-8). O único candidato relacionado ao ácido fólico na lista (TUSS 40301087) é específico para dosagem em eritrócitos, o que representa um espécime diferente. O código TUSS correto para folato sérico (40301079) não foi fornecido nas opções.
- **Sem match:** Nenhum dos candidatos corresponde ao folato sérico; o candidato mais próximo é para folato eritrocitário.

### Globulina (LOINC 2336-6)

- **Fuzzy top-1:** TUSS `40316858` → SIGTAP `—` (—)
- **LLM escolheu:** TUSS `40302385` → SIGTAP `0202010627` _(high)_
- **Raciocínio:** A dosagem de globulina é clinicamente realizada e faturada em conjunto com as proteínas totais e albumina (proteínas totais e frações). O código TUSS 40302385 e o SIGTAP 0202010627 representam exatamente esse exame.

### Bilirrubina Indireta (LOINC 1971-1)

- **Fuzzy top-1:** TUSS `40704068` → SIGTAP `0208040072` (CISTOCINTILOGRAFIA INDIRETA)
- **LLM escolheu:** TUSS `40301397` → SIGTAP `0202010201` _(high)_
- **Raciocínio:** O código TUSS 40301397 e o SIGTAP 0202010201 referem-se à dosagem de bilirrubinas (total e frações), o que inclui a medição da bilirrubina indireta (não conjugada).

### Razão Albumina / Globulina (LOINC 1759-0)

- **Fuzzy top-1:** TUSS `40301222` → SIGTAP `—` (—)
- **LLM escolheu:** TUSS `40302385` → SIGTAP `0202010627` _(high)_
- **Raciocínio:** A razão albumina/globulina é um parâmetro calculado e reportado como parte do exame de proteínas totais e frações (albumina e globulina).

### Bilirrubina Direta (LOINC 1968-7)

- **Fuzzy top-1:** TUSS `40704050` → SIGTAP `0208040064` (CISTOCINTILOGRAFIA DIRETA)
- **LLM escolheu:** TUSS `40301397` → SIGTAP `0202010201` _(high)_
- **Raciocínio:** O código TUSS 40301397 engloba explicitamente a dosagem de bilirrubina direta, indireta e total. O código SIGTAP 0202010201 correspondente refere-se à dosagem de bilirrubina total e frações, o que inclui a bilirrubina direta.

### Concentração de Hemoglobina Corpuscular Média (LOINC 786-4)

- **Fuzzy top-1:** TUSS `40304345` → SIGTAP `0202020304` (DOSAGEM DE HEMOGLOBINA)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** A Concentração de Hemoglobina Corpuscular Média (CHCM) é um índice hematimétrico calculado a partir da hemoglobina e do hematócrito, fazendo parte do eritrograma/hemograma. Não possui código TUSS ou SIGTAP para faturamento isolado.
- **Sem match:** O CHCM é um parâmetro integrante do hemograma (ou eritrograma) e não é faturado como um exame independente na tabela TUSS ou SIGTAP.

### Razão Ureia / Creatinina (LOINC 3097-3)

- **Fuzzy top-1:** TUSS `40301630` → SIGTAP `0202010317` (DOSAGEM DE CREATININA)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** A razão ureia/creatinina é um índice calculado a partir das dosagens individuais de ureia e creatinina, não possuindo código de faturamento próprio no TUSS ou SIGTAP.
- **Sem match:** Não há código específico para a razão calculada; faturam-se as dosagens individuais de ureia e creatinina.

### Cloreto (LOINC 2075-0)

- **Fuzzy top-1:** TUSS `40302024` → SIGTAP `0211080020` (GASOMETRIA)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** O único candidato fornecido representa um painel de gasometria com eletrólitos, e não a dosagem isolada de cloreto.
- **Sem match:** Nenhum candidato corresponde ao exame isolado de cloreto (o código correto seria TUSS 40301524 / SIGTAP 0202010260).

### Bilirrubina na Urina (LOINC 5770-3)

- **Fuzzy top-1:** TUSS `40311031` → SIGTAP `0202050157` (PESQUISA DE ALCAPTONA NA URINA)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** Nenhum dos códigos candidatos corresponde à pesquisa ou dosagem de bilirrubina na urina. Os candidatos referem-se a outras substâncias (alcaptona, lipóides, melanina, porfobilinogênio, etc.).
- **Sem match:** Não há candidato correspondente à bilirrubina na urina na lista fornecida.

### Aparência da Urina (LOINC 5767-9)

- **Fuzzy top-1:** TUSS `40311031` → SIGTAP `0202050157` (PESQUISA DE ALCAPTONA NA URINA)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** Nenhum dos códigos candidatos corresponde à avaliação da aparência da urina. A aparência da urina é geralmente avaliada como parte do exame de urina de rotina (EAS), que não está listado entre as opções.
- **Sem match:** Os candidatos fornecidos referem-se a pesquisas e dosagens de substâncias específicas na urina (como alcaptona, melanina, porfobilinogênio, etc.), não à avaliação física da aparência da urina.

### Sangue Oculto na Urina (LOINC 5794-3)

- **Fuzzy top-1:** TUSS `40303136` → SIGTAP `0202040143` (PESQUISA DE SANGUE OCULTO NAS FEZES)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** Os candidatos apresentados referem-se à pesquisa de sangue oculto nas fezes, que é um espécime diferente da urina. Não há código específico para sangue oculto na urina entre as opções.
- **Sem match:** Nenhum dos códigos candidatos corresponde ao exame de sangue oculto na urina; as opções de sangue oculto são exclusivas para fezes.

### Cilindros Hialinos na Urina (LOINC 5796-8)

- **Fuzzy top-1:** TUSS `40311031` → SIGTAP `0202050157` (PESQUISA DE ALCAPTONA NA URINA)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** A pesquisa ou contagem de cilindros hialinos na urina é um parâmetro avaliado dentro do exame de Urina Tipo I (EAS - Elementos Anormais e Sedimento), não possuindo um código TUSS ou SIGTAP isolado para sua cobrança.
- **Sem match:** Não há código específico para cilindros hialinos isoladamente; o achado faz parte do exame de rotina de urina (EAS).

### Esterase Leucocitária na Urina (LOINC 5799-2)

- **Fuzzy top-1:** TUSS `40304094` → SIGTAP `0202020010` (CITOQUIMICA HEMATOLOGICA)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** A esterase leucocitária na urina é um parâmetro avaliado no exame de urina de rotina (EAS / Urina Tipo I), não possuindo código TUSS ou SIGTAP específico para sua dosagem isolada entre os candidatos apresentados.
- **Sem match:** Nenhum dos candidatos corresponde à esterase leucocitária na urina. O candidato com 'esterase' refere-se a citoquímica para leucemia em sangue/medula, não na urina.

### Nitrito na Urina (LOINC 5802-4)

- **Fuzzy top-1:** TUSS `40311031` → SIGTAP `0202050157` (PESQUISA DE ALCAPTONA NA URINA)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** Nenhum dos códigos candidatos corresponde à pesquisa de nitrito na urina. O nitrito urinário é tipicamente avaliado como parte do exame de urina rotina (EAS / Urina tipo I), não possuindo um código isolado entre as opções fornecidas.
- **Sem match:** Não há candidato correspondente ao biomarcador Nitrito na Urina na lista fornecida.

### Leucócitos na Urina (LOINC 5821-4)

- **Fuzzy top-1:** TUSS `40304418` → SIGTAP `0202020398` (LEUCOGRAMA)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** Nenhum dos códigos candidatos corresponde à pesquisa ou contagem de leucócitos na urina. O candidato 'Leucócitos, contagem' refere-se ao leucograma (sangue).
- **Sem match:** Os candidatos fornecidos não incluem o exame de leucócitos na urina (frequentemente avaliado no EAS/Urina tipo I).

### Anticorpos Anti-Gliadina Deamidada IgA (LOINC 63453-5)

- **Fuzzy top-1:** TUSS `40307220` → SIGTAP `0202030156` (DOSAGEM DE IMUNOGLOBULINA A (IGA))
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** Nenhum dos candidatos corresponde aos anticorpos anti-gliadina deamidada IgA. O candidato 'IgA - pesquisa e/ou dosagem' refere-se à dosagem de IgA total, e não ao autoanticorpo específico.
- **Sem match:** Não há candidato TUSS correspondente ao exame de anticorpos anti-gliadina deamidada IgA na lista fornecida.

### Proteína na Urina (LOINC 5804-0)

- **Fuzzy top-1:** TUSS `40304507` → SIGTAP `0202030202` (DOSAGEM DE PROTEINA C REATIVA)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** Nenhum dos códigos candidatos corresponde à dosagem de proteína total na urina. Os candidatos referem-se a proteínas específicas (Proteína C, Proteína S, Proteína Amiloide A) ou outras substâncias na urina.
- **Sem match:** Os candidatos fornecidos não incluem o código correto para pesquisa ou dosagem de proteínas totais na urina (como o TUSS 40311201 ou 40311210).

### Densidade da Urina (LOINC 5811-5)

- **Fuzzy top-1:** TUSS `40311031` → SIGTAP `0202050157` (PESQUISA DE ALCAPTONA NA URINA)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** Nenhum dos códigos candidatos corresponde à densidade da urina. A densidade urinária geralmente é avaliada como parte do exame de urina de rotina (EAS - Elementos Anormais e Sedimento), que não está listado entre as opções.
- **Sem match:** Os candidatos fornecidos referem-se a pesquisas e dosagens de outras substâncias específicas na urina (como alcaptona, porfobilinogênio, osmolalidade, etc.), não havendo correspondência para a densidade urinária isolada.

### Percentual de Gordura Corporal (LOINC 41982-0)

- **Fuzzy top-1:** TUSS `40303055` → SIGTAP `0202040020` (DOSAGEM DE GORDURA FECAL)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** O percentual de gordura corporal é um resultado/medida clínica obtida através de procedimentos de avaliação da composição corporal (como bioimpedanciometria, antropometria ou DEXA). A tabela TUSS codifica os procedimentos realizados para obter essa medida, e não o resultado do biomarcador em si.
- **Sem match:** Não há código TUSS/SIGTAP específico para o resultado 'Percentual de Gordura Corporal'. Os códigos existentes referem-se aos métodos/procedimentos de avaliação (ex: 20101104 - bioimpedanciometria).

### Massa Magra (LOINC 73964-9)

- **Fuzzy top-1:** TUSS `40808149` → SIGTAP `0204060028` (DENSITOMETRIA OSSEA DUO-ENERGETICA DE COLUNA (VERTEBRAS LOMBARES))
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** A massa magra é um parâmetro clínico de composição corporal obtido através de exames como bioimpedanciometria, antropometria ou densitometria (DEXA). A tabela TUSS codifica os procedimentos que realizam a medição (ex: 40808149, 20101104), mas não possui códigos específicos para os parâmetros individuais resultantes.
- **Sem match:** Não há código TUSS/SIGTAP específico para o parâmetro isolado 'Massa Magra', apenas para os procedimentos de avaliação de composição corporal que a mensuram.

### Volume de Gordura Visceral (LOINC —)

- **Fuzzy top-1:** TUSS `40303055` → SIGTAP `0202040020` (DOSAGEM DE GORDURA FECAL)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** O volume de gordura visceral (VAT Volume) é um parâmetro obtido por exames de imagem (como tomografia computadorizada, ressonância magnética ou densitometria de corpo inteiro), não sendo um exame laboratorial in vitro. Nenhum dos códigos candidatos corresponde a essa medição.
- **Sem match:** Não há código TUSS/SIGTAP correspondente para a medição do volume de gordura visceral entre os candidatos, pois trata-se de um parâmetro de imagem e os candidatos são exames laboratoriais ou procedimentos cirúrgicos não relacionados.

### Massa de Gordura Visceral (LOINC —)

- **Fuzzy top-1:** TUSS `40303055` → SIGTAP `0202040020` (DOSAGEM DE GORDURA FECAL)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** Nenhum dos códigos candidatos corresponde à medição de Massa de Gordura Visceral (VATMass). Os candidatos referem-se a gordura fecal/urinária, procedimentos cirúrgicos ou outras dosagens não relacionadas à composição corporal.
- **Sem match:** Não há código TUSS/SIGTAP correspondente para a avaliação de Massa de Gordura Visceral na lista de candidatos.

### Conteúdo Mineral Ósseo (LOINC —)

- **Fuzzy top-1:** TUSS `30713021` → SIGTAP `—` (—)
- **LLM escolheu:** TUSS `40808149` → SIGTAP `0204060028` _(medium)_
- **Raciocínio:** O Conteúdo Mineral Ósseo (BMC) não é um exame laboratorial in vitro, mas sim um parâmetro físico medido através do exame de imagem de densitometria óssea (DXA). O código TUSS 40808149 e o SIGTAP correspondente representam o procedimento de densitometria utilizado para obter essa medição.

### Percentual de Gordura Androide (LOINC —)

- **Fuzzy top-1:** TUSS `31003559` → SIGTAP `0407020403` (RETOSSIGMOIDECTOMIA ABDOMINAL)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** Nenhum dos códigos candidatos corresponde ao percentual de gordura androide (medida de composição corporal, geralmente por DEXA ou bioimpedância). Os candidatos referem-se a cirurgias abdominais, gordura fecal ou urinária.
- **Sem match:** Não há código TUSS/SIGTAP específico para a medição isolada do percentual de gordura androide na lista de candidatos.

### Percentual de Gordura Ginoide (LOINC —)

- **Fuzzy top-1:** TUSS `30724040` → SIGTAP `0408040343` (TRATAMENTO CIRURGICO DE LUXACAO ESPONTANEA / PROGRESSIVA / PARALITICA DO QUADRIL)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** Nenhum dos códigos candidatos corresponde ao percentual de gordura ginoide. Os candidatos referem-se a procedimentos cirúrgicos no quadril, dosagem de gordura fecal ou urinária, e radiografias, que não têm relação com a avaliação de composição corporal por DEXA ou bioimpedância.
- **Sem match:** Não há código TUSS/SIGTAP específico para o parâmetro 'Percentual de Gordura Ginoide' isolado, sendo este geralmente um resultado derivado de exames de imagem como a densitometria de corpo inteiro (DEXA) ou bioimpedância.

### Massa Total (LOINC 29463-7)

- **Fuzzy top-1:** TUSS `40808149` → SIGTAP `0204060028` (DENSITOMETRIA OSSEA DUO-ENERGETICA DE COLUNA (VERTEBRAS LOMBARES))
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** O peso corporal (massa total) é um dado antropométrico/sinal vital aferido durante consultas ou avaliações clínicas, não possuindo um código TUSS ou SIGTAP exclusivo para sua medição isolada como exame.
- **Sem match:** Não há código específico para aferição isolada de peso corporal na tabela TUSS/SIGTAP, sendo parte integrante de consultas ou avaliações antropométricas.

### DMO Corpo Total (LOINC —)

- **Fuzzy top-1:** TUSS `40706010` → SIGTAP `0208050027` (CINTILOGRAFIA DE ESQUELETO (CORPO INTEIRO))
- **LLM escolheu:** TUSS `40808149` → SIGTAP `0204060028` _(high)_
- **Raciocínio:** O código TUSS 40808149 corresponde exatamente à densitometria óssea de corpo inteiro (DMO Corpo Total). O SIGTAP 0204060028 é a opção oficialmente mapeada pela ANS para este código, embora descreva a densitometria de coluna (equivalência 4).

### T-Score Corpo Total (LOINC —)

- **Fuzzy top-1:** TUSS `40706010` → SIGTAP `0208050027` (CINTILOGRAFIA DE ESQUELETO (CORPO INTEIRO))
- **LLM escolheu:** TUSS `40808149` → SIGTAP `0204060028` _(medium)_
- **Raciocínio:** O T-Score de corpo total é um parâmetro/resultado gerado exclusivamente pelo exame de densitometria óssea de corpo inteiro. O TUSS 40808149 representa o procedimento adequado, com o SIGTAP correspondente mapeado pela ANS.

### Fator Reumatoide (LOINC 11572-5)

- **Fuzzy top-1:** TUSS `40304175` → SIGTAP `0202020207` (DOSAGEM DE FATOR V)
- **LLM escolheu:** TUSS `40306860` → SIGTAP `—` _(high)_
- **Raciocínio:** O biomarcador refere-se à dosagem quantitativa do Fator Reumatoide (unidade IU/mL). O código TUSS 40306860 corresponde exatamente à pesquisa/dosagem quantitativa deste analito.
- **Sem match:** Não há código SIGTAP oficialmente mapeado para a dosagem quantitativa do Fator Reumatoide entre as opções fornecidas.

### Contagem de Plaquetas (LOINC 777-3)

- **Fuzzy top-1:** TUSS `40304361` → SIGTAP `0202020380` (HEMOGRAMA COMPLETO)
- **LLM escolheu:** TUSS `40304361` → SIGTAP `0202020029` _(high)_
- **Raciocínio:** O código TUSS 40304361 engloba o hemograma e suas frações isoladas, incluindo a contagem de plaquetas. O código SIGTAP 0202020029 representa especificamente a contagem isolada de plaquetas, correspondendo perfeitamente ao biomarcador.

### Bactérias na Urina (LOINC 630-4)

- **Fuzzy top-1:** TUSS `40311031` → SIGTAP `0202050157` (PESQUISA DE ALCAPTONA NA URINA)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** Nenhum dos códigos candidatos corresponde à pesquisa de bactérias na urina. A presença de bactérias na urina é tipicamente avaliada como parte do exame de Urina Rotina (EAS) ou Urocultura, que não estão listados nas opções.
- **Sem match:** Os candidatos fornecidos referem-se a pesquisas de outras substâncias específicas na urina (como alcaptona, lipóides, melanina, etc.), não havendo correspondência para bactérias.

### Cor da Urina (LOINC 5778-6)

- **Fuzzy top-1:** TUSS `40311031` → SIGTAP `0202050157` (PESQUISA DE ALCAPTONA NA URINA)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** A cor da urina é um parâmetro avaliado no exame de urina de rotina (EAS), não possuindo código TUSS ou SIGTAP para faturamento isolado.
- **Sem match:** Nenhum dos códigos candidatos corresponde à avaliação isolada da cor da urina, que é parte integrante do exame de urina tipo I (EAS).

### Cetonas na Urina (LOINC 5797-6)

- **Fuzzy top-1:** TUSS `40311031` → SIGTAP `0202050157` (PESQUISA DE ALCAPTONA NA URINA)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** Nenhum dos códigos candidatos corresponde à pesquisa ou dosagem de cetonas (corpos cetônicos) na urina.
- **Sem match:** Os candidatos fornecidos referem-se a outras substâncias na urina (alcaptona, lipóides, melanina, porfobilinogênio, etc.), não havendo correspondência para cetonas.

### Índice de Massa Corporal (LOINC 39156-5)

- **Fuzzy top-1:** TUSS `40808149` → SIGTAP `0204060028` (DENSITOMETRIA OSSEA DUO-ENERGETICA DE COLUNA (VERTEBRAS LOMBARES))
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** O Índice de Massa Corporal (IMC) é uma medida antropométrica calculada a partir do peso e da altura do paciente, geralmente aferida durante uma consulta médica ou avaliação nutricional.
- **Sem match:** O IMC é um dado clínico/antropométrico e não um exame laboratorial faturável isoladamente, portanto não possui código específico nas tabelas TUSS e SIGTAP.

### Massa Livre de Gordura (LOINC —)

- **Fuzzy top-1:** TUSS `40301443` → SIGTAP `0202100146` (DOSAGEM QUANTITATIVA DE CARNITINA, PERFIL DE ACILCARNITINAS)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** A 'Massa Livre de Gordura' (Fat-Free Mass) é uma métrica de composição corporal (geralmente avaliada por bioimpedância ou DEXA) e não um exame laboratorial de patologia clínica. Nenhum dos códigos candidatos corresponde a este parâmetro.
- **Sem match:** Não há código TUSS/SIGTAP laboratorial para avaliação de massa livre de gordura, pois trata-se de um parâmetro de composição corporal e não de um analito bioquímico.

### Massa de Gordura (LOINC 73708-0)

- **Fuzzy top-1:** TUSS `40303055` → SIGTAP `0202040020` (DOSAGEM DE GORDURA FECAL)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** A 'Massa de Gordura' (Fat Mass) é um parâmetro de composição corporal obtido por métodos físicos ou de imagem (como bioimpedanciometria ou densitometria de corpo inteiro), não sendo um exame laboratorial in vitro. A tabela TUSS codifica os procedimentos (ex: densitometria), mas não o parâmetro isolado como resultado.
- **Sem match:** Não há código TUSS/SIGTAP para o parâmetro isolado de massa de gordura, pois trata-se de um resultado de avaliação de composição corporal e não de um exame laboratorial.

### Triagem de Anticorpos Antinucleares (LOINC 8061-4)

- **Fuzzy top-1:** TUSS `40304043` → SIGTAP `0202120058` (PESQUISA DE ANTICORPOS IRREGULARES PELO METODO DA ELUICAO)
- **LLM escolheu:** TUSS `40306852` → SIGTAP `0202030598` _(high)_
- **Raciocínio:** O termo 'Fator antinúcleo (FAN)' é a nomenclatura consagrada em português para os Anticorpos Antinucleares (ANA). O código TUSS 40306852 e o SIGTAP 0202030598 correspondem exatamente à pesquisa/triagem desses anticorpos.

### Hemoglobina Glicada (LOINC 4548-4)

- **Fuzzy top-1:** TUSS `40304345` → SIGTAP `0202020304` (DOSAGEM DE HEMOGLOBINA)
- **LLM escolheu:** TUSS `40302733` → SIGTAP `0202010503` _(high)_
- **Raciocínio:** O biomarcador refere-se especificamente à fração A1c da hemoglobina glicada, que corresponde perfeitamente ao código TUSS 40302733 e ao código SIGTAP 0202010503 (Dosagem de hemoglobina glicosilada).

### Hemoglobina Corpuscular Média (LOINC 785-6)

- **Fuzzy top-1:** TUSS `40304345` → SIGTAP `0202020304` (DOSAGEM DE HEMOGLOBINA)
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** A Hemoglobina Corpuscular Média (HCM) é um índice hematimétrico calculado que faz parte do eritrograma/hemograma. Não possui código de faturamento isolado na tabela TUSS ou SIGTAP.
- **Sem match:** Parâmetro calculado integrante do hemograma completo, sem código isolado para faturamento.

### Anticorpos Anti-Gliadina Deamidada IgG (LOINC 63459-2)

- **Fuzzy top-1:** TUSS `40307280` → SIGTAP `0202030172` (DOSAGEM DE IMUNOGLOBULINA G (IGG))
- **LLM escolheu:** TUSS `—` → SIGTAP `—` _(high)_
- **Raciocínio:** Nenhum dos candidatos corresponde ao exame específico de Anticorpos Anti-Gliadina Deamidada IgG. O candidato 'IgG - pesquisa e/ou dosagem' refere-se à dosagem de imunoglobulina G total, e não a um anticorpo específico.
- **Sem match:** A lista de candidatos não contém o código TUSS para anticorpos anti-gliadina (ex: 40306933) ou anti-gliadina deamidada.

### Vitamina D (LOINC 1989-3)

- **Fuzzy top-1:** TUSS `40302601` → SIGTAP `—` (—)
- **LLM escolheu:** TUSS `40302830` → SIGTAP `0202010767` _(high)_
- **Raciocínio:** O biomarcador refere-se à 25-Hidroxivitamina D (LOINC 1989-3), que é a forma padrão para avaliação do status de Vitamina D. O código TUSS 40302830 e o SIGTAP 0202010767 correspondem exatamente à dosagem de 25-Hidroxivitamina D.

### Z-Score Corpo Total (LOINC —)

- **Fuzzy top-1:** TUSS `40706010` → SIGTAP `0208050027` (CINTILOGRAFIA DE ESQUELETO (CORPO INTEIRO))
- **LLM escolheu:** TUSS `40808149` → SIGTAP `0204060028` _(medium)_
- **Raciocínio:** O Z-Score de corpo total é um parâmetro de resultado obtido no exame de densitometria óssea de corpo inteiro. O código TUSS 40808149 representa o procedimento adequado, e o SIGTAP 0204060028 é o mapeamento oficial da ANS disponível (embora focado em coluna, reflete a densitometria).

## LLM concorda com fuzzy top-1 (revisão opcional)

- Colesterol HDL → TUSS `40301583` / SIGTAP `0202010279` _(high)_
- Colesterol LDL → TUSS `40301591` / SIGTAP `0202010287` _(high)_
- Triglicerídeos → TUSS `40302547` / SIGTAP `0202010678` _(high)_
- Colesterol Total → TUSS `40301605` / SIGTAP `0202010295` _(high)_
- Tiroxina Livre → TUSS `40316491` / SIGTAP `0202060381` _(high)_
- Hormônio Tireoestimulante → TUSS `40316521` / SIGTAP `0202060250` _(high)_
- Triiodotironina Livre → TUSS `40316467` / SIGTAP `0202060390` _(high)_
- Tiroxina → TUSS `40316548` / SIGTAP `0202060373` _(high)_
- Imunoglobulina A → TUSS `40307220` / SIGTAP `0202030156` _(high)_
- Contagem de Leucócitos → TUSS `40304418` / SIGTAP `0202020398` _(high)_
- IgE Total → TUSS `40307271` / SIGTAP `0202030164` _(high)_
- Imunoglobulina G → TUSS `40307280` / SIGTAP `0202030172` _(high)_
- DHEA-Sulfato → TUSS `40316459` / SIGTAP `0202060330` _(high)_
- Estradiol → TUSS `40316246` / SIGTAP `0202060160` _(high)_
- Hormônio Folículo-Estimulante → TUSS `40316289` / SIGTAP `0202060233` _(high)_
- Hormônio Luteinizante → TUSS `40316335` / SIGTAP `0202060241` _(high)_
- Prolactina → TUSS `40316416` / SIGTAP `0202060306` _(high)_
- Testosterona Livre → TUSS `40316505` / SIGTAP `0202060357` _(high)_
- Testosterona Total → TUSS `40316513` / SIGTAP `0202060349` _(high)_
- Progesterona → TUSS `40316408` / SIGTAP `0202060292` _(high)_
- PSA Livre → TUSS `40316130` / SIGTAP `0202030105` _(high)_
- Antígeno Prostático Específico → TUSS `40316149` / SIGTAP `0202030105` _(high)_
- Diidrotestosterona → TUSS `40316220` / SIGTAP `0202060152` _(high)_
- Glicose → TUSS `40302040` / SIGTAP `0202010473` _(high)_
- Insulina → TUSS `40316360` / SIGTAP `0202060268` _(high)_
- Chumbo → TUSS `40313107` / SIGTAP `0202070174` _(high)_
- Ácido Úrico → TUSS `40301150` / SIGTAP `0202010120` _(high)_
- Cálcio → TUSS `40301400` / SIGTAP `0202010210` _(high)_
- Ferritina → TUSS `40316270` / SIGTAP `0202010384` _(high)_
- Ferro → TUSS `40301842` / SIGTAP `0202010392` _(high)_
- Capacidade de Ligação do Ferro → TUSS `40301427` / SIGTAP `0202010023` _(high)_
- Magnésio RBC → TUSS `40302237` / SIGTAP `0202010562` _(medium)_
- Vitamina C → TUSS `40301060` / SIGTAP `0202010112` _(high)_
- Vitamina B12 → TUSS `40316572` / SIGTAP `0202010708` _(high)_
- Cortisol → TUSS `40316190` / SIGTAP `0202060136` _(high)_
- Zinco → TUSS `40313328` / SIGTAP `0202070352` _(high)_
- Alanina Aminotransferase → TUSS `40302512` / SIGTAP `0202010651` _(high)_
- Fosfatase Alcalina → TUSS `40301885` / SIGTAP `0202010422` _(high)_
- Aspartato Aminotransferase → TUSS `40302504` / SIGTAP `0202010643` _(high)_
- Gama-Glutamil Transferase → TUSS `40301990` / SIGTAP `0202010465` _(high)_
- Proteína Total → TUSS `40302377` / SIGTAP `0202010619` _(high)_
- Hematócrito → TUSS `40304337` / SIGTAP `0202020371` _(high)_
- Hemoglobina → TUSS `40304345` / SIGTAP `0202020304` _(high)_
- Velocidade de Hemossedimentação → TUSS `40304370` / SIGTAP `0202020150` _(high)_
- Tempo de Protrombina → TUSS `40304590` / SIGTAP `0202020142` _(high)_
- Reticulócitos → TUSS `40304558` / SIGTAP `0202020037` _(high)_
- Ureia → TUSS `40302580` / SIGTAP `0202010694` _(high)_
- Creatinina → TUSS `40301630` / SIGTAP `0202010317` _(high)_
- Taxa de Filtração Glomerular Estimada → TUSS `40704076` / SIGTAP `0208040080` _(high)_
- Potássio → TUSS `40302318` / SIGTAP `0202010600` _(high)_
- Sódio → TUSS `40302423` / SIGTAP `0202010635` _(high)_
- Creatinina Urinária → TUSS `40301630` / SIGTAP `0202010317` _(high)_
- Amilase → TUSS `40301281` / SIGTAP `0202010180` _(high)_
- Lipase → TUSS `40302199` / SIGTAP `0202010554` _(high)_
- Glicose na Urina → TUSS `40302040` / SIGTAP `0202010473` _(high)_
- Alfa-Fetoproteína → TUSS `40316068` / SIGTAP `0202030091` _(high)_
- CA-125 → TUSS `40316378` / SIGTAP `0202031217` _(high)_
- Antígeno Carcinoembrionário → TUSS `40316122` / SIGTAP `0202030962` _(high)_
- Transglutaminase Tecidual IgA → TUSS `40308553` / SIGTAP `0202031187` _(high)_
- IgE GX1 Gramíneas → TUSS `40307255` / SIGTAP `0202030164` _(high)_

## Sem match SUS (LLM concluiu)

- Apolipoproteína B — _Não há código SIGTAP correspondente mapeado pela ANS nas opções fornecidas._
- Lipoproteína (a) — _Não há código SIGTAP correspondente mapeado pela ANS para este exame._
- Colesterol VLDL — _Não há código SIGTAP específico para a dosagem isolada de Colesterol VLDL na tabela do SUS._
- Apolipoproteína A-1 — _Não há código TUSS específico para Apolipoproteína A-1 entre os candidatos, e a regra estrita define que Apo A não deve ser mapeado como Apo A-1._
- Anticorpos Anti-Peroxidase Tireoidiana — _Não há código SIGTAP mapeado nas opções fornecidas para este exame._
- Basófilos — _Nenhum TUSS candidato encontrado via fuzzy (biomarcador provavelmente privado/genético sem equivalente SUS)._
- Monócitos — _Nenhum TUSS candidato encontrado via fuzzy (biomarcador provavelmente privado/genético sem equivalente SUS)._
- Linfócitos — _Nenhum dos candidatos corresponde à contagem geral ou percentual de linfócitos (parte do hemograma). Os candidatos são testes funcionais ou de subpopulações específicas._
- Neutrófilos — _Parâmetro integrante do hemograma, sem código SIGTAP isolado para faturamento. Os candidatos TUSS não possuem mapeamento SIGTAP._
- Hormônio Anti-Mülleriano — _O exame possui código TUSS, mas não possui cobertura ou mapeamento oficial na tabela SIGTAP (SUS)._
- Globulina Ligadora de Hormônios Sexuais — _Não há código SIGTAP equivalente mapeado pela ANS para a dosagem de SHBG._
- Leptina — _Não há código SIGTAP correspondente mapeado para este exame._
- HOMA-IR — _A lista de candidatos não contém um código TUSS correspondente ao HOMA-IR (frequentemente calculado a partir da glicemia e insulina de jejum, sem código próprio isolado na lista)._
- Mercúrio — _Os candidatos fornecidos referem-se a outras substâncias (brometo, melatonina, molibdênio, morfina, prozac) e não incluem o exame para dosagem de mercúrio._
- Razão Ácido Araquidônico/EPA — _Não há código TUSS/SIGTAP correspondente à razão Ácido Araquidônico/EPA entre os candidatos fornecidos._
- Homocisteína — _Não há código SIGTAP correspondente mapeado pela ANS para este código TUSS._
- Ômega-3 Total — _Nenhum TUSS candidato encontrado via fuzzy (biomarcador provavelmente privado/genético sem equivalente SUS)._
- Ácido Metilmalônico — _Os candidatos fornecidos referem-se a outros ácidos (glioxílico, orótico, oxálico, pirúvico, siálico), não havendo correspondência para o ácido metilmalônico._
- Ômega-3: DPA — _Os candidatos fornecidos não representam o biomarcador Ácido Docosapentaenoico (DPA)._
- Ômega-3: EPA+DPA+DHA — _Nenhum TUSS candidato encontrado via fuzzy (biomarcador provavelmente privado/genético sem equivalente SUS)._
- Razão Ômega-6 / Ômega-3 — _Nenhum TUSS candidato encontrado via fuzzy (biomarcador provavelmente privado/genético sem equivalente SUS)._
- Ômega-6 Total — _Nenhum TUSS candidato encontrado via fuzzy (biomarcador provavelmente privado/genético sem equivalente SUS)._
- Ômega-3: DHA — _Os candidatos listados referem-se a outros ácidos (glioxílico, orótico, oxálico, pirúvico, siálico), não havendo correspondência para o DHA._
- Ômega-6: Ácido Linoleico — _Os candidatos fornecidos não incluem o exame para dosagem de ácido linoleico._
- Ômega-3: EPA — _Os códigos TUSS candidatos referem-se a outros ácidos orgânicos, não havendo correspondência para a dosagem de Ácido Eicosapentaenoico (EPA) / Ômega-3._
- Ômega-6: Ácido Araquidônico — _Os candidatos fornecidos referem-se a outros ácidos (glioxílico, orótico, oxálico, pirúvico, siálico), não havendo correspondência com o Ácido Araquidônico._
- Vitamina A — _Não há código SIGTAP oficialmente mapeado pela ANS para este código TUSS na lista de candidatos._
- Albumina — _Não há código SIGTAP mapeado diretamente para a dosagem isolada de albumina nas opções fornecidas._
- Bilirrubina Total — _O candidato disponível representa um método e espécime diferentes (transcutâneo) do exame de sangue padrão para bilirrubina total._
- Volume Corpuscular Médio — _O VCM é um parâmetro do hemograma completo e não possui código TUSS/SIGTAP para faturamento isolado. Os candidatos apresentados não correspondem ao exame._
- Volume Plaquetário Médio — _Os candidatos referem-se a volume eritrocitário, volume plasmático ou outros testes plaquetários (fator 4, cross match), que são exames distintos do VPM._
- Contagem de Hemácias — _Não há código SIGTAP específico mapeado nas opções para a contagem isolada de hemácias (no SUS, este exame é tipicamente faturado como parte do hemograma completo)._
- Razão Normalizada Internacional — _Nenhum TUSS candidato encontrado via fuzzy (biomarcador provavelmente privado/genético sem equivalente SUS)._
- Amplitude de Distribuição dos Eritrócitos — _Nenhum dos candidatos corresponde ao RDW, pois este é um parâmetro do hemograma completo e não é faturado isoladamente nas tabelas TUSS e SIGTAP._
- Albumina Urina — _Os códigos específicos para pesquisa/dosagem de microalbumina na urina (TUSS 40311163 e SIGTAP 0202050017) não foram fornecidos entre os candidatos._
- Razão Albumina/Creatinina — _Os candidatos oferecem apenas as dosagens isoladas de albumina ou creatinina, não havendo um código para a relação/razão entre elas na lista fornecida._
- Dióxido de Carbono — _Não há código SIGTAP correspondente nas opções fornecidas para este exame._
- pH Urinário — _A lista de candidatos não contém um código específico para pH urinário, que geralmente é avaliado como parte do exame de urina rotina (EAS) ou possui um código próprio não listado._
- Hemácias na Urina — _A contagem de hemácias na urina geralmente faz parte do exame de urina de rotina (EAS) ou da pesquisa de dismorfismo eritrocitário, que não estão entre as opções fornecidas._
- Células Epiteliais Escamosas na Urina — _Os candidatos apresentados referem-se a pesquisas específicas na urina (inclusão citomegálica, alcaptona, lipóides, melanina) ou no sangue (células LE), não havendo correspondência com células epiteliais escamosas._
- Urobilinogênio Urinário — _Não há código SIGTAP mapeado pela ANS para o TUSS selecionado nas opções fornecidas._
- Transglutaminase Tecidual IgG — _Não há código SIGTAP correspondente mapeado pela ANS para a dosagem de anti-transglutaminase tecidual IgG._
- Genótipo APOE — _O código TUSS 40314014 corresponde exatamente à genotipagem da Apolipoproteína E (APOE), que é o biomarcador solicitado. Não há código SIGTAP mapeado para este procedimento._
- Adiponectina — _Não há código SIGTAP equivalente mapeado pela ANS para este exame._
- Razão Androide/Ginoide — _Nenhum dos candidatos corresponde ao biomarcador. Os candidatos são índices laboratoriais não relacionados (tireoglobulina, neutrófilos, ferro, cálcio, proteína)._
- LDL Médio — _Não há código TUSS ou SIGTAP específico para a dosagem de subfrações de partículas de LDL (como partículas médias de LDL)._
- Número de Partículas LDL — _Nenhum dos códigos candidatos representa a contagem do número de partículas LDL (LDL-P), apenas a dosagem de colesterol LDL (LDL-C) ou LDL oxidada._
- HDL Grande — _Não há código específico na TUSS ou SIGTAP para subfrações de partículas de HDL (como HDL Grande)._
- Padrão LDL — _Nenhum dos candidatos corresponde ao exame de padrão de partículas de LDL._
- LDL Pequeno — _Nenhum dos candidatos representa especificamente a subfração de LDL pequeno/denso._
- Colesterol Não-HDL — _Parâmetro calculado a partir do Colesterol Total e HDL, sem código próprio nas terminologias TUSS e SIGTAP._
- Tamanho de Pico LDL — _Nenhum dos códigos candidatos representa a medição do tamanho das partículas de LDL; as opções referem-se à dosagem de colesterol LDL, LDL peroxidada ou testes respiratórios._
- Razão Colesterol Total / HDL — _Trata-se de um índice calculado, não possuindo código próprio para faturamento nas tabelas TUSS ou SIGTAP._
- Percentil CAC — _O exame TUSS 41001087 não possui código SIGTAP correspondente mapeado oficialmente pela ANS (equivalência 5)._
- Eosinófilos — _Nenhum dos candidatos corresponde ao exame de sangue; ambos referem-se a outros materiais biológicos (fezes e muco nasal)._
- Relação PSA Livre/Total — _Parâmetro calculado sem código específico na terminologia TUSS/SIGTAP._
- Glicemia Média Estimada — _Não há código TUSS/SIGTAP específico para a Glicemia Média Estimada, pois trata-se de um índice calculado reportado em conjunto com a dosagem de Hemoglobina Glicada._
- Saturação de Ferro — _Não há código SIGTAP mapeado para o TUSS selecionado nas opções fornecidas._
- Folato — _Nenhum dos candidatos corresponde ao folato sérico; o candidato mais próximo é para folato eritrocitário._
- Concentração de Hemoglobina Corpuscular Média — _O CHCM é um parâmetro integrante do hemograma (ou eritrograma) e não é faturado como um exame independente na tabela TUSS ou SIGTAP._
- Razão Ureia / Creatinina — _Não há código específico para a razão calculada; faturam-se as dosagens individuais de ureia e creatinina._
- Cloreto — _Nenhum candidato corresponde ao exame isolado de cloreto (o código correto seria TUSS 40301524 / SIGTAP 0202010260)._
- Bilirrubina na Urina — _Não há candidato correspondente à bilirrubina na urina na lista fornecida._
- Aparência da Urina — _Os candidatos fornecidos referem-se a pesquisas e dosagens de substâncias específicas na urina (como alcaptona, melanina, porfobilinogênio, etc.), não à avaliação física da aparência da urina._
- Sangue Oculto na Urina — _Nenhum dos códigos candidatos corresponde ao exame de sangue oculto na urina; as opções de sangue oculto são exclusivas para fezes._
- Cilindros Hialinos na Urina — _Não há código específico para cilindros hialinos isoladamente; o achado faz parte do exame de rotina de urina (EAS)._
- Esterase Leucocitária na Urina — _Nenhum dos candidatos corresponde à esterase leucocitária na urina. O candidato com 'esterase' refere-se a citoquímica para leucemia em sangue/medula, não na urina._
- Nitrito na Urina — _Não há candidato correspondente ao biomarcador Nitrito na Urina na lista fornecida._
- Leucócitos na Urina — _Os candidatos fornecidos não incluem o exame de leucócitos na urina (frequentemente avaliado no EAS/Urina tipo I)._
- Anticorpos Anti-Gliadina Deamidada IgA — _Não há candidato TUSS correspondente ao exame de anticorpos anti-gliadina deamidada IgA na lista fornecida._
- Proteína na Urina — _Os candidatos fornecidos não incluem o código correto para pesquisa ou dosagem de proteínas totais na urina (como o TUSS 40311201 ou 40311210)._
- Densidade da Urina — _Os candidatos fornecidos referem-se a pesquisas e dosagens de outras substâncias específicas na urina (como alcaptona, porfobilinogênio, osmolalidade, etc.), não havendo correspondência para a densidade urinária isolada._
- Percentual de Gordura Corporal — _Não há código TUSS/SIGTAP específico para o resultado 'Percentual de Gordura Corporal'. Os códigos existentes referem-se aos métodos/procedimentos de avaliação (ex: 20101104 - bioimpedanciometria)._
- Massa Magra — _Não há código TUSS/SIGTAP específico para o parâmetro isolado 'Massa Magra', apenas para os procedimentos de avaliação de composição corporal que a mensuram._
- Volume de Gordura Visceral — _Não há código TUSS/SIGTAP correspondente para a medição do volume de gordura visceral entre os candidatos, pois trata-se de um parâmetro de imagem e os candidatos são exames laboratoriais ou procedimentos cirúrgicos não relacionados._
- Massa de Gordura Visceral — _Não há código TUSS/SIGTAP correspondente para a avaliação de Massa de Gordura Visceral na lista de candidatos._
- Percentual de Gordura Androide — _Não há código TUSS/SIGTAP específico para a medição isolada do percentual de gordura androide na lista de candidatos._
- Percentual de Gordura Ginoide — _Não há código TUSS/SIGTAP específico para o parâmetro 'Percentual de Gordura Ginoide' isolado, sendo este geralmente um resultado derivado de exames de imagem como a densitometria de corpo inteiro (DEXA) ou bioimpedância._
- Massa Total — _Não há código específico para aferição isolada de peso corporal na tabela TUSS/SIGTAP, sendo parte integrante de consultas ou avaliações antropométricas._
- Fator Reumatoide — _Não há código SIGTAP oficialmente mapeado para a dosagem quantitativa do Fator Reumatoide entre as opções fornecidas._
- Bactérias na Urina — _Os candidatos fornecidos referem-se a pesquisas de outras substâncias específicas na urina (como alcaptona, lipóides, melanina, etc.), não havendo correspondência para bactérias._
- Cor da Urina — _Nenhum dos códigos candidatos corresponde à avaliação isolada da cor da urina, que é parte integrante do exame de urina tipo I (EAS)._
- Cetonas na Urina — _Os candidatos fornecidos referem-se a outras substâncias na urina (alcaptona, lipóides, melanina, porfobilinogênio, etc.), não havendo correspondência para cetonas._
- Índice de Massa Corporal — _O IMC é um dado clínico/antropométrico e não um exame laboratorial faturável isoladamente, portanto não possui código específico nas tabelas TUSS e SIGTAP._
- Massa Livre de Gordura — _Não há código TUSS/SIGTAP laboratorial para avaliação de massa livre de gordura, pois trata-se de um parâmetro de composição corporal e não de um analito bioquímico._
- Massa de Gordura — _Não há código TUSS/SIGTAP para o parâmetro isolado de massa de gordura, pois trata-se de um resultado de avaliação de composição corporal e não de um exame laboratorial._
- Hemoglobina Corpuscular Média — _Parâmetro calculado integrante do hemograma completo, sem código isolado para faturamento._
- Anticorpos Anti-Gliadina Deamidada IgG — _A lista de candidatos não contém o código TUSS para anticorpos anti-gliadina (ex: 40306933) ou anti-gliadina deamidada._
