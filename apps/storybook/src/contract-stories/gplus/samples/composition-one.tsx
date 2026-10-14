// Composition one ("one sheet") for the five first-batch sample stories: the D section of each board
// (typography, icon, brand, actions, inputs) rebuilt from package components on the top-band shell
// (TCRN-DS-SUB-134; MIN-20261013-SHELL D1 and D4).
//
// The shell is the package ProductShell in its one state, the top band and the paper, set up as the
// boards' D-section screens are (docs/design/gplus-2026-10/tools/shell-screen.mjs sampleScreens; 07a
// board, sections A1 and A2): the TMS brand button, the pinned Roster, Contracts, Statements and
// Schedule, the bell with three unread and the avatar, and the boards' menu model (People, Operations,
// System). Each sample sets the board's trail (parent › page); the actions sample's page is the Roster
// entry, so its pin is the current one. The paper's first row is the sample's page header
// (TCRN-DS-SUB-129), then the page. This module adds no styles and sets no shell parameter.
// The shell root carries the C-5 hooks the frame measurement reads (data-shell with data-state, the
// band's data-shell-strip, data-paper); data-shell is the board's screen name (ty-l, ty-n, ...). The
// side rail and its guide column went with composition one, so every sample shell opts out of the rail
// measurement with data-measure-skip="rail" (INIT-016 R1 decomposition problem 24); the full menu's guide
// column is read by the shell gate.
import {
  Badge,
  Button,
  ButtonGroup,
  Checkbox,
  ClipboardCopyButton,
  DatePicker,
  Field,
  Highlight,
  Icon,
  IconButton,
  Input,
  LinkButton,
  MultiSelect,
  NumberInput,
  ProductLockup,
  ProductShell,
  RadioGroup,
  Select,
  Switch,
  TableShell,
  Text,
  Textarea,
  tcrnProductTagline,
  type IconName,
  type PageHeaderProps,
  type ProductShellAccount,
  type ProductShellNavGroup,
  type ProductShellNavItem,
  type ProductShellNotifications,
  type TcrnProductLogoId
} from "@tcrn/ui-react";
import { tcrnDefaultLocale, tcrnLocaleMetadata } from "@tcrn/ui-copy-state";
import type { CSSProperties, ReactNode } from "react";
import { StaticMarkup } from "../matrix-renderer.js";

export type GplusSampleBoard = "typography" | "icon" | "brand" | "actions" | "inputs";
export type GplusSampleTheme = "light" | "night";

export const gplusSampleThemes: readonly GplusSampleTheme[] = ["light", "night"];

const themeAttribute: Record<GplusSampleTheme, "light" | "dark"> = { light: "light", night: "dark" };
const themeSuffix: Record<GplusSampleTheme, "l" | "n"> = { light: "l", night: "n" };

/** data-shell prefix per board, as on the boards' D-section screens (ty-l, ic-n, ...). */
export const gplusSampleShellKeys: Readonly<Record<GplusSampleBoard, string>> = {
  typography: "ty",
  icon: "ic",
  brand: "br",
  actions: "ac",
  inputs: "in"
};

// The boards' pinned items (PINS) and menu model (NAV): People, Operations and System, down to the
// fourth level under Contracts › Templates. Rows with a next level open it and carry no href.
const samplePinnedIds: readonly string[] = ["roster", "contracts", "statements", "schedule"];
const sampleAccount: ProductShellAccount = { name: "Lin Xiao", initials: "LX" };
const sampleNotifications: ProductShellNotifications = { unread: 3 };

function sampleNavGroups(storyId: string, selected: string | null): ProductShellNavGroup[] {
  const href = `#${storyId}`;
  const entry = (id: string, label: string, iconName?: IconName, children?: ProductShellNavItem[]): ProductShellNavItem => ({
    id,
    label,
    ...(children ? { children } : { href }),
    ...(iconName ? { iconName } : {}),
    ...(id === selected ? { selected: true } : {})
  });
  return [
    {
      id: "people",
      label: "People",
      items: [
        entry("roster", "Roster", "users"),
        entry("teams", "Teams", "layers"),
        entry("contracts", "Contracts", "book-open", [
          entry("all-contracts", "All contracts"),
          entry("templates", "Templates", undefined, [
            entry("signing-contracts", "Signing contracts"),
            entry("agency-contracts", "Agency contracts"),
            entry("event-contracts", "Event contracts"),
            entry("confidentiality-agreements", "Confidentiality agreements")
          ]),
          entry("approvals", "Approvals"),
          entry("expiry-reminders", "Expiry reminders")
        ]),
        entry("statements", "Statements", "database")
      ]
    },
    {
      id: "operations",
      label: "Operations",
      items: [
        entry("schedule", "Schedule", "calendar", [entry("this-week", "This week"), entry("month-view", "Month view"), entry("conflict-check", "Conflict check")]),
        entry("live-streams", "Live streams", "globe-2"),
        entry("events", "Events", "package"),
        entry("reports", "Reports", "layout-grid")
      ]
    },
    {
      id: "system",
      label: "System",
      items: [
        entry("members", "Members", "users"),
        entry("permissions", "Permissions", "shield-check"),
        entry("settings", "Settings", "settings"),
        entry("audit-log", "Audit log", "history")
      ]
    }
  ];
}

/** What a sample (or composition three) gives the shell; the rest is the boards' shell. */
export interface GplusSampleShellSpec {
  moduleName: string;
  /** Accessible name of the shell's content region: the sample's own name. */
  landmarkLabel: string;
  /** Name of the current page. */
  routeLabel: string;
  /** The menu entry that is the current page (its pin is the current one); null when the menu holds no such entry. */
  selected: string | null;
  /** The board's trail, parent › page, for a page the menu model does not hold; omitted, the trail is the current position. */
  trail?: readonly [string, string];
}

// The samples share one page, each with a light and a night shell, so every shell names its content
// region after its sample and the night shell adds the block name. Shared names would give the page
// sets of identical landmarks.
const landmarkSuffix: Record<GplusSampleTheme, string> = { light: "", night: " (night)" };

// TCRN-DS-SUB-160 (STORY-140, 147): the shell's root is a viewport high (block-size 100dvh) and the
// page scrolls in its paper, so a shell set in the middle of a long story is framed: the frame has a
// fixed height and the shell fills it through its own style. The shell itself is not changed.
// TCRN-DS-SUB-205 (STORY-146, 148, 149): the shell sits in the static-markup wrapper, not in the frame,
// so the wrapper fills the frame as well; without it the shell's 100% resolved against the wrapper's
// auto height and the shell grew to its content (661, 681) past the 640 frame. With both, the shell is
// the frame's height and the page scrolls in the paper.
const sampleShellFrameStyle: CSSProperties = { blockSize: "640px" };
const sampleShellFillStyle: CSSProperties = { blockSize: "100%" };

/**
 * One themed block: the package ProductShell in the boards' set-up with the page in its paper. The night
 * block differs from the light block only in data-tcrn-theme on its wrapper and in its landmark name;
 * the shell's own theme control reports the theme it is showing, as the board's night screen does.
 */
export function GplusSampleShell({ storyId, shellName, theme, spec, pageHeader, attributes, children }: { storyId: string; shellName: string; theme: GplusSampleTheme; spec: GplusSampleShellSpec; pageHeader: PageHeaderProps; attributes?: Readonly<Record<string, string>>; children: ReactNode }) {
  const prefix = `${storyId}-${theme}`;
  const landmarkLabel = `${spec.landmarkLabel}${landmarkSuffix[theme]}`;
  // The documentation page has its own h1, so the sample page's title is a level-2 heading
  // (TCRN-DS-SUB-150, SUB-163).
  const header: PageHeaderProps = spec.trail
    ? { ...pageHeader, headingLevel: 2, breadcrumbs: [{ id: `${prefix}-trail-parent`, label: spec.trail[0], href: `#${storyId}` }, { id: `${prefix}-trail-page`, label: spec.trail[1] }] }
    : { ...pageHeader, headingLevel: 2 };
  const shell = (
    <ProductShell
      style={sampleShellFillStyle}
      productName="TCRN TMS"
      moduleName={spec.moduleName}
      brandProductId="tms"
      currentRouteLabel={spec.routeLabel}
      pageHeader={header}
      navGroups={sampleNavGroups(storyId, spec.selected)}
      locales={tcrnLocaleMetadata}
      currentLocale={tcrnDefaultLocale}
      currentTheme={themeAttribute[theme]}
      account={sampleAccount}
      notifications={sampleNotifications}
      pinnedIds={samplePinnedIds}
      onPinnedChange={() => undefined}
      // The sample's name names all of the shell's landmarks, apart from the page's shell and the
      // other samples' (TCRN-DS-SUB-150, SUB-148).
      landmarkLabel={landmarkLabel}
      contentId={`${prefix}-content`}
      contentLabel={landmarkLabel}
      data-shell={`${shellName}-${themeSuffix[theme]}`}
      data-measure-skip="rail"
      {...attributes}
    >
      <div className="tcrn-product-shell-content-stack">{children}</div>
    </ProductShell>
  );
  return (
    <div data-tcrn-theme={themeAttribute[theme]} data-gplus-sample-theme={theme}>
      <div data-shell-frame="" style={sampleShellFrameStyle}>
        <StaticMarkup id={prefix} block element={shell} edits={[]} style={sampleShellFillStyle} />
      </div>
    </div>
  );
}

function mono(value: string) {
  return <Text className="tcrn-text--mono">{value}</Text>;
}

function projectCell(name: ReactNode, id: string) {
  return (
    <>
      <Text tone="strong">{name}</Text>
      {mono(id)}
    </>
  );
}

function amount(whole: string) {
  return <Text variant="numeral" className="tcrn-text--numeral-inline">{whole}<small>.00</small></Text>;
}

function Metric({ label, value, unit, note, tone }: { label: string; value: string; unit?: string; note: string; tone?: "positive" | "warning" }) {
  return (
    <div data-gplus-sample-metric={label}>
      <Text variant="caps">{label}</Text>
      <Text variant="numeral">{value}{unit ? <small>{unit}</small> : null}</Text>
      {tone ? <Badge tone={tone}>{note}</Badge> : <Text size="meta">{note}</Text>}
    </div>
  );
}

// Typography — billing page: serif page title, serif metric numerals, numbered section label,
// monospaced IDs, a search hit and links.
function BillingPage() {
  return (
    <>
      <div className="tcrn-doc-display-primitive-grid">
        <Metric label="Amount due" value="4,280" unit=".00 CNY" note="Due 10-31" />
        <Metric label="Seats" value="86" unit="/ 120" note="34 seats left" tone="positive" />
        <Metric label="Last period" value="4,280" unit=".00 CNY" note="Paid 09-30" />
        <Metric label="Pending" value="2" note="1 overdue" tone="warning" />
      </div>
      <Text variant="caps"><b>01</b>Invoice lines</Text>
      <TableShell
        label="Invoice lines"
        columns={[
          { key: "project", label: "Project" },
          { key: "id", label: "ID" },
          { key: "status", label: "Status" },
          { key: "amount", label: "Amount" }
        ]}
        rows={[
          { project: <Text tone="strong"><Highlight text="Design system components" query="Design" /></Text>, id: mono("PRJ-2026-0412"), status: <Badge tone="positive">Settled</Badge>, amount: amount("1,200") },
          { project: <Text tone="strong">Quarterly review</Text>, id: mono("PRJ-2026-0391"), status: <Badge tone="warning">Awaiting confirmation</Badge>, amount: amount("600") },
          { project: <Text tone="strong">October launch</Text>, id: mono("PRJ-2026-0377"), status: <Badge tone="positive">Settled</Badge>, amount: amount("1,500") },
          { project: <Text tone="strong">Autumn hiring</Text>, id: mono("PRJ-2026-0360"), status: <Badge tone="danger">Overdue</Badge>, amount: amount("980") }
        ]}
      />
      <Text size="meta">Seats are billed monthly and invoices are issued on the 1st; annual plans are charged once in the current invoice.</Text>
      <div className="tcrn-doc-action-row">
        <a className="tcrn-link" href="#typography-sample-billing">Billing guide</a>
        <a className="tcrn-link" href="#typography-sample-billing">Download invoice</a>
      </div>
    </>
  );
}

function projectRows(actions: (id: string, index: number) => ReactNode) {
  const projects = [
    { name: "Quarterly review", id: "PRJ-2026-0391", team: "Design team", status: <Badge tone="positive">Active</Badge> },
    { name: "October launch", id: "PRJ-2026-0377", team: "Product team", status: <Badge tone="positive">Active</Badge> },
    { name: "Autumn hiring", id: "PRJ-2026-0360", team: "People team", status: <Badge tone="warning">Awaiting confirmation</Badge> },
    { name: "Component library", id: "PRJ-2026-0412", team: "Design team", status: <Badge>Archived</Badge> }
  ];
  return projects.map((project, index) => ({
    project: projectCell(project.name, project.id),
    team: <Text>{project.team}</Text>,
    status: project.status,
    actions: actions(project.id, index)
  }));
}

const projectColumns = [
  { key: "project", label: "Project" },
  { key: "team", label: "Team" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" }
];

// Icon — project list: the shell's band icons (bell, menu toggle), header and toolbar icons,
// pagination and row-end arrows.
function IconProjectsPage() {
  return (
    <>
      <div className="tcrn-doc-action-row">
        <IconButton ariaLabel="List" iconName="menu" variant="quiet" aria-pressed="true" />
        <IconButton ariaLabel="Grid" iconName="layout-grid" variant="quiet" aria-pressed="false" />
        <Text size="meta"><Icon name="info" />Archived projects do not count toward seats</Text>
        <IconButton ariaLabel="Previous page" iconName="chevron-left" variant="quiet" />
        {mono("1 / 3")}
        <IconButton ariaLabel="Next page" iconName="chevron-right" variant="quiet" />
      </div>
      <TableShell
        label="Projects"
        columns={projectColumns}
        rows={projectRows(() => (
          <div className="tcrn-doc-action-row">
            <IconButton ariaLabel="More" iconName="more-horizontal" variant="quiet" size="sm" />
            <IconButton ariaLabel="Open" iconName="arrow-right" variant="quiet" size="sm" />
          </div>
        ))}
      />
      <Text variant="caps">1–4 of 12</Text>
    </>
  );
}

const registeredProducts: readonly TcrnProductLogoId[] = ["design-system", "tms", "einzbern", "mana-orchestrate"];

// Brand — product page: the brand button's first row (mark 22 and wordmark) in the band, product
// lockups in the table at 28, a footnote.
// The board's asset ID column is left out: the design-system asset ID spells the repository name,
// which the rendered-text vocabulary scan rejects on every page.
function BrandProductsPage() {
  return (
    <>
      <TableShell
        label="Products"
        columns={[
          { key: "product", label: "Product" },
          { key: "tagline", label: "Tagline" },
          { key: "registration", label: "Registration" }
        ]}
        rows={registeredProducts.map((productId) => ({
          product: <ProductLockup productId={productId} />,
          tagline: <Text>{tcrnProductTagline(productId, tcrnDefaultLocale)}</Text>,
          registration: <Badge tone="positive">Registered</Badge>
        }))}
      />
      <Text size="meta">Brand marks are copied from the documentation assets and checked by hash at build time; wordmarks and taglines are text from the product logo registry.</Text>
    </>
  );
}

function copiedClipboard(storyId: string, theme: GplusSampleTheme, text: string) {
  return (
    <StaticMarkup
      id={`${storyId}-${theme}-copied`}
      element={<ClipboardCopyButton text={text} ariaLabel="Copy ID" idleLabel="Copied" variant="quiet" size="sm" />}
      edits={[{ marker: 'data-clipboard-copy-state="idle"', set: { "data-clipboard-copy-state": "copied" } }]}
    />
  );
}

// Actions — roster page, as on the board's D section since TCRN-DS-SUB-133: quiet, secondary and
// primary in the header (History, Export, Invite members), two ButtonGroups and a LinkButton in the
// toolbar, ClipboardCopyButton (the first row copied) and IconButton in rows, and the selection's danger
// zone at the bottom. The board's second row (a Latin name) is a roster neighbour with a Hangul name, so
// the zh-CN page carries no Latin run (see the storybook map, DIFF-11).
const rosterRows = [
  { name: "星野ひかり", id: "hoshino", team: "Team A", status: <Badge tone="positive">Signed</Badge> },
  { name: "김하늘", id: "kim", team: "Team C", status: <Badge tone="warning">Trial</Badge> },
  { name: "陈嘉怡", id: "chen", team: "Team B", status: <Badge tone="positive">Signed</Badge> }
];

function ActionsRosterPage({ storyId, theme }: { storyId: string; theme: GplusSampleTheme }) {
  return (
    <>
      <div className="tcrn-doc-action-row">
        <ButtonGroup ariaLabel="View">
          <IconButton ariaLabel="List" iconName="menu" size="sm" aria-pressed="true" />
          <IconButton ariaLabel="Grid" iconName="layout-grid" size="sm" aria-pressed="false" />
        </ButtonGroup>
        <ButtonGroup ariaLabel="Status">
          <Button size="sm" aria-pressed="true">All</Button>
          <Button size="sm" aria-pressed="false">Signed</Button>
          <Button size="sm" aria-pressed="false">Trial</Button>
        </ButtonGroup>
        <LinkButton variant="quiet" size="sm" href={`#${storyId}`}>View all 24<Icon name="arrow-right" /></LinkButton>
      </div>
      <TableShell
        label="Roster"
        columns={[
          { key: "talent", label: "Talent" },
          { key: "team", label: "Team" },
          { key: "status", label: "Status" },
          { key: "actions", label: "Actions" }
        ]}
        rows={rosterRows.map((row, index) => ({
          talent: projectCell(row.name, row.id),
          team: <Text>{row.team}</Text>,
          status: row.status,
          actions: (
            <div className="tcrn-doc-action-row">
              {index === 0
                ? copiedClipboard(storyId, theme, row.id)
                : <ClipboardCopyButton text={row.id} ariaLabel="Copy ID" idleLabel="Copy ID" variant="quiet" size="sm" />}
              <IconButton ariaLabel="Open" iconName="arrow-right" variant="quiet" size="sm" />
            </div>
          )
        }))}
      />
      <div className="tcrn-doc-form-stack" data-gplus-sample-danger-zone="true">
        <div>
          <Text tone="strong">1 selected</Text>
          <Text size="meta">Removing someone from the roster keeps their contracts and statements; they can be restored within 30 days.</Text>
        </div>
        <div className="tcrn-doc-action-row">
          <Button variant="secondary">Cancel selection</Button>
          <Button variant="danger"><Icon name="trash" />Remove from roster</Button>
        </div>
      </div>
    </>
  );
}

const roleOptions = [
  { value: "member", label: "Member" },
  { value: "admin", label: "Admin" },
  { value: "read-only", label: "Read-only" }
];

const inviteProjectOptions = [
  { value: "review", label: "Quarterly review" },
  { value: "launch", label: "October launch" },
  { value: "hiring", label: "Autumn hiring" }
];

// Inputs — invite members: Input, Select, MultiSelect, NumberInput, DatePicker, Textarea,
// RadioGroup, Switch and Checkbox; the shell's search is in its full menu.
function InviteMembersPage({ storyId, theme }: { storyId: string; theme: GplusSampleTheme }) {
  return (
    <>
      <div className="tcrn-doc-interaction-primitive-grid">
        <Field label="Email" hint="Required">
          <Input type="email" defaultValue="wang.yf@tcrn.app" />
        </Field>
        <Field label="Role">
          <Select defaultValue="member" options={roleOptions} />
        </Field>
        <Field label="Projects" hint="Select several; you can change this after the invitation">
          <MultiSelect presentation="dropdown" defaultValue={["review", "launch", "hiring"]} options={inviteProjectOptions} />
        </Field>
        <Field label="Seats" hint="34 seats left, billed per seat">
          <NumberInput defaultValue={1} min={1} max={34} />
        </Field>
        <Field label="Expiry date" hint="Optional">
          <DatePicker defaultValue="2026-12-31" min="2026-10-11" />
        </Field>
        <Field label="Message">
          <Textarea defaultValue="Welcome to the design team; the quarterly review is on 20 October." />
        </Field>
      </div>
      <RadioGroup
        legend="Visibility"
        name={`${storyId}-${theme}-visibility`}
        defaultValue="team"
        options={[
          { value: "team", label: "Team only", description: "Visible to the 12 people in Design team" },
          { value: "private", label: "Private", description: "Only invited members" }
        ]}
      />
      <div className="tcrn-doc-action-row">
        <Switch label="Email notifications" description="Invitations and expiry reminders" defaultChecked />
        <label className="tcrn-doc-action-row">
          <Checkbox />
          <Text>Also send the weekly digest</Text>
        </label>
      </div>
      <div className="tcrn-doc-action-row">
        <Button variant="quiet">Cancel</Button>
        <Button variant="primary">Send invitation</Button>
      </div>
    </>
  );
}

// Each sample's page header is the shell's (TCRN-DS-SUB-129): ProductShell renders it as the paper's
// first row, and its trail is the sample's current position in the menu model.
const samplePageHeaders: Readonly<Record<GplusSampleBoard, PageHeaderProps>> = {
  typography: { title: "Billing", description: "October 2026 · billed per seat", meta: mono("INV-2026-10-0031") },
  icon: {
    title: "Projects",
    description: "12 projects · 3 archived",
    meta: (
      <div className="tcrn-doc-action-row">
        <Button variant="quiet"><Icon name="history" />History</Button>
        <Button variant="secondary"><Icon name="external-link" />Export</Button>
        <Button variant="primary"><Icon name="plus" />New project</Button>
      </div>
    )
  },
  brand: {
    title: "Products",
    description: "4 registered · Latin wordmarks · taglines in five languages",
    meta: <Button variant="quiet"><Icon name="external-link" />Brand assets</Button>
  },
  actions: {
    title: "Roster",
    description: "24 people · 3 to invite",
    meta: (
      <div className="tcrn-doc-action-row">
        <Button variant="quiet"><Icon name="history" />History</Button>
        <Button variant="secondary">Export<Icon name="external-link" /></Button>
        <Button variant="primary"><Icon name="plus" />Invite members</Button>
      </div>
    )
  },
  inputs: { title: "Invite members", description: "Joining Design team · seats 86 / 120" }
};

// The trails are the boards' D-section crumbs: Settings › Billing, Operations › Projects, People ›
// Roster (the menu's Roster entry, so the trail is its current position and its pin is current) and
// Members › Invite. The brand board has no D section (decomposition problem 4); its trail is the brand
// generator's sample crumbs, Design team › Products.
const sampleSpecs: Readonly<Record<GplusSampleBoard, GplusSampleShellSpec>> = {
  typography: { moduleName: "Billing", landmarkLabel: "Typography sample: billing", routeLabel: "Billing", selected: null, trail: ["Settings", "Billing"] },
  icon: { moduleName: "Projects", landmarkLabel: "Icon sample: projects", routeLabel: "Projects", selected: null, trail: ["Operations", "Projects"] },
  brand: { moduleName: "Products", landmarkLabel: "Brand sample: products", routeLabel: "Products", selected: null, trail: ["Design team", "Products"] },
  actions: { moduleName: "Roster", landmarkLabel: "Actions sample: roster", routeLabel: "Roster", selected: "roster" },
  inputs: { moduleName: "Members", landmarkLabel: "Inputs sample: invite members", routeLabel: "Invite", selected: null, trail: ["Members", "Invite"] }
};

function SamplePage({ board, storyId, theme }: { board: GplusSampleBoard; storyId: string; theme: GplusSampleTheme }) {
  switch (board) {
    case "typography":
      return <BillingPage />;
    case "icon":
      return <IconProjectsPage />;
    case "brand":
      return <BrandProductsPage />;
    case "actions":
      return <ActionsRosterPage storyId={storyId} theme={theme} />;
    case "inputs":
      return <InviteMembersPage storyId={storyId} theme={theme} />;
  }
}

/** One themed block: the top-band shell with the board's page in its paper. */
export function GplusSampleBlock({ board, storyId, theme }: { board: GplusSampleBoard; storyId: string; theme: GplusSampleTheme }) {
  return (
    <GplusSampleShell storyId={storyId} shellName={gplusSampleShellKeys[board]} theme={theme} spec={sampleSpecs[board]} pageHeader={samplePageHeaders[board]} attributes={{ "data-gplus-sample-shell": board }}>
      <SamplePage board={board} storyId={storyId} theme={theme} />
    </GplusSampleShell>
  );
}

/** Light block, then night block; the two differ only in data-tcrn-theme and the shell theme control. */
export function GplusSampleBoardView({ board, storyId }: { board: GplusSampleBoard; storyId: string }) {
  return (
    <div className="alpha-story-stack" data-gplus-sample={board} data-gplus-sample-layout="stacked">
      {gplusSampleThemes.map((theme) => (
        <GplusSampleBlock key={theme} board={board} storyId={storyId} theme={theme} />
      ))}
    </div>
  );
}
