import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { tcrnTokens } from "@tcrn/ui-tokens";
import { tcrnComponentCss } from "../../styles/index.js";
import { Icon, tcrnIconNames, type IconName } from "./Icon.js";
import { tcrnIconNewNames, tcrnIconPaths } from "./icon-paths.generated.js";

interface IconContract {
  viewBox: string;
  strokeWidth: number;
  icons: { name: string; new: boolean; body: string; variants?: Record<string, { fill: number[] }> }[];
}

// The compiled test sits at packages/ui-react/dist/components/Icon/, five levels below
// the repository root that holds the design contract.
const iconContract = JSON.parse(
  readFileSync(new URL("../../../../../docs/design/gplus-2026-10/contract/icons.json", import.meta.url), "utf8")
) as IconContract;

function tokenValue(variable: string): string | undefined {
  return tcrnTokens.find((entry) => entry.variable === variable)?.value;
}

function svgOpeningTag(markup: string): string {
  return markup.slice(0, markup.indexOf(">") + 1);
}

// React writes SVG children with closing tags. Folding them back to the generated
// self-closing form, and requiring vector-effect on each to do it, makes "every child
// is non-scaling" and "the children are exactly the contract paths" one comparison.
function childrenAsContractMarkup(markup: string): string {
  const inner = markup.slice(markup.indexOf(">") + 1, markup.lastIndexOf("</svg>"));
  return inner.replace(/<(path|circle|ellipse|rect) vector-effect="non-scaling-stroke"([^>]*)><\/\1>/g, "<$1$2/>");
}

test("the roster is the icons.json name set: 38 names, the 9 G+ ones and pin included", () => {
  assert.equal(tcrnIconNames.length, 38);
  assert.deepEqual([...tcrnIconNames], iconContract.icons.map((icon) => icon.name));
  assert.equal(new Set(tcrnIconNames).size, tcrnIconNames.length);
  assert.deepEqual(
    [...tcrnIconNewNames],
    iconContract.icons.filter((icon) => icon.new).map((icon) => icon.name)
  );
  for (const name of ["plus", "minus", "users", "bell", "copy", "trash", "calendar", "more-horizontal", "chevron-up", "pin"] as const) {
    assert.ok(tcrnIconNames.includes(name), name);
  }
  for (const name of ["search", "menu", "panel-left-close", "sun", "moon", "globe-2", "loader-circle"] as const) {
    assert.ok(tcrnIconNames.includes(name), name);
  }
});

// TCRN-DS-SUB-123 (STORY-142 GWT3): the pin that replaces the star has two states, the outline
// one a row shows on hover and focus and the solid one a pinned row keeps. They are one roster
// name with two variants, so the roster counts 38, not 39; a variant names the body children it
// fills with currentColor and leaves the rest stroked.
test("pin is one roster name with an outline and a solid variant", () => {
  const pin = iconContract.icons.find((icon) => icon.name === "pin");
  assert.ok(pin, "icons.json lists pin");
  assert.equal(iconContract.icons.filter((icon) => icon.name.startsWith("pin")).length, 1, "the solid pin is a variant, not a second name");
  assert.deepEqual(Object.keys(pin.variants ?? {}).sort(), ["outline", "solid"]);
  assert.deepEqual(pin.variants?.outline.fill, []);
  assert.deepEqual(pin.variants?.solid.fill, [0]);
  // The filled child is the pin body (the closed head and shoulders), not the bar or the needle.
  const children = [...pin.body.matchAll(/<path d="([^"]*)"\/>/g)].map((match) => match[1]);
  assert.deepEqual(children, ["M8 3.5h4v5.5l2.5 2.5v1.5h-9v-1.5L8 9z", "M6.5 3.5h7", "M10 13v3.5"]);
  for (const icon of iconContract.icons) {
    for (const [variant, { fill }] of Object.entries(icon.variants ?? {})) {
      const count = [...icon.body.matchAll(/<(?:path|circle|ellipse|rect)\b/g)].length;
      for (const index of fill) assert.ok(Number.isInteger(index) && index >= 0 && index < count, `${icon.name}/${variant}: child ${index} exists`);
    }
  }
  // The package draws the outline; the solid state is the same paths with the body filled,
  // so the rendered children are the contract body either way.
  assert.equal(childrenAsContractMarkup(renderToStaticMarkup(<Icon name="pin" />)), pin.body);
});

test("every icon renders its contract paths on the 20 grid with a 1.25 non-scaling stroke", () => {
  assert.equal(iconContract.viewBox, "0 0 20 20");
  assert.equal(iconContract.strokeWidth, 1.25);
  for (const icon of iconContract.icons) {
    const name = icon.name as IconName;
    assert.equal(tcrnIconPaths[name], icon.body, `${name}: generated paths match the contract`);
    const markup = renderToStaticMarkup(<Icon name={name} />);
    const svg = svgOpeningTag(markup);
    assert.match(svg, /viewBox="0 0 20 20"/, name);
    assert.match(svg, /stroke-width="1.25"/, name);
    assert.match(svg, /fill="none"/, name);
    assert.match(svg, /stroke="currentColor"/, name);
    assert.match(svg, /stroke-linecap="round"/, name);
    assert.match(svg, /stroke-linejoin="round"/, name);
    assert.equal(childrenAsContractMarkup(markup), icon.body, `${name}: children are the contract paths, each non-scaling`);
  }
});

test("sm, md and lg are the icon size tokens; a number is used as given", () => {
  const steps = [
    ["sm", "--tcrn-icon-size-sm"],
    ["md", "--tcrn-icon-size-md"],
    ["lg", "--tcrn-icon-size-lg"]
  ] as const;
  for (const [size, variable] of steps) {
    const pixels = Number.parseFloat(tokenValue(variable) ?? "");
    const svg = svgOpeningTag(renderToStaticMarkup(<Icon name="search" size={size} />));
    assert.match(svg, new RegExp(`width="${pixels}" height="${pixels}"`), size);
    // The stroke does not follow the size: one width at every step.
    assert.match(svg, /stroke-width="1.25"/, size);
  }
  assert.deepEqual(steps.map(([, variable]) => tokenValue(variable)), ["14px", "16px", "20px"]);
  assert.match(svgOpeningTag(renderToStaticMarkup(<Icon name="search" />)), /width="16" height="16"/);
  assert.match(svgOpeningTag(renderToStaticMarkup(<Icon name="copy" size={13} />)), /width="13" height="13"/);
});

test("names outside the roster and a strokeWidth override do not type-check", () => {
  // @ts-expect-error: a name outside the closed roster is a compile error.
  const outside = <Icon name="sparkles" />;
  // @ts-expect-error: strokeWidth is no longer a prop; the stroke is the contract.
  const thicker = <Icon name="search" strokeWidth={2} />;
  assert.ok(outside && thicker);
  // Forced through anyway, the contract stroke still wins.
  const forced = { name: "search", strokeWidth: 2 } as unknown as Parameters<typeof Icon>[0];
  assert.match(svgOpeningTag(renderToStaticMarkup(<Icon {...forced} />)), /stroke-width="1.25"/);
  assert.doesNotMatch(renderToStaticMarkup(<Icon {...forced} />), /stroke-width="2"/);
});

test("decorative and accessible-name behaviour is unchanged", () => {
  const decorative = renderToStaticMarkup(<Icon name="search" />);
  assert.match(decorative, /class="[^"]*tcrn-icon/);
  assert.match(decorative, /data-icon-name="search"/);
  assert.match(decorative, /aria-hidden="true"/);
  assert.match(decorative, /focusable="false"/);
  assert.doesNotMatch(decorative, /role=/);
  assert.doesNotMatch(decorative, /aria-label=/);

  const named = renderToStaticMarkup(<Icon name="menu" decorative={false} title="Open navigation" />);
  assert.match(named, /role="img"/);
  assert.match(named, /aria-label="Open navigation"/);
  assert.doesNotMatch(named, /aria-hidden="true"/);

  // A title or an aria-label alone is enough to make the icon an image.
  const titled = renderToStaticMarkup(<Icon name="bell" title="Notifications" />);
  assert.match(titled, /role="img"/);
  assert.match(titled, /aria-label="Notifications"/);
  assert.doesNotMatch(titled, /aria-hidden=/);
  const labelled = renderToStaticMarkup(<Icon name="trash" aria-label="Delete" />);
  assert.match(labelled, /role="img"/);
  assert.match(labelled, /aria-label="Delete"/);

  const merged = renderToStaticMarkup(<Icon name="x" className="host-icon" data-doc-shell-icon="close" />);
  assert.match(merged, /class="tcrn-icon host-icon"/);
  assert.match(merged, /data-doc-shell-icon="close"/);

  // The doc shell smoke test treats this attribute run as a hand-drawn svg, so the
  // package icon must not produce it.
  assert.doesNotMatch(decorative, /viewBox="0 0 20 20" focusable="false" aria-hidden="true"/);
});

test("loader-circle turns on the loading loop token and stops under reduced motion", () => {
  assert.equal(tokenValue("--tcrn-motion-loading-loop"), "900ms linear");
  assert.match(
    tcrnComponentCss,
    /\.tcrn-icon\[data-icon-name="loader-circle"\] \{[^}]*animation: tcrn-icon-spin var\(--tcrn-motion-loading-loop\) infinite;/
  );
  assert.match(tcrnComponentCss, /@keyframes tcrn-icon-spin \{\s*to \{\s*transform: rotate\(360deg\);/);
  assert.match(
    tcrnComponentCss,
    /@media \(prefers-reduced-motion: reduce\) \{\s*\.tcrn-icon\[data-icon-name="loader-circle"\] \{\s*animation: none;/
  );
  assert.match(renderToStaticMarkup(<Icon name="loader-circle" />), /data-icon-name="loader-circle"/);
});
