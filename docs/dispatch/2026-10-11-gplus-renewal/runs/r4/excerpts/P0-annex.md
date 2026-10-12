# 附件 · R4 P0 的 R3 约定与判断条目

## R3 跨包约定（runs/r3/decomposition.md 第 1 节，继续有效）

1. **沿用 R2。** `runs/r2/decomposition.md` 第 1 节（第 7–21 行）12 条继续有效（其第 1 条又沿用 R1 第 1 节 13 条）；与下列条目冲突时以本节为准。R2 第 8、9 条里的 `runs/r2/` 换成 `runs/r3/`，提交信息带 TCRN-DS-SUB-NNN 与来源返工号（如 R3-1）。
2. **包号与交回。** 包号写 P0–P5；每包交回 `runs/r3/handoff/<包号>.md`（提交列表、判断 §3.3 回显项、局部门结果摘要、接续点）与 `runs/r3/problems/<包号>.md`（见红只记，同一根因算一条）。
3. **授权边界。** 只做判断 §2 写明的改法，以及本拆分在 §2.1 写明的补充；判断 §3.3 的 12 条 B 类裁定照做；§3.4 各项、O-1…O-12 的「Owner 更正时」改法与 A 类事项不做。新增第 5 个壳层 token、改 Navigation 家族的结构、API 或状态行为、给 TopBar 加导航 API、改门的比对字段或阈值语义（O-1 直接后果的旧几何期望值除外，判断 §3.3 第 6 条）都属越级，停下写进包问题文件。
4. **旧壳几何期望的流转（O-1）。** P1 跑完 SUB-090 列的门后，把因旧几何（280、92、68、洗底、右边线）转红的期望逐条写进 `problems/P1.md`，每条标持有包：`scripts/storybook-smoke.mjs`、`scripts/full-surface-remediation-proof.mjs`、`scripts/internal-alpha-browser-proof.mjs` 归 P2（SUB-098、SUB-099）；`scripts/geometry-proof.mjs`、`scripts/shell-parity-proof.mjs`、文档样式源与 `foundation-visual-standards.ts` 归 P3（SUB-100、SUB-101）。P2、P3 的派工摘录附 `problems/P1.md`。P3 发现 P2 持有的门文件里钉着旧文档壳几何的字面期望时只记 `problems/P3.md`，不改，交 R3 判断。
5. **文件持有（相对判断 §5.1 的变化）。** `apps/storybook/src/smoke.test.ts` 本轮只归 P0（SUB-092 的注册断言）；P2、P3 不改它，需要改时记问题文件。词条文件 `storybook-content-text.ts` 先归 P0，P3（SUB-101）与 P4（SUB-103）只在条件成立时改，且都在 P0 合入之后。其余照判断 §5.1：`storybook-smoke.mjs`、`internal-alpha-browser-proof.mjs`、`storybook-map.json` 只归 P2；`geometry-proof.mjs`、`shell-fidelity-proof.mjs`、`doc-class-map.json` 与文档样式源只归 P3；契约、生成器与生成物只归 P1。
6. **回执与报告。** 沿用 R2 第 6 条，指定者换成 R3：`docs/verification/storybook-visual-proof/**` 只由 SUB-076 写，`docs/verification/geometry-measure/**` 只由 SUB-078 写，`docs/verification/doc-shell-class/**`、internal-alpha、hardening、scaffold、readme 回执只由 SUB-046 写。其它包跑了会写这些路径的门，跑完用 `git -C <包树> checkout -- <路径>` 还原，新出现的未跟踪文件 mv 进会话 scratch 的 trash。
7. **自检代替新测试文件。** 仓内没有 storybook-smoke、internal-alpha-browser-proof、geometry-proof、shell-fidelity-proof 的单测文件。判断写「单测」或「正反用例」的四处（SUB-098、SUB-099、SUB-089、SUB-102）写成脚本内自检，或沿用该脚本已有的 baseline、broken、restored 变异写法，随门本身运行；不新增测试文件、不改 `package.json` 与 verify 链（同 R2 §2.1 第 5 条）。
8. **生成物头部。** 沿用 R2 第 7 条。R3 只有 P1 改契约：`tokens.json` 一改，actions.pairs、inputs.pairs、typography.scale、matrices.generated、gplus-tokens.generated 五个头的 contract-sha256 同变，都归 P1；product-marks.generated 只覆盖 marks.json，不变。
9. **停下与退回。** 主力项再退回即停下，写进收口文件交 Owner（判断 §2 开头；SUB-091、SUB-100 已标）。SUB-090、SUB-092 另有停下条件，见各单。停下的单在交回写明，转态归主线程。
10. **额度。** 本周额度所剩不多；触顶即按 `runs/state.md` 停在原地等重置，不为此改方法（判断 §5.2 末段）。各包只跑包表列出的局部门，同一门不为求稳重复跑。
11. **链上。** SUB-080 保持 active，由 SUB-100 承接；SUB-046、SUB-076、SUB-078 保持 active，R3 末由 P4 重做；本拆分只新建 19 张，不改这四张的链上记录（判断 §3.3 第 10 条）。

## R3 判断 §2 中本包对应的返工条目（runs/r3/judgment.md）

**R4-1 · gplus-samples 类目说明改为同时覆盖构图一五个样板与构图三（SUB-107，挂 130）**
- 来源：C3-2；R3M2 记 P0「授权外未做：类目说明过时」。
- 现象：`apps/storybook/src/contract-stories/governance.ts:61` 的说明是「The first five component families in a composition-one product shell, light and night.」；构图三（无侧栏、顶部导航）登记在同一类目，说明对它不成立。词条在 `apps/storybook/src/build/locales/storybook-content-text.ts:2054`。
- 改法：改写这一条说明，覆盖构图一的五个样板与构图三的顶部导航页；旧键整条换成新英文键，zh-CN、ja、ko、fr 四语值同步改写，四语值不与同语言里其它词条同值（运行时按当前文字反查原文，同值会串键，见验收 A §5）；不带工单键与轮次。
- 改动文件：上述两处（只改该说明与其词条）。
- 档位：经济——文案，判定不变；R2 未改过同一目标。
- 依赖与并行：无依赖；与 R4-4 同改词条文件，同包内排在它前面。
- 探查补充：类目说明只渲染在文档导航的 sr-only 文本里（`apps/storybook/src/build/page-template.tsx:385`、`:548`），预计不改任何视觉签名。

**R4-2 · 契约 README 的几何门与映射门两节按门现状改写，映射报告标签去掉写死的「八项」（SUB-108，挂 133）**
- 来源：C3-1。
- 现象：`docs/contract/README.md` 几何门一节写九项检查、STORY_PROBES 三条、STORY_MUTATIONS 四条、测试 60 条，阈值表没有 shellFrame；映射门一节写九项检查、ROW_MUTATIONS 九条。门现状为十项检查、四个探针（含 R2 的 iconStroke）、六条故事变异、十条行变异、测试 68（18 log:73、7024–7138；19 log:3982 起）。生成的 `gplus-map-report.md` 第 9 行「八项测量」后面列了九个名字，来自 `scripts/storybook-visual-proof.mjs:491` 的标签。
- 改法：两节按门现状改，数字从门源码现读，测试条数不写死或写现值；阈值表加 shellFrame 一行（ProductShell 根内纸面离壳上、尾、下三边 12，壳顶栏 52，容差 0.5，起始边贴侧栏不量）。`:491` 只把「八项测量」改成不带数字的说法；JSON 字段 `eightMeasurements` 与常量 `EIGHT_MEASUREMENTS` 不改名。报告由 R4-6 再生，不手改。
- 改动文件：`docs/contract/README.md`；`scripts/storybook-visual-proof.mjs`（只第 491 行）。
- 档位：经济——文档与报告标签，门的判定不变；第一次返工（R2 的 C2-6 改的是 style-scale.md，R3 的 SUB-096 只改 README 第 47、68 行一带）。
- 依赖：无；R4-6 依赖它。探查：仓里只有 `storybook-visual-proof.mjs:373`、`:491` 出现 eightMeasurements 与该标签，tests 没有钉它。

**R4-3 · 删掉译文债台账里两条已翻译的条目（SUB-109，挂 134）**
- 来源：A3-1；R3M2；P0 问题 7。
- 现象：`scripts/lib/locale-invariant-ledger.mjs` 的 translationDebtAllowlist 仍列 documents-and-collaboration-density-spec 下的「Document publishing is not wired in this static DS fixture」（:206）与 records-and-boards-backlog-spec 下的「Add record placeholder」（:273）；SUB-104 已把这两串补成五语。台账头注（:22–26）要求翻译时同提交删条目，否则门与实际渲染分叉。
- 改法：只删这两条，其余不动。
- 改动文件：`scripts/lib/locale-invariant-ledger.mjs`。
- 档位：经济——台账数据维护，判定语义不变；第一次返工。
- 依赖：无。读数（zh-CN 新漏译 0、allowlistedLeakCount 不变，R3 为 104）在 R4-6 的 browser-proof 一并读，本条不单独跑。

**R4-4 · 知识库样板加一句可见说明（SUB-110，挂 134；条件：Owner 未把方案 A 改判为方案 B）**
- 来源：C3-4；R3M5、R3M6；C §4 第 1 条；本判断 §3.5 M-2。
- 现象：方案 A 的四条例外让知识库样板里的独立 TopBar 显示为 52、SideNav 取画布色与 16 内距；包的独立 TopBar 默认 68，构图三样板按包默认显示 68（DIFF-2）。说明只写在 CSS 注释里（`apps/storybook/src/story-demo-styles.ts:686–714`），读者会以为独立件就是这样渲染。
- 改法：在 `navigation-focused-shells-spec` 的「Knowledge base bookmark shell」面板正文（`story-content.tsx` 第 2139–2143 行一带）加一句：在 Navigation 家族批次之前，本样板的顶栏 52、侧栏画布色与 16 内距由文档作用域例外提供，包的独立 TopBar 默认 68。不放进顶栏，不改 story 的 title 与 description，不改例外与门；新词条五语同步。Owner 若改选方案 B，本条作废。
- 改动文件：`apps/storybook/src/contract-stories/story-content.tsx`（只此面板）；`apps/storybook/src/build/locales/storybook-content-text.ts`（新词条）。
- 档位：经济——文案，判定不变；第一次返工。
- 依赖：与 R4-1 同改词条文件，排其后；视觉后果由 R4-6 处理。
- 探查补充：面板正文可见，视觉签名基线里这个 story 有桌面、平板、手机三条（`visual-signature-baseline.json`，容差 meanAbsolute 2、maxCell 8）；加一句预计会让三条签名越过容差，所以本条连带一次 3 条的视觉重收（R4-6）。该 story 不在宽限表（`scripts/lib/story-budget.mjs`）里；加句后若超出高度上限，缩短句子，不加宽限条目。

**R4-5 · 目视清单按 R3 落地现状改正，补夜间分类计数实测与新目视项（SUB-111，挂 134）**
- 来源：A3-2 (a)(b)、B3-1、C3-3、B §4 第 1 条、C §4 第 1、3 条。
- 现象与改法（`docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md`，行号为 HEAD b0501c1，先 grep 再改；只写事实与建议，不勾选）：
  1. 待裁第 10 行 N-1（:244）写「随 SUB-101 一起解决」，不成立（静态算夜间约 4.45）。改为浏览器实测：浅色与夜间文档页侧栏 `.tcrn-doc-nav__category-count` 的计算字色、自带底色合成到侧栏底色后的颜色与对比度（两位小数），写明读法；处置写「待 Owner 二选一，见收口文件 N-1；未答复时保持现状」；不加豁免。实测若不低于 4.5，照实写「已达标」。
  2. 「R2 按建议先做的项」第 4 行（:208）改为现状：两个原型名已由 SUB-105（4d0dfde）删去，回退说明补 4d0dfde；第 5 行（:209）补 R3 现状：夜间底上的 Design System 后缀不再被豁免，回执 80 个豁免节点的底色都是 #ffffff 或 #efeeea。
  3. Brand 节第 128 行（B3-1）：TMS 后缀写成「浅色 #2c63c8、夜间 #7aa0f5（O-3，SUB-088）」；随后全文搜 `#2c63c8`，对夜间格成立的句子都带上 #7aa0f5。
  4. 「已知差距」（:78）加一句（C3-3）：1024 宽下文档页里的构图一样板受文档侧栏挤压，纸面约 406 宽，工具行折行，壳顶栏高到 147；几何门与映射门只量 1440×900（来源 `R/handoff/P1.md:79`）。
  5. Brand 收起态（:131 一带）加目视项（B §4 第 1 条）：52 收起栏里收起钮中心 26，标中心 16（在 42 宽的品牌链接里靠起始边），导航图标中心 22，侧栏中心 26，三条中心线不齐；门不量（来源 `R/handoff/P1.md:81–84`）。
  6. R3 节第 2 行（:224）补（C §4 第 1 条）：独立 TopBar 在知识库样板显示 52（文档作用域例外），在构图三显示 68（包默认）；side-nav 一条例外在文档作用域设了包 SideNav 的底色。
  7. R3 节第 5 行（:227）补（C §4 第 3 条）：截成一行的样板顶栏描述没有悬停全文。
- 改动文件：只此一文件；测量探针放会话 scratch，不进仓。第 249 行 P18 不归本条（归 R4-6）。
- 档位：经济——文档回写，判定不变；第一次返工（SUB-106 回写过本文件，但没动这些行）。
- 依赖：第 1 项要一份构建产物，用包内 R4-4 局部门的 build；R4-6 改同文件第 249 行，排其后。

**R4-6 · R4 批末再生：样板说明引起的视觉签名重收、回执与映射报告再生、P18 现状（SUB-112，挂 134）**
- 来源：批量原则第 4 条（生成物批末再生）；C3-1 的报告再生；C3-4 的视觉后果；A3-2 (c)；R3M7。
- 改法（顺序做；非视觉检查有红就停下，不写基线，记问题文件交回）：
  0. 前提：R4-1…R4-5 都已在包树提交。
  1. 构建一次，跑 `internal-alpha:browser-proof`；非视觉检查全绿才继续：axe 0、storyCoverageManifestOk、zh-CN 新漏译 0（覆盖 R4-1、R4-3、R4-4）、故事高度、clipped、buttonFeedback，门要求的几何检查绿。
  2. 视觉：预期变化只有 `navigation-focused-shells-spec` 的三个视口（R4-4）。别的签名有变化就停下，不接受，记问题（说明某条 R4 改动有意外的视觉后果）；三条里有没变的，只接受实际变化的。
  3. 先把 R3 的 `docs/verification/internal-alpha/visual-selection-application.json` 用 `git mv` 改名为 `visual-selection-application-r3.json` 保留（192 条逐条理由与前后签名唯一的入仓记录；仓内只有 browser-proof 写这个文件，没有读者）。用会话 scratch `tmp/r3-P4/gen-selection-r3.mjs` 的副本（复制到 `tmp/r4-P0/` 再改，只改副本）按当次捕获生成选择：处置 accepted-layout-change，理由写「R4 SUB-110 在知识库样板加一句可见说明（R3 验收 C3-4，方案 A 的条件）；按当前渲染接受签名，不代表目视通过」。带 `--update-visual-baseline` 应用，两次之间不重建，再复跑 browser-proof：回归 0、新增 0。
  4. 回执：只提交最后一次 browser-proof 后内容有变化的 internal-alpha 回执；再生 hardening（`internal-alpha-hardening-proof.mjs`）、internal-vocab:scan、scaffold、readme 回执，内容变了才提交；`fonts-vendor --check` 报 R4 新中文缺字形时才跑一次 fonts:vendor 并复跑 fonts-proof。`no-overclaim-scan.json` 一律还原（收口步骤再生）；`visual-selection-result.json` 不入仓，跑完移进会话 scratch 的 trash。
  5. 映射报告：R4-2 合入后跑 `exec node scripts/storybook-visual-proof.mjs --write-report`，再跑 `storybook:visual-proof`：23/23 行、redRows []、标签不再写死「八项」。
  6. 清单第 249 行 P18：按事实改 R3 的措辞（R3 的基线在 P4 包树——自集成分支 51872c2 切出——上构建并写入；集成树批末 verify 复读回归 0、新增 0），补 R4 的 3 条重收，并点名优先目视的 29 条（10 个 story，只带底盘与文档壳理由，名单在 `R/handoff/P4.md` 第 4 节）。
- 改动文件：`docs/verification/internal-alpha/**`（no-overclaim-scan.json 除外）、`docs/verification/internal-alpha-hardening-proof.json` 与 `.md`、`docs/verification/scaffold-proof.json` 与 `.md`、`docs/verification/readme-public-contract.json`、`docs/verification/storybook-visual-proof/gplus-map-report.json` 与 `.md`、`packages/ui-tokens/fonts/**`（仅当 fonts:vendor 执行）、`owner-acceptance.md`（只第 249 行）。
- 档位：经济——批末再生，判定不变（R3 的同类工作 SUB-046 由经济档完成）。
- 依赖：R4-1…R4-5。
