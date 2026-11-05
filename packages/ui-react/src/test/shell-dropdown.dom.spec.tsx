// ShellDropdown behaviour (TCRN-DS-SUB-118; STORY-139 GWT1–GWT5): the pinned item opens it at its
// start edge and bottom; a row's next level opens on a click and not on hover; ← returns from the
// cascade to the same row; Esc closes every column and returns focus to the pinned item; the search
// matches only the drop-down's part of the menu; a press outside and a choice close it. TCRN-DS-SUB-180
// (139-GWT1, GWT4) adds the placing from a framing ancestor, the placing again when the band changes,
// and ← from a third column. TCRN-DS-SUB-233 adds the side of the cascades: to the left of the first
// column where they would pass the viewport's right edge, as before where they fit.
import test from "node:test";
import assert from "node:assert/strict";
import { act, useState, type RefObject } from "react";
import { createTokenMap } from "@tcrn/ui-tokens";
import { ShellDropdown, ShellPins, tcrnComponentCss, type ShellLayerCloseReason, type ShellMenuGroup, type ShellMenuItem } from "../index.js";
import { createDomInteractionHarness, type DomInteractionHarness } from "./dom-harness.js";

const contracts: ShellMenuItem = {
  id: "contracts",
  label: "合约",
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
};

function Band({ closes, preview = false }: { closes: ShellLayerCloseReason[]; preview?: boolean }) {
  const [openId, setOpenId] = useState<string | null>();
  const previewOpen = preview && openId === undefined;
  const shownOpenId = previewOpen ? "contracts" : openId ?? null;
  return (
    <div>
      <ShellPins
        items={[
          { id: "roster", label: "名册", href: "#roster" },
          { id: "contracts", label: "合约", hasMenu: true }
        ]}
        openId={shownOpenId}
        onOpenChange={setOpenId}
        menuIdOf={(id) => `drop-${id}`}
        locale="zh-CN"
      />
      <ShellDropdown
        id="drop-contracts"
        source={contracts}
        open={shownOpenId === "contracts"}
        focusOnOpen={!previewOpen}
        onOpenChange={(next, reason) => {
          closes.push(reason);
          if (!next) setOpenId(null);
        }}
        locale="zh-CN"
      />
      <p id="outside">outside</p>
    </div>
  );
}

async function press(harness: DomInteractionHarness, target: EventTarget, key: string) {
  await act(async () => {
    target.dispatchEvent(new harness.window.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
  });
}

const pinButton = (harness: DomInteractionHarness) => harness.document.querySelector<HTMLButtonElement>('[data-pin="contracts"] button');
const drop = (harness: DomInteractionHarness) => harness.document.querySelector<HTMLElement>('[data-panel="drop"]');
const row = (harness: DomInteractionHarness, label: string) =>
  [...harness.document.querySelectorAll<HTMLElement>("[data-shell-row]")].find((element) => element.textContent === label) ?? null;

async function openFromThePin(harness: DomInteractionHarness) {
  const button = pinButton(harness);
  assert.ok(button);
  // The pinned item 合约 of the 07a board: start edge 207, bottom 42.
  button.getBoundingClientRect = () => ({ left: 207, top: 10, right: 270, bottom: 42, width: 63, height: 32, x: 207, y: 10, toJSON: () => ({}) }) as DOMRect;
  await harness.dispatchClick(button);
}

test("the pinned item opens and focuses its drop-down at the pin; a pre-opened preview leaves focus alone", async () => {
  const harness = createDomInteractionHarness();
  try {
    await harness.render(<Band closes={[]} preview />);
    assert.ok(drop(harness), "the preview still starts open");
    assert.equal(harness.document.activeElement, harness.document.body);
    await harness.dispatchClick(pinButton(harness) as Element);
    assert.equal(drop(harness), null);
    await openFromThePin(harness);
    const panel = drop(harness);
    assert.ok(panel, "the drop-down is open");
    assert.equal(panel.id, pinButton(harness)?.getAttribute("aria-controls"));
    assert.equal(pinButton(harness)?.getAttribute("aria-expanded"), "true");
    assert.equal(pinButton(harness)?.getAttribute("aria-haspopup"), "dialog");
    const root = panel.parentElement as HTMLElement;
    assert.equal(root.style.left, "207px");
    assert.equal(root.style.top, "42px");
    assert.equal(root.style.visibility, "");
    assert.equal(harness.document.activeElement, harness.document.querySelector('[data-panel="drop"] input[type="search"]'));
  } finally {
    await harness.cleanup();
  }
});

test("a row's next level opens on a click, not after 500ms of hover; ← returns to the same row", async () => {
  const harness = createDomInteractionHarness();
  try {
    await harness.render(<Band closes={[]} />);
    await openFromThePin(harness);
    await act(async () => {
      for (const type of ["pointerover", "pointerenter", "mouseover", "mouseenter"]) row(harness, "模板")?.dispatchEvent(new harness.window.MouseEvent(type, { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 500));
    });
    assert.equal(harness.document.querySelector("[data-drop-col]"), null, "hover opens nothing");
    await harness.dispatchClick(row(harness, "模板") as Element);
    const second = harness.document.querySelector<HTMLElement>('[data-drop-col="2"]');
    assert.ok(second, "a click opens the second column");
    assert.equal(second.parentElement, drop(harness)?.parentElement, "the column is a grid sibling of the first");
    assert.equal(second.getAttribute("role"), "group");
    assert.equal(row(harness, "模板")?.getAttribute("aria-expanded"), "true");
    assert.ok(drop(harness), "opening a next level is not a choice");
    row(harness, "签约合同")?.focus();
    await press(harness, row(harness, "签约合同") as Element, "ArrowDown");
    assert.equal(harness.document.activeElement, row(harness, "经纪合同"));
    await press(harness, row(harness, "经纪合同") as Element, "ArrowLeft");
    assert.equal(harness.document.activeElement, row(harness, "模板"), "← returns to the same row of the first column");
    assert.equal(harness.document.querySelector("[data-drop-col]"), null);
    await press(harness, row(harness, "模板") as Element, "ArrowRight");
    assert.equal(harness.document.activeElement, row(harness, "签约合同"), "→ opens and enters it again");
  } finally {
    await harness.cleanup();
  }
});

test("Esc closes every column and returns focus to the pinned item", async () => {
  const harness = createDomInteractionHarness();
  try {
    const closes: ShellLayerCloseReason[] = [];
    await harness.render(<Band closes={closes} />);
    await openFromThePin(harness);
    await harness.dispatchClick(row(harness, "模板") as Element);
    assert.ok(harness.document.activeElement?.matches('input[type="search"]'), "the opening search retains focus before Escape");
    await press(harness, harness.document.activeElement ?? harness.document, "Escape");
    assert.equal(drop(harness), null);
    assert.equal(harness.document.querySelector("[data-drop-col]"), null);
    assert.equal(harness.document.activeElement, pinButton(harness));
    assert.equal(pinButton(harness)?.getAttribute("aria-expanded"), "false");
    assert.deepEqual(closes, ["escape"]);
  } finally {
    await harness.cleanup();
  }
});

test("the search matches only the drop-down's part of the menu", async () => {
  const harness = createDomInteractionHarness();
  try {
    await harness.render(<Band closes={[]} />);
    await openFromThePin(harness);
    const input = harness.document.querySelector<HTMLInputElement>('[data-panel="drop"] input[type="search"]') as HTMLInputElement;
    const type = async (value: string) =>
      act(async () => {
        Object.getOwnPropertyDescriptor(harness.window.HTMLInputElement.prototype, "value")?.set?.call(input, value);
        input.dispatchEvent(new harness.window.Event("input", { bubbles: true }));
      });
    await type("合同");
    assert.deepEqual([...harness.document.querySelectorAll("[data-search-result] strong")].map((element) => element.textContent), ["签约合同", "经纪合同"]);
    assert.equal(harness.document.querySelector("[data-search-result] span")?.textContent, "合约 › 模板");
    await type("名册");
    assert.equal(harness.document.querySelectorAll("[data-search-result]").length, 0, "名册 is pinned beside it, not under it");
  } finally {
    await harness.cleanup();
  }
});

test("a press outside and a choice close it; pressing the pinned item again closes it too", async () => {
  const harness = createDomInteractionHarness();
  try {
    const closes: ShellLayerCloseReason[] = [];
    await harness.render(<Band closes={closes} />);
    await openFromThePin(harness);
    await act(async () => {
      harness.document.getElementById("outside")?.dispatchEvent(new harness.window.MouseEvent("pointerdown", { bubbles: true }));
    });
    assert.equal(drop(harness), null);
    await openFromThePin(harness);
    await harness.dispatchClick(row(harness, "审批") as Element);
    assert.equal(drop(harness), null);
    assert.equal(harness.document.activeElement, pinButton(harness));
    await openFromThePin(harness);
    await act(async () => {
      pinButton(harness)?.dispatchEvent(new harness.window.MouseEvent("pointerdown", { bubbles: true }));
    });
    assert.ok(drop(harness), "a press on the pinned item is not outside");
    await harness.dispatchClick(pinButton(harness) as Element);
    assert.equal(drop(harness), null);
    assert.deepEqual(closes, ["outside-pointer", "selection"]);
  } finally {
    await harness.cleanup();
  }
});

// TCRN-DS-SUB-180. A band whose first pinned item can be renamed, around the drop-down of one pinned
// entry (an item, or a group whose rows reach a third column), optionally inside a frame that contains
// fixed descendants (a transform), as a documentation page's framed screen does.
const talent: ShellMenuGroup = { id: "talent", label: "艺人", items: [{ id: "roster", label: "名册", href: "#roster" }, contracts] };

function FramedBand({
  pin = contracts, firstLabel = "名册", framed = false, cascadeBoundaryRef
}: {
  pin?: ShellMenuItem | ShellMenuGroup;
  firstLabel?: string;
  framed?: boolean;
  cascadeBoundaryRef?: RefObject<HTMLElement | null>;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const band = (
    <div>
      <ShellPins
        items={[
          { id: "first", label: firstLabel, href: "#first" },
          { id: pin.id, label: pin.label, hasMenu: true }
        ]}
        openId={openId}
        onOpenChange={setOpenId}
        menuIdOf={(id) => `drop-${id}`}
        locale="zh-CN"
      />
      <ShellDropdown
        id={`drop-${pin.id}`}
        source={pin}
        open={openId === pin.id}
        cascadeBoundaryRef={cascadeBoundaryRef}
        onOpenChange={(next) => {
          if (!next) setOpenId(null);
        }}
        locale="zh-CN"
      />
    </div>
  );
  return framed ? (
    <div data-frame="" style={{ transform: "translate(40px, 30px)" }}>
      {band}
    </div>
  ) : (
    band
  );
}

const rectAt = (left: number, top: number, width: number, height: number) =>
  ({ left, top, right: left + width, bottom: top + height, width, height, x: left, y: top, toJSON: () => ({}) }) as DOMRect;
const pinOf = (harness: DomInteractionHarness, id: string) => harness.document.querySelector<HTMLButtonElement>(`[data-pin="${id}"] button`);

test("the drop-down is placed from the nearest ancestor that contains fixed layers, not from the viewport, and stays on the item when that ancestor moves (TCRN-DS-SUB-180)", async () => {
  const harness = createDomInteractionHarness();
  try {
    await harness.render(<FramedBand framed />);
    const frame = harness.document.querySelector<HTMLElement>("[data-frame]");
    const button = pinOf(harness, "contracts");
    assert.ok(frame && button);
    // The frame's transform makes it the fixed drop-down's containing block, 40, 30 into the viewport;
    // the pinned item 合约 sits 207 in and 10 down inside it, 32 tall (07a board).
    let frameAt = { left: 40, top: 30 };
    frame.getBoundingClientRect = () => rectAt(frameAt.left, frameAt.top, 1240, 900);
    button.getBoundingClientRect = () => rectAt(frameAt.left + 207, frameAt.top + 10, 63, 32);
    await harness.dispatchClick(button);
    const root = drop(harness)?.parentElement;
    assert.ok(root, "the drop-down is open");
    // From the frame, not the viewport (which would read 247 and 72): start edge = the item's, top =
    // the item's bottom, the gap below it being the root's margin (next test).
    assert.equal(root.style.left, "207px");
    assert.equal(root.style.top, "42px");
    assert.equal(root.style.visibility, "");
    // The frame moves (the page scrolls it, a story re-frames it); the item moves with it. A scroll
    // reads the place again, and the drop-down stays on the item.
    frameAt = { left: 120, top: 64 };
    await act(async () => {
      harness.window.dispatchEvent(new harness.window.Event("scroll"));
    });
    assert.equal(root.style.left, "207px");
    assert.equal(root.style.top, "42px");
    assert.equal(button.getBoundingClientRect().left - frame.getBoundingClientRect().left, 207, "left = the item's left, in the frame");
  } finally {
    await harness.cleanup();
  }
});

test("an open drop-down is placed again when the band changes size or its words move the item; the gap below the item is --tcrn-shell-menu-gap (TCRN-DS-SUB-180)", async () => {
  type Watcher = { callback: () => void; targets: Element[] };
  const watchers: Watcher[] = [];
  const globals = globalThis as unknown as { ResizeObserver?: unknown };
  const previous = globals.ResizeObserver;
  globals.ResizeObserver = class {
    readonly watcher: Watcher;
    constructor(callback: () => void) {
      this.watcher = { callback, targets: [] };
      watchers.push(this.watcher);
    }
    observe(target: Element) {
      this.watcher.targets.push(target);
    }
    unobserve() {}
    disconnect() {
      this.watcher.targets = [];
    }
  };
  const harness = createDomInteractionHarness();
  try {
    await harness.render(<FramedBand />);
    const button = pinOf(harness, "contracts");
    assert.ok(button);
    let itemLeft = 207;
    button.getBoundingClientRect = () => rectAt(itemLeft, 10, 63, 32);
    await harness.dispatchClick(button);
    const root = drop(harness)?.parentElement;
    assert.ok(root, "the drop-down is open");
    assert.equal(root.style.left, "207px");
    assert.equal(root.style.top, "42px");
    // The band, the pinned item's row, is watched for its size.
    const watcher = watchers.find((candidate) => candidate.targets.includes(button.parentElement as Element));
    assert.ok(watcher, "the band is observed");
    // The band changes size (the window widens, the cluster's words grow) and the item moves 44 on:
    // the open drop-down follows it.
    itemLeft = 251;
    await act(async () => {
      watcher.callback();
    });
    assert.equal(root.style.left, "251px");
    assert.equal(root.style.top, "42px");
    // A pinned item before it is renamed (another language, a renamed entry): the band renders again,
    // the item moves, and the place is read again after that render.
    itemLeft = 299;
    await harness.render(<FramedBand firstLabel="名册与分组" />);
    assert.ok(drop(harness), "still open");
    assert.equal(root.style.left, "299px");
    assert.equal(root.style.top, "42px");
    // The gap is not written into the place: top is the item's bottom, and the hand-off below it is the
    // root's margin, the menu gap token, so the panel's top is the item's bottom plus the token's value.
    assert.equal(root.style.marginTop, "");
    assert.ok(root.matches(".tcrn-shell-menu.tcrn-shell-dropdown"));
    const rule = /\n\.tcrn-shell-menu\.tcrn-shell-dropdown \{([^}]*)\}/.exec(tcrnComponentCss)?.[1] ?? "";
    assert.match(rule, /margin-top: var\(--tcrn-shell-menu-gap\);/);
    const gap = Number.parseFloat(createTokenMap()["--tcrn-shell-menu-gap"]);
    assert.ok(Number.isFinite(gap) && gap > 0, "the gap is a token length");
    assert.equal(Number.parseFloat(root.style.top) + gap, button.getBoundingClientRect().bottom + gap);
  } finally {
    await harness.cleanup();
    if (previous === undefined) delete globals.ResizeObserver;
    else globals.ResizeObserver = previous;
  }
});

test("opened to a third column, ← returns focus to the previous column's open row, the rendered one that says aria-expanded=\"true\" (TCRN-DS-SUB-180)", async () => {
  const harness = createDomInteractionHarness();
  // JSDOM lays nothing out: a row counts as rendered when it is connected and not under [hidden], as
  // the drop-down's ← reads it (getClientRects), so the row it returns to is a rendered one.
  const prototype = harness.window.HTMLElement.prototype as HTMLElement & { getClientRects: () => DOMRectList };
  prototype.getClientRects = function (this: HTMLElement) {
    return (this.isConnected && !this.closest("[hidden]") ? [this.getBoundingClientRect()] : []) as unknown as DOMRectList;
  };
  try {
    await harness.render(<FramedBand pin={talent} />);
    const button = pinOf(harness, "talent");
    assert.ok(button);
    button.getBoundingClientRect = () => rectAt(207, 10, 63, 32);
    await harness.dispatchClick(button);
    assert.ok(drop(harness), "the group's drop-down is open");
    // Level 2 in the drop-down, level 3 in the second column, level 4 in the third.
    await harness.dispatchClick(row(harness, "合约") as Element);
    await harness.dispatchClick(row(harness, "模板") as Element);
    const second = harness.document.querySelector<HTMLElement>('[data-drop-col="2"]');
    const third = harness.document.querySelector<HTMLElement>('[data-drop-col="3"]');
    assert.ok(second && third, "the second and the third column are open");
    // The row ← must return to: in the previous (second) column, rendered, and the open one, the row
    // that says aria-expanded="true" and controls the third column.
    const open = [...second.querySelectorAll<HTMLElement>("[data-shell-row]")].filter((candidate) => candidate.getAttribute("aria-expanded") === "true" && candidate.getClientRects().length > 0);
    assert.deepEqual(open, [row(harness, "模板")], "one rendered open row in the second column");
    assert.equal(open[0].getAttribute("aria-controls"), third.id);
    row(harness, "签约合同")?.focus();
    await press(harness, row(harness, "签约合同") as Element, "ArrowLeft");
    assert.equal(harness.document.activeElement, open[0], "focus is back on that row");
    assert.ok(open[0].getClientRects().length > 0, "a rendered row");
    // ← closes the column it leaves, so that row now says aria-expanded="false"; the second column and
    // the row that opened it stay open.
    assert.equal(harness.document.querySelector('[data-drop-col="3"]'), null, "the third column closed");
    assert.equal(open[0].getAttribute("aria-expanded"), "false");
    assert.ok(harness.document.querySelector('[data-drop-col="2"]'), "the second column stays");
    assert.equal(row(harness, "合约")?.getAttribute("aria-expanded"), "true");
    // ← again: back to the drop-down's own row, the open one that opened the second column.
    await press(harness, open[0], "ArrowLeft");
    assert.equal(harness.document.activeElement, row(harness, "合约"));
    assert.equal(harness.document.querySelector("[data-drop-col]"), null);
  } finally {
    delete (prototype as { getClientRects?: unknown }).getClientRects;
    await harness.cleanup();
  }
});

// TCRN-DS-SUB-233. JSDOM lays nothing out, so the drop-down's boxes are laid out here as the package
// CSS lays out its one-row grid (shellCss03 and shellCss04; the tests check the start rule's text): the
// root at the left and top ShellDropdown writes, the hand-off gap (its margin) below them; the first
// column, the panel, drop-w wide and as tall as its search and rows in its inset (the 07a reading);
// each cascade column drop-w wide and as tall as the panel (the grid row), the cascade gap after the
// column before it: rightwards, or leftwards when the root says data-cascade-side="start" (the grid
// runs from the right). The viewport is the layout viewport's width (documentElement.clientWidth).
function layOutTheDropDown(harness: DomInteractionHarness, viewport: { current: number }) {
  const tokens = createTokenMap();
  const px = (name: string) => Number.parseFloat(tokens[name]);
  const width = px("--tcrn-shell-drop-w");
  const gap = px("--tcrn-shell-cascade-gap");
  const panelHeightOf = (rows: number) =>
    2 * px("--tcrn-space-1h") + px("--tcrn-shell-drop-srch-h") + px("--tcrn-space-1") + rows * (px("--tcrn-shell-row-h") + px("--tcrn-space-0h"));
  const elementBox = harness.window.Element.prototype.getBoundingClientRect;
  const prototype = harness.window.HTMLElement.prototype as HTMLElement & { getBoundingClientRect: () => DOMRect };
  prototype.getBoundingClientRect = function (this: HTMLElement) {
    const root = this.matches("[data-shell-dropdown]") ? this : this.parentElement?.matches("[data-shell-dropdown]") ? this.parentElement : null;
    if (!root) return elementBox.call(this);
    const rows = root.querySelector('[data-panel="drop"]')?.querySelectorAll("[data-shell-row]").length ?? 0;
    const columns = [...root.children].filter((child) => child.hasAttribute("data-drop-col"));
    const step = (width + gap) * (root.getAttribute("data-cascade-side") === "start" ? -1 : 1);
    const left = (Number.parseFloat(root.style.left) || 0) + (columns.indexOf(this) + 1) * step;
    return rectAt(left, (Number.parseFloat(root.style.top) || 0) + px("--tcrn-shell-menu-gap"), width, panelHeightOf(rows));
  };
  Object.defineProperty(harness.document.documentElement, "clientWidth", { configurable: true, get: () => viewport.current });
  return {
    gap,
    width,
    restore() {
      delete (prototype as { getBoundingClientRect?: unknown }).getBoundingClientRect;
    }
  };
}

const boxOf = (element: Element | null) => {
  assert.ok(element, "the column is there");
  const { left, right, width, height } = element.getBoundingClientRect();
  return { left, right, width, height };
};

test("by the viewport's right edge the cascades open to the left of the first column: the second column's right edge 4 before the first column's left edge, the third 4 before the second, as wide and as tall, inside the viewport; ←, Esc and aria-owns do not change (TCRN-DS-SUB-233)", async (t) => {
  const harness = createDomInteractionHarness();
  const viewport = { current: 1240 };
  const layout = layOutTheDropDown(harness, viewport);
  try {
    await harness.render(<FramedBand pin={talent} />);
    const button = pinOf(harness, "talent");
    assert.ok(button);
    // The pinned group stands by the right edge of a 1240 viewport: its start edge is 1000.
    button.getBoundingClientRect = () => rectAt(1000, 10, 63, 32);
    await harness.dispatchClick(button);
    const panel = drop(harness);
    const root = panel?.parentElement;
    assert.ok(panel && root, "the group's drop-down is open");
    assert.equal(root.style.left, "1000px", "the first column keeps the item's start edge");
    assert.equal(root.getAttribute("data-cascade-side"), null, "with no cascade open there is no side");
    // 合约 opens the second column: after the first it would end at 1000 + 240 + 4 + 240 = 1484.
    await harness.dispatchClick(row(harness, "合约") as Element);
    assert.equal(root.getAttribute("data-cascade-side"), "start");
    assert.match(tcrnComponentCss, /\n\.tcrn-shell-dropdown\[data-cascade-side="start"\] \{\n {2}direction: rtl;\n\}/, "the start rule turns the grid");
    const first = boxOf(panel);
    const second = boxOf(harness.document.querySelector('[data-drop-col="2"]'));
    t.diagnostic(`start, viewport 0-${viewport.current}: first column ${first.left}-${first.right}, second ${second.left}-${second.right} (${second.width} x ${second.height}, first ${first.height} tall); second right - first left = ${second.right - first.left}`);
    assert.equal(first.left - second.right, layout.gap, "the second column's right edge is the first column's left edge - 4");
    assert.equal(layout.gap, 4);
    assert.equal(second.width, 240);
    assert.equal(second.height, first.height, "as tall as the first column");
    assert.ok(second.left >= 0 && second.right <= viewport.current, "the whole column is inside the viewport");
    assert.equal(panel.getAttribute("aria-owns"), "drop-talent-col-contracts", "aria-owns as on the right");
    // 模板 opens the third column, 4 before the second, on the same side.
    await harness.dispatchClick(row(harness, "模板") as Element);
    const third = boxOf(harness.document.querySelector('[data-drop-col="3"]'));
    const secondAgain = boxOf(harness.document.querySelector('[data-drop-col="2"]'));
    t.diagnostic(`start, three columns: third ${third.left}-${third.right}, second ${secondAgain.left}-${secondAgain.right}; third right - second left = ${third.right - secondAgain.left}`);
    assert.equal(root.getAttribute("data-cascade-side"), "start");
    assert.equal(secondAgain.left - third.right, 4);
    assert.equal(third.width, 240);
    assert.equal(third.height, first.height);
    assert.ok(third.left >= 0, "the third column is inside the viewport too");
    assert.equal(panel.getAttribute("aria-owns"), "drop-talent-col-contracts drop-talent-col-templates");
    // ← from the third column returns to the open row of the previous column and closes the third;
    // the second alone would still pass the edge after the first, so it stays on the start side.
    row(harness, "签约合同")?.focus();
    await press(harness, row(harness, "签约合同") as Element, "ArrowLeft");
    assert.equal(harness.document.activeElement, row(harness, "模板"), "← returns to the same row of the previous column");
    assert.equal(harness.document.querySelector('[data-drop-col="3"]'), null);
    assert.equal(root.getAttribute("data-cascade-side"), "start");
    assert.equal(panel.getAttribute("aria-owns"), "drop-talent-col-contracts");
    // Esc closes every column and returns focus to the pinned item.
    await press(harness, harness.document.activeElement ?? harness.document, "Escape");
    assert.equal(drop(harness), null);
    assert.equal(harness.document.querySelector("[data-drop-col]"), null);
    assert.equal(harness.document.activeElement, button);
  } finally {
    layout.restore();
    await harness.cleanup();
  }
});

test("where the cascade fits it opens after the first column as before, its left edge 4 after the first column's right edge, with no side on the root; a narrower window turns it to the start and a wider one back; with room on neither side it keeps the side it passes by less (TCRN-DS-SUB-233)", async (t) => {
  const harness = createDomInteractionHarness();
  const viewport = { current: 1240 };
  const layout = layOutTheDropDown(harness, viewport);
  const frameRef: RefObject<HTMLDivElement | null> = { current: null };
  const band = (contained: boolean) => <div ref={frameRef}><FramedBand cascadeBoundaryRef={contained ? frameRef : undefined} /></div>;
  try {
    await harness.render(band(false));
    const button = pinOf(harness, "contracts");
    assert.ok(button);
    // The pinned item 合约 of the 07a board: start edge 207.
    let itemLeft = 207;
    button.getBoundingClientRect = () => rectAt(itemLeft, 10, 63, 32);
    await harness.dispatchClick(button);
    const panel = drop(harness);
    const root = panel?.parentElement;
    assert.ok(panel && root, "the drop-down is open");
    await harness.dispatchClick(row(harness, "模板") as Element);
    const column = () => boxOf(harness.document.querySelector('[data-drop-col="2"]'));
    let first = boxOf(panel);
    let second = column();
    t.diagnostic(`end, viewport 0-${viewport.current}: first column ${first.left}-${first.right}, second ${second.left}-${second.right} (${second.width} x ${second.height}, first ${first.height} tall); second left - first right = ${second.left - first.right}`);
    assert.equal(root.getAttribute("data-cascade-side"), null, "a drop-down that fits says no side");
    assert.deepEqual(root.getAttributeNames().sort(), ["class", "data-shell-dropdown", "style"], "its root carries what it carried before");
    assert.equal(second.left - first.right, layout.gap, "the second column's left edge is the first column's right edge + 4");
    assert.equal(second.width, layout.width);
    assert.equal(second.height, first.height);
    const resize = async (width: number) => {
      viewport.current = width;
      await act(async () => {
        harness.window.dispatchEvent(new harness.window.Event("resize"));
      });
    };
    // The window narrows to 800 with the item at 400: after the first column the cascade would end at
    // 884, before it it starts at 156.
    itemLeft = 400;
    await resize(800);
    first = boxOf(panel);
    second = column();
    t.diagnostic(`start after a resize, viewport 0-${viewport.current}: first column ${first.left}-${first.right}, second ${second.left}-${second.right}`);
    assert.equal(root.style.left, "400px");
    assert.equal(root.getAttribute("data-cascade-side"), "start");
    assert.equal(first.left - second.right, 4);
    assert.ok(second.left >= 0 && second.right <= viewport.current);
    // Wider again: back after the first column.
    await resize(1240);
    first = boxOf(panel);
    second = column();
    assert.equal(root.getAttribute("data-cascade-side"), null);
    assert.equal(second.left - first.right, 4);
    // No room on either side (420 wide, the item at 20): after the first column the cascade passes the
    // right edge by 84, before it the left edge by 224, so it stays after it.
    itemLeft = 20;
    await resize(420);
    assert.equal(root.style.left, "20px");
    assert.equal(root.getAttribute("data-cascade-side"), null);
    assert.equal(column().left - boxOf(panel).right, 4);

    const frame = frameRef.current;
    assert.ok(frame);
    let frameWidth = 600;
    frame.getBoundingClientRect = () => rectAt(80, 0, frameWidth, 640);
    Object.defineProperties(frame, {
      clientWidth: { get: () => frameWidth },
      scrollWidth: { value: 1240 }
    });
    itemLeft = 360;
    await resize(1240);
    await harness.render(band(true));
    assert.equal(root.getAttribute("data-cascade-side"), "start", "the cascade fits on the frame's left");
    assert.equal(boxOf(panel).left - column().right, 4);

    frameWidth = 356;
    await resize(440);
    assert.equal(root.getAttribute("data-cascade-side"), null, "both columns need the frame's scrollable width");
    frame.scrollLeft = 410;
    itemLeft -= frame.scrollLeft;
    await act(async () => {
      frame.dispatchEvent(new harness.window.Event("scroll"));
    });
    second = column();
    assert.equal(second.left - boxOf(panel).right, 4);
    assert.ok(second.left >= 80 && second.right <= 80 + frameWidth, "panning reveals the whole cascade");
  } finally {
    layout.restore();
    await harness.cleanup();
  }
});
