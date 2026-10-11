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
