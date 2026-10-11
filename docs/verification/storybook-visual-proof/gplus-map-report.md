# storybook-visual-proof · G+ 画布映射逐行报告

由 `node scripts/storybook-visual-proof.mjs --write-report` 生成，勿手改。映射见 `docs/design/gplus-2026-10/storybook-map.md`；同目录其余文件是已退役的旧像素基线，只作历史保留。

- 生成时间（UTC）：2026-10-11T00:55:39.636Z
- HEAD：ab00f44a7bd279a2c2cb1fe8a273bd4c5ee354f9
- 结论：未通过
- 范围：kind matrix / sample；主题 light / dark；语言 en；视口 1440×900
- 阈值：scripts/geometry-measure-proof.mjs THRESHOLDS（八项测量 clip、singleLine、shadowBlur、rail、rowAlign、mark、contrast、controlHeight，另有 overlap）
- 映射：22 行（本次范围 22 行），无 story 25 条，差异 8 条（待 Owner 裁定：DIFF-1、DIFF-2、DIFF-3、DIFF-8）；结构问题 0 条
- 板与分段覆盖：齐（板 10 块；缺板 0，缺分段 0，多余分段 0）
- story 清单对账：不一致（映射引用 10 个，清单 10 个）
  - 映射引用而注册表没有：typography-sample-billing、icon-sample-project、brand-sample-product、actions-sample-project、inputs-sample-members

## 逐行结果

每格是 `浅色 / 夜间` 的状态；pass 通过，FAIL 不通过，n/a 无可测对象（requiredChecks 里的项 n/a 也算不通过）。

| 行 | 板 · 分段 | story | clip | 1line | blur | rail | row | mark | contrast | ctlH | overlap | 格 | 结论 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| typography.A | V2-B1-Typography · A | typography-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | n/a / n/a | pass / pass | FAIL / FAIL | n/a / n/a | pass / pass | — | 不通过 |
| typography.B | V2-B1-Typography · B | typography-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | n/a / n/a | pass / pass | FAIL / FAIL | n/a / n/a | pass / pass | 44/44 / 44/44 | 不通过 |
| typography.D | V2-B1-Typography · D | typography-sample-billing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| icon.A | V2-B1-Icon · A | icon-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | FAIL / FAIL | n/a / n/a | pass / pass | — | 不通过 |
| icon.B | V2-B1-Icon · B | icon-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | FAIL / FAIL | n/a / n/a | pass / pass | 28/28 / 28/28 | 不通过 |
| icon.D | V2-B1-Icon · D | icon-sample-project | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| brand.A | V2-B1-Brand · A | brand-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | pass / FAIL | n/a / n/a | pass / pass | — | 不通过 |
| brand.B | V2-B1-Brand · B | brand-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | pass / FAIL | n/a / n/a | pass / pass | 10/10 / 10/10 | 不通过 |
| brand.D | V2-B1-Brand · D | brand-sample-product | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| actions.A | V2-B1-Actions · A | actions-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | pass / pass | n/a / n/a | FAIL / FAIL | n/a / n/a | pass / pass | — | 不通过 |
| actions.B | V2-B1-Actions · B | actions-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | pass / pass | n/a / n/a | FAIL / FAIL | n/a / n/a | pass / pass | 116/116 / 116/116 | 不通过 |
| actions.D | V2-B1-Actions · D | actions-sample-project | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| inputs.A | V2-B1-Inputs · A | inputs-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | FAIL / FAIL | n/a / n/a | pass / pass | — | 不通过 |
| inputs.B | V2-B1-Inputs · B | inputs-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | FAIL / FAIL | n/a / n/a | pass / pass | 40/42 不符 / 40/42 不符 | 不通过 |
| inputs.D | V2-B1-Inputs · D | inputs-sample-members | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| compositions.1.typography | V2-GPlus-Compositions · 构图一 | typography-sample-billing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| compositions.1.icon | V2-GPlus-Compositions · 构图一 | icon-sample-project | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| compositions.1.brand | V2-GPlus-Compositions · 构图一 | brand-sample-product | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| compositions.1.actions | V2-GPlus-Compositions · 构图一 | actions-sample-project | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| compositions.1.inputs | V2-GPlus-Compositions · 构图一 | inputs-sample-members | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | missing / missing | — | 不通过 |
| logos.A-E | V2-B2-Logos-Draft · A–E | brand-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | pass / FAIL | n/a / n/a | pass / pass | — | 不通过 |
| logos.I | V2-B2-Logos-Draft · I | brand-matrix | pass / pass | pass / pass | pass / pass | n/a / n/a | n/a / n/a | n/a / n/a | pass / FAIL | n/a / n/a | pass / pass | — | 不通过 |

## 不通过的行与原因

### typography.A（typography-matrix）

- 原因：light:contrast；dark:contrast
- light 对比度：2 格偏离，例 sel-l 8.58/16.18（diff）、sel-n 7.23/12.15（diff）
- dark 对比度：22 格偏离，例 h1-l 14.38/18.29（diff）、h2-l 14.38/18.29（diff）、h3-l 14.38/18.29（diff）、h4-l 14.38/18.29（diff）

### typography.B（typography-matrix）

- 原因：light:contrast；dark:contrast
- light 对比度：2 格偏离，例 sel-l 8.58/16.18（diff）、sel-n 7.23/12.15（diff）
- dark 对比度：22 格偏离，例 h1-l 14.38/18.29（diff）、h2-l 14.38/18.29（diff）、h3-l 14.38/18.29（diff）、h4-l 14.38/18.29（diff）

### typography.D（typography-sample-billing）

- 原因：light:story_not_measured；dark:story_not_measured

### icon.A（icon-matrix）

- 原因：light:contrast；dark:contrast
- light 对比度：4 格偏离，例 ink-wash-l 18.29/16.18（diff）、dis-l 18.29/5.1（diff）、ink-wash-n 14.38/12.15（diff）、dis-n 14.38/4.09（diff）
- dark 对比度：15 格偏离，例 roster-l 7.23/8.58（diff）、ink-panel-l 14.38/18.29（diff）、ink2-panel-l 7.23/8.58（diff）、ink3-panel-l 4.59/5.64（diff）

### icon.B（icon-matrix）

- 原因：light:contrast；dark:contrast
- light 对比度：4 格偏离，例 ink-wash-l 18.29/16.18（diff）、dis-l 18.29/5.1（diff）、ink-wash-n 14.38/12.15（diff）、dis-n 14.38/4.09（diff）
- dark 对比度：15 格偏离，例 roster-l 7.23/8.58（diff）、ink-panel-l 14.38/18.29（diff）、ink2-panel-l 7.23/8.58（diff）、ink3-panel-l 4.59/5.64（diff）

### icon.D（icon-sample-project）

- 原因：light:story_not_measured；dark:story_not_measured

### brand.A（brand-matrix）

- 原因：dark:contrast
- dark 对比度：4 格偏离，例 tagline-l 4.59/5.64（diff）、wm-l 14.38/18.29（diff）、suffix-ink-l 14.38/18.29（diff）、rail-wm-l 15.31/15.75（diff）

### brand.B（brand-matrix）

- 原因：dark:contrast
- dark 对比度：4 格偏离，例 tagline-l 4.59/5.64（diff）、wm-l 14.38/18.29（diff）、suffix-ink-l 14.38/18.29（diff）、rail-wm-l 15.31/15.75（diff）

### brand.D（brand-sample-product）

- 原因：light:story_not_measured；dark:story_not_measured

### actions.A（actions-matrix）

- 原因：light:contrast；dark:contrast
- light 对比度：58 格偏离，例 pri-h-l 6.35/7.51（diff）、pri-a-l 6.35/9.43（diff）、pri-x-l 6.35/5.1（diff）、sec-h-l 18.29/17.06（diff）
- dark 对比度：87 格偏离，例 pri-d-l 8.08/6.35（diff）、pri-h-l 8.08/7.51（diff）、pri-a-l 8.08/9.43（diff）、pri-f-l 8.08/6.35（diff）

### actions.B（actions-matrix）

- 原因：light:contrast；dark:contrast
- light 对比度：58 格偏离，例 pri-h-l 6.35/7.51（diff）、pri-a-l 6.35/9.43（diff）、pri-x-l 6.35/5.1（diff）、sec-h-l 18.29/17.06（diff）
- dark 对比度：87 格偏离，例 pri-d-l 8.08/6.35（diff）、pri-h-l 8.08/7.51（diff）、pri-a-l 8.08/9.43（diff）、pri-f-l 8.08/6.35（diff）

### actions.D（actions-sample-project）

- 原因：light:story_not_measured；dark:story_not_measured

### inputs.A（inputs-matrix）

- 原因：light:contrast；dark:contrast
- light 对比度：16 格偏离，例 in-ro-l 18.29/17.06（diff）、in-dis-l 18.29/5.1（diff）、err-msg-l 6.2/6.69（diff）、search-focus-l 16.18/18.29（diff）
- dark 对比度：28 格偏离，例 in-ph-l 4.59/5.64（diff）、in-text-l 14.38/18.29（diff）、in-focus-l 14.38/18.29（diff）、in-ro-l 14.38/17.06（diff）

### inputs.B（inputs-matrix）

- 原因：light:contrast；light:cells；dark:contrast；dark:cells
- light 对比度：16 格偏离，例 in-ro-l 18.29/17.06（diff）、in-dis-l 18.29/5.1（diff）、err-msg-l 6.2/6.69（diff）、search-focus-l 16.18/18.29（diff）
- light 格：渲染 40，期望 42；缺 opt-sel-l、opt-sel-n；多 无；data-expect 与画板不同 0 格
- dark 对比度：28 格偏离，例 in-ph-l 4.59/5.64（diff）、in-text-l 14.38/18.29（diff）、in-focus-l 14.38/18.29（diff）、in-ro-l 14.38/17.06（diff）
- dark 格：渲染 40，期望 42；缺 opt-sel-l、opt-sel-n；多 无；data-expect 与画板不同 0 格

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

### logos.A-E（brand-matrix）

- 原因：dark:contrast
- dark 对比度：4 格偏离，例 tagline-l 4.59/5.64（diff）、wm-l 14.38/18.29（diff）、suffix-ink-l 14.38/18.29（diff）、rail-wm-l 15.31/15.75（diff）

### logos.I（brand-matrix）

- 原因：dark:contrast
- dark 对比度：4 格偏离，例 tagline-l 4.59/5.64（diff）、wm-l 14.38/18.29（diff）、suffix-ink-l 14.38/18.29（diff）、rail-wm-l 15.31/15.75（diff）

## 变异

| 变异 | story | 检查 | 主题 | 结果 |
| --- | --- | --- | --- | --- |
| rail-sample-guide-off-column | typography-sample-billing | rail | — | 未判红（story_missing） |
| clip-actions-button-out-of-section | actions-matrix | clip | light | 判红 |
| single-line-actions-label-first-letter | actions-matrix | singleLine | light | 判红 |
| shadow-blur-brand-logo-cloud | brand-matrix | shadowBlur | light | 判红 |
| row-align-actions-second-row-indented | actions-matrix | rowAlign | light | 判红 |
| mark-typography-padded | typography-matrix | mark | light | 判红 |
| contrast-brand-wordmark-greyed | brand-matrix | contrast | light | 判红 |
| control-height-actions-primary-34 | actions-matrix | controlHeight | light | 判红 |
| overlap-brand-logo-row | brand-matrix | overlap | light | 判红 |

