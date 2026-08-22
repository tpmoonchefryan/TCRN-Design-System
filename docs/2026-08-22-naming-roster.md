# 命名名册 — DS 去产品化

Owner 2026-08-22 裁定。本文是 `TCRN-DS-STORY-098`、`-103`、`-104` 共用的名册；
三条单的 scope 各自指向本文对应的一节，不重复抄写。

取名判据两条：

1. **另外两个产品看到这个名字，知道自己要的东西在里面。**（Owner 定）
2. **新名要坐进 DS 已有的区分里，不并排另起一套。** DS 自己已把「交互式」与「导航式」分开过一次——
   `Tabs`（`onSelect` 必填、换面板）对 `SectionTabs` / `SegmentedNav`（换页面）。
   凡遇同一组区分，新名沿用这个句法。

每一行的判断来自**读实现**，不是读名字——那正是原判据出错的地方。

---

## 一、三件不该存在（`STORY-104`）

| 现名 | 处置 | 理由（实测） |
| --- | --- | --- |
| `EvidenceStrip` | **删** | 全部实现是 `({ items: string[] })` 渲染一排 `Badge`。调用方写 `items.map(Badge)` 即可，没有任何该组件才知道的事。 |
| `WorkFieldPanel` | **删** | 复用 `Heading` + `KeyValueList` + `Surface` 三个 core 件，自身只做布局。props 是 `{title, items, density}`。 |
| `WorkBoardView` | **删** | 实现就是 `<WorkBoard {...props}/>` 外面套一个工具条 `div`。应成为看板自身的 `toolbar` 槽。 |

## 二、四组是同一功能的多份实现（`STORY-102` / `-104`）

| 合并前 | 合并后 | 理由（实测） |
| --- | --- | --- |
| `EvidenceAttachmentList` + `KnowledgeAttachmentList` | `AttachmentList` | props 形状完全相同 `{label?, items, density?, locale?}`，连文案表都是同一张 `attachmentTableLabels`，只差默认密度。 |
| `MetadataRail` + `KnowledgeMetadataRail` | `MetadataRail` | 后者只多一个可选 `labels?: string[]`。 |
| `WorkIndex` + `WorkList` | `RecordTable` | `WorkIndexRow{id,title,state,owner}` 是 `WorkItemRowProps` 的**真子集**。 |
| `GatePipelineCompact` | 并入 `StagePipeline` 的 `density` | 紧凑态是密度，不是另一个组件。 |

## 三、改名并归位 core（`STORY-104`）

| 现名 | 新名 | 理由，以及与 core 既有件的关系 |
| --- | --- | --- |
| `WorkActivityFeed` | `ActivityFeed` | 带时间与状态的活动记录。core 无对应件。 |
| `KnowledgePageTree` | `TreeNav` | **不是 core `Tree` 的重复。** `Tree` 是 `{nodes, expandedIds?, onToggle?, onSelect?}` 回调驱动的交互树；这个是 `{items:{href?, current?, state?, children?}}` 链接驱动的导航树。正是 `Tabs` 对 `SectionTabs` 的同一组区分，故用 `*Nav` 后缀。 |
| `KnowledgeTocRail` | `TocRail` | 文档内小节目录。与 `TreeNav` 形状相同但**职责不同**（跟随阅读位置 vs 站点层级）——**不合并**，且要写进注释。 |
| `KnowledgeDocumentCanvas` | `DocumentCanvas` | 长文正文的版心与小节。 |
| `KnowledgeVersionHistory` | `VersionHistory` | 版本、时间、作者、差异入口。 |
| `KnowledgeInlineCommentList` | `InlineCommentList` | 锚在正文位置上的评论。 |
| `KnowledgeSearchResults` | `SearchResultList` | 命中项＋摘要＋高亮。core 有 `SearchableList` 与 `Highlight`，但无「结果集」一件。 |
| `KnowledgeLabelSet` | `LabelSet` | props 是 `{label, labels, density, locale}`——**props 里根本没有 knowledge**。被前缀误逐的五件之一。 |
| `WorkItemRow` | `RecordRow` | 一行记录。`RecordTable` 的行单元。 |
| `WorkItemInspector` | `RecordInspector` | **不是 core `DetailInspector` 的重复，是它的上一层。** 后者是 `{title, items}` 的键值面板；这个是九个 props 的整页组合，内部应 composed 出前者。**两级关系要写进注释**，否则读起来像重复。 |
| `WorkSplitView` | `SplitView` | props 是 `{list, detail, detailPopulated, density, label, locale}`——**没有一处提及 work**。被前缀误逐的五件之一。 |
| `WorkDetailLayout` | `DetailLayout` | 详情页的主栏＋侧栏＋操作区。与 `SplitView` 的区别：后者是列表对详情，这个是详情内部分区。 |
| `WorkPageHeader` | `PageHeader` | 标题＋描述＋面包屑＋元信息＋操作。core 有 `Breadcrumb`/`Heading` 但无页头一件。 |
| `WorkBoard` | `LaneBoard` | 按泳道分列的卡片板。`Board` 太泛（也可指仪表板），`LaneBoard` 说清结构。 |
| `WorkBacklogGroup` | `RowGroup` | 带标题、计数、可折叠的一组行。core 有 `CollapsibleRegion`（任意内容），这个专管成组的行并带计数——**不合并**，但实现应 composed 出它。 |
| `WorkInlineCreateStatic` | `InlineCreate` | props 是 `{label, hint, disabledReason, locale}`——**没有一处提及 work**。被前缀误逐的五件之一。名字里的 `Static` 是实现史不是功能，一并去掉。 |
| `GatePipeline` | `StagePipeline` | **Owner 已裁通用。** props 是 `{id, label, state, owner, evidence[], nextAction?}`——带状态、负责人与下一步的阶段，无一处治理专有。TMS 可做入职流程，workflow 可做发布流程。与 core `Stepper` 的区别：Stepper 是线性步骤指示，这个是可带引用与责任人的阶段表。 |
| `WorkHierarchy` | **`RelationGraph`** | **Owner 2026-08-22 裁定。** props 是 `{nodes, edges}`——是图不是树，今天用 `TableShell` 渲成表。取 `RelationGraph` 是忠于**数据形态**，为将来换真图形渲染留路；不取 `HierarchyTable`（忠于今天的渲染）。 |
| `MachineToken` / `MachineTokenCell` | **保持原名** | props 无产品实体，名字也不含产品域。**本就属 core，是随包一起被搬走的**——它以 `Machine` 开头，连四个前缀都不在。原样迁回。 |
| `WorkManagementSubnav` | `SubNav` | **Owner 2026-08-22 裁定：只统一类型，保留三件。** 见下条。 |
| `WorkViewTabs` | `ViewTabs` | 同上。 |
| `WorkQuickFilters` | `QuickFilters` | 同上。 |
| `RelationshipChip` | **保持原名** | 名字已通用。`relation` 改收调用方给的关系描述，见第四节。 |

### 三个导航条：只统一类型，保留三件

三者的 item 类型**同构**——`{id, label, href?, current?, count?, disabled?}`，`WorkQuickFilter` 多一个 `value?`——
但根类与渲染各不相同。Owner 裁定**只把类型统一为 `NavStripItem`，三个组件各自保留**。

理由与 `TocRail` 那条一致：**形状相同不等于功能相同**。这也是 `STORY-102` 判据 3 要求在
活动流／页面树／目录栏上守住的同一条线——不在这里破例。

顺带记一笔：`NavStripItem` 正是当初向 DS 申请、后因零脚本前提撤销的那个
「带计数的链接式导航项」。**它一直在域包里，只是穿着产品的名字。**

## 四、类型层（`STORY-103`）

不改这里，组件改名就是表面工作：判据在类型这一层是循环的——它用名字判名字。

| 现名 | 新名 | 理由 |
| --- | --- | --- |
| `WorkAction` | `ActionDescriptor` | 就是一个动作。**挂在四个组件上**（`MetadataRail`、`KnowledgeMetadataRail`、`WorkDetailLayout`、`WorkPageHeader`）——改这一个，四处一起干净。 |
| `EvidenceAttachment` + `KnowledgeAttachment` | `AttachmentItem` | 同一个「附件」的两个名字，随组件合并一起并掉。 |
| `KnowledgeVersion` | `VersionEntry` | 一个版本。 |
| `KnowledgeComment` | `CommentEntry` | 一条评论。 |
| `KnowledgeSearchResult` | `SearchResultItem` | 一条命中。 |
| `KnowledgeDocumentSection` | `DocumentSection` | 一个小节。 |
| `KnowledgeTocItem` | `TocItem` | 一个目录项。 |
| `KnowledgePageTreeItem` | `TreeNavItem` | 一个导航树节点。与 core 既有 `TreeNode` 并存且不同：后者供交互树用。 |
| `WorkActivityFeedItem` | `ActivityItem` | 一条活动。 |
| `WorkManagementSubnavItem` + `WorkQuickFilter` + `WorkViewTab` | `NavStripItem` | 三者同构，`value?` 作可选并入。 |
| `WorkIndexRow` + `WorkItemRowField` | `RecordRowProps` / `RecordField` | 前者是后者的真子集，随组件合并。 |
| `WorkBoardLane` / `WorkBoardCard` | `BoardLane` / `BoardCard` | 一条泳道、一张卡。 |
| `WorkHierarchyNode` / `WorkHierarchyEdge` | `GraphNode` / `GraphEdge` | 与 `RelationGraph` 一致。 |
| `GatePipelineGate` | `PipelineStage` | **Owner 已裁通用。** 字段 `evidence: string[]` 按实质改为 `references`。 |
| `WorkRelationshipType`<br>`relationshipLabels`<br>`relationshipTone`<br>`workRelationshipTypes`<br>`workRelationshipLabel` | **删除** | **Owner 2026-08-22 裁定：删掉，大不了重新做五语文案。** 十二值闭合联合连同五语文案表与色调表一并移除；`RelationshipChip` 改收调用方给的关系描述。<br>形态与工作状态那次相同：**消费方保留它的词，DS 提供芯片**——正如 AOS 保留七个状态词、DS 提供徽章。<br>**不保留为 Storybook 夹具**：那会让 DS 仓里长期存着一份某产品的词汇。实测无任何消费方引用，删除不打断任何东西。 |
| `workManagementPatternRegistry`<br>`knowledgeManagementPatternRegistry` | 待 `STORY-105` 清点后定 | 两张按产品域组织的登记表。前面几条落地后它们剩什么，才决定是并成一张还是随包一起处置。 |

## 五、分类槽（`STORY-098`）

今天：`work-management`（「组件」「模式」两章各一）、`knowledge-management`（「组件」章），
十一个故事挂在其下。按功能重划为四个槽——**不追求与原数量相等**，槽数由内容决定。

| 新槽 | 收哪些故事 | 理由 |
| --- | --- | --- |
| `records-and-boards`<br>记录与看板 | `backlog-board`、`components`(记录部分)、`route-detail` | 表、行、泳道、分组——「一堆记录怎么摆」。 |
| `hierarchy-and-relations`<br>层级与关系 | `hierarchy-gates`、`relationships` | 节点、边、关系芯片、阶段流水线——「东西之间怎么连」。 |
| `detail-and-inspection`<br>详情与检查 | `inspector`、`tokens-density-views`(密度部分) | 检查器、详情版式、元数据栏——「一条记录怎么看」。 |
| `documents-and-collaboration`<br>文档与协作 | knowledge 三个故事 | 正文画布、目录、版本、行内评论、附件——「长文与围绕它的协作」。 |

**「模式」章那个 `work-management` 槽**只挂着一个故事（`work-management-patterns`），
讲的是模式而非组件。重划后应落进「模式」章已有的功能槽（`data-pages` 或 `forms-workbench`）之一，
**不要在那一章里再造新槽**。

## 六、名册的数字

| 处置 | 件数 |
| --- | --- |
| 删 | 3（外加类型层的关系词汇一组） |
| 并 | 4 组 → 4 件（7 个导出并成 4 个） |
| 改名 | 18，其中 **5 件是被前缀误逐的**，props 里本就没有产品概念 |

域包 35 个导出，落地后约 **25 件**回到 core，**0 件**需要留在按产品域组织的地方——
这也是 `STORY-105` 清点时最可能得到的结论。
