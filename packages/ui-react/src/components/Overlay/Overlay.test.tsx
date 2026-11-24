import test from "node:test";
import assert from "node:assert/strict";
import { act, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  DetailDrawer,
  Popover,
  Dialog,
  ConfirmActionDialog,
  InlineConfirmBar,
  Tooltip,
  Menu,
  computeFloatingPosition,
  mountStaticOverlayBoundary
} from "./Overlay.js";
import { overlayCss } from "../../styles/overlay.css.js";
import { createDomInteractionHarness } from "../../test/dom-harness.js";

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
  assert.match(interactive, /data-tab-containment="implemented"/);
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

test("tooltip is supplemental, described, and non-interactive", () => {
  const html = renderToStaticMarkup(
    <Tooltip content={"Explains the synthetic icon without replacing its label."} placement="right">
      <button type="button" aria-label="Inspect route">
        Inspect
      </button>
    </Tooltip>
  );

  assert.match(html, /class="tcrn-tooltip"/);
  assert.match(html, /data-tooltip-scope="supplemental"/);
  assert.match(html, /data-tooltip-interactive-content="forbidden"/);
  assert.match(html, /data-placement="right"/);
  assert.match(html, /role="tooltip"/);
  assert.match(html, /aria-describedby="[^"]+"/);
  assert.match(html, /Explains the synthetic icon without replacing its label\./);
  assert.doesNotMatch(html, /dangerouslySetInnerHTML/);
});

test("tooltip preserves existing described-by ids", () => {
  const html = renderToStaticMarkup(
    <Tooltip content="Supplemental route detail">
      <span aria-describedby="existing-id">Synthetic trigger</span>
    </Tooltip>
  );

  assert.match(html, /aria-describedby="existing-id [^"]+"/);
});

test("static tooltip previews keep all four SSR placements, unique descriptions and text-only content", () => {
  const html = renderToStaticMarkup(<>{(["top", "right", "bottom", "left"] as const).map((placement) => (
    <Tooltip key={placement} placement={placement} staticPreview content={`Detail <button>${placement}</button>`}>
      <button type="button" aria-describedby="existing-description">Inspect {placement}</button>
    </Tooltip>
  ))}</>);
  const ids = [...html.matchAll(/role="tooltip"/g)];
  assert.equal(ids.length, 4);
  const descriptions = [...html.matchAll(/aria-describedby="existing-description ([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(descriptions).size, 4);
  for (const id of descriptions) assert.ok(html.includes(`id="${id}" role="tooltip"`));
  assert.equal((html.match(/data-tooltip-open="true"/g) ?? []).length, 8, "wrapper and content share the forced open state");
  assert.equal((html.match(/data-overlay-boundary="inline-static"/g) ?? []).length, 4);
  for (const placement of ["top", "right", "bottom", "left"]) {
    assert.ok(html.includes(`data-placement="${placement}"`));
    assert.ok(html.includes(`data-tooltip-placement="${placement}"`));
    assert.ok(html.includes(`Detail &lt;button&gt;${placement}&lt;/button&gt;`), "content is escaped text, never an interactive descendant");
  }
  assert.doesNotMatch(html, /staticPreview|data-storybook-static-tooltip/);
  const ordinary = renderToStaticMarkup(<Tooltip content="Detail"><button type="button">Inspect</button></Tooltip>);
  assert.doesNotMatch(ordinary, /data-tooltip-open="true"/, "the default remains an ordinary interactive tooltip");
});


// TCRN-DS-STORY-092 batch 3. The declaration flipped, so this asserts the thing the
// declaration now claims. `aria-modal` tells assistive technology the rest of the
// page is inert; it does not stop the browser moving focus there, and a keyboard
// user who tabs out lands in a page their screen reader was told to ignore.
test("STORY-092 a dialog declares tab containment only because it implements it", () => {
  const interactive = renderToStaticMarkup(
    <Dialog title="Modal" open onOpenChange={() => undefined} triggerRef={{ current: null }}>
      <button type="button">One</button>
      <button type="button">Two</button>
    </Dialog>
  );
  assert.match(interactive, /data-tab-containment="implemented"/);
  // The trap is a runtime behaviour and cannot be read out of static markup, so the
  // structural half is asserted here and the browser proof exercises the keys.
  assert.match(interactive, /aria-modal="true"/);
  assert.match(interactive, /tabindex="-1"/);
  // A popover is not a modal and still says so, which is what keeps this pair of
  // declarations meaningful rather than decorative.
  const popover = renderToStaticMarkup(
    <Popover title="P" open onOpenChange={() => undefined} triggerRef={{ current: null }}>body</Popover>
  );
  assert.match(popover, /data-tab-containment="not-implemented"/);
});


test("STORY-092 a menu announces a command list, not a pile of buttons", () => {
  const html = renderToStaticMarkup(
    <Menu label="Row actions" open items={[
      { id: "edit", label: "Edit" },
      { id: "delete", label: "Delete" },
      { id: "archive", label: "Archive", disabled: true }
    ]} />
  );
  assert.match(html, /role="menu"/);
  assert.match(html, /aria-label="Row actions"/);
  assert.equal((html.match(/role="menuitem"/g) ?? []).length, 3);
  // Tab leaves the menu instead of walking it: exactly one item is in the tab order
  // and the arrows move between them.
  assert.equal((html.match(/tabindex="0"/g) ?? []).length, 1);
  assert.equal((html.match(/tabindex="-1"/g) ?? []).length, 2);
});

test("STORY-092 a closed menu renders nothing at all", () => {
  // Not `hidden`, not display:none — a menu left in the tree is a menu a screen
  // reader can still walk into.
  assert.equal(renderToStaticMarkup(<Menu label="x" open={false} items={[{ id: "a", label: "A" }]} />), "");
});

test("STORY-092 the first enabled item is active, so a disabled first item is skipped", () => {
  const html = renderToStaticMarkup(
    <Menu label="x" open items={[{ id: "a", label: "A", disabled: true }, { id: "b", label: "B" }]} />
  );
  assert.match(html, /data-menu-item-active="true"[^>]*>B</);
});

async function flushOverlayEffects() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

test("overlayCss has balanced braces, declared state pairs, and complete overlay family styling", () => {
  assert.equal(overlayCss.includes("\u0060"), false, "overlayCss contains zero backticks");
  let depth = 0;
  for (const ch of overlayCss.replace(/\/\*[\s\S]*?\*\//g, "")) {
    if (ch === "{") depth += 1;
    if (ch === "}") depth -= 1;
    assert.ok(depth >= 0, "overlayCss never closes an unopened block");
  }
  assert.equal(depth, 0, "overlayCss braces are balanced");

  const declaredPairs = new Set([...overlayCss.matchAll(/(--tcrn-pair-[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
  const referencedPairs = [...new Set([...overlayCss.matchAll(/var\((--tcrn-pair-[a-z0-9-]+)/g)].map((m) => m[1]))];
  assert.deepEqual(referencedPairs.filter((name) => !declaredPairs.has(name)), []);

  for (const selector of [
    ".tcrn-menu",
    ".tcrn-menu__item",
    ".tcrn-menu__item-description",
    ".tcrn-popover",
    ".tcrn-tooltip",
    ".tcrn-tooltip__content",
    ".tcrn-dialog-backdrop",
    ".tcrn-dialog",
    ".tcrn-confirm-dialog",
    ".tcrn-inline-confirm-bar",
    ".tcrn-inline-confirm-bar--warning",
    ".tcrn-inline-confirm-bar--danger"
  ]) {
    assert.ok(overlayCss.includes(selector), `overlayCss styles ${selector}`);
  }
  assert.match(overlayCss, /--tcrn-color-bad-bg/);
  assert.match(overlayCss, /--tcrn-color-warn-bg/);
  assert.match(overlayCss, /--tcrn-elevation-s2/);
  assert.match(overlayCss, /--tcrn-elevation-s3/);
});

test("MenuItemDescriptor renders subtitle descriptions and danger tone semantics", () => {
  const html = renderToStaticMarkup(
    <Menu
      label="Adapter actions"
      open
      placement="bottom-end"
      items={[
        { id: "youtube", label: "Connect stream", description: "Read-only live chat adapter" },
        { id: "revoke", label: "Revoke credential", description: "Immediately disconnects output", tone: "danger" },
        { id: "delete", label: "Remove adapter", danger: true }
      ]}
    />
  );

  assert.match(html, /data-placement="bottom-end"/);
  assert.match(html, /tcrn-menu__item--described/);
  assert.match(html, /class="tcrn-menu__item-label">Connect stream<\/span>/);
  assert.match(html, /class="tcrn-menu__item-description">Read-only live chat adapter<\/span>/);
  assert.equal((html.match(/tcrn-menu__item--danger/g) ?? []).length, 2);
  assert.equal((html.match(/data-menu-item-tone="danger"/g) ?? []).length, 2);
});

test("Menu portals to document.body with zero flow displacement, bottom-end 0px right alignment, and focus return", async () => {
  const triggerRect = { left: 820, top: 44, right: 940, bottom: 76, width: 120, height: 32 };
  const menuRect = { left: 0, top: 0, right: 220, bottom: 132, width: 220, height: 132 };

  const computed = computeFloatingPosition(triggerRect, menuRect, "bottom-end", 1240, 800, 8);
  assert.equal(computed.placement, "bottom-end");
  assert.equal(computed.left + menuRect.width - triggerRect.right, 0, "bottom-end aligns right edges with 0px delta");

  const nearEdge = computeFloatingPosition(
    { left: 900, top: 44, right: 1020, bottom: 76, width: 120, height: 32 },
    { left: 0, top: 0, right: 200, bottom: 120, width: 200, height: 120 },
    "bottom-end",
    1024,
    800,
    8
  );
  assert.equal(nearEdge.left + 200 - 1020, 0, "bottom-end preserves 0px right edge alignment near viewport edge");

  function MenuFlowFixture() {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    return (
      <div data-flow-container="">
        <div data-header-row="">
          <button ref={triggerRef} type="button" data-menu-trigger="" onClick={() => setOpen((prev) => !prev)}>
            Add integration
          </button>
          <Menu
            label="Integration types"
            open={open}
            placement="bottom-end"
            triggerRef={triggerRef}
            onOpenChange={setOpen}
            items={[
              { id: "chat", label: "Live chat", description: "Ingest channel events" },
              { id: "obs", label: "Stage overlay", description: "Read-only browser source" },
              { id: "reset", label: "Reset token", tone: "danger" }
            ]}
          />
        </div>
        <div data-below-content="">Following page content</div>
      </div>
    );
  }

  const harness = createDomInteractionHarness();
  try {
    Object.defineProperty(harness.window, "innerWidth", { configurable: true, value: 1240 });
    Object.defineProperty(harness.window, "innerHeight", { configurable: true, value: 800 });

    const originalRect = harness.window.HTMLElement.prototype.getBoundingClientRect;
    harness.window.HTMLElement.prototype.getBoundingClientRect = function () {
      if (this.hasAttribute("data-menu-trigger")) {
        return new harness.window.DOMRect(triggerRect.left, triggerRect.top, triggerRect.width, triggerRect.height);
      }
      if (this.getAttribute("role") === "menu") {
        const left = Number.parseFloat(this.style.left || "0");
        const top = Number.parseFloat(this.style.top || "0");
        return new harness.window.DOMRect(left, top, menuRect.width, menuRect.height);
      }
      if (this.hasAttribute("data-below-content")) {
        const inFlowMenu = this.parentElement?.querySelector('[role="menu"]');
        return new harness.window.DOMRect(24, inFlowMenu ? 220 : 88, 992, 48);
      }
      return originalRect.call(this);
    };

    await harness.render(<MenuFlowFixture />);
    const trigger = harness.document.querySelector("[data-menu-trigger]") as HTMLButtonElement;
    const below = harness.document.querySelector("[data-below-content]") as HTMLElement;
    const beforeTop = below.getBoundingClientRect().top;

    await harness.dispatchClick(trigger);
    await flushOverlayEffects();

    const menu = harness.document.querySelector('[role="menu"]') as HTMLElement;
    assert.ok(menu, "menu opens");
    assert.equal(menu.parentElement, harness.document.body, "menu portals to document.body");
    assert.equal(menu.getAttribute("data-overlay-boundary"), "document-body");
    assert.equal(menu.getAttribute("data-overlay-positioning"), "portal-fixed");
    assert.equal(menu.style.position, "fixed");
    assert.equal(below.getBoundingClientRect().top - beforeTop, 0, "0px displacement of following document-flow content");

    const renderedMenuRect = menu.getBoundingClientRect();
    assert.equal(renderedMenuRect.right - trigger.getBoundingClientRect().right, 0, "rendered menu rightDelta is 0px");

    const items = [...menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')];
    assert.equal(harness.document.activeElement, items[0], "first enabled item receives initial focus");

    await harness.dispatchKeydown(items[0], "End");
    assert.equal(harness.document.activeElement, items[2], "End jumps to last item");

    await harness.dispatchKeydown(items[2], "Home");
    assert.equal(harness.document.activeElement, items[0], "Home jumps to first item");

    await harness.dispatchKeydown(items[0], "Escape");
    await flushOverlayEffects();
    assert.equal(harness.document.querySelector('[role="menu"]'), null, "Escape closes menu");
    assert.equal(harness.document.activeElement, trigger, "Escape restores focus to trigger");
  } finally {
    await harness.cleanup();
  }
});

test("mountStaticOverlayBoundary supports static menu bottom-end positioning, arrow roving, and Escape focus restore", async () => {
  const harness = createDomInteractionHarness();
  try {
    Object.defineProperty(harness.window, "innerWidth", { configurable: true, value: 1240 });
    Object.defineProperty(harness.window, "innerHeight", { configurable: true, value: 800 });

    const originalRect = harness.window.HTMLElement.prototype.getBoundingClientRect;
    harness.window.HTMLElement.prototype.getBoundingClientRect = function () {
      if (this.id === "static-menu-trigger") {
        return new harness.window.DOMRect(800, 36, 120, 32);
      }
      if (this.id === "static-menu-layer") {
        const left = Number.parseFloat(this.style.left || "0");
        const top = Number.parseFloat(this.style.top || "0");
        return new harness.window.DOMRect(left, top, 200, 96);
      }
      return originalRect.call(this);
    };

    await harness.render(
      <div>
        <button id="static-menu-trigger" type="button">Actions</button>
        <div id="static-menu-layer" role="menu" className="tcrn-menu" hidden>
          <button type="button" role="menuitem" className="tcrn-menu__item">Inspect</button>
          <button type="button" role="menuitem" className="tcrn-menu__item">Revoke</button>
        </div>
      </div>
    );

    const trigger = harness.document.querySelector("#static-menu-trigger") as HTMLButtonElement;
    const layer = harness.document.querySelector("#static-menu-layer") as HTMLElement;
    const boundary = mountStaticOverlayBoundary({ trigger, layer, kind: "menu", placement: "bottom-end", gap: 6 });

    await harness.dispatchClick(trigger);
    assert.equal(layer.parentElement, harness.document.body);
    assert.equal(layer.hidden, false);
    assert.equal(layer.getBoundingClientRect().right - trigger.getBoundingClientRect().right, 0);

    const menuItems = [...layer.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')];
    assert.equal(harness.document.activeElement, menuItems[0]);
    await harness.dispatchKeydown(menuItems[0], "ArrowDown");
    assert.equal(harness.document.activeElement, menuItems[1]);

    await harness.dispatchKeydown(menuItems[1], "Escape");
    assert.equal(layer.hidden, true);
    assert.equal(harness.document.activeElement, trigger);
    boundary.destroy();
  } finally {
    await harness.cleanup();
  }
});

test("ConfirmActionDialog defaults focus to Cancel, traps Tab loop, and restores focus on Escape or Cancel", async () => {
  let confirmed = 0;
  let cancelled = 0;

  function ConfirmDialogFixture() {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    return (
      <div>
        <button ref={triggerRef} type="button" data-open-confirm="" onClick={() => setOpen(true)}>
          Delete record
        </button>
        <ConfirmActionDialog
          title="Delete record"
          message="This removes the selected record permanently."
          confirmLabel="Delete"
          cancelLabel="Keep record"
          open={open}
          triggerRef={triggerRef}
          onOpenChange={setOpen}
          onConfirm={() => {
            confirmed += 1;
            setOpen(false);
          }}
          onCancel={() => {
            cancelled += 1;
          }}
        />
      </div>
    );
  }

  const harness = createDomInteractionHarness();
  try {
    await harness.render(<ConfirmDialogFixture />);
    const trigger = harness.document.querySelector("[data-open-confirm]") as HTMLButtonElement;
    assert.equal(harness.document.querySelector('[role="dialog"]'), null);

    await harness.dispatchClick(trigger);
    await flushOverlayEffects();

    const dialog = harness.document.querySelector('[role="dialog"]') as HTMLElement;
    assert.ok(dialog);
    const buttons = [...dialog.querySelectorAll<HTMLButtonElement>("button")];
    const [cancelBtn, confirmBtn] = buttons;
    assert.equal(harness.document.activeElement, cancelBtn, "Cancel button receives initial focus");

    // Shift+Tab from first wraps to last (Confirm)
    await act(async () => {
      cancelBtn.dispatchEvent(new harness.window.KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true }));
    });
    assert.equal(harness.document.activeElement, confirmBtn, "Shift+Tab wraps from Cancel to Confirm");

    // Tab from last wraps back to first (Cancel)
    await act(async () => {
      confirmBtn.dispatchEvent(new harness.window.KeyboardEvent("keydown", { key: "Tab", shiftKey: false, bubbles: true, cancelable: true }));
    });
    assert.equal(harness.document.activeElement, cancelBtn, "Tab wraps from Confirm to Cancel");

    // Escape closes, fires onCancel, and returns focus to trigger
    await harness.dispatchKeydown(cancelBtn, "Escape");
    await flushOverlayEffects();
    assert.equal(harness.document.querySelector('[role="dialog"]'), null);
    assert.equal(cancelled, 1);
    assert.equal(harness.document.activeElement, trigger, "Escape returns focus to trigger");

    // Reopen and confirm
    await harness.dispatchClick(trigger);
    await flushOverlayEffects();
    const reopenedConfirm = harness.document.querySelectorAll<HTMLButtonElement>('[role="dialog"] button')[1]!;
    await harness.dispatchClick(reopenedConfirm);
    await flushOverlayEffects();
    assert.equal(confirmed, 1);
    assert.equal(harness.document.activeElement, trigger);
  } finally {
    await harness.cleanup();
  }
});

test("InlineConfirmBar focuses Cancel on open, supports warning and danger tones, and restores trigger focus on cancel", async () => {
  const closedHtml = renderToStaticMarkup(
    <InlineConfirmBar
      open={false}
      message="Hidden confirmation"
      confirmLabel="Confirm"
      cancelLabel="Cancel"
    />
  );
  assert.equal(closedHtml, "");

  const warningHtml = renderToStaticMarkup(
    <InlineConfirmBar
      title="Register deletion request"
      message="Verify target subject before submitting."
      confirmLabel="Submit request"
      cancelLabel="Back"
      tone="warning"
      disabled
      disabledReason="Select a verified subject first"
    />
  );
  assert.match(warningHtml, /class="tcrn-inline-confirm-bar tcrn-inline-confirm-bar--warning"/);
  assert.match(warningHtml, /data-tone="warning"/);
  assert.match(warningHtml, /Select a verified subject first/);

  let confirmed = 0;
  let cancelled = 0;

  function InlineConfirmFixture() {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    return (
      <div>
        <button ref={triggerRef} type="button" data-start-inline="" onClick={() => setOpen(true)}>
          Register deletion
        </button>
        <InlineConfirmBar
          open={open}
          title="Confirm deletion request"
          message="Local retained records for this subject will be queued for removal."
          confirmLabel="Confirm deletion"
          cancelLabel="Cancel"
          tone="danger"
          triggerRef={triggerRef}
          onConfirm={() => {
            confirmed += 1;
            setOpen(false);
          }}
          onCancel={() => {
            cancelled += 1;
            setOpen(false);
          }}
        />
      </div>
    );
  }

  const harness = createDomInteractionHarness();
  try {
    await harness.render(<InlineConfirmFixture />);
    const trigger = harness.document.querySelector("[data-start-inline]") as HTMLButtonElement;

    await harness.dispatchClick(trigger);
    await flushOverlayEffects();

    const bar = harness.document.querySelector("[data-inline-confirm-bar='true']") as HTMLElement;
    assert.ok(bar);
    const [cancelBtn, confirmBtn] = [...bar.querySelectorAll<HTMLButtonElement>("button")];
    assert.equal(harness.document.activeElement, cancelBtn, "InlineConfirmBar focuses Cancel on open");

    await harness.dispatchClick(cancelBtn);
    await flushOverlayEffects();
    assert.equal(cancelled, 1);
    assert.equal(harness.document.querySelector("[data-inline-confirm-bar='true']"), null);
    assert.equal(harness.document.activeElement, trigger, "Cancel restores focus to trigger");

    await harness.dispatchClick(trigger);
    await flushOverlayEffects();
    const reopenedConfirm = harness.document.querySelectorAll<HTMLButtonElement>("[data-inline-confirm-bar='true'] button")[1]!;
    assert.ok(reopenedConfirm || confirmBtn);
    await harness.dispatchClick(reopenedConfirm);
    await flushOverlayEffects();
    assert.equal(confirmed, 1);
  } finally {
    await harness.cleanup();
  }
});

test("Dialog portals into document.body backdrop when running in a browser DOM", async () => {
  const harness = createDomInteractionHarness();
  try {
    await harness.render(
      <Dialog title="Centered modal" open>
        <p>Body</p>
      </Dialog>
    );
    await flushOverlayEffects();
    const backdrop = harness.document.body.querySelector(":scope > .tcrn-dialog-backdrop[data-dialog-backdrop]");
    assert.ok(backdrop, "Dialog renders inside document.body > .tcrn-dialog-backdrop");
    assert.ok(backdrop.querySelector(".tcrn-dialog"), "Backdrop contains .tcrn-dialog");
  } finally {
    await harness.cleanup();
  }
});
