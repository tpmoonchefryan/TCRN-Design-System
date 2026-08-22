# 批次后三条 Incident 的派工载荷

本目录是 `docs/2026-08-22-post-batch-incidents-handoff.md` 的执行简报载荷，
不是链上第二份 scope，也不表示源码实现已经完成。

三份 brief 各自携带红线边界、文件指针、验证命令、链上收口动作、生效证据命令，
以及从对应分区 live 链回读的完整 scope。

| 单 | 仓 | 缓急 |
| --- | --- | --- |
| `TCRN-AOS-INC-053` | TCRN-AOS | 最急，挡着 AOS 换包 |
| `TCRN-DS-INC-015` | TCRN-Design-System | 次之 |
| `TCRN-DS-INC-014` | TCRN-Design-System | 不急，防下一次 |

`TCRN-AOS-INC-053` 的 brief 放在本仓，是因为它由本仓的导出移除引起 —— 交接书与病因同处。
其 `repositoryRoot` 指向 `../TCRN-AOS`，文件指针在那一侧解析。

## 验证

```bash
cd tcrn-workflow
for brief in ../TCRN-Design-System/docs/dispatch/2026-08-22-post-batch-incidents/briefs/*.brief.json; do
  node scripts/dispatch-readiness-compliance.mjs --brief "$brief"
done
```

2026-08-22 实测 3/3 `DISPATCH_BRIEF_READY`。**验证器本身经过变异测试**：
文件指针指向不存在的文件、红线边界抽空、scope 掏空，三种注入均判红 ——
所以这 3/3 不是「检查没执行」。

## 边界

本目录只是派工载荷：没有修改链上状态、没有推进任何单到 `done`，没有 push、tag、部署或发布。
`TCRN-DS-INC-015` 的缺陷一**根因未确认**，handoff 第二节列出了已排除项与剩余方向 ——
查明之前不要动手改。
