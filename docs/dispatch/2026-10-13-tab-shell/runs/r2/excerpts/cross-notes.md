# R2 跨包通告（主线程维护）

派工提示指到本文件时全文读；它只指向别的文件的行段，按指明的行段读，不整读。

## 1. 既有红与归属

- R1 批末 verify（63e1ee2）的红段 → 返工项对照在 `runs/r1/judgment.md` 第 283–301 行（§2.7）；返工项 → Subtask 与包的对照在 `runs/r2/decomposition.md` 第 2 节。你的包只修本包承接的返工项；别包承接的红在你的包树里出现时，在交回物里记一句「既有红，归 <包>」，不修。
- `--filter @tcrn/ui-react test` 在 `dist` 未构建时以 0 条测试退出 0：先 `--filter @tcrn/ui-react build` 再跑 test。
- `pnpm test`（根）在第一个红的包就停（KB-030）：要看某个包的测试，用 `--filter <包名> test` 单跑。

## 2. 已落地的接口

- R1 各包的接口仍以 `runs/r1/excerpts/cross-notes.md` 第 2 节为准（按其中指明的交回物行段读）。
- R2 各包交回后，主线程在本文件第 3 节补行。

## 3. R2 已合入包给下游的接口

| 包 | 交回物与行段 | 要点 |
| --- | --- | --- |
| K2 | `runs/r2/handoff/K2.md` 第 94–110 行（第 5、6 节） | `.story-body` 比对副本末尾已带壳层段（SUB-170 只改段首定位）；换字跳过与台账都认三个字标类，`[data-locale-invariant]` 只给台账用；内层 Esc 经 `defaultPrevented` 告知外层（SUB-151 保留）；文档层示例类改名 `tcrn-doc-demo-frame`、`tcrn-doc-demo-pager`；不要再加「Change Log」内容键。既有红：`smoke.test.ts:826/831/832` 断言旧类（归 SUB-173）、tokens:proof 的「铛」（归 SUB-177） |
| K3 | `runs/r2/handoff/K3.md` 第 47–54 行（第 4 节） | smoke 与 browser-proof 改读顶带钩子（`[data-shell-strip]`、`[data-shell-brand]`、`[data-cluster]`、`[data-shell-avatar]`、`[data-paper]`）与新回执字段（`menuRowLabel*`、`currentMenuRowPages`）；parity 去掉 10 个样板角色；契约清单改查顶带文档壳与现 README 的 prop——SUB-176、SUB-173 删旧文档壳标记词不会再打红 30.01；browser-proof 回执 507,403 字节并自检不超 1,000,000。既有红：shell:parity 两个包侧角色（归 R2-18）、smoke 与 browser-proof 余项（归 R2-8/16/17/20/21/24/34/36）；两个「search results」视觉实例渲染为壳收起态（问题 4，下一轮）；smoke 对 AI 契约的断言仍描述旧壳，SUB-176 重写契约后会红（问题 7） |
| K1 | `runs/r2/handoff/K1.md` 第 75–96 行（第 4 节） | `/* tcrn:shell-layer-start */` 在标按钮规则前标出壳层段起点（只一次）；Sheet 打开时壳根 `data-state="sheet"`；ProductLogo 渲染 `b > em` 加 `small`（类名不变），只在带 `data-lockup` 的锁定块上给彩色标 `data-logo`；`brandCss03` 已删（含 `styles/index.ts` 的 import 与登记行）；旧 260/420 搜索尺寸规则已删；纸内滚动区可聚焦、铃铛悬停 6% 墨洗。既有红：storybook test 8/12（`smoke.test.ts:1973` 收到菜单内置「已固定」组标题，归 SUB-173）；`scripts/storybook-smoke.mjs:1066-1067` 仍要求旧 260/420 尺寸（该文件在 K3，已合入，主线程另行安排）；shell:fidelity（归 R2-21） |
| K7 | `runs/r2/handoff/K7.md` 第 51–58 行（第 6 节） | 壳层门选择器新增 `rowScope`、`col`、`scrim` 三键；`judgeShellReadings` 多返回 `checks`、`failedChecks`；prail 检查在 18 门之外（一条板变异、一条故事变异）；`manifest.packageFixture` 列出的故事变异也在夹具 `tests/fixtures/geometry-measure/shell/package-menu.html` 上跑；css-template-integrity 的家族段名正则放宽，连进 `tcrnRetiredComponentCss` 的段不计为家族段（问题 1，交判断确认）。SUB-152（K6）要在 `[data-shell-col]` 内发行内图标 `data-guide="prail"` 与文字 `data-text="prail"`（落在 `.tcrn-nav-item__label`），真件的 pinJitter 与 prail 才有读数。真件 18 门：9 绿 8 红 1 n/a，红按根因归 K1（R2-3/4/6/10）、K5（R2-18/22）、K6（R2-13） |
| K4 | `runs/r2/handoff/K4.md` 第 100–112 行（第 10、11 节）；豁免删除后的红按家族列在第 14–26 行（第 2 节） | 新 token 标 22、触摸 44、面包屑图标 11（`--tcrn-shell-crumb-icon`），`@media (pointer: coarse)` 块进 token 表；ui-tokens 新导出 `tcrnCoarsePointerMedia`、`tcrnCoarsePointerTokens`，`TokenCssBlock` 增 `media`；shell-fidelity 新检查 `shellGeometryLiteral`；三条第二批豁免已删，contract:static 剩 82 条发现（C2 3、C7 45、C11 34），各有根因（第 2 节），交 K6、K6b 与下一轮；`tests/contract-static-proof.test.mjs:524` 仍规定第二批家族必须有豁免（R2 无持有者）。K5、K6 要按 K4 问题 1–4 改钉着旧写法的 ShellMenu、Navigation、Typography 测试；K6b 的面包屑分隔符改读 `--tcrn-shell-crumb-icon` |
| K5 | `runs/r2/handoff/K5.md` 第 75–86 行（第 8、9 节） | 页模板按 `/* tcrn:shell-layer-start */` 切壳层段（缺失、重复或位置不对时构建失败）；四个壳 story 在静态页上以真 React 件水合（`apps/storybook/src/build/shell-hydrate.tsx` 持有屏幕表，K11 的新屏加在这里；产物 `ds-shell-hydrate.js` 约 523 KB），下拉静态桥已退役；ProductShell 新增 `previewStates`，下拉行标 `"open"` 时起始即展开级联；ts-m-s 已呈现 Sheet；文档壳自己的浮层仍是脚本驱动的静态标记（接续点）；K12 要改 `smoke.test.ts` 第 1924、1959–1960 行。壳层门真件：intro、focusLoop、点外部、触摸已过，余红 markText（O-4）与 contrast；browser-proof 的 AOS 标题裁切仍红（问题 13） |
| K10 | `runs/r2/handoff/K10.md` 第 57–67 行（第 6 节） | 壳层夹具 manifest 定死新屏（shell-top-band 加 ts-search-l、ts-settings-l、ts-roster-l；shell-mobile 加 ts-settings-m、ts-roster-m）与品牌 story `shell-brand-first-line`（壳外依序八枚 ProductLockup firstLine，按 `data-lockup` 与 `data-product-id` 比对）——SUB-161 照此出 story；读数库新增 pageCrumb、settingsLayout、splitView 三键，报告新增 `pageFixture`，markText 失败键为「壳:类型@尺寸:产品」；新页夹具 `tests/fixtures/geometry-measure/shell/package-pages.html`；all.green.html 换顶带壳。已知：DS 侧栏首行 1.4 判红（待 Owner O-4），完整菜单底栏锁定块 en 读 1.7（同一根因）；品牌 story 出来后 brandDigest 会对 DS、Mana 报红（包件 data-logo 用产品键，logos2 文件名是 ds、mana，问题交判断） |
| K6 | `runs/r2/handoff/K6.md` 第 54–67 行（第 5、6 节） | C-12 各名照拆分落地；另加 `ShellMenuItem.description`、NavGroup `description`、ShellPins 与 PageHeader 的 `landmarkLabel`、shell-copy 的 `landmarkOf`、控制器 `reorderPins`（接为 `productShellControlProps.onPinsReorder`）；NavItem 发 C-5 行钩子（`data-guide`、`data-text` prail），`data-shell-group` 留在 NavGroup 列上；壳纸内页标题默认 h1——K11 在页内另有 h1 的 story 里要传 `headingLevel: 2`、给不同实例不同 `landmarkLabel`、在分类项上给 description（文档菜单 23 类是二级项不是组，组上的说明到不了门数的行，问题 1）；K4 问题 6–7 留给 K6b（钉的两行测试现为第 684、2108 行）；contract:static 仍因 `contract-static-proof.test.mjs:524` 退出 1 |
| K8 | `runs/r2/handoff/K8.md` 第 60–74 行（第 5、6 节） | `storybook-content-text.ts` 新增 14 键、删被替换的 8 键，「37 icons」键改「38 icons」；治理表那一行改名 `Top-band shell navigation`；TreeNav 文档 story 改放在包的 Popover 下拉里，画布与 TocRail 按页内内容单列；shell-matrix 叠放实测 1664（≤ 2000），台账九条改为现测值——之后谁改了台账里的 story，同一提交里重量并改台账；改过的板：V2-B1-Icon、V2-B1-Typography、成品 Icon、Typography 与 `visual-standard/canvas.json` 的 h、y。已知：`scripts/storybook-smoke.mjs` 第 1862–1866 行只认五块家族板，shell-matrix 治理元数据项仍红（归 K9 附录）；`smoke.test.ts` 第 1002 行要改断言新行（归 K12）；文件集外还有三处写 37 |
| K6b | `runs/r2/handoff/K6b.md` 第 72–95 行（第 6、10 节） | 页头 DOM：`.tcrn-page-header__title` 在 h1/h2 上并带 title，说明为 `p.tcrn-page-header__description`，两者在 `div.tcrn-page-header__lead` 里；壳内兜底焦点规则改为 (0,2,0)、颜色读 `--tcrn-pair-shell-edge-f`，移到 shell.css.ts 末尾；面包屑分隔符尺寸读 `--tcrn-shell-crumb-icon`（Icon API 不变）；contract:static 82 → 34（余 C11 34 条 ReadbackPanel 卡套卡，进下一轮），并仍因 `tests/contract-static-proof.test.mjs:524` 退出 1（无持有者，下一轮） |
| K9 | `runs/r2/handoff/K9.md` 第 64–74 行（第 6、7 节） | AI 契约 `searchRestWidth` 成员改为 `fullMenuWidthPx`、`fullMenuHeightPx`、`dropDownWidthPx`、`dropDownHeightPx`，`visualFitControlContract.search` 加高度与下拉两组；smoke 新常量 `shellSearchGeometry`，三处过期期望（旧搜索尺寸、AI 契约断言、shell-matrix 归属源）已对齐，smoke 的 missing 4 → 0；字典换掉 11 个旧键；迁移说明到 M37（SUB-177 从 M38 起追加），CHANGELOG 摘要已列 M30–M37。已知：`smoke.test.ts` 第 807、1249–1250、1521、1523、1528、1530 行由本包文字带出（归 SUB-173）；smoke 余红属别包（search-results 不可见、h1 计数 9、缺「工作项」、分类说明数 0） |
| K11 | `runs/r2/handoff/K11.md` 第 58–70 行（第 7–9 节） | 新屏 ts-search-l（已输入）、ts-settings/roster 的 -l、-m 与品牌首行 story 已出值；open-menus 改从 DOM 派生（14）；文档壳与页内壳分传地标名、页内壳标题层级 2、分类说明 23 条；`ShellStoryScreen` 多 `typed`、`page` 字段，`shellStoryNavGroups` 多当前条目参数；台账 shell-top-band 8312、新增 shell-mobile 3732、类目计数 11。壳层门真件 13 过 5 红（settingsLayout、splitView 出值并过；故事变异 21/22）。K12 要改 `smoke.test.ts` 的 story 数、story 列表与屏表，并补 5 个屏名五语键（第 58–61 行）。已知：geometry:proof 的搜索浮层与纸内基线碰撞 2 处（改碰撞判定不在授权内，问题 1）；search-static 例外未删（`alpha-styles.ts:441-450` 死规则不在本包，问题 2）；singleLine 与面包屑截断读法冲突、brandDigest 资源名不符、DS 后缀未在 axe 豁免表、zh-CN 泄漏扫描不等水合（问题 3、5、6、9） |

## 4. 其他事实

- `scripts/fonts-vendor.mjs` 只从已装的 root devDependencies（`@fontsource*` 包）复制字体并写 manifest；第 41 行的 `REGISTRY` 只作为元数据写进 manifest（第 340 行），脚本不联网。
