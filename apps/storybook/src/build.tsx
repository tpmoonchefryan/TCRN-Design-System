import { build } from "esbuild";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { writeStorybookStaticBuild } from "./build/write-static.js";

await build({
  stdin: { contents: 'export { mountStaticMultiSelect, mountStaticOverlayBoundary, mountStaticClipboardCopyButton } from "@tcrn/ui-react";', resolveDir: process.cwd(), sourcefile: "ds-static-bridges.js" },
  outfile: join(process.cwd(), "storybook-static", "ds-static-bridges.js"),
  bundle: true, minify: true, format: "esm", platform: "browser", target: "es2022"
});
writeStorybookStaticBuild();

// Print the deprecated token names the Storybook sources still use, once per build. The notice
// is informational: whatever it reports, and even if it cannot run, the build goes on.
const deprecationNotice = fileURLToPath(new URL("../../../scripts/token-deprecation-notice.mjs", import.meta.url));
if (existsSync(deprecationNotice)) {
  const notice = spawnSync(process.execPath, [deprecationNotice, "--label", "storybook", join(process.cwd(), "src"), join(process.cwd(), ".storybook")], { stdio: "inherit" });
  if (notice.error || notice.status !== 0) {
    console.warn(`token deprecation notice did not complete (${notice.error ? notice.error.message : `exit ${notice.status}`}); the build continues`);
  }
} else {
  console.warn("token deprecation notice script not found; the build continues");
}
