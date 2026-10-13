# TCRN-DS-INIT-016 · R2 拆分

本文件是 R2 拆分子代理的产出：R1 判断 §2 的返工清单 R2-1…R2-36 拆成 37 张 Subtask（TCRN-DS-SUB-141 至 TCRN-DS-SUB-177），挂在原 Story 下，分 13 个包、5 个波次。口径按判断 §3.1「不裁时的默认」（Owner 未裁前不改判据）与 §3.4（视为约定）；分包按判断 §5 的 12 包 5 波，确有冲突处的偏离写在第 2.4 节与 `packages.md`。链上 Story 的 scope 是任务权威；本文件只是拆分与分包，不是第二份 scope。拆分时发现的矛盾与缺口见 `problems/decomposition.md`，包表、波次与共享文件先后见 `packages.md`，机读清单见 `subtasks.json`，落链载荷见 `subtasks-batch.json`（37 个 work-create 成员，由主线程落链）。

读法：本文件超过 32 KB 时按节读。第 1 节是跨包约定（编号 C-1 起，每个包都必须遵守，改约定须回拆分）；第 2 节是总览（返工编号对照、依赖图、偏离、风险）；第 3 节按 Story 列 Subtask，每张一节，节标题为 `#### TCRN-DS-SUB-NNN · 标题`，可按节切摘录。文中行号是集成分支 claude/init016-tab-shell 上 HEAD 2ba0576 的位置，先 grep 再改。

## 1. 跨包约定（实施包必须遵守，改约定须回拆分）

1. **C-1 依据、沿用与作废。** 本轮工作全部来自 R1 判断 §2 的 R2-1…R2-36；Owner 待裁项按判断 §3.1「不裁时的默认」做（C-6），判断 §3.4 的口径视为约定（C-7）。R1 拆分第 1 节（`runs/r1/decomposition.md` 第 7–54 行）按下表处置，与本节冲突时以本节为准。
   - 继续有效：R1 C-1 列出的 INIT-015 约定；R1 C-3（命令形态与红线，本节 C-3 重申）；R1 C-4（新件放独立文件，新件之间只在函数体内互相引用）；R1 C-5（测量钩子，本轮 SUB-152 补齐行钩子）；R1 C-6（品牌首行 DOM 与图钉契约；SUB-143 只改字标列取宽与后缀纵向余量，不改 DOM）；R1 C-7（菜单模型与浮层；本轮只做加法，见 C-12）；R1 C-9（story id 定死；本轮新增 id 见 C-12）；R1 C-10（文案五语同源，本节 C-10 补字典分工）；R1 C-11（壳层门：读数库只读数、不含阈值，门脚本持 THRESHOLDS，夹具自带 manifest）；R1 C-16（Shell.dc.html 与 Shell-2.dc.html 是字节真值，任何包不改，不跑 build-shell2）；R1 C-17（质量硬线与停下条件，本节 C-14 补本轮的授权范围）。
   - 改写：R1 C-2（token 名表，本轮新增三条见 C-2）；R1 C-8（样式模块，见 C-8，含 M2 登记规则）；R1 C-12 与 C-13（回执、门报告与契约生成物，见 C-9）；R1 C-14（迁移说明与 CHANGELOG，见 C-11）；R1 C-15（包树、合入、提交与交回，见 C-4）。
   - 作废：R1 各条里按 R1 Subtask 与波次写的持有者名单（C-8 的 base.css.ts 改动名单、C-12 的旧几何红持有者表、C-13 的每波契约持有、C-14 的追加顺序、C-15 的 P1 四段规则），由本轮 `packages.md` 取代；R1 C-2 末句「除本表与 SUB-130 的布局 token 外本批不新增 token」由本节 C-2 取代。
2. **C-2 本轮新增 token（SUB-142 落地，全轮引用）。** 判断 R2-11 要标 22、触摸 44、面包屑图标 11 三条主题无关 token，名字属 B 类（判断 §3.4 第 5 条）。下表是本拆分定的默认名，Owner 可改名或决定不设；改名只在 tokens.json、ui-tokens `index.ts` 与引用处一次改齐。三条都进 shell 组。

   | F 段名 | key | cssVar | 值 | 用处 |
   | --- | --- | --- | --- | --- |
   | shell.mark | shell-mark | --tcrn-shell-mark | 22px | 标的边长（shell.css.ts 第 67、612 行的字面 22px） |
   | shell.touch | shell-touch | --tcrn-shell-touch | 44px | 粗指针下的行高与搜索高、Sheet 行与热区（shell.css.ts 第 137–138 行、shell-sheet.css.ts 的字面 44px） |
   | shell.crumb-icon | shell-crumb-icon | --tcrn-shell-crumb-icon | 11px | 面包屑分隔符图标（Navigation.tsx 的 `size={11}`，SUB-156） |

   粗指针切换落在 token 层：ui-tokens 在主题无关基础块之后写 `@media (pointer: coarse)` 块，把 `--tcrn-shell-row-h`、`--tcrn-shell-srch-h` 指向 `var(--tcrn-shell-touch)`；组件样式表不再写 coarse `:root`。28 = calc(2 × space-3h)、抓手 calc(3 × space-3) 视为来自 token。字号 12.5、10、11.5 不属 C10，不设 token（§3.3）。除本表外本轮不新增 token，需要时停下记问题。
3. **C-3 命令形态与红线。** 局部门一律写成 `corepack pnpm@10.12.1 -C <包树> run <脚本>`、`corepack pnpm@10.12.1 -C <包树> exec node <脚本>` 或 `corepack pnpm@10.12.1 -C <包树> --filter <包名> <脚本>`；git 用 `git -C <包树>`；不 cd、不 rm（仓内删除用 `git rm`，临时产物移进会话 scratch 的 trash）；只写包树与会话 scratch。`--filter @tcrn/ui-react test` 之前先 `--filter @tcrn/ui-react build`（dist 未构建时 0 条测试也退出 0）。不新增依赖、不改 `pnpm-lock.yaml`（安装是停点）。任何文件（含未跟踪文件、交回与问题文件）不得出现本机用户目录下凭据、钥匙串或应用数据目录的绝对路径，不得有以 KEY、TOKEN、SECRET、PASSWORD、SESSION、AUTH、API 结尾的名字（大小写都算）紧跟等号开头的行，不得写入 `scripts/no-private-input-scan.mjs` overclaim 短语表里的英文短语（摘录与交回都不抄原文）。
4. **C-4 包树、合入、提交与交回。** 集成分支 `claude/init016-tab-shell`。每包在自己的工作树（会话 scratch 的 `pkg/r2-<包小写>`）与分支（`claude/init016-r2-<包小写>`）上做，从集成分支在前置包合入后的 HEAD 切出；同一波的包并行，合入由主线程按 `packages.md` 的波次与依赖顺序做，冲突交集成子代理。按 Subtask 提交，提交信息带 TCRN-DS-SUB-NNN；git 身份与禁止事项按 START（作者 tpmoonchefryan，不加 Co-Authored-By；不推送、不打 tag、不发版、不部署）。每包交回 `runs/r2/handoff/<包>.md`：提交列表、写明的选择与回显项、「迁移条目」「目视项」「待发布清单」「待补五语键」各节（没有就写无）、局部门结果摘要、接续点；见红只记写 `runs/r2/problems/<包>.md`（同一根因算一条）。局部门只跑本包列出的门，同一门不为求稳重复跑，不跑 verify。每包不超过 150 响应，逼近 180 时提交干净状态、写接续点交回。同一修复目标被退回一次升主力，再退回记进 closeout 交 Owner。
5. **C-5 见红只记与已知红。** 包内看到不属本包返工项的红，记一句「既有红，归 R2-xx（SUB-NNN）」，不修。本轮开工时的已知红见判断 §2.7（批末 verify 63e1ee2：30 步红 9、44 段红 12）。另有几类在持有者合入前必然存在的红：storybook 包测试（smoke.test.ts）在 SUB-173 之前红；静态页无客户端挂载带来的 intro、focusLoop、noCollapse、touch 红在 SUB-151 之前存在；壳层门的 prail 在 SUB-152 之前读不到；删三族豁免后 contract:static 的余项在 SUB-156 之前可能仍在；O-4 未裁时品牌首行 story 里 DS 的 markText 预计红（problems/decomposition.md 第 6 条）。SUB-141 修好后的整跑 `run test` 是本轮第一次拿到 ui-react、storybook、pilot 的读数，首跑新出的红进 R3，不插入本轮。
6. **C-6 Owner 待裁项的默认口径（判断 §3.1）。** 未裁前不改判据、不改 Story：O-1 宽度 134 不改，长字标截断加 title，TMS 由 SUB-143 保证不截断；O-2 按四板 D 段加 07a 第 1 段，148-GWT1 记部分；O-3 级联越界维持现写法；O-4 墨迹中线照 ±1 判，145-GWT2 记部分；O-5 只改件数、不画实心态；O-6 图钉获焦时才显；O-7 文档站头像与目录维持现状；O-8 夜间后缀两主题同色、标红、pending；O-9 AOS 先用 design-system 占位并标明；O-10 头像菜单现写法；O-11 窄屏按视口切；O-12 下拉不显示 ⌘K；O-13 纸升起 10；O-14 字重按板实现；O-15 Sheet 夜间遮罩与下一级现写法。
7. **C-7 授权范围（判断 §3.3、§3.4）。** 授权外不做：抬高扫描上限；撤 searchOverlay 检查；以「控制器层即可」结掉 140-GWT3；改 Shell 两板与 07b 字句；O-5 裁前画实心态；O-1 裁前改 134；改 Story 正文；新增 type scale token；O-11 裁前把运行网格扩到 1023；导出 Overlay 的定位函数；动其它家族的豁免；在 Atelier 声明或绕过库门；推送、打 tag、发版、部署、发布画布。本轮能改的门判定语义只限判断 §3.4 第 1 条列出的各项：390 下打开的层必须是 Sheet；railReachability 改量完整菜单；parity 的 docOwn 与退役样板角色；P13 包词表（以 SUB-151 让静态桥退场为条件）；索引页「当前」认菜单当前分区行；文档壳契约改顶带壳；contrast 豁免格只列不比；axe 豁免扩到 `.tcrn-shell-brand__suffix`；noHiddenOverflow 放行没截断的 C7 载体；新增 prail 判定；css-template 正则放宽；C10 扫描扩到 shell*.css.ts；open-menus 改为从 DOM 派生。另加三族豁免按各自 until 删除（第 2 条，执行既有条款）。其余判定语义、阈值或比对字段的改动停下记问题。
8. **C-8 样式模块、段登记与段首标记。** 包样式只进现有模块（`styles/base.css.ts`、`brand.css.ts`、`shell.css.ts`、`shell-intro.css.ts`、`shell-sheet.css.ts`）；状态规则特异性不高于变体、不含颜色；几何逐值来自 token（C-2）。新样式段的登记行随段归属的包走，不按波次独占（R1 主线程问题 M2）：哪个包新建段，哪个包在 `styles/index.ts` 的 import 与级联表里登记；同一波两个包都要登记时，后合入的包在主线程通知后把集成分支合进包树、保留双方登记，再跑 css-template-integrity。本轮预计没有包新建段。段首标记的字面定死为 `/* tcrn:shell-layer-start */`：由 SUB-145 写在 `shellCss01` 第一条规则（`.tcrn-shell-brand {`）之前，在 tcrnComponentCss 里只出现一次；页模板只按它切段（SUB-170）。
9. **C-9 回执、门报告与生成物。** `docs/verification/**`（回执、视觉签名基线、各门报告）只由 SUB-177 提交；其它包跑了会写这些路径的门（internal-alpha、scan、geometry:measure、visual-proof 等），跑完 `git -C <包树> checkout -- docs/verification`，新出现的未跟踪文件移进 scratch 的 trash；`visual-selection-result.json` 永不入仓；`internal-alpha/no-overclaim-scan.json` 由主线程在最后一次文档提交时再生。契约生成物只由改了契约的单提交，且只提交头里 contract files 覆盖该契约的生成物：tokens.json 本轮只由 SUB-142 改（gplus-tokens、actions.pairs、inputs.pairs、typography.scale、matrices.generated 五个头同变）；SUB-158 只改 `scripts/contract-generate.mjs` 的注释模板，只有 `icon-paths.generated.ts` 变，其余生成物字节不变；icons.json、matrices.json、marks.json 本轮不改（需要时停下）。`owner-acceptance.md` 只由 SUB-177 改，各包把目视项与读数写进交回。
10. **C-10 文案与五语。** 沿用 R1 C-10：新壳件文案进 `components/Navigation/shell-copy.ts`，五语（en、zh-CN、ja、ko、fr）同源；story 文案进 `apps/storybook/src/build/locales/`，新英文键四语齐、四语值不与同语言其它键同值；渲染文本不含工单键与内部词；运行时换字只跳过品牌字标（SUB-166）。字典每波只一个包写：`storybook-content-text.ts` 为 W1 K2、W3 K8、W4 K9、W5 K12；`storybook-locale-text.ts` 为 W3 K8、W4 K11、W5 K12；`scripts/lib/locale-invariant-ledger.mjs` 为 W1 K2（只在 SUB-166 确需时）、W4 K9、W5 K12。K11 的新屏与品牌 story 复用已有五语来源（菜单模型标签、样板文案、品牌字标原样），标题与描述进 `storybook-locale-text.ts`；确需 `storybook-content-text.ts` 新键或台账新行时写进交回「待补五语键」，由 SUB-173 补。
11. **C-11 迁移说明与 CHANGELOG。** 两份文件本轮由 K9 写：SUB-176 只改判断点名的事实残留（CHANGELOG.md 第 164 行、迁移说明里的 #7aa0f5），SUB-158 只追加（逐件处置表与新 prop 条目），不改别人写的条目。产出新 prop、新字段、新 token 或家族变化的单（SUB-142、SUB-147、SUB-148、SUB-149、SUB-151、SUB-155、SUB-163）在交回「迁移条目」一节写一段中文，写明名字与默认值，SUB-158 照录；K6b 与 W4 的 K9 并行，若 SUB-156 产生迁移条目，由 SUB-177 在 W5 追加。
12. **C-12 本轮新接口（默认名；落地单要改名须写进交回，消费单以合入后的代码为准）。**

   | 接口 | 落地单 | 默认写法 | 消费单 |
   | --- | --- | --- | --- |
   | 段首标记 | SUB-145 | `/* tcrn:shell-layer-start */`，见 C-8 | SUB-170 |
   | 壳根 sheet 态 | SUB-159 | 菜单以 Sheet 呈现且打开时壳根 `data-state="sheet"` | SUB-160、壳层门 |
   | 行钩子 | SUB-152 | `.tcrn-nav-item__label` 上 `data-text="prail"`，行内图标 `data-guide="prail"`，NavGroup 标题行 `data-shell-group` | SUB-174（夹具先行）、SUB-150、SUB-161、SUB-177 |
   | 受控搜索词 | SUB-147 | ShellMenu `query`、`defaultQuery`、`onQueryChange`；ProductShell `menuQuery`、`defaultMenuQuery`、`onMenuQueryChange` | SUB-150 |
   | 菜单分类说明 | SUB-147 | `ShellMenuGroup.description?: string`，分类行 `aria-describedby` 指向 `.tcrn-sr-only` 说明 | SUB-150 |
   | 标题层级 | SUB-163 | PageHeader `headingLevel?: 1 \| 2`（默认 2）；ProductShell 纸内默认 1 | SUB-150 |
   | 地标名 | SUB-148 | ProductShell `landmarkLabel?: string`，作固定项 nav 与面包屑 nav 可及名的前缀 | SUB-150 |
   | 固定项拖排 | SUB-149 | ShellPins 与 ProductShell `onPinsReorder(orderedIds)`，接控制器 `movePin`；键盘 Alt+← / Alt+→ | SUB-158（迁移条目） |
   | 预览态透传 | SUB-151 | ProductShell 把 `previewStates` 传给 ShellMenu、ShellDropdown | SUB-160 |
   | 挂载入口 | SUB-151 | `apps/storybook/src/build/shell-hydrate.tsx`，由 apps/storybook 已有的 vite 打包 | SUB-150、SUB-161 |
   | 新 story 与屏 | SUB-164 定死 | 品牌首行 story `shell-brand-first-line`（navigation-shells 类目）；`shell-top-band` 加 `ts-search-l`、`ts-settings-l`、`ts-roster-l`；`shell-mobile` 加 `ts-settings-m`、`ts-roster-m` | SUB-150、SUB-161 |
13. **C-13 Owner 目视与待发布清单。** `owner-acceptance.md` 只由 SUB-177 改（C-9）。各包把新增或变化的目视项写进交回「目视项」：长字标与夜间后缀 3.07（SUB-143）、铃铛 6%（SUB-146，G-6）、拖排（SUB-149）、AOS 占位（SUB-160）。改过的板与 canvas 写进「待发布清单」（SUB-153、SUB-172），新 token 补进 F 段的请求写进交回（SUB-142），三者交设计会话，本轮不发布画布。
14. **C-14 质量硬线与停下条件。** START「质量硬线」两段（第一批 C1–C17 与壳层新增硬线）对每个包有效。遇到下列情况停下写进包问题文件，不扩大授权：要新增 C-2 以外的 token；要改 Icon 组件 API；要改 C-7 列表以外的门判定语义、阈值或比对字段；要改不在本包文件集里的文件（含别的波次持有的共享文件）；要改 Shell 两块成品板或 07b 字句；要新增依赖；要恢复已删的豁免。批内发现的新工作（钩子、title、文案等落在别包文件的缺口）只记问题，进 R3，不插入本轮。

## 2. 总览

### 2.1 返工编号 → Subtask（36 条，一条不漏）

| 返工 | 组 | 判断档位 | 事项 | Subtask | 包 / 波 |
| --- | --- | --- | --- | --- | --- |
| R2-1 | G1 | 经济 | ui-tokens 同源测试读过期路径 | SUB-141 | K1 / W1 |
| R2-2 | G1 | 经济 | ShellBrandButton 夜间后缀断言与 D7 不一致 | SUB-143 | K1 / W1 |
| R2-3 | G1 | 经济 | 首行字标：TMS 被截断，后缀越出 b 1px | SUB-143 | K1 / W1 |
| R2-4 | G1 | 经济 | 底栏锁定块按 C-6 出 DOM，侧栏尺度只留一处 | SUB-144 | K1 / W1 |
| R2-5 | G1 | 经济 | 菜单内的 C7 缺口与搜索空态 | SUB-154 | K1 / W1 |
| R2-6 | G1 | 经济 | Sheet 打开时壳根报 sheet | SUB-159 | K1 / W1 |
| R2-7 | G1 | 经济 | 清理 O-1 残留与旧顶栏尺寸，加段首标记 | SUB-145 | K1 / W1 |
| R2-8 | G1 | 经济 | 纸内滚动区可聚焦 | SUB-146 | K1 / W1 |
| R2-9 | G1 | 经济 | 纸内 PageHeader 主体对齐板 .ph | SUB-162 | K1 / W1 |
| R2-10 | G1 | 经济 | 铃铛悬停改 6% 墨洗 | SUB-146 | K1 / W1 |
| R2-11 | G2 | 主力 | 壳层几何字面值进 token，粗指针切换移到 token 层 | SUB-142（token 层与 C10 扫描）、SUB-156（面包屑图标） | K4 / W2、K6b / W4 |
| R2-12 | G2 | 主力 | 第二批三族豁免到期删除，按 C1–C17 整改 | SUB-155（豁免与样式）、SUB-156（组件余项） | K4 / W2、K6b / W4 |
| R2-13 | G2 | 主力 | NavItem、NavGroup 出 C-5 行钩子 | SUB-152 | K6 / W3 |
| R2-14 | G2 | 主力 | 固定项拖排，带键盘替代 | SUB-149 | K6 / W3 |
| R2-15 | G2 | 主力 | ShellMenu 支持受控搜索词 | SUB-147 | K6 / W3 |
| R2-16 | G2 | 主力 | 纸内页标题用 h1 | SUB-163 | K6 / W3 |
| R2-17 | G2 | 主力 | ProductShell 地标名按实例区分 | SUB-148 | K6 / W3 |
| R2-18 | G3 | 主力 | .story-body 比对副本压过壳层段 | SUB-165（比对副本）、SUB-170（改按段首标记切段） | K2 / W1、K5 / W2 |
| R2-19 | G3 | 经济 | 运行时换字的跳过范围不对 | SUB-166 | K2 / W1 |
| R2-20 | G3 | 经济 | 文档壳文案与行为三处 | SUB-166（变更日志与 Esc）、SUB-147（包侧说明字段）、SUB-150（页模板传说明） | K2 / W1、K6 / W3、K11 / W4 |
| R2-21 | G3 | 经济 | shell-fidelity 漂移与文档层弃用 token | SUB-167 | K2 / W1 |
| R2-22 | G3 | 主力 | 静态页加客户端挂载，静态桥退场 | SUB-151 | K5 / W2 |
| R2-23 | G3 | 经济 | 静态 story 修补 | SUB-160（其余修补）、SUB-150（页内壳传层级 2） | K5 / W2、K11 / W4 |
| R2-24 | G3 | 主力 | 消费新 prop：搜索结果屏、地标名、geometry-proof 宿主 | SUB-150 | K11 / W4 |
| R2-25 | G4 | 主力 | 文档与 Storybook 门按新家族改期望 | SUB-168 | K3 / W1 |
| R2-26 | G4 | 主力 | browser-proof 三处：设置溢出、回执体积、字标豁免 | SUB-169 | K3 / W1 |
| R2-27 | G4 | 主力 | 壳层门：读法与判定补齐 | SUB-174 | K7 / W2 |
| R2-28 | G4 | 主力 | 给 145、146 补门 | SUB-164（门侧）、SUB-161（story 侧） | K10 / W3、K11 / W4 |
| R2-29 | G5 | 经济 | 契约文字、oracle、台账，以及 #7aa0f5 残留 | SUB-171（story-content 读回）、SUB-176（其余） | K8 / W3、K9 / W4 |
| R2-30 | G5 | 经济 | 迁移说明与说明文档 | SUB-158 | K9 / W4 |
| R2-31 | G5 | 经济 | Icon / Typography 板与文案改为 38 | SUB-153 | K8 / W3 |
| R2-32 | G5 | 经济 | canvas.json 板高与 y | SUB-172 | K8 / W3 |
| R2-33 | G5 | 经济 | TreeNav 文档 story 演示归位 | SUB-157 | K8 / W3 |
| R2-34 | G5 | 经济 | shell-matrix 的高度、台账与治理元数据 | SUB-175 | K8 / W3 |
| R2-35 | G5 | 经济 | apps/storybook 单测与样板五语文案 | SUB-173 | K12 / W5 |
| R2-36 | G6 | 经济 | 批末生成物一次再生，验收清单同步 | SUB-177 | K12 / W5 |

判断档位是判断 §2 给每条返工的起始档；包的档位以包里最高的一条为准（`packages.md` 包表）。

### 2.2 Story → Subtask

| Story | Subtask | 包 / 波 |
| --- | --- | --- |
| TCRN-DS-STORY-135 壳 token | SUB-141、SUB-142 | K1 / W1、K4 / W2 |
| TCRN-DS-STORY-136 标按钮 ShellBrandButton | SUB-143 | K1 / W1 |
| TCRN-DS-STORY-137 顶带固定项 ShellPins | 无本单（R2-14 在 SUB-149，R2-18 在 SUB-165、SUB-170，R2-27 在 SUB-174） | — |
| TCRN-DS-STORY-138 完整菜单 ShellMenu | SUB-144 | K1 / W1 |
| TCRN-DS-STORY-139 固定二级菜单下拉 ShellDropdown | 无本单（R2-18 在 SUB-165、SUB-170，R2-22 在 SUB-151） | — |
| TCRN-DS-STORY-140 ProductShell 顶带态 | SUB-145、SUB-146、SUB-147、SUB-148、SUB-149、SUB-150 | K1 / W1、K6 / W3、K11 / W4 |
| TCRN-DS-STORY-141 登入动画 ShellIntro | SUB-151 | K5 / W2 |
| TCRN-DS-STORY-142 NavItem 图钉 | SUB-152、SUB-153 | K6 / W3、K8 / W3 |
| TCRN-DS-STORY-143 导航家族焕新 | SUB-154、SUB-155、SUB-156、SUB-157、SUB-158 | K1 / W1、K4 / W2、K6b / W4、K8 / W3、K9 / W4 |
| TCRN-DS-STORY-144 手机 Sheet | SUB-159、SUB-160 | K1 / W1、K5 / W2 |
| TCRN-DS-STORY-145 ProductLockup 首行变体 | SUB-161 | K11 / W4 |
| TCRN-DS-STORY-146 PageHeader 必有 | SUB-162、SUB-163、SUB-164 | K1 / W1、K6 / W3、K10 / W3 |
| TCRN-DS-STORY-147 Storybook 文档站改同一套顶带壳 | SUB-165、SUB-166、SUB-167、SUB-168、SUB-169、SUB-170、SUB-171 | K2 / W1、K3 / W1、K5 / W2、K8 / W3 |
| TCRN-DS-STORY-148 第一批五样板换新壳 | SUB-172、SUB-173 | K8 / W3、K12 / W5 |
| TCRN-DS-STORY-149 壳层门 | SUB-174、SUB-175 | K7 / W2、K8 / W3 |
| TCRN-DS-STORY-150 4.0.0 候选 | SUB-176、SUB-177 | K9 / W4、K12 / W5 |
| 合计 16 张 | 37 张：TCRN-DS-SUB-141 – TCRN-DS-SUB-177（STORY-137、139 没有本轮自己的单，返工项挂在 140、141、147、149 下） | 13 个包 / 5 波 |

### 2.3 依赖图

波次自上而下，同一行的包并行；方括号里是包内按序的 Subtask 号，箭头后是前置包。

```
W1: K1[141,143,144,154,159,145,146,162]   |   K2[165,166,167]   |   K3[168,169]
W2: K4[142,155] <- K1   |   K5[170,151,160] <- K1+K2   |   K7[174]
W3: K6[152,147,163,148,149] <- K4+K5   |   K8[153,172,157,175,171] <- K2+K3+K5   |   K10[164] <- K7
W4: K11[150,161] <- K4+K5+K6+K8+K10   |   K9[176,158] <- K3+K4+K6+K8   |   K6b[156] <- K4+K6
W5: K12[173,177] <- 全部
```

关键路径：K1 → K4、K5 → K6 → K11 → K12。必须串行的文件链：Navigation.tsx K1 → K5 → K6 → K6b；样式表 K1 → K4 → K6 → K6b；page-template K2 → K5 → K11；story-content K5 → K8 → K11；壳层门 K7 → K10 → K11（只改登记）；storybook-content-text K2 → K8 → K9 → K12；K3 先于 K8、K9、K12。docs/verification 只在 K12。

### 2.4 偏离判断 §5 的地方

判断 §5 的 12 包 5 波照用，并行上限 3、每包不超过 150 响应。下列四处有文件或依赖冲突，按此偏离：

1. **K6 拆出 K6b（W4）。** 判断写「K6 150（超出则 R2-14 拆成 K6b）」。本拆分给 K6 加了 R2-20 的包侧（菜单分类说明，第 4 条）后预计超过 150，所以预先拆分。拆出的是 R2-11、R2-12 的组件部分（SUB-156），不是 R2-14：R2-14 的迁移条目是 W4 的 K9（SUB-158）的输入，若 R2-14 与 K9 同在 W4 并行，K9 拿不到它；组件余项没有 W4 的下游。K6b 在 W4 与 K11、K9 并行，三者文件集不相交。
2. **R2-29 与 R2-31 落在 story-content.tsx 的文字改归 K8（W3）。** 判断写「story-content.tsx 的读回文字归 K11」「story-content.tsx:1321（归 K11）」。这些文字的五语在 storybook-content-text.ts，判断又把该字典给了同在 W4 的 K9；同一波只能一个包写字典。K8 在 W3 本来就持有 story-content.tsx 与两份字典，文字与字典键同包同波改完（SUB-153、SUB-171）。W4 的字典分工见 C-10。
3. **R2-23 的「页内另有 h1 的 story 传标题层级 2」改归 K11（SUB-150）。** 它要用 R2-16 的新 prop，而 R2-16 在 W3 的 K6、R2-23 在 W2 的 K5；W2 时这个 prop 还不存在。
4. **R2-20 的菜单分类说明拆成包侧与页面侧。** 判断要页模板把五语 category.description 传给包件，但 C-7 菜单模型 `ShellMenuGroup` 没有说明字段（ShellMenu.tsx 第 84–89 行），W1 的 K2 也不能改 ShellMenu.tsx（W1 归 K1）。包侧随 R2-15 进 K6（SUB-147，同改 ShellMenu.tsx，主力），页模板传值进 K11（SUB-150，W4 的页模板持有者）；R2-20 的其余两处（zh-CN 变更日志、语言列表 Esc）仍在 K2（SUB-166）。

### 2.5 风险

1. 关键路径是 K1 → K4、K5 → K6 → K11 → K12；K4、K5 估 150，K6、K11 估 145，都贴着上限。逼近上限时按 C-4 提交干净状态、写接续点交回；K6 的 SUB-149 排在包内最后，余项由主线程另派（文件集不变，W4 里与 K11、K9、K6b 不相交）。
2. R2-12 删豁免后的红量未知（判断 §3.2）：SUB-155 做不完的列清单，组件余项交 SUB-156，再做不完的进 R3，不恢复豁免。
3. SUB-151 要给静态页加客户端挂载，可能动 @tcrn/ui-react 的导出面，也可能要动静态构建入口；不许新增依赖，需要时停下（problems/decomposition.md 第 8 条）。
4. SUB-177 重收视觉签名要求 nonVisualProofOk 为真，任何一条非视觉红都会让选择整批被拒（P15 问题 2）；字体子集要访问 npm registry，连不上时按判断改用子集里已有的字。
5. O-4 未裁时，SUB-164、SUB-161 新接的 markText 对 DS 首行预计判红，批末 verify 会停在 geometry:measure；这是只有 Owner 能解的阻点（problems/decomposition.md 第 6 条）。
6. W1–W4 期间 storybook 包测试与若干文档门因持有者未合入而红（C-5），各包只记不修；判断一轮的读数以 K12 之后的批末 verify 为准。
7. Owner 改裁 D7、O-1、O-4、O-5 时，只回改对应单：D7 → SUB-143、SUB-176；O-1 → SUB-143；O-4 → SUB-164；O-5 → SUB-153。

## 3. 按 Story 的 Subtask

### TCRN-DS-STORY-135 · 壳 token：shell.* 与 motion.intro 进 ui-tokens，rail-w / rail-w-collapsed / topbar-h 经弃用别名退役，契约 tokens.json 同步

2 张：TCRN-DS-SUB-141、TCRN-DS-SUB-142（父单 work:1ad3c63c6fe6468a9d553758）

#### TCRN-DS-SUB-141 · ui-tokens 同源测试改读 shell-screen.mjs 的板 CSS 默认值，pnpm test 不再停在首包

- 承接：R2-1
- 包 / 波：K1 / W1（经济）；包内第 1 张
- 改动文件：`packages/ui-tokens/src/index.test.ts`
- 依赖：无
- 判据：135 符合性（同源）、148：index.test.ts 第 357–362 行不再在 build-shell2.mjs 里按行首字面找 `.scr.ts{`，改读 `docs/design/gplus-2026-10/tools/shell-screen.mjs`（第 32 行一带）导出的值或 CSS；断言语义不变——--strip-h、--tab、--panel-wx、--menu-gap、--pin-gap、--drop-w、--cascade-gap、--row-h、--pinb、--srch-h 与 tokens.json 对应条目逐个相等；`--filter @tcrn/ui-tokens test` 退出 0；随后整跑一次 `run test`，verify 05 不再停在首包（05 log:16、36）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run test`
- 注意：K1 第一个做。`run test` 是本轮第一次拿到 ui-react、storybook、pilot 的读数：各包通过数写进交回，首跑新出的红记 `problems/K1.md`，进 R3，不插入本轮（C-14）；storybook 包测试在 K12 之前预计红（C-5）。shell-screen.mjs 是画板侧文件，不改（C-16 沿用）。

#### TCRN-DS-SUB-142 · 壳层几何字面值进 token：标 22、触摸 44、面包屑图标 11，粗指针切换移到 token 层，C10 扫描扩到 shell*.css.ts

- 承接：R2-11（token 层与 C10 扫描）
- 包 / 波：K4 / W2（主力）；包内第 1 张
- 改动文件：`docs/design/gplus-2026-10/contract/tokens.json`，`packages/ui-tokens/src/gplus-tokens.generated.ts`，`packages/ui-react/src/styles/generated/actions.pairs.ts`，`packages/ui-react/src/styles/generated/inputs.pairs.ts`，`packages/ui-react/src/styles/generated/typography.scale.ts`，`apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts`，`packages/ui-tokens/src/index.ts`，`packages/ui-tokens/src/index.test.ts`，`packages/ui-tokens/src/tokens.css`，`apps/storybook/src/storybook.css`，`scripts/tokens-sync.mjs`，`packages/ui-react/src/styles/shell.css.ts`，`packages/ui-react/src/styles/shell-sheet.css.ts`，`scripts/shell-fidelity-proof.mjs`，`packages/ui-react/src/styles/index.ts`
- 依赖：TCRN-DS-SUB-162（SUB-162 是 K1 的末张，即 G1 全部合入）
- 判据：135-GWT1、135-GWT2、135-GWT4，硬线「几何逐值来自 token」（C10）：tokens.json 按 C-2 加 shell-mark 22px、shell-touch 44px、shell-crumb-icon 11px 三条主题无关 token，ui-tokens index.ts 同名、index.test.ts 逐条断言；tokens.css 与 storybook.css 的 token 块在主题无关基础块之后有 `@media (pointer: coarse)` 块，把 --tcrn-shell-row-h、--tcrn-shell-srch-h 指向 var(--tcrn-shell-touch)，shell.css.ts 第 137–138 行组件层的 coarse `:root` 删除；shell.css.ts 第 67、612 行的 22px 与 shell-sheet.css.ts 的 44px 换成 var()；C10 字面量扫描覆盖 shell*.css.ts，写入一条 196px 几何字面值的自检判红；tokens-sync --check、tokens:proof、contract:static（含 C5 主题属性集同构）、contract:proof 退出 0；五个生成物头的 contract-sha256 同变，只由本单提交（C-9）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
- 注意：token 名属 B 类（判断 §3.4 第 5 条），按 C-2 默认名落地；新 token 写进交回「交设计会话补进 F 段」与「迁移条目」。C10 扫描的现有落点先 grep：`scripts/shell-fidelity-proof.mjs` 的 spacing、pill 字面量扫描经 `scripts/lib/component-css-sources.mjs` 读包样式源，把壳层几何属性（宽高、min/max、inset、top/left、gap 等）的 px 字面量扫描扩到 shell*.css.ts，1px 细线与 calc/clamp 例外沿用现写法；自检写在门内，不新增 package.json 脚本。字号 12.5、10、11.5 不属 C10，不动（§3.3）。Navigation.tsx 面包屑的 size={11} 不在本单（SUB-156）。coarse 规则随 token 表走，页面里 token 表与组件表的先后不再影响它，page-template 不改。`styles/index.ts` 只在新建样式段时登记（C-8）。

### TCRN-DS-STORY-136 · 标按钮 ShellBrandButton：第一版纯标 / 第二版锁定块首行与标垂直居中，20 格展开收起示意，无轮廓，hover / open 3.5% 墨洗，aria-expanded 与 aria-haspopup

1 张：TCRN-DS-SUB-143（父单 work:73563c973ba4945683fbb15f）

#### TCRN-DS-SUB-143 · 标按钮与首行：夜间后缀断言按 D7，字标列取内容宽不截 TMS，后缀 em 不越出 b

- 承接：R2-2、R2-3
- 包 / 波：K1 / W1（经济）；包内第 2 张
- 改动文件：`packages/ui-react/src/components/Navigation/ShellBrandButton.test.tsx`，`packages/ui-react/src/components/Navigation/ShellBrandButton.tsx`，`packages/ui-react/src/styles/shell.css.ts`，`packages/ui-react/src/styles/brand.css.ts`，`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`
- 依赖：TCRN-DS-SUB-141
- 判据：136-GWT3、145-GWT3（R2-2）：ShellBrandButton.test.tsx 第 168–177 行浅色仍断言后缀对比度 ≥ 4.5，夜间改为断言与浅色同色，记下读数（3.07）并加 D7 pending 注，口径同 token-contrast 的 WORDMARK_EXEMPTIONS；`--filter @tcrn/ui-react test` 不再有这条既有红（M3）。136 符合性（D2）、145 符合性、148-GWT2、149-GWT1 与第一批硬线「不超出裁切祖先」（R2-3）：标按钮与 ProductLockup 首行（Navigation.tsx 第 718 行起）两处同一写法、不抽共用（§3.4 第 3 条）——字标列按板 `.ts-brand` 的 `22 auto 20` 取内容宽，外框仍 134×40、中线 26；只有超出 > 1px 才显示省略号并带 title；TMS（实宽 60.234）不截断；`b` 不再纵向裁切或给足纵向余量，`em` 行盒不越出 `b`，不移字形、不丢省略号；两份测试各补「scrollWidth ≤ clientWidth」与「em 不越出 b」两条断言。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run brand-asset:proof`
- 注意：O-1 未裁：134 不改（§3.3），长字标截断加 title；O-8：夜间后缀维持两主题同色（C-6）。长字标与 3.07 写进交回「目视项」，由 K12 补清单（C-13）。gplus 段 clip（18 log:3487–3494）与 visual-proof（19 log:4461）的读数在 K11、K12 的运行里复核，本单不跑壳层真件门。

### TCRN-DS-STORY-137 · 顶带固定项 ShellPins：标按钮隐形边界与各项间距全等 8、每项 32 高、无分割线、上限 6、第 7 项起只在菜单里标记、窄于 1024 整组收进菜单、选中态 6% 墨洗加字重

本轮没有挂在本 Story 下的 Subtask；返工项见第 2.2 节。

### TCRN-DS-STORY-138 · 完整菜单 ShellMenu：标按钮一段即开，顶 52 = 标按钮底 46 + 6、左 12、宽 952、搜索 40、三列行 32、底栏 52 放当前位置与侧栏尺度锁定块（只装饰）、无收起钮、选中 / Esc / 点外部即收、⌘K

1 张：TCRN-DS-SUB-144（父单 work:3d8ec5e9bbaaa3623c3315c8）

#### TCRN-DS-SUB-144 · 底栏锁定块按 C-6 出 DOM：svg[data-logo]、b > em 与 small，侧栏尺度只留 brand.css.ts 一处

- 承接：R2-4
- 包 / 波：K1 / W1（经济）；包内第 3 张
- 改动文件：`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`packages/ui-react/src/components/Navigation/ShellMenu.tsx`，`packages/ui-react/src/components/Navigation/ShellMenu.test.tsx`，`packages/ui-react/src/styles/brand.css.ts`，`packages/ui-react/src/styles/shell.css.ts`
- 依赖：TCRN-DS-SUB-143
- 判据：138 符合性、145、149-GWT1，壳层硬线「锁定块只装饰」「品牌资产 digest」：ProductLogo（Navigation.tsx 第 585 行起）给彩色标加 `data-logo={productId}`，与第 699 行的首行一致；底栏锁定块结构改为 `b > em` 加 `small`（C-6），仍不是 button、不在 Tab 序列（138-GWT2）；`.tcrn-shell-menu__lockup` 抄的侧栏尺度副本删除，改用 brand.css.ts 的侧栏档（C13 一处真相）；组件测试断言 `[data-lockup] svg[data-logo]`、`b > em`、`small` 存在；brand-asset:proof 退出 0。门侧 lockupDecor（16 处）、brandDigest（24 处，shell-measure.mjs 第 446–448、576–578 行）在 K11、K12 的真件运行里复核。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run brand-asset:proof`
- 注意：若必须改 ShellBrandLockup 的导出 prop，停下记问题（判断 R2-4：升主力、单独成条）。R2-18（SUB-165、SUB-170）合入后，菜单搜索与锁定块读数再复核（P1b 问题 15、18）。

### TCRN-DS-STORY-139 · 固定二级菜单下拉 ShellDropdown：从固定项纵向下拉，顶 = 项底 42 + 6、左 = 项左、宽 240、内距 6、搜索 sm 28 只搜该子树、行 32 无图标列文字起点 16；三、四级按点击向右 4 级联，同宽，高 = 左列高

本轮没有挂在本 Story 下的 Subtask；返工项见第 2.2 节。

### TCRN-DS-STORY-140 · ProductShell 顶带态：移除 sidebar 布局与钉住态，顶带 52 画布色无底无线、纸离边 12 顶 52 圆角 14 s1，固定项为每用户每产品的服务端偏好（可钉分组、项、子菜单，上限 6，可拖排），切换产品进头像菜单

6 张：TCRN-DS-SUB-145、TCRN-DS-SUB-146、TCRN-DS-SUB-147、TCRN-DS-SUB-148、TCRN-DS-SUB-149、TCRN-DS-SUB-150（父单 work:e14a7f089a9cac4c7da39d52）

#### TCRN-DS-SUB-145 · 撤 O-1 残留与旧顶栏搜索尺寸，包样式表壳层段首加稳定标记

- 承接：R2-7
- 包 / 波：K1 / W1（经济）；包内第 6 张
- 改动文件：`packages/ui-react/src/styles/brand.css.ts`，`packages/ui-react/src/styles/base.css.ts`，`packages/ui-react/src/styles/shell.css.ts`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`packages/ui-react/src/styles/index.ts`
- 依赖：TCRN-DS-SUB-159
- 判据：140 符合性（O-1 撤出）、147：删 brand.css.ts 第 198、215、216 行三条死选择器，Navigation.test.tsx 的 GWT1 不再排除 brand 段；删 base.css.ts 第 163–176 行 `.tcrn-product-shell-search` 的旧顶栏尺寸（260、margin-left auto）；`shellCss01` 的第一条规则（shell.css.ts 第 25 行 `.tcrn-shell-brand {`）之前加 C-8 定死的段首标记注释，tcrnComponentCss 里恰好出现一次、位于第一个壳层选择器之前，组件测试断言这两点；shell:fidelity 读数不回退。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
- 注意：标记只加注释、不新建段，styles/index.ts 不动；若必须新建段，按 C-8 由本包登记。页模板改按标记切段在 SUB-170（K5）；同波的 K2 仍按现有方式定位。`styles/index.ts` 只在新建样式段时登记（C-8）。

#### TCRN-DS-SUB-146 · 纸内滚动区可聚焦；铃铛悬停按 07a B 段改 6% 墨洗

- 承接：R2-8、R2-10
- 包 / 波：K1 / W1（经济）；包内第 7 张
- 改动文件：`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`packages/ui-react/src/styles/shell.css.ts`
- 依赖：TCRN-DS-SUB-145
- 判据：140、147（R2-8，axe scrollable-region-focusable 归 0）：ProductShell 的 `section.tcrn-product-shell__main` 加 `tabIndex={0}`（已有 aria-label），焦点环沿用现有规则，单测断言。140 符合性、149 contrast（R2-10）：铃铛悬停底由 3.5% 改为 6% 墨洗（板读 13.97 / 13.17，现读 14.70 / 14.14），只切换状态对变量、不写颜色字面；若 Story 正文写的是 3.5%，停下记问题。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
- 注意：铃铛读数与「已按板改，待目视」写进交回「目视项」，由 K12 改 owner-acceptance.md 的 G-6（C-13）。contrast 门的真件读数在 K11、K12 复核。

#### TCRN-DS-SUB-147 · ShellMenu 受控搜索词与菜单分类说明，ProductShell 透传

- 承接：R2-15、R2-20（包侧说明字段）
- 包 / 波：K6 / W3（主力）；包内第 2 张
- 改动文件：`packages/ui-react/src/components/Navigation/ShellMenu.tsx`，`packages/ui-react/src/components/Navigation/ShellMenu.test.tsx`，`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`packages/ui-react/src/test/shell-menu.dom.spec.tsx`，`packages/ui-react/src/components/Navigation/index.ts`，`packages/ui-react/src/index.tsx`，`packages/ui-react/src/index.test.tsx`
- 依赖：TCRN-DS-SUB-152
- 判据：140、144-GWT3（R2-15）：ShellMenu 加受控 `query` 与 `defaultQuery`，回调 `onQueryChange`（C-12 默认名），不传时行为不变；ProductShell 透传（默认名 `menuQuery`、`defaultMenuQuery`、`onMenuQueryChange`）；单测覆盖受控、非受控两条路径，现有的 Esc 与选中即收行为不变。147（R2-20 包侧）：C-7 菜单模型 `ShellMenuGroup` 加可选 `description`，有值时分类行带 `aria-describedby` 指向 `.tcrn-sr-only` 说明，无值时 DOM 不变；单测断言。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run exports:check`
- 注意：改的是 C-7 菜单模型与 ProductShell prop 面（主力）。只在新增导出类型时改 Navigation/index.ts 与 src/index.tsx、index.test.tsx。新 prop 与字段的迁移文字写进交回「迁移条目」，由 SUB-158 追加（C-11）。消费方（shell-top-band 已输入屏、文档页模板传五语 description）在 SUB-150（K11）。

#### TCRN-DS-SUB-148 · ProductShell 地标名按实例区分：landmarkLabel 作两个 nav 可及名前缀

- 承接：R2-17
- 包 / 波：K6 / W3（主力）；包内第 4 张
- 改动文件：`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`packages/ui-react/src/components/Navigation/ShellPins.tsx`，`packages/ui-react/src/components/Navigation/ShellPins.test.tsx`，`packages/ui-react/src/components/Navigation/shell-copy.ts`
- 依赖：TCRN-DS-SUB-163
- 判据：147、140（axe landmark-unique 归 0）：ProductShell 开放实例级地标名 `landmarkLabel`（C-12 默认名），作为固定项 nav 与面包屑 nav 可及名的前缀，五语由 shell-copy.ts 组装；不传时可及名与现在相同；同一壳内两个 nav 的可及名互不相同；单测断言。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run exports:check`
- 注意：不恢复 P1c 删掉的 navId、navLabel（§3.4 第 9 条）。迁移文字写进交回。文档壳与页内 story 壳各传不同名在 SUB-150（K11）。

#### TCRN-DS-SUB-149 · 固定项拖排：指针就地移位，键盘 Alt+← / Alt+→，onPinsReorder 接 movePin

- 承接：R2-14
- 包 / 波：K6 / W3（主力）；包内第 5 张
- 改动文件：`packages/ui-react/src/components/Navigation/ShellPins.tsx`，`packages/ui-react/src/components/Navigation/ShellPins.test.tsx`，`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`packages/ui-react/src/styles/shell.css.ts`，`packages/ui-react/src/test/product-shell-preferences.dom.spec.tsx`，`packages/ui-react/src/test/shell-pins.dom.spec.tsx`，`packages/ui-react/src/styles/index.ts`
- 依赖：TCRN-DS-SUB-148
- 判据：140-GWT3（137）：ShellPins 加指针拖排，项就地移位，不加板上没有的插入线、拖影、把手；键盘替代 Alt+← / Alt+→ 移动获焦项；拖排结束回调 `onPinsReorder(orderedIds)`，ProductShell 加同名 prop 并接到控制器 `movePin`，顺序写回固定项偏好（服务端偏好，不进 cookie）；shell.css.ts 只加行为属性（如 touch-action、cursor），不加视觉；DOM 测试覆盖指针拖排、键盘移动与偏好持久化（新测试文件 `shell-pins.dom.spec.tsx`）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run exports:check`
- 注意：不以「控制器层即可」结掉 140-GWT3（§3.3）。拖排要 Owner 目视（§3.5），写进交回「目视项」；迁移条目写进交回，由 SUB-158 追加。本单排在 K6 最后：逼近 150 时提交干净状态交回，余项由主线程另派（文件集同本单，W4 内与 K11、K9、K6b 不相交）。`styles/index.ts` 只在新建样式段时登记（C-8）。

#### TCRN-DS-SUB-150 · 消费新 prop：已输入结果屏、searchOverlay 宿主与 open-menus 取 DOM、两类壳分传地标名、页内壳传层级 2、页模板传分类说明

- 承接：R2-24、R2-23（页内壳传层级 2）、R2-20（页模板传说明）
- 包 / 波：K11 / W4（主力）；包内第 1 张
- 改动文件：`apps/storybook/src/contract-stories/story-content.tsx`，`apps/storybook/src/build/page-template.tsx`，`scripts/geometry-proof.mjs`，`scripts/shell-fidelity-proof.mjs`，`apps/storybook/src/contract-stories/visual-instances/aos-frontend-shell-slice.tsx`，`apps/storybook/src/contract-stories/visual-instances/aos-owner-quality-product-shell.tsx`，`apps/storybook/src/contract-stories/gplus/samples/composition-one.tsx`，`apps/storybook/src/contract-stories/gplus/samples/composition-three.tsx`，`apps/storybook/src/contract-stories/gplus/sample-stories.tsx`，`tests/fixtures/geometry-measure/shell/manifest.json`
- 依赖：TCRN-DS-SUB-147、TCRN-DS-SUB-148、TCRN-DS-SUB-163、TCRN-DS-SUB-160、TCRN-DS-SUB-171、TCRN-DS-SUB-155
- 判据：140、144-GWT3、147（R2-24）：shell-top-band 加一屏「已输入、结果展开」（屏名 `ts-search-l`，用 SUB-147 的受控搜索词）；geometry-proof 的 searchOverlay 宿主改到该屏，open-menus 从 DOM 派生、不写常数（searchOverlay 检查不撤，§3.3），geometry:proof 退出 0（10 log:5 的 overlayCount 0 与 openMenus 12 对 13 消失）；文档壳与页内 story 壳各传不同 `landmarkLabel`，axe landmark-unique 0；静态结果屏出现后删 shell-fidelity 的 EX-INIT015-doc-product-shell-search-static（until 已满足），shell:fidelity 退出 0。147（R2-23 后半）：页内另有 h1 的 story 壳传 `headingLevel` 2（SUB-163），文档页 page-has-heading-one 0。147（R2-20 消费侧）：页模板把五语 category.description 作为菜单分类说明传给包件（SUB-147 的字段），门里的计数不撤（§3.4 第 8 条），smoke 的 categoryDescriptionCount 与 internal-alpha 的 categoryAriaFailures 转绿。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
  - `corepack pnpm@10.12.1 -C <包树> run shell:parity`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
- 注意：搜索词取菜单模型里已有五语标签的前缀，地标名优先取已有五语来源，不新增 storybook-content-text.ts 键；确需新键写进交回「待补五语键」由 K12 补（C-10）。新屏同步登记到壳层夹具 manifest 的 stories.screens（只改登记，不改判定）。sample-stories.tsx 在 W5 还归 K12（R2-35），本单只动壳的 prop。

### TCRN-DS-STORY-141 · 登入动画 ShellIntro：登入成功后播一次，登入卡第三版（标 128）收敛为顶带第二版（标 22），120 淡出 + 240 位移 + 100 纸升起 ≤ 700，只用 transform 与 opacity，刷新不重播，prefers-reduced-motion 下 0 次

1 张：TCRN-DS-SUB-151（父单 work:e2def1cb6cee96bcde0ea937）

#### TCRN-DS-SUB-151 · 静态页加客户端挂载：壳 story 与文档壳浮层水合真件，ProductShell 透传 previewStates，下拉静态桥退场

- 承接：R2-22
- 包 / 波：K5 / W2（主力）；包内第 2 张
- 改动文件：`apps/storybook/src/build/page-template.tsx`，`apps/storybook/src/build/client-scripts.ts`，`apps/storybook/src/build/shell-hydrate.tsx`，`apps/storybook/src/build/write-static.ts`，`apps/storybook/src/build.tsx`，`apps/storybook/src/contract-stories/story-content.tsx`，`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`packages/ui-react/src/components/Navigation/ShellMenu.tsx`，`packages/ui-react/src/components/Navigation/ShellMenu.test.tsx`，`packages/ui-react/src/components/Navigation/ShellDropdown.tsx`，`packages/ui-react/src/components/Navigation/ShellDropdown.test.tsx`，`packages/ui-react/src/components/Navigation/index.ts`，`packages/ui-react/src/index.tsx`，`packages/ui-react/src/index.test.tsx`
- 依赖：TCRN-DS-SUB-170、TCRN-DS-SUB-146
- 判据：141-GWT1、141-GWT2（静态页上登入动画可观察）、136-GWT4、138-GWT4、139-GWT4（Esc 回焦、⌘K、点外部即收在静态页可观察）、144-GWT2（≤ 760 出 Sheet）、147、149-GWT1（intro、focusLoop、noCollapse 半边、touch 不再因无挂载而红，4 条变异可区分）：定挂载归属后一次接入——壳 story（shell-top-band、shell-narrow、shell-mobile、shell-intro）与文档壳浮层由一个小挂载入口（C-12：`apps/storybook/src/build/shell-hydrate.tsx`）水合真件；ProductShell 把 previewStates 传给 ShellMenu、ShellDropdown，story-content.tsx 里的下拉静态桥（含 `tcrn-shell-dropdown__col`）退场；挂载后 `data-shell-brand` 随视口改写；SUB-166 的语言列表 Esc 行为在水合后仍成立；「tab click: Timeout 3000ms」的原因写进交回，门的判定不改。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run exports:check`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run shell:parity`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
- 注意：不新增依赖、不改 pnpm-lock.yaml：用 apps/storybook 已有的 vite（或其自带的 esbuild）打包挂载入口；要新依赖就停下记问题（安装是停点）。窄屏按视口切（O-11 默认）。要动 @tcrn/ui-react 导出面时在 Navigation/index.ts 与 src/index.tsx 登记、跑 exports:check，写进交回「迁移条目」。P13 的包词表以本单让静态桥退场为条件（§3.4 第 1 条）。cross-notes §1 第 2 条「静态页无客户端 React」由本单收。

### TCRN-DS-STORY-142 · NavItem 图钉：24 常驻图钉位、钮 24 × 24 图标 16（名册 pin 描边 / 实心），hover 与获焦同现、aria-pressed、可见名「固定到顶带：<项名>」，分组、项、子菜单都可钉，rest 与 hover 文字盒宽相等

2 张：TCRN-DS-SUB-152、TCRN-DS-SUB-153（父单 work:27344937d9f099034b0c773e）

#### TCRN-DS-SUB-152 · NavItem、NavGroup 出 C-5 行钩子：data-text、data-guide 与 data-shell-group

- 承接：R2-13
- 包 / 波：K6 / W3（主力）；包内第 1 张
- 改动文件：`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`
- 依赖：TCRN-DS-SUB-160、TCRN-DS-SUB-155（K5、K4 的末张，即两包全部合入）
- 判据：142-GWT1、149-GWT1：`.tcrn-nav-item__label` 发 `data-text="prail"`，行内图标发 `data-guide="prail"`，NavGroup 标题行接收 `data-shell-group`（C-5）；可钉行仍以 `.tcrn-nav-item-row` 为行包裹（P2 接口）；组件测试断言钩子存在。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
- 注意：门侧（pinJitter、prail 判定与变异）在 SUB-174（K7，夹具先行）；真件读数在 K11、K12 的运行里复核。

#### TCRN-DS-SUB-153 · Icon、Typography 板与五语描述的件数改为 38：生成器用 ICON_NAMES.length 出数

- 承接：R2-31
- 包 / 波：K8 / W3（经济）；包内第 1 张
- 改动文件：`docs/design/gplus-2026-10/tools/build-icon.mjs`，`docs/design/gplus-2026-10/tools/build-typography.mjs`，`docs/design/gplus-2026-10/boards/V2-B1-Icon.dc.html`，`docs/design/gplus-2026-10/boards/V2-B1-Typography.dc.html`，`docs/design/visual-standard/boards/Icon.dc.html`，`docs/design/visual-standard/boards/Typography.dc.html`，`docs/design/visual-standard/heights.json`，`apps/storybook/src/build/locales/storybook-locale-text.ts`，`apps/storybook/src/build/locales/storybook-content-text.ts`，`apps/storybook/src/contract-stories/story-content.tsx`，`docs/design/gplus-2026-10/README.md`
- 依赖：TCRN-DS-SUB-166、TCRN-DS-SUB-160
- 判据：142 符合性、148（D4）：build-icon.mjs（第 77、171、177、193 行一带的「37 件」）与 build-typography.mjs 第 259 行改为用 ICON_NAMES.length 出数，只重生受影响的行（重生前后 diff 只落在件数文字，Actions、Inputs 两板与 Shell 两板字节不变）；Storybook 五语描述（storybook-locale-text.ts 第 148、340、532、724、916 行）、storybook-content-text.ts 第 528 行、story-content.tsx 第 1321 行、docs/design/gplus-2026-10/README.md 第 14 行的件数一并改成 38；名册仍是 38（142-GWT3），contract:proof 退出 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node docs/design/gplus-2026-10/tools/build-icon.mjs <docs/design/gplus-2026-10/boards/canvas.json 中 Icon 板的 h>`
  - `corepack pnpm@10.12.1 -C <包树> exec node docs/design/gplus-2026-10/tools/build-typography.mjs <docs/design/gplus-2026-10/boards/canvas.json 中 Typography 板的 h>`
  - `corepack pnpm@10.12.1 -C <包树> exec node docs/design/visual-standard/tools/make-standard.mjs docs/design/visual-standard/heights.json`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run public:naming:proof`
- 注意：实心态等 O-5，这次不画（§3.3）；不跑 build-shell2（C-16）。改过的板写进交回「待发布清单」（§3.2）。heights.json 只在板高真的变化时改。story-content.tsx 第 1321 行原归 K11，本拆分改归本单，与第 528 行的字典键同包同波配对（packages.md「偏离判断 §5」第 2 条）。

### TCRN-DS-STORY-143 · 导航家族焕新：NavGroup 与 TreeNav 进完整菜单与下拉，Breadcrumb 进 PageHeader，Tabs 合一（Tabs / SectionTabs / ModuleTabs / ViewTabs / SegmentedNav 归一个家族），TocRail 与书签栏作为页内空间，SideNav、SideNavCollapseButton、TopBar、ProductSwitcher、ProductLauncher 经弃用期退役

5 张：TCRN-DS-SUB-154、TCRN-DS-SUB-155、TCRN-DS-SUB-156、TCRN-DS-SUB-157、TCRN-DS-SUB-158（父单 work:1b03f6ae2b1a9e080fde1432）

#### TCRN-DS-SUB-154 · 菜单内 C7 缺口与搜索空态：分组标题与结果链接带 title，空态常显，可钉行单行截断

- 承接：R2-5
- 包 / 波：K1 / W1（经济）；包内第 4 张
- 改动文件：`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`packages/ui-react/src/styles/shell.css.ts`
- 依赖：TCRN-DS-SUB-144
- 判据：143 符合性、138、142，第一批 C7（单行截断必带 title）：非可钉 NavGroup 标题（Navigation.tsx 第 1513 行一带）包一层 `span.tcrn-nav-group__label-text[title]`；ProductShellSearch（第 1643 行起）的结果链接加 title；无匹配时空态文案常显；可钉行的 `.tcrn-nav-item__label` 改单行截断并加 title；单测覆盖四处，变异 truncatedWithoutTitle 不再报。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
- 注意：截断样式用现有 C7 写法，不新造类名以外的样式段。

#### TCRN-DS-SUB-155 · 第二批三族豁免到期删除，按 C1–C17 整改 navigation、shell、layout 旧规则

- 承接：R2-12（豁免与样式）
- 包 / 波：K4 / W2（主力）；包内第 2 张
- 改动文件：`docs/contract/exemptions.json`，`docs/contract/roles.json`，`docs/contract/families.json`，`packages/ui-react/src/styles/base.css.ts`，`packages/ui-react/src/styles/shell.css.ts`，`scripts/shell-fidelity-proof.mjs`
- 依赖：TCRN-DS-SUB-142
- 判据：143、140、146 符合性，START 质量硬线 C1–C17：删 exemptions.json 的 EX-INIT015-navigation、EX-INIT015-shell、EX-INIT015-layout 三条（until「该家族所在批次开工时删除本条」已到，§3.4 第 2 条）；跑 contract:static 与 shell:fidelity，把读出的红按条款逐条改 base.css.ts 三族段与 shell.css.ts，已知：SubNav 选中改 6% 墨洗加字重（C6），TocRail、NavItem 悬停旧写法，Surface、Divider 等布局件；roles.json 删 3 个退役壳控件后移除 families.json 的暂留块；shell-fidelity 两条导航族条件例外各按 until：search-static 留给 SUB-150 删，skip-link 不满足条件就保留；contract:static、shell:fidelity、selection:proof 退出 0，或在交回列出余项。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
  - `corepack pnpm@10.12.1 -C <包树> run selection:proof`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
- 注意：红太多做不完时在交回列清单，余项进 R3，不恢复豁免。要改组件文件（.tsx）的部分写进交回「组件余项」，由 SUB-156（K6b）做。其它家族的豁免照旧保留（§3.3）。families.json 的变化写进交回「迁移条目」，供 SUB-158 的逐件处置表取现值。

#### TCRN-DS-SUB-156 · 豁免到期后的组件余项与面包屑分隔图标 token

- 承接：R2-11（面包屑图标）、R2-12（组件余项）
- 包 / 波：K6b / W4（主力）；包内第 1 张
- 改动文件：`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`packages/ui-react/src/styles/base.css.ts`，`packages/ui-react/src/styles/shell.css.ts`，`packages/ui-react/src/components/Layout/Layout.tsx`，`packages/ui-react/src/components/Layout/Layout.test.tsx`，`packages/ui-react/src/components/DataDisplay/DomainDisplay.tsx`，`packages/ui-react/src/components/DataDisplay/DomainDisplay.test.tsx`，`packages/ui-react/src/styles/index.ts`
- 依赖：TCRN-DS-SUB-149、TCRN-DS-SUB-155（SUB-149 是 K6 的末张）
- 判据：硬线「几何逐值来自 token」（R2-11 组件部分）：Navigation.tsx 面包屑分隔符 Icon 的 `size={11}` 改由 C-2 的 shell-crumb-icon 供值，不改 Icon API。143、140、146 符合性（R2-12 组件部分）：按 SUB-155 交回「组件余项」逐条改组件文件，contract:static、shell:fidelity、selection:proof 的读数不回退；做不完的列清单进 R3。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
  - `corepack pnpm@10.12.1 -C <包树> run selection:proof`
- 注意：Icon 的 size 只收数字时，从 ui-tokens 的 JS 导出取 11，不改 Icon 组件 API；要改就停下记问题（C-14）。本包预计不产生迁移条目，产生时写进交回，由 K12 在 SUB-177 前追加（C-11）。`styles/index.ts` 只在新建样式段时登记（C-8）。

#### TCRN-DS-SUB-157 · TreeNav 文档 story 演示挪进完整菜单或下拉的上下文

- 承接：R2-33
- 包 / 波：K8 / W3（经济）；包内第 3 张
- 改动文件：`apps/storybook/src/contract-stories/story-content.tsx`，`apps/storybook/src/build/locales/storybook-content-text.ts`
- 依赖：TCRN-DS-SUB-172
- 判据：143 符合性：story-content.tsx 里 documents-and-collaboration-components-spec 与 -density-spec 两段的 TreeNav 演示挪进完整菜单或下拉的上下文；页内需要文档树时按页面内容模式写明，不拿 TreeNav 充当页内导航列；五语一起改（C-10）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run public:naming:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
- 注意：两段的 story id 不变；预算与高度变化写进交回。

#### TCRN-DS-SUB-158 · 迁移说明逐件处置表与新 prop 条目，两个 README 改六板，tcrnIconNewNames 注释改口径

- 承接：R2-30
- 包 / 波：K9 / W4（经济）；包内第 2 张
- 改动文件：`docs/migration-4.0.md`，`docs/design/gplus-2026-10/README.md`，`docs/contract/README.md`，`scripts/contract-generate.mjs`，`packages/ui-react/src/components/Icon/icon-paths.generated.ts`
- 依赖：TCRN-DS-SUB-176、TCRN-DS-SUB-149、TCRN-DS-SUB-155
- 判据：143 符合性、140、141、150-GWT2：迁移说明加家族逐件处置表——navigation 13 件、shell 9 件，每行写保留、并入 Tabs、弃用或新增，以及 families.json 的现值；MobileNavToggle 记弃用、仍计入 10 件（§3.4 第 4 条）；追加 R2-11、R2-14 至 R2-17 与菜单分类说明的条目（照录 K4、K5、K6 交回的「迁移条目」）；写明 ShellIntro「只在应用内登入成功时挂载」、壳根一屏高、纸内滚动、长页嵌壳要加画框；只追加，不改已有条目（C-11）；docs/design/gplus-2026-10/README.md 第 13 行与 docs/contract/README.md 第 51 行改为六板（shell 66 格，共 306）；tcrnIconNewNames 的注释改口径：改 contract-generate.mjs 的注释模板后重生，只有 icon-paths.generated.ts 变。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run scaffold:proof`
  - `corepack pnpm@10.12.1 -C <包树> run readme:proof`
  - `corepack pnpm@10.12.1 -C <包树> run public:naming:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
- 注意：重生后其它生成物必须字节不变（C-9）。150-GWT2 的 breaking 清单对照由收口验收做。

### TCRN-DS-STORY-144 · 手机 Sheet：390 宽顶带只留纯标加示意，一段即开全屏 Sheet（行 44、搜索 44、图钉热区 44），固定项不在顶带；滚动后导航可达（TCRN-CROSS-INC-399 门）在顶带壳上重跑

2 张：TCRN-DS-SUB-159、TCRN-DS-SUB-160（父单 work:14b2761d4ff9e55b90cd110e）

#### TCRN-DS-SUB-159 · Sheet 打开时壳根报 data-state="sheet"

- 承接：R2-6
- 包 / 波：K1 / W1（经济）；包内第 5 张
- 改动文件：`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`packages/ui-react/src/test/shell-menu.dom.spec.tsx`
- 依赖：TCRN-DS-SUB-154
- 判据：144（C-5）、149 touch：ProductShell 调 `useShellMenuPresentation()`，菜单打开且呈现为 sheet 时壳根 `data-state="sheet"`；只加状态值，不改 prop 面；DOM 测试断言。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
- 注意：cross-notes P7 行「Sheet 打开时根仍报 expanded」由本单收。

#### TCRN-DS-SUB-160 · 静态 story 修补：ts-m-s 包 sheet 呈现上下文，AOS 证明、视觉实例与构图一加定高画框，AOS 读回标明占位

- 承接：R2-23（其余修补）
- 包 / 波：K5 / W2（主力）；包内第 3 张
- 改动文件：`apps/storybook/src/contract-stories/story-content.tsx`，`apps/storybook/src/contract-stories/visual-instances/aos-frontend-shell-slice.tsx`，`apps/storybook/src/contract-stories/visual-instances/aos-owner-quality-product-shell.tsx`，`apps/storybook/src/contract-stories/gplus/samples/composition-one.tsx`
- 依赖：TCRN-DS-SUB-151
- 判据：144-GWT2、140、147：ts-m-s 包进 `shellMenuPresentationContext.Provider value="sheet"`；AOS 壳证明、两个视觉实例、构图一浅夜两块给壳加定高画框（壳本身不改）；AOS story 读回标明 design-system 是占位（O-9 默认）；proof-visual-instances 三视口各 8 处 AOS 壳标题裁切不再出现（判断 §0 第 2 条）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
- 注意：「页内另有 h1 的 story 传标题层级 2」要用 SUB-163（K6，W3）的新 prop，移到 SUB-150 做（problems/decomposition.md 第 1 条）。smoke.test.ts 的 ts-m-s 期望在 SUB-173（K12）。

### TCRN-DS-STORY-145 · ProductLockup 首行变体（第二版）：锁定块首行与标垂直居中，侧栏尺度标 22 + 字标 12.5/600，SVG 与文案取自 Brand 板 E 段原样，后缀 #2c63c8 两主题同色（夜间低于 4.5 记已知待裁）

1 张：TCRN-DS-SUB-161（父单 work:f19ca0b68e52842e947dcafc）

#### TCRN-DS-SUB-161 · 145、146 补门的 story 侧：品牌首行 story，设置页与名册页两屏（390、1440，长面包屑）

- 承接：R2-28（story 侧）
- 包 / 波：K11 / W4（主力）；包内第 2 张
- 改动文件：`apps/storybook/src/contract-stories/shell-brand-first-line.tsx`，`apps/storybook/src/contract-stories/story-content.tsx`，`apps/storybook/src/contract-stories/governance.ts`，`apps/storybook/src/contract-stories/groups/components.ts`，`apps/storybook/src/components.stories.tsx`，`scripts/lib/story-budget.mjs`，`apps/storybook/src/build/locales/storybook-locale-text.ts`，`tests/fixtures/geometry-measure/shell/manifest.json`，`tests/fixtures/geometry-measure/shell/mutations.json`
- 依赖：TCRN-DS-SUB-150、TCRN-DS-SUB-164
- 判据：145-GWT2、146 符合性（几何门）：按 SUB-164 定死的 id 与屏名（C-12）——加品牌首行 story `shell-brand-first-line`（四枚产品，每枚侧栏与锁定块两种尺度首行，C-6 DOM）供 markText 读；壳 story 加设置页与名册页两屏（`ts-settings-l`、`ts-roster-l` 在 shell-top-band，`ts-settings-m`、`ts-roster-m` 在 shell-mobile，长面包屑）；壳层门对真件跑：markText、pageCrumbs、SettingsLayout（≤ 1040 且左右等距）、SplitView（左缘 = 纸左缘 + 内距）读数出值，各自的变异判红。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/shell-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run public:naming:proof`
- 注意：品牌 story 进 navigation-shells 类目，不进 gplus- 类目，storybook-map 仍 23 行（C-9 沿用），预算 +1；story 高度超预算时按 R2-34 同法进 grace allowlist 带 owedTo。标题与描述五语进 storybook-locale-text.ts（W4 本包持有）；页面内容复用构图三设置页、名册页样板与已有五语来源，不新增 storybook-content-text.ts 键，确需新键写进交回由 K12 补（C-10）。O-4 未裁时 DS 首行 markText 预计读 1.4 > 1，照记不放宽（problems/decomposition.md 第 6 条）。

### TCRN-DS-STORY-146 · PageHeader 必有（面包屑 + 标题 + 动作，单行截断加 title）；Surface、Divider、SplitView、DetailLayout、SettingsLayout 在纸内重排；文档与设置页内容居中 1040

3 张：TCRN-DS-SUB-162、TCRN-DS-SUB-163、TCRN-DS-SUB-164（父单 work:792b63bc73100197f6f41e96）

#### TCRN-DS-SUB-162 · 纸内 PageHeader 主体对齐板 .ph：gap 14、底线 line-2、标题字形对齐板上 h2

- 承接：R2-9
- 包 / 波：K1 / W1（经济）；包内第 8 张
- 改动文件：`packages/ui-react/src/styles/base.css.ts`，`packages/ui-react/src/components/DataDisplay/DomainDisplay.test.tsx`
- 依赖：TCRN-DS-SUB-146
- 判据：146 符合性（D1 纸内首行）：PageHeader 标题行 gap 由 space-3（12）改 space-3h（14），底线由 border-subtle 改 line-2 对应的 token，标题字形对齐板上 h2（衬线 26）；只用已有 token，没有等值的就停下记问题（不新增 type scale token，§3.3）；测试断言。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
- 注意：标题选择器按类名写、不绑元素名（SUB-163 会把纸内标题改成 h1）。

#### TCRN-DS-SUB-163 · PageHeader 加可选标题层级，ProductShell 纸内默认 h1

- 承接：R2-16
- 包 / 波：K6 / W3（主力）；包内第 3 张
- 改动文件：`packages/ui-react/src/components/DataDisplay/DomainDisplay.tsx`，`packages/ui-react/src/components/DataDisplay/DomainDisplay.test.tsx`，`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`packages/ui-react/src/styles/base.css.ts`
- 依赖：TCRN-DS-SUB-147
- 判据：146、147（axe page-has-heading-one 108 处归 0）：PageHeader（DomainDisplay.tsx 第 253 行起，标题现恒为 h2，第 272 行）加可选 `headingLevel`（1 | 2，C-12 默认名），默认 2；ProductShell 纸内默认用 1，显式给了就按给的；h1 与 h2 两种渲染的样式读数相同（按类名）；单测断言。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run exports:check`
- 注意：迁移文字写进交回。页内 story 壳传 2 在 SUB-150（K11）。

#### TCRN-DS-SUB-164 · 145、146 补门的门侧：markText 读品牌 story，pageCrumbs、SettingsLayout、SplitView 三项读数与变异，all.green.html 换顶带壳

- 承接：R2-28（门侧）
- 包 / 波：K10 / W3（主力）；包内第 1 张
- 改动文件：`scripts/lib/shell-measure.mjs`，`scripts/shell-measure-proof.mjs`，`tests/shell-measure-proof.test.mjs`，`tests/fixtures/geometry-measure/shell/**`，`tests/fixtures/geometry-measure/all.green.html`，`tests/fixtures/geometry-measure/manifest.json`，`tests/geometry-measure-proof.test.mjs`
- 依赖：TCRN-DS-SUB-174
- 判据：145-GWT2、146 符合性（几何门）：markText 改读品牌首行 story（id 与各屏名按 C-12 写进壳层夹具 manifest 并在交回定死），配 padding-top 4 的变异判红；门新读 pageCrumbs（单行、省略号、title）、SettingsLayout（≤ 1040 且左右等距）、SplitView（左缘 = 纸左缘 + 内距）三项，各配一条会判红的变异，夹具自检证明会判红；all.green.html 换成顶带壳；`--fixtures`、两份单测退出 0。真件 story 由 SUB-161 出，本单对真件的运行只记读数。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/shell-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs --fixtures`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/geometry-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/geometry-measure-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
- 注意：阈值写在门脚本 THRESHOLDS，读数库只读数（C-11 沿用）。O-4 未裁：markText 照 ±1 判，不放宽（problems/decomposition.md 第 6 条）。新夹具放 `tests/fixtures/geometry-measure/shell/` 下，不改上级 manifest 的既有条目（all.green.html 的登记除外）。

### TCRN-DS-STORY-147 · Storybook 文档站改同一套顶带壳：文档壳只用包的 ProductShell 顶带态，删 tcrn-doc- 骨架的壳层部分、4 条文档作用域例外与 2 条重复选择器白名单项，文档目录改页内 TocRail，包外 tcrn- 类保持 0

7 张：TCRN-DS-SUB-165、TCRN-DS-SUB-166、TCRN-DS-SUB-167、TCRN-DS-SUB-168、TCRN-DS-SUB-169、TCRN-DS-SUB-170、TCRN-DS-SUB-171（父单 work:6fd15b4e5366871194d862ab）

#### TCRN-DS-SUB-165 · .story-body 比对副本不再压过壳层段：纳入三类壳层段并排其后

- 承接：R2-18（比对副本）
- 包 / 波：K2 / W1（主力）；包内第 1 张
- 改动文件：`apps/storybook/src/build/page-template.tsx`
- 依赖：无
- 判据：138-GWT1、139-GWT1、140、142、147、149：页模板的 `.story-body` 比对副本纳入 shellCss*、shellIntroCss*、shellSheetCss* 并排在其后，或只复制不被壳层段覆盖的规则；本单仍按现有方式（page-template.tsx 第 299 行）定位壳层段，标记切换在 SUB-170；文档页读数合板：菜单搜索 936×40、下拉搜索 228×28、菜单行 12.5、组标题 10 / 500 ink-3、chevron ink-3、≥ 1024 不显示「已固定」、静态悬停生效（判断 §0 第 1 条）；另开只含包样式的空白页对照一次（A 盲区 10）；shell:parity 包侧两处值差、continuation 8 处与 contrast 同根格归零。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run shell:parity`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
- 注意：C1-15 与 P12 问题 5 所说的「包件 CSS 偏离」不成立（§3.4 第 11 条），包件 CSS 不改。空白页对照只做读数，不入仓。

#### TCRN-DS-SUB-166 · 运行时换字只跳过品牌字标；zh-CN 变更日志单一来源；语言列表 Esc 不连带关头像菜单

- 承接：R2-19、R2-20（变更日志与 Esc）
- 包 / 波：K2 / W1（主力）；包内第 2 张
- 改动文件：`apps/storybook/src/build/client-scripts.ts`，`apps/storybook/src/build/page-template.tsx`，`apps/storybook/src/build/locales/storybook-content-text.ts`，`scripts/lib/locale-invariant-ledger.mjs`
- 依赖：TCRN-DS-SUB-165
- 判据：147，壳层硬线「品牌资产原样」（R2-19）：跳过范围只认品牌字标（标按钮 `b`、锁定块首行的 `b` 与 `em`，或文档层专用钩子），`[data-locale-invariant]` 只给台账用，锁定块描述行照常换字；AI 契约故事整块换字恢复（28 log:30），品牌字标不再被换成「TCRN 设计系统」，full-surface:proof 退出 0。147（R2-20 页面侧）：zh-CN 的 Change Log 只留一个词典来源「变更日志」；client-scripts 的 docShellLayerScript 在内层语言列表已处理 Esc 时不再关头像菜单，焦点回语言触发键（smoke 的 focus-after-escape 与 internal-alpha 的 localeMenuFocusReturnOk 转绿）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run full-surface:proof`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
- 注意：R2-20 的菜单分类说明要包件字段：包侧在 SUB-147（K6），页模板传值在 SUB-150（K11）（problems/decomposition.md 第 2 条）。台账只在 R2-19 收窄跳过范围后确需登记时改。

#### TCRN-DS-SUB-167 · shell-fidelity 漂移与文档层弃用 token：删知识库壳块与重复选择器，演示框改类名

- 承接：R2-21
- 包 / 波：K2 / W1（主力）；包内第 3 张
- 改动文件：`apps/storybook/src/story-demo-styles.ts`，`apps/storybook/src/storybook.css`，`apps/storybook/src/contract-stories/prototypes/storybook-shell-demos.tsx`
- 依赖：TCRN-DS-SUB-166
- 判据：147、135-GWT4（06.10 转绿）：删 story-demo-styles.ts 的 `.tcrn-doc-knowledge-shell*` 块与 storybook.css 两条重复选择器，按 build → demo-styles:sync → build 同步；demos 演示框类名按 P10 问题 6③ 改；构建不再出弃用 token 提示；shell:fidelity、tokens:proof 退出 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run demo-styles:sync`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/demo-styles-sync.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
- 注意：storybook.css 的 token 块不动（W2 归 SUB-142）。

#### TCRN-DS-SUB-168 · 文档与 Storybook 门按新家族改期望：parity、smoke、索引当前项、railReachability、文档壳契约、selection-grammar

- 承接：R2-25
- 包 / 波：K3 / W1（主力）；包内第 1 张
- 改动文件：`scripts/shell-parity-proof.mjs`，`scripts/storybook-smoke.mjs`，`scripts/internal-alpha-browser-proof.mjs`，`scripts/package-contract-manifest.mjs`，`scripts/selection-grammar-proof.mjs`，`packages/ui-react/README.md`
- 依赖：无
- 判据：147、149、150（口径 §3.4 第 1 条）：parity 退役 10 个样板角色、文档侧改读新壳（11 log:5）；smoke 三个 ProductShell 比较器与静态段缺的 8 项按新家族改期望（AOS 两项按占位读，检查不删；17 log:40–48）；internal-alpha 索引页的「当前」认菜单当前分区行（42 页）；railReachability 改量完整菜单（菜单高于视口时目的地仍可达，812×375、1440×900）；package-contract-manifest.mjs 的 storybookDocShellControlContract 按顶带文档壳重写，不再要求 tcrn-doc-header 等四个旧标记（第 239–243、355 行），README 检查跟着现行 prop 面（packages/ui-react/README.md 的 Storybook Shell Control Boundary 一节同步改）；selection-grammar 死分支清掉；判定只在上列范围内改。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run shell:parity`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:contracts`
  - `corepack pnpm@10.12.1 -C <包树> run selection:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
- 注意：本单须先于 R2-29、R2-35 合入（W1 已满足）。ai-consumption-contract.ts 与 smoke.test.ts 里的旧标记字样不在本单删（SUB-176、SUB-173）。同波的 K2 正在修文档页，本包读到的文档页红按 C-5 只记。跑完会写 docs/verification 的门后按 C-9 收干净。

#### TCRN-DS-SUB-169 · browser-proof 三处：放行未截断的 C7 载体，axe 豁免加字标后缀，回执逐页只留失败项并自检体积

- 承接：R2-26
- 包 / 波：K3 / W1（主力）；包内第 2 张
- 改动文件：`scripts/internal-alpha-browser-proof.mjs`
- 依赖：TCRN-DS-SUB-168
- 判据：147、146、150（30.02、30.03、30.04 随之转绿）：noHiddenOverflow 对 nowrap + ellipsis 的 C7 载体，未截断（scrollWidth ≤ clientWidth + 1）时放行，截断了仍判红；axe 字标豁免加入 `.tcrn-shell-brand__suffix`（2026-10-11 D2），夜间 TMS 仍标 pending；sidebarNoIconLabelReadbacks 改名为顶带读法，逐页只留失败项与计数，并加回执体积自检（< 1,000,000 字节）；不抬扫描上限（§3.3）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> run scan`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-hardening-proof.mjs`
- 注意：scan 读的是本地回执，跑完按 C-9 收干净；回执体积读数写进交回。

#### TCRN-DS-SUB-170 · 页模板改按段首标记切壳层段

- 承接：R2-18（改按段首标记切段）
- 包 / 波：K5 / W2（主力）；包内第 1 张
- 改动文件：`apps/storybook/src/build/page-template.tsx`
- 依赖：TCRN-DS-SUB-165、TCRN-DS-SUB-145
- 判据：147、149（R2-18 后半）：page-template.tsx 不再按 `\n.tcrn-shell-brand {` 找段，改按 SUB-145 的段首标记（C-8 定死的字面）切段；标记缺失或出现多次时构建报错（同现有 doc_shell_package_css_segments_moved 写法）；SUB-165 的读数不回退。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run shell:parity`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
- 注意：K5 第一个做；之后 SUB-151 再动 page-template。

#### TCRN-DS-SUB-171 · story-content.tsx 的读回文字改顶带壳与两主题同色说法

- 承接：R2-29（story-content 读回）
- 包 / 波：K8 / W3（经济）；包内第 5 张
- 改动文件：`apps/storybook/src/contract-stories/story-content.tsx`，`apps/storybook/src/build/locales/storybook-content-text.ts`
- 依赖：TCRN-DS-SUB-175、TCRN-DS-SUB-168
- 判据：147、150、145-GWT3（R2-29 的 story-content 部分）：story-content.tsx 里的读回文字（ProductShell spec、AOS 壳读回、第 1674 行起的 Product SideNav collapse 治理行；以 grep 核实）改成顶带壳与「两主题同色、D7 待裁」的说法，五语补齐；保留 SUB-160 加的 AOS 占位说明；这些读回里不再出现 #7aa0f5、侧栏、260 / 360 搜索的旧说法。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
  - `corepack pnpm@10.12.1 -C <包树> run public:naming:proof`
- 注意：原归 K11，本拆分改归本单（packages.md「偏离判断 §5」第 2 条）。content rows、ai-consumption-contract、oracle、台账与 CHANGELOG 归 SUB-176（K9）。

### TCRN-DS-STORY-148 · 第一批五样板换新壳：Typography、Icon、Actions、Inputs、Brand 的组合样板按顶带壳重渲染，补入成品画布各板 D 段；storybook-map 与 shellFrame 门改为顶带几何；矩阵 story 保持逐格一致

2 张：TCRN-DS-SUB-172、TCRN-DS-SUB-173（父单 work:bad748579e7b1b7f0773bd53）

#### TCRN-DS-SUB-172 · visual-standard/canvas.json 的板高与后续各板 y

- 承接：R2-32
- 包 / 波：K8 / W3（经济）；包内第 2 张
- 改动文件：`docs/design/visual-standard/canvas.json`
- 依赖：TCRN-DS-SUB-153
- 判据：148 符合性：按 P11 问题 2 给的建议值改 `docs/design/visual-standard/canvas.json` 的 h 与后续各板 y，与 heights.json（含 SUB-153 之后的值）一致；放进待发布清单。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/storybook-visual-proof.test.mjs`
- 注意：只改数值，不改板的顺序与 id；改过的值写进交回「待发布清单」。

#### TCRN-DS-SUB-173 · apps/storybook 单测与样板五语文案改顶带壳

- 承接：R2-35
- 包 / 波：K12 / W5（经济）；包内第 1 张
- 改动文件：`apps/storybook/src/smoke.test.ts`，`apps/storybook/src/build/locales/storybook-locale-text.ts`，`apps/storybook/src/contract-stories/gplus/sample-stories.tsx`，`apps/storybook/src/build/locales/storybook-content-text.ts`，`scripts/lib/locale-invariant-ledger.mjs`
- 依赖：TCRN-DS-SUB-168、TCRN-DS-SUB-160、TCRN-DS-SUB-150、TCRN-DS-SUB-176、TCRN-DS-SUB-161
- 判据：148、147、150（05 test 转绿）：smoke.test.ts 里构图一的 rail 与构图三的 TopBar 断言按 P14 问题 2 改；oracle 断言改为 0、0、0、52、936、936、999；旧文档头、旧 SideNav 与知识库原型的断言改成新壳；ts-m-s 的期望跟 SUB-160；六个样板的五语标题与描述改为顶带壳，gplusSampleStoryText 一起改；补 K11 交回里的「待补五语键」（C-10）；先 build 再跑 storybook 包测试，全绿。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run test`
  - `corepack pnpm@10.12.1 -C <包树> run public:naming:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
- 注意：smoke.test.ts 第 1528–1540 行断言 ai-consumption-contract.ts 里 storybookDocShellControlContract 的文字，跟 SUB-176 改后的说法改（problems/decomposition.md 第 5 条）。K12 第一个做。

### TCRN-DS-STORY-149 · 壳层门：07b 板 G 段 18 条门（标按钮几何、品牌资产 digest、顶带、三缘对齐、固定项间距、接续、底栏居中、标旁文字居中、级联、无收起钮与常驻侧栏、图钉位无抖动、锁定块只装饰、每格对比度、单行与溢出、阴影模糊、登入动画、焦点回路、触摸端）接入 geometry-measure、verify 与 CI，每门一条会红的变异

2 张：TCRN-DS-SUB-174、TCRN-DS-SUB-175（父单 work:854cd021e8bb869b2b585fe0）

#### TCRN-DS-SUB-174 · 壳层门读法与判定补齐：contrast 豁免格只列不比并补三类读法，pinJitter、prail 与 css-template 正则

- 承接：R2-27
- 包 / 波：K7 / W2（主力）；包内第 1 张
- 改动文件：`scripts/lib/shell-measure.mjs`，`scripts/shell-measure-proof.mjs`，`tests/shell-measure-proof.test.mjs`，`tests/fixtures/geometry-measure/shell/**`，`scripts/css-template-integrity-proof.mjs`
- 依赖：无
- 判据：142-GWT1、149-GWT1、148（rail）、137-GWT5（口径 §3.4 第 1、10 条）：contrast 对 07a B 段标「按设计不读 / 不进门」的格只列不比，补彩色标、面板对画布、遮罩下的纸三类读法；pinJitter 用 `.tcrn-nav-item-row` 找图钉，变异同时撤掉保留轨道，夹具自检证明它会判红；新增 prail 判定（菜单引导列图标在 16、文字在 48，口径同 measure-shell.js 的 o.prail），配一条会判红的变异，第一批 rail 从此改量菜单引导列（映射说明 I16-P24 与清单第 202 行由此成立）；css-template-integrity 两条正则放宽为 `[a-z]+(?:-[a-z]+)*\.css\.ts` 与 `[a-z]+(?:[A-Z][a-z]*)*Css\d+`（P5 问题 4），shellIntroCss01、shellSheetCss01 纳入登记检查；`--fixtures` 与单测退出 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/shell-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs --fixtures`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
- 注意：真件 prail 读数等 SUB-152（K6，W3），本单对真件只记读数，夹具先做。读数库只读数、阈值在门脚本（C-11 沿用）。门在文档壳的纸里只认被量壳自己的纸（cross-notes P12 行）。

#### TCRN-DS-SUB-175 · shell-matrix 的高度、台账与所属页治理元数据

- 承接：R2-34
- 包 / 波：K8 / W3（经济）；包内第 4 张
- 改动文件：`scripts/lib/story-budget.mjs`，`apps/storybook/src/contract-stories/gplus/matrix-renderer.tsx`，`apps/storybook/src/contract-stories/governance.ts`
- 依赖：TCRN-DS-SUB-157
- 判据：149：shell-matrix 两块并排（id 不变），桌面高 ≤ 2000，做不到就进 grace allowlist 并带 owedTo；9 条 recordedHeightPx 改为现测值；补上所属页的治理元数据（smoke 静态段缺 `owning-page-story-governance-metadata:Components:shell-matrix`，17 log:48；落点以 grep 核实），storybook:smoke 该项转绿。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
- 注意：矩阵 66 格与逐格比对不变（P9 接口）。

### TCRN-DS-STORY-150 · 4.0.0 候选：版本面、CHANGELOG 发布段、消费方迁移说明（第一批破坏性变化 + 壳层退役项）、pack 冒烟、Storybook 构建、Owner 目视验收清单（第一批与第二批合一）

2 张：TCRN-DS-SUB-176、TCRN-DS-SUB-177（父单 work:b140305693da159bfdc615c8）

#### TCRN-DS-SUB-176 · 契约文字、oracle、content rows、台账与 #7aa0f5 残留改顶带壳与两主题同色说法

- 承接：R2-29（其余）
- 包 / 波：K9 / W4（经济）；包内第 1 张
- 改动文件：`apps/storybook/src/build/ai-consumption-contract.ts`，`apps/storybook/src/build/foundation-visual-standards.ts`，`apps/storybook/src/contract-stories/content/component-rows.ts`，`apps/storybook/src/contract-stories/content/navigation-rows.ts`，`apps/storybook/src/build/locales/storybook-content-text.ts`，`scripts/lib/locale-invariant-ledger.mjs`，`CHANGELOG.md`，`packages/ui-tokens/README.md`，`docs/migration-4.0.md`
- 依赖：TCRN-DS-SUB-168、TCRN-DS-SUB-171
- 判据：147、150、145-GWT3（R2-29 其余）：改成顶带壳与「两主题同色、D7 待裁」的说法并补齐五语——ai-consumption-contract.ts 第 1039、1046 行，visualFitControlContract.search 的 260 / 360，brandSurfaceDisposition 的 #7aa0f5；oracle（foundation-visual-standards.ts）的 metricSourceDisposition、metricRevisionDisposition 两段；content rows（component-rows.ts、navigation-rows.ts）里的 SideNav、TopBar、ProductSwitcher、SegmentedNav 行；CHANGELOG.md 第 164 行、迁移说明里的 #7aa0f5 残留、ui-tokens README；oracle 数值渲染时不带英文单位，或在泄漏台账按新值登记（30.02 log:42）；ai-consumption-contract.ts 里的旧文档壳标记字样随之删除，internal-alpha:contracts 仍退出 0（SUB-168 已重写检查）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:contracts`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run scaffold:proof`
  - `corepack pnpm@10.12.1 -C <包树> run readme:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
  - `corepack pnpm@10.12.1 -C <包树> run public:naming:proof`
- 注意：CHANGELOG 第 164 行与迁移说明里的 #7aa0f5 是判断点名的事实更正，只改这几处，其余只追加（C-11，problems/decomposition.md 第 9 条）。smoke.test.ts 的对应断言在 SUB-173（K12），本包看到的 storybook 包测试红按 C-5 只记。K9 第一个做。

#### TCRN-DS-SUB-177 · 批末生成物一次再生，验收清单同步

- 承接：R2-36
- 包 / 波：K12 / W5（经济）；包内第 2 张
- 改动文件：`packages/ui-tokens/fonts/**`，`packages/ui-tokens/licenses/**`，`docs/verification/**`，`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`，`docs/migration-4.0.md`
- 依赖：TCRN-DS-SUB-173、TCRN-DS-SUB-161、TCRN-DS-SUB-158、TCRN-DS-SUB-156（SUB-173 是本包上一张，其余三张是 W4 三个包的末张，即其余各单全部合入）
- 判据：150（SUB-139、SUB-140 的收尾）、135-GWT4：其余各单合入后，在同一构建上依次做——① 跑 fonts:vendor，补上 U+94DB 与新文案用到的码点，fonts:proof、fonts:render 退出 0（连不上 npm registry 就记问题，改用子集里已有的字）；② nonVisualProofOk 为真后，按 P15 问题 2 写选择文件，重收视觉签名（回归 199 条、新增 15 条），逐条列变化，只收换壳带来的变化；③ 其余生成物同批再生：几何、壳层门报告、映射、契约与 API 清单、internal-alpha 回执；④ owner-acceptance.md 改第 178、202 两行，补上差距（长字标、夜间后缀 3.07、铃铛 6% 待目视、拖排待目视），G-6 改记「已按板改，待目视」。做完交主线程跑批末 verify。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run fonts:vendor`
  - `corepack pnpm@10.12.1 -C <包树> run fonts:proof`
  - `corepack pnpm@10.12.1 -C <包树> run fonts:render`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run pack:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:contracts`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> run scan`
- 注意：批末固定收尾步骤（批量原则第 4 条），本单不跑 verify。visual-selection-result.json 不入仓，internal-alpha/no-overclaim-scan.json 由主线程在最后一次文档提交时再生（C-9）。预期外的签名变化停下记问题，不接受。docs/migration-4.0.md 只在 K6b 交回有迁移条目时追加。被退回一次升主力（判断 G6）。
