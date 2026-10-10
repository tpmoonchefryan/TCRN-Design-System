import { T, cr, fmt, kvTable, page, write, grain, esc } from "./lib.mjs";
import fs from "node:fs";

const height = process.argv[2] ? Number(process.argv[2]) : 0;
const OUTSVG = new URL("../logos2/", import.meta.url).pathname;
fs.mkdirSync(OUTSVG, { recursive: true });

// ---------- palette: flat tones taken from the TCRN mark family (blue / navy / lime-green / the four DS accents) ----------
export const PAL = {
  tms: { deep: "#2c63c8", bright: "#7aa0f5", tint: "#e4ecfc", name: "蓝" },
  einzbern: { deep: "#3b5272", bright: "#8aa6c9", tint: "#e6ecf3", name: "藏青" },
  mana: { deep: "#3a9a63", bright: "#9ddc8c", tint: "#e5f5e6", name: "绿" },
  ds: { deep: "#6577f3", bright: "#3096f4", c3: "#43d4cf", c4: "#78b957", tint: "#eceefc", name: "四色" }
};

// ---------- marks: 48 grid, solid, two flat tones; `c` returns the svg body for a colour mode ----------
export const MARKS = {
  tms: {
    name: "TCRN TMS", zh: "艺人管理系统", word: "TCRN", suffix: "TMS", font: "sans",
    body: ({ deep, bright }) => `<path d="M11 23L24 39" stroke="${deep}" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M37 23L24 39" stroke="${bright}" stroke-width="9" stroke-linecap="round" fill="none"/><circle cx="24" cy="12.5" r="8" fill="${deep}"/>`,
    says: "一个艺人双臂高举的剪影：头是一个圆，手臂是一个 V。V 既是 VTuber 的 V，也是谢幕、安可时的姿势；两条手臂一深一浅，像聚光灯打在一侧。"
  },
  einzbern: {
    name: "Einzbern", zh: "项目记忆引擎", word: "Einzbern", font: "serif",
    body: ({ deep, bright }) => `<circle cx="24" cy="7.5" r="3.5" fill="${bright}"/><path d="M10 14A14 14 0 0 0 38 14Z" fill="${deep}"/><rect x="15" y="31" width="18" height="5" rx="2.5" fill="${bright}"/><rect x="11" y="39" width="26" height="5" rx="2.5" fill="${deep}"/>`,
    says: "一只盃接住一点光，盃下是两层基座：圣杯接住的是愿望，引擎接住的是项目的记忆；两层基座是存下来的层（纪要、卡片）。深浅交替，像一枚徽记。"
  },
  mana: {
    name: "Mana Orchestrate", zh: "项目记忆助手", word: "Mana Orchestrate", font: "serif",
    body: ({ deep, bright }) => `<path d="M13 13C13 30 35 18 35 35" stroke="${bright}" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="13" cy="13" r="7" fill="${deep}"/><circle cx="35" cy="35" r="7" fill="${deep}"/>`,
    says: "两个结点，一道流：mana 从代理流到引擎，再流回来。结点是深绿，流是亮绿，像一条有生命的带子。"
  },
  ds: {
    name: "TCRN Design System", zh: "设计系统", word: "TCRN", suffix: "Design System", font: "sans",
    body: ({ deep, bright, c3, c4 }) => `<rect x="4" y="4" width="17" height="40" rx="4" fill="${deep}"/><rect x="24" y="4" width="20" height="17" rx="4" fill="${bright}"/><rect x="24" y="24" width="9" height="20" rx="3" fill="${c3}"/><rect x="36" y="24" width="8" height="20" rx="3" fill="${c4}"/>`,
    says: "一张版面：四块大小不等的面，四种颜色。版面是布局，颜色是调色板，合起来就是设计系统；四种颜色沿用 TCRN 母标的紫蓝、蓝、青、绿。"
  }
};
const ink = (c) => ({ deep: c, bright: c, c3: c, c4: c });
export function mark(k, size, mode = "color", extra = "") {
  const pal = mode === "color" ? PAL[k] : mode === "white" ? ink("#ffffff") : mode === "ink" ? ink("currentColor") : ink(mode);
  return `<svg viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true" data-logo="${k}" data-mode="${mode}" data-size="${size}"${extra}>${MARKS[k].body(pal)}</svg>`;
}
export function tile(k, size, kind) {
  // kind: "tint" (light tinted tile, colour mark) | "deep" (deep tile, white mark)
  const p = PAL[k];
  const bg = kind === "tint" ? p.tint : p.deep;
  const inner = kind === "tint" ? MARKS[k].body(p) : MARKS[k].body(ink("#ffffff"));
  return `<svg viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true" data-logo="${k}" data-mode="tile-${kind}" data-size="${size}"><rect width="48" height="48" rx="11" fill="${bg}"/><g transform="translate(7.2 7.2) scale(0.7)">${inner}</g></svg>`;
}
for (const k of Object.keys(MARKS)) {
  fs.writeFileSync(`${OUTSVG}/${k}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" role="img" aria-label="${MARKS[k].name}">${MARKS[k].body(PAL[k])}</svg>\n`);
  fs.writeFileSync(`${OUTSVG}/${k}-mono.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" role="img" aria-label="${MARKS[k].name}">${MARKS[k].body(ink("#16150f"))}</svg>\n`);
}

const css = `
.hero{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px}
.hb{display:flex;flex-direction:column;gap:12px;min-width:0;color:var(--ink)}
.hb .st{display:flex;align-items:center;justify-content:center;height:300px;border-radius:14px;background:var(--panel);box-shadow:var(--s1)}
.hb h5{margin:0;font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hb h5 small{font-weight:400;color:var(--ink-3);margin-left:6px}
.hb p{margin:0;font-size:12.5px;line-height:1.55;color:var(--ink-2)}
.chips{display:flex;gap:8px 10px;align-items:center;flex-wrap:wrap}
.chip{display:inline-flex;align-items:center;gap:6px;font-family:var(--mono);font-size:10.5px;color:var(--ink-3);white-space:nowrap}
.chip i{width:14px;height:14px;border-radius:4px;display:inline-block;box-shadow:inset 0 0 0 1px rgba(22,21,15,.1)}
.ladder{display:grid;grid-template-columns:150px repeat(6,minmax(0,1fr));align-items:end;column-gap:12px;row-gap:16px}
.ladder>b{font-size:12px;font-weight:600;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;align-self:center}
.ladder .c{display:flex;flex-direction:column;align-items:center;gap:6px;color:var(--ink)}
.ladder .hd{font-family:var(--mono);font-size:10.5px;color:var(--ink-3);text-align:center;white-space:nowrap}
.tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}
.tl{display:flex;flex-direction:column;gap:8px;align-items:flex-start}
.tl .r{display:flex;align-items:flex-end;gap:12px}
.tl small{font-family:var(--mono);font-size:10.5px;color:var(--ink-3);white-space:nowrap}
.mono4{display:flex;gap:28px;align-items:center;color:var(--ink)}
.lock{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 28px}
.lk{display:grid;grid-template-columns:auto minmax(0,1fr);column-gap:14px;align-items:center;min-width:0;color:var(--ink)}
.lk .w{display:grid;gap:2px;min-width:0}
.lk .w b{font-size:16px;line-height:20px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-.005em}
.lk .w b.serif{font-family:var(--serif);font-weight:400;font-size:18px;letter-spacing:.03em}
.lk .w b em,.rail b em{font-style:normal}
.lk .w small{font-size:11.5px;line-height:16px;color:var(--ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lk .w small.by{font-size:10px;letter-spacing:.14em;text-transform:uppercase}
.rail{display:grid;grid-template-columns:22px minmax(0,1fr);column-gap:10px;align-items:center;padding:6px 4px;width:210px;color:var(--ink)}
.rail b{display:block;font-size:12.5px;font-weight:600;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rail b.serif{font-family:var(--serif);font-weight:400;font-size:13.5px;letter-spacing:.02em}
.rail small{display:block;font-size:10.5px;color:var(--ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.src{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.src pre{margin:0;padding:14px 16px;border-radius:12px;background:#fff;box-shadow:0 0 0 1px rgba(22,21,15,.08);font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:11px;line-height:1.55;color:#16150f;white-space:pre-wrap;word-break:break-all}
.src pre b{display:block;font-family:"Hanken Grotesk","Noto Sans SC",sans-serif;font-size:12.5px;margin-bottom:6px}
.src pre span{color:#6b675d}
.grid48{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}
.g48{display:flex;flex-direction:column;gap:8px;align-items:center}
.g48 small{font-family:var(--mono);font-size:10.5px;color:var(--ink-3);white-space:nowrap}
.lk .w b,.rail b{overflow:visible;text-overflow:clip}
`;

function gridded(k, size) {
  const lines = [];
  for (let i = 0; i <= 48; i += 2) lines.push(`<path d="M${i} 0V48" stroke="var(--line-2)" stroke-width="${i % 8 === 0 ? ".16" : ".08"}"/><path d="M0 ${i}H48" stroke="var(--line-2)" stroke-width="${i % 8 === 0 ? ".16" : ".08"}"/>`);
  return `<svg viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true" data-logo="${k}" data-mode="grid" data-size="${size}"><rect width="48" height="48" fill="var(--panel)"/>${lines.join("")}<circle cx="24" cy="24" r="22" fill="none" stroke="var(--ink-3)" stroke-width=".24" stroke-dasharray="1 .8"/>${MARKS[k].body(PAL[k])}</svg>`;
}

function pane(night) {
  const t = night ? T.night : T.light;
  const th = night ? "n" : "l";
  const P = t.panel;
  const hero = Object.keys(MARKS).map((k, i) => `<div class="hb"><div class="st">${mark(k, 200, "color")}</div><h5>${MARKS[k].name}<small>${MARKS[k].zh.split(" · ")[0]}</small></h5><div class="chips">${k === "ds" ? [PAL.ds.deep, PAL.ds.bright, PAL.ds.c3, PAL.ds.c4].map((c) => `<span class="chip"><i style="background:${c}"></i>${c}</span>`).join("") : [PAL[k].deep, PAL[k].bright].map((c) => `<span class="chip"><i style="background:${c}"></i>${c}</span>`).join("")}</div><p>${MARKS[k].says}</p></div>`).join("");
  const sizes = [128, 64, 48, 32, 24, 16];
  const ladder = `<span></span>${sizes.map((s) => `<span class="hd">${s}</span>`).join("")}` + Object.keys(MARKS).map((k) => `<b>${MARKS[k].name}</b>${sizes.map((s) => `<span class="c">${mark(k, s, "color")}</span>`).join("")}`).join("");
  const tiles = Object.keys(MARKS).map((k) => `<div class="tl"><div class="r">${tile(k, 64, "tint")}${tile(k, 32, "tint")}${tile(k, 64, "deep")}${tile(k, 32, "deep")}</div><small>${MARKS[k].name} · 淡底 64 / 32 · 深底 64 / 32</small></div>`).join("");
  const mono = Object.keys(MARKS).map((k) => mark(k, 56, "ink")).join("");
  const wm = (m, k) => m.suffix ? `${m.word} <em style="color:${PAL[k].deep}">${m.suffix}</em>` : m.word;
  const locks = Object.keys(MARKS).map((k) => { const m = MARKS[k]; const by = m.font === "serif"; return `<div class="lk" role="img" aria-label="${m.name} ${m.zh}">${mark(k, 44, "color")}<span class="w" aria-hidden="true"><b class="${by ? "serif" : ""}">${wm(m, k)}</b><small>${m.zh}</small>${by ? '<small class="by">by TCRN</small>' : ""}</span></div>`; }).join("");
  const rails = Object.keys(MARKS).map((k) => { const m = MARKS[k]; return `<div class="rail">${mark(k, 22, "color")}<span><b class="${m.font === "serif" ? "serif" : ""}">${wm(m, k)}</b><small>${m.zh.split(" · ")[0]}</small></span></div>`; }).join("");
  return `<section class="pane gp${night ? " night" : ""}" aria-label="${night ? "夜间" : "浅色"}">
${grain("lg2-" + th)}
<span class="ptag">${night ? "night · 画布 #121210 · 纸 #191916" : "light · 画布 #efeeea · 纸 #ffffff"}</span>
<div class="blk"><h6>A · 四枚标 <span>实心几何，每枚两种平涂色；48 格，圆角 4；没有描边、渐变、投影</span></h6><div class="hero">${hero}</div></div>
<div class="blk"><h6>B · 尺寸阶梯 <span>同一个形从 128 到 16，不换切法</span></h6><div class="paper"><div class="ladder">${ladder}</div></div></div>
<div class="blk"><h6>C · 贴片 <span>淡底贴片用于侧栏与应用图标，深底贴片用于 favicon 与深色场合；圆角 11 / 48</span></h6><div class="paper"><div class="tiles">${tiles}</div></div></div>
<div class="blk"><h6>D · 单色版 <span>只有墨色可用时（打印、水印、禁色场合）；形不变，两色并成一色</span></h6><div class="paper"><div class="mono4">${mono}</div></div></div>
<div class="blk"><h6>E · 锁定块与侧栏 <span>TCRN 产品字标 Hanken Grotesk 600，「TCRN」墨色、后缀用各自产品的深色（TMS #2c63c8、Design System #6577f3）；Einzbern 与 Mana Orchestrate 是完整名称，Source Serif 4 墨色加 by TCRN</span></h6><div class="paper"><div class="lock">${locks}</div><div class="row" style="gap:16px;margin-top:6px">${rails}</div></div></div>
</section>`;
}

const grids = Object.keys(MARKS).map((k) => `<div class="g48">${gridded(k, 260)}<small>${MARKS[k].name} · 48 格 · 视觉圆 r 22</small></div>`).join("");
const src = Object.keys(MARKS).map((k) => `<pre><b>${MARKS[k].name}</b><span>&lt;svg viewBox="0 0 48 48"&gt;</span>\n${esc(MARKS[k].body(PAL[k]))}\n<span>&lt;/svg&gt;</span></pre>`).join("");

const colorRows = [
  ["产品", "色", "深色 · 于白 / 于夜间纸", "亮色 · 于白 / 于夜间纸", "来源"],
  ["TCRN TMS", "蓝", `${PAL.tms.deep} · ${fmt(cr(PAL.tms.deep, "#ffffff"))} / ${fmt(cr(PAL.tms.deep, "#191916"))}`, `${PAL.tms.bright} · ${fmt(cr(PAL.tms.bright, "#ffffff"))} / ${fmt(cr(PAL.tms.bright, "#191916"))}`, "注册色 brand-accent-tms #2c63c8 加一档亮色"],
  ["Einzbern", "藏青", `${PAL.einzbern.deep} · ${fmt(cr(PAL.einzbern.deep, "#ffffff"))} / ${fmt(cr(PAL.einzbern.deep, "#191916"))}`, `${PAL.einzbern.bright} · ${fmt(cr(PAL.einzbern.bright, "#ffffff"))} / ${fmt(cr(PAL.einzbern.bright, "#191916"))}`, "注册色 brand-accent-workflow #3b5272 加一档亮色"],
  ["Mana Orchestrate", "绿", `${PAL.mana.deep} · ${fmt(cr(PAL.mana.deep, "#ffffff"))} / ${fmt(cr(PAL.mana.deep, "#191916"))}`, `${PAL.mana.bright} · ${fmt(cr(PAL.mana.bright, "#ffffff"))} / ${fmt(cr(PAL.mana.bright, "#191916"))}`, "母标中心的黄绿 #c4ec8d 压深一档；与 Einzbern 成一对"],
  ["TCRN Design System", "四色", `${PAL.ds.deep} ${PAL.ds.bright}`, `${PAL.ds.c3} ${PAL.ds.c4}`, "注册色 brand-accent-design-system-1 至 4，原样"]
];
const colors = kvTable(colorRows, [170, 70, 320, 320]);

const taglines = kvTable([
  ["产品", "zh-CN", "en", "ja", "ko", "fr"],
  ["TCRN TMS", "艺人管理系统", "Talent Management System", "タレントマネジメントシステム", "탤런트 관리 시스템", "Système de gestion des talents"],
  ["Einzbern", "项目记忆引擎", "Project memory engine", "プロジェクト記憶エンジン", "프로젝트 메모리 엔진", "Moteur de mémoire de projet"],
  ["Mana Orchestrate", "项目记忆助手", "Project memory assistant", "プロジェクト記憶アシスタント", "프로젝트 메모리 어시스턴트", "Assistant mémoire de projet"],
  ["TCRN Design System", "设计系统", "Design System", "デザインシステム", "디자인 시스템", "Système de design"]
], [170, 240, 320, 300, 280]);

const body = `
<header class="bh">
<div>
<p class="k">Batch two · prelude · Product marks · approved 2026-10-11</p>
<h1>四枚产品标：实心几何，两色平涂<em>，每枚一个形</em></h1>
<p>Owner 2026-10-11 通过本稿（两处修订：TCRN 产品后缀用产品色；Mana Orchestrate 的名称与标语不提宿主）。实心的几何形，每枚两种平涂色，颜色从 TCRN 母标现有的蓝、藏青、黄绿与四色里取，没有渐变、描边与投影。TCRN TMS 是双臂高举的艺人，Einzbern 是接住一点光的盃，Mana Orchestrate 是两结点之间的一道流，TCRN Design System 是一张四色版面。一个形从 128 到 16 不换切法；侧栏与应用图标用淡底贴片，favicon 用深底贴片，禁色场合用单色版。</p>
</div>
<div class="meta"><b>48 格 · 圆角 4 · 视觉圆 r 22</b>实心，无描边、无渐变、无投影<b>每枚两色：深 + 亮</b>蓝 · 藏青 · 绿 · 四色，均出自母标<b>一个形走完 128 到 16</b>贴片两种：淡底、深底</div>
</header>

<div class="sec"><h3><b>A–E</b>四枚标 · 浅色与夜间 <span>大图、尺寸阶梯、贴片、单色版、锁定块</span></h3>
<div class="two">${pane(false)}${pane(true)}</div></div>

<div class="sec"><h3><b>F</b>构法 <span>48 格与视觉圆；坐标即路径坐标</span></h3><div class="grid48">${grids}</div></div>

<div class="sec"><h3><b>G</b>颜色 <span>每枚两色，数字是与白纸和夜间纸的对比度（形不是文字，供参考）</span></h3>${colors}</div>

<div class="sec"><h3><b>H</b>SVG 源 <span>viewBox 0 0 48 48，可直接进包；单色版把两色换成 currentColor</span></h3><div class="src">${src}</div></div>

<div class="sec"><h3><b>I</b>标语 <span>五语按 registry 机制，字标永远拉丁；产品名与标语不提任何宿主名（Owner 2026-10-11）</span></h3>${taglines}</div>
`;

write("V2-B2-Logos-Draft.dc.html", page({ title: "产品标草稿二 · 第二批前置", css, body, height }));
