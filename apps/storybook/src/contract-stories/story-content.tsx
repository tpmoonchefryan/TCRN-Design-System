import type { ReactNode } from "react";
import {
  Badge,
  Button,
  Breadcrumb,
  componentLibraryDeferredPrototypeNames,
  componentLibraryPublicComponentNames,
  componentLibraryPublicUtilityNames,
  ConfirmActionDialog,
  ActionDrawer,
  DetailDrawer,
  DetailInspector,
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
  Popover,
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
  tcrnIconNames,
  WorkIndex
} from "@tcrn/ui-react";
import {
  presentCopyState,
  tcrnDefaultLocale,
  tcrnFallbackLocale,
  tcrnI18nContract,
  tcrnLocaleMetadata
} from "@tcrn/ui-copy-state";
import type { ContractStory, ContractStoryGroup } from "./types.js";
import {
  DialogSpecFixture,
  OverlayFocusFixture,
  OverlayModeMatrix,
  OverlayStaticModes,
  PopoverSpecFixture
} from "./fixtures/overlay.js";
import { ProductLockup, TcrnBrandMark } from "./prototypes/brand-lockups.js";
import {
  CompactToolShellDemo,
  KnowledgeBaseShellDemo,
  StorybookEntryShellStrip,
  TmsDenseShellDemo
} from "./prototypes/storybook-shell-demos.js";
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

const legacyContractStories: ContractStory[] = [
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
    description: "TCRN mother-brand mark, product suffix lockups, and local draft boundaries.",
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
        <ReadbackPanel title="Product lockups">
          <div className="tcrn-brand-lockups" aria-label="TCRN product lockup examples">
            <ProductLockup suffix="AOS" suffixClassName="tcrn-brand-wordmark__suffix--aos" />
            <ProductLockup suffix="TMS" suffixClassName="tcrn-brand-wordmark__suffix--tms" />
            <ProductLockup suffix="Design System" suffixClassName="tcrn-brand-wordmark__suffix--design-system" />
          </div>
          <Text>Product suffix typography follows the mother-brand wordmark rhythm. Long product suffixes stack below TCRN; suffix color is product-owned and must not change the TCRN symbol colors.</Text>
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
              { token: "Body copy", size: "13px / 1.45 / 400", usage: "Rules, descriptions, table cells, and proof notes." },
              { token: "Control text", size: "13px / 1.2 / 600", usage: "Buttons, tabs, labels, and compact control text." },
              { token: "Caption", size: "11px / 1.35 / 600", usage: "Metadata, helper text, and evidence strip context." },
              { token: "Code text", size: "12px / 1.4 / mono", usage: "Token names, ids, commands, and technical readback." }
            ]}
          />
          <div className="tcrn-type-scale-demo" aria-label="Type scale specimen">
            <p className="tcrn-type-scale-demo__page">Page title / 28px</p>
            <p className="tcrn-type-scale-demo__section">Section title / 18px</p>
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
            This contract story documents only the first approved Gemini candidate batch: inline highlight text, loading skeletons, and presentation-only state surfaces. Tooltip, clipboard, masking, animated counters, disclosure, DataGrid, query builder, and command palette remain deferred or rejected.
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
        </ReadbackPanel>
        <ReadbackPanel title="Pagination and skip-link boundary">
          <Text>Pagination and skip links belong to shared navigation primitives because they preserve orientation, keyboard access, and proof context across long surfaces.</Text>
          <Pagination label="Synthetic component pages" />
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
      <section className="alpha-story-stack">
        <ReadbackPanel title="Current checkpoint">
          <KeyValueList
            items={[
              { key: "checkpoint", label: "Checkpoint", value: "Storybook IA and governance surface upgrade" },
              { key: "basis", label: "Basis", value: "Owner-approved local implementation route" },
              { key: "boundary", label: "Boundary", value: "No package publication, no product adoption, no downstream acceptance claim" }
            ]}
          />
        </ReadbackPanel>
        <EvidenceStrip items={["local source change", "synthetic stories", "proof rerun required", "no remote"]} />
      </section>
    )
  }
];

export function selectStory(id: string): ContractStory {
  const story = legacyContractStories.find((item) => item.id === id);
  if (!story) {
    throw new Error(`missing_contract_story:${id}`);
  }
  return story;
}
