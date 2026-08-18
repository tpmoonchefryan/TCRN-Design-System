import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Avatar,
  Card,
  DataGrid,
  Tree,
  DefinitionList,
  Progress,
  Stepper,
  avatarInitials,
  TemplateGallery,
  StatCard,
  TableShell,
  TableToolbar
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


test("STORY-092 a tree reports position in the hierarchy, not just indentation", () => {
  const html = renderToStaticMarkup(
    <Tree label="Pages" expandedIds={["a"]} selectedId="a1"
      nodes={[
        { id: "a", label: "A", children: [{ id: "a1", label: "A1" }, { id: "a2", label: "A2" }] },
        { id: "b", label: "B" }
      ]} />
  );
  assert.match(html, /role="tree"/);
  assert.match(html, /role="group"/);
  // Indentation is visual only; these are the facts a reader who cannot see it needs.
  assert.match(html, /aria-level="1"[^>]*aria-setsize="2"[^>]*aria-posinset="1"/);
  assert.match(html, /aria-level="2"/);
  assert.match(html, /aria-expanded="true"/);
  assert.match(html, /aria-selected="true"/);
  // A leaf has no aria-expanded at all: "collapsed" would be a claim about children
  // it does not have.
  assert.equal((html.match(/aria-expanded=/g) ?? []).length, 1);
});

test("STORY-092 a data grid declares its sort in aria-sort, not in an arrow glyph", () => {
  const html = renderToStaticMarkup(
    <DataGrid label="Rows" sortColumnId="name" sortDirection="ascending" onSort={() => {}}
      columns={[{ id: "name", header: "Name", sortable: true }, { id: "note", header: "Note" }]}
      rows={[{ id: "r1", cells: ["a", "b"] }]} />
  );
  assert.match(html, /role="grid"/);
  assert.match(html, /aria-rowcount="2"/);
  assert.match(html, /aria-colcount="2"/);
  assert.match(html, /aria-sort="ascending"/);
  // A non-sortable column carries no aria-sort at all rather than "none", which
  // would announce it as sortable-but-unsorted.
  assert.equal((html.match(/aria-sort=/g) ?? []).length, 1);
  assert.match(html, /role="gridcell"/);
});
