# 交回说明 · W1-E

## 已交付

- SUB-036（f8cbe4e）：契约静态门 `scripts/contract-static-proof.mjs`、规则解析库 `scripts/lib/css-rules.mjs`（自写，无依赖）、测试 `tests/contract-static-proof.test.mjs`（41 条：解析器、夹具全绿、STORY-132 GWT1–3、每条规则一条转红变异、豁免与登记校验、仓内契约文件一致性），以及 `docs/contract/` 四份文件：`clauses.md`（C1–C17 原文与各条落点）、`families.json`（16 家族与根类）、`exemptions.json`（第二至五批 11 个家族，七条款，引用 INIT-015 不授权段与 P4）、`roles.json`（C7 单行角色、C8 工具栏）。
- 现仓结果（build 之后）：C2 红 9、C5 红 1、C13 红 160；C6、C7、C8、C11 绿。逐条见 `problems/W1-E.md` P1–P5。

## 给 W4-B（SUB-037）

- **转绿清单。** STORY-132 GWT4「现仓全绿」要清的就是 problems/W1-E.md 的 P1–P5：链接与 MultiSelect 选项的状态规则改对表（P1、P2，P1 的 G+ 段是生成物）；`inputs.css.ts` 里壳层上下文压 SearchInput 的特异性（P3）；主题图标的浅色声明（P4）；158 个文档层类改 `tcrn-doc-` 或删除，两个第一批包外类（`tcrn-input--short`、`tcrn-search-input--compact`）进包或换用已有修饰类（P5）。
- **豁免机制。** `exemptions.json` 每条恰有 `family`、`classes`、`selectors` 之一，`clauses` 只收 C2/C5/C6/C7/C8/C11/C13，`ruling` 必填。第一批家族、其类、选中其类的选择器都不能登记，登记了门判红。没有 tcrn-* 类的选择器（如 P4）只能用 `selectors` 精确登记。报告的 `scope.unusedExemptions` 列出本次没命中的条目（现为 identity）。
- **story 层留给你的部分。** C7 的 title 属性与容器矩阵下不换行、C8 的量测让步（让步项到 min-width 后其余不被压）、C11 的元素嵌套深度、四级语义同形、通用件拼壳、渲染文本里的表情字符（拆分 P4 的 LockHint「🔒」在这里）。C13 已由本门经 doc-shell-class-proof 的差集静态覆盖，story 层不必重算。
- **可复用的导出。** `evaluateContract({ packageCss, tokensCss, families, exemptions, roles, pairs, outOfPackage })` 是纯函数；`runContractStaticProof({ root })` 读 dist 与契约文件；`checkC2/C5/C6/C7/C8/C11/C13`、`selectorFacts`、`buildScope`、`validateExemptions` 可单独调用。解析库导出 `parseCss`、`compounds`、`parseCompound`、`specificity`、`selectorClasses`（`targetOnly` 去掉 `:not()`、`:has()` 里的类）、`shadowLayers`、`colourLiterals`、`emojiIn`。story 层若与本门共用家族归属，读同一份 `families.json`，按 `blockOf`（去掉 `__` 与 `--`）归类。
- **接入 verify。** 需要改 `package.json`（不在本包文件集）：脚本 `"contract:static": "node --test tests/contract-static-proof.test.mjs && node scripts/contract-static-proof.mjs"`，接在 verify 的 `doc-shell:proof` 之后（C13 需要构建后的静态文档；差集算不出时门判红 `C13.input-missing`，不跳过）。
- **口径可改处。** problems/W1-E.md P9 列了本包自定的判定口径（透明 outline 允许项、无变体时的 (0,2,0)、左边条 2px 阈值、状态类 ARIA 列表等），都写在 `docs/contract/clauses.md`；要改时同步改门里的常量与测试的允许项用例。

## 命令

在包树根：`corepack pnpm@10.12.1 -C <树> run build`，然后 `corepack pnpm@10.12.1 -C <树> exec node --test tests/contract-static-proof.test.mjs` 与 `corepack pnpm@10.12.1 -C <树> exec node scripts/contract-static-proof.mjs [--details] [--report <path>]`。门不写回执，也不写仓内文件（`--report` 只写到给定路径）。
