# 派工：DS 去产品化（发布面 + 组件与类型）与四处缺陷

给 Codex。可以用 `goal` 指令完成。**没有硬门**，每条末尾的「验收」是验收项。

Owner 2026-08-22 三次裁定：①Storybook 的样式与章节产品化问题要修；②**「DS 的 Storybook 应该提供
平台统一的设计规范和组件，不应该按产品分类，而是按功能来分，不同产品相同功能的地方都可以使用，
而不是仅限于一个产品，那么这个 DS 就没有意义了」**；③**「一并做，接受重组重构」**，
并对两个待裁项裁「通用」。

---

## 零、十四条单，两个 Epic 加四个 Incident

| 单 | 内容 |
| --- | --- |
| **`TCRN-DS-EPIC-034`** | **发布面去产品化**（挂 INIT-012） |
| `TCRN-DS-STORY-098` | 三个分类槽换功能名，十一个故事按功能归位 |
| `TCRN-DS-STORY-099` | 两个 AOS 具名故事：拆开「取证对象」与「判据」 |
| `TCRN-DS-STORY-100` | 发布面命名门 |
| **`TCRN-DS-EPIC-035`** | **组件与类型去产品化，`@tcrn/ui-domain` 归并**（挂 INIT-012） |
| `TCRN-DS-STORY-101` | 通用性判据从名字改为 props 实质 —— **必须先做** |
| `TCRN-DS-STORY-102` | 合并重复实现 |
| `TCRN-DS-STORY-103` | 类型层去产品化，一路到底 |
| `TCRN-DS-STORY-104` | 组件按功能改名并归位 core |
| `TCRN-DS-STORY-105` | `@tcrn/ui-domain` 的处置 |
| `TCRN-DS-INC-010` | Storybook 文档外壳未产品化 |
| `TCRN-DS-INC-011` | core 缺三组修饰类定义 |
| `TCRN-DS-INC-012` | AI 消费契约不写品牌资产正本地址 |
| `TCRN-DS-INC-013` | `--wrap` 档圆点浮在两行之间 |

**每条单的 scope 就是规格，链上写得比本文细，动手前读它：**

```bash
node ~/.tcrn-workflow/tcrn-workflow/scripts/tcrn-workflow.mjs work-list --workspace /Users/ryanlan/Code/.tcrn-workspace/TCRN-Design-System/workspace
```

另有一条在 AOS 仓：`TCRN-AOS-INC-052`（`LEGACY_TONE_ALIASES` 与工作状态词撞），
规格见 `TCRN-AOS/docs/handoff-storybook-productization.md` 第六节。

---

## 一、先读这一段：判据被施加在名字上

`scripts/generic-primitive-scan.mjs` 的判定式是

```
^export function ((?:Work|Knowledge|Gate|Evidence)[A-Z]\w*)
```

**只读函数名，一个 prop 都不看。** 执行「组件属于 DS 当且仅当其 props 能被描述而不提及任何
单一产品的业务概念」（`TCRN-TMS-MIN-008`）这条裁定的机制，检查的是名字。两个方向的错都由此产生：

- **假阴性**：`WorkActivityFeed` 改名 `ActivityFeed`，门立刻变绿，而它是否通用毫无变化
- **假阳性**：`KnowledgeLabelSet`、`MachineToken`、`WorkFieldPanel`、`WorkInlineCreateStatic`、
  `WorkSplitView` 的 props 里**不出现任何产品实体类型**，按裁定本就属 core，却因前缀被逐出

**所以 `STORY-101` 排在最前，这条次序是硬的。** 后面四条要大量改名；判据不先修，
那些改名会让门整片变绿——而变绿的原因是判据被绕过，不是实质变好。

---

## 二、你不需要重新发现的实测

**同一功能被实现了多遍。** 五个组件 props 形状完全相同（`density, items, label, locale`）：
`EvidenceAttachmentList` ≡ `KnowledgeAttachmentList` ≡ `WorkActivityFeed` ≡ `KnowledgePageTree` ≡
`KnowledgeTocRail`。前两个连文案表都是同一张 `attachmentTableLabels`，只差默认密度
（`comfortable` / `compact`）；`MetadataRail` 与 `KnowledgeMetadataRail` 只差一个可选 `labels`。

**但后三个不许合并**（`STORY-102` 判据 3）：活动流、页面树、目录栏形状相同而**职责不同**，
是三个功能共用一个 props 形状，不是同一功能的三份实现。这个区分要写进注释，
否则下一轮会有人把它们并掉。

**类型层同样带前缀，判据在那一层是循环的。** `WorkAction` 就是一个动作（挂在四个组件上：
`MetadataRail`、`KnowledgeMetadataRail`、`WorkDetailLayout`、`WorkPageHeader`）、
`KnowledgeVersion` 就是一个版本、`EvidenceAttachment` 与 `KnowledgeAttachment` 是同一个附件的
两个名字。乙组 26 个组件之所以「props 含产品实体」，正是因为这些类型自己带前缀。

**该包没有任何产品消费方。** AOS 零代码引用、TMS 零、workflow 零。唯一消费方是 DS 自己的
Storybook 与 `examples/tms-react-pilot`——而后者第 3 行是
`import { WorkIndex } from "@tcrn/ui-domain"`：**一个 TMS 示例引用以 AOS 域命名的组件。**
本裁定要消除的形态，在仓里已经字面发生。

**重构因此不打断任何产品。** 若实施中发现某个未登记的消费方，**停下来呈报**，
不要就地改人家的代码。

**发布面的实测**（量的是 `storybook-static` 构建产物）：十八个分类槽里三个是某一产品的域名
（`work-management` 在「组件」「模式」两章各一、`knowledge-management` 在「组件」章）；
五十五个故事里十三个是产品或产品域形态；**没有任何 TMS 或 workflow 命名的故事**——
若分类真按功能划分，同一个槽位本应同时服务三个产品。

---

## 三、两个待裁项，Owner 已裁「通用」

**`GatePipelineGate`** 实测是 `{ id, label, state: CopyStateInput, owner, evidence: string[], nextAction? }`
——一个带状态、负责人与下一步的阶段，没有一处是治理专有。`state` 取的是 `@tcrn/ui-copy-state`
的就绪度词汇，那是 **DS 自己的平台词汇**而非某产品的，可以留。故通用化为阶段流水线，
`evidence` 按其实质改为「支撑引用」。**TMS 可用它做入职流程，workflow 可用它做发布流程。**

**`WorkRelationshipType`** 是十二值闭合联合，连同五语文案表 `relationshipLabels`
与色调表 `relationshipTone`。通用化的形态是：**芯片收调用方给的关系描述，而不是闭合联合。**

这与工作状态那次是同一形状——AOS 保留它的七个状态词、DS 提供徽章；同理消费方保留十二个关系词、
DS 提供芯片。十二值词汇连同五语文案移出公开 API；由于实测无任何消费方引用，
**以 Storybook 夹具的形态保留**（明确标注为某产品的词汇示例、不属公开面），而不是删掉了事。

---

## 四、四处缺陷（与两个 Epic 并行）

**INC-010 文档外壳。** `tcrn-doc-category-index` 全家 7 个类在三份样式表里**一条定义都没有**，
浏览器实测链接色 `rgb(0, 0, 238)` + underline——就是浏览器默认，**七个栏目落地页全部如此**。
同页两个 `<h2>`（页头与正文各一）。`__link--previous` 无定义（29 页）而 `--next` 有。
另有 `tcrn-doc-nav__section-icon-svg`（224 次/32 页）等四类。
**链接直接用 `.tcrn-link`，不要自造**——那个基元刚随 STORY-095 进 core。

**INC-011 修饰类。** `.tcrn-inline-alert--warning` 有，`--danger`/`--positive`/`--neutral` 没有；
`.tcrn-state-view` 四个色调修饰全无；`.tcrn-heading--4` 无。取值沿用既有状态令牌，**不新造颜色**。
这是同一类错的第三次——AOS 已在 `gate:ds-adoption` 立过断言，**消费者替权威源立了门，
权威源自己没有**。可参考其做法，**不许跨仓引用其代码**。

**INC-012 契约。** 契约把「必须用哪个 logo」写到极细，**40 个顶层键里没有一条说 svg 从哪里取**。
三包不带任何 svg，默认 `src` 是裸相对名。同样没写的另一半：**本仓是开发源码，Storybook 才是发布面**。
**不要把答案写成仓内路径**，要指向消费方真正能取到的那一份，并配可复核命令。

**INC-013 圆点。** `--wrap` 徽章折行时圆点中心距顶 18px、第一行文字中心 10.5px。
STORY-097 的三处成因里，这一处**是被 `nowrap` 遮住而不是修好的**。判据 2 是安全带：
单行外观一个像素不许变。

---

## 五、纪律

**次序**：`STORY-101` → `102` → `103` → `104` → `105`，硬的。EPIC-034 与 EPIC-035 是同一裁定的
两面，**要在故事 id 上对齐**——发布面改名与组件改名不能各叫各的。四个 Incident 可并行。

**功能名由 Owner 定。** `STORY-098` 与 `STORY-104` 只提候选、不自行落名。判据：
**另外两个产品看到这个名字，知道自己要的东西在里面。**

**`STORY-104` 最容易犯的错是查重不足。** core 已有 `DetailInspector`、`SegmentedNav`、
`SectionTabs`、`TableShell`，而 `WorkItemInspector`、`WorkViewTabs`、`WorkList` 归位后
很可能与它们同功能。把域件改名塞进 core 却造出两个做同一件事的组件，
是把问题从一处搬到另一处。**先查重，再改名。**

**不要删故事。** 十三个产品形态的故事内容是真做过的工作，这一批是把它们放回按功能划分的位置。

**与 `TCRN-TMS-MIN-008` 的关系**：INIT-012 当年抽出是对的——AOS 在用，删掉会打断唯一活消费方。
今天那个消费方不在了。**这是前提失效，不是裁定被推翻**，`STORY-105` 判据 4 要求写清楚这句。

**跨仓**：DS 改完若动了 `tcrnComponentCss`，按既有约定要重打 tarball、AOS 换包、
门户刷新 CSS 快照（`TCRN-CROSS-INC-223`）。

提交身份 `tpmoonchefryan <253097889+tpmoonchefryan@users.noreply.github.com>`，不加 `Co-Authored-By`。

**做完不是 `done`。** 组件、类型、判据属机检车道；**发布面与视觉基线归 Owner 亲眼判**，
门全绿后仍待 Owner 看。262 张视觉基线会大面积变动——差异要逐项是有意的且经记录，
不许为了让基线绿而绕过。推送、发布、部署是各自独立的停止点。
