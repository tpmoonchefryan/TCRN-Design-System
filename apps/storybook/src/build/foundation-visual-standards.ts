export type FoundationVisualStandardCategoryId =
  | "visual-philosophy-ownership"
  | "layout-rhythm"
  | "spacing-density"
  | "typography-localization"
  | "color-elevation-border-radius-focus"
  | "component-composition"
  | "interaction-motion-accessibility"
  | "responsive-mobile"
  | "evidence-proof-oracle"
  | "consumer-enforcement";

export interface FoundationVisualStandard {
  id: FoundationVisualStandardCategoryId;
  label: string;
  category: string;
  sourcePaths: readonly string[];
  storybookRoutes: readonly string[];
  authorityLevel: "package_authority" | "storybook_visual_oracle" | "consumer_contract" | "proof_contract";
  readbackFields: readonly string[];
  allowedConsumerInputs: readonly string[];
  forbiddenConsumerOverrides: readonly string[];
  proofExpectations: readonly string[];
  missingStandardEscalation: string;
}

export const storybookDocShellVisualOracle = {
  id: "original-storybook-doc-shell-v1",
  baselineManifest: "docs/verification/storybook-visual-proof/baseline-manifest.json",
  oracleRecoveryReceipt:
    "TCRN Workflow/vault/initiatives/projects/TCRN-DESIGN-SYSTEM/active/storybook-shell-control-stabilization/50-implementation-plan.md#storybook-original-shell-restoration-implementation-plan",
  baselineManifestClassification: "owner_declared_original_storybook_doc_shell_standard",
  metricSourceDisposition:
    "desktop sidebar, header, search rest, and search expanded metrics are retained only after the owner-approved restoration re-expresses the pre-d1d1291 Storybook documentation shell through current Storybook-owned doc-shell selectors and committed proof receipts.",
  sourceHead: "fc85adf8760d29e2ff76402ba13b477c4cb859b0",
  storybookRoute: "index.html#welcome-governance",
  shellAuthority: "storybook_doc_shell_with_package_primitives",
  packagePrimitives: [
    "@tcrn/ui-react/ShellBrandLockup",
    "@tcrn/ui-react/SearchInput",
    "@tcrn/ui-react/ShellThemeToggle",
    "@tcrn/ui-react/ShellLocaleMenu",
    "@tcrn/ui-react/SideNavCollapseButton"
  ],
  globalProductShellSelectorsForbidden: [
    "data-storybook-shell-authority",
    "data-storybook-product-shell-skin",
    "data-package-backed-product-shell-boundary",
    "data-product-shell-region='side-navigation'",
    "tcrn-product-shell__sidebar",
    "tcrn-product-shell__main"
  ],
  metricEvidence: [
    {
      metric: "desktopSidebarWidthPx",
      value: 360,
      evidencePath:
        "docs/verification/storybook-visual-proof/screenshots/baseline/welcome-first-story-zh-cn-light__desktop-2048x1024.png",
      sha256: "8899be3403c5ad4f644b62fb895c9cc1ca4aba55ba6a3265214e67f6e974641d",
      extraction: "Restored Storybook doc-shell visual-proof geometry: responsive sidebar clamp(280px, 20vw, 360px), maxing at 360px in 2048px baseline and yielding 288px at 1440px smoke proof"
    },
    {
      metric: "desktopTopbarHeightPx",
      value: 96,
      evidencePath:
        "docs/verification/storybook-visual-proof/screenshots/baseline/welcome-first-story-zh-cn-light__desktop-2048x1024.png",
      sha256: "8899be3403c5ad4f644b62fb895c9cc1ca4aba55ba6a3265214e67f6e974641d",
      extraction: "Storybook doc-shell visual-proof geometry: header/control band y=0..95, height=96px"
    },
    {
      metric: "searchRestWidthPx",
      value: 180,
      evidencePath:
        "docs/verification/storybook-visual-proof/screenshots/baseline/welcome-first-story-zh-cn-light__desktop-2048x1024.png",
      sha256: "8899be3403c5ad4f644b62fb895c9cc1ca4aba55ba6a3265214e67f6e974641d",
      extraction: "Storybook doc-shell visual-proof geometry: compact search shell width=180px"
    },
    {
      metric: "searchExpandedWidthPx",
      value: 320,
      evidencePath:
        "docs/verification/storybook-visual-proof/screenshots/baseline/welcome-search-focus-zh-cn-light__desktop-2048x1024.png",
      sha256: "f13c5c81f2074f6734afa075a69d42ce4e23ddc9d73fc4d4142994295a774a75",
      extraction: "Storybook doc-shell visual-proof focused search state width=320px"
    }
  ],
  shellMetrics: {
    desktopSidebarWidthPx: 288,
    desktopSidebarMinWidthPx: 280,
    desktopSidebarPreferredViewportRatio: 0.2,
    desktopSidebarMaxWidthPx: 360,
    desktopSidebarTolerancePx: 2,
    desktopTopbarHeightPx: 96,
    desktopTopbarTolerancePx: 2,
    searchRestWidthPx: 180,
    searchExpandedWidthPx: 320,
    searchHeightPx: 36,
    searchBorderColor: "rgb(184, 200, 214)",
    searchBorderRadiusPx: 5,
    themeToggleSizePx: 36,
    themeToggleRadiusPx: 999,
    localeTriggerHeightPx: 36,
    trailingUtilityGapMinPx: 16,
    trailingUtilityGapMaxPx: 32
  },
  requiredProofRoutes: [
    "index.html?theme=light&locale=zh-CN#welcome-governance",
    "patterns.html?theme=light&locale=zh-CN#forms-patterns",
    "components.html?theme=light&locale=zh-CN#component-family-index",
    "proof.html?theme=light&locale=zh-CN#proof-matrix",
    "change-log.html?theme=light&locale=zh-CN#local-changelog"
  ],
  reducedMotionExpectation:
    "Storybook doc-shell search/theme/menu/control transitions and animations are suppressed or reduced to the DS-approved zero-duration fallback under prefers-reduced-motion."
} as const;

export const foundationVisualStandards: readonly FoundationVisualStandard[] = [
  {
    id: "visual-philosophy-ownership",
    label: "Visual philosophy and ownership",
    category: "Foundation",
    sourcePaths: [
      "apps/storybook/src/build/foundation-visual-standards.ts",
      "apps/storybook/src/alpha-styles.ts",
      "packages/ui-react/src/components/Navigation/Navigation.tsx"
    ],
    storybookRoutes: ["foundations.html#foundation-visual-standards", "proof.html#ai-consumption-contract"],
    authorityLevel: "storybook_visual_oracle",
    readbackFields: ["authorityLevel", "shellAuthority", "visualOracleId", "baselineManifest", "forbiddenGlobalProductShellSelectors"],
    allowedConsumerInputs: ["route IA", "localized labels", "content slots", "DS-defined callbacks"],
    forbiddenConsumerOverrides: ["private shell clones", "package-equivalent local controls", "Storybook-only compliance claims"],
    proofExpectations: ["data-doc-shell online-docs marker", "global ProductShell shell selector count is zero", "doc-shell category navigation is present and scrollable"],
    missingStandardEscalation: "Return to DS/Elara for standards admission before product or Storybook visual implementation."
  },
  {
    id: "layout-rhythm",
    label: "Layout and rhythm",
    category: "Foundation",
    sourcePaths: ["apps/storybook/src/alpha-styles.ts", "packages/ui-react/src/components/Navigation/Navigation.tsx"],
    storybookRoutes: ["index.html#welcome-governance", "patterns.html#forms-patterns"],
    authorityLevel: "storybook_visual_oracle",
    readbackFields: ["sidebarWidth", "topbarHeight", "contentStart", "pageHeadPosition", "crossSectionSignature"],
    allowedConsumerInputs: ["route-level content density", "content ordering within admitted layout slots"],
    forbiddenConsumerOverrides: ["shared shell grid", "topbar utility alignment", "sidebar width", "content rhythm tokens"],
    proofExpectations: ["cross-section shell parity", "topbar/content rhythm deltas within tolerance", "no page overflow"],
    missingStandardEscalation: "Block implementation if no route-specific Storybook visual oracle names the layout rhythm."
  },
  {
    id: "spacing-density",
    label: "Spacing and density",
    category: "Foundation",
    sourcePaths: ["apps/storybook/src/alpha-styles.ts", "packages/ui-react/src/components/DataDisplay/DataDisplay.tsx"],
    storybookRoutes: ["foundations.html#foundation-visual-standards", "components.html#table-work-index-spec"],
    authorityLevel: "package_authority",
    readbackFields: ["densityScale", "panelGap", "tableContainment", "mobileStacking", "overflowContainment"],
    allowedConsumerInputs: ["content-specific row data", "table columns", "local filters"],
    forbiddenConsumerOverrides: ["ad hoc dense card padding", "global table overflow rules", "page-level horizontal scrollers"],
    proofExpectations: ["mobile no page-level overflow", "table-local overflow only", "long-token containment"],
    missingStandardEscalation: "Skip product-specific reusable pattern work and list the missing DS primitive/pattern."
  },
  {
    id: "typography-localization",
    label: "Typography and localization",
    category: "Foundation",
    sourcePaths: [
      "apps/storybook/src/build/locales/storybook-locale-text.ts",
      "apps/storybook/src/build/locales/storybook-content-text.ts",
      "packages/ui-copy-state/src"
    ],
    storybookRoutes: ["foundations.html#i18n-theme-contract", "foundations.html#foundation-visual-standards"],
    authorityLevel: "package_authority",
    readbackFields: ["htmlLang", "visibleLocale", "localizedShellLabels", "forbiddenEnglishLeaks", "typeFamily"],
    allowedConsumerInputs: ["approved locale data", "approved product copy keys", "proper names and stable machine ids"],
    forbiddenConsumerOverrides: ["hard-coded shell labels", "English-only category labels", "local type ramps"],
    proofExpectations: ["zh-CN shell/nav/current-location/search labels localized", "story ids and route ids remain stable"],
    missingStandardEscalation: "Block if visible shell labels lack localization; route copy-key admission before implementation."
  },
  {
    id: "color-elevation-border-radius-focus",
    label: "Color, elevation, border radius, and focus",
    category: "Foundation",
    sourcePaths: ["apps/storybook/src/alpha-styles.ts", "packages/ui-react/src/components/Navigation/Navigation.tsx"],
    storybookRoutes: ["style-guide.html#color-palette", "components.html#navigation-shell-spec"],
    authorityLevel: "package_authority",
    readbackFields: ["surfaceColor", "borderColor", "controlRadius", "themeToggleRadius", "focusOutline", "boxShadow"],
    allowedConsumerInputs: ["theme mode", "semantic state", "DS component variant"],
    forbiddenConsumerOverrides: ["square shell icon toggles", "inner-input focus rectangles", "custom focus shadows", "local border systems"],
    proofExpectations: ["theme toggle 36x36 radius 999", "search border/radius parity", "focus outline on wrapper surface"],
    missingStandardEscalation: "Block if actual generated Storybook shell drifts from the restored Storybook doc-shell oracle values."
  },
  {
    id: "component-composition",
    label: "Component composition",
    category: "Foundation",
    sourcePaths: ["packages/ui-react/src/index.tsx", "apps/storybook/src/contract-stories/story-content.tsx"],
    storybookRoutes: ["components.html#component-family-index", "components.html#navigation-shell-spec"],
    authorityLevel: "package_authority",
    readbackFields: ["packageExport", "variantProps", "slotContract", "componentIdentity", "storyRoute"],
    allowedConsumerInputs: ["IA/data", "locale data", "content slots", "documented callbacks"],
    forbiddenConsumerOverrides: ["local reusable clones", "Storybook-only prototype imports", "package-looking selectors outside DS"],
    proofExpectations: ["package import receipt", "component identity markers", "no visible local UI namespace"],
    missingStandardEscalation: "Return a needed DS component/pattern list instead of building product-local shared UI."
  },
  {
    id: "interaction-motion-accessibility",
    label: "Interaction, motion, and accessibility",
    category: "Foundation",
    sourcePaths: ["packages/ui-react/src/components/Navigation/Navigation.tsx", "scripts/internal-alpha-browser-proof.mjs"],
    storybookRoutes: ["style-guide.html#icons-motion", "proof.html#overlay-focus"],
    authorityLevel: "proof_contract",
    readbackFields: ["transitionProperty", "duration", "easing", "keyboardActivation", "focusReturn", "reducedMotion"],
    allowedConsumerInputs: ["callback implementations", "route-owned state persistence", "semantic disabled reasons"],
    forbiddenConsumerOverrides: ["wrapper-only event delegation", "static endpoint-only motion proof", "unproven no-op affordances"],
    proofExpectations: ["Enter/Space activation", "Escape/blur dismissal", "sampled motion timeline", "reduced-motion suppression"],
    missingStandardEscalation: "Block owner-quality claims until browser interaction proof exercises rendered behavior."
  },
  {
    id: "responsive-mobile",
    label: "Responsive and mobile",
    category: "Foundation",
    sourcePaths: ["apps/storybook/src/alpha-styles.ts", "packages/ui-react/src/components/Navigation/Navigation.tsx"],
    storybookRoutes: ["foundations.html#foundation-visual-standards", "components.html#aos-owner-quality-product-shell"],
    authorityLevel: "storybook_visual_oracle",
    readbackFields: ["viewport", "searchMaxWidth", "collapsePolicy", "pageOverflow", "tableLocalOverflow"],
    allowedConsumerInputs: ["mobile content order", "mobile route content", "approved hidden-affordance policy"],
    forbiddenConsumerOverrides: ["page-level horizontal overflow", "clickable mobile no-op controls", "full-width search beyond accepted cap"],
    proofExpectations: ["390px mobile no page overflow", "mobile search cap", "mobile collapse hidden/disabled per oracle"],
    missingStandardEscalation: "Return a DS/mobile policy blocker if the oracle does not admit the requested mobile behavior."
  },
  {
    id: "evidence-proof-oracle",
    label: "Evidence, proof, and visual oracle",
    category: "Foundation",
    sourcePaths: [
      "apps/storybook/src/build/ai-consumption-contract.ts",
      "scripts/storybook-smoke.mjs",
      "scripts/internal-alpha-browser-proof.mjs"
    ],
    storybookRoutes: ["proof.html#ai-consumption-contract", "proof.html#proof-matrix"],
    authorityLevel: "proof_contract",
    readbackFields: ["contractPayloadDigest", "artifactPaths", "browserMetrics", "screenshotPaths", "noOverclaimBoundaries"],
    allowedConsumerInputs: ["proof artifact paths", "route-specific metric readbacks"],
    forbiddenConsumerOverrides: ["marker-only proof", "stale screenshots as current oracle", "hidden failed proof gaps"],
    proofExpectations: ["AI contract digest verified", "llms alignment", "browser screenshot/metric receipts", "no-overclaim scan"],
    missingStandardEscalation: "Do not close implementation until proof receipts fail closed and are source-visible."
  },
  {
    id: "consumer-enforcement",
    label: "Consumer enforcement and reject criteria",
    category: "Foundation",
    sourcePaths: ["apps/storybook/src/build/foundation-visual-standards.ts", "apps/storybook/src/build/ai-consumption-contract.ts"],
    storybookRoutes: ["foundations.html#foundation-visual-standards", "proof.html#ai-consumption-contract"],
    authorityLevel: "consumer_contract",
    readbackFields: ["allowedInputs", "forbiddenOverrides", "rejectCriteria", "missingStandardEscalation", "routeOwner"],
    allowedConsumerInputs: ["product data", "IA labels", "copy keys", "documented DS props", "callbacks"],
    forbiddenConsumerOverrides: ["consumer-local shared spacing", "consumer-local typography", "shell-control geometry", "package-equivalent styles"],
    proofExpectations: ["consumer contract present in AI JSON", "local style clone reject criteria present", "llms first-read alignment"],
    missingStandardEscalation: "Route a DS standards admission request before product-local framework/style work."
  }
];

export const consumerVisualStyleContract = {
  id: "consumer-visual-style-contract-v1",
  disposition: "fail_closed_consumer_contract",
  storybookRoute: "foundations.html#foundation-visual-standards",
  aiContractField: "consumerVisualStyleContract",
  allowedConsumerInputs: [
    "product data",
    "IA and route labels",
    "localized copy keys",
    "content slots",
    "documented package props",
    "DS-defined callbacks"
  ],
  forbiddenConsumerOverrides: [
    "consumer-local shared spacing/density systems",
    "consumer-local type ramps",
    "consumer-local shell-control geometry",
    "consumer-local ProductShell/search/theme/locale/sidebar clones",
    "Storybook-only compliance claims",
    "package-equivalent visual systems outside @tcrn/ui-react"
  ],
  requiredReadbackFields: [
    "foundationVisualStandards",
    "storybookDocShellVisualOracle",
    "allowedConsumerInputs",
    "forbiddenConsumerOverrides",
    "proofExpectations",
    "missingStandardEscalation"
  ],
  rejectCriteria: [
    "A product claims DS compliance without naming a foundation standard id and Storybook route.",
    "A product fixes shared typography, spacing, shell-control geometry, or ProductShell visual behavior locally instead of routing DS standards admission.",
    "A proof compares only endpoints or markers and omits computed style, motion, i18n, overflow, and browser interaction metrics.",
    "Storybook surfaces hide mandatory owner-review/no-overclaim/proof posture inside optional disclosure."
  ]
} as const;

export const foundationVisualStandardCategoryIds = foundationVisualStandards.map((standard) => standard.id);

export const foundationVisualStandardsReadback = {
  registryId: "foundation-visual-standards-v1",
  storybookRoute: "foundations.html#foundation-visual-standards",
  categoryCount: foundationVisualStandards.length,
  categoryIds: foundationVisualStandardCategoryIds,
  storybookDocShellVisualOracle,
  consumerVisualStyleContract,
  noOverclaimBoundary:
    "Foundation visual standards define local Storybook and consumer-contract authority only; package publication, product adoption, owner acceptance, release readiness, and live dispatch are not claimed."
} as const;
