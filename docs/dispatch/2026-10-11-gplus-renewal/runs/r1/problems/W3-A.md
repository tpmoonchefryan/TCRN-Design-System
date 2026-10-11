# 问题清单 · W3-A（SUB-002 → SUB-003）

只记不修。本包五个局部门全部通过（日志在派工 scratchpad 的 `logs/r1-W3-A-*.log`）。下列条目是门的判定范围以外的事实、集外改动需求和待判定的口径。

| # | 类别 | 事实 | 建议 |
| --- | --- | --- | --- |
| P1 | 观察（判据以外的组合） | 对比度门按 GWT2 只判 bg 与 panel 两种承载面。用同一套算法（画板 `tools/lib.mjs` 的 `cr`）算其他承载面，ink-3 有四处低于 4.5：panel-2 夜间 4.31，bg-2 浅色 4.48，hover 叠在 panel 上夜间 4.19，wash 叠在 panel 上夜间 3.88。ink-2 在 panel-2 与 bg-2 上最低 6.79（panel-2 夜间），ink 在 wash 与 hover 上最低 12.15。 | 组件里是否真有 ink-3 文字落在 panel-2、bg-2、悬停行或选中行上，由 DOM 层每格对比度（SUB-035）和各家族矩阵（SUB-011）判定。若确有，请设计权威决定是加深 ink-3，还是不允许 ink-3 用于这些承载面。本门不扩判据。 |
| P2 | 数据口径（Story 正文） | STORY-120 正文写「text-muted #8a8c93 在白底 3.44」。按画板算法，#8a8c93 于白为 3.36，于 bg 为 2.89。GWT3 的判红不受影响，两对都低于 4.5，门逐条点名。 | 不改 Story 正文，随批末链写注解即可。 |
| P3 | 集外改动（接线） | 两份新测试没有接进任何根脚本。根 `package.json` 的 `tokens:proof` 只跑 `node scripts/token-contrast-proof.mjs` 与 `node --test tests/fonts-proof.test.mjs`。`tests/token-deprecation-notice.test.mjs` 需要 Playwright Chromium，与 `tests/geometry-measure-proof.test.mjs` 相同。 | 由 `package.json` 的负责包在 `tokens:proof` 里加 `node --test tests/token-contrast-proof.test.mjs tests/token-deprecation-notice.test.mjs`。根 package.json 不在本包文件集里，本包没有改。 |
| P4 | 待判定口径（字标承载面） | 门把产品字标后缀当文字判，承载面取 panel 与 bg。画板 F 段只写了「于白」，即 panel。所以 bg 上的两条豁免（design-system 浅色 3.30、tms 夜间 3.33）是按同一裁定从宽登记的。 | 验收若认定字标只落在 panel 上，就从 `wordmarkSuffixPairs` 的承载面里去掉 bg，同时删掉两条 bg 豁免。门会把没有对应字标对的豁免判红，所以两处必须一起改。 |
| P5 | 待 Owner（拆分 P15） | tms 夜间后缀 #2c63c8 于 panel 3.13、于 bg 3.33。两条豁免已登记，引用 D2 与 Brand 板 F 段，并标注夜间值待 Owner 裁定。品牌后缀 token 目前不随主题变化。 | Owner 若改夜间亮色，就在 tokens.json 的 brand 条目加 dark 值并重生成。门按主题读取解析值，无需改代码。届时两条夜间豁免会变成「stale」并判红，提示删除登记。 |
| P6 | 集外改动（消费方调用口径） | 通知脚本在 DS 仓的 `scripts/` 下，不随 `@tcrn/ui-tokens` 发布（包的 files 只有 dist、src/tokens.css、fonts 等）。只装了发布包的消费方，可以直接调用包导出的 `findDeprecatedTokenUsages` 与 `formatDeprecatedTokenNotices`。但包里的 `findDeprecatedTokenUsages` 会把定义也算作使用，例如随项目带的 tokens.css 副本中的别名声明；脚本跳过带 `tcrn-token-block` 标记的块和照抄的别名声明，因此两者的结果不同。 | 由 SUB-043（README）与 EPIC-043 迁移说明写明这两种调用方式。如果要让包函数与脚本口径一致，或者在包里提供 bin 入口，需要改 `packages/ui-tokens/src/index.ts` 或 `packages/ui-tokens/package.json`，两者都不在本包文件集里。 |
| P7 | 观察（文档站自身仍用旧名） | storybook 构建现在会打印弃用通知：32 个旧名，299 处使用，分布在 6 个文件里，即 `alpha-styles.ts`、`story-demo-styles.ts`、`storybook.css`、`contract-stories/story-content.tsx`、`internal-dev/overlay-family-lab/OverlayFamilyLab.tsx`、`smoke.test.ts`。 | 迁移这些文件属于文档层与各家族包（smoke 断言见 W2-A 交回的 P3）。本包只负责打印，不迁移。通知不阻断构建。 |
| P8 | 口径说明（对比度算法） | 新门复用画板的 `cr`：先做 alpha 合成，sRGB 线性化阈值取 0.03928（WCAG 2.1 正文的写法）。旧门用的是 0.04045。8 位不透明色的通道值不会落在两个阈值之间，所以结果完全相同。合成色的差别小于第二位小数。 | 无需处理。采用同一算法，门打印的比值就与画板 data-expect 一致（拆分 P6 数据层的口径）。 |
