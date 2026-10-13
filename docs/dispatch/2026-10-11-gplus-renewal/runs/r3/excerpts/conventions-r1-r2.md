# 附件 · R1 与 R2 跨包约定（R3 各包共用）

R3 各包摘录只内联 R3 第 1 节；下面两节继续有效，与 R3 约定冲突时以 R3 为准。

## R1 跨包约定（runs/r1/decomposition.md 第 1 节）

1. **Token 变量名由契约定。** `docs/design/gplus-2026-10/contract/tokens.json` 每条带 `cssVar`。颜色用 `--tcrn-color-<短横线键名>`：bg、bg-2、panel、panel-2、line、line-2、line-3、line-ctl、rule、ink、ink-2、ink-3、acc、acc-2、acc-3、acc-bg、acc-ul、on-acc、red、red-bg、red-bg-2、ok、warn、bad、bad-bg、wash、hover、dis、glass、chrome、av-bg、av-ink、knob、surface（焦点环间隙色，跟随承载面）。阴影 `--tcrn-shadow-s1|s2|s3|edge`，焦点环 `--tcrn-focus-ring`，品牌后缀 `--tcrn-brand-suffix-<tms|design-system|einzbern|mana-orchestrate>`（aos 保持现状）。字族、字号行高、圆角、控件高、内距、动效沿用现有 `--tcrn-type-*`、`--tcrn-radius-*`、`--tcrn-motion-*` 体系，新增项的变量名同样写在 tokens.json。旧名（`--tcrn-color-text-*`、`--tcrn-color-border-*`、`--tcrn-color-surface-*`、`--tcrn-color-brand-*` 等）在 SUB-001 里保留为指向新名的弃用别名。
2. **夜间选择器**是 `[data-tcrn-theme="dark"]`（与仓库及 STORY-120/129 一致），不是画板的 `.gp.night`。C5 比较的是主题相关 token 的 `:root` 块与 dark 块；主题无关 token 放独立 `:root` 块（SUB-001 定，门按同一口径比较）。
3. **状态对变量。** 变体声明 `--tcrn-pair-fill-<态>`、`--tcrn-pair-ink-<态>`、`--tcrn-pair-edge-<态>`（Actions 态键 d/h/a/f/x/l/s；Inputs 文本类 d/h/f/r/x/e/ef，勾选类与开关类的附加元组由 pairs.json 定名），基础规则读生效对 `--tcrn-pair-fill|ink|edge|weight`。变体选择器特异性 (0,2,0)，如 `.tcrn-button.tcrn-button--primary`；状态规则写成 `.tcrn-button:where(:hover,[data-tcrn-preview-state="hover"])`，特异性 (0,1,0)，排在基础规则之后，只切换生效对、不写颜色。SUB-010 让 token-extension-proof 接受 `--tcrn-pair-*` 局部变量。
4. **静态状态呈现**用属性 `data-tcrn-preview-state="hover|active|focus"`（矩阵 story 用，与真实伪类共用同一对表），不用无前缀的 `.is-hover` 类。
5. **CSS 段归属。** SUB-010 之后 `tcrnComponentCss` 由 `packages/ui-react/src/styles/index.ts` 按原顺序拼接；家族包只改自己的 `styles/<家族>.css.ts`，并在其中引入 `styles/generated/` 的生成段。`styles/index.ts` 只由 SUB-010 写。`styles/base.css.ts` 在 W2 冻结：家族包若需要改 base 里的家族上下文规则，写进本包交回说明 `runs/r1/handoff/<包号>.md`，由 W3-D（SUB-018、SUB-021）统一处理。
6. **生成物只由生成器写。** `styles/generated/**`、`components/Icon/icon-paths.generated.ts`、`components/Navigation/product-marks.generated.ts`、`packages/ui-tokens/src/gplus-tokens.generated.ts`、`apps/storybook/src/contract-stories/gplus/generated/**` 只由 `node scripts/contract-generate.mjs` 写，文件头注明「由 contract 生成，勿手改」；改契约后重生成。
7. **story id 预先定死**（并行包据此对齐）：矩阵 `typography-matrix`、`icon-matrix`、`brand-matrix`、`actions-matrix`、`inputs-matrix`；样板 `typography-sample-billing`、`icon-sample-project`、`brand-sample-product`、`actions-sample-project`、`inputs-sample-members`。真 Storybook 轨的 CSF 标题为 Typography/Icon/Brand/Actions/Inputs，导出 Matrix、SampleBilling、SampleProject、SampleProduct、SampleMembers，对应 Storybook id `typography--matrix`、`typography--sample-billing` 等（STORY-130 用例）。id 与标题不含 aos/tms/workflow（public-naming-proof）。
8. **新门读包 CSS 一律从 dist 导入。** doc-shell-class、contract-static、contract-proof 从 `packages/ui-react/dist/index.js` 导入 `tcrnComponentCss`（先 build），与源文件布局无关；读源文件的旧门由 SUB-010 改用 `scripts/lib/component-css-sources.mjs`。
9. **测量库 API 在 W1 定稿。** `scripts/lib/gplus-measure.mjs`（浏览器注入的八项测量与重叠检查，加 Node 侧运行入口）与 `scripts/lib/storybook-routes.mjs`（story id → 静态页路由）由 SUB-034 定稿；W5 的 SUB-028、SUB-033、SUB-035 只读复用，不改签名，需要改的记问题清单。
10. **命令形态。** 局部门一律在包树根以 `corepack pnpm@10.12.1 -C <包树> exec node <脚本>` 或 `corepack pnpm@10.12.1 -C <包树> run <脚本>` 执行，不 cd、不 rm。局部门只跑本表列出的门，不跑全量 verify。
11. **回执不在实施包里提交。** `docs/verification/internal-alpha/**`、hardening、scaffold、readme 回执只由 W8-A（SUB-046）提交；其它包若跑了会写回执的脚本，跑完用 `git -C <包树> checkout -- <回执路径>` 还原。各新门自己的报告目录（`docs/verification/doc-shell-class/`、`geometry-measure/`、`storybook-visual-proof/`）归对应 Subtask。
12. **渲染文本约束。** story 渲染文本不含工单键（TCRN-DS-*、STORY-*、EPIC-*、INIT-*）与 Codex（internal-vocabulary-scan）；新可见文案五语齐，或作为机器词登记进 `scripts/lib/locale-invariant-ledger.mjs`。
13. **提交。** 按 Subtask 提交，提交信息带 TCRN-DS-SUB-NNN；git 身份与禁止事项按 START（不推送、不打 tag、不发版、不部署）。

## R2 跨包约定（runs/r2/decomposition.md 第 1 节）

1. **沿用 R1。** `runs/r1/decomposition.md` 第 1 节（第 7–21 行）13 条继续有效；与下列条目冲突时以本节为准。
2. **派工档位。** 主力包派 einzbern-main，经济包派 einzbern-economy；包内只要有一张主力档 Subtask，整包按主力派。每包预计不超过 150 回合；单次派工逼近 180 次响应时，按执行约束把工作树提交到干净状态、在交回说明写接续点后交回。
3. **返工不扩大授权。** 只做判断 §2 写明的改法，以及本拆分补入并写明的三处（SUB-066 的 geometry-proof 测量宿主与随原型失效的文案条目、SUB-063 的 dense 原型文档包裹规则、SUB-052 的 tokens.css 字节不变约束）。判断 §3.3 的授权外事项与 O-1 至 O-12 不做；需要新定 pairs 元组名、新增 token、改门的比对字段、改扫描器口径、改导出面之类越级改动时，停下写进包问题文件。
4. **命令形态。** DS 脚本一律 `corepack pnpm@10.12.1 -C <包树> exec node <脚本>`；package.json 脚本用 `corepack pnpm@10.12.1 -C <包树> run <脚本>`；单包构建与测试用 `corepack pnpm@10.12.1 -C <包树> --filter <包名> <脚本>`；git 用 `git -C <包树>`。不 cd、不 rm：仓内删除用 `git rm`，临时产物 mv 进会话 scratch 的 trash。
5. **见红只记。** 局部门里属于别包、O-1 或其它已知原因的红，写进 `runs/r2/problems/<包号>.md`，不修、不为它重跑；本单判据只看本单对应的检查项。复合门要看全貌时逐段跑：`tokens:proof` 12 段、`internal-alpha:proof` 4 段，未执行的段记「未执行」，不记绿。SUB-046 之前，internal-alpha browser-proof 的视觉签名回归与回执不一致不计入判定，各包只读本单相关字段。
6. **回执与报告。** R1 第 11 条照旧，并扩到新门报告：`docs/verification/storybook-visual-proof/**` 与 `docs/verification/geometry-measure/**` 只由 P12（SUB-076、SUB-078）写，`docs/verification/doc-shell-class/**` 只由 SUB-069 写，internal-alpha、hardening、scaffold、readme 回执只由 SUB-046 写。其它包跑了会写这些路径的门，跑完用 `git -C <包树> checkout -- <路径>` 还原，新出现的未跟踪文件 mv 进 trash。
7. **生成物头部。** R1 第 6 条照旧。补充：每个生成物头部的 contract-sha256 覆盖其「contract files」行列出的全部契约文件（tokens.json 进 actions.pairs、inputs.pairs、typography.scale、matrices.generated 与 gplus-tokens.generated 五个头；pairs.json 进前两者与 matrices.generated），改契约会改写多个生成物头。这些头变化归改契约的包（P1、P2）；其它包不得把 contract-generate 的输出提交进来。
8. **交回物。** 每包交回 `runs/r2/handoff/<包号>.md`（提交列表、§3.4 回显项、局部门结果摘要、接续点）与 `runs/r2/problems/<包号>.md`（见红只记的清单，同一根因算一条）。文件名各不相同，不构成文件集相交。
9. **提交。** 按 Subtask 提交，提交信息带 TCRN-DS-SUB-NNN 与来源返工号（如 R2-3）；SUB-066 的提交信息逐条列删掉的断言并引 doc-class-map 的 delete-demo 条目；git 身份与禁止事项按 START（不推送、不打 tag、不发版、不部署，D8 停点）。
10. **包树与合入。** 每包在自己的工作树与分支上做，从集成分支 `claude/init015-gplus-renewal` 在前置包合入后的 HEAD 切出；合入由主线程按 `packages.md` 的依赖顺序做。判据里的行号是 HEAD 7bb7483 上的近似位置，先 grep 再改。
11. **两处新增的先后关系。** P6 在 P7 合入后起：两包都要改 `apps/storybook/src/build/locales/storybook-content-text.ts` 与 `scripts/lib/locale-invariant-ledger.mjs`。P2 不改 `tokens.css` 与 `storybook.css`（SUB-052 的判据），因此可与 P5 并行；若 SUB-052 做不到字节不变，P2 停在该单，等 P5 合入后再续。
12. **R3 规则（主线程用）。** R3 起同一修复目标被退回：经济档项升主力、单独成包；主力档项再被退回即停下，写进收口文件交 Owner（判断 §5 末段）。

