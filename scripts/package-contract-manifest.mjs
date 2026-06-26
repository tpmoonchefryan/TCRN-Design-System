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

const publicUiReactComponentExports = [
  "Button",
  "Icon",
  "IconButton",
  "LinkButton",
  "Field",
  "Input",
  "Textarea",
  "SearchInput",
  "Select",
  "Checkbox",
  "Badge",
  "StatusBadge",
  "StateView",
  "InlineAlert",
  "LiveRegion",
  "Skeleton",
  "EnvironmentBanner",
  "GateReadinessPanel",
  "EvidenceStrip",
  "ReadbackPanel",
  "Text",
  "Heading",
  "Surface",
  "Divider",
  "KeyValueList",
  "FilterBar",
  "TableShell",
  "WorkIndex",
  "DetailInspector",
  "Breadcrumb",
  "ModuleTabs",
  "SectionTabs",
  "SegmentedNav",
  "Pagination",
  "TopBar",
  "SideNav",
  "NavGroup",
  "NavItem",
  "ProductLauncher",
  "ProductSwitcher",
  "SkipLink",
  "DetailDrawer",
  "ActionDrawer",
  "Popover",
  "Dialog",
  "ConfirmActionDialog"
];

const publicUiReactUtilityExports = [
  "tcrnIconNames"
];

const deferredStorybookPrototypeNames = [
  "TcrnBrandMark",
  "ProductLockup",
  "ShellBrandLockup",
  "TmsDenseShellDemo",
  "KnowledgeBaseShellDemo",
  "CompactToolShellDemo"
];

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
const publicComponentExportChecks = publicUiReactComponentExports.map((name) => ({
  name,
  exported: Object.prototype.hasOwnProperty.call(uiReactModule, name)
}));
const publicUtilityExportChecks = publicUiReactUtilityExports.map((name) => ({
  name,
  exported: Object.prototype.hasOwnProperty.call(uiReactModule, name)
}));
const deferredPrototypeChecks = deferredStorybookPrototypeNames.map((name) => ({
  name,
  exported: Object.prototype.hasOwnProperty.call(uiReactModule, name),
  packageBacked: false,
  disposition: "storybook_only_prototype"
}));
const packageMetadataMatchesSource = Array.isArray(uiReactModule.componentLibraryPublicComponentNames)
  && publicUiReactComponentExports.length === uiReactModule.componentLibraryPublicComponentNames.length
  && publicUiReactComponentExports.every((name) => uiReactModule.componentLibraryPublicComponentNames.includes(name))
  && Array.isArray(uiReactModule.componentLibraryPublicUtilityNames)
  && publicUiReactUtilityExports.length === uiReactModule.componentLibraryPublicUtilityNames.length
  && publicUiReactUtilityExports.every((name) => uiReactModule.componentLibraryPublicUtilityNames.includes(name))
  && Array.isArray(uiReactModule.componentLibraryDeferredPrototypeNames)
  && deferredStorybookPrototypeNames.length === uiReactModule.componentLibraryDeferredPrototypeNames.length
  && deferredStorybookPrototypeNames.every((name) => uiReactModule.componentLibraryDeferredPrototypeNames.includes(name));

const storybookSources = walkTextSources("apps/storybook/src");
const storybookBodies = storybookSources.map((path) => ({ path, body: readFileSync(path, "utf8") }));
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
  iconNameCount: iconLibraryContract.iconNameCount,
  storybookDeepImportHits: deepImportHits.length,
  storybookDirectLucideImports: iconLibraryContract.storybookDirectLucideImports.length,
  licenseGroups: licenseSummary.map((entry) => `${entry.license}:${entry.packageCount}`),
  unknownLicenseGroups
}, null, 2));

if (!packageContractManifest.ok) {
  process.exit(1);
}
