// ShellDropdown behaviour (TCRN-DS-SUB-118; STORY-139 GWT1–GWT5): the pinned item opens it at its
// start edge and bottom; a row's next level opens on a click and not on hover; ← returns from the
// cascade to the same row; Esc closes every column and returns focus to the pinned item; the search
// matches only the drop-down's part of the menu; a press outside and a choice close it.
import test from "node:test";
import assert from "node:assert/strict";
import { act, useState } from "react";
import { ShellDropdown, ShellPins, type ShellLayerCloseReason, type ShellMenuItem } from "../index.js";
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

function Band({ closes }: { closes: ShellLayerCloseReason[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <div>
      <ShellPins
        items={[
          { id: "roster", label: "名册", href: "#roster" },
          { id: "contracts", label: "合约", hasMenu: true }
        ]}
        openId={openId}
        onOpenChange={setOpenId}
        menuIdOf={(id) => `drop-${id}`}
        locale="zh-CN"
      />
      <ShellDropdown
        id="drop-contracts"
        source={contracts}
        open={openId === "contracts"}
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

test("the pinned item opens the drop-down at its start edge and bottom; the token gap is the margin above", async () => {
  const harness = createDomInteractionHarness();
  try {
    await harness.render(<Band closes={[]} />);
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
