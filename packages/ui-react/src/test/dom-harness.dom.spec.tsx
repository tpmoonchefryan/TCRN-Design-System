import test from "node:test";
import assert from "node:assert/strict";
import { act, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button, ClipboardCopyButton, Text, type ClipboardCopyState } from "../index.js";
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

async function flushReactUpdates() {
  await act(async () => {
    await Promise.resolve();
  });
}

function installClipboardStub(
  harness: ReturnType<typeof createDomInteractionHarness>,
  writeText: (value: string) => Promise<void>
) {
  Object.defineProperty(harness.window.navigator, "clipboard", {
    configurable: true,
    value: { writeText }
  });
}

test("clipboard copy button writes only after explicit click and keeps copied text out of callbacks", async () => {
  const harness = createDomInteractionHarness();
  const calls: string[] = [];
  const states: ClipboardCopyState[] = [];

  installClipboardStub(harness, async (value) => {
    calls.push(value);
  });

  try {
    await harness.render(
      <ClipboardCopyButton
        text="tenant-secret-42"
        ariaLabel="Copy tenant ID"
        idleLabel="Copy ID"
        onCopyStateChange={(state) => states.push(state)}
      />
    );

    const button = harness.document.querySelector("button");
    assert.ok(button instanceof harness.window.HTMLButtonElement);
    button.focus();
    button.dispatchEvent(new harness.window.MouseEvent("mouseover", { bubbles: true }));
    await flushReactUpdates();

    assert.deepEqual(calls, []);
    assert.deepEqual(states, []);

    await harness.dispatchClick(button);
    await flushReactUpdates();

    assert.deepEqual(calls, ["tenant-secret-42"]);
    assert.deepEqual(states, ["copying", "copied"]);
    assert.equal(harness.document.activeElement, button);
    assert.match(button.textContent ?? "", /Copied/);
    assert.equal(states.some((state) => state === "tenant-secret-42"), false);
    assert.doesNotMatch(button.outerHTML, /tenant-secret-42/);
  } finally {
    await harness.cleanup();
  }
});

test("clipboard copy button fails closed when clipboard write is unsupported or rejected", async () => {
  const unsupportedHarness = createDomInteractionHarness();
  const unsupportedStates: ClipboardCopyState[] = [];

  Object.defineProperty(unsupportedHarness.window.navigator, "clipboard", {
    configurable: true,
    value: undefined
  });

  try {
    await unsupportedHarness.render(
      <ClipboardCopyButton
        text="copy-me"
        ariaLabel="Copy fixture value"
        onCopyStateChange={(state) => unsupportedStates.push(state)}
      />
    );
    const button = unsupportedHarness.document.querySelector("button");
    assert.ok(button instanceof unsupportedHarness.window.HTMLButtonElement);

    await unsupportedHarness.dispatchClick(button);
    await flushReactUpdates();

    assert.deepEqual(unsupportedStates, ["unsupported"]);
    assert.match(button.textContent ?? "", /Copy unavailable/);
  } finally {
    await unsupportedHarness.cleanup();
  }

  const rejectedHarness = createDomInteractionHarness();
  const rejectedStates: ClipboardCopyState[] = [];

  installClipboardStub(rejectedHarness, async () => {
    throw new Error("permission denied");
  });

  try {
    await rejectedHarness.render(
      <ClipboardCopyButton
        text="copy-me"
        ariaLabel="Copy fixture value"
        onCopyStateChange={(state) => rejectedStates.push(state)}
      />
    );
    const button = rejectedHarness.document.querySelector("button");
    assert.ok(button instanceof rejectedHarness.window.HTMLButtonElement);

    await rejectedHarness.dispatchClick(button);
    await flushReactUpdates();

    assert.deepEqual(rejectedStates, ["copying", "failed"]);
    assert.match(button.textContent ?? "", /Copy failed/);
  } finally {
    await rejectedHarness.cleanup();
  }
});

test("clipboard copy button disabled state blocks clipboard writes", async () => {
  const harness = createDomInteractionHarness();
  const calls: string[] = [];
  installClipboardStub(harness, async (value) => {
    calls.push(value);
  });

  try {
    await harness.render(
      <ClipboardCopyButton
        text="blocked-value"
        ariaLabel="Copy blocked value"
        disabledReason="Requires owning product permission"
      />
    );

    const button = harness.document.querySelector("button");
    assert.ok(button instanceof harness.window.HTMLButtonElement);
    assert.equal(button.disabled, true);

    await harness.dispatchClick(button);
    await flushReactUpdates();

    assert.deepEqual(calls, []);
    assert.match(button.outerHTML, /Requires owning product permission/);
    assert.doesNotMatch(button.outerHTML, /blocked-value/);
  } finally {
    await harness.cleanup();
  }
});
