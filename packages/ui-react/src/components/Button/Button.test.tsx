import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { Button, IconButton, LinkButton } from "./Button.js";
import { tcrnComponentCss } from "../../styles/index.js";
import { actionsPairsCss } from "../../styles/generated/actions.pairs.js";

type Specificity = [number, number, number];

interface StyleRule {
  selectors: string[];
  body: string;
  context: string[];
}

function splitTopLevel(text: string, separator: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const char of text) {
    if (char === "(" || char === "[") depth += 1;
    else if (char === ")" || char === "]") depth -= 1;
    if (char === separator && depth === 0) {
      parts.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function compareSpecificity(left: Specificity, right: Specificity): number {
  return left[0] - right[0] || left[1] - right[1] || left[2] - right[2];
}

function specificity(selector: string): Specificity {
  const total: Specificity = [0, 0, 0];
  let rest = selector.replace(/:(where|is|not|has)\(((?:[^()]|\([^()]*\))*)\)/g, (_match, name: string, args: string) => {
    if (name !== "where") {
      const highest = splitTopLevel(args, ",").map(specificity).sort(compareSpecificity).at(-1) ?? [0, 0, 0];
      total[0] += highest[0];
      total[1] += highest[1];
      total[2] += highest[2];
    }
    return " ";
  });
  rest = rest.replace(/\[[^\]]*\]/g, () => ((total[1] += 1), " "));
  rest = rest.replace(/::[\w-]+/g, () => ((total[2] += 1), " "));
  rest = rest.replace(/#[\w-]+/g, () => ((total[0] += 1), " "));
  rest = rest.replace(/\.[\w-]+/g, () => ((total[1] += 1), " "));
  rest = rest.replace(/:[\w-]+/g, () => ((total[1] += 1), " "));
  rest.replace(/(^|[\s>+~])([a-zA-Z][\w-]*)/g, () => ((total[2] += 1), ""));
  return total;
}

/** Innermost style rules with their enclosing at-rule preludes; comments dropped. */
function styleRules(css: string): StyleRule[] {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules: StyleRule[] = [];
  const stack: string[] = [];
  let buffer = "";
  for (const char of text) {
    if (char === "{") {
      stack.push(buffer.trim());
      buffer = "";
    } else if (char === "}") {
      // A statement at-rule (an import, say) ends in a semicolon before the next prelude.
      const raw = stack.pop() ?? "";
      const prelude = raw.slice(raw.lastIndexOf(";") + 1).trim();
      if (prelude && !prelude.startsWith("@")) {
        rules.push({ selectors: splitTopLevel(prelude, ","), body: buffer.trim(), context: [...stack] });
      }
      buffer = "";
    } else {
      buffer += char;
    }
  }
  return rules;
}

const BUTTON_CLASS = /\.tcrn-(?:button|link-button|icon-button)(?![\w-])/;
// Named colours only as whole words: "white" in white-space is not a colour.
const COLOUR = /#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(|\bcolor-mix\(|--tcrn-color-|(?<![\w-])(?:transparent|currentcolor|white|black)(?![\w-])/i;

/** The compound the selector applies to: the part after the last combinator outside parentheses. */
function subjectOf(selector: string): string {
  const parts = splitTopLevel(selector.replace(/\s*([>+~])\s*/g, " $1 "), " ").filter((part) => !/^[>+~]$/.test(part));
  return (parts.at(-1) ?? "").replace(/:(where|is|not|has)\(((?:[^()]|\([^()]*\))*)\)/g, "");
}

const rules = styleRules(tcrnComponentCss).filter((rule) => !rule.context.some((prelude) => prelude.startsWith("@keyframes")));
const ruleFor = (selector: string) => rules.find((rule) => rule.selectors.includes(selector));
/** Every declaration given to a selector, across the rules that name it, in sheet order. */
const bodiesFor = (selector: string) =>
  rules
    .filter((rule) => rule.selectors.includes(selector))
    .map((rule) => rule.body)
    .join(";");
const contractToken = (cssVar: string): string => {
  const contract = JSON.parse(
    readFileSync(new URL("../../../../../docs/design/gplus-2026-10/contract/tokens.json", import.meta.url), "utf8")
  ) as Record<string, unknown>;
  const found: string[] = [];
  const walk = (node: unknown) => {
    if (Array.isArray(node)) node.forEach(walk);
    else if (node && typeof node === "object") {
      const record = node as Record<string, unknown>;
      if (record.cssVar === cssVar) found.push(String(record.value));
      Object.values(record).forEach(walk);
    }
  };
  walk(contract);
  assert.equal(found.length, 1, `${cssVar} is declared once in the token contract`);
  return found[0];
};

test("core primitives render normalized class names and accessibility attributes", () => {
  assert.match(renderToStaticMarkup(<Button>Save</Button>), /tcrn-button--secondary/);
  assert.match(renderToStaticMarkup(<Button>Save</Button>), /tcrn-button--md/);
  assert.match(renderToStaticMarkup(<Button size="sm">Save</Button>), /tcrn-button--sm/);
  assert.match(renderToStaticMarkup(<Button size="lg" variant="danger">Delete project</Button>), /class="tcrn-button tcrn-button--danger tcrn-button--lg"/);
});

test("disabled controls and icon buttons fail closed with accessible names", () => {
  const disabled = renderToStaticMarkup(<Button disabled>Publish</Button>);
  assert.match(disabled, /data-disabled-reason="Action unavailable in this route"/);
  assert.match(disabled, /title="Publish — Action unavailable in this route"/);
  assert.match(disabled, /aria-describedby="[^"]+"/);
  assert.match(disabled, /class="tcrn-sr-only"/);
  assert.match(disabled, /Action unavailable in this route/);
  assert.doesNotMatch(disabled, /PublishRequires|PublishAction unavailable/);

  const icon = renderToStaticMarkup(<IconButton ariaLabel="   " iconName="menu" />);
  assert.match(icon, /aria-label="Unnamed icon action"/);
  assert.match(icon, /data-icon-name="menu"/);
});

test("a text label sits on one line in the label span and is repeated in title", () => {
  const plain = renderToStaticMarkup(<Button>Export members</Button>);
  assert.match(plain, /<span class="tcrn-button__label">Export members<\/span>/);
  assert.match(plain, /title="Export members"/);

  // A title the caller gives wins over the repeated label.
  assert.match(renderToStaticMarkup(<Button title="Export as CSV">Export</Button>), /title="Export as CSV"/);

  // Text beside an icon is wrapped on its own; the icon stays outside the cut.
  const withIcon = renderToStaticMarkup(
    <Button>
      <span data-probe="icon" />
      New project
    </Button>
  );
  assert.match(withIcon, /<span data-probe="icon"><\/span><span class="tcrn-button__label">New project<\/span>/);

  // An icon button has no visible text, so it gets neither the label span nor a title.
  const iconOnly = renderToStaticMarkup(<IconButton ariaLabel="History" iconName="history" />);
  assert.doesNotMatch(iconOnly, /tcrn-button__label|title=/);

  const link = renderToStaticMarkup(<LinkButton href="/members" size="lg">Members</LinkButton>);
  assert.match(link, /class="tcrn-link-button tcrn-link-button--secondary tcrn-link-button--lg"/);
  assert.match(link, /title="Members"/);
  assert.match(link, /<span class="tcrn-button__label">Members<\/span>/);
});

test("a disabled reason follows the label in title and stays the accessible description", () => {
  // TCRN-DS-SUB-079 (C7): the title holds the visible label, so a label cut by the ellipsis stays
  // readable next to the reason; the reason itself is read through aria-describedby.
  const blocked = renderToStaticMarkup(<Button disabled disabledReason="Needs a selection">Export</Button>);
  assert.match(blocked, /title="Export — Needs a selection"/);
  assert.match(blocked, /<span class="tcrn-button__label">Export<\/span>/);
  assert.match(blocked, /data-disabled-reason="Needs a selection"/);
  const describedBy = blocked.match(/aria-describedby="([^"]+)"/)?.[1];
  assert.ok(describedBy, "the disabled button has a description");
  const escapedId = describedBy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  assert.match(blocked, new RegExp(`<span id="${escapedId}" class="tcrn-sr-only">Needs a selection</span>`));

  // The label is the visible text, and the reason takes the place of a caller's title as before;
  // text beside an icon is the label.
  assert.match(
    renderToStaticMarkup(
      <Button title="Export as CSV" disabled disabledReason="Needs a selection">
        Export
      </Button>
    ),
    /title="Export — Needs a selection"/
  );
  assert.match(
    renderToStaticMarkup(
      <Button disabled disabledReason="Locked">
        <span data-probe="icon" />
        Save draft
      </Button>
    ),
    /title="Save draft — Locked"/
  );

  // With no visible text (an icon button) the title is the reason alone, also when the caller's title
  // repeats the reason; an enabled button shows no reason.
  assert.match(renderToStaticMarkup(<IconButton ariaLabel="History" iconName="history" disabled disabledReason="Needs a selection" />), /title="Needs a selection"/);
  assert.match(
    renderToStaticMarkup(<IconButton ariaLabel="Stays expanded" iconName="history" title="Stays expanded" disabled disabledReason="Stays expanded" />),
    /title="Stays expanded"/
  );
  assert.doesNotMatch(renderToStaticMarkup(<Button disabledReason="Needs a selection">Export</Button>), /Needs a selection/);
});

test("a loading button is busy, shows the loader and says only what the caller passes", () => {
  const busy = renderToStaticMarkup(<Button loading variant="primary">Saving</Button>);
  assert.match(busy, /aria-busy="true"/);
  assert.match(busy, /data-icon-name="loader-circle"/);
  assert.match(busy, /class="[^"]*\btcrn-button__spinner\b[^"]*"/);
  assert.match(busy, /<span class="tcrn-button__label">Saving<\/span>/);
  // No built-in wording in any language: the busy text is the caller's.
  assert.doesNotMatch(busy, /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/);

  const idle = renderToStaticMarkup(<Button variant="primary">Save</Button>);
  assert.doesNotMatch(idle, /aria-busy|loader-circle|tcrn-button__spinner/);

  // The loader takes the icon's place in a square button rather than squeezing in beside it.
  const iconBusy = renderToStaticMarkup(<IconButton ariaLabel="Refresh" iconName="history" loading />);
  assert.match(iconBusy, /data-icon-name="loader-circle"/);
  assert.doesNotMatch(iconBusy, /data-icon-name="history"/);
});

test("icon buttons are square and their icon follows the button size", () => {
  assert.match(renderToStaticMarkup(<IconButton ariaLabel="Menu" iconName="menu" size="sm" />), /width="14"/);
  assert.match(renderToStaticMarkup(<IconButton ariaLabel="Menu" iconName="menu" />), /width="16"/);
  assert.match(renderToStaticMarkup(<IconButton ariaLabel="Menu" iconName="menu" size="lg" />), /width="20"/);
  assert.match(ruleFor(".tcrn-icon-button")?.body ?? "", /inline-size:\s*var\(--tcrn-control-height-md\)/);
  assert.match(ruleFor(".tcrn-icon-button.tcrn-button--sm")?.body ?? "", /inline-size:\s*var\(--tcrn-control-height-sm\)/);
  assert.match(ruleFor(".tcrn-icon-button.tcrn-button--lg")?.body ?? "", /inline-size:\s*var\(--tcrn-control-height-lg\)/);
});

test("125-GWT1: hover, active and pressed rules on a button name no colour and stay at (0,1,0)", () => {
  const stateRules = rules.filter((rule) =>
    rule.selectors.some((selector) => BUTTON_CLASS.test(selector) && /:hover|:active|\[aria-pressed/.test(selector))
  );
  assert.ok(stateRules.length >= 3, "the hover, active and pressed rules are in the sheet");
  for (const rule of stateRules) {
    for (const selector of rule.selectors.filter((item) => BUTTON_CLASS.test(item))) {
      assert.ok(
        compareSpecificity(specificity(selector), [0, 1, 0]) <= 0,
        `${selector} is at most (0,1,0), got (${specificity(selector).join(",")})`
      );
    }
    assert.doesNotMatch(rule.body, COLOUR, `${rule.selectors.join(", ")} switches the pair without naming a colour`);
  }
});

test("the specificity helper behind GWT1 can fail", () => {
  // The C2 injection: a scoped hover rule outranks the variant declarations.
  assert.deepEqual(specificity(".scope .tcrn-button:hover"), [0, 3, 0]);
  assert.deepEqual(specificity('.tcrn-button:where(:hover,[data-tcrn-preview-state="hover"])'), [0, 1, 0]);
  assert.deepEqual(specificity(".tcrn-button.tcrn-button--primary"), [0, 2, 0]);
  assert.deepEqual(specificity(':where(.tcrn-button-group) > .tcrn-button:where(:focus-visible,[data-tcrn-preview-state="focus"])'), [0, 1, 0]);
  assert.ok(COLOUR.test("background: var(--tcrn-color-acc)"));
  assert.ok(COLOUR.test("background: color-mix(in srgb, red 50%, blue)"));
  assert.ok(COLOUR.test("border-color: transparent"));
  assert.equal(COLOUR.test("white-space: nowrap"), false);
});

test("125-GWT5: nothing transforms a button, on press or otherwise", () => {
  const transforming = rules.filter(
    (rule) => rule.selectors.some((selector) => BUTTON_CLASS.test(subjectOf(selector))) && /(?:^|;)\s*transform\s*:/.test(rule.body)
  );
  for (const rule of transforming) {
    assert.match(rule.body, /transform\s*:\s*none\s*(?:;|$)/, `${rule.selectors.join(", ")} sets transform to none only`);
  }
  for (const rule of rules.filter((item) => item.selectors.some((selector) => BUTTON_CLASS.test(subjectOf(selector))))) {
    assert.doesNotMatch(rule.body, /--tcrn-motion-press-scale/, `${rule.selectors.join(", ")} no longer reads the press scale`);
  }
});

test("the family base rule paints only from the live pair, with token geometry", () => {
  // One base rule for Button, IconButton and LinkButton, outside any media query.
  const body = rules
    .filter(
      (rule) =>
        rule.context.length === 0 &&
        rule.selectors.includes(".tcrn-button") &&
        rule.selectors.includes(".tcrn-link-button") &&
        /background/.test(rule.body)
    )
    .map((rule) => rule.body)
    .join(";");
  assert.ok(body, "the family base rule is in the sheet");
  assert.match(body, /background:\s*var\(--tcrn-pair-fill\)/);
  assert.match(body, /(?:^|;)\s*color:\s*var\(--tcrn-pair-ink\)/);
  assert.match(body, /box-shadow:\s*var\(--tcrn-pair-edge\)/);
  assert.match(body, /font-weight:\s*var\(--tcrn-pair-weight\)/);
  assert.match(body, /border-radius:\s*var\(--tcrn-radius-control\)/);
  assert.match(body, /border:\s*0/);
  assert.doesNotMatch(body, COLOUR, "the base rule names no colour of its own");
  assert.doesNotMatch(body, /--tcrn-pair-[a-z]+(?:-[a-z]+)?\s*:/, "the base rule reads the pairs and declares none");

  for (const [size, height, padding] of [
    ["sm", "28px", "10px"],
    ["md", "32px", "12px"],
    ["lg", "40px", "16px"]
  ] as const) {
    const rule = ruleFor(`.tcrn-button--${size}`);
    assert.ok(rule?.selectors.includes(`.tcrn-link-button--${size}`), `${size} is shared with LinkButton`);
    assert.match(rule?.body ?? "", new RegExp(`block-size:\\s*var\\(--tcrn-control-height-${size}\\)`));
    assert.match(rule?.body ?? "", new RegExp(`padding:\\s*0 var\\(--tcrn-control-padding-${size}\\)`));
    assert.equal(contractToken(`--tcrn-control-height-${size}`), height);
    assert.equal(contractToken(`--tcrn-control-padding-${size}`), padding);
  }
  assert.equal(contractToken("--tcrn-radius-control"), "8px");
});

test("the generated pair segment ships, with weight 500 and 600 selected", () => {
  assert.ok(tcrnComponentCss.includes(actionsPairsCss), "actions.pairs.ts is joined into the sheet");
  assert.match(bodiesFor(".tcrn-button"), /--tcrn-pair-weight:\s*500/);
  const pressed = rules.find((rule) => rule.selectors.includes('.tcrn-button:where([aria-pressed="true"])'));
  assert.match(pressed?.body ?? "", /--tcrn-pair-weight:\s*600/);
});

test("secondary and danger are outlined in line-ctl, and danger is red ink on a white face", () => {
  const secondary = ruleFor(".tcrn-button.tcrn-button--secondary")?.body ?? "";
  const danger = ruleFor(".tcrn-button.tcrn-button--danger")?.body ?? "";
  assert.match(secondary, /--tcrn-pair-edge-d:[^;]*var\(--tcrn-color-line-ctl\)/);
  assert.match(danger, /--tcrn-pair-edge-d:[^;]*var\(--tcrn-color-line-ctl\)/);
  assert.match(danger, /--tcrn-pair-fill-d:\s*var\(--tcrn-color-panel\)/);
  assert.match(danger, /--tcrn-pair-ink-d:\s*var\(--tcrn-color-red\)/);
  assert.doesNotMatch(danger, /--tcrn-pair-fill-[a-z]+:\s*var\(--tcrn-color-red\)/, "no state of danger fills with red");
});

test("the focus ring is a box-shadow in the edge pair, with a transparent outline for forced colours", () => {
  for (const variant of ["primary", "secondary", "quiet", "danger"]) {
    assert.match(ruleFor(`.tcrn-button.tcrn-button--${variant}`)?.body ?? "", /--tcrn-pair-edge-f:\s*var\(--tcrn-focus-ring\)/);
  }
  const fallback = ruleFor(".tcrn-button:focus-visible");
  assert.ok(fallback?.selectors.includes(".tcrn-link-button:focus-visible"));
  assert.match(fallback?.body ?? "", /outline:\s*2px solid transparent/);
  assert.match(fallback?.body ?? "", /outline-offset:\s*2px/);
});

test("the loader is shown only while the button is busy", () => {
  const hidden = ruleFor('.tcrn-button:where(:not([aria-busy="true"])) > .tcrn-button__spinner');
  assert.match(hidden?.body ?? "", /display:\s*none/);
  assert.match(bodiesFor('.tcrn-button:where([aria-busy="true"])'), /pointer-events:\s*none/);
});
