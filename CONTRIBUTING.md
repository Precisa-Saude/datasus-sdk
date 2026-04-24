# Contribuindo

Obrigado por considerar contribuir com `datasus-sdk`.

## Desenvolvimento

```bash
pnpm install
pnpm -r build
pnpm -r typecheck
pnpm -r test
pnpm -r lint
```

Node 22+ e pnpm 9.15.9+ são obrigatórios (veja `.nvmrc` e o campo `packageManager`).

## Fluxo

1. Faça fork (ou branch) a partir de `main`
2. Abra um PR — pushes diretos para `main` não são permitidos
3. CI precisa estar verde
4. Um revisor aprova e mescla via GitHub

Commits seguem [Conventional Commits](https://www.conventionalcommits.org). Os escopos válidos para este repo estão configurados em `.commitlintrc.cjs`. Mensagens de commit em pt-BR (descrição); o `tipo` (`feat`, `fix`, etc.) permanece em inglês por convenção universal.

## Mudanças de dependências

Pergunte antes de adicionar dependências runtime ou peer. Na descrição do PR explique: o que o pacote faz, por que é necessário e se uma dependência existente poderia atender ao propósito.

## Assinatura

Todos os commits devem ser assinados via GPG. O hook `commit-msg` bloqueia atribuições de IA (`Co-Authored-By: Claude` e similares).
