# 摘录附件 · W4-A：上游包交回说明（W2-C、W2-F、W3-C）

只读与本包有关的条目：图标矩阵可用的导出、五语文案条目的增删、机器词台账行、新标语。


## 交回 W2-C

### 交回说明 · W2-C（SUB-014 → SUB-015）

两张 Subtask 都已完成，没有接续点。本文记录 W2-D（包入口）、W2-F（story-content.tsx）、W3-C/W3-D、W4-A（icon 矩阵）、W6-B 与集成需要对齐的事实。问题与风险见 `runs/r1/problems/W2-C.md`。

## 已交付

- SUB-014（863ab1e）：`Icon.tsx` 改为从 `icon-paths.generated.ts` 渲染，组件里没有任何手写路径。svg 带 `viewBox="0 0 20 20"`、`fill="none"`、`stroke="currentColor"`、`stroke-width="1.25"`、round 端点和 round 拐角；每个子元素都带 `vector-effect="non-scaling-stroke"`（这个属性在 SVG 里不继承，所以要逐个加）。生成物里的子元素标记按一套封闭语法读成 React 元素：只认 path、circle、ellipse、rect，属性只认 d、cx、cy、r、rx、ry、x、y、width、height。契约以后要是出现别的元素或属性，该图标渲染时会直接抛错，不会悄悄只画出一半。`sm`、`md`、`lg` 从 `@tcrn/ui-tokens` 的 `--tcrn-icon-size-sm|md|lg` 读像素值（14、16、20），数字尺寸照原样用；尺寸写在 width、height 属性上，宿主的 CSS 仍然可以覆盖。`strokeWidth` 已经从 `IconProps` 里拿掉；强行传进来也会被契约描边压掉。decorative 与 aria 的行为照旧，children 仍然追加在契约路径后面。`styles/icon.css.ts` 的 `iconCss01` 加了 loader-circle 的旋转：`animation: tcrn-icon-spin var(--tcrn-motion-loading-loop) infinite`，减少动态效果时为 `animation: none`。`Icon.test.tsx` 共 6 条用例：37 个名字与 icons.json 同集同序（新增 9 个也同序）；每个图标的子元素逐个等于契约路径且都是非缩放描边；三档尺寸等于 token；名册外的名字和 strokeWidth 都用 `@ts-expect-error` 锁住；aria 行为；loader 的 CSS。
- SUB-015（52065c0）：`packages/ui-react/package.json` 去掉了 lucide-react。锁文件只删了 12 行 lucide 条目（importer 项、packages 项、snapshots 项各一处）。pnpm 10.12.1 删掉的 26 行 `libc:` 已经按 W1-C 的做法保留，`corepack pnpm@10.12.1 install` 回读时报 Lockfile is up to date。README 的图标段改成自绘 37 件名册（现有 28 件加新增 9 件），并写明尺寸、描边、可及性和 loader 的规则。`scripts/package-contract-manifest.mjs` 的 `iconLibraryContract` 改为把 icons.json 记为来源，字段有 source、sourceContract 和它的 sha256、生成物路径、viewBox、strokeWidth；新增四项检查进 ok：`iconNamesMatchContract`（导出名册与契约同序）、`thirdPartyIconDependencies`（ui-react 清单的四个依赖段里不得有 lucide*）、`packageSourceThirdPartyIconImports`（ui-react 源码里不得 import lucide*）、`storybookThirdPartySourceClaims`（Storybook 运行时源文件不得再写 `data-icon-library-source="lucide…"`）。原来的 sourcePackage、lucide 依赖版本与精确版本检查、ISC 许可要求都已删除。回执还原了，没有提交。

## 包入口（W2-D）

- 不需要改动。`index.tsx` 里有 `export * from "./components/Icon/index.js"`。Icon.tsx 的运行时导出还是 `Icon` 和 `tcrnIconNames`，类型导出还是 `IconName` 和 `IconProps`，名字都没变。
- 类型有变化，但不需要改入口：`tcrnIconNames` 现在就是生成物里的 `tcrnIconPathNames`（37 个名字的只读元组），`IconName` 等于 `TcrnIconPathName`（联合类型从 28 个扩到 37 个）。`IconProps` 去掉了 `strokeWidth`。整个工作区的 typecheck 通过，没有消费方因此报错。
- 可选：icon 矩阵（W4-A）如果要标出哪些是新增图标，或者要显示网格和描边的数值，需要从入口导出 `tcrnIconNewNames`、`tcrnIconViewBox`、`tcrnIconStrokeWidth`。做法是在 `index.tsx` 加 `export { tcrnIconNewNames, tcrnIconViewBox, tcrnIconStrokeWidth } from "./components/Icon/icon-paths.generated.js"`，再把这三个名字加进 `componentLibraryPublicUtilityNames`。本包没有替入口扩大公开 API。

## 集外改动需求

1. story-content.tsx 的「Icon library contract」块（第 1063–1103 行，表格在 1078–1092 行，本波归 W2-F）。建议改成：`data-icon-library-source="tcrn-icon-contract"`，与 manifest 里 `iconLibraryContract.source` 的值一致；去掉 `data-icon-library-license`，或者改成包自身的许可 `Apache-2.0`；wrapper 和 brand-boundary 两个属性保留，manifest 的 `storybookContractVisible` 还要用。表格三行改为：Source library 写「37 icons drawn for @tcrn/ui-react from the design contract, exposed through Icon」，boundary 写「Downstream UI imports TCRN icon primitives instead of drawing its own SVGs」；License readback 这一行删掉，或者改写成「Icons are package source under the package license」；Brand boundary 一行不变。新文案要在 `storybook-content-text.ts` 里写齐五语，同时删掉第 506、507、509 行三条旧条目，以及 `scripts/lib/locale-invariant-ledger.mjs` 第 160 行的 `"Lucide React"`。
2. smoke.test.ts 第 667、669 行（W3-C 等）：跟着第 1 条一起改成新值，并加一条不得出现 lucide 的反向断言（问题清单 P3）。
3. `allowedLicenseGroups` 加 OFL-1.1（问题清单 P1，待主线程或 Owner 定）。
4. `.tcrn-icon` 基础规则要不要进包，待 Owner 裁定（问题清单 P6）。裁定前不要改 `styles/icon.css.ts` 以外的地方。
5. base.css.ts 与 styles/index.ts 都不需要改：`iconCss01` 本来就在拼接列表里，位置在 root 自定义属性之后、第一条 actions 规则之前。

## 给后续包

- Icon 的标记依次为 `xmlns`、`width`、`height`、调用方传入的其余属性，再接 `viewBox`、`fill`、`stroke`、`stroke-width`、`stroke-linecap`、`stroke-linejoin`、`aria-*`、`role`、`data-icon-name`、`class`、`focusable`。smoke.test.ts 第 566 行反向断言 `viewBox="0 0 20 20" focusable="false" aria-hidden="true"`，用来抓手写的 svg；Icon 的 `viewBox` 后面紧跟 `fill`，不会命中这条。Icon 测试里也锁了这一点。
- 矩阵 story 要实测「16px 下描边 1.25」（124-GWT1 的测量部分），对象是 `svg.tcrn-icon` 的子元素：`vector-effect` 写在子元素上，svg 元素本身没有。
- 新图标名（Clipboard 的 copy、DatePicker 的 calendar）现在已经在名册里，W3-D 可以直接用。
- `Icon.tsx` 现在会在运行时 import `@tcrn/ui-tokens`。这本来就是 ui-react 的 dependencies 项，tsconfig 也已经引用了它。

## 局部门（包树根执行）

typecheck、`--filter @tcrn/ui-react build`、`node --test packages/ui-react/dist/components/Icon/Icon.test.js`（6/6）、`install`（Lockfile is up to date）全部通过。`grep -c lucide packages/ui-react/package.json` 输出 0，退出码 1 是 grep「没有匹配」的正常退出码。`package-contract-manifest.mjs` 退出 1，红在两处：OFL-1.1（基线即红，P1）和 story-content.tsx 的 lucide 来源声明（P2）。脚本写出的两份回执已经 `git checkout` 还原。

## 交回 W2-F

### 交回说明 · W2-F（SUB-022 → SUB-023）

## 已交付

- SUB-022（ccb7bea）：`Navigation.tsx` 品牌段与 `styles/brand.css.ts`。
  - `TcrnBrandMark` 新增 `productId`（`tms | einzbern | mana-orchestrate | design-system`）与 `variant`（`color | mono | tile-tint | tile-deep`）：有 productId 时内联绘制 `product-marks.generated.ts` 的 SVG（`svg.tcrn-brand-mark`，`data-product-mark`、`data-product-mark-variant`，mono 用 currentColor，淡底贴片为 tint 底加彩色标，深底贴片为 deep 底加白色标）；无 productId 时仍是母标 img，属性不变。
  - 新的小写导出：`tcrnProductMarkIds`、`tcrnProductMarkVariants`、`tcrnProductMarkSvg(productId, variant?, { ink?, size? })`（独立 SVG 文件文本；color 与给定 monoInk 的 mono 与 logos2 逐字节相同）；类型 `TcrnProductMarkId`、`TcrnProductMarkVariant`、`TcrnProductMarkSvgOptions`。
  - `tcrnProductLogoRegistry`：workflow 改为 einzbern，新增 mana-orchestrate；四个有标产品的名称、字标字族、五语标语取自生成物；新增字段 `markId`、`wordmark`（sans/serif）、`byline`；衬线产品 `lineOneSuffix`、`suffixClassName` 为 null；aos 注册项保持。`ProductLogo`、`ProductLockup`、`ShellBrandLockup` 新增 `markVariant`；衬线产品渲染 `tcrn-product-logo--serif` 与 `tcrn-product-logo__byline`（by TCRN）。
  - 品牌段：渐变后缀删除；TCRN 与无 productId 后缀为 ink；TMS、Design System 后缀读 `--tcrn-brand-suffix-tms|design-system`；AOS 后缀不变；标尺寸按容器分层（ProductLogo 38、ProductLockup 28、产品壳侧栏 22，关于页 56 由消费方覆写变量）；标去掉尺寸与滤镜过渡；产品壳收起态文案 `display: none`；侧栏隐藏 byline。没有新增段导出，段位置不变。
- SUB-023（1def73f）：
  - `ai-consumption-contract.ts`：`productLogoRegistry` 发布五个产品及新字段；新增 `productMarkSources`（八个文件的路径、字节数、sha256 字面值）；`brandSurfaceDisposition` 改写为 G+ 规则。
  - `brand-asset-source-proof.mjs`（输出 schema v2）：母标部分原样（含联网核对）；新增八文件 digest 与登记比对、包的 file export 与渲染出的 TcrnBrandMark 和文件字节比对（mono 以 currentColor 替换 monoInk 后比对）、贴片对照 marks.json 的 tile。需先 build。
  - `token-extension-proof.mjs`：EXTENSION_TOKENS 只留 motion 两项与 aos accent；停用表 RETIRED_EXTENSION_TOKENS（secondary-readable、accent-tms、accent-workflow、accent-design-system-1..4）容许定义、读取即红；LOCAL_VARS 登记五个品牌层级变量 `--tcrn-brand-line-one-size|height|base-weight`、`--tcrn-brand-line-two-size|height`。
  - `Navigation.test.tsx`：品牌注册、标语（逐字对照 STORY-127）、GWT1、四种 rendition 字节、母标回退与品牌 CSS 规则。

## 八个文件 digest（契约登记 = 本地重算，brand-asset 门通过）

| 文件 | 字节 | sha256 |
| --- | --- | --- |
| tms.svg | 357 | 5bc00be377752865055228d65306c6474a8506f9deae9e94a57f1f5a9f514eab |
| tms-mono.svg | 357 | 3499dd42780ea17447420110f819fd1c0261b8269828776ea43305353bcb132c |
| einzbern.svg | 358 | 8cc4e309c9d71175f507a0024d7218d5aa03787b80237c3ccfd58bbc7332f0d7 |
| einzbern-mono.svg | 358 | ea55dde0d50080c2f4e64e743cffa60b202bcb7d6cf55faac1034f26256c8425 |
| mana.svg | 328 | debfe48dd2773728d64f847f5454d6d6071a7ba074326e7da7a63703ec750296 |
| mana-mono.svg | 328 | 7a645886fbe626ae4980c65b975a1dea29a10e10836f8a0f3484dca9734811a9 |
| ds.svg | 392 | 03b1f776e9d8ba899976f09a32e9206b0ce4960d7d6d1788eb50a4a4801f6cdc |
| ds-mono.svg | 392 | 19eafbd0497f764132c90bf4fbe4db34a8b7a4046ad7aa49b464a2b1f71c06ce |

反向验证（已还原）：mana-mono.svg 改一个字节，门报 digest 不符与两处字节不符并退出 1；dist 中 TMS 标改一个色值，门报 file export 与渲染字节不符并退出 1。母标 TCRN 文件未动，远端 200、digest 一致。

## 集外改动需求

1. `packages/ui-react/src/styles/base.css.ts`（W3-D）：删除停用的品牌 token 定义（第 14、16–21、24、26–31 行）；删后从 token-extension 停用表移除对应项。
2. `apps/storybook/src/smoke.test.ts:1432`：改为 `/TCRN stays in ink at medium weight/`。
3. `scripts/storybook-smoke.mjs:1242` TMS zh 期望改「艺人管理系统」；`storybook-smoke.mjs:3103/3353` 与 `scripts/internal-alpha-browser-proof.mjs:1318` 的文档壳标语判据由「组件库」改「设计系统」。
4. `apps/storybook/src/build/locales/storybook-content-text.ts:743–747`：补「Design System」「Project memory engine」「Project memory assistant」五语条目，更新 TMS 条目（zh 艺人管理系统、ko 탤런트 관리 시스템）。
5. `scripts/shell-parity-proof.mjs:811`：登记品牌资产规则同时接受 `svg[data-product-mark]`。
6. `scripts/geometry-proof.mjs:441`：品牌变异需能穿过 `display: none`，或改测侧栏标恒为 22。
7. `scripts/lib/locale-invariant-ledger.mjs`：若有 story 渲染 Einzbern、Mana Orchestrate 锁定块，登记机器词「by TCRN」。
8. `scripts/contract-generate.mjs`（下次改契约时）：输出 marks.json 的 tile 与 monoInk，组件改读生成物。
9. `packages/ui-react/src/index.tsx`（W2-D）：可把 `tcrnProductMarkSvg`、`tcrnProductMarkIds`、`tcrnProductMarkVariants` 加进 `componentLibraryPublicUtilityNames`（index.test 不强制小写导出入名册）。
10. `apps/storybook/src/contract-stories/story-content.tsx`：类型检查未因注册项改名报错，本包未改；W3-C 的 brand-sample-product 可直接用 `ProductLogo productId="tms" | "einzbern" | "mana-orchestrate" | "design-system"`。

## 未做完

无接续点。127-GWT4 的 52px 收起宽随 P1 待 Owner，夜间后缀色随 P15 待 Owner（问题清单 #8、#9）。

## 交回 W3-C

### W3-C 交回说明（INIT-015 R1，SUB-027）

SUB-027 的标记侧已经完成，代码提交为 3e2c46f，没有接续点。问题与判断见 `runs/r1/problems/W3-C.md`。

## 已交付

- 86 个 rename 类在标记、门和测试里全部改为 `tcrn-doc-*`。改名按 doc-class-map.json 的 `target` 逐 token 替换，类名边界判定，前缀相同的类互不影响。
- 85 个删除类（delete-package-provided 38、delete-demo 32、delete-dead 15）已从标记中删除，处置方式见问题清单第 4 条。删除后，包组件按自身属性渲染。
- W2-C 交回的第 1、2 条：Icon library contract 块的来源改为 `data-icon-library-source="tcrn-icon-contract"`，删除了 `data-icon-library-license`，保留 wrapper 和 brand-boundary 两个属性；License readback 一行整行删除。smoke.test.ts 随之改为断言新的来源值，并新增两条反向断言：Style Guide 页不得出现 `lucide`（不区分大小写），也不得出现 `data-icon-library-license=`。
- 差集证据（本包树）：`--details` 显示剩余的 164 个类全部只有 CSS 定义，源码使用与渲染使用都是 0。清零的那次提交须在 W3-B 合入后由集成方跑门，并附差集证据。

## 给 W3-B（SUB-025/026）

- CSS 里 86 个旧名按 map 改名，85 个删除类的规则一并删除。`page-template.tsx` 现在写出 14 个 `tcrn-doc-*` 类，需要在 CSS 里有定义，`templateClassCheck` 才会转绿。
- `.tcrn-doc-icon-sample-grid` 必须保留 `margin: var(--tcrn-space-4) 0 0`，并且不得出现 `--tcrn-space-3`；smoke.test.ts 读的是页面内联 CSS。
- 密集壳的顶栏现在是包 `TopBar`，`.tcrn-shell-demo__topbar …` 系列规则，包括 `.tcrn-search-input--compact { min-width: 0 }`，已经没有目标元素。

## 给 W4-A（五语与机器词）

- 新增的可见文案共两条（英文原文），需要在 `apps/storybook/src/build/locales/storybook-content-text.ts` 里写齐五语：
  - `37 icons drawn for @tcrn/ui-react from the design contract, exposed through Icon.`
  - `Downstream UI imports TCRN icon primitives instead of drawing its own SVGs.`
- 该文件里应删除第 506、507、509 行三条旧条目。因为 License readback 一行已整行删除，第 508 行「License readback」和第 510 行「This is a license receipt, not legal advice or package publication.」也已没有使用处（apps/storybook/src 内 grep 为 0），一并删除。
- `scripts/lib/locale-invariant-ledger.mjs` 第 160 行的 `"Lucide React"` 删除。

## 给 W6-B（期望值重定基线）

以下几处结构变了，外观期望值可能随之变化，本包没有改动这些期望值：

- 密集壳的两条顶栏改用 `TopBar`，影响几何与视觉签名。
- changelog 的紧凑节点现在是 `.tcrn-machine-token__value`，storybook-smoke 约第 2902 行检查它的宽度、overflow 与 text-overflow。
- 加载示例改用 Card、Skeleton、Progress、Badge 与转圈图标。
- 字号样本改用 Heading 与 Text。
- 短字段宽度改由容器设定。
- shell-parity 现在通过包根类 `tcrn-top-bar`、`tcrn-side-nav` 测量 knowledge 壳的顶栏和侧栏。

## 给集成

- 集外的两个门须在同一次合并时一起改：`scripts/s254-story-dom-proof.mjs:43` 与 `scripts/shell-fidelity-proof.mjs` 的几处条目，见问题清单第 3 条。
- storybook test 另有 7 条失败断言不是本包造成的，见问题清单第 2 条 (b)。
