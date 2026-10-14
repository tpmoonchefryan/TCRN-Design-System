import { tcrnTokens } from "@tcrn/ui-tokens";
import {
  storyCategoryDefinitions,
  storyRegistryOrder,
  storybookGovernanceChangelogRecords,
  storybookTopLevelSections
} from "../contract-stories/governance.js";
import type { ContractStoryGroup } from "../contract-stories/types.js";
import { tcrnProductLogoRegistry, type TcrnProductLogoId } from "@tcrn/ui-react";
import { groupFileName, groupSlug } from "./navigation.js";
import {
  consumerVisualStyleContract,
  foundationVisualStandards,
  foundationVisualStandardsReadback,
  storybookDocShellVisualOracle,
  settingControlSelectionContract,
  fieldValueSelectionContract,
  dictionaryContentContract,
  overlayBoundaryContract,
  settingsLayoutContract,
  pageHierarchyContract,
  verificationCadenceContract,
  operationFeedbackContract,
  contentScopeContract,
  consumerEvidenceContract,
  consumerVerificationContract
} from "./foundation-visual-standards.js";

// The top-band shell's two searches (07a board, the full menu and the drop-down; TCRN-DS-SUB-145 removed
// the old top bar's 260 / 420 search), read from the shell tokens so the contract cannot drift from the
// package geometry: the full menu's field fills the expanded panel less its space-2 inset at
// shell.srch-h, and a pinned drop-down's field fills the drop-down column less its space-1h inset at
// shell.drop-srch-h (TCRN-DS-SUB-176). Focus does not widen either.
function shellTokenPx(variable: string): number {
  const token = tcrnTokens.find((candidate) => candidate.variable === variable);
  if (!token) {
    throw new Error(`ai-consumption-contract: ${variable} is missing from @tcrn/ui-tokens`);
  }
  return Number.parseFloat(token.value);
}
const shellSearchGeometry = {
  fullMenuWidthPx: shellTokenPx("--tcrn-shell-panel-w-expanded") - 2 * shellTokenPx("--tcrn-space-2"),
  fullMenuHeightPx: shellTokenPx("--tcrn-shell-srch-h"),
  dropDownWidthPx: shellTokenPx("--tcrn-shell-drop-w") - 2 * shellTokenPx("--tcrn-space-1h"),
  dropDownHeightPx: shellTokenPx("--tcrn-shell-drop-srch-h")
};

// --- Section -> category -> story trees derived from the single registry source ---
// (governance.storyRegistryOrder). Structural fields (section, route, requiredStories,
// categories, sourcePaths) are derived; the hand-authored prose below (consumerChecks,
// authority, the Change Log CHANGELOG.md source path) is kept per-section with its exact
// wording and object key order so the built ai-consumption-contract.json stays byte-equal.
// Derives from governance.js (a leaf) and navigation.js — NOT from kernel/contractStories,
// which would form a module cycle via story-content.tsx importing this contract.
const consumerChecksBySection: Record<ContractStoryGroup, readonly string[]> = {
  Welcome: [
    "read governance and contribution boundaries before treating Storybook as product adoption",
    "confirm owner review, release, publication, and bug-policy boundaries before claims",
    "record maintainers/routing expectations before asking a product repo to consume DS"
  ],
  "Style Guide": [
    "compare brand, color, type, grid, icon, motion, global state, and copy rules before visual implementation",
    "prove motion/effect parity, including duration, easing, opacity, transform, focus treatment, and reduced-motion fallback",
    "do not treat static state changes as motion compliance"
  ],
  Foundations: [
    "consume semantic tokens, theme variables, locale metadata, and copy-state vocabulary before product copy or CSS",
    "consume foundation visual standards and consumer visual style contract before shared spacing, typography, shell, search, navigation, focus, motion, or visual-system work",
    "use the setting-control selection contract: Select for more than two values, a measured binary RadioGroup only when it fits, SegmentedNav for navigation, and NumberInput for numeric entry",
    "preserve controlled and uncontrolled SettingChoice values across radio/Select branch changes; treat layout-only swaps as non-events",
    "use MultiSelect presentation=dropdown for ordinary collection choice, with Select-family collapsed values and Menu-family multi-selection; keep native lists and explicit checklists separate and keep SuggestInput open to free-form values",
    "render dictionary category copy once and supply a distinct explanation for every machine value",
    "use OperationFeedback for short operation status plus labeled identity and keyboard-readable receipt details",
    "use ContentScope with consumer-owned source, phase, count, and stale-content truth for every independent region",
    "follow the DS verification cadence: targeted development checks first, one candidate-final parent verify, and input-bound invalidation",
    "use SettingRowList inside SettingsLayout for shared control and tools columns, with one-host complete-form composition at the admitted container thresholds",
    "verify light/dark and supported locale behavior against Storybook before product compliance claims",
    "block hard-coded copy, ad hoc status language, consumer-local reusable visual-system overrides, and theme-specific behavior forks"
  ],
  Components: [
    "identify every registered primitive, export, variant, prop, slot, and state required by the product surface",
    "prove product code consumes package-backed components instead of local clones",
    "prove setting values use SettingChoice/Select/RadioGroup semantics and numeric values use NumberInput rather than Stepper",
    "prove SettingChoice branch swaps retain valid state and report user changes exactly once",
    "prove collection and open-value controls preserve their declared cardinality and value domain",
    "resolve field metadata through resolveFieldValueControl before choosing a package component",
    "prove Tooltip and Popover use the declared boundary, placement, and dismissal contract",
    "prove OperationFeedback and ContentScope states through package-backed identity, branch, and accessibility markers",
    "run evaluateConsumerEvidence with DOM-backed lifecycle, geometry, and separate zoom-axis measurements",
    "compare expected, submitted, serialized, and readback values under the declared consumer serialization mode",
    "RecordInspector and DetailLayout respond to their own available width; nested DetailInspector fields stack at the record-family compact boundary. KeyValueList label/value pairs wrap inside their own cells, and record metadata and attachment statuses keep full text readable using the existing wrapping badge grammar. TableShell retains keyboard-scrollable columns above its mobile stacked-card breakpoint. Do not override these package styles in documentation or product consumers; verify narrow children inside wide viewports and actual route/pattern consumers with the geometry proof, including overlap and clipped-status mutation negatives",
    "prove the same Storybook visual instance, then compare rendered component metrics against Storybook: size, radius, padding, border, background, typography, hover, focus, active, disabled, dark, locale, mobile, and reduced-motion states"
  ],
  Patterns: [
    "consume page, dashboard, workbench, list, form, notification, validation, data-grid, and search composition rules before arranging product screens",
    "consume Records and boards route context, local view tabs, quick filters, dense rows/lists, split detail, row groups, lane-board density, stages, references, activity, relationships, saved-view, and machine-token patterns before building record surfaces",
    "use actual SettingsLayout frame/content container queries at 960px and 720px; wrap related rows in SettingRowList so controls and tools align across rows, including rows without tools",
    "prove information hierarchy, density, mobile reflow, empty/loading/error states, and route-level IA match the relevant Storybook pattern",
    "block proof/status panels from replacing product-first page composition unless the Storybook pattern explicitly requires them"
  ],
  Proof: [
    "read proof matrix, this AI contract, blocked actions, and overlay/focus proof before implementation closeout",
    "run the DS consumer verification contract's positive and negative legs; class or CSS equality alone is not proof",
    "run the full-surface browser proof for overlays, field cardinality, collection/open-value controls, dictionary explanations, operation feedback, content scopes, and consumer evidence",
    "do not rerun contained child gates after the same successful parent receipt unless an input changes or a failure requires diagnosis",
    "carry required receipts for browser interaction, accessibility, visual parity, no-overclaim, owner-visible preview, and product-owned adoption proof",
    "do not use Storybook-only evidence as product adoption, acceptance, release, or hosted readiness proof"
  ],
  "Change Log": [
    "read local changelog for recently changed DS contract behavior before using older memory or cached screenshots",
    "record the consumed Storybook/DS basis when comparing a product repo against the contract",
    "block stale Storybook baselines from being used as current visual truth"
  ]
};

const coveredSectionAuthorityBySection: Record<ContractStoryGroup, string> = {
  Welcome: "static_contract_storybook_governance",
  "Style Guide": "static_contract_storybook_governance",
  Foundations: "static_contract_storybook_governance",
  Components: "package_backed_components_plus_static_contract_storybook_governance",
  Patterns: "package_backed_patterns_plus_static_contract_storybook_governance",
  Proof: "static_proof_contract",
  "Change Log": "durable_changelog_governance_record"
};

// Extra hand-authored source paths appended after the derived groups/*.ts + story-content.tsx pair.
const coveredSectionExtraSourcePaths: Partial<Record<ContractStoryGroup, readonly string[]>> = {
  "Change Log": ["CHANGELOG.md"]
};

const requiredStorybookSectionChecklist = storybookTopLevelSections.map((section) => ({
  section,
  route: groupFileName(section),
  requiredStories: storyRegistryOrder.filter((entry) => entry.group === section).map((entry) => entry.id),
  consumerChecks: [...consumerChecksBySection[section]]
}));

const coveredStorybookSections = storybookTopLevelSections.map((section) => ({
  section,
  route: groupFileName(section),
  categories: storyCategoryDefinitions[section].map((category) => ({
    id: category.id,
    label: category.label,
    storyIds: storyRegistryOrder
      .filter((entry) => entry.group === section && entry.categoryId === category.id)
      .map((entry) => entry.id)
  })),
  sourcePaths: [
    `apps/storybook/src/contract-stories/groups/${groupSlug(section)}.ts`,
    "apps/storybook/src/contract-stories/story-content.tsx",
    ...(coveredSectionExtraSourcePaths[section] ?? [])
  ],
  authority: coveredSectionAuthorityBySection[section]
}));

// --- The published product lockups, derived from the package registry ---
// These fields were hand-copied here, which is how the contract came to publish
// `lineTwo: "AI Operation System"` as if the tagline were one string. It is five —
// a consumer reading this contract needs to know the tagline is translated, and
// which five values it can render. Deriving it means the next tagline change cannot
// leave the readback describing the previous one.
const productLogoIds: readonly TcrnProductLogoId[] = ["design-system", "aos", "tms", "einzbern", "mana-orchestrate"];
const publishedProductLogoRegistry = productLogoIds.map((productId) => {
  const asset = tcrnProductLogoRegistry[productId];
  return {
    productId,
    assetId: asset.assetId,
    // The registered product mark drawn inline by TcrnBrandMark; null keeps the
    // TCRN mother mark (AOS is not in this phase).
    markId: asset.markId,
    // sans: TCRN in ink plus the suffix in the product's deep colour; serif: the
    // whole name in ink with the byline.
    wordmark: asset.wordmark,
    lineOne: asset.lineOne,
    lineOneBase: asset.lineOneBase,
    lineOneSuffix: asset.lineOneSuffix,
    suffixClassName: asset.suffixClassName,
    byline: asset.byline,
    // The wordmark is a name and stays Latin; the tagline is copy and carries all
    // five locales. A consumer that renders `lineTwo` must pick by reader locale.
    lineTwo: { ...asset.lineTwo },
    stackSuffix: asset.stackSuffix,
    alt: asset.alt,
    packageExport: "ProductLogo",
    taglineLocaleSelector: "tcrnProductTagline(productId, locale)"
  };
});

export const aiConsumptionContract = {
  contractVersion: "ai_consumption_contract_v1",
  storyId: "ai-consumption-contract",
  route: "proof.html#ai-consumption-contract",
  artifact: "ai-consumption-contract.json",
  mustReadFirst: true,
  designSystemAuthorityDisposition: "package_primitives_and_storybook_doc_shell_split",
  componentStorybookParityDisposition: "package_primitives_consumed_without_internal_clones",
  ownerVisualAdmissionDisposition: "owner_review_required",
  visualFitControlContract: {
    storybookGlobalShellAuthority: "original_storybook_doc_shell",
    packagePrimitiveAuthority: ["SearchInput", "ProductLockup", "TableShell", "Records and boards layout/density exports", "Documents and collaboration static exports"],
    // The documentation shell's search is the full menu's field (the oracle's shellMetrics read the same
    // 936 at rest and focused); a pinned drop-down carries the smaller field (TCRN-DS-SUB-176).
    search: {
      storybookRestWidthPx: shellSearchGeometry.fullMenuWidthPx,
      storybookExpandedWidthPx: shellSearchGeometry.fullMenuWidthPx,
      storybookHeightPx: shellSearchGeometry.fullMenuHeightPx,
      dropDownWidthPx: shellSearchGeometry.dropDownWidthPx,
      dropDownHeightPx: shellSearchGeometry.dropDownHeightPx,
      packageDefaultControlMinInlineSize: "9ch",
      rule: `The search is the package SearchInput inside the top-band shell's layers: the full menu's field is ${shellSearchGeometry.fullMenuWidthPx} x ${shellSearchGeometry.fullMenuHeightPx} at a 1440px viewport and a pinned drop-down's field is ${shellSearchGeometry.dropDownWidthPx} x ${shellSearchGeometry.dropDownHeightPx}; focus does not widen either. Storybook may set SearchInput root size variables, but must not absolute-position package icon, input, or shortcut internals.`
    },
    productLockups: {
      primarySurface: "style-guide.html#brand-identity",
      rule: "Product lockups remain the primary Brand identity logo section; suffix accents are package-owned and product-specific."
    },
    // The top band has no side rail (TCRN-DS-SUB-208): sections and categories are rows of the full menu.
    fullMenu: {
      authority: "@tcrn/ui-react/ProductShell",
      rule: "Sections and categories are rows of the full menu under the brand button; the current page is the menu's current row and the paper's breadcrumb, with no side rail and no orphan visual lane."
    },
    tablesAndContainers: {
      authority: "@tcrn/ui-react/TableShell",
      rule: "Tables use package-emitted column/min-width variables and local overflow; Storybook must not clone row, head, or cell layout."
    },
    workLayoutDensity: {
      authority: "@tcrn/ui-react Functional display exports for records and boards",
      storybookRoutes: ["components.html#records-and-boards-components-spec", "patterns.html#records-and-boards-patterns"],
      packageExports: [
        "PageHeader",
        "ViewTabs",
        "QuickFilters",
        "RecordRow",
        "RecordTable",
        "SplitView",
        "RowGroup",
        "InlineCreate",
        "LaneBoard",
        "DetailLayout",
        "MetadataRail",
        "DetailInspector",
        "ActivityFeed",
        "StagePipeline",
        "MachineTokenCell"
      ],
      rule:
        "Record routes must consume admitted package exports for route context, local tabs, quick filters, dense rows/lists, row groups, lane-board density, split detail, metadata rails, detail inspection, activity, stages and references, and dense machine-token cells instead of local reusable clones."
    },
    knowledgeLayoutDensity: {
      authority: "@tcrn/ui-react Documents and collaboration exports",
      storybookRoutes: ["components.html#documents-and-collaboration-components-spec"],
      packageExports: [
        "TreeNav",
        "DocumentCanvas",
        "TocRail",
        "InlineCommentList",
        "MetadataRail",
        "AttachmentList",
        "LabelSet",
        "VersionHistory",
        "TemplateGallery",
        "SearchResultList"
      ],
      rule:
        "Document routes must consume admitted package exports for page trees, document canvas, local table of contents, inline comments, metadata, attachments, labels, version history, templates, and static local results. backend publishing, live collaboration, external workspace integration, and global search remain unclaimed unless downstream product routes prove them."
    }
  },
  discovery: {
    staticArtifact: "apps/storybook/storybook-static/ai-consumption-contract.json",
    hostedArtifact: "https://tcrn-design-system-storybook.vercel.app/ai-consumption-contract.json",
    llmsTxt: "llms.txt",
    robotsTxt: "robots.txt",
    htmlHead: {
      alternateJson: {
        rel: "alternate",
        type: "application/json",
        href: "ai-consumption-contract.json",
        title: "TCRN AI consumption contract",
        dataMarker: "data-tcrn-ai-consumption-contract=\"true\""
      },
      help: {
        rel: "help",
        type: "text/plain",
        href: "llms.txt"
      },
      meta: {
        contract: "tcrn-ai-consumption-contract",
        route: "tcrn-ai-consumption-contract-route",
        required: "tcrn-ai-consumption-contract-required"
      }
    }
  },
  firstReadRoutes: ["ai-consumption-contract.json", "llms.txt", "proof.html#ai-consumption-contract"],
  // Semantic component references consume the existing public family tokens directly.
  // Only the two retained component parameter defaults need compatibility entries.
  publicTokenAliases: tcrnTokens.filter((token) => token.name.startsWith("compatibility.")).map(({ variable, value, group }) => ({ variable, value, group })),
  requiredReadbackFields: [
    "contractVersion",
    "contractPayloadDigest",
    "artifact",
    "route",
    "readAt",
    "coveredRules",
    "coveredStorybookSections",
    "foundationVisualStandards",
    "consumerVisualStyleContract",
    "settingControlSelectionContract",
    "fieldValueSelectionContract",
    "dictionaryContentContract",
    "overlayBoundaryContract",
    "settingsLayoutContract",
    "pageHierarchyContract",
    "verificationCadenceContract",
    "operationFeedbackContract",
    "contentScopeContract",
    "consumerEvidenceContract",
    "consumerVerificationContract",
    "requiredProof",
    "noOverclaimBoundaries"
  ],
  requiredStorybookSectionChecklist,
  coveredStorybookSections,
  storybookGovernanceTraceability: {
    topLevelSections: storybookTopLevelSections,
    hierarchy: "section -> category -> story",
    requiredStoryFields: ["section", "category", "storyId", "sourcePath", "packageAuthority", "readiness", "proofPosture"],
    currentItemAutoOpenProof: "internal-alpha browser proof asserts active category expansion and aria-current location state",
    hiddenFocusSafetyProof: "nested story lists use hidden when collapsed; proof asserts no active story remains hidden and category buttons are keyboard reachable",
    mandatoryBoundaryVisibility:
      "The page-head boundary strip is the mandatory no-overclaim carrier and renders on every page outside optional disclosure; per-story proof and no-overclaim blocks live inside their story's optional disclosure."
  },
  changelogGovernance: {
    records: storybookGovernanceChangelogRecords,
    rootChangelog: "CHANGELOG.md",
    storybookStory: "change-log.html#local-changelog",
    digestAlignmentProof: "storybook smoke verifies contractPayloadDigest and changelog record/readback fields",
    requiredFields: ["date", "routeId", "plannedCommit", "affectedStoryIds", "aiContractDigestReadback", "proofArtifacts", "noOverclaimBoundaries"]
  },
  functionalDisplayStaticAuthority: {
    disposition: "static_contract_authority_explicit_and_smoke_proven",
    componentStory: "components.html#records-and-boards-components-spec",
    patternStory: "patterns.html#records-and-boards-patterns",
    admittedPackageExports: [
      "PageHeader",
      "ViewTabs",
      "QuickFilters",
      "RecordRow",
      "RecordTable",
      "SplitView",
      "RowGroup",
      "InlineCreate",
      "LaneBoard",
      "LaneBoard",
      "DetailLayout",
      "MetadataRail",
      "DetailInspector",
      "ActivityFeed",
      "StagePipeline",
      "AttachmentList",
      "MachineTokenCell"
    ],
    managerRuntimeCoverageDisposition:
      "CSF adapters expose the Components and Patterns top-level Storybook pages while static contract story ids are the authoritative Records and boards story coverage for this local checkpoint.",
    smokeCoverage:
      "storybook smoke and internal-alpha browser proof fail if Records and boards story ids, package-backed markers, relationship vocabulary, or no-live boundaries disappear.",
    noOverclaimBoundary:
      "Records and boards Storybook examples do not claim API integration, backend persistence, live dispatch, external queues, runtime data mutation, product adoption, owner acceptance, release readiness, package publication, or initiative completion."
  },
  documentsAndCollaborationStaticAuthority: {
    disposition: "static_contract_authority_explicit_and_smoke_proven",
    componentStory: "components.html#documents-and-collaboration-components-spec",
    admittedPackageExports: [
      "TreeNav",
      "DocumentCanvas",
      "TocRail",
      "InlineCommentList",
      "MetadataRail",
      "AttachmentList",
      "LabelSet",
      "VersionHistory",
      "TemplateGallery",
      "SearchResultList"
    ],
    smokeCoverage:
      "storybook smoke and package tests fail if Documents and collaboration story ids, package-backed markers, static local result boundaries, or sanitized evidence posture disappear.",
    noOverclaimBoundary:
      "Documents and collaboration Storybook examples do not claim backend publishing, live collaboration, external workspace integration, product adoption, owner acceptance, release readiness, package publication, or initiative completion."
  },
  foundationVisualStandards: foundationVisualStandardsReadback,
  foundationVisualStandardCategories: foundationVisualStandards,
  storybookDocShellVisualOracle,
  consumerVisualStyleContract,
  settingControlSelectionContract,
  fieldValueSelectionContract,
  dictionaryContentContract,
  overlayBoundaryContract,
  settingsLayoutContract,
  pageHierarchyContract,
  verificationCadenceContract,
  operationFeedbackContract,
  contentScopeContract,
  consumerEvidenceContract,
  consumerVerificationContract,
  visualEquivalenceLevels: [
    "same_package_version",
    "same_exported_component",
    "same_variant_props_slots",
    "same_storybook_visual_instance"
  ],
  storybookVisualParityProof:
    "Design System compliance requires the same Storybook visual instance, not merely package import or boundary markers. Product proof must compare DOM/component identity where available plus computed size, radius, padding, border, background, typography, spacing, hover/focus/active/disabled states, menu/search/drawer position, motion duration/easing/opacity/transform, theme transition, reduced-motion fallback, locale behavior, mobile reflow, and information hierarchy against the relevant Storybook section.",
  shellControlVisualParityProof: {
    disposition: "executable_required_for_product_shell_consumption",
    packageBackedAuthority: "@tcrn/ui-react/tcrnComponentCss",
    storybookStandard: "proof.html#owner-quality-product-shell",
    comparatorStandard: "components.html#navigation-shell-spec",
    controlOrder: ["brandButton", "pins", "cluster"],
    compositionRule:
      "ProductShell's band is composed by the package: the brand button, the pinned items and the cluster (the product's headerActions, the bell and the avatar). A product supplies the navigation model, the pins, the account and products, and optional search records through searchProvider; the search is a field of the full menu and of a pinned drop-down, never of the band. A product with no real global search capability passes no searchProvider, and proof must assert that no inert or placeholder search control is rendered and compare the band's controls against the package contract.",
    // The old top bar's rest, expanded and mobile caps (260 / 420 / 320) left with that top bar
    // (TCRN-DS-SUB-145): the search is now a field of the shell's layers (TCRN-DS-SUB-176).
    searchRestWidth: {
      fullMenuWidthPx: shellSearchGeometry.fullMenuWidthPx,
      fullMenuHeightPx: shellSearchGeometry.fullMenuHeightPx,
      dropDownWidthPx: shellSearchGeometry.dropDownWidthPx,
      dropDownHeightPx: shellSearchGeometry.dropDownHeightPx,
      rule: `ProductShellSearch is a field of the shell's layers, not of the band: the full menu's search fills the menu panel less its inset (${shellSearchGeometry.fullMenuWidthPx} x ${shellSearchGeometry.fullMenuHeightPx} at a 1440px viewport) and a pinned drop-down's search fills its column less its inset (${shellSearchGeometry.dropDownWidthPx} x ${shellSearchGeometry.dropDownHeightPx}); neither widens on focus or with results. Under a coarse pointer and in the phone's Sheet, the full menu's search takes the ${shellTokenPx("--tcrn-shell-touch")}px touch height.`
    },
    measuredControls: [
      "productLogo",
      "brandButton",
      "pins",
      "avatar",
      "themeToggle",
      "localeTrigger",
      "searchInput",
      "searchControl",
      "searchShortcut",
      "currentLocation",
      "selectedNavItem",
      "band",
      "paper"
    ],
    computedStyleFields: [
      "fontFamily",
      "fontSize",
      "fontWeight",
      "lineHeight",
      "letterSpacing",
      "color",
      "backgroundColor",
      "borderRadius",
      "borderStyle",
      "borderWidth",
      "boxShadow",
      "padding",
      "gap",
      "gridTemplateColumns"
    ],
    focusFields: [
      "outlineWidth",
      "outlineStyle",
      "outlineColor",
      "outlineOffset",
      "boxShadow"
    ],
    motionFields: [
      "transitionProperty",
      "transitionDuration",
      "transitionTimingFunction",
      "animationName",
      "animationDuration",
      "animationTimingFunction"
    ],
    stateCoverage: [
      "rest",
      "focus",
      "band-closed",
      "menu-expanded",
      "pin-drop",
      "search-results",
      "locale-closed",
      "locale-open",
      "theme-light",
      "theme-dark",
      "mobile-zh-CN-dark",
      "mobile-sheet",
      "reduced-motion"
    ],
    reducedMotionExpectation:
      "Reduced-motion proof must show shell/search/theme/menu/control transitions and animations disabled or reduced to the DS-approved zero-duration fallback.",
    rejectCriteria: [
      "docs-shell or Storybook global CSS changes package-backed ProductShell typography, selected nav styling, focus shadow, shortcut badge layout, control order, or motion",
      "AOS proof omits typography, spacing, focus, order, duration, easing, or reduced-motion comparisons against Storybook",
      "product-local shell/search/navigation/effect CSS is used to chase Storybook instead of package-backed DS controls"
    ]
  },
  visualInstanceOracles: [
    {
      id: "frontend-shell-slice",
      name: "AosFrontendShellSliceVisualInstance",
      route: "proof.html#frontend-shell-slice",
      disposition: "internal_registered_shell_proof_scaffold_not_owner_quality_target",
      supersededBy: "owner-quality-product-shell",
      packageMapping: [
        "ProductShell",
        "ProductShellSearch",
        "useProductShellController",
        "EnvironmentBanner",
        "InlineAlert",
        "ReadbackPanel",
        "KeyValueList",
        "ReferenceList",
        "TableShell",
        "StatusBadge",
        "DisclosurePanel"
      ],
      primaryIa: ["Cockpit", "Work"],
      requiredVariants: [
        "desktop-light-expanded-cockpit-search-results",
        "desktop-light-expanded-cockpit-search-rest",
        "desktop-dark-expanded-cockpit",
        "desktop-light-work",
        "mobile-dark-work-stacked",
        "reduced-motion"
      ],
      requiredVariantFixtures: [
        {
          id: "desktop-light-expanded-cockpit-search-results",
          selector: "[data-storybook-visual-instance=\"frontend-shell-slice\"][data-visual-instance-variant=\"desktop-light-expanded-cockpit-search-results\"]",
          expectedState: {
            theme: "light",
            locale: "en",
            shellState: "expanded",
            selectedRoute: "cockpit",
            search: "results",
            searchExpanded: true,
            searchResultsVisible: true,
            viewport: "desktop",
            reducedMotion: false,
            content: "cockpit"
          }
        },
        {
          id: "desktop-light-expanded-cockpit-search-rest",
          selector: "[data-storybook-visual-instance=\"frontend-shell-slice\"][data-visual-instance-variant=\"desktop-light-expanded-cockpit-search-rest\"]",
          expectedState: {
            theme: "light",
            locale: "en",
            shellState: "closed",
            selectedRoute: "cockpit",
            search: "rest",
            searchExpanded: false,
            searchResultsVisible: false,
            viewport: "desktop",
            reducedMotion: false,
            content: "cockpit"
          }
        },
        {
          id: "desktop-dark-expanded-cockpit",
          selector: "[data-storybook-visual-instance=\"frontend-shell-slice\"][data-visual-instance-variant=\"desktop-dark-expanded-cockpit\"]",
          expectedState: {
            theme: "dark",
            locale: "en",
            shellState: "closed",
            selectedRoute: "cockpit",
            search: "rest",
            searchExpanded: false,
            searchResultsVisible: false,
            viewport: "desktop",
            reducedMotion: false,
            content: "cockpit"
          }
        },
        {
          id: "desktop-light-work",
          selector: "[data-storybook-visual-instance=\"frontend-shell-slice\"][data-visual-instance-variant=\"desktop-light-work\"]",
          expectedState: {
            theme: "light",
            locale: "en",
            shellState: "closed",
            selectedRoute: "work",
            search: "rest",
            searchExpanded: false,
            searchResultsVisible: false,
            viewport: "desktop",
            reducedMotion: false,
            content: "work"
          }
        },
        {
          id: "mobile-dark-work-stacked",
          selector: "[data-storybook-visual-instance=\"frontend-shell-slice\"][data-visual-instance-variant=\"mobile-dark-work-stacked\"]",
          expectedState: {
            theme: "dark",
            locale: "zh-CN",
            shellState: "closed",
            selectedRoute: "work",
            search: "rest",
            searchExpanded: false,
            searchResultsVisible: false,
            viewport: "mobile",
            reducedMotion: false,
            content: "work"
          }
        },
        {
          id: "reduced-motion",
          selector: "[data-storybook-visual-instance=\"frontend-shell-slice\"][data-visual-instance-variant=\"reduced-motion\"]",
          expectedState: {
            theme: "light",
            locale: "en",
            shellState: "closed",
            selectedRoute: "cockpit",
            search: "rest",
            searchExpanded: false,
            searchResultsVisible: false,
            viewport: "desktop",
            reducedMotion: true,
            content: "cockpit"
          }
        }
      ],
      delegatedInteractionProofs: [
        "Locale menu dismissal and focus return are delegated to ShellLocaleMenu/ProductShell interaction sub-oracles.",
        "Search blur/outside-pointer/tab/Escape dismissal is delegated to ProductShellSearch and field/search sub-oracles.",
        "This oracle proves rendered visual states and remains blocked from owner visual admission until review completes."
      ],
      ownerVisualAdmissionBoundary: "internal_ds_oracle_review_required_before_owner_visual_admission",
      persistedCockpitRestPolicy: {
        defaultCockpitRestVariant: "desktop-light-expanded-cockpit-search-rest",
        ownerReviewRoutesMustBeDeterministic: true,
        coveredOwnerReachableRoutes: [
          "/",
          "/cockpit",
          "/cockpit?locale=en&theme=light",
          "post-search-dismissal:/cockpit?locale=en&theme=light&search=shell"
        ],
        routePersistenceBoundary:
          "Owner-review routes must not inherit localStorage into unadmitted visual states; product persistence may remain DS-defined outside reviewed parity routes.",
        notAutomaticallyAdmitted: [
          "zh-CN Cockpit rest",
          "dark zh-CN Cockpit rest",
          "mobile Cockpit rest"
        ],
        outsideMatrixMarkerForbiddenForOwnerReview: "aos-route-state-outside-accepted-oracle-matrix"
      },
      negativeCriteria: [
        "no Storybook-only prototype classes",
        "no product-local visible CSS/effect system",
        "no deprecated AOS wordmark assets",
        "no unregistered primary IA",
        "no raw API/debug payload as primary UX",
        "no owner/product/release/live-dispatch readiness claim"
      ]
    },
    {
      id: "owner-quality-product-shell",
      name: "OwnerQualityShellOracle",
      route: "proof.html#owner-quality-product-shell",
      disposition: "owner_quality_candidate_requires_ds_review_before_product_use",
      replacesOwnerQualityTarget: "frontend-shell-slice",
      packageMapping: [
        "ProductShell",
        "ProductShellSearch",
        "useProductShellController",
        "ProductLogo",
        "tcrnProductLogoRegistry",
        "Surface",
        "RecordTable",
        "TableShell",
        "KeyValueList",
        "StatusBadge",
        "Badge",
        "ReferenceList",
        "EnvironmentBanner",
        "DisclosurePanel",
        "Heading",
        "Text"
      ],
      primaryIa: ["Operations Cockpit", "Work queue"],
      requiredVariants: [
        "desktop-light-operations-cockpit",
        "desktop-dark-operations-cockpit",
        "desktop-light-work-queue",
        "mobile-dark-zh-cn-work-queue",
        "desktop-light-operations-search-results",
        "reduced-motion"
      ],
      requiredVariantFixtures: [
        {
          id: "desktop-light-operations-cockpit",
          selector: "[data-storybook-visual-instance=\"owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-light-operations-cockpit\"]",
          expectedState: {
            theme: "light",
            locale: "en",
            shellState: "closed",
            selectedRoute: "cockpit",
            search: "rest",
            searchExpanded: false,
            searchResultsVisible: false,
            viewport: "desktop",
            reducedMotion: false,
            content: "cockpit"
          }
        },
        {
          id: "desktop-dark-operations-cockpit",
          selector: "[data-storybook-visual-instance=\"owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-dark-operations-cockpit\"]",
          expectedState: {
            theme: "dark",
            locale: "en",
            shellState: "closed",
            selectedRoute: "cockpit",
            search: "rest",
            searchExpanded: false,
            searchResultsVisible: false,
            viewport: "desktop",
            reducedMotion: false,
            content: "cockpit"
          }
        },
        {
          id: "desktop-light-work-queue",
          selector: "[data-storybook-visual-instance=\"owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-light-work-queue\"]",
          expectedState: {
            theme: "light",
            locale: "en",
            shellState: "closed",
            selectedRoute: "work",
            search: "rest",
            searchExpanded: false,
            searchResultsVisible: false,
            viewport: "desktop",
            reducedMotion: false,
            content: "work"
          }
        },
        {
          id: "mobile-dark-zh-cn-work-queue",
          selector: "[data-storybook-visual-instance=\"owner-quality-product-shell\"][data-visual-instance-variant=\"mobile-dark-zh-cn-work-queue\"]",
          expectedState: {
            theme: "dark",
            locale: "zh-CN",
            shellState: "closed",
            selectedRoute: "work",
            search: "rest",
            searchExpanded: false,
            searchResultsVisible: false,
            viewport: "mobile",
            reducedMotion: false,
            content: "work"
          },
          requiredText: ["工作项", "状态", "负责人", "需要评审", "已阻止", "未配置", "仅本地证明"],
          forbiddenText: ["Work item", "State", "Unknown", "Blocked", "Not configured", "Local proof only"]
        },
        {
          id: "desktop-light-operations-search-results",
          selector: "[data-storybook-visual-instance=\"owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-light-operations-search-results\"]",
          expectedState: {
            theme: "light",
            locale: "en",
            shellState: "expanded",
            selectedRoute: "cockpit",
            search: "results",
            searchExpanded: true,
            searchResultsVisible: true,
            viewport: "desktop",
            reducedMotion: false,
            content: "cockpit"
          }
        },
        {
          id: "reduced-motion",
          selector: "[data-storybook-visual-instance=\"owner-quality-product-shell\"][data-visual-instance-variant=\"reduced-motion\"]",
          expectedState: {
            theme: "light",
            locale: "en",
            shellState: "closed",
            selectedRoute: "cockpit",
            search: "rest",
            searchExpanded: false,
            searchResultsVisible: false,
            viewport: "desktop",
            reducedMotion: true,
            content: "cockpit"
          }
        }
      ],
      slots: [
        "registered product logo lockup",
        "ProductShell full menu from the brand button",
        "band pins and avatar cluster",
        "ProductShellSearch rest/results surface",
        "product-first route context",
        "record queue and stage references",
        "secondary developer detail disclosure"
      ],
      ownerQualityAcceptanceCriteria: [
        "first viewport reads as a product shell with registered product identity in the band's brand button",
        "exactly one primary H1 per rendered fixture",
        "product content leads with current records, stages, references, decisions, owner actions, service health, and activity",
        "zh-CN owner-quality fixtures localize critical first-viewport table headers and state labels",
        "ProductShell band controls stay within the fixture root and viewport without horizontal clipping",
        "desktop owner-quality routes render the band closed, and the search-results route holds the full menu open",
        "mobile owner-quality routes open the full menu as a Sheet from the brand button",
        "read-only and no-live-dispatch boundaries are visible but low-prominence",
        "developer proof/API/readback details are secondary disclosure",
        "primary modules are meaningful functional destinations rather than placeholder labels"
      ],
      rejectCriteria: [
        "first viewport headline is a frontend shell slice, local structural slice, placeholder shell, or generic dummy label",
        "implementation/proof/debug terminology dominates the first viewport",
        "no-overclaim copy becomes the primary product story",
        "runtime, audit, or verification metrics lead the hierarchy",
        "ProductShell band, search, locale, or theme controls are cropped or create root/band horizontal overflow",
        "a side rail or a collapse control appears in the shell, or a route renders outside the admitted variant matrix",
        "visible local product CSS/effects or Storybook-only prototype classes appear",
        "owner/product/release/live-dispatch readiness is claimed"
      ],
      delegatedSubOracles: [
        "ProductShell owns responsive posture, theme, locale, focus, reduced-motion behavior, the full menu, and the pins and their drop-downs for this owner-quality oracle.",
        "On a phone the brand button opens the full menu as a Sheet; the shell has no side rail and no collapse affordance.",
        "ProductShellSearch owns search rest/results/dismissal behavior.",
        "This owner-quality oracle defines first-viewport hierarchy and copy semantics; product adoption remains separate."
      ],
      ownerVisualAdmissionBoundary: "internal_ds_oracle_review_required_before_owner_visual_admission",
      negativeCriteria: [
        "no proof-scaffold headline as Level 1 content",
        "no placeholder shell or structural-placeholder first viewport",
        "no primary raw API/debug/readback payload",
        "no deprecated product wordmark assets",
        "no unregistered primary IA",
        "no owner/product/release/live-dispatch readiness claim"
      ]
    }
  ],
  requiredBeforeProductFrontendImplementation: [
    "read_ai_consumption_contract",
    "read_every_required_storybook_section",
    "read_foundation_visual_standards",
    "consume_consumer_visual_style_contract",
    "prove_same_storybook_visual_instance_not_only_package_import",
    "use_tcrn_i18n_and_copy_state",
    "use_registered_product_logo_asset_or_route_logo_admission",
    "use_registered_product_logo_components_for_product_identity",
    "reject_unregistered_or_deprecated_brand_assets",
    "import_package_backed_ds_primitives",
    "consume_page_hierarchy_contract",
    "consume_operation_feedback_contract",
    "consume_content_scope_contract",
    "run_consumer_evidence_validator",
    "follow_ds_verification_cadence",
    "use_design_tokens_and_accessibility_rules",
    "verify_light_and_dark_storybook_theme_contract",
    "verify_motion_effect_parity_and_reduced_motion",
    "preserve_compact_storybook_shell_controls",
    "prove_product_shell_visual_oracle_skin",
    "use_product_shell_semantic_control_api",
    "prove_locale_popup_dismissal_and_focus_return",
    "prove_top_band_full_menu_and_pins",
    "offer_an_in_product_way_back_from_drilled_down_routes",
    "transport_locale_and_theme_in_a_server_readable_store",
    "use_records_and_boards_patterns_for_static_record_surfaces",
    "use_documents_and_collaboration_patterns_for_static_document_surfaces",
    "block_unregistered_modules_from_primary_navigation",
    "prove_browser_interactions_not_static_markers",
    "prove_product_adoption_before_ds_compliance_claim"
  ],
  requiredProof: [
    "contract_story_readback",
    "i18n_copy_state_receipt",
    "brand_surface_receipt",
    "forbidden_brand_asset_absence_receipt",
    "package_import_receipt",
    "storybook_doc_shell_package_boundary_receipt",
    "foundation_visual_standards_registry_receipt",
    "consumer_visual_style_contract_receipt",
    "theme_mode_receipt",
    "storybook_shell_control_receipt",
    "storybook_doc_shell_visual_oracle_receipt",
    "locale_popup_dismissal_receipt",
    "top_band_navigation_receipt",
    "navigation_reversibility_receipt",
    "server_rendered_preference_receipt",
    "functional_display_static_pattern_receipt",
    "documents_and_collaboration_static_pattern_receipt",
    "registered_navigation_receipt",
    "browser_interaction_receipt",
    "storybook_section_coverage_receipt",
    "visual_equivalence_receipt",
    "motion_effect_receipt",
    "setting_control_selection_receipt",
    "settings_layout_container_receipt",
    "page_hierarchy_receipt",
    "overlay_boundary_placement_receipt",
    "field_value_cardinality_receipt",
    "dictionary_content_receipt",
    "operation_feedback_receipt",
    "content_scope_receipt",
    "consumer_evidence_verification_receipt",
    "verification_cadence_receipt",
    "full_surface_inventory_receipt",
    "consumer_negative_leg_receipt",
    "product_adoption_route_receipt"
  ],
  supportedThemeModes: ["light", "dark"],
  // A consumer reported every page flashing English light-mode before settling
  // into their chosen locale and theme. The contract required the controls, the
  // five locales, and both theme modes, and said nothing about when the choice
  // has to be known — so a product could satisfy every clause and still render
  // its first paint in the default, because the preference lived in
  // localStorage, which the server cannot read.
  //
  // The rule is about arrival time, not storage. A preference the server cannot
  // see is a preference the first paint cannot honour, and no amount of
  // client-side correction removes the flash; it only shortens it.
  preferenceTransport: {
    disposition: "server_readable_transport_required_for_server_rendered_products",
    governedPreferences: ["locale", "theme", "pins"],
    precedence: ["explicit_url_query", "server_readable_store", "product_default"],
    precedenceRule:
      "An explicit query parameter outranks a stored preference so a shared link lands on what the sender saw; the stored preference outranks the product default so a returning reader does not have to re-choose. A product that reads only one of the two cannot serve both cases.",
    serverReadableStores: ["cookie", "request_header", "server_side_session"],
    clientOnlyStores: ["localStorage", "sessionStorage", "indexeddb"],
    clientOnlyStoreRule:
      "A client-only store may cache a preference but must not be its only home in a server-rendered product: the server cannot read it, so the first paint uses the default and corrects itself after hydration. That correction is visible, and it is visible on every navigation, not only the first.",
    requiredProof:
      "Fetch a route with the preference set in the server-readable store and no query parameter, and assert the preference is present in the first response body — not merely in the DOM after hydration. A proof that inspects the settled page cannot distinguish a correct first paint from a corrected one.",
    productAcceptanceClaim: false
  },
  forbiddenBrandAssets: [
    "tcrn-aos-wordmark-geometric-dark.png",
    "tcrn-aos-wordmark-geometric-dark-preview.png",
    "tcrn-aos-wordmark-geometric-spec.md",
    "tcrn-aos-wordmark.png",
    "tcrn-aos-wordmark.svg",
    "aos-favicon.png",
    "favicon.ico"
  ],
  productLogoRegistry: publishedProductLogoRegistry,
  brandAssetSource: {
    url: "https://tcrn-design-system-storybook.vercel.app/tcrn-brand-mark.svg",
    mimeType: "image/svg+xml",
    assetId: "tcrn-brand-mark",
    sourceBoundary: "apps/storybook/assets is development input; consumers fetch the published Storybook asset URL.",
    verificationCommand: "curl --fail --silent --show-error --location --head 'https://tcrn-design-system-storybook.vercel.app/tcrn-brand-mark.svg'",
    sha256: "5f28f17c599c63a05a51c81be03f9ef7845299af1940ebe6aef61f7af47fc25b"
  },
  // The four product marks, each in color and mono: eight local files registered by
  // digest. scripts/brand-asset-source-proof.mjs recomputes every sha256 and compares
  // the package's renditions with the file bytes, so one changed byte turns it red.
  // The marks are not published (publication is an Owner stop), so unlike the mother
  // mark above there is no remote URL to check yet. The mono files carry the contract's
  // mono ink; the package's mono rendition draws currentColor in its place.
  productMarkSources: {
    sourceDirectory: "docs/design/gplus-2026-10/logos2",
    designContract: "docs/design/gplus-2026-10/contract/marks.json",
    packageExports: ["TcrnBrandMark productId variant", "tcrnProductMarkSvg(productId, variant, { ink })"],
    variants: ["color", "mono", "tile-tint", "tile-deep"],
    remotePublication: "not published; local digest only",
    files: [
      { productId: "tms", variant: "color", path: "docs/design/gplus-2026-10/logos2/tms.svg", bytes: 357, sha256: "5bc00be377752865055228d65306c6474a8506f9deae9e94a57f1f5a9f514eab" },
      { productId: "tms", variant: "mono", path: "docs/design/gplus-2026-10/logos2/tms-mono.svg", bytes: 357, sha256: "3499dd42780ea17447420110f819fd1c0261b8269828776ea43305353bcb132c" },
      { productId: "einzbern", variant: "color", path: "docs/design/gplus-2026-10/logos2/einzbern.svg", bytes: 358, sha256: "8cc4e309c9d71175f507a0024d7218d5aa03787b80237c3ccfd58bbc7332f0d7" },
      { productId: "einzbern", variant: "mono", path: "docs/design/gplus-2026-10/logos2/einzbern-mono.svg", bytes: 358, sha256: "ea55dde0d50080c2f4e64e743cffa60b202bcb7d6cf55faac1034f26256c8425" },
      { productId: "mana-orchestrate", variant: "color", path: "docs/design/gplus-2026-10/logos2/mana.svg", bytes: 328, sha256: "debfe48dd2773728d64f847f5454d6d6071a7ba074326e7da7a63703ec750296" },
      { productId: "mana-orchestrate", variant: "mono", path: "docs/design/gplus-2026-10/logos2/mana-mono.svg", bytes: 328, sha256: "7a645886fbe626ae4980c65b975a1dea29a10e10836f8a0f3484dca9734811a9" },
      { productId: "design-system", variant: "color", path: "docs/design/gplus-2026-10/logos2/ds.svg", bytes: 392, sha256: "03b1f776e9d8ba899976f09a32e9206b0ce4960d7d6d1788eb50a4a4801f6cdc" },
      { productId: "design-system", variant: "mono", path: "docs/design/gplus-2026-10/logos2/ds-mono.svg", bytes: 392, sha256: "19eafbd0497f764132c90bf4fbe4db34a8b7a4046ad7aa49b464a2b1f71c06ce" }
    ]
  },
  brandSurfaceDisposition:
    "Product implementations may use admitted brand assets and package-backed brand primitives only. ProductLogo and tcrnProductLogoRegistry are registered @tcrn/ui-react exports for product identity and must preserve the product-specific suffix color hierarchy used by package ProductLockup. TCRN stays in ink at medium weight as the mother-brand base; a TCRN product suffix carries the strong weight and the product's deep color from the brand-suffix tokens, one value in both themes (TMS #2c63c8, Design System #6577f3; never gradient text; whether the night TMS suffix takes a brighter value is an open Owner decision, D7, and until it is ruled on the suffix stays #2c63c8 by night), and long suffixes such as Design System must stack under TCRN instead of running inline. Einzbern and Mana Orchestrate are whole names in Source Serif 4 in ink with the by TCRN byline. A registered product draws its own product mark inline (TcrnBrandMark productId); the TCRN mother mark image stays for AOS and for lockups without a productId. ShellBrandLockup/ProductLockup remain package-backed primitives but accepted product surfaces must not compose product identity from free-form suffix/caption text when a registered product logo exists. Generic icons, text-only substitutes, and deprecated or unregistered AOS wordmark image assets are forbidden product shell inputs.",
  i18nDisposition:
    "All visible product UI copy must use the approved locale and copy-state contract before rendering.",
  componentConsumptionDisposition:
    "Product implementations must import package-backed Design System primitives for ProductShell, NavGroup, NavItem, SearchInput, ShellThemeToggle, ShellLocaleMenu, ProductLogo, status, OperationFeedback, ContentScope, readback, table, spacing/rhythm, disclosure, and Records and boards surfaces including RelationshipChip, MachineToken, MachineTokenCell, SubNav, PageHeader, ViewTabs, QuickFilters, RecordRow, RecordTable, SplitView, RowGroup, InlineCreate, LaneBoard, DetailLayout, MetadataRail, DetailInspector, ActivityFeed, RelationGraph, StagePipeline, AttachmentList, RecordInspector, and SavedViewToolbar, plus static Documents and collaboration surfaces including TreeNav, DocumentCanvas, TocRail, InlineCommentList, MetadataRail, AttachmentList, LabelSet, VersionHistory, TemplateGallery, and SearchResultList, instead of rebuilding reusable local clones. TopBar, SideNav, SideNavCollapseButton, MobileNavToggle, ProductLauncher and ProductSwitcher are deprecated, see M23: the band, the full menu and the avatar menu replace them. ProductShell search is composable by consumer capability: ProductShellSearch and the full menu's searchProvider are required only when the product exposes a real global search surface, and must be omitted rather than rendered as an inert placeholder when no global search exists. Product shell state/effect behavior must use ProductShell semantic callbacks or useProductShellController prop bundles including productShellControlProps, optional productShellSearchProps, shellLocaleMenuProps, and shellThemeToggleProps; product consumers may supply only IA/data, route labels, locale data, pins, optional search records, content slots, and DS-defined callbacks such as onPinnedChange, onMenuOpenChange, onThemeChange, onLocaleMenuOpenChange, onLocaleChange, and, when search is present, onSearchQueryChange, searchProvider, and onSearchResultActivate. A server-rendered product parses the request's Cookie header with the exported readPreferenceCookieValues and passes the narrowed theme and locale, with the pins its backend stores, to useProductShellController as requestPreferences, so the shell's stored preferences are readable during the render that produces the first paint; the raw Cookie header must not cross the package boundary, because it carries every cookie the product's requests hold while the shell reads only theme and locale from it. The controller writes theme and locale to both a cookie and the client store, so a product must not hand-roll its own preference parsing or persistence to work around a client-only store.",
  recordsAndBoardsPatternDisposition:
    "Functional display package exports cover static records, stages, relations, documents, and machine-token presentation, compact route context, local view tabs, quick filters, dense rows and lists, split detail, row groups, static create affordances, lane-board density, metadata rails, activity feeds, relation chips, stage pipelines, attachment lists, saved-view controls, record inspection, and machine-token containment. They are local Storybook contract patterns only: API integration, backend persistence, live dispatch, external queues, runtime data mutation, product adoption, owner acceptance, release readiness, and package publication are not claimed.",
  documentsAndCollaborationPatternDisposition:
    "Documents and collaboration package exports cover static page trees, document canvas, table of contents, inline comments, metadata rails, attachment lists, labels, version history, templates, and local result lists. They are local Storybook contract patterns only: backend publishing, live collaboration, external workspace integration, runtime data mutation, product adoption, owner acceptance, release readiness, and package publication are not claimed.",
  storybookDocShellAuthorityDisposition:
    "The Storybook documentation frontend renders the top-band shell: every documentation page is the package-backed ProductShell, marked data-shell='doc' and data-doc-shell='online-docs' on its root. Its band ([data-shell-strip], no fill and no rule) holds the brand button ([data-shell-brand]), the pinned sections and the avatar cluster ([data-cluster], [data-shell-avatar]); the brand button opens the full menu ([data-shell-menu]) with the search and the section, category and story rows, and the avatar menu holds the theme toggle and the language menu. The page sits on the paper ([data-paper]) under its breadcrumb, and the page's own contents (TocRail) stay in the page, not in the navigation. There is no resident side rail and no collapse button. ProductShell instances in story bodies, the shell stories and the AOS visual instances are component examples and product consumer rules; they never replace the documentation shell.",
  tokenConsumptionDisposition:
    "Product implementations must use Design System tokens, reduced-motion rules, and accessibility states before custom CSS.",
  themeModeDisposition:
    "Product implementations must preserve semantic token behavior across light and dark Storybook shell modes and prove both modes before claiming Design System compliance.",
  storybookDocShellControlContract: {
    implementationBoundary:
      "The global Storybook shell is the package ProductShell in its top-band form, marked data-shell='doc' and data-doc-shell='online-docs', with its own hooks: [data-shell-strip], [data-shell-brand], [data-cluster], [data-shell-avatar] and [data-paper], and two layers, the full menu ([data-shell-menu]) and the avatar menu. It occurs once per page, on the documentation shell itself; a ProductShell inside a story body is a component or product example and must not replace the global page shell.",
    themeToggle:
      "The Storybook docs shell uses one compact circular icon-only theme toggle that reflects the current mode and toggles only on explicit activation.",
    visualSkin:
      "The Storybook doc-shell skin is measured against the committed internal-alpha perceptual visual-signature baseline docs/verification/internal-alpha/visual-signature-baseline.json (tolerance meanAbsolute<=2 / maxCell<=8) enforced by internal-alpha browser proof. Browser proof must assert doc-shell selector authority, the full menu's section and category rows, the band's geometry (52 high, no fill and no rule, the 134 x 40 brand button), the paper under the band, the full menu's search geometry, the avatar menu's theme and language controls, no global ProductShell shell replacement, no zh-CN shell leaks, and mobile no-overflow posture.",
    themeTransition:
      "Theme changes must use one whole-page transition through the root View Transition API when available, with a single full-page fallback wash; the band, the paper, and the page must not darken as independent sections.",
    localeSelector:
      "The language control uses a globe trigger plus the current locale name in that locale; menu options use native names only and avoid long bilingual labels. Locale popups close on selection, outside pointer down or click, and Escape; aria-expanded reflects state, and focus returns to the trigger when dismissed by keyboard or selection.",
    search:
      "The shell's search is a field of the full menu and of a pinned drop-down, never of the band: it stays compact at rest and keeps its width on focus, lists its results in the menu, and only the one shell on a page that registers the Ctrl K / Cmd K shortcut shows it.",
    aiContractAccess:
      "AI consumption contract access remains in the Proof story and static ai-consumption-contract.json artifact, not in the human top toolbar."
  },
  productShellHardeningRules: {
    topBandNavigation:
      "Product and documentation shells are the top-band shell, with no resident side rail and no collapse control. Navigation is ProductShell's navGroups: NavGroup and NavItem rows in the full menu under the brand button and in the pinned drop-downs, the current page as the menu's current row and the paper's breadcrumb, and on a phone the full menu as a Sheet. SideNav, SideNavCollapseButton and MobileNavToggle are deprecated, see M23; proof must assert the brand button, the pins and their drop-downs, and that no rail and no collapse control render.",
    brandSurface:
      "Product shells must use registered package-backed ProductLogo assets with product-specific suffix color hierarchy or route logo admission before product use; generic icons, free-form suffix/caption identity, text-only substitutes, and deprecated AOS wordmark images are not accepted brand marks.",
    registeredNavigation:
      "Product shells must not surface unregistered or planned modules as primary navigation, registered module cards, or active product IA before an owning route admits them.",
    navigationReversibility:
      "A route a reader can only arrive at by drilling down must offer an in-product way back to its parent. The browser's back button does not satisfy this: it is not the product's, it does not survive a deep link or a refresh, and a reader who arrived by a shared URL has no history to go back through. The accepted affordance is a Breadcrumb whose ancestor crumbs carry href and whose current crumb does not — an all-inert trail is a location label, not a way back, and it is what a consumer shipped when the component offered no href at all. A primary navigation entry pointing at the parent list does not count: it discards the scope the reader arrived with, so it starts them over rather than taking them back. Proof must assert the anchor inside the trail on a route addressed by record identity, not the presence of the trail element.",
    primitiveConsumption:
      "Product frontends must consume registered package-backed primitives from @tcrn/ui-react, including ProductShell/useProductShellController for the band, the full menu, the pins and the shell's effects and semantic control callbacks, and ProductShellSearch or the full menu's searchProvider only when a real product global search capability is present. Products must not create reusable local clones for shell, navigation, search, theme, locale, status, readback, table, or disclosure behaviors without a DS admission route.",
    shellEffectBoundary:
      "The package-backed ProductShell boundary owns the band's layout (the brand button, the pins and the cluster), the full menu, the pinned drop-downs and the phone's Sheet, the paper, responsive desktop/mobile posture, optional search result surfaces when a product exposes real global search, locale menu open-state markers and dismissal/focus-return hooks, theme-toggle transition hooks, one whole-page transition/fallback wash styling, focus treatment, reduced-motion behavior, and light/dark token behavior. Product routes may pass IA/data/content, pins, optional search records, and DS-defined callbacks but must not fork those effects.",
    semanticControlApi:
      "AOS-style product shells must consume ProductShell semantic props or useProductShellController prop bundles for onPinnedChange, onMenuOpenChange, onThemeChange, onLocaleMenuOpenChange, and onLocaleChange. When a product exposes real global search, it must additionally serve the full menu's search through searchProvider, or consume ProductShellSearch through package-backed search props and callbacks such as onSearchQueryChange, onSearchExpandedChange, onSearchDismiss, and onSearchResultActivate. Products with no real global search capability must omit the search rather than rendering an inert placeholder. Wrapper-level event delegation around rendered controls is not a valid substitute for the package boundary.",
    browserProof:
      "Product adoption proof must exercise rendered browser interactions, including menu dismissal, the full menu, and the pins and their drop-downs, rather than relying only on static marker checks."
  },
  forbiddenClaims: [
    "storybook_docs_publication",
    "hosted_doc_readiness",
    "package_publication",
    "automatic_component_registration",
    "automatic_product_adoption",
    "aos_tms_acceptance",
    "release_readiness",
    "owner_intent_live_dispatch"
  ],
  noOverclaimBoundaries: [
    "local_storybook_contract_only",
    "consumer_product_adoption_separate",
    "aos_tms_mutation_not_authorized",
    "package_publication_not_claimed",
    "hosted_docs_readiness_not_claimed"
  ]
} as const;

export type AiConsumptionContract = typeof aiConsumptionContract;
