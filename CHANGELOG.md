## [2.1.1](https://github.com/Precisa-Saude/datasus-sdk/compare/v2.1.0...v2.1.1) (2026-10-02)

### Bug Fixes

* **deps:** datasus-dbc ^2.0.4 no core ([#23](https://github.com/Precisa-Saude/datasus-sdk/issues/23)) ([1f57b38](https://github.com/Precisa-Saude/datasus-sdk/commit/1f57b38ed9f349e422b4e4cac05ce8ff07fa30d4))

## [2.1.0](https://github.com/Precisa-Saude/datasus-sdk/compare/v2.0.3...v2.1.0) (2026-10-02)

### Features

* **core:** cache revalida o tamanho no FTP e só grava downloads completos ([#22](https://github.com/Precisa-Saude/datasus-sdk/issues/22)) ([ebb4f35](https://github.com/Precisa-Saude/datasus-sdk/commit/ebb4f35cd99f862516667fb0a002ed4a74b9512b))

### Bug Fixes

* **ci:** guard de release compara desde a última release, não o push ([#18](https://github.com/Precisa-Saude/datasus-sdk/issues/18)) ([c73f037](https://github.com/Precisa-Saude/datasus-sdk/commit/c73f03743c65adb5e352c56424762300c4630932))
* **ci:** publish-watch aceita pacote sem tag quando bate com o package.json ([#17](https://github.com/Precisa-Saude/datasus-sdk/issues/17)) ([9b7493f](https://github.com/Precisa-Saude/datasus-sdk/commit/9b7493f798a37a5b2082e92dcc9f492a9fcd8477)), closes [#48](https://github.com/Precisa-Saude/datasus-sdk/issues/48) [tooling#52](https://github.com/Precisa-Saude/tooling/issues/52)
* **ci:** publish-watch compara a versão do pacote, não a maior tag ([#16](https://github.com/Precisa-Saude/datasus-sdk/issues/16)) ([5dc0a1c](https://github.com/Precisa-Saude/datasus-sdk/commit/5dc0a1c0c16d3d15f5282f905ee7a31e14573d3b)), closes [tooling#51](https://github.com/Precisa-Saude/tooling/issues/51)
* quebra volta a gerar versão maior ([#21](https://github.com/Precisa-Saude/datasus-sdk/issues/21)) ([04841ec](https://github.com/Precisa-Saude/datasus-sdk/commit/04841ec214f7507a45f9daa34b335d21d73005b0))

### Documentation

* README raiz com overview, pacotes, exemplo e estado ([#6](https://github.com/Precisa-Saude/datasus-sdk/issues/6)) ([56556df](https://github.com/Precisa-Saude/datasus-sdk/commit/56556df123145d2ed5471f277d00fb7a12599ffd))

### CI/CD

* atualizar GitHub Actions para o runtime Node 24 ([#12](https://github.com/Precisa-Saude/datasus-sdk/issues/12)) ([8d94761](https://github.com/Precisa-Saude/datasus-sdk/commit/8d947617a89c82bc5f50a4457c4f1ed9057d5f9d))
* bump pnpm/action-setup para v5 (Node.js 24) ([#5](https://github.com/Precisa-Saude/datasus-sdk/issues/5)) ([b74234f](https://github.com/Precisa-Saude/datasus-sdk/commit/b74234f4582c2a3131fdd72ab8214b22be765007))
* pin actions e adicionar tripwire publish-watch (postmortem TanStack) ([#8](https://github.com/Precisa-Saude/datasus-sdk/issues/8)) ([16c1b8a](https://github.com/Precisa-Saude/datasus-sdk/commit/16c1b8a9d3aca166123f5c01cbbd745ce5238a9d))
* roda publish-watch uma vez por dia em vez de a cada 15min ([#9](https://github.com/Precisa-Saude/datasus-sdk/issues/9)) ([e5cdb25](https://github.com/Precisa-Saude/datasus-sdk/commit/e5cdb25e16ff328491b2fb8e4ba803e8b7d97bd2))
* sincroniza template de review-dispatch (pr_number como number) ([#20](https://github.com/Precisa-Saude/datasus-sdk/issues/20)) ([f0c3e32](https://github.com/Precisa-Saude/datasus-sdk/commit/f0c3e32a6f05d81d449d5a21b0c43c8b0758e6e6))

### Chores

* **ci:** sincroniza templates do cli 1.13.1 ([#15](https://github.com/Precisa-Saude/datasus-sdk/issues/15)) ([afb7092](https://github.com/Precisa-Saude/datasus-sdk/commit/afb709234aef63c671c929201153493a93ae8288)), closes [tooling#47](https://github.com/Precisa-Saude/tooling/issues/47) [tooling#48](https://github.com/Precisa-Saude/tooling/issues/48) [tooling#50](https://github.com/Precisa-Saude/tooling/issues/50)
* **ci:** sincroniza templates e declara divergências deliberadas ([#14](https://github.com/Precisa-Saude/datasus-sdk/issues/14)) ([c837ce2](https://github.com/Precisa-Saude/datasus-sdk/commit/c837ce2c41832da01cca49f29e889f888e986d07))
* **config:** precisa sync — publishPackages + template refresh ([#4](https://github.com/Precisa-Saude/datasus-sdk/issues/4)) ([0476f24](https://github.com/Precisa-Saude/datasus-sdk/commit/0476f24a6e5e1b5af531716595ca18f4d768bde4)), closes [#if](https://github.com/Precisa-Saude/datasus-sdk/issues/if) [Precisa-Saude/tooling#28](https://github.com/Precisa-Saude/tooling/issues/28) [tooling#27](https://github.com/Precisa-Saude/tooling/issues/27)
* **config:** remover shamefully-hoist=false do .npmrc ([#3](https://github.com/Precisa-Saude/datasus-sdk/issues/3)) ([312a5f9](https://github.com/Precisa-Saude/datasus-sdk/commit/312a5f9b321383f5fa44046ef7b3854e9b5f29eb)), closes [Precisa-Saude/tooling#26](https://github.com/Precisa-Saude/tooling/issues/26)

## [2.0.3](https://github.com/Precisa-Saude/datasus-sdk/compare/v2.0.2...v2.0.3) (2026-04-24)

### Bug Fixes

* validar contenção do caminho no download FTP ([#2](https://github.com/Precisa-Saude/datasus-sdk/issues/2)) ([eb0f9e7](https://github.com/Precisa-Saude/datasus-sdk/commit/eb0f9e7526664dd5d598c73f016c5b3eababfdac))

### Documentation

* **core:** corrigir nome do pacote e status do SIA-SUS no README ([#1](https://github.com/Precisa-Saude/datasus-sdk/issues/1)) ([5556f5c](https://github.com/Precisa-Saude/datasus-sdk/commit/5556f5cb1c994594fb3da6ba76d88b35231ce400))

## [2.0.2](https://github.com/Precisa-Saude/datasus-sdk/compare/v2.0.1...v2.0.2) (2026-04-24)

### Bug Fixes

* **security:** usar contexto do repo atual no pr-review-responder ([bb2d07d](https://github.com/Precisa-Saude/datasus-sdk/commit/bb2d07d4154d3d0b0d78f435741189a419272427))
