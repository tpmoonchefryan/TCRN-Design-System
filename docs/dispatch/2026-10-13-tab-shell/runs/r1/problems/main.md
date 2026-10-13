# INIT-016 R1 · 主线程问题清单

主线程在调度、合入与跨包协调中记下的事实；见红只记，批末由判断一次处置。同一根因算一条。

| # | 类别 | 现象与证据 | 处置或建议 | 涉及 |
| --- | --- | --- | --- | --- |
| M1 | 库门（Owner） | 开工 `gates-config-list` 读数 0 个门（version 1889），引擎要求覆盖 Story 的已启用必需门才允许转 done。INIT-015 的 13 张与本批 16 张都卡在这里。 | START「库门（S-1）」节的字段由 Owner 在 Atelier 声明；实施侧不声明、不绕过。每轮开始重读。 | 全部 Story |
| M2 | 分包登记处 | 拆分把 `packages/ui-react/src/styles/index.ts` 按波次归一个包，但每个新样式段都要在这里登记（css-template-integrity 对未登记段判红）。P1b 在 W2（该文件无人持有）越出文件集加了两行登记；W3 的 P1c 与 P5 都要登记新段，合入时冲突由后合入的 P1c 把集成分支合进包树解决（9872a16），顺序 `shellCss04`、`shellCss05`、`shellIntroCss01`；之后 P7 的 `shellSheetCss01` 排在最后。 | 已解，无残留。下一轮拆分把「新段登记」写进约定：登记行随段归属的包走，不按波次独占。 | P1b、P1c、P5、P7 |
| M3 | 跨包既有红 | P1a 的 `ShellBrandButton.test.tsx` 断言夜间 TMS 后缀对比度 ≥ 4.5；P4 按 D7 把后缀改回两主题同色后读数 3.07，`--filter @tcrn/ui-react test` 自 P4 合入起恒有这一条红。之后所有包把它当既有红记录，未修。 | 返工：按 D7 把这条断言改成与 token-contrast 的 pending 豁免一致（夜间记已知待裁，不断言 ≥ 4.5）。 | P1a、P4 |
| M4 | 跨包消息 | 中途给在跑的包发过五次事实澄清（都在其文件集内或要求交回前合入集成分支）：P1b（P3 列的壳件钩子）、P1c（P5 已合入，解登记冲突）、P7（P6 的必填 `pageHeader`）、P12（P8 改了面包屑与 Tabs 的 DOM）、P13 与 P14（P12：「在纸内」限定到被量壳自己的纸）。 | 判断时核对这几处是否落实；没有扩大任何包的 Subtask 范围。 | P1b、P1c、P7、P12、P13、P14 |
| M5 | 滚动补位 | P12（W7）在 P8（W6）在跑时起跑：前置包 P3、P9 已合入，与在跑包文件集不相交（`tools/eligible-016.mjs` 判定）。 | 无冲突；记录调度偏离波次的一处。 | P12 |
| M6 | Owner 设计待定 | 包交回里需要设计会话或 Owner 定的项：完整菜单里带子项的行展开后级联列的位置（1440 宽同开两列超出视口 12，P1b 问题 5）；Sheet 夜间遮罩色与 Sheet 里下一级怎么开（P7）；AOS 在 logos2 没有标，三处 AOS story 暂传 `design-system`（P1c）；窄屏视口（P12）。 | 收口时列进待 Owner 事项，附各包建议。 | P1b、P1c、P7、P12 |
| M7 | 成品板发布 | P2（Icon 两板名册行）与 P11（Typography、Icon、Actions、Inputs 四块成品板的 D 段与对应 V2-B1 草稿板、heights.json）改了仓内板文件；`visual-standard/canvas.json` 的板高与 y 未随之改（P11 问题 2）。 | 收口列出改过的板文件清单交设计会话发布；canvas.json 进下一轮或交设计会话。 | P2、P11 |
