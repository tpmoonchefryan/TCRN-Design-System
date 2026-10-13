// V2-B2-Shell-Draft.dc.html — 第二批 · 页签壳草案一（2026-10-13，待 Owner）。
// Owner 2026-10-13 的方案（登入动画收敛到左上角页签；点开搜索 + 展开；完整菜单右下角锁定块；悬停出星、加星进常用）
// 加设计会话的五处修改（空闲态单色标不用 50%；小面板加一级入口并记忆展开；右上角镜像簇；锁定块兼切产品；动画只在登入播一次）。
// 用法：node tools/build-shell.mjs <高度>
import { T, cr, fmt, icon, grain, shell, matrixTable, kvTable, page, write, esc } from "./lib.mjs";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const height = process.argv[2] ? Number(process.argv[2]) : 0;
const LOGOS = fileURLToPath(new URL("../logos2/", import.meta.url));
const svgBody = (f) => fs.readFileSync(LOGOS + f, "utf8").replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").trim();
const TMS = { color: svgBody("tms.svg"), mono: svgBody("tms-mono.svg").replace(/#16150f/g, "currentColor") };
const DEEP = { light: "#2c63c8", night: "#7aa0f5" }; // 后缀色：浅色 D2，夜间 O-3
const mark = (size, mode, extra = "") => `<svg viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true" data-logo="tms" data-mode="${mode}" data-size="${size}"${extra}>${TMS[mode]}</svg>`;

// 星：20 格五角星，外 r 7、内 r 3，中心 (10, 10.6)；描边 1.25；加星后 fill currentColor
const STAR = "M10 3.6l1.76 4.57 4.9.27-3.81 3.09 1.26 4.73L10 13.6l-4.11 2.66 1.26-4.73L3.34 8.44l4.9-.27z";
const star = (on = false, size = 16) => `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 20 20" fill="${on ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true" data-icon="${on ? "star-filled" : "star"}"><path d="${STAR}" vector-effect="non-scaling-stroke"/></svg>`;

const cell = (id, ink, fill, surface, kind = "text", th = "l") => ` data-cell="${id}-${th}" data-kind="${kind}" data-expect="${fmt(cr(ink, fill, surface))}"`;

// ---------- 板内 CSS：所有类带 ts- 前缀；状态选择器与变体同为两类，不含颜色以外的属性越权；定位只写在具体类上 ----------
const css = `
.scr.ts{--strip-h:52px;--tab:40px;--tab-x:12px;--tab-mark:28px;--gap:12px;--paper-r:14px;--panel-w:320px;--panel-wx:952px;--row-h:32px;--star:24px;--srch-h:40px;--tab-deep:${DEEP.light}}
.scr.ts.night{--tab-deep:${DEEP.night}}
.scr.ts>.lay{display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:var(--strip-h) minmax(0,1fr)}
.ts-strip{display:flex;align-items:flex-start;height:var(--strip-h);padding:0 var(--gap);min-width:0}
.ts-tab{display:flex;align-items:center;justify-content:center;width:var(--tab);height:var(--tab);padding:0;border:0;border-radius:0 0 10px 10px;background:transparent;color:var(--ink-2);cursor:pointer;flex:0 0 auto}
.ts-tab svg{display:block}
.ts-tab:hover,.ts-tab.is-hover{background:var(--wash)}
.ts-tab.open{background:var(--wash)}
.ts-tab.is-focus{box-shadow:var(--focus)}
.ts-cluster{display:flex;align-items:center;gap:6px;height:var(--tab);flex:0 0 auto}
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
.ts-panel{position:absolute;left:var(--tab-x);top:var(--strip-h);width:var(--panel-w);max-height:576px;padding:8px;border-radius:12px;background:var(--panel);box-shadow:var(--s3);--surface:var(--panel);display:flex;flex-direction:column;gap:2px;z-index:3;overflow:hidden}
.ts-panel.x{width:var(--panel-wx)}
.ts-srch{display:grid;grid-template-columns:20px minmax(0,1fr) auto;column-gap:8px;align-items:center;height:var(--srch-h);padding:0 10px;border-radius:8px;background:var(--wash);color:var(--ink-3);margin-bottom:6px;flex:0 0 auto;min-width:0}
.ts-srch.x{grid-template-columns:20px minmax(0,1fr) auto auto}
.ts-srch.is-focus{background:var(--panel);box-shadow:var(--focus)}
.ts-srch .ph2{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--ink-2)}
.ts-srch .ph2 i{display:inline-block;width:1px;height:14px;background:var(--ink);vertical-align:-2px;margin-right:1px}
.ts-srch kbd{font-family:var(--mono);font-size:10.5px;color:var(--ink-2);white-space:nowrap}
.ts-srch .ts-x{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border:0;border-radius:6px;background:transparent;color:var(--ink-3);padding:0;cursor:pointer}
.ts-panel h6{margin:8px 0 2px 8px;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:0 0 auto}
.ts-it{display:grid;grid-template-columns:22px minmax(0,1fr) var(--star);column-gap:10px;align-items:center;height:var(--row-h);padding:0 4px 0 8px;border-radius:8px;color:var(--ink-2);text-decoration:none;font-size:12.5px;font-weight:500;white-space:nowrap;min-width:0;flex:0 0 auto}
.ts-it .ic{width:22px;height:22px;padding:3px;color:var(--ink-3)}
.ts-it>span.t{overflow:hidden;text-overflow:ellipsis;min-width:0}
.ts-it>span.t small{font-family:var(--mono);font-size:10.5px;color:var(--ink-3);margin-left:8px;font-weight:400}
.ts-it:hover,.ts-it.is-hover{background:var(--hover);color:var(--ink)}
.ts-it.on{background:var(--wash);color:var(--ink);font-weight:600}
.ts-it.on .ic{color:var(--ink)}
.ts-it.is-focus{box-shadow:var(--focus)}
.ts-star{display:inline-flex;align-items:center;justify-content:center;width:var(--star);height:var(--star);border:0;border-radius:6px;padding:0;background:transparent;color:var(--ink-3);opacity:0;cursor:pointer;justify-self:end}
.ts-star .ic{width:16px;height:16px;padding:0;color:inherit}
.ts-it:hover .ts-star,.ts-it.is-hover .ts-star,.ts-it:focus-within .ts-star,.ts-star.on,.ts-star:focus-visible{opacity:1}
.ts-star.on{color:var(--acc)}
.ts-star:hover,.ts-star.is-hover{background:var(--wash)}
.ts-pfoot{display:flex;align-items:center;gap:10px;height:36px;margin-top:6px;padding:0 4px 0 2px;border-top:1px solid var(--line);flex:0 0 auto;min-width:0}
.ts-tbtn{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 8px;border:0;border-radius:6px;background:transparent;color:var(--ink-2);font:500 12px/1 var(--sans);white-space:nowrap;cursor:pointer}
.ts-tbtn:hover,.ts-tbtn.is-hover{background:var(--wash);color:var(--ink)}
.ts-pfoot .hint{margin-left:auto;font-family:var(--mono);font-size:10.5px;color:var(--ink-3);white-space:nowrap}
.ts-cols{flex:0 0 auto;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:16px;padding:0 0 4px}
.ts-col{display:flex;flex-direction:column;gap:2px;min-width:0}
.ts-pbar{display:flex;align-items:center;gap:12px;height:44px;margin-top:6px;padding:0 4px 0 8px;border-top:1px solid var(--line);flex:0 0 auto;min-width:0}
.ts-pbar .ts-crumbs{font-size:11.5px}
.ts-lock{display:grid;grid-template-columns:22px minmax(0,1fr) 16px;column-gap:10px;align-items:center;height:36px;padding:0 6px 0 6px;border:0;border-radius:8px;background:transparent;color:var(--ink);cursor:pointer;margin-left:auto;min-width:0;max-width:260px;text-align:left;font-family:var(--sans)}
.ts-lock:hover,.ts-lock.is-hover{background:var(--wash)}
.ts-lock b{display:block;font-size:12.5px;font-weight:600;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ts-lock b em{font-style:normal;color:var(--tab-deep)}
.ts-lock small{display:block;font-size:10.5px;color:var(--ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ts-lock .ic{color:var(--ink-3)}
.ts-pin{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border:0;border-radius:6px;background:transparent;color:var(--ink-3);padding:0;cursor:pointer}
.ts-pin:hover{background:var(--wash);color:var(--ink)}
/* 手机 390：页签同几何，面板改底部 Sheet，行 44 */
.scr.ts.m{width:390px}
.scr.ts.m .ts-content{padding:12px 16px}
.ts-scrim{position:absolute;left:0;top:0;width:100%;height:100%;background:rgba(22,21,15,.2);z-index:2}
.ts-sheet{position:absolute;left:0;right:0;bottom:0;max-height:80%;padding:8px 8px 12px;border-radius:14px 14px 0 0;background:var(--panel);box-shadow:var(--s3);--surface:var(--panel);display:flex;flex-direction:column;gap:2px;z-index:3;overflow:hidden;--row-h:44px;--srch-h:44px}
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
.screens.last{grid-template-columns:1240px 390px 390px;column-gap:64px}
/* 登入动画分镜（1240×640 按 0.3 缩放到 372×192） */
.story{display:grid;grid-template-columns:repeat(5,372px);column-gap:36px;align-items:start}
.fr{position:relative;width:372px;height:192px;border-radius:8px;background:var(--bg);box-shadow:var(--s1);overflow:hidden}
.fr .card{position:absolute;left:138px;top:42px;width:96px;height:108px;border-radius:6px;background:var(--panel);box-shadow:var(--s2)}
.fr .card i{position:absolute;left:12px;width:72px;height:9px;border-radius:2px;background:var(--wash)}
.fr .card i.b{background:var(--acc)}
.fr .mk{position:absolute;display:block}
.fr .pp{position:absolute;left:4px;top:16px;width:364px;height:172px;border-radius:5px;background:var(--panel);box-shadow:var(--s1)}
.fr .pp i{position:absolute;left:10px;height:4px;border-radius:2px;background:var(--wash)}
.fr .tb{position:absolute;left:4px;top:0;width:12px;height:12px;border-radius:0 0 3px 3px}
.fr .cl{position:absolute;right:4px;top:2px;width:22px;height:8px;border-radius:4px;background:var(--wash)}
.fr.dim .card{opacity:.35}
.fr.half .pp{opacity:.45;transform:translateY(3px)}
.fr .t{position:absolute;left:8px;bottom:6px;font-family:var(--mono);font-size:10px;color:var(--ink-3);white-space:nowrap}
.rules{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
/* 几何示意 */
.geo{position:relative;width:1240px;height:640px;border-radius:14px;background:var(--bg);box-shadow:var(--s1);overflow:hidden;font-family:var(--mono);font-size:10.5px;color:var(--ink-3)}
.geo .g{position:absolute;box-shadow:inset 0 0 0 1px var(--acc);border-radius:2px}
.geo .g.p{box-shadow:inset 0 0 0 1px var(--line-3);background:var(--panel)}
.geo .l{position:absolute;color:var(--acc);white-space:nowrap}
.geo .l b{color:var(--ink);font-weight:500}
`;

// ---------- 屏幕内容：名册页（纸） ----------
const ROWS = [
  ["星野ひかり", "hoshino", "A 组", "ok", "签约", "2027-03-31", "今天"],
  ["白石ゆい", "shiraishi", "A 组", "ok", "签约", "2026-12-31", "昨天"],
  ["Mika Lindqvist", "mika", "B 组", "warn", "试用", "—", "2 天前"],
  ["陈嘉怡", "chen", "B 组", "ok", "签约", "2027-06-30", "3 天前"],
  ["小鳥遊そら", "takanashi", "A 组", "ok", "签约", "2027-01-15", "上周"],
  ["Léa Moreau", "lea", "C 组", "", "待邀请", "—", "上周"],
  ["김하늘", "kim", "C 组", "warn", "试用", "—", "上周"],
  ["Aria Vance", "aria", "B 组", "ok", "签约", "2026-11-30", "2 周前"]
];
function paperBody(t, th, rows = ROWS) {
  const P = t.panel;
  const trs = rows.map(([n, id, g, st, stl, exp, upd], i) => `<tr><td${i === 0 ? cell("td-name", t.ink2, P, P, "text", th) : ""}><b style="color:var(--ink);font-weight:500">${n}</b> <span class="mono" style="color:var(--ink-3)">${id}</span></td><td>${g}</td><td><span class="st${st ? " " + st : ""}"${i === 0 ? cell("st-ok", t.ok, P, P, "text", th) : ""}><i></i>${stl}</span></td><td class="mono">${exp}</td><td class="r">${upd}</td></tr>`).join("");
  return `<div class="ts-crumbs"><a href="#a"${cell("crumb-parent", t.ink2, P, P, "text", th)}>艺人</a>${icon("chevron-right", { size: 11 })}<b${cell("crumb-current", t.ink, P, P, "text", th)}>名册</b></div>
<div class="ph"><h2${cell("h2", t.ink, P, P, "text", th)}>名册</h2><span class="sub"${cell("sub", t.ink3, P, P, "text", th)}>24 人 · 3 人待邀请</span><span class="act"><button type="button" class="ts-btn">导出${icon("external-link", { size: 14 })}</button><button type="button" class="ts-btn primary"${cell("btn-primary", t.onAcc, t.acc, P, "text", th)}>${icon("plus", { size: 14 })}邀请成员</button></span></div>
<div class="tabs"><a class="on" href="#1"${cell("tab-on", t.ink, P, P, "text", th)}>全部<span class="n">24</span></a><a href="#2"${cell("tab-off", t.ink3, P, P, "text", th)}>签约<span class="n">18</span></a><a href="#3">试用<span class="n">4</span></a><a href="#4">待邀请<span class="n">3</span></a></div>
<table class="tbl"><colgroup><col style="width:34%"><col style="width:14%"><col style="width:16%"><col style="width:20%"><col style="width:16%"></colgroup><thead><tr><th${cell("th", t.ink3, P, P, "text", th)}>艺人</th><th>分组</th><th>状态</th><th>合约到期</th><th class="r">更新</th></tr></thead><tbody>${trs}</tbody></table>
<div class="tfoot">显示 8 / 24 ${icon("chevron-right", { size: 11 })}</div>`;
}

// ---------- 导航模型（TMS 示例）----------
const NAV = [
  { group: "艺人", items: [["名册", "users", { on: true, star: true }], ["分组", "layers"], ["合约", "book-open"], ["结算单", "database", { star: true }]] },
  { group: "运营", items: [["排期", "calendar", { star: true }], ["直播", "globe-2"], ["活动", "package"], ["报表", "layout-grid"]] },
  { group: "系统", items: [["成员", "users"], ["权限", "shield-check"], ["设置", "settings"], ["审计日志", "history"]] }
];
function item(label, ic, { on = false, star: st = false, hover = false, focus = false, count = "" } = {}, cells = "", starCells = "") {
  const cls = `ts-it${on ? " on" : ""}${hover ? " is-hover" : ""}${focus ? " is-focus" : ""}`;
  return `<a class="${cls}" href="#${label}"${on ? ' aria-current="page"' : ""}${cells}>${icon(ic, { size: 22, attrs: 'data-guide="prail"' })}<span class="t" data-text="prail">${label}${count ? `<small>${count}</small>` : ""}</span><button type="button" class="ts-star${st ? " on" : ""}" aria-pressed="${st ? "true" : "false"}" aria-label="${st ? "移出常用" : "加入常用"}：${label}"${starCells}>${star(st)}</button></a>`;
}
function strip(t, th, { tabState = "idle", open = false } = {}) {
  const P = t.bg;
  const tabCls = `ts-tab${tabState === "hover" ? " is-hover" : ""}${tabState === "focus" ? " is-focus" : ""}${open ? " open" : ""}`;
  const mk = open || tabState === "hover" ? mark(28, "color", ' data-guide="tab"') : mark(28, "mono", ' data-guide="tab"');
  return `<div class="ts-strip"><button type="button" class="${tabCls}" aria-label="打开导航" aria-expanded="${open ? "true" : "false"}" aria-haspopup="dialog" data-h="40" data-tab>${mk}</button><span class="sp"></span><div class="ts-cluster" data-cluster><button type="button" class="ts-ib" aria-label="通知 · 3 条未读"${cell("bell", t.ink2, P, P, "icon", th)}>${icon("bell", { size: 20 })}<i class="ts-dot" aria-hidden="true"></i></button><button type="button" class="ts-av" aria-label="林晓 · 账户与偏好"${cell("avatar", t.avInk, t.avBg, P, "text", th)}>林</button></div></div>`;
}
function screen({ id, night, state }) {
  const t = night ? T.night : T.light; const th = night ? "n" : "l"; const P = t.panel;
  let panel = "";
  if (state === "small") {
    const favs = [["名册", "users"], ["结算单", "database"], ["排期", "calendar"]].map(([l, ic], i) => item(l, ic, { star: true }, i === 0 ? cell("it-rest", t.ink2, P, P, "text", th) : "", i === 0 ? cell("star-on", t.acc, P, P, "icon", th) : "")).join("");
    const tops = NAV.map((g, i) => item(g.group, ["users", "calendar", "settings"][i], { count: `${g.items.length} 项` })).join("");
    panel = `<div class="ts-panel" role="dialog" aria-label="导航" data-panel="small">
<div class="ts-srch is-focus" data-h="40">${icon("search", { size: 16 })}<span class="ph2"${cell("srch-ph", t.ink2, P, P, "text", th)}><i aria-hidden="true"></i>搜索页面、艺人、合约</span><kbd${cell("srch-kbd", t.ink2, P, P, "text", th)}>⌘K</kbd></div>
<h6>常用 · 3</h6>${favs}
<h6>一级入口</h6>${tops}
<div class="ts-pfoot"><button type="button" class="ts-tbtn" aria-expanded="false"${cell("tbtn", t.ink2, P, P, "text", th)}>${icon("layout-grid", { size: 14 })}展开完整菜单</button><button type="button" class="ts-pin" aria-label="钉住为侧栏">${icon("panel-left-open", { size: 16 })}</button><span class="hint"${cell("hint", t.ink3, P, P, "text", th)}>Esc 关闭</span></div>
</div>`;
  } else if (state === "expanded") {
    const cols = NAV.map((g, gi) => `<div class="ts-col"><h6>${g.group}</h6>${g.items.map(([l, ic, o = {}], ii) => {
      const hover = gi === 0 && ii === 2; // 合约 · hover：星号出现
      const cells = gi === 0 && ii === 0 ? cell("it-on", t.ink, t.wash, P, "text", th) : hover ? cell("it-hover", t.ink, t.hover, P, "text", th) : gi === 1 && ii === 1 ? cell("it-rest2", t.ink2, P, P, "text", th) : "";
      const sc = gi === 0 && ii === 0 ? cell("star-on-wash", t.acc, t.wash, P, "icon", th) : hover ? cell("star-outline", t.ink3, t.hover, P, "icon", th) : "";
      return item(l, ic, { ...o, hover }, cells, sc);
    }).join("")}</div>`).join("");
    panel = `<div class="ts-panel x" role="dialog" aria-label="导航" data-panel="expanded">
<div class="ts-srch x" data-h="40">${icon("search", { size: 16 })}<span class="ph2"${cell("srch-ph-wash", t.ink2, t.wash, P, "text", th)}>搜索页面、艺人、合约</span><kbd${cell("srch-kbd-wash", t.ink2, t.wash, P, "text", th)}>⌘K</kbd><button type="button" class="ts-x" aria-label="关闭导航">${icon("x", { size: 14 })}</button></div>
<div class="ts-cols">${cols}</div>
<div class="ts-pbar"><div class="ts-crumbs"><span${cell("pbar-label", t.ink3, P, P, "text", th)}>当前位置</span><a href="#a">艺人</a>${icon("chevron-right", { size: 11 })}<b>名册</b></div><button type="button" class="ts-pin" aria-label="钉住为侧栏">${icon("panel-left-open", { size: 16 })}</button><button type="button" class="ts-lock" aria-label="切换产品 · 当前 TCRN TMS" aria-haspopup="menu">${mark(22, "color")}<span><b${cell("lock-b", t.ink, P, P, "text", th)}>TCRN <em${cell("lock-em", DEEP[night ? "night" : "light"], P, P, "text", th)}>TMS</em></b><small${cell("lock-small", t.ink3, P, P, "text", th)}>艺人管理系统</small></span>${icon("chevron-down", { size: 16 })}</button></div>
</div>`;
  }
  const open = state !== "closed";
  return `<div class="scr gp ts${night ? " night" : ""}" data-shell="${id}" data-state="${state}">
${grain("g-" + id)}
<div class="lay">
${strip(t, th, { open, tabState: state === "closed" && !night ? "idle" : "idle" })}
<div class="ts-paper" data-paper><div class="ts-content">${paperBody(t, th)}</div></div>
${panel}
</div>
</div>`;
}
function phone({ id, night, sheet }) {
  const t = night ? T.night : T.light; const th = night ? "n" : "l"; const P = t.panel;
  const list = ROWS.slice(0, 6).map(([n, id2, g, st, stl]) => `<div class="ts-li"><span class="av">${n[0]}</span><b>${n}</b><span class="st${st ? " " + st : ""}"><i></i>${stl}</span></div>`).join("");
  const sh = sheet ? `<div class="ts-scrim" aria-hidden="true"></div><div class="ts-sheet" role="dialog" aria-label="导航"><div class="ts-grab" aria-hidden="true"></div>
<div class="ts-srch" data-h="44">${icon("search", { size: 16 })}<span class="ph2">搜索页面、艺人、合约</span></div>
<h6>常用 · 3</h6>${[["名册", "users"], ["结算单", "database"], ["排期", "calendar"]].map(([l, ic]) => item(l, ic, { star: true })).join("")}
<h6>一级入口</h6>${NAV.map((g, i) => item(g.group, ["users", "calendar", "settings"][i], { count: `${g.items.length} 项` })).join("")}
</div>` : "";
  return `<div class="scr gp ts m${night ? " night" : ""}" data-shell="${id}" data-state="${sheet ? "sheet" : "closed"}">
${grain("g-" + id)}
<div class="lay">
${strip(t, th, { open: !!sheet })}
<div class="ts-paper" data-paper><div class="ts-content"><div class="ts-crumbs"><a href="#a">艺人</a>${icon("chevron-right", { size: 11 })}<b>名册</b></div><div class="ph"><h2>名册</h2><span class="sub">24 人</span></div><div class="ts-list">${list}</div></div></div>
${sh}
</div>
</div>`;
}
const shot = (html, title, note) => `<div class="shot">${html}<div class="cap"><b>${title}</b><span>${note}</span></div></div>`;

// ---------- 钉住态 = 构图一（文档站默认）----------
const pinned = shell({
  id: "ts-pinned-l",
  night: false,
  nav: [{ group: "组件" }, { id: "a", icon: "layers", label: "Typography" }, { id: "b", icon: "layout-grid", label: "Icon" }, { id: "c", icon: "package", label: "Actions", on: true }, { id: "d", icon: "settings", label: "Inputs" }, { group: "基础" }, { id: "e", icon: "palette", label: "Token" }, { id: "f", icon: "book-open", label: "动效" }],
  brandHtml: `<div class="brand"><button type="button" class="ts-tab" style="width:22px;height:22px;border-radius:6px;padding:0" aria-label="收起为页签" aria-expanded="true" data-guide="rail">${mark(22, "color")}</button><span><b data-text="rail" style="line-height:1.3">TCRN <em style="font-style:normal;color:${DEEP.light}">Design System</em></b><small>设计系统 · 钉住</small></span></div>`,
  topbar: `<span class="ts-srch" style="width:220px;height:32px;margin:0"><svg class="ic" width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" aria-hidden="true"><circle cx="9" cy="9" r="5.5"/><path d="M13 13l4 4"/></svg><span class="ph2">搜索</span><kbd>⌘K</kbd></span><button type="button" class="ts-ib" aria-label="通知">${icon("bell", { size: 20 })}</button>`,
  body: `<div class="ph"><h2>Actions</h2><span class="sub">5 件 · 第一批</span></div><div class="tabs"><a class="on" href="#m">矩阵</a><a href="#s">样板</a><a href="#c">契约</a></div><p style="margin:0;font-size:12.5px;color:var(--ink-2);max-width:720px">文档站要常看树，默认钉住：侧栏 220 常驻、页签成为侧栏顶部的品牌格，点它收起为页签态。TMS、AOS、Atelier 默认隐藏。</p>`,
  user: { initial: "林", name: "林晓", role: "维护者" },
  crumbs: ["组件", "Actions"]
});

// ---------- B · 状态矩阵（fill 与 ink 成对，脚本算对比度）----------
const mkRow = (name, note, f) => ({ name, note, cells: [T.light, T.night].map((t, i) => f(t, i ? "night" : "light")) });
const matrixRows = [
  { group: "页签 ShellTab · 40 见方，挂上边界" },
  mkRow("idle · 单色标", "mono 标以 ink-2 显示，底透明（不是 50% 不透明度）", (t) => ({ fill: t.bg, ink: t.ink2, surface: t.bg, kind: "icon", fillLabel: "bg", inkLabel: "ink-2" })),
  mkRow("hover / open · 彩色标 · 深色臂与头", "换彩色标，底加 6% 墨洗。标的两色只供参考，不进门（Brand 板 G 段同一规则：形不是文字）；辨识靠轮廓与墨洗底", (t, th) => ({ fill: t.wash, ink: "#2c63c8", surface: t.bg, kind: "icon", exempt: true, fillLabel: "wash", inkLabel: "标深色 #2c63c8" })),
  mkRow("hover / open · 彩色标 · 亮色臂", "同上，参考值", (t) => ({ fill: t.wash, ink: "#7aa0f5", surface: t.bg, kind: "icon", exempt: true, fillLabel: "wash", inkLabel: "标亮色 #7aa0f5" })),
  mkRow("focus · 环", "2px 承载面间隙 + 2px 强调色（--focus）", (t) => ({ fill: t.bg, ink: t.acc, surface: t.bg, kind: "edge", fillLabel: "bg", inkLabel: "acc" })),
  { group: "右上簇 · 铃铛 32、头像 28，与页签同一水平带" },
  mkRow("铃铛 · rest", "ink-2 于画布", (t) => ({ fill: t.bg, ink: t.ink2, surface: t.bg, kind: "icon", fillLabel: "bg", inkLabel: "ink-2" })),
  mkRow("铃铛 · hover", "ink 于 6% 墨洗", (t) => ({ fill: t.wash, ink: t.ink, surface: t.bg, kind: "icon", fillLabel: "wash", inkLabel: "ink" })),
  mkRow("未读点", "red 于画布，外圈 2px 画布色隔开", (t) => ({ fill: t.bg, ink: t.red, surface: t.bg, kind: "edge", fillLabel: "bg", inkLabel: "red" })),
  mkRow("头像字", "av-ink 于 av-bg", (t) => ({ fill: t.avBg, ink: t.avInk, surface: t.bg, kind: "text", fillLabel: "av-bg", inkLabel: "av-ink" })),
  { group: "面板 ShellPanel · 纸面，s3 阴影；不用玻璃，菜单文字的对比度不能随底下内容变" },
  mkRow("面板面 vs 画布", "边界由 s3 的 1px 环与阴影给出，不靠色差", (t) => ({ fill: t.bg, ink: t.panel, surface: t.bg, kind: "edge", exempt: true, fillLabel: "bg", inkLabel: "panel" })),
  mkRow("搜索 · 占位", "SearchInput 墨洗工具形态：占位 ink-2 于 wash（D2）", (t) => ({ fill: t.wash, ink: t.ink2, surface: t.panel, kind: "text", fillLabel: "wash", inkLabel: "ink-2" })),
  mkRow("搜索 · 快捷键 ⌘K", "ink-2 于 wash（ink-3 夜间只有 3.88，同 N-1 的改法）", (t) => ({ fill: t.wash, ink: t.ink2, surface: t.panel, kind: "text", fillLabel: "wash", inkLabel: "ink-3" })),
  mkRow("搜索 · focus", "底换纸色，加环；光标 ink", (t) => ({ fill: t.panel, ink: t.ink, surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: "ink" })),
  { group: "菜单项 NavItem · 32 高，引导列 16 / 48，星位 24 常驻" },
  mkRow("rest", "ink-2 于纸；图标 ink-3", (t) => ({ fill: t.panel, ink: t.ink2, surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: "ink-2" })),
  mkRow("rest · 图标", "ink-3 于纸", (t) => ({ fill: t.panel, ink: t.ink3, surface: t.panel, kind: "icon", fillLabel: "panel", inkLabel: "ink-3" })),
  mkRow("hover", "ink 于 3.5% 墨洗（hover）；星号出现", (t) => ({ fill: t.hover, ink: t.ink, surface: t.panel, kind: "text", fillLabel: "hover", inkLabel: "ink" })),
  mkRow("selected（当前页）", "ink 于 6% 墨洗 + 600；只此一种结构变化", (t) => ({ fill: t.wash, ink: t.ink, surface: t.panel, kind: "text", fillLabel: "wash", inkLabel: "ink" })),
  mkRow("focus", "环同页签；焦点进入时星号同 hover 出现", (t) => ({ fill: t.panel, ink: t.acc, surface: t.panel, kind: "edge", fillLabel: "panel", inkLabel: "acc" })),
  { group: "星 · 24 见方钮；rest 隐藏但占位，hover / focus 显示描边，加星后实心常显" },
  mkRow("星 · hover 描边", "ink-3 于 hover 墨洗", (t) => ({ fill: t.hover, ink: t.ink3, surface: t.panel, kind: "icon", fillLabel: "hover", inkLabel: "ink-3" })),
  mkRow("星 · 已加（实心）", "acc 于纸", (t) => ({ fill: t.panel, ink: t.acc, surface: t.panel, kind: "icon", fillLabel: "panel", inkLabel: "acc" })),
  mkRow("星 · 已加于当前页", "acc 于 6% 墨洗", (t) => ({ fill: t.wash, ink: t.acc, surface: t.panel, kind: "icon", fillLabel: "wash", inkLabel: "acc" })),
  { group: "面板底栏 · 当前位置 + 锁定块（兼切换产品）" },
  mkRow("当前位置 · 标签", "ink-3 于纸", (t) => ({ fill: t.panel, ink: t.ink3, surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: "ink-3" })),
  mkRow("锁定块 · 字标", "ink 于纸", (t) => ({ fill: t.panel, ink: t.ink, surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: "ink" })),
  mkRow("锁定块 · 后缀 TMS", "浅色 #2c63c8（D2）、夜间 #7aa0f5（O-3）于纸", (t, th) => ({ fill: t.panel, ink: DEEP[th], surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: DEEP[th] })),
  mkRow("锁定块 · 标语", "ink-3 于纸", (t) => ({ fill: t.panel, ink: t.ink3, surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: "ink-3" })),
  { group: "纸 · PageHeader 承担方位" },
  mkRow("面包屑 · 上级", "ink-2 于纸，可点", (t) => ({ fill: t.panel, ink: t.ink2, surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: "ink-2" })),
  mkRow("面包屑 · 当前", "ink 600 于纸", (t) => ({ fill: t.panel, ink: t.ink, surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: "ink" })),
  { group: "手机 390 · Sheet，遮罩 20% 墨" },
  mkRow("Sheet 行 · 44", "同菜单项 rest", (t) => ({ fill: t.panel, ink: t.ink2, surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: "ink-2" })),
  mkRow("遮罩下的纸", "纸被 20% 墨压暗，按设计不读", (t) => ({ fill: "rgba(22,21,15,.2)", ink: t.ink2, surface: t.panel, kind: "text", exempt: true, fillLabel: "scrim", inkLabel: "ink-2" }))
];
const matrix = matrixTable({ caption: "页签壳状态矩阵", cols: ["浅色", "夜间"], rows: matrixRows });

// ---------- C · 登入动画分镜 ----------
function frame({ t, card, dim, mk, pp, tab, cl, half }) {
  const m = mk ? `<span class="mk" style="left:${mk.x}px;top:${mk.y}px">${mark(mk.s, mk.mode || "color")}</span>` : "";
  return `<div class="fr${dim ? " dim" : ""}${half ? " half" : ""}">${pp ? `<div class="pp"><i style="top:14px;width:90px"></i><i style="top:26px;width:60px"></i><i style="top:48px;width:340px"></i><i style="top:60px;width:340px"></i><i style="top:72px;width:340px"></i></div>` : ""}${card ? `<div class="card"><i style="top:52px"></i><i style="top:68px"></i><i class="b" style="top:88px"></i></div>` : ""}${tab ? `<span class="tb"></span>` : ""}${cl ? `<span class="cl"></span>` : ""}${m}<span class="t">${t}</span></div>`;
}
// 1240×640 → 372×192（×0.3）：登入卡 320×360 居中，标 96；终点页签 40、标 28 于 (12,0)+6
const C = { x: 138 + 48 - 14.5, y: 42 + 12 }; // 卡内标左上（标 29）
const E = { x: 4 + 1.8, y: 1.8 }; // 页签内标左上（标 8.4）
const lerp = (a, b, p) => a + (b - a) * p;
const story = [
  frame({ t: "t = 0 · 登入成功", card: true, mk: { x: C.x, y: C.y, s: 29 } }),
  frame({ t: "t = 120 · 表单淡出 --t-fill 120ms", card: true, dim: true, mk: { x: C.x, y: C.y, s: 29 } }),
  frame({ t: "t = 240 · 标飞向页签 --t-move 240ms --ease", pp: true, half: true, mk: { x: lerp(C.x, E.x, .72), y: lerp(C.y, E.y, .72), s: lerp(29, 8.4, .72) } }),
  frame({ t: "t = 360 · 纸升起 8px → 0，右上簇淡入", pp: true, tab: true, cl: true, mk: { x: E.x, y: E.y, s: 8.4 } }),
  frame({ t: "t = 460 · 终态 = A1 闭合态（单色标）", pp: true, tab: true, cl: true, mk: { x: E.x, y: E.y, s: 8.4, mode: "mono" } })
].join("");
const storyRules = `<div class="rules">
<div class="box"><h4>播放条件</h4><ul><li>只在<b>登入成功</b>这一刻播一次；刷新、会话恢复、SSO 回跳、切换产品都不播。</li><li>一个会话内不重复；服务端渲染首屏时页签直接在终态。</li><li>总时长 <b>460ms</b>：120 淡出 + 240 位移 + 100 纸升起，上限 700。</li></ul></div>
<div class="box"><h4>实现约束</h4><ul><li>只用 <code>transform</code> 与 <code>opacity</code>，起点与终点是同一份 SVG（48 格，96 → 28 整数缩放）。</li><li>终点坐标就是页签几何，动画结束后无任何跳变；标到位后由彩色换单色（--t-fill）。</li><li>动画期间不挡交互：120ms 后指针事件穿透，键盘可直接 Tab 到页签。</li></ul></div>
<div class="box"><h4>减少动画偏好</h4><ul><li><code>prefers-reduced-motion: reduce</code> 时不播，直接呈现终态。</li><li>面板开合、星号出现同样尊重该偏好：时长归零。</li><li>门：带偏好的渲染里 transition 时长读数为 0，动画次数计数为 0。</li></ul></div>
</div>`;

// ---------- D · 几何 ----------
const geoHtml = `<div class="geo gp" aria-label="几何示意">
<div class="g" style="left:12px;top:0;width:40px;height:40px"></div><span class="l" style="left:58px;top:4px"><b>页签</b> 40 × 40 · left 12 · top 0 · 圆角 0 0 10 10 · 标 28</span>
<div class="g p" style="left:12px;top:52px;width:1216px;height:576px"></div><span class="l" style="left:30px;top:60px"><b>纸</b> left 12 · top 52 · right 12 · bottom 12 · 圆角 14 · s1</span>
<span class="l" style="left:30px;top:78px"><b>顶带</b> 0 → 52：画布色，无底无线；= 页签 40 + 间隙 12</span>
<div class="g" style="left:12px;top:52px;width:320px;height:300px"></div><span class="l" style="left:30px;top:330px"><b>面板 · 小</b> left 12 · top 52 · w 320 · 内距 8 · 圆角 12 · s3</span>
<div class="g" style="left:12px;top:52px;width:952px;height:420px;box-shadow:inset 0 0 0 1px var(--acc-ul)"></div><span class="l" style="left:30px;top:450px;color:var(--acc-ul)"><b>面板 · 完整</b> w 952 · max-h 576（= 640 − 52 − 12）· 3 列 · 底栏 44</span>
<div class="g" style="left:28px;top:118px;width:22px;height:22px"></div><span class="l" style="left:60px;top:121px"><b>引导列</b> 面板内图标 16 · 文字 48（= 8 内距 + 8 行内距 + 22 + 10）</span>
<div class="g" style="left:296px;top:118px;width:24px;height:24px"></div><span class="l" style="left:60px;top:150px"><b>星位</b> 24 常驻 · 行尾（框在 x 296）</span>
<div class="g" style="left:1158px;top:4px;width:70px;height:32px"></div><span class="l" style="left:960px;top:9px"><b>右上簇</b> 右缘 = 纸右缘 1228 · 铃铛 32 · 头像 28</span>
<span class="l" style="left:30px;top:560px;color:var(--ink-3)">所有数值为板上起点值，由门量定；手机 390：页签同几何，面板改底部 Sheet（max-h 80%）、行 44。</span>
</div>`;
const geoRows = kvTable([
  ["项", "值", "来自", "关系断言（门量）"],
  ["顶带高", "52", "--h-lg 40 + --pad-md 12", "顶带无背景无边线；纸顶 = 52"],
  ["页签", "40 × 40，left 12，top 0，圆角 0 0 10 10", "--h-lg；--pad-md；圆角 10 = r-ctl 8 + 2", "页签左缘 = 纸左缘 = 面板左缘 = 12"],
  ["页签内标", "28，单色 ink-2 / 彩色", "ProductLogo 阶梯 22 · 28 · 38 · 56", "标居中于页签，四边 6"],
  ["纸", "left/right/bottom 12，top 52，圆角 14，s1", "构图一纸面规则不变", "纸右缘 1228 = 右上簇右缘"],
  ["右上簇", "高 40 与页签同带；铃铛 32，头像 28，间 6", "--h-md 32；头像 28", "簇内元素垂直中线 = 20 = 页签中线"],
  ["面板 · 小", "w 320，内距 8，圆角 12，s3；搜索 40；行 32", "320 = 8 × 40；--srch-h = --h-lg；--row-h = --h-md", "面板左 12、顶 52；引导列 16 / 48"],
  ["面板 · 完整", "w 952，max-h 576，3 列 gap 16，底栏 44", "952 = 3 × 296 + 2 × 16 + 2 × 16", "不超出屏幕；底栏锁定块右缘 = 面板右缘 − 12"],
  ["星位", "24 常驻，钮 24 × 24，图标 16", "--star 24", "rest 与 hover 行的文字宽度相等（无抖动）"],
  ["面包屑", "纸内 PageHeader 首行，单行截断加 title", "C7", "任何宽度下一行"],
  ["手机 390", "页签同几何；Sheet max-h 80%、行 44、遮罩 20% 墨", "INC-399 可达性门", "页签在 390 宽可点；Sheet 内行高 44"]
], [150, 420, 300, 0]);

// ---------- E · 消费方契约 ----------
const contract = `<div class="cols3">
<div class="box"><h4>产品须提供</h4><ul>
<li><b>菜单模型</b>：分组 → 项（图标名出自名册、路由、五语标签）；深层级给 TreeNav 节点，宽浅层级给多列。</li>
<li><b>常用存储</b>：每用户每产品，服务端偏好（跨设备）；上限 10，超出滚动；顺序为加星顺序；无星时显示最近访问 5 条。</li>
<li><b>搜索提供者</b>：目标集合 = 菜单项 + 常用 + 记录（艺人、合约）；复用 ProductShellSearch。</li>
<li><b>产品清单</b>：锁定块点开 ProductSwitcher 的产品列表与当前产品。</li>
<li><b>通知计数</b>：铃铛未读数；头像菜单项（账户、主题、语言、退出）。</li>
<li><b>PageHeader 必有</b>：面包屑 + 标题 + 动作；没有顶栏后它是唯一的方位。</li>
</ul></div>
<div class="box"><h4>何时用与不用</h4><ul>
<li>TMS、AOS、Atelier 默认<b>隐藏</b>；DS 文档站默认<b>钉住</b>（侧栏 220，构图一）。</li>
<li>页签是桌面端唯一的导航触发器；不做漂浮球，不可拖。</li>
<li>面板是临时浮层：选中、Esc、点外部即收；钉住后变推挤布局。</li>
<li>模块内的页签切换用页内 Tabs，不进面板；SubNav 只在纸内。</li>
<li>专注模式（隐藏顶带）只保留页签与簇，位置不变。</li>
</ul></div>
<div class="box"><h4>键盘与读屏</h4><ul>
<li><code>⌘K / Ctrl+K</code> 打开面板并聚焦搜索；<code>Esc</code> 关闭，焦点回页签；面板内 ↑↓ 走项，→ 展开完整菜单。</li>
<li>页签 <code>aria-expanded</code>、<code>aria-haspopup="dialog"</code>；面板 <code>role="dialog"</code> 非模态，Tab 不被困住。</li>
<li>星钮是真按钮，<code>aria-pressed</code>，可见名「加入常用：名册」；行获焦时星同 hover 出现。</li>
<li>所有可见字符串五语同源；图标钮都有 aria-label。</li>
<li>触摸端：页签与簇 ≥ 40，Sheet 行 44，星钮 44 热区。</li>
</ul></div>
</div>`;

// ---------- F · token 差异 ----------
const tokens = kvTable([
  ["token", "值", "状态", "说明"],
  ["shell.strip-h", "52", "新", "顶带高；取代 topbar-h 的含义，值相同"],
  ["shell.tab", "40", "新", "页签边长 = h-lg"],
  ["shell.tab-x", "12", "新", "页签离左 = pad-md"],
  ["shell.tab-mark", "28", "新", "页签内标尺寸，取自 ProductLogo 阶梯"],
  ["shell.panel-w", "320", "新", "小面板宽"],
  ["shell.panel-w-expanded", "952", "新", "完整菜单宽"],
  ["shell.panel-max-h", "viewport − 52 − 12", "新", "面板最大高"],
  ["shell.row-h", "32 / 触摸 44", "新", "菜单项高 = h-md；触摸端 44"],
  ["shell.star", "24", "新", "星位与星钮"],
  ["shell.srch-h", "40 / 触摸 44", "新", "面板内搜索高 = h-lg"],
  ["favorites.max / recent.max", "10 / 5", "新", "常用上限；无星时最近访问条数"],
  ["motion.intro", "120 + 240 + 100 = 460，上限 700", "新", "登入动画；用 t-fill、t-move、ease"],
  ["rail-w / rail-w-collapsed", "220 / 52", "保留", "只给钉住态（文档站）"],
  ["topbar-h", "52", "退役", "顶栏不再常驻；值由 strip-h 接管"],
  ["icon 名册", "+ star（描边 / 实心）", "新 · 待 Owner", "D2 名册 37 件 → 38；20 格、1.25 描边；实心版只换 fill"],
  ["tab.idle 不透明度", "无", "不采用", "空闲态用单色标 ink-2，不用 50% 不透明度（对比度不可算、触摸端无悬停、品牌不重绘）"]
], [220, 260, 110, 0]);

// ---------- G · 门 ----------
const gates = kvTable([
  ["门", "量什么", "会红的变异"],
  ["页签几何", "页签 40 × 40，left 12，top 0；标 28 居中", "把 left 改 16"],
  ["顶带", "0 → 52 无背景无边线；纸顶 52", "顶带加 1px 底线"],
  ["三缘对齐", "页签左 = 纸左 = 面板左 = 12；簇右 = 纸右", "簇 padding 改 8"],
  ["面板锚点与边界", "面板 left 12、top 52，不超出视口；完整 w 952", "max-h 去掉"],
  ["引导列", "面板内图标 16、文字 48；钉住态 16 / 48", "行内距改 10"],
  ["星位无抖动", "同一项 rest 与 hover 的文字盒宽相等；星钮 24", "星 display:none → inline"],
  ["每格对比度", "本板矩阵每格 ≥ 4.5 / 3，与 story 逐格比对", "占位改 ink-3 于 wash 夜间"],
  ["单行与溢出", "所有行文字一行、无元素超出裁切祖先", "标签加长 40 字"],
  ["阴影模糊", "≤ 3px（s1 / s2 / s3）", "面板阴影改 12px"],
  ["登入动画", "每会话 1 次；刷新 0 次；reduced-motion 下 0 次且 transition 时长 0", "去掉会话标记"],
  ["焦点回路", "Esc 后 activeElement = 页签；⌘K 后 = 搜索框", "关闭时不还焦点"],
  ["触摸端", "390 宽页签可点，Sheet 行 44，星钮热区 44", "行高改 32"],
  ["常用上限", "第 11 颗星被拒并提示；无星时最近 5 条", "上限改 0"]
], [200, 560, 0]);

// ---------- H · Initiative 草案 ----------
const initiative = kvTable([
  ["Epic（草案）", "件数", "Story 草案", "依赖"],
  ["A · 壳层 Shell", "9 + 2 新件", "S1 壳 token 进 ui-tokens；S2 ShellTab 单色 / 彩色换与三态 aria；S3 小面板（搜索、常用、一级入口、记忆展开）；S4 完整菜单（三列、当前位置、锁定块切产品）；S6 ProductShell 三态布局与偏好（cookie + localStorage + 服务端）；S7 登入动画 ShellIntro", "EPIC-039 token（已进包）"],
  ["B · 导航 Navigation", "13 → 10（Tabs 合并）", "S5 NavItem 星位与常用契约；S8 家族焕新：NavGroup、TreeNav 进面板，Breadcrumb 进 PageHeader，Tabs 三变体合一，SkipLink、Pagination；S10 手机 Sheet 与 INC-399 门", "A"],
  ["C · 布局 Layout", "9", "S9 PageHeader 必有（面包屑、标题、动作）；Surface、Divider、SplitView、DetailLayout 在纸内重排", "A"],
  ["D · Storybook 壳改纯包", "—", "S11 删 80 条 tcrn-doc- 骨架、4 条文档作用域例外、2 条白名单；文档站默认钉住；文档导航用包 TreeNav；搜索用 ProductShellSearch；S12 第一批五样板换新壳重渲染，shellFrame / rail 门改值；S14 画布到 story 映射更新", "A B C"],
  ["E · 门", "—", "S13 新门：页签 / 顶带 / 面板几何、三缘对齐、星位无抖动、动画一次、reduced-motion、触摸 44、焦点回路、常用上限；接入 verify 与 CI", "A B"],
  ["F · 4.0.0 候选", "—", "S15 版本面、CHANGELOG、迁移说明（自 STORY-134 移来）、目视验收清单", "全部"]
], [200, 130, 0, 150]);
const initiativeNote = `<div class="cols2">
<div class="box"><h4>INIT 草案 <small>键号待开；本板通过后再落链</small></h4><p class="lead">DS 第二批：页签壳、导航与布局进包，Storybook 壳改为纯包。</p><ul>
<li><b>范围</b>：壳层 9 件 + ShellTab、ShellPanel 两件新件；导航 13 件；布局 9 件；Storybook 文档壳；门；4.0.0 候选。第三批以后家族不动，豁免登记照旧。</li>
<li><b>取代</b>：D1 的「构图一、构图三按页选」→「一个壳、三态」；构图三的 1040 居中只留给文档与设置页；上一轮三态导航方案的触发器由页签承担。</li>
<li><b>回路</b>：同 INIT-015：批量处理原则 v3，拆分一次、分包并行（上限 3）、集成一次、批末门与验收一次、一次链写；经济档拆分与实施，主力档验收。</li>
<li><b>停点</b>：推送、打 tag、发版、部署、目视验收仍是 Owner 停点；本板通过前不开单。</li>
</ul></div>
<div class="box"><h4>待 Owner <small>按 2026-10-13 对话</small></h4><ol>
<li>采用页签壳，取代构图一、三与三态方案；D1 由新纪要取代。<b>建议：是。</b></li>
<li>五处修改（空闲态单色标；小面板加一级入口并记忆展开；右上角镜像簇；锁定块兼切产品；动画只在登入播一次并尊重减少动画偏好）。<b>不回复即按本板。</b></li>
<li>文档站保留钉住态；TMS、AOS、Atelier 关。<b>建议：按此。</b></li>
<li>图标名册加 star（描边 / 实心），37 → 38。<b>建议：加。</b></li>
<li>本板通过后：开 INIT，画布到 story 映射与 shellFrame 门改值随 S12、S14。</li>
</ol></div>
</div>`;

// ---------- 打回自检 ----------
const selfCheck = `<div class="box"><h4>打回根因自检 <small>十一类逐条</small></h4><ul>
<li><b>1 留白补画</b>：资产只用 logos2 的 TMS 标；数值全部在 D 段表里，来源列写明 token。</li>
<li><b>2 状态成对</b>：B 段每格 fill / ink 成对，脚本算对比度；状态选择器与变体同为两类，星号出现的后代规则只改 opacity。</li>
<li><b>3 几何测量</b>：发布前用 measure.js 八项 + measure-shell.js（页签、顶带、三缘、面板、星位）量过。</li>
<li><b>4 分叉</b>：夜间同一规则只换 token；面板内搜索沿用 B1-Inputs 的墨洗工具形态；按钮沿用 B1-Actions 对表。</li>
<li><b>5 套路</b>：无左边条、无渐变、无光斑、无模糊云阴影（s3 ≤ 3px）、无卡套卡、无漂浮球；玻璃未用。</li>
<li><b>6 控件语义</b>：页签是 button + aria-expanded；菜单项是 a；星是 button + aria-pressed；锁定块是 button + aria-haspopup。</li>
<li><b>7 门</b>：G 段每门附一条会红的变异。</li>
<li><b>8 文案</b>：所有可见字符串按五语源；示例文案为 zh-CN。</li>
<li><b>9 密度</b>：行 32 / 触摸 44，标题 26 衬线，正文 12.5–13。</li>
<li><b>10 截断</b>：所有单行元素 nowrap + ellipsis，面包屑带 title。</li>
<li><b>11 表面模型</b>：顶带是画布，不是白卡；纸只有一张；面板是浮层（s3），右上簇无底。</li>
</ul></div>`;

// ---------- 页面 ----------
const body = `
<header class="bh">
<div>
<p class="k">Batch two · Shell · draft 1 · 2026-10-13 · awaiting Owner</p>
<h1>页签壳：一个产品标页签，一张纸<em>，导航召之即来</em></h1>
<p>壳只剩三样：顶带上挂一枚 40 见方的产品标页签、右上一组镜像的铃铛与头像、一张离边 12 的纸。导航按三层递进：点页签出小面板（搜索、常用、一级入口），再展开为完整菜单（三列、当前位置、右下角锁定块兼切换产品）；每项悬停出星，加星进常用。登入成功时标从屏幕中央收敛到页签，一次教会用户入口在哪。Owner 2026-10-13 方案加五处修改：空闲态用单色标而不是 50% 不透明度；小面板加一级入口并记住上次是否展开；右上角放头像与通知；锁定块兼切产品；动画只在登入播一次并尊重减少动画偏好。</p>
</div>
<div class="meta"><b>顶带 52 · 页签 40 · 纸离边 12</b>横向多出整条侧栏，纵向多出 12<b>面板 320 → 952</b>覆盖不推挤；选中、Esc、点外部即收<b>常用 10 · 最近 5</b>星位 24 常驻，无抖动<b>登入动画 460ms</b>只播一次；减少动画时直接终态</div>
</header>

<div class="sec"><h3><b>A</b>三态 · 浅色与夜间 <span>闭合 → 小面板 → 完整菜单；每屏 1240 × 640，纸上是同一页名册，面板覆盖它而不推挤它</span></h3>
<div class="screens gp">${shot(screen({ id: "ts-closed-l", night: false, state: "closed" }), "A1 · 闭合态 · 浅色", "单色标 ink-2 于画布 · 右上簇 · 纸从 52 起")}${shot(screen({ id: "ts-closed-n", night: true, state: "closed" }), "A2 · 闭合态 · 夜间", "同一规则只换 token")}</div>
<div class="screens gp">${shot(screen({ id: "ts-small-l", night: false, state: "small" }), "A3 · 小面板 · 浅色", "点页签：彩色标 + 6% 墨洗 · 搜索获焦 · 常用 3 · 一级入口 · 展开钮与钉住钮")}${shot(screen({ id: "ts-small-n", night: true, state: "small" }), "A4 · 小面板 · 夜间", "")}</div>
<div class="screens gp">${shot(screen({ id: "ts-x-l", night: false, state: "expanded" }), "A5 · 完整菜单 · 浅色", "向右向下展开 952 · 三列 · 名册当前页（6% 墨洗 + 600 + 实心星）· 合约 hover 出描边星 · 底栏当前位置 + 锁定块")}${shot(screen({ id: "ts-x-n", night: true, state: "expanded" }), "A6 · 完整菜单 · 夜间", "后缀 #7aa0f5（O-3）")}</div>
<div class="screens last gp">${shot(pinned, "A7 · 钉住态 · 文档站默认", "= 构图一：侧栏 220 常驻，页签成为侧栏顶部的品牌格")}${shot(phone({ id: "ts-m-l", night: false }), "A8 · 手机 390 · 闭合", "页签同几何")}${shot(phone({ id: "ts-m-s", night: false, sheet: true }), "A9 · 手机 390 · Sheet", "底部弹层，行 44，遮罩 20% 墨")}</div>
</div>

<div class="sec"><h3><b>B</b>状态矩阵 <span>variant × state × theme；fill 与 ink 成对，数字由脚本算，与 A 段 data-cell 逐格比对</span></h3>${matrix}</div>

<div class="sec"><h3><b>C</b>登入动画 <span>分镜按 0.3 缩放；只用 transform 与 opacity；同一份 SVG 从 96 到 28</span></h3><div class="story gp">${story}</div>${storyRules}</div>

<div class="sec"><h3><b>D</b>几何 <span>起点值与关系断言；由门量定，不目测</span></h3><div class="two"><div>${geoHtml}</div><div>${geoRows}</div></div></div>

<div class="sec"><h3><b>E</b>消费方契约 <span>须提供什么 · 何时用与不用 · 键盘与读屏</span></h3>${contract}</div>

<div class="sec"><h3><b>F</b>与 G+ 底盘的 token 差异 <span>新增、保留、退役</span></h3>${tokens}</div>

<div class="sec"><h3><b>G</b>门 <span>每门一条会红的变异</span></h3>${gates}</div>

<div class="sec"><h3><b>H</b>Initiative 草案 <span>本板通过后开单；Epic 与 Story 草案，不是链上 scope</span></h3>${initiative}${initiativeNote}</div>

<div class="sec"><h3><b>I</b>自检 <span>打回根因十一类</span></h3>${selfCheck}</div>
`;

const OUTFILE = fileURLToPath(new URL("../boards/V2-B2-Shell-Draft.dc.html", import.meta.url));
const html = page({ title: "页签壳草案一 · 第二批", css, body, height });
fs.writeFileSync(OUTFILE, html);
console.log("wrote", OUTFILE, html.length, "bytes");
