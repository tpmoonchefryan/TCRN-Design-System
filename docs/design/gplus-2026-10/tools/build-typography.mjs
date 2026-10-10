import { T, cr, fmt, icon, shell, matrixTable, kvTable, page, write, grain } from "./lib.mjs";

const height = process.argv[2] ? Number(process.argv[2]) : 0;

const css = `
.h1,.h2,.h3{margin:0;font-family:var(--serif);font-weight:400;color:var(--ink);letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.h1{font-size:36px;line-height:40px}
.h2{font-size:26px;line-height:30px;letter-spacing:-.005em}
.h3{font-size:20px;line-height:26px;letter-spacing:0}
.h4{margin:0;font-family:var(--sans);font-size:13px;line-height:20px;font-weight:600;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tx{margin:0;font-size:13px;line-height:20px;color:var(--ink-2)}
.tx.strong{color:var(--ink);font-weight:600}
.tx.read{font-size:14px;line-height:22px}
.tx.meta{font-size:12px;line-height:16px;color:var(--ink-3)}
.tx.cap{font-size:11px;line-height:16px;color:var(--ink-3)}
.num{margin:0;font-family:var(--serif);font-weight:300;font-size:26px;line-height:30px;letter-spacing:-.01em;color:var(--ink);font-variant-numeric:tabular-nums lining-nums;display:inline-flex;align-items:baseline;gap:5px;white-space:nowrap}
.num small{font-family:var(--sans);font-size:11px;line-height:16px;letter-spacing:.06em;color:var(--ink-3);font-weight:500}
.num.inl{font-size:16px;line-height:20px;font-weight:400;letter-spacing:0}
.num.big{font-size:44px;line-height:48px}
.caps{margin:0;font-family:var(--sans);font-size:11px;line-height:16px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3);font-weight:500;white-space:nowrap}
.caps b{font-family:var(--mono);color:var(--ink);font-weight:500;margin-right:8px;letter-spacing:.04em}
.secrule{display:flex;align-items:center;gap:12px;min-width:0}
.secrule i{flex:1;height:1px;background:var(--rule)}
.id{font-family:var(--mono);font-size:11.5px;line-height:16px;color:var(--ink-2)}
.lnk{color:var(--acc);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:2px;text-decoration-color:var(--acc-ul);border-radius:2px}
.lnk:hover,.lnk.is-hover{color:var(--acc-2);text-decoration-color:var(--acc-2)}
.lnk:focus-visible,.lnk.is-focus{outline:none;box-shadow:var(--focus)}
mark.hl{background:var(--acc-bg);color:inherit;font:inherit;letter-spacing:inherit;padding:0;margin:0;border-radius:2px;box-shadow:0 0 0 2px var(--acc-bg);box-decoration-break:clone;-webkit-box-decoration-break:clone}
.spec{display:grid;grid-template-columns:150px minmax(0,1fr);column-gap:16px;row-gap:12px;align-items:baseline}
.spec>small{font-family:var(--mono);font-size:10.5px;color:var(--ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.on-canvas{padding:14px 18px;border-radius:var(--r-panel);box-shadow:inset 0 0 0 1px var(--line);display:flex;flex-direction:column;gap:10px}
.stats{display:flex;align-items:stretch;border-bottom:1px solid var(--line)}
.stat{flex:1;display:flex;flex-direction:column;gap:2px;padding:4px 18px 12px 0;border-right:1px solid var(--line);margin-right:18px;min-width:0}
.stat:last-child{border-right:0;margin-right:0}
.stat .d{font-size:11.5px;color:var(--ink-2);display:flex;align-items:center;gap:6px;white-space:nowrap}
.stat .d i{width:5px;height:5px;border-radius:50%;background:currentColor}
.stat .d.ok{color:var(--ok)}.stat .d.warn{color:var(--warn)}
.sel-row{display:flex;align-items:center;height:36px;padding:0 10px;margin:0 -10px;border-radius:6px;background:var(--wash);color:var(--ink);font-weight:600;font-size:13px;white-space:nowrap}
.list{display:flex;flex-direction:column}
.list .li{display:grid;grid-template-columns:minmax(0,1fr) 150px 110px;align-items:center;height:36px;border-bottom:1px solid var(--line);font-size:12.5px;color:var(--ink-2);white-space:nowrap;column-gap:12px}
.list .li>*{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.list .li b{color:var(--ink);font-weight:600}
.list .li:last-child{border-bottom:0}
.list .li.b2{border-bottom:1px solid var(--line)}
.lic{display:grid;grid-template-columns:160px minmax(0,1fr);column-gap:14px;row-gap:4px;font-size:12px;line-height:1.5;align-items:baseline}
.lic dt{color:var(--ink-3)}.lic dd{margin:0;color:var(--ink-2)}.lic b{color:var(--ink);font-weight:600}
.mixed{display:flex;flex-direction:column;gap:6px}
`;

const Q = "设计";
const hl = (s) => s.replace(new RegExp(Q, "g"), `<mark class="hl">${Q}</mark>`);

function pane(night) {
  const t = night ? T.night : T.light;
  const th = night ? "n" : "l";
  const cell = (id, ink, fill, surface, kind = "text") => `data-cell="${id}-${th}" data-kind="${kind}" data-expect="${fmt(cr(ink, fill, surface))}"`;
  const P = t.panel, B = t.bg;
  return `<section class="pane gp${night ? " night" : ""}" aria-label="${night ? "夜间" : "浅色"}">
${grain("ty-" + th)}
<span class="ptag">${night ? "night · 画布 #121210 · 纸 #191916" : "light · 画布 #efeeea · 纸 #ffffff"}</span>
<div class="blk"><h6>Heading · 四级 <span>level 决定标签，visualLevel 决定外观；1 至 3 级衬线 400，4 级怪诞体 600</span></h6>
<div class="paper"><div class="spec">
<small>h1 · serif 36/40 · -.01em</small><h1 class="h1" ${cell("h1", t.ink, P, P)}>季度复盘与产品发布 Q3 Review</h1>
<small>h2 · serif 26/30</small><h2 class="h2" ${cell("h2", t.ink, P, P)}>成员与权限 Members</h2>
<small>h3 · serif 20/26</small><h3 class="h3" ${cell("h3", t.ink, P, P)}>本月账单 October invoice</h3>
<small>h4 · sans 13/20 · 600</small><h4 class="h4" ${cell("h4", t.ink, P, P)}>通知偏好 Notification preferences</h4>
</div></div></div>

<div class="blk"><h6>Text · 五种 <span>正文 13/20 默认次墨；强调加字重不换色；元数据与说明用三级墨；阅读体 14/22</span></h6>
<div class="paper"><div class="spec">
<small>body · 13/20 · ink-2</small><p class="tx" ${cell("body", t.ink2, P, P)}>项目「季度复盘」已有 12 位成员，3 人待邀请。邀请邮件会在 7 天内送达，之后链接失效。</p>
<small>strong · 13/20 · 600 ink</small><p class="tx strong" ${cell("strong", t.ink, P, P)}>删除后 30 天内可从回收站恢复，之后永久删除。</p>
<small>reading · 14/22 · ink-2</small><p class="tx read" ${cell("read", t.ink2, P, P)}>账单按席位计费，每月 1 日生成；年付在当期账单中一次扣除，并在下一期显示抵扣。</p>
<small>meta · 12/16 · ink-3</small><p class="tx meta" ${cell("meta", t.ink3, P, P)}>最近活跃 2 分钟前 · 由 林晓 创建于 2026-09-14</p>
<small>caption · 11/16 · ink-3</small><p class="tx cap" ${cell("cap", t.ink3, P, P)}>对团队成员可见；更改后立即生效</p>
<small>link · acc · 下划线 70%</small><p class="tx">查看 <a class="lnk" href="#a" ${cell("link", t.acc, P, P)}>全部账单</a> 或 <a class="lnk is-hover" href="#b" ${cell("link-hover", t.acc2, P, P)}>悬停态</a> 与 <a class="lnk is-focus" href="#c">焦点态</a></p>
</div></div>
<div class="on-canvas"><div class="spec">
<small>同四种 · 落在画布上</small><p class="tx" ${cell("body-canvas", t.ink2, B, B)}>正文落在画布色上：侧栏、页脚与空状态说明会用到。</p>
<small></small><p class="tx strong" ${cell("strong-canvas", t.ink, B, B)}>强调仍是同一墨色。</p>
<small></small><p class="tx meta" ${cell("meta-canvas", t.ink3, B, B)}>元数据 · 2 分钟前</p>
<small></small><p class="tx">链接 <a class="lnk" href="#d" ${cell("link-canvas", t.acc, B, B)}>查看项目</a></p>
</div></div></div>

<div class="blk"><h6>Highlight · 搜索命中 <span>mark 只加 8% 青洗底：不改字重、字距、字号，不加内距；2px 晕用 box-shadow 画在行内盒之外，排版零变化；在正文、列表与选中行里同一规则</span></h6>
<div class="paper">
<p class="tx">在「<mark class="hl" ${cell("mark", t.ink2, t.accBg, P)}>设计</mark>组」里搜索「设计」：命中两处，其余文字不变。</p>
<div class="list" data-rows>
<div class="li"><b>${hl("TCRN 设计系统 · 组件库")}</b><span class="id">PRJ-2026-0412</span><span>${hl("设计组")}</span></div>
<div class="li b2"><b>${hl("季度复盘 · 设计评审")}</b><span class="id">PRJ-2026-0391</span><span>产品组</span></div>
<div class="sel-row" ${cell("sel", t.ink, t.wash, P)}>选中行里的命中：${hl("设计评审")}<span style="margin-left:auto" class="id">PRJ-2026-0391</span></div>
</div>
<p class="tx meta">选中行的墨洗向左右各出血 10px（margin 0 -10px），文字起点与同容器各行相同；所有列表与表格的选中态都按这条规则。</p>
<span class="sr">${hl("设计")}</span>
</div></div>

<div class="blk"><h6>衬线数字 numeral · 新样式 <span>Source Serif 4 300，等宽数字；单位缩小、拉开字距、三级墨；行内 16/20 用 400</span></h6>
<div class="paper">
<div class="stats">
<div class="stat"><span class="caps">活跃成员</span><span class="num" ${cell("num", t.ink, P, P)}>128<small ${cell("unit", t.ink3, P, P)}>人</small></span><span class="d ok"><i></i>较上月 +12%</span></div>
<div class="stat"><span class="caps">本月账单</span><span class="num">4,280<small>.00 元</small></span><span class="d"><i></i>与上月持平</span></div>
<div class="stat"><span class="caps">待处理</span><span class="num">7</span><span class="d warn"><i></i>3 项逾期</span></div>
<div class="stat"><span class="caps">席位用量</span><span class="num">86<small>/ 120</small></span><span class="d"><i></i>剩余 34 席</span></div>
</div>
<div class="spec" style="margin-top:4px">
<small>inline · 16/20 · 400</small><p class="tx">本期应付 <span class="num inl" ${cell("num-inl", t.ink, P, P)}>4,280.00<small>元</small></span>，含税 <span class="num inl">232.45<small>元</small></span>；到期日 <span class="id">2026-10-31</span>。</p>
<small>big · 44/48 · 300</small><span class="num big">12,480<small>.00 元</small></span>
</div>
</div></div>

<div class="blk"><h6>小型大写标签 caps · 新样式 <span>11/16 · 500 · 字距 .14em · 三级墨；用于区段编号、表头、指标标签；中文不转大写但同字距</span></h6>
<div class="paper">
<div class="secrule"><span class="caps" ${cell("caps", t.ink3, P, P)}><b>01</b>基本信息 Basic info</span><i></i></div>
<div class="secrule"><span class="caps"><b>02</b>成员与权限 Members</span><i></i></div>
<div class="spec">
<small>table header</small><div class="list"><div class="li" style="height:30px;color:var(--ink-3);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;font-weight:500"><span>项目 Project</span><span>编号 ID</span><span>团队 Team</span></div></div>
<small>stat label</small><span class="caps">本月账单 Invoice</span>
</div>
</div></div>

<div class="blk"><h6>等宽编号 mono <span>IBM Plex Mono 11.5/16 · 次墨；编号、邮箱、时间戳、快捷键；永不用于正文</span></h6>
<div class="paper"><div class="spec">
<small>id · 11.5/16</small><span class="id" ${cell("id", t.ink2, P, P)}>PRJ-2026-0412 · INV-2026-10-0031</span>
<small>email · time</small><span class="id">lin.xiao@tcrn.app · 2026-10-11 09:41:07 +08:00</span>
<small>kbd</small><span class="id">⌘K · ⇧⌘P · Esc</span>
</div></div></div>

<div class="blk"><h6>中英混排 <span>衬线标题回退 Noto Serif SC 400，正文回退 Noto Sans SC；数字与拉丁永远用主字体</span></h6>
<div class="paper"><div class="mixed">
<h2 class="h2">2026 年第三季度 · Q3 复盘 Review</h2>
<p class="tx read">本季度新增 <span class="num inl">24</span> 位成员，<span class="num inl">3</span> 个项目归档；「账单」页改为按席位计费（per-seat billing）。</p>
<p class="tx meta">更新于 2026-10-09 · Updated Oct 9, 2026</p>
</div></div></div>
</section>`;
}

// ---------- matrix ----------
function rows() {
  const mk = (name, note, pick) => ({ name, note, cells: [T.light, T.night].map((t) => pick(t)) });
  const sf = (t, s) => (s === "paper" ? t.panel : t.bg);
  const styles = [
    ["heading 1–4", "ink 于纸 / 画布", (t, s) => ({ fill: sf(t, s), ink: t.ink, surface: sf(t, s), kind: "text", fillLabel: s === "paper" ? "panel" : "bg", inkLabel: "ink" })],
    ["body · reading", "ink-2", (t, s) => ({ fill: sf(t, s), ink: t.ink2, surface: sf(t, s), kind: "text", fillLabel: s === "paper" ? "panel" : "bg", inkLabel: "ink-2" })],
    ["strong", "ink · 600", (t, s) => ({ fill: sf(t, s), ink: t.ink, surface: sf(t, s), kind: "text", fillLabel: s === "paper" ? "panel" : "bg", inkLabel: "ink" })],
    ["meta · caption · caps · unit", "ink-3", (t, s) => ({ fill: sf(t, s), ink: t.ink3, surface: sf(t, s), kind: "text", fillLabel: s === "paper" ? "panel" : "bg", inkLabel: "ink-3" })],
    ["numeral", "ink · serif 300", (t, s) => ({ fill: sf(t, s), ink: t.ink, surface: sf(t, s), kind: "text", fillLabel: s === "paper" ? "panel" : "bg", inkLabel: "ink" })],
    ["mono id", "ink-2", (t, s) => ({ fill: sf(t, s), ink: t.ink2, surface: sf(t, s), kind: "text", fillLabel: s === "paper" ? "panel" : "bg", inkLabel: "ink-2" })],
    ["link · default", "acc · 下划线 acc 70%", (t, s) => ({ fill: sf(t, s), ink: t.acc, surface: sf(t, s), kind: "text", fillLabel: s === "paper" ? "panel" : "bg", inkLabel: "acc" })],
    ["link · hover", "acc-2 · 下划线 100%", (t, s) => ({ fill: sf(t, s), ink: t.acc2, surface: sf(t, s), kind: "text", fillLabel: s === "paper" ? "panel" : "bg", inkLabel: "acc-2" })],
    ["link · focus", "同 default + 焦点环 4px acc", (t, s) => ({ fill: sf(t, s), ink: t.acc, surface: sf(t, s), kind: "text", fillLabel: s === "paper" ? "panel" : "bg", inkLabel: "acc" })],
    ["link underline · 70%", "边线类 ≥ 3", (t, s) => ({ fill: sf(t, s), ink: t.accUl, surface: sf(t, s), kind: "edge", fillLabel: s === "paper" ? "panel" : "bg", inkLabel: "acc-ul .7" })],
    ["highlight mark · 正文里", "继承字色 ink-2 于 acc-bg 8%（取最低）", (t, s) => ({ fill: t.accBg, ink: t.ink2, surface: sf(t, s), kind: "text", fillLabel: "acc-bg", inkLabel: "ink-2" })],
    ["highlight mark · 强调或标题里", "继承字色 ink 于 acc-bg 8%", (t, s) => ({ fill: t.accBg, ink: t.ink, surface: sf(t, s), kind: "text", fillLabel: "acc-bg", inkLabel: "ink" })],
    ["highlight in selected row", "ink 于 acc-bg 于 wash", (t, s) => ({ fill: t.accBg, ink: t.ink, surface: s === "paper" ? "__wash" : sf(t, s), kind: "text", fillLabel: "acc-bg", inkLabel: "ink" })],
    ["selected row text", "ink 于 wash 6%", (t, s) => ({ fill: t.wash, ink: t.ink, surface: sf(t, s), kind: "text", fillLabel: "wash", inkLabel: "ink" })],
    ["section rule", "rule 1px 于纸", (t, s) => ({ fill: sf(t, s), ink: t.rule, surface: sf(t, s), kind: "edge", fillLabel: s === "paper" ? "panel" : "bg", inkLabel: "rule" })],
    ["status dot ok / warn", "ok · warn 6px 点", (t, s) => ({ fill: sf(t, s), ink: t.warn, surface: sf(t, s), kind: "icon", fillLabel: s === "paper" ? "panel" : "bg", inkLabel: "warn" })]
  ];
  const out = [];
  for (const s of ["paper", "canvas"]) {
    out.push({ group: s === "paper" ? "在纸上 · panel" : "在画布上 · bg" });
    for (const [name, note, pick] of styles) {
      out.push(mk(name, note, (t) => {
        const c = pick(t, s);
        if (c.surface === "__wash") {
          // wash over panel as the surface
          const { over, parseColor, hex } = lib;
          c.surface = hex(over(parseColor(t.wash), parseColor(t.panel)));
        }
        return c;
      }));
    }
  }
  return out;
}
import * as lib from "./lib.mjs";

const matrix = matrixTable({ caption: "字体状态矩阵", cols: ["浅色", "夜间"], rows: rows() });

// ---------- motion ----------
const motion = kvTable([
  ["元素 · 触发", "变化的属性", "时长", "曲线", "reduced-motion", "备注"],
  ["link · hover", "color · text-decoration-color", "120ms", "cubic-bezier(.22,1,.36,1)", "保留（颜色是理解线索）", "只换色，不位移、不加粗"],
  ["link · focus-visible", "box-shadow 焦点环", "120ms", "同上", "保留", "环 2px 面色 + 2px 青"],
  ["highlight mark", "无", "0", "—", "—", "命中即出现，不闪、不渐入"],
  ["numeral 数值变化", "无（禁止滚动计数）", "0", "—", "—", "新值直接替换；加载态用骨架，不用数字跳动"],
  ["heading · text 出现", "opacity（随所在面板）", "240ms", "cubic-bezier(.22,1,.36,1)", "保留 opacity，去位移", "交错 20ms 由容器控制，字体本身不动"],
  ["字体加载", "font-display swap", "—", "—", "—", "回退字体同度量级（Noto Sans SC / Noto Serif SC），避免换字跳动"]
], [200, 260, 90, 220, 220]);

// ---------- composition sample ----------
function sampleBody() {
  return `<div class="ph"><h2 class="h2" style="font-size:26px;line-height:1.1">账单</h2><span class="sub">2026 年 10 月 · 按席位计费</span><span class="act"><span class="caps" style="color:var(--ink-3)">INV-2026-10-0031</span></span></div>
<div class="stats">
<div class="stat"><span class="caps">本期应付</span><span class="num">4,280<small>.00 元</small></span><span class="d"><i></i>到期 10-31</span></div>
<div class="stat"><span class="caps">席位</span><span class="num">86<small>/ 120</small></span><span class="d ok"><i></i>剩余 34 席</span></div>
<div class="stat"><span class="caps">上期</span><span class="num">4,280<small>.00 元</small></span><span class="d"><i></i>已付 09-30</span></div>
<div class="stat"><span class="caps">待处理</span><span class="num">2</span><span class="d warn"><i></i>1 张逾期</span></div>
</div>
<div class="secrule"><span class="caps"><b>01</b>账单明细</span><i></i></div>
<table class="tbl">
<colgroup><col style="width:330px"><col style="width:150px"><col style="width:120px"><col><col style="width:120px"></colgroup>
<thead><tr><th>项目</th><th>编号</th><th>席位</th><th>状态</th><th class="r">金额</th></tr></thead>
<tbody>
<tr><td><b style="color:var(--ink);font-weight:600">${hl("TCRN 设计系统 · 组件库")}</b></td><td class="mono">PRJ-2026-0412</td><td>24</td><td><span class="st ok"><i></i>已结算</span></td><td class="r"><span class="num inl" style="font-size:14px">1,200<small>.00</small></span></td></tr>
<tr class="sel"><td><b style="color:var(--ink);font-weight:600">${hl("季度复盘 · 设计评审")}</b></td><td class="mono">PRJ-2026-0391</td><td>12</td><td><span class="st warn"><i></i>待确认</span></td><td class="r"><span class="num inl" style="font-size:14px">600<small>.00</small></span></td></tr>
<tr><td><b style="color:var(--ink);font-weight:600">产品发布 · 十月</b></td><td class="mono">PRJ-2026-0377</td><td>30</td><td><span class="st ok"><i></i>已结算</span></td><td class="r"><span class="num inl" style="font-size:14px">1,500<small>.00</small></span></td></tr>
<tr><td><b style="color:var(--ink);font-weight:600">招聘 · 秋季</b></td><td class="mono">PRJ-2026-0360</td><td>20</td><td><span class="st bad"><i></i>逾期</span></td><td class="r"><span class="num inl" style="font-size:14px">980<small>.00</small></span></td></tr>
</tbody></table>
<p class="tx meta">按席位计费，每月 1 日生成；年付在当期账单中一次扣除。查看 <a class="lnk" href="#h">计费说明</a> 或 <a class="lnk" href="#i">下载发票</a>。</p>`;
}
const nav = [
  { id: "home", icon: "home", label: "工作台" },
  { id: "projects", icon: "layout-grid", label: "项目", count: "12" },
  { id: "library", icon: "book-open", label: "资料库" },
  { id: "billing", icon: "database", label: "账单", on: true },
  { group: "团队" },
  { id: "settings", icon: "settings", label: "设置" }
];
const brandHtml = `<div class="brand"><span class="mk" data-guide="rail" style="border-radius:6px;background:var(--acc);display:flex;align-items:center;justify-content:center;color:var(--on-acc);font-family:var(--serif);font-weight:500;font-size:13px">T</span><span><b data-text="rail">TCRN 设计组</b><small>团队 · 12 人</small></span></div>`;
const topbar = `<div class="cmd" style="position:relative;display:flex;align-items:center;width:220px;height:28px;padding:0 8px 0 28px;border-radius:7px;background:var(--wash);color:var(--ink-3);font-size:12px;white-space:nowrap;overflow:hidden">${icon("search", { size: 13, attrs: 'style="position:absolute;left:9px"' })}搜索<kbd style="margin-left:auto;font-family:var(--mono);font-size:10px;color:var(--ink-3);border:1px solid var(--line-2);border-radius:4px;padding:0 4px">⌘K</kbd></div>`;
const samples = `<div class="two">${shell({ id: "ty-l", night: false, nav, brandHtml, topbar, body: sampleBody(), crumbs: ["设计组", "账单"] })}${shell({ id: "ty-n", night: true, nav, brandHtml, topbar, body: sampleBody(), crumbs: ["设计组", "账单"] })}</div>`;

// ---------- consumer + diff ----------
const consumer = `<div class="cols3">
<div class="box"><h4>Heading <small>level 1–4 · visualLevel 1–4</small></h4><p class="lead">一句话：标签级别由 <code>level</code> 定，外观由 <code>visualLevel</code> 定，1 至 3 级衬线 400、4 级怪诞体 600，一律单行截断。</p><ul><li><b>须提供</b>：文本 children；<code>level</code>（默认 2）；需要和文档结构不同的外观时给 <code>visualLevel</code>。</li><li><b>容器</b>：由页头、区段、卡片提供宽度；标题自己不折行，装不下截断加 title（C7）。</li><li><b>用</b>：页标题 h1/2、区段 h3、卡片与设置行 h4。</li><li><b>不用</b>：表头与指标标签（用 caps 样式）；按钮与导航项文字。</li></ul></div>
<div class="box"><h4>Text <small>size body | reading | meta | caption · tone default | strong · variant numeral | caps</small></h4><p class="lead">一句话：段落文本，13/20 次墨为默认；强调只加字重不换色，说明文字用三级墨。</p><ul><li><b>须提供</b>：children；可选 <code>size</code>、<code>tone</code>、<code>variant</code>（现包只有一个 <code>Text</code> 类；三个 prop 为本批新增，Owner 2026-10-11 定，默认值不变）。</li><li><b>容器</b>：可折行，由父级定宽；表格单元内不用 Text，用单元自身样式。</li><li><b>用</b>：说明、帮助、空状态、通知正文。</li><li><b>不用</b>：标题、标签、编号。</li></ul></div>
<div class="box"><h4>Highlight <small>text · query · caseSensitive · markClassName</small></h4><p class="lead">一句话：把 <code>query</code> 在 <code>text</code> 里的命中包成 mark，只加 8% 青洗底；字重、字距、字号、内距全部不变，命中前后的排版与未命中时逐像素相同。</p><ul><li><b>须提供</b>：<code>text</code> 字符串与 <code>query</code>；query 为空时原样输出。</li><li><b>容器</b>：行内；在选中行与表格单元里同一规则，不另配色。</li><li><b>用</b>：搜索结果、过滤命中、命令面板。</li><li><b>不用</b>：强调语气（用 strong）；状态（用点加字）。</li></ul></div>
<div class="box"><h4>numeral <small>新样式 · Text 的 variant 值（已定）</small></h4><p class="lead">一句话：数字用 Source Serif 4 300 等宽数字，单位进 <code>small</code> 槽缩小拉距；只给指标与金额。</p><ul><li><b>须提供</b>：数值文本；单位放在 unit 槽；行内用 inl（16/20 400）。</li><li><b>用</b>：指标、金额、席位、计数。</li><li><b>不用</b>：编号与时间（mono）、表格里的普通数字（正文）。</li></ul></div>
<div class="box"><h4>caps <small>新样式 · Text 的 variant 值（已定）</small></h4><p class="lead">一句话：11/16 500、字距 .14em、三级墨；区段编号前缀用等宽。</p><ul><li><b>须提供</b>：短标签文本；可选编号前缀。</li><li><b>用</b>：区段标题、表头、指标标签、页头副标。</li><li><b>不用</b>：可点击元素的文字；超过四个词的句子。</li></ul></div>
<div class="box"><h4>mono <small>编号 · 现有 --tcrn-type-family-mono 换字体</small></h4><p class="lead">一句话：IBM Plex Mono 11.5/16 次墨，只给机器可读的值。</p><ul><li><b>用</b>：ID、邮箱、时间戳、快捷键、哈希。</li><li><b>不用</b>：任何给人读的句子。</li></ul></div>
</div>`;

const diff = kvTable([
  ["Token", "现值（@tcrn/ui-tokens 3.0.0）", "G+ 值", "说明"],
  ["type.family.ui", "Inter, Avenir Next, Helvetica Neue, Arial", "Hanken Grotesk, Noto Sans SC", "正文与控件；中文回退 Noto Sans SC"],
  ["type.family.heading（新）", "无，继承 ui", "Source Serif 4, Noto Serif SC", "1 至 3 级标题与数字"],
  ["type.family.mono", "SFMono-Regular, Consolas, Liberation Mono, Menlo", "IBM Plex Mono", "编号"],
  ["type.family.stamp", "Source Serif 4, Songti SC, Noto Serif CJK SC", "不变", "印章沿用"],
  ["type.size.page / heading-2 / heading-3", "28 / 22 / 16", "36 / 26 / 20", "h1 不再用 clamp(28, 3vw, 44)，产品页固定 36"],
  ["type.size.ui · body · control", "13", "13", "不变；行高改 20px"],
  ["type.line.ui", "1.35", "20px（1.54）", "正文行距放松到 20"],
  ["type.size.reading / line", "14 / 1.45", "14 / 22px", "阅读体"],
  ["type.size.meta / caption", "12 / 11", "12/16 · 11/16", "不变，行高定为 16"],
  ["type.weight.medium", "600", "500（标签）· 600（强调）", "两档拆开；caps 与控件文字 500"],
  ["type.tracking.caps（新）", "无", ".14em", "小型大写标签"],
  ["font-variant-numeric（新）", "无", "tabular-nums 全局", "数字对齐"],
  ["color.text.primary / secondary / muted", "#1c1d21 / #55575e / #8a8c93", "#16150f / #4f4c43 / #6b675d", "muted 现值在白底 3.44，不达 4.5；G+ 三级墨 5.64"],
  ["color.brand.primary（链接）", "#17707f", "#0b6b65（夜间 #3fc7b7）", "链接下划线 70% 不透明"],
  ["highlight mark", "brand-primary-bg #e6f1f3 · r 4 · 600 · padding 0 2", "acc-bg 8% · r 2 · 字重与内距不变 · 2px box-shadow 晕", "命中不改排版"],
  ["selection-fill", "rgba(28,29,33,.06)", "rgba(22,21,15,.06)", "数值同为 6%，底色随墨换"]
], [280, 420, 380]);

const license = kvTable([
  ["资源", "来源与版权方", "许可证", "商用 · 嵌入网页与应用 · 打进 @tcrn/ui 分发", "义务与限制"],
  ["Hanken Grotesk", "Hanken Design Co.（Google Fonts 收录）", "SIL Open Font License 1.1", "全部允许", "分发时附 OFL 许可文本与版权声明；不得把字体文件单独出售；修改后不得再用保留字体名"],
  ["Source Serif 4", "Adobe（Frank Grießhammer），GitHub adobe-fonts/source-serif", "SIL OFL 1.1", "全部允许", "同上"],
  ["IBM Plex Mono", "IBM，GitHub IBM/plex", "SIL OFL 1.1", "全部允许", "同上"],
  ["Noto Sans SC · Noto Serif SC", "Google（Noto 项目）", "SIL OFL 1.1", "全部允许；体积大，按产品用字子集化", "同上"],
  ["Google Fonts css2 链接", "Google", "服务条款", "画板预览用；产品不依赖", "fonts.googleapis.com 在中国大陆不可靠，产品必须自托管 woff2（OFL 允许），不走 CDN"],
  ["图标 37 件", "本批自绘（20 格 1.25px）", "随 TCRN-Design-System 仓库许可", "—", "不再依赖 lucide-react（ISC）；无第三方义务"],
  ["品牌标 tcrn-brand-mark.svg", "TCRN 自有资产", "内部", "—", "Owner 另行重设计；重设计前资产只复制不重绘"]
], [220, 300, 180, 300]);

const body = `
<header class="bh">
<div>
<p class="k">Batch one · 01 / 05 · Typography</p>
<h1>字体：衬线标题与数字，怪诞体正文，等宽编号<em>，两种新样式</em></h1>
<p>Heading、Text、Highlight 三件现有组件换到 G+ 字体底盘，并加入「衬线数字」与「小型大写标签」两种样式。上半部分是浅色与夜间两套同一规则的静态样张，中间是逐格算出的对比度矩阵与动效规范，下半部分是放进构图一壳层的账单页样板，最后是消费方契约与 token 差异。</p>
</div>
<div class="meta"><b>Hanken Grotesk 13/20 · Source Serif 4 300/400 · IBM Plex Mono 11.5</b>中文 Noto Sans SC / Noto Serif SC；五款全部 SIL OFL 1.1，可商用、可打包，产品须自托管<b>文字对比 ≥ 4.5 · 边线与点 ≥ 3</b>矩阵里每格由脚本算出，夜间同一属性集只换值<b>单行元素一律截断加 title</b>标题、标签、表头、编号不折行</div>
</header>

<div class="sec"><h3><b>A</b>组件与样式 <span>左浅色、右夜间；每块纸是一张 panel，纸外是画布</span></h3>
<div class="two">${pane(false)}${pane(true)}</div></div>

<div class="sec"><h3><b>B</b>状态矩阵 <span>fill 与 ink 成对；对比度为 WCAG 2.x 相对亮度比，脚本计算，半透明先合成到承载面</span></h3>${matrix}</div>

<div class="sec"><h3><b>C</b>动效规范 <span>字体家族本身几乎不动；只有链接与焦点环有过渡</span></h3>${motion}</div>

<div class="sec"><h3><b>D</b>组合样板 · 构图一 <span>账单页：页头衬线标题、指标衬线数字、区段编号标签、表格等宽编号、搜索命中与链接</span></h3>${samples}</div>

<div class="sec"><h3><b>E</b>消费方须提供什么 · 何时用与不用 <span>每件一句话摘要在前</span></h3>${consumer}</div>

<div class="sec"><h3><b>F</b>与 G+ 底盘的 token 差异 <span>现值取自 packages/ui-tokens/src/tokens.css</span></h3>${diff}</div>

<div class="sec"><h3><b>G</b>许可与分发 <span>字体、图标、品牌标各自能不能商用、能不能打进包</span></h3>${license}</div>
`;

write("V2-B1-Typography.dc.html", page({ title: "字体 Typography · 第一批", css, body, height }));
