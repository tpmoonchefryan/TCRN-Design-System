import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { findForbiddenPositiveClaimHits } from "@tcrn/ui-copy-state";
import { contractStories } from "../stories.js";
import { aiConsumptionContract } from "./ai-consumption-contract.js";
import { DESIGN_AUTHORITY_ARTIFACT, designAuthorityContract } from "./design-authority.js";
import { contractPages } from "./navigation.js";
import { pageHtml } from "./page-template.js";

function stableJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256(value: string | Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}

// TCRN-DS-SUB-007 (121-GWT1, 121-GWT5): the static docs render with the faces
// @tcrn/ui-tokens vendors and never ask a font CDN for anything. Each face listed in the
// package manifest is copied byte-identical into storybook-static/fonts/, the package
// stylesheet is written once beside the pages with every url("./<face>") rewritten to
// url("fonts/<face>"), and every page links that stylesheet. Copies keep their names and
// bytes, and nothing is inlined as a data: URI (fonts-proof checks both). The OFL text of
// each family travels with its faces into storybook-static/licenses/.
export const STATIC_FONT_DIR = "fonts";
export const STATIC_FONT_LICENSE_DIR = "licenses";
export const STATIC_FONT_STYLESHEET = "tcrn-fonts.css";
export const STATIC_FONT_SOURCE = "@tcrn/ui-tokens/fonts.css";
const STATIC_FONT_LINK = `<link rel="stylesheet" href="${STATIC_FONT_STYLESHEET}" data-tcrn-font-source="${STATIC_FONT_SOURCE}" />`;
const FONT_URL = /url\((["']?)\.\/([A-Za-z0-9._-]+\.woff2)\1\)/g;
const REWRITTEN_FONT_URL = /^url\("fonts\/([A-Za-z0-9._-]+\.woff2)"\)$/;

interface VendoredFontEntry {
  file: string;
  bytes: number;
  sha256: string;
}

interface VendoredFontManifest {
  files: VendoredFontEntry[];
  families: { family: string; license: VendoredFontEntry }[];
}

function vendoredFontDir(): string {
  return dirname(fileURLToPath(import.meta.resolve(STATIC_FONT_SOURCE)));
}

function readVendoredFontManifest(fontDir: string): VendoredFontManifest {
  const manifest = JSON.parse(readFileSync(join(fontDir, "manifest.json"), "utf8")) as Partial<VendoredFontManifest>;
  const files = manifest.files ?? [];
  const families = manifest.families ?? [];
  if (files.length === 0 || families.length === 0 || families.some((family) => !family.license?.file)) {
    throw new Error("storybook_fonts_manifest_incomplete");
  }
  return { files, families };
}

/** Copies each entry byte-identical into targetDir and removes anything else there. */
function copyVerbatim(sourceDir: string, targetDir: string, entries: readonly VendoredFontEntry[]): number {
  const names = new Map(entries.map((entry) => [basename(entry.file), entry]));
  mkdirSync(targetDir, { recursive: true });
  // The build owns this directory: a file dropped from the manifest must not linger as a
  // stale copy from an earlier build.
  for (const name of readdirSync(targetDir)) {
    if (!names.has(name)) {
      unlinkSync(join(targetDir, name));
    }
  }
  let bytes = 0;
  for (const [name, entry] of names) {
    const target = join(targetDir, name);
    copyFileSync(join(sourceDir, entry.file), target);
    const copy = readFileSync(target);
    if (copy.length !== entry.bytes || sha256(copy) !== entry.sha256) {
      throw new Error(`storybook_fonts_copy_differs:${entry.file}`);
    }
    bytes += copy.length;
  }
  return bytes;
}

/**
 * The package stylesheet with each url("./<face>.woff2") pointing at the copy under fonts/.
 * Throws when the stylesheet names a face the manifest does not list, leaves a listed face
 * undeclared, or carries a data: URI or a remote URL.
 */
export function rewriteFontStylesheet(css: string, faces: ReadonlySet<string>): string {
  const declared = new Set<string>();
  const rewritten = css.replace(FONT_URL, (_whole: string, _quote: string, file: string) => {
    if (!faces.has(file)) {
      throw new Error(`storybook_fonts_unlisted_face:${file}`);
    }
    declared.add(file);
    return `url("${STATIC_FONT_DIR}/${file}")`;
  });
  const code = rewritten.replace(/\/\*[\s\S]*?\*\//g, "");
  if (/data:/i.test(code) || /[a-z][a-z0-9+.-]*:\/\/|url\(\s*["']?\/\//i.test(code) || /googleapis|gstatic/i.test(rewritten)) {
    throw new Error("storybook_fonts_remote_or_inline_source");
  }
  for (const url of code.match(/url\([^)]*\)/g) ?? []) {
    if (!REWRITTEN_FONT_URL.test(url)) {
      throw new Error(`storybook_fonts_unrewritten_url:${url.slice(0, 80)}`);
    }
  }
  const undeclared = [...faces].filter((file) => !declared.has(file));
  if (undeclared.length > 0) {
    throw new Error(`storybook_fonts_undeclared_face:${undeclared.join(",")}`);
  }
  return `/* Static docs copy of ${STATIC_FONT_SOURCE}: every url() points at the byte-identical face under ${STATIC_FONT_DIR}/; the OFL texts are under ${STATIC_FONT_LICENSE_DIR}/. */\n${rewritten}`;
}

function writeVendoredFonts(outDir: string): { directory: string; faces: number; bytes: number; licenses: number; stylesheet: string } {
  const fontDir = vendoredFontDir();
  const manifest = readVendoredFontManifest(fontDir);
  const bytes = copyVerbatim(fontDir, join(outDir, STATIC_FONT_DIR), manifest.files);
  // Licence paths in the manifest are relative to the package root, one level above fonts/.
  const licenses = manifest.families.map((family) => family.license);
  copyVerbatim(dirname(fontDir), join(outDir, STATIC_FONT_LICENSE_DIR), licenses);
  const faces = new Set(manifest.files.map((entry) => entry.file));
  writeFileSync(join(outDir, STATIC_FONT_STYLESHEET), rewriteFontStylesheet(readFileSync(join(fontDir, "fonts.css"), "utf8"), faces));
  return { directory: STATIC_FONT_DIR, faces: faces.size, bytes, licenses: licenses.length, stylesheet: STATIC_FONT_STYLESHEET };
}

/** Links the font stylesheet once, ahead of the page title, inside the page head. */
export function linkFontStylesheet(html: string, label: string): string {
  const headEnd = html.indexOf("</head>");
  const titleAt = html.indexOf("<title>");
  if (headEnd === -1 || titleAt === -1 || titleAt > headEnd || html.includes(STATIC_FONT_LINK)) {
    throw new Error(`storybook_fonts_link_injection:${label}`);
  }
  return `${html.slice(0, titleAt)}${STATIC_FONT_LINK}\n  ${html.slice(titleAt)}`;
}

function pageLabel(page: ReturnType<typeof contractPages>[number]): string {
  return page.kind === "category"
    ? `${page.group}/${page.categoryId}`
    : page.kind === "reference"
      ? page.file
      : page.group;
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
Functional display authority: ${contract.functionalDisplayStaticAuthority.disposition}; stories: ${contract.functionalDisplayStaticAuthority.componentStory}, ${contract.functionalDisplayStaticAuthority.patternStory}; boundary: ${contract.functionalDisplayStaticAuthority.noOverclaimBoundary}
Foundation visual standards: ${contract.foundationVisualStandards.registryId}; route: ${contract.foundationVisualStandards.storybookRoute}; categories: ${contract.foundationVisualStandards.categoryIds.join(", ")}
Foundation visual standard category details:
${foundationStandards}
Consumer visual style contract: ${contract.consumerVisualStyleContract.id}; allowed inputs: ${contract.consumerVisualStyleContract.allowedConsumerInputs.join(", ")}; forbidden overrides: ${contract.consumerVisualStyleContract.forbiddenConsumerOverrides.join(", ")}
Setting control selection contract: ${contract.settingControlSelectionContract.id}; routes: ${contract.settingControlSelectionContract.storybookRoutes.join(", ")}; decisions: ${contract.settingControlSelectionContract.decisionTable.map((row) => `${row.optionCount} -> ${row.selectedControl} when ${row.condition}`).join("; ")}; state retention: ${contract.settingControlSelectionContract.stateRetention.callback}; numeric entry: ${contract.settingControlSelectionContract.numericEntry.component}; minimum: ${contract.settingControlSelectionContract.numericEntry.minimumInlineSize}
Field value selection contract: ${contract.fieldValueSelectionContract.id}; routes: ${contract.fieldValueSelectionContract.storybookRoutes.join(", ")}; decisions: ${contract.fieldValueSelectionContract.decisionTable.map((row) => `${row.cardinality}/${row.valueDomain} -> ${row.control}`).join("; ")}; domain boundary: ${contract.fieldValueSelectionContract.domainBoundary}
Dictionary content contract: ${contract.dictionaryContentContract.id}; routes: ${contract.dictionaryContentContract.storybookRoutes.join(", ")}; package exports: ${contract.dictionaryContentContract.packageExports.join(", ")}; content model: ${contract.dictionaryContentContract.contentModel.description}
Overlay boundary contract: ${contract.overlayBoundaryContract.id}; routes: ${contract.overlayBoundaryContract.storybookRoutes.join(", ")}; package exports: ${contract.overlayBoundaryContract.packageExports.join(", ")}; edge policy: ${contract.overlayBoundaryContract.geometry.edgePolicy}; static disposition: ${contract.overlayBoundaryContract.staticDisposition}
Settings layout contract: ${contract.settingsLayoutContract.id}; routes: ${contract.settingsLayoutContract.storybookRoutes.join(", ")}; container queries: ${contract.settingsLayoutContract.containerQueries.map((query) => `${query.container} ${query.thresholdPx}px`).join(", ")}; construction: ${contract.settingsLayoutContract.construction.form}
Page hierarchy contract: ${contract.pageHierarchyContract.id}; routes: ${contract.pageHierarchyContract.storybookRoutes.join(", ")}; depth rules: ${contract.pageHierarchyContract.depthDecisionTable.map((row) => `${row.depth} -> ${row.rule}`).join("; ")}; width policy: ${contract.pageHierarchyContract.widthPolicy}
Verification cadence contract: ${contract.verificationCadenceContract.id}; stages: ${contract.verificationCadenceContract.stages.map((stage) => stage.id).join(", ")}; development selection: ${contract.verificationCadenceContract.stages[0].selection}; candidate final: ${contract.verificationCadenceContract.stages[1].requiredCommands.join(", ")}; reuse validator: ${contract.verificationCadenceContract.evidenceReuse.validator}; reuse input keys: ${contract.verificationCadenceContract.evidenceReuse.inputKeys.join(", ")}; reuse invalidators: ${contract.verificationCadenceContract.evidenceReuse.invalidators.join("; ")}
Operation feedback contract: ${contract.operationFeedbackContract.id}; routes: ${contract.operationFeedbackContract.storybookRoutes.join(", ")}; phases: ${contract.operationFeedbackContract.phaseSemantics.map((phase) => `${phase.phase}=${phase.labels.en}`).join(", ")}; state contract: ${contract.operationFeedbackContract.stateContract}; short status: ${contract.operationFeedbackContract.roles.shortStatus}; details: ${contract.operationFeedbackContract.roles.details}; static construction: ${contract.operationFeedbackContract.staticConsumerMigration.markup}
Content scope contract: ${contract.contentScopeContract.id}; routes: ${contract.contentScopeContract.storybookRoutes.join(", ")}; phases: ${Object.keys(contract.contentScopeContract.phases).join(", ")}; count semantics: ${contract.contentScopeContract.countSemantics.filtered}; independent scopes: ${contract.contentScopeContract.independentScopes}; rendered evidence: ${contract.contentScopeContract.renderedContentEvidence}
Consumer evidence contract: ${contract.consumerEvidenceContract.id}; utility: ${contract.consumerEvidenceContract.utility}; expected value fields: ${contract.consumerEvidenceContract.valueEvidence.expectedFields.join(", ")}; observed value fields: ${contract.consumerEvidenceContract.valueEvidence.observedFields.join(", ")}; equality: ${contract.consumerEvidenceContract.valueEvidence.equalityRule}; serialization modes: ${contract.consumerEvidenceContract.valueEvidence.serializationModes.join(", ")}; zoom axes: ${contract.consumerEvidenceContract.zoomAxes.join(", ")}; lifecycle: ${contract.consumerEvidenceContract.lifecycleIntersection}; applicability: ${contract.consumerEvidenceContract.applicability}; negative legs: ${contract.consumerEvidenceContract.negativeLegs.join("; ")}
Consumer verification contract: ${contract.consumerVerificationContract.id}; contract version: ${contract.consumerVerificationContract.contractVersion}; script: ${contract.consumerVerificationContract.script}; browser script: ${contract.consumerVerificationContract.browserScript}; proof version: ${contract.consumerVerificationContract.proofVersion}; positive legs: ${contract.consumerVerificationContract.positiveLegs.join("; ")}; negative legs: ${contract.consumerVerificationContract.negativeLegs.join("; ")}; full-surface coverage: ${contract.consumerVerificationContract.fullSurfaceCoverage}
Storybook doc shell visual oracle: ${contract.storybookDocShellVisualOracle.id}; baseline: ${contract.storybookDocShellVisualOracle.baselineManifest}#sourceHead=${contract.storybookDocShellVisualOracle.sourceHead}; oracle recovery: ${contract.storybookDocShellVisualOracle.oracleRecoveryReceipt}; baseline classification: ${contract.storybookDocShellVisualOracle.baselineManifestClassification}; search rest ${contract.storybookDocShellVisualOracle.shellMetrics.searchRestWidthPx}px; theme radius ${contract.storybookDocShellVisualOracle.shellMetrics.themeToggleRadiusPx}px
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
  const fonts = writeVendoredFonts(outDir);
  writtenFiles.push(fonts.stylesheet);
  const contractPayloadDigest = sha256(stableJson(aiConsumptionContract));
  const aiConsumptionContractWithDigest = {
    ...aiConsumptionContract,
    contractPayloadDigest
  };
  writeFileSync(join(outDir, "ai-consumption-contract.json"), stableJson(aiConsumptionContractWithDigest));
  writtenFiles.push("ai-consumption-contract.json");
  // STORY-283: a consumer names this address as its design authority and reads the
  // version from here, so the address stays stable while the version follows the build.
  writeFileSync(join(outDir, DESIGN_AUTHORITY_ARTIFACT), stableJson(designAuthorityContract()));
  writtenFiles.push(DESIGN_AUTHORITY_ARTIFACT);
  writeFileSync(join(outDir, "llms.txt"), llmsTxt(aiConsumptionContractWithDigest));
  writtenFiles.push("llms.txt");
  writeFileSync(join(outDir, "robots.txt"), robotsTxt(aiConsumptionContractWithDigest));
  writtenFiles.push("robots.txt");
  // TCRN-DS-STORY-056: emit one bounded file per DERIVED contract page — 7 section INDEX
  // pages (nav only, no story bodies) + one CATEGORY page per non-empty category (that
  // category's story bodies). The page set is derived from the registry (navigation.contractPages),
  // never hand-listed. Each page is independently forbidden-claim scanned before write.
  for (const page of contractPages()) {
    const label = pageLabel(page);
    const html = linkFontStylesheet(pageHtml(page), label);
    const hits = findForbiddenPositiveClaimHits(html);
    if (hits.length > 0) {
      throw new Error(`storybook_forbidden_positive_claims:${label}:${hits.join(",")}`);
    }
    writeFileSync(join(outDir, page.file), html);
    writtenFiles.push(page.file);
  }
  console.log(JSON.stringify({ ok: true, stories: contractStories.length, pages: writtenFiles, fonts, forbiddenHits: [], outDir }, null, 2));
}
