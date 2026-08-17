import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import {
  RadioGroup,
  Checkbox,
  Field,
  FieldProvenance,
  Input,
  LineNumberedEditor,
  LockHint,
  SearchInput,
  Select,
  SettingRow,
  Switch,
  Textarea
} from "./Form.js";

test("core primitives render normalized class names and accessibility attributes", () => {
  const html = renderToStaticMarkup(
    <Field label="Search">
      <Input name="search" />
    </Field>
  );
  assert.match(html, /tcrn-field/);
  assert.match(html, /tcrn-input/);
});

test("disabled form controls expose their own reason contract", () => {
  const html = renderToStaticMarkup(
    <>
      <Input disabled disabledReason="Project input is locked" />
      <Textarea disabled disabledReason="Notes are locked" />
      <Select disabled disabledReason="Target path is locked" options={[{ value: "local", label: "Local path" }]} />
      <SearchInput disabled disabledReason="Search is unavailable" />
      <Checkbox disabled disabledReason="Toggle is unavailable" />
    </>
  );

  for (const reason of ["Project input is locked", "Notes are locked", "Target path is locked", "Search is unavailable", "Toggle is unavailable"]) {
    assert.match(html, new RegExp(`data-disabled-reason="${reason}"`));
    assert.match(html, new RegExp(`title="${reason}"`));
    assert.match(html, new RegExp(`<span id="[^"]+" class="tcrn-sr-only">${reason}<\\/span>`));
  }

  const describedByCount = (html.match(/aria-describedby="/g) ?? []).length;
  assert.equal(describedByCount, 5);
  assert.match(html, /class="[^"]*tcrn-textarea/);
});

test("field wires real aria description and error relationships into controls", () => {
  const html = renderToStaticMarkup(
    <Field label="Invalid state" hint="Use a synthetic fixture value" error="Synthetic validation message">
      <Input name="fixture" />
    </Field>
  );
  const describedBy = html.match(/aria-describedby="([^"]+)"/)?.[1];
  assert.ok(describedBy);
  const ids = describedBy.split(/\s+/);
  assert.equal(ids.length, 2);
  for (const id of ids) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /class="tcrn-field tcrn-field--error"/);
  assert.match(html, /Use a synthetic fixture value/);
  assert.match(html, /Synthetic validation message/);
  assert.doesNotMatch(html, /highlightError/);
  assert.doesNotMatch(html, /is-invalid/);
});

test("search input exposes visual affordance without shortcut metadata by default", () => {
  const html = renderToStaticMarkup(<SearchInput placeholder="Search components" />);
  assert.match(html, /data-search-input="true"/);
  assert.match(html, /tcrn-search-input__icon/);
  assert.match(html, /data-icon-name="search"/);
  assert.match(html, /type="search"/);
  assert.doesNotMatch(html, /data-shortcut-visible="true"/);
  assert.doesNotMatch(html, /aria-keyshortcuts=/);
  assert.doesNotMatch(html, /data-shortcut-auto="search"/);
  assert.doesNotMatch(html, />Ctrl K</);

  const shellShortcut = renderToStaticMarkup(<SearchInput placeholder="Search docs" shortcut="auto" />);
  assert.match(shellShortcut, /data-shortcut-visible="true"/);
  assert.match(shellShortcut, /aria-keyshortcuts="Control\+K Meta\+K"/);
  assert.match(shellShortcut, /data-shortcut-auto="search"/);
  assert.match(shellShortcut, />Ctrl K</);

  const customShortcut = renderToStaticMarkup(<SearchInput shortcut="⌘ K" />);
  assert.match(customShortcut, /data-shortcut-visible="true"/);
  assert.match(customShortcut, />⌘ K</);

  const noShortcut = renderToStaticMarkup(<SearchInput shortcut={false} />);
  assert.doesNotMatch(noShortcut, /data-shortcut-visible="true"/);
  assert.doesNotMatch(noShortcut, /data-shortcut-auto="search"/);
  assert.doesNotMatch(noShortcut, /aria-keyshortcuts=/);
});

test("component-loop form constructs expose their state and recovery surfaces", () => {
  const html = renderToStaticMarkup(
    <>
      <Switch label="Use compact view" description="Reduces row spacing" defaultChecked />
      <SettingRow
        label="Theme"
        settingKey="appearance.theme"
        description="The preferred visual mode"
        modified
        resetLabel="Restore"
        onReset={() => undefined}
        control={<Select options={[{ value: "light", label: "Light" }]} />}
      />
      <FieldProvenance value="Compact" source="Inherited" overridden action={<button type="button">Restore field</button>} />
      <LineNumberedEditor
        value={["const value = true;", "return value;"].join("\n")}
        readOnly
        findings={[{ line: 2, label: "Check return path", tone: "warning" }]}
      />
      <LockHint>Available after the route is unlocked.</LockHint>
    </>
  );

  assert.match(html, /role="switch"/);
  assert.match(html, /data-switch-state="on"/);
  assert.match(html, /data-setting-row="true" data-modified="true"/);
  assert.match(html, /class="tcrn-setting-row__modified"/);
  assert.match(html, />Restore<\/button>/);
  assert.match(html, /data-provenance-state="overridden"/);
  assert.match(html, /tcrn-field-provenance__source/);
  assert.match(html, /data-line-numbered-editor="true"/);
  assert.match(html, /data-editor-line="2" data-editor-line-finding="true"/);
  assert.match(html, /data-editor-finding-line="2"/);
  assert.match(html, /data-lock-hint="true" role="note"/);
});


// TCRN-DS-STORY-092 batch 2. The assertions read the accessibility contract, not
// the class list: a radio group that renders the right classes and the wrong
// elements is the failure mode this component exists to remove.

test("STORY-092 a radio group is a fieldset with a legend, so the question is announced before the answers", () => {
  const html = renderToStaticMarkup(
    <RadioGroup
      legend="Delivery speed"
      name="speed"
      defaultValue="standard"
      options={[
        { value: "standard", label: "Standard" },
        { value: "express", label: "Express", description: "Arrives tomorrow" }
      ]}
    />
  );
  assert.match(html, /<fieldset[^>]*>/);
  assert.match(html, /<legend[^>]*>Delivery speed<\/legend>/);
  // Native radios, not a div wearing role="radiogroup": the browser gives arrow-key
  // roving to these for free, and a hand-rolled group loses it.
  assert.equal((html.match(/type="radio"/g) ?? []).length, 2);
  assert.match(html, /name="speed"/);
  assert.match(html, /checked=""/);
});

test("STORY-092 a radio description is associated, not merely adjacent", () => {
  const html = renderToStaticMarkup(
    <RadioGroup legend="Q" name="q" options={[{ value: "a", label: "A", description: "why a" }]} />
  );
  const described = /aria-describedby="([^"]+)"/.exec(html);
  assert.ok(described, "an option with a description must point at it");
  assert.match(html, new RegExp(`id="${described[1]}"[^>]*>why a<`));
});

test("STORY-092 a disabled group disables every option through the fieldset", () => {
  const html = renderToStaticMarkup(
    <RadioGroup legend="Q" name="q" disabled options={[{ value: "a", label: "A" }]} />
  );
  // One disabled attribute on the fieldset does what N on the inputs would, and
  // stays correct when an option is added.
  assert.match(html, /<fieldset[^>]*disabled=""/);
});
