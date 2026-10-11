# G+ 画布板到 story 的映射

画布设计正本页（本目录 `boards/` 是仓内副本，版本 33）的每块板与分段，对应到静态文档里的 contract story。机读版是同目录的 `storybook-map.json`，门 `scripts/storybook-visual-proof.mjs` 读它；两份同源，改映射时一起改。逐行测量结果写在 `docs/verification/storybook-visual-proof/gplus-map-report.md`。

## 读法

- **story id** 是静态文档（Track B）里的 contract story id，路由形如 `/components-gplus-matrices.html#typography-matrix`；**Storybook id** 是真 Storybook（Track A）的 id，例如字体板对应 `typography--matrix` 与 `typography--sample-billing`。两轨共用同一注册表，门只量 Track B（引用 T7）。
- **期望格数** 是该行要渲染的 `data-cell` 个数（浅色与夜间合计），取自 `contract/matrices.json`；门还逐格比对 story 的 `data-expect` 与画板上同一格的 `data-expect`。
- **测量项** 是该行必须测得到的项（测不到即 n/a，算不通过）。八项测量（clip 溢出、singleLine 单行、shadowBlur 阴影模糊、rail 引导列、rowAlign 行对齐、mark 高亮中性、contrast 每格对比度、controlHeight 控件高）与 overlap 重叠检查每行都照跑，任何一项不通过即该行不通过；阈值只在门里（取 EPIC 级几何门的 THRESHOLDS），本映射不写阈值。几何门 `scripts/geometry-measure-proof.mjs` 的必测项（REQUIRED_CHECKS）与本表同步：每个 story 的必测项是任何页面都有的四项（clip、singleLine、shadowBlur、overlap）加上引用它的各行测量项之并。样板没有 `data-cell`，不测 contrast，测壳的 rail；带 TableShell 行的四个样板另测 rowAlign（邀请成员样板没有表格）；actions 与 inputs 两个矩阵的控件声明了 `data-h`，测 controlHeight。
- **story 清单** 是约定 7 的十个 id 加上注册表里类目以 `gplus-` 开头的全部 story。映射引用而清单或注册表没有的、清单有而映射没引用的，门都判红。
- 样板 story（`*-sample-*`）由并行的实施包实现，id 按约定 7 先登记；合并前门报它们缺席（不通过），只判矩阵行时用 `--kind matrix`。
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

## 有 story 的分段（22 行）

| 行 | 板 | 分段 | story id | Storybook id | 类 | 期望格数 | 测量项 | 差异 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| typography.A | V2-B1-Typography | A 组件与样式 | `typography-matrix` | `typography--matrix` | 矩阵 | — | clip、singleLine、shadowBlur、mark、overlap | DIFF-4、DIFF-7 |
| typography.B | V2-B1-Typography | B 状态矩阵 | `typography-matrix` | `typography--matrix` | 矩阵 | 44 | contrast | DIFF-4 |
| typography.D | V2-B1-Typography | D 组合样板 · 构图一（账单页） | `typography-sample-billing` | `typography--sample-billing` | 样板 | — | rail、rowAlign | DIFF-1 |
| icon.A | V2-B1-Icon | A 名册与状态 | `icon-matrix` | `icon--matrix` | 矩阵 | — | clip、singleLine、shadowBlur、overlap | DIFF-4、DIFF-7 |
| icon.B | V2-B1-Icon | B 状态矩阵 | `icon-matrix` | `icon--matrix` | 矩阵 | 28 | contrast | DIFF-4 |
| icon.D | V2-B1-Icon | D 组合样板 · 构图一（项目列表） | `icon-sample-project` | `icon--sample-project` | 样板 | — | rail、rowAlign | DIFF-1 |
| brand.A | V2-B1-Brand | A 组件与状态 | `brand-matrix` | `brand--matrix` | 矩阵 | — | clip、singleLine、shadowBlur、overlap | DIFF-4、DIFF-7 |
| brand.B | V2-B1-Brand | B 状态矩阵 | `brand-matrix` | `brand--matrix` | 矩阵 | 10 | contrast | DIFF-4 |
| brand.D | V2-B1-Brand | D 组合样板 · 构图一（产品页） | `brand-sample-product` | `brand--sample-product` | 样板 | — | rail、rowAlign | DIFF-1、DIFF-9 |
| actions.A | V2-B1-Actions | A 组件与状态 | `actions-matrix` | `actions--matrix` | 矩阵 | — | clip、singleLine、shadowBlur、rowAlign、controlHeight、overlap | DIFF-4、DIFF-5、DIFF-7 |
| actions.B | V2-B1-Actions | B 状态矩阵 | `actions-matrix` | `actions--matrix` | 矩阵 | 116 | contrast | DIFF-4、DIFF-5 |
| actions.D | V2-B1-Actions | D 组合样板 · 构图一（项目页） | `actions-sample-project` | `actions--sample-project` | 样板 | — | rail、rowAlign | DIFF-1 |
| inputs.A | V2-B1-Inputs | A 组件与状态 | `inputs-matrix` | `inputs--matrix` | 矩阵 | — | clip、singleLine、shadowBlur、controlHeight、overlap | DIFF-4、DIFF-5、DIFF-7 |
| inputs.B | V2-B1-Inputs | B 状态矩阵 | `inputs-matrix` | `inputs--matrix` | 矩阵 | 42 | contrast | DIFF-4、DIFF-5、DIFF-6 |
| inputs.D | V2-B1-Inputs | D 组合样板 · 构图一（邀请成员） | `inputs-sample-members` | `inputs--sample-members` | 样板 | — | rail | DIFF-1 |
| compositions.1.typography | V2-GPlus-Compositions | 构图一 一张纸（账单页消费） | `typography-sample-billing` | `typography--sample-billing` | 样板 | — | rail、rowAlign | DIFF-1、DIFF-3 |
| compositions.1.icon | V2-GPlus-Compositions | 构图一 一张纸（项目列表消费） | `icon-sample-project` | `icon--sample-project` | 样板 | — | rail、rowAlign | DIFF-1、DIFF-3 |
| compositions.1.brand | V2-GPlus-Compositions | 构图一 一张纸（产品页消费） | `brand-sample-product` | `brand--sample-product` | 样板 | — | rail、rowAlign | DIFF-1、DIFF-3 |
| compositions.1.actions | V2-GPlus-Compositions | 构图一 一张纸（项目页消费） | `actions-sample-project` | `actions--sample-project` | 样板 | — | rail、rowAlign | DIFF-1、DIFF-3 |
| compositions.1.inputs | V2-GPlus-Compositions | 构图一 一张纸（邀请成员消费） | `inputs-sample-members` | `inputs--sample-members` | 样板 | — | rail | DIFF-1、DIFF-3 |
| logos.A-E | V2-B2-Logos-Draft | A–E 四枚标 · 浅色与夜间（大图、尺寸阶梯、贴片、单色版、锁定块） | `brand-matrix` | `brand--matrix` | 矩阵 | — | clip、singleLine、shadowBlur、overlap | DIFF-8 |
| logos.I | V2-B2-Logos-Draft | I 标语 | `brand-matrix` | `brand--matrix` | 矩阵 | — | contrast | — |

十个 story 全部被引用：`typography-matrix`、`typography-sample-billing`、`icon-matrix`、`icon-sample-project`、`brand-matrix`、`brand-sample-product`、`actions-matrix`、`actions-sample-project`、`inputs-matrix`、`inputs-sample-members`。

## 没有 story 的板与分段（25 条）

V2-Families 与 V2-Rejections 两块板已入仓（`boards/`），整板没有 story，单列在本表末尾。

| 板 | 分段 | 原因 | 落点 | 参见 | 引用 | 差异 |
| --- | --- | --- | --- | --- | --- | --- |
| V2-GPlus | 两屏 成员页 · 浅色与夜间两屏 | 两屏是成员页整页，主体是表格、头像、状态点、印章、标签页等第二批以后的家族，第一批没有能独立承载它的 story；其中第一批件在五个样板里各有消费。 | contract/tokens.json（.gp 与 .gp.night 两块的字面真值）；packages/ui-tokens（由契约生成） | `typography-sample-billing`、`icon-sample-project`、`brand-sample-product`、`actions-sample-project`、`inputs-sample-members` | SCOPE、D6 | DIFF-3 |
| V2-GPlus | 十种手法 加入的十种手法 · 每种单独看 | 十格是手法示意，不是组件规格。01 字体配对、04 衬线数字落在 typography-matrix，05 更细的图标落在 icon-matrix，07 紧贴阴影由每行的阴影模糊测量覆盖；03 颗粒、06 印章、08 墨洗选中态、09 薄玻璃、10 状态点属第二批以后的家族或页面底，本批没有 story。 | contract/tokens.json（阴影 s1/s2/s3、颗粒、玻璃、选中洗底的 token） | `typography-matrix`、`icon-matrix` | SCOPE、D6 | — |
| V2-GPlus | 去掉的套路与 kv 表 从 G 里去掉的高频套路 · 换成了什么（含 kv 表） | 对照表与 token 键值表，是文字与数值，不是渲染面；数值的落点是契约 token。 | contract/tokens.json | — | D6 | DIFF-3 |
| V2-GPlus-Compositions | 构图三 顶部导航（无侧栏，内容居中 1040） | 第一批五板的 D 段全部指定构图一，没有构图三的样板 story；构图三的顶栏导航与内容宽属壳层几何，与 P1 同题。 | — | — | COMP、P1 | DIFF-2 |
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
| V2-Families | 全板 组件家族清单 · 16 个家族 125 件（含设计批次） | 家族清单与批次顺序是规划板，不是组件规格；第一批 23 件即五个矩阵的名册，其余家族不在本批。 | apps/storybook/src/contract-stories/gplus/matrix-stories.tsx（gplusMatrixComponents） | `typography-matrix`、`icon-matrix`、`brand-matrix`、`actions-matrix`、`inputs-matrix` | SCOPE | — |
| V2-Rejections | 全板 打回根因总账 · 契约条款草案 | 打回总账与条款草案是治理文本；条款由各门执行，不是渲染面。 | boards/V2-Rejections.dc.html | — | D6 | — |

## 差异（9 条，其中待 Owner 裁定 4 条：DIFF-1、DIFF-2、DIFF-3、DIFF-8）

| 编号 | 板 · 分段 | 画布 | story | 状态 | 引用 |
| --- | --- | --- | --- | --- | --- |
| DIFF-1 | V2-B1-Typography、V2-B1-Icon、V2-B1-Brand、V2-B1-Actions、V2-B1-Inputs、V2-GPlus-Compositions · D、构图一 | 构图一壳层：侧栏 220、收起 52、顶栏 52、纸离边 12。 | 样板按 P1 的建议用包内 ProductShell（现值侧栏 280、收起 92），侧栏宽经局部变量 --tcrn-product-shell-sidebar-width 设 220；收起 52 与顶栏、纸离边的差值待裁。门对样板量引导列 16 / 48（requiredChecks 含 rail）。 | 待 Owner 裁定 | P1 |
| DIFF-2 | V2-GPlus-Compositions · 构图三 | 构图三：无侧栏，顶部一条导航，内容居中 1040。 | 没有对应 story。 | 待 Owner 裁定 | P1、COMP |
| DIFF-3 | V2-GPlus、V2-GPlus-Compositions · 两屏、去掉的套路与 kv 表、构图一 | 底盘板 kv 表写「壳层 侧栏 212 · 顶栏 48」，构图板写侧栏 220、顶栏 52（画布内部两处不一致；本目录 README 以构图板为壳层几何来源）。 | 样板按构图板的 220 取值（见 DIFF-1）。 | 待 Owner 裁定 | P1、D6 |
| DIFF-4 | V2-B1-Typography、V2-B1-Icon、V2-B1-Brand、V2-B1-Actions、V2-B1-Inputs · A、B | 夜间块用 .gp.night 类。 | 夜间块用 data-tcrn-theme="dark"，浅色块用 data-tcrn-theme="light"。 | 已裁定 | C2 |
| DIFF-5 | V2-B1-Actions、V2-B1-Inputs · A、B | 静态状态用 .is-hover、.is-active、.is-focus 类。 | 静态状态用 data-tcrn-preview-state，与真实伪类共用同一对表。 | 已裁定 | C4 |
| DIFF-6 | V2-B1-Inputs · B | 开关钮格 sw-on 的探针是 after-bg（画板用 ::after 画钮）。 | 包内 Switch 用 ::before 画钮，story 的探针是 before-bg；测量库读 ::before 的背景（W5-C 加的 before-bg 探针），sw-on 两格照常与 data-expect 比对。 | 测量库已支持 before-bg（W5-C） | C9 |
| DIFF-7 | V2-B1-Typography、V2-B1-Icon、V2-B1-Brand、V2-B1-Actions、V2-B1-Inputs · A | 每板左浅色、右夜间并排。 | typography 与 inputs 两块并排，icon、brand、actions 两块上下叠放（守 story 高度预算）。 | 待 Owner 知悉 | P24 |
| DIFF-8 | V2-B2-Logos-Draft · A–E | 每枚产品标有大图、128 至 16 六档尺寸阶梯、淡底与深底贴片（64 / 32）、单色版与锁定块。 | brand-matrix 给 TCRN 标 22 / 28 / 38 / 56 四档、四枚产品标 38 一档与单色版、ProductLogo 四个产品与 ProductLockup；没有六档阶梯与贴片。 | 待 Owner 裁定 | LOGOS、SCOPE |
| DIFF-9 | V2-B1-Brand · D | 产品页表格四列：产品、资产 ID、标语 · zh / en、注册（浅色与夜间两块相同）。 | brand-sample-product 的表格删去资产 ID 列，剩产品、标语、注册三列（返工 R2-25）。 | 已裁定 | R2-25 |

渲染缺陷（例如状态格对比度偏离、缺格）不是设计差异，不记在这里；它们是门的不通过项，见逐行报告与本批问题清单。

## 门

在仓库根先 `pnpm build`，再执行：

```sh
node scripts/storybook-visual-proof.mjs                  # 全部行，浅色与夜间
node scripts/storybook-visual-proof.mjs --kind matrix    # 只判矩阵行
node scripts/storybook-visual-proof.mjs --write-report   # 同时写逐行报告
```
