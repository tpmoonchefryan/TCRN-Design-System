// SPDX-License-Identifier: Apache-2.0
// Tab-shell readings (TCRN-DS-STORY-149, TCRN-DS-SUB-135).
//
// A port of docs/design/gplus-2026-10/measure-shell.js — the in-browser script the two Shell boards
// (docs/design/visual-standard/boards/Shell.dc.html and Shell-2.dc.html) were drawn against — into a
// library the shell gate can share. readShellInPage returns every reading of measure-shell.js under the
// same keys and with the same arithmetic (149-GWT4: the two read the same numbers on the same screen,
// within 0.5px), plus the extra readings the eighteen gates need under `x` (per shell) and under the
// top-level keys that measure-shell.js does not have (contrastCells, marks, markForms, logoForms,
// lockupCopy, intro).
//
// Readings only: no thresholds, no verdicts. scripts/shell-measure-proof.mjs owns THRESHOLDS and the
// judgement of the eighteen gates (the INIT-015 W1-F convention).
//
// Two selector sets, one reading code (cross-package convention C-5):
//   BOARD_SELECTORS    the board hooks (.ts-* classes and the data hooks the boards carry)
//   PACKAGE_SELECTORS  the package hooks (data-shell, data-shell-strip, data-tab, data-shell-brand,
//                      data-pins / data-pin / data-open-pin, data-cluster, data-paper, data-panel,
//                      data-drop-col, data-shell-search, data-shell-row, data-shell-group,
//                      data-pin-button, data-shell-pbar, data-lockup, data-shell-intro)
// A key maps the same meaning in both sets. Package keys that C-5 does not name (crumbs inside the
// bottom bar, the retired close button) use the narrowest selector that the package can render.
// TCRN-DS-SUB-137 checked them against the real parts on the static docs page: the bottom-bar crumbs
// are the bar's nav, the page crumbs are the Breadcrumb part (nav.tcrn-breadcrumb) in the paper, no
// close button and no sidebar render; [data-shell-group] sits on the whole NavGroup column, so the
// single-line reading takes the group's heading text (.tcrn-nav-group__label-text, or the heading row
// when it has no text span: the board's .ts-grp h6), and a pinned item's label element (the one that
// carries the title and truncates), not the item's wrapper.
// Cascade columns that a panel adopts with aria-owns (the package renders them next to the dropdown
// panel, not inside it) are read as the panel's columns. A C-5 hook that the gates need and an open
// layer lacks is listed in x.hookGaps (rows without the row-text hook: their text widths cannot be
// read, so x.rowGroups is null rather than an empty, silently passing list; menu columns whose rows
// carry no guide-column hooks: "prail"). A shell that sits inside another shell's paper (a story on a
// documentation page, which renders in the top-band shell) is read against its own paper only.
// TCRN-DS-SUB-174 (R2-27): a row's pin is looked up in the row's own wrapper (rowScope: the package
// renders a pinnable item as a link and its pin side by side in .tcrn-nav-item-row) and the row's
// column is that wrapper's parent; x.prail reads the guide column of the full menu and the Sheet with
// every column read as the first (col); the [data-cell] samples gain the three 07a B readings: a
// coloured mark (probe "mark", taken by any svg[data-logo] cell), a surface against what is behind it
// (probe "own-bg", taken by an edge cell with a fill of its own) and the paper under a scrim (a cell
// that a scrim is painted over gets a second reading, underScrim, with the scrim over its fill).
// TCRN-DS-SUB-164 (R2-28): the page in a shell's own paper gains three readings, x.pageCrumbs (the page
// breadcrumb: line count, reach past its box, and every crumb's overflow and how its box cuts it; key
// pageCrumb), x.settingsLayouts (width, distances from the paper's two edges) and x.splitViews (left edge
// from the paper's); the lockup and optical rows name their product and their shell (null outside
// every shell), so the first lines of the brand story can be told apart.
// TCRN-DS-SUB-206 (R3-1): o.pinButtons and the text-width groups (o.textColWidths, o.pinVisibleOn,
// x.rowGroups) read only drawn elements (getClientRects().length > 0): the full menu's pinned column,
// which the package hides at >= 1024, no longer reads as four 0 x 0 pins.
// TCRN-DS-SUB-207 (R3-2): a [data-cell] fill (all but the own-bg probe) is the paint stack under the
// cell's centre composited down to the first opaque layer, not the cell's ancestors only.
// TCRN-DS-SUB-196 (R3-3): x.textLines takes the page breadcrumb in the paper crumb by crumb (pageCrumb),
// not the trail as one line, on both selector sets (the boards' .ts-crumbs and the package's Breadcrumb).
//
// API:
//   SHELL_MEASURE_SCHEMA_VERSION, SELECTOR_KEYS, BOARD_SELECTORS, PACKAGE_SELECTORS
//   readShellInPage(options)        browser-side, self-contained; pass it to page.evaluate
//                                   options: { selectors, selectorSet?, root?, logoSources? }
//   readBrandLockupsInPage()        browser-side: the Brand board E-section lockups (.rail and .lk)
//   measureShellPage(page, options) page.evaluate(readShellInPage, options)
//   readBrandLockups(page)          page.evaluate(readBrandLockupsInPage)
//   loadLogoSources(repoRoot)       { <productId>: svg text } from docs/design/gplus-2026-10/logos2
//                                   (colour files only; the -mono files are not brand assets here)
//   formDigest(form)                sha256 hex of a canonical mark form

import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const SHELL_MEASURE_SCHEMA_VERSION = "tcrn.ds.shell-measure.v1";

export const LOGO_SOURCE_DIR = "docs/design/gplus-2026-10/logos2";

export const SELECTOR_KEYS = Object.freeze([
  "shell", "strip", "tab", "brandV1", "toggle", "pins", "pinItem", "openPin", "cluster", "paper",
  "panelPreferred", "panelAny", "panelExpanded", "panelDrop", "sheet", "dropCol", "dropCol2", "dropRow",
  "row", "rowText", "rowHover", "rowOn", "group", "search", "pinButton", "pbar", "barLockup", "lockupText",
  "crumbs", "lock", "panelClose", "close", "closeName", "sidebar", "lockup", "lockupAny", "opticalAny",
  "dropPanelAny", "stateRuleScope", "singleLineText", "pageCrumbs", "clipExempt", "intro", "rowScope", "col",
  "scrim", "pageCrumb", "settingsLayout", "splitView"
]);

// Board hooks: the selectors of measure-shell.js, key by key.
export const BOARD_SELECTORS = Object.freeze({
  shell: ".scr.ts",
  strip: ".ts-strip",
  tab: "[data-tab]",
  brandV1: ".v1",
  toggle: ".ts-tgl",
  pins: "[data-pins]",
  pinItem: "[data-pins] .ts-pin-it",
  openPin: "[data-pins] .ts-pin-it.open",
  cluster: "[data-cluster]",
  paper: "[data-paper]",
  panelPreferred: '[data-panel="expanded"], [data-panel="small"], .ts-sheet',
  panelAny: "[data-panel]",
  panelExpanded: '[data-panel="expanded"]',
  panelDrop: '[data-panel="drop"]',
  sheet: ".ts-sheet",
  dropCol: "[data-drop2], [data-drop3], [data-drop4]",
  dropCol2: "[data-drop2]",
  dropRow: ":scope > .ts-it",
  row: ".ts-it",
  rowText: "span.t",
  rowHover: ".is-hover",
  rowOn: ".on",
  group: ".ts-grp",
  search: ".ts-srch",
  pinButton: ".ts-pinb, .ts-star",
  pbar: ".ts-pbar",
  barLockup: ".lkr, .lk",
  lockupText: "span",
  crumbs: ".ts-crumbs",
  lock: ".ts-lock3, .ts-lock",
  panelClose: ".ts-x, .ts-pin",
  close: ".ts-x",
  closeName: "关闭|收起|close|collapse|dismiss",
  sidebar: ".rail, .nv, aside",
  lockup: "[data-lockup]",
  lockupAny: "[data-lockup], .ts-brand, .brand",
  opticalAny: "[data-lockup], .ts-brand",
  dropPanelAny: ".ts-drop, [data-panel='drop']",
  stateRuleScope: "\\.ts-",
  singleLineText: "[data-tab] b, .ts-pin-it, .ts-it > span.t, .ts-grp h6, .ts-srch .ph2, .ts-srch kbd, .ts-crumbs, [data-lockup] b, [data-lockup] small",
  pageCrumbs: "[data-paper] .ts-crumbs",
  clipExempt: ".grain, .sr",
  intro: "[data-shell-intro]",
  rowScope: ".ts-it",
  col: ".ts-col",
  scrim: ".ts-scrim",
  // a crumb of the page breadcrumb (.ts-crumbs: links, the current page in b); the boards draw no
  // settings page and no split view, so their two keys name the package hooks and read nothing there
  pageCrumb: ".ts-crumbs > a, .ts-crumbs > b, .ts-crumbs > span",
  settingsLayout: "[data-settings-layout]",
  splitView: '[data-pattern="split-view"]'
});

// Package hooks (C-5). dropRow is filtered to rows outside the cascade columns, which matches the
// board's direct-child rows.
export const PACKAGE_SELECTORS = Object.freeze({
  shell: "[data-shell]",
  strip: "[data-shell-strip]",
  tab: "[data-tab]",
  brandV1: '[data-shell-brand="v1"]',
  toggle: "[data-shell-toggle]",
  pins: "[data-pins]",
  pinItem: "[data-pins] [data-pin]",
  openPin: "[data-pins] [data-open-pin]",
  cluster: "[data-cluster]",
  paper: "[data-paper]",
  panelPreferred: '[data-panel="expanded"], [data-panel="sheet"]',
  panelAny: "[data-panel]",
  panelExpanded: '[data-panel="expanded"]',
  panelDrop: '[data-panel="drop"]',
  sheet: '[data-panel="sheet"]',
  dropCol: "[data-drop-col]",
  dropCol2: '[data-drop-col="2"]',
  dropRow: "[data-shell-row]",
  row: "[data-shell-row]",
  rowText: '[data-text="prail"]',
  rowHover: '[data-tcrn-preview-state~="hover"]',
  rowOn: '[aria-current="page"]',
  group: "[data-shell-group]",
  search: "[data-shell-search]",
  pinButton: "[data-pin-button]",
  pbar: "[data-shell-pbar]",
  barLockup: "[data-lockup]",
  lockupText: "span, b",
  crumbs: "nav",
  lock: "[data-shell-lock]",
  panelClose: "[data-shell-close]",
  close: "[data-shell-close]",
  closeName: "关闭|收起|close|collapse|dismiss",
  sidebar: ".tcrn-product-shell__sidebar, aside",
  lockup: "[data-lockup]",
  lockupAny: "[data-lockup], [data-tab]",
  opticalAny: "[data-lockup], [data-tab]",
  dropPanelAny: "[data-panel='drop']",
  stateRuleScope: "\\.tcrn-shell-|\\.tcrn-product-shell",
  singleLineText: '[data-tab] b, [data-pin] .tcrn-shell-pins__label, [data-shell-row] [data-text="prail"], [data-shell-group] .tcrn-nav-group__label-text, [data-shell-group] > .tcrn-nav-group__label:not(:has(.tcrn-nav-group__label-text)), [data-shell-pbar] nav, [data-lockup] b, [data-lockup] small',
  pageCrumbs: "[data-paper] .tcrn-breadcrumb",
  clipExempt: ".tcrn-sr-only",
  intro: "[data-shell-intro]",
  rowScope: ".tcrn-nav-item-row",
  col: "[data-shell-col]",
  scrim: "[data-shell-scrim]",
  pageCrumb: ".tcrn-breadcrumb__crumb",
  settingsLayout: "[data-settings-layout]",
  splitView: '[data-pattern="split-view"]'
});

// Browser-side. Self-contained (page.evaluate serialises it): nothing from module scope is used.
export function readShellInPage(options) {
  const opts = options || {};
  const sel = opts.selectors;
  if (!sel || typeof sel !== "object") throw new TypeError("shell_measure_selectors_required");
  const rootEl = opts.root ? document.querySelector(opts.root) : document.body;
  if (!rootEl) throw new Error("shell_measure_root_missing:" + opts.root);

  // --- measure-shell.js arithmetic, unchanged -------------------------------------------------------
  function parse(s) { const m = s && s.match(/rgba?\(([^)]+)\)/); if (!m) return [0, 0, 0, 0]; const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]]; }
  function over(t, b) { const a = t[3]; return [t[0] * a + b[0] * (1 - a), t[1] * a + b[1] * (1 - a), t[2] * a + b[2] * (1 - a), 1]; }
  function lin(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function lum(c) { return 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]); }
  function contrast(a, b) { const l1 = lum(a), l2 = lum(b); const hi = Math.max(l1, l2), lo = Math.min(l1, l2); return (hi + 0.05) / (lo + 0.05); }
  function effBg(el) { const stack = []; let n = el; while (n && n !== document.documentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c[3] > 0) stack.unshift(c); if (c[3] >= 1) break; n = n.parentElement; } let acc = [255, 255, 255, 1]; for (const c of stack) acc = over(c, acc); return acc; }
  const r1 = (v) => Math.round(v * 10) / 10;
  const r2 = (v) => Math.round(v * 100) / 100;

  // --- helpers for the extra readings ---------------------------------------------------------------
  // Colours that are not rgb()/rgba() (color(srgb ...), oklch, named) go through a canvas.
  let ctx = null;
  function parseAny(value) {
    const v = String(value || "").trim();
    if (!v || v === "transparent" || v === "none") return [0, 0, 0, 0];
    if (/^rgba?\(/i.test(v)) return parse(v);
    if (!ctx) ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  }
  const px = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? n : 0; };
  const text = (el) => (el ? el.textContent.replace(/\s+/g, " ").trim() : null);
  const hint = (el) => {
    if (!el || !el.tagName) return null;
    const tag = el.tagName.toLowerCase();
    const cls = typeof el.className === "string" && el.className.trim() ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
    const data = ["data-shell", "data-panel", "data-pin", "data-lockup", "data-cell", "data-logo"].find((a) => el.hasAttribute(a));
    return tag + cls + (data ? "[" + data + (el.getAttribute(data) ? "=" + el.getAttribute(data) : "") + "]" : "");
  };
  const union = (rects) => {
    const list = rects.filter((r) => r && (r.width > 0 || r.height > 0));
    if (!list.length) return null;
    const left = Math.min(...list.map((r) => r.left)), top = Math.min(...list.map((r) => r.top));
    const right = Math.max(...list.map((r) => r.right)), bottom = Math.max(...list.map((r) => r.bottom));
    return { left, top, right, bottom, width: right - left, height: bottom - top };
  };
  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const exempt = (el) => Boolean(sel.clipExempt && el.closest(sel.clipExempt));
  // box-shadow (computed) -> layers { color, blur, spread }, and their blur radii
  function shadowLayers(value) {
    if (!value || value === "none") return [];
    const layers = [];
    let depth = 0, cur = "";
    for (const ch of value) {
      if (ch === "(") depth++;
      if (ch === ")") depth--;
      if (ch === "," && depth === 0) { layers.push(cur); cur = ""; } else cur += ch;
    }
    if (cur.trim()) layers.push(cur);
    return layers.map((layer) => {
      const lengths = layer.replace(/[a-z-]+\([^)]*\)/gi, " ").replace(/\binset\b/gi, " ").trim().split(/\s+/).filter((t) => /^-?[\d.]+(px)?$/.test(t)).map(parseFloat);
      const color = layer.match(/[a-z-]+\([^)]*\)/i);
      return { color: color ? color[0] : null, blur: lengths.length >= 3 ? lengths[2] : 0, spread: lengths.length >= 4 ? lengths[3] : 0 };
    });
  }
  const shadowBlurs = (value) => shadowLayers(value).map((layer) => layer.blur);
  // the "shadow" probe (first-batch vocabulary): the colour of the solid ring (blur 0, spread >= 1); when
  // a gap ring sits inside the ring (the shell focus pair: paper 2px, then the focus colour 4px), the
  // visible ring is the outermost one, so the widest solid layer is read
  const ringColor = (value) => {
    let ring = null;
    for (const layer of shadowLayers(value)) if (layer.color && layer.blur === 0 && layer.spread >= 1 && (!ring || layer.spread > ring.spread)) ring = layer;
    return ring ? parseAny(ring.color) : null;
  };
  const FOCUSABLE = "a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex='-1']), [contenteditable='true']";
  const focusable = (el) => el.matches(FOCUSABLE) || Boolean(el.querySelector(FOCUSABLE));
  // style rules that change an element on :hover (the rule selector with :hover removed matches it)
  const hoverRuleCount = (el) => {
    let count = 0;
    for (const sheet of document.styleSheets) {
      let rules;
      try { rules = sheet.cssRules; } catch (e) { continue; }
      for (const rule of rules) {
        if (!rule.selectorText || !/:hover/.test(rule.selectorText)) continue;
        for (const part of rule.selectorText.split(",")) {
          if (!/:hover/.test(part)) continue;
          const base = part.replace(/:hover/g, "").trim();
          if (!base) continue;
          try { if (el.matches(base) || el.querySelector(base) || el.closest(base) === el) count++; } catch (e) { /* unsupported selector */ }
        }
      }
    }
    return count;
  };
  // canonical drawing form of an inline SVG: viewBox + every drawing element with its geometry and paint
  const DRAW = ["d", "cx", "cy", "r", "rx", "ry", "x", "y", "width", "height", "x1", "y1", "x2", "y2", "points", "transform", "fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "fill-rule", "clip-rule", "opacity", "fill-opacity", "stroke-opacity"];
  const PAINT = new Set(["fill", "stroke"]);
  function canonSvg(svg) {
    const attrs = (el, names) => names.filter((a) => el.hasAttribute(a)).map((a) => { const v = el.getAttribute(a).trim().replace(/\s+/g, " "); return a + "=" + (PAINT.has(a) ? v.toLowerCase() : v); }).join(";");
    const walk = (el) => [...el.children].map((c) => {
      const tag = c.tagName.toLowerCase();
      if (tag === "title" || tag === "desc") return "";
      return tag + "(" + attrs(c, DRAW) + ")" + (c.children.length ? "[" + walk(c) + "]" : "");
    }).join("");
    return "viewBox=" + (svg.getAttribute("viewBox") || "").trim().replace(/\s+/g, " ") + "|root(" + attrs(svg, ["fill", "stroke", "stroke-width"]) + ")|" + walk(svg);
  }

  const out = { schemaVersion: "tcrn.ds.shell-measure.v1", selectorSet: opts.selectorSet || null, shells: [] };
  for (const scr of rootEl.querySelectorAll(sel.shell)) {
    const s = scr.getBoundingClientRect();
    const rel = (el) => { const r = el.getBoundingClientRect(); return { l: r1(r.left - s.left), t: r1(r.top - s.top), r: r1(s.right - r.right), b: r1(s.bottom - r.bottom), w: r1(r.width), h: r1(r.height) }; };
    const relRect = (r) => ({ l: r1(r.left - s.left), t: r1(r.top - s.top), r: r1(s.right - r.right), b: r1(s.bottom - r.bottom), w: r1(r.width), h: r1(r.height) });
    const tab = scr.querySelector(sel.tab), paper = scr.querySelector(sel.paper), cluster = scr.querySelector(sel.cluster);
    const panel = scr.querySelector(sel.panelPreferred) || scr.querySelector(sel.panelAny);
    const o = { id: scr.getAttribute("data-shell"), state: scr.getAttribute("data-state"), w: r1(s.width), h: r1(s.height) };
    const x = { missing: [], hookGaps: [] };
    for (const [key, el] of [["tab", tab], ["paper", paper], ["cluster", cluster]]) if (!el) x.missing.push(key);
    const stripEl = scr.querySelector(sel.strip);
    if (!stripEl) x.missing.push("strip");
    if (x.missing.length) { o.x = x; out.shells.push(o); continue; }

    o.tab = rel(tab); o.paper = rel(paper); o.cluster = rel(cluster);
    const mk = tab.querySelector("svg[data-logo]");
    if (mk) {
      const mr = rel(mk); o.mark = { size: mr.w, insetL: r1(mr.l - o.tab.l), insetT: r1(mr.t - o.tab.t) };
    } else x.missing.push("mark");
    const bg = effBg(tab); const cs = getComputedStyle(tab);
    if (mk) o.markContrast = [...mk.querySelectorAll("path,circle,rect")].map((p) => { const st = getComputedStyle(p); const col = st.stroke !== "none" && st.stroke ? st.stroke : st.fill; const c = col === "currentcolor" || col === "currentColor" ? parse(cs.color) : parse(col); return r1(contrast(over(c, bg), bg) * 10) / 10; });
    o.tabBg = cs.backgroundColor; o.tabOpacity = cs.opacity; o.tabOutline = cs.outlineStyle + " " + cs.borderStyle;
    const tgl = tab.querySelector(sel.toggle); const word = tab.querySelector("b");
    if (tgl) { const tr = tgl.getBoundingClientRect(); const glyph = tgl.querySelector("svg"); o.toggle = { w: r1(tr.width), h: r1(tr.height), rightOfWord: word ? r1(tr.left - word.getBoundingClientRect().right) : null, glyph: glyph ? glyph.getAttribute("data-icon") : null }; }
    const scs = getComputedStyle(stripEl); o.strip = { h: rel(stripEl).h, bg: scs.backgroundColor, border: scs.borderBottomWidth + " " + scs.borderBottomStyle };
    const expanded = scr.querySelector(sel.panelExpanded);
    o.rowMids = { tab: r1(o.tab.t + o.tab.h / 2), cluster: r1(o.cluster.t + o.cluster.h / 2), stripMid: r1(o.strip.h / 2) };
    o.edges = { tabLeft: o.tab.l, paperLeft: o.paper.l, panelLeft: expanded ? rel(expanded).l : null, clusterRight: o.cluster.r, paperRight: o.paper.r, paperTop: o.paper.t, tabBottom: r1(o.tab.t + o.tab.h), clusterMid: r1(o.cluster.t + o.cluster.h / 2), tabMid: r1(o.tab.t + o.tab.h / 2) };

    // extra: brand version, strip paint, the tab's mark + word group inside the tab, cluster content
    const stripRel = rel(stripEl);
    // the rendered version: v2 shows the word; a v2 tab whose word is hidden (version auto under 1024)
    // renders the first version, whose width follows its content. declared: the hook as written.
    x.brand = { version: tab.matches(sel.brandV1) ? "v1" : word && visible(word) ? "v2" : "v1", declared: tab.getAttribute("data-shell-brand"), hasWord: Boolean(word), wordVisible: Boolean(word && visible(word)), markVisible: Boolean(mk && visible(mk)), toggleVisible: Boolean(tgl && visible(tgl)), wordClientWidth: word?.clientWidth ?? null, wordScrollWidth: word?.scrollWidth ?? null };
    const stripBg = parseAny(scs.backgroundColor);
    x.strip = { t: stripRel.t, h: stripRel.h, borderTop: px(scs.borderTopWidth), borderBottom: px(scs.borderBottomWidth), bgAlpha: r2(stripBg[3]), bgImage: scs.backgroundImage !== "none" };
    const tabRect = tab.getBoundingClientRect();
    const group = union([mk ? mk.getBoundingClientRect() : null, word ? word.getBoundingClientRect() : null]);
    x.tabGroup = group ? { top: r1(group.top - tabRect.top), bottom: r1(tabRect.bottom - group.bottom) } : null;
    const clusterKids = union([...cluster.children].filter(visible).map((c) => c.getBoundingClientRect()));
    x.clusterContent = clusterKids ? { l: r1(clusterKids.left - s.left), r: r1(s.right - clusterKids.right) } : null;
    x.tabCopy = word ? { logo: mk ? mk.getAttribute("data-logo") : null, word: text(word), suffix: text(word.querySelector("em")) } : null;

    // pinned items in the strip
    const pins = [...scr.querySelectorAll(sel.pinItem)];
    x.selectedPins = pins.filter((pin) => pin.matches('[aria-current="page"],[aria-pressed="true"],[data-selected="true"]')).map((pin) => {
      const cs = getComputedStyle(pin), fill = effBg(pin);
      return { text: text(pin), backgroundColor: cs.backgroundColor, effectiveBackground: fill, color: cs.color, fontWeight: cs.fontWeight, borderLeftWidth: cs.borderLeftWidth, boxShadow: cs.boxShadow, ratio: contrast(over(parse(cs.color), fill), fill) };
    });
    const pinsNav = scr.querySelector(sel.pins);
    if (pins.length && pinsNav) {
      const first = rel(pins[0]);
      const pcs = getComputedStyle(pinsNav);
      if (pcs.display === "none") o.pins = { visible: "none" }; else {
        const rects = pins.map((p) => rel(p));
        const gaps = [r1(first.l - (o.tab.l + o.tab.w))]; for (let i = 1; i < rects.length; i++) gaps.push(r1(rects[i].l - (rects[i - 1].l + rects[i - 1].w)));
        o.pins = { count: pins.length, heights: [...new Set(rects.map((r) => r.h))], mids: [...new Set(rects.map((r) => r1(r.t + r.h / 2)))], firstLeft: first.l, gaps, gapsEqual: new Set(gaps).size === 1, divider: pcs.borderLeftWidth + " " + pcs.borderLeftStyle, visible: pcs.display };
      }
      const open = scr.querySelector(sel.openPin);
      const drop = scr.querySelector(sel.panelDrop);
      if (open && drop) {
        const dr = rel(drop), pr = rel(open); const d2 = drop.querySelector(sel.dropCol2);
        o.drop = { l: dr.l, t: dr.t, w: dr.w, h: dr.h, anchorsToPin: Math.abs(dr.l - pr.l) <= 0.5, gapBelowPin: r1(dr.t - (pr.t + pr.h)), inBounds: dr.l >= 0 && dr.t >= 0 && dr.r >= 0 && dr.b >= 0 };
        if (d2) { const q = rel(d2); o.drop.col2 = { l: q.l, w: q.w, h: q.h, sameHeight: Math.abs(q.h - dr.h) <= 0.5, gap: r1(q.l - (dr.l + dr.w)), inBounds: q.r >= 0 && q.b >= 0 }; }
        const dl = drop.getBoundingClientRect().left;
        const inCol = (el) => { const c = el.parentElement ? el.parentElement.closest(sel.dropCol) : null; return Boolean(c && drop.contains(c)); };
        const firstColRows = [...drop.querySelectorAll(sel.dropRow)].filter((row) => !inCol(row));
        o.drop.rail = { icons: [...new Set(firstColRows.flatMap((row) => [...row.querySelectorAll('[data-guide="prail"]')]).map((e) => r1(e.getBoundingClientRect().left - dl)))], texts: [...new Set(firstColRows.flatMap((row) => [...row.querySelectorAll('[data-text="prail"]')]).map((e) => r1(e.getBoundingClientRect().left - dl)))] };
        o.drop.rows = [...new Set([...drop.querySelectorAll(sel.row)].map((e) => r1(e.getBoundingClientRect().height)))];
        const srch = drop.querySelector(sel.search); if (srch) o.drop.search = rel(srch).h;
        // extra: the open item and every cascade column, in order (column 1 is the dropdown itself)
        // columns inside the panel, and the columns it adopts with aria-owns (the package renders those
        // next to the panel)
        const owned = (drop.getAttribute("aria-owns") || "").split(/\s+/).filter(Boolean).map((id) => document.getElementById(id)).filter((el) => el && el.matches(sel.dropCol));
        const cols = [...new Set([...drop.querySelectorAll(sel.dropCol), ...owned])].sort((a, b) => {
          const n = (el) => Number(el.getAttribute("data-drop-col")) || (el.hasAttribute("data-drop4") ? 4 : el.hasAttribute("data-drop3") ? 3 : 2);
          return n(a) - n(b);
        });
        x.openPin = pr;
        x.cascadeSide = drop.closest("[data-cascade-side]")?.getAttribute("data-cascade-side") ?? "end";
        x.dropCols = [dr, ...cols.map((c) => rel(c))].map((r) => ({ l: r.l, t: r.t, w: r.w, h: r.h }));
      }
    }
    if (pinsNav && pins.length) {
      const pcs = getComputedStyle(pinsNav);
      const shown = pcs.display !== "none" ? pins.filter(visible) : [];
      const rects = shown.map((p) => p.getBoundingClientRect());
      const box = union(rects);
      const stripRect = stripEl.getBoundingClientRect();
      x.pins = {
        display: pcs.display,
        visibleCount: shown.length,
        navBorders: [px(pcs.borderLeftWidth), px(pcs.borderRightWidth)],
        itemBorders: shown.map((p) => { const c = getComputedStyle(p); return px(c.borderLeftWidth) + px(c.borderRightWidth); }),
        separators: pcs.display !== "none" ? [...pinsNav.querySelectorAll("hr, [role='separator']")].filter(visible).length : 0,
        items: shown.map((p) => { const q = rel(p); return { l: q.l, w: q.w }; }),
        topGap: box ? r1(box.top - stripRect.top) : null,
        bottomGap: box ? r1(stripRect.bottom - box.bottom) : null
      };
    } else x.pins = { display: pinsNav ? getComputedStyle(pinsNav).display : null, visibleCount: 0 };

    if (panel) {
      const pr = rel(panel); o.panel = pr; o.panelInBounds = pr.l >= 0 && pr.t >= 0 && pr.r >= 0 && pr.b >= 0;
      if (!panel.matches(sel.sheet)) o.menuGap = r1(pr.t - (o.tab.t + o.tab.h));
      const pl = panel.getBoundingClientRect().left;
      const g = [...panel.querySelectorAll('[data-guide="prail"]')].map((e) => r1(e.getBoundingClientRect().left - pl));
      const tx = [...panel.querySelectorAll('[data-text="prail"]')].map((e) => r1(e.getBoundingClientRect().left - pl));
      o.prail = { icons: [...new Set(g)], texts: [...new Set(tx)] };
      o.rows = [...new Set([...panel.querySelectorAll(sel.row)].map((e) => r1(e.getBoundingClientRect().height)))];
      // TCRN-DS-SUB-206 (R3-1): the pin sizes and the text-width groups take only what is drawn, an
      // element with a client rect; one with none (display:none, or inside a column the layout hides: the
      // full menu's pinned column at >= 1024) has no size to read. A pin at rest with opacity 0 is drawn
      // (its slot stays) and is read.
      const drawn = (el) => el.getClientRects().length > 0;
      const pinbs = [...panel.querySelectorAll(sel.pinButton)].filter(drawn);
      o.pinButtons = [...new Set(pinbs.map((e) => { const r = e.getBoundingClientRect(); return r1(r.width) + "x" + r1(r.height); }))];
      const items = [...panel.querySelectorAll(sel.row)].filter(drawn);
      // a row's pin sits in the row's own wrapper (the board's row holds its pin; the package renders a
      // pinnable item as a link and its pin side by side in a wrapper), and the row's column is the
      // wrapper's parent, so rows of one column are compared with each other
      const scopeOf = (it) => {
        const w = sel.rowScope ? it.closest(sel.rowScope) : null;
        return w && w !== it && panel.contains(w) && w.querySelectorAll(sel.row).length === 1 ? w : it;
      };
      const widths = items.map((it) => {
        const scope = scopeOf(it);
        const t = it.querySelector(sel.rowText); const pb = scope.querySelector(sel.pinButton);
        return { hover: it.matches(sel.rowHover), on: it.matches(sel.rowOn), w: t ? r1(t.getBoundingClientRect().width) : null, op: pb ? getComputedStyle(pb).opacity : null, parent: scope.parentElement };
      });
      o.textColWidths = [...new Set(widths.map((v) => v.w))]; o.pinVisibleOn = widths.filter((v) => v.op === "1").map((v) => (v.hover ? "hover" : v.on ? "on" : "rest")).reduce((m, k) => ((m[k] = (m[k] || 0) + 1), m), {});
      const srch = panel.querySelector(sel.search); if (srch) o.search = { h: rel(srch).h };
      const bar = panel.querySelector(sel.pbar);
      if (bar) {
        o.pbar = { h: rel(bar).h };
        const br = bar.getBoundingClientRect(), pnl = panel.getBoundingClientRect();
        const lk = bar.querySelector(sel.barLockup); const cr = bar.querySelector(sel.crumbs);
        if (lk) {
          const lt = lk.querySelector(sel.lockupText); const ls = lk.querySelector("svg");
          if (lt && ls) {
            const lr = lt.getBoundingClientRect(); const mr = ls.getBoundingClientRect();
            o.pbar.regionTop = r1(br.top - s.top); o.pbar.regionBottom = r1(pnl.bottom - s.top); o.pbar.lockupTextGapAbove = r1(lr.top - br.top); o.pbar.lockupTextGapBelow = r1(pnl.bottom - lr.bottom); o.pbar.markGapAbove = r1(mr.top - br.top); o.pbar.markGapBelow = r1(pnl.bottom - mr.bottom);
          }
        }
        if (cr) { const q = cr.getBoundingClientRect(); o.pbar.crumbsGapAbove = r1(q.top - br.top); o.pbar.crumbsGapBelow = r1(pnl.bottom - q.bottom); }
        const lock = panel.querySelector(sel.lock);
        if (lock) o.lock = { tag: lock.tagName.toLowerCase(), rightInset: r1(panel.getBoundingClientRect().right - lock.getBoundingClientRect().right), hasButton: Boolean(lock.querySelector("button,a")), role: lock.getAttribute("role") };
        // extra: the divider is the bar's top border; the lockup's right edge against the panel
        x.bar = { divider: px(getComputedStyle(bar).borderTopWidth), lockupRightInset: lk ? r1(pnl.right - lk.getBoundingClientRect().right) : null, hasLockup: Boolean(lk), hasCrumbs: Boolean(cr) };
      }
      o.closeButtons = panel.querySelectorAll(sel.panelClose).length;
      // extra: rows grouped by their column, text widths by state (rest / hover / on)
      const groups = new Map();
      for (const v of widths) {
        if (v.w === null) continue;
        if (!groups.has(v.parent)) groups.set(v.parent, { rest: [], hover: [], on: [] });
        groups.get(v.parent)[v.hover ? "hover" : v.on ? "on" : "rest"].push(v.w);
      }
      // rows whose text cannot be read (no row-text hook): a hook gap, and no row-group reading at all
      x.rowTextMissing = widths.filter((v) => v.w === null).length;
      const rowTextReadable = widths.length === 0 || x.rowTextMissing < widths.length;
      if (!rowTextReadable) x.hookGaps.push("rowText");
      x.rowGroups = rowTextReadable ? [...groups.values()].map((gr) => ({ rest: [...new Set(gr.rest)], hover: [...new Set(gr.hover)], on: [...new Set(gr.on)] })) : null;
      x.panelKind = panel.matches(sel.sheet) ? "sheet" : panel.matches(sel.panelExpanded) ? "expanded" : panel.matches(sel.panelDrop) ? "drop" : "other";
      // extra: the guide column of the full menu and the Sheet (07b: 引导列 面板内图标 16 · 文字 48) on the
      // o.prail hooks, every column read as the first: a value is the element's left edge from the
      // panel's left minus its column's offset from the first column (one column: the o.prail values).
      // Menu columns with rows but without both hook lists are a hook gap, not an empty reading.
      if (x.panelKind === "expanded" || x.panelKind === "sheet") {
        const colEls = sel.col ? [...panel.querySelectorAll(sel.col)].filter(visible) : [];
        const firstLeft = colEls.length ? Math.min(...colEls.map((c) => c.getBoundingClientRect().left)) : pl;
        const shiftOf = (el) => { const c = sel.col ? el.closest(sel.col) : null; return c && colEls.includes(c) ? c.getBoundingClientRect().left - firstLeft : 0; };
        const lefts = (list) => [...new Set(list.filter(visible).map((e) => r1(e.getBoundingClientRect().left - pl - shiftOf(e))))];
        const icons = lefts([...panel.querySelectorAll('[data-guide="prail"]')]);
        const texts = lefts([...panel.querySelectorAll('[data-text="prail"]')]);
        const colRows = colEls.reduce((n, c) => n + c.querySelectorAll(sel.row).length, 0);
        const gap = colRows > 0 && (!icons.length || !texts.length);
        if (gap) x.hookGaps.push("prail");
        x.prail = gap ? null : { columns: colEls.length, icons, texts };
      }
      x.rowHeights = [...panel.querySelectorAll(sel.row)].map((e) => r1(e.getBoundingClientRect().height));
      const firstRow = panel.querySelector(sel.row);
      x.firstRowTop = firstRow ? r1(firstRow.getBoundingClientRect().top - s.top) : null;
    }
    if (expanded) {
      const er = rel(expanded);
      x.menu = { l: er.l, t: er.t, w: er.w, h: er.h, r: er.r, gapBelowTab: r1(er.t - (o.tab.t + o.tab.h)) };
    }
    o.closeButtonsInShell = scr.querySelectorAll(sel.close).length;

    // extra: collapse buttons inside the menu, the dropdowns and the sheet; resident sidebars outside the paper
    const nameRe = new RegExp(sel.closeName, "i");
    const floating = [...scr.querySelectorAll(sel.panelAny + ", " + sel.sheet)];
    const collapse = new Set();
    for (const f of floating) {
      for (const el of f.querySelectorAll(sel.close)) collapse.add(el);
      for (const el of f.querySelectorAll("button, [role='button']")) {
        const name = [el.getAttribute("aria-label"), el.getAttribute("title"), text(el)].filter(Boolean).join(" ");
        if (nameRe.test(name)) collapse.add(el);
      }
    }
    x.collapseButtons = collapse.size;
    // "in the paper" means this shell's own paper: a story shell can sit inside another shell's paper
    // (the documentation pages render in the top-band shell), whose paper must not swallow it
    const inOwnPaper = (el) => { const p = el.closest(sel.paper); return Boolean(p && scr.contains(p)); };
    x.sidebars = [...scr.querySelectorAll(sel.sidebar)].filter((el) => !inOwnPaper(el) && visible(el)).length;

    // extra: lockups inside the floating layers (the bottom-right lockup): decoration only
    x.lockups = floating.flatMap((f) => [...f.querySelectorAll(sel.lockup)]).filter((el, i, all) => all.indexOf(el) === i).map((el) => {
      const svg = el.querySelector("svg[data-logo]");
      return { kind: el.getAttribute("data-lockup"), tag: el.tagName.toLowerCase(), role: el.getAttribute("role"), tabIndex: el.tabIndex, focusable: focusable(el), hoverRules: hoverRuleCount(el), markSize: svg ? r1(svg.getBoundingClientRect().height) : null };
    });

    // extra: single-line text of the shell rows (tab word, pins, menu rows, group heads, search, crumbs, lockups)
    // TCRN-DS-SUB-196 (R3-3): the page breadcrumb in the shell's own paper is read crumb by crumb (pageCrumb):
    // every crumb on one line, a crumb wider than its box cut only as an ellipsis under a title; the trail
    // gives way one crumb at a time, so it is not one text line (the trail as a whole: x.pageCrumbs). A
    // selector set without a crumb key reads the trail as one line, as before.
    const crumbsOf = (nav) => (sel.pageCrumb ? [...nav.querySelectorAll(sel.pageCrumb)] : [nav]);
    const lineEls = [...scr.querySelectorAll(sel.singleLineText)].filter((el) => !inOwnPaper(el)).concat([...scr.querySelectorAll(sel.pageCrumbs)].filter(inOwnPaper).flatMap(crumbsOf));
    x.textLines = lineEls.filter((el, i) => lineEls.indexOf(el) === i && visible(el) && !exempt(el)).map((el) => {
      let box = el;
      while (box !== scr && getComputedStyle(box).display === "inline") box = box.parentElement;
      const range = document.createRange(); range.selectNodeContents(el);
      const rects = [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0).sort((a, b) => a.top - b.top);
      let lines = 0, bottom = -Infinity;
      for (const r of rects) { if (r.top >= bottom - 1) { lines++; bottom = r.bottom; } else bottom = Math.max(bottom, r.bottom); }
      const tr = union(rects); const bb = box.getBoundingClientRect(); const bcs = getComputedStyle(box);
      const excess = tr ? Math.max(0, tr.right - bb.right, bb.left - tr.left) : 0;
      return { el: hint(el), text: (text(el) || "").slice(0, 40), lines, excess: r1(excess), clip: bcs.overflowX !== "visible", ellipsis: bcs.textOverflow === "ellipsis", title: Boolean(el.closest("[title]") && scr.contains(el.closest("[title]"))) };
    });

    // extra (TCRN-DS-SUB-164, R2-28): the page in this shell's own paper. The page breadcrumb (07b D
    // 面包屑; C7): the trail's line count, how far its crumbs reach past the trail's box, and every crumb:
    // how much wider its text is than its box (scrollWidth over clientWidth of the crumb's box) and how
    // that box cuts it (clip, ellipsis, title). SettingsLayout: its width and its distances from the
    // paper's left and right edges. SplitView: its left edge from the paper's left edge.
    const paperRect = paper.getBoundingClientRect();
    const ownPage = (selector) => (selector ? [...scr.querySelectorAll(selector)].filter((el) => inOwnPaper(el) && visible(el)) : []);
    x.pageCrumbs = ownPage(sel.pageCrumbs).map((nav) => {
      const nb = nav.getBoundingClientRect();
      const range = document.createRange(); range.selectNodeContents(nav);
      const rects = [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0).sort((a, b) => a.top - b.top);
      let lines = 0, bottom = -Infinity;
      for (const r of rects) { if (r.top >= bottom - 1) { lines++; bottom = r.bottom; } else bottom = Math.max(bottom, r.bottom); }
      const labels = sel.pageCrumb ? [...nav.querySelectorAll(sel.pageCrumb)].filter(visible) : [];
      const reach = union(labels.map((el) => el.getBoundingClientRect()));
      const crumbs = labels.map((el) => {
        let box = el;
        while (box !== nav && getComputedStyle(box).display === "inline") box = box.parentElement;
        const bcs = getComputedStyle(box);
        return { text: (text(el) || "").slice(0, 40), over: Math.max(0, box.scrollWidth - box.clientWidth), clip: bcs.overflowX !== "visible", ellipsis: bcs.textOverflow === "ellipsis", title: Boolean(el.closest("[title]") && nav.contains(el.closest("[title]"))) };
      });
      return { el: hint(nav), lines, excess: reach ? r1(Math.max(0, reach.right - nb.right, nb.left - reach.left)) : 0, clip: getComputedStyle(nav).overflowX !== "visible", crumbs };
    });
    x.settingsLayouts = ownPage(sel.settingsLayout).map((el) => { const r = el.getBoundingClientRect(); return { el: hint(el), w: r1(r.width), left: r1(r.left - paperRect.left), right: r1(paperRect.right - r.right) }; });
    x.splitViews = ownPage(sel.splitView).map((el) => ({ el: hint(el), left: r1(el.getBoundingClientRect().left - paperRect.left) }));

    // extra: elements beyond their nearest clipping ancestor (absolute and fixed boxes skip the
    // non-positioned ancestors below their containing block)
    const leaks = [];
    let checked = 0;
    for (const el of scr.querySelectorAll("*")) {
      if (exempt(el)) continue;
      const ecs = getComputedStyle(el);
      if (ecs.display === "none" || ecs.visibility === "hidden" || ecs.display === "contents") continue;
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) continue;
      if (ecs.position === "fixed") continue;
      checked++;
      let anc = el.parentElement; let skipUntilPositioned = ecs.position === "absolute";
      let clipBox = null;
      while (anc) {
        const acs = getComputedStyle(anc);
        if (skipUntilPositioned) { if (acs.position !== "static") skipUntilPositioned = false; else { anc = anc.parentElement; continue; } }
        if (acs.overflowX !== "visible" || acs.overflowY !== "visible" || /paint/.test(acs.contain)) { clipBox = { el: anc, cs: acs }; break; }
        if (anc === scr) break;
        anc = anc.parentElement;
      }
      if (!clipBox) continue;
      const a = clipBox.el.getBoundingClientRect();
      const ex = Math.max(clipBox.cs.overflowX !== "visible" ? Math.max(a.left - r.left, r.right - a.right) : 0, clipBox.cs.overflowY !== "visible" ? Math.max(a.top - r.top, r.bottom - a.bottom) : 0);
      if (ex > 0) leaks.push({ el: hint(el), clip: hint(clipBox.el), px: r1(ex) });
    }
    leaks.sort((a, b) => b.px - a.px);
    x.clip = { checked, count: leaks.length, maxPx: leaks.length ? leaks[0].px : 0, leaks: leaks.slice(0, 40) };

    // extra: the largest box-shadow blur in the shell (elements and their ::before / ::after)
    let blur = 0; let blurAt = null;
    for (const el of [scr, ...scr.querySelectorAll("*")]) {
      if (exempt(el)) continue;
      for (const pseudo of [null, "::before", "::after"]) {
        const value = getComputedStyle(el, pseudo).boxShadow;
        for (const b of shadowBlurs(value)) if (b > blur) { blur = b; blurAt = hint(el) + (pseudo || ""); }
      }
    }
    x.shadow = { maxBlur: r1(blur), at: blurAt };
    o.x = x;
    out.shells.push(o);
  }

  // per-shell hit test after every geometry reading (scrolling moves the page, not the relative readings)
  for (const [i, scr] of [...rootEl.querySelectorAll(sel.shell)].entries()) {
    const o = out.shells[i];
    const tab = scr.querySelector(sel.tab);
    if (!o || !o.x || !tab) continue;
    tab.scrollIntoView({ block: "center", inline: "center" });
    const r = tab.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    o.x.touch = { tabHit: Boolean(hit && (hit === tab || tab.contains(hit))), hitAt: hint(hit), pointerEvents: getComputedStyle(tab).pointerEvents };
  }
  window.scrollTo(0, 0);

  // lockups: mark centre must equal text block centre (vertical). extra (TCRN-DS-SUB-164): each row of
  // this and of the optical reading names its product (the lockup's data-product-id, else the mark's
  // data-logo) and the shell it sits in (null outside every shell: the brand story's first lines)
  const productOf = (lk, svg) => lk.getAttribute("data-product-id") || (svg ? svg.getAttribute("data-logo") : null) || null;
  const shellOf = (el) => { const sh = el.closest(sel.shell); return sh && rootEl.contains(sh) ? sh.getAttribute("data-shell") : null; };
  out.lockups = [...rootEl.querySelectorAll(sel.lockupAny)].map((lk) => { const svg = lk.querySelector("svg[data-logo]"); const txt = lk.querySelector("b"); if (!svg || !txt) return null; const a = svg.getBoundingClientRect(), b = (txt.parentElement.matches("span,.w") ? txt.parentElement : txt).getBoundingClientRect(); return { kind: lk.getAttribute("data-lockup") || (typeof lk.className === "string" ? lk.className : "").split(" ")[0], product: productOf(lk, svg), shell: shellOf(lk), markMid: r1(a.top + a.height / 2), textMid: r1(b.top + b.height / 2), off: r1((a.top + a.height / 2) - (b.top + b.height / 2)) }; }).filter(Boolean);
  out.lockupMaxOffset = out.lockups.reduce((m, l) => Math.max(m, Math.abs(l.off)), 0);
  // optical (TCRN-DS-SUB-230, MIN-20261016-R6 D3): the midline of the band from the cap top of the first line to
  // the baseline, minus the mark centre. The baseline is the first line box's top plus the face's ascent; the
  // cap top is the baseline less the cap height of the line's face (the ink ascent of "H" in it), so neither a
  // descender's ink below the baseline nor an ascender or a dot above the caps moves the midline. A lockup with
  // a second line (small) ends the band on that line's baseline, not on its ink: the two-line block is centred
  // on the mark as the Brand board's section E draws it (the bottom bar's lockup), and the second line's
  // descenders are not read either.
  const cv = document.createElement("canvas").getContext("2d");
  const inkOf = (el) => { const ics = getComputedStyle(el); cv.font = ics.fontWeight + " " + ics.fontSize + " " + ics.fontFamily; const m = cv.measureText(el.textContent.trim()); const rng = document.createRange(); rng.selectNodeContents(el); const box = [...rng.getClientRects()].filter((r) => r.width > 0)[0]; if (!box) return null; const base = box.top + m.fontBoundingBoxAscent; return { capTop: base - cv.measureText("H").actualBoundingBoxAscent, base }; };
  out.optical = [...rootEl.querySelectorAll(sel.opticalAny)].map((lk) => { const svg = lk.querySelector("svg[data-logo]"); const b = lk.querySelector("b"); const sm = lk.querySelector("small"); if (!svg || !b) return null; const sr = svg.getBoundingClientRect(); const ib = inkOf(b); if (!ib) return null; const is = sm ? inkOf(sm) : null; const mid = (ib.capTop + (is ? is.base : ib.base)) / 2; const markMid = sr.top + sr.height / 2; const size = Math.round(sr.height); return { kind: lk.getAttribute("data-lockup") || "brand", product: productOf(lk, svg), shell: shellOf(lk), mark: size, inkMinusMark: r1(mid - markMid), expect: 0 }; }).filter(Boolean);
  out.opticalViolations = out.optical.filter((v) => Math.abs(v.inkMinusMark - v.expect) > 1).length;
  out.dropPanels = rootEl.querySelectorAll(sel.dropPanelAny).length;
  const bad = [];
  const scopeRe = new RegExp(sel.stateRuleScope);
  for (const sh of document.styleSheets) { let rules; try { rules = sh.cssRules; } catch (e) { continue; } for (const r of rules) { if (!r.selectorText || !scopeRe.test(r.selectorText)) continue; for (const part of r.selectorText.split(",")) { const p = part.trim(); if (/(:hover|\.is-hover|\.is-focus|:focus-within|:focus-visible)\s+\S/.test(p) && /color|background/.test(r.style.cssText) && !/opacity/.test(r.style.cssText)) bad.push(p); } } }
  out.descendantStateRulesWithColour = bad;

  // extra: every [data-cell] sample (ink = computed colour or the data-probe source, fill = effective background)
  // 07a B 彩色标: the mark's deep colour, the darkest paint its shapes draw with (stroke, else fill, as in
  // measure-shell.js markContrast; currentColor is the svg's colour)
  const DRAWING = "path, circle, ellipse, rect, polygon, polyline, line";
  const markInk = (el) => {
    const svg = el.matches("svg") ? el : el.querySelector("svg[data-logo]");
    if (!svg) return null;
    const own = parseAny(getComputedStyle(svg).color);
    let deep = null;
    for (const shape of svg.querySelectorAll(DRAWING)) {
      const st = getComputedStyle(shape);
      const paint = st.stroke && st.stroke !== "none" ? st.stroke : st.fill;
      if (!paint || paint === "none" || /^url\(/i.test(paint)) continue;
      const c = /^currentcolor$/i.test(paint) ? own : parseAny(paint);
      if (c[3] > 0 && (!deep || lum(c) < lum(deep))) deep = c;
    }
    return deep;
  };
  // 07a B 遮罩下的纸: a scrim painted over a cell (not its ancestor, above it at the cell's centre) tints
  // what the cell stands on; the scrims over a cell, bottom first (read as underScrim below)
  const scrimEls = sel.scrim ? [...rootEl.querySelectorAll(sel.scrim)].filter(visible) : [];
  const scrimsOver = (el) => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const under = scrimEls.filter((sc) => { if (sc.contains(el)) return false; const q = sc.getBoundingClientRect(); return cx >= q.left && cx <= q.right && cy >= q.top && cy <= q.bottom; });
    if (!under.length) return [];
    el.scrollIntoView({ block: "center", inline: "center" });
    const p = el.getBoundingClientRect();
    const stack = document.elementsFromPoint(p.left + p.width / 2, p.top + p.height / 2);
    const at = stack.findIndex((n) => n === el || el.contains(n) || n.contains(el));
    return at < 0 ? [] : stack.slice(0, at).filter((n) => under.includes(n)).reverse();
  };
  // 07a B 面板对画布 ("own-bg"): a surface's own fill is the ink, the effective background behind it the fill
  const fills = { "own-bg": (el) => (el.parentElement ? effBg(el.parentElement) : [255, 255, 255, 1]) };
  // TCRN-DS-SUB-207 (R3-2): every other cell's fill is read where the cell is drawn: the paint stack at the
  // cell's centre (document.elementsFromPoint, with the cell made a hit target for the read and put back),
  // from the cell down, composited to the first opaque layer. A cell laid over a sibling (the search
  // shortcut over its 6% washed input) stands on that sibling, which the ancestor walk (effBg) never
  // meets. As effBg: rgb()/rgba() backgrounds, the walk stops below the root element and lies on white.
  // A cell that is not hit at its centre keeps the ancestor walk and says so (backdrop: "ancestors").
  const stackBg = (el) => {
    el.scrollIntoView({ block: "center", inline: "center" });
    const r = el.getBoundingClientRect();
    // through the attribute, not the CSSOM: the CSSOM writes back a style="" after its own removal
    const priorStyle = el.getAttribute("style");
    el.setAttribute("style", (priorStyle ? priorStyle + "; " : "") + "pointer-events: auto !important");
    let stack;
    try {
      stack = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    } finally {
      if (priorStyle === null) el.removeAttribute("style"); else el.setAttribute("style", priorStyle);
    }
    const at = stack.indexOf(el);
    if (at < 0) return null;
    const layers = [];
    for (const n of stack.slice(at)) {
      if (n === document.documentElement) break;
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c[3] > 0) layers.unshift(c);
      if (c[3] >= 1) break;
    }
    let acc = [255, 255, 255, 1];
    for (const c of layers) acc = over(c, acc);
    return acc;
  };
  const probes = {
    "": (el, ccs) => parseAny(ccs.color),
    color: (el, ccs) => parseAny(ccs.color),
    ph: (el) => parseAny(getComputedStyle(el, "::placeholder").color),
    border: (el, ccs) => parseAny(ccs.borderBottomColor),
    "after-bg": (el) => parseAny(getComputedStyle(el, "::after").backgroundColor),
    "before-bg": (el) => parseAny(getComputedStyle(el, "::before").backgroundColor),
    // the first-batch vocabulary (scripts/lib/gplus-measure.mjs): a focus ring drawn as a box-shadow
    shadow: (el, ccs) => ringColor(ccs.boxShadow) || parseAny(ccs.color),
    "after-shadow": (el, ccs) => ringColor(getComputedStyle(el, "::after").boxShadow) || parseAny(ccs.color),
    "after-border": (el) => parseAny(getComputedStyle(el, "::after").borderBottomColor),
    mark: (el) => markInk(el),
    "own-bg": (el, ccs) => parseAny(ccs.backgroundColor)
  };
  out.contrastCells = [...rootEl.querySelectorAll("[data-cell]")].map((el) => {
    const ccs = getComputedStyle(el);
    const kind = el.getAttribute("data-kind") || "text";
    const declared = el.getAttribute("data-probe") || "";
    // without data-probe: a mark cell reads the mark, an edge cell with a fill of its own reads that fill
    const auto = declared ? "" : el.matches("svg[data-logo]") ? "mark" : kind === "edge" && parseAny(ccs.backgroundColor)[3] > 0 ? "own-bg" : "";
    const probe = declared || auto;
    const expectAttr = el.getAttribute("data-expect");
    const expect = expectAttr === null || expectAttr.trim() === "" ? null : Number(expectAttr);
    const reader = Object.prototype.hasOwnProperty.call(probes, probe) ? probes[probe] : null;
    const row = { cell: el.getAttribute("data-cell"), kind, probe: probe || "color", exempt: el.hasAttribute("data-exempt"), expect: Number.isFinite(expect) ? expect : null, ratio: null };
    if (auto) row.autoProbe = true;
    if (!reader) row.unknownProbe = true;
    else {
      const ink = reader(el, ccs);
      if (!ink) row.unreadable = true;
      else {
        let fill = fills[probe] ? fills[probe](el) : stackBg(el);
        if (!fill) { fill = effBg(el); row.backdrop = "ancestors"; }
        row.ratio = r2(contrast(over(ink, fill), fill));
        // a second reading under the scrims painted over the cell; ratio stays the cell's own (the board
        // screens keep their state cells under the Sheet's scrim and read them as measure-shell.js does)
        const scrims = scrimsOver(el);
        if (scrims.length) {
          let tinted = fill;
          for (const sc of scrims) tinted = over(parseAny(getComputedStyle(sc).backgroundColor), tinted);
          row.underScrim = { scrims: scrims.length, ratio: r2(contrast(over(ink, tinted), tinted)) };
        }
      }
    }
    return row;
  });
  if (scrimEls.length || out.contrastCells.length) window.scrollTo(0, 0);

  // extra: brand marks — every svg[data-logo] by canonical drawing form, and the logos2 sources in the same form
  const forms = [];
  const formIndex = (f) => { let i = forms.indexOf(f); if (i < 0) { forms.push(f); i = forms.length - 1; } return i; };
  out.marks = [...rootEl.querySelectorAll("svg[data-logo]")].map((svg) => ({
    logo: svg.getAttribute("data-logo"),
    mode: svg.getAttribute("data-mode"),
    where: svg.closest(sel.tab) ? "tab" : svg.closest(sel.intro) ? "intro" : svg.closest(sel.lockup) ? "lockup" : "other",
    shell: svg.closest(sel.shell) && rootEl.contains(svg.closest(sel.shell)) ? svg.closest(sel.shell).getAttribute("data-shell") : null,
    opacity: Number(getComputedStyle(svg).opacity),
    form: formIndex(canonSvg(svg))
  }));
  out.markForms = forms;
  out.logoForms = {};
  for (const [id, source] of Object.entries(opts.logoSources || {})) {
    const doc = new DOMParser().parseFromString(String(source), "image/svg+xml");
    const svg = doc.documentElement;
    out.logoForms[id] = svg && svg.tagName.toLowerCase() === "svg" ? canonSvg(svg) : null;
  }
  out.lockupCopy = [...rootEl.querySelectorAll(sel.lockup)].map((el) => {
    const svg = el.querySelector("svg[data-logo]");
    return { kind: el.getAttribute("data-lockup"), logo: svg ? svg.getAttribute("data-logo") : null, word: text(el.querySelector("b")), suffix: text(el.querySelector("b em")), description: text(el.querySelector("small:not(.by)")), by: text(el.querySelector("small.by")) };
  });
  out.intro = [...rootEl.querySelectorAll(sel.intro)].map((el) => ({ phase: el.getAttribute("data-intro-phase") }));
  return out;
}

// Browser-side: the E-section lockups of the Brand board (sidebar scale .rail, lockup scale .lk).
export function readBrandLockupsInPage() {
  const text = (el) => (el ? el.textContent.replace(/\s+/g, " ").trim() : null);
  return [...document.querySelectorAll(".rail, .lk")].filter((el) => el.querySelector("svg[data-logo]") && el.querySelector("b")).map((el) => ({
    kind: el.classList.contains("lk") ? "lk" : "rail",
    logo: el.querySelector("svg[data-logo]").getAttribute("data-logo"),
    word: text(el.querySelector("b")),
    suffix: text(el.querySelector("b em")),
    description: text(el.querySelector("small:not(.by)")),
    by: text(el.querySelector("small.by"))
  }));
}

export async function measureShellPage(page, options = {}) {
  if (!options.selectors) throw new TypeError("shell_measure_selectors_required");
  return page.evaluate(readShellInPage, options);
}

export async function readBrandLockups(page) {
  return page.evaluate(readBrandLockupsInPage);
}

export function loadLogoSources(repoRoot) {
  const dir = join(repoRoot, LOGO_SOURCE_DIR);
  const sources = {};
  for (const name of readdirSync(dir).sort()) {
    if (!name.endsWith(".svg") || name.endsWith("-mono.svg")) continue;
    sources[name.slice(0, -4)] = readFileSync(join(dir, name), "utf8");
  }
  return sources;
}

export function formDigest(form) {
  return createHash("sha256").update(String(form)).digest("hex");
}
