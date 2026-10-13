# 附件 · P11 的 R2 回写素材（主线程汇编）

SUB-087 回写 CHANGELOG、迁移说明、ui-tokens README 与 owner-acceptance 时用：A 节是主线程问题清单（各包自定取舍、行为变化、要目视的项、待 Owner 的项），B 节是各包 handoff 的 §3.4 回显与实施取舍原文。只写已落地的事实；未达成或部分达成的（SUB-052 余 4 条字面值待 O-6、SUB-080 未达成）照实写为现状，不写成已完成。

## A. 主线程问题清单（runs/r2/problems/main.md 全文）

每条：现象、证据、处置。批末与各包问题清单一起合并处置。

**RM1 P4 改动钉住的两条 Navigation 断言（集成修复，交 P2）。**
现象：P4 按判断删掉壳内搜索的 focus-within 规则（SUB-059）、把快捷键文字改成 ink-2（SUB-062）后，`packages/ui-react/src/components/Navigation/Navigation.test.tsx` 约 533 行与 753 行的两条断言仍钉着旧规则，`--filter @tcrn/ui-react test` 155/157。该文件属 P3 文件集（P3 在跑，自 060789f 切出，不含 P4 改动），不在 P4 文件集内。
证据：`runs/r2/problems/P4.md` 第 1 条（含逐字改法）；P4 合入集成分支 e915306。
处置：P3 合入后集成分支上这两条为已知红。改法作为「集成修复」项写进 P2 摘录的第一项（P2 主力档，须先合入 P1、P3、P4；P2 运行期间没有别的包持有该文件），不单独为两行断言派代理；P2 之前切出且跑 ui-react test 的包（P10）在摘录里注明这两条为已知红。拆分的教训：Inputs 规则改动要把 Navigation.test.tsx 里针对 Inputs 的断言一并列进文件集（R2 判断时考虑写进 lessons）。

**RM2 docs/contract/README.md 的 package-css 描述随 SUB-053 过时（交 P11）。**
现象：SUB-053 之后 contract-proof 的 package-css 读整张表的状态规则（clauses.md C2 定义并上 pairs.json 状态条件），`docs/contract/README.md` 第 47 行仍写只查「pairs.json 目标基类的状态规则」。该文件不在任何 R2 包文件集。
证据：`runs/r2/problems/P3.md` P2（含建议正文）；P3 合入集成分支 6225880。
处置：（改）按批量原则第 1 条不插入本批，并入 RM9 交 R2 判断。

**RM3 P3 的两处自定口径（交验收）。** P3 问题 P3：package-css 的「全部状态规则」取 clauses.md C2 定义（data-* 里只有 `data-tcrn-preview-state` 算状态条件），base.css.ts 两条由别的 data-* 限定、含颜色字面量的壳层规则不计入；P3 问题 P4：SUB-057 按判断 R2-8 改法把默认隐藏 moon 的 `[data-theme-icon="dark"]` 也删去（拆分文字只写 html 级两条）。均交 R2 验收判可否，不另派。

**RM4 子代理流程瑕疵。** P3 一条只读探索命令用了 `cd` 进 scratch（未弹框、未改文件）；P7 起派工提示加「只读命令也不 cd」。

**RM5 P1 的自定取舍与附带观察（交验收与收口回显）。** ① 浅色属性选择器 `[data-tcrn-theme="light"]` 由生成器从夜间选择器派生，`contract/tokens.json` 的 `themes.light.selector` 仍是 `:root`（契约未改；SUB-047 文件清单只列生成器），可事后更正。② ink-3 复核：ink-3 文字不落在 panel-2、bg-2、hover、wash 上（唯一 wash 实例是禁用按钮，豁免）；附带观察：文档导航计数与壳样例里 ink-3 落在 acc-bg 上，对比 4.35:1 与 4.18:1，属文档壳与壳层家族，记给设计权威，R2 验收判断是否进 Owner 事项。③ 流程：tokens-sync 读 ui-tokens dist，改契约后须先构建 ui-tokens（已写进 P2、P5 摘录）。

**RM6 axe 字标豁免不分主题（P9 的取舍，收口回显，Owner 可更正）。** SUB-085 的 axe 豁免按「后缀选择器 + 登记的后缀色」匹配，不看主题与承载面；因此夜间样板侧栏上 6 个 Design System 后缀节点（对比 4.18）也被豁免，而 token-contrast 的登记只写了浅色。P9 建议维持（字标按 logotype 豁免）；改为同时匹配主题是一行改动，那 6 个节点会重新计入。与 O-3（夜间 TMS 后缀色）同组列给 Owner。
P9 问题清单的去向：#1 axe landmark-unique 110 节点 → P7 SUB-071；#2 aria-allowed-role 4 节点（Card 上 `article role="status"`）→ P6 SUB-068；#3 标语与锁定组合说明 ink-3 → O-2；#4 390px 文档壳顶栏 401px 高、品牌字出现两次 → C-21/O-1；#5 zh-CN `text-styles` 两条新未译文案 → 可能属 P6 SUB-067，R2 验收确认；#6 故事高度预算 1 条超限、8 条陈旧 → P12 SUB-075。

**RM7 P7 的两处超出判据字面的做法（交验收；其一要目视）。** ① SUB-070：MultiSelect 没有「展开」选项，页面脚本会把展开的列表移出主题块，静态样例因此去掉 `data-choice-presentation` 钩子——不再响应点击，列表位于触发器右侧而不是下方，需目视（列入 owner-acceptance 清单）。② SUB-071：五个样板同在一页，只改夜间壳名不能消重名，壳名改为按样板命名、夜间壳加「（night）」，浅色壳名也随之改变；矩阵分节去掉 aria-label。另 SUB-072 顺带从 ledger 删去 4 个不再使用的资产 ID（文件在包文件集内、不在该单文件清单）。品牌样板去掉 Asset ID 列后与 Brand 板「资产 ID」列不一致，已写进 P8 摘录交 SUB-077 核对映射差异记录。
P7 问题清单去向：dark 轮对比（P1 已修，P7 树早于 P1 合入）；样板 rail（O-1）；后缀与标语对比（R2-30 / O-2）；Card aria-allowed-role（P6 SUB-068）；text-styles 两条 zh-CN 泄漏（P6 SUB-067）；navigation-focused-shells-spec 高 2520px（P6 SUB-066 删 dense/compact 原型后复核，余量交 P12 SUB-075）；buttonFeedbackOk（P9 SUB-083 已修，P7 树早于 P9 合入）；doc-shell 两项（C-21/O-1）；视觉签名（SUB-046）。

**RM8 SUB-052 部分达成：生成段余 4 条字面字号或行高（交 Owner，归 O-6）。** `typography.scale.ts` 里 numeral-inline `font-size:16px`、numeral-large `font-size:44px` 与 `line-height:48px`、mono `font-size:11.5px` 没有对应的现有 token；新增 token 属 O-6 越级，P2 未做，Typography.test.tsx 钉住这 4 条为仅剩的字面值。可选：新增四个刻度 token（typography.json 加条目、index.ts 注册，生成器不改），或改用现有刻度（改变视觉）。证据 `runs/r2/problems/P2.md` 第 1 条。

**RM9 R2 改动带出的文档漂移（记入问题清单，交 R2 判断进下一批；不插入本批）。** ① `docs/contract/README.md` 第 47 行 package-css 描述（RM2，P3 给了正文）；② `docs/design/gplus-2026-10/README.md` 第 12 行 pairs.json 少 rf、第 16 行 typography.json 未提刻度 tokens 与链接对表；③ `inputs.pairs.ts` 段注释少 rf（注释写在 `scripts/contract-generate.mjs` 的 `inputsFile()`）。按批量原则第 1 条「批内发现的新工作进下一批」，RM2 不再附加进 P11 摘录，与本条一并交判断。

**RM10 Inputs 画板未随 rf 元组重生成（交设计权威，与 §3.4 第 1 项同列）。** `docs/design/gplus-2026-10/tools/build-inputs.mjs` 重生成会多一条 `--edge-rf` 声明，但板面没有只读获焦规则；签入的板 HTML 与现行契约生成结果差这一条，没有门比对，不显红。是否给画板补只读获焦态由设计权威侧定。

**RM11 P2 带出的两处行为变化（交 P11 的 SUB-087 写进 CHANGELOG 与迁移说明）。** `tcrn-link--quiet` 现在须与 `tcrn-link` 同用（仓内无单独使用处）；`gplus-tokens.generated.ts` 头部现在也列 typography.json，改 typography.json 的单要连带改写其 contract-sha256 行。

**RM12 P5 交回的余项与自定取舍。** ① storybook:smoke 28 条红全在壳内搜索框（P5 文件未给它作画；未在原码上复跑，是否先前即红未确认），P6 的 SUB-081/082 正改冒烟脚本，批末 verify 时与 P4 删去壳内 focus-within 规则（SUB-059）、P5 改顶栏搜索（SUB-064）一起复核根因；② shell:parity 余文档壳三项（brand-lockup、sidebar、shell-relations），原码上同样红，属 C-21/O-1；③ doc:sample-style package-context 142 处已按 §3.3 交后续批次；④ `docs/style-scale.md` 过时、不在 P5 文件集，并入 RM9 交判断；⑤ 规则级守卫不拦按 data 属性命中包组件的规则，放宽属改扫描器口径，交判断；⑥ dense 原型在 P6 的 SUB-066 退役前失去包裹样式。SUB-065 的守卫实际落在 `scripts/shell-fidelity-proof.mjs` 的 `docsPackageSelectorDuplication`（拆分预期是 doc-shell-class-proof），验收核对。
P5 的自定取舍（§3.4 第 8 项，收口回显，Owner 可更正）：守卫把宽度与换行类属性算作摆放属性（依据 docs/style-scale.md）；oracle 搜索边框取透明静止边而非计算边框色；nav-proof 跳转链接登记为例外而非删除；五条例外（tooltip 静态预览、筛选栏、nav-proof 跳转链接、doc-shell 品牌收起、窄屏品牌——后两条依 C-21 待 O-1），逐条见 `runs/r2/handoff/P5.md`。
流程：P5 两条只读命令含 `cd`（未弹框、未改文件），并入 RM4。

**RM13 P8 的口径与 DIFF-9 状态（交验收）。** ① 为让映射与门一致，actions.A 另加 rowAlign，构图一四行也加 rowAlign（超出 SUB-077 判据字面）；iconStroke 另要求图标实际渲染 16px。② P7 去掉品牌样板的 Asset ID 整列（SUB-072 标题只写「去掉 Asset ID 列里的仓库名标识」），P8 按现有格式补 DIFF-9，状态记「已裁定」并引 R2-25。没有裁定授权删整列：R2 验收判断去整列是否在 R2-25 范围内，DIFF-9 的状态是否应为「待 Owner 知悉」，必要时列入 Owner 目视清单。
P8 局部门：geometry:measure 与 storybook:visual-proof 的 ok=false 只由五个样板 rail（O-1）引起；第 18 步 notApplicableRequired 全空、checksNeverApplied 为 []，iconStroke 74 枚 16px 图标全 1.25px。流程：P8 一条只读命令含 `cd /private/tmp`，并入 RM4。

**RM14 P10 改 Button title 带出的两处集成红（交集成修复包 I1，主力档）。** ① `packages/ui-react/src/components/Clipboard/Clipboard.test.tsx` 第 180 行仍断言旧 title（只写原因），集成分支 ui-react test 161/162；② `apps/storybook/src/build/client-scripts.ts` 按整串查表翻译 title，「标签 — 原因」在非英文语言下不翻译，internal-alpha 的 ja 检查（button-spec-usage）预计报英文泄漏。两文件不在任何 R2 包文件集，属集成冲突；按 START 档位规则交主力档集成子代理 I1（摘录 `runs/r2/excerpts/I1.md`），与在跑的 P6 文件集不相交；I1 若必须改 P6 持有的 locale 文件就停下交回。本批后续若再有集成冲突，优先续用 I1（SendMessage）而不另派。
P10 其余条目：Inputs 禁用原因 title 不是 C7 登记承载元素（信息）；后续家族按新口径会命中的数（徽标 31、表格单元 35、页头标题 12、导航项 1，信息）；`docs/contract/roles.json` description 未写新口径，并入 RM9 交判断。P10 的二选一（Button title 取「标签 — 原因」，原因仍走 aria-describedby）与 §3.4 第 7 项回显见 `runs/r2/handoff/P10.md`。

**RM15 SUB-080 未达成（P6 停在该单，主力档第一次退回；交 R2 判断）。** 只改 story-content.tsx 做不到：① `scripts/geometry-proof.mjs` 写死 `openMenus === 8`，其中两个是 SUB-066 刚退役的原型菜单钮，现只剩 6 个，P6 视改数为改门阈值而未改；② R1 删掉了让搜索结果留在版面内的文档规则（doc-class-map 误判为尺寸修饰），门的变异样式与包的默认定位相同，单靠版面调整做不到「基线绿、变异红」。现状：导航壳故事的搜索结果面板压住 h3 与第一段。P6 的建议改法在 `runs/r2/problems/P6.md` #1、#2。判断要定：8 → 6 是否属已定的原型退役（§3.4 第 4 项）的直接后果而非改阈值；版面规则怎么恢复（受 SUB-065 守卫约束，定位属摆放属性）。按 R3 规则，主力档项再被退回即写进收口文件交 Owner。
P6 其余条目：#3 冒烟 14 条 focus-outline-width 3px（该 Chromium 在 outline-style 为 none 时仍报 3px，门的期望值过时，交下一批改门）；#4 文档顶栏搜索包裹层被 `alpha-styles.ts:317` 涂底（17 处）——P5 在 P6 切出后合入并报告 7 条「包裹层作画」已消，批末 verify 复核；#5 shell:parity 66 条与基线相同（C-21/O-1）；#6 原型在包文件集外的残留（文档规则、组件清单行、导出面名字、未用内容数据，无门转红）进下一批；#7、#8 internal-alpha 其余红（高度宽限表 8 条过期 → P12 SUB-075，axe 对比度 88 节点 → O-2）与一条小项。P6 的自定：842 `/Support/`、844 `/Operations/` 两条断言删原型后仍靠别处文字命中，按「与原型无关的断言不减少」保留，判断可在下一批删。

## B. 各包 handoff 的回显与取舍（原文节选）

### P1（runs/r2/handoff/P1.md）

#### §3.4 回显项（本包按建议先做，Owner 可事后更正）

1. 第 9 项 O-10：surface 契约注释改为与焦点环行为一致（SUB-048），只改注释。
2. 浅色属性选择器由生成器从契约的夜间选择器派生；`contract/tokens.json` 的 `themes.light.selector` 仍为 `:root`，契约未改（判断改法点名的是 contract-generate，SUB-047 文件集不含 tokens.json）。
3. 选择器列表按集合比较（顺序、空白不计）；列表多出或缺少成员都不算浅色块。
4. checkC5 没有改判定逻辑（实测已正确），只加注释和用例；门的判定语义不变。
5. fonts-render-proof 加了可选的 mono 中文探针，取 IBM Plex Mono 的两个出货字重 400、500。
6. SUB-049 夹具的四个字族值从契约文件读取，不在测试里另抄一份，契约改了夹具跟着变。

### P2（runs/r2/handoff/P2.md）

#### 6. §3.4 第 1 项回显（R2-6，与画板状态顺序不同）

画板的 inputs-text 是 r 盖住 f，只读框获焦时看不到焦点。本包按建议先做：加了 rf 元组，排在 r 之后，只读框获焦时显示焦点环，底与字色仍是只读态（WCAG 2.4.7）。画板没有重生成（见 problems/P2.md 第 3 条）。Owner 可事后更正，例如改为把 f 排到 r 之后，或者恢复画板顺序。

#### 7. 本包另做的实施取舍（请留意）

- `tcrn-link--quiet` 现在是 `.tcrn-link` 的修饰类，要和 `tcrn-link` 一起用；单独写 `tcrn-link--quiet` 不再有样式。仓内没有单独使用的地方（组件、story、文档都没有）。对外说明可以在 SUB-087 改 CHANGELOG 时一并写。
- quiet 链接悬停的下划线偏移从 0.2em 变为链接统一的 2px，颜色从 brand-primary（即 acc）变为 acc-2，与判断写的 ink-h acc-2 一致。
- 新增生效对变量 `--tcrn-pair-underline`。状态规则不能写 text-decoration-color，链接下划线色只能走对表，所以需要这个变量。token-extension-proof 接受任意 `--tcrn-pair-*`。没有新增 pairs 元组名，rf 是 SUB-058 授权的那一个。
- numeral 的字号和行高引用 heading-2 的 token（值相同）。以后若 H2 改值而 numeral 不改，生成器会报值不一致，逼出一次取舍，不会静默跟着变。
- gplus-tokens.generated.ts 的头部现在列 typography.json，以后改 typography.json 的包会同时改写它的 contract-sha256 行。R2 跨包约定第 7 条「头变化归改契约的包」照此扩到这一对；SUB-055 的提交里就有这一行头变化。

### P3（runs/r2/handoff/P3.md）

#### 3. §3.4 第 6 项回显

R2-8 主题钮图标的显隐改由 `data-current-theme` 控制，取 C-9，不取 B-3：

- 删去 html 级和默认的 `[data-theme-icon]` 显隐规则，不补「无主题 display」；
- 显隐只由 `.tcrn-shell-theme-toggle[data-current-theme]` 的透明度规则决定，块级主题与页级主题同样生效。

Owner 可事后更正。

### P4（runs/r2/handoff/P4.md）

#### §3.4 回显

- **第 2 项（R2-10，P29 口径更正）：** 已按建议先做。`.tcrn-field--error` 的整块洗底（state-blocked-bg 以 62% color-mix）和 outline-color 一并删去，错误文字改读 `--tcrn-color-bad`。偏差来自洗底：只换名不会转绿，因为 state-blocked 本来就解析到 bad。实测 err-msg-l 6.69、err-msg-n 6.88，均回到矩阵期望。Owner 不接受删除洗底时，恢复这两条声明，并把 126-GWT5 的 err-msg 两格移到第五批。
- **第 3 项（R2-12）：** Inputs 板本身画的是 ink-3（板里 `.sw>kbd` 的 `color:var(--ink-3)`）。已按 C1 文字 4.5 阈值改为 ink-2，在此回显给 Owner。夜间 ink-3 在 #282724、#272724 上为 3.89、3.90，低于 4.5；ink-2 为 6.13、6.15。另外，浅色 ink-3 在 wash 叠 bg（#e2e1dd）上为 4.31，同样低于 4.5，ink-2 为 6.56。Owner 若要保留板面的 ink-3，需要改 token 值或改承载底，这属于契约修订，本包未做。

### P5（runs/r2/handoff/P5.md）

#### SUB-065 登记的例外（§3.4 第 8 项，逐条）

| id | 选择器 | 放行属性 | 裁定引用 | 删除条件 |
| --- | --- | --- | --- | --- |
| EX-INIT015-doc-tooltip-static-preview | `.tcrn-tooltip[data-storybook-static-tooltip="true"] .tcrn-tooltip__content` 及 top、bottom、right、left 四个 `[data-placement]` 变体 | opacity、transform | docs/style-scale.md「Demo-chrome exemption list」Component-scoped demo hooks 条（静态预览钩子强制展开态）；Tooltip 属 Overlay 家族，后续批次（同 EX-INIT015-overlay） | Overlay 家族批次获得授权、包提供静态展开态 |
| EX-INIT015-doc-filter-bar | `.tcrn-filter-bar` | display、flex-wrap、gap | 同上 Component-scoped demo hooks 条（顶层 `.tcrn-filter-bar` 是文档标签排布钩子，包只在 `.tcrn-table-toolbar` 里定义）；Navigation 家族，后续批次（同 EX-INIT015-navigation） | Navigation 家族批次获得授权、包给 FilterBar 独立排布 |
| EX-INIT015-doc-nav-proof-skip-link | `.tcrn-doc-package-nav-proof__skip .tcrn-skip-link:not(:focus)`、`… .tcrn-skip-link:focus` | position、height、overflow、clip、clip-path、border、padding、transform、display、align-items | docs/style-scale.md「Package components placed by doc scaffolding」条（文档保留基础原件 `.tcrn-skip-link` 的演示放置）；包导航证明框属 Navigation 家族演示，后续批次 | Navigation 家族批次获得授权、证明框改由包组件呈现跳转链接 |
| EX-INIT015-doc-shell-brand-collapse | `.tcrn-doc-brand .tcrn-shell-brand-lockup__copy`；`.tcrn-doc-shell[data-sidebar-collapsed="true"] .tcrn-doc-brand` 下的 `__copy` 与 `.tcrn-product-logo__copy`；`[data-sidebar-motion="collapsing"]`、`[data-sidebar-motion="expanding"]` 下的 `__copy` | opacity、overflow、transform、visibility、transition、pointer-events、animation | 判断 §3.3 C-21（文档壳跟随包壳几何，取决于 O-1，暂缓）与 §3.4 第 10 项 | O-1 答复、C-21 按包壳几何重做 |
| EX-INIT015-doc-shell-brand-narrow | `@media (max-width: 240px)` 下 `.tcrn-doc-global-brand .tcrn-doc-brand` 的 `.tcrn-shell-brand-lockup__copy` 与 `.tcrn-product-logo__copy` | display | 同上 C-21 | 同上 |

#### 文档壳视觉 oracle 搜索三项（§3.2，拆分 P18）

`apps/storybook/src/build/foundation-visual-standards.ts` 的 `storybookDocShellVisualOracle.shellMetrics`：

| 项 | 改前 | 改后 | 依据 |
| --- | --- | --- | --- |
| searchHeightPx | 36 | 32 | `--tcrn-control-height-md`，构建后读回控件高 32 |
| searchBorderColor | `"rgb(142, 142, 136)"` | `"rgba(0, 0, 0, 0)"` | G+ 搜索框没有边框（border-style none），边由 inputs pair 的 box-shadow 画、静止态透明，读回 rgba(0, 0, 0, 0)；border-top-color 的计算值只是 currentColor（浅色 rgb(22, 21, 15)） |
| searchBorderRadiusPx | 4 | 8 | `--tcrn-radius-control`，读回 8px |

容差未动（搜索高度在冒烟与 internal-alpha 里仍是 ±2），没有退役任何一项。

#### §3.4 回显项（本包按建议先做，Owner 可事后更正）

1. 守卫的摆放属性把行向尺寸与换行也算进去，依据是 docs/style-scale.md 已写明的「grid area, track width, wrapping」；块向尺寸（height、block-size）、颜色、字体、边、圆角、内距、阴影、动效与自定义属性都算外观。
2. 知识库壳搜索框的宽度留着（见 SUB-063 第 4 点），没有按「外观声明」删。
3. searchBorderColor 记的是静止态可见边的颜色（透明），不是 border-top-color 的计算值（currentColor）。
4. 包导航证明框的跳转链接按例外登记而不是删除：删了以后包的 fixed 定位会让链接脱离证明框，这个行为未在门上验证过。
5. 文档壳品牌文案的收起动效与极窄视口隐藏按 C-21 登记例外；品牌说明行的颜色、字号、字重、行高作为外观删掉，文档壳与知识库壳的品牌说明行改为包的样式。
6. storybook.css 的生成 demo 副本不在守卫里重复扫描（由 story-demo-styles.ts 代读，副本由 demo-styles-sync `--check` 管住）；未用的例外只列出，不判红。

### P6（runs/r2/handoff/P6.md）

#### 判据状态

- **SUB-066：达成。** 三件事在同一提交（95f0e09）里完成，提交信息逐条列出了删掉的断言，并引用 doc-class-map.json 第 75–99 行的 25 条 delete-demo 条目（`tcrn-compact-shell*` 六条，以及 `tcrn-shell-hub-*`、`mega-menu`、`domain-*`、`quick-*`、`task-lane*`、`layer`、`density-stack`、`command-board*`）。
  - 删掉的断言：smoke.test.ts 42 条（原 746、748、783–796、810–814、816–822、832–834、837–841、843、845–849 行），storybook-smoke.mjs 的 `required` 2 条（`data-menu-layer="10-plus-primary"`、`data-shell-layer="mega-menu"`）。挑法：删掉原型后对新构建逐条求值，只删转红的那些；删前它们都是绿的（P4、P7 交回时 9/9）。
  - 留下的同区断言：747（knowledge 原型）、781（"Dense operations shell" 面板标题）、815（`tcrn-shell-brand-lockup`）、835–836（密度表行），删后仍命中，与原型无关。**另有两条请主线程定夺：** 842 `/Support/` 与 844 `/Operations/` 原本守的是原型的域名单，删后靠别的文字仍然命中（"Supporting references"、"Operations handbook"，以及组件清单表里的 "DenseOperationsShellDemo"）。本包按「与原型无关的断言不减少」留下了它们；若判为只守原型，R3 删掉即可。
  - geometry-proof 宿主改指：`badgeRoute`、`copyRoute`、`badgeStory` 从 `navigation-dense-operations-shell-spec` 改为 `navigation-product-shell-spec`。该 story 经 ProductShell 渲染 ShellBrandLockup，经 ReferenceList 渲染 `.tcrn-badge`（StatusBadge 也渲染为同一个 Badge 元素）。断言与阈值没改。实测 badge 4 个（起始内距 18px，文字避开圆点），copy 3 个，两项在变异下都转红、还原后转绿；改前 badge 2 个、copy 5 个。
  - 两条 story 的其余内容保留：dense story 留面板、说明文字与密度表；focused story 留 knowledge 壳，以及 "Compact tool shell" 面板的标题和一句选择规则（只删了演示元素）。注册与路由没动。
  - 验收：静态页 `components-navigation-shells.html` 里已没有 dense 和 compact 段的元素。dense story 剩下的无 class 标签，与 `navigation-shell-spec` 的 story 外框和表头逐个相同。`navigation-focused-shells-spec` 删后不再超出 2000px 高度预算：它既不在新超额里，也不在宽限表里（R1 时为 2520px）。
  - 文案：删掉 81 条源文本已不在任何静态页渲染的词条（原型标签、aria 名，以及 denseShell* 内容串）。另外 14 条（如 Queue、Settings、Operations）仍在别处渲染，保留。
  - 副作用（问题 #1）：dense 原型的两个 `aria-expanded="true"` 菜单钮一并消失，页面上的展开元素从 8 个降到 6 个，geometry-proof searchOverlay 写死的 `openMenus === 8` 因此不再成立。
- **SUB-067：达成。** 两条词条的键与五语值改为由 `tcrnTokens` 的 `--tcrn-type-size-page`、`--tcrn-type-size-section` 拼出尺寸，只翻译前缀。样本仍是单个文本节点，smoke 的 token 字串检查不受影响。internal-alpha 第 30 步 `localeLeakZhCnNewLeaks` 为 0；s254 `storyExpanded` 为 true，`ok: true`。
- **SUB-068：达成。** Card 不再带 role，live region 是卡内已有的 `tcrn-doc-loading-card__row` div，网格布局不变。axe 的 aria-allowed-role 4 个节点消失，违例条目从 16 降到 12，剩下的全是 color-contrast。
- **SUB-080：未达成，停在越级处。** 只靠改 story-content.tsx 达不到判据，原因有两个，详见 problems #1、#2：(a) searchOverlay 要求 `openMenus === 8`，SUB-066 之后页面上只剩 6 个，baseline、broken、restored 三态因此都 ok=false；(b) 门的变异样式与包的默认绝对定位完全相同。R1（SUB-026/027）按 doc-class-map 的 delete-package-provided 删掉了让静态展示结果留在流内的覆盖规则（`tcrn-product-shell-search--static-display`）。没有这条规则，单靠 story 版面无论怎么排，都做不到 baseline 绿而 broken 红。本包没有做填空式的版面改动，现状仍是 h3「Package-backed AOS shell boundary」与第一段被压住。
- **SUB-081：达成。** 三个证明里的 searchControl background-color 失败全部消失（comparator 1 条、visual-instance parity 5 条、owner-quality 8 条，合计 14 → 0）。删掉了写死的 190ms 等待，期望值没改。
- **SUB-082：达成。** 经 `| cat` 跑：进程以 1 退出，日志 1,114,729 B，能整体解析为一个 JSON 对象，完整失败清单可读。清单抄在 problems/P6.md 的末节。

#### §3.4 回显

- **第 4 项（R2-17，C O-4）：** 已按建议先做。dense（hub 与 command-center 两块）与 compact 两个壳原型已从 storybook 删除，只守护它们的 44 条冒烟断言也已删除，删除清单见 95f0e09 的提交信息。Owner 若要保留这两个原型，回退 95f0e09 里对应的两个函数、渲染处与断言，在第二批用包组件重画。连带影响：geometry-proof 的 badge 与 copy 改由 `navigation-product-shell-spec` 测量；searchOverlay 的 `openMenus === 8` 需要另行授权调整（problems #1）。另外，组件清单页与导出面仍列着这两个原型名（problems #6）。

### P8（runs/r2/handoff/P8.md）

#### storybook-map 差异记录的处理

- 主线程追加的第一条：P7 的 SUB-072 删掉了品牌样板表的资产 ID 列，Brand 板 D 段的表格是四列：产品、资产 ID、标语 · zh / en、注册（浅色与夜间两块都是）。这属于画布与 story 的差异，按现有格式补 **DIFF-9**：板 V2-B1-Brand · D，状态「已裁定」，引用新增的 R2-25（R1 判断返工 R2-25：资产 ID 拼出仓库名，是渲染文本内部词汇扫描的唯一命中，按判据第一种做法删列，不加扫描器豁免；依据 7e292ff 的提交说明）。brand.D 行的差异改为 DIFF-1、DIFF-9。构图一画板没有资产 ID 列，compositions.1.brand 不挂这条。.md 的差异标题改为 9 条，待 Owner 裁定的仍是 4 条。
- DIFF-6 的改法见上文 SUB-077。

#### 回显（实施口径，主线程或 Owner 可更正）

1. actions.A 加了 rowAlign。门从 R1 起就要求 actions-matrix 测 rowAlign，映射原来没有；为了让映射和门一致才补上，超出判据字面。
2. 构图一的四行也加了 rowAlign，没有只加在 D 段行上。这四行量的是同一个样板 story，构图一画板也带表格。
3. iconStroke 除判据要求的描边宽度与 vector-effect 外，还要求图标实际渲染 16px，防止选到的「16px 行」其实不是 16px。
4. DIFF-9 的状态记为「已裁定」，比照 DIFF-4 与 DIFF-5 依跨包约定记已裁定的做法。如果需要 Owner 知悉画板与样板不再一致，可以改成「待 Owner 知悉」。
5. 未知的探针 id 现在报 error，不再落到 Highlight 探针。门新增的导出只有 `ICON_STROKE` 与 `iconStrokeInPage`，供本包测试使用，不属于包的导出面。

### P9（runs/r2/handoff/P9.md）

#### §3.4 回显

- **第 5 项（R2-30）：** 已按建议先做。axe 对品牌后缀登记字标豁免，依据沿用 token-contrast 已登记的 D2 与 V2-B1-Brand 板 F 段，条目直接从 `WORDMARK_EXEMPTIONS` 导入，没有另抄一份。标语与壳锁定说明（ink-3）不在豁免内。豁免范围按承载面放宽的口径见上节「口径提示」。
- **第 7 项（R2-29）：** 本包只做了前半句，已按建议先做：clipped 判定不再计入合规的 C7 截断，被记元素从 288 降到 0。后半句（收紧 C7、改 Button 禁用原因的 title）是 SUB-079 的工作，不在本包。

### P10（runs/r2/handoff/P10.md）

#### §3.4 回显项（本包按建议先做，Owner 可事后更正）

1. 第 7 项中 R2-31 的一半：C7 对第一批承载元素收紧为「title 含可见文字，空白规范化后比较」，Button 禁用原因写成「标签 — 原因」，原因仍走 aria-describedby。这个读法与 R2-29 浏览器门排除「C7 合规截断」用的读法相同，所以静态 C7 为绿的元素，在浏览器门里也算合规截断。静态门另外保留组件根与共享容器两条限制，比浏览器门更严。Owner 若要改取「title 只写标签、原因只走 aria-describedby」，需要同时改 V2-B1-Actions 板上「变成 title」的写法。
2. 「第一批承载元素」按元素自身的包类判定：任一个类属于检查批次的家族，就按严口径读。这与本门的豁免规则一致（一个元素只要带第一批类就不能豁免）。现有构建里没有同时带两批类的承载元素，所以判定按承载类还是按元素，结果相同。
3. 「哪个 title」按浏览器显示的那一个读：元素自身的 title 盖过祖先的，空 title 不显示提示。判断只写了「含可见文字」，这里补的是位置上的定义，与 R2-29 一致。旧口径下的位置规则（组件根为界、共享容器不算）保留不变。
4. 禁用时 title 里的标签取可见文字，不取调用方的 title，理由见判据第 4 项。

