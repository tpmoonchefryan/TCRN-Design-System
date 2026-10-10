# 交回说明 · W2-F（SUB-022 → SUB-023）

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
