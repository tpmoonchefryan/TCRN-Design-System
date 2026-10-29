# Design System 设计参考入口

Owner 于 2026-10-29 指定：后续重做开发改用下列两个 Sites，不再以 Claude Artifacts 作为当前参考入口。两站沿用 TCRN-CROSS-MIN-308 D1 的分工，分别维护。

| 参考 | 当前入口 | 使用范围 | 可维护源码（平台容器内） |
| --- | --- | --- | --- |
| DS 视觉方向方案 · 草稿 | https://tcrn-ds-visual-draft.honestfawn3.chatgpt.site | 13 块画板；探索、待确认内容及保留的旧稿。旧稿与取代标记继续有效，不将全部草稿视为实施标准 | `sites/tcrn-ds-draft/` |
| TCRN 视觉设计标准 | https://tcrn-ds-visual-standards.honestfawn3.chatgpt.site | 8 块已确认画板；实现时对照的设计标准。新增内容仅在 Owner 明确确认后进入标准 | `sites/tcrn-ds-standards/` |

截至 2026-10-29，Sites 读回两站均为第 1 版，部署成功，访问权限均只有 Owner，无群组或外部访客。可维护源码中的 `boards.json` 管理画板索引，`src/boards/` 管理各板结构、样式与交互，`provenance.json` 记录迁移来源。

| 站点 | Sites project_id | 第 1 版源码提交 |
| --- | --- | --- |
| 草稿 | `appgprj_6ad4ec20b4708191ab99397e9fa310b9` | `0605dba982b0b6ca74c9aff6fde35a1e7ef7c3c7` |
| 设计标准 | `appgprj_6ad4ec31ec7c8191aa3b577750b37a34` | `a643d4cfcd239f6f81b1715ded6a63caead9d619` |

本次只更新参考入口，不改变已批准的开发范围、执行方法、验收判据或发布授权。仓内 `gplus-2026-10/contract/`、生成器、测量脚本与 `visual-standard/boards/` 继续作为实现和门的数据输入；候选分支改过的画板仍须与 Sites 标准逐项核对，不能仅因仓内已有修改就视为标准已发布。

Claude Artifacts 的旧链接与版本号只在原有纪要和历史记录中保留出处。接续 INIT-016 时读实时工单及 `docs/dispatch/2026-10-13-tab-shell/runs/state.md` 的 R6 段；早期收口文件的待裁项按后续纪要处理。
