import { cssRules } from "./approved-site-source.mjs";
export function checkSelectionCss(css){
  const rules=cssRules(css),issues=[];
  const tabs=rules.filter(r=>r.selector.includes(".tcrn-tabs__tab")&&/aria-selected|aria-current/.test(r.selector));
  const underline=tabs.find(r=>r.selector.includes(":after")&&r.declarations.height==="1px"&&r.declarations.background==="var(--tcrn-color-rule)");
  if(!underline)issues.push("Published paper Tabs need their 1px rule-ink underline");
  if(tabs.some(r=>/wash|acc/.test(r.declarations.background??r.declarations["background-color"]??"")))issues.push("Paper Tabs incorrectly inherit a selected-row wash or brand axis");
  const selectedRows=rules.filter(r=>/\.tcrn-doc-table.*aria-selected/.test(r.selector));
  if(!selectedRows.some(r=>r.declarations.background==="var(--tcrn-color-wash)"))issues.push("Selected table rows lost their published ink wash");
  return issues;
}
export function checkPairStateRules(css){const issues=[];for(const rule of cssRules(css)){
  if(!/\.tcrn-(?:button|link-button|input|select|checkbox|radio-group__control|switch__control)(?=[:.\s,[])/.test(rule.selector)||!/:hover|:active|aria-pressed/.test(rule.selector))continue;
  for(const [property,value]of Object.entries(rule.declarations)){
    if(/^(background(?:-color)?|color|box-shadow|border(?:-color)?)$/.test(property)&&/(?:#[a-f\d]|rgba?\(|var\(--tcrn-(?:color|brand)-)/i.test(value))issues.push(`State rule paints a color rather than switching its pair: ${rule.selector} ${property}`);
  }
}return issues;}
