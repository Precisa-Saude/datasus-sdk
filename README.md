# datasus-sdk

[![CI](https://github.com/Precisa-Saude/datasus-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/Precisa-Saude/datasus-sdk/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![npm @precisa-saude/datasus-sdk](https://img.shields.io/npm/v/@precisa-saude/datasus-sdk?label=%40precisa-saude%2Fdatasus-sdk)](https://www.npmjs.com/package/@precisa-saude/datasus-sdk)

SDK TypeScript para microdados abertos do DATASUS — cliente FTP com cache, schemas tipados de SIA-PA e CNES-ST, terminologia (IBGE, LOINC, SIGTAP, CBO), labeling e agregações prontas pra consumo em web apps e CLIs.

Mantido pela [Precisa Saúde](https://precisa-saude.com.br) como infraestrutura aberta para pesquisa epidemiológica brasileira.

---

## Visão geral

O DATASUS publica milhões de registros mensais em `.dbc` (xBase DBF comprimido) no `ftp.datasus.gov.br`, sem APIs, sem schemas tipados, sem códigos de referência prontos. Este SDK transforma isso num pipeline ergonômico:

- **FTP cliente** com cache automático em `~/.cache/datasus-brasil/` — baixa só se não estiver em disco
- **Streaming** memória-constante (`stream*`) ou bulk (`load*`) por dataset
- **Schemas tipados** das colunas `XXXX_*` raw do DBF
- **Terminologia** — IBGE municípios (5570), LOINC↔SIGTAP↔TUSS, CBO, tipo de unidade CNES
- **Labeling** — junta um registro raw com seu rótulo legível (`labelEstabelecimento`, `labelProducaoAmbulatorial`)
- **Aggregations** — `topN`, `countBy`, `countByNested` pra reduzir registros em sumários

> Decoder DBC vive separado em [`datasus-dbc`](https://github.com/Precisa-Saude/datasus-dbc); arquivo Parquet público pré-processado vive em [`datasus-parquet`](https://github.com/Precisa-Saude/datasus-parquet); visualização interativa em [`datasus-viz`](https://github.com/Precisa-Saude/datasus-viz).

---

## Pacotes

| Pacote                                                  | Descrição                                                      |
| ------------------------------------------------------- | -------------------------------------------------------------- |
| [`@precisa-saude/datasus-sdk`](packages/core/README.md) | SDK completo: FTP, schemas, terminologia, labeling, agregações |

Dependência runtime: `@precisa-saude/datasus-dbc` (decoder DBC) + `basic-ftp`.

---

## Instalação

```bash
npm install @precisa-saude/datasus-sdk
```

---

## Exemplo

```ts
import { sia, findMunicipio, sigtapToLoinc, topN } from '@precisa-saude/datasus-sdk';

const procPorMunicipio = new Map<string, number>();

for await (const record of sia.streamProducaoAmbulatorial({ uf: 'AC', year: 2024, month: 1 })) {
  if (!String(record.PA_PROC_ID).startsWith('0202')) continue; // só laboratório
  const cod = String(record.PA_UFMUN);
  procPorMunicipio.set(cod, (procPorMunicipio.get(cod) ?? 0) + Number(record.PA_QTDAPR ?? 0));
}

const top10 = topN(procPorMunicipio, 10).map(({ key, count }) => ({
  municipio: findMunicipio(key)?.nome ?? key,
  exames: count,
}));
console.log(top10);
```

Mais exemplos em [`packages/core/README.md`](packages/core/README.md).

---

## Datasets suportados

- **SIA-PA** — Produção Ambulatorial (procedimentos laboratoriais SIGTAP, faturamento, CID-10, CBO)
- **CNES-ST** — Estabelecimentos de Saúde (cadastro com tipo, leitos, vínculos)
- **CNES-PF** — Profissionais de Saúde (vínculo + CBO + carga horária)

Adições futuras: SIH-RD (internações), SIM (mortalidade), SINASC (nascidos vivos), SINAN (agravos). Veja [issues](https://github.com/Precisa-Saude/datasus-sdk/issues) marcadas com `dataset`.

---

## Estado

- ✅ FTP client + cache funcional
- ✅ SIA-PA + CNES-ST/PF schemas tipados
- ✅ Terminologia IBGE (5570 municípios), SIGTAP, LOINC, CBO
- ✅ ≥80% cobertura de testes
- 🟡 Datasets adicionais (SIH, SIM, SINASC, SINAN) — contribuições bem-vindas

---

## Contribuindo

PRs bem-vindas. Veja [`CONTRIBUTING.md`](CONTRIBUTING.md) e [`AGENTS.md`](AGENTS.md) para convenções (Conventional Commits, pt-BR pra docs/comentários, escopo limitado por PR, ≥80% cobertura).

Issues sobre datasets específicos têm prioridade quando vierem com caso de uso epidemiológico concreto.

---

## Licença

Apache-2.0 — veja [`LICENSE`](LICENSE).

Microdados DATASUS são distribuídos sob regime de dados abertos do governo brasileiro (Lei 12.527/2011, Decreto 8.777/2016). Esta SDK não os redistribui — apenas baixa do FTP oficial sob demanda.
