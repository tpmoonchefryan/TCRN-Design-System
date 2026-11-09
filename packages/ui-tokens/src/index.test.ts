import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { compareTokenThemeBlocks, createCssVariables, createResolvedTokenMap, createThemeCssVariables, createTokenMap, findDeprecatedTokenUsages, parseTokenCssBlocks, tcrnCoarsePointerTokens, tcrnDarkThemeTokens, tcrnDeprecatedTokenAliases, tcrnDeprecatedTokens, tcrnGplusFixedTokens, tcrnGplusThemedTokens, tcrnTokenCss, tcrnTokenStylesheet, tcrnTokens, type DesignToken } from "./index.js";

// The independent input is the pinned, published CSS, not another generated registry.
const rawCss = readFileSync(new URL("../../../docs/design/approved-site-v2/src/boards/01-tokens/board.css", import.meta.url), "utf8");
function rawBlock(selector: string) {
  const start = rawCss.indexOf(`${selector}{`);
  assert.ok(start >= 0, selector);
  return Object.fromEntries(rawCss.slice(start + selector.length + 1, rawCss.indexOf("}", start)).split(";").filter(Boolean).map(d => { const i = d.indexOf(":"); return [d.slice(0,i),d.slice(i+1)]; }));
}
const sourceLight = rawBlock(".gp"), sourceNight = rawBlock(".gp.night");
const light = createTokenMap(), resolvedLight = createResolvedTokenMap(), resolvedDark = createResolvedTokenMap("dark");

test("published 39 theme values stay byte-exact in both themes and names are unique", () => {
  assert.equal(Object.keys(sourceNight).length,39);
  assert.equal(tcrnGplusThemedTokens.length,39);
  assert.equal(Object.keys(sourceLight).length - Object.keys(sourceNight).length,27);
  for(const row of tcrnGplusThemedTokens) {
    assert.equal(row.light,sourceLight[`--${row.key}`],row.key);
    assert.equal(row.dark,sourceNight[`--${row.key}`],row.key);
    assert.equal(light[row.cssVar],row.light);
    assert.equal(tcrnDarkThemeTokens.find(t=>t.variable===row.cssVar)?.value,row.dark);
  }
  assert.equal(new Set(tcrnTokens.map(t=>t.variable)).size,tcrnTokens.length);
  assert.equal(new Set(tcrnTokens.map(t=>t.name)).size,tcrnTokens.length);
  assert.ok(tcrnTokens.every(t=>t.scope === "theme" || t.scope === "fixed"));
});

test("retired compatibility vocabulary cannot enter the current package sheet", () => {
  assert.deepEqual(tcrnDeprecatedTokens,[]);
  assert.deepEqual(tcrnDeprecatedTokenAliases,{});
  for(const variable of ["--tcrn-color-text-primary","--tcrn-color-brand-primary","--tcrn-motion-press-scale","--tcrn-shell-sidebar-width","--tcrn-brand-accent-aos","--tcrn-brand-suffix-einzbern","--tcrn-brand-suffix-mana-orchestrate"]) {
    assert.equal(variable in light,false,variable);
    assert.ok(!tcrnTokenCss.includes(`${variable}:`));
  }
  assert.deepEqual(findDeprecatedTokenUsages("color:var(--tcrn-color-ink)"),[]);
});

test("K1 published suffix text colors vary by theme without changing the SVG palette", () => {
  assert.equal(light["--tcrn-brand-suffix-tms"],"#2c63c8");
  assert.equal(resolvedDark["--tcrn-brand-suffix-tms"],"#7aa0f5");
  assert.equal(light["--tcrn-brand-suffix-design-system"],"#4b59be");
  assert.equal(resolvedDark["--tcrn-brand-suffix-design-system"],"#6577f3");
  assert.equal("--tcrn-brand-suffix-design-system-interactive" in light,false);
});

test("engineering spellings of geometry and motion have explicit published source anchors", () => {
  for(const row of tcrnGplusFixedTokens) assert.match(row.source ?? "", /^(01-tokens|02-typography|03-icons|04-brand|05-actions|06-inputs|07[ab]-shell-(upper|lower))\//);
  for(const [name,value] of Object.entries({"--tcrn-shell-strip-h":"52px","--tcrn-shell-brand-w":"134px","--tcrn-shell-brand-h":"40px","--tcrn-shell-toggle":"20px","--tcrn-shell-pin-h":"32px","--tcrn-shell-pin-gap":"8px","--tcrn-shell-panel-w-expanded":"952px","--tcrn-shell-drop-w":"240px","--tcrn-shell-mark":"22px","--tcrn-shell-mark-lg":"128px","--tcrn-shell-touch":"44px","--tcrn-motion-intro-fade":"120ms","--tcrn-motion-intro-move":"240ms","--tcrn-motion-intro-rise":"100ms","--tcrn-motion-intro-max":"700ms"})) assert.equal(light[name],value,name);
  assert.equal(light["--tcrn-motion-duration-fill"],"120ms");
  assert.equal(light["--tcrn-motion-duration-press"],"80ms");
  assert.equal(light["--tcrn-motion-duration-move"],"240ms");
  assert.equal(light["--tcrn-motion-duration-loop"],"900ms");
});

test("light subtrees rebind all theme values and dark blocks have identical name sets", () => {
  const comparison=compareTokenThemeBlocks(tcrnTokenCss);
  assert.equal(comparison.ok,true,comparison.problems.join("; "));
  assert.deepEqual(comparison.lightOnly,[]);assert.deepEqual(comparison.darkOnly,[]);
  const blocks=parseTokenCssBlocks(tcrnTokenStylesheet);
  assert.equal(blocks[0].selector,':root, [data-tcrn-theme="light"]');
  assert.equal(blocks.at(-1)?.selector,'[data-tcrn-theme="dark"]');
  assert.equal(blocks.filter(b=>b.kind==="theme-independent").length,1);
  assert.equal(tcrnTokenStylesheet.startsWith('@import "../fonts/fonts.css";\n'),true);
  assert.equal(resolvedLight["--tcrn-color-surface"],sourceLight["--bg"]);
  assert.equal(resolvedDark["--tcrn-color-surface"],sourceNight["--bg"]);
  assert.equal(resolvedDark["--tcrn-focus-ring"],`0 0 0 2px ${sourceNight["--bg"]},0 0 0 4px ${sourceNight["--acc"]}`);
});

test("all actual package dependencies resolve in both themes, including the source-local paper radius", () => {
  assert.equal(tcrnTokens.length,125);
  const shellCss=readFileSync(new URL("../../../docs/design/approved-site-v2/src/boards/07b-shell-lower/board.css",import.meta.url),"utf8");
  const localRadius=/\.scr\.ts\{[^}]*--paper-r:([^;}]*)/.exec(shellCss)?.[1];
  assert.ok(localRadius);
  for(const values of [resolvedLight,resolvedDark]) {
    assert.equal(values["--tcrn-radius-paper"],localRadius);
    assert.equal(Object.keys(values).length,tcrnTokens.length);
    assert.ok(Object.values(values).every(value=>!value.includes("var(")));
  }
});

test("theme block parser rejects a missing light subtree, extra selectors and asymmetric declarations", () => {
  const opening=':root, [data-tcrn-theme="light"] {\n';
  const reordered=tcrnTokenCss.replace(opening,'[data-tcrn-theme="light"],\n  :root {\n');
  assert.equal(compareTokenThemeBlocks(reordered).ok,true);
  assert.equal(compareTokenThemeBlocks(tcrnTokenCss.replace(opening,':root {\n')).ok,false);
  assert.equal(compareTokenThemeBlocks(tcrnTokenCss.replace(opening,':root, [data-tcrn-theme="light"], .extra {\n')).ok,false);
  const asymmetric=tcrnTokenCss.replace('[data-tcrn-theme="dark"] {\n','[data-tcrn-theme="dark"] {\n  --tcrn-extra: red;\n');
  assert.deepEqual([...compareTokenThemeBlocks(asymmetric).darkOnly],["--tcrn-extra"]);
});

test("coarse pointer changes only the source-declared row/search lengths", () => {
  assert.deepEqual(tcrnCoarsePointerTokens,[{variable:"--tcrn-shell-row-h",value:"var(--tcrn-shell-touch)"},{variable:"--tcrn-shell-srch-h",value:"var(--tcrn-shell-touch)"}]);
  const coarse=parseTokenCssBlocks(tcrnTokenCss).filter(b=>b.media!==null);
  assert.equal(coarse.length,1);assert.equal(coarse[0].media,"(pointer: coarse)");
  assert.deepEqual(coarse[0].declarations,tcrnCoarsePointerTokens.map(t=>[t.variable,t.value]));
  // A subset sheet must never emit an override whose target is absent.
  assert.ok(!createCssVariables(tcrnTokens.filter(t=>t.variable!=="--tcrn-shell-touch")).includes("@media"));
});

test("resolver detects real dependency cycles and respects fallbacks", () => {
  const t=(variable:`--tcrn-${string}`,value:string):DesignToken=>({name:variable,variable,value,group:"color",description:"fixture",scope:"fixed"});
  assert.throws(()=>createResolvedTokenMap("light",[t("--tcrn-a","var(--tcrn-b)"),t("--tcrn-b","var(--tcrn-a)")]),/token cycle/);
  assert.deepEqual(createResolvedTokenMap("light",[t("--tcrn-a","var(--tcrn-missing, #123456)")]),{"--tcrn-a":"#123456"});
  assert.equal(createThemeCssVariables("dark").includes('[data-tcrn-theme="dark"]'),true);
});

test("published overlay levels are discoverable as z-index tokens rather than container lengths", () => {
  assert.deepEqual(tcrnTokens.filter((token) => token.group === "zIndex").map((token) => token.variable), [
    "--tcrn-z-overlay", "--tcrn-z-popover"
  ]);
});
