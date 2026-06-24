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
    readbackSource: "gh repo view tpmoonchefryan/TCRN-Design-System --json visibility,url"
  },
  githubRelease: {
    tagName: "v1.0.0",
    exists: true,
    isDraft: false,
    isPrerelease: false,
    targetCommitish: "1f98fb4e787d8ea63d753843182daac897d61a9b",
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
    commitStatusState: "success",
    productionCommit: "5384f08cf08f60e5fde086e03a62300bd3ca2b82",
    productionDomain: "https://tcrn-design-system-storybook.vercel.app/",
    deploymentId: 5177066746,
    environment: "Production",
    targetUrl: "https://tcrn-design-system-storybook-lxf6e85g7-tcrn-platform.vercel.app",
    observedAt: "2026-06-24T06:46:35Z",
    readbackSource: "gh api repos/tpmoonchefryan/TCRN-Design-System/commits/5384f08cf08f60e5fde086e03a62300bd3ca2b82/status and gh api repos/tpmoonchefryan/TCRN-Design-System/deployments/5177066746/statuses; Chrome production URL visual readback"
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
  hostedDocsConfig: "vercel_static_storybook",
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
- Hosted docs config: \`vercel_static_storybook\`
- Public repository: \`${publicReleaseState.repository.url}\`
- Public repository visibility: \`${publicReleaseState.repository.visibility}\`
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
- Vercel observed at: \`${publicReleaseState.hostedDocsDeployment.observedAt}\`
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

## Historical Route-Local No-Overclaim

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
