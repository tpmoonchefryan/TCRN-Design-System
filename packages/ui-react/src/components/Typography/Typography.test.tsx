import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { Heading, Text } from "./Typography.js";
import { tcrnComponentCss } from "../../styles/index.js";
import { typographyScaleCss } from "../../styles/generated/typography.scale.js";

/**
 * The declarations the stylesheet gives one exact selector, later rules overriding earlier ones
 * the way the cascade does for equal specificity. Comments are dropped first.
 */
function declarationsFor(selector: string): Map<string, string> {
  const merged = new Map<string, string>();
  const css = tcrnComponentCss.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selectors = match[1].split(",").map((part) => part.trim());
    if (!selectors.includes(selector)) {
      continue;
    }
    for (const declaration of match[2].split(";")) {
      const colon = declaration.indexOf(":");
      if (colon < 0) {
        continue;
      }
      merged.set(declaration.slice(0, colon).trim(), declaration.slice(colon + 1).trim());
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
    1: { family: "var(--tcrn-type-family-serif)", size: "36px", line: "40px", weight: "400" },
    2: { family: "var(--tcrn-type-family-serif)", size: "26px", line: "30px", weight: "400" },
    3: { family: "var(--tcrn-type-family-serif)", size: "20px", line: "26px", weight: "400" },
    4: { family: "var(--tcrn-type-family-ui)", size: "13px", line: "20px", weight: "600" }
  } as const;
  for (const level of [1, 2, 3, 4] as const) {
    const rule = declarationsFor(`.tcrn-heading--${level}`);
    assert.equal(rule.get("font-family"), expected[level].family, `h${level} family`);
    assert.equal(rule.get("font-size"), expected[level].size, `h${level} size`);
    assert.equal(rule.get("line-height"), expected[level].line, `h${level} line`);
    assert.equal(rule.get("font-weight"), expected[level].weight, `h${level} weight`);
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
  assert.equal(rule.get("font-size"), "13px");
  assert.equal(rule.get("line-height"), "20px");
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

  assert.equal(declarationsFor(".tcrn-text.tcrn-text--reading").get("font-size"), "14px");
  assert.equal(declarationsFor(".tcrn-text.tcrn-text--meta").get("color"), "var(--tcrn-color-ink-3)");
  assert.equal(declarationsFor(".tcrn-text.tcrn-text--caption").get("line-height"), "16px");
  assert.equal(declarationsFor(".tcrn-text.tcrn-text--strong").get("font-weight"), "600");
});

test("a numeral renders 4,280.00 in the serif at 300 with tabular digits on one line", () => {
  const markup = renderToStaticMarkup(<Text variant="numeral">4,280.00</Text>);
  assert.equal(markup, '<p title="4,280.00" class="tcrn-text tcrn-text--numeral">4,280.00</p>');
  const rule = declarationsFor(".tcrn-text.tcrn-text--numeral");
  assert.equal(rule.get("font-family"), "var(--tcrn-type-family-serif)");
  assert.equal(rule.get("font-weight"), "300");
  assert.match(rule.get("font-variant-numeric") ?? "", /\btabular-nums\b/);
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
