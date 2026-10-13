// ShellBrandButton (TCRN-DS-SUB-114): the measurement hooks and the first lockup line, the two
// versions, the accessible name in five locales, the registered mark bytes, the geometry tokens,
// the state pairs and the suffix contrast on the hover wash. The rendered geometry is read by the
// shell gate (TCRN-DS-SUB-137); here the rules are held to the tokens they must read.
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { tcrnSupportedLocales } from "@tcrn/ui-copy-state";
import { createResolvedTokenMap, createTokenMap } from "@tcrn/ui-tokens";
import { tcrnComponentCss } from "../../styles/index.js";
import { shellCss01 } from "../../styles/shell.css.js";
import { createDomInteractionHarness } from "../../test/dom-harness.js";
import { ShellBrandButton } from "./ShellBrandButton.js";
import type { TcrnProductMarkId } from "./Navigation.js";
import { tcrnProductMarks } from "./product-marks.generated.js";
import { tcrnShellCopy } from "./shell-copy.js";

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The declarations of the rule whose selector is exactly `selector` in the shell segment. */
function ruleBody(selector: string): string {
  const match = new RegExp(`\\n\\s*${escapeRegExp(selector)} \\{\\n([^}]*)\\}`).exec(shellCss01);
  assert.ok(match, `${selector} has a rule`);
  return match[1];
}

const sha256 = (text: string) => createHash("sha256").update(text).digest("hex");

test("the brand button carries the shell hooks and the first lockup line (C-5, C-6)", () => {
  const html = renderToStaticMarkup(<ShellBrandButton productId="tms" locale="en" />);
  assert.match(
    html,
    /^<button type="button" class="tcrn-shell-brand" aria-label="Open navigation · TCRN TMS" aria-expanded="false" aria-haspopup="dialog" data-tab="" data-shell-brand="v2" data-shell-brand-auto="">/
  );
  assert.match(html, /<span class="tcrn-shell-brand__line" data-lockup="lkr-line"><svg aria-hidden="true" data-logo="tms" data-guide="tab" class="tcrn-brand-mark tcrn-shell-brand__mark"/);
  assert.match(html, /<b class="tcrn-shell-brand__word" title="TCRN TMS">TCRN <em class="tcrn-shell-brand__suffix tcrn-shell-brand__suffix--tms">TMS<\/em><\/b><\/span>/);
  assert.match(html, /<span class="tcrn-shell-brand__toggle" data-shell-toggle=""><svg[^>]* width="16" height="16"[^>]*data-icon-name="chevron-down"/);
  // A serif product is its whole name, with no suffix.
  const serif = renderToStaticMarkup(<ShellBrandButton productId="einzbern" locale="en" />);
  assert.match(serif, /class="tcrn-shell-brand tcrn-shell-brand--serif"/);
  assert.match(serif, /<b class="tcrn-shell-brand__word" title="Einzbern">Einzbern<\/b>/);
});

test("the first version is the mark and the toggle; the open button says so and shows the up chevron", () => {
  const first = renderToStaticMarkup(<ShellBrandButton productId="tms" version="v1" locale="en" />);
  assert.match(first, /data-shell-brand="v1"/);
  assert.doesNotMatch(first, /data-shell-brand-auto/);
  assert.doesNotMatch(first, /tcrn-shell-brand__word/);
  assert.match(first, /data-logo="tms"/);
  assert.match(first, /data-shell-toggle=""/);
  const second = renderToStaticMarkup(<ShellBrandButton productId="tms" version="v2" locale="en" />);
  assert.match(second, /data-shell-brand="v2"/);
  assert.doesNotMatch(second, /data-shell-brand-auto/);

  const open = renderToStaticMarkup(<ShellBrandButton productId="tms" expanded locale="zh-CN" />);
  assert.match(open, /aria-label="收起导航 · TCRN TMS" aria-expanded="true" aria-haspopup="dialog"/);
  assert.match(open, /data-icon-name="chevron-up"/);
  assert.match(renderToStaticMarkup(<ShellBrandButton productId="tms" locale="zh-CN" />), /aria-label="展开导航 · TCRN TMS"/);
});

test("the button's name is written in all five locales, open and closed apart", () => {
  assert.deepEqual(Object.keys(tcrnShellCopy).sort(), [...tcrnSupportedLocales].sort());
  for (const locale of tcrnSupportedLocales) {
    const copy = tcrnShellCopy[locale];
    const open = copy.openNavigationOf("TCRN TMS");
    const close = copy.closeNavigationOf("TCRN TMS");
    assert.ok(open.endsWith(" · TCRN TMS") && close.endsWith(" · TCRN TMS"), `${locale} names the product`);
    assert.notEqual(open, close, `${locale} tells opening from closing`);
    assert.match(renderToStaticMarkup(<ShellBrandButton productId="tms" locale={locale} />), new RegExp(`aria-label="${escapeRegExp(open)}"`));
  }
});

test("the mark is the registered colour mark: its SVG body has the digest of logos2/<product>.svg", () => {
  for (const mark of tcrnProductMarks) {
    const html = renderToStaticMarkup(<ShellBrandButton productId={mark.productId as TcrnProductMarkId} />);
    const drawn = new RegExp(`<svg[^>]*data-logo="${escapeRegExp(mark.productId)}"[^>]*>([\\s\\S]*?)</svg>`).exec(html);
    assert.ok(drawn, `${mark.productId} draws its mark`);
    assert.match(drawn[0], /data-product-mark-variant="color"/);
    const file = readFileSync(new URL(`../../../../../docs/design/gplus-2026-10/logos2/${mark.id}.svg`, import.meta.url), "utf8");
    const body = /^<svg[^>]*>([\s\S]*)<\/svg>\n?$/.exec(file);
    assert.ok(body, `logos2/${mark.id}.svg is one svg element`);
    assert.equal(sha256(drawn[1]), sha256(body[1]), `${mark.productId}: the drawn mark is the file's`);
  }
  // Colour and opaque: no opacity and no filter on the button, its line or its mark.
  assert.doesNotMatch(shellCss01, /opacity|filter/);
});

test("the geometry reads the shell tokens: 134 by 40, a 20 toggle, 6 from the band's top", () => {
  const base = ruleBody(".tcrn-shell-brand");
  assert.match(base, /\n {2}inline-size: var\(--tcrn-shell-brand-w\);/);
  assert.match(base, /\n {2}block-size: var\(--tcrn-shell-brand-h\);/);
  assert.match(base, /\n {2}grid-template-columns: minmax\(0, 1fr\) var\(--tcrn-shell-toggle\);/);
  assert.match(base, /\n {2}column-gap: var\(--tcrn-space-2h\);/);
  assert.match(base, /\n {2}padding: 0 var\(--tcrn-space-1h\);/);
  assert.match(base, /\n {2}border: 0;/);
  assert.match(base, /\n {2}border-radius: var\(--tcrn-radius-control\);/);
  assert.doesNotMatch(base, /outline/);
  const toggle = ruleBody(".tcrn-shell-brand__toggle");
  assert.match(toggle, /inline-size: var\(--tcrn-shell-toggle\);/);
  assert.match(toggle, /block-size: var\(--tcrn-shell-toggle\);/);
  assert.match(ruleBody('.tcrn-shell-brand[data-shell-brand="v1"]'), /inline-size: auto;/);
  // Narrower than 1024 the automatic button drops the wordmark before any script runs.
  const narrow = /@media \(max-width: 1023px\) \{([\s\S]*?)\n\}/.exec(shellCss01);
  assert.ok(narrow, "the shell segment switches at 1023");
  assert.match(narrow[1], /\.tcrn-shell-brand\[data-shell-brand-auto\] \.tcrn-shell-brand__word \{\n {4}display: none;/);
  // The mark and the wordmark are centred by the flex line, with no line-height nudge.
  const line = ruleBody(".tcrn-shell-brand__line");
  assert.match(line, /display: flex;/);
  assert.match(line, /align-items: center;/);
  assert.doesNotMatch(`${line}${ruleBody(".tcrn-shell-brand__word")}`, /translate|margin|padding-block|vertical-align/);

  const tokens = createTokenMap();
  const px = (variable: string) => Number.parseFloat(tokens[variable]);
  assert.equal(px("--tcrn-shell-brand-w"), 134);
  assert.equal(px("--tcrn-shell-brand-h"), 40);
  assert.equal(px("--tcrn-shell-toggle"), 20);
  assert.equal(px("--tcrn-radius-control"), 8);
  // Centred in the band, the button's top is (strip − brand) / 2 and its midline the band's.
  assert.equal((px("--tcrn-shell-strip-h") - px("--tcrn-shell-brand-h")) / 2, 6);
  assert.equal(px("--tcrn-shell-strip-h") / 2, 26);
  // The touch height is the button's own: no coarse-pointer rule shrinks or grows it.
  assert.ok(px("--tcrn-shell-brand-h") >= 40);
  assert.ok(tcrnComponentCss.includes(shellCss01), "the shell segment is part of tcrnComponentCss");
});

test("states switch the pair and write no colour; hover and open take the 3.5% ink wash", () => {
  const base = ruleBody(".tcrn-shell-brand");
  assert.match(base, /--tcrn-pair-fill-d: transparent;/);
  assert.match(base, /--tcrn-pair-fill-h: var\(--tcrn-color-hover\);/);
  assert.match(base, /--tcrn-pair-fill-o: var\(--tcrn-color-hover\);/);
  assert.match(base, /--tcrn-pair-edge-f: var\(--tcrn-focus-ring\);/);
  const states: Array<[string, string]> = [
    ['.tcrn-shell-brand:where(:hover, [data-tcrn-preview-state="hover"])', "h"],
    ['.tcrn-shell-brand:where([aria-expanded="true"])', "o"]
  ];
  for (const [selector, key] of states) {
    const declarations = ruleBody(selector).trim().split("\n").map((line) => line.trim());
    assert.deepEqual(declarations, [
      `--tcrn-pair-fill: var(--tcrn-pair-fill-${key});`,
      `--tcrn-pair-ink: var(--tcrn-pair-ink-${key});`,
      `--tcrn-pair-edge: var(--tcrn-pair-edge-${key});`
    ]);
  }
  assert.deepEqual(ruleBody('.tcrn-shell-brand:where(:focus-visible, [data-tcrn-preview-state="focus"])').trim(), "--tcrn-pair-edge: var(--tcrn-pair-edge-f);");
  assert.equal(createResolvedTokenMap("light")["--tcrn-color-hover"], "rgba(22,21,15,.035)");
});

/** Relative luminance of an sRGB colour given as 0–255 channels. */
function luminance([r, g, b]: readonly number[]): number {
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function parseColour(text: string): [number, number, number, number] {
  const hex = /^#([0-9a-f]{6})$/i.exec(text);
  if (hex) return [0, 2, 4].map((i) => Number.parseInt(hex[1].slice(i, i + 2), 16)).concat(1) as [number, number, number, number];
  const rgba = /^rgba\((\d+),(\d+),(\d+),([\d.]+)\)$/.exec(text.replace(/\s+/g, ""));
  if (rgba) return [Number(rgba[1]), Number(rgba[2]), Number(rgba[3]), Number(rgba[4])];
  throw new Error(`unparsed colour ${text}`);
}

test("the TMS suffix reads at 4.5 or more on the hover wash, by day and at night", () => {
  for (const theme of ["light", "dark"] as const) {
    const tokens = createResolvedTokenMap(theme);
    const [br, bg, bb] = parseColour(tokens["--tcrn-color-bg"]);
    const [wr, wg, wb, wa] = parseColour(tokens["--tcrn-color-hover"]);
    const washed = [wr * wa + br * (1 - wa), wg * wa + bg * (1 - wa), wb * wa + bb * (1 - wa)];
    const suffix = parseColour(tokens["--tcrn-brand-suffix-tms"]).slice(0, 3);
    const [light, dark] = [luminance(washed), luminance(suffix)].sort((a, b) => b - a);
    const ratio = (light + 0.05) / (dark + 0.05);
    assert.ok(ratio >= 4.5, `${theme}: the suffix on the wash is ${ratio.toFixed(2)}`);
  }
});

test("the ref reaches the button, and an automatic button reports the first version on a narrow viewport", async () => {
  const harness = createDomInteractionHarness();
  try {
    const ref = createRef<HTMLButtonElement>();
    await harness.render(<ShellBrandButton ref={ref} productId="tms" locale="en" />);
    assert.equal(ref.current?.tagName, "BUTTON");
    assert.equal(ref.current?.getAttribute("data-shell-brand"), "v2", "no viewport query: the second version");
    const queries: string[] = [];
    Object.defineProperty(harness.window, "matchMedia", {
      configurable: true,
      value: (query: string) => {
        queries.push(query);
        return { matches: true, media: query, addEventListener() {}, removeEventListener() {} };
      }
    });
    await harness.render(<ShellBrandButton key="narrow" ref={ref} productId="tms" locale="en" />);
    assert.deepEqual([...new Set(queries)], ["(max-width: 1023px)"]);
    assert.equal(ref.current?.getAttribute("data-shell-brand"), "v1");
    assert.equal(ref.current?.getAttribute("aria-haspopup"), "dialog");
  } finally {
    await harness.cleanup();
  }
});
