# M11 附录（主线程补派，R3）

1. **迁移条目补录。** M9 与 M10 同波并行，M9 交回第 7 节的迁移条目（AI 消费契约按顶带壳改写：oracle `shellMetrics` 新字段与旧名同值保留一版，契约字段 `fullMenu`、`topBandNavigation`、控件顺序、`governedPreferences` 的变化，AOS 两份视觉实例的变体退役与改名）没有进 M10 追加的 M38–M46。按交回原文在 `docs/migration-4.0.md` 从 **M47** 起追加，并在 `CHANGELOG.md` 的 4.0.0 摘要里列一行；两份文件只追加，不改已有条目。这两个文件本轮其余包都已合入，现归你。条目原文在集成树 `docs/dispatch/2026-10-13-tab-shell/runs/r3/handoff/M9.md` 第 58–66 行（第 6、7 节），契约字段细节在同文件第 4 节。
2. **视觉签名重收的前提已具备。** M9 交回：browser-proof 除视觉签名 199 条越容差外其余全绿（zh-CN 泄漏 0、故事高度预算通过、axe landmark-unique 0、禁用项读回 3 个样本）。重收照 SUB-211 判据做：逐条列变化、只收换壳与换样板带来的变化，预期外的停下记问题、不接受。M9 交回第 8 节与第 10 节、M7 与 M3 交回的「目视项」节列了本轮改过渲染的页，写进 `owner-acceptance.md` 的目视清单。
