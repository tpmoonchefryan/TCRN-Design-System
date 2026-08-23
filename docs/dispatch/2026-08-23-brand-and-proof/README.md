# 2026-08-23 品牌区与证物可复现性派工

Owner 于 2026-08-23 就三处发现裁「都开,然后给 codex 派工」。三条 Incident 已落 TCRN-Design-System 分区链,各自 rev 2 携十块正本。

| 单 | workId | 车道 | 内容 |
| --- | --- | --- | --- |
| `TCRN-DS-INC-019` | `work:e5a8d9fc064a72ae58303323` | Owner 亲眼判 | 示例件与真实文档外壳不同源(13px vs 18px);品牌染色面与侧栏三向错位(左缺 20、右探出 20、纵夹 12);parity 门补 brand-lockup 角色 |
| `TCRN-DS-INC-020` | `work:d2a6da8d46e2d603ff82aa91` | Owner 亲眼判 | ProductShell 示例的常开搜索浮层压住同卡片标题 |
| `TCRN-DS-INC-021` | `work:309130d77c457ec775d6461e` | 机检车道 | `browser-proof-summary.json` 依赖渲染环境,异地跑一次即脏树,将来做基准必假红 |

## 为什么这三条能在九门全绿时存在

`TCRN-DS-INC-018` 的一致性门比九个角色:canvas、topbar、sidebar-group-spacing、group-title、breadcrumb、search、locale、sidebar-surface、nav-item。**没有品牌角色**,也没有任何角色比对「示例件与它所描绘的真身」。019 与 020 整个落在这个盲区里。

021 则还没变成门,所以还没挡住谁 —— 但它一旦被拿去当基准,挡住的是每一个换了机器的人。

## 复核

```
node "TCRN Platform/tcrn-workflow/scripts/dispatch-readiness-compliance.mjs"
```

三份均 `DISPATCH_BRIEF_READY`,`citations.checked: true`,`unjudgedCommands: 0`。详见 `dispatch-validation.json`。
