# Specific instructions — datasus-sdk

> This file holds ONLY the rules specific to this repository. The
> shared rules across the precisa-saude ecosystem (tone, git, hooks,
> reviews, worktrees, source verification, test coverage, code
> conventions) live in `@precisa-saude/agent-instructions`.
>
> **Read the shared base online:**
> https://github.com/Precisa-Saude/tooling/blob/main/packages/agent-instructions/AGENTS.md
>
> Claude Code loads both files (shared base + this one) via imports in
> `CLAUDE.md`. Update the base with:
> `pnpm update @precisa-saude/agent-instructions`.

## Overview

<!-- One or two sentences on what this repo does. -->

## Structure

```
packages/
  ...
site/  (if applicable)
```

## Commit scopes

Valid scopes: `core`, `deps`, `docs`, `ci`, `lint`, `config`.

## Worktree — specific values

Worktree flow and commands are in the shared base. The canonical config
lives in `package.json` under `"worktree"`. For quick reference:

| Field         | Value                                      |
| ------------- | ------------------------------------------ |
| Port registry | `/tmp/datasus-sdk-worktree-ports.json`     |
| Services      | (filled in when the repo adds dev servers) |

Launch a dev server in a feature worktree:

```bash
pnpm exec precisa-worktree dev --detach
```
