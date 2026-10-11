# INIT-015 R2 · 主线程问题清单

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

**RM16 I1 交回（RM14 已修，合入 7bf76ee）与余项。** I1-a：ui-react test 162/162。I1-b：client-scripts 对「标签 — 原因」分段翻译；只读探针确认 46 页在 zh-CN、ja、ko、fr 下英文残留为 0、切换语言 title 跟随（多处 ` — ` 时逐个切分点试、两边都查得到的优先——超出摘录字面一点，收口回显）。余项交 R2 判断：① internal-alpha 的 ja 检查与 localeLeakScan 只读 innerText，看不到 title，要守住须改门（下一批）；② clipped 检查只在英文下跑（说明）；③ 21 种「标签 — 原因」title 中 7 种只有一边在词典里，非英文下半译，补词条归 locale 文件持有方（下一批）；④ 新增 3 条 zh-CN 漏译（foundation-visual-standards 的「px rest / px expanded / px high」），来源 P5 的 28933c7（SUB-063），批末 localeLeak 会红；⑤ 新出现 `mobileHashAnchorOcclusionCheck` 失败：手机视口文档顶栏高 395px，与 P9 记的 390px 下顶栏 401px 疑同根（文档壳 C-21/O-1），待判断定位；⑥ 已记的红：axe 16、故事高度预算、视觉回归 155（SUB-046 前不计）。

**RM17 P11 交回（合入 67517d1）的信息项（交验收）。** ① 「改正 CHANGELOG 第 17–19 行」被理解为改那句 token 来源说明，验收最需核对这一条；② 迁移说明 M1 仍写两个 CDN 主机名（SUB-051 范围外，未改），并入 RM9；③ foundation 标准页该字段原有的计划键（pre-INIT-001、INIT-002）会进 AI 消费契约 JSON，内部词汇扫描只扫渲染 HTML 查不到，并入 RM9 交判断；④ ui-tokens README 版本行原有 accepted 字样，按「版本行不动」未改。P11 自定取舍（生成物头部只写进 CHANGELOG；SUB-080 只写进 CHANGELOG；M10 标题加 link states；RM7、RM13 放进 owner-acceptance 第 8、6 节表末，§3.4 的 11 项另起一节）见 `runs/r2/handoff/P11.md` 第 5 节。

**RM18 P12 交回（合入 e643d74）：SUB-046 部分达成，视觉基线未写入（交 R2 判断）。** 选择文件 `docs/verification/internal-alpha/visual-baseline-selection-r2.json` 185 条（155 回归 + 30 新增 G+ story，其中 24 条标注未结缺陷 O-1、O-2、RM15），校验全过，但 `applyBaselineSelection` 在 `nonVisualProofOk` 为假时整体拒绝（`current-proof-or-geometry-failed`），基线仍是 162d5aca。卡住它的三项：O-2 axe 对比 12 处、C-21/O-1 手机视口文档顶栏过高（mobileHashAnchorOcclusionCheck）、RM16 ④ 三条 zh-CN 漏译。重做步骤在 `runs/r2/handoff/P12.md` 第 9 节（build → 正常 browser-proof → 用 scratch `tmp/r2-P12/gen-selection.mjs` 重生选择 → 带 `--update-visual-baseline` 应用 → 复跑 browser-proof；两次之间不重建）。其余：SUB-075、SUB-069 达成（包外类 171 → 0；故事高度检查转绿）；SUB-076、SUB-078 报告已再生，余红只有样板 rail（O-1），「注明 O-1」写不进生成报告（生成器无注记输入），按行注记在 handoff 第 6 节；fonts:vendor 未执行（967 个产品汉字码位已覆盖）；手机视口部分故事截图下半部为空白底色（既有，视觉门看不到该部分）；`inputs.css.ts` 第 166 行注释过时；color-palette 宽限条目 note 仍写 39 格——这三项进下一批。流程：P12 一条只读命令含 `cd /dev/null`，并入 RM4。
批末 verify 改写的回执（intentional-diff-manifest、internal-vocabulary-scan 35→37 页、no-overclaim-scan 604→605）已存档并还原，说明入仓的 internal-vocabulary-scan 回执漏了两张 G+ 页，交验收核对 SUB-046 的回执一致性。

**RM19 设计会话 B 类裁定 O-1 至 O-4（2026-10-11，R2 判断进行中收到；Owner 事后可更正）。** O-1 授权，范围只有 R1 判断 §3.1 O-1 建议列出的 ProductShell 几何：引导列 16/48、纸离边 12（圆角 14 加 s1）、顶栏 52、侧栏 220 与收起 52、侧栏画布色且无右边线；数值取自 token，不写字面量；Navigation 家族其余行为、结构与 API 不动，留第二批。依据：127-GWT4、129 判据与 131 样板 rail 是 Owner 已批的 Story 正文，禁用清单不许通用件拼壳，INIT 正文「不改第二批家族」与判据冲突时以判据为准。O-2 随 O-1 解决（侧栏画布色后 ink-3 于 bg 达标），不另做豁免。O-3：TMS 夜间后缀改 #7aa0f5，DS #6577f3 不改，撤 token-contrast 与 axe 的两条 TMS 夜间豁免，只改 contract/tokens.json 的 brand 项并重生。O-4：DIFF-3 以构图板 220/52 为准；DIFF-2 构图三样板随 O-1 授权，R3 补。O-5 至 O-12 按 R1 判断的「未答复时」默认执行。处置：已用 SendMessage 转给在跑的 R2 判断代理，要求按裁定写 §2、§3、§5；收口文件与批末链写注解写明「设计会话 B 类裁定，Owner 事后可更正」。

**RM20 Story 转 done 被引擎拒绝：本库没有声明门（交 Owner，A 类持久配置）。** R2 链写首次提交（2026-10-11T08:23:21Z）因 8 张 Story（121、122、123、124、125、126、128、132）转 done 整体被拒，reasonCode `WORK_DONE_GATES_NOT_COVERED`：「no enabled required gate declares an exact work-id cover for the Story」，remedy 为先声明覆盖该 Story 的 enabled required gate，再以该 `--work-id` 与 `--base <commit>` 或 `--release` 跑 gates-run。`gates-config-list` 读回本库门数为 0。声明门是库的持久配置（MIN-151 的 A 类），实施对话不做。处置：重做的批次（08:24:14Z，version 1594 → 1732，WORKSPACE_COMMAND_COMPLETED）不含这 8 个转态，改为 summary 注解「R2 通过…；转 done 待库门配置」；被拒回执存 scratch `r2-chain/r2-batch-receipt-rejected-done-gates.json`。建议给 Owner：在 DS 库声明一个覆盖 STORY-120…134 的 required gate（命令为根 `verify`），在候选提交上跑 gates-run 后由链按门结果转 done；或由 Owner 本人转态。
