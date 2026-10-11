# 问题清单 · W4-A（INIT-015 R1，SUB-029 → SUB-030）

见红只记不修。测量为本包在包树内用 headless Chromium 1440×900 打开 `components-gplus-matrices.html`、展开故事后按 `docs/design/gplus-2026-10/measure.js` 的口径（加 `before-bg`）复算，不是门。

1. **静态文档的组件 CSS 作用域改写吃掉了全部状态规则（阻塞 129-GWT2 的 DOM 复核与 SUB-035）。** 页面里有作用域副本 `.story-body .tcrn-button,.story-body .tcrn-link-button{--tcrn-pair-fill:var(--tcrn-pair-fill-d);…}`（特异性 0,2,0），却没有 `.tcrn-button:where(:hover,[data-tcrn-preview-state="hover"])…` 的作用域副本；有副本的地方选择器表在 `:where()` 里被逗号切开，例如 `.story-body :where(.tcrn-button-group)>.tcrn-button:where(:focus-visible,.story-body [data-tcrn-preview-state="focus"])`。结果是故事正文里 hover、active、focus、disabled、selected、read-only、checked 的对都不生效（静态呈现与真实伪类同样失效）。实测浅色页 240 格中 76 格偏离，全是状态格（pri/sec/quiet/danger 与 ico-* 的 h/a/x/s、sel、ink-wash、dis、grp-sel、in-ro、in-dis、search-focus、ck-on、ck-dis、rd-on，两主题各一份）；其余 164 格与 data-expect 的差都 ≤ 0.05。落点：`apps/storybook/src/build/page-template.tsx` 的 `scopeComponentCss` / `scopeComponentSelector`（按行处理、按逗号切选择器；生成的对表段一行多条规则），不在本包文件集。建议按括号深度切选择器表并支持一行多条规则。
2. **浅色块在夜间页面上跟随页面主题。** token 只有 `:root` 与 `[data-tcrn-theme="dark"]` 两块，没有 `[data-tcrn-theme="light"]` 块，所以 `html[data-tcrn-theme="dark"]` 时浅色块的格全部读到夜间值（实测夜间页浅色块格全偏）。门在默认浅色页上测，暂不阻塞。落点：ui-tokens / base.css.ts（W3-D 一线），建议补一个与 `:root` 主题块同值的 light 块。
3. **包缺口与本包的处理（只用包组件渲染）。**
   - ClipboardCopyButton 没有静态状态入口：copying/copied/failed/unsupported 由包渲染后只切 `data-clipboard-copy-state`（copying 另加 `aria-busy`），与包的静态桥运行时做法相同（`matrix-renderer.tsx` 的 `StaticMarkup`）。建议包提供预览状态属性。
   - 内部部件不透传属性：Highlight 的 mark、Select 的 chevron、DatePicker 的 calendar、RadioGroup 的 radio、Field 的错误文字、MultiSelect 的展开列表、ProductLogo/ProductLockup 的两行与字标，格属性按标记注入包渲染出的标记；标记找不到时构建直接抛错。
   - 单独使用的 TcrnBrandMark 没有默认尺寸：`--tcrn-brand-mark-size` 只由锁定组合容器定义，单标会撑满容器（改前品牌矩阵高 19728px）。矩阵在包裹元素上按消费方覆写契约设该包变量（22/28/38/56 四档）。建议 `.tcrn-brand-mark` 给默认值。
   - Text 没有 mono、numeral-inline 的 variant 入参，但刻度定义了 `.tcrn-text--mono`、`.tcrn-text--numeral-inline`；矩阵用 className 传包类。
   - Switch 的钮是 `::before`（画板测 `::after`）：sw-on 带 `data-probe="before-bg"`，`measure.js` 不认识，W5 的测量库（SUB-034/035）需要支持。
   - 第一批没有承载 ok/warn/bad 墨色的宿主：ok、bad 用 ClipboardCopyButton copied/failed 的状态图标，warn 用 LockHint 的图标。
   - 新增 9 个图标未标出：`tcrnIconNewNames` 未从包入口导出（W2-C 的可选项）。
4. **storybook test 的既有红（非本包造成）。** 8 条中 3 条失败：(a)「static contract story surface…」现在停在欢迎页 CSS 的 `/\.tcrn-field:focus-within[\s\S]*background-color/`（之前被 60≠55 的计数挡住，计数已由本包修正）；(b)「canvas color and theme-color first-paint…」预览文件的 `"TCRN canvas", value: "var(--tcrn-color-bg)"`；(c)「storybook AI consumption contract…」的 `/TCRN stays regular weight/`（W2-F 交回第 2 条：改为 `/TCRN stays in ink at medium weight/`，留给批末处置）。本包新增的矩阵测试通过。
5. **「Design System」条目的 fr 是 `Design System`，包标语 fr 是 `Système de design`。** fr 路由上 DS 的 ProductLogo 标语会被换成 `Design System`。该条目还被其它界面使用，本包未改，批末定。
6. **zh-CN 英文泄漏扫描未在本地跑（浏览器门）。** 新可见文案已写五语；变体、状态、尺寸与样式名放在 `<code>` 里并登记为 `matrixMachineWords`；字标 Einzbern、Mana、Orchestrate 登记为 properNouns。MultiSelect 触发器摘要由包在默认语言下拼出，是否泄漏待门判。
7. **story 高度与类目上限（本地测量，非门）。** typography 1069（左右两块）、icon 1367、brand 1376、actions 1876、inputs 1803（左右两块），都 ≤ 2000，未登记宽限表；类目 `gplus-matrices` 现有 5 个，上限 8，W5 的 5 个样板放进同一类目会超限，需另开类目或取得抬线授权。
