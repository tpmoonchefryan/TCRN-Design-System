# 问题清单 · W2-F（SUB-022 → SUB-023）

只记不修。本包局部门：typecheck、ui-react build、全量 build、brand-asset（含母标远端核对）、token-extension 通过；Navigation 单测 28 条中 26 条通过，余下 2 条是 W2-E 留下的搜索框正则（见 #1），品牌相关断言全部通过。集外改动需求另见 `runs/r1/handoff/W2-F.md`。

| # | 类别 | 事实 | 建议 |
| --- | --- | --- | --- |
| 1 | 预期红（他包） | `Navigation.test.tsx` 的「isolates topbar from docs chrome」与「keeps package controls contrast-safe」两条仍红，首个失败断言都是旧搜索框外形（`.tcrn-search-input__control:focus` 的 `box-shadow: none`、包裹层三列 grid），即 W2-E 问题 P1。原第 574–592 行品牌断言已移出 contrast-safe，单列为「brand lockup css follows the G+ brand rules」，独立通过。 | W3-D 按 W2-E P1 改写搜索框断言；本包不动这些行。 |
| 2 | 预期红（集外测试） | 契约 `brandSurfaceDisposition` 按 G+ 规则改写：「TCRN stays in ink at medium weight」，后缀用 brand-suffix token，Einzbern 与 Mana Orchestrate 为衬线全名加 by TCRN。`apps/storybook/src/smoke.test.ts:1432` 断言旧句 `/TCRN stays regular weight/`，会红；同文件 1431、1433–1435 三句仍保留。 | 持有 smoke.test.ts 的包把 1432 改为 `/TCRN stays in ink at medium weight/`。 |
| 3 | 预期红（集外门） | TMS 中文标语按 D5 与 STORY-127 改为「艺人管理系统」、韩文改为「탤런트 관리 시스템」；设计系统标语由「Component Library / 组件库」改为「Design System / 设计系统」。`scripts/storybook-smoke.mjs:1242` 期望 TMS zh「人才管理系统」；`storybook-smoke.mjs:3103/3353` 与 `scripts/internal-alpha-browser-proof.mjs:1318` 用「组件库」判断文档壳品牌标语已本地化，均会红。 | 持有这两个门的包改期望值；文档壳标语判据改为「设计系统」。 |
| 4 | 集外缺口（文档翻译） | 文档站按默认语言烘焙标语再按精确字符串替换。`apps/storybook/src/build/locales/storybook-content-text.ts:743–747` 只有旧三条（Component Library、AI Operation System、Talent Management System，其中 TMS zh 为旧值）。新英文标语「Design System」（文档壳品牌即渲染此句）、「Project memory engine」「Project memory assistant」缺条目；「Design System」可能已是别处的键，须核对是否同义。 | 文档内容包补齐五语条目、更新 TMS 条目，删去不再渲染的「Component Library」条目前先查引用。 |
| 5 | 集外影响（文档壳） | `page-template.tsx` 的 ShellBrandLockup 带 `productId="design-system"`，现在内联绘制设计系统产品标（`svg.tcrn-brand-mark[data-product-mark]`），不再是母标 img。`scripts/shell-parity-proof.mjs:811` 只把 `img` 认作已登记品牌资产，svg 上的 `aria-label` 可能被记为字面文案。风格指南品牌页的 TcrnBrandMark 与无 productId 锁定块仍是母标 img，`storybook-smoke.mjs:937–938` 不受影响。 | 建议保留产品标（STORY-127 要求有 productId 即用产品标），shell-parity 的登记资产规则加上 `svg[data-product-mark]`。 |
| 6 | 集外影响（几何门） | 收起态锁定块文案改为 `display: none`（GWT4、C16）。`scripts/geometry-proof.mjs:441` 的品牌变异只改 inline-size 与 visibility，不改 display，收起变体里文案不会重新出现，该变异的「破坏后应判红」可能不再触发。产品壳侧栏标统一为 22（含 AOS 视觉实例），展开与收起同尺寸。 | 几何门持有包把变异改为同时设 `display: revert`，或改测侧栏标尺寸恒为 22。 |
| 7 | 设计数据冲突 | `matrices.json` 品牌板 `suffix-ink` 格在 B1 板上落在 AOS 锁定块的后缀上，期望墨色；P30 与本包保持 AOS 实色后缀（`--tcrn-brand-accent-aos`，侧栏内为 brand-primary）。 | brand-matrix story 的持有包把该格放在无 productId 锁定块的后缀上（G+ 下为墨色），或请画板改格位；不改 AOS。 |
| 8 | 待 Owner（P15） | 后缀色按画板两主题同值：TMS #2c63c8 于夜间纸 #191916 为 3.13，Design System #6577f3 于白 3.83。字标豁免尚未在对比度门登记（该门不在本包）。 | 对比度门持有包逐条登记字标豁免并引用 D2；夜间是否换亮色由 Owner 定，定了在 tokens.json 加 dark 值重生成。 |
| 9 | 待 Owner（P1） | 127-GWT4 的「侧栏收起到 52px」未做：ProductShell 收起宽仍为 92（base.css.ts）。本包只做了 CSS 部分：文案 display:none、标 22 不随收起缩放、去掉标的尺寸与滤镜过渡。 | 随 P1 裁定处置。 |
| 10 | 生成器缺口 | 生成物只导出 viewBox、标语、两种 body，不含 marks.json 的 `tile`（圆角 11、内缩 `translate(7.2 7.2) scale(0.7)`）与 `monoInk`。Navigation.tsx 把贴片几何与深底白色写成常量；brand-asset 门对照 marks.json 核对贴片，单色墨从 marks.json 读。 | 下次改契约时让 `contract-generate.mjs` 输出 `tcrnProductMarkTile` 与 `tcrnProductMarkMonoInk`，组件改读生成物。 |
| 11 | 冻结文件残留 | `styles/base.css.ts` 第 14、16–21、24、26–31 行仍定义已停用的 `--tcrn-color-brand-secondary-readable` 与 `--tcrn-brand-accent-tms|workflow|design-system-1..4`（亮暗两块）。token-extension 已把它们移入停用表：容许定义、读取即红；定义删掉后在摘要 `retiredNoLongerDefined` 列出，届时删表项。 | W3-D 删除这些定义（SUB-018/021 的 base 处置），再删停用表项。 |
| 12 | 接口变化 | 注册项的 `lineOneSuffix`、`suffixClassName` 对衬线产品为 `null`；契约 JSON 同样发布 `null`。注册表新增 `markId`、`wordmark`、`byline` 三个字段。 | 消费方拼接后缀时判空；契约读者按 `wordmark` 区分两种字标。 |
| 13 | 画板分歧 | B1 板的组件规格（字标 TCRN 500 加后缀 600，ProductLogo 标 38，锁定块 28，侧栏 22）与 B2 板及 marks.json（sans 整词 600，锁定块示意标 44）不一致。本包组件尺寸与字重按 B1 差异表，衬线字族与 by TCRN 按 B2 与 marks.json。 | Owner 目视时一并确认；如以 B2 为准，只改 brand.css.ts 的层级变量与字重。 |
| 14 | 过程 | 计算 digest 时一条命令里用了 `cd /`（未弹框），违反命令不 cd 的约束；其余命令均为绝对路径。 | 无需处置，仅留痕。 |
