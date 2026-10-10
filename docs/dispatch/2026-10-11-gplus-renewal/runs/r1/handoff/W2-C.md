# 交回说明 · W2-C（SUB-014 → SUB-015）

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
