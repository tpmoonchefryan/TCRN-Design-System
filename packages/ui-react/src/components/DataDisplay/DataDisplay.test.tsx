import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Avatar,
  Card,
  DefinitionList,
  Progress,
  Stepper,
  avatarInitials,
  EvidenceAttachmentList,
  GatePipeline,
  GatePipelineCompact,
  KnowledgeAttachmentList,
  KnowledgeDocumentCanvas,
  KnowledgeInlineCommentList,
  KnowledgeLabelSet,
  KnowledgeMetadataRail,
  KnowledgePageTree,
  KnowledgeSearchResults,
  KnowledgeTemplateGallery,
  KnowledgeTocRail,
  KnowledgeVersionHistory,
  MachineToken,
  MachineTokenCell,
  MetadataRail,
  RelationshipChip,
  SavedViewToolbar,
  StatCard,
  TableShell,
  TableToolbar,
  WorkBoard,
  WorkBoardView,
  WorkActivityFeed,
  WorkBacklogGroup,
  WorkDetailLayout,
  WorkFieldPanel,
  WorkHierarchy,
  WorkIndex,
  WorkInlineCreateStatic,
  WorkItemRow,
  WorkItemInspector,
  WorkList,
  WorkManagementSubnav,
  WorkPageHeader,
  WorkQuickFilters,
  WorkSplitView,
  WorkViewTabs,
  knowledgeManagementPatternRegistry,
  workManagementPatternRegistry,
  workRelationshipTypes
} from "./DataDisplay.js";
import { EnvironmentBanner } from "../Feedback/index.js";
import { TopBar } from "../Navigation/index.js";

test("stat cards and definition lists preserve their distinct display semantics", () => {
  const html = renderToStaticMarkup(
    <>
      <StatCard label="Open routes" value="12" note="Across the selected set" tone="positive" />
      <DefinitionList
        dense
        items={[
          { key: "term", term: "Readback", definition: "A recorded explanation of the current value." },
          { key: "scope", term: "Scope", definition: "The smallest surface covered by the route." }
        ]}
      />
    </>
  );

  assert.match(html, /data-stat-card="true" data-stat-tone="positive"/);
  assert.match(html, /class="tcrn-stat-card__value">12<\/strong>/);
  assert.match(html, /data-definition-list="true"/);
  assert.match(html, /class="tcrn-definition-list tcrn-definition-list--dense"/);
  assert.match(html, /<dt class="tcrn-definition-list__term">Readback<\/dt>/);
  assert.match(html, /<dd class="tcrn-definition-list__definition">A recorded explanation/);
  assert.doesNotMatch(html, /tcrn-key-value-list/);
});

test("composed shell and workbench patterns render synthetic rows", () => {
  const html = renderToStaticMarkup(
    <>
      <TopBar productName="TCRN" moduleName="Synthetic pilot" />
      <EnvironmentBanner label="Fixture" />
      <WorkIndex rows={[{ id: "fixture-1", title: "Synthetic contract row", state: { state: "local_only" }, owner: "role-placeholder" }]} />
    </>
  );
  assert.match(html, /Synthetic contract row/);
  assert.match(html, /Local proof only/);
  assert.match(html, /aria-label="Work index"/);
  assert.doesNotMatch(html, /TCRN-AOS|TCRN-TMS/);
});

test("work index localizes headers and copy-state labels", () => {
  const html = renderToStaticMarkup(
    <WorkIndex
      locale="zh-CN"
      label="工作队列"
      rows={[{ id: "review-1", title: "确认视觉基准", state: { state: "review_required" }, owner: "Elara" }]}
    />
  );
  assert.match(html, /工作项/);
  assert.match(html, /状态/);
  assert.match(html, /负责人/);
  assert.match(html, /需要评审/);
  assert.doesNotMatch(html, /Work item|State|Review required|Unknown/);
});

test("table shell records arbitrary column counts for responsive layout", () => {
  const oneColumn = renderToStaticMarkup(
    <TableShell label="Single column fixture" columns={[{ key: "item", label: "Item" }]} rows={[]} emptyState="No rows" />
  );
  assert.match(oneColumn, /aria-label="Single column fixture"/);
  assert.match(oneColumn, /--tcrn-table-column-count:1/);
  assert.match(oneColumn, /--tcrn-table-shell-columns:repeat\(1, minmax\(var\(--tcrn-table-shell-column-min-width, 160px\), 1fr\)\)/);
  assert.match(oneColumn, /--tcrn-table-shell-min-width:max\(100%, calc\(1 \* var\(--tcrn-table-shell-column-min-width, 160px\)\)\)/);
  assert.match(oneColumn, /tabindex="0"/);
  assert.match(oneColumn, /role="row" class="tcrn-table-shell__empty-row"/);
  assert.match(oneColumn, /role="cell" aria-colspan="1" class="tcrn-table-shell__empty"/);

  const fourColumns = renderToStaticMarkup(
    <TableShell
      label="Four column fixture"
      columns={[
        { key: "a", label: "A" },
        { key: "b", label: "B" },
        { key: "c", label: "C" },
        { key: "d", label: "D" }
      ]}
      rows={[{ a: "A1", b: "B1", c: "C1", d: "D1" }]}
    />
  );
  assert.match(fourColumns, /--tcrn-table-column-count:4/);
  assert.match(fourColumns, /--tcrn-table-shell-columns:repeat\(4, minmax\(var\(--tcrn-table-shell-column-min-width, 160px\), 1fr\)\)/);
  assert.match(fourColumns, /--tcrn-table-shell-min-width:max\(100%, calc\(4 \* var\(--tcrn-table-shell-column-min-width, 160px\)\)\)/);
  assert.match(fourColumns, /data-label="D"/);
});

test("work management relationship and token primitives preserve full metadata", () => {
  const relationshipHtml = renderToStaticMarkup(
    <>
      {workRelationshipTypes.map((relation) => (
        <RelationshipChip key={relation} relation={relation} source="AOS-128" target={`target-${relation}`} />
      ))}
      <MachineToken token="route_tcrn_ds_work_management_patterns_implementation_after_minerva_initiative_c4865675"
        label="route"
        kind="route"
        copyable
      />
      <MachineTokenCell token="019eb66e-00d1-7190-81d9-693895b32033" label="thread" kind="thread" />
    </>
  );

  for (const relation of workRelationshipTypes) {
    assert.match(relationshipHtml, new RegExp(`data-work-relationship="${relation}"`));
  }
  assert.match(relationshipHtml, /data-machine-token-kind="route"/);
  assert.match(relationshipHtml, /data-full-token="route_tcrn_ds_work_management_patterns_implementation_after_minerva_initiative_c4865675"/);
  assert.match(relationshipHtml, /Copy route token/);
  assert.match(relationshipHtml, /data-work-management-pattern="machine-token-cell"/);
});

test("work management registry admits candidates 18 through 41", () => {
  assert.deepEqual(workManagementPatternRegistry.map((item) => item.candidateId), [
    "18-work-management-subnav",
    "19-work-board-lane",
    "20-work-hierarchy-graph",
    "21-relationship-chip",
    "22-gate-pipeline",
    "23-evidence-attachment",
    "24-work-item-inspector",
    "25-saved-view-toolbar",
    "26-machine-token",
    "27-machine-token-cell",
    "28-work-page-header",
    "29-work-view-tabs",
    "30-work-quick-filters",
    "31-work-item-row",
    "32-work-list",
    "33-work-split-view",
    "34-work-backlog-group",
    "35-work-inline-create-static",
    "36-work-board-view",
    "37-work-detail-layout",
    "38-metadata-rail",
    "39-work-field-panel",
    "40-work-activity-feed",
    "41-gate-pipeline-compact"
  ]);
  assert.match(workManagementPatternRegistry.map((item) => item.componentName).join(" "), /WorkBoard/);
  assert.match(workManagementPatternRegistry.map((item) => item.componentName).join(" "), /WorkDetailLayout/);
  assert.match(workManagementPatternRegistry.map((item) => item.level).join(" "), /primitive pattern composite/);
});

test("knowledge management registry admits static DS candidates 42 through 51", () => {
  assert.deepEqual(knowledgeManagementPatternRegistry.map((item) => item.candidateId), [
    "42-knowledge-page-tree",
    "43-knowledge-document-canvas",
    "44-knowledge-toc-rail",
    "45-knowledge-inline-comment-list",
    "46-knowledge-metadata-rail",
    "47-knowledge-attachment-list",
    "48-knowledge-label-set",
    "49-knowledge-version-history",
    "50-knowledge-template-gallery",
    "51-knowledge-search-results"
  ]);
  assert.match(knowledgeManagementPatternRegistry.map((item) => item.componentName).join(" "), /KnowledgeDocumentCanvas/);
  assert.match(knowledgeManagementPatternRegistry.map((item) => item.purpose).join(" "), /without external vendor integration/);
});

test("knowledge management components render static no-live surfaces", () => {
  const html = renderToStaticMarkup(
    <section>
      <KnowledgePageTree
        items={[
          {
            id: "root",
            title: "Runbook space",
            current: true,
            children: [{ id: "child", title: "Owner inspection guide", state: { state: "local_only" } }]
          }
        ]}
      />
      <KnowledgeDocumentCanvas
        title="Owner inspection guide"
        summary="Static Knowledge canvas for design confirmation."
        labels={["runbook", "owner-review"]}
        meta={<MachineTokenCell token="KB-12" kind="generic" />}
        sections={[
          { id: "scope", heading: "Scope", body: "No backend publishing is wired." },
          { id: "proof", heading: "Proof", body: "Evidence links stay local and sanitized." }
        ]}
      />
      <KnowledgeTocRail items={[{ id: "scope", label: "Scope", href: "#scope", current: true }]} />
      <KnowledgeInlineCommentList
        comments={[{ id: "c1", author: "Mara", body: "Clarify acceptance boundary.", state: { state: "review_required" } }]}
      />
      <KnowledgeMetadataRail
        items={[{ key: "owner", label: "Owner", value: "Mara" }]}
        labels={["static"]}
        actions={[{ id: "publish", label: "Publish", disabledReason: "No publishing backend in DS fixture" }]}
      />
      <KnowledgeAttachmentList items={[{ id: "evd", label: "Evidence", reference: "artifact:kb-static", state: { state: "local_only" } }]} />
      <KnowledgeLabelSet labels={["policy", "draft"]} />
      <KnowledgeVersionHistory versions={[{ id: "v1", title: "Draft", author: "Ilya", state: { state: "fixture_only" } }]} />
      <KnowledgeTemplateGallery templates={[{ id: "template", title: "Runbook", description: "Static template only.", state: { state: "not_claimed" } }]} />
      <KnowledgeSearchResults
        query="inspection"
        results={[{ id: "result", title: "Owner inspection guide", excerpt: "Static local result only.", labels: ["runbook"] }]}
      />
    </section>
  );

  assert.match(html, /data-knowledge-management-pattern="knowledge-page-tree"/);
  assert.match(html, /data-knowledge-management-pattern="knowledge-document-canvas"/);
  assert.match(html, /data-knowledge-management-pattern="knowledge-toc-rail"/);
  assert.match(html, /data-knowledge-management-pattern="knowledge-inline-comment-list"/);
  assert.match(html, /data-knowledge-management-pattern="knowledge-metadata-rail"/);
  assert.match(html, /data-knowledge-management-pattern="knowledge-attachment-list"/);
  assert.match(html, /data-knowledge-management-pattern="knowledge-label-set"/);
  assert.match(html, /data-knowledge-management-pattern="knowledge-version-history"/);
  assert.match(html, /data-knowledge-management-pattern="knowledge-template-gallery"/);
  assert.match(html, /data-knowledge-management-pattern="knowledge-search-results"/);
  assert.match(html, /data-search-capability="static-local-fixture"/);
  assert.doesNotMatch(html, /Confluence|Jira|Atlassian|atlaskit/i);
});

test("work management composites render static no-live operational surfaces", () => {
  const html = renderToStaticMarkup(
    <section>
      <SavedViewToolbar
        views={[
          { id: "owner", label: "Owner feedback", current: true, count: 4 },
          { id: "blocked", label: "Blocked", count: 2 }
        ]}
        filters={[{ id: "gate", label: "Gate", value: "Rowan QA" }]}
      />
      <WorkManagementSubnav
        items={[
          { id: "queue", label: "Queue", href: "/work", current: true },
          { id: "board", label: "Board", href: "/work/board" }
        ]}
      />
      <WorkPageHeader
        title="Owner feedback queue"
        description="Compact Work context without global search."
        breadcrumbs={[{ id: "work", label: "Work", href: "/work" }, { id: "queue", label: "Queue" }]}
        meta={<MachineTokenCell token="AOS-128" kind="work-item" />}
        actions={[{ id: "route", label: "Route", disabledReason: "Static fixture only" }]}
      />
      <WorkViewTabs
        tabs={[
          { id: "queue", label: "Queue", href: "/work", current: true, count: 4 },
          { id: "backlog", label: "Backlog", href: "/work/backlog", count: 8 }
        ]}
      />
      <WorkQuickFilters
        filters={[
          { id: "mine", label: "Assigned to me", count: 3, current: true },
          { id: "blocked", label: "Blocked", value: "Needs gate", count: 1 }
        ]}
      />
      <WorkList
        rows={[
          {
            id: "AOS-128",
            title: "Rebuild Work module with dense DS rows",
            state: { state: "review_required" },
            owner: "Ilya",
            selected: true,
            priority: "P1",
            fields: [{ key: "gate", label: "Gate", value: "DS" }]
          },
          {
            id: "AOS-129",
            title: "Mobile detail route",
            state: { state: "proof_required" },
            owner: "Rowan",
            rank: "2"
          }
        ]}
      />
      <WorkItemRow id="AOS-130" title="Standalone row" state={{ state: "local_only" }} owner="Mara" />
      <WorkBacklogGroup
        title="Shaped backlog"
        rows={[
          {
            id: "AOS-131",
            title: "Route acceptance markers",
            state: { state: "local_only" },
            owner: "Mara",
            rank: "1"
          }
        ]}
        actions={[{ id: "promote", label: "Promote", disabledReason: "No backend promotion in Storybook fixture" }]}
        inlineCreate={{ label: "Add placeholder", disabledReason: "Static-only affordance" }}
      />
      <WorkInlineCreateStatic label="Add work" disabledReason="Static fixture only" />
      <WorkBoard
        density="compact"
        lanes={[
          {
            id: "review",
            title: "Review",
            cards: [
              {
                id: "AOS-128",
                title: "Owner-quality Work Management mockup",
                state: { state: "review_required" },
                owner: "Elara",
                priority: "P1",
                fields: [{ key: "gate", label: "Gate", value: "Review" }],
                relationships: [{ relation: "verifies", target: "QA-178" }]
              }
            ]
          }
        ]}
      />
      <WorkBoardView
        lanes={[
          {
            id: "done",
            title: "Done",
            cards: [{ id: "AOS-132", title: "Accepted local proof", state: { state: "local_only" }, owner: "QA" }]
          }
        ]}
      />
      <WorkHierarchy
        nodes={[
          { id: "INIT-WM", level: "Initiative", title: "Work Management MVP" },
          { id: "EPIC-BOARD", level: "Epic", title: "Board workflow", parentId: "INIT-WM" },
          { id: "STORY-ACCEPT", level: "Story", title: "Smallest acceptable result", parentId: "EPIC-BOARD" },
          { id: "AOS-128", level: "Task / Work Item", title: "Executable task ticket", parentId: "STORY-ACCEPT" },
          { id: "EV-1", level: "Subtask / Evidence Task", title: "Screenshot proof", parentId: "AOS-128" }
        ]}
        edges={[{ from: "AOS-128", relation: "implements", to: "STORY-ACCEPT" }]}
      />
      <GatePipeline
        gates={[
          { id: "ds", label: "DS Review", state: { state: "proof_required" }, owner: "Elara", evidence: ["Storybook"] },
          { id: "qa", label: "Rowan QA", state: { state: "blocked" }, owner: "Rowan", evidence: ["summary.json"], nextAction: "Retry after review" }
        ]}
      />
      <GatePipelineCompact
        gates={[{ id: "pm", label: "PM route", state: { state: "not_claimed" }, owner: "Mara", evidence: ["none"], nextAction: "Wait" }]}
      />
      <EvidenceAttachmentList
        density="compact"
        items={[
          { id: "commit", type: "commit", label: "Implementation commit", reference: "c4865675", state: { state: "local_only" } },
          { id: "artifact", type: "artifact_dir", label: "QA artifact receipt", reference: "route-artifact:rowan-static-work" }
        ]}
      />
      <WorkSplitView
        list={<WorkList rows={[{ id: "AOS-133", title: "Selected row", state: { state: "local_only" }, owner: "Ilya" }]} />}
        detail={
          <WorkDetailLayout
            title="AOS-133"
            summary="Main pane with metadata rail."
            state={{ state: "review_required" }}
            main={<WorkFieldPanel title="Narrative" items={[{ key: "result", label: "Result", value: "Smallest workflow outcome" }]} />}
            metadata={<MetadataRail items={[{ key: "owner", label: "Owner", value: "Ilya" }]} />}
            activity={<WorkActivityFeed items={[{ id: "activity-1", actor: "Rowan", action: "requested evidence", timestamp: "2026-07-04" }]} />}
          />
        }
      />
      <WorkItemInspector
        title="AOS-128"
        summary="Static Storybook fixture only."
        hierarchy={[{ key: "story", label: "Story", value: "Smallest acceptable human/business/workflow result" }]}
        details={[{ key: "task", label: "Task / Work Item", value: "Smallest executable ticket/task unit" }]}
        relationships={[{ relation: "reviews", target: "DS Review" }]}
        subtasks={[{ id: "EV-1", title: "Collect evidence", state: { state: "local_only" }, owner: "Rowan" }]}
        evidence={[{ id: "qa", type: "qa_summary", label: "QA summary", reference: "summary-final.json" }]}
        actions={[{ id: "dispatch", label: "Dispatch Codex", disabledReason: "No live dispatch in Storybook fixture" }]}
      />
    </section>
  );

  assert.match(html, /data-work-management-pattern="saved-view-toolbar"/);
  assert.match(html, /data-work-management-pattern="work-page-header"/);
  assert.match(html, /data-work-management-pattern="work-view-tabs"/);
  assert.match(html, /data-work-management-pattern="work-quick-filters"/);
  assert.match(html, /data-work-management-pattern="work-list"/);
  assert.match(html, /data-work-management-pattern="work-item-row"/);
  assert.match(html, /data-work-management-pattern="work-backlog-group"/);
  assert.match(html, /data-work-management-pattern="work-inline-create-static"/);
  assert.match(html, /data-work-management-pattern="work-board"/);
  assert.match(html, /data-work-management-pattern="work-board-view"/);
  assert.match(html, /data-work-management-pattern="work-hierarchy"/);
  assert.match(html, /data-work-management-pattern="gate-pipeline"/);
  assert.match(html, /data-work-management-pattern="evidence-attachment-list"/);
  assert.match(html, /data-work-management-pattern="work-split-view"/);
  assert.match(html, /data-work-management-pattern="work-detail-layout"/);
  assert.match(html, /data-work-management-pattern="metadata-rail"/);
  assert.match(html, /data-work-management-pattern="work-field-panel"/);
  assert.match(html, /data-work-management-pattern="work-activity-feed"/);
  assert.match(html, /data-work-management-pattern="work-item-inspector"/);
  assert.match(html, /DS Review/);
  assert.match(html, /Smallest acceptable human\/business\/workflow result/);
  assert.match(html, /Smallest executable ticket\/task unit/);
  assert.match(html, /No live dispatch in Storybook fixture/);
  assert.doesNotMatch(html, /ProductShellSearch|data-shell-control="product-shell-search"|live dispatch authorized|release ready|Atlassian|Jira|WorkIssueRow|IssueRow|issue-style/i);
});

test("TableToolbar declares its host-wiring contract", () => {
  const html = renderToStaticMarkup(
    <TableToolbar
      label="Demo table tools"
      controlsId="demo-table"
      searchLabel="Search demo rows"
      filterOptions={[{ id: "caveat", label: "With caveats" }]}
      allFilterLabel="All"
      collapseLabel="Collapse table"
      expandLabel="Expand table"
    />
  );
  assert.match(html, /data-table-toolbar="true"/);
  assert.match(html, /data-table-toolbar-target="demo-table"/);
  assert.match(html, /data-table-toolbar-search="true"/);
  assert.match(html, /aria-controls="demo-table"/);
  assert.match(html, /aria-pressed="true"[^>]*data-table-toolbar-filter=""/);
  assert.match(html, /aria-pressed="false"[^>]*data-table-toolbar-filter="caveat"/);
  assert.match(html, /data-table-toolbar-count="\{shown\} \/ \{total\}"/);
  assert.match(html, /data-table-toolbar-collapse="true"/);
  assert.match(html, /data-table-toolbar-collapse-label="collapse"/);
  assert.match(html, /data-table-toolbar-collapse-label="expand"/);
});

test("components that carry their own labels say them in the reader's language", () => {
  // Each of these labels was an English literal in a parameter default. A consumer
  // that passes the prop was always fine; a consumer that relied on the default —
  // which is what a default is for — shipped English into a translated page. For
  // the four that are accessible names only, it was invisible on screen and
  // audible to exactly the reader least able to work around it, which is why
  // rendering and reading back is the only check that settles it.
  const zh = renderToStaticMarkup(
    <>
      <WorkManagementSubnav locale="zh-CN" items={[{ id: "queue", label: "队列", href: "/queue" }]} />
      <WorkViewTabs locale="zh-CN" tabs={[{ id: "all", label: "全部", href: "/all" }]} />
      <WorkQuickFilters locale="zh-CN" filters={[{ id: "mine", label: "我的", href: "/mine" }]} />
      <WorkInlineCreateStatic locale="zh-CN" disabledReason="静态示例" />
      <MetadataRail locale="zh-CN" items={[{ key: "owner", label: "owner", value: "governance" }]} />
      <KnowledgeTocRail locale="zh-CN" items={[{ id: "intro", label: "简介" }]} />
      <KnowledgeMetadataRail locale="zh-CN" items={[{ key: "basis", label: "basis", value: "d385428" }]} labels={["策略"]} />
      <KnowledgeLabelSet locale="zh-CN" labels={["策略"]} />
      <TableToolbar
        locale="zh-CN"
        label="表格工具"
        controlsId="zh-table"
        searchLabel="检索行"
        filterOptions={[{ id: "caveat", label: "有注意事项" }]}
      />
    </>
  );
  assert.match(zh, /aria-label="工作管理视图"/);
  assert.match(zh, /aria-label="工作视图"/);
  assert.match(zh, /aria-label="工作快捷过滤"/);
  assert.match(zh, />添加工作项</);
  assert.match(zh, />元数据</);
  assert.match(zh, /aria-label="本页目录"/);
  assert.match(zh, />本页目录</);
  assert.match(zh, />知识元数据</);
  assert.match(zh, /aria-label="知识标签"/);
  assert.match(zh, />全部</);
  // No English default survives anywhere in the zh render, including the ones that
  // only ever appear in an attribute.
  for (const englishDefault of [
    "Work Management views", "Work views", "Work quick filters", "Add work item",
    ">Metadata<", "On this page", "Knowledge metadata", "Knowledge labels"
  ]) {
    assert.equal(zh.includes(englishDefault), false, `${englishDefault} is not shipped into a zh-CN page`);
  }

  // A composed accessible name follows the label it is composed from, in the same
  // language. Welding an English " tabs" onto a Chinese label yields a string that
  // is neither language, and the swap layer downstream can never reach it.
  const zhToolbar = renderToStaticMarkup(
    <SavedViewToolbar
      locale="zh-CN"
      views={[{ id: "open", label: "进行中", href: "/open" }]}
      filters={[{ id: "owner", label: "owner", value: "governance" }]}
    />
  );
  assert.match(zhToolbar, /aria-label="已保存的工作视图"/);
  assert.match(zhToolbar, /aria-label="已保存的工作视图标签"/);
  assert.match(zhToolbar, /aria-label="已保存的工作视图过滤"/);
  assert.match(zhToolbar, />重置视图</);
  assert.equal(zhToolbar.includes(" tabs"), false, "the composed name does not weld an English word onto a Chinese label");
  assert.equal(zhToolbar.includes(" filters"), false, "the composed name does not weld an English word onto a Chinese label");

  // ja and fr, so the table is proved to hold five locales rather than two.
  const ja = renderToStaticMarkup(<KnowledgeTocRail locale="ja" items={[{ id: "intro", label: "はじめに" }]} />);
  assert.match(ja, /aria-label="このページの目次"/);
  const fr = renderToStaticMarkup(<MetadataRail locale="fr" items={[{ key: "owner", label: "owner", value: "governance" }]} />);
  assert.match(fr, />Métadonnées</);
  const ko = renderToStaticMarkup(<WorkInlineCreateStatic locale="ko" disabledReason="정적 목업" />);
  assert.match(ko, />작업 항목 추가</);

  // An unknown locale, and no locale at all, resolve to English rather than
  // throwing or losing the label: a consumer that never passes one keeps today's
  // behaviour instead of rendering an empty control.
  const fallback = renderToStaticMarkup(
    <>
      <MetadataRail items={[{ key: "owner", label: "owner", value: "governance" }]} />
      <KnowledgeTocRail locale="de" items={[{ id: "intro", label: "Intro" }]} />
    </>
  );
  assert.match(fallback, />Metadata</);
  assert.match(fallback, /aria-label="On this page"/);
});

test("the remaining work and knowledge patterns say their own labels in the reader's language", () => {
  // The thirteen defaults left over from the first pass. Every one of these is an
  // accessible name only — invisible on screen, so nothing about a zh-CN page
  // looked wrong while all thirteen were announcing English to the one reader who
  // depends on them.
  const zh = renderToStaticMarkup(
    <>
      <WorkIndex locale="zh-CN" rows={[{ id: "W-1", title: "示例", state: { state: "local_only" }, owner: "governance" }]} />
      <WorkList locale="zh-CN" rows={[{ id: "W-1", title: "示例", state: { state: "local_only" }, owner: "governance" }]} />
      <WorkSplitView locale="zh-CN" list={<div>列表</div>} detail={<div>详情</div>} />
      <WorkHierarchy locale="zh-CN" nodes={[{ id: "W-1", level: "Story", title: "示例" }]} edges={[]} />
      <EvidenceAttachmentList locale="zh-CN" items={[{ id: "E-1", type: "commit", label: "证据", reference: "sha256:abc" }]} />
      <WorkActivityFeed locale="zh-CN" items={[{ id: "A-1", actor: "governance", action: "记录" }]} />
      <KnowledgePageTree locale="zh-CN" items={[{ id: "P-1", title: "页面" }]} />
      <KnowledgeInlineCommentList locale="zh-CN" comments={[{ id: "C-1", author: "governance", body: "评注" }]} />
      <KnowledgeAttachmentList locale="zh-CN" items={[{ id: "K-1", label: "附件", reference: "sha256:def" }]} />
      <KnowledgeVersionHistory locale="zh-CN" versions={[{ id: "V-1", title: "草稿", author: "governance" }]} />
      <KnowledgeTemplateGallery locale="zh-CN" templates={[{ id: "T-1", title: "模板", description: "静态模板" }]} />
      <KnowledgeSearchResults locale="zh-CN" results={[{ id: "R-1", title: "结果", excerpt: "摘要", labels: ["策略"] }]} />
    </>
  );
  for (const name of [
    "工作项索引", "工作项列表", "工作项分栏视图", "工作层级", "证据附件", "工作动态",
    "知识页面树", "知识评注", "知识附件", "知识版本历史", "知识模板", "知识检索结果"
  ]) {
    assert.match(zh, new RegExp(`aria-label="${name}"`), `${name} is the zh-CN name`);
  }
  for (const englishDefault of [
    "Work index", "Work list", "Work split view", "Work hierarchy", "Evidence attachments",
    "Work activity", "Knowledge page tree", "Knowledge comments", "Knowledge attachments",
    "Knowledge version history", "Knowledge templates", "Knowledge search results"
  ]) {
    assert.equal(zh.includes(englishDefault), false, `${englishDefault} is not shipped into a zh-CN page`);
  }

  // A nested set that resolves its own default has to be handed the parent's
  // locale, or one result carries two languages. This was already the bug in
  // KnowledgeMetadataRail; KnowledgeSearchResults had it too.
  assert.match(zh, /aria-label="知识标签"/);
  assert.equal(zh.includes("Knowledge labels"), false, "the nested label set follows its parent's locale");

  // The three names composed from a value the consumer supplied. The id inside the
  // evidence name is a machine token and stays as it is; the word describing it is
  // the part that has to move.
  const zhComposed = renderToStaticMarkup(
    <>
      <WorkBoard
        locale="zh-CN"
        lanes={[{
          id: "L-1",
          title: "进行中",
          cards: [{
            id: "W-1",
            title: "示例卡片",
            state: { state: "local_only" },
            owner: "governance",
            relationships: [{ relation: "blocks", target: "W-2" }]
          }]
        }]}
      />
      <WorkHierarchy locale="zh-CN" nodes={[{ id: "W-1", level: "Story", title: "示例" }]} edges={[]} />
      <WorkActivityFeed
        locale="zh-CN"
        items={[{
          id: "A-1",
          actor: "governance",
          action: "记录",
          evidence: [{ id: "E-1", type: "commit", label: "证据", reference: "sha256:abc" }]
        }]}
      />
    </>
  );
  assert.match(zhComposed, /aria-label="示例卡片的关联"/);
  assert.match(zhComposed, /aria-label="工作层级关联回退表"/);
  assert.match(zhComposed, /aria-label="A-1的证据"/);
  for (const welded of [" relationships", " relationship fallback", " evidence"]) {
    assert.equal(zhComposed.includes(welded), false, `${welded} is not welded onto a Chinese value`);
  }

  // Two more locales, so the additions are proved to hold five rather than two.
  const ja = renderToStaticMarkup(<WorkSplitView locale="ja" list={<div>一覧</div>} detail={<div>詳細</div>} />);
  assert.match(ja, /aria-label="作業項目の分割ビュー"/);
  const fr = renderToStaticMarkup(<KnowledgeTemplateGallery locale="fr" templates={[{ id: "T-1", title: "Modèle", description: "Modèle statique" }]} />);
  assert.match(fr, /aria-label="Modèles de connaissance"/);
  const ko = renderToStaticMarkup(<WorkActivityFeed locale="ko" items={[{ id: "A-1", actor: "governance", action: "기록" }]} />);
  assert.match(ko, /aria-label="작업 활동"/);

  // A caller's own label still wins over the built-in, and no locale at all keeps
  // today's English rather than an empty name.
  const explicit = renderToStaticMarkup(<WorkList locale="zh-CN" label="调用方自己的名字" rows={[{ id: "W-1", title: "示例", state: { state: "local_only" }, owner: "governance" }]} />);
  assert.match(explicit, /aria-label="调用方自己的名字"/);
  const noLocale = renderToStaticMarkup(<WorkSplitView list={<div>list</div>} detail={<div>detail</div>} />);
  assert.match(noLocale, /aria-label="Work split view"/);
});


// TCRN-DS-STORY-092. Every assertion below reads a BEHAVIOUR, not a class name.
// A test that only asserts `class="tcrn-card"` stays green when the component is
// replaced by an empty div wearing that class — which is exactly how Breadcrumb's
// missing href survived a full suite (see Navigation.test.tsx).

test("STORY-092 an interactive card is reachable by keyboard and a plain one is not", () => {
  const interactive = renderToStaticMarkup(<Card interactive>body</Card>);
  const plain = renderToStaticMarkup(<Card>body</Card>);
  assert.match(interactive, /tabindex="0"/);
  assert.doesNotMatch(plain, /tabindex=/, "a non-interactive card must not enter the tab order");
  // The consumer keeps ownership of a supplied tabIndex rather than having it overwritten.
  assert.match(renderToStaticMarkup(<Card interactive tabIndex={-1}>body</Card>), /tabindex="-1"/);
});

test("STORY-092 an avatar without a picture still carries the name, and says it once", () => {
  const withoutImage = renderToStaticMarkup(<Avatar name="Ada Lovelace" />);
  assert.match(withoutImage, /role="img"/);
  assert.match(withoutImage, /aria-label="Ada Lovelace"/);
  assert.match(withoutImage, />AL</, "initials are the fallback, not an empty circle");
  const withImage = renderToStaticMarkup(<Avatar name="Ada Lovelace" src="/a.png" />);
  // The wrapper already announces the name; a non-empty alt would read it twice.
  assert.match(withImage, /alt=""/);
  assert.equal((withImage.match(/Ada Lovelace/g) ?? []).length, 1);
});

test("STORY-092 initials take the first and last word, not the first two", () => {
  // A column of these is scanned, and the middle name is the part nobody uses.
  assert.equal(avatarInitials("Ada Lovelace King"), "AK");
  assert.equal(avatarInitials("Ada"), "A");
  assert.equal(avatarInitials("   "), "");
});

test("STORY-092 an indeterminate progress bar reports no value at all", () => {
  const determinate = renderToStaticMarkup(<Progress label="Upload" value={40} />);
  assert.match(determinate, /role="progressbar"/);
  assert.match(determinate, /aria-valuenow="40"/);
  assert.match(determinate, /aria-valuemax="100"/);
  const indeterminate = renderToStaticMarkup(<Progress label="Upload" />);
  // Rendering 0% for "extent unknown" is a claim, and it is the wrong one.
  assert.doesNotMatch(indeterminate, /aria-valuenow=/);
  assert.match(indeterminate, /role="progressbar"/);
});

test("STORY-092 progress clamps a value outside its range instead of overflowing", () => {
  assert.match(renderToStaticMarkup(<Progress label="x" value={140} />), /aria-valuenow="100"/);
  assert.match(renderToStaticMarkup(<Progress label="x" value={-5} />), /aria-valuenow="0"/);
});

test("STORY-092 the current step is announced, and completion is a separate fact from position", () => {
  const html = renderToStaticMarkup(
    <Stepper
      label="Setup"
      currentId="two"
      steps={[
        { id: "one", label: "Choose", complete: true },
        { id: "two", label: "Confirm" },
        { id: "three", label: "Done" }
      ]}
    />
  );
  assert.match(html, /aria-current="step"/);
  assert.equal((html.match(/aria-current="step"/g) ?? []).length, 1, "exactly one step is current");
  assert.match(html, /data-step-state="complete"/);
  assert.match(html, /data-step-state="upcoming"/);
  // A reader who jumped back leaves a completed step after the current one, so
  // "complete" cannot be derived from position.
  const jumped = renderToStaticMarkup(
    <Stepper label="Setup" currentId="one" steps={[{ id: "one", label: "A" }, { id: "two", label: "B", complete: true }]} />
  );
  assert.match(jumped, /data-step-state="complete"/);
});
