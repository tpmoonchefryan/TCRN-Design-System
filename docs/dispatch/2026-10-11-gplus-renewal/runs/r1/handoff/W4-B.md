# 交回说明 · W4-B

## 已交付

- SUB-037：契约静态门加 story 渲染层。`scripts/contract-static-proof.mjs` 读构建后的 `apps/storybook/storybook-static/*.html` 里带 `data-story-id` 的 story 区块，按条款加规则：C7 `story-title-missing`、`story-forced-wrap`；C8 `story-yield-missing`、`story-yield-not-unique`、`story-yield-in-fixed`、`story-item-not-fixed`、`story-inline-override`；C11 `story-emoji`、`story-card-in-card`、`story-inline-style`、`story-same-shape`、`story-generic-shell`。读不到 story 时 C7、C8、C11 各判红（`Cx.story-input-missing`），不跳过。新增 `--family <id>[,<id>…]` 子集，未知 id 判红。
- `scripts/lib/css-rules.mjs` 加无依赖的渲染标记读取（`parseHtml`、`elementClasses`、`walkElements`、`textContent`、`decodeEntities`）与 `emojiInText`。
- `docs/contract/`：`roles.json` 加 `shell`（C11 通用件拼壳的壳层条、控件位与搜索组件登记）；`exemptions.json` 加 `EX-INIT015-lock-hint-emoji`（只含 C11，按类登记 LockHint 🔒，引用 INIT 不授权段、P4 与本 Subtask 判据），共 12 条；`clauses.md` 写明各 story 规则与口径。
- 测试 65 条（原 41 条加 24 条：标记读取、语义、夹具 story 全绿、18 条 story 变异各自转红、输入缺失判红、story 发现的豁免计数、`--family` 子集、仓内登记一致性）。

## 现仓结果（本包树，build 之后）

C2 红 7、C5 红 1；C6、C7、C8、C11、C13 绿。C7、C8、C11 的 story 层发现全部归后续批次家族或 LockHint 条目，按条目计数（C7 1378、C8 42、C11 35）。逐条与建议改法见 `problems/W4-B.md` Q1–Q5。

## 给批末返工

- 转绿只差 Q1–Q5（8 条），都在组件侧：`contract/typography.json` 加生成器（Q1，改共享契约）、`base.css.ts`（Q2、Q5，base 已冻结）、`inputs.css.ts`（Q3、Q4；Q3 如要新元组名就要动 `pairs.json`）。改完 `run build` 后复跑 `node scripts/contract-static-proof.mjs`，应为全绿；用 `--family typography` 或 `--family inputs` 可以只看某一族。
- 接入 verify（Q8）：改 `package.json` 不在本包文件集，脚本形态同 W1-E。

## 可复用的导出

`readStoryLayer(storyPages)`、`loadStoryPages(root)`、`checkC7Story`、`checkC8Story`、`checkC11Story`、`semanticOf`、`packageClassesOf`、`c11DeclarationProblems`、`isCardRoot`、`familyArguments`；`evaluateContract` 新增 `storyPages`、`storySource`、`familyFilter` 参数。

## 命令

在包树根：`corepack pnpm@10.12.1 -C <树> run build`，然后 `corepack pnpm@10.12.1 -C <树> exec node --test tests/contract-static-proof.test.mjs` 与 `corepack pnpm@10.12.1 -C <树> exec node scripts/contract-static-proof.mjs [--details] [--report <path>] [--family <id>]`。门不写回执，也不写仓内文件。
