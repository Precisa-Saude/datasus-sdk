# @precisa-saude/datasus

Toolkit alto-nível para microdados abertos do DATASUS — cliente FTP com cache, schemas tipados por vintage, labeling (CID-10, IBGE, CBO, SIGTAP) e agregações prontas para consumo por web apps e CLIs.

## Instalação

```bash
npm install @precisa-saude/datasus
```

## Uso (preview)

```ts
import { sih } from '@precisa-saude/datasus';

const admissions = await sih.load({
  uf: 'SP',
  year: 2024,
  month: 3,
});

// Saída em JSON, pronta para pipar em jq ou consumir via fetch
console.log(JSON.stringify(admissions.topCidByMunicipio(10), null, 2));
```

## Datasets suportados (em desenvolvimento)

- **SIH-RD** — Autorização de Internação Hospitalar (reduzida)
- **SINAN** — Agravos de notificação (dengue, chikungunya, zika)
- **CNES** — Cadastro de estabelecimentos

## Licença

[Apache-2.0](../../LICENSE)
