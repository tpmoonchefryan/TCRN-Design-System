// Tokens.dc.html — 底盘 Token（浅色与夜间）成品板：值出自 gplus-2026-10/tools/lib.mjs 的 T 与 tokenCss()（Owner 2026-10-11 裁定 D1 的 G+ 底盘）。
// 用法：node tools/build-tokens.mjs <高度>
import { T, cr, fmt, tokenCss, kvTable, page } from "../../gplus-2026-10/tools/lib.mjs";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const height = process.argv[2] ? Number(process.argv[2]) : 0;
const sw = (v) => `<span class="sw" style="background:${v}"></span>`;
const NAMES = { bg: "画布", bg2: "画布 · 深一档", panel: "纸 / 面板", panel2: "面板 · 次", line: "发丝线", line2: "线 · 二", line3: "线 · 三", lineCtl: "控件轮廓 line-ctl", rule: "墨线", ink: "墨", ink2: "墨 · 二", ink3: "墨 · 三", acc: "强调", acc2: "强调 · 二", acc3: "强调 · 三", accBg: "强调底", accUl: "强调下划", onAcc: "强调上的字", red: "印章红", redBg: "印章红底", redBg2: "印章红底 · 二", ok: "通过", warn: "提醒", bad: "失败", badBg: "失败底", wash: "墨洗 6%（选中）", hover: "墨洗 3.5%（悬停）", dis: "禁用底", s1: "阴影 s1", s2: "阴影 s2", s3: "阴影 s3", glass: "玻璃（只给浮层）", edge: "玻璃边", grain: "颗粒不透明度", blend: "颗粒混合", avBg: "头像底", avInk: "头像字", knob: "开关钮", chrome: "滚动时顶带（玻璃）" };
const GROUPS = [["面", ["bg", "bg2", "panel", "panel2"]], ["线", ["line", "line2", "line3", "lineCtl", "rule"]], ["墨", ["ink", "ink2", "ink3"]], ["强调", ["acc", "acc2", "acc3", "accBg", "accUl", "onAcc"]], ["语义", ["red", "redBg", "redBg2", "ok", "warn", "bad", "badBg"]], ["状态底", ["wash", "hover", "dis"]], ["阴影与玻璃", ["s1", "s2", "s3", "glass", "edge", "chrome"]], ["颗粒与杂项", ["grain", "blend", "avBg", "avInk", "knob"]]];
const isColor = (v) => /^#|^rgba?\(/.test(v) && !/px/.test(v);
const rows = [["token", "含义", "浅色", "夜间"]];
for (const [g, keys] of GROUPS) { rows.push([`<b>${g}</b>`, "", "", ""]); for (const k of keys) rows.push([k, NAMES[k], (isColor(T.light[k]) ? sw(T.light[k]) : "") + T.light[k], (isColor(T.night[k]) ? sw(T.night[k]) : "") + T.night[k]]); }
const contrast = [["墨 / 面", "浅色 于画布 / 于纸", "夜间 于画布 / 于纸"]];
for (const k of ["ink", "ink2", "ink3", "acc", "red", "ok", "warn", "bad"]) contrast.push([k, `${fmt(cr(T.light[k], T.light.bg, T.light.bg))} / ${fmt(cr(T.light[k], T.light.panel, T.light.panel))}`, `${fmt(cr(T.night[k], T.night.bg, T.night.bg))} / ${fmt(cr(T.night[k], T.night.panel, T.night.panel))}`]);
contrast.push(["onAcc 于 acc", fmt(cr(T.light.onAcc, T.light.acc, T.light.panel)), fmt(cr(T.night.onAcc, T.night.acc, T.night.panel))]);
contrast.push(["line-ctl 于纸（非文字 ≥ 3）", fmt(cr(T.light.lineCtl, T.light.panel, T.light.panel)), fmt(cr(T.night.lineCtl, T.night.panel, T.night.panel))]);
const fixedCss = tokenCss().match(/--surface[^}]*/)[0];
const fixed = [["token", "值", "含义"]];
const MEAN = { "--surface": "承载面（焦点环间隙色）", "--focus": "焦点环：2px 承载面间隙 + 2px 强调", "--serif": "衬线：标题与数字", "--sans": "无衬线：界面", "--mono": "等宽：编号与键", "--r-ctl": "控件圆角", "--r-sm": "小圆角", "--r-panel": "面板圆角", "--r-check": "勾选框圆角", "--r-stamp": "印章圆角", "--h-sm": "控件高 sm", "--h-md": "控件高 md", "--h-lg": "控件高 lg", "--pad-sm": "内距 sm", "--pad-md": "内距 md", "--pad-lg": "内距 lg", "--fs-sm": "字号 sm", "--fs-md": "字号 md", "--fs-lg": "字号 lg", "--ico-sm": "图标 sm", "--ico-md": "图标 md", "--ico-lg": "图标 lg", "--ease": "缓动", "--t-fill": "换底时长", "--t-press": "按压时长", "--t-move": "位移时长", "--t-loop": "循环时长" };
for (const part of fixedCss.split(";")) { const i = part.indexOf(":"); if (i < 0) continue; const k = part.slice(0, i).trim(), v = part.slice(i + 1).trim(); fixed.push([k, v.replace(/"/g, "&quot;"), MEAN[k] || ""]); }
const css = `.mx td .sw{display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:-2px;margin-right:6px;box-shadow:inset 0 0 0 1px rgba(22,21,15,.14)}\n.two{grid-template-columns:1248px 1248px}`;
const body = `
<header class="bh">
<div>
<p class="k">Visual standard · Tokens · G+ base · 2026-10-13</p>
<h1>底盘 Token：画布、纸、三档墨、强调色<em>，浅色与夜间同一键集</em></h1>
<p>底盘是 G+（Owner 2026-10-11 裁定 D1）。浅色与夜间键集相同、只换值；阴影紧贴（模糊 ≤ 3px），玻璃只给浮层与滚动时的顶带，颗粒极淡。控件轮廓用 line-ctl（浅 rgba(22,21,15,.47)、夜 rgba(255,255,255,.36)，非文字 ≥ 3:1）。所有组件板与壳层板只引用这里的键。</p>
</div>
<div class="meta"><b>39 个键 × 2 主题</b>键集相同，只换值<b>固定值 27 项</b>圆角、高度、内距、字号、图标、动效<b>对比度</b>墨于画布与纸全部 ≥ 4.5</div>
</header>
<div class="sec"><h3><b>A</b>色彩、线、面与状态底 <span>两主题并列；色块为实际值</span></h3>${kvTable(rows, [200, 260, 0, 0])}</div>
<div class="sec"><h3><b>B</b>对比度 <span>墨于画布 / 于纸；文字 ≥ 4.5，非文字 ≥ 3</span></h3>${kvTable(contrast, [300, 0, 0])}</div>
<div class="sec"><h3><b>C</b>固定值 <span>字体、圆角、高度、内距、字号、图标、动效</span></h3>${kvTable(fixed, [220, 760, 0])}</div>
`;
const OUT = fileURLToPath(new URL("../boards/Tokens.dc.html", import.meta.url));
const html = page({ title: "底盘 Token", css, body, height });
fs.writeFileSync(OUT, html); console.log("wrote", OUT, html.length, "bytes");
