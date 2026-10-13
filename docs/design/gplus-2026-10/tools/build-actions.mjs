import { T, cr, fmt, icon, shell, matrixTable, kvTable, page, write, grain, over, parseColor, hex, cellAttrs } from "./lib.mjs";
import { pairState, pairDecls, tokenValue } from "./data.mjs";

const height = process.argv[2] ? Number(process.argv[2]) : 0;

// ---------- component css: pairs on variants, states only switch which pair is live ----------
// the board declares the d/h/a/x/s pairs; focus and loading reuse the default pair (contract/pairs.json)
const AB = { states: ["d", "h", "a", "x", "s"], refEdge: true };
const css = `
.btn{--fill:var(--fill-d);--ink-c:var(--ink-d);--edge:var(--edge-d);--fw:500;position:relative;height:var(--h-md);padding:0 var(--pad-md);border:0;border-radius:var(--r-ctl);background:var(--fill);color:var(--ink-c);box-shadow:var(--edge);font-family:var(--sans);font-size:var(--fs-md);font-weight:var(--fw);line-height:1;display:inline-flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap;cursor:pointer;text-decoration:none;flex:0 0 auto;transition:background-color var(--t-fill) var(--ease),color var(--t-fill) var(--ease),box-shadow var(--t-fill) var(--ease)}
.btn .ic{flex:0 0 auto}
.btn.sm{height:var(--h-sm);padding:0 var(--pad-sm);font-size:var(--fs-sm)}
.btn.lg{height:var(--h-lg);padding:0 var(--pad-lg);font-size:var(--fs-lg)}
.btn.ico{width:var(--h-md);padding:0}
.btn.ico.sm{width:var(--h-sm)}
.btn.ico.lg{width:var(--h-lg)}
/* variants: every state pair is declared here, nowhere else */
.btn.secondary{${pairDecls("actions", "secondary", AB)}}
.btn.pri{${pairDecls("actions", "primary", AB)}}
.btn.quiet{${pairDecls("actions", "quiet", AB)}}
.btn.danger{${pairDecls("actions", "danger", AB)}}
/* states: lower specificity than any variant (0,1,0); they never name a colour */
.btn:where(:hover,.is-hover){--fill:var(--fill-h);--ink-c:var(--ink-h);--edge:var(--edge-h)}
.btn:where(:active,.is-active){--fill:var(--fill-a);--ink-c:var(--ink-a);--edge:var(--edge-a)}
.btn:where(:focus-visible,.is-focus){outline:none;--edge:var(--focus),var(--edge-d)}
.btn:where([aria-pressed="true"],.is-sel){--fill:var(--fill-s);--ink-c:var(--ink-s);--edge:var(--edge-s);--fw:600}
.btn:where(:disabled,[aria-disabled="true"]){--fill:var(--fill-x);--ink-c:var(--ink-x);--edge:var(--edge-x);cursor:not-allowed}
.btn:where([aria-busy="true"]){pointer-events:none}
.btn .spin{width:13px;height:13px}
.btn.lg .spin{width:15px;height:15px}
/* group */
.grp{display:inline-flex;align-items:stretch;border-radius:var(--r-ctl);box-shadow:0 1px 1px rgba(22,21,15,.04),0 0 0 1px var(--line-ctl);isolation:isolate}
.grp .btn{border-radius:0;--edge-d:0 0 #0000;--edge-h:0 0 #0000;--edge-a:0 0 #0000;--edge-s:0 0 #0000;--edge-x:0 0 #0000;margin-left:1px}
.grp .btn:first-child{border-radius:var(--r-ctl) 0 0 var(--r-ctl);margin-left:0}
.grp .btn:last-child{border-radius:0 var(--r-ctl) var(--r-ctl) 0}
.grp .btn:where(:focus-visible,.is-focus){z-index:1}
.grp>i{width:1px;background:var(--line-ctl);flex:0 0 auto}
.grp.quiet{box-shadow:none}
.grp.quiet>i{background:var(--line-2)}
/* clipboard */
.cb[data-state="copied"]{--ink-d:var(--ok);--fill-d:var(--panel)}
.cb[data-state="failed"]{--ink-d:var(--bad)}
.cb[data-state="unsupported"]{--ink-d:var(--ink-3)}
.lab{display:flex;flex-direction:column;gap:7px;align-items:flex-start;min-width:0}
.lab>small{font-size:10.5px;color:var(--ink-3);font-family:var(--mono);white-space:nowrap}
.srow{display:grid;grid-template-columns:120px repeat(7,minmax(0,1fr));align-items:center;column-gap:14px;min-width:0}
.srow>b{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3);font-weight:500;white-space:nowrap}
.srow>.lab{align-items:flex-start}
.hdr{display:grid;grid-template-columns:120px repeat(7,minmax(0,1fr));column-gap:14px}
.hdr>small{font-size:10.5px;color:var(--ink-3);font-family:var(--mono);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.edgecmp{display:flex;align-items:center;gap:24px}
.edgecmp .btn{--fw:500}
.bar{display:flex;align-items:center;gap:10px;min-width:0}
.dz{display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:10px;box-shadow:inset 0 0 0 1px var(--line);min-width:0}
.dz b{display:block;font-weight:600;font-size:12.5px;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dz small{display:block;color:var(--ink-3);font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dz .sp{flex:1}
.who{display:flex;align-items:center;gap:9px;min-width:0}
.who b{font-weight:600;color:var(--ink);display:block;line-height:1.2;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.who small{display:block;font-size:10.5px;color:var(--ink-3);font-family:var(--mono);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cmd{position:relative;display:flex;align-items:center;width:220px;height:28px;padding:0 8px 0 28px;border-radius:7px;background:var(--wash);color:var(--ink-3);font-size:12px;white-space:nowrap;overflow:hidden}
.cmd .ic{position:absolute;left:9px}
.cmd kbd{margin-left:auto;font-family:var(--mono);font-size:10px;color:var(--ink-3);border:1px solid var(--line-2);border-radius:4px;padding:0 4px}
`;

const VARIANTS = [
  { k: "pri", c: "pri", name: "primary", zh: "主按钮", label: "保存" },
  { k: "sec", c: "secondary", name: "secondary", zh: "次按钮", label: "导出" },
  { k: "quiet", c: "quiet", name: "quiet", zh: "安静", label: "取消" },
  { k: "danger", c: "danger", name: "danger", zh: "危险", label: "删除项目" }
];
const STATES = [
  { k: "d", name: "default", attr: "" },
  { k: "h", name: "hover", attr: ' class="is-hover"' },
  { k: "a", name: "active", attr: ' class="is-active"' },
  { k: "f", name: "focus", attr: ' class="is-focus"' },
  { k: "x", name: "disabled", attr: " disabled" },
  { k: "l", name: "loading", attr: ' aria-busy="true"' },
  { k: "s", name: "selected", attr: ' aria-pressed="true"' }
];
// pair tables (fill, ink) per variant per state, resolved for a theme from contract/pairs.json
function pairs(t) {
  const theme = t === T.night ? "night" : "light";
  return Object.fromEntries(VARIANTS.map((v) => [v.k, Object.fromEntries(STATES.map((s) => {
    const p = pairState("actions", v.name, s.k);
    return [s.k, [tokenValue(theme, p.fill), tokenValue(theme, p.ink)]];
  }))]));
}

function btn(v, s, { size = "", label, ico = false, surface, t, th, cellId } = {}) {
  const sel = s.k === "s" && (v.k === "pri" || v.k === "danger");
  const cls = `btn ${v.c}${size ? " " + size : ""}${ico ? " ico" : ""}${s.attr.includes("class=") ? " " + s.attr.match(/class="([^"]+)"/)[1] : ""}`;
  const attrs = s.attr.replace(/ class="[^"]+"/, "");
  const cell = cellId && !sel ? ` ${cellAttrs("actions", `${cellId}-${th}`)}` : "";
  const inner = s.k === "l" ? `${icon("loader-circle", { size: size === "lg" ? 15 : 13, cls: "spin" })}${ico ? "" : "保存中"}` : ico ? icon(v.k === "danger" ? "x" : v.k === "pri" ? "check" : "settings", { size: size === "lg" ? 20 : size === "sm" ? 14 : 16 }) : (label || v.label);
  const aria = ico ? ` aria-label="${v.zh}"` : "";
  if (sel) return `<span class="lab"><small>—</small></span>`;
  return `<button type="button" class="${cls}"${attrs}${aria}${cell}>${inner}</button>`;
}

function pane(night) {
  const t = night ? T.night : T.light;
  const th = night ? "n" : "l";
  const P = t.panel;
  const hdr = `<div class="hdr"><small></small>${STATES.map((s) => `<small>${s.name}</small>`).join("")}</div>`;
  const stateRows = VARIANTS.map((v) => `<div class="srow"><b>${v.name}</b>${STATES.map((s) => `<span class="lab">${btn(v, s, { t, th, surface: P, cellId: `${v.k}-${s.k}` })}</span>`).join("")}</div>`).join("");
  const icoRows = VARIANTS.map((v) => `<div class="srow"><b>${v.name}</b>${STATES.map((s) => `<span class="lab">${btn(v, s, { t, th, surface: P, ico: true, cellId: `ico-${v.k}-${s.k}` })}</span>`).join("")}</div>`).join("");
  const sizes = ["sm", "md", "lg"].map((sz) => `<span class="lab">${btn(VARIANTS[0], STATES[0], { t, th, size: sz === "md" ? "" : sz, label: "邀请成员" })}<small>${sz} · ${sz === "sm" ? "28 / pad 10 / 12" : sz === "md" ? "32 / pad 12 / 13" : "40 / pad 16 / 14"}</small></span><span class="lab">${btn(VARIANTS[1], STATES[0], { t, th, size: sz === "md" ? "" : sz, label: "导出" })}<small>${sz}</small></span><span class="lab">${btn(VARIANTS[1], STATES[0], { t, th, size: sz === "md" ? "" : sz, ico: true })}<small>icon ${sz === "sm" ? "28 · 14" : sz === "md" ? "32 · 16" : "40 · 20"}</small></span>`).join("");
  const withIcon = `<span class="lab"><button type="button" class="btn pri">${icon("check", { size: 14 })}已保存</button><small>图标在前 14</small></span><span class="lab"><button type="button" class="btn secondary">导出${icon("external-link", { size: 14 })}</button><small>图标在后</small></span><span class="lab"><button type="button" class="btn quiet">${icon("history", { size: 14 })}历史</button><small>quiet</small></span><span class="lab"><button type="button" class="btn secondary lg">${icon("arrow-right", { size: 16 })}下一步</button><small>lg · 16</small></span><span class="lab"><button type="button" class="btn secondary sm">${icon("chevron-down", { size: 14 })}更多</button><small>sm · 14</small></span>`;
  const links = [["pri", "查看账单"], ["secondary", "打开项目"], ["quiet", "返回"]].map(([k, l]) => `<span class="lab"><a class="btn ${k}" href="#x">${l}${icon("arrow-right", { size: 14 })}</a><small>LinkButton ${k}</small></span>`).join("") + `<span class="lab"><a class="btn secondary is-focus" href="#y">打开项目</a><small>focus</small></span><span class="lab"><a class="btn secondary is-hover" href="#z">打开项目</a><small>hover</small></span>`;
  const cb = [["idle", "复制 ID", "", "copy"], ["copying", "复制中…", ' aria-busy="true"', "spin"], ["copied", "已复制", "", "check"], ["failed", "复制失败", "", "alert-triangle"], ["unsupported", "不支持复制", "", "info"]].map(([st, l, a, ic]) => {
    return `<span class="lab"><button type="button" class="btn secondary sm cb" data-state="${st}"${a} ${cellAttrs("actions", `cb-${st}-${th}`)}>${ic === "spin" ? icon("loader-circle", { size: 13, cls: "spin" }) : ic ? icon(ic, { size: 13 }) : ""}${l}</button><small>${st}</small></span>`;
  }).join("");
  const groups = `<span class="lab"><span class="grp" role="group" aria-label="视图"><button type="button" class="btn secondary ico" aria-pressed="true" aria-label="列表" ${cellAttrs("actions", `grp-sel-${th}`)}>${icon("menu", { size: 16 })}</button><i></i><button type="button" class="btn secondary ico" aria-pressed="false" aria-label="网格">${icon("layout-grid", { size: 16 })}</button></span><small>toggle · aria-pressed</small></span>
<span class="lab"><span class="grp" role="group" aria-label="导入导出"><button type="button" class="btn secondary">导入</button><i></i><button type="button" class="btn secondary">导出</button><i></i><button type="button" class="btn secondary ico" aria-label="更多">${icon("chevron-down", { size: 16 })}</button></span><small>attached · 三件</small></span>
<span class="lab"><span class="grp" role="group" aria-label="周期"><button type="button" class="btn secondary sm" aria-pressed="true">日</button><i></i><button type="button" class="btn secondary sm" aria-pressed="false">周</button><i></i><button type="button" class="btn secondary sm" aria-pressed="false">月</button></span><small>sm · 单选</small></span>
<span class="lab"><span class="grp quiet" role="group" aria-label="工具"><button type="button" class="btn quiet ico" aria-label="撤销">${icon("arrow-left", { size: 16 })}</button><button type="button" class="btn quiet ico" aria-label="重做">${icon("arrow-right", { size: 16 })}</button><i></i><button type="button" class="btn quiet ico" aria-label="历史">${icon("history", { size: 16 })}</button></span><small>quiet · 无轮廓</small></span>
<span class="lab"><span class="grp" role="group" aria-label="焦点"><button type="button" class="btn secondary">上一页</button><i></i><button type="button" class="btn secondary is-focus">下一页</button></span><small>focus 在组内</small></span>`;
  return `<section class="pane gp${night ? " night" : ""}" aria-label="${night ? "夜间" : "浅色"}">
${grain("ac-" + th)}
<span class="ptag">${night ? "night · 画布 #121210 · 纸 #191916" : "light · 画布 #efeeea · 纸 #ffffff"}</span>
<div class="blk"><h6>Button · 四种变体 × 七种状态 <span>fill 与 ink 成对，状态只切换生效的对；primary 与 danger 无 selected</span></h6>
<div class="paper">${hdr}${stateRows}</div></div>
<div class="blk"><h6>IconButton · 同一矩阵 <span>方形 28 / 32 / 40，ariaLabel 必填；图标 ≥ 3</span></h6>
<div class="paper">${hdr}${icoRows}</div></div>
<div class="blk"><h6>尺寸与图标 <span>sm 28 · md 32 · lg 40；文字 12 / 13 / 14；图标 14 / 14 / 16，独立图标按钮 14 / 16 / 20</span></h6>
<div class="paper"><div class="row" style="gap:22px;align-items:flex-start">${sizes}</div><div class="row" style="gap:22px;align-items:flex-start">${withIcon}</div></div></div>
<div class="blk"><h6>LinkButton · a 元素 <span>primary · secondary · quiet 与 Button 同一对表；是链接不是按钮，有 href</span></h6>
<div class="paper"><div class="row" style="gap:22px;align-items:flex-start">${links}</div></div></div>
<div class="blk"><h6>ClipboardCopyButton · 五种复制状态 <span>idle → copying → copied / failed / unsupported，2 秒后回 idle；文字随状态换，底色不换</span></h6>
<div class="paper"><div class="row" style="gap:22px;align-items:flex-start">${cb}</div></div></div>
<div class="blk"><h6>ButtonGroup · 新增 <span>role=group 加 aria-label；相连、共用一圈轮廓、1px 分隔；单选用 aria-pressed，选中 6% 墨洗加字重</span></h6>
<div class="paper"><div class="row" style="gap:26px;align-items:flex-start">${groups}</div></div></div>
</section>`;
}

// ---------- matrix ----------
function rows() {
  const out = [];
  for (const v of VARIANTS) {
    out.push({ group: `${v.name} · ${v.zh}（Button · IconButton · LinkButton 同表）` });
    for (const s of STATES) {
      if (s.k === "s" && (v.k === "pri" || v.k === "danger")) continue;
      const note = { d: "fill-d / ink-d", h: "fill-h / ink-h", a: "fill-a / ink-a", f: "同 default + 焦点环", x: "fill-x / ink-x（WCAG 豁免）", l: "同 default + 转环，aria-busy", s: "fill-s / ink-s + 600" }[s.k];
      out.push({ name: `${v.name} · ${s.name}`, note, cells: [T.light, T.night].map((t) => { const p = pairs(t)[v.k][s.k]; return { fill: p[0], ink: p[1], surface: t.panel, kind: "text", exempt: s.k === "x", fillLabel: lbl(t, p[0]), inkLabel: lbl(t, p[1]) }; }) });
    }
  }
  out.push({ group: "ClipboardCopyButton · 文字随状态" });
  for (const [st, ink] of [["copied", "ok"], ["failed", "bad"], ["unsupported", "ink3"]]) out.push({ name: `secondary · ${st}`, note: `ink 换 ${ink}，fill 不变`, cells: [T.light, T.night].map((t) => ({ fill: t.panel, ink: t[ink], surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: ink })) });
  out.push({ group: "边线与环 · ≥ 3" });
  out.push({ name: "控件轮廓 line-ctl", note: "secondary · danger · ButtonGroup 外圈与分隔", cells: [T.light, T.night].map((t) => ({ fill: t.panel, ink: t.lineCtl, surface: t.panel, kind: "edge", fillLabel: "panel", inkLabel: "line-ctl" })) });
  out.push({ name: "焦点环 acc 于纸", note: "2px 面色间隙 + 2px acc", cells: [T.light, T.night].map((t) => ({ fill: t.panel, ink: t.acc, surface: t.panel, kind: "edge", fillLabel: "panel", inkLabel: "acc" })) });
  out.push({ name: "焦点环 acc 于画布", note: "同上", cells: [T.light, T.night].map((t) => ({ fill: t.bg, ink: t.acc, surface: t.bg, kind: "edge", fillLabel: "bg", inkLabel: "acc" })) });
  out.push({ name: "primary 面 vs 纸", note: "填充即边界", cells: [T.light, T.night].map((t) => ({ fill: t.panel, ink: t.acc, surface: t.panel, kind: "edge", fillLabel: "panel", inkLabel: "acc" })) });
  out.push({ name: "selected 6% 墨洗 vs 纸", note: "选中靠字重与 aria-pressed，洗底只是辅助（裁定项）", cells: [T.light, T.night].map((t) => ({ fill: t.panel, ink: t.wash, surface: t.panel, kind: "edge", exempt: true, fillLabel: "panel", inkLabel: "wash" })) });
  return out;
}
function lbl(t, v) { for (const [k, val] of Object.entries(t)) if (val === v) return k; return v === "#0000" ? "transparent" : v; }
const matrix = matrixTable({ caption: "动作状态矩阵", cols: ["浅色", "夜间"], rows: rows() });

const motion = kvTable([
  ["元素 · 触发", "变化的属性", "时长", "曲线", "reduced-motion", "备注"],
  ["hover 进入 / 离开", "background-color · color · box-shadow", "120ms", "cubic-bezier(.22,1,.36,1)", "保留（颜色）", "不位移、不上浮、不放大"],
  ["active 按下", "background-color（换对）", "80ms", "同上", "保留", "无 scale；现 token press-scale .97 停用"],
  ["focus-visible", "box-shadow 焦点环", "120ms", "同上", "保留", "环在轮廓外，2px 面色间隙"],
  ["loading 进入", "转环 opacity 0 → 1，文字换为「保存中」", "120ms；转环 900ms linear 循环", "同上 / linear", "转环保留，必须有文字", "按钮宽度允许变化，不做宽度过渡"],
  ["ClipboardCopyButton 状态切换", "文字与图标替换，颜色 120ms", "120ms；2000ms 后回 idle", "同上", "保留", "不闪、不弹"],
  ["ButtonGroup 选中切换", "两枚按钮各自换对", "120ms", "同上", "保留", "没有滑动指示块（那是 SegmentedNav 的事）"],
  ["禁止", "transform · filter brightness · 阴影放大", "—", "—", "—", "G 板的上浮 1px、亮 7%、青色投影全部不用"]
], [240, 330, 180, 200, 180]);

function sampleBody() {
  const rowsHtml = [
    ["季度复盘", "PRJ-2026-0391", "设计组", "ok", "活跃", true],
    ["产品发布 · 十月", "PRJ-2026-0377", "产品组", "ok", "活跃", false],
    ["招聘 · 秋季", "PRJ-2026-0360", "人事", "warn", "待确认", false]
  ].map(([n, id, team, st, stl, sel]) => `<tr${sel ? ' class="sel"' : ""}><td><span class="who"><span class="av">${n[0]}</span><span><b>${n}</b><small>${id}</small></span></span></td><td>${team}</td><td><span class="st ${st}"><i></i>${stl}</span></td><td class="r"><span class="bar" style="justify-content:flex-end"><button type="button" class="btn quiet sm cb" data-state="${sel ? "copied" : "idle"}">${sel ? icon("check", { size: 13 }) : icon("copy", { size: 13 })}${sel ? "已复制" : "复制 ID"}</button><button type="button" class="btn quiet sm ico" aria-label="打开">${icon("arrow-right", { size: 14 })}</button></span></td></tr>`).join("");
  return `<div class="ph"><h2>项目</h2><span class="sub">12 个项目 · 3 个归档</span><span class="act"><button type="button" class="btn quiet">${icon("history", { size: 14 })}历史</button><button type="button" class="btn secondary">导出${icon("external-link", { size: 14 })}</button><button type="button" class="btn pri">${icon("plus", { size: 14 })}新建项目</button></span></div>
<div class="bar"><span class="grp" role="group" aria-label="视图"><button type="button" class="btn secondary ico sm" aria-pressed="true" aria-label="列表">${icon("menu", { size: 14 })}</button><i></i><button type="button" class="btn secondary ico sm" aria-pressed="false" aria-label="网格">${icon("layout-grid", { size: 14 })}</button></span><span class="grp" role="group" aria-label="周期"><button type="button" class="btn secondary sm" aria-pressed="false">日</button><i></i><button type="button" class="btn secondary sm" aria-pressed="true">周</button><i></i><button type="button" class="btn secondary sm" aria-pressed="false">月</button></span><span class="sp"></span><a class="btn quiet sm" href="#all">查看全部 12 个${icon("arrow-right", { size: 13 })}</a></div>
<table class="tbl"><colgroup><col style="width:300px"><col style="width:120px"><col style="width:120px"><col></colgroup>
<thead><tr><th>项目</th><th>团队</th><th>状态</th><th class="r">操作</th></tr></thead><tbody>${rowsHtml}</tbody></table>
<div class="dz" style="margin-top:auto"><div style="min-width:0"><b>删除此项目</b><small>删除后 30 天内可从回收站恢复，之后永久删除。</small></div><span class="sp"></span><button type="button" class="btn secondary">归档</button><button type="button" class="btn danger">${icon("trash", { size: 14 })}删除项目</button></div>`;
}
const nav = [
  { id: "home", icon: "home", label: "工作台" },
  { id: "projects", icon: "layout-grid", label: "项目", count: "12", on: true },
  { id: "library", icon: "book-open", label: "资料库" },
  { id: "data", icon: "database", label: "数据" },
  { group: "团队" },
  { id: "settings", icon: "settings", label: "设置" }
];
const brandHtml = `<div class="brand"><span class="mk" data-guide="rail" style="border-radius:6px;background:var(--acc);display:flex;align-items:center;justify-content:center;color:var(--on-acc);font-family:var(--serif);font-weight:500;font-size:13px">T</span><span><b data-text="rail">TCRN 设计组</b><small>团队 · 12 人</small></span></div>`;
const topbar = `<div class="cmd">${icon("search", { size: 13 })}搜索<kbd>⌘K</kbd></div><button type="button" class="btn quiet ico sm" aria-label="夜间模式">${icon("moon", { size: 16 })}</button>`;
const samples = `<div class="two">${shell({ id: "ac-l", night: false, nav, brandHtml, topbar, body: sampleBody(), crumbs: ["设计组", "项目"] })}${shell({ id: "ac-n", night: true, nav, brandHtml, topbar, body: sampleBody(), crumbs: ["设计组", "项目"] })}</div>`;

const consumer = `<div class="cols3">
<div class="box"><h4>Button <small>variant primary|secondary|quiet|danger · size sm|md|lg · disabledReason</small></h4><p class="lead">一句话：一次动作一个按钮；主按钮每屏最多一个，危险按钮只放在裁决位置，用红字不用红底。</p><ul><li><b>须提供</b>：children 文字（可带 Icon）；<code>disabled</code> 时必须给 <code>disabledReason</code>（变成 title 与 sr 文本）；<code>size</code> 的 lg 为本批新增值。</li><li><b>容器</b>：页头动作区、表单页脚、对话框页脚、工具栏；按钮自身单行，容器负责换行策略（C8）。</li><li><b>不用</b>：导航（用 NavItem / Tabs）；切换主题或语言（用壳层专用件）；表格里的行内链接（用 LinkButton quiet）。</li></ul></div>
<div class="box"><h4>IconButton <small>ariaLabel（必填）· iconName | icon · 其余同 Button</small></h4><p class="lead">一句话：只有图标的方形按钮，必须有可见名字以外的名字。</p><ul><li><b>须提供</b>：<code>ariaLabel</code>；<code>iconName</code> 取名册；可选 children 作可见标签（则不再是方形）。</li><li><b>用</b>：工具栏、表格行尾、关闭与折叠。</li><li><b>不用</b>：唯一的主动作；含义不明的图标（info、settings 之外的隐喻）。</li></ul></div>
<div class="box"><h4>LinkButton <small>href · variant primary|secondary|quiet</small></h4><p class="lead">一句话：长得像按钮的链接，用于导航到另一页；同一对表，没有 loading 与 disabled。</p><ul><li><b>须提供</b>：<code>href</code>；外链加 external-link 图标与 rel。</li><li><b>不用</b>：触发请求或提交（用 Button）；正文里的链接（用 Text 的 link 样式）。</li></ul></div>
<div class="box"><h4>ClipboardCopyButton <small>text · ariaLabel · locale · *Label 覆盖 · resetDelayMs · onCopyStateChange</small></h4><p class="lead">一句话：复制一段文本，五种状态在按钮文字里直接说出来，2 秒后回到 idle。</p><ul><li><b>须提供</b>：<code>text</code> 与 <code>ariaLabel</code>；敏感值走 React 版本（不写进 DOM）；静态页用 <code>mountStaticClipboardCopyButton</code>。</li><li><b>外形</b>：默认 secondary sm；行内可用 quiet sm；idle 带 copy 图标，copied 用 check，failed 用 alert-triangle。</li><li><b>不用</b>：作为主按钮；复制整段多行内容时不给反馈文字。</li></ul></div>
<div class="box"><h4>ButtonGroup <small>新增 · ariaLabel · size · variant secondary|quiet · children Button / IconButton</small></h4><p class="lead">一句话：把两到五个同类动作连成一条，共用轮廓与分隔；单选用子项 aria-pressed，组只管几何与可及性。</p><ul><li><b>须提供</b>：<code>ariaLabel</code>（role=group 的名字）；子项各自的 label 或 ariaLabel。</li><li><b>容器</b>：工具栏、页头；组内焦点环抬到最上层。</li><li><b>不用</b>：视图页签与导航（用 Tabs / SegmentedNav）；超过五项（用 Select 或 Menu）；混放主按钮。</li></ul></div>
<div class="box"><h4>状态对机制 · 机器可查 <small>C1 · C2</small></h4><p class="lead">一句话：变体声明七对 fill/ink（--fill-d/h/a/f/x/l/s），状态规则只写 <code>--fill:var(--fill-h)</code> 这类切换，特异性 (0,1,0) 低于变体 (0,2,0)。</p><ul><li>静态检查：任何 <code>:hover</code>、<code>:active</code>、<code>[aria-pressed]</code> 规则里不得出现颜色字面量或颜色 token。</li><li>夜间主题只改 .night 下的 token 值，变体与状态规则一字不动（C5）。</li></ul></div>
</div>`;

const diff = kvTable([
  ["Token / 契约", "现值", "G+ 值", "说明"],
  ["Button 高度 md / sm", "min-height 38 / 30", "32 / 28，新增 lg 40", "size 的 lg 为新增值"],
  ["内距", "12 / 8", "12 / 10 / 16", "sm 10，lg 16"],
  ["圆角 radius-control", "4", "8", "三档同 8"],
  ["字重", "700（strong）", "500，选中 600", "type.weight.medium 拆档"],
  ["secondary 边", "1px border-control #8e8e88（3.4）", "0 0 0 1px line-ctl rgba(22,21,15,.47)（3.14）+ 1px 投影 .04", "已定：line-ctl 替代 G+ 板的 s1 7% 轮廓；夜间 rgba(255,255,255,.36)"],
  ["primary", "brand-primary #17707f · 文字 text-inverse", "acc #0b6b65 · on-acc #fff；hover acc-2 · active acc-3", "夜间 #3fc7b7 配深字 #07211e"],
  ["danger", "红边红字（border state-blocked）", "白面红字 red #8e2d24，hover 6% 红洗，active 11%", "夜间 red #d98d82"],
  ["quiet", "透明，hover 为 muted 72% 混白", "透明 ink-2，hover 3.5% 墨洗，active 6%", "—"],
  ["disabled", "opacity .64", "fill dis 5% + ink-3，无透明度", "对比可算；豁免"],
  ["hover 机制", "color-mix 混色 + border 换色", "换对（fill/ink/edge 三者一起）", "C1"],
  ["press", "transform scale .97（motion.press-scale）", "停用，只换底", "无 transform"],
  ["focus", "outline 2px + offset 2px", "box-shadow 2px 面色 + 2px acc", "elevation-focus 已有同形 token，面色改 surface 变量"],
  ["IconButton", "38 方", "28 / 32 / 40 方", "随 size"],
  ["LinkButton", "与 Button 同规则，含 press-scale", "同 Button 对表，无 press", "—"],
  ["ClipboardCopyButton", "label 五态，继承 Button", "secondary sm 默认，copied/ failed/ unsupported 换 ink", "idle copy · copied check · failed alert-triangle"],
  ["ButtonGroup", "无", "新增：group 轮廓 line-ctl，分隔 1px，aria-pressed 单选", "—"],
  ["过渡", "instant 80 · fast 120 · standard 160（ease-out .23,1,.32,1）", "fill 120 · press 80 · move 240，曲线 .22,1,.36,1", "曲线换为 G+ 一条"]
], [240, 380, 400]);

const body = `
<header class="bh">
<div>
<p class="k">Batch one · 04 / 05 · Actions</p>
<h1>动作：四种变体、七种状态，每一格都是一对 fill 与 ink<em>，状态规则从不写颜色</em></h1>
<p>Button、IconButton、LinkButton、ClipboardCopyButton 与新增的 ButtonGroup。变体在 CSS 里声明七对 fill/ink，状态只切换生效的对，特异性低于变体，浅色与夜间同一套规则只换 token 值。没有上浮、缩放、亮度与投影放大：按下只换底色。次按钮、危险按钮与按钮组的轮廓定为 line-ctl 47% 墨（3.14:1，Owner 2026-10-11 定，替代 G+ 板的 7% 发丝线）。样板是构图一壳层的项目页：页头三枚、工具栏两个按钮组、行内复制与打开、底部危险区。</p>
</div>
<div class="meta"><b>sm 28 · md 32 · lg 40 · r 8 · 500</b>文字 ≥ 4.5 · 图标与边 ≥ 3 · 禁用豁免但列数<b>hover 120ms · press 80ms · 转环 900ms</b>cubic-bezier(.22,1,.36,1)，无 transform<b>5 件 · 4 变体 × 7 状态 × 2 主题 = 52 格文字 + 52 格图标</b>每格脚本计算并在 DOM 复核</div>
</header>

<div class="sec"><h3><b>A</b>组件与状态 <span>左浅色、右夜间；同一属性集只换值</span></h3>
<div class="two">${pane(false)}${pane(true)}</div></div>

<div class="sec"><h3><b>B</b>状态矩阵 <span>Button、IconButton、LinkButton 共用对表；ClipboardCopyButton 只换 ink；边线与环单列（轮廓 line-ctl 已定）</span></h3>${matrix}</div>

<div class="sec"><h3><b>C</b>动效规范 <span>只换色，不位移</span></h3>${motion}</div>

<div class="sec"><h3><b>D</b>组合样板 · 构图一 <span>项目页：页头 quiet / secondary / primary，工具栏两个 ButtonGroup，行内 ClipboardCopyButton 与 IconButton，底部 danger</span></h3>${samples}</div>

<div class="sec"><h3><b>E</b>消费方须提供什么 · 何时用与不用 <span>五件各一句话，外加状态对机制</span></h3>${consumer}</div>

<div class="sec"><h3><b>F</b>与 G+ 底盘的 token 差异 <span>现值取自 Navigation.tsx 的 tcrnComponentCss 与 tokens.css</span></h3>${diff}</div>
`;

write("V2-B1-Actions.dc.html", page({ title: "动作 Actions · 第一批", css, body, height }));
