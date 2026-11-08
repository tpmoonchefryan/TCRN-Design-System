// Explicit generated output reconciliation only. Never remove docs/verification or other evidence.
import { execFileSync } from "node:child_process";
import { ROOT } from "./lib/approved-site-source.mjs";
for (const root of [
  "apps/storybook/dist",
  "apps/storybook/storybook-static",
  "apps/storybook/storybook-preview-static",
  "apps/storybook/distribution-static",
  "packages/ui-react/dist",
  "packages/ui-tokens/dist",
  "packages/ui-copy-state/dist",
]) {
  // Retire incremental metadata with its output, as the normal build helper does.
  execFileSync(process.execPath, ["scripts/prepare-output.mjs", "--root", root], { cwd: ROOT, stdio: "inherit" });
}
