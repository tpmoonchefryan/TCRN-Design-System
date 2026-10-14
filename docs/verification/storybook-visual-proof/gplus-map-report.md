# storybook-visual-proof · G+ 画布映射逐行报告

由 `node scripts/storybook-visual-proof.mjs --write-report` 生成，勿手改。映射见 `docs/design/gplus-2026-10/storybook-map.md`；同目录其余文件是已退役的旧像素基线，只作历史保留。

- 生成时间（UTC）：2026-10-14T02:02:09.976Z
- HEAD：fe8578f00d37a648e7263339b32ca91e1e20b4ee
- 结论：未通过
- 范围：kind matrix / sample；主题 light / dark；语言 en；视口 1440×900
- 阈值：scripts/geometry-measure-proof.mjs THRESHOLDS（测量项 clip、singleLine、shadowBlur、rail、rowAlign、mark、contrast、controlHeight、shellFrame，另有 overlap）
- 映射：23 行（本次范围 23 行），无 story 44 条，差异 11 条（待 Owner 裁定：无）；结构问题 0 条
- 板与分段覆盖：齐（板 13 块；缺板 0，缺分段 0，多余分段 0）
- story 清单对账：一致（映射引用 11 个，清单 11 个）

## 逐行结果

每格是 `浅色 / 夜间` 的状态；pass 通过，FAIL 不通过，n/a 无可测对象（requiredChecks 里的项 n/a 也算不通过）。

| 行 | 板 · 分段 | story | clip | 1line | blur | rail | row | mark | contrast | ctlH | overlap | frame | 格 | 结论 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| typography.A | V2-B1-Typography · A | typography-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | n/a / n/a | pass / pass | pass / pass | n/a / n/a | pass / pass | n/a / n/a | — | 通过 |
| typography.B | V2-B1-Typography · B | typography-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | n/a / n/a | pass / pass | pass / pass | n/a / n/a | pass / pass | n/a / n/a | 44/44 / 44/44 | 通过 |
| typography.D | V2-B1-Typography · D | typography-sample-billing | pass / pass | pass / pass | pass / pass | n/a / n/a | pass / pass | pass / pass | n/a / n/a | n/a / n/a | FAIL / FAIL | pass / pass | — | 不通过 |
| icon.A | V2-B1-Icon · A | icon-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | pass / pass | n/a / n/a | pass / pass | n/a / n/a | — | 通过 |
| icon.B | V2-B1-Icon · B | icon-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | pass / pass | n/a / n/a | pass / pass | n/a / n/a | 28/28 / 28/28 | 通过 |
| icon.D | V2-B1-Icon · D | icon-sample-project | pass / pass | pass / pass | pass / pass | n/a / n/a | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | pass / pass | pass / pass | — | 通过 |
| brand.A | V2-B1-Brand · A | brand-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | pass / pass | n/a / n/a | pass / pass | n/a / n/a | — | 通过 |
| brand.B | V2-B1-Brand · B | brand-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | pass / pass | n/a / n/a | pass / pass | n/a / n/a | 10/10 / 10/10 | 通过 |
| brand.D | V2-B2-Shell-Draft2 · 1 | brand-sample-product | pass / pass | pass / pass | pass / pass | n/a / n/a | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | pass / pass | pass / pass | — | 通过 |
| actions.A | V2-B1-Actions · A | actions-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | pass / pass | n/a / n/a | pass / pass | pass / pass | pass / pass | n/a / n/a | — | 通过 |
| actions.B | V2-B1-Actions · B | actions-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | pass / pass | n/a / n/a | pass / pass | pass / pass | pass / pass | n/a / n/a | 116/116 / 116/116 | 通过 |
| actions.D | V2-B1-Actions · D | actions-sample-project | pass / pass | pass / pass | pass / pass | n/a / n/a | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | pass / pass | pass / pass | — | 通过 |
| inputs.A | V2-B1-Inputs · A | inputs-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | pass / pass | pass / pass | pass / pass | n/a / n/a | — | 通过 |
| inputs.B | V2-B1-Inputs · B | inputs-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | pass / pass | pass / pass | pass / pass | n/a / n/a | 42/42 / 42/42 | 通过 |
| inputs.D | V2-B1-Inputs · D | inputs-sample-members | pass / pass | pass / pass | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | n/a / n/a | n/a / n/a | FAIL / FAIL | pass / pass | — | 不通过 |
| compositions.1.typography | V2-GPlus-Compositions · 构图一 | typography-sample-billing | pass / pass | pass / pass | pass / pass | n/a / n/a | pass / pass | pass / pass | n/a / n/a | n/a / n/a | FAIL / FAIL | pass / pass | — | 不通过 |
| compositions.1.icon | V2-GPlus-Compositions · 构图一 | icon-sample-project | pass / pass | pass / pass | pass / pass | n/a / n/a | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | pass / pass | pass / pass | — | 通过 |
| compositions.1.brand | V2-GPlus-Compositions · 构图一 | brand-sample-product | pass / pass | pass / pass | pass / pass | n/a / n/a | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | pass / pass | pass / pass | — | 通过 |
| compositions.1.actions | V2-GPlus-Compositions · 构图一 | actions-sample-project | pass / pass | pass / pass | pass / pass | n/a / n/a | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | pass / pass | pass / pass | — | 通过 |
| compositions.1.inputs | V2-GPlus-Compositions · 构图一 | inputs-sample-members | pass / pass | pass / pass | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | n/a / n/a | n/a / n/a | FAIL / FAIL | pass / pass | — | 不通过 |
| compositions.3 | V2-GPlus-Compositions · 构图三 | composition-three-sample | pass / pass | pass / pass | pass / pass | n/a / n/a | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | pass / pass | pass / pass | — | 通过 |
| logos.A-E | V2-B2-Logos-Draft · A–E | brand-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | pass / pass | n/a / n/a | pass / pass | n/a / n/a | — | 通过 |
| logos.I | V2-B2-Logos-Draft · I | brand-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | pass / pass | n/a / n/a | pass / pass | n/a / n/a | — | 通过 |

## 不通过的行与原因

### typography.D（typography-sample-billing）

- 原因：light:overlap；dark:overlap

### inputs.D（inputs-sample-members）

- 原因：light:overlap；dark:overlap

### compositions.1.typography（typography-sample-billing）

- 原因：light:overlap；dark:overlap

### compositions.1.inputs（inputs-sample-members）

- 原因：light:overlap；dark:overlap

## 变异

| 变异 | story | 检查 | 主题 | 结果 |
| --- | --- | --- | --- | --- |
| clip-actions-button-out-of-section | actions-matrix | clip | light | 判红 |
| single-line-actions-label-first-letter | actions-matrix | singleLine | light | 判红 |
| shadow-blur-brand-logo-cloud | brand-matrix | shadowBlur | light | 判红 |
| row-align-actions-second-row-indented | actions-matrix | rowAlign | light | 判红 |
| mark-typography-padded | typography-matrix | mark | light | 判红 |
| contrast-brand-wordmark-greyed | brand-matrix | contrast | light | 判红 |
| control-height-actions-primary-34 | actions-matrix | controlHeight | light | 判红 |
| overlap-brand-logo-row | brand-matrix | overlap | light | 判红 |
| shell-frame-sample-paper-flush | actions-sample-project | shellFrame | light | 判红 |

