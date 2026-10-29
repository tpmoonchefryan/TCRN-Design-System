// Top-band shell screen shared by the Shell boards (07a, 07b) and the section D samples of the Typography, Icon,
// Actions and Inputs boards: brand assets from the approved Logos board, the strip, the full menu, the pinned
// dropdown, the paper and the phone, with the CSS they need. Moved out of build-shell2.mjs (TCRN-DS-SUB-133):
// build-shell2 imports it and the two Shell boards it writes stay byte-identical; strip() and screen() gained
// optional current / demo / paper parameters whose defaults give the old output. sampleScreens() renders a
// family board section D sample: the closed top band (light and night) around that board product page.
// Side effect free: it reads logos2/tms.svg once and writes nothing.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { T } from "./data.mjs";
import { cr, fmt, icon, grain } from "./lib.mjs";

export const LOGOS = fileURLToPath(new URL("../logos2/", import.meta.url));
export const svgBody = (f) => fs.readFileSync(LOGOS + f, "utf8").replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").trim();
export const BODY = { tms: svgBody("tms.svg"), ds: svgBody("ds.svg") };
export const DEEP = { tms: "#2c63c8" };
const suffix = (th) => th === "n" ? "#7aa0f5" : DEEP.tms;
export const mark = (size, k = "tms", extra = "") => `<svg viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true" data-logo="${k}" data-mode="color" data-size="${size}"${extra}>${BODY[k]}</svg>`;
export const wm = (em = "", th = "l") => `TCRN <em style="color:${suffix(th)}"${em}>TMS</em>`;
export const ZH = "艺人管理系统";
export const lockup = () => `<div class="lk" role="img" aria-label="TCRN TMS ${ZH}" data-lockup="lk">${mark(44)}<span class="w" aria-hidden="true"><b>${wm()}</b><small>${ZH}</small></span></div>`;
export const lockupLine = () => `<div class="lk" role="img" aria-label="TCRN TMS" data-lockup="lk-line">${mark(44)}<span class="w" aria-hidden="true"><b>${wm()}</b></span></div>`;
export const railLockup = (cells = {}, th = "l") => `<div class="lkr" role="img" aria-label="TCRN TMS ${ZH}" data-lockup="lkr">${mark(22)}<span aria-hidden="true"><b${cells.b || ""}>${wm(cells.em || "", th)}</b><small${cells.small || ""}>${ZH}</small></span></div>`;
export const railLine = () => `<div class="lkr" role="img" aria-label="TCRN TMS" data-lockup="lkr-line">${mark(22)}<span aria-hidden="true"><b>${wm()}</b></span></div>`;

export const PIN_BODY = "M8 3.5h4v5.5l2.5 2.5v1.5h-9v-1.5L8 9z";
export const pin = (on = false, size = 16) => `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true" data-icon="${on ? "pin-filled" : "pin"}"><path d="${PIN_BODY}"${on ? ' fill="currentColor"' : ""} vector-effect="non-scaling-stroke"/><path d="M6.5 3.5h7" vector-effect="non-scaling-stroke"/><path d="M10 13v3.5" vector-effect="non-scaling-stroke"/></svg>`;
export const chev = (dir, size = 16, extra = "") => icon(dir === "up" ? "chevron-up" : dir === "right" ? "chevron-right" : "chevron-down", { size, attrs: extra });
export const cell = (id, ink, fill, surface, kind = "text", th = "l") => ` data-cell="${id}-${th}" data-kind="${kind}" data-expect="${fmt(cr(ink, fill, surface))}"`;

// ---------- 屏幕 CSS：壳层板与四板 D 段共用；build-shell2 在其后接板面专用段 ----------
export const SCREEN_CSS = `
.scr.ts{--strip-h:52px;--tab:40px;--tab-x:12px;--gap:12px;--paper-r:14px;--panel-wx:952px;--menu-gap:6px;--pin-gap:8px;--drop-w:240px;--cascade-gap:4px;--row-h:32px;--pinb:24px;--srch-h:40px}
.scr.ts>.lay{display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:var(--strip-h) minmax(0,1fr)}
.ts-strip{display:flex;align-items:center;height:var(--strip-h);padding:0 var(--gap);min-width:0}
/* 通过稿 E 段：锁定块 .lk 与侧栏 .lkr，CSS 原样；标以块级放置以便垂直居中 */
.lk{display:grid;grid-template-columns:auto minmax(0,1fr);column-gap:14px;align-items:center;min-width:0;color:var(--ink)}
.lk>svg,.lkr>svg{display:block}
.lk .w{display:grid;gap:2px;min-width:0}
.lk .w b{font-size:16px;line-height:20px;font-weight:600;white-space:nowrap;overflow:visible;text-overflow:clip;letter-spacing:-.005em}
.lk .w b em{font-style:normal}
.lk .w small{font-size:11.5px;line-height:16px;color:var(--ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lkr{display:grid;grid-template-columns:22px minmax(0,1fr);column-gap:10px;align-items:center;padding:6px 4px;width:210px;color:var(--ink)}
.lkr b{display:block;font-size:12.5px;font-weight:600;line-height:1.2;white-space:nowrap;overflow:visible;text-overflow:clip}
.lkr b em{font-style:normal}
.lkr small{display:block;font-size:10.5px;color:var(--ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
/* 标旁文字与标几何居中（墨迹中线 = 标中线 ±1）；偏上的真正原因是带内没居中，r6 已改，不做视觉重心下移 */
.vers .lkr{width:auto}
/* 标按钮：侧栏尺度的锁定块首行 + 展开示意；挂上边界；隐形边界 134 × 40 */
.ts-brand{width:134px;display:inline-grid;grid-template-columns:22px auto 20px;column-gap:10px;align-items:center;height:var(--tab);padding:0 6px;border:0;border-radius:8px;background:transparent;color:var(--ink);cursor:pointer;font-family:var(--sans);text-align:left;flex:0 0 auto}
.ts-brand.long{width:max-content;min-width:134px}
.ts-brand.v1{width:auto;grid-template-columns:22px 20px}
.ts-brand svg[data-logo]{display:block}
.ts-brand b{display:block;font-size:12.5px;font-weight:600;line-height:1.2;white-space:nowrap}
.ts-brand b em{font-style:normal}
.ts-brand:hover,.ts-brand.is-hover{background:var(--hover)}
.ts-brand.open{background:var(--hover)}
.ts-brand.is-focus{box-shadow:var(--focus)}
.ts-tgl{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;color:var(--ink-2)}
/* 固定项：与标按钮隐形边界、彼此之间间距完全相等（--pin-gap），无分割线；固定的二级菜单带箭头 */
.ts-pins{display:flex;align-items:center;gap:var(--pin-gap);height:var(--tab);margin-left:var(--pin-gap);min-width:0;flex:0 1 auto}
.ts-pin{display:inline-flex;flex:0 0 auto}
.ts-pin-it{display:inline-flex;align-items:center;gap:6px;height:var(--row-h);padding:0 10px;border:0;border-radius:8px;background:transparent;color:var(--ink-2);text-decoration:none;font:500 12.5px/1 var(--sans);white-space:nowrap;cursor:pointer}
.ts-pin-it .ic{width:12px;height:12px;color:var(--ink-3)}
.ts-pin-it:hover,.ts-pin-it.is-hover{background:var(--hover);color:var(--ink)}
.ts-pin-it.on{background:var(--wash);color:var(--ink);font-weight:600}
.ts-pin-it.open{background:var(--wash);color:var(--ink)}
.ts-pin-it.is-focus{box-shadow:var(--focus)}
.ts-cluster{display:flex;align-items:center;gap:6px;height:var(--tab);flex:0 0 auto;margin-left:auto}
.ts-ib{position:relative;display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border:0;border-radius:8px;background:transparent;color:var(--ink-2);padding:0;cursor:pointer;flex:0 0 auto}
.ts-ib:hover,.ts-ib.is-hover{background:var(--wash);color:var(--ink)}
.ts-ib .ts-dot{position:absolute;top:7px;right:7px;width:6px;height:6px;border-radius:50%;background:var(--red);box-shadow:0 0 0 2px var(--bg)}
.ts-av{width:28px;height:28px;border-radius:50%;border:0;padding:0;display:inline-flex;align-items:center;justify-content:center;font:500 11px/1 var(--sans);background:var(--av-bg);color:var(--av-ink);box-shadow:inset 0 0 0 1px var(--line);cursor:pointer;flex:0 0 auto}
.ts-paper{margin:0 var(--gap) var(--gap);background:var(--panel);border-radius:var(--paper-r);box-shadow:var(--s1);min-width:0;min-height:0;overflow:hidden;--surface:var(--panel);display:flex;flex-direction:column}
.ts-content{padding:14px 28px 12px;flex:1;min-height:0;display:flex;flex-direction:column;gap:10px;overflow:hidden}
.ts-crumbs{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--ink-3);white-space:nowrap;min-width:0}
.ts-crumbs a{color:var(--ink-2);text-decoration:none}
.ts-crumbs b{color:var(--ink);font-weight:600}
.ts-crumbs .ic{width:11px;height:11px}
.ts-btn{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;border-radius:8px;border:0;background:var(--panel);box-shadow:0 1px 1px rgba(22,21,15,.04),0 0 0 1px var(--line-ctl);color:var(--ink);font:500 12.5px/1 var(--sans);white-space:nowrap;cursor:pointer}
.ts-btn.primary{background:var(--acc);color:var(--on-acc);box-shadow:none}
/* 完整菜单：接在标按钮下方 6px，左缘对齐；无收起钮，点外部即收 */
.ts-panel{position:absolute;left:var(--tab-x);top:calc((var(--strip-h) - var(--tab)) / 2 + var(--tab) + var(--menu-gap));width:var(--panel-wx);max-height:588px;padding:8px 8px 0;border-radius:12px;background:var(--panel);box-shadow:var(--s3);--surface:var(--panel);display:flex;flex-direction:column;gap:2px;z-index:3;overflow:hidden}
.ts-srch{display:grid;grid-template-columns:20px minmax(0,1fr) auto;column-gap:8px;align-items:center;height:var(--srch-h);padding:0 10px;border-radius:8px;background:var(--wash);color:var(--ink-3);margin-bottom:6px;flex:0 0 auto;min-width:0}
.ts-srch.is-focus{background:var(--panel);box-shadow:var(--focus)}
.ts-srch .ph2{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--ink-2)}
.ts-srch kbd{font-family:var(--mono);font-size:10.5px;color:var(--ink-2);white-space:nowrap}
.ts-grp{display:grid;grid-template-columns:minmax(0,1fr) var(--pinb);column-gap:10px;align-items:center;height:28px;padding:0 4px 0 8px;margin-top:6px;border-radius:8px;flex:0 0 auto;min-width:0}
.ts-grp h6{margin:0;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ts-it{display:grid;grid-template-columns:22px minmax(0,1fr) var(--pinb);column-gap:10px;align-items:center;height:var(--row-h);padding:0 4px 0 8px;border-radius:8px;color:var(--ink-2);text-decoration:none;font-size:12.5px;font-weight:500;white-space:nowrap;min-width:0;flex:0 0 auto}
.ts-it .ic{width:22px;height:22px;padding:3px;color:var(--ink-3)}
.ts-it>span.t{overflow:hidden;text-overflow:ellipsis;min-width:0;display:inline-flex;align-items:center;gap:6px}
.ts-it>span.t .sub{width:12px;height:12px;padding:0;color:var(--ink-3);flex:0 0 auto}
.ts-it:hover,.ts-it.is-hover{background:var(--hover);color:var(--ink)}
.ts-it.on{background:var(--wash);color:var(--ink);font-weight:600}
.ts-it.on .ic{color:var(--ink)}
.ts-it.is-focus{box-shadow:var(--focus)}
.ts-pinb{display:inline-flex;align-items:center;justify-content:center;width:var(--pinb);height:var(--pinb);border:0;border-radius:6px;padding:0;background:transparent;color:var(--ink-3);opacity:0;cursor:pointer;justify-self:end}
.ts-pinb .ic{width:16px;height:16px;padding:0;color:inherit}
.ts-it:hover .ts-pinb,.ts-it.is-hover .ts-pinb,.ts-it:focus-within .ts-pinb,.ts-grp:hover .ts-pinb,.ts-grp.is-hover .ts-pinb,.ts-grp:focus-within .ts-pinb,.ts-pinb.on,.ts-pinb:focus-visible{opacity:1}
.ts-pinb.on{color:var(--acc)}
.ts-pinb:hover,.ts-pinb.is-hover{background:var(--wash)}
.ts-cols{flex:0 0 auto;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:16px;padding:0 0 4px}
.ts-col{display:flex;flex-direction:column;gap:2px;min-width:0}
.ts-pbar{display:flex;align-items:center;gap:12px;height:52px;margin-top:6px;padding:0 8px;border-top:1px solid var(--line);flex:0 0 auto;min-width:0}
.ts-pbar .ts-crumbs{font-size:11.5px}
.ts-pbar .lkr{margin-left:auto;width:auto;max-width:300px}
/* 固定的二级菜单：从该固定项纵向下拉，接续 6px，顶部搜索；三四级向右级联同宽，高随左列 */
.ts-drop{position:absolute;left:207px;top:48px;width:var(--drop-w);padding:6px;border-radius:12px;background:var(--panel);box-shadow:var(--s3);--surface:var(--panel);display:flex;flex-direction:column;gap:2px;z-index:3;text-align:left;font-weight:500;color:var(--ink-2)}
.ts-drop2{position:absolute;left:calc(var(--drop-w) + var(--cascade-gap));top:0;height:100%;width:var(--drop-w);padding:6px;border-radius:12px;background:var(--panel);box-shadow:var(--s3);--surface:var(--panel);display:flex;flex-direction:column;gap:2px;overflow:hidden}
.ts-drop .ts-srch{height:28px;padding:0 8px;grid-template-columns:14px minmax(0,1fr) auto;column-gap:6px;margin-bottom:4px}
.ts-drop .ts-srch .ph2{font-size:12.5px}
.ts-drop .ts-srch kbd{font-size:10px}
.ts-it.noic{grid-template-columns:minmax(0,1fr) var(--pinb);padding:0 4px 0 10px}
.ts-drop2 .ts-grp{height:24px;margin-top:2px;padding:0 4px 0 10px}
/* 手机 390 */
.scr.ts.m{width:390px}
.scr.ts.m .ts-content{padding:12px 16px}
.scr.ts.m .ts-pins{display:none}
.ts-scrim{position:absolute;left:0;top:0;width:100%;height:100%;background:rgba(22,21,15,.2);z-index:2}
.ts-sheet{position:absolute;left:0;right:0;bottom:0;max-height:84%;padding:8px 8px 12px;border-radius:14px 14px 0 0;background:var(--panel);box-shadow:var(--s3);--surface:var(--panel);display:flex;flex-direction:column;gap:2px;z-index:3;overflow:hidden;--row-h:44px;--srch-h:44px}
.ts-sheet .ts-grab{width:36px;height:4px;border-radius:2px;background:var(--line-2);margin:2px auto 8px;flex:0 0 auto}
.ts-list{display:flex;flex-direction:column;gap:4px}
.ts-li{display:grid;grid-template-columns:28px minmax(0,1fr) auto;column-gap:10px;align-items:center;height:44px;padding:0 4px;border-bottom:1px solid var(--line);font-size:13px;color:var(--ink-2);white-space:nowrap;min-width:0}
.ts-li b{color:var(--ink);font-weight:500;overflow:hidden;text-overflow:ellipsis}
.ts-li .av{width:28px;height:28px}
/* 屏幕说明 */
.shot{display:flex;flex-direction:column;gap:10px;min-width:0}
.shot .cap{display:flex;gap:14px;align-items:baseline;font-size:12px;color:var(--ink-2);min-width:0}
.shot .cap b{color:var(--ink);font-weight:600;white-space:nowrap}
.shot .cap span{font-family:var(--mono);font-size:10.5px;color:var(--ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.screens{display:grid;grid-template-columns:repeat(2,1240px);column-gap:64px;align-items:start}
.screens.phones{grid-template-columns:390px 390px;column-gap:64px}
`;

// ---------- 纸：名册页 ----------
export const ROWS = [
  ["星野ひかり", "hoshino", "A 组", "ok", "签约", "2027-03-31", "今天"],
  ["白石ゆい", "shiraishi", "A 组", "ok", "签约", "2026-12-31", "昨天"],
  ["Mika Lindqvist", "mika", "B 组", "warn", "试用", "—", "2 天前"],
  ["陈嘉怡", "chen", "B 组", "ok", "签约", "2027-06-30", "3 天前"],
  ["小鳥遊そら", "takanashi", "A 组", "ok", "签约", "2027-01-15", "上周"],
  ["Léa Moreau", "lea", "C 组", "", "待邀请", "—", "上周"],
  ["김하늘", "kim", "C 组", "warn", "试用", "—", "上周"],
  ["Aria Vance", "aria", "B 组", "ok", "签约", "2026-11-30", "2 周前"]
];
export function paperBody(t, th, rows = ROWS) {
  const P = t.panel;
  const trs = rows.map(([n, id, g, st, stl, exp, upd], i) => `<tr><td${i === 0 ? cell("td-name", t.ink2, P, P, "text", th) : ""}><b style="color:var(--ink);font-weight:500">${n}</b> <span class="mono" style="color:var(--ink-3)">${id}</span></td><td>${g}</td><td><span class="st${st ? " " + st : ""}"${i === 0 ? cell("st-ok", t.ok, P, P, "text", th) : ""}><i></i>${stl}</span></td><td class="mono">${exp}</td><td class="r">${upd}</td></tr>`).join("");
  return `<div class="ts-crumbs"><a href="#a"${cell("crumb-parent", t.ink2, P, P, "text", th)}>艺人</a>${chev("right", 11)}<b${cell("crumb-current", t.ink, P, P, "text", th)}>名册</b></div>
<div class="ph"><h2${cell("h2", t.ink, P, P, "text", th)}>名册</h2><span class="sub"${cell("sub", t.ink3, P, P, "text", th)}>24 人 · 3 人待邀请</span><span class="act"><button type="button" class="ts-btn">导出${icon("external-link", { size: 14 })}</button><button type="button" class="ts-btn primary"${cell("btn-primary", t.onAcc, t.acc, P, "text", th)}>${icon("plus", { size: 14 })}邀请成员</button></span></div>
<div class="tabs"><a class="on" href="#1"${cell("tab-on", t.ink, P, P, "text", th)}>全部<span class="n">24</span></a><a href="#2"${cell("tab-off", t.ink3, P, P, "text", th)}>签约<span class="n">18</span></a><a href="#3">试用<span class="n">4</span></a><a href="#4">待邀请<span class="n">3</span></a></div>
<table class="tbl"><colgroup><col style="width:34%"><col style="width:14%"><col style="width:16%"><col style="width:20%"><col style="width:16%"></colgroup><thead><tr><th${cell("th", t.ink3, P, P, "text", th)}>艺人</th><th>分组</th><th>状态</th><th>合约到期</th><th class="r">更新</th></tr></thead><tbody>${trs}</tbody></table>
<div class="tfoot">显示 8 / 24 ${chev("right", 11)}</div>`;
}

// ---------- 导航模型（TMS）：分组 → 项 → 子项（三级）→ 子项（四级）----------
export const NAV = [
  { group: "艺人", items: [
    ["名册", "users", { on: true, pinned: true }],
    ["分组", "layers", { hover: true }],
    ["合约", "book-open", { pinned: true, children: [["合约列表"], ["模板", { children: [["签约合同"], ["经纪合同"], ["活动合同"], ["保密协议"]] }], ["审批"], ["到期提醒"]] }],
    ["结算单", "database", { pinned: true }]
  ] },
  { group: "运营", items: [["排期", "calendar", { pinned: true, children: [["本周"], ["月视图"], ["冲突检查"]] }], ["直播", "globe-2"], ["活动", "package"], ["报表", "layout-grid"]] },
  { group: "系统", items: [["成员", "users"], ["权限", "shield-check"], ["设置", "settings"], ["审计日志", "history"]] }
];
export function item(label, ic, { on = false, pinned = false, hover = false, focus = false, children = null } = {}, cells = "", pinCells = "") {
  const cls = `ts-it${ic ? "" : " noic"}${on ? " on" : ""}${hover ? " is-hover" : ""}${focus ? " is-focus" : ""}`;
  return `<a class="${cls}" href="#${label}"${on ? ' aria-current="page"' : ""}${cells}>${ic ? icon(ic, { size: 22, attrs: 'data-guide="prail"' }) : ""}<span class="t" data-text="prail">${label}${children ? chev("right", 12, 'class="ic sub"') : ""}</span><button type="button" class="ts-pinb${pinned ? " on" : ""}" aria-pressed="${pinned ? "true" : "false"}" aria-label="${pinned ? "从顶带取下" : "固定到顶带"}：${label}"${pinCells}>${pin(pinned)}</button></a>`;
}
export function groupRow(name, { pinned = false, hover = false } = {}, cells = "") {
  return `<div class="ts-grp${hover ? " is-hover" : ""}"><h6${cells}>${name}</h6><button type="button" class="ts-pinb${pinned ? " on" : ""}" aria-pressed="${pinned ? "true" : "false"}" aria-label="${pinned ? "从顶带取下" : "固定到顶带"}：${name}">${pin(pinned)}</button></div>`;
}
export const PINS = [["名册", { on: true }], ["合约", { menu: true }], ["结算单", {}], ["排期", { menu: true }]];
// current：哪个固定项是当前页（不传 = PINS 里的 on；null = 当前页不在固定项里）；demo = false 时不画第 3 项的静态悬停（样板用）
export function strip(t, th, { open = false, drop = null, v1 = false, current, demo = true, brandProduct = "tms" } = {}) {
  const P = t.bg; const F = open ? t.hover : P;
  const brand = `<button type="button" class="ts-brand${brandProduct === "ds" ? " long" : ""}${open ? " open" : ""}${v1 ? " v1" : ""}" aria-label="${open ? "收起导航" : "展开导航"} · TCRN ${brandProduct === "ds" ? "Design System" : "TMS"}" aria-expanded="${open ? "true" : "false"}" aria-haspopup="dialog" data-h="40" data-tab>${mark(22, brandProduct, ' data-guide="tab"')}${v1 ? "" : `<b${cell("brand-word", t.ink, F, P, "text", th)}>${brandProduct === "ds" ? `TCRN <em style="color:#6577f3">Design System</em>` : wm(cell("brand-suffix", suffix(th), F, P, "text", th), th)}</b>`}<span class="ts-tgl"${cell("tgl", t.ink2, F, P, "icon", th)}>${chev(open ? "up" : "down", 16)}</span></button>`;
  const pins = `<nav class="ts-pins" aria-label="固定项" data-pins>${PINS.map(([l, o], i) => {
    const isOpen = drop === l;
    const on = current === undefined ? o.on : l === current;
    const hov = demo && i === 2 && !drop;
    const cls = `ts-pin-it${on ? " on" : ""}${isOpen ? " open" : ""}${hov ? " is-hover" : ""}`;
    const c = on ? cell("pin-on", t.ink, t.wash, P, "text", th) : hov ? cell("pin-hover", t.ink, t.hover, P, "text", th) : i === 2 ? cell("pin-rest", t.ink2, P, P, "text", th) : "";
    if (o.menu) return `<span class="ts-pin" data-pin="${l}"><button type="button" class="${cls}" aria-haspopup="dialog" aria-expanded="${isOpen ? "true" : "false"}" aria-controls="drop-${l}"${c}${isOpen ? cell("pin-open", t.ink, t.wash, P, "text", th) : ""}${isOpen ? " data-open-pin" : ""}>${l}${chev("down", 12, i === 1 && !isOpen ? cell("pin-chev", t.ink3, P, P, "icon", th) : "")}</button></span>`;
    return `<span class="ts-pin" data-pin="${l}"><a class="${cls}" href="#${l}"${on ? ' aria-current="page"' : ""}${c}>${l}</a></span>`;
  }).join("")}</nav>`;
  return `<div class="ts-strip">${brand}${pins}<div class="ts-cluster" data-cluster><button type="button" class="ts-ib" aria-label="通知 · 3 条未读"${cell("bell", t.ink2, P, P, "icon", th)}>${icon("bell", { size: 20 })}<i class="ts-dot" aria-hidden="true"></i></button><button type="button" class="ts-av" aria-label="林晓 · 账户、切换产品、主题与语言"${cell("avatar", t.avInk, t.avBg, P, "text", th)}>林</button></div></div>`;
}
export function dropdown(t, th, name) {
  const P = t.panel;
  const grp = NAV.flatMap((g) => g.items).find(([l]) => l === name);
  const kids = grp[2].children;
  const rows = kids.map(([l, o = {}], i) => {
    const on = !!o.children;
    const cells = i === 0 ? cell("drop-rest", t.ink2, P, P, "text", th) : on ? cell("drop-on", t.ink, t.wash, P, "text", th) : "";
    return item(l, null, { on, children: o.children ? [] : null }, cells);
  }).join("");
  const sub = kids.find(([, o = {}]) => o.children);
  const col2 = sub ? `<div class="ts-drop2" role="group" aria-label="${sub[0]}" data-drop2>${groupRow(sub[0])}${sub[1].children.map(([l], i) => item(l, null, {}, i === 0 ? cell("drop2-rest", t.ink2, P, P, "text", th) : "")).join("")}</div>` : "";
  return `<div class="ts-drop" role="dialog" id="drop-${name}" aria-label="${name}" data-panel="drop"><div class="ts-srch" data-h="28">${icon("search", { size: 14 })}<span class="ph2"${cell("drop-srch", t.ink2, t.wash, P, "text", th)}>搜索${name}</span><kbd>⌘K</kbd></div>${rows}${col2}</div>`;
}
// paper(t, th)：纸内内容（不传 = 名册页）；current、demo 传给 strip
export function screen({ id, night, state, paper = paperBody, current, demo = true, brandProduct = "tms" }) {
  const t = night ? T.night : T.light; const th = night ? "n" : "l"; const P = t.panel;
  let panel = "";
  if (state === "expanded") {
    const cols = NAV.map((g, gi) => `<div class="ts-col">${groupRow(g.group, { hover: gi === 2 }, gi === 2 ? cell("grp-hover", t.ink3, P, P, "text", th) : "")}${g.items.map(([l, ic, o = {}], ii) => {
      const cells = o.on ? cell("it-on", t.ink, t.wash, P, "text", th) : o.hover ? cell("it-hover", t.ink, t.hover, P, "text", th) : gi === 1 && ii === 1 ? cell("it-rest", t.ink2, P, P, "text", th) : "";
      const pc = o.on ? cell("pinb-on-wash", t.acc, t.wash, P, "icon", th) : o.hover ? cell("pinb-outline", t.ink3, t.hover, P, "icon", th) : o.pinned && !o.on && gi === 0 && ii === 2 ? cell("pinb-on", t.acc, P, P, "icon", th) : "";
      return item(l, ic, o, cells, pc);
    }).join("")}</div>`).join("");
    panel = `<div class="ts-panel" role="dialog" aria-label="导航" data-panel="expanded">
<div class="ts-srch" data-h="40">${icon("search", { size: 16 })}<span class="ph2"${cell("srch-ph", t.ink2, t.wash, P, "text", th)}>搜索页面、艺人、合约</span><kbd${cell("srch-kbd", t.ink2, t.wash, P, "text", th)}>⌘K</kbd></div>
<div class="ts-cols">${cols}</div>
<div class="ts-pbar"><div class="ts-crumbs"><span${cell("pbar-label", t.ink3, P, P, "text", th)}>当前位置</span><a href="#a">艺人</a>${chev("right", 11)}<b>名册</b></div>${railLockup({ b: cell("lk-b", t.ink, P, P, "text", th), em: cell("lk-em", suffix(th), P, P, "text", th), small: cell("lk-small", t.ink3, P, P, "text", th) }, th)}</div>
</div>`;
  }
  return `<div class="scr gp ts${night ? " night" : ""}" data-shell="${id}" data-state="${state}">
${grain("g-" + id)}
<div class="lay">
${strip(t, th, { open: state === "expanded", drop: state === "drop" ? "合约" : null, current, demo, brandProduct })}
<div class="ts-paper" data-paper><div class="ts-content">${paper(t, th)}</div></div>
${panel}${state === "drop" ? dropdown(t, th, "合约") : ""}
</div>
</div>`;
}
export function phone({ id, night, sheet }) {
  const t = night ? T.night : T.light;
  const list = ROWS.slice(0, 6).map(([n, , , st, stl]) => `<div class="ts-li"><span class="av">${n[0]}</span><b>${n}</b><span class="st${st ? " " + st : ""}"><i></i>${stl}</span></div>`).join("");
  const sh = sheet ? `<div class="ts-scrim" aria-hidden="true"></div><div class="ts-sheet" role="dialog" aria-label="导航"><div class="ts-grab" aria-hidden="true"></div>
<div class="ts-srch" data-h="44">${icon("search", { size: 16 })}<span class="ph2">搜索页面、艺人、合约</span></div>
${groupRow("固定项 · 4")}${[["名册", "users", { on: true, pinned: true }], ["合约", "book-open", { pinned: true, children: [] }], ["结算单", "database", { pinned: true }], ["排期", "calendar", { pinned: true, children: [] }]].map(([l, ic, o]) => item(l, ic, o)).join("")}
${groupRow("全部")}${NAV.map((g, i) => item(g.group, ["users", "calendar", "settings"][i], { children: [] })).join("")}
</div>` : "";
  return `<div class="scr gp ts m${night ? " night" : ""}" data-shell="${id}" data-state="${sheet ? "sheet" : "closed"}">
${grain("g-" + id)}
<div class="lay">
${strip(t, night ? "n" : "l", { open: !!sheet, v1: true })}
<div class="ts-paper" data-paper><div class="ts-content"><div class="ts-crumbs"><a href="#a">艺人</a>${chev("right", 11)}<b>名册</b></div><div class="ph"><h2>名册</h2><span class="sub">24 人</span></div><div class="ts-list">${list}</div></div></div>
${sh}
</div>
</div>`;
}
export const shot = (html, title, note) => `<div class="shot">${html}<div class="cap"><b>${title}</b><span>${note}</span></div></div>`;

// ---------- 四板 D 段样板：同一 screen()，顶带态，纸内是该板的通用产品页（账单、项目、名册、邀请成员）----------
// 样板不是矩阵来源：去掉 data-cell、data-kind、data-expect（各板的 data-cell 只属 A 段，contract-proof 逐格比对格数与值）
const plain = (html) => html.replace(/ data-cell="[^"]*" data-kind="[^"]*" data-expect="[^"]*"/g, "");
export const crumbRow = ([parent, current]) => `<div class="ts-crumbs"><a href="#a">${parent}</a>${chev("right", 11)}<b>${current}</b></div>`;
export function sampleScreen({ id, night = false, crumbs, body, current = null }) {
  return plain(screen({ id, night, state: "closed", current, demo: false, paper: () => crumbRow(crumbs) + "\n" + body }));
}
/** D 段两屏：左浅色、右夜间，每屏 1240 × 640，几何同壳层板 A1、A2；body(th) 返回纸内内容（th = "l" | "n"） */
export function sampleScreens({ id, crumbs, body, current = null }) {
  return `<div class="screens gp">${sampleScreen({ id: id + "-l", night: false, crumbs, body: body("l"), current })}${sampleScreen({ id: id + "-n", night: true, crumbs, body: body("n"), current })}</div>`;
}
// 四板接在自己的 css 之后；注释只给生成器读者看，不进板
export const SAMPLE_CSS = SCREEN_CSS.replace(/\/\*[\s\S]*?\*\/\n?/g, "");
