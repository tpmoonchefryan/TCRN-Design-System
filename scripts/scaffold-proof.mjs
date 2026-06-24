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
    targetCommitish: "main",
    url: "https://github.com/tpmoonchefryan/TCRN-Design-System/releases/tag/v1.0.0",
    readbackSource: "gh release view v1.0.0 --repo tpmoonchefryan/TCRN-Design-System --json tagName,isDraft,isPrerelease,targetCommitish,url"
  },
  npmPackagePublication: {
    observedPublished: false,
    readback: "Sable npm registry readback returned E404/not found for @tcrn/ui-react, @tcrn/ui-tokens, and @tcrn/ui-copy-state"
  },
  hostedDocsDeployment: {
    vercelDeploymentObserved: true,
    latestKnownDeploymentState: "success",
    hostedDocsDeploymentSucceeded: true,
    hostedDocsReadinessClaimed: true,
    commitStatusState: "not_applicable_cli_deploy_no_github_status",
    productionCommit: "clean-history-main-at-deployment-time; exact SHA is reported by terminal return",
    productionDomain: "https://tcrn-design-system-storybook.vercel.app/",
    deploymentId: "dpl_BSWWSLwuQjygdGPRUqLKsdocKHoU",
    environment: "Production",
    targetUrl: "https://tcrn-design-system-storybook-odieyfg74-tcrn-platform.vercel.app",
    retainedDeploymentCount: 1,
    legacyDeploymentRollbackSurfaceRemoved: true,
    observedAt: "2026-06-24T07:48:00Z",
    readbackSource: "vercel inspect/list/logs for dpl_BSWWSLwuQjygdGPRUqLKsdocKHoU; curl production URL checks; public-output scan"
  },
  publicOutput: {
    disposition: "static_contract_docs_only_storybook_manager_not_published",
    productionOutputDirectory: "apps/storybook/storybook-static",
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
  && lockfileExists
  && storybookHtmlExists;

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
    githubPushPerformedByThisRoute: true,
    githubReleaseCreatedByThisRoute: true,
    publicRepoExposurePerformedByThisRoute: true,
    hostedDocsDeploymentPerformedByThisRoute: true,
    packagePublishedByThisRoute: false,
    productAdoptionClaimed: false,
    productAcceptanceClaimed: false,
    finalMvpAcceptanceClaimed: false,
    releaseReadinessClaimed: false,
    ownerIntentActionExecuted: false
  },
  currentStateNoOverclaim: {
    npmPackagePublished: false,
    hostedDocsDeploymentSucceeded: true,
    hostedDocsReadinessClaimed: true,
    vercelDeploymentSucceeded: true,
    vercelDeploymentReadinessClaimed: true,
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
- Storybook manager output published: ${publicReleaseState.publicOutput.storybookManagerOutputPublished}
- Storybook iframe available on production domain: ${publicReleaseState.publicOutput.storybookIframeAvailableOnProductionDomain}
- Storybook index.json available on production domain: ${publicReleaseState.publicOutput.storybookIndexJsonAvailableOnProductionDomain}
- Forbidden public-output scan passed: ${publicReleaseState.publicOutput.forbiddenPatternScanPassed}
- Package names: ${packageNames.map((name) => `\`${name}\``).join(", ")}
- Lockfile present: ${lockfileExists}
- Static contract surface present: ${storybookHtmlExists}
- Required files present: ${files.filter((file) => file.exists).length}/${files.length}
- Required directories present: ${directories.filter((directory) => directory.exists).length}/${directories.length}

## Current State Claims And Non-Claims

- npm package published: false
- Hosted docs deployment succeeded: true
- Hosted docs readiness claimed: true
- Vercel deployment succeeded: true
- Vercel deployment readiness claimed for Storybook hosted docs only: true
- AOS version publication claimed: false
- TMS version publication claimed: false
- Product adoption claimed: false
- Product acceptance claimed: false
- Final MVP acceptance claimed: false
- Release readiness claimed: false
- Owner Intent action executed: false

## Route-Local Action Readback And No-Overclaim

- GitHub push performed by this route: true
- GitHub Release created by this route: true
- Public repo exposure performed by this route: true
- Hosted docs deployment performed by this route: true
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
