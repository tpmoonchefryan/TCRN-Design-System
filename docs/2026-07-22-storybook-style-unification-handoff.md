# Storybook 风格统一施工手册（TCRN-DS-INIT-006 交接文档）

> **状态:planned——本文档是拆分产物,不是执行许可。任何 Epic 动工前须 Owner 明确点火。**
> 执行模型:Opus 4.8(或同级)。本文档自包含:不依赖任何会话上下文,所有断言可用文中命令复现。
> 仓库:`TCRN-Design-System`(有 GitHub remote,PR 流)。姊妹仓 `TCRN-AOS` 纯本地无 remote(交付=合入本地 main)。

---

## 0. 背景与目标

INIT-001..005 完成了 v2 视觉重设计、感知签名门、忠实性门、外壳大改版(渐进披露/图标轨/单轴选中/TableToolbar)。Owner 验收后指出:**Storybook 整体仍未统一设计风格**,需要一次完整检查与同步。

2026-07-22 审计(命令见各 Epic「证据」节,均可复现)定位了九项分歧,归并为七个工作流。**结构性根源是 E1**:docs 层 `storybook.css` 维持着一套 v1 时代的组件平行实现,与包真相 `tcrnComponentCss` 重复且分叉——同一组件在 story 里是 v2 的样子、在 docs 章节里是 v1 的样子。先收敛分层,再谈刻度与状态。

**三层样式表的角色(施工前必须理解):**

| 文件 | 角色 | 应有内容 |
|---|---|---|
| `packages/ui-react/src/components/Navigation/Navigation.tsx` 内 `tcrnComponentCss`(约 1290 行起的模板字符串) | **包真相**。组件样式唯一权威,AOS 与 storybook 共同消费 | 全部组件样式+token 定义 |
| `apps/storybook/src/storybook.css` | docs 应用层 | **仅** docs 专属样式(story 卡片框架、代码块等),不得重复组件选择器 |
| `apps/storybook/src/alpha-styles.ts` | doc shell(侧栏/顶栏/披露/搜索等文档外壳) | shell 专属样式,token 化 |

页面注入顺序(`apps/storybook/src/build/page-template.tsx` ~356 行):`tcrnComponentCss` → `alphaStoryCss` → scoped 副本。**包真相先注入,后注入的同名规则会赢**——这就是重复选择器致命的原因。

---

## 0.5 前置裁定(Owner,2026-07-23,CONF-020)——执行时照此办理,不再裁量

审计发现刻度本身存在真空与定义源分裂,以下决策已由 Owner 前置拍板。**任何与本节冲突的施工自由度一律以本节为准。**

| # | 决策 | 裁定 |
|---|---|---|
| D1 | 字号 12px 档 | **新增 `--tcrn-type-size-meta: 12px` 于 ui-tokens**(顺带修复该名的悬空引用,componentCss 已有 3 处 `var(--tcrn-type-size-meta)` 引用但从未定义);15px→`-reading`(14),16px→`-section`(18),10px→`-caption`(11) |
| D2 | 间距刻度 | **定义源唯一权威=`packages/ui-tokens/src/tokens.css`**;componentCss 自补的 `space-1/3/5` 定义**上移**至 ui-tokens;**新增半档 `--tcrn-space-0h: 2px`、`--tcrn-space-1h: 6px`、`--tcrn-space-4h: 18px`**;奇数杂值规则=**就近归档,等距向下**(3px→0h(2)、5px→1(4)、7px→1h(6)) |
| D3 | 圆角 | **新增 `--tcrn-radius-pill: 999px` 于 ui-tokens**(修复悬空:该名 0 定义 2 引用,现渲染直角是隐性 bug);`--tcrn-state-chip-radius`(4px)删除并入 `-control`(同值);componentCss 裸 `6px`→`var(--tcrn-radius-surface)`;`-panel`===`-surface`(6px)**保双名**不归并,style-scale.md 注明同值 |
| D4 | E1 分叉方向 | **包真相 wins**:凡 storybook.css 与 componentCss 同选择器值分叉,以 componentCss 为准;**AOS 随 token/包变化同步改变外观是 fidelity 的正向后果,接受,不逐项呈报** |
| D5 | hover 语言分配 | **文字型控件**(nav 组行/类目行/故事链接/故事披露头/on-this-page/章节 pager 链接/搜索结果项)=颜色位移(`--tcrn-color-brand-primary`);**按钮型控件**(TableToolbar chips/收起钮/侧栏收起钮/主题切换/语言菜单/搜索框聚焦壳)=theme-toggle 家族(componentCss ~1372 行:border+mixed-bg+shadow);**press-scale 应用于全部按钮型** |
| D6 | 治理杂项 | exempt 豁免标记每 Epic PR **集中列表**,Owner 验收时过目;**逐 Epic 合并即 Vercel 上生产**(渐进收敛公开可见,接受) |

## 1. Epic 总览与依赖

| Epic | 名称 | 量级 | 依赖 | 并行性 |
|---|---|---|---|---|
| E1 | 样式表分层收敛(删 v1 平行实现) | 大 | 无 | **先行,阻塞 E2-E4** |
| E2 | 色彩 token 化收尾 | 小 | E1 | E2/E3/E4 可并行 |
| E3 | 字号刻度统一 | 中 | E1 | 同上 |
| E4 | 间距与圆角刻度 | 中 | E1 | 同上 |
| E5 | 交互态矩阵补齐 | 中 | E1-E4 | E5/E6 可并行 |
| E6 | 暗色奇偶校验 | 中 | E1-E4 | 同上 |
| E7 | 风格门(fidelity 检测器) | 中 | E1-E6 | **收官** |

每 Epic:独立分支+独立 PR+合并后 main 独立 `pnpm verify`+落链验收(见 §10)。

---

## 2. E1 样式表分层收敛

**目标**:`storybook.css` 与 `tcrnComponentCss` 的重复选择器归零;docs 页面上组件长相与 story 内完全一致。

**证据(复现)**:
```bash
python3 -c "
import re
def sels(p):
    s=open(p).read()
    return set(re.findall(r'^(\.[a-z0-9_-]+(?:__[a-z0-9-]+)?(?:--[a-z0-9-]+)?)\s*[,{]', s, re.M))
a=sels('apps/storybook/src/storybook.css')
b=sels('packages/ui-react/src/components/Navigation/Navigation.tsx')
print(sorted(a&b))"
```
2026-07-22 审计结果 23 个:`.tcrn-badge`(+3 变体)、`.tcrn-button`(+3 变体)、`.tcrn-environment-banner`、`.tcrn-evidence-strip`、`.tcrn-inline-alert`(+1)、`.tcrn-key-value-list`、`.tcrn-nav-group`(+2)、`.tcrn-readback-panel`、`.tcrn-shell-brand-lockup`(+2)、`.tcrn-side-nav`、`.tcrn-skip-link`、`.tcrn-sr-only`。

**施工步骤(逐选择器,不是逐文件一把删;§0.5 D4 已裁:值分叉默认包真相 wins,AOS 随动不呈报)**:
1. 对每个重复选择器,diff 两处声明。三种裁决:
   - **纯重复/旧值** → 从 storybook.css 整块删除(包真相接管);
   - **docs 专属增量**(如 docs 里按钮需要额外 margin)→ 保留增量属性、删除与包重复的属性,并把选择器改为 docs 作用域(如 `.story-body .tcrn-button` 或加 docs 专属类),**不许**裸组件选择器留在 storybook.css;
   - **包缺失的合理样式**(storybook.css 有而包没有、且 AOS 也该有)→ 上移进 `tcrnComponentCss`,storybook.css 删除。
2. `.tcrn-sr-only`/`.tcrn-skip-link` 这类基建:保留包版本,删 docs 版本。
3. 删除后全文搜 storybook.css 残余的 `#[0-9a-f]{6}` hex——v1 平行实现删块后预计 83 个 hex 大幅下降,残余交 E2。
4. **明确不许动**:`tcrnComponentCss` 里的品牌 accent hex 定义(`--tcrn-brand-accent-*`,14 处)是 token 定义处,合法,不动;alpha-styles 本 Epic 不动。

**验证**:
```bash
pnpm --filter @tcrn/ui-react build && pnpm --filter @tcrn/ui-react test
pnpm --filter @tcrn/design-system-storybook build
pnpm verify   # 全门
cd ../TCRN-AOS && pnpm aos:frontend-shell-proof   # AOS 联动(componentCss 若有上移)
```
**基线预算**:docs 章节里组件外观将改变(v1→v2 对齐)→ 签名门**预期超阈值漂移**,走记录式重标定:`node scripts/internal-alpha-browser-proof.mjs --update-visual-baseline` 后**必须干净复跑一次**确认 0 回归(update 跑本身报红是设计)。重标定理由写入提交信息。

**验收**:重复选择器=0(复现命令输出空);main 独立 verify 绿;AOS proof ok=true(1576 检查)。

---

## 3. E2 色彩 token 化收尾

**目标**:E1 后 shell 两文件残余颜色字面量清零(token 定义处除外)。

**证据**:`grep -oE '#[0-9a-fA-F]{3,8}\b' <file> | wc -l` → 审计时 storybook.css=83、alpha-styles=1(+6 rgba 阴影)。E1 后重测,残余逐个处理。

**施工**:
1. 每个残余 hex:在 componentCss 的 token 区找语义对应(`--tcrn-color-*`);无对应且确有语义的,新增 token 于 componentCss 的 `:root` 区(light+dark 两态都要),再引用。
2. rgba 阴影:收敛为共享阴影值。若包已有阴影 token 用之;没有则在 shell 层定义 `--tcrn-doc-shadow-*` 变量集中声明,禁止行内散写。
3. `color-mix(in srgb, var(...) N%, transparent)` 属 token 衍生,**合法保留**。

**验收**:两文件 hex=0(不含注释);dark 主题截图抽查 3 页无异常;verify 绿。

---

## 4. E3 字号刻度统一

**目标**:全部字号走 `--tcrn-type-size-*` 刻度;消灭 10px。

**证据**:`grep -oE 'font-size: [0-9.]+px' <file> | sort | uniq -c`。审计:alpha=24 处字面量(10px×1/11×6/12×11/14/15/16×2/18×2),storybook.css=10 处,componentCss 自身也有 12px×10、11px×3 混用。

**施工**(映射表已由 §0.5 D1 裁定,照办):
1. 刻度定义在 `packages/ui-tokens/src/tokens.css`(权威源):caption=11 / body=control=ui=13(三名同值) / reading=14 / section=18 / page=28 / stamp-min=12(Stamp 专用语义,不作通用档)。
2. **先在 ui-tokens 新增 `--tcrn-type-size-meta: 12px`**——同时修复悬空:componentCss 已引用该名 3 处但从未定义。
3. 裁定映射:10px→caption(11);12px→meta(12,零漂移);15px→reading(14);16px→section(18);其余按同值 token 语义就近(11→caption、13→ui/body/control 按用途、14→reading、18→section)。
4. componentCss 内部的 12px/11px 字面量同样归 token(它自己定义的刻度自己要用)。
5. 例外登记:确因光学对齐需要的字面量,在行尾注释 `/* type-scale-exempt: <原因> */`,E7 的门将只放行带此标记的行。

**验收**:三文件 `font-size: N px` 字面量=0(或全部带 exempt 标记);verify 绿;基线漂移按 E1 同流程重标定(字号变化会动版面,**预期大面积漂移,这是本 Epic 的合法代价**,重标定理由写清)。

---

## 5. E4 间距与圆角刻度

**目标**:间距归 `--tcrn-space-*`;圆角层级成文并 token 化。

**证据**:审计 alpha-styles gap/padding 字面量分布:12px×51、10px×48、8px×32、4px×19、6px×18、2px×15、14px×9、**7px×8、3px×5、5px×4**(奇数档=乱值信号)、18px×6、16px×6;`--tcrn-space-*` 使用率仅 6 处/文件。圆角:`999px`×15(三文件合计)未走 `--tcrn-radius-pill`;componentCss 有裸 `6px`×1 与私有 `--tcrn-state-chip-radius`×2。

**施工**(刻度与规则已由 §0.5 D2/D3 裁定,照办):
1. **定义源归一**:componentCss 自补的 `space-1: 4px / space-3: 12px / space-5: 20px` 上移至 ui-tokens(componentCss 删除自补);ui-tokens 新增 `--tcrn-space-0h: 2px`、`--tcrn-space-1h: 6px`、`--tcrn-space-4h: 18px`。完成后刻度=2/4/6/8/12/16/18/20。
2. 映射:2→0h、4→1、6→1h、8→2、12→3、16→4、18→4h、20→5;**奇数杂值就近归档、等距向下**:3px→0h(2)、5px→1(4)、7px→1h(6)。逐处替换仍需人查上下文(替换处若致视觉明显走样,标 exempt 并入集中列表)。
2. `999px` 全部→`var(--tcrn-radius-pill)`。
3. 圆角按 §0.5 D3 裁定:ui-tokens 新增 `--tcrn-radius-pill: 999px`(修悬空 bug——该名现 0 定义 2 引用,渲染直角);裸 `6px`→`var(--tcrn-radius-surface)`;`--tcrn-state-chip-radius` 删除并入 `-control`(同 4px);`-panel`/`-surface` 保双名。
4. **圆角层级成文**(写入本文档同目录新文件 `docs/style-scale.md`):导航/指示条=0;控件(按钮/输入/chip)=`-control`;卡片/story 容器=`-surface`;面板=`-panel`;徽章/pill=`-pill`。凡新增样式必须从此表取值。
5. **明确不许动**:导航的零圆角(INIT-005 二轮裁定)不许回退。

**验收**:间距字面量仅剩刻度档内值且 space-token 使用率显著上升(目标:shell 两文件 gap/padding 字面量 <20 处,全部为映射表内值);999px=0;verify 绿。

---

## 6. E5 交互态矩阵补齐

**目标**:每个可交互 shell 控件三态齐备(hover / focus-visible / active),语言取自既有家族,不发明新样式。

**证据**:`grep -c ':hover|:focus-visible|:active'` → alpha=15/11/**0**、storybook.css=7/2/**0**、componentCss=9/6/5。**shell 层按压无任何响应**;focus-visible 在 storybook.css 近乎缺席。

**既有语言(引用,勿造新)**:
- hover:文字/图标色移 `--tcrn-color-brand-primary` 或 theme-toggle 家族的 border+mixed-bg+shadow(componentCss ~1372 行);
- press:`transform: scale(var(--tcrn-motion-press-scale))`(componentCss `.tcrn-button:active`,带设计注释);
- focus:`--tcrn-color-focus-ring` outline(搜 componentCss `:focus-visible` 现例)。

**施工**(hover 分配已由 §0.5 D5 裁定):**文字型**(nav 组行/类目行/故事链接/故事披露头/on-this-page/章节 pager 链接/搜索结果项)=色移;**按钮型**(TableToolbar 搜索、chips、收起钮/侧栏收起钮/主题切换/语言菜单)=theme-toggle 家族;press-scale=全部按钮型。逐控件补齐缺失态,PR 描述贴**矩阵表**(控件×三态,标注每格来源规则)。
- 键盘可达性:每个控件 Tab 可达且 focus ring 可见(浏览器实测,读 computed outline)。
- **测量纪律**:无头面板不维持合成 :hover——态验证用「规则存在于样式表+同选择器家族已在线上工作」的契约级证明,或读 cssRules;不要靠截图。

**验收**:矩阵全绿;axe 0;verify 绿(交互态不入截图,预期零漂移)。

---

## 7. E6 暗色奇偶校验

**目标**:暗色主题全站与亮色同等完成度;新增面(INIT-005 的 toolbar/disclosure/icon-rail)实测过关。

**证据**:审计新增面 dark 专属规则=0(靠 token 自动翻转,从未实测);axe 目前只跑 light;dark 规则数 alpha=8/storybook.css=2/componentCss=4。

**施工**:
1. 浏览器实测:`?theme=dark` 打开五个 section 页,截图逐页检查——重点:图标轨图标对比度、选中指示条可见性、TableToolbar chips 按压态、披露 chevron、EvidenceStrip、表格斑马纹。
2. 每处翻转失效:优先修 token 映射(dark 侧值),仅当语义确需分叉才写 `[data-tcrn-theme="dark"]` 专属规则。
3. **proof 扩展**:`scripts/internal-alpha-browser-proof.mjs` 的 `runAxe` 增加 dark 主题跑道(desktop 视口够用),违规计入 `axeViolationCount`。对比度门槛 4.5:1 同 light。
4. 注意既往教训:muted 色在 panel 面 3.35:1 过不了 4.5 门(MIN-015 案例)——dark 侧同类风险点先查 `--tcrn-color-text-muted`/`-secondary` 的 dark 值。

**验收**:dark axe 0 违规;五页 dark 截图入 PR;verify 绿(axe dark 跑道并入后)。

---

## 8. E7 风格门(使统一可持续)

**目标**:E1-E6 的成果由 fidelity 检测器守护,回退即红。参照 INIT-003「真门」哲学:检测器必须**双向验证**(注入违规即红、修复即绿),禁止假门。

**施工**(全部加进 `scripts/shell-fidelity-proof.mjs`,该文件已有 gradient/radius/kill-switch 检测器可参照结构):
1. **hex 禁令**:storybook.css 与 alpha-styles 出现 `#[0-9a-f]{3,8}` 即红(白名单:注释、token 定义行——按行正则排除)。
2. **字号刻度门**:`font-size: N px` 字面量即红,除非行尾带 `/* type-scale-exempt:` 标记。
3. **间距刻度门**:gap/padding 字面量仅允许 E4 映射表档位值(表写死在检测器里,来源注明 `docs/style-scale.md`)。
4. **pill 禁令**:`999px` 即红。
5. **重复选择器门**:E1 的交集脚本产品化——storybook.css ∩ componentCss 顶层类选择器交集非空即红(`.tcrn-sr-only` 等明确豁免项写死白名单)。
6. 每个检测器:注入一处违规跑一次(须红)、还原跑一次(须绿),两次结果都写进 PR 描述。
7. `package.json` 的 `tokens:proof` 链已含 shell-fidelity-proof,无需另挂。

**验收**:五检测器双向验证记录齐全;全量 verify 绿;此后任何人(含模型)违反刻度,门直接拦。

---

## 9. 通用施工须知(陷阱手册——每条都是实际踩过的)

1. **verify 链**:`pnpm verify` 是总门(tokens/fidelity/smoke/隐私/签名/axe/覆盖/i18n)。改动后完整跑,不要挑着跑。
2. **重标定双旗标**:internal-alpha-browser-proof 用 `--update-visual-baseline`;storybook-visual-proof 用 `--update-baseline --reason "..."`。**别混**。update 跑本身报红是设计,必须干净复跑确认 0 回归。
3. **demo 类≠真控件**:`.tcrn-knowledge-shell__*` 是 storybook-shell-demos 原型的类;真 shell 控件是 `.tcrn-doc-*` 与包组件类。改样式前先在**构建产物** `apps/storybook/storybook-static/*.html` 里 grep 确认真实类名。
4. **测量纪律**:视觉判定用 DOM 测量(`getBoundingClientRect`/`scrollWidth==clientWidth`/computed style),**不要**用肉眼看缩小截图(1440→800 的截图会把模糊中文误读成截断)。浏览器 pane 坐标=CSS 视口空间。无头面板 rAF/合成 hover 不可靠;帧率用「单帧布局耗时」+LoAF 观察器。
5. **隐私门陷阱**:JSX `key=` prop 不能在行首(触发 env-assignment 规则 `(?:KEY)\s*=` 不分大小写)——首属性与标签同行。提交信息与源文件禁含 owner 用户名 URL、邮箱(commit 无 Co-Authored-By trailer,历史基线如此)。
6. **TS 模板字面量**:CSS content 转义 `\2212` 会被吃成八进制——用字面字符。
7. **i18n**:新增 UI 文案走 `apps/storybook/src/build/locales/storybook-content-text.ts` 精确短语映射(5 语言全填);build 期属性(aria-label 等)不会被翻译树处理——避免烤死英文进属性(accordion 不需要 role=region 就是这么来的)。
8. **门证内容不证披露壳**:签名捕获与本地化文本检查前已有 expand-all 逻辑,改 proof 时勿破坏;披露行为有自己的门(disclosureOk)。
9. **heredoc 纪律**:git commit -F - 的 heredoc 单独成步,别与 push/pr 同行串接(会污染提交信息);push 永远单独成步。
10. **AOS 联动**:凡动 `tcrnComponentCss`/Icon 注册表,必须重跑 `cd ../TCRN-AOS && pnpm aos:frontend-shell-proof`(期望 ok=true,1576 检查)与 `pnpm verify:fast`。AOS 无 remote,若需改 AOS,合入其本地 main 即交付。
11. **no-overclaim**:全站禁止出现 `forbiddenPositiveClaims` 短语(product accepted/release ready 等,见 `@tcrn/ui-copy-state`);Stamp 的 release 时刻不用。
12. **每 Epic 一 PR**:分支名 `feat/init6-e<N>-<slug>`;PR 描述含证据、裁决表、验证输出;合并后 main 上独立 verify;**不批量合并**。

## 10. 治理协议(链上记录)

1. 会话开始:`node ~/.tcrn-workflow/trusted-bootstrap.mjs verify-installed-copy --installed-dir "<平台根>/.claude/skills/tcrn-workflow-helper" --provenance ~/.tcrn-workflow/complete-skill-archive.provenance.json --state ~/.tcrn-workflow/state.json` 须返回 `INSTALLED_COPY_VALIDATED`。
2. 工作区:`<平台根>/.tcrn-workspace/TCRN-Design-System/workspace`;Initiative=`TCRN-DS-INIT-006`。
3. 每 Epic 完成:conference(verification 型)+minutes 记录交付与验证输出;Owner 原话立场记 `owner:governance`;执行者事件 actor 记 `agent:opus-4-8`;审议型立场按 persona 公约(`profile:tcrn-*-v1`)署名并首行披露执行形态。
4. **停顿预算**(Owner 常规裁定):执行期按推荐推进,只有三类必停——owner_intent_required 门/对外发布/无裁定支撑的不可逆变更。E1 与 E3 的大面积重标定属「有裁定支撑」(本文档+INIT-006 立项即裁定),不必停。
5. conference position 硬上限 2048 字节;知识库 distill 是策展不是镜像。

## 11. 明确的不做清单

- 不改导航的零圆角/单轴指示线/图标轨(INIT-005 已裁定面)。
- 不动 `tcrnComponentCss` 的品牌 accent 定义与 reduced-motion 语义(v2 comprehension cue,160ms)。
- 不动渐进披露的交互模型(紧凑索引/hash 先展开)。
- 不做视觉重设计——本 INIT 是**统一与收敛**,凡「换个样子」的冲动都出界,遇到真实设计分歧呈报 Owner 裁决。
- TableToolbar 的 AOS 采用、storybook.css 之外的 v1 残债若在施工中发现,登记候选不顺手修(登记处:Epic 收尾 minutes 的 unresolved_issues)。
