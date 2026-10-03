import test from "node:test";
import assert from "node:assert/strict";
import { Field, MultiSelect } from "../index.js";
import { act } from "react";
import { createDomInteractionHarness } from "./dom-harness.js";

test("MultiSelect checkbox presentation keeps group semantics, repeated form values, clear, and reset behavior", async () => {
  const harness = createDomInteractionHarness();
  const changes: string[][] = [];
  try {
    await harness.render(
      <form id="language-form">
        <Field group label="Prompt languages" hint="Choose one or more.">
          <MultiSelect
            id="prompt-languages"
            name="prompt-languages"
            form="language-form"
            presentation="checkboxes"
            clearSelectionLabel="Clear selection"
            defaultValue={["en"]}
            onChange={(values) => changes.push(values)}
            options={[
              { value: "en", label: "English" },
              { value: "zh-CN", label: "Simplified Chinese" },
              { value: "ja", label: "Japanese", disabled: true }
            ]}
          />
        </Field>
      </form>
    );

    const group = harness.document.querySelector('[role="group"][data-choice-presentation="checkboxes"]');
    const legend = harness.document.querySelector("legend");
    const english = harness.document.querySelector<HTMLInputElement>('input[name="prompt-languages"][value="en"]');
    const chinese = harness.document.querySelector<HTMLInputElement>('input[name="prompt-languages"][value="zh-CN"]');
    const japanese = harness.document.querySelector<HTMLInputElement>('input[name="prompt-languages"][value="ja"]');
    const clear = harness.document.querySelector("button.tcrn-multi-select-group__clear");
    const form = harness.document.querySelector("form");

    assert.ok(group instanceof harness.window.HTMLElement);
    assert.ok(legend instanceof harness.window.HTMLLegendElement);
    assert.equal(group.getAttribute("aria-labelledby"), legend.id);
    assert.equal(group.getAttribute("aria-describedby"), legend.parentElement?.querySelector(".tcrn-field__hint")?.id);
    assert.ok(english instanceof harness.window.HTMLInputElement);
    assert.ok(chinese instanceof harness.window.HTMLInputElement);
    assert.ok(japanese instanceof harness.window.HTMLInputElement);
    assert.equal(english.checked, true);
    assert.equal(japanese.disabled, true);
    assert.ok(clear instanceof harness.window.HTMLButtonElement);
    assert.ok(form instanceof harness.window.HTMLFormElement);
    assert.deepEqual(new harness.window.FormData(form).getAll("prompt-languages"), ["en"]);

    chinese.focus();
    assert.equal(harness.document.activeElement, chinese);
    await harness.dispatchClick(chinese);
    assert.equal(chinese.checked, true);
    assert.deepEqual(changes, [["en", "zh-CN"]]);
    assert.deepEqual(new harness.window.FormData(form).getAll("prompt-languages"), ["en", "zh-CN"]);

    await harness.dispatchClick(clear);
    assert.equal(english.checked, false);
    assert.equal(chinese.checked, false);
    assert.deepEqual(changes, [["en", "zh-CN"], []]);
    assert.deepEqual(new harness.window.FormData(form).getAll("prompt-languages"), []);

    await harness.dispatchClick(chinese);
    await act(async () => {
      form.reset();
    });
    assert.equal(english.checked, true);
    assert.equal(chinese.checked, false);
    assert.deepEqual(new harness.window.FormData(form).getAll("prompt-languages"), ["en"]);
  } finally {
    await harness.cleanup();
  }
});
