import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outputRoot = "docs/verification/internal-alpha";
mkdirSync(outputRoot, { recursive: true });

const route = "route_tcrn_design_system_aos_served_surface_visual_standard_component_registration_authoring_after_f728e9c";
const sourcePaths = [
  "packages/ui-react/src/index.tsx",
  "packages/ui-react/src/index.test.tsx",
  "apps/storybook/src/stories.tsx",
  "apps/storybook/src/patterns.stories.tsx",
  "apps/storybook/src/build.tsx",
  "apps/storybook/src/smoke.test.ts",
  "scripts/internal-alpha-browser-proof.mjs",
  "scripts/package-contract-manifest.mjs"
];

const requiredStandards = [
  {
    standardId: "ds-aos-operations-cockpit-v1",
    storyId: "aos-operations-cockpit-standard",
    storybookId: "tcrn-design-system-patterns--aos-operations-cockpit-standard",
    surface: "operations-cockpit"
  },
  {
    standardId: "ds-aos-docs-readiness-v1",
    storyId: "aos-docs-readiness-standard",
    storybookId: "tcrn-design-system-patterns--aos-docs-readiness-standard",
    surface: "docs-search-release-readiness"
  },
  {
    standardId: "ds-aos-target-set-v1",
    storyId: "aos-product-design-target-set-standard",
    storybookId: "tcrn-design-system-patterns--aos-product-design-target-set-standard",
    surface: "aos-wide-product-design"
  }
];

const requiredPackageComponents = [
  "Surface",
  "SideNav",
  "NavGroup",
  "NavItem",
  "TopBar",
  "Field",
  "Input",
  "Textarea",
  "Select",
  "Button",
  "Badge",
  "StatusBadge",
  "GateReadinessPanel",
  "EvidenceStrip",
  "ReadbackPanel",
  "Text",
  "Heading",
  "KeyValueList",
  "WorkIndex",
  "TableShell",
  "SearchInput",
  "FilterBar",
  "StateView",
  "DetailDrawer"
];

const exceptionRecords = [
  {
    id: "aos-brand-lockup-product-specific",
    disposition: "product_specific_exception",
    scope: "AOS product suffix and brand treatment only",
    broadVisualSystemException: false
  },
  {
    id: "aos-data-semantics-product-owned",
    disposition: "product_specific_exception",
    scope: "AOS service/read-model data semantics only",
    broadVisualSystemException: false
  }
];

function read(path) {
  if (!existsSync(path)) {
    throw new Error(`missing_source:${path}`);
  }
  return readFileSync(path, "utf8");
}

function sha256(body) {
  return createHash("sha256").update(body).digest("hex");
}

function collectMatches(path, body, pattern) {
  const matches = [];
  let match;
  while ((match = pattern.exec(body)) !== null) {
    matches.push({ file: path, match: match[0] });
    if (match[0].length === 0) {
      pattern.lastIndex += 1;
    }
  }
  return matches;
}

const sources = Object.fromEntries(sourcePaths.map((path) => [path, read(path)]));
const sourceReadback = sourcePaths.map((path) => ({
  path,
  sha256: sha256(sources[path]),
  bytes: Buffer.byteLength(sources[path], "utf8")
}));
const storySource = sources["apps/storybook/src/stories.tsx"];
const patternsSource = sources["apps/storybook/src/patterns.stories.tsx"];
const browserProofSource = sources["scripts/internal-alpha-browser-proof.mjs"];
const packageSource = sources["packages/ui-react/src/index.tsx"];
const packageContractSource = sources["scripts/package-contract-manifest.mjs"];

const standardReadback = requiredStandards.map((standard) => ({
  ...standard,
  storyRegistered: storySource.includes(`id: "${standard.storyId}"`),
  visualStandardMarkerPresent: storySource.includes(`data-aos-visual-standard-id="${standard.standardId}"`),
  servedSurfaceMarkerPresent: storySource.includes(`data-aos-served-surface-standard="${standard.surface}"`),
  patternsExportPresent: patternsSource.includes(`renderContractStory("${standard.storyId}")`),
  browserProofRequired: browserProofSource.includes(`id: "${standard.storyId}"`) && browserProofSource.includes(`storybookId: "${standard.storybookId}"`),
  localeMetadataPresent: sources["apps/storybook/src/build.tsx"].includes(`story.${standard.storyId}.title`)
}));

const componentCoverage = requiredPackageComponents.map((component) => ({
  component,
  publicMetadataPresent: packageSource.includes(`"${component}"`) && packageContractSource.includes(`"${component}"`),
  storybookStandardReferences: storySource.includes(component)
}));

const disabledReasonStandard = {
  navItem: storySource.includes("NavItem") && storySource.includes("data-disabled-reason") && packageSource.includes("NavItemProps") && packageSource.includes("disabledReason?: string"),
  actionControls: storySource.includes("Button, IconButton, LinkButton") && packageSource.includes("ButtonProps") && packageSource.includes("IconButtonProps") && packageSource.includes("LinkButtonProps"),
  formControls: storySource.includes("Input, Textarea, Select, SearchInput, Checkbox")
    && packageSource.includes("export interface InputProps")
    && packageSource.includes("export interface TextareaProps")
    && packageSource.includes("export interface SelectProps")
    && packageSource.includes("data-disabled-reason={normalizedReason}"),
  srOnlyReasonText: packageSource.includes("className=\"tcrn-sr-only\"")
};

const exceptionReadback = exceptionRecords.map((record) => ({
  ...record,
  recordedInStorySource: storySource.includes(record.id),
  brandPrototypeBoundaryPresent: record.id === "aos-brand-lockup-product-specific"
    ? storySource.includes("TcrnBrandMark, ProductLockup, and ShellBrandLockup remain Storybook-only prototypes")
    : true
}));

const allBodies = Object.entries(sources);
const deepImportHits = allBodies.flatMap(([path, body]) => [
  ...collectMatches(path, body, /from\s+["']@tcrn\/(?:ui-react|ui-tokens|ui-copy-state)\/[^"']+["']/g),
  ...collectMatches(path, body, /from\s+["'][^"']*(?:packages\/ui-react|packages\/ui-tokens|packages\/ui-copy-state)[^"']*["']/g)
]);
const productSourceImportHits = allBodies.flatMap(([path, body]) => collectMatches(path, body, /from\s+["'][^"']*(?:TCRN-AOS|TCRN-TMS|apps\/web)[^"']*["']/g));
const copiedSourceHits = allBodies.flatMap(([path, body]) => collectMatches(path, body, /TCRN-AOS\/apps\/web|aos\.cockpit\.service_read_model\.v1|owner-visible-vm-preview/g));
const untrackedStylesheetHits = allBodies.flatMap(([path, body]) => collectMatches(path, body, /packages\/ui-react\/src\/styles\.css|ui-react\/src\/styles\.css/g));
const broadExceptionHits = collectMatches("apps/storybook/src/stories.tsx", storySource, /broad exception|whole AOS shell|whole AOS visual system/gi);
const userVisibleBodies = allBodies.filter(([path]) => !path.endsWith(".test.ts") && !path.endsWith(".test.tsx"));
const forbiddenClaimHits = userVisibleBodies.flatMap(([path, body]) => collectMatches(path, body, /\b(product accepted|final mvp accepted|release ready|deployment ready|public ready|legal complete|dependency clean|live dispatch enabled)\b/gi));

const failures = [
  ...standardReadback.flatMap((standard) => Object.entries({
    storyRegistered: standard.storyRegistered,
    visualStandardMarkerPresent: standard.visualStandardMarkerPresent,
    servedSurfaceMarkerPresent: standard.servedSurfaceMarkerPresent,
    patternsExportPresent: standard.patternsExportPresent,
    browserProofRequired: standard.browserProofRequired,
    localeMetadataPresent: standard.localeMetadataPresent
  }).filter(([, ok]) => !ok).map(([field]) => `standard_${standard.storyId}_${field}_missing`)),
  ...componentCoverage.filter((entry) => !entry.publicMetadataPresent || !entry.storybookStandardReferences).map((entry) => `component_${entry.component}_coverage_missing`),
  ...Object.entries(disabledReasonStandard).filter(([, ok]) => !ok).map(([field]) => `disabled_reason_${field}_missing`),
  ...exceptionReadback.filter((entry) => !entry.recordedInStorySource || !entry.brandPrototypeBoundaryPresent).map((entry) => `exception_${entry.id}_missing`),
  ...deepImportHits.map((hit) => `deep_import_hit:${hit.file}:${hit.match}`),
  ...productSourceImportHits.map((hit) => `product_source_import_hit:${hit.file}:${hit.match}`),
  ...copiedSourceHits.map((hit) => `copied_product_source_hit:${hit.file}:${hit.match}`),
  ...untrackedStylesheetHits.map((hit) => `untracked_stylesheet_reference:${hit.file}:${hit.match}`),
  ...broadExceptionHits.map((hit) => `broad_exception_hit:${hit.file}:${hit.match}`),
  ...forbiddenClaimHits.map((hit) => `forbidden_claim_hit:${hit.file}:${hit.match}`)
];

const ok = failures.length === 0;
const proof = {
  ok,
  route,
  designSystemStandardAuthoringDisposition: ok ? "completed" : "blocked",
  designSystemVisualCertificationReadiness: ok ? "ready_for_elara_review" : "blocked",
  designSystemComponentRegistrationDisposition: ok ? "registered_or_exception_recorded" : "blocked",
  acceptedDsStandardIds: requiredStandards.map((standard) => standard.standardId),
  standardReadback,
  componentCoverage,
  disabledReasonStandard,
  exceptionReadback,
  noOverclaim: {
    deepImportHits,
    productSourceImportHits,
    copiedSourceHits,
    untrackedStylesheetHits,
    broadExceptionHits,
    forbiddenClaimHits,
    packagePublicationClaimed: false,
    productAdoptionClaimed: false,
    productAcceptanceClaimed: false,
    finalMvpAcceptanceClaimed: false,
    releaseReadinessClaimed: false,
    ownerIntentActionExecuted: false,
    liveDispatchExecuted: false
  },
  visualBaselineExpectation: {
    browserProofMustIncludeStandards: true,
    requiredStorybookIds: requiredStandards.map((standard) => standard.storybookId),
    outputRoot
  },
  sourceReadback,
  failures
};

writeFileSync(join(outputRoot, "aos-served-surface-standard-proof.json"), `${JSON.stringify(proof, null, 2)}\n`);
writeFileSync(join(outputRoot, "aos-served-surface-standard-proof.md"), `# AOS Served-Surface Standard Proof

Route: \`${route}\`

Status: ${ok ? "passed" : "failed"}

## Standards

${standardReadback.map((standard) => `- \`${standard.standardId}\` / \`${standard.storyId}\`: story=${standard.storyRegistered}, marker=${standard.visualStandardMarkerPresent}, visual-proof-required=${standard.browserProofRequired}`).join("\n")}

## Component Registration

${componentCoverage.map((entry) => `- \`${entry.component}\`: public metadata=${entry.publicMetadataPresent}, standard reference=${entry.storybookStandardReferences}`).join("\n")}

## Exception Records

${exceptionReadback.map((entry) => `- \`${entry.id}\`: ${entry.disposition}; broad visual-system exception=${entry.broadVisualSystemException}; recorded=${entry.recordedInStorySource}`).join("\n")}

## No-Overclaim

- Deep imports: ${deepImportHits.length}
- Product source imports: ${productSourceImportHits.length}
- Copied product source markers: ${copiedSourceHits.length}
- Untracked stylesheet references: ${untrackedStylesheetHits.length}
- Broad exception hits: ${broadExceptionHits.length}
- Forbidden claim hits: ${forbiddenClaimHits.length}
- Package publication claimed: false
- Product adoption claimed: false
- Product acceptance claimed: false
- Final MVP acceptance claimed: false
- Release readiness claimed: false
- Owner Intent action executed: false
- Live dispatch executed: false

This receipt defines Design System standards and narrow exception records for synthetic AOS served-surface examples. It is not AOS consumer adoption, package publication, product acceptance, final MVP acceptance, release readiness, Owner Intent, live dispatch, or parent-goal completion.
`);

console.log(JSON.stringify({
  ok,
  standards: requiredStandards.length,
  components: componentCoverage.length,
  exceptionRecords: exceptionReadback.length,
  failures
}, null, 2));

if (!ok) {
  process.exit(1);
}
