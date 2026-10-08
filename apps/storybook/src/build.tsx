import { build } from "esbuild";
import { join } from "node:path";
import { writeStorybookStaticBuild } from "./build/write-static.js";

await build({
  stdin: { contents: 'export { mountStaticMultiSelect, mountStaticOverlayBoundary, mountStaticClipboardCopyButton } from "@tcrn/ui-react";', resolveDir: process.cwd(), sourcefile: "ds-static-bridges.js" },
  outfile: join(process.cwd(), "storybook-static", "ds-static-bridges.js"),
  bundle: true, minify: true, format: "esm", platform: "browser", target: "es2022"
});
writeStorybookStaticBuild();
