# G+ 焕新设计数据（2026-10）

画布 https://claude.ai/artifact/DuPjVjwSK6Wb9qthW4BwFz（设计正本页，版本 33）的仓内副本：画布是草稿与确认面，这里的文件是实现、story 与门的数据来源（Owner 2026-10-11 裁定 D6）。

| 目录 / 文件 | 内容 | 用途 |
| --- | --- | --- |
| `boards/V2-GPlus.dc.html` | G+ 底盘：浅色与夜间两屏、十种手法、kv 表 | `.gp` 与 `.gp.night` 两个 CSS 块是 token 字面真值 |
| `boards/V2-GPlus-Compositions.dc.html` | 构图一与构图三 | 壳层样板的几何（侧栏 220、纸离边 12、顶栏 52、内容 1040） |
| `boards/V2-B1-*.dc.html` | 第一批五板：Typography、Icon、Brand、Actions、Inputs | 每板 A 全态、B 状态矩阵（每格对比度）、C 动效、D 构图一样板、E 消费方契约、F 与 G+ 的 token 差异 |
| `boards/V2-B2-Logos-Draft.dc.html` | 四枚产品标（Owner 通过） | 48 格构法、两色、贴片、锁定块、SVG 源、五语标语 |
| `tools/lib.mjs` | `T`（浅色与夜间 token 对象，键集相同）、`ICONS`（37 件 20 格路径）、板面 CSS、构图一壳层、矩阵表生成 | STORY-122 抽 `contract/tokens.json`、`icons.json` 的来源 |
| `tools/build-actions.mjs` | `pairs()`：四变体 × 七状态的 fill/ink 对 | `contract/pairs.json` 的来源；状态对机制的 CSS 写法在其 `css` 字符串里 |
| `tools/build-inputs.mjs` | 文本类、勾选类、开关类三张对表的 CSS | 同上 |
| `tools/build-logos2.mjs` | `MARKS`（四枚标的 SVG body）与 `PAL`（两色） | `contract/marks.json` 与 `logos2/` 的来源 |
| `measure.js` | 八项 DOM 测量：溢出、单行行框、阴影模糊、引导列、行对齐、mark 中性、每格对比度、控件高度；另有重叠检查 | STORY-131 移植为门 |
| `logos2/*.svg` | 四枚产品标 color 与 mono 版，viewBox 0 0 48 48 | STORY-127 的 digest 对象 |

重新生成画板：`node tools/build-<family>.mjs <高度>`，输出到 `boards/`。`build-brand.mjs` 需要三个参数（品牌标资产路径与两个 sha256），画板里的 `/_blob/…` 路径只在画布上可解析。

画布资产：品牌标副本 `/_blob/bcc8c9e2c6a0fce91c66756541d404e5`（服务器重序列化，XML 规范化后与 `apps/storybook/assets/tcrn-brand-mark.svg` 逐元素相等）；C9 的 digest 以仓库源文件为准。
