// ShellDropdown (TCRN-DS-SUB-118): the drop-down's hooks and semantics and the rules that place and
// size it — hand-off 6 under the pinned item at its start edge, 240 wide, inset 6, search 28, rows
// with no icon column and text 16 in, cascades 4 to the right, as wide and as tall as the column on
// their left. The rendered readings are the shell gate's (TCRN-DS-SUB-137); the interactions are in
// src/test/shell-dropdown.dom.spec.tsx.
import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { tcrnSupportedLocales } from "@tcrn/ui-copy-state";
import { createTokenMap } from "@tcrn/ui-tokens";
import { tcrnComponentCss } from "../../styles/index.js";
import { shellCss03, shellCss04 } from "../../styles/shell.css.js";
import { ShellDropdown } from "./ShellDropdown.js";
import type { ShellMenuItem } from "./ShellMenu.js";
import { tcrnShellCopy } from "./shell-copy.js";

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function ruleBody(selector: string, css: string): string {
  const match = new RegExp(`\\n\\s*${escapeRegExp(selector)} \\{\\n([^}]*)\\}`).exec(css);
  assert.ok(match, `${selector} has a rule`);
  return match[1];
}

function declaration(body: string, property: string): string {
  const match = new RegExp(`\\n\\s*${escapeRegExp(property)}: ([^;]+);`).exec(`\n${body}`);
  assert.ok(match, `${property} is declared`);
  return match[1];
}

// The 07a board's pinned 合约: four entries, 模板 with four fourth-level entries.
const contracts: ShellMenuItem = {
  id: "contracts",
  label: "合约",
  children: [
    { id: "contract-list", label: "合约列表", href: "#contract-list" },
    {
      id: "templates",
      label: "模板",
      children: [
        { id: "signing", label: "签约合同", href: "#signing" },
        { id: "agency", label: "经纪合同", href: "#agency" },
        { id: "event", label: "活动合同", href: "#event" },
        { id: "nda", label: "保密协议", href: "#nda" }
      ]
    },
    { id: "approval", label: "审批", href: "#approval" },
    { id: "expiry", label: "到期提醒", href: "#expiry" }
  ]
};

const render = (extra: Partial<Parameters<typeof ShellDropdown>[0]> = {}) =>
  renderToStaticMarkup(
    <ShellDropdown id="drop-contracts" source={contracts} open pinnedIds={["contracts"]} onPinnedChange={() => undefined} locale="zh-CN" {...extra} />
  );

test("the drop-down is a non-modal dialog with the shell hooks, rows without an icon column and pins", () => {
  assert.equal(renderToStaticMarkup(<ShellDropdown id="drop" source={contracts} open={false} />), "");
  const html = render();
  assert.match(html, /^<div class="tcrn-shell-menu tcrn-shell-dropdown" style="visibility:hidden" data-shell-dropdown="">/);
  assert.match(html, /<section id="drop-contracts" class="tcrn-shell-dropdown__panel" role="dialog" aria-modal="false" aria-label="合约" data-panel="drop">/);
  assert.equal((html.match(/role="dialog"/g) ?? []).length, 1);
  assert.match(html, /<div data-shell-search="" class="tcrn-product-shell-search tcrn-shell-menu__search tcrn-shell-dropdown__search"/);
  assert.match(html, /<input(?=[^>]*type="search")(?=[^>]*placeholder="搜索合约")[^>]*>/);
  assert.doesNotMatch(html, /<kbd/, "the drop-down's search shows no ⌘K: that key opens the full menu");
  assert.equal((html.match(/data-shell-row=""/g) ?? []).length, 4);
  assert.equal((html.match(/data-shell-level="3"/g) ?? []).length, 4);
  assert.equal((html.match(/data-nav-item-has-icon="false"/g) ?? []).length, 4, "no icon column");
  assert.equal((html.match(/data-pin-button=""/g) ?? []).length, 4);
  // 模板 opens its fourth level: a button for its cascade column, closed until clicked.
  assert.match(html, /<a(?=[^>]*role="button")(?=[^>]*aria-expanded="false")(?=[^>]*aria-controls="drop-contracts-col-templates")[^>]*>/);
  assert.equal((html.match(/data-drop-col/g) ?? []).length, 0);
});

test("a pinned group lists its items as second-level rows; a fourth-level source shows no next level", () => {
  const group = { id: "talent", label: "艺人", items: [contracts, { id: "roster", label: "名册", href: "#roster" }] };
  const html = renderToStaticMarkup(<ShellDropdown id="drop-talent" source={group} open />);
  assert.equal((html.match(/data-shell-level="2"/g) ?? []).length, 2);
  assert.match(html, /aria-controls="drop-talent-col-contracts"/);
  const deep = renderToStaticMarkup(<ShellDropdown id="drop-templates" source={contracts} level={4} open />);
  assert.doesNotMatch(deep, /chevron-right|role="button"/);
  assert.equal((deep.match(/aria-expanded=/g) ?? []).length, 1, "only the search's combobox says aria-expanded");
});

test("it hangs 6 under the pinned item at its start edge, 240 wide, inset 6, search 28, text 16 in", () => {
  const root = ruleBody(".tcrn-shell-menu.tcrn-shell-dropdown", shellCss04);
  assert.equal(declaration(root, "position"), "fixed");
  assert.equal(declaration(root, "margin-top"), "var(--tcrn-shell-menu-gap)");
  assert.equal(declaration(root, "grid-template-columns"), "var(--tcrn-shell-drop-w)");
  assert.equal(declaration(root, "inline-size"), "var(--tcrn-shell-drop-w)");
  const panel = ruleBody(".tcrn-shell-dropdown__panel", shellCss04);
  assert.equal(declaration(panel, "padding"), "var(--tcrn-space-1h)");
  assert.equal(declaration(panel, "border-radius"), "var(--tcrn-radius-panel)");
  assert.equal(declaration(panel, "box-shadow"), "var(--tcrn-shadow-s3)");
  const search = ruleBody(".tcrn-shell-dropdown__search .tcrn-search-input", shellCss04);
  assert.equal(declaration(search, "--tcrn-search-input-block-size"), "var(--tcrn-shell-drop-srch-h)");
  assert.equal(declaration(search, "--tcrn-search-input-padding-inline"), "var(--tcrn-space-2)");
  // The rows are the full menu's: no icon column outside its group columns, start inset space-2h.
  assert.equal(declaration(ruleBody(".tcrn-shell-menu .tcrn-nav-item", shellCss03), "padding"), "0 var(--tcrn-space-1) 0 var(--tcrn-space-2h)");
  const tokens = createTokenMap();
  const px = (variable: string) => Number.parseFloat(tokens[variable]);
  assert.equal(px("--tcrn-shell-menu-gap"), 6);
  assert.equal(px("--tcrn-shell-drop-w"), 240);
  assert.equal(px("--tcrn-space-1h"), 6);
  assert.equal(px("--tcrn-shell-drop-srch-h"), 28);
  assert.equal(px("--tcrn-space-1h") + px("--tcrn-space-2h"), 16, "text starts 16 in");
  // 07a geometry: item bottom 42 → top 48, first row 88, bottom 228 with four rows (spec-geom).
  const top = 42 + px("--tcrn-shell-menu-gap");
  const firstRow = top + px("--tcrn-space-1h") + px("--tcrn-shell-drop-srch-h") + px("--tcrn-space-1") + px("--tcrn-space-0h");
  assert.equal(firstRow, 88);
  assert.equal(firstRow + 4 * px("--tcrn-shell-row-h") + 3 * px("--tcrn-space-0h") + px("--tcrn-space-1h"), 228);
  assert.ok(tcrnComponentCss.includes(shellCss04), "the segment ships in tcrnComponentCss");
});

test("cascades sit 4 to the right, as wide, as tall as the column on their left by the grid row", () => {
  const root = ruleBody(".tcrn-shell-menu", shellCss03);
  assert.equal(declaration(root, "grid-auto-columns"), "var(--tcrn-shell-drop-w)");
  assert.equal(declaration(root, "column-gap"), "var(--tcrn-shell-cascade-gap)");
  assert.equal(declaration(root, "align-items"), "stretch");
  assert.equal(declaration(ruleBody(".tcrn-shell-menu .tcrn-shell-menu__cascade", shellCss03), "contain"), "size");
  assert.equal(Number.parseFloat(createTokenMap()["--tcrn-shell-cascade-gap"]), 4);
  // No height is written by script or by a fixed value.
  assert.doesNotMatch(shellCss04, /height/);
  assert.doesNotMatch(render(), /style="[^"]*height/);
});

test("the drop-down's search placeholder is written in all five locales", () => {
  for (const locale of tcrnSupportedLocales) {
    const placeholder = tcrnShellCopy[locale].searchWithin("合约");
    assert.ok(placeholder.includes("合约"), `${locale} names the entry`);
    assert.match(render({ locale }), new RegExp(`placeholder="${escapeRegExp(placeholder)}"`));
  }
  assert.equal(tcrnShellCopy.en.searchWithin("Contracts"), "Search Contracts");
});

test("a row marked open in previewStates starts with its next level open, on the server too (TCRN-DS-SUB-151)", () => {
  const html = renderToStaticMarkup(<ShellDropdown id="drop" source={contracts} open previewStates={{ templates: "open" }} />);
  assert.match(html, /data-drop-col="2"/);
  assert.match(html, /aria-owns="drop-col-templates"/);
  assert.match(html, /<[a-z]+(?=[^>]*aria-controls="drop-col-templates")(?=[^>]*aria-expanded="true")[^>]*>/);
  assert.doesNotMatch(renderToStaticMarkup(<ShellDropdown id="drop" source={contracts} open />), /data-drop-col=/);
  // Only "open" opens, and only a row with a next level.
  assert.doesNotMatch(renderToStaticMarkup(<ShellDropdown id="drop" source={contracts} open previewStates={{ templates: "hover" }} />), /data-drop-col=/);
  assert.doesNotMatch(renderToStaticMarkup(<ShellDropdown id="drop" source={contracts} open previewStates={{ "contract-list": "open" }} />), /data-drop-col=/);
  // A space-separated list of states counts as it does for the CSS (~=).
  assert.match(renderToStaticMarkup(<ShellDropdown id="drop" source={contracts} open previewStates={{ templates: "hover open" }} />), /data-drop-col="2"/);
});
