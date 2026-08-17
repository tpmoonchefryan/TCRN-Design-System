import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const outputRoot = "docs/verification/internal-alpha";
mkdirSync(outputRoot, { recursive: true });

const packagePaths = [
  "packages/ui-tokens",
  "packages/ui-copy-state",
  "packages/ui-react"
];

const exactDependencyManifests = [
  "package.json",
  "apps/storybook/package.json",
  "packages/ui-react/package.json"
];

// TCRN-DS-INC-008 — the public surface is written once, in the package.
//
// This file used to carry its own verbatim copy of the component, utility and
// prototype names, and `packageMetadataMatchesSource` compared that copy against
// the package's own declaration. Two hand-kept lists agreeing with each other is
// not a contract check: adding four primitives meant editing three rosters
// (index.tsx, index.test.tsx, here), and NONE of the three was ever compared
// against what the package actually exports. `MobileNavToggle` had been exported
// with a public props interface and named by no roster at all.
//
// So the copies are gone. The package's own declaration is the single written
// roster — a deliberate-change tripwire, class A in the platform's gate-reference
// inventory — and what it is checked against is the real export surface, below.

const allowedLicenseGroups = new Set([
  "0BSD",
  "Apache-2.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "BlueOak-1.0.0",
  "CC-BY-4.0",
  "ISC",
  "MIT",
  "MIT-0",
  "MPL-2.0"
]);

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function walkTextSources(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return walkTextSources(path);
    }
    if (!entry.isFile() || !/\.(?:ts|tsx|js|mjs|json|md)$/.test(entry.name)) {
      return [];
    }
    return [path];
  });
}

function collectMatches(path, pattern) {
  const body = readFileSync(path, "utf8");
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

function isExactVersion(value) {
  return typeof value === "string"
    && !value.startsWith("^")
    && !value.startsWith("~")
    && !value.startsWith(">")
    && !value.startsWith("<")
    && !value.includes("x")
    && !value.includes("*");
}

const packageContracts = packagePaths.map((packagePath) => {
  const manifestPath = join(packagePath, "package.json");
  const manifest = readJson(manifestPath);
  const rootExport = manifest.exports?.["."];
  const jsPath = rootExport ? join(packagePath, rootExport.default) : "";
  const typePath = rootExport ? join(packagePath, rootExport.types) : "";
  return {
    name: manifest.name,
    private: manifest.private ?? false,
    exportMapPresent: Boolean(rootExport),
    jsPath,
    typePath,
    jsExists: jsPath ? existsSync(jsPath) : false,
    typeExists: typePath ? existsSync(typePath) : false,
    manifestSha256: sha256(manifestPath)
  };
});

const exactDependencyChecks = exactDependencyManifests.flatMap((manifestPath) => {
  const manifest = readJson(manifestPath);
  const sections = ["dependencies", "devDependencies", "peerDependencies"];
  return sections.flatMap((section) => Object.entries(manifest[section] ?? {}).map(([name, version]) => ({
    manifestPath,
    section,
    name,
    version,
    exact: section === "peerDependencies" || version.startsWith("workspace:") || isExactVersion(version)
  })));
});

const licenseRaw = execFileSync("pnpm", ["licenses", "list", "--json"], {
  cwd: process.cwd(),
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"]
});
const licenseJson = JSON.parse(licenseRaw);
const licenseSummary = Object.keys(licenseJson).sort().map((license) => ({
  license,
  packageCount: licenseJson[license].length,
  packageNames: licenseJson[license].map((entry) => entry.name).filter(Boolean).sort()
}));
const unknownLicenseGroups = licenseSummary.filter((entry) => !allowedLicenseGroups.has(entry.license)).map((entry) => entry.license);

const uiReactModule = await import(pathToFileURL(join(process.cwd(), "packages/ui-react/dist/index.js")).href);
const uiReactManifest = readJson("packages/ui-react/package.json");
const declaredComponentNames = uiReactModule.componentLibraryPublicComponentNames ?? [];
const declaredUtilityNames = uiReactModule.componentLibraryPublicUtilityNames ?? [];
const declaredPrototypeNames = uiReactModule.componentLibraryDeferredPrototypeNames ?? [];

// What the package ACTUALLY exports under a component-shaped name. This is the
// side that cannot be edited by hand, and comparing the declaration against it is
// the only version of this check that can fail for a real reason.
const actualComponentExports = Object.keys(uiReactModule)
  .filter((name) => /^[A-Z]/u.test(name))
  .filter((name) => !declaredUtilityNames.includes(name) && !declaredPrototypeNames.includes(name))
  .sort();

const publicComponentExportChecks = declaredComponentNames.map((name) => ({
  name,
  exported: Object.prototype.hasOwnProperty.call(uiReactModule, name)
}));
const publicUtilityExportChecks = declaredUtilityNames.map((name) => ({
  name,
  exported: Object.prototype.hasOwnProperty.call(uiReactModule, name)
}));
const deferredPrototypeChecks = declaredPrototypeNames.map((name) => ({
  name,
  // A deferred prototype that IS exported is the failure this entry exists to
  // catch: it would be shipped public API under a name the roster calls a
  // storybook-only sketch.
  exported: Object.prototype.hasOwnProperty.call(uiReactModule, name),
  packageBacked: false,
  disposition: "storybook_only_prototype"
}));

// Named rather than counted: "the roster and the exports disagree" costs a search,
// and a gate that costs a search is a gate people stop running.
const undeclaredComponentExports = actualComponentExports
  .filter((name) => !declaredComponentNames.includes(name));
const declaredButNotExported = [...declaredComponentNames]
  .filter((name) => !Object.prototype.hasOwnProperty.call(uiReactModule, name))
  .sort();
const exportedPrototypes = declaredPrototypeNames
  .filter((name) => Object.prototype.hasOwnProperty.call(uiReactModule, name));

const packageMetadataMatchesSource = Array.isArray(uiReactModule.componentLibraryPublicComponentNames)
  && Array.isArray(uiReactModule.componentLibraryPublicUtilityNames)
  && Array.isArray(uiReactModule.componentLibraryDeferredPrototypeNames)
  && undeclaredComponentExports.length === 0
  && declaredButNotExported.length === 0
  && exportedPrototypes.length === 0
  && declaredUtilityNames.every((name) => Object.prototype.hasOwnProperty.call(uiReactModule, name));

const storybookSources = walkTextSources("apps/storybook/src");
const storybookBodies = storybookSources.map((path) => ({ path, body: readFileSync(path, "utf8") }));
const storybookRuntimeBodies = storybookBodies.filter((source) => !source.path.endsWith(".test.ts") && !source.path.endsWith(".test.tsx"));
const uiReactReadme = readFileSync("packages/ui-react/README.md", "utf8");
const publicPackageImports = {
  uiReact: storybookBodies.some((source) => /from\s+["']@tcrn\/ui-react["']/.test(source.body)),
  uiTokens: storybookBodies.some((source) => /from\s+["']@tcrn\/ui-tokens["']/.test(source.body)),
  uiCopyState: storybookBodies.some((source) => /from\s+["']@tcrn\/ui-copy-state["']/.test(source.body))
};
const deepImportHits = storybookSources.flatMap((path) => [
  ...collectMatches(path, /from\s+["']@tcrn\/(?:ui-react|ui-tokens|ui-copy-state)\/[^"']+["']/g),
  ...collectMatches(path, /from\s+["'][^"']*(?:packages\/ui-react|packages\/ui-tokens|packages\/ui-copy-state)[^"']*["']/g)
]);
const storybookOnlyMarkers = storybookBodies.flatMap((source) => {
  const count = (source.body.match(/storybook_only|data-storybook-only/g) ?? []).length;
  return count > 0 ? [{ file: source.path, markerCount: count }] : [];
});
const storybookConsumption = {
  publicPackageImports,
  deepImportHits,
  storybookOnlyMarkers,
  packageBackedComponentParityMarkers: storybookBodies.some((source) => /data-component-library-parity="package-backed"/.test(source.body)),
  packageBackedNavigationProofVisible: storybookBodies.some((source) => /data-package-backed-navigation-proof="true"/.test(source.body)),
  noReusableInlineSourceClaim: storybookOnlyMarkers.length > 0 && deepImportHits.length === 0
};
const storybookDocShellControlContract = {
  uiReactReadmeBoundaryVisible: uiReactReadme.includes("Storybook Shell Control Boundary")
    && uiReactReadme.includes("registered package-backed product shell/effect boundary")
    && uiReactReadme.includes("`ProductShell`, `ProductShellSearch`, `ShellThemeToggle`, `ShellLocaleMenu`")
    && uiReactReadme.includes("`useProductShellController` is the public utility")
    && uiReactReadme.includes("`productShellControlProps`")
    && uiReactReadme.includes("`onSearchResultActivate`"),
  docShellMarkersVisible: storybookBodies.some((source) => /data-doc-shell=["']online-docs["']/.test(source.body))
    && storybookBodies.some((source) => /tcrn-doc-header/.test(source.body))
    && storybookBodies.some((source) => /tcrn-doc-sidebar/.test(source.body))
    && storybookBodies.some((source) => /data-doc-nav-item/.test(source.body))
    && storybookBodies.some((source) => /data-doc-nav-category-toggle/.test(source.body)),
  globalProductShellReplacementAbsent: storybookBodies.some((source) => /data-doc-shell=["']online-docs["']/.test(source.body))
    && !storybookRuntimeBodies.some((source) => /data-storybook-shell-authority=["']@tcrn\/ui-react\/ProductShell["']/.test(source.body))
    && !storybookRuntimeBodies.some((source) => /data-storybook-product-shell-skin=["']confirmed-storybook-visual-v1["']/.test(source.body)),
  themeToggleRuleVisible: uiReactReadme.includes("single icon-only circular button")
    && storybookBodies.some((source) => /data-theme-toggle=['"]true['"]|data-shell-control=['"]theme-toggle['"]/.test(source.body)),
  wholePageTransitionRuleVisible: uiReactReadme.includes("whole-page shell transition")
    && storybookBodies.some((source) => /document\.startViewTransition/.test(source.body))
    && storybookBodies.some((source) => /tcrn-doc-theme-transition-wash/.test(source.body)),
  localeSelectorRuleVisible: /globe trigger plus the current locale name in that\s+locale/.test(uiReactReadme)
    && /must not use long bilingual\s+labels/.test(uiReactReadme)
    && storybookBodies.some((source) => /data-locale-menu-toggle/.test(source.body)),
  focusSearchRuleVisible: uiReactReadme.includes("compact at rest and expand on focus")
    && /collapse on\s+blur/.test(uiReactReadme)
    && storybookBodies.some((source) => /data-doc-search-input/.test(source.body))
    && storybookBodies.some((source) => /data-search-expanded/.test(source.body)),
  aiContractToolbarBoundaryVisible: /not a primary top-bar control for human\s+readers/.test(uiReactReadme)
    && storybookBodies.some((source) => /data-ai-consumption-contract-story/.test(source.body))
    && !storybookRuntimeBodies.some((source) => /data-ai-consumption-contract-link/.test(source.body))
};
const iconLibraryContract = {
  sourcePackage: "lucide-react",
  sourcePackageLicense: "ISC",
  wrapperPackage: "@tcrn/ui-react",
  wrapperExport: "Icon",
  dependencyVersion: uiReactManifest.dependencies?.["lucide-react"] ?? null,
  dependencyExact: isExactVersion(uiReactManifest.dependencies?.["lucide-react"] ?? ""),
  iconExported: Object.prototype.hasOwnProperty.call(uiReactModule, "Icon"),
  iconNamesExported: Array.isArray(uiReactModule.tcrnIconNames),
  iconNameCount: Array.isArray(uiReactModule.tcrnIconNames) ? uiReactModule.tcrnIconNames.length : 0,
  storybookContractVisible: storybookBodies.some((source) => /data-icon-library-source="lucide-react"/.test(source.body))
    && storybookBodies.some((source) => /data-icon-library-wrapper="@tcrn\/ui-react\/Icon"/.test(source.body))
    && storybookBodies.some((source) => /data-icon-library-license="ISC"/.test(source.body))
    && storybookBodies.some((source) => /data-icon-brand-boundary="not-brand-identity"/.test(source.body)),
  storybookDirectLucideImports: storybookSources.flatMap((path) => collectMatches(path, /from\s+["']lucide-react["']/g)),
  notBrandIdentity: true,
  noPackagePublicationClaimed: true
};

const componentParityMatrix = [
  ...publicComponentExportChecks.map((item) => ({
    storybookItem: item.name,
    classification: "reusable_component",
    packageSourcePath: "packages/ui-react/src/index.tsx",
    publicExportPath: "@tcrn/ui-react",
    storybookPath: "apps/storybook/src/stories.tsx",
    status: item.exported ? "package_backed_storybook_consumed" : "missing_public_export",
    requiredRepair: item.exported ? "none" : "add_package_source_and_public_export"
  })),
  ...publicUtilityExportChecks.map((item) => ({
    storybookItem: item.name,
    classification: "public_utility_readback",
    packageSourcePath: "packages/ui-react/src/index.tsx",
    publicExportPath: "@tcrn/ui-react",
    storybookPath: "apps/storybook/src/stories.tsx",
    status: item.exported ? "package_backed_storybook_consumed" : "missing_public_export",
    requiredRepair: item.exported ? "none" : "add_package_source_and_public_export"
  })),
  ...deferredPrototypeChecks.map((item) => ({
    storybookItem: item.name,
    classification: "storybook_only_prototype",
    packageSourcePath: null,
    publicExportPath: null,
    storybookPath: "apps/storybook/src/stories.tsx",
    status: item.exported ? "blocked_exported_prototype" : "truthfully_deferred",
    requiredRepair: item.exported ? "remove_public_export_or_promote_to_component" : "none"
  }))
];

const packageContractManifest = {
  ok: packageContracts.every((item) => item.exportMapPresent && item.jsExists && item.typeExists)
    && exactDependencyChecks.every((item) => item.exact)
    && unknownLicenseGroups.length === 0
    && publicComponentExportChecks.every((item) => item.exported)
    && publicUtilityExportChecks.every((item) => item.exported)
    && deferredPrototypeChecks.every((item) => !item.exported && item.disposition === "storybook_only_prototype")
    && packageMetadataMatchesSource
    && Object.values(publicPackageImports).every(Boolean)
    && deepImportHits.length === 0
    && storybookConsumption.packageBackedComponentParityMarkers
    && storybookConsumption.packageBackedNavigationProofVisible
    && storybookConsumption.noReusableInlineSourceClaim
    && Object.values(storybookDocShellControlContract).every(Boolean)
    && iconLibraryContract.dependencyExact
    && iconLibraryContract.iconExported
    && iconLibraryContract.iconNamesExported
    && iconLibraryContract.iconNameCount > 0
    && iconLibraryContract.storybookContractVisible
    && iconLibraryContract.storybookDirectLucideImports.length === 0,
  route: "route_tcrn_design_system_internal_alpha_hardening_proof_implementation",
  componentStorybookParity: {
    route: "route_tcrn_design_system_component_library_storybook_parity_completion__elara",
    sourceOfTruthPackage: "@tcrn/ui-react",
    storybookRole: "package_backed_docs_evidence_consumer",
    publicComponentExportChecks,
    publicUtilityExportChecks,
    deferredPrototypeChecks,
    componentParityMatrix,
    packageMetadataMatchesSource,
    storybookConsumption,
    storybookDocShellControlContract,
    noProductAdoptionClaimed: true,
    noPackagePublicationClaimed: true
  },
  iconLibraryContract,
  packageContracts,
  exactDependencyChecks,
  dependencyLicensePosture: {
    claim: "known_license_groups_requiring_sable_post_implementation_review",
    unknownLicenseGroups,
    licenseSummary
  },
  noOverclaim: {
    dependencyCleanClaimed: false,
    packagePublished: false,
    productAdoptionClaimed: false
  }
};

writeFileSync(join(outputRoot, "package-contract-manifest.json"), `${JSON.stringify(packageContractManifest, null, 2)}\n`);
writeFileSync(join(outputRoot, "dependency-license-summary.json"), `${JSON.stringify(packageContractManifest.dependencyLicensePosture, null, 2)}\n`);

console.log(JSON.stringify({
  ok: packageContractManifest.ok,
  packageCount: packageContracts.length,
  publicComponentExportCount: publicComponentExportChecks.length,
  publicUtilityExportCount: publicUtilityExportChecks.length,
  deferredPrototypeCount: deferredPrototypeChecks.length,
  // Named, not counted. A count tells a reader the surface disagrees; these tell
  // them which name to go look at.
  undeclaredComponentExports,
  declaredButNotExported,
  exportedPrototypes,
  iconNameCount: iconLibraryContract.iconNameCount,
  storybookDeepImportHits: deepImportHits.length,
  storybookDirectLucideImports: iconLibraryContract.storybookDirectLucideImports.length,
  licenseGroups: licenseSummary.map((entry) => `${entry.license}:${entry.packageCount}`),
  unknownLicenseGroups
}, null, 2));

if (!packageContractManifest.ok) {
  process.exit(1);
}
