import { build } from "esbuild";
import { writeStorybookStaticBuild } from "./build/write-static.js";
const result=await build({entryPoints:["dist/client.js"],bundle:true,minify:true,format:"esm",platform:"browser",target:"es2022",write:false,define:{"process.env.NODE_ENV":JSON.stringify("production")}});
if(result.outputFiles.length!==1)throw new Error("Unexpected documentation browser output membership");
await writeStorybookStaticBuild(result.outputFiles[0].contents);
