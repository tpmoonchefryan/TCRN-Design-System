import test from "node:test";
import assert from "node:assert/strict";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button, Text } from "../index.js";
import { createDomInteractionHarness } from "./dom-harness.js";

interface HarnessFixtureProps {
  portalRoot: HTMLElement;
}

function HarnessFixture({ portalRoot }: HarnessFixtureProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
      return;
    }
    triggerRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    portalRoot.ownerDocument.addEventListener("keydown", onKeyDown);
    return () => portalRoot.ownerDocument.removeEventListener("keydown", onKeyDown);
  }, [open, portalRoot]);

  return (
    <>
      <Button ref={triggerRef} onClick={() => setOpen(true)}>
        Open harness
      </Button>
      <Text>{open ? "Harness open" : "Harness closed"}</Text>
      {open
        ? createPortal(
            <section data-dom-harness-panel="true" ref={panelRef} tabIndex={-1}>
              <Text>Portal surface</Text>
              <Button onClick={() => setOpen(false)}>Close harness</Button>
            </section>,
            portalRoot
          )
        : null}
    </>
  );
}

test("DOM interaction harness mounts ui-react primitives and supports portal focus plus keyboard close", async () => {
  const harness = createDomInteractionHarness();
  try {
    await harness.render(<HarnessFixture portalRoot={harness.portalRoot} />);

    const trigger = harness.document.querySelector("button");
    assert.ok(trigger instanceof harness.window.HTMLButtonElement);
    assert.match(harness.document.body.textContent ?? "", /Harness closed/);

    await harness.dispatchClick(trigger);

    const panel = harness.document.querySelector("[data-dom-harness-panel='true']");
    assert.ok(panel instanceof harness.window.HTMLElement);
    assert.match(harness.document.body.textContent ?? "", /Portal surface/);
    assert.equal(harness.document.activeElement, panel);

    await harness.dispatchKeydown(harness.document, "Escape");

    assert.equal(harness.document.querySelector("[data-dom-harness-panel='true']"), null);
    assert.match(harness.document.body.textContent ?? "", /Harness closed/);
    assert.equal(harness.document.activeElement, trigger);
  } finally {
    await harness.cleanup();
  }
});
