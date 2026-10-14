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
// OFL-1.1 is admitted for exactly the five vendored font packages, and only while each is a root
// devDependency. Basis: INIT-015 minutes D4 — Hanken Grotesk, Noto Sans SC, Noto Serif SC,
// Source Serif 4 and IBM Plex Mono are all SIL OFL 1.1, usable commercially and redistributable
// with the package. Any other package reporting OFL-1.1 still lands in unknownLicenseGroups.
const scopedLicenseAllowances = {
  "OFL-1.1": [
    "@fontsource-variable/hanken-grotesk",
    "@fontsource-variable/noto-sans-sc",
    "@fontsource-variable/noto-serif-sc",
    "@fontsource-variable/source-serif-4",
    "@fontsource/ibm-plex-mono"
  ]
};
const rootDevDependencyNames = new Set(Object.keys(JSON.parse(readFileSync("package.json", "utf8")).devDependencies ?? {}));
function licenseGroupAllowed(entry) {
  if (allowedLicenseGroups.has(entry.license)) return true;
  const scoped = scopedLicenseAllowances[entry.license];
  return Array.isArray(scoped)
    && entry.packageNames.length > 0
    && entry.packageNames.every((name) => scoped.includes(name) && rootDevDependencyNames.has(name));
}

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
const unknownLicenseGroups = licenseSummary.filter((entry) => !licenseGroupAllowed(entry)).map((entry) => entry.license);

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
// TCRN-DS-SUB-168 (STORY-147): the documentation pages wear the package ProductShell in its
// top-band state (TCRN-DS-SUB-131). There is no documentation header, rail, rail toggle or header
// search left, so this contract reads the top-band documentation shell instead of the four old
// markers (tcrn-doc-header, tcrn-doc-sidebar, data-doc-nav-item, data-doc-nav-category-toggle),
// which by then survived only in a stale contract text and a test. The shell markers are read from
// the runtime sources, not the tests, so a test that still quotes a marker cannot hold it up. The
// README check follows the current prop surface: the section names the top-band parts and the
// ProductShell callbacks, every callback it names is a ProductShellProps member, and it names none
// of the retired collapse API.
const uiReactReadmeShellSection = (() => {
  const start = uiReactReadme.indexOf("## Storybook Shell Control Boundary");
  if (start === -1) return "";
  const end = uiReactReadme.indexOf("\n## ", start + 1);
  return uiReactReadme.slice(start, end === -1 ? undefined : end);
})();
const shellPartNames = ["ProductShell", "ShellBrandButton", "ShellPins", "ShellMenu", "ShellDropdown", "ShellThemeToggle", "ShellLocaleMenu", "ProductLockup", "TcrnBrandMark"];
const shellCallbackNames = ["onMenuOpenChange", "onOpenPinChange", "onPinnedChange", "onAccountMenuOpenChange", "onThemeChange", "onLocaleMenuOpenChange", "onLocaleChange", "onSearchQueryChange"];
const retiredShellApiNames = ["sideNavCollapseButtonProps", "onCollapsedChange"];
const productShellPropsBody = (() => {
  const source = readFileSync("packages/ui-react/src/components/Navigation/Navigation.tsx", "utf8");
  const start = source.indexOf("export interface ProductShellProps ");
  if (start === -1) return "";
  return source.slice(start, source.indexOf("\n}\n", start));
})();
const storybookDocShellControlContract = {
  uiReactReadmeBoundaryVisible: uiReactReadmeShellSection.includes("registered package-backed product shell/effect boundary")
    && /`ProductShell` in its top-band\s+state/.test(uiReactReadmeShellSection)
    && shellPartNames.every((name) => uiReactReadmeShellSection.includes(`\`${name}\``))
    && uiReactReadmeShellSection.includes("`useProductShellController` is the public utility")
    && uiReactReadmeShellSection.includes("`productShellControlProps`")
    && shellCallbackNames.every((name) => uiReactReadmeShellSection.includes(`\`${name}\``)),
  uiReactReadmeFollowsProductShellProps: productShellPropsBody.length > 0
    && shellCallbackNames.every((name) => new RegExp(`\\n\\s+${name}\\?:`).test(productShellPropsBody))
    && retiredShellApiNames.every((name) => !uiReactReadmeShellSection.includes(name)),
  docShellMarkersVisible: storybookRuntimeBodies.some((source) => /<ProductShell\b/.test(source.body)
      && /data-shell=["']doc["']/.test(source.body)
      && /data-doc-shell=["']online-docs["']/.test(source.body))
    // The documentation shell is hydrated on the page (TCRN-DS-SUB-201): a runtime source mounts its block
    // (data-doc-shell-root with data-shell-hydrate) from the model the page carries (data-doc-shell-config),
    // and the hydrated shell opens its layers, the full menu and the avatar menu, through tcrnDocShellLayers.
    && storybookRuntimeBodies.some((source) => /data-doc-shell-root/.test(source.body)
      && /data-shell-hydrate/.test(source.body)
      && /data-doc-shell-config/.test(source.body))
    && storybookRuntimeBodies.some((source) => /tcrnDocShellLayers/.test(source.body)),
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
  focusSearchRuleVisible: /The shell's search is the full menu's/.test(uiReactReadme)
    && uiReactReadme.includes("compact at rest and expand on focus")
    && /collapse on\s+blur/.test(uiReactReadme)
    // The documentation pages' search is the full menu's (TCRN-DS-SUB-201): a runtime source reads the page's
    // search index (data-doc-search-index) and serves it to the hydrated shell through searchProvider.
    && storybookRuntimeBodies.some((source) => /data-doc-search-index/.test(source.body) && /searchProvider/.test(source.body)),
  aiContractToolbarBoundaryVisible: /not a top-band control for human\s+readers/.test(uiReactReadme)
    && storybookBodies.some((source) => /data-ai-consumption-contract-story/.test(source.body))
    && !storybookRuntimeBodies.some((source) => /data-ai-consumption-contract-link/.test(source.body))
};
// TCRN-DS-SUB-015 — the icons are drawn for this package from the design contract
// (icons.json, generated into icon-paths.generated.ts), so there is no third-party
// icon source left to record. What is checked instead: the exported roster is the
// contract's name set in contract order, no manifest section of @tcrn/ui-react names
// a third-party icon package, nothing in the package or Storybook sources imports
// one, and Storybook does not still name one as the icon source.
const iconContractPath = "docs/design/gplus-2026-10/contract/icons.json";
const iconPathsModulePath = "packages/ui-react/src/components/Icon/icon-paths.generated.ts";
const iconContract = readJson(iconContractPath);
const iconContractNames = Array.isArray(iconContract.icons) ? iconContract.icons.map((icon) => icon.name) : [];
const exportedIconNames = Array.isArray(uiReactModule.tcrnIconNames) ? [...uiReactModule.tcrnIconNames] : [];
const thirdPartyIconPackagePattern = /^lucide(?:-|$)/u;
const thirdPartyIconImportPattern = /from\s+["']lucide(?:-[a-z]+)?["']/g;
const iconLibraryContract = {
  source: "tcrn-icon-contract",
  sourceContract: iconContractPath,
  sourceContractSha256: sha256(iconContractPath),
  generatedPathsModule: iconPathsModulePath,
  generatedPathsModulePresent: existsSync(iconPathsModulePath),
  viewBox: iconContract.viewBox ?? null,
  strokeWidth: iconContract.strokeWidth ?? null,
  wrapperPackage: "@tcrn/ui-react",
  wrapperExport: "Icon",
  iconExported: Object.prototype.hasOwnProperty.call(uiReactModule, "Icon"),
  iconNamesExported: Array.isArray(uiReactModule.tcrnIconNames),
  iconNameCount: exportedIconNames.length,
  contractIconNameCount: iconContractNames.length,
  iconNamesMatchContract: exportedIconNames.length > 0
    && exportedIconNames.length === iconContractNames.length
    && exportedIconNames.every((name, index) => name === iconContractNames[index]),
  thirdPartyIconDependencies: ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]
    .flatMap((section) => Object.keys(uiReactManifest[section] ?? {})
      .filter((name) => thirdPartyIconPackagePattern.test(name))
      .map((name) => ({ section, name }))),
  packageSourceThirdPartyIconImports: walkTextSources("packages/ui-react/src")
    .flatMap((path) => collectMatches(path, new RegExp(thirdPartyIconImportPattern.source, "g"))),
  storybookContractVisible: storybookBodies.some((source) => /data-icon-library-wrapper="@tcrn\/ui-react\/Icon"/.test(source.body))
    && storybookBodies.some((source) => /data-icon-brand-boundary="not-brand-identity"/.test(source.body)),
  // Runtime sources only: a test that asserts the claim is gone has to be able to
  // name it without counting as the claim.
  storybookThirdPartySourceClaims: storybookRuntimeBodies
    .filter((source) => /data-icon-library-source="lucide[^"]*"/.test(source.body))
    .map((source) => source.path),
  storybookDirectThirdPartyIconImports: storybookSources
    .flatMap((path) => collectMatches(path, new RegExp(thirdPartyIconImportPattern.source, "g"))),
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
    && iconLibraryContract.generatedPathsModulePresent
    && iconLibraryContract.iconExported
    && iconLibraryContract.iconNamesExported
    && iconLibraryContract.iconNamesMatchContract
    && iconLibraryContract.thirdPartyIconDependencies.length === 0
    && iconLibraryContract.packageSourceThirdPartyIconImports.length === 0
    && iconLibraryContract.storybookContractVisible
    && iconLibraryContract.storybookThirdPartySourceClaims.length === 0
    && iconLibraryContract.storybookDirectThirdPartyIconImports.length === 0,
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
  iconNamesMatchContract: iconLibraryContract.iconNamesMatchContract,
  thirdPartyIconDependencies: iconLibraryContract.thirdPartyIconDependencies.map((entry) => `${entry.section}:${entry.name}`),
  packageSourceThirdPartyIconImports: iconLibraryContract.packageSourceThirdPartyIconImports.length,
  storybookThirdPartyIconSourceClaims: iconLibraryContract.storybookThirdPartySourceClaims,
  storybookDeepImportHits: deepImportHits.length,
  storybookDirectThirdPartyIconImports: iconLibraryContract.storybookDirectThirdPartyIconImports.length,
  licenseGroups: licenseSummary.map((entry) => `${entry.license}:${entry.packageCount}`),
  unknownLicenseGroups
}, null, 2));

if (!packageContractManifest.ok) {
  process.exit(1);
}
