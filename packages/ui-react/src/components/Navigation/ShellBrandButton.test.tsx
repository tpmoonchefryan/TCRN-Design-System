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
import { ProductLockup, type TcrnProductLogoId, type TcrnProductMarkId } from "./Navigation.js";
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
  assert.match(html, /<b class="tcrn-shell-brand__word">TCRN <em class="tcrn-shell-brand__suffix tcrn-shell-brand__suffix--tms">TMS<\/em><\/b><\/span>/);
  assert.match(html, /<span class="tcrn-shell-brand__toggle" data-shell-toggle=""><svg[^>]* width="16" height="16"[^>]*data-icon-name="chevron-down"/);
  // A serif product is its whole name, with no suffix.
  const serif = renderToStaticMarkup(<ShellBrandButton productId="einzbern" locale="en" />);
  assert.match(serif, /class="tcrn-shell-brand tcrn-shell-brand--serif"/);
  assert.match(serif, /<b class="tcrn-shell-brand__word">Einzbern<\/b>/);
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

/** Every data-logo value in `html`, in document order. */
const dataLogosOf = (html: string) => [...html.matchAll(/data-logo="([^"]*)"/g)].map((match) => match[1]);

/** The mark's own id for each product key: the name of its logos2 file (TCRN-DS-SUB-212). */
const markIdByProduct: Record<string, string> = { tms: "tms", "design-system": "ds", "mana-orchestrate": "mana", einzbern: "einzbern" };

test("the mark is the registered colour mark: data-logo is the mark's id and the SVG body has the digest of logos2/<mark id>.svg", () => {
  assert.deepEqual(tcrnProductMarks.map((mark) => mark.productId).sort(), Object.keys(markIdByProduct).sort());
  for (const mark of tcrnProductMarks) {
    assert.equal(mark.id, markIdByProduct[mark.productId], `${mark.productId}: the mark's id`);
    const html = renderToStaticMarkup(<ShellBrandButton productId={mark.productId as TcrnProductMarkId} />);
    // The product key draws the mark; data-logo says the mark's own id, never the product key.
    assert.deepEqual(dataLogosOf(html), [mark.id], `${mark.productId}: one data-logo, the mark's id`);
    const drawn = new RegExp(`<svg[^>]*data-logo="${escapeRegExp(mark.id)}"[^>]*>([\\s\\S]*?)</svg>`).exec(html);
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

test("the brand button and ProductLockup's first line write the same data-logo for every product (TCRN-DS-SUB-212)", () => {
  for (const mark of tcrnProductMarks) {
    const button = dataLogosOf(renderToStaticMarkup(<ShellBrandButton productId={mark.productId as TcrnProductMarkId} />));
    assert.deepEqual(button, [mark.id], `${mark.productId}: the button writes the mark's id`);
    for (const scale of ["rail", "lockup"] as const) {
      const line = dataLogosOf(renderToStaticMarkup(<ProductLockup productId={mark.productId as TcrnProductLogoId} firstLine={scale} />));
      assert.deepEqual(line, button, `${mark.productId}: the ${scale} first line writes what the button writes`);
    }
  }
});

test("the geometry reads the shell tokens: 134 by 40, a 20 toggle, 6 from the band's top", () => {
  const base = ruleBody(".tcrn-shell-brand");
  assert.match(base, /\n {2}min-inline-size: var\(--tcrn-shell-brand-w\);/);
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
  const narrow = /@container tcrn-shell \(max-width: 1023px\) \{([\s\S]*?)\n\}/.exec(shellCss01);
  assert.ok(narrow, "the shell segment switches at 1023");
  assert.match(narrow[1], /\.tcrn-shell-brand\[data-shell-brand-auto\] \.tcrn-shell-brand__word \{\n {4}display: none;/);
  // The mark and the wordmark are centred by the flex line, with no line-height nudge.
  const line = ruleBody(".tcrn-shell-brand__line");
  assert.match(line, /display: flex;/);
  assert.match(line, /align-items: center;/);
  assert.doesNotMatch(`${line}${ruleBody(".tcrn-shell-brand__word")}`, /translate|margin|padding-top|padding-bottom|padding-block-(?:start|end)|vertical-align/);
  // The wordmark's room above and below its line is one padding-block token, the same on both
  // sides, so it moves no glyph (TCRN-DS-SUB-143).
  assert.match(ruleBody(".tcrn-shell-brand__word"), /\n {2}padding-block: var\(--tcrn-space-0h\);/);

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

// Layout model of the wordmark (TCRN-DS-SUB-143). The unit tests have no layout engine, so the two
// readings the shell gate takes in the browser are worked out here from the rules and the tokens.
// Hanken Grotesk (the vendored latin file) ascends 1000 and descends 303 per 1000 em with no line
// gap; Chromium rounds the ascent and the descent to whole pixels, which is why the suffix's line
// box read 17 at 12.5 in the R1 geometry run. TCRN TMS at 12.5/600 read 60.234 wide in that run.
const wordmarkFont = { ascent: 1, descent: 0.303 } as const;
const tmsWordmarkWidthPx = 60.234;

/** Evaluates a calc() body of px numbers, given the values of its var() references and of 100%. */
function evaluateLength(expression: string, values: Record<string, number>, percent: number): number {
  const substituted = expression
    .replace(/^calc\(([\s\S]*)\)$/, "$1")
    .replace(/var\((--[a-z0-9-]+)\)/g, (_, name: string) => {
      assert.ok(name in values, `${name} has a value in the model`);
      return String(values[name]);
    })
    .replace(/100%/g, String(percent))
    .replace(/(\d+(?:\.\d+)?)px/g, "$1");
  const parts = substituted.match(/\d+(?:\.\d+)?|[-+*/()]/g) ?? [];
  assert.equal(parts.join(""), substituted.replace(/\s+/g, ""), `${expression} reduces to arithmetic`);
  let at = 0;
  const sum = (): number => {
    let value = product();
    while (parts[at] === "+" || parts[at] === "-") value = parts[at++] === "+" ? value + product() : value - product();
    return value;
  };
  const product = (): number => {
    let value = operand();
    while (parts[at] === "*" || parts[at] === "/") value = parts[at++] === "*" ? value * operand() : value / operand();
    return value;
  };
  const operand = (): number => {
    if (parts[at] === "(") {
      at++;
      const value = sum();
      at++;
      return value;
    }
    return Number(parts[at++]);
  };
  return sum();
}

test("the wordmark takes its content width: TCRN TMS is drawn whole in the 134 box, and the suffix stays inside the wordmark", () => {
  const tokens = createTokenMap();
  const px = (variable: string) => Number.parseFloat(tokens[variable]);
  const declaration = (body: string, property: string) => new RegExp(`(?:^|\\n) {2}${property}: ([^;]+);`).exec(body)?.[1].trim() ?? "";
  const line = ruleBody(".tcrn-shell-brand__line");
  const word = ruleBody(".tcrn-shell-brand__word");
  // The mark size is a length or a shell token, whichever the line declares.
  const markDeclared = declaration(line, "--tcrn-brand-mark-size");
  const markToken = /^var\((--[a-z0-9-]+)\)$/.exec(markDeclared)?.[1];
  const markSize = markToken ? px(markToken) : Number.parseFloat(markDeclared);
  assert.equal(markSize, 22);
  const values: Record<string, number> = Object.fromEntries(Object.keys(tokens).map((name) => [name, px(name)] as const));
  values["--tcrn-brand-mark-size"] = markSize;

  assert.equal(declaration(word, "flex"), "none");
  assert.equal(declaration(word, "max-inline-size"), "");
  assert.equal(declaration(word, "text-overflow"), "");
  const overhead = markSize + 2 * px("--tcrn-space-2h") + 2 * px("--tcrn-space-1h") + px("--tcrn-shell-toggle");
  assert.equal(overhead, 74);
  assert.ok(Math.abs(tmsWordmarkWidthPx + overhead - 134) <= 0.5);
  assert.ok(117 + overhead > 134, "the approved long wordmark expands the button");
  assert.doesNotMatch(renderToStaticMarkup(<ShellBrandButton productId="design-system" />), /title=/);

  // em inside b: the suffix's line box (17 at 12.5) is taller than the 1.2 line (15) by 1 above and
  // 1 below; the wordmark's space-0h above and below holds it, so the clipping wordmark cuts nothing.
  assert.equal(declaration(word, "font-size"), "12.5px");
  assert.equal(declaration(word, "line-height"), "1.2");
  const room = px("--tcrn-space-0h");
  assert.equal(room, 2);
  const lineBox = 12.5 * 1.2;
  const suffixBox = Math.round(12.5 * wordmarkFont.ascent) + Math.round(12.5 * wordmarkFont.descent);
  assert.equal(suffixBox, 17, "the R1 reading");
  const overhang = (suffixBox - lineBox) / 2;
  assert.ok(overhang <= room, `the suffix overhangs the line by ${overhang} above and below, within the ${room} of room`);
  assert.ok(suffixBox <= lineBox + 2 * room, "em top and bottom inside b");
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
      `--tcrn-pair-ds-suffix: var(--tcrn-pair-ds-suffix-${key});`,
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

/** Contrast of the TMS suffix on the hover wash over the canvas, in `theme`. */
function suffixOnWash(theme: "light" | "dark"): number {
  const tokens = createResolvedTokenMap(theme);
  const [br, bg, bb] = parseColour(tokens["--tcrn-color-bg"]);
  const [wr, wg, wb, wa] = parseColour(tokens["--tcrn-color-hover"]);
  const washed = [wr * wa + br * (1 - wa), wg * wa + bg * (1 - wa), wb * wa + bb * (1 - wa)];
  const suffix = parseColour(tokens["--tcrn-brand-suffix-tms"]).slice(0, 3);
  const [light, dark] = [luminance(washed), luminance(suffix)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

test("the TMS suffix reads at least 4.5 on the hover wash in both themes", () => {
  assert.equal(createResolvedTokenMap("light")["--tcrn-brand-suffix-tms"], "#2c63c8");
  assert.equal(createResolvedTokenMap("dark")["--tcrn-brand-suffix-tms"], "#7aa0f5");
  for (const theme of ["light", "dark"] as const) assert.ok(suffixOnWash(theme) >= 4.5, theme);
});

test("D03 maps only the DS shell suffix state; default, night, marks and other product roles stay separate", () => {
  const light = createResolvedTokenMap("light"), night = createResolvedTokenMap("dark");
  assert.equal(light["--tcrn-brand-suffix-design-system"], "#6577f3");
  assert.equal(night["--tcrn-brand-suffix-design-system"], "#6577f3");
  assert.equal(light["--tcrn-color-shell-brand-suffix-design-system-interactive"], "#505fc1");
  assert.equal(night["--tcrn-color-shell-brand-suffix-design-system-interactive"], "#6577f3");
  assert.equal(light["--tcrn-brand-suffix-tms"], "#2c63c8");
  assert.equal(night["--tcrn-brand-suffix-tms"], "#7aa0f5");
  assert.match(ruleBody(".tcrn-shell-brand"), /--tcrn-pair-ds-suffix-d: var\(--tcrn-brand-suffix-design-system\)/);
  for (const [state, key] of [['.tcrn-shell-brand:where(:hover, [data-tcrn-preview-state="hover"])', "h"], ['.tcrn-shell-brand:where([aria-expanded="true"])', "o"]]) {
    assert.ok(ruleBody(state).includes(`--tcrn-pair-ds-suffix: var(--tcrn-pair-ds-suffix-${key});`));
  }
  assert.equal(ruleBody(".tcrn-shell-brand__suffix--design-system").trim(), "color: var(--tcrn-pair-ds-suffix);");
  assert.equal(ruleBody(".tcrn-shell-brand__suffix--tms").trim(), "color: var(--tcrn-brand-suffix-tms);");
  // The real role/theme/state paint and >=4.5 are additionally read by the browser proof.
});

test("the ref reaches the button, and an automatic button reports the first version on a narrow viewport", async () => {
  const harness = createDomInteractionHarness();
  try {
    const ref = createRef<HTMLButtonElement>();
    await harness.render(<ShellBrandButton ref={ref} productId="tms" locale="en" />);
    assert.equal(ref.current?.tagName, "BUTTON");
    assert.equal(ref.current?.getAttribute("data-shell-brand"), "v2", "no viewport query: the second version");
    Object.defineProperty(harness.window, "innerWidth", { configurable: true, value: 1023 });
    await harness.render(<ShellBrandButton key="narrow" ref={ref} productId="tms" locale="en" />);
    assert.equal(ref.current?.getAttribute("data-shell-brand"), "v1");
    assert.equal(ref.current?.getAttribute("aria-haspopup"), "dialog");
  } finally {
    await harness.cleanup();
  }
});
