# W1-D 交回说明（INIT-015 R1，SUB-024）

## 集外改动（本包未改）

- `package.json`：`doc-shell:proof` 现在只跑脚本，新测试没有接进任何命令。建议改为 `node --test tests/doc-shell-class-proof.test.mjs && node scripts/doc-shell-class-proof.mjs`，与 `ds:consumption:proof` 的写法一致。

## 给 W3（SUB-025/026/027）的用法

- 先 `pnpm build`，再在仓库根跑 `node scripts/doc-shell-class-proof.mjs`。输出里的 `baseline.newSinceBaseline` 和 `baseline.clearedSinceBaseline` 是相对首跑基线的增减，`classMap.unmapped` 列出 map 里没有的新包外类。加 `--details` 会给出每个类的定义、使用与点名位置。
- `--write-baseline` 会改写 `docs/verification/doc-shell-class/baseline.json`。基线是首跑记录，清理期间不要改写；`tests/doc-shell-class-proof.test.mjs` 断言 map 与基线逐类一一对应。
- 处置以 `docs/design/gplus-2026-10/doc-class-map.json` 为准：rename 项的新名写在 `target`；`references` 列出同一提交里要一起改的 proofs/tests。
- 转绿的判据是 `outOfPackageCount` 为 0 且 `templateClassCheck.ok`。`packageEmittedWithoutRule` 只回显、不计数，口径见 `problems/W1-D.md` 第 2 条。

## 可复用的导出

`scripts/doc-shell-class-proof.mjs` 导出：`classListTokens`、`cssSelectorTokens`、`markupClassTokens`、`selectorTokens`、`codeClassOccurrences`、`htmlClassOccurrences`、`packageCssClasses`、`packageEmittedVocabulary`、`computeOutOfPackage`、`templateClassCheck`、`runDocShellClassProof`、`stringifyCompact`，以及 `DEFAULT_PATHS`、`DOC_CLASS_DISPOSITIONS`。
