# 附件 · P2 的前置包交回（P1、P3、P4 handoff 原文）

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

## P3 handoff（runs/r2/handoff/P3.md）

### 交回说明 · P3（INIT-015 R2）· base 段与 contract-proof

- 分支 `claude/init015-r2-p3`，从集成分支 060789f 切出。两张 Subtask 都已完成，没有接续点。
- 改动的文件都在本包文件集内：`packages/ui-react/src/styles/base.css.ts`、`scripts/contract-proof.mjs`、`tests/contract-proof.test.mjs`、`packages/ui-react/src/components/Navigation/Navigation.test.tsx`；另有本文件与 `problems/P3.md`。

## 1. 提交

| 提交 | 标题 |
| --- | --- |
| 14b3247 | fix(contract-proof): read every state rule of the sheet; the locale trigger's states use tokens (TCRN-DS-SUB-053, R2-7) |
| 6976d2f | fix(navigation): the theme toggle shows its icon by data-current-theme, not by a page-level theme (TCRN-DS-SUB-057, R2-8) |
| 本提交 | docs(dispatch): record the P3 handoff and problems (TCRN-DS-SUB-053, TCRN-DS-SUB-057) |

## 2. 判据

### SUB-053 · contract-proof 字面量扫描扩到全部状态规则，locale 触发器状态改用 token（R2-7）

- package-css 的扫描范围从 pairs.json 目标基类上的 38 条状态规则，扩到整张表的 94 条（其中 38 条在目标基类上）。状态规则的口径取 `docs/contract/clauses.md` C2 的定义，经 contract-static 的 `selectorFacts().hasState` 读取：状态伪类、状态类 ARIA 属性、`data-tcrn-preview-state`、`readonly`、`disabled`，算 `:where()`/`:is()` 里的条件，不算 `:not()`/`:has()` 里的。再并上 pairs.json 的状态条件，保证旧的 38 条仍在扫描范围内。放行项只保留「颜色只有 transparent 的 outline」，共 5 处。新增导出 `isSheetStateSelector`。
- 扩范围前后对照：用改动前的 dist 跑新门，package-css 红 2 条，都是 locale 触发器（color-mix 底色与 rgba 阴影），即 R1 的 A-4。改 `base.css.ts` 并重建后转绿。扩范围后没有命中其它家族的状态规则。口径的取舍见 `problems/P3.md` P3。
- `base.css.ts`：`.tcrn-shell-locale-menu__trigger:hover` 与 `[aria-expanded="true"]` 改为 `border-color: var(--tcrn-color-line-ctl)`、`background: var(--tcrn-color-hover)`、`color: var(--tcrn-color-ink)`、`box-shadow: var(--tcrn-shadow-s1)`。几何未动，该规则里不再有弃用名。
- `tests/contract-proof.test.mjs` 新增两条用例：
  - 整表状态规则的单元断言；
  - 非 pairs 目标的变异：把 R1 的 rgba 阴影放回 locale 触发器，再分别给伪类、ARIA、`data-tcrn-preview-state` 三条非目标状态规则注入字面量，全部判红；主题块、非状态规则、`aria-hidden`、只含 transparent 的 outline 都不判红。

  另外在 the tree 用例里加了一条断言：package-css 读到的状态规则数，要多于目标基类上的条数。
- 状态：达成。

### SUB-057 · 主题钮图标显隐改由 data-current-theme 控制，去掉 html 级主题显隐规则（R2-8）

- `base.css.ts` 约 602–612 行：三条显隐规则里的 `[data-theme-icon]` 选择器全部删去（两条挂在 `html[data-tcrn-theme="dark"]` 上，另一条是默认隐藏 moon 的 `[data-theme-icon="dark"]`，原因见 `problems/P3.md` P4），侧栏图标的三条保留。另加一段 CSS 注释，说明主题钮图标由 `data-current-theme` 透明度规则决定。
- contract:static 的 C5 降为 0（改前有 1 条 C5.dark-only，`[data-theme-icon="light"]`）。
- `Navigation.test.tsx`：
  - 主题钮相关的原有用例（controller bundle、semantic callbacks、side-nav shell）没有改动，全部通过。这些用例里没有依赖 html 级显隐规则的断言，所以不需要改写。
  - 新增一条用例，先断言包 CSS 里没有规则用 display 显隐主题图标，也没有把它挂在 `data-tcrn-theme` 上；再在 jsdom 里注入 `tcrnComponentCss` 检查：块级 `data-tcrn-theme="dark"` 里的主题钮只显示 moon（当前主题），日间块只显示 sun；点击后图标跟着 `data-current-theme` 切换；html 级夜间不改变两块各自的图标。
  - 同一判定放在改前的 CSS 上，结果是两枚图标都不可见，与 R1 的现象一致。
- 夜间样板块复核（验证脚本，未入仓）：构建后的静态页里有 3 页、11 个主题钮位于块级夜间主题中，当前主题都是 dark，现在都只显示 moon。
- 状态：达成。

## 3. §3.4 第 6 项回显

R2-8 主题钮图标的显隐改由 `data-current-theme` 控制，取 C-9，不取 B-3：

- 删去 html 级和默认的 `[data-theme-icon]` 显隐规则，不补「无主题 display」；
- 显隐只由 `.tcrn-shell-theme-toggle[data-current-theme]` 的透明度规则决定，块级主题与页级主题同样生效。

Owner 可事后更正。

## 4. 局部门（包头 6976d2f；日志在会话 scratch 的 `tmp/r2-P3`，未入仓）

| 门 | 结果 |
| --- | --- |
| `--filter @tcrn/ui-react build` | 通过 |
| `--filter @tcrn/ui-react test` | 158/158 通过（基点 157，本包新增 1 条） |
| `run build` | 通过 |
| `run contract:proof` | 测试 10/10；脚本 6/6 绿；package-css 读到的 94 条状态规则都没有颜色字面量 |
| `run contract:static` | 测试 65/65；脚本退出 1：C2 红 7 条（与基点相同，不属于本包家族，见 `problems/P3.md` P1）；C5 为 0，绿；C6、C7、C8、C11、C13 绿 |

- C7、C8、C11、C13 读的是构建后的静态 Storybook。基点上没有先构建时，这几项报 story-input-missing（红）；`run build` 之后转绿。
- 这些门没有写 `docs/verification/**`，工作树也没有新增未跟踪文件，所以不需要还原。

## 5. 给后续包与主线程

- `base.css.ts` 按包表的 P3 → P2 顺序交给 P2。本包只改了两处：baseCss05（locale 触发器）与 baseCss11（显隐规则）。
- `contract-proof.mjs` 现在从 `contract-static-proof.mjs` 导入 `selectorFacts`，两道门的状态规则用同一口径。以后改 contract-static 的状态条件列表，package-css 的扫描范围会跟着变。仓内已有同类先例：storybook-visual-proof 读 geometry-proof，fonts-render-proof 读 fonts-proof。
- `docs/contract/README.md` 对 package-css 的描述已经过时（`problems/P3.md` P2）。它不在本包文件集，本包未改。

## 6. 接续点

无。两张 Subtask 都已完成，工作树干净。

## 7. 临时项与过程说明

- 已清理：探查脚本及其输出已移入会话 scratch 的 `trash/r2-P3`。
- 保留：会话 scratch 的 `tmp/r2-P3` 里有门日志和夜间样板块的验证脚本，约 150 KB，留给判断核对，R2 验收后可以清理。
- 包树里的 dist 与 storybook-static 是跑门时重建的产物，git 已忽略，随包树由主线程处置。
- 过程偏差：有一条只读探查命令用了 cd（进入会话 scratch），违反了「命令里不 cd」。它没有触发确认框，也没有改动文件；之后的命令都用绝对路径。

## P4 handoff（runs/r2/handoff/P4.md）

### 交回说明 · P4（INIT-015 R2，Inputs 收尾）

分支 `claude/init015-r2-p4`，自集成分支 060789f 切出。只改了本包文件集：`packages/ui-react/src/styles/inputs.css.ts`、`packages/ui-react/src/components/Form/Form.test.tsx`、`apps/storybook/src/smoke.test.ts`。pairs.json、tokens.json、生成物、门脚本都没动。

## 提交

| 提交 | Subtask | 来源 | 内容 |
| --- | --- | --- | --- |
| 696f516 | SUB-059 | R2-9 | 删去壳内搜索包裹层的 focus-within 状态规则（0,3,0）；MultiSelect 选项在本类上声明 fill-d/h/s 与生效对，两条状态规则只切换 |
| fe6a4bb | SUB-060 | R2-10 | 删去 `.tcrn-field--error` 的整块洗底与 outline-color；`.tcrn-field__error` 改读 `--tcrn-color-bad`；两份测试同步 |
| 5e799a6 | SUB-061 | R2-11 | MultiSelect 触发器 30px 末端区，caret 按 Select 图标定位；下拉容器改 flex，触发器与 Select 处于同一布局语境 |
| 48399ae | SUB-062 | R2-12 | 搜索快捷键文字 ink-3 改 ink-2 |
| 本提交 | — | — | 本交回说明与 problems/P4.md |

## 判据状态

- **SUB-059：达成。** contract:static 的 C2 从 7 条降到 3 条，其中 inputs 从 4 条降到 0 条，没有新增。消掉的 4 条是：壳内搜索规则 C2.specificity；选项 hover 的 C2.specificity 与 C2.colour；选项 selected 的 C2.colour。剩下 3 条都在 typography（问题 #2）。壳内搜索规则按判断给出的第一种改法直接删除：包裹层在哪个语境都不作画，没有东西要清。`inputsCss01` 留空，仍按原位拼接，`styles/index.ts` 不动。没有在 pairs.json 新定元组名。两处实施口径请留意：
  - 选项的默认字重原来经 `font: inherit` 继承，现在由生效对 `--tcrn-pair-weight: 400` 给出，选中时切到 600，写法同 Actions 生成段的 weight。full-surface 实测选项 fontWeight 仍是 400。
  - hover 规则排在 selected 之后，所以悬停在已选项上显示 hover 底、字重仍是 600。原来 hover 规则是 (0,3,0)，同样压过 selected；画板 `.opt.is-hover` 也排在 `[aria-selected]` 之后。
  - 副作用：Navigation.test.tsx:533 断言旧规则必须存在，因此转红。该文件不在本包文件集内（问题 #1）。
- **SUB-060：达成。** geometry:measure 的 light 轮里，inputs-matrix 的 err-msg-l 为 6.69（期望 6.69，差 0），err-msg-n 为 6.88（期望 6.88，差 0）；R1 时分别是 6.20、6.27。dark 轮的 err-msg-l 为 6.88，期望 6.69，这与五个家族里所有浅色格在 dark 轮的偏差同源，不是本单造成的（问题 #4）；dark 轮的 err-msg-n 为 6.88，与期望相等。强制色块里 `.tcrn-field--error` 的 Highlight outline 保留。`.tcrn-field` 基础规则（透明底、透明 outline、150ms 过渡）不在改法范围内，smoke 也断言了它，所以没动。
- **SUB-061：达成，按判据 public-popup-family-dark 一例仍红。** minHeight 的推断已用 Chromium 探针在本树构建的样式上确认：块级子元素 min-height:auto 时，getComputedStyle 报 `0px`；flex 项与 grid 项报 `auto`；Select 在 inline-flex 包裹层里报 `auto`。修法是让 `.tcrn-multi-select-dropdown` 成为 flex 容器（加 `align-items:center`），触发器因此和 Select 一样是 flex 项，门的比对字段没改。探针显示：触发器与参照 Select 在门比对的全部字段上一致（paddingRight 30px、minHeight auto）；caret 与 chevron 都距末端 8px、距顶 9px。full-surface 里 closed-select-family-empty 转绿；public-popup-family-dark 仍红，属预期，要等 SUB-083（问题 #3）。
- **SUB-062：按 token 计算达成**（下节）。axe 复核留给 R2 末次 verify 的第 30 步。

## §3.4 回显

- **第 2 项（R2-10，P29 口径更正）：** 已按建议先做。`.tcrn-field--error` 的整块洗底（state-blocked-bg 以 62% color-mix）和 outline-color 一并删去，错误文字改读 `--tcrn-color-bad`。偏差来自洗底：只换名不会转绿，因为 state-blocked 本来就解析到 bad。实测 err-msg-l 6.69、err-msg-n 6.88，均回到矩阵期望。Owner 不接受删除洗底时，恢复这两条声明，并把 126-GWT5 的 err-msg 两格移到第五批。
- **第 3 项（R2-12）：** Inputs 板本身画的是 ink-3（板里 `.sw>kbd` 的 `color:var(--ink-3)`）。已按 C1 文字 4.5 阈值改为 ink-2，在此回显给 Owner。夜间 ink-3 在 #282724、#272724 上为 3.89、3.90，低于 4.5；ink-2 为 6.13、6.15。另外，浅色 ink-3 在 wash 叠 bg（#e2e1dd）上为 4.31，同样低于 4.5，ink-2 为 6.56。Owner 若要保留板面的 ink-3，需要改 token 值或改承载底，这属于契约修订，本包未做。

## SUB-062 的 token 对比计算

按 WCAG 2.x 计算：sRGB 分量 c/255 线性化（≤0.04045 时除以 12.92，否则取 ((c+0.055)/1.055)^2.4），L = 0.2126R + 0.7152G + 0.0722B，对比 = (L亮 + 0.05) / (L暗 + 0.05)。token 值取自 `contract/tokens.json`：夜间 ink-2 #a9a69c，ink-3 #85827a，panel #191916，bg #121210，wash rgba(235,232,223,.07)。夜间 wash 叠 panel 的结果正是 #282724，与 axe 报的第一种底一致。

| 主题 | 文字 | 底 | 对比 |
| --- | --- | --- | --- |
| 夜间 | ink-2 #a9a69c | #282724 | **6.13** |
| 夜间 | ink-2 #a9a69c | #272724 | **6.15** |
| 夜间 | ink-3 #85827a（原值） | #282724 / #272724 | 3.89 / 3.90（与 axe 一致，可作算法校验） |
| 夜间 | ink-2 | wash 叠 bg #21211e | 6.63 |
| 夜间 | ink-2 | panel #191916（获焦底） | 7.23 |
| 浅色 | ink-2 #4f4c43 | wash 叠 panel #f1f1f1 / wash 叠 bg #e2e1dd / panel #ffffff | 7.60 / 6.56 / 8.58 |

两种夜间底上都不低于 4.5。

## 局部门结果

| 门 | 结果 |
| --- | --- |
| `--filter @tcrn/ui-react build` | 通过 |
| `--filter @tcrn/ui-react test` | 157 条，155 过、2 红。两红都在 Navigation.test.tsx（533、753 行），断言的是本包按判断改掉的两条旧规则；该文件在本包文件集外（问题 #1）。Form.test.tsx 全过 |
| `run build` | 通过 |
| `--filter @tcrn/design-system-storybook test` | 9/9 通过（含 smoke） |
| `run contract:static` | 单测 65/65；门本身红：C2 3 条、C5 1 条，都不属 Inputs（问题 #2）。inputs C2 从 4 降到 0；C6、C7、C8、C11、C13 绿（storybook 构建之后） |
| `run full-surface:proof` | 单测 11/11。浏览器段全部执行：MultiSelect 断言排在最后，此前各段均通过；MultiSelect 只有 public-popup-family-dark 红（预期，问题 #3） |
| `run geometry:measure` | 单测 60/60。10 个 story × 2 主题：light 轮 5 个矩阵全绿（含 err-msg 两格）；dark 轮 5 个矩阵 contrast 红，红格是浅色格（问题 #4）；5 个样板在两种主题下 rail 都红（问题 #5） |

没有门写入 `docs/verification/**`：geometry:measure 未带 `--write-report`，contract:static 未带 `--report`。每次跑门后工作树都干净，无需还原，也没有文件移进 trash。

## 接续点

无，四张 Subtask 都已完成。合入时注意：Form.test.tsx 按 P4 → P2、smoke.test.ts 按 P4 → P6 的顺序交接；Navigation.test.tsx 的两处断言要在合入后由其持有方或集成步改（问题 #1 写了逐字改法）。

## 临时项

- 会话 scratch 的 `tmp/r2-P4/`：各门日志、探针与计算脚本（minheight-probe.mjs、contrast.mjs、c2.mjs、geo*.mjs），约 412 KB。保留作本交回的原始证据，主线程用完 R2 判断后即可清理。
- 包树内各包的 `dist/`、`apps/storybook/storybook-static/` 是 gitignore 的可重建构建物，留给集成和后续门复用。
- 会话 scratch 的 `trash/r2-P4/`：空。

