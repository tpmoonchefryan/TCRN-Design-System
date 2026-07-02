import type { ReactNode } from "react";
import {
  Badge,
  Button,
  Breadcrumb,
  ClipboardCopyButton,
  componentLibraryDeferredPrototypeNames,
  componentLibraryPublicComponentNames,
  componentLibraryPublicUtilityNames,
  ConfirmActionDialog,
  ActionDrawer,
  CollapsibleRegion,
  DetailDrawer,
  DetailInspector,
  DisclosurePanel,
  Dialog,
  EnvironmentBanner,
  EvidenceStrip,
  Field,
  FilterBar,
  GateReadinessPanel,
  Heading,
  Highlight,
  Icon,
  InlineAlert,
  Input,
  KeyValueList,
  NavGroup,
  NavItem,
  Pagination,
  ProductLogo,
  Popover,
  ProductShell,
  ProductSwitcher,
  ReadbackPanel,
  SearchInput,
  SectionTabs,
  SegmentedNav,
  Select,
  SideNav,
  Skeleton,
  SkipLink,
  EmptyState,
  ErrorState,
  StateSurface,
  StateView,
  StatusBadge,
  Surface,
  TableShell,
  Text,
  Textarea,
  TopBar,
  TcrnBrandMark,
  tcrnProductLogoRegistry,
  tcrnIconNames,
  Tooltip,
  EvidenceAttachmentList,
  GatePipeline,
  MachineToken,
  RelationshipChip,
  SavedViewToolbar,
  WorkBoard,
  WorkHierarchy,
  WorkIndex,
  WorkItemInspector,
  WorkManagementSubnav,
  workManagementPatternRegistry,
  workRelationshipTypes
} from "@tcrn/ui-react";
import {
  presentCopyState,
  tcrnDefaultLocale,
  tcrnFallbackLocale,
  tcrnI18nContract,
  tcrnLocaleMetadata
} from "@tcrn/ui-copy-state";
import type { ContractStory, ContractStoryGroup } from "./types.js";
import type {
  EvidenceAttachment,
  GatePipelineGate,
  WorkBoardLane,
  WorkHierarchyEdge,
  WorkHierarchyNode
} from "@tcrn/ui-react";
import {
  DialogSpecFixture,
  OverlayFocusFixture,
  OverlayModeMatrix,
  OverlayStaticModes,
  PopoverSpecFixture
} from "./fixtures/overlay.js";
import {
  CompactToolShellDemo,
  KnowledgeBaseShellDemo,
  StorybookEntryShellStrip,
  TmsDenseShellDemo
} from "./prototypes/storybook-shell-demos.js";
import {
  AosFrontendShellSliceVisualInstance,
  aosFrontendShellSliceVisualInstanceReadback
} from "./visual-instances/aos-frontend-shell-slice.js";
import {
  AosOwnerQualityProductShell,
  aosOwnerQualityProductShellReadback
} from "./visual-instances/aos-owner-quality-product-shell.js";
import {
  componentFamilyRows,
  componentStoryRows,
  dataGridEscalationRows,
  navigationComponentRows,
  navigationStrategyRows,
  patternExpansionRows,
  storybookOnlyPrototypeRows,
  styleGuideRows,
  tableShellRuleRows,
  tmsMenuDensityRows
} from "./content/index.js";
import { aiConsumptionContract } from "../build/ai-consumption-contract.js";
import { storybookGovernanceChangelogRecords, storyCategoryFor, storyGovernanceFor } from "./governance.js";

type LegacyContractStory = Omit<ContractStory, "category" | "categoryId" | "sourcePath" | "packageAuthority" | "readiness" | "proofPosture">;

function TokenSwatch({ label, token, note }: { label: string; token: string; note: string }) {
  return (
    <div className="tcrn-token-swatch">
      <span className="tcrn-token-swatch__color" style={{ background: `var(${token})` }} aria-hidden="true" />
      <strong>{label}</strong>
      <code>{token}</code>
      <Text>{note}</Text>
    </div>
  );
}

function compactRouteId(routeId: string): string {
  const segments = routeId.split("_").filter(Boolean);
  const tail = segments.slice(-2).join("_");
  return `... ${tail}`;
}

function compactDigest(value: string): string {
  const digest = value.match(/[a-f0-9]{64}/i)?.[0];
  if (!digest) {
    return "Verified digest readback";
  }
  return `${digest.slice(0, 12)}...${digest.slice(-8)}`;
}

function compactProofArtifact(path: string): string {
  const segments = path.split("/").filter(Boolean);
  return segments.slice(-2).join("/");
}

function compactBoundary(boundary: string): string {
  const boundaryLabels: Record<string, string> = {
    "local Storybook governance contract only": "Local Storybook governance only",
    "no package publication": "Package publication not claimed",
    "no Storybook/docs publication": "Storybook/docs publication not claimed",
    "no AOS/TMS product adoption": "AOS/TMS adoption not claimed",
    "no owner/product/release acceptance": "Owner/product/release acceptance downstream",
    "no live dispatch or external action": "No live dispatch or external action",
    "no initiative completion claim": "Initiative completion not claimed"
  };
  return boundaryLabels[boundary] ?? boundary;
}

function ChangelogToken({ label, value, compactValue, kind }: { label: string; value: string; compactValue: string; kind: string }) {
  return (
    <span
      className="tcrn-changelog-token"
      data-changelog-token-kind={kind}
      data-changelog-full-token={value}
      title={value}
      aria-label={`${label}: ${value}`}
    >
      <span className="tcrn-changelog-token__label">{label}</span>
      <code className="tcrn-changelog-token__value">{compactValue}</code>
    </span>
  );
}

const workManagementSubnavItems = [
  { id: "queue", label: "Queue", href: "#work-management-components-spec", current: true, count: 6 },
  { id: "board", label: "Board", href: "#work-management-components-spec", count: 3 },
  { id: "gates", label: "Gates", href: "#work-management-components-spec", count: 7 },
  { id: "evidence", label: "Evidence", href: "#work-management-components-spec", count: 5 }
];

const workManagementSavedViews = [
  { id: "owner-feedback", label: "Owner feedback", current: true, count: 4 },
  { id: "blocked", label: "Blocked", count: 2 },
  { id: "qa-retry", label: "QA retry", count: 3 }
];

const workManagementFilters = [
  { id: "hierarchy", label: "Hierarchy", value: "Story -> Work Item" },
  { id: "gate", label: "Gate", value: "Rowan QA" },
  { id: "state", label: "State", value: "Proof required" }
];

const workBoardLanes: WorkBoardLane[] = [
  {
    id: "ready-for-review",
    title: "Ready for review",
    state: { state: "review_required" },
    cards: [
      {
        id: "AOS-128",
        title: "Work Management static mockup content contract",
        state: { state: "review_required" },
        owner: "Elara",
        meta: "Story: smallest acceptable workflow result",
        relationships: [
          { relation: "implements", target: "STORY-WM-03" },
          { relation: "verifies", target: "QA-178" }
        ]
      }
    ]
  },
  {
    id: "blocked",
    title: "Blocked",
    state: { state: "blocked" },
    cards: [
      {
        id: "DS-26",
        title: "Machine-token readability pattern",
        state: { state: "blocked" },
        owner: "Design System",
        meta: "Waits for component admission",
        relationships: [
          { relation: "blocked_by", target: "DS Review" },
          { relation: "relates_to", target: "AOS-128" }
        ]
      }
    ]
  },
  {
    id: "evidence",
    title: "Evidence",
    state: { state: "local_only" },
    cards: [
      {
        id: "EV-221",
        title: "Rowan QA artifact summary",
        state: { state: "local_only" },
        owner: "Rowan",
        meta: "Execution record attached to Work Item",
        relationships: [
          { relation: "reviews", target: "AOS-128" },
          { relation: "refreshes", target: "Atlas preview" }
        ]
      }
    ]
  }
];

const workHierarchyNodes: WorkHierarchyNode[] = [
  { id: "INIT-WM", level: "Initiative", title: "Work Management MVP", state: { state: "proof_required" }, owner: "Mara" },
  { id: "EPIC-CAPABILITY", level: "Epic", title: "Capability Epic: Work structure", parentId: "INIT-WM", owner: "Product" },
  { id: "EPIC-WORKSTREAM", level: "Epic", title: "Workstream Epic: QA recovery loop", parentId: "INIT-WM", owner: "Workflow" },
  { id: "STORY-WM-03", level: "Story", title: "Smallest acceptable workflow result", parentId: "EPIC-CAPABILITY", owner: "Mara" },
  { id: "AOS-128", level: "Task / Work Item", title: "Smallest executable ticket/task unit", parentId: "STORY-WM-03", owner: "Ilya" },
  { id: "EV-221", level: "Subtask / Evidence Task", title: "Rendered proof and QA summary", parentId: "AOS-128", owner: "Rowan" }
];

const workHierarchyEdges: WorkHierarchyEdge[] = [
  { from: "AOS-128", relation: "implements", to: "STORY-WM-03" },
  { from: "EV-221", relation: "verifies", to: "AOS-128" },
  { from: "DS-26", relation: "relates_to", to: "AOS-128" },
  { from: "AOS-128", relation: "depends_on", to: "DS Review" },
  { from: "route_tcrn_aos_work_management_static_mockups", relation: "caused_by", to: "owner PRD review" }
];

const workGatePipeline: GatePipelineGate[] = [
  { id: "ds", label: "DS Review", state: { state: "proof_required" }, owner: "Elara", evidence: ["Storybook examples", "package exports"], nextAction: "Rendered DS review" },
  { id: "implementation", label: "Implementation Proof", state: { state: "local_only" }, owner: "Ilya", evidence: ["unit tests", "smoke proof"], nextAction: "Commit and return" },
  { id: "atlas", label: "Atlas Refresh", state: { state: "blocked" }, owner: "Atlas", evidence: ["preview URL"], nextAction: "Downstream only" },
  { id: "rowan", label: "Rowan QA", state: { state: "proof_required" }, owner: "Rowan", evidence: ["browser matrix"], nextAction: "Wait for refresh" },
  { id: "mara", label: "Mara PM Readiness", state: { state: "not_claimed" }, owner: "Mara", evidence: ["PM checklist"], nextAction: "No readiness claim here" }
];

const workEvidenceItems: EvidenceAttachment[] = [
  { id: "commit", type: "commit", label: "Implementation commit", reference: "c4865675", state: { state: "local_only" } },
  { id: "artifact", type: "artifact_dir", label: "QA artifact directory", reference: "/tmp/rowan-work-management-patterns", state: { state: "proof_required" } },
  { id: "route", type: "policy", label: "Codex route record", reference: "route_tcrn_ds_work_management_patterns_ilya_ds_package_storybook_implementation_after_minerva_initiative_c4865675" },
  { id: "api", type: "api_readback", label: "API readback", reference: "No Work API integration in this Storybook fixture", state: { state: "not_claimed" } }
];

const legacyContractStories: LegacyContractStory[] = [
  {
    id: "welcome-governance",
    title: "Welcome and governance",
    group: "Welcome",
    description: "Design-system entry point, reader paths, and local-only claim boundaries.",
    render: () => (
      <section className="alpha-story-stack">
        <StorybookEntryShellStrip />
        <ReadbackPanel title="Start here">
          <Text>
            Use this Storybook as the contract map for shared TCRN frontend presentation. It explains which UI decisions are owned by the design system, which proof is local, and where product adoption must be proven separately.
          </Text>
        </ReadbackPanel>
        <ReadbackPanel title="Reader paths">
          <TableShell
            columns={[
              { key: "reader", label: "Reader" },
              { key: "startWith", label: "Start with" },
              { key: "thenCheck", label: "Then check" }
            ]}
            rows={[
              { reader: "Frontend implementer", startWith: "Components and patterns", thenCheck: "Accessibility and proof notes" },
              { reader: "Product reviewer", startWith: "Governance boundaries", thenCheck: "No-adoption claims" },
              { reader: "QA reviewer", startWith: "Proof matrix", thenCheck: "Browser and a11y receipts" },
              { reader: "Release coordinator", startWith: "Release and bug policy", thenCheck: "Publication route status" }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Claim boundaries">
          <div className="tcrn-guidance-grid">
            <StateView state={{ state: "local_only" }} title="Package-local proof" />
            <StateView state={{ state: "not_claimed" }} title="Consumer adoption separate" />
            <StateView state={{ state: "proof_required" }} title="Downstream evidence required" />
          </div>
          <EvidenceStrip items={["local package proof", "synthetic examples", "consumer adoption separate"]} />
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "governance-boundaries",
    title: "Governance boundaries",
    group: "Welcome",
    description: "Boundary map for design-system, product, workflow, and release ownership.",
    render: () => (
      <section className="alpha-story-stack">
        <EnvironmentBanner label="Private local checkpoint" />
        <ReadbackPanel title="Boundary map">
          <TableShell
            columns={[
              { key: "owner", label: "Owner" },
              { key: "owns", label: "Owns" },
              { key: "mustNotClaimHere", label: "Must not claim here" }
            ]}
            rows={[
              { owner: "Design System", owns: "Presentation contracts, tokens, copy-state, React primitives, Storybook examples, and proof harnesses.", mustNotClaimHere: "Product acceptance" },
              { owner: "Product repos", owns: "API clients, RBAC, routing, persistence, domain semantics, and production evidence.", mustNotClaimHere: "Package publication" },
              { owner: "Workflow", owns: "Cross-project governance, freshness checks, route coordination, and promoted knowledge.", mustNotClaimHere: "Product UI acceptance" },
              { owner: "Release route", owns: "Package publication, remote creation, version readback, and downstream release evidence.", mustNotClaimHere: "Owner Intent exceptions" }
            ]}
          />
        </ReadbackPanel>
        <InlineAlert tone="warning">External Storybook references may inform information architecture only; implementation, assets, styles, and tokens stay original to TCRN.</InlineAlert>
      </section>
    )
  },
  {
    id: "maintainers-routing",
    title: "Maintainers and routing",
    group: "Welcome",
    description: "Where each design-system question should route before implementation or proof.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Routing directory">
          <TableShell
            columns={[
              { key: "question", label: "Question" },
              { key: "primaryOwner", label: "Primary owner" },
              { key: "expectedRoute", label: "Expected route" }
            ]}
            rows={[
              { question: "Visual polish or component ergonomics", primaryOwner: "Frontend Studio", expectedRoute: "Design-system implementation review" },
              { question: "Accessibility, browser, or visual proof", primaryOwner: "Verification lane", expectedRoute: "Proof receipt review" },
              { question: "Security, secrets, or external provider risk", primaryOwner: "Security review", expectedRoute: "Separate risk route" },
              { question: "Package publication or version rollout", primaryOwner: "Release route", expectedRoute: "Batch Push Gate route" },
              { question: "Product adoption in AOS or TMS", primaryOwner: "Product implementation owner", expectedRoute: "Consumer adoption route" }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Routing rule">
          <Text>When the work would mutate product repos, publish packages, create remotes, or claim acceptance, leave this Storybook route and open the owning route.</Text>
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "contribution-model",
    title: "Contribution model",
    group: "Welcome",
    description: "Admission rules for proposals and product-validated ideas entering the shared system.",
    render: () => (
      <section className="alpha-story-stack">
        <KeyValueList
          items={[
            { key: "admission", label: "Admission", value: "Admit only cross-product presentation needs with synthetic proof." },
            { key: "source", label: "Source", value: "A product-validated idea may be proposed, but product evidence must be converted into synthetic examples." },
            { key: "story-contract", label: "Story contract", value: "Each story needs purpose, anatomy, states, copy, accessibility, and proof notes." },
            { key: "proof", label: "Proof", value: "Run Storybook, browser, accessibility, visual, and no-overclaim checks." },
            { key: "promotion", label: "Promotion", value: "Consumer adoption remains downstream and route-owned." }
          ]}
        />
        <InlineAlert tone="warning">Product data, RBAC, API DTOs, and tenant truth stay outside this package.</InlineAlert>
      </section>
    )
  },
  {
    id: "release-bug-policy",
    title: "Release and bug policy",
    group: "Welcome",
    description: "How local checkpoints, package publication, consumer adoption, and bugs stay separate.",
    render: () => (
      <section className="alpha-story-stack">
        <TableShell
          columns={[
            { key: "case", label: "Case" },
            { key: "disposition", label: "Disposition" },
            { key: "blockedAction", label: "Blocked action" }
          ]}
          rows={[
            { case: "Local checkpoint", disposition: "Design-system source, stories, tests, and receipts are current locally.", blockedAction: "No package publication" },
            { case: "Package publication", disposition: "Release owner proves remote, version, tarball, changelog, and Batch Push Gate readback.", blockedAction: "No consumer adoption" },
            { case: "Consumer adoption", disposition: "AOS or TMS owner imports the package and proves route behavior in that product.", blockedAction: "No final MVP acceptance" },
            { case: "Bug or visual regression", disposition: "Fix the smallest owning surface and rerun affected proof.", blockedAction: "No release readiness shortcut" }
          ]}
        />
      </section>
    )
  },
  {
    id: "brand-identity",
    title: "Brand identity",
    group: "Style Guide",
    description: "TCRN mother-brand mark, registered product logos, and local draft boundaries.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="TCRN mother brand">
          <div className="tcrn-brand-system">
            <div className="tcrn-brand-system__symbol">
              <TcrnBrandMark />
            </div>
            <div className="tcrn-brand-system__copy">
              <Heading level={3}>TCRN mark draft</Heading>
              <Text>The current mark is a local Storybook draft for visual review. It does not claim final brand acceptance, product adoption, package publication, or downstream product UI acceptance.</Text>
              <EvidenceStrip items={["local brand draft", "mother brand only", "no red connector points", "product suffix color owned downstream"]} />
            </div>
          </div>
        </ReadbackPanel>
        <ReadbackPanel title="Logo construction rules">
          <TableShell
            columns={[
              { key: "element", label: "Element" },
              { key: "rule", label: "Rule" },
              { key: "boundary", label: "Boundary" }
            ]}
            rows={[
              { element: "Outer tiles", rule: "Four large rounded diamond tiles use iris blue, violet-blue, aqua, and slate with tight even gaps.", boundary: "No asymmetric extra pieces." },
              { element: "Center tile", rule: "The center tile uses a fifth color outside the four outer tile colors.", boundary: "Do not reuse an outer color for the center." },
              { element: "Connector points", rule: "Each point uses a white ring with a same-family inner color that differs from the tile fill.", boundary: "No red, pink, coral, or orange connector points." },
              { element: "Connector paths", rule: "Paths are white channels that create the multipolar connection motif.", boundary: "Do not make the paths look like state evidence." },
              { element: "Wordmark", rule: "TCRN is the mother-brand text. Product-type suffixes follow TCRN, and long suffixes stack below it before truncation.", boundary: "Suffix color belongs to the product surface." }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Registered product logos">
          <div className="tcrn-brand-lockups" aria-label="TCRN registered product logo examples">
            <ProductLogo productId="design-system" />
            <ProductLogo productId="aos" />
            <ProductLogo productId="tms" />
          </div>
          <Text>Accepted product surfaces consume registered product-logo assets instead of composing product identity from free-form suffix and caption props.</Text>
          <TableShell
            columns={[
              { key: "productId", label: "Product id" },
              { key: "assetId", label: "Asset id" },
              { key: "lineOne", label: "Line 1" },
              { key: "lineTwo", label: "Line 2" },
              { key: "export", label: "Package export" }
            ]}
            rows={Object.values(tcrnProductLogoRegistry).map((asset) => ({
              productId: asset.productId,
              assetId: asset.assetId,
              lineOne: asset.lineOne,
              lineTwo: asset.lineTwo,
              export: "ProductLogo / tcrnProductLogoRegistry"
            }))}
          />
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "color-palette",
    title: "Color palette",
    group: "Style Guide",
    description: "Semantic color roles for canvas, panel, focus, border, and state surfaces.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Brand palette">
          <div className="tcrn-token-swatch-grid">
            <TokenSwatch label="Primary brand" token="--tcrn-color-brand-primary" note="Use for TCRN identity, selected navigation, and creator-channel emphasis." />
            <TokenSwatch label="Primary brand background" token="--tcrn-color-brand-primary-bg" note="Use for quiet selected surfaces and iris-blue brand callouts." />
            <TokenSwatch label="Secondary brand" token="--tcrn-color-brand-secondary" note="Use for system connection, informational support, charts, and secondary emphasis." />
            <TokenSwatch label="Secondary brand background" token="--tcrn-color-brand-secondary-bg" note="Use for quiet aqua informational surfaces." />
            <TokenSwatch label="Accent brand" token="--tcrn-color-brand-accent" note="Use rose-coral sparingly for creator warmth; never use as state truth." />
            <TokenSwatch label="Neutral brand" token="--tcrn-color-brand-neutral" note="Use for dense structure, muted metadata, and low-emphasis support." />
          </div>
          <TableShell
            columns={[
              { key: "family", label: "Family" },
              { key: "role", label: "Role" },
              { key: "guardrail", label: "Guardrail" }
            ]}
            rows={[
              { family: "Primary", role: "Iris-blue identity, selected navigation, creator-channel emphasis", guardrail: "Do not use as proof state." },
              { family: "Secondary", role: "Aqua system connection, informational support, and charts", guardrail: "Do not compete with primary actions." },
              { family: "Accent", role: "Rose-coral highlights and onboarding warmth", guardrail: "Never use as readiness or error truth." },
              { family: "Neutral", role: "Dense operational structure and muted metadata", guardrail: "Do not replace disabled text color." },
              { family: "State", role: "Ready, warning, blocked, unavailable, and unknown status", guardrail: "State colors are not brand colors." }
            ]}
          />
          <EvidenceStrip items={["brand primary", "secondary support", "accent sparingly", "state colors are not brand"]} />
        </ReadbackPanel>
        <ReadbackPanel title="Color role matrix">
          <div className="tcrn-token-swatch-grid">
            <TokenSwatch label="Canvas" token="--tcrn-color-surface-canvas" note="Use for page background and quiet space." />
            <TokenSwatch label="Panel" token="--tcrn-color-surface-panel" note="Use for cards, drawers, dialogs, and doc surfaces." />
            <TokenSwatch label="Muted surface" token="--tcrn-color-surface-muted" note="Use for secondary chips, nav states, and low-emphasis fills." />
            <TokenSwatch label="Focus ring" token="--tcrn-color-focus-ring" note="Use only for visible keyboard focus and selected navigation." />
            <TokenSwatch label="Ready state" token="--tcrn-color-state-ready-bg" note="Pair state color with a readable status label." />
            <TokenSwatch label="Blocked state" token="--tcrn-color-state-blocked-bg" note="Use for blocked or destructive states with explanatory copy." />
          </div>
          <TableShell
            columns={[
              { key: "role", label: "Role" },
              { key: "usage", label: "Usage" },
              { key: "guardrail", label: "Guardrail" }
            ]}
            rows={[
              { role: "Canvas", usage: "Page background and non-interactive space", guardrail: "Must not carry state meaning." },
              { role: "Panel", usage: "Cards, drawers, dialogs, and doc surfaces", guardrail: "Avoid card-in-card nesting." },
              { role: "Border", usage: "Structure, separation, and neighboring controls", guardrail: "Do not use color alone for state." },
              { role: "Focus", usage: "Keyboard focus and selected navigation", guardrail: "Never suppress visible focus." },
              { role: "State", usage: "Ready, warning, blocked, and unknown status", guardrail: "Always pair color with text." }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Neutral calibration candidates">
          <Text>Owner review admitted a narrow neutral-gray calibration token set as package-backed evidence only. These tokens do not replace the current canvas, panel, state, progress, or focus defaults without a separate component adoption route.</Text>
          <div className="tcrn-token-swatch-grid">
            <TokenSwatch label="Neutral canvas" token="--tcrn-color-neutral-calibration-canvas" note="Measured neutral gray canvas candidate; no blue/purple surface tint." />
            <TokenSwatch label="Neutral panel" token="--tcrn-color-neutral-calibration-panel" note="Measured neutral panel candidate for future proofed surfaces." />
            <TokenSwatch label="Neutral muted" token="--tcrn-color-neutral-calibration-muted" note="Muted neutral fill and progress track candidate." />
            <TokenSwatch label="Calibrated focus" token="--tcrn-color-focus-ring-calibrated" note="Solid focus-ring candidate; records contrast without suppressing focus." />
            <TokenSwatch label="Warning calibrated" token="--tcrn-color-state-warning-calibrated-bg" note="Measured warning pair; always use with warning text and copy." />
            <TokenSwatch label="Danger calibrated" token="--tcrn-color-state-danger-calibrated-bg" note="Measured danger pair; always use with danger text and copy." />
          </div>
          <TableShell
            columns={[
              { key: "role", label: "Role" },
              { key: "token", label: "Token" },
              { key: "guardrail", label: "Guardrail" }
            ]}
            rows={[
              { role: "Neutral surfaces", token: "--tcrn-color-neutral-calibration-*", guardrail: "Keeps page/card/sidebar/header backgrounds gray; not an automatic theme replacement." },
              { role: "Focus", token: "--tcrn-color-focus-ring-calibrated", guardrail: "Solid contrast candidate only; never hide focus or rely on glow alone." },
              { role: "Progress", token: "--tcrn-color-progress-*-calibrated", guardrail: "Visual evidence token only; pair progress with accessible status copy." },
              { role: "Warning", token: "--tcrn-color-state-warning-calibrated-*", guardrail: "Use only with warning semantics and readable text." },
              { role: "Danger", token: "--tcrn-color-state-danger-calibrated-*", guardrail: "Use only with destructive or blocking semantics and readable text." }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Theme parity">
          <Text>Light and dark themes must keep the same semantic token names. A dark override changes values only; it must not fork component behavior or readiness copy.</Text>
        </ReadbackPanel>
        <EvidenceStrip items={["semantic tokens", "dark override", "state-safe color", "contrast proof"]} />
      </section>
    )
  },
  {
    id: "text-styles",
    title: "Text styles",
    group: "Style Guide",
    description: "Type scale, paragraph rhythm, heading hierarchy, and localized copy density.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Type hierarchy and rhythm">
          <TableShell
            columns={[
              { key: "level", label: "Level" },
              { key: "usage", label: "Usage" },
              { key: "constraint", label: "Constraint" }
            ]}
            rows={[
              { level: "Page title", usage: "One per documentation page", constraint: "24px before first section; no nested card hero treatment" },
              { level: "Story title", usage: "Section-level contract heading", constraint: "8px to description; keep close to description" },
              { level: "Panel heading", usage: "Compact workbench panels", constraint: "10px to panel content; avoid oversized display text" },
              { level: "Body copy", usage: "Rules, examples, and proof notes", constraint: "12px between paragraphs; localize before display" },
              { level: "Microcopy", usage: "Hints, disabled reasons, and proof notes", constraint: "4px to owning control; never concatenate into labels" }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Font family contract">
          <TableShell
            columns={[
              { key: "script", label: "Script" },
              { key: "asset", label: "Redistributable font asset" },
              { key: "license", label: "License boundary" }
            ]}
            rows={[
              {
                script: "Latin",
                asset: "Inter",
                license: "OFL; may be packaged, self-hosted, or bundled with license notice."
              },
              {
                script: "Simplified Chinese",
                asset: "Noto Sans CJK SC / Source Han Sans SC",
                license: "OFL; use these for product-owned CJK font assets."
              },
              {
                script: "Japanese",
                asset: "Noto Sans CJK JP / Source Han Sans JP",
                license: "OFL; use these for product-owned Japanese font assets."
              },
              {
                script: "Korean",
                asset: "Noto Sans CJK KR / Source Han Sans KR",
                license: "OFL; use these for product-owned Korean font assets."
              },
              {
                script: "Mono",
                asset: "Liberation Mono",
                license: "OFL; use this for product-owned monospace assets."
              }
            ]}
          />
          <TableShell
            columns={[
              { key: "locale", label: "Locale" },
              { key: "fallback", label: "Platform fallback names" },
              { key: "rule", label: "Rule" }
            ]}
            rows={[
              {
                locale: "en, fr",
                fallback: "Avenir Next, Helvetica Neue, Arial",
                rule: "Platform font names are CSS fallback references only."
              },
              {
                locale: "zh-CN",
                fallback: "PingFang SC, Microsoft YaHei, Heiti SC",
                rule: "Do not copy, convert, host, bundle, or redistribute platform fonts."
              },
              {
                locale: "ja",
                fallback: "Hiragino Sans, Yu Gothic, Meiryo",
                rule: "Do not claim platform fallbacks as TCRN font assets."
              },
              {
                locale: "ko",
                fallback: "Apple SD Gothic Neo, Malgun Gothic",
                rule: "Fallbacks render only when already available on the user's licensed device."
              },
              {
                locale: "mono",
                fallback: "SFMono-Regular, Consolas, Menlo",
                rule: "System monospace names are fallback references only."
              }
            ]}
          />
          <Text>TCRN-owned packages may distribute only fonts with explicit redistribution rights. Platform font names may remain in CSS fallback stacks, but TCRN must not copy, convert, self-host, bundle, or publish those font files.</Text>
        </ReadbackPanel>
        <ReadbackPanel title="Type scale tokens">
          <TableShell
            columns={[
              { key: "token", label: "Token" },
              { key: "size", label: "Size and line" },
              { key: "usage", label: "Usage" }
            ]}
            rows={[
              { token: "Page title", size: "28px / 1.3 / 700", usage: "One page title per route or documentation page." },
              { token: "Section title", size: "18px / 1.25 / 700", usage: "Story titles, major panels, and route sections." },
              { token: "Dense UI body", size: "13px / 1.35 / 400", usage: "Tables, navigation, controls, and operational scanning remain dense." },
              { token: "Reading body", size: "14px / 1.45 / 400", usage: "Proof-gated explanatory copy and prose only; not auto-applied to dense UI." },
              { token: "Body copy", size: "13px / 1.45 / 400", usage: "Rules, descriptions, table cells, and proof notes." },
              { token: "Control text", size: "13px / 1.2 / 600", usage: "Buttons, tabs, labels, and compact control text." },
              { token: "Caption", size: "11px / 1.35 / 600", usage: "Metadata, helper text, and evidence strip context." },
              { token: "Code text", size: "12px / 1.4 / mono", usage: "Token names, ids, commands, and technical readback." }
            ]}
          />
          <div className="tcrn-type-scale-demo" aria-label="Type scale specimen">
            <p className="tcrn-type-scale-demo__page">Page title / 28px</p>
            <p className="tcrn-type-scale-demo__section">Section title / 18px</p>
            <p className="tcrn-type-scale-demo__dense">Dense UI body / 13px remains the default for operational scanning.</p>
            <p className="tcrn-type-scale-demo__reading">Reading body / 14px is reserved for proof-gated explanatory copy.</p>
            <p className="tcrn-type-scale-demo__body">Body copy / 13px keeps dense product surfaces readable without becoming tiny.</p>
            <p className="tcrn-type-scale-demo__caption">Caption / 11px is reserved for metadata and helper context.</p>
            <code className="tcrn-type-scale-demo__code">--tcrn-type-family-mono</code>
          </div>
        </ReadbackPanel>
        <div className="tcrn-typography-sample">
          <Heading level={3}>Localized text must wrap without changing scale.</Heading>
          <Text>Use fixed type roles and let containers wrap. Do not scale text by viewport width; long translated strings must remain readable without overlapping controls.</Text>
        </div>
        <EvidenceStrip items={["paragraph rhythm", "localized wrapping", "font licensing tiers", "no viewport font scaling"]} />
      </section>
    )
  },
  {
    id: "grid-system",
    title: "Grid system",
    group: "Style Guide",
    description: "Responsive layout rules for readable docs, dense work surfaces, and wrapped actions.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Layout density matrix">
          <TableShell
            columns={[
              { key: "surface", label: "Surface" },
              { key: "desktop", label: "Desktop rule" },
              { key: "mobile", label: "Mobile rule" }
            ]}
            rows={[
              { surface: "Documentation page", desktop: "Readable content column with sticky side navigation.", mobile: "Single column; navigation appears before content." },
              { surface: "Workbench", desktop: "Dense scanning is allowed when rows remain legible.", mobile: "Stack rows into cards with labels." },
              { surface: "Action row", desktop: "Actions wrap with visible gaps.", mobile: "Primary and secondary actions remain separated." },
              { surface: "Detail panel", desktop: "Drawer or side panel must not compress the table to unreadable width.", mobile: "Use full-width panel or route-level page." }
            ]}
          />
        </ReadbackPanel>
        <div className="tcrn-spec-grid">
          <StateView state={{ state: "local_only" }} title="Readable column" />
          <StateView state={{ state: "fixture_only" }} title="Adaptive grid" />
          <StateView state={{ state: "proof_required" }} title="Overflow proof" />
        </div>
        <ReadbackPanel title="Spacing floor">
          <Text>Cards, panels, tables, and action rows must preserve visible gaps across desktop, tablet, and mobile viewports. Zero-spacing joins are regressions, even when borders remain visible.</Text>
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "icons-motion",
    title: "Icons and motion",
    group: "Style Guide",
    description: "Icon-only controls, motion boundaries, tooltip naming, and reduced-motion expectations.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Icon library contract">
          <div
            data-icon-library-source="lucide-react"
            data-icon-library-wrapper="@tcrn/ui-react/Icon"
            data-icon-library-license="ISC"
            data-icon-brand-boundary="not-brand-identity"
          >
            <TableShell
              columns={[
                { key: "aspect", label: "Aspect" },
                { key: "standard", label: "Standard" },
                { key: "boundary", label: "Boundary" }
              ]}
              rows={[
                {
                  aspect: "Source library",
                  standard: "Lucide React is consumed inside @tcrn/ui-react and exposed through Icon.",
                  boundary: "Downstream UI imports TCRN icon primitives instead of importing lucide-react directly."
                },
                {
                  aspect: "License readback",
                  standard: "Lucide is recorded with an ISC license readback for local commercial-use review.",
                  boundary: "This is a license receipt, not legal advice or package publication."
                },
                {
                  aspect: "Brand boundary",
                  standard: "Icons support commands, navigation, status, and functional affordances.",
                  boundary: "Do not use general-purpose icons as TCRN logos, product marks, or proof-state truth."
                }
              ]}
            />
            <ul className="tcrn-icon-sample-grid" aria-label="Approved icon names">
              {tcrnIconNames.map((iconName) => (
                <li key={iconName} className="tcrn-icon-sample">
                  <Icon name={iconName} />
                  <code title={iconName}>{iconName}</code>
                </li>
              ))}
            </ul>
          </div>
        </ReadbackPanel>
        <ReadbackPanel title="Interaction affordance matrix">
          <TableShell
            columns={[
              { key: "topic", label: "Topic" },
              { key: "rule", label: "Rule" },
              { key: "blocked", label: "Blocked" }
            ]}
            rows={[
              { topic: "Icon-only action", rule: "Requires accessible name, visible focus, and tooltip for unfamiliar icons.", blocked: "Unnamed icon action" },
              { topic: "Tooltip", rule: "Names unfamiliar icons without replacing visible labels.", blocked: "Tooltip as the only label" },
              { topic: "Loading motion", rule: "May signal progress but must not hide status or proof copy.", blocked: "Motion-only state" },
              { topic: "Reduced motion", rule: "Must preserve comprehension with animation disabled.", blocked: "Blocking animation gate" },
              { topic: "Overlay transition", rule: "Must not delay focus entry, Escape close, or focus return proof.", blocked: "Focus hidden by animation" }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Motion examples">
          <div className="tcrn-motion-demo-grid">
            <div className="tcrn-motion-demo tcrn-motion-demo--instant">
              <h3>Instant feedback</h3>
              <Text>80ms ease-out for press, focus, and tiny affordance feedback.</Text>
              <span className="tcrn-motion-demo__track" aria-hidden="true">
                <span className="tcrn-motion-demo__dot" />
              </span>
            </div>
            <div className="tcrn-motion-demo tcrn-motion-demo--standard">
              <h3>Standard transition</h3>
              <Text>160ms ease for hover, selected state, and lightweight surface changes.</Text>
              <span className="tcrn-motion-demo__track" aria-hidden="true">
                <span className="tcrn-motion-demo__dot" />
              </span>
            </div>
            <div className="tcrn-motion-demo tcrn-motion-demo--emphasis">
              <h3>Emphasis transition</h3>
              <Text>220ms emphasized easing for drawers, dialogs, and high-attention changes.</Text>
              <span className="tcrn-motion-demo__track" aria-hidden="true">
                <span className="tcrn-motion-demo__dot" />
              </span>
            </div>
            <div className="tcrn-motion-demo tcrn-motion-demo--reduced">
              <h3>Reduced motion fallback</h3>
              <Text>Reduced motion preserves layout and copy when animation is unavailable.</Text>
              <span className="tcrn-motion-demo__track" aria-hidden="true">
                <span className="tcrn-motion-demo__dot" />
              </span>
            </div>
          </div>
          <TableShell
            columns={[
              { key: "token", label: "Motion token" },
              { key: "duration", label: "Duration" },
              { key: "allowedUse", label: "Allowed use" }
            ]}
            rows={[
              { token: "--tcrn-motion-instant", duration: "80ms ease-out", allowedUse: "Press and focus feedback only." },
              { token: "--tcrn-motion-standard", duration: "160ms ease", allowedUse: "Hover, selected navigation, and lightweight state changes." },
              { token: "--tcrn-motion-emphasis", duration: "220ms emphasized easing", allowedUse: "Drawer and dialog entry when focus remains immediate." },
              { token: "--tcrn-motion-loading-loop", duration: "900ms linear", allowedUse: "Visible loading indicators paired with status copy." },
              { token: "--tcrn-motion-skeleton-loop", duration: "1400ms ease-in-out", allowedUse: "Skeleton placeholders that reserve layout without implying readiness." },
              { token: "--tcrn-motion-progress-loop", duration: "1200ms ease-in-out", allowedUse: "Indeterminate progress for ongoing local checks." },
              { token: "--tcrn-motion-reduced-duration", duration: "0.01ms", allowedUse: "Reduced-motion override for every animated example." }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Loading and progress examples">
          <div className="tcrn-loading-motion-grid">
            <div className="tcrn-loading-card" role="status">
              <div className="tcrn-loading-card__row">
                <span className="tcrn-loading-spinner" aria-hidden="true" />
                <div className="tcrn-loading-copy">
                  <h3>Loading state</h3>
                  <Text>Spinner motion is paired with visible copy and never replaces status text.</Text>
                </div>
              </div>
            </div>
            <div className="tcrn-loading-card">
              <h3>Skeleton preview</h3>
              <Text>Skeletons reserve layout while content is unavailable; they do not imply readiness.</Text>
              <div className="tcrn-loading-skeleton" aria-hidden="true">
                <span className="tcrn-loading-skeleton__line" />
                <span className="tcrn-loading-skeleton__line tcrn-loading-skeleton__line--medium" />
                <span className="tcrn-loading-skeleton__line tcrn-loading-skeleton__line--short" />
              </div>
            </div>
            <div className="tcrn-loading-card">
              <h3>Progress feedback</h3>
              <Text>Indeterminate progress names the work being checked and keeps owner proof separate.</Text>
              <div className="tcrn-loading-progress" aria-hidden="true">
                <span className="tcrn-loading-progress__bar" />
              </div>
            </div>
            <div className="tcrn-loading-card">
              <h3>State transition</h3>
              <Text>Copy changes first; motion only softens the surface update.</Text>
              <div className="tcrn-loading-status">
                <span className="tcrn-loading-status__chip tcrn-loading-status__chip--active">Proof required</span>
                <Icon name="arrow-right" className="tcrn-loading-status__arrow" />
                <span className="tcrn-loading-status__chip">Blocked</span>
              </div>
            </div>
          </div>
        </ReadbackPanel>
        <InlineAlert tone="warning">Motion may decorate state changes, but it cannot be the only evidence that a state changed.</InlineAlert>
      </section>
    )
  },
  {
    id: "global-states",
    title: "Global states",
    group: "Style Guide",
    description: "State surfaces for ready, blocked, unknown, unavailable, and external proof-needed UI.",
    render: () => (
      <section className="alpha-story-stack">
        <div className="tcrn-guidance-grid">
          <StateView state={{ state: "ready" }} />
          <StateView state={{ state: "blocked" }} />
          <StateView state={{ state: "unknown" }} />
          <StateView state={{ state: "unavailable" }} />
          <StateView state={{ state: "external_proof_needed" }} />
        </div>
        <ReadbackPanel title="State authority matrix">
          <TableShell
            columns={[
              { key: "state", label: "State" },
              { key: "allowed", label: "Allowed display" },
              { key: "blocked", label: "Blocked display" }
            ]}
            rows={[
              { state: "Ready", allowed: "Only after owning route proof exists.", blocked: "Ready from local fixture" },
              { state: "Local proof only", allowed: "Package-local component proof.", blocked: "Product-ready wording" },
              { state: "Proof required", allowed: "Explain the missing proof.", blocked: "Silent disabled state" },
              { state: "Blocked", allowed: "Name the owning route or review.", blocked: "Hidden owner action" },
              { state: "Unknown", allowed: "Fail closed and ask for proof.", blocked: "Implied readiness" }
            ]}
          />
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "copy-creation-rules",
    title: "Copy creation rules",
    group: "Style Guide",
    description: "Human-readable, localizable, and no-overclaim copy rules for shared UI.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Copy workflow">
          <TableShell
            columns={[
              { key: "step", label: "Step" },
              { key: "rule", label: "Rule" },
              { key: "blocked", label: "Blocked" }
            ]}
            rows={[
              { step: "Source state", rule: "Map raw state to copy-state vocabulary before display.", blocked: "Raw enum label" },
              { step: "Human label", rule: "Use a short localized label plus a clear description.", blocked: "Status code as copy" },
              { step: "Evidence scope", rule: "Name whether proof is local, external, product, or release-owned.", blocked: "Product acceptance claim" },
              { step: "Disabled reason", rule: "Expose reasons through assistive text without appending to button labels.", blocked: "Concatenated label" },
              { step: "Translation", rule: "Every non-variable UI string needs zh-CN, en, ja, ko, and fr coverage.", blocked: "English leak in localized route" }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Forbidden copy patterns">
          <EvidenceStrip items={["raw enum labels", "release proof claims", "product acceptance claims", "external readiness claims"]} />
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "tokens-copy-state",
    title: "Tokens and copy state",
    group: "Foundations",
    description: "Semantic tokens and fail-closed copy vocabulary for local internal-alpha proof.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="State vocabulary">
          <div className="tcrn-status-cloud">
            <StatusBadge state={{ state: "ready" }} />
            <StatusBadge state={{ state: "local_only" }} />
            <StatusBadge state={{ state: "fixture_only" }} />
            <StatusBadge state={{ state: "external_proof_needed" }} />
            <StatusBadge state={{ state: "proof_required" }} />
            <StatusBadge state={{ state: "blocked" }} />
            <StatusBadge state={{ state: "not_claimed" }} />
            <StatusBadge state={{ state: "future_external_ready" }} />
          </div>
        </ReadbackPanel>
        <ReadbackPanel title="Fail-closed presentation">
          <StateView state={{ state: "future_external_ready" }} />
          <StateView state={{ state: "external_proof_needed" }} />
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "i18n-theme-contract",
    title: "I18n and theme contract",
    group: "Foundations",
    description: "Required locales and dark theme token override for local contract proof.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="I18n standard">
          <Text>
            Default locale {tcrnDefaultLocale}; fallback locale {tcrnFallbackLocale}; raw enum labels are blocked before UI display.
          </Text>
          <div className="tcrn-locale-grid">
            {tcrnLocaleMetadata.map((metadata) => {
              const presentation = presentCopyState({ state: "not_claimed" }, metadata.locale);
              return (
                <div key={metadata.locale} className="tcrn-locale-card" lang={metadata.locale}>
                  <strong>{metadata.nativeName}</strong>
                  <span>{metadata.englishName}</span>
                  <Badge>{metadata.locale}</Badge>
                  <Badge>{presentation.label}</Badge>
                </div>
              );
            })}
          </div>
          <Text>
            Supported locales: {tcrnI18nContract.supportedLocales.join(", ")}.
          </Text>
        </ReadbackPanel>
        <section className="tcrn-theme-preview" data-tcrn-theme="dark" aria-label="Dark theme token preview">
          <Heading level={3}>Dark theme preview</Heading>
          <Text>Dark mode is a token override, not a separate component fork.</Text>
          <StatusBadge state={{ state: "proof_required" }} />
          <StateView state={{ state: "proof_required" }} />
          <div className="tcrn-action-row">
            <Button variant="primary">Inspect tokens</Button>
            <Button disabled disabledReason="Requires product adoption route">Publish theme</Button>
          </div>
        </section>
        <ReadbackPanel title="ProductShell control contract">
          <Text>
            The Storybook documentation frontend uses the merged ProductShell authority for shell, header, side navigation, search, theme, locale, and collapse controls.
          </Text>
          <TableShell
            columns={[
              { key: "control", label: "Control" },
              { key: "rule", label: "Rule" },
              { key: "blocked", label: "Blocked" }
            ]}
            rows={[
              {
                control: "Implementation boundary",
                rule: "Use @tcrn/ui-react ProductShell as the documentation shell authority; Storybook may own content slots, anchors, static story sections, search index data, and proof pages.",
                blocked: "Private tcrn-doc-shell, tcrn-doc-header, tcrn-doc-nav, tcrn-doc-global-bar, or tcrn-doc-header-search visual shells."
              },
              {
                control: "Theme toggle",
                rule: "Use one circular icon-only button that reflects the current light or dark mode and toggles only on explicit activation.",
                blocked: "Two-option segmented theme controls or large theme panels in the global bar."
              },
              {
                control: "Theme transition",
                rule: "Theme changes use one whole-page transition: root View Transition when available, or one full-page fallback wash.",
                blocked: "Per-section darkening where sidebar, header, and content animate independently."
              },
              {
                control: "Language selector",
                rule: "Use a globe trigger plus the current locale name in that locale; menu options use native names only. Close the popup on selection, outside pointer down or click, and Escape; keep aria-expanded accurate and return focus to the trigger after keyboard or selection dismissal.",
                blocked: "Long bilingual labels, stale open locale menus, or menus that cannot collapse reliably."
              },
              {
                control: "Search",
                rule: "Keep search compact at rest, expand smoothly on focus, and collapse on blur while preserving the shortcut label only for shell search.",
                blocked: "Fixed long search fields that permanently crowd the theme and language controls."
              },
              {
                control: "AI contract",
                rule: "Expose the AI contract through the Proof story and static JSON artifact, not as a top-bar human navigation item.",
                blocked: "Putting machine-contract JSON links in the primary human toolbar."
              },
              {
                control: "Product SideNav collapse",
                rule: "Any product or documentation shell that claims SideNav behavior exposes a keyboard-accessible collapse and expand control, persists or route-owns the collapsed state, and proves active location in both states.",
                blocked: "Static left rails without collapse proof or inaccessible collapsed navigation."
              },
              {
                control: "Product IA and brand",
                rule: "Product shells use admitted brand assets and show only route-admitted modules as primary navigation or registered module cards.",
                blocked: "Generic icon/text-only brand substitutes or planned modules presented as registered product IA."
              }
            ]}
          />
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "copy-guidelines",
    title: "Copy guidelines",
    group: "Foundations",
    description: "State copy rules for no-overclaim UI and localized product-facing text.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Allowed language">
          <TableShell
            columns={[
              { key: "rule", label: "Rule" },
              { key: "example", label: "Example" },
              { key: "reason", label: "Reason" }
            ]}
            rows={[
              { rule: "Use human labels", example: "External proof needed", reason: "Readable and localizable" },
              { rule: "Name the proof scope", example: "Local proof only", reason: "Prevents downstream overclaim" },
              { rule: "Keep disabled reasons accessible", example: "Requires product adoption route", reason: "Explains blocked controls" }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Blocked language">
          <EvidenceStrip items={["raw enum labels", "release proof claims", "product acceptance claims", "external readiness claims"]} />
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "component-family-index",
    title: "Component family index",
    group: "Components",
    description: "Initial TCRN component families and the spec/usage/state pattern each component should grow into.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Recommended component families">
          <TableShell
            columns={[
              { key: "family", label: "Component family" },
              { key: "components", label: "Recommended components" },
              { key: "scope", label: "Scope" },
              { key: "status", label: "Component status" }
            ]}
            rows={componentFamilyRows}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Package-backed component API">
          <div
            data-component-library-parity="package-backed"
            data-component-source="@tcrn/ui-react"
            data-token-source="@tcrn/ui-tokens"
            data-copy-state-source="@tcrn/ui-copy-state"
          >
            <TableShell
              columns={[
                { key: "exportName", label: "Public export" },
                { key: "source", label: "Source package" },
                { key: "status", label: "Library status" }
              ]}
              rows={componentLibraryPublicComponentNames.map((exportName) => ({
                exportName,
                source: "@tcrn/ui-react",
                status: <StatusBadge state={{ state: "local_only" }} />
              }))}
            />
          </div>
        </ReadbackPanel>
        <ReadbackPanel title="Package utility exports">
          <TableShell
            columns={[
              { key: "exportName", label: "Public export" },
              { key: "source", label: "Source package" },
              { key: "status", label: "Library status" }
            ]}
            rows={componentLibraryPublicUtilityNames.map((exportName) => ({
              exportName,
              source: "@tcrn/ui-react",
              status: <StatusBadge state={{ state: "local_only" }} />
            }))}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Storybook-only prototypes">
          <TableShell
            columns={[
              { key: "helper", label: "Prototype" },
              { key: "scope", label: "Scope" },
              { key: "status", label: "Disposition" }
            ]}
            rows={componentLibraryDeferredPrototypeNames.map((prototypeName) => {
              const prototype = storybookOnlyPrototypeRows.find((row) => row.helper.includes(prototypeName));
              return {
                helper: prototypeName,
                scope: prototype?.scope ?? "Synthetic Storybook proof surface",
                status: prototype?.status ?? "Storybook prototype; not a component library export"
              };
            })}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Current local story coverage">
          <WorkIndex rows={componentStoryRows} />
        </ReadbackPanel>
        <DetailInspector
          title="Story template"
          items={[
            { key: "spec", label: "Spec", value: "purpose, anatomy, states, accessibility expectation" },
            { key: "usage", label: "Usage", value: "props, disabled behavior, empty/error examples, proof notes" },
            { key: "copy", label: "Copy", value: "localized labels, blocked terms, disabled reasons" }
          ]}
        />
        <InlineAlert tone="warning">Navigation shell components are first-class component contracts, not only page patterns.</InlineAlert>
      </section>
    )
  },
  {
    id: "display-primitives-spec",
    title: "Display primitives spec",
    group: "Components",
    description: "Owner-approved foundational display primitives for highlighting, loading skeletons, and state surfaces.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Owner-approved first batch">
          <Text>
            This contract story documents only the first approved Gemini candidate batch: inline highlight text, loading skeletons, and presentation-only state surfaces. Interaction disclosure and clipboard primitives are documented separately; masking, animated counters, DataGrid, query builder, and command palette remain deferred or rejected.
          </Text>
          <EvidenceStrip items={["owner review completed", "package-backed primitives", "Storybook evidence only", "consumer adoption separate"]} />
        </ReadbackPanel>
        <ReadbackPanel title="Highlight">
          <Text>
            <Highlight text="Search proof highlights proof matches without changing the source text." query="proof" />
          </Text>
          <TableShell
            columns={[
              { key: "rule", label: "Rule" },
              { key: "proof", label: "Proof" }
            ]}
            rows={[
              { rule: "Renders inline semantic marks", proof: "Uses <mark> for matched substrings" },
              { rule: "No HTML injection", proof: "Source text stays React-escaped text nodes" },
              { rule: "No search engine claim", proof: "Product owns query state and result ranking" }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Skeleton">
          <Text>Skeletons are decorative placeholders. Loading announcements stay with the owning product surface through aria-busy or LiveRegion.</Text>
          <div className="tcrn-display-primitive-grid">
            <Skeleton variant="text" />
            <Skeleton variant="rectangular" />
            <Skeleton variant="circular" />
            <Skeleton variant="text" lines={3} />
          </div>
        </ReadbackPanel>
        <ReadbackPanel title="State surfaces">
          <div className="tcrn-display-primitive-grid">
            <StateSurface title="Proof route needed" description="The owner must route verification before downstream claims." tone="warning" />
            <EmptyState title="No local rows" description="Clear filters or add a synthetic fixture." />
            <ErrorState
              title="Panel unavailable"
              description="Products must sanitize error copy before passing it into this presentation primitive."
              action={<Button>Retry locally</Button>}
            />
          </div>
        </ReadbackPanel>
        <InlineAlert tone="warning">
          These primitives do not implement React ErrorBoundary wrappers, telemetry, product error policy, publication, package release, or product adoption.
        </InlineAlert>
      </section>
    )
  },
  {
    id: "interaction-disclosure-spec",
    title: "Interaction disclosure spec",
    group: "Components",
    description: "Owner-approved second-batch primitives for supplemental tooltips and controlled disclosure regions.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Owner-approved second batch">
          <Text>
            This contract story documents only the second approved Gemini candidate batch: supplemental, non-interactive Tooltip and controlled DisclosurePanel/CollapsibleRegion primitives. Clipboard is documented in the button/action story; form shake validation, masking, animated counters, DataGrid, query builder, and command palette remain deferred or rejected.
          </Text>
          <EvidenceStrip items={["owner review completed", "a11y constrained", "package-backed primitives", "consumer adoption separate"]} />
        </ReadbackPanel>
        <ReadbackPanel title="Tooltip">
          <div className="tcrn-interaction-primitive-row">
            <Tooltip content="Supplemental detail only; visible labels stay required." placement="right" data-storybook-static-tooltip="true">
              <Button>Inspect route</Button>
            </Tooltip>
            <Tooltip content="Tooltip content is text-only and non-interactive." placement="top">
              <span className="tcrn-inline-proof-token" tabIndex={0}>proof token</span>
            </Tooltip>
          </div>
          <TableShell
            columns={[
              { key: "rule", label: "Rule" },
              { key: "blocked", label: "Blocked" }
            ]}
            rows={[
              { rule: "Adds supplemental aria-describedby copy", blocked: "Tooltip as the only label" },
              { rule: "Text-only, non-interactive content", blocked: "Buttons, links, forms, or menus inside tooltip" },
              { rule: "Hover and focus reveal only", blocked: "Mobile long-press or tap interaction claim" }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Disclosure">
          <div className="tcrn-interaction-primitive-grid">
            <DisclosurePanel expanded title="Expanded controlled region">
              <Text>Products own the trigger and state. The package primitive owns the region animation and hidden-content semantics.</Text>
              <Button>Focusable only while expanded</Button>
            </DisclosurePanel>
            <DisclosurePanel expanded={false} title="Collapsed controlled region">
              <Text>Collapsed content is aria-hidden and inert; ordinary tab navigation must not enter it.</Text>
              <Button>Hidden action</Button>
            </DisclosurePanel>
            <CollapsibleRegion expanded>
              <Text>Low-level collapsible regions may be used when a visible title is owned by surrounding product copy.</Text>
            </CollapsibleRegion>
          </div>
          <TableShell
            columns={[
              { key: "rule", label: "Rule" },
              { key: "blocked", label: "Blocked" }
            ]}
            rows={[
              { rule: "Controlled by expanded prop", blocked: "Package-owned route state" },
              { rule: "Collapsed content records aria-hidden and inert", blocked: "Tabbable hidden controls" },
              { rule: "Reduced motion snaps open or closed", blocked: "Motion as comprehension requirement" }
            ]}
          />
        </ReadbackPanel>
        <InlineAlert tone="warning">
          These primitives do not implement Accordion semantics, drawers, clipboard, sensitive-data masking, product filtering, log viewing, publication, package release, or product adoption.
        </InlineAlert>
      </section>
    )
  },
  {
    id: "button-spec-usage",
    title: "Button spec and usage",
    group: "Components",
    description: "Button variants, disabled reason behavior, and accessible blocked actions.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Spec">
          <div className="tcrn-action-row">
            <Button variant="primary">Primary action</Button>
            <Button>Secondary action</Button>
            <Button variant="quiet">Quiet action</Button>
            <Button variant="danger">Destructive action</Button>
          </div>
        </ReadbackPanel>
        <ReadbackPanel title="Disabled usage">
          <Text>Visible button labels stay clean; disabled reasons are exposed through title and assistive text.</Text>
          <div className="tcrn-action-row">
            <Button disabled disabledReason="Requires owning route approval">Apply</Button>
            <Button>Focus target</Button>
          </div>
        </ReadbackPanel>
        <ReadbackPanel title="Clipboard copy action">
          <Text>ClipboardCopyButton is a package-backed button action for explicitly copying product-approved values without exposing the copied payload through callbacks, DOM attributes, logs, or Storybook claims.</Text>
          <div className="tcrn-action-row">
            <ClipboardCopyButton text="synthetic-trace-id-042" ariaLabel="Copy trace ID" idleLabel="Copy trace ID" />
            <ClipboardCopyButton
              text="synthetic-secret-hidden-from-dom"
              ariaLabel="Copy restricted value"
              idleLabel="Copy restricted value"
              disabledReason="Requires product-owned copy permission"
            />
          </div>
          <TableShell
            columns={[
              { key: "rule", label: "Rule" },
              { key: "blocked", label: "Blocked" }
            ]}
            rows={[
              { rule: "Uses native button semantics and explicit click or keyboard activation", blocked: "Wrapper spans, hover, mount, timer, or implicit copying" },
              { rule: "Writes with navigator.clipboard.writeText when available", blocked: "Clipboard reads or document.execCommand fallback" },
              { rule: "Reports only idle/copying/copied/failed/unsupported states", blocked: "Callbacks, DOM attributes, or telemetry that include copied text" }
            ]}
          />
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "field-spec-usage",
    title: "Field spec and usage",
    group: "Components",
    description: "Field labeling, hints, errors, disabled controls, and aria relationships.",
    render: () => (
      <section className="tcrn-form-stack">
        <Field label="Search fixture" hint="Hint text stays visible in weak emphasis; ordinary search fields keep the search icon but do not show a keyboard shortcut.">
          <SearchInput placeholder="Search components" />
        </Field>
        <Field label="Navigation shell search fixture" hint="Shortcut labels are allowed only for navigation or shell search with a real focus target and visible result list.">
          <SearchInput placeholder="Search docs" shortcut="auto" />
        </Field>
        <Field label="State" hint="Disabled controls keep visible labels clean.">
          <Select
            defaultValue="proof_required"
            disabled
            disabledReason="State selection is unavailable in this synthetic fixture"
            options={[
              { value: "local_only", label: "Local proof only" },
              { value: "proof_required", label: "Proof required" }
            ]}
          />
        </Field>
        <Field label="Notes" hint="Textarea follows the same disabled reason contract as other form controls.">
          <Textarea
            defaultValue="Consumer-owned notes remain read-only in this fixture."
            disabled
            disabledReason="Notes editing is unavailable in this synthetic fixture"
          />
        </Field>
        <Field label="Text input">
          <Input value="Synthetic only" readOnly />
        </Field>
        <Field label="Short code" hint="Short fields keep measured width for codes, counts, and compact filters.">
          <Input className="tcrn-input--short" placeholder="A-102" maxLength={6} />
        </Field>
        <Field label="Invalid state" hint="Hint text is visible and retained in the DOM." error="Synthetic validation message">
          <Input value="Blocked local fixture" readOnly aria-invalid />
        </Field>
        <ReadbackPanel title="Field width rules">
          <TableShell
            columns={[
              { key: "pattern", label: "Pattern" },
              { key: "width", label: "Width" },
              { key: "usage", label: "Usage" }
            ]}
            rows={[
              { pattern: "Search input", width: "Full width", usage: "Search and prose-like filters keep the row width." },
              { pattern: "Short input", width: "Measured width", usage: "Codes, counts, compact filters, and bounded values stay short." }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Search shortcut rules">
          <TableShell
            columns={[
              { key: "surface", label: "Surface" },
              { key: "shortcut", label: "Shortcut" },
              { key: "usage", label: "Usage" }
            ]}
            rows={[
              { surface: "Ordinary search field", shortcut: "No shortcut label", usage: "Use inside forms, filters, and local field groups; keep the search icon only." },
              { surface: "Navigation or shell search", shortcut: "Shortcut allowed", usage: "Show Control/Command+K only when the shell owns focus behavior and visible search results." }
            ]}
          />
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "navigation-shell-spec",
    title: "Navigation and shell spec",
    group: "Components",
    description: "Top-bar, side navigation, breadcrumbs, tabs, pagination, and product-switcher contracts for TCRN shells.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Shell selection matrix">
          <Text>Navigation shell choice follows product information architecture, not a single shared layout.</Text>
          <TableShell
            columns={[
              { key: "surface", label: "Surface" },
              { key: "pattern", label: "Pattern" },
              { key: "rule", label: "Rule" },
              { key: "boundary", label: "Boundary" }
            ]}
            rows={navigationStrategyRows}
          />
        </ReadbackPanel>
        <ReadbackPanel title="TMS dense operations shell">
          <Text>Large operational products need a top navigation surface with a menu button, compact search, and an expanded menu that exposes grouped primary and secondary options together.</Text>
          <TableShell
            columns={[
              { key: "density", label: "Density" },
              { key: "trigger", label: "Trigger" },
              { key: "pattern", label: "Pattern" },
              { key: "boundary", label: "Boundary" }
            ]}
            rows={tmsMenuDensityRows}
          />
          <TmsDenseShellDemo />
        </ReadbackPanel>
        <ReadbackPanel title="Knowledge base bookmark shell">
          <Text>Design System and other knowledge-base products need side navigation with multi-level bookmarks because the reader path is nested and scroll-driven.</Text>
          <KnowledgeBaseShellDemo />
        </ReadbackPanel>
        <ReadbackPanel title="Compact tool shell">
          <Text>Small tools may use local segmented navigation, but only when the number of peer views stays small and stable.</Text>
          <CompactToolShellDemo />
        </ReadbackPanel>
        <ReadbackPanel title="Navigation component contracts">
          <Breadcrumb
            items={[
              { id: "home", label: "TCRN" },
              { id: "components", label: "Components", selected: true }
            ]}
          />
          <div className="tcrn-nav-component-preview">
            <ProductSwitcher
              items={[
                { id: "aos", label: "TCRN AOS" },
                { id: "tms", label: "TCRN TMS", selected: true },
                { id: "design-system", label: "TCRN Design System" }
              ]}
            />
            <div className="tcrn-package-nav-proof" data-package-backed-navigation-proof="true">
              <div className="tcrn-package-nav-proof__skip">
                <SkipLink href="#navigation-shell-spec">Skip to navigation shell content</SkipLink>
              </div>
              <SideNav label="Package-backed side navigation">
                <NavGroup label="Components" selected>
                  <NavItem href="#component-family-index" iconName="package">Component family index</NavItem>
                  <NavItem href="#navigation-shell-spec" iconName="panel-left-open" selected>Navigation shell</NavItem>
                  <NavItem href="#dialog-spec-usage" iconName="external-link">Dialog spec</NavItem>
                </NavGroup>
                <NavGroup label="Proof">
                  <NavItem href="#proof-matrix" iconName="book-open">Proof matrix</NavItem>
                  <NavItem href="#blocked-actions" iconName="alert-triangle" disabled disabledReason="Proof route is not in this component page">Blocked actions</NavItem>
                </NavGroup>
              </SideNav>
              <SegmentedNav
                items={[
                  { id: "contracts", label: "Contracts", selected: true },
                  { id: "usage", label: "Usage" },
                  { id: "proof", label: "Proof" }
                ]}
              />
            </div>
          </div>
          <TableShell
            columns={[
              { key: "primitive", label: "Primitive" },
              { key: "rule", label: "Rule" },
              { key: "boundary", label: "Boundary" }
            ]}
            rows={navigationComponentRows}
          />
          <div
            className="tcrn-product-shell-contract-proof"
            data-package-backed-product-shell-proof="true"
            data-aos-shell-effect-boundary="package-backed"
          >
            <ProductShell
              productName="AOS Rebuild Workspace"
              moduleName="Frontend shell slice"
              brandProductId="aos"
              brandMarkSrc="tcrn-brand-mark.svg"
              brandMarkAlt="TCRN registered brand mark"
              currentRouteLabel="Cockpit"
              navLabel="Registered AOS modules"
              collapsed={false}
              collapsedStorageKey="tcrn-aos-side-nav-collapsed"
              currentTheme="light"
              locales={tcrnLocaleMetadata}
              currentLocale={tcrnDefaultLocale}
              search={{
                label: "Search AOS shell",
                placeholder: "Search modules, work items, or proof",
                query: "cockpit",
                expanded: true,
                results: [
                  { id: "cockpit", title: "Cockpit", meta: "Registered shell entry", href: "/cockpit", selected: true },
                  { id: "work", title: "Work", meta: "Jira-like module entry", href: "/work" }
                ]
              }}
              navGroups={[
                {
                  id: "registered-aos-shell-entries",
                  label: "Registered shell entries",
                  selected: true,
                  items: [
                    { id: "cockpit", label: "Cockpit", href: "/cockpit", iconName: "home", selected: true },
                    { id: "work", label: "Work", href: "/work", iconName: "database" }
                  ]
                }
              ]}
            >
              <ReadbackPanel title="Package-backed AOS shell boundary">
                <Text>
                  Product consumers supply only route IA, labels, locale data, search records, content slots, and named DS callbacks. Collapse, theme, locale popup, and search behavior must flow through ProductShell semantic props or the useProductShellController prop bundles instead of wrapper event delegation.
                </Text>
                <EvidenceStrip items={["package-backed shell boundary", "semantic control APIs", "controller prop bundles", "product adoption separate"]} />
              </ReadbackPanel>
            </ProductShell>
          </div>
        </ReadbackPanel>
        <ReadbackPanel title="Pagination and skip-link boundary">
          <Text>Pagination and skip links belong to shared navigation primitives because they preserve orientation, keyboard access, and proof context across long surfaces.</Text>
          <Pagination label="Synthetic component pages" />
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "aos-frontend-shell-slice",
    title: "AOS frontend shell slice visual instance",
    group: "Components",
    description: "Package-backed first-viewport oracle for the AOS frontend shell slice.",
    render: () => (
      <section className="alpha-story-stack" data-design-system-visual-instance-parity="aos-frontend-shell-slice">
        <ReadbackPanel title="Visual instance oracle">
          <Text>
            This named Storybook visual instance is the DS-owned oracle for the AOS frontend shell first viewport. Product
            implementation must compare against this instance by story id, package mapping, slots, props, state matrix, and
            rendered browser evidence before claiming Design System parity.
          </Text>
          <TableShell
            label="AOS shell visual instance readback"
            columns={[
              { key: "field", label: "Field" },
              { key: "readback", label: "Readback" }
            ]}
            rows={[
              { field: "Storybook page", readback: aosFrontendShellSliceVisualInstanceReadback.page },
              { field: "Package mapping", readback: Object.values(aosFrontendShellSliceVisualInstanceReadback.packageMapping).flat().join(", ") },
              { field: "Slots", readback: aosFrontendShellSliceVisualInstanceReadback.slots.join(", ") },
              { field: "Variants", readback: aosFrontendShellSliceVisualInstanceReadback.variants.join(", ") },
              { field: "States", readback: aosFrontendShellSliceVisualInstanceReadback.supportedStates.join(", ") },
              { field: "Rendered fixture selectors", readback: aosFrontendShellSliceVisualInstanceReadback.variantFixtures.map((fixture) => fixture.selector).join(", ") },
              { field: "Persisted Cockpit rest policy", readback: `${aosFrontendShellSliceVisualInstanceReadback.persistedCockpitRestPolicy.defaultCockpitRestVariant}; owner-review routes deterministic; outside-matrix marker forbidden` },
              { field: "Delegated interactions", readback: aosFrontendShellSliceVisualInstanceReadback.delegatedInteractionProofs.join(" ") },
              { field: "Owner visual admission", readback: aosFrontendShellSliceVisualInstanceReadback.ownerVisualAdmissionBoundary }
            ]}
          />
          <EvidenceStrip items={["named Storybook visual instance", "package-backed composition", "screenshots mapped by story id", "product adoption separate"]} />
        </ReadbackPanel>
        <AosFrontendShellSliceVisualInstance />
        <ReadbackPanel title="Negative acceptance criteria">
          <TableShell
            label="AOS shell negative criteria"
            columns={[
              { key: "criterion", label: "Criterion" },
              { key: "requiredResult", label: "Required result" }
            ]}
            rows={aosFrontendShellSliceVisualInstanceReadback.negativeCriteria.map((criterion) => ({
              criterion,
              requiredResult: "fail closed if present"
            }))}
          />
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "aos-owner-quality-product-shell",
    title: "AOS owner-quality product shell oracle",
    group: "Components",
    description: "Package-backed product-first AOS Operations Cockpit oracle for downstream owner-quality remediation.",
    render: () => (
      <section className="alpha-story-stack" data-design-system-visual-instance-parity="aos-owner-quality-product-shell">
        <AosOwnerQualityProductShell />
        <ReadbackPanel title="Owner-quality visual oracle candidate">
          <Text>
            This named Storybook visual instance reframes AOS as an Operations Cockpit owner-inspection surface. It keeps
            ProductShell behavior package-backed while making current work, gates, evidence, decisions, owner actions, service
            health, and activity the first-viewport story. The earlier AOS frontend shell slice remains an internal proof scaffold.
          </Text>
          <TableShell
            label="AOS owner-quality product shell readback"
            columns={[
              { key: "field", label: "Field" },
              { key: "readback", label: "Readback" }
            ]}
            rows={[
              { field: "Storybook page", readback: aosOwnerQualityProductShellReadback.page },
              { field: "Package mapping", readback: Object.values(aosOwnerQualityProductShellReadback.packageMapping).flat().join(", ") },
              { field: "Slots", readback: aosOwnerQualityProductShellReadback.slots.join(", ") },
              { field: "Variants", readback: aosOwnerQualityProductShellReadback.variants.join(", ") },
              { field: "States", readback: aosOwnerQualityProductShellReadback.supportedStates.join(", ") },
              { field: "Rendered fixture selectors", readback: aosOwnerQualityProductShellReadback.variantFixtures.map((fixture) => fixture.selector).join(", ") },
              { field: "Owner-quality criteria", readback: aosOwnerQualityProductShellReadback.ownerQualityAcceptanceCriteria.join("; ") },
              { field: "Reject criteria", readback: aosOwnerQualityProductShellReadback.rejectCriteria.join("; ") },
              { field: "Delegated sub-oracles", readback: aosOwnerQualityProductShellReadback.delegatedSubOracles.join(" ") },
              { field: "Owner visual admission", readback: aosOwnerQualityProductShellReadback.ownerVisualAdmissionBoundary }
            ]}
          />
          <EvidenceStrip items={["product-first owner-quality target", "package-backed ProductShell", "proof scaffold demoted", "product adoption separate"]} />
        </ReadbackPanel>
        <ReadbackPanel title="Negative acceptance criteria">
          <TableShell
            label="AOS owner-quality reject criteria"
            columns={[
              { key: "criterion", label: "Criterion" },
              { key: "requiredResult", label: "Required result" }
            ]}
            rows={aosOwnerQualityProductShellReadback.negativeCriteria.map((criterion) => ({
              criterion,
              requiredResult: "fail closed if present"
            }))}
          />
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "dialog-spec-usage",
    title: "Dialog spec and usage",
    group: "Components",
    description: "Dialog capability metadata, focus entry, Escape close, and focus-return boundaries.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Capability metadata">
          <TableShell
            columns={[
              { key: "capability", label: "Capability" },
              { key: "status", label: "Status" },
              { key: "proof", label: "Proof" }
            ]}
            rows={[
              { capability: "Focus entry", status: <StatusBadge state={{ state: "local_only" }} />, proof: "Implemented in Dialog" },
              { capability: "Tab containment", status: <StatusBadge state={{ state: "not_claimed" }} />, proof: "Not claimed until implemented" },
              { capability: "Escape close", status: <StatusBadge state={{ state: "local_only" }} />, proof: "Requires onOpenChange" },
              { capability: "Focus return", status: <StatusBadge state={{ state: "local_only" }} />, proof: "Requires triggerRef" }
            ]}
          />
        </ReadbackPanel>
        <OverlayModeMatrix />
        <DialogSpecFixture />
        <PopoverSpecFixture />
        <OverlayStaticModes />
      </section>
    )
  },
  {
    id: "table-work-index-spec",
    title: "Table and work index spec",
    group: "Components",
    description: "Dense desktop scanning and mobile stacked rows for synthetic work items.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Table shell rules">
          <TableShell
            label="Table shell behavior rules"
            columns={[
              { key: "surface", label: "Surface" },
              { key: "desktop", label: "Desktop behavior" },
              { key: "mobile", label: "Mobile behavior" },
              { key: "boundary", label: "Boundary" }
            ]}
            rows={tableShellRuleRows}
          />
        </ReadbackPanel>
        <div className="tcrn-spec-grid">
          <ReadbackPanel title="Work index scanning">
            <Text>Use WorkIndex for finite synthetic queues that need compact status and owner scanning.</Text>
            <WorkIndex label="Component story work index" rows={componentStoryRows} />
          </ReadbackPanel>
          <ReadbackPanel title="Empty state distinction">
            <Text>Empty states stay inside the table frame and name what is absent without claiming remote counts.</Text>
            <TableShell
              label="Release candidate empty state"
              columns={[
                { key: "item", label: "Item" },
                { key: "state", label: "State" }
              ]}
              rows={[]}
              emptyState={<StateView state={{ state: "not_configured" }} title="No release candidate" />}
            />
          </ReadbackPanel>
        </div>
        <ReadbackPanel title="DataGrid escalation boundary">
          <Text>Escalate from TableShell or WorkIndex when the surface needs editing, virtualization, remote state, column controls, or batch operations.</Text>
          <TableShell
            label="DataGrid escalation criteria"
            columns={[
              { key: "capability", label: "Capability" },
              { key: "tableShell", label: "TableShell disposition" },
              { key: "escalation", label: "Escalation" },
              { key: "proof", label: "Required proof" }
            ]}
            rows={dataGridEscalationRows}
          />
        </ReadbackPanel>
        <InlineAlert tone="warning">Empty, loading, and error states must stay distinct; do not render an empty table when source loading failed.</InlineAlert>
      </section>
    )
  },
  {
    id: "work-management-components-spec",
    title: "Work Management component specs",
    group: "Components",
    description: "Package-backed Work Management components for Initiative, Epic, Story, Work Item, gate, evidence, and execution-record surfaces.",
    render: () => (
      <section className="alpha-story-stack" data-work-management-contract="package-backed-static">
        <ReadbackPanel title="Admitted candidates 18-26">
          <Text>
            These Work Management surfaces are package-backed static presentation patterns. They do not integrate APIs, backend persistence, live Codex dispatch, external queues, product acceptance, release readiness, or product adoption.
          </Text>
          <TableShell
            label="Work Management pattern registry"
            columns={[
              { key: "candidateId", label: "Candidate" },
              { key: "componentName", label: "Package export" },
              { key: "level", label: "DS level" },
              { key: "purpose", label: "Purpose" }
            ]}
            rows={workManagementPatternRegistry.map((item) => ({
              candidateId: item.candidateId,
              componentName: item.componentName,
              level: item.level,
              purpose: item.purpose
            }))}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Relationship vocabulary">
          <div className="tcrn-work-board__relations" aria-label="Work relationship vocabulary examples">
            {workRelationshipTypes.map((relation) => (
              <RelationshipChip key={relation} relation={relation} source="AOS-128" target={`example-${relation}`} />
            ))}
          </div>
        </ReadbackPanel>
        <ReadbackPanel title="Machine token containment">
          <Text>MachineToken preserves the full identifier in title, aria-label, and data-full-token while constraining the visible value so it cannot overlap adjacent table cells.</Text>
          <TableShell
            label="Machine token examples"
            columns={[
              { key: "kind", label: "Kind" },
              { key: "token", label: "Token" },
              { key: "boundary", label: "Boundary" }
            ]}
            rows={[
              {
                kind: "Route",
                token: (
                  <MachineToken token="route_tcrn_ds_work_management_patterns_ilya_ds_package_storybook_implementation_after_minerva_initiative_c4865675"
                    label="route"
                    kind="route"
                    copyable
                  />
                ),
                boundary: "Readable long-token display with full metadata preserved."
              },
              {
                kind: "Thread",
                token: <MachineToken token="019eb66e-00d1-7190-81d9-693895b32033" label="Arturo" kind="thread" />,
                boundary: "Human label plus full thread identifier."
              }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Subnav and saved views">
          <SavedViewToolbar views={workManagementSavedViews} filters={workManagementFilters} />
          <WorkManagementSubnav items={workManagementSubnavItems} />
        </ReadbackPanel>
        <ReadbackPanel title="Board, hierarchy, and gates">
          <WorkBoard lanes={workBoardLanes} />
          <WorkHierarchy nodes={workHierarchyNodes} edges={workHierarchyEdges} />
          <GatePipeline gates={workGatePipeline} />
        </ReadbackPanel>
        <ReadbackPanel title="Evidence and inspector">
          <EvidenceAttachmentList items={workEvidenceItems} />
          <WorkItemInspector
            title="AOS-128 Work Item"
            summary="Codex Activity is execution and evidence context attached to this Work Item; it is not a replacement for Story or Task / Work Item."
            hierarchy={[
              { key: "initiative", label: "Initiative", value: "Complete objective and why" },
              { key: "epic", label: "Epic", value: "Larger deliverable work package" },
              { key: "story", label: "Story", value: "Smallest acceptable human/business/workflow result" },
              { key: "task", label: "Task / Work Item", value: "Smallest executable ticket/task unit" }
            ]}
            details={[
              { key: "state", label: "State", value: <StatusBadge state={{ state: "proof_required" }} /> },
              { key: "owner", label: "Owner", value: "Ilya" },
              { key: "blocked", label: "Owner inspection", value: "Blocked until gates complete; no readiness claimed." }
            ]}
            relationships={[
              { relation: "implements", target: "STORY-WM-03" },
              { relation: "verifies", target: "EV-221" },
              { relation: "duplicates", target: "legacy-proof-card" }
            ]}
            subtasks={[
              { id: "EV-221", title: "Attach screenshot evidence", state: { state: "local_only" }, owner: "Rowan" },
              { id: "SUB-19", title: "Record table overflow proof", state: { state: "proof_required" }, owner: "QA" }
            ]}
            evidence={workEvidenceItems.slice(0, 2)}
            actions={[{ id: "dispatch", label: "Dispatch Codex route", disabledReason: "Live Codex dispatch is not available in this static Storybook fixture" }]}
          />
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "forms-patterns",
    title: "Forms pattern",
    group: "Patterns",
    description: "Form composition rules for labels, hints, invalid states, and action spacing.",
    render: () => (
      <section className="alpha-story-stack">
        <SectionTabs items={[{ id: "inputs", label: "Inputs", selected: true }, { id: "validation", label: "Validation" }, { id: "actions", label: "Actions" }]} />
        <div className="tcrn-spec-grid">
          <ReadbackPanel title="Label and hint">
            <Text>Every input has a persistent label. Hints and errors remain in the DOM and are wired into the control.</Text>
          </ReadbackPanel>
          <ReadbackPanel title="Actions">
            <Text>Primary and secondary actions sit in a wrapped row with a minimum gap; zero-spacing joins are rejected.</Text>
          </ReadbackPanel>
        </div>
      </section>
    )
  },
  {
    id: "workbench-patterns",
    title: "Workbench patterns",
    group: "Patterns",
    description: "Work index, filters, detail inspection, and evidence strips.",
    render: () => (
      <section className="alpha-story-stack">
        <FilterBar label="Synthetic filters">
          <Badge>local fixture</Badge>
          <Badge>no product import</Badge>
        </FilterBar>
        <WorkIndex
          rows={[
            { id: "row-1", title: "Synthetic row", state: { state: "proof_required" }, owner: "role-placeholder" },
            { id: "row-2", title: "Blocked sample", state: { state: "blocked" }, owner: "review-placeholder" }
          ]}
        />
        <DetailInspector
          title="Selected fixture"
          items={[
            { key: "scope", label: "Scope", value: "Design-system local scaffold" },
            { key: "claim", label: "Claim", value: "Product adoption not claimed" }
          ]}
        />
        <EvidenceStrip items={["local proof", "synthetic examples", "no raw evidence"]} />
      </section>
    )
  },
  {
    id: "work-management-patterns",
    title: "Work Management patterns",
    group: "Patterns",
    description: "Composition guidance for Work Management queues, boards, hierarchy, gate pipelines, evidence, and saved views.",
    render: () => (
      <section className="alpha-story-stack" data-work-management-patterns="static-no-live">
        <ReadbackPanel title="Hierarchy semantics">
          <TableShell
            label="Work Management hierarchy"
            columns={[
              { key: "level", label: "Level" },
              { key: "meaning", label: "Meaning" },
              { key: "blocked", label: "Blocked misuse" }
            ]}
            rows={[
              { level: "Initiative", meaning: "Complete objective and why.", blocked: "Replacing with an execution route." },
              { level: "Epic", meaning: "Larger deliverable work package; may be capability or workstream.", blocked: "Using as a single task ticket." },
              { level: "Story", meaning: "Smallest acceptable human/business/workflow result.", blocked: "Replacing with Codex Activity." },
              { level: "Task / Work Item", meaning: "Smallest executable ticket/task unit.", blocked: "Treating proof evidence as the task." },
              { level: "Subtask / Evidence Task", meaning: "Execution or proof detail.", blocked: "Claiming product readiness from local evidence." }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Recommended static composition">
          <SavedViewToolbar views={workManagementSavedViews} filters={workManagementFilters} />
          <WorkBoard lanes={workBoardLanes} />
        </ReadbackPanel>
        <ReadbackPanel title="Dependency and evidence flow">
          <WorkHierarchy nodes={workHierarchyNodes} edges={workHierarchyEdges} />
          <GatePipeline gates={workGatePipeline} />
          <EvidenceAttachmentList items={workEvidenceItems} />
        </ReadbackPanel>
        <InlineAlert tone="warning">
          Work Management patterns remain static and product-neutral here: no API integration, backend persistence, live Codex dispatch, external queue, product adoption, owner acceptance, package publication, or release readiness is claimed.
        </InlineAlert>
      </section>
    )
  },
  {
    id: "readiness-notification-patterns",
    title: "Readiness and notification pattern",
    group: "Patterns",
    description: "Fail-closed readiness surfaces and copy-state notifications without external readiness claims.",
    render: () => (
      <section className="alpha-story-stack">
        <InlineAlert tone="warning">Proof-dependent surfaces must describe the missing proof instead of implying readiness.</InlineAlert>
        <div className="tcrn-guidance-grid">
          <StateView state={{ state: "not_configured" }} />
          <StateView state={{ state: "unknown" }} />
          <StateView state={{ state: "unavailable" }} />
        </div>
      </section>
    )
  },
  {
    id: "selection-list-patterns",
    title: "Selection and list patterns",
    group: "Patterns",
    description: "Choosing between select, search list, multi-select, and large list behaviors.",
    render: () => (
      <section className="alpha-story-stack">
        <TableShell
          columns={[
            { key: "pattern", label: "Pattern" },
            { key: "baseline", label: "Baseline" },
            { key: "escalation", label: "Escalation" }
          ]}
          rows={patternExpansionRows.slice(0, 1)}
        />
        <InlineAlert tone="warning">Large or remote option sets need search, loading, empty, and keyboard states.</InlineAlert>
      </section>
    )
  },
  {
    id: "modal-validation-patterns",
    title: "Modal validation patterns",
    group: "Patterns",
    description: "Validation rules for dialogs, destructive actions, and blocked owner routes.",
    render: () => (
      <section className="alpha-story-stack">
        <TableShell
          columns={[
            { key: "pattern", label: "Pattern" },
            { key: "baseline", label: "Baseline" },
            { key: "escalation", label: "Escalation" }
          ]}
          rows={patternExpansionRows.slice(1, 2)}
        />
        <ReadbackPanel title="Validation contract">
          <Text>Dialog validation keeps field errors visible and returns focus without claiming tab containment unless implemented.</Text>
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "datagrid-fields-patterns",
    title: "Datagrid field patterns",
    group: "Patterns",
    description: "Rules for editable grid cells, field labels, and detail-panel escalation.",
    render: () => (
      <section className="alpha-story-stack">
        <TableShell
          columns={[
            { key: "pattern", label: "Pattern" },
            { key: "baseline", label: "Baseline" },
            { key: "escalation", label: "Escalation" }
          ]}
          rows={patternExpansionRows.slice(2, 3)}
        />
        <EvidenceStrip items={["persistent labels", "cell focus", "detail panel escape"]} />
      </section>
    )
  },
  {
    id: "big-list-search-patterns",
    title: "Big list search patterns",
    group: "Patterns",
    description: "Filtering, selection, loading, empty state, and keyboard rules for large lists.",
    render: () => (
      <section className="alpha-story-stack">
        <TableShell
          columns={[
            { key: "pattern", label: "Pattern" },
            { key: "baseline", label: "Baseline" },
            { key: "escalation", label: "Escalation" }
          ]}
          rows={patternExpansionRows.slice(3, 4)}
        />
        <div className="tcrn-guidance-grid">
          <StateView state={{ state: "not_configured" }} title="No filter applied" />
          <StateView state={{ state: "unknown" }} title="Remote count unknown" />
        </div>
      </section>
    )
  },
  {
    id: "dashboard-page-templates",
    title: "Dashboard and page templates",
    group: "Patterns",
    description: "Desktop, mobile, and dashboard page templates for status-first product surfaces.",
    render: () => (
      <section className="alpha-story-stack">
        <TableShell
          columns={[
            { key: "pattern", label: "Pattern" },
            { key: "baseline", label: "Baseline" },
            { key: "escalation", label: "Escalation" }
          ]}
          rows={patternExpansionRows.slice(4)}
        />
        <ReadbackPanel title="Template boundary">
          <Text>Templates describe layout and interaction rules only; product data truth remains owned by consumer routes.</Text>
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "ai-consumption-contract",
    title: "AI consumption contract",
    group: "Proof",
    description: "Machine-readable Storybook rules for product frontend agents before implementation.",
    render: () => (
      <section className="alpha-story-stack" data-ai-consumption-contract-story="true">
        <ReadbackPanel title="AI consumption gate">
          <Text>
            AI and product frontend agents must read this story or ai-consumption-contract.json before coding. Storybook evidence alone does not prove product adoption.
          </Text>
          <EvidenceStrip items={["machine-readable contract", "owner review completed", "product adoption separate", "no local rebuild"]} />
        </ReadbackPanel>
        <ReadbackPanel title="Pre-implementation rules">
          <TableShell
            columns={[
              { key: "rule", label: "Rule" },
              { key: "evidence", label: "Required evidence" }
            ]}
            rows={[
              { rule: "Locale and copy-state", evidence: "All visible product copy uses approved i18n and copy-state contracts." },
              { rule: "Brand and logo", evidence: "Use admitted brand assets or route brand component admission before product use." },
              { rule: "Component imports", evidence: "Import package-backed Design System primitives from @tcrn/ui-react; do not rebuild local clones." },
              { rule: "Storybook ProductShell boundary", evidence: "Storybook uses @tcrn/ui-react ProductShell for shell/header/sidebar/search/theme/locale/collapse behavior; private tcrn-doc-* visual shell clones are not admitted." },
              { rule: "Storybook section coverage", evidence: "Read every required Storybook section in the AI contract before implementation; do not treat one component page as the whole Design System." },
              { rule: "Visual equivalence", evidence: "Prove same package, same export, same variant/props/slots, and same Storybook visual instance; package import or boundary markers alone are insufficient." },
              { rule: "Token usage", evidence: "Use Design System tokens, reduced-motion rules, and accessibility states before custom CSS." },
              { rule: "Motion and effects", evidence: "Compare duration, easing, opacity, transform, focus treatment, whole-page theme transition, drawer/menu/search motion, and reduced-motion fallback." },
              { rule: "Light and dark Storybook shell", evidence: "Check both light and dark Storybook shell modes before product frontend work; do not fork behavior, locale copy, readiness copy, or brand assets by theme." },
              { rule: "Storybook shell controls", evidence: "Preserve compact theme, locale, and search controls: single icon theme toggle, native-name locale menu, focus-expanded search, no AI JSON link in the top bar, and one whole-page theme transition." },
              { rule: "Locale menu behavior", evidence: "Prove close on selection, outside pointer down/click, and Escape; aria-expanded must mirror state and keyboard/selection dismissal must return focus to the trigger." },
              { rule: "Side navigation collapse", evidence: "Prove keyboard-accessible collapse/expand control, persisted or route-owned collapsed state, active location preservation, and accessible expanded/collapsed states." },
              { rule: "Registered product IA", evidence: "Do not surface unregistered or planned modules as primary navigation or registered module cards before a route admits them." },
              { rule: "Browser interaction proof", evidence: "Product adoption proof must click and verify rendered controls; marker-only proof is insufficient." },
              { rule: "Product proof", evidence: "Run product-owned adoption proof before claiming AOS or TMS Design System compliance." }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Required Storybook chapters">
          <TableShell
            columns={[
              { key: "section", label: "Section" },
              { key: "route", label: "Route" },
              { key: "stories", label: "Stories" },
              { key: "checks", label: "Checks" }
            ]}
            rows={aiConsumptionContract.requiredStorybookSectionChecklist.map((section) => ({
              section: section.section,
              route: section.route,
              stories: section.requiredStories.join(", "),
              checks: section.consumerChecks.join("; ")
            }))}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Covered section hierarchy">
          <TableShell
            columns={[
              { key: "section", label: "Section" },
              { key: "categories", label: "Categories" },
              { key: "authority", label: "Authority" }
            ]}
            rows={aiConsumptionContract.coveredStorybookSections.map((section) => ({
              section: section.section,
              categories: section.categories.map((category) => `${category.label}: ${category.storyIds.join(", ")}`).join("; "),
              authority: section.authority
            }))}
          />
        </ReadbackPanel>
        <ReadbackPanel title="Changelog and static-authority readback">
          <KeyValueList
            items={[
              { key: "changelog", label: "Changelog story", value: aiConsumptionContract.changelogGovernance.storybookStory },
              { key: "root", label: "Root record", value: aiConsumptionContract.changelogGovernance.rootChangelog },
              { key: "work-management", label: "Work Management authority", value: aiConsumptionContract.workManagementStaticAuthority.disposition },
              { key: "proof", label: "Proof boundary", value: aiConsumptionContract.workManagementStaticAuthority.smokeCoverage }
            ]}
          />
        </ReadbackPanel>
        <ReadbackPanel title="AOS failure prevention">
          <TableShell
            columns={[
              { key: "layer", label: "Layer" },
              { key: "proof", label: "Required proof" }
            ]}
            rows={[
              { layer: "Package", proof: "Same @tcrn package/version basis as the consumed Storybook contract." },
              { layer: "Export", proof: "Same registered exported component, not a local clone or generic substitute." },
              { layer: "Variant / props / slots", proof: "Same registered size, density, icon/text shape, callbacks, state ownership, and slot composition." },
              { layer: "Storybook visual instance", proof: "Same rendered dimensions, radius, padding, border, background, typography, state styling, motion, theme, locale, mobile reflow, and information hierarchy." }
            ]}
          />
          <Text>{aiConsumptionContract.storybookVisualParityProof}</Text>
        </ReadbackPanel>
        <ReadbackPanel title="Machine-readable artifact">
          <KeyValueList
            items={[
              { key: "artifact", label: "Artifact", value: "storybook-static/ai-consumption-contract.json" },
              { key: "version", label: "Contract version", value: aiConsumptionContract.contractVersion },
              { key: "route", label: "Story route", value: aiConsumptionContract.route },
              { key: "themes", label: "Theme modes", value: aiConsumptionContract.supportedThemeModes.join(",") }
            ]}
          />
          <Text>The static JSON artifact is the fetchable contract for AI and product implementation agents.</Text>
        </ReadbackPanel>
        <ReadbackPanel title="Blocked claims">
          <TableShell
            columns={[
              { key: "claim", label: "Claim" },
              { key: "disposition", label: "Disposition" }
            ]}
            rows={[
              { claim: "Storybook docs publication", disposition: "Not claimed by this contract." },
              { claim: "Package publication", disposition: "Not claimed by this contract." },
              { claim: "Product adoption", disposition: "Requires a downstream product adoption route." },
              { claim: "AOS or TMS acceptance", disposition: "Requires product-owned implementation and proof." },
              { claim: "Automatic registration", disposition: "Blocked without Owner Review." }
            ]}
          />
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "proof-matrix",
    title: "Proof matrix",
    group: "Proof",
    description: "Local browser, accessibility, visual, copy, and no-overclaim receipts required for this checkpoint.",
    render: () => (
      <section className="alpha-story-stack">
        <ReadbackPanel title="Proof receipts">
          <TableShell
            columns={[
              { key: "receipt", label: "Receipt" },
              { key: "scope", label: "Scope" },
              { key: "claim", label: "Claim" }
            ]}
            rows={[
              { receipt: "Storybook static build", scope: "local", claim: <StatusBadge state={{ state: "local_only" }} /> },
              { receipt: "Axe and keyboard checks", scope: "local", claim: <StatusBadge state={{ state: "proof_required" }} /> },
              { receipt: "Visual baselines", scope: "local", claim: <StatusBadge state={{ state: "fixture_only" }} /> },
              { receipt: "No-overclaim scan", scope: "local", claim: <StatusBadge state={{ state: "not_claimed" }} /> }
            ]}
          />
        </ReadbackPanel>
      </section>
    )
  },
  {
    id: "blocked-actions",
    title: "Blocked actions",
    group: "Proof",
    description: "Disabled gates and blocked owner actions remain explicit.",
    render: () => (
      <section className="alpha-story-stack">
        <EnvironmentBanner label="Private local scaffold" />
        <GateReadinessPanel state={presentCopyState({ state: "blocked" })} />
        <ConfirmActionDialog
          title="Publication is not routed"
          message="Package publication, GitHub remote creation, and product adoption are blocked in this scaffold route."
          confirmLabel="Publish"
          cancelLabel="Close"
          disabled
        />
        <TableShell columns={[{ key: "item", label: "Item" }]} rows={[]} emptyState="No release candidate" />
      </section>
    )
  },
  {
    id: "overlay-focus",
    title: "Overlay focus contract",
    group: "Proof",
    description: "Dialog open, focus, Escape close, and focus return behavior for synthetic fixtures.",
    render: () => <OverlayFocusFixture />
  },
  {
    id: "local-changelog",
    title: "Local changelog",
    group: "Change Log",
    description: "Human-readable local checkpoint history without package publication or release claims.",
    render: () => (
      <section className="alpha-story-stack" data-changelog-localized-readback="true">
        <ReadbackPanel title="Governance changelog records">
          <div className="tcrn-changelog-records" data-changelog-records="governance">
            {storybookGovernanceChangelogRecords.map((record) => (
              <article key={record.routeId}
                className="tcrn-changelog-record"
                data-changelog-route-id={record.routeId}
                data-changelog-planned-commit={record.plannedCommit}
                data-changelog-ai-digest-readback={record.aiContractDigestReadback}
                data-changelog-proof-artifacts={record.proofArtifacts.join("|")}
                data-changelog-no-overclaim-boundaries={record.noOverclaimBoundaries.join("|")}
              >
                <div className="tcrn-changelog-record__header">
                  <Badge>{record.date}</Badge>
                  <div>
                    <Heading level={3}>Storybook governance checkpoint</Heading>
                    <Text>Durable source record with full traceability preserved in metadata.</Text>
                  </div>
                </div>
                <KeyValueList
                  items={[
                    {
                      key: "route",
                      label: "Source route",
                      value: (
                        <ChangelogToken
                          label="Governance route"
                          value={record.routeId}
                          compactValue={compactRouteId(record.routeId)}
                          kind="route"
                        />
                      )
                    },
                    {
                      key: "stories",
                      label: "Story coverage",
                      value: (
                        <>
                          {record.affectedStoryIds.length} <span>governed stories</span>
                        </>
                      )
                    },
                    {
                      key: "digest",
                      label: "AI contract digest",
                      value: (
                        <ChangelogToken
                          label="AI contract digest"
                          value={record.aiContractDigestReadback}
                          compactValue={compactDigest(record.aiContractDigestReadback)}
                          kind="digest"
                        />
                      )
                    }
                  ]}
                />
                <div className="tcrn-changelog-record__evidence-grid">
                  <section className="tcrn-changelog-record__evidence-list" aria-label="Proof artifacts">
                    <Heading level={4}>Proof artifacts</Heading>
                    <ul>
                      {record.proofArtifacts.map((artifact) => (
                        <li key={artifact}>
                          <span
                            className="tcrn-changelog-record__artifact"
                            data-changelog-proof-artifact={artifact}
                            title={artifact}
                            aria-label={`Proof artifact: ${artifact}`}
                          >
                            {compactProofArtifact(artifact)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section className="tcrn-changelog-record__evidence-list" aria-label="No-overclaim boundaries">
                    <Heading level={4}>No-overclaim boundaries</Heading>
                    <ul>
                      {record.noOverclaimBoundaries.map((boundary) => (
                        <li key={boundary}>
                          <span
                            className="tcrn-changelog-record__boundary"
                            data-changelog-no-overclaim-boundary={boundary}
                            title={boundary}
                            aria-label={`No-overclaim boundary: ${boundary}`}
                          >
                            {compactBoundary(boundary)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </article>
            ))}
          </div>
        </ReadbackPanel>
        <ReadbackPanel title="Proof artifacts and boundaries">
          <Text>Full source route, proof artifact paths, no-overclaim boundaries, and AI contract digest readback remain available in metadata, title text, and accessible labels while the visible table stays compact.</Text>
        </ReadbackPanel>
        <EvidenceStrip items={["durable source record", "AI contract digest verified by smoke", "proof receipts required", "no publication"]} />
      </section>
    )
  }
];

export function selectStory(id: string): ContractStory {
  const story = legacyContractStories.find((item) => item.id === id);
  if (!story) {
    throw new Error(`missing_contract_story:${id}`);
  }
  const governance = storyGovernanceFor(story.id, story.group);
  const category = storyCategoryFor(story.group, governance.categoryId);
  return {
    ...story,
    ...governance,
    category: category.label
  };
}
