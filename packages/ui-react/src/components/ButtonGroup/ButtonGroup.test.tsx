import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { Button, IconButton } from "../Button/index.js";
import { ButtonGroup } from "./ButtonGroup.js";
import { tcrnComponentCss } from "../../styles/index.js";

const sheet = tcrnComponentCss.replace(/\/\*[\s\S]*?\*\//g, "");

/** Declarations of the rules whose selector list holds exactly this selector, outside media queries too. */
function declarationsOf(selector: string): string[] {
  const found: string[] = [];
  const pattern = /([^{}]+)\{([^{}]*)\}/g;
  for (let match = pattern.exec(sheet); match; match = pattern.exec(sheet)) {
    const selectors = match[1].split(/,(?![^()]*\))/).map((item) => item.trim());
    if (selectors.includes(selector)) found.push(...match[2].split(";").map((item) => item.trim()).filter(Boolean));
  }
  return found;
}

const SEPARATOR = '<span class="tcrn-button-group__separator" aria-hidden="true"></span>';

test("a button group is a named role=group with a separator between neighbours", () => {
  const html = renderToStaticMarkup(
    <ButtonGroup ariaLabel="View">
      <IconButton ariaLabel="List" iconName="menu" aria-pressed="true" />
      <IconButton ariaLabel="Grid" iconName="layout-grid" aria-pressed="false" />
    </ButtonGroup>
  );
  assert.match(html, /^<div role="group" aria-label="View" class="tcrn-button-group">/);
  assert.equal(html.split(SEPARATOR).length - 1, 1);
  assert.match(html, /<\/button><span class="tcrn-button-group__separator" aria-hidden="true"><\/span><button/);
  // Single choice is said by aria-pressed on the members; the group holds no choice.
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /aria-pressed="false"/);
});

test("separators go only between rendered members", () => {
  const html = renderToStaticMarkup(
    <ButtonGroup ariaLabel="Import and export">
      <Button>Import</Button>
      {null}
      <Button>Export</Button>
      {false}
      <IconButton ariaLabel="More" iconName="chevron-down" />
    </ButtonGroup>
  );
  assert.equal(html.split(SEPARATOR).length - 1, 2);
  assert.doesNotMatch(html, /class="tcrn-button-group"><span class="tcrn-button-group__separator"/);
  assert.doesNotMatch(html, /aria-hidden="true"><\/span><\/div>$/);
  assert.equal(renderToStaticMarkup(<ButtonGroup ariaLabel="Alone"><Button>Only</Button></ButtonGroup>).includes(SEPARATOR), false);
});

test("a group without a usable name fails closed to a generic one", () => {
  assert.match(renderToStaticMarkup(<ButtonGroup ariaLabel="   "><Button>One</Button></ButtonGroup>), /aria-label="Unnamed button group"/);
});

test("the quiet group is marked for its lighter treatment", () => {
  const html = renderToStaticMarkup(
    <ButtonGroup ariaLabel="Tools" variant="quiet">
      <IconButton ariaLabel="Undo" iconName="arrow-left" variant="quiet" />
      <IconButton ariaLabel="Redo" iconName="arrow-right" variant="quiet" />
    </ButtonGroup>
  );
  assert.match(html, /class="tcrn-button-group tcrn-button-group--quiet"/);
  assert.deepEqual(declarationsOf(".tcrn-button-group--quiet"), ["box-shadow: none"]);
  assert.deepEqual(declarationsOf(".tcrn-button-group--quiet > .tcrn-button-group__separator"), ["background: var(--tcrn-color-line-2)"]);
});

test("the group draws one shared outline and clips nothing, so a member's ring is whole", () => {
  const group = declarationsOf(".tcrn-button-group");
  assert.ok(group.includes("isolation: isolate"));
  assert.ok(group.some((item) => /^box-shadow:.*var\(--tcrn-color-line-ctl\)$/.test(item)));
  assert.ok(group.includes("border-radius: var(--tcrn-radius-control)"));
  for (const selector of [".tcrn-button-group", ".tcrn-button-group > .tcrn-button", ".tcrn-button-group__separator"]) {
    assert.equal(declarationsOf(selector).some((item) => item.startsWith("overflow") || item.startsWith("clip")), false, `${selector} clips nothing`);
  }
  assert.deepEqual(declarationsOf(".tcrn-button-group__separator"), ["flex: 0 0 auto", "inline-size: 1px", "background: var(--tcrn-color-line-ctl)"]);
});

test("members drop their own edges and square their inner corners", () => {
  const member = declarationsOf(".tcrn-button-group > .tcrn-button");
  for (const state of ["d", "h", "a", "x", "l", "s"]) {
    assert.ok(member.includes(`--tcrn-pair-edge-${state}: 0 0 #0000`), `edge ${state} is cleared in a group`);
  }
  // In focus only the ring is drawn; the member's own outline stays cleared.
  assert.ok(member.includes("--tcrn-pair-edge-f: var(--tcrn-focus-ring)"));
  assert.ok(member.includes("border-radius: 0"));
  assert.ok(member.includes("margin-inline-start: 1px"));
  assert.ok(declarationsOf(".tcrn-button-group > .tcrn-button:first-child").includes("border-start-start-radius: var(--tcrn-radius-control)"));
  assert.ok(declarationsOf(".tcrn-button-group > .tcrn-button:last-child").includes("border-end-end-radius: var(--tcrn-radius-control)"));

  // Same (0,2,0) as the generated variant declarations, so the member rule must come after them.
  const variants = tcrnComponentCss.indexOf(".tcrn-button.tcrn-button--danger{");
  const members = tcrnComponentCss.indexOf(".tcrn-button-group > .tcrn-button {");
  assert.ok(variants >= 0 && members > variants, "the member rule follows the variant declarations");
});

test("125-GWT4: the focused member is raised above its neighbours at (0,1,0)", () => {
  assert.deepEqual(
    declarationsOf(':where(.tcrn-button-group) > .tcrn-button:where(:focus-visible,[data-tcrn-preview-state="focus"])'),
    ["z-index: 1"]
  );
  // The raise needs a positioned member, which the family base rule provides.
  assert.ok(declarationsOf(".tcrn-button").includes("position: relative"));
});
