import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { ROOT,readApprovedSource,extractFontFaces } from "../scripts/lib/approved-site-source.mjs";
test("V5 formal font membership includes original face weights and Unicode ranges",()=>{const faces=extractFontFaces(readApprovedSource());assert.equal(new Set(faces.map(f=>f.file)).size,222);assert.equal(faces.length,545);assert.deepEqual([...new Set(faces.map(f=>f.family))].sort(),["Hanken Grotesk","IBM Plex Mono","Noto Sans SC","Noto Serif SC","Source Serif 4"].sort());assert.ok(faces.every(f=>f.unicodeRange&&f.weight&&f.sha256.length===64&&f.bytes>0));assert.deepEqual([...new Set(faces.filter(f=>f.family==="Hanken Grotesk").map(f=>f.weight))].sort(),["400","500","600"]);});
test("V5 a same-family filename with changed font bytes is rejected independently of candidate metadata",()=>{const source=readApprovedSource(),f=source.manifest.fontFiles[0],target=path.join(source.base,f.sourcePath);assert.throws(()=>readApprovedSource(ROOT,{readFile:(p,encoding)=>{const bytes=fs.readFileSync(p,encoding);if(p!==target)return bytes;const changed=Buffer.from(bytes);changed[changed.length-1]^=1;return changed;}}),/Published font bytes changed/);});
