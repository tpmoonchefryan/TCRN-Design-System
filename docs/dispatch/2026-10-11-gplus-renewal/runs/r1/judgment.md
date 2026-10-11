# INIT-015 R1 · 判断

被判对象：集成分支 `claude/init015-gplus-renewal`，HEAD 98199a7（批末门跑在 d8586dd；其后只有 dispatch 文档提交）。输入：三片验收 `R/acceptance/A.md`、`B.md`、`C.md`，问题清单 `R/problems/main.md`（M1–M6）、`R/problems/decomposition.md`（待 Owner 一节），按需核对的包问题文件，批末门 `R/verify/steps.md` 与会话 scratch 的 `r1-verify/` 日志及脏回执，START「回路」「模型与子代理」「质量硬线」「收口」，Owner 裁定 D1–D8。`R` = `docs/dispatch/2026-10-11-gplus-renewal/runs/r1`，路径相对集成工作树。本判断只读：没有改代码、门、回执或链，没有重跑门。

读法：本文件约 65 KB，超过读取守卫，按行段读（每次不超过 200 行）：§1 第 7–28 行；§2 第 29–338 行（组 T 第 33 行、B 83、I 101、D 135、S 169、G 218、H 250、A 268、C7 288、K 298、L 323）；§3 第 339–434 行（§3.1 第 343 行、§3.2 398、§3.3 407、§3.4 417、§3.5 431）；§4 第 435–494 行（§4.1 第 439 行、§4.2 445、§4.3 465、§4.4 483）；§5 第 495–520 行。

## §1 R1 结论表

15 张 Story：不通过 14 张，阻塞于 Owner 1 张（STORY-127）。三片均未发现可直接转 done 的 Story。

| Story | 结论 | 未满足的 GWT | 关键缺口（一句话） | R2 返工 |
| --- | --- | --- | --- | --- |
| 120 色彩轮廓 token 与对比度门 | 不通过 | GWT5 | 批末 verify 红 11 步；tokens:proof 卡在 fonts-proof 单测，且没有浅色主题块 | R2-1、R2-2、R2-3；verify 全绿另待 O-1 |
| 121 字体与形状动效 token、字体自托管 | 不通过 | GWT2 部分、GWT4 部分 | mono 字族缺 Noto 中文回退；点名的阴影模糊检查不扫包 | R2-1、R2-2、R2-15、R2-33 |
| 122 契约数据与生成脚本 | 不通过 | GWT2 部分 | locale 触发器状态规则含颜色字面量而门只查 pairs 目标；字体刻度没进契约生成 | R2-4、R2-7、R2-34 |
| 123 Typography | 不通过 | GWT4 部分 | 夜间页 21 个浅色格按夜间色渲染；链接状态规则写色、quiet 用停用色 | R2-5；依赖 R2-3、R2-18、R2-29 |
| 124 Icon | 不通过 | GWT1 部分 | 没有门实测 16px 描边；文档层把图标压成 18px | R2-13、R2-28 |
| 125 Actions | 不通过 | GWT3 部分 | 夜间页 58 个浅色格错；主题钮图标显隐 C5 不同构 | R2-8、R2-31；依赖 R2-3、R2-21 |
| 126 Inputs | 不通过 | GWT5 | opt-sel 两格不可见、err-msg 两格偏差；C2 四条、只读获焦无环、快捷键夜间 3.9 | R2-6、R2-9 至 R2-12；依赖 R2-3、R2-23 |
| 127 Brand | 阻塞于 Owner | GWT4 | 收起宽 52px 取决于构图一壳层几何；GWT1–3 满足 | 无本 Story 文件内返工；待 O-1、O-3 |
| 128 文档层清零 | 不通过 | GWT3 | 图标 18px 覆写 72 处；文档 CSS 仍改包外观，密集与紧凑壳原型渲染为裸元素 | R2-13、R2-14、R2-16 至 R2-19、R2-37a |
| 129 矩阵与构图一样板 | 不通过（GWT3 另阻塞于 Owner） | GWT1、GWT2；GWT3 待 O-1 | inputs 可见 40/42；夜间页浅色块读夜间值；landmark 重名、内部词与隐私扫描命中 | R2-23 至 R2-27a、R2-36；依赖 R2-3、R2-8、R2-10 |
| 130 画布板到 story 映射 | 不通过 | GWT1 | 映射 22 行全红：12 行夜间对比、err-msg、缺格、样板 10 行 rail | R2-27b、R2-37b；依赖 R2-3、R2-10、R2-23；样板行待 O-1 |
| 131 八项 DOM 测量门 | 不通过 | GWT4 | 夜间页对比 4.03、controlHeight 从未实测、样板必测项配错；样板 rail 待 O-1 | R2-27b、R2-28、R2-37c；依赖 R2-3、R2-10 |
| 132 契约静态门 | 不通过 | GWT4 | 现仓 C2 红 7 条、C5 红 1 条；C7 只要求 title 非空 | R2-31；C2/C5 落点 R2-5、R2-8、R2-9 |
| 133 门接入 verify 与 CI | 不通过 | GWT1 部分 | 接线齐，但真实 verify 停在第 6 步、另 10 步红；冒烟输出被截断 | R2-20、R2-21、R2-22、R2-29、R2-30、R2-32；verify 全绿另待 O-1 |
| 134 4.0.0 候选 | 不通过 | 无（GWT1–3 满足） | SUB-046 排在 R2 返工之后；前置 Story 未 done；文档要随 R2 回写 | R2-35；SUB-046 在 R2 末执行 |

## §2 去重后的返工清单

合并口径：三片同根因的项合为一条；档位按 START 起始档规则——改共享契约（token 键集、`contract/*.json`、导出面、门的判定语义）从主力档起，孤立修复从经济档起；本轮都是第一次返工，没有升档项。包的档位取包内最高档。三片判法不一致处由本判断裁定，理由写在对应条目：B-4 对 C-14（根因取 B-4）、B-3 对 C-9（改法取 C-9）、B-16 对 C-7（节点归属取 C）、A-5 对 B O-6（分界见 R2-4 与 §3 O-6）、B-8(b) 对 C-15（两者都要）、C-21（暂缓到 O-1，见 §3.3）。三片未列而本判断补入两条：R2-19（Card 的 status 角色，R1 引入）与 R2-26（隐私扫描命中，藏在第 30 步后段）。

### 组 T · 契约与生成器（P1 → P2，主力，串行）

**R2-1 mono 字族补 Noto 中文回退** · 主力 · STORY-121
- 来源：A-2（121-GWT2 部分）。
- 现象：`--tcrn-type-family-mono` 为 `"IBM Plex Mono",ui-monospace,Menlo,monospace`（tokens.css:94，来自 `contract/tokens.json:53`），等宽文本中文落系统字；`scripts/fonts-proof.mjs:370` 也不要求 mono 回退。
- 改法：`docs/design/gplus-2026-10/contract/tokens.json` 的 mono 改为 `"IBM Plex Mono","Noto Sans SC",ui-monospace,Menlo,monospace`，依次 `node scripts/contract-generate.mjs`、`node scripts/tokens-sync.mjs`；`scripts/fonts-proof.mjs` 的 `TOKEN_FAMILY_STACKS` 给 mono 加 `fallback: "ui-zh-fallback"`；同步 `packages/ui-tokens/src/index.test.ts`；可在 `scripts/fonts-render-proof.mjs` 加一条 mono 中文探针。
- 档位理由：改 `contract/*.json` 与 token 值。
- 新 Subtask：「mono 字族栈补 Noto Sans SC 中文回退，fonts-proof 字族检查同步」。
- 依赖与并行：无前置；R2-2、R2-4、R2-35 依赖它。与 R2-3 至 R2-6 同改契约与生成物，不能并行。

**R2-2 fonts-proof 单测夹具换 G+ 字族 token（tokens:proof 解堵）** · 经济（随 P1） · STORY-121
- 来源：A-1；C 2.7 末行；挡 120-GWT5。
- 现象：第 6 步红，`tests/fonts-proof.test.mjs` 第 58、72、151 行三条失败；夹具 `openTokens`（第 13 行）只有旧名 `--tcrn-type-family-distributable-latin`，SUB-006 给 `scripts/fonts-proof.mjs` 加了 token-families 检查而没改这份测试。`&&` 链中断，fonts-proof 门本体、stamp-whitelist、shell-fidelity、token-extension、selection-grammar 五个子门批末没有执行，状态未知。
- 改法：夹具改为四个 G+ 字族 token（值与契约一致，含 R2-1 的 mono 回退），`distributable-*` 栈只留专有字体用例；补三条变异：缺 token、缺中文回退、fonts.css 有字族未被 token 点名，均判红。修后把 `tokens:proof` 的 12 段逐段跑完，五个子门结果写进包问题文件（见红只记）。
- 档位理由：只改测试夹具，门的判定不变。
- 新 Subtask：「fonts-proof 单测夹具改用 G+ 字族 token 并补 token-families 变异」。
- 依赖与并行：R2-1 之后，同包。

**R2-3 浅色主题块选择器扩为 `:root, [data-tcrn-theme="light"]`** · 主力 · STORY-120
- 来源：A-6、B-13、C-13；M6「浅色主题块」。
- 现象：tokens.css 只有 `:root` 与 `[data-tcrn-theme="dark"]` 两块，`packages/ui-tokens/src/gplus-tokens.generated.ts:22` 写死 light 为 `:root`。矩阵页 7 个 `data-tcrn-theme="light"` 块在夜间页继承夜间值：第 18 步夜间运行五矩阵浅色格全偏（typography 21、icon 13、brand 4、actions 58、inputs 20，最大差 4.03），第 19 步 12 行 dark:contrast 红。
- 改法：`scripts/contract-generate.mjs` 把 `tcrnGplusThemeSelectors.light` 写成 `:root, [data-tcrn-theme="light"]`；`packages/ui-tokens/src/index.ts` 按它输出主题块（保留 `tcrn-token-block: theme` 标记，dark 块排在其后），同文件的 `parseTokenCssBlocks`、`compareTokenThemeBlocks` 与 `scripts/tokens-sync.mjs` 接受选择器列表，再生 `tokens.css` 与 `apps/storybook/src/storybook.css` 的 token 块；`scripts/contract-static-proof.mjs` 的 checkC5 把该列表当浅色侧，同步 `tests/contract-static-proof.test.mjs`；`tests/` 下补一条浏览器测试（写法同 token-deprecation-notice 的 GWT4）：夜间祖先内的浅色块解析到浅色值。取 A-6 的单块选择器列表，不按 C-13 另复制一块（两份浅色值会并存、易漂移）。修后复跑第 18–20 步，并复核 A 2.1 观察的 ink-3 是否真落在 panel-2、bg-2、hover、wash 上；若有，记给设计权威。
- 档位理由：改生成器的主题输出结构与 C5 的分组判定。
- 新 Subtask：「浅色主题块选择器扩为 :root 与 [data-tcrn-theme="light"]，tokens-sync 与 C5 接受选择器列表」。
- 依赖与并行：R2-1、R2-2 之后，同包；R2-8 的夜间样板钮复核、R2-27b 与 R2-37 的报告依赖它。

**R2-4 字体刻度进契约生成** · 主力 · STORY-122
- 来源：A-5（122 目的锚「单一真值」、跨包约定第 1 条）；W2-A P4、P5，W2-B P7。
- 现象：`gplus-tokens.generated.ts` 没有字体刻度；`packages/ui-tokens/src/index.ts:246–255、325–342` 手写 13px、20px 等值，只靠 index.test.ts 交叉核对；family-heading、weight-light、weight-semibold、tracking-caps、numeric-tabular、line-meta、line-heading-2、line-heading-3 八个名字未登记契约；生成的 `packages/ui-react/src/styles/generated/typography.scale.ts` 50 条字体声明全是字面值；`CHANGELOG.md:17–19` 的表述与之不符。
- 改法：在 `contract/tokens.json` 的 fixed（或 `contract/typography.json`）登记上述名字与 cssVar；`scripts/contract-generate.mjs` 把刻度生成进 `gplus-tokens.generated.ts`，`typography.scale.ts` 改为引用 `var(--tcrn-type-size-*|line-*|weight-*|tracking-caps|numeric-tabular)`，numeral 变体引用 `--tcrn-type-numeric-tabular`；`index.ts` 从生成物取值，删去 index.test.ts 的交叉核对；contract-proof 的 generated-sources 保持绿。只引用已有 token，不新增几何 token（新增属 §3 O-6）。
- 档位理由：登记 token 键集、改 `contract/*.json` 与生成器。
- 新 Subtask：「字体刻度登记进契约并由生成器输出，typography.scale 改为引用 token」。
- 依赖与并行：P1 合入后（同改契约、生成器、index.ts）；P2 第一项；R2-35 依赖它。

**R2-5 链接状态改走对表（含 quiet 与强制色回退）** · 主力 · STORY-123
- 来源：B-1、C-10（C2 减 3 条）；W3-D P6，W4-B Q1、Q2。
- 现象：第 13 步 C2.colour 三条：`.tcrn-link:where(:hover…)` 写 color 与 text-decoration-color，`:where(:focus-visible…)` 写 box-shadow（dist `tcrnComponentCss` 第 1224–1225 行，来自生成段）；`.tcrn-link--quiet:hover` 写已停用的 `--tcrn-color-brand-primary`（`packages/ui-react/src/styles/base.css.ts` 约 2494–2506 行，与面包屑共用选择器列表）；链接焦点 `outline: none`，强制色下无指示。
- 改法：`contract/typography.json` 链接段改为对表（ink-d 为 acc、下划线 acc-ul、h 为 acc-2、edge-f 为焦点环；quiet 的 ink-d 为 currentColor、ink-h 为 acc-2），`scripts/contract-generate.mjs` 生成变体声明，基础规则读生效对，状态规则 `:where()` 只切换，焦点加 `outline: 2px solid transparent; outline-offset: 2px`；`base.css.ts` 把 quiet 悬停从面包屑列表拆出并入对表，`.tcrn-breadcrumb a` 留在导航家族豁免（EX-INIT015-navigation）；重生成 `typography.scale.ts`，同步 `styles/typography.css.ts` 与 `components/Typography/Typography.test.tsx`。复核：contract:static 的 typography C2 为 0，contract:proof。
- 档位理由：改 `contract/typography.json` 与生成器。
- 新 Subtask：「链接与 quiet 链接状态改走对表，焦点补透明 outline 回退」。
- 依赖与并行：R2-4 之后，同包；与 R2-7、R2-8 同改 `base.css.ts`，P3 须先合入。

**R2-6 只读框获焦补焦点环** · 主力 · STORY-126
- 来源：B-7（W2-E P5，WCAG 2.4.7）。
- 现象：inputs-text 规则顺序 h、f、r、e、ef、x，r 盖住 f（dist 第 3118–3119 行），只读框可获焦但没有可见焦点；画板同序。
- 改法：`contract/pairs.json` 的 inputs-text 加 rf 元组（r 的底加 f 的环），或把 f 排到 r 之后；重生成 `packages/ui-react/src/styles/generated/inputs.pairs.ts`；`packages/ui-react/src/components/Form/Form.test.tsx` 加只读获焦用例。
- 档位理由：改 `contract/pairs.json` 与生成物。
- 新 Subtask：「inputs-text 对表补只读获焦态，只读框获焦显示焦点环」。
- 依赖与并行：R2-5 之后，同包；与 R2-10 同改 `Form.test.tsx`，P4 须先合入。与画板顺序不同，列入 §3.4。

### 组 B · base 段与 contract-proof（P3，主力）

**R2-7 状态规则不得含颜色字面量：locale 触发器与门范围** · 主力 · STORY-122
- 来源：A-4（122-GWT2 部分）；W2-H P3、W3-D P10。
- 现象：dist `tcrnComponentCss` 90 条状态规则中，`.tcrn-shell-locale-menu__trigger:hover` 与 `[aria-expanded="true"]` 写 `color-mix(…)` 底和 `rgba(15, 23, 42, 0.12)` 阴影（`base.css.ts:63–69`，还在用弃用名）；contract-proof 的 package-css 只查 pairs.json 目标基类的 38 条，门绿而 GWT 后半句不成立。
- 改法：`base.css.ts:63–69` 改 `background: var(--tcrn-color-hover)`、`box-shadow: var(--tcrn-shadow-s1)`，边线与文字改 G+ 名（GWT2 要求的最小改动，不动该件几何）；`scripts/contract-proof.mjs` 的 package-css 把字面量扫描扩到全部状态规则（条件加 aria 与 data 状态属性），保留只含 transparent 的 outline 放行；`tests/contract-proof.test.mjs` 补非 pairs 目标的变异。
- 档位理由：扩门的判定范围。
- 新 Subtask：「contract-proof 字面量扫描扩到全部状态规则，locale 触发器状态改用 token」。
- 依赖与并行：无前置；P3 第一项。

**R2-8 主题钮图标显隐交给 data-current-theme** · 经济（随 P3） · STORY-125
- 来源：C-9（取其改法）、B-3；W5-A P2；132-GWT4 的 C5 一条。
- 现象：`base.css.ts:602–612` 的三条显隐规则挂在 `html[data-tcrn-theme]` 上，浅色侧不声明 display（C5.dark-only）；样板夜间块是块级主题，主题钮两枚图标都不可见。
- 改法：删去这三条规则里 `[data-theme-icon]` 的部分，侧栏图标规则保留；显隐交给已有的 `.tcrn-shell-theme-toggle[data-current-theme]` 透明度规则（`base.css.ts:88–99`）。B-3 的「补无主题 display」只解 C5、不解样板夜间块，不取。复核 contract:static C5 为 0、`components/Navigation/Navigation.test.tsx` 的主题钮用例、夜间样板块的钮图标。
- 档位理由：单文件组件 CSS，判定不变。
- 新 Subtask：「主题钮图标显隐改由 data-current-theme 控制，去掉 html 级主题显隐规则」。
- 依赖与并行：R2-7 之后，同包。

### 组 I · Inputs 收尾（P4，经济；包内按序）

**R2-9 Inputs 两组状态规则越级或写色** · 经济 · STORY-126
- 来源：B-2、C-11（C2 减 4 条）；W4-B Q3、Q4。
- 现象：`.tcrn-product-shell .tcrn-search-input:focus-within` (0,3,0)（`packages/ui-react/src/styles/inputs.css.ts:23`）；`.tcrn-multi-select-dropdown__option:not(:disabled):hover` (0,3,0) 且写色，`[aria-selected="true"]` 写色（`inputs.css.ts:519–520`）。
- 改法：第一条删除（包裹层已不作画），或改为 `:where(.tcrn-product-shell) .tcrn-search-input:where(:focus-within)`；选项在本类上声明 fill-d 透明、fill-h hover、fill-s wash、选中字重 600，基础规则读生效对，`:where(:not(:disabled):hover,[data-tcrn-preview-state="hover"])` 与 `:where([aria-selected="true"])` 只切换。不在 pairs.json 新定元组名；若必须新定，停下记问题（属主力）。
- 档位理由：组件 CSS，判定不变。
- 新 Subtask：「SearchInput 壳内焦点与 MultiSelect 选项状态改为只切换对」。
- 依赖与并行：无前置。

**R2-10 Field 错误态去掉整块洗底，错误文字用 G+ 名** · 经济 · STORY-126
- 来源：B-4、C-14 合并，根因取 B-4。
- 现象：err-msg-l 6.20 对 6.69、err-msg-n 6.27 对 6.88。`--tcrn-color-state-blocked` 两主题都解析到 `--tcrn-color-bad`（tokens.css:76、285），文字色值本来就对（#a8321f 于白恰为 6.69）；偏差来自 `.tcrn-field--error` 的 `color-mix(… state-blocked-bg 62% …)` 整块底（`inputs.css.ts:141–143`）。只换名（C-14 的改法）不会转绿。
- 改法：删去 `.tcrn-field--error` 的底色与 outline-color（强制色块里的系统色 outline 保留，约 405 行）；`.tcrn-field__error`（约 159–161 行）改读 `var(--tcrn-color-bad)`；同步 `apps/storybook/src/smoke.test.ts` 与 `Form.test.tsx` 的相关断言。
- 档位理由：组件 CSS。
- 新 Subtask：「Field 错误态去掉整块洗底，错误文字改读 --tcrn-color-bad」。
- 依赖与并行：R2-9 之后；与 R2-17 同改 `smoke.test.ts`，P6 排在 P4 之后。列入 §3.4（P29 口径更正）。

**R2-11 MultiSelect 触发器共用 Select 末端区** · 经济 · STORY-126
- 来源：B-5、C-15；W6-B P6（第 28 步两例）。
- 现象：closed-select-family-empty 与 public-popup-family-dark 两例的触发器 paddingRight 10px 对 Select 30px，minHeight `0px` 对 `auto`（第 28 步日志第 30 行）。
- 改法：`inputs.css.ts` 约 512 行的 `.tcrn-multi-select-dropdown__trigger` 设 `padding-inline-end: 30px`，caret 定位与 `.tcrn-select-wrap__icon` 相同（`calc((30px - var(--tcrn-icon-size-sm)) / 2)`）。minHeight 推断是 Chrome 对非 flex/grid 项把 `auto` 读成 `0px`（B-5）：先确认，再在组件侧让两者处于同一布局语境或声明相同的显式 min-height；不改门的比对字段（那是主力档的判定改动，需要时停下记问题）。dark 一例还要 R2-21b 才能转绿。
- 档位理由：组件 CSS，判据不改。
- 新 Subtask：「MultiSelect 触发器补 30px 末端区并与 Select 对齐 min-height」。
- 依赖与并行：R2-10 之后。

**R2-12 搜索快捷键夜间对比不足** · 经济 · STORY-126
- 来源：B-6、C-23。
- 现象：axe color-contrast 中 `kbd.tcrn-search-input__shortcut` 夜间 #85827a 于 #282724、#272724 为 3.89–3.9（文档顶栏、样板与壳内搜索），低于 C1 文字 4.5。
- 改法：`inputs.css.ts:96` 的 `.tcrn-search-input__shortcut` 颜色由 ink-3 改 ink-2，理由同 Story 已采纳的「夜间占位升 ink-2」。
- 档位理由：组件 CSS。
- 新 Subtask：「搜索快捷键文字改用 ink-2，夜间对比达 4.5」。
- 依赖与并行：R2-11 之后。列入 §3.4。

### 组 D · 文档层（P5，主力；P1 合入后）

**R2-13 清除文档层改包组件外观的覆写** · 经济（随 P5） · STORY-128
- 来源：C-1、B-10（第 20 步 72 处）；W2-E P13、W3-B P3。
- 现象：`apps/storybook/src/story-demo-styles.ts:284–289` 的 `.tcrn-doc-icon-sample svg[data-icon-name]` 设 18px 宽高与 brand-primary 色，把 icons-motion 图标压成 18px（矩阵 16px），第 20 步失败全是它。门量不到的还有：`apps/storybook/src/alpha-styles.ts` 约 1230–1232 行全局改 ShellBrandLockup 字标字号，647–661 行改文档顶栏字标，1160、1213、1223 行复刻包已定义的 `.tcrn-sr-only`、`.tcrn-skip-link`；`story-demo-styles.ts` 736、784、800、1042 行去掉知识库壳锁定组合的底色、阴影与内距；`.tcrn-doc-knowledge-shell__actions .tcrn-search-input` 的外观声明；W2-E P13 指出的 `.tcrn-checkbox` 文档规则。
- 改法：图标样例规则只留摆放（Icon 默认 size 即 md 16，标记不用改）；上列规则删外观声明，只留摆放或整条删除；跑 `node scripts/demo-styles-sync.mjs` 同步 storybook.css；`scripts/shell-fidelity-proof.mjs` 约 86 行起的白名单里，规则已删的条目同步删。复核 doc:sample-style 图标部分 failing 为 0、tokens:proof 的 demo-styles-sync 与 shell-fidelity、doc-shell:proof。
- 档位理由：文档层，判定不变。
- 新 Subtask：「清除文档层改包组件外观的覆写（图标 18px、全局字标字号、包类副本）」。
- 依赖与并行：P1 合入后（同改 storybook.css）；P5 第一项。

**R2-14 文档壳顶栏搜索框按包工具形态渲染，壳视觉 oracle 同步** · 主力 · STORY-128
- 来源：C-2；W6-B P3。
- 现象：`alpha-styles.ts:317–325、1208` 给 `.tcrn-doc-header-search .tcrn-search-input` 设 38px 块高与 panel 底，造成第 11 步顶栏搜索框高度离群（样本 32，文档壳 38）、第 17 步 cross-section 七条路由报包裹层作画、第 30 步 firstStoryHashShellParity 与 mobile layering 的 searchInput 层。oracle `storybookDocShellVisualOracle.shellMetrics` 定义在 `apps/storybook/src/build/foundation-visual-standards.ts:618–620`（searchHeightPx 36、searchBorderColor、searchBorderRadiusPx 4），经 `ai-consumption-contract.ts` 导出；冒烟与 internal-alpha 都从它读 searchHeightPx（`scripts/storybook-smoke.mjs:187`、`scripts/internal-alpha-browser-proof.mjs:757`），门脚本不用改。
- 改法：删两处块高变量与 panel 底，包裹层不作画，控件取包的 32px、wash 底与 control 圆角；oracle 三项按 G+ token 重写（searchHeightPx 32）或退役后两项，容差不放宽。
- 档位理由：改 Owner 声明的文档壳 oracle，即门的期望值来源。
- 新 Subtask：「文档壳顶栏搜索框改按包工具形态，文档壳视觉 oracle 的搜索三项按 G+ 重写」。
- 依赖与并行：R2-13 之后（同改 alpha-styles.ts）；R2-32 同改 foundation-visual-standards.ts，排在 P11。列入 §3.2 知悉（拆分 P18）。

**R2-15 shell-fidelity 阴影模糊检查扩到包内** · 主力 · STORY-121
- 来源：A-3（121-GWT4 部分）。
- 现象：`scanShellFidelity` 的 SURFACES 只有文档层三个文件（`scripts/shell-fidelity-proof.mjs:29–33`），GWT4 点名的 MAX_SHADOW_BLUR_PX 不覆盖包；其正则（约 240 行起）会把 `inset 0 0 0 5px`（`inputs.css.ts:343`，扩展半径）读成模糊 5。事实层面包内 318 层阴影模糊均不超过 3。
- 改法：只把阴影检查扩到 `componentCssModules(root)` 的全部段与 token 表（`packages/ui-tokens/src/tokens.css` 或 `tcrnTokenCss`），用 `scripts/lib/css-rules.mjs` 的 `shadowLayers` 按层解析；其余检查的扫描面不变；补变异测试：包段副本注入 `0 8px 24px rgba(…)` 判红，`inset 0 0 0 5px` 不判红。
- 档位理由：扩门的检查范围。
- 新 Subtask：「shell-fidelity 阴影模糊检查扩到包段与 token 表，按层解析区分扩展半径」。
- 依赖与并行：要 R2-2 合入后才在 tokens:proof 里跑得到；与 R2-13、R2-16 同改该脚本，P5 内顺序 R2-13、R2-14、R2-15、R2-16。

**R2-16 规则级守卫：文档样式不得改包类外观** · 主力 · STORY-128
- 来源：C-3；W3-B P3（map 之外 45 条以包类为主体的文档规则）。
- 现象：doc:sample-style 只比得到矩阵里有同签名的样本，未覆盖 1248 处（含 `span.tcrn-brand-wordmark[]` 20 处）；R2-13 的全局字标规则躲过了全部门。
- 改法：在 `scripts/shell-fidelity-proof.mjs` 的 docsPackageSelectorDuplication（或 `scripts/doc-shell-class-proof.mjs`）加检查：三份文档样式源里，主体复合选择器带包类的规则只准声明摆放类属性（grid-area、order、外边距、自身对齐等），其余属性判红；例外逐条登记并带裁定引用（后续家族沿用 EX-INIT015-* 的写法）；加变异：注入 `.tcrn-doc-x .tcrn-button{background:red}` 判红。先跑一遍列全命中，与 R2-13 一起清；收口逐条列出登记的例外。
- 档位理由：新增门的判定规则。
- 新 Subtask：「新增规则级守卫：文档样式源里以包类为主体的规则只准声明摆放属性」。
- 依赖与并行：R2-13、R2-14 之后，同包。

### 组 S · 文档 story、原型与冒烟脚本（P6，主力；P4 合入后）

**R2-17 密集与紧凑壳原型按 delete-demo 退役** · 主力 · STORY-128
- 来源：C-4；C 2.7 判 W3-C「只删类留元素」作为终态不可接受。
- 现象：静态页 `components-navigation-shells.html` 的 dense 段 62 个标签 31 个无 class，compact 段 78 个 26 个无 class，渲染为裸元素；第 30 步新超高故事 navigation-focused-shells-spec 2520px、视觉漂移全表最大（mean 25.434、maxCell 172）；W1-F P1 测到 top-bar 越界 393px；axe 4 个节点。
- 改法：同一提交内完成三件事并在提交信息逐条列出删掉的断言、引 doc-class-map 的 delete-demo 条目：从 `apps/storybook/src/contract-stories/prototypes/storybook-shell-demos.tsx` 及其 story 注册删 dense 与 compact 原型块；删 `apps/storybook/src/smoke.test.ts`（约 784–817 行）与 `scripts/storybook-smoke.mjs`（约 1016 行起）里只守护这些原型的断言。
- 档位理由：删门内断言。
- 新 Subtask：「密集与紧凑壳原型按 delete-demo 退役，并删除只守护它们的冒烟断言」。
- 依赖与并行：P4 合入后（同改 smoke.test.ts）；P6 第一项。列入 §3.4（C O-4）。

**R2-18 SUB-027 残项：zh-CN 新泄漏与 s254 折叠选择器** · 经济 · STORY-128
- 来源：B-12、C-5；W6-B P8。
- 现象：第 30 步 `localeLeakZhCnNewLeaks: 2`：text-styles 渲染「Page title / 36px」「Section title / 20px」（`apps/storybook/src/contract-stories/story-content.tsx:992–993` 由 token 值拼出），`apps/storybook/src/build/locales/storybook-content-text.ts:480、482` 的键仍是 28px、18px；`scripts/s254-story-dom-proof.mjs:43` 仍查 `.tcrn-story-disclosure`，`storyExpanded` 恒为 false。
- 改法：只翻译前缀、尺寸由 token 拼接（或两条键与五语值改成现值）；s254 改查 `.tcrn-doc-story-disclosure`。
- 档位理由：文案与孤立脚本选择器。
- 新 Subtask：「字号样本标签五语随 token 拼接，s254 折叠选择器改用 tcrn-doc- 前缀」。
- 依赖与并行：R2-17 之后，同包。

**R2-19 文档 story 给 Card 传 status 角色** · 经济 · STORY-128
- 来源：C 第 4 节第 30 步（`.tcrn-card--neutral[role="status"]` 4 个节点，原写「交对应家族分诊」）。本判断核对：`story-content.tsx:1157` 的 `<Card role="status">` 由 3e2c46f（SUB-027，2026-10-11）引入，属文档层，不是 Card 家族的缺陷。
- 改法：status 角色挪到允许该角色的外层包裹元素（或改用 live region 的 div），Card 不带 role。
- 档位理由：文档 story 标记。
- 新 Subtask：「加载示例的 status 角色从 Card 移到外层包裹元素」。
- 依赖与并行：同包（同改 story-content.tsx）。

**R2-20 导航壳故事的搜索结果浮层压住正文** · 经济 · STORY-133
- 来源：C-16；W6-B P5（第 10 步）。
- 现象：searchOverlay 的 baseline 与 restored 都 ok false：结果面板 420×138、top 230 压住 h3「Package-backed AOS shell boundary」与随后段落。
- 改法：调整 `story-content.tsx` 约 2281 行一带的版面，让声称可读的正文落在面板之外；门不改。
- 档位理由：story 版面。
- 新 Subtask：「导航壳故事调整版面，搜索结果浮层不再压住正文」。
- 依赖与并行：同包。

**R2-21 门在填充过渡未结束时读计算样式** · 经济 · STORY-133 · 两个 Subtask
- 来源：B-8（a、b、c）与 C-17，同一根因。
- 现象：(a) 第 17 步唯一可见失败 `desktop:searchControl:background-color:rgb(255, 255, 255)`：`scripts/storybook-smoke.mjs` 约 2370–2395 行在聚焦前取 `getComputedStyle` 活对象，聚焦、等 190ms、失焦后才读静止值，读到 fill-f（白）回 wash 过渡的起点。(b) 第 28 步 public-popup-family-dark：`scripts/lib/multi-select-dropdown-proof.mjs` 第 37–40 行切夜间后立即读，参照 Select 的底仍是白、菜单层已是 #191916，`layer === reference` 断言失败。(c) 第 30 步 `buttonFeedbackOk:false`：`scripts/internal-alpha-browser-proof.mjs` 约 2566–2569 行 hover 后只等 80ms，填充过渡 120ms，减弱动效下为 160ms linear；回执没存读数，属推断。
- 改法：读数前等 `document.getAnimations()` 全部结束（或连读两次相同），或只对读数注入 `transition: none`；冒烟的静止值改在交互前快照；不写死时长，不改期望值。
- 档位理由：取样时机，判定不变。
- 新 Subtask：(a)「storybook-smoke 静止值改在交互前快照、读数等过渡结束」（P6）；(b)「internal-alpha 与 MultiSelect 下拉证明读数等过渡结束」（P9）。按文件分属两包，所以拆两张。
- 依赖与并行：(a) 在 P6，(b) 在 P9；R2-11 的 dark 例要 (b) 一起转绿。

**R2-22 storybook-smoke 输出被截断** · 经济 · STORY-133
- 来源：C-18。
- 现象：第 17 步日志在 65,750 B 处断在对象中间：`storybook-smoke.mjs` 约 3822 行把整份 JSON 打到 stdout，紧接着约 3838 行 `process.exit(1)`，管道输出被截断，完整失败清单不可见。
- 改法：改用 `process.exitCode = 1`，或把 JSON 写进报告文件并在首行打印路径；判据不改。R2 末次 verify 读完整清单，余红记入 R2 问题清单。
- 档位理由：输出方式，判定不变。
- 新 Subtask：「storybook-smoke 改用 exitCode 退出，完整输出不再被截断」。
- 依赖与并行：同包，排在 R2-21a 之后。

### 组 G · 矩阵与样板标记（P7，经济）

**R2-23 inputs 矩阵 opt-sel 两格不可见** · 经济 · STORY-129
- 来源：B-14、C-6（126-GWT5、129-GWT1、130 inputs.B）。
- 现象：inputs.B 声明 42、可见 40，`opt-sel-l`、`opt-sel-n` 在收起的 MultiSelect listbox 里（`apps/storybook/src/contract-stories/gplus/matrix-stories.tsx:415`）。
- 改法：该 MultiSelect 以静态展开态渲染（用包的展开入口；没有就用 StaticMarkup 改写展开属性），选中项可见并带 data-cell；不写文档 CSS。B-14 的可选项（几何门对缺格判红）不做：visual-proof 已对缺格判红。
- 档位理由：story 标记。
- 新 Subtask：「inputs 矩阵的 MultiSelect 以静态展开态渲染，opt-sel 两格可见」。
- 依赖与并行：无前置。

**R2-24 矩阵与样板的 landmark 名重复** · 经济 · STORY-129
- 来源：B-16、C-7（axe landmark-unique 110 个节点）。归属取 C：脏回执里 92 个是矩阵 `.tcrn-doc-theme-preview` 两块中同名的 `<section aria-label="Heading" class="tcrn-surface">`，18 个是样板两只壳的 nav 与内容区（`#…-light-content`、`#…-light-nav`），不是文档壳。
- 改法：`gplus/matrix-renderer.tsx:106` 分节 Surface 的 aria-label 带本地化块名（浅色、夜间），或去掉 aria-label 让分节不成 landmark；`gplus/samples/composition-one.tsx` 夜间块壳的 nav 与内容区换不同的可访问名（走 ProductShell 入参，没有就用 StaticMarkup 改写），新文案五语齐。
- 档位理由：story 标记与文案。
- 新 Subtask：「矩阵分节与样板壳的 landmark 名按主题块区分」。
- 依赖与并行：同包。

**R2-25 品牌样板 Asset ID 列触发内部词扫描** · 经济 · STORY-129
- 来源：C-8（第 25 步唯一命中）。
- 改法：`composition-one.tsx:292` 删掉 Asset ID 列，或改显示不含仓库名的标识；不给扫描器加豁免。复核第 25 步。
- 档位理由：story 内容。
- 新 Subtask：「品牌样板表去掉 Asset ID 列里的仓库名标识」。
- 依赖与并行：同包。

**R2-26 隐私扫描命中矩阵渲染器的 JSX key 行** · 经济 · STORY-129
- 来源：W7-A P1、W6-A P2；三片未列，本判断补入。
- 现象：`internal-alpha:proof` 依次是 contracts、browser-proof、`pnpm scan`（`scripts/no-private-input-scan.mjs`）、hardening；批末停在 browser-proof，scan 没跑。scan 的 env-assignment 规则不区分大小写，`gplus/matrix-renderer.tsx:88` 独占一行的 JSX key 属性被判为赋值，退出 1。
- 改法：把该 key 属性写到同一行其他属性之后，不再独占行首；不改扫描器口径（改口径需授权）。
- 档位理由：一行标记。
- 新 Subtask：「矩阵渲染器的 JSX key 属性不再独占行首，隐私扫描转绿」。
- 依赖与并行：同包（同改 matrix-renderer.tsx）。

### 组 H · 几何门（P8，主力；P7 合入后）

**R2-27 几何门必测项与测量钩子** · (b) 主力、(a) 经济 · STORY-131、STORY-129 · 两个 Subtask
- 来源：C-12；W5-B P8。
- 现象：矩阵行的 controlHeight 与 rail 恒为 n/a（第 18 步 `checksNeverApplied: ["controlHeight"]`）；五个样板 `notApplicableRequired: ["contrast"]`（样板没有 data-cell，REQUIRED_CHECKS 却含 contrast），真正该必测的 rail 不在必测项（`scripts/geometry-measure-proof.mjs:79–91`）；DIFF-6 仍写「待测量库支持」，W5-C 已加 before-bg 探针。
- 改法：(a) 标记（P7）：`gplus/matrix-stories.tsx` 给 Actions 与 Inputs 矩阵的控件加 data-h（28/32/40）。(b) 门（P8）：`geometry-measure-proof.mjs:79–91` 样板必测项去 contrast、加 rail，有 TableShell 行的样板加 rowAlign，actions-matrix 与 inputs-matrix 加 controlHeight；`docs/design/gplus-2026-10/storybook-map.json` 与 `.md` 对应行 requiredChecks 同步，DIFF-6 改为「测量库已支持 before-bg（W5-C）」；`tests/geometry-measure-proof.test.mjs` 随之改。复核第 18 步 notApplicableRequired 与 checksNeverApplied 清空；样板 rail 在 O-1 前保持红，属预期。
- 档位理由：(b) 改门的判定配置；(a) 只加标记。
- 新 Subtask：(b) STORY-131「几何门必测项按板调整：样板测 rail、矩阵测 controlHeight，映射同步」；(a) STORY-129「Actions 与 Inputs 矩阵控件补 data-h 测量钩子」。
- 依赖与并行：(a) 先于 (b)。

**R2-28 iconStroke 探针：124-GWT1 补渲染实测** · 主力 · STORY-124
- 来源：B-11；拆分 P31。
- 现象：没有门读图标的计算描边，第 18 步 probes 只有三项（`geometry-measure-proof.mjs:109–111`）。
- 改法：加 probe `iconStroke`（source 124-GWT1）：icon-matrix 16px 行每个 `svg.tcrn-icon > *` 的计算 stroke-width 为 1.25px、vector-effect 为 non-scaling-stroke；配一个把描边改成 2 的红夹具。
- 档位理由：门增项。
- 新 Subtask：「几何门加 iconStroke 探针，实测 16px 图标描边 1.25px」。
- 依赖与并行：R2-27b 之后，同包。

### 组 A · 浏览器门判定（P9，主力）

R2-21b 也在本包，排第一。

**R2-29 internal-alpha 把 C7 单行截断记成 clipped** · 主力 · STORY-133
- 来源：B-9；W6-B P7（W2-B P8 已预言）。
- 现象：第 30 步 `clippedButtonText: true`；脏回执 browser-proof-summary 记 288 个标题（h1 33、h2 195、h3 59、h4 1），含 Billing、Settings 等短标题；规则（`internal-alpha-browser-proof.mjs` 约 295–311 行）是 overflow 非 visible 且 scroll 尺寸超出 1px 即记。短标题被记，推断为衬线行框（如 26/30）小于字体内容区的纵向溢出。
- 改法：门对 nowrap、ellipsis 且 title 含可见文字（与 R2-31 同口径）的单行角色不计横向截断；单行 nowrap 元素不计纵向字体度量溢出；无 title 的真实截断照记。组件侧改 `overflow-x: clip` 不做：没有字形被裁的证据；R2 末次截图或目视若发现上下沿被裁，另开返工。
- 档位理由：改门的判定语义。
- 新 Subtask：「internal-alpha 的 clipped 判定排除带 title 的 C7 单行截断与单行纵向字体度量溢出」。
- 依赖与并行：R2-21b 之后，同包。

**R2-30 axe 登记品牌后缀字标豁免** · 主力 · STORY-133（影响 127）
- 来源：B-15；C O-3 的后缀部分；A 2.1 判 W3-A P4 字标豁免可接受。
- 现象：axe color-contrast 中后缀节点：DS #6577f3 于白 3.82、于文档顶栏 #ecf4f3 3.42、于样板侧栏 #dde4df 2.95，TMS #2c63c8 于夜间 #191916 3.12；token-contrast 门已按 D2 与 V2-B1-Brand 板 F 段逐条登记字标豁免，axe 运行没有登记。
- 改法：`internal-alpha-browser-proof.mjs` 的 axe 运行对 `.tcrn-brand-wordmark__suffix`、`.tcrn-product-logo__line-one-suffix` 排除 color-contrast，豁免表与 token-contrast 同源并写裁定引用。标语与壳锁定说明（ink-3）不在豁免内，留 §3 O-2。
- 档位理由：改门判定。
- 新 Subtask：「internal-alpha 的 axe 对品牌后缀登记字标豁免，与 token-contrast 豁免同源」。
- 依赖与并行：同包。列入 §3.4。

### 组 C7（P10，主力；P1 合入后）

**R2-31 收紧 C7 的 title 口径与 Button 禁用原因写法** · 主力 · STORY-132（影响 125）
- 来源：C-20；W4-B Q9a。
- 现象：C7 现为「title 非空即满足」；Actions 有 20 处 title 写的是禁用原因而不是标签，标签被截断后读不到全文。
- 改法：`scripts/contract-static-proof.mjs` 的 C7.story-title-missing 对第一批承载元素要求 title 含可见文字（空白规范化后比较），`tests/contract-static-proof.test.mjs` 加变异（title 与标签无关判红），`docs/contract/clauses.md` 的 C7 同步；`packages/ui-react/src/components/Button/Button.tsx` 带禁用原因时 title 写「标签 — 原因」（或 title 只写标签、原因走 aria-describedby），同步 `Button.test.tsx`。门与组件同包落地。
- 档位理由：改门的判定语义。
- 新 Subtask：「C7 对第一批承载元素要求 title 含可见文字，Button 禁用原因并入 title」。
- 依赖与并行：P1 合入后（同改 contract-static-proof.mjs）。

### 组 K · 文档与清理（P11，经济；全部代码包合入后）

**R2-32 门命令文字残留** · 经济 · STORY-133
- 来源：C-22；W6-A P10。
- 改法：`README.md:85` 与 `README.zh-CN.md`、`README.ja.md`、`README.ko.md`、`README.fr.md` 第 44 行改为 `pnpm storybook:visual-proof`，并指向 `docs/contract/README.md` 的门清单；`apps/storybook/src/build/foundation-visual-standards.ts:546` 写明新门；版本行不动。复核 readme:proof。
- 新 Subtask：「README 五语与 foundation 标准页的门命令改为现行写法」。
- 依赖与并行：P5 合入后（同改 foundation-visual-standards.ts）。

**R2-33 随包 FONT-LICENSES.md 去掉 CDN 主机名** · 经济 · STORY-121
- 来源：A-9（可选；若把 pack 产物算作构建产物，121-GWT1 的字面搜索为 1 处）。
- 改法：`packages/ui-tokens/FONT-LICENSES.md:6` 改为不含主机名的说法。
- 新 Subtask：「FONT-LICENSES 正文去掉 CDN 主机名」。依赖：无。

**R2-34 退役失效脚本 s254-component-contract-proof.mjs** · 经济 · STORY-122
- 来源：A-10、W1-B P2（低优先）。
- 现象：脚本用正则从 Navigation.tsx 抽模板，SUB-010 后匹配为空，八项检查全失败；不在 verify 链。
- 改法：先全仓 grep 确认无引用（含 docs 与回执），再 `git rm`；或改用 `scripts/lib/component-css-sources.mjs` 的 `componentCssText()`。
- 新 Subtask：「退役失效的 s254-component-contract-proof 脚本」。依赖：无。

**R2-35 STORY-134 文档随 R2 回写** · 经济 · STORY-134
- 来源：A-8。
- 改法：`CHANGELOG.md` 4.0.0 段写 mono 中文回退、浅色主题块选择器、字体刻度生成方式并改正第 17–19 行，再补 R2 的可见变化（链接对表、只读焦点环、Field 错误态、快捷键 ink-2、MultiSelect 末端区、主题钮显隐、Button 禁用原因 title、原型退役）；`docs/migration-4.0.md` 的 M1、M2、M3 与受影响各节；`packages/ui-tokens/README.md` 的三块结构；`docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md` 写 fonts:proof 现状、加一行知悉「第二批以后家族的状态底色改为中性 wash」，并为 §3.4 各项加目视核对行。
- 新 Subtask：「CHANGELOG、迁移说明、ui-tokens README 与目视清单随 R2 回写」。
- 依赖与并行：全部代码包合入后。

### 组 L · 批末再生（P12，经济；P11 之后、末次 verify 之前）

**R2-36 故事高度宽限表刷新** · 经济 · STORY-129
- 来源：C-19；W6-B P9；拆分 P24。
- 现象：第 30 步 8 条 recorded-drift（owner-quality-product-shell、frontend-shell-slice、component-family-index、display-primitives-spec、ai-consumption-contract、color-palette、foundation-visual-standards、icons-motion）。新超预算的 navigation-focused-shells-spec 由 R2-17 删除，不进宽限表。
- 改法：全部渲染改动合入后，把 `scripts/lib/story-budget.mjs` 约 63 行起届时仍漂移的条目 recordedHeightPx 刷成实测值；变高的逐条记前后值与原因，收口列给 Owner（§3.2）。
- 新 Subtask：「R2 末刷新故事高度宽限表的陈旧记录」。
- 依赖与并行：全部渲染返工之后，SUB-046 之前。

**R2-37 批末报告入仓** · 经济 · 三个 Subtask
- 来源：C 第 4 节；128 的 Implementation Notes；130 的入仓报告停在 ab00f44。
- 改法：(a) STORY-128「doc-shell 清零差集证据入仓」：写进 `docs/verification/doc-shell-class/`；(b) STORY-130「R2 末再生映射报告」：`node scripts/storybook-visual-proof.mjs --write-report`，更新 `docs/verification/storybook-visual-proof/gplus-map-report.json`；(c) STORY-131「R2 末再生几何测量报告」：`node scripts/geometry-measure-proof.mjs --write-report`，更新 `docs/verification/geometry-measure/`。
- 依赖与并行：同 R2-36。

**SUB-046（既有，不是新返工）**：在 R2-36、R2-37 之后执行一次：视觉签名基线选择文件（逐条理由与证据）、internal-alpha 四段（contracts、browser-proof、scan、hardening）、scaffold 与 readme 回执再生、pack 与 storybook:build 证据；另跑 `node scripts/fonts-vendor.mjs --check`，R2 新增文案让选片需要增加时跑一次 `pnpm fonts:vendor`（W1C-7，R1 的 d8586dd 同样记在 SUB-046 名下）。之后主线程跑 R2 末次全量 verify。

## §3 只有 Owner 能定的事项

「按建议先做、Owner 可事后更正」只用于不越出授权的 B、C 类事项；越出授权或改变判据的保持阻塞。

### §3.1 待裁事项（按影响排序）

**O-1 构图一的壳层几何是否算 G+ 底盘、纳入 INIT-015**（拆分 P1、B O-1、C O-1、映射 DIFF-1）
- 问题：样板引导列 16/49/77、纸离边 0、顶栏 68，ProductShell 侧栏 280、收起 92；构图一要求引导列 16/48、纸离边 12、顶栏 52、侧栏 220、收起 52。INIT 不授权改第二批以后的家族，禁用清单禁止通用件拼壳。
- 受影响：127-GWT4（52px）、129-GWT3、130-GWT1 的样板 10 行、131-GWT4 的样板 rail、第 11 步文档壳关系（C-21）、第 30 步壳侧栏洗底上的标语对比（O-2）；进而 120-GWT5 与 133-GWT1 的 verify 全绿，以及 134 的前置条件。
- 建议：按 D1「页面构图采用构图一」授权，只改 ProductShell 这几项：引导列 16/48、纸离边 12（14 圆角加 s1）、顶栏 52、侧栏 220 与收起 52、侧栏画布色且无右边线；Navigation 家族其余行为留第二批。
- 未答复时：保持阻塞。R2 做完其余返工；样板 rail 行与第 11 步文档壳关系保持红并注明 O-1；不以记差异代替。Owner 不授权时，把 129-GWT3 与 127-GWT4 的 52px 移到 Navigation 批次（改判据，须 Owner 明示），样板 rail 按包现行几何记差异，C-21 按包壳现行几何对齐（经济档）。

**O-2 锁定组合标语与壳品牌说明的对比度**（B 127「其它发现」、C O-3 标语部分）
- 问题：`.tcrn-product-logo__line-two` 与 `.tcrn-shell-brand-lockup__caption` 用 ink-3，落在壳侧栏的 acc-bg 洗底上：浅色 #6b675d 于 #dde4df 4.36，夜间 #85827a 于 #172421 4.17（样板、AOS 视觉实例、知识库壳）。
- 受影响：第 30 步 axe。
- 建议：随 O-1 把侧栏改为画布色即可达标（ink-3 于 bg 不低于 4.5，120-GWT2 已证）；O-1 不授权时二选一：标语按商标字标豁免（WCAG 1.4.3 logotype 例外），或标语改 ink-2。
- 未答复时：保持红并注明 O-2；不自行加豁免（标语没有既有裁定依据）。文档壳品牌区的洗底在 R2-13 删去外观后复核。

**O-3 夜间品牌后缀色**（A O-1、B O-2、C O-3、拆分 P15）
- 问题：后缀两主题同值；TMS #2c63c8 于夜间 panel 3.13、bg 3.33，靠字标豁免登记并标注「夜间值待 Owner」。
- 受影响：127 的可读性（GWT3 只判浅色）；token-contrast 与 axe 的夜间 TMS 豁免条目。
- 建议：TMS 夜间改用 D5 同标浅色 #7aa0f5（于 #191916 6.86、于 #121210 7.30），撤掉两条夜间豁免；DS #6577f3 夜间已达标，不改。定后只改 `contract/tokens.json` 的 brand 条目与生成器 brand 形状（主力档），门会把过期豁免判红、提示删除。
- 未答复时：维持两主题同值与字标豁免，不改色值。

**O-4 映射里待裁的差异**（C O-2）
- DIFF-3 画布内部两处不一致（212/48 对 220/52）：建议以构图板 220/52 为准。DIFF-2 构图三没有 story：建议随 O-1 一起定，授权则下一轮补构图三样板，否则记到页面模板批次。DIFF-8 产品标六档尺寸阶梯与贴片没有 story：建议放第二批品牌。DIFF-7 只需知悉。
- 受影响：130 的 differencesPendingOwner。
- 未答复时：保持 differencesPendingOwner，不补 story。

**O-5 外壳切换钮尺寸**（B O-3、W3-D P1、W2-D P15、W6-B P2）
- 问题：主题钮 36 胶囊、侧栏钮 38、移动导航钮 44，与 IconButton md 32、圆角 8 不一致；冒烟比较器按现行几何。
- 建议：桌面两枚改 IconButton md 32 加 radius-control，移动导航钮 44 登记为触控例外；属壳层件，随 O-1 或放第二批。
- 未答复时：维持现状。

**O-6 组件内字面几何是否补 token**（B O-6；与 R2-4 的分界）
- 问题：按钮内图标 13/15、勾选 16、开关 34×20、末端区 30、贴片圆角 11 等仍是字面值。C10 只管壳层几何，B 判不算硬线违例；字体刻度已有 token，按 122 的「单一真值」目的锚列为 R2-4，只引用已有 token。
- 建议：下次契约修订补 token，不阻断本轮。
- 未答复时：不新增 token。

**O-7 Typography API**（B O-5、W2-B P5、P9）
- 建议：numeral 不截断，在 `docs/contract/roles.json` 写明非单行截断角色；numeral-inline、large、mono 暂经 className，尺寸 prop 与 `as="span"` 下批再议。
- 未答复时：维持现状（numeral 不截断、给 title），不改 roles.json。

**O-8 B1 与 B2 品牌规格分歧**（B O-4、W2-F #13）
- 问题：B1（现实现）字标 500 加后缀 600、标 38/28/22；B2 为 sans 整词 600、示意标 44；doc:sample-style 读到壳内字标 12.5px/600 对矩阵 14px/500。
- 建议：保持 B1，目视清单点名确认。未答复时：保持 B1。

**O-9 secondary 与 danger 默认 edge 的抬升层是浅墨字面量**（A O-4、W1-A P2、W2-D P9）
- `0 1px 1px rgba(22,21,15,.04)` 两主题共用，夜间几乎不可见。建议本批维持画板，下次画板修订改主题化 token。未答复时：维持。

**O-10 焦点环间隙色是否随承载面变化**（A O-5）
- 契约注释写「跟随承载面（纸上为 panel）」，包与画板实际都显示 bg 色间隙。建议维持画板行为，把契约注释改成与行为一致（P1 顺手改，列 §3.4）；要间隙随纸面变白需改焦点环声明方式，属视觉改动。未答复时：按建议。

**O-11 中文子集是否加「常用 3500 字」**（A O-2、拆分 P9、W1C-2）
- 建议不加；要加请给定字表来源，由 fonts-vendor 加选切片。未答复时：不加。

**O-12 上游三份 LICENSE 的版权行只写 Google Inc.**（A O-3、W1C-1，知悉）
- 建议维持原样；附各项目自身的 OFL.txt 属新增下载来源，由 Owner 决定。本判断不对许可合规下结论。

### §3.2 知悉（不需裁定，收口列明）

- 文档壳视觉 oracle 的搜索三项随 G+ 替换（R2-14；拆分 P18、C O-5）。
- 视觉签名基线整体替换，SUB-046 逐条以 accepted-layout-change 接受（拆分 P18）；目视另行。
- 故事高度宽限表刷新，变高条目列前后值（R2-36；拆分 P24、C O-5）。
- 第二批以后家族的状态徽标失去绿色与琥珀色底，改为中性 wash（A 2.1，W2-A P10 口径）。
- Actions 板 B 段标签按值反查 token 名（W1-A P1），属画板字节，随下一次画布修订改。
- STORY-120 正文的「3.44」按画板算法应为 3.36 与 2.89（W3-A P2），只注解、不改正文。

### §3.3 授权外或待 O-1，不列返工

- C-21 文档壳跟随包壳几何（第 11 步侧栏、品牌关系）：目标几何取决于 O-1，未答复时暂缓，见 O-1。
- 壳上下文里图标 11px、壳侧栏品牌链接继承默认链接色（`a.tcrn-product-shell__brand` 宜 `color: inherit`）：Navigation 家族。
- 非 Actions 家族的按压缩放（nav-item、locale 触发器、表格工具栏 chip 等，W3-D P2）与十余条旧焦点写法（W3-D P3）：后续家族。
- doc:sample-style 的 package-context 142 处按家族交后续批次（C 2.7 W5-C 条件③）。
- Field 其余外观与错误图标（第五批）；Text 外距与 caps 截断写进 typography.json（下次契约修订）。
- stamp 字栈以系统 Songti SC 打头（stamp 负责方）；tabular-nums 全局应用（页面与壳层根）。
- AI 消费契约没有暴露 51 个弃用名（W2-A P12，AI 契约负责方）；弃用通知两种计数口径对齐或 bin 入口（W7-A P7，EPIC-043 后续）。

### §3.4 按建议先做（实施对话自定，收口回显，Owner 可事后更正）

1. R2-6 只读获焦补焦点环（与画板状态顺序不同）。
2. R2-10 Field 错误态整块洗底一并去掉（P29 口径更正）；Owner 不接受时，把 126-GWT5 的 err-msg 两格移到第五批。
3. R2-12 快捷键 ink-3 改 ink-2；若 Inputs 板本身画的是 ink-3，以 C1 文字阈值为准，回显给 Owner。
4. R2-17 密集与紧凑壳原型退役并删除守护断言（C O-4）；Owner 要保留时，改为第二批用包组件重画。
5. R2-30 axe 对品牌后缀登记字标豁免（沿用 token-contrast 已登记的 D2 与 B1 板 F 段依据）。
6. R2-8 主题钮图标显隐改由 data-current-theme 控制（取 C-9，不取 B-3）。
7. R2-29 clipped 判定排除 C7 合规截断；R2-31 收紧 C7 并改 Button 禁用原因的 title。
8. R2-16 守卫例外的登记（后续家族沿用 EX-INIT015-* 写法），收口逐条列出。
9. O-10 契约注释改为与焦点环行为一致。
10. C-21 暂缓到 O-1 之后，不按包壳现行几何先改一遍。
11. 三片已判可接受的实施口径一并回显：W1-C 拦截 data: URI、W2-G 复制 OFL 进 storybook-static、W2-A P10 别名目标、W3-A P4 字标豁免与 bg 承载面、W2-H 只含 transparent 的 outline 放行、W1-B P5、W2-B P4/P5/P6、W2-D P7、W3-D P5（vertical-align middle）、W1-D 包写出的类不计包外类、W5-C `--strict` 不设默认、W1-E 的 C2/C6/C11 口径、W6-A 门序与命名、拆分 P5/P17/P22/P31 的载体调整、M5 `.tcrn-icon` 基类进包。

### §3.5 停点（D8）

推送 main、打 tag、发版、部署、Owner 目视验收，各自独立，由 Owner 本人做；本判断没有代签任何一项。

## §4 链写计划

主线程用批量入口一次写完，读回回执。actor 记实际执行者。下文 summary 都不超过 160 字节（已逐条按 UTF-8 计数）。

### §4.1 R1 Subtask 转 done

- TCRN-DS-SUB-001 至 TCRN-DS-SUB-045，共 45 张，按引擎允许的路径 planned → ready → active → done（以回执为准）。共用 summary：「R1 包已合入集成分支 98199a7；验收缺陷转 R2 新 Subtask」。
- TCRN-DS-SUB-046 不转，保持 planned，在 R2 末包执行，随 R2 的链写转态。
- Subtask 的 work id 按 key 从链上读取（`R/subtasks.json` 只有 key 与 parentId）。

### §4.2 Story 转态

15 张 Story 统一 planned → ready → active。ready 一步共用 summary：「R1 实施合入集成分支 98199a7，批末验收完成，进入 R2 返工」。active 一步逐张如下：

- STORY-120（work:dc8820c6d2ee0915cfda3878）：「R1 不通过：GWT5 verify 红 11 步；缺浅色主题块、字体测试夹具旧名；返工 R2-1/2/3」
- STORY-121（work:f777d0aeec6779529a566622）：「R1 不通过：GWT2 mono 缺中文回退，GWT4 阴影检查不扫包；返工 R2-1/2/15/33」
- STORY-122（work:bcf1f36ee2f93d7c8b69518c）：「R1 不通过：GWT2 仍有含色字面量的状态规则，字体刻度未进生成；返工 R2-4/7/34」
- STORY-123（work:88be4a8b40a73ef49bda49ce）：「R1 不通过：GWT4 夜间页浅色格错，链接状态写色；返工 R2-5，依赖 R2-3」
- STORY-124（work:cd0044cd4e877982b2380237）：「R1 不通过：GWT1 缺描边实测，文档层把图标压成 18px；返工 R2-13/28」
- STORY-125（work:91e4b795d04577ade46f29ab）：「R1 不通过：GWT3 夜间页浅色格错，主题钮 C5 不同构；返工 R2-8/31」
- STORY-126（work:c6f950c965e3dd9fc23e854f）：「R1 不通过：GWT5 缺两格、错误文案偏差，C2 越级；返工 R2-6、R2-9 至 12」
- STORY-127（work:b4180fe5919ef55fd45dabae）：「R1 阻塞于 Owner：GWT1–3 满足，GWT4 收起 52px 待构图一壳层几何（O-1）」
- STORY-128（work:3800d0d94195b75cbab2931a）：「R1 不通过：GWT3 图标 18px 覆写 72 处，文档层仍改包外观；返工 R2-13/14、R2-16 至 19」
- STORY-129（work:12a5dfa99cb91f55647b2a88）：「R1 不通过：GWT1 缺两格，GWT2 夜间错，GWT3 待 O-1；返工 R2-23 至 27、R2-36」
- STORY-130（work:0fbb3d17f6c255f37614c300）：「R1 不通过：GWT1 映射 22 行全红；返工 R2-27/37，样板 10 行待 O-1」
- STORY-131（work:83b087aa618af6dd002d0254）：「R1 不通过：GWT4 对比与必测项缺口，样板 rail 待 O-1；返工 R2-27/28」
- STORY-132（work:a4e12893d78be775d63b4e91）：「R1 不通过：GWT4 现仓 C2 红 7 条、C5 红 1 条；返工 R2-5/8/9/31」
- STORY-133（work:7fe5f75adb667c9e50bd7c5a）：「R1 不通过：GWT1 真实 verify 停在第 6 步；返工 R2-20/21/22/29/30/32」
- STORY-134（work:f5de8fcf90580fcc9b4192f7）：「R1 不通过：GWT1–3 满足，SUB-046 排在 R2 后，前置未满足；返工 R2-35」

### §4.3 Story 注解（work-annotate；建议写进结果类字段与证据路径，不动 scope、goal、acceptance 正文）

- 120：结论不通过。GWT1–4 满足（C5 按三块口径、ink-3 门、弃用通知按 P10 口径）；GWT5 不满足（30 步红 11 步）。返工 R2-1、R2-2、R2-3；GWT5 另依赖全部返工与 O-1。正文「3.44」按画板算法应为 3.36 与 2.89（W3-A P2），不改正文。证据 `R/acceptance/A.md`、`R/verify/steps.md`。
- 121：不通过。GWT1、3、5 满足；GWT2 部分（mono 无 Noto 回退）；GWT4 部分（点名检查不扫包，事实上包内模糊不超过 3）；tokens:proof 五个子门批末未执行。返工 R2-1、R2-2、R2-15、R2-33。待 Owner：O-11、O-12。
- 122：不通过。GWT1、3、4 满足；GWT2 部分（locale 触发器状态规则含颜色字面量，门只查 pairs 目标）；目的锚缺口：字体刻度未进契约生成。返工 R2-4、R2-7、R2-34。透明 outline 放行（P12）可接受。
- 123：不通过。GWT1–3 满足；GWT4 部分（夜间页 21 个浅色格）。硬线：链接状态写色、quiet 用停用色、焦点无强制色回退。返工 R2-5；依赖 R2-3、R2-18、R2-29。待 Owner：O-7。
- 124：不通过。GWT2–4 满足；GWT1 部分（没有 16px 描边渲染实测）；硬线：文档层把图标压成 18px。返工 R2-28、R2-13。M5（设计会话 B 类裁定）：`.tcrn-icon` 基类已进包 `styles/icon.css.ts`，Owner 可事后更正。
- 125：不通过。GWT1、2、4、5 满足；GWT3 部分（夜间页 58 个浅色格）；硬线：主题钮图标显隐 C5 不同构。返工 R2-8、R2-31；依赖 R2-3、R2-21。加载文案由调用方传入（P22）可接受。待 Owner：O-5、O-9。
- 126：不通过。GWT1–4 满足；GWT5 不满足（opt-sel 两格未渲染、err-msg 两格偏差、夜间页 20 个浅色格）。硬线：C2 四条、MultiSelect 无末端区、只读获焦无焦点环、快捷键夜间 3.9。返工 R2-6、R2-9 至 R2-12；依赖 R2-3、R2-23、R2-21。P29 口径更正：错误态整块洗底一并去掉（§3.4）。
- 127：阻塞于 Owner。GWT1–3 满足；GWT4 的 CSS 部分已做，收起宽 52px 依赖构图一壳层几何（O-1）。夜间后缀色待 O-3；axe 后缀豁免由 R2-30 补登记；mono SVG 以 currentColor 比对（P13）可接受；B1 规格待 O-8 目视确认。
- 128：不通过。GWT1、2 满足；GWT3 不满足（icons-motion 72 处 18px 覆写）。目的锚缺口：文档 CSS 仍改包外观、密集与紧凑壳原型渲染为裸元素、zh-CN 新泄漏 2 条、Card 带 status 角色。返工 R2-13、R2-14、R2-16 至 R2-19、R2-37a。
- 129：不通过，GWT3 另阻塞于 Owner。GWT1 不满足（inputs 可见 40/42）；GWT2 不满足（夜间页浅色块读夜间值、err-msg-n）；GWT3 rail 待 O-1。另有 landmark 重名、Asset ID 内部词、隐私扫描命中、夜间样板钮无图标、宽限表 8 条陈旧。返工 R2-23 至 R2-26、R2-27a、R2-36；依赖 R2-3、R2-8、R2-10。
- 130：不通过。GWT2 满足；GWT1 不满足（rowsOk 0/22：矩阵 12 行夜间对比、inputs 两行 err-msg、inputs.B 缺格、样板 10 行 rail）。返工 R2-27b 的映射同步、R2-37b；依赖 R2-3、R2-10、R2-23；样板行待 O-1，DIFF-2、3、8 待 O-4。
- 131：不通过。GWT1–3 满足（GWT1 按 P17 改用首条数据行）；GWT4 不满足（样板 rail 待 O-1、夜间页对比 4.03、controlHeight 从未实测、样板必测 contrast 无依据）。返工 R2-27b、R2-28、R2-37c；依赖 R2-3、R2-10。
- 132：不通过。GWT1–3 满足；GWT4 不满足（C2 7 条、C5 1 条，落点 R2-5、R2-8、R2-9）。返工 R2-31（C7 title 收紧）。豁免 12 条均引 INIT 不授权段与 P4，可接受。
- 133：不通过。GWT2、3 满足（CI 只写配置，未推送）；GWT1 部分（接线齐，真实 verify 停在第 6 步，另 10 步红）。返工 R2-20、R2-21、R2-22、R2-29、R2-30、R2-32；verify 全绿另依赖 O-1。
- 134：不通过。GWT1–3 满足；SUB-046 按 M6 排在 R2 返工全部合入之后、末次 verify 之前；前置条件（EPIC-039 至 042 全部 Story done）未满足；文档随 R2 回写（R2-35）。P16：users 已在名册内，该用例不再适用。最终判定人是 Owner（目视与 D8 停点）。

### §4.4 INIT-015（work:e5b3880c835fd77f1c14b81b）注解要点

保持 active。要点：R1 拆 46 张 Subtask，27 个包全部合入集成分支 98199a7，45 张转 done，SUB-046 按 M6 排到 R2 末；批末 verify 30 步红 11 步；三片验收 14 张不通过、STORY-127 阻塞于 Owner；R2 返工 37 条（主力 15、经济 22），开新 Subtask 41 张，分 12 个包；最关键的 Owner 事项 O-1（构图一壳层几何）卡住 127、129、130、131 的样板部分与 verify 全绿；M5（`.tcrn-icon` 基类进包）随本次链写回显；推送、tag、发版、部署与目视验收为 Owner 停点（D8）；本轮 lessons 5 条落卡。证据 `R/judgment.md`、`R/acceptance/`、`R/verify/steps.md`。

### §4.5 知识卡

`R/lessons.json` 的 5 条用 knowledge-create 逐条落卡并读回（读取在活跃库上带 `--allow-trailing`）；被预算拒绝就记阻塞，迁移后补写。

### §4.6 不在本次链写内

R2 的 41 张新 Subtask 由 R2 拆分代理按 §2 的标题与父 Story 用 `work-create --kind Subtask --parent-id <Story id>` 落链。引擎 2.x 没有 Incident，本轮不开带 fixes 的新 Story：返工全部挂在原 Story 下。

## §5 R2 规模估计与分组建议

规模：返工 37 条（主力 15、经济 22），新 Subtask 41 张，另有既有的 SUB-046；建议 12 个包（主力 8、经济 4），并行上限 3。各包预计回合合计约 650–880；关键路径约 P1 → P2 → P11 → P12，加上等待 P5、P6 收尾，约 280–360 回合。

| 包 | 档 | 返工（包内顺序） | 预计回合 | 主要文件 | 前置 | 不能与之同时跑 |
| --- | --- | --- | --- | --- | --- | --- |
| P1 契约 token 输出 | 主力 | R2-1、R2-2、R2-3，顺手 O-10 注释 | 70–90 | contract/tokens.json、contract-generate、ui-tokens index 与生成物、tokens-sync、storybook.css token 块、contract-static-proof（C5）、fonts-proof 与其测试 | 无 | P2、P5、P10 |
| P2 刻度、链接与只读焦点 | 主力 | R2-4、R2-5、R2-6 | 90–120 | contract/typography.json、pairs.json、contract-generate、生成物、index.ts、typography.css.ts、base.css.ts、Typography 与 Form 测试 | P1、P3、P4 | P1、P3、P4；若 R2-4 改变 tokens.css 输出也不能与 P5 同跑 |
| P3 base 段与 contract-proof | 主力 | R2-7、R2-8 | 30–45 | base.css.ts、contract-proof 与测试、Navigation.test | 无 | P2 |
| P4 Inputs 收尾 | 经济 | R2-9、R2-10、R2-11、R2-12 | 45–60 | inputs.css.ts、Form.test、smoke.test.ts | 无 | P2、P6 |
| P5 文档层与守卫 | 主力 | R2-13、R2-14、R2-15、R2-16 | 90–120 | story-demo-styles、alpha-styles、storybook.css 文档块、shell-fidelity-proof、foundation-visual-standards | P1 | P1、P11 |
| P6 文档 story 与冒烟 | 主力 | R2-17、R2-18、R2-19、R2-20、R2-21a、R2-22 | 70–90 | 原型文件、smoke.test.ts、storybook-smoke.mjs、story-content、storybook-content-text、s254-story-dom | P4 | P4 |
| P7 矩阵与样板标记 | 经济 | R2-23、R2-24、R2-25、R2-26、R2-27a | 40–55 | gplus/matrix-stories、matrix-renderer、samples/composition-one | 无 | 无 |
| P8 几何门 | 主力 | R2-27b、R2-28 | 40–60 | geometry-measure-proof 与测试、storybook-map.json 与 .md | P7 | 无 |
| P9 浏览器门判定 | 主力 | R2-21b、R2-29、R2-30 | 50–70 | internal-alpha-browser-proof、lib/multi-select-dropdown-proof | 无 | 无 |
| P10 C7 口径 | 主力 | R2-31 | 35–50 | contract-static-proof 与测试、docs/contract/clauses.md、Button 与测试 | P1 | P1 |
| P11 文档与清理 | 经济 | R2-32、R2-33、R2-34、R2-35 | 35–50 | 五份 README、foundation-visual-standards、FONT-LICENSES、s254 组件脚本、CHANGELOG、迁移说明、ui-tokens README、owner-acceptance | P1–P10 全部合入 | P5 |
| P12 批末再生 | 经济 | R2-36、R2-37a/b/c，最后 SUB-046 | 50–70 | story-budget、三份报告、视觉基线选择与各回执 | P11 | 全部 |

建议波次：第一波 P1、P3、P4 同起；P3 收尾后补 P7，P4 收尾后补 P9。第二波：P1、P3、P4 都合入后起 P2；P1 合入后起 P5；P4 合入后起 P6；P7 合入后起 P8；P1 合入后起 P10（三条并行上限内依次补位，文件集与在跑包不相交）。第三波 P11，第四波 P12，然后主线程跑 R2 末次全量 verify。每包派工前切只含本包 Subtask、通用约定与跨单契约的摘录文件。

SUB-046 在 R2 全部返工合入之后（含 P11 与 R2-36、R2-37）、R2 末次全量 verify 之前执行一次，不随单条返工重做；在它之前，第 30 步的视觉签名回归与回执不一致不计入任何 Story 的判定。

末次 verify 的跑法：逐步跑 30 步、遇红继续；复合步拆到子命令逐段记结果：`tokens:proof` 12 段（css-template-integrity、tokens-sync、demo-styles-sync、token-contrast 测试与门、token-deprecation-notice 测试、fonts-proof 测试与门、stamp-whitelist、shell-fidelity、token-extension、selection-grammar），`internal-alpha:proof` 4 段（contracts、browser-proof、scan、hardening）；未执行的段记「未执行」，不记绿。

R2 后的预期（不是承诺）：返工全部落地且没有新红时，121、122、123、124、125、126、128、132 可望转 done；120（GWT5）、127、129、130、131、133、134 仍卡在 O-1。待 R2 才能看到的未知项：tokens:proof 的五个子门、冒烟完整失败清单、hardening 证明。R3 起同一修复目标被退回：经济档项升主力、单独成包；主力档项再被退回即停下，写进收口文件交 Owner。
