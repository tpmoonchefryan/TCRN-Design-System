# 附件 · P5 的前置包交回（P1 handoff 原文）

## P1 handoff（runs/r2/handoff/P1.md）

### 交回说明 · P1（INIT-015 R2 · 契约 token 输出）

分支 `claude/init015-r2-p1`，自集成分支 060789f 切出。三张单按包内顺序 SUB-048 → SUB-049 → SUB-047 完成，无接续点。

## 提交

| 提交 | 单 | 内容 |
| --- | --- | --- |
| e79092f | SUB-048（R2-1，O-10） | mono 字族栈补 Noto Sans SC；fonts-proof 要求 mono 中文回退；surface 注释改正；可选 mono 中文探针 |
| ed98557 | SUB-049（R2-2） | fonts-proof 单测夹具换四个 G+ 字族 token，补 token-families 三类变异 |
| 4a59144 | SUB-047（R2-3） | 浅色主题块选择器为 `:root, [data-tcrn-theme="light"]`；tokens-sync 与 C5 接受选择器列表；浏览器用例 |
| 本提交 | — | 本交回说明与 problems/P1.md |

## 各单判据

### SUB-048

- `--tcrn-type-family-mono` 为 `"IBM Plex Mono","Noto Sans SC",ui-monospace,Menlo,monospace`，值只来自 `contract/tokens.json`，依次 contract-generate、ui-tokens build、tokens-sync 写入 gplus-tokens.generated、tokens.css 与 storybook.css 的 token 块。
- fonts-proof 的 `TOKEN_FAMILY_STACKS` 给 mono 加 `fallback: "ui-zh-fallback"`。反证：临时去掉这一项，SUB-049 的「缺中文回退」变异用例在 mono 上转红；已还原。
- `packages/ui-tokens/src/index.test.ts` 的 mono 断言改为等于契约值，且以 `"IBM Plex Mono","Noto Sans SC",` 开头。
- contract:proof 6/6 绿，其中 generated-sources 绿。actions.pairs、inputs.pairs、typography.scale、matrices.generated 四个生成物只变 contract-sha256 头；gplus-tokens.generated 变头与 mono 值。
- O-10：surface 条目的 note 改为「焦点环间隙色，取 bg：包与画板的焦点环间隙都显示 bg 色，不随承载面（如纸上的 panel）切换」，值 `var(--bg)` 不变。
- 可选项已做：fonts-render-proof 的 fallback 腿加 mono-400、mono-500 两个探针（季度复盘写在 `--tcrn-type-family-mono` 下，必须全部由 Noto Sans SC web font 绘制，并核对解析出的栈以 IBM Plex Mono、Noto Sans SC 开头）。fonts:render 全绿。

### SUB-049

- 原第 58、72、151 行三条（已提交的字体树、构建产物副本、zh-CN 覆盖）转绿；`tests/fonts-proof.test.mjs` 16/16。
- 夹具 `openTokens` 改为四个 G+ 字族 token（ui、heading、serif、mono），值从 `contract/tokens.json` 读取，heading 取 serif 栈（与 ui-tokens 一致），mono 含 SUB-048 的回退；另有一条用例钉住三条栈的开头。
- 三类变异均判红：缺 token（四个逐一去掉）、缺中文回退（四个逐一去掉，含 mono）、fonts.css 有字族未被 token 点名（断言 token-families 只报这一条）。
- `distributable-*` 栈只留在专有字体用例里；该用例同时放一条开放的 distributable 栈作对照，断言它不被报。门的判定未改。
- 修后 tokens:proof 12 段逐段跑完，全绿；五个子门结果见 problems/P1.md 第 1、2 节。

### SUB-047

- contract-generate 把 `tcrnGplusThemeSelectors.light` 写成 `:root, [data-tcrn-theme="light"]`：取契约的浅色选择器 `:root`，再加夜间选择器所用属性的 light 值（从 `themes.night.selector` 派生，夜间选择器不是 `[属性="dark"]` 形式时生成器报错）。只有一个浅色块，没有复制第二份浅色值（取 A-6，不取 C-13）。
- `packages/ui-tokens/src/index.ts` 按该列表输出主题块，`tcrn-token-block: theme` 标记保留，dark 块排在主题无关块之后。`parseTokenCssBlocks` 把列表选择器规范成 `a, b` 形式；`compareTokenThemeBlocks` 按集合比较选择器列表，与顺序、空白无关。导出面未变（新增的两个辅助函数不导出）。
- `scripts/tokens-sync.mjs` 改为按 theme 标记定位 storybook.css 的 token 段，不再找字面 `:root {`，旧单 `:root` 与新列表都能识别。tokens.css 与 storybook.css 的 token 块由 tokens-sync 重写，未手改。
- checkC5：实测（改前探针、改后用例）已把列表当浅色侧，两个成员都归到基选择器 `:root` 的同一组，`:root` 入 base 桶、light 成员入 light 桶，浅色侧为两者之和。所以未改判定逻辑，只在 checkC5 里写明这条规则，并在 `tests/contract-static-proof.test.mjs` 补选择器列表的正反用例：列表与重排列表为绿；dark 缺名为 `C5.token-set`，dark 多名为 `C5.dark-only`，浅色多名为 `C5.token-set`。
- `tests/token-deprecation-notice.test.mjs` 补一条浏览器用例（写法同 GWT4）：页面根为 dark，内嵌 `[data-tcrn-theme="light"]` 子树，子树内再嵌 dark 子树；八个探针（bg、panel-2、ink、ink-3、acc、surface、焦点环、旧名 text-primary）分别解析为夜间值、浅色值、夜间值。反证：把 tokens.css 浅色块换回单 `:root`，该用例转红；已还原。
- doc-sample-style-proof 与其测试未改：它的 token 块判定按逗号拆选择器逐个匹配，不按字面 `:root` 取浅色块。
- ui-tokens index.test 增一条：重排加换行的列表仍是浅色块；单 `:root` 或多一个选择器的列表不是浅色块，比较判红。ui-tokens test 9/9。
- 复核第 18–20 步（storybook:visual-proof、geometry:measure、doc:sample-style，均在修后构建上跑）：
  - 五矩阵浅色格在夜间运行不再偏：typography、icon、brand、actions、logos 共 10 行在 light 与 dark 两轮的 contrast 都通过（逐格核对 44/28/10/116/10/10 格，零违规）。
  - dark:contrast 原 12 行红，现在只剩 inputs.A、inputs.B 两行，原因是 err-msg-l、err-msg-n 两格（6.20 对 6.69、6.27 对 6.88），light 轮完全相同，不是继承造成的，记入问题文件。
  - doc:sample-style 的不一致在 light 与 dark 两轮对称（各 36 + 71），没有只在 dark 轮出现的条目。
- ink-3 承载面复核结论见 problems/P1.md 第 3 节：契约矩阵与渲染页上，ink-3 正文都不落在 panel-2、bg-2、hover、wash 上，这一项不用交设计权威；另有一条承载面为 acc-bg 的附带观察，已记入问题文件。

## §3.4 回显项（本包按建议先做，Owner 可事后更正）

1. 第 9 项 O-10：surface 契约注释改为与焦点环行为一致（SUB-048），只改注释。
2. 浅色属性选择器由生成器从契约的夜间选择器派生；`contract/tokens.json` 的 `themes.light.selector` 仍为 `:root`，契约未改（判断改法点名的是 contract-generate，SUB-047 文件集不含 tokens.json）。
3. 选择器列表按集合比较（顺序、空白不计）；列表多出或缺少成员都不算浅色块。
4. checkC5 没有改判定逻辑（实测已正确），只加注释和用例；门的判定语义不变。
5. fonts-render-proof 加了可选的 mono 中文探针，取 IBM Plex Mono 的两个出货字重 400、500。
6. SUB-049 夹具的四个字族值从契约文件读取，不在测试里另抄一份，契约改了夹具跟着变。

## 局部门结果摘要（最后一次在 4a59144 上跑）

| 门 | 结果 |
| --- | --- |
| contract-generate、`--check` | 0；再跑无改动 |
| tokens-sync、`--check` | 0；两份文件已同步，C5 主题块 85 个同名属性 |
| `--filter @tcrn/ui-tokens build` / `test` | 0 / 9 项全过 |
| `run build` | 0 |
| tokens:proof 12 段 | 逐段全绿（明细见 problems/P1.md 第 1 节） |
| contract:proof | 0；单测 8/8，门 6/6 |
| contract:static | 单测 66/66；门红：C2 7 条、C5 1 条，均在包 CSS，不是本包改动（problems 第 4 节）；token 主题块的 C5 分组无发现 |
| fonts:render | 0；全部腿绿，含 mono 探针 |
| geometry:measure | 单测 60/60；门红：inputs-matrix contrast（err-msg 两格）与五个样板 rail，light、dark 两轮相同（problems 第 4 节） |
| storybook:visual-proof | 单测 16/16；门红：同上两类（problems 第 4 节） |
| doc:sample-style | 单测 6/6；门红：文档层 36 处（icons-motion 图标高 18px 对 16px）与 package-context 71 处，各在两轮出现（problems 第 4 节） |

三个浏览器门与 contract:static 这次都没有写 `docs/verification/**`，没有需要还原的回执或报告。

## 给后续包

- P2（接手 tokens.json 与生成物）：本包改了 tokens.json 与生成器，五个生成物头的 contract-sha256 已更新；P2 改契约后照常重生成。
- tokens-sync 从 `packages/ui-tokens/dist` 导入：改契约后的顺序是 contract-generate → `--filter @tcrn/ui-tokens build` → tokens-sync，不先 build 会显示「already in sync」而不重写。
- P5（接手 storybook.css）：token 段第一行现在是 `:root, [data-tcrn-theme="light"] {`；tokens-sync 按 `tcrn-token-block: theme` 标记定位，不要删这个标记。
- P10（接手 contract-static-proof 与其测试）：checkC5 只加了注释，测试新增一条 C5 选择器列表用例（在 C5 token-set 用例之后）。

## 接续点

无。

## 临时项

- 门的日志与 ink-3 复核脚本只写在会话 scratch 的 `tmp/r2-P1/`，交回前已移进 `trash/r2-P1/`；fonts-proof 单测的临时目录由用例的 `t.after` 清掉。
- 包树里的构建产物（各包 `dist/`、`apps/storybook/storybook-static/`）不进 Git，留给主线程合入后复用或随包树退役。
