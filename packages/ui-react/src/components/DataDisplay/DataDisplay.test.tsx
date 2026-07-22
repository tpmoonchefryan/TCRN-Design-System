import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import {
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
