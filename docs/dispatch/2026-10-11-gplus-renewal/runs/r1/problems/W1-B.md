# INIT-015 R1 · W1-B（SUB-010）问题清单

每条：现象、证据、建议处置。见红只记不修；本包没有改动集外文件。行号以包分支自 6a35a29 切出时为准。

## 集外需要的改动

**P1 doc-shell-class-proof 仍把 Navigation.tsx 当样式源。**
现象：`scripts/doc-shell-class-proof.mjs` 第 8–14 行把 `packages/ui-react/src/components/Navigation/Navigation.tsx` 的全文当作样式文本，检查 page-template 用到的每个类都有定义。SUB-010 之后该文件只剩再导出，只在 `tcrnComponentCss` 里定义的类会被报缺失，verify 的 `doc-shell:proof` 预计转红（本包按约定没有跑这条门）。
证据：跨包约定第 8 条（doc-shell-class 改为从 `packages/ui-react/dist/index.js` 导入 `tcrnComponentCss`）；该文件不在本包独占文件集。
建议：由负责 doc-shell-class 的 Subtask 按约定第 8 条改为读 dist；若该 Subtask 晚于集成，批末门会先见红，同一根因记一条。

**P2 s254-component-contract-proof 用正则从 Navigation.tsx 抽模板。**
现象：`scripts/s254-component-contract-proof.mjs` 第 5、26–28 行匹配 ``export const tcrnComponentCss = `…`;``，迁移后匹配为空，八个构件的 CSS 检查会全部失败。
证据：仓内没有脚本或 package.json 条目调用它，不在 verify 链上。
建议：改用 `scripts/lib/component-css-sources.mjs` 的 `componentCssText()`，或从 dist 导入；也可以作为退役脚本处理。归 W8 收尾或主线程指派。

**P3 两处文档仍写样式表在 Navigation.tsx。**
现象：`docs/style-scale.md` 第 63 行说包组件样式写在 `packages/ui-react/src/components/Navigation/Navigation.tsx`。拆分文件与问题清单里引用的 Navigation.tsx 行号（如 problems/decomposition.md P1 的第 2502–2516 行）现在落在 `styles/*.css.ts`。
证据：本包已改 `apps/storybook/README.md`；`docs/style-scale.md` 不在本包文件集。旧行号到段的对照见 handoff/W1-B.md。
建议：由 W8-A 或下一次碰该文档的包把位置改为 `packages/ui-react/src/styles/`。

## 记录，不阻塞

**P4 跨家族条目实测数与拆分估计不同。**
现象：拆分写「约 16 条跨家族选择器列表与 1 个混合 reduced-motion @media」，按判据的主语规则实测为 10 条选择器列表与 3 个混合 at-rule 块（两个 `prefers-reduced-motion: reduce`、一个 `max-width: 760px`，后者含一条品牌规则）。
证据：判据写明以拆分时实测为准。归属规则：主语取最右复合选择器，没有 tcrn 类时向左取最近带 tcrn 类的复合；一个复合含两个组件类时归最后一个（`.tcrn-button.tcrn-shell-theme-toggle` 归 base）；块名按「等于家族名或以家族名加连字符开头」匹配，长名优先（`icon-button` 归 actions，`number-input`、`date-picker`、`radio-group`、`multi-select-*`、`field-provenance` 归 inputs，`highlight-*` 归 typography，`brand-*`、`shell-brand-lockup` 归 brand，`.tcrn-link` 与 keyframes 归 base）。
建议：无需处置；验收按「规范化规则序列相同」核对即可。

**P5 tcrnComponentCss 的声明类型从字面量变为 string。**
现象：迁移前 dist 的 `Navigation.d.ts` 把它声明为一个约 124 KB 的字符串字面量类型；现在 `styles/index.d.ts` 声明为 `string`，值不变。
证据：`styles/index.ts` 用 `[…].join("")` 拼接并显式标注 `string`。保留字面量类型要用 `as const` 模板串，家族包一旦把某段改成非字面量（例如拼入生成段），公开类型会变成带 `${string}` 的模式类型。
建议：接受。若验收认为公开类型不得变化，再议。

**P6 拆开的选择器列表在旧浏览器上的差异。**
现象：原第 2290–2295 行的列表混有 `:focus-visible` 与 `:focus-within`；不支持 `:focus-visible` 的浏览器（Safari 15.4 以前）原本会丢弃整条规则，拆开后只丢 `:focus-visible` 那条，`.tcrn-product-shell .tcrn-search-input:focus-within { box-shadow: none; }` 会生效。其余拆开的列表只含所有浏览器都支持的选择器。
证据：Chromium CSSOM 重新解析前后两份字符串，974 条单选择器条目逐条相同。
建议：无需处置。

**P7 icon 家族现在没有任何规则。**
现象：样式表里没有主语为 `.tcrn-icon` 的规则，`styles/icon.css.ts` 只导出空的落点段 `iconCss01`，在 `styles/index.ts` 里位于 root 自定义属性之后、第一条 actions 规则之前。
建议：icon 家族包把规则写进 `iconCss01`（可拼入生成段），不必改 `styles/index.ts`。

**P8 依赖 tcrnComponentCss 字节的派生物会变。**
现象：拆分让字符串多出 1610 个字符（重复的声明块），所以 `apps/storybook/src/build/design-authority.ts` 的 `componentCssDigest`、静态文档内联的 CSS、`internal-alpha-browser-proof` 的输入摘要都会变（本包把 `styles/` 各模块加进了输入摘要）。
证据：仓内没有任何文件固定 `componentCssDigest` 的值；视觉基线与摘要的重选归 SUB-046（verify 影响表 24b）。
建议：W8 按计划重选基线时一并处理。
