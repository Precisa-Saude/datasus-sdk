# Convenções

## Formato de commit

[Conventional Commits](https://www.conventionalcommits.org):

```
tipo(escopo): descrição curta

corpo opcional mais longo

BREAKING CHANGE: notas (opcional)
```

**Tipos**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`, `revert`

**Escopos**: declarados em `.commitlintrc.cjs`.

**Idioma**: a descrição do commit é escrita em pt-BR; o tipo permanece em inglês (convenção universal do Conventional Commits).

**Atribuição de IA**: não inclua linhas como `Co-Authored-By: Claude`, `Generated with Claude` ou similares. O hook `commit-msg` bloqueia esses padrões.

## Estilo de código

- TypeScript strict mode, `noUncheckedIndexedAccess`
- Módulos ESM
- Formatação aplicada via Prettier (100 chars de largura, aspas simples, ponto-e-vírgula, trailing commas — via `@precisa-saude/prettier-config`)
- Regras ESLint via `@precisa-saude/eslint-config`
- Imports ordenados por `eslint-plugin-simple-import-sort`
- Interfaces, objetos e props JSX ordenados por `eslint-plugin-perfectionist` quando aplicável

## Testes

Vitest com piso de 80% de cobertura (configurado por repo em `vitest.config.ts`).

## Regras de dependências

- Pacotes core/SDK evitam dependências runtime quando viável
- Dependências externas requerem aprovação explícita no PR
