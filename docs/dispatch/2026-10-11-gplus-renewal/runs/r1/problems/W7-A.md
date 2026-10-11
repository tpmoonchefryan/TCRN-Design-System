# 问题清单 · W7-A（SUB-043 → SUB-044 → SUB-045）

见红只记不修。本包文件集以外的问题只记录，不改。

## 红

**P1 no-private-input-scan 退出 1，唯一命中在本包文件集以外（既有）。**
现象：扫描 541 个文件，命中 1 条 env-assignment：`apps/storybook/src/contract-stories/gplus/matrix-renderer.tsx` 第 88 行 `key={theme}` 独占一行，行首的 `key=` 被不区分大小写的赋值规则判为 `KEY=`。
证据：`logs/r1-W7-A-noprivate-045.log`（派工 scratchpad）；该文件来自 350c488（TCRN-DS-SUB-029）。本包四份新改文件逐条套用同一组规则，均无命中。
建议：批末由 SUB-029 归属方把 `key={theme}` 并到同一行的其他属性之后（不再独占行首），或在扫描器里区分 JSX 属性与环境变量赋值（后者改扫描器口径，需授权）。

## 待定与观察

**P2 CHANGELOG 4.0.0 段与迁移说明里的「Status: candidate…」一段在打 tag 时须改写。**
现象：两处都写明「未打 tag、未发布、未部署」，这是写作时的事实；Owner 打 tag 或发布后它会过期，与 TCRN-DS-INC-007 的漂移同类。版本面门不读这两句。
建议：打 tag 的发布提交（Owner 停点之后）删除或改写这两句，与 v3.0.0 发布提交的做法一致。

**P3 包 README 第二行的「accepted」措辞沿用旧文。**
现象：三份 README 写「Version `4.0.0` is prepared under Apache License 2.0 as part of the accepted TCRN Design System public package baseline.」，只改了版本号。「accepted」指 1.0.0 时验收的公开包基线，不是 4.0.0 的目视验收，但读者可能误读。版本面门只认前半句。
建议：维持现状（与 3.0.0 的先例一致）；Owner 若要改措辞，三份同改，正则不受影响。

**P4 pack:smoke 的打包目录写死在树内。**
现象：`scripts/pack-smoke.mjs` 固定用树内 `.tarball-smoke/`（已 gitignore），跑完自删，无法按派工要求把产物放到 scratch 的 `pack/`。门本身通过，树内没有残留。另用 `pnpm --filter <包> pack --pack-destination` 把 ui-react 与 ui-tokens 打到 scratch `pack/w7-a/` 核对内容：ui-react 的 `@tcrn/ui-copy-state`、`@tcrn/ui-tokens` 依赖解析为 `4.0.0`，无 lucide；ui-tokens 含 52 个 woff2、`fonts/fonts.css`、`FONT-LICENSES.md` 与 5 份 OFL 许可文本。
建议：不改；若要统一，给脚本加输出目录参数（集外，需归属方）。

**P5 回执过期，由 W8-A 重生成。**
现象：三包 `package.json` 改了版本号，internal-alpha 的 package-contract 回执随之过期（W6-A 交回 P11 已列）；scaffold-proof 写出的两份回执与 no-private-input-scan 写出的 `no-overclaim-scan.json` 已按约定还原，未提交。
建议：W8-A（SUB-046）批末统一重生成。

**P6 TMS 一节以采用指南的记载为前提。**
现象：迁移说明的 TMS 一节依据 `docs/tms-adoption-guide.md`「TMS 没有 Design System 依赖」的记载；本包不读兄弟仓库，未核对 TMS 树的现状。文中已写明这一点，并给出「若已接入 3.x 则按 AOS 一节」的分支。
建议：TMS 接入时由 TMS 侧核对。

**P7 弃用通知的两种调用口径不同（W3-A 交回 P6 的延续）。**
现象：包函数 `findDeprecatedTokenUsages` 统计文本里的每一次出现（含旧名的声明）；仓库脚本 `scripts/token-deprecation-notice.mjs` 跳过 token 块与照抄的别名声明。本包在 ui-tokens README 与迁移说明里把两种口径都写明了，没有改代码。
建议：口径对齐或提供 bin 入口归 EPIC-043 后续工单。
