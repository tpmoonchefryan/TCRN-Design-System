// ShellMenu (TCRN-DS-SUB-116): the full menu's structure — one non-modal dialog, the search, three
// columns of NavGroup and NavItem rows with their pin slots, no collapse button, the bottom bar with
// the current position and the side-rail lockup that is only a picture — and the rules that place
// and size it from the shell tokens. The rendered readings (top 52, left 12, width 952, the bar's
// equal margins) are the shell gate's (TCRN-DS-SUB-137); here the rules are held to their tokens.
import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { tcrnSupportedLocales } from "@tcrn/ui-copy-state";
import { createTokenMap } from "@tcrn/ui-tokens";
import { brandCss02 } from "../../styles/brand.css.js";
import { tcrnComponentCss } from "../../styles/index.js";
import { shellCss03 } from "../../styles/shell.css.js";
import { shellIntroCss01 } from "../../styles/shell-intro.css.js";
import { shellSheetCss01 } from "../../styles/shell-sheet.css.js";
import {
  ShellMenu,
  shellMenuPresentationContext,
  shellMenuMaxDepth,
  shellMenuRow,
  shellMenuSearch,
  shellMenuSheetMediaQuery,
  type ShellMenuGroup
} from "./ShellMenu.js";
import { tcrnShellCopy } from "./shell-copy.js";

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The declarations of the rule whose selector is exactly `selector` in the full menu segment. */
function ruleBody(selector: string, css = shellCss03): string {
  const match = new RegExp(`\\n\\s*${escapeRegExp(selector)} \\{\\n([^}]*)\\}`).exec(css);
  assert.ok(match, `${selector} has a rule`);
  return match[1];
}

function declaration(body: string, property: string): string {
  const match = new RegExp(`\\n\\s*${escapeRegExp(property)}: ([^;]+);`).exec(`\n${body}`);
  assert.ok(match, `${property} is declared`);
  return match[1];
}

// The 07a board's model (TMS): three groups, items with a third and a fourth level under 合约.
const boardMenu: readonly ShellMenuGroup[] = [
  {
    id: "talent",
    label: "艺人",
    items: [
      { id: "roster", label: "名册", href: "#roster", iconName: "users" },
      { id: "groups", label: "分组", href: "#groups", iconName: "layers" },
      {
        id: "contracts",
        label: "合约",
        iconName: "book-open",
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
      },
      { id: "billing", label: "结算单", href: "#billing", iconName: "database" }
    ]
  },
  {
    id: "operations",
    label: "运营",
    items: [
      {
        id: "schedule",
        label: "排期",
        iconName: "calendar",
        children: [
          { id: "week", label: "本周", href: "#week" },
          { id: "month", label: "月视图", href: "#month" },
          { id: "conflicts", label: "冲突检查", href: "#conflicts" }
        ]
      },
      { id: "live", label: "直播", href: "#live", iconName: "globe-2" },
      { id: "events", label: "活动", href: "#events", iconName: "package" },
      { id: "reports", label: "报表", href: "#reports", iconName: "layout-grid" }
    ]
  },
  {
    id: "system",
    label: "系统",
    items: [
      { id: "members", label: "成员", href: "#members", iconName: "users" },
      { id: "permissions", label: "权限", href: "#permissions", iconName: "shield-check" },
      { id: "settings", label: "设置", href: "#settings", iconName: "settings" },
      { id: "audit", label: "审计日志", href: "#audit", iconName: "history" }
    ]
  }
];

const boardPath = [{ label: "艺人", href: "#talent" }, { label: "名册" }];

function renderBoardMenu(extra: Partial<Parameters<typeof ShellMenu>[0]> = {}) {
  return renderToStaticMarkup(
    <ShellMenu
      groups={boardMenu}
      open
      productId="tms"
      selectedId="roster"
      currentPath={boardPath}
      pinnedIds={["roster", "contracts", "billing", "schedule"]}
      onPinnedChange={() => undefined}
      locale="zh-CN"
      id="menu"
      {...extra}
    />
  );
}

test("the full menu is one non-modal dialog carrying the shell hooks; closed it renders nothing", () => {
  assert.equal(renderToStaticMarkup(<ShellMenu groups={boardMenu} open={false} productId="tms" />), "");
  const html = renderBoardMenu();
  assert.match(html, /^<div class="tcrn-shell-menu" data-shell-menu=""><section id="menu" class="tcrn-shell-menu__panel" role="dialog" aria-modal="false" aria-label="导航" data-panel="expanded">/);
  assert.equal((html.match(/role="dialog"/g) ?? []).length, 1, "one step opens it: one dialog, no small panel");
  assert.match(html, /<div data-shell-search="" class="tcrn-product-shell-search tcrn-shell-menu__search"/);
  assert.match(html, /<input(?=[^>]*type="search")(?=[^>]*placeholder="搜索页面与内容")[^>]*>/);
  assert.equal((html.match(/data-shell-group=""/g) ?? []).length, 3);
  assert.equal((html.match(/data-shell-row=""/g) ?? []).length, 12);
  assert.equal((html.match(/data-shell-level="2"/g) ?? []).length, 12);
  assert.equal((html.match(/aria-current="page"/g) ?? []).length, 2, "the selected row and the last step of the current position");
  assert.match(html, /<a(?=[^>]*href="#roster")(?=[^>]*aria-current="page")(?=[^>]*data-shell-row="")[^>]*>/);
  // The rows with a next level carry the 12 chevron; the others do not.
  assert.equal((html.match(/tcrn-shell-menu__sub/g) ?? []).length, 2);
  assert.match(html, /<span class="tcrn-shell-menu__text">合约<\/span><svg[^>]*width="12"[^>]*data-icon-name="chevron-right"/);
});

test("rows and group titles carry the pin slot; the only buttons are pins, so there is no collapse button", () => {
  const html = renderBoardMenu();
  const buttons = html.match(/<button[^>]*>/g) ?? [];
  assert.equal(buttons.length, 15, "three group titles and twelve rows");
  for (const button of buttons) assert.match(button, /data-pin-button=""/);
  assert.equal((html.match(/aria-pressed="true"/g) ?? []).length, 4);
  assert.doesNotMatch(html, /side-nav-toggle|collapse|收起/);
  // Without a pin handler the rows keep their markup and no button is rendered at all.
  assert.doesNotMatch(renderBoardMenu({ onPinnedChange: undefined }), /<button/);
});

test("the bottom bar holds the current position and the lockup, which is a picture and not a control", () => {
  const html = renderBoardMenu();
  const bar = /<div class="tcrn-shell-menu__pbar" data-shell-pbar="">([\s\S]*)<\/div><\/section>/.exec(html);
  assert.ok(bar, "the bar closes the panel");
  assert.match(bar[1], /^<nav class="tcrn-shell-menu__crumbs" aria-label="当前位置"><span class="tcrn-shell-menu__crumbs-label" aria-hidden="true">当前位置<\/span><a class="tcrn-shell-menu__crumb" href="#talent" title="艺人">艺人<\/a><svg[^>]*data-icon-name="chevron-right"[^>]*>[\s\S]*?<\/svg><b class="tcrn-shell-menu__crumb tcrn-shell-menu__crumb--current" aria-current="page" title="名册">名册<\/b><\/nav>/);
  const lockup = /<div ([^>]*data-lockup="lkr"[^>]*)>/.exec(bar[1]);
  assert.ok(lockup, "the lockup is a div in the bar");
  assert.match(lockup[1], /role="img"/);
  assert.match(lockup[1], /aria-label="TCRN TMS [^"]+"/);
  assert.match(lockup[1], /class="tcrn-product-logo [^"]*tcrn-shell-brand-lockup tcrn-shell-menu__lockup"/);
  assert.doesNotMatch(lockup[1], /tabindex|onclick|href/i);
  assert.doesNotMatch(bar[1], /<button|<a [^>]*data-lockup/);
  // C-6: the lockup is the Brand board's section E writing, as the shell gate reads it — the colour
  // mark as svg[data-logo], the wordmark as <b>{word} <em>{suffix}</em></b> and the tagline as a
  // <small> (TCRN-DS-SUB-144).
  const lockupMarkup = bar[1].slice(lockup.index);
  assert.match(lockupMarkup, /^<div [^>]*data-lockup="lkr"[^>]*><svg [^>]*data-logo="tms"[^>]*data-product-mark-variant="color"/);
  assert.match(lockupMarkup, /<b class="tcrn-product-logo__line-one"[^>]*><span class="tcrn-product-logo__line-one-base">TCRN<\/span> <em class="tcrn-product-logo__line-one-suffix tcrn-brand-wordmark__suffix--tms">TMS<\/em><\/b>/);
  assert.match(lockupMarkup, /<\/b><small class="tcrn-product-logo__line-two">艺人管理系统<\/small>/);
  const { document } = new JSDOM(`<!doctype html><body>${html}</body>`).window;
  const node = document.querySelector('[data-lockup="lkr"]');
  assert.equal(node?.querySelector("svg[data-logo]")?.getAttribute("data-logo"), "tms", "[data-lockup] svg[data-logo]");
  assert.equal(node?.querySelector("b")?.textContent, "TCRN TMS", "[data-lockup] b");
  assert.equal(node?.querySelector("b > em")?.textContent, "TMS", "[data-lockup] b > em");
  assert.equal(node?.querySelector("small")?.textContent, "艺人管理系统", "[data-lockup] small");
  assert.equal(node?.querySelectorAll("button, a, [tabindex]").length, 0, "nothing in the lockup takes focus");
  // The lockup has no hover rule, so it never answers the pointer.
  assert.doesNotMatch(tcrnComponentCss, /tcrn-shell-menu__lockup[^{,]*:hover/);
});

test("the menu hangs 6 under the brand button at the paper's edge and is the expanded panel token wide", () => {
  const root = ruleBody(".tcrn-shell-menu");
  assert.equal(declaration(root, "position"), "absolute");
  assert.equal(
    declaration(root, "top"),
    "calc((var(--tcrn-shell-strip-h) - var(--tcrn-shell-brand-h)) / 2 + var(--tcrn-shell-brand-h) + var(--tcrn-shell-menu-gap))"
  );
  assert.equal(declaration(root, "left"), "var(--tcrn-space-3)");
  assert.equal(declaration(root, "grid-template-columns"), "min(var(--tcrn-shell-panel-w-expanded), calc(100vw - 2 * var(--tcrn-space-3)))");
  assert.equal(declaration(root, "inline-size"), "min(var(--tcrn-shell-panel-w-expanded), calc(100vw - 2 * var(--tcrn-space-3)))");
  assert.equal(declaration(root, "z-index"), "var(--tcrn-z-popover)");
  const tokens = createTokenMap();
  const px = (variable: string) => Number.parseFloat(tokens[variable]);
  const brandBottom = (px("--tcrn-shell-strip-h") - px("--tcrn-shell-brand-h")) / 2 + px("--tcrn-shell-brand-h");
  const top = brandBottom + px("--tcrn-shell-menu-gap");
  assert.equal(top, 52);
  assert.equal(top - brandBottom, 6);
  assert.equal(px("--tcrn-space-3"), 12);
  assert.equal(px("--tcrn-shell-panel-w-expanded"), 952);
  // The panel reaches at most the viewport's bottom: the viewport less the band (07a: 640 − 52 = 588).
  assert.equal(declaration(ruleBody(".tcrn-shell-menu__panel"), "max-block-size"), "calc(100vh - var(--tcrn-shell-strip-h))");
});

test("the panel is paper with the s3 shadow, whose largest blur is 3", () => {
  const panel = ruleBody(".tcrn-shell-menu__panel");
  assert.equal(declaration(panel, "box-shadow"), "var(--tcrn-shadow-s3)");
  assert.equal(declaration(panel, "background"), "var(--tcrn-color-panel)");
  assert.equal(declaration(panel, "border-radius"), "var(--tcrn-radius-panel)");
  assert.equal(declaration(panel, "padding"), "var(--tcrn-space-2) var(--tcrn-space-2) 0");
  const shadow = createTokenMap()["--tcrn-shadow-s3"];
  const blurs = shadow.split(/,(?![^(]*\))/).map((layer) => Number.parseFloat(layer.trim().split(/\s+/)[2]));
  assert.ok(blurs.length > 0 && blurs.every((blur) => blur <= 3), `s3 blurs ${blurs.join(", ")}`);
  assert.doesNotMatch(shellCss03, /backdrop-filter|blur\(|gradient/);
});

test("search 40, three columns 16 apart, rows 32, row content 16 inside the panel edge", () => {
  assert.equal(declaration(ruleBody(".tcrn-shell-menu__search .tcrn-search-input"), "--tcrn-search-input-block-size"), "var(--tcrn-shell-srch-h)");
  const cols = ruleBody(".tcrn-shell-menu__cols");
  assert.equal(declaration(cols, "grid-template-columns"), "repeat(3, minmax(0, 1fr))");
  assert.equal(declaration(cols, "gap"), "0 var(--tcrn-space-4)");
  assert.equal(declaration(ruleBody(".tcrn-shell-menu .tcrn-nav-item"), "block-size"), "var(--tcrn-shell-row-h)");
  assert.equal(declaration(ruleBody(".tcrn-shell-menu .tcrn-nav-item-row"), "block-size"), "var(--tcrn-shell-row-h)");
  assert.equal(declaration(ruleBody(".tcrn-shell-menu__cols .tcrn-nav-item"), "padding-inline-start"), "var(--tcrn-space-2)");
  assert.equal(declaration(ruleBody(".tcrn-shell-menu .tcrn-nav-group__label"), "block-size"), "var(--tcrn-control-height-sm)");
  const tokens = createTokenMap();
  const px = (variable: string) => Number.parseFloat(tokens[variable]);
  assert.equal(px("--tcrn-shell-srch-h"), 40);
  assert.equal(px("--tcrn-space-4"), 16);
  assert.equal(px("--tcrn-shell-row-h"), 32);
  assert.equal(px("--tcrn-space-2") + px("--tcrn-space-2"), 16, "panel inset plus row inset");
  // 07a geometry: first item top = 52 + 8 + 40 + 6 + 2 + 6 + 28 + 2 = 144 (spec-geom menuItemTop).
  const firstItemTop = 52 + px("--tcrn-space-2") + px("--tcrn-shell-srch-h") + px("--tcrn-space-1h") + px("--tcrn-space-0h") + px("--tcrn-space-1h") + px("--tcrn-control-height-sm") + px("--tcrn-space-0h");
  assert.equal(firstItemTop, 144);
});

test("the bottom bar is pbar-h plus the panel's bottom inset, its rule a 1px line, the lockup 16 from the right edge", () => {
  const bar = ruleBody(".tcrn-shell-menu__pbar");
  assert.equal(declaration(bar, "block-size"), "calc(var(--tcrn-shell-pbar-h) + var(--tcrn-space-2))");
  assert.equal(declaration(bar, "align-items"), "center");
  assert.equal(declaration(bar, "border-top"), "1px solid var(--tcrn-color-line)");
  assert.equal(declaration(bar, "padding"), "0 var(--tcrn-space-2)");
  assert.equal(declaration(bar, "margin"), "var(--tcrn-space-1h) 0 0");
  const lockup = ruleBody(".tcrn-shell-menu__lockup");
  assert.equal(declaration(lockup, "margin-inline-start"), "auto");
  // The side-rail sizes are written once, in the brand tier of brand.css.ts, which the lockup takes
  // through its data-lockup="lkr" hook; the bar's rule only places it (C13, TCRN-DS-SUB-144).
  assert.doesNotMatch(lockup, /--tcrn-brand-|gap:/);
  assert.doesNotMatch(shellCss03, /tcrn-product-logo__byline/);
  const tier = ruleBody('.tcrn-shell-brand-lockup[data-lockup="lkr"]', brandCss02);
  assert.equal(declaration(tier, "--tcrn-brand-mark-size"), "var(--tcrn-shell-mark)");
  assert.equal(createTokenMap()["--tcrn-shell-mark"], "22px", "the mark is shell.mark, 22 (TCRN-DS-SUB-178)");
  assert.equal(declaration(tier, "--tcrn-brand-line-one-size"), "12.5px");
  assert.equal(declaration(tier, "--tcrn-brand-line-two-size"), "10.5px");
  assert.equal(declaration(tier, "gap"), "var(--tcrn-space-2h)");
  assert.match(brandCss02, /\.tcrn-shell-brand-lockup\[data-lockup="lkr"\] \.tcrn-product-logo__byline \{\n {2}display: none;/);
  assert.doesNotMatch(shellCss03, /--tcrn-brand-line-|--tcrn-brand-mark-size/, "no copy of the side-rail sizes in the menu segment");
  const tokens = createTokenMap();
  const px = (variable: string) => Number.parseFloat(tokens[variable]);
  assert.equal(px("--tcrn-shell-pbar-h") + px("--tcrn-space-2"), 52);
  assert.equal(px("--tcrn-space-2") + px("--tcrn-space-2"), 16, "panel inset plus bar inset: lockup right = 12 + 952 − 16 = 948");
  // 07a geometry: rule at 290 and panel bottom at 342 (spec-geom menuBarTop, menuBottom) with four rows a column.
  const barTop = 144 + 4 * px("--tcrn-shell-row-h") + 3 * px("--tcrn-space-0h") + px("--tcrn-space-1") + px("--tcrn-space-0h") + px("--tcrn-space-1h");
  assert.equal(barTop, 290);
  assert.equal(barTop + px("--tcrn-shell-pbar-h") + px("--tcrn-space-2"), 342);
});

test("rows paint with the pair grammar, group titles are ink-3 without a hover fill, states switch the pair only", () => {
  const row = ruleBody(".tcrn-shell-menu .tcrn-nav-item");
  for (const [property, value] of [
    ["--tcrn-pair-ink-d", "var(--tcrn-color-ink-2)"],
    ["--tcrn-pair-fill-h", "var(--tcrn-color-hover)"],
    ["--tcrn-pair-ink-h", "var(--tcrn-color-ink)"],
    ["--tcrn-pair-fill-s", "var(--tcrn-color-wash)"],
    ["--tcrn-pair-weight-s", "var(--tcrn-type-weight-strong)"],
    ["--tcrn-pair-icon-d", "var(--tcrn-color-ink-3)"]
  ] as const) {
    assert.equal(declaration(row, property), value);
  }
  assert.equal(declaration(ruleBody(".tcrn-shell-menu .tcrn-nav-group__label"), "color"), "var(--tcrn-color-ink-3)");
  assert.doesNotMatch(shellCss03, /tcrn-nav-group__label[^{]*:hover/);
  // Every state rule (hover, selected or open, focus, previews) declares pair variables and nothing else.
  for (const match of shellCss03.matchAll(/\n([^\n{}]*:where\([^{]*)\{\n([^}]*)\}/g)) {
    const [, selector, body] = match;
    if (/opacity/.test(body)) continue;
    // The forced-colours outline of a focused row or result paints nothing elsewhere: transparent,
    // as contract-static C2 and the contract proof let it through (TCRN-DS-SUB-155).
    if (/:where\(:focus-visible\)/.test(selector) && body.trim().split("\n").every((line) => /^(?:outline: 2px solid transparent|outline-offset: 2px);$/.test(line.trim()))) continue;
    for (const line of body.trim().split("\n")) assert.match(line.trim(), /^--tcrn-pair-[a-z-]+: var\(--tcrn-pair-[a-z-]+\);$/, selector);
  }
  // One property set by day and at night.
  assert.doesNotMatch(shellCss03, /data-tcrn-theme/);
  assert.ok(tcrnComponentCss.includes(shellCss03), "the segment ships in tcrnComponentCss");
});

test("the menu's copy is written in all five locales", () => {
  for (const locale of tcrnSupportedLocales) {
    const copy = tcrnShellCopy[locale];
    for (const key of ["navigation", "searchNavigation", "currentPosition"] as const) assert.ok(copy[key].trim().length > 0, `${locale} ${key}`);
    const html = renderBoardMenu({ locale });
    assert.match(html, new RegExp(`aria-label="${escapeRegExp(copy.navigation)}" data-panel="expanded"`));
    assert.match(html, new RegExp(`placeholder="${escapeRegExp(copy.searchNavigation)}"`));
    assert.match(html, new RegExp(`aria-label="${escapeRegExp(copy.currentPosition)}"`));
  }
  assert.equal(renderBoardMenu({ searchPlaceholder: "搜索页面、艺人、合约" }).includes('placeholder="搜索页面、艺人、合约"'), true);
});

test("the model stops at the fourth level: a fourth-level row shows no next level", () => {
  assert.equal(shellMenuMaxDepth, 4);
  const context = { selectedId: null, pinnedIds: new Set<string>() };
  const deep = { id: "deep", label: "第四级", children: [{ id: "fifth", label: "第五级" }] };
  assert.doesNotMatch(renderToStaticMarkup(<>{shellMenuRow(deep, 4, context)}</>), /chevron-right/);
  assert.match(renderToStaticMarkup(<>{shellMenuRow(deep, 3, context)}</>), /chevron-right/);
});

// TCRN-DS-SUB-117: the behaviour's static half — the cascade columns' rule, the pinned group's
// breakpoint, the reduced-motion block and the built-in search. The interactions are in
// src/test/shell-menu.dom.spec.tsx.
test("cascade columns follow the panel at the cascade gap, drop-down wide, as tall as the panel by the grid row", () => {
  const root = ruleBody(".tcrn-shell-menu");
  assert.equal(declaration(root, "grid-auto-flow"), "column");
  assert.equal(declaration(root, "grid-auto-columns"), "var(--tcrn-shell-drop-w)");
  assert.equal(declaration(root, "column-gap"), "var(--tcrn-shell-cascade-gap)");
  assert.equal(declaration(root, "align-items"), "stretch");
  const column = ruleBody(".tcrn-shell-menu .tcrn-shell-menu__cascade");
  assert.equal(declaration(column, "contain"), "size", "its content does not size the row");
  assert.equal(declaration(column, "overflow-y"), "auto");
  assert.equal(declaration(column, "box-shadow"), "var(--tcrn-shadow-s3)");
  assert.equal(declaration(column, "padding"), "var(--tcrn-space-1h)");
  // The panel's own height comes from its content; nothing in the menu syncs heights by script.
  assert.doesNotMatch(renderBoardMenu(), /style="[^"]*height/);
});

test("narrower than 1024 the pinned group shows; under reduced motion nothing fades or transitions", () => {
  assert.match(shellCss03, /@media \(min-width: 1024px\) \{\n {2}\.tcrn-shell-menu \.tcrn-shell-menu__col--pinned \{\n {4}display: none;\n {2}\}\n\}/);
  const reduced = /@media \(prefers-reduced-motion: reduce\) \{([\s\S]*?)\n\}/.exec(shellCss03);
  assert.ok(reduced, "the segment has a reduced-motion block");
  assert.match(reduced[1], /\.tcrn-shell-menu__panel,\n {2}\.tcrn-shell-menu \.tcrn-shell-menu__cascade \{\n {4}animation: none;/);
  assert.match(reduced[1], /\.tcrn-shell-menu \.tcrn-nav-item \{\n {4}transition: none;/);
  // The fade is opacity only: no transform, so a reading taken while it runs is the final geometry.
  const keyframes = /@keyframes tcrn-shell-menu-enter \{([\s\S]*?)\n\}/.exec(shellCss03);
  assert.ok(keyframes);
  assert.doesNotMatch(keyframes[1], /transform|translate|scale/);
  const pinned = renderBoardMenu({ pinnedItems: [{ id: "billing", label: "结算单", href: "#billing" }, { id: "talent", label: "艺人" }] });
  assert.match(pinned, /class="tcrn-nav-group tcrn-shell-menu__col tcrn-shell-menu__col--pinned"/);
  for (const locale of tcrnSupportedLocales) assert.ok(tcrnShellCopy[locale].pinnedGroup.trim().length > 0, `${locale} pinnedGroup`);
});

test("the built-in search keeps the entries whose name, or an item above them, holds the query", () => {
  const titles = (query: string) => shellMenuSearch(boardMenu, query).map((result) => result.title);
  assert.deepEqual(titles("合约"), ["合约列表", "签约合同", "经纪合同", "活动合同", "保密协议", "审批", "到期提醒"]);
  assert.deepEqual(titles("  "), []);
  assert.deepEqual(shellMenuSearch(boardMenu, "名册"), [{ id: "roster", title: "名册", meta: "艺人", href: "#roster" }]);
  assert.equal(shellMenuSearch(boardMenu, "签约")[0]?.meta, "艺人 › 合约 › 模板");
});

// The Sheet (TCRN-DS-SUB-126; 07a board, screen A8): the board's four pins and its group icons.
const sheetMenu: readonly ShellMenuGroup[] = boardMenu.map((group, index) => ({ ...group, iconName: (["users", "calendar", "settings"] as const)[index] }));
const boardPins = [
  { id: "roster", label: "名册", href: "#roster" },
  { id: "contracts", label: "合约", hasMenu: true },
  { id: "billing", label: "结算单", href: "#billing" },
  { id: "schedule", label: "排期", hasMenu: true }
];

function renderBoardSheet(extra: Partial<Parameters<typeof ShellMenu>[0]> = {}) {
  return renderBoardMenu({ groups: sheetMenu, presentation: "sheet", pinnedItems: boardPins, ...extra });
}

test("760 wide and narrower the menu is the Sheet: the scrim, one non-modal dialog, the grab line, the search and the two lists", () => {
  assert.equal(shellMenuSheetMediaQuery, "(max-width: 760px)");
  const html = renderBoardSheet();
  assert.match(
    html,
    /^<div class="tcrn-shell-sheet__scrim" data-shell-scrim="" aria-hidden="true"><\/div><div class="tcrn-shell-menu tcrn-shell-sheet" data-shell-menu=""><section id="menu" class="tcrn-shell-sheet__panel" role="dialog" aria-modal="false" aria-label="导航" tabindex="-1" data-panel="sheet"><span class="tcrn-shell-sheet__grab" aria-hidden="true"><\/span><div data-shell-search=""/
  );
  assert.equal((html.match(/role="dialog"/g) ?? []).length, 1);
  assert.doesNotMatch(html, /data-panel="expanded"|data-shell-pbar|data-lockup/, "no panel, no bottom bar: the paper shows the current position");
  // The pinned entries first, then every group (07a board: "固定项 · 4", "全部").
  const pinnedTitle = html.indexOf(">固定项 · 4<");
  const allTitle = html.indexOf(">全部<");
  assert.ok(pinnedTitle > 0 && allTitle > pinnedTitle, "固定项 · 4 comes before 全部");
  assert.equal((html.match(/data-shell-group=""/g) ?? []).length, 2);
  assert.equal((html.match(/data-shell-row=""/g) ?? []).length, 7, "four pins and three groups");
  assert.equal((html.match(/data-shell-level="1"/g) ?? []).length, 7);
  assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1, "the selected row; no trail in the Sheet");
  // A group and a pinned entry with a next level open it on a press: five such rows, with the chevron.
  assert.equal((html.match(/tcrn-shell-menu__sub/g) ?? []).length, 5);
  assert.equal((html.match(/<a(?=[^>]*role="button")(?=[^>]*aria-expanded="false")[^>]*>/g) ?? []).length, 5);
  assert.match(html, /<span class="tcrn-shell-menu__text">运营<\/span><svg[^>]*width="12"[^>]*data-icon-name="chevron-right"/);
  // The rows carry the model's icons; the only buttons are the pins.
  assert.match(html, /<a(?=[^>]*title="艺人")[^>]*>[\s\S]*?data-icon-name="users"/);
  const buttons = html.match(/<button[^>]*>/g) ?? [];
  assert.equal(buttons.length, 7);
  for (const button of buttons) assert.match(button, /data-pin-button=""/);
  assert.equal((html.match(/aria-pressed="true"/g) ?? []).length, 4);
  assert.doesNotMatch(html, /collapse|收起/);
  // Without pins there is only the list of every group.
  const bare = renderBoardSheet({ pinnedItems: [] });
  assert.doesNotMatch(bare, /data-shell-pinned-group/);
  assert.equal((bare.match(/data-shell-group=""/g) ?? []).length, 1);
});

test("the presentation is the prop's, else the context's; on the server auto is the panel", () => {
  const menu = (extra: Partial<Parameters<typeof ShellMenu>[0]> = {}) => <ShellMenu groups={boardMenu} open productId="tms" id="menu" locale="en" {...extra} />;
  assert.match(renderToStaticMarkup(menu()), /data-panel="expanded"/);
  assert.match(renderToStaticMarkup(<shellMenuPresentationContext.Provider value="sheet">{menu()}</shellMenuPresentationContext.Provider>), /data-panel="sheet"/);
  assert.match(renderToStaticMarkup(<shellMenuPresentationContext.Provider value="sheet">{menu({ presentation: "panel" })}</shellMenuPresentationContext.Provider>), /data-panel="expanded"/);
  assert.match(renderToStaticMarkup(menu({ presentation: "sheet" })), /data-panel="sheet"/);
  assert.equal(renderToStaticMarkup(menu({ presentation: "sheet", open: false })), "", "closed, nothing is rendered");
});

test("the Sheet sits on the bottom edge below the top band, at most 84% high, over a scrim of 20% ink", () => {
  assert.equal(declaration(ruleBody(".tcrn-shell-menu.tcrn-shell-sheet", shellSheetCss01), "display"), "contents");
  const scrim = ruleBody(".tcrn-shell-sheet__scrim", shellSheetCss01);
  assert.equal(declaration(scrim, "position"), "fixed");
  assert.equal(declaration(scrim, "inset"), "0");
  assert.equal(declaration(scrim, "background"), "color-mix(in srgb, var(--tcrn-color-ink) 20%, transparent)");
  const panel = ruleBody(".tcrn-shell-sheet__panel", shellSheetCss01);
  assert.equal(declaration(panel, "position"), "fixed");
  assert.equal(declaration(panel, "inset-inline"), "0");
  assert.equal(declaration(panel, "inset-block-end"), "0");
  assert.equal(declaration(panel, "max-block-size"), "min(84%, calc(100% - var(--tcrn-shell-strip-h)))");
  assert.equal(declaration(panel, "padding"), "var(--tcrn-space-2) var(--tcrn-space-2) var(--tcrn-space-3)");
  assert.equal(declaration(panel, "border-radius"), "var(--tcrn-radius-paper) var(--tcrn-radius-paper) 0 0");
  assert.equal(declaration(panel, "background"), "var(--tcrn-color-panel)");
  assert.equal(declaration(panel, "box-shadow"), "var(--tcrn-shadow-s3)");
  assert.equal(declaration(panel, "z-index"), "var(--tcrn-z-overlay)");
  assert.equal(declaration(scrim, "z-index"), "var(--tcrn-z-overlay)");
  const tokens = createTokenMap();
  const px = (variable: string) => Number.parseFloat(tokens[variable]);
  // 844 high (390 × 844): the Sheet is at most 709 high, so its top (135) stays below the band (52).
  assert.equal(px("--tcrn-shell-strip-h"), 52);
  assert.ok(844 - Math.min(0.84 * 844, 844 - px("--tcrn-shell-strip-h")) >= px("--tcrn-shell-strip-h"));
  assert.deepEqual([px("--tcrn-space-2"), px("--tcrn-space-3"), px("--tcrn-radius-paper")], [8, 12, 14], "inset 8 8 12, radius 14 14 0 0");
  // The grab line: 36 by 4, the line-2 ink.
  const grab = ruleBody(".tcrn-shell-sheet__grab", shellSheetCss01);
  assert.equal(declaration(grab, "inline-size"), "calc(3 * var(--tcrn-space-3))");
  assert.equal(3 * px("--tcrn-space-3"), 36);
  assert.equal(declaration(grab, "block-size"), "var(--tcrn-space-1)");
  assert.equal(px("--tcrn-space-1"), 4);
  assert.equal(declaration(grab, "background"), "var(--tcrn-color-line-2)");
});

test("in the Sheet rows and the search are 44 high and a pin takes presses 44 across", () => {
  const panel = ruleBody(".tcrn-shell-sheet__panel", shellSheetCss01);
  // The 44 is the touch token (TCRN-DS-SUB-142).
  assert.equal(declaration(panel, "--tcrn-shell-row-h"), "var(--tcrn-shell-touch)");
  assert.equal(declaration(panel, "--tcrn-shell-srch-h"), "var(--tcrn-shell-touch)");
  // The rows and the search read these tokens (shellCss03), so the Sheet's are 44 whatever the pointer.
  assert.equal(declaration(ruleBody(".tcrn-shell-menu .tcrn-nav-item"), "block-size"), "var(--tcrn-shell-row-h)");
  assert.equal(declaration(ruleBody(".tcrn-shell-menu .tcrn-nav-item-row"), "block-size"), "var(--tcrn-shell-row-h)");
  assert.equal(declaration(ruleBody(".tcrn-shell-menu__search .tcrn-search-input"), "--tcrn-search-input-block-size"), "var(--tcrn-shell-srch-h)");
  const hotZone = ruleBody(".tcrn-shell-sheet .tcrn-nav-pin::after", shellSheetCss01);
  assert.equal(declaration(hotZone, "position"), "absolute");
  assert.equal(declaration(hotZone, "inset"), "calc(-1 * var(--tcrn-space-2h))");
  const tokens = createTokenMap();
  const px = (variable: string) => Number.parseFloat(tokens[variable]);
  assert.equal(px("--tcrn-shell-touch"), 44);
  assert.equal(px("--tcrn-shell-pinb") + 2 * px("--tcrn-space-2h"), 44);
  // The pin ends space-1 before the row's end, so its 44 passes the row by 6: the list's scrollport
  // reaches the Sheet's edge (space-2 further), its rows stay where they were.
  const list = ruleBody(".tcrn-shell-sheet__list", shellSheetCss01);
  assert.equal(declaration(list, "margin-inline"), "calc(-1 * var(--tcrn-space-2))");
  assert.equal(declaration(list, "padding-inline"), "var(--tcrn-space-2)");
  assert.ok(px("--tcrn-space-2h") - px("--tcrn-space-1") <= px("--tcrn-space-2"));
  // The rows keep the full menu's icon column; a row without an icon starts its text in the second.
  const row = ruleBody(".tcrn-shell-sheet .tcrn-nav-item", shellSheetCss01);
  assert.equal(declaration(row, "grid-template-columns"), declaration(ruleBody(".tcrn-shell-menu__cols .tcrn-nav-item"), "grid-template-columns"));
  assert.equal(declaration(row, "padding-inline-start"), "var(--tcrn-space-2)");
});

test("a row's icon is the board's .ic box: 22 square, inset 3, border-box, on the icon column's start 16 inside the panel; glyph 19, text 48, in the full menu and the Sheet (TCRN-DS-SUB-188)", () => {
  const tokens = createTokenMap();
  // A length written with tokens, in px: 0, var(), and calc() over var() with + - * / and numbers.
  const lengthPx = (value: string) => {
    const arithmetic = value.trim().replace(/var\((--[a-z0-9-]+)\)/g, (_, name: string) => {
      const pixels = Number.parseFloat(tokens[name]);
      assert.ok(Number.isFinite(pixels), `${name} is a pixel token`);
      return String(pixels);
    }).replace(/^calc\((.*)\)$/, "$1").replace(/px\b/g, "");
    assert.match(arithmetic, /^[\d\s.+\-*/()]+$/, `${value} is token arithmetic`);
    const parts = arithmetic.match(/\d+(?:\.\d+)?|[-+*/()]/g) ?? [];
    let at = 0;
    const factor = (): number => {
      const part = parts[at++];
      if (part === "(") {
        const inner = sum();
        at++;
        return inner;
      }
      return part === "-" ? -factor() : Number(part);
    };
    const product = (): number => {
      let result = factor();
      while (parts[at] === "*" || parts[at] === "/") result = parts[at++] === "*" ? result * factor() : result / factor();
      return result;
    };
    const sum = (): number => {
      let result = product();
      while (parts[at] === "+" || parts[at] === "-") result = parts[at++] === "+" ? result + product() : result - product();
      return result;
    };
    const result = sum();
    assert.equal(at, parts.length, `${value} is read to its end`);
    return result;
  };
  // The box: board .ic (shell-screen .ts-it .ic, 22 x 22, padding 3, border-box under the board's reset).
  const side = "calc(var(--tcrn-icon-size-md) + var(--tcrn-space-1h))";
  const box = ruleBody(".tcrn-shell-menu .tcrn-nav-item > .tcrn-icon");
  assert.equal(declaration(box, "box-sizing"), "border-box");
  assert.equal(declaration(box, "inline-size"), side);
  assert.equal(declaration(box, "block-size"), side);
  assert.equal(declaration(box, "padding"), "calc(var(--tcrn-space-1h) / 2)");
  assert.equal(lengthPx(side), 22, "the box is 22 x 22");
  assert.equal(lengthPx(declaration(box, "padding")), 3, "its inset is 3");
  assert.equal(lengthPx(side) - 2 * lengthPx(declaration(box, "padding")), lengthPx("var(--tcrn-icon-size-md)"), "the glyph keeps the md 16");
  // The box is exactly the icon column, so it sits on the column's start edge: the full menu's and
  // the Sheet's first track is the same length, and no justify-self moves the glyph (B2-2 withdrawn).
  assert.doesNotMatch(box, /justify-self: start/);
  const fullRow = ruleBody(".tcrn-shell-menu__cols .tcrn-nav-item");
  const sheetRow = ruleBody(".tcrn-shell-sheet .tcrn-nav-item", shellSheetCss01);
  for (const row of [fullRow, sheetRow]) assert.equal(declaration(row, "grid-template-columns"), `${side} minmax(0, 1fr)`);
  // Measured on the rendered full menu and Sheet: every guide icon is its row link's first child and
  // the box rule reaches it; its left edge from the panel's is the sum of the inline-start insets the
  // rules give the elements between them, each element named here (a new wrapper fails the walk).
  const secondOf = (shorthand: string) => {
    const parts = shorthand.split(/\s+(?![^(]*\))/);
    return parts[1] ?? parts[0];
  };
  const insetOf: Readonly<Record<string, (inSheet: boolean) => number>> = {
    "tcrn-shell-menu__panel": () => lengthPx(secondOf(declaration(ruleBody(".tcrn-shell-menu__panel"), "padding"))),
    "tcrn-shell-sheet__panel": () => lengthPx(secondOf(declaration(ruleBody(".tcrn-shell-sheet__panel", shellSheetCss01), "padding"))),
    "tcrn-shell-menu__cols": () => lengthPx(secondOf(declaration(ruleBody(".tcrn-shell-menu__cols"), "padding"))),
    "tcrn-shell-sheet__list": () => {
      const list = ruleBody(".tcrn-shell-sheet__list", shellSheetCss01);
      return lengthPx(declaration(list, "margin-inline")) + lengthPx(declaration(list, "padding-inline"));
    },
    "tcrn-shell-menu__col": () => 0,
    "tcrn-shell-sheet__group": () => 0,
    "tcrn-nav-group__items": () => 0,
    "tcrn-nav-item-row": () => 0,
    "tcrn-nav-item": (inSheet) => lengthPx(declaration(inSheet ? sheetRow : fullRow, "padding-inline-start"))
  };
  const columnGap = lengthPx(declaration(ruleBody(".tcrn-shell-menu .tcrn-nav-item"), "column-gap"));
  for (const [inSheet, html] of [[false, renderBoardMenu()], [true, renderBoardSheet()]] as const) {
    const { document } = new JSDOM(html).window;
    const panel = document.querySelector(inSheet ? '[data-panel="sheet"]' : '[data-panel="expanded"]');
    assert.ok(panel);
    const icons = [...panel.querySelectorAll('[data-guide="prail"]')];
    assert.ok(icons.length >= (inSheet ? 3 : 10), "the guide icons are there");
    for (const icon of icons) {
      assert.ok(icon.matches(".tcrn-shell-menu .tcrn-nav-item > .tcrn-icon"), "the box rule reaches the guide icon");
      assert.equal(icon.parentElement?.firstElementChild, icon, "the icon is in the first track");
      let left = 0;
      for (let element: Element | null = icon.parentElement; element; element = element.parentElement) {
        const known: string[] = [...element.classList].filter((name) => name in insetOf);
        assert.equal(known.length, 1, `${element.className} is a named step between the panel and the icon`);
        left += insetOf[known[0]](inSheet);
        if (element === panel) break;
      }
      assert.equal(left, 16, "the box's left edge is 16 inside the panel");
      assert.equal(left + lengthPx(declaration(box, "padding")), 19, "the glyph's left edge is 19");
      assert.equal(left + lengthPx(side) + columnGap, 48, "the text starts at 48");
    }
  }
});

test("the light and the night Sheet share their rules; it fades, opacity only, and comes last in the stylesheet", () => {
  assert.doesNotMatch(shellSheetCss01, /data-tcrn-theme/, "no rule names a theme");
  assert.doesNotMatch(shellSheetCss01, /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i, "colours only through tokens");
  assert.doesNotMatch(shellSheetCss01, /transform|translate|scale\(/, "nothing moves");
  assert.equal((shellSheetCss01.match(/animation: tcrn-shell-menu-enter var\(--tcrn-motion-duration-fill\) var\(--tcrn-motion-ease\) both;/g) ?? []).length, 2);
  const reduced = /@media \(prefers-reduced-motion: reduce\) \{([\s\S]*?)\n\}/.exec(shellSheetCss01);
  assert.ok(reduced);
  assert.match(reduced[1], /\.tcrn-shell-sheet__scrim,\n {2}\.tcrn-shell-sheet__panel \{\n {4}animation: none;/);
  assert.ok(tcrnComponentCss.endsWith(shellIntroCss01 + shellSheetCss01), "after the sign-in intro, last");
});

test("the Sheet's copy is written in all five locales", () => {
  for (const locale of tcrnSupportedLocales) {
    const copy = tcrnShellCopy[locale];
    assert.ok(copy.allNavigation.trim().length > 0, `${locale} allNavigation`);
    assert.match(copy.pinnedItemsOf(4), /4/, `${locale} pinnedItemsOf`);
    assert.notEqual(copy.allNavigation, copy.pinnedGroup);
    assert.notEqual(copy.pinnedItemsOf(4), copy.pinnedItems);
    const html = renderBoardSheet({ locale });
    assert.ok(html.includes(`>${copy.pinnedItemsOf(4)}<`), `${locale} pinned title`);
    assert.ok(html.includes(`>${copy.allNavigation}<`), `${locale} all title`);
    assert.match(html, new RegExp(`aria-label="${escapeRegExp(copy.navigation)}" tabindex="-1" data-panel="sheet"`));
  }
});

test("the query may be the product's: query or defaultQuery shows its results, and without them the columns show as before (TCRN-DS-SUB-147)", () => {
  const plain = renderBoardMenu();
  assert.match(plain, /data-shell-cols=""/);
  assert.equal(new JSDOM(plain).window.document.querySelectorAll("[data-search-result]").length, 0);
  for (const extra of [{ defaultQuery: "合约" }, { query: "合约" }, { query: "合约", defaultQuery: "名册" }]) {
    const { document } = new JSDOM(renderBoardMenu(extra)).window;
    assert.equal(document.querySelector("[data-shell-cols]"), null, JSON.stringify(extra));
    assert.equal(document.querySelector<HTMLInputElement>('[data-shell-search] input[type="search"]')?.value, "合约");
    assert.deepEqual([...document.querySelectorAll("[data-search-result] strong")].map((element) => element.textContent), ["合约列表", "签约合同", "经纪合同", "活动合同", "保密协议", "审批", "到期提醒"]);
  }
  // A held empty query outranks the default one.
  assert.match(renderBoardMenu({ query: "", defaultQuery: "合约" }), /data-shell-cols=""/);
});

const describedMenu: readonly ShellMenuGroup[] = boardMenu.map((group, index) =>
  index === 0
    ? { ...group, description: "艺人与团队的资料", items: group.items.map((item, at) => (at === 0 ? { ...item, description: "全部艺人" } : item)) }
    : group
);
const stripDescriptions = (html: string) => html.replace(/ aria-describedby="[^"]*"/g, "").replace(/<span id="[^"]*" class="tcrn-sr-only">[^<]*<\/span>/g, "");

test("a group's or an entry's description is said with its row through aria-describedby to a .tcrn-sr-only element; without one the markup is unchanged (TCRN-DS-SUB-147)", () => {
  const plain = renderBoardMenu();
  assert.doesNotMatch(plain, /tcrn-sr-only|aria-describedby/);
  const described = renderBoardMenu({ groups: describedMenu });
  assert.equal(stripDescriptions(described), plain, "the descriptions add the reference and the hidden text, nothing else");
  const { document } = new JSDOM(described).window;
  const said = (element: Element | null) => {
    const id = element?.getAttribute("aria-describedby") ?? "";
    const target = id ? document.getElementById(id) : null;
    return target?.matches(".tcrn-sr-only") ? target.textContent : null;
  };
  const titles = [...document.querySelectorAll("[data-shell-group] > .tcrn-nav-group__label")];
  assert.equal(said(titles[0] ?? null), "艺人与团队的资料");
  assert.deepEqual(titles.slice(1).map((title) => title.hasAttribute("aria-describedby")), titles.slice(1).map(() => false));
  const firstRow = document.querySelector(`[data-shell-row][title="${boardMenu[0]?.items[0]?.label}"]`);
  assert.equal(said(firstRow), "全部艺人");
  assert.equal(document.querySelectorAll("[aria-describedby]").length, 2);
  // In the Sheet a group is a row of the list, and its row carries the description.
  const sheet = new JSDOM(renderToStaticMarkup(
    <ShellMenu groups={describedMenu} open presentation="sheet" productId="tms" selectedId="roster" locale="zh-CN" id="menu" />
  )).window.document;
  const groupRow = sheet.querySelector(`[data-shell-row][title="${boardMenu[0]?.label}"]`);
  const id = groupRow?.getAttribute("aria-describedby") ?? "";
  assert.equal(sheet.getElementById(id)?.textContent, "艺人与团队的资料");
  assert.ok(sheet.getElementById(id)?.matches(".tcrn-sr-only"));
});

test("with landmarkLabel the panel, its bottom bar's trail and the Sheet are named after the shell, in every locale; without it the names stay (TCRN-DS-SUB-184)", () => {
  const names = (html: string) => [...new JSDOM(html).window.document.querySelectorAll('[role="dialog"], nav')].map((element) => element.getAttribute("aria-label"));
  // Without it: the names as before, word for word.
  assert.deepEqual(names(renderBoardMenu()), ["导航", "当前位置"]);
  assert.deepEqual(names(renderBoardMenu({ presentation: "sheet" })), ["导航"]);
  assert.deepEqual(names(renderBoardMenu({ landmarkLabel: "  " })), ["导航", "当前位置"], "a blank name changes nothing");
  for (const locale of tcrnSupportedLocales) {
    const copy = tcrnShellCopy[locale];
    assert.deepEqual(names(renderBoardMenu({ locale, landmarkLabel: "TMS" })), [copy.landmarkOf("TMS", copy.navigation), copy.landmarkOf("TMS", copy.currentPosition)], locale);
    assert.deepEqual(names(renderBoardMenu({ locale, landmarkLabel: "TMS", presentation: "sheet" })), [copy.landmarkOf("TMS", copy.navigation)], locale);
  }
  // The bottom bar's visible label is the menu's own copy; only the names carry the shell's.
  assert.match(renderBoardMenu({ landmarkLabel: "TMS" }), /<span class="tcrn-shell-menu__crumbs-label" aria-hidden="true">当前位置<\/span>/);
  // Two menus on one page, told apart by the name alone.
  const both = names(
    renderToStaticMarkup(
      <>
        <ShellMenu groups={boardMenu} open productId="tms" currentPath={boardPath} locale="zh-CN" landmarkLabel="Light" />
        <ShellMenu groups={boardMenu} open productId="tms" currentPath={boardPath} locale="zh-CN" landmarkLabel="Night" />
      </>
    )
  );
  assert.equal(both.length, 4);
  assert.equal(new Set(both).size, 4, both.join(" | "));
  assert.doesNotMatch(renderBoardMenu({ landmarkLabel: "TMS" }), /landmarklabel/i, "the prop reaches no element as an attribute");
});
