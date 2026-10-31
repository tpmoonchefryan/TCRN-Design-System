// ShellPins (TCRN-DS-SUB-115): the hooks and semantics of the pinned items, the limit read from
// the token, the overflow ids, the geometry tokens, the state pairs, the narrow rule and the
// drop-down requests. The rendered readings (three equal gaps of 8, 32 high, midline 26) are the
// shell gate's (TCRN-DS-SUB-137); here the rules are held to the tokens they must read.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { tcrnSupportedLocales } from "@tcrn/ui-copy-state";
import { createResolvedTokenMap, createTokenMap, tcrnTokens } from "@tcrn/ui-tokens";
import { shellCss02 } from "../../styles/shell.css.js";
import { createDomInteractionHarness } from "../../test/dom-harness.js";
import { ShellPins, shellPinsMax, shellPinsOverflowIds, type ShellPinItem } from "./ShellPins.js";
import { tcrnShellCopy } from "./shell-copy.js";

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The declarations of the rule whose selector is exactly `selector` in the pins segment. */
function ruleBody(selector: string): string {
  const match = new RegExp(`\\n\\s*${escapeRegExp(selector)} \\{\\n([^}]*)\\}`).exec(shellCss02);
  assert.ok(match, `${selector} has a rule`);
  return match[1];
}

// The 07a board's four pinned items: the current page, two with a drop-down, one link.
const boardPins: readonly ShellPinItem[] = [
  { id: "roster", label: "名册", href: "#roster" },
  { id: "contracts", label: "合约", hasMenu: true },
  { id: "billing", label: "结算单", href: "#billing" },
  { id: "schedule", label: "排期", hasMenu: true }
];

test("the pinned items carry the shell hooks: links for pages, dialog buttons for drop-downs", () => {
  const html = renderToStaticMarkup(
    <ShellPins items={boardPins} selectedId="roster" openId="schedule" menuIdOf={(id) => `drop-${id}`} locale="zh-CN" />
  );
  assert.match(html, /^<nav class="tcrn-shell-pins" aria-label="固定项" data-pins="">/);
  assert.deepEqual([...html.matchAll(/data-pin="([^"]+)"/g)].map((match) => match[1]), ["roster", "contracts", "billing", "schedule"]);
  assert.match(html, /<span class="tcrn-shell-pins__pin" data-pin="roster"><a class="tcrn-shell-pins__item" href="#roster" aria-current="page"><span class="tcrn-shell-pins__label" title="名册">名册<\/span><\/a><\/span>/);
  assert.match(html, /<a class="tcrn-shell-pins__item" href="#billing"><span class="tcrn-shell-pins__label" title="结算单">/);
  assert.match(
    html,
    /<button type="button" class="tcrn-shell-pins__item" aria-haspopup="dialog" aria-expanded="false" aria-controls="drop-contracts"><span class="tcrn-shell-pins__label" title="合约">合约<\/span><svg[^>]*data-icon-name="chevron-down"/
  );
  assert.match(html, /aria-haspopup="dialog" aria-expanded="true" aria-controls="drop-schedule" data-open-pin="">/);
  assert.equal((html.match(/data-open-pin/g) ?? []).length, 1);
  assert.equal((html.match(/aria-current=/g) ?? []).length, 1);
  // A selected item with a drop-down is the current item of its set, not a page link.
  assert.match(renderToStaticMarkup(<ShellPins items={boardPins} selectedId="contracts" />), /aria-controls="[^"]+" aria-current="true"/);
  // Without menuIdOf the drop-down ids are still unique.
  const ids = [...renderToStaticMarkup(<ShellPins items={boardPins} />).matchAll(/aria-controls="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, 2);
  assert.equal(renderToStaticMarkup(<ShellPins items={[]} />), "");
});

test("the band shows at most the token's count; the overflow ids start after it", () => {
  const token = tcrnTokens.find((candidate) => candidate.variable === "--tcrn-shell-pins-max");
  assert.equal(shellPinsMax(), Number(token?.value));
  assert.equal(shellPinsMax(), 6);
  const seven = Array.from({ length: 7 }, (_, index): ShellPinItem => ({ id: `pin-${index + 1}`, label: `Pin ${index + 1}`, href: `#${index + 1}` }));
  const html = renderToStaticMarkup(<ShellPins items={seven} locale="en" />);
  assert.equal((html.match(/data-pin="/g) ?? []).length, 6);
  assert.doesNotMatch(html, /data-pin="pin-7"/);
  assert.deepEqual(shellPinsOverflowIds(seven), ["pin-7"]);
  assert.deepEqual(shellPinsOverflowIds(boardPins), []);
  // The component takes the limit from the token: no 6 is written in its code.
  const source = readFileSync(new URL("../../../src/components/Navigation/ShellPins.tsx", import.meta.url), "utf8");
  const code = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  assert.doesNotMatch(code, /\b6\b/);
});

test("the gaps and the item height read the shell tokens: 8 before and between, 32 high, midline 26", () => {
  const group = ruleBody(".tcrn-shell-pins");
  assert.match(group, /\n {2}gap: var\(--tcrn-shell-pin-gap\);/);
  assert.match(group, /\n {2}margin-inline-start: var\(--tcrn-shell-pin-gap\);/);
  const item = ruleBody(".tcrn-shell-pins__item");
  assert.match(item, /\n {2}block-size: var\(--tcrn-shell-pin-h\);/);
  assert.match(item, /\n {2}padding: 0 var\(--tcrn-space-2h\);/);
  assert.match(item, /\n {2}border: 0;/);
  assert.match(item, /\n {2}border-radius: var\(--tcrn-radius-control\);/);
  assert.match(item, /\n {2}font-weight: var\(--tcrn-pair-weight\);/);
  // No divider: no edge on any side, no inset shadow, no rule between the items.
  assert.doesNotMatch(shellCss02, /border-(?:left|right|inline|block)|inset|::before|::after|divider/);
  const label = ruleBody(".tcrn-shell-pins__label");
  for (const declaration of ["overflow: hidden;", "text-overflow: ellipsis;", "white-space: nowrap;"]) assert.ok(label.includes(declaration), declaration);

  const tokens = createTokenMap();
  const px = (variable: string) => Number.parseFloat(tokens[variable]);
  assert.equal(px("--tcrn-shell-pin-gap"), 8);
  assert.equal(px("--tcrn-shell-pin-h"), 32);
  assert.equal((px("--tcrn-shell-strip-h") - px("--tcrn-shell-pin-h")) / 2, 10, "an item spans 10 to 42 in the band");
  assert.equal(px("--tcrn-shell-strip-h") / 2, 26, "its midline is the band's");
});

test("selected ShellPins use the day 6% / night 7% wash and weight 600; states switch the shared pair only", () => {
  const item = ruleBody(".tcrn-shell-pins__item");
  for (const [declaration, value] of [
    ["--tcrn-pair-fill-d", "transparent"],
    ["--tcrn-pair-ink-d", "var(--tcrn-color-ink-2)"],
    ["--tcrn-pair-fill-h", "var(--tcrn-color-hover)"],
    ["--tcrn-pair-ink-h", "var(--tcrn-color-ink)"],
    ["--tcrn-pair-fill-o", "var(--tcrn-color-wash)"],
    ["--tcrn-pair-fill-s", "var(--tcrn-color-wash)"],
    ["--tcrn-pair-ink-s", "var(--tcrn-color-ink)"],
    ["--tcrn-pair-edge-s", "0 0 #0000"],
    ["--tcrn-pair-weight", "var(--tcrn-type-weight-medium)"]
  ] as const) {
    assert.ok(item.includes(`  ${declaration}: ${value};`), `${declaration}: ${value}`);
  }
  const selected = ruleBody('.tcrn-shell-pins__item:where([aria-current="page"], [aria-current="true"], [data-tcrn-preview-state="selected"])');
  assert.deepEqual(selected.trim().split("\n").map((line) => line.trim()), [
    "--tcrn-pair-fill: var(--tcrn-pair-fill-s);",
    "--tcrn-pair-ink: var(--tcrn-pair-ink-s);",
    "--tcrn-pair-edge: var(--tcrn-pair-edge-s);",
    "--tcrn-pair-weight: var(--tcrn-type-weight-strong);"
  ]);
  for (const [selector, key] of [
    ['.tcrn-shell-pins__item:where(:hover, [data-tcrn-preview-state="hover"])', "h"],
    ['.tcrn-shell-pins__item:where([aria-expanded="true"])', "o"]
  ] as const) {
    assert.deepEqual(ruleBody(selector).trim().split("\n").map((line) => line.trim()), [
      `--tcrn-pair-fill: var(--tcrn-pair-fill-${key});`,
      `--tcrn-pair-ink: var(--tcrn-pair-ink-${key});`,
      `--tcrn-pair-edge: var(--tcrn-pair-edge-${key});`
    ]);
  }
  // One property set by day and at night: no theme selector in the pins segment.
  assert.doesNotMatch(shellCss02, /data-tcrn-theme/);
  const tokens = createTokenMap();
  assert.equal(tokens["--tcrn-color-wash"], "rgba(22,21,15,.06)");
  assert.equal(createResolvedTokenMap("dark")["--tcrn-color-wash"], "rgba(235,232,223,.07)", "the same selected ShellPins pair resolves to the existing night 7% wash");
  assert.equal(tokens["--tcrn-color-hover"], "rgba(22,21,15,.035)");
  assert.equal(tokens["--tcrn-type-weight-strong"], "600");
});

test("narrower than 1024 the whole group is hidden", () => {
  const narrow = /@container tcrn-shell \(max-width: 1023px\) \{\n {2}\.tcrn-shell-pins \{\n {4}display: none;\n {2}\}\n\}/.exec(shellCss02);
  assert.ok(narrow, "the pins segment hides the group at 1023 and below");
});

test("the group's name is written in all five locales", () => {
  for (const locale of tcrnSupportedLocales) {
    const name = tcrnShellCopy[locale].pinnedItems;
    assert.ok(name.trim().length > 0, `${locale} names the group`);
    assert.match(renderToStaticMarkup(<ShellPins items={boardPins} locale={locale} />), new RegExp(`aria-label="${escapeRegExp(name)}"`));
  }
  assert.equal(tcrnShellCopy.en.pinnedItems, "Pinned items");
});

function ControlledPins({ onRequest }: { onRequest: (openId: string | null) => void }) {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <ShellPins
      items={boardPins}
      openId={openId}
      onOpenChange={(next) => {
        onRequest(next);
        setOpenId(next);
      }}
      locale="en"
    />
  );
}

test("pressing a drop-down item asks to open it, and pressing it again asks to close it", async () => {
  const harness = createDomInteractionHarness();
  try {
    const requests: Array<string | null> = [];
    await harness.render(<ControlledPins onRequest={(next) => requests.push(next)} />);
    const button = harness.document.querySelector('[data-pin="contracts"] button');
    assert.ok(button);
    await harness.dispatchClick(button);
    assert.equal(button.getAttribute("aria-expanded"), "true");
    assert.equal(button.hasAttribute("data-open-pin"), true);
    await harness.dispatchClick(button);
    assert.deepEqual(requests, ["contracts", null]);
    assert.equal(button.getAttribute("aria-expanded"), "false");
  } finally {
    await harness.cleanup();
  }
});

test("a shell's name tells its pinned items from another shell's: \"{name} · {pinned items}\" in all five locales, and an aria-label given outright wins (TCRN-DS-SUB-148)", () => {
  const nameOf = (html: string) => /^<nav [^>]*aria-label="([^"]*)"/.exec(html)?.[1];
  for (const locale of tcrnSupportedLocales) {
    const copy = tcrnShellCopy[locale];
    assert.equal(nameOf(renderToStaticMarkup(<ShellPins items={boardPins} locale={locale} />)), copy.pinnedItems);
    const named = nameOf(renderToStaticMarkup(<ShellPins items={boardPins} locale={locale} landmarkLabel="TMS" />));
    assert.equal(named, copy.landmarkOf("TMS", copy.pinnedItems));
    assert.ok(named?.startsWith("TMS") && named.includes(copy.pinnedItems), `${locale}: ${named}`);
    assert.notEqual(named, nameOf(renderToStaticMarkup(<ShellPins items={boardPins} locale={locale} landmarkLabel="Docs" />)));
  }
  assert.equal(nameOf(renderToStaticMarkup(<ShellPins items={boardPins} locale="en" landmarkLabel="TMS" aria-label="Shortcuts" />)), "Shortcuts");
  assert.doesNotMatch(renderToStaticMarkup(<ShellPins items={boardPins} locale="en" landmarkLabel="TMS" />), /landmarklabel/i);
  // An empty name is no name: the markup is the built-in one.
  assert.equal(renderToStaticMarkup(<ShellPins items={boardPins} locale="en" landmarkLabel="  " />), renderToStaticMarkup(<ShellPins items={boardPins} locale="en" />));
});

test("STORY-140 GWT3 a movable band adds no mark of its own: the items say their shortcut, and the rules add only the pointer's behaviour (TCRN-DS-SUB-149)", () => {
  const still = renderToStaticMarkup(<ShellPins items={boardPins} locale="zh-CN" />);
  const movable = renderToStaticMarkup(<ShellPins items={boardPins} locale="zh-CN" onPinsReorder={() => undefined} />);
  assert.doesNotMatch(still, /aria-keyshortcuts|data-pin-movable/, "without onPinsReorder the markup is the band's as before");
  assert.equal((movable.match(/aria-keyshortcuts="Alt\+ArrowLeft Alt\+ArrowRight"/g) ?? []).length, boardPins.length);
  assert.equal((movable.match(/data-pin-movable=""/g) ?? []).length, boardPins.length);
  assert.doesNotMatch(movable, /data-pin-dragging|onpinsreorder/i);
  // Taking the two attributes away leaves the same markup: no insertion line, ghost or handle.
  assert.equal(movable.replace(/ aria-keyshortcuts="[^"]*" data-pin-movable=""/g, ""), still);
  assert.deepEqual(ruleBody(".tcrn-shell-pins__item:where([data-pin-movable])").trim().split("\n").map((line) => line.trim()), ["touch-action: pan-y;", "user-select: none;"]);
  assert.deepEqual(ruleBody(".tcrn-shell-pins__item:where([data-pin-dragging])").trim().split("\n").map((line) => line.trim()), ["cursor: grabbing;"]);
});
