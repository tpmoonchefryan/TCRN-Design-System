import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import {
  componentLibraryDeferredPrototypeNames,
  componentLibraryPublicComponentNames,
  componentLibraryPublicUtilityNames,
  Button,
  Breadcrumb,
  Checkbox,
  ConfirmActionDialog,
  Dialog,
  DetailDrawer,
  EnvironmentBanner,
  Field,
  IconButton,
  GateReadinessPanel,
  Icon,
  Input,
  NavGroup,
  NavItem,
  Popover,
  SearchInput,
  SegmentedNav,
  Select,
  SideNav,
  SkipLink,
  StateView,
  StatusBadge,
  TableShell,
  Textarea,
  TopBar,
  tcrnIconNames,
  ModuleTabs,
  WorkIndex
} from "./index.js";
import { presentCopyState } from "@tcrn/ui-copy-state";

test("component-library metadata names public components, utilities, and deferred prototypes", () => {
  const expectedPublicComponents = [
    "Button",
    "Icon",
    "IconButton",
    "LinkButton",
    "Field",
    "Input",
    "Textarea",
    "SearchInput",
    "Select",
    "Checkbox",
    "Badge",
    "StatusBadge",
    "StateView",
    "InlineAlert",
    "LiveRegion",
    "Skeleton",
    "EnvironmentBanner",
    "GateReadinessPanel",
    "EvidenceStrip",
    "ReadbackPanel",
    "Text",
    "Heading",
    "Surface",
    "Divider",
    "KeyValueList",
    "FilterBar",
    "TableShell",
    "WorkIndex",
    "DetailInspector",
    "Breadcrumb",
    "ModuleTabs",
    "SectionTabs",
    "SegmentedNav",
    "Pagination",
    "TopBar",
    "SideNav",
    "NavGroup",
    "NavItem",
    "ProductLauncher",
    "ProductSwitcher",
    "SkipLink",
    "DetailDrawer",
    "ActionDrawer",
    "Popover",
    "Dialog",
    "ConfirmActionDialog"
  ];

  assert.deepEqual([...componentLibraryPublicComponentNames].sort(), [...expectedPublicComponents].sort());
  assert.deepEqual([...componentLibraryPublicUtilityNames].sort(), ["tcrnIconNames"]);
  assert.ok(componentLibraryDeferredPrototypeNames.includes("TmsDenseShellDemo"));
  assert.ok(componentLibraryDeferredPrototypeNames.includes("KnowledgeBaseShellDemo"));
  assert.ok(componentLibraryDeferredPrototypeNames.includes("CompactToolShellDemo"));
});

test("icon primitive wraps the approved icon library through package exports", () => {
  assert.ok(tcrnIconNames.includes("search"));
  assert.ok(tcrnIconNames.includes("menu"));
  assert.ok(tcrnIconNames.includes("panel-left-close"));

  const decorative = renderToStaticMarkup(<Icon name="search" />);
  assert.match(decorative, /class="[^"]*tcrn-icon/);
  assert.match(decorative, /data-icon-name="search"/);
  assert.match(decorative, /aria-hidden="true"/);

  const named = renderToStaticMarkup(<Icon name="menu" decorative={false} title="Open navigation" />);
  assert.match(named, /role="img"/);
  assert.match(named, /aria-label="Open navigation"/);
  assert.doesNotMatch(named, /aria-hidden="true"/);
});

test("core primitives render normalized class names and accessibility attributes", () => {
  const html = renderToStaticMarkup(
    <Field label="Search">
      <Input name="search" />
    </Field>
  );
  assert.match(html, /tcrn-field/);
  assert.match(html, /tcrn-input/);
  assert.match(renderToStaticMarkup(<Button>Save</Button>), /tcrn-button--secondary/);
});

test("disabled controls and icon buttons fail closed with accessible names", () => {
  const disabled = renderToStaticMarkup(<Button disabled>Publish</Button>);
  assert.match(disabled, /data-disabled-reason="Action unavailable in this route"/);
  assert.match(disabled, /title="Action unavailable in this route"/);
  assert.match(disabled, /aria-describedby="[^"]+"/);
  assert.match(disabled, /class="tcrn-sr-only"/);
  assert.match(disabled, /Action unavailable in this route/);
  assert.doesNotMatch(disabled, /PublishRequires|PublishAction unavailable/);

  const icon = renderToStaticMarkup(<IconButton ariaLabel="   " iconName="menu" />);
  assert.match(icon, /aria-label="Unnamed icon action"/);
  assert.match(icon, /data-icon-name="menu"/);
});

test("disabled form controls expose their own reason contract", () => {
  const html = renderToStaticMarkup(
    <>
      <Input disabled disabledReason="Project input is locked" />
      <Textarea disabled disabledReason="Notes are locked" />
      <Select disabled disabledReason="Target path is locked" options={[{ value: "local", label: "Local path" }]} />
      <SearchInput disabled disabledReason="Search is unavailable" />
      <Checkbox disabled disabledReason="Toggle is unavailable" />
    </>
  );

  for (const reason of ["Project input is locked", "Notes are locked", "Target path is locked", "Search is unavailable", "Toggle is unavailable"]) {
    assert.match(html, new RegExp(`data-disabled-reason="${reason}"`));
    assert.match(html, new RegExp(`title="${reason}"`));
    assert.match(html, new RegExp(`<span id="[^"]+" class="tcrn-sr-only">${reason}<\\/span>`));
  }

  const describedByCount = (html.match(/aria-describedby="/g) ?? []).length;
  assert.equal(describedByCount, 5);
  assert.match(html, /class="[^"]*tcrn-textarea/);
});

test("field wires real aria description and error relationships into controls", () => {
  const html = renderToStaticMarkup(
    <Field label="Invalid state" hint="Use a synthetic fixture value" error="Synthetic validation message">
      <Input name="fixture" />
    </Field>
  );
  const describedBy = html.match(/aria-describedby="([^"]+)"/)?.[1];
  assert.ok(describedBy);
  const ids = describedBy.split(/\s+/);
  assert.equal(ids.length, 2);
  for (const id of ids) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /Use a synthetic fixture value/);
  assert.match(html, /Synthetic validation message/);
});

test("search input exposes visual affordance without shortcut metadata by default", () => {
  const html = renderToStaticMarkup(<SearchInput placeholder="Search components" />);
  assert.match(html, /data-search-input="true"/);
  assert.match(html, /tcrn-search-input__icon/);
  assert.match(html, /data-icon-name="search"/);
  assert.match(html, /type="search"/);
  assert.doesNotMatch(html, /data-shortcut-visible="true"/);
  assert.doesNotMatch(html, /aria-keyshortcuts=/);
  assert.doesNotMatch(html, /data-shortcut-auto="search"/);
  assert.doesNotMatch(html, />Ctrl K</);

  const shellShortcut = renderToStaticMarkup(<SearchInput placeholder="Search docs" shortcut="auto" />);
  assert.match(shellShortcut, /data-shortcut-visible="true"/);
  assert.match(shellShortcut, /aria-keyshortcuts="Control\+K Meta\+K"/);
  assert.match(shellShortcut, /data-shortcut-auto="search"/);
  assert.match(shellShortcut, />Ctrl K</);

  const customShortcut = renderToStaticMarkup(<SearchInput shortcut="⌘ K" />);
  assert.match(customShortcut, /data-shortcut-visible="true"/);
  assert.match(customShortcut, />⌘ K</);

  const noShortcut = renderToStaticMarkup(<SearchInput shortcut={false} />);
  assert.doesNotMatch(noShortcut, /data-shortcut-visible="true"/);
  assert.doesNotMatch(noShortcut, /data-shortcut-auto="search"/);
  assert.doesNotMatch(noShortcut, /aria-keyshortcuts=/);
});

test("stateful components fail closed without product acceptance claims", () => {
  const badge = renderToStaticMarkup(<StatusBadge state={{ state: "future_live" }} />);
  assert.match(badge, /data-state="unknown"/);

  const panel = renderToStaticMarkup(<GateReadinessPanel state={presentCopyState({ state: "proof_required" })} />);
  assert.match(panel, /Proof required/);
  assert.doesNotMatch(panel.toLowerCase(), /product accepted|final mvp accepted|release ready/);
});

test("state labels reject caller-provided forbidden positive claims", () => {
  const badge = renderToStaticMarkup(<StatusBadge state={{ state: "future_live", label: "Release ready" }} />);
  assert.match(badge, /data-state="unknown"/);
  assert.match(badge, />Unknown</);
  assert.doesNotMatch(badge.toLowerCase(), /release ready/);

  const childOverride = renderToStaticMarkup(
    <StatusBadge state={{ state: "local_only" }}>
      Release ready
    </StatusBadge>
  );
  assert.match(childOverride, />Local proof only</);
  assert.doesNotMatch(childOverride.toLowerCase(), /release ready/);

  const stateView = renderToStaticMarkup(<StateView state={{ state: "future_live", label: "Product accepted" }} />);
  assert.match(stateView, /Unknown/);
  assert.doesNotMatch(stateView.toLowerCase(), /product accepted/);

  const titleOverride = renderToStaticMarkup(<StateView state={{ state: "local_only" }} title="Release ready" />);
  assert.match(titleOverride, /Local proof only/);
  assert.doesNotMatch(titleOverride.toLowerCase(), /release ready/);
});

test("state components can render localized copy-state labels", () => {
  const badge = renderToStaticMarkup(<StatusBadge state={{ state: "not_claimed" }} locale="zh-CN" />);
  assert.match(badge, /未声明/);
  assert.doesNotMatch(badge, />not_claimed</);

  const stateView = renderToStaticMarkup(<StateView state={{ state: "blocked" }} locale="ja" />);
  assert.match(stateView, /ブロック中/);
  assert.doesNotMatch(stateView, />blocked</);
});

test("state components reject raw enum label leakage", () => {
  const badge = renderToStaticMarkup(<StatusBadge state={{ state: "external_proof_needed", label: "external_proof_required" }} />);
  assert.match(badge, />External proof needed</);
  assert.doesNotMatch(badge, /external_proof_required/);
});

test("composed shell and workbench patterns render synthetic rows", () => {
  const html = renderToStaticMarkup(
    <>
      <TopBar productName="TCRN" moduleName="Synthetic pilot" />
      <EnvironmentBanner label="Fixture" />
      <WorkIndex rows={[{ id: "fixture-1", title: "Synthetic contract row", state: { state: "local_only" }, owner: "role-placeholder" }]} />
    </>
  );
  assert.match(html, /Synthetic contract row/);
  assert.match(html, /Local proof only/);
  assert.match(html, /aria-label="Work index"/);
  assert.doesNotMatch(html, /TCRN-AOS|TCRN-TMS/);
});

test("table shell records arbitrary column counts for responsive layout", () => {
  const oneColumn = renderToStaticMarkup(
    <TableShell label="Single column fixture" columns={[{ key: "item", label: "Item" }]} rows={[]} emptyState="No rows" />
  );
  assert.match(oneColumn, /aria-label="Single column fixture"/);
  assert.match(oneColumn, /--tcrn-table-column-count:1/);
  assert.match(oneColumn, /tabindex="0"/);
  assert.match(oneColumn, /role="row" class="tcrn-table-shell__empty-row"/);
  assert.match(oneColumn, /role="cell" aria-colspan="1" class="tcrn-table-shell__empty"/);

  const fourColumns = renderToStaticMarkup(
    <TableShell
      label="Four column fixture"
      columns={[
        { key: "a", label: "A" },
        { key: "b", label: "B" },
        { key: "c", label: "C" },
        { key: "d", label: "D" }
      ]}
      rows={[{ a: "A1", b: "B1", c: "C1", d: "D1" }]}
    />
  );
  assert.match(fourColumns, /--tcrn-table-column-count:4/);
  assert.match(fourColumns, /data-label="D"/);
});

test("tabs use honest segmented navigation semantics", () => {
  const html = renderToStaticMarkup(<ModuleTabs items={[{ id: "overview", label: "Overview", selected: true }, { id: "proof", label: "Proof" }]} />);
  assert.match(html, /data-tab-semantics="segmented-navigation"/);
  assert.match(html, /aria-current="page"/);
  assert.match(html, /data-selected="true"/);
  assert.doesNotMatch(html, /role="tab"/);
  assert.doesNotMatch(html, /role="tablist"/);

  const segmented = renderToStaticMarkup(<SegmentedNav items={[{ id: "queue", label: "Queue", selected: true }, { id: "history", label: "History" }]} />);
  assert.match(segmented, /tcrn-segmented-nav/);
  assert.match(segmented, /data-tab-semantics="segmented-navigation"/);
  assert.doesNotMatch(segmented, /role="tab"/);
});

test("breadcrumb separates route segments without concatenating labels", () => {
  const html = renderToStaticMarkup(
    <Breadcrumb items={[{ id: "root", label: "TCRN" }, { id: "components", label: "Components", selected: true }]} />
  );
  assert.match(html, /class="tcrn-breadcrumb"/);
  assert.match(html, /data-icon-name="chevron-right"/);
  assert.match(html, /class="[^"]*tcrn-breadcrumb__separator/);
  assert.match(html, /aria-current="page">Components</);
  assert.doesNotMatch(html, /TCRNComponents/);
});

test("side navigation primitives render package-backed hierarchy and disabled reasons", () => {
  const html = renderToStaticMarkup(
    <>
      <SkipLink href="#content">Skip to content</SkipLink>
      <SideNav label="Component navigation">
        <NavGroup label="Components" selected>
          <NavItem href="#navigation" iconName="panel-left-open" selected>Navigation</NavItem>
          <NavItem href="#proof" iconName="alert-triangle" disabled disabledReason="Requires proof route">Proof</NavItem>
        </NavGroup>
      </SideNav>
    </>
  );
  assert.match(html, /class="tcrn-skip-link"/);
  assert.match(html, /class="tcrn-side-nav"/);
  assert.match(html, /data-navigation-primitive="side-nav"/);
  assert.match(html, /class="tcrn-nav-group"/);
  assert.match(html, /data-navigation-primitive="nav-group"/);
  assert.match(html, /class="tcrn-nav-item"/);
  assert.match(html, /aria-current="page"/);
  assert.match(html, /data-icon-name="panel-left-open"/);
  assert.match(html, /aria-disabled="true"/);
  assert.match(html, /data-disabled-reason="Requires proof route"/);
  assert.match(html, /title="Requires proof route"/);
  assert.match(html, /tabindex="-1"/);
  assert.doesNotMatch(html, /href="#proof"/);
  assert.match(html, /class="tcrn-nav-item__disabled-reason"/);
  assert.match(html, />Requires proof route</);
  const describedBy = html.match(/aria-describedby="([^"]+)"/)?.[1];
  assert.ok(describedBy);
  const reasonElement = html.match(/<span id="([^"]+)" class="tcrn-nav-item__disabled-reason">Requires proof route<\/span>/);
  assert.ok(reasonElement);
  assert.equal(describedBy, reasonElement[1]);
  assert.doesNotMatch(html, /tcrn-sr-only[^>]*>Requires proof route/);
  assert.doesNotMatch(html, /role="tab"/);
});

test("overlay primitives separate structural drawers from scoped dialog capabilities", () => {
  const html = renderToStaticMarkup(
    <>
      <DetailDrawer title="Synthetic drawer" open>
        Drawer body
      </DetailDrawer>
      <Popover title="Synthetic popover" open>
        Popover body
      </Popover>
      <Dialog title="Synthetic modal" open>
        Modal body
      </Dialog>
      <ConfirmActionDialog
        title="Blocked action"
        message="No publication route exists."
        confirmLabel="Publish"
        cancelLabel="Close"
        disabled
      />
    </>
  );
  assert.match(html, /role="complementary"/);
  assert.match(html, /data-modal-scope="structural-drawer"/);
  assert.match(html, /data-overlay-scope="popover"/);
  assert.match(html, /aria-modal="false"/);
  assert.match(html, /role="dialog"/);
  assert.doesNotMatch(html, /data-focus-trap="implemented"/);
  assert.match(html, /data-focus-entry="implemented"/);
  assert.match(html, /data-tab-containment="not-implemented"/);
  assert.match(html, /data-escape-close="requires-on-open-change"/);
  assert.match(html, /data-focus-return="requires-trigger-ref"/);
});

test("popover capability metadata is gated on provided close and return support", () => {
  const interactive = renderToStaticMarkup(
    <Popover
      title="Interactive popover"
      open
      triggerRef={{ current: null }}
      onOpenChange={() => undefined}
    >
      Popover body
    </Popover>
  );
  assert.match(interactive, /data-overlay-scope="popover"/);
  assert.match(interactive, /data-placement="bottom-start"/);
  assert.match(interactive, /aria-modal="false"/);
  assert.match(interactive, /data-focus-entry="implemented"/);
  assert.match(interactive, /data-tab-containment="not-implemented"/);
  assert.match(interactive, /data-escape-close="implemented"/);
  assert.match(interactive, /data-focus-return="implemented"/);
  assert.doesNotMatch(interactive, /data-focus-trap="implemented"/);

  const staticPopover = renderToStaticMarkup(
    <Popover title="Static popover" open>
      Popover body
    </Popover>
  );
  assert.match(staticPopover, /data-escape-close="requires-on-open-change"/);
  assert.match(staticPopover, /data-focus-return="requires-trigger-ref"/);
});

test("dialog capability metadata is gated on provided close and return support", () => {
  const interactive = renderToStaticMarkup(
    <Dialog
      title="Interactive modal"
      open
      triggerRef={{ current: null }}
      onOpenChange={() => undefined}
    >
      Modal body
    </Dialog>
  );
  assert.match(interactive, /data-focus-entry="implemented"/);
  assert.match(interactive, /data-tab-containment="not-implemented"/);
  assert.match(interactive, /data-escape-close="implemented"/);
  assert.match(interactive, /data-focus-return="implemented"/);
  assert.doesNotMatch(interactive, /data-focus-trap="implemented"/);

  const staticDialog = renderToStaticMarkup(
    <ConfirmActionDialog
      title="Blocked action"
      message="No publication route exists."
      confirmLabel="Publish"
      cancelLabel="Close"
      disabled
    />
  );
  assert.match(staticDialog, /data-escape-close="requires-on-open-change"/);
  assert.match(staticDialog, /data-focus-return="requires-trigger-ref"/);
  assert.doesNotMatch(staticDialog, /data-focus-trap="implemented"/);
});
