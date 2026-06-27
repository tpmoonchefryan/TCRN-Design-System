import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { DetailDrawer, Popover, Dialog, ConfirmActionDialog, Tooltip } from "./Overlay.js";

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
