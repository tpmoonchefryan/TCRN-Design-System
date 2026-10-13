# TCRN-DS-INIT-015 收口（G+ 焕新第一批）

INIT-015 的实施已经做完，停在推送之前：候选分支 `claude/init015-gplus-renewal` 只在本地；代码与生成物停在 510c972，在这个 HEAD 上 `corepack pnpm@10.12.1 run verify` 退出 0、`corepack pnpm@10.12.1 run storybook:build` 退出 0。15 张 Story 中 13 张的机器判据全部满足，130 与 134 的判定人写明是 Owner。链上 15 张仍是 active，因为引擎要求库里先声明覆盖该 Story 的必需门才允许转 done；声明门是库的持久配置，只有 Owner 能定（第 3 节 S-1）。剩下的工作全部等第 3 节的 Owner 决定，每项附了建议和不答复时的处理。

## 1. 候选与证据

| 项 | 值 |
| --- | --- |
| 工作树 | `/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init015-gplus-renewal` |
| 分支 | `claude/init015-gplus-renewal`，自 DS main b321d10 切出（中途快进到 5814699）；没有上游，没有 tag |
| 验证过的 HEAD | 510c972（R4 合入）。之后只提交了 `docs/dispatch/2026-10-11-gplus-renewal/` 下的调度记录、本文件与刷新的 no-overclaim 回执；最终 HEAD 记在 `runs/state.md` |
| verify | 510c972 上 2026-10-12T23:56:26Z 至 2026-10-13T00:05:47Z 跑完，退出 0；R3 末在 3f9d658 上同样退出 0。R3 末另按 30 步 44 段逐段跑过一遍，全绿（`runs/r3/verify/steps.md`） |
| storybook:build | 510c972 上退出 0（2026-10-13T00:05:49Z）；37 个 HTML 页；字体 54 个文件 3,410,312 字节、5 份许可；forbiddenHits 为空 |
| internal-alpha 读数 | requiredStoryCount 66、screenshotCount 310、axeViolationCount 0 |
| pack:smoke | ui-tokens、ui-copy-state、ui-react 三个 4.0.0 tarball，sha256 前缀 609c8d62、9130b42e、742d6fc1（`runs/r3/handoff/P4.md` 第 6 节）；R4 批末 verify 里再次通过 |
| 视觉签名基线 | sha256 162d5aca… → 42fb42b1…（R3 写入 192 条）→ 6a3d641e1380（R4 写入 3 条）；每条带理由与前后签名，记录在 `docs/verification/internal-alpha/visual-selection-application-r3.json` 与 `visual-selection-application.json`。只表示按当前渲染接受签名，不是目视通过 |
| 链（DS 库） | version 1859，head eb8e8b6b…；Subtask 112 张全部 done；Story 15 张 active；INIT-015 active |
| 知识卡 | TCRN-DS-KB-007 至 KB-025，逐张读回 |

verify 每次跑完，工作树都会多出两处改动：`docs/verification/internal-alpha/no-overclaim-scan.json` 的 scannedFiles 计数，和 browser-proof 运行时生成的未跟踪文件 `visual-selection-result.json`。两者不影响退出码；本文件提交后已重跑 `pnpm scan` 并提交刷新的回执，`visual-selection-result.json` 不入仓。

## 2. 15 张 Story

| Story | 机器判据 | 判定人 | 链上 | 剩余 |
| --- | --- | --- | --- | --- |
| 120 色彩轮廓 token 与对比度门 | 满足 GWT1–5 | 门判，Owner 目视另行 | active | S-1 后转 done；目视（S-4） |
| 121 字体与形状动效 token | 满足 GWT1–5 | 门判，目视另行 | active | S-1；S-4 |
| 122 契约数据与生成脚本 | 满足 GWT1–4（4 条字面字号按 O-6 保留） | 门判 | active | S-1 |
| 123 Typography | 满足 GWT1–4 | 门判，目视另行 | active | S-1；S-4 |
| 124 Icon | 满足 GWT1–4 | 门判与 Owner 目视 | active | S-1；S-4 |
| 125 Actions | 满足 GWT1–5 | 门判，目视另行 | active | S-1 |
| 126 Inputs | 满足 GWT1–5 | 门判与 Owner 目视 | active | S-1；S-4（清单第 170、175 行） |
| 127 Brand | 满足 GWT1–4（依 O-1、O-3） | 门判与 Owner 目视 | active | S-1；S-4（第 128–135 行） |
| 128 文档层清零 | 满足 GWT1–3 | 门判 | active | S-1；N-2 |
| 129 矩阵与构图一样板 | 满足 GWT1–3（机器判据） | 门判与 Owner 目视 | active | S-1；S-4（第 73–78 行） |
| 130 画布板到 story 映射 | 机器侧满足 GWT1–2（23/23 行） | Owner | active | S-2 |
| 131 八项 DOM 测量门 | 满足 GWT1–4（十项，含 shellFrame） | 门判 | active | S-1 |
| 132 契约静态门 | 满足 GWT1–4 | 门判 | active | S-1 |
| 133 门接入 verify 与 CI | 满足 GWT1–3 | 门判 | active | S-1 |
| 134 4.0.0 候选 | 满足 GWT1–3；前置「EPIC-039 至 042 全部 Story done」未满足 | Owner | active | S-1 → S-2 → S-3；不发版（S-5） |

每轮的逐条证据在 `runs/r<n>/acceptance/`（R4 为 `runs/r4/acceptance.md`），结论在各轮 `judgment.md` 第 1 节。

## 3. 待 Owner 决定

### 3.1 只有 Owner 能做的事

| 编号 | 事项 | 建议 | 不答复时 |
| --- | --- | --- | --- |
| S-1 | 库门配置：DS 库读回 0 个门；R2 链写时 8 张 Story 转 done 被引擎整体拒绝（`WORK_DONE_GATES_NOT_COVERED`），现在 13 张机器判据满足的 Story 同样转不了 | 在 DS 库声明一个已启用的必需门，命令为根 verify，工单覆盖精确列出 STORY-120…134；在收口 HEAD 上按各 Story 的 `--work-id` 加 `--base <commit>` 跑 gates-run，之后由实施侧把 13 张转 done | 15 张保持 active，summary 写「转 done 待库门配置」 |
| S-2 | STORY-130 判定：映射 23 行全绿，删一个 story 判红；差异 10 条都带出处，待 Owner 知悉 3 条（DIFF-7、8、9） | 判通过 | 保持 active；134 的前置随之不满足 |
| S-3 | STORY-134 判定：版本面 7 处读回 4.0.0，pack:smoke 与发布段证明通过；前置要 120–133 先 done | 在 S-1、S-2 之后结合 S-4 一并判 | 保持 active；不发版 |
| S-4 | 目视验收，清单 `docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md` | 一次看完；优先看只带底盘与文档壳两类理由的 29 条签名（名单在清单第 250 行的 P18）、R4 重收的 navigation-focused-shells-spec 三个视口、构图一壳几何在手机与 1024 宽（第 73–78 行）、Brand 第 128–135 行、Inputs 第 170、175 行、夜间文档页侧栏的分类计数（第 245 行） | 机器结果不代签；目视不通过的项按新工作开单 |
| S-5 | 推送 main、打 tag、发版、部署 | 在 S-1 至 S-4 之后 | 分支只在本地 |
| S-6 | 画板修订四处：Inputs 板补只读获焦 rf 一行；Inputs 板快捷键 ink-3 改 ink-2；Brand 板夜间说明的 TMS 色改 #7aa0f5（DIFF-10）；底盘板 kv 表「侧栏 212 · 顶栏 48」改 220/52（DIFF-3） | 设计权威侧一次改完 | 差异照记在映射里，不阻断本 INIT |
| 安全 | R1 的 W1-C 子代理会话里打印出了本机 npm 的 authToken | 轮换该 token | 风险保留 |

### 3.2 新提出、要 Owner 二选一或表态的事项

| 编号 | 现象与影响 | 建议 | 不答复时 |
| --- | --- | --- | --- |
| N-1 | 文档导航分类计数（`.tcrn-doc-nav__category-count`，`apps/storybook/src/alpha-styles.ts`）自带半透明底，ink-3 字；浏览器实测浅色 5.17、夜间 4.45，夜间低于 4.5。axe 报 0 是因为这个类从未进入 axe 结果 | 文档层把这条字色改 ink-2（静态约浅色 7.87、夜间 7.00），只改文档层一条声明 | 保持现状；目视时核对 |
| N-2 | 独立导航件在 Storybook 里两种外观：知识库样板的 TopBar 经 4 条文档作用域例外显示 52 高、侧栏改画布色；构图三的 TopBar 是包默认 68 高。其中 side-nav 一条放行 background，与 STORY-128「Storybook 只渲染包」相抵；样板里已加可见说明 | 维持现做法（方案 A）到 Navigation 家族批次，届时删除 4 条例外与 2 条白名单项 | 维持方案 A；改选方案 B 要改 shell:parity 的比对数据 |
| N-3 | 构图一样板在 1024 宽下壳顶栏长到 147 高（工具行折行）；门只量 1440×900 | 列为已知差距，归 Navigation 或页面模板批次 | 照现状 |
| N-4 | 知识库样板顶栏描述截成一行加省略号，全文不可见 | 不接受时把描述移到样板内容区首行 | 照现状 |
| N-5 | 收起 52 栏里产品标中心 16、收起钮 26、导航图标 22，三条中心线不齐（读数来自包代理的门外脚本） | 目视定；要居中时给收起态品牌链接加居中是包内小改 | 照现状 |
| N-6 | 文档壳品牌锁定组合仍是 38 标、文案起点 66（构图一为 22、48）；文档页没有离边 12 的纸面；`page-template.tsx` 未改 | 接受为已知差距，归 Brand 或 Navigation 家族批次 | 照现状 |
| M-1 | R3 中实施侧用 SendMessage 让已交回的包代理续做集成修复（P2 的三项、P3 的 SUB-101 余项与冒烟钉值），没有另派集成代理；字面上偏离批量原则第 2、3 条，事先没有取得同意。结果经批末 verify 与验收复核无问题 | 表态是否认可「前置包带出、落在同一包文件集的集成后果，由原包代理续做」 | 今后按字面另派集成代理 |
| O-8 | Brand 规格保持 B1（字标 500 加后缀 600，标 38/28/22） | 在清单第 247 行点名确认 | 保持 B1 |

### 3.3 已按建议先做、Owner 可事后更正

| 来源 | 内容 | 撤回范围与记录 |
| --- | --- | --- |
| 设计会话 B 类裁定（2026-10-11） | O-1 授权 ProductShell 构图一几何：引导列 16/48、纸离边 12、顶栏 52、侧栏 220 与收起 52、侧栏画布色无右边线，数值取自 4 个新壳 token（220、52、52、14）；O-2 随之解决；O-3 TMS 夜间后缀 #7aa0f5 并撤两条夜间豁免；O-4 DIFF-3 以 220/52 为准、补构图三样板 | 撤回 O-1 约一个主力包，127-GWT4、129-GWT3、130 样板 10 行、131-GWT4 回到阻塞；逐条见 `runs/r4/judgment.md` §3.2 |
| 按默认执行 | O-5 外壳切换钮尺寸维持；O-6 不新增组件内几何 token（typography.scale 余 4 条字面值）；O-7 Typography API 维持；O-9 edge 抬升层字面量维持；O-10 只改注释；O-11 不加 3500 字；O-12 字体许可维持，不对许可合规下结论 | `runs/r4/judgment.md` §3.3 |
| R1 设计会话 B 类裁定 | `.tcrn-icon` 基类进包（`packages/ui-react/src/styles/icon.css.ts`） | `runs/r1/problems/main.md` M5 |
| 实施侧 B 类选择 | SUB-101 方案 A：4 条文档作用域例外与 2 条重复选择器白名单项，删除条件为 Navigation 家族批次 | `runs/r3/problems/main.md` R3M5、R3M6；N-2 |
| 判断的 B 类裁定 | R3、R4 判断 J-1…J-16（如 shell-parity 与冒烟的旧几何钉值改为 O-1 几何、visual-selection 记录的保留方式、不开 R5） | `runs/r4/judgment.md` §3.6；更早各轮见 R1 判断 §3.4、R2 判断 §3.3 |
| 各包自定取舍 | 每包交回里的回显节，验收逐条判为可接受或有条件 | R2 判断 §3.5、R3 判断 §3.7、R4 判断 §3.7 |

## 4. 已知差距（不阻断本 INIT，归后续批次）

- 7 处应用 README 句子、脚本注释与测试标题仍写「eight」测量（R4A-F1）。
- doc:sample-style 的 package-context 142 处；第二批以后家族的旧焦点写法与按压缩放；Field 其余外观；AI 消费契约未暴露弃用名（R1 判断 §3.3）。
- 门的覆盖范围：几何门与映射门只量 1440×900、en；ja 检查与 localeLeakScan 读不到 title；clipped 只在英文下跑；规则级守卫不拦按 data 属性命中包组件的规则；390 宽文档壳顶栏 401 高、品牌字出现两次；手机视口部分截图下半部空白（`runs/r4/judgment.md` §3.8）。
- N-3 至 N-6。

## 5. 执行记录（影响 Owner 下一步的部分）

- 本周额度在 R3 中途触顶，2026-10-11 约 19:00 至 10-13 05:00（本地）停在原地，重置后接续，没有为额度改方法。
- 本会话的系统提示里带有一条从上层会话继承的「Design System 模板」指示，针对新建 Design System Artifact 的开场请求，与本实施任务无关，未据此创建 Artifact。
- 收尾清理：各轮包工作树都经 `git worktree remove` 退役（现存 0 个）；已合入的包分支用 `git branch -d` 删除（R1、R2 共 39 个，R3、R4 共 7 个）；会话 scratch 的 trash 约 1.6 GB（截图与临时构建，同盘移动、未释放空间），清空 trash 要由宿主或 Owner 做；scratch 的 tmp 约 57 MB 与各轮 verify 日志约 18 MB 是本文件引用的证据。文件系统可用空间 2026-10-13 收口时约 55 GiB。
