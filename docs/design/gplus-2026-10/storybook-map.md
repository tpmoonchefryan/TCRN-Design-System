# G+ 画布板到 story 的映射

画布设计正本页（本目录 `boards/` 是仓内副本，版本 33）的每块板与分段，对应到静态文档里的 contract story。机读版是同目录的 `storybook-map.json`，门 `scripts/storybook-visual-proof.mjs` 读它；两份同源，改映射时一起改。逐行测量结果写在 `docs/verification/storybook-visual-proof/gplus-map-report.md`。

## 读法

- **story id** 是静态文档（Track B）里的 contract story id，路由形如 `/components-gplus-matrices.html#typography-matrix`；**Storybook id** 是真 Storybook（Track A）的 id，例如字体板对应 `typography--matrix` 与 `typography--sample-billing`。两轨共用同一注册表，门只量 Track B（引用 T7）。
- **期望格数** 是该行要渲染的 `data-cell` 个数（浅色与夜间合计），取自 `contract/matrices.json`；门还逐格比对 story 的 `data-expect` 与画板上同一格的 `data-expect`。
- **测量项** 是该行必须测得到的项（测不到即 n/a，算不通过）。八项测量（clip 溢出、singleLine 单行、shadowBlur 阴影模糊、rail 引导列、rowAlign 行对齐、mark 高亮中性、contrast 每格对比度、controlHeight 控件高）、overlap 重叠检查与 shellFrame 壳框（顶带壳：顶带 52、无底线无填充，纸顶离壳顶 52、离壳的起、尾、下边各 12，纸圆角 14；读 C-5 钩子 data-shell + data-state、data-shell-strip、data-paper，不读构图一的类）每行都照跑，任何一项不通过即该行不通过；阈值只在门里（取 EPIC 级几何门的 THRESHOLDS），本映射不写阈值。几何门 `scripts/geometry-measure-proof.mjs` 的必测项（REQUIRED_CHECKS）与本表同步：每个 story 的必测项是任何页面都有的四项（clip、singleLine、shadowBlur、overlap）加上引用它的各行测量项之并。样板没有 `data-cell`，不测 contrast，测壳框 shellFrame；侧栏引导列 rail 随构图一取消，样板壳带 `data-measure-skip="rail"`，rail 只留测量夹具，完整菜单内的引导列由壳层门量（引用 I16-P24）；带 TableShell 行的四个样板另测 rowAlign（邀请成员样板没有表格）；actions 与 inputs 两个矩阵的控件声明了 `data-h`，测 controlHeight。
- **story 清单** 是约定 7 的十个 id 加上注册表里类目以 `gplus-` 开头的全部 story。映射引用而清单或注册表没有的、清单有而映射没引用的，门都判红。
- 样板 story（五个 `*-sample-*` 与构图三的 `composition-three-sample`）都已实现并登记在注册表里，门照常测量；构图三不在约定 7 的十个 id 里，经 `gplus-samples` 类目进入 story 清单。六个样板都已换成顶带壳（引用 SHELL-D1、SHELL-D4）：五个样板按四板 D 段的屏设置，brand 样板行改指壳层板第 1 段（引用 I16-P4），构图一、构图三 6 行改标题（引用 I16-P5）。壳层 story 在 `navigation-shells` 类目，不进本映射，映射维持 23 行（引用 I16-C9）。只判矩阵行或样板行时用 `--kind matrix` 或 `--kind sample`。
- 截图只做目视，不做像素比对（引用 A130），门不截图。

## 引用

| 代号 | 内容 |
| --- | --- |
| D6 | Owner 2026-10-11 纪要裁定 D6：画布是草稿与确认面，仓内 docs/design/gplus-2026-10 的文件是实现、story 与门的数据来源（本目录 README）。 |
| C2 | 拆分第 1 节跨包约定 2：夜间选择器是 [data-tcrn-theme="dark"]，不是画板的 .gp.night。 |
| C4 | 跨包约定 4：静态状态呈现用 data-tcrn-preview-state="hover\|active\|focus"，不用无前缀的 .is-hover 类。 |
| C7 | 跨包约定 7：矩阵与样板的 story id 与 Storybook id 预先定死。 |
| C9 | 跨包约定 9：scripts/lib/gplus-measure.mjs 与 storybook-routes.mjs 只读复用，需要改的记问题清单。 |
| T7 | 拆分第 7 节：「Storybook」指静态文档 Track B，浏览器门全部量 Track B；Track A 不设门。 |
| P1 | 拆分问题清单 P1（待 Owner）：构图一壳层几何（侧栏 220、收起 52、顶栏 52、纸离边 12）与 ProductShell（侧栏 280、收起 92）不一致，是否算 G+ 底盘而纳入本批，请 Owner 裁定；裁定前样板用 ProductShell 并经局部变量 --tcrn-product-shell-sidebar-width 设 220，其余差值记在本映射。 |
| P24 | 拆分问题清单 P24（待 Owner 知悉）：story 高度与类目数量上限。 |
| A130 | Story 130 假定：截图只做目视，不做像素比对。 |
| SCOPE | 本批范围：第一批五个家族 23 件（gplusMatrixComponents），对应约定 7 的五个矩阵与五个样板；第二批以后的家族不在本批授权内（P1 所引的 INIT 不授权段）。 |
| LOGOS | canvas.json 板标题：第二批前置 · 四枚产品标（Owner 2026-10-11 通过）。 |
| COMP | canvas.json 板标题：两种页面构图（一、三并用；二已作废移除）。 |
| R2-25 | R1 判断返工 R2-25：品牌样板表的资产 ID 列渲染的设计系统资产 ID 拼出仓库名，是渲染文本内部词汇扫描的唯一命中；按判据第一种做法删去该列，不给扫描器加豁免。 |
| SUB-072 | R2 拆分 SUB-072 判据（R2-25 的落点）：composition-one.tsx 删掉 Asset ID 列，或改显示不含仓库名的标识；不给扫描器加豁免；internal-vocab:scan 零命中。样板按删列执行，本映射不恢复该列。 |
| O-1 | R2 判断 O-1（设计会话 B 类裁定，Owner 可事后更正）：构图一壳层几何已授权，只含引导列 16 / 48、纸离边 12（圆角 14 加 s1）、顶栏 52、侧栏 220 与收起 52、侧栏画布色无右边线，数值取自 token；Navigation 家族其余行为、结构与 API 不动，留第二批。 |
| O-3 | R2 判断 O-3（设计会话 B 类裁定，Owner 可事后更正）：夜间品牌后缀色 TMS 取 #7aa0f5，Design System 不改；撤去 token-contrast 与 axe 的两条 TMS 夜间豁免，只改 brand 项并重生。 |
| O-4 | R2 判断 O-4（设计会话 B 类裁定，Owner 可事后更正）：映射待裁差异中 DIFF-3 以构图板 220 / 52 为准；DIFF-2 的构图三样板随 O-1 授权，R3 补。 |
| SHELL-D1 | MIN-20261013-SHELL D1（Owner 2026-10-13「没问题」）：壳层采用顶带壳，取代 2026-10-11 纪要 D1 的构图一与构图三；顶带 52 无底无线，纸离壳边 12、圆角 14，壳内没有常驻侧栏。 |
| SHELL-D4 | MIN-20261013-SHELL D4：Typography、Actions、Icon、Inputs 四板的构图一样板退出标准，随第二批换壳重渲染后补入（INIT-016 SUB-133 补四板 D 段，SUB-134 换 Storybook 侧样板）。 |
| I16-C9 | INIT-016 R1 跨包约定 C-9：壳层 story 登记在 navigation-shells 类目（shell-top-band、shell-narrow、shell-mobile、shell-intro、shell-matrix），不进 gplus- 类目，本映射维持 23 行；第一批样板 id 不变，内容换顶带壳。 |
| I16-P4 | INIT-016 R1 拆分问题 4：D4 只让四板退出构图一样板，Brand 成品板不加 D 段（壳层板 07a 第 1 段「标三版」已表达品牌在壳里的样子）；brand-sample-product 照常换壳，映射里 brand 样板行改指 07a 第 1 段（草稿画布 V2-B2-Shell-Draft2 第 1 段）。 |
| I16-P5 | INIT-016 R1 拆分问题 5：构图一、构图三 6 行改标题并改指顶带壳样板与四板 D 段，板引用暂留草稿板（画布对应关系由设计会话定）。 |
| I16-P24 | INIT-016 R1 拆分问题 24（SUB-134 选第二种）：样板换顶带壳后侧栏引导列 rail（16 / 48）没有被测物，样板行去掉 rail，样板壳带 data-measure-skip="rail"；完整菜单内引导列 16 / 48 由壳层门 scripts/shell-measure-proof.mjs 的 prail 读数负责，rail 只留测量夹具。 |

## 有 story 的分段（23 行）

| 行 | 板 | 分段 | story id | Storybook id | 类 | 期望格数 | 测量项 | 差异 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| typography.A | V2-B1-Typography | A 组件与样式 | `typography-matrix` | `typography--matrix` | 矩阵 | — | clip、singleLine、shadowBlur、mark、overlap | DIFF-4、DIFF-7 |
| typography.B | V2-B1-Typography | B 状态矩阵 | `typography-matrix` | `typography--matrix` | 矩阵 | 44 | contrast | DIFF-4 |
| typography.D | V2-B1-Typography | D 组合样板 · 顶带壳（账单页） | `typography-sample-billing` | `typography--sample-billing` | 样板 | — | shellFrame、rowAlign | DIFF-1 |
| icon.A | V2-B1-Icon | A 名册与状态 | `icon-matrix` | `icon--matrix` | 矩阵 | — | clip、singleLine、shadowBlur、overlap | DIFF-4、DIFF-7 |
| icon.B | V2-B1-Icon | B 状态矩阵 | `icon-matrix` | `icon--matrix` | 矩阵 | 28 | contrast | DIFF-4 |
| icon.D | V2-B1-Icon | D 组合样板 · 顶带壳（项目列表） | `icon-sample-project` | `icon--sample-project` | 样板 | — | shellFrame、rowAlign | DIFF-1 |
| brand.A | V2-B1-Brand | A 组件与状态 | `brand-matrix` | `brand--matrix` | 矩阵 | — | clip、singleLine、shadowBlur、overlap | DIFF-4、DIFF-7 |
| brand.B | V2-B1-Brand | B 状态矩阵 | `brand-matrix` | `brand--matrix` | 矩阵 | 10 | contrast | DIFF-4 |
| brand.D | V2-B2-Shell-Draft2 | 1 标三版 · 品牌在顶带壳里（产品页样板） | `brand-sample-product` | `brand--sample-product` | 样板 | — | shellFrame、rowAlign | DIFF-1、DIFF-9 |
| actions.A | V2-B1-Actions | A 组件与状态 | `actions-matrix` | `actions--matrix` | 矩阵 | — | clip、singleLine、shadowBlur、rowAlign、controlHeight、overlap | DIFF-4、DIFF-5、DIFF-7 |
| actions.B | V2-B1-Actions | B 状态矩阵 | `actions-matrix` | `actions--matrix` | 矩阵 | 116 | contrast | DIFF-4、DIFF-5 |
| actions.D | V2-B1-Actions | D 组合样板 · 顶带壳（名册页） | `actions-sample-project` | `actions--sample-project` | 样板 | — | shellFrame、rowAlign | DIFF-1、DIFF-11 |
| inputs.A | V2-B1-Inputs | A 组件与状态 | `inputs-matrix` | `inputs--matrix` | 矩阵 | — | clip、singleLine、shadowBlur、controlHeight、overlap | DIFF-4、DIFF-5、DIFF-7 |
| inputs.B | V2-B1-Inputs | B 状态矩阵 | `inputs-matrix` | `inputs--matrix` | 矩阵 | 42 | contrast | DIFF-4、DIFF-5、DIFF-6 |
| inputs.D | V2-B1-Inputs | D 组合样板 · 顶带壳（邀请成员） | `inputs-sample-members` | `inputs--sample-members` | 样板 | — | shellFrame | DIFF-1 |
| compositions.1.typography | V2-GPlus-Compositions | 构图一 已作废，现为顶带壳样板（账单页；成品 Typography 板 D 段） | `typography-sample-billing` | `typography--sample-billing` | 样板 | — | shellFrame、rowAlign | DIFF-1、DIFF-3 |
| compositions.1.icon | V2-GPlus-Compositions | 构图一 已作废，现为顶带壳样板（项目列表；成品 Icon 板 D 段） | `icon-sample-project` | `icon--sample-project` | 样板 | — | shellFrame、rowAlign | DIFF-1、DIFF-3 |
| compositions.1.brand | V2-GPlus-Compositions | 构图一 已作废，现为顶带壳样板（产品页；壳层板 07a 第 1 段标三版） | `brand-sample-product` | `brand--sample-product` | 样板 | — | shellFrame、rowAlign | DIFF-1、DIFF-3 |
| compositions.1.actions | V2-GPlus-Compositions | 构图一 已作废，现为顶带壳样板（名册页；成品 Actions 板 D 段） | `actions-sample-project` | `actions--sample-project` | 样板 | — | shellFrame、rowAlign | DIFF-1、DIFF-3、DIFF-11 |
| compositions.1.inputs | V2-GPlus-Compositions | 构图一 已作废，现为顶带壳样板（邀请成员；成品 Inputs 板 D 段） | `inputs-sample-members` | `inputs--sample-members` | 样板 | — | shellFrame | DIFF-1、DIFF-3 |
| compositions.3 | V2-GPlus-Compositions | 构图三 已作废，现为顶带壳样板（项目页，纸内内容居中 1040） | `composition-three-sample` | `compositions--composition-three` | 样板 | — | clip、singleLine、shadowBlur、overlap、shellFrame | DIFF-2 |
| logos.A-E | V2-B2-Logos-Draft | A–E 四枚标 · 浅色与夜间（大图、尺寸阶梯、贴片、单色版、锁定块） | `brand-matrix` | `brand--matrix` | 矩阵 | — | clip、singleLine、shadowBlur、overlap | DIFF-8 |
| logos.I | V2-B2-Logos-Draft | I 标语 | `brand-matrix` | `brand--matrix` | 矩阵 | — | contrast | — |

十一个 story 全部被引用：约定 7 的十个 id `typography-matrix`、`typography-sample-billing`、`icon-matrix`、`icon-sample-project`、`brand-matrix`、`brand-sample-product`、`actions-matrix`、`actions-sample-project`、`inputs-matrix`、`inputs-sample-members`，加上 `gplus-samples` 类目的构图三样板 `composition-three-sample`。

## 没有 story 的板与分段（44 条）

V2-Families 与 V2-Rejections 两块板已入仓（`boards/`），整板没有 story，单列在本表末尾。三块页签壳草稿板（V2-B2-Shell-Draft、V2-B2-Shell-Draft2、V2-B2-Shell-Draft2-b）的分段逐段列在它们之前：草案一不实现，草案二由 `navigation-shells` 类目的壳层 story 与壳层门承担。

| 板 | 分段 | 原因 | 落点 | 参见 | 引用 | 差异 |
| --- | --- | --- | --- | --- | --- | --- |
| V2-GPlus | 两屏 成员页 · 浅色与夜间两屏 | 两屏是成员页整页，主体是表格、头像、状态点、印章、标签页等第二批以后的家族，第一批没有能独立承载它的 story；其中第一批件在五个样板里各有消费。 | contract/tokens.json（.gp 与 .gp.night 两块的字面真值）；packages/ui-tokens（由契约生成） | `typography-sample-billing`、`icon-sample-project`、`brand-sample-product`、`actions-sample-project`、`inputs-sample-members` | SCOPE、D6 | DIFF-3 |
| V2-GPlus | 十种手法 加入的十种手法 · 每种单独看 | 十格是手法示意，不是组件规格。01 字体配对、04 衬线数字落在 typography-matrix，05 更细的图标落在 icon-matrix，07 紧贴阴影由每行的阴影模糊测量覆盖；03 颗粒、06 印章、08 墨洗选中态、09 薄玻璃、10 状态点属第二批以后的家族或页面底，本批没有 story。 | contract/tokens.json（阴影 s1/s2/s3、颗粒、玻璃、选中洗底的 token） | `typography-matrix`、`icon-matrix` | SCOPE、D6 | — |
| V2-GPlus | 去掉的套路与 kv 表 从 G 里去掉的高频套路 · 换成了什么（含 kv 表） | 对照表与 token 键值表，是文字与数值，不是渲染面；数值的落点是契约 token。 | contract/tokens.json | — | D6 | DIFF-3 |
| V2-B1-Typography | C 动效规范 | 动效规范是时长与缓动的文字表；八项测量是静态 DOM 测量，静态文档里不播放过渡，story 没有可测对象。 | contract/tokens.json（动效组） | — | D6、T7 | — |
| V2-B1-Typography | E 消费方须提供什么 · 何时用与不用 | 消费方契约是文字条款，不是渲染面；以仓内画板副本为准。 | boards/V2-B1-Typography.dc.html 第 E 段 | — | D6 | — |
| V2-B1-Typography | F 与 G+ 底盘的 token 差异 | token 差异表是数值对照，落点是契约 token 与生成物，不是 story。 | contract/tokens.json；contract/typography.json | — | D6 | — |
| V2-B1-Typography | G 许可与分发 | 字体、图标、品牌标的许可与分发是文本与文件，不是渲染面。 | packages/ui-tokens 的字体与许可文件 | — | D6 | — |
| V2-B1-Icon | C 动效规范 | 图标只有加载环转动与跟随宿主换色，静态文档不播放过渡，story 没有可测对象。 | contract/tokens.json（动效组） | — | D6、T7 | — |
| V2-B1-Icon | E 消费方须提供什么 · 何时用与不用 | 消费方契约是文字条款，不是渲染面；以仓内画板副本为准。 | boards/V2-B1-Icon.dc.html 第 E 段 | — | D6 | — |
| V2-B1-Icon | F 与 G+ 底盘的 token 差异 | token 差异表是数值对照，落点是契约 token 与图标路径生成物，不是 story。 | contract/tokens.json；contract/icons.json | — | D6 | — |
| V2-B1-Brand | C 动效规范 | 品牌标不动，只有收起与焦点环；静态文档不播放过渡，story 没有可测对象。 | contract/tokens.json（动效组） | — | D6、T7 | — |
| V2-B1-Brand | E 消费方须提供什么 · 何时用与不用 | 消费方契约是文字条款，不是渲染面；以仓内画板副本为准。 | boards/V2-B1-Brand.dc.html 第 E 段 | — | D6 | — |
| V2-B1-Brand | F 与 G+ 底盘的 token 差异 | token 差异表是数值对照，落点是契约 token 与产品标生成物，不是 story。 | contract/tokens.json；contract/marks.json | — | D6 | — |
| V2-B1-Actions | C 动效规范 | 动作件只换色不位移；静态文档不播放过渡，story 没有可测对象。 | contract/tokens.json（动效组） | — | D6、T7 | — |
| V2-B1-Actions | E 消费方须提供什么 · 何时用与不用 | 消费方契约是文字条款，不是渲染面；以仓内画板副本为准。 | boards/V2-B1-Actions.dc.html 第 E 段 | — | D6 | — |
| V2-B1-Actions | F 与 G+ 底盘的 token 差异 | token 差异表是数值对照，落点是契约 token 与状态对表，不是 story。 | contract/tokens.json；contract/pairs.json | — | D6 | — |
| V2-B1-Inputs | C 动效规范 | 边与环换色、开关钮位移；静态文档不播放过渡，story 没有可测对象。 | contract/tokens.json（动效组） | — | D6、T7 | — |
| V2-B1-Inputs | E 消费方须提供什么 · 何时用与不用 | 消费方契约是文字条款，不是渲染面；以仓内画板副本为准。 | boards/V2-B1-Inputs.dc.html 第 E 段 | — | D6 | — |
| V2-B1-Inputs | F 与 G+ 底盘的 token 差异 | token 差异表是数值对照，落点是契约 token 与状态对表，不是 story。 | contract/tokens.json；contract/pairs.json | — | D6 | — |
| V2-B2-Logos-Draft | F 构法（48 格与视觉圆） | 构法是路径坐标与网格，落点是 SVG 源与契约，不是 story。 | contract/marks.json；logos2/*.svg | `brand-matrix` | D6、LOGOS | — |
| V2-B2-Logos-Draft | G 颜色 | 每枚两色及其与白纸、夜间纸的对比度只供参考（形不是文字），不进对比度门；色值落点是契约。 | contract/marks.json（palette） | `brand-matrix` | D6、LOGOS | — |
| V2-B2-Logos-Draft | H SVG 源 | SVG 源是文件，落点是 logos2/ 与包内产品标生成物，不是 story。 | logos2/*.svg；contract/marks.json | `brand-matrix` | D6、LOGOS | — |
| V2-B1-Brand | D 组合样板 · 构图一 | 构图一样板随顶带壳退出标准；Brand 板已被产品标板取代，成品 Brand 板不加 D 段。brand-sample-product 照常换顶带壳，映射行 brand.D 改指壳层板 07a 第 1 段「标三版」（草稿画布 V2-B2-Shell-Draft2 第 1 段）。 | apps/storybook/src/contract-stories/gplus/samples/composition-one.tsx（顶带壳样板） | `brand-sample-product` | SHELL-D4、I16-P4 | DIFF-9 |
| V2-B2-Shell-Draft | A 三态 · 浅色与夜间 | 页签壳草案一已被草案二取代（canvas.json 板标题），不实现；壳层以草案二与「TCRN 视觉设计标准」画布的壳层板（07a、07b）为准。 | — | — | SHELL-D1 | — |
| V2-B2-Shell-Draft | B 状态矩阵 | 页签壳草案一已被草案二取代（canvas.json 板标题），不实现；壳层以草案二与「TCRN 视觉设计标准」画布的壳层板（07a、07b）为准。 | — | — | SHELL-D1 | — |
| V2-B2-Shell-Draft | C 登入动画 | 页签壳草案一已被草案二取代（canvas.json 板标题），不实现；壳层以草案二与「TCRN 视觉设计标准」画布的壳层板（07a、07b）为准。 | — | — | SHELL-D1 | — |
| V2-B2-Shell-Draft | D 几何 | 页签壳草案一已被草案二取代（canvas.json 板标题），不实现；壳层以草案二与「TCRN 视觉设计标准」画布的壳层板（07a、07b）为准。 | — | — | SHELL-D1 | — |
| V2-B2-Shell-Draft | E 消费方契约 | 页签壳草案一已被草案二取代（canvas.json 板标题），不实现；壳层以草案二与「TCRN 视觉设计标准」画布的壳层板（07a、07b）为准。 | — | — | SHELL-D1 | — |
| V2-B2-Shell-Draft | F 与 G+ 底盘的 token 差异 | 页签壳草案一已被草案二取代（canvas.json 板标题），不实现；壳层以草案二与「TCRN 视觉设计标准」画布的壳层板（07a、07b）为准。 | — | — | SHELL-D1 | — |
| V2-B2-Shell-Draft | G 门 | 页签壳草案一已被草案二取代（canvas.json 板标题），不实现；壳层以草案二与「TCRN 视觉设计标准」画布的壳层板（07a、07b）为准。 | — | — | SHELL-D1 | — |
| V2-B2-Shell-Draft | H Initiative 草案 | 页签壳草案一已被草案二取代（canvas.json 板标题），不实现；壳层以草案二与「TCRN 视觉设计标准」画布的壳层板（07a、07b）为准。 | — | — | SHELL-D1 | — |
| V2-B2-Shell-Draft | I 自检 | 页签壳草案一已被草案二取代（canvas.json 板标题），不实现；壳层以草案二与「TCRN 视觉设计标准」画布的壳层板（07a、07b）为准。 | — | — | SHELL-D1 | — |
| V2-B2-Shell-Draft2 | 0 与草案一的差异 | 草案二与草案一的差异说明是文字，不是渲染面。 | — | — | SHELL-D1 | — |
| V2-B2-Shell-Draft2 | A 三态 · 浅色与夜间 | 三态是壳层 story，登记在 navigation-shells 类目，不进 gplus- 类目，本映射维持 23 行；几何与行为由壳层门 scripts/shell-measure-proof.mjs 对成品壳层板与真件 story 量。本映射的样板行只量各样板壳的壳框（shellFrame）。 | packages/ui-react ProductShell（顶带态）；scripts/shell-measure-proof.mjs | `shell-top-band`、`shell-narrow`、`shell-mobile` | SHELL-D1、I16-C9 | — |
| V2-B2-Shell-Draft2 | B 状态矩阵 | 壳层状态矩阵是 shell-matrix story（navigation-shells 类目，contract/matrices.json 的 shell 板），由壳层门量，不进 gplus- 类目。 | contract/matrices.json（shell 板） | `shell-matrix` | I16-C9 | — |
| V2-B2-Shell-Draft2 | C 登入动画 | 登入动画是 shell-intro story（navigation-shells 类目）；静态文档不播放动画，由壳层门在真件上探针。 | packages/ui-react ShellIntro | `shell-intro` | I16-C9、T7 | — |
| V2-B2-Shell-Draft2-b | D 几何 | 几何断言由壳层门逐行映射（scripts/shell-measure-proof.mjs 头注释的 D 段映射表）；本映射的样板行只量壳框：顶带 52 无底无线、纸顶 52 与离壳边 12、圆角 14。 | scripts/shell-measure-proof.mjs；scripts/lib/gplus-measure.mjs（shellFrame） | `shell-top-band`、`shell-narrow`、`shell-mobile` | SHELL-D1、I16-C9 | — |
| V2-B2-Shell-Draft2-b | E 消费方契约 | 消费方契约是文字条款，不是渲染面；以成品壳层板为准。 | — | — | D6 | — |
| V2-B2-Shell-Draft2-b | F 与 G+ 底盘的 token 差异 | token 差异表是数值对照，落点是契约 token（shell 组与 motion 组），不是 story。 | contract/tokens.json | — | D6 | — |
| V2-B2-Shell-Draft2-b | G 门 | 门的清单是治理文本，由壳层门与本映射的壳框执行，不是渲染面。 | scripts/shell-measure-proof.mjs；scripts/storybook-visual-proof.mjs | — | I16-C9 | — |
| V2-B2-Shell-Draft2-b | H Initiative 草案 | Initiative 草案是规划文本（已落为 INIT-016），不是渲染面。 | — | — | SHELL-D1 | — |
| V2-B2-Shell-Draft2-b | I 自检 | 草稿自检记录，不是渲染面。 | — | — | D6 | — |
| V2-Families | 全板 组件家族清单 · 16 个家族 125 件（含设计批次） | 家族清单与批次顺序是规划板，不是组件规格；第一批 23 件即五个矩阵的名册，其余家族不在本批。 | apps/storybook/src/contract-stories/gplus/matrix-stories.tsx（gplusMatrixComponents） | `typography-matrix`、`icon-matrix`、`brand-matrix`、`actions-matrix`、`inputs-matrix` | SCOPE | — |
| V2-Rejections | 全板 打回根因总账 · 契约条款草案 | 打回总账与条款草案是治理文本；条款由各门执行，不是渲染面。 | boards/V2-Rejections.dc.html | — | D6 | — |

## 差异（11 条，其中待 Owner 知悉 4 条：DIFF-7、DIFF-8、DIFF-9、DIFF-11；待 Owner 裁定 0 条）

| 编号 | 板 · 分段 | 画布 | story | 状态 | 引用 |
| --- | --- | --- | --- | --- | --- |
| DIFF-1 | V2-B1-Typography、V2-B1-Icon、V2-B1-Brand、V2-B1-Actions、V2-B1-Inputs、V2-GPlus-Compositions · D、构图一 | 构图一壳层：侧栏 220、收起 52、顶栏 52、纸离边 12（已由顶带壳取代）；四板 D 段与壳层板 07a 第 1 段是顶带壳：顶带 52 无底无线，纸顶 52、离壳边 12、圆角 14 加 s1，屏宽 1240。 | 五个样板用包内 ProductShell 顶带态，按四板 D 段的屏设置：TMS 标按钮、固定项名册 / 合约 / 结算单 / 排期、右上簇铃铛与头像、菜单模型与 07a 相同，面包屑取各板 D 段的上级 › 本页（actions 样板的名册是菜单项，固定项名册为当前）；壳根带 C-5 钩子，data-shell 为板上屏名（ty-l、ty-n 等）。门对样板量壳框 shellFrame（顶带 52、无底线无填充，纸顶 52、离壳边 12、圆角 14；SUB-134），不读旧 .tcrn-product-shell__workspace / .tcrn-top-bar。侧栏引导列 rail 随侧栏取消：样板行不再要求 rail，样板壳带 data-measure-skip="rail"，完整菜单内引导列 16 / 48 由壳层门量（拆分问题 24）。story 框在 1440 视口下比板上 1240 屏窄，壳宽随 story 框。 | 已按 MIN-20261013-SHELL D1、D4 换顶带壳（SUB-134） | P1、O-1、SHELL-D1、SHELL-D4、I16-P24 |
| DIFF-2 | V2-GPlus-Compositions · 构图三 | 构图三：无侧栏，顶部一条导航，内容居中 1040。 | composition-three-sample 换包内 ProductShell 顶带壳（弃用的 TopBar、SubNav 与独立搜索已去掉）：顶带即顶部那条导航（标按钮、固定项、铃铛与头像），纸内页头之后的内容以 --tcrn-layout-content-max-w（1040）居中；壳根带 C-5 钩子（data-shell 为 c3-l、c3-n），门量壳框 shellFrame。与板的差：板上构图三是独立顶栏加文字导航，现由顶带取代；页头随纸宽，不随内容居中。 | 已按 MIN-20261013-SHELL D1 换顶带壳（SUB-134） | P1、COMP、O-4、SHELL-D1、I16-P5 |
| DIFF-3 | V2-GPlus、V2-GPlus-Compositions · 两屏、去掉的套路与 kv 表、构图一 | 底盘板 kv 表写「壳层 侧栏 212 · 顶栏 48」，构图板写侧栏 220、顶栏 52（画布内部两处不一致；本目录 README 以构图板为壳层几何来源）。 | 构图一的侧栏与顶栏几何随顶带壳作废；样板按壳层板取值：顶带 52、纸离壳边 12（见 DIFF-1）。 | 已由顶带壳取代（MIN-20261013-SHELL D1） | P1、D6、O-4、SHELL-D1 |
| DIFF-4 | V2-B1-Typography、V2-B1-Icon、V2-B1-Brand、V2-B1-Actions、V2-B1-Inputs · A、B | 夜间块用 .gp.night 类。 | 夜间块用 data-tcrn-theme="dark"，浅色块用 data-tcrn-theme="light"。 | 已裁定 | C2 |
| DIFF-5 | V2-B1-Actions、V2-B1-Inputs · A、B | 静态状态用 .is-hover、.is-active、.is-focus 类。 | 静态状态用 data-tcrn-preview-state，与真实伪类共用同一对表。 | 已裁定 | C4 |
| DIFF-6 | V2-B1-Inputs · B | 开关钮格 sw-on 的探针是 after-bg（画板用 ::after 画钮）。 | 包内 Switch 用 ::before 画钮，story 的探针是 before-bg；测量库读 ::before 的背景（W5-C 加的 before-bg 探针），sw-on 两格照常与 data-expect 比对。 | 测量库已支持 before-bg（W5-C） | C9 |
| DIFF-7 | V2-B1-Typography、V2-B1-Icon、V2-B1-Brand、V2-B1-Actions、V2-B1-Inputs · A | 每板左浅色、右夜间并排。 | typography 与 inputs 两块并排，icon、brand、actions 两块上下叠放（守 story 高度预算）。 | 待 Owner 知悉 | P24 |
| DIFF-8 | V2-B2-Logos-Draft · A–E | 每枚产品标有大图、128 至 16 六档尺寸阶梯、淡底与深底贴片（64 / 32）、单色版与锁定块。 | brand-matrix 给 TCRN 标 22 / 28 / 38 / 56 四档、四枚产品标 38 一档与单色版、ProductLogo 四个产品与 ProductLockup；没有六档阶梯与贴片。 | 待 Owner 知悉：第二批品牌 | LOGOS、SCOPE |
| DIFF-9 | V2-B1-Brand · D | 产品页表格四列：产品、资产 ID、标语 · zh / en、注册（浅色与夜间两块相同）。 | brand-sample-product 的表格删去资产 ID 列，剩产品、标语、注册三列（返工 R2-25）。 | 待 Owner 知悉 | R2-25、SUB-072 |
| DIFF-10 | V2-B1-Brand · A、F | 夜间块 ProductLogo 说明写后缀用各自产品标的深色：TMS #2c63c8（F 段 token 差异表的后缀颜色同写 tms #2c63c8，不分主题）。 | 包按 O-3 夜间 TMS 后缀取 #7aa0f5（浅色仍为 #2c63c8，Design System #6577f3 不变），token-contrast 与 axe 的两条 TMS 夜间豁免已撤（SUB-088）。 | 已裁定（O-3，设计会话 B 类） | O-3 |
| DIFF-11 | V2-B1-Actions · D | 名册页样板表格三行：星野ひかり（A 组，签约，已复制）、Mika Lindqvist（B 组，试用）、陈嘉怡（B 组，签约）。 | actions-sample-project 的第二行换成名册里的 김하늘（C 组，试用）：拉丁字母人名在 zh-CN 页是两词连写的拉丁串，会被英文泄漏扫描当作未翻译文本；其余行、动作与危险区同板。story id 不变（INIT-016 C-9）。 | 待 Owner 知悉 | I16-C9 |

渲染缺陷（例如状态格对比度偏离、缺格）不是设计差异，不记在这里；它们是门的不通过项，见逐行报告与本批问题清单。

## 门

在仓库根先 `pnpm build`，再执行：

```sh
node scripts/storybook-visual-proof.mjs                  # 全部行，浅色与夜间
node scripts/storybook-visual-proof.mjs --kind matrix    # 只判矩阵行
node scripts/storybook-visual-proof.mjs --write-report   # 同时写逐行报告
```
