import type { ContractStoryGroup } from "./types.js";

export interface StoryCategoryDefinition {
  id: string;
  label: string;
  description: string;
}

export interface StoryGovernanceMetadata {
  categoryId: string;
  sourcePath: string;
  packageAuthority: string;
  readiness: string;
  proofPosture: string;
}

export interface StorybookGovernanceChangelogRecord {
  date: string;
  routeId: string;
  plannedCommit: string;
  affectedStoryIds: string[];
  aiContractDigestReadback: string;
  proofArtifacts: string[];
  noOverclaimBoundaries: string[];
}

export const storybookTopLevelSections: readonly ContractStoryGroup[] = [
  "Welcome",
  "Style Guide",
  "Foundations",
  "Components",
  "Patterns",
  "Proof",
  "Change Log"
] as const;

export const storyCategoryDefinitions: Record<ContractStoryGroup, readonly StoryCategoryDefinition[]> = {
  Welcome: [
    { id: "governance-entry", label: "Governance entry", description: "Reader orientation and claim boundaries." },
    { id: "routing-contribution", label: "Routing and contribution", description: "Maintainer routing, contribution model, and release policy." }
  ],
  "Style Guide": [
    { id: "identity-brand", label: "Identity and brand", description: "Brand assets, logo rules, and semantic color roles." },
    { id: "type-layout", label: "Type and layout", description: "Typography, grid, spacing, and responsive density." },
    { id: "interaction-copy", label: "Interaction and copy", description: "Motion, states, icons, and copy creation rules." }
  ],
  Foundations: [
    { id: "tokens-i18n", label: "Tokens and i18n", description: "Design tokens, locale, theme, and copy-state contracts." },
    { id: "copy-governance", label: "Copy governance", description: "Product copy rules, ProductShell controls, and unsupported copy boundaries." }
  ],
  Components: [
    { id: "component-inventory", label: "Component inventory", description: "Package-backed inventory, display primitives, and disclosure primitives." },
    { id: "controls-data", label: "Controls and data", description: "Buttons, fields, tables, and dense data primitives." },
    { id: "navigation-shells", label: "Navigation and shells", description: "Navigation, ProductShell, AOS visual instances, and shell control contracts." },
    { id: "overlays", label: "Overlays", description: "Dialog, drawer, popover, and focus behavior contracts." },
    { id: "work-management", label: "Work Management", description: "Package-backed Work Management components and execution-record containment." },
    { id: "knowledge-management", label: "Knowledge Management", description: "Package-backed static Knowledge components, sanitized references, and no-live publishing boundaries." }
  ],
  Patterns: [
    { id: "forms-workbench", label: "Forms and workbench", description: "Form, workbench, and local filtering patterns." },
    { id: "work-management", label: "Work Management", description: "Work hierarchy, board, gate, evidence, and saved-view composition." },
    { id: "feedback-selection", label: "Feedback and selection", description: "Readiness, selection, modal validation, and blocked-state patterns." },
    { id: "data-pages", label: "Data and pages", description: "Data grid escalation, large-list search, and dashboard page templates." }
  ],
  Proof: [
    { id: "proof-governance", label: "Proof governance", description: "Proof matrix, AI contract, blocked actions, and focus proof." }
  ],
  "Change Log": [
    { id: "governance-records", label: "Governance records", description: "Durable Storybook and root changelog records." }
  ]
};

export interface StoryRegistryEntry {
  id: string;
  group: ContractStoryGroup;
  categoryId: string;
}

// Single ordered source of truth for the section -> category -> story tree.
// The order MUST equal the kernel concatenation of groups/*.ts (contractStories);
// the smoke.test tie-gate asserts storyRegistryOrder deep-equals contractStories on
// {id, group, categoryId}, tying this list to actual page emission so it cannot drift.
// The four gate trees derive from this one list (so a new story costs one entry here
// plus its 5-locale title and one CSF export, not four hand edits):
//   - build/ai-consumption-contract.ts requiredStorybookSectionChecklist + coveredStorybookSections
//   - scripts/storybook-smoke.mjs requiredStories
//   - scripts/internal-alpha-browser-proof.mjs requiredStories (via scripts/lib/storybook-id.mjs)
// storyCategoryById (below) is derived from this list; nothing else may reorder it.
export const storyRegistryOrder: readonly StoryRegistryEntry[] = [
  { id: "welcome-governance", group: "Welcome", categoryId: "governance-entry" },
  { id: "governance-boundaries", group: "Welcome", categoryId: "governance-entry" },
  { id: "maintainers-routing", group: "Welcome", categoryId: "routing-contribution" },
  { id: "contribution-model", group: "Welcome", categoryId: "routing-contribution" },
  { id: "release-bug-policy", group: "Welcome", categoryId: "routing-contribution" },
  { id: "brand-identity", group: "Style Guide", categoryId: "identity-brand" },
  { id: "color-palette", group: "Style Guide", categoryId: "identity-brand" },
  { id: "text-styles", group: "Style Guide", categoryId: "type-layout" },
  { id: "grid-system", group: "Style Guide", categoryId: "type-layout" },
  { id: "icons-motion", group: "Style Guide", categoryId: "interaction-copy" },
  { id: "global-states", group: "Style Guide", categoryId: "interaction-copy" },
  { id: "copy-creation-rules", group: "Style Guide", categoryId: "interaction-copy" },
  { id: "tokens-copy-state", group: "Foundations", categoryId: "tokens-i18n" },
  { id: "i18n-theme-contract", group: "Foundations", categoryId: "tokens-i18n" },
  { id: "foundation-visual-standards", group: "Foundations", categoryId: "tokens-i18n" },
  { id: "copy-guidelines", group: "Foundations", categoryId: "copy-governance" },
  { id: "component-family-index", group: "Components", categoryId: "component-inventory" },
  { id: "display-primitives-spec", group: "Components", categoryId: "component-inventory" },
  { id: "interaction-disclosure-spec", group: "Components", categoryId: "component-inventory" },
  { id: "stamp-spec-usage", group: "Components", categoryId: "controls-data" },
  { id: "button-spec-usage", group: "Components", categoryId: "controls-data" },
  { id: "field-spec-usage", group: "Components", categoryId: "controls-data" },
  { id: "navigation-shell-spec", group: "Components", categoryId: "navigation-shells" },
  { id: "aos-frontend-shell-slice", group: "Components", categoryId: "navigation-shells" },
  { id: "aos-owner-quality-product-shell", group: "Components", categoryId: "navigation-shells" },
  { id: "dialog-spec-usage", group: "Components", categoryId: "overlays" },
  { id: "table-work-index-spec", group: "Components", categoryId: "controls-data" },
  { id: "work-management-components-spec", group: "Components", categoryId: "work-management" },
  { id: "knowledge-management-components-spec", group: "Components", categoryId: "knowledge-management" },
  { id: "forms-patterns", group: "Patterns", categoryId: "forms-workbench" },
  { id: "workbench-patterns", group: "Patterns", categoryId: "forms-workbench" },
  { id: "work-management-patterns", group: "Patterns", categoryId: "work-management" },
  { id: "readiness-notification-patterns", group: "Patterns", categoryId: "feedback-selection" },
  { id: "selection-list-patterns", group: "Patterns", categoryId: "feedback-selection" },
  { id: "modal-validation-patterns", group: "Patterns", categoryId: "feedback-selection" },
  { id: "datagrid-fields-patterns", group: "Patterns", categoryId: "data-pages" },
  { id: "big-list-search-patterns", group: "Patterns", categoryId: "data-pages" },
  { id: "dashboard-page-templates", group: "Patterns", categoryId: "data-pages" },
  { id: "proof-matrix", group: "Proof", categoryId: "proof-governance" },
  { id: "ai-consumption-contract", group: "Proof", categoryId: "proof-governance" },
  { id: "blocked-actions", group: "Proof", categoryId: "proof-governance" },
  { id: "overlay-focus", group: "Proof", categoryId: "proof-governance" },
  { id: "local-changelog", group: "Change Log", categoryId: "governance-records" }
];

// Derived lookup (private): id -> categoryId. Key order here is registry order, but
// this map is only ever read by key (storyGovernanceFor), never iterated for output,
// so the order is immaterial. Its content equals the previous hand-written map.
const storyCategoryById: Record<string, string> = Object.fromEntries(
  storyRegistryOrder.map((entry): [string, string] => [entry.id, entry.categoryId])
);

const packageAuthorityByStoryId: Record<string, string> = {
  "aos-frontend-shell-slice": "@tcrn/ui-react ProductShell visual oracle; internal proof scaffold",
  "aos-owner-quality-product-shell": "@tcrn/ui-react ProductShell owner-quality visual oracle",
  "work-management-components-spec": "@tcrn/ui-react Work Management package exports",
  "knowledge-management-components-spec": "@tcrn/ui-react Knowledge Management package exports",
  "work-management-patterns": "@tcrn/ui-react Work Management package exports",
  "ai-consumption-contract": "Storybook static AI contract plus package-backed proof surfaces",
  "foundation-visual-standards": "Storybook static foundation visual standards registry plus ProductShell oracle",
  "local-changelog": "Durable Storybook governance changelog source"
};

const storybookStaticAuthority = "Storybook static contract story using package-backed @tcrn/ui-react surfaces where reusable UI appears";

export function storyCategoryFor(group: ContractStoryGroup, categoryId: string): StoryCategoryDefinition {
  const category = storyCategoryDefinitions[group].find((item) => item.id === categoryId);
  if (!category) {
    throw new Error(`missing_story_category:${group}:${categoryId}`);
  }
  return category;
}

export function storyGovernanceFor(storyId: string, group: ContractStoryGroup): StoryGovernanceMetadata {
  const categoryId = storyCategoryById[storyId];
  if (!categoryId) {
    throw new Error(`missing_story_governance_category:${storyId}`);
  }
  storyCategoryFor(group, categoryId);
  return {
    categoryId,
    sourcePath: "apps/storybook/src/contract-stories/story-content.tsx",
    packageAuthority: packageAuthorityByStoryId[storyId] ?? storybookStaticAuthority,
    readiness: "local_storybook_contract_review_required",
    proofPosture: "visible_boundary_no_product_adoption_or_publication_claim"
  };
}

export function storyCategoryCoverageForGroup(group: ContractStoryGroup, storyIdsByCategory: Record<string, string[]>): Array<StoryCategoryDefinition & { storyIds: string[] }> {
  return storyCategoryDefinitions[group].map((category) => ({
    ...category,
    storyIds: storyIdsByCategory[category.id] ?? []
  }));
}

export const storybookGovernanceChangelogRecords: readonly StorybookGovernanceChangelogRecord[] = [
  {
    date: "2026-07-01",
    routeId: "route_tcrn_ds_storybook_governance_ilya_implementation_after_plan_reviews_success_a1f19b1a_dded541",
    plannedCommit: "c24f6e5d779c60486214ea1e07fc737e60796e00",
    affectedStoryIds: [
      "welcome-governance",
      "governance-boundaries",
      "maintainers-routing",
      "contribution-model",
      "release-bug-policy",
      "brand-identity",
      "color-palette",
      "text-styles",
      "grid-system",
      "icons-motion",
      "global-states",
      "copy-creation-rules",
      "tokens-copy-state",
      "i18n-theme-contract",
      "copy-guidelines",
      "component-family-index",
      "display-primitives-spec",
      "interaction-disclosure-spec",
      "stamp-spec-usage",
      "button-spec-usage",
      "field-spec-usage",
      "navigation-shell-spec",
      "aos-frontend-shell-slice",
      "aos-owner-quality-product-shell",
      "dialog-spec-usage",
      "table-work-index-spec",
      "work-management-components-spec",
      "forms-patterns",
      "workbench-patterns",
      "work-management-patterns",
      "readiness-notification-patterns",
      "selection-list-patterns",
      "modal-validation-patterns",
      "datagrid-fields-patterns",
      "big-list-search-patterns",
      "dashboard-page-templates",
      "proof-matrix",
      "ai-consumption-contract",
      "blocked-actions",
      "overlay-focus",
      "local-changelog"
    ],
    aiContractDigestReadback:
      "storybook-static/ai-consumption-contract.json includes contractPayloadDigest; smoke verifies it equals the stable JSON digest.",
    proofArtifacts: [
      "apps/storybook/storybook-static/ai-consumption-contract.json",
      "apps/storybook/storybook-static/llms.txt",
      "docs/verification/internal-alpha/browser-proof-summary.json",
      "docs/verification/internal-alpha/a11y-axe-summary.json",
      "docs/verification/internal-alpha/no-overclaim-scan.json"
    ],
    noOverclaimBoundaries: [
      "local Storybook governance contract only",
      "no package publication",
      "no Storybook/docs publication",
      "no AOS/TMS product adoption",
      "no owner/product/release acceptance",
      "no live dispatch or external action",
      "no initiative completion claim"
    ]
  }
];
