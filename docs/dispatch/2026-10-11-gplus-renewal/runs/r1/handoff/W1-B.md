# INIT-015 R1 · W1-B（SUB-010）交接

SUB-010 已完成，没有接续点。提交：8ae44e2（段模块、再导出、读源门改读新位置）、3d3e5b5（token-extension 接受 `--tcrn-pair-*` 局部变量）。本文件给 W2/W3 家族包、集成与验收用；问题清单在 `runs/r1/problems/W1-B.md`。

## 现在的结构

- `packages/ui-react/src/styles/{base,typography,icon,actions,inputs,brand}.css.ts`：各家族导出模板串段 `<family>CssNN`。
- `packages/ui-react/src/styles/index.ts`：按原级联顺序拼接全部段，导出 `tcrnComponentCss: string`。这是顺序唯一写定的地方。
- `packages/ui-react/src/components/Navigation/Navigation.tsx`：只再导出 `tcrnComponentCss`，公开导出与原有 import 不变。
- `scripts/lib/component-css-sources.mjs`：读源的门经它取样式文本。`componentCssSourcePaths()` 列出 `styles/` 下全部 .ts（含将来的 `styles/generated/`），`componentCssModules()` 按文件给出段文本，`componentCssText()` 给出全部段文本（不是级联顺序；要顺序就从 dist 导入）。没有任何段文本时直接抛错，门不会因为读空而变绿。

## 家族包怎么接

1. 只改自己的 `styles/<家族>.css.ts`。新规则写进已有段；生成段 import 进来后拼进某一段，例如 ``export const actionsCss03 = `…` + actionsPairCss;``。
2. 不新增 `<family>CssNN` 导出。`styles/index.ts` 只由 SUB-010 写，不在拼接列表里的段不会发出，`css-template-integrity-proof` 会把它报红。确需新落点时写进本包号的 handoff，交 W3-D 或主线程。
3. 段里的 CSS 注释不得含反引号，否则段会被提前截断（同一条门会报出段名）。
4. `styles/base.css.ts` 在 W2 冻结（跨包约定第 5 条）。
5. icon 家族目前没有规则，`iconCss01` 是空落点，位于 root 自定义属性之后、第一条 actions 规则之前。

归属规则：主语取最右复合选择器，没有 tcrn 类时向左取最近带 tcrn 类的复合；一个复合含两个组件类时归最后一个；块名等于家族名或以「家族名-」开头即归该家族，长名优先。所以 `.tcrn-lane-board__card .tcrn-text` 这类上下文规则归 typography，由 typography 包负责。

## 段与原 Navigation.tsx 行号对照

被拆开的规则，各片沿用原规则的行号区间，所以相邻段的区间会重叠。

- base：01 2133-2154，02 2155-2159，03 2181-2188，04 2241-2245，05 2251-2295，06 2307-2362，07 2363-2385，08 2502-2559，09 2563-2584，10 2585-2867，11 2953-3044，12 3049-3149，13 3177-3290，14 3294-3615，15 3620-3891，16 3895-3989，17 3994-4004，18 4008-4036，19 4037-4103，20 4107-4142，21 4147-4220，22 4226-4355，23 4367-4574，24 4424-4612，25–27 4575-4612，28 4575-4677，29 4693-4917，30 4988-5184，31 5250-5348，32 5380-5585，33 5595-5682，34 5695-5749，35 5753-5763，36 5788-5789，37 5794-5795，38 5797-5810，39 5814-5871
- typography：01 3150-3171，02 3291-3293，03 3616-3619，04 3892-3894，05 3990-3993，06 4005-4007，07 4037-4041，08 4104-4106，09 4143-4146，10 4221-4225，11 4356-4366，12 4680-4690
- actions：01 2155-2159，02 2160-2188，03 2189-2245，04 2246-2250，05 2363-2371，06–08 4575-4612
- inputs：01 2290-2306，02 2868-2952，03 3045-3048，04 4575-4612，05 4920-4985，06 5188-5248，07 5350-5378，08 5574-5593，09 5684-5693，10 5751，11 5764-5785，12 5790-5793，13 5796，14 5811-5813
- brand：01 2386-2501，02 2560-2562，03 2585-2596，04 4424-4574
- icon：01 为空落点

## 等价证据

比对对象是构建后 `packages/ui-react/dist/index.js` 导出的 `tcrnComponentCss`，迁移前后各取一份：

- 规范化规则序列（选择器列表拆成单个选择器，保留 at-rule 上下文，去掉空白与注释）974 = 974 条，逐条相同；用 Chromium CSSOM 重新解析两份字符串，974 = 974 条单选择器条目，逐条相同。
- 注释 79 = 79 条，顺序相同；page-template.tsx 依赖的三处注释标记各出现一次，顺序不变。
- 字节 124578 → 126188（UTF-8），差异只在拆开的 10 条选择器列表与 3 个 at-rule 块；同一套模块不做拆分时，构建结果与迁移前逐字节相同（sha256 f8200e9b9b0cce4b4ac642620030e252dfde7d65a994639d49f12241e135ac4b）。
- 仓内 36 个读 `tcrnComponentCss` 的测试与脚本里，1142 个含 tcrn 类的正则与字符串字面量对前后两份样式表的命中结果没有变化。

检查脚本与输出不入仓，路径见 W1-B 交回消息。

## 局部门（包树根执行）

typecheck、build、css-template-integrity、stamp-whitelist、shell-fidelity、token-extension、component-modifier、selection-grammar、`--filter @tcrn/ui-react test`（109/109）全绿；verify 影响表第 4 行要求的 dist-hygiene 自查通过（220 个产物都有源文件）。没有写回执。
