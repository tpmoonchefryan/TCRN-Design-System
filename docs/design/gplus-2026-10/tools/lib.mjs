// Shared generator library for the batch-one boards (V2-B1-*.dc.html).
// Tokens, contrast math, icon roster, board chrome, composition-one shell.
import fs from "node:fs";
import path from "node:path";

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

// ---------- tokens (same keys in both themes: C5) ----------
export const T = {
  light: {
    bg: "#efeeea", bg2: "#e7e5df", panel: "#ffffff", panel2: "#f8f7f3",
    line: "rgba(22,21,15,.09)", line2: "rgba(22,21,15,.16)", line3: "rgba(22,21,15,.30)", lineCtl: "rgba(22,21,15,.47)", rule: "#16150f",
    ink: "#16150f", ink2: "#4f4c43", ink3: "#6b675d",
    acc: "#0b6b65", acc2: "#0a5f5a", acc3: "#084f4a", accBg: "rgba(11,107,101,.08)", accUl: "rgba(11,107,101,.7)", onAcc: "#ffffff",
    red: "#8e2d24", redBg: "rgba(142,45,36,.06)", redBg2: "rgba(142,45,36,.11)",
    ok: "#2f6b3a", warn: "#8a5a08", bad: "#a8321f", badBg: "rgba(168,50,31,.08)",
    wash: "rgba(22,21,15,.06)", hover: "rgba(22,21,15,.035)", dis: "rgba(22,21,15,.05)",
    s1: "0 1px 1px rgba(22,21,15,.04),0 0 0 1px rgba(22,21,15,.07)",
    s2: "0 1px 2px rgba(22,21,15,.05),0 2px 3px rgba(22,21,15,.04),0 0 0 1px rgba(22,21,15,.08)",
    s3: "0 2px 3px rgba(22,21,15,.06),0 3px 3px rgba(22,21,15,.06),0 0 0 1px rgba(22,21,15,.10)",
    glass: "rgba(255,255,255,.78)", edge: "inset 0 0 0 1px rgba(255,255,255,.8)",
    grain: ".035", blend: "multiply", avBg: "#e7e5df", avInk: "#16150f", knob: "#ffffff", chrome: "rgba(239,238,234,.82)"
  },
  night: {
    bg: "#121210", bg2: "#0d0d0b", panel: "#191916", panel2: "#1f1f1b",
    line: "rgba(255,255,255,.07)", line2: "rgba(255,255,255,.13)", line3: "rgba(255,255,255,.26)", lineCtl: "rgba(255,255,255,.36)", rule: "#ebe8df",
    ink: "#ebe8df", ink2: "#a9a69c", ink3: "#85827a",
    acc: "#3fc7b7", acc2: "#5ad3c5", acc3: "#34b3a4", accBg: "rgba(63,199,183,.10)", accUl: "rgba(63,199,183,.7)", onAcc: "#07211e",
    red: "#d98d82", redBg: "rgba(217,141,130,.08)", redBg2: "rgba(217,141,130,.14)",
    ok: "#6fcf97", warn: "#d9ab52", bad: "#e5897b", badBg: "rgba(229,137,123,.10)",
    wash: "rgba(235,232,223,.07)", hover: "rgba(235,232,223,.04)", dis: "rgba(235,232,223,.05)",
    s1: "0 1px 1px rgba(0,0,0,.3),0 0 0 1px rgba(255,255,255,.06)",
    s2: "0 1px 2px rgba(0,0,0,.35),0 2px 3px rgba(0,0,0,.3),0 0 0 1px rgba(255,255,255,.07)",
    s3: "0 2px 3px rgba(0,0,0,.4),0 3px 3px rgba(0,0,0,.4),0 0 0 1px rgba(255,255,255,.09)",
    glass: "rgba(25,25,22,.74)", edge: "inset 0 1px 0 rgba(255,255,255,.06)",
    grain: ".06", blend: "screen", avBg: "#2a2a26", avInk: "#ebe8df", knob: "#ffffff", chrome: "rgba(18,18,16,.82)"
  }
};
const VAR = { bg: "--bg", bg2: "--bg-2", panel: "--panel", panel2: "--panel-2", line: "--line", line2: "--line-2", line3: "--line-3", lineCtl: "--line-ctl", rule: "--rule", ink: "--ink", ink2: "--ink-2", ink3: "--ink-3", acc: "--acc", acc2: "--acc-2", acc3: "--acc-3", accBg: "--acc-bg", accUl: "--acc-ul", onAcc: "--on-acc", red: "--red", redBg: "--red-bg", redBg2: "--red-bg-2", ok: "--ok", warn: "--warn", bad: "--bad", badBg: "--bad-bg", wash: "--wash", hover: "--hover", dis: "--dis", s1: "--s1", s2: "--s2", s3: "--s3", glass: "--glass", edge: "--edge", grain: "--grain", blend: "--blend", avBg: "--av-bg", avInk: "--av-ink", knob: "--knob", chrome: "--chrome" };
export function tokenCss() {
  const block = (t) => Object.keys(VAR).map((k) => `${VAR[k]}:${t[k]}`).join(";");
  const fixed = `--surface:var(--bg);--focus:0 0 0 2px var(--surface),0 0 0 4px var(--acc);--serif:"Source Serif 4","Noto Serif SC",Georgia,serif;--sans:"Hanken Grotesk","Noto Sans SC",system-ui,sans-serif;--mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;--r-ctl:8px;--r-sm:6px;--r-panel:12px;--r-check:4px;--r-stamp:3px;--h-sm:28px;--h-md:32px;--h-lg:40px;--pad-sm:10px;--pad-md:12px;--pad-lg:16px;--fs-sm:12px;--fs-md:13px;--fs-lg:14px;--ico-sm:14px;--ico-md:16px;--ico-lg:20px;--ease:cubic-bezier(.22,1,.36,1);--t-fill:120ms;--t-press:80ms;--t-move:240ms;--t-loop:900ms`;
  return `.gp{${block(T.light)};${fixed}}\n.gp.night{${block(T.night)}}`;
}

export const FONTS = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&amp;family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,500&amp;family=IBM+Plex+Mono:wght@400;500&amp;family=Noto+Sans+SC:wght@400;500;600&amp;family=Noto+Serif+SC:wght@300;400&amp;display=swap">`;

// ---------- icons: the 28-name roster, 20 grid, 1.25px stroke ----------
export const ICONS = {
  "alert-triangle": '<path d="M10 3.5L2.5 16.5h15L10 3.5z"/><path d="M10 8v4"/><path d="M10 14.25h.01"/>',
  "arrow-left": '<path d="M16 10H4"/><path d="M9 5l-5 5 5 5"/>',
  "arrow-right": '<path d="M4 10h12"/><path d="M11 5l5 5-5 5"/>',
  "book-open": '<path d="M10 6.5C8.6 5.3 6.6 5 3.5 5v10c3.1 0 5.1.3 6.5 1.5 1.4-1.2 3.4-1.5 6.5-1.5V5c-3.1 0-5.1.3-6.5 1.5z"/><path d="M10 6.5v10"/>',
  check: '<path d="M4 10.5l4 4 8-9"/>',
  "chevron-down": '<path d="M5 8l5 5 5-5"/>',
  "chevron-left": '<path d="M12 5l-5 5 5 5"/>',
  "chevron-right": '<path d="M8 5l5 5-5 5"/>',
  database: '<ellipse cx="10" cy="5.5" rx="6.5" ry="2.5"/><path d="M3.5 5.5v9c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-9"/><path d="M3.5 10c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5"/>',
  "external-link": '<path d="M11.5 4H16v4.5"/><path d="M16 4l-7 7"/><path d="M14 11v4.25a.75.75 0 0 1-.75.75h-8.5a.75.75 0 0 1-.75-.75v-8.5A.75.75 0 0 1 4.75 6H9"/>',
  "globe-2": '<circle cx="10" cy="10" r="7"/><path d="M3 10h14"/><path d="M10 3c2 2 3 4.5 3 7s-1 5-3 7c-2-2-3-4.5-3-7s1-5 3-7z"/>',
  history: '<path d="M3.5 10a6.5 6.5 0 1 0 1.9-4.6"/><path d="M3.5 4v3.5H7"/><path d="M10 7v3.5l2.5 1.5"/>',
  home: '<path d="M3 9l7-6 7 6v8h-5v-5H8v5H3z"/>',
  info: '<circle cx="10" cy="10" r="7"/><path d="M10 9v4.5"/><path d="M10 6.75h.01"/>',
  layers: '<path d="M10 3l7 3.5-7 3.5-7-3.5z"/><path d="M3 10l7 3.5 7-3.5"/><path d="M3 13.5L10 17l7-3.5"/>',
  "layout-grid": '<rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="11" y="3" width="6" height="6" rx="1.5"/><rect x="3" y="11" width="6" height="6" rx="1.5"/><rect x="11" y="11" width="6" height="6" rx="1.5"/>',
  "loader-circle": '<path d="M10 3a7 7 0 0 1 7 7"/>',
  menu: '<path d="M3 6h14"/><path d="M3 10h14"/><path d="M3 14h14"/>',
  moon: '<path d="M16.5 12.5A6.5 6.5 0 0 1 7.5 3.5a6.5 6.5 0 1 0 9 9z"/>',
  package: '<path d="M10 3l7 3.5v7L10 17l-7-3.5v-7z"/><path d="M3 6.5l7 3.5 7-3.5"/><path d="M10 10v7"/><path d="M6.5 4.75l7 3.5"/>',
  palette: '<path d="M10 3a7 7 0 1 0 0 14c.9 0 1.5-.7 1.5-1.5 0-.6-.4-1-.4-1.6 0-.8.7-1.4 1.5-1.4H14a3 3 0 0 0 3-3c0-3.6-3.1-6.5-7-6.5z"/><path d="M7 9.25h.01"/><path d="M10 6.5h.01"/><path d="M13 8.25h.01"/><path d="M6.75 12.5h.01"/>',
  "panel-left-close": '<rect x="3" y="4" width="14" height="12" rx="2"/><path d="M8 4v12"/><path d="M14 8l-2 2 2 2"/>',
  "panel-left-open": '<rect x="3" y="4" width="14" height="12" rx="2"/><path d="M8 4v12"/><path d="M11.5 8l2 2-2 2"/>',
  search: '<circle cx="9" cy="9" r="5.5"/><path d="M13 13l4 4"/>',
  settings: '<circle cx="10" cy="10" r="2.5"/><path d="M10 3v2M10 15v2M3 10h2M15 10h2M5 5l1.5 1.5M13.5 13.5L15 15M15 5l-1.5 1.5M6.5 13.5L5 15"/>',
  "shield-check": '<path d="M10 3l6 2.5v4.5c0 3.5-2.5 6-6 7-3.5-1-6-3.5-6-7V5.5z"/><path d="M7.5 10l2 2 3.5-4"/>',
  sun: '<circle cx="10" cy="10" r="3.5"/><path d="M10 3v1.5M10 15.5V17M3 10h1.5M15.5 10H17M5 5l1 1M14 14l1 1M15 5l-1 1M6 14l-1 1"/>',
  x: '<path d="M5 5l10 10"/><path d="M15 5L5 15"/>',
  plus: '<path d="M10 4v12"/><path d="M4 10h12"/>',
  minus: '<path d="M4 10h12"/>',
  users: '<circle cx="8" cy="7" r="3"/><path d="M2.5 16a5.5 5.5 0 0 1 11 0"/><path d="M13 4.5a3 3 0 0 1 0 5.5"/><path d="M17.5 16a5 5 0 0 0-3.5-4.7"/>',
  bell: '<path d="M5 15V8a5 5 0 0 1 10 0v7l1.5 1.5h-13z"/><path d="M8.5 17.5a1.5 1.5 0 0 0 3 0"/>',
  copy: '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>',
  trash: '<path d="M3.5 5.5h13"/><path d="M8 5.5V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5"/><path d="M5 5.5l.8 10A1.5 1.5 0 0 0 7.3 17h5.4a1.5 1.5 0 0 0 1.5-1.5l.8-10"/><path d="M8.5 9v5"/><path d="M11.5 9v5"/>',
  calendar: '<rect x="3" y="4.5" width="14" height="12.5" rx="2"/><path d="M3 9h14"/><path d="M7 3v3"/><path d="M13 3v3"/>',
  "more-horizontal": '<path d="M4.5 10h1"/><path d="M9.5 10h1"/><path d="M14.5 10h1"/>',
  "chevron-up": '<path d="M5 12l5-5 5 5"/>'
};
export const ICON_NEW = ["plus", "minus", "users", "bell", "copy", "trash", "calendar", "more-horizontal", "chevron-up"];
export const ICON_NAMES = Object.keys(ICONS);
/** inline svg; stroke is 1.25 CSS px at every size (non-scaling) */
export function icon(name, { size = 16, cls = "", attrs = "" } = {}) {
  const body = ICONS[name];
  if (!body) throw new Error("icon " + name);
  return `<svg class="ic${cls ? " " + cls : ""}" width="${size}" height="${size}" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-icon="${name}"${attrs ? " " + attrs : ""}>${body.replace(/<(path|circle|rect|ellipse) /g, '<$1 vector-effect="non-scaling-stroke" ')}</svg>`;
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

/** composition-one shell. nav: [{icon,label,count,on}] ; topbarExtra: html ; body: html inside .content */
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
