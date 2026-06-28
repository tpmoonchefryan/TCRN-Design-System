import {
  EvidenceStrip,
  Heading,
  Icon,
  IconButton,
  ModuleTabs,
  SearchInput,
  ShellBrandLockup,
  StatusBadge,
  TcrnBrandMark,
  Text
} from "@tcrn/ui-react";
import {
  knowledgeNavigationGroups,
  tmsHubActions,
  tmsHubSecondaryRouteCount,
  tmsNavigationGroups,
  tmsPrimaryNavCount,
  tmsQuickLinks,
  tmsSecondaryDirectoryGroupCount,
  tmsTaskLanes
} from "../content/index.js";

// storybook_only: dense shell IA is retained as synthetic docs/proof content, not package component source.
export function TmsDenseShellDemo() {
  const selectedArea = tmsNavigationGroups.flatMap((group) => group.items).find((item) => item.selected) ?? tmsNavigationGroups[0].items[0];
  return (
    <div className="tcrn-shell-density-stack" data-tms-menu-density-standard="adaptive">
      <div
        className="tcrn-shell-demo tcrn-shell-demo--dense tcrn-shell-demo--hub"
        data-shell-pattern="dense-product-nav"
        data-shell-width="edge-to-edge"
        data-menu-density="hub"
        data-storybook-only="dense-shell-prototype"
        data-component-library-status="deferred"
      >
        <div className="tcrn-shell-demo__topbar tcrn-shell-demo__topbar--dense" data-shell-topbar="edge-to-edge">
          <IconButton
            ariaLabel="Open compact operations hub"
            aria-expanded="true"
            aria-controls="tms-shell-hub-menu"
            className="tcrn-shell-demo__menu-button"
            data-icon-only-menu="true"
            iconName="menu"
            type="button"
          />
          <ShellBrandLockup suffix="TMS" caption="Operations workspace" suffixClassName="tcrn-brand-wordmark__suffix--tms" />
          <SearchInput className="tcrn-search-input--compact" placeholder="Search menu" shortcut="auto" />
          <StatusBadge state={{ state: "local_only" }} />
        </div>
        <div className="tcrn-shell-layer" data-shell-layer="mega-menu" data-menu-layer="low-secondary">
          <div
            id="tms-shell-hub-menu"
            className="tcrn-shell-hub-menu"
            data-menu-expanded="true"
            data-menu-layout="hub"
            data-menu-density="hub"
            data-density-trigger="3-to-8-secondary-routes"
            data-secondary-route-count={tmsHubSecondaryRouteCount}
            role="region"
            aria-label="Compact TMS navigation hub"
          >
            <section className="tcrn-shell-hub-summary" aria-label="Selected low-density operations area">
              <span>Low secondary density</span>
              <strong>{selectedArea.label}</strong>
              <p>When the selected area has only a handful of secondary routes, use a visual hub before falling back to command-center density.</p>
            </section>
            <div className="tcrn-shell-hub-actions" data-directory-layout="hub-tiles">
              {tmsHubActions.map((action, actionIndex) => (
                <a key={action.label} href="#navigation-shell-spec" className="tcrn-shell-hub-action" data-selected={actionIndex === 0 ? "true" : undefined}>
                  <Icon name={action.iconName} />
                  <span>
                    <strong>{action.label}</strong>
                    <small>{action.description}</small>
                  </span>
                  <em>{action.meta}</em>
                </a>
              ))}
            </div>
            <aside className="tcrn-shell-hub-sidecar" aria-label="Density escalation rules">
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
        className="tcrn-shell-demo tcrn-shell-demo--dense"
        data-shell-pattern="dense-product-nav"
        data-shell-width="edge-to-edge"
        data-menu-density="command-center"
        data-storybook-only="dense-shell-prototype"
        data-component-library-status="deferred"
      >
        <div className="tcrn-shell-demo__topbar tcrn-shell-demo__topbar--dense" data-shell-topbar="edge-to-edge">
          <IconButton
            ariaLabel="Open dense navigation menu"
            aria-expanded="true"
            aria-controls="tms-shell-expanded-menu"
            className="tcrn-shell-demo__menu-button"
            data-icon-only-menu="true"
            iconName="menu"
            type="button"
          />
          <ShellBrandLockup suffix="TMS" caption="Operations workspace" suffixClassName="tcrn-brand-wordmark__suffix--tms" />
          <SearchInput className="tcrn-search-input--compact" placeholder="Search menu" shortcut="auto" />
          <StatusBadge state={{ state: "local_only" }} />
        </div>
        <div className="tcrn-shell-layer" data-shell-layer="mega-menu" data-menu-layer="10-plus-primary">
          <div
            id="tms-shell-expanded-menu"
            className="tcrn-shell-mega-menu"
            data-menu-expanded="true"
            data-menu-layout="command-center"
            data-menu-density="command-center"
            data-primary-nav-capacity="10-plus"
            data-primary-nav-count={tmsPrimaryNavCount}
            data-secondary-directory-groups={tmsSecondaryDirectoryGroupCount}
            role="region"
            aria-label="Expanded TMS navigation menu"
          >
            <nav className="tcrn-shell-domain-nav" aria-label="Primary navigation" data-primary-nav-count={tmsPrimaryNavCount}>
              {tmsNavigationGroups.map((domain) => (
                <section key={domain.title} className="tcrn-shell-domain-group" aria-label={domain.title}>
                  <strong>{domain.title}</strong>
                  <div className="tcrn-shell-domain-list">
                    {domain.items.map((item) => (
                      <button key={item.id} className="tcrn-shell-domain-item" type="button" data-selected={item.selected ? "true" : undefined}>
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
            <section className="tcrn-shell-command-board" aria-label="Selected operations area">
              <div className="tcrn-shell-command-board__header">
                <span>Selected operations area</span>
                <strong>{selectedArea.label}</strong>
                <p>This command-center layer groups 10+ primary routes by business domain, then exposes task lanes and quick entries without turning the menu into a flat directory.</p>
              </div>
              <div className="tcrn-shell-task-lanes" data-directory-layout="task-lanes">
                {tmsTaskLanes.map((lane, laneIndex) => (
                  <section key={lane.title} className="tcrn-shell-task-lane" aria-label={lane.title}>
                    <div className="tcrn-shell-task-lane__title">
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
            <aside className="tcrn-shell-quick-rail" aria-label="Quick entries">
              <strong>Quick entries</strong>
              <p>Pinned, recent, and governance routes stay separate from the main IA.</p>
              <div className="tcrn-shell-quick-list">
                {tmsQuickLinks.map((item) => (
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

  return (
    <div className="tcrn-shell-demo tcrn-shell-demo--knowledge" data-shell-pattern="knowledge-bookmarks" data-storybook-only="knowledge-shell-prototype" data-component-library-status="deferred">
      <div className="tcrn-knowledge-shell-layout" data-standard-shell="online-docs">
        <header className="tcrn-knowledge-shell__topbar" aria-label="Knowledge base top bar">
          <div className="tcrn-knowledge-shell__brand-cell">
            <a className="tcrn-doc-brand tcrn-knowledge-shell__brand" href="#navigation-shell-spec">
              <ShellBrandLockup suffix="Design System" caption="Private local scaffold proof" suffixClassName="tcrn-brand-wordmark__suffix--design-system" />
            </a>
            <button className="tcrn-knowledge-shell__collapse-button" type="button" aria-expanded="true" aria-label="Collapse navigation">
              <Icon name="chevron-left" />
            </button>
          </div>
          <div className="tcrn-knowledge-shell__topbar-copy">
            <strong>Online documentation shell</strong>
            <span>Top bar, attached side navigation, content column, and chapter navigation stay one shell.</span>
          </div>
          <div className="tcrn-knowledge-shell__actions">
            <SearchInput className="tcrn-search-input--compact" placeholder="Search docs" shortcut="auto" />
            <StatusBadge state={{ state: "local_only" }} />
          </div>
        </header>
        <aside className="tcrn-knowledge-shell__sidebar tcrn-bookmark-panel tcrn-bookmark-panel--global" aria-label="Knowledge base bookmarks">
          <div className="tcrn-knowledge-shell__sidebar-intro">
            <strong>Current page bookmarks</strong>
            <Text>Documentation uses persistent bookmarks because the reading path is deeper than the active page.</Text>
          </div>
          <nav className="tcrn-bookmark-nav tcrn-bookmark-nav--tracked" aria-label="Multi-level bookmarks">
            {knowledgeNavigationGroups.map((group) => (
              <div key={group.label} className="tcrn-bookmark-nav__group" data-selected={group.selected ? "true" : undefined}>
                <a href="#navigation-shell-spec" data-selected={group.selected ? "true" : undefined}>
                  {group.label}
                </a>
                <div className="tcrn-bookmark-nav__children">
                  {group.items.map((item) => (
                    <a key={item} href="#navigation-shell-spec" data-selected={group.selected && item === group.selectedItem ? "true" : undefined}>
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>
        <div className="tcrn-knowledge-shell__content" aria-label="Knowledge base content preview">
          <div className="tcrn-knowledge-preview">
            <span className="tcrn-eyebrow">Private local scaffold proof</span>
            <Heading level={3}>Navigation and shell spec</Heading>
            <Text>The knowledge-base shell standard mirrors the active TCRN documentation shell: one top bar, attached side navigation, one content column, and bottom chapter navigation.</Text>
            <div className="tcrn-knowledge-preview__panel">
              <Heading level={4}>{selectedGroup.label}</Heading>
              <Text>Selected section and subsection remain visible while readers move through nested documentation.</Text>
              <EvidenceStrip items={["scroll-aware", "multi-level", "documentation-first"]} />
            </div>
          </div>
          <nav className="tcrn-knowledge-shell__pager" aria-label="Knowledge base shell chapter navigation">
            <a href="#navigation-shell-spec">
              <Icon name="arrow-left" className="tcrn-knowledge-shell__pager-icon" />
              <span>Previous chapter</span>
              <strong>Field spec and usage</strong>
            </a>
            <a href="#navigation-shell-spec">
              <Icon name="arrow-right" className="tcrn-knowledge-shell__pager-icon" />
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
    <div className="tcrn-shell-demo tcrn-shell-demo--compact" data-shell-pattern="compact-tool-nav" data-storybook-only="compact-shell-prototype" data-component-library-status="deferred">
      <div className="tcrn-compact-shell" data-shell-layer="compact-tool">
        <header className="tcrn-top-bar tcrn-compact-shell__top-bar" aria-label="Compact tool shell top bar">
          <div className="tcrn-top-bar__brand tcrn-compact-shell__brand" aria-label="TCRN">
            <TcrnBrandMark />
          </div>
          <div className="tcrn-top-bar__module">Focused tool</div>
          <div className="tcrn-top-bar__actions"><StatusBadge state={{ state: "local_only" }} /></div>
        </header>
        <div className="tcrn-compact-shell__body">
          <section className="tcrn-compact-shell__summary" aria-label="Compact tool shell boundary">
            <span>Stable peer views</span>
            <strong>Review queue</strong>
            <Text>Use compact segmented navigation only when the route has a small, stable set of peer views.</Text>
          </section>
          <section className="tcrn-compact-shell__switcher" aria-label="Local tool views">
            <ModuleTabs
              items={[
                { id: "queue", label: "Queue", selected: true },
                { id: "review", label: "Review" },
                { id: "history", label: "History" }
              ]}
            />
            <div className="tcrn-compact-shell__panel" aria-label="Selected tool view preview">
              <div className="tcrn-compact-shell__metric">
                <Icon name="check" />
                <span>
                  <strong>Queue</strong>
                  <small>Ready to review</small>
                </span>
              </div>
              <div className="tcrn-compact-shell__metric">
                <Icon name="alert-triangle" />
                <span>
                  <strong>Needs proof</strong>
                  <small>Owner route pending</small>
                </span>
              </div>
              <div className="tcrn-compact-shell__metric">
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

export function StorybookEntryShellStrip() {
  return (
    <div className="tcrn-entry-shell-strip" data-shell-pattern="storybook-entry" data-storybook-only="entry-shell-visual">
      <div className="tcrn-entry-shell-strip__brand">
        <TcrnBrandMark />
        <span>
          <strong>Design System</strong>
          <small>Private local scaffold proof</small>
        </span>
      </div>
      <div className="tcrn-entry-shell-strip__module">
        <Icon name="book-open" />
        <span>Contract map</span>
      </div>
      <StatusBadge state={{ state: "local_only" }} />
    </div>
  );
}
