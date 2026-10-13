# 摘录 · W3-C（INIT-015 R1）

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
| W3-C | SUB-027 | `apps/storybook/src/build/page-template.tsx`<br>`apps/storybook/src/build/client-scripts.ts`<br>`apps/storybook/src/contract-stories/story-frame.tsx`<br>`apps/storybook/src/contract-stories/story-content.tsx`<br>`apps/storybook/src/contract-stories/prototypes/storybook-shell-demos.tsx`<br>`apps/storybook/src/contract-stories/fixtures/overlay.tsx`<br>`apps/storybook/src/contract-stories/visual-instances/**`<br>`apps/storybook/src/internal-dev/**`<br>`apps/storybook/src/smoke.test.ts`<br>`scripts/storybook-smoke.mjs`<br>`scripts/internal-alpha-browser-proof.mjs`<br>`scripts/shell-parity-proof.mjs`<br>`scripts/full-surface-remediation-proof.mjs`<br>`scripts/geometry-proof.mjs` | 110 | 文档骨架与 story 标记改前缀、门内类名引用同步 |

包内局部门：

- W3-C：`corepack pnpm@10.12.1 -C <包树> run typecheck`；`corepack pnpm@10.12.1 -C <包树> run build`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/doc-shell-class-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`

## 本包 Subtask（decomposition.md 第 3 节）

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

## verify 链影响表中与本包有关的行（第 4 节）

| # | 步骤 | 现判据（摘要） | 焕新后的影响 | 负责 | 转绿 |
| --- | --- | --- | --- | --- | --- |
| 5d | `test`：storybook（smoke.test.ts） | 期望 story id 表、文档类名、外观断言 | 新 story、类名改前缀 | SUB-027、SUB-030、SUB-031、SUB-042 | W3–W6 |
| 9 | geometry:proof | 外壳/徽标/品牌/搜索路由的几何 | 品牌路由（ProductLogo 改内联 SVG）与搜索框几何会变 | SUB-027 类名引用；SUB-042 重定基线 | W6 |
| 10 | shell:parity | 文档壳与包壳逐属性同构 | 文档层类名与 token 变化 | SUB-027、SUB-042 | W6 |
| 15 | storybook:smoke | 静态页面 HTML 与外观期望（按钮 36/38、3px outline、Inter、选中洗底、搜索框圆角、品牌、注册表派生清单） | 期望写死旧视觉 | SUB-027 类名；SUB-041 按 G+ 重定基线 | W6 |
| 22 | full-surface:proof | 静态路由全表面检查 | 类名与外观变化 | SUB-027、SUB-042 | W6 |
| 24b | internal-alpha:browser-proof | 视觉签名基线、覆盖清单、axe、逐 story 英文泄漏、外观期望 | 全部截图签名变化；类目与 story 数变化 | SUB-010（输入 digest 路径）、SUB-027、SUB-041（期望）、SUB-046（基线选择） | W8 |

## 7. 「Storybook」所指

根脚本 `storybook:build` = `pnpm --filter @tcrn/design-system-storybook build` = `tsc && node dist/build.js`，产出静态文档 `apps/storybook/storybook-static`（README 所称 Track B，Vercel 产物）；`storybook:manager-build` 才是真 Storybook 10.4.6（Track A，输出 storybook-preview-static，已 gitignore，不在 verify）。现有与新增的浏览器门全部量 Track B；START 的「storybook:build 成功」也是 Track B。Story 正文里「Storybook 渲染结果」按 Track B 判；两轨共用 `contract-stories` 注册表，SUB-030/031 同时补 Track A 的 CSF 适配，Track A 不设门。

## 跨包交回（r1/handoff/W1-D.md）

### W1-D 交回说明（INIT-015 R1，SUB-024）

## 集外改动（本包未改）

- `package.json`：`doc-shell:proof` 现在只跑脚本，新测试没有接进任何命令。建议改为 `node --test tests/doc-shell-class-proof.test.mjs && node scripts/doc-shell-class-proof.mjs`，与 `ds:consumption:proof` 的写法一致。

## 给 W3（SUB-025/026/027）的用法

- 先 `pnpm build`，再在仓库根跑 `node scripts/doc-shell-class-proof.mjs`。输出里的 `baseline.newSinceBaseline` 和 `baseline.clearedSinceBaseline` 是相对首跑基线的增减，`classMap.unmapped` 列出 map 里没有的新包外类。加 `--details` 会给出每个类的定义、使用与点名位置。
- `--write-baseline` 会改写 `docs/verification/doc-shell-class/baseline.json`。基线是首跑记录，清理期间不要改写；`tests/doc-shell-class-proof.test.mjs` 断言 map 与基线逐类一一对应。
- 处置以 `docs/design/gplus-2026-10/doc-class-map.json` 为准：rename 项的新名写在 `target`；`references` 列出同一提交里要一起改的 proofs/tests。
- 转绿的判据是 `outOfPackageCount` 为 0 且 `templateClassCheck.ok`。`packageEmittedWithoutRule` 只回显、不计数，口径见 `problems/W1-D.md` 第 2 条。

## 可复用的导出

`scripts/doc-shell-class-proof.mjs` 导出：`classListTokens`、`cssSelectorTokens`、`markupClassTokens`、`selectorTokens`、`codeClassOccurrences`、`htmlClassOccurrences`、`packageCssClasses`、`packageEmittedVocabulary`、`computeOutOfPackage`、`templateClassCheck`、`runDocShellClassProof`、`stringifyCompact`，以及 `DEFAULT_PATHS`、`DOC_CLASS_DISPOSITIONS`。

## 跨包交回（r1/handoff/W2-C.md）

### 交回说明 · W2-C（SUB-014 → SUB-015）

两张 Subtask 都已完成，没有接续点。本文记录 W2-D（包入口）、W2-F（story-content.tsx）、W3-C/W3-D、W4-A（icon 矩阵）、W6-B 与集成需要对齐的事实。问题与风险见 `runs/r1/problems/W2-C.md`。

## 已交付

- SUB-014（863ab1e）：`Icon.tsx` 改为从 `icon-paths.generated.ts` 渲染，组件里没有任何手写路径。svg 带 `viewBox="0 0 20 20"`、`fill="none"`、`stroke="currentColor"`、`stroke-width="1.25"`、round 端点和 round 拐角；每个子元素都带 `vector-effect="non-scaling-stroke"`（这个属性在 SVG 里不继承，所以要逐个加）。生成物里的子元素标记按一套封闭语法读成 React 元素：只认 path、circle、ellipse、rect，属性只认 d、cx、cy、r、rx、ry、x、y、width、height。契约以后要是出现别的元素或属性，该图标渲染时会直接抛错，不会悄悄只画出一半。`sm`、`md`、`lg` 从 `@tcrn/ui-tokens` 的 `--tcrn-icon-size-sm|md|lg` 读像素值（14、16、20），数字尺寸照原样用；尺寸写在 width、height 属性上，宿主的 CSS 仍然可以覆盖。`strokeWidth` 已经从 `IconProps` 里拿掉；强行传进来也会被契约描边压掉。decorative 与 aria 的行为照旧，children 仍然追加在契约路径后面。`styles/icon.css.ts` 的 `iconCss01` 加了 loader-circle 的旋转：`animation: tcrn-icon-spin var(--tcrn-motion-loading-loop) infinite`，减少动态效果时为 `animation: none`。`Icon.test.tsx` 共 6 条用例：37 个名字与 icons.json 同集同序（新增 9 个也同序）；每个图标的子元素逐个等于契约路径且都是非缩放描边；三档尺寸等于 token；名册外的名字和 strokeWidth 都用 `@ts-expect-error` 锁住；aria 行为；loader 的 CSS。
- SUB-015（52065c0）：`packages/ui-react/package.json` 去掉了 lucide-react。锁文件只删了 12 行 lucide 条目（importer 项、packages 项、snapshots 项各一处）。pnpm 10.12.1 删掉的 26 行 `libc:` 已经按 W1-C 的做法保留，`corepack pnpm@10.12.1 install` 回读时报 Lockfile is up to date。README 的图标段改成自绘 37 件名册（现有 28 件加新增 9 件），并写明尺寸、描边、可及性和 loader 的规则。`scripts/package-contract-manifest.mjs` 的 `iconLibraryContract` 改为把 icons.json 记为来源，字段有 source、sourceContract 和它的 sha256、生成物路径、viewBox、strokeWidth；新增四项检查进 ok：`iconNamesMatchContract`（导出名册与契约同序）、`thirdPartyIconDependencies`（ui-react 清单的四个依赖段里不得有 lucide*）、`packageSourceThirdPartyIconImports`（ui-react 源码里不得 import lucide*）、`storybookThirdPartySourceClaims`（Storybook 运行时源文件不得再写 `data-icon-library-source="lucide…"`）。原来的 sourcePackage、lucide 依赖版本与精确版本检查、ISC 许可要求都已删除。回执还原了，没有提交。

## 包入口（W2-D）

- 不需要改动。`index.tsx` 里有 `export * from "./components/Icon/index.js"`。Icon.tsx 的运行时导出还是 `Icon` 和 `tcrnIconNames`，类型导出还是 `IconName` 和 `IconProps`，名字都没变。
- 类型有变化，但不需要改入口：`tcrnIconNames` 现在就是生成物里的 `tcrnIconPathNames`（37 个名字的只读元组），`IconName` 等于 `TcrnIconPathName`（联合类型从 28 个扩到 37 个）。`IconProps` 去掉了 `strokeWidth`。整个工作区的 typecheck 通过，没有消费方因此报错。
- 可选：icon 矩阵（W4-A）如果要标出哪些是新增图标，或者要显示网格和描边的数值，需要从入口导出 `tcrnIconNewNames`、`tcrnIconViewBox`、`tcrnIconStrokeWidth`。做法是在 `index.tsx` 加 `export { tcrnIconNewNames, tcrnIconViewBox, tcrnIconStrokeWidth } from "./components/Icon/icon-paths.generated.js"`，再把这三个名字加进 `componentLibraryPublicUtilityNames`。本包没有替入口扩大公开 API。

## 集外改动需求

1. story-content.tsx 的「Icon library contract」块（第 1063–1103 行，表格在 1078–1092 行，本波归 W2-F）。建议改成：`data-icon-library-source="tcrn-icon-contract"`，与 manifest 里 `iconLibraryContract.source` 的值一致；去掉 `data-icon-library-license`，或者改成包自身的许可 `Apache-2.0`；wrapper 和 brand-boundary 两个属性保留，manifest 的 `storybookContractVisible` 还要用。表格三行改为：Source library 写「37 icons drawn for @tcrn/ui-react from the design contract, exposed through Icon」，boundary 写「Downstream UI imports TCRN icon primitives instead of drawing its own SVGs」；License readback 这一行删掉，或者改写成「Icons are package source under the package license」；Brand boundary 一行不变。新文案要在 `storybook-content-text.ts` 里写齐五语，同时删掉第 506、507、509 行三条旧条目，以及 `scripts/lib/locale-invariant-ledger.mjs` 第 160 行的 `"Lucide React"`。
2. smoke.test.ts 第 667、669 行（W3-C 等）：跟着第 1 条一起改成新值，并加一条不得出现 lucide 的反向断言（问题清单 P3）。
3. `allowedLicenseGroups` 加 OFL-1.1（问题清单 P1，待主线程或 Owner 定）。
4. `.tcrn-icon` 基础规则要不要进包，待 Owner 裁定（问题清单 P6）。裁定前不要改 `styles/icon.css.ts` 以外的地方。
5. base.css.ts 与 styles/index.ts 都不需要改：`iconCss01` 本来就在拼接列表里，位置在 root 自定义属性之后、第一条 actions 规则之前。

## 给后续包

- Icon 的标记依次为 `xmlns`、`width`、`height`、调用方传入的其余属性，再接 `viewBox`、`fill`、`stroke`、`stroke-width`、`stroke-linecap`、`stroke-linejoin`、`aria-*`、`role`、`data-icon-name`、`class`、`focusable`。smoke.test.ts 第 566 行反向断言 `viewBox="0 0 20 20" focusable="false" aria-hidden="true"`，用来抓手写的 svg；Icon 的 `viewBox` 后面紧跟 `fill`，不会命中这条。Icon 测试里也锁了这一点。
- 矩阵 story 要实测「16px 下描边 1.25」（124-GWT1 的测量部分），对象是 `svg.tcrn-icon` 的子元素：`vector-effect` 写在子元素上，svg 元素本身没有。
- 新图标名（Clipboard 的 copy、DatePicker 的 calendar）现在已经在名册里，W3-D 可以直接用。
- `Icon.tsx` 现在会在运行时 import `@tcrn/ui-tokens`。这本来就是 ui-react 的 dependencies 项，tsconfig 也已经引用了它。

## 局部门（包树根执行）

typecheck、`--filter @tcrn/ui-react build`、`node --test packages/ui-react/dist/components/Icon/Icon.test.js`（6/6）、`install`（Lockfile is up to date）全部通过。`grep -c lucide packages/ui-react/package.json` 输出 0，退出码 1 是 grep「没有匹配」的正常退出码。`package-contract-manifest.mjs` 退出 1，红在两处：OFL-1.1（基线即红，P1）和 story-content.tsx 的 lucide 来源声明（P2）。脚本写出的两份回执已经 `git checkout` 还原。

