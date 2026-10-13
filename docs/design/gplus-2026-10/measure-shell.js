// In-browser measurement for the tab-shell boards (V2-B2-Shell-Draft, -Draft2): brand button, strip, three-edge alignment,
// pinned items, dropdown anchor and cascade heights, panel rail 16/48, pin column with no text-width jitter, mark contrast,
// close-button count, decorative lockup, phone sheet rows.
(function () {
  function parse(s) { const m = s && s.match(/rgba?\(([^)]+)\)/); if (!m) return [0, 0, 0, 0]; const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]]; }
  function over(t, b) { const a = t[3]; return [t[0] * a + b[0] * (1 - a), t[1] * a + b[1] * (1 - a), t[2] * a + b[2] * (1 - a), 1]; }
  function lin(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function lum(c) { return 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]); }
  function contrast(a, b) { const l1 = lum(a), l2 = lum(b); const hi = Math.max(l1, l2), lo = Math.min(l1, l2); return (hi + 0.05) / (lo + 0.05); }
  function effBg(el) { const stack = []; let n = el; while (n && n !== document.documentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c[3] > 0) stack.unshift(c); if (c[3] >= 1) break; n = n.parentElement; } let acc = [255, 255, 255, 1]; for (const c of stack) acc = over(c, acc); return acc; }
  const r1 = (v) => Math.round(v * 10) / 10;
  const out = { shells: [] };
  for (const scr of document.querySelectorAll(".scr.ts")) {
    const s = scr.getBoundingClientRect();
    const rel = (el) => { const r = el.getBoundingClientRect(); return { l: r1(r.left - s.left), t: r1(r.top - s.top), r: r1(s.right - r.right), b: r1(s.bottom - r.bottom), w: r1(r.width), h: r1(r.height) }; };
    const tab = scr.querySelector("[data-tab]"), paper = scr.querySelector("[data-paper]"), cluster = scr.querySelector("[data-cluster]");
    const panel = scr.querySelector('[data-panel="expanded"], [data-panel="small"], .ts-sheet') || scr.querySelector("[data-panel]");
    const o = { id: scr.getAttribute("data-shell"), state: scr.getAttribute("data-state"), w: r1(s.width), h: r1(s.height) };
    o.tab = rel(tab); o.paper = rel(paper); o.cluster = rel(cluster);
    const mk = tab.querySelector("svg[data-logo]"); const mr = rel(mk); o.mark = { size: mr.w, insetL: r1(mr.l - o.tab.l), insetT: r1(mr.t - o.tab.t) };
    const bg = effBg(tab); const cs = getComputedStyle(tab);
    o.markContrast = [...mk.querySelectorAll("path,circle,rect")].map((p) => { const st = getComputedStyle(p); const col = st.stroke !== "none" && st.stroke ? st.stroke : st.fill; const c = col === "currentcolor" || col === "currentColor" ? parse(cs.color) : parse(col); return r1(contrast(over(c, bg), bg) * 10) / 10; });
    o.tabBg = cs.backgroundColor; o.tabOpacity = cs.opacity; o.tabOutline = cs.outlineStyle + " " + cs.borderStyle;
    const tgl = tab.querySelector(".ts-tgl"); const word = tab.querySelector("b");
    if (tgl) { const tr = tgl.getBoundingClientRect(); o.toggle = { w: r1(tr.width), h: r1(tr.height), rightOfWord: word ? r1(tr.left - word.getBoundingClientRect().right) : null, glyph: (tgl.querySelector("svg") || {}).getAttribute ? tgl.querySelector("svg").getAttribute("data-icon") : null }; }
    const stripEl = scr.querySelector(".ts-strip"); const scs = getComputedStyle(stripEl); o.strip = { h: rel(stripEl).h, bg: scs.backgroundColor, border: scs.borderBottomWidth + " " + scs.borderBottomStyle };
    const expanded = scr.querySelector('[data-panel="expanded"]');
    o.rowMids = { tab: r1(o.tab.t + o.tab.h / 2), cluster: r1(o.cluster.t + o.cluster.h / 2), stripMid: r1(o.strip.h / 2) };
    o.edges = { tabLeft: o.tab.l, paperLeft: o.paper.l, panelLeft: expanded ? rel(expanded).l : null, clusterRight: o.cluster.r, paperRight: o.paper.r, paperTop: o.paper.t, tabBottom: r1(o.tab.t + o.tab.h), clusterMid: r1(o.cluster.t + o.cluster.h / 2), tabMid: r1(o.tab.t + o.tab.h / 2) };
    // pinned items in the strip
    const pins = [...scr.querySelectorAll("[data-pins] .ts-pin-it")];
    if (pins.length) {
      const first = rel(pins[0]);
      const pinsNav = scr.querySelector("[data-pins]"); const pcs = getComputedStyle(pinsNav);
      if (pcs.display === "none") o.pins = { visible: "none" }; else {
        const rects = pins.map((p) => rel(p));
        const gaps = [r1(first.l - (o.tab.l + o.tab.w))]; for (let i = 1; i < rects.length; i++) gaps.push(r1(rects[i].l - (rects[i - 1].l + rects[i - 1].w)));
        o.pins = { count: pins.length, heights: [...new Set(rects.map((r) => r.h))], mids: [...new Set(rects.map((r) => r1(r.t + r.h / 2)))], firstLeft: first.l, gaps, gapsEqual: new Set(gaps).size === 1, divider: pcs.borderLeftWidth + " " + pcs.borderLeftStyle, visible: pcs.display };
      }
      const open = scr.querySelector("[data-pins] .ts-pin-it.open");
      const drop = scr.querySelector('[data-panel="drop"]');
      if (open && drop) {
        const dr = rel(drop), pr = rel(open); const d2 = drop.querySelector("[data-drop2]");
        o.drop = { l: dr.l, t: dr.t, w: dr.w, h: dr.h, anchorsToPin: Math.abs(dr.l - pr.l) <= 0.5, gapBelowPin: r1(dr.t - (pr.t + pr.h)), inBounds: dr.l >= 0 && dr.t >= 0 && dr.r >= 0 && dr.b >= 0 };
        if (d2) { const r2 = rel(d2); o.drop.col2 = { l: r2.l, w: r2.w, h: r2.h, sameHeight: Math.abs(r2.h - dr.h) <= 0.5, gap: r1(r2.l - (dr.l + dr.w)), inBounds: r2.r >= 0 && r2.b >= 0 }; }
        const dl = drop.getBoundingClientRect().left;
        o.drop.rail = { icons: [...new Set([...drop.querySelectorAll(':scope > .ts-it [data-guide="prail"]')].map((e) => r1(e.getBoundingClientRect().left - dl)))], texts: [...new Set([...drop.querySelectorAll(':scope > .ts-it [data-text="prail"]')].map((e) => r1(e.getBoundingClientRect().left - dl)))] };
        o.drop.rows = [...new Set([...drop.querySelectorAll(".ts-it")].map((e) => r1(e.getBoundingClientRect().height)))];
        const srch = drop.querySelector(".ts-srch"); if (srch) o.drop.search = rel(srch).h;
      }
    }
    if (panel) {
      const pr = rel(panel); o.panel = pr; o.panelInBounds = pr.l >= 0 && pr.t >= 0 && pr.r >= 0 && pr.b >= 0;
      if (!panel.classList.contains("ts-sheet")) o.menuGap = r1(pr.t - (o.tab.t + o.tab.h));
      const pl = panel.getBoundingClientRect().left;
      const g = [...panel.querySelectorAll('[data-guide="prail"]')].map((e) => r1(e.getBoundingClientRect().left - pl));
      const tx = [...panel.querySelectorAll('[data-text="prail"]')].map((e) => r1(e.getBoundingClientRect().left - pl));
      o.prail = { icons: [...new Set(g)], texts: [...new Set(tx)] };
      o.rows = [...new Set([...panel.querySelectorAll(".ts-it")].map((e) => r1(e.getBoundingClientRect().height)))];
      const pinbs = [...panel.querySelectorAll(".ts-pinb, .ts-star")];
      o.pinButtons = [...new Set(pinbs.map((e) => { const r = e.getBoundingClientRect(); return r1(r.width) + "x" + r1(r.height); }))];
      const items = [...panel.querySelectorAll(".ts-it")];
      const widths = items.map((it) => ({ hover: it.classList.contains("is-hover"), on: it.classList.contains("on"), w: r1(it.querySelector("span.t").getBoundingClientRect().width), op: getComputedStyle(it.querySelector(".ts-pinb, .ts-star")).opacity }));
      o.textColWidths = [...new Set(widths.map((x) => x.w))]; o.pinVisibleOn = widths.filter((x) => x.op === "1").map((x) => (x.hover ? "hover" : x.on ? "on" : "rest")).reduce((m, k) => ((m[k] = (m[k] || 0) + 1), m), {});
      const srch = panel.querySelector(".ts-srch"); if (srch) o.search = { h: rel(srch).h };
      const bar = panel.querySelector(".ts-pbar"); if (bar) { o.pbar = { h: rel(bar).h }; const br = bar.getBoundingClientRect(), pnl = panel.getBoundingClientRect(); const lk = bar.querySelector(".lkr, .lk"); const cr = bar.querySelector(".ts-crumbs"); if (lk) { const lr = lk.querySelector("span").getBoundingClientRect(); const mr = lk.querySelector("svg").getBoundingClientRect(); o.pbar.regionTop = r1(br.top - s.top); o.pbar.regionBottom = r1(pnl.bottom - s.top); o.pbar.lockupTextGapAbove = r1(lr.top - br.top); o.pbar.lockupTextGapBelow = r1(pnl.bottom - lr.bottom); o.pbar.markGapAbove = r1(mr.top - br.top); o.pbar.markGapBelow = r1(pnl.bottom - mr.bottom); } if (cr) { const q = cr.getBoundingClientRect(); o.pbar.crumbsGapAbove = r1(q.top - br.top); o.pbar.crumbsGapBelow = r1(pnl.bottom - q.bottom); } const lock = panel.querySelector(".ts-lock3, .ts-lock"); if (lock) { o.lock = { tag: lock.tagName.toLowerCase(), rightInset: r1(panel.getBoundingClientRect().right - lock.getBoundingClientRect().right), hasButton: !!lock.querySelector("button,a"), role: lock.getAttribute("role") }; } }
      o.closeButtons = panel.querySelectorAll(".ts-x, .ts-pin").length;
    }
    o.closeButtonsInShell = scr.querySelectorAll(".ts-x").length;
    out.shells.push(o);
  }
  // lockups: mark centre must equal text block centre (vertical)
  out.lockups = [...document.querySelectorAll("[data-lockup], .ts-brand, .brand")].map((lk) => { const svg = lk.querySelector("svg[data-logo]"); const txt = lk.querySelector("b"); if (!svg || !txt) return null; const a = svg.getBoundingClientRect(), b = (txt.parentElement.matches("span,.w") ? txt.parentElement : txt).getBoundingClientRect(); return { kind: lk.getAttribute("data-lockup") || lk.className.split(" ")[0], markMid: r1(a.top + a.height / 2), textMid: r1(b.top + b.height / 2), off: r1((a.top + a.height / 2) - (b.top + b.height / 2)) }; }).filter(Boolean);
  out.lockupMaxOffset = out.lockups.reduce((m, l) => Math.max(m, Math.abs(l.off)), 0);
  // optical: ink centre of the text (cap top of line 1 to ink bottom of the last line) minus the mark centre; expected +2 at mark 22, +3 at mark 44
  const cv = document.createElement("canvas").getContext("2d");
  const inkOf = (el) => { const cs = getComputedStyle(el); cv.font = cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily; const m = cv.measureText(el.textContent.trim()); const rng = document.createRange(); rng.selectNodeContents(el); const box = [...rng.getClientRects()].filter((r) => r.width > 0)[0]; if (!box) return null; const base = box.top + m.fontBoundingBoxAscent; return { capTop: base - m.actualBoundingBoxAscent, inkBottom: base + m.actualBoundingBoxDescent }; };
  out.optical = [...document.querySelectorAll("[data-lockup], .ts-brand")].map((lk) => { const svg = lk.querySelector("svg[data-logo]"); const b = lk.querySelector("b"); const sm = lk.querySelector("small"); if (!svg || !b) return null; const sr = svg.getBoundingClientRect(); const ib = inkOf(b); if (!ib) return null; const is = sm ? inkOf(sm) : null; const mid = ((ib.capTop) + (is ? is.inkBottom : ib.inkBottom)) / 2; const markMid = sr.top + sr.height / 2; const size = Math.round(sr.height); return { kind: lk.getAttribute("data-lockup") || "brand", mark: size, inkMinusMark: r1(mid - markMid), expect: 0 }; }).filter(Boolean);
  out.opticalViolations = out.optical.filter((o) => Math.abs(o.inkMinusMark - o.expect) > 1).length;
  out.dropPanels = document.querySelectorAll(".ts-drop, [data-panel='drop']").length;
  const bad = [];
  for (const sh of document.styleSheets) { let rules; try { rules = sh.cssRules; } catch (e) { continue; } for (const r of rules) { if (!r.selectorText || !/\.ts-/.test(r.selectorText)) continue; for (const sel of r.selectorText.split(",")) { const s = sel.trim(); if (/(:hover|\.is-hover|\.is-focus|:focus-within|:focus-visible)\s+\S/.test(s) && /color|background/.test(r.style.cssText) && !/opacity/.test(r.style.cssText)) bad.push(s); } } }
  out.descendantStateRulesWithColour = bad;
  return out;
})();
