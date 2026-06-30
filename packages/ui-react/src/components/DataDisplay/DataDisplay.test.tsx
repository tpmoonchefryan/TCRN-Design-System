import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { WorkIndex, TableShell } from "./DataDisplay.js";
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
