import test from "node:test";
import assert from "node:assert/strict";
import { act, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DictionaryTable, Field, MultiSelect, Popover, SuggestInput, Tooltip, mountStaticOverlayBoundary } from "../index.js";
import { createDomInteractionHarness } from "./dom-harness.js";

async function flushEffects() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

function OverlayFixture() {
  const [open, setOpen] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  return (
    <div style={{ overflow: "hidden", inlineSize: "120px", blockSize: "80px" }} data-clipping-ancestor="true">
      <Tooltip content="Long supplemental content stays outside a clipping ancestor." placement="right">
        <button type="button" aria-label="Inspect route">Inspect</button>
      </Tooltip>
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)}>Open context</button>
      <Popover
        title="Anchored context"
        open={open}
        triggerRef={triggerRef}
        initialFocusRef={closeRef}
        onOpenChange={setOpen}
      >
        <button ref={closeRef} type="button">Close context</button>
      </Popover>
    </div>
  );
}

function UnknownDescription() {
  return <span>Rendered only after the custom component runs.</span>;
}

test("STORY-113 client overlays escape clipping ancestors through the document body", async () => {
  const harness = createDomInteractionHarness();
  try {
    await harness.render(<OverlayFixture />);
    await flushEffects();

    const tooltip = harness.document.querySelector("[role='tooltip']");
    const popover = harness.document.querySelector("[data-overlay-scope='popover']");
    assert.ok(tooltip instanceof harness.window.HTMLElement);
    assert.ok(popover instanceof harness.window.HTMLElement);
    assert.equal(tooltip.parentElement, harness.document.body);
    assert.equal(popover.parentElement, harness.document.body);
    assert.equal(tooltip.getAttribute("data-tooltip-portal"), "true");
    assert.equal(tooltip.getAttribute("data-tooltip-open"), null);
    assert.equal(popover.getAttribute("data-overlay-boundary"), "document-body");
    assert.equal(popover.getAttribute("data-overlay-positioning"), "portal-fixed");

    const trigger = harness.document.querySelector("[aria-label='Inspect route']");
    assert.ok(trigger instanceof harness.window.HTMLButtonElement);
    assert.match(trigger.getAttribute("aria-describedby") ?? "", new RegExp(tooltip.id));
    await act(async () => {
      trigger.focus();
    });
    await flushEffects();
    assert.equal(tooltip.getAttribute("data-tooltip-open"), "true");
    await harness.dispatchKeydown(trigger, "Escape");
    await flushEffects();
    assert.equal(tooltip.getAttribute("data-tooltip-open"), null);

    await harness.dispatchKeydown(harness.document, "Escape");
    await flushEffects();
    assert.equal(harness.document.querySelector("[data-overlay-scope='popover']"), null);
  } finally {
    await harness.cleanup();
  }
});

test("STORY-113 static HTML boundary moves a layer and closes Tooltip on Escape", async () => {
  const harness = createDomInteractionHarness();
  try {
    await harness.render(
      <div data-static-clipping="true" style={{ overflow: "hidden" }}>
        <button id="static-trigger" type="button">Help</button>
        <span id="static-layer" role="tooltip" hidden>Static supplemental text</span>
      </div>
    );
    const trigger = harness.document.querySelector("#static-trigger");
    const layer = harness.document.querySelector("#static-layer");
    assert.ok(trigger instanceof harness.window.HTMLButtonElement);
    assert.ok(layer instanceof harness.window.HTMLElement);
    const boundary = mountStaticOverlayBoundary({ trigger, layer, kind: "tooltip", placement: "right" });
    boundary.open();
    assert.equal(layer.parentElement, harness.document.body);
    assert.equal(layer.getAttribute("data-overlay-boundary"), "document-body");
    assert.equal(layer.getAttribute("data-overlay-positioning"), "static-fixed");
    assert.equal(layer.getAttribute("data-tooltip-open"), "true");
    await harness.dispatchKeydown(trigger, "Escape");
    assert.equal(layer.hidden, true);
    assert.equal(layer.getAttribute("data-tooltip-open"), "false");
    boundary.destroy();
    assert.equal(layer.parentElement?.getAttribute("data-static-clipping"), "true");
  } finally {
    await harness.cleanup();
  }
});

test("STORY-114 native collection and open-value controls preserve state boundaries", async () => {
  const harness = createDomInteractionHarness();
  const callbacks: string[][] = [];
  try {
    await harness.render(
      <form>
        <Field label="Prompt languages" hint="Choose one or more supported values." error="Choose at least one supported language.">
          <MultiSelect
            name="languages"
            defaultValue={["en"]}
            options={[
              { value: "en", label: "English" },
              { value: "zh-CN", label: "简体中文" },
              { value: "ja", label: "日本語", disabled: true }
            ]}
            onChange={(values) => callbacks.push(values)}
          />
        </Field>
        <SuggestInput name="model" suggestions={["model-alpha", "model-alpha", "docs/example"]} defaultValue="custom-model" />
      </form>
    );
    const multiSelect = harness.document.querySelector("select[multiple]");
    assert.ok(multiSelect instanceof harness.window.HTMLSelectElement);
    assert.equal(multiSelect.value, "en");
    const englishOption = multiSelect.querySelector("option[value='en']");
    assert.ok(englishOption instanceof harness.window.HTMLOptionElement);
    const disabledOption = multiSelect.querySelector("option[value='ja']");
    assert.ok(disabledOption instanceof harness.window.HTMLOptionElement);
    assert.equal(disabledOption.disabled, true);
    const chineseOption = multiSelect.querySelector("option[value='zh-CN']");
    assert.ok(chineseOption instanceof harness.window.HTMLOptionElement);
    await act(async () => {
      chineseOption.selected = true;
      multiSelect.dispatchEvent(new harness.window.Event("change", { bubbles: true }));
    });
    assert.deepEqual(callbacks, [["en", "zh-CN"]]);
    assert.equal(multiSelect.tabIndex, 0);
    await act(async () => {
      multiSelect.focus();
      multiSelect.dispatchEvent(new harness.window.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    });
    assert.equal(harness.document.activeElement, multiSelect);
    const form = harness.document.querySelector("form");
    assert.ok(form instanceof harness.window.HTMLFormElement);
    assert.deepEqual(Array.from(new harness.window.FormData(form).getAll("languages")), ["en", "zh-CN"]);
    assert.equal(multiSelect.getAttribute("aria-invalid"), "true");
    const describedBy = multiSelect.getAttribute("aria-describedby") ?? "";
    assert.ok(describedBy.split(/\s+/).length === 2);
    assert.match(form.textContent ?? "", /Choose at least one supported language\./);

    await act(async () => {
      form.reset();
    });
    assert.equal(englishOption.selected, true);
    assert.equal(chineseOption.selected, false);
    assert.deepEqual(Array.from(new harness.window.FormData(form).getAll("languages")), ["en"]);
    await act(async () => {
      chineseOption.selected = true;
      multiSelect.dispatchEvent(new harness.window.Event("change", { bubbles: true }));
    });
    assert.deepEqual(callbacks, [["en", "zh-CN"], ["en", "zh-CN"]]);
    assert.deepEqual(Array.from(new harness.window.FormData(form).getAll("languages")), ["en", "zh-CN"]);

    const input = harness.document.querySelector("input[data-choice-value-mode='open']");
    assert.ok(input instanceof harness.window.HTMLInputElement);
    input.value = "free-form-value";
    assert.equal(input.value, "free-form-value");
    const datalist = harness.document.querySelector("datalist");
    assert.ok(datalist instanceof harness.window.HTMLDataListElement);
    assert.equal(datalist.querySelectorAll("option").length, 2);
  } finally {
    await harness.cleanup();
  }
});

test("STORY-115 dictionary validity markers use rendered content and separate category/value explanations", () => {
  const html = renderToStaticMarkup(
    <DictionaryTable
      category="Backend"
      categoryDescription="Choose the implementation family."
      tableLabel="Backend values"
      valueColumnLabel="Value"
      descriptionColumnLabel="Description"
      entries={[
        { value: "file", label: "File", description: "One local file." },
        { value: "file", label: "Duplicate", description: null }
      ]}
    />
  );
  assert.match(html, /data-dictionary-valid="false"/);
  assert.match(html, /data-dictionary-entry-description-present="false"/);
  assert.match(html, /data-dictionary-duplicate-values="file"/);

  const emptyElement = renderToStaticMarkup(
    <DictionaryTable
      category="Category"
      categoryDescription="Shared category explanation"
      tableLabel="Values"
      valueColumnLabel="Value"
      descriptionColumnLabel="Description"
      entries={[{ value: "a", label: "Alpha", description: <span /> }]}
    />
  );
  assert.match(emptyElement, /data-dictionary-valid="false"/);
  assert.match(emptyElement, /data-dictionary-content-certainty="unknown"/);
  assert.match(emptyElement, /data-dictionary-entry-description-present="false"/);

  const categoryReused = renderToStaticMarkup(
    <DictionaryTable
      category="Category"
      categoryDescription="Shared category explanation"
      tableLabel="Values"
      valueColumnLabel="Value"
      descriptionColumnLabel="Description"
      entries={[
        { value: "a", label: "Alpha", description: "Shared category explanation" },
        { value: "b", label: "Beta", description: "Beta-specific explanation" }
      ]}
    />
  );
  assert.match(categoryReused, /data-dictionary-valid="false"/);
  assert.match(categoryReused, /data-dictionary-category-description-reused="true"/);

  const unknownNode = renderToStaticMarkup(
    <DictionaryTable
      category="Category"
      categoryDescription="Shared category explanation"
      tableLabel="Values"
      valueColumnLabel="Value"
      descriptionColumnLabel="Description"
      entries={[{ value: "a", label: "Alpha", description: <UnknownDescription /> }]}
    />
  );
  assert.match(unknownNode, /data-dictionary-valid="false"/);
  assert.match(unknownNode, /data-dictionary-content-certainty="unknown"/);
});
