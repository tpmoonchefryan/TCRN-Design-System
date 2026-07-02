import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { findForbiddenPositiveClaimHits } from "@tcrn/ui-copy-state";
import { contractStories, contractStoryGroups } from "../stories.js";
import { aiConsumptionContract } from "./ai-consumption-contract.js";
import { groupFileName } from "./navigation.js";
import { pageHtml } from "./page-template.js";

function stableJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function llmsReadbackFields(contract: typeof aiConsumptionContract): string {
  const fields = contract.requiredReadbackFields;
  if (!fields.includes("coveredStorybookSections")) {
    return fields.join(", ");
  }
  return [
    ...fields.filter((field) => field !== "coveredStorybookSections"),
    "coveredStorybookSections"
  ].join(", ");
}

function llmsTxt(contract: typeof aiConsumptionContract & { contractPayloadDigest: string }): string {
  const sectionChecklist = contract.requiredStorybookSectionChecklist.map((section) =>
    `- ${section.section} (${section.route}): ${section.requiredStories.join(", ")} | checks: ${section.consumerChecks.join("; ")}`
  ).join("\n");
  const sectionCoverage = contract.coveredStorybookSections.map((section) =>
    `- ${section.section}: ${section.categories.map((category) => `${category.label} [${category.storyIds.join(", ")}]`).join("; ")}`
  ).join("\n");
  const foundationStandards = contract.foundationVisualStandardCategories.map((standard) =>
    `- ${standard.id}: ${standard.label}; authority=${standard.authorityLevel}; routes=${standard.storybookRoutes.join(", ")}; proof=${standard.proofExpectations.join("; ")}`
  ).join("\n");

  return `TCRN Design System AI first-read entry

Agents must read ai-consumption-contract.json before implementation work.

Contract artifact: ${contract.artifact}
Contract route: ${contract.route}
Contract version: ${contract.contractVersion}
Contract payload digest: ${contract.contractPayloadDigest}
First-read routes: ${contract.firstReadRoutes.join(", ")}
Required readback fields: ${llmsReadbackFields(contract)}
Required proof: ${contract.requiredProof.join(", ")}
Required Storybook sections:
${sectionChecklist}
Covered Storybook section/category/story hierarchy:
${sectionCoverage}
Changelog governance: ${contract.changelogGovernance.storybookStory}; records require ${contract.changelogGovernance.requiredFields.join(", ")}; digest proof: ${contract.changelogGovernance.digestAlignmentProof}
Work Management authority: ${contract.workManagementStaticAuthority.disposition}; stories: ${contract.workManagementStaticAuthority.componentStory}, ${contract.workManagementStaticAuthority.patternStory}; boundary: ${contract.workManagementStaticAuthority.noOverclaimBoundary}
Foundation visual standards: ${contract.foundationVisualStandards.registryId}; route: ${contract.foundationVisualStandards.storybookRoute}; categories: ${contract.foundationVisualStandards.categoryIds.join(", ")}
Foundation visual standard category details:
${foundationStandards}
Consumer visual style contract: ${contract.consumerVisualStyleContract.id}; allowed inputs: ${contract.consumerVisualStyleContract.allowedConsumerInputs.join(", ")}; forbidden overrides: ${contract.consumerVisualStyleContract.forbiddenConsumerOverrides.join(", ")}
ProductShell visual oracle: ${contract.productShellVisualOracle.id}; baseline: ${contract.productShellVisualOracle.baselineManifest}#sourceHead=${contract.productShellVisualOracle.sourceHead}; search rest ${contract.productShellVisualOracle.shellMetrics.searchRestWidthPx}px; theme radius ${contract.productShellVisualOracle.shellMetrics.themeToggleRadiusPx}px
Visual equivalence levels: ${contract.visualEquivalenceLevels.join(" -> ")}
Visual parity proof: ${contract.storybookVisualParityProof}
Shell control visual parity proof: ${Array.from(contract.shellControlVisualParityProof.measuredControls).join(", ")} controls; ${Array.from(contract.shellControlVisualParityProof.computedStyleFields).join(", ")} computed style fields; ${Array.from(contract.shellControlVisualParityProof.motionFields).join(", ")} motion fields; reduced motion: ${contract.shellControlVisualParityProof.reducedMotionExpectation}
No-overclaim boundaries: ${contract.noOverclaimBoundaries.join(", ")}

This file points to the local/static Storybook contract only. Package publication, Storybook/docs publication, product adoption, release readiness, acceptance-state movement, and Owner Intent live dispatch are not claimed here.
`;
}

function robotsTxt(contract: typeof aiConsumptionContract & { contractPayloadDigest: string }): string {
  return `User-agent: *
Allow: /

# TCRN AI consumption contract pointer for first-read agents.
# AI-Consumption-Contract: ${contract.artifact}
# AI-Consumption-Contract-Route: ${contract.route}
# AI-Consumption-Contract-Required: must-read-first
# AI-Consumption-Contract-Digest: ${contract.contractPayloadDigest}
# This robots.txt pointer does not claim package publication, Storybook/docs publication, product adoption, release readiness, or acceptance-state movement.
`;
}

export function writeStorybookStaticBuild(): void {
  const outDir = join(process.cwd(), "storybook-static");
  mkdirSync(outDir, { recursive: true });
  const writtenFiles: string[] = [];
  copyFileSync(join(process.cwd(), "assets", "tcrn-brand-mark.svg"), join(outDir, "tcrn-brand-mark.svg"));
  writtenFiles.push("tcrn-brand-mark.svg");
  const contractPayloadDigest = sha256(stableJson(aiConsumptionContract));
  const aiConsumptionContractWithDigest = {
    ...aiConsumptionContract,
    contractPayloadDigest
  };
  writeFileSync(join(outDir, "ai-consumption-contract.json"), stableJson(aiConsumptionContractWithDigest));
  writtenFiles.push("ai-consumption-contract.json");
  writeFileSync(join(outDir, "llms.txt"), llmsTxt(aiConsumptionContractWithDigest));
  writtenFiles.push("llms.txt");
  writeFileSync(join(outDir, "robots.txt"), robotsTxt(aiConsumptionContractWithDigest));
  writtenFiles.push("robots.txt");
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
