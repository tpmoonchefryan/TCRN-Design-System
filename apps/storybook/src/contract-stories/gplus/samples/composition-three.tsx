// Composition three ("top navigation") for the composition-three sample story: the page language of
// composition one with no rail, one navigation bar across the top and the content centred at the
// composition board's 1040px.
//
// Only package components and their public props are used; nothing here adds a class, a token or a
// [data-shell]. The bar is the package TopBar, used as it is: its brand slot holds the product lockup,
// its module slot holds the shell search (the bar's one yielding item, C8), and its actions slot holds
// the navigation, the notification button and the avatar. TopBar sizes the brand and module columns to
// their content and lets only the actions column shrink, so the navigation goes in the actions slot,
// where it can wrap on a narrow page; on the board it sits before the search. The 1040px content width
// is a value of this sample, written in its own inline style the way composition one wrote its 220px
// rail width; it places a page template and is not a package token. The light and night blocks differ
// only in data-tcrn-theme on the block and in the name of the navigation landmark.
import {
  Avatar,
  Badge,
  Button,
  Icon,
  IconButton,
  PageHeader,
  ProductLockup,
  ProductShellSearch,
  SubNav,
  TableShell,
  Text,
  TopBar,
  type NavStripItem
} from "@tcrn/ui-react";
import type { CSSProperties, ReactNode } from "react";
import { gplusSampleThemes, type GplusSampleTheme } from "./composition-one.js";

/** The composition's content width: a page-template placement value of this sample, not a token. */
export const gplusCompositionThreeContentWidth = "1040px";

const themeAttribute: Record<GplusSampleTheme, "light" | "dark"> = { light: "light", night: "dark" };

// The light and night blocks share one page, so the navigation landmark is named after the sample
// and the night block adds the block name; a shared name would give the page two identical landmarks.
const landmarkLabel = "Composition three sample: projects";
const landmarkSuffix: Record<GplusSampleTheme, string> = { light: "", night: " (night)" };

// Placement of the package parts inside the TopBar actions slot and of the page under the bar.
// The search sits in a one-column grid holding a flex row: the grid gives the module slot the search's
// width as its widest size and nothing as its narrowest, and the flex row lets the search shrink below
// its fixed narrow-screen width where TopBar stacks its slots, instead of widening the bar.
const moduleSlotStyle: CSSProperties = { display: "grid", gridTemplateColumns: "minmax(0, 1fr)" };
const moduleRowStyle: CSSProperties = { display: "flex", minWidth: 0 };
const actionsRowStyle: CSSProperties = { display: "flex", alignItems: "center", flexWrap: "wrap", gap: "var(--tcrn-space-2)", minWidth: 0 };
const actionsEndStyle: CSSProperties = { display: "flex", alignItems: "center", gap: "var(--tcrn-space-2)", marginInlineStart: "auto" };
const pageStyle: CSSProperties = { padding: "var(--tcrn-space-5) var(--tcrn-space-6)" };
const contentStyle: CSSProperties = { width: "100%", maxWidth: gplusCompositionThreeContentWidth, marginInline: "auto" };

function navItems(storyId: string): NavStripItem[] {
  const href = `#${storyId}`;
  return [
    { id: "workbench", label: "Workbench", href },
    { id: "projects", label: "Projects", href, current: true, count: 12 },
    { id: "members", label: "Members", href },
    { id: "billing", label: "Billing", href },
    { id: "settings", label: "Settings", href }
  ];
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

const projects = [
  { name: "Quarterly review", id: "PRJ-2026-0391", team: "Design team", status: <Badge tone="positive">Active</Badge> },
  { name: "October launch", id: "PRJ-2026-0377", team: "Product team", status: <Badge tone="positive">Active</Badge> },
  { name: "Autumn hiring", id: "PRJ-2026-0360", team: "People team", status: <Badge tone="warning">Awaiting confirmation</Badge> },
  { name: "Component library", id: "PRJ-2026-0412", team: "Design team", status: <Badge>Archived</Badge> }
];

function ProjectsPage() {
  return (
    <div className="tcrn-product-shell-content-stack">
      <PageHeader
        title="Projects"
        description="12 projects · 3 archived"
        meta={(
          <div className="tcrn-doc-action-row">
            <Button variant="quiet"><Icon name="history" />History</Button>
            <Button variant="secondary"><Icon name="external-link" />Export</Button>
            <Button variant="primary"><Icon name="plus" />New project</Button>
          </div>
        )}
      />
      <TableShell
        label="Projects"
        columns={[
          { key: "project", label: "Project" },
          { key: "team", label: "Team" },
          { key: "status", label: "Status" }
        ]}
        rows={projects.map((project) => ({
          project: projectCell(project.name, project.id),
          team: <Text>{project.team}</Text>,
          status: project.status
        }))}
      />
      <Text variant="caps">1–4 of 12</Text>
    </div>
  );
}

/** One themed block: the TopBar across the top and the page centred under it. */
export function GplusCompositionThreeBlock({ storyId, theme }: { storyId: string; theme: GplusSampleTheme }) {
  return (
    <div className="tcrn-doc-theme-preview" data-tcrn-theme={themeAttribute[theme]} data-gplus-sample-theme={theme}>
      <TopBar
        data-gplus-composition-three-bar="true"
        productName={<ProductLockup suffix="Design team" />}
        moduleName={(
          <div style={moduleSlotStyle}>
            <div style={moduleRowStyle}>
              <ProductShellSearch label="Search" placeholder="Search" shortcut="auto" />
            </div>
          </div>
        )}
        actions={(
          <div style={actionsRowStyle}>
            <SubNav label={`${landmarkLabel}${landmarkSuffix[theme]}`} items={navItems(storyId)} />
            <div style={actionsEndStyle}>
              <IconButton ariaLabel="Notifications" iconName="bell" variant="quiet" />
              <Avatar name="Lin Xiao" size="small" />
            </div>
          </div>
        )}
      />
      <div style={pageStyle}>
        <div style={contentStyle} data-gplus-composition-three-content="true">
          <ProjectsPage />
        </div>
      </div>
    </div>
  );
}

/** Light block, then night block; the two differ only in data-tcrn-theme and the landmark name. */
export function GplusCompositionThreeView({ storyId }: { storyId: string }) {
  return (
    <div className="alpha-story-stack" data-gplus-sample="composition-three" data-gplus-sample-layout="stacked">
      {gplusSampleThemes.map((theme) => (
        <GplusCompositionThreeBlock key={theme} storyId={storyId} theme={theme} />
      ))}
    </div>
  );
}
