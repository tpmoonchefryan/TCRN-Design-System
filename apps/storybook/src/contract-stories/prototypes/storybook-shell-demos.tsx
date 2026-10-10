import {
  Badge,
  Heading,
  Icon,
  IconButton,
  ModuleTabs,
  NavGroup,
  NavItem,
  SearchInput,
  ShellBrandLockup,
  ShellLocaleMenu,
  ShellThemeToggle,
  SideNavCollapseButton,
  SideNav,
  StatusBadge,
  TcrnBrandMark,
  Text,
  TopBar
} from "@tcrn/ui-react";
import { tcrnDefaultLocale, tcrnLocaleMetadata } from "@tcrn/ui-copy-state";
import {
  knowledgeNavigationGroups,
  denseShellHubActions,
  denseShellHubSecondaryRouteCount,
  denseShellNavigationGroups,
  denseShellPrimaryNavCount,
  denseShellQuickLinks,
  denseShellSecondaryDirectoryGroupCount,
  denseShellTaskLanes
} from "../content/index.js";
import { localeText } from "../../build/i18n.js";

function ReferenceList({ items }: { items: string[] }) {
  return <div className="tcrn-doc-reference-strip">{items.map((item) => <Badge key={item}>{item}</Badge>)}</div>;
}

// storybook_only: dense shell IA is retained as synthetic docs/proof content, not package component source.
export function DenseOperationsShellDemo() {
  const selectedArea = denseShellNavigationGroups.flatMap((group) => group.items).find((item) => item.selected) ?? denseShellNavigationGroups[0].items[0];
  return (
    <div data-dense-menu-density-standard="adaptive">
      <div
        className="tcrn-doc-shell-demo tcrn-doc-shell-demo--dense"
        data-shell-pattern="dense-product-nav"
        data-shell-width="edge-to-edge"
        data-menu-density="hub"
        data-storybook-only="dense-shell-prototype"
        data-component-library-status="deferred"
      >
        <TopBar
          data-shell-topbar="edge-to-edge"
          productName={(
            <>
              <IconButton
                ariaLabel="Open compact operations hub"
                aria-expanded="true"
                aria-controls="dense-shell-hub-menu"
                data-icon-only-menu="true"
                iconName="menu"
                type="button"
              />
              <ShellBrandLockup suffix="Ops" caption="Operations workspace" />
            </>
          )}
          moduleName={<SearchInput placeholder="Search menu" shortcut="auto" />}
          actions={<StatusBadge state={{ state: "local_only" }} />}
        />
        <div data-shell-layer="mega-menu" data-menu-layer="low-secondary">
          <div
            id="dense-shell-hub-menu"
            data-menu-expanded="true"
            data-menu-layout="hub"
            data-menu-density="hub"
            data-density-trigger="3-to-8-secondary-routes"
            data-secondary-route-count={denseShellHubSecondaryRouteCount}
            role="region"
            aria-label="Compact navigation hub"
          >
            <section aria-label="Selected low-density operations area">
              <span>Low secondary density</span>
              <strong>{selectedArea.label}</strong>
              <p>When the selected area has only a handful of secondary routes, use a visual hub before falling back to command-center density.</p>
            </section>
            <div data-directory-layout="hub-tiles">
              {denseShellHubActions.map((action, actionIndex) => (
                <a key={action.label} href="#navigation-shell-spec" data-selected={actionIndex === 0 ? "true" : undefined}>
                  <Icon name={action.iconName} />
                  <span>
                    <strong>{action.label}</strong>
                    <small>{action.description}</small>
                  </span>
                  <em>{action.meta}</em>
                </a>
              ))}
            </div>
            <aside aria-label="Density escalation rules">
              <strong>Switch density when</strong>
              <ul>
                <li>Primary navigation reaches 10+ routes.</li>
                <li>Secondary routes need task-lane grouping.</li>
                <li>Zoom or available space causes overflow.</li>
              </ul>
            </aside>
          </div>
        </div>
      </div>

      <div
        className="tcrn-doc-shell-demo tcrn-doc-shell-demo--dense"
        data-shell-pattern="dense-product-nav"
        data-shell-width="edge-to-edge"
        data-menu-density="command-center"
        data-storybook-only="dense-shell-prototype"
        data-component-library-status="deferred"
      >
        <TopBar
          data-shell-topbar="edge-to-edge"
          productName={(
            <>
              <IconButton
                ariaLabel="Open dense navigation menu"
                aria-expanded="true"
                aria-controls="tms-shell-expanded-menu"
                data-icon-only-menu="true"
                iconName="menu"
                type="button"
              />
              <ShellBrandLockup suffix="Ops" caption="Operations workspace" />
            </>
          )}
          moduleName={<SearchInput placeholder="Search menu" shortcut="auto" />}
          actions={<StatusBadge state={{ state: "local_only" }} />}
        />
        <div data-shell-layer="mega-menu" data-menu-layer="10-plus-primary">
          <div
            id="tms-shell-expanded-menu"
            data-menu-expanded="true"
            data-menu-layout="command-center"
            data-menu-density="command-center"
            data-primary-nav-capacity="10-plus"
            data-primary-nav-count={denseShellPrimaryNavCount}
            data-secondary-directory-groups={denseShellSecondaryDirectoryGroupCount}
            role="region"
            aria-label="Expanded navigation menu"
          >
            <nav aria-label="Primary navigation" data-primary-nav-count={denseShellPrimaryNavCount}>
              {denseShellNavigationGroups.map((domain) => (
                <section key={domain.title} aria-label={domain.title}>
                  <strong>{domain.title}</strong>
                  <div>
                    {domain.items.map((item) => (
                      <button key={item.id} type="button" data-selected={item.selected ? "true" : undefined}>
                        <Icon name={item.iconName} />
                        <span>
                          <strong>{item.label}</strong>
                          <small>{item.description}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </nav>
            <section aria-label="Selected operations area">
              <div>
                <span>Selected operations area</span>
                <strong>{selectedArea.label}</strong>
                <p>This command-center layer groups 10+ primary routes by business domain, then exposes task lanes and quick entries without turning the menu into a flat directory.</p>
              </div>
              <div data-directory-layout="task-lanes">
                {denseShellTaskLanes.map((lane, laneIndex) => (
                  <section key={lane.title} aria-label={lane.title}>
                    <div>
                      <Icon name={lane.iconName} />
                      <strong>{lane.title}</strong>
                    </div>
                    {lane.items.map((item, itemIndex) => (
                      <a key={item} href="#navigation-shell-spec" data-selected={laneIndex === 0 && itemIndex === 0 ? "true" : undefined}>
                        {item}
                      </a>
                    ))}
                  </section>
                ))}
              </div>
            </section>
            <aside aria-label="Quick entries">
              <strong>Quick entries</strong>
              <p>Pinned, recent, and governance routes stay separate from the main IA.</p>
              <div>
                {denseShellQuickLinks.map((item) => (
                  <a key={item.label} href="#navigation-shell-spec">
                    <span>{item.label}</span>
                    <small>{item.meta}</small>
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

// storybook_only: documentation shell IA is retained as synthetic docs/proof content, not package component source.
export function KnowledgeBaseShellDemo() {
  const selectedGroup = knowledgeNavigationGroups.find((group) => group.selected) ?? knowledgeNavigationGroups[0];
  const collapseLabel = localeText("shell.collapseNavigationLabel");
  const expandLabel = localeText("shell.expandNavigationLabel");

  return (
    <div className="tcrn-doc-shell-demo tcrn-doc-shell-demo--knowledge" data-shell-pattern="knowledge-bookmarks" data-storybook-only="knowledge-shell-prototype" data-component-library-status="deferred">
      <div className="tcrn-doc-knowledge-shell-layout" data-standard-shell="online-docs">
        <TopBar
          aria-label="Knowledge base top bar"
          data-registered-shell-primitive="@tcrn/ui-react/TopBar"
          productName={(
            <div className="tcrn-doc-knowledge-shell__brand-cell">
              <a className="tcrn-doc-brand tcrn-doc-knowledge-shell__brand" href="#navigation-shell-spec">
                <ShellBrandLockup productId="design-system" brandMarkAlt={localeText("shell.brand")} />
              </a>
              <SideNavCollapseButton
                collapsed={false}
                controls="knowledge-shell-sidebar"
                expandedLabel={collapseLabel}
                collapsedLabel={expandLabel}
                data-doc-sidebar-toggle
                data-expanded-label={collapseLabel}
                data-collapsed-label={expandLabel}
                data-i18n-title="shell.collapseNavigationLabel"
                data-i18n-aria-label="shell.collapseNavigationLabel"
              />
            </div>
          )}
          moduleName={(
            <div className="tcrn-doc-knowledge-shell__topbar-copy">
              <strong>Online documentation shell</strong>
              <span>Top bar, attached side navigation, content column, and chapter navigation stay one shell.</span>
            </div>
          )}
          actions={(
            <div className="tcrn-doc-knowledge-shell__actions">
              <SearchInput
                placeholder={localeText("shell.searchLabel")}
                aria-label={localeText("shell.searchLabel")}
                data-i18n-placeholder="shell.searchLabel"
                data-i18n-aria-label="shell.searchLabel"
                shortcut="auto"
              />
              <ShellThemeToggle
                currentTheme="light"
                lightLabel={localeText("shell.themeLightLabel")}
                darkLabel={localeText("shell.themeDarkLabel")}
                data-i18n-aria-label="shell.themeDarkLabel"
                data-i18n-title="shell.themeDarkLabel"
              />
              <ShellLocaleMenu
                locales={tcrnLocaleMetadata}
                currentLocale={tcrnDefaultLocale}
                label={localeText("shell.languageLabel")}
                menuId="knowledge-shell-locale-menu"
                triggerId="knowledge-shell-locale-trigger"
                data-locale-menu-root
                data-i18n-aria-label="shell.languageLabel"
              />
            </div>
          )}
        />
        <SideNav id="knowledge-shell-sidebar" label="Knowledge base bookmarks">
          <div className="tcrn-doc-knowledge-shell__sidebar-intro">
            <strong>Current page bookmarks</strong>
            <Text>Documentation uses persistent bookmarks because the reading path is deeper than the active page.</Text>
          </div>
          <div className="tcrn-doc-knowledge-shell__groups">
            {knowledgeNavigationGroups.map((group) => (
              <NavGroup key={group.label} label={group.label} selected={group.selected}>
                {group.items.map((item) => (
                  <NavItem key={item} href="#navigation-shell-spec" selected={group.selected && item === group.selectedItem}>
                    {item}
                  </NavItem>
                ))}
              </NavGroup>
            ))}
          </div>
        </SideNav>
        <div className="tcrn-doc-knowledge-shell__content" aria-label="Knowledge base content preview">
          <div className="tcrn-doc-knowledge-preview">
            <Text>Component library</Text>
            <Heading level={3}>Navigation and shell spec</Heading>
            <Text>The knowledge-base shell standard mirrors the active TCRN documentation shell: one top bar, attached side navigation, one content column, and bottom chapter navigation.</Text>
            <div className="tcrn-doc-knowledge-preview__panel">
              <Heading level={4}>{selectedGroup.label}</Heading>
              <Text>Selected section and subsection remain visible while readers move through nested documentation.</Text>
              <ReferenceList items={["scroll-aware", "multi-level", "documentation-first"]} />
            </div>
          </div>
          <nav className="tcrn-doc-knowledge-shell__pager" aria-label="Knowledge base shell chapter navigation">
            <a href="#navigation-shell-spec">
              <Icon name="arrow-left" />
              <span>Previous chapter</span>
              <strong>Field spec and usage</strong>
            </a>
            <a href="#navigation-shell-spec">
              <Icon name="arrow-right" />
              <span>Next chapter</span>
              <strong>Dialog spec and usage</strong>
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}

// storybook_only: compact shell IA is retained as synthetic docs/proof content, not package component source.
export function CompactToolShellDemo() {
  return (
    <div className="tcrn-doc-shell-demo tcrn-doc-shell-demo--compact" data-shell-pattern="compact-tool-nav" data-storybook-only="compact-shell-prototype" data-component-library-status="deferred">
      <div data-shell-layer="compact-tool">
        <TopBar
          aria-label="Compact tool shell top bar"
          productName={<TcrnBrandMark />}
          brandProps={{ "aria-label": "TCRN" }}
          moduleName="Focused tool"
          actions={<StatusBadge state={{ state: "local_only" }} />}
        />
        <div>
          <section aria-label="Compact tool shell boundary">
            <span>Stable peer views</span>
            <strong>Review queue</strong>
            <Text>Use compact segmented navigation only when the route has a small, stable set of peer views.</Text>
          </section>
          <section aria-label="Local tool views">
            <ModuleTabs
              items={[
                { id: "queue", label: "Queue", selected: true },
                { id: "review", label: "Review" },
                { id: "history", label: "History" }
              ]}
            />
            <div aria-label="Selected tool view preview">
              <div>
                <Icon name="check" />
                <span>
                  <strong>Queue</strong>
                  <small>Ready to review</small>
                </span>
              </div>
              <div>
                <Icon name="alert-triangle" />
                <span>
                  <strong>Needs proof</strong>
                  <small>Owner route pending</small>
                </span>
              </div>
              <div>
                <Icon name="book-open" />
                <span>
                  <strong>History</strong>
                  <small>Local changes only</small>
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
