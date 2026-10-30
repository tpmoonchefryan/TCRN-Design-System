import { T, cr, fmt, icon, ICON_NAMES, ICON_NEW, matrixTable, kvTable, page, write, grain, cellAttrs } from "./lib.mjs";
import { matrixCell, icons } from "./data.mjs";
import { sampleScreens, SAMPLE_CSS } from "./shell-screen.mjs";

const height = process.argv[2] ? Number(process.argv[2]) : 0;

// pin 的两态取 icons.json 的 variants：同一路径，fill 列出的子元素以 currentColor 填充，其余仍描边
const PIN = icons.icons.find((i) => i.name === "pin");
if (!PIN?.variants?.outline || !PIN?.variants?.solid) throw new Error("icons.json: pin needs the outline and solid variants");
function pinVariant(variant, size) {
  const fill = PIN.variants[variant].fill;
  let k = -1;
  return icon("pin", { size, attrs: `data-variant="${variant}"` }).replace(/<(path|circle|rect|ellipse) /g, (m) => (++k, fill.includes(k) ? `${m}fill="currentColor" ` : m));
}

const css = `
.roster{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:10px}
.ri{display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px 6px 10px;border-radius:8px;box-shadow:inset 0 0 0 1px var(--line);color:var(--ink-2);min-width:0}
.ri small{font-family:var(--mono);font-size:10px;color:var(--ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.ri{position:relative}
.ri>i{position:absolute;top:5px;right:6px;font-style:normal;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--acc);font-weight:500}
.sizes{display:flex;align-items:flex-end;gap:28px}
.sz{display:flex;flex-direction:column;gap:8px;align-items:flex-start}
.sz .r{display:flex;align-items:center;gap:12px;color:var(--ink-2)}
.sz small{font-family:var(--mono);font-size:10.5px;color:var(--ink-3)}
.chips{display:flex;gap:12px;flex-wrap:wrap}
.chip-i{display:flex;flex-direction:column;align-items:center;gap:6px}
.chip-i .b{width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center}
.chip-i small{font-size:10.5px;color:var(--ink-3);font-family:var(--mono);white-space:nowrap}
.al{display:flex;align-items:center;gap:22px;flex-wrap:wrap}
.al .x{display:inline-flex;align-items:center;gap:6px;color:var(--ink-2);white-space:nowrap}
.al .x.nav{font-size:12.5px;font-weight:500}
.al .x.btn{height:32px;padding:0 12px;border-radius:8px;background:var(--panel);box-shadow:var(--s1);color:var(--ink);font-weight:500;font-size:13px}
.al .x.cap{font-size:11px;color:var(--ink-3)}
.al .x.pri{height:32px;padding:0 12px;border-radius:8px;background:var(--acc);color:var(--on-acc);font-weight:500;font-size:13px}
.gridsvg{width:200px;height:200px}
.rules{display:grid;grid-template-columns:200px minmax(0,1fr);gap:18px;align-items:start}
.rules ul{margin:0;padding-left:16px;font-size:12px;color:var(--ink-2);line-height:1.55}
.rules li{margin:2px 0}
.rules b{color:var(--ink);font-weight:600}
.bar{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:8px;box-shadow:inset 0 0 0 1px var(--line);width:max-content}
.ib{width:28px;height:28px;border-radius:7px;border:0;background:transparent;color:var(--ink-2);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;padding:0}
.ib.on{background:var(--wash);color:var(--ink)}
.ib:hover{background:var(--hover);color:var(--ink)}
.sep{width:1px;height:16px;background:var(--line-2)}
.cmd{position:relative;display:flex;align-items:center;width:220px;height:28px;padding:0 8px 0 28px;border-radius:7px;background:var(--wash);color:var(--ink-3);font-size:12px;white-space:nowrap;overflow:hidden}
.cmd .ic{position:absolute;left:9px}
.cmd kbd{margin-left:auto;font-family:var(--mono);font-size:10px;color:var(--ink-3);border:1px solid var(--line-2);border-radius:4px;padding:0 4px}
.btn{height:30px;padding:0 12px;border:0;border-radius:8px;background:var(--panel);color:var(--ink);font:inherit;font-size:12.5px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;box-shadow:var(--s1)}
.btn.pri{background:var(--acc);color:var(--on-acc);box-shadow:none}
.btn.quiet{background:transparent;box-shadow:none;color:var(--ink-2)}
.hint{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--ink-3);white-space:nowrap}
.pg{display:inline-flex;align-items:center;gap:2px}
.pg .ib{width:26px;height:26px}
.who{display:flex;align-items:center;gap:9px;min-width:0}
.who b{font-weight:600;color:var(--ink);display:block;line-height:1.2;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.who small{display:block;font-size:10.5px;color:var(--ink-3);font-family:var(--mono);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
`;

function gridSvg(th) {
  const t = th === "n" ? T.night : T.light;
  const lines = [];
  for (let i = 0; i <= 20; i++) {
    lines.push(`<path d="M${i * 10} 0V200" stroke="${t.line2}" stroke-width="1"/>`);
    lines.push(`<path d="M0 ${i * 10}H200" stroke="${t.line2}" stroke-width="1"/>`);
  }
  return `<svg class="gridsvg" viewBox="0 0 200 200" aria-hidden="true"><rect width="200" height="200" fill="${t.panel}"/>${lines.join("")}<rect x="20" y="20" width="160" height="160" fill="none" stroke="${t.acc}" stroke-width="1" stroke-dasharray="4 3"/><g transform="scale(10)" fill="none" stroke="${t.ink}" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="9" r="5.5"/><path d="M13 13l4 4"/></g></svg>`;
}

function pane(night) {
  const t = night ? T.night : T.light;
  const th = night ? "n" : "l";
  const cell = (id) => cellAttrs("icon", `${id}-${th}`);
  const mc = (id) => matrixCell("icon", `${id}-${th}`);
  const P = t.panel, B = t.bg;
  const roster = ICON_NAMES.map((n, i) => `<div class="ri"${i === 0 ? ` ${cell("roster")}` : ""}>${ICON_NEW.includes(n) ? "<i>新增</i>" : ""}${icon(n, { size: 20 })}<small>${n}</small></div>`).join("");
  const pinStates = [["outline", "pin · outline 描边"], ["solid", "pin · solid 实心"]].map(([v, lbl]) => `<div class="ri">${pinVariant(v, 20)}<small>${lbl}</small></div>`).join("");
  const six = ["search", "settings", "check", "alert-triangle", "layers", "globe-2"];
  const sizes = [["sm", 14], ["md", 16], ["lg", 20]].map(([k, s]) => `<div class="sz"><div class="r">${six.map((n) => icon(n, { size: s })).join("")}</div><small>${k} ${s}px · 描边 1.25px</small></div>`).join("");
  const chips = [
    ["默认 ink-2", "ink2-panel"], ["次要 ink-3", "ink3-panel"], ["当前 ink 于 wash", "ink-wash"], ["主按钮 on-acc", "onacc-acc"], ["链接 acc", "acc-panel"], ["危险 red", "red-panel"], ["成功 ok", "ok-panel"], ["警告 warn", "warn-panel"], ["错误 bad", "bad-panel"], ["禁用 ink-3 于 dis", "dis"]
  ].map(([lbl, id]) => { const c = mc(id); return `<div class="chip-i"><span class="b" style="background:${c.fillValue};color:${c.inkValue}" ${cell(id)}>${icon(id === "dis" ? "settings" : id === "onacc-acc" ? "check" : id === "red-panel" ? "alert-triangle" : id === "ok-panel" ? "shield-check" : id === "warn-panel" ? "info" : id === "bad-panel" ? "x" : id === "acc-panel" ? "external-link" : "search", { size: 16 })}</span><small>${lbl}</small></div>`; }).join("");
  const onCanvas = [["默认 ink-2 于画布", "ink2-bg"], ["次要 ink-3 于画布", "ink3-bg"], ["当前 ink 于墨洗（菜单选中）", "ink-panel"]].map(([lbl, id]) => { const c = mc(id); return `<div class="chip-i"><span class="b" style="background:${c.fillValue};color:${c.inkValue};box-shadow:inset 0 0 0 1px var(--line)" ${cell(id)}>${icon("layout-grid", { size: 16 })}</span><small>${lbl}</small></div>`; }).join("");
  return `<section class="pane gp${night ? " night" : ""}" aria-label="${night ? "夜间" : "浅色"}">
${grain("ic-" + th)}
<span class="ptag">${night ? "night · 画布 #121210 · 纸 #191916" : "light · 画布 #efeeea · 纸 #ffffff"}</span>
<div class="blk"><h6>名册 tcrnIconNames · ${ICON_NAMES.length} 件 <span>${ICON_NAMES.length - ICON_NEW.length} 件现有加 ${ICON_NEW.length} 件新增（Owner 2026-10-11 定，pin 随顶带壳加入）；20 格、1.25px 描边、圆头圆角，逐个重绘</span></h6>
<div class="paper"><div class="roster">${roster}</div></div></div>

<div class="blk"><h6>pin · 描边与实心两态 <span>同一名字的两个变体，名册仍算一件：描边是默认态，实心是固定态；实心只填 pin 身（第 0 个子元素），横杠与针仍是 1.25 描边</span></h6>
<div class="paper"><div class="roster">${pinStates}</div></div></div>

<div class="blk"><h6>尺寸 sm 14 · md 16 · lg 20 <span>描边不随尺寸缩放（vector-effect: non-scaling-stroke），三档都是 1.25px</span></h6>
<div class="paper"><div class="sizes">${sizes}</div></div></div>

<div class="blk"><h6>颜色状态 · currentColor <span>图标永远继承所在文字色；fill 与 ink 跟随宿主控件成对换；点与边 ≥ 3</span></h6>
<div class="paper"><div class="chips">${chips}</div></div>
<div class="on-canvas" style="padding:14px 18px;border-radius:var(--r-panel);box-shadow:inset 0 0 0 1px var(--line)"><div class="chips">${onCanvas}</div></div></div>

<div class="blk"><h6>与文字对齐 <span>inline-flex 居中，间距 6；导航 12.5 配 16，按钮 13 配 14，说明 11 配 14</span></h6>
<div class="paper"><div class="al">
<span class="x nav">${icon("layout-grid", { size: 16 })}项目</span>
<span class="x btn">${icon("external-link", { size: 14 })}导出</span>
<span class="x pri">${icon("check", { size: 14 })}已保存</span>
<span class="x cap">${icon("info", { size: 14 })}对团队成员可见</span>
<span class="x nav">${icon("loader-circle", { size: 16, cls: "spin" })}同步中</span>
<span class="x nav" style="color:var(--ink-3)">${icon("chevron-down", { size: 14 })}展开</span>
</div></div></div>

<div class="blk"><h6>工具栏与分页 <span>图标按钮 28 方，选中用 6% 墨洗；分隔用 1px 发丝线</span></h6>
<div class="paper"><div class="row">
<div class="bar"><button class="ib on" type="button" aria-label="列表">${icon("menu", { size: 16 })}</button><button class="ib" type="button" aria-label="网格">${icon("layout-grid", { size: 16 })}</button><span class="sep"></span><button class="ib" type="button" aria-label="新建">${icon("plus", { size: 16 })}</button><button class="ib" type="button" aria-label="复制">${icon("copy", { size: 16 })}</button><button class="ib" type="button" aria-label="删除">${icon("trash", { size: 16 })}</button><button class="ib" type="button" aria-label="更多">${icon("more-horizontal", { size: 16 })}</button><span class="sep"></span><button class="ib" type="button" aria-label="通知">${icon("bell", { size: 16 })}</button><button class="ib" type="button" aria-label="夜间">${icon("moon", { size: 16 })}</button><button class="ib" type="button" aria-label="语言">${icon("globe-2", { size: 16 })}</button></div>
<span class="pg"><button class="ib" type="button" aria-label="上一页">${icon("chevron-left", { size: 16 })}</button><span class="mono" style="font-size:11.5px;color:var(--ink-2);padding:0 6px">2 / 5</span><button class="ib" type="button" aria-label="下一页">${icon("chevron-right", { size: 16 })}</button></span>
<div class="cmd">${icon("search", { size: 13 })}搜索<kbd>⌘K</kbd></div>
</div></div></div>

<div class="blk"><h6>绘制规则 <span>重绘名册时逐条对照</span></h6>
<div class="paper"><div class="rules">${gridSvg(th)}<ul>
<li><b>20 格，活动区 16</b>：四周各留 2 格，圆形与方形都顶到活动区边缘（虚线框）。</li>
<li><b>描边 1.25</b>，stroke-linecap 与 stroke-linejoin 均为 round；不用填充，不用双线。例外：pin 的固定态是实心（icons.json 的描边与实心两态，实心只填 pin 身），只此一例。</li>
<li><b>圆角</b>：矩形 rx 1.5 到 2；小于 2 格的细节一律省略。</li>
<li><b>点</b>用 .01 长的圆头线段（info、alert-triangle、palette），在 14px 下仍可见。</li>
<li><b>光学对齐</b>：箭头、chevron 以视觉重心居中，不以包围盒居中。</li>
<li><b>禁止</b>：表情符号、填充色块（pin 固定态的实心是唯一例外）、双色图标、品牌 logo 混入名册（品牌件走 Brand 家族）。</li>
</ul></div></div></div>
</section>`;
}

// ---------- matrix ----------
function rows() {
  const mk = (name, note, pick, exempt) => ({ name, note, cells: [T.light, T.night].map((t) => ({ ...pick(t), kind: "icon", exempt })) });
  return [
    { group: "在纸上 · panel" },
    mk("默认 · 导航、按钮、单元", "ink-2 于 panel", (t) => ({ fill: t.panel, ink: t.ink2, surface: t.panel, fillLabel: "panel", inkLabel: "ink-2" })),
    mk("次要 · 说明、占位", "ink-3 于 panel", (t) => ({ fill: t.panel, ink: t.ink3, surface: t.panel, fillLabel: "panel", inkLabel: "ink-3" })),
    mk("当前 · 选中项", "ink 于 wash 6%", (t) => ({ fill: t.wash, ink: t.ink, surface: t.panel, fillLabel: "wash", inkLabel: "ink" })),
    mk("悬停 · 图标按钮", "ink 于 hover 3.5%", (t) => ({ fill: t.hover, ink: t.ink, surface: t.panel, fillLabel: "hover", inkLabel: "ink" })),
    mk("主按钮内", "on-acc 于 acc", (t) => ({ fill: t.acc, ink: t.onAcc, surface: t.panel, fillLabel: "acc", inkLabel: "on-acc" })),
    mk("链接 · 外链", "acc 于 panel", (t) => ({ fill: t.panel, ink: t.acc, surface: t.panel, fillLabel: "panel", inkLabel: "acc" })),
    mk("危险", "red 于 panel", (t) => ({ fill: t.panel, ink: t.red, surface: t.panel, fillLabel: "panel", inkLabel: "red" })),
    mk("成功 · 警告 · 错误", "ok · warn · bad 于 panel（取最低 warn）", (t) => ({ fill: t.panel, ink: t.warn, surface: t.panel, fillLabel: "panel", inkLabel: "warn" })),
    mk("成功", "ok 于 panel", (t) => ({ fill: t.panel, ink: t.ok, surface: t.panel, fillLabel: "panel", inkLabel: "ok" })),
    mk("错误", "bad 于 panel", (t) => ({ fill: t.panel, ink: t.bad, surface: t.panel, fillLabel: "panel", inkLabel: "bad" })),
    mk("禁用", "ink-3 于 dis 5%（WCAG 豁免）", (t) => ({ fill: t.dis, ink: t.ink3, surface: t.panel, fillLabel: "dis", inkLabel: "ink-3" }), true),
    { group: "在画布上 · bg" },
    mk("默认 · 侧栏项", "ink-2 于 bg", (t) => ({ fill: t.bg, ink: t.ink2, surface: t.bg, fillLabel: "bg", inkLabel: "ink-2" })),
    mk("次要 · 侧栏图标", "ink-3 于 bg", (t) => ({ fill: t.bg, ink: t.ink3, surface: t.bg, fillLabel: "bg", inkLabel: "ink-3" })),
    mk("当前 · 侧栏选中（纸色）", "ink 于 panel", (t) => ({ fill: t.panel, ink: t.ink, surface: t.bg, fillLabel: "panel", inkLabel: "ink" })),
    mk("悬停 · 侧栏", "ink 于 hover", (t) => ({ fill: t.hover, ink: t.ink, surface: t.bg, fillLabel: "hover", inkLabel: "ink" })),
    mk("搜索框内", "ink-3 于 wash", (t) => ({ fill: t.wash, ink: t.ink3, surface: t.bg, fillLabel: "wash", inkLabel: "ink-3" })),
    mk("状态点 ok · warn · bad", "6px 点于 bg（取最低 warn）", (t) => ({ fill: t.bg, ink: t.warn, surface: t.bg, fillLabel: "bg", inkLabel: "warn" }))
  ];
}
const matrix = matrixTable({ caption: "图标状态矩阵", cols: ["浅色", "夜间"], rows: rows() });

const motion = kvTable([
  ["元素 · 触发", "变化的属性", "时长", "曲线", "reduced-motion", "备注"],
  ["图标随宿主换色（hover · active · selected）", "color", "120ms", "cubic-bezier(.22,1,.36,1)", "保留", "图标不单独定义过渡，跟宿主控件"],
  ["loader-circle 加载", "transform rotate 360°", "900ms 循环", "linear", "保留，旁边必须有文字（同步中…）", "现 token motion.loading.loop 沿用"],
  ["chevron 展开 / 收起", "transform rotate 0 → 180°", "240ms", "cubic-bezier(.22,1,.36,1)", "改为瞬时换向", "不过冲"],
  ["sun ↔ moon · panel-left-close ↔ open 切换", "opacity 交叉", "240ms", "同上", "保留 opacity", "两枚图标叠放，不做旋转或位移"],
  ["图标进入（随列表项）", "opacity", "240ms，交错 20ms", "同上", "保留 opacity", "由容器编排，图标本身无动画"],
  ["禁止", "缩放、弹跳、描边动画、颜色闪烁", "—", "—", "—", "图标是文字的一部分，不是动画对象"]
], [300, 240, 110, 220, 230]);

// ---------- composition sample: the top-band shell, the same screen() as the Shell boards (shell-screen.mjs) ----------
function sampleBody() {
  const rowsHtml = [
    ["季度复盘", "PRJ-2026-0391", "设计组", "ok", "活跃", "2 分钟前", true],
    ["产品发布 · 十月", "PRJ-2026-0377", "产品组", "ok", "活跃", "09:41", false],
    ["招聘 · 秋季", "PRJ-2026-0360", "人事", "warn", "待确认", "昨天", false],
    ["资料库迁移", "PRJ-2026-0352", "设计组", "bad", "已停用", "08-23", false]
  ].map(([n, id, team, st, stl, when, sel]) => `<tr${sel ? ' class="sel"' : ""}><td><span class="who"><span class="av">${n[0]}</span><span><b>${n}</b><small>${id}</small></span></span></td><td>${team}</td><td><span class="st ${st}"><i></i>${stl}</span></td><td class="r mono">${when}</td><td class="r"><button class="ib" type="button" aria-label="更多">${icon("more-horizontal", { size: 16 })}</button><button class="ib" type="button" aria-label="打开">${icon("arrow-right", { size: 16 })}</button></td></tr>`).join("");
  return `<div class="ph"><h2>项目</h2><span class="sub">12 个项目 · 3 个归档</span><span class="act"><button class="btn quiet" type="button">${icon("history", { size: 14 })}历史</button><button class="btn" type="button">${icon("external-link", { size: 14 })}导出</button><button class="btn pri" type="button">${icon("plus", { size: 14 })}新建项目</button></span></div>
<div class="row" style="gap:10px"><div class="bar"><button class="ib on" type="button" aria-label="列表">${icon("menu", { size: 16 })}</button><button class="ib" type="button" aria-label="网格">${icon("layout-grid", { size: 16 })}</button></div><span class="hint">${icon("info", { size: 14 })}归档项目不计席位</span><span class="sp"></span><span class="pg"><button class="ib" type="button" aria-label="上一页">${icon("chevron-left", { size: 16 })}</button><span class="mono" style="font-size:11.5px;color:var(--ink-2);padding:0 6px">1 / 3</span><button class="ib" type="button" aria-label="下一页">${icon("chevron-right", { size: 16 })}</button></span></div>
<table class="tbl"><colgroup><col style="width:300px"><col style="width:120px"><col style="width:120px"><col><col style="width:90px"></colgroup>
<thead><tr><th>项目</th><th>团队</th><th>状态</th><th class="r">最近活跃</th><th></th></tr></thead><tbody>${rowsHtml}</tbody></table>
<div class="tfoot"><span>1 到 4 · 共 12</span></div>`;
}
const samples = sampleScreens({ id: "ic", crumbs: ["运营", "项目"], body: () => sampleBody() });

const consumer = `<div class="cols3">
<div class="box"><h4>Icon <small>name · size sm|md|lg|number · decorative · title</small></h4><p class="lead">一句话：按名册名字取一枚 20 格 1.25px 描边的线性图标，颜色继承文字色，默认装饰性（aria-hidden）。</p><ul><li><b>须提供</b>：<code>name</code>（tcrnIconNames 之一）；独立表意时给 <code>title</code> 或 <code>aria-label</code>，组件自动改为 role="img"。</li><li><b>尺寸</b>：sm 14、md 16、lg 20 或数字；描边恒 1.25px，不随尺寸变。<code>strokeWidth</code> 覆盖建议移除（现包允许），否则名册规则失效。</li><li><b>容器</b>：由按钮、导航项、输入框、说明文字提供对齐（inline-flex 居中）。</li><li><b>用</b>：导航、按钮、工具栏、状态提示、空状态标题前。</li><li><b>不用</b>：当状态色块（状态用 6px 点加文字）；当品牌标；当插画。</li></ul></div>
<div class="box"><h4>tcrnIconNames <small>${ICON_NAMES.length} 件 · 名册即契约</small></h4><p class="lead">一句话：名册是封闭集合，<code>IconName</code> 类型由它派生；本批把 9 个常用名字加进名册，之后再加仍是包的契约改动。</p><ul><li><b>现有 ${ICON_NAMES.length - ICON_NEW.length}</b>：alert-triangle、arrow-left/right、book-open、check、chevron-down/left/right、database、external-link、globe-2、history、home、info、layers、layout-grid、loader-circle、menu、moon、package、palette、panel-left-close/open、search、settings、shield-check、sun、x。</li><li><b>新增 ${ICON_NEW.length}</b>：${ICON_NEW.join("、")}。</li><li><b>来源变化</b>：现包从 lucide-react 取 24 格 2px 图标；本批改为自绘 20 格 1.25px，不再依赖 lucide（见 token 差异）。</li></ul></div>
<div class="box"><h4>新增 9 件的用处 <small>已定 · 本批各板已按此作画</small></h4><p class="lead">一句话：每个新名字都有一个明确的位置，不为凑数。</p><ul><li><b>plus · minus</b>：新建按钮（Actions 板主按钮）、数字加减、折叠展开。</li><li><b>users · bell</b>：成员导航（Inputs 板侧栏）、顶栏通知按钮。</li><li><b>copy · trash</b>：ClipboardCopyButton 的 idle 态、删除动作。</li><li><b>calendar</b>：DatePicker 右侧指示（Inputs 板）。</li><li><b>more-horizontal · chevron-up</b>：行内更多、折叠。</li></ul></div>
</div>`;

const diff = kvTable([
  ["Token / 契约", "现值", "G+ 值", "说明"],
  ["图标来源", "lucide-react（24 格，描边 2）", "自绘名册 20 格，描边 1.25px", `包不再依赖 lucide；${ICON_NAMES.length} 件逐个绘制`],
  ["size sm / md / lg", "14 / 16 / 20", "14 / 16 / 20", "不变"],
  ["描边", "strokeWidth 2（16px 下约 1.33px）", "1.25px 恒定（non-scaling-stroke）", "三档同一粗细；prop 覆盖建议移除"],
  ["线头 / 拐角", "round / round", "round / round", "不变"],
  ["颜色", "currentColor", "currentColor", "不变；状态随宿主的 fill-ink 对"],
  ["默认可及性", "decorative=true → aria-hidden", "不变", "有 title / aria-label 时 role=img"],
  ["--tcrn-icon 基类位置", "docs 层（待裁定）", "进包", "style-scale.md 记为待 Owner 裁定，本批建议进包"],
  ["加载循环", "motion.loading.loop 900ms linear", "不变", "loader-circle 用它"],
  ["图标按钮尺寸", "38 方（IconButton）", "sm 28 · md 32 · lg 40", "随 Actions 家族"]
], [240, 360, 360]);

const body = `
<header class="bh">
<div>
<p class="k">Batch one · 02 / 05 · Icon</p>
<h1>图标：名册 ${ICON_NAMES.length} 件，20 格 1.25px 描边<em>，颜色永远继承文字</em></h1>
<p>Icon 组件与 tcrnIconNames 名册按 G+ 的「更细的图标」重绘：20 格、活动区 16、描边 1.25px 且不随尺寸缩放、圆头圆角。名册从 ${ICON_NAMES.length - ICON_NEW.length} 件扩到 ${ICON_NAMES.length} 件（plus、minus、users、bell、copy、trash、calendar、more-horizontal、chevron-up，Owner 2026-10-11 定；pin 随顶带壳加入）。图标没有自己的状态，只跟随宿主控件的 fill 与 ink 对；矩阵里列的是图标会落到的每一种底色。样板是顶带壳里的项目列表页，只用名册里的名字。</p>
</div>
<div class="meta"><b>名册 ${ICON_NAMES.length} 件 · 三档 14 / 16 / 20 · 描边恒 1.25px</b>${ICON_NAMES.length - ICON_NEW.length} 件现有 + ${ICON_NEW.length} 件新增，名册仍是封闭集合<b>图标与点 ≥ 3 · 文字 ≥ 4.5</b>每格由脚本算出，夜间只换值<b>加载循环 900ms linear，其余 120 / 240ms</b>不缩放、不弹跳、不描边动画</div>
</header>

<div class="sec"><h3><b>A</b>名册与状态 <span>左浅色、右夜间；同一属性集只换值</span></h3>
<div class="two">${pane(false)}${pane(true)}</div></div>

<div class="sec"><h3><b>B</b>状态矩阵 <span>图标落到的每种底色；边线与点按 3 判，禁用豁免但仍列数</span></h3>${matrix}</div>

<div class="sec"><h3><b>C</b>动效规范 <span>图标不是动画对象；只有加载环转动与跟随宿主的换色</span></h3>${motion}</div>

<div class="sec"><h3><b>D</b>组合样板 · 顶带壳 <span>项目列表：顶带的展开示意、固定项下拉箭头与通知，页头按钮、工具栏与分页、行尾更多与打开；左浅色、右夜间，壳几何同壳层板顶带态</span></h3>${samples}</div>

<div class="sec"><h3><b>E</b>消费方须提供什么 · 何时用与不用 <span>Icon、名册、名册缺口</span></h3>${consumer}</div>

<div class="sec"><h3><b>F</b>与 G+ 底盘的 token 差异 <span>现值取自 packages/ui-react/src/components/Icon/Icon.tsx 与 tokens.css</span></h3>${diff}</div>
`;

write("V2-B1-Icon.dc.html", page({ title: "图标 Icon · 第一批", css: css + SAMPLE_CSS, body, height }));
