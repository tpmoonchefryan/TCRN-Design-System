// Shared generator library for the batch-one boards (V2-B1-*.dc.html).
// Contrast math, board chrome, composition-one shell. Tokens, icons, pairs, matrix cells, marks and
// type scale come from ../contract/*.json through data.mjs (single source; STORY-122). The top-band shell
// (screen(), its CSS and the section D samples of the family boards) lives in shell-screen.mjs.
import fs from "node:fs";
import path from "node:path";
import { T, ICONS, ICON_NEW, ICON_NAMES, boardTokenBlocks, matrixCell } from "./data.mjs";

export { T, ICONS, ICON_NEW, ICON_NAMES };

export const OUT = new URL("../boards/", import.meta.url).pathname;

// ---------- colour math ----------
export function parseColor(s) {
  s = String(s).trim();
  if (s === "transparent") return [0, 0, 0, 0];
  if (s.startsWith("#")) {
    let h = s.slice(1);
    if (h.length === 3 || h.length === 4) h = h.split("").map((c) => c + c).join("");
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    return [r, g, b, a];
  }
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
    return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]];
  }
  throw new Error("colour " + s);
}
export function over(top, bottom) {
  const [r, g, b, a] = top; const [R, G, B] = bottom;
  return [r * a + R * (1 - a), g * a + G * (1 - a), b * a + B * (1 - a), 1];
}
function lin(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
export function luminance([r, g, b]) { return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); }
export function contrast(fg, bg) {
  const l1 = luminance(fg), l2 = luminance(bg); const [a, b] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (a + 0.05) / (b + 0.05);
}
/** contrast of ink over fill over surface (all may carry alpha) */
export function cr(ink, fill, surface = "#ffffff") {
  const s = over(parseColor(surface), [255, 255, 255, 1]);
  const f = over(parseColor(fill), s);
  const i = over(parseColor(ink), f);
  return contrast(i, f);
}
export const hex = ([r, g, b]) => "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
export const fmt = (n) => (Math.round(n * 100) / 100).toFixed(2);

// ---------- tokens (same keys in both themes: C5) — contract/tokens.json ----------
export function tokenCss() {
  const b = boardTokenBlocks();
  return `.gp{${b.light};${b.fixed}}\n.gp.night{${b.night}}`;
}

export const FONTS = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&amp;family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,500&amp;family=IBM+Plex+Mono:wght@400;500&amp;family=Noto+Sans+SC:wght@400;500;600&amp;family=Noto+Serif+SC:wght@300;400&amp;display=swap">`;

// ---------- icons: contract/icons.json (20 grid, 1.25px stroke) ----------
/** inline svg; stroke is 1.25 CSS px at every size (non-scaling) */
export function icon(name, { size = 16, cls = "", attrs = "" } = {}) {
  const body = ICONS[name];
  if (!body) throw new Error("icon " + name);
  return `<svg class="ic${cls ? " " + cls : ""}" width="${size}" height="${size}" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-icon="${name}"${attrs ? " " + attrs : ""}>${body.replace(/<(path|circle|rect|ellipse) /g, '<$1 vector-effect="non-scaling-stroke" ')}</svg>`;
}

// ---------- matrix cells: contract/matrices.json ----------
/** data-cell attributes of one cell: id, kind, expected contrast (cr / fmt above), exemption */
export function cellAttrs(board, cellId) {
  const c = matrixCell(board, cellId);
  return `data-cell="${c.cellId}" data-kind="${c.kind}" data-expect="${fmt(cr(c.inkValue, c.fillValue, c.surfaceValue))}"${c.exempt ? " data-exempt" : ""}`;
}

// ---------- board chrome ----------
export function boardCss() {
  return `
body{margin:0}
*{box-sizing:border-box}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.board{position:relative;width:2640px;padding:48px;display:flex;flex-direction:column;gap:40px;background:#efeeea;color:#16150f;font-family:"Hanken Grotesk","Noto Sans SC",system-ui,sans-serif;font-size:13px;line-height:1.5;font-variant-numeric:tabular-nums;overflow:hidden}
.bh{display:grid;grid-template-columns:1560px minmax(0,1fr);column-gap:48px;align-items:end;padding-bottom:22px;border-bottom:1px solid rgba(22,21,15,.16)}
.bh .k{margin:0;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#6b675d;font-weight:500}
.bh h1{margin:6px 0 0;font-family:"Source Serif 4","Noto Serif SC",Georgia,serif;font-size:44px;line-height:1.05;font-weight:400;letter-spacing:-.01em}
.bh h1 em{font-style:normal;color:#8e2d24}
.bh p{margin:10px 0 0;font-size:14px;color:#4f4c43;line-height:1.6;max-width:1400px}
.bh .meta{font-size:12px;color:#6b675d;line-height:1.6;text-align:right}
.bh .meta b{display:block;color:#16150f;font-weight:500}
.sec{display:flex;flex-direction:column;gap:18px}
.sec>h3{margin:0;font-size:11px;line-height:16px;letter-spacing:.14em;text-transform:uppercase;color:#6b675d;font-weight:500;padding-bottom:8px;border-bottom:1px solid rgba(22,21,15,.16);display:flex;align-items:center;gap:14px}
.sec>h3 b{font-family:"IBM Plex Mono",ui-monospace,monospace;color:#16150f;font-weight:500}
.sec>h3 span{letter-spacing:0;text-transform:none;font-weight:400;color:#4f4c43;font-size:12.5px;line-height:16px}
.two{display:grid;grid-template-columns:1248px 1248px;column-gap:48px;align-items:start}
.pane{position:relative;padding:24px 28px 28px;border-radius:14px;background:var(--bg);color:var(--ink);box-shadow:var(--s1);display:flex;flex-direction:column;gap:22px;font-family:var(--sans);overflow:hidden}
.pane>.grain{position:absolute;left:0;top:0;width:100%;height:100%;opacity:var(--grain);mix-blend-mode:var(--blend);pointer-events:none;z-index:0}
.pane>.ptag{position:absolute;top:14px;right:18px;z-index:2;font-family:var(--mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-3)}
.pane>.blk{position:relative;z-index:1;display:flex;flex-direction:column;gap:14px}
.blk>h6{margin:0;font-size:10.5px;line-height:16px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-3);font-weight:500;display:flex;align-items:center;gap:10px}
.blk>h6 span{letter-spacing:0;text-transform:none;font-weight:400;color:var(--ink-2);font-size:12px;line-height:16px}
.row{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.row.top{align-items:flex-start}
.cell{display:flex;flex-direction:column;align-items:flex-start;gap:7px;min-width:0}
.cell>small{font-size:10.5px;color:var(--ink-3);font-family:var(--mono);white-space:nowrap}
.paper{padding:16px 18px;border-radius:var(--r-panel);background:var(--panel);box-shadow:var(--s1);--surface:var(--panel);display:flex;flex-direction:column;gap:14px}
.mx{width:100%;border-collapse:collapse;table-layout:fixed;font-size:12px;background:#ffffff;border-radius:12px;box-shadow:0 0 0 1px rgba(22,21,15,.08);overflow:hidden}
.mx th{text-align:left;height:34px;padding:0 10px;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:#6b675d;font-weight:500;border-bottom:1px solid #16150f;background:#f6f5f1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mx td{height:34px;padding:0 10px;border-bottom:1px solid rgba(22,21,15,.09);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#4f4c43;vertical-align:middle}
.mx tr:last-child td{border-bottom:0}
.mx td.c{color:#16150f;font-weight:600}
.mx td.m{font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:11px;color:#16150f}
.mx td.n{font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:11.5px;color:#16150f;text-align:right}
.mx td.n.lo{color:#a8321f}
.mx td.n.ex{color:#6b675d}
.mx tr.grp td{background:#f6f5f1;color:#16150f;font-weight:600;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;height:28px}
.mx .sw{display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:-2px;margin-right:6px;box-shadow:inset 0 0 0 1px rgba(22,21,15,.14)}
.mx td.r{text-align:right}
.box{background:#ffffff;border-radius:12px;box-shadow:0 0 0 1px rgba(22,21,15,.08);padding:16px 18px;display:flex;flex-direction:column;gap:8px;min-width:0}
.box h4{margin:0;font-size:13px;font-weight:600}
.box h4 small{font-weight:400;color:#6b675d;margin-left:8px;font-size:12px}
.box p,.box li{margin:0;font-size:12.5px;color:#4f4c43;line-height:1.55}
.box ol,.box ul{margin:0;padding-left:18px}
.box li{margin:3px 0}
.box b{color:#16150f;font-weight:600}
.box code{font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:11.5px;color:#16150f}
.box .lead{font-size:13.5px;color:#16150f}
.cols3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;align-items:start}
.cols2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;align-items:start}
.cols4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;align-items:start}
.ic{display:inline-block;flex:0 0 auto;vertical-align:middle}
.spin{animation:spin var(--t-loop) linear infinite;transform-origin:50% 50%}
@keyframes spin{to{transform:rotate(360deg)}}
`;
}

// ---------- composition one shell (1240 × 640) ----------
export function shellCss() {
  return `
.scr{position:relative;width:1240px;height:640px;overflow:hidden;background:var(--bg);color:var(--ink);border-radius:14px;box-shadow:var(--s1);font-size:13px;line-height:1.5;font-family:var(--sans)}
.scr>.grain{position:absolute;left:0;top:0;width:100%;height:100%;opacity:var(--grain);mix-blend-mode:var(--blend);pointer-events:none;z-index:0}
.scr>.lay{position:relative;z-index:1;width:100%;height:100%;display:grid;grid-template-columns:220px minmax(0,1fr)}
.rail{display:flex;flex-direction:column;gap:2px;padding:16px 12px 14px;min-height:0}
.brand{display:grid;grid-template-columns:22px minmax(0,1fr);column-gap:10px;align-items:center;padding:2px 4px 14px;min-width:0}
.brand .mk{width:22px;height:22px;display:block;flex:0 0 auto}
.brand b{display:block;font-size:12.5px;font-weight:600;line-height:1.2;letter-spacing:.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.brand small{display:block;font-size:10.5px;color:var(--ink-3);letter-spacing:.04em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nv{display:grid;grid-template-columns:22px minmax(0,1fr) auto;column-gap:10px;align-items:center;height:32px;padding:0 6px 0 4px;border-radius:8px;color:var(--ink-2);text-decoration:none;font-size:12.5px;font-weight:500;white-space:nowrap;min-width:0}
.nv>span.t{overflow:hidden;text-overflow:ellipsis}
.nv .ic{width:22px;height:22px;padding:3px;color:var(--ink-3)}
.nv .cnt{justify-self:end;font-family:var(--mono);font-size:10.5px;color:var(--ink-3)}
.nv:hover{background:var(--hover);color:var(--ink)}
.nv.on{background:var(--panel);color:var(--ink);box-shadow:var(--s1)}
.nv.on .ic{color:var(--ink)}
.rail h6{margin:12px 0 4px 4px;padding:0;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3);font-weight:500}
.rail .user{margin-top:auto;padding:12px 4px 2px;border-top:1px solid var(--line);display:grid;grid-template-columns:22px minmax(0,1fr);column-gap:10px;align-items:center;min-width:0}
.rail .user .av{width:22px;height:22px;font-size:10px}
.rail .user b{display:block;font-size:12px;font-weight:600;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rail .user small{display:block;font-size:10.5px;color:var(--ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.av{width:24px;height:24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:10.5px;font-weight:500;background:var(--av-bg);color:var(--av-ink);flex:0 0 auto;box-shadow:inset 0 0 0 1px var(--line)}
.sheet{margin:12px 12px 12px 0;background:var(--panel);border-radius:14px;box-shadow:var(--s1);display:flex;flex-direction:column;min-width:0;min-height:0;overflow:hidden;--surface:var(--panel)}
.topbar{display:flex;align-items:center;gap:12px;height:52px;padding:0 28px;border-bottom:1px solid var(--line);flex:0 0 auto;min-width:0}
.crumbs{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--ink-3);white-space:nowrap;flex:0 0 auto}
.crumbs a{color:var(--ink-2);text-decoration:none}
.crumbs b{color:var(--ink);font-weight:600}
.crumbs .ic{width:11px;height:11px}
.sp{flex:1 1 auto;min-width:0}
.content{padding:18px 28px 14px;flex:1;min-height:0;display:flex;flex-direction:column;gap:12px;overflow:hidden}
.ph{display:flex;align-items:flex-end;gap:14px;padding-bottom:12px;border-bottom:1px solid var(--line-2);min-width:0}
.ph h2{margin:0;font-family:var(--serif);font-size:26px;line-height:1.1;font-weight:400;letter-spacing:-.005em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.ph .sub{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3);font-weight:500;white-space:nowrap;padding-bottom:4px;flex:0 0 auto}
.ph .act{margin-left:auto;display:flex;align-items:center;gap:8px;flex:0 0 auto}
.tabs{display:flex;gap:18px;border-bottom:1px solid var(--line)}
.tabs a{position:relative;padding:4px 0 9px;font-size:12.5px;color:var(--ink-3);text-decoration:none;font-weight:500;white-space:nowrap;display:inline-flex;align-items:center;gap:6px}
.tabs a.on{color:var(--ink);font-weight:600}
.tabs a.on:after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:1px;background:var(--rule)}
.tabs .n{font-family:var(--mono);font-size:10.5px;color:var(--ink-3)}
.tbl{width:calc(100% + 16px);margin:0 -8px;border-collapse:collapse;table-layout:fixed;font-size:12.5px}
.tbl th{height:30px;text-align:left;padding:0 10px;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3);font-weight:500;border-bottom:1px solid var(--line-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tbl th:first-child,.tbl td:first-child{padding-left:8px}
.tbl th:last-child,.tbl td:last-child{padding-right:8px}
.tbl th.r,.tbl td.r{text-align:right}
.tbl td{height:38px;padding:0 10px;border-bottom:1px solid var(--line);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;vertical-align:middle;color:var(--ink-2)}
.tbl tr.sel td{background:var(--wash);color:var(--ink)}
.tbl tr.sel td:first-child{border-radius:6px 0 0 6px}
.tbl tr.sel td:last-child{border-radius:0 6px 6px 0}
.st{display:inline-flex;align-items:center;gap:7px;font-size:12px;color:var(--ink-2);white-space:nowrap}
.st i{width:6px;height:6px;border-radius:50%;background:currentColor;flex:0 0 auto}
.st.ok{color:var(--ok)}.st.warn{color:var(--warn)}.st.bad{color:var(--bad)}
.chip{display:inline-flex;align-items:center;height:20px;padding:0 8px;border-radius:4px;font-size:11px;font-weight:500;color:var(--ink-2);box-shadow:inset 0 0 0 1px var(--line-2);white-space:nowrap}
.mono{font-family:var(--mono);font-size:11.5px}
.tfoot{display:flex;align-items:center;gap:8px;padding:8px 0 0;font-size:11px;letter-spacing:.06em;color:var(--ink-3);text-transform:uppercase;font-weight:500;white-space:nowrap}
.stamp{display:inline-flex;align-items:center;gap:8px;padding:5px 10px;border:1px solid var(--red);border-radius:var(--r-stamp);color:var(--red);font-family:var(--serif);font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;font-weight:500;line-height:1.2;white-space:nowrap}
.stamp i{width:5px;height:5px;border-radius:50%;background:currentColor}
`;
}

export const grain = (id) => `<svg class="grain" aria-hidden="true"><filter id="${id}"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#${id})"/></svg>`;

/** composition-one shell, kept for the retired V2-B1-Brand draft (build-brand.mjs); the family boards use shell-screen.mjs.
 *  shellCss() stays in page(): the top-band screen reuses its .scr, .ph, .tabs and .tbl rules.
 *  nav: [{icon,label,count,on}] ; topbarExtra: html ; body: html inside .content */
export function shell({ id, night = false, nav, brandHtml, topbar, body, user = { initial: "林", name: "林晓", role: "管理员" }, crumbs = ["设计组", "项目"] }) {
  const navHtml = nav.map((n) => n.group ? `<h6>${n.group}</h6>` : `<a class="nv${n.on ? " on" : ""}" href="#${n.id}"${n.on ? ' aria-current="page"' : ""}>${icon(n.icon, { size: 22, attrs: 'data-guide="rail"' })}<span class="t" data-text="rail">${n.label}</span>${n.count ? `<span class="cnt">${n.count}</span>` : ""}</a>`).join("\n");
  return `<div class="scr gp${night ? " night" : ""}" data-shell="${id}">
${grain("g-" + id)}
<div class="lay">
<nav class="rail" aria-label="主导航">
${brandHtml}
${navHtml}
<div class="user"><span class="av" data-guide="rail">${user.initial}</span><span><b data-text="rail">${user.name}</b><small>${user.role}</small></span></div>
</nav>
<div class="sheet">
<div class="topbar">
<div class="crumbs"><a href="#t">${crumbs[0]}</a>${icon("chevron-right", { size: 11 })}<b>${crumbs[1]}</b></div>
<span class="sp"></span>
${topbar}
<span class="av">${user.initial}</span>
</div>
<div class="content">
${body}
</div>
</div>
</div>
</div>`;
}

// ---------- matrix table ----------
/** rows: [{group?} | {name, cells:[{fill, ink, surface, kind:'text'|'icon'|'edge', exempt?, note}] }] cols: ['浅色','夜间'] */
export function matrixTable({ caption, cols, rows, extra = "" }) {
  const th = cols.map((c) => `<th>${c} fill</th><th>${c} ink</th><th class="r">${c} 对比</th>`).join("");
  const body = rows.map((r) => {
    if (r.group) return `<tr class="grp"><td colspan="${2 + cols.length * 3}">${r.group}</td></tr>`;
    const cells = r.cells.map((c) => {
      const s = over(parseColor(c.surface || "#ffffff"), [255, 255, 255, 1]);
      const f = over(parseColor(c.fill), s);
      const i = over(parseColor(c.ink), f);
      const v = contrast(i, f);
      const min = c.kind === "text" ? 4.5 : 3;
      const cls = c.exempt ? "ex" : v < min ? "lo" : "";
      const fillLbl = c.fillLabel || c.fill;
      const inkLbl = c.inkLabel || c.ink;
      return `<td class="m"><span class="sw" style="background:${hex(f)}"></span>${fillLbl}</td><td class="m"><span class="sw" style="background:${hex(i)}"></span>${inkLbl}</td><td class="n ${cls}" data-cr="${fmt(v)}">${fmt(v)}${c.exempt ? " 豁免" : ""}</td>`;
    }).join("");
    return `<tr><td class="c">${r.name}</td><td>${r.note || ""}</td>${cells}</tr>`;
  }).join("\n");
  return `<table class="mx"${caption ? ` aria-label="${caption}"` : ""}><colgroup><col style="width:190px"><col style="width:${extra ? 260 : 300}px">${cols.map(() => '<col style="width:270px"><col style="width:270px"><col style="width:90px">').join("")}</colgroup><thead><tr><th>变体 · 状态</th><th>规则</th>${th}</tr></thead><tbody>${body}</tbody></table>`;
}

export function kvTable(rows, widths = [240, 0]) {
  return `<table class="mx"><colgroup><col style="width:${widths[0]}px">${rows[0].slice(1).map((_, i) => `<col${widths[i + 1] ? ` style="width:${widths[i + 1]}px"` : ""}>`).join("")}</colgroup><thead><tr>${rows[0].map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.slice(1).map((r) => `<tr>${r.map((c, i) => `<td class="${i === 0 ? "c" : ""}">${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

export function page({ title, css, body, height }) {
  const h = height ? `height: ${height}px` : "min-height: 800px";
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<title>${title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
${FONTS}
<style>
${boardCss()}
${tokenCss()}
${shellCss()}
${css}
</style>
</helmet>
<div class="board" style="width: 2640px; ${h}">
${body}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":2640,"height":${height || 800}}}'>
class Component extends DCLogic {
  renderVals() {
    return {};
  }
}
</script>
</body>
</html>
`;
}

export function write(name, html) {
  fs.mkdirSync(OUT, { recursive: true });
  const p = path.join(OUT, name);
  fs.writeFileSync(p, html);
  console.log("wrote", p, html.length, "bytes");
}

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
