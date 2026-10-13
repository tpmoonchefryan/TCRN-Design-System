# 交回 · P1d（INIT-016 R1，W4）：顶带壳 story 与包侧壳门

包树分支 `claude/init016-r1-p1d`，起点 `c7fd635`（已含 P1a、P2、P3、P4、P1b、P5、P1c）。日志目录记作 `<logs>` = 会话 scratch 的 `logs/r1-p1d/`。

## 1. Subtask 状态

| Subtask | 状态 | 提交 | 改动文件 |
| --- | --- | --- | --- |
| TCRN-DS-SUB-121 | 部分：本包文件集内的改动全部完成；判据里「壳层门有真件可量」与「apps/storybook 测试绿」受包外问题阻挡（问题 1、8，接续点见第 6 节） | `e0462f9`（四个 story 登记）、`db40caa`（包侧壳门） | `apps/storybook/src/contract-stories/story-content.tsx`、`governance.ts`、`groups/components.ts`、`apps/storybook/src/components.stories.tsx`、`apps/storybook/src/build/locales/storybook-content-text.ts`、`storybook-locale-text.ts`、`apps/storybook/src/smoke.test.ts`、`scripts/lib/story-budget.mjs`、`scripts/shell-parity-proof.mjs`、`scripts/geometry-proof.mjs` |

判据对照：

- 四个 story 按 C-9 登记在 `navigation-shells`（七处：story-content、governance、groups/components、CSF 适配导出、smoke 期望清单与 llms 列表、两份 locales 字典），渲染包件 ProductShell 并带 C-5 钩子；新测试「top-band shell stories render the package shell with its measurement hooks」逐屏断言。
- `shell-top-band`：07a A 段三态 × 浅色夜间六屏，`data-shell` 为板上屏名 `ts-closed-l/n`、`ts-x-l/n`、`ts-drop-l/n`；下拉屏含第三级级联（Contracts → Templates → 四个模板）。`shell-narrow`：画框 1023，收起与完整菜单两屏；`shell-mobile`：画框 390，收起与菜单两屏（`ts-m-l`、`ts-m-s`，SUB-126 合入后同一屏显示 Sheet）；`shell-intro`：活的壳加 `ShellIntro`，读回三段时长与会话标记复位。
- `shell:parity` 包侧改量顶带与纸；`geometry-proof` 品牌宿主改为 `shell-top-band` 第一屏收起态，open-menus 重定为 13，INC-399 段未动。
- 有壳层样式时读数合板（问题 1 的注入读数）：顶带 52、标按钮 12/6、134×40、标 22，纸 12/52/12/12、圆角 14、s1，完整菜单左 12 上 52 宽 952，下拉左 = 固定项左、上 = 固定项底 + 6、宽 240，级联 +4、同宽同高。静态页本身目前不带壳层样式（问题 1）。

## 2. 局部门（命令前缀 `corepack pnpm@10.12.1 -C <包树>`）

| 门 | 退出码 | 读数 | 日志 |
| --- | --- | --- | --- |
| `run build` | 0 | — | `<logs>/gate-build.log` |
| `run storybook:build` | 0 | — | `<logs>/gate-storybook-build.log` |
| `--filter @tcrn/design-system-storybook test` | 1 | 11 条，10 过；1 红为既有红（composition-one 侧栏断言，基线即红，问题 8）；新壳 story 测试过 | `<logs>/gate-sb-test.log`（基线 `<logs>/baseline-sbtest.log`） |
| `run shell:parity` | 1 | 19 角色，包侧全部解析；基线红为值差（文档侧未换壳，问题 10；静态页缺壳层样式，问题 1）；变异红、样板角色、品牌矩阵、例外探针正常 | `<logs>/gate-shell-parity.log` |
| `run geometry:proof` | 1 | INC-399 段抛错中断（问题 7）；本包改的段见下行 | `<logs>/gate-geometry-proof.log` |
| scratch 复本（跳过 INC-399 与容纳矩阵，`exec node`） | 1 | 有壳层样式：品牌基线绿、三组变异红后绿，徽标与拷贝绿，open-menus 13；搜索段基线红（问题 6）。无壳层样式：品牌基线红（问题 1） | `<logs>/geometry-harness-1.json`、`geometry-harness-0.json` |
| `run public:naming:proof` | 0 | 70 story、350 条 locale 标签 | `<logs>/gate-public-naming.log` |
| `run internal-vocab:scan` | 0 | hits 0 | `<logs>/gate-internal-vocab.log` |

另做的只读核对（scratch 脚本，不是门）：zh-CN 英文泄漏扫描对四个 story 为 0 条（按 `findLatinLeaks` 与账本豁免）；新词条与同语言其它键无同值（40 条内容键、8 条标题与描述）；story 高度按 browser-proof 的量法逐页测。跑门后 `docs/verification` 无改动。

## 3. 写明的选择与回显项

1. **样例数据**：菜单模型按 build-shell2.mjs 的 NAV 与 PINS 结构换成通用英文内容（People / Operations / System 三组，Roster 为当前页，固定项 Roster、Contracts、Statements、Schedule），五语译文与板面中文对应；标用板上的 `tms`，story id 与标题不含产品名。
2. **每屏一窗高**：壳保持包件的 `100dvh`，不在 story 里改高度；`shell-top-band` 因此 5556 高，已按现有写法登记高度预算（问题 1 处置前静态页为 4023）。
3. **静态态的桥**：hover 预览、下拉位置与级联在 story 的标记里切换（`applyMarkupEdits` + CSS anchor 定位 + 包件 `shellMenuCascades` 输出），不造客户端挂载；每屏画框 `contain: layout`（问题 5）。
4. **窄屏与手机画框**：宽 `min(100%, 1023px)` 与 `min(100%, 390px)`，呈现随视口（问题 3）。
5. **ProductShell 契约 story** 打开头像菜单，供 `shell:parity` 的 locale 角色读包侧（问题 11）。
6. **角色改名**：`package-topbar` → `top-band`，`sidebar-surface` → `paper`，`sidebar-group-spacing` → `menu-group-spacing`；文档侧选择器、比对属性、权威方与角色数（19）不变。
7. **品牌门数值**：顶带高与标按钮宽高从 token 注册表读（`--tcrn-shell-strip-h`、`--tcrn-shell-brand-w`、`--tcrn-shell-brand-h`），标 22 沿用；结果键 `brandCollapsedRailWidth`、`brandCollapsedMarkScale` 改为 `brandClosedBandWidth`、`brandClosedMarkScale`。
8. **类目计数**：`navigation-shells` 从 5 到 9，超过 8 的上限，按现有写法登记在 `CATEGORY_STORY_COUNT_GRACE_ALLOWLIST`（键 `Components/navigation-shells`），未抬全局上限。
9. `locale-invariant-ledger.mjs` 无需改动（无新泄漏、无新机器词）。

## 4. 与别包的接口约定（给下游包）

- **story 与屏名**：`shell-top-band`（`ts-closed-l`、`ts-closed-n`、`ts-x-l`、`ts-x-n`、`ts-drop-l`、`ts-drop-n`）、`shell-narrow`（`ts-narrow-l`、`ts-narrow-x-l`）、`shell-mobile`（`ts-m-l`、`ts-m-s`）、`shell-intro`（`ts-intro-l`）。每屏外包 `div[data-tcrn-theme][data-shell-story-block="<屏名>"]`（`style="contain:layout…"`），story 根 `section[data-shell-story="<id>"]`。注册表顺序：`navigation-product-shell-spec` 之后依次四个。
- **story-content.tsx 里的壳件**：`ShellStoryShell`（一屏 ProductShell，纸内容在此）、`shellStoryNavGroups`、`shellStoryMarkup`（按态加桥）、`ShellStoryBlocks`、`ShellIntroStory`，导出 `shellStoryFrameWidths`。SUB-129 改纸内内容改 `ShellStoryShell` 一处即可；ProductShell 有了 `previewStates` 透传或下拉静态入口后可删桥（问题 5）。
- **shell:parity**：包侧宿主 `article[data-story-id="shell-top-band"]`；角色可带 `packageStory` 指定另一个 story（locale 角色读 `navigation-product-shell-spec` 的 `[data-panel="account"]`）。SUB-132 只需改文档侧选择器，值差清单见问题 10。
- **geometry-proof**：品牌宿主 `[data-shell="ts-closed-l"]`；`EXPECTED_OPEN_MENUS = 13` 的构成写在常量注释里，SUB-126 改 INC-399 段或加 Sheet 屏、SUB-136 加 `shell-matrix` 若改变 `[aria-expanded="true"]` 数，须同步此数。
- **story-budget**：SUB-136 登记 `shell-matrix` 时把 `Components/navigation-shells` 的 `recordedStoryCount` 改为 10。
- **词条**：内容字典新增 40 键（菜单模型、纸内文案、各屏内容区名、登入动画读回），locale 文本新增四个 story 的标题与描述；新键五语齐。

## 5. 给下游包的说明

- 问题 1 是壳层门（SUB-137）、视觉证明与签名（SUB-134、SUB-140）在静态页上量真件的前提，建议先于 W5 处置。
- SUB-126：`shell-mobile` 的 `ts-m-s` 即菜单打开屏，Sheet 落地后壳根 `data-state` 若改报 `sheet`，smoke 新测试里该屏期望的 `expanded` 需随之改。
- SUB-137：`STORY_RUN` 只给 `shell-mobile` 开手机视口；`shell-narrow` 的窄屏呈现要 ≤ 1023 视口才出现（问题 3）。

## 6. 接续点

本包无剩余代码工作。判据剩余两项在包外：问题 1 处置后重跑 `run shell:parity` 与 `run geometry:proof`（scratch 复本读数已给出预期）；问题 8 由 SUB-134 / SUB-132 处置后 `--filter @tcrn/design-system-storybook test` 应全绿。
