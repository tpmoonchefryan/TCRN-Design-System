# 问题清单 · W1-A（SUB-008 → SUB-009）

只记不修。局部门全部通过；以下是实施中发现、留给后续处置的事项。

| # | 类别 | 事实 | 建议 |
| --- | --- | --- | --- |
| P1 | 画板既有偏差（未改板） | Actions 板 B 段矩阵的 fill / ink 标签由 `lbl()` 按值反查 token 名，取第一个同值键：浅色 primary 各行的 ink 显示为 `panel`（实为 on-acc，同为 #ffffff），ink 在两种主题都显示为 `rule`（与 ink 同值）。对比度数值无误；标签与 pairs.json 的 token 名不一致。为保持逐字节一致，本包保留原行为。 | 下一次画板修订时改为按 pairs.json 的 token 名标注；属画板字节变化，需随画布重发一并处理。 |
| P2 | 设计数据 | secondary 与 danger 的默认 edge 为 `0 1px 1px rgba(22,21,15,.04),0 0 0 1px var(--line-ctl)`：抬升层是浅色墨的字面量，夜间同样使用，几乎不可见。pairs.json 与生成的变体声明照录此字面量（只在变体声明里，状态规则不含颜色）。 | 由设计权威决定是否改为 token（例如复用 s1 的第一层）；改契约后重生成即可。 |
| P3 | 设计数据 | 产品后缀色 `--tcrn-brand-suffix-*` 取 marks.json 的 palette.deep，主题无关（与 logos2 板一致）。作文字时对比度：tms #2c63c8 于白 5.64 / 于夜间纸 #191916 3.13；design-system #6577f3 3.83 / 4.60；einzbern #3b5272 7.97 / 2.21；mana-orchestrate #3a9a63 3.51 / 5.02。einzbern 与 mana-orchestrate 的字标没有后缀，变量按跨包约定保留。 | SUB-001 与品牌板复核夜间是否需要另一档值；需要时在 tokens.json 的 brand 条目加 dark 值并重生成。 |
| P4 | 选择器约定 | pairs.json 的包内选择器按现有 Form.tsx 标记取：`.tcrn-input`、`.tcrn-select`、`.tcrn-input.tcrn-search-input__control`（search，0,2,0）、`.tcrn-checkbox`、`.tcrn-radio-group__control`、`.tcrn-switch__control`；Actions 为 `.tcrn-button.tcrn-button--<变体>` 与 `.tcrn-link-button.tcrn-link-button--<变体>`（LinkButton 无 danger）。单变体表的默认声明挂在 base 上（0,1,0），只有 modifier 变体是 0,2,0。 | Inputs / Actions 家族包如改标记，改 pairs.json 的 targets 后重生成；家族基础规则只读 `--tcrn-pair-*`，不要再声明它们。 |
| P5 | 类名约定 | typography.json 的包内类名为本包所定：`tcrn-heading--1…4`、`tcrn-text--body|reading|meta|caption|strong|numeral|caps|mono`、`tcrn-text--numeral-inline|numeral-large`、`tcrn-link`、`tcrn-highlight__mark`。现包只有 `tcrn-heading--1/2` 与 `tcrn-text`。 | Typography 家族包如需别的类名，改 typography.json 后重生成。 |
| P6 | 变量名约定 | tokens.json 沿用现有变量名但换值的项：`--tcrn-type-family-ui`（sans 字栈）、`--tcrn-type-family-mono`、`--tcrn-radius-control`（4px → 8px）、`--tcrn-radius-panel`（6px → 12px）、`--tcrn-type-size-control`（13px 不变）。新增：`--tcrn-type-family-serif`、`--tcrn-radius-small|check|stamp`、`--tcrn-control-height-*`、`--tcrn-control-padding-*`、`--tcrn-type-size-control-sm|lg`、`--tcrn-icon-size-*`、`--tcrn-motion-ease`、`--tcrn-motion-duration-fill|press|move|loop`、`--tcrn-grain-opacity`、`--tcrn-grain-blend`。 | SUB-001 写 tokens.css 时据此处理旧值的影响面。 |
| P7 | 读取约束 | `contract/matrices.json` 约 41 KB，超过 32 KB 读取守卫。 | 读它按行号范围读，或经 data.mjs / 生成的 matrices.generated.ts 读。 |
| P8 | 构建产物 | `pnpm run typecheck`（tsc -b）在包树里写了已被 gitignore 的 `*/dist/` 与 `tsconfig.tsbuildinfo`。 | 属可重建产物，留给后续门复用；不需要时随包树一并清理。 |
