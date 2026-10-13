import {
  Badge,
  Heading,
  Icon,
  NavGroup,
  NavItem,
  SearchInput,
  ShellBrandLockup,
  ShellLocaleMenu,
  ShellThemeToggle,
  SideNavCollapseButton,
  SideNav,
  Text,
  TopBar
} from "@tcrn/ui-react";
import { tcrnDefaultLocale, tcrnLocaleMetadata } from "@tcrn/ui-copy-state";
import { knowledgeNavigationGroups } from "../content/index.js";
import { localeText } from "../../build/i18n.js";

function ReferenceList({ items }: { items: string[] }) {
  return <div className="tcrn-doc-reference-strip">{items.map((item) => <Badge key={item}>{item}</Badge>)}</div>;
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
