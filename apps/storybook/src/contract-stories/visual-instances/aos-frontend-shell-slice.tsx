import {
  Badge,
  DisclosurePanel,
  EnvironmentBanner,
  EvidenceStrip,
  Heading,
  InlineAlert,
  KeyValueList,
  ProductShell,
  ReadbackPanel,
  StatusBadge,
  TableShell,
  Text,
  type ProductShellNavGroup,
  type ProductShellSearchResult
} from "@tcrn/ui-react";
import { tcrnDefaultLocale, tcrnLocaleMetadata } from "@tcrn/ui-copy-state";

export const aosFrontendShellSliceVisualInstanceReadback = {
  storyId: "aos-frontend-shell-slice",
  page: "components.html#aos-frontend-shell-slice",
  selector: "[data-storybook-visual-instance=\"aos-frontend-shell-slice\"]",
  visualInstanceName: "AosFrontendShellSliceVisualInstance",
  packageMapping: {
    shell: "ProductShell",
    controllerContract: "useProductShellController",
    search: "ProductShellSearch",
    brand: "ShellBrandLockup through ProductShell",
    content: [
      "EnvironmentBanner",
      "InlineAlert",
      "ReadbackPanel",
      "KeyValueList",
      "EvidenceStrip",
      "TableShell",
      "StatusBadge",
      "DisclosurePanel"
    ]
  },
  slots: [
    "brand lockup",
    "attached side navigation",
    "topbar current-location and utility controls",
    "search rest/focus/results surface",
    "primary shell content",
    "secondary raw technical disclosure"
  ],
  props: {
    productName: "AOS Rebuild Workspace",
    moduleName: "Frontend shell slice",
    brandSuffix: "AOS",
    navLabel: "AOS visual instance modules",
    currentRouteLabel: "Cockpit",
    primaryIa: ["Cockpit", "Work"],
    contentId: "content",
    contentRole: "region"
  },
  variants: [
    "desktop-light-expanded-cockpit-search-results",
    "desktop-dark-expanded-cockpit",
    "desktop-light-collapsed-work",
    "mobile-dark-work-stacked",
    "reduced-motion"
  ],
  supportedStates: [
    "light",
    "dark",
    "zh-CN",
    "desktop",
    "mobile",
    "expanded side navigation",
    "collapsed side navigation",
    "search rest",
    "search focus",
    "search results",
    "search dismissal",
    "locale menu selection and dismissal",
    "theme wash or reduced-motion fallback"
  ],
  negativeCriteria: [
    "no Storybook-only prototype classes",
    "no product-local visible CSS system",
    "no deprecated AOS wordmark assets",
    "no unregistered primary IA",
    "no raw API/debug payload as primary UX",
    "no owner/product/release/live-dispatch readiness claim"
  ]
} as const;

const navGroups: ProductShellNavGroup[] = [
  {
    id: "aos-frontend-shell-slice-primary-ia",
    label: "Registered shell entries",
    selected: true,
    items: [
      { id: "cockpit", label: "Cockpit", href: "/cockpit", iconName: "home", selected: true },
      { id: "work", label: "Work", href: "/work", iconName: "database" }
    ]
  }
];

const searchResults: ProductShellSearchResult[] = [
  { id: "cockpit", title: "Cockpit", meta: "Registered shell entry", href: "/cockpit", selected: true },
  { id: "work", title: "Work", meta: "Jira-like module entry", href: "/work" },
  { id: "work-gate", title: "Gate evidence", meta: "Fixture-safe Work row", href: "/work" }
];

const workRows = [
  {
    project: "AOS",
    initiative: "Frontend shell recovery",
    story: "Registered shell slice",
    gate: "DS visual instance",
    evidence: "Storybook parity proof",
    assignment: "Ilya",
    state: <StatusBadge state={{ state: "proof_required" }} />
  },
  {
    project: "AOS",
    initiative: "Cockpit",
    story: "Dummy Cockpit only",
    gate: "Deferred aggregation",
    evidence: "No live dispatch",
    assignment: "Product route",
    state: <StatusBadge state={{ state: "not_claimed" }} />
  }
];

export function AosFrontendShellSliceVisualInstance() {
  return (
    <ProductShell
      productName="AOS Rebuild Workspace"
      moduleName="Frontend shell slice"
      brandSuffix="AOS"
      brandCaption="Rebuild workspace"
      brandMarkSrc="tcrn-brand-mark.svg"
      brandMarkAlt="TCRN registered brand mark"
      currentRouteLabel="Cockpit"
      navLabel="AOS visual instance modules"
      navGroups={navGroups}
      collapsed={false}
      collapsedStorageKey="tcrn-aos-side-nav-collapsed"
      currentTheme="light"
      locales={tcrnLocaleMetadata}
      currentLocale={tcrnDefaultLocale}
      contentId="content"
      contentRole="region"
      contentLabel="AOS shell content"
      skipLinkLabel="Skip to shell content"
      search={{
        label: "Search AOS shell",
        placeholder: "Search modules, work items, or proof",
        shortcut: "auto",
        query: "cockpit",
        expanded: true,
        results: searchResults,
        resultsLabel: "AOS shell search results",
        emptyLabel: "No local fixture results"
      }}
      data-storybook-visual-instance="aos-frontend-shell-slice"
      data-visual-instance-name="AosFrontendShellSliceVisualInstance"
      data-visual-instance-disposition="storybook_visual_instance_oracle_admitted_for_aos"
      data-visual-instance-style-source="@tcrn/ui-react/tcrnComponentCss"
      data-visual-instance-slots="brand side-nav topbar search content secondary-disclosure"
      data-visual-instance-primary-ia="cockpit-work-only"
      data-visual-instance-negative-criteria="no-local-visible-css no-storybook-only-prototype no-raw-primary no-owner-readiness"
      data-product-acceptance="not-claimed"
      data-release-readiness="not-claimed"
      data-live-dispatch="not-enabled"
      data-aos-visual-instance-oracle="true"
    >
      <EnvironmentBanner label="AOS frontend shell slice" state={{ state: "local_only" }} />
      <InlineAlert tone="warning">
        <strong>Local structural slice only</strong>
        <span>No live dispatch, external queue, product acceptance, or release readiness is claimed.</span>
      </InlineAlert>

      <ReadbackPanel title="AOS frontend shell first viewport">
        <Heading level={4} id="aos-shell-slice-heading">AOS frontend shell</Heading>
        <Text>
          This visual instance is the package-backed Storybook oracle for the first AOS shell slice: DS ProductShell navigation,
          compact shell controls, local-only readback posture, dummy Cockpit, and the Work entry.
        </Text>
        <KeyValueList
          items={[
            { key: "runtime", label: "Runtime", value: "local fixture" },
            { key: "stories", label: "Stories", value: "finite readback" },
            { key: "gates", label: "Gates", value: "proof required" },
            { key: "auditEvents", label: "Audit events", value: "synthetic only" }
          ]}
        />
        <EvidenceStrip items={["registered DS surfaces", "ProductShell boundary", "Cockpit + Work only"]} />
      </ReadbackPanel>

      <section id="cockpit" data-aos-dummy-cockpit="true" aria-labelledby="aos-shell-cockpit-heading">
        <ReadbackPanel title="Dummy Cockpit">
          <Heading level={4} id="aos-shell-cockpit-heading">Dummy Cockpit</Heading>
          <Badge tone="warning">structural placeholder</Badge>
          <KeyValueList
            items={[
              { key: "queue", label: "External queue", value: "none" },
              { key: "dispatch", label: "Live dispatch", value: "not enabled" },
              { key: "acceptance", label: "Product acceptance", value: "not claimed" },
              { key: "release", label: "Release readiness", value: "not claimed" }
            ]}
          />
          <EvidenceStrip items={["local fixture", "dummy Cockpit only", "no live dispatch"]} />
        </ReadbackPanel>
        <ReadbackPanel title="Backend readback">
          <Text data-api-state>API readbacks use fixture-safe service summaries, not a primary raw JSON/debug surface.</Text>
          <KeyValueList
            items={[
              { key: "runtime", label: "Runtime", value: "local fixture" },
              { key: "queue", label: "External queue", value: "none" },
              { key: "policy", label: "Policy", value: "service proof only" },
              { key: "readback", label: "Readback counts", value: "finite local counts" }
            ]}
          />
          <EvidenceStrip items={["/api/health", "/api/readback", "/api/policy"]} />
          <DisclosurePanel expanded={false} title="Technical API payload" data-raw-json-disclosure="secondary">
            <pre hidden data-api-summary>{JSON.stringify({ ok: true, source: "fixture-safe-readback" }, null, 2)}</pre>
          </DisclosurePanel>
        </ReadbackPanel>
      </section>

      <section id="work" data-aos-work-module-entry="jira-like" aria-labelledby="aos-shell-work-heading">
        <ReadbackPanel title="Work module entry">
          <Heading level={4} id="aos-shell-work-heading">Work module entry</Heading>
          <Badge tone="neutral">fixture-safe rows</Badge>
          <TableShell
            label="AOS work module entry visual instance"
            columns={[
              { key: "project", label: "Project" },
              { key: "initiative", label: "Initiative" },
              { key: "story", label: "Story" },
              { key: "gate", label: "Gate" },
              { key: "evidence", label: "Evidence" },
              { key: "assignment", label: "Assignment" },
              { key: "state", label: "State" }
            ]}
            rows={workRows}
          />
        </ReadbackPanel>
      </section>

      <section aria-labelledby="aos-shell-boundary-heading" data-aos-registered-module-boundary="cockpit-work-only">
        <ReadbackPanel title="Registered slice boundary">
          <Heading level={4} id="aos-shell-boundary-heading">Registered slice boundary</Heading>
          <Badge tone="neutral">Cockpit + Work only</Badge>
          <KeyValueList
            items={[
              { key: "visible-nav", label: "Visible primary navigation", value: "Cockpit and Work" },
              { key: "future-modules", label: "Future modules", value: "require separate owner route" },
              { key: "raw-payload", label: "Raw technical payload", value: "secondary disclosure only" },
              { key: "acceptance", label: "Acceptance", value: "not claimed" }
            ]}
          />
        </ReadbackPanel>
      </section>
    </ProductShell>
  );
}
