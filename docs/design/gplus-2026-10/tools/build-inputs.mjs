import { T, cr, fmt, icon, shell, matrixTable, kvTable, page, write, grain, cellAttrs } from "./lib.mjs";
import { pairDecls } from "./data.mjs";

const height = process.argv[2] ? Number(process.argv[2]) : 0;

const css = `
/* text-like controls: one pair table, states only switch the live pair */
.in{--fill:var(--fill-d);--ink-c:var(--ink-d);--edge:var(--edge-d);${pairDecls("inputs-text", "default")};display:block;width:100%;min-width:0;height:var(--h-md);padding:0 10px;border:0;border-radius:var(--r-ctl);background:var(--fill);color:var(--ink-c);box-shadow:var(--edge);font-family:var(--sans);font-size:var(--fs-md);line-height:20px;outline:none;appearance:none;-webkit-appearance:none;font-variant-numeric:tabular-nums;transition:background-color var(--t-fill) var(--ease),color var(--t-fill) var(--ease),box-shadow var(--t-fill) var(--ease)}
.in::placeholder{color:var(--ink-3);opacity:1}
.in.sm{height:var(--h-sm);font-size:var(--fs-sm);padding:0 8px}
.in.lg{height:var(--h-lg);font-size:var(--fs-lg);padding:0 12px}
.in:where(:hover,.is-hover){--fill:var(--fill-h);--ink-c:var(--ink-h);--edge:var(--edge-h)}
.in:where(:focus-visible,.is-focus){--fill:var(--fill-f);--ink-c:var(--ink-f);--edge:var(--edge-f)}
.in:where([readonly],.is-ro){--fill:var(--fill-r);--ink-c:var(--ink-r);--edge:var(--edge-r)}
.in:where([aria-invalid="true"],.is-err){--fill:var(--fill-e);--ink-c:var(--ink-e);--edge:var(--edge-e)}
.in:where([aria-invalid="true"]:focus-visible,.is-err.is-focus){--edge:var(--edge-ef)}
.in:where(:disabled){--fill:var(--fill-x);--ink-c:var(--ink-x);--edge:var(--edge-x);cursor:not-allowed}
.in.ta{height:auto;min-height:76px;padding:6px 10px;resize:vertical}
/* search: quiet tool, wash fill, no outline until hover */
.in.search{${pairDecls("inputs-text", "search")};padding-left:30px;padding-right:44px}
.in.search.sm{padding-left:28px}
.in.search::placeholder{color:var(--ink-2)}
.sw{position:relative;display:block;min-width:0}
.sw>.ic{position:absolute;left:9px;top:50%;transform:translateY(-50%);color:var(--ink-3);pointer-events:none}
.sw>kbd{position:absolute;right:8px;top:50%;transform:translateY(-50%);font-family:var(--mono);font-size:10px;color:var(--ink-3);border:1px solid var(--line-2);border-radius:4px;padding:0 4px;line-height:14px;pointer-events:none}
.sw>.chev{position:absolute;right:9px;top:50%;transform:translateY(-50%);color:var(--ink-3);pointer-events:none;left:auto}
.in.sel{padding-right:30px;cursor:pointer;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}
.in.num{min-width:12ch;-moz-appearance:textfield}
.in.num::-webkit-inner-spin-button,.in.num::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
.in.date{position:relative;padding-right:30px}
.in.date::-webkit-calendar-picker-indicator{opacity:0;position:absolute;right:0;top:0;width:30px;height:100%;cursor:pointer;margin:0}
/* field */
.fld{display:flex;flex-direction:column;gap:5px;min-width:0}
.fld>label,.fld>.lbl{font-size:12.5px;line-height:16px;font-weight:500;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fld>label small{font-weight:400;color:var(--ink-3);margin-left:6px}
.fld>.hint{font-size:11.5px;line-height:16px;color:var(--ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fld>.err{display:flex;align-items:center;gap:5px;font-size:11.5px;line-height:16px;color:var(--bad);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.g4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px 18px;align-items:start}
.g3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px 18px;align-items:start}
.g2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 18px;align-items:start}
/* listbox / popover (menu skin pending batch three) */
.pop{position:relative;margin-top:6px;padding:4px;border-radius:10px;background:var(--panel);box-shadow:var(--s3);display:flex;flex-direction:column;gap:1px}
.opt{display:flex;align-items:center;gap:8px;height:30px;padding:0 8px;border-radius:6px;font-size:13px;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.opt .ic{color:var(--ink);visibility:hidden}
.opt[aria-selected="true"]{background:var(--wash);font-weight:600}
.opt[aria-selected="true"] .ic{visibility:visible}
.opt.is-hover{background:var(--hover)}
.opt small{margin-left:auto;font-family:var(--mono);font-size:10.5px;color:var(--ink-3)}
/* native-looking multiple listbox */
.lb{display:flex;flex-direction:column;gap:1px;padding:4px}
.lb.in{height:auto}
/* checkbox / radio */
.ck{position:relative;display:grid;grid-template-columns:16px minmax(0,1fr);column-gap:9px;align-items:start;font-size:13px;line-height:20px;color:var(--ink);cursor:pointer;min-width:0}
.ck>input{--fill:var(--fill-d);--edge:var(--edge-d);--mk:var(--mk-d);${pairDecls("inputs-check", "checkbox")};appearance:none;-webkit-appearance:none;margin:2px 0 0;width:16px;height:16px;border-radius:var(--r-check);background:var(--fill);box-shadow:var(--edge);position:relative;cursor:inherit;flex:0 0 auto;transition:background-color var(--t-fill) var(--ease),box-shadow var(--t-fill) var(--ease)}
.ck>input::after{content:"";position:absolute;left:5px;top:1.5px;width:4px;height:8px;border:solid var(--mk);border-width:0 1.5px 1.5px 0;transform:rotate(45deg);transform-origin:center;opacity:1}
.ck>input:where(:indeterminate,.is-mix)::after{left:4px;top:7px;width:8px;height:0;border-width:0 0 1.5px 0;transform:none}
.ck>input:where(:hover,.is-hover){--fill:var(--fill-h);--edge:var(--edge-h);--mk:var(--mk-h)}
.ck>input:where(:checked,:indeterminate,.is-mix){--fill:var(--fill-c);--edge:var(--edge-c);--mk:var(--mk-c)}
.ck>input:where(:focus-visible,.is-focus){--fill:var(--fill-f);--edge:var(--edge-f);--mk:var(--mk-f)}
.ck>input:where(:checked:focus-visible,:checked.is-focus,.is-mix.is-focus){--fill:var(--fill-cf);--edge:var(--edge-cf);--mk:var(--mk-cf)}
.ck>input:where([aria-invalid="true"],.is-err){--fill:var(--fill-e);--edge:var(--edge-e);--mk:var(--mk-e)}
.ck>input:where(:disabled){--fill:var(--fill-x);--edge:var(--edge-x);--mk:var(--mk-x);cursor:not-allowed}
.ck>input:where(:disabled:checked,:disabled.is-mix){--fill:var(--fill-cx);--edge:var(--edge-cx);--mk:var(--mk-cx)}
.ck.dis{color:var(--ink-3);cursor:not-allowed}
.ck>span{min-width:0}
.ck>span b{display:block;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ck>span small{display:block;font-size:11.5px;line-height:16px;color:var(--ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ck.rd>input{border-radius:50%}
.ck.rd>input::after{left:0;top:0;width:16px;height:16px;border:0;border-radius:50%;transform:none;box-shadow:inset 0 0 0 5px var(--mk);background:transparent}
.ck.rd>input{${pairDecls("inputs-check", "radio")}}
fieldset.rg{margin:0;padding:0;border:0;min-width:0;display:flex;flex-direction:column;gap:9px}
fieldset.rg>legend{padding:0;margin:0 0 9px;font-size:12.5px;line-height:16px;font-weight:500;color:var(--ink)}
fieldset.rg.row2{flex-direction:row;gap:22px;flex-wrap:wrap}
/* switch */
.tg{display:grid;grid-template-columns:34px minmax(0,1fr);column-gap:10px;align-items:start;font-size:13px;line-height:20px;color:var(--ink);cursor:pointer;min-width:0}
.tg>input{--trk:var(--trk-d);--edge:var(--edge-d);--kn:var(--kn-d);--kedge:var(--kedge-d);${pairDecls("inputs-switch", "switch")};appearance:none;-webkit-appearance:none;margin:0;width:34px;height:20px;border-radius:999px;background:var(--trk);box-shadow:var(--edge);position:relative;cursor:inherit;flex:0 0 auto;transition:background-color var(--t-fill) var(--ease),box-shadow var(--t-fill) var(--ease)}
.tg>input::after{content:"";position:absolute;left:2px;top:2px;width:16px;height:16px;border-radius:50%;background:var(--kn);box-shadow:var(--kedge);transition:transform var(--t-move) var(--ease),background-color var(--t-fill) var(--ease)}
.tg>input:where(:checked,.is-on)::after{transform:translateX(14px)}
.tg>input:where(:hover,.is-hover){--trk:var(--trk-h);--edge:var(--edge-h);--kn:var(--kn-h);--kedge:var(--kedge-h)}
.tg>input:where(:checked,.is-on){--trk:var(--trk-c);--edge:var(--edge-c);--kn:var(--kn-c);--kedge:var(--kedge-c)}
.tg>input:where(:focus-visible,.is-focus){--trk:var(--trk-f);--edge:var(--edge-f);--kn:var(--kn-f);--kedge:var(--kedge-f)}
.tg>input:where(:checked:focus-visible,.is-on.is-focus){--trk:var(--trk-cf);--edge:var(--edge-cf);--kn:var(--kn-cf);--kedge:var(--kedge-cf)}
.tg>input:where(:disabled){--trk:var(--trk-x);--edge:var(--edge-x);--kn:var(--kn-x);--kedge:var(--kedge-x);cursor:not-allowed}
.tg>input:where(:disabled:checked,:disabled.is-on){--trk:var(--trk-cx);--edge:var(--edge-cx);--kn:var(--kn-cx);--kedge:var(--kedge-cx)}
.tg.sm{grid-template-columns:28px minmax(0,1fr)}
.tg.sm>input{width:28px;height:16px}
.tg.sm>input::after{width:12px;height:12px}
.tg.sm>input:where(:checked,.is-on)::after{transform:translateX(12px)}
.tg.dis{color:var(--ink-3);cursor:not-allowed}
.tg>span{min-width:0}
.tg>span b{display:block;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tg>span small{display:block;font-size:11.5px;line-height:16px;color:var(--ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.btn{height:var(--h-md);padding:0 12px;border:0;border-radius:var(--r-ctl);font-family:var(--sans);font-size:13px;font-weight:500;line-height:1;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;cursor:pointer;flex:0 0 auto}
.btn.pri{background:var(--acc);color:var(--on-acc)}
.btn.quiet{background:transparent;color:var(--ink-2)}
.btn.sm{height:var(--h-sm);padding:0 10px;font-size:12px}
.lab{display:flex;flex-direction:column;gap:6px;align-items:flex-start;min-width:0}
.lab>small{font-size:10.5px;color:var(--ink-3);font-family:var(--mono);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.lab>.w{width:100%}
.cmd{position:relative;display:block;width:220px}
.frm{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 24px;align-items:start}
.frm .full{grid-column:1 / -1}
.foot{display:flex;align-items:center;justify-content:flex-end;gap:8px;padding-top:12px;border-top:1px solid var(--line);margin-top:auto}
.swrow{display:flex;flex-direction:column;gap:9px}
`;

function inp(opts) {
  const { cls = "", state = "", value = "", ph = "", attrs = "", type = "text", cell = "" } = opts;
  const st = { hover: " is-hover", focus: " is-focus", err: " is-err", errfocus: " is-err is-focus", ro: " is-ro" }[state] || "";
  const extra = state === "dis" ? " disabled" : state === "ro" ? " readonly" : "";
  return `<input type="${type}" class="in${cls ? " " + cls : ""}${st}"${extra}${value ? ` value="${value}"` : ""}${ph ? ` placeholder="${ph}"` : ""} aria-label="示例"${attrs}${cell}>`;
}

function pane(night) {
  const t = night ? T.night : T.light;
  const th = night ? "n" : "l";
  const P = t.panel;
  const PROBE = { "in-ph": "ph", "search-ph": "ph", "ck-edge": "shadow", "rd-edge": "shadow", "sw-edge": "shadow", "ck-on": "after-border", "ck-dis": "after-border", "rd-on": "after-shadow", "sw-on": "after-bg" };
  const cell = (id) => ` ${cellAttrs("inputs", `${id}-${th}`)}${PROBE[id] ? ` data-probe="${PROBE[id]}"` : ""}`;
  const states = [
    ["default", inp({ ph: "例如：季度复盘", cell: cell("in-ph") })],
    ["hover", inp({ state: "hover", value: "季度复盘" })],
    ["focus", inp({ state: "focus", value: "季度复盘", cell: cell("in-focus") })],
    ["filled", inp({ value: "季度复盘", cell: cell("in-text") })],
    ["readonly", inp({ state: "ro", value: "设计组", cell: cell("in-ro") })],
    ["disabled", inp({ state: "dis", value: "设计组", cell: cell("in-dis") })],
    ["error", inp({ state: "err", value: "lin.xiao@", attrs: ' aria-invalid="true"', cell: cell("in-err") })],
    ["error + focus", inp({ state: "errfocus", value: "lin.xiao@", attrs: ' aria-invalid="true"' })]
  ].map(([n, h]) => `<span class="lab"><span class="w">${h}</span><small>${n}</small></span>`).join("");
  const sizes = `<span class="lab"><span class="w">${inp({ cls: "sm", value: "sm 28 · 12" })}</span><small>sm</small></span><span class="lab"><span class="w">${inp({ value: "md 32 · 13" })}</span><small>md</small></span><span class="lab"><span class="w">${inp({ cls: "lg", value: "lg 40 · 14" })}</span><small>lg</small></span><span class="lab"><div class="fld w"><label for="f-${th}">项目名称<small>必填</small></label>${inp({ attrs: ` id="f-${th}"`, value: "季度复盘" }).replace(' aria-label="示例"', "")}<span class="hint">对团队成员可见</span></div><small>Field · label 12.5/500 · hint 11.5 ink-3</small></span>`;
  const errField = `<div class="fld w"><label for="e-${th}">邮箱</label>${inp({ attrs: ` id="e-${th}" aria-invalid="true" aria-describedby="em-${th}"`, state: "err", value: "lin.xiao@" }).replace(' aria-label="示例"', "")}<span class="err" id="em-${th}"${cell("err-msg")}>${icon("alert-triangle", { size: 13 })}邮箱格式不完整</span></div>`;
  const ta = `<span class="lab"><span class="w"><textarea class="in ta" aria-label="附言" placeholder="写几句话，让对方知道为什么被邀请"></textarea></span><small>Textarea · min 76 · 可纵向拉伸</small></span><span class="lab"><span class="w"><textarea class="in ta is-focus" aria-label="附言">欢迎加入设计组。季度复盘在 10 月 20 日，请先看资料库里的「上季度结论」。</textarea></span><small>focus · 文字 13/20</small></span><span class="lab"><span class="w"><textarea class="in ta" aria-label="附言" disabled>由管理员代填</textarea></span><small>disabled</small></span>`;
  const search = `<span class="lab"><span class="sw w">${icon("search", { size: 14 })}${inp({ cls: "search", type: "search", ph: "搜索成员、项目" })}<kbd>⌘K</kbd></span><small>SearchInput · shortcut="auto"</small></span><span class="lab"><span class="sw w">${icon("search", { size: 14 })}${inp({ cls: "search", type: "search", state: "hover", ph: "搜索成员、项目" })}<kbd>⌘K</kbd></span><small>hover · 加 1px line-2</small></span><span class="lab"><span class="sw w">${icon("search", { size: 14 })}${inp({ cls: "search", type: "search", state: "focus", value: "季度", cell: cell("search-focus") })}<kbd>⌘K</kbd></span><small>focus · 纸底 + 环</small></span><span class="lab"><span class="sw" style="width:220px">${icon("search", { size: 13 })}${inp({ cls: "search sm", type: "search", ph: "搜索", cell: cell("search-ph") })}<kbd>⌘K</kbd></span><small>sm 28 · 顶栏 220 宽</small></span>`;
  const suggest = `<span class="lab"><span class="w">${inp({ value: "设计", state: "focus", attrs: ' list="sg" data-choice-value-mode="open"' })}<div class="pop" role="listbox" aria-label="建议"><div class="opt is-hover" role="option" aria-selected="false">${icon("check", { size: 14 })}设计组<small>团队</small></div><div class="opt" role="option" aria-selected="false">${icon("check", { size: 14 })}设计评审<small>项目</small></div><div class="opt" role="option" aria-selected="false">${icon("check", { size: 14 })}设计系统 · 组件库<small>项目</small></div></div></span><small>SuggestInput · 建议只是提示，仍可自由输入；下拉外形待第三批 Menu 定稿</small></span>`;
  const select = `<span class="lab"><span class="sw w"><select class="in sel" aria-label="角色"><option>管理员</option><option>成员</option><option>只读</option></select>${icon("chevron-down", { size: 14, cls: "chev", attrs: `${cell("chev")}` })}</span><small>Select · 原生 option</small></span><span class="lab"><span class="sw w"><select class="in sel is-focus" aria-label="角色"><option>成员</option></select>${icon("chevron-down", { size: 14, cls: "chev" })}</span><small>focus</small></span><span class="lab"><span class="sw w"><select class="in sel" aria-label="角色" disabled><option>管理员</option></select>${icon("chevron-down", { size: 14, cls: "chev" })}</span><small>disabled</small></span><span class="lab"><span class="sw w"><select class="in sel is-err" aria-invalid="true" aria-label="角色"><option>请选择</option></select>${icon("chevron-down", { size: 14, cls: "chev" })}</span><small>error · 未选</small></span>`;
  const multi = `<span class="lab"><span class="sw w"><button type="button" class="in sel" style="text-align:left" aria-haspopup="listbox" aria-expanded="true">季度复盘、产品发布 +1</button>${icon("chevron-down", { size: 14, cls: "chev" })}<div class="pop" role="listbox" aria-multiselectable="true" aria-label="项目"><div class="opt" role="option" aria-selected="true"${cell("opt-sel")}>${icon("check", { size: 14 })}季度复盘</div><div class="opt" role="option" aria-selected="true">${icon("check", { size: 14 })}产品发布 · 十月</div><div class="opt" role="option" aria-selected="true">${icon("check", { size: 14 })}招聘 · 秋季</div><div class="opt is-hover" role="option" aria-selected="false">${icon("check", { size: 14 })}资料库迁移</div><div class="opt" role="option" aria-selected="false" style="color:var(--ink-3)">${icon("check", { size: 14 })}已归档 · 不可选</div></div></span><small>MultiSelect presentation="dropdown" · 触发器摘要 + 开着的 listbox</small></span>
<span class="lab"><span class="sw w"><button type="button" class="in sel" style="text-align:left;color:var(--ink-3)" aria-haspopup="listbox" aria-expanded="false">选择项目</button>${icon("chevron-down", { size: 14, cls: "chev" })}</span><small>dropdown · 空选 emptySelectionLabel</small></span>
<span class="lab"><div class="in lb w" aria-label="项目（原生 multiple）"><div class="opt" aria-selected="true">${icon("check", { size: 14 })}季度复盘</div><div class="opt" aria-selected="true">${icon("check", { size: 14 })}产品发布 · 十月</div><div class="opt" aria-selected="false">${icon("check", { size: 14 })}招聘 · 秋季</div><div class="opt" aria-selected="false">${icon("check", { size: 14 })}资料库迁移</div></div><small>presentation="native" · 兼容默认，浏览器绘制</small></span>
<span class="lab"><fieldset class="rg w"><legend>项目 · presentation="checkboxes"</legend><label class="ck"><input type="checkbox" checked><span><b>季度复盘</b></span></label><label class="ck"><input type="checkbox" checked><span><b>产品发布 · 十月</b></span></label><label class="ck"><input type="checkbox"><span><b>招聘 · 秋季</b></span></label><div><button type="button" class="btn quiet sm">清除选择</button></div></fieldset><small>必填时至少一项；clearSelectionLabel 必填</small></span>`;
  const num = `<span class="lab"><span class="w">${inp({ cls: "num", type: "number", value: "12", attrs: ' inputmode="numeric" min="1" max="120"', cell: cell("num") })}</span><small>NumberInput · min 12ch · tabular</small></span><span class="lab"><div class="fld w"><label for="n-${th}">席位</label>${inp({ cls: "num", type: "number", value: "140", attrs: ` id="n-${th}" inputmode="numeric" min="1" max="120" aria-invalid="true"`, state: "err" }).replace(' aria-label="示例"', "")}<span class="err">${icon("alert-triangle", { size: 13 })}最多 120 席</span></div><small>超出范围 · 原生 invalid + 文案</small></span><span class="lab"><span class="w">${inp({ cls: "num", type: "number", value: "12", state: "dis", attrs: ' inputmode="numeric"' })}</span><small>disabled</small></span>`;
  const cal = (extra = "") => icon("calendar", { size: 14, cls: "chev", attrs: extra });
  const date = `<span class="lab"><span class="sw w">${inp({ cls: "date", type: "date", value: "2026-10-31", attrs: ' min="2026-10-01"', cell: cell("date") })}${cal(cell("cal").trim())}</span><small>DatePicker · ISO 值，显示格式随读者；右侧 calendar 图标，原生指示器透明盖在同一区域</small></span><span class="lab"><span class="sw w">${inp({ cls: "date", type: "date", value: "2026-10-31", state: "focus" })}${cal()}</span><small>focus</small></span><span class="lab"><span class="sw w">${inp({ cls: "date", type: "date", value: "2026-09-30", state: "dis" })}${cal()}</span><small>disabled</small></span>`;
  const ckStates = [
    ["default", `<label class="ck"><input type="checkbox"${cell("ck-edge")}><span><b>邮件通知</b></span></label>`],
    ["hover", `<label class="ck"><input type="checkbox" class="is-hover"><span><b>邮件通知</b></span></label>`],
    ["checked", `<label class="ck"><input type="checkbox" checked${cell("ck-on")}><span><b>邮件通知</b></span></label>`],
    ["indeterminate", `<label class="ck"><input type="checkbox" class="is-mix"><span><b>部分选中</b></span></label>`],
    ["focus", `<label class="ck"><input type="checkbox" class="is-focus"><span><b>邮件通知</b></span></label>`],
    ["checked + focus", `<label class="ck"><input type="checkbox" checked class="is-focus"><span><b>邮件通知</b></span></label>`],
    ["error", `<label class="ck"><input type="checkbox" aria-invalid="true"><span><b>我已阅读条款</b></span></label>`],
    ["disabled · on / off", `<label class="ck dis"><input type="checkbox" checked disabled${cell("ck-dis")}><span><b>强制两步验证</b></span></label>`],
    ["with description", `<label class="ck"><input type="checkbox" checked><span><b>每日摘要</b><small>每天 9:00 汇总未读</small></span></label>`]
  ].map(([n, h]) => `<span class="lab">${h}<small>${n}</small></span>`).join("");
  const radio = `<fieldset class="rg"><legend>可见性</legend><label class="ck rd"><input type="radio" name="v-${th}"${cell("rd-edge")}><span><b>公开</b><small>所有成员可见</small></span></label><label class="ck rd"><input type="radio" name="v-${th}" checked${cell("rd-on")}><span><b>仅团队</b><small>设计组 12 人</small></span></label><label class="ck rd"><input type="radio" name="v-${th}"><span><b>私密</b><small>仅受邀成员</small></span></label></fieldset>
<fieldset class="rg"><legend>状态 · 单项</legend><label class="ck rd"><input type="radio" name="s-${th}" class="is-hover"><span><b>hover</b></span></label><label class="ck rd"><input type="radio" name="s-${th}" class="is-focus"><span><b>focus</b></span></label><label class="ck rd"><input type="radio" name="s-${th}" checked class="is-focus"><span><b>checked + focus</b></span></label><label class="ck rd dis"><input type="radio" name="s-${th}" disabled><span><b>disabled</b></span></label><label class="ck rd dis"><input type="radio" name="s2-${th}" checked disabled><span><b>disabled · checked</b></span></label></fieldset>
<fieldset class="rg row2"><legend>二值并排 · minInlineSize 112</legend><label class="ck rd" style="min-width:112px"><input type="radio" name="b-${th}" checked><span><b>月付</b></span></label><label class="ck rd" style="min-width:112px"><input type="radio" name="b-${th}"><span><b>年付 · 省 20%</b></span></label></fieldset>`;
  const sw = [
    ["off", `<label class="tg"><input type="checkbox" role="switch"${cell("sw-edge")}><span><b>自动归档</b></span></label>`],
    ["on", `<label class="tg"><input type="checkbox" role="switch" checked${cell("sw-on")}><span><b>自动归档</b></span></label>`],
    ["hover", `<label class="tg"><input type="checkbox" role="switch" class="is-hover"><span><b>周报摘要</b></span></label>`],
    ["focus", `<label class="tg"><input type="checkbox" role="switch" class="is-focus"><span><b>周报摘要</b></span></label>`],
    ["on + focus", `<label class="tg"><input type="checkbox" role="switch" checked class="is-focus"><span><b>周报摘要</b></span></label>`],
    ["disabled off / on", `<label class="tg dis"><input type="checkbox" role="switch" disabled><span><b>强制两步验证</b></span></label>`],
    ["", `<label class="tg dis"><input type="checkbox" role="switch" checked disabled><span><b>强制两步验证</b></span></label>`],
    ["with description", `<label class="tg"><input type="checkbox" role="switch" checked><span><b>新评论</b><small>有人在项目里 @ 你或回复你</small></span></label>`],
    ["sm 28 × 16", `<label class="tg sm"><input type="checkbox" role="switch" checked><span><b>紧凑</b></span></label>`]
  ].map(([n, h]) => `<span class="lab">${h}<small>${n}</small></span>`).join("");
  return `<section class="pane gp${night ? " night" : ""}" aria-label="${night ? "夜间" : "浅色"}">
${grain("inp-" + th)}
<span class="ptag">${night ? "night · 画布 #121210 · 纸 #191916" : "light · 画布 #efeeea · 纸 #ffffff"}</span>
<div class="blk"><h6>Input · 八种状态 <span>轮廓 1px line-ctl（≥ 3），hover 加深，focus 青边加环，error 红边，error+focus 红环；禁用用 5% 洗底与三级墨</span></h6>
<div class="paper"><div class="g4">${states}</div></div></div>
<div class="blk"><h6>尺寸与 Field <span>sm 28 · md 32 · lg 40；标签 12.5/500，帮助 11.5 三级墨，错误 11.5 红字加 alert-triangle；Field 件归第五批，这里只画其字体</span></h6>
<div class="paper"><div class="g4">${sizes}<span class="lab">${errField}<small>error · aria-describedby 指向错误文案</small></span></div></div></div>
<div class="blk"><h6>Textarea <span>同一对表；min-height 76，行高 20，纵向可拉伸</span></h6>
<div class="paper"><div class="g3">${ta}</div></div></div>
<div class="blk"><h6>SearchInput <span>工具不是字段：6% 墨洗、无轮廓；hover 现 1px 发丝线；focus 回到纸底加环；右侧 kbd 快捷键</span></h6>
<div class="paper"><div class="g4">${search}</div></div></div>
<div class="blk"><h6>SuggestInput · Select <span>SuggestInput 是开放字符串加建议；Select 是封闭单值，原生 option，右侧 chevron 14</span></h6>
<div class="paper"><div class="g4">${suggest}${select}</div></div></div>
<div class="blk"><h6>MultiSelect · 三种呈现 <span>dropdown 是常规；native 兼容；checkboxes 显式清单；选中行 6% 墨洗加字重加勾</span></h6>
<div class="paper"><div class="g4">${multi}</div></div></div>
<div class="blk"><h6>NumberInput · DatePicker <span>数值用原生 number，隐藏 spin 按钮，键盘与范围校验保留；日期用原生 date，值为 ISO，右侧 calendar 图标（名册新增），点击仍打开系统日历</span></h6>
<div class="paper"><div class="g3">${num}</div><div class="g3">${date}</div></div></div>
<div class="blk"><h6>Checkbox · 九格 <span>16 方 r 4；选中青底白勾；半选横杠；错误红边；禁用 5% 洗底</span></h6>
<div class="paper"><div class="g3">${ckStates}</div></div></div>
<div class="blk"><h6>RadioGroup · fieldset + legend <span>16 圆；选中 5px 青环留纸心；描述 11.5 三级墨；二值可并排</span></h6>
<div class="paper"><div class="g3">${radio}</div></div></div>
<div class="blk"><h6>Switch · role="switch" <span>轨 34 × 20，钮 16 行程 14（240ms）；关态轨 bg-2 加 line-ctl 轮廓，开态轨 acc 钮 on-acc</span></h6>
<div class="paper"><div class="g3">${sw}</div></div></div>
</section>`;
}

// ---------- matrix ----------
function rows() {
  const mk = (name, note, pick, exempt) => ({ name, note, cells: [T.light, T.night].map((t) => ({ ...pick(t), exempt })) });
  return [
    { group: "Input · Textarea · Select · NumberInput · DatePicker · SuggestInput（同一对表）" },
    mk("文字 · default / filled / focus / error", "ink 于 panel", (t) => ({ fill: t.panel, ink: t.ink, surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: "ink" })),
    mk("占位 placeholder", "ink-3 于 panel", (t) => ({ fill: t.panel, ink: t.ink3, surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: "ink-3" })),
    mk("readonly", "ink 于 panel-2", (t) => ({ fill: t.panel2, ink: t.ink, surface: t.panel, kind: "text", fillLabel: "panel-2", inkLabel: "ink" })),
    mk("disabled", "ink-3 于 dis 5%（豁免）", (t) => ({ fill: t.dis, ink: t.ink3, surface: t.panel, kind: "text", fillLabel: "dis", inkLabel: "ink-3" }), true),
    mk("错误文案", "bad 于 panel", (t) => ({ fill: t.panel, ink: t.bad, surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: "bad" })),
    mk("标签 · 帮助", "ink 500 · ink-3", (t) => ({ fill: t.panel, ink: t.ink3, surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: "ink-3（帮助，最低）" })),
    mk("边 · default", "line-ctl 于 panel", (t) => ({ fill: t.panel, ink: t.lineCtl, surface: t.panel, kind: "edge", fillLabel: "panel", inkLabel: "line-ctl" })),
    mk("边 · hover", "ink-2 于 panel", (t) => ({ fill: t.panel, ink: t.ink2, surface: t.panel, kind: "edge", fillLabel: "panel", inkLabel: "ink-2" })),
    mk("边 · focus", "acc 于 panel + 环", (t) => ({ fill: t.panel, ink: t.acc, surface: t.panel, kind: "edge", fillLabel: "panel", inkLabel: "acc" })),
    mk("边 · error", "bad 于 panel", (t) => ({ fill: t.panel, ink: t.bad, surface: t.panel, kind: "edge", fillLabel: "panel", inkLabel: "bad" })),
    mk("边 · disabled / readonly", "line-2 16%（豁免）", (t) => ({ fill: t.panel, ink: t.line2, surface: t.panel, kind: "edge", fillLabel: "panel", inkLabel: "line-2" }), true),
    mk("chevron · 日期指示", "ink-3 图标", (t) => ({ fill: t.panel, ink: t.ink3, surface: t.panel, kind: "icon", fillLabel: "panel", inkLabel: "ink-3" })),
    { group: "SearchInput" },
    mk("占位于墨洗", "ink-2 于 wash（ink-3 在夜间只有 3.88，故升一级）", (t) => ({ fill: t.wash, ink: t.ink2, surface: t.panel, kind: "text", fillLabel: "wash", inkLabel: "ink-2" })),
    mk("输入文字于墨洗", "ink 于 wash", (t) => ({ fill: t.wash, ink: t.ink, surface: t.panel, kind: "text", fillLabel: "wash", inkLabel: "ink" })),
    mk("墨洗面 vs 纸", "6% 不作边界，靠图标与占位识别（裁定项）", (t) => ({ fill: t.panel, ink: t.wash, surface: t.panel, kind: "edge", fillLabel: "panel", inkLabel: "wash" }), true),
    { group: "MultiSelect · 列表项" },
    mk("选中项", "ink 600 于 wash", (t) => ({ fill: t.wash, ink: t.ink, surface: t.panel, kind: "text", fillLabel: "wash", inkLabel: "ink" })),
    mk("悬停项", "ink 于 hover 3.5%", (t) => ({ fill: t.hover, ink: t.ink, surface: t.panel, kind: "text", fillLabel: "hover", inkLabel: "ink" })),
    mk("不可选项", "ink-3 于 panel", (t) => ({ fill: t.panel, ink: t.ink3, surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: "ink-3" })),
    { group: "Checkbox · RadioGroup" },
    mk("边 · default", "line-ctl 于 panel", (t) => ({ fill: t.panel, ink: t.lineCtl, surface: t.panel, kind: "edge", fillLabel: "panel", inkLabel: "line-ctl" })),
    mk("checked 面 vs 纸", "acc 于 panel", (t) => ({ fill: t.panel, ink: t.acc, surface: t.panel, kind: "edge", fillLabel: "panel", inkLabel: "acc" })),
    mk("勾 · 横杠", "on-acc 于 acc", (t) => ({ fill: t.acc, ink: t.onAcc, surface: t.panel, kind: "icon", fillLabel: "acc", inkLabel: "on-acc" })),
    mk("radio 选中环", "acc 5px 于 panel", (t) => ({ fill: t.panel, ink: t.acc, surface: t.panel, kind: "icon", fillLabel: "panel", inkLabel: "acc" })),
    mk("禁用 · 选中", "ink-3 于 dis（豁免）", (t) => ({ fill: t.dis, ink: t.ink3, surface: t.panel, kind: "icon", fillLabel: "dis", inkLabel: "ink-3" }), true),
    mk("标签 · 描述", "ink · ink-3", (t) => ({ fill: t.panel, ink: t.ink3, surface: t.panel, kind: "text", fillLabel: "panel", inkLabel: "ink-3（描述，最低）" })),
    { group: "Switch" },
    mk("轨 off · 边", "line-ctl 于 bg-2 于 panel", (t) => ({ fill: t.bg2, ink: t.lineCtl, surface: t.panel, kind: "edge", fillLabel: "bg-2", inkLabel: "line-ctl" })),
    mk("钮 off 于轨", "panel 钮 + line-ctl 边 于 bg-2", (t) => ({ fill: t.bg2, ink: t.lineCtl, surface: t.panel, kind: "edge", fillLabel: "bg-2", inkLabel: "line-ctl" })),
    mk("轨 on vs 纸", "acc 于 panel", (t) => ({ fill: t.panel, ink: t.acc, surface: t.panel, kind: "edge", fillLabel: "panel", inkLabel: "acc" })),
    mk("钮 on 于轨", "on-acc 于 acc", (t) => ({ fill: t.acc, ink: t.onAcc, surface: t.panel, kind: "icon", fillLabel: "acc", inkLabel: "on-acc" })),
    mk("禁用 on", "ink-3 钮 于 dis（豁免）", (t) => ({ fill: t.dis, ink: t.ink3, surface: t.panel, kind: "icon", fillLabel: "dis", inkLabel: "ink-3" }), true)
  ];
}
const matrix = matrixTable({ caption: "表单控件状态矩阵", cols: ["浅色", "夜间"], rows: rows() });

const motion = kvTable([
  ["元素 · 触发", "变化的属性", "时长", "曲线", "reduced-motion", "备注"],
  ["Input 等 · hover / focus / error", "box-shadow（边与环）· background-color", "120ms", "cubic-bezier(.22,1,.36,1)", "保留", "边与环一起换，不单改一边"],
  ["Checkbox · 勾出现", "background-color 换对；勾不做描边动画", "120ms", "同上", "保留", "半选横杠同"],
  ["Radio · 选中", "inset 环 0 → 5px", "120ms", "同上", "改瞬时", "—"],
  ["Switch · 钮行程", "transform translateX 14（sm 12）", "240ms", "同上", "改瞬时，颜色保留", "轨色 120ms；不过冲"],
  ["MultiSelect dropdown 开合", "opacity + translateY 4 → 0", "240ms 开 · 120ms 合", "同上", "只留 opacity", "外形与时长以第三批 Menu 定稿为准"],
  ["SuggestInput 列表", "同上", "同上", "同上", "同上", "原生 datalist 由浏览器绘制时无动效"],
  ["错误文案出现", "opacity 0 → 1", "120ms", "同上", "保留", "不抖动、不摇晃"],
  ["禁止", "边框宽度变化、scale、发光扩散", "—", "—", "—", "焦点环是固定几何，不扩散"]
], [240, 300, 150, 200, 180]);

function sampleBody(th) {
  return `<div class="ph"><h2>邀请成员</h2><span class="sub">加入 设计组 · 席位 86 / 120</span></div>
<div class="frm">
<div class="fld"><label for="s1-${th}">邮箱<small>必填</small></label><input id="s1-${th}" type="email" class="in" value="wang.yf@tcrn.app"></div>
<div class="fld"><label for="s2-${th}">角色</label><span class="sw"><select id="s2-${th}" class="in sel"><option>成员</option><option>管理员</option><option>只读</option></select>${icon("chevron-down", { size: 14, cls: "chev" })}</span></div>
<div class="fld"><span class="lbl">项目</span><span class="sw"><button type="button" class="in sel" style="text-align:left" aria-haspopup="listbox" aria-expanded="false">季度复盘、产品发布 +1</button>${icon("chevron-down", { size: 14, cls: "chev" })}</span><span class="hint">可多选，邀请后可改</span></div>
<div class="fld"><label for="s4-${th}">席位数</label><input id="s4-${th}" type="number" class="in num" value="1" inputmode="numeric" min="1" max="34"><span class="hint">剩余 34 席，按席位计费</span></div>
<div class="fld"><label for="s5-${th}">到期日<small>可选</small></label><span class="sw"><input id="s5-${th}" type="date" class="in date" value="2026-12-31" min="2026-10-11">${icon("calendar", { size: 14, cls: "chev" })}</span></div>
<div class="fld"><label for="s6-${th}">附言</label><textarea id="s6-${th}" class="in ta" style="min-height:58px">欢迎加入设计组，季度复盘在 10 月 20 日。</textarea></div>
<fieldset class="rg"><legend>可见性</legend><label class="ck rd"><input type="radio" name="vis-${th}" checked><span><b>仅团队</b><small>设计组 12 人可见</small></span></label><label class="ck rd"><input type="radio" name="vis-${th}"><span><b>私密</b><small>仅受邀成员</small></span></label></fieldset>
<div class="swrow"><span class="lbl" style="font-size:12.5px;line-height:16px;font-weight:500">通知</span><label class="tg"><input type="checkbox" role="switch" checked><span><b>邮件通知</b><small>邀请与到期提醒</small></span></label><label class="ck"><input type="checkbox"><span><b>同时发送周报摘要</b></span></label></div>
</div>
<div class="foot"><button type="button" class="btn quiet">取消</button><button type="button" class="btn pri">发送邀请</button></div>`;
}
const nav = [
  { id: "home", icon: "home", label: "工作台" },
  { id: "projects", icon: "layout-grid", label: "项目", count: "12" },
  { id: "members", icon: "users", label: "成员", count: "24", on: true },
  { id: "data", icon: "database", label: "数据" },
  { group: "团队" },
  { id: "settings", icon: "settings", label: "设置" }
];
const brandHtml = `<div class="brand"><span class="mk" data-guide="rail" style="border-radius:6px;background:var(--acc);display:flex;align-items:center;justify-content:center;color:var(--on-acc);font-family:var(--serif);font-weight:500;font-size:13px">T</span><span><b data-text="rail">TCRN 设计组</b><small>团队 · 12 人</small></span></div>`;
const topbar = `<span class="sw cmd">${icon("search", { size: 13 })}<input type="search" class="in search sm" placeholder="搜索" aria-label="搜索"><kbd>⌘K</kbd></span>`;
const samples = `<div class="two">${shell({ id: "in-l", night: false, nav, brandHtml, topbar, body: sampleBody("l"), crumbs: ["成员", "邀请"] })}${shell({ id: "in-n", night: true, nav, brandHtml, topbar, body: sampleBody("n"), crumbs: ["成员", "邀请"] })}</div>`;

const consumer = `<div class="cols4">
<div class="box"><h4>Input · Textarea <small>原生属性 · disabledReason</small></h4><p class="lead">一句话：单行与多行文本，一张纸上的一格；禁用时必须说明原因。</p><ul><li><b>须提供</b>：label（同页 for/id 或 aria-label）；<code>disabled</code> 时给 <code>disabledReason</code>；错误时 <code>aria-invalid</code> 加 <code>aria-describedby</code> 指向错误文案。</li><li><b>容器</b>：Field（第五批）或表单网格定宽；控件自身 width 100%。</li><li><b>不用</b>：搜索（用 SearchInput）；数值（用 NumberInput）；封闭集合（用 Select）。</li></ul></div>
<div class="box"><h4>SearchInput <small>shortcut auto|string|false · fill</small></h4><p class="lead">一句话：找东西的工具，不是表单字段：墨洗无边框，右侧快捷键，focus 回到纸底。</p><ul><li><b>须提供</b>：aria-label 或可见 label；<code>shortcut="auto"</code> 显示 Ctrl K / ⌘K 并写 aria-keyshortcuts；<code>fill</code> 撑满容器。</li><li><b>用</b>：顶栏、列表上方过滤、命令面板入口。</li><li><b>不用</b>：收集要提交的值；替代 Select 的筛选。</li></ul></div>
<div class="box"><h4>SuggestInput <small>suggestions · 其余同 Input</small></h4><p class="lead">一句话：开放字符串加建议，建议不限制输入（data-choice-value-mode=open）。</p><ul><li><b>须提供</b>：<code>suggestions</code> 字符串数组（自动去重）。</li><li><b>不用</b>：封闭值域（用 Select / MultiSelect）。</li></ul></div>
<div class="box"><h4>Select <small>options[{value,label,disabled}] · disabledReason</small></h4><p class="lead">一句话：封闭单值，原生 select；超过两项或二值放不下时由 SettingChoice 落到它。</p><ul><li><b>须提供</b>：<code>options</code>；首项若是占位须 disabled。</li><li><b>不用</b>：导航与语言菜单（用壳层专用件）；多值（用 MultiSelect）。</li></ul></div>
<div class="box"><h4>MultiSelect <small>options · value/defaultValue · onChange · presentation native|dropdown|checkboxes · emptySelectionLabel · clearSelectionLabel</small></h4><p class="lead">一句话：封闭集合多选；dropdown 是常规呈现，关闭时摘要选中项，打开时 body 边界的 listbox。</p><ul><li><b>须提供</b>：<code>options</code>；dropdown 给 <code>emptySelectionLabel</code>；checkboxes 给 <code>clearSelectionLabel</code>；必填清单至少一个可选项被选。</li><li><b>静态页</b>：<code>mountStaticMultiSelect</code>。</li><li><b>不用</b>：开放集合（resolveFieldValueControl 判为 unsupported）。</li></ul></div>
<div class="box"><h4>NumberInput <small>min · max · step · inputMode · disabledReason</small></h4><p class="lead">一句话：数值就用数值控件：原生 number，键盘、粘贴、范围校验都保留；Stepper 只表达流程位置。</p><ul><li><b>须提供</b>：label 与单位（单位写在 label 或 hint）；范围用 min/max。</li><li><b>外形</b>：隐藏原生 spin 按钮，min-width 12ch，tabular 数字。</li></ul></div>
<div class="box"><h4>DatePicker <small>value ISO · min · max</small></h4><p class="lead">一句话：原生 date，值永远是 YYYY-MM-DD，显示格式随读者的系统。</p><ul><li><b>须提供</b>：label；范围 min/max。</li><li><b>外形</b>：右侧 calendar 图标 14 三级墨；原生指示器透明覆盖同一 30px 区域，点击打开系统日历。</li></ul></div>
<div class="box"><h4>Checkbox <small>原生属性 · disabledReason</small></h4><p class="lead">一句话：16 方的原生 checkbox 去掉系统外观：青底白勾、半选横杠、红边错误。</p><ul><li><b>须提供</b>：label（包裹或 for）；描述放 label 内第二行。</li><li><b>不用</b>：二值设置的开关语义（用 Switch）；单选（用 RadioGroup）。</li></ul></div>
<div class="box"><h4>RadioGroup <small>legend（必填）· name（必填）· options[{value,label,description,disabled,minInlineSize}] · value/defaultValue · onChange</small></h4><p class="lead">一句话：fieldset 加 legend 的原生单选组，看见全部选项就是它的意义。</p><ul><li><b>须提供</b>：<code>legend</code> 与 <code>name</code>（同页两组同名会合并）。</li><li><b>不用</b>：超过五项（用 Select）；导航（用 SegmentedNav）。</li></ul></div>
<div class="box"><h4>Switch <small>label（必填）· description · controlClassName</small></h4><p class="lead">一句话：立即生效的二值设置；轨 34 × 20，钮行程 14。</p><ul><li><b>须提供</b>：<code>label</code>；需要说明时 <code>description</code>（自动 aria-describedby）。</li><li><b>不用</b>：需要「保存」才生效的选项（用 Checkbox）；多于二值（用 RadioGroup / Select）。</li></ul></div>
<div class="box"><h4>状态对机制 <small>C1 · C2 · C5</small></h4><p class="lead">一句话：文本类一张对表（d/h/f/r/x/e/ef），勾选类加 mark 色成三元组，开关类是轨、轨边、钮、钮边四元组；状态只切换，不写颜色。</p><ul><li>夜间：只改 .night 下的 token，所有 .in / .ck / .tg 规则不动。</li><li>轮廓 line-ctl 47% 同 Actions 板（Owner 2026-10-11 定）。</li></ul></div>
<div class="box"><h4>值域决定控件 <small>resolveFieldValueControl</small></h4><p class="lead">一句话：封闭单值 → Select（或二值 radio）；封闭集合 → MultiSelect；开放单值 → SuggestInput；开放集合 → 不支持。</p><ul><li>表随家族重写，机器判定不变。</li></ul></div>
</div>`;

const diff = kvTable([
  ["Token / 契约", "现值", "G+ 值", "说明"],
  ["Input / Select 高度", "min-height 34", "32（sm 28 · lg 40）", "三档与 Button 同"],
  ["边", "1px border-strong #cfcfc9（1.5:1）", "inset 0 0 0 1px line-ctl 47%（3.1:1）", "C1 边线 ≥ 3；hover ink-2，focus acc，error bad"],
  ["圆角", "radius-control 4", "8", "—"],
  ["内距", "0 10", "0 10（sm 8 · lg 12）", "—"],
  ["Field focus-within", "整块 muted 56% 洗底 + outline strong 66%", "无；只有控件自身换边加环", "去掉整块变色"],
  ["Field error", "整块 blocked-bg 62% 洗底", "无；红边 + 红字文案 + alert-triangle", "—"],
  ["focus", "outline 2px focus-ring", "1px acc 边 + 环（2px 面色 + 2px acc）", "elevation-focus 同形"],
  ["placeholder", "浏览器默认", "ink-3 · opacity 1", "5.64 / 4.59"],
  ["disabled", "浏览器默认 + cursor", "dis 5% 底 + ink-3 + line-2 边", "可算，豁免"],
  ["Textarea", "min-height 96 · padding 8 12", "min-height 76 · padding 6 10 · 行高 20", "—"],
  ["SearchInput", "同 Input 外观 + 图标 + kbd", "墨洗 6% 无边；hover line-2；focus 纸底加环", "已定：表单内与顶栏同一工具形态，不用 Input 轮廓"],
  ["Select chevron", "浏览器默认箭头", "名册 chevron-down 14，ink-3", "appearance none"],
  ["MultiSelect 选中行", "selection-fill 6% · hover 3.2%", "wash 6% + 600 + check · hover 3.5%", "数值同族"],
  ["NumberInput", "原生 spin 可见 · min 12ch", "隐藏 spin · min 12ch · tabular", "键盘与范围保留"],
  ["Checkbox / Radio", "原生外观", "appearance none；16 · r 4 / 圆；acc 底 on-acc 勾；radio 5px 环", "—"],
  ["Switch", "::before 钮，尺寸随 token（未列）", "34 × 20 · 钮 16 · 行程 14 · 240ms；sm 28 × 16", "关态轨 bg-2 + line-ctl，钮 panel + line-ctl；开态 acc + on-acc 钮"],
  ["过渡", "150ms ease-out（field）", "fill 120 · move 240，曲线 .22,1,.36,1", "—"]
], [240, 360, 400]);

const body = `
<header class="bh">
<div>
<p class="k">Batch one · 05 / 05 · Inputs</p>
<h1>表单控件：十一件，三张对表<em>，每一种边都能量出 3:1</em></h1>
<p>Input、Textarea、SearchInput、SuggestInput、Select、MultiSelect、NumberInput、DatePicker、Checkbox、RadioGroup、Switch。文本类控件共用一张 fill/ink/edge 对表，勾选类再加勾的颜色，开关类是轨与钮各自的面与边；状态只切换生效的对。边线按 C1 用 47% 墨的 line-ctl（Owner 2026-10-11 定，与 Actions 板同）。原生控件（select、number、date、datalist）保留浏览器的编辑与可及性行为，只换外观。样板是构图一壳层的邀请成员页，十一件里九件同屏。</p>
</div>
<div class="meta"><b>sm 28 · md 32 · lg 40 · r 8 · 边 line-ctl 47%</b>文字 ≥ 4.5 · 边与勾 ≥ 3 · 禁用豁免但列数<b>Checkbox 16 r 4 · Radio 16 · Switch 34 × 20</b>选中青底白勾、5px 青环、钮行程 14<b>边与环 120ms · 钮行程 240ms</b>cubic-bezier(.22,1,.36,1)</div>
</header>

<div class="sec"><h3><b>A</b>组件与状态 <span>左浅色、右夜间；同一属性集只换值</span></h3>
<div class="two">${pane(false)}${pane(true)}</div></div>

<div class="sec"><h3><b>B</b>状态矩阵 <span>文本类共用一表；SearchInput、列表项、勾选类、开关各自列出边与勾</span></h3>${matrix}</div>

<div class="sec"><h3><b>C</b>动效规范 <span>边与环换色，只有开关的钮位移</span></h3>${motion}</div>

<div class="sec"><h3><b>D</b>组合样板 · 构图一 <span>邀请成员：Input、Select、MultiSelect、NumberInput、DatePicker、Textarea、RadioGroup、Switch、Checkbox，顶栏 SearchInput</span></h3>${samples}</div>

<div class="sec"><h3><b>E</b>消费方须提供什么 · 何时用与不用 <span>十一件各一句话，外加两条机制</span></h3>${consumer}</div>

<div class="sec"><h3><b>F</b>与 G+ 底盘的 token 差异 <span>现值取自 Form.tsx、Navigation.tsx 的 tcrnComponentCss 与 tokens.css</span></h3>${diff}</div>
`;

write("V2-B1-Inputs.dc.html", page({ title: "表单控件 Inputs · 第一批", css, body, height }));
