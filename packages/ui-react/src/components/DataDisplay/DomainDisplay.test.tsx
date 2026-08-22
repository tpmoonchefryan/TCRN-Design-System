import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import {
  AttachmentList,
  MetadataRail,
  RecordInspector,
  RecordTable,
  RelationGraph,
  StagePipeline
} from "./DomainDisplay.js";

const state = { state: "review_required" } as const;

test("AttachmentList is the single attachment presentation for either density", () => {
  const html = renderToStaticMarkup(
    <AttachmentList
      density="comfortable"
      items={[{ id: "ref-1", label: "Screenshot", reference: "artifact://shot", state }]}
    />
  );

  assert.match(html, /data-pattern="attachment-list"/);
  assert.match(html, /tcrn-attachment-list--comfortable/);
  assert.match(html, /Screenshot/);
  assert.match(html, /artifact:\/\/shot/);
});

test("MetadataRail composes the existing DetailInspector instead of cloning it", () => {
  const html = renderToStaticMarkup(
    <MetadataRail title="Metadata" items={[{ key: "owner", label: "Owner", value: "QA" }]} labels={["static"]} />
  );

  assert.match(html, /data-pattern="metadata-rail"/);
  assert.match(html, /tcrn-detail-inspector/);
  assert.match(html, /static/);
});

test("RecordTable and RelationGraph accept generic records and open relation descriptions", () => {
  const table = renderToStaticMarkup(
    <RecordTable rows={[{ id: "r-1", title: "Record", state, owner: "QA" }]} />
  );
  const graph = renderToStaticMarkup(
    <RelationGraph
      nodes={[{ id: "r-1", title: "Record" }, { id: "r-2", title: "Another record" }]}
      edges={[{ from: "r-1", to: "r-2", relation: "handoff" }]}
    />
  );

  assert.match(table, /data-pattern="record-table"/);
  assert.match(table, /data-pattern="record-row"/);
  assert.match(graph, /data-relationship="handoff"/);
});

test("StagePipeline uses supporting references and remains presentation-only", () => {
  const html = renderToStaticMarkup(
    <StagePipeline
      stages={[{ id: "stage-1", label: "Review", state, owner: "QA", references: ["checklist"] }]}
    />
  );

  assert.match(html, /data-pattern="stage-pipeline"/);
  assert.match(html, /Supporting references/);
  assert.match(html, /checklist/);
  assert.doesNotMatch(html, /data-evidence=/);
});

test("RecordInspector composes core detail inspection for hierarchy and details", () => {
  const html = renderToStaticMarkup(
    <RecordInspector
      title="Record"
      summary="Summary"
      hierarchy={[{ key: "parent", label: "Parent", value: "Root" }]}
      details={[{ key: "state", label: "State", value: "Review" }]}
      attachments={[{ id: "ref-1", label: "Reference", reference: "artifact://ref" }]}
    />
  );

  assert.match(html, /data-pattern="record-inspector"/);
  assert.equal((html.match(/tcrn-detail-inspector/g) ?? []).length, 2);
  assert.match(html, /data-pattern="attachment-list"/);
});
