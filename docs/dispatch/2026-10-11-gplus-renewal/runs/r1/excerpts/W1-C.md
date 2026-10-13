# 摘录 · W1-C（INIT-015 R1）

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
| W1-C | SUB-004 → SUB-005 | `package.json`<br>`pnpm-lock.yaml`<br>`scripts/fonts-vendor.mjs`<br>`packages/ui-tokens/fonts/**`<br>`packages/ui-tokens/licenses/**`<br>`packages/ui-tokens/FONT-LICENSES.md`<br>`packages/ui-tokens/package.json`<br>`scripts/fonts-proof.mjs`<br>`tests/fonts-proof.test.mjs` | 105 | 随包字体与 manifest、OFL、fonts-proof 新判据、字体总字节数 |

包内局部门：

- W1-C：`corepack pnpm@10.12.1 -C <包树> install`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/fonts-vendor.mjs --check`；`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens pack --pack-destination <scratch>/pack`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/fonts-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node --test tests/fonts-proof.test.mjs`

## 本包 Subtask（decomposition.md 第 3 节）

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

## verify 链影响表中与本包有关的行（第 4 节）

| # | 步骤 | 现判据（摘要） | 焕新后的影响 | 负责 | 转绿 |
| --- | --- | --- | --- | --- | --- |
| 1 | `pnpm install --frozen-lockfile` | 锁文件与清单一致 | 新增 5 个 fontsource devDependencies；移除 lucide-react | SUB-004、SUB-015 各自更新锁文件 | W1、W2 |
| 6e | tokens:proof › fonts-proof | 树里不许有字体二进制 | 反转为随包字体 digest 与一致性门 | SUB-005（W1）、SUB-006 补 token 字族链接 | W1、W2 |
| 14 | pack:smoke | 三包可打包 | ui-tokens 带字体；版本 4.0.0 | SUB-004、SUB-043 | W1、W7 |

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

## 本包引用的问题清单条目（problems/decomposition.md）

**P9 中文子集的「常用 3500 字」没有仓内可核来源（待 Owner）。**
现象：STORY-121 假设按包内五语字符串加常用 3500 字取中文子集；本机没有 pyftsubset/fontTools，宿主安装是停点；仓内也没有 3500 字表。
证据：`python3 -c "import fontTools"` 报 ModuleNotFoundError；拆分文件第 6 节。
建议：用上游已切好的 unicode-range 分片，按产品用字选分片（分片本身会多带一批常用字），不加 3500 字表。Owner 若要 3500 字覆盖，给定字表来源后由 SUB-004 加选分片。
**P8 DS 仓没有 proof-budget。**
现象：STORY-121 实施说明「字体文件体积记入 proof-budget 前先报数」，DS 仓无此机制（引擎仓才有）。
建议：SUB-004 在 manifest 与交回里报字节数，pack:smoke 回执带包体积；不新建预算。

