# INIT-016 回路状态（实施对话的接续点）

每次唤醒先读本文件，再按「下一步」接续。只记事实与接续点，不记进度叙述。

## 固定绑定

- 集成工作树：`/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init016-tab-shell`，分支 `claude/init016-tab-shell`，自 DS 主检出 main `69aa195` 切出。`69aa195` = main `d910ccb`（开单提交）对 INIT-015 候选 `claude/init015-gplus-renewal` @ `184db0d` 的 `--no-ff` 合并（2026-10-13，无冲突，未推送）。依赖已装（`install --frozen-lockfile --prefer-offline` 退出 0）。
- 主检出：`/Users/ryanlan/Code/TCRN Platform/TCRN-Design-System`（main `69aa195`），只用于读库、库门运行与批末把候选合入 main 本地。
- 库：`/Users/ryanlan/Code/TCRN Platform/TCRN-Design-System/.ether`。引擎 `node ~/.einzbern/engine/einzbern.mjs`（2.0.2），`--actor agent:claude-opus-5-5`，项目 `project:ba2f70f9503ac43c3ec6aa36`。开工读数 version 1889。
- INIT-016 = `work:1a8e81aaa0138ef58d9a8f18`（planned）；Story 135–150 planned（planned 不能直接 active，先 ready）；键号与 id 见 `../README.md`。Subtask 键号从 `TCRN-DS-SUB-113` 起（本库 Subtask 已到 112）。Incident 种类在 2.x 已退役：返工开新 Subtask，或开带 `--fixes` 关系的 Story。
- 库门：开工时 `gates-config-list` 读数 0 个门（version 1889）。S-1 待 Owner 在 Atelier 声明 `verify`（字段见 START「库门（S-1）」节）；INIT-015 的 13 张与本批 16 张的 done 都卡在这里。每轮开始重读。
- 档位：拆分、实施包、孤立修复用 `einzbern-economy`（claude-opus-5-5 low）；批末验收、问题清单判断、集成冲突、改共享契约的返工、升档后的返工用 `einzbern-main`（claude-opus-5-5 max）；旗舰不调。派工必须用 `subagent_type` 指定定义。
- 并发与包：并行包上限 3；每包不超过 150 回合，大单单独成包；每包派工前切摘录 `runs/r<轮>/excerpts/<包>.md`，派工提示只指向摘录。同一修复目标退回 1 次升主力，再退回记入 closeout 交 Owner。
- 未配置：`models.*`、`execution.maxConcurrentSubagents`、`execution.dispatchTiers`、`design.authority`（settings-catalog 现读 null）；不猜、不写链改。
- 包工作树建在 scratch 的 `pkg/r<轮>-<包小写>`，分支 `claude/init016-r<轮>-<包小写>`，自集成分支切出；主线程建树后先 `install --frozen-lockfile --prefer-offline`，再先构建 ui-tokens 与 ui-copy-state。
- 包管理器：`corepack pnpm@10.12.1 -C <树>`；命令不 cd、不 rm（删除改 mv 到 scratch 的 trash）。
- 扫描红线（no-private-input-scan 扫文件系统而非 git 索引，未跟踪文件也算）：工作树内任何文件不得出现本机用户目录下的凭据目录、钥匙串目录或应用数据目录的绝对路径；任何行不得以 `API`、`AUTH`、`SESSION`、`SECRET`、`PASSWORD`、`TOKEN`、`KEY` 结尾的大写或小写名字接 `=` 开头（规则 env-assignment 不分大小写）；不得出现 overclaim 短语表里的英文短语。
- verify 跑完会改 `docs/verification/internal-alpha/no-overclaim-scan.json` 并生成未跟踪的 `visual-selection-result.json`：跑门前后都把树收干净（前者 `git checkout --`，后者 mv 到 scratch 的 trash）。

## 轮次

### R1

- 开工：主检出 main 合入候选得 `69aa195`；集成工作树建好、依赖已装；库门 0 个（S-1）。
- 链上正文导出在 scratch `chain/src/`（INIT、6 Epic、16 Story、两份纪要）。
- 拆分：`einzbern-economy` 一次做完并提交（198b8ae）：28 张 Subtask（SUB-113…140）、18 个包（P1 切 P1a–P1d 四段 + P2…P15）、9 波；问题清单 25 条（`runs/r1/problems/decomposition.md`，均已按建议排进 Subtask，批末判断处置）。
- 开工链写：一个 work-batch 62 成员（INIT-016 与 16 张 Story 各 planned→ready→active、28 张 Subtask 建单），WORKSPACE_COMMAND_COMPLETED，version 1889 → 1951；读回 Subtask 28 张与 subtasks.json 零差异（planned），Story 16 张 active，INIT-016 active。批文件与回执在 scratch `chain/r1/`。
- 调度（并行 ≤3，滚动补位）：可起的包由 scratch `tools/eligible-016.mjs <runDir> <已合入> <在跑>` 算（列出的前置包已合入、更早波次里与它文件相交的包已合入、与在跑包文件不相交）。包树由 scratch `tools/setup-pkg.sh <轮> <包>` 建；摘录由 `tools/make-excerpt-016.mjs <dispatchDir> <轮> <包> <包树> <输出>` 切。P1 各段各自从集成分支最新 HEAD 新建包树（等价于 C-15 的「先把集成分支合进 P1 分支」）。包交回后：核对提交与 `status` 干净 → 按依赖 `git -C <集成树> merge --no-ff` → `git worktree remove` 退役包树 → 派下一个可起的包。
- W1 已派：P1a（SUB-113→114→115）、P2（SUB-123→127）、P3（SUB-135），包树 scratch `pkg/r1-p1a`、`pkg/r1-p2`、`pkg/r1-p3`，摘录已提交（63d07f9）。

| 包 | 状态 | 包内提交 | 合入 | 备注 |
| --- | --- | --- | --- | --- |
| P1a | 已合入，包树已退役（271 MB） | a7a1b0b、b44c4d7、5fe6158、0eb4136 | 36a08dd | 局部门全 0；问题 6 条（`runs/r1/problems/P1a.md`） |
| P1b | 已合入，包树已退役（239 MB） | f2d2921、867e43e、8391672、35c43d6、2a0a376 | 89a6c03 | 局部门终态全 0（ui-react test 202/202、test:dom 37/37）；越出文件集改了 `styles/index.ts` 两行登记（W2 无人持有，合入无冲突）；问题 8 条，第 5 条（完整菜单里级联列的位置，1440 宽同开两列超出视口 12）是设计待定项 |
| P1c | 已合入，包树已退役（272 MB） | caf6cfa、f85de9f、9872a16（合入集成分支解登记冲突）、abdb929 | c7fd635 | 局部门除既有红外全 0；问题 11 条：AOS 在 logos2 无标（三处 AOS story 暂传 design-system，待 Owner）、顶带无拖排手势（ShellPins.tsx 不在本包）、包外门按 C-12 会红 |
| P1d | 已合入，包树已退役（272 MB） | e0462f9、db40caa、968a115 | d5df36f | SUB-121 文件集内做完；判据两处待包外：page-template.tsx 对无 `data-page-hierarchy` 的静态页省掉壳样式（问题 1，归 P10 的文件）、storybook test 10/11（composition-one rail 既有红）、shell:parity 退出 1（文档侧与缺样式）、geometry:proof 退出 1（INC-399 段崩，归 SUB-126）；问题 12 条 |
| P2 | 已合入，包树已退役（271 MB） | 3f87bb3、04484e0、8c96e48、622c335 | f078b6f | token-extension-proof 在包树红 1 条（`--tcrn-shell-pinb` 未解析，P1a 合入后应转绿，批末核）；问题 12 条 |
| P3 | 已合入，包树已退役（236 MB） | 5bcc0a7、dad8d00 | a2f3538 | 18 门在两块画板上全绿、18 条变异全红；默认模式（真件）未跑，等 SUB-137；问题 4 条；交回第 5 节列了壳件钩子要求，已用消息转给在跑的 P1b（只做其文件集内的，其余记问题） |
| P4 | 已合入，包树已退役（272 MB） | 1f67057、71ef1e4 | a2675b5 | SUB-128 部分：后缀两主题同色、夜间豁免带 D7 待裁已回；矩阵红格不在第一批 matrices.json，建议并入 SUB-136（P9）。已知红：ui-react test 183/184，P1a 的 `ShellBrandButton.test.tsx` 仍断言夜间后缀 ≥ 4.5（现 3.07），批末处置，后续包派工时告知不修；问题 4 条 |
| P5 | 已合入，包树已退役（239 MB） | 7eefd5b、5825bcb | f7d6f6d | 局部门全 0（ui-react test 208/209，唯一红是既有红）；问题 5 条，要紧的一条：静态 Storybook 页无客户端 React，ShellIntro 不播放（下一轮）；已经消息让 P1c 交回前把集成分支合进包树、解 `styles/index.ts` 登记冲突 |
| P6 | 已合入，包树已退役（273 MB） | f635938、6d11e0a、191d04e | c1bf910 | 局部门除既有红外全 0；ProductShell 新增必填 `pageHeader`；新 token `--tcrn-layout-content-max-w` 1040；geometry:proof 仍退出 1（INC-399 段，归 SUB-126）；问题 10 条（含 1040 落到 DocumentCanvas 超出 Story 点名范围、可单条回退） |
| P7 | 已合入，包树已退役（273 MB） | 5cb5b72、bac233c（合入集成分支）、a12acd4、eb2b9e5、0cba35f | 080286d | INC-399 六腿全过；geometry:proof 仍退出 1（静态页无壳样式、搜索浮层段 0 个，P1d 问题 1、6）；问题 7 条，两条待设计裁定（夜间遮罩色、Sheet 里下一级怎么开） |
| P8 | 已合入，包树已退役（273 MB） | 8873a9a、601b6c9、1913b24 | 34e81f6 | 局部门除两条既有红外全 0（ui-react test 的 TMS 后缀、doc-shell:proof 的 `tcrn-shell-dropdown__col` 在 080286d 即有）；问题 10 条（smoke 两处断言旧标记、样板三弃用 TopBar 无样式、roles.json 仍登记 3 个退役类名等） |
| P9 | 已合入，包树已退役（273 MB） | a322eff、55f3d48 | 20193f3 | contract:proof 11/11、壳层板与 B 段差 0.00；storybook test 11/12（composition-one 既有红）；问题 7 条（壳层门读不了 8 格、铃铛悬停 3.5% 对板 6%、geometry-proof 展开菜单常数 13→15 等） |
| P10 | 已合入，包树已退役（272 MB） | 6d10851、6144e08 | 513424c | 文档页全进顶带壳（1440 读数：顶带 52、标按钮 134×40、纸 12/52/14、TocRail 在纸内、页列 1040 居中、夜间计数 ink-2）；doc-shell:proof 与 storybook test 的红与改前相同（`tcrn-shell-dropdown__col`；smoke 断言旧文档头归 SUB-132）；问题 8 条 |
| P11 | 已合入，包树已退役（237 MB） | 0f4e670、deaf18b、897317e | 12daf0a | 四块成品板 D 段换顶带壳（Typography、Icon、Actions、Inputs 与对应 V2-B1 草稿板），heights 5836/4271/5216/6530；Shell 两板字面守护 diff 退出 1 是既有 token 块漂移（同 P2 问题 3）；问题 4 条（canvas.json 板高与 y 未跟、Brand 与 Shell 板 D4 关键词残留、Icon 板仍写 37 件） |
| P12 | 已合入，包树已退役（272 MB） | 549afa6、d06dbce 与 9f90755（两次合入集成分支）、0cb64d8、07e2f07 | 715895f | 夹具模式 18 门全绿、变异全红；对真件 20 次运行 8 绿 9 红 1 n/a（红来自包外缺口：静态页无客户端 React、Sheet 根态、NavItem `data-text`、底栏锁定块 `svg[data-logo]`、下拉搜索被拉到 260、后缀超出 1px、20 格对比度）；给触摸端门加了「390 下打开的层必须是 Sheet」断言，按 C-17 可能算判定语义变化，交判断确认；问题 10 条。已消息 P13、P14：门库「在纸内」限定到被量壳自己的纸，交回前合入集成分支 |
| P13 | 已合入（两段：第一段部分完成，接续段做完接续点 1、2），包树已退役（296 MB） | 2cc712c、b06ca3a、efc7fd3、269aaf7、f0274db（合入 715895f）、9eba3df、af47bae；接续段 aab4cb4、45229d0、9ed5bed、fb39cee | 32d8a3d | doc-shell:proof 绿；storybook:smoke、internal-alpha:browser-proof、full-surface:proof、storybook test（10/12）仍红，原因已逐条归属（视觉签名 199 归 SUB-140、smoke.test.ts 旧 oracle 值、zh-CN 译名、门判定待定的分类说明与当前 story 标记、语言菜单 Esc）；问题 16 条 |
| P14 | 已合入，包树已退役（272 MB） | 4879d45、ad4972d、c4fa1c7（合入集成分支）、5ee8f88 | da61a76 | SUB-134 部分：样板换壳、映射、shellFrame、夹具与测试已交；geometry:measure 单测 70/70、shellFrame 12 run 过、三变异全红，但 12 个样板 run 红在 clip（包内标按钮字标后缀上下超出裁切祖先 1px，问题 1）；visual-proof 23 行中 12 绿；smoke.test.ts 3 红（归 P13 文件）；问题 6 条；两处可更正的选择（样板不要求 rail、Actions 名册人名换 김하늘 记 DIFF-11） |
| P15 | 已合入，包树已退役（272 MB） | 0ff4190、c447358、f98b298、6ffcdc0 | ad91a64 | SUB-138、139 完成（版本面 7 处读回 4.0.0；CHANGELOG 两批合一、迁移说明 M24–M29；`owner-acceptance.md` 按 8 板逐板）；SUB-140 部分：几何、壳层门（首次入仓）、映射报告与契约清单、脚手架回执已再生，internal-alpha 浏览器回执与视觉签名基线未再生（browser-proof 在 scroll-spy 段超时；P13 问题 13–15 会让 nonVisualProofOk 为假），视觉签名重收 0 条；问题 11 条 |

- 跨包通告 `runs/r1/excerpts/cross-notes.md`（已知红、已合入包的接口行段、W3 共享文件规则）随每次派工指给子代理，包交回后主线程补行。
- 「批内发现的新工作」（钩子、title、文案等落在别包文件的缺口）一律只记问题文件、进下一轮，不插进在跑或待派的包（批量原则 v3 第 1 条）。
- 全部 18 个包已合入，集成 HEAD ad91a64；包树全部退役，磁盘余量 60 GiB（df）。
- 批末 verify（scratch `tools/batch-end-verify.sh 1`）跑在 63e1ee2，2026-10-13T20:51:46Z–21:00:03Z：30 步红 9，44 段红 12（test、fonts-proof、shell-fidelity、geometry:proof、shell:parity、storybook:smoke、geometry:measure、storybook:visual-proof、full-surface、internal-alpha:browser-proof、scan、hardening）；`storybook:build` 退出 0。scan 的红是 browser-proof 超时写出超限回执的副作用，还原后单跑 `ok: true`。结果表与主线程核对三处在 `runs/r1/verify/steps.md`（5a82dc5）；逐段日志、回执存档在 scratch `r1-verify/`，树已还原。
- 批末验收：三片并行（einzbern-main），A = STORY-135…141，B = 142…146，C = 147…150；摘录 `runs/r1/excerpts/acceptance-{A,B,C}.md`（8a0fd04），产出 `runs/r1/acceptance/{A,B,C}.md` 已提交（1a13d1b）。结论：A 七张全部分（返工 10：主力 4、经济 6）；B 五张全部分（返工 12：主力 2、经济 10）；C 147、148、150 部分、149 不满足（返工 18：主力 6、经济 12）；三片有跨片重复（标按钮与首行字标后缀超出裁切 1px、底栏锁定块缺 `svg[data-logo]`、ShellBrandButton 夜间断言、静态页无客户端挂载等）。新增 Owner 事项：A 1 条、B 3 条、C 5 条。
- 判断：einzbern-main 单独一次，产出 `runs/r1/judgment.md`（47.9 KB）与 `runs/r1/lessons.json`（a3a83d9）。结论：15 张部分、149 不满足，机器判据一张未达；R2 返工 36 条（主力 14、经济 22，六组 G1–G6）；Owner 待裁 15 条（§3.1，每条带「不裁时的默认」，R2 按默认做）；R2 建议 12 包 5 波（§5）。主线程 verify 注里「browser-proof 超时中断」已按判断 §0 第 3 条更正。
- R1 链写：一个 work-batch 79 成员（SUB-115、117、118、122、130、138 三步转 done；其余 22 张 ready→active，summary 写 R2 承接编号；16 张 Story 与 INIT-016 写 summary 注解），WORKSPACE_COMMAND_COMPLETED，version 1951 → 2032；读回 Subtask 113–140 done 6、active 22，Story 16 张 active 且注解在，INIT-016 active。批文件与回执在 scratch `chain/r1/end-batch*`。
- 知识卡：TCRN-DS-KB-026…030（lessons.json 五条）全部 KNOWLEDGE_UNIT_CREATED、读回 lifecycle active；028、030 首次报 KNOWLEDGE_POSSIBLE_CONFLICT（只是标签重叠：KB-022/023/013 等），以 `--coexist` 建。回执在 scratch `chain/r1/knowledge-receipts*.json`。

### R2

- 拆分：einzbern-economy 单独一次并提交（29b78ce）：37 张 Subtask（SUB-141…177，挂原 Story）、13 包 5 波约 1660 响应（K1 经济、K2 主力、K3 主力；K4、K5、K7 主力；K6 主力、K8 经济、K10 主力；K11 主力、K9 经济、K6b 主力；K12 经济）；偏离判断 §5 四处（理由在拆分 2.4 节）；问题 12 条，第 6 条：O-4 不裁则新接的 markText 门对 DS 首行（1.4 > ±1）判红，批末 verify 非 0，只有 Owner 能解。第 12 条的「fonts-vendor 联网」不成立：脚本只从已装 devDependencies 复制，`REGISTRY` 只写进 manifest 元数据。
- 开工链写：subtasks-batch 37 个 work-create，WORKSPACE_COMMAND_COMPLETED，version 2032 → 2069；读回与 subtasks.json 零差异（planned）。
- 跨包通告 `runs/r2/excerpts/cross-notes.md`（既有红归属规则、接口指向、fonts-vendor 不联网）。档位按包表：经济包派 einzbern-economy，主力包派 einzbern-main。
- W1 已派：K1（经济，SUB-141→143→144→154→159→145→146→162）、K2（主力，SUB-165→166→167）、K3（主力，SUB-168→169），包树 scratch `pkg/r2-k1…k3`，摘录 6558994。K7 无前置、文件集与 W1 不相交，有空位即可起。

| 包 | 状态 | 包内提交 | 合入 | 备注 |
| --- | --- | --- | --- | --- |
| K1 | 已合入，包树已退役（273 MB） | 0e39700、9d081aa、5987d66、c1e4a0a、52780e6、2d1535e、61cf706、f709e9a、0a05831、18ae767 | 72d208d | 八张完成；ui-tokens 14/14、ui-react 233/233、test:dom 47/47、两个 pilot 过；新红两处在别包文件：`smoke.test.ts:1973`（归 SUB-173）、`scripts/storybook-smoke.mjs:1066-1067` 仍要旧 260/420（K3 已合入，无 R2 持有者，待安排）；问题 9 条（页头标题行高 1.1 无 token、纸内可聚焦区焦点环被纸裁切） |
| K2 | 已合入，包树已退役（298 MB） | a9b208b、54c48f1、ccbcfa0、b2ae68c | 6be4775 | 三张完成：文档页壳层 story 合板（菜单搜索 936×40、下拉搜索 228×28 等）、字标不译、AI 契约恢复翻译、Change Log 单一来源、语言列表 Esc 回焦；full-surface:proof 0、shell:fidelity 0；余红有主（smoke.test.ts 归 SUB-173、「铛」归 SUB-177）；28 个颜色与阴影弃用别名提示留 R3（问题 3）；问题 6 条 |
| K3 | 已合入，包树已退役（297 MB） | 5594ac9、50ccc1f、1ab33c3、4af6f04、b6b4738 | b759809 | 两张完成：parity 去样板角色、smoke 比较器改读顶带（失败 29/145/318 → 0/1/2）、42 个索引与参考页标当前项、railReachability、契约清单与 README；settings 23 例过；axe 颜色对比违规清零（夜间 TMS 仍 pending）；browser-proof 回执 507,403 字节；scan 0；余红有主；问题 11 条（两个「search results」视觉实例壳收起、smoke 对 AI 契约的旧断言、zh-CN「工作项」文案无主） |
| K4 | 已合入，包树已退役（274 MB） | eb5e0da、3eaad07、a223eb4 | ddbd82e | SUB-142 完成（三条壳几何 token、粗指针块进 token 表、C10 字面量扫描）；SUB-155 部分：三条豁免已删，暴露 106 条、剩 82（C2 3、C7 45、C11 34，各一根因），contract:static 退出 1，`contract-static-proof.test.mjs:524` 仍要求第二批豁免（R2 无持有者）；ui-react test 4 条钉旧写法（问题 1–4，归 K5、K6）；另把 `tcrn-shell-strip` 登记为壳条（摘录外，可改回）；问题 14 条 |
| K5 | 已合入，包树已退役（299 MB） | 62e0400、fd14855、2c09e64、76b47e8 | 2e2c436 | SUB-170 完成；SUB-151 部分（四个壳 story 静态页水合为真件，intro、focusLoop、点外部、触摸门转绿，三条原不可区分的变异可区分；文档壳自身浮层仍是静态标记，接续点在交回第 9 节）；SUB-160 部分（ts-m-s 呈现 Sheet，AOS 标题裁切仍红）；修了两处包件缺陷（级联 ArrowLeft 焦点落到隐藏行、切 zh-CN 后下拉位置偏 12）；ui-react test 235 过；问题 16 条 |
| K6 | 已合入，包树已退役（246 MB） | 212b88f、2d99f72、397b0b0、450dabf、b9afc43、2a689cd | 3b38286 | 五张完成：NavItem 行钩子、受控搜索词与分类说明、PageHeader 层级（壳纸页标题默认 h1）、地标名 `landmarkLabel`、拖排（拖动与 Alt+方向键）；ui-react test 244 过（K4 问题 1–4 的钉旧测试已改）、test:dom 53；contract:static 仍因第 524 行退出 1；问题 6 条（文档菜单分类是二级项，说明要挂在项上） |
| K7 | 已合入，包树已退役（274 MB） | fb778c7、9db76d0 | 91b2b80 | 夹具 18 门全绿、19 条板变异只红本门；新增 prail 检查与包件钩子夹具 `package-menu.html`；真件 9 绿 8 红 1 n/a（R1 8 绿 9 红），红按根因归 K1、K5、K6；css-template-integrity 家族段名正则放宽并把连进退役样式表的段排除（问题 1，判断确认）；问题 3 条 |
| K8 | 已合入，包树已退役（275 MB） | 4c18e4c、6baccc0、9a6ff55、b4d0e74、020d8fc、049f72d | 9d4fabe | 四张完成、SUB-175 部分（shell-matrix 治理元数据项要改 `storybook-smoke.mjs`，K3 文件，已交 K9 附录）；名册 38 写进板与五语、canvas.json 板高与 y、TreeNav 改在 Popover 下拉里、台账九条现测；改过的板：V2-B1-Icon、V2-B1-Typography、成品 Icon、Typography、canvas.json；问题 8 条 |
| K10 | 已合入，包树已退役（274 MB） | 2480d5a、7a9c709 | 3911607 | SUB-164 门侧完成：两板 18 门全绿、板变异 20/20 只红本门、页夹具四条故事变异全红；真件 18 门 10 绿 7 红 1 n/a；DS 侧栏首行 1.4 照判红（O-4），底栏锁定块 en 1.7 同根因；问题 7 条（brandDigest 产品键与 logos2 文件名不一、singleLine 把面包屑当整行、一条变异等价） |
| K9 | 已合入，包树已退役（300 MB） | 6f32f68、de26dc1、ffdb1f0、4520e1c（合入集成分支）、f6a9bbe、04a0fdf、1053eeb、bd84dbf | cd57872 | 两张与附录三处完成：AI 契约与 oracle 改述顶带壳与两处搜索（936×40、228×28）、后缀两主题同色 D7 待裁、迁移说明 M30–M37（收 K1、K4、K5、K6、K6b 条目）、README 六板 306 格与名册 38；smoke missing 4 → 0；余红有主（smoke.test.ts 多行归 SUB-173）；问题 7 条（三条摘录外旧壳文字进下一轮） |
| K6b | 已合入，包树已退役（275 MB） | 56f1f6c、b2a9158 | c7f36e9 | SUB-156 完成：面包屑分隔符读 token、C2 与 C7 余项清零、页头 DOM 调整、兜底焦点改为随主题声明（Tab 819 停点浅深两根读数改前改后一致）；contract:static 82 → 34（C11 余 34），仍因第 524 行测试退出 1；ui-react test 246/246；问题 5 条；已消息 K9、K11：交回前合入集成分支（K9 收 K6b 迁移条目） |
| K11 | 已合入，包树已退役（301 MB） | c305bf7、4d79f0c（合入集成分支）、0b7f98b、eee8626、8427cea、3e637f8 | 590274c | SUB-161 完成、SUB-150 部分（geometry:proof 搜索浮层与纸内基线碰撞 2 处要改碰撞判定，未授权；search-static 例外因 alpha-styles.ts 死规则未删）；壳层门真件 18 门 13 过 5 红、故事变异 21/22；smoke 分类说明 0 → 23、h1 计数清零；问题 12 条 |
| K12 | 已合入，包树已退役（301 MB） | d5cb63e、fe8578f、5a5cad2、d22ea99、0dcb4d2 | 0689a1d | SUB-173 完成（storybook 包测试 7/12 → 12/12，屏名五语与登入读回句补齐）；SUB-177 部分：字体补「铛」「簇」两片、报告与回执再生、验收清单更新；视觉签名重收 0 条（browser-proof 非视觉项仍红；217 条变化都可归换壳、换样板或新 story，6 页 maxCell 偏高待目视）；问题 10 条（browser-proof 要求 DS 锁定块后缀按语言翻译与 SUB-166 冲突；复现性检查写死 openMenus === 6，现读 14——两条都改门判定，交判断） |

- K12 的前置在包表里写成「其余全部」，调度工具不认，等其余 12 包全部合入后手动起。

- 批末 verify（`tools/batch-end-verify.sh 2`）跑在 6f739b2，2026-10-14T02:14:58Z–02:23:36Z：30 步红 7、44 段红 8（geometry:proof、shell:parity、contract:static、storybook:smoke、geometry:measure、storybook:visual-proof、internal-alpha:browser-proof、hardening）；`test`、`tokens:proof`、`full-surface:proof`、`scan` 转绿，`contract:static` 新红；`storybook:build` 退出 0；结果表 `runs/r2/verify/steps.md`（537ab3c），日志与回执存档在 scratch `r2-verify/`，树已还原。
- 批末验收：三片并行（einzbern-main），摘录 `runs/r2/excerpts/acceptance-{A,B,C}.md`（15d7161，含上一轮验收与判断的指向），产出 `runs/r2/acceptance/{A,B,C}.md`。

- 批末验收交回并提交（585aa21）：A——137、138、139、141 机器判据满足，136 只等 D7，135、140 部分（返工 8，主力 6）；B——142…146 五张部分，测得的行为都合 GWT、每张各一个机判仍红（返工 11，主力 7）；C——147、148、150 部分、149 不满足（返工 10，主力 7，C2-10 汇总 A、B 根因）。三片新增 Owner 事项：页头标题行高 28.6 无 token、TreeNav 归宿；O-4 补证据（底栏锁定块 en 1.7、按「大写顶到基线」量 0.6 会过）。
- 判断：einzbern-main 单独一次，摘录 `runs/r2/excerpts/judgment.md`（585aa21），产出 `runs/r2/judgment.md` 与 `runs/r2/lessons.json`。

- 判断（4cd959e）：机判满足 4（137、138、139、141）、待 Owner 1（136，D7）、部分 10、不满足 1（149）；R3 返工 30 条（主力 25，其中 22 条是 R2 已返工过的同一目标——R3 再退回交 Owner；经济 5），8 组；Owner 待裁 18 条（O-1…O-15 沿用，O-16 页标题行高、O-17 TreeNav 归宿、O-18 批末 verify 加 test:dom 段）；照现有证据 R3 做完只剩 markText（O-4）一处红。prail 改为包件照板的盒画、门不改；门判定语义按 B 类授权、没有放宽阈值；C11 取方案 (a)。
- R2 链写：一个 work-batch 120 成员（R2 的 24 张三步转 done、13 张 ready→active 写 R3 承接；R1 的 SUB-120、123、124、129、133 active→done；16 张 Story 与 INIT 注解），WORKSPACE_COMMAND_COMPLETED，version 2069 → 2194；读回 R1 Subtask done 11、active 17，R2 done 24、active 13，Story 16 张 active 且注解在。
- 知识卡 TCRN-DS-KB-031…035 全部建成、lifecycle active（031 报标签重叠，以 `--coexist` 建）。

### R3

- 拆分：einzbern-economy 单独一次，输入 `runs/r2/judgment.md` §2（R3-1…R3-30）、§3.1 默认列、§3.4、§5，R2 拆分第 1 节约定与 R2 主线程问题 M2、M5；Subtask 键号从 `TCRN-DS-SUB-178` 起；产出写 `runs/r3/`。

- 拆分（afab6fc）：34 张 Subtask（SUB-178…211）、11 包 5 波全主力（M1–M3 W1；M4–M6 W2；M7、M8 W3；M9、M10 W4；M11 W5），约 1,270 响应；偏离判断 §5 四处（理由在拆分）；B 类先做：R3-17 改 data-logo 为标 id 后，SUB-194 同包把 `brand-asset-source-proof.mjs` 的比对键改成标 id（检查不放宽）；问题 16 条。
- 开工链写：34 个 work-create，WORKSPACE_COMMAND_COMPLETED，version 2194 → 2228；读回零差异（planned）。
- 跨包通告 `runs/r3/excerpts/cross-notes.md`。W1 已派：M1、M2、M3（einzbern-main），包树 scratch `pkg/r3-m1…m3`。M5、M6 无前置、文件集与 W1 不相交，有空位即起。

| 包 | 状态 | 包内提交 | 合入 | 备注 |
| --- | --- | --- | --- | --- |
| M1 | 已合入，包树已退役（277 MB） | 42f1397、9099a4c、31f4ed2、66eb996 | b4edf13 | 三张满足：pinJitter 8 次全过、故事变异 22/22；对比度改按格心绘制层取底，仅 srch-kbd 两格变值；面包屑逐段读，390 设置页与名册页 singleLine 转绿；真件 18 门 16 过 2 红（brandDigest 归 SUB-194、markText 待 O-4）；`story-label-plus-40` 变异改法交判断确认；问题 6 条 |
| M2 | 已合入，包树已退役（277 MB） | d28b5e4、9c6b3b4、eb41539、46b8781、f26c633、3a0495e、0cae4af、c084238 | a163fac | 四张完成、SUB-191 部分：geometry:proof 0、shell:parity 0、C11 归属与 34 条豁免；顶带登记为 C8 工具栏后出 18 条 C8 发现（板 `.ts-pins` min-width:0、无固定项壳返回 null），待 Owner，contract:static 退出 1；parity 复合行盒读法（B 类回显）；问题 5 条 |
| M3 | 已合入，包树已退役（277 MB） | 47f3e77、5c6695f、842c764、9b99bcd、5187169、6041d40、4a666c4 | e161e89 | 五张完成：菜单图标照板 22 盒（真件 prail 16/48）、纸内焦点环向内、导航项单行截断进基础规则、两个死名清零、三条下拉 DOM 用例；ui-react 248/248、test:dom 56/56；余红有主；问题 9 条（zh-CN markText −1.1 无主等） |
| M4 | 已合入，包树已退役（303 MB） | 97c9206、706e689、e430a8a、d46d6d5、28d13ad、70babd0 | 8f5990c | 四张完成、SUB-194 部分（zh-CN 两次运行读到换字，M5 已合入，批末重量）；地标重名 30 → 4（余归 SUB-179）、TocRail 层级、⌘K 开关、data-logo 改标 id、三条新 token；ui-react 256/256、test:dom 58/58；contract:static 只剩 18 条 C8（待 Owner）；问题 8 条 |
| M5 | 已合入，包树已退役（278 MB） | 4d1e254、8ceae3e、38b5e40、add6bc5 | 732ae02 | SUB-195、186 完成（DS 首行字标五语不换字、axe 14 → 12、拖排与产品切换在静态页实测保留），SUB-198 部分（复现性与泄漏扫描已稳，禁用项读回无样本，补样本要改 M9 的 story-content.tsx）；storybook 包测试 14/14；问题 8 条 |
| M6 | 已合入，包树已退役（301 MB） | a971ca9、c149dd4、51be674、9456099 | 8bd05a0 | 三张完成：样板壳高 640 与画框齐、AOS 标题裁切 8 → 0、search-results 变体出结果与「工作项」补回；visual-proof 23 行全绿、smoke 0、storybook 包测试 12/12；axe 新增 4 条地标重名待 M4 的 SUB-184 归 0；问题 5 条 |
| M7 | 已合入，包树已退役（301 MB） | 50d0a7c、d7b5643、39cb579、e41e23e | b524d4b | SUB-202、203 完成，SUB-201、179 各剩一项（地标重名 4 条与禁用项样本在 M9 的 story-content.tsx，已交 M9 附录）；文档壳水合真件（390/760 开 Sheet、761/1440 开面板）、⌘K 只开一个壳；壳层门真件 17/18（只剩 markText，待 O-4）；smoke 0、doc-shell:proof 0；问题 8 条 |
| M8 | 已合入，包树已退役（278 MB） | f41f1d3、32ff6d6、4170031 | a21300e | SUB-204 完成：文档层改写 G+ 名（弃用提示 210 处 → 19 处，余归 SUB-208）、search-static 死规则与例外删除；shell:fidelity、doc-shell:proof、tokens:proof 0；问题 6 条（另有死规则、故事标题 3px 左边条违反禁用清单等，进下一轮） |
| M9 | 已合入，包树已退役（301 MB） | e385136、9e0f3ad、dcd524d、2d9ce60、b0def38 | b2a9636 | 两张与附录三处全部完成：登入动画读回句五语、AI 契约与 oracle 改顶带壳、弃用提示 0、storybook 单测 14/14、axe landmark-unique 4 → 0、禁用项样本 0 → 3、contracts 0；browser-proof 只剩视觉签名 199 条（交 SUB-211）；迁移条目交 M11 补录；问题 7 条 |
| M10 | 已合入，包树已退役（240 MB） | 01afc35、5f71f0b、de3c839 | 4981b69 | 两张完成：四份文档改顶带壳说法（TMS 后缀同色、夜间待 D7）、迁移说明 M38–M46 与 CHANGELOG 摘要；scan 0、scaffold:proof 0、internal-vocab:scan 0（为此跑了一次构建，偏离派工写法，已回显）；问题 4 条 |
| M11 | 已合入，包树已退役（301 MB） | 2e38e72、f7d5f33、d85f90c、a3f8481、5e9ae6a、8aa2c1e、e9b72b0 | ad97500 | SUB-211 与附录两项完成：视觉签名重收 217 条（改 199、新 18，无预期外；A 类 24 个离群值列为 Owner 目视项）、迁移说明 M47–M48、owner-acceptance.md 更新到 R3 批末读数与待裁 O-1…O-18；包内 browser-proof 0、visual-proof 23/23、geometry:proof 0；仅 geometry:measure 的 markText 红（O-4）；问题 4 条（高 story 截图只到纸内可见部分、interaction-disclosure-spec 按钮底部疑似裁切、基线机制无删除） |

- 批末 verify（`tools/batch-end-verify.sh 3`）跑在 c45c529，2026-10-14T07:27:16Z–07:35:45Z：30 步只剩 2 步红——`contract:static`（C8 一族 18 条，顶带登记为工具栏后的让步项缺失，待 Owner）与 `geometry:measure`（只有 markText：DS 侧栏首行 1.4，待 O-4）；其余全绿，`storybook:build` 退出 0；结果表 `runs/r3/verify/steps.md`（df740e6）。
- 批末验收：三片并行（einzbern-main），摘录 `runs/r3/excerpts/acceptance-{A,B,C}.md`（463ede0），主线程问题 `runs/r3/problems/main.md`（M1–M4）。

- 批末验收交回并提交（b7f83ae）：A——137…141 机判满足，135（C8）与 136（D7）阻于 Owner，返工 2；B——142、144 满足，143、145 部分，146 阻于 O-4，返工 3；C——150 机判满足，147 部分（3px 左边条违反禁用清单、截图盲区），148 阻于 O-2，149 阻于 O-4 与 C8，返工 6。读数更正：批末 C8 实为 15 条；markText 另有底栏 TMS 锁定块 en 1.7。三片对 C8 处置意见不一，交判断明确。
- 判断：einzbern-main 单独一次，摘录 `runs/r3/excerpts/judgment.md`（b7f83ae），产出 `runs/r3/judgment.md` 与 `runs/r3/lessons.json`。

- 判断（65d6aab）：机判满足 8（137–142、144、150）、部分 4（143、145、146、147）、阻于 Owner 4（135 O-19、136 O-8、148 O-2、149 O-4 与 O-19）；R4 返工 9 条（主力 4、经济 5；含两条硬线：Disclosure 描边被裁、展开故事标题左边条），5 包 3 波约 435 响应；C8 判为门判定语义的放宽、归 A 类（O-19），登记保留、R4 不派；Owner 待裁 20 条（O-1…O-20）；预计 R4 做完只剩 Owner 阻点。
- R3 链写：一个 work-batch 140 成员（R3 的 32 张三步转 done、SUB-178 与 191 两步到 active 交 O-19；R2 的 11 张、R1 的 12 张承接项已满足转 done；16 张 Story 与 INIT 注解），WORKSPACE_COMMAND_COMPLETED，version 2228 → 2368；读回 R1 done 23 / active 5、R2 done 35 / active 2、R3 done 32 / active 2，余 9 张 active（113、114、125、127、137、142、155、178、191）都只等 Owner。
- 知识卡 TCRN-DS-KB-036…040 全部 KNOWLEDGE_UNIT_CREATED。

### R4

- 拆分：einzbern-economy 单独一次，输入 `runs/r3/judgment.md` §2（R4-1…R4-9）、§3.1 默认、§3.4、§5；包名用 N1…N5（避免与 R3 的 M 包混淆）；Subtask 键号从 `TCRN-DS-SUB-212` 起；产出写 `runs/r4/`。

- 拆分（ab2cd15）：13 张 Subtask（SUB-212…224）、5 包 3 波（N1 经济、N2 主力、N3 主力 W1；N4 经济 W2；N5 主力 W3），约 435 响应；问题 11 条（R4-2 的焦点探针要在 geometry-measure-proof 里自找 story；R4-7 (e) 收紧可能让 tokens:proof 出新发现，只记）。
- 开工链写：13 个 work-create，WORKSPACE_COMMAND_COMPLETED，version 2368 → 2381；读回零差异（planned）。
- 跨包通告 `runs/r4/excerpts/cross-notes.md`。W1 已派：N1（einzbern-economy）、N2、N3（einzbern-main），包树 scratch `pkg/r4-n1…n3`。

| 包 | 状态 | 包内提交 | 合入 | 备注 |
| --- | --- | --- | --- | --- |
| N1 | 已合入，包树已退役（277 MB） | 855b3a4、311704d、cb2c43c、f587342、ef1a8d2 | 3d2f13c | 四张完成：标按钮与飞行标 data-logo 改标 id、paperFocusRing 真件 9 处 0 违规、Disclosure 描边画出；ui-react 258、test:dom 60；contract:static 只剩 C8 15（待 O-19）；问题 4 条 |
| N2 | 已合入，包树已退役（277M） | f29fb30、54fc3f5、6a94ce6 | 593332a | 两张完成：9 个根类入家族表（未归属 9 → 0）、故事截图拍全（154 条高故事自检全过）；contract:static 只剩 C8 15（O-19）；browser-proof 152 条高故事签名越容差交 SUB-224 重收；问题 5 条 |
| N3 | 已合入，包树已退役（277M） | 791f40f、ac07f65、59d8479、3921903、08dd0cb | ce5501d | 三张完成、SUB-219 部分（doc-shell-class-proof.mjs:147 注释串不在本包）；左边条去掉（box-shadow none、左内距 0）、6 个死类删除、四道门过期读法改正、收紧后新发现 0；局部门全 0；问题 7 条 |
| N4 | 已合入，包树已退役（277M） | ea4eb5b、c091b11、cda0c6a | 1a4e268 | 两张完成：map.json 同步、README 38、迁移说明开头与分消费方清单、M49–M52；局部门全 0；问题 2 条（M30 块数过期交判断） |
| N5 | 已合入，包树已退役（327M） | 577e04b、c9f36bb、0d9c6a7、0b727ff、869914e、a68f389、d5d22ee | b01ee53 | SUB-224 完成：视觉签名重收 169 条（拍全 144、拍全加去左边条 8、去左边条 17），无预期外；browser-proof、tokens:proof、geometry:proof、visual-proof、doc-shell、contracts、hardening、pack:smoke、scan 全 0；geometry:measure 只剩 markText（O-4）；12 个 A 类离群与 14 行大变化写进 owner-acceptance.md；问题 4 条 |

- 批末 verify（`tools/batch-end-verify.sh 4`）跑在 682fc94，2026-10-14T10:56:05Z–11:04:50Z：30 步只剩 2 步红，与 R3 相同——`contract:static` 只有 C8 15 条（O-19）、`geometry:measure` 只有 markText（1.4 与 1.7，O-4）；`storybook:build` 退出 0；结果表 `runs/r4/verify/steps.md`（00986b9）。
- 批末验收：三片并行（einzbern-main），摘录 `runs/r4/excerpts/acceptance-{A,B,C}.md`（00986b9）。

- 批末验收交回并提交（633c8fa）：A——137–141 机判满足，135（O-19）、136（O-8）阻于 Owner，返工 A4-1（`owner-acceptance.md` 两处）；B——142、144 满足，143（O-19）、145（O-4）阻于 Owner，146 部分（B4-1 Disclosure 焦点环被裁 2px），返工 B4-1、B4-2（M30 过期）；C——147、150 机判满足，148（O-2）、149（O-4、O-19）阻于 Owner，返工 C4-1（三处过期文字）、C4-2（门脚本空读回，可推迟）。三片无新 Owner 事项、无不可接受口径、无回退。
- 判断：einzbern-main 单独一次，摘录 `runs/r4/excerpts/judgment.md`（525ba45），产出 `runs/r4/judgment.md` 与 `runs/r4/lessons.json`。

- 判断（4c86f1d）：机判满足 9（137–142、144、147、150）、部分 1（146：Disclosure 获焦焦点环被裁 2px，硬线可返工）、阻于 Owner 6（135、143 O-19；136 O-8；145 O-4；148 O-2；149 O-4 与 O-19）；R5 返工 4 条两包（Q1 主力：R5-1 裁切余量改 `--tcrn-space-1`；Q2 经济：R5-2 迁移 M53 补正 M30、R5-3 `owner-acceptance.md` 跟上、R5-4 注释），适用小轮合并；C4-2 与同族门读法余项不进 R5，记收口已知差距；Owner 待裁 20 条，无新增。
- R4 链写：54 成员（R4 的 11 张三步转 done、SUB-216 与 219 两步到 active 由 R5 承接；16 张 Story 与 INIT 注解），WORKSPACE_COMMAND_COMPLETED，version 2381 → 2435；读回 Subtask 113–224 done 101、active 11。
- 知识卡 TCRN-DS-KB-041…045 全部建成（041、045 标签重叠，以 `--coexist` 建）。

### R5（小轮）

- 拆分：einzbern-economy 单独一次，输入 `runs/r4/judgment.md` §2（R5-1…R5-4）与 §5；包名 Q1、Q2；Subtask 键号从 `TCRN-DS-SUB-225` 起；产出写 `runs/r5/`。之后 Q1（主力）→ Q2（经济）→ 批末 verify → 验收与判断合一（einzbern-main 一个代理）→ 链写 → 收口。

- 拆分（2ff4415）：4 张 Subtask（SUB-225…228）、2 包 2 波（Q1 主力 W1：SUB-225；Q2 经济 W2：SUB-226 → 227 → 228，前置 Q1），约 115 响应；问题 8 条（SUB-226 的 grep 另排除迁移说明 M50 的删除记录；SUB-225 的用例只读 actions.css.ts 那条 outline 规则；回执「实质变化」按 C-9 (b) 只认读数或判定变化）。
- 开工链写：4 个 work-create，WORKSPACE_COMMAND_COMPLETED，version 2435 → 2439；读回零差异（planned）。
- 跨包通告 `runs/r5/excerpts/cross-notes.md`。W1 已派：Q1（einzbern-main），包树 scratch `pkg/r5-q1`，摘录 `runs/r5/excerpts/Q1.md`。

- 库门：Owner 已在 Atelier 声明 `verify`（covers 含 INIT-015 的 12 张与 INIT-016 的 16 张），引擎已是 2.0.3。按 START 第 2 步对 INIT-015 的 12 张跑 `gates-run` 三次都在执行 verify 前被拒（`GATES_PROJECT_UNKNOWN`：本机登记的 DS 条目没有 projectId）；补登记写本机设备配置，交 Owner（`runs/r5/problems/main.md` M2，收口文件写明命令）。START 写的「13 张」实为 12 张（M3）。

| 包 | 状态 | 包内提交 | 合入 | 备注 |
| --- | --- | --- | --- | --- |
| Q1 | 已合入，包树已退役（328M） | 14f2849、5d9676a | a7d4ac8 | SUB-225 完成：内层裁切余量改 space-1，焦点环四边完整（三视口、夜间、forced-colors 仿真）；变异判红 257/258；ui-react 258、test:dom 60；contract-static 只剩 C8 15（O-19）、geometry:measure 只剩 markText（O-4）；browser-proof 签名 0 回退；C-9 无提交；问题 5 条 |
| Q2 | 已合入，包树已退役（278M） | f6200d9、e036e53、1d1e609、c5959ad | 73bac9f | 三张完成：注释换在用类（grep 0）、M53 与开头区间、清单、CHANGELOG 同步、owner-acceptance 跟上第四、五轮（432 行）；局部门 8 个全 0；问题 4 条（scaffold-proof.json 输入摘要自 R3 过期，交收口） |

- 验收与判断合一（880f673）：R5 四张与承接的 SUB-216、219 全部满足；机判满足 9、只等 Owner 7、部分 0；R6 无返工，建议收口；Owner 待裁 21（新增 O-21 本机登记缺 projectId）。
- 引擎 2026-10-14T13:20:31Z 由 2.0.3 切到 2.1.0；13:43:31Z 在 2.1.0 下重试一次 INIT-015 的门运行，同样 `GATES_PROJECT_UNKNOWN`（`gatesProjectRoot` 逻辑未变）。
- R5 链写：32 成员（SUB-225…228 三步转 done、SUB-216 与 219 一步转 done、16 张 Story 与 INIT-016、INIT-015 注解），WORKSPACE_COMMAND_COMPLETED，version 2439 → 2471；读回 SUB-113…228 done 107、active 9（只等 Owner）。
- 知识卡 TCRN-DS-KB-046…049 全部建成（048 与 KB-012 标签重叠，以 `--coexist` 建）。
- 收口文件 `docs/dispatch/2026-10-13-tab-shell/closeout.md` 已写出。

- 收口提交 d17f889（收口文件与本文件）；随后在集成树重跑 `scaffold:proof` 与 `scan`（都退出 0），两份回执 `docs/verification/scaffold-proof.json`（CHANGELOG 与 ui-tokens `index.ts` 两个输入摘要）与 `docs/verification/internal-alpha/no-overclaim-scan.json`（scannedFiles 669 → 962）一笔提交 57625c6。
- INIT-016 收口注解：WORKSPACE_COMMAND_COMPLETED，version 2471 → 2472，head 082f09285fea…；读回 INIT-016 active，注解在。
- 最终 HEAD：记录本条的提交（本文件的最后一笔，前一笔 57625c6）；`git status --short` 为空。

### R6（Owner 完整授权）

- 2026-10-16 Owner：引擎已改好，可配置门（可附加到工单的门、按需加进配置复用），随后给本轮完整授权：待裁项按建议定下并做到本阶段交付，交付后一次目视、一次提出、一次修改。
- 门配置（纪要 TCRN-DS-MIN-20261016-GATES，minutes:770128917565162256d1d232，D1–D3）：`verify` 收为 covers `**` 的必需门（order 1）；新声明非必需门 `storybook-build`（order 2）与 `test-dom`（order 3）；INIT-015 附 `storybook-build`，INIT-016 附两道；本机登记补 projectId（O-21 解除）。读回：门 3 道，Story 120 的适用门 verify 与 storybook-build，Story 146 另加 test-dom。
- 处置（纪要 TCRN-DS-MIN-20261016-R6，minutes:019a51580fa65197f0f4630c，D1–D8）：O-1 至 O-20 与 INIT-015 的 S-6 全部按建议落地，推送与发版仍是停点。链 version 2472 → 2479。
- INIT-015 先跑门：main@69aa195 上 `gates-run --base 69aa195 --work-id <12 张>`，运行 20261015T194045Z-3b858b79aa07：`storybook-build` 绿，`verify` 红（输出超 1 MiB 被截断）；在主检出逐步复跑定位（会话 scratch `main-verify/`），结果决定 INIT-015 是单独再跑还是随 INIT-016 合入后一起跑。
- 会话 scratch 在两次会话之间被系统回收：R1–R5 的逐段日志、链导出与工具都已不在；工具按原样重写（`tools/`），链导出重新导出（`chain/src/`）。仓内各轮 `steps.md` 与交回物不受影响。
- 拆分：einzbern-economy 单独一次，输入 `runs/r6/brief.md`（R6-1 至 R6-12）；包名 S1…；键号从 `TCRN-DS-SUB-229` 起；产出写 `runs/r6/`。

- 主检出逐步复跑：30 步只有第 19 步 `storybook:visual-proof` 红（草案板 `V2-B2-Shell-Draft*` 没有映射条目，是开单提交 d910ccb 带进 main 的，候选分支已补）；INIT-015 的 12 张改为随 INIT-016 合入 main 后同一次跑门转 done（`runs/r6/problems/main.md` M2）。主检出已收干净。
- 拆分（3b4dc48）：16 张 Subtask（SUB-229…244）、9 包 5 波，约 625 响应：W1 S1（主力 30）、S2（主力 110）、S3（主力 40）；W2 S4（主力 95）、S5（经济 20）、S6（经济 40）；W3 S7（主力 110）；W4 S8（经济 90）；W5 S9（主力 90）。问题 16 条，主线程裁定见 `runs/r6/excerpts/cross-notes.md` 第 2 节（第 4 条 STORY-145 文字由主线程链写改；第 5 条预先允许 brandProductId 改可选；第 7 条先占满正文列）。
- 开工链写：16 个 work-create，WORKSPACE_COMMAND_COMPLETED，version 2479 → 2495；读回零差异（planned）。

| 包 | 状态 | 包内提交 | 合入 | 备注 |
| --- | --- | --- | --- | --- |
| S1 | 已合入，包树已退役（279M） | 31b7649、00b843f | b18d845 | SUB-229 完成：roles.json 两字段与出处、C8 两层只跳两项、clauses.md 与 README 写明、自检 3 条；contract:static 0 发现（测试 77/77）；去字段判红 15、复原 0；问题 0 红、3 条非红 |
| S2 | 实施中（einzbern-main，包树 scratch `pkg/r6-s2`，摘录 `runs/r6/excerpts/S2.md`） | — | — | SUB-230 → 231 → 232 |
| S3 | 已合入，包树已退役（279M） | ced3777、fee5399 | 0aaeb99 | SUB-233 完成：越右缘向左展开（DOM 用例与 Chromium 探针读数），不越界时与改前相同；ui-react 259、test:dom 62；geometry:measure 只剩既有 markText（归 S2）；问题 4 条，三条补派 S4 |
| S4 | 待 W1 | — | — | SUB-234 |
| S5 | 待 W1 | — | — | SUB-235 |
| S6 | 待 W1 | — | — | SUB-236 → 237 |
| S7 | 待 W2 | — | — | SUB-238 → 239 → 240 |
| S8 | 待 W3 | — | — | SUB-241 → 242 |
| S9 | 待 W4 | — | — | SUB-243 → 244 |

## 下一步

- R6 拆分交回 → 建单 → 分波实施 → 批末 verify（含 storybook:build、test:dom）→ 三片验收 → 判断 → 链写与知识卡 →（R7 若有）→ 合入 main、跑门、28 张转 done → 收口与目视清单 → 交付汇报。
