# TCRN-DS-INIT-016 · R6 拆分

本文件是 R6 拆分子代理的产出：返工清单 `runs/r6/brief.md` 的 R6-1…R6-12（Owner 完整授权后的处置落地，纪要 `TCRN-DS-MIN-20261016-R6` D1–D8、`TCRN-DS-MIN-20261016-GATES` D1–D3）拆成 16 张 Subtask（TCRN-DS-SUB-229 至 244），各挂在受影响最直接的 Story 下，分 9 个包、5 个波次。照 brief 拆，不改处置；与集成树实测不一致处按「默认」先做（`problems/decomposition.md`）。Story 的 scope 是任务权威。包表与共享登记处见 `packages.md`；机读清单 `subtasks.json`；落链载荷 `subtasks-batch.json`（16 个 work-create 成员）。

读法：按节读。第 1 节跨包约定（C-1 至 C-20，改约定须回拆分）；第 2 节总览；第 3 节按 Story 列 Subtask，节标题 `#### TCRN-DS-SUB-NNN · 标题`。行号是集成分支 `claude/init016-tab-shell` HEAD 74b61fb 的位置，先 grep 再改。改动文件里的 `{a,b}` 表示同一目录下的几个文件。

节行号：§1 L9；§2 L32（2.1 L34、2.4 L69）；§3 L77；SUB-229 L239、230 L294、231 L257、232 L83、233 L145、234 L165、235 L208、236 L276、237 L223、238 L103、239 L125、240 L187、241 L313、242 L330、243 L341、244 L355。

## 1. 跨包约定（实施包必须遵守，改约定须回拆分）

1. **C-1 依据、沿用与作废。** 工作全部来自 brief；待裁项已全部裁定，R5 判断 §3.1 的默认作废（C-6）。R5 拆分第 1 节的 C-3、C-8 样式规则、C-10、C-12 已落地接口、C-13 交法、C-14 质量硬线、C-15 对齐方法、C-16 读数要求、C-17 继续有效；C-2、C-4、C-5、C-6、C-7、C-9、C-11 由本节同号改写；按 Q1、Q2 写的持有者与过渡红作废；经 R5 C-1 有效的 R4 至 R1 各条照旧。
2. **C-2 token。** 只有 SUB-232 改 token 值（`--tcrn-brand-suffix-tms` 加夜间值 #7aa0f5，不增键）、SUB-238 改 `shell-brand-w` 的释义（值不变）。改 `tokens.json` 的单同一提交用契约生成器重生五个生成物（`gplus-tokens.generated.ts`、`matrices.generated.ts`、`actions.pairs.ts`、`inputs.pairs.ts`、`typography.scale.ts`）。R6-5 不增 token（容器查询条件不能用自定义属性）。需要新键就停下。
3. **C-3 命令形态与红线。** 同 R5 C-3：局部门写成 `corepack pnpm@10.12.1 -C <包树> run <脚本>`、`… exec node <脚本>` 或 `… --filter <包名> <脚本>`；git 用 `git -C <包树>`；不 cd、不 rm（仓内删除用 `git rm`，临时产物移进会话 scratch 的 trash）；只写包树与会话 scratch；`--filter @tcrn/ui-react test` 前先 `run build`。不新增依赖，不改 `pnpm-lock.yaml` 与 `package.json`，不装浏览器。任何文件不得出现本机用户目录下凭据、钥匙串或应用数据目录的绝对路径，不得有以 KEY、TOKEN、SECRET、PASSWORD、SESSION、AUTH、API 结尾的名字（大小写都算）紧跟等号开头的行，不得写入 `scripts/no-private-input-scan.mjs` overclaim 表的英文短语。
4. **C-4 包树、合入与交回。** 包树 scratch `pkg/r6-<包名小写>`、分支 `claude/init016-r6-<包名小写>`，从上一波合入后的集成分支 HEAD 切出；主线程按波次合入，冲突交集成子代理。按 Subtask 提交，信息带键号；作者 tpmoonchefryan，不加 Co-Authored-By；不推送、不打 tag、不发版、不部署。交回 `runs/r6/handoff/<包>.md`：提交、选择与回显、「迁移条目」「目视项」「待发布清单」「待补五语键」「期望过期」「预期签名变化」（没有写无）、局部门读数（对照判据）、接续点；见红只记写 `runs/r6/problems/<包>.md`。只跑本包的门，不重复跑，不跑 verify。每包不超过 150 响应，逼近 180 时提交干净状态交回。
5. **C-5 见红只记与已知红。** 已知红是 R5 批末 verify 的第 13 步 contract:static 顶带 C8 15 条（SUB-229 消除）与第 18 步 geometry:measure 的 markText（SUB-230、231 消除）；同波别的包记「既有红，归 SUB-229（S1）」或「归 SUB-230（S2）」，其他不属本包的红记「既有红，归 SUB-NNN（<包>）」，不修。browser-proof 只量不应用，签名回归是预期过渡红（C-18）。写「DS 品牌首行」，不写「DS 侧栏首行」。
6. **C-6 Owner 裁定（R6 纪要 D1–D8）。** O-19 甲 → SUB-229；O-4 → SUB-230、231；O-8 与 S-6 的 TMS 色 → SUB-232；S-6 其余三处 → SUB-236；O-11 → SUB-234；O-1 → SUB-238、239；O-3 → SUB-233；O-6 → SUB-235；O-5 → SUB-237；O-9 → SUB-240；D8 维持现状的各项不改代码，SUB-242 写「现状与可改的方向」；O-14、O-20、O-2 的链上正文与注解，O-18、O-21 由主线程做。
7. **C-7 授权范围。** 授权内是 brief 列出的改动（含其中的门读法、`measure-shell.js`、板与生成器）。授权外：放宽阈值（±1、4.5、签名容差）；给别的家族或工具栏加豁免；新 token 键；改组件 props 与导出面；改 Story 文字；改批末 verify 组成；装 WebKit；新依赖与脚本；推送、发版、部署、发布画布；写链。
8. **C-8 样式模块。** 沿用 R4、R5：包样式只进现有模块（`shell.css.ts`、`shell-sheet.css.ts`、`base.css.ts`、`brand.css.ts`）；状态规则特异性不高于变体、不含颜色字面量；几何来自 token；`styles/index.ts` 不动；文档层样式只有 SUB-234 在其 ① 的默认情形下改 `alpha-styles.ts`。
9. **C-9 回执、基线与生成物。** `docs/verification/**`（回执、门报告、签名基线、选择与应用记录、scaffold 回执）只由 S9 提交；其余包跑完 `git -C <包树> checkout -- docs/verification`，新的未跟踪文件移进 trash；`visual-selection-result.json` 不入仓；`no-overclaim-scan.json` 由主线程最后再生。C-2 的五个生成物与生成器写出的板由改源的单同提交。
10. **C-10 文案与五语。** 本轮没有新五语文案（`shell-copy.ts`、两份 storybook 文本字典与 `locale-invariant-ledger.mjs` 无人改）；要新键时停下，写「待补五语键」。板与迁移说明不在此列。
11. **C-11 迁移说明与 CHANGELOG。** 只由 SUB-241 改，从 M54 起追加；开头区间、「By consumer」清单、「Open Owner decisions」、来源说明与 CHANGELOG 4.0.0 摘要按 R5 SUB-227 的范围放开；M1–M53 不动。各包写「迁移条目」。
12. **C-12 接口。** 不加导出、不改组件 props；容器宽与级联方向是组件内部；`brandProductId` 仍必填。
13. **C-13 目视与待发布。** `owner-acceptance.md` 由 SUB-242（W4）改写，SUB-244（W5）只填离群表与机器读数。待发布清单（改过的成品板、草案板与 `measure-shell.js`）交设计会话，本轮不发布画布。
14. **C-14 停下条件。** START「质量硬线」两段对每个包有效。遇到 C-7 授权外的事、要改本包文件集以外的文件、第一批五矩阵格数（44 / 28 / 10 / 116 / 42）会变、容器查询改了固定定位层的包含块或层叠且本包修不了，停下写问题，不扩大授权。批内新工作只记问题，进 R7。
15. **C-15 期望对齐。** 期望在本包文件集里的同单改，交回写明；不在的按 `packages.md`「期望对齐的接收」交下一个持有者，在「期望过期」逐条写文件、行、旧期望、新读数、来源单。读法、阈值、期望值不为求绿而改。
16. **C-16 一次做对与升档。** 判据最后一项「一次做对的验收」要给实测读数，不只说「门绿」；不符不得交回为完成。同一修复目标被退回一次：经济升主力；主力的下一轮仍主力，第二次退回交 Owner。
17. **C-17 前置列只写包号。** 包表「前置包」只写包号并逐个列出。
18. **C-18 预期签名变化。** 改渲染的单（SUB-231、232、234、238、240，及发现自己改了渲染的单）在交回逐条列 story、视口、主题、语言与原因，有 browser-proof 读数的写距离；S9 只收这张清单解释得了的变化。
19. **C-19 品牌资产只取通过稿。** 标、锁定块、字标、颜色、尺度只取 `logos2/*.svg` 与成品 Brand 板 E 段原样，派生只做取子集与居中；#7aa0f5 是 TMS 标的亮色（tms.palette.bright），经授权采用；不造 AOS 标，不借别的产品的标。
20. **C-20 板与生成器。** 板只经生成器改（`build-*.mjs` → `V2-*` → `make-standard.mjs`；`build-shell2.mjs` 直写壳板与草案）；`V2-GPlus.dc.html` 无生成器，SUB-236 直接改一行。make-standard 后没改源的成品板须逐字节不变。不新增带字母的板段（visual-proof 的 coverage 会红）；板高变了同步 `visual-standard/heights.json`、`canvas.json`（gplus `boards/canvas.json` 记了高度时同改）。

## 2. 总览

### 2.1 返工项 → Subtask

| 返工项 | Subtask | 包 / 波 | 档位 |
| --- | --- | --- | --- |
| R6-1 C8 顶带按板 | SUB-229 | S1 / W1 | 主力 |
| R6-2 markText 量法 | SUB-230、231（DS 首行仍 > 1 时居中） | S2 / W1 | 主力 |
| R6-3 夜间 TMS #7aa0f5 | SUB-232 | S2 / W1 | 主力 |
| R6-7 级联向左 | SUB-233 | S3 / W1 | 主力 |
| R6-5 容器查询 | SUB-234 | S4 / W2 | 主力 |
| R6-8 粗指针图钉常显 | SUB-235 | S5 / W2 | 经济 |
| R6-4 画板三处 | SUB-236 | S6 / W2 | 经济 |
| R6-9 Icon 板 pin 实心例外 | SUB-237 | S6 / W2 | 经济 |
| R6-6 标按钮随字标加宽 | SUB-238（样式、组件、门）、239（07b 长名屏） | S7 / W3 | 主力 |
| R6-10 AOS 示例无标 | SUB-240 | S7 / W3 | 主力（随包） |
| R6-11 文档与目视清单 | SUB-241（迁移、CHANGELOG、映射）、242（owner-acceptance） | S8 / W4 | 经济 |
| R6-12 签名重收与回执再生 | SUB-243、244 | S9 / W5 | 主力 |

### 2.2 Story → Subtask

136：SUB-232、238、239；139：SUB-233；140：SUB-234、240；142：SUB-235、237；143：SUB-229；145：SUB-231；148：SUB-236；149：SUB-230；150：SUB-241、242、243、244。其余 7 张本轮没有 Subtask，其判据由上列各单与批末 verify 满足。

### 2.3 依赖图

```
W1  S1: SUB-229
    S2: SUB-230 → SUB-231 → SUB-232
    S3: SUB-233
W2  S4: SUB-234
    S5: SUB-235
    S6: SUB-236 → SUB-237
W3  S7: SUB-238 → SUB-239 → SUB-240
W4  S8: SUB-241 → SUB-242
W5  S9: SUB-243 → SUB-244（最后一个包）
```

### 2.4 取舍与风险

- 取舍：R6-2 与 R6-3 同改壳层门文件，合成 S2；R6-7、R6-5、R6-6 同改 `shell.css.ts`，合计约 190 响应超上限，按 W1 → W2 → W3 排；R6-10 与 R6-6 同改 smoke 里同一个 ProductShell 比对，并入 S7；R6-4、R6-9 都跑 make-standard，合成 S6。
- 风险 1（SUB-234）：文档正文列最宽 1040，07a 桌面屏块可能窄于 1024，改后翻成窄屏、壳层门桌面读数消失；`container-type` 也可能改固定定位层的包含块。先量，处置见该单 ①③。
- 风险 2（SUB-238）：DS 若是长字标，文档站自己的壳每页变宽，签名大面积变化，S7 清单要列全。
- 风险 3（SUB-232）：契约连带五个生成物、07a B 段 66 格、两道门的 pending 与夹具，对照 `1f67057` 逐个核。
- 风险 4（SUB-240）：`brandProductId` 必填，判据给了两种不改 API 的写法，都不行就停下。

## 3. 按 Story 的 Subtask

### TCRN-DS-STORY-136 · 标按钮 ShellBrandButton

父单 work:73563c973ba4945683fbb15f

#### TCRN-DS-SUB-232 · 夜间 TMS 后缀改 #7aa0f5：token 夜间值、契约 tokens.json 与 matrices.json、生成物与测试，撤夜间 pending，07a B 段与 V2-B1-Brand 同改

- 承接：R6-3（纪要 D4：O-8 与 INIT-015 收口 S-6 的 TMS 色；主力；改共享契约）
- 包 / 波：S2 / W1（主力）；包内第 3 张
- 改动文件：`packages/ui-tokens/src/{tokens.css,index.ts,index.test.ts,gplus-tokens.generated.ts}`，`packages/ui-tokens/README.md`，`docs/design/gplus-2026-10/contract/{tokens.json,matrices.json}`，`apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts`，`packages/ui-react/src/styles/generated/{actions.pairs.ts,inputs.pairs.ts,typography.scale.ts}`，`apps/storybook/src/storybook.css`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`scripts/token-contrast-proof.mjs`，`tests/token-contrast-proof.test.mjs`，`scripts/shell-measure-proof.mjs`，`tests/shell-measure-proof.test.mjs`，`tests/fixtures/geometry-measure/shell/**`，`docs/design/gplus-2026-10/tools/{build-shell2.mjs,build-brand.mjs}`，`docs/design/gplus-2026-10/boards/{V2-B2-Shell-Draft2.dc.html,V2-B2-Shell-Draft2-b.dc.html,V2-B1-Brand.dc.html}`，`docs/design/visual-standard/boards/{Shell.dc.html,Shell-2.dc.html}`，`docs/design/visual-standard/{heights.json,canvas.json}`，`docs/design/gplus-2026-10/README.md`
- 依赖：无（包内排在 SUB-231 后：同改壳层门文件与 Navigation.test.tsx）
- 判据：136-GWT3（后缀对比度 ≥ 4.5；145-GWT3 文字由主线程改，问题 4）：① 以 `1f67057` 的 13 个文件为清单，反向恢复 `52faa47` 的做法并对齐其后的改动：`tokens.json` 第 109 行加 `night` #7aa0f5 与 `nightRef` `marks.json#tms.palette.bright`，note 写出处（纪要 D4、SHELL D7 建议值）；`tokens.css` 夜间块加覆盖；`storybook.css` 第 150 行一带、ui-tokens `index.ts`、`README.md` 第 66 行、`index.test.ts` 第 89–100 行同步。② `matrices.json` 夜间文字格 brand-suffix-n、brand-suffix-open-n、lk-em-n（第 309、312、336 行）ink 改 #7aa0f5（brand-mark-n 是标，不改）；重生五个生成物。③ `token-contrast-proof.mjs` 第 66–83 行夜间两条 pending 豁免撤去；`shell-measure-proof.mjs` 第 160 行 `pendingBelowMinimum` 去掉两格（留冻结空数组）、第 40 行说明同步；测试与夹具页两格同步。④ `Navigation.test.tsx` 第 827–832 行改夜间 #7aa0f5。⑤ 板：`build-shell2.mjs` 第 83–90、117 行后缀按主题取色、第 312、327 行改已裁，重生壳板与草案；`build-brand.mjs` 第 97、188 行一带夜间 TMS 写 #7aa0f5（DIFF-10），重生 V2-B1-Brand；板高变了同步。⑥ 一次做对的验收，交回读数：夜间后缀于纸、画布、3.5% 墨洗的对比度（≥ 4.5）；改动的矩阵格；单测、typecheck、tokens:proof、contract:proof（07a B 段差 0）、brand-asset:proof 退出 0；两道门无夜间 pending；剩下的 #2c63c8 每处是浅色或标；签名变化清单。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run brand-asset:proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
- 注意：`logos2/tms.svg`、`marks.json` 与成品 Brand 板不改（问题 3）；CHANGELOG、迁移说明、映射的夜间文字交 SUB-241；草案一不改。

#### TCRN-DS-SUB-238 · 标按钮宽度至少 134、随字标加宽，长字标不截断不加 title：样式、组件、brandGeometry、几何门与 smoke 的期望同包对齐，token 释义同步

- 承接：R6-6 前半（纪要 D5，O-1；主力；改顶带几何与门判定）
- 包 / 波：S7 / W3（主力）；包内第 1 张
- 改动文件：`packages/ui-react/src/styles/shell.css.ts`，`packages/ui-react/src/components/Navigation/{ShellBrandButton.tsx,ShellBrandButton.test.tsx}`，`scripts/{shell-measure-proof.mjs,geometry-proof.mjs,storybook-smoke.mjs}`，`tests/shell-measure-proof.test.mjs`，`tests/fixtures/geometry-measure/shell/**`，`docs/design/gplus-2026-10/contract/tokens.json`，`packages/ui-tokens/src/{index.ts,index.test.ts,gplus-tokens.generated.ts}`，`apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts`，`packages/ui-react/src/styles/generated/{actions.pairs.ts,inputs.pairs.ts,typography.scale.ts}`，`apps/storybook/src/build/foundation-visual-standards.ts`
- 依赖：TCRN-DS-SUB-234（样式、组件、几何门与 smoke，W2）；TCRN-DS-SUB-232（契约与生成物，W1）
- 判据：136-GWT1（TMS 顶带仍 134 × 40、left 12、top 6、中线 26）、145：① `shell.css.ts` 第 59 行 `inline-size: var(--tcrn-shell-brand-w)` 改为以它为最小宽、宽随内容；`ShellBrandButton.tsx` 的截断与 title 删去。② 长字标（O-1 要 117、格 60 的那一枚）标按钮宽 = 内容宽 > 134，与第一个固定项间距 8、不换行；短字标仍 134。③ 同包对齐：`ShellBrandButton.test.tsx` 第 114、141、214、227 行；`shell-measure-proof.mjs` 第 9、148 行 `tabWidthV2Px` 改「≥ 134 且 = 内容宽（±0.5）」，加变异「长字标压回 134」判红；`geometry-proof.mjs` 第 43、609 行；smoke 第 316–325 行 brandButton 宽。④ `tokens.json` 第 86 行 note 与 ui-tokens `index.ts` 第 236 行改「最小宽，随字标加宽」，值不变；重生五个生成物；`foundation-visual-standards.ts` 第 619 行注释同步。⑤ 接收 SUB-231 交来的标按钮 DS 首行居中（若有）。⑥ 一次做对的验收，交回读数：四枚产品与 DS 文档壳的标按钮宽（1440）、长字标格宽；变异读数；局部门全部退出 0；签名变化清单（DS 文档壳变宽动每页顶带，逐条）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run brand-asset:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
- 注意：token 值不改；字标与标取通过稿；高 40、top 6、left 12 不变。

#### TCRN-DS-SUB-239 · 07b 板补长名屏：长字标的标按钮随字标加宽，F 段 shell.brand-w 释义改最小宽

- 承接：R6-6 后半（纪要 D5，O-1；仓内 `Shell-2.dc.html` 与 `build-shell2.mjs`）
- 包 / 波：S7 / W3（主力）；包内第 2 张
- 改动文件：`docs/design/gplus-2026-10/tools/{build-shell2.mjs,shell-screen.mjs}`，`docs/design/gplus-2026-10/boards/{V2-B2-Shell-Draft2.dc.html,V2-B2-Shell-Draft2-b.dc.html,canvas.json}`，`docs/design/visual-standard/boards/{Shell.dc.html,Shell-2.dc.html}`，`docs/design/visual-standard/{heights.json,canvas.json}`，`tests/fixtures/geometry-measure/shell/manifest.json`
- 依赖：TCRN-DS-SUB-238（门接受随字标加宽）
- 判据：136、145、149-GWT4：① `build-shell2.mjs` 在 07b 现有段内加一屏：长字标产品的顶带（1240 宽，收起态），标与字标取通过稿原样，标按钮随字标加宽不截断，标注写实测宽；F 段 shell.brand-w 改「最小宽 134，随字标加宽」，第 357 行 meta 同步。② 不新增带字母的段；`shell-screen.mjs` 只在要新参数时改，其余四板 D 段输出逐字节不变。③ 重生两份成品壳板与两份草案；板高变了同步 heights / canvas；夹具清单把新屏加进 `--fixtures`。④ 一次做对的验收，交回读数：新屏标按钮宽、与第一个固定项间距 8、中线 26，measure-shell.js 与门库读数相同（±0.5）；shell-measure 测试与 `--fixtures` 退出 0；contract:proof（07a B 段不变）与 storybook:visual-proof 退出 0；板高。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/shell-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs --fixtures`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
- 注意：07a 的屏不改；两份壳板进「待发布清单」。

### TCRN-DS-STORY-139 · 固定二级菜单下拉 ShellDropdown

父单 work:09e0986c769bddf72859897f

#### TCRN-DS-SUB-233 · 级联越过视口右缘时向左展开：第三、四级列放到第一列左侧，补 DOM 用例

- 承接：R6-7（纪要 D5，O-3；主力）
- 包 / 波：S3 / W1（主力）；包内第 1 张
- 改动文件：`packages/ui-react/src/components/Navigation/{ShellDropdown.tsx,ShellDropdown.test.tsx}`，`packages/ui-react/src/test/shell-dropdown.dom.spec.tsx`，`packages/ui-react/src/styles/shell.css.ts`（只改第 664 行起的下拉段）
- 依赖：无
- 判据：139（不越界时 GWT1–5 不变）：① `ShellDropdown.tsx` 定位（第 156–185、232–276 行一带）在已开级联的右缘超出视口右缘时，级联列改在第一列左侧：间距 4、宽 240、高 = 左列高；不越界时逐像素不变。② 样式只在下拉段用属性选择器（如 `[data-cascade-side="start"]`）改列序，不含颜色，值来自 token。③ ← 回上一列同一行、Esc 全关焦点回固定项、aria-owns 都不随方向变。④ DOM 用例：固定项靠视口右缘时第二列右缘 = 第一列左缘 − 4、整列在视口内；不越界用例仍是左缘 = 第一列右缘 + 4；单测补方向属性。⑤ 一次做对的验收，交回读数：两个 DOM 用例的几何读数；ui-react 单测、test:dom、typecheck 退出 0；geometry:measure 的级联门读数与改前相同。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
- 注意：完整菜单的级联不改；props 与导出不改；`shell.css.ts` 只动下拉段。

### TCRN-DS-STORY-140 · ProductShell 顶带态

父单 work:e14a7f089a9cac4c7da39d52

#### TCRN-DS-SUB-234 · 窄屏按壳的容器宽切换（容器查询，阈值 1024；Sheet 的 760 同理）：标按钮版本、固定项与完整菜单的固定分组跟壳宽走，补 1023 的门读数

- 承接：R6-5（纪要 D5，O-11；主力）
- 包 / 波：S4 / W2（主力）；包内第 1 张
- 改动文件：`packages/ui-react/src/styles/{shell.css.ts,shell-sheet.css.ts}`，`packages/ui-react/src/components/Navigation/{ShellBrandButton.tsx,ShellBrandButton.test.tsx,ShellMenu.tsx,ShellMenu.test.tsx,ShellPins.tsx,Navigation.tsx}`，`packages/ui-react/src/test/shell-menu.dom.spec.tsx`，`scripts/{geometry-proof.mjs,storybook-smoke.mjs,shell-measure-proof.mjs,shell-parity-proof.mjs,ds-consumption-proof.mjs}`，`scripts/lib/shell-measure.mjs`，`tests/shell-measure-proof.test.mjs`，`tests/fixtures/geometry-measure/shell/**`，`apps/storybook/src/contract-stories/story-content.tsx`，`apps/storybook/src/build/{shell-hydrate.tsx,page-template.tsx}`，`apps/storybook/src/alpha-styles.ts`
- 依赖：TCRN-DS-SUB-230、TCRN-DS-SUB-232（壳层门文件，W1）；TCRN-DS-SUB-233（shell.css.ts，W1）
- 判据：140、144、149：① 先量（一次性探针）：1440 与 1024 视口下各壳 story、五样板与文档页内嵌壳的块宽，列出改后翻成窄屏的块；07a A 段桌面屏块在 1440 下 < 1024 时，默认定宽 1240 并让故事栈横向可滚（问题 7）。② 壳根声明查询容器（inline-size，容器名带 tcrn 前缀）；`shell.css.ts` 第 141、263、649 行改容器查询，阈值不变；`ShellBrandButton.tsx` 第 35–70 行与 `ShellMenu.tsx` 第 476–504 行改读壳的容器宽（显式 `version`、`presentation` 仍优先）；Sheet 的 760 同样按壳宽（问题 6）；首帧不闪烁。③ 完整菜单、下拉、Sheet、遮罩的包含块与层叠不变，下拉 `fixedLayerOrigin` 读数前后相同，做不到就停下。④ 1023 门读数：`geometry-proof.mjs` 第 403–460 行一带加两条：视口 1440 下 1023 宽的壳（shell-narrow 的框）读出窄屏（标按钮第一版、固定项 0、菜单含固定分组），1024 宽读出宽屏，各配会红的变异；独立页 1023 / 1024 读数不变。⑤ 同包对齐：geometry-proof 窄屏说明、smoke 第 3140 行 `isDesktopViewport`、壳层门对 `ts-narrow-l`、`ts-narrow-x-l`（夹具清单第 74–76 行）的期望、`story-content.tsx` 第 606–608 行等说明、shell:parity 与 ds-consumption 的 1024 读法。⑥ 一次做对的验收，交回读数：①的块宽表；③的固定层读数；④两条读数与变异；局部门全部退出 0；签名变化清单。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run shell:parity`
  - `corepack pnpm@10.12.1 -C <包树> run ds:consumption:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
- 注意：不增 token；不改 props；不重收签名。

#### TCRN-DS-SUB-240 · AOS 示例不带产品标：撤 design-system 标的借用（G-2），不造 AOS 标

- 承接：R6-10（纪要 D6，O-9；brief 建议经济，随 S7 主力）
- 包 / 波：S7 / W3（主力）；包内第 3 张
- 改动文件：`apps/storybook/src/contract-stories/story-content.tsx`，`apps/storybook/src/contract-stories/visual-instances/{aos-frontend-shell-slice.tsx,aos-owner-quality-product-shell.tsx}`，`scripts/{storybook-smoke.mjs,shell-parity-proof.mjs}`
- 依赖：TCRN-DS-SUB-238（同改 smoke 的 navigation-product-shell-spec 比对）
- 判据：140、145：① 三处借用（`story-content.tsx` 第 2305–2324 行的 `data-brand-placeholder*` 与 `brandProductId="design-system"`；两个视觉实例第 159、175 行一带）改为不带产品标的写法，取改动最小的一种；`brandProductId` 在 `Navigation.tsx` 第 1949 行必填，不改 prop 面。按先后：(a) 现有 props 能渲染不带标的标按钮就用它；(b) 两个 AOS 视觉实例不套顶带，只留页内内容与 AOS 产品名；`navigation-product-shell-spec` 是包的契约证明、不是 AOS 示例，去掉 AOS 名与占位属性，按 Design System 自己的标与名称渲染。交回写明取舍。② 不造、不借任何产品的标；`tcrn-aos-two-line` 一类声明保留或删去写明理由。③ smoke 第 1065–1080 行 O-9 段改为新写法的断言；shell:parity 读的 locale 菜单仍在。④ 一次做对的验收，交回读数：三处改后的 DOM 摘要（`data-product-mark` 计数）；storybook:smoke、shell:parity、contract:static、brand-asset:proof 退出 0；签名变化清单（C-18）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run shell:parity`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run brand-asset:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
- 注意：要改 prop 面或新五语文案时停下；「待品牌板补 AOS 标」由 SUB-242 写。

### TCRN-DS-STORY-142 · NavItem 图钉

父单 work:27344937d9f099034b0c773e

#### TCRN-DS-SUB-235 · 粗指针下未固定的图钉常显 ink-3

- 承接：R6-8（纪要 D5，O-6；经济）
- 包 / 波：S5 / W2（经济）；包内第 1 张
- 改动文件：`packages/ui-react/src/styles/base.css.ts`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`
- 依赖：无（Navigation.test.tsx 在 W1 改过，从合入后的 HEAD 切出）
- 判据：142（GWT1、GWT4 不变）：① `base.css.ts` 第 481–486 行 `@media (pointer: coarse)` 块加：`aria-pressed` 不为 true 的 `.tcrn-nav-pin` 常显（opacity 1），颜色取 ink-3 的现有 token 或图钉对的现有变量；已固定、hover、获焦规则不动；特异性不高于第 476–478 行，不含颜色字面量。② 细指针静止态照旧不显。③ `Navigation.test.tsx` 补断言并做变异（去掉媒体条件时判红，复原，不提交）。④ 一次性探针（Playwright `hasTouch` 与 `isMobile`）：菜单或 Sheet 里未固定图钉计算 opacity 1、color = ink-3（浅、夜各一）；细指针 opacity 0；rest 与 hover 文字盒宽相等。⑤ 一次做对的验收，交回读数：③的用例、变异与通过；④的计算样式；ui-react 单测、typecheck、contract:proof 退出 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
- 注意：图钉占位与热区、顶带 ShellPins 不改；browser-proof 是细指针，C-18 预计写无。

#### TCRN-DS-SUB-237 · Icon 板「禁填充」对 pin 加实心态例外并补画实心态

- 承接：R6-9（纪要 D6，O-5；经济）
- 包 / 波：S6 / W2（经济）；包内第 2 张
- 改动文件：`docs/design/gplus-2026-10/tools/build-icon.mjs`，`docs/design/gplus-2026-10/boards/{V2-B1-Icon.dc.html,canvas.json}`，`docs/design/visual-standard/boards/Icon.dc.html`，`docs/design/visual-standard/{heights.json,canvas.json}`
- 依赖：TCRN-DS-SUB-236（同包，make-standard 与板高先后）
- 判据：142-GWT3、148：① `build-icon.mjs` 第 107、111 行规则（不用填充；禁止填充色块）加一句例外：pin 的固定态是实心（`icons.json` 的描边与实心两态），只此一例；第 77 行名册块或相邻块补画 pin 两态并列，取包内名册同一路径。② 名册仍 38，Icon 矩阵格数不变。③ 重生 V2-B1-Icon 与成品 Icon.dc.html（逐字节要求同 SUB-236 ③）；板高变了同步。④ 一次做对的验收，交回读数：diff 摘要；contract:proof 与 storybook:visual-proof 退出 0；板高。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
- 注意：`icons.json` 与包内图标不改；两块 Icon 板进「待发布清单」。

### TCRN-DS-STORY-143 · 导航家族焕新

父单 work:1b03f6ae2b1a9e080fde1432

#### TCRN-DS-SUB-229 · 顶带按板（O-19 甲）：roles.json 顶带登记加 yieldMinWidth 与 yieldOptional，contract-static 的 C8 两层只对带字段的登记跳过两项，clauses.md 写明，两条自检

- 承接：R6-1（纪要 D2，O-19 甲；主力；改门判定语义）；依据 R3 判断 §3.1.1；SUB-191 登记的续做
- 包 / 波：S1 / W1（主力）；包内第 1 张
- 改动文件：`docs/contract/{roles.json,clauses.md,README.md}`，`scripts/contract-static-proof.mjs`，`tests/contract-static-proof.test.mjs`
- 依赖：无
- 判据：135-GWT4、143 符合性 C1–C17、149-GWT2：① `roles.json` 第 16 行顶带一项加 `"yieldMinWidth": "zero-by-board"`、`"yieldOptional": true` 与出处字段（默认名 `yieldBoardRule`：07a `.ts-pins` 的 `min-width:0`；没有固定项的壳不渲染让步项）；容器、让步项、固定项不动；第 3 行 description 补两字段含义。② `contract-static-proof.mjs`：`checkC8`（第 644 行起）对 `yieldMinWidth === "zero-by-board"` 不报 `C8.yield-without-min-width`（第 660–661 行）；`checkC8Story`（第 920 行起）对 `yieldOptional === true` 不报 `C8.story-yield-missing`（第 936 行）；值不是这两个字面值按没带字段照判；其余 C8 规则照旧；文件头第 7–10、27–30 行注释写明。③ `clauses.md` C8 节（第 104–121 行）补「板定让步」一段；`README.md` 列了 toolbars 字段时同补。④ 测试：第 579–584 行 deepEqual 改含两字段；自检：夹具登记带两字段两条发现都不出（绿），去掉都出（红）；带字段的登记固定项去掉 flex-shrink 0 仍出 `C8.fixed-item-shrinks`。⑤ 一次做对的验收，交回读数：contract:static 测试条数与通过、全部条款发现 0；去字段变异的 C8 发现数（预期 15：静态 1、story 层 14）与复原后的 0；contract:proof 退出 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
- 注意：不撤登记；不给别的工具栏加豁免；壳的样式与组件不改。

### TCRN-DS-STORY-145 · ProductLockup 首行变体

父单 work:f19ca0b68e52842e947dcafc

#### TCRN-DS-SUB-231 · DS 品牌首行与标垂直居中到 ±1（SUB-230 改量法后仍 > 1 时）：首行文字在布局上与标居中，品牌资产不改

- 承接：R6-2 后半（纪要 D3：改后 DS 仍大于 1 时布局居中；主力）
- 包 / 波：S2 / W1（主力）；包内第 2 张
- 改动文件：`packages/ui-react/src/styles/brand.css.ts`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`
- 依赖：TCRN-DS-SUB-230（新量法读数）
- 判据：145-GWT2、138 硬线：① SUB-230 后 `lkr-line@22:design-system` 新读数 ≤ 1：不改代码，交回写读数与「不需改」即完成。② > 1：只在 `brand.css.ts` 首行变体（ProductLockup `firstLine="rail"` 的承载类）调首行文字与标的垂直对齐（对齐方式或现有 token 的位移），四枚产品同一规则；标、字标、字号字重、颜色、尺度不改；「字标加 padding-top 4」变异仍判红；改了就在 `Navigation.test.tsx` 补断言。③ 唯一可行的改法在标按钮（`shell.css.ts`，本波归 S3）时不改，写「期望过期」交 SUB-238。④ 一次做对的验收，交回读数：四枚产品首行（22 与 44、en 与 zh-CN）markText 全部 ≤ 1；brand-asset:proof、ui-react 单测退出 0；geometry:measure 的 markText 判过。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run brand-asset:proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
- 注意：不增 token；改了布局按 C-18 列签名变化。

### TCRN-DS-STORY-148 · 第一批五样板换新壳

父单 work:bad748579e7b1b7f0773bd53

#### TCRN-DS-SUB-236 · 画板修订（S-6 其余三处）：Inputs 板补只读获焦 rf 一行、快捷键 ink-3 改 ink-2，底盘板 kv「侧栏 212 · 顶栏 48」改 220 / 52

- 承接：R6-4（纪要 D4，S-6 其余三处；经济）
- 包 / 波：S6 / W2（经济）；包内第 1 张
- 改动文件：`docs/design/gplus-2026-10/tools/build-inputs.mjs`，`docs/design/gplus-2026-10/boards/{V2-B1-Inputs.dc.html,V2-GPlus.dc.html,canvas.json}`，`docs/design/visual-standard/boards/Inputs.dc.html`，`docs/design/visual-standard/{heights.json,canvas.json}`
- 依赖：无
- 判据：148（板）、150（待发布清单）：① `build-inputs.mjs` 状态样片（第 122–129 行）在 readonly 后加「readonly + focus」（第 110 行加 `is-ro is-focus`；CSS 第 15 行后加一条：留 r 的底与字色、边换 f 的环，同 `pairs.json` 的 rf）；不加 data-cell（148-GWT4 格数不变）；第 172 行块标题状态数同步。② 第 26 行 `.sw>kbd` 的 `var(--ink-3)` 改 `var(--ink-2)`，第 178 行块说明写了颜色时同步。③ 重生 V2-B1-Inputs，跑 make-standard 生成成品 Inputs.dc.html；其余成品板须逐字节不变，变了就还原并记问题。④ DIFF-3：`V2-GPlus.dc.html` 第 300 行 kv 的「侧栏 212」「顶栏 48」改「侧栏 220」「顶栏 52」（无生成器，直接改；成品 Tokens 板与 `build-tokens.mjs` 没有这句，问题 2）。⑤ 板高变了同步。⑥ 一次做对的验收，交回读数：rf 样片计算边（同 f 的环）与 kbd 计算色（ink-2，两主题）；diff 摘要；「侧栏 212」只剩 V2-Rejections 与派工、映射文字；两道门退出 0；板高。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
- 注意：映射 DIFF-3 交 SUB-241；`pairs.json` 不改；三块板进「待发布清单」。

### TCRN-DS-STORY-149 · 壳层门

父单 work:854cd021e8bb869b2b585fe0

#### TCRN-DS-SUB-230 · markText 量法改为首行大写顶到基线的中线、两行锁定块只量首行：门库与 measure-shell.js 同改，补夹具与变异

- 承接：R6-2 前半（纪要 D3，O-4；主力；改门判定语义）
- 包 / 波：S2 / W1（主力）；包内第 1 张
- 改动文件：`scripts/lib/shell-measure.mjs`，`docs/design/gplus-2026-10/measure-shell.js`，`scripts/shell-measure-proof.mjs`，`tests/shell-measure-proof.test.mjs`，`tests/fixtures/geometry-measure/shell/**`
- 依赖：无
- 判据：149-GWT1、GWT4，145-GWT2，146「几何门全绿」，138 硬线：① 门库 `inkOf` 与 optical（`scripts/lib/shell-measure.mjs` 第 623–625 行）与 `measure-shell.js`（第 75–79 行）同改：文字中线 =（首行大写顶 + 首行基线）/ 2，不再取含下行字母的墨迹底；带 `small` 的两行锁定块只量首行 `b`；阈值 ±1（`shell-measure-proof.mjs` 第 155 行）与 expect 读法不变；两份脚本注释与第 27 行起的 markText 说明同步。② 测试第 274 行 149-GWT4 同屏读数仍相同（±0.5）。③ `word-padding-top-4`、`story-word-padding-top-4`（`mutations.json` 第 34、123 行）仍判红；新增：首行含下行字母而大写顶到基线居中时判绿；两行锁定块第二行下移 4 判绿、首行下移 2 判红；夹具清单 green 列表照实。④ 一次做对的验收，交回读数：真件 markText 改前改后对照（至少 `lkr-line@22:design-system` en 与 zh-CN、`lkr@22:tms` en、`ts-x-l`、`ts-x-n`、`ts-search-l`、`ts-narrow-x-l`、shell-matrix 两格）；测试与 `--fixtures` 退出 0；markText 状态（DS 品牌首行仍 > 1 交 SUB-231）；变异读数。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/shell-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs --fixtures`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
- 注意：不放宽 ±1、不改 expect、不加豁免；`measure-shell.js` 进「待发布清单」，它在 `docs/design/gplus-2026-10/` 下（问题 1）。

### TCRN-DS-STORY-150 · 4.0.0 候选

父单 work:b140305693da159bfdc615c8

#### TCRN-DS-SUB-241 · 文档跟上 R6：迁移说明从 M54 起追加，开头区间、分消费方清单、Open Owner decisions、来源说明与 CHANGELOG 4.0.0 摘要同步，storybook-map 跟上 R6 处置

- 承接：R6-11 前半（纪要 D1、D7；经济）；接收 W1–W3 各包的「迁移条目」与「期望过期」
- 包 / 波：S8 / W4（经济）；包内第 1 张
- 改动文件：`docs/migration-4.0.md`，`CHANGELOG.md`，`docs/design/gplus-2026-10/{storybook-map.json,storybook-map.md,README.md}`，`packages/ui-react/README.md`
- 依赖：TCRN-DS-SUB-229 至 TCRN-DS-SUB-240（W1–W3 全部合入与交回）
- 判据：150-GWT2、143-GWT1：① 迁移说明从 M54 起追加至少八条（带来源单与提交）：C8 两字段、markText 量法（含 231 的布局）、夜间 TMS #7aa0f5、窄屏按容器宽、标按钮最小宽随字标、级联向左、粗指针图钉常显、AOS 示例无标；第 7、26 行区间「M20 to M53」改到最后一条；「By consumer」三份清单（第 34 行起）补条目号；「Open Owner decisions」（第 1526 行起）删已裁项、写裁定出处；末尾来源说明照 R5 写法追加一条；M1–M53 正文不动。② CHANGELOG 4.0.0 段：迁移摘要（第 59–64 行一带）补 M54 起各条一句；第 75、124、326–328 行夜间同色与待裁文字改已裁。③ 映射 json 与 md 同改：DIFF-3、DIFF-10 的 status 写板已改；SHELL-D7、O-3 的夜间待裁说明改已裁；受 R6 影响的其他行照交回同步；映射仍 23 / 23。两份 README 只在写了按视口切换、标按钮定宽或旧量法时改。④ 一次做对的验收，交回读数：新增条目号与标题表；区间、清单、来源说明的新行号；三处文件里剩下的「D7」「待裁」「pending」每处写明为何保留；scaffold:proof、readme:proof、public-output:scan、internal-vocab:scan、storybook:visual-proof 退出 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run scaffold:proof`
  - `corepack pnpm@10.12.1 -C <包树> run readme:proof`
  - `corepack pnpm@10.12.1 -C <包树> run public-output:scan`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
- 注意：不写没落地的改动；scaffold 回执按 C-9 还原。

#### TCRN-DS-SUB-242 · owner-acceptance 改写成一份可一次看完的完整清单：本轮目视项、维持现状项、待发布成品板全表、三道门与 28 张 Story 的状态

- 承接：R6-11 后半（纪要 D1、D8；经济）
- 包 / 波：S8 / W4（经济）；包内第 2 张
- 改动文件：`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`
- 依赖：TCRN-DS-SUB-241（条目号）；W1–W3 各包的「目视项」与「待发布清单」
- 判据：150-GWT3（每板一节，不含构图一与侧栏项）：① 重写成一次看完的结构：怎么看与机器证据入口；八块成品板各一节（沿用第 35–211 行板序）写要看的项与 story；「第六轮新增与变化的目视项」按各包交回逐条（含「待品牌板补 AOS 标」）；D8 维持现状的各项写「现状与可改的方向」（问题 8）；待发布成品板全表（INIT-016 改过的四块与本轮的板、草案、`measure-shell.js`）；三道门（verify、storybook-build、test-dom）与 28 张 Story（INIT-016 16 张、INIT-015 12 张）的状态表，批末才知道的写「待批末」；已知差距与停点。② 第三至五轮的目视节并入各板节或「历次目视项」，条目不丢。③ 留「第六轮视觉签名离群」表头给 SUB-244。④ 一次做对的验收，交回读数：节目录与行号；带过来的条目数与新增条目数（分类）；「构图一」与侧栏项（「侧栏尺度」除外）grep 计数 0；scan 退出 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run scan`
- 注意：不代 Owner 判断；读数只引交回；体积不超过现在的 1.5 倍。

#### TCRN-DS-SUB-243 · 视觉签名批末重收：只收预期内的变化，逐条写理由与离群类别，预期外停下记问题

- 承接：R6-12 前半（批量原则第 4 条；主力）；做法照 `runs/r4/handoff/N5.md` 第 2 节（SUB-224）
- 包 / 波：S9 / W5（主力）；包内第 1 张
- 改动文件：`docs/verification/internal-alpha/{visual-signature-baseline.json,visual-baseline-selection-r6.json,visual-selection-application.json,visual-selection-application-init016-r4.json}`，`docs/verification/internal-alpha/**`
- 依赖：TCRN-DS-SUB-242（W1–W4 全部合入）
- 判据：147、149-GWT2、150：① 同一构建上先跑 browser-proof，nonVisualProofOk 为真；每条回归与各包「预期签名变化」（C-18）同键对照分来源，分不进来源或预期外的停下记问题、不收。② 按 KB-022 用 `git mv` 把现行应用记录改名为 `visual-selection-application-init016-r4.json` 单独提交；选择文件 `visual-baseline-selection-r6.json` 只收预期内条目，每条带来源单、理由与 `outlierClass`（K12 的 A–D 与 maxCell > 40 口径）；`--update-visual-baseline` 应用后再跑一次：退出 0、回归 0、新增 0。③ 一次做对的验收，交回读数：重收条数与按来源分布；离群表（story@视口、类别、理由）；基线 sha256 前后；六份回执字节（都 < 1,000,000）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-browser-proof.mjs --update-visual-baseline docs/verification/internal-alpha/visual-baseline-selection-r6.json`
- 注意：阈值、算法与选择机制不改；`visual-selection-result.json` 不入仓。

#### TCRN-DS-SUB-244 · 回执与门报告一次再生（含 scaffold-proof.json），目视清单填离群表与机器读数

- 承接：R6-12 后半（批量原则第 4 条；主力）
- 包 / 波：S9 / W5（主力）；包内第 2 张
- 改动文件：`docs/verification/**`，`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`（只填离群节与机器证据读数）
- 依赖：TCRN-DS-SUB-243
- 判据：147、149、150：① 同一构建上一次再生：geometry-measure 与 shell-measure 报告、映射报告（各加 `--write-report`）、internal-alpha 契约与 API 清单、hardening、scaffold 两份回执；只提交读数或判定有实质变化的文件，只差时间、时长、运行标识的照惯例还原。② geometry:measure 全绿（18 门，markText 与 contrast 过、pending 空）；映射 23 / 23；contract:static 发现 0；回执都 < 1,000,000 字节。③ owner-acceptance 只填离群表与「机器证据入口」读数。④ 一次做对的验收，交回读数：逐门退出码；提交的回执与变化字段；回执字节；`no-overclaim-scan.json` 未提交。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/geometry-measure-proof.mjs --write-report`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs --write-report`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/storybook-visual-proof.mjs --write-report`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:contracts`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-hardening-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run scaffold:proof`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run pack:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run scan`
- 注意：不跑 verify；不改门与期望。
