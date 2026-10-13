import {
  Badge,
  Heading,
  Icon,
  ProductShell,
  Text,
  TocRail,
  type ProductShellNavGroup
} from "@tcrn/ui-react";
import { tcrnDefaultLocale, tcrnLocaleMetadata } from "@tcrn/ui-copy-state";
import { knowledgeNavigationGroups } from "../content/index.js";

function ReferenceList({ items }: { items: string[] }) {
  return <div className="tcrn-doc-reference-strip">{items.map((item) => <Badge key={item}>{item}</Badge>)}</div>;
}

// storybook_only: documentation shell IA is retained as synthetic docs/proof content, not package component source.
//
// The knowledge-base shell is the top-band shell (TCRN-DS-SUB-125, STORY-143 GWT3): the navigation
// is ProductShell's menu model, opened from the brand button, and the bookmarks are the page's own
// table of contents, a TocRail in the paper. There is no resident side rail, no collapse toggle and
// no separate top bar.
export function KnowledgeBaseShellDemo() {
  const selectedGroup = knowledgeNavigationGroups.find((group) => group.selected) ?? knowledgeNavigationGroups[0];
  const navGroups: ProductShellNavGroup[] = knowledgeNavigationGroups.map((group) => ({
    id: group.label,
    label: group.label,
    selected: group.selected,
    items: group.items.map((item) => ({
      id: `${group.label}-${item}`,
      label: item,
      href: "#navigation-shell-spec",
      selected: group.selected && item === group.selectedItem
    }))
  }));

  return (
    <div className="tcrn-doc-demo-frame tcrn-doc-demo-frame--knowledge" data-shell-pattern="knowledge-bookmarks" data-storybook-only="knowledge-shell-prototype" data-component-library-status="deferred">
      <ProductShell
        productName="TCRN Design System"
        moduleName="Components"
        brandProductId="design-system"
        currentRouteLabel={selectedGroup.selectedItem ?? selectedGroup.label}
        navGroups={navGroups}
        locales={tcrnLocaleMetadata}
        currentLocale={tcrnDefaultLocale}
        pageHeader={{ title: "Navigation and shell spec" }}
        contentId="knowledge-shell-content"
      >
        <TocRail
          label="Current page bookmarks"
          items={selectedGroup.items.map((item) => ({ id: item, label: item, href: "#navigation-shell-spec", current: item === selectedGroup.selectedItem }))}
        />
        <div className="tcrn-doc-knowledge-preview">
          <Text>Component library</Text>
          <Heading level={3}>Navigation and shell spec</Heading>
          <Text>The knowledge-base shell is the top-band shell: the navigation opens from the brand button, and the bookmarks are the page's own table of contents in the paper.</Text>
          <div className="tcrn-doc-knowledge-preview__panel">
            <Heading level={4}>{selectedGroup.label}</Heading>
            <Text>Selected section and subsection remain visible while readers move through nested documentation.</Text>
            <ReferenceList items={["scroll-aware", "multi-level", "documentation-first"]} />
          </div>
        </div>
        <nav className="tcrn-doc-demo-pager" aria-label="Knowledge base shell chapter navigation">
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
      </ProductShell>
    </div>
  );
}
