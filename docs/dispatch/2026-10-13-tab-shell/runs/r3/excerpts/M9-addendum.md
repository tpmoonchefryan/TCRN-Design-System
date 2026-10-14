# M9 附录（主线程补派，R3）

M7（已合入）交回第 9 节列了三处要由后续持有者对齐的期望，其中两处在你的文件集里，另一处的文件 R3 无人持有。按 R3 约定「改动会让门的期望过期的包，同包对齐那个门的期望」，三处都交给你，和 SUB-208 放在同一个包里做（只改这三处，不放宽任何检查）：

1. **`apps/storybook/src/smoke.test.ts` 的静态期望**（M7 问题 1）：文档壳改为水合真件后，静态页不再含隐藏菜单、语言下拉与静态搜索脚本；按 M7 交回第 5 节的新接口（`[data-doc-shell-root][data-shell-hydrate]`、`script[data-doc-shell-config]`、浮层只在打开时存在、`tcrnDocShellLayers.setMenu(true)`）改期望。这个文件本来就归 SUB-208。
2. **`apps/storybook/src/contract-stories/story-content.tsx` 的 `.tcrn-doc-package-nav-proof` 样本块**（第 2270 行起，M7 问题 2、SUB-179 第③条的剩余）：三条分段导航各传不同 `label`，让 axe `landmark-unique` 归 0。同一文件里补一个带禁用原因的 NavItem 样本（M5 问题 1），让 browser-proof 的禁用项读回有样本可读；只改 story 内容，不改包件 API。
3. **`scripts/package-contract-manifest.mjs` 第 266–285 行的两条源码规则**（M7 问题 4）：它们现在只靠 `alpha-styles.ts` 与 `smoke.test.ts` 里的旧字面维持；你对齐第 1 处后 `internal-alpha:contracts` 会红。把这两条规则改为检查顶带文档壳的现行源码标记（与 K3 改契约清单的口径一致），这个文件本轮归你。

局部门加跑 `corepack pnpm@10.12.1 -C <包树> run internal-alpha:contracts` 与 `run internal-alpha:browser-proof`，在交回物里写这三处改前改后的读数（smoke.test 通过数、axe landmark-unique 条数、禁用项读回样本数、contracts 退出码）。
