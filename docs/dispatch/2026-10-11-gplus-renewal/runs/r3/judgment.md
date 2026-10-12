# INIT-015 R3 · 判断

被判对象：集成分支 `claude/init015-gplus-renewal`，HEAD b0501c1（R3 六包与全部集成修复在 3f9d658 合入，其后只改 runs/ 下的调度文档）。输入：三片验收 `R/acceptance/A.md`、`B.md`、`C.md`（按节读），主线程问题清单 `R/problems/main.md`（R3M1–R3M7），批末表 `R/verify/steps.md`，R2 主线程问题清单的 RM19、RM20，R2 判断 §3–§5，R3 拆分第 1、2 节与 `R/subtasks.json`、`R/packages.md`，`runs/state.md` 的 R3 段，链上读回（会话 scratch `chain/r3-subtasks-readback.json`，version 1751；`chain/r3/STORY-*.json`，10-13 06:29）。本判断只读：没有改代码、门、回执或链，没有重跑门、构建、开浏览器或运行引擎；为定 R4 改法做过只读探查（类目说明与样板说明的渲染位置、视觉签名基线条目与容差、台账行、映射报告标签及其测试、selection 生成器副本），脚本与输出在会话 scratch `tmp/r3-judgment/`。`R` = `docs/dispatch/2026-10-11-gplus-renewal/runs/r3`，路径相对集成工作树。

读法（节行号）：§1 第 7 行；§2 第 31 行（§2.1 第 35 行，§2.2 第 48 行，§2.3 第 112 行）；§3 第 119 行（§3.1 第 123 行，§3.2 第 153 行，§3.3 第 162 行，§3.4 第 174 行，§3.5 第 207 行，§3.6 第 223 行，§3.7 第 240 行，§3.8 第 250 行）；§4 第 261 行（§4.1 第 265 行，§4.2 第 296 行，§4.3 第 307 行，§4.4 第 327 行，§4.5 第 331 行，§4.6 第 335 行，§4.7 第 339 行）；§5 第 345 行（§5.1 第 347 行，§5.2 第 355 行，§5.3 第 364 行，§5.4 第 370 行）。本文件约 52 KB，按节读。

## §1 R3 结论表

R3 验收：通过 13 张（120–129、131–133；129 机器判据通过、Owner 目视待做），阻塞于 Owner 2 张（130、134，goal 写「判定人：Owner」，134 另有前置），不通过 0 张。批末逐段 verify 30 步 44 段全绿，真实 `corepack pnpm@10.12.1 run verify` 与 `storybook:build` 退出 0（R2 红 6 步，R1 红 11 步）。R2 留下的 GWT 缺口全部关闭：120-GWT5、127-GWT4、129-GWT3、130-GWT1 样板 10 行、131-GWT4、133-GWT1。返工 7 条，全为经济档、全为各自目标的第一次返工，都不改变 GWT 结论。

13 张通过的 Story 在链上仍不能转 done：引擎要求库里有覆盖该 Story 的必需门并跑过 gates-run（RM20），本库门数为 0，这是 A 类持久配置，交 Owner（§3.1 S-1）。124、126、127、129 的判定人含 Owner 目视，按 R2 判断 §3.3 第 9 条，机器判据满足即可转 done，目视另行。

| Story | R3 结论 | 未满足或阻塞的 GWT | 关键缺口（一句） | 去向 |
| --- | --- | --- | --- | --- |
| 120 色彩轮廓 token 与对比度门 | 通过：GWT1–5 满足，GWT5 由 R2 的不满足转为满足 | 无 | 无硬线违例；转 done 受 RM20 | 收口：S-1 之后转 done |
| 121 字体与形状动效 token | 通过：沿用 R2，R3 无回退（GWT4 因纸面阴影重验，最大模糊 3） | 无 | radius-paper 14 属 O-1 授权范围 | 收口：S-1；目视另行 |
| 122 契约数据与生成脚本 | 通过：GWT2 因壳与 MultiSelect 的 CSS 改动重验 | 无 | 4 条字面值按 O-6 默认保留 | 收口：S-1 |
| 123 Typography | 通过：沿用 R2，R3 无回退 | 无 | RM8 四条字面值仍在（O-6） | 收口：S-1；目视另行 |
| 124 Icon | 通过：沿用 R2，R3 无回退 | 无 | 无 | 收口：S-1；目视未代签 |
| 125 Actions | 通过：沿用 R2，R3 无回退 | 无 | O-5、O-9 默认维持 | 收口：S-1 |
| 126 Inputs | 通过：GWT1、2、5 重验；R2 的 B2-1 由 SUB-091 关闭 | 无 | 静态展开态间距 0 与运行时 8px 交目视 | 收口：S-1；目视（清单 :169、:174） |
| 127 Brand | 通过：GWT4 由阻塞于 Owner 转为满足（O-1）；GWT3 按 O-3 只判浅色 | 无 | 清单第 128 行夜间格仍写 TMS #2c63c8（B3-1） | R4（SUB-111）；收口 S-1；目视 |
| 128 文档层清零 | 通过：R3 重验无回退 | 无 | 方案 A 的文档作用域例外与目的锚「Storybook 只渲染包」相抵（C3-4、N-2） | R4（SUB-110）；收口 S-1、N-2 |
| 129 矩阵与构图一样板 | 通过（机器判据）：GWT3 随 O-1 转为满足 | 无（Owner 目视待做） | 目视清单缺 1024 宽读数（C3-3） | R4（SUB-111）；收口 S-1、S-4 |
| 130 画布板到 story 映射 | 阻塞于 Owner（判定人）：两条 GWT 机器侧满足，23/23 行，差异 10 条都带引用 | 无（机器侧） | 类目说明未覆盖构图三（C3-2）；报告标签写死「八项」（C3-1） | R4（SUB-107、SUB-112）；收口 S-2 |
| 131 八项 DOM 测量门 | 通过：GWT4 随 O-1 转为满足，必测项现为十项 | 无 | 门说明过时（C3-1，挂 133） | 收口：S-1 |
| 132 契约静态门 | 通过：沿用 R2，R3 无回退 | 无 | 无 | 收口：S-1 |
| 133 门接入 verify 与 CI | 通过：GWT1 由部分转为满足（真实 verify 退出 0） | 无 | 目标条款「文档列出每门的判据、阈值、变异」在契约 README 两节未随 shellFrame 与 iconStroke 更新（C3-1） | R4（SUB-108）；收口 S-1 |
| 134 4.0.0 候选 | 阻塞于 Owner（判定人；前置「EPIC-039 至 042 全部 done」未满足） | 无（GWT1–3 满足） | 清单三处过时（A3-2）；台账两条已译债务（A3-1） | R4（SUB-109、SUB-111）；收口 S-3 |

## §2 R4 返工清单

结论：R4 需要做。7 条返工都是非 Owner 工作，留着就不满足「剩余工作全部阻塞于 Owner」；其中 B3-1、A3-2、C3-3 直接影响 Owner 目视时读到的清单。7 条去重归并成 5 张（R4-1…R4-5），另加 1 张批末再生（R4-6），共 6 张，全部经济档，0 张主力；都是各自目标的第一次返工，不升档。六张在同一个包内顺序做，彼此不并行：R4-1 与 R4-4 同改词条文件，R4-5 复用 R4-4 的构建产物，R4-6 依赖前五张；本轮没有别的实施包。

### §2.1 归并（来源 → R4 编号）

| 来源 | 现象（一句） | 归入 |
| --- | --- | --- |
| C3-2（R3M2） | gplus-samples 类目说明没有覆盖构图三 | R4-1 |
| C3-1 | 契约 README 几何门与映射门两节、映射报告标签没随 shellFrame 与 iconStroke 更新 | R4-2（报告再生在 R4-6） |
| A3-1（R3M2、P0 问题 7） | 台账仍列两条已翻译的债务 | R4-3 |
| C3-4（R3M5、R3M6、C §4 第 1 条） | 知识库样板没有交代它的顶栏与侧栏几何来自文档作用域例外 | R4-4（视觉重收在 R4-6） |
| A3-2 (a)(b)、B3-1、C3-3 | 目视清单过时或缺读数（N-1 状态、R2 表两行、Brand 夜间色、1024 读数） | R4-5 |
| B §4 第 1 条、C §4 第 1、3 条 | 新目视项（收起栏中心线、两种外观、描述无悬停全文）未进清单 | R4-5（只补清单，不改实现） |
| A3-2 (c) | 清单 P18 措辞「在集成树上构建一次」与事实不符 | R4-6（与 P18 同一行） |
| A 收口步骤、R3M7 | no-overclaim 回执的 scannedFiles 落后（643 对 646） | 收口步骤，不进 R4（§2.3） |

### §2.2 逐条

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

### §2.3 不进 R4 的项

1. **A 的收口步骤（no-overclaim 回执）：定为收口步骤，不作 R4 批末项。** 理由：`pnpm scan` 扫工作树文件系统，scannedFiles 随任何新增文件变（R3 批末 643 → 646：两份 P4 交回文档加未跟踪的 visual-selection-result.json）；R4 批末之后还会提交 R4 验收、判断、lessons 与收口文件，任何更早再生的回执都会落后；verify 不读它的入仓值，提早提交也没有门受益。做法：主线程在最后一次文档提交时（收口文件写好、在 browser-proof 跑过、截图目录还在的树上）跑一次 `pnpm scan`，确认 0 命中，把回执与收口文件同一提交或紧随其后提交；`visual-selection-result.json` 保持未跟踪。这是一条命令加一次提交，不派代理。
2. **归 Owner（§3）：** N-1 的改色（R4-5 只实测并记录）、方案 A 与 B 的取舍（N-2）、窄桌面壳顶栏 147 的行为（N-3）、样板描述截断的处理（N-4）、收起栏中心线是否对齐（N-5）、文档壳品牌锁定组合等偏差（N-6），以及 RM20、130 与 134 的判定、目视、D8 停点、画板修订。
3. **不改：** `docs/verification/doc-shell-class/r2-clearance.md` 的两项旁证读数（本判断 §3.6 J-5）；R3 读数记在这里：静态命中 0，扫描源文件 66，doc-shell:proof 差集未变。`visual-selection-application.json` 继续入仓（J-6）。
4. **后续批次（无 GWT 或硬线依据，收口列明，不进 R4）：** SUB-089 的「文案 display:block」变异（B §5、§6）；ja 检查与 localeLeakScan 读不到 title（RM16 ①）；clipped 只在英文下跑（RM16 ②）；守卫不拦 data 属性主体（RM12 ⑤）；package-context 142 处；390px 文档壳顶栏 401px、品牌字出现两次（P9 #4）；手机视口部分截图下半部空白（RM18）；几何门与映射门只量 1440×900、en（C §6 第 2 条）；shellFrame 不量纸面起始边（C §6 第 3 条）；doc:sample-style 只比 23 件矩阵组件（C §6 第 4 条）。

## §3 收口用的 Owner 事项清单（最终版）

编号：S 为只有 Owner 能做的事，O-1…O-12 沿用 R1 与 R2，N 为 R3 新提出的 Owner 事项，M 为派工方法选择的复核，J 为本判断的 B 类裁定。每项附建议与「未答复时」。

### §3.1 只有 Owner 能做的事

**S-1 库门配置（RM20，A 类持久配置）。**
- 现状：R2 链写首次提交时 8 张 Story 转 done 被引擎整体拒绝，reasonCode `WORK_DONE_GATES_NOT_COVERED`（没有覆盖该 Story 的已启用必需门）；`gates-config-list` 读回本库门数为 0。R3 后机器判据满足的 Story 增至 13 张（120–129、131–133），15 张在链上都还是 active。
- 建议：在 DS 库声明一个已启用的必需门，命令为根 verify（`corepack pnpm@10.12.1 run verify`），工单覆盖精确列出 STORY-120…134；在收口 HEAD 上以各 Story 的 `--work-id` 加 `--base <commit>` 跑 gates-run；之后主线程把 13 张转 done，130、134 等 S-2、S-3。声明门的动词以引擎 `commands` 现读为准。另一种做法是 Owner 本人转态，但被拒原因与执行者无关，不经门能否转态未验证，记未知。
- 未答复时：15 张保持 active，summary 写「转 done 待库门配置」；INIT-015 保持 active；不影响其余工作。

**S-2 STORY-130 判定（goal 判定人为 Owner）。**
- 现状：两条 GWT 机器侧满足：映射 23 行全绿、删一个 story 判红；差异 10 条都带 refs，待 Owner 裁定 0 条，待 Owner 知悉 3 条（DIFF-7、8、9）。
- 建议：R4-1 补类目说明、R4-6 再生报告之后判通过。
- 未答复时：保持 active；134 的前置随之不满足。

**S-3 STORY-134 判定（goal 判定人为 Owner；前置「EPIC-039 至 042 全部 Story done」）。**
- 现状：GWT1–3 满足；pack:smoke 三个 tarball 两次 sha256 一致；version-surface 7 处读回 4.0.0；没有 v4 tag，分支没有上游。前置依赖 S-1 与 S-2。
- 建议：S-1、S-2 之后，结合 S-4 一并判定。
- 未答复时：保持 active；不发版。

**S-4 目视验收（D8）。**
- 范围：`owner-acceptance.md` 10 节、「R3 落地项」一节与 R4-5 补的各项。建议优先看：只带底盘与文档壳两类理由的 29 条视觉签名（10 个 story，名单在 `R/handoff/P4.md` 第 4 节）；构图一壳几何与手机、1024 宽（:73–78）；Brand 第 128–134 行；Inputs 第 169、174 行；夜间文档页侧栏的分类计数（N-1）；N-2…N-6 各项。视觉签名 192 条是 accepted-layout-change，只表示按当前渲染接受签名，不是目视通过。
- 建议：按清单一次看完，结果记在清单与收口文件；不通过的项按新工作开单。
- 未答复时：机器结果不代签；124、126、127、129 按 R2 判断 §3.3 第 9 条在 S-1 之后转 done，目视另行，不通过按新工作处理。

**S-5 推送、打 tag、发版、部署（D8 停点）。**
- 建议：S-1…S-4 之后。
- 未答复时：分支只在本地，没有上游，没有 tag。

**S-6 画板修订（设计权威侧，建议一次做完）。**
- 四项（R2 判断 §3.4 第 5 项）：Inputs 板补只读获焦 rf 一行；Inputs 板快捷键 ink-3 改 ink-2；Brand 板夜间说明的 TMS 色改 #7aa0f5（DIFF-10）；GPlus 底盘板 kv 表「侧栏 212 · 顶栏 48」改 220/52（DIFF-3）。
- 未答复时：差异照旧记在映射里，不阻断本 INIT。

### §3.2 设计会话的 B 类裁定（O-1…O-4，Owner 事后可更正）

建议：四项都维持。未答复时：维持已落地的做法。下列各条写 R3 落点与「Owner 更正时」的撤回范围。

- **O-1 构图一壳层几何：已落地。** SUB-090 新增 4 个壳层 token（220、52、52、14），SUB-089 加收起态读数，SUB-094 加 shellFrame 必测项，SUB-101 让文档壳跟随 220/52 与顶栏 52；127-GWT4、129-GWT3、130 样板 10 行、131-GWT4 因此满足。Owner 更正时：按 R2 判断 §3.1 O-1 撤回（约一个主力包），上述 GWT 回到阻塞；方案 A 的例外与白名单随之撤回；ui-tokens README 主题块计数回到 85，M18、CHANGELOG 壳几何段与清单第 3 节同步改。
- **O-2 标语与壳品牌说明的对比：已解决。** 两类节点 ink-3 于 bg 浅色 4.86、夜间 4.89，axe 0，未加豁免。N-1 并入本条，见 §3.4。
- **O-3 TMS 夜间后缀 #7aa0f5：已落地。** SUB-088；夜间 tms 于 panel 6.86、于 bg 7.30，不靠豁免；豁免只剩 Design System 浅色两条；127-GWT3 只判浅色。Owner 更正时：撤回夜间值与生成器形状，恢复两条豁免（主力小改），Brand 清单、M9 与 CHANGELOG 同步。
- **O-4 映射待裁差异：已落地。** DIFF-3 以 220/52 为准；DIFF-2 构图三样板已补（SUB-092、SUB-093）。Owner 更正时：DIFF-2 改记页面模板批次并撤回构图三（经济）。

### §3.3 按默认执行（O-5…O-12，未答复时即现做法）

建议：维持默认；O-8 请在清单第 246 行点名确认。

- O-5 外壳切换钮尺寸维持（36 胶囊、38、44）；收起 52 栏放得下 38 钮（门外读数 7–45）。更正时：桌面两枚改 IconButton md 32 加 radius-control，随第二批或另开。
- O-6 组件内字面几何不新增 token；typography.scale 余 4 条字面值（16px、44/48px、11.5px）保留，Typography.test 钉住。更正时：补 4 条刻度 token 并注册（主力）。
- O-7 Typography API 维持（numeral 不截断、给 title）。
- O-8 Brand 规格保持 B1；清单第 246 行请 Owner 点名确认。
- O-9 edge 抬升层浅墨字面量 `rgba(22,21,15,.04)` 维持；清单第 247 行已列。
- O-10 已按建议只改注释（tokens.json:49），回显。
- O-11 不加 3500 字。O-12 字体许可：维持；实施侧与验收都不对许可合规下结论。

### §3.4 R3 新提出的 Owner 事项

**N-1 文档导航分类计数夜间低于 4.5（并入 O-2）。**
- 现状：`.tcrn-doc-nav__category-count`（`apps/storybook/src/alpha-styles.ts:861–870`）自带 `color-mix(in srgb, var(--tcrn-color-surface-muted) 78%, transparent)` 底色，字色 ink-3、11px、字重 800，不算大字。按 token 静态合成：浅色约 5.17，夜间约 4.45。R2 引的夜间 4.59 是 ink-3 直接落在 panel 上，没算计数自己的底色。axe 违规 0 不能说明它达标：门只读 violations，入仓 axe 汇总里这个类出现 0 次。R4-5 会在浏览器里实测并写进清单。
- 选项：(a) 文档层把这条 color 改 ink-2（静态约浅色 7.87、夜间 7.00）；(b) 去掉计数的底色（夜间回到 ink-3 于 bg 的 4.89）；「字标豁免」不适用于导航计数。
- 建议：(a)，只改文档层一条声明，不碰包，经济档；改后跑一次 browser-proof，签名若越过容差再按 R4-6 的做法重收。
- 未答复时：保持现状，收口列出；目视时核对夜间文档页侧栏的分类计数。本判断没有按建议先做，理由见 J-2。

**N-2 方案 A 与方案 B（SUB-101，R3M5）：独立导航件在 Storybook 里呈现两种外观。**
- 现状：方案 A 为知识库样板的独立 TopBar、SideNav、NavGroup 标题与 NavItem 登记 4 条文档作用域例外（`scripts/shell-fidelity-proof.mjs:340–371`），删除条件为 Navigation 家族批次让独立件提供构图一几何；其中 side-nav 一条放行 `background`，是文档层给包件改填色，与 128 目的锚「Storybook 只渲染包」相抵；独立 TopBar 在知识库样板显示 52，在构图三显示 68（包默认）。方案 B 是把样板角色的这几项比对移到 Navigation 批次，要改门的比对数据，须 Owner 明示。
- 建议：维持方案 A 到 Navigation 家族批次，R4-4 在样板里写明这一点；Navigation 批次让独立件按构图一几何渲染后删四条例外与两条白名单项，style-scale.md 与清单同步。
- 未答复时：维持方案 A；R4-4 照做。Owner 改选 B 时：撤回四条例外与两条白名单项，R4-4 的说明撤回，按 B 改门的比对数据（主力，约一个包）。

**N-3 构图一样板在 1024 宽下壳顶栏高 147。**
- 现状：文档侧栏挤压样板，纸面约 406 宽，工具行折行，壳顶栏长到 147（P1 交回 §7）；几何门与映射门只量 1440×900。
- 建议：R4-5 补进清单；窄桌面下工具行是否必须不折行、顶栏是否必须保持 52，归 Navigation 或页面模板批次，本 INIT 不改。
- 未答复时：照现状，列为已知差距。

**N-4 知识库样板顶栏描述截成一行加省略号，没有悬停全文。**
- 现状：`apps/storybook/src/contract-stories/prototypes/storybook-shell-demos.tsx:55–57` 的描述 span 没有 title，`story-demo-styles.ts:727–756` 规定单行省略；是顶栏 52 的直接后果，全文仍在 DOM。
- 建议：不接受截断时，把描述移出顶栏、放到样板内容区首行（经济，不改包）；不建议加 title（title 不经词典翻译，扫描也读不到，RM16 ①）。
- 未答复时：照现状，目视项。

**N-5 收起 52 栏里标、收起钮与导航图标三条中心线不齐。**
- 现状：门外读数（P1 scratch 脚本，非门）收起钮中心 26、标中心 16、导航图标中心 22、侧栏中心 26；收起态品牌链接只设宽 42，没有让内容居中（dist:622–637）；旧 92 栏同样偏；127-GWT4 只要求标 22 不缩放。
- 建议：Owner 在清单第 73、131 行目视时看；要居中时，给收起态品牌链接加 `justify-content:center` 是包内孤立修复（经济）；导航图标的位置属 Navigation 家族，留第二批。
- 未答复时：照现状，目视项。

**N-6 文档壳与构图一的余差（R3M6）。**
- 现状：文档壳品牌锁定组合仍是 38 标、文案起点 66（构图一为 22、48），收起与极窄态文案用 max-width 0 裁掉；文档页没有离边 12 的纸面；`page-template.tsx` 未改。都不在 O-1 授权内，门也不量；shell:parity 的 brand-lockup 绿只证关系，不证尺寸。
- 建议：作为已知差距接受到 Brand 或 Navigation 家族批次，由包把壳内缩放做成可复用修饰；不在文档 CSS 里给包类写自定义属性。
- 未答复时：照现状，目视项（清单第 78、227 行）。

### §3.5 三类派工方法选择的复核

**M-1 集成修复项续派原包代理，而不另派集成代理。**
- 经过：(i) P2 交回时冒烟因构图三来源路径退出 1、visual-proof 测试 1/16 红（storyKind 只认十个固定 id）、可复现性探针仍要 8 个菜单，都是 P0 新 story 与原型退役在 P2 持有文件里的后果；主线程用 SendMessage 续派原 P2 代理（主力、同一包树）做 I-P2b 三项，合入 36b58d3。(ii) P3 在额度停点时 SUB-101 只做了一部分；重置后续派原 P3 代理做完 SUB-101 余项，并改了冒烟钉值（b024f0e 改 P2 持有的 `storybook-smoke.mjs`，e1c463e 改 P0 持有的 `smoke.test.ts`），主线程在 R3M5 授权。
- 复核：(ii) 的 SUB-101 续做是「触顶停在原地、重置后接着做」，不是方法改动。(i) 属拆分已预见的流转（R3 拆分跨包约定第 4 条、§2.3 第 4 条：前置包带出的红由持有该文件的包处理），只是改由已交回的 P2 代理续做；(ii) 的冒烟钉值则偏离跨包约定第 4 条（P3 发现 P2 持有的门文件钉着旧文档壳几何时只记、不改、交判断）与第 5 条的文件持有，由主线程在 R3M5 授权。两者都没有增删步骤，没有改档位，没有多派代理；跨持有的改动发生在持有包已合入退役之后，没有并发冲突；结果经批末逐段与真实 verify、三片验收复核没有问题（钉值改法本身见 J-7）。但它们在字面上偏离批量原则第 2 条（包完成即退役；集成问题交一个集成子代理）与第 3 条（见红只记不修，批末一次处置），事先没有取得 Owner 同意。
- 建议：Owner 事后表态：认可「同一包文件集内、由前置包带出的集成后果，由原包代理续做」为允许做法，或要求今后另派集成代理。
- 未答复时：R4 只有一个包，不会再出现；之后的批次按第 2 条字面执行（另派一个集成代理）。

**M-2 SUB-101 的方案 A 由主线程按批量原则第 5 条先做。**
- 复核：方案 B、C 要改门的比对数据或选择器，属 Owner；方案 A 沿用 R2 判断 §3.3 第 4 条已用过的「文档前缀类加登记例外」做法，例外逐条带删除条件，四条都被用到（docExceptionsUnused 0），守卫照常拦其余属性，可逆。主线程采纳的是 P3 的建议，属第 5 条「不阻塞工作的事项按建议先做、回显、Owner 事后可更正」的正常用法，不是执行方法的改动。产品上的后果（两种外观、side-nav 放行填色）是 N-2。
- 结论：本判断确认方案 A 为 B 类选择，条件：R4-4 补可见说明；删除条件随 Navigation 批次兑现；收口列 N-2，Owner 可改选 B。建议：维持。未答复时：维持方案 A（N-2）。

**M-3 额度触顶时停在原地，改挂一次性定时唤醒。**
- 复核：停在原地、不为额度改方法，符合设计会话的指示与 state.md 的约定；把每小时唤醒换成重置后 7 分钟的一次性唤醒，是等待机制，不是执行步骤，符合批量原则「代理通信与等待」第 4 条（连续没有新状态时延长查询间隔）。唤醒按时触发，R3 接续正常。风险是唯一唤醒源失效时会话停着，这次没有发生。
- 结论：不是执行方法改动。建议今后触顶时沿用。未答复时：沿用。

### §3.6 本判断作出的 B 类裁定（收口回显，Owner 可更正）

建议：维持。未答复时：按下列各条执行。

1. **J-1** R4 做，范围 6 张（R4-1…R4-6），全部经济档，一个包；R4-4 按方案 A 的条件做，Owner 改选 B 则作废。
2. **J-2** N-1 不按建议先做，交 Owner 二选一：R2 判断 §3.1 O-2 写明这一选择在收口交 Owner；改色会动每个文档页的侧栏，属文档层的颜色角色，签名影响未知。R4-5 只实测并记录。
3. **J-3** no-overclaim 回执的再生定为收口步骤（§2.3 第 1 条），不进 R4。
4. **J-4** verify 改写的两处（no-overclaim 计数、未跟踪的 visual-selection-result.json）在轮中只存档并还原，不提交；visual-selection-result.json 永不入仓。
5. **J-5** `r2-clearance.md` 不改、不再生：按文件名是 R2 时点的记录，doc-shell:proof 差集未变，判据只在差集变化时再生；R3 读数记在 §2.3 与收口文件。
6. **J-6** `visual-selection-application.json` 保留入仓；R4 写入前把 R3 的这份改名为 `visual-selection-application-r3.json`，R4 的写入记录占用原名。
7. **J-7** `scripts/shell-parity-proof.mjs:534` 样板切换钮期望右距 23.04 → 16、`smoke.test.ts` 1212–1215 钉值 288/280/360/96 → 220/220/220/52、冒烟 5 处改读壳层 token：确认属 R2 判断 §3.3 第 6 条（O-1 直接后果的旧几何期望），比对方式与容差未动，不算改阈值。
8. **J-8** 方案 A 连带的重复选择器白名单两项（`.tcrn-nav-group__label`、`.tcrn-nav-item`）随方案 A 确认，删除条件同四条例外。
9. **J-9** SUB-078 判据「probes 含 shellFrame」按检查项读：shellFrame 是第十个检查项，报告 summary 与各 run 都有，判达成。
10. **J-10** R4 Subtask 的父单：类目说明挂 130，契约 README 挂 133，其余挂 134（R2 判断 §3.3 第 11 条的做法；这三张在链上仍开着）。
11. **J-11** R3 的 19 张 Subtask 与 SUB-046、076、078、080 全部转 done，余项去向写进 summary（R2 判断 §3.3 第 10 条）。
12. **J-12** §2.3 第 4 条所列后续批次项不进 R4。

### §3.7 按建议先做（R3 各包的自定取舍，三片验收判可接受或有条件，收口回显）

- P0：新键 Add record placeholder 沿用 Add Work placeholder 的五语值；Promote 的 ja、ko 与原因句的 ja、ko、fr 避开已有词条的译文；fr 的 Route 同形词按两边都在词典里计已翻译（21/21）；台账未改（条件 → R4-3）；构图三新建 `compositions.stories.tsx`、id `composition-three-sample`；1040 写在样板内联、不加 token；SUB-095 改词典键、不加豁免。
- P1：4 个壳层 token 用判断建议的名字与值，contractGroups 加 shell → container，不新增导出；保留局部变量 `--tcrn-product-shell-sidebar-width`；侧栏画布色与壳顶栏 min-height 52 全宽生效（条件：Owner 在手机视口目视，清单第 78 行）、其余构图一几何只在 `@media not all and (max-width: 760px)`；导航项起始内距 calc(space-1 − 1px + 深度缩进)；纸面 overflow clip、底取 panel；独立 TopBar 保持 68；TMS 后缀用 night 加 nightRef、生成器按 marks.json palette 校验；未授权的冒烟断言与 railWidthPx 不自改、交主线程。
- P2：shellFrame 只量纸面上、尾、下与顶栏高，只在本身是 ProductShell 根的 [data-shell] 里量；两条变异放在 icon-sample-project；干净夹具页加纸面与顶栏；测试标题去掉「four」「nine」；DIFF-1 断言改查 P1、O-1；冒烟 `?? 92` 改读 token；storyKind 按注册表类目取值；可复现性探针 8 → 6；SUB-098 比较函数导出、自检写在脚本内；SUB-099 两个循环共用层判定。
- P3：SUB-100 规则写在 alpha-styles.ts，重复选择器白名单加回 `.tcrn-product-shell-search__results`；SUB-102 承载类名单从 roles.json 读；SUB-105 用整份清单断言；SUB-089 宿主沿用 owner-quality-product-shell 收起变体、容差 0.5、等过渡结束；收起与极窄态文案 max-width 0；page-template 不改。
- P4：SUB-106 在点名行之外按事实改了若干句；CHANGELOG 的 Breaking 句加 ProductShell 与第四个公开 API，迁移说明新增 M18、M19；ui-tokens README 计数取 parseTokenCssBlocks 读数；选择生成器只改副本并加 nonVisualProofOk 检查；doc-shell-class 不再生；application 文件首次入仓（J-6）；192 条理由按改动归因（条件：不当作目视通过，29 条优先目视）；宽限表 7 条只记测量值；browser-proof 跑三次；color-palette 说明 73 格。
- P5：Form.test.tsx 不改；注释里删去 `.tcrn-input--short`；静态展开态列表紧贴触发器（0），运行时浮层 8px，不加 gap（交目视）。
- 主线程：SUB-101 方案 A（M-2）；I-P2b 与冒烟钉值的续派（M-1）；R3M2 把摘录里的禁用短语原文改为指向脚本（3113b5e）。

### §3.8 知悉（不需裁定，收口列明）

- 视觉签名：R3 写入 192 条 accepted-layout-change（回归 159、新增 33，三个视口各 64），理由引纪要 D1、D6 与 O-1，带前后签名 sha256，refused 为空；基线 sha256 162d5aca… → 42fb42b1…。R4 预计再加 3 条（R4-4）。都不代表目视通过。
- 故事高度宽限表 7 条只变矮，只改 recordedHeightPx，注释写了前后值。
- 每次 verify 后工作树都会多出 no-overclaim 计数变化与未跟踪的 visual-selection-result.json；退出码不受影响（J-4）。
- fonts:vendor 未执行（--check 通过）；中文分片覆盖 968 个产品码位。
- 流程：P3 一条只读命令带 cd（RM4 第二次出现），未弹框、未写入；R3M2 主线程摘录写入禁用短语原文致 scan 红，已改为指向脚本。
- 额度：R3 期间本周额度触顶（99% → 100%），停在原地至重置；额度门控变量仍未配置。
- 证据盲区：N-1 是静态计算（R4-5 补实测）；1024、390 宽读数取自包交回；几何门与映射门只量 1440×900、en；SUB-098、SUB-099 的比较函数变异只在会话 scratch 跑过，仓内是脚本自检；三片验收都没有开浏览器。
- 会话 scratch 留存：`tmp/r3-P4/gen-selection-r3.mjs` 留到 R4-6 写入完成；`tmp/r2-P12/` 的原件已由 R3 副本取代，可按收尾原则清理；R3 包树已全部合入，可由主线程核对后经 git worktree 管理入口退役。

## §4 链写计划

主线程用批量入口一次写完并读回回执，actor 记实际执行者。只用本库用过的状态，路径 planned → ready → active → done；Story 受 RM20 约束，不计划转 done，只用 work-annotate 写 summary。链写前以 work-list 现读为准：读回文件（version 1751）里 R3 的 19 张为 planned，SUB-046、076、078、080 为 active，15 张 Story 都是 active。summary 按 UTF-8 逐条计数，最长 Subtask 107 B、Story 105 B、INIT 141 B，都不超过 160。按本节生成的批量文件草稿在会话 scratch `tmp/r3-judgment/r3-chain-batch.json`（77 个成员，schemaVersion tcrn.work-batch.v1），主线程核对后可直接用。

### §4.1 R3 Subtask 转态（19 张，每张 planned → ready → active → done，共 57 个转态）

共用 summary「R3 已合入集成分支 3f9d658，批末验收判据达成」（12 张）：

| 键 | id |
| --- | --- |
| TCRN-DS-SUB-088 | work:2bad19d929ef4f7d866b6e60 |
| TCRN-DS-SUB-089 | work:c0f0bb6902e36063aab67f00 |
| TCRN-DS-SUB-090 | work:cf1ae5eea21310f2b89eea4f |
| TCRN-DS-SUB-093 | work:212fcfb325164025e68e5f9e |
| TCRN-DS-SUB-095 | work:68f8ebf162588d4eeefb892b |
| TCRN-DS-SUB-096 | work:b486fa89bc44b96c452f346e |
| TCRN-DS-SUB-097 | work:13cd986c3dbc8caab4b146b1 |
| TCRN-DS-SUB-098 | work:58ecc47e68898915044e8892 |
| TCRN-DS-SUB-099 | work:d795e75be41939d1abc254fb |
| TCRN-DS-SUB-102 | work:9e03e76a829254f68a45a4b8 |
| TCRN-DS-SUB-103 | work:c4ad5130eb7bb823280e48a3 |
| TCRN-DS-SUB-105 | work:0af979516a216ef4eb9ef613 |

带专属 summary（7 张；三个转态用同一句）：

| 键 | id | summary |
| --- | --- | --- |
| TCRN-DS-SUB-091 | work:6394da5ffe0c2b02677ce4bc | R3 达成（第二次返工，主力）：MultiSelect 纵向，列表在触发器下方且同宽 |
| TCRN-DS-SUB-092 | work:0458f7f4ca9eb2eb21d9bdd8 | R3 达成：构图三样板；类目说明未覆盖构图三，由 R4 的 SUB-107 补 |
| TCRN-DS-SUB-094 | work:6b385e549d62de799af7d04f | R3 达成：shellFrame 必测项与两条变异；契约 README 两节由 R4 的 SUB-108 补 |
| TCRN-DS-SUB-100 | work:2fa94a1b7cdfb0097c267c5c | R3 达成（第二次返工，主力）：静态结果留在版面内，菜单 6 个；承接 SUB-080 |
| TCRN-DS-SUB-101 | work:4f5feda0f27f31c7e4df78bb | R3 判据读数达成：方案 A 四条文档作用域例外（B 类，Owner 可更正）；偏差交目视 |
| TCRN-DS-SUB-104 | work:ae0fea09e3b5cd12b3600526 | R3 达成：21 种 title 两边已译；台账两条已译债务由 R4 的 SUB-109 删 |
| TCRN-DS-SUB-106 | work:4f36a2af33b4957952b1995a | R3 达成：清单、CHANGELOG、迁移说明已回写；清单过时处由 R4 的 SUB-111 改 |

### §4.2 既有 4 张（active → done，各 1 个转态）

| 键 | id | summary |
| --- | --- | --- |
| TCRN-DS-SUB-046 | work:9ef9f3d750673679b49c5e99 | R3 重做达成：基线 192 条已写入（按渲染接受，非目视通过），回执已再生 |
| TCRN-DS-SUB-076 | work:0b676d0f1b8f82410fcf0bfe | R3 重做达成：映射报告 23/23；报告标签由 R4 的 SUB-108 改、SUB-112 再生 |
| TCRN-DS-SUB-078 | work:5a22e10dd74df96bb787a76e | R3 重做达成：几何报告十项全 pass；shellFrame 是检查项而非探针 |
| TCRN-DS-SUB-080 | work:fc7fe1565a214c7908d4ef79 | 由 SUB-100 承接达成：searchOverlay 菜单 6 个，静态结果不再压住正文 |

合计 Subtask 转态 57 + 4 = 61 个。

### §4.3 Story 注解（15 张，work-annotate 只写 summary；不动 scope、goal、acceptance 正文；不转态）

| Story | id | summary |
| --- | --- | --- |
| STORY-120 | work:dc8820c6d2ee0915cfda3878 | R3 通过：GWT1–5 满足，真实 verify 退出 0；转 done 待库门配置（RM20） |
| STORY-121 | work:f777d0aeec6779529a566622 | R3 复核通过：GWT1–5 满足、无回退；Owner 目视另行；转 done 待库门配置 |
| STORY-122 | work:bcf1f36ee2f93d7c8b69518c | R3 复核通过：GWT1–4 满足、无回退；4 条字面值按 O-6 保留；转 done 待库门配置 |
| STORY-123 | work:88be4a8b40a73ef49bda49ce | R3 复核通过：GWT1–4 满足、无回退；Owner 目视另行；转 done 待库门配置 |
| STORY-124 | work:cd0044cd4e877982b2380237 | R3 复核通过：GWT1–4 满足、无回退；Owner 目视未代签；转 done 待库门配置 |
| STORY-125 | work:91e4b795d04577ade46f29ab | R3 复核通过：GWT1–5 满足、无回退；O-5、O-9 默认维持；转 done 待库门配置 |
| STORY-126 | work:c6f950c965e3dd9fc23e854f | R3 通过：GWT1–5 满足，MultiSelect 纵向已修；目视未代签；转 done 待库门配置 |
| STORY-127 | work:b4180fe5919ef55fd45dabae | R3 通过：GWT1–4 满足（O-1、O-3 为 B 类）；清单一行由 R4 改；转 done 待库门配置 |
| STORY-128 | work:3800d0d94195b75cbab2931a | R3 复核通过：GWT1–3 满足；方案 A 的样板说明由 R4 补；转 done 待库门配置 |
| STORY-129 | work:12a5dfa99cb91f55647b2a88 | R3 通过：机器判据满足，目视待做；1024 读数由 R4 补进清单；转 done 待库门配置 |
| STORY-130 | work:0fbb3d17f6c255f37614c300 | R3 两条 GWT 机器侧满足（23/23 行）；判定人为 Owner；类目说明由 R4 补 |
| STORY-131 | work:83b087aa618af6dd002d0254 | R3 通过：GWT1–4 满足（十项含 shellFrame）；转 done 待库门配置 |
| STORY-132 | work:a4e12893d78be775d63b4e91 | R3 复核通过：GWT1–4 满足、无回退；转 done 待库门配置 |
| STORY-133 | work:7fe5f75adb667c9e50bd7c5a | R3 通过：GWT1–3 满足，真实 verify 退出 0；README 两节由 R4 补；转 done 待库门配置 |
| STORY-134 | work:f5de8fcf90580fcc9b4192f7 | R3 GWT1–3 满足；判定人为 Owner；前置待 120–133 done（RM20）；清单与台账由 R4 改 |

### §4.4 INIT-015（work:e5b3880c835fd77f1c14b81b）注解

summary：「R3：6 包合入 3f9d658，verify 与 storybook:build 退出 0；13 张通过待库门配置，130、134 待 Owner；R4 一个经济包 6 张」（141 B）。保持 active。证据入口：`R/judgment.md`、`R/acceptance/`、`R/verify/steps.md`。方案 A、J-1…J-12 等 B 类选择与 M-1…M-3 的复核写进收口文件，Owner 可更正。

### §4.5 R4 Subtask 建单（6 张，work-create）

载荷 `runs/r4/subtasks-batch.json`（6 个 work-create 成员，TCRN-DS-SUB-107…112；父单 130 一张、133 一张、134 四张；项目 project:ba2f70f9503ac43c3ec6aa36）。建议并进本次批量文件，保持一轮一次链写；若引擎不接受同一批里混合 work-create 与转态，就紧接着跑第二个批次，同一次链写步骤内完成。

### §4.6 知识卡

`R/lessons.json` 5 条，按入口逐条落卡并读回（入口名以 commands 现读为准，活跃库读取带 `--allow-trailing`）；报 POSSIBLE_CONFLICT 时核对主题，不同主题以 --coexist 建（R2 做法）；被预算拒绝就记阻塞，迁移后补写。

### §4.7 合计与注意

- 批量成员：转态 61 + 注解 16 = 77；加 R4 建单 6 = 83。
- 写前核对：读回里 19 张为 planned、4 张为 active；若有偏差（例如有人已转态），按现状删去已到达的转态再提交。
- 写后读回：19 + 4 张为 done；15 张 Story 与 INIT 仍为 active，summary 为上表；SUB-107…112 为 planned，父单正确。

## §5 R4 规模与分组、收口条件

### §5.1 包表

| 包 | 档 | Subtask（有序） | 预计回合 | 主要文件 | 前置 | 局部门（完整命令见 `runs/r4/packages.md`） |
| --- | --- | --- | --- | --- | --- | --- |
| P0 文档回写、文案与批末再生 | 经济 | SUB-107 → SUB-108 → SUB-109 → SUB-110 → SUB-111 → SUB-112 | 80–120 | governance.ts、storybook-content-text.ts、docs/contract/README.md、storybook-visual-proof.mjs（一行）、locale-invariant-ledger.mjs、story-content.tsx（一个面板）、owner-acceptance.md、docs/verification 下的回执与映射报告 | R3 链写读回之后 | build；storybook 测试；public-output、internal-vocab、readme、scan；doc-shell:proof；contract:static；visual-proof 测试；browser-proof 与 --update-visual-baseline；hardening；scaffold；visual-proof --write-report；fonts-vendor --check |

属小轮（实施包 1 个，不超过 2）：按批量原则第 6 条，R4 的验收与判断由一个主力档代理一次完成，按原格式写验收、判断与 lessons 三份文件；R4 之后没有非 Owner 工作时不写 R5 拆分。拆分文件已随本判断写出：`runs/r4/decomposition.md`、`packages.md`、`subtasks.json`、`subtasks-batch.json`，键自 TCRN-DS-SUB-107 起。

### §5.2 起跑与批末

1. R3 链写（含 R4 建单）读回后，从集成 HEAD 切包树 `pkg/r4-P0`，分支 `claude/init015-r4-p0`，派一个经济档代理（einzbern-economy），派前切摘录 `runs/r4/excerpts/P0.md`（R4 拆分第 1、3 节，本判断 §2.2、§2.3、§3.6，以及 R4 拆分第 1 节第 1 条沿用的 R3 拆分第 1 节第 2、7、9、10 条）。
2. 包内只跑包表的局部门；回执与报告只由 SUB-112 提交，其余子单跑完还原；no-overclaim-scan.json 全程还原。
3. 合入后主线程跑 R4 末次 verify：逐段 30 步 44 段（遇红继续），另跑一次真实 `corepack pnpm@10.12.1 run verify` 与 `storybook:build` 记退出码；verify 改写的回执按 J-4 存档并还原。
4. 验收与判断：一个主力档代理（小轮合并），覆盖 R4 六张与 130、133、134 的相关条款，并核对 R3 已通过各单没有回退。
5. 一次链写：SUB-107…112 转 done（planned → ready → active → done，18 个转态），受影响 Story 的 summary 更新，INIT 注解，R4 lessons 落卡。
6. 收口：写收口文件（closeout.md，停在推送前），以本判断 §3 为 Owner 清单底稿、按 R4 判断更新；然后做收口步骤（§2.3 第 1 条）。额度触顶时停在原地等重置，不为此改方法。

### §5.3 R4 之后

- R4 六张都达成、R4 末 verify 全绿且 storybook:build 退出 0、R4 判断没有新的非 Owner 返工时：R4 之后即写收口文件。届时剩余工作全部阻塞于只有 Owner 能做的事：S-1（库门配置，13 张转 done 的前提）、S-2、S-3、S-4、S-5、S-6，以及 N-1…N-6、M-1 的表态与对 O-1…O-4、J-1…J-12 的事后更正；每个阻点在收口文件写明。
- 需要 R5 的情形：R4 的某张经济单被验收退回一次，按派工规则升主力进 R5（小轮，同样由一个主力档代理做验收与判断）。主力项再被退回即停下写进收口文件交 Owner；R4-6 的非视觉检查红、或出现预期外的签名变化而原因只有 Owner 能定（如 N-1 改色），也直接进收口。
- 最可能出事的地方：R4-4 的加句让 story 超高或带出意外的签名变化；新中文译文缺字形（fonts-vendor --check）；四语值与已有词条同值导致反查串键；R4-2 的数字抄错（以门源码为准）。

### §5.4 R4 不做时直接写收口文件的条件

只有 Owner 在 R4 派工前明确表示接受这 7 条为已知余项（或改选方案 B 并把文档回写一并留到后续批次）时，才跳过 R4 直接写收口文件，并在收口文件把 §2.2 六项逐条列为遗留、写明影响（清单第 128 行的夜间色会让目视误判；契约 README 的门说明与门不符；台账与渲染分叉）。额度不足不是跳过 R4 的理由：触顶就停在原地等重置。
