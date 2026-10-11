# TCRN-DS-INIT-015 · R3 拆分

本文件是 R3 拆分子代理的产出：R2 判断 §2 的 19 条返工（R3-1 至 R3-19）拆成 19 张新 Subtask（TCRN-DS-SUB-088 至 TCRN-DS-SUB-106，主力 11、经济 8）；批末重做 R3-20 沿用既有的 SUB-076、SUB-078、SUB-046，不开新单；分 6 个包（主力 4、经济 2）、3 个波次。输入是 `runs/r2/judgment.md` 的 §2、§3.1、§3.3、§4.6、§5 与 `runs/r2/decomposition.md` 第 1 节，现码核对基于集成分支 HEAD 087651f。链上 Story 的 scope 是任务权威；本文件只是拆分与分包。包表、波次与就绪条件见 `packages.md`，机读清单见 `subtasks.json`（含三张重做的旧单），落链载荷见 `subtasks-batch.json`（只含 19 张新单）。

读法：第 1 节是跨包约定（只写相对 R2 新增或变化的条目）；第 2 节是总览、相对判断 §5 的差异（§2.1）、现码核对（§2.2）与拿不准的问题（§2.3）；第 3 节按 Story 列 Subtask，每张一节，节标题为 `#### TCRN-DS-SUB-NNN · 标题`，可按节切摘录。包号 P0–P5 即判断 §5 的 R3-P0–R3-P5。

## 1. 跨包约定（相对 R2 的新增与变化）

1. **沿用 R2。** `runs/r2/decomposition.md` 第 1 节（第 7–21 行）12 条继续有效（其第 1 条又沿用 R1 第 1 节 13 条）；与下列条目冲突时以本节为准。R2 第 8、9 条里的 `runs/r2/` 换成 `runs/r3/`，提交信息带 TCRN-DS-SUB-NNN 与来源返工号（如 R3-1）。
2. **包号与交回。** 包号写 P0–P5；每包交回 `runs/r3/handoff/<包号>.md`（提交列表、判断 §3.3 回显项、局部门结果摘要、接续点）与 `runs/r3/problems/<包号>.md`（见红只记，同一根因算一条）。
3. **授权边界。** 只做判断 §2 写明的改法，以及本拆分在 §2.1 写明的补充；判断 §3.3 的 12 条 B 类裁定照做；§3.4 各项、O-1…O-12 的「Owner 更正时」改法与 A 类事项不做。新增第 5 个壳层 token、改 Navigation 家族的结构、API 或状态行为、给 TopBar 加导航 API、改门的比对字段或阈值语义（O-1 直接后果的旧几何期望值除外，判断 §3.3 第 6 条）都属越级，停下写进包问题文件。
4. **旧壳几何期望的流转（O-1）。** P1 跑完 SUB-090 列的门后，把因旧几何（280、92、68、洗底、右边线）转红的期望逐条写进 `problems/P1.md`，每条标持有包：`scripts/storybook-smoke.mjs`、`scripts/full-surface-remediation-proof.mjs`、`scripts/internal-alpha-browser-proof.mjs` 归 P2（SUB-098、SUB-099）；`scripts/geometry-proof.mjs`、`scripts/shell-parity-proof.mjs`、文档样式源与 `foundation-visual-standards.ts` 归 P3（SUB-100、SUB-101）。P2、P3 的派工摘录附 `problems/P1.md`。P3 发现 P2 持有的门文件里钉着旧文档壳几何的字面期望时只记 `problems/P3.md`，不改，交 R3 判断。
5. **文件持有（相对判断 §5.1 的变化）。** `apps/storybook/src/smoke.test.ts` 本轮只归 P0（SUB-092 的注册断言）；P2、P3 不改它，需要改时记问题文件。词条文件 `storybook-content-text.ts` 先归 P0，P3（SUB-101）与 P4（SUB-103）只在条件成立时改，且都在 P0 合入之后。其余照判断 §5.1：`storybook-smoke.mjs`、`internal-alpha-browser-proof.mjs`、`storybook-map.json` 只归 P2；`geometry-proof.mjs`、`shell-fidelity-proof.mjs`、`doc-class-map.json` 与文档样式源只归 P3；契约、生成器与生成物只归 P1。
6. **回执与报告。** 沿用 R2 第 6 条，指定者换成 R3：`docs/verification/storybook-visual-proof/**` 只由 SUB-076 写，`docs/verification/geometry-measure/**` 只由 SUB-078 写，`docs/verification/doc-shell-class/**`、internal-alpha、hardening、scaffold、readme 回执只由 SUB-046 写。其它包跑了会写这些路径的门，跑完用 `git -C <包树> checkout -- <路径>` 还原，新出现的未跟踪文件 mv 进会话 scratch 的 trash。
7. **自检代替新测试文件。** 仓内没有 storybook-smoke、internal-alpha-browser-proof、geometry-proof、shell-fidelity-proof 的单测文件。判断写「单测」或「正反用例」的四处（SUB-098、SUB-099、SUB-089、SUB-102）写成脚本内自检，或沿用该脚本已有的 baseline、broken、restored 变异写法，随门本身运行；不新增测试文件、不改 `package.json` 与 verify 链（同 R2 §2.1 第 5 条）。
8. **生成物头部。** 沿用 R2 第 7 条。R3 只有 P1 改契约：`tokens.json` 一改，actions.pairs、inputs.pairs、typography.scale、matrices.generated、gplus-tokens.generated 五个头的 contract-sha256 同变，都归 P1；product-marks.generated 只覆盖 marks.json，不变。
9. **停下与退回。** 主力项再退回即停下，写进收口文件交 Owner（判断 §2 开头；SUB-091、SUB-100 已标）。SUB-090、SUB-092 另有停下条件，见各单。停下的单在交回写明，转态归主线程。
10. **额度。** 本周额度所剩不多；触顶即按 `runs/state.md` 停在原地等重置，不为此改方法（判断 §5.2 末段）。各包只跑包表列出的局部门，同一门不为求稳重复跑。
11. **链上。** SUB-080 保持 active，由 SUB-100 承接；SUB-046、SUB-076、SUB-078 保持 active，R3 末由 P4 重做；本拆分只新建 19 张，不改这四张的链上记录（判断 §3.3 第 10 条）。

## 2. 总览

| Story | 新 Subtask 数 | 键 | 包 |
| --- | --- | --- | --- |
| STORY-127 | 2 | TCRN-DS-SUB-088、TCRN-DS-SUB-089 | P1、P3 |
| STORY-129 | 2 | TCRN-DS-SUB-090、TCRN-DS-SUB-091 | P1、P5 |
| STORY-130 | 2 | TCRN-DS-SUB-092、TCRN-DS-SUB-093；另含既有 SUB-076（P4，R3-20 重做） | P0、P2、P4 |
| STORY-131 | 1 | TCRN-DS-SUB-094；另含既有 SUB-078（P4，R3-20 重做） | P2、P4 |
| STORY-133 | 9 | TCRN-DS-SUB-095 – TCRN-DS-SUB-103 | P0、P1、P2、P3、P4 |
| STORY-134 | 3 | TCRN-DS-SUB-104 – TCRN-DS-SUB-106；另含既有 SUB-046（P4，R3-20 重做） | P0、P3、P4 |
| 合计 | 19 | TCRN-DS-SUB-088 – TCRN-DS-SUB-106 | 6 包 |

STORY-120 没有 R3 Subtask：余红全部归他片或 O-1，R3 后 verify 全绿即转 done（判断 §1）。121–126、128、132 本轮转 done，后续返工挂仍开着的 Story（判断 §3.3 第 11 条）。

落链：2026-10-11T09:04:58Z 以 `subtasks-batch.json` 一次 work-batch（actor agent:claude-opus-5-5），回执 WORK_BATCH_APPLIED（members 19；外层 WORKSPACE_COMMAND_COMPLETED），DS 项目库 version 1732 → 1751；work-list 读回 Subtask 共 106 张，19 张新键的父单、标题与本文件一致，id 与回执一致，状态均为 planned。SUB-046、SUB-076、SUB-078、SUB-080 的链上记录未改（revision 仍为 3，scope 摘要不变），其余既有记录也没有变化。

键号按 Story 顺序连续分配，同一 Story 内按包号排序；包内执行顺序以 `packages.md` 为准（例如 P1 内是 SUB-090、SUB-088、SUB-097）。

### 2.1 相对判断 §5 分组的差异

1. **P3 增加前置 P0。** SUB-092（R3-14）要改 `apps/storybook/src/smoke.test.ts`：新 story 必须进 `expectedContractStoryIds`（第 98 行起，第 377–378 行与 contractStories 逐个 deepEqual，第 1158 行再比一次），CSF 适配门（第 422–448 行）也要求它有 CSF 导出；判断把 smoke.test.ts 归 P3，两包会相交。另外 SUB-101 在 oracle 值改变拼接串时可能要改词条文件。改为 P3 在 P0 与 P1 都合入后起。P0 预计短于 P1，P3 本就等 P1，起跑时点不变（见 `packages.md` 时间线）。
2. **smoke.test.ts 改归 P0。** R3-13 写的「smoke.test.ts:842、:844」在 HEAD 087651f 已没有两个原型名（该处现为 raw-search 规则，全文件无命中），SUB-105 不改它；P2 仍不改它（判断 R3-5 原文）。
3. **SUB-092 补注册点。** 判断 R3-14 只写 sample-stories.tsx；现码还要四处：`groups/components.ts`（第 32–33 行按下标把矩阵与样板配对，第六个样板不会被带上）、`governance.ts`、一个 Components 组 CSF 适配导出、smoke.test.ts；标题与说明的五语词条在 `storybook-locale-text.ts`。1040 只用样板自己的内联样式，不碰文档样式源，P0 与 P1、P3 的文件集因此不相交。
4. **四处「单测」改为脚本内自检。** 见跨包约定第 7 条。
5. **P2 内补文件。** SUB-094 补自检夹具 `tests/fixtures/geometry-measure/**`，以及门要求每个必测项都有 ROW_MUTATIONS 条目时的 `scripts/storybook-visual-proof.mjs` 与其测试；SUB-093 补构图三的 REQUIRED_CHECKS 条目（`geometry-measure-proof.mjs`）与条件性的 `scripts/lib/storybook-routes.mjs`。全在 P2 内，不跨包。
6. **宽限表、doc-shell 证据与第 228 行并入 SUB-046。** 判断 §5.3 第 2、3 条只写「R3-20」，R3-20 沿用三张旧单不开新单，故放进 SUB-046 的第 0 步（在 SUB-106 之后、视觉基线写入之前）。owner-acceptance.md 第 228 行 P18 判断写在 R3-19，但它要等 R3-20 的结果，而 SUB-046 的前提又是 R3-19 已合入；同包内把这一行移给 SUB-046，避免依赖成环，写完再跑 `pnpm scan`。
7. **行号与宿主更正（先 grep 再改）。** WORDMARK_EXEMPTIONS 的两条 dark TMS 在 `token-contrast-proof.mjs:80–81`（判断写 73–74）。geometry-proof 的 brand 检查现宿主是 owner-quality-product-shell 的收起变体（`geometry-proof.mjs:14`、`:20`），判断写 navigation-product-shell-spec 收起态；SUB-089 取能渲染包 ProductShell 收起态的现存 story，不新增钩子。
8. **未合并的包。** R3-7 仍单独成包（P5），没有并进 P2（判断 §3.3 第 12 条）；P1 与 P0、P2 与 P3 合并都会超过 150 回合，也不合并。

### 2.2 拆分时的现码核对（只读，摘要）

- 判断点名的路径在 HEAD 087651f 都存在，composition-three.tsx 为新增。tests/ 下没有 storybook-smoke、geometry-proof、shell-fidelity、internal-alpha 的单测文件。
- `base.css.ts`：侧栏 280px（:156）、收起 92px（:169）、右边线与 brand-secondary-bg（:205–206）、壳顶栏 68px（:289）、独立 TopBar 68px（:443）、移动断点（:1959）。tokens.json fixed 段没有 14px 圆角，也没有 220、52 的尺寸；space-3 为 12、space-4 为 16。
- brand 段 4 条都是单值，tokens.css:117 在主题无关块；marks.json:21 的 tms bright 为 #7aa0f5。index.test.ts:69–70 钉「后缀 scope fixed」，Navigation.test.tsx:693 钉 tms #2c63c8，token-contrast 测试第 142–143、177–180 行钉着 TMS 夜间豁免。
- composition-one.tsx 的 220 局部覆写在 :5、:65–67；sample-stories.tsx 只登记五个样板；storybook-map.json 的 story 清单是固定十个 id 加注册表里 gplus- 类目的全部 story，新 story 会自动进清单。
- storybook-content-text.ts:1301 的键是「260px rest, 360px expanded, 36px high」；I1 问题 3 列出 7 种半译组合。
- geometry-proof.mjs 的 openMenus 计数在 :227、`=== 8` 在 :251，搜索变异在 :449；doc-class-map.json:39 是 tcrn-product-shell-search--static-display，仓内已没有该类的使用。
- shell-fidelity-proof.mjs：PLACEMENT_PROPERTIES 在 :262–270（含 white-space、overflow-wrap、word-break），C-21 两条例外在 :313–335，规则级守卫自检在 :590 起。internal-alpha 的锚点循环在 :1789–1797，透明层放行表在 :48，知识库壳循环在 :2116–2129。
- 文档壳 oracle 在 foundation-visual-standards.ts（shellMetrics 288、96，:575 说明 clamp(280px, 20vw, 360px)）；storybook-smoke（:176 起）与 internal-alpha（:881 起）经 AI 契约读 oracle，不另钉字面值。
- 原型名：component-rows.ts:32、:34，index.tsx:153、:155，index.test.tsx:82、:84；smoke.test.ts 无命中。denseShell* 只有 denseShellMenuDensityRows 被引用（story-content.tsx:195、:2127）。
- inputs.css.ts:517 的 `.tcrn-multi-select-dropdown` 为横排；没有测试钉着这条规则的原文。
- 生成物头部：actions.pairs、inputs.pairs 为 pairs.json、tokens.json；typography.scale 为 typography.json、tokens.json；matrices.generated 为 matrices.json、tokens.json、pairs.json；gplus-tokens.generated 为 tokens.json、marks.json、typography.json；product-marks.generated 只含 marks.json。

### 2.3 问题（拿不准，交主线程或判断）

1. **SUB-101 的范围。** 判断要求 tcrn-doc-* 规则对齐包壳 220/52；现文档壳侧栏是 clamp(280px, 20vw, 360px)，oracle 是 288、96，牵动冒烟与 internal-alpha 的文档壳读数。本拆分按判断原文执行：改到 shell:parity 三角色、brandLockup 矩阵与 sampleShell 转绿为止，oracle 只改受壳几何影响的值。若做到这一步必须整站改文档壳并牵动判断外的证据，P3 停在该单写进 `problems/P3.md`，不扩大范围。
2. **SUB-089 的宿主。** 二选一见 §2.1 第 7 条；两个宿主都不能渲染包 ProductShell 收起态时停下记问题文件。
3. **构图三的 id 与 CSF 位置。** 由 P0 按 registry 顺序要求选定并写进交回；SUB-093 按交回写映射行。
4. **P0 合入到 P2 合入之间的预期红。** storybook:visual-proof 与 geometry:measure 会因新 story 未被映射而红，不阻塞 P3，也不算回退。

## 3. 按 Story 的 Subtask

### TCRN-DS-STORY-127 · Brand：四枚产品标进注册表（tms、einzbern、mana-orchestrate、design-system），后缀用产品深色，标语五语更新

#### TCRN-DS-SUB-088 · TMS 夜间品牌后缀改为 #7aa0f5，生成器 brand 形状支持可选夜间值，撤两条 TMS 夜间豁免

- 包 / 波：P1 / W1（包内第 2 项，整包主力档）
- 来源：R3-2（O-3、RM19）
- 文件：`docs/design/gplus-2026-10/contract/tokens.json`，`scripts/contract-generate.mjs`，`packages/ui-tokens/src/index.ts`，`packages/ui-tokens/src/index.test.ts`，`packages/ui-tokens/src/gplus-tokens.generated.ts`，`packages/ui-react/src/styles/generated/actions.pairs.ts`，`packages/ui-react/src/styles/generated/inputs.pairs.ts`，`packages/ui-react/src/styles/generated/typography.scale.ts`，`apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts`，`packages/ui-tokens/src/tokens.css`，`apps/storybook/src/storybook.css`，`scripts/token-contrast-proof.mjs`，`tests/token-contrast-proof.test.mjs`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`tests/token-deprecation-notice.test.mjs`，`apps/storybook/src/build/ai-consumption-contract.ts`（生成物只由 contract-generate 写，tokens.css 与 storybook.css 的 token 块只由 tokens-sync 写；index.ts 仅当带夜间值的 brand 条目需要按主题输出时改；Navigation.test.tsx、token-deprecation-notice.test.mjs 仅当钉着后缀两主题同值时改；ai-consumption-contract.ts 仅当其第 1021 行一带的文字声明 TMS 后缀两主题同值时改）
- 依赖：TCRN-DS-SUB-090
- 判据：O-3（设计会话 B 类裁定）：tokens.json brand 段 brand-suffix-tms 加夜间值 #7aa0f5（ref marks.json#tms.palette.bright，marks.json 第 21 行），其余三条不变，DS #6577f3 不改；contract-generate 的 brand 形状接受可选夜间值：带夜间值的条目同时写进浅色块（:root, [data-tcrn-theme="light"]）与夜间块，两块属性集仍相同（C5 不变），不带夜间值的照旧写主题无关块；tokens.css 与 storybook.css 的 token 块由 tokens-sync 再生，不手改；token-contrast-proof.mjs 的 WORDMARK_EXEMPTIONS 删去两条 dark TMS（现第 80–81 行；NIGHT_PENDING 无其它引用时一并删），只剩 DS 浅色两条，internal-alpha 的 axe 豁免随导入自动收窄（internal-alpha-browser-proof.mjs:22、:65 只读不改）；tests/token-contrast-proof.test.mjs 钉着 TMS 夜间豁免的断言（现第 142–143、177–180 行一带）按新口径改写；packages/ui-tokens/src/index.test.ts 第 64–70 行「后缀全部 scope fixed」对 tms 改为按主题断言浅色 #2c63c8、夜间 #7aa0f5。127-GWT3「TMS 为 #2c63c8」沿用 R1 口径只判浅色；Brand 板夜间说明不改，DIFF-10 由 SUB-093 记。判据读数：token-contrast-proof 全绿，报告里夜间 tms 于 bg、panel 两条为通过而不是豁免；contract:static 的 C5 绿；internal-alpha browser-proof 的 axe 豁免回执只剩 DS 浅色条目。
- 档位：主力——改契约 brand 形状、生成器输出与对比度门的豁免数据。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/token-contrast-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-contrast-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/token-deprecation-notice.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof（跑完 git -C <包树> checkout -- docs/verification/internal-alpha 还原回执）`

#### TCRN-DS-SUB-089 · geometry-proof 的品牌检查加收起态读数：侧栏宽 52、标 22×22、文案不显示，变异判红

- 包 / 波：P3 / W2（包内第 2 项，整包主力档）
- 来源：R3-11（127-GWT4、O-1）
- 文件：`scripts/geometry-proof.mjs`（仓内没有 geometry-proof 的单测文件，变异即正反用例（跨包约定第 7 条））
- 依赖：TCRN-DS-SUB-100，TCRN-DS-SUB-090
- 判据：127-GWT4（收起宽 52px）：geometry-proof 的 brand 检查在包 ProductShell 收起态加三项读数：侧栏宽 52（容差写在门里）、产品标 22×22、文案 display none；宿主用能渲染包 ProductShell 收起态的现存 story（判断写 navigation-product-shell-spec 收起态；现 brand 检查宿主是 owner-quality-product-shell 的 desktop-light-operations-cockpit-collapsed 变体，见 geometry-proof.mjs:14、:20），不新增 story 钩子；沿用本文件 addMutation / removeMutation 的 baseline、broken、restored 写法加两条变异（侧栏宽回 92、标被缩放），各判红，restored 回绿。判据读数：geometry:proof 的 brand 段 ok，三项读数为 52、22×22、none，两条变异 broken 为红。
- 档位：主力——改门的判定读数。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`

### TCRN-DS-STORY-129 · 矩阵 story：每个第一批组件一个 variant × state × theme 矩阵，由契约数据生成；构图一壳层样板与夜间切换

#### TCRN-DS-SUB-090 · ProductShell 按构图一改壳层几何，契约新增 4 个壳层 token（O-1）

- 包 / 波：P1 / W1（包内第 1 项，整包主力档）
- 来源：R3-1（O-1、RM19、DIFF-1）
- 文件：`docs/design/gplus-2026-10/contract/tokens.json`，`scripts/contract-generate.mjs`，`packages/ui-tokens/src/index.ts`，`packages/ui-tokens/src/index.test.ts`，`packages/ui-tokens/src/gplus-tokens.generated.ts`，`packages/ui-react/src/styles/generated/actions.pairs.ts`，`packages/ui-react/src/styles/generated/inputs.pairs.ts`，`packages/ui-react/src/styles/generated/typography.scale.ts`，`apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts`，`packages/ui-tokens/src/tokens.css`，`apps/storybook/src/storybook.css`，`packages/ui-react/src/styles/base.css.ts`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`apps/storybook/src/contract-stories/gplus/samples/composition-one.tsx`（contract-generate.mjs 仅当新增的 fixed 条目需要生成器改动时改；生成物只由 contract-generate 写，五个头的 contract-sha256 随 tokens.json 同变；tokens.css 与 storybook.css 的 token 块只由 tokens-sync 写；钉着旧壳几何的 ui-react 测试以 grep 为准，现有 Navigation.test.tsx:175 钉 brand-secondary-bg）
- 依赖：无
- 判据：129-GWT3、127-GWT4、131-GWT4 样板 rail（O-1，设计会话 B 类裁定）：tokens.json fixed 段新增 --tcrn-shell-sidebar-width 220px、--tcrn-shell-sidebar-width-collapsed 52px、--tcrn-shell-topbar-height 52px、--tcrn-radius-paper 14px（名字可在值不变时调整，交回写明），index.ts 注册；base.css.ts 的 .tcrn-product-shell 保留局部变量 --tcrn-product-shell-sidebar-width（消费方仍可覆写），默认值（现 :156 的 280px）与收起值（:169 的 92px）改引两个宽度 token；侧栏（:205–206）去右边线、改用壳根已用的画布色（现为 brand-secondary-bg 洗底）；引导列 16/48 只经壳作用域内的间距做到（16 = space-4，48 用现有 token 的 calc 组合），不改 NavItem 的结构、API 与状态行为；主区成为纸面：离壳边 12（space-3）、圆角 radius-paper、阴影 shadow-s1，底色以构图板为准；壳顶栏（.tcrn-product-shell__workspace > .tcrn-top-bar，:281–289 的 min-height 68px）引 topbar token；收起态宽 52、文案 display none（已有）、标 22 不缩放，内边距取现有 token，放得下 38px 收起钮（O-5 默认维持）；移动断点以下（:1959 一带）与独立的 .tcrn-top-bar（:438–443）不改；composition-one.tsx 去掉 220 的局部覆写（:5、:65–67），注释同步。判据读数：geometry:measure 的样板 rail guideLefts 全为 16、textLefts 全为 48（现为 [16, 49] 与 [48, 77]）；跑判断 R3-1 第 5 点列的门，因旧几何（280、92、68、洗底、右边线）转红的期望逐条写进 problems/P1.md 并标持有包（跨包约定第 4 条），不改别包文件，交回列出所跑全部门的结果。停下条件：做到 16/48 或收起 52 必须改 Navigation 家族组件的结构、API 或状态行为时，或需要第 5 个新 token 时，写进 problems/P1.md，收口交 Owner。
- 档位：主力——改共享契约的 token 键集与包壳几何。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/demo-styles-sync.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run shell:parity`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
  - `corepack pnpm@10.12.1 -C <包树> run full-surface:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof（跑完 git -C <包树> checkout -- docs/verification/internal-alpha 还原回执）`

#### TCRN-DS-SUB-091 · MultiSelect 下拉容器改纵向排列，静态展开态列表位于触发器下方

- 包 / 波：P5 / W1（包内第 1 项，整包主力档）
- 来源：R3-7（B2-1、RM7 ①）
- 文件：`packages/ui-react/src/styles/inputs.css.ts`，`packages/ui-react/src/components/Form/Form.test.tsx`（Form.test.tsx 仅当有断言钉着容器横排时改）
- 依赖：无
- 判据：129 矩阵 story（B2-1；R2 的 SUB-061 改过同一目标，经济升主力、单独成包）：inputs.css.ts:517 的 .tcrn-multi-select-dropdown 由 display:flex;align-items:center 改为纵向（flex-direction:column;align-items:stretch，或单列 grid），30px 末端区与 caret 不动，门的比对字段不改；同文件约 163–166 行的过时注释（.tcrn-input--short 已随 R1 删除）顺手改；运行时列表经 OverlayBoundary fixed，行为不变。判据读数：full-surface 两例 ok；inputs-matrix 两轮 42/42 且 controlHeight pass；storybook-visual-proof 的 inputs.A、inputs.B 绿；静态展开态截图里列表在触发器下方、与触发器同宽。owner-acceptance 第 169 行由 SUB-106 改为复核项。再退回即停下，写进收口文件交 Owner。
- 档位：主力——同一修复目标退回一次升主力（R2 拆分第 1 节第 12 条）；再退回交 Owner。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run full-surface:proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`

### TCRN-DS-STORY-130 · Storybook 对照清单：每块画布板到 story 的映射与差异记录，视觉证明走同一套测量

#### TCRN-DS-SUB-092 · 新增构图三样板 story：无侧栏、顶部一条导航、内容居中 1040

- 包 / 波：P0 / W1（包内第 4 项，整包经济档）
- 来源：R3-14（O-4、DIFF-2）
- 文件：`apps/storybook/src/contract-stories/gplus/samples/composition-three.tsx`，`apps/storybook/src/contract-stories/gplus/sample-stories.tsx`，`apps/storybook/src/contract-stories/groups/components.ts`，`apps/storybook/src/contract-stories/governance.ts`，`apps/storybook/src/inputs.stories.tsx`，`apps/storybook/src/compositions.stories.tsx`，`apps/storybook/src/smoke.test.ts`，`apps/storybook/src/build/locales/storybook-locale-text.ts`，`apps/storybook/src/build/locales/storybook-content-text.ts`，`scripts/lib/locale-invariant-ledger.mjs`（composition-three.tsx 为新增；CSF 适配二选一：inputs.stories.tsx 末尾追加，或新增 compositions.stories.tsx 并在 smoke.test.ts 第 433 行的 Components 适配清单末尾登记；locale-invariant-ledger.mjs 仅当有词按机器词登记时改；不改 story-demo-styles.ts、alpha-styles.ts、storybook.css 与 composition-one.tsx）
- 依赖：TCRN-DS-SUB-104
- 判据：O-4（设计会话 B 类裁定，DIFF-2）：新增 composition-three.tsx，在 sample-stories.tsx 注册一个 gplus-samples 类目的 story（id 建议 composition-three-sample，交回写实际 id）：无侧栏、顶部一条导航、内容居中 1040；只用包的公开组件与 props（如 TopBar），不加 [data-shell]；1040 作样板局部变量写在样板自己的内联样式里（同构图一当初的 220），不新增 token，不新造 tcrn- 前缀类，不碰文档样式源，composition-one.tsx 只可读取其导出；注册点：groups/components.ts（第 32–33 行按下标把矩阵与样板配对，新 story 在 flatMap 之后显式追加）、governance.ts（group Components、categoryId gplus-samples）、Components 组 CSF 适配导出（与 registry 顺序一致）、smoke.test.ts 的 expectedContractStoryIds（第 98 行起，与 contractStories 逐个 deepEqual）；文案优先复用现有样板词条，新增词条进 storybook-locale-text.ts（story.<id>.title 与 .description）与 storybook-content-text.ts，五语齐、不带工单键。判据读数：design-system-storybook test 绿（含注册、来源路径与 CSF 适配断言）；contract:static 与 doc-shell:proof 不因新 story 转红；internal-alpha browser-proof 的 zh-CN 新漏译为 0、新 story 高度在预算内（超预算交 SUB-046 刷新宽限表，本单不改 story-budget.mjs）；storybook:visual-proof 与 geometry:measure 因映射未引用新 story 的红属预期，记 problems/P0.md 交 SUB-093。停下条件：须给 ProductShell 加无侧栏布局、给 TopBar 加导航 API 或改其结构时停下，写进 problems/P0.md，收口交 Owner（建议构图三改记页面模板批次，DIFF-2 由 SUB-093 改记「待 Owner：页面模板批次」）；TopBar 独立高度与构图板不一致时写进交回，由 SUB-093 写入 DIFF-2 的 story 文字，不改 TopBar。
- 档位：经济——新增样板 story，只用公开组件，不改契约与门。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
  - `corepack pnpm@10.12.1 -C <包树> run scan`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof（跑完 git -C <包树> checkout -- docs/verification/internal-alpha 还原回执）`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`

#### TCRN-DS-SUB-093 · 映射差异记录按裁定更新，新增 DIFF-10 与构图三映射行，更正两处过时注释

- 包 / 波：P2 / W2（包内第 4 项，整包主力档）
- 来源：R3-8（C2-8、C2-6、O-4、O-3、DIFF-1、DIFF-2、DIFF-3、DIFF-8、DIFF-9、DIFF-10）
- 文件：`docs/design/gplus-2026-10/storybook-map.json`，`docs/design/gplus-2026-10/storybook-map.md`，`scripts/geometry-measure-proof.mjs`，`tests/geometry-measure-proof.test.mjs`，`scripts/lib/storybook-routes.mjs`，`scripts/storybook-visual-proof.mjs`（geometry-measure-proof.mjs 只加构图三的 REQUIRED_CHECKS 条目；geometry-measure-proof.test.mjs 仅当钉着 REQUIRED_CHECKS 键集或样板 id 清单时改；storybook-routes.mjs 仅当 story 清单校验要求固定 id 列表含构图三时改；storybook-visual-proof.mjs 只改第 62–64 行注释）
- 依赖：TCRN-DS-SUB-094，TCRN-DS-SUB-092，TCRN-DS-SUB-088，TCRN-DS-SUB-090
- 判据：130-GWT1（C2-8，并 O-4、O-3）：storybook-map.json 的 differences 与 refs，.md 同步——DIFF-1：样板 10 行在 SUB-090、SUB-094 落地后转绿时，状态改「已按 O-1 实现（设计会话 B 类裁定）」并在 refs 加 O-1，没转绿只加引用；DIFF-3：「已裁定：以构图板 220/52 为准（O-4，设计会话 B 类）」；DIFF-2：「已裁定：构图三样板随 O-1 补（O-4）」，story 写 SUB-092 的实际形态（含 TopBar 高度与板不一致的说明，如有），新增构图三映射行（requiredChecks 只取任意页四项）、REQUIRED_CHECKS 条目与 story 清单（storybook-map.md「十个 story 全部被引用」一句随之改）；SUB-092 停下时 DIFF-2 改记「待 Owner：页面模板批次」，不加映射行；DIFF-8：「待 Owner 知悉：第二批品牌」；DIFF-9：「待 Owner 知悉」，refs 写 R2-25 与 SUB-072 判据，不恢复资产 ID 列；新增 DIFF-10：Brand 板夜间说明写 TMS #2c63c8，包按 O-3 为 #7aa0f5，「已裁定（O-3，设计会话 B 类）」；改 storybook-map.md「读法」第 5 条与 storybook-visual-proof.mjs:62–64 的过时注释。报告不手改，由 SUB-076、SUB-078 批末再生。判据读数：storybook:visual-proof 的映射校验（行、差异引用、story 清单）绿，样板 10 行与构图三行没有 requiredNotApplicable；geometry:measure 绿。
- 档位：经济——映射数据与注释，判定不变。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/geometry-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`

#### TCRN-DS-SUB-076 · R2 末再生映射报告

- 包 / 波：P4 / W3（包内第 3 项，整包经济档）
- 来源：R3-20（既有 Subtask、判断 §5.3 第 1 条）
- 链上：既有 Subtask，状态保持 active，链上记录不动（判断 §3.3 第 10 条）；本节只写 R3 的排程与判据
- 文件：`docs/verification/storybook-visual-proof/gplus-map-report.json`，`docs/verification/storybook-visual-proof/gplus-map-report.md`（.md 仅当脚本同写时变）
- 依赖：TCRN-DS-SUB-093，TCRN-DS-SUB-094，TCRN-DS-SUB-092，TCRN-DS-SUB-106
- 判据：R3 重做（链上记录不动）：在 SUB-093 改完差异记录、SUB-094 加入 shellFrame 之后，storybook-visual-proof.mjs --write-report 更新 gplus-map-report.json；样板 10 行与构图三行全绿时不再注 O-1，余红逐行列原因；不改期望值。
- 档位：经济——报告再生，判定不变。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/storybook-visual-proof.mjs --write-report`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`

### TCRN-DS-STORY-131 · 八项 DOM 测量进仓当门，对 Storybook 渲染结果跑，每项附会红的变异

#### TCRN-DS-SUB-094 · 几何门新增 shellFrame 必测项：样板实测纸离边 12 与壳顶栏 52，各附会红的变异

- 包 / 波：P2 / W2（包内第 3 项，整包主力档）
- 来源：R3-4（O-1、129-GWT3、131-GWT4）
- 文件：`scripts/lib/gplus-measure.mjs`，`scripts/geometry-measure-proof.mjs`，`tests/geometry-measure-proof.test.mjs`，`tests/fixtures/geometry-measure/**`，`docs/design/gplus-2026-10/storybook-map.json`，`docs/design/gplus-2026-10/storybook-map.md`，`scripts/storybook-visual-proof.mjs`，`tests/storybook-visual-proof.test.mjs`（tests/fixtures/geometry-measure/** 只加该项的自检夹具；storybook-visual-proof.mjs 与其测试仅当门要求每个必测项都有 ROW_MUTATIONS 条目时改）
- 依赖：TCRN-DS-SUB-090
- 判据：131-GWT4、129-GWT3（纸离边 12 现只能靠目视）：gplus-measure.mjs 加必测项 shellFrame（名字可调，交回写明）：在每个 [data-shell] 内读纸面离壳边的距离与壳顶栏高度，目标元素用包类，不在 story 加钩子；阈值 12、52 与容差写在门的阈值表（geometry-measure-proof.mjs:57 一带）；SAMPLE_CHECKS（:86）加该项，storybook-map.json 十个样板行的 requiredChecks 同步（.md 同步）；STORY_MUTATIONS 加两条变异（离边归零、顶栏回 68）各判红；夹具自检（tests/fixtures/geometry-measure/manifest.json）补该项的红绿夹具；storybook-visual-proof 要求每项都有 ROW_MUTATIONS 条目时补一条（:77 起）；测试同步。131 正文的「八项」按全部必测项读，加项后十项，「全绿」不变。判据读数：geometry:measure 全绿，样板 10 行 shellFrame pass，两条变异各判红；storybook:visual-proof 的样板行没有 requiredNotApplicable。
- 档位：主力——新增门的必测项与判定。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/geometry-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`

#### TCRN-DS-SUB-078 · R2 末再生几何测量报告

- 包 / 波：P4 / W3（包内第 4 项，整包经济档）
- 来源：R3-20（既有 Subtask、判断 §5.3 第 1 条）
- 链上：既有 Subtask，状态保持 active，链上记录不动（判断 §3.3 第 10 条）；本节只写 R3 的排程与判据
- 文件：`docs/verification/geometry-measure/report.json`
- 依赖：TCRN-DS-SUB-076，TCRN-DS-SUB-094
- 判据：R3 重做（链上记录不动）：geometry-measure-proof.mjs --write-report 更新 docs/verification/geometry-measure/；notApplicableRequired 与 checksNeverApplied 为空，probes 含 iconStroke 与 shellFrame，样板 rail 与 shellFrame 全绿，不再注 O-1。
- 档位：经济——报告再生，判定不变。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/geometry-measure-proof.mjs --write-report`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`

### TCRN-DS-STORY-133 · 门接入 pnpm verify 与 CI，更新 style-scale.md 与机器消费契约文档，分阶段验证规则沿用 STORY-119

#### TCRN-DS-SUB-095 · foundation 标准页搜索读数的词条键由 36px 改为 32px，zh-CN 三条新漏译清零

- 包 / 波：P0 / W1（包内第 1 项，整包经济档）
- 来源：R3-15（C2-4）
- 文件：`apps/storybook/src/build/locales/storybook-content-text.ts`（不改 story-content.tsx）
- 依赖：无
- 判据：133-GWT1（C2-4；三条漏译来自 496c1d7）：storybook-content-text.ts:1301 的词典键「260px rest, 360px expanded, 36px high」与五语值改为 32px，与 story-content.tsx:1482 用 oracle 值拼出的串一致；不加豁免，取改键而不取拼接（判断 §3.3 第 7 条）。判据读数：internal-alpha browser-proof 的 localeLeakZhCnNewLeaks 不再含 foundation-visual-standards 的三条。
- 档位：经济——词条修正。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof（跑完 git -C <包树> checkout -- docs/verification/internal-alpha 还原回执）`

#### TCRN-DS-SUB-096 · 契约 README、设计目录 README 与 roles.json 说明按落地事实回写

- 包 / 波：P0 / W1（包内第 3 项，整包经济档）
- 来源：R3-17（A2-2 (a)(b)(d)、B2-3、C2-6、C §5 P9 条件）
- 文件：`docs/contract/README.md`，`docs/design/gplus-2026-10/README.md`，`docs/contract/roles.json`（roles.json 只改 description）
- 依赖：无
- 判据：133 文档回写（A2-2 (a)(b)(d)、B2-3、C §5 P9 SUB-084 行的条件）：docs/contract/README.md 第 47 行一带按 runs/r2/problems/P3.md 问题 P2 的正文改，并写明 internal-alpha 的 clipped 判定接受最近带 title 的祖先、与收紧后的 C7 有差异；docs/design/gplus-2026-10/README.md 第 12 行 Inputs 文本类补 rf，第 16 行补 29 条刻度 token、链接对表与生成进 gplus-tokens.generated.ts，加一句「浅色选择器由契约夜间选择器的属性派生」（不改契约值）；roles.json 的 description 写明第一批承载元素的 title 须含可见文字（O-7 维持，只改 description）。判据读数：readme:proof、public-output:scan、internal-vocab:scan、contract:static 不转红。
- 档位：经济——文档回写，判定不变。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run readme:proof（会写回执时跑完还原）`
  - `corepack pnpm@10.12.1 -C <包树> run public-output:scan`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`

#### TCRN-DS-SUB-097 · inputs.pairs 段注释补 rf，生成器注释字串同步

- 包 / 波：P1 / W1（包内第 3 项，整包主力档）
- 来源：R3-3（A2-2 (c)）
- 文件：`scripts/contract-generate.mjs`，`packages/ui-react/src/styles/generated/inputs.pairs.ts`（inputs.pairs.ts 只由 contract-generate 写）
- 依赖：TCRN-DS-SUB-088
- 判据：133（A2-2 (c)）：contract-generate.mjs 第 250 行 inputsFile() 写出的注释字串「d/h/f/x/r/e/ef」补 rf 后重生成；inputs.pairs.ts 只变第 5 行注释，contract-sha256 不变（注释不进契约哈希）。判据读数：contract:proof 的 generated-sources 绿。
- 档位：经济——生成器注释，判定不变（整包按主力派）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`

#### TCRN-DS-SUB-098 · storybook-smoke 的焦点比较在 outline-style 为 none 时不比 outline-width 与 outline-offset

- 包 / 波：P2 / W2（包内第 1 项，整包主力档）
- 来源：R3-5（B2-2、C2-2、O-1）
- 文件：`scripts/storybook-smoke.mjs`，`scripts/full-surface-remediation-proof.mjs`，`tests/full-surface-remediation.test.mjs`（full-surface 两个文件仅当 problems/P1.md 列出其旧壳几何期望时改；apps/storybook/src/smoke.test.ts 不改，需要改时记 problems/P2.md）
- 依赖：TCRN-DS-SUB-090
- 判据：133-GWT1（B2-2 = C2-2，第 17 步 14 条失败全是 searchInput:focus-outline-width:3px）：storybook-smoke.mjs 的 focus 比较（期望见 :293）在 outlineStyle 为 none 时不比 outlineWidth 与 outlineOffset，三个子证明共用同一比较；不在包里回加 outline:0；正反两例写成脚本内自检（比较函数导出并在启动时先跑：none 配 3px 判同、solid 配不同宽度判异），不新增测试文件、不改 package.json；problems/P1.md 列出的钉着旧壳几何（280、92、68、洗底、右边线）的冒烟与 full-surface 期望按新 token 值改，逐条在交回列前后值（O-1 的直接后果，不算改阈值，判断 §3.3 第 6 条）。判据读数：storybook:smoke 退出码 0，第 17 步三项（含 designSystemVisualInstanceParityReadback、ownerQualityProductShellProof）不再报 focus-outline-width；full-surface:proof 绿。
- 档位：主力——改门的比较语义。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run full-surface:proof`

#### TCRN-DS-SUB-099 · internal-alpha 的手机锚点循环沿用 G+ 透明层放行

- 包 / 波：P2 / W2（包内第 2 项，整包主力档）
- 来源：R3-6（C2-3）
- 文件：`scripts/internal-alpha-browser-proof.mjs`（仓内没有该门的单测文件，正反用例写成脚本内自检（跨包约定第 7 条））
- 依赖：TCRN-DS-SUB-090
- 判据：133-GWT1（C2-3；第 30 步 mobileHashAnchorOcclusionCheck 的失败字段是 mobile-layer-transparent:searchInput:rgba(0, 0, 0, 0)）：锚点循环（internal-alpha-browser-proof.mjs:1789–1797）对 searchInput、themeToggle 两层沿用 gplusMobileHeaderFillLayers（:48），与知识库壳循环（:2116–2129）一致；header 不透明底层的要求不放宽；层判定抽成函数，脚本内自检两例（searchInput 透明放行、header 透明仍判红）；problems/P1.md 列出的本门旧壳几何期望一并改。判据读数：internal-alpha browser-proof 的 storyCoverageManifestOk 为 true、mobileHashAnchorOcclusionCheck 通过。落地后 SUB-046 不再有这项阻塞。
- 档位：主力——改门的判定。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof（跑完 git -C <包树> checkout -- docs/verification/internal-alpha 还原回执）`

#### TCRN-DS-SUB-100 · 导航壳故事的静态搜索结果留在版面内，searchOverlay 期望数改为 6（承接 SUB-080）

- 包 / 波：P3 / W2（包内第 1 项，整包主力档）
- 来源：R3-9（C2-1、SUB-080、RM15）
- 文件：`scripts/geometry-proof.mjs`，`apps/storybook/src/contract-stories/story-content.tsx`，`apps/storybook/src/story-demo-styles.ts`，`apps/storybook/src/alpha-styles.ts`，`apps/storybook/src/storybook.css`，`scripts/shell-fidelity-proof.mjs`，`docs/design/gplus-2026-10/doc-class-map.json`（文档规则写进 story-demo-styles.ts 或 alpha-styles.ts 之一；storybook.css 由 demo-styles-sync 写；docs/verification/doc-shell-class/baseline.json 不改）
- 依赖：TCRN-DS-SUB-090
- 判据：133-GWT1（C2-1，真实 verify 停在第 10 步；R1 C-16 → SUB-080 已退回一次）：1）geometry-proof.mjs 的 openMenus 期望（计数 :227，判定 :251）由 8 改为 6，提交说明逐个列出被数的 6 个菜单并引 SUB-066 的原型退役；被数的 6 个必须正好是原 8 个减去两个原型菜单钮，逐个核对，对不上就停下（不改为只数 searchStory 内的展开元素）；2）story-content.tsx 的 search 入参恢复一个 tcrn-doc- 前缀的类（不用原名 tcrn-product-shell-search--static-display，否则 128-GWT1 的包外类回到 1）；文档规则在该容器内让 .tcrn-product-shell-search__results 取 position static、inset auto、width 100%、margin-block-start space-2；position 与 inset 不在守卫摆放属性内，在 shell-fidelity-proof.mjs 的 DOC_PACKAGE_CLASS_EXCEPTIONS 按 EX-INIT015-doc-* 写法登记例外（裁定引判断 R3-9 与 §3.3 第 4 条，删除条件「Navigation 家族批次由包提供静态结果展示」）；doc-class-map.json:39 该条改为 rename-tcrn-doc 并写新名。判据读数：geometry:proof 的 searchOverlay baseline 与 restored 绿、broken（:449 的变异）红；doc-shell:proof 包外类为 0；shell-fidelity-proof 绿且新例外被用到。SUB-080 链上保持 active，由本单承接，随 R3 链写转 done。再退回即停下，写进收口文件交 Owner。
- 档位：主力——改门的计数与守卫例外；再退回交 Owner。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/demo-styles-sync.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/demo-styles-sync.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-fidelity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`

#### TCRN-DS-SUB-101 · 文档壳跟随包壳几何（C-21），删除两条暂缓例外

- 包 / 波：P3 / W2（包内第 3 项，整包主力档）
- 来源：R3-10（C-21、O-1、O-2、N-1）
- 文件：`apps/storybook/src/alpha-styles.ts`，`apps/storybook/src/story-demo-styles.ts`，`apps/storybook/src/storybook.css`，`scripts/shell-fidelity-proof.mjs`，`apps/storybook/src/build/foundation-visual-standards.ts`，`scripts/shell-parity-proof.mjs`，`apps/storybook/src/build/locales/storybook-content-text.ts`（storybook.css 由 demo-styles-sync 写；foundation-visual-standards.ts 只改受壳几何影响的 oracle 值；shell-parity-proof.mjs 仅当钉着旧包壳几何字面值时改，不改角色与容差；storybook-content-text.ts 仅当 oracle 值变化让拼接串出现 zh-CN 新漏译时改）
- 依赖：TCRN-DS-SUB-090，TCRN-DS-SUB-100，TCRN-DS-SUB-092
- 判据：133-GWT1（第 11 步 shell:parity 红在文档壳 brand-lockup、sidebar、shell-relations 三角色，brandLockup 矩阵 4/4 红，sampleShell 2/9 红；C-21 在 R2 暂缓到 O-1 之后）：tcrn-doc-* 规则按 SUB-090 落地后的包壳几何对齐（侧栏 220 与收起 52、画布色无右边线、顶栏 52、品牌锁定关系），现文档壳侧栏为 clamp(280px, 20vw, 360px)（alpha-styles.ts:103、:105）、左栏面为 brand-secondary-bg（:108）；shell-fidelity-proof.mjs 的 EX-INIT015-doc-shell-brand-collapse 与 EX-INIT015-doc-shell-brand-narrow（:313–335，删除条件「O-1 答复」已满足）删除，改为跟随包的行为，JUDGMENT_C21 无引用时一并删；foundation-visual-standards.ts 的文档壳 oracle（shellMetrics 与 :575 的说明）只改受壳几何影响的值，冒烟与 internal-alpha 经 AI 契约读 oracle，不改 P2 的门文件。复核 N-1：文档导航分类计数（ink-3）随侧栏画布色，于 bg 浅色 4.86、夜间 4.89，不改字色；手机视口文档顶栏高度（P9 #4）不在本单，除非门转红。判据读数：shell:parity 三角色、brandLockup 矩阵与 sampleShell 全绿；internal-alpha browser-proof 的 axe 不再报标语、壳品牌说明与导航分类计数三类节点（O-2 随 O-1 解决；仍有则不加豁免，记 problems/P3.md，收口交 Owner 二选一）；P2 持有的门文件里钉着旧文档壳几何的字面期望只记 problems/P3.md。
- 档位：主力——删守卫例外、改 oracle 期望（门的数据）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/demo-styles-sync.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/demo-styles-sync.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-fidelity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run shell:parity`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run doc:sample-style`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof（跑完 git -C <包树> checkout -- docs/verification/internal-alpha 还原回执）`

#### TCRN-DS-SUB-102 · shell-fidelity 规则级守卫对 C7 单行承载类不把换行属性算作摆放

- 包 / 波：P3 / W2（包内第 4 项，整包主力档）
- 来源：R3-12（C §5 P5 条件）
- 文件：`scripts/shell-fidelity-proof.mjs`（承载类名单从 docs/contract/roles.json 读，不改 roles.json；仓内没有该门的单测文件，自检即正反用例）
- 依赖：TCRN-DS-SUB-101
- 判据：133（C §5 P5 第 1 行的条件，验收接受 P5 口径时所附）：packageClassAppearanceFindings（shell-fidelity-proof.mjs:360 起）对 roles.json singleLine 登记的承载类（tcrn-button__label、tcrn-breadcrumb__item、tcrn-nav-item__label、tcrn-badge__label、tcrn-table-shell__cell、tcrn-page-header__title）不把 white-space、overflow-wrap、word-break（PLACEMENT_PROPERTIES :262–270）算作摆放，名单从 roles.json 读、不在脚本里另抄；规则级守卫自检（:590 起）加变异：文档 CSS 把 tcrn-button__label 改回折行，判红；既有自检用例（如 :599 对 .tcrn-button 的 white-space:nowrap）结果不变。判据读数：shell-fidelity-proof 全绿，新变异判红；tokens:proof 第 10 段绿。
- 档位：主力——改守卫的判定语义。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-fidelity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run build`

#### TCRN-DS-SUB-103 · style-scale 的门清单与例外名单按现状改写，foundation 标准页去掉计划键，宽限说明按现状

- 包 / 波：P4 / W3（包内第 1 项，整包经济档）
- 来源：R3-18（C2-6、C §5 P11 条件、RM17 ③、RM18）
- 文件：`docs/style-scale.md`，`apps/storybook/src/build/foundation-visual-standards.ts`，`scripts/lib/story-budget.mjs`，`apps/storybook/src/build/locales/storybook-content-text.ts`（storybook-content-text.ts 仅当改动的英文串在词典里有条目时同步改键与五语值）
- 依赖：TCRN-DS-SUB-100，TCRN-DS-SUB-101，TCRN-DS-SUB-102
- 判据：133（C2-6 与两条条件项）：docs/style-scale.md「Three gates hold that line」（第 179 行起）与第 179–187、232–237 行，按 shell-fidelity-proof.mjs 的 PLACEMENT_PROPERTIES 与 DOC_PACKAGE_CLASS_EXCEPTIONS 现状改写（含 SUB-100 新登记的例外、SUB-101 删掉的两条、SUB-102 的承载类排除）；foundation-visual-standards.ts 第 546 行一带的字段去掉计划键 pre-INIT-001、INIT-002（C §5 P11 行条件）；story-budget.mjs 里 color-palette 宽限说明的「39 格」按现状改（SUB-046 若刷新宽限表则并入）。判据读数：internal-vocab:scan、public-output:scan 绿；internal-alpha browser-proof 的 zh-CN 新漏译不增加。
- 档位：经济——文档回写，判定不变。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
  - `corepack pnpm@10.12.1 -C <包树> run public-output:scan`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof（跑完 git -C <包树> checkout -- docs/verification/internal-alpha 还原回执）`

### TCRN-DS-STORY-134 · 4.0.0 候选：版本面、CHANGELOG、消费方迁移说明、pack 冒烟与 Owner 目视验收清单

#### TCRN-DS-SUB-104 · 七种「标签 — 原因」title 补齐另一半五语词条，非英文下不再半译

- 包 / 波：P0 / W1（包内第 2 项，整包经济档）
- 来源：R3-16（C2-5、I1 问题 3）
- 文件：`apps/storybook/src/build/locales/storybook-content-text.ts`，`scripts/lib/locale-invariant-ledger.mjs`（locale-invariant-ledger.mjs 仅当按机器词登记时改）
- 依赖：TCRN-DS-SUB-095
- 判据：134 候选版可见文案（C2-5）：按 runs/r2/problems/I1.md 第 3 条的探针清单，给只有一边在词典里的 7 种组合补另一边的五语词条：标签 Add record placeholder、Promote（components-records-and-boards），Dispatch、Inspect、Promote（components-detail-and-inspection），Refresh（patterns-data-pages），以及原因「Document publishing is not wired in this static DS fixture」（标签 Publish，components-documents-and-collaboration，其 sr 文本与 data-disabled-reason 同串）。判据读数：按 I1 的读法（构建产物各页、五种语言，读全部含「 — 」的 title；临时探针放会话 scratch，不进仓）四种非英文语言下 21 种 title 两边都已翻译、与英文相同的为 0；internal-alpha browser-proof 的 zh-CN 新漏译不增加。
- 档位：经济——补词条。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof（跑完 git -C <包树> checkout -- docs/verification/internal-alpha 还原回执）`

#### TCRN-DS-SUB-105 · 清理原型退役残留：紧凑壳文档规则、原型行与无人用的 denseShell 导出，导出面去掉两个原型名

- 包 / 波：P3 / W2（包内第 5 项，整包主力档）
- 来源：R3-13（C2-7）
- 文件：`apps/storybook/src/story-demo-styles.ts`，`apps/storybook/src/storybook.css`，`apps/storybook/src/contract-stories/content/component-rows.ts`，`apps/storybook/src/contract-stories/content/navigation-rows.ts`，`packages/ui-react/src/index.tsx`，`packages/ui-react/src/index.test.tsx`（storybook.css 由 demo-styles-sync 写；smoke.test.ts 在 HEAD 087651f 已无两名命中，不改）
- 依赖：TCRN-DS-SUB-102，TCRN-DS-SUB-092
- 判据：134 导出面（C2-7，SUB-066 原型退役的残留）：删 .tcrn-doc-shell-demo--compact 文档规则（story-demo-styles.ts:563，storybook.css:870 由 demo-styles-sync 同步）；component-rows.ts 的 storybookOnlyPrototypeRows 删第 32、34 行（Dense、Compact；KnowledgeBaseShellDemo 行保留）；navigation-rows.ts 删无人引用的 denseShell* 导出（denseShellNavigationGroups、denseShellTaskLanes、denseShellHubActions、denseShellQuickLinks 与三个计数，及只服务它们的类型；denseShellMenuDensityRows 仍被 story-content.tsx:195、:2127 使用，保留）；ui-react 导出面 componentLibraryDeferredPrototypeNames 去掉两名（index.tsx:153、:155），index.test.tsx:82、:84 改为断言两名不在清单里。CHANGELOG 与迁移说明各一行由 SUB-106 写。Owner 若更正判断 §3.4 第 4 项、保留原型，本单作废。判据读数：git grep 两个原型名在 apps、packages、scripts 下无命中；ui-react 测试、design-system-storybook 测试与 doc-shell:proof 绿。
- 档位：主力——改 ui-react 导出面。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/demo-styles-sync.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/demo-styles-sync.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `git -C <包树> grep -n -E "DenseOperationsShellDemo|CompactToolShellDemo" -- apps packages scripts`

#### TCRN-DS-SUB-106 · 目视清单、CHANGELOG、迁移说明与两份 README 随 R3 回写

- 包 / 波：P4 / W3（包内第 2 项，整包经济档）
- 来源：R3-19（A2-3）
- 文件：`docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md`，`CHANGELOG.md`，`docs/migration-4.0.md`，`packages/ui-tokens/README.md`，`docs/design/gplus-2026-10/README.md`（owner-acceptance.md 第 228 行 P18 由 SUB-046 写）
- 依赖：TCRN-DS-SUB-090，TCRN-DS-SUB-088，TCRN-DS-SUB-091，TCRN-DS-SUB-092，TCRN-DS-SUB-093，TCRN-DS-SUB-096，TCRN-DS-SUB-105，TCRN-DS-SUB-103
- 判据：134 文档回写（A2-3，并 R3 改动）：owner-acceptance.md「待 Owner 裁定」表（第 212 行起）现有各行注编号（第 1 行 O-1 与 O-4，第 2 行 O-3，第 3 行 O-5，第 9 行 O-11）；O-1…O-4 标「设计会话 B 类裁定（2026-10-11），Owner 可更正」，O-5…O-12 标「按默认执行」；补 O-2、O-6（含 RM8 四条）、O-8、O-9 四行，可附 N-1；第 169 行改为复核项（列表在触发器下方，SUB-091）；新增目视项（构图一壳几何、TMS 夜间后缀、构图三样板）挂进「3 · V2-GPlus-Compositions」一节（第 60 行起），节数仍为 10，第 73 行「已知差距」按落地事实改；只写事实与建议，不代 Owner 勾选。CHANGELOG.md 4.0.0 与 docs/migration-4.0.md：侧栏 280→220、收起 92→52、顶栏 68→52、纸面离边 12 与圆角 14、侧栏画布色无右边线（消费方仍可经 --tcrn-product-shell-sidebar-width 覆写宽度）；4 个新 token；TMS 夜间后缀 #7aa0f5；导出面去掉两个原型名；MultiSelect 容器纵向；门的判定变化只写进 CHANGELOG。packages/ui-tokens/README.md 三块结构的计数与 brand 说明、docs/design/gplus-2026-10/README.md 的新 token 与 brand 夜间值一句按落地事实改。不写发布或验收结论，版本号不动。判据读数：scaffold:proof 的 changelog-release-sections 与 version-surface 绿；public-output:scan、internal-vocab:scan 绿。
- 档位：经济——文档回写，判定不变。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run scaffold:proof（跑完 git -C <包树> checkout -- docs/verification/scaffold-proof.json docs/verification/scaffold-proof.md 还原回执）`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
  - `corepack pnpm@10.12.1 -C <包树> run public-output:scan`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
  - `corepack pnpm@10.12.1 -C <包树> run readme:proof（会写回执时跑完还原）`

#### TCRN-DS-SUB-046 · 批末生成物再生：视觉签名基线选择、internal-alpha 回执、pack 与 storybook:build 证据

- 包 / 波：P4 / W3（包内第 5 项，整包经济档）
- 来源：R3-20（A2-1、既有 Subtask、判断 §5.3 第 2–5 条）
- 链上：既有 Subtask，状态保持 active，链上记录不动（判断 §3.3 第 10 条）；本节只写 R3 的排程与判据
- 文件：`docs/verification/internal-alpha/**`，`docs/verification/internal-alpha-hardening-proof.json`，`docs/verification/internal-alpha-hardening-proof.md`，`docs/verification/scaffold-proof.json`，`docs/verification/scaffold-proof.md`，`docs/verification/readme-public-contract.json`，`packages/ui-tokens/fonts/**`，`scripts/lib/story-budget.mjs`，`docs/verification/doc-shell-class/**`，`docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md`（packages/ui-tokens/fonts/** 仅当 fonts:vendor 执行时变；story-budget.mjs 仅当宽限表条目陈旧或超限时改；doc-shell-class/** 仅当 doc-shell:proof 报差集变化时再生（baseline.json 不改）；owner-acceptance.md 只写第 228 行 P18 现状）
- 依赖：TCRN-DS-SUB-076，TCRN-DS-SUB-078，TCRN-DS-SUB-103，TCRN-DS-SUB-106，TCRN-DS-SUB-090，TCRN-DS-SUB-101，TCRN-DS-SUB-099，TCRN-DS-SUB-095，TCRN-DS-SUB-092
- 判据：R3 重做（链上 scope 不变，只改排程）：前提为五个实施包与 SUB-103、SUB-106 都已合入。0）browser-proof 报构图三或壳几何让宽限表条目陈旧或超限时刷新 story-budget.mjs，逐条记前后值；doc-shell:proof 报差集变化时才再生 doc-shell-class 清零证据（SUB-069 的路径）。1）构建一次，跑正常的 browser-proof；非视觉检查全绿才继续：axe 为 0（O-2 随 SUB-090、SUB-101 解决）、storyCoverageManifestOk（SUB-099）、zh-CN 新漏译 0（SUB-095，以及 SUB-092 词条齐全）、故事高度、clipped、buttonFeedback 绿，门要求的几何检查绿。2）用会话 scratch 的 tmp/r2-P12/gen-selection.mjs 按当次捕获重生选择：签名变化逐条以 accepted-layout-change 接受，理由引 MIN-20261011 的 D1、D6 与 O-1 裁定；已修好的缺陷去掉「含未结缺陷」标注；不把 accepted-layout-change 当作目视通过。3）带 --update-visual-baseline 应用，两次之间不重建，再复跑 browser-proof。4）再生 internal-alpha 四段、hardening、scaffold、readme 回执，加跑 internal-vocab:scan（A2-1）；fonts-vendor --check 报 R3 新文案缺字形时跑一次 fonts:vendor 并复跑 fonts-proof。5）按本单结果写 owner-acceptance.md 第 228 行 P18 的现状，之后跑 pnpm scan（放在最后一次文档提交之后）。6）pack:smoke 的三个 tarball sha256 与 storybook:build 证据写进 handoff/P4.md。非视觉检查有红时不强行写入，SUB-046 保持 active，记拒绝原因交判断；该红只有 Owner 能解（如 O-2 二选一）就进收口，否则进 R4。gen-selection.mjs 在本单写入完成前不得清理，会话轮换时随接续点移交。
- 档位：经济——批末再生，判定不变。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/doc-shell-class-proof.mjs --details`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:contracts`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-browser-proof.mjs --update-visual-baseline <selection.json>`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-hardening-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run scaffold:proof`
  - `corepack pnpm@10.12.1 -C <包树> run readme:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
  - `corepack pnpm@10.12.1 -C <包树> run pack:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/fonts-vendor.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> run fonts:vendor（仅当 --check 报 R3 新文案缺字形时）`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/fonts-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run scan（最后一次文档提交之后）`

