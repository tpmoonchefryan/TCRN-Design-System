# 摘录附件 · W6-B（W2-G W3-C W4-A W5-A）：上游包交给既有门与冒烟测试的期望值改动

只读与本包有关的条目：storybook-smoke、internal-alpha、shell-parity、geometry-proof、full-surface、ds-consumption 与 smoke.test 的期望值与断言。


## 交回 W2-G

### INIT-015 R1 · W2-G 交回说明（SUB-007 与画布色）

SUB-007 已完成，画布色这项小事也已完成，没有接续点。本文只记录后续包需要对齐的事实，以及本包文件集以外需要的改动。

## 1. 静态轨（apps/storybook/src/build/write-static.ts）

- 构建会把 `@tcrn/ui-tokens` 字体清单里的每个字体文件原名复制到 `storybook-static/fonts/`。复制后逐个校验字节数和 sha256，不一致就以 `storybook_fonts_copy_differs` 报错退出。每个字族的 OFL 文本复制到 `storybook-static/licenses/`。构建拥有这两个目录，清单里没有的旧文件会被清掉。
- 包内的 `fonts.css` 写成 `storybook-static/tcrn-fonts.css`。改写只有一处：把 `url("./<face>")` 改成 `url("fonts/<face>")`，另外在文件头加了一行说明。如果出现以下任一情况，构建会以 `storybook_fonts_*` 报错退出：清单外的字体、未声明的字体、data: URI、远程 URL、googleapis 或 gstatic、改写后仍不合规的 url。
- 每页 `<head>` 里、`<title>` 之前注入一行，且只注入一次：`<link rel="stylesheet" href="tcrn-fonts.css" data-tcrn-font-source="@tcrn/ui-tokens/fonts.css" />`。
- 导出的常量和函数：`STATIC_FONT_DIR`、`STATIC_FONT_LICENSE_DIR`、`STATIC_FONT_STYLESHEET`、`STATIC_FONT_SOURCE`、`rewriteFontStylesheet(css, faces)`、`linkFontStylesheet(html, label)`。构建摘要里新增了 `fonts` 字段，记录目录、字体数、字节数、许可数和样式表名。

## 2. 真 Storybook 轨与画布色

- `preview.ts` 引入 `@tcrn/ui-tokens/fonts.css`，由 Vite 输出哈希名副本，内容逐字节相同。`main.ts` 的 staticDirs 把包内字体目录挂到 `/fonts`；目录路径用 `import.meta.resolve("@tcrn/ui-tokens/fonts.css")` 解析，不写死仓库布局。
- 画布色统一取 `--tcrn-color-bg`，浅色为 #efeeea，夜间为 #121210。`client-scripts.ts` 导出 `storybookCanvasColors`，其 light 与 dark 两个值都从 `createResolvedTokenMap(theme)["--tcrn-color-bg"]` 读取；如果读到的不是六位十六进制色，构建会报错。以下三处都从这里取值：`page-template.tsx` 的首屏 theme-color meta、切换主题时用的镜像值、`preview.ts` 的「TCRN canvas」。

## 3. 给 W4-A：smoke.test 画布断言的新写法

文件头的 import 需要加上 `createResolvedTokenMap`。旧测试「canvas color and theme-color first-paint mirror the surface-canvas token」整条替换为：

```ts
test("canvas color and theme-color first-paint mirror the G+ ground token", () => {
  const canvasLight = createResolvedTokenMap("light")["--tcrn-color-bg"];
  const canvasDark = createResolvedTokenMap("dark")["--tcrn-color-bg"];
  assert.match(canvasLight, /^#[0-9a-f]{6}$/i);
  assert.match(canvasDark, /^#[0-9a-f]{6}$/i);
  const preview = readStorybookSource(".storybook/preview.ts");
  assert.match(preview, /createResolvedTokenMap\("light"\)\["--tcrn-color-bg"\]/);
  assert.match(preview, /"TCRN canvas",\s*value:\s*tcrnCanvas\b/);
  assert.doesNotMatch(preview, /#[0-9a-f]{6}\b/i, "preview.ts must not hand-copy a canvas hex");
  const componentsPage = readGroupPage("Components");
  assert.ok(componentsPage.includes('<meta name="theme-color" content="' + canvasLight + '" data-storybook-theme-color'));
  assert.match(componentsPage, new RegExp('light:\\s*"' + escapeRegExp(canvasLight) + '",\\s*dark:\\s*"' + escapeRegExp(canvasDark) + '"'));
  const clientScripts = readStorybookSource("src/build/client-scripts.ts");
  assert.match(clientScripts, /createResolvedTokenMap\(theme\)\["--tcrn-color-bg"\]/);
  assert.doesNotMatch(clientScripts, /(?:light|dark):\s*"#[0-9a-f]{6}"/i);
});
```

如果 P2 把 backgrounds 改成 `options` 形态，第二条 `preview` 断言要改成 `/name:\s*"TCRN canvas",\s*value:\s*tcrnCanvas\b/`。

## 4. fonts-render-proof（scripts/fonts-render-proof.mjs）

- 运行方式是 `node scripts/fonts-render-proof.mjs [--root <dir>]`，要先 `pnpm build`。
- 导出接口：`runFontsRenderProof({ root })` 返回 `{ ok, checks, cdn: { strings, requests } }`；另有 `familyProbes(manifest)`、`headingProbes()` 和若干目录常量。
- 共八条腿：copies、stylesheet、pages、cdn-strings、network（加载全部 35 页，并逐字节核对下载到的字体）、families（10 个字族与字重组合）、fallback（「季度复盘」配合 `--tcrn-type-family-heading`，在 400 与 600 两个字重下检查）、control（屏蔽 fonts/ 后应回退到系统字体，本机为 Songti SC）。
- 「用什么字体绘制」取自 CDP 的 `CSS.getPlatformFontsForNode`。可变字体报出的 familyName 是默认实例名，例如 Noto Sans SC Thin、Noto Serif SC ExtraLight，所以按前缀匹配。后续门如果复用这个办法，也要按前缀匹配。
- 变异自测做过：给一个字体副本多加一个字节，再删掉一页的 link，copies、pages、network、families 四条腿随即判红。之后已重新构建复原。

## 5. 本包文件集以外需要的改动

1. 根 `package.json` 增加 `fonts:render-proof` 脚本，并接进 verify（问题清单 P4）。
2. `apps/storybook/src/smoke.test.ts` 的画布断言改法见第 3 节（W4-A；问题清单 P1）。
3. 视需要把 backgrounds 改成 Storybook 10 的 `options` 形态（问题清单 P2）。

## 交回 W3-C

### W3-C 交回说明（INIT-015 R1，SUB-027）

SUB-027 的标记侧已经完成，代码提交为 3e2c46f，没有接续点。问题与判断见 `runs/r1/problems/W3-C.md`。

## 已交付

- 86 个 rename 类在标记、门和测试里全部改为 `tcrn-doc-*`。改名按 doc-class-map.json 的 `target` 逐 token 替换，类名边界判定，前缀相同的类互不影响。
- 85 个删除类（delete-package-provided 38、delete-demo 32、delete-dead 15）已从标记中删除，处置方式见问题清单第 4 条。删除后，包组件按自身属性渲染。
- W2-C 交回的第 1、2 条：Icon library contract 块的来源改为 `data-icon-library-source="tcrn-icon-contract"`，删除了 `data-icon-library-license`，保留 wrapper 和 brand-boundary 两个属性；License readback 一行整行删除。smoke.test.ts 随之改为断言新的来源值，并新增两条反向断言：Style Guide 页不得出现 `lucide`（不区分大小写），也不得出现 `data-icon-library-license=`。
- 差集证据（本包树）：`--details` 显示剩余的 164 个类全部只有 CSS 定义，源码使用与渲染使用都是 0。清零的那次提交须在 W3-B 合入后由集成方跑门，并附差集证据。

## 给 W3-B（SUB-025/026）

- CSS 里 86 个旧名按 map 改名，85 个删除类的规则一并删除。`page-template.tsx` 现在写出 14 个 `tcrn-doc-*` 类，需要在 CSS 里有定义，`templateClassCheck` 才会转绿。
- `.tcrn-doc-icon-sample-grid` 必须保留 `margin: var(--tcrn-space-4) 0 0`，并且不得出现 `--tcrn-space-3`；smoke.test.ts 读的是页面内联 CSS。
- 密集壳的顶栏现在是包 `TopBar`，`.tcrn-shell-demo__topbar …` 系列规则，包括 `.tcrn-search-input--compact { min-width: 0 }`，已经没有目标元素。

## 给 W4-A（五语与机器词）

- 新增的可见文案共两条（英文原文），需要在 `apps/storybook/src/build/locales/storybook-content-text.ts` 里写齐五语：
  - `37 icons drawn for @tcrn/ui-react from the design contract, exposed through Icon.`
  - `Downstream UI imports TCRN icon primitives instead of drawing its own SVGs.`
- 该文件里应删除第 506、507、509 行三条旧条目。因为 License readback 一行已整行删除，第 508 行「License readback」和第 510 行「This is a license receipt, not legal advice or package publication.」也已没有使用处（apps/storybook/src 内 grep 为 0），一并删除。
- `scripts/lib/locale-invariant-ledger.mjs` 第 160 行的 `"Lucide React"` 删除。

## 给 W6-B（期望值重定基线）

以下几处结构变了，外观期望值可能随之变化，本包没有改动这些期望值：

- 密集壳的两条顶栏改用 `TopBar`，影响几何与视觉签名。
- changelog 的紧凑节点现在是 `.tcrn-machine-token__value`，storybook-smoke 约第 2902 行检查它的宽度、overflow 与 text-overflow。
- 加载示例改用 Card、Skeleton、Progress、Badge 与转圈图标。
- 字号样本改用 Heading 与 Text。
- 短字段宽度改由容器设定。
- shell-parity 现在通过包根类 `tcrn-top-bar`、`tcrn-side-nav` 测量 knowledge 壳的顶栏和侧栏。

## 给集成

- 集外的两个门须在同一次合并时一起改：`scripts/s254-story-dom-proof.mjs:43` 与 `scripts/shell-fidelity-proof.mjs` 的几处条目，见问题清单第 3 条。
- storybook test 另有 7 条失败断言不是本包造成的，见问题清单第 2 条 (b)。

## 交回 W4-A

### 交回说明 · W4-A（SUB-029 → SUB-030）

## 已交付

- SUB-029：`contract-stories/gplus/matrix-renderer.tsx`（格属性、浅色与夜间两块、分节、状态表、`StaticMarkup` 标记编辑）、`matrix-stories.tsx`（五个矩阵与 23 件组件名册 `gplusMatrixComponents`）、`icon-roster.tsx`（37 件 × 14/16/20）。格数 44/28/10/116/42，全部来自 `gplusMatrices`。
- SUB-030：Components 下新类目 `gplus-matrices`（Family matrices），story id 与 registry 顺序为 typography-matrix、icon-matrix、brand-matrix、actions-matrix、inputs-matrix，排在 documents-and-collaboration-templates-spec 之后；五语标题与说明、类目与样张文案五语、W2-C/W3-C 的图标库文案替换、W2-F 的标语；台账删除 `Lucide React`，新增 properNouns 与 `matrixMachineWords`；Track A 适配文件 typography/icon/brand/actions/inputs.stories.tsx，导出 `Matrix`（Storybook id `typography--matrix` 等）。

## 给 W5（SUB-028、SUB-031、SUB-033、SUB-035）

- 路由：类目页 `components-gplus-matrices.html`，故事锚点 `#<story id>`；类目页上故事默认折叠，测量前把 `article[data-story-collapsed]` 设为 `false`（浏览器证明的做法）。
- 测量钩子：板根 `[data-gplus-matrix="<板>"]`（带 `data-gplus-matrix-cell-count`、`data-gplus-matrix-layout`）；两块 `[data-gplus-matrix-theme="light|night"]`，分别带 `data-tcrn-theme="light|dark"`；分节 `[data-gplus-matrix-component="<组件>"]`；格 `data-cell`、`data-kind`、`data-expect`、禁用格 `data-exempt`，探针 `data-probe` 取 ph、shadow、after-border、after-shadow、before-bg（最后一项是 Switch 的钮，测量库需支持）。
- 注册：样板 story 照 `matrix-stories.tsx` 的 `matrixStory` 写法（`storyGovernanceFor` 加 `sourcePath` 覆盖）。smoke 的 CSF 门按 components → typography → icon → brand → actions → inputs 的顺序拼接 Components 组的适配文件，样板导出放进家族文件后，registry 顺序要与拼接顺序一致；`smoke.test.ts` 的 sourcePath 断言按类目判断，新类目需同步。
- 类目上限 8：`gplus-matrices` 已有 5 个，样板请另开类目（例如 gplus-samples）。
- SUB-035 转绿前须先修问题清单第 1 条（页面 CSS 作用域吃掉状态规则），否则全部状态格偏离。

## 集外改动需求

1. `apps/storybook/src/build/page-template.tsx`：组件 CSS 作用域改写按括号深度切选择器、支持一行多条规则（问题清单 1）。
2. ui-tokens / `styles/base.css.ts`：补 `[data-tcrn-theme="light"]` 主题块（问题清单 2）。
3. `packages/ui-react`：ClipboardCopyButton 预览状态入口、TcrnBrandMark 默认尺寸、Text 的 mono 与 numeral-inline 入参、入口导出 `tcrnIconNewNames`（问题清单 3）。
4. `smoke.test.ts` 的 `/TCRN stays regular weight/` 按 W2-F 交回改写（问题清单 4c，批末处置）。

## 未做完

无接续点。story-budget.mjs 与 navigation.ts 无需改动（高度都在 2000 内，类目 5 个）。

## 交回 W5-A

### 交回说明 · W5-A（SUB-031）

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
