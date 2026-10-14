# TCRN-DS-INIT-016 · R5 拆分

本文件是 R5 拆分子代理的产出：R4 判断（`runs/r4/judgment.md`）§2 的返工清单 R5-1…R5-4 拆成 4 张 Subtask（TCRN-DS-SUB-225 至 TCRN-DS-SUB-228），挂在原 Story 下（R5-1 挂 146，R5-4 挂 147，R5-2、R5-3 挂 150），分 2 个包、2 个波次。口径按判断 §3.1「不裁时的默认」（O-19 的 C8 与 O-4 的 markText 不派）与 §3.3、§3.4（视为约定）；分包照判断 §5 与 §3.4 第 12 条：Q1（主力，W1）只做 R5-1，Q2（经济，W2）做 R5-2、R5-3、R5-4，Q1 合入后派、读 Q1 交回。链上 Story 的 scope 是任务权威；本文件只是拆分与分包，不是第二份 scope。拆分时发现的矛盾与缺口见 `problems/decomposition.md`，包表、波次与共享文件先后见 `packages.md`，机读清单见 `subtasks.json`，落链载荷见 `subtasks-batch.json`（4 个 work-create 成员，由主线程落链）。

读法：本文件按节读。第 1 节是跨包约定（编号沿用 R4 的 C-1 至 C-17，每个包都必须遵守，改约定须回拆分）；第 2 节是总览（返工编号对照、Story 对照、依赖图、拆分取舍、风险）；第 3 节按 Story 列 Subtask，每张一节，节标题为 `#### TCRN-DS-SUB-NNN · 标题`，可按节切摘录。文中行号是集成分支 claude/init016-tab-shell 上 HEAD e061961（代码同 682fc94）的位置，先 grep 再改。

节行号：§1 L9；§2 L35；2.1 L37；2.2 L48；2.3 L58；2.4 L67；2.5 L76；§3 L86；SUB-225 L92；SUB-226 L119；SUB-227 L136；SUB-228 L150。

## 1. 跨包约定（实施包必须遵守，改约定须回拆分）

1. **C-1 依据、沿用与作废。** 本轮工作全部来自 R4 判断 §2 的 R5-1…R5-4；Owner 待裁项按判断 §3.1「不裁时的默认」做（C-6），判断 §3.3 的授权外清单与 §3.4 的口径视为约定（C-7），分包照判断 §5 与 §3.4 第 12 条。R4 拆分第 1 节（`runs/r4/decomposition.md` 第 9–43 行）按下表处置，与本节冲突时以本节为准。
   - 继续有效：R4 C-3（命令形态与红线，本节 C-3 重申）；R4 C-8 的样式规则（本节 C-8 改本轮范围）；R4 C-9 的回执与生成物规则（本节 C-9 改持有者并写明 Q1 的两种例外）；R4 C-10（本轮仍无新文案）；R4 C-12 已落地的五个接口（以合入后的代码为准，见 C-12）；R4 C-13 的交法（本节 C-13 改持有者）；R4 C-14（本节 C-14 补本轮停下条件）；R4 C-15（本节 C-15 列本轮接收单）；R4 C-16（本节 C-16 写本轮升档）；R4 C-17。经 R4 C-1 继续有效的 R3、R2、R1 各条照旧有效。
   - 改写：R4 C-2（本轮仍不新增 token，R5-1 只用现有 `--tcrn-space-1`，见 C-2）；R4 C-4（包树与分支名改 r5、包名 Q1、Q2，见 C-4）；R4 C-5（已知红改为 R4 批末读数，措辞按判断 §0，见 C-5）；R4 C-6（O-18 名单改为 SUB-180、184、185、214，见 C-6）；R4 C-7（授权范围按 R4 判断 §3.3、§3.4，见 C-7）；R4 C-11（迁移说明与 CHANGELOG 只由 SUB-227 改，从 M53 起追加，见 C-11）。
   - 作废：R4 各条里按 R4 Subtask 与包写的持有者名单（C-2 的 SUB-216，C-8 的 N1、N3，C-9 与 C-13 的 SUB-224，C-11 的 SUB-223，C-12 的落地单与消费单，C-15 的接收单）与 R4 C-5 的三条过渡红，由本轮 `packages.md` 与本节 C-5、C-8 至 C-15 取代。
2. **C-2 本轮不新增 token。** 判断 §3.3、§3.4 第 3 条：R5-1（SUB-225）只用现有的 `--tcrn-space-1`（4px，`packages/ui-tokens/src/tokens.css:198`）；任何包需要新 token、改契约 `tokens.json` 或其生成物，停下记问题。契约生成物（tokens.json、icons.json、matrices.json、marks.json）本轮都不改。
3. **C-3 命令形态与红线。** 同 R4 C-3：局部门一律写成 `corepack pnpm@10.12.1 -C <包树> run <脚本>`、`corepack pnpm@10.12.1 -C <包树> exec node <脚本>` 或 `corepack pnpm@10.12.1 -C <包树> --filter <包名> <脚本>`；git 用 `git -C <包树>`；不 cd、不 rm（仓内删除用 `git rm`，临时产物移进会话 scratch 的 trash）；只写包树与会话 scratch。`--filter @tcrn/ui-react test` 之前先 `run build`（ui-react 的单测跑 `dist`，未构建时 0 条测试也退出 0；判断 §3.4 第 12 条引的跨包通告第 1 节）；根 `pnpm test` 在第一个红的包就停（KB-030），看某个包用 `--filter` 单跑。不新增依赖，不改 `pnpm-lock.yaml` 与任何 `package.json`（安装是停点；自检都写在已有测试文件或门脚本内，不新增 package.json 脚本）。任何文件（含未跟踪文件、交回与问题文件）不得出现本机用户目录下凭据、钥匙串或应用数据目录的绝对路径，不得有以 KEY、TOKEN、SECRET、PASSWORD、SESSION、AUTH、API 结尾的名字（大小写都算）紧跟等号开头的行，不得写入 `scripts/no-private-input-scan.mjs` overclaim 短语表里的英文短语（摘录与交回都不抄原文）。
4. **C-4 包树、合入、提交与交回。** 集成分支 `claude/init016-tab-shell`。Q1 在会话 scratch 的 `pkg/r5-q1`、分支 `claude/init016-r5-q1` 上做，从集成分支当前 HEAD 切出；Q2 在 `pkg/r5-q2`、分支 `claude/init016-r5-q2` 上做，Q1 合入集成分支后从合入后的 HEAD 切出（Q2 读 Q1 交回）。合入由主线程按 Q1 → Q2 做；冲突交集成子代理。按 Subtask 提交，提交信息带 TCRN-DS-SUB-NNN；作者 tpmoonchefryan，不加 Co-Authored-By；不推送、不打 tag、不发版、不部署。每包交回 `runs/r5/handoff/<包>.md`：提交列表；写明的选择与回显项；「迁移条目」「目视项」「待发布清单」「待补五语键」「期望过期」各节，没有就写无；局部门结果摘要（读数对照判据逐条写）；接续点。见红只记写 `runs/r5/problems/<包>.md`（同一根因算一条）。局部门只跑本包列出的门，同一门不为求稳重复跑（判据写明的变异、应用基线后的确认除外），不跑 verify。Q1 预计 70、Q2 预计 45 响应，每包不超过 150，逼近 180 时提交干净状态、写接续点交回。
5. **C-5 见红只记、已知红与过渡红。** 包内看到不属本包 Subtask 的红，记一句「既有红，归 SUB-NNN（<包>）」或「既有红，待 Owner（O-19 或 O-4）」，不修。开工时的已知红是 R4 批末 verify（682fc94：30 步红 2、44 段红 2，与 R3 相同）：第 13 步 contract:static 只剩顶带 C8 15 条（静态 `yield-without-min-width` 1、story 层 `story-yield-missing` 14，待 O-19）；第 18 步 geometry:measure 只剩 markText（DS 品牌首行 `lkr-line@22:design-system` 1.4、底栏 TMS 锁定块 `lkr@22:tms` en 1.7，待 O-4）。两处 R5 都不派（判断 §3.3、§5），全轮照红，任何包不为它们改门、加豁免、撤登记。措辞按判断 §0 与 §3.4 第 9 条：交回、问题与清单写「DS 品牌首行」，不写「DS 侧栏首行」（壳里没有侧栏）。本轮的过渡红与预期新发现：
   - SUB-225 把裁切余量从 2px 改 4px；静止态的描边在 2px 内已画出，browser-proof 的视觉签名预计全在容差内。越容差时由 SUB-225 只收越容差的条目（C-9 情形 (a)；KB-043），不整批重收。
   - SUB-225 的变异（内层余量临时改回 `--tcrn-space-0h`）只在包树里做，ui-react 单测判红后立即复原，不提交，不留在任何交回读数以外的地方。
   - Q2 只改文档与一处注释，不改渲染；它跑的门出现的红按本条首句记。
6. **C-6 Owner 待裁项的默认口径（判断 §3.1，共 20 项，本轮无新增）。** 未裁前不改判据、不改 Story：O-1 长字标截断加 title，宽度不改；O-2 148-GWT1 记部分；O-3 级联越界维持现写法；O-4 墨迹中线照 ±1 判，markText 红；O-5 只改件数、不画实心态；O-6 图钉获焦才显；O-7 文档站头像与目录宽 144 维持现状；O-8 夜间后缀两主题同色、标红、pending；O-9 AOS 占位并标明；O-10 头像菜单现写法；O-11 窄屏按视口切；O-12 下拉不显示 ⌘K；O-13 纸升起 10；O-14 字重按板实现；O-15 Sheet 夜间遮罩与下一级现写法；O-16 纸内页标题行高 30；O-17 TreeNav 归宿现写法；O-18 批末 verify 不加 test:dom（SUB-180、SUB-184、SUB-185、SUB-214 的 DOM 用例只由局部门看；SUB-225 不新增 DOM 用例）；O-19 顶带 C8 照判，contract:static 红，登记保留，SUB-113、125、142、155、178、191 保持 active；O-20 Sheet 实现照板，Story 144 的文字不改。O-19 与 O-4 本轮不派任何改动。条件项（不是新 O 号，判断 §3.1）：R5-1 若在 R5 再被退回，停下，「可折叠区获焦焦点环被裁」作为已知差距交 Owner（C-16）。
7. **C-7 授权范围（判断 §3.3、§3.4）。** 授权外不做：放宽任何阈值（markText 照 ±1；C8 照判；不给已全量检查的家族加豁免；不撤顶带登记；smoke、browser-proof 与各门的期望不放宽；不抬扫描上限；视觉签名的阈值、签名算法与选择机制不改）；新增 token；改板、07a / 07b 字句与画布画法；改 measure-shell.js；改 Story 文字（O-14、O-20）；改批末 verify 的组成（O-18）；声明或绕过库门（S-1）；安装 Playwright WebKit 或开 safaridriver（安装与改宿主设置都是停点）；新增依赖与 package.json 脚本；推送、打 tag、发版、部署、发布画布。本轮不改任何门的判定语义：SUB-225 只收紧 ui-react 单测的断言；SUB-226 只改注释，判定与导出不动；几何门 `cutOf` 不认 clip margin 属门读法余项，不改。判断 §3.4 第 7、8 条列入收口已知差距的各项（C4-2 的两份门脚本、`cutOf`、brandDigest 覆盖面、axe 主区位置、「根类全有家族」守护测试、`.tcrn-segmented-nav` 白名单、G+ 禁形补 `--tcrn-color-acc-bg`）都不进 R5，任何包不顺手做。
8. **C-8 样式模块与段登记。** 沿用 R4 C-8 的规则：包样式只进现有模块；状态规则特异性不高于变体、不含颜色；几何逐值来自 token。本轮只有 SUB-225 改包样式（`base.css.ts` 里 `.tcrn-collapsible-region__inner` 的一个值与其注释），没有包新建段，`styles/index.ts` 与段首标记不动；`actions.css.ts`、`shell.css.ts` 只读。文档层样式（`alpha-styles.ts`、`story-demo-styles.ts`、`storybook.css`）本轮无人改。
9. **C-9 回执、门报告与生成物。** `docs/verification/**` 本轮只在两种情形下由 SUB-225（Q1）提交（判断 R5-1 改法第 4 项、§3.4 第 12 条），这是本轮唯一一次生成物再生（批量原则第 4 条）：(a) browser-proof 有越容差的视觉签名：先按 KB-022 给现行应用记录 `visual-selection-application.json` 改名（`-init016-r3` 已占用，默认 `visual-selection-application-init016-r4.json`，与现有 `-r3`、`-r4`、`-init016-r3` 都不撞名），选择文件默认 `visual-baseline-selection-r5.json`，只收越容差的条目，逐条写理由与离群类别；(b) 回执与门报告相比已提交版有实质变化（读数或判定变了；只差时间、时长、运行标识或随源码变的输入摘要不算，问题文件第 8 条）。`internal-alpha/no-overclaim-scan.json` 与 scaffold 的两份回执（`scaffold-proof.json`、`scaffold-proof.md`）的漂移照惯例还原。其余情形，以及 Q2 跑的门写出的文件，跑完 `git -C <包树> checkout -- docs/verification`，新出现的未跟踪文件移进会话 scratch 的 trash；`visual-selection-result.json` 永不入仓；`internal-alpha/no-overclaim-scan.json` 由主线程在最后一次文档提交时再生。`owner-acceptance.md` 本轮只由 SUB-228（Q2）改，Q1 把目视项与读数写进交回。
10. **C-10 文案与五语。** 本轮没有新文案：`components/Navigation/shell-copy.ts`、`storybook-content-text.ts`、`storybook-locale-text.ts`、`locale-invariant-ledger.mjs` 本轮无人改。需要新键时停下，写进交回「待补五语键」。
11. **C-11 迁移说明与 CHANGELOG。** `docs/migration-4.0.md` 与 `CHANGELOG.md` 本轮只由 SUB-227（Q2）改，条目从 M53 起追加。判断 R5-2 与 §3.4 第 4 条照 R3 判断 §3.4 第 6 条的同一范围放开「只追加」：开头的两处区间（第 7 行与第 26 行的「M20 to M52」）与「By consumer」三份清单（读 M30 的三处：TCRN AOS 第 23 条、TCRN TMS 第 14 条、Einzbern portal 第 13 条）；末尾按轮次的来源说明照 R4 SUB-223 的做法追加一条（问题文件第 4 条）；CHANGELOG 4.0.0 段的迁移摘要同步一句。M1–M52 正文（含 M30 末段）不动。R5-1 没有迁移条目（判断 R5-1），Q1 交回「迁移条目」写无。
12. **C-12 本轮没有新接口。** R4 C-12 的五个接口（`productMarkIdOf`、真件纸内焦点探针 `paperFocusRing`、视觉签名截法、`families.json` 补登、弃用提示的跳过规则）都已落地，以合入后的代码为准。SUB-225 只换一个 token 引用，不改导出面、组件 API 与样式段。
13. **C-13 Owner 目视与待发布清单。** `owner-acceptance.md` 只由 SUB-228 改（C-9）。Q1 把新增或变化的目视项写进交回「目视项」：Disclosure 获焦焦点环四边（Chromium 读数；Safari 与 Chromium 内核各看一遍，G-18）、展开与收起动画中区域底外最多 4px 内容可见（判断 R5-1 代价）、有重收时的离群项逐条。待发布清单：本轮预计为无（measure-shell.js 不改、不新增 token、不改板）；出现时写进交回，交设计会话，本轮不发布画布。
14. **C-14 质量硬线与停下条件。** START「质量硬线」两段（第一批 C1–C17 与壳层新增硬线）对每个包有效，SUB-225 承接其中「任何元素不超出裁切祖先」与焦点可见。遇到下列情况停下写进包问题文件，不扩大授权：要新增 token；要改 Icon 组件 API；要改 C-7 以外的门判定语义、阈值或比对字段（含几何门 `cutOf`）；要改不在本包文件集里的文件；要改按钮描边或焦点对的画法，或改走内距加负外距的写法；要装 WebKit 或开 safaridriver；要改 Shell 两块成品板或 07b 字句；要新增依赖或 package.json 脚本；要恢复已删的豁免；要动 C8 的登记、判定或组件的让步项（O-19）；要改 markText 的量法（O-4）。批内发现的新工作只记问题，进下一轮，不插入本轮。
15. **C-15 期望对齐。** 改动会让某个门的期望过期的包，在同包里对齐那条期望：门脚本或测试在本包文件集里的，本单直接改，并在交回写明改了哪条；不在本包文件集的，按 `packages.md`「期望对齐的接收」交给该文件的下一个持有者，在交回「期望过期」一节逐条写明（文件、行、旧期望、新读数、来源 Subtask）。本轮的接收：`Layout.test.tsx` 的 SUB-216 用例由 SUB-225 同单收紧；视觉签名基线（SUB-225 让条目越容差时）由 SUB-225 同单只收越容差的条目；`owner-acceptance.md` 由 SUB-228 按 Q1 交回与 M53 对齐；迁移说明 M30 末段的过期事实由 SUB-227 追加 M53 对齐（M30 不动）；`doc-shell-class-proof.mjs` 第 147 行注释由 SUB-226 对齐。
16. **C-16 一次做对与升档。** 每张 Subtask 的判据最后一项是「一次做对的验收」：交回必须给出该项要求的实测读数（不是只说「门绿」）；读数与判据不符时不得交回为完成，写进问题文件并说明差在哪里；读法、阈值、期望值一律不为求绿而改。升档按 START「起始档与升档」与判断 §2 首段：SUB-225 是 R4-3 同一修复目标的第一次退回、已起主力，R5 再被退回就停下，「可折叠区获焦焦点环被裁」记入收口文件交 Owner（判断 §3.1 条件项）；Q2 的三张再被退回时升主力。
17. **C-17 前置列只写包号。** `packages.md` 包表的「前置包」列只写包号并逐个列出（Q2 写 Q1），调度工具按包号判断就绪。

## 2. 总览

### 2.1 返工编号 → Subtask（4 条，一条不漏）

| R5 项 | Subtask | 包 / 波 | 父 Story |
| --- | --- | --- | --- |
| R5-1 | TCRN-DS-SUB-225 | Q1 / W1 | 146 |
| R5-2 | TCRN-DS-SUB-227 | Q2 / W2 | 150 |
| R5-3 | TCRN-DS-SUB-228 | Q2 / W2 | 150 |
| R5-4 | TCRN-DS-SUB-226 | Q2 / W2 | 147 |

注：键号按父 Story 顺序编（146、147、150，同 R4 的编法），所以 R5-4 的键号排在 R5-2、R5-3 之前；包内顺序按依赖，见第 2.3 节。R4 留下的两张 active 由本轮承接：SUB-216 由 SUB-225 承接，SUB-219（判据④）由 SUB-226 承接（判断 §4.1、§3.4 第 6 条）。

### 2.2 Story → Subtask

| Story | Subtask |
| --- | --- |
| 146 | TCRN-DS-SUB-225（Q1） |
| 147 | TCRN-DS-SUB-226（Q2） |
| 150 | TCRN-DS-SUB-227（Q2）、TCRN-DS-SUB-228（Q2） |

135、143、145、148、149 只等 Owner（O-19、O-4、O-2），136 只等 O-8，137–142、144 没有 R5 返工项（判断 §1 结论表）。R5-3 的第 1、2 项改的是 140、141 的清单文字，照判断挂 150（清单属 150-GWT3），140、141 不另挂单（问题文件第 6 条）。

### 2.3 依赖图

```
W1  Q1: SUB-225（无依赖）
W2  Q2: SUB-226 → SUB-227 → SUB-228（硬依赖：SUB-228 ← SUB-225（Q1 交回的焦点环读数、是否重收、是否提交再生回执）与 SUB-227（M53 的号）；SUB-226、SUB-227 不依赖别的单，包内靠前）
```

关键路径同判断 §5：Q1 → Q2 → 批末 verify。

### 2.4 拆分取舍（与判断 §5 的关系）

包的组成、档位、波次与前置全部照判断 §5 与 §3.4 第 12 条。拆分的取舍有四处，都不改调度：

1. **一项一张。** 4 条返工各一张。R5-3 的五项改法同改 `owner-acceptance.md` 一个文件、按内容自下而上改，拆开会让各张互相改错行号（KB-024），合为 SUB-228 一张。
2. **键号按 Story、包内按依赖。** 键号按父 Story 排（146 → 147 → 150）；Q2 包内先做无依赖的 SUB-226（注释），再做 SUB-227（出 M53 的号），最后 SUB-228（读 Q1 交回与 M53）。
3. **Q2 的门各跑一次。** 三张都只改文档与注释：build、storybook:build 在包开头跑一次（doc-shell:proof、public-output:scan、internal-vocab:scan 读 `packages/ui-react/dist` 与 `apps/storybook/storybook-static`）；scaffold:proof、readme:proof、public-output:scan、internal-vocab:scan 在 SUB-227 改完后跑；scan 在三张都改完、交回与问题文件写好后跑一次（KB-020，它扫整棵工作树）。
4. **Q1 的探针不入仓。** 判断 R5-1 改法第 3 项的探针在会话 scratch；可复用 R4 验收 B 片留在会话 scratch 的 `acc-r4-B/probe/`（`disclosure.mjs`、`disclosure-sum.cjs`、`clip-ancestors.mjs`），复制到本包的 scratch 工具目录再改。

### 2.5 风险

- **R5-1 让个别签名越容差**（判断 §5，预计没有）：Q1 包内按 C-9 (a) 只收越容差的条目（KB-022、KB-043），离群项由 SUB-228 写进第五轮目视节。
- **Safari 不认 `overflow-clip-margin`**：机读不到，靠 G-18 目视（判断 §3.2；装 WebKit 是停点，KB-042）。
- **R5-1 再被退回**：停下，记入收口文件交 Owner（C-16）。
- **Q2 在清单里插行会让判断引用的行号错位**：按内容定位、自下而上改，交回写新行号（KB-024）。
- **SUB-219 判据④的 grep 会命中迁移说明 M50 的删除记录**：问题文件第 1 条；SUB-226 按排除迁移说明的 grep 读，两个读数都交回。
- **O-19、O-4 不裁时 R5 全绿也停在 verify 第 13、18 步**（判断 §5）：届时 R5 合并判断若没有新的可做返工，应写「R6 无返工、建议收口」。
- **规模**：实施 115 响应（Q1 70、Q2 45），加拆分约 30、合并验收与判断约 150，整轮约 300（判断 §5）。

## 3. 按 Story 的 Subtask

### TCRN-DS-STORY-146 · PageHeader 必有（面包屑 + 标题 + 动作，单行截断加 title）；Surface、Divider、SplitView、DetailLayout、SettingsLayout 在纸内重排；文档与设置页内容居中 1040

1 张：TCRN-DS-SUB-225（父单 work:792b63bc73100197f6f41e96）

#### TCRN-DS-SUB-225 · 可折叠区内层裁切余量改为 space-1：Disclosure 区内控件的获焦焦点环四边不被裁，单测按焦点对与 forced-colors outline 的最大外扩断言

- 承接：R5-1（R4-3 同一修复目标的第一次退回；主力；硬线）；来源 B4-1、N1 问题 2、R3 判断 R4-3 → SUB-216；承接 SUB-216 的余项（判断 §4.1）
- 包 / 波：Q1 / W1（主力）；包内第 1 张（TCRN-DS-SUB-225）
- 改动文件：`packages/ui-react/src/styles/base.css.ts`，`packages/ui-react/src/components/Layout/Layout.test.tsx`，`docs/verification/**`（只在 C-9 两种情形：越容差时的基线、选择文件与改名后的应用记录，或有实质变化的回执与门报告）
- 依赖：无
- 判据：146 符合性与 START 硬线「任何元素不超出裁切祖先」、焦点可见（GWT1–4 不变；KB-041：判据写全元素的外扩绘制）：① `base.css.ts` 第 2399–2403 行 `.tcrn-collapsible-region__inner` 的 `overflow-clip-margin: var(--tcrn-space-0h)`（第 2402 行）改为 `var(--tcrn-space-1)`（4px，`tokens.css:198`）：它等于 `--tcrn-focus-ring`（`tokens.css:44、291`，2px 承载面间隙加外扩到 4px 的强调色环）的最大外扩，也等于 forced-colors 下按钮焦点 outline 的宽 2px 加偏移 2px；第 2395–2398 行注释改写为「裁切边外扩到控件的焦点对与描边」（不再只写 1px 描边），可引纸内焦点对的同一读法（`shell.css.ts` 第 941–947 行「the accent ring to space-1」）。`overflow: clip`、`min-height: 0`、内层无内距无边框、`.tcrn-collapsible-region` 的 `grid-template-rows: 0fr / 1fr` 过渡都不变，不新增 token（C-2）。② `Layout.test.tsx` 第 66–81 行的 SUB-216 用例收紧（标题改带 TCRN-DS-SUB-225）：用已引入的 `createTokenMap()`（第 6、18 行）读出 `--tcrn-focus-ring` 各层的 spread（每层第 4 个长度）取最大值，断言内层 margin token 的 px 不小于它；再从 `tcrnComponentCss` 读按钮焦点 outline 规则（`actions.css.ts` 第 114–118 行 `.tcrn-button:focus-visible, .tcrn-link-button:focus-visible`：`outline: 2px solid transparent; outline-offset: 2px`，注释写明 forced colours 下由系统重着色；`.tcrn-link-button:focus-visible {` 在第 115 行独占一行，现有 `topLevelRule` 可读），断言 margin px 不小于 outline 宽加偏移；现有的 `overflow: clip`、`min-height: 0`、无 padding / border、`0fr` / `1fr` 断言保留（问题文件第 3 条）。③ 变异：包树里临时把余量改回 `--tcrn-space-0h`，`--filter @tcrn/ui-react build` 后跑 `--filter @tcrn/ui-react test`，收紧后的用例判红（交回写失败的断言与读数，2 对 4），随即复原，不提交变异。④ 一次性只读探针（会话 scratch，不入仓），在本包 storybook:build 产物上：`interaction-disclosure-spec` 在 1440、1024、390 浅色 en 与 1440 夜间 zh-CN，再加 Playwright 的 forced-colors 仿真一遍；键盘获焦「Focusable only while expanded」后，四边外第 3、4 行 / 列都是环色（forced-colors 下是 outline 的系统色）；收起态区域与内层 0 高且不可见；展开区域高 100 / 100 / 100、无标题 CollapsibleRegion 48 / 68 / 68，与 R4 相同。另量一处 Feedback 操作详情（`OperationFeedback` 的 DisclosurePanel，`Feedback.tsx` 第 246 行起，story 在 `story-content.tsx` 第 1764 行一带）与一处 AOS 视觉实例的 DisclosurePanel（`aos-frontend-shell-slice.tsx` 第 427 行或 `aos-owner-quality-product-shell.tsx` 第 527 行，默认收起，先展开）；区内没有贴边的可聚焦控件就照实写。⑤ 一次做对的验收，交回给读数：①的 diff；②的用例名与通过；③的变异读数；④逐视口、逐主题的四边第 3、4 行 / 列颜色与区域高；build、ui-react 单测、test:dom、typecheck、tokens:proof、contract:proof 退出 0；contract:static 的发现仍只有 C8 15 条（O-19）；geometry:proof 退出 0；geometry:measure 只剩 markText（DS 品牌首行 1.4、底栏 TMS 锁定块 en 1.7，O-4）；internal-alpha:browser-proof 的 nonVisualProofOk 为真、visualSignatureRegressions 读数（预计 0）与 `interaction-disclosure-spec` 各视口的签名距离；storybook:build 通过。越容差或回执有实质变化时按 C-9 处理，交回逐条写（越容差条目、理由与离群类别、改名后的文件名、提交了哪些回执与变化的字段）；都没有就写明，并按 C-9 还原 `docs/verification`。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-static-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-browser-proof.mjs --update-visual-baseline <选择文件>`（只在越容差时）
- 注意：Q1 的唯一一张（判断 §3.4 第 2、3 条）。建议顺序：改①② → build → ui-react 单测（绿）→ ③变异（`--filter @tcrn/ui-react build` 后单测判红）→ 复原 → test:dom（其脚本先重建 ui-react，复原后不必另建）→ typecheck、tokens:proof、contract:proof、contract-static → storybook:build → 探针 → geometry:proof、geometry:measure、browser-proof。只在越容差时用 `--update-visual-baseline` 应用选择，应用后再跑一次 browser-proof 确认（这两次不算重复跑）。不做：不新增 token；不改按钮描边与焦点对的画法；不走内距加负外距（改动面大，收起态要另量）；不改几何门（`cutOf` 不认 clip margin，判断 §3.4 第 8 条）；不装 WebKit（KB-042；WebKit 是否认 `overflow-clip-margin` 仍未核，取值改大不改变这一点）。代价：展开、收起动画中区域底外最多 4px 内容可见（现为 2px），写进交回「目视项」，并入 G-18。迁移条目：无（C-11）。写 `docs/verification` 的门跑完按 C-9 处置。

### TCRN-DS-STORY-147 · Storybook 文档站改同一套顶带壳：文档壳只用包的 ProductShell 顶带态，删 tcrn-doc- 骨架的壳层部分、4 条文档作用域例外与 2 条重复选择器白名单项，文档目录改页内 TocRail，包外 tcrn- 类保持 0

1 张：TCRN-DS-SUB-226（父单 work:6fd15b4e5366871194d862ab）

#### TCRN-DS-SUB-226 · doc-shell-class-proof 的 selectorTokens 注释示例换成在用的类：已删的 .tcrn-doc-brand 改为 .tcrn-doc-page，判定与导出不动

- 承接：R5-4（经济；只改注释）；来源 C4-1(c)、N3 问题 1、SUB-219 判据④；承接 SUB-219 的余项（判断 §3.4 第 6 条）
- 包 / 波：Q2 / W2（经济）；包内第 1 张（TCRN-DS-SUB-226 → TCRN-DS-SUB-227 → TCRN-DS-SUB-228）
- 改动文件：`scripts/doc-shell-class-proof.mjs`（只改第 147 行注释）
- 依赖：无
- 判据：147（SUB-219 判据④「删后同一 grep 为 0」的余项）：① 第 147 行 JSDoc `/** Class names in a selector string such as ".tcrn-doc-brand, [data-x]". */` 的示例类换成在用的 `.tcrn-doc-page`（`apps/storybook/src/alpha-styles.ts:98` 在用，改前再 grep 一次），只换类名；`selectorTokens`（第 148 行起）的判定、正则与导出不动，文件其余行不改。② 一次做对的验收：改后跑 `git -C <包树> grep -n -E 'tcrn-doc-(eyebrow|claim|search-results|search-result|search-empty|brand)([^a-z0-9-]|$)' -- . ':!docs/verification' ':!docs/dispatch' ':!docs/migration-4.0.md'`，结果为 0；同一 grep 不排除迁移说明时只剩 `docs/migration-4.0.md` M50 删除记录的 3 行（第 1366–1368 行，C-11 不改 M1–M52；问题文件第 1 条），交回两个读数都写；doc-shell:proof 退出 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
- 注意：Q2 的第 1 张。build 与 storybook:build 是 Q2 三张共用的前置（doc-shell:proof 读 `packages/ui-react/dist` 与 `apps/storybook/storybook-static`），在包开头跑一次。本脚本在自己的 `referenceExclude` 里，注释改了不影响读数。doc-shell:proof 写 `docs/verification` 时跑完按 C-9 还原。迁移条目、目视项都是无。

### TCRN-DS-STORY-150 · 4.0.0 候选：版本面、CHANGELOG 发布段、消费方迁移说明（第一批破坏性变化 + 壳层退役项）、pack 冒烟、Storybook 构建、Owner 目视验收清单（第一批与第二批合一）

2 张：TCRN-DS-SUB-227、TCRN-DS-SUB-228（父单 work:b140305693da159bfdc615c8）

#### TCRN-DS-SUB-227 · 迁移说明追加 M53：三族块数、补登的 9 个根类与顶带 C8 工具栏登记，M30 末段不再成立；开头区间、分消费方清单与 CHANGELOG 摘要同步

- 承接：R5-2（经济）；来源 B4-2、C4-1(a)、N4 问题 1（同一根因：SUB-191、SUB-215 改了登记，M30 没人跟；KB-044）
- 包 / 波：Q2 / W2（经济）；包内第 2 张（TCRN-DS-SUB-226 → TCRN-DS-SUB-227 → TCRN-DS-SUB-228）
- 改动文件：`docs/migration-4.0.md`，`CHANGELOG.md`
- 依赖：无
- 判据：150-GWT2（迁移说明逐条有步骤），条目内容属 143：① 按 C-11 只追加：在 M52（第 1410–1424 行）之后、`## Deprecated token names`（第 1425 行）之前加 `### M53 · …`，Change / Do / Source 三段，写法同 M49–M52。Change 写：`docs/contract/families.json` 的 navigation 现为 11 块、shell 19 块、inputs 16 块；SUB-215（f29fb30）补登的 9 个根类为 navigation 2（`tcrn-nav-item-row`、`tcrn-nav-pin`）、shell 5（`tcrn-shell-cluster`、`tcrn-shell-account`、`tcrn-shell-avatar`、`tcrn-shell-bell`、`tcrn-shell-sheet`）、inputs 2（`tcrn-select-wrap`、`tcrn-date-picker-wrap`）；SUB-191（f26c633）起 `docs/contract/roles.json` 的 `toolbars` 把顶带登记为 C8 工具栏：容器 `tcrn-shell-strip`、让步项 `tcrn-shell-pins`、固定项 `tcrn-shell-brand` 与 `tcrn-shell-cluster`，C8 的判定待 O-19（照文末「Open Owner decisions」节的写法），`pnpm contract:static` 现报顶带 15 条；并写明 M30 末段（第 936–941 行）的「navigation lists 9」「shell lists 14」与「`roles.json` lists no toolbar」不再成立，M30 保持原文，它的逐件表与 components 仍准。Do 同 M30：从 `families.json`、`roles.json` 读，不抄数字。Source 写 f29fb30（TCRN-DS-SUB-215）、f26c633（TCRN-DS-SUB-191），handoffs N2（INIT-016 r4）与 M2（INIT-016 r3），注明由第四轮判断要求（R5-2）。② 开头两处「M20 to M52」（第 7、26 行）改为「M20 to M53」；第 24–33 行的来源说明不动（M53 引的交回目录都已列出）。③ 「By consumer」三份清单里读 M30 的三处补 M53：TCRN AOS 第 23 条（第 116 行一带）、TCRN TMS 第 14 条（第 172 行一带）、Einzbern portal 第 13 条（第 232 行一带）；只加条目号与必要的半句，各条其余文字不改。④ 末尾按轮次的来源说明，在「M47 and M48 come from the third round too …」一条（第 1545–1553 行）之后追加一条：M53 出自第二批第五轮（INIT-016 r5），加在 M20 至 M52 之后，它让 M30 末段的计数与 toolbar 一句不再成立，M30 保持原文（照该条写 M49 的方式）。⑤ `CHANGELOG.md` 4.0.0 段的迁移摘要在「Second batch, fourth round」一条（第 54–61 行）之后同步一句 M53。⑥ 一次做对的验收：交回给 node 读出的 `families.json` 三族 `blocks` 长度与 `roles.json` 的 `toolbars` 原值，与 M53 逐项对照；第 7、26 行读作「M20 to M53」，`M20 to M52` 只可能留在④的新条目里；三份清单各含 M53 一次；CHANGELOG 含「(M53)」一次；scaffold:proof、readme:proof、public-output:scan、internal-vocab:scan 退出 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run scaffold:proof`
  - `corepack pnpm@10.12.1 -C <包树> run readme:proof`
  - `corepack pnpm@10.12.1 -C <包树> run public-output:scan`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
- 注意：Q2 的第 2 张；迁移说明与 CHANGELOG 本轮只由本单改（C-11）。迁移说明 93 KB，按行段读（开头第 1–33 行、分消费方清单第 34–238 行、M30 第 897–949 行、M49–M52 第 1337–1424 行、末尾第 1497–1557 行）。KB-044：抄写的登记计数没有门看守，所以 Do 只写「从两份 json 读」，Change 里的数字注明是本轮的读数。M30 正文不动（判断 §3.4 第 4 条）。public-output:scan、internal-vocab:scan 读 SUB-226 时建好的 storybook-static，不必重建。写 `docs/verification` 的门（scaffold:proof、internal-vocab:scan 等）跑完按 C-9 还原。迁移条目就是本单本身；目视项无。

#### TCRN-DS-SUB-228 · 目视清单跟上第四、五轮：纸内焦点环、O-18 名单、E 段落点与第三轮离群表的过期处，G-18、G-21 与新增的第五轮目视节

- 承接：R5-3（经济）；来源 A4-1、C4-1(b)；R5-1、R5-2 落地后的同步
- 包 / 波：Q2 / W2（经济）；包内第 3 张，本轮最后一张（TCRN-DS-SUB-226 → TCRN-DS-SUB-227 → TCRN-DS-SUB-228）
- 改动文件：`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`
- 依赖：TCRN-DS-SUB-225（Q1；③④⑤⑧ 读 Q1 交回），TCRN-DS-SUB-227（Q2 包内靠前；M53 的号）
- 判据：150-GWT3（清单），内容分别涉及 140（目视项）、141（证据范围）、146（G-18），不改任何 Story 的结论。文件 60 KB，按行段读；按内容定位、自下而上改（插行后行号会移，KB-024）：① 第 390 行（待裁表 O-18 一行）「SUB-180、SUB-184、SUB-185 的 DOM 用例」的名单补「SUB-214（141-GWT4 的 DS、Mana 两例）」。② G-21（第 355 行）改为第五轮现状：「余下一处：……M30 写的块数过期……交判断」改为第五轮追加 M53（SUB-227，R5-2），写明三族块数与顶带工具栏登记，M30 保持原文；来源补 `runs/r5/handoff/Q2.md`。③ G-18（第 352 行）改为第五轮现状：展开区内层余量改为 `--tcrn-space-1`（SUB-225，R5-1），获焦焦点环四边完整，读数取 Q1 交回（Chromium，含 forced-colors 仿真），Safari 仍请同看（WebKit 是否认 `overflow-clip-margin` 未核）；「新发现：……仍被裁 2px（只记，交判断）」改为第四轮的读数并注明已由第五轮处置；来源补 `runs/r5/handoff/Q1.md`。④ 在「第四轮新增与变化的目视项」节之后、「待发布的成品板（交设计会话）」（第 311 行）之前新增「第五轮新增与变化的目视项」一节，格式同第四轮节：Disclosure 获焦焦点环（`interaction-disclosure-spec` 所在页，1440、1024、390 三宽，浅色与夜间；Safari 与 Chromium 内核各看一遍；来源 SUB-225（Q1）、G-18）；展开、收起动画中区域底外最多 4px 内容可见；Q1 交回的其余目视项；Q1 若有重收，离群项逐条列（story @ 视口、签名距离、请看、目视），没有就写一句「第五轮没有重收」。⑤ 第 268 行（第四轮节 Disclosure 描边一行）里「获焦时焦点环的底边与起始边仍少外侧 2px（新发现，N1 问题 2）」改为第五轮已处置（余量 space-1，见 G-18 与第五轮节），Safari 一句保留。⑥ 第三轮离群表前的说明段（第 233 行「视觉签名离群项（A 类，maxCell > 40；……」）末尾加一句：签名已由第四轮按新截法整批重收，表中是第三轮读数，Disclosure 的现状见 G-18。⑦ 第 218 行（第三轮节「纸内焦点环」一行）原句后补：「文档壳的纸内可以滚动，获焦时底边被伸到纸边的 story 卡片盖住，滚到底后换成顶边被盖（内收阴影画在内容之下；R3 判断 §3.2，请 Owner 目视时定是否接受）」。⑧ 第 208、201 行（第 8 节 E 段落点「M20 至 M29」）改为第二批全区间「M20 至 M53」，注明 ⌘K 见 M41、M52；写「第四轮批末读数」的第 203、178 行各只补一句「第五轮只改可折叠区内层的裁切余量，其余同第四轮批末」，不预写第五轮批末读数（由 R5 合并验收核对）；第 19 行的回执入口句只在 Q1 交回写明提交了再生回执时补一句由 SUB-225 再生了哪些，否则不动（问题文件第 5 条）。⑨ 一次做对的验收：交回列每处改动的新行号；grep 核对 O-18 一行含 SUB-214、`M20 至 M29` 为 0、第 201 与 208 行（插行后的新行号）读作「M20 至 M53」、「第五轮新增与变化的目视项」节标题 1 处、G-18 与第 268 行不再把「仍被裁 2px」写成现状；scan 退出 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run scan`
- 注意：Q2 的末张，也是本轮最后一张；`owner-acceptance.md` 本轮只由本单改（C-9、C-13）。scan 扫整棵工作树（含未跟踪文件与 `runs/r5/handoff/`、`runs/r5/problems/`，KB-020），在三张都改完、交回与问题文件写好后跑一次；它写 `docs/verification/internal-alpha/no-overclaim-scan.json`，跑完按 C-9 还原。清单不写 overclaim 短语表里的英文短语。Q1 交回没有越容差条目时，④的离群项只写「第五轮没有重收」。迁移条目、待发布清单都是无。
