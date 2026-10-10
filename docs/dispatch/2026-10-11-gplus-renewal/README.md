# INIT-015 派工载荷 · DS 焕新（G+ 底盘、第一批五家族、四枚产品标、Storybook 只渲染包）

本目录是 `TCRN-DS-INIT-015` 的执行载荷：启动文件、键号索引与收口位置。链上 scope 是任务权威，这里不是第二份 scope。

## 启动

实施对话的第一条消息：`读 docs/dispatch/2026-10-11-gplus-renewal/START-INIT-015.md 并按它执行`。

## 键号

| 单 | 键 | 内容 |
| --- | --- | --- |
| Initiative | TCRN-DS-INIT-015 | DS 焕新，Storybook 只渲染包 |
| Epic | TCRN-DS-EPIC-039 | Token 底盘与字体资源，状态对表作为数据 |
| Epic | TCRN-DS-EPIC-040 | 第一批五家族 23 件进包 |
| Epic | TCRN-DS-EPIC-041 | Storybook 重建：只渲染包，矩阵 story |
| Epic | TCRN-DS-EPIC-042 | 门：八项测量与契约 C1–C17 |
| Epic | TCRN-DS-EPIC-043 | 4.0.0 候选：版本面与迁移说明 |
| Story | TCRN-DS-STORY-120 · 121 · 122 | EPIC-039：色彩与轮廓 token；字体与形状动效 token、字体自托管；契约数据与生成脚本 |
| Story | TCRN-DS-STORY-123 · 124 · 125 · 126 · 127 | EPIC-040：Typography；Icon 37 件；Actions；Inputs；Brand 四枚产品标 |
| Story | TCRN-DS-STORY-128 · 129 · 130 | EPIC-041：文档层清零；矩阵 story 与壳层样板；画布到 story 的映射 |
| Story | TCRN-DS-STORY-131 · 132 · 133 | EPIC-042：八项 DOM 测量门；契约静态门；接入 verify 与 CI |
| Story | TCRN-DS-STORY-134 | EPIC-043：版本面、CHANGELOG、迁移说明、目视验收清单 |
| 纪要 | TCRN-DS-MIN-20261011-GPLUS-RENEWAL | Owner 裁定 D1 至 D8 |

## 设计数据

`docs/design/gplus-2026-10/`：画板源（`boards/*.dc.html`，与画布版本 33 同内容）、生成器与数据（`tools/*.mjs`）、八项测量脚本（`measure.js`）、四枚产品标（`logos2/*.svg`）。见该目录 README。

## 停点

推送 main、打 tag、发版、部署、Owner 目视验收都不在实施对话的授权内；收口文件写到本目录 `closeout.md`，目视验收清单写到 `owner-acceptance.md`。
