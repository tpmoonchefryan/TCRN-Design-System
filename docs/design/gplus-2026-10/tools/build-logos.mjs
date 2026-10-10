import { T, cr, fmt, kvTable, page, write, grain, esc } from "./lib.mjs";
import fs from "node:fs";

const height = process.argv[2] ? Number(process.argv[2]) : 0;
const OUTSVG = new URL("../logos/", import.meta.url).pathname;
fs.mkdirSync(OUTSVG, { recursive: true });

// ---------- the four marks: 24 grid, live area 2..22, stroke 2, round caps ----------
const S = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
export const MARKS = {
  tms: {
    name: "TCRN TMS", zh: "艺人管理系统", short: "艺人管理系统", word: "TCRN TMS", font: "sans",
    line: `<g ${S}><circle cx="12" cy="9" r="3.75"/><path d="M12.3 5.3C12.3 3.5 13.9 2.5 15.8 2.9"/><path d="M4.5 21A7.5 7.5 0 0 1 19.5 21"/></g>`,
    solid: `<g fill="currentColor"><circle cx="12" cy="9.75" r="4.25"/><path d="M4 22A8 8 0 0 1 20 22Z"/></g><path d="M12.5 6C12.5 4.3 14 3.5 15.9 3.9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>`,
    says: "一个艺人的剪影：大头、呆毛、肩。头与肩同宽是二次元的比例，呆毛是角色最省笔的识别物，肩是 r 7.5 的半圆；没有话筒、耳机、波形这类所有直播软件都在用的东西。"
  },
  einzbern: {
    name: "Einzbern", zh: "项目记忆引擎", short: "项目记忆引擎", word: "Einzbern", font: "serif",
    line: `<g ${S}><path d="M4.93 7A7.5 7.5 0 0 0 19.07 7Z"/><path d="M12 12V16"/><path d="M7.5 17H16.5"/><path d="M8 9.25H16"/><path d="M10.5 11H13.5"/></g>`,
    solid: `<g fill="currentColor"><path d="M4.61 7A7.8 7.8 0 0 0 19.39 7Z"/></g><g fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 12.3V16"/><path d="M7.5 17.2H16.5"/></g>`,
    says: "一只盃：r 7.5 圆的下段做盏身，短足宽座，盏里两道线是存下来的层（纪要、卡片）。圣杯最省的画法，也是「盛着记忆的容器」；浅而宽，不是酒杯。"
  },
  mana: {
    name: "Mana Orchestrate", zh: "记忆助手 · Claude Code 与 Codex", short: "记忆助手", word: "Mana Orchestrate", font: "serif",
    line: `<g ${S}><circle cx="6.9" cy="6.9" r="2.8"/><circle cx="17.1" cy="17.1" r="2.8"/><path d="M9.7 6.9A7.4 7.4 0 0 1 17.1 14.3"/></g><circle cx="14.93" cy="9.07" r="1.75" fill="currentColor"/>`,
    solid: `<g fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round"><circle cx="6.9" cy="6.9" r="2.8"/><circle cx="17.1" cy="17.1" r="2.8"/><path d="M9.7 6.9A7.4 7.4 0 0 1 17.1 14.3"/></g><circle cx="14.93" cy="9.07" r="2.1" fill="currentColor"/>`,
    says: "两个环与一道弧：环是两处地方，弧是 mana 的去路，弧上的点是它此刻的位置——在对的时刻从一处到另一处。弧是 r 7.4 的四分之一，与 TMS 的肩、Einzbern 的盏同一把圆规。"
  },
  ds: {
    name: "TCRN Design System", zh: "组件库", short: "组件库", word: "TCRN Design System", font: "sans",
    line: `<g ${S}><rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M7.5 9H16.5"/><path d="M12 15H16.5"/></g><circle cx="8.5" cy="15" r="1.5" fill="currentColor"/>`,
    solid: `<path fill-rule="evenodd" fill="currentColor" d="M6 2.5h12a3.5 3.5 0 0 1 3.5 3.5v12a3.5 3.5 0 0 1-3.5 3.5H6A3.5 3.5 0 0 1 2.5 18V6A3.5 3.5 0 0 1 6 2.5zM7.5 8v2h9V8zm4.5 6v2h4.5v-2zM8.5 13.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>`,
    says: "面、线、点：一张纸、一道区段线、一个状态点加一行字。设计系统的三个原语，也是构图一那张纸的剖面。"
  }
};
const svg = (k, cut, size, extra = "") => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" data-logo="${k}" data-cut="${cut}" data-size="${size}"${extra}>${MARKS[k][cut]}</svg>`;
const seal = (k, size) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" data-logo="${k}" data-cut="seal" data-size="${size}"><rect width="24" height="24" rx="3" fill="#8e2d24"/><g transform="translate(3.36 3.36) scale(0.72)" style="color:#ffffff">${MARKS[k].solid}</g></svg>`;
const tile = (k, size, night) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" data-logo="${k}" data-cut="tile" data-size="${size}"><rect width="24" height="24" rx="5.5" fill="${night ? "#ebe8df" : "#16150f"}"/><g transform="translate(3.36 3.36) scale(0.72)" style="color:${night ? "#121210" : "#ffffff"}">${MARKS[k].solid}</g></svg>`;

// standalone svg files (ink, line cut) for download
for (const k of Object.keys(MARKS)) {
  fs.writeFileSync(`${OUTSVG}/${k}-line.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" role="img" aria-label="${MARKS[k].name}"><g style="color:#16150f">${MARKS[k].line}</g></svg>\n`);
  fs.writeFileSync(`${OUTSVG}/${k}-solid.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" role="img" aria-label="${MARKS[k].name}"><g style="color:#16150f">${MARKS[k].solid}</g></svg>\n`);
}

function gridded(k, size) {
  const lines = [];
  for (let i = 0; i <= 24; i++) lines.push(`<path d="M${i} 0V24" stroke="var(--line-2)" stroke-width=".06"/><path d="M0 ${i}H24" stroke="var(--line-2)" stroke-width=".06"/>`);
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" data-logo="${k}" data-cut="line" data-size="${size}" data-grid><rect width="24" height="24" fill="var(--panel)"/>${lines.join("")}<rect x="2" y="2" width="20" height="20" fill="none" stroke="var(--acc)" stroke-width=".12" stroke-dasharray=".5 .4"/><circle cx="12" cy="12" r="10" fill="none" stroke="var(--acc)" stroke-width=".12" stroke-dasharray=".5 .4"/>${MARKS[k].line}</svg>`;
}

const css = `
.marks4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}
.mk{display:flex;flex-direction:column;gap:10px;min-width:0;color:var(--ink)}
.mk .big{display:flex;align-items:center;justify-content:center;padding:14px;border-radius:12px;box-shadow:inset 0 0 0 1px var(--line)}
.mk h5{margin:0;font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk h5 small{font-weight:400;color:var(--ink-3);margin-left:6px}
.mk p{margin:0;font-size:12px;line-height:1.55;color:var(--ink-2)}
.ladder{display:grid;grid-template-columns:150px repeat(6,minmax(0,1fr));align-items:end;column-gap:12px;row-gap:14px}
.ladder>b{font-size:12px;font-weight:600;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;align-self:center}
.ladder .c{display:flex;flex-direction:column;align-items:center;gap:6px;color:var(--ink)}
.ladder .c small{font-family:var(--mono);font-size:10px;color:var(--ink-3);white-space:nowrap}
.ladder .hd{font-family:var(--mono);font-size:10.5px;color:var(--ink-3);text-align:center;white-space:nowrap}
.seals{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}
.seal{display:flex;flex-direction:column;gap:8px;align-items:flex-start}
.seal .r{display:flex;align-items:flex-end;gap:14px}
.seal small{font-family:var(--mono);font-size:10.5px;color:var(--ink-3);white-space:nowrap}
.lock{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 28px}
.lk{display:grid;grid-template-columns:auto minmax(0,1fr);column-gap:12px;align-items:center;min-width:0;color:var(--ink)}
.lk .w{display:grid;gap:2px;min-width:0}
.lk .w b{font-size:15px;line-height:20px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lk .w b.serif{font-family:var(--serif);font-weight:400;font-size:17px;letter-spacing:.04em}
.lk .w small{font-size:11.5px;line-height:16px;color:var(--ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lk .w small.by{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3)}
.rail{display:grid;grid-template-columns:22px minmax(0,1fr);column-gap:10px;align-items:center;padding:6px 4px;width:200px;color:var(--ink)}
.rail b{display:block;font-size:12.5px;font-weight:600;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rail b.serif{font-family:var(--serif);font-weight:400;font-size:13.5px;letter-spacing:.03em}
.rail small{display:block;font-size:10.5px;color:var(--ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rel{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.rel .it{display:flex;flex-direction:column;gap:8px;align-items:flex-start;padding:16px 18px;border-radius:12px;background:#fff;box-shadow:0 0 0 1px rgba(22,21,15,.08)}
.rel .it p{margin:0;font-size:12.5px;color:#4f4c43;line-height:1.55}
.src{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.src pre{margin:0;padding:14px 16px;border-radius:12px;background:#fff;box-shadow:0 0 0 1px rgba(22,21,15,.08);font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:11px;line-height:1.55;color:#16150f;white-space:pre-wrap;word-break:break-all}
.src pre b{display:block;font-family:"Hanken Grotesk","Noto Sans SC",sans-serif;font-size:12.5px;margin-bottom:6px}
.src pre span{color:#6b675d}
`;

function pane(night) {
  const t = night ? T.night : T.light;
  const th = night ? "n" : "l";
  const cell = (id, ink, fill, surface, kind = "icon") => ` data-cell="${id}-${th}" data-kind="${kind}" data-expect="${fmt(cr(ink, fill, surface))}"`;
  const P = t.panel;
  const marks = Object.keys(MARKS).map((k, i) => `<div class="mk"><div class="big"${i === 0 ? cell("mark-panel", t.ink, P, P) : ""}>${gridded(k, 192)}</div><h5>${MARKS[k].name}<small>${MARKS[k].short}</small></h5><p>${MARKS[k].says}</p></div>`).join("");
  const sizes = [128, 56, 38, 28, 22, 16];
  const ladder = `<span></span>${sizes.map((s) => `<span class="hd">${s} · ${s >= 28 ? "单线" : "实心"} · 描边 ${fmt(2 * s / 24).replace(/\.?0+$/, "")}px</span>`).join("")}` + Object.keys(MARKS).map((k) => `<b>${MARKS[k].name}</b>${sizes.map((s) => `<span class="c">${svg(k, s >= 28 ? "line" : "solid", s)}</span>`).join("")}`).join("");
  const seals = Object.keys(MARKS).map((k) => `<div class="seal"><div class="r">${seal(k, 56)}${seal(k, 28)}${tile(k, 56, night)}${tile(k, 28, night)}</div><small>${MARKS[k].name} · 印章 56 / 28 · 贴片 56 / 28</small></div>`).join("");
  const locks = Object.keys(MARKS).map((k) => { const m = MARKS[k]; const by = m.font === "serif"; return `<div class="lk" role="img" aria-label="${m.name} ${m.zh}">${svg(k, "line", 38)}<span class="w" aria-hidden="true"><b class="${by ? "serif" : ""}">${m.word}</b><small>${m.zh}</small>${by ? '<small class="by">by TCRN</small>' : ""}</span></div>`; }).join("");
  const rails = Object.keys(MARKS).map((k) => { const m = MARKS[k]; return `<div class="rail">${svg(k, "solid", 22)}<span><b class="${m.font === "serif" ? "serif" : ""}">${m.word}</b><small>${m.zh}</small></span></div>`; }).join("");
  return `<section class="pane gp${night ? " night" : ""}" aria-label="${night ? "夜间" : "浅色"}">
${grain("lg-" + th)}
<span class="ptag">${night ? "night · 画布 #121210 · 纸 #191916" : "light · 画布 #efeeea · 纸 #ffffff"}</span>
<div class="blk"><h6>A · 四枚标 · 24 格构法 <span>活动区 2 至 22（虚线方）、视觉圆 r 10（虚线圆）；描边 2，圆头圆角；曲线只取 r 7.5 的圆与 r 3.75 / 2.8 的小圆，无斜线</span></h6>
<div class="paper"><div class="marks4">${marks}</div></div></div>
<div class="blk"><h6>B · 尺寸阶梯 <span>28 以上单线切，22 与 16 实心切；描边随尺寸等比，不用非缩放描边</span></h6>
<div class="paper"><div class="ladder">${ladder}</div></div></div>
<div class="blk"><h6>C · 印章与贴片 <span>印章：砖红 #8e2d24 方印 r 3，纸色实心图形，只用于身份时刻；贴片：墨底纸图形，用于 OS 图标与 favicon</span></h6>
<div class="paper"><div class="seals">${seals}</div></div></div>
<div class="blk"><h6>D · 锁定块与侧栏 <span>TCRN 产品字标 Hanken Grotesk 600；Einzbern 与 Mana Orchestrate 字标 Source Serif 4 400 加 .04em，下加 by TCRN</span></h6>
<div class="paper"><div class="lock">${locks}</div><div class="row" style="gap:20px;margin-top:4px">${rails}</div></div></div>
</section>`;
}

const rel = `<div class="rel">
<div class="it"><svg viewBox="0 0 24 24" width="160" height="160" aria-hidden="true"><circle cx="12" cy="12" r="7.5" fill="none" stroke="#6b675d" stroke-width=".3" stroke-dasharray=".8 .6"/><g fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12A7.5 7.5 0 0 1 19.5 12" stroke="#16150f"/><path d="M4.93 14.5A7.5 7.5 0 0 0 19.07 14.5" stroke="#8e2d24" transform="translate(0 -2.5)"/><path d="M4.5 12A7.5 7.5 0 0 0 12 19.5" stroke="#0b6b65"/></g></svg><p><b>三枚同一个圆</b>：r 7.5 的圆，TMS 的肩是它的上半（墨），Einzbern 的盏是它弦下的一段（砖红），Mana 的弧是它的四分之一（青，仅示意）。同一把圆规画出来的家族。</p></div>
<div class="it"><svg viewBox="0 0 24 24" width="160" height="160" aria-hidden="true" style="color:#16150f"><g ${S}><rect x="3.5" y="3.5" width="17" height="17" rx="3"/></g><rect x="0" y="0" width="24" height="24" rx="3" fill="none" stroke="#8e2d24" stroke-width=".6" stroke-dasharray="1 .8"/><rect x="2.5" y="2.5" width="19" height="19" rx="3.5" fill="none" stroke="#0b6b65" stroke-width=".6" stroke-dasharray="1 .8"/></svg><p><b>方与印同比例</b>：Design System 的纸 r 3 / 17，印章 r 3 / 24，贴片 r 5.5 / 24；三者都是 G+ 的控件 8、面板 12、印章 3 那一组比例。</p></div>
<div class="it"><svg viewBox="0 0 24 24" width="160" height="160" aria-hidden="true" style="color:#16150f"><g ${S}><circle cx="12" cy="9" r="3.75"/><path d="M12.3 5.3C12.3 3.5 13.9 2.5 15.8 2.9"/><path d="M4.5 21A7.5 7.5 0 0 1 19.5 21"/></g><circle cx="12" cy="12" r="10" fill="none" stroke="#0b6b65" stroke-width=".4" stroke-dasharray="1 .8"/><path d="M12 2V22M2 12H22" stroke="#0b6b65" stroke-width=".3"/></svg><p><b>TMS 的重心</b>：头心 (12, 9)，肩弧落在活动区底边 22，整枚几何中心在 (12, 12.2)，与视觉圆同心；呆毛是唯一出圆的笔画，刻意留给它。</p></div>
</div>`;

const src = Object.keys(MARKS).map((k) => `<pre><b>${MARKS[k].name} · line cut</b><span>&lt;svg viewBox="0 0 24 24"&gt;</span>\n${esc(MARKS[k].line)}\n<span>&lt;/svg&gt;</span></pre>`).join("");

const taglines = kvTable([
  ["产品", "zh-CN", "en", "ja", "ko", "fr", "备注"],
  ["TCRN TMS", "艺人管理系统", "Talent Management System", "タレントマネジメントシステム", "탤런트 관리 시스템", "Système de gestion des talents", "zh 由「人才」改「艺人」；ko 由 인재（人才）改 탤런트；en、ja、fr 本就是艺人义"],
  ["Einzbern", "项目记忆引擎", "Project memory engine", "プロジェクト記憶エンジン", "프로젝트 메모리 엔진", "Moteur de mémoire de projet", "registry 的 workflow 条目改名 einzbern；字标不带 TCRN 前缀，锁定块加 by TCRN"],
  ["Mana Orchestrate", "记忆助手 · Claude Code 与 Codex", "Memory assistant for Claude Code and Codex", "Claude Code と Codex の記憶アシスタント", "Claude Code와 Codex의 메모리 어시스턴트", "Assistant mémoire pour Claude Code et Codex", "registry 新增 mana-orchestrate"],
  ["TCRN Design System", "组件库", "Component Library", "コンポーネントライブラリ", "컴포넌트 라이브러리", "Bibliothèque de composants", "不变"]
], [170, 220, 300, 280, 260, 300]);

const files = Object.keys(MARKS).map((k) => `${k}-line.svg · ${k}-solid.svg`).join("，");
const next = `<div class="cols2">
<div class="box"><h4>这块板是草稿</h4><p class="lead">四枚标的图形、两种切法、印章与贴片、锁定块都已成形；看后的改动直接改路径重出，不另开讨论。</p><ul><li>定稿后补：安全区（标高的 1/4）、最小尺寸（单线 24、实心 14）、误用清单（不加渐变、不加投影、不换色、不旋转、不改比例）、OS 图标与 favicon 导出。</li><li>SVG 源文件：${files}，上传为画布资产并记 sha256（见 G 段）。</li><li>TCRN 母标与 AOS 不在本阶段。</li></ul></div>
<div class="box"><h4>进包时的变化</h4><ul><li>TcrnBrandMark 从一张 img 改为四枚（将来六枚）内联 SVG 的注册表，按 productId 取；颜色跟 currentColor，印章版与贴片版是独立导出。</li><li>tcrnProductLogoRegistry：workflow 改 einzbern，新增 mana-orchestrate；TMS 五语标语按上表；Einzbern 与 Mana 的字标走衬线。</li><li>C9 的 digest 对象从一个 SVG 变成八个（四枚 × 两种切法）。</li></ul></div>
</div>`;

const body = `
<header class="bh">
<div>
<p class="k">Batch two · prelude · Product marks · draft</p>
<h1>四枚产品标草稿：同一枚「印」的构法<em>，墨与纸两色</em></h1>
<p>TCRN TMS（艺人管理系统，面向虚拟主播管理公司）、Einzbern、Mana Orchestrate、TCRN Design System。24 格、描边 2、圆头圆角，只用墨与纸两色；28 以上用单线切，22 与 16 用实心切；砖红方印只在身份时刻。每枚图形说自己的事：艺人剪影、盛记忆的盏、两环之间的流、面线点。全部为手写 SVG 路径，无渐变、无滤镜、无位图。</p>
</div>
<div class="meta"><b>24 格 · 活动区 20 · 描边 2 · 同一个 r 7.5 的圆</b>两种切法：单线 ≥ 28，实心 ≤ 22<b>墨 #16150f / 纸 · 印章 #8e2d24</b>永不：青、渐变、多色、投影<b>TMS 的肩、Einzbern 的盏、Mana 的弧同圆</b>一把圆规画出来的家族</div>
</header>

<div class="sec"><h3><b>A–D</b>四枚标 · 浅色与夜间 <span>构法、尺寸阶梯、印章与贴片、锁定块</span></h3>
<div class="two">${pane(false)}${pane(true)}</div></div>

<div class="sec"><h3><b>E</b>三组关系 <span>同圆、同比例、同重心</span></h3>${rel}</div>

<div class="sec"><h3><b>F</b>SVG 源 · 单线切 <span>24 格坐标即路径坐标，可直接进包</span></h3><div class="src">${src}</div></div>

<div class="sec"><h3><b>G</b>标语草拟与注册表变化 <span>五语按 registry 机制，字标永远拉丁</span></h3>${taglines}</div>

<div class="sec"><h3><b>H</b>草稿之后 <span>定稿项与进包变化</span></h3>${next}</div>
`;

write("V2-B2-Logos-Draft.dc.html", page({ title: "产品标草稿 · 第二批前置", css, body, height }));
