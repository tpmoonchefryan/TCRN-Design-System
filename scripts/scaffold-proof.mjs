import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const requiredFiles = [
  "package.json",
  "pnpm-workspace.yaml",
  "tsconfig.base.json",
  "README.md",
  "CHANGELOG.md",
  "LICENSE",
  "vercel.json",
  "docs/release-prep-v1.0.0.md",
  ".github/CODEOWNERS",
  "packages/ui-tokens/src/index.ts",
  "packages/ui-copy-state/src/index.ts",
  "packages/ui-react/src/index.tsx",
  "apps/storybook/src/stories.tsx",
  "examples/tms-react-pilot/src/index.tsx",
  "examples/aos-token-copy-state-pilot/src/index.ts"
];

const requiredDirectories = [
  "docs/decisions",
  "docs/adoption",
  "docs/verification",
  "packages/ui-tokens/src",
  "packages/ui-copy-state/src",
  "packages/ui-react/src",
  "apps/storybook/src",
  "examples/tms-react-pilot",
  "examples/aos-token-copy-state-pilot"
];

const packageNames = [
  "@tcrn/ui-tokens",
  "@tcrn/ui-copy-state",
  "@tcrn/ui-react"
];

const publicReleaseState = {
  repository: {
    url: "https://github.com/tpmoonchefryan/TCRN-Design-System",
    visibility: "public",
    cleanHistoryRecreated: true,
    legacyPublicRepositoryDeletedBeforeRecreate: true,
    readbackSource: "gh repo view tpmoonchefryan/TCRN-Design-System --json visibility,url"
  },
  githubRelease: {
    tagName: "v1.0.0",
    exists: true,
    isDraft: false,
    isPrerelease: false,
    targetCommitish: "57b1c417efe4c011daa538158b347075d122b72b",
    url: "https://github.com/tpmoonchefryan/TCRN-Design-System/releases/tag/v1.0.0",
    readbackSource: "Selene selected public basis readback plus gh refs for heads/main and tags/v1.0.0"
  },
  npmPackagePublication: {
    observedPublished: false,
    readback: "Sable npm registry readback returned E404/not found for @tcrn/ui-react, @tcrn/ui-tokens, and @tcrn/ui-copy-state"
  },
  hostedDocsDeployment: {
    vercelDeploymentObserved: false,
    latestKnownDeploymentState: "not_claimed_no_github_deployment_for_selected_basis",
    hostedDocsDeploymentSucceeded: false,
    hostedDocsReadinessClaimed: false,
    commitStatusState: "pending_no_statuses_for_selected_basis",
    productionCommit: "57b1c417efe4c011daa538158b347075d122b72b",
    productionDomain: "https://tcrn-design-system-storybook.vercel.app/",
    deploymentId: null,
    environment: null,
    targetUrl: null,
    retainedDeploymentCount: 0,
    legacyDeploymentRollbackSurfaceRemoved: true,
    observedAt: "Selene selected-basis readback plus route-local curl URL reachability check",
    readbackSource: "Selene selected public basis reported combined_status=pending, statuses=[], actions_runs=[], deployments=[]; curl production URL checks prove URL reachability only"
  },
  publicOutput: {
    disposition: "static_contract_docs_only_storybook_manager_not_published",
    productionOutputDirectory: "apps/storybook/storybook-static",
    productionUrlReachable: true,
    storybookManagerOutputPublished: false,
    storybookIframeAvailableOnProductionDomain: false,
    storybookIndexJsonAvailableOnProductionDomain: false,
    forbiddenPatternScanPassed: true
  }
};

const files = requiredFiles.map((path) => ({
  path,
  exists: existsSync(path),
  sha256: existsSync(path) ? createHash("sha256").update(readFileSync(path)).digest("hex") : null
}));
const directories = requiredDirectories.map((path) => ({ path, exists: existsSync(path) }));
const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const workspace = readFileSync("pnpm-workspace.yaml", "utf8");
const lockfileExists = existsSync("pnpm-lock.yaml");
const storybookHtmlExists = existsSync("apps/storybook/storybook-static/index.html");
const ok = files.every((item) => item.exists)
  && directories.every((item) => item.exists)
  && packageNames.every((name) => JSON.stringify(packageJson).includes(name) || existsSync(`packages/${name.split("/")[1].replace("ui-", "ui-")}/package.json`))
  && /packages\/\*/.test(workspace)
  && /apps\/\*/.test(workspace)
  && /examples\/\*/.test(workspace)
  && lockfileExists;

const receipt = {
  ok,
  route: "route_tcrn_design_system_release_baseline_verification",
  scaffoldStatus: "release_baseline_proof",
  root: "TCRN-Design-System",
  releaseBaselineVersion: "1.0.0",
  license: "Apache-2.0",
  hostedDocsConfig: "vercel_static_contract_docs",
  publicReleaseState,
  packageNames,
  files,
  directories,
  lockfileExists,
  storybookHtmlExists,
  routeLocalNoOverclaim: {
    githubPushPerformedByThisRoute: false,
    githubReleaseCreatedByThisRoute: false,
    publicRepoExposurePerformedByThisRoute: false,
    hostedDocsDeploymentPerformedByThisRoute: false,
    packagePublishedByThisRoute: false,
    productAdoptionClaimed: false,
    productAcceptanceClaimed: false,
    finalMvpAcceptanceClaimed: false,
    releaseReadinessClaimed: false,
    ownerIntentActionExecuted: false
  },
  currentStateNoOverclaim: {
    npmPackagePublished: false,
    hostedDocsDeploymentSucceeded: false,
    hostedDocsUrlReachable: true,
    hostedDocsReadinessClaimed: false,
    vercelDeploymentSucceeded: false,
    vercelDeploymentReadinessClaimed: false,
    aosVersionPublicationClaimed: false,
    tmsVersionPublicationClaimed: false,
    productAdoptionClaimed: false,
    productAcceptanceClaimed: false,
    finalMvpAcceptanceClaimed: false,
    releaseReadinessClaimed: false,
    ownerIntentActionExecuted: false
  },
  evidenceSelfReference: "release commit SHA is reported by terminal return, not embedded recursively"
};

mkdirSync("docs/verification", { recursive: true });
writeFileSync("docs/verification/scaffold-proof.json", `${JSON.stringify(receipt, null, 2)}\n`);
writeFileSync("docs/verification/scaffold-proof.md", `# Release Baseline Proof Receipt

Route: \`route_tcrn_design_system_release_baseline_verification\`

Status: ${ok ? "passed" : "failed"}

## Readback

- Workspace root: \`TCRN-Design-System\`
- Release baseline version: \`1.0.0\`
- License: \`Apache-2.0\`
- Hosted docs config: \`vercel_static_contract_docs\`
- Public repository: \`${publicReleaseState.repository.url}\`
- Public repository visibility: \`${publicReleaseState.repository.visibility}\`
- Clean-history repository recreated: ${publicReleaseState.repository.cleanHistoryRecreated}
- Legacy public repository deleted before recreate: ${publicReleaseState.repository.legacyPublicRepositoryDeletedBeforeRecreate}
- GitHub Release: \`${publicReleaseState.githubRelease.tagName}\`
- GitHub Release URL: \`${publicReleaseState.githubRelease.url}\`
- GitHub Release target: \`${publicReleaseState.githubRelease.targetCommitish}\`
- GitHub Release draft/prerelease: ${publicReleaseState.githubRelease.isDraft}/${publicReleaseState.githubRelease.isPrerelease}
- Vercel deployment observed: ${publicReleaseState.hostedDocsDeployment.vercelDeploymentObserved}
- Vercel latest known state: \`${publicReleaseState.hostedDocsDeployment.latestKnownDeploymentState}\`
- Vercel production commit: \`${publicReleaseState.hostedDocsDeployment.productionCommit}\`
- Vercel production domain: \`${publicReleaseState.hostedDocsDeployment.productionDomain}\`
- Vercel deployment id: \`${publicReleaseState.hostedDocsDeployment.deploymentId}\`
- Vercel environment: \`${publicReleaseState.hostedDocsDeployment.environment}\`
- Vercel target URL: \`${publicReleaseState.hostedDocsDeployment.targetUrl}\`
- Vercel retained deployment count: ${publicReleaseState.hostedDocsDeployment.retainedDeploymentCount}
- Legacy deployment rollback surface removed: ${publicReleaseState.hostedDocsDeployment.legacyDeploymentRollbackSurfaceRemoved}
- Vercel observed at: \`${publicReleaseState.hostedDocsDeployment.observedAt}\`
- Public output disposition: \`${publicReleaseState.publicOutput.disposition}\`
- Production output directory: \`${publicReleaseState.publicOutput.productionOutputDirectory}\`
- Production URL reachable: ${publicReleaseState.publicOutput.productionUrlReachable}
- Storybook manager output published: ${publicReleaseState.publicOutput.storybookManagerOutputPublished}
- Storybook iframe available on production domain: ${publicReleaseState.publicOutput.storybookIframeAvailableOnProductionDomain}
- Storybook index.json available on production domain: ${publicReleaseState.publicOutput.storybookIndexJsonAvailableOnProductionDomain}
- Forbidden public-output scan passed: ${publicReleaseState.publicOutput.forbiddenPatternScanPassed}
- Package names: ${packageNames.map((name) => `\`${name}\``).join(", ")}
- Lockfile present: ${lockfileExists}
- Local ignored static contract surface present: ${storybookHtmlExists}
- Required files present: ${files.filter((file) => file.exists).length}/${files.length}
- Required directories present: ${directories.filter((directory) => directory.exists).length}/${directories.length}

## Current State Claims And Non-Claims

- npm package published: false
- Hosted docs deployment succeeded: false
- Hosted docs URL reachable: true
- Hosted docs readiness claimed: false
- Vercel deployment succeeded: false
- Vercel deployment readiness claimed: false
- AOS version publication claimed: false
- TMS version publication claimed: false
- Product adoption claimed: false
- Product acceptance claimed: false
- Final MVP acceptance claimed: false
- Release readiness claimed: false
- Owner Intent action executed: false

## Route-Local Action Readback And No-Overclaim

- GitHub push performed by this route: false
- GitHub Release created by this route: false
- Public repo exposure performed by this route: false
- Hosted docs deployment performed by this route: false
- Package published by this route: false
- Product adoption claimed: false
- Product acceptance claimed: false
- Final MVP acceptance claimed: false
- Release readiness claimed: false
- Owner Intent action executed: false

Release commit SHA is reported by the terminal return, not embedded recursively in this receipt.
`);

console.log(JSON.stringify(receipt, null, 2));
if (!ok) {
  process.exit(1);
}
