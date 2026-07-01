import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import {
  EvidenceAttachmentList,
  GatePipeline,
  MachineToken,
  RelationshipChip,
  SavedViewToolbar,
  TableShell,
  WorkBoard,
  WorkHierarchy,
  WorkIndex,
  WorkItemInspector,
  WorkManagementSubnav,
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
    </>
  );

  for (const relation of workRelationshipTypes) {
    assert.match(relationshipHtml, new RegExp(`data-work-relationship="${relation}"`));
  }
  assert.match(relationshipHtml, /data-machine-token-kind="route"/);
  assert.match(relationshipHtml, /data-full-token="route_tcrn_ds_work_management_patterns_implementation_after_minerva_initiative_c4865675"/);
  assert.match(relationshipHtml, /Copy route token/);
});

test("work management registry admits candidates 18 through 26", () => {
  assert.deepEqual(workManagementPatternRegistry.map((item) => item.candidateId), [
    "18-work-management-subnav",
    "19-work-board-lane",
    "20-work-hierarchy-graph",
    "21-relationship-chip",
    "22-gate-pipeline",
    "23-evidence-attachment",
    "24-work-item-inspector",
    "25-saved-view-toolbar",
    "26-machine-token-cell"
  ]);
  assert.match(workManagementPatternRegistry.map((item) => item.componentName).join(" "), /WorkBoard/);
  assert.match(workManagementPatternRegistry.map((item) => item.level).join(" "), /primitive pattern composite/);
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
      <WorkBoard
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
                relationships: [{ relation: "verifies", target: "QA-178" }]
              }
            ]
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
      <EvidenceAttachmentList
        items={[
          { id: "commit", type: "commit", label: "Implementation commit", reference: "c4865675", state: { state: "local_only" } },
          { id: "artifact", type: "artifact_dir", label: "QA artifact directory", reference: "/tmp/rowan-static-work" }
        ]}
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
  assert.match(html, /data-work-management-pattern="work-board"/);
  assert.match(html, /data-work-management-pattern="work-hierarchy"/);
  assert.match(html, /data-work-management-pattern="gate-pipeline"/);
  assert.match(html, /data-work-management-pattern="evidence-attachment-list"/);
  assert.match(html, /data-work-management-pattern="work-item-inspector"/);
  assert.match(html, /DS Review/);
  assert.match(html, /Smallest acceptable human\/business\/workflow result/);
  assert.match(html, /Smallest executable ticket\/task unit/);
  assert.match(html, /No live dispatch in Storybook fixture/);
  assert.doesNotMatch(html, /ProductShellSearch|data-shell-control="product-shell-search"|live dispatch authorized|release ready/i);
});
