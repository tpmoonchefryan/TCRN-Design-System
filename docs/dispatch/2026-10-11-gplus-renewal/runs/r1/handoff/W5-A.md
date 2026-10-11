# 交回说明 · W5-A（SUB-031）

## 已交付

- `contract-stories/gplus/sample-stories.tsx`：五个样板的注册、英文标题与说明、`gplusSampleStoryIds`、`gplusSampleSourcePath`。
- `contract-stories/gplus/samples/composition-one.tsx`：构图一外壳（包 ProductShell）与五个页面（账单、项目 ×2、产品、邀请成员）；`railEdits` 给 rail 元素加测量钩子；`GplusSampleBoardView` 输出浅色块与夜间块。
- 注册：Components 下新类目 `gplus-samples`（Composition samples），每个样板排在其家族矩阵之后（typography-matrix, typography-sample-billing, icon-matrix, icon-sample-project, …），与 CSF 拼接顺序一致；Track A 导出 SampleBilling / SampleProject / SampleProduct / SampleProject / SampleMembers（Storybook id `typography--sample-billing` 等）。
- 五语：标题与说明在 storybook-locale-text.ts，类目与样板文案 82 条在 storybook-content-text.ts；机器词登记在台账 `sampleMachineWords`；smoke 新增样板测试，并同步 id 表、sourcePath、llms.txt 列表与 CSF 导出名断言。

## 给 W5-B / W6-B（SUB-032、SUB-033、SUB-035）

- 路由：`components-gplus-samples.html#<story id>`；故事默认折叠，测量前用 `expandStory`。五个 id：typography-sample-billing、icon-sample-project、brand-sample-product、actions-sample-project、inputs-sample-members。
- 钩子：板根 `[data-gplus-sample="<typography|icon|brand|actions|inputs>"]`；两块 `[data-gplus-sample-theme="light|night"]`，分别带 `data-tcrn-theme="light|dark"`；壳根即 ProductShell，带 `data-shell="ty-l|ty-n|ic-l|…|in-n"` 与 `data-gplus-sample-shell`；rail 的品牌标与导航图标带 `data-guide="rail"`，字标与导航文字带 `data-text="rail"`（每块各 1 + 导航项数）。夜间切换：两块的 class 序列相同，只差块上的 `data-tcrn-theme` 与壳主题按钮的状态属性（smoke 断言）。
- 高度：每个样板 article 1908px（region 1812，两壳各 900）。
- 测量根建议用 `storyBodySelector`，article 根会把文档标题的 2px 溢出算进 clip（问题清单 4）。

## 与构图一的差值（写进 storybook-map 的差异记录，均引用 P1）

| # | 项 | 构图一 | 样板实测 | 处置 |
| --- | --- | --- | --- | --- |
| 1 | 侧栏宽 | 220 | 220 | 已经 `--tcrn-product-shell-sidebar-width` 对齐 |
| 2 | 引导列（129-GWT3） | 图标左 16、文字 48 | 品牌行 16 / 48；导航项图标 49、文字 77 | 待 Owner（P1） |
| 3 | 纸离边（129-GWT3） | 上右下 12，圆角 14，阴影 s1 | 偏移 0，无圆角、无阴影，工作区紧贴侧栏 | 待 Owner（P1） |
| 4 | 顶栏 | 高 52，左右内距 28 | 高 68，内距 12 / 20 | 待 Owner（P1） |
| 5 | 侧栏底色 | 画布色，无右边线 | 品牌浅洗（acc 8%）加右边线 | 待 Owner（P1） |
| 6 | 侧栏头 | 只有品牌块 | 品牌块加收起按钮与移动端开关 | 包壳行为，P1 |
| 7 | 导航分组 | 首组无标题，"团队"标题在设置前 | 首组显示 "Workspace" 标题（NavGroup 必有标题） | 包壳行为，P1 |
| 8 | 侧栏底部用户区 | 头像、姓名、角色 | 无此槽，头像移到顶栏 `headerActions` | 包缺口，P1 |
| 9 | 导航计数 | 项目 12、成员 24 | 无计数槽，未呈现 | 包缺口，P1 |
| 10 | 面包屑 | 设计组 › 账单（链接加箭头） | 壳的当前位置标签加路由名，无箭头 | 包壳行为，P1 |
| 11 | 顶栏控件 | 搜索、（图标板另有通知、夜间、语言）、头像 | 搜索、headerActions（通知按钮仅图标样板、头像）、壳自带主题按钮与语言菜单 | 包壳行为，P1 |
| 12 | 屏高 | 640 | 每块 900（壳 `min-height: 100vh`） | 包壳行为，P1 |
| 13 | 内容内距 | 18 / 28 / 14 | 20 | 包壳行为，P1 |
| 14 | 页头 | 衬线 h2 加 caps 副标，动作右对齐 | 包 PageHeader：h2 加正文说明，动作在 meta 槽 | 记录，非 P1 |
| 15 | 表格 | 原生表，5 列，选中行墨洗 | TableShell 4 列（账单去掉席位列，项目表去掉最近活跃），无选中行 | 记录，非 P1 |
| 16 | 状态 | 圆点加字 | Badge 药丸 | 记录，非 P1 |
| 17 | 指标 | 分隔线的一行 | 文档网格里的 Text caps / numeral 加 Badge 或 meta | 记录，非 P1 |
| 18 | 工具栏与危险区 | 左右分布（spacer） | 文档动作行（换行排列），危险区为文字块加按钮行 | 记录，非 P1 |

## 集外改动需求

1. 包 ShellThemeToggle 或 page-template：块级 `data-tcrn-theme="dark"` 下主题按钮图标不显示（问题清单 2）。
2. page-template 的 scopeComponentCss：单选选中态不显示（问题清单 3，与 W4-A 问题 1 同源）。
3. 测量门（SUB-033 / SUB-035）：测量根改用 region（问题清单 4）。
4. 若 Owner 裁定构图一壳层纳入 INIT-015：ProductShell 需要引导列 16 / 48、分离的纸（离边 12）、顶栏 52、侧栏底部用户区与导航计数（差值表 2–13）。

## 未做完

无接续点。story-budget.mjs 与 navigation.ts 无需改动（高度 1908，新类目 5 个）。
