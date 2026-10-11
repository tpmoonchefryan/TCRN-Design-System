# 交回说明 · W7-A（SUB-043 → SUB-044 → SUB-045）

三张 Subtask 都已完成，没有接续点。问题见 `runs/r1/problems/W7-A.md`。本文写给 W8-A、批末全量与收口。

## 已交付

- SUB-043（e651619）：三包 `package.json` 与 README 版本行、`docs/tms-adoption-guide.md` 的版本句都是 4.0.0。`CHANGELOG.md` 的 `## Unreleased` 改为 `## 4.0.0`（与 v3.0.0 发布提交同样做法），v3.0.0 之后写下的三条既有条目随之归入 4.0.0；新增的 G+ 条目排在段首，写明 G+ 底盘、随包字体与 OFL、第一批五家族、四枚产品标、Storybook 只渲染包、新门与破坏性清单，并写明未打 tag、未发布、未部署。ui-tokens README 补了 fonts.css 引入、三块结构、焦点环重声明、弃用名与两种列出方式；ui-react README 加了迁移说明指针；采用指南补了字体引入、G+ 状态色名与包内 TMS 标。
- SUB-044（38da581）：`docs/migration-4.0.md`。先按 AOS（10 步）、TMS（6 步）、Einzbern 门户（6 步）列做法，再逐条写 M1–M17 的变化、做法与来源（提交、Subtask、包交回），附 51 行弃用名表与仍待 Owner 裁定、可能再动数值的 4 项。
- SUB-045（616f62b）：`docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md`。按 canvas.json 的 10 块板逐板一节（8 块有目视项，V2-Families 与 V2-Rejections 写明无渲染面），每节列两轨 story id、映射行、浅色与夜间两栏待勾的核对项、DIFF 编号与机器证据路径；单列 9 条待 Owner 裁定（每条带现状、来源与建议）、3 条待知悉，以及四个停点。

## 给 W8-A 与批末

1. 回执：三包 `package.json` 改了版本，internal-alpha 的 package-contract 回执过期（W6-A P11）。本包跑过的 scaffold-proof、no-private-input-scan 写出的回执都已还原。
2. 版本面：`docs/verification/scaffold-proof.*` 里的 1.0.0 是冻结的基线观测，不要改成 4.0.0（version-surface-proof 断言它保留「frozen」标签）。
3. no-private-input-scan 在当前树上退出 1，唯一命中是 `matrix-renderer.tsx:88` 的 `key={theme}`（problems P1），批末与 SUB-029 归属方一并处置。
4. 打 tag（Owner 停点）时，CHANGELOG 4.0.0 段与迁移说明的「Status」句要改写（problems P2）。
5. `tcrn-design-authority.json` 的版本取自 ui-tokens 的 package.json，下一次静态构建会写出 4.0.0；线上文件要到部署（Owner 停点）后才变。

## 局部门（包树根执行，日志在派工 scratchpad 的 `logs/`）

| 门 | 结果 | 日志 |
| --- | --- | --- |
| version-surface-proof | 通过，7 项读回均为 4.0.0 | `r1-W7-A-final-version-surface-proof.log` |
| changelog-release-sections-proof | 通过，pendingSections 为 4.0.0，无发现 | `r1-W7-A-final-changelog-release-sections-proof.log` |
| scaffold-proof | 通过（回执已还原） | `r1-W7-A-final-scaffold-proof.log` |
| pack:smoke | 通过，三包 tarball 均为 4.0.0 | `r1-W7-A-final-pack-smoke.log` |
| no-private-input-scan | 退出 1，唯一命中在集外既有文件（P1）；本包文件无命中 | `r1-W7-A-noprivate-045.log` |

## 集外改动需求

1. `apps/storybook/src/contract-stories/gplus/matrix-renderer.tsx:88`：让 `key=` 不再独占行首（problems P1）。
2. 打 tag 的发布提交：改写 CHANGELOG 与迁移说明里的「Status」句（problems P2）。

## 未做完

无。
