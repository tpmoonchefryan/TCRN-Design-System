# INIT-015 R1 · W2-G 问题清单（SUB-007 与画布色）

按「见红只记不修」记录。本包两条局部门都是绿的：`run build` 退出 0，`fonts-render-proof` 八条腿全部通过。自查 `public-output:scan` 为 ok，共查 99 个文件，hits 为空。下列各项都在本包文件集以外，或者超出派工范围，所以只记录、没有修。

| 编号 | 类别 | 现象与证据 | 建议处置 |
| --- | --- | --- | --- |
| P1 | 预测红（集外测试） | `apps/storybook/src/smoke.test.ts` 中「canvas color and theme-color first-paint mirror the surface-canvas token」（约 1074 行起）有三处按源码正则断言：一是 `.storybook/preview.ts` 里 `"TCRN canvas", value: "<hex>"`，二、三是 `client-scripts.ts` 里的 `light: "<hex>"` 与 `dark: "<hex>"`。本包把这三处都改成从 `createResolvedTokenMap(theme)["--tcrn-color-bg"]` 读取，源码里已经没有十六进制字面量，所以这三条正则不会再命中。页面 meta 一条只要改读解析后的 `--tcrn-color-bg` 就能通过，构建页现为 `content="#efeeea"`。W2-A 的 P3 是同一根因。 | 由 W4-A 按 handoff/W2-G.md 第 3 节的写法改。 |
| P2 | 潜在缺陷（未运行验证） | `preview.ts` 仍是旧的 `backgrounds: { default, values: [...] }` 写法。Storybook 10.4.6 的 `BackgroundsParameters` 类型只声明了 `default`、`disable`、`grid` 和 `options`（键到 `{ name, value }` 的映射），没有 `values`。因此真 Storybook 可能根本不提供「TCRN canvas」这个背景，本次没有在运行时核实。派工只要求改值；如果连形态一起改，W4-A 的断言写法也得跟着变，所以这里没有改。 | 由 W4-A 或集成在同一处一起改：用 `options: { canvas: { name: "TCRN canvas", value: tcrnCanvas } }`，加 `initialGlobals: { backgrounds: { value: "canvas" } }`，smoke 断言同步更新。 |
| P3 | 影响面（后续门） | 静态页现在用随包的五款 web font 渲染，以前是系统回退字体。凡是打开静态页量文字的浏览器门，读到的文字宽高都会变，包括 geometry-proof、geometry-measure、storybook-visual-proof、shell-parity、internal-alpha-browser-proof 和 doc-shell-class 的渲染腿。这些门本包都没有跑。 | W5 与各门的负责包按新字体复核阈值和基线；如果出现红，先排除字体变化这个原因，再判断是不是缺陷。 |
| P4 | 未接线（集外文件） | `scripts/fonts-render-proof.mjs` 还没有在根 `package.json` 里登记脚本，也没有接进 verify，因为 package.json 不在本包文件集。这个门要先 `pnpm build`，并且需要 Playwright Chromium，在本机跑一次约 25 秒。 | 由持有 package.json 的包加 `"fonts:render-proof": "node scripts/fonts-render-proof.mjs"`，并排在 verify 的 `pnpm build` 之后。 |
| P5 | 产物体积 | storybook-static 新增三项：fonts/ 下 52 个字体文件，共 3,290,644 字节；licenses/ 下 5 份 OFL 文本；tcrn-fonts.css，约 67.7 KB，gzip 后约 11.8 KB。每页多一个 `<link>`。 | 如有回执或预算记录文档产物的体积或文件数，由 W8-A 一并更新。 |
| P6 | 说明（无需处置） | 本包另把真 Storybook 轨构建了一次，输出放在 scratch，用完已移入废纸篓。结果是 assets/ 下有 52 个 Vite 哈希名副本，fonts/ 下有 staticDirs 提供的 54 项。所有 woff2 都与随包文件逐字节相同，输出里没有 googleapis 或 gstatic。Storybook 自带的 Nunito Sans 管理界面字体不属于随包字体，fonts-proof 原有的范围说明已经覆盖这一点，而且 storybook-preview-static 已列入 gitignore。 | 无。 |
