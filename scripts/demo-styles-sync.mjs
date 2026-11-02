import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/approved-site-source.mjs";
import { pathToFileURL } from "node:url";
const {tcrnComponentCss}=await import(pathToFileURL(path.join(ROOT,"packages/ui-react/dist/approved.js")).href);
const {tcrnTokenCss}=await import(pathToFileURL(path.join(ROOT,"packages/ui-tokens/dist/index.js")).href);
const file=path.join(ROOT,"apps/storybook/src/storybook.css");
const css='/* Generated after current package compilation; published Site v1 only. */\n@import url("/fonts/fonts.css");\n'+tcrnTokenCss+"\n"+tcrnComponentCss;
if(process.argv.includes("--check")){if(!fs.existsSync(file)||fs.readFileSync(file,"utf8")!==css){console.error("Current Storybook CSS is stale");process.exitCode=1;}}else fs.writeFileSync(file,css);
