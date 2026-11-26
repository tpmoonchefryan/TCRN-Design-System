import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/approved-site-source.mjs";

const output = path.join(ROOT, "apps/storybook/distribution-static");
const version = JSON.parse(fs.readFileSync(path.join(ROOT, "packages/ui-react/package.json"), "utf8")).version;

const headers = [
  "/*",
  "  X-Content-Type-Options: nosniff",
  "  Referrer-Policy: strict-origin-when-cross-origin",
  "  X-Frame-Options: SAMEORIGIN",
  "",
  "/design-authority.json",
  "  Access-Control-Allow-Origin: *",
  "  Cache-Control: no-cache",
  "",
  "/distribution-manifest.json",
  "  Cache-Control: no-cache",
  "",
  "/ai/index.json",
  "  Cache-Control: no-cache",
  "",
  `/ai/${version}/index.json`,
  "  Cache-Control: no-cache",
  ""
].join("\n");

fs.writeFileSync(path.join(output, "_headers"), headers, "utf8");
console.log(JSON.stringify({ ok: true, file: "apps/storybook/distribution-static/_headers", version }));
