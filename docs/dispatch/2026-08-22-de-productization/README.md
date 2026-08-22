# DS 去产品化派工载荷

本目录是 `docs/2026-08-22-de-productization-handoff.md` 的执行简报载荷，不是链上第二份 scope，也不表示源码实现已经完成。

已为 8 个 Story 与 4 个 Incident 各生成一份 JSON brief。每份 brief 都携带：

- 红线边界、文件指针、验证命令、链上收口动作、生效证据命令；
- 从 Design System 分区 live `work-show` 回读的完整十区块 `storyScope`；
- `repositoryRoot` 为相对路径，不写入机器绝对路径。

两个 Epic（034、035）作为父级协调范围保留在链上；实际执行载荷落在其 8 个 Story 与 4 个 Incident 子单上。

## 验证

在平台容器内运行：

```bash
cd tcrn-workflow
for brief in ../TCRN-Design-System/docs/dispatch/2026-08-22-de-productization/briefs/*.brief.json; do
  node scripts/dispatch-readiness-compliance.mjs --brief "$brief"
done
```

2026-08-22 的实测结果为 12/12 `DISPATCH_BRIEF_READY`，文件指针检查已启用且 `unjudgedCommands=0`。本次用直接 Node 入口复核；`pnpm --dir tcrn-workflow dispatch:validate` 在本机 Corepack 的 pnpm 版本检查处拒绝，未改动任何 package-manager 声明。

## 边界

本次只完成派工载荷：没有修改链上状态、没有推进任何单到 `done`，没有 push、tag、部署或发布。Story 098/104 的功能命名候选仍按 handoff 保留为 Owner 取舍项；机检、视觉验收、Owner 接受与发布仍是不同证据类。
