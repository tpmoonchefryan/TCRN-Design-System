# TCRN-DS-INIT-015 · R4 分包

6 张新 Subtask（TCRN-DS-SUB-107 至 TCRN-DS-SUB-112）分 1 个包、1 个波次。包号 P0 即 R3 判断 §5.1 的 R4 包。包从 R3 链写（含 R4 建单）读回后的集成分支（`claude/init015-gplus-renewal`）HEAD 切出；包内按列出的顺序做。Subtask 的文件、判据与局部门见 `decomposition.md` 第 3 节，跨包约定见其第 1 节。本表、`decomposition.md` 第 3 节、`subtasks.json` 与 `subtasks-batch.json` 由同一份数据生成。

## 规则与校验

- 校验结果：新键 TCRN-DS-SUB-107 至 TCRN-DS-SUB-112 连续，6 张，全部经济；父单 id 均属 R3 判断 §3.6 J-10 列的 3 张 Story（130、133、134），链上都是 active；包内依赖都排在前面（SUB-110 依赖 SUB-107：同改词条文件；SUB-111 依赖 SUB-110：复用其构建产物做实测；SUB-112 依赖其余五张）。
- 只有一个包，没有可能同时运行的包对；本轮没有别的实施包与它的文件集相交。
- 包完成即退役：只跑表中的局部门，不跑全量 verify、不验收、不写链；回执与报告只由 SUB-112 提交（跨包约定第 3 条）。
- 档位：整包经济档（`einzbern-economy`）；预计 80–120 回合，不超过 150。

## 包表

| 包 | 名称 | Subtask（有序） | 独占文件集 | 档位 | 预计回合 | 须先合入 | 局部门（完整命令见下节） | 交回物 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0 | 文档回写、文案与批末再生 | SUB-107 → SUB-108 → SUB-109 → SUB-110 → SUB-111 → SUB-112 | `apps/storybook/src/contract-stories/governance.ts`、`apps/storybook/src/build/locales/storybook-content-text.ts`、`docs/contract/README.md`、`scripts/storybook-visual-proof.mjs`（只第 491 行）、`scripts/lib/locale-invariant-ledger.mjs`、`apps/storybook/src/contract-stories/story-content.tsx`（只知识库样板面板）、`docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md`、`docs/verification/internal-alpha/**`（no-overclaim-scan.json 除外）、`docs/verification/internal-alpha-hardening-proof.json`、`docs/verification/internal-alpha-hardening-proof.md`、`docs/verification/scaffold-proof.json`、`docs/verification/scaffold-proof.md`、`docs/verification/readme-public-contract.json`、`docs/verification/storybook-visual-proof/gplus-map-report.json`、`docs/verification/storybook-visual-proof/gplus-map-report.md`、`packages/ui-tokens/fonts/**`（仅当 fonts:vendor 执行） | 经济 | 80–120 | 无（R3 链写读回后起） | `run build`；`--filter @tcrn/design-system-storybook test`；`run public-output:scan`；`run internal-vocab:scan`；`run readme:proof`；`run scan`；`run doc-shell:proof`；`run contract:static`；`exec node --test tests/storybook-visual-proof.test.mjs`；`run internal-alpha:contracts`；`run internal-alpha:browser-proof`；`exec node scripts/internal-alpha-browser-proof.mjs --update-visual-baseline <selection.json>`；`exec node scripts/internal-alpha-hardening-proof.mjs`；`run scaffold:proof`；`exec node scripts/storybook-visual-proof.mjs --write-report`；`run storybook:visual-proof`；`exec node scripts/fonts-vendor.mjs --check`；`run fonts:vendor`（条件）；`exec node scripts/fonts-proof.mjs` | handoff/P0.md 与 problems/P0.md（见下文「交回物」） |

## 波次与就绪条件

| 波 | 包 | 就绪条件 |
| --- | --- | --- |
| W1 | P0 | R3 链写（含 R4 建单）已提交并读回；集成分支工作树干净。P0 合入后主线程跑 R4 末次 verify：逐段 30 步 44 段（遇红继续），另跑一次真实 `corepack pnpm@10.12.1 run verify` 与 `storybook:build` 记退出码；随后一个主力档代理做 R4 的验收与判断（小轮合并） |

### 分单预计回合

| Subtask | 预计回合 |
| --- | --- |
| SUB-107 | 8–12 |
| SUB-108 | 12–18 |
| SUB-109 | 4–6 |
| SUB-110 | 10–16 |
| SUB-111 | 15–23 |
| SUB-112 | 30–45 |
| 合计 | 79–120 |

## 交回物

- `runs/r4/handoff/P0.md`：提交列表；每张的判据读数；N-1 实测（浅色、夜间的计算字色、合成底色与对比度，以及读法）；SUB-110 加的句子的五语原文与该 story 高度前后值；SUB-112 重收条目（story、视口、前后签名 sha256）、三次 browser-proof 的非视觉读数、提交的回执清单、`fonts-vendor --check` 结果、映射报告的 rowsOk 与 HEAD；R3 判断 §3.6 的回显项（J-4 还原、J-6 改名）；会话 scratch 里留下的探针与副本及可清理条件；接续点。
- `runs/r4/problems/P0.md`：见红只记，同一根因算一条；写现象、证据与建议去向。

## 局部门完整命令（按 Subtask）

### TCRN-DS-SUB-107

- `corepack pnpm@10.12.1 -C <包树> run build`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
- `corepack pnpm@10.12.1 -C <包树> run public-output:scan（跑完 git -C <包树> checkout -- docs/verification 还原回执，新出现的未跟踪文件移进会话 scratch 的 trash）`
- `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan（跑完 git -C <包树> checkout -- docs/verification 还原回执，新出现的未跟踪文件移进会话 scratch 的 trash）`

### TCRN-DS-SUB-108

- `corepack pnpm@10.12.1 -C <包树> exec node --test tests/storybook-visual-proof.test.mjs`
- `corepack pnpm@10.12.1 -C <包树> run readme:proof（跑完 git -C <包树> checkout -- docs/verification 还原回执，新出现的未跟踪文件移进会话 scratch 的 trash）`
- `corepack pnpm@10.12.1 -C <包树> run public-output:scan（跑完 git -C <包树> checkout -- docs/verification 还原回执，新出现的未跟踪文件移进会话 scratch 的 trash）`

### TCRN-DS-SUB-109

- `git -C <包树> grep -n "locale-invariant-ledger" -- scripts tests apps（找出消费方，有单测就跑）`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`

### TCRN-DS-SUB-110

- `corepack pnpm@10.12.1 -C <包树> run build`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
- `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
- `corepack pnpm@10.12.1 -C <包树> run contract:static`
- `corepack pnpm@10.12.1 -C <包树> run public-output:scan（跑完 git -C <包树> checkout -- docs/verification 还原回执，新出现的未跟踪文件移进会话 scratch 的 trash）`
- `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan（跑完 git -C <包树> checkout -- docs/verification 还原回执，新出现的未跟踪文件移进会话 scratch 的 trash）`

### TCRN-DS-SUB-111

- `会话 scratch 探针（不进仓）：在包内最近一次 run build 的产物上开浅色与夜间文档页，读 .tcrn-doc-nav__category-count 的计算字色与合成后的底色`
- `corepack pnpm@10.12.1 -C <包树> run public-output:scan（跑完 git -C <包树> checkout -- docs/verification 还原回执，新出现的未跟踪文件移进会话 scratch 的 trash）`
- `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan（跑完 git -C <包树> checkout -- docs/verification 还原回执，新出现的未跟踪文件移进会话 scratch 的 trash）`
- `corepack pnpm@10.12.1 -C <包树> run readme:proof（跑完 git -C <包树> checkout -- docs/verification 还原回执，新出现的未跟踪文件移进会话 scratch 的 trash）`
- `corepack pnpm@10.12.1 -C <包树> run scan（跑完 git -C <包树> checkout -- docs/verification/internal-alpha/no-overclaim-scan.json 还原）`

### TCRN-DS-SUB-112

- `corepack pnpm@10.12.1 -C <包树> run build`
- `corepack pnpm@10.12.1 -C <包树> run internal-alpha:contracts`
- `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-browser-proof.mjs --update-visual-baseline <selection.json>`
- `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof（应用后复跑，不重建）`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-hardening-proof.mjs`
- `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
- `corepack pnpm@10.12.1 -C <包树> run scaffold:proof`
- `corepack pnpm@10.12.1 -C <包树> run readme:proof`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/storybook-visual-proof.mjs --write-report`
- `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
- `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/fonts-vendor.mjs --check`
- `corepack pnpm@10.12.1 -C <包树> run fonts:vendor（仅当 --check 报 R4 新中文缺字形时）`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/fonts-proof.mjs`
