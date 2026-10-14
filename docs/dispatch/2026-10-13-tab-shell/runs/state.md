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
| K9 | 在跑（自 9d4fabe 后的集成 HEAD；另加附录 `runs/r2/excerpts/K9-addendum.md`：storybook-smoke.mjs 三处过期期望归 K9） | | | |
| K6b | 已合入，包树已退役（275 MB） | 56f1f6c、b2a9158 | c7f36e9 | SUB-156 完成：面包屑分隔符读 token、C2 与 C7 余项清零、页头 DOM 调整、兜底焦点改为随主题声明（Tab 819 停点浅深两根读数改前改后一致）；contract:static 82 → 34（C11 余 34），仍因第 524 行测试退出 1；ui-react test 246/246；问题 5 条；已消息 K9、K11：交回前合入集成分支（K9 收 K6b 迁移条目） |
| K11 | 在跑（自 9d4fabe 后的集成 HEAD） | | | |
| K12 | 待起（其余 12 包全部合入后手动起） | | | |

- K12 的前置在包表里写成「其余全部」，调度工具不认，等其余 12 包全部合入后手动起。

## 下一步

- R2：K6、K8 交回后合入；K6 合入起 K6b，K6 与 K8 都合入起 K9、K11（W4）；其余 12 包全部合入后起 K12（W5，含 SUB-177 批末再生）。之后批末 verify（`tools/batch-end-verify.sh 2`）→ 验收（三片）→ 判断 → 一次链写与知识采集 → 下一轮或收口。
