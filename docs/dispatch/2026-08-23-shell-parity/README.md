# 文档外壳与包件一致性的派工载荷

本目录是 `docs/2026-08-23-shell-parity-handoff.md` 的执行简报载荷，
不是链上第二份 scope，也不表示源码实现已经完成。

| 单 | 方向 | 项数 |
| --- | --- | --- |
| `TCRN-DS-INC-016` | 改包件 | 2 |
| `TCRN-DS-INC-017` | 改文档外壳 | 7 |
| `TCRN-DS-INC-018` | 立门 | —— |

016 与 017 可并行；**018 要先红一次**（九处分叉尚在），再由前两条修绿。

## 全量比对的边界

十五个角色，四处完全一致（含选中态，两侧皆为 `rgba(28,29,33,0.06)` + 700 且边框透明 ——
`INIT-013` 的「着墨」裁定正确传导，**不要动它**），九处分叉。
比对结果写在 handoff 第一节，附实测取值，不必重跑。

## 验证

```bash
cd tcrn-workflow
for brief in ../TCRN-Design-System/docs/dispatch/2026-08-23-shell-parity/briefs/*.brief.json; do
  node scripts/dispatch-readiness-compliance.mjs --brief "$brief"
done
```

3/3 `DISPATCH_BRIEF_READY`。

## 边界

只是派工载荷：没有修改链上状态、没有推进任何单到 `done`，没有 push、tag、部署或发布。
三条都改观感或看着观感，止于 `pending-owner-acceptance`。
