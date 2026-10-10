# TCRN-DS-INIT-015 · R1 拆分

本文件是 R1 拆分子代理的产出：15 张 Story 拆成 46 张 Subtask（TCRN-DS-SUB-001 至 046），分 8 波 27 个包。链上 Story 的 scope 是任务权威；本文件只是拆分与分包，不是第二份 scope。scope 矛盾、风险与阻塞见 `problems/decomposition.md`，波次与包见 `packages.md`，机读清单见 `subtasks.json`。

读法：本文件超过 32 KB，按节号读。第 1 节是所有包都必须遵守的跨包约定；第 2 节是总览；第 3 节按 Story 列 Subtask；第 4 节是 verify 链影响表；第 5 节是新门接入；第 6 节是字体来源方案与实测；第 7 节说明「Storybook」所指；第 8 节是基线。

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

## 2. 总览

| Story | Subtask 数 | 键 | 波 |
| --- | --- | --- | --- |
| STORY-120 色彩与轮廓 token | 3 | SUB-001 – 003 | W2、W3 |
| STORY-121 字体与形状动效 token、字体自托管 | 4 | SUB-004 – 007 | W1、W2 |
| STORY-122 契约数据与生成 | 4 | SUB-008 – 011 | W1、W2 |
| STORY-123 Typography | 2 | SUB-012 – 013 | W2 |
| STORY-124 Icon | 2 | SUB-014 – 015 | W2 |
| STORY-125 Actions | 3 | SUB-016 – 018 | W2、W3 |
| STORY-126 Inputs | 3 | SUB-019 – 021 | W2、W3 |
| STORY-127 Brand | 2 | SUB-022 – 023 | W2 |
| STORY-128 文档层清零 | 5 | SUB-024 – 028 | W1、W3、W5 |
| STORY-129 矩阵与样板 story | 3 | SUB-029 – 031 | W4、W5 |
| STORY-130 画板到 story 映射 | 2 | SUB-032 – 033 | W5 |
| STORY-131 八项测量门 | 2 | SUB-034 – 035 | W1、W5 |
| STORY-132 契约静态门 | 2 | SUB-036 – 037 | W1、W4 |
| STORY-133 接入 verify 与 CI | 5 | SUB-038 – 042 | W6 |
| STORY-134 4.0.0 候选 | 4 | SUB-043 – 046 | W7、W8 |

依赖主线：W1 先立契约数据与生成器（SUB-008/009）、CSS 段拆分（SUB-010）、字体资源（SUB-004/005），并按 START 的许可提前立三道门（SUB-024 文档层、SUB-036 契约静态、SUB-034 测量库）；W2 token 与五家族并行；W3 文档层清零、对比度门与家族收口；W4 矩阵 story；W5 样板、映射与测量接入；W6 verify 编排与既有门重定基线；W7 版本面与文档；W8 批末生成物再生。

与 START 的「EPIC-039 → 040」顺序的一处差别：token 包（SUB-001/006）与五家族在同一波 W2 并行。家族只按契约里定死的变量名写 CSS（约定 1），不依赖 token 值落地；token 值缺席不影响家族包编译与单测，矩阵与对比度在 W4 以后量。这样少一波，代价是家族包在 W2 内看不到最终颜色。若主线程不接受，把 W2-A 提前到独立一波即可，文件集不变。

## 3. 按 Story 的 Subtask

### TCRN-DS-STORY-120 · G+ 色彩、墨阶与控件轮廓 token 进 ui-tokens，夜间同一属性集只换值，对比度门按 C1 阈值

3 张：TCRN-DS-SUB-001 – TCRN-DS-SUB-003

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

#### TCRN-DS-SUB-002 · token-contrast-proof 按 C1 阈值重写：rgba 合成、G+ 文字/轮廓/焦点对、先红变异

- 包 / 波：W3-A / W3
- 文件：`scripts/token-contrast-proof.mjs`，`tests/token-contrast-proof.test.mjs`
- 依赖：TCRN-DS-SUB-001，TCRN-DS-SUB-006
- 判据：120-GWT2（ink/ink-2/ink-3 于 panel 与 bg ≥4.5，line-ctl 于 panel 与 bg ≥3，焦点环 acc 于 surface ≥3，on-acc 于 acc ≥4.5，两主题）、120-GWT3（测试里把 ink-3 改回 #8a8c93 判红并点名该对）；支持 rgba 前景按承载面合成；品牌后缀字标豁免按条目登记并带裁定引用（MIN-20261011 D2、B1-Brand 板 F 段）；C1
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-contrast-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/token-contrast-proof.test.mjs`

#### TCRN-DS-SUB-003 · 旧 token 名弃用提示：通知脚本与测试，storybook 构建时打印

- 包 / 波：W3-A / W3
- 文件：`scripts/token-deprecation-notice.mjs`，`tests/token-deprecation-notice.test.mjs`，`apps/storybook/src/build.tsx`
- 依赖：TCRN-DS-SUB-001
- 判据：120-GWT4（只引用旧名的消费方 CSS 夹具：仍解析到新值，且通知脚本逐条打印旧名→新名提示，退出码 0）；通知读 @tcrn/ui-tokens dist 的 tcrnDeprecatedTokenAliases；storybook 构建调用一次（非阻断）
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/token-deprecation-notice.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`

### TCRN-DS-STORY-121 · 字体家族、字号行高、圆角、阴影与动效 token，五款字体 woff2 子集自托管并附 OFL

4 张：TCRN-DS-SUB-004 – TCRN-DS-SUB-007

#### TCRN-DS-SUB-004 · 五款字体 woff2 子集自托管：钉版本的 OFL 上游、manifest 与 @font-face、五份 OFL

- 包 / 波：W1-C / W1
- 文件：`package.json`，`pnpm-lock.yaml`，`scripts/fonts-vendor.mjs`，`packages/ui-tokens/fonts/**`，`packages/ui-tokens/licenses/**`，`packages/ui-tokens/FONT-LICENSES.md`，`packages/ui-tokens/package.json`
- 依赖：无
- 判据：121 goal「五款 woff2 子集随包、OFL 随包」：根 devDependencies 精确钉 @fontsource-variable/hanken-grotesk、@fontsource-variable/source-serif-4、@fontsource/ibm-plex-mono、@fontsource-variable/noto-sans-sc、@fontsource-variable/noto-serif-sc 均 5.3.0（registry.npmjs.org，license OFL-1.1 已核）；fonts-vendor.mjs 复制所需 woff2（拉丁 latin+latin-ext 全集；中文只取覆盖产品用字码点的 unicode-range 分片，用字含包内五语字符串、storybook 文案与「季度复盘」）进 packages/ui-tokens/fonts，写 manifest.json（文件、族、字重/轴、unicode-range、sha256、字节、上游包@版本与 integrity）与 fonts.css（font-display: swap，相对 URL，禁 data: URI）；licenses/ 放五份 OFL；package.json files 与 exports 加 ./fonts.css、./fonts/*；交回时报总字节（不改任何预算）；121-GWT1 googleapis 0
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> install`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/fonts-vendor.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens pack --pack-destination <scratch>/pack`

#### TCRN-DS-SUB-005 · fonts-proof 反转：随包字体的 digest、@font-face 一致性、OFL 与子集覆盖检查，附先红变异

- 包 / 波：W1-C / W1
- 文件：`scripts/fonts-proof.mjs`，`tests/fonts-proof.test.mjs`
- 依赖：TCRN-DS-SUB-004
- 判据：121-GWT3（测试里复制一份 woff2 改一个字节判红）；字体二进制只允许在 packages/ui-tokens/fonts 且与 manifest sha256 一致；fonts.css 与 manifest 双向一致；五族各有 OFL；产品用字码点被分片覆盖；包 dist 与 storybook-static 中 googleapis/gstatic 为 0（121-GWT1）；保留专有字体检查
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/fonts-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/fonts-proof.test.mjs`

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

#### TCRN-DS-SUB-007 · Storybook 两轨加载随包字体，渲染回退检查脚本

- 包 / 波：W2-G / W2
- 文件：`apps/storybook/src/build/write-static.ts`，`apps/storybook/.storybook/preview.ts`，`apps/storybook/.storybook/main.ts`，`scripts/fonts-render-proof.mjs`
- 依赖：TCRN-DS-SUB-004
- 判据：121-GWT5（静态构建页面里 document.fonts.check 对「季度复盘」与 Noto Serif SC 为真，五族都可用）、121-GWT1（storybook-static 无 googleapis/gstatic 请求与字符串）；静态轨把 packages/ui-tokens/fonts 复制到 storybook-static/fonts 并注入改写 URL 的 fonts.css；真 Storybook 轨 preview 引入 fonts.css、staticDirs 加字体目录
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/fonts-render-proof.mjs`

### TCRN-DS-STORY-122 · 状态对表、图标路径与产品标 SVG 作为契约数据进仓，包 CSS、矩阵 story 与门从同一份数据生成

4 张：TCRN-DS-SUB-008 – TCRN-DS-SUB-011

#### TCRN-DS-SUB-008 · 契约数据抽取：tokens/pairs/matrices/icons/marks/typography 六份 JSON 与无副作用的 tools/data.mjs

- 包 / 波：W1-A / W1
- 文件：`docs/design/gplus-2026-10/contract/**`，`docs/design/gplus-2026-10/tools/data.mjs`，`docs/design/gplus-2026-10/tools/lib.mjs`，`docs/design/gplus-2026-10/tools/build-actions.mjs`，`docs/design/gplus-2026-10/tools/build-inputs.mjs`，`docs/design/gplus-2026-10/tools/build-logos2.mjs`，`docs/design/gplus-2026-10/tools/build-typography.mjs`，`docs/design/gplus-2026-10/tools/build-icon.mjs`，`docs/design/gplus-2026-10/tools/build-brand.mjs`，`docs/design/gplus-2026-10/README.md`
- 依赖：无
- 判据：122 goal：contract 下 tokens.json（T 浅/夜 39 键同集 + 固定 token：surface、focus、三族字栈、圆角、控件高、内距、字号、动效；每条带 cssVar，命名规则见拆分文件「跨包约定」）、pairs.json（Actions 4 变体×7 态 fill/ink/edge 的 token 名；Inputs 文本类 d/h/f/r/x/e/ef、勾选类加 mark 三元组、开关类四元组）、matrices.json（五板 B 段每格：cellId、fill/ink/surface token 名、kind、exempt；格数 44/28/10/116/42）、icons.json（37 名与 20 格路径，9 个新增标 new）、marks.json（四枚标 body 模板、PAL 含 tint、字标与字体、五语标语按 STORY-127）、typography.json（h1–h4、Text size/tone/variant、mark 与链接）；tools 改为经 data.mjs 读 JSON；用 canvas.json 的板高重生成各板与 logos2，逐字节一致，不一致记问题不改板；C9
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node docs/design/gplus-2026-10/tools/build-<家族>.mjs <canvas.json 中该板的 h>（逐板；build-brand 需三参，取现板内的值）`
  - `git -C <包树> diff --stat -- docs/design/gplus-2026-10/boards docs/design/gplus-2026-10/logos2`

#### TCRN-DS-SUB-009 · contract-generate 生成器：变体对 CSS 段、字体刻度段、图标路径、产品标、token 数据与矩阵数据

- 包 / 波：W1-A / W1
- 文件：`scripts/contract-generate.mjs`，`packages/ui-react/src/styles/generated/**`，`packages/ui-react/src/components/Icon/icon-paths.generated.ts`，`packages/ui-react/src/components/Navigation/product-marks.generated.ts`，`packages/ui-tokens/src/gplus-tokens.generated.ts`，`apps/storybook/src/contract-stories/gplus/generated/**`
- 依赖：TCRN-DS-SUB-008
- 判据：122 goal「一个生成脚本产出 tcrnComponentCss 变体对段与 story 矩阵数据」：输出 styles/generated/actions.pairs.ts、inputs.pairs.ts、typography.scale.ts，Icon 路径、产品标 SVG body、gplus token 数据、矩阵数据（每格 expect 用与 lib.mjs cr/fmt 相同算法）；文件头「由 docs/design/gplus-2026-10/contract 生成，勿手改」；幂等（连跑两次无 diff）；变量名 --tcrn-pair-{fill,ink,edge}-<态>、生效对 --tcrn-pair-{fill,ink,edge,weight}；变体选择器 (0,2,0)，状态用 :where(:hover,[data-tcrn-preview-state="hover"]) 等 (0,1,0) 且只切换对、不写颜色；C2/C5
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
  - `git -C <包树> status --short`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`

#### TCRN-DS-SUB-010 · tcrnComponentCss 拆为按家族的段模块（语义不变），读源门改读新位置

- 包 / 波：W1-B / W1
- 文件：`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/styles/index.ts`，`packages/ui-react/src/styles/base.css.ts`，`packages/ui-react/src/styles/typography.css.ts`，`packages/ui-react/src/styles/icon.css.ts`，`packages/ui-react/src/styles/actions.css.ts`，`packages/ui-react/src/styles/inputs.css.ts`，`packages/ui-react/src/styles/brand.css.ts`，`scripts/lib/component-css-sources.mjs`，`scripts/css-template-integrity-proof.mjs`，`scripts/stamp-whitelist-proof.mjs`，`scripts/shell-fidelity-proof.mjs`，`scripts/token-extension-proof.mjs`，`scripts/component-modifier-proof.mjs`，`scripts/selection-grammar-proof.mjs`，`scripts/internal-alpha-browser-proof.mjs`，`apps/storybook/src/build/foundation-visual-standards.ts`，`apps/storybook/README.md`
- 依赖：无
- 判据：为 EPIC-040 并行开路（122 生成段要有落点）：Navigation.tsx 第 2132–5872 行的模板拆到 styles/，Navigation.tsx 只再导出 tcrnComponentCss；按选择器主语归家族（text/heading/highlight→typography，icon→icon，button/icon-button/link-button/clipboard→actions，input/textarea/select/multi-select/suggest/number/date/checkbox/radio/switch/search-input/field→inputs，brand/product-logo/product-lockup/shell-brand→brand，其余→base）；跨家族选择器列表（实测约 16 条，以拆分时实测为准）与 1 个混合 reduced-motion @media 原位拆成相邻规则；判据：规范化规则序列（选择器列表拆单、带 at-rule 上下文）前后相同，page-template.tsx 依赖的三处注释标记保留且顺序不变；token-extension-proof 允许 --tcrn-pair-* 局部变量；六个读源门全绿
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/stamp-whitelist-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-fidelity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/component-modifier-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/selection-grammar-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`

#### TCRN-DS-SUB-011 · contract-proof：生成物与契约哈希一致、图标名册、产品标逐字节、矩阵逐格期望与画板一致

- 包 / 波：W2-H / W2
- 文件：`scripts/contract-proof.mjs`，`tests/contract-proof.test.mjs`
- 依赖：TCRN-DS-SUB-009
- 判据：122-GWT1（测试里改 pairs.json 一个 ink 不重生成判红）、122-GWT2 生成段部分（重生成后绿；生成的状态规则无颜色字面量）、122-GWT3（icons.json 37 名与 dist 的 tcrnIconNames 集合相同；SUB-014 合并前此项预期红）、122-GWT4（marks.json 生成的 8 个 SVG 与 logos2 逐字节一致）；另比对矩阵数据每格 expect 与五板 data-expect（格数 44/28/10/116/42，差 0）
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/contract-proof.test.mjs`

### TCRN-DS-STORY-123 · Typography：Heading 1–4、Text 的 size/tone/variant（numeral、caps）、Highlight 不改排版、链接样式

2 张：TCRN-DS-SUB-012 – TCRN-DS-SUB-013

#### TCRN-DS-SUB-012 · Text 的 size/tone/variant 与 Heading 1–4 单行截断带 title

- 包 / 波：W2-B / W2
- 文件：`packages/ui-react/src/components/Typography/Typography.tsx`，`packages/ui-react/src/components/Typography/Typography.test.tsx`，`packages/ui-react/src/styles/typography.css.ts`
- 依赖：TCRN-DS-SUB-009，TCRN-DS-SUB-010
- 判据：123-GWT1（标题超宽：行框 1、省略号、带 title）、123-GWT3（variant=numeral 渲染「4,280.00」用 Source Serif 4 300 且 tabular-nums）；123 goal：h1 36/40、h2 26/30、h3 20/26 衬线 400，h4 13/20 怪诞 600；Text size body|reading|meta|caption、tone default|strong、variant numeral|caps；不传 prop 时外观同现在（13/20 ink-2）；CSS 引入 styles/generated/typography.scale.ts；C7 单行角色、C10 几何来自 token
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test packages/ui-react/dist/components/Typography/Typography.test.js`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`

#### TCRN-DS-SUB-013 · Highlight mark 零排版变化与链接样式，component-modifier-proof 补 Text 修饰类

- 包 / 波：W2-B / W2
- 文件：`packages/ui-react/src/components/Typography/Typography.tsx`，`packages/ui-react/src/components/Typography/Typography.test.tsx`，`packages/ui-react/src/styles/typography.css.ts`，`scripts/component-modifier-proof.mjs`
- 依赖：TCRN-DS-SUB-012
- 判据：123-GWT2 的实现部分（mark 只加 8% 青洗底，用 box-shadow 晕画在行内盒外，字重/字距/字号/内距与父元素相同；DOM 宽度相等由 SUB-035 的 mark 中性项量）；链接 acc 下划线 70%（acc-ul），hover acc-2，focus 环；component-modifier-proof 期望表加 Text size/tone/variant 修饰类；MIN D3
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test packages/ui-react/dist/components/Typography/Typography.test.js`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/component-modifier-proof.mjs`

### TCRN-DS-STORY-124 · Icon：37 件自绘 20 格 1.25px 非缩放描边，三档 14/16/20，移除 lucide-react

2 张：TCRN-DS-SUB-014 – TCRN-DS-SUB-015

#### TCRN-DS-SUB-014 · Icon 改为契约路径渲染：20 格、1.25px 非缩放描边、14/16/20 三档，名册 37

- 包 / 波：W2-C / W2
- 文件：`packages/ui-react/src/components/Icon/Icon.tsx`，`packages/ui-react/src/components/Icon/Icon.test.tsx`，`packages/ui-react/src/styles/icon.css.ts`
- 依赖：TCRN-DS-SUB-009，TCRN-DS-SUB-010
- 判据：124-GWT1 的标记部分（svg viewBox 0 0 20 20、stroke-width 1.25、vector-effect non-scaling-stroke；16px 实测 1.25 由矩阵 story 测量）、124-GWT2（名册外名字类型检查失败：测试里 @ts-expect-error）；路径只来自 icon-paths.generated.ts，组件内不手写路径；tcrnIconNames 与 icons.json 同集（37）；strokeWidth prop 移除；loader-circle 旋转 900ms linear 用 motion.loading.loop；decorative 与 aria 行为不变
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test packages/ui-react/dist/components/Icon/Icon.test.js`

#### TCRN-DS-SUB-015 · 移除 lucide-react：依赖、锁文件、README 图标段与包契约脚本

- 包 / 波：W2-C / W2
- 文件：`packages/ui-react/package.json`，`pnpm-lock.yaml`，`packages/ui-react/README.md`，`scripts/package-contract-manifest.mjs`
- 依赖：TCRN-DS-SUB-014
- 判据：124-GWT3（packages/ui-react/package.json 与 src 搜 lucide 为 0 且构建通过）；README 图标段改为自绘 37 件名册；package-contract-manifest 不再记 lucide 来源；回执 docs/verification/** 不在本单提交（批末再生，跑完后 git checkout 还原）
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> install`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `grep -c lucide <包树>/packages/ui-react/package.json`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/package-contract-manifest.mjs`

### TCRN-DS-STORY-125 · Actions：Button、IconButton、LinkButton、ClipboardCopyButton 的状态对机制与 lg 尺寸，新增 ButtonGroup

3 张：TCRN-DS-SUB-016 – TCRN-DS-SUB-018

#### TCRN-DS-SUB-016 · Button/IconButton/LinkButton 状态对机制、sm/md/lg、无 transform、焦点环

- 包 / 波：W2-D / W2
- 文件：`packages/ui-react/src/components/Button/Button.tsx`，`packages/ui-react/src/components/Button/Button.test.tsx`，`packages/ui-react/src/styles/actions.css.ts`
- 依赖：TCRN-DS-SUB-009，TCRN-DS-SUB-010
- 判据：125-GWT1（.tcrn-button 的 :hover/:active/[aria-pressed] 规则无颜色字面量与颜色 token、特异性 ≤ (0,1,0)）、125-GWT5（按下 computed transform 为 none）；125 goal：引入 actions.pairs.ts，sm 28/md 32/lg 40，圆角 8，字重 500 选中 600，次按钮与危险按钮轮廓 line-ctl，danger 白面红字不做红底，loading 态 aria-busy 加 loader 图标（文案由调用方给，不在包内写死中文）；焦点环 box-shadow 并保留 forced-colors 的透明 outline 回退；C2/C6/C10
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test packages/ui-react/dist/components/Button/Button.test.js`

#### TCRN-DS-SUB-017 · ClipboardCopyButton 五态换 ink，新增 ButtonGroup 并导出

- 包 / 波：W2-D / W2
- 文件：`packages/ui-react/src/components/Clipboard/Clipboard.tsx`，`packages/ui-react/src/components/Clipboard/static-clipboard.ts`，`packages/ui-react/src/components/Clipboard/Clipboard.test.tsx`，`packages/ui-react/src/components/ButtonGroup/**`，`packages/ui-react/src/index.tsx`，`packages/ui-react/src/styles/actions.css.ts`，`scripts/component-api-manifest.mjs`
- 依赖：TCRN-DS-SUB-016
- 判据：125-GWT4 的实现部分（组内获焦按钮 z-index 抬起，环不被相邻按钮裁切；DOM 量由 SUB-035）；ButtonGroup role=group 必带 aria-label，相连、共用轮廓、1px 分隔，单选用 aria-pressed；index.tsx 加导出并把 ButtonGroup 写进 componentLibraryPublicComponentNames；Clipboard copied→ok、failed→bad、unsupported→ink-3 只换 ink（idle 的 copy 图标在 SUB-018 做，因名册在 SUB-014）；component-api-manifest 仅在需要登记新组件时改；C2
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test packages/ui-react/dist/components/Clipboard/Clipboard.test.js packages/ui-react/dist/components/ButtonGroup/ButtonGroup.test.js packages/ui-react/dist/index.test.js`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/component-api-manifest.mjs --check`

#### TCRN-DS-SUB-018 · Actions 收口：Clipboard idle 加 copy 图标，base 段按钮上下文规则与 Navigation.test 按钮断言

- 包 / 波：W3-D / W3
- 文件：`packages/ui-react/src/components/Clipboard/Clipboard.tsx`，`packages/ui-react/src/components/Clipboard/static-clipboard.ts`，`packages/ui-react/src/components/Clipboard/Clipboard.test.tsx`，`packages/ui-react/src/styles/base.css.ts`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`
- 依赖：TCRN-DS-SUB-014，TCRN-DS-SUB-017
- 判据：125 use case：ClipboardCopyButton idle 态 copy 13；W2 各家族交回里记下的 base 段按钮上下文规则（如 reduced-motion 里的 press-scale、外壳内按钮焦点 outline）改为 G+ 写法；Navigation.test.tsx 里 [data-tcrn-theme="dark"] .tcrn-button--primary 等按钮相关正则按 G+ 更新；C2/C5
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`

### TCRN-DS-STORY-126 · Inputs：十一件表单控件按三张对表实现，line-ctl 轮廓、焦点环、错误态、日历图标与搜索工具形态

3 张：TCRN-DS-SUB-019 – TCRN-DS-SUB-021

#### TCRN-DS-SUB-019 · 文本类控件共用对表：Input/Textarea/Select/SuggestInput/NumberInput/DatePicker 与 MultiSelect 换皮

- 包 / 波：W2-E / W2
- 文件：`packages/ui-react/src/components/Form/Form.tsx`，`packages/ui-react/src/components/Form/Form.test.tsx`，`packages/ui-react/src/components/Form/multi-select-dropdown.ts`，`packages/ui-react/src/styles/inputs.css.ts`
- 依赖：TCRN-DS-SUB-009，TCRN-DS-SUB-010
- 判据：126-GWT1（默认边 line-ctl 于 panel ≥3.1）、126-GWT2（aria-invalid 且获焦：红边红环，无青色）、126-GWT4（DatePicker 右侧 30px 原生指示器透明覆盖，showPicker 保留）；引入 inputs.pairs.ts 文本类 d/h/f/r/x/e/ef：默认 line-ctl、hover ink-2、focus acc 加环、error bad、error+focus 红环；number 隐藏 spin；MultiSelect 三种呈现沿用逻辑只换皮；resolveFieldValueControl 不变；C1/C2
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test packages/ui-react/dist/components/Form/Form.test.js`

#### TCRN-DS-SUB-020 · Checkbox/RadioGroup/Switch 三元与四元对，SearchInput 墨洗工具形态，Field 整块洗底去除

- 包 / 波：W2-E / W2
- 文件：`packages/ui-react/src/components/Form/Form.tsx`，`packages/ui-react/src/components/Form/Form.test.tsx`，`packages/ui-react/src/styles/inputs.css.ts`
- 依赖：TCRN-DS-SUB-019
- 判据：126-GWT3（SearchInput 夜间占位 ink-2 ≥4.5）；Checkbox 16 r4、勾用 ::after 边框画（禁 data: URI），Radio 16，Switch 34×20 钮 16 行程 14、on 态钮用 on-acc（夜间深色钮）≥3；SearchInput 墨洗无边、focus 回纸底加环；.tcrn-field:focus-within 整块洗底去掉（只保证控件自身）；外壳上下文里的搜索框规则（主语为 search-input 的已在 inputs 段）按工具形态改；MIN D2；C1/C2/C8
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test packages/ui-react/dist/components/Form/Form.test.js`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`

#### TCRN-DS-SUB-021 · Inputs 收口：DatePicker 日历图标，base 段输入上下文规则与 Navigation.test 搜索框断言

- 包 / 波：W3-D / W3
- 文件：`packages/ui-react/src/components/Form/Form.tsx`，`packages/ui-react/src/components/Form/Form.test.tsx`，`packages/ui-react/src/styles/inputs.css.ts`，`packages/ui-react/src/styles/base.css.ts`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`
- 依赖：TCRN-DS-SUB-014，TCRN-DS-SUB-020，TCRN-DS-SUB-018
- 判据：126 goal：DatePicker 右侧 calendar 图标 14 且原生指示器透明覆盖同区域（名册在 SUB-014 合并后才有 calendar）；W2 交回里记下的 base 段输入上下文规则（如 .tcrn-product-shell :focus-visible 的 3px outline 与搜索框焦点）改为 G+ 焦点环；Navigation.test.tsx 的 .tcrn-search-input 系列正则按 G+ 更新；C2/C8
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`

### TCRN-DS-STORY-127 · Brand：四枚产品标进注册表（tms、einzbern、mana-orchestrate、design-system），后缀用产品深色，标语五语更新

2 张：TCRN-DS-SUB-022 – TCRN-DS-SUB-023

#### TCRN-DS-SUB-022 · 产品标注册表：workflow 改 einzbern、新增 mana-orchestrate，内联 SVG 四种导出，锁定块新规则

- 包 / 波：W2-F / W2
- 文件：`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/styles/brand.css.ts`，`apps/storybook/src/contract-stories/story-content.tsx`
- 依赖：TCRN-DS-SUB-008，TCRN-DS-SUB-009，TCRN-DS-SUB-010
- 判据：127-GWT1（mana-orchestrate + ja 标语「プロジェクト記憶アシスタント」，无 Claude/Codex）、127-GWT3（后缀 computed color：TMS #2c63c8、Design System #6577f3，TCRN 为 ink）、127-GWT4 的 CSS 部分（收起态文案 display:none、标 22 不缩放；52px 侧栏见问题清单）；TcrnBrandMark 按 productId 取 product-marks.generated.ts 内联 SVG（color、mono 用 currentColor、淡底贴片、深底贴片），无 productId 时仍用母标；Einzbern 与 Mana Orchestrate 用 Source Serif 4 加 by TCRN；五语标语按 STORY-127；渐变文字类全删；后缀色用 brand-suffix token；aos 注册项保持；story-content.tsx 只在类型检查因注册项改名报错时改；C9/C16
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test packages/ui-react/dist/components/Navigation/Navigation.test.js`

#### TCRN-DS-SUB-023 · brand-asset 门扩为八个文件的本地 digest，token-extension 品牌扩展表与品牌单测更新

- 包 / 波：W2-F / W2
- 文件：`scripts/brand-asset-source-proof.mjs`，`apps/storybook/src/build/ai-consumption-contract.ts`，`scripts/token-extension-proof.mjs`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`
- 依赖：TCRN-DS-SUB-022
- 判据：127-GWT2（任一产品标 SVG 改一个字节判红：logos2 八个文件的 sha256 在契约里登记并比对，包渲染的 color/mono 字节与 logos2 一致）；母标远端发布核对保持原样（新标未发布，不做远端比对，见问题清单）；token-extension-proof 删掉不再定义的 workflow/design-system-1..4 accent，登记新的品牌局部变量；Navigation.test.tsx 第 574–593 行品牌断言按新规则更新；C9
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/brand-asset-source-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test packages/ui-react/dist/components/Navigation/Navigation.test.js`

### TCRN-DS-STORY-128 · 文档层清零：删除 storybook.css 与 story-demo-styles 的组件平行实现，骨架改 tcrn-doc- 前缀，包外 tcrn- 类为 0 并立门

5 张：TCRN-DS-SUB-024 – TCRN-DS-SUB-028

#### TCRN-DS-SUB-024 · 包外类门先立（先红）并产出逐类归类映射

- 包 / 波：W1-D / W1
- 文件：`scripts/doc-shell-class-proof.mjs`，`tests/doc-shell-class-proof.test.mjs`，`docs/design/gplus-2026-10/doc-class-map.json`，`docs/verification/doc-shell-class/**`
- 依赖：无
- 判据：128-GWT1 的门逻辑（构建后的 storybook-static 与文档层源文件里的 tcrn-* 类，减去包 CSS 定义的类，tcrn-doc-* 豁免，差集为空才绿；包 CSS 从 packages/ui-react/dist 导入 tcrnComponentCss，不依赖源文件布局）、128-GWT2（测试夹具加一个 tcrn-foo 文档类判红）；保留原 INC-010 子检查（模板类有定义）；先红：首跑列出现存全部包外类（实测约 149–164 个）写进 docs/verification/doc-shell-class/ 基线；doc-class-map.json 逐类给处置 delete-package-provided | rename→tcrn-doc-* | delete-demo | delete-dead 与定义/使用位置，作为 SUB-025/026/027 的唯一依据；C13
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/doc-shell-class-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/doc-shell-class-proof.test.mjs`

#### TCRN-DS-SUB-025 · storybook.css 与 story-demo-styles.ts 清零（CSS 侧），同步豁免表与读这些文件的门

- 包 / 波：W3-B / W3
- 文件：`apps/storybook/src/storybook.css`，`apps/storybook/src/story-demo-styles.ts`，`scripts/demo-styles-sync.mjs`，`package.json`，`scripts/selection-grammar-proof.mjs`，`scripts/shell-fidelity-proof.mjs`，`docs/style-scale.md`
- 依赖：TCRN-DS-SUB-024，TCRN-DS-SUB-001，TCRN-DS-SUB-006
- 判据：128 goal「文档私有类一律 tcrn-doc-」：按 doc-class-map.json 删除组件平行实现、骨架改 tcrn-doc- 前缀、无用删除；保留 tokens-sync 管的 :root 与 dark token 块标记；story-demo-styles.ts 若清空则退役 demo-styles-sync（同步改根 package.json 的 tokens:proof 链），否则保持 --check 绿；selection-grammar 与 shell-fidelity 的文档层源列表随文件变化更新；docs/style-scale.md 豁免表同步；不改 tcrn-doc-* 外观；C13
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/doc-shell-class-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/selection-grammar-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-fidelity-proof.mjs`

#### TCRN-DS-SUB-026 · alpha-styles.ts 清零（静态轨文档层）

- 包 / 波：W3-B / W3
- 文件：`apps/storybook/src/alpha-styles.ts`
- 依赖：TCRN-DS-SUB-025
- 判据：128-GWT1 的 CSS 侧：alphaStoryCss 里包外 tcrn-* 定义按 doc-class-map.json 处置（删除或改 tcrn-doc-）；page-template 的切片逻辑不受影响；C13
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/doc-shell-class-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-fidelity-proof.mjs`

#### TCRN-DS-SUB-027 · 文档骨架与示例标记改前缀（标记侧），门与冒烟测试里的类名引用同步

- 包 / 波：W3-C / W3
- 文件：`apps/storybook/src/build/page-template.tsx`，`apps/storybook/src/build/client-scripts.ts`，`apps/storybook/src/contract-stories/story-frame.tsx`，`apps/storybook/src/contract-stories/story-content.tsx`，`apps/storybook/src/contract-stories/prototypes/storybook-shell-demos.tsx`，`apps/storybook/src/contract-stories/fixtures/overlay.tsx`，`apps/storybook/src/contract-stories/visual-instances/**`，`apps/storybook/src/internal-dev/**`，`apps/storybook/src/smoke.test.ts`，`scripts/storybook-smoke.mjs`，`scripts/internal-alpha-browser-proof.mjs`，`scripts/shell-parity-proof.mjs`，`scripts/full-surface-remediation-proof.mjs`，`scripts/geometry-proof.mjs`
- 依赖：TCRN-DS-SUB-024
- 判据：128-GWT1 的标记侧：按 doc-class-map.json 改 className（如 tcrn-story-kicker→tcrn-doc-story-kicker、tcrn-shell-demo→tcrn-doc-shell-demo，.tcrn-input--short 删除改容器宽度）；门脚本与 smoke.test.ts 只改被改名类的引用，不改判据；与 SUB-025/026 合并后 doc-shell-class-proof 计数为 0，清到 0 的提交附差集证据；C13
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/doc-shell-class-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`

#### TCRN-DS-SUB-028 · 取样计算样式比对：普通 story 里第一批组件外观与其矩阵 story 一致

- 包 / 波：W5-C / W5
- 文件：`scripts/doc-sample-style-proof.mjs`，`tests/doc-sample-style-proof.test.mjs`
- 依赖：TCRN-DS-SUB-030，TCRN-DS-SUB-027，TCRN-DS-SUB-034
- 判据：128-GWT3（任一 story 里的第一批组件，取样比对 font/color/background/border/radius/height 计算样式，与矩阵 story 同变体同状态一致）；路由用 scripts/lib/storybook-routes.mjs（SUB-034）；只覆盖第一批 23 件，后续家族无矩阵不比；测试里注入一条文档层覆盖判红
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/doc-sample-style-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/doc-sample-style-proof.test.mjs`

### TCRN-DS-STORY-129 · 矩阵 story：每个第一批组件一个 variant × state × theme 矩阵，由契约数据生成；构图一壳层样板与夜间切换

3 张：TCRN-DS-SUB-029 – TCRN-DS-SUB-031

#### TCRN-DS-SUB-029 · 矩阵渲染器与五个家族矩阵 story（含图标 37 件三档名册）

- 包 / 波：W4-A / W4
- 文件：`apps/storybook/src/contract-stories/gplus/matrix-renderer.tsx`，`apps/storybook/src/contract-stories/gplus/matrix-stories.tsx`，`apps/storybook/src/contract-stories/gplus/icon-roster.tsx`
- 依赖：TCRN-DS-SUB-009，TCRN-DS-SUB-013，TCRN-DS-SUB-015，TCRN-DS-SUB-018，TCRN-DS-SUB-021，TCRN-DS-SUB-023，TCRN-DS-SUB-026，TCRN-DS-SUB-027
- 判据：129-GWT1（格数与画板一致：字体 44、图标 28、品牌 10、动作 116、表单 42，每格 data-cell/data-kind/data-expect，禁用格 data-exempt）、129-GWT2 的结构（浅色与夜间两块，夜间只靠 data-tcrn-theme）；数据只读 gplus/generated 矩阵数据；只渲染包组件，hover/active/focus 用 data-tcrn-preview-state 静态呈现、与真实伪类共用对表；每个第一批组件在其家族矩阵里有带标签的分节（23 件齐）；124 的名册 story 要求：37 件 × 14/16/20；不写任何文档层 CSS；C13
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`

#### TCRN-DS-SUB-030 · 矩阵 story 注册、CSF 适配、五语文案与预算登记

- 包 / 波：W4-A / W4
- 文件：`apps/storybook/src/contract-stories/governance.ts`，`apps/storybook/src/contract-stories/groups/components.ts`，`apps/storybook/src/typography.stories.tsx`，`apps/storybook/src/icon.stories.tsx`，`apps/storybook/src/brand.stories.tsx`，`apps/storybook/src/actions.stories.tsx`，`apps/storybook/src/inputs.stories.tsx`，`apps/storybook/src/build/locales/storybook-locale-text.ts`，`apps/storybook/src/build/locales/storybook-content-text.ts`，`scripts/lib/locale-invariant-ledger.mjs`，`scripts/lib/story-budget.mjs`，`apps/storybook/src/build/navigation.ts`，`apps/storybook/src/smoke.test.ts`
- 依赖：TCRN-DS-SUB-029
- 判据：story id 定为 typography-matrix、icon-matrix、brand-matrix、actions-matrix、inputs-matrix（CSF 标题 Typography/Icon/Brand/Actions/Inputs，导出 Matrix → Storybook id typography--matrix 等）；新类目放 Components 下，storyRegistryOrder 与 groups 同序（smoke tie-gate）；标题与说明五语齐，变体/状态名登记为语言不变机器词；id 与标题不含 aos/tms/workflow（public-naming-proof）；渲染文本不含工单键与 Codex（internal-vocab）；超 2000px 高或超类目上限 8 的条目只按条目登记并写理由（预算抬线须授权，见问题清单）；smoke.test.ts 的期望 id 表同步
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/public-naming-proof.mjs`

#### TCRN-DS-SUB-031 · 构图一壳层样板 story ×5（账单、项目、成员、产品）与夜间切换

- 包 / 波：W5-A / W5
- 文件：`apps/storybook/src/contract-stories/gplus/sample-stories.tsx`，`apps/storybook/src/contract-stories/gplus/samples/**`，`apps/storybook/src/contract-stories/governance.ts`，`apps/storybook/src/contract-stories/groups/components.ts`，`apps/storybook/src/typography.stories.tsx`，`apps/storybook/src/icon.stories.tsx`，`apps/storybook/src/brand.stories.tsx`，`apps/storybook/src/actions.stories.tsx`，`apps/storybook/src/inputs.stories.tsx`，`apps/storybook/src/build/locales/storybook-locale-text.ts`，`apps/storybook/src/build/locales/storybook-content-text.ts`，`scripts/lib/locale-invariant-ledger.mjs`，`scripts/lib/story-budget.mjs`，`apps/storybook/src/smoke.test.ts`
- 依赖：TCRN-DS-SUB-029，TCRN-DS-SUB-030
- 判据：129-GWT3（侧栏图标左 16、文字 48，纸离边 12；受 ProductShell 几何限制，见问题清单 P1，差值写进映射表）；id 定为 typography-sample-billing、icon-sample-project、brand-sample-product、actions-sample-project、inputs-sample-members（Storybook id typography--sample-billing 等）；用包内 ProductShell 与第一批组件，内容为通用产品（项目、成员、账单），不用通用件拼壳；引导元素带 data-guide="rail"/data-text="rail" 供测量；夜间切换只改 data-tcrn-theme；注册、五语、预算与 SUB-030 同规则
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/public-naming-proof.mjs`

### TCRN-DS-STORY-130 · Storybook 对照清单：每块画布板到 story 的映射与差异记录，视觉证明走同一套测量

2 张：TCRN-DS-SUB-032 – TCRN-DS-SUB-033

#### TCRN-DS-SUB-032 · 画布板到 story 的映射表（md 与机读 json）

- 包 / 波：W5-B / W5
- 文件：`docs/design/gplus-2026-10/storybook-map.md`，`docs/design/gplus-2026-10/storybook-map.json`
- 依赖：TCRN-DS-SUB-030
- 判据：130 goal：八块入仓画板（G+、构图、五块 B1、产品标）逐行 → story id（SUB-030/031 定的 id）→ 期望格数与测量项；无对应 story 的板写差异与裁定引用；V2-Rejections 与 V2-Families 未入仓单列；json 供门读取
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node -e "JSON.parse(require('fs').readFileSync('docs/design/gplus-2026-10/storybook-map.json','utf8'))"`

#### TCRN-DS-SUB-033 · storybook-visual-proof 重建：映射与 story 清单对账，逐行八项测量报告

- 包 / 波：W5-B / W5
- 文件：`scripts/storybook-visual-proof.mjs`，`tests/storybook-visual-proof.test.mjs`，`docs/verification/storybook-visual-proof/**`
- 依赖：TCRN-DS-SUB-032，TCRN-DS-SUB-034
- 判据：130-GWT1（映射每行有报告行且八项全绿）、130-GWT2（测试里删映射一行判红：映射与 story 清单差集非空）；替换现有 RETIRED 桩；测量只调 scripts/lib/gplus-measure.mjs 与 storybook-routes.mjs（W1 定的 API，不改库）；样板行在 W5-A 合并前缺席，局部跑只判矩阵行；报告写 docs/verification/storybook-visual-proof/，含 UTC 与 HEAD；截图只做目视不做像素比对
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/storybook-visual-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/storybook-visual-proof.test.mjs`

### TCRN-DS-STORY-131 · 八项 DOM 测量进仓当门，对 Storybook 渲染结果跑，每项附会红的变异

2 张：TCRN-DS-SUB-034 – TCRN-DS-SUB-035

#### TCRN-DS-SUB-034 · 八项 DOM 测量移植为库与门骨架，每项附会红的夹具

- 包 / 波：W1-F / W1
- 文件：`scripts/lib/gplus-measure.mjs`，`scripts/lib/storybook-routes.mjs`，`scripts/geometry-measure-proof.mjs`，`tests/geometry-measure-proof.test.mjs`，`tests/fixtures/geometry-measure/**`
- 依赖：无
- 判据：131 goal 八项：超出裁切祖先 0、声明单行元素行框 1、box-shadow 模糊 ≤3、侧栏引导列 16/48、表格与列表各行首格文字起点相同、mark 不改排版、data-cell 对比度与 data-expect 差 ≤0.05、控件高度 28/32/40，另带重叠检查；阈值写在门里；每项一个违例夹具在测试里必红，干净夹具全绿；报告 JSON 含每项数值；storybook-routes.mjs 由注册表推导静态页路由（沿 geometry-proof 的页面#id 规则），API 在此定稿供 W5 只读复用；用已有 @playwright/test，不加依赖
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/geometry-measure-proof.test.mjs`

#### TCRN-DS-SUB-035 · geometry-measure-proof 接入矩阵与样板 story，四条 GWT 变异与家族子集

- 包 / 波：W5-C / W5
- 文件：`scripts/geometry-measure-proof.mjs`，`tests/geometry-measure-proof.test.mjs`，`docs/verification/geometry-measure/**`
- 依赖：TCRN-DS-SUB-034，TCRN-DS-SUB-030
- 判据：131-GWT1（选中行首格注入 padding-left 8px 判红；包里无 .tcrn-table，先用现有 table-record-index-spec 的表格行，样板 story 合并后自动纳入）、131-GWT2（mark 注入 padding 2px 判红）、131-GWT3（任一 box-shadow 改 4px 模糊判红）、131-GWT4（现矩阵与样板 story 八项全绿）；目标清单取注册表里 G+ 矩阵与样板类目（样板在 W5-A 合并前缺席，GWT4 的样板部分批末判）；--family <名> 只跑该家族；报告写 docs/verification/geometry-measure/；不改 gplus-measure 库 API
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/geometry-measure-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/geometry-measure-proof.test.mjs`

### TCRN-DS-STORY-132 · 契约静态门：C2 状态选择器、C5 主题属性集同构、C6 选中态结构、C7 单行角色、C8 工具栏让步、C11 禁用清单、C13 包外类

2 张：TCRN-DS-SUB-036 – TCRN-DS-SUB-037

#### TCRN-DS-SUB-036 · contract-static-proof 骨架：C2/C5/C6/C7/C8/C11/C13 规则、条款文档与先红变异

- 包 / 波：W1-E / W1
- 文件：`scripts/contract-static-proof.mjs`，`scripts/lib/css-rules.mjs`，`tests/contract-static-proof.test.mjs`，`docs/contract/**`
- 依赖：无
- 判据：132-GWT1（注入 .x .tcrn-button:hover{background:#fff} C2 红）、132-GWT2（dark 选中态单加 inset 阴影 C5 与 C6 红）、132-GWT3（加 linear-gradient 底 C11 红），以上在测试夹具里验证；C2 状态选择器特异性不高于变体且不含颜色，C5 两主题同选择器属性集相同，C6 选中态不得非透明填充与单侧边线兼有、禁左边条，C7 单行角色 nowrap+ellipsis，C8 工具栏唯一 min-width 让步项，C11 禁用清单（渐变、blur>3、卡套卡、表情图标、左边条），C13 包外类；包 CSS 从 dist 导入；自写规则解析器不加依赖；报告按条款号；范围先限第一批家族根类，后续家族走 docs/contract/exemptions.json 逐条登记带裁定引用；docs/contract/clauses.md 写已知条款文本，缺的编号标「画板未入仓」；现仓（焕新前）预期红
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/contract-static-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-static-proof.mjs`

#### TCRN-DS-SUB-037 · contract-static 现仓全绿：story 渲染层的 C7/C8/C11 检查与豁免登记

- 包 / 波：W4-B / W4
- 文件：`scripts/contract-static-proof.mjs`，`scripts/lib/css-rules.mjs`，`tests/contract-static-proof.test.mjs`，`docs/contract/**`
- 依赖：TCRN-DS-SUB-036，TCRN-DS-SUB-018，TCRN-DS-SUB-021，TCRN-DS-SUB-023，TCRN-DS-SUB-026，TCRN-DS-SUB-027
- 判据：132-GWT4（现仓全绿）；加对 storybook-static 渲染层的 C7/C8/C11 扫描（如 LockHint 默认 🔒 属后续家族，按条目登记豁免带裁定引用，不改该组件）；豁免只能按条目登记并带裁定引用，不加无条件 skip；--family 子集
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-static-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/contract-static-proof.test.mjs`

### TCRN-DS-STORY-133 · 门接入 pnpm verify 与 CI，更新 style-scale.md 与机器消费契约文档，分阶段验证规则沿用 STORY-119

5 张：TCRN-DS-SUB-038 – TCRN-DS-SUB-042

#### TCRN-DS-SUB-038 · verify 编排：新门脚本与测试接入，开发期可单跑子门

- 包 / 波：W6-A / W6
- 文件：`package.json`
- 依赖：TCRN-DS-SUB-002，TCRN-DS-SUB-003，TCRN-DS-SUB-005，TCRN-DS-SUB-007，TCRN-DS-SUB-011，TCRN-DS-SUB-024，TCRN-DS-SUB-028，TCRN-DS-SUB-033，TCRN-DS-SUB-035，TCRN-DS-SUB-037
- 判据：133-GWT1（verify 执行 contract-proof、contract-static-proof、geometry-measure-proof、doc-shell-class-proof、storybook-visual-proof、fonts-render-proof、doc-sample-style-proof 与新测试文件并各有报告）、133-GWT2（pnpm geometry:measure 只跑该门）；新增脚本 contract:proof、contract:static、geometry:measure、fonts:render、doc:sample-style，storybook:visual-proof 指向新实现；浏览器门排在 build 之后；不加无条件 skip；token 弃用通知非阻断
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`

#### TCRN-DS-SUB-039 · CI 工作流配置（只写配置，不推送）

- 包 / 波：W6-A / W6
- 文件：`.github/workflows/verify.yml`
- 依赖：TCRN-DS-SUB-038
- 判据：133-GWT3（工作流包含 verify）；仓内现无 .github/workflows（Story 假设不成立，见问题清单），新建：corepack 启用 pnpm 10.12.1、安装 Playwright chromium、跑 pnpm verify；不推送、不开 PR
- 局部门：
  - `node -e "require('fs').readFileSync('<包树>/.github/workflows/verify.yml','utf8')"`

#### TCRN-DS-SUB-040 · style-scale.md 增补 G+ 刻度，门文档与包 README 家族说明

- 包 / 波：W6-A / W6
- 文件：`docs/style-scale.md`，`docs/contract/README.md`，`packages/ui-react/README.md`，`apps/storybook/README.md`
- 依赖：TCRN-DS-SUB-038
- 判据：133 goal：style-scale.md 增补圆角 8/12/3、控件 28/32/40、字号行高；docs/contract/README.md 列每门判据、阈值、变异与豁免登记方式（逐条带裁定引用）；ui-react README 记 Text 新 prop、Button lg、ButtonGroup、Icon 名册；storybook README 写明只渲染包、G+ 矩阵与样板 story；README 版本行不动（SUB-043 管）
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/no-private-input-scan.mjs`

#### TCRN-DS-SUB-041 · storybook-smoke 与 internal-alpha 浏览器证明的期望值按 G+ 重定基线

- 包 / 波：W6-B / W6
- 文件：`scripts/storybook-smoke.mjs`，`scripts/internal-alpha-browser-proof.mjs`
- 依赖：TCRN-DS-SUB-031，TCRN-DS-SUB-030，TCRN-DS-SUB-027
- 判据：INIT 判据 pnpm verify 全绿：把写死的旧视觉期望改为 G+（按钮 minHeight 36/38→28/32/40、焦点 3px outline→box-shadow 环、字族 Inter→Hanken Grotesk、选中洗底 rgba(28,29,33,.06)→wash、搜索框圆角、品牌期望、类目与 story 数）；只改期望常量，不放宽判据、不加豁免；视觉签名基线不在本单（SUB-046）
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-browser-proof.mjs`

#### TCRN-DS-SUB-042 · shell-parity、geometry、full-surface、ds-consumption 与 storybook 冒烟测试重定基线

- 包 / 波：W6-B / W6
- 文件：`scripts/shell-parity-proof.mjs`，`scripts/geometry-proof.mjs`，`scripts/full-surface-remediation-proof.mjs`，`scripts/ds-consumption-proof.mjs`，`apps/storybook/src/smoke.test.ts`，`tests/full-surface-remediation.test.mjs`，`tests/ds-consumption-proof.test.mjs`
- 依赖：TCRN-DS-SUB-041
- 判据：INIT 判据 pnpm verify 全绿：本地逐个跑，红项若源于 G+ 预期变化（品牌路由、搜索框几何、外壳同构属性），更新期望并在提交信息逐条说明依据；红项若是真实缺陷，只记问题清单不改判据
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run shell:parity`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
  - `corepack pnpm@10.12.1 -C <包树> run full-surface:proof`
  - `corepack pnpm@10.12.1 -C <包树> run ds:consumption:proof`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`

### TCRN-DS-STORY-134 · 4.0.0 候选：版本面、CHANGELOG、消费方迁移说明、pack 冒烟与 Owner 目视验收清单

4 张：TCRN-DS-SUB-043 – TCRN-DS-SUB-046

#### TCRN-DS-SUB-043 · 版本面 4.0.0 与 CHANGELOG 发布段

- 包 / 波：W7-A / W7
- 文件：`packages/ui-tokens/package.json`，`packages/ui-copy-state/package.json`，`packages/ui-react/package.json`，`packages/ui-tokens/README.md`，`packages/ui-copy-state/README.md`，`packages/ui-react/README.md`，`docs/tms-adoption-guide.md`，`CHANGELOG.md`
- 依赖：TCRN-DS-SUB-038，TCRN-DS-SUB-040，TCRN-DS-SUB-042
- 判据：134 goal：version-surface-proof 对 4.0.0 一致（三包 package.json、三包 README「Version `4.0.0` is prepared」、tms-adoption-guide「Three packages, all at 4.0.0:」）；CHANGELOG 按 changelog-release-sections-proof 写 ## 4.0.0 段（破坏性清单）；不打 tag、不发版
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/version-surface-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/changelog-release-sections-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/scaffold-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run pack:smoke`

#### TCRN-DS-SUB-044 · 消费方迁移说明 docs/migration-4.0.md（AOS、TMS、Einzbern 门户）

- 包 / 波：W7-A / W7
- 文件：`docs/migration-4.0.md`
- 依赖：TCRN-DS-SUB-043
- 判据：134-GWT2（对照 EPIC-040/043 breaking 清单每条有迁移步骤）：lucide 移除、名册 37、registry workflow→einzbern 与新增 mana-orchestrate、Text 新 prop、Button lg、ButtonGroup、Icon strokeWidth 移除、后缀色、焦点环改 box-shadow、字体自托管（引入 @tcrn/ui-tokens/fonts.css）、token 改名与弃用别名表
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/no-private-input-scan.mjs`

#### TCRN-DS-SUB-045 · Owner 目视验收清单（按画板逐板一节）

- 包 / 波：W7-A / W7
- 文件：`docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md`
- 依赖：TCRN-DS-SUB-032
- 判据：134-GWT3（每板一节：G+、构图、Typography、Icon、Brand、Actions、Inputs、产品标；每节列对应 story id、目视项与机器证据路径）；写明目视验收由 Owner 做，不由实施对话代签
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/no-private-input-scan.mjs`

#### TCRN-DS-SUB-046 · 批末生成物再生：视觉签名基线选择、internal-alpha 回执、pack 与 storybook:build 证据

- 包 / 波：W8-A / W8
- 文件：`docs/verification/internal-alpha/**`，`docs/verification/internal-alpha-hardening-proof.json`，`docs/verification/internal-alpha-hardening-proof.md`，`docs/verification/scaffold-proof.json`，`docs/verification/scaffold-proof.md`，`docs/verification/readme-public-contract.json`
- 依赖：TCRN-DS-SUB-038，TCRN-DS-SUB-041，TCRN-DS-SUB-042，TCRN-DS-SUB-043，TCRN-DS-SUB-044，TCRN-DS-SUB-045
- 判据：134-GWT1（pack:smoke 通过）与 INIT 收口证据：internal-alpha:browser-proof 用 --update-visual-baseline <selection.json> 更新视觉签名基线（每条 accepted-layout-change 带理由与证据，引用 MIN-20261011 D1/D6）；internal-alpha 各回执、hardening、scaffold、readme 回执各再生一次；storybook:build 成功；生成物批末一次，不随单条修改重做
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:proof`
  - `corepack pnpm@10.12.1 -C <包树> run scaffold:proof`
  - `corepack pnpm@10.12.1 -C <包树> run readme:proof`
  - `corepack pnpm@10.12.1 -C <包树> run pack:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`

## 4. verify 链影响表

现链（根 `package.json` 的 `verify`）逐步判断焕新后的影响与负责的 Subtask。「转绿」指该步在哪一波合并后应当回绿；见红只记不修，批末一次处置。

| # | 步骤 | 现判据（摘要） | 焕新后的影响 | 负责 | 转绿 |
| --- | --- | --- | --- | --- | --- |
| 1 | `pnpm install --frozen-lockfile` | 锁文件与清单一致 | 新增 5 个 fontsource devDependencies；移除 lucide-react | SUB-004、SUB-015 各自更新锁文件 | W1、W2 |
| 2 | `typecheck` | tsc -b 全仓 | Icon 名册类型、strokeWidth 移除、注册项 workflow→einzbern、Text/Button 新 prop、ButtonGroup、样式模块迁移 | 每包自保类型检查绿（局部门） | 每波 |
| 3 | `build` | 6 个包依序构建，storybook 为静态文档构建 | 静态构建复制随包字体、打印弃用通知 | SUB-007、SUB-003 | W2、W3 |
| 4 | `dist:hygiene` | ui-react dist 无孤儿产物 | styles/ 新模块有源文件对应，预计不受影响 | SUB-010 自查 | W1 |
| 5a | `test`：ui-tokens | index.test.ts 断言 #17707f、Inter、press-scale 0.97、36px | 全部随 G+ 改 | SUB-001、SUB-006 | W2 |
| 5b | `test`：ui-copy-state | 文案状态 | 不受影响 | — | — |
| 5c | `test`：ui-react（test:ssr） | Navigation.test 大量正则（品牌渐变后缀、按钮暗色、搜索框 3px outline 等）、Button/Icon/Typography/Form/Clipboard 单测、index.test 名册对账 | 全部随家族改 | 品牌 SUB-023；按钮与搜索框正则 SUB-018、SUB-021；各家族单测 SUB-012–017、019–020；名册 SUB-017 | W2、W3 |
| 5d | `test`：storybook（smoke.test.ts） | 期望 story id 表、文档类名、外观断言 | 新 story、类名改前缀 | SUB-027、SUB-030、SUB-031、SUB-042 | W3–W6 |
| 5e | `test`：两个 examples | 合成回读 | 不受影响 | — | — |
| 6a | tokens:proof › css-template-integrity | 在 Navigation.tsx 找模板标记 | 模板迁到 styles/ | SUB-010 | W1 |
| 6b | tokens:proof › tokens-sync --check | tokens.css 与 storybook.css token 块同源 | 新 token 再生；加 C5 同构断言 | SUB-001、SUB-006；SUB-025 保留块标记 | W2 |
| 6c | tokens:proof › demo-styles-sync --check | story-demo-styles 与 storybook.css 副本一致 | 文档层清零后退役或保持同步 | SUB-025（退役时同步改 tokens:proof 链） | W3 |
| 6d | tokens:proof › token-contrast-proof | 只认 #rrggbb、旧名对 | 旧名变别名（var 引用）后会抛「不是纯十六进制」，W2 到 W3 之间预期红 | SUB-002 重写 | W3 |
| 6e | tokens:proof › fonts-proof | 树里不许有字体二进制 | 反转为随包字体 digest 与一致性门 | SUB-005（W1）、SUB-006 补 token 字族链接 | W1、W2 |
| 6f | tokens:proof › stamp-whitelist | stamp token 只给 stamp 组件；TOKEN_OWNERS 含 Navigation.tsx | 规则迁到 styles/；标题衬线不得借 stamp token | SUB-010、SUB-006 | W1、W2 |
| 6g | tokens:proof › shell-fidelity | 文档层无装饰渐变、圆角字面量、模糊 >3 阴影；包源列表 | 包源列表改 styles/；文档层文件变化 | SUB-010、SUB-025/026；各家族 CSS 圆角走 token、阴影 ≤3 | W1、W3 |
| 6h | tokens:proof › token-extension | 包内 --tcrn-* 定义须已登记；radius.panel = radius.surface | 路径迁移；--tcrn-pair-*；品牌 accent 表变化 | SUB-010、SUB-023、SUB-006 | W1、W2 |
| 6i | tokens:proof › selection-grammar | 选中态只用 ink，不加品牌轴 | 源列表变化；家族遵守 C6 | SUB-010、SUB-025；家族自守 | W1、W3 |
| 7 | component-modifiers:proof | 读 Navigation.tsx 找 heading--1..4 等 | 路径迁移；Text 新修饰类 | SUB-010、SUB-013 | W1、W2 |
| 8 | badge-wrap:proof | INC-013 徽标换行几何 | 非第一批；只受 token 值影响，预计不变 | 若红：SUB-042 | — |
| 9 | geometry:proof | 外壳/徽标/品牌/搜索路由的几何 | 品牌路由（ProductLogo 改内联 SVG）与搜索框几何会变 | SUB-027 类名引用；SUB-042 重定基线 | W6 |
| 10 | shell:parity | 文档壳与包壳逐属性同构 | 文档层类名与 token 变化 | SUB-027、SUB-042 | W6 |
| 11 | doc-shell:proof | 模板类须有定义 | 改为包外类计数门，先红 | SUB-024（W1 先红）、SUB-025/026/027 清到 0 | W3 |
| 12 | brand-asset:proof | 母标发布 URL 与本地 digest 一致（联网） | 扩为八个产品标本地 digest；母标远端核对不变 | SUB-023 | W2 |
| 13 | exports:check | 三包入口存在且可导入 | 不受影响 | — | — |
| 14 | pack:smoke | 三包可打包 | ui-tokens 带字体；版本 4.0.0 | SUB-004、SUB-043 | W1、W7 |
| 15 | storybook:smoke | 静态页面 HTML 与外观期望（按钮 36/38、3px outline、Inter、选中洗底、搜索框圆角、品牌、注册表派生清单） | 期望写死旧视觉 | SUB-027 类名；SUB-041 按 G+ 重定基线 | W6 |
| 16 | readme:proof | 五语根 README 契约 | 根 README 不改，预计不变 | — | — |
| 17 | public:naming:proof | story id/标题不含产品词 | 新 story 须守 | SUB-030、SUB-031 | W4、W5 |
| 18 | public-output:scan | 公开产物无禁用模式 | 静态产物新增字体文件 | SUB-007 自查；SUB-046 | W2 |
| 19 | internal-vocab:scan | 渲染文本无工单键、Codex 等 | 新 story 与映射页须守 | SUB-029、SUB-031、SUB-032 | W4、W5 |
| 20 | generic:scan | 组件 props 不携带领域实体 | Text/Button/ButtonGroup 新 prop 为通用 | SUB-012、SUB-016、SUB-017 自守 | W2 |
| 21 | ds:consumption:proof | 消费方语义检查（浏览器） | 可能受外观变化影响 | 若红：SUB-042 | W6 |
| 22 | full-surface:proof | 静态路由全表面检查 | 类名与外观变化 | SUB-027、SUB-042 | W6 |
| 23 | scaffold:proof | scaffold 冻结观测、CHANGELOG 发布段、版本面 | 4.0.0 与发布段 | SUB-043 | W7 |
| 24a | internal-alpha:contracts | 写包契约与组件 API 回执 | lucide 移除、新 prop、ButtonGroup 使回执变化（运行时自动写） | SUB-015、SUB-017 改脚本；SUB-046 提交回执 | W8 |
| 24b | internal-alpha:browser-proof | 视觉签名基线、覆盖清单、axe、逐 story 英文泄漏、外观期望 | 全部截图签名变化；类目与 story 数变化 | SUB-010（输入 digest 路径）、SUB-027、SUB-041（期望）、SUB-046（基线选择） | W8 |
| 24c | scan（no-private-input） | 全树隐私与夸大用语 | 新文件须守 | 每包自守 | 每波 |
| 24d | internal-alpha-hardening | 读回执，写 hardening 回执 | 随回执再生 | SUB-046 | W8 |

## 5. 新门接入（SUB-038 一次接入 verify）

| 门 | 建立 | 补全 | verify 脚本名 |
| --- | --- | --- | --- |
| contract-proof | SUB-011 | — | `contract:proof` |
| contract-static-proof（C2/C5/C6/C7/C8/C11/C13） | SUB-036 | SUB-037 | `contract:static` |
| geometry-measure-proof（八项） | SUB-034 | SUB-035 | `geometry:measure` |
| storybook-visual-proof（映射对账与逐行测量） | SUB-033 | — | `storybook:visual-proof`（现脚本是 RETIRED 桩，被替换） |
| doc-shell-class-proof（包外类） | SUB-024 | 清零 SUB-025/026/027 | `doc-shell:proof`（已在链上） |
| fonts-render-proof（字体回退） | SUB-007 | — | `fonts:render` |
| doc-sample-style-proof（取样比对） | SUB-028 | — | `doc:sample-style` |
| token-deprecation-notice（非阻断） | SUB-003 | — | storybook 构建内调用 |
| 新测试文件 | 各门 Subtask | — | `node --test tests/<门>.test.mjs` 逐个写进对应脚本 |

浏览器门排在 build 之后；不加无条件 skip；豁免只能逐条登记并带裁定引用（STORY-133）。

## 6. 字体来源方案与实测

实测（2026-10-11，只读 `npm view`，未下载、未安装）：

| 包 | 版本 | license | unpackedSize（字节） |
| --- | --- | --- | --- |
| @fontsource-variable/hanken-grotesk | 5.3.0 | OFL-1.1 | 155,534 |
| @fontsource-variable/source-serif-4 | 5.3.0 | OFL-1.1 | 2,202,998 |
| @fontsource/ibm-plex-mono | 5.3.0 | OFL-1.1 | 1,489,824 |
| @fontsource-variable/noto-sans-sc | 5.3.0 | OFL-1.1 | 4,888,847 |
| @fontsource-variable/noto-serif-sc | 5.3.0 | OFL-1.1 | 6,400,936 |
| （对照）@fontsource/noto-sans-sc 静态版 | 5.3.0 | OFL-1.1 | 74,516,544 |
| （对照）@fontsource/noto-serif-sc 静态版 | 5.3.0 | OFL-1.1 | 87,061,113 |

结论：本机 npm 配置的 registry 为 registry.npmjs.org，可达，五款都有钉版本的 OFL-1.1 上游，tarball 带 sha512 integrity。本机没有 pyftsubset/fontTools（`python3 -c "import fontTools"` 报 ModuleNotFoundError），在宿主上安装属 Owner 停点，所以不做本机子集化。

方案（SUB-004）：

1. 根 `devDependencies` 精确钉上表前五个包的 5.3.0，锁文件记录 integrity；下载只在实施包执行 `pnpm install` 时发生。
2. 优先用 variable 版：Hanken Grotesk（wght，覆盖 400/500/600）、Source Serif 4（opsz 与 wght，覆盖 300/400/500）、Noto Sans SC（wght 400/500/600）、Noto Serif SC（wght 300/400）；IBM Plex Mono 只有静态版，取 400/500。
3. 中文子集直接用上游已切好的 unicode-range 分片（fontsource 的 CJK 分片沿用 Google Fonts 切片），不在本机切：`scripts/fonts-vendor.mjs` 统计产品用字码点（包源码与 ui-copy-state 的五语字符串、storybook 文案字典、contract 标语、GWT 用串「季度复盘」），只复制覆盖这些码点的分片；拉丁取 latin 与 latin-ext。「常用 3500 字」在仓内没有可核来源，默认不加，记问题清单（P9）。
4. `packages/ui-tokens/fonts/manifest.json` 记每个文件的族、轴/字重、unicode-range、sha256、字节与上游包@版本和 integrity；`fonts.css` 由 manifest 生成（font-display: swap，相对 URL，禁 data: URI）；`packages/ui-tokens/licenses/` 放五份 OFL；`--check` 模式比对 node_modules 上游文件与随包文件。
5. 体积先报数：交回时报 manifest 合计字节。DS 仓没有 proof-budget 机制（P8），不改任何预算或上限。

依赖它的 Subtask：SUB-004、SUB-005、SUB-006、SUB-007。若实施时 registry 不可达，这四张记硬阻塞，其余 Subtask 不受影响（家族 CSS 只引用字族变量）。

## 7. 「Storybook」所指

根脚本 `storybook:build` = `pnpm --filter @tcrn/design-system-storybook build` = `tsc && node dist/build.js`，产出静态文档 `apps/storybook/storybook-static`（README 所称 Track B，Vercel 产物）；`storybook:manager-build` 才是真 Storybook 10.4.6（Track A，输出 storybook-preview-static，已 gitignore，不在 verify）。现有与新增的浏览器门全部量 Track B；START 的「storybook:build 成功」也是 Track B。Story 正文里「Storybook 渲染结果」按 Track B 判；两轨共用 `contract-stories` 注册表，SUB-030/031 同时补 Track A 的 CSF 适配，Track A 不设门。

## 8. 基线

主检出 b321d10 的全量 verify 已在分离工作树跑完：`VERIFY_EXIT=0`（日志末尾时间 2026-10-10T21:04:50Z，约 7 分钟）。焕新前没有既存红项。

## 9. 落链

`work-batch` 一次落链 46 张 Subtask（actor agent:claude-opus-5-5，--at 2026-10-10T21:34:58Z）：外层 reasonCode WORKSPACE_COMMAND_COMPLETED，批结果 record.reasonCode WORK_BATCH_APPLIED，members 46，version 1387，headEventHash bb5248ad946e3acfbbc57ff6cab8485030cb6691a289fc015e94147bc1b06183。读回 `work-list --kind Subtask --limit 500`：total 46，未截断，键 TCRN-DS-SUB-001 至 046 连续，父单与标题逐条一致，状态全部 planned。
