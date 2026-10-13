# TCRN-DS-INIT-016 · R1 拆分

本文件是 R1 拆分子代理的产出：16 张 Story 拆成 28 张 Subtask（TCRN-DS-SUB-113 至 TCRN-DS-SUB-140），分 15 个包、9 个波次；第一个包 P1（STORY-135 → 136 → 137 → 138 → 139 → 140）按 START 单链按序，预计超过 150 回合，切成同一分支上首尾相接的四段 P1a、P1b、P1c、P1d。链上 Story 的 scope 是任务权威；本文件只是拆分与分包，不是第二份 scope。scope 矛盾、数据缺口与冲突见 `problems/decomposition.md`，包表、波次与共享文件先后见 `packages.md`，机读清单见 `subtasks.json`，落链载荷见 `subtasks-batch.json`（28 个 work-create 成员，由主线程落链）。

读法：本文件超过 32 KB，按节读。第 1 节是跨包约定（编号 C-1 起，每个包都必须遵守，改约定须回拆分）；第 2 节是总览、依赖图与风险；第 3 节按 Story 列 Subtask，每张一节，节标题为 `#### TCRN-DS-SUB-NNN · 标题`，可按节切摘录。行号是 HEAD 28d2665（集成分支 claude/init016-tab-shell）上的位置，先 grep 再改。

## 1. 跨包约定（实施包必须遵守，改约定须回拆分）

1. **C-1 沿用与作废。** INIT-015 的约定（`docs/dispatch/2026-10-11-gplus-renewal/runs/r3/excerpts/conventions-r1-r2.md`、`runs/r3/decomposition.md` 第 1 节、`runs/r4/decomposition.md` 第 1 节）按下表处置；与本节冲突时以本节为准。
   - 继续有效：R1 第 1 条（token 变量名由契约定，颜色、阴影、焦点环、品牌后缀的 cssVar）、第 2 条（夜间选择器 `[data-tcrn-theme="dark"]`，主题无关 token 放独立 `:root` 块）、第 3 条（状态对变量；变体 (0,2,0)、状态规则 `:where(...)` (0,1,0)、只切换生效对不写颜色）、第 4 条（静态状态用 `data-tcrn-preview-state`，不用无前缀 `.is-hover`）、第 6 条（生成物只由 `scripts/contract-generate.mjs` 写，头注「由 contract 生成，勿手改」）、第 8 条（新门读包 CSS 从 dist 导入）、第 12 条（渲染文本不含工单键与内部词，新文案五语齐或登记进 locale-invariant-ledger）、第 13 条（按 Subtask 提交）；R2 第 2 条（派工档位与 150 回合、逼近 180 交回）、第 4 条（命令形态）、第 5 条（见红只记；复合门要看全貌时逐段跑，未执行的段记「未执行」）、第 7 条（生成物头 contract-sha256 覆盖其 contract files 行列出的全部契约文件）；R3 第 9 条（停下与退回）、第 10 条（额度触顶停在原地等重置，不为此改方法）；R4 第 4 条（新英文键四语齐，四语值不得与同语言其它键同值）、第 6 条（命令与扫描红线）、第 7 条（demo-styles-sync 读 dist 时按 build → 同步 → build）。
   - 改写：R1 第 5 条（CSS 段归属）由 C-8 改写；R1 第 10、11 条与 R2 第 6、8、10 条由 C-12、C-15 改写。
   - 作废：R1 第 7 条里「样板 = 构图一」的含义（id 保留不改，内容换顶带壳，见 C-9）；R1 第 9 条「测量库 API 在 W1 定稿」（本批 SUB-134 可改 gplus-measure 的 shellFrame 实现，不改既有导出签名；壳层门用新库，C-11）；R2 第 3 条、R3 第 3 条、R4 第 2 条（各轮的授权边界，由本批 Story scope 与 C-17 取代）；R3 第 4 条（O-1 旧几何期望的流转，随 O-1 撤回作废，改按 C-12）；R3 第 5 条与 R4 的文件持有（由本批 `packages.md` 取代）；R3 第 7 条（不新增测试文件）——本批新件带新测试文件；R2 第 9 条、R3 第 11 条、R4 第 8 条（各轮链上事项）——本批 Subtask 由主线程落链，包不写链；R2 第 11 条（P6、P7 的先后）。
2. **C-2 壳 token 名表（SUB-113 落地，全批引用）。** F 段名、`contract/tokens.json` 的 key（短横线，供 data.mjs 的 camel 映射）、cssVar、值如下；`packages/ui-tokens/src/index.ts` 的 token 名用 F 段的点分名（如 `shell.strip-h`），与 F 段 1:1。全部进 shell 组或 motion 组，主题无关。

   | F 段名 | key | cssVar | 值 |
   | --- | --- | --- | --- |
   | shell.strip-h | shell-strip-h | --tcrn-shell-strip-h | 52px |
   | shell.brand-h | shell-brand-h | --tcrn-shell-brand-h | 40px |
   | shell.brand-w | shell-brand-w | --tcrn-shell-brand-w | 134px（第一版纯标时宽自适应） |
   | shell.toggle | shell-toggle | --tcrn-shell-toggle | 20px |
   | shell.pin-h | shell-pin-h | --tcrn-shell-pin-h | 32px |
   | shell.pin-gap | shell-pin-gap | --tcrn-shell-pin-gap | 8px |
   | shell.pins-max | shell-pins-max | --tcrn-shell-pins-max | 6 |
   | shell.menu-gap | shell-menu-gap | --tcrn-shell-menu-gap | 6px |
   | shell.panel-w-expanded | shell-panel-w-expanded | --tcrn-shell-panel-w-expanded | 952px |
   | shell.pbar-h | shell-pbar-h | --tcrn-shell-pbar-h | 44px（加面板底内距 8 = 底栏带 52） |
   | shell.drop-w | shell-drop-w | --tcrn-shell-drop-w | 240px |
   | shell.drop-srch-h | shell-drop-srch-h | --tcrn-shell-drop-srch-h | 28px |
   | shell.cascade-gap | shell-cascade-gap | --tcrn-shell-cascade-gap | 4px |
   | shell.row-h | shell-row-h | --tcrn-shell-row-h | 32px（pointer: coarse 44） |
   | shell.srch-h | shell-srch-h | --tcrn-shell-srch-h | 40px（pointer: coarse 44） |
   | shell.pinb | shell-pinb | --tcrn-shell-pinb | 24px |
   | motion.intro 淡出 | intro-fade | --tcrn-motion-intro-fade | 120ms（= t-fill） |
   | motion.intro 位移 | intro-move | --tcrn-motion-intro-move | 240ms（= t-move） |
   | motion.intro 纸升起 | intro-rise | --tcrn-motion-intro-rise | 100ms |
   | motion.intro 上限 | intro-max | --tcrn-motion-intro-max | 700ms |

   退役：rail-w（--tcrn-shell-sidebar-width，220px）与 rail-w-collapsed（--tcrn-shell-sidebar-width-collapsed，52px）按现有 deprecated 机制登记、replacement 为 null、保留原值；topbar-h（--tcrn-shell-topbar-height）登记为指向 `var(--tcrn-shell-strip-h)` 的弃用别名。shell.panel-w（小面板）撤销、不新增；标单色版与 50% 不透明度不采用。除本表与 SUB-130 的布局 token（problems 第 7 条）外，本批不新增 token；需要时停下回拆分。
3. **C-3 命令形态与红线。** 局部门一律 `corepack pnpm@10.12.1 -C <包树> run <脚本>`、`corepack pnpm@10.12.1 -C <包树> exec node <脚本>` 或 `corepack pnpm@10.12.1 -C <包树> --filter <包名> <脚本>`；git 用 `git -C <包树>`；不 cd、不 rm（仓内删除用 `git rm`，临时产物移进会话 scratch 的 trash）；只写包树与会话 scratch。任何文件（含未跟踪文件、交回与问题文件）不得出现本机用户目录下凭据、钥匙串或应用数据目录的绝对路径，不得出现以 KEY、TOKEN、SECRET、PASSWORD、SESSION、AUTH、API 结尾的名字紧跟等号开头的行，不得写入 `scripts/no-private-input-scan.mjs` 的 positive-overclaim 短语表里的英文短语（摘录与交回都不抄原文）。
4. **C-4 包件与真件。** 新件一律放独立文件（`packages/ui-react/src/components/Navigation/Shell*.tsx`），不往 89 KB 的 `Navigation.tsx` 里加；`Navigation.tsx` 与 `base.css.ts` 按波独占（`packages.md` 共享文件先后表）。新件之间、新件与 `Navigation.tsx` 之间可以互相引用，但只在函数体内使用，不在模块顶层求值，避免循环引用在加载时出错。
5. **C-5 测量钩子（包件 DOM，门与 story 据此对齐）。** 壳根 `data-shell`（带 `data-state`：closed、expanded、drop、sheet）；顶带 `data-shell-strip`；标按钮 `data-tab` 加 `data-shell-brand="v1|v2"`，其内标 `svg[data-logo="<productId>"]`、示意槽 `data-shell-toggle`；固定项组 `data-pins`，每项 `data-pin="<id>"`，下拉已开的项 `data-open-pin`；右上簇 `data-cluster`；纸 `data-paper`；完整菜单 `data-panel="expanded"`、下拉 `data-panel="drop"`、Sheet `data-panel="sheet"`；级联列 `data-drop-col="2|3"`；搜索 `data-shell-search`；行 `data-shell-row`、分组行 `data-shell-group`，行内图标 `data-guide="prail"`、文字 `data-text="prail"`；图钉钮 `data-pin-button`；底栏 `data-shell-pbar`；锁定块 `data-lockup="lk|lk-line|lkr|lkr-line"`；登入动画 `data-shell-intro`（带 `data-intro-phase`）。语义与 `docs/design/gplus-2026-10/measure-shell.js` 读的画板钩子一一对应（画板 `.ts-*` 类 → 包件 data 属性），门库维护两套选择器（C-11）。各件的组件测试断言自己的钩子存在。
6. **C-6 品牌首行与图钉契约。** 首行 DOM（SUB-114 标按钮与 SUB-127 ProductLockup 首行变体共用，各自实现、不互相导入）：容器 `data-lockup="lkr-line"`（侧栏尺度）或 `"lk-line"`（锁定块尺度），内含 `svg[data-logo]` 与 `<b>{word} <em>{suffix}</em></b>`，后缀色 `var(--tcrn-brand-suffix-<id>)`，字号字重取 Brand 板 E 段原样（侧栏尺度 22 + 12.5/600），标与字标用 flex 居中，不用 line-height 微调；标按钮在其后加 20 的示意槽。图钉（SUB-123 定义，SUB-116、SUB-118 消费）：NavItem 与 NavGroup 新增可选 prop `pinned?: boolean`、`onPinnedChange?: (pinned: boolean) => void`、`pinLabel?: string`；给了 `onPinnedChange` 才渲染 24 常驻槽；钮 `aria-pressed` = pinned、aria-label 默认取五语「固定到顶带：{label}」/「从顶带取下：{label}」。ShellPins（SUB-115）收已按偏好排序的 `items: readonly { id, label, href?, hasMenu? }[]`、`selectedId`、`openId`、`onOpenChange`，并给出第 7 项起的 overflow id。
7. **C-7 菜单模型与浮层。** `ShellMenu.tsx` 导出菜单模型类型 `ShellMenuGroup { id, label, iconName?, items }` 与 `ShellMenuItem { id, label, href?, iconName?, children? }`，最多四级（分组 → 项 → 子项 → 四级）；ProductShell（SUB-119）用这套类型。「临时浮层」行为（点外部、Esc、选中即收，关闭后回焦触发键）写成 `ShellMenu.tsx` 导出的 hook，下拉与 Sheet 复用；⌘K / Ctrl+K 每个壳只注册一次。浮层定位用 Overlay 家族现有定位层，不新造。ShellMenu 自带呈现切换：宽于 760 为面板，≤ 760 为 Sheet（SUB-126 实现 Sheet，此前只有面板）；ProductShell 不为手机另写分支。浮层都是 `role="dialog"` 非模态。
8. **C-8 样式模块。** 新件样式进新模块：`styles/shell.css.ts`（SUB-114 立起，P1 各段写：标按钮、固定项、完整菜单、下拉、ProductShell 顶带态）、`styles/shell-intro.css.ts`（SUB-122）、`styles/shell-sheet.css.ts`（SUB-126），按此顺序登记在 `styles/index.ts` 级联表末尾；`styles/index.ts` 每波只归一个包（`packages.md`）。`base.css.ts` 只由 SUB-123（nav-item 图钉槽）、SUB-119（撤 O-1 几何与侧栏抽屉）、SUB-129 与 SUB-130（页头与纸内布局）、SUB-124 与 SUB-125（家族归位与退役）改。选择器前缀 `.tcrn-shell-*`（ProductShell 根仍为 `.tcrn-product-shell`）；状态规则特异性不高于变体、不含颜色；几何逐值来自 token，1px 细线沿用现有写法。
9. **C-9 story id 定死。** SUB-121 在 `navigation-shells` 类目登记 `shell-top-band`（07a A 段三态 × 浅色夜间，1440）、`shell-narrow`（1023 宽）、`shell-mobile`（390 宽，SUB-126 合入后同一 story 显示 Sheet）、`shell-intro`（登入动画）；SUB-136 登记 `shell-matrix`（07a B 段逐格）。壳层 story 都不进 gplus- 类目，storybook-map 维持 23 行。第一批样板 id 不变：`typography-sample-billing`、`icon-sample-project`、`brand-sample-product`、`actions-sample-project`、`inputs-sample-members`、`composition-three-sample`，内容换顶带壳（SUB-134）。id 与标题不含 aos、tms、workflow；渲染文本不含工单键。
10. **C-10 文案。** 新壳件的可见文案与 aria 文案放 `components/Navigation/shell-copy.ts`，五语（en、zh-CN、ja、ko、fr，与 tcrnSupportedLocales 一致）同源；该文件每波只归一个包。ShellIntro 的 aria 文案放本件局部表；NavItem 图钉的可见名进 `Navigation.tsx` 现有的壳文案表（SUB-123）。story 文案进 `apps/storybook/src/build/locales/`，新英文键四语齐、四语值不得与同语言其它键同值。
11. **C-11 壳层门。** 读数库 `scripts/lib/shell-measure.mjs`（只读数、不含阈值），门脚本 `scripts/shell-measure-proof.mjs`（持 THRESHOLDS 与 18 门；`--fixtures` 量两块成品板，默认量真件 story），夹具 `tests/fixtures/geometry-measure/shell/`（自带 manifest，不改上级 manifest.json）。读数口径以 `measure-shell.js` 为准；真件只在 1440×900 与 390×844、en 与 zh；画板夹具在板原宽 1240 量。D 段 12 行关系断言逐行映射到门（映射表写在门脚本头注释里）。由 SUB-137 把 `scripts/shell-measure-proof.mjs` 串进根 package.json 的 `geometry:measure`（verify 已含该段，CI 跑 pnpm verify）。`gplus-measure.mjs` 与 `geometry-measure-proof.mjs` 只归 SUB-134（shellFrame），壳层门不改它们。
12. **C-12 回执、门报告与旧几何红。** `docs/verification/**`（回执、视觉签名基线、各门报告）只由 SUB-140 提交；其它包跑了会写这些路径的门，跑完 `git -C <包树> checkout -- docs/verification`，新出现的未跟踪文件移进 scratch 的 trash；`visual-selection-result.json` 永不入仓，`internal-alpha/no-overclaim-scan.json` 由主线程在最后一次文档提交时再生。换壳让既有门先红，按下表的持有者改；持有者之前的包只记 `problems/<包>.md`，不修：shell-parity 包侧与 geometry-proof 的品牌宿主、openMenus → SUB-121；geometry-proof 的 INC-399 段 → SUB-126；doc-shell、shell-fidelity 例外与白名单、shell-parity 文档侧、foundation-visual-standards 的 oracle、storybook-smoke、internal-alpha-browser-proof、full-surface 的文档壳读数 → SUB-132；gplus-measure 与 geometry-measure 的 shellFrame、样板变异、storybook-visual-proof、storybook-map → SUB-134；视觉签名基线 → SUB-140；token-deprecation-notice 对 base.css.ts 旧壳变量的提示 → SUB-119 后自然清零。
13. **C-13 契约与生成物。** 只有改了契约文件的 Subtask 提交 contract-generate 的输出，且只提交头里 contract files 覆盖该契约文件的生成物：tokens.json → gplus-tokens、actions.pairs、inputs.pairs、typography.scale、matrices.generated 五个头；icons.json → icon-paths.generated；matrices.json → matrices.generated；marks.json → product-marks.generated 与 gplus-tokens（本批没有 Subtask 改 marks.json，需要时停下回拆分）。每波每个契约文件只归一个 Subtask：tokens.json 为 SUB-113（W1）、SUB-128（W2）、SUB-130（W5）；icons.json 为 SUB-123（W1）；matrices.json 为 SUB-128（W2）、SUB-136（W6）；`docs/contract/families.json` 为 SUB-114 与 SUB-115（W1）、SUB-116 与 SUB-118（W2）、SUB-122（W3）、SUB-125（W6）。同波另一包也会跑 contract-generate 时，只提交本包契约覆盖的那几个文件，其余必须字节不变。
14. **C-14 迁移说明与 CHANGELOG。** 两份文件按 Subtask 追加，不改别人写的条目：CHANGELOG 由 SUB-113（壳 token 退役）→ SUB-125（导航与壳件退役）→ SUB-138（4.0.0 发布段整理）；`docs/migration-4.0.md` 由 SUB-120（ProductShell 的 sidebar、collapsed、钉住 prop 移除）→ SUB-125（家族退役与 Tabs 合一）→ SUB-138（两批合一、补齐）。
15. **C-15 包树、合入、提交与交回。** 集成分支 `claude/init016-tab-shell`。每包在自己的工作树与分支上做，从集成分支在前置包合入后的 HEAD 切出；P1 四段用同一分支，每段开始前由主线程把集成分支最新 HEAD 合进 P1 分支（P1b 由此看到 P2 的图钉位与 P3 的门库）。合入由主线程按 `packages.md` 的波次与依赖顺序做，冲突交集成子代理。按 Subtask 提交，提交信息带 TCRN-DS-SUB-NNN；git 身份与禁止事项按 START（不推送、不打 tag、不发版、不部署）。每包交回 `runs/r1/handoff/<包>.md`（提交列表、写明的选择与回显项、局部门结果摘要、接续点）与 `runs/r1/problems/<包>.md`（见红只记，同一根因算一条）。局部门只跑本包表列出的门，同一门不为求稳重复跑，不跑 verify。
16. **C-16 画板文件。** `docs/design/visual-standard/boards/Shell.dc.html` 与 `Shell-2.dc.html` 是字节真值，任何包不改；SUB-133 重跑 build-shell2.mjs 时这两块输出必须逐字节相同。成品板只由 SUB-123（Icon 板 A 段名册）与 SUB-133（四板 D 段）改；画布发布由设计会话做，收口文件列出改过的板。
17. **C-17 质量硬线与停下条件。** START「质量硬线」两段（第一批 C1 至 C17 与壳层新增硬线）对每个包都有效。遇到下列情况停下写进包问题文件，不扩大授权：要新增 C-2 以外的 token（SUB-130 的布局 token 除外）；要改 Icon 组件 API；要改门的比对字段、阈值或判定语义（Story 明写的改值与 C-12 的旧几何期望值除外）；要改别的波次持有的共享文件；要改 Shell 两块成品板。

## 2. 总览

### 2.1 Story → Subtask

| Story | Subtask | 包 / 波 |
| --- | --- | --- |
| TCRN-DS-STORY-135 壳 token：shell.* 与 motion.intro 进 ui-tokens，三条旧壳 token 经弃用别名退役，tokens.json 同步 | SUB-113 | P1a / W1 |
| TCRN-DS-STORY-136 标按钮 ShellBrandButton | SUB-114 | P1a / W1 |
| TCRN-DS-STORY-137 顶带固定项 ShellPins | SUB-115 | P1a / W1 |
| TCRN-DS-STORY-138 完整菜单 ShellMenu | SUB-116、SUB-117 | P1b / W2 |
| TCRN-DS-STORY-139 固定二级菜单下拉 ShellDropdown 与三四级级联 | SUB-118 | P1b / W2 |
| TCRN-DS-STORY-140 ProductShell 顶带态与固定项偏好 | SUB-119、SUB-120、SUB-121 | P1c / W3、P1d / W4 |
| TCRN-DS-STORY-141 登入动画 ShellIntro | SUB-122 | P5 / W3 |
| TCRN-DS-STORY-142 NavItem 图钉与固定项契约，名册加 pin | SUB-123 | P2 / W1 |
| TCRN-DS-STORY-143 导航家族焕新，SideNav 等退役 | SUB-124、SUB-125 | P8 / W6 |
| TCRN-DS-STORY-144 手机 Sheet 与 INC-399 门 | SUB-126 | P7 / W5 |
| TCRN-DS-STORY-145 ProductLockup 首行变体（第二版） | SUB-127、SUB-128 | P2 / W1、P4 / W2 |
| TCRN-DS-STORY-146 PageHeader 必有与纸内布局重排 | SUB-129、SUB-130 | P6 / W5 |
| TCRN-DS-STORY-147 Storybook 文档壳改顶带壳 | SUB-131、SUB-132 | P10 / W7、P13 / W8 |
| TCRN-DS-STORY-148 第一批五样板换新壳，映射与 shellFrame 改值 | SUB-133、SUB-134 | P11 / W7、P14 / W8 |
| TCRN-DS-STORY-149 壳层 18 条门接入 geometry-measure、verify 与 CI | SUB-135、SUB-136、SUB-137 | P3 / W1、P9 / W6、P12 / W7 |
| TCRN-DS-STORY-150 4.0.0 候选：版本面、CHANGELOG、迁移说明、Owner 目视验收清单 | SUB-138、SUB-139、SUB-140 | P15 / W9 |
| 合计 16 张 | 28 张：TCRN-DS-SUB-113 – TCRN-DS-SUB-140 | 15 个包（P1 分 4 段）/ 9 波 |

依赖图（波次自上而下，同一行的包并行；箭头是包的前置）：

```
W1: P1a[113,114,115]   |   P2[123,127]   |   P3[135]
W2: P1b[116,117,118] <- P1a+P2   |   P4[128] <- P1a+P2
W3: P1c[119,120] <- P1b   |   P5[122] <- P1a
W4: P1d[121] <- P1c+P5
W5: P6[129,130] <- P1d   |   P7[126] <- P1d
W6: P8[124,125] <- P6   |   P9[136] <- P4+P7
W7: P10[131] <- P8   |   P11[133] <- P8   |   P12[137] <- P3+P9
W8: P13[132] <- P10   |   P14[134] <- P10+P11
W9: P15[138,139,140] <- P12+P13+P14
```

START 的排期在此落实为：P1 单链按序（P1a → P1b → P1c → P1d，同一分支）；141（P5）、142 与 145（P2、P4）在 P1 期间并行；143、144、146（P8、P7、P6）等 P1 完成；147、148（P10、P13、P11、P14）等 140、143、146，148 的 Storybook 侧另等 147 的第一张；149 先用画板夹具（P3，W1），最后对真件（P12，W7）；150 最后（P15）。

### 2.2 风险

1. 关键路径是 P1 四段（W1–W4）接 P6 → P8 → P10 → P13 / P14 → P15；P1c（ProductShell 重写）与 P8（家族归位）最重，逼近上限时按执行约束提交干净状态、写接续点交回。
2. `Navigation.tsx`（89 KB）、`base.css.ts`（108 KB）、`story-content.tsx` 是热点文件：按波独占（`packages.md` 共享文件先后表）；新件一律独立文件（C-4）。
3. 换壳后既有门会在 W3–W8 之间先红（C-12 表），批末之前不据此回退；持有者以外的包只记不修。
4. 壳层门对真件依赖 C-5 钩子；钩子缺失会让 SUB-137 大面积红，所以 P1 各段与 SUB-122、SUB-126 的组件测试都断钩子存在。
5. 视觉签名基线只在 SUB-140 一次重收；中途签名红不处理。
6. W1 两包（P1a、P2）都跑 contract-generate：各自只提交本包契约覆盖的生成物（C-13），合入后由 P1b 起跑前的局部门顺带核对头一致。
7. P8、P15 预计约 140 回合，接近每包 150 的上限。
8. Owner 改裁 D7（夜间后缀取 #7aa0f5）时，只回改 SUB-128 与 SUB-136 的对应格。

## 3. 按 Story 的 Subtask

### TCRN-DS-STORY-135 · 壳 token：shell.* 与 motion.intro 进 ui-tokens，三条旧壳 token 经弃用别名退役，tokens.json 同步

1 张：TCRN-DS-SUB-113（父单 work:1ad3c63c6fe6468a9d553758）

#### TCRN-DS-SUB-113 · 壳 token：shell.* 与 motion.intro 进 tokens.json 与 ui-tokens，三条旧壳 token 经弃用别名退役

- 包 / 波：P1a / W1
- 改动文件：`docs/design/gplus-2026-10/contract/tokens.json`，`packages/ui-tokens/src/gplus-tokens.generated.ts`，`packages/ui-react/src/styles/generated/actions.pairs.ts`，`packages/ui-react/src/styles/generated/inputs.pairs.ts`，`packages/ui-react/src/styles/generated/typography.scale.ts`，`apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts`，`packages/ui-tokens/src/index.ts`，`packages/ui-tokens/src/index.test.ts`，`packages/ui-tokens/src/tokens.css`，`apps/storybook/src/storybook.css`，`scripts/tokens-sync.mjs`，`CHANGELOG.md`
- 依赖：无
- 判据：135-GWT1：tokens.json 按 C-2 名表新增 16 条 shell 组与 4 条 motion intro 条目，值与 07b F 段逐条相等，index.test.ts 逐条断言（名表即断言表）。135-GWT2：ui-tokens 构建产物里 shell 与 intro 变量在主题无关 :root 块，浅色与夜间属性集相同（几何不随主题变），tokens-sync --check 绿。135-GWT3：topbar-h（--tcrn-shell-topbar-height）别名到 --tcrn-shell-strip-h；rail-w、rail-w-collapsed 无继任，按现有 deprecated 机制 replacement 为 null、保留原值；tcrnDeprecatedTokens 与 tcrnDeprecatedTokenAliases 列出三条；CHANGELOG 4.0.0 段写退役条目。135-GWT4：tokens:proof 与 contract:static 退出 0（contract:static 先 build）。符合性：同源——index.test.ts 读 build-shell2.mjs 第 37 行 .scr.ts 的 --strip-h、--tab、--panel-wx、--menu-gap、--pin-gap、--drop-w、--cascade-gap、--row-h、--pinb、--srch-h，与 tokens.json 对应条目逐个相等；本单不写组件 CSS，不新增组件内几何字面值。
- 数值来源：Shell-2.dc.html F 段（第 342 行）= build-shell2.mjs tokens 表第 471–489 行；板 CSS 默认值 build-shell2.mjs 第 37 行；登入动画三段 storyRules 第 362–366 行（120 = --t-fill，240 = --t-move，100 纸升起，上限 700）；退役三条现值 tokens.json 第 77–79 行；r-paper 14 在第 59 行（注释改写为顶带壳纸面）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
- 注意：触摸端 44（row-h、srch-h）用 pointer: coarse 切换、不另设 token：落点优先 token 层（tokens-sync 能写媒体块时）；写不了时在交回写明，由 SUB-114 在 shell.css.ts 用 token 引用实现。五个生成物头的 contract-sha256 同变，都归本单（C-13）。base.css.ts 里 ProductShell 仍读旧名，tokens-sync 的弃用提示与 token-deprecation-notice 可能报包内用法：属预期，SUB-119 撤 O-1 几何后清零，记 problems/P1a.md 不修。CHANGELOG 只加退役条目，版本面不动（SUB-138）。

### TCRN-DS-STORY-136 · 标按钮 ShellBrandButton

1 张：TCRN-DS-SUB-114（父单 work:73563c973ba4945683fbb15f）

#### TCRN-DS-SUB-114 · 标按钮 ShellBrandButton 与壳样式模块 shell.css.ts：两版随宽度，134×40，示意 20，3.5% 墨洗

- 包 / 波：P1a / W1
- 改动文件：`packages/ui-react/src/components/Navigation/ShellBrandButton.tsx`，`packages/ui-react/src/components/Navigation/ShellBrandButton.test.tsx`，`packages/ui-react/src/components/Navigation/shell-copy.ts`，`packages/ui-react/src/styles/shell.css.ts`，`packages/ui-react/src/styles/index.ts`，`packages/ui-react/src/components/Navigation/index.ts`，`packages/ui-react/src/index.tsx`，`packages/ui-react/src/index.test.tsx`，`docs/contract/families.json`
- 依赖：TCRN-DS-SUB-113
- 判据：136-GWT1：1240 宽顶带内 left 12、top 6、宽 134、高 40、中线 26——组件测试断尺寸引 --tcrn-shell-brand-w / --tcrn-shell-brand-h、位置由顶带 (strip-h − brand-h) / 2 = 6 得出；读数门在 SUB-137。136-GWT2：标取 product-marks.generated 的通过稿路径，SVG digest 与 logos2/<product>.svg 相等，brand-asset:proof 0。136-GWT3：hover 与 open 底 = --tcrn-color-hover（3.5% 墨洗），后缀于墨洗 ≥ 4.5；空闲底透明、标不透明度 1；状态规则只切换生效对、不写颜色、特异性不高于变体。136-GWT4：本单给可转发 ref、aria-expanded、aria-haspopup="dialog"；Esc 回焦在 SUB-117 测。136-GWT5：窄于 1024 为第一版（只有标与示意），可点，高 ≥ 40；pointer: coarse 下高 ≥ 40。符合性：圆角 8；示意 chevron 16 于 20 格；标 22、字标 12.5/600；字标墨迹中线 = 标中线（±1），不做视觉重心下移，r6 撤回的 2 / 3px 下移不得重现；无轮廓、不挂上边界。
- 数值来源：build-shell2.mjs css 第 53–62 行（.ts-brand 网格 22 auto 20、列距 10、内距 0 6、高 var(--tab)、圆角 8、.v1 网格 22 20、hover / open 用 --hover、.ts-tgl 20）；strip() 第 223–225 行（aria、data-tab、v1）；Shell.dc.html 1 段（第 287 行）与 A 段（第 299 行）；geoRows「标按钮（v2）」第 431 行；token shell-brand-h 40、shell-brand-w 134、shell-toggle 20（C-2）；--tcrn-color-hover = tokens.json 第 34 行。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> run selection:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run exports:check`
  - `corepack pnpm@10.12.1 -C <包树> run brand-asset:proof`
- 注意：新件放独立文件，不改 Navigation.tsx（W1 归 P2）。DOM 按 C-5 钩子与 C-6 首行结构（与 SUB-127 的 ProductLockup 首行变体同一套 DOM 与 token，不互相导入，合入后是否合并由判断定）。标资产只经 tcrnProductMarkSvg / product-marks.generated，不重绘、不用单色版、不用半透明。shell.css.ts 由本单立起并登记在 styles/index.ts 级联表末尾（C-8）。可见名与 aria 文案放 shell-copy.ts（C-10）。不做浮层。

### TCRN-DS-STORY-137 · 顶带固定项 ShellPins

1 张：TCRN-DS-SUB-115（父单 work:b8e05fe98dd99b6b0da62493）

#### TCRN-DS-SUB-115 · 顶带固定项 ShellPins：32 高、三处间距 8、无分割线、上限 6、窄于 1024 收进菜单

- 包 / 波：P1a / W1
- 改动文件：`packages/ui-react/src/components/Navigation/ShellPins.tsx`，`packages/ui-react/src/components/Navigation/ShellPins.test.tsx`，`packages/ui-react/src/components/Navigation/shell-copy.ts`，`packages/ui-react/src/styles/shell.css.ts`，`packages/ui-react/src/components/Navigation/index.ts`，`packages/ui-react/src/index.tsx`，`packages/ui-react/src/index.test.tsx`，`docs/contract/families.json`
- 依赖：TCRN-DS-SUB-114
- 判据：137-GWT1：四项时三处间距读数相等且为 8、每项 32、中线 26——组件测试断 gap 与首项 margin-left 都引 --tcrn-shell-pin-gap、高引 --tcrn-shell-pin-h；读数门在 SUB-137。137-GWT2：分割线 0（不写任何边线；加回 1px 左边线的变异在 SUB-135 判红）。137-GWT3：7 个已固定只渲染前 6，组件给出 overflow（第 7 项起的 id）供 ShellMenu 标记「已固定」。137-GWT4：窄于 1024 顶带不渲染固定项（整组隐藏），「已固定」分组由 SUB-117 测。137-GWT5：选中底 --tcrn-color-wash、字重 600、无 border-left，浅色与夜间同一属性集；对比度与 07a B 段 pin 行相等。符合性：hover 3.5% 墨洗；带下拉的固定项是按钮（aria-haspopup="dialog"、aria-expanded、aria-controls），无下拉的是链接（当前页 aria-current="page"）；顺序 = 偏好顺序。右上簇（铃铛 32、头像 28、簇右 = 纸右）在 SUB-119 实现与测。
- 数值来源：build-shell2.mjs css 第 63–71 行（.ts-pins gap 与 margin-left 都是 --pin-gap；.ts-pin-it 高 --row-h、内距 0 10、字 500 12.5、.on wash + 600、.open wash）；PINS 第 222 行；strip() 第 226–232 行；matrixRows 第 312–317 行；spec-geom.json pills [[154,199],[207,270],[278,335.5],[343.5,406.5]]；geoRows「固定项」第 432 行；token shell-pin-h 32、shell-pin-gap 8、shell-pins-max 6。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> run selection:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run exports:check`
- 注意：上限 6 取 token（SUB-113 导出的 JS 值，或读 CSS 变量，二选一写交回），组件里不写 6。拖排与偏好读写在 SUB-120，本单只收有序列表与回调。不改 Navigation.tsx。

### TCRN-DS-STORY-138 · 完整菜单 ShellMenu

2 张：TCRN-DS-SUB-116、TCRN-DS-SUB-117（父单 work:3d8ec5e9bbaaa3623c3315c8）

#### TCRN-DS-SUB-116 · 完整菜单 ShellMenu 结构：接续 6、宽 952、搜索 40、三列行 32、底栏锁定块只装饰、无收起钮

- 包 / 波：P1b / W2
- 改动文件：`packages/ui-react/src/components/Navigation/ShellMenu.tsx`，`packages/ui-react/src/components/Navigation/ShellMenu.test.tsx`，`packages/ui-react/src/components/Navigation/shell-copy.ts`，`packages/ui-react/src/styles/shell.css.ts`，`packages/ui-react/src/components/Navigation/index.ts`，`packages/ui-react/src/index.tsx`，`packages/ui-react/src/index.test.tsx`，`docs/contract/families.json`
- 依赖：TCRN-DS-SUB-115，TCRN-DS-SUB-123
- 判据：138-GWT1：top 52、left 12、width 952，菜单顶 − 标按钮底 = 6——top 写成 (strip-h − brand-h) / 2 + brand-h + menu-gap 的 token 计算，宽 --tcrn-shell-panel-w-expanded。138-GWT2：收起钮 0；锁定块是 role="img" 的非按钮、tabindex 不进序列、无 hover。138-GWT3：底栏高 = pbar-h 44 + 面板底内距 8，锁定块与当前位置在分隔线到面板底缘之间上下留白相等（±0.5，align-items center）。138-GWT5：box-shadow 用 --tcrn-shadow-s3（最大模糊 3px）。符合性：role="dialog" 非模态；左缘 = 纸左缘 = 12；搜索 SearchInput 40；三列 gap 16、行 32、内容左右内距 16；锁定块右缘 = 菜单右缘 − 16；分组标题 ink-3 无 hover 底；快捷键提示 ink-2；行用 NavGroup / NavItem 并带 SUB-123 的图钉位（C-6）；每格对比度与 07a B 段相等。
- 数值来源：build-shell2.mjs css 第 85–110 行（.ts-panel 定位、内距 8 8 0、圆角 12、s3；.ts-srch 40；.ts-grp 28；.ts-it 网格 22 1fr 24、列距 10、内距 0 4 0 8；.ts-cols 三列 gap 16；.ts-pbar 52、border-top、内距 0 8；.lkr 第 47–50 行）；screen() 第 251–261 行；NAV 第 205–214 行；matrixRows 第 322–331、336–340 行；spec-geom.json menuItemTop 144、menuBarTop 290、menuBottom 342、lockRight 948；geoRows「完整菜单」「右下角锁定块」第 434–435 行；token shell-panel-w-expanded 952、shell-menu-gap 6、shell-srch-h 40、shell-row-h 32、shell-pbar-h 44。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> run selection:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run exports:check`
- 注意：菜单模型类型由本文件定（C-7），最多四级。浮层定位用 Overlay 家族现有定位层，不新造。面板 max-height（板上 588 = 640 − 52）不在 F 段：用视口减顶带的 token 计算，写交回。侧栏尺度锁定块复用 ShellBrandLockup（Brand 板 E 段写法），不改其 SVG 与文案。F 段 pbar-h 44 与板 CSS 的 .ts-pbar 52 两种分解见 problems 第 2 条，按 44 + 8 做。

#### TCRN-DS-SUB-117 · 完整菜单行为：一段即开、Esc 与点外部即收、⌘K 聚焦搜索、方向键、回焦标按钮

- 包 / 波：P1b / W2
- 改动文件：`packages/ui-react/src/components/Navigation/ShellMenu.tsx`，`packages/ui-react/src/components/Navigation/ShellMenu.test.tsx`，`packages/ui-react/src/test/shell-menu.dom.spec.tsx`，`packages/ui-react/src/components/Navigation/shell-copy.ts`
- 依赖：TCRN-DS-SUB-116
- 判据：138-GWT4：按 ⌘K（或 Ctrl+K）activeElement 是搜索框；Esc 关闭且 activeElement 是标按钮；点浮层外关闭——DOM 测试覆盖三条。符合性：一段即开（没有小面板）；选中项后关闭；↑↓ 走项、→ 进子项列、← 回左列；搜索提供者接口复用 ProductShellSearch，输入「合约」只剩合约相关项；窄于 1024 时多「已固定」分组，列出 ShellPins 的 overflow 与全部固定项；菜单开合尊重 prefers-reduced-motion（时长归零）。
- 数值来源：build-shell2.mjs contract 第 445–468 行（临时浮层、键盘与读屏）；storyRules 第 365 行（菜单开合同样尊重减少动画）；STORY-138 用例（名册页按 ⌘K）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
- 注意：非模态：不锁焦点，桌面不加遮罩。⌘K 监听挂在文档上、卸载即移除，一个壳只注册一次。「临时浮层」行为（点外部、Esc、选中即收、回焦触发键）写成本文件导出的 hook，SUB-118 复用（C-7）。

### TCRN-DS-STORY-139 · 固定二级菜单下拉 ShellDropdown 与三四级级联

1 张：TCRN-DS-SUB-118（父单 work:09e0986c769bddf72859897f）

#### TCRN-DS-SUB-118 · 下拉 ShellDropdown 与三四级级联：接续 6、宽 240、搜索 sm 28、级联 +4 同宽同高、点击展开

- 包 / 波：P1b / W2
- 改动文件：`packages/ui-react/src/components/Navigation/ShellDropdown.tsx`，`packages/ui-react/src/components/Navigation/ShellDropdown.test.tsx`，`packages/ui-react/src/test/shell-dropdown.dom.spec.tsx`，`packages/ui-react/src/components/Navigation/shell-copy.ts`，`packages/ui-react/src/styles/shell.css.ts`，`packages/ui-react/src/components/Navigation/index.ts`，`packages/ui-react/src/index.tsx`，`packages/ui-react/src/index.test.tsx`，`docs/contract/families.json`
- 依赖：TCRN-DS-SUB-117
- 判据：139-GWT1：点固定项「合约」，下拉 left = 该项 left、top = 该项底 + 6、width 240、搜索高 28。139-GWT2：带子项的行点开后第二列左缘 = 第一列右缘 + 4、宽 240、高 = 第一列高（CSS grid 同行 stretch，不用 JS 同步高；height:auto 变异在 SUB-135 判红）。139-GWT3：悬停带子项的行 500ms 不出第二列（只响应点击）。139-GWT4：第二列获焦按 ← 回第一列同一行；Esc 全部关闭、焦点回固定项。139-GWT5：下拉搜索只匹配该子树。符合性：role="dialog" 非模态；固定项 aria-expanded、aria-haspopup="dialog"；内距 6；行无图标列、文字起点 16；Esc、选中、点外部即收；四级为止；每格对比度与 B 段相等。
- 数值来源：build-shell2.mjs css 第 111–118 行（.ts-drop 宽 --drop-w、内距 6、圆角 12、s3；.ts-drop2 left calc(drop-w + cascade-gap)、top 0、height 100%；.ts-drop .ts-srch 28、内距 0 8；.ts-it.noic 内距 0 4 0 10，文字起点 6 + 10 = 16）；dropdown() 第 235–247 行；spec-geom.json dropRowTop 88、dropBottom 228；geoRows 第 436–437 行；token shell-drop-w 240、shell-drop-srch-h 28、shell-cascade-gap 4、shell-menu-gap 6。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> run selection:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run exports:check`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
- 注意：板上 .ts-drop2 用 absolute 加 height:100%，STORY-139 实施注要 grid 同行 stretch：按 Story 写法，读数口径（高 = 左列高）不变。行与搜索复用 ShellMenu 的行与 SUB-117 的临时浮层 hook；子菜单行也带图钉位（C-6）。搜索用 SearchInput sm（28），提供者限定子树。

### TCRN-DS-STORY-140 · ProductShell 顶带态与固定项偏好

3 张：TCRN-DS-SUB-119、TCRN-DS-SUB-120、TCRN-DS-SUB-121（父单 work:e14a7f089a9cac4c7da39d52）

#### TCRN-DS-SUB-119 · ProductShell 顶带态：撤 sidebar 与 O-1 几何，顶带 52、纸 12/52/14、右上簇、头像菜单切换产品

- 包 / 波：P1c / W3
- 改动文件：`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`packages/ui-react/src/styles/base.css.ts`，`packages/ui-react/src/styles/shell.css.ts`，`packages/ui-react/src/components/Navigation/shell-copy.ts`，`apps/storybook/src/contract-stories/story-content.tsx`，`apps/storybook/src/contract-stories/visual-instances/aos-frontend-shell-slice.tsx`，`apps/storybook/src/contract-stories/visual-instances/aos-owner-quality-product-shell.tsx`，`apps/storybook/src/contract-stories/gplus/samples/composition-one.tsx`
- 依赖：TCRN-DS-SUB-118
- 判据：140-GWT1：顶带高 52、无 background、无 border；纸 top 52、左右下 12、圆角 14——纸几何引 --tcrn-shell-strip-h、--tcrn-radius-paper、--tcrn-shadow-s1 与离边 token。140-GWT2：壳 DOM 常驻侧栏与收起钮数量 0。140-GWT4：头像菜单含切换产品；完整菜单与锁定块不含产品清单。140-GWT5 类型部分：sidebar、collapsed、钉住相关 prop 从类型删除（迁移条目在 SUB-120）。符合性：标按钮左 = 纸左 = 完整菜单左 = 12，簇右 = 纸右；右上簇铃铛 32、头像 28、中线 26（137 判据的右上簇部分在此测）；O-1 的侧栏 220 / 收起 52 / 引导列 16 与 48 撤出；壳只有一种；调用点只做让类型通过的最小改动，整仓 typecheck 0。
- 数值来源：build-shell2.mjs css 第 37–39 行（.scr.ts 变量、.lay 网格 strip-h 1fr、.ts-strip 内距 0 gap）、第 72–77 行（.ts-cluster gap 6、.ts-ib 32、.ts-av 28、.ts-paper margin 0 gap gap、圆角 paper-r、s1）；strip() 第 223–234 行；screen() 第 248–271 行；specClosed 第 390–399 行；geoRows「顶带高」「纸」第 430、433 行；spec-geom.json；现 base.css.ts 第 154–300 行（侧栏、收起、壳顶栏）与第 2009 行起的移动块。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> run selection:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
- 注意：菜单模型类型取 ShellMenu.tsx（C-7）：ProductShellNavGroup 改为其别名或扩 children，二选一写交回。手机呈现交给 ShellMenu 自带的呈现切换（C-7），ProductShell 不写 ≤ 760 的分支；base.css.ts 移动块里的侧栏抽屉规则随 sidebar 删除。ShellThemeToggle 与 ShellLocaleMenu 按 problems 第 14 条进头像菜单。Navigation.tsx 与新件互相引用时只在函数体内用，不在模块顶层求值。story 内容与登记在 SUB-121；包外门的旧几何红按 C-12 只记。

#### TCRN-DS-SUB-120 · 固定项偏好契约：RequestPreferences 去 collapsed 加 pins，控制器读写与拖排，迁移条目

- 包 / 波：P1c / W3
- 改动文件：`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`packages/ui-react/src/test/product-shell-preferences.dom.spec.tsx`，`docs/migration-4.0.md`
- 依赖：TCRN-DS-SUB-119
- 判据：140-GWT3：钉第 7 项时偏好保存、顶带只显示前 6；拖排后顺序持久化到偏好（控制器测试）。140-GWT5：旧 prop（sidebar、collapsed、collapsedStorageKey、onCollapsedChange、sideNavCollapseDisabledReason 等钉住与收起相关项）传入时类型层拒绝（@ts-expect-error 测试），docs/migration-4.0.md 有对应条目。符合性：固定项偏好经 ProductShellRequestPreferences 读写（每用户每产品、顺序、上限 6、可钉分组 / 项 / 子菜单）；服务端偏好由消费方传入，包只定义读写契约与本地回退；readPreferenceCookieValues 不再读 collapsed。
- 数值来源：build-shell2.mjs contract 第 448 行（固定项存储）；Navigation.tsx 第 1827–1878 行（RequestPreferences 与控制器配置）；token shell-pins-max 6。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
- 注意：第 1827 行起的注释写明 cookie 只携带三项显示偏好：固定项不进 cookie（跨设备服务端偏好由产品后端给），只删 collapsed、不新增 cookie 键，注释同步改写（problems 第 19 条）。本地回退的存储键按产品分隔。迁移说明只追加第二批壳层条目，第一批条目不动（SUB-138 整理）。

#### TCRN-DS-SUB-121 · 顶带壳四个 story 登记，shell-parity 包侧与 geometry-proof 品牌和菜单检查改顶带几何

- 包 / 波：P1d / W4
- 改动文件：`apps/storybook/src/contract-stories/story-content.tsx`，`apps/storybook/src/contract-stories/governance.ts`，`apps/storybook/src/contract-stories/groups/components.ts`，`apps/storybook/src/components.stories.tsx`，`apps/storybook/src/build/locales/storybook-content-text.ts`，`apps/storybook/src/build/locales/storybook-locale-text.ts`，`scripts/lib/locale-invariant-ledger.mjs`，`scripts/lib/story-budget.mjs`，`apps/storybook/src/smoke.test.ts`，`scripts/shell-parity-proof.mjs`，`scripts/geometry-proof.mjs`
- 依赖：TCRN-DS-SUB-120，TCRN-DS-SUB-122
- 判据：140 符合性「八项测量的 shellFrame」与壳层门有真件可量：四个 story 按 C-9 登记、渲染真件并带 C-5 钩子——shell-top-band 覆盖 07a A 段三态（收起、完整菜单、下拉含第三级级联）× 浅色夜间；shell-narrow 为 1023 宽（固定项进「已固定」分组）；shell-mobile 为 390 宽（SUB-126 合入后同一 story 显示 Sheet）；shell-intro 演示登入动画（含 reduced-motion 与会话标记复位）。shell:parity 包侧角色改量顶带与纸；geometry-proof 的品牌检查宿主改为 shell-top-band 收起态、openMenus 计数随新壳重定（INC-399 段不动，归 SUB-126）。storybook:build 0，apps/storybook 测试绿。
- 数值来源：Shell.dc.html A 段 8 屏（data-shell ts-closed-l / n、ts-x-l / n、ts-drop-l / n、ts-m-l、ts-m-s）；NAV 第 205–214 行与 PINS 第 222 行作样例数据（通用产品内容）；R3 现码核对：geometry-proof.mjs 的品牌宿主在第 14、20 行，openMenus 在第 227、251 行。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run shell:parity`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
  - `corepack pnpm@10.12.1 -C <包树> run public:naming:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
- 注意：登记点照现有 navigation-shells 类目的七处（story-content、governance、groups/components、components.stories 的 CSF 适配导出、smoke.test 的期望清单、两份 locales 字典）。story id 与标题不含 aos / tms / workflow；渲染文本不含工单键；新增英文键五语齐且不与同语言其它键同值（C-10）。文档壳一侧的红（doc-shell、shell-fidelity、storybook-smoke、internal-alpha、full-surface）只记，归 SUB-132；视觉签名变化只记，归 SUB-140。story 预算超限时按 story-budget 现有写法登记理由，不抬全局上限。

### TCRN-DS-STORY-141 · 登入动画 ShellIntro

1 张：TCRN-DS-SUB-122（父单 work:e2def1cb6cee96bcde0ea937）

#### TCRN-DS-SUB-122 · 登入动画 ShellIntro：120 + 240 + 100 ≤ 700，只用 transform 与 opacity，每会话一次

- 包 / 波：P5 / W3
- 改动文件：`packages/ui-react/src/components/Navigation/ShellIntro.tsx`，`packages/ui-react/src/components/Navigation/ShellIntro.test.tsx`，`packages/ui-react/src/test/shell-intro.dom.spec.tsx`，`packages/ui-react/src/styles/shell-intro.css.ts`，`packages/ui-react/src/styles/index.ts`，`packages/ui-react/src/components/Navigation/index.ts`，`packages/ui-react/src/index.tsx`，`packages/ui-react/src/index.test.tsx`，`docs/contract/families.json`
- 依赖：TCRN-DS-SUB-113，TCRN-DS-SUB-114
- 判据：141-GWT1：三段时长 120 / 240 / 100、总 ≤ 700，时长取 C-2 的 motion intro token。141-GWT2：刷新后读会话标记（sessionStorage）不再播放（去掉会话标记的变异在 SUB-137 判红）。141-GWT3：prefers-reduced-motion: reduce 时播放 0 次、直接终态。141-GWT4：动画中的标 SVG digest 与 logos2 同源。符合性：transition 与 animation 的属性清单只含 transform、opacity（测试断言）；起点是登入卡上的锁定块原样（标 128），终点是标按钮第二版（12, 6、标 22），结束无跳变、标全程彩色；120ms 后指针事件穿透，键盘可直接 Tab 到标按钮。
- 数值来源：build-shell2.mjs storyRules 第 362–366 行；story 第 355–361 行（分镜 t = 0 / 120 / 240 / 360 / 460）；Shell.dc.html C 段（第 439 行）；token motion intro（C-2）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run brand-asset:proof`
  - `corepack pnpm@10.12.1 -C <包树> run exports:check`
- 注意：新件与新样式模块 shell-intro.css.ts（C-8），不碰 Navigation.tsx、shell.css.ts、base.css.ts（W3 归 P1c）。终点坐标取标按钮实际位置（getBoundingClientRect）或 token 计算，二选一写交回。aria 文案放本文件局部表（五语），不进 shell-copy.ts。story 由 SUB-121 登记。

### TCRN-DS-STORY-142 · NavItem 图钉与固定项契约，名册加 pin

1 张：TCRN-DS-SUB-123（父单 work:27344937d9f099034b0c773e）

#### TCRN-DS-SUB-123 · NavItem 与 NavGroup 图钉位 24、aria-pressed、无抖动；图标名册加 pin 37 → 38 并同步 Icon 板

- 包 / 波：P2 / W1
- 改动文件：`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`packages/ui-react/src/styles/base.css.ts`，`docs/design/gplus-2026-10/contract/icons.json`，`packages/ui-react/src/components/Icon/icon-paths.generated.ts`，`packages/ui-react/src/components/Icon/Icon.test.tsx`，`scripts/contract-proof.mjs`，`tests/contract-proof.test.mjs`，`docs/design/gplus-2026-10/boards/V2-B1-Icon.dc.html`，`docs/design/visual-standard/boards/Icon.dc.html`
- 依赖：无
- 判据：142-GWT1：同一行 rest 与 hover 文字盒宽相等——槽常驻 24、钮用 opacity 显隐，不用 display 切换（display:none → inline 的变异在 SUB-135 判红）。142-GWT2：图钉钮 role button、aria-pressed 与固定态一致、aria-label 含项名（「固定到顶带：<项名>」/「从顶带取下：<项名>」）。142-GWT3：contract/icons.json 名册 38 且含 pin 的描边与实心两态；EXPECTED_ICON_COUNT、Icon.test 与 contract-proof 测试改 38。142-GWT4：行获焦（:focus-within / :focus-visible）不悬停时图钉可见。符合性：分组行、项行、子菜单行都可钉（C-6 契约）；钮 24×24、图标 16；触摸端热区 44；可见名五语同源；Icon 板 A 段名册与 icons.json 同步。
- 数值来源：build-shell2.mjs 第 30–31 行（PIN_BODY 路径、viewBox 20、描边 1.25，实心态填充）；css 第 91 行（.ts-grp 网格 1fr 24）、第 93 行（.ts-it 网格 22 1fr 24）、第 101–105 行（.ts-pinb 24、圆角 6、opacity 0、显隐选择器、.on 用 acc、hover wash）；item() 与 groupRow() 第 215–221 行；matrixRows 第 332–335 行；token shell-pinb 24（C-2）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> run selection:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node docs/design/gplus-2026-10/tools/build-icon.mjs <docs/design/gplus-2026-10/boards/canvas.json 中 Icon 板的 h>`
  - `corepack pnpm@10.12.1 -C <包树> exec node docs/design/visual-standard/tools/make-standard.mjs docs/design/visual-standard/heights.json`
  - `git -C <包树> diff --stat -- docs/design`
- 注意：--tcrn-shell-pinb 由同波的 P1a 新增，本包分支上还没有：CSS 按 C-2 名表引用变量名，合入后生效。pin 两态按 Story 假定用同一名册项的变体，名字只占一个（38）；Icon 现有 API 承载不了变体时停下记问题（改 Icon API 属共享契约，见 problems 第 22 条）。make-standard 会重写五块成品板：只提交 Icon 相关两块，其余必须字节不变；Icon 板高若变，不改 heights.json，记交回交 SUB-133。可见名文案放 Navigation.tsx 现有的壳文案表（本包 W1 独占该文件）。

### TCRN-DS-STORY-143 · 导航家族焕新，SideNav 等退役

2 张：TCRN-DS-SUB-124、TCRN-DS-SUB-125（父单 work:1b03f6ae2b1a9e080fde1432）

#### TCRN-DS-SUB-124 · 导航家族归位一：Tabs 五形合一、Breadcrumb 进 PageHeader 单行截断、NavGroup 与 TreeNav 归面板

- 包 / 波：P8 / W6
- 改动文件：`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`packages/ui-react/src/components/DataDisplay/DomainDisplay.tsx`，`packages/ui-react/src/components/DataDisplay/DomainDisplay.test.tsx`，`packages/ui-react/src/styles/base.css.ts`，`scripts/selection-grammar-proof.mjs`，`apps/storybook/src/contract-stories/story-content.tsx`，`apps/storybook/src/build/locales/storybook-content-text.ts`
- 依赖：TCRN-DS-SUB-121，TCRN-DS-SUB-130
- 判据：143-GWT2：五种旧形渲染为同一家族、同一选中态结构（只有 6% 墨洗加字重一种变化，禁左边条、禁填充兼边线），selection:proof 0。143-GWT4：Breadcrumb 在 390 宽一行、截断、有 title（作为 PageHeader 首行）。符合性：旧名保留为同一家族的弃用别名或变体导出；NavGroup、TreeNav 只在完整菜单与下拉里渲染，样式来自 tcrnComponentCss；包外 tcrn- 类不新增。
- 数值来源：docs/contract/families.json navigation 族（13 件）；V2-Families 板「7 · 导航 Navigation」（合并四种 Tabs 为三种变体的草案）；START 质量硬线（选中态、单行截断）；现码 base.css.ts 第 1137–1152、2204–2208、2513 行（sub-nav、view-tabs、四种 tabs、breadcrumb）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run selection:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
- 注意：依赖 SUB-130 的 PageHeader 必有；本包不改 governance.ts、smoke.test.ts、story 登记（W6 归 P9），story 只改内容；locale-invariant-ledger 需改时写交回。

#### TCRN-DS-SUB-125 · 导航家族归位二：SideNav 等五件弃用退役、CSS 移出组件样式表、TocRail 归纸内

- 包 / 波：P8 / W6
- 改动文件：`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`packages/ui-react/src/components/DataDisplay/DomainDisplay.tsx`，`packages/ui-react/src/styles/base.css.ts`，`packages/ui-react/src/styles/index.ts`，`packages/ui-react/src/index.tsx`，`packages/ui-react/src/index.test.tsx`，`docs/contract/families.json`，`apps/storybook/src/contract-stories/story-content.tsx`，`apps/storybook/src/contract-stories/prototypes/storybook-shell-demos.tsx`，`apps/storybook/src/contract-stories/gplus/samples/composition-three.tsx`，`docs/migration-4.0.md`，`CHANGELOG.md`
- 依赖：TCRN-DS-SUB-124
- 判据：143-GWT1：导出面对照迁移说明，每个退役件有弃用导出与迁移步骤。143-GWT3：TocRail 在纸内；壳内常驻侧栏 0。符合性：家族清单按 docs/contract/families.json 现读（navigation 13 件、shell 9 件）逐件处置并记入迁移说明（处置表见 problems 第 13 条）；退役件保留弃用导出一个小版本（4.0.x）并在 CHANGELOG 列出；退役件 CSS 移出 tcrnComponentCss；包外 tcrn- 类为 0（文档壳仍引用退役类时属预期红，归 SUB-132）。
- 数值来源：docs/contract/families.json（navigation、shell 两族）；Navigation.tsx 导出（SideNav 第 1239 行、SideNavCollapseButton 第 882 行、TopBar 第 241 行、ProductLauncher / ProductSwitcher 第 1023–1055 行）；DomainDisplay.tsx TocRail 第 1138 行；Shell-2.dc.html E 段（目录与书签在页内）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run exports:check`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
- 注意：退役 CSS 改为单独导出、不进级联表，文档壳在 SUB-131 换掉之前继续可引用——实现方式写交回。不改 page-template.tsx 与 alpha-styles.ts（SUB-131）。MobileNavToggle、SubNav、书签栏按 problems 第 13、15 条的建议处置。

### TCRN-DS-STORY-144 · 手机 Sheet 与 INC-399 门

1 张：TCRN-DS-SUB-126（父单 work:14b2761d4ff9e55b90cd110e）

#### TCRN-DS-SUB-126 · 手机 Sheet：390 只留纯标与示意，Sheet 行与搜索 44，INC-399 门改量标按钮与 Sheet

- 包 / 波：P7 / W5
- 改动文件：`packages/ui-react/src/components/Navigation/ShellMenu.tsx`，`packages/ui-react/src/components/Navigation/ShellMenu.test.tsx`，`packages/ui-react/src/test/shell-menu.dom.spec.tsx`，`packages/ui-react/src/components/Navigation/shell-copy.ts`，`packages/ui-react/src/styles/shell-sheet.css.ts`，`packages/ui-react/src/styles/index.ts`，`scripts/geometry-proof.mjs`
- 依赖：TCRN-DS-SUB-121
- 判据：144-GWT1：390×844 顶带只有标与示意，固定项数量 0。144-GWT2：打开 Sheet 行高 44（行高改 32 的变异在 SUB-137 判红）。144-GWT3：滚动 2000px 后点标按钮 Sheet 打开——geometry-proof.mjs 的 measureMobileNavigation 改为点 data-tab、读 data-panel="sheet"、scrollTo 2000，INC-399 门退出 0。144-GWT4：夜间与浅色同一选择器属性集只换值。符合性：390 宽标按钮可点、高 ≥ 40；Sheet 搜索 44、图钉热区 44；从顶带下方升起、max-height 84%、遮罩 20% 墨；移动块（≤ 760）的纸与顶带几何与桌面同一 token。
- 数值来源：build-shell2.mjs css 第 119–129 行（.scr.ts.m 390、.ts-sheet 位置与 max-height 84%、内距 8 8 12、圆角 14 14 0 0、s3、Sheet 内覆写 --row-h、.ts-grab 36×4、.ts-scrim 20% 墨、.ts-li 44）；phone() 第 272–288 行；matrixRows 第 341–343 行；Shell.dc.html A 段 ts-m-l / ts-m-s；geoRows「窄于 1024」第 441 行；现 geometry-proof.mjs 第 306–335 行（measureMobileNavigation，现 scrollTo 500、读 data-mobile-nav-toggle）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
- 注意：不改 Navigation.tsx（W5 归 P6）：Sheet 是 ShellMenu 的一种呈现，按 C-7 由 ShellMenu 按视口切换；必须改 ProductShell 时停下写交回。Sheet 内行高 44 由 Sheet 呈现本身给（与板一致），pointer: coarse 只管桌面触摸端（problems 第 9 条）。样式进新模块 shell-sheet.css.ts（C-8）。geometry-proof 只改 INC-399 段。

### TCRN-DS-STORY-145 · ProductLockup 首行变体（第二版）

2 张：TCRN-DS-SUB-127、TCRN-DS-SUB-128（父单 work:f19ca0b68e52842e947dcafc）

#### TCRN-DS-SUB-127 · ProductLockup 首行变体（第二版）：首行与标垂直居中，标 22 加 12.5/600，资产取 E 段原样

- 包 / 波：P2 / W1
- 改动文件：`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`packages/ui-react/src/styles/brand.css.ts`，`scripts/brand-asset-source-proof.mjs`
- 依赖：TCRN-DS-SUB-123
- 判据：145-GWT1：首行变体渲染四枚产品，每枚标 digest 与 logos2/<id>.svg 相等。145-GWT2：字标墨迹中线与标中线差 ≤ 1（canvas measureText 口径，同 measure-shell.js 的 optical）；字标加 padding-top 4 的变异在 SUB-135 判红。145-GWT4：brand-asset:proof 退出 0。符合性：第二版只是第一行英文与标垂直居中——不重排、不改字重、不改颜色；第一版纯标（ProductLogo）、第三版锁定块原样（现 ProductLockup）不变；flex align-items center，不用 line-height 微调，r6 撤回的 2 / 3px 下移不得重现。
- 数值来源：build-shell2.mjs 第 25–28 行（lockupLine、railLine 的结构与 data-lockup）、css 第 40–51 行（.lk 与 .lkr 网格、列距 14 / 10、16/600 与 12.5/600）；versions() 第 292–299 行；Shell.dc.html 1 段；Brand.dc.html E 段（锁定块与侧栏尺度）；contract/marks.json（标路径与文案）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run brand-asset:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
- 注意：与 SUB-114 同一套首行 DOM 与 token（C-6）。夜间后缀色回改在 SUB-128（W2，避开 P1a 的 tokens.json），本单不改 marks.json 与 contract（C-13）。brand-asset-source-proof 只在需要认识新变体时改。

#### TCRN-DS-SUB-128 · TMS 后缀夜间回通过稿同色 #2c63c8：撤 O-3 夜间值，恢复夜间豁免并引 D7

- 包 / 波：P4 / W2
- 改动文件：`docs/design/gplus-2026-10/contract/tokens.json`，`packages/ui-tokens/src/gplus-tokens.generated.ts`，`packages/ui-react/src/styles/generated/actions.pairs.ts`，`packages/ui-react/src/styles/generated/inputs.pairs.ts`，`packages/ui-react/src/styles/generated/typography.scale.ts`，`apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts`，`packages/ui-tokens/src/index.ts`，`packages/ui-tokens/src/index.test.ts`，`packages/ui-tokens/src/tokens.css`，`apps/storybook/src/storybook.css`，`scripts/token-contrast-proof.mjs`，`tests/token-contrast-proof.test.mjs`，`docs/design/gplus-2026-10/contract/matrices.json`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`
- 依赖：TCRN-DS-SUB-113，TCRN-DS-SUB-127
- 判据：145-GWT3：夜间读 TMS 后缀色为 #2c63c8（--tcrn-brand-suffix-tms 两主题同值），矩阵对应格标红且注明待裁。符合性：夜间对比度按实测记矩阵红格（于纸 3.13、于画布 3.33），不在本单改色；token-contrast 的 TMS 夜间两条豁免恢复并带 MIN-20261013-SHELL D7 引用，tokens:proof 退出 0；Navigation.test 与 ui-tokens 测试里钉夜间后缀值的断言改回同色。
- 数值来源：tokens.json brand 段 brand-suffix-tms（现 night #7aa0f5、nightRef marks.json#tms.palette.bright，O-3）；Shell.dc.html B 段后缀行注（夜间 3.33 / 3.13）；marks.json tms.palette.deep #2c63c8；R3 现码核对：WORDMARK_EXEMPTIONS 在 token-contrast-proof.mjs 约第 80–81 行。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
- 注意：marks.json 的 bright 是标本身的颜色，不改。五个生成物头同变归本单（C-13）。壳层矩阵的对应格在 SUB-136 按同一规则标红。D7 写明与 INIT-015 收口 S-6 一并裁定（建议夜间取 #7aa0f5）：Owner 改裁时只回改本单这几处。

### TCRN-DS-STORY-146 · PageHeader 必有与纸内布局重排

2 张：TCRN-DS-SUB-129、TCRN-DS-SUB-130（父单 work:792b63bc73100197f6f41e96）

#### TCRN-DS-SUB-129 · PageHeader 必有：ProductShell 类型层必填，纸内首行，面包屑单行截断加 title

- 包 / 波：P6 / W5
- 改动文件：`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`packages/ui-react/src/components/DataDisplay/DomainDisplay.tsx`，`packages/ui-react/src/components/DataDisplay/DomainDisplay.test.tsx`，`packages/ui-react/src/styles/base.css.ts`，`apps/storybook/src/contract-stories/story-content.tsx`，`apps/storybook/src/contract-stories/visual-instances/aos-frontend-shell-slice.tsx`，`apps/storybook/src/contract-stories/visual-instances/aos-owner-quality-product-shell.tsx`，`apps/storybook/src/contract-stories/gplus/samples/composition-one.tsx`
- 依赖：TCRN-DS-SUB-121
- 判据：146-GWT1：ProductShell 不传 PageHeader 时类型检查报错（@ts-expect-error 测试），传入时纸内首行是它。146-GWT2：面包屑在 390 与 1440 宽一行、超出截断、有 title。符合性：PageHeader 由 prop 类型（required）保证，不靠运行时警告；面包屑任何宽度一行；整仓 typecheck 0。
- 数值来源：build-shell2.mjs css 第 78–84 行（.ts-content 内距 14 28 12、gap 10；.ts-crumbs 12 号、gap 6、nowrap）；paperBody() 第 194–202 行；contract 第 452 行（PageHeader 必有）；geoRows「面包屑」第 439 行；DomainDisplay.tsx PageHeader 第 216–268 行。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
- 注意：与 SUB-124 的 Breadcrumb 归位同一结果，本单先立 PageHeader 必有，SUB-124 再收 Tabs 与 Breadcrumb 的家族归位。纸内内距（板上 28）先找现有 space token，不等时记问题（problems 第 7 条）。

#### TCRN-DS-SUB-130 · 纸内布局重排：五件留白从纸缘起算，文档与设置页内容 1040 居中，间距取 token

- 包 / 波：P6 / W5
- 改动文件：`packages/ui-react/src/components/DataDisplay/DomainDisplay.tsx`，`packages/ui-react/src/components/DataDisplay/DomainDisplay.test.tsx`，`packages/ui-react/src/components/Layout/Layout.tsx`，`packages/ui-react/src/components/Layout/Layout.test.tsx`，`packages/ui-react/src/styles/base.css.ts`，`docs/design/gplus-2026-10/contract/tokens.json`，`packages/ui-tokens/src/gplus-tokens.generated.ts`，`packages/ui-react/src/styles/generated/actions.pairs.ts`，`packages/ui-react/src/styles/generated/inputs.pairs.ts`，`packages/ui-react/src/styles/generated/typography.scale.ts`，`apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts`，`packages/ui-tokens/src/index.ts`，`packages/ui-tokens/src/index.test.ts`，`packages/ui-tokens/src/tokens.css`，`apps/storybook/src/storybook.css`
- 依赖：TCRN-DS-SUB-129
- 判据：146-GWT3：SettingsLayout 在 1440 宽内容宽 ≤ 1040 且左右居中。146-GWT4：SplitView 左缘 = 纸内容左缘（纸离边 12 加内距），不留侧栏位。符合性：SplitView、DetailLayout、SettingsLayout 的左右留白从纸缘起算；文档与设置页 max-width 1040 居中（列表与详情页用全宽纸）；Surface 与 Divider 的间距来自 token；几何门（单行与溢出、三缘对齐）对本单改动无新红。
- 数值来源：MIN-20261013-SHELL D1（文档与设置页内容居中 1040）；Shell-2.dc.html E 段「PageHeader 必有」；现码 base.css.ts 第 1144–1152 行（split-view、detail-layout）、第 2221 行（surface）、第 3175 行（settings-layout）；composition-three 样板的 1040 内联值（现仓唯一来源）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
- 注意：1040 不在 F 段、现仓也没有对应 token：按 problems 第 7 条的建议，本单在 contract/tokens.json 加一条主题无关布局 token（建议键 layout-content-max-w，cssVar --tcrn-layout-content-max-w，1040px）并走 token 管线；五个生成物头同变归本单（C-13）。属按建议先做，判断可更正。

### TCRN-DS-STORY-147 · Storybook 文档壳改顶带壳

2 张：TCRN-DS-SUB-131、TCRN-DS-SUB-132（父单 work:6fd15b4e5366871194d862ab）

#### TCRN-DS-SUB-131 · 文档壳换 ProductShell 顶带态：删 tcrn-doc- 壳层骨架，目录改纸内 TocRail，内容 1040

- 包 / 波：P10 / W7
- 改动文件：`apps/storybook/src/build/page-template.tsx`，`apps/storybook/src/alpha-styles.ts`，`apps/storybook/src/storybook.css`，`apps/storybook/src/build/client-scripts.ts`，`apps/storybook/src/build/navigation.ts`，`apps/storybook/src/contract-stories/prototypes/storybook-shell-demos.tsx`，`apps/storybook/src/build/locales/storybook-content-text.ts`，`scripts/lib/locale-invariant-ledger.mjs`
- 依赖：TCRN-DS-SUB-125，TCRN-DS-SUB-130
- 判据：147-GWT2：文档页壳为顶带 52、纸 12 / 52 / 14，常驻侧栏 0。147-GWT3：文档目录在纸内 TocRail。147-GWT4：storybook:build 退出 0。符合性：文档壳由 ProductShell 顶带态渲染（标按钮、固定项、完整菜单承载文档分类）；文档页内容居中 1040（SUB-130 的 token）；夜间文档导航分类计数字色 ink-2（INIT-015 N-1）；tcrn-doc- 只留文档自身排版（非壳）。
- 数值来源：Shell-2.dc.html E 段（文档站同样用顶带壳、目录与书签在页内）；MIN-20261013-SHELL D1；INIT-015 closeout 第 3.2 节 N-1、N-2、N-6；现码 apps/storybook/src 的 tcrn-doc- 计数（alpha-styles.ts 309、storybook.css 170、page-template.tsx 79、client-scripts.ts 13、prototypes 13）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> run public:naming:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
- 注意：先换壳、后删例外：4 条文档作用域例外与 2 条白名单的删除在 SUB-132，本单期间 doc-shell 门的红只记。Storybook 是包的发布面，不另写壳样式；不改 smoke.test.ts（SUB-132）。

#### TCRN-DS-SUB-132 · 文档壳门收口：删 4 条例外与 2 条白名单，shell:parity 文档侧与各门文档壳读数改新几何

- 包 / 波：P13 / W8
- 改动文件：`scripts/shell-fidelity-proof.mjs`，`scripts/doc-shell-class-proof.mjs`，`tests/doc-shell-class-proof.test.mjs`，`docs/design/gplus-2026-10/doc-class-map.json`，`scripts/shell-parity-proof.mjs`，`apps/storybook/src/build/foundation-visual-standards.ts`，`scripts/storybook-smoke.mjs`，`scripts/internal-alpha-browser-proof.mjs`，`scripts/full-surface-remediation-proof.mjs`，`apps/storybook/src/smoke.test.ts`
- 依赖：TCRN-DS-SUB-131
- 判据：147-GWT1：apps/storybook 跑 doc-shell:proof，包外类 0 且例外清单为空。符合性：INIT-015 SUB-101 方案 A 的 4 条文档作用域例外与 2 条白名单项删除（shell-fidelity-proof.mjs 的 DUPLICATE_SELECTOR_WHITELIST 与 R3M5 例外）；shell:parity 文档侧量顶带与纸，与包侧同一几何；storybook:smoke、internal-alpha:browser-proof、full-surface:proof 的文档壳读数改为新几何——只改期望值与选择器，不改门的判定语义。
- 数值来源：shell-fidelity-proof.mjs 第 97、124、296、547 行（白名单与例外）；shell-parity-proof.mjs 第 20–140 行（文档侧角色）；foundation-visual-standards.ts 的 shellMetrics（R3 核对：288、96）；INIT-015 closeout 第 3.2 节 N-2。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
  - `corepack pnpm@10.12.1 -C <包树> run shell:parity`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> run full-surface:proof`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
- 注意：跑 internal-alpha 与冒烟会写回执：跑完 git -C <包树> checkout -- docs/verification，新出现的未跟踪文件移进 scratch 的 trash（C-12）。视觉签名变化只记，归 SUB-140。

### TCRN-DS-STORY-148 · 第一批五样板换新壳，映射与 shellFrame 改值

2 张：TCRN-DS-SUB-133、TCRN-DS-SUB-134（父单 work:bad748579e7b1b7f0773bd53）

#### TCRN-DS-SUB-133 · 四板 D 段补入顶带壳样板（画板侧）：screen() 抽模块、Shell 板字节不变、不再 cut D 段

- 包 / 波：P11 / W7
- 改动文件：`docs/design/gplus-2026-10/tools/shell-screen.mjs`，`docs/design/gplus-2026-10/tools/build-shell2.mjs`，`docs/design/gplus-2026-10/tools/lib.mjs`，`docs/design/gplus-2026-10/tools/build-typography.mjs`，`docs/design/gplus-2026-10/tools/build-icon.mjs`，`docs/design/gplus-2026-10/tools/build-actions.mjs`，`docs/design/gplus-2026-10/tools/build-inputs.mjs`，`docs/design/gplus-2026-10/boards/V2-B1-Typography.dc.html`，`docs/design/gplus-2026-10/boards/V2-B1-Icon.dc.html`，`docs/design/gplus-2026-10/boards/V2-B1-Actions.dc.html`，`docs/design/gplus-2026-10/boards/V2-B1-Inputs.dc.html`，`docs/design/visual-standard/tools/make-standard.mjs`，`docs/design/visual-standard/boards/Typography.dc.html`，`docs/design/visual-standard/boards/Icon.dc.html`，`docs/design/visual-standard/boards/Actions.dc.html`，`docs/design/visual-standard/boards/Inputs.dc.html`，`docs/design/visual-standard/heights.json`
- 依赖：TCRN-DS-SUB-123，TCRN-DS-SUB-125，TCRN-DS-SUB-130
- 判据：148-GWT1：成品板 Typography、Icon、Actions、Inputs 的 D 段各有一个顶带壳样板（名册、成员、账单等通用产品内容），壳几何与 07b 板相同（样板由同一 screen() 生成）。148-GWT4 画板侧：四板 B 段矩阵格数 44 / 28 / 116 / 42 与 data-expect 对比度在重生成前后逐格相同。符合性：成品画布一板一版原地替换（只改仓内板文件，收口列入待发布清单），不新增版本；改过的板按 D4 关键词审计（构图一、顶栏、钉住、待 Owner、草案；「侧栏尺度」除外）清零；Brand 板按 problems 第 4 条处置。
- 数值来源：build-shell2.mjs screen() 第 248–271 行、strip() 第 223–234 行、css 第 36–183 行；make-standard.mjs 第 15 行 cutD 与第 59–65 行 FAM 循环；heights.json（Shell 5324、Shell-2 4895）；D3（画板高度不超过 8000）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node docs/design/gplus-2026-10/tools/build-shell2.mjs final --h1 5324 --h2 4895`
  - `git -C <包树> diff --exit-code -- docs/design/visual-standard/boards/Shell.dc.html docs/design/visual-standard/boards/Shell-2.dc.html`
  - `corepack pnpm@10.12.1 -C <包树> exec node docs/design/gplus-2026-10/tools/build-<typography|icon|actions|inputs>.mjs <canvas.json 中该板的 h>（逐板）`
  - `corepack pnpm@10.12.1 -C <包树> exec node docs/design/visual-standard/tools/make-standard.mjs docs/design/visual-standard/heights.json`
  - `git -C <包树> diff --stat -- docs/design`
- 注意：Shell.dc.html 与 Shell-2.dc.html 是字节真值：抽模块后跑 build-shell2.mjs final --h1 5324 --h2 4895，两块输出必须与仓内逐字节相同（git diff --exit-code），不同即停下，不提交两块板。只跑 final 模式，不写草案板。lib.mjs 已重构到 data.mjs，build-shell2 的导入先对齐（STORY-148 实施注）。四板生成高度取 canvas.json 各板 h；D 段加入后高度变化写进 heights.json，超 8000 拆块。画布发布不在实施侧。

#### TCRN-DS-SUB-134 · 五样板 story 换顶带壳，storybook-map 23 行全绿，shellFrame 改量顶带与纸

- 包 / 波：P14 / W8
- 改动文件：`docs/design/gplus-2026-10/storybook-map.json`，`docs/design/gplus-2026-10/storybook-map.md`，`scripts/lib/gplus-measure.mjs`，`scripts/geometry-measure-proof.mjs`，`tests/geometry-measure-proof.test.mjs`，`tests/fixtures/geometry-measure/shellFrame.green.html`，`tests/fixtures/geometry-measure/shellFrame.red.html`，`tests/fixtures/geometry-measure/manifest.json`，`apps/storybook/src/compositions.stories.tsx`，`apps/storybook/src/contract-stories/gplus/samples/composition-one.tsx`，`apps/storybook/src/contract-stories/gplus/samples/composition-three.tsx`，`apps/storybook/src/contract-stories/gplus/sample-stories.tsx`，`scripts/storybook-visual-proof.mjs`，`tests/storybook-visual-proof.test.mjs`，`apps/storybook/src/build/locales/storybook-content-text.ts`，`scripts/lib/locale-invariant-ledger.mjs`
- 依赖：TCRN-DS-SUB-131，TCRN-DS-SUB-133
- 判据：148-GWT2：storybook-map 23 行全绿，删一个 story 判红。148-GWT3：shellFrame 夹具跑 geometry:measure 绿；顶带加 1px 底线判红。148-GWT4：第一批五矩阵格数 44 / 28 / 10 / 116 / 42 与对比度不变（matrix story 不动）。符合性：五个样板 story（id 不变，C-9）渲染顶带壳；样板行改为顶带壳 story；shellFrame 改量顶带 52、纸 12、圆角 14（读 C-5 钩子，不读旧 .tcrn-product-shell__workspace / .tcrn-top-bar）；样板行里随侧栏消失的 rail 检查按 problems 第 24 条处置。
- 数值来源：storybook-map.json rows 第 2、5、8、11、14 行（五个 D 段）与第 15–20 行（构图一、构图三）；gplus-measure.mjs 第 616–654 行（shellFrame）；geometry-measure-proof.mjs 第 66 行（shellFrame 阈值 12 / 52 / 0.5）、第 93 行（SAMPLE_CHECKS）、第 118–120 行（旧壳变异）；Shell-2.dc.html D 段。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run public:naming:proof`
- 注意：映射保持 23 行：壳层 story 不进 gplus- 类目（C-9）；构图一、构图三两组行改指顶带壳样板并改标题（problems 第 5 条）。门报告不提交（C-12）。阈值只在门脚本。

### TCRN-DS-STORY-149 · 壳层 18 条门接入 geometry-measure、verify 与 CI

3 张：TCRN-DS-SUB-135、TCRN-DS-SUB-136、TCRN-DS-SUB-137（父单 work:854cd021e8bb869b2b585fe0）

#### TCRN-DS-SUB-135 · 壳层读数库与 18 门判定（画板夹具）：口径同 measure-shell.js，每门一条会红的变异

- 包 / 波：P3 / W1
- 改动文件：`scripts/lib/shell-measure.mjs`，`scripts/shell-measure-proof.mjs`，`tests/shell-measure-proof.test.mjs`，`tests/fixtures/geometry-measure/shell/manifest.json`，`tests/fixtures/geometry-measure/shell/mutations.json`
- 依赖：无
- 判据：149-GWT1 画板侧：18 条门在两块成品板上全绿；每门对应变异判红（变异取 G 段「会红的变异」列）。149-GWT4：measure-shell.js 与门库对同一屏幕读数相同（±0.5）——测试里两者注入同一页面逐项比对。符合性：读数口径与 measure-shell.js 一致；阈值只在门脚本的 THRESHOLDS，库不含阈值（INIT-015 W1-F 约定）；D 段 12 行关系断言各落到一条或多条门。
- 数值来源：build-shell2.mjs gates 第 492–512 行（18 门与变异）、geoRows 第 428–442 行（12 行关系断言）；docs/design/gplus-2026-10/measure-shell.js 全文（85 行）；boards/spec-geom.json；Shell.dc.html 与 Shell-2.dc.html。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/shell-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs --fixtures`
- 注意：G 段「固定项间距」写「中线 20」，按 26 实现（problems 第 1 条）；「品牌资产 digest」按产品键取 logos2 对应文件（problems 第 17 条）；「下拉宽 = 固定项宽 3 至 4 倍」不作断言（problems 第 18 条）。行为门（焦点回路、登入动画、点外部关闭、⌘K）在画板上量不了：本单只立判定函数与夹具接口，真件在 SUB-137。库内维护两套选择器：画板 .ts-* 与包件 data-* 钩子（C-5）。画板夹具在板原宽 1240 量；真件视口与语言参数由脚本定（C-11）。全是新文件，不碰 gplus-measure.mjs 与 geometry-measure-proof.mjs（W8 归 SUB-134）。

#### TCRN-DS-SUB-136 · 壳层矩阵 story shell-matrix：matrices.json 加 shell 板，07a B 段逐格渲染真件

- 包 / 波：P9 / W6
- 改动文件：`docs/design/gplus-2026-10/contract/matrices.json`，`apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts`，`apps/storybook/src/contract-stories/gplus/matrix-renderer.tsx`，`apps/storybook/src/contract-stories/gplus/matrix-stories.tsx`，`apps/storybook/src/contract-stories/groups/components.ts`，`apps/storybook/src/contract-stories/governance.ts`，`apps/storybook/src/components.stories.tsx`，`apps/storybook/src/smoke.test.ts`，`apps/storybook/src/build/locales/storybook-locale-text.ts`，`scripts/lib/locale-invariant-ledger.mjs`，`scripts/lib/story-budget.mjs`，`scripts/contract-proof.mjs`，`tests/contract-proof.test.mjs`
- 依赖：TCRN-DS-SUB-121，TCRN-DS-SUB-126，TCRN-DS-SUB-128
- 判据：INIT 符合性「壳层 07a 板 B 段矩阵与 story 逐格一致（对比度差 0；产品色后缀夜间按 D7 暂记红格）」的被测物：shell-matrix 按 B 段逐格渲染真件静态态（data-tcrn-preview-state），每格 data-cell 与 07a 同名、data-expect 与板同值；137-GWT5、138、139「每格对比度与 B 段相等」由此可量；contract:proof 0（格数总和按新增 shell 板更新）。
- 数值来源：build-shell2.mjs matrixRows 第 303–344 行；Shell.dc.html B 段（第 398 行起的 data-cell 与 data-expect）；contract/matrices.json 现五板（typography、icon、brand、actions、inputs）与 thresholds；contract-proof.mjs 第 67 行与 tests/contract-proof.test.mjs 第 95 行（现总数 240）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run public:naming:proof`
- 注意：登记点照 INIT-015 R3 SUB-092 的五处（matrix-stories、groups/components、governance、Components 组 CSF 适配导出、smoke.test），标题五语在 storybook-locale-text.ts。不进 gplus- 类目，storybook-map 不加行（problems 第 5 条）。matrices.generated 的头同变归本单（C-13）。

#### TCRN-DS-SUB-137 · 壳层 18 门对真件：两视口两语言、行为门交互、串入 geometry:measure、CI 经 verify 必跑

- 包 / 波：P12 / W7
- 改动文件：`scripts/shell-measure-proof.mjs`，`scripts/lib/shell-measure.mjs`，`tests/shell-measure-proof.test.mjs`，`tests/fixtures/geometry-measure/shell/manifest.json`，`tests/fixtures/geometry-measure/shell/mutations.json`，`package.json`，`.github/workflows/verify.yml`
- 依赖：TCRN-DS-SUB-135，TCRN-DS-SUB-136，TCRN-DS-SUB-121，TCRN-DS-SUB-122，TCRN-DS-SUB-126
- 判据：149-GWT1 真件侧：18 条门跑 geometry:measure 全绿，每条对应变异判红（含焦点回路不还焦点、去掉会话标记、行高改 32 等行为变异）。149-GWT2：pnpm verify 含壳层门（geometry:measure 一段）——本包不跑 verify，由批末 verify 证。149-GWT3：CI 工作流的 pnpm verify 一步含壳层门，verify.yml 注释点名。符合性：运行只在 1440×900 与 390×844 两视口、en 与 zh；读数口径同 measure-shell.js。
- 数值来源：build-shell2.mjs gates 第 492–512 行；STORY-149 假定（无头浏览器、1440×900 基线）；package.json 现 geometry:measure 与 verify 链；.github/workflows/verify.yml 第 56–59 行（Run the gate chain：pnpm verify）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/shell-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs --fixtures`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
- 注意：story 渲染在文档页里，选择器限定 story 正文（storybook-routes 的 storyBodySelector），不量文档壳（文档壳在 W7 同期换成 ProductShell）。根 package.json 只改 geometry:measure 一行，verify 链不改。门报告不提交（C-12）。与 SUB-134 的 shellFrame 不重叠：shellFrame 量样板，壳层门量壳 story。

### TCRN-DS-STORY-150 · 4.0.0 候选：版本面、CHANGELOG、迁移说明、Owner 目视验收清单

3 张：TCRN-DS-SUB-138、TCRN-DS-SUB-139、TCRN-DS-SUB-140（父单 work:b140305693da159bfdc615c8）

#### TCRN-DS-SUB-138 · 4.0.0 版本面 7 处、CHANGELOG 发布段两批合一、迁移说明补齐两批破坏性条目

- 包 / 波：P15 / W9
- 改动文件：`CHANGELOG.md`，`docs/migration-4.0.md`，`package.json`，`packages/ui-tokens/package.json`，`packages/ui-react/package.json`，`packages/ui-copy-state/package.json`，`apps/storybook/package.json`
- 依赖：TCRN-DS-SUB-128，TCRN-DS-SUB-132，TCRN-DS-SUB-133，TCRN-DS-SUB-134，TCRN-DS-SUB-137
- 判据：150-GWT2：迁移说明对照 EPIC-040 与 EPIC-049 的 breaking 清单，每条有迁移步骤——第一批：lucide 移除、名册扩充、registry 改名、Text 新 prop、Button lg、后缀色、字体自托管、token 改名别名；第二批：壳改顶带、sidebar 与钉住态移除、三条壳 token 退役、SideNav 等退役、Tabs 合一、名册 38、ProductLockup 变体、PageHeader 必有。150-GWT4：version-surface-proof 7 处读回 4.0.0。符合性：CHANGELOG 发布段过 changelog-release-sections-proof；不推送、不打 tag、不发版。
- 数值来源：EPIC-049 正文（破坏性变化清单）；STORY-150 符合性判据；INIT-015 候选的 CHANGELOG 4.0.0 段与 docs/migration-4.0.md；SUB-113、SUB-120、SUB-125 追加的条目。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run scaffold:proof`
  - `corepack pnpm@10.12.1 -C <包树> run scan`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
  - `corepack pnpm@10.12.1 -C <包树> run public:naming:proof`
- 注意：版本号现已是 4.0.0（INIT-015 STORY-134 候选），只在读回不一致处改。主版本仍为 4（STORY-150 假定）。

#### TCRN-DS-SUB-139 · Owner 目视验收清单：成品画布 8 板逐板一节，两批合一，删构图一与侧栏项

- 包 / 波：P15 / W9
- 改动文件：`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`
- 依赖：TCRN-DS-SUB-138
- 判据：150-GWT3：清单对照成品画布板数每板一节（Tokens、Typography、Icon、Brand、Actions、Inputs、Shell 上、Shell 下），不含构图一与侧栏项（INIT-015 清单里的构图一壳几何、侧栏引导列、收起态三中线、构图三样板删除，D8 ③）。符合性：每节写看哪些 story、对照哪段板、机器判据已覆盖什么、只能目视的是什么；列出 SUB-123、SUB-133 改过的成品板文件交设计会话发布；Owner 目视不由实施对话代签。
- 数值来源：docs/design/visual-standard/canvas.json（8 板）；docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md（第一批清单）；MIN-20261013-INIT016 D8 ③。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run scan`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
- 注意：只写文档；不写「已通过」之类的结论。

#### TCRN-DS-SUB-140 · 批末生成物再生：回执、视觉签名基线与门报告一次再生，pack:smoke 与 storybook:build 退出 0

- 包 / 波：P15 / W9
- 改动文件：`docs/verification/**`
- 依赖：TCRN-DS-SUB-139
- 判据：150-GWT1：pnpm pack:smoke 通过。符合性：storybook:build 退出 0；docs/verification 下的回执、视觉签名基线与各门报告由本单一次写（C-12）；视觉签名的重收逐条列变化，只收换壳、换样板带来的变化。
- 数值来源：批量处理原则 v3 第 4 条（生成物批末再生）；INIT-015 SUB-046 的做法（重收前逐条列签名变化）；R4 判断 J 项「visual-selection-result.json 永不入仓、no-overclaim-scan.json 由主线程在最后一次文档提交时再生」。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run pack:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:contracts`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
- 注意：本单是批末固定收尾步骤，在批末 verify 之前跑，不跑 verify。预期外的签名变化停下记问题，不接受。visual-selection-result.json 不入仓，internal-alpha/no-overclaim-scan.json 不在本单提交。
