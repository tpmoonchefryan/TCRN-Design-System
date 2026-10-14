# INIT-016 R4 · 主线程问题清单

| # | 类别 | 现象与证据 | 处置或建议 | 涉及 |
| --- | --- | --- | --- | --- |
| M1 | 库门（Owner） | `gates-config-list` 仍为 0 个门（S-1），引擎拒绝 Story 转 done。 | 不变：Owner 在 Atelier 声明 `verify` 门前只写注解。 | 全部 Story |
| M2 | 批末红的性质 | R4 批末 verify（682fc94）与 R3 相同只剩两步红：`contract:static` 只有 C8 15 条（O-19）；`geometry:measure` 只有 markText（DS 侧栏首行 1.4、底栏 TMS 锁定块 en 1.7，O-4）。主线程逐项核对过日志（`runs/r4/verify/steps.md`）。 | 交判断：确认 R5 无可做返工、建议收口。 | — |
