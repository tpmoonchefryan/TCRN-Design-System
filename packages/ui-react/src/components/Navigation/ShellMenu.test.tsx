// ShellMenu (TCRN-DS-SUB-116): the full menu's structure — one non-modal dialog, the search, three
// columns of NavGroup and NavItem rows with their pin slots, no collapse button, the bottom bar with
// the current position and the side-rail lockup that is only a picture — and the rules that place
// and size it from the shell tokens. The rendered readings (top 52, left 12, width 952, the bar's
// equal margins) are the shell gate's (TCRN-DS-SUB-137); here the rules are held to their tokens.
import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { tcrnSupportedLocales } from "@tcrn/ui-copy-state";
import { createTokenMap } from "@tcrn/ui-tokens";
import { tcrnComponentCss } from "../../styles/index.js";
import { shellCss03 } from "../../styles/shell.css.js";
import { ShellMenu, shellMenuMaxDepth, shellMenuRow, shellMenuSearch, type ShellMenuGroup } from "./ShellMenu.js";
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
  assert.equal(declaration(lockup, "--tcrn-brand-mark-size"), "22px");
  assert.equal(declaration(lockup, "--tcrn-brand-line-one-size"), "12.5px");
  assert.equal(declaration(lockup, "--tcrn-brand-line-two-size"), "10.5px");
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
