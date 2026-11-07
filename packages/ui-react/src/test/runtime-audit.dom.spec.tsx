import test from "node:test";
import assert from "node:assert/strict";
import { act, useRef } from "react";
import { ClipboardCopyButton, DataGrid, Dialog, Menu, ProductShell, RadioGroup, SettingChoice, ShellPins, Tree, mountStaticClipboardCopyButton } from "../index.js";
import { createDomInteractionHarness } from "./dom-harness.js";

test("clipboard completion after unmount does not emit state or create another reset timer", async () => {
  const harness = createDomInteractionHarness();
  const states: string[] = [];
  let finish!: () => void;
  Object.defineProperty(harness.window.navigator, "clipboard", {
    configurable: true,
    value: { writeText: () => new Promise<void>((resolve) => { finish = resolve; }) }
  });
  try {
    await harness.render(<ClipboardCopyButton text="customer-id" ariaLabel="Copy identifier" onCopyStateChange={(state) => states.push(state)} />);
    await harness.dispatchClick(harness.document.querySelector("button")!);
    assert.deepEqual(states, ["copying"]);
    await harness.render(<p>Route changed</p>);
    await act(async () => { finish(); });
    assert.deepEqual(states, ["copying"], "a retired component must not report completion to its previous consumer");
  } finally {
    await harness.cleanup();
  }
});

test("a previous clipboard reset cannot end a later pending copy", async () => {
  const harness = createDomInteractionHarness();
  const pending: (() => void)[] = [];
  Object.defineProperty(harness.window.navigator, "clipboard", {
    configurable: true,
    value: { writeText: () => new Promise<void>((resolve) => pending.push(resolve)) }
  });
  try {
    await harness.render(<ClipboardCopyButton text="customer-id" ariaLabel="Copy identifier" resetDelayMs={20} />);
    const button = harness.document.querySelector("button")!;
    await harness.dispatchClick(button);
    await act(async () => { pending.shift()!(); });
    assert.equal(button.getAttribute("data-clipboard-copy-state"), "copied");
    await harness.dispatchClick(button);
    await act(async () => { await new Promise((resolve) => setTimeout(resolve, 50)); });
    assert.equal(button.getAttribute("data-clipboard-copy-state"), "copying");
    await act(async () => { pending.shift()!(); });
    assert.equal(button.getAttribute("data-clipboard-copy-state"), "copied");
  } finally {
    await harness.cleanup();
  }
});

test("the static clipboard bridge also retires a previous result timer before a new copy", async () => {
  const harness = createDomInteractionHarness();
  const pending: (() => void)[] = [];
  Object.defineProperty(harness.window.navigator, "clipboard", {
    configurable: true,
    value: { writeText: () => new Promise<void>((resolve) => pending.push(resolve)) }
  });
  const button = harness.document.createElement("button");
  button.innerHTML = '<span class="tcrn-button__label">Copy</span><span role="status" aria-live="polite"></span>';
  button.setAttribute("data-clipboard-text", "customer-id");
  button.setAttribute("data-clipboard-reset-delay-ms", "20");
  harness.document.body.append(button);
  const bridge = mountStaticClipboardCopyButton({ root: button });
  try {
    await harness.dispatchClick(button);
    await act(async () => { pending.shift()!(); });
    await harness.dispatchClick(button);
    await act(async () => { await new Promise((resolve) => setTimeout(resolve, 50)); });
    assert.equal(button.getAttribute("data-clipboard-copy-state"), "copying");
    await act(async () => { pending.shift()!(); });
    assert.equal(button.getAttribute("data-clipboard-copy-state"), "copied");
  } finally {
    bridge.destroy();
    await harness.cleanup();
  }
});

const choices = [{ value: "active", label: "Active", minInlineSize: 112 }, { value: "inactive", label: "Inactive", minInlineSize: 112 }];

test("uncontrolled radio reset restores the default and the next change still reaches the consumer", async () => {
  const harness = createDomInteractionHarness();
  const changes: string[] = [];
  try {
    await harness.render(<form><RadioGroup legend="Status" name="status" options={choices} defaultValue="active" onChange={(value) => changes.push(value)} /></form>);
    const form = harness.document.querySelector("form")!;
    const inactive = harness.document.querySelector('input[value="inactive"]') as HTMLInputElement;
    await harness.dispatchClick(inactive);
    await act(async () => { form.reset(); });
    assert.equal(new harness.window.FormData(form).get("status"), "active");
    await harness.dispatchClick(inactive);
    assert.deepEqual(changes, ["inactive", "inactive"]);
  } finally {
    await harness.cleanup();
  }
});

test("SettingChoice resets one value across its radio and select presentations", async () => {
  const harness = createDomInteractionHarness();
  const render = (width: number) => harness.render(<form><SettingChoice label="Status" name="status" options={choices} defaultValue="active" availableInlineSize={width} /></form>);
  try {
    await render(500);
    await harness.dispatchClick(harness.document.querySelector('input[value="inactive"]')!);
    await act(async () => { harness.document.querySelector("form")!.reset(); });
    await render(100);
    assert.equal((harness.document.querySelector("select") as HTMLSelectElement).value, "active");
  } finally {
    await harness.cleanup();
  }
});

test("command-menu arrows move actual focus and leave an outside field's arrows alone", async () => {
  const harness = createDomInteractionHarness();
  try {
    await harness.render(<><input aria-label="Outside" /><Menu open label="Actions" items={[{ id: "first", label: "First" }, { id: "disabled", label: "Disabled", disabled: true }, { id: "last", label: "Last" }]} /></>);
    const first = harness.document.querySelector('[role="menuitem"]') as HTMLButtonElement;
    await act(async () => { first.focus(); });
    await harness.dispatchKeydown(first, "ArrowDown");
    assert.equal(harness.document.activeElement?.textContent, "Last");
    const input = harness.document.querySelector("input")!;
    await act(async () => { input.focus(); });
    const event = new harness.window.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true });
    await act(async () => { input.dispatchEvent(event); });
    assert.equal(event.defaultPrevented, false);
  } finally {
    await harness.cleanup();
  }
});

function DialogFixture({ revision }: { revision: number }) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  return <><button ref={triggerRef}>Open</button><Dialog open title="Confirm change" triggerRef={triggerRef} onOpenChange={() => undefined}><button>Cancel</button><button data-confirm="">Confirm {revision}</button></Dialog></>;
}

test("an open dialog keeps the reader's focus across a consumer rerender", async () => {
  const harness = createDomInteractionHarness();
  try {
    await harness.render(<DialogFixture revision={1} />);
    const confirm = harness.document.querySelector("[data-confirm]") as HTMLButtonElement;
    await act(async () => { confirm.focus(); });
    await harness.render(<DialogFixture revision={2} />);
    assert.equal(harness.document.activeElement === confirm, true, "rerender must not refocus the dialog root");
  } finally {
    await harness.cleanup();
  }
});

test("retiring a pin list during a drag cancels the stale reorder", async () => {
  const harness = createDomInteractionHarness();
  const changes: string[][] = [];
  const reorder = (ids: readonly string[]) => changes.push([...ids]);
  try {
    await harness.render(<ShellPins items={[{ id: "one", label: "One", href: "#one" }, { id: "two", label: "Two", href: "#two" }]} onPinsReorder={reorder} />);
    const pointer = (type: string, x: number) => new harness.window.MouseEvent(type, { bubbles: true, button: 0, clientX: x, clientY: 10 });
    await act(async () => {
      harness.document.querySelector("a")!.dispatchEvent(pointer("pointerdown", 1));
      harness.document.dispatchEvent(pointer("pointermove", 100));
    });
    await harness.render(<ShellPins items={[]} onPinsReorder={reorder} />);
    await act(async () => { harness.document.dispatchEvent(pointer("pointerup", 100)); });
    assert.deepEqual(changes, []);
  } finally {
    await harness.cleanup();
  }
});

test("tree expansion is reachable from the keyboard without the hidden toggle", async () => {
  const harness = createDomInteractionHarness();
  const changes: string[] = [];
  try {
    await harness.render(<Tree label="Customers" nodes={[{ id: "group", label: "Customers", children: [{ id: "list", label: "List" }] }]} onToggle={(id) => changes.push(id)} />);
    const row = harness.document.querySelector('[role="treeitem"]') as HTMLElement;
    await act(async () => { row.focus(); });
    await harness.dispatchKeydown(row, "ArrowRight");
    assert.deepEqual(changes, ["group"]);
    assert.equal(row.tabIndex, 0);
  } finally {
    await harness.cleanup();
  }
});

test("data grid arrows reach a neighboring cell while embedded fields keep their own keys", async () => {
  const harness = createDomInteractionHarness();
  try {
    await harness.render(<DataGrid label="Customers" columns={[{ id: "name", header: "Name" }, { id: "status", header: "Status" }]} rows={[{ id: "one", cells: ["One", <input aria-label="Status" />] }]} />);
    const cells = harness.document.querySelectorAll<HTMLElement>('[role="gridcell"]');
    await act(async () => { cells[0]!.focus(); });
    await harness.dispatchKeydown(cells[0]!, "ArrowRight");
    assert.equal(harness.document.activeElement === cells[1], true);
    const input = harness.document.querySelector("input")!;
    await act(async () => { input.focus(); });
    const event = new harness.window.KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true });
    await act(async () => { input.dispatchEvent(event); });
    assert.equal(event.defaultPrevented, false);
  } finally {
    await harness.cleanup();
  }
});

test("Next-style link delegation closes an ordinary selection and preserves modified-click navigation", async () => {
  const harness = createDomInteractionHarness({ shellContainerWidth: 1240 });
  const routed: string[] = [];
  try {
    await harness.render(<ProductShell
      productName="TCRN TMS" moduleName="Talent" brandProductId="tms" currentRouteLabel="Customers"
      currentLocale="en" locales={[{ locale: "en", nativeName: "English" }]} pageHeader={{ title: "Customers" }}
      navGroups={[{ id: "talent", label: "Talent", items: [{ id: "customers", label: "Customers", href: "/tenant/example/talent/example/customers" }] }]}
      onClickCapture={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
        if (!link || !link.pathname.startsWith("/tenant/")) return;
        event.preventDefault();
        routed.push(link.pathname);
      }}
    ><p>Customer ledger</p></ProductShell>);
    await harness.dispatchClick(harness.document.querySelector("[data-shell-brand]")!);
    const link = harness.document.querySelector('[data-panel] a[href^="/tenant/"]')!;
    const modified = new harness.window.MouseEvent("click", { bubbles: true, cancelable: true, ctrlKey: true });
    // JSDOM does not implement opening a real URL in another tab. A hash retains
    // the native default for this assertion; the ordinary selection uses the route.
    link.setAttribute("href", "#customers");
    await act(async () => { link.dispatchEvent(modified); });
    assert.equal(modified.defaultPrevented, false);
    assert.equal(harness.document.querySelector(".tcrn-product-shell")?.getAttribute("data-state"), "expanded");
    assert.deepEqual(routed, []);
    link.setAttribute("href", "/tenant/example/talent/example/customers");
    await harness.dispatchClick(link);
    assert.deepEqual(routed, ["/tenant/example/talent/example/customers"]);
    assert.equal(harness.document.querySelector(".tcrn-product-shell")?.getAttribute("data-state"), "closed");
  } finally {
    await harness.cleanup();
  }
});
