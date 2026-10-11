# 交回说明 · W5-C（作用域前置修复 → SUB-028 → SUB-035）

## 已交付

- 作用域前置修复（挂 SUB-035）：`apps/storybook/src/build/page-template.tsx` 改为扫描式作用域改写。选择器表只在顶层逗号处拆分，括号、方括号和字符串里的逗号不拆；一行可以有多条规则；@media、@supports、@container、@layer、@scope、@starting-style、@document 的块内照常加作用域；@keyframes 等其它 at 规则和语句原样复制。导出 `scopeComponentCss`、`splitTopLevelSelectors`。测量库新增 `before-bg` 探针，只做加法，用于 Switch 的钮。三条作用域单测与一条探针单测在 `tests/geometry-measure-proof.test.mjs`；作用域单测按浏览器解析的规则数锁定：包 CSS 的每条规则（含全部状态规则）都要留在作用域副本里，且都带作用域。
- 修复前后，浅色页上的矩阵状态格偏离由 76 降为 0。全部 238 个对比格中，修复前偏离 80 个（其中 76 个是状态格），修复后只剩 inputs 的 err-msg 两格（见 problems P2）；Switch 钮两格在加了 before-bg 探针后吻合。
- SUB-028：`scripts/doc-sample-style-proof.mjs` 与 `tests/doc-sample-style-proof.test.mjs`（6 条）。
- SUB-035：`scripts/geometry-measure-proof.mjs` 完成接入，`tests/geometry-measure-proof.test.mjs` 共 60 条，报告写在 `docs/verification/geometry-measure/report.json`。

## 两门的接口与口径

- doc-sample-style-proof：运行 `node scripts/doc-sample-style-proof.mjs [--story <id>]... [--theme light|dark]... [--strict]`，只打印 JSON，不写报告；不 ok 时退出码为 1。
  - 参照样本：五个矩阵 story 两块里的第一批 23 件。签名由三部分组成：标签与第一批类；包 CSS 选择器里出现的 aria-* 或 data-* 状态，以及表单伪类；最近的第一批祖先的签名。样本按自身的主题取浅色块或夜间块作参照。
  - 比较内容：字族与字号等字体属性、颜色、背景、边框、阴影、圆角，以及控件与图标的高度。
  - 每处偏离都会再读两次：一次去掉文档层规则（保留随文档样式表带入的 token 块），一次再去掉内联样式；据此把原因归为 doc-stylesheet、story-inline-style 或 package-context。前两类原因判红。
  - 读值前先关闭过渡与动画，避免读到过渡中途的颜色。
  - 每次运行都带一条文档层变异（MUTATIONS），必须被抓到。
- geometry-measure-proof：运行 `node scripts/geometry-measure-proof.mjs [--story <id>]... [--family <名>] [--write-report]`。
  - 测量集合：GPLUS_STORY_IDS，加上注册表中 gplus-* 类目下的其它 story。
  - `--family`：只跑该家族的矩阵与样板，变异也只跑落在这些 story 上的。
  - REQUIRED_CHECKS：十个 id 都有清单，矩阵按实测写，样板至少要有五项。
  - 全量运行另加集合级要求：九项检查都必须在某个 story 上适用。
  - STORY_MUTATIONS 共四条：GWT1 rowAlign（table-record-index-spec）、GWT2 mark、GWT3 shadowBlur 模糊 4px，再加一条对比度。
  - STORY_PROBES 共三条（decomposition P31）：ButtonGroup 焦点环不被裁切；DatePicker 输入框右侧 30px 是原生 calendar 指示器，且点击能到达输入框；Highlight 与纯文本同宽。
  - 报告按项保留数值，对比格写成 `[cell, ratio, expect, diff]`。

## 本包树上的结果

- geometry-measure-proof 判红，原因如下：
  - 五个样板缺席（W5-A）；
  - rail 与 controlHeight 在全量运行中从未适用；
  - dark 运行中，浅色块继承夜间 token（problems P1，W4-A 问题 2）；
  - inputs 的 err-msg 两格（P2）。
- geometry-measure-proof 判绿的部分：
  - 夹具自检；
  - 四条变异全部判红（即被抓到），三条探针全部通过；
  - 浅色运行中，typography、icon、brand、actions 四个矩阵的八项全绿。
- doc-sample-style-proof 判红：icons-motion 有 72 处文档层覆盖（P4）。另有 82 处包内上下文差异只列为发现（P5、P7），688 个样本未覆盖（P6）；那条变异已被抓到。

## 集外改动

1. 根 `package.json`：
   - 新增 `"geometry-measure:proof": "node --test tests/geometry-measure-proof.test.mjs && node scripts/geometry-measure-proof.mjs"`；
   - 新增 `"doc-sample-style:proof": "node --test tests/doc-sample-style-proof.test.mjs && node scripts/doc-sample-style-proof.mjs"`；
   - 把两条脚本放进 verify，位置在 `storybook:smoke` 之后。
   - 建议 verify 不带 `--write-report`，报告由批末显式重生成。两门目前都红，见 problems P11。
2. ui-tokens / `styles/base.css.ts`：补 `[data-tcrn-theme="light"]` 主题块（P1）。
3. 文档层（story-demo-styles.ts、storybook.css）：去掉 `.tcrn-doc-icon-sample svg[data-icon-name]` 的尺寸与颜色覆盖（P4）。

## 未做完

无接续点。批末待办：W5-A 合并后重跑全量 geometry-measure-proof，判定 GWT4 的样板部分，并用 `--write-report` 重生成报告；按 P8 移动 GWT1 变异；P7 的判据口径请批末确认。
