# INIT-015 回路状态（实施对话的接续点）

每次唤醒先读本文件，再按「下一步」接续。只记事实与接续点，不记进度叙述。

## 固定绑定

- 工作树：`/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init015-gplus-renewal`，分支 `claude/init015-gplus-renewal`，自 DS 主检出 main `b321d10` 切出。
- 库：`/Users/ryanlan/Code/TCRN Platform/TCRN-Design-System/.ether`（主检出里；工作树里没有库）。引擎 `node ~/.einzbern/engine/einzbern.mjs`，`--actor agent:claude-opus-5-5`，项目 `project:ba2f70f9503ac43c3ec6aa36`。
- INIT-015 = `work:e5b3880c835fd77f1c14b81b`（active）。Story 120–134 起始 planned（planned 不能直接 active，先 ready）。Incident 在引擎 2.x 已退役：返工开新 Subtask，或开带 fixes 关系的 Story。
- Subtask 键号：`TCRN-DS-SUB-001` 起（本库此前没有 Subtask）。
- 档位（START「模型与子代理」节，DS main 5814699；本库 `minutes:ef150905e3fe968a4e1d7263` 取代 `minutes:8df2694657c74772e8b23c17` 的 D2）：拆分、实施包、孤立修复用 `einzbern-economy`（claude-opus-5-5 low）；批末验收、问题清单判断、集成冲突、改共享契约的返工、升档后的返工用 `einzbern-main`（claude-opus-5-5 max）；旗舰不调。必须用 `subagent_type` 指定定义，否则继承主对话 max。
- 并发与包：并行包上限 3；每包不超过 150 回合，大单单独成包；每包派工前切摘录文件 `runs/r<轮>/excerpts/<包>.md`，派工提示只指向摘录。同一修复目标退回 1 次升主力，再退回记入 closeout 交 Owner。
- 未配置：`models.tiers`、`execution.maxConcurrentSubagents`（declared 为 null）、`execution.dispatchTiers`、`design.authority`；不猜、不写链改。
- 集成分支已快进到 main `5814699`（START 改档位节）。
- 包管理器：`corepack pnpm@10.12.1 -C <树>`；嵌套 pnpm 实测解析为 10.12.1。
- 分包工作树放在 scratch 下（只写本工作树与 scratch）；包分支名 `claude/init015-r<轮>-<包>`。
- 扫描红线（no-private-input-scan 扫文件系统而非 git 索引，未跟踪文件也算）：工作树内任何文件不得出现本机用户目录下的凭据目录、钥匙串目录或应用数据目录的绝对路径，不得出现 `TOKEN=` 式赋值行与 overclaim 短语表里的英文短语。

## 轮次

### R1

- 拆分：派 `einzbern-main` 一次做完，产出写在 `runs/r1/`（decomposition.md、subtasks.json、packages.md、problems/decomposition.md、subtasks-batch.json），Subtask 用 work-batch 落链。
- 基线：b321d10 全量 verify `VERIFY_EXIT=0`，用时 7 分（2026-10-10T20:57:50Z 至 21:04:50Z），日志在 scratch 的 `logs/baseline-verify.log`（49,781 行）。跑完后树变脏两处：`docs/verification/internal-alpha/no-overclaim-scan.json` 的 scannedFiles 随树内文件数漂移（282→300），并新生成未跟踪的 `visual-selection-result.json`（164 KB）；批末 verify 后按 DS 惯例处理这两处回执。基线工作树已经 git worktree remove 退役（365 MB，回执副本移入 scratch trash）。磁盘余量 60 GiB（df，2026-10-10T21:10Z）。

- 拆分结果：46 张 Subtask（SUB-001–046，链 version 1387，全部 planned），27 包 8 波；拆分文件、两块补入画板（V2-Rejections、V2-Families）与主线程问题清单已提交集成分支 `6a35a29`。
- 调度（并行 ≤3，滚动补位）：包工作树在 scratch 的 `pkg/<包小写>`，分支 `claude/init015-r1-<包小写>`，自集成分支切出并已装依赖；摘录在 `runs/r1/excerpts/<包>.md`（生成器 scratch `tools/make-excerpt.mjs <runDir> <包> <out> [4|5|6|7]`）。包交回后：核对提交与 `status` 干净 → 按依赖合入集成分支（`git -C <集成树> merge --no-ff`）→ 退役包工作树 → 派下一个就绪包。
- 依赖（就绪条件，按 subtasks.json 的 dependsOn）：W2-A 等 W1-A、W1-C；W2-B/D/E/F 等 W1-A、W1-B；W2-C 等 W1-A、W1-B（另：锁文件在 W1-C 后）；W2-G 等 W1-C；W2-H 等 W1-A；W1-D/E/F 无依赖；W3-A 等 W2-A；W3-B 等 W1-D、W2-A；W3-C 等 W1-D；W3-D 等 W2-C、W2-D、W2-E；W4-A 等 W2-B、W2-C、W2-F、W3-B、W3-C、W3-D；W4-B 等 W1-E、W2-F、W3-B、W3-C、W3-D；W5-A/B 等 W4-A（W5-B 另等 W1-F）；W5-C 等 W4-A、W3-C、W1-F；W6-A 等 W3-A、W1-C、W2-G、W2-H、W1-D、W5-B、W5-C、W4-B；W6-B 等 W5-A、W4-A、W3-C；W7-A 等 W6-A、W6-B、W5-B；W8-A 等 W6-A、W6-B、W7-A。
- 摘录附加：家族包与 W2-H 的摘录追加 `file:handoff/W1-A.md`；W2-G 追加 `file:handoff/W1-C.md`；需要的问题条目在派工提示里点名（摘录生成器只按 P 编号自动带入拆分问题清单的条目）。
- 补位优先级（关键路径）：W2-C、W2-F 与 W3-C（二者都改 story-content.tsx，不能同时在跑）、W2-B、W3-B（W2-A 后）、W3-D（W2-C/D/E 后）、W2-G、W2-H、W1-E、W1-F、W3-A（W2-A 后），然后 W4、W5、W6、W7、W8。

| 包 | 状态 | 包分支起点 | 备注 |
| --- | --- | --- | --- |
| W1-A | 已合入 2bf6d9b，包树已退役 | 6a35a29 | SUB-008→009；问题 P1–P8 在 `problems/W1-A.md`；`handoff/W1-A.md`「给后续包」一节须并入 W2 家族包、W2-A、W2-H 的摘录 |
| W1-B | 已合入 3fff29c，包树已退役 | 6a35a29 | SUB-010；CSS 规范化相同（974 条规则同序，字节 124578→126188 全在原位拆开的跨家族选择器）；集外：doc-shell-class-proof 仍读 Navigation.tsx（W1-D 重写时按约定 8 改读 dist）、s254-component-contract-proof 正则失效（不在 verify，批末问题清单）、style-scale.md 第 63 行（W6-A/SUB-040） |
| W1-C | 已合入 31b0f6b，包树已退役 | 6a35a29 | SUB-004→005；字体 52 文件 3,290,644 B；`handoff/W1-C.md` 写给 SUB-006/007 与集成（合并新文案后跑 `fonts-vendor --check`）；待 Owner：W1C-1 上游 OFL 版权行；安全：子代理跑 `pnpm config list` 时 npm authToken 出现在其工具输出（未落任何文件，已 grep 核对），收口时报 Owner 建议轮换；此后派工提示禁止打印配置/凭据 |
| W1-D | 已合入 35b918b，包树已退役 | d736309 | SUB-024；现仓先红 171 个包外类（映射 171 条：包已提供删 38、改 tcrn-doc- 86、删演示 32、删死类 15）；40 个「包组件写出但包 CSS 无规则」的类按包类计、不计入差集（按建议先做，验收复核）；35 个类被 shell-parity/shell-fidelity/storybook-smoke/smoke.test 点名，W3 改名须同提交改门；集外：`doc-shell:proof` 脚本先跑 `node --test tests/doc-shell-class-proof.test.mjs`（归 W6-A/SUB-038 接线） |
| W2-A | 已合入 d0e6900，包树已退役 | c447221 | SUB-001→006；C5 两块各 85 名同集（主题无关块 118）；fonts-proof coverage 红：「盃」U+76C3（marks.json）不在随包分片，基线即红，批末跑 `pnpm fonts:vendor` 重生分片；预计红：token-contrast-proof（旧名变 var 别名，W3-A 重写）、smoke.test canvas 断言与 .storybook/preview.ts（P3）、旧几何断言门（P11）；tokens.css 顶部 @import fonts.css；问题 P1–P15 与 51 行新旧名表在 `problems/W2-A.md`、`handoff/W2-A.md`（W3-A/W3-B 摘录追加） |
| W2-E | 已合入 7fb37e6，包树已退役 | 85d8583 | SUB-019→020；Form 单测 21/21；交 W3-D：base 段 `.tcrn-product-shell :focus-visible:not(.tcrn-search-input__control)` 的 box-shadow:none 要扩排除表、Navigation.test 搜索框断言（441、597–602 行）、Select chevron 与 DatePicker calendar 包裹层；交 W6-B：smoke.test 815/819 行（Field 洗底去除）；契约待议：只读框焦点环（P5）、焦点环间隙色在 :root 解析（P6）；sm/lg 与顶栏 28px 未做（P9）；无 token 的几何字面值清单（P10）——见 `problems/W2-E.md`、`handoff/W2-E.md` |
| W2-D | 已合入 b4e9374，包树已退役 | 223100e | SUB-016→017；Button 13/13、Clipboard/ButtonGroup/index 22/22；component-api-manifest --check 红为回执漂移（W8-A 重生成）；交 W3-D：base 段 6 条与状态对冲突的规则（baseCss03 主题钮按下缩放违反 125-GWT5、baseCss08 产品壳内 focus-visible 清 box-shadow、baseCss05/06/23 四条）、Navigation.test:603 夜间 primary 断言；交 W6-B：storybook-smoke.mjs:984 的 `.tcrn-link-button:active` 字面量；foundation-visual-standards.ts:207 描述过期；设计数据待议 P7–P10（clipboard copied 换底色、quiet 组分隔线、组轮廓浅色墨字面量、loader 13/15px 无 token）；copied/failed/unsupported 三态图标建议与 copy 图标一起由 SUB-018 做（P12） |
| W2-C | 已合入 3dc2904，包树已退役 | 0af0bf8 | SUB-014→015；Icon 6/6；锁文件只删 12 行 lucide（保留 26 行 libc）；package-contract-manifest 红两处：OFL-1.1 不在许可白名单（W1-C 字体包带入，依据 D4 加入白名单，归 W6-B 并入文件集）、story-content.tsx 第 1065 行 `data-icon-library-source="lucide-react"`（归 W3-C，W2-C 交回写了新来源值与五语文案、smoke.test 667/669、语言条目 506–509、机器词台账 160 行——台账归 W4-A）；待 Owner：画板把 `.tcrn-icon` 基础样式搬进包标为待裁（未搬）；新树先构建 ui-tokens、ui-copy-state 再构建 ui-react（TS6305） |
| W3-B | 已合入 ce8b8c2，包树已退役 | 5630344 | SUB-025→026；doc-shell-class 171→161（余下全在标记侧，归 W3-C）；`doc-shell:proof` 已接单测（W6-A 不用再接）；shell-fidelity 红只剩 `.tcrn-icon` 重复（W3-B P1，随 M5 由 W3-D 处置）；story-demo-styles 未清空，demo-styles-sync 不退役；map 外仍有 45 条以包类为主体的文档规则，其中几条改外观（W3-B P3，可能被 128-GWT3 抓到，批末处置）；知识库壳只补回两条 grid-area 摆放规则；shell:parity 几何可能变（批末跑） |
| W1-E | 已合入 f6ebee6，包树已退役 | 9713742 | SUB-036；门 41 条测试全过；在其切点（W3-C/D 合入前）判红 C2 9 条（`.tcrn-link` 悬停焦点写色 5——含生成段、MultiSelect 选项 3、产品壳搜索 focus-within 1）、C5 1 条（主题日月图标夜间多 display）、C13 160 条（大部分随 W3-C 消失）；条款文档 `docs/contract/clauses.md`（C1–C17 按画板原文）、豁免 `exemptions.json`（第二至五批 11 家族）、families.json、roles.json；自定口径三条（只含 transparent 的 outline 不算写色、左边条从 2px 起算、无变体规则时按 (0,2,0) 比较）；集外：package.json 加 `contract:static` 并接 verify（归 W6-A）；组件侧修法（inputs.css.ts、base.css.ts、typography.json＋重生成、主题图标浅色声明）→ 批末返工（改契约从主力档起） |
| W1-F | 已合入 6f437f2，包树已退役 | c9a2dd4 | SUB-034；夹具测试 47/47；八项＋重叠各有红绿夹具与注入变异；API 见 `handoff/W1-F.md`（阈值只在门的 THRESHOLDS，库不含阈值；measureInPage/judgeMeasurements/runMeasureTargets；routes 加 bodySelector；库 39 KB 按行段读）；现有 55 个 story 浅色 53 绿 2 红（navigation-focused-shells-spec 裁切 393px、selection-list-patterns 重叠 20–25px，第二批以后家族的既有缺陷，批末问题清单）；G+ 十个 story id 未注册时门判缺失（W4-A/W5 补）；集外：package.json 加 `geometry-measure:proof` 接 verify（归 W5-C/W6-A） |
| W4-A | 已合入 811d198，包树已退役 | 3b04273 | SUB-029→030；五矩阵格数 44/28/10/116/42 与画板一致、23 件各有分节、图标 37×三档；高度 1069/1367/1376/1876/1803 均 ≤2000（未登记宽限）；类目 gplus-matrices 5/8；storybook test 3 条既有红（`.tcrn-field:focus-within`、画布 first-paint、「TCRN stays regular weight」，归 W6-B）；**硬阻塞**：page-template.tsx 的 scopeComponentCss 按逗号切 `:where()`，静态文档页状态样式全失效（76 个状态格偏离），W5-C 转绿的前提——并入 W5-C（等 W2-G 交回后，page-template.tsx 进 W5-C 文件集）；集外：缺 `[data-tcrn-theme="light"]` 主题块（夜间切换时嵌套浅色区跟着变夜）、ClipboardCopyButton 无静态状态入口、单独 TcrnBrandMark 无默认尺寸、Text 无 mono/行内数字 variant 入参、包入口未导出新增图标名单（W4-A P3）；测量库要支持 `before-bg` 探针（Switch 钮在 ::before，W5-C） |
| W3-A | 已合入 987923c，包树已退役 | 95d473e | SUB-002→003；ALL PAIRS PASS（文字最低 4.59 夜间 ink-3 于 panel；边与焦点最低 3.06 浅色 line-ctl 于 bg）；字标豁免 4 条引用 D2（tms 夜间两条待 Owner）；先红证据三处；弃用通知夹具 15 旧名、Chromium 计算值一致、storybook 构建打印 32 旧名 299 处；集外：tokens:proof 接两份新测试（通知测试要 Chromium，W6-A）、`findDeprecatedTokenUsages` 把定义算使用（P6，SUB-043 README）、字标承载面只算 panel 由验收定（P4）、ink-3 在 panel-2/bg-2/悬停/选中行低于 4.5（最低 3.88，P1，交 SUB-035/011） |
| W5-B | 在跑 | 6c54fd8 | SUB-032→033 |
| W2-H | 在跑 | 4e5b502 | SUB-011 |
| W5-C | 在跑 | 23182c6 | 前置修复 page-template scopeComponentCss＋SUB-028→035；文件集加 page-template.tsx 与 gplus-measure.mjs（只做加法） |
| W5-A | 已合入 df12710，包树已退役 | 373e3ec | SUB-031；类目 `gplus-samples` 五个样板（id 按约定 7），各 1908px（余量 92）；浅/夜两块 class 一致；129-GWT3 未达：P1 待裁差值（品牌行 16/48 而导航图标 49、文字 77；纸离边 0 非 12 且无圆角阴影；顶栏 68 非 52；侧栏有底色与右边线；首个导航组须带标题；无用户区与计数槽；面包屑无箭头）——差值表在 `handoff/W5-A.md`；storybook test 6 过 3 红（W4-A 已登记旧红）；集外：夜间块壳主题按钮无图标（ShellThemeToggle 或 page-template）、单选选中态静态页不显示（作用域改写同源，W5-C）、几何门测量根宜用 story 正文区（整篇 article 会把文档标题 2px 溢出算 clip） |
| W2-G | 已合入 590231c，包树已退役 | 27b12ec | SUB-007；fonts-render-proof 8 腿全过（52 个字面副本逐字节同、35 页各链接一次、googleapis/gstatic 0、五族 10 样本真加载、「季度复盘」回退 Noto Serif SC、屏蔽 fonts/ 时回退系统宋体以证可区分、变异 4 腿判红）；OFL 文本另复制进 storybook-static/licenses（超出判据）；画布色三处读 `--tcrn-color-bg`（浅 #efeeea、夜 #121210）；smoke.test 新断言写法在 `handoff/W2-G.md` 第 3 节（归 W6-B）；集外：package.json 加 `fonts:render-proof` 接 verify（W6-A，P4）；preview.ts 的 backgrounds.values 旧格式（P2）；随包字体改变静态页文字尺寸，浏览器门阈值与基线需复核（P3，W6-B/W8-A） |
| W4-B | 已合入 e28932f，包树已退役 | f0d2a13 | SUB-037；门测试 65/65；门在其树上红 C2 7＋C5 1（组件侧，批末返工）：Q1 生成段 typography.scale.ts:25-26 `.tcrn-link` 悬停焦点写色（改 typography.json 状态对＋生成器，改共享契约→主力档）、Q2 base.css.ts:2500 `.tcrn-link--quiet:hover`、Q3 inputs.css.ts:519-520 MultiSelect 选项 (0,3,0) 写底色（可能动 pairs.json→主力档）、Q4 inputs.css.ts:23 产品壳搜索 focus-within (0,3,0)、Q5 base.css.ts:606 主题日月图标浅色补 display；C6/C13 0、C7 1378/C8 42/C11 35 全部豁免（第一批 story 层 0 条）；豁免 12 条（新增 LockHint 🔒）；口径待验收：C7 title 非空即满足（Actions 20 处 title 与文字不同）；集外：package.json 接 contract:static（W6-A，Q8）；G+ 矩阵合入后复核读入数（Q10） |
| W3-D | 已合入 c118414，包树已退役 | 4b22450 | SUB-018→021＋M5＋W2-B 四条跟进；ui-react test 157/157；shell-fidelity duplicateSelectors 0（文档摆放规则改以 `svg[data-icon-name]` 为主体，未进白名单）；`.tcrn-icon` 基类在 icon.css.ts（描边读生成物；vertical-align 取板上 middle，P5 Owner 可更正）；待 Owner：三个外壳切换钮 36/38/44 与 IconButton md 32 不一致（W3-D P1，第二批壳层范围）；集外：生成器的链接焦点 `outline:none` 无强制色回退（P6，改 contract-generate）、page-template 的 scopeComponentCss 按逗号拆 :where/:is/:not 选择器（P7，既有缺陷）、foundation-visual-standards.ts:207 描述过期（P9）、Select/DatePicker 多一层包裹可能影响浏览器门（P8，W6-B 跑） |
| W3-C | 已合入 a4572d0，包树已退役 | 3003ed0 | SUB-027；合入后集成树 typecheck/build EXIT=0，doc-shell-class-proof EXIT=0（outOfPackageCount 0，模板类全有定义；scratch `logs/integ-w3bc-check.log`）；storybook test 在包树红 3 例 8 条断言：1 条本包（`.tcrn-doc-icon-sample-grid` margin，W3-B 改名后应转绿）、7 条集外（`.tcrn-field:focus-within` 2、preview.ts 画布色 3、theme-color meta 1、AI 契约「TCRN stays regular weight」1）→ 断言改归 W6-B，preview.ts 画布色与 theme-color 归 W2-G；集外：`scripts/s254-story-dom-proof.mjs:43` 改 `.tcrn-doc-story-disclosure`（不在 verify，批末）、shell-fidelity 第 37/38/40 行空条目（批末）；交 W4-A：storybook-content-text.ts 两条新文案五语、删 506–510 行、台账删 160 行；交 W6-B：密集壳 TopBar、changelog MachineToken 等外观期望；密集/紧凑壳原型只删类留元素（W3-C P4，范围待复核） |
| W2-B | 已合入 d95ccd2，包树已退役 | 817fc19 | SUB-012→013；Typography 11 条 10 过 1 todo（链接实际样式被 base 旧 `.tcrn-link` 覆盖）；四条 base/Navigation.test 跟进项已用消息并入在跑的 W3-D（先并集成分支再改：Navigation.test:399 正则、删 baseCss30 旧链接块并去 todo、baseCss28 Surface 头字号、壳内链接焦点环）；契约待议：caps 加 truncate、Text 外距、numeral 截断、生成段像素字面值与 C10 扫描（W2-B P4–P6 等，自定三处可推翻） |
| W2-F | 已合入 c4b2731，包树已退役 | 97f68c4 | SUB-022→023；八个 logos2 文件 sha256 登记 8/8、16 项比对、两次反向变异均判红、母标远端 200 一致；Navigation 单测 26/28（剩 2 条旧搜索框断言归 W3-D）；base.css.ts 里 workflow、design-system-1..4、accent-tms、secondary-readable 等 accent 移进 token-extension 停用表（读取判红），定义待 W3-D 删；契约品牌说明改 G+ 规则致 smoke.test:1432 红；交 W6-B：smoke/storybook-smoke/internal-alpha 标语期望（艺人管理系统、设计系统）、shell-parity 认内联 svg、geometry-proof 品牌变异穿不过 display:none；交 W4-A：storybook-content-text.ts 新标语五语；生成器未输出贴片几何与单色墨（组件常量由门对照）；待 Owner：52px 收起（P1，CSS 部分已做：文案 display:none、标恒 22）、夜间后缀（P15）；子代理一条命令用了 cd /（未弹框，记 W2-F 问题清单第 14 条） |

集成树合入 W1-A/B/C 后 typecheck 与 build 均 EXIT=0（scratch `logs/integ-w1abc-compile.log`）。

## 已收到的 B 类裁定（随批末链写注解）

- `.tcrn-icon` 基类进包（icon.css.ts），见 `problems/main.md` M5；并入 W3-D。

## 批末生成物（一次再生，不随单包重做）

- `pnpm fonts:vendor`（中文分片按最终产品用字重选）→ fonts-proof coverage 转绿；`node scripts/contract-generate.mjs --check`；tokens-sync；internal-alpha 回执与视觉签名基线（W8-A）。

## 待派（就绪条件）

- W6-B：等 W5-C 合入（作用域修复会改变静态页状态样式，重定基线须在其后）；文件集加 `scripts/package-contract-manifest.mjs`（OFL-1.1 依 D4 入许可白名单）。
- W6-A：等 W2-H、W5-B、W5-C 合入。
- W7-A：等 W6-A、W6-B；W8-A：等 W7-A。

## 下一步

1. 等 W1-A/B/C 交回（完成通知即唤醒）；逐包核对后合入集成分支，按上面的优先级补位派包（每次派前生成该包摘录并提交到集成分支）。
2. 全部包合入后：批末 verify 一次（日志放 scratch `logs/`），派 `einzbern-main` 按 Story 验收一次，问题清单一次处置，一次链写与知识采集。
