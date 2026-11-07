import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/approved-site-source.mjs";

const args = process.argv.slice(2);
if (args.length !== 2 || args[0] !== "--package" || !["ui-react", "ui-tokens", "ui-copy-state"].includes(args[1])) {
  throw new Error("--package must name one of the three public packages");
}
// npm/pnpm do not inherit the workspace root license into a package archive.
fs.copyFileSync(path.join(ROOT, "LICENSE"), path.join(ROOT, "packages", args[1], "LICENSE"));
