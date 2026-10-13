import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { createResolvedTokenMap } from "@tcrn/ui-tokens";
import { Heading, Highlight, Text } from "./Typography.js";
import { tcrnComponentCss } from "../../styles/index.js";
import { typographyScaleCss } from "../../styles/generated/typography.scale.js";

const resolvedTokens = createResolvedTokenMap("light");

/**
 * The scale declares its sizes, lines and weights as type scale tokens (TCRN-DS-SUB-052): the
 * value is var(<token>) and the token resolves to the contract value.
 */
function assertScaleToken(value: string | undefined, token: string, resolved: string, label: string): void {
  assert.equal(value, `var(${token})`, `${label} refers to ${token}`);
  assert.equal(resolvedTokens[token], resolved, `${label}: ${token} is ${resolved}`);
}

interface CssRule {
  selectors: string[];
  declarations: Array<[string, string]>;
}

/** A selector list split at its top-level commas, so :where(:hover,...) stays one selector. */
function splitSelectors(list: string): string[] {
  const selectors: string[] = [];
  let depth = 0;
  let current = "";
  for (const character of list) {
    if (character === "(" || character === "[") depth += 1;
    if (character === ")" || character === "]") depth -= 1;
    if (character === "," && depth === 0) {
      selectors.push(current.trim());
      current = "";
    } else {
      current += character;
    }
  }
  selectors.push(current.trim());
  return selectors.map((selector) => selector.replace(/\s+/g, " "));
}

/** Every style rule of the stylesheet in source order, comments dropped. */
function cssRules(): CssRule[] {
  const css = tcrnComponentCss.replace(/\/\*[\s\S]*?\*\//g, "");
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((match) => ({
    selectors: splitSelectors(match[1]),
    declarations: match[2]
      .split(";")
      .filter((declaration) => declaration.includes(":"))
      .map((declaration): [string, string] => {
        const colon = declaration.indexOf(":");
        return [declaration.slice(0, colon).trim(), declaration.slice(colon + 1).trim()];
      })
  }));
}

/**
 * The declarations the stylesheet gives one exact selector, later rules overriding earlier ones
 * the way the cascade does for equal specificity.
 */
function declarationsFor(selector: string): Map<string, string> {
  const merged = new Map<string, string>();
  for (const rule of cssRules()) {
    if (rule.selectors.includes(selector)) {
      for (const [property, value] of rule.declarations) merged.set(property, value);
    }
  }
  return merged;
}

function classOf(markup: string): string {
  const match = /class="([^"]*)"/.exec(markup);
  assert.ok(match, `no class attribute in ${markup}`);
  return match[1];
}

test("heading can separate semantic level from visual level", () => {
  const markup = renderToStaticMarkup(<Heading level={1} visualLevel={2}>Operations Cockpit</Heading>);
  assert.match(markup, /^<h1 /);
  assert.match(markup, /tcrn-heading--2/);
  assert.doesNotMatch(markup, /tcrn-heading--1/);
});

test("every heading level repeats its text as a title, and a given title wins", () => {
  for (const level of [1, 2, 3, 4] as const) {
    const markup = renderToStaticMarkup(<Heading level={level}>季度复盘与产品发布 Q3 Review</Heading>);
    assert.match(markup, new RegExp(`^<h${level} `));
    assert.match(markup, /title="季度复盘与产品发布 Q3 Review"/);
    assert.equal(classOf(markup), `tcrn-heading tcrn-heading--${level}`);
  }
  const nested = renderToStaticMarkup(
    <Heading level={3}>
      本月<em>账单</em> {7}
    </Heading>
  );
  assert.match(nested, /title="本月账单 7"/);
  const given = renderToStaticMarkup(<Heading title="Members">成员与权限</Heading>);
  assert.match(given, /title="Members"/);
  assert.doesNotMatch(given, /title="成员与权限"/);
  const empty = renderToStaticMarkup(<Heading level={2}><span /></Heading>);
  assert.doesNotMatch(empty, /title=/);
});

test("the heading scale is one line at the contract sizes, with no older size rule after it", () => {
  const expected = {
    1: { family: "var(--tcrn-type-family-serif)", size: ["--tcrn-type-size-page", "36px"], line: ["--tcrn-type-line-page", "40px"], weight: ["--tcrn-type-weight-regular", "400"] },
    2: { family: "var(--tcrn-type-family-serif)", size: ["--tcrn-type-size-heading-2", "26px"], line: ["--tcrn-type-line-heading-2", "30px"], weight: ["--tcrn-type-weight-regular", "400"] },
    3: { family: "var(--tcrn-type-family-serif)", size: ["--tcrn-type-size-heading-3", "20px"], line: ["--tcrn-type-line-heading-3", "26px"], weight: ["--tcrn-type-weight-regular", "400"] },
    4: { family: "var(--tcrn-type-family-ui)", size: ["--tcrn-type-size-ui", "13px"], line: ["--tcrn-type-line-ui", "20px"], weight: ["--tcrn-type-weight-semibold", "600"] }
  } as const;
  for (const level of [1, 2, 3, 4] as const) {
    const rule = declarationsFor(`.tcrn-heading--${level}`);
    assert.equal(rule.get("font-family"), expected[level].family, `h${level} family`);
    const { size, line, weight } = expected[level];
    assertScaleToken(rule.get("font-size"), size[0], size[1], `h${level} size`);
    assertScaleToken(rule.get("line-height"), line[0], line[1], `h${level} line`);
    assertScaleToken(rule.get("font-weight"), weight[0], weight[1], `h${level} weight`);
    assert.equal(rule.get("white-space"), "nowrap", `h${level} stays on one line`);
    assert.equal(rule.get("overflow"), "hidden", `h${level} clips`);
    assert.equal(rule.get("text-overflow"), "ellipsis", `h${level} ends in an ellipsis`);
  }
  assert.doesNotMatch(tcrnComponentCss, /clamp\(28px/);
  assert.equal(declarationsFor(".tcrn-heading").get("min-width"), "0");
  assert.ok(tcrnComponentCss.includes(typographyScaleCss), "the generated scale is joined into the stylesheet");
});

test("a Text given no props renders and looks as before", () => {
  assert.equal(renderToStaticMarkup(<Text>项目已有 12 位成员。</Text>), '<p class="tcrn-text">项目已有 12 位成员。</p>');
  const rule = declarationsFor(".tcrn-text");
  assertScaleToken(rule.get("font-size"), "--tcrn-type-size-ui", "13px", "text size");
  assertScaleToken(rule.get("line-height"), "--tcrn-type-line-ui", "20px", "text line");
  assert.equal(rule.get("color"), "var(--tcrn-color-ink-2)");
  assert.equal(rule.get("margin"), "var(--tcrn-space-2) 0 0");
});

test("Text size, tone and variant map to their modifiers", () => {
  for (const size of ["body", "reading", "meta", "caption"] as const) {
    const markup = renderToStaticMarkup(<Text size={size}>说明</Text>);
    assert.equal(classOf(markup), `tcrn-text tcrn-text--${size}`);
    assert.doesNotMatch(markup, /title=/, "wrapping text carries no title");
  }
  assert.equal(classOf(renderToStaticMarkup(<Text tone="strong">删除后 30 天内可恢复。</Text>)), "tcrn-text tcrn-text--strong");
  assert.equal(classOf(renderToStaticMarkup(<Text tone="default">说明</Text>)), "tcrn-text");
  assert.equal(
    classOf(renderToStaticMarkup(<Text size="meta" tone="strong" className="extra">说明</Text>)),
    "tcrn-text tcrn-text--meta tcrn-text--strong extra"
  );
  const caps = renderToStaticMarkup(
    <Text variant="caps">
      <b>01</b>基本信息 Basic info
    </Text>
  );
  assert.equal(classOf(caps), "tcrn-text tcrn-text--caps");
  assert.match(caps, /title="01基本信息 Basic info"/);
  assert.match(renderToStaticMarkup(<Text variant="caps" title="Basic info">基本信息</Text>), /title="Basic info"/);

  assertScaleToken(declarationsFor(".tcrn-text.tcrn-text--reading").get("font-size"), "--tcrn-type-size-reading", "14px", "reading size");
  assert.equal(declarationsFor(".tcrn-text.tcrn-text--meta").get("color"), "var(--tcrn-color-ink-3)");
  assertScaleToken(declarationsFor(".tcrn-text.tcrn-text--caption").get("line-height"), "--tcrn-type-line-caption", "16px", "caption line");
  assertScaleToken(declarationsFor(".tcrn-text.tcrn-text--strong").get("font-weight"), "--tcrn-type-weight-strong", "600", "strong weight");
});

test("the generated scale names a type token for every size and line that has one", () => {
  // Without a token of their own (a new scale token is not in this change): the inline and the
  // large numeral sizes and the mono size. Every other size and line is var(--tcrn-type-*).
  const literal = [...typographyScaleCss.matchAll(/([^{}\n]+)\{([^{}]*)\}/g)].flatMap((match) =>
    match[2]
      .split(";")
      .filter((declaration) => /^(?:font-size|line-height|font-weight):/.test(declaration) && !/:var\(--tcrn-type-[a-z0-9-]+\)$/.test(declaration))
      .map((declaration) => `${match[1].trim()} ${declaration}`)
  );
  assert.deepEqual(literal, [
    ".tcrn-text.tcrn-text--numeral.tcrn-text--numeral-inline font-size:16px",
    ".tcrn-text.tcrn-text--numeral.tcrn-text--numeral-large font-size:44px",
    ".tcrn-text.tcrn-text--numeral.tcrn-text--numeral-large line-height:48px",
    ".tcrn-text.tcrn-text--mono font-size:11.5px"
  ]);
  assert.match(typographyScaleCss, /\.tcrn-text\.tcrn-text--caps\{[^}]*letter-spacing:var\(--tcrn-type-tracking-caps\)/);
});

test("a numeral renders 4,280.00 in the serif at 300 with tabular digits on one line", () => {
  const markup = renderToStaticMarkup(<Text variant="numeral">4,280.00</Text>);
  assert.equal(markup, '<p title="4,280.00" class="tcrn-text tcrn-text--numeral">4,280.00</p>');
  const rule = declarationsFor(".tcrn-text.tcrn-text--numeral");
  assert.equal(rule.get("font-family"), "var(--tcrn-type-family-serif)");
  assertScaleToken(rule.get("font-weight"), "--tcrn-type-weight-light", "300", "numeral weight");
  assertScaleToken(rule.get("font-variant-numeric"), "--tcrn-type-numeric-tabular", "tabular-nums lining-nums", "numeral figures");
  assert.match(resolvedTokens["--tcrn-type-numeric-tabular"], /\btabular-nums\b/);
  assert.equal(rule.get("white-space"), "nowrap");
  assert.equal(rule.get("margin"), "0");
});

test("caps stays on one line and ends in an ellipsis", () => {
  const rule = declarationsFor(".tcrn-text.tcrn-text--caps");
  assert.equal(rule.get("white-space"), "nowrap");
  assert.equal(rule.get("overflow"), "hidden");
  assert.equal(rule.get("text-overflow"), "ellipsis");
  assert.equal(rule.get("text-transform"), "uppercase");
  assert.equal(rule.get("margin"), "0");
});

test("a highlight wraps each match in the contract mark and leaves the rest of the text alone", () => {
  assert.equal(
    renderToStaticMarkup(<Highlight text="在设计组里搜索设计" query="设计" />),
    '<span class="tcrn-highlight-text">在<mark class="tcrn-highlight__mark">设计</mark>组里搜索<mark class="tcrn-highlight__mark">设计</mark></span>'
  );
  assert.equal(renderToStaticMarkup(<Highlight text="设计组" query="  " />), '<span class="tcrn-highlight-text">设计组</span>');
  assert.match(
    renderToStaticMarkup(<Highlight text="Design review" query="design" markClassName="hit" />),
    /<mark class="tcrn-highlight__mark hit">Design<\/mark> review/
  );
  assert.doesNotMatch(renderToStaticMarkup(<Highlight text="Design review" query="design" caseSensitive />), /<mark/);
});

test("the mark adds only the wash fill and keeps the type and spacing of the text around it", () => {
  const rule = declarationsFor(".tcrn-highlight__mark");
  assert.equal(rule.get("background"), "var(--tcrn-color-acc-bg)");
  assert.equal(rule.get("color"), "inherit");
  assert.equal(rule.get("font"), "inherit");
  assert.equal(rule.get("letter-spacing"), "inherit");
  assert.equal(rule.get("padding"), "0");
  assert.equal(rule.get("margin"), "0");
  assert.match(rule.get("box-shadow") ?? "", /^0 0 0 \S+ var\(--tcrn-color-acc-bg\)$/, "the halo is drawn outside the inline box");
  assert.equal(rule.get("box-decoration-break"), "clone");

  // No rule that reaches a highlight mark may change its type or take up space.
  const neutral = new Map([
    ["font", "inherit"],
    ["letter-spacing", "inherit"],
    ["padding", "0"],
    ["margin", "0"]
  ]);
  const reachesMark = (selector: string) => /highlight/.test(selector) || /(^|[\s>+~])mark\b/.test(selector);
  const offenders = cssRules()
    .filter((cssRule) => cssRule.selectors.some(reachesMark))
    .flatMap((cssRule) =>
      cssRule.declarations
        .filter(([property, value]) => /^(font|letter-spacing|word-spacing|padding|margin|border(-width)?$)/.test(property) && neutral.get(property) !== value)
        .map(([property, value]) => `${cssRule.selectors.join(", ")} { ${property}: ${value} }`)
    );
  assert.deepEqual(offenders, []);
  assert.doesNotMatch(tcrnComponentCss, /\.tcrn-highlight-mark\b/, "the pre-contract mark rule with padding and weight is gone");
});

test(
  "a link reads its pair: accent ink with the 70% underline, accent-2 on hover and the focus ring as its edge",
  () => {
    // The base rule reads the live pair; the default variant declares the pair per state.
    const link = declarationsFor(".tcrn-link");
    assert.equal(link.get("color"), "var(--tcrn-pair-ink)");
    assert.equal(link.get("text-decoration-color"), "var(--tcrn-pair-underline)");
    assert.equal(link.get("box-shadow"), "var(--tcrn-pair-edge)");
    assert.equal(link.get("text-underline-offset"), "2px");
    assert.equal(link.get("--tcrn-pair-ink"), "var(--tcrn-pair-ink-d)");
    assert.equal(link.get("--tcrn-pair-underline"), "var(--tcrn-pair-underline-d)");
    assert.equal(link.get("--tcrn-pair-edge"), "var(--tcrn-pair-edge-d)");
    assert.equal(link.get("--tcrn-pair-ink-d"), "var(--tcrn-color-acc)");
    assert.equal(link.get("--tcrn-pair-underline-d"), "var(--tcrn-color-acc-ul)");
    assert.equal(link.get("--tcrn-pair-ink-h"), "var(--tcrn-color-acc-2)");
    assert.equal(link.get("--tcrn-pair-underline-h"), "var(--tcrn-color-acc-2)");
    assert.equal(link.get("--tcrn-pair-edge-f"), "var(--tcrn-focus-ring)");
    // The state rules only switch the live pair (C2): no color, text-decoration-color or box-shadow.
    const hover = declarationsFor('.tcrn-link:where(:hover,[data-tcrn-preview-state="hover"])');
    assert.deepEqual([...hover], [["--tcrn-pair-ink", "var(--tcrn-pair-ink-h)"], ["--tcrn-pair-underline", "var(--tcrn-pair-underline-h)"]]);
    const focus = declarationsFor('.tcrn-link:where(:focus-visible,[data-tcrn-preview-state="focus"])');
    assert.deepEqual([...focus], [["--tcrn-pair-edge", "var(--tcrn-pair-edge-f)"]]);
    const linkStateRules = cssRules().filter((cssRule) => cssRule.selectors.some((selector) => /^\.tcrn-link(?:\.tcrn-link--[a-z]+)?:where\(/.test(selector)));
    assert.equal(linkStateRules.length, 2);
    for (const cssRule of linkStateRules) {
      for (const [property] of cssRule.declarations) assert.match(property, /^--tcrn-pair-/, `${cssRule.selectors.join(", ")} only switches the pair`);
    }
    // Forced colours paint no box-shadow: the focused link keeps a transparent outline, which the
    // system recolours there.
    const focusVisible = declarationsFor(".tcrn-link:focus-visible");
    assert.equal(focusVisible.get("outline"), "2px solid transparent");
    assert.equal(focusVisible.get("outline-offset"), "2px");
    assert.doesNotMatch(tcrnComponentCss, /\.tcrn-link(?![-\w])[^{,]*\{[^}]*outline:\s*none/, "no link rule removes the outline");
    // Only the contract base rule paints a bare link; no later rule overrides its colour, hover or focus.
    const painting = cssRules().filter(
      (cssRule) =>
        cssRule.selectors.some((selector) => /^\.tcrn-link(?::hover|:focus-visible)?$/.test(selector)) &&
        cssRule.declarations.some(([property]) => /^(?:color|text-decoration-color|box-shadow|background(?:-color)?)$/.test(property))
    );
    assert.equal(painting.length, 1);
  }
);

test("the quiet link is the quiet variant of the link pair table, not a breadcrumb rule", () => {
  const quiet = declarationsFor(".tcrn-link.tcrn-link--quiet");
  assert.equal(quiet.get("--tcrn-pair-ink-d"), "currentColor");
  assert.equal(quiet.get("--tcrn-pair-underline-d"), "transparent");
  assert.equal(quiet.get("--tcrn-pair-ink-h"), "var(--tcrn-color-acc-2)");
  assert.equal(quiet.get("--tcrn-pair-underline-h"), "var(--tcrn-color-acc-2)");
  // Every rule naming the quiet modifier is that variant declaration: no quiet hover rule, no
  // shared list with the breadcrumb, and no retired brand name.
  const quietRules = cssRules().filter((cssRule) => cssRule.selectors.some((selector) => selector.includes("tcrn-link--quiet")));
  assert.deepEqual(quietRules.map((cssRule) => cssRule.selectors), [[".tcrn-link.tcrn-link--quiet"]]);
  assert.doesNotMatch(tcrnComponentCss, /tcrn-link--quiet[^{]*\{[^}]*--tcrn-color-brand-primary/);
  // The breadcrumb keeps its Navigation-family rules (EX-INIT015-navigation).
  assert.match(tcrnComponentCss, /(?:^|\n)\.tcrn-breadcrumb a \{/);
  assert.match(tcrnComponentCss, /(?:^|\n)\.tcrn-breadcrumb a:hover \{/);
});

test("the contract link rules are in the stylesheet", () => {
  assert.match(tcrnComponentCss, /\.tcrn-link\{color:var\(--tcrn-pair-ink\);[^}]*text-decoration-color:var\(--tcrn-pair-underline\);[^}]*box-shadow:var\(--tcrn-pair-edge\)\}/);
  assert.match(tcrnComponentCss, /\.tcrn-link:where\(:hover,\[data-tcrn-preview-state="hover"\]\)\{--tcrn-pair-ink:var\(--tcrn-pair-ink-h\);--tcrn-pair-underline:var\(--tcrn-pair-underline-h\)\}/);
  assert.match(tcrnComponentCss, /\.tcrn-link:where\(:focus-visible,\[data-tcrn-preview-state="focus"\]\)\{--tcrn-pair-edge:var\(--tcrn-pair-edge-f\)\}/);
});
