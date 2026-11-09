import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/approved-site-source.mjs";
import { pathToFileURL } from "node:url";
const {tcrnComponentCss}=await import(pathToFileURL(path.join(ROOT,"packages/ui-react/dist/approved.js")).href);
const {tcrnTokenCss}=await import(pathToFileURL(path.join(ROOT,"packages/ui-tokens/dist/index.js")).href);
const file=path.join(ROOT,"apps/storybook/src/storybook.css");
// Both documents link the preserved font stylesheet as an HTTP resource. Do not
// hand it to PostCSS as a filesystem-root import when Vite consumes this CSS.
const css='/* Generated after current package compilation; published Site v2 only. Fonts are linked by the entry document. */\n'+tcrnTokenCss+"\n"+tcrnComponentCss;
if(process.argv.includes("--check")){if(!fs.existsSync(file)||fs.readFileSync(file,"utf8")!==css){console.error("Current Storybook CSS is stale");process.exitCode=1;}}else fs.writeFileSync(file,css);
