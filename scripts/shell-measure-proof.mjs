#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
// TCRN-DS-STORY-149 (TCRN-DS-SUB-135) — the eighteen tab-shell gates of the 07b board (Shell-2, G section)
// and the twelve relation rows of its D section, as a browser gate.
//
// Readings come from scripts/lib/shell-measure.mjs (a port of docs/design/gplus-2026-10/measure-shell.js,
// readings only). This file owns THRESHOLDS and the verdicts. Gates (G section; mutation = the G-section
// "会红的变异" column, stored in tests/fixtures/geometry-measure/shell/mutations.json):
//   brandGeometry  标按钮几何       tab min 134 x 40, content width (v2; v1 width follows its content), left 12, top 6; row
//                                  midline 26 = pinned-item midline = cluster midline; pins sit 10 / 10
//                                  inside the 52 strip                                  (mutation: top 0)
//   brandDigest    品牌资产 digest  every svg[data-logo] has the drawing form of logos2/<product>.svg (the
//                                  product key picks the file), opacity 1; lockup and tab copy equal the
//                                  Brand board E section                    (mutation: one path coordinate)
//   strip          顶带             strip 52, no background, no border; paper top 52  (mutation: 1px bottom line)
//   edges          三缘对齐         tab left = paper left = full-menu left = 12; cluster right (box and
//                                  content) = paper right = 12                   (mutation: cluster padding 8)
//   pinSpacing     固定项间距       tab -> item and item -> item gaps all 8; no divider; items 32 tall,
//                                  midline 26 (the G section's "20" is read as 26, decomposition problem 1);
//                                  at most 6 visible                          (mutation: 1px left line back)
//   continuation   接续             full-menu top - tab bottom = 6; dropdown top - item bottom = 6; dropdown
//                                  left = item left; dropdown 240 wide, search 28; the "3 to 4 times the item
//                                  width" row is not asserted (decomposition problem 18)  (mutation: menu top 60)
//   barCentering   底栏居中         lockup text, mark and crumbs centred between the divider (the bar's top
//                                  border) and the panel's bottom edge (0.5); lockup right = menu right - 16
//                                                                       (mutation: panel bottom padding 16)
//   markText       标旁文字居中     midline of the text beside a mark = mark midline (1), the text's midline
//                                  the middle of the band from the first line's cap top (baseline less the
//                                  face's cap height) to its baseline, a two-line lockup's band ending on the
//                                  second line's baseline; no descender ink is read (MIN-20261016-R6 D3,
//                                  TCRN-DS-SUB-230); lockup text block centre = mark centre (1); mark + word
//                                  group centred in the tab (0.5)        (mutation: word padding-top 4)
//   cascade        级联             column n height = column n-1 height; left = left column right + 4; same
//                                  width                                            (mutation: column 2 height auto)
//   noCollapse     无收起钮、无常驻侧栏  collapse buttons in the full menu, dropdowns and sheet = 0; resident
//                                  sidebars in the shell (outside the paper) = 0; outside click closes
//                                  (behaviour trace)                                 (mutation: x button back)
//   pinJitter      图钉位无抖动     rest / hover / on rows of one column have the same text width (0.5); pin
//                                  buttons 24 x 24                    (mutation: pin display none -> inline)
//   lockupDecor    锁定块只装饰     the lockup in the floating layers is not a control, not in the Tab
//                                  order, has no hover rule; sidebar scale mark 22     (mutation: button)
//   contrast       每格对比度       every [data-cell] within 0.05 of data-expect; text >= 4.5, other >= 3;
//                                  no cell is pending: the night product-colour suffix cells read the
//                                  TMS mark's bright step since MIN-20261016-R6 D4 (TCRN-DS-SUB-232) and
//                                  are held to 4.5 (pendingBelowMinimum stays, frozen and empty); the
//                                  exempt cells that the 07a B section marks 不进门 / 豁免 / 按设计不读
//                                  (彩色标, 面板对画布, 遮罩下的纸: THRESHOLDS.contrast.listOnly) are
//                                  listed with their reading, not compared (TCRN-DS-SUB-174)
//                                                                       (mutation: placeholder ink-3)
//   singleLine     单行与溢出       every row text one line; no element beyond its clipping ancestor (0.5);
//                                  text cut by its box only as ellipsis with a title (C7 / C17)
//                                                                       (mutation: label + 40 characters)
//   shadowBlur     阴影模糊         box-shadow blur <= 3px                         (mutation: panel shadow 12px)
//   intro          登入动画         behaviour trace: 1 play per session, 0 on reload, 0 under reduced motion;
//                                  transform and opacity only; <= 700ms     (mutation: session marker removed)
//   focusLoop      焦点回路         behaviour trace: after Esc focus is on the tab, after Cmd/Ctrl+K on the
//                                  probed screen's own search (the page is opened with shell-shortcut=<screen>,
//                                  按页面参数只开被测屏; another shell's search fails); arrows move between
//                                  cascade columns; one Cmd/Ctrl+K per shell
//                                                                       (mutation: focus not returned)
//   touch          触摸端           390 wide: the tab is hit at its centre and >= 40 tall, no pinned item in
//                                  the strip, an open layer is the Sheet, sheet rows 44  (mutation: row height 32)
// Checks beyond the G section (TCRN-DS-SUB-174, R2-27), judged on every run with the gates, one board and
// one story mutation each, reported under `checks` so that the eighteen gates stay the G section:
//   prail          菜单引导列       the guide column of the full menu and the Sheet: icons at 16 and texts at
//                                  48 from the panel's left edge, every column read as the first (07b note
//                                  「引导列 面板内图标 16 · 文字 48」, on the hooks of measure-shell.js
//                                  o.prail); it takes over the first batch's rail on the top-band shell
//                                  (storybook-map I16-P24)                (mutation: guide icons 4 to the right)
// TCRN-DS-SUB-164 (R2-28; Story 145-GWT2, Story 146 GWT2-GWT4), three checks of the page in the paper:
//   pageCrumbs     页面包屑         the page breadcrumb in the paper: the trail on one line, no crumb past
//                                  the trail's box, and a crumb wider than its box cut only as an ellipsis
//                                  under a title (C7; read per crumb, so a trail whose crumbs give way one
//                                  by one is read as it is drawn)            (mutation: crumbs 30 wide, clipped)
//   settingsLayout 设置页 1040     SettingsLayout in the paper: at most 1040 wide (D1, token
//                                  layout-content-max-w), the same distance from the paper's left and
//                                  right edges                        (story mutation: max-width taken away)
//   splitView      分栏左缘         SplitView in the paper: left edge = paper left + the paper's content inset
//                                  (07b .ts-content 28 at the sides; 16 on the 390 phone screen,
//                                  .scr.ts.m .ts-content), no room kept for a side rail
//                                                                  (story mutation: 240 kept for a rail)
// The boards draw no settings page and no split view: those two checks are boards: false (CHECKS), read
// n/a on the boards, and proven on the page fixture (manifest pageFixture) instead, where they must pass
// and their story mutations must turn them red. markText reads, besides the shells' brand buttons, the
// brand story shell-brand-first-line: the four products' first lines (ProductLockup firstLine) at the
// rail and lockup scales, outside any shell; its screens are the (data-lockup, product) pairs listed in
// the fixture manifest, in order, and the padding-top 4 story mutation runs on its TMS rail line.
// Behaviour cannot be read from a board: intro, focusLoop and the outside-click half of noCollapse are
// judged on behaviour traces. --fixtures judges the traces declared in the fixture manifest and their
// mutated copies; on the package stories the probes below (TCRN-DS-SUB-137) record the traces on the
// real parts: probeShellBehaviour clicks the tab of a closed screen, presses Esc, Ctrl+K and the arrow
// keys and clicks outside; probeShellIntro loads the intro story in a fresh session, reloads it, and
// loads it again under prefers-reduced-motion, counting [data-shell-intro] layers and reading
// document.getAnimations(). A layer that never opens is recorded as "unopened", never as a pass.
//
// D section (07b board) relation rows -> gates:
//   顶带高             strip, brandGeometry
//   标按钮（v2）       edges, markText, brandGeometry
//   固定项             pinSpacing, brandGeometry
//   纸                 edges
//   完整菜单           continuation, barCentering, noCollapse
//   右下角锁定块       lockupDecor
//   固定二级菜单下拉   continuation
//   三、四级级联       cascade
//   图钉位             pinJitter
//   面包屑             singleLine
//   目录与书签         noCollapse
//   窄于 1024          touch
//
// --fixtures measures the two finished boards (docs/design/visual-standard/boards/Shell.dc.html and
// Shell-2.dc.html) at their own width (screens 1240 and 390, viewport 1240 x 900) with the board hooks:
// every gate must be green on the boards, and every mutation must turn its gate red (and only the gates
// it lists). The boards' web-font request is answered with the vendored faces of packages/ui-tokens/fonts
// and every other non-file request is refused, so the readings are taken offline on the boards' own faces.
// --fixtures also loads the package-hook fixture (manifest packageFixture, TCRN-DS-SUB-174): the package's
// row markup (a pinnable item is a link and its pin in .tcrn-nav-item-row, the pin keeping a 24 track),
// guide-column hooks and the three 07a B reading cases on a static page, read with the package hooks. The
// gates and checks it names must pass there, every contrast cell on it must read its data-expect, and the
// story mutations it names must turn their gate red on it, so a story mutation is shown not to be an
// equivalent mutation before the real parts carry the hooks that it needs.
// Without --fixtures the gate measures the package stories (C-9 ids) with the package hooks, only at
// 1440 x 900 and 390 x 844, in en and zh-CN, light and dark, inside each story's body (the region the
// story disclosure controls; the documentation shell around it is not measured). The run is ok only
// when all eighteen gates pass on every run, every screen named in the fixture manifest (stories.screens)
// is there in its data-state, no shell lacks a hook the gates read (missingHooks, including x.hookGaps),
// and every story mutation (mutations.json, storyMutations) turns its gate red: on a gate that is
// already red on the real part, the mutation must add a failure that the unmutated run does not have,
// otherwise it is reported as not distinguishable.
//
// Usage: node scripts/shell-measure-proof.mjs --fixtures [--write-report <path>]
//        node scripts/shell-measure-proof.mjs [--story <id>]... [--write-report [<path>]]
//   Run from the repository root (stories need `pnpm build` first). Prints the JSON report; exit 1 when
//   not ok. `pnpm geometry:measure` runs this file's tests, --fixtures and the story mode, in that order.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { settlePage, startStaticServer } from "./lib/gplus-measure.mjs";
import { BOARD_SELECTORS, PACKAGE_SELECTORS, SHELL_MEASURE_SCHEMA_VERSION, formDigest, loadLogoSources, measureShellPage as readShellPage, readBrandLockups } from "./lib/shell-measure.mjs";
import { STATIC_DOCS_ROOT, expandStory, loadStoryRegistry, resolveStoryRoutes, storyUrl } from "./lib/storybook-routes.mjs";

// Intrinsic content measurement for the variable-width brand button (SUB-238).
export async function measureShellPage(page, options = {}) {
  const reading = await readShellPage(page, options);
  const widths = await page.evaluate(({ selectors: sel, root }) => {
    const region = root ? document.querySelector(root) : document;
    return [...region.querySelectorAll(sel.shell)].map((shell) => {
      const tab = shell.querySelector(sel.tab);
      const word = tab?.querySelector("b");
      const mark = tab?.querySelector("svg[data-logo]");
      const toggle = tab?.querySelector(sel.toggle);
      if (!tab || !word || !mark || !toggle) return null;
      const cs = getComputedStyle(tab);
      const range = document.createRange(); range.selectNodeContents(word);
      const wordWidth = range.getBoundingClientRect().width;
      const markWidth = mark.getBoundingClientRect().width;
      // Both the board's three tracks and the package's nested line use the same two gaps.
      const gap = parseFloat(cs.columnGap) || 0;
      return { id: shell.getAttribute("data-shell"), width: markWidth + wordWidth + toggle.getBoundingClientRect().width + 2 * gap + parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) };
    }).filter(Boolean);
  }, { selectors: options.selectors || BOARD_SELECTORS, root: options.root });
  for (const shell of reading.shells || []) {
    const item = widths.find((entry) => entry.id === shell.id);
    if (item) shell.x.brand.contentWidth = item.width;
  }
  return reading;
}

export const SCHEMA_VERSION = "tcrn.ds.shell-measure-proof.v1";

function deepFreeze(value) {
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) deepFreeze(item);
    Object.freeze(value);
  }
  return value;
}

export const THRESHOLDS = deepFreeze({
  brandGeometry: { tabMinWidthV2Px: 134, tabHeightPx: 40, tabLeftPx: 12, tabTopPx: 6, rowMidPx: 26, pinBandPx: 10, tolerancePx: 0.5 },
  brandDigest: { markOpacity: 1 },
  strip: { heightPx: 52, paperTopPx: 52, maxBorderPx: 0, maxBackgroundAlpha: 0, tolerancePx: 0.5 },
  edges: { insetPx: 12, tolerancePx: 0.5 },
  pinSpacing: { gapPx: 8, heightPx: 32, midPx: 26, maxVisible: 6, maxDividerPx: 0, tolerancePx: 0.5 },
  continuation: { menuGapPx: 6, dropWidthPx: 240, dropSearchPx: 28, tolerancePx: 0.5 },
  barCentering: { maxDiffPx: 0.5, lockupRightInsetPx: 16, tolerancePx: 0.5 },
  markText: { maxInkOffsetPx: 1, maxLockupOffsetPx: 1, maxGroupDiffPx: 0.5 },
  cascade: { gapPx: 4, tolerancePx: 0.5 },
  noCollapse: { maxCollapseButtons: 0, maxSidebars: 0 },
  pinJitter: { maxSpreadPx: 0.5, pinButtonPx: 24, tolerancePx: 0.5 },
  lockupDecor: { railMarkPx: 22, maxHoverRules: 0, tolerancePx: 0.5 },
  contrast: { maxDiff: 0.05, minText: 4.5, minNonText: 3, pendingBelowMinimum: [], listOnly: ["brand-mark", "panel-edge", "scrim-paper"] },
  singleLine: { maxLines: 1, tolerancePx: 0.5 },
  shadowBlur: { maxBlurPx: 3 },
  intro: { firstLoadPlays: 1, reloadPlays: 0, reducedMotionPlays: 0, properties: ["transform", "opacity"], maxDurationMs: 700 },
  focusLoop: { afterEscape: "tab", afterCommandK: "search", commandKRegistrations: 1 },
  touch: { phoneMaxWidthPx: 390, sheetRowPx: 44, minTabHeightPx: 40, tolerancePx: 0.5 },
  prail: { iconLeftPx: 16, textLeftPx: 48, tolerancePx: 0.5 },
  pageCrumbs: { maxLines: 1, tolerancePx: 0.5 },
  settingsLayout: { maxWidthPx: 1040, tolerancePx: 0.5 },
  splitView: { insetPx: 28, phoneInsetPx: 16, phoneMaxWidthPx: 390, tolerancePx: 0.5 },
  fixture: { boardWidthPx: 1240, phoneWidthPx: 390, tolerancePx: 0.5 }
});

export const GATES = deepFreeze([
  { id: "brandGeometry", name: "标按钮几何", kind: "geometry" },
  { id: "brandDigest", name: "品牌资产 digest", kind: "geometry" },
  { id: "strip", name: "顶带", kind: "geometry" },
  { id: "edges", name: "三缘对齐", kind: "geometry" },
  { id: "pinSpacing", name: "固定项间距", kind: "geometry" },
  { id: "continuation", name: "接续", kind: "geometry" },
  { id: "barCentering", name: "底栏居中", kind: "geometry" },
  { id: "markText", name: "标旁文字居中", kind: "geometry" },
  { id: "cascade", name: "级联", kind: "geometry" },
  { id: "noCollapse", name: "无收起钮、无常驻侧栏", kind: "geometry+behaviour" },
  { id: "pinJitter", name: "图钉位无抖动", kind: "geometry" },
  { id: "lockupDecor", name: "锁定块只装饰", kind: "geometry" },
  { id: "contrast", name: "每格对比度", kind: "geometry" },
  { id: "singleLine", name: "单行与溢出", kind: "geometry" },
  { id: "shadowBlur", name: "阴影模糊", kind: "geometry" },
  { id: "intro", name: "登入动画", kind: "behaviour" },
  { id: "focusLoop", name: "焦点回路", kind: "behaviour" },
  { id: "touch", name: "触摸端", kind: "geometry" }
]);
export const GATE_IDS = deepFreeze(GATES.map((gate) => gate.id));
export const BEHAVIOUR_GATE_IDS = deepFreeze(["intro", "focusLoop"]);
// The page parameter that gives ⌘K / Ctrl+K to one shell story screen (build/shell-hydrate.tsx; TCRN-DS-SUB-179):
// every other screen and the documentation shell leave the key alone while it is on the page.
export const SHELL_SHORTCUT_PARAMETER = "shell-shortcut";
export const READING_GATE_IDS = deepFreeze(GATE_IDS.filter((id) => !BEHAVIOUR_GATE_IDS.includes(id)));
// Checks beyond the G section (header): reading checks, reported under `checks`.
export const CHECKS = deepFreeze([
  { id: "prail", name: "菜单引导列", kind: "geometry", source: "07b 标注「引导列 面板内图标 16 · 文字 48」；measure-shell.js o.prail；storybook-map I16-P24", boards: true },
  { id: "pageCrumbs", name: "页面包屑", kind: "geometry", source: "07b D 段「面包屑」；C7；Story 146-GWT2", boards: true },
  { id: "settingsLayout", name: "设置页 1040", kind: "geometry", source: "MIN-20261013-SHELL D1；Story 146-GWT3", boards: false },
  { id: "splitView", name: "分栏左缘", kind: "geometry", source: "07b .ts-content 内距；Story 146-GWT4", boards: false }
]);
// the checks the boards cannot show (boards: false): proven on the page fixture instead
export const PAGE_FIXTURE_CHECK_IDS = deepFreeze(CHECKS.filter((check) => check.boards === false).map((check) => check.id));
export const CHECK_IDS = deepFreeze(CHECKS.map((check) => check.id));

export const D_SECTION_ROWS = deepFreeze([
  { row: "顶带高", asserts: "顶带无背景无边线；纸顶 = 52；标按钮、固定项、右上簇中线都是 26", gates: ["strip", "brandGeometry"] },
  { row: "标按钮（v2）", asserts: "标按钮左缘 = 纸左缘 = 完整菜单左缘 = 12；字标墨迹中线 = 标中线（±1）", gates: ["edges", "markText", "brandGeometry"] },
  { row: "固定项", asserts: "三处间距读数相等；固定项中线 = 26 = 标按钮中线；顶带上下留白相等（10 / 10）", gates: ["pinSpacing", "brandGeometry"] },
  { row: "纸", asserts: "纸右缘 1228 = 右上簇右缘", gates: ["edges"] },
  { row: "完整菜单", asserts: "菜单顶 − 标按钮底 = 6；锁定块在分隔线到面板底缘之间居中；锁定块右缘 = 菜单右缘 − 16；收起钮数量 = 0", gates: ["continuation", "barCentering", "noCollapse"] },
  { row: "右下角锁定块", asserts: "不是按钮、不在 Tab 序列", gates: ["lockupDecor"] },
  { row: "固定二级菜单下拉", asserts: "下拉左缘 = 固定项左缘；下拉顶 − 项底 = 6（下拉宽为固定项宽 3 至 4 倍一条不作断言）", gates: ["continuation"] },
  { row: "三、四级级联", asserts: "第 n 列高度 = 第 n−1 列高度；左缘 = 左列右缘 + 4", gates: ["cascade"] },
  { row: "图钉位", asserts: "rest 与 hover 行文字宽相等", gates: ["pinJitter"] },
  { row: "面包屑", asserts: "任何宽度下一行", gates: ["singleLine"] },
  { row: "目录与书签", asserts: "壳内没有常驻侧栏", gates: ["noCollapse"] },
  { row: "窄于 1024", asserts: "390 宽标按钮可点；Sheet 行 44", gates: ["touch"] }
]);

export const DEFAULT_PATHS = Object.freeze({
  fixtureManifest: "tests/fixtures/geometry-measure/shell/manifest.json",
  fixtureMutations: "tests/fixtures/geometry-measure/shell/mutations.json",
  brandBoard: "docs/design/visual-standard/boards/Brand.dc.html",
  vendoredFonts: "packages/ui-tokens/fonts",
  staticRoot: STATIC_DOCS_ROOT,
  reportPath: "docs/verification/shell-measure/report.json"
});

// Package stories (C-9) and the only run grid for them (C-11).
// shell-brand-first-line (TCRN-DS-SUB-164, C-12): the brand story markText reads, no shell in it.
export const SHELL_STORY_IDS = deepFreeze(["shell-top-band", "shell-narrow", "shell-mobile", "shell-intro", "shell-matrix", "shell-brand-first-line"]);
export const STORY_RUN = deepFreeze({
  viewports: { desktop: { width: 1440, height: 900 }, phone: { width: 390, height: 844 } },
  storyViewport: { "shell-mobile": "phone" },
  locales: ["en", "zh-CN"],
  themes: ["light", "dark"]
});

// ---------------------------------------------------------------------------------------------- verdicts

const INTERACTIVE_TAGS = new Set(["button", "a", "input", "select", "textarea", "summary"]);
const near = (value, want, tol) => typeof value === "number" && Number.isFinite(value) && Math.abs(value - want) <= tol + 1e-9;
const open = () => ({ checked: 0, failures: [], pending: [], listed: [] });
const fail = (g, at, what, value, expect) => { g.failures.push({ at, what, value, expect }); };
function finish(g) {
  const out = { status: g.checked === 0 ? "n/a" : g.failures.length ? "fail" : "pass", checked: g.checked, failures: g.failures.slice(0, 25) };
  if (g.failures.length > 25) out.moreFailures = g.failures.length - 25;
  if (g.pending.length) out.pending = g.pending;
  if (g.listed.length) out.listed = g.listed;
  return out;
}
const measured = (reading) => (reading.shells || []).filter((s) => s.x && s.x.missing.length === 0);
// contrast: an exempt cell that the 07a B section marks 不进门 / 豁免 / 按设计不读 (listOnly, the cell id
// without its theme suffix), and the reading the B section gives such a cell (遮罩下的纸: under the scrim)
const isListOnlyCell = (c, t) => Boolean(c.exempt) && t.listOnly.includes(String(c.cell || "").replace(/-[ln]$/, ""));
const sectionBReading = (c) => (c.underScrim ? c.underScrim.ratio : c.ratio);

const READING_JUDGES = {
  brandGeometry(reading, { T }) {
    const t = T.brandGeometry; const g = open();
    for (const s of measured(reading)) {
      g.checked++;
      if (!near(s.tab.h, t.tabHeightPx, t.tolerancePx)) fail(g, s.id, "tab.h", s.tab.h, t.tabHeightPx);
      if (!near(s.tab.l, t.tabLeftPx, t.tolerancePx)) fail(g, s.id, "tab.left", s.tab.l, t.tabLeftPx);
      if (!near(s.tab.t, t.tabTopPx, t.tolerancePx)) fail(g, s.id, "tab.top", s.tab.t, t.tabTopPx);
      if (s.x.brand.version === "v2") {
        const expectedWidth = Math.max(t.tabMinWidthV2Px, s.x.brand.contentWidth);
        if (!near(s.tab.w, expectedWidth, t.tolerancePx)) fail(g, s.id, "tab.w", s.tab.w, expectedWidth);
      }
      if (!near(s.rowMids.tab, t.rowMidPx, t.tolerancePx)) fail(g, s.id, "tab.mid", s.rowMids.tab, t.rowMidPx);
      if (!near(s.rowMids.cluster, t.rowMidPx, t.tolerancePx)) fail(g, s.id, "cluster.mid", s.rowMids.cluster, t.rowMidPx);
      for (const mid of s.pins && Array.isArray(s.pins.mids) ? s.pins.mids : []) if (!near(mid, t.rowMidPx, t.tolerancePx)) fail(g, s.id, "pins.mid", mid, t.rowMidPx);
      if (s.x.pins.visibleCount > 0) {
        if (!near(s.x.pins.topGap, t.pinBandPx, t.tolerancePx)) fail(g, s.id, "pins.topGap", s.x.pins.topGap, t.pinBandPx);
        if (!near(s.x.pins.bottomGap, t.pinBandPx, t.tolerancePx)) fail(g, s.id, "pins.bottomGap", s.x.pins.bottomGap, t.pinBandPx);
      }
    }
    return finish(g);
  },
  brandDigest(reading, { T, brandLockups, compareDescription = true }) {
    const g = open();
    const forms = reading.markForms || []; const logos = reading.logoForms || {};
    for (const m of reading.marks || []) {
      g.checked++;
      const at = (m.shell || "board") + ":" + m.where;
      const want = logos[m.logo];
      if (!want) fail(g, at, "mark.source", m.logo, "logos2/<product>.svg");
      else if (forms[m.form] !== want) fail(g, at, "mark.digest", formDigest(forms[m.form]).slice(0, 16), formDigest(want).slice(0, 16));
      if (m.opacity !== T.brandDigest.markOpacity) fail(g, at, "mark.opacity", m.opacity, T.brandDigest.markOpacity);
    }
    const refs = Array.isArray(brandLockups) ? brandLockups : [];
    const refFor = (logo, kind) => refs.find((b) => b.logo === logo && b.kind === kind) || null;
    for (const c of reading.lockupCopy || []) {
      g.checked++;
      const kind = /^lkr/.test(c.kind || "") ? "rail" : "lk";
      const ref = refFor(c.logo, kind);
      if (!ref) { fail(g, "lockup:" + c.kind, "lockup.reference", c.logo, "Brand E " + kind); continue; }
      const fields = ["word", "suffix"].concat(/-line$/.test(c.kind || "") || !compareDescription ? [] : ["description", "by"]);
      for (const field of fields) if (c[field] !== ref[field]) fail(g, "lockup:" + c.kind, "lockup." + field, c[field], ref[field]);
    }
    for (const s of measured(reading)) {
      if (!s.x.tabCopy) continue;
      g.checked++;
      const ref = refFor(s.x.tabCopy.logo, "rail");
      if (!ref) { fail(g, s.id, "tab.reference", s.x.tabCopy.logo, "Brand E rail"); continue; }
      for (const field of ["word", "suffix"]) if (s.x.tabCopy[field] !== ref[field]) fail(g, s.id, "tab." + field, s.x.tabCopy[field], ref[field]);
    }
    return finish(g);
  },
  strip(reading, { T }) {
    const t = T.strip; const g = open();
    for (const s of measured(reading)) {
      g.checked++;
      if (!near(s.strip.h, t.heightPx, t.tolerancePx)) fail(g, s.id, "strip.h", s.strip.h, t.heightPx);
      if (s.x.strip.borderTop > t.maxBorderPx) fail(g, s.id, "strip.borderTop", s.x.strip.borderTop, t.maxBorderPx);
      if (s.x.strip.borderBottom > t.maxBorderPx) fail(g, s.id, "strip.borderBottom", s.x.strip.borderBottom, t.maxBorderPx);
      if (s.x.strip.bgAlpha > t.maxBackgroundAlpha || s.x.strip.bgImage) fail(g, s.id, "strip.background", s.strip.bg, "transparent");
      if (!near(s.paper.t, t.paperTopPx, t.tolerancePx)) fail(g, s.id, "paper.top", s.paper.t, t.paperTopPx);
    }
    return finish(g);
  },
  edges(reading, { T }) {
    const t = T.edges; const g = open();
    for (const s of measured(reading)) {
      g.checked++;
      if (!near(s.tab.l, t.insetPx, t.tolerancePx)) fail(g, s.id, "tab.left", s.tab.l, t.insetPx);
      if (!near(s.paper.l, t.insetPx, t.tolerancePx)) fail(g, s.id, "paper.left", s.paper.l, t.insetPx);
      if (s.edges.panelLeft !== null && !near(s.edges.panelLeft, t.insetPx, t.tolerancePx)) fail(g, s.id, "menu.left", s.edges.panelLeft, t.insetPx);
      if (!near(s.paper.r, t.insetPx, t.tolerancePx)) fail(g, s.id, "paper.right", s.paper.r, t.insetPx);
      if (!near(s.cluster.r, s.paper.r, t.tolerancePx)) fail(g, s.id, "cluster.right", s.cluster.r, s.paper.r);
      if (!s.x.clusterContent || !near(s.x.clusterContent.r, s.paper.r, t.tolerancePx)) fail(g, s.id, "cluster.contentRight", s.x.clusterContent ? s.x.clusterContent.r : null, s.paper.r);
    }
    return finish(g);
  },
  pinSpacing(reading, { T }) {
    const t = T.pinSpacing; const g = open();
    for (const s of measured(reading)) {
      if (!(s.x.pins.visibleCount > 0)) continue;
      g.checked++;
      for (const gap of s.pins && s.pins.gaps ? s.pins.gaps : []) if (!near(gap, t.gapPx, t.tolerancePx)) fail(g, s.id, "pins.gap", gap, t.gapPx);
      for (const w of s.x.pins.navBorders) if (w > t.maxDividerPx) fail(g, s.id, "pins.divider", w, t.maxDividerPx);
      for (const w of s.x.pins.itemBorders) if (w > t.maxDividerPx) fail(g, s.id, "pins.itemBorder", w, t.maxDividerPx);
      if (s.x.pins.separators > 0) fail(g, s.id, "pins.separators", s.x.pins.separators, 0);
      for (const h of s.pins && s.pins.heights ? s.pins.heights : []) if (!near(h, t.heightPx, t.tolerancePx)) fail(g, s.id, "pins.h", h, t.heightPx);
      for (const mid of s.pins && s.pins.mids ? s.pins.mids : []) if (!near(mid, t.midPx, t.tolerancePx)) fail(g, s.id, "pins.mid", mid, t.midPx);
      if (s.x.pins.visibleCount > t.maxVisible) fail(g, s.id, "pins.visible", s.x.pins.visibleCount, t.maxVisible);
    }
    return finish(g);
  },
  continuation(reading, { T }) {
    const t = T.continuation; const g = open();
    for (const s of measured(reading)) {
      if (s.x.menu) {
        g.checked++;
        if (!near(s.x.menu.gapBelowTab, t.menuGapPx, t.tolerancePx)) fail(g, s.id, "menu.top-tab.bottom", s.x.menu.gapBelowTab, t.menuGapPx);
      }
      if (s.drop) {
        g.checked++;
        if (!near(s.drop.gapBelowPin, t.menuGapPx, t.tolerancePx)) fail(g, s.id, "drop.top-item.bottom", s.drop.gapBelowPin, t.menuGapPx);
        if (!s.x.openPin || !near(s.drop.l, s.x.openPin.l, t.tolerancePx)) fail(g, s.id, "drop.left", s.drop.l, s.x.openPin ? s.x.openPin.l : null);
        if (!near(s.drop.w, t.dropWidthPx, t.tolerancePx)) fail(g, s.id, "drop.w", s.drop.w, t.dropWidthPx);
        if (!near(s.drop.search, t.dropSearchPx, t.tolerancePx)) fail(g, s.id, "drop.search", s.drop.search === undefined ? null : s.drop.search, t.dropSearchPx);
      }
    }
    return finish(g);
  },
  barCentering(reading, { T }) {
    const t = T.barCentering; const g = open();
    for (const s of measured(reading)) {
      if (!s.pbar || !s.x.bar) continue;
      g.checked++;
      const d = s.x.bar.divider;
      const pairs = [["lockupText", s.pbar.lockupTextGapAbove, s.pbar.lockupTextGapBelow], ["mark", s.pbar.markGapAbove, s.pbar.markGapBelow], ["crumbs", s.pbar.crumbsGapAbove, s.pbar.crumbsGapBelow]];
      for (const [what, above, below] of pairs) {
        if (typeof above !== "number" || typeof below !== "number") { fail(g, s.id, what + ".gaps", null, "measured"); continue; }
        const diff = Math.round((above - d - below) * 10) / 10;
        if (Math.abs(diff) > t.maxDiffPx + 1e-9) fail(g, s.id, what + ".above-below", diff, 0);
      }
      if (!near(s.x.bar.lockupRightInset, t.lockupRightInsetPx, t.tolerancePx)) fail(g, s.id, "lockup.rightInset", s.x.bar.lockupRightInset, t.lockupRightInsetPx);
    }
    return finish(g);
  },
  markText(reading, { T }) {
    const t = T.markText; const g = open();
    // a row is named by its shell, lockup kind, mark size and product (the brand story shows four
    // products at each scale outside any shell, so kind and size alone do not tell its first lines apart)
    const named = (row, base) => (row.shell ? row.shell + ":" : "") + base + (row.product ? ":" + row.product : "");
    for (const o of reading.optical || []) {
      g.checked++;
      if (Math.abs(o.inkMinusMark - o.expect) > t.maxInkOffsetPx + 1e-9) fail(g, named(o, o.kind + "@" + o.mark), "ink-mark", o.inkMinusMark, o.expect);
    }
    for (const l of reading.lockups || []) {
      g.checked++;
      if (Math.abs(l.off) > t.maxLockupOffsetPx + 1e-9) fail(g, named(l, l.kind), "text-mark", l.off, 0);
    }
    for (const s of measured(reading)) {
      if (!s.x.tabGroup) continue;
      g.checked++;
      const diff = Math.round((s.x.tabGroup.top - s.x.tabGroup.bottom) * 10) / 10;
      if (Math.abs(diff) > t.maxGroupDiffPx + 1e-9) fail(g, s.id, "tab.group.top-bottom", diff, 0);
    }
    return finish(g);
  },
  cascade(reading, { T }) {
    const t = T.cascade; const g = open();
    for (const s of measured(reading)) {
      const cols = s.x.dropCols || [];
      if (cols.length < 2) continue;
      g.checked++;
      for (let n = 1; n < cols.length; n++) {
        const prev = cols[n - 1], col = cols[n];
        if (!near(col.h, prev.h, t.tolerancePx)) fail(g, s.id, "col" + (n + 1) + ".h", col.h, prev.h);
        if (!near(Math.round((s.x.cascadeSide === "start" ? prev.l - (col.l + col.w) : col.l - (prev.l + prev.w)) * 10) / 10, t.gapPx, t.tolerancePx)) fail(g, s.id, "col" + (n + 1) + ".gap", Math.round((s.x.cascadeSide === "start" ? prev.l - (col.l + col.w) : col.l - (prev.l + prev.w)) * 10) / 10, t.gapPx);
        if (!near(col.w, prev.w, t.tolerancePx)) fail(g, s.id, "col" + (n + 1) + ".w", col.w, prev.w);
      }
    }
    return finish(g);
  },
  noCollapse(reading, { T, traces }) {
    const t = T.noCollapse; const g = open();
    for (const s of measured(reading)) {
      g.checked++;
      if (s.x.collapseButtons > t.maxCollapseButtons) fail(g, s.id, "collapseButtons", s.x.collapseButtons, t.maxCollapseButtons);
      if (typeof s.closeButtons === "number" && s.closeButtons > t.maxCollapseButtons) fail(g, s.id, "panel.closeButtons", s.closeButtons, t.maxCollapseButtons);
      if (s.closeButtonsInShell > t.maxCollapseButtons) fail(g, s.id, "shell.closeButtons", s.closeButtonsInShell, t.maxCollapseButtons);
      if (s.x.sidebars > t.maxSidebars) fail(g, s.id, "sidebars", s.x.sidebars, t.maxSidebars);
    }
    const trace = traces && traces.outsideClick;
    if (trace) {
      g.checked++;
      if (trace.closesOnOutsideClick !== true) fail(g, "trace", "outsideClick", trace.closesOnOutsideClick, true);
    } else g.pending.push("outside-click behaviour not traced in this run");
    return finish(g);
  },
  pinJitter(reading, { T }) {
    const t = T.pinJitter; const g = open();
    for (const s of measured(reading)) {
      if (!s.x.rowGroups) continue;
      g.checked++;
      s.x.rowGroups.forEach((group, i) => {
        const all = [...group.rest, ...group.hover, ...group.on];
        if (all.length && Math.max(...all) - Math.min(...all) > t.maxSpreadPx + 1e-9) fail(g, s.id, "column" + (i + 1) + ".textWidths", group, "equal");
      });
      for (const size of s.pinButtons || []) {
        const [w, h] = String(size).split("x").map(Number);
        if (!near(w, t.pinButtonPx, t.tolerancePx) || !near(h, t.pinButtonPx, t.tolerancePx)) fail(g, s.id, "pinButton", size, t.pinButtonPx + "x" + t.pinButtonPx);
      }
    }
    return finish(g);
  },
  lockupDecor(reading, { T }) {
    const t = T.lockupDecor; const g = open();
    for (const s of measured(reading)) {
      for (const lk of s.x.lockups || []) {
        g.checked++;
        if (INTERACTIVE_TAGS.has(lk.tag)) fail(g, s.id, "lockup.tag", lk.tag, "not a control");
        if (lk.focusable || lk.tabIndex >= 0) fail(g, s.id, "lockup.tabOrder", lk.tabIndex, -1);
        if (lk.hoverRules > t.maxHoverRules) fail(g, s.id, "lockup.hoverRules", lk.hoverRules, t.maxHoverRules);
        if (/^lkr/.test(lk.kind || "") && !near(lk.markSize, t.railMarkPx, t.tolerancePx)) fail(g, s.id, "lockup.mark", lk.markSize, t.railMarkPx);
      }
    }
    return finish(g);
  },
  contrast(reading, { T }) {
    const t = T.contrast; const g = open();
    for (const c of reading.contrastCells || []) {
      // 07a B marks these cells 不进门 / 豁免 / 按设计不读: an exempt cell of one of them is listed with its
      // reading and not compared (judgment §3.4, TCRN-DS-SUB-174)
      if (isListOnlyCell(c, t)) {
        g.listed.push({ cell: c.cell, kind: c.kind, probe: c.probe, ratio: sectionBReading(c), expect: c.expect, ...(c.underScrim ? { scrims: c.underScrim.scrims, unscrimmed: c.ratio } : {}), ruling: "07a B: 不进门 / 豁免 / 按设计不读" });
        continue;
      }
      g.checked++;
      if (c.unknownProbe) { fail(g, c.cell, "probe", c.probe, "known probe"); continue; }
      if (c.unreadable || typeof c.ratio !== "number") { fail(g, c.cell, "reading", null, c.probe); continue; }
      if (c.expect === null) fail(g, c.cell, "expect", null, "data-expect");
      else if (Math.abs(c.ratio - c.expect) > t.maxDiff + 1e-9) fail(g, c.cell, "ratio-expect", c.ratio, c.expect);
      const min = c.kind === "text" ? t.minText : t.minNonText;
      if (!c.exempt && c.ratio < min) {
        if (t.pendingBelowMinimum.includes(c.cell)) g.pending.push({ cell: c.cell, ratio: c.ratio, min, ruling: "MIN-20261013-SHELL D7" });
        else fail(g, c.cell, "minimum", c.ratio, min);
      }
    }
    return finish(g);
  },
  singleLine(reading, { T }) {
    const t = T.singleLine; const g = open();
    for (const s of measured(reading)) {
      g.checked++;
      for (const line of s.x.textLines || []) {
        if (line.lines > t.maxLines) fail(g, s.id, "lines:" + line.el, line.lines, t.maxLines);
        if (line.excess > t.tolerancePx + 1e-9 && !(line.clip && line.ellipsis && line.title)) {
          const what = !line.clip ? "spill" : !line.ellipsis ? "cut" : "truncatedWithoutTitle";
          fail(g, s.id, what + ":" + line.el, line.excess, 0);
        }
      }
      for (const leak of s.x.clip.leaks) if (leak.px > t.tolerancePx + 1e-9) fail(g, s.id, "clip:" + leak.el + " in " + leak.clip, leak.px, 0);
    }
    return finish(g);
  },
  shadowBlur(reading, { T }) {
    const g = open();
    for (const s of measured(reading)) {
      g.checked++;
      if (s.x.shadow.maxBlur > T.shadowBlur.maxBlurPx + 1e-9) fail(g, s.id, "blur:" + s.x.shadow.at, s.x.shadow.maxBlur, T.shadowBlur.maxBlurPx);
    }
    return finish(g);
  },
  touch(reading, { T }) {
    const t = T.touch; const g = open();
    for (const s of measured(reading)) {
      if (s.w > t.phoneMaxWidthPx + t.tolerancePx) continue;
      g.checked++;
      if (s.x.pins.visibleCount > 0) fail(g, s.id, "pins.inStrip", s.x.pins.visibleCount, 0);
      if (!(s.tab.h >= t.minTabHeightPx - t.tolerancePx)) fail(g, s.id, "tab.h", s.tab.h, ">= " + t.minTabHeightPx);
      const layerOpen = s.panel !== undefined || s.drop !== undefined;
      // 窄于 1024 (D section): what opens on a phone is the Sheet, so "Sheet rows 44" cannot pass vacuously
      if (s.x.panelKind && s.x.panelKind !== "sheet") fail(g, s.id, "layer.notSheet", s.x.panelKind, "sheet");
      if (!layerOpen) {
        if (!s.x.touch || !s.x.touch.tabHit) fail(g, s.id, "tab.hit", s.x.touch ? s.x.touch.hitAt : null, "the tab");
        if (s.x.touch && s.x.touch.pointerEvents === "none") fail(g, s.id, "tab.pointerEvents", "none", "auto");
      }
      if (s.x.panelKind === "sheet") for (const h of s.x.rowHeights) if (!near(h, t.sheetRowPx, t.tolerancePx)) fail(g, s.id, "sheet.row", h, t.sheetRowPx);
    }
    return finish(g);
  }
};

const CHECK_JUDGES = {
  // the guide column of the full menu and the Sheet: every icon at 16, every text at 48 (x.prail: each
  // column read as the first); a shell without an open full menu or Sheet, or with a prail hook gap
  // (x.prail null, listed in missingHooks), is not checked
  prail(reading, { T }) {
    const t = T.prail; const g = open();
    for (const s of measured(reading)) {
      const p = s.x.prail;
      if (!p || (!p.icons.length && !p.texts.length)) continue;
      g.checked++;
      for (const v of p.icons) if (!near(v, t.iconLeftPx, t.tolerancePx)) fail(g, s.id, "prail.icon", v, t.iconLeftPx);
      for (const v of p.texts) if (!near(v, t.textLeftPx, t.tolerancePx)) fail(g, s.id, "prail.text", v, t.textLeftPx);
    }
    return finish(g);
  },
  // the page breadcrumb in the paper (x.pageCrumbs): one line; no crumb past the trail's box; a crumb
  // wider than its box is cut only as an ellipsis under a title. A trail without crumbs is not read as
  // a pass. A shell without a page breadcrumb is not checked.
  pageCrumbs(reading, { T }) {
    const t = T.pageCrumbs; const g = open();
    for (const s of measured(reading)) {
      for (const c of s.x.pageCrumbs || []) {
        g.checked++;
        if (c.lines > t.maxLines) fail(g, s.id, "crumbs.lines:" + c.el, c.lines, t.maxLines);
        if (c.excess > t.tolerancePx + 1e-9) fail(g, s.id, (c.clip ? "crumbs.cut:" : "crumbs.spill:") + c.el, c.excess, 0);
        if (!c.crumbs.length) fail(g, s.id, "crumbs.none:" + c.el, 0, "crumbs");
        for (const crumb of c.crumbs) {
          if (crumb.over > t.tolerancePx + 1e-9 && !(crumb.clip && crumb.ellipsis && crumb.title)) {
            const what = !crumb.clip ? "spill" : !crumb.ellipsis ? "cut" : "truncatedWithoutTitle";
            fail(g, s.id, "crumb." + what + ":" + crumb.text, crumb.over, 0);
          }
        }
      }
    }
    return finish(g);
  },
  // SettingsLayout in the paper (x.settingsLayouts): at most 1040 wide, centred (left = right)
  settingsLayout(reading, { T }) {
    const t = T.settingsLayout; const g = open();
    for (const s of measured(reading)) {
      for (const v of s.x.settingsLayouts || []) {
        g.checked++;
        if (!(v.w <= t.maxWidthPx + t.tolerancePx + 1e-9)) fail(g, s.id, "settings.w", v.w, "<= " + t.maxWidthPx);
        const diff = Math.round((v.left - v.right) * 10) / 10;
        if (Math.abs(diff) > t.tolerancePx + 1e-9) fail(g, s.id, "settings.left-right", diff, 0);
      }
    }
    return finish(g);
  },
  // SplitView in the paper (x.splitViews): left edge = the paper's content inset from the paper's left
  // edge (28; 16 on a shell no wider than the 390 phone)
  splitView(reading, { T }) {
    const t = T.splitView; const g = open();
    for (const s of measured(reading)) {
      const inset = s.w <= t.phoneMaxWidthPx + t.tolerancePx ? t.phoneInsetPx : t.insetPx;
      for (const v of s.x.splitViews || []) {
        g.checked++;
        if (!near(v.left, inset, t.tolerancePx)) fail(g, s.id, "split.left", v.left, inset);
      }
    }
    return finish(g);
  }
};

// Behaviour traces (fixture manifest, or the SUB-137 probes on the real parts):
//   intro       { firstLoadPlays, reloadPlays, reducedMotionPlays, properties?, durationMs? }
//   focusLoop   { afterEscape, afterCommandK, cascadeArrowRight: { from, to }, cascadeArrowLeft: { from, to },
//                 commandKRegistrations? }
//   outsideClick { closesOnOutsideClick }   (judged inside noCollapse)
export function judgeIntroTrace(trace, thresholds = THRESHOLDS) {
  const t = thresholds.intro; const g = open();
  if (!trace) return finish(g);
  g.checked++;
  if (trace.firstLoadPlays !== t.firstLoadPlays) fail(g, "trace", "firstLoadPlays", trace.firstLoadPlays, t.firstLoadPlays);
  if (trace.reloadPlays !== t.reloadPlays) fail(g, "trace", "reloadPlays", trace.reloadPlays, t.reloadPlays);
  if (trace.reducedMotionPlays !== t.reducedMotionPlays) fail(g, "trace", "reducedMotionPlays", trace.reducedMotionPlays, t.reducedMotionPlays);
  for (const property of trace.properties || []) if (!t.properties.includes(property)) fail(g, "trace", "property", property, t.properties.join(" | "));
  if (typeof trace.durationMs === "number" && trace.durationMs > t.maxDurationMs) fail(g, "trace", "durationMs", trace.durationMs, t.maxDurationMs);
  return finish(g);
}

export function judgeFocusTrace(trace, thresholds = THRESHOLDS) {
  const t = thresholds.focusLoop; const g = open();
  if (!trace) return finish(g);
  g.checked++;
  if (trace.afterEscape !== t.afterEscape) fail(g, "trace", "afterEscape", trace.afterEscape, t.afterEscape);
  if (trace.afterCommandK !== t.afterCommandK) fail(g, "trace", "afterCommandK", trace.afterCommandK, t.afterCommandK);
  const right = trace.cascadeArrowRight, left = trace.cascadeArrowLeft;
  if (!right || right.to !== right.from + 1) fail(g, "trace", "cascadeArrowRight", right || null, "next column");
  if (!left || left.to !== left.from - 1) fail(g, "trace", "cascadeArrowLeft", left || null, "previous column");
  if (trace.commandKRegistrations !== undefined && trace.commandKRegistrations !== t.commandKRegistrations) fail(g, "trace", "commandKRegistrations", trace.commandKRegistrations, t.commandKRegistrations);
  return finish(g);
}

export function judgeBehaviour(traces, thresholds = THRESHOLDS) {
  return { intro: judgeIntroTrace(traces && traces.intro, thresholds), focusLoop: judgeFocusTrace(traces && traces.focusLoop, thresholds) };
}

// One reading gate or check on its own (tests, and later probes that feed a single gate).
export function judgeGate(id, reading, { thresholds = THRESHOLDS, brandLockups = [], traces = null, compareDescription = true } = {}) {
  const judge = READING_JUDGES[id] || CHECK_JUDGES[id];
  if (!judge) throw new Error("shell_measure_gate_unknown:" + id);
  return judge(reading, { T: thresholds, brandLockups, traces, compareDescription });
}

// reading: readShellInPage output. ctx: { thresholds, brandLockups, traces, compareDescription }.
// failed lists the failing gates (the G section), failedChecks the failing checks beyond it.
export function judgeShellReadings(reading, { thresholds = THRESHOLDS, brandLockups = [], traces = null, compareDescription = true } = {}) {
  const ctx = { T: thresholds, brandLockups, traces, compareDescription };
  const gates = {};
  for (const id of READING_GATE_IDS) gates[id] = READING_JUDGES[id](reading, ctx);
  const checks = {};
  for (const id of CHECK_IDS) checks[id] = CHECK_JUDGES[id](reading, ctx);
  const gapsOf = (s) => (s.x && Array.isArray(s.x.hookGaps) ? s.x.hookGaps : []);
  const missingHooks = (reading.shells || []).filter((s) => !s.x || s.x.missing.length || gapsOf(s).length).map((s) => ({ shell: s.id, missing: s.x ? [...s.x.missing, ...gapsOf(s)] : ["x"] }));
  return { gates, checks, failed: READING_GATE_IDS.filter((id) => gates[id].status === "fail"), failedChecks: CHECK_IDS.filter((id) => checks[id].status === "fail"), missingHooks };
}

// ------------------------------------------------------------------------------------------- page plumbing

// Browser-side, self-contained: applies a fixture mutation's ops to the page.
//   { op: "css", css }                             appends a <style> after the board's own styles
//   { op: "retag", selector, tag }                 replaces the first match with <tag>, same attributes and children
//   { op: "insert", selector, html, position? }    insertAdjacentHTML on the first match (default beforeend)
//   { op: "appendText", selector, text, repeat? }  appends a text node to the first match
//   { op: "replaceInAttr", selector, name, from, to }  replaces a substring of an attribute of the first match
//   { op: "noFocus", selector }                     focus() on any element matching selector does nothing
//                                                   (a layer that does not hand the focus back)
//   { op: "clearSessionStorage" }                   forgets the session (an intro that keeps no marker)
export function applyMutationInPage(ops) {
  for (const op of ops) {
    if (op.op === "css") {
      const style = document.createElement("style");
      style.setAttribute("data-shell-mutation", "");
      style.textContent = op.css;
      document.body.appendChild(style);
      continue;
    }
    if (op.op === "noFocus") {
      const focus = HTMLElement.prototype.focus;
      HTMLElement.prototype.focus = function focusUnlessMutated(...args) {
        if (this.matches(op.selector)) return undefined;
        return focus.apply(this, args);
      };
      continue;
    }
    if (op.op === "clearSessionStorage") {
      window.sessionStorage.clear();
      continue;
    }
    const el = document.querySelector(op.selector);
    if (!el) throw new Error("shell_mutation_target_missing:" + op.selector);
    if (op.op === "retag") {
      const next = document.createElement(op.tag);
      for (const attr of el.attributes) next.setAttribute(attr.name, attr.value);
      if (op.tag === "button" && !next.hasAttribute("type")) next.setAttribute("type", "button");
      while (el.firstChild) next.appendChild(el.firstChild);
      el.replaceWith(next);
    } else if (op.op === "insert") el.insertAdjacentHTML(op.position || "beforeend", op.html);
    else if (op.op === "appendText") el.appendChild(document.createTextNode(String(op.text).repeat(op.repeat || 1)));
    else if (op.op === "replaceInAttr") {
      const value = el.getAttribute(op.name);
      if (value === null || !value.includes(op.from)) throw new Error("shell_mutation_attr_missing:" + op.name);
      el.setAttribute(op.name, value.replace(op.from, op.to));
    } else throw new Error("shell_mutation_op_unknown:" + op.op);
  }
  return true;
}

// The boards link their faces from the web-font service. A board page answers that request with the
// repository's own copies (packages/ui-tokens/fonts: same families, SIL OFL, byte-identical upstream
// files) and refuses every other non-file request, so board readings are taken on the board's own
// faces on any machine, offline.
const VENDORED_FONT_ORIGIN = "https://fonts.gstatic.com/tcrn-ds-vendored/";
export async function openBoardPage(context, root, file) {
  const fontDir = resolve(root, DEFAULT_PATHS.vendoredFonts);
  const css = readFileSync(resolve(fontDir, "fonts.css"), "utf8").replace(/url\("\.\/([^"]+)"\)/g, (match, name) => `url("${VENDORED_FONT_ORIGIN}${name}")`);
  const page = await context.newPage();
  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (url.startsWith("file:")) return route.continue();
    if (url.startsWith("https://fonts.googleapis.com/")) return route.fulfill({ status: 200, contentType: "text/css; charset=utf-8", headers: { "access-control-allow-origin": "*" }, body: css });
    const name = url.startsWith(VENDORED_FONT_ORIGIN) ? url.slice(VENDORED_FONT_ORIGIN.length) : "";
    if (/^[a-z0-9-]+\.woff2$/.test(name) && existsSync(resolve(fontDir, name))) return route.fulfill({ status: 200, contentType: "font/woff2", headers: { "access-control-allow-origin": "*" }, body: readFileSync(resolve(fontDir, name)) });
    return route.abort();
  });
  await page.goto(pathToFileURL(resolve(root, file)).href, { waitUntil: "load" });
  await settlePage(page, { networkIdle: false });
  return page;
}

async function withBrowser(browser, launchOptions, run) {
  let owned = null;
  if (!browser) {
    const { chromium } = await import("@playwright/test");
    owned = await chromium.launch(launchOptions);
  }
  try {
    return await run(browser ?? owned);
  } finally {
    if (owned) await owned.close();
  }
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function combine(statuses) {
  if (statuses.includes("fail")) return "fail";
  if (statuses.includes("pass")) return "pass";
  return "n/a";
}

// ---------------------------------------------------------------------------------------------- fixtures

// The package-hook fixture (manifest packageFixture, TCRN-DS-SUB-174): read with the package hooks; the
// gates and checks it names (green) must pass, every contrast cell on it must read its data-expect
// (within the contrast gate's maxDiff: the 07a B readings, list-only cells included), and each story
// mutation it names must turn its gate red on it (judgeStoryMutation, as on the real parts). The page
// fixture (manifest pageFixture, TCRN-DS-SUB-164) runs the same way: the page in the paper (breadcrumb,
// SettingsLayout, SplitView) and the brand story's first lines, with the package hooks; a fixture with
// no contrast gate in its green list carries no contrast cells.
async function runPackageFixture({ root, context, spec, mutationsPath, thresholds, brandLockups, logoSources }) {
  const storyMutations = new Map((readJson(resolve(root, mutationsPath)).storyMutations || []).map((m) => [m.id, m]));
  const measure = async (ops) => {
    const page = await openBoardPage(context, root, spec.file);
    try {
      if (ops) {
        await page.evaluate(applyMutationInPage, ops);
        await settlePage(page, { networkIdle: false });
      }
      const reading = await measureShellPage(page, { selectors: PACKAGE_SELECTORS, selectorSet: "package-fixture", logoSources });
      const verdict = judgeShellReadings(reading, { thresholds, brandLockups });
      return { reading, gates: { ...verdict.gates, ...verdict.checks }, missingHooks: verdict.missingHooks };
    } finally {
      await page.close();
    }
  };
  const base = await measure(null);
  const fixtureFailures = [];
  for (const id of spec.green) {
    const status = base.gates[id] ? base.gates[id].status : null;
    if (status !== "pass") fixtureFailures.push({ what: "green", gate: id, value: status, failures: base.gates[id] ? base.gates[id].failures : null, expect: "pass" });
  }
  if (base.missingHooks.length) fixtureFailures.push({ what: "missingHooks", value: base.missingHooks });
  const cells = base.reading.contrastCells || [];
  if (spec.green.includes("contrast") && cells.length === 0) fixtureFailures.push({ what: "readings", value: 0, expect: "contrast cells" });
  for (const c of cells) {
    const value = isListOnlyCell(c, thresholds.contrast) ? sectionBReading(c) : c.ratio;
    if (c.expect === null || typeof value !== "number" || Math.abs(value - c.expect) > thresholds.contrast.maxDiff + 1e-9) fixtureFailures.push({ what: "reading", cell: c.cell, probe: c.probe, value, expect: c.expect });
  }
  const mutationResults = [];
  for (const id of spec.storyMutations) {
    const mutation = storyMutations.get(id);
    if (!mutation || mutation.probe) {
      mutationResults.push({ id, ok: false, verdict: mutation ? "probe mutations are not run on the fixture" : "unknown story mutation" });
      continue;
    }
    const after = await measure(mutation.ops);
    mutationResults.push({ ...judgeStoryMutation(mutation, base.gates, after.gates), source: mutation.source });
  }
  return {
    file: spec.file,
    green: Object.fromEntries(spec.green.map((id) => [id, base.gates[id] ? base.gates[id].status : null])),
    readings: cells.map((c) => ({ cell: c.cell, probe: c.probe, ratio: c.ratio, expect: c.expect, ...(c.underScrim ? { underScrim: c.underScrim } : {}) })),
    listed: base.gates.contrast && base.gates.contrast.listed ? base.gates.contrast.listed : [],
    fixtureFailures,
    mutations: mutationResults,
    ok: fixtureFailures.length === 0 && spec.storyMutations.length > 0 && mutationResults.every((m) => m.ok)
  };
}

// The two finished boards with the board hooks; every gate green, every mutation red on its gate.
export async function runFixtures({ root = process.cwd(), browser, launchOptions, thresholds = THRESHOLDS, manifestPath = DEFAULT_PATHS.fixtureManifest, mutationsPath = DEFAULT_PATHS.fixtureMutations, onlyMutations } = {}) {
  const manifest = readJson(resolve(root, manifestPath));
  const mutations = readJson(resolve(root, mutationsPath)).mutations;
  const logoSources = loadLogoSources(root);
  const traces = Object.fromEntries(Object.entries(manifest.behaviourTraces).map(([id, entry]) => [id, entry.trace]));
  const boardById = new Map(manifest.boards.map((board) => [board.id, board]));
  return withBrowser(browser, launchOptions, async (active) => {
    const context = await active.newContext({ viewport: manifest.viewport, deviceScaleFactor: 1 });
    try {
      const brandPage = await openBoardPage(context, root, manifest.brandBoard);
      const brandLockups = await readBrandLockups(brandPage);
      await brandPage.close();
      const measureBoard = async (board, ops) => {
        const page = await openBoardPage(context, root, board.file);
        try {
          if (ops) {
            await page.evaluate(applyMutationInPage, ops);
            await settlePage(page, { networkIdle: false });
          }
          return await measureShellPage(page, { selectors: BOARD_SELECTORS, selectorSet: "board", logoSources });
        } finally {
          await page.close();
        }
      };
      const boards = [];
      for (const board of manifest.boards) {
        const reading = await measureBoard(board, null);
        const verdict = judgeShellReadings(reading, { thresholds, brandLockups, traces });
        const fixtureFailures = [];
        const ids = reading.shells.map((s) => s.id);
        if (JSON.stringify(ids) !== JSON.stringify(board.shells.map((s) => s.id))) fixtureFailures.push({ what: "shells", value: ids, expect: board.shells.map((s) => s.id) });
        for (const expected of board.shells) {
          const s = reading.shells.find((item) => item.id === expected.id);
          if (s && (!near(s.w, expected.width, thresholds.fixture.tolerancePx) || s.state !== expected.state)) fixtureFailures.push({ what: "shell", shell: s.id, value: { w: s.w, state: s.state }, expect: { w: expected.width, state: expected.state } });
        }
        if (verdict.missingHooks.length) fixtureFailures.push({ what: "missingHooks", value: verdict.missingHooks });
        boards.push({ id: board.id, file: board.file, shells: ids.length, reading, gates: verdict.gates, checks: verdict.checks, failed: verdict.failed, failedChecks: verdict.failedChecks, fixtureFailures, digests: Object.fromEntries(Object.entries(reading.logoForms).filter(([, form]) => form).map(([id, form]) => [id, formDigest(form)])) });
      }
      const behaviour = judgeBehaviour(traces, thresholds);
      const gates = {};
      for (const id of GATE_IDS) gates[id] = BEHAVIOUR_GATE_IDS.includes(id) ? behaviour[id].status : combine(boards.map((b) => b.gates[id].status));
      const mutationResults = [];
      for (const mutation of mutations) {
        if (onlyMutations && !onlyMutations.includes(mutation.id)) continue;
        let failed;
        if (mutation.trace) {
          const merged = { ...traces, [mutation.traceOf]: { ...traces[mutation.traceOf], ...mutation.trace } };
          if (BEHAVIOUR_GATE_IDS.includes(mutation.gate)) failed = Object.entries(judgeBehaviour(merged, thresholds)).filter(([, v]) => v.status === "fail").map(([id]) => id);
          else failed = judgeShellReadings({ shells: [] }, { thresholds, brandLockups, traces: merged }).failed;
        } else {
          const board = boardById.get(mutation.board);
          if (!board) throw new Error("shell_mutation_board_unknown:" + mutation.board);
          const reading = await measureBoard(board, mutation.ops);
          const verdict = judgeShellReadings(reading, { thresholds, brandLockups, traces });
          failed = [...verdict.failed, ...verdict.failedChecks];
        }
        const expected = [mutation.gate, ...(mutation.alsoFails || [])].sort();
        const ok = failed.includes(mutation.gate) && JSON.stringify([...failed].sort()) === JSON.stringify(expected);
        mutationResults.push({ id: mutation.id, gate: mutation.gate, failed, expected, ok });
      }
      const fixtureArgs = { root, context, mutationsPath, thresholds, brandLockups, logoSources };
      const packageFixture = manifest.packageFixture ? await runPackageFixture({ ...fixtureArgs, spec: manifest.packageFixture }) : null;
      const pageFixture = manifest.pageFixture ? await runPackageFixture({ ...fixtureArgs, spec: manifest.pageFixture }) : null;
      const pageFixtures = [packageFixture, pageFixture].filter(Boolean);
      // a check the boards cannot show (boards: false) takes its status from the fixtures that list it
      // green, and its mutation is a story mutation that turns it red there
      const checks = {};
      for (const id of CHECK_IDS) {
        const statuses = boards.map((b) => b.checks[id].status);
        if (PAGE_FIXTURE_CHECK_IDS.includes(id)) for (const f of pageFixtures) if (f.green[id] !== undefined) statuses.push(f.green[id] || "n/a");
        checks[id] = combine(statuses);
      }
      const fixtureMutated = new Set(pageFixtures.flatMap((f) => f.mutations.filter((m) => m.ok && m.gate).map((m) => m.gate)));
      const gatesGreen = GATE_IDS.every((id) => gates[id] === "pass");
      const checksGreen = CHECK_IDS.every((id) => checks[id] === "pass");
      const boardsClean = boards.every((b) => b.failed.length === 0 && b.failedChecks.length === 0 && b.fixtureFailures.length === 0);
      const everyGateMutated = [...GATE_IDS, ...CHECK_IDS].every((id) => (PAGE_FIXTURE_CHECK_IDS.includes(id) ? fixtureMutated.has(id) : mutations.some((m) => m.gate === id)));
      const mutationsRed = mutationResults.every((m) => m.ok);
      return {
        schemaVersion: SCHEMA_VERSION,
        readingSchemaVersion: SHELL_MEASURE_SCHEMA_VERSION,
        mode: "fixtures",
        ok: gatesGreen && checksGreen && boardsClean && everyGateMutated && mutationsRed && pageFixtures.every((f) => f.ok),
        viewport: manifest.viewport,
        gates,
        checks,
        boards,
        behaviour,
        mutations: mutationResults,
        packageFixture,
        pageFixture,
        dSection: D_SECTION_ROWS.map((row) => ({ row: row.row, gates: row.gates, status: combine(row.gates.map((id) => gates[id])) }))
      };
    } finally {
      await context.close();
    }
  });
}

// ------------------------------------------------------------------------------------- behaviour probes

// Browser-side, self-contained: the state of one shell screen. `shell` is a CSS selector of the screen
// root. focus: "tab" (its brand button), "search" (its search field), "search:other-shell" (another
// shell's search field), "body" (nothing focused) or "other". column: 1 for the layer's own rows, n for
// a cascade column n, 0 outside the screen's layers.
export function shellStateInPage({ shell, selectors: sel }) {
  const scr = document.querySelector(shell);
  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const layers = scr ? [...scr.querySelectorAll(sel.panelPreferred)].filter(visible) : [];
  const tab = scr ? scr.querySelector(sel.tab) : null;
  const active = document.activeElement;
  let focus = "other";
  if (!active || active === document.body || active === document.documentElement) focus = "body";
  else if (tab && (active === tab || tab.contains(active))) focus = "tab";
  else if (active.closest(sel.search) && active.closest(sel.shell)) focus = active.closest(sel.shell) === scr ? "search" : "search:other-shell";
  let column = 0;
  if (active && scr && scr.contains(active)) {
    const col = active.closest(sel.dropCol);
    if (col) column = Number(col.getAttribute("data-drop-col")) || (col.hasAttribute("data-drop4") ? 4 : col.hasAttribute("data-drop3") ? 3 : 2);
    else if (layers.some((layer) => layer.contains(active))) column = 1;
  }
  return { found: Boolean(scr), open: layers.length > 0, focus, column };
}

// Browser-side: a viewport point outside the screen's layers and tab that is not a control (or null).
export function outsidePointInPage({ shell, selectors: sel }) {
  const scr = document.querySelector(shell);
  if (!scr) return null;
  const layers = [...scr.querySelectorAll(sel.panelAny)];
  const tab = scr.querySelector(sel.tab);
  const w = window.innerWidth, h = window.innerHeight;
  for (const [x, y] of [[w - 6, h - 6], [6, h - 6], [w / 2, h - 6], [w - 6, h / 2], [6, 6]]) {
    const el = document.elementFromPoint(x, y);
    if (!el || layers.some((layer) => layer.contains(el)) || (tab && tab.contains(el))) continue;
    if (el.closest("a, button, input, select, textarea, summary, label, [role='button'], [tabindex]")) continue;
    return { x, y };
  }
  return null;
}

// Browser-side: focus a row of column 1 that opens a cascade (aria-controls), in the screen's open layer.
function focusCascadeRowInPage({ shell, selectors: sel }) {
  const scr = document.querySelector(shell);
  const layer = scr ? [...scr.querySelectorAll(sel.panelPreferred)][0] : null;
  if (!layer) return null;
  const row = [...layer.querySelectorAll(sel.row)].find((r) => r.hasAttribute("aria-controls") && !r.closest(sel.dropCol));
  if (!row) return null;
  row.focus();
  return document.activeElement === row ? row.getAttribute("title") || row.textContent.trim().slice(0, 40) : null;
}

// Browser-side: move the focus into the screen's open layer (its first row, else its first control).
function focusIntoLayerInPage({ shell, selectors: sel }) {
  const scr = document.querySelector(shell);
  const layer = scr ? [...scr.querySelectorAll(sel.panelPreferred)][0] : null;
  const target = layer ? layer.querySelector(sel.row) || layer.querySelector("input, button, a[href]") : null;
  if (target) target.focus();
  return Boolean(target && document.activeElement === target);
}

// focusLoop and the outside-click half of noCollapse on the real parts. `screen` is a closed screen
// (its tab opens the full menu); `cascadeScreen` shows the full menu (default: `screen`, opened first).
export async function probeShellBehaviour(page, { scope = "body", screen, cascadeScreen = screen, selectors = PACKAGE_SELECTORS, waitMs = 300 } = {}) {
  const shell = `${scope} [data-shell="${screen}"]`;
  const cascadeShell = `${scope} [data-shell="${cascadeScreen}"]`;
  const notes = [];
  const state = (target = shell) => page.evaluate(shellStateInPage, { shell: target, selectors });
  const settle = () => page.waitForTimeout(waitMs);
  const clickTab = async (target = shell) => {
    try {
      await page.click(`${target} ${selectors.tab}`, { timeout: 3000 });
    } catch (error) {
      notes.push("tab click: " + String(error && error.message ? error.message : error).split("\n")[0]);
    }
    await settle();
  };
  const closeIfOpen = async () => {
    if ((await state()).open) {
      await page.keyboard.press("Escape");
      await settle();
    }
  };
  const start = await state();
  if (!start.found) return { trace: null, notes: ["screen missing: " + screen] };
  if (start.open) notes.push("the probed screen starts open");

  // Esc: open with the tab, move the focus into the layer, press Esc -> the layer closes, focus on the tab
  await clickTab();
  let afterEscape = "unopened";
  if ((await state()).open) {
    if (!(await page.evaluate(focusIntoLayerInPage, { shell, selectors }))) notes.push("no focusable row in the open layer");
    await page.keyboard.press("Escape");
    await settle();
    const after = await state();
    afterEscape = after.open ? "unclosed" : after.focus;
  }

  // Ctrl+K from the closed shell with nothing focused -> the menu opens with the focus in its search
  await closeIfOpen();
  await page.evaluate(() => {
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
  });
  await page.keyboard.press("Control+k");
  await settle();
  const afterK = await state();
  // The focus must be in the probed screen's own search (TCRN-DS-SUB-179, R3-16): another shell's search ("search:other-shell")
  // is a second shell that took the key too, and fails. The page opens with shell-shortcut=<screen> so that only the
  // probed screen registers ⌘K (openStory below); the documentation shell then leaves the key to it.
  const afterCommandK = !afterK.open ? "unopened" : afterK.focus;
  await closeIfOpen();

  // arrows: from a column-1 row with a cascade, ArrowRight -> column 2, ArrowLeft -> column 1
  let cascadeArrowRight = null;
  let cascadeArrowLeft = null;
  if (!(await state(cascadeShell)).open) await clickTab(cascadeShell);
  const row = await page.evaluate(focusCascadeRowInPage, { shell: cascadeShell, selectors });
  if (row) {
    const from = (await state(cascadeShell)).column;
    await page.keyboard.press("ArrowRight");
    await settle();
    const right = (await state(cascadeShell)).column;
    cascadeArrowRight = { from, to: right, row };
    await page.keyboard.press("ArrowLeft");
    await settle();
    cascadeArrowLeft = { from: right, to: (await state(cascadeShell)).column, row };
  } else notes.push("no column-1 row with a cascade in " + cascadeScreen);
  if (cascadeShell !== shell && start.open === false) await closeIfOpen();

  // outside click: open with the tab, click a non-control point outside the layer and the tab
  if (!(await state()).open) await clickTab();
  let closesOnOutsideClick = "unopened";
  if ((await state()).open) {
    const point = await page.evaluate(outsidePointInPage, { shell, selectors });
    if (!point) closesOnOutsideClick = "no-outside-point";
    else {
      await page.mouse.click(point.x, point.y);
      await settle();
      closesOnOutsideClick = !(await state()).open;
    }
  }
  return { trace: { focusLoop: { afterEscape, afterCommandK, cascadeArrowRight, cascadeArrowLeft }, outsideClick: { closesOnOutsideClick } }, notes };
}

// Installed with addInitScript before any page script: counts the [data-shell-intro] layers that enter
// the document and reads the animations that run while one does (property names, latest end).
export function installIntroProbe() {
  const probe = { plays: 0, properties: [], start: null, end: null, frames: [], animations: [] };
  window.__tcrnShellIntroProbe = probe;
  const seen = new WeakSet();
  const counted = new WeakSet();
  const animationIds = new WeakMap();
  const kebab = (name) => name.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
  const identity = (element) => element instanceof Element ? {
    tag: element.tagName.toLowerCase(), id: element.id || null,
    className: element.getAttribute("class"), shell: element.getAttribute("data-shell"),
    block: element.getAttribute("data-shell-story-block"), logo: element.getAttribute("data-logo")
  } : null;
  const pointerObservation = (layer, owner) => {
    const { scope, shell, landing, control } = owner;
    const rect = landing?.isConnected ? landing.getBoundingClientRect() : null;
    const center = rect && rect.width > 0 && rect.height > 0 ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : null;
    const inViewport = center && center.x >= 0 && center.y >= 0 && center.x < window.innerWidth && center.y < window.innerHeight;
    const point = inViewport ? center : null;
    const hit = point ? document.elementFromPoint(point.x, point.y) : null;
    return {
      method: "elementFromPoint at the owning landing mark's observed center; observation only, no click",
      status: !scope || !shell || !landing?.isConnected || !control?.isConnected ? "unverified-target" : !point ? "unverified-point" : !hit ? "unverified-hit" : "observed",
      scope: identity(scope), shell: identity(shell), landing: identity(landing), underlyingControl: identity(control),
      landingRect: rect ? rect.toJSON() : null, point, hit: identity(hit),
      hitWithinUnderlyingControl: hit && control ? control === hit || control.contains(hit) : null,
      hitWithinIntro: hit ? layer === hit || layer.contains(hit) : null,
      layerPointerEvents: layer.isConnected ? getComputedStyle(layer).pointerEvents : null
    };
  };
  const sample = (layer, owner) => {
    const now = performance.now();
    const frame = { time: now, phase: layer.isConnected ? layer.getAttribute('data-intro-phase') : 'done', pointer: pointerObservation(layer, owner), animations: [] };
    for (const animation of document.getAnimations()) {
      let names = [];
      if (typeof animation.transitionProperty === "string") names = [animation.transitionProperty];
      else if (animation.effect && typeof animation.effect.getKeyframes === "function") names = animation.effect.getKeyframes().flatMap((frame) => Object.keys(frame)).filter((key) => !["offset", "computedOffset", "easing", "composite"].includes(key));
      for (const name of names.map(kebab)) if (!probe.properties.includes(name)) probe.properties.push(name);
      const timing = animation.effect && typeof animation.effect.getComputedTiming === "function" ? animation.effect.getComputedTiming() : null;
      const target = animation.effect?.target;
      if (!animationIds.has(animation)) {
        const id = probe.animations.length;
        animationIds.set(animation, id);
        probe.animations.push({ id, target: target?.className?.baseVal ?? target?.className ?? null, duration: timing?.duration ?? null, delay: timing?.delay ?? null, easing: timing?.easing ?? null, properties: names.map(kebab) });
      }
      const cs = target instanceof Element ? getComputedStyle(target) : null;
      frame.animations.push({ id: animationIds.get(animation), currentTime: animation.currentTime, playState: animation.playState, progress: timing?.progress ?? null, opacity: cs?.opacity ?? null, transform: cs?.transform ?? null, rect: target instanceof Element ? target.getBoundingClientRect().toJSON() : null });
      if (timing && Number.isFinite(timing.endTime) && typeof animation.startTime === "number" && !counted.has(animation)) {
        counted.add(animation);
        const end = animation.startTime + timing.endTime;
        probe.end = probe.end === null ? end : Math.max(probe.end, end);
      }
    }
    if (probe.frames.length < 240) probe.frames.push(frame);
  };
  const watch = () => {
    for (const layer of document.querySelectorAll("[data-shell-intro]")) {
      if (seen.has(layer)) continue;
      seen.add(layer);
      probe.plays += 1;
      if (probe.start === null) probe.start = document.timeline.currentTime;
      // The real story intro receives this block as shellRef. Resolve only that owner;
      // a document-global brand (for example the docs shell) is a different target.
      const scope = layer.closest("[data-shell-hydrate]");
      const shells = scope ? [...scope.querySelectorAll("[data-shell]")] : [];
      const shell = shells.length === 1 ? shells[0] : null;
      const landing = shell?.querySelector("[data-shell-brand] svg[data-logo]") ?? null;
      const owner = { scope, shell, landing, control: landing?.closest("[data-shell-brand]") ?? null };
      const until = performance.now() + 3000;
      const tick = () => {
        sample(layer, owner);
        if (performance.now() < until) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  };
  new MutationObserver(watch).observe(document, { childList: true, subtree: true });
}

const readIntroProbe = (page) => page.evaluate(() => {
  const probe = window.__tcrnShellIntroProbe;
  if (!probe) return { plays: null, properties: [], durationMs: null };
  const phases = ['fade','move','rise','done'].map((phase) => { const frames=probe.frames.filter((frame)=>frame.phase===phase); return {phase,firstFrameMs:frames[0]?.time??null,lastFrameMs:frames.at(-1)?.time??null,frameCount:frames.length}; });
  const pointerPhases = phases.map(({ phase }) => {
    const frames = probe.frames.filter((frame) => frame.phase === phase);
    const observed = frames.filter((frame) => frame.pointer?.status === "observed");
    return { phase, status: observed.length ? "observed" : "unverified", frameCount: frames.length, observedHitCount: observed.length, underlyingControlHitCount: observed.filter((frame) => frame.pointer.hitWithinUnderlyingControl === true).length, introHitCount: observed.filter((frame) => frame.pointer.hitWithinIntro === true).length };
  });
  return { plays: probe.plays, properties: probe.properties.slice(), durationMs: probe.start === null || probe.end === null ? null : Math.round(probe.end - probe.start), frames: probe.frames, animations: probe.animations, phaseWindows: phases, pointerPhases, observation: 'unmodified browser animations and rAF paint tuples with owning-target hit observations only; no pointer click delivery is measured; frame boundaries remain quantized by the actual frame interval' };
});

// intro on the real part: a fresh session plays once, a reload in the same session plays 0 times,
// prefers-reduced-motion plays 0 times. beforeReload: mutation ops applied between load and reload.
export async function probeShellIntro(browser, url, { viewport = STORY_RUN.viewports.desktop, waitMs = 1500, beforeReload = null } = {}) {
  const visit = async (options, run) => {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, ...options });
    try {
      await context.addInitScript(installIntroProbe);
      const page = await context.newPage();
      await page.goto(url, { waitUntil: "load" });
      await page.waitForTimeout(waitMs);
      return await run(page);
    } finally {
      await context.close();
    }
  };
  const session = await visit({}, async (page) => {
    const first = await readIntroProbe(page);
    if (beforeReload) await page.evaluate(applyMutationInPage, beforeReload);
    await page.reload({ waitUntil: "load" });
    await page.waitForTimeout(waitMs);
    return { first, reload: await readIntroProbe(page) };
  });
  const reduced = await visit({ reducedMotion: "reduce" }, (page) => readIntroProbe(page));
  const trace = { firstLoadPlays: session.first.plays, reloadPlays: session.reload.plays, reducedMotionPlays: reduced.plays, properties: session.first.properties, actualFrames: session.first.frames, actualAnimations: session.first.animations, phaseWindows: session.first.phaseWindows, pointerPhases: session.first.pointerPhases, reload: session.reload, reduced };
  if (typeof session.first.durationMs === "number") trace.durationMs = session.first.durationMs;
  return trace;
}

// The behaviour gates of one probe run: intro, focusLoop and the outside-click half of noCollapse.
export function judgeBehaviourTraces(traces, thresholds = THRESHOLDS) {
  const verdict = judgeBehaviour(traces, thresholds);
  return { intro: verdict.intro, focusLoop: verdict.focusLoop, noCollapse: judgeGate("noCollapse", { shells: [] }, { thresholds, traces: { outsideClick: traces && traces.outsideClick } }) };
}

// ------------------------------------------------------------------------------------- story mutations

const failureKeys = (gate) => new Set((gate && gate.failures ? gate.failures : []).map((f) => `${f.at}|${f.what}|${JSON.stringify(f.value)}`));
const failureCount = (gate) => (gate && gate.failures ? gate.failures.length : 0) + (gate && gate.moreFailures ? gate.moreFailures : 0);
const grewOn = (before, after) => {
  const known = failureKeys(before);
  return [...failureKeys(after)].filter((key) => !known.has(key));
};

// A story mutation is red on its gate when the gate fails with the mutation and, if the unmutated real
// part already fails that gate, the mutation adds a failure the unmutated run does not have.
export function judgeStoryMutation(mutation, baselineGates, mutatedGates) {
  const before = baselineGates[mutation.gate];
  const after = mutatedGates[mutation.gate];
  if (!before || !after) throw new Error("shell_story_mutation_gate_unknown:" + mutation.gate);
  const added = grewOn(before, after);
  const grew = added.length > 0 || failureCount(after) > failureCount(before);
  const red = after.status === "fail";
  const ok = red && (before.status !== "fail" || grew);
  const changedGates = Object.keys(mutatedGates).filter((id) => baselineGates[id] && (grewOn(baselineGates[id], mutatedGates[id]).length > 0 || failureCount(mutatedGates[id]) > failureCount(baselineGates[id])));
  const verdict = ok ? (before.status === "fail" ? "red on a red baseline, with a new failure" : "turns red") : red ? "not distinguishable: red baseline, no new failure" : "stays " + after.status;
  return { id: mutation.id, gate: mutation.gate, baseline: before.status, status: after.status, ok, verdict, newFailures: added.slice(0, 5), changedGates };
}

// ----------------------------------------------------------------------------------------------- stories

const NO_MOTION_CSS = "*,*::before,*::after{transition:none!important;animation:none!important}";

// The screens a story run must show, in order and in their data-state (fixture manifest, stories.screens).
// A screen with a lockup (the brand story, TCRN-DS-SUB-164) is a first line outside every shell: the
// first lines read outside the shells (optical rows with no shell) must be the listed (lockup, product)
// pairs, in order.
export function checkStoryScreens(reading, expected) {
  if (!Array.isArray(expected)) return [];
  const failures = [];
  const shellScreens = expected.filter((s) => !s.lockup);
  const lineScreens = expected.filter((s) => s.lockup);
  const ids = (reading.shells || []).map((s) => s.id);
  if (JSON.stringify(ids) !== JSON.stringify(shellScreens.map((s) => s.id))) failures.push({ what: "screens", value: ids, expect: shellScreens.map((s) => s.id) });
  for (const want of shellScreens) {
    const s = (reading.shells || []).find((item) => item.id === want.id);
    if (s && s.state !== want.state) failures.push({ what: "data-state", shell: s.id, value: s.state, expect: want.state });
  }
  if (lineScreens.length) {
    const pair = (lockup, product) => lockup + ":" + product;
    const lines = (reading.optical || []).filter((o) => !o.shell).map((o) => pair(o.kind, o.product));
    const want = lineScreens.map((s) => pair(s.lockup, s.product));
    if (JSON.stringify(lines) !== JSON.stringify(want)) failures.push({ what: "first-lines", value: lines, expect: want, screens: lineScreens.map((s) => s.id) });
  }
  return failures;
}

// Additional raw tuples for original Story premises. These supplement the fixed eighteen-gate
// verdict, without turning an unobserved native interaction or a different preview row into a pass.
export async function captureShellCriteria(page, { scope } = {}) {
  const result = { viewport: page.viewportSize(), scope, screens: [], unknowns: [] };
  result.outerDocumentation = await page.evaluate(() => {
    const host = document.querySelector('[data-doc-shell-root]'), shell = host?.querySelector('.tcrn-product-shell'), paper = shell?.querySelector('[data-paper]'), strip = shell?.querySelector('[data-shell-strip]');
    if (!shell || !paper || !strip) return { status: 'unverified', reason: 'outer documentation shell not found' };
    const sr = shell.getBoundingClientRect(), pr = paper.getBoundingClientRect(), tr = strip.getBoundingClientRect();
    return { shell: sr.toJSON(), paper: pr.toJSON(), stripHeight: tr.height, insets: { left: pr.left-sr.left, right: sr.right-pr.right, top: pr.top-sr.top, bottom: sr.bottom-pr.bottom }, radius: getComputedStyle(paper).borderRadius, residentSidebars: [...shell.querySelectorAll('aside')].filter((el) => !paper.contains(el)).length, tocRails: [...paper.querySelectorAll('.tcrn-toc-rail')].map((el) => { const r=el.getBoundingClientRect(); return { rect:r.toJSON(), insideOwnPaper:el.closest('[data-paper]')===paper, rectangleContained:r.left>=pr.left-.5&&r.right<=pr.right+.5&&r.top>=pr.top-.5&&r.bottom<=pr.bottom+.5 }; }) };
  });
  const shells = page.locator(`${scope} [data-shell]`), count = await shells.count();
  for (let index = 0; index < count; index += 1) {
    const shell = shells.nth(index), id = await shell.getAttribute('data-shell');
    const capture = { id, sameRow: null, clickGeometry: [], unknowns: [] };
    try {
      const rows = shell.locator('.tcrn-nav-item-row');
      if (await rows.count()) {
        const row = rows.filter({ has: page.locator('[data-pin-button]') }).filter({ has: page.locator('[data-shell-row]:not([data-tcrn-preview-state]):not([aria-current="page"])') }).first();
        if (await row.count() && await row.isVisible()) {
          const link = row.locator('[data-shell-row]').first();
          const read = () => row.evaluate((el) => { const text=el.querySelector('[data-text="prail"]'), pin=el.querySelector('[data-pin-button]'), pcs=pin?getComputedStyle(pin):null, link=el.querySelector('[data-shell-row]'); return {text:text?.textContent,textWidth:text?.getBoundingClientRect().width,hover:el.matches(':hover'),focusVisible:link?.matches(':focus-visible'),pin:pin?{display:pcs.display,visibility:pcs.visibility,opacity:pcs.opacity,rect:pin.getBoundingClientRect().toJSON()}:null}; });
          await row.scrollIntoViewIfNeeded(); await page.mouse.move(0,0); const rest=await read(); await row.hover(); const hover=await read();
          await page.mouse.move(0,0); await page.keyboard.press('Tab'); await link.focus(); const focus=await read(); await link.blur();
          const negativeStyle=await page.addStyleTag({content:`[data-shell="${id}"] .tcrn-nav-item-row{grid-template-columns:minmax(0,1fr) auto!important}[data-shell="${id}"] .tcrn-nav-item-row [data-pin-button]{display:none!important}[data-shell="${id}"] .tcrn-nav-item-row:hover [data-pin-button]{display:inline-flex!important}`});
          await page.mouse.move(0,0); const negativeRest=await read(); await row.hover(); const negativeHover=await read(); await negativeStyle.evaluate((el)=>el.remove()); await page.mouse.move(0,0);
          capture.sameRow={rest,hover,focus,exactWidthDifference:Math.abs(rest.textWidth-hover.textWidth),negative:{rest:negativeRest,hover:negativeHover,exactWidthDifference:Math.abs(negativeRest.textWidth-negativeHover.textWidth),source:'same row; auto-sized pin track and display:none -> inline-flex on actual hover'}};
        }
      }
    } catch (error) { capture.unknowns.push(error.message.split('\n')[0]); }
    // Exercise overflow on the actual, unchanged trail in its own paper at the current viewport.
    // A desktop viewport alone need not overflow the sample's words. A temporary narrow inline
    // allocation is a layout premise of this capture, recorded separately from the original box;
    // it changes neither strings nor the shell width, and is restored before any other reading.
    capture.breadcrumbOverflow = await shell.evaluate((shell) => {
      const paper = shell.querySelector('[data-paper]');
      return [...shell.querySelectorAll('nav.tcrn-breadcrumb')].filter((nav) => nav.closest('[data-paper]') === paper).map((nav) => {
        const labels = [...nav.querySelectorAll('.tcrn-breadcrumb__crumb')], originalStyle = nav.getAttribute('style');
        const read = () => ({ width: nav.getBoundingClientRect().width, crumbs: labels.map((el) => { const cs = getComputedStyle(el), range = document.createRange(); range.selectNodeContents(el); return { text: el.textContent, width: el.clientWidth, scrollWidth: el.scrollWidth, overflow: Math.max(0, el.scrollWidth - el.clientWidth), whiteSpace: cs.whiteSpace, clip: cs.overflowX !== 'visible', ellipsis: cs.textOverflow === 'ellipsis', title: el.getAttribute('title'), lineTops: [...new Set([...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0).map((r) => r.top))] }; }) });
        const original = read();
        const allocation = Math.max(1, Math.floor(Math.max(...labels.map((el) => el.scrollWidth), 2) / 2));
        try {
          nav.style.inlineSize = `${allocation}px`; nav.style.maxInlineSize = `${allocation}px`;
          const exercised = read();
          return { owningWidth: shell.getBoundingClientRect().width, viewport: { width: innerWidth, height: innerHeight }, original, allocation, exercised, actuallyOverflowing: exercised.crumbs.some((c) => c.overflow > 0), sameStrings: original.crumbs.every((c, i) => c.text === exercised.crumbs[i].text) };
        } finally { if (originalStyle === null) nav.removeAttribute('style'); else nav.setAttribute('style', originalStyle); }
      });
    });
    result.screens.push(capture);
  }
  // Capture every same-row baseline before Escape/click changes any other pre-opened screen.
  for (let index = 0; index < count; index += 1) {
    const shell = shells.nth(index), capture = result.screens[index], id = capture.id;
    const geometry = () => shell.evaluate((shell) => {
      const sr=shell.getBoundingClientRect(), rel=(el)=>{if(!el)return null;const r=el.getBoundingClientRect();return {left:r.left-sr.left,top:r.top-sr.top,width:r.width,height:r.height,bottom:r.bottom-sr.top,right:r.right-sr.left};};
      const tab=shell.querySelector('[data-tab]'),panel=shell.querySelector('[data-panel="expanded"],[data-panel="sheet"],[data-panel="drop"]'),pin=shell.querySelector('[data-open-pin]');
      return {owningWidth:sr.width,owningHeight:sr.height,tab:rel(tab),expanded:tab?.getAttribute('aria-expanded'),openPin:rel(pin),panel:rel(panel),panelKind:panel?.getAttribute('data-panel'),cascadeSide:panel?.closest('[data-cascade-side]')?.getAttribute('data-cascade-side')??'end',shadow:panel?getComputedStyle(panel).boxShadow:null,search:rel(panel?.querySelector('[data-shell-search]')),columns:[...shell.querySelectorAll('[data-drop-col]')].map((el)=>({index:el.getAttribute('data-drop-col'),side:el.getAttribute('data-side'),...rel(el)}))};
    });
    try {
      // Preserve the original owning dimensions; perform the triggering click before reading.
      if (/ts-closed-|^ts-m-/.test(id ?? '')) {
        const tab=shell.locator('[data-tab]').first();
        if (await tab.isVisible()) { await page.keyboard.press('Escape'); await tab.click({timeout:3000}); await page.waitForTimeout(30); capture.clickGeometry.push({trigger:'actual brand click',reading:await geometry()}); await page.keyboard.press('Escape'); }
      }
      if (/ts-drop/.test(id ?? '')) {
        await page.keyboard.press('Escape');
        const contracts=shell.locator('[data-pins] [data-pin="contracts"] .tcrn-shell-pins__item').first();
        if (await contracts.count() && await contracts.isVisible()) {
          await contracts.click({timeout:3000}); await page.waitForTimeout(30); capture.clickGeometry.push({trigger:'actual Contracts pin click',reading:await geometry()});
          // A cascade opener is the actual row button for its aria-controls column. ShellMenu
          // deliberately uses aria-expanded/aria-controls, without aria-haspopup.
          const parent=shell.locator('[data-panel="drop"] [data-shell-row][aria-controls][aria-expanded]').first();
          if (await parent.count()) {
            // A preview may already have this row open. Close it with its real handler first,
            // then click the closed row to establish the original open-by-click premise.
            if (await parent.getAttribute('aria-expanded') === 'true') { await parent.click({timeout:3000}); await page.waitForTimeout(30); capture.clickGeometry.push({trigger:'actual cascade row close before open',reading:await geometry()}); }
            await parent.click({timeout:3000}); await page.waitForTimeout(30); capture.clickGeometry.push({trigger:'actual cascade row click',reading:await geometry()});
          }
          else capture.unknowns.push('no cascade opener with aria-controls/aria-expanded found after click');
          await page.keyboard.press('Escape');
        } else capture.unknowns.push('Contracts pin unavailable in this exact owning container');
      }
    } catch (error) { capture.unknowns.push(error.message.split('\n')[0]); }
  }
  return result;
}

// The package stories with the package hooks, the behaviour probes and the story mutations.
export async function runStories({ root = process.cwd(), browser, launchOptions, thresholds = THRESHOLDS, storyIds = SHELL_STORY_IDS, staticRoot = DEFAULT_PATHS.staticRoot, manifestPath = DEFAULT_PATHS.fixtureManifest, mutationsPath = DEFAULT_PATHS.fixtureMutations, behaviour = true, mutations = true } = {}) {
  let registry;
  try {
    registry = await loadStoryRegistry({ root });
  } catch (error) {
    return { schemaVersion: SCHEMA_VERSION, mode: "stories", ok: false, error: error.code || String(error.message || error) };
  }
  const plan = readJson(resolve(root, manifestPath)).stories || {};
  const storyMutations = (readJson(resolve(root, mutationsPath)).storyMutations || []).filter((m) => storyIds.includes(m.story));
  const { routes, missing } = resolveStoryRoutes(storyIds, registry);
  const routeOf = new Map(routes.map((route) => [route.id, route]));
  const staticDir = resolve(root, staticRoot);
  if (!existsSync(staticDir)) return { schemaVersion: SCHEMA_VERSION, mode: "stories", ok: false, error: "static_docs_missing:" + staticRoot, missing };
  const logoSources = loadLogoSources(root);
  const server = await startStaticServer(staticDir);
  try {
    return await withBrowser(browser, launchOptions, async (active) => {
      const context = await active.newContext({ viewport: STORY_RUN.viewports.desktop, deviceScaleFactor: 1 });
      try {
        const brandPage = await openBoardPage(context, root, DEFAULT_PATHS.brandBoard);
        const brandLockups = await readBrandLockups(brandPage);
        await brandPage.close();
        const viewportOf = (id) => STORY_RUN.viewports[STORY_RUN.storyViewport[id] || "desktop"];
        // shortcut: the screen that alone registers ⌘K on the page (shell-shortcut=<screen>, TCRN-DS-SUB-179): the
        // shell story screens leave the key alone by default and the documentation shell leaves it to that screen.
        const openStory = async (route, { locale, theme, ops = null, shortcut = null }) => {
          const page = await context.newPage();
          try {
            await page.setViewportSize(viewportOf(route.id));
            const url = new URL(storyUrl(server.origin, route, { theme, locale }));
            if (shortcut) url.searchParams.set(SHELL_SHORTCUT_PARAMETER, shortcut);
            await page.goto(url.href, { waitUntil: "load" });
            await expandStory(page, route.id);
            await page.addStyleTag({ content: NO_MOTION_CSS });
            await settlePage(page);
            if (ops) {
              await page.evaluate(applyMutationInPage, ops);
              await settlePage(page);
            }
            return page;
          } catch (error) {
            await page.close();
            throw error;
          }
        };
        const measureStory = async (route, options) => {
          const page = await openStory(route, options);
          try {
            const reading = await measureShellPage(page, { selectors: PACKAGE_SELECTORS, selectorSet: "package", root: route.bodySelector, logoSources });
            const criterionCaptures = options.ops ? null : await captureShellCriteria(page, { scope: route.bodySelector });
            return { reading, criterionCaptures, verdict: judgeShellReadings(reading, { thresholds, brandLockups, compareDescription: options.locale === "zh-CN" }) };
          } finally {
            await page.close();
          }
        };

        const runs = [];
        for (const route of routes) {
          for (const locale of STORY_RUN.locales) {
            for (const theme of STORY_RUN.themes) {
              const { reading, criterionCaptures, verdict } = await measureStory(route, { locale, theme });
              const screenFailures = checkStoryScreens(reading, (plan.screens || {})[route.id]);
              // the first lines outside every shell (the brand story) with their markText readings
              const firstLines = (reading.optical || []).filter((o) => !o.shell).map((o) => ({ kind: o.kind, product: o.product, mark: o.mark, inkMinusMark: o.inkMinusMark }));
              // Keep the measured values as well as the verdict, including values that pass.
              runs.push({ story: route.id, locale, theme, viewport: viewportOf(route.id), shells: reading.shells.map((s) => s.id), reading, criterionCaptures, ...(firstLines.length ? { firstLines } : {}), gates: verdict.gates, checks: verdict.checks, failed: verdict.failed, failedChecks: verdict.failedChecks, missingHooks: verdict.missingHooks, screenFailures });
            }
          }
        }

        const probes = plan.behaviour || {};
        const probeLoop = async (locale, ops) => {
          const route = probes.focusLoop && routeOf.get(probes.focusLoop.story);
          if (!route) return { trace: null, notes: ["focus-loop story not in this run"] };
          const page = await openStory(route, { locale, theme: "light", ops, shortcut: probes.focusLoop.screen });
          try {
            return await probeShellBehaviour(page, { scope: route.bodySelector, screen: probes.focusLoop.screen, cascadeScreen: probes.focusLoop.cascadeScreen, waitMs: probes.waitMs });
          } finally {
            await page.close();
          }
        };
        const probeIntro = async (locale, beforeReload) => {
          const route = probes.intro && routeOf.get(probes.intro.story);
          if (!route) return null;
          return probeShellIntro(active, storyUrl(server.origin, route, { theme: "light", locale }), { viewport: viewportOf(route.id), waitMs: probes.intro.waitMs, beforeReload });
        };
        const behaviourRuns = [];
        if (behaviour) {
          for (const locale of STORY_RUN.locales) {
            const loop = await probeLoop(locale, null);
            const traces = { ...(loop.trace || {}) };
            const intro = await probeIntro(locale, null);
            if (intro) traces.intro = intro;
            behaviourRuns.push({ locale, traces, notes: loop.notes, gates: judgeBehaviourTraces(traces, thresholds) });
          }
        }

        const mutationResults = [];
        if (mutations) {
          for (const mutation of storyMutations) {
            const route = routeOf.get(mutation.story);
            // a story the registry does not have yet (reported under missing) cannot be mutated
            if (!route) {
              mutationResults.push({ id: mutation.id, gate: mutation.gate, ok: false, verdict: "not run: story missing", story: mutation.story, source: mutation.source });
              continue;
            }
            const locale = mutation.locale || STORY_RUN.locales[0];
            const theme = mutation.theme || "light";
            let result;
            if (mutation.probe) {
              const base = behaviourRuns.find((run) => run.locale === locale);
              if (!base) {
                mutationResults.push({ id: mutation.id, gate: mutation.gate, ok: false, verdict: "not run: behaviour probes off" });
                continue;
              }
              const traces = { ...base.traces };
              if (mutation.probe === "intro") traces.intro = await probeIntro(locale, mutation.beforeReload || null);
              else Object.assign(traces, (await probeLoop(locale, mutation.ops || null)).trace || {});
              result = judgeStoryMutation(mutation, base.gates, judgeBehaviourTraces(traces, thresholds));
            } else {
              const base = runs.find((run) => run.story === mutation.story && run.locale === locale && run.theme === theme);
              const { verdict } = await measureStory(route, { locale, theme, ops: mutation.ops });
              result = judgeStoryMutation(mutation, { ...base.gates, ...base.checks }, { ...verdict.gates, ...verdict.checks });
            }
            mutationResults.push({ ...result, story: mutation.story, source: mutation.source });
          }
        }

        const gates = {};
        for (const id of GATE_IDS) {
          const statuses = BEHAVIOUR_GATE_IDS.includes(id) ? behaviourRuns.map((run) => run.gates[id].status) : runs.map((run) => run.gates[id].status);
          if (id === "noCollapse") statuses.push(...behaviourRuns.map((run) => run.gates.noCollapse.status));
          gates[id] = combine(statuses);
        }
        const checks = {};
        for (const id of CHECK_IDS) checks[id] = combine(runs.map((run) => run.checks[id].status));
        const everyGateMutated = [...GATE_IDS, ...CHECK_IDS].every((id) => storyMutations.some((m) => m.gate === id));
        return {
          schemaVersion: SCHEMA_VERSION,
          readingSchemaVersion: SHELL_MEASURE_SCHEMA_VERSION,
          mode: "stories",
          ok: missing.length === 0 && runs.length > 0 && GATE_IDS.every((id) => gates[id] === "pass") && CHECK_IDS.every((id) => checks[id] === "pass") && runs.every((run) => run.missingHooks.length === 0 && run.screenFailures.length === 0) && (!mutations || (everyGateMutated && mutationResults.every((m) => m.ok))),
          missing,
          viewports: STORY_RUN.viewports,
          gates,
          checks,
          runs,
          behaviour: behaviourRuns,
          mutations: mutationResults,
          dSection: D_SECTION_ROWS.map((row) => ({ row: row.row, gates: row.gates, status: combine(row.gates.map((id) => gates[id])) }))
        };
      } finally {
        await context.close();
      }
    });
  } finally {
    await server.close();
  }
}

// ---------------------------------------------------------------------------------------------------- CLI

export function parseArgs(argv) {
  const args = { fixtures: false, stories: [], writeReport: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--fixtures") args.fixtures = true;
    else if (arg === "--story") args.stories.push(argv[++i]);
    else if (arg === "--write-report") args.writeReport = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : DEFAULT_PATHS.reportPath;
    else throw new Error("shell_measure_proof_unknown_argument:" + arg);
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = args.fixtures ? await runFixtures() : await runStories(args.stories.length ? { storyIds: args.stories } : {});
  if (args.writeReport) {
    const target = resolve(args.writeReport);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, JSON.stringify(report, null, 2) + "\n");
  }
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  process.exitCode = report.ok ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(String(error && error.stack ? error.stack : error) + "\n");
    process.exitCode = 1;
  });
}

