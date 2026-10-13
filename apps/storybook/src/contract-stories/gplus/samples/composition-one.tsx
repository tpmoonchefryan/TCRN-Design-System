// Composition one ("one sheet") for the five first-batch sample stories: the D section of each B1
// board (typography, icon, brand, actions, inputs) rebuilt from package components.
//
// The shell is the package ProductShell; this module adds no styles and sets no shell parameter.
// Since TCRN-DS-SUB-119 the shell is the top band and the paper (one shell, no side rail), so the
// rail marks this module used to add (data-guide="rail", data-text="rail") have no subject and are
// gone with the rail; the samples are re-rendered on the top-band shell by TCRN-DS-SUB-134.
import {
  Avatar,
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
  type TcrnProductLogoId,
  type TcrnProductMarkId
} from "@tcrn/ui-react";
import { tcrnDefaultLocale, tcrnLocaleMetadata } from "@tcrn/ui-copy-state";
import type { ReactNode } from "react";
import { StaticMarkup, type MarkupEdit } from "../matrix-renderer.js";

export type GplusSampleBoard = "typography" | "icon" | "brand" | "actions" | "inputs";
export type GplusSampleTheme = "light" | "night";

export const gplusSampleThemes: readonly GplusSampleTheme[] = ["light", "night"];

const themeAttribute: Record<GplusSampleTheme, "light" | "dark"> = { light: "light", night: "dark" };
const themeSuffix: Record<GplusSampleTheme, "l" | "n"> = { light: "l", night: "n" };

/** data-shell prefix per board, as on the canvas boards (ty-l, ic-n, ...). */
export const gplusSampleShellKeys: Readonly<Record<GplusSampleBoard, string>> = {
  typography: "ty",
  icon: "ic",
  brand: "br",
  actions: "ac",
  inputs: "in"
};

interface RailItem {
  id: string;
  label: string;
  iconName: IconName;
}

interface SampleShellSpec {
  moduleName: string;
  locationLabel: string;
  routeLabel: string;
  selected: string;
  workspace: readonly RailItem[];
  brandProductId?: TcrnProductMarkId;
  headerActions?: ReactNode;
  /** Accessible name of the shell's navigation and content region: the sample's own name. */
  landmarkLabel: string;
}

const teamItems: readonly RailItem[] = [{ id: "settings", label: "Settings", iconName: "settings" }];

const railItem = {
  workbench: { id: "workbench", label: "Workbench", iconName: "home" },
  projects: { id: "projects", label: "Projects", iconName: "layout-grid" },
  members: { id: "members", label: "Members", iconName: "users" },
  library: { id: "library", label: "Library", iconName: "book-open" },
  billing: { id: "billing", label: "Billing", iconName: "database" },
  data: { id: "data", label: "Data", iconName: "database" },
  products: { id: "products", label: "Products", iconName: "package" }
} satisfies Record<string, RailItem>;

// The five samples share one page, each with a light and a night shell, so every shell names its
// navigation and content region after its sample and the night shell adds the block name. Shared
// names ("Main navigation", the route label) would give the page sets of identical landmarks.
const landmarkSuffix: Record<GplusSampleTheme, string> = { light: "", night: " (night)" };

function SampleShell({ storyId, board, theme, spec, children }: { storyId: string; board: GplusSampleBoard; theme: GplusSampleTheme; spec: SampleShellSpec; children: ReactNode }) {
  const prefix = `${storyId}-${theme}`;
  const landmarkLabel = `${spec.landmarkLabel}${landmarkSuffix[theme]}`;
  const withSelection = (items: readonly RailItem[]) => items.map((item) => ({ ...item, href: `#${storyId}`, selected: item.id === spec.selected }));
  // The night block differs from the light block only in data-tcrn-theme on its wrapper and in its
  // landmark names; the shell's own theme control reports the theme it is showing, as the canvas
  // night screen does.
  const shell = (
    <ProductShell
      productName="Design team"
      moduleName={spec.moduleName}
      brandProductId={spec.brandProductId ?? "design-system"}
      currentRouteLabel={spec.routeLabel}
      pageHeader={samplePageHeaders[board]}
      navGroups={[
        { id: "workspace", label: "Workspace", items: withSelection(spec.workspace) },
        { id: "team", label: "Team", items: withSelection(teamItems) }
      ]}
      locales={tcrnLocaleMetadata}
      currentLocale={tcrnDefaultLocale}
      currentTheme={themeAttribute[theme]}
      searchPlaceholder="Search"
      headerActions={spec.headerActions}
      contentId={`${prefix}-content`}
      contentLabel={landmarkLabel}
      data-shell={`${gplusSampleShellKeys[board]}-${themeSuffix[theme]}`}
      data-gplus-sample-shell={board}
    >
      <div className="tcrn-product-shell-content-stack">{children}</div>
    </ProductShell>
  );
  return (
    <div data-tcrn-theme={themeAttribute[theme]} data-gplus-sample-theme={theme}>
      <StaticMarkup id={prefix} block element={shell} edits={[]} />
    </div>
  );
}

const userAvatar = <Avatar name="Lin Xiao" size="small" />;

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

// Icon — project list: six rail icons, three top-bar icons, header and toolbar icons, pagination
// and row-end arrows.
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

// Brand — product page: the rail lockup at 22, product lockups in the table at 28, a footnote.
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

// Actions — project page: quiet, secondary and primary in the header, two ButtonGroups and a
// LinkButton in the toolbar, ClipboardCopyButton and IconButton in rows, danger at the bottom.
function ActionsProjectsPage({ storyId, theme }: { storyId: string; theme: GplusSampleTheme }) {
  return (
    <>
      <div className="tcrn-doc-action-row">
        <ButtonGroup ariaLabel="View">
          <IconButton ariaLabel="List" iconName="menu" size="sm" aria-pressed="true" />
          <IconButton ariaLabel="Grid" iconName="layout-grid" size="sm" aria-pressed="false" />
        </ButtonGroup>
        <ButtonGroup ariaLabel="Period">
          <Button size="sm" aria-pressed="false">Day</Button>
          <Button size="sm" aria-pressed="true">Week</Button>
          <Button size="sm" aria-pressed="false">Month</Button>
        </ButtonGroup>
        <LinkButton variant="quiet" size="sm" href={`#${storyId}`}>View all 12<Icon name="arrow-right" /></LinkButton>
      </div>
      <TableShell
        label="Projects"
        columns={projectColumns}
        rows={projectRows((id, index) => (
          <div className="tcrn-doc-action-row">
            {index === 0
              ? copiedClipboard(storyId, theme, id)
              : <ClipboardCopyButton text={id} ariaLabel="Copy ID" idleLabel="Copy ID" variant="quiet" size="sm" />}
            <IconButton ariaLabel="Open" iconName="arrow-right" variant="quiet" size="sm" />
          </div>
        )).slice(0, 3)}
      />
      <div className="tcrn-doc-form-stack" data-gplus-sample-danger-zone="true">
        <div>
          <Text tone="strong">Delete this project</Text>
          <Text size="meta">Deleted projects can be restored from the trash for 30 days, then they are removed permanently.</Text>
        </div>
        <div className="tcrn-doc-action-row">
          <Button variant="secondary">Archive</Button>
          <Button variant="danger"><Icon name="trash" />Delete project</Button>
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
// RadioGroup, Switch and Checkbox, with the top-bar SearchInput from the shell.
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
    title: "Projects",
    description: "12 projects · 3 archived",
    meta: (
      <div className="tcrn-doc-action-row">
        <Button variant="quiet"><Icon name="history" />History</Button>
        <Button variant="secondary">Export<Icon name="external-link" /></Button>
        <Button variant="primary"><Icon name="plus" />New project</Button>
      </div>
    )
  },
  inputs: { title: "Invite members", description: "Joining Design team · seats 86 / 120" }
};

const sampleSpecs: Readonly<Record<GplusSampleBoard, SampleShellSpec>> = {
  typography: {
    moduleName: "Billing",
    landmarkLabel: "Typography sample: billing",
    locationLabel: "Design team",
    routeLabel: "Billing",
    selected: "billing",
    workspace: [railItem.workbench, railItem.projects, railItem.library, railItem.billing],
    headerActions: userAvatar
  },
  icon: {
    moduleName: "Projects",
    landmarkLabel: "Icon sample: projects",
    locationLabel: "Design team",
    routeLabel: "Projects",
    selected: "projects",
    workspace: [railItem.workbench, railItem.projects, railItem.members, railItem.library, railItem.data],
    headerActions: (
      <>
        <IconButton ariaLabel="Notifications" iconName="bell" variant="quiet" />
        {userAvatar}
      </>
    )
  },
  brand: {
    moduleName: "Products",
    landmarkLabel: "Brand sample: products",
    locationLabel: "Design team",
    routeLabel: "Products",
    selected: "products",
    workspace: [railItem.workbench, railItem.projects, railItem.products, railItem.library],
    brandProductId: "design-system",
    headerActions: userAvatar
  },
  actions: {
    moduleName: "Projects",
    landmarkLabel: "Actions sample: projects",
    locationLabel: "Design team",
    routeLabel: "Projects",
    selected: "projects",
    workspace: [railItem.workbench, railItem.projects, railItem.library, railItem.data],
    headerActions: userAvatar
  },
  inputs: {
    moduleName: "Members",
    landmarkLabel: "Inputs sample: invite members",
    locationLabel: "Members",
    routeLabel: "Invite",
    selected: "members",
    workspace: [railItem.workbench, railItem.projects, railItem.members, railItem.data],
    headerActions: userAvatar
  }
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
      return <ActionsProjectsPage storyId={storyId} theme={theme} />;
    case "inputs":
      return <InviteMembersPage storyId={storyId} theme={theme} />;
  }
}

/** One themed block: the composition-one shell with the board's page inside. */
export function GplusSampleBlock({ board, storyId, theme }: { board: GplusSampleBoard; storyId: string; theme: GplusSampleTheme }) {
  return (
    <SampleShell storyId={storyId} board={board} theme={theme} spec={sampleSpecs[board]}>
      <SamplePage board={board} storyId={storyId} theme={theme} />
    </SampleShell>
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
