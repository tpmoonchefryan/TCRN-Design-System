import { App } from "./app.js";
import { approvedSource,supportedLocales,type DocsLocale } from "./approved-source.js";
export default {title:"Published standards",parameters:{layout:"fullscreen",publishedSource:approvedSource.site},tags:[]};
const of=(id:(typeof approvedSource.boards)[number]["slug"])=>({name:approvedSource.boards.find(b=>b.slug===id)!.title,parameters:{sourceBoard:id,sourceId:approvedSource.boards.find(b=>b.slug===id)!.sourceId},render:(_args:unknown,{globals}:{globals:Record<string,unknown>})=>{
 const locale=supportedLocales.includes(globals.locale as DocsLocale)?globals.locale as DocsLocale:"en";
 return <App page={id} locale={locale} entry="manager"/>;
}});
export const Tokens=of("01-tokens");
export const Typography=of("02-typography");
export const Icons=of("03-icons");
export const Brand=of("04-brand");
export const Actions=of("05-actions");
export const Inputs=of("06-inputs");
export const ShellUpper=of("07a-shell-upper");
export const ShellLower=of("07b-shell-lower");
