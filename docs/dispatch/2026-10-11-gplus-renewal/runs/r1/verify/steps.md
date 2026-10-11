# R1 批末 verify 逐步结果

集成分支 HEAD d8586dd（2026-10-11T02:09:12Z 至 02:18:31Z）。逐步运行根 `verify` 的 30 步、遇红继续（真实 `pnpm verify` 撞第一条红即停）；完整日志在本会话 scratch 的 `r1-verify/` 目录，运行后改写的回执已存档于 scratch 并还原。

| # | 步骤 | 结果 | 秒 | 日志 |
| --- | --- | --- | --- | --- |
| 1 | `pnpm install --frozen-lockfile` | 绿 | 1 | scratch r1-verify/01-install_--frozen-lockfile.log |
| 2 | `pnpm typecheck` | 绿 | 3 | scratch r1-verify/02-typecheck.log |
| 3 | `pnpm build` | 绿 | 7 | scratch r1-verify/03-build.log |
| 4 | `pnpm dist:hygiene` | 绿 | 0 | scratch r1-verify/04-dist:hygiene.log |
| 5 | `pnpm test` | 绿 | 7 | scratch r1-verify/05-test.log |
| 6 | `pnpm tokens:proof` | 红 | 2 | scratch r1-verify/06-tokens:proof.log |
| 7 | `pnpm contract:proof` | 绿 | 1 | scratch r1-verify/07-contract:proof.log |
| 8 | `pnpm component-modifiers:proof` | 绿 | 0 | scratch r1-verify/08-component-modifiers:proof.log |
| 9 | `pnpm badge-wrap:proof` | 绿 | 1 | scratch r1-verify/09-badge-wrap:proof.log |
| 10 | `pnpm geometry:proof` | 红 | 99 | scratch r1-verify/10-geometry:proof.log |
| 11 | `pnpm shell:parity` | 红 | 71 | scratch r1-verify/11-shell:parity.log |
| 12 | `pnpm doc-shell:proof` | 绿 | 1 | scratch r1-verify/12-doc-shell:proof.log |
| 13 | `pnpm contract:static` | 红 | 2 | scratch r1-verify/13-contract:static.log |
| 14 | `pnpm brand-asset:proof` | 绿 | 1 | scratch r1-verify/14-brand-asset:proof.log |
| 15 | `pnpm exports:check` | 绿 | 0 | scratch r1-verify/15-exports:check.log |
| 16 | `pnpm pack:smoke` | 绿 | 1 | scratch r1-verify/16-pack:smoke.log |
| 17 | `pnpm storybook:smoke` | 红 | 107 | scratch r1-verify/17-storybook:smoke.log |
| 18 | `pnpm geometry:measure` | 红 | 34 | scratch r1-verify/18-geometry:measure.log |
| 19 | `pnpm storybook:visual-proof` | 红 | 32 | scratch r1-verify/19-storybook:visual-proof.log |
| 20 | `pnpm doc:sample-style` | 红 | 7 | scratch r1-verify/20-doc:sample-style.log |
| 21 | `pnpm fonts:render` | 绿 | 25 | scratch r1-verify/21-fonts:render.log |
| 22 | `pnpm readme:proof` | 绿 | 0 | scratch r1-verify/22-readme:proof.log |
| 23 | `pnpm public:naming:proof` | 绿 | 0 | scratch r1-verify/23-public:naming:proof.log |
| 24 | `pnpm public-output:scan` | 绿 | 0 | scratch r1-verify/24-public-output:scan.log |
| 25 | `pnpm internal-vocab:scan` | 红 | 0 | scratch r1-verify/25-internal-vocab:scan.log |
| 26 | `pnpm generic:scan` | 绿 | 1 | scratch r1-verify/26-generic:scan.log |
| 27 | `pnpm ds:consumption:proof` | 绿 | 5 | scratch r1-verify/27-ds:consumption:proof.log |
| 28 | `pnpm full-surface:proof` | 红 | 7 | scratch r1-verify/28-full-surface:proof.log |
| 29 | `pnpm scaffold:proof` | 绿 | 0 | scratch r1-verify/29-scaffold:proof.log |
| 30 | `pnpm internal-alpha:proof` | 红 | 144 | scratch r1-verify/30-internal-alpha:proof.log |

共 30 步，红 11 步。
