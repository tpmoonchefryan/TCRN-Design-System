# INIT-015 R1 · W2-G 交回说明（SUB-007 与画布色）

SUB-007 已完成，画布色这项小事也已完成，没有接续点。本文只记录后续包需要对齐的事实，以及本包文件集以外需要的改动。

## 1. 静态轨（apps/storybook/src/build/write-static.ts）

- 构建会把 `@tcrn/ui-tokens` 字体清单里的每个字体文件原名复制到 `storybook-static/fonts/`。复制后逐个校验字节数和 sha256，不一致就以 `storybook_fonts_copy_differs` 报错退出。每个字族的 OFL 文本复制到 `storybook-static/licenses/`。构建拥有这两个目录，清单里没有的旧文件会被清掉。
- 包内的 `fonts.css` 写成 `storybook-static/tcrn-fonts.css`。改写只有一处：把 `url("./<face>")` 改成 `url("fonts/<face>")`，另外在文件头加了一行说明。如果出现以下任一情况，构建会以 `storybook_fonts_*` 报错退出：清单外的字体、未声明的字体、data: URI、远程 URL、googleapis 或 gstatic、改写后仍不合规的 url。
- 每页 `<head>` 里、`<title>` 之前注入一行，且只注入一次：`<link rel="stylesheet" href="tcrn-fonts.css" data-tcrn-font-source="@tcrn/ui-tokens/fonts.css" />`。
- 导出的常量和函数：`STATIC_FONT_DIR`、`STATIC_FONT_LICENSE_DIR`、`STATIC_FONT_STYLESHEET`、`STATIC_FONT_SOURCE`、`rewriteFontStylesheet(css, faces)`、`linkFontStylesheet(html, label)`。构建摘要里新增了 `fonts` 字段，记录目录、字体数、字节数、许可数和样式表名。

## 2. 真 Storybook 轨与画布色

- `preview.ts` 引入 `@tcrn/ui-tokens/fonts.css`，由 Vite 输出哈希名副本，内容逐字节相同。`main.ts` 的 staticDirs 把包内字体目录挂到 `/fonts`；目录路径用 `import.meta.resolve("@tcrn/ui-tokens/fonts.css")` 解析，不写死仓库布局。
- 画布色统一取 `--tcrn-color-bg`，浅色为 #efeeea，夜间为 #121210。`client-scripts.ts` 导出 `storybookCanvasColors`，其 light 与 dark 两个值都从 `createResolvedTokenMap(theme)["--tcrn-color-bg"]` 读取；如果读到的不是六位十六进制色，构建会报错。以下三处都从这里取值：`page-template.tsx` 的首屏 theme-color meta、切换主题时用的镜像值、`preview.ts` 的「TCRN canvas」。

## 3. 给 W4-A：smoke.test 画布断言的新写法

文件头的 import 需要加上 `createResolvedTokenMap`。旧测试「canvas color and theme-color first-paint mirror the surface-canvas token」整条替换为：

```ts
test("canvas color and theme-color first-paint mirror the G+ ground token", () => {
  const canvasLight = createResolvedTokenMap("light")["--tcrn-color-bg"];
  const canvasDark = createResolvedTokenMap("dark")["--tcrn-color-bg"];
  assert.match(canvasLight, /^#[0-9a-f]{6}$/i);
  assert.match(canvasDark, /^#[0-9a-f]{6}$/i);
  const preview = readStorybookSource(".storybook/preview.ts");
  assert.match(preview, /createResolvedTokenMap\("light"\)\["--tcrn-color-bg"\]/);
  assert.match(preview, /"TCRN canvas",\s*value:\s*tcrnCanvas\b/);
  assert.doesNotMatch(preview, /#[0-9a-f]{6}\b/i, "preview.ts must not hand-copy a canvas hex");
  const componentsPage = readGroupPage("Components");
  assert.ok(componentsPage.includes('<meta name="theme-color" content="' + canvasLight + '" data-storybook-theme-color'));
  assert.match(componentsPage, new RegExp('light:\\s*"' + escapeRegExp(canvasLight) + '",\\s*dark:\\s*"' + escapeRegExp(canvasDark) + '"'));
  const clientScripts = readStorybookSource("src/build/client-scripts.ts");
  assert.match(clientScripts, /createResolvedTokenMap\(theme\)\["--tcrn-color-bg"\]/);
  assert.doesNotMatch(clientScripts, /(?:light|dark):\s*"#[0-9a-f]{6}"/i);
});
```

如果 P2 把 backgrounds 改成 `options` 形态，第二条 `preview` 断言要改成 `/name:\s*"TCRN canvas",\s*value:\s*tcrnCanvas\b/`。

## 4. fonts-render-proof（scripts/fonts-render-proof.mjs）

- 运行方式是 `node scripts/fonts-render-proof.mjs [--root <dir>]`，要先 `pnpm build`。
- 导出接口：`runFontsRenderProof({ root })` 返回 `{ ok, checks, cdn: { strings, requests } }`；另有 `familyProbes(manifest)`、`headingProbes()` 和若干目录常量。
- 共八条腿：copies、stylesheet、pages、cdn-strings、network（加载全部 35 页，并逐字节核对下载到的字体）、families（10 个字族与字重组合）、fallback（「季度复盘」配合 `--tcrn-type-family-heading`，在 400 与 600 两个字重下检查）、control（屏蔽 fonts/ 后应回退到系统字体，本机为 Songti SC）。
- 「用什么字体绘制」取自 CDP 的 `CSS.getPlatformFontsForNode`。可变字体报出的 familyName 是默认实例名，例如 Noto Sans SC Thin、Noto Serif SC ExtraLight，所以按前缀匹配。后续门如果复用这个办法，也要按前缀匹配。
- 变异自测做过：给一个字体副本多加一个字节，再删掉一页的 link，copies、pages、network、families 四条腿随即判红。之后已重新构建复原。

## 5. 本包文件集以外需要的改动

1. 根 `package.json` 增加 `fonts:render-proof` 脚本，并接进 verify（问题清单 P4）。
2. `apps/storybook/src/smoke.test.ts` 的画布断言改法见第 3 节（W4-A；问题清单 P1）。
3. 视需要把 backgrounds 改成 Storybook 10 的 `options` 形态（问题清单 P2）。
