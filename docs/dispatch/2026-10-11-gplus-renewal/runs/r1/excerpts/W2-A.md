# 摘录 · W2-A（INIT-015 R1）

本摘录由主线程从 R1 拆分文件切出，只含本包需要的部分；不要去读整份拆分文件。链上 Story 的 scope 仍是任务权威。

## 1. 跨包约定（实施包必须遵守，改动须先回拆分）

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

## 本包（packages.md）

| 包 | Subtask（包内按序） | 独占文件集 | 预计响应数 | 交回物 |
| --- | --- | --- | --- | --- |
| W2-A | SUB-001 → SUB-006 | `packages/ui-tokens/src/index.ts`<br>`packages/ui-tokens/src/tokens.css`<br>`apps/storybook/src/storybook.css`<br>`scripts/tokens-sync.mjs`<br>`packages/ui-tokens/src/index.test.ts`<br>`scripts/fonts-proof.mjs` | 115 | G+ token（颜色、字体、形状、动效）、tokens.css 与 storybook token 块再生、别名表 |

包内局部门：

- W2-A：`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`；`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/fonts-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/stamp-whitelist-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`

## 本包 Subtask（decomposition.md 第 3 节）

#### TCRN-DS-SUB-001 · G+ 色彩与控件轮廓 token 进 index.ts（由契约生成），两主题属性集同构，旧名保留为弃用别名

- 包 / 波：W2-A / W2
- 文件：`packages/ui-tokens/src/index.ts`，`packages/ui-tokens/src/tokens.css`，`apps/storybook/src/storybook.css`，`scripts/tokens-sync.mjs`，`packages/ui-tokens/src/index.test.ts`
- 依赖：TCRN-DS-SUB-008，TCRN-DS-SUB-009
- 判据：120-GWT1（:root 主题块与 [data-tcrn-theme="dark"] 属性名集合相同，tokens-sync --check 断言）、120-GWT4 别名部分（旧名解析到新值，导出 tcrnDeprecatedTokenAliases 旧→新表）；颜色值只来自 packages/ui-tokens/src/gplus-tokens.generated.ts（SUB-009 由 contract/tokens.json 生成），变量名用 tokens.json 的 cssVar；新增 line-ctl/surface/acc-ul/dis/wash/hover 与 brand-suffix；先改 index.ts 再跑 tokens-sync，不手改 tokens.css 与 storybook.css 的 token 块；主题无关 token 放独立 :root 块（C5 只比较主题块）；C1/C5
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`

#### TCRN-DS-SUB-006 · 字族、字号行高、字重、圆角、阴影、动效 token 落地，字族与随包字体链接

- 包 / 波：W2-A / W2
- 文件：`packages/ui-tokens/src/index.ts`，`packages/ui-tokens/src/tokens.css`，`apps/storybook/src/storybook.css`，`packages/ui-tokens/src/index.test.ts`，`scripts/fonts-proof.mjs`
- 依赖：TCRN-DS-SUB-001，TCRN-DS-SUB-004，TCRN-DS-SUB-008
- 判据：121-GWT2（--tcrn-type-family-ui/heading/mono 为 Hanken Grotesk、Source Serif 4、IBM Plex Mono 并带 Noto Sans SC/Noto Serif SC 回退）、121-GWT4（s1/s2/s3 最大模糊 3）；121 goal 数值：字号 13/20、14/22、12/16、11/16，标题 36/40、26/30、20/26，字重 500/600 拆开，tracking.caps 与 tabular-nums，圆角 8/12/3（radius.panel 仍等于 radius.surface），动效 240ms cubic-bezier(.22,1,.36,1)、fill 120、press 80；press-scale 保留定义标弃用；标题衬线用新 token，不借 stamp token；fonts-proof 加「token 字族都有 @font-face」；C1/C10 几何来自 token
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/fonts-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/stamp-whitelist-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`

## verify 链影响表中与本包有关的行（第 4 节）

| # | 步骤 | 现判据（摘要） | 焕新后的影响 | 负责 | 转绿 |
| --- | --- | --- | --- | --- | --- |
| 5a | `test`：ui-tokens | index.test.ts 断言 #17707f、Inter、press-scale 0.97、36px | 全部随 G+ 改 | SUB-001、SUB-006 | W2 |
| 6b | tokens:proof › tokens-sync --check | tokens.css 与 storybook.css token 块同源 | 新 token 再生；加 C5 同构断言 | SUB-001、SUB-006；SUB-025 保留块标记 | W2 |
| 6e | tokens:proof › fonts-proof | 树里不许有字体二进制 | 反转为随包字体 digest 与一致性门 | SUB-005（W1）、SUB-006 补 token 字族链接 | W1、W2 |
| 6f | tokens:proof › stamp-whitelist | stamp token 只给 stamp 组件；TOKEN_OWNERS 含 Navigation.tsx | 规则迁到 styles/；标题衬线不得借 stamp token | SUB-010、SUB-006 | W1、W2 |
| 6h | tokens:proof › token-extension | 包内 --tcrn-* 定义须已登记；radius.panel = radius.surface | 路径迁移；--tcrn-pair-*；品牌 accent 表变化 | SUB-010、SUB-023、SUB-006 | W1、W2 |

## 跨包交回（r1/handoff/W1-A.md）

### 交回说明 · W1-A

## 已交付

- SUB-008（250fd44）：`docs/design/gplus-2026-10/contract/` 六份 JSON（tokens 39 键同集 + 27 个主题无关 token + 4 个产品后缀色；pairs 四张表；matrices 五板 44/28/10/116/42 格；icons 37 名其中 9 个 new；marks 四枚标与五语标语；typography）。`tools/data.mjs` 读取并交叉校验（matrices 的对表引用、后缀色与 palette），无副作用。`lib.mjs` 与六个 build 脚本改为经 data.mjs 读数据：Actions 板的变体声明、Inputs 板的四段对表声明、字体板的刻度 CSS、每个 data-cell 的 expect、Icon 板色块、logos2 与标语表都由契约生成。
- SUB-009（b10f696）：`scripts/contract-generate.mjs`（`--check` 只比对、过期退出 1；也可 `import { generate }` 取内存结果）与七个生成物。

## 给后续包

- 家族包在 `styles/<家族>.css.ts` 里引入：`actionsPairsCss`（actions.pairs.ts）、`inputsPairsCss` 或三段分开的 `inputsTextPairsCss` / `inputsCheckPairsCss` / `inputsSwitchPairsCss`（inputs.pairs.ts）、`typographyScaleCss`（typography.scale.ts）。段内顺序为：生效对默认值 → 变体声明 → 状态规则；放在家族基础规则之后。
- 基础规则读 `--tcrn-pair-fill|ink|edge|weight`（勾选类另有 `--tcrn-pair-mark`，开关类 `--tcrn-pair-knob`、`--tcrn-pair-knob-edge`，轨道即 fill）。
- contract-proof 可比对生成物头部的 `contract-sha256`，或直接调用 `node scripts/contract-generate.mjs --check`。
- 图标：`tcrnIconPathNames`（37）、`tcrnIconNewNames`（9）、`tcrnIconPaths`；产品标：`tcrnProductMarks`（colorBody 与 currentColor 的 inkBody、taglines 五语）；token：`tcrnGplusThemedTokens`（light / dark）、`tcrnGplusFixedTokens`（值已换成包内变量）、`tcrnGplusBrandTokens`；矩阵：`gplusMatrices`、`gplusMatrixCellCounts`。这些文件目前未从包入口导出，由对应家族包接线。

## 集外改动需求

无。base.css.ts、styles/index.ts、Icon.tsx、Navigation.tsx、ui-tokens 的 index.ts 与 tokens.css 本包均未触碰。

## 未做完

无。

## 跨包交回（r1/handoff/W1-C.md）

### INIT-015 R1 · W1-C 交回说明（SUB-004 → SUB-005）

两张 Subtask 都已完成，没有接续点。本文只记录后续包需要对齐的事实，以及本包文件集以外需要的改动。

## 给 SUB-006（token 字族链接）

- `@font-face` 的族名固定为 `"Hanken Grotesk"`、`"Source Serif 4"`、`"IBM Plex Mono"`、`"Noto Sans SC"`、`"Noto Serif SC"`。token 字族栈要逐字使用这些名字，121-GWT2 与 GWT5 才对得上；不要用 fontsource 的 `… Variable` 后缀名。
- 字重范围：Hanken Grotesk 100–900；Source Serif 4 200–900，另有 opsz 8–60，浏览器按字号自动选光学尺寸；IBM Plex Mono 只有 400 与 500；Noto Sans SC 100–900；Noto Serif SC 200–900。全部为 normal，没有 italic。
- 样式表入口是 `@tcrn/ui-tokens/fonts.css`（文件在 `packages/ui-tokens/fonts/fonts.css`，已列入 sideEffects）。`src/tokens.css` 没有 @import 它。Story 正文说「随 tokens.css 导出」：若要 tokens.css 自带字体，在 tokens.css 顶部加 `@import "../fonts/fonts.css";`。这是 SUB-006 的文件，由 SUB-006 定。
- 名字里带 distributable 的栈不能出现专有字体，fonts-proof 的 proprietary 检查继续生效。

## 给 SUB-007 与 storybook、样板页（121-GWT5）

- 页面要加载 fonts.css，`document.fonts.check` 对「季度复盘」与 Noto Serif SC 才会为真。「季度复盘」已固定计入产品用字，Noto Serif SC 的分片覆盖这四个字。
- 打包工具把 woff2 复制进 storybook-static 或 dist 时，副本必须与随包文件逐字节相同；fonts-proof 允许这种副本。改名可以，改内容不行。不要把字体内联成 data: URI，build-output 检查会判红。

## 给集成与批末

- 产品用字的取值规则（新增文案的包请对照）：扫描 `packages/*/src`、`apps/storybook/src`，以及存在时的 `docs/design/gplus-2026-10/contract/**/*.json`。取 zh-CN 键下的字符串，加上不在任何语言键下、且不含假名与谚文的字符串；en、ja、ko、fr 键下的字符串不计；`*.test.*`、`*.spec.*` 与 test 目录不计。另外固定加上「季度复盘」。
- 合并后跑 `node scripts/fonts-vendor.mjs --check`。报 selection would add，或 fonts-proof 的 coverage 判红时，跑 `pnpm fonts:vendor` 再提交 `packages/ui-tokens/fonts`。
- fonts-proof 需要先构建：proprietary 检查读 `packages/ui-tokens/dist/index.js`，build-output 检查没有任何 `packages/*/dist` 时判红。verify 里 tokens:proof 排在 pnpm build 之后，满足这个前提。
- 可复用的接口：`scripts/fonts-proof.mjs` 导出 `runFontsProof({ root, tokens })`；`scripts/fonts-vendor.mjs` 导出 `FAMILIES`、`collectProductCodepoints(root)`、`planVendor(root)`、`checkVendor(root)`、`renderFontsCss(manifest)`。

## 本包文件集以外需要的改动

1. `packages/ui-tokens/README.md`：补 `@import "@tcrn/ui-tokens/fonts.css"` 的用法，并指向 FONT-LICENSES.md。建议由 SUB-006 或 SUB-043 补。
2. `CHANGELOG.md`：第 346–348 行是旧版本的历史条目（当时写的是不随包字体），保持原样；4.0.0 条目要写明随包字体与 OFL 文本（SUB-043）。
3. `src/tokens.css` 是否 @import fonts.css（见上，SUB-006）。
4. pack:smoke 回执里 @tcrn/ui-tokens 的体积会变大（本包实测打包产物 3,365,238 字节），回执由 W8-A 提交。

