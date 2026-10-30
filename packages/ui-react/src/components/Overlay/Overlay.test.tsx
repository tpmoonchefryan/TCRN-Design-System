import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { DetailDrawer, Popover, Dialog, ConfirmActionDialog, Tooltip, Menu } from "./Overlay.js";

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
