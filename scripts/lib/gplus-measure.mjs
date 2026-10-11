// SPDX-License-Identifier: Apache-2.0
// G+ DOM measurements (TCRN-DS-STORY-131, TCRN-DS-SUB-034).
//
// A port of docs/design/gplus-2026-10/measure.js — the in-browser script every G+ canvas board passed
// at delivery — into a library that browser gates can share. The eight measurements and the overlap
// check keep the canvas semantics; the differences are listed next to each check:
//
//   clip           elements whose box exceeds their nearest clipping ancestor (inside the root)
//   singleLine     line boxes of elements declared single-line (nowrap on text tags, or [data-line])
//   shadowBlur     the largest box-shadow blur radius (elements and their ::before / ::after)
//   rail           rail guide column inside each [data-shell]: [data-guide="rail"] and [data-text="rail"]
//   rowAlign       first-cell text start of every row of a table / ARIA grid / [data-rows] list
//   mark           <mark> must not change typesetting (no padding, same font metrics as its parent)
//   contrast       contrast of every [data-cell] sample against its data-expect value
//   controlHeight  rendered height of [data-h] controls (and of controlSelector matches)
//   overlap        in-flow siblings of a grid / flex container must not intersect (descendants included)
//
// Thresholds are NOT defined here. The gate (scripts/geometry-measure-proof.mjs) owns them and passes
// them in; measureInPage, measurePage, judgeMeasurements and runMeasureTargets all require them.
//
// API (settled by SUB-034; later Subtasks reuse it read-only and record needed changes as problems):
//   MEASURE_SCHEMA_VERSION, CHECK_IDS, THRESHOLD_KEYS, DEFAULT_MEASURE_OPTIONS
//   assertThresholds(thresholds)
//   measureInPage(options)           browser-side, self-contained; pass it to page.evaluate
//   judgeMeasurements(raw, thresholds)  pure Node-side verdict: { ok, failed, notApplicable, checks }
//   measurePage(page, options)       page.evaluate(measureInPage, options)
//   settlePage(page, { networkIdle }) network idle (optional), fonts ready, two animation frames
//   startStaticServer(staticRoot)    { origin, close } static file server for built docs
//   runMeasureTargets({ targets, thresholds, browser, viewport, launchOptions })
//   parseColor, compositeOver, relativeLuminance, contrastRatio, expectedContrast  (Node color math)

export const MEASURE_SCHEMA_VERSION = "tcrn.ds.gplus-measure.v1";

export const CHECK_IDS = Object.freeze([
  "clip",
  "singleLine",
  "shadowBlur",
  "rail",
  "rowAlign",
  "mark",
  "contrast",
  "controlHeight",
  "overlap"
]);

// Every threshold the measurements read. The gate must supply each key as a finite number
// (controlHeight.allowedPx: a non-empty array of finite numbers).
export const THRESHOLD_KEYS = Object.freeze({
  clip: Object.freeze(["maxLeaks", "tolerancePx"]),
  singleLine: Object.freeze(["maxLines"]),
  shadowBlur: Object.freeze(["maxBlurPx"]),
  rail: Object.freeze(["guideLeftPx", "textLeftPx", "tolerancePx"]),
  rowAlign: Object.freeze(["maxSpreadPx"]),
  mark: Object.freeze(["maxViolations"]),
  contrast: Object.freeze(["maxDiff", "minText", "minNonText"]),
  controlHeight: Object.freeze(["allowedPx", "tolerancePx"]),
  overlap: Object.freeze(["maxOverlaps", "minIntersectPx"])
});

// Markup conventions (selectors), not thresholds. measureInPage applies the same values when an
// option is omitted.
export const DEFAULT_MEASURE_OPTIONS = Object.freeze({
  root: "body",
  sampleLimit: 25,
  exemptSelector: ".sr, .grain, .tcrn-sr-only",
  singleLineTags: Object.freeze(["a", "b", "span", "td", "th", "button", "label", "h1", "h2", "h3", "h4", "h5", "h6", "small", "kbd", "code", "p"]),
  shellSelector: "[data-shell]",
  markSelector: "mark",
  rowsSelector: "[data-rows]",
  controlSelector: null
});

export function assertThresholds(thresholds) {
  if (!thresholds || typeof thresholds !== "object") throw new TypeError("gplus_measure_thresholds_required");
  for (const [check, keys] of Object.entries(THRESHOLD_KEYS)) {
    const group = thresholds[check];
    if (!group || typeof group !== "object") throw new TypeError(`gplus_measure_threshold_invalid:${check}`);
    for (const key of keys) {
      const value = group[key];
      const valid = key === "allowedPx"
        ? Array.isArray(value) && value.length > 0 && value.every((item) => Number.isFinite(item))
        : Number.isFinite(value);
      if (!valid) throw new TypeError(`gplus_measure_threshold_invalid:${check}.${key}`);
    }
  }
  return thresholds;
}

// Browser side. Playwright serialises this function with toString(), so it must not reference
// anything outside its own body. Returns { schemaVersion, root, rootBox, viewport, checks } where each
// measured check is { checked, value, violationCount, violations, ...details }.
export function measureInPage(options) {
  const opts = options || {};
  const T = opts.thresholds;
  if (!T || typeof T !== "object") throw new Error("gplus_measure_thresholds_required");
  const schemaVersion = "tcrn.ds.gplus-measure.v1";
  const rootSelector = opts.root || "body";
  const root = document.querySelector(rootSelector);
  if (!root) return { schemaVersion, error: "root_not_found", root: rootSelector, checks: {} };

  const ALL = ["clip", "singleLine", "shadowBlur", "rail", "rowAlign", "mark", "contrast", "controlHeight", "overlap"];
  const wanted = new Set(Array.isArray(opts.checks) && opts.checks.length ? opts.checks : ALL);
  const limit = Number.isFinite(opts.sampleLimit) ? opts.sampleLimit : 25;
  const exemptSelector = opts.exemptSelector === undefined ? ".sr, .grain, .tcrn-sr-only" : opts.exemptSelector;
  const tagList = opts.singleLineTags || ["a", "b", "span", "td", "th", "button", "label", "h1", "h2", "h3", "h4", "h5", "h6", "small", "kbd", "code", "p"];
  const singleLineTag = new RegExp(`^(${tagList.join("|")})$`, "i");
  const shellSelector = opts.shellSelector || "[data-shell]";
  const markSelector = opts.markSelector || "mark";
  const rowsSelector = opts.rowsSelector || "[data-rows]";
  const controlSelector = opts.controlSelector || null;

  const round1 = (v) => Math.round(v * 10) / 10;
  const round2 = (v) => Math.round(v * 100) / 100;
  const styleOf = (el, pseudo) => getComputedStyle(el, pseudo || null);
  const tagOf = (el) => el.tagName.toLowerCase();
  const describe = (el) => {
    let d = tagOf(el);
    if (el.id) d += `#${el.id}`;
    const cls = (el.getAttribute("class") || "").trim();
    if (cls) d += `.${cls.split(/\s+/).join(".")}`;
    for (const attr of ["data-cell", "data-h", "data-shell", "data-guide", "data-text", "data-rows"]) {
      if (el.hasAttribute(attr)) d += `[${attr}${el.getAttribute(attr) ? `=${el.getAttribute(attr)}` : ""}]`;
    }
    return d.length > 96 ? `${d.slice(0, 93)}...` : d;
  };
  const textOf = (el) => (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40);
  const skipped = (el, check) => Boolean(el.closest(`[data-measure-skip~="${check}"]`));
  const exempt = (el) => Boolean(exemptSelector && el.closest(exemptSelector));
  const inSvg = (el) => tagOf(el) !== "svg" && Boolean(el.parentElement && el.parentElement.closest("svg"));
  const rendered = (el) => el.getClientRects().length > 0;
  const scope = (selector) => [...(root.matches(selector) ? [root] : []), ...root.querySelectorAll(selector)];
  const elements = [root, ...root.querySelectorAll("*")].filter((el) => !inSvg(el));
  const sample = (list, item) => { if (list.length < limit) list.push(item); };

  // colour math (same formulas as the canvas script)
  let ctx = null;
  const parseColor = (input) => {
    const v = String(input || "").trim();
    if (!v || v === "transparent" || v === "none") return [0, 0, 0, 0];
    const channel = (t, scale) => (t.endsWith("%") ? parseFloat(t) * 2.55 : parseFloat(t) * scale);
    const alpha = (t) => (t === undefined ? 1 : t.endsWith("%") ? parseFloat(t) / 100 : parseFloat(t));
    let m = v.match(/^rgba?\(([^)]*)\)$/i);
    if (m) {
      const p = m[1].split(/[\s,/]+/).filter(Boolean);
      return [channel(p[0], 1), channel(p[1], 1), channel(p[2], 1), alpha(p[3])];
    }
    m = v.match(/^color\(srgb\s+([^)]*)\)$/i);
    if (m) {
      const p = m[1].split(/[\s/]+/).filter(Boolean);
      return [channel(p[0], 255), channel(p[1], 255), channel(p[2], 255), alpha(p[3])];
    }
    if (!ctx) ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  };
  const over = (t, b) => {
    const a = t[3];
    return [t[0] * a + b[0] * (1 - a), t[1] * a + b[1] * (1 - a), t[2] * a + b[2] * (1 - a), 1];
  };
  const lin = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const contrast = (a, b) => {
    const l1 = lum(a);
    const l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  // background colours composited from the nearest opaque ancestor (the page root included) down
  const effBg = (el) => {
    const stack = [];
    for (let node = el; node; node = node.parentElement) {
      const c = parseColor(styleOf(node).backgroundColor);
      if (c[3] > 0) stack.unshift(c);
      if (c[3] >= 1) break;
    }
    let acc = [255, 255, 255, 1];
    for (const c of stack) acc = over(c, acc);
    return acc;
  };
  // computed box-shadow -> layers { color, inset, x, y, blur, spread, raw }
  const shadowLayers = (value) => {
    if (!value || value === "none") return [];
    return value.split(/,(?![^(]*\))/).map((part) => {
      const color = (part.match(/[a-z-]+\([^)]*\)/i) || [null])[0];
      const nums = part.replace(/[a-z-]+\([^)]*\)/gi, " ").split(/\s+/).filter((t) => /^-?[\d.]+px$/.test(t)).map(parseFloat);
      return { color, inset: /\binset\b/.test(part), x: nums[0] || 0, y: nums[1] || 0, blur: nums[2] || 0, spread: nums[3] || 0, raw: part.trim() };
    });
  };
  const clipsAxis = (v) => v !== "visible";
  const clips = (cs) => clipsAxis(cs.overflowX) || clipsAxis(cs.overflowY);
  const scrolls = (v) => v === "auto" || v === "scroll";

  const checks = {};

  // 1. clip — any element whose box exceeds its nearest clipping ancestor by more than tolerancePx.
  // Differences from the canvas: the ancestor search stops at the root; an absolutely positioned
  // element is only clipped by its containing block and the ancestors above it; on an auto/scroll
  // axis the far edge is reachable by scrolling, so only the start edge counts (the canvas comment
  // asked for this allowance); visually hidden helpers (clip-path inset(50%), clip rect(0 0 0 0)) are
  // skipped like the canvas skipped .sr.
  if (wanted.has("clip")) {
    const makesContainingBlock = (cs) => cs.position !== "static"
      || cs.transform !== "none"
      || cs.perspective !== "none"
      || cs.filter !== "none"
      || (cs.backdropFilter && cs.backdropFilter !== "none")
      || /\b(paint|layout|strict|content)\b/.test(cs.contain || "")
      || (cs.containerType && cs.containerType !== "normal")
      || /\b(transform|perspective|filter)\b/.test(cs.willChange || "");
    const clipAncestor = (el, cs) => {
      if (cs.position === "fixed") return null;
      let escaping = cs.position === "absolute";
      for (let node = el.parentElement; node; node = node.parentElement) {
        const ncs = styleOf(node);
        if (escaping && makesContainingBlock(ncs)) escaping = false;
        if (!escaping && clips(ncs)) return { node, cs: ncs };
        if (node === root || ncs.position === "fixed") return null;
        if (ncs.position === "absolute") escaping = true;
      }
      return null;
    };
    const visuallyHidden = (cs) => /inset\(\s*50%/.test(cs.clipPath || "")
      || (Boolean(cs.clip) && cs.clip !== "auto" && /rect\(\s*0(px)?[\s,]+0(px)?[\s,]+0(px)?[\s,]+0(px)?\s*\)/.test(cs.clip));
    const violations = [];
    let checked = 0;
    let count = 0;
    let worst = 0;
    for (const el of elements) {
      if (el === root) continue;
      const cs = styleOf(el);
      if (cs.display === "none" || cs.visibility === "hidden" || cs.position === "fixed") continue;
      if (skipped(el, "clip") || exempt(el) || visuallyHidden(cs)) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const anc = clipAncestor(el, cs);
      if (!anc) continue;
      checked++;
      const a = anc.node.getBoundingClientRect();
      const parts = [];
      if (clipsAxis(anc.cs.overflowX)) {
        parts.push(a.left - r.left - (scrolls(anc.cs.overflowX) ? anc.node.scrollLeft : 0));
        if (!scrolls(anc.cs.overflowX)) parts.push(r.right - a.right);
      }
      if (clipsAxis(anc.cs.overflowY)) {
        parts.push(a.top - r.top - (scrolls(anc.cs.overflowY) ? anc.node.scrollTop : 0));
        if (!scrolls(anc.cs.overflowY)) parts.push(r.bottom - a.bottom);
      }
      const d = parts.length ? Math.max(...parts) : 0;
      if (d > T.clip.tolerancePx) {
        count++;
        worst = Math.max(worst, d);
        sample(violations, { element: describe(el), ancestor: describe(anc.node), byPx: round1(d), text: textOf(el) });
      }
    }
    checks.clip = { checked, value: count, worstPx: round1(worst), violationCount: count, violations };
  }

  // 2. singleLine — elements declared single-line must render one line box. The canvas divided the
  // content height by line-height (which misreads line-height: normal); this counts line boxes
  // directly: text-fragment rects are clustered by vertical centre.
  if (wanted.has("singleLine")) {
    const blockish = /^(block|flex|grid|inline-flex|inline-grid|table|flow-root|list-item)$/;
    const countLines = (rects) => {
      const sorted = rects.map((q) => ({ c: (q.top + q.bottom) / 2, h: q.bottom - q.top })).sort((x, y) => x.c - y.c);
      let lines = 0;
      let ref = null;
      for (const q of sorted) {
        if (!ref || q.c - ref.c > 0.5 * Math.min(ref.h, q.h)) {
          lines++;
          ref = q;
        }
      }
      return lines;
    };
    const violations = [];
    let checked = 0;
    let count = 0;
    let maxLines = 0;
    for (const el of elements) {
      const cs = styleOf(el);
      const declared = el.hasAttribute("data-line") || (cs.whiteSpace === "nowrap" && singleLineTag.test(tagOf(el)));
      if (!declared || skipped(el, "singleLine") || cs.display === "none") continue;
      if (el.getBoundingClientRect().height === 0) continue;
      if ([...el.children].some((c) => blockish.test(styleOf(c).display))) continue;
      const rects = [];
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      for (let t = walker.nextNode(); t; t = walker.nextNode()) {
        if (!t.data.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(t);
        for (const q of range.getClientRects()) if (q.width > 0 && q.height > 0) rects.push(q);
      }
      if (!rects.length) continue;
      checked++;
      const lines = countLines(rects);
      maxLines = Math.max(maxLines, lines);
      if (lines > T.singleLine.maxLines) {
        count++;
        sample(violations, { element: describe(el), lines, text: textOf(el) });
      }
    }
    checks.singleLine = { checked, value: maxLines, violationCount: count, violations };
  }

  // 3. shadowBlur — the largest blur radius of any box-shadow layer. The canvas read elements only;
  // ::before and ::after shadows are read too.
  if (wanted.has("shadowBlur")) {
    const violations = [];
    let checked = 0;
    let count = 0;
    let maxBlur = 0;
    let maxElement = null;
    for (const el of elements) {
      if (skipped(el, "shadowBlur") || !rendered(el)) continue;
      for (const pseudo of [null, "::before", "::after"]) {
        const cs = styleOf(el, pseudo);
        if (pseudo && (cs.content === "none" || cs.content === "normal")) continue;
        if (cs.display === "none") continue;
        const layers = shadowLayers(cs.boxShadow);
        if (!layers.length) continue;
        checked++;
        for (const layer of layers) {
          const where = describe(el) + (pseudo || "");
          if (maxElement === null || layer.blur > maxBlur) {
            maxBlur = Math.max(maxBlur, layer.blur);
            maxElement = where;
          }
          if (layer.blur > T.shadowBlur.maxBlurPx) {
            count++;
            sample(violations, { element: where, blurPx: layer.blur, shadow: layer.raw });
          }
        }
      }
    }
    checks.shadowBlur = { checked, value: maxBlur, element: maxElement, violationCount: count, violations };
  }

  // 4. rail — inside each shell, [data-guide="rail"] (icons, marks, avatars) start at guideLeftPx and
  // [data-text="rail"] at textLeftPx, measured from the shell's left edge. A shell without either
  // hook cannot be verified and counts as a violation.
  if (wanted.has("rail")) {
    const shells = scope(shellSelector).filter((s) => !skipped(s, "rail") && rendered(s));
    const rows = [];
    let count = 0;
    let worst = 0;
    for (const shell of shells) {
      const s = shell.getBoundingClientRect();
      const own = (selector) => [...shell.querySelectorAll(selector)].filter((g) => g.closest(shellSelector) === shell && rendered(g) && !skipped(g, "rail"));
      const lefts = (list) => [...new Set(list.map((g) => round1(g.getBoundingClientRect().left - s.left)))];
      const guideLefts = lefts(own('[data-guide="rail"]'));
      const textLefts = lefts(own('[data-text="rail"]'));
      const deviations = [
        ...guideLefts.map((v) => Math.abs(v - T.rail.guideLeftPx)),
        ...textLefts.map((v) => Math.abs(v - T.rail.textLeftPx))
      ];
      const deviation = round1(deviations.length ? Math.max(...deviations) : 0);
      const missingHooks = !guideLefts.length && !textLefts.length;
      worst = Math.max(worst, deviation);
      const row = { shell: shell.getAttribute("data-shell") || describe(shell), guideLefts, textLefts, maxDeviationPx: deviation, missingHooks };
      if (missingHooks || deviation > T.rail.tolerancePx) count++;
      rows.push(row);
    }
    const violations = rows.filter((row) => row.missingHooks || row.maxDeviationPx > T.rail.tolerancePx).slice(0, limit);
    checks.rail = { checked: shells.length, value: round1(worst), violationCount: count, violations, shells: rows.slice(0, limit) };
  }

  // 5. rowAlign — the first cell's content must start at the same x on every row of a table (header
  // included), of an ARIA table/grid, and of every [data-rows] child. The canvas walked every tr
  // under a table (nested tables included); this reads table.rows.
  if (wanted.has("rowAlign")) {
    const contentLeft = (cell) => {
      const range = document.createRange();
      range.selectNodeContents(cell);
      const rs = [...range.getClientRects()].filter((q) => q.width > 0 && q.height > 0);
      return rs.length ? Math.min(...rs.map((q) => q.left)) : null;
    };
    const groups = [];
    const addGroup = (kind, box, cells) => {
      if (skipped(box, "rowAlign") || !rendered(box)) return;
      const lefts = cells.filter((c) => c && !skipped(c, "rowAlign")).map(contentLeft).filter((v) => v !== null).map(round1);
      if (lefts.length < 2) return;
      groups.push({ kind, group: describe(box), rows: lefts.length, lefts: [...new Set(lefts)], spreadPx: round1(Math.max(...lefts) - Math.min(...lefts)) });
    };
    for (const table of scope("table")) addGroup("table", table, [...table.rows].map((row) => row.cells[0]));
    const roleSelector = '[role="table"],[role="grid"],[role="treegrid"]';
    const cellRole = /^(cell|gridcell|columnheader|rowheader)$/;
    for (const grid of scope(roleSelector)) {
      if (tagOf(grid) === "table") continue;
      const rowsOf = [...grid.querySelectorAll('[role="row"]')].filter((row) => row.closest(roleSelector) === grid);
      addGroup("grid", grid, rowsOf.map((row) => [...row.children].find((c) => cellRole.test(c.getAttribute("role") || ""))));
    }
    for (const box of scope(rowsSelector)) addGroup("rows", box, [...box.children]);
    const bad = groups.filter((g) => g.spreadPx > T.rowAlign.maxSpreadPx);
    const worst = groups.reduce((m, g) => Math.max(m, g.spreadPx), 0);
    checks.rowAlign = { checked: groups.length, value: round1(worst), violationCount: bad.length, violations: bad.slice(0, limit), groups: groups.slice(0, limit) };
  }

  // 6. mark — a highlight changes colour only. The canvas compared horizontal padding and margin,
  // font-weight, font-size and letter-spacing with the parent; this also reads vertical padding,
  // horizontal borders, font-family, font-style, word-spacing, line-height, display and vertical-align.
  if (wanted.has("mark")) {
    const props = ["fontSize", "fontWeight", "fontFamily", "fontStyle", "letterSpacing", "wordSpacing", "lineHeight"];
    const kebab = (p) => p.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
    const marks = scope(markSelector).filter((m) => m.parentElement && !skipped(m, "mark") && rendered(m));
    const violations = [];
    let count = 0;
    for (const m of marks) {
      const cs = styleOf(m);
      const ps = styleOf(m.parentElement);
      const diffs = [];
      for (const side of ["Top", "Right", "Bottom", "Left"]) if (parseFloat(cs[`padding${side}`]) !== 0) diffs.push(`padding-${side.toLowerCase()}`);
      for (const side of ["Right", "Left"]) {
        if (parseFloat(cs[`margin${side}`]) !== 0) diffs.push(`margin-${side.toLowerCase()}`);
        if (parseFloat(cs[`border${side}Width`]) !== 0 && cs[`border${side}Style`] !== "none") diffs.push(`border-${side.toLowerCase()}`);
      }
      for (const p of props) if (cs[p] !== ps[p]) diffs.push(kebab(p));
      if (cs.display !== "inline") diffs.push("display");
      if (cs.verticalAlign !== "baseline") diffs.push("vertical-align");
      if (diffs.length) {
        count++;
        sample(violations, { element: describe(m), properties: diffs, text: textOf(m) });
      }
    }
    checks.mark = { checked: marks.length, value: count, violationCount: count, violations };
  }

  // 7. contrast — every [data-cell] sample: ink = computed colour (or the data-probe source), fill =
  // effective background; translucent layers are composited first. data-kind="text" (default) needs
  // minText, any other kind minNonText, unless data-exempt. A cell must carry data-expect; an unknown
  // data-probe is reported rather than silently measured as text colour.
  if (wanted.has("contrast")) {
    const outlineColor = (value) => {
      for (const layer of shadowLayers(value)) if (layer.color && layer.blur === 0 && layer.spread >= 1) return parseColor(layer.color);
      return null;
    };
    const probes = {
      "": (el, cs) => parseColor(cs.color),
      color: (el, cs) => parseColor(cs.color),
      ph: (el) => parseColor(styleOf(el, "::placeholder").color),
      shadow: (el, cs) => outlineColor(cs.boxShadow) || parseColor(cs.color),
      border: (el, cs) => parseColor(cs.borderBottomColor),
      "after-border": (el) => parseColor(styleOf(el, "::after").borderBottomColor),
      "after-shadow": (el, cs) => outlineColor(styleOf(el, "::after").boxShadow) || parseColor(cs.color),
      "after-bg": (el) => parseColor(styleOf(el, "::after").backgroundColor)
    };
    const cells = [];
    let count = 0;
    let worst = null;
    for (const el of scope("[data-cell]")) {
      if (skipped(el, "contrast")) continue;
      const cs = styleOf(el);
      const probe = el.getAttribute("data-probe") || "";
      const kind = el.getAttribute("data-kind") || "text";
      const isExempt = el.hasAttribute("data-exempt");
      const expectAttr = el.getAttribute("data-expect");
      const expected = expectAttr === null || expectAttr.trim() === "" ? null : Number(expectAttr);
      const row = { cell: el.getAttribute("data-cell"), probe: probe || "color", kind, exempt: isExempt, ratio: null, expect: expected, diff: null, reasons: [] };
      const reader = Object.prototype.hasOwnProperty.call(probes, probe) ? probes[probe] : null;
      if (!reader) row.reasons.push("unknown_probe");
      else {
        const fill = effBg(el);
        const ink = over(reader(el, cs), fill);
        row.ratio = round2(contrast(ink, fill));
        if (expected === null || !Number.isFinite(expected)) row.reasons.push("missing_expect");
        else {
          row.diff = round2(row.ratio - expected);
          worst = Math.max(worst ?? 0, Math.abs(row.diff));
          if (Math.abs(row.diff) > T.contrast.maxDiff + 1e-9) row.reasons.push("diff");
        }
        const min = kind === "text" ? T.contrast.minText : T.contrast.minNonText;
        if (!isExempt && row.ratio < min) row.reasons.push("below_minimum");
      }
      if (row.reasons.length) count++;
      cells.push(row);
    }
    checks.contrast = {
      checked: cells.length,
      value: worst === null ? null : round2(worst),
      violationCount: count,
      violations: cells.filter((c) => c.reasons.length).slice(0, limit),
      cells: cells.slice(0, Math.max(limit, 200))
    };
  }

  // 8. controlHeight — [data-h] declares the expected height; it must match within tolerancePx and be
  // one of allowedPx. Elements matched by controlSelector without data-h must land on an allowed
  // height. Elements that are not rendered are skipped.
  if (wanted.has("controlHeight")) {
    const allowed = T.controlHeight.allowedPx;
    const tolerance = T.controlHeight.tolerancePx;
    const targets = new Set([...scope("[data-h]"), ...(controlSelector ? scope(controlSelector) : [])]);
    const controls = [];
    let count = 0;
    let worst = 0;
    for (const el of targets) {
      if (skipped(el, "controlHeight") || !rendered(el)) continue;
      const height = round1(el.getBoundingClientRect().height);
      const attr = el.getAttribute("data-h");
      const declared = attr === null || attr.trim() === "" ? null : Number(attr);
      const row = { element: describe(el), heightPx: height, declaredPx: declared, deviationPx: 0, reasons: [] };
      if (declared !== null) {
        row.deviationPx = round1(Math.abs(height - declared));
        if (!Number.isFinite(declared) || row.deviationPx > tolerance) row.reasons.push("mismatch");
        if (!allowed.includes(declared)) row.reasons.push("declared_not_allowed");
      } else {
        const nearest = allowed.reduce((best, a) => (Math.abs(height - a) < Math.abs(height - best) ? a : best), allowed[0]);
        row.nearestPx = nearest;
        row.deviationPx = round1(Math.abs(height - nearest));
        if (row.deviationPx > tolerance) row.reasons.push("not_allowed");
      }
      worst = Math.max(worst, Number.isFinite(row.deviationPx) ? row.deviationPx : 0);
      if (row.reasons.length) count++;
      controls.push(row);
    }
    checks.controlHeight = {
      checked: controls.length,
      value: round1(worst),
      violationCount: count,
      violations: controls.filter((c) => c.reasons.length).slice(0, limit),
      controls: controls.slice(0, Math.max(limit, 200))
    };
  }

  // 9. overlap — in-flow items of every grid / flex container (the root included) must not
  // intersect by more than minIntersectPx on both axes; each item's box is the union of its own box
  // and its in-flow descendants. Differences from the canvas: display: contents children are
  // flattened into items, an empty union does not start at the origin, and subtrees of absolute /
  // fixed / clipping descendants are not added (they cannot paint into a sibling's area).
  if (wanted.has("overlap")) {
    const min = T.overlap.minIntersectPx;
    const flowItems = (box) => {
      const items = [];
      const visit = (parent) => {
        for (const child of parent.children) {
          const cs = styleOf(child);
          if (cs.display === "contents") { visit(child); continue; }
          if (cs.display === "none" || cs.position === "absolute" || cs.position === "fixed") continue;
          items.push(child);
        }
      };
      visit(box);
      return items;
    };
    const unionBox = (el) => {
      let L = Infinity;
      let Tp = Infinity;
      let R = -Infinity;
      let B = -Infinity;
      const add = (q) => {
        if (q.width === 0 || q.height === 0) return;
        L = Math.min(L, q.left);
        Tp = Math.min(Tp, q.top);
        R = Math.max(R, q.right);
        B = Math.max(B, q.bottom);
      };
      const walk = (node) => {
        for (const child of node.children) {
          const cs = styleOf(child);
          if (cs.display === "none" || cs.position === "absolute" || cs.position === "fixed") continue;
          add(child.getBoundingClientRect());
          if (tagOf(child) !== "svg" && !clips(cs)) walk(child);
        }
      };
      add(el.getBoundingClientRect());
      if (tagOf(el) !== "svg" && !clips(styleOf(el))) walk(el);
      return L === Infinity ? null : { left: L, top: Tp, right: R, bottom: B };
    };
    const violations = [];
    let checked = 0;
    let count = 0;
    for (const box of elements) {
      if (!/^(grid|flex|inline-grid|inline-flex)$/.test(styleOf(box).display)) continue;
      if (skipped(box, "overlap") || !rendered(box)) continue;
      const items = flowItems(box).filter((item) => !skipped(item, "overlap"));
      if (items.length < 2) continue;
      checked++;
      const rects = items.map(unionBox);
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const a = rects[i];
          const b = rects[j];
          if (!a || !b) continue;
          const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (ox > min && oy > min) {
            count++;
            sample(violations, { container: describe(box), a: describe(items[i]), b: describe(items[j]), ox: Math.round(ox), oy: Math.round(oy) });
          }
        }
      }
    }
    checks.overlap = { checked, value: count, violationCount: count, violations };
  }

  const box = root.getBoundingClientRect();
  return {
    schemaVersion,
    root: rootSelector,
    rootBox: { width: round1(box.width), height: round1(box.height), scrollWidth: root.scrollWidth, scrollHeight: root.scrollHeight },
    viewport: { width: window.innerWidth, height: window.innerHeight },
    checks
  };
}

// Node side: turn a measureInPage result into per-check verdicts against the gate's thresholds.
// status is "fail" when the threshold is exceeded, "n/a" when the check found nothing to measure, and
// "pass" otherwise. ok is false when any measured check fails or the measurement itself errored.
const JUDGES = Object.freeze({
  clip: (m, t) => m.value > t.maxLeaks,
  singleLine: (m, t) => m.value > t.maxLines,
  shadowBlur: (m, t) => m.value > t.maxBlurPx,
  rail: (m) => m.violationCount > 0,
  rowAlign: (m, t) => m.value > t.maxSpreadPx,
  mark: (m, t) => m.value > t.maxViolations,
  contrast: (m) => m.violationCount > 0,
  controlHeight: (m) => m.violationCount > 0,
  overlap: (m, t) => m.value > t.maxOverlaps
});

export function judgeMeasurements(raw, thresholds) {
  assertThresholds(thresholds);
  if (!raw || raw.error || !raw.checks) {
    return { ok: false, error: raw?.error ?? "no_measurement", failed: [], notApplicable: [], checks: {} };
  }
  const checks = {};
  for (const id of CHECK_IDS) {
    const m = raw.checks[id];
    if (!m) continue;
    const limit = thresholds[id];
    const status = m.checked === 0 ? "n/a" : (JUDGES[id](m, limit) ? "fail" : "pass");
    checks[id] = { status, checked: m.checked, value: m.value, limit, violationCount: m.violationCount, violations: m.violations };
    for (const key of ["worstPx", "element", "shells", "groups", "cells", "controls"]) if (m[key] !== undefined) checks[id][key] = m[key];
  }
  const failed = Object.keys(checks).filter((id) => checks[id].status === "fail");
  const notApplicable = Object.keys(checks).filter((id) => checks[id].status === "n/a");
  return { ok: failed.length === 0, failed, notApplicable, checks };
}

export async function measurePage(page, options = {}) {
  assertThresholds(options.thresholds);
  return page.evaluate(measureInPage, { ...DEFAULT_MEASURE_OPTIONS, ...options, singleLineTags: [...(options.singleLineTags ?? DEFAULT_MEASURE_OPTIONS.singleLineTags)] });
}

// networkIdle: false skips the 500ms network-idle wait (for setContent pages that load nothing).
export async function settlePage(page, { networkIdle = true } = {}) {
  if (networkIdle) await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
  });
}

// Minimal static server for built docs (same behaviour as the one in scripts/geometry-proof.mjs).
export async function startStaticServer(staticRoot) {
  const { createReadStream, statSync } = await import("node:fs");
  const { createServer } = await import("node:http");
  const { extname, normalize, relative, resolve } = await import("node:path");
  const base = resolve(staticRoot);
  const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2" };
  const server = createServer((request, response) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const requested = normalize(decodeURIComponent(url.pathname)).replace(/^\/+/, "");
    const target = resolve(base, requested || "index.html");
    if (relative(base, target).startsWith("..")) {
      response.writeHead(403);
      response.end("forbidden");
      return;
    }
    try {
      if (!statSync(target).isFile()) throw new Error("not_file");
      response.writeHead(200, { "content-type": types[extname(target)] ?? "application/octet-stream" });
      createReadStream(target).pipe(response);
    } catch {
      response.writeHead(404);
      response.end("not found");
    }
  });
  return new Promise((resolveServer, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("gplus_measure_no_port"));
        return;
      }
      resolveServer({
        origin: `http://127.0.0.1:${address.port}`,
        close: () => new Promise((done, fail) => server.close((error) => (error ? fail(error) : done())))
      });
    });
  });
}

// Node-side runner. Each target is { id, html } (loaded with setContent) or { id, url }, plus
// optional root (selector, default "body"), prepare(page), mutationCss (style text injected after
// prepare — the injected-mutation hook), viewport and measure (extra measureInPage options).
// Launches Chromium when no browser is passed and always closes what it opened.
// Returns [{ id, raw, verdict }] in target order.
export async function runMeasureTargets({ targets, thresholds, browser, viewport = { width: 1440, height: 900 }, launchOptions } = {}) {
  assertThresholds(thresholds);
  if (!Array.isArray(targets)) throw new TypeError("gplus_measure_targets_required");
  let owned = null;
  if (!browser) {
    const { chromium } = await import("@playwright/test");
    owned = await chromium.launch(launchOptions);
  }
  const active = browser ?? owned;
  try {
    const context = await active.newContext({ viewport, deviceScaleFactor: 1 });
    try {
      const results = [];
      for (const target of targets) {
        const page = await context.newPage();
        try {
          if (target.viewport) await page.setViewportSize(target.viewport);
          if (typeof target.html === "string") await page.setContent(target.html, { waitUntil: "load" });
          else if (typeof target.url === "string") await page.goto(target.url, { waitUntil: "load" });
          else throw new TypeError(`gplus_measure_target_without_source:${target.id}`);
          if (target.prepare) await target.prepare(page);
          if (target.mutationCss) await page.addStyleTag({ content: target.mutationCss });
          await settlePage(page, { networkIdle: typeof target.html !== "string" });
          const raw = await measurePage(page, { ...(target.measure ?? {}), root: target.root ?? "body", thresholds });
          results.push({ id: target.id, raw, verdict: judgeMeasurements(raw, thresholds) });
        } finally {
          await page.close();
        }
      }
      return results;
    } finally {
      await context.close();
    }
  } finally {
    if (owned) await owned.close();
  }
}

// Node colour math, identical to the browser formulas, for computing data-expect values (for example
// from the pair table) and for tests. Colours are [r, g, b, a] with channels 0..255 and alpha 0..1.
export function parseColor(input) {
  const v = String(input ?? "").trim().toLowerCase();
  if (!v || v === "transparent") return [0, 0, 0, 0];
  let m = v.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    let hex = m[1];
    if (hex.length === 3 || hex.length === 4) hex = [...hex].map((c) => c + c).join("");
    if (hex.length !== 6 && hex.length !== 8) throw new TypeError(`gplus_measure_color_invalid:${input}`);
    const n = (i) => parseInt(hex.slice(i, i + 2), 16);
    return [n(0), n(2), n(4), hex.length === 8 ? n(6) / 255 : 1];
  }
  m = v.match(/^rgba?\(([^)]*)\)$/);
  if (m) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean);
    const channel = (t) => (t.endsWith("%") ? parseFloat(t) * 2.55 : parseFloat(t));
    const alpha = (t) => (t === undefined ? 1 : t.endsWith("%") ? parseFloat(t) / 100 : parseFloat(t));
    return [channel(p[0]), channel(p[1]), channel(p[2]), alpha(p[3])];
  }
  throw new TypeError(`gplus_measure_color_unsupported:${input}`);
}

export function compositeOver(top, bottom) {
  const a = top[3];
  return [top[0] * a + bottom[0] * (1 - a), top[1] * a + bottom[1] * (1 - a), top[2] * a + bottom[2] * (1 - a), 1];
}

export function relativeLuminance(color) {
  const lin = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(color[0]) + 0.7152 * lin(color[1]) + 0.0722 * lin(color[2]);
}

export function contrastRatio(a, b) {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// The value measureInPage reports for ink over a stack of fills (bottom first, page base white
// unless given), rounded to two decimals.
export function expectedContrast(ink, fills = [], base = "#ffffff") {
  let fill = compositeOver(parseColor(base), [255, 255, 255, 1]);
  for (const layer of Array.isArray(fills) ? fills : [fills]) fill = compositeOver(parseColor(layer), fill);
  return Math.round(contrastRatio(compositeOver(parseColor(ink), fill), fill) * 100) / 100;
}
