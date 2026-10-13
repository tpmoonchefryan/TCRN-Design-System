# INIT-015 R2 · 批末验收分片 A（STORY-120、121、122、134）

各节行号：§1 一览 第 18 行；§2 逐 Story 第 29 行（2.1 第 31 行，2.2 第 54 行，2.3 第 73 行，2.4 第 97 行）；§3 返工清单 第 128 行（A2-1 第 132 行，A2-2 第 141 行，A2-3 第 157 行）；§4 只有 Owner 能定的事项 第 170 行；§5 实施口径判定 第 195 行；§6 证据盲区 第 227 行。

被验对象：集成分支 `claude/init015-gplus-renewal`，HEAD 6630655。R2 末次 verify 跑在 e643d74（`runs/r2/verify/steps.md`）。`git diff e643d74 HEAD` 只动 `docs/dispatch/` 下 6 个调度文件，排除该目录后为空，被验代码与 verify 所见相同。工作树里的各包 dist 与 storybook-static 生成于 15:11，晚于 e643d74 的提交时间 15:10:57，就是 verify 那次构建。

覆盖的包与单：P1（SUB-048、SUB-049、SUB-047）、P2（SUB-052）、P3（SUB-053）、P5（SUB-050）、P11（SUB-051、SUB-054、SUB-087）、P12（SUB-046）。各包里属于其他 Story 的单不在本片判定。

方法：只读。不改代码、门、回执与链，不重跑门，不构建，不启动浏览器，不运行引擎。证据记作 `NN.MM log:行号`，指会话 scratch `r2-verify/` 的逐段日志；文件证据记作 `路径:行号`。另做了四项只读探查，脚本放在会话 scratch，不入仓：

1. tokens.css 三块的属性集比对与字族栈读取。
2. dist `tcrnComponentCss` 状态规则的颜色字面量扫描。用仓内 `scripts/lib/css-rules.mjs` 的 `parseCss` 与 `colourLiterals`。状态条件沿用 R1 口径：状态伪类、ARIA 状态属性、`data-tcrn-preview-state`、`[readonly]`、`[disabled]`，`:not()` 与 `:has()` 里的条件不算。另按宽口径再扫一遍：任意 `data-*` 属性都算状态条件，`data-tcrn-theme` 除外。
3. 阴影逐层解析。读 dist `tcrnComponentCss` 与 `packages/ui-tokens/src/tokens.css`，用自写的分层器，与门里的 `shadowLayers` 互相独立，并单列无法解析的层。
4. CDN 主机名字面搜索与回执比对。三个包按各自 package.json 的 `files` 字段取打包文件集，加上三个 dist 与 storybook-static，带正向对照。回执比对是把入仓版本与 `r2-verify/receipts-dirty/` 的存档逐字段比较。

结论用语：满足 / 不满足 / 部分 / 阻塞于 Owner。

## 1 一览

| Story | 结论 | 未满足或部分的 GWT | 返工项数 |
| --- | --- | --- | --- |
| STORY-120 色彩轮廓 token 与对比度门 | 不通过：GWT1–4 满足；本片已无根因 | GWT5 不满足：余红 6 步，O-1、O-2 阻塞其中四步，另三处不受 Owner 阻塞，归他片 | 0 |
| STORY-121 字体与形状动效 token、字体自托管 | 通过 | 无 | 0 |
| STORY-122 契约数据与生成脚本 | 通过：GWT1–4 满足；目的锚余 4 条字面值阻塞于 Owner（O-6，不阻断本轮） | 无 | 1（A2-2，文档回写） |
| STORY-134 4.0.0 候选 | 不通过：GWT1–3 满足；SUB-046 的基线写入阻塞于 Owner（O-1、O-2，另需他片修 RM16 ④）；前置条件未满足 | 无 | 2（A2-1、A2-3） |

去重后返工 3 项，全部为经济档，主力档 0 项。R1 的十项返工里，A-1、A-2、A-3、A-4、A-6、A-8、A-9、A-10 已关闭；A-5 部分关闭，余下 4 条字面值归 O-6；A-7（SUB-046）已执行，但基线写入被门拒绝。新发现里有 3 条与既有 Owner 事项相关，见第 4 节。不可接受的口径 0 条。

## 2 逐 Story

### 2.1 STORY-120（SUB-047 · P1）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 `:root` 与 dark 两块属性名集合相同（C5） | 满足（R2 改了选择器，已重新核对） | 浅色主题块的选择器现为 `:root, [data-tcrn-theme="light"]`（tokens.css:2，块标记在 :3）。主题无关块是 `:root`（:90–91），夜间块在 :211–212。探查 1：两个带 theme 标记的块各有 85 个属性，块内无重名，双向差集都为空。主题无关块有 118 个属性，不参与比较，三块口径与 R1 相同。门：06.02:2 报「C5 theme blocks declare the same 85 properties」；contract:static 的 C5 为 0 发现（13 log:90），且有「选择器列表即浅色侧」的用例（13 log:36）。 |
| 2 ink、ink-2、ink-3 于 panel 与 bg ≥ 4.5，line-ctl ≥ 3 | 满足（R2 无回退） | 浅色 ink-3 为 5.64 与 4.86（06.05:8–9），夜间为 4.59 与 4.89（:35–36）。line-ctl 浅色 3.16 与 3.06（:21–22），夜间 3.34 与 3.33（:48–49）。:60–61 报最低文字比 4.59、最低边比 3.06，并给出 ALL PAIRS PASS。各值与 R1 相同。 |
| 3 ink-3 改回 #8a8c93 判红并点名 | 沿用 R1 满足，R2 无回退 | 06.04:3–7：点名 ink-3 on panel 3.36 与 ink-3 on bg 2.89，经门进程退出 1。 |
| 4 只引用旧名的消费方仍解析到新值并打印弃用提示 | 沿用 R1 满足，R2 无回退 | 06.06:1–3：逐条打印旧名到新名，退出 0。06.06:6–10：两种主题下都解析到新值。storybook 构建打印 31 个旧名、282 处（03 log:87）。 |
| 5 `pnpm verify` EXIT=0 | 不满足 | steps.md：30 步中红 6 步（R1 为 11 步）。R1 记在本片的两处根因都已消除：第 6 步 12 段全部退出 0（06.01–06.12）；第 18 步 contrast 为 pass、worst 0（18 log:6753–6755），第 19 步 contrast 为 pass（19 log:4340）。余红的归属如下。受 O-1 阻塞：第 11 步（C-21 文档壳），第 18、19 步（样板 rail 偏 33，18 log:6741–6743，19 log:4337）。受 O-2 与 C-21/O-1 阻塞：第 30 步的 axe 12 处与手机视口锚点遮挡。不受 Owner 阻塞的三处：第 10 步 searchOverlay（SUB-080，RM15）；第 17 步三组冒烟是同一根因 `searchInput:focus-outline-width:3px`（17 log:19–23、4138–4146、12358–12368，是门的期望值过时，RM15 #3）；第 30 步 zh-CN 新漏译 3 条（RM16 ④）。这三处都属他片 Story，本片不出返工。第 30 步的视觉签名回归 155、新增 30 来自基线未写入，见 2.4。 |

SUB-047 判据，以实测为准：

- 生成器写出选择器列表：达成。gplus-tokens.generated.ts:22 为 `light: ":root, [data-tcrn-theme=\"light\"]"`。派生逻辑在 contract-generate.mjs:308–310，夜间选择器不是 `[属性="dark"]` 形式时报错。
- index.ts 按列表输出主题块，保留 theme 标记，dark 块排在后面；解析与比较接受列表：达成。见 tokens.css:2–3 与 :211–212；index.ts:631–633 按集合比较；单测 05 log:12。
- tokens-sync 接受列表：达成（06.02:2）。
- checkC5 把列表当浅色侧，并补正反用例：达成。见 13 log:36 与 :90。4a59144 对 contract-static-proof.mjs 只加了 5 行注释，判定逻辑未改；P1 实测原逻辑已正确，口径判定见第 5 节。
- 浏览器用例：达成。06.06:11「a [data-tcrn-theme="light"] block inside a dark ancestor resolves … to the light values」。
- 取单块选择器列表，不复制浅色块：达成。探查 1 只读到三块。
- 复核第 18–20 步：达成。五个矩阵的浅色格不再偏，第 18、19 步 contrast 为 pass（见 GWT5）；第 20 步退出 0。
- ink-3 承载面复核：达成。problems/P1.md 第 3 节的结论是四类承载面上没有非豁免的 ink-3 落点。附带观察（文档导航计数落在 acc-bg 洗底上，4.35:1）见第 4 节 N-1。

观察：Story 正文的「3.44」按画板算法应为 3.36 与 2.89（06.04:4–5），按判断 §3.2 只注解、不改正文。四条字标豁免与 R1 相同（06.05:27–28、52–53），夜间 TMS 两条仍标注「待 Owner」（O-3）。本 Story 没有硬线违例。

### 2.2 STORY-121（SUB-048、SUB-049 · P1；SUB-050 · P5；SUB-051 · P11）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 构建产物搜索 googleapis 为 0 | 满足 | 06.08:8：321 个构建文件里没有 googleapis 与 gstatic。21:8–9：storybook-static 的 49 个文本文件 0 处，37 页共 190 次请求，0 次指向这两个主机。探查 4：三个包的打包文件集（ui-tokens 77 个、ui-react 254 个、ui-copy-state 10 个，按 `files` 字段取，含 FONT-LICENSES.md 与 README.md），以及三个 dist 加 storybook-static 共 375 个文件，对 googleapis、gstatic、fonts.google 的搜索都是 0 处；正向对照分别命中 11、72、5、42 个文件。R1 的 A-9 已改：FONT-LICENSES.md:5–7 不再写主机名。 |
| 2 ui、heading、mono 三族并带 Noto 回退 | 满足（R1 为部分） | tokens.css:93 的 ui 为 `"Hanken Grotesk","Noto Sans SC",…`；:121 的 heading 为 `"Source Serif 4","Noto Serif SC",…`；:94 的 mono 为 `"IBM Plex Mono","Noto Sans SC",ui-monospace,Menlo,monospace`；:92 的 serif 与 heading 相同。门：06.08:10 报四个字族 token 都保留 Noto 回退；fonts-proof.mjs:370 给 mono 加了 `fallback: "ui-zh-fallback"`。 |
| 3 任一 woff2 改一个字节，fonts-proof 判红 | 满足（R2 无回退） | 06.07:6。门本体 06.08:2：54 个文件的 digest 与字节数都与清单相符。R1 批末没执行到的门本体，这次已执行。 |
| 4 包内任一 box-shadow 经 MAX_SHADOW_BLUR_PX 检查，无超过 3px | 满足（R1 为部分） | 检查面已扩到文档层三个文件、`componentCssModules(root)` 的全部段与 tokens.css（shell-fidelity-proof.mjs:464–471），并按层解析（:227–240），`inset 0 0 0 5px` 读作扩展半径。自检变异在 :575–588：注入模糊云判红，pair edge 列表里跟在 var() 层后的模糊云也判红，只有扩展的内环不判红。门：06.10:6 softCloudShadows 为 0，:26 no drift；这一段在 tokens:proof 里确实执行了。探查 3：dist `tcrnComponentCss` 有 164 条阴影类声明、127 个字面层，最大模糊 1；tokens.css 有 22 条、22 层，最大 3；超过 3 的为 0，无法解析的层为 0。第 18 步 shadowBlur 为 pass、worst 3（18 log:6737–6739）。 |
| 5 中文标题「季度复盘」回退到 Noto Serif SC | 满足（R2 无回退） | 21:21–23：heading 两档都由 Noto Serif SC web font 绘制，document.fonts.check 为真。21:26–28：屏蔽 fonts/ 后回落到系统 Songti SC，说明对照有效。R2 另加了 mono 探针，21:24–25 由 Noto Sans SC web font 绘制。日志里字体名显示为 Thin 与 ExtraLight，那是可变字体默认实例的名字：fonts.css 对 Noto 的声明是 `font-weight: 100 900`。 |

Subtask 判据：

- SUB-048：达成。mono 值（tokens.css:94）来自 contract/tokens.json，依次经 contract-generate 与 tokens-sync 写入。`TOKEN_FAMILY_STACKS` 给 mono 加了中文回退（fonts-proof.mjs:370）。contract:proof 的 generated-sources 为绿（07:24）。O-10 的注释已改（contract/tokens.json:49），值仍是 `var(--bg)`。可选的 mono 探针已加，结果为绿（21:24–25）。
- SUB-049：达成。06.07 共 16 条全过（:17–20）。夹具用的是契约里的四个字族（:2）；三类变异各自判红（:3–5）；tokens:proof 12 段逐段退出 0（steps.md 06.01–06.12）。
- SUB-050：达成，见 GWT4。953ca93 只改了 shell-fidelity-proof.mjs，没有新增测试文件，也没改 package.json。
- SUB-051：达成。FONT-LICENSES.md:5–7 改成不带主机名的说法，意思不变（外部字体 CDN 在中国大陆不可靠），其余正文未动。包与打包文件集里 0 处（探查 4）。

硬线核对：阴影 ≤ 3，满足；字体文件逐字节未改（21:5 copies）；没有 data: URI（06.08:4）。本 Story 没有硬线违例。体积只报数：54 个 woff2 共 3,410,312 B（06.08:2），ui-tokens tarball 3,508,810 B（16 log:11）。

### 2.3 STORY-122（SUB-052 · P2；SUB-053 · P3；SUB-054 · P11）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 pairs.json 改一个 ink token，不重生成就判红 | 满足（R2 无回退） | 07:9。 |
| 2 重生成后绿，且 tcrnComponentCss 里没有含颜色字面量的状态规则 | 满足（R1 为部分） | 绿：07:10 与 07:23–30。package-css 现在读整张表的状态规则，共 95 条，其中 39 条在 pairs.json 目标基类上，都没有颜色字面量（07:26）；只含 transparent 的 outline 放行 6 处（07:27）；往非目标状态规则注入字面量的变异判红（07:8）。R1 的缺口已修：base.css.ts:63–69 的 locale 触发器 hover 与 `[aria-expanded="true"]` 改用 line-ctl、hover、ink 与 shadow-s1。探查 2（R1 口径）：dist 768 条规则里状态规则 94 条，颜色字面量 0 处。按宽口径（任意 data-* 属性）另有 63 条，其中 2 条含字面量：`.tcrn-product-shell[data-theme-switching="true"]::after` 的 `color-mix(… transparent 20%)`，以及收起侧栏里无图标导航项 `::before` 的 `currentColor`。这与 P3 问题 P3 的记录一致。两条都不在 clauses.md C2 的状态定义内，属 Navigation 家族（§3.3）；口径判可接受，见第 5 节。 |
| 3 icons.json 的 37 个名字与 tcrnIconNames 相同 | 沿用 R1 满足，R2 无回退 | 07:12、07:28。 |
| 4 marks.json 生成的 SVG 与 logos2 八个文件逐字节一致 | 沿用 R1 满足，R2 无回退 | 07:13、07:29；brand-asset:proof 为 ok（14 log:7）。 |

目的锚「单一真值」与硬线「几何逐值来自 token」：

- 字体刻度已经进了契约。typography.json 新增 `tokens` 共 29 条：family-heading（引用 serif）、10 个 size、10 个 line、5 个 weight、tracking-caps、tracking-stamp、numeric-tabular。判据点名的八个名字都在其中。它们生成进 gplus-tokens.generated.ts 的 `tcrnGplusTypeTokens`；index.ts 有 32 处改为 `typeValue(…)`；单测 05 log:15 为「no scale value is written by hand」。
- typography.scale.ts 里有 47 处 `var(--tcrn-type-*)`，字重全部引用 token，numeral 的 `font-variant-numeric` 引用 numeric-tabular。余 4 条字面值：numeral-inline 的 `font-size:16px`，numeral-large 的 `font-size:44px` 与 `line-height:48px`，mono 的 `font-size:11.5px`。29 条 token 里确实没有 16px、44px、11.5px 的字号，也没有 48px 的行高（16px 只作为 line-caption 与 line-meta 的行高），P2 的说法属实。按 O-6「未答复时：不新增 token」及其建议「不阻断本轮」处理，不出返工（RM8，见第 4 节）。
- 其余字距（-.01em、.06em 等）仍写字面值。判据只点名 tracking-caps，不算缺口。
- tokens.css 与 storybook.css 字节不变：`git diff 286d452 7213a27` 对这两个文件为空。

Subtask 判据：

- SUB-052：部分达成，唯一缺口是上面 4 条字面值，阻塞于 Owner（O-6）。其余各项达成：07:24 的 generated-sources 为绿，7 个生成物带契约 sha，且与新生成的结果相同。
- SUB-053：达成。门改为经 contract-static 的 `selectorFacts` 判定状态规则（contract-proof.mjs:48、:202–203、:381），测试见 07:7–8。
- SUB-054：达成。脚本已用 `git rm` 删除（ls-files 为 0）。全仓只剩历史复核记录里的两行（docs/reports/init-029-component-loop/evidence/STORY-254-component-return.md:70、:72）。

文档漂移不影响 GWT，见 A2-2。docs/contract/README.md 第 47 行对 package-css 的说明仍是只查目标基类（RM2）。G+ 契约 README 没写 typography.json 的刻度 token、链接对表和 pairs.json 的 rf（RM9 ②）。inputs.pairs.ts 的段注释少了 rf（RM9 ③）。契约 tokens.json 的 `themes.light.selector` 仍是 `:root`，生成物却是列表，派生规则只写在生成器里（RM5 ①）。

### 2.4 STORY-134（SUB-087 · P11；SUB-046 · P12）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 `pnpm pack:smoke` 通过 | 满足 | 16 log:5–27：ok 为 true，三个包都打出 4.0.0 的 tarball。三个 sha256 与 P12 交回第 5 节逐字相同（566ed5e6…、9130b42e…、178fe6b4…），两次打包结果一致。 |
| 2 迁移说明对照 breaking 清单，每条有迁移步骤 | 满足（R2 改了说明，已重新核对） | M1–M17 的结构没变（docs/migration-4.0.md:92–416）。R2 新增的行为变化都写了 Do：mono 回退在 M1（:100–103）；浅色块选择器在 M2（:131–133，Do 第 4 条在 :152）；刻度生成方式与 4 条字面值在 M3（:179–185）；quiet 链接须与 `tcrn-link` 同用在 M10（:297–304）；禁用原因 title 在 M12（:327–333）；只读获焦 rf 与错误态在 M14（:358–369）；主题钮在 M15（:385–389）。 |
| 3 目视验收清单对照画布板数，每板一节 | 满足（R2 改了清单，已重新核对） | owner-acceptance.md 仍为 10 节（:34–177），顺序与 boards/canvas.json 的 order 10 块相同，该文件自 308f8f2 以来没改过。R2 新增的「按建议先做的项」一节（:194–210）在 10 节之外，不影响每板一节。文首写明目视由 Owner 本人做，没有任何一项已判为通过（:3）。 |

SUB-087（经济档）判据：

- CHANGELOG 4.0.0 段：达成。R1 指出的第 17–19 行已改为按来源分述（CHANGELOG.md:17–26）：tokens.json 提供哪些值，typography.json 提供 29 条刻度，契约外的旧名保留手写值或别名。这与 A-5 指出的不符点对题。浅色块选择器（:30–36）、刻度的生成方式与 4 条待 Owner 的字面值（:39–45）、mono 回退（:65–69）都已写入。R2 的可见变化也都在：链接对表（:88–90）、禁用原因 title（:104）、主题钮（:110）、只读获焦（:122–123）、Field 错误态（:124–125）、快捷键 ink-2 与 MultiSelect（:127）、原型退役（:158）、SUB-080 未解决（:161）。
- 迁移说明 M1、M2、M3 与受影响各节：达成，见 GWT2。
- ui-tokens README 的三块结构：达成。见 README.md:41–55，浅色容器的行为在 :12–14。
- owner-acceptance：达成。fonts:proof 现状在 :32，中性 wash 的知悉在 :230，§3.4 的 11 项各一行在 :200–210。
- 只写已落地事实，不写发布或验收结论：达成。四份文档的越界措辞扫描为 0。四个停点表（:232–241）与实际一致：`git tag -l 'v4*'` 为空，分支没有上游。版本号未动；scaffold:proof 三段都是 ok，其中 changelog-release-sections 的待发布段为 4.0.0、findings 为空（29 log:212、:239–242），version-surface 的 7 处读回都是 4.0.0（29 log:245–280）。
- 措辞细节，不出返工：「29 type scale steps」把 family-heading 这条引用也算进了 29 条；「line heights carry px units」与 line-control 的 1.2 不符，这句 R1 时就有。

SUB-046（经济档）判据：部分达成。

- 已做到的部分：ee68f13 执行了一次，时间在 SUB-075、SUB-069、SUB-076、SUB-078 之后，R2 末次 verify（e643d74）之前。选择文件 docs/verification/internal-alpha/visual-baseline-selection-r2.json 共 185 条，全部为 accepted-layout-change（regression 155、new 30）。每条都有理由、证据与前后签名的 sha256，全部引用 MIN-20261011 的 D1 与 D6，其中 24 条写明「含未结缺陷……不代表目视通过」。internal-alpha 四段逐段跑过。scaffold 与 readme 回执已再生（ee68f13 改了 15 个文件）。pack 与 storybook:build 的证据在 P12 交回第 5 节。fonts-vendor --check 通过，不需要跑 fonts:vendor。
- 没做到的部分：基线写入。intentional-diff-manifest.json 记的 disposition 是 `selected-layout-changes-refused`，refused 原因是 `current-proof-or-geometry-failed`；visual-signature-baseline.json 自 d0a6ea9（INC-399）以来没变（162d5aca）。门只在非视觉证明全绿时写基线，现在卡住它的是 O-2（axe 12 处）、C-21/O-1（手机视口锚点遮挡）和他片的 RM16 ④（zh-CN 漏译 3 条）。前两项按「未答复时」保持红，所以这一项阻塞于 Owner。
- 新发现：入仓的 internal-vocabulary-scan.json 不是批末产物，见 A2-1。

判不通过的原因：

1. SUB-046 的基线写入阻塞于 Owner（O-1、O-2），另需他片修好 RM16 ④。在此之前，第 30 步的视觉签名红不计入任何 Story。
2. 前置条件「EPIC-039 至 042 全部 Story done」未满足。本片的 120 仍不通过；导出的链上记录里，120、121、122 的状态都是 active。
3. A2-1、A2-3 两项经济档回写。

以上处置完后，本 Story 的判定人是 Owner：目视验收与四个停点。

## 3 返工清单

分包建议：三项都是经济档的回写或再生，可以进同一个经济包。A2-1 放进 R3 批末的生成物再生里做，不必等基线写入解除阻塞。

### A2-1 internal-vocabulary-scan 回执不是批末产物（134 · SUB-046）

- 现象：入仓的 `docs/verification/internal-alpha/internal-vocabulary-scan.json` 最后一次提交是 79b1953，早于 INIT-015。它记 scannedPages 35，没有 components-gplus-matrices.html 与 components-gplus-samples.html。批末第 25 步实际扫了 37 页并改写了这份回执（门退出 0，改写版存档在 `r2-verify/receipts-dirty/`），随后按惯例还原成入仓版本。原因是 SUB-046 的再生清单（internal-alpha 四段、scaffold、readme、pack、storybook:build）里没有 `pnpm internal-vocab:scan`，而这份回执在 SUB-046 的文件集 `docs/verification/internal-alpha/**` 之内；ee68f13 改的 15 个文件里没有它。同一批里，no-overclaim-scan 入仓记 604 个文件，批末为 605，差的是 ee68f13 之后的调度文档提交。
- 证据：该文件的 git log 停在 79b1953。入仓版与 receipts-dirty 版逐字段比较，差异只有 scannedPages 35 → 37，以及 pages 多出那两张 G+ 页。写这份回执的是 scripts/internal-vocabulary-scan.mjs:30，脚本入口在 package.json:21。
- 建议改法：R3 批末再生时加跑 `pnpm internal-vocab:scan` 并提交这份回执；`pnpm scan` 放在收口前最后一次文档提交之后再跑一次。只再生回执，不改门。
- 改动文件：`docs/verification/internal-alpha/internal-vocabulary-scan.json`、`docs/verification/internal-alpha/no-overclaim-scan.json`。
- 建议档位：经济档（再生回执，判定不变）。
- R2 是否改过同一目标：否。SUB-046 在 R2 是首次执行，没有碰这份回执。

### A2-2 契约与门的说明随 R2 回写（122；并入 RM2、RM9 ②③、RM5 ①）

- 现象：
  - (a) `docs/contract/README.md` 第 47 行仍写 package-css 只查 pairs.json 目标基类的状态规则。SUB-053 之后，它读整张表的状态规则（07:26）。
  - (b) `docs/design/gplus-2026-10/README.md` 第 12 行写 pairs.json 时少了 rf。第 16 行写 typography.json 时，没提 29 条刻度 token、链接对表，也没提它现在也生成进 gplus-tokens.generated.ts。
  - (c) inputs.pairs.ts 的段注释写「d/h/f/x/r/e/ef」，少了 rf。这句注释由 contract-generate.mjs 的 `inputsFile()` 写出。
  - (d) 契约 tokens.json 的 `themes.light.selector` 是 `:root`，生成物却是 `:root, [data-tcrn-theme="light"]`（gplus-tokens.generated.ts:22）。派生规则只在 contract-generate.mjs:308–310，只读契约的人看不出浅色块是一个列表。
- 建议改法：
  - (a) 按 problems/P3.md P2 给的正文改。
  - (b) 补上三处说明，并加一句：浅色选择器由契约夜间选择器的属性派生。
  - (c) 改 `inputsFile()` 里的注释字串，再重生成。只变注释，重生成后 generated-sources 照样为绿。
  - (d) 用 (b) 的那句说明解决，不改契约的值。若设计权威要契约本身写出列表，就属于改 contract/*.json，转主力档，生成器也要改，避免重复追加。
- 改动文件：`docs/contract/README.md`、`docs/design/gplus-2026-10/README.md`、`scripts/contract-generate.mjs`（只改注释字串）、`packages/ui-react/src/styles/generated/inputs.pairs.ts`（重生成）。
- 建议档位：经济档（说明与注释，判定不变）。
- R2 是否改过同一目标：否。

### A2-3 目视清单的待裁表与 P18 知悉行随 R2 回写（134 · 接 SUB-087）

- 现象：
  - (a) owner-acceptance.md 的「待 Owner 裁定」表（:212–226）仍是 R1 的 9 行，没有判断 §3.1 的编号，还缺几项有渲染面的待裁：O-2（标语与锁定说明的 ink-3 落在侧栏 acc-bg 洗底上，axe 报 12 处）；O-8（B1 与 B2 品牌规格，判断建议「保持 B1，目视清单点名确认」）；O-9（secondary 与 danger 默认 edge 的抬升层在夜间几乎看不见）；O-6（含 RM8 的 4 条字面字号与行高）。
  - (b) :228 的 P18 写「视觉签名基线整体替换」。实际情况是选择文件已备好，写入被门拒绝，基线没变（见 2.4 SUB-046）。P11 的回写早于 P12，看不到这一点。
- 建议改法：
  - (a) 现有各行注明对应编号：第 1 行 O-1 与 O-4，第 2 行 O-3，第 3 行 O-5，第 9 行 O-11。补 O-2、O-6、O-8、O-9 四行，每行写现状、来源与建议，可以附上第 4 节的 N-1。
  - (b) 改写为现状：185 条选择已备好；门因非视觉证明为红而整体拒绝写入，基线仍是 162d5aca；待 O-1、O-2 与 RM16 ④ 结清后重做。
  - 只写事实与建议，不写结论，不代 Owner 勾选。
- 改动文件：`docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md`。
- 建议档位：经济档（文档回写）。
- R2 是否改过同一目标：否。SUB-087 的判据里没有这两项。

## 4 只有 Owner 能定的事项

本片不新增独立的 O 编号。新发现与既有事项的关联如下。

- **N-1：文档壳侧栏洗底上的 ink-3 文字（并入 O-2，随 O-1 一起解决）。**
  - 现状：P1 复核时看到（problems/P1.md 第 3 节附带观察），浅色页面下文档导航的分类计数 `tcrn-doc-nav__category-count`（每页 23 个）落在 acc-bg 叠 bg 的合成色上，对比 4.35:1；夜间页面下它落在 panel 上，4.59:1。机制与 O-2 相同，都是 ink-3 落在侧栏的 acc-bg 洗底上（O-2 记为 4.36）。
  - 入仓的 axe 汇总里没有这个类名（a11y-axe-summary.json 中计 0），原因没有核实，见第 6 节。
  - 建议：O-1 按建议授权时，侧栏改为画布色，C-21 让文档壳跟随之后自然达标。O-1 不授权时，文档层把计数改为 ink-2（经济档，只改 tcrn-doc-* 规则，不碰包）。
  - 未答复时：保持现状，随 O-2 一并列出，不出返工。
- **RM8 → O-6。**
  - 现状：typography.scale.ts 余 4 条字面值（numeral-inline 16px、numeral-large 44/48px、mono 11.5px），现有 token 里没有对应的值；Typography.test.tsx 把这 4 条钉为仅剩的字面值。
  - 建议同 O-6：下次契约修订时在 typography.json 的 `tokens` 里补四条，并在 index.ts 注册，生成器不用改；或者改用现有刻度，但那会改变外观，需要 Owner 同意。
  - 未答复时：保持字面值，不阻断 122。
- **RM10 → §3.4 第 1 项（R2-6 只读获焦 rf）。**
  - 现状：Inputs 画板没有随 rf 重生成。入仓的画板 HTML 与现行契约的生成结果差一条 `--edge-rf` 声明，没有门做这项比对。
  - 建议：Owner 接受 rf 时，由设计权威侧改 tools/build-inputs.mjs 后重生成画板（经济档）；不接受时回退 rf。
  - 未答复时：维持现状。
- **O-1、O-2 对本片的影响**：阻塞 120-GWT5（第 11、18、19 步，以及第 30 步的 axe 与手机视口锚点），也阻塞 134 的 SUB-046 基线写入与前置条件。按各条「未答复时」保持红，不记不满足，不出返工。
- **O-3**：夜间 TMS 后缀仍按字标豁免处理（06.05:52–53），色值未改，与未答复时的处理一致。
- **O-8**：未答复时保持 B1。在清单里点名的那一行属于 A2-3 的回写，本片不代 Owner 判定。
- **O-10**：已按建议执行（contract/tokens.json:49），属于 §3.4 的回显。
- **O-11、O-12**：没有变化，不影响 121 的判定。本验收不对许可合规下结论。

停点：推送、打 tag、发版、部署与 Owner 目视验收都由 Owner 本人做，本分片没有代签任何一项。

## 5 实施口径判定

| 来源 | 口径 | 判定 | 理由 |
| --- | --- | --- | --- |
| P1 §3.4 第 1 项 | O-10 只改 surface 的注释 | 可接受 | 与判断建议一致，值仍为 var(--bg)（tokens.json:49）。 |
| P1 §3.4 第 2 项、RM5 ① | 浅色属性选择器由生成器从夜间选择器派生，契约里 themes.light.selector 仍为 :root | 有条件 | SUB-047 的文件集不含 tokens.json，判据点名的是生成器。派生结果是确定的，遇到异常形式会报错（contract-generate.mjs:308–310）。条件：契约说明里写明派生规则（A2-2 (d)），否则契约与生成物在选择器上看起来不一致。 |
| P1 §3.4 第 3 项 | 选择器列表按集合比较 | 可接受 | 选择器列表的语义与顺序、空白无关；多一个或少一个成员都不算浅色块（05 log:12）。 |
| P1 §3.4 第 4 项 | checkC5 的判定逻辑不改，只加注释与用例 | 可接受 | 原逻辑已经把列表的两个成员归到同一个浅色侧；正反用例在 13 log:36，token 块的 C5 为 0 发现（13 log:90）。 |
| P1 §3.4 第 5 项 | fonts-render 加 mono 400 与 500 两个探针 | 可接受 | IBM Plex Mono 出货的字重就是 400 与 500；探针为绿（21:24–25）。 |
| P1 §3.4 第 6 项 | 单测夹具从契约读字族值 | 可接受 | 不在测试里另抄一份，避免漂移；另有一条用例钉住三条字栈的开头（06.07:2），变异用例不依赖契约里的值。 |
| RM5 ② | ink-3 复核结论：四类承载面上没有非豁免落点 | 可接受 | 方法覆盖了契约的 48 格与 37 页渲染，与修后矩阵 contrast 全部通过一致。acc-bg 上的观察转为 N-1。 |
| RM5 ③ | 改契约后先构建 ui-tokens，再跑 tokens-sync | 可接受 | 这是流程事实。verify 里 build 排在 tokens:proof 之前，--check 读到的是新 dist。 |
| P2 SUB-052 | 刻度登记在 typography.json，不放 tokens.json 的 fixed 段 | 可接受 | 判据允许二选一。这样 tokens.css 与 storybook.css 字节不变（diff 为空），画板的 .gp 块也不会多出变量。 |
| P2 SUB-052 | token 值与刻度数值不符、token 字段没被用到时，生成器报错 | 可接受 | 能防漂移。交回里记了两条反证，本次未复跑（见第 6 节）。 |
| P2 SUB-052 | numeral 的字号与行高引用 heading-2 的 token（值同为 26/30） | 可接受 | 只引用已有 token。H2 改值时生成器会报不一致，迫使做一次取舍，不会悄悄跟着变。 |
| P2 SUB-052 | 其余字距保留字面值 | 可接受 | 判据只点名 tracking-caps。.06em 与 tracking-stamp 同值但角色不同，不应借用。 |
| P2、RM11 | gplus-tokens.generated.ts 的头部列出 typography.json；这一点只写进 CHANGELOG | 可接受 | 只关系到本仓维护者；CHANGELOG.md:22–24 已写。 |
| P3、RM3 ① | 「全部状态规则」取 clauses.md C2 的定义，并上 pairs.json 的状态条件 | 可接受 | 与 contract-static 同一口径，也与 R1 验收探查的口径一致；探查 2 的 94 条里 0 处。宽口径多出的 2 条是 Navigation 家族的壳层装饰（§3.3），而且 `currentColor` 不是写死的色值。若设计权威要把 data-* 壳层状态也算作状态，应先改 clauses.md，门经 selectorFacts 会自动跟随。 |
| P3 | contract-proof 从 contract-static 导入 selectorFacts | 可接受 | 两道门共用一个定义。第 7 步日志里没有 contract-static 的输出，说明导入没有副作用。 |
| P5 SUB-050 | 只有 var() 的层交给 token 表那边去读；两个 .ts 源按模板字面量读取 | 可接受 | tokens.css 在检查面内；探查 3 在 dist 上得到一致的结果（最大模糊 1）。附注：门只读名称含 shadow、elevation、edge、focus-ring 的自定义属性，探查用的过滤条件相近，名称不合这个规律的阴影两边都看不到（见第 6 节）。 |
| P11 第 1 项、RM17 ① | 把「改正第 17–19 行」理解为改 token 来源那句话 | 可接受 | 与 A-5 记的不符点对题（「每个值都由契约生成」对字体刻度不成立）。改写后分别写明两个来源，以及保留手写值的旧名。 |
| P11 第 2–6 项 | 头部变化只写进 CHANGELOG；SUB-080 只写进 CHANGELOG；M10 标题加 link states；RM7、RM13 放进对应画板的节；主题钮一行只写已验证的表现 | 可接受 | 按读者分配位置，没有写入未经核实的行为。 |
| P11 问题 2、RM17 ② | 迁移说明 M1 保留两个 CDN 主机名 | 可接受 | 那是告诉消费方删掉哪些链接的指引（migration-4.0.md:110），不进包，也不进文档站；GWT1 关心的构建产物与打包文件集里为 0（探查 4）。如果要求全仓为 0，由 Owner 或判断另定。 |
| P11 问题 4、RM17 ④ | ui-tokens README 版本行里的 accepted 不改 | 可接受 | 沿用 R1 对 W7-A P3 的口径。该行登记在 version-surface 门里，本单的要求是版本号不动。 |
| P11 SUB-054 | 删除脚本而不修复 | 可接受 | 没有现行引用，历史记录原样保留（见 2.3）。 |
| P12 第 8 节第 3 项 | 两份视觉选择的中间产物不入仓 | 可接受 | 一份绑定当次构建的字节，重建后即失效；另一份与 manifest 内容相同。选择文件本身已入仓。 |
| P12 第 9 节 | 选择文件的生成脚本只放在会话 scratch（tmp/r2-P12/gen-selection.mjs） | 有条件 | 重做时要用它。条件：重做完成前不得清理；会话轮换时随接续点一并移交。 |
| P12 第 3 节 | 185 条按 story 内容与提交归因，只抽看了 3 条；24 条带未结缺陷的按当前渲染接受，并写明「不代表目视通过」 | 有条件 | 这次没有写入基线。重做时签名会变，须按届时的捕获重新生成；已修好的缺陷要去掉标注；不受 Owner 阻塞的未结缺陷（RM15）宜先修再选。任何一条都不能把 accepted-layout-change 当作目视通过。 |
| P12 第 4 节 | fonts-vendor --check 通过，就不跑 fonts:vendor | 可接受 | 判据就是这样写的；967 个产品码位都已覆盖（06.08:7）。 |

本片不可接受的口径：0 条。P3、P5、P12 各有只读命令带了 cd，没有弹框，也没有改文件，属于流程瑕疵，已在 RM4 记录，不影响判定。

## 6 证据盲区

1. 没有重跑任何门。证据是 e643d74 的 R2 verify 日志与 HEAD 上的文件，HEAD 与 e643d74 只差 6 个调度文档。
2. 没有启动浏览器。N-1 里文档导航计数为何不在 axe 汇总中、各项目视效果、手机视口截图下半部为空白（P12 问题 5），都没有核实。
3. 没有打包。CDN 搜索按 `files` 字段取文件集，没有解开 tarball。P11 解包核对过；P12 与第 16 步的 tarball sha256 相同，可作旁证。
4. 选择文件只做了汇总核对（条数、字段、D1 与 D6 的引用、24 条标注），没有逐条核对理由，也没有看截图。
5. P2 的生成器反证（值不符、字段未用）与 P1 的反证（去掉 mono 回退、换回单 :root）只读了交回说明，没有复跑。
6. 阴影检查与探查 3 都按自定义属性的名称过滤；名称里不含 shadow、elevation、edge、focus-ring、ring 的阴影值，两边都看不到。
7. 第 10、17、30 步只做了根因归属的判断（他片），细节由 B、C 两片判定。
8. 链上状态取自会话 scratch 里导出的记录（120、121、122、134 均为 active），没有经引擎重读。
