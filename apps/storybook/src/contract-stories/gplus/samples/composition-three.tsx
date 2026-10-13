// Composition three ("top navigation") for the composition-three sample story, on the top-band shell
// (TCRN-DS-SUB-134; MIN-20261013-SHELL D1). The top band is now the one navigation bar across the top
// (the brand button, the pinned items, the bell and the avatar), so composition three is composition
// one's shell (GplusSampleShell, the boards' set-up) with the page under the paper's header centred at
// the content width, the layout token --tcrn-layout-content-max-w (1040, TCRN-DS-SUB-130). The
// deprecated TopBar, SubNav and the stand-alone shell search it used to assemble are gone.
//
// Only package components and their public props are used; nothing here adds a class or a token. The
// shell root carries the C-5 hooks (data-shell c3-l and c3-n, data-state) and opts out of the rail
// measurement as the samples do. The light and night blocks differ only in data-tcrn-theme on the block
// and in the name of the content landmark.
import { Badge, Button, Icon, TableShell, Text, type PageHeaderProps } from "@tcrn/ui-react";
import type { CSSProperties, ReactNode } from "react";
import { GplusSampleShell, gplusSampleThemes, type GplusSampleShellSpec, type GplusSampleTheme } from "./composition-one.js";

/** The composition's content width: the layout token (1040px) that SettingsLayout and DocumentCanvas also centre on. */
export const gplusCompositionThreeContentWidth = "var(--tcrn-layout-content-max-w)";

/** data-shell prefix of the composition three shells (c3-l, c3-n). */
export const gplusCompositionThreeShellKey = "c3";

const contentStyle: CSSProperties = { width: "100%", maxWidth: gplusCompositionThreeContentWidth, marginInline: "auto" };

// The page is the Operations › Projects page of the icon sample's board, not an entry of the menu.
const spec: GplusSampleShellSpec = {
  moduleName: "Projects",
  landmarkLabel: "Composition three sample: projects",
  routeLabel: "Projects",
  selected: null,
  trail: ["Operations", "Projects"]
};

const pageHeader: PageHeaderProps = {
  title: "Projects",
  description: "12 projects · 3 archived",
  meta: (
    <div className="tcrn-doc-action-row">
      <Button variant="quiet"><Icon name="history" />History</Button>
      <Button variant="secondary"><Icon name="external-link" />Export</Button>
      <Button variant="primary"><Icon name="plus" />New project</Button>
    </div>
  )
};

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
    <div className="tcrn-product-shell-content-stack" style={contentStyle} data-gplus-composition-three-content="true">
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

/** One themed block: the top-band shell with the page centred in its paper. */
export function GplusCompositionThreeBlock({ storyId, theme }: { storyId: string; theme: GplusSampleTheme }) {
  return (
    <GplusSampleShell storyId={storyId} shellName={gplusCompositionThreeShellKey} theme={theme} spec={spec} pageHeader={pageHeader} attributes={{ "data-gplus-composition-three-shell": "true" }}>
      <ProjectsPage />
    </GplusSampleShell>
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
