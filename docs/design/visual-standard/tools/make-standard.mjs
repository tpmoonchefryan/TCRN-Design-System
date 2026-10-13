// 把草稿画布的通过稿板复制成成品，并把与最新确认标准（产品标通过稿、顶带壳）冲突的文字与格值改到一致。
// 用法：node tools/make-standard.mjs [heights.json]
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { T, cr, fmt, hex, over, parseColor } from "../../gplus-2026-10/tools/lib.mjs";
const SRC = fileURLToPath(new URL("../../gplus-2026-10/boards/", import.meta.url));
const OUT = fileURLToPath(new URL("../boards/", import.meta.url));
const heights = process.argv[2] ? JSON.parse(fs.readFileSync(process.argv[2], "utf8")) : {};
const must = (h, a, b, name) => { if (!h.includes(a)) throw new Error(name + ": 找不到「" + a.slice(0, 40) + "」"); return h.split(a).join(b); };
function setHeight(html, name) {
  const h = heights[name];
  if (!h) return html.replace(/<div class="board" style="width: 2640px; (?:height: \d+px|min-height: 800px)">/, '<div class="board" style="width: 2640px; min-height: 800px">');
  return html.replace(/<div class="board" style="width: 2640px; (?:height: \d+px|min-height: 800px)">/, `<div class="board" style="width: 2640px; height: ${h}px">`).replace(/"\$preview":\{"width":2640,"height":\d+\}/, `"$preview":{"width":2640,"height":${h}}`);
}
function cutD(h, name) { const i = h.indexOf('<div class="sec"><h3><b>D</b>'), j = h.indexOf('<div class="sec"><h3><b>E</b>'); if (i < 0 || j < 0 || j < i) throw new Error("D/E section not found in " + name); return h.slice(0, i) + h.slice(j); }
// 矩阵行：与 lib.matrixTable 同一写法
function mxRow(name, note, cells) {
  const tds = cells.map((c) => { const s = over(parseColor(c.surface), [255, 255, 255, 1]); const f = over(parseColor(c.fill), s); const i = over(parseColor(c.ink), f); const v = cr(c.ink, c.fill, c.surface); const min = c.kind === "text" ? 4.5 : 3; const cls = v < min ? "lo" : ""; return `<td class="m"><span class="sw" style="background:${hex(f)}"></span>${c.fillLabel}</td><td class="m"><span class="sw" style="background:${hex(i)}"></span>${c.inkLabel}</td><td class="n ${cls}" data-cr="${fmt(v)}">${fmt(v)}</td>`; }).join("");
  return `<tr><td class="c">${name}</td><td>${note}</td>${tds}</tr>`;
}
const replaceRow = (h, oldName, html) => { const re = new RegExp('<tr><td class="c">' + oldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '</td>[\\s\\S]*?</tr>'); if (!re.test(h)) throw new Error("矩阵行不存在：" + oldName); return h.replace(re, html); };
const both = (f) => [T.light, T.night].map(f);
function fixIcon(h) {
  // 旧侧栏术语 → 顶带固定项 / 菜单项；选中态改为 6% 墨洗于纸（顶带壳）
  h = replaceRow(h, "默认 · 侧栏项", mxRow("默认 · 顶带固定项", "ink-2 于画布", both((t) => ({ fill: t.bg, ink: t.ink2, surface: t.bg, kind: "icon", fillLabel: "bg", inkLabel: "ink-2" }))));
  h = replaceRow(h, "次要 · 侧栏图标", mxRow("次要 · 菜单项图标", "ink-3 于纸", both((t) => ({ fill: t.panel, ink: t.ink3, surface: t.panel, kind: "icon", fillLabel: "panel", inkLabel: "ink-3" }))));
  h = replaceRow(h, "当前 · 侧栏选中（纸色）", mxRow("当前 · 菜单选中", "ink 于 6% 墨洗（于纸）", both((t) => ({ fill: t.wash, ink: t.ink, surface: t.panel, kind: "icon", fillLabel: "wash", inkLabel: "ink" }))));
  h = replaceRow(h, "悬停 · 侧栏", mxRow("悬停 · 菜单项", "ink 于 3.5% 墨洗（于纸）", both((t) => ({ fill: t.hover, ink: t.ink, surface: t.panel, kind: "icon", fillLabel: "hover", inkLabel: "ink" }))));
  // A 段「当前」样片：底改墨洗、expect 重算、标签改
  for (const [th, t] of [["l", T.light], ["n", T.night]]) {
    const f = over(parseColor(t.wash), over(parseColor(t.panel), [255, 255, 255, 1]));
    const re = new RegExp('(style="background:)' + t.panel + '(;color:' + t.ink + ';box-shadow:inset 0 0 0 1px var\\(--line\\)" data-cell="ink-panel-' + th + '" data-kind="icon" data-expect=")[\\d.]+(")');
    if (!re.test(h)) throw new Error("Icon A 段当前样片不存在：" + th);
    h = h.replace(re, `$1${hex(f)}$2${fmt(cr(t.ink, t.wash, t.panel))}$3`);
  }
  h = must(h, "当前 ink 于纸（侧栏选中）", "当前 ink 于墨洗（菜单选中）", "Icon");
  h = must(h, "成员导航（Inputs 板侧栏）、顶栏通知按钮", "成员导航（菜单项）、顶带通知按钮", "Icon");
  h = must(h, "样板是构图一壳层里的项目列表页，只用名册里的名字。", "组合样板随顶带壳重渲染后补入（第二批）。", "Icon");
  h = h.replace(/docs 层（待裁定）<\/td><td[^>]*>进包<\/td><td[^>]*>style-scale\.md 记为待 Owner 裁定，本批建议进包/, "docs 层</td><td>进包</td><td>已进包：packages/ui-react/src/styles/icon.css.ts（2026-10-11 裁定）");
  if (/待 Owner|待裁定/.test(h.replace(/<style[\s\S]*?<\/style>/, ""))) console.log("  Icon：仍有待裁字样，请检查");
  return h;
}
function fixInputs(h) {
  h = must(h, "sm 28 · 顶栏 220 宽", "sm 28 · 下拉与紧凑工具栏", "Inputs");
  h = must(h, "顶栏、列表上方过滤、命令面板入口", "菜单面板与下拉顶部、列表上方过滤、命令面板入口", "Inputs");
  h = h.split("表单内与顶栏同一工具形态").join("表单内与菜单面板同一工具形态");
  h = must(h, "样板是构图一壳层的邀请成员页，十一件里九件同屏。", "组合样板随顶带壳重渲染后补入（第二批）。", "Inputs");
  return h;
}
function fixTypography(h) {
  h = must(h, "正文落在画布色上：侧栏、页脚与空状态说明会用到。", "正文落在画布色上：顶带固定项、页脚与空状态说明会用到。", "Typography");
  h = must(h, "下半部分是放进构图一壳层的账单页样板，最后是消费方契约与 token 差异。", "最后是消费方契约与 token 差异；组合样板随顶带壳重渲染后补入（第二批）。", "Typography");
  return h;
}
function fixActions(h) {
  h = must(h, "样板是构图一壳层的项目页：页头三枚、工具栏两个按钮组、行内复制与打开、底部危险区。", "组合样板随顶带壳重渲染后补入（第二批）。", "Actions");
  return h;
}
const FAM = [["V2-B1-Typography", "Typography", "字体 Typography", "Typography", fixTypography], ["V2-B1-Icon", "Icon", "图标 Icon", "Icon", fixIcon], ["V2-B1-Actions", "Actions", "动作 Actions", "Actions", fixActions], ["V2-B1-Inputs", "Inputs", "表单控件 Inputs", "Inputs", fixInputs]];
for (const [src, name, title, en, fix] of FAM) {
  let h = fs.readFileSync(SRC + src + ".dc.html", "utf8");
  h = cutD(h, src);
  h = h.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`).replace(/<p class="k">Batch one · 0\d \/ 05 · [^<]*<\/p>/, `<p class="k">Visual standard · ${en} · 2026-10-13</p>`);
  h = fix(h);
  h = setHeight(h, name);
  fs.writeFileSync(OUT + name + ".dc.html", h); console.log("wrote", name, h.length);
}
// 品牌 Brand = 产品标通过稿（第一批 Brand 板含旧注册表、墨色后缀与画布资产，与通过稿冲突，不进成品）
let m = fs.readFileSync(SRC + "V2-B2-Logos-Draft.dc.html", "utf8");
m = m.replace(/<title>[^<]*<\/title>/, "<title>品牌 Brand · 产品标</title>").replace(/<p class="k">Batch two · prelude · Product marks · approved 2026-10-11<\/p>/, '<p class="k">Visual standard · Brand · approved 2026-10-11</p>');
m = must(m, "<p>Owner 2026-10-11 通过本稿（两处修订：TCRN 产品后缀用产品色；Mana Orchestrate 的名称与标语不提宿主）。", "<p>品牌家族的资产是这四枚产品标：标（A 段）给 ProductLogo，锁定块与侧栏写法（E 段）给 ProductLockup，壳层的标按钮取侧栏写法的首行。TCRN 母标另行重设计，重设计前不进标准。Owner 2026-10-11 通过本稿（两处修订：TCRN 产品后缀用产品色；Mana Orchestrate 的名称与标语不提宿主）。", "Brand");
m = must(m, "侧栏与应用图标用淡底贴片，favicon 用深底贴片", "应用图标与产品切换菜单用淡底贴片，favicon 用深底贴片", "Brand");
m = must(m, "淡底贴片用于侧栏与应用图标，深底贴片用于 favicon 与深色场合", "淡底贴片用于应用图标与产品切换菜单，深底贴片用于 favicon 与深色场合", "Brand");
m = m.split("E · 锁定块与侧栏 <span>").join("E · 锁定块与侧栏尺度 <span>");
m = setHeight(m, "Brand");
fs.writeFileSync(OUT + "Brand.dc.html", m); console.log("wrote Brand (product marks)", m.length);
for (const stale of ["ProductMarks.dc.html"]) if (fs.existsSync(OUT + stale)) { fs.renameSync(OUT + stale, OUT + "../" + stale + ".retired"); console.log("retired", stale); }
for (const name of ["Tokens", "Shell"]) { const p = OUT + name + ".dc.html"; if (fs.existsSync(p) && heights[name]) { fs.writeFileSync(p, setHeight(fs.readFileSync(p, "utf8"), name)); console.log("height set", name, heights[name]); } }
