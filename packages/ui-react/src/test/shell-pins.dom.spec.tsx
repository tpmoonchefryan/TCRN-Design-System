// ShellPins reordering (TCRN-DS-SUB-149; STORY-140 GWT3, STORY-137): a drag moves the dragged item
// in place among the others and hands the new order over when it is let go; Alt+← and Alt+→ move
// the focused item one place. jsdom lays nothing out, so each pinned item gets a box from its place
// in the band: 90 wide, 100 apart, its middle at 45, 145, 245 and 345.
import test from "node:test";
import assert from "node:assert/strict";
import { act, useState } from "react";
import { ProductShell, ShellPins, type ProductShellNavGroup, type ShellPinItem } from "../index.js";
import { createDomInteractionHarness, type DomInteractionHarness } from "./dom-harness.js";

const pins: readonly ShellPinItem[] = [
  { id: "roster", label: "名册", href: "#roster" },
  { id: "contracts", label: "合约", hasMenu: true },
  { id: "billing", label: "结算单", href: "#billing" },
  { id: "schedule", label: "排期", hasMenu: true }
];

function Band({ orders, opens }: { orders: string[][]; opens: (string | null)[] }) {
  const [items, setItems] = useState(pins);
  return (
    <ShellPins
      items={items}
      locale="zh-CN"
      onOpenChange={(id) => opens.push(id)}
      onPinsReorder={(ids) => {
        orders.push([...ids]);
        setItems(ids.map((id) => items.find((item) => item.id === id)).filter((item): item is ShellPinItem => item !== undefined));
      }}
    />
  );
}

function layOutPins(harness: DomInteractionHarness) {
  const original = harness.window.HTMLElement.prototype.getBoundingClientRect;
  harness.window.HTMLElement.prototype.getBoundingClientRect = function (this: HTMLElement) {
    if (!this.hasAttribute("data-pin") || !this.parentElement) return original.call(this);
    const left = Array.from(this.parentElement.children).indexOf(this) * 100;
    return { left, right: left + 90, width: 90, top: 0, bottom: 32, height: 32, x: left, y: 0, toJSON: () => ({}) } as DOMRect;
  };
}

const bandOrder = (harness: DomInteractionHarness) =>
  [...harness.document.querySelectorAll("[data-pins] > [data-pin]")].map((pin) => pin.getAttribute("data-pin"));
const pinItem = (harness: DomInteractionHarness, id: string) =>
  harness.document.querySelector(`[data-pin="${id}"] .tcrn-shell-pins__item`) as HTMLElement;

function pointer(harness: DomInteractionHarness, type: string, clientX: number) {
  return new harness.window.MouseEvent(type, { bubbles: true, cancelable: true, clientX, clientY: 16, button: 0 });
}

async function dispatch(...steps: [EventTarget, Event][]) {
  await act(async () => {
    for (const [target, event] of steps) target.dispatchEvent(event);
  });
}

async function altKey(harness: DomInteractionHarness, target: HTMLElement, key: string, alt = true) {
  const event = new harness.window.KeyboardEvent("keydown", { key, altKey: alt, bubbles: true, cancelable: true });
  await dispatch([target, event]);
  return event;
}

test("a drag moves the dragged item in place among the others, hands the order over when let go, and the release opens nothing (TCRN-DS-SUB-149)", async () => {
  const harness = createDomInteractionHarness();
  try {
    layOutPins(harness);
    const orders: string[][] = [];
    const opens: (string | null)[] = [];
    await harness.render(<Band orders={orders} opens={opens} />);
    const nav = harness.document.querySelector("[data-pins]") as HTMLElement;
    const doc = harness.document;

    await dispatch([pinItem(harness, "contracts"), pointer(harness, "pointerdown", 145)], [doc, pointer(harness, "pointermove", 147)]);
    assert.equal(pinItem(harness, "contracts").hasAttribute("data-pin-dragging"), false, "within the threshold it is still a press");
    await dispatch([doc, pointer(harness, "pointermove", 260)]);
    assert.deepEqual(bandOrder(harness), ["roster", "billing", "contracts", "schedule"], "past billing's middle it takes billing's place");
    assert.ok(pinItem(harness, "contracts").hasAttribute("data-pin-dragging"));
    // In place: no insertion line, no ghost, no handle; the band holds its four items and nothing else.
    assert.equal(nav.children.length, 4);
    assert.ok([...nav.children].every((pin) => pin.children.length === 1 && pin.hasAttribute("data-pin")));
    assert.deepEqual(orders, [], "nothing is handed over while the drag is on");
    await dispatch([doc, pointer(harness, "pointermove", 30)]);
    assert.deepEqual(bandOrder(harness), ["contracts", "roster", "billing", "schedule"]);

    // The release, and the click it makes on the item: the order is handed over, the drop-down stays shut.
    const click = new harness.window.MouseEvent("click", { bubbles: true, cancelable: true });
    await dispatch([doc, pointer(harness, "pointerup", 30)], [pinItem(harness, "contracts"), click]);
    assert.deepEqual(orders, [["contracts", "roster", "billing", "schedule"]]);
    assert.deepEqual(opens, []);
    assert.equal(click.defaultPrevented, true);
    assert.equal(pinItem(harness, "contracts").hasAttribute("data-pin-dragging"), false);
    assert.deepEqual(bandOrder(harness), ["contracts", "roster", "billing", "schedule"]);

    // A press that does not travel is a click; a drag let go where it began hands nothing over.
    await dispatch([pinItem(harness, "contracts"), pointer(harness, "pointerdown", 45)], [doc, pointer(harness, "pointerup", 46)]);
    await harness.dispatchClick(pinItem(harness, "contracts"));
    assert.deepEqual(opens, ["contracts"]);
    await dispatch(
      [pinItem(harness, "billing"), pointer(harness, "pointerdown", 245)],
      [doc, pointer(harness, "pointermove", 330)],
      [doc, pointer(harness, "pointermove", 240)],
      [doc, pointer(harness, "pointerup", 240)]
    );
    assert.equal(orders.length, 1);
    // A cancelled drag hands nothing over and the band goes back to the given order.
    await dispatch([pinItem(harness, "roster"), pointer(harness, "pointerdown", 145)], [doc, pointer(harness, "pointermove", 360)]);
    assert.deepEqual(bandOrder(harness), ["contracts", "billing", "schedule", "roster"]);
    await dispatch([doc, pointer(harness, "pointercancel", 360)]);
    assert.deepEqual(bandOrder(harness), ["contracts", "roster", "billing", "schedule"]);
    assert.equal(orders.length, 1);
  } finally {
    await harness.cleanup();
  }
});

test("Alt+← and Alt+→ move the focused item one place and focus stays on it; at the band's end it stays and the key does nothing else (TCRN-DS-SUB-149)", async () => {
  const harness = createDomInteractionHarness();
  try {
    const orders: string[][] = [];
    await harness.render(<Band orders={orders} opens={[]} />);
    for (const id of ["roster", "contracts"]) assert.equal(pinItem(harness, id).getAttribute("aria-keyshortcuts"), "Alt+ArrowLeft Alt+ArrowRight");

    pinItem(harness, "billing").focus();
    const left = await altKey(harness, pinItem(harness, "billing"), "ArrowLeft");
    assert.equal(left.defaultPrevented, true, "Alt+← moves the item and does not go back a page");
    assert.deepEqual(orders, [["roster", "billing", "contracts", "schedule"]]);
    assert.deepEqual(bandOrder(harness), ["roster", "billing", "contracts", "schedule"]);
    assert.equal(harness.document.activeElement, pinItem(harness, "billing"));
    await altKey(harness, pinItem(harness, "billing"), "ArrowRight");
    await altKey(harness, pinItem(harness, "billing"), "ArrowRight");
    assert.deepEqual(bandOrder(harness), ["roster", "contracts", "schedule", "billing"]);
    assert.equal(harness.document.activeElement, pinItem(harness, "billing"));

    const end = await altKey(harness, pinItem(harness, "billing"), "ArrowRight");
    assert.equal(end.defaultPrevented, true);
    assert.equal(orders.length, 3, "at the end of the band it stays");
    const plain = await altKey(harness, pinItem(harness, "billing"), "ArrowLeft", false);
    assert.equal(plain.defaultPrevented, false, "without Alt the arrows are not the band's");
    assert.equal(orders.length, 3);
  } finally {
    await harness.cleanup();
  }
});

const groups: ProductShellNavGroup[] = ["g1", "g2", "g3"].map((id) => ({
  id,
  label: id.toUpperCase(),
  items: [{ id: `${id}-page`, label: `${id.toUpperCase()} page`, href: `/${id}` }]
}));

test("ProductShell hands the pins' whole order over, and an id its menu model does not hold keeps its place (TCRN-DS-SUB-149)", async () => {
  const harness = createDomInteractionHarness();
  try {
    const orders: string[][] = [];
    await harness.render(
      <ProductShell
        productName="TCRN TMS"
        moduleName="Talent"
        brandProductId="tms"
        currentRouteLabel="Roster"
        pageHeader={{ title: "Roster" }}
        navGroups={groups}
        locales={[{ locale: "en", nativeName: "English" }]}
        currentLocale="en"
        pinnedIds={["g1", "gone", "g2", "g3"]}
        onPinsReorder={(ids) => orders.push([...ids])}
      >
        <p>page</p>
      </ProductShell>
    );
    assert.deepEqual(bandOrder(harness), ["g1", "g2", "g3"]);
    await altKey(harness, pinItem(harness, "g1"), "ArrowRight");
    assert.deepEqual(orders, [["g2", "gone", "g1", "g3"]]);
  } finally {
    await harness.cleanup();
  }
});
