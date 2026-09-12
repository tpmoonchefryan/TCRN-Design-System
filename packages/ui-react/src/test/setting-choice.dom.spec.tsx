import test from "node:test";
import assert from "node:assert/strict";
import { act, useState } from "react";
import { SettingChoice, type SettingChoiceOption } from "../index.js";
import { createDomInteractionHarness } from "./dom-harness.js";

const binaryOptions: SettingChoiceOption[] = [
  { value: "a", label: "Alpha", minInlineSize: 112 },
  { value: "b", label: "Beta", minInlineSize: 112 }
];

interface UncontrolledFixtureProps {
  availableInlineSize: number;
  onChange: (value: string) => void;
}

function UncontrolledFixture({ availableInlineSize, onChange }: UncontrolledFixtureProps) {
  return (
    <SettingChoice
      label="Execution mode"
      name="execution-mode"
      options={binaryOptions}
      defaultValue="a"
      availableInlineSize={availableInlineSize}
      onChange={onChange}
    />
  );
}

interface ControlledFixtureProps extends UncontrolledFixtureProps {
  value: string;
}

function ControlledFixture({ availableInlineSize, onChange, value }: ControlledFixtureProps) {
  return (
    <SettingChoice
      label="Execution mode"
      name="controlled-execution-mode"
      options={binaryOptions}
      value={value}
      availableInlineSize={availableInlineSize}
      onChange={onChange}
    />
  );
}

async function dispatchSelectChange(harness: ReturnType<typeof createDomInteractionHarness>, value: string) {
  const select = harness.document.querySelector("select");
  assert.ok(select instanceof harness.window.HTMLSelectElement);
  await act(async () => {
    select.value = value;
    select.dispatchEvent(new harness.window.Event("change", { bubbles: true, cancelable: true }));
  });
  return select;
}

test("SettingChoice preserves an uncontrolled value across radio/select swaps without synthetic callbacks", async () => {
  const harness = createDomInteractionHarness();
  const callbacks: string[] = [];

  try {
    await harness.render(<UncontrolledFixture availableInlineSize={500} onChange={(value) => callbacks.push(value)} />);
    let radioB = harness.document.querySelector("input[type='radio'][value='b']");
    assert.ok(radioB instanceof harness.window.HTMLInputElement);
    assert.equal((harness.document.querySelector("input[type='radio'][value='a']") as HTMLInputElement).checked, true);

    await harness.dispatchClick(radioB);
    assert.equal(radioB.checked, true);
    assert.deepEqual(callbacks, ["b"]);

    await harness.render(<UncontrolledFixture availableInlineSize={100} onChange={(value) => callbacks.push(value)} />);
    let select = harness.document.querySelector("select");
    assert.ok(select instanceof harness.window.HTMLSelectElement);
    assert.equal(select.value, "b");
    assert.deepEqual(callbacks, ["b"]);

    await harness.render(<UncontrolledFixture availableInlineSize={500} onChange={(value) => callbacks.push(value)} />);
    radioB = harness.document.querySelector("input[type='radio'][value='b']");
    assert.ok(radioB instanceof harness.window.HTMLInputElement);
    assert.equal(radioB.checked, true);
    assert.deepEqual(callbacks, ["b"]);

    await harness.render(<UncontrolledFixture availableInlineSize={100} onChange={(value) => callbacks.push(value)} />);
    select = await dispatchSelectChange(harness, "a");
    assert.equal(select.value, "a");
    assert.deepEqual(callbacks, ["b", "a"]);
    select = await dispatchSelectChange(harness, "b");
    assert.equal(select.value, "b");
    assert.deepEqual(callbacks, ["b", "a", "b"]);

    await harness.render(<UncontrolledFixture availableInlineSize={500} onChange={(value) => callbacks.push(value)} />);
    radioB = harness.document.querySelector("input[type='radio'][value='b']");
    assert.ok(radioB instanceof harness.window.HTMLInputElement);
    assert.equal(radioB.checked, true);
    assert.deepEqual(callbacks, ["b", "a", "b"]);
  } finally {
    await harness.cleanup();
  }
});

test("SettingChoice keeps a controlled value and callback count stable during layout-only swaps", async () => {
  const harness = createDomInteractionHarness();
  const callbacks: string[] = [];
  let value = "a";

  const renderControlled = async (availableInlineSize: number) => {
    await harness.render(
      <ControlledFixture
        availableInlineSize={availableInlineSize}
        value={value}
        onChange={(nextValue) => {
          callbacks.push(nextValue);
          value = nextValue;
        }}
      />
    );
  };

  try {
    await renderControlled(500);
    const radioB = harness.document.querySelector("input[type='radio'][value='b']");
    assert.ok(radioB instanceof harness.window.HTMLInputElement);
    await harness.dispatchClick(radioB);
    await renderControlled(500);
    assert.deepEqual(callbacks, ["b"]);

    await renderControlled(100);
    const select = harness.document.querySelector("select");
    assert.ok(select instanceof harness.window.HTMLSelectElement);
    assert.equal(select.value, "b");
    assert.deepEqual(callbacks, ["b"]);

    await renderControlled(500);
    const retainedRadioB = harness.document.querySelector("input[type='radio'][value='b']");
    assert.ok(retainedRadioB instanceof harness.window.HTMLInputElement);
    assert.equal(retainedRadioB.checked, true);
    assert.deepEqual(callbacks, ["b"]);
  } finally {
    await harness.cleanup();
  }
});

test("SettingChoice carries disabled state through radio and Select branches", async () => {
  const harness = createDomInteractionHarness();
  const callbacks: string[] = [];
  const options: SettingChoiceOption[] = [
    { value: "a", label: "Alpha", minInlineSize: 112 },
    { value: "b", label: "Beta", minInlineSize: 112, disabled: true }
  ];

  try {
    await harness.render(
      <SettingChoice
        label="Execution mode"
        name="disabled-execution-mode"
        options={options}
        defaultValue="a"
        availableInlineSize={500}
        onChange={(value) => callbacks.push(value)}
      />
    );
    const radioB = harness.document.querySelector("input[type='radio'][value='b']");
    assert.ok(radioB instanceof harness.window.HTMLInputElement);
    assert.equal(radioB.disabled, true);
    await act(async () => {
      radioB.click();
    });
    assert.equal(callbacks.length, 0);

    await harness.render(
      <SettingChoice
        label="Execution mode"
        name="disabled-execution-mode"
        options={options}
        defaultValue="a"
        availableInlineSize={100}
        onChange={(value) => callbacks.push(value)}
      />
    );
    const select = harness.document.querySelector("select");
    assert.ok(select instanceof harness.window.HTMLSelectElement);
    const disabledOption = select.querySelector("option[value='b']");
    assert.ok(disabledOption instanceof harness.window.HTMLOptionElement);
    assert.equal(disabledOption.disabled, true);
    assert.equal(select.value, "a");
    await harness.dispatchKeydown(select, "ArrowDown");
    assert.equal(select.value, "a");
    assert.equal(callbacks.length, 0);
  } finally {
    await harness.cleanup();
  }
});

test("RadioGroup defaultValue supports native user changes and reports each change once", async () => {
  const harness = createDomInteractionHarness();
  const callbacks: string[] = [];

  try {
    await harness.render(
      <SettingChoice
        label="Execution mode"
        name="keyboard-execution-mode"
        options={binaryOptions}
        defaultValue="a"
        availableInlineSize={500}
        onChange={(value) => callbacks.push(value)}
      />
    );
    const radioA = harness.document.querySelector("input[type='radio'][value='a']");
    const radioB = harness.document.querySelector("input[type='radio'][value='b']");
    assert.ok(radioA instanceof harness.window.HTMLInputElement);
    assert.ok(radioB instanceof harness.window.HTMLInputElement);
    radioA.focus();
    await harness.dispatchKeydown(radioA, "ArrowRight");
    await harness.dispatchClick(radioB);
    assert.equal(radioB.checked, true);
    assert.deepEqual(callbacks, ["b"]);
  } finally {
    await harness.cleanup();
  }
});
