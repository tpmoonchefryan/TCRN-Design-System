import { rmSync } from "node:fs";
import { readdirSync } from "node:fs";
import { join } from "node:path";

for (const path of [
  "packages/ui-tokens/dist",
  "packages/ui-copy-state/dist",
  "packages/ui-react/dist",
  "apps/storybook/dist",
  "apps/storybook/apps",
  "apps/storybook/storybook-static",
  "apps/storybook/storybook-preview-static",
  "docs/verification/internal-alpha",
  "examples/tms-react-pilot/dist",
  "examples/aos-token-copy-state-pilot/dist",
  ".tarball-smoke"
]) {
  rmSync(path, { recursive: true, force: true });
}

function removeBuildInfo(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") {
      continue;
    }
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      removeBuildInfo(path);
    } else if (entry.isFile() && entry.name.endsWith(".tsbuildinfo")) {
      rmSync(path, { force: true });
    }
  }
}

removeBuildInfo(".");

console.log(JSON.stringify({ ok: true, cleaned: true }, null, 2));
