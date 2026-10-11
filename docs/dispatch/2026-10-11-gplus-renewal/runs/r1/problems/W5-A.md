# 问题清单 · W5-A（INIT-015 R1，SUB-031）

见红只记不修。测量为本包在包树内构建后，用 headless Chromium 1440×900 打开 `components-gplus-samples.html?locale=zh-CN`、展开故事，以 `scripts/lib/gplus-measure.mjs` 的 `measurePage`（根为故事 article，rail 阈值 16 / 48 / 容差 1）与自写的几何读数得出；五个样板读数相同，下列数值对浅色块与夜间块都成立。

1. **129-GWT3 红，待 Owner 裁定（拆分问题清单 P1）。** rail 检查在全部 10 个壳上失败：品牌行标在 16、字标在 48，与构图一相符；导航项图标在 49、文字在 77，偏 33px。原因在包 ProductShell：侧栏内距 16，导航项左内距为 `--tcrn-space-6` 加 1px 边框，图标列 20、列距 8。纸离边 12 也不成立：工作区紧贴侧栏，上、右、下偏移都是 0，没有 14 圆角与 s1 阴影。顶栏高 68（构图一为 52）。样板只经已登记的局部变量 `--tcrn-product-shell-sidebar-width` 把侧栏设为 220，其余差值未在包外补样式，逐条见 handoff/W5-A.md 的差值表。
2. **夜间块里壳的主题按钮没有图标。** 浅色块显示太阳；夜间块（`data-tcrn-theme="dark"` 加在块上，壳 `currentTheme="dark"`）两枚图标都不显示，按钮只剩空圈。推测图标显隐规则按页面级 `html[data-tcrn-theme]` 写，作用域改写后块级主题够不到。证据：截图 `actions-sample-project` 夜间块顶栏。归属包 ShellThemeToggle 的 CSS 或 page-template 作用域改写，不在本包文件集。
3. **单选组的选中态在静态页上不显示。** 标记里 `checked=""` 在位（`inputs-sample-members-light-visibility` 的 team 项），渲染出来两个圆都是空的；开关的开态正常。与已知的状态规则问题同源（page-template 的 scopeComponentCss 按逗号切开 `:where()`），未另查。
4. **故事 article 根的 clip 读数被文档标题拖红。** 五个样板在 zh-CN 都报一处 clip：`span.tcrn-doc-story-disclosure__title` 里的标题溢出 2px（文档外框，不是样板内容）。用 `storyBodySelector`（`#<id>-region`）作测量根即可避开；建议 SUB-033 / SUB-035 的门按 region 量。样板内容本身 clip 与 overlap 均为 0。
5. **包壳的外框文案在本地化页面上保持英文（属性，不是可见文本）。** ProductShell 按构建时的 `currentLocale`（en）组出的 aria-label 与 title（"Design team home"、"Billing shell controls"、收起侧栏、切换主题、搜索结果、TcrnBrandMark 的 alt 等）在内容字典里没有条目，运行时不换语言。可见文本里只有搜索结果面板的 "No results"，它带 `hidden`，innerText 不计入，zh-CN 扫描不报。现有 navigation-product-shell-spec 同样如此。
6. **storybook 测试的既有红（非本包造成）。** 9 条中 3 条失败，与 W4-A 问题 4 相同：focus-within 断言（静态契约面一条）、`.storybook/preview.ts` 的 canvas 断言、`TCRN stays regular weight`。本包另做了探针：把这三处既有断言改成空操作后跑编译产物，除 preview.ts 一条外全部通过，本包的 id 表、注册顺序、CSF 顺序、sourcePath、llms.txt 列表与新样板测试都过。探针副本已移出 dist。
7. **故事高度余量小。** 五个样板 article 高都是 1908px（预算 2000）。两块各是一个 ProductShell，壳的 `min-height: 100vh` 在 900 视口下各 900px；壳或文档标题区再高 92px 就会越线。story-budget.mjs 未改。
8. **嵌入的 ProductShell 在页面滚动时有粘性位移。** 侧栏 `position: sticky; height: 100dvh`、顶栏 `position: sticky`，元素截图滚到壳时侧栏底色在壳底上方约 95px 处结束，文档页头盖住壳顶。是包壳在文档页里嵌入的行为，量几何前应滚动到位或量 region。
9. **包 API 缺口与本包的处理。**
   - ProductShellNavItem 不透传属性、没有计数槽：rail 的 `data-guide` / `data-text` 用矩阵同款的属性编辑（StaticMarkup + applyMarkupEdits）加在包标记上；导航计数（项目 12、成员 24）未呈现。
   - ProductShell 没有侧栏底部用户区：头像改放 `headerActions`。
   - Checkbox 没有 label 入参：样板用原生 `label` 包住 Checkbox 与 Text。
   - Text 渲染为 `p`：放进 TableShell 单元格（`span role="cell"`）与 PageHeader 的 meta 时是 `p` 套在 `span` 里，与矩阵做法相同。
   - TableShell 没有选中行：构图一的选中行墨洗未呈现。
   - MultiSelect 的触发器摘要由包按选项拼出，样板为这一组合（"Quarterly review, October launch, Autumn hiring"）单独加了字典条目；inputs-matrix 的摘要 "Quarterly review, October launch" 在字典里没有条目，可能在 zh-CN 漏英文，未查证（W4-A 的文件）。
10. **品牌样板只列四个已注册产品。** 表格为 design-system、tms、einzbern、mana-orchestrate 四个带产品标的条目；aos 没有产品标、字标保持现状，未列入。画板 D 段的四行用的是旧名（含已更名的条目）。
