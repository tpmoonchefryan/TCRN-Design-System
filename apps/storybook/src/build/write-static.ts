import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { findForbiddenPositiveClaimHits } from "@tcrn/ui-copy-state";
import { contractStories, contractStoryGroups } from "../stories.js";
import { aiConsumptionContract } from "./ai-consumption-contract.js";
import { groupFileName } from "./navigation.js";
import { pageHtml } from "./page-template.js";

export function writeStorybookStaticBuild(): void {
  const outDir = join(process.cwd(), "storybook-static");
  mkdirSync(outDir, { recursive: true });
  const writtenFiles: string[] = [];
  copyFileSync(join(process.cwd(), "assets", "tcrn-brand-mark.svg"), join(outDir, "tcrn-brand-mark.svg"));
  writtenFiles.push("tcrn-brand-mark.svg");
  writeFileSync(join(outDir, "ai-consumption-contract.json"), `${JSON.stringify(aiConsumptionContract, null, 2)}\n`);
  writtenFiles.push("ai-consumption-contract.json");
  for (const group of contractStoryGroups) {
    const html = pageHtml(group);
    const hits = findForbiddenPositiveClaimHits(html);
    if (hits.length > 0) {
      throw new Error(`storybook_forbidden_positive_claims:${group}:${hits.join(",")}`);
    }
    const fileName = groupFileName(group);
    writeFileSync(join(outDir, fileName), html);
    writtenFiles.push(fileName);
  }
  console.log(JSON.stringify({ ok: true, stories: contractStories.length, pages: writtenFiles, forbiddenHits: [], outDir }, null, 2));
}
