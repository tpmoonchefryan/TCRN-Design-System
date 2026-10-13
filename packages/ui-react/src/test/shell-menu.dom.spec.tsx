// ShellMenu behaviour (TCRN-DS-SUB-117; STORY-138 GWT4): ⌘K / Ctrl+K opens the menu with focus in
// the search, Esc closes it and returns focus to the brand button, a press outside closes it, a
// choice closes it, a pin does not; ↑↓ walk a column, → opens and enters a row's next level, ←
// returns; the search keeps only the related entries; the ⌘K key is registered once and removed
// on unmount.
// The Sheet (TCRN-DS-SUB-126; 144-GWT2, GWT3): 760 wide and narrower the brand button opens the Sheet,
// which takes focus itself; the scrim, Esc and a choice close it; a group opens its items after the
// lists; the presentation follows the viewport while the menu is open.
import test from "node:test";
import assert from "node:assert/strict";
import { act, useRef, useState } from "react";
import { ProductShell, ShellBrandButton, ShellMenu, type ShellMenuGroup, type ShellMenuOpenChangeReason } from "../index.js";
import { createDomInteractionHarness, type DomInteractionHarness } from "./dom-harness.js";

const menu: readonly ShellMenuGroup[] = [
  {
    id: "talent",
    label: "艺人",
    items: [
      { id: "roster", label: "名册", href: "#roster", iconName: "users" },
      { id: "groups", label: "分组", href: "#groups", iconName: "layers" },
      {
        id: "contracts",
        label: "合约",
        iconName: "book-open",
        children: [
          { id: "contract-list", label: "合约列表", href: "#contract-list" },
          {
            id: "templates",
            label: "模板",
            children: [
              { id: "signing", label: "签约合同", href: "#signing" },
              { id: "agency", label: "经纪合同", href: "#agency" }
            ]
          },
          { id: "approval", label: "审批", href: "#approval" }
        ]
      },
      { id: "billing", label: "结算单", href: "#billing", iconName: "database" }
    ]
  },
  {
    id: "operations",
    label: "运营",
    items: [
      { id: "live", label: "直播", href: "#live", iconName: "globe-2" },
      { id: "events", label: "活动", href: "#events", iconName: "package" }
    ]
  },
  { id: "system", label: "系统", items: [{ id: "members", label: "成员", href: "#members", iconName: "users" }] }
];

type Request = [boolean, ShellMenuOpenChangeReason];

function Shell({ requests, initiallyOpen = false, pins = [] as string[] }: { requests: Request[]; initiallyOpen?: boolean; pins?: string[] }) {
  const [open, setOpen] = useState(initiallyOpen);
  const [pinned, setPinned] = useState<string[]>(pins);
  const brandRef = useRef<HTMLButtonElement>(null);
  return (
    <div>
      <ShellBrandButton ref={brandRef} productId="tms" version="v2" expanded={open} aria-controls="shell-menu" onClick={() => setOpen((value) => !value)} locale="zh-CN" />
      <ShellMenu
        id="shell-menu"
        groups={menu}
        open={open}
        onOpenChange={(next, reason) => {
          requests.push([next, reason]);
          setOpen(next);
        }}
        triggerRef={brandRef}
        productId="tms"
        selectedId="roster"
        currentPath={[{ label: "艺人", href: "#talent" }, { label: "名册" }]}
        pinnedIds={pinned}
        onPinnedChange={(id, next) => setPinned((list) => (next ? [...list, id] : list.filter((entry) => entry !== id)))}
        pinnedItems={pinned.map((id) => ({ id, label: id, href: `#${id}` }))}
        locale="zh-CN"
      />
      <button type="button" id="outside">
        outside
      </button>
    </div>
  );
}

async function press(harness: DomInteractionHarness, init: KeyboardEventInit, target: EventTarget = harness.document) {
  await act(async () => {
    target.dispatchEvent(new harness.window.KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init }));
  });
}

async function pointerDown(harness: DomInteractionHarness, target: Element) {
  await act(async () => {
    target.dispatchEvent(new harness.window.MouseEvent("pointerdown", { bubbles: true, cancelable: true }));
  });
}

async function type(harness: DomInteractionHarness, input: HTMLInputElement, value: string) {
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(harness.window.HTMLInputElement.prototype, "value")?.set;
    setter?.call(input, value);
    input.dispatchEvent(new harness.window.Event("input", { bubbles: true }));
  });
}

const panel = (harness: DomInteractionHarness) => harness.document.querySelector('[data-panel="expanded"]');
const search = (harness: DomInteractionHarness) => harness.document.querySelector<HTMLInputElement>('[data-shell-search] input[type="search"]');
const brand = (harness: DomInteractionHarness) => harness.document.querySelector<HTMLButtonElement>("[data-tab]");
const row = (harness: DomInteractionHarness, label: string) =>
  [...harness.document.querySelectorAll<HTMLElement>("[data-shell-row]")].find((element) => element.textContent === label) ?? null;

test("⌘K and Ctrl+K open the menu with focus in the search; Esc closes it and focus returns to the brand button", async () => {
  const harness = createDomInteractionHarness();
  try {
    const requests: Request[] = [];
    await harness.render(<Shell requests={requests} />);
    assert.equal(panel(harness), null);
    await press(harness, { key: "k", metaKey: true });
    assert.ok(panel(harness), "⌘K opens the menu");
    assert.equal(harness.document.activeElement, search(harness));
    assert.equal(brand(harness)?.getAttribute("aria-expanded"), "true");
    await press(harness, { key: "Escape" }, harness.document.activeElement ?? harness.document);
    assert.equal(panel(harness), null, "Esc closes it");
    assert.equal(harness.document.activeElement, brand(harness));
    await press(harness, { key: "K", ctrlKey: true });
    assert.ok(panel(harness), "Ctrl+K opens it too");
    assert.equal(harness.document.activeElement, search(harness));
    // ⌘K with the menu open keeps it open and puts focus back in the search.
    row(harness, "名册")?.focus();
    await press(harness, { key: "k", metaKey: true });
    assert.ok(panel(harness));
    assert.equal(harness.document.activeElement, search(harness));
    assert.deepEqual(requests, [[true, "shortcut"], [false, "escape"], [true, "shortcut"]]);
  } finally {
    await harness.cleanup();
  }
});

test("a press outside closes the menu; presses inside it and on the brand button do not", async () => {
  const harness = createDomInteractionHarness();
  try {
    const requests: Request[] = [];
    await harness.render(<Shell requests={requests} initiallyOpen />);
    await pointerDown(harness, panel(harness) as Element);
    await pointerDown(harness, row(harness, "分组") as Element);
    assert.ok(panel(harness));
    // The brand button's own press toggles the menu; it is not an outside press.
    await pointerDown(harness, brand(harness) as Element);
    assert.ok(panel(harness));
    assert.deepEqual(requests, []);
    await pointerDown(harness, harness.document.getElementById("outside") as Element);
    assert.equal(panel(harness), null);
    assert.deepEqual(requests, [[false, "outside-pointer"]]);
    // The brand button opens it again, one step: there is no small panel in between.
    await harness.dispatchClick(brand(harness) as Element);
    assert.ok(panel(harness));
    assert.equal(harness.document.querySelectorAll('[role="dialog"]').length, 1);
  } finally {
    await harness.cleanup();
  }
});

test("choosing a row closes the menu and returns focus; pressing a pin keeps it open", async () => {
  const harness = createDomInteractionHarness();
  try {
    const requests: Request[] = [];
    await harness.render(<Shell requests={requests} initiallyOpen pins={["roster"]} />);
    const pin = row(harness, "分组")?.parentElement?.querySelector("[data-pin-button]");
    assert.ok(pin, "the row has its pin");
    await harness.dispatchClick(pin);
    assert.ok(panel(harness), "a pin is not a choice");
    assert.equal(row(harness, "分组")?.parentElement?.querySelector("[data-pin-button]")?.getAttribute("aria-pressed"), "true");
    await harness.dispatchClick(row(harness, "结算单") as Element);
    assert.equal(panel(harness), null);
    assert.equal(harness.document.activeElement, brand(harness));
    assert.deepEqual(requests, [[false, "selection"]]);
  } finally {
    await harness.cleanup();
  }
});

test("↑↓ walk a column, → opens a row's next level and enters it, ← returns and closes it", async () => {
  const harness = createDomInteractionHarness();
  try {
    await harness.render(<Shell requests={[]} initiallyOpen />);
    await press(harness, { key: "ArrowDown" }, search(harness) as Element);
    assert.equal(harness.document.activeElement, row(harness, "名册"));
    await press(harness, { key: "ArrowDown" }, row(harness, "名册") as Element);
    await press(harness, { key: "ArrowDown" }, row(harness, "分组") as Element);
    assert.equal(harness.document.activeElement, row(harness, "合约"));
    assert.equal(row(harness, "合约")?.getAttribute("aria-expanded"), "false");
    await press(harness, { key: "ArrowRight" }, row(harness, "合约") as Element);
    const second = harness.document.querySelector('[data-drop-col="2"]');
    assert.ok(second, "→ opens the next level as a cascade column");
    assert.equal(second.getAttribute("aria-label"), "合约");
    assert.equal(row(harness, "合约")?.getAttribute("aria-expanded"), "true");
    assert.equal(row(harness, "合约")?.getAttribute("aria-controls"), second.id);
    assert.equal(harness.document.activeElement, row(harness, "合约列表"));
    await press(harness, { key: "ArrowDown" }, row(harness, "合约列表") as Element);
    await press(harness, { key: "ArrowRight" }, row(harness, "模板") as Element);
    assert.ok(harness.document.querySelector('[data-drop-col="3"]'), "the fourth level opens a third column");
    assert.equal(harness.document.activeElement, row(harness, "签约合同"));
    await press(harness, { key: "ArrowLeft" }, row(harness, "签约合同") as Element);
    assert.equal(harness.document.querySelector('[data-drop-col="3"]'), null);
    assert.equal(harness.document.activeElement, row(harness, "模板"));
    await press(harness, { key: "ArrowLeft" }, row(harness, "模板") as Element);
    assert.equal(harness.document.querySelector('[data-drop-col="2"]'), null);
    assert.equal(harness.document.activeElement, row(harness, "合约"));
    // On a row without a next level, → moves to the next group column and ← back.
    await press(harness, { key: "ArrowRight" }, row(harness, "名册") as Element);
    assert.equal(harness.document.activeElement, row(harness, "直播"));
    await press(harness, { key: "ArrowLeft" }, row(harness, "直播") as Element);
    assert.equal(harness.document.activeElement, row(harness, "名册"));
    // ↑ from the first row returns to the search.
    await press(harness, { key: "ArrowUp" }, row(harness, "名册") as Element);
    assert.equal(harness.document.activeElement, search(harness));
    // The dialog owns its open cascade columns.
    await harness.dispatchClick(row(harness, "合约") as Element);
    assert.equal(panel(harness)?.getAttribute("aria-owns"), harness.document.querySelector('[data-drop-col="2"]')?.id);
  } finally {
    await harness.cleanup();
  }
});

test("a row's next level opens on a click, not on hover", async () => {
  const harness = createDomInteractionHarness();
  try {
    await harness.render(<Shell requests={[]} initiallyOpen />);
    await act(async () => {
      for (const type of ["pointerover", "mouseover", "mouseenter"]) row(harness, "合约")?.dispatchEvent(new harness.window.MouseEvent(type, { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 20));
    });
    assert.equal(harness.document.querySelector("[data-drop-col]"), null);
    await harness.dispatchClick(row(harness, "合约") as Element);
    assert.ok(harness.document.querySelector('[data-drop-col="2"]'));
    assert.ok(panel(harness), "opening a next level is not a choice");
    await harness.dispatchClick(row(harness, "合约") as Element);
    assert.equal(harness.document.querySelector("[data-drop-col]"), null, "a second click closes it");
  } finally {
    await harness.cleanup();
  }
});

test("typing 合约 leaves only the contract entries, and the columns give way to them", async () => {
  const harness = createDomInteractionHarness();
  try {
    await harness.render(<Shell requests={[]} initiallyOpen />);
    await type(harness, search(harness) as HTMLInputElement, "合约");
    const titles = [...harness.document.querySelectorAll("[data-search-result] strong")].map((element) => element.textContent);
    assert.deepEqual(titles, ["合约列表", "签约合同", "经纪合同", "审批"]);
    assert.equal(harness.document.querySelector("[data-shell-cols]"), null);
    assert.equal(harness.document.querySelector("[data-product-shell-search-results]")?.hasAttribute("hidden"), false);
    // ↓ from the search reaches the first result; choosing it closes the menu.
    await press(harness, { key: "ArrowDown" }, search(harness) as Element);
    assert.equal(harness.document.activeElement?.textContent?.startsWith("合约列表"), true);
    await harness.dispatchClick(harness.document.activeElement as Element);
    assert.equal(panel(harness), null);
  } finally {
    await harness.cleanup();
  }
});

test("the pinned group lists every pinned item; the ⌘K key is registered once and removed on unmount", async () => {
  const harness = createDomInteractionHarness();
  try {
    const requests: Request[] = [];
    await harness.render(<Shell requests={requests} initiallyOpen pins={["billing", "contracts"]} />);
    const group = harness.document.querySelector("[data-shell-pinned-group]");
    assert.ok(group, "the pinned group is rendered (the stylesheet shows it narrower than 1024)");
    assert.deepEqual([...group.querySelectorAll("[data-shell-row]")].map((element) => element.textContent), ["结算单", "合约"]);
    assert.equal(group.querySelector(".tcrn-nav-group__label")?.textContent, "已固定");
    await press(harness, { key: "Escape" });
    await press(harness, { key: "k", ctrlKey: true });
    assert.deepEqual(requests, [[false, "escape"], [true, "shortcut"]], "one shell answers one ⌘K once");
    await harness.render(<div />);
    await press(harness, { key: "k", metaKey: true });
    assert.equal(requests.length, 2, "unmounted, the shell no longer answers ⌘K");
  } finally {
    await harness.cleanup();
  }
});

// The Sheet (TCRN-DS-SUB-126): jsdom has no matchMedia, so the viewport is the test's — 760 wide or
// narrower while `narrow` — and a resize tells the listeners the query's answer changed.
function stubViewport(harness: DomInteractionHarness, narrow: boolean) {
  const listeners = new Set<() => void>();
  const state = { narrow };
  harness.window.matchMedia = ((query: string) => ({
    get matches() {
      return query === "(max-width: 760px)" ? state.narrow : false;
    },
    media: query,
    addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener)
  })) as unknown as typeof harness.window.matchMedia;
  return {
    async resize(next: boolean) {
      state.narrow = next;
      await act(async () => {
        for (const listener of listeners) listener();
      });
    }
  };
}

const sheet = (harness: DomInteractionHarness) => harness.document.querySelector<HTMLElement>('[data-panel="sheet"]');
const scrim = (harness: DomInteractionHarness) => harness.document.querySelector<HTMLElement>("[data-shell-scrim]");

test("760 wide a press on the brand button opens the Sheet with focus on it; the scrim and Esc close it; ⌘K focuses the search", async () => {
  const harness = createDomInteractionHarness();
  try {
    stubViewport(harness, true);
    const requests: Request[] = [];
    await harness.render(<Shell requests={requests} pins={["roster", "billing"]} />);
    await harness.dispatchClick(brand(harness) as Element);
    assert.ok(sheet(harness), "the brand button opens the Sheet");
    assert.equal(panel(harness), null, "and not the panel");
    assert.ok(scrim(harness));
    assert.equal(harness.document.activeElement, sheet(harness), "the Sheet takes focus, so no on-screen keyboard rises");
    assert.deepEqual(
      [...harness.document.querySelectorAll("[data-shell-group] > .tcrn-nav-group__label")].map((label) => label.textContent),
      ["固定项 · 2", "全部"]
    );
    await pointerDown(harness, sheet(harness) as Element);
    assert.ok(sheet(harness), "a press inside keeps it open");
    await pointerDown(harness, scrim(harness) as Element);
    assert.equal(sheet(harness), null, "a press on the scrim is a press outside");
    assert.equal(scrim(harness), null);
    await harness.dispatchClick(brand(harness) as Element);
    await press(harness, { key: "Escape" }, harness.document.activeElement ?? harness.document);
    assert.equal(sheet(harness), null);
    assert.equal(harness.document.activeElement, brand(harness), "Esc returns focus to the brand button");
    await press(harness, { key: "k", metaKey: true });
    assert.ok(sheet(harness));
    assert.equal(harness.document.activeElement, search(harness), "⌘K asks for the search");
    assert.deepEqual(requests, [[false, "outside-pointer"], [false, "escape"], [true, "shortcut"]]);
  } finally {
    await harness.cleanup();
  }
});

test("in the Sheet a group opens its items after the lists; → enters a level, ← closes it; a choice closes the Sheet", async () => {
  const harness = createDomInteractionHarness();
  try {
    stubViewport(harness, true);
    const requests: Request[] = [];
    await harness.render(<Shell requests={requests} initiallyOpen />);
    // Mounted open, the menu first renders the panel and turns into the Sheet before it paints;
    // the focus and the layer's listeners follow it there.
    assert.equal(harness.document.activeElement, sheet(harness));
    await pointerDown(harness, sheet(harness) as Element);
    assert.ok(sheet(harness), "a press inside the Sheet is not outside");
    const talent = row(harness, "艺人") as HTMLElement;
    assert.equal(talent.getAttribute("aria-expanded"), "false");
    await harness.dispatchClick(talent);
    assert.equal(talent.getAttribute("aria-expanded"), "true");
    const level = harness.document.getElementById(talent.getAttribute("aria-controls") ?? "");
    assert.ok(level && sheet(harness)?.contains(level), "the level opens inside the Sheet");
    assert.equal(level.getAttribute("role"), "group");
    assert.equal(level.getAttribute("aria-label"), "艺人");
    assert.equal(level.getAttribute("data-drop-col"), "2");
    assert.ok(level.compareDocumentPosition(talent) & harness.window.Node.DOCUMENT_POSITION_PRECEDING, "after the lists");
    assert.ok(sheet(harness), "opening a level is not a choice");
    const contracts = row(harness, "合约") as HTMLElement;
    contracts.focus();
    await press(harness, { key: "ArrowRight" }, contracts);
    assert.equal(contracts.getAttribute("aria-expanded"), "true");
    assert.equal(harness.document.activeElement, row(harness, "合约列表"));
    await press(harness, { key: "ArrowLeft" }, harness.document.activeElement as Element);
    assert.equal(contracts.getAttribute("aria-expanded"), "false");
    assert.equal(harness.document.activeElement, contracts);
    await harness.dispatchClick(row(harness, "分组") as Element);
    assert.equal(sheet(harness), null, "a choice closes the Sheet");
    assert.equal(harness.document.activeElement, brand(harness));
    assert.deepEqual(requests, [[false, "selection"]]);
  } finally {
    await harness.cleanup();
  }
});

test("the presentation follows the viewport: across 760 the open menu turns from the panel to the Sheet and back", async () => {
  const harness = createDomInteractionHarness();
  try {
    const viewport = stubViewport(harness, false);
    await harness.render(<Shell requests={[]} initiallyOpen />);
    assert.ok(panel(harness));
    assert.equal(sheet(harness), null);
    assert.equal(harness.document.activeElement, search(harness));
    await viewport.resize(true);
    assert.ok(sheet(harness));
    assert.equal(panel(harness), null);
    assert.equal(harness.document.activeElement, sheet(harness), "focus moves into the Sheet");
    await viewport.resize(false);
    assert.ok(panel(harness));
    assert.equal(scrim(harness), null);
    assert.equal(harness.document.activeElement, search(harness));
  } finally {
    await harness.cleanup();
  }
});

// ProductShell reports the open Sheet (TCRN-DS-SUB-159; 144, C-5): it reads the menu's presentation
// with useShellMenuPresentation, so its root says data-state="sheet" while the Sheet is open,
// "expanded" while the panel is, and "closed" with the menu shut. No prop is added for it.
function ProductShellFixture({ open }: { open: boolean }) {
  return (
    <ProductShell
      productName="TCRN TMS"
      moduleName="艺人"
      brandProductId="tms"
      currentRouteLabel="名册"
      navGroups={menu}
      locales={[{ locale: "zh-CN", nativeName: "简体中文" }]}
      currentLocale="zh-CN"
      pageHeader={{ title: "名册" }}
      menuOpen={open}
    >
      <p>名册</p>
    </ProductShell>
  );
}

test("ProductShell's root says data-state=\"sheet\" while the Sheet is open and \"expanded\" while the panel is", async () => {
  const harness = createDomInteractionHarness();
  try {
    const viewport = stubViewport(harness, true);
    const root = () => harness.document.querySelector<HTMLElement>(".tcrn-product-shell");
    await harness.render(<ProductShellFixture open={false} />);
    assert.equal(root()?.getAttribute("data-state"), "closed");
    await harness.render(<ProductShellFixture open />);
    assert.ok(sheet(harness), "760 wide the open menu is the Sheet");
    assert.equal(root()?.getAttribute("data-state"), "sheet");
    await viewport.resize(false);
    assert.ok(panel(harness), "wider, it is the panel");
    assert.equal(root()?.getAttribute("data-state"), "expanded");
    await viewport.resize(true);
    assert.equal(root()?.getAttribute("data-state"), "sheet", "and back with the viewport");
    await harness.render(<ProductShellFixture open={false} />);
    assert.equal(root()?.getAttribute("data-state"), "closed");
  } finally {
    await harness.cleanup();
  }
});
