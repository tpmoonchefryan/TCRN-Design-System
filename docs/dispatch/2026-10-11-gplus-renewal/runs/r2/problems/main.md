# INIT-015 R2 · 主线程问题清单

每条：现象、证据、处置。批末与各包问题清单一起合并处置。

**RM1 P4 改动钉住的两条 Navigation 断言（集成修复，交 P2）。**
现象：P4 按判断删掉壳内搜索的 focus-within 规则（SUB-059）、把快捷键文字改成 ink-2（SUB-062）后，`packages/ui-react/src/components/Navigation/Navigation.test.tsx` 约 533 行与 753 行的两条断言仍钉着旧规则，`--filter @tcrn/ui-react test` 155/157。该文件属 P3 文件集（P3 在跑，自 060789f 切出，不含 P4 改动），不在 P4 文件集内。
证据：`runs/r2/problems/P4.md` 第 1 条（含逐字改法）；P4 合入集成分支 e915306。
处置：P3 合入后集成分支上这两条为已知红。改法作为「集成修复」项写进 P2 摘录的第一项（P2 主力档，须先合入 P1、P3、P4；P2 运行期间没有别的包持有该文件），不单独为两行断言派代理；P2 之前切出且跑 ui-react test 的包（P10）在摘录里注明这两条为已知红。拆分的教训：Inputs 规则改动要把 Navigation.test.tsx 里针对 Inputs 的断言一并列进文件集（R2 判断时考虑写进 lessons）。

**RM2 docs/contract/README.md 的 package-css 描述随 SUB-053 过时（交 P11）。**
现象：SUB-053 之后 contract-proof 的 package-css 读整张表的状态规则（clauses.md C2 定义并上 pairs.json 状态条件），`docs/contract/README.md` 第 47 行仍写只查「pairs.json 目标基类的状态规则」。该文件不在任何 R2 包文件集。
证据：`runs/r2/problems/P3.md` P2（含建议正文）；P3 合入集成分支 6225880。
处置：作为附加项写进 P11 摘录（P11 为文档与清理包，运行时没有别的包持有该文件），按 P3 给的正文改。

**RM3 P3 的两处自定口径（交验收）。** P3 问题 P3：package-css 的「全部状态规则」取 clauses.md C2 定义（data-* 里只有 `data-tcrn-preview-state` 算状态条件），base.css.ts 两条由别的 data-* 限定、含颜色字面量的壳层规则不计入；P3 问题 P4：SUB-057 按判断 R2-8 改法把默认隐藏 moon 的 `[data-theme-icon="dark"]` 也删去（拆分文字只写 html 级两条）。均交 R2 验收判可否，不另派。

**RM4 子代理流程瑕疵。** P3 一条只读探索命令用了 `cd` 进 scratch（未弹框、未改文件）；P7 起派工提示加「只读命令也不 cd」。
