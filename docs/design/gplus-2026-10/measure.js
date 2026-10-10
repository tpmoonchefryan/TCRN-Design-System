// In-browser measurement for the batch-one boards. Returns a plain object.
(function () {
  function parse(s) {
    const m = s && s.match(/rgba?\(([^)]+)\)/);
    if (!m) return [0, 0, 0, 0];
    const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
    return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]];
  }
  function over(t, b) { const a = t[3]; return [t[0] * a + b[0] * (1 - a), t[1] * a + b[1] * (1 - a), t[2] * a + b[2] * (1 - a), 1]; }
  function lin(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function lum(c) { return 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]); }
  function contrast(a, b) { const l1 = lum(a), l2 = lum(b); const hi = Math.max(l1, l2), lo = Math.min(l1, l2); return (hi + 0.05) / (lo + 0.05); }
  function effBg(el) {
    // composite background-colors from the nearest opaque ancestor downward
    const stack = [];
    let node = el;
    while (node && node !== document.documentElement) {
      const c = parse(getComputedStyle(node).backgroundColor);
      if (c[3] > 0) stack.unshift(c);
      if (c[3] >= 1) break;
      node = node.parentElement;
    }
    let acc = [255, 255, 255, 1];
    for (const c of stack) acc = over(c, acc);
    return acc;
  }
  function clipAncestor(el) {
    let n = el.parentElement;
    while (n && n !== document.body) {
      const cs = getComputedStyle(n);
      if (/(hidden|auto|scroll|clip)/.test(cs.overflow + cs.overflowX + cs.overflowY)) return n;
      n = n.parentElement;
    }
    return null;
  }
  const board = document.querySelector(".board");
  const out = { board: { w: board.offsetWidth, h: board.offsetHeight, scrollH: board.scrollHeight, scrollW: board.scrollWidth } };

  // 1. overflow leaks: any element whose box exceeds its nearest clipping ancestor by > .5px
  const leaks = [];
  const all = board.querySelectorAll("*");
  for (const el of all) {
    if (el.closest("svg") && el.tagName.toLowerCase() !== "svg") continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || cs.position === "fixed") continue;
    const anc = clipAncestor(el);
    if (!anc) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const a = anc.getBoundingClientRect();
    const d = Math.max(a.left - r.left, r.right - a.right, a.top - r.top, r.bottom - a.bottom);
    if (d > 0.5) {
      // allowed: elements the ancestor scrolls (overflow auto/scroll) stay inside scrollable area; and the .sr utility
      if (el.classList.contains("sr") || el.classList.contains("grain") || el.closest(".sr")) continue;
      leaks.push({ tag: el.tagName.toLowerCase(), cls: el.className && el.className.baseVal === undefined ? el.className : "", by: Math.round(d * 10) / 10, anc: anc.className && typeof anc.className === "string" ? anc.className : anc.tagName.toLowerCase(), text: (el.textContent || "").trim().slice(0, 30) });
    }
  }
  out.leaks = leaks.length;
  out.leakSamples = leaks.slice(0, 12);

  // 2. single-line elements: declared nowrap (or [data-line]) must render as ONE line box (count distinct line tops of their contents)
  const multi = [];
  let singleCount = 0;
  for (const el of all) {
    if (el.closest("svg")) continue;
    const cs = getComputedStyle(el);
    if (el.hasAttribute("data-line") || (cs.whiteSpace === "nowrap" && /^(a|b|span|td|th|button|label|h1|h2|h3|h4|h5|h6|small|kbd|code|p)$/i.test(el.tagName))) {
      if (el.getBoundingClientRect().height === 0) continue;
      const hasBlockChild = [...el.children].some((c) => /^(block|flex|grid|inline-flex|inline-grid|table)$/.test(getComputedStyle(c).display));
      if (hasBlockChild) continue;
      singleCount++;
      const range = document.createRange(); range.selectNodeContents(el);
      const rs = [...range.getClientRects()].filter((x) => x.width > 0 && x.height > 0);
      if (!rs.length) continue;
      const minTop = Math.min(...rs.map((x) => x.top)), maxBottom = Math.max(...rs.map((x) => x.bottom));
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;
      const lines = (maxBottom - minTop) / lh;
      if (lines > 1.6) multi.push({ tag: el.tagName.toLowerCase(), cls: typeof el.className === "string" ? el.className : "", lines: Math.round(lines * 10) / 10, text: (el.textContent || "").trim().slice(0, 30) });
    }
  }
  out.singleLineChecked = singleCount;
  out.multiLineViolations = multi.length;
  out.multiSamples = multi.slice(0, 10);

  // 3. shadow blur maximum across the board
  let maxBlur = 0, blurEl = "";
  for (const el of all) {
    if (el.closest("svg")) continue;
    const bs = getComputedStyle(el).boxShadow;
    if (!bs || bs === "none") continue;
    // each shadow: color x y blur spread
    const parts = bs.split(/,(?![^(]*\))/);
    for (const p of parts) {
      const nums = p.replace(/rgba?\([^)]*\)/g, "").trim().split(/\s+/).filter((t) => /px$/.test(t)).map(parseFloat);
      if (nums.length >= 3 && nums[2] > maxBlur) { maxBlur = nums[2]; blurEl = typeof el.className === "string" ? el.className : el.tagName; }
    }
  }
  out.maxShadowBlur = maxBlur; out.maxShadowBlurEl = blurEl;

  // 4. rail guide column in each shell: icons/marks/avatars at left 16, text at 48 (relative to the .scr)
  out.shells = [];
  for (const scr of board.querySelectorAll(".scr")) {
    const s = scr.getBoundingClientRect();
    const guides = [...scr.querySelectorAll('[data-guide="rail"]')].map((g) => Math.round((g.getBoundingClientRect().left - s.left) * 10) / 10);
    const texts = [...scr.querySelectorAll('[data-text="rail"]')].map((g) => Math.round((g.getBoundingClientRect().left - s.left) * 10) / 10);
    const rail = scr.querySelector(".rail"); const sheet = scr.querySelector(".sheet");
    const r = rail ? rail.getBoundingClientRect() : null; const sh = sheet ? sheet.getBoundingClientRect() : null;
    out.shells.push({ id: scr.getAttribute("data-shell"), guideLefts: [...new Set(guides)], textLefts: [...new Set(texts)], railW: r ? Math.round(r.width) : null, sheetLeft: sh ? Math.round(sh.left - s.left) : null, sheetRight: sh ? Math.round(s.right - sh.right) : null, sheetTop: sh ? Math.round(sh.top - s.top) : null, sheetBottom: sh ? Math.round(s.bottom - sh.bottom) : null });
  }

  // 5. contrast of every [data-cell] sample: ink = computed color, fill = effective background
  const cells = [];
  let lowCount = 0;
  function shadowOutlineColor(bs) {
    if (!bs || bs === "none") return null;
    for (const p of bs.split(/,(?![^(]*\))/)) {
      const m = p.match(/rgba?\([^)]*\)/); if (!m) continue;
      const nums = p.replace(/rgba?\([^)]*\)/g, "").replace(/inset/g, "").trim().split(/\s+/).map(parseFloat);
      // x y blur spread: an outline is blur 0 with spread >= 1
      if (nums.length >= 4 && nums[2] === 0 && nums[3] >= 1) return parse(m[0]);
    }
    return null;
  }
  function probeInk(el, probe, cs) {
    if (probe === "ph") return parse(getComputedStyle(el, "::placeholder").color);
    if (probe === "shadow") return shadowOutlineColor(cs.boxShadow) || parse(cs.color);
    if (probe === "after-border") return parse(getComputedStyle(el, "::after").borderBottomColor);
    if (probe === "after-shadow") return shadowOutlineColor(getComputedStyle(el, "::after").boxShadow) || parse(cs.color);
    if (probe === "after-bg") return parse(getComputedStyle(el, "::after").backgroundColor);
    return parse(cs.color);
  }
  for (const el of board.querySelectorAll("[data-cell]")) {
    const cs = getComputedStyle(el);
    const probe = el.getAttribute("data-probe");
    const fill = effBg(el);
    const ink = over(probeInk(el, probe, cs), fill);
    const v = Math.round(contrast(ink, fill) * 100) / 100;
    const kind = el.getAttribute("data-kind") || "text";
    const min = kind === "text" ? 4.5 : 3;
    const exempt = el.hasAttribute("data-exempt");
    const expected = parseFloat(el.getAttribute("data-expect") || "0");
    const ok = exempt || v >= min;
    if (!ok) lowCount++;
    cells.push({ id: el.getAttribute("data-cell"), cr: v, expect: expected || null, diff: expected ? Math.round((v - expected) * 100) / 100 : null, ok, kind, exempt });
  }
  out.cells = cells.length;
  out.cellsLow = lowCount;
  out.cellSamples = cells;
  const maxDiff = cells.reduce((m, c) => Math.max(m, Math.abs(c.diff || 0)), 0);
  out.cellMaxDiffFromTable = maxDiff;

  // 6. control heights of [data-h] elements (expected height attribute)
  const hs = [];
  for (const el of board.querySelectorAll("[data-h]")) {
    const h = Math.round(el.getBoundingClientRect().height * 10) / 10;
    const exp = parseFloat(el.getAttribute("data-h"));
    if (Math.abs(h - exp) > 0.5) hs.push({ cls: typeof el.className === "string" ? el.className : "", h, exp });
  }
  out.heightViolations = hs.length; out.heightSamples = hs.slice(0, 10);

  // 8. row alignment: first-cell content left edges must match across every row of a table (header included) and across [data-rows] children
  function contentLeft(cell) { const range = document.createRange(); range.selectNodeContents(cell); const rs = [...range.getClientRects()].filter((x) => x.width > 0 && x.height > 0); return rs.length ? Math.min(...rs.map((x) => x.left)) : null; }
  out.rowAlign = [];
  for (const tbl of board.querySelectorAll("table")) {
    const lefts = [];
    for (const tr of tbl.querySelectorAll("tr")) { const c = tr.cells[0]; if (!c) continue; const l = contentLeft(c); if (l != null) lefts.push(Math.round(l * 10) / 10); }
    if (lefts.length && Math.max(...lefts) - Math.min(...lefts) > 0.5) out.rowAlign.push({ cls: typeof tbl.className === "string" ? tbl.className : "table", lefts: [...new Set(lefts)] });
  }
  for (const box of board.querySelectorAll("[data-rows]")) {
    const lefts = [...box.children].map((c) => contentLeft(c)).filter((v) => v != null).map((v) => Math.round(v * 10) / 10);
    if (lefts.length && Math.max(...lefts) - Math.min(...lefts) > 0.5) out.rowAlign.push({ cls: "rows:" + box.className, lefts: [...new Set(lefts)] });
  }
  out.rowAlignViolations = out.rowAlign.length;
  // 9. highlight marks must not change layout: no padding/margin, same weight/size/spacing as the parent
  const marks = [...board.querySelectorAll("mark")];
  const badMarks = marks.filter((m) => { const cs = getComputedStyle(m), ps = getComputedStyle(m.parentElement); return (parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + parseFloat(cs.marginLeft) + parseFloat(cs.marginRight)) !== 0 || cs.fontWeight !== ps.fontWeight || cs.letterSpacing !== ps.letterSpacing || cs.fontSize !== ps.fontSize; });
  out.marks = marks.length; out.markLayoutViolations = badMarks.length;

  // 10. in-flow siblings inside grid / flex containers must not overlap each other
  const overlaps = [];
  for (const box of board.querySelectorAll("*")) {
    if (box.closest("svg")) continue;
    const d = getComputedStyle(box).display;
    if (!/^(grid|flex|inline-grid|inline-flex)$/.test(d)) continue;
    const kids = [...box.children].filter((c) => { const cs = getComputedStyle(c); return cs.position !== "absolute" && cs.position !== "fixed" && cs.display !== "none"; });
    const union = (el) => { let r = el.getBoundingClientRect(); let L = r.left, T = r.top, R = r.right, B = r.bottom; for (const d of el.querySelectorAll("*")) { if (d.closest("svg") && d.tagName.toLowerCase() !== "svg") continue; const cs = getComputedStyle(d); if (cs.position === "absolute" || cs.position === "fixed" || cs.display === "none") continue; const q = d.getBoundingClientRect(); if (q.width === 0 || q.height === 0) continue; L = Math.min(L, q.left); T = Math.min(T, q.top); R = Math.max(R, q.right); B = Math.max(B, q.bottom); } return { left: L, top: T, right: R, bottom: B, width: R - L, height: B - T }; };
    const rects = kids.map(union);
    for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) {
      const a = rects[i], b = rects[j];
      if (a.width === 0 || b.width === 0 || a.height === 0 || b.height === 0) continue;
      const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ox > 1 && oy > 1) overlaps.push({ box: typeof box.className === "string" ? box.className.slice(0, 40) : box.tagName, a: (typeof kids[i].className === "string" ? kids[i].className : kids[i].tagName).slice(0, 30), b: (typeof kids[j].className === "string" ? kids[j].className : kids[j].tagName).slice(0, 30), ox: Math.round(ox), oy: Math.round(oy) });
    }
  }
  out.overlaps = overlaps.length; out.overlapSamples = overlaps.slice(0, 8);

  // 7. fonts loaded?
  out.fonts = { serif: document.fonts.check('16px "Source Serif 4"'), sans: document.fonts.check('16px "Hanken Grotesk"'), mono: document.fonts.check('16px "IBM Plex Mono"'), sc: document.fonts.check('16px "Noto Sans SC"') };
  return out;
})();
