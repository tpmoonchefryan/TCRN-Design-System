import { useRef, useState } from "react";
import {
  Button,
  ConfirmActionDialog,
  Dialog,
  Heading,
  Icon,
  Popover,
  StatusBadge,
  Text
} from "@tcrn/ui-react";

function OverlayFocusFixture() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="alpha-overlay-demo">
      <Button ref={triggerRef} type="button" onClick={() => setOpen(true)}>
        Open confirmation
      </Button>
      <Dialog
        title="Synthetic confirmation"
        open={open}
        triggerRef={triggerRef}
        initialFocusRef={closeRef}
        onOpenChange={setOpen}
        className="alpha-overlay-demo__dialog"
      >
        <Text>Fixture-only confirmation. Product adoption, package publication, and release proof are not claimed.</Text>
        <Button type="button" variant="danger" disabled disabledReason="Publication is not routed">
          Publish
        </Button>
        <Button ref={closeRef} type="button" onClick={() => {
          setOpen(false);
          requestAnimationFrame(() => triggerRef.current?.focus());
        }}>
          Close
        </Button>
      </Dialog>
    </section>
  );
}

function OverlayModeMatrix() {
  return (
    <section className="tcrn-overlay-mode-matrix" data-overlay-mode-matrix="true">
      <div className="tcrn-overlay-mode-matrix__intro">
        <Heading level={3}>Overlay mode matrix</Heading>
        <Text>Choose the smallest layer that fits the task: anchored popovers for local context, dialogs for modal confirmation, and drawers for structural panels.</Text>
      </div>
      <div className="tcrn-overlay-mode-grid">
        <div className="tcrn-overlay-mode-card">
          <Icon name="external-link" />
          <div>
            <Heading level={3}>Dialog</Heading>
            <Text>Modal confirmation with focus entry, Escape close, and focus return when the owning route wires those props.</Text>
          </div>
        </div>
        <div className="tcrn-overlay-mode-card">
          <Icon name="info" />
          <div>
            <Heading level={3}>Popover</Heading>
            <Text>Anchored, non-modal surface for nearby context or lightweight choices; it must not pretend to be a blocking dialog.</Text>
          </div>
        </div>
        <div className="tcrn-overlay-mode-card">
          <Icon name="panel-left-open" />
          <div>
            <Heading level={3}>Drawer</Heading>
            <Text>Structural side panel for inspection or action groups; it is complementary, not aria-modal.</Text>
          </div>
        </div>
      </div>
    </section>
  );
}

function DialogSpecFixture() {
  const triggerRef = { current: null };
  const closeRef = { current: null };

  return (
    <section
      className="tcrn-dialog-spec-fixture"
      data-dialog-proof="escape-focus-return"
      data-dialog-escape-close="requires-on-open-change"
      data-dialog-focus-return="requires-trigger-ref"
      data-dialog-tab-containment="not-claimed"
    >
      <div className="tcrn-dialog-spec-fixture__header">
        <div className="tcrn-dialog-spec-fixture__summary">
          <Heading level={3}>Interactive proof fixture</Heading>
          <Text>Open the fixture to verify focus entry, Escape close, and focus return without claiming Tab containment.</Text>
        </div>
        <StatusBadge state={{ state: "local_only" }} />
      </div>
      <div className="tcrn-dialog-spec-fixture__actions">
        <Button
          type="button"
          aria-controls="dialog-spec-fixture-panel"
          aria-expanded="false"
          data-dialog-fixture-open
        >
          Open confirmation
        </Button>
      </div>
      <div id="dialog-spec-fixture-panel" data-dialog-fixture-panel data-overlay-transition-state="closed" hidden>
        <Dialog
          title="Synthetic confirmation"
          open
          triggerRef={triggerRef}
          initialFocusRef={closeRef}
          onOpenChange={() => undefined}
          className="tcrn-dialog-spec-fixture__dialog"
        >
          <Text>Fixture-only confirmation. Product adoption, package publication, and release proof are not claimed.</Text>
          <div className="tcrn-dialog-spec-fixture__dialog-actions">
            <Button type="button" variant="danger" disabled disabledReason="Publication is not routed">
              Publish
            </Button>
            <Button type="button" data-dialog-fixture-close>
              Close
            </Button>
          </div>
        </Dialog>
      </div>
    </section>
  );
}

function PopoverSpecFixture() {
  const triggerRef = { current: null };
  const closeRef = { current: null };

  return (
    <section
      className="tcrn-dialog-spec-fixture tcrn-popover-spec-fixture"
      data-popover-proof="anchored-close-return"
      data-popover-escape-close="requires-on-open-change"
      data-popover-focus-return="requires-trigger-ref"
      data-popover-tab-containment="not-claimed"
    >
      <div className="tcrn-dialog-spec-fixture__header">
        <div className="tcrn-dialog-spec-fixture__summary">
          <Heading level={3}>Popover proof fixture</Heading>
          <Text>Open the popover to verify anchored expansion, Escape close, and focus return without claiming modal behavior.</Text>
        </div>
        <StatusBadge state={{ state: "local_only" }} />
      </div>
      <div className="tcrn-dialog-spec-fixture__actions">
        <Button
          type="button"
          aria-controls="popover-spec-fixture-panel"
          aria-expanded="false"
          data-popover-fixture-open
        >
          Open popover
        </Button>
      </div>
      <div id="popover-spec-fixture-panel" data-popover-fixture-panel data-overlay-transition-state="closed" hidden>
        <Popover
          title="Anchored context"
          open
          triggerRef={triggerRef}
          initialFocusRef={closeRef}
          onOpenChange={() => undefined}
          className="tcrn-popover-spec-fixture__popover"
        >
          <Text>This popover is non-modal and stays scoped to the triggering context.</Text>
          <div className="tcrn-dialog-spec-fixture__dialog-actions">
            <Button type="button" data-popover-fixture-close>
              Close
            </Button>
          </div>
        </Popover>
      </div>
    </section>
  );
}

function OverlayStaticModes() {
  return (
    <section className="tcrn-overlay-static-modes" data-overlay-static-modes="true">
      <div className="tcrn-overlay-static-card">
        <Heading level={3}>Confirm action dialog</Heading>
        <ConfirmActionDialog
          title="Blocked action"
          message="No publication route exists."
          confirmLabel="Publish"
          cancelLabel="Close"
          disabled
        />
      </div>
    </section>
  );
}

export { DialogSpecFixture, OverlayFocusFixture, OverlayModeMatrix, OverlayStaticModes, PopoverSpecFixture };
