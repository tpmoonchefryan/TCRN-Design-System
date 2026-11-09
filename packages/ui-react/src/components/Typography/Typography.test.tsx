import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { Heading,Highlight,Text } from "./Typography.js";
import { tcrnComponentCss } from "../../styles/index.js";
import { typographyScaleCss } from "../../styles/generated/typography.scale.js";
import { publishedBoard } from "../../test/published-source.js";
const source=publishedBoard("02-typography","board.css");
function declarations(css:string,selector:string):Record<string,string>{
 const result:Record<string,string>={};for(const m of css.replace(/\/\*[\s\S]*?\*\//g,"").matchAll(/([^{}]+)\{([^{}]*)\}/g))if(m[1].split(',').map(s=>s.trim()).includes(selector))for(const d of m[2].split(';')){const i=d.indexOf(':');if(i>0)result[d.slice(0,i).trim()]=d.slice(i+1).trim();}return result;
}
const names:Record<string,string>={"--serif":"--tcrn-type-family-heading","--sans":"--tcrn-type-family-ui","--mono":"--tcrn-type-family-mono","--ink":"--tcrn-color-ink","--ink-2":"--tcrn-color-ink-2","--ink-3":"--tcrn-color-ink-3","--acc":"--tcrn-color-acc","--acc-2":"--tcrn-color-acc-2","--acc-bg":"--tcrn-color-acc-bg","--acc-ul":"--tcrn-color-acc-ul","--focus":"--tcrn-focus-ring"};
function assertPublishedRole(raw:string,actual:string){const expected=declarations(source,raw),target=declarations(tcrnComponentCss,actual);assert.ok(Object.keys(expected).length,raw);for(const [property,value] of Object.entries(expected))assert.equal(target[property],value.replace(/var\((--[a-z0-9-]+)\)/g,(_m,n:string)=>`var(${names[n]??n})`),`${raw} ${property}`);}

test("semantic heading levels are independent from the four published visual levels",()=>{
 for(const level of [1,2,3,4] as const){const html=renderToStaticMarkup(<Heading level={level}>季度复盘 Q3</Heading>);assert.match(html,new RegExp(`^<h${level} `));assert.match(html,/title="季度复盘 Q3"/);assert.match(html,new RegExp(`tcrn-heading--${level}`));}
 const html=renderToStaticMarkup(<Heading level={1} visualLevel={2}>Roster</Heading>);assert.match(html,/^<h1 /);assert.match(html,/tcrn-heading--2/);assert.doesNotMatch(html,/tcrn-heading--1/);
 assert.match(renderToStaticMarkup(<Heading title="Explicit">Other</Heading>),/title="Explicit"/);
});
test("heading styles read the actual source CSS rather than an obsolete scale-token alias",()=>{
 for(const n of [1,2,3,4])assertPublishedRole(`.h${n}`,`.tcrn-heading--${n}`);
 assert.ok(tcrnComponentCss.includes(typographyScaleCss));
});
test("Text preserves native paragraph content and exposes only the formal role modifiers",()=>{
 assert.equal(renderToStaticMarkup(<Text>Body</Text>),'<p class="tcrn-text">Body</p>');
 assert.match(renderToStaticMarkup(<Text size="reading" tone="strong">Read</Text>),/tcrn-text--reading tcrn-text--strong/);
 assert.match(renderToStaticMarkup(<Text variant="caps">Invoice</Text>),/title="Invoice"/);
 assert.match(renderToStaticMarkup(<Text variant="numeral">128<small>seats</small></Text>),/title="128seats"/);
 for(const [raw,actual]of [['.tx','.tcrn-text'],['.tx.strong','.tcrn-text.tcrn-text--strong'],['.tx.read','.tcrn-text.tcrn-text--reading'],['.tx.meta','.tcrn-text.tcrn-text--meta'],['.tx.cap','.tcrn-text.tcrn-text--caption'],['.num','.tcrn-text.tcrn-text--numeral'],['.num.inl','.tcrn-text.tcrn-text--numeral.tcrn-text--numeral-inline'],['.num.big','.tcrn-text.tcrn-text--numeral.tcrn-text--numeral-large'],['.caps','.tcrn-text.tcrn-text--caps'],['.id','.tcrn-text--mono']])assertPublishedRole(raw,actual);
 // Published K5 prose and the unchanged CSS both specify ink/600.
 assert.equal(declarations(source,'.tx.strong').color,'var(--ink)');assert.equal(declarations(source,'.tx').color,'var(--ink-2)');
});
test("Highlight changes only the source wash decoration and preserves every text match",()=>{
 const html=renderToStaticMarkup(<Highlight text="Quarter Q3 q3" query="q3"/>);assert.equal((html.match(/<mark /g)??[]).length,2);assert.match(html,/>Q3<\/mark>/);assert.match(html,/>q3<\/mark>/);
 assert.doesNotMatch(renderToStaticMarkup(<Highlight text="Quarter" query=" "/>),/<mark/);
 assertPublishedRole('mark.hl','mark.tcrn-highlight__mark');
 const role=declarations(tcrnComponentCss,'mark.tcrn-highlight__mark');assert.equal(role.font,'inherit');assert.equal(role.color,'inherit');assert.equal(role.padding,'0');assert.equal(role['letter-spacing'],'inherit');
});
test("body links use the formal accent underline and hover/focus styles, with no old quiet-text variant",()=>{
 assertPublishedRole('.lnk','.tcrn-link');assertPublishedRole('.lnk:hover','.tcrn-link:hover');assertPublishedRole('.lnk:focus-visible','.tcrn-link:focus-visible');
 assert.deepEqual(declarations(tcrnComponentCss,'.tcrn-link--quiet'),{});
});
