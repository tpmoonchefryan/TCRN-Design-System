import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { createTokenMap } from "@tcrn/ui-tokens";
import { ProductShell } from "../Navigation/Navigation.js";
import { tcrnComponentCss } from "../../styles/index.js";
import {
  AttachmentList,
  MetadataRail,
  DetailLayout,
  PageHeader,
  RecordInspector,
  RecordRow,
  RecordTable,
  RelationGraph,
  SplitView,
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

test("RecordRow exposes transient navigation target state without changing selected state", () => {
  const html = renderToStaticMarkup(<RecordRow id="r-1" title="Record" state={state} owner="QA" transientTarget />);
  assert.match(html, /data-transient-target="true"/);
  assert.match(html, /data-pattern="record-row"/);
  assert.doesNotMatch(html, /data-selected="true"/);
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

test("PageHeader keeps its trail on one line: every crumb carries its label as a title and the page is the last", () => {
  const html = renderToStaticMarkup(
    <PageHeader
      title="Roster"
      breadcrumbs={[
        { id: "talent", label: "Talent", href: "/talent" },
        { id: "people", label: "People" },
        { id: "roster", label: "Roster" }
      ]}
    />
  );
  // The trail is the Breadcrumb component, the header's first row (TCRN-DS-SUB-124, STORY-143 GWT4).
  assert.match(html, /^<header class="tcrn-page-header[^"]*"[^>]*><nav class="tcrn-breadcrumb" aria-label="Breadcrumbs">/);
  assert.match(html, /<a class="tcrn-breadcrumb__crumb" href="\/talent" title="Talent">Talent<\/a>/);
  assert.match(html, /<span class="tcrn-breadcrumb__crumb" title="People">People<\/span>/);
  assert.match(html, /<b class="tcrn-breadcrumb__crumb" title="Roster" aria-current="page">Roster<\/b>/);
  // One separator between two crumbs, none before the first; separators are the board's 11 chevron and are not read out.
  assert.equal(html.match(/aria-hidden="true" data-icon-name="chevron-right" class="tcrn-icon tcrn-breadcrumb__separator"/g)?.length, 2);
  assert.equal(html.match(/<svg [^>]*width="11" height="11"/g)?.length, 2);
  assert.ok(html.indexOf("tcrn-breadcrumb__separator") > html.indexOf("Talent</a>"));
  // A trail whose last crumb is a link names no current page; the trail's name follows the locale.
  const linked = renderToStaticMarkup(<PageHeader title="Contracts" locale="ja" breadcrumbs={[{ id: "contracts", label: "Contracts", href: "/contracts" }]} />);
  assert.doesNotMatch(linked, /aria-current/);
  assert.match(linked, /aria-label="パンくずリスト"/);
  // Without a trail there is no navigation landmark.
  assert.doesNotMatch(renderToStaticMarkup(<PageHeader title="Settings" />), /<nav/);
});

test("STORY-146 GWT4 SplitView and DetailLayout start at the paper's content edge, with no room kept for a side rail", () => {
  const html = renderToStaticMarkup(
    <ProductShell
      productName="TCRN TMS"
      moduleName="Talent"
      brandProductId="tms"
      currentRouteLabel="Roster"
      pageHeader={{ title: "Roster" }}
      navGroups={[]}
      locales={[{ locale: "en", nativeName: "English" }]}
      currentLocale="en"
    >
      <SplitView list={<p>List</p>} detail={<p>Detail</p>} />
    </ProductShell>
  );
  // The split view is a row of the paper's content, right after the page header: nothing wraps it.
  assert.match(html, /<\/header><div class="tcrn-split-view-frame">/);
  assert.equal(html.includes("tcrn-product-shell__sidebar"), false);
  // Neither layout writes a margin of its own, so its left edge is the content edge.
  const bodies = (selector: string) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return Array.from(tcrnComponentCss.matchAll(new RegExp(`(?:^|\\n|,\\n)${escaped}(?:,\\n[^{]*)? ?\\{([^}]*)\\}`, "g")), (match) => match[1]);
  };
  for (const selector of [".tcrn-split-view-frame", ".tcrn-split-view", ".tcrn-detail-layout"]) {
    const found = bodies(selector);
    assert.ok(found.length > 0, `${selector} has rules`);
    for (const body of found) assert.doesNotMatch(body, /(?:^|[;\s])margin(?:-[a-z-]+)?:/, `${selector} keeps no margin`);
  }
  // The content edge: the paper sits space-3 from the shell and its content twice space-3h inside it.
  assert.match(tcrnComponentCss, /\.tcrn-product-shell__paper \{[^}]*margin: 0 var\(--tcrn-space-3\) var\(--tcrn-space-3\);/);
  assert.match(tcrnComponentCss, /\n\.tcrn-product-shell__main \{[^}]*padding: var\(--tcrn-space-3h\) calc\(2 \* var\(--tcrn-space-3h\)\) var\(--tcrn-space-3\);/);
  const tokens = createTokenMap();
  const edge = Number.parseFloat(tokens["--tcrn-space-3"] ?? "") + 2 * Number.parseFloat(tokens["--tcrn-space-3h"] ?? "");
  assert.equal(edge, 40, "12 from the shell plus the paper's 28");
  // The detail layout is a full-width card of the paper, not held to the document width.
  const detail = renderToStaticMarkup(<DetailLayout title="Contract" main={<p>Main</p>} metadata={[]} />);
  assert.match(detail, /class="tcrn-detail-layout/);
  assert.doesNotMatch(tcrnComponentCss, /\.tcrn-(?:split-view|detail-layout)[^{]*\{[^}]*--tcrn-layout-content-max-w/);
});

test("STORY-146 the page header's title row is the board's .ph: gap 14, a line-2 rule, the title in serif 26 (TCRN-DS-SUB-162)", () => {
  const rule = (selector: string) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const found = new RegExp(`\\n${escaped} \\{([^}]*)\\}`).exec(tcrnComponentCss);
    assert.ok(found, `${selector} has a rule`);
    return found[1];
  };
  const tokens = createTokenMap();
  const px = (variable: string) => Number.parseFloat(tokens[variable]);
  // 07b board .ph: gap 14 between the title and what follows it, padding-bottom 12, a 1 line-2 rule.
  const body = rule(".tcrn-page-header__body");
  assert.match(body, /\n {2}gap: var\(--tcrn-space-3h\);/);
  assert.equal(px("--tcrn-space-3h"), 14);
  const header = [...tcrnComponentCss.matchAll(/\n\.tcrn-page-header \{([^}]*)\}/g)].map((match) => match[1]).join("\n");
  assert.match(header, /border-bottom: 1px solid var\(--tcrn-color-line-2\);/);
  assert.doesNotMatch(header, /border-subtle/);
  assert.match(header, /padding-block-end: var\(--tcrn-space-3\);/);
  assert.equal(px("--tcrn-space-3"), 12);

  // The title is a class, not an element: .tcrn-page-header__title holds the heading of level 2
  // in the scale's writing, which is the board's h2 glyph (serif, 26, regular, tracking -.005em,
  // one line with an ellipsis).
  const html = renderToStaticMarkup(<PageHeader title="Roster" />);
  assert.match(html, /<div class="tcrn-page-header__title"><h2 title="Roster" class="tcrn-heading tcrn-heading--2">Roster<\/h2>/);
  const heading = /\.tcrn-heading--2\{([^}]*)\}/.exec(tcrnComponentCss)?.[1] ?? "";
  assert.match(heading, /font-family:var\(--tcrn-type-family-serif\)/);
  assert.match(heading, /font-size:var\(--tcrn-type-size-heading-2\)/);
  assert.equal(px("--tcrn-type-size-heading-2"), 26);
  assert.match(heading, /font-weight:var\(--tcrn-type-weight-regular\)/);
  assert.match(heading, /letter-spacing:-\.005em/);
  assert.match(heading, /white-space:nowrap;overflow:hidden;text-overflow:ellipsis/);
});

test("STORY-146 STORY-147 PageHeader's title is an h2 by default and an h1 when asked, in the same type either way (TCRN-DS-SUB-163)", () => {
  const h2 = renderToStaticMarkup(<PageHeader title="Roster" description="Everyone signed" />);
  const h1 = renderToStaticMarkup(<PageHeader title="Roster" description="Everyone signed" headingLevel={1} />);
  assert.match(h2, /<h2 [^>]*class="tcrn-heading tcrn-heading--2"[^>]*>Roster<\/h2>/);
  assert.match(h1, /<h1 [^>]*class="tcrn-heading tcrn-heading--2"[^>]*>Roster<\/h1>/);
  assert.equal(h1.replace(/<(\/?)h1\b/g, "<$1h2"), h2, "only the element changes; the classes, so the styles, are the same");
  assert.equal(renderToStaticMarkup(<PageHeader title="Roster" description="Everyone signed" headingLevel={2} />), h2);
  // No rule of the package picks the title out by its element, so h1 and h2 read the same styles.
  const selectors = [...tcrnComponentCss.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{/g)].map((match) => match[1] ?? "");
  assert.deepEqual(selectors.filter((selector) => /(?:^|[^\w-])h1\b/.test(selector)), []);
  assert.deepEqual(selectors.filter((selector) => /(?:^|[^\w-])h2\b/.test(selector) && /page-header/.test(selector)), []);
});
