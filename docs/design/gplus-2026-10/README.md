# G+ 焕新设计数据（2026-10）

当前参考入口见[设计参考索引](../README.md)：[Sites 草稿](https://tcrn-ds-visual-draft.honestfawn3.chatgpt.site)用于探索与待确认内容，[Sites 设计标准](https://tcrn-ds-visual-standards.honestfawn3.chatgpt.site)用于已确认标准（Owner 2026-10-29；沿用 TCRN-CROSS-MIN-308 D1 的分工）。本目录保留原版本 33 迁入后持续演进的实现、story 与门的数据；当前候选修改与 Sites 标准的对应关系须逐项核对。

| 目录 / 文件 | 内容 | 用途 |
| --- | --- | --- |
| `boards/V2-GPlus.dc.html` | G+ 底盘：浅色与夜间两屏、十种手法、kv 表 | `.gp` 与 `.gp.night` 两个 CSS 块是 token 字面真值 |
| `boards/V2-GPlus-Compositions.dc.html` | 构图一与构图三 | 构图一的壳层几何（侧栏 220、收起 52、顶栏 52）已随顶带壳退役（MIN-20261013-SHELL D1），顶带壳的几何取 `contract/tokens.json` 的 `shell` 组；沿用到顶带壳的只有纸离边 12、纸面圆角 14（`r-paper`）与构图三的内容宽 1040（`layout-content-max-w`） |
| `boards/V2-B1-*.dc.html` | 第一批五板：Typography、Icon、Brand、Actions、Inputs | 每板 A 全态、B 状态矩阵（每格对比度）、C 动效、D 构图一样板、E 消费方契约、F 与 G+ 的 token 差异 |
| `boards/V2-B2-Logos-Draft.dc.html` | 四枚产品标（Owner 通过） | 48 格构法、两色、贴片、锁定块、SVG 源、五语标语 |
| `contract/tokens.json` | 主题相关 token 39 键（浅色与夜间同集，C5）；主题无关 token 58 条：surface、focus、三族字栈、圆角 6 条（含纸面圆角 `r-paper` 14px）、控件高、内距、字号、图标尺寸、动效 9 条（含登入动画的四条 `intro-*`）、内容宽 `layout-content-max-w` 1040px，以及顶带壳的 `shell` 组 25 条：07b F 段 16 条，本 INIT 新增 6 条（R2 的 `shell-mark` 22px、`shell-touch` 44px、`shell-crumb-icon` 11px，R3 的 `shell-chevron` 12px、`shell-locale-chevron` 11px、`shell-mark-lg` 44px，名属 B 类，待设计会话补登 F 段），另有旧壳三条已退役（`rail-w` 220px 与 `rail-w-collapsed` 52px 弃用、无继任、保留原值，`topbar-h` 是指向 `shell-strip-h` 的弃用别名）；粗指针下 `shell-row-h` 与 `shell-srch-h` 改指 `shell-touch`，这组映射不在本文件，以 `@tcrn/ui-tokens` 的 `tcrnCoarsePointerTokens` 为唯一来源。产品后缀色 4 条：TMS 后缀浅色 #2c63c8，取通过稿（MIN-20261013-SHELL D2），夜间取标的亮色 #7aa0f5（`night` 与 `nightRef` `marks.json#tms.palette.bright`；TCRN-DS-MIN-20261016-R6 D4 按 D7 的建议值裁定，夜间于纸 6.86、于画布 7.30），按主题写进浅色块与夜间块；其余 3 条两主题同色，只写进主题无关块。每条带包内变量名 `cssVar` | 单一真值；`T` 与板面 `.gp` / `.gp.night` 块由它生成；包内 `gplus-tokens.generated.ts` 也由它生成，浅色选择器由契约夜间选择器的属性派生（契约浅色选择器 `:root` 加上夜间选择器属性取 light 值的 `[data-tcrn-theme="light"]`），契约值不变 |
| `contract/pairs.json` | 状态对表：Actions 四变体 × 七状态（d/h/a/f/x/l/s）的 fill/ink/edge；Inputs 文本类（d/h/f/x/r/rf/e/ef，search 部分覆盖）、勾选类（fill/edge/mark，radio 部分覆盖）、开关类（fill/edge/knob/knob-edge）；包内选择器与状态条件 | 板面变体声明与 `pairs()` 由它生成；`scripts/contract-generate.mjs` 由它生成包内变体对段 |
| `contract/matrices.json` | 六板每个 data-cell 一条（第一批五板 Typography 44、Icon 28、Brand 10、Actions 116、Inputs 42，加壳层板 shell 66，即 07a `Shell.dc.html` 的 B 段矩阵；共 306）：cellId、fill/ink/surface 的 token、kind、exempt、对表引用 | 板面 data-expect 与 story 矩阵数据由它算出（`lib.mjs` 的 `cr` / `fmt`） |
| `contract/icons.json` | 38 个图标的 20 格路径，10 个新增标 `new` | `ICONS` 与包内图标路径由它生成 |
| `contract/marks.json` | 四枚产品标的 body 模板、palette（含 tint）、字标与字体、五语标语 | `logos2/`、标板与包内产品标由它生成 |
| `contract/typography.json` | Heading 1–4、Text 的 size / tone / variant、numeral、caps、mono、链接、mark；29 条字体刻度 token（刻度名、包内变量名 `cssVar`、值或指向 tokens.json fixed 的 `ref`）；链接状态对表（写法同 pairs.json：default 与 quiet 两个变体，d/h/f 三态） | 字体板的刻度 CSS 与包内字体刻度段由它生成，链接对表生成链接的变体对与状态规则；29 条刻度 token 生成进 `packages/ui-tokens/src/gplus-tokens.generated.ts`，`@tcrn/ui-tokens` 从那里取值 |
| `tools/data.mjs` | 读取并校验六份 JSON（无副作用），导出 `T`、`ICONS`、`PAL`、`MARKS`、`pairState`、`pairDecls`、`matrixCell` | 画板生成器与 `scripts/contract-generate.mjs` 的唯一数据入口 |
| `tools/lib.mjs` | 对比度算法（`cr` / `fmt`）、板面 CSS、构图一壳层（已退役，只留给已退役的 V2-B1-Brand 草稿板的 `build-brand.mjs`；家族板 D 段的顶带壳在 `tools/shell-screen.mjs`）、矩阵表、`cellAttrs` | 画板共用库 |
| `tools/build-*.mjs` | 五块第一批画板与产品标板的生成器 | 经 `data.mjs` 读契约，不再内嵌数据 |
| `measure.js` | 八项 DOM 测量：溢出、单行行框、阴影模糊、引导列、行对齐、mark 中性、每格对比度、控件高度；另有重叠检查 | STORY-131 移植为门 |
| `logos2/*.svg` | 四枚产品标 color 与 mono 版，viewBox 0 0 48 48 | STORY-127 的 digest 对象 |

重新生成画板：在仓库根执行 `node docs/design/gplus-2026-10/tools/build-<family>.mjs <高度>`，高度取 `boards/canvas.json` 中该板的 `h`（Typography 5840、Icon 4280、Brand 4000、Actions 5220、Inputs 6540、Logos 3380），输出到 `boards/`（`build-logos2.mjs` 同时写 `logos2/`）。`build-brand.mjs` 需要三个参数（品牌标资产路径与两个 sha256，取现板内的值），画板里的 `/_blob/…` 路径只在画布上可解析。改契约后先重生成画板，再执行 `node scripts/contract-generate.mjs` 重生成包内生成物。

画布资产：品牌标副本 `/_blob/bcc8c9e2c6a0fce91c66756541d404e5`（服务器重序列化，XML 规范化后与 `apps/storybook/assets/tcrn-brand-mark.svg` 逐元素相等）；C9 的 digest 以仓库源文件为准。
