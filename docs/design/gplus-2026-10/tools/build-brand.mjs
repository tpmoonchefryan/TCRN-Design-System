import { T, cr, fmt, icon, shell, matrixTable, kvTable, page, write, grain, cellAttrs } from "./lib.mjs";

const height = process.argv[2] ? Number(process.argv[2]) : 0;
const MARK = process.argv[3] || "/_blob/MISSING";
const SHA = process.argv[4] || "unknown";
const BLOBSHA = process.argv[5] || "unknown";

// registered accents (package :root tokens, light / dark)
const ACC = {
  aos: ["#187c7c", "#69d6d0"], tms: ["#2c63c8", "#9bb8ff"], workflow: ["#3b5272", "#9db5d4"],
  ds1: ["#6577f3", "#aeb8ff"], ds2: ["#3096f4", "#83c8ff"], ds3: ["#43d4cf", "#7ce4df"], ds4: ["#78b957", "#c9f08f"]
};
const REG = [
  { id: "design-system", base: "TCRN", suffix: "Design System", stack: true, tag: { zh: "设计系统", en: "Design System", ja: "デザインシステム", ko: "디자인 시스템", fr: "Système de design" } },
  { id: "aos", base: "TCRN", suffix: "AOS", stack: false, tag: { zh: "AI 运营系统", en: "AI Operation System", ja: "AI オペレーションシステム", ko: "AI 운영 시스템", fr: "Système d'exploitation IA" } },
  { id: "tms", base: "TCRN", suffix: "TMS", stack: false, tag: { zh: "人才管理系统", en: "Talent Management System", ja: "タレントマネジメントシステム", ko: "인재 관리 시스템", fr: "Système de gestion des talents" } },
  { id: "workflow", base: "TCRN", suffix: "Workflow", stack: false, tag: { zh: "工作流治理引擎", en: "Workflow Governance Engine", ja: "ワークフローガバナンスエンジン", ko: "워크플로 거버넌스 엔진", fr: "Moteur de gouvernance des flux" } }
];

const css = `
.mark{display:block;flex:0 0 auto;width:var(--mk,38px);height:var(--mk,38px)}
.logo{display:inline-grid;grid-template-columns:auto minmax(0,1fr);column-gap:12px;align-items:center;min-width:0;--mk:38px}
.logo.c28{--mk:28px;column-gap:10px}
.logo.c22{--mk:22px;column-gap:10px}
.logo.c56{--mk:56px;column-gap:14px}
.copy{display:grid;gap:2px;min-width:0}
.l1{display:inline-flex;align-items:baseline;gap:5px;font-size:14px;line-height:18px;color:var(--ink);white-space:nowrap;min-width:0}
.l1 .b{font-weight:500;flex:0 0 auto}
.l1 .s{font-weight:600;flex:0 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis}
.l1.stack{flex-direction:column;align-items:flex-start;gap:0;line-height:16px}
.l2{font-size:11.5px;line-height:16px;font-weight:500;color:var(--ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.c28 .l1{font-size:13px;line-height:18px}
.c28 .l2{font-size:10.5px;line-height:14px}
.c22 .l1{font-size:12.5px;line-height:16px}
.c22 .l2{font-size:10.5px;line-height:14px}
.c56 .l1{font-size:18px;line-height:22px}
.c56 .l2{font-size:12.5px;line-height:18px}
.acc .s{color:var(--p-acc)}
.wm{display:inline-flex;align-items:baseline;gap:6px;font-size:16px;line-height:20px;color:var(--ink);white-space:nowrap;min-width:0}
.wm .b{font-weight:500}
.wm .s{font-weight:600;overflow:hidden;text-overflow:ellipsis;min-width:0}
.wm.stack{flex-direction:column;align-items:flex-start;gap:0}
.lock{display:inline-grid;grid-template-columns:auto minmax(0,1fr);column-gap:10px;align-items:center;--mk:28px;min-width:0}
.lock.lnk{text-decoration:none;color:inherit;border-radius:8px;padding:4px 6px;margin:-4px -6px}
.lock.lnk.is-focus{box-shadow:var(--focus)}
.collapse{width:52px;height:52px;display:flex;align-items:center;justify-content:center;border-radius:10px;box-shadow:inset 0 0 0 1px var(--line);--mk:22px}
.collapse .copy{display:none}
.skel{display:inline-grid;grid-template-columns:38px minmax(0,1fr);column-gap:12px;align-items:center;width:220px}
.skel i{display:block;border-radius:6px;background:var(--wash)}
.skel .m{width:38px;height:38px;border-radius:9px}
.skel .t1{height:12px;width:120px;margin-bottom:6px}
.skel .t2{height:10px;width:80px}
.spec2{display:grid;grid-template-columns:170px minmax(0,1fr);column-gap:16px;row-gap:14px;align-items:center}
.spec2>small{font-family:var(--mono);font-size:10.5px;color:var(--ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.reg{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.reg .it{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border-radius:10px;box-shadow:inset 0 0 0 1px var(--line);min-width:0}
.reg .tags{display:grid;grid-template-columns:34px minmax(0,1fr);row-gap:2px;column-gap:8px;font-size:11.5px;line-height:16px;color:var(--ink-2)}
.reg .tags b{font-family:var(--mono);font-weight:500;color:var(--ink-3);font-size:10.5px}
.reg .tags span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.night-mark{display:flex;align-items:center;gap:22px}
.chk{display:inline-flex;align-items:center;gap:8px;font-size:12px;color:var(--ink-2);white-space:nowrap}
.chk .ic{color:var(--ok)}
.cell>small.dig,.dig{font-family:var(--mono);font-size:10.5px;color:var(--ink-3);word-break:break-all;white-space:normal;line-height:1.5;max-width:100%}
.ptab{width:100%;border-collapse:collapse;table-layout:fixed;font-size:12.5px}
.ptab th{height:30px;text-align:left;padding:0 10px;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3);font-weight:500;border-bottom:1px solid var(--line-2);white-space:nowrap}
.ptab th:first-child,.ptab td:first-child{padding-left:0}
.ptab td{height:52px;padding:0 10px;border-bottom:1px solid var(--line);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;vertical-align:middle;color:var(--ink-2)}
.ptab td .mono{color:var(--ink-3)}
`;

const mark = (cls = "", size) => `<img class="mark${cls ? " " + cls : ""}" src="${MARK}" alt="TCRN 品牌标识" width="${size || 38}" height="${size || 38}" data-brand-asset="tcrn-brand-mark"${size ? ` style="--mk:${size}px"` : ""}>`;

function logo(r, { size = 38, accent = false, night = false, lang = "zh", cellAttr = "" } = {}) {
  const cls = size === 28 ? " c28" : size === 22 ? " c22" : size === 56 ? " c56" : "";
  const accStyle = accent ? (r.id === "design-system" ? ` style="--p-acc:${ACC.ds2[night ? 1 : 0]}"` : ` style="--p-acc:${ACC[r.id][night ? 1 : 0]}"`) : "";
  return `<div class="logo${cls}${accent ? " acc" : ""}" role="img" aria-label="${r.base} ${r.suffix} ${r.tag[lang]}"${accStyle}>${mark("", size)}<span class="copy" aria-hidden="true"><span class="l1${r.stack ? " stack" : ""}"><span class="b">${r.base}</span><span class="s" ${cellAttr}>${r.suffix}</span></span><span class="l2">${r.tag[lang]}</span></span></div>`;
}

function pane(night) {
  const t = night ? T.night : T.light;
  const th = night ? "n" : "l";
  const cell = (id) => cellAttrs("brand", `${id}-${th}`);
  const P = t.panel, B = t.bg;
  const n = night ? 1 : 0;
  return `<section class="pane gp${night ? " night" : ""}" aria-label="${night ? "夜间" : "浅色"}">
${grain("br-" + th)}
<span class="ptag">${night ? "night · 画布 #121210 · 纸 #191916" : "light · 画布 #efeeea · 纸 #ffffff"}</span>
<div class="blk"><h6>TcrnBrandMark · 资产只复制 <span>img，四档 22 / 28 / 38 / 56，夜间不加滤镜（--tcrn-brand-mark-filter: none）</span></h6>
<div class="paper"><div class="row" style="gap:28px;align-items:flex-end">
<span class="cell">${mark("", 22)}<small>22 · 侧栏</small></span>
<span class="cell">${mark("", 28)}<small>28 · 锁定块</small></span>
<span class="cell">${mark("", 38)}<small>38 · 产品标</small></span>
<span class="cell">${mark("", 56)}<small>56 · 关于页</small></span>
<span class="cell" style="margin-left:auto;max-width:520px"><span class="chk">${icon("shield-check", { size: 14 })}apps/storybook/assets/tcrn-brand-mark.svg · 64,989 B</span><small class="dig">源文件 sha256 ${SHA}</small><small class="dig">画布副本 65,194 B · sha256 ${BLOBSHA}（上传时被服务器重写，仓库文件未动）</small></span>
</div></div></div>

<div class="blk"><h6>ProductLogo · 标加两行 <span>mark 38 · 一行 14/18：TCRN 500 加后缀 600，后缀用各自产品标的深色（TMS #2c63c8，夜间取标的亮色 #7aa0f5；Design System #6577f3；渐变文字停用；本板样张仍为墨色，新产品标见第二批前置板）· 二行 11.5/16 三级墨 500；Design System 的后缀按注册表堆叠</span></h6>
<div class="paper"><div class="spec2">
<small>后缀色 · 2026-10-11 改为产品色</small><div class="row" style="gap:32px">${REG.map((r, i) => logo(r, { night, cellAttr: i === 1 ? cell("suffix-ink") : "" })).join("")}</div>
<small>二行五语 · locale</small><div class="row" style="gap:32px">${["zh", "en", "ja", "ko", "fr"].map((l) => logo(REG[1], { night, lang: l })).join("")}</div>
<small>c28 · 顶栏 / c56 · 关于页</small><div class="row" style="gap:32px">${logo(REG[2], { night, size: 28 })}${logo(REG[0], { night, size: 56 })}</div>
<small>tagline 对比</small><div class="row"><span class="l2" style="font-size:11.5px" ${cell("tagline")}>AI 运营系统 · 二行三级墨于纸</span></div>
</div></div></div>

<div class="blk"><h6>ProductLockup · 标加字标 <span>mark 28 · 字标 16/20：TCRN 500 加后缀 600；无 productId 时后缀来自 suffix，长名（> 8 字符、含空格或 ≥ 4 个汉字）堆叠</span></h6>
<div class="paper"><div class="spec2">
<small>productId · 走 ProductLogo</small><div class="row" style="gap:32px">${logo(REG[1], { night, size: 28 })}${logo(REG[2], { night, size: 28 })}</div>
<small>suffix · 短名</small><div class="row" style="gap:32px"><span class="lock">${mark("", 28)}<span class="wm" ${cell("wm")}><span class="b">TCRN</span><span class="s">AOS</span></span></span><span class="lock">${mark("", 28)}<span class="wm"><span class="b">TCRN</span><span class="s">产品</span></span></span></div>
<small>suffix · 长名堆叠</small><div class="row" style="gap:32px"><span class="lock">${mark("", 28)}<span class="wm stack"><span class="b">TCRN</span><span class="s">Design System</span></span></span><span class="lock">${mark("", 28)}<span class="wm stack"><span class="b">TCRN</span><span class="s">工作流治理引擎</span></span></span></div>
<small>作为链接 · focus</small><div class="row" style="gap:32px"><a class="lock lnk" href="#home">${mark("", 28)}<span class="wm"><span class="b">TCRN</span><span class="s">AOS</span></span></a><a class="lock lnk is-focus" href="#home2">${mark("", 28)}<span class="wm"><span class="b">TCRN</span><span class="s">AOS</span></span></a><span class="tx" style="font-size:11.5px;color:var(--ink-3)">悬停不变色、不下划线；只有焦点环</span></div>
<small>收起态 52 · 只留标</small><div class="row" style="gap:32px"><span class="collapse">${mark("", 22)}<span class="copy"><span class="wm"><span class="b">TCRN</span><span class="s">AOS</span></span></span></span><span class="tx" style="font-size:11.5px;color:var(--ink-3)">文案 display:none，不用 overflow:hidden 藏字（C16）</span></div>
<small>加载 · 骨架</small><div class="row"><span class="skel" aria-hidden="true"><i class="m"></i><span><i class="t1"></i><i class="t2"></i></span></span></div>
</div></div></div>

<div class="blk"><h6>在画布上 · 侧栏与收起 <span>22 标，一行 12.5 600、二行 10.5 三级墨；与导航项共用 22px 引导列</span></h6>
<div class="on-canvas" style="padding:14px 18px;border-radius:var(--r-panel);box-shadow:inset 0 0 0 1px var(--line)"><div class="row" style="gap:40px;align-items:center">
<div class="logo c22" role="img" aria-label="TCRN AOS AI 运营系统">${mark("", 22)}<span class="copy" aria-hidden="true"><span class="l1" style="font-weight:600" ${cell("rail-wm")}><span class="b" style="font-weight:600">TCRN</span><span class="s">AOS</span></span><span class="l2" ${cell("rail-tag")}>AI 运营系统</span></span></div>
<div class="logo c22" role="img" aria-label="TCRN Design System 设计系统">${mark("", 22)}<span class="copy" aria-hidden="true"><span class="l1 stack" style="font-weight:600"><span class="b" style="font-weight:600">TCRN</span><span class="s">Design System</span></span></span></div>
<span class="collapse" style="box-shadow:inset 0 0 0 1px var(--line-2)">${mark("", 22)}<span class="copy"></span></span>
</div></div></div>

<div class="blk"><h6>tcrnProductLogoRegistry · 四件注册 <span>字标永远拉丁，标语五语同源；alt 由字标加当前语言标语合成</span></h6>
<div class="paper"><div class="reg">${REG.map((r) => `<div class="it">${logo(r, { night })}<div class="tags">${Object.entries(r.tag).map(([k, v]) => `<b>${k}</b><span>${v}</span>`).join("")}</div></div>`).join("")}</div></div></div>
</section>`;
}

// ---------- matrix ----------
function rows() {
  const mk = (name, note, pick, exempt) => ({ name, note, cells: [T.light, T.night].map((t, i) => ({ ...pick(t, i), exempt })) });
  return [
    { group: "字标与标语 · 在纸上 panel" },
    mk("字标 TCRN · 后缀", "ink 500 / 600 于 panel（已定）", (t) => ({ fill: t.panel, ink: t.ink, surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: "ink" })),
    mk("标语 line two", "ink-3 500 于 panel", (t) => ({ fill: t.panel, ink: t.ink3, surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: "ink-3" })),
    { group: "字标与标语 · 在画布上 bg（侧栏）" },
    mk("侧栏字标", "ink 600 于 bg", (t) => ({ fill: t.bg, ink: t.ink, surface: t.bg, kind: "text", fillLabel: "bg", inkLabel: "ink" })),
    mk("侧栏标语", "ink-3 于 bg", (t) => ({ fill: t.bg, ink: t.ink3, surface: t.bg, kind: "text", fillLabel: "bg", inkLabel: "ink-3" })),
    mk("锁定块作链接 · focus", "焦点环 acc 于 surface（边 ≥ 3）", (t) => ({ fill: t.bg, ink: t.acc, surface: t.bg, kind: "edge", fillLabel: "bg", inkLabel: "acc" })),
    { group: "品牌标本身" },
    mk("mark 于纸 / 画布", "资产不重绘，logo 豁免对比度；最暗象限 #263d59 列出", (t) => ({ fill: t.panel, ink: "#263d59", surface: t.panel, kind: "icon", fillLabel: "panel", inkLabel: "mark 最暗 #263d59" }), true),
    mk("骨架 skeleton", "wash 6% 于 panel（非文字）", (t) => ({ fill: t.panel, ink: t.wash, surface: t.panel, kind: "edge", fillLabel: "panel", inkLabel: "wash" }), true)
  ];
}
const matrix = matrixTable({ caption: "品牌状态矩阵", cols: ["浅色", "夜间"], rows: rows() });

const motion = kvTable([
  ["元素 · 触发", "变化的属性", "时长", "曲线", "reduced-motion", "备注"],
  ["侧栏收起 / 展开 · 锁定块", "文案 display 切换；标尺寸 22 不变", "240ms（随侧栏宽度）", "cubic-bezier(.22,1,.36,1)", "宽度改瞬时", "标不缩放，不淡出；现包的 inline-size 过渡（motion.emphasis）改为不动"],
  ["锁定块作链接 · focus-visible", "box-shadow 焦点环", "120ms", "同上", "保留", "无 hover 变化"],
  ["主题切换时的标", "无", "0", "—", "—", "--tcrn-brand-mark-filter 保持 none，夜间不反色、不降饱和"],
  ["加载 · 骨架", "opacity 1 ↔ .6 循环", "1400ms", "ease-in-out", "改为静态 .8", "沿用 motion.skeleton.loop"],
  ["禁止", "标旋转、呼吸、光斑、渐变流动", "—", "—", "—", "品牌标是资产，不是动画对象"]
], [260, 300, 150, 200, 180]);

function sampleBody() {
  return `<div class="ph"><h2>产品</h2><span class="sub">4 个已注册 · 字标拉丁 · 标语五语</span><span class="act"><button class="btn quiet" type="button" style="height:30px;padding:0 12px;border:0;border-radius:8px;background:transparent;color:var(--ink-2);font:inherit;font-size:12.5px;font-weight:500;display:inline-flex;align-items:center;gap:6px">${icon("external-link", { size: 14 })}品牌资产</button></span></div>
<table class="ptab"><colgroup><col style="width:300px"><col style="width:150px"><col><col style="width:150px"></colgroup>
<thead><tr><th>产品</th><th>资产 ID</th><th>标语 · zh / en</th><th class="r" style="text-align:right">注册</th></tr></thead><tbody>
${REG.map((r) => `<tr><td>${logo(r, { size: 28 })}</td><td class="mono">tcrn-${r.id}-two-line</td><td>${r.tag.zh} · ${r.tag.en}</td><td style="text-align:right"><span class="st ok"><i></i>已注册</span></td></tr>`).join("")}
</tbody></table>
<p class="tx" style="margin:0;font-size:12px;line-height:16px;color:var(--ink-3)">品牌标只从 apps/storybook/assets 复制，构建时按 sha256 核对；字标与标语是文本，由 tcrnProductLogoRegistry 提供。</p>`;
}
const nav = [
  { id: "home", icon: "home", label: "工作台" },
  { id: "projects", icon: "layout-grid", label: "项目", count: "12" },
  { id: "products", icon: "package", label: "产品", on: true },
  { id: "library", icon: "book-open", label: "资料库" },
  { group: "团队" },
  { id: "settings", icon: "settings", label: "设置" }
];
const brandHtml = `<div class="brand" role="img" aria-label="TCRN AOS AI 运营系统">${mark("", 22).replace('class="mark"', 'class="mark mk" data-guide="rail"')}<span aria-hidden="true"><b data-text="rail">TCRN AOS</b><small>AI 运营系统</small></span></div>`;
const topbar = `<div class="cmd" style="position:relative;display:flex;align-items:center;width:220px;height:28px;padding:0 8px 0 28px;border-radius:7px;background:var(--wash);color:var(--ink-3);font-size:12px;white-space:nowrap;overflow:hidden">${icon("search", { size: 13, attrs: 'style="position:absolute;left:9px"' })}搜索<kbd style="margin-left:auto;font-family:var(--mono);font-size:10px;color:var(--ink-3);border:1px solid var(--line-2);border-radius:4px;padding:0 4px">⌘K</kbd></div>`;
const samples = `<div class="two">${shell({ id: "br-l", night: false, nav, brandHtml, topbar, body: sampleBody(), crumbs: ["设计组", "产品"] })}${shell({ id: "br-n", night: true, nav, brandHtml, topbar, body: sampleBody(), crumbs: ["设计组", "产品"] })}</div>`;

const consumer = `<div class="cols3">
<div class="box"><h4>TcrnBrandMark <small>src · alt · locale</small></h4><p class="lead">一句话：品牌标是一张 img，资产原样复制，尺寸由容器变量给，夜间不加滤镜。</p><ul><li><b>须提供</b>：可访问的 <code>src</code>（默认 tcrn-brand-mark.svg，构建时按 sha256 核对）；<code>alt</code> 或 <code>locale</code>（缺省按语言取「TCRN 品牌标识」等五语）。</li><li><b>容器</b>：定 <code>--tcrn-brand-mark-size</code>（22 / 28 / 38 / 56）；标永不随收起态缩放或挤扁（INC-015）。</li><li><b>用</b>：锁定块、产品标、关于页、启动器。</li><li><b>不用</b>：当图标；当装饰背景；当按钮本体。</li></ul></div>
<div class="box"><h4>ProductLogo <small>productId · brandMarkSrc · brandMarkAlt · locale</small></h4><p class="lead">一句话：注册表里的一个产品：标 38 加「TCRN 后缀」一行与五语标语一行，整体是一个 role=img。</p><ul><li><b>须提供</b>：<code>productId</code>（design-system | aos | tms | workflow）；本地化外壳必须传 <code>locale</code>，否则标语停在英文。</li><li><b>容器</b>：由页头、关于页、产品表提供宽度；二行单行截断。</li><li><b>用</b>：产品页、关于、启动器列表。</li><li><b>不用</b>：侧栏（用 ProductLockup 或壳层锁定块）；多于一处的同页重复。</li></ul></div>
<div class="box"><h4>ProductLockup <small>productId | suffix · suffixClassName · brandMarkSrc · brandMarkAlt · locale</small></h4><p class="lead">一句话：顶栏与侧栏的紧凑身份：标 28 加字标「TCRN 后缀」；给了 productId 就走 ProductLogo，否则后缀来自 suffix。</p><ul><li><b>须提供</b>：<code>productId</code> 或 <code>suffix</code>（缺省五语「产品」）；作首页链接时外面包 a。</li><li><b>容器</b>：顶栏 48 至 56 高；收起态由壳层把文案 display:none，不靠 overflow 裁。</li><li><b>用</b>：顶栏、侧栏头部、登录页。</li><li><b>不用</b>：正文中间；邮件签名之类非界面场景。</li><li><b>ShellBrandLockup</b>（带 caption）归第二批壳层家族。</li></ul></div>
</div>`;

const diff = kvTable([
  ["Token / 契约", "现值", "G+ 值", "说明"],
  ["品牌标资产", "apps/storybook/assets/tcrn-brand-mark.svg · 64,989 B", "同一文件，只复制", "sha256 见 A 段；本板的副本经画布上传，发布后另行核对一次"],
  ["--tcrn-brand-mark-size", "38（ProductLogo）", "22 / 28 / 38 / 56 四档", "侧栏 22、锁定块 28、产品标 38、关于页 56"],
  ["--tcrn-brand-mark-filter", "none", "none", "夜间不反色、不降饱和"],
  ["字标一行 line-one", "13 · 400 base + 700 suffix · Inter", "14/18 · 500 base + 600 suffix · Hanken Grotesk", "c28 为 13/18，c22 为 12.5/16（600）"],
  ["字标 wordmark（Lockup）", "18 · 400 base + 700 suffix", "16/20 · 500 base + 600 suffix", "顶栏高度 52 内两行不溢出"],
  ["标语 line-two", "12 · 700 · text-secondary", "11.5/16 · 500 · ink-3", "去粗，降一级墨"],
  ["后缀颜色", "aos #187c7c · tms #2c63c8 · workflow #3b5272 · design-system 四色渐变文字", "各产品标的深色：tms #2c63c8，夜间取标的亮色 #7aa0f5（TCRN-DS-MIN-20261016-R6 D4）· design-system #6577f3（Owner 2026-10-11）", "渐变文字停用；#6577f3 于白 3.8，字标按 logotype 豁免 4.5"],
  ["--tcrn-color-brand-secondary-readable", "#246f80（无 productId 时的后缀色）", "ink（停用该 token）", "同上"],
  ["收起态", "inline-size 过渡 motion.emphasis", "文案 display:none，标 22 不动", "C16"],
  ["focus", "继承宿主 a 的 outline", "box-shadow var(--focus)", "2px 面色 + 2px 青"]
], [260, 420, 360]);

const body = `
<header class="bh">
<div>
<p class="k">Batch one · 03 / 05 · Brand</p>
<h1>品牌：资产只复制不重绘<em>，字标与标语换到 G+ 字体</em></h1>
<p>TcrnBrandMark、ProductLogo、ProductLockup 三件自 Navigation 目录搬入品牌家族，连同 tcrnProductLogoRegistry 的四件注册。品牌标是一张 img，本板的副本直接取自仓库资产，digest 在 A 段；Owner 将另行重设计品牌标，重设计前资产只复制不重绘。文字部分已定：字标 Hanken Grotesk 500 加 600、标语三级墨 500、后缀用各自产品标的深色（四色渐变文字停用）；四枚新产品标见第二批前置板。样板是构图一壳层的产品页，侧栏锁定块与导航项共用 22px 引导列。</p>
</div>
<div class="meta"><b>标 22 / 28 / 38 / 56 · 夜间不加滤镜</b>资产 sha256 不变（C9）；品牌标待 Owner 重设计<b>字标拉丁、标语五语同源</b>alt 由字标加当前语言标语合成<b>收起态 display:none，不用 overflow 藏字</b>C16 · INC-015 的挤扁不再发生</div>
</header>

<div class="sec"><h3><b>A</b>组件与状态 <span>左浅色、右夜间；资产同一份，文字只换值</span></h3>
<div class="two">${pane(false)}${pane(true)}</div></div>

<div class="sec"><h3><b>B</b>状态矩阵 <span>字标与标语的每种底色</span></h3>${matrix}</div>

<div class="sec"><h3><b>C</b>动效规范 <span>品牌标不动；只有收起与焦点环</span></h3>${motion}</div>

<div class="sec"><h3><b>D</b>组合样板 · 构图一 <span>产品页：侧栏锁定块 22 标、表格里 28 产品标、页脚说明</span></h3>${samples}</div>

<div class="sec"><h3><b>E</b>消费方须提供什么 · 何时用与不用 <span>三件各一句话</span></h3>${consumer}</div>

<div class="sec"><h3><b>F</b>与 G+ 底盘的 token 差异 <span>现值取自 Navigation.tsx 的 tcrnComponentCss 与 tokens.css</span></h3>${diff}</div>
`;

write("V2-B1-Brand.dc.html", page({ title: "品牌 Brand · 第一批", css, body, height }));
