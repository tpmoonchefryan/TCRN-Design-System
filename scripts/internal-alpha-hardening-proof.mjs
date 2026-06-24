import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outputRoot = "docs/verification/internal-alpha";
mkdirSync(outputRoot, { recursive: true });

function readJson(name) {
  const path = join(outputRoot, name);
  if (!existsSync(path)) {
    throw new Error(`missing_receipt:${path}`);
  }
  return JSON.parse(readFileSync(path, "utf8"));
}

const receipts = {
  storyCoverage: readJson("story-coverage-manifest.json"),
  browserProof: readJson("browser-proof-summary.json"),
  a11y: readJson("a11y-axe-summary.json"),
  visualBaseline: readJson("visual-baseline-manifest.json"),
  intentionalDiff: readJson("intentional-diff-manifest.json"),
  aosServedSurfaceStandard: readJson("aos-served-surface-standard-proof.json"),
  noOverclaimScan: readJson("no-overclaim-scan.json"),
  packageContracts: readJson("package-contract-manifest.json"),
  dependencyLicense: readJson("dependency-license-summary.json")
};

const noOverclaim = {
  github_remote_created: false,
  package_published: false,
  product_adoption_claimed: false,
  product_acceptance_claimed: false,
  final_mvp_acceptance_claimed: false,
  release_readiness_claimed: false,
  owner_intent_action_executed: false,
  codex_security_completed_claimed: false,
  broad_dpc_completed_claimed: false
};

const ok = Object.values(receipts).every((receipt) => receipt.ok !== false)
  && receipts.noOverclaimScan.hits.length === 0
  && Object.values(noOverclaim).every((value) => value === false);

const proof = {
  ok,
  route: "route_tcrn_design_system_internal_alpha_hardening_proof_implementation",
  proofStatus: "repo_local_internal_alpha_evidence",
  receiptRoot: outputRoot,
  receiptFiles: [
    "story-coverage-manifest.json",
    "browser-proof-summary.json",
    "a11y-axe-summary.json",
    "manual-keyboard-checklist.md",
    "visual-baseline-manifest.json",
    "intentional-diff-manifest.json",
    "aos-served-surface-standard-proof.json",
    "aos-served-surface-standard-proof.md",
    "no-overclaim-scan.json",
    "package-contract-manifest.json",
    "dependency-license-summary.json"
  ].map((name) => join(outputRoot, name)),
  browserViewports: receipts.browserProof.viewports,
  requiredStoryCount: receipts.storyCoverage.requiredStories.length,
  screenshotCount: receipts.visualBaseline.entries.length,
  aosServedSurfaceStandardIds: receipts.aosServedSurfaceStandard.acceptedDsStandardIds,
  designSystemStandardAuthoringDisposition: receipts.aosServedSurfaceStandard.designSystemStandardAuthoringDisposition,
  designSystemVisualCertificationReadiness: receipts.aosServedSurfaceStandard.designSystemVisualCertificationReadiness,
  designSystemComponentRegistrationDisposition: receipts.aosServedSurfaceStandard.designSystemComponentRegistrationDisposition,
  axeViolationCount: receipts.a11y.violationCount,
  dependencyLicensePosture: receipts.dependencyLicense.claim,
  noOverclaim,
  dpcTriggerDisposition: {
    route_local_dpc_review_required: true,
    touchedSurfaces: [
      "packages/ui-copy-state/src/index.ts",
      "packages/ui-react/src/index.tsx",
      "scripts/internal-alpha-browser-proof.mjs",
      "scripts/no-private-input-scan.mjs",
      "scripts/package-contract-manifest.mjs"
    ]
  },
  claimBoundaries: {
    syntheticFixturesOnly: true,
    noProductRepoMutation: true,
    noPublication: true,
    noProductAdoption: true,
    noProductAcceptance: true,
    noFinalMvpAcceptance: true,
    noRemoteConfigured: true
  }
};

writeFileSync("docs/verification/internal-alpha-hardening-proof.json", `${JSON.stringify(proof, null, 2)}\n`);
writeFileSync("docs/verification/internal-alpha-hardening-proof.md", `# Internal Alpha Hardening Proof

Route: \`route_tcrn_design_system_internal_alpha_hardening_proof_implementation\`

Status: ${ok ? "passed" : "failed"}

## Receipts

${proof.receiptFiles.map((path) => `- \`${path}\``).join("\n")}

## Readback

- Required story count: ${proof.requiredStoryCount}
- AOS served-surface standard IDs: ${proof.aosServedSurfaceStandardIds.map((id) => `\`${id}\``).join(", ")}
- Design System standard authoring disposition: ${proof.designSystemStandardAuthoringDisposition}
- Design System visual certification readiness: ${proof.designSystemVisualCertificationReadiness}
- Component registration disposition: ${proof.designSystemComponentRegistrationDisposition}
- Browser viewports: ${proof.browserViewports.map((viewport) => `${viewport.name} (${viewport.width}x${viewport.height})`).join(", ")}
- Screenshot baseline entries: ${proof.screenshotCount}
- Axe violation count: ${proof.axeViolationCount}
- Dependency/license posture: ${proof.dependencyLicensePosture}
- Route-local DPC review required: true

## No-Overclaim

- GitHub remote created: false
- Package published: false
- Product adoption claimed: false
- Product acceptance claimed: false
- Final MVP acceptance claimed: false
- Release readiness claimed: false
- Owner Intent action executed: false
- Broad Codex Security completion claimed: false
- Broad DPC completion claimed: false

This is repo-local internal-alpha evidence for synthetic fixtures only. It is not product adoption, package publication, release readiness, product acceptance, or final MVP acceptance.
`);

console.log(JSON.stringify({
  ok,
  receiptRoot: outputRoot,
  requiredStoryCount: proof.requiredStoryCount,
  screenshotCount: proof.screenshotCount,
  axeViolationCount: proof.axeViolationCount,
  routeLocalDpcReviewRequired: true
}, null, 2));

if (!ok) {
  process.exit(1);
}
