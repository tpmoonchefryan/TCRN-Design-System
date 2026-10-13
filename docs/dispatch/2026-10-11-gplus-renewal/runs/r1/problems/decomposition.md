# INIT-015 R1 拆分 · 问题清单

每条：现象、证据、建议处置。标「待 Owner」的属于判据、范围或预算，只有 Owner 能定；其余按建议先做，收口时回显。行号以集成工作树 b321d10 为准。

## 待 Owner

**P1 构图一壳层几何与 ProductShell 不在第一批（待 Owner）。**
现象：STORY-129-GWT3 要求样板 story 侧栏图标左 16、文字 48、纸离边 12，构图一侧栏 220、顶栏 52；STORY-127-GWT4 要求侧栏收起到 52px。包内 ProductShell 现为侧栏 280、收起 92；禁用清单禁止「通用件拼壳」，INIT 不授权改第二批以后的家族。
证据：`packages/ui-react/src/components/Navigation/Navigation.tsx` 第 2502–2516 行（`--tcrn-product-shell-sidebar-width: 280px` / `92px`）；STORY-129 GWT3；STORY-127 GWT4；INIT「不授权」段；MIN-20261011 D1。
建议：请 Owner 裁定构图一的壳层几何是否算 G+ 底盘（D1）而纳入 INIT-015。裁定前 SUB-031 用 ProductShell 并通过已登记的局部变量 `--tcrn-product-shell-sidebar-width` 设 220，其余差值写进 storybook-map（STORY-130 允许「逐条有裁定引用」），129-GWT3 与 127-GWT4 的 52px 部分记为待裁。

**P2 C1–C17 条款正本画板未入仓（待 Owner 或主线程补件）。**
现象：canvas.json 列有 `V2-Rejections.dc.html`（打回根因总账 · 契约条款草案）与 `V2-Families.dc.html`，boards/ 下没有这两个文件。STORY-132 要求条款编号与画布一致、条款文案进 docs/contract；仓内只能从 Story 正文、START 硬线与板内零星引用（C1、C5、C7、C8、C9、C16）拼出部分条款。
证据：`docs/design/gplus-2026-10/boards/canvas.json`；`ls docs/design/gplus-2026-10/boards`。
建议：在 W1-E 定稿前把画布版本 33 的 V2-Rejections 板复制进 boards/。未补时 SUB-036 只写已知条款，缺的编号（C3、C4、C10、C12、C14、C15、C17）标「画板未入仓」。

**P9 中文子集的「常用 3500 字」没有仓内可核来源（待 Owner）。**
现象：STORY-121 假设按包内五语字符串加常用 3500 字取中文子集；本机没有 pyftsubset/fontTools，宿主安装是停点；仓内也没有 3500 字表。
证据：`python3 -c "import fontTools"` 报 ModuleNotFoundError；拆分文件第 6 节。
建议：用上游已切好的 unicode-range 分片，按产品用字选分片（分片本身会多带一批常用字），不加 3500 字表。Owner 若要 3500 字覆盖，给定字表来源后由 SUB-004 加选分片。

**P15 夜间品牌后缀色没有裁定（待 Owner）。**
现象：Story 只定浅色后缀 TMS #2c63c8、Design System #6577f3；产品标板夜间仍用同一深色，#2c63c8 落在 #191916 上对比很低。
证据：`docs/design/gplus-2026-10/tools/build-logos2.mjs` pane() 里 `wm()` 用 `PAL[k].deep`；B1-Brand 板 F 段「#6577f3 于白 3.8，字标按 logotype 豁免 4.5」。
建议：先按画板（两主题同色）实现，字标豁免在对比度门里逐条登记并引用 D2；请 Owner 决定夜间是否改用亮色（#7aa0f5 等）。

**P18 视觉签名基线要整体换，文档壳视觉标准被标为 Owner 声明（待 Owner 知悉）。**
现象：G+ 改动每张截图，internal-alpha 浏览器证明要用 `--update-visual-baseline <selection.json>` 逐条以 accepted-layout-change 接受；AI 契约把文档壳视觉标准分类为 `owner_declared_original_storybook_doc_shell_standard`。
证据：`scripts/internal-alpha-browser-proof.mjs` 第 604–607、759–773 行；`scripts/lib/visual-signature.mjs` validateBaselineSelection。
建议：SUB-046 按 INIT 与 D1/D6 写选择文件（每条带理由与证据）完成机器基线；收口时向 Owner 列明这是视觉标准的整体替换，目视验收另行。

**P24 story 高度与类目数量上限（待 Owner 知悉）。**
现象：story-budget 限单个 story 在 1440×900 下高 2000px、每类目 8 个 story；矩阵（尤其动作 116 格、表单 42 格）与样板可能超高。预算与上限的改动须有授权。
证据：`scripts/lib/story-budget.mjs` 第 46、135 行。
建议：新建 G+ 类目避开 8 个上限；矩阵按画板排版尽量压在 2000px 内；确需超高的条目按现有宽限表逐条登记并写依据（INIT 要求矩阵与画板 1:1），收口时列给 Owner。

## scope 解释（按建议先做）

**P3 brand-asset 门扩为八个文件与远端核对。**
现象：现门联网下载母标发布 URL 比对 digest；新产品标未发布，发布属 Owner 停点。
证据：`scripts/brand-asset-source-proof.mjs` 第 44–69 行；STORY-127「digest 对象扩为八个文件」。
建议：SUB-023 对八个文件做本地 sha256 登记与比对，母标远端核对原样保留。verify 仍需联网（基线已通过）。

**P4 契约静态门的范围。**
现象：C2/C6/C7/C11 若扫整份 tcrnComponentCss 与全部 story，会被后续家族的旧写法与 LockHint 默认图标「🔒」判红，而 INIT 不授权改这些家族。
证据：`packages/ui-react/src/components/Form/Form.tsx` 第 1070 行 LockHint 默认 icon；`apps/storybook/src/contract-stories/story-content.tsx` 第 1781 行。
建议：SUB-036/037 先限第一批家族根类，后续家族按条目登记进 `docs/contract/exemptions.json`，引用 INIT 不授权段；不加无条件 skip。

**P5 矩阵 story 的粒度。**
现象：STORY-129 写「23 件各有矩阵 story」，格数却按板给（44/28/10/116/42）；STORY-130 用例是 typography--matrix。
建议：每板一个矩阵 story（5 个），每件组件在其中有带标签的分节，测试断言 23 件齐全。

**P6 对比度容差。**
现象：INIT 写「对比度差 0」，STORY-131 写「差 ≤ 0.05」。
建议：数据层（SUB-011，契约算出的期望与画板 data-expect）按两位小数要求差 0；DOM 层（SUB-035）用 0.05 作门阈值并在报告里给实际差值。

**P7 仓内没有 CI 工作流。**
现象：STORY-133 假设 GitHub Actions 已有工作流，`.github/workflows` 不存在。
建议：SUB-039 新建 `.github/workflows/verify.yml`（corepack pnpm 10.12.1、Playwright chromium、pnpm verify），只写配置，推送仍是停点；verify 里 brand-asset 门需联网，记在工作流注释里。

**P8 DS 仓没有 proof-budget。**
现象：STORY-121 实施说明「字体文件体积记入 proof-budget 前先报数」，DS 仓无此机制（引擎仓才有）。
建议：SUB-004 在 manifest 与交回里报字节数，pack:smoke 回执带包体积；不新建预算。

**P10 「构建时打印弃用提示」。**
现象：STORY-120-GWT4 要消费方构建时打印弃用提示；DS 无法挂进消费方构建。
建议：SUB-001 导出旧名→新名表，SUB-003 提供通知脚本（DS 自己的 storybook 构建调用，消费方可直接调用）并用消费方夹具测试。

**P11 C5 同构口径。**
现象：现 tokens.css 的 `:root` 有约 131 个变量，dark 块约 40 个；GWT1 要两块属性名集合相同。
建议：主题相关 token 进 `:root` 主题块与 dark 块，两块同集；主题无关 token 单列一个 `:root` 块。tokens-sync、STORY-120 单测与 C5 门按同一口径。

**P12 焦点环改 box-shadow 后的强制色模式。**
现象：G+ 焦点环是 box-shadow，强制色模式下不绘制。
建议：SUB-016/019/020 保留透明 outline 作 forced-colors 回退（沿用 base 段已有的 forced-colors 处理）。

**P13 mono SVG 的填色。**
现象：logos2 的 *-mono.svg 写死 #16150f，STORY-127 要求 mono 用 currentColor，又要求 SVG 与 logos2 逐字节一致。
建议：八个文件（digest 对象）保持 #16150f；组件的 mono 模式渲染时用 currentColor，不做字节比对。

**P14 B1-Brand 板的旧注册项与旧标语。**
现象：build-brand.mjs 的 REG 仍是 workflow 与「人才管理系统」，矩阵基于母标。
证据：`docs/design/gplus-2026-10/tools/build-brand.mjs` 第 13–18 行。
建议：标语与注册项以 STORY-127 与 D5 为准；品牌矩阵 10 格只量字标与标语墨色，不受影响。

**P16 STORY-134 用例过时。** 「把 iconName="users" 换成名册名」：users 已在 37 件名册内（D2）。迁移说明按实际 breaking 清单写，不需要这条。

**P17 STORY-131-GWT1 的 `.tcrn-table` 不存在。** 包内只有 `.tcrn-table-shell*` 与 RecordTable。SUB-035 先用 table-record-index-spec 的表格行做变异，样板 story 合并后纳入。

**P22 按钮加载文案。** STORY-125 写「文字换『保存中』」，包内写死中文违反五语规则。建议加载文案由调用方给，矩阵 story 按 story 语言传入。

**P23 STORY-128-GWT3 的覆盖面。** 取样比对只对第一批 23 件可做（后续家族没有矩阵）。

**P28 OFL 放两处。** STORY-121 先说「放置 woff2 子集与 OFL 到 packages/ui-tokens/fonts」，后说「licenses/ 目录放五份 OFL」。建议 OFL 放 `packages/ui-tokens/licenses/`，fonts/ 只放字体与 manifest、fonts.css。

**P29 Field 属第五批。** STORY-126 明确要求去掉 `.tcrn-field:focus-within` 整块洗底（Navigation.tsx 第 4939、5588 行），属 Story 授权内的最小改动；Field 其余外观不动。

**P30 aos 注册项。** D5 说 AOS 不在本阶段；「渐变文字类全部删除」只影响 design-system 的渐变后缀，aos 的实色后缀保持。

## 风险（已在拆分里处置）

**P19 既有浏览器门写死旧视觉。** storybook-smoke 写死按钮 minHeight 36/38、3px outline、Inter、选中洗底 rgba(28,29,33,.06)、搜索框圆角（`scripts/storybook-smoke.mjs` 第 191–268 行），internal-alpha 写死外观期望与类目数。已排 SUB-041/042 重定基线；不排就会批末成片红。

**P20 tcrnComponentCss 是单个 3,740 行模板。** 五家族与生成段都要改它，不拆就只能串行。SUB-010 先拆段，判据是规范化规则序列前后相同；风险在跨家族选择器列表与混合 @media 的拆分，按约定原位拆成相邻规则，page-template.tsx 依赖的三处注释标记不动。

**P21 新图标名的跨包依赖。** Clipboard 的 copy 与 DatePicker 的 calendar 要等 37 件名册合并，已移到 W3-D（SUB-018、SUB-021），保证 W2 各包能各自通过类型检查。

**P26 画板重生成不一定逐字节。** 画布上可能有生成后的手改。SUB-008 若重生成有差异，记差异、不覆盖画板。

**P27 token 与家族同波。** 与 START「大致 039 → 040」的差别见拆分文件第 2 节：家族只引用契约定死的变量名，同波并行少一波；主线程不接受时把 W2-A 提前成独立一波，文件集不变。

**P31 GWT 依赖真实浏览器。** ButtonGroup 焦点环不被裁切（125-GWT4）、DatePicker 点右侧 30px 打开系统日历（126-GWT4）、Highlight 宽度相等（123-GWT2）、16px 描边 1.25（124-GWT1）在 jsdom 里量不出来。前三项由 SUB-035 的测量或命中测试判（无头浏览器不弹系统日历，改判点击落点在原生指示器上）；描边由矩阵 story 的计算样式判。

**P32 公开命名与内部词表。** public-naming-proof 禁止 story id/标题含 aos/tms/workflow；internal-vocabulary-scan 禁止渲染文本含工单键与 Codex。已写进拆分文件第 1 节约定 7、12。

## 基线

b321d10 全量 verify 已结束：VERIFY_EXIT=0（日志 `baseline-verify.log` 末尾，2026-10-10T21:04:50Z），无既存红项。
