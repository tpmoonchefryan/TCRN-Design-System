// Explicit generated output reconciliation only. Never remove docs/verification or other evidence.
import path from "node:path";
import { ROOT } from "./lib/approved-site-source.mjs";
import { reconcileOutput } from "./lib/generated-output.mjs";
for(const rel of ["apps/storybook/dist","apps/storybook/storybook-static","apps/storybook/storybook-preview-static","packages/ui-react/dist","packages/ui-tokens/dist","packages/ui-copy-state/dist"])reconcileOutput(path.join(ROOT,rel),[]);
