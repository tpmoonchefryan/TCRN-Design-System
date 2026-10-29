# storybook-visual-proof · G+ 画布映射逐行报告

由 `node scripts/storybook-visual-proof.mjs --write-report` 生成，勿手改。映射见 `docs/design/gplus-2026-10/storybook-map.md`；同目录其余文件是已退役的旧像素基线，只作历史保留。

- 生成时间（UTC）：2026-10-29T14:19:50.455Z
- HEAD：c9ccd9719effd1ea399402d293fa6d2514380880
- 结论：未通过（static_docs_missing）
- 范围：kind matrix / sample；主题 light / dark；语言 en；视口 1440×900
- 阈值：scripts/geometry-measure-proof.mjs THRESHOLDS（测量项 clip、singleLine、shadowBlur、rail、rowAlign、mark、contrast、controlHeight、shellFrame，另有 overlap）
- 映射：23 行（本次范围 23 行），无 story 44 条，差异 11 条（待 Owner 裁定：无）；结构问题 0 条
- 板与分段覆盖：齐（板 13 块；缺板 0，缺分段 0，多余分段 0）

## 逐行结果

每格是 `浅色 / 夜间` 的状态；pass 通过，FAIL 不通过，n/a 无可测对象（requiredChecks 里的项 n/a 也算不通过）。

| 行 | 板 · 分段 | story | clip | 1line | blur | rail | row | mark | contrast | ctlH | overlap | frame | 格 | 结论 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| typography.A | V2-B1-Typography · A | typography-matrix | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| typography.B | V2-B1-Typography · B | typography-matrix | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| typography.D | V2-B1-Typography · D | typography-sample-billing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| icon.A | V2-B1-Icon · A | icon-matrix | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| icon.B | V2-B1-Icon · B | icon-matrix | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| icon.D | V2-B1-Icon · D | icon-sample-project | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| brand.A | V2-B1-Brand · A | brand-matrix | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| brand.B | V2-B1-Brand · B | brand-matrix | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| brand.D | V2-B2-Shell-Draft2 · 1 | brand-sample-product | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| actions.A | V2-B1-Actions · A | actions-matrix | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| actions.B | V2-B1-Actions · B | actions-matrix | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| actions.D | V2-B1-Actions · D | actions-sample-project | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| inputs.A | V2-B1-Inputs · A | inputs-matrix | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| inputs.B | V2-B1-Inputs · B | inputs-matrix | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| inputs.D | V2-B1-Inputs · D | inputs-sample-members | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| compositions.1.typography | V2-GPlus-Compositions · 构图一 | typography-sample-billing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| compositions.1.icon | V2-GPlus-Compositions · 构图一 | icon-sample-project | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| compositions.1.brand | V2-GPlus-Compositions · 构图一 | brand-sample-product | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| compositions.1.actions | V2-GPlus-Compositions · 构图一 | actions-sample-project | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| compositions.1.inputs | V2-GPlus-Compositions · 构图一 | inputs-sample-members | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| compositions.3 | V2-GPlus-Compositions · 构图三 | composition-three-sample | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| logos.A-E | V2-B2-Logos-Draft · A–E | brand-matrix | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| logos.I | V2-B2-Logos-Draft · I | brand-matrix | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |

## 不通过的行与原因

### typography.A（typography-matrix）

- 原因：light:story_not_measured；dark:story_not_measured

### typography.B（typography-matrix）

- 原因：light:story_not_measured；dark:story_not_measured

### typography.D（typography-sample-billing）

- 原因：light:story_not_measured；dark:story_not_measured

### icon.A（icon-matrix）

- 原因：light:story_not_measured；dark:story_not_measured

### icon.B（icon-matrix）

- 原因：light:story_not_measured；dark:story_not_measured

### icon.D（icon-sample-project）

- 原因：light:story_not_measured；dark:story_not_measured

### brand.A（brand-matrix）

- 原因：light:story_not_measured；dark:story_not_measured

### brand.B（brand-matrix）

- 原因：light:story_not_measured；dark:story_not_measured

### brand.D（brand-sample-product）

- 原因：light:story_not_measured；dark:story_not_measured

### actions.A（actions-matrix）

- 原因：light:story_not_measured；dark:story_not_measured

### actions.B（actions-matrix）

- 原因：light:story_not_measured；dark:story_not_measured

### actions.D（actions-sample-project）

- 原因：light:story_not_measured；dark:story_not_measured

### inputs.A（inputs-matrix）

- 原因：light:story_not_measured；dark:story_not_measured

### inputs.B（inputs-matrix）

- 原因：light:story_not_measured；dark:story_not_measured

### inputs.D（inputs-sample-members）

- 原因：light:story_not_measured；dark:story_not_measured

### compositions.1.typography（typography-sample-billing）

- 原因：light:story_not_measured；dark:story_not_measured

### compositions.1.icon（icon-sample-project）

- 原因：light:story_not_measured；dark:story_not_measured

### compositions.1.brand（brand-sample-product）

- 原因：light:story_not_measured；dark:story_not_measured

### compositions.1.actions（actions-sample-project）

- 原因：light:story_not_measured；dark:story_not_measured

### compositions.1.inputs（inputs-sample-members）

- 原因：light:story_not_measured；dark:story_not_measured

### compositions.3（composition-three-sample）

- 原因：light:story_not_measured；dark:story_not_measured

### logos.A-E（brand-matrix）

- 原因：light:story_not_measured；dark:story_not_measured

### logos.I（brand-matrix）

- 原因：light:story_not_measured；dark:story_not_measured

## 变异

| 变异 | story | 检查 | 主题 | 结果 |
| --- | --- | --- | --- | --- |

