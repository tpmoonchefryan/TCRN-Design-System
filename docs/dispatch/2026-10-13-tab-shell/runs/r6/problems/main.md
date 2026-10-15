# INIT-016 R6 · 主线程问题清单

主线程在调度、合入、跑门与跨包协调中记下的事实；见红只记，批末由判断一次处置。同一根因算一条。

| # | 类别 | 现象与证据 | 处置或建议 | 涉及 |
| --- | --- | --- | --- | --- |
| M1 | 门配置 | 按 Owner 2026-10-16 授权配置门（纪要 TCRN-DS-MIN-20261016-GATES D1–D3）：`verify` 收为 covers `**` 的必需门（order 1），新声明非必需门 `storybook-build`（order 2）与 `test-dom`（order 3），INIT-015 附 `storybook-build`，INIT-016 附两道；本机登记补 projectId。`gates-config-list` 读回 3 道；`work-show` 读回 Story 120 的 effectiveGates 为 storybook-build（另有必需门 verify），Story 146 为 storybook-build 与 test-dom；`gates-plan --base 69aa195 --work-id <12 张>` 选中 verify（required）与 storybook-build（work-field），unknownGates 为空。 | 无残留。 | 全部 Story |
| M2 | INIT-015 跑门红 | main@69aa195 上 `gates-run --base 69aa195 --work-id <INIT-015 的 12 张>`（运行 20261015T194045Z-3b858b79aa07）：storybook-build 绿，verify 红；verify 输出超 1 MiB 被引擎截断，看不到红在哪一步。主线程在主检出逐步复跑（会话 scratch `main-verify/`）：30 步只有第 19 步 `storybook:visual-proof` 红，两段都红在「每块画布板与每个字母节都有映射条目」——`V2-B2-Shell-Draft.dc.html`、`V2-B2-Shell-Draft2.dc.html`、`V2-B2-Shell-Draft2-b.dc.html` 三块草案板没有映射条目。三块板是 INIT-016 开单提交 d910ccb 带进 main 的，候选分支在 R1–R5 已补映射（R5 批末这一步绿）。复跑后已把主检出收干净（no-overclaim 回执还原、visual-selection-result.json 移到 scratch trash），`git status --short` 为空。 | INIT-015 的 12 张不在 main@69aa195 上单独转：等 INIT-016 候选合入 main 后，与 INIT-016 的 16 张在同一次 `gates-run --work-id <28 张>` 里跑门，一个 work-batch 一起转 done。收口文件写明。 | INIT-015 的 12 张 |
| M3 | 门日志截断 | 引擎每道门的输出上限 1 MiB（`GATE_RUN_DEFAULT_OUTPUT_BYTES`），`verify` 的输出远超上限，截断后红的那一步看不到。 | 记为观察，交引擎；本 INIT 用逐步复跑脚本定位。 | 门运行 |
