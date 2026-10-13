// V2-B2-Shell-Draft2.dc.html — 第二批 · 页签壳草案二 r5（2026-10-13）。
// r6：顶带整行（标按钮、固定项、右上簇）中线放在 26，标按钮不再挂上边界；完整菜单底栏连同面板底内距一起居中（52），锁定块在分隔线到面板底缘之间居中。
// r5：第二版卡片居中（侧栏尺度宽度自适应）；固定二级菜单下拉改紧凑：宽 240、内距 6、搜索 sm 28、行无图标列文字起点 16。
// r4：恢复第三轮第 4 条的固定二级菜单下拉与三四级级联（r3 误删）；移除钉住态常驻侧栏（第四轮第 5 条的本意），文档站同样用顶带壳，目录与书签进页内；
// 保留 r3 的四处：标居中、固定项等距无分割线、右下角锁定块侧栏尺度、浮层与键接续 6px（完整菜单与下拉都按此）。
// 品牌资产出自 V2-B2-Logos-Draft 通过稿：标 = logos2/tms.svg 原样；锁定块 = E 段 .lk 原样；侧栏尺度 = E 段 .rail 原样；第二版 = 锁定块首行居中。
// 用法：node tools/build-shell2.mjs <高度>
import { T, cr, fmt, icon, grain, matrixTable, kvTable, page } from "./lib.mjs";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

// 画布画板高度上限 8000：壳层板拆成两块（上：标三版、三态、矩阵、动效；下：几何、契约、token、门，草稿另含差异表、Initiative 草案、自检）
const ARGS = process.argv.slice(2);
const FINAL = ARGS.includes("final");
const argN = (k) => { const i = ARGS.indexOf(k); return i >= 0 ? Number(ARGS[i + 1]) : 0; };
const H1 = argN("--h1"), H2 = argN("--h2");
const height = H1; // 兼容旧变量名（上半块高度）
const LOGOS = fileURLToPath(new URL("../logos2/", import.meta.url));
const svgBody = (f) => fs.readFileSync(LOGOS + f, "utf8").replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").trim();
const BODY = { tms: svgBody("tms.svg") };
const DEEP = { tms: "#2c63c8" };
const mark = (size, k = "tms", extra = "") => `<svg viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true" data-logo="${k}" data-mode="color" data-size="${size}"${extra}>${BODY[k]}</svg>`;
const wm = (em = "") => `TCRN <em style="color:${DEEP.tms}"${em}>TMS</em>`;
const ZH = "艺人管理系统";
const lockup = () => `<div class="lk" role="img" aria-label="TCRN TMS ${ZH}" data-lockup="lk">${mark(44)}<span class="w" aria-hidden="true"><b>${wm()}</b><small>${ZH}</small></span></div>`;
const lockupLine = () => `<div class="lk" role="img" aria-label="TCRN TMS" data-lockup="lk-line">${mark(44)}<span class="w" aria-hidden="true"><b>${wm()}</b></span></div>`;
const railLockup = (cells = {}) => `<div class="lkr" role="img" aria-label="TCRN TMS ${ZH}" data-lockup="lkr">${mark(22)}<span aria-hidden="true"><b${cells.b || ""}>${wm(cells.em || "")}</b><small${cells.small || ""}>${ZH}</small></span></div>`;
const railLine = () => `<div class="lkr" role="img" aria-label="TCRN TMS" data-lockup="lkr-line">${mark(22)}<span aria-hidden="true"><b>${wm()}</b></span></div>`;

const PIN_BODY = "M8 3.5h4v5.5l2.5 2.5v1.5h-9v-1.5L8 9z";
const pin = (on = false, size = 16) => `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true" data-icon="${on ? "pin-filled" : "pin"}"><path d="${PIN_BODY}"${on ? ' fill="currentColor"' : ""} vector-effect="non-scaling-stroke"/><path d="M6.5 3.5h7" vector-effect="non-scaling-stroke"/><path d="M10 13v3.5" vector-effect="non-scaling-stroke"/></svg>`;
const chev = (dir, size = 16, extra = "") => icon(dir === "up" ? "chevron-up" : dir === "right" ? "chevron-right" : "chevron-down", { size, attrs: extra });
const cell = (id, ink, fill, surface, kind = "text", th = "l") => ` data-cell="${id}-${th}" data-kind="${kind}" data-expect="${fmt(cr(ink, fill, surface))}"`;

// ---------- 板内 CSS ----------
const css = `
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
/* 标三版 */
.vers{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.ver{display:flex;flex-direction:column;gap:10px;min-width:0;color:var(--ink)}
.ver .st{display:flex;align-items:center;justify-content:center;gap:40px;height:120px;border-radius:12px;background:var(--panel);box-shadow:var(--s1)}
.ver h5{margin:0;font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ver h5 small{font-weight:400;color:var(--ink-3);margin-left:8px}
.ver p{margin:0;font-size:12px;line-height:1.55;color:var(--ink-2)}
/* 登入动画分镜（×0.3） */
.story{display:grid;grid-template-columns:repeat(5,372px);column-gap:36px;align-items:start}
.fr{position:relative;width:372px;height:192px;border-radius:8px;background:var(--bg);box-shadow:var(--s1);overflow:hidden}
.fr .card{position:absolute;left:138px;top:36px;width:96px;height:120px;border-radius:6px;background:var(--panel);box-shadow:var(--s2)}
.fr .card i{position:absolute;left:12px;width:72px;height:9px;border-radius:2px;background:var(--wash)}
.fr .card i.b{background:var(--acc)}
.fr .card i.w{left:30px;width:36px;height:4px;background:var(--ink)}
.fr .card i.w2{left:36px;width:24px;height:3px;background:var(--line-3)}
.fr .mk{position:absolute;display:block}
.fr .pp{position:absolute;left:4px;top:16px;width:364px;height:172px;border-radius:5px;background:var(--panel);box-shadow:var(--s1)}
.fr .pp i{position:absolute;left:10px;height:4px;border-radius:2px;background:var(--wash)}
.fr .wm{position:absolute;left:14px;top:7px;width:18px;height:3px;border-radius:2px;background:var(--ink)}
.fr .pn{position:absolute;left:46px;top:6px;width:60px;height:6px;border-radius:3px;background:var(--wash)}
.fr .cl{position:absolute;right:4px;top:6px;width:22px;height:8px;border-radius:4px;background:var(--wash)}
.fr.dim .card{opacity:.35}
.fr.half .pp{opacity:.45;transform:translateY(3px)}
.fr .t{position:absolute;left:8px;bottom:6px;font-family:var(--mono);font-size:10px;color:var(--ink-3);white-space:nowrap}
.rules{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
/* 几何：真实屏幕加标尺 */
.spec{position:relative;width:1420px;height:790px}
.spec>.scr{position:absolute;left:120px;top:80px}
.rul{position:absolute;left:0;top:0;pointer-events:none}
.rul line{stroke:var(--acc);stroke-width:1}
.rul line.ext{stroke:var(--acc-ul);stroke-dasharray:3 3}
.rul line.mid{stroke:var(--red);stroke-dasharray:4 3}
.rul text{font:10.5px var(--mono);fill:var(--acc)}
.rul text.mid{fill:var(--red)}
.specs{display:flex;flex-direction:column;gap:28px}
.spec-cap{display:flex;gap:14px;align-items:baseline;font-size:12px;color:var(--ink-2)}
.spec-cap b{color:var(--ink);font-weight:600;white-space:nowrap}
/* 几何示意（旧） */
.geo{position:relative;width:1240px;height:640px;border-radius:14px;background:var(--bg);box-shadow:var(--s1);overflow:hidden;font-family:var(--mono);font-size:10.5px;color:var(--ink-3)}
.geo .g{position:absolute;box-shadow:inset 0 0 0 1px var(--acc);border-radius:2px}
.geo .g.p{box-shadow:inset 0 0 0 1px var(--line-3);background:var(--panel)}
.geo .g.d{box-shadow:inset 0 0 0 1px var(--acc-ul)}
.geo .l{position:absolute;color:var(--acc);white-space:nowrap}
.geo .l b{color:var(--ink);font-weight:500}
`;

// ---------- 纸：名册页 ----------
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
  return `<div class="ts-crumbs"><a href="#a"${cell("crumb-parent", t.ink2, P, P, "text", th)}>艺人</a>${chev("right", 11)}<b${cell("crumb-current", t.ink, P, P, "text", th)}>名册</b></div>
<div class="ph"><h2${cell("h2", t.ink, P, P, "text", th)}>名册</h2><span class="sub"${cell("sub", t.ink3, P, P, "text", th)}>24 人 · 3 人待邀请</span><span class="act"><button type="button" class="ts-btn">导出${icon("external-link", { size: 14 })}</button><button type="button" class="ts-btn primary"${cell("btn-primary", t.onAcc, t.acc, P, "text", th)}>${icon("plus", { size: 14 })}邀请成员</button></span></div>
<div class="tabs"><a class="on" href="#1"${cell("tab-on", t.ink, P, P, "text", th)}>全部<span class="n">24</span></a><a href="#2"${cell("tab-off", t.ink3, P, P, "text", th)}>签约<span class="n">18</span></a><a href="#3">试用<span class="n">4</span></a><a href="#4">待邀请<span class="n">3</span></a></div>
<table class="tbl"><colgroup><col style="width:34%"><col style="width:14%"><col style="width:16%"><col style="width:20%"><col style="width:16%"></colgroup><thead><tr><th${cell("th", t.ink3, P, P, "text", th)}>艺人</th><th>分组</th><th>状态</th><th>合约到期</th><th class="r">更新</th></tr></thead><tbody>${trs}</tbody></table>
<div class="tfoot">显示 8 / 24 ${chev("right", 11)}</div>`;
}

// ---------- 导航模型（TMS）：分组 → 项 → 子项（三级）→ 子项（四级）----------
const NAV = [
  { group: "艺人", items: [
    ["名册", "users", { on: true, pinned: true }],
    ["分组", "layers", { hover: true }],
    ["合约", "book-open", { pinned: true, children: [["合约列表"], ["模板", { children: [["签约合同"], ["经纪合同"], ["活动合同"], ["保密协议"]] }], ["审批"], ["到期提醒"]] }],
    ["结算单", "database", { pinned: true }]
  ] },
  { group: "运营", items: [["排期", "calendar", { pinned: true, children: [["本周"], ["月视图"], ["冲突检查"]] }], ["直播", "globe-2"], ["活动", "package"], ["报表", "layout-grid"]] },
  { group: "系统", items: [["成员", "users"], ["权限", "shield-check"], ["设置", "settings"], ["审计日志", "history"]] }
];
function item(label, ic, { on = false, pinned = false, hover = false, focus = false, children = null } = {}, cells = "", pinCells = "") {
  const cls = `ts-it${ic ? "" : " noic"}${on ? " on" : ""}${hover ? " is-hover" : ""}${focus ? " is-focus" : ""}`;
  return `<a class="${cls}" href="#${label}"${on ? ' aria-current="page"' : ""}${cells}>${ic ? icon(ic, { size: 22, attrs: 'data-guide="prail"' }) : ""}<span class="t" data-text="prail">${label}${children ? chev("right", 12, 'class="ic sub"') : ""}</span><button type="button" class="ts-pinb${pinned ? " on" : ""}" aria-pressed="${pinned ? "true" : "false"}" aria-label="${pinned ? "从顶带取下" : "固定到顶带"}：${label}"${pinCells}>${pin(pinned)}</button></a>`;
}
function groupRow(name, { pinned = false, hover = false } = {}, cells = "") {
  return `<div class="ts-grp${hover ? " is-hover" : ""}"><h6${cells}>${name}</h6><button type="button" class="ts-pinb${pinned ? " on" : ""}" aria-pressed="${pinned ? "true" : "false"}" aria-label="${pinned ? "从顶带取下" : "固定到顶带"}：${name}">${pin(pinned)}</button></div>`;
}
const PINS = [["名册", { on: true }], ["合约", { menu: true }], ["结算单", {}], ["排期", { menu: true }]];
function strip(t, th, { open = false, drop = null, v1 = false } = {}) {
  const P = t.bg; const F = open ? t.hover : P;
  const brand = `<button type="button" class="ts-brand${open ? " open" : ""}${v1 ? " v1" : ""}" aria-label="${open ? "收起导航" : "展开导航"} · TCRN TMS" aria-expanded="${open ? "true" : "false"}" aria-haspopup="dialog" data-h="40" data-tab>${mark(22, "tms", ' data-guide="tab"')}${v1 ? "" : `<b${cell("brand-word", t.ink, F, P, "text", th)}>${wm(cell("brand-suffix", DEEP.tms, F, P, "text", th))}</b>`}<span class="ts-tgl"${cell("tgl", t.ink2, F, P, "icon", th)}>${chev(open ? "up" : "down", 16)}</span></button>`;
  const pins = `<nav class="ts-pins" aria-label="固定项" data-pins>${PINS.map(([l, o], i) => {
    const isOpen = drop === l;
    const cls = `ts-pin-it${o.on ? " on" : ""}${isOpen ? " open" : ""}${i === 2 && !drop ? " is-hover" : ""}`;
    const c = o.on ? cell("pin-on", t.ink, t.wash, P, "text", th) : i === 2 && !drop ? cell("pin-hover", t.ink, t.hover, P, "text", th) : i === 2 ? cell("pin-rest", t.ink2, P, P, "text", th) : "";
    if (o.menu) return `<span class="ts-pin" data-pin="${l}"><button type="button" class="${cls}" aria-haspopup="dialog" aria-expanded="${isOpen ? "true" : "false"}" aria-controls="drop-${l}"${c}${isOpen ? cell("pin-open", t.ink, t.wash, P, "text", th) : ""}${isOpen ? " data-open-pin" : ""}>${l}${chev("down", 12, i === 1 && !isOpen ? cell("pin-chev", t.ink3, P, P, "icon", th) : "")}</button></span>`;
    return `<span class="ts-pin" data-pin="${l}"><a class="${cls}" href="#${l}"${o.on ? ' aria-current="page"' : ""}${c}>${l}</a></span>`;
  }).join("")}</nav>`;
  return `<div class="ts-strip">${brand}${pins}<div class="ts-cluster" data-cluster><button type="button" class="ts-ib" aria-label="通知 · 3 条未读"${cell("bell", t.ink2, P, P, "icon", th)}>${icon("bell", { size: 20 })}<i class="ts-dot" aria-hidden="true"></i></button><button type="button" class="ts-av" aria-label="林晓 · 账户、切换产品、主题与语言"${cell("avatar", t.avInk, t.avBg, P, "text", th)}>林</button></div></div>`;
}
function dropdown(t, th, name) {
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
function screen({ id, night, state }) {
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
<div class="ts-pbar"><div class="ts-crumbs"><span${cell("pbar-label", t.ink3, P, P, "text", th)}>当前位置</span><a href="#a">艺人</a>${chev("right", 11)}<b>名册</b></div>${railLockup({ b: cell("lk-b", t.ink, P, P, "text", th), em: cell("lk-em", DEEP.tms, P, P, "text", th), small: cell("lk-small", t.ink3, P, P, "text", th) })}</div>
</div>`;
  }
  return `<div class="scr gp ts${night ? " night" : ""}" data-shell="${id}" data-state="${state}">
${grain("g-" + id)}
<div class="lay">
${strip(t, th, { open: state === "expanded", drop: state === "drop" ? "合约" : null })}
<div class="ts-paper" data-paper><div class="ts-content">${paperBody(t, th)}</div></div>
${panel}${state === "drop" ? dropdown(t, th, "合约") : ""}
</div>
</div>`;
}
function phone({ id, night, sheet }) {
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
const shot = (html, title, note) => `<div class="shot">${html}<div class="cap"><b>${title}</b><span>${note}</span></div></div>`;

// ---------- 1 · 标三版：全部出自通过稿 ----------
function versions(night) {
  return `<section class="pane gp${night ? " night" : ""}" aria-label="${night ? "夜间" : "浅色"}">${grain("lv-" + (night ? "n" : "l"))}<span class="ptag">${night ? "night" : "light"}</span>
<div class="blk"><div class="vers">
<div class="ver"><div class="st">${mark(48)}${mark(22)}</div><h5>第一版 · 纯标<small>v1 · Logos 板 A 段</small></h5><p>标本身，logos2/tms.svg 原样；阶梯 128 → 16。用在手机顶带、收起到最窄、favicon、贴片。顶带空闲态也是彩色标，不用单色版、不用半透明。</p></div>
<div class="ver"><div class="st">${lockupLine()}${railLine()}</div><h5>第二版 · 标加单行英文<small>v2 · 锁定块首行与标垂直居中 · 顶带常显</small></h5><p>通过锁定块的第一行「TCRN TMS」与标垂直居中，不重写。左为锁定块尺度（标 44 + 16/600），右为侧栏尺度（标 22 + 12.5/600），顶带用侧栏尺度。侧栏尺度指品牌板 E 段「锁定块与侧栏」里的侧栏写法；本壳没有侧栏，只借这一尺度。</p></div>
<div class="ver"><div class="st">${lockup()}${railLockup()}</div><h5>第三版 · 标加多行描述<small>v3 · Logos 板 E 段锁定块与侧栏原样</small></h5><p>左：锁定块（标 44 + 16/600 + 11.5）给登入页；右：侧栏尺度（标 22 + 12.5/600 + 10.5）给完整菜单右下角，只装饰、不可点。</p></div>
</div></div></section>`;
}

// ---------- B · 状态矩阵 ----------
const mkRow = (name, note, f) => ({ name, note, cells: [T.light, T.night].map((t, i) => f(t, i ? "night" : "light")) });
const matrixRows = [
  { group: "标按钮（第二版，侧栏尺度）· 134 × 40，居中于顶带（行中线 26），含展开收起示意" },
  mkRow("idle · 彩色标", "通过稿的标原样，100%；两色只供参考，不进门（Logos 板 G 段）", (t) => ({ fill: t.bg, ink: "#2c63c8", surface: t.bg, kind: "icon", exempt: true, fillLabel: "bg", inkLabel: "标深色 #2c63c8" })),
  mkRow("idle · 字标 TCRN", "ink 于画布", (t) => ({ fill: t.bg, ink: t.ink, surface: t.bg, kind: "text", fillLabel: "bg", inkLabel: "ink" })),
  mkRow("idle · 后缀 TMS", "通过稿 #2c63c8，两个主题同色；夜间低于 4.5，见待 Owner", (t) => ({ fill: t.bg, ink: "#2c63c8", surface: t.bg, kind: "text", fillLabel: "bg", inkLabel: "#2c63c8" })),
  mkRow("idle · 展开示意", "chevron-down ink-2 于画布，无轮廓", (t) => ({ fill: t.bg, ink: t.ink2, surface: t.bg, kind: "icon", fillLabel: "bg", inkLabel: "ink-2" })),
  mkRow("hover / open · 字标", "ink 于 3.5% 墨洗；示意换 chevron-up", (t) => ({ fill: t.hover, ink: t.ink, surface: t.bg, kind: "text", fillLabel: "hover", inkLabel: "ink" })),
  mkRow("hover / open · 后缀 TMS", "#2c63c8 于 3.5% 墨洗（6% 时浅色只有 4.31）", (t) => ({ fill: t.hover, ink: "#2c63c8", surface: t.bg, kind: "text", fillLabel: "hover", inkLabel: "#2c63c8" })),
  mkRow("focus · 环", "2px 承载面间隙 + 2px 强调色", (t) => ({ fill: t.bg, ink: t.acc, surface: t.bg, kind: "edge", fillLabel: "bg", inkLabel: "acc" })),
  { group: "顶带固定项 · 32 高；与标按钮隐形边界、彼此之间间距都是 8，无分割线；上限 6；固定的二级菜单带箭头" },
  mkRow("rest", "ink-2 于画布", (t) => ({ fill: t.bg, ink: t.ink2, surface: t.bg, kind: "text", fillLabel: "bg", inkLabel: "ink-2" })),
  mkRow("hover", "ink 于 3.5% 墨洗", (t) => ({ fill: t.hover, ink: t.ink, surface: t.bg, kind: "text", fillLabel: "hover", inkLabel: "ink" })),
  mkRow("selected（当前页）", "ink 于 6% 墨洗 + 600", (t) => ({ fill: t.wash, ink: t.ink, surface: t.bg, kind: "text", fillLabel: "wash", inkLabel: "ink" })),
  mkRow("open（下拉已开）", "ink 于 6% 墨洗，字重不变", (t) => ({ fill: t.wash, ink: t.ink, surface: t.bg, kind: "text", fillLabel: "wash", inkLabel: "ink" })),
  mkRow("二级菜单箭头", "chevron-down 12 ink-3 于画布", (t) => ({ fill: t.bg, ink: t.ink3, surface: t.bg, kind: "icon", fillLabel: "bg", inkLabel: "ink-3" })),
  { group: "右上簇 · 铃铛 32、头像 28" },
  mkRow("铃铛 · rest", "ink-2 于画布", (t) => ({ fill: t.bg, ink: t.ink2, surface: t.bg, kind: "icon", fillLabel: "bg", inkLabel: "ink-2" })),
  mkRow("铃铛 · hover", "ink 于 6% 墨洗", (t) => ({ fill: t.wash, ink: t.ink, surface: t.bg, kind: "icon", fillLabel: "wash", inkLabel: "ink" })),
  mkRow("头像字", "av-ink 于 av-bg", (t) => ({ fill: t.avBg, ink: t.avInk, surface: t.bg, kind: "text", fillLabel: "av-bg", inkLabel: "av-ink" })),
  { group: "完整菜单与下拉 · 纸面，s3 阴影；都接在键下 6px；不用玻璃" },
  mkRow("面板面 vs 画布", "边界由 s3 的 1px 环与阴影给出", (t) => ({ fill: t.bg, ink: t.panel, surface: t.bg, kind: "edge", exempt: true, fillLabel: "bg", inkLabel: "panel" })),
  mkRow("搜索 · 占位", "ink-2 于 wash（D2 墨洗工具形态）", (t) => ({ fill: t.wash, ink: t.ink2, surface: t.panel, kind: "text", fillLabel: "wash", inkLabel: "ink-2" })),
  mkRow("搜索 · 快捷键", "ink-2 于 wash", (t) => ({ fill: t.wash, ink: t.ink2, surface: t.panel, kind: "text", fillLabel: "wash", inkLabel: "ink-2" })),
  mkRow("下拉 · 搜索 sm 28", "同占位，12.5 字", (t) => ({ fill: t.wash, ink: t.ink2, surface: t.panel, kind: "text", fillLabel: "wash", inkLabel: "ink-2" })),
  mkRow("分组行 · 标题", "ink-3 于纸；hover 不换底，只出图钉（ink-3 于墨洗夜间只有 4.19）", (t) => ({ fill: t.panel, ink: t.ink3, surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: "ink-3" })),
  mkRow("项 · rest", "ink-2 于纸；图标 ink-3", (t) => ({ fill: t.panel, ink: t.ink2, surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: "ink-2" })),
  mkRow("项 · hover", "ink 于 3.5% 墨洗；图钉出现", (t) => ({ fill: t.hover, ink: t.ink, surface: t.panel, kind: "text", fillLabel: "hover", inkLabel: "ink" })),
  mkRow("项 · selected / 已点开", "ink 于 6% 墨洗 + 600", (t) => ({ fill: t.wash, ink: t.ink, surface: t.panel, kind: "text", fillLabel: "wash", inkLabel: "ink" })),
  mkRow("项 · 有子项箭头", "chevron-right 12 ink-3", (t) => ({ fill: t.panel, ink: t.ink3, surface: t.panel, kind: "icon", fillLabel: "panel", inkLabel: "ink-3" })),
  { group: "图钉 · 24 见方钮；rest 隐藏但占位，hover / focus 显示描边，固定后实心常显" },
  mkRow("图钉 · hover 描边", "ink-3 于 hover 墨洗", (t) => ({ fill: t.hover, ink: t.ink3, surface: t.panel, kind: "icon", fillLabel: "hover", inkLabel: "ink-3" })),
  mkRow("图钉 · 已固定", "acc 于纸", (t) => ({ fill: t.panel, ink: t.acc, surface: t.panel, kind: "icon", fillLabel: "panel", inkLabel: "acc" })),
  mkRow("图钉 · 已固定于当前页", "acc 于 6% 墨洗", (t) => ({ fill: t.wash, ink: t.acc, surface: t.panel, kind: "icon", fillLabel: "wash", inkLabel: "acc" })),
  { group: "完整菜单底栏 · 当前位置 + 侧栏尺度锁定块（通过稿原样，只装饰）" },
  mkRow("当前位置 · 标签", "ink-3 于纸", (t) => ({ fill: t.panel, ink: t.ink3, surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: "ink-3" })),
  mkRow("锁定块 · 字标 TCRN", "ink 于纸，12.5/600", (t) => ({ fill: t.panel, ink: t.ink, surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: "ink" })),
  mkRow("锁定块 · 后缀 TMS", "通过稿 #2c63c8 于纸；夜间低于 4.5，见待 Owner", (t) => ({ fill: t.panel, ink: "#2c63c8", surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: "#2c63c8" })),
  mkRow("锁定块 · 艺人管理系统", "ink-3 于纸，10.5", (t) => ({ fill: t.panel, ink: t.ink3, surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: "ink-3" })),
  { group: "手机 390 · 纯标 + 示意；Sheet，遮罩 20% 墨" },
  mkRow("Sheet 行 · 44", "同项 rest", (t) => ({ fill: t.panel, ink: t.ink2, surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: "ink-2" })),
  mkRow("遮罩下的纸", "按设计不读", (t) => ({ fill: "rgba(22,21,15,.2)", ink: t.ink2, surface: t.panel, kind: "text", exempt: true, fillLabel: "scrim", inkLabel: "ink-2" }))
];
const matrix = matrixTable({ caption: "页签壳状态矩阵 · 草案二 r6", cols: ["浅色", "夜间"], rows: matrixRows });

// ---------- C · 登入动画 ----------
function frame({ t, card, dim, mk, pp, pins, wm: w, cl, half }) {
  const m = mk ? `<span class="mk" style="left:${mk.x}px;top:${mk.y}px">${mark(mk.s)}</span>` : "";
  return `<div class="fr${dim ? " dim" : ""}${half ? " half" : ""}">${pp ? `<div class="pp"><i style="top:14px;width:90px"></i><i style="top:26px;width:60px"></i><i style="top:48px;width:340px"></i><i style="top:60px;width:340px"></i><i style="top:72px;width:340px"></i></div>` : ""}${card ? `<div class="card"><i class="w" style="top:54px"></i><i class="w2" style="top:61px"></i><i style="top:72px"></i><i style="top:86px"></i><i class="b" style="top:102px"></i></div>` : ""}${w ? `<span class="wm"></span>` : ""}${pins ? `<span class="pn"></span>` : ""}${cl ? `<span class="cl"></span>` : ""}${m}<span class="t">${t}</span></div>`;
}
const C = { x: 138 + 48 - 19.2, y: 36 + 8 };
const E2 = { x: 4 + 1.8, y: 4.5 };
const lerp = (a, b, p) => a + (b - a) * p;
const story = [
  frame({ t: "t = 0 · 登入成功，登入卡上是第三版（标 128）", card: true, mk: { x: C.x, y: C.y, s: 38.4 } }),
  frame({ t: "t = 120 · 表单淡出 --t-fill 120ms", card: true, dim: true, mk: { x: C.x, y: C.y, s: 38.4 } }),
  frame({ t: "t = 240 · 标飞向左上 --t-move 240ms --ease", pp: true, half: true, mk: { x: lerp(C.x, E2.x, .72), y: lerp(C.y, E2.y, .72), s: lerp(38.4, 6.6, .72) } }),
  frame({ t: "t = 360 · 纸升起；字标首行、固定项、右上簇淡入", pp: true, wm: true, pins: true, cl: true, mk: { x: E2.x, y: E2.y, s: 6.6 } }),
  frame({ t: "t = 460 · 终态 = A1：第二版（标 22 + TCRN TMS）", pp: true, wm: true, pins: true, cl: true, mk: { x: E2.x, y: E2.y, s: 6.6 } })
].join("");
const storyRules = `<div class="rules">
<div class="box"><h4>播放条件</h4><ul><li>只在<b>登入成功</b>这一刻播一次；刷新、会话恢复、SSO 回跳、切换产品都不播。</li><li>一个会话内不重复；服务端渲染首屏时顶带直接在终态。</li><li>总时长 <b>460ms</b>：120 淡出 + 240 位移 + 100 纸升起与字标淡入，上限 700。</li></ul></div>
<div class="box"><h4>实现约束</h4><ul><li>只用 <code>transform</code> 与 <code>opacity</code>；登入卡上的锁定块与顶带的首行共用同一份标 SVG（128 → 22），描述行淡出、字标保留。</li><li>终点坐标就是顶带标的几何，结束后无跳变；标全程彩色。</li><li>动画期间不挡交互：120ms 后指针事件穿透，键盘可直接 Tab 到标按钮。</li></ul></div>
<div class="box"><h4>减少动画偏好</h4><ul><li><code>prefers-reduced-motion: reduce</code> 时不播，直接呈现终态。</li><li>菜单开合、下拉、级联、图钉出现同样尊重该偏好：时长归零。</li><li>门：带偏好的渲染里 transition 时长读数为 0，动画次数计数为 0。</li></ul></div>
</div>`;

// ---------- D · 几何：真实屏幕加标尺 ----------
let GEOM = { pills: [[154, 199], [207, 270], [278, 335.5], [343.5, 406.5]], menuBottom: 342, menuItemTop: 144, menuBarTop: 290, lockRight: 948, dropBottom: 228, dropRowTop: 88 };
try { GEOM = { ...GEOM, ...JSON.parse(fs.readFileSync(fileURLToPath(new URL("../boards/spec-geom.json", import.meta.url)), "utf8")) }; } catch (e) { /* 首次构建用默认值，量过后写 spec-geom.json */ }
const RL = { ML: 120, MT: 80, MR: 60, MB: 70 };
function rulers(dims) {
  const W = 1240 + RL.ML + RL.MR, H = 640 + RL.MT + RL.MB; const el = [];
  for (const d of dims) {
    if (d.t === "h") { const y = RL.MT + d.y, x1 = RL.ML + d.x1, x2 = RL.ML + d.x2; const ty = d.pos === "below" ? y + 13 : y - 5;
      if (d.ext !== undefined) { const ye = RL.MT + d.ext; el.push(`<line class="ext" x1="${x1}" y1="${y}" x2="${x1}" y2="${ye}"/><line class="ext" x1="${x2}" y1="${y}" x2="${x2}" y2="${ye}"/>`); }
      el.push(`<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"/><line x1="${x1}" y1="${y - 4}" x2="${x1}" y2="${y + 4}"/><line x1="${x2}" y1="${y - 4}" x2="${x2}" y2="${y + 4}"/><text x="${(x1 + x2) / 2}" y="${ty}" text-anchor="middle" data-dim="h:${d.x1}-${d.x2}">${d.l}</text>`); }
    else if (d.t === "v") { const x = RL.ML + d.x, y1 = RL.MT + d.y1, y2 = RL.MT + d.y2; const right = d.pos === "right";
      if (d.ext !== undefined) { const xe = RL.ML + d.ext; el.push(`<line class="ext" x1="${x}" y1="${y1}" x2="${xe}" y2="${y1}"/><line class="ext" x1="${x}" y1="${y2}" x2="${xe}" y2="${y2}"/>`); }
      el.push(`<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}"/><line x1="${x - 4}" y1="${y1}" x2="${x + 4}" y2="${y1}"/><line x1="${x - 4}" y1="${y2}" x2="${x + 4}" y2="${y2}"/><text x="${right ? x + 6 : x - 6}" y="${(y1 + y2) / 2 + 4}" text-anchor="${right ? "start" : "end"}" data-dim="v:${d.y1}-${d.y2}">${d.l}</text>`); }
    else if (d.t === "line") { const y = RL.MT + d.y, x1 = RL.ML + d.x1, x2 = RL.ML + d.x2; el.push(`<line class="mid" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"/><text class="mid" x="${x2 + 6}" y="${y + 4}">${d.l}</text>`); }
    else if (d.t === "label") { el.push(`<text x="${RL.ML + d.x}" y="${RL.MT + d.y}">${d.l}</text>`); }
  }
  return `<svg class="rul" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">${el.join("")}</svg>`;
}
function specFigure(state, dims, title, note) {
  return `<div class="shot"><div class="spec">${screen({ id: "spec-" + state, night: false, state })}${rulers(dims)}</div><div class="spec-cap"><b>${title}</b><span>${note}</span></div></div>`;
}
const P = GEOM.pills;
const specClosed = specFigure("closed", [
  { t: "h", y: -14, x1: 0, x2: 12, l: "12", ext: 0 }, { t: "h", y: -14, x1: 12, x2: 146, l: "134", ext: 6 }, { t: "h", y: -14, x1: 146, x2: P[0][0], l: "8", ext: 10 },
  { t: "h", y: -14, x1: P[0][1], x2: P[1][0], l: "8", ext: 10 }, { t: "h", y: -14, x1: P[1][1], x2: P[2][0], l: "8", ext: 10 }, { t: "h", y: -14, x1: P[2][1], x2: P[3][0], l: "8", ext: 10 },
  { t: "h", y: -14, x1: 1228, x2: 1240, l: "12", ext: 10 },
  { t: "v", x: -40, y1: 0, y2: 52, l: "52", ext: 0 }, { t: "v", x: -14, y1: 0, y2: 6, l: "6" }, { t: "v", x: -14, y1: 6, y2: 46, l: "40", ext: 12 }, { t: "v", x: -14, y1: 46, y2: 52, l: "6" },
  { t: "v", x: P[3][1] + 8, y1: 10, y2: 42, l: "32", pos: "right" },
  { t: "line", y: 26, x1: P[3][1] + 40, x2: P[3][1] + 96, l: "中线 26" },
  { t: "h", y: 652, x1: 0, x2: 12, l: "12", pos: "below", ext: 640 }, { t: "h", y: 652, x1: 1228, x2: 1240, l: "12", pos: "below", ext: 640 }, { t: "v", x: -14, y1: 628, y2: 640, l: "12", ext: 12 },
  { t: "label", x: 24, y: 70, l: "纸：圆角 14 · s1" }
], "D1 · 顶带态", "标按钮 134 × 40 在 (12, 6)，行中线 26；固定项 32 高，与标按钮隐形边界、彼此之间都是 8；右上簇右缘 = 纸右缘；纸离边 12");
const specExpanded = specFigure("expanded", [
  { t: "v", x: -14, y1: 46, y2: 52, l: "6", ext: 12 }, { t: "h", y: -14, x1: 12, x2: 964, l: "952", ext: 52 },
  { t: "v", x: 970, y1: 60, y2: 100, l: "40", pos: "right" }, { t: "v", x: 970, y1: GEOM.menuItemTop, y2: GEOM.menuItemTop + 32, l: "32", pos: "right" },
  { t: "v", x: 970, y1: GEOM.menuBarTop, y2: GEOM.menuBottom, l: "52", pos: "right" },
  { t: "h", y: GEOM.menuBottom + 12, x1: GEOM.lockRight, x2: 964, l: "16", pos: "below", ext: GEOM.menuBottom }, { t: "h", y: GEOM.menuBottom + 12, x1: 12, x2: 20, l: "8", pos: "below", ext: GEOM.menuBottom },
  { t: "label", x: 980, y: 56, l: "菜单顶 52 = 标按钮底 46 + 6" }
], "D2 · 完整菜单", "接在标按钮下 6；宽 952，左缘 = 标按钮左缘 12；搜索 40，行 32；底栏 52（含面板底内距 8），内容左右内距 16（面板 8 + 底栏 8）");
const specDrop = specFigure("drop", [
  { t: "v", x: 199, y1: 42, y2: 48, l: "6" }, { t: "v", x: 199, y1: 48, y2: 54, l: "6" }, { t: "v", x: 199, y1: 54, y2: 82, l: "28" }, { t: "v", x: 199, y1: GEOM.dropRowTop, y2: GEOM.dropRowTop + 32, l: "32" },
  { t: "h", y: GEOM.dropBottom + 12, x1: 207, x2: 447, l: "240", pos: "below", ext: GEOM.dropBottom }, { t: "h", y: GEOM.dropBottom + 12, x1: 447, x2: 451, l: "4", pos: "below", ext: GEOM.dropBottom }, { t: "h", y: GEOM.dropBottom + 12, x1: 451, x2: 691, l: "240", pos: "below", ext: GEOM.dropBottom },
  { t: "h", y: -14, x1: P[0][1], x2: P[1][0], l: "8", ext: 10 }, { t: "label", x: 700, y: 60, l: "下拉左缘 = 固定项左缘（207）" }
], "D3 · 固定二级菜单下拉", "接在项下 6；宽 240、内距 6、搜索 sm 28、行 32；第三级向右 4、同宽、高 = 左列高");
const geoHtml = `<div class="specs gp">${specClosed}${specExpanded}${specDrop}</div>`;
// ---------- D · 几何（旧示意，已不用）----------
const geoHtmlOld = `<div class="geo gp" aria-label="几何示意">
<div class="g" style="left:12px;top:6px;width:134px;height:40px"></div><span class="l" style="left:154px;top:4px"><b>标按钮</b> 134 × 40 · left 12 · top 6 · 圆角 8 · 内距 6 · 标 22 · 字标 12.5/600 · 示意 20 · 行中线 26</span>
<div class="g" style="left:154px;top:10px;width:45px;height:32px"></div><div class="g" style="left:207px;top:10px;width:64px;height:32px"></div><div class="g" style="left:279px;top:10px;width:60px;height:32px"></div><span class="l" style="left:460px;top:19px"><b>固定项</b> 无分割线 · 标按钮隐形边界 → 8 → 项 → 8 → 项 · 每项 32 高（10 → 42）、内距 10 · 上限 6 · 中线 26</span>
<div class="g p" style="left:12px;top:52px;width:1216px;height:576px"></div><span class="l" style="left:30px;top:60px"><b>纸</b> left 12 · top 52 · right 12 · bottom 12 · 圆角 14 · s1</span>
<span class="l" style="left:30px;top:78px"><b>顶带</b> 0 → 52：画布色，无底无线；整行中线 26：标按钮 6 → 46、固定项 10 → 42、右上簇居中</span>
<div class="g d" style="left:12px;top:52px;width:952px;height:310px"></div><span class="l" style="left:30px;top:342px;color:var(--acc-ul)"><b>完整菜单</b> left 12 · top 52（= 标按钮底 46 + 6）· w 952 · 3 列 · 底栏 52（含面板底内距，当前位置 + 侧栏尺度锁定块在分隔线到底缘之间居中）· 无收起钮</span>
<div class="g" style="left:207px;top:48px;width:240px;height:220px"></div><span class="l" style="left:221px;top:110px"><b>固定二级菜单下拉</b> left = 该项 left 207 · top 48（= 项底 42 + 6）· w 240 · 内距 6 · 搜索 sm 28 · 行 32，文字起点 16</span>
<div class="g" style="left:451px;top:48px;width:240px;height:220px"></div><span class="l" style="left:465px;top:130px"><b>第三级</b> 向右 +4 · 同宽 240 · 高 = 左列高</span>
<span class="l" style="left:465px;top:148px"><b>第四级</b> 同规则再向右</span>
<div class="g" style="left:28px;top:118px;width:22px;height:22px;box-shadow:inset 0 0 0 1px var(--acc-ul)"></div><span class="l" style="left:60px;top:121px"><b>引导列</b> 面板内图标 16 · 文字 48</span>
<span class="l" style="left:60px;top:150px"><b>图钉位</b> 24 常驻 · 行尾</span>
<div class="g" style="left:1158px;top:10px;width:70px;height:32px"></div><span class="l" style="left:880px;top:15px"><b>右上簇</b> 右缘 = 纸右缘 1228 · 铃铛 32 · 头像 28 · 中线 26</span>
<span class="l" style="left:30px;top:560px;color:var(--ink-3)">所有数值为板上起点值，由门量定；手机 390：纯标 + 示意，固定项收进 Sheet（max-h 84%）、行 44。</span>
</div>`;
const geoRows = kvTable([
  ["项", "值", "来自", "关系断言（门量）"],
  ["顶带高", "52；整行中线 26", "--h-lg 40 + --pad-md 12", "顶带无背景无边线；纸顶 = 52；标按钮、固定项、右上簇中线都是 26"],
  ["标按钮（v2）", "134 × 40，left 12，top 6，圆角 8；标 22、字标 12.5 / 600、示意 20；hover / open 底 3.5% 墨洗；不再挂上边界", "Logos 板 E 段侧栏尺度；--h-lg；chevron 16", "标按钮左缘 = 纸左缘 = 完整菜单左缘 = 12；字标墨迹中线 = 标中线（±1）"],
  ["固定项", "每项 32 高（10 → 42）、内距 10；无分割线；标按钮隐形边界 → 项、项 → 项都是 8；上限 6，第 7 项进菜单", "8 = 页头动作组间距（lib .ph .act）", "三处间距读数相等；固定项中线 = 26 = 标按钮中线；顶带上下留白相等（10 / 10）"],
  ["纸", "left/right/bottom 12，top 52，圆角 14，s1", "纸面规则：离边 12、圆角 14、s1", "纸右缘 1228 = 右上簇右缘"],
  ["完整菜单", "left 12，top 52，w 952，3 列 gap 16，底栏 52（含面板底内距 8）；无收起钮", "top 52 = 标按钮底 46 + 接续 6", "菜单顶 − 标按钮底 = 6；锁定块在分隔线到面板底缘之间居中（上下留白相等）；锁定块右缘 = 菜单右缘 − 16（面板 8 + 底栏 8）；收起钮数量 = 0"],
  ["右下角锁定块", "侧栏尺度：标 22、字标 12.5/600、描述 10.5，列间 10", "Logos 板 E 段 .rail 原样", "不是按钮、不在 Tab 序列"],
  ["固定二级菜单下拉", "left = 该项 left，top 48 = 该项底 42 + 6，w 240，内距 6，搜索 sm 28，行 32 无图标列、文字起点 16", "--drop-w 240；--menu-gap 6；SearchInput sm 28（B1-Inputs）", "下拉左缘 = 固定项左缘；下拉顶 − 项底 = 6；下拉宽 = 固定项宽的 3 至 4 倍"],
  ["三、四级级联", "向右 +4，同宽 240，高 = 左列高；按点击展开", "--cascade-gap 4", "第 n 列高度 = 第 n−1 列高度；左缘 = 左列右缘 + 4"],
  ["图钉位", "24 常驻，钮 24 × 24，图标 16；分组、项、子菜单都可钉", "--pinb 24", "rest 与 hover 行文字宽相等"],
  ["面包屑", "纸内 PageHeader 首行，单行截断加 title", "C7", "任何宽度下一行"],
  ["目录与书签", "不在导航上；页内独立空间（TocRail、书签栏）", "Owner 2026-10-13 第四轮", "壳内没有常驻侧栏"],
  ["窄于 1024", "固定项整组收进菜单；手机 390 用纯标 + 示意", "INC-399 可达性门", "390 宽标按钮可点；Sheet 行 44"]
], [170, 440, 300, 0]);

// ---------- E · 契约 ----------
const contract = `<div class="cols3">
<div class="box"><h4>产品须提供</h4><ul>
<li><b>菜单模型</b>：分组 → 项 → 子项（三级）→ 子项（四级）；图标名出自名册、路由、五语标签。</li>
<li><b>固定项存储</b>：每用户每产品，服务端偏好（跨设备）；可固定分组、项或子菜单；上限 6，顺序为固定顺序，可拖排；第 7 项起只在菜单里标记已固定。</li>
<li><b>搜索提供者</b>：完整菜单搜全站目标；下拉里的搜索只搜该子树；复用 ProductShellSearch。</li>
<li><b>品牌资产</b>：三版都出自 Logos 板：标（A 段）、侧栏尺度（E 段侧栏）、锁定块（E 段）；产品只传产品键，不传颜色或文案。</li>
<li><b>产品清单</b>：切换产品在头像菜单里，锁定块不承担。</li>
<li><b>PageHeader 必有</b>：面包屑 + 标题 + 动作；目录与书签在页内独立空间（TocRail、书签栏）。</li>
</ul></div>
<div class="box"><h4>何时用与不用</h4><ul>
<li>TMS、AOS、Atelier、DS 文档站都用这一套顶带壳；没有常驻侧栏。</li>
<li>标按钮是桌面端唯一的完整菜单入口；一段即开，没有小面板。</li>
<li>完整菜单与下拉都是临时浮层：选中、Esc、点外部即收；没有收起钮；与键之间留 6px。</li>
<li>固定的二级菜单从顶带纵向下拉；三、四级按<b>点击</b>向右级联，不按悬停。</li>
<li>右下角锁定块只装饰，不可点、不进 Tab 序列。</li>
</ul></div>
<div class="box"><h4>键盘与读屏</h4><ul>
<li><code>⌘K / Ctrl+K</code> 打开完整菜单并聚焦搜索；<code>Esc</code> 关闭，焦点回标按钮；菜单内 ↑↓ 走项，→ 进入子项列，← 回左列。</li>
<li>标按钮 <code>aria-expanded</code>、<code>aria-haspopup="dialog"</code>；固定的二级菜单同样；浮层 <code>role="dialog"</code> 非模态。</li>
<li>图钉是真按钮，<code>aria-pressed</code>，可见名「固定到顶带：合约」；行获焦时图钉同 hover 出现。</li>
<li>所有可见字符串五语同源；图标钮都有 aria-label。</li>
<li>触摸端：标按钮 ≥ 40，Sheet 行 44，图钉热区 44。</li>
</ul></div>
</div>`;

// ---------- F · token ----------
const tokens = kvTable([
  ["token", "值", "状态", "说明"],
  ["shell.strip-h", "52", "新", "顶带高"],
  ["shell.brand-h / brand-w", "40 / 134", "新", "标按钮高与宽（侧栏尺度首行 + 示意）；v1 纯标时宽自适应"],
  ["shell.toggle", "20", "新", "展开收起示意，chevron 16"],
  ["shell.pin-h / pin-gap / pins-max", "32 / 8 / 6", "新", "顶带固定项高、间距（三处相等）、上限；无分割线"],
  ["shell.menu-gap", "6", "新", "完整菜单与下拉的顶到键底的接续间距"],
  ["shell.panel-w-expanded", "952", "新", "完整菜单宽"],
  ["shell.pbar-h", "44", "新", "完整菜单底栏，容纳侧栏尺度锁定块"],
  ["shell.drop-w / drop-srch-h / cascade-gap", "240 / 28 / 4", "新", "下拉与级联列宽、下拉内搜索高（SearchInput sm）、列间"],
  ["shell.row-h / srch-h", "32 / 40，触摸 44", "新", "项高、搜索高"],
  ["shell.pinb", "24", "新", "图钉位与图钉钮"],
  ["brand 资产", "Logos 板 A 段标、E 段锁定块与侧栏", "沿用", "不新增资产；三版 = 标 / 锁定块首行 / 锁定块与侧栏"],
  ["motion.intro", "120 + 240 + 100 = 460，上限 700", "新", "登入动画，标 128 → 22"],
  ["rail-w / rail-w-collapsed / topbar-h", "220 / 52 / 52", "退役", "没有常驻侧栏与顶栏；由 strip-h 与顶带态接管"],
  ["icon 名册", "+ pin（描边 / 实心）", "新 · 待 Owner", "37 → 38"],
  ["shell.panel-w（小面板）", "—", "撤销", "草案一的两段式小面板取消"],
  ["标单色版、50% 不透明度", "—", "不采用", "顶带空闲态用通过的彩色标 100%"]
], [230, 300, 110, 0]);

// ---------- G · 门 ----------
const gates = kvTable([
  ["门", "量什么", "会红的变异"],
  ["标按钮几何", "134 × 40，left 12，top 6；行中线 26 = 固定项中线 = 右上簇中线；顶带上下留白 10 / 10", "top 改 0"],
  ["品牌资产 digest", "顶带、锁定块、登入卡的标 SVG 与 logos2/tms.svg 同源；锁定块文案与 Logos 板 E 段一致", "改一处路径坐标"],
  ["顶带", "0 → 52 无背景无边线；纸顶 52", "顶带加 1px 底线"],
  ["三缘对齐", "标按钮左 = 纸左 = 完整菜单左 = 12；簇右 = 纸右", "簇 padding 改 8"],
  ["固定项间距", "标按钮隐形边界 → 项、项 → 项三处读数相等（8）；无分割线；每项 32，中线 20；可见数 ≤ 6", "加回 1px 左边线"],
  ["接续", "完整菜单顶 − 标按钮底 = 6；下拉顶 − 固定项底 = 6；下拉左缘 = 固定项左缘；下拉宽 240、搜索 28", "菜单 top 改 60"],
  ["底栏居中", "锁定块与当前位置在「分隔线 → 面板底缘」之间上下留白相等（±0.5）", "面板底内距改 16"],
  ["标旁文字居中", "标旁文字墨迹中线 = 标中线（±1）；标与文字作为整体在其带内上下留白相等", "字标加 padding-top 4"],
  ["级联", "第 n 列高 = 第 n−1 列高；左缘 = 左列右缘 + 4；同宽", "列二 height:auto"],
  ["无收起钮、无常驻侧栏", "完整菜单与下拉里收起钮数量 = 0；壳内常驻侧栏数量 = 0；点外部关闭（测试）", "加回 x 钮"],
  ["图钉位无抖动", "同一项 rest 与 hover 文字盒宽相等；钮 24", "图钉 display:none → inline"],
  ["锁定块只装饰", "不是按钮、不在 Tab 序列、无 hover 样式；侧栏尺度 22", "改成 button"],
  ["每格对比度", "本板矩阵每格 ≥ 4.5 / 3，与 story 逐格比对；后缀夜间按 Owner 裁定处理", "占位改 ink-3"],
  ["单行与溢出", "所有行文字一行、无元素超出裁切祖先", "标签加长 40 字"],
  ["阴影模糊", "≤ 3px", "面板阴影改 12px"],
  ["登入动画", "每会话 1 次；刷新 0 次；reduced-motion 下 0 次", "去掉会话标记"],
  ["焦点回路", "Esc 后 activeElement = 标按钮；⌘K 后 = 搜索框；← → 在级联列间移动", "关闭时不还焦点"],
  ["触摸端", "390 宽标按钮可点，Sheet 行 44，固定项不在顶带", "行高改 32"]
], [200, 560, 0]);

// ---------- H · Initiative 草案 ----------
const initiative = kvTable([
  ["Epic（草案）", "件数", "Story 草案", "依赖"],
  ["A · 壳层 Shell", "9 + 3 新件", "S1 壳 token；S2 标按钮（v1 / v2、展开收起示意、aria）；S3 顶带固定项（等间距、上限、溢出、选中态）；S4 完整菜单（接续 6、三列、当前位置、侧栏尺度锁定块只装饰、点外部即收）；S5 固定二级菜单下拉与三四级级联（接续 6、按点击、同宽、高随左列）；S6 ProductShell 顶带态与偏好（移除 sidebar 布局与钉住）；S7 登入动画", "EPIC-039 token；Brand 家族已进包的标与锁定块"],
  ["B · 导航 Navigation", "13 → 10", "S8 NavItem 图钉与固定项契约；S9 家族焕新：NavGroup、TreeNav 进面板与下拉，Breadcrumb 进 PageHeader，Tabs 合一，TocRail 与书签栏作为页内空间，SideNav 退役；S10 手机 Sheet 与 INC-399 门", "A"],
  ["C · 品牌与布局", "9", "S11 ProductLockup 补「首行」变体（v2）；S12 PageHeader 必有；Surface、Divider、SplitView、DetailLayout 在纸内重排", "A"],
  ["D · Storybook 壳改纯包", "—", "S13 文档站改同一套顶带壳：删 80 条 tcrn-doc- 骨架、4 条例外、2 条白名单，文档目录改页内 TocRail；S14 第一批五样板换新壳重渲染，映射与门改值", "A B C"],
  ["E · 门", "—", "S15 新门（G 段 16 条）接入 verify 与 CI", "A B"],
  ["F · 4.0.0 候选", "—", "S16 版本面、CHANGELOG、迁移说明、目视验收清单", "全部"]
], [200, 110, 0, 150]);
const initiativeNote = `<div class="cols2">
<div class="box"><h4>INIT 草案 <small>键号待开；本板通过后再落链</small></h4><p class="lead">DS 第二批：页签壳、导航与布局进包，Storybook 壳改为纯包。</p><ul>
<li><b>范围</b>：壳层 9 件 + 标按钮、固定项条、级联下拉三件新件；导航 13 件（SideNav 退役）；Brand 的 ProductLockup 补首行变体；布局 9 件；Storybook 文档壳；门；4.0.0 候选。第三批以后家族不动。</li>
<li><b>取代</b>：D1 的「构图一、构图三按页选」整体退役，只有顶带壳一种；构图三的 1040 居中只留给文档与设置页；草案一的小面板与星标撤销。</li>
<li><b>回路</b>：同 INIT-015：批量处理原则 v3，拆分一次、分包并行（上限 3）、集成一次、批末门与验收一次、一次链写。</li>
<li><b>停点</b>：推送、打 tag、发版、部署、目视验收仍是 Owner 停点；本板通过前不开单。</li>
</ul></div>
<div class="box"><h4>待 Owner <small>按 2026-10-13 第二至五轮意见</small></h4><ol>
<li>采用草案二 r6，取代构图一、三与草案一；D1 由新纪要取代。<b>建议：是。</b></li>
<li>三处补充规则：固定项上限 6、窄于 1024 收进菜单；切换产品移到头像菜单；级联按点击展开。<b>不回复即按本板。</b></li>
<li>后缀 #2c63c8 在夜间：于纸 3.13、于画布 3.33，低于 4.5。本板按通过稿保持同色；INIT-015 曾按 O-3 把夜间改为 #7aa0f5（收口 S-6 待你定）。<b>建议：夜间取 #7aa0f5，与 S-6 一并裁定。</b></li>
<li>顶带空闲态按通过稿彩色标 100%；你原要的 50% 不透明度仍不建议（对比度不可算、触摸端无悬停、品牌不重绘）。<b>请表态。</b></li>
<li>图标名册加 pin（取代 star），37 → 38。<b>建议：加。</b></li>
<li>草案一板是否从画布移除。<b>建议：通过草案二后移除。</b></li>
</ol></div>
</div>`;

// ---------- 0 · 与草案一的差异 ----------
const diff = kvTable([
  ["Owner 意见", "草案一", "草案二 r4"],
  ["1 标三版，常显第二版", "40 见方纯标页签，挂上边界，空闲单色", "三版全部出自 Logos 板通过稿：v1 标、v2 锁定块首行与标垂直居中（顶带用侧栏尺度 22 + 12.5）、v3 锁定块与侧栏原样；空闲态彩色 100%；标按钮居中于顶带，不再挂上边界"],
  ["2 标右侧放用户自定义项，一段即开", "点标出小面板，再展开完整菜单", "标右侧一排固定项，无分割线，三处间距都是 8；点标直接开完整菜单；小面板撤销"],
  ["3 右下角锁定块只装饰，收起键到标右侧无轮廓", "锁定块兼切换产品；小面板有钉住钮", "右下角是侧栏尺度锁定块（标 22），只装饰；标按钮右侧 20 格 chevron 示意；切换产品移到头像菜单"],
  ["4 星改图钉，可固定二级菜单，纵向下拉带搜索，三四级向右级联", "星标常用列表", "图钉固定分组、项或子菜单；顶带点开 320 下拉带搜索，接续 6；三、四级 +4 向右同宽，高随左列，按点击"],
  ["5 保留当前位置，去掉收起钮，点外部即收", "搜索行有 ×，底栏有钉住钮", "底栏只有当前位置与装饰锁定块；收起钮数量 0；菜单接在标按钮下 6px；点外部、Esc、选中即收"],
  ["r2 · 标与描述用通过稿资产", "—", "标 logos2/tms.svg 原样；锁定块文案「TCRN TMS / 艺人管理系统」；后缀 #2c63c8 两个主题同色"],
  ["r3 · 第四轮前四条", "—", "第二版标居中；无分割线、三处间距相等；右下角锁定块改侧栏尺度；浮层与键接续 6px"],
  ["r4 · 第四轮第五条的本意", "—", "移除钉住态常驻侧栏（r3 误删了固定二级菜单下拉，已恢复）；文档站同样用顶带壳，目录与书签进页内"],
  ["r5 · 第六轮三条", "—", "第二版卡片居中；下拉改紧凑：宽 240、内距 6、搜索 sm 28、行无图标列文字起点 16；曾把标旁文字下移 2 / 3px，r6 撤回"],
  ["r6 · 第七轮：没在带里居中", "—", "「文字偏上」的真正原因是带内没居中：顶带整行中线放到 26（标按钮 6 → 46、固定项 10 → 42、右上簇居中），标按钮不再挂上边界；菜单底栏连同面板底内距一起居中，锁定块在分隔线到底缘之间上下留白相等；标旁文字回到与标几何居中"]
], [300, 360, 0]);

// ---------- 自检 ----------
const selfCheck = `<div class="box"><h4>打回根因自检 <small>十一类逐条</small></h4><ul>
<li><b>1 留白补画</b>：标、锁定块、侧栏尺度全部出自 Logos 板通过稿（A、E 段），CSS 值原样；板上没有自拟的品牌文案或颜色。</li>
<li><b>2 状态成对</b>：B 段每格 fill / ink 成对；状态选择器与变体同为两类；图钉出现的后代规则只改 opacity；展开示意不换色、只换形。</li>
<li><b>3 几何测量</b>：发布前 measure.js 八项 + measure-shell.js（标按钮、标与字标中线、固定项三处间距、菜单与下拉接续、下拉锚点、级联等高、图钉位、收起钮计数、锁定块非按钮）。</li>
<li><b>4 分叉</b>：夜间同规则只换 token；搜索沿用 B1-Inputs 墨洗工具形态；按钮沿用 B1-Actions 对表；下拉与完整菜单共用同一套行。</li>
<li><b>5 套路</b>：无左边条、无分割线、无渐变、无光斑、无模糊云阴影、无卡套卡、无漂浮球、无常驻侧栏；玻璃未用；标按钮无轮廓。</li>
<li><b>6 控件语义</b>：标按钮 button + aria-expanded；固定的二级菜单 button + aria-haspopup；固定页面 a；图钉 button + aria-pressed；锁定块 role=img 不可点。</li>
<li><b>7 门</b>：G 段每门附一条会红的变异，含品牌资产 digest、收起钮与常驻侧栏数量 = 0、锁定块不是按钮三条存在性断言。</li>
<li><b>8 文案</b>：所有可见字符串按五语源；品牌文案只取 Logos 板 I 段。</li>
<li><b>9 密度</b>：行 32 / 触摸 44；顶带固定项 32；标题 26 衬线。</li>
<li><b>10 截断</b>：所有单行元素 nowrap + ellipsis；固定项超过 6 不截断而是进菜单。</li>
<li><b>11 表面模型</b>：顶带是画布，不是白卡；纸只有一张；菜单与下拉是浮层（s3）；级联列之间 4px 画布缝。</li>
</ul></div>`;

// ---------- 页面 ----------
const body = `
<header class="bh">
<div>
<p class="k">Batch two · Shell · draft 2 · r6 · 2026-10-13 · awaiting Owner</p>
<h1>页签壳草案二：标按钮、固定项、一段即开<em>，三四级向右级联</em></h1>
<p>按 Owner 七轮意见改到 r6：顶带左上是一个标按钮（通过锁定块的首行与标垂直居中，侧栏尺度标 22 + 12.5/600，右侧 20 格展开收起示意，无轮廓；整行中线 26，居中于顶带），右侧一排用户固定项，无分割线，标按钮隐形边界到固定项、固定项之间的间距完全相等；点标按钮一段即开完整菜单（接在标按钮下 6px，搜索、三列、当前位置、右下角侧栏尺度锁定块只装饰，没有收起钮，点外部即收）。图钉可固定分组、项或子菜单；固定的二级菜单从顶带纵向下拉，接续 6px、顶部带搜索，三、四级向右级联，同宽，高度随左列。没有钉住态常驻侧栏：文档站同样用这套壳，目录与书签进页内。设计会话补三条规则：固定项上限 6、窄于 1024 整组收进菜单；切换产品移到头像菜单；级联按点击展开，不按悬停。</p>
</div>
<div class="meta"><b>标按钮 134 × 40 · 固定项 32 · 间距 8 · 行中线 26</b>无分割线，三处相等，带内居中<b>完整菜单 952 · 下拉 240 · 接续 6 · 级联 +4</b>高随左列；点外部即收<b>品牌资产只取通过稿</b>标 22 / 44 / 128，后缀 #2c63c8<b>登入动画 460ms</b>第三版收敛为第二版</div>
</header>

<div class="sec"><h3><b>0</b>与草案一的差异 <span>Owner 五轮意见逐条落点</span></h3>${diff}</div>

<div class="sec"><h3><b>1</b>标三版 <span>全部出自「品牌 Brand · 产品标」板（Owner 2026-10-11 通过）：A 段标、E 段锁定块与侧栏尺度；第二版只是锁定块首行与标垂直居中</span></h3><div class="two">${versions(false)}${versions(true)}</div></div>

<div class="sec"><h3><b>A</b>三态 · 浅色与夜间 <span>收起 → 完整菜单 → 固定二级菜单下拉（含第三级级联）；每屏 1240 × 640，纸上是同一页名册；字幕在各屏下方</span></h3>
<div class="screens gp">${shot(screen({ id: "ts-closed-l", night: false, state: "closed" }), "A1 · 顶带态 · 浅色", "整行中线 26 · 标按钮（彩色标 22 + TCRN TMS + 示意）→ 8 → 名册（当前）→ 8 → 合约▾ → 8 → 结算单（hover）→ 8 → 排期▾ · 无分割线 · 右上簇")}${shot(screen({ id: "ts-closed-n", night: true, state: "closed" }), "A2 · 顶带态 · 夜间", "同一规则只换 token；后缀 #2c63c8 同色（见待 Owner 第 3 条）")}</div>
<div class="screens gp">${shot(screen({ id: "ts-x-l", night: false, state: "expanded" }), "A3 · 完整菜单 · 浅色", "点标按钮一段即开：3.5% 墨洗 + 示意朝上 · 菜单接在标按钮下 6px · 搜索 · 三列（分组行可固定）· 底栏 52 含面板底内距，当前位置 + 侧栏尺度锁定块（装饰）在分隔线到底缘之间居中 · 无收起钮")}${shot(screen({ id: "ts-x-n", night: true, state: "expanded" }), "A4 · 完整菜单 · 夜间", "")}</div>
<div class="screens gp">${shot(screen({ id: "ts-drop-l", night: false, state: "drop" }), "A5 · 固定二级菜单下拉 · 浅色", "顶带点「合约」：240 纵向下拉接在项下 6px，内距 6，顶部搜索 sm 28 · 行无图标列，文字起点 16 · 「模板」已点开 → 第三级向右 +4 同宽，高 = 左列")}${shot(screen({ id: "ts-drop-n", night: true, state: "drop" }), "A6 · 固定二级菜单下拉 · 夜间", "")}</div>
<div class="screens phones gp">${shot(phone({ id: "ts-m-l", night: false }), "A7 · 手机 390 · 顶带态", "纯标 + 示意；固定项收进 Sheet")}${shot(phone({ id: "ts-m-s", night: false, sheet: true }), "A8 · 手机 390 · Sheet", "固定项在前，全部在后；行 44")}</div>
</div>

<div class="sec"><h3><b>B</b>状态矩阵 <span>variant × state × theme；fill 与 ink 成对，与 A 段 data-cell 逐格比对；红色数字是通过稿后缀色在夜间的实测</span></h3>${matrix}</div>

<div class="sec"><h3><b>C</b>登入动画 <span>登入卡上是通过稿锁定块（标 128），收敛为顶带的第二版（标 22）；只用 transform 与 opacity</span></h3><div class="story gp">${story}</div>${storyRules}</div>

<!--SPLIT-->
<div class="sec"><h3><b>D</b>几何 <span>真实屏幕加标尺，px；表为关系断言，由门量定</span></h3>${geoHtml}${geoRows}</div>

<div class="sec"><h3><b>E</b>消费方契约 <span>须提供什么 · 何时用与不用 · 键盘与读屏</span></h3>${contract}</div>

<div class="sec"><h3><b>F</b>与 G+ 底盘的 token 差异 <span>新增、沿用、退役、撤销</span></h3>${tokens}</div>

<div class="sec"><h3><b>G</b>门 <span>每门一条会红的变异</span></h3>${gates}</div>

<div class="sec"><h3><b>H</b>Initiative 草案 <span>本板通过后开单</span></h3>${initiative}${initiativeNote}</div>

<div class="sec"><h3><b>I</b>自检 <span>打回根因十一类</span></h3>${selfCheck}</div>
`;

const SPLIT = body.indexOf("<!--SPLIT-->");
const bodyTop = body.slice(0, SPLIT);
const bodyBottomRaw = body.slice(SPLIT + "<!--SPLIT-->".length);
const headerFor = (kicker, h1, p) => `<header class="bh"><div><p class="k">${kicker}</p><h1>${h1}</h1><p>${p}</p></div><div class="meta"><b>下半块</b>几何 · 契约 · token 差异 · 门${FINAL ? "" : " · 差异表 · Initiative 草案 · 自检"}</div></header>`;
function cleanFinal(b) {
  const cut = (from, to) => { const i = b.indexOf(from); const j = to ? b.indexOf(to, i + 1) : -1; if (i < 0) return; b = b.slice(0, i) + (j >= 0 ? b.slice(j) : ""); };
  cut('<div class="sec"><h3><b>0</b>', '<div class="sec"><h3><b>1</b>');
  cut('<div class="sec"><h3><b>H</b>', null);
  b = b.replace(/<p class="k">[^<]*<\/p>/, '<p class="k">Visual standard · Shell · 2026-10-13</p>');
  b = b.replace(/<h1>[\s\S]*?<\/h1>/, '<h1>壳层：标按钮、固定项、一段即开<em>，三四级向右级联</em></h1>');
  b = b.replace(/<p>按 Owner 七轮意见改到 r6：[\s\S]*?<\/p>/, '<p>壳只有一种：顶带态。顶带左上是一个标按钮（通过稿锁定块的首行与标垂直居中，侧栏尺度标 22 + 12.5/600，右侧 20 格展开收起示意，无轮廓；整行中线 26），右侧一排用户固定项，无分割线，标按钮隐形边界到固定项、固定项之间的间距完全相等；点标按钮一段即开完整菜单（接在标按钮下 6px，搜索、三列、当前位置、右下角侧栏尺度锁定块只装饰，没有收起钮，点外部即收）。图钉可固定分组、项或子菜单；固定的二级菜单从顶带纵向下拉，接续 6px、顶部带搜索，三、四级向右级联，同宽，高度随左列。没有常驻侧栏：文档站同样用这套壳，目录与书签进页内；文档与设置页的内容居中 1040。固定项上限 6，窄于 1024 整组收进菜单；切换产品在头像菜单；级联按点击展开，不按悬停。</p>');
  b = b.replace(/<tr><td class="c">shell\.panel-w（小面板）<\/td>[\s\S]*?<\/tr>/, "").replace(/<tr><td class="c">标单色版、50% 不透明度<\/td>[\s\S]*?<\/tr>/, "");
  b = b.split("；曾把标旁文字下移 2 / 3px，r6 撤回").join("").split("草案一的小面板与星标、r2 的下拉与级联撤销").join("").split("（见待 Owner 第 3 条）").join("").split("；夜间低于 4.5，见待 Owner").join("；夜间 3.33 / 3.13，低于 4.5").split("新 · 待 Owner").join("新").split("页签壳状态矩阵 · 草案二 r6").join("壳层状态矩阵").split("；后缀夜间按 Owner 裁定处理").join("");
  return b;
}
const draftHeader2 = headerFor("Batch two · Shell · draft 2 · r6 · 2 / 2 · 2026-10-13 · awaiting Owner", "页签壳草案二 · 下半块<em>：几何、契约、token、门</em>", "本块接上半块（标三版、三态、矩阵、动效）：几何用真实屏幕加标尺，px 由门量定；之后是消费方契约、与 G+ 底盘的 token 差异、门、与草案一的差异、Initiative 草案与待 Owner 事项、打回根因自检。画布画板高度上限 8000，壳层板因此分两块。");
const finalHeader2 = headerFor("Visual standard · Shell · 2 / 2 · 2026-10-13", "壳层 · 下半块<em>：几何、契约、token、门</em>", "本块接上半块（标三版、三态、矩阵、动效）：几何用真实屏幕加标尺，px 由门量定；之后是消费方契约、与 G+ 底盘的 token 差异、门。画布画板高度上限 8000，壳层板因此分两块。");
const strip0 = (b) => { const i = b.indexOf('<div class="sec"><h3><b>0</b>'); const j = b.indexOf('<div class="sec"><h3><b>1</b>'); return i >= 0 && j > i ? b.slice(0, i) + b.slice(j) : b; };
if (!FINAL) {
  const top = page({ title: "页签壳草案二 · 上半块", css, body: bodyTop, height: H1 });
  const bottom = page({ title: "页签壳草案二 · 下半块", css, body: draftHeader2 + bodyBottomRaw, height: H2 });
  const o1 = fileURLToPath(new URL("../boards/V2-B2-Shell-Draft2.dc.html", import.meta.url)), o2 = fileURLToPath(new URL("../boards/V2-B2-Shell-Draft2-b.dc.html", import.meta.url));
  fs.writeFileSync(o1, top); fs.writeFileSync(o2, bottom); console.log("wrote", o1, top.length, "|", o2, bottom.length);
} else {
  // 成品：上半块 = 清理后的头 + 1 + A + B + C；下半块 = 头 + D + E + F + G（H、I 去掉）
  const topClean = cleanFinal(bodyTop);
  let bottomClean = cleanFinal(finalHeader2 + bodyBottomRaw);
  const o1 = fileURLToPath(new URL("../../visual-standard/boards/Shell.dc.html", import.meta.url)), o2 = fileURLToPath(new URL("../../visual-standard/boards/Shell-2.dc.html", import.meta.url));
  const top = page({ title: "壳层 · 顶带壳 · 上半块", css, body: topClean, height: H1 }).split("，r6 已改").join("");
  const bottom = page({ title: "壳层 · 顶带壳 · 下半块", css, body: bottomClean, height: H2 }).split("，r6 已改").join("");
  fs.writeFileSync(o1, top); fs.writeFileSync(o2, bottom); console.log("wrote final", o1, top.length, "|", o2, bottom.length);
}

