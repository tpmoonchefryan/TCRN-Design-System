import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import {
  RadioGroup,
  DatePicker,
  Checkbox,
  Field,
  FieldProvenance,
  Input,
  NumberInput,
  LineNumberedEditor,
  LockHint,
  MultiSelect,
  SearchInput,
  Select,
  SettingChoice,
  SettingsHostSwitcher,
  SuggestInput,
  resolveFieldValueControl,
  resolveSettingChoiceControl,
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

test("STORY-106 setting choices separate value semantics from navigation and fit before using binary radios", () => {
  const binary = [
    { value: "local", label: "Local", minInlineSize: 112 },
    { value: "remote", label: "Remote", minInlineSize: 112 }
  ];
  const longBinary = [
    { value: "long-local", label: "Long local execution label", minInlineSize: 220 },
    { value: "long-remote", label: "Long remote execution label", minInlineSize: 220 }
  ];
  const unmeasuredLongBinary = [
    { value: "unmeasured-local", label: "L".repeat(100) },
    { value: "unmeasured-remote", label: "R".repeat(100) }
  ];
  const three = [...binary, { value: "deferred", label: "Deferred" }];

  assert.equal(resolveSettingChoiceControl(binary, 248).control, "radio");
  assert.equal(resolveSettingChoiceControl(binary, 247).reason, "binary-does-not-fit");
  assert.equal(resolveSettingChoiceControl(longBinary, 248).control, "select");
  assert.equal(resolveSettingChoiceControl(unmeasuredLongBinary, 248).reason, "option-measurement-required");
  assert.equal(resolveSettingChoiceControl(three, 720).control, "select");
  assert.equal(resolveSettingChoiceControl(binary).reason, "available-inline-size-required");

  const radioHtml = renderToStaticMarkup(<SettingChoice label="Execution host" name="host" options={binary} availableInlineSize={248} />);
  assert.match(radioHtml, /data-setting-choice="true"/);
  assert.match(radioHtml, /data-setting-choice-semantic="value-selection"/);
  assert.match(radioHtml, /data-setting-choice-control="radio"/);
  assert.match(radioHtml, /<fieldset/);
  assert.match(radioHtml, /<legend[^>]*>Execution host<\/legend>/);
  assert.equal((radioHtml.match(/type="radio"/g) ?? []).length, 2);
  assert.doesNotMatch(radioHtml, /tcrn-segmented-nav/);

  const selectHtml = renderToStaticMarkup(<SettingChoice label="Execution mode" name="mode" options={three} availableInlineSize={720} />);
  assert.match(selectHtml, /data-setting-choice-control="select"/);
  assert.match(selectHtml, /<select/);
  assert.equal((selectHtml.match(/<option/g) ?? []).length, 3);
  assert.doesNotMatch(selectHtml, /tcrn-segmented-nav/);

  const disabledOptions = [
    { value: "allowed", label: "Allowed", minInlineSize: 112 },
    { value: "unavailable", label: "Unavailable", minInlineSize: 112, disabled: true }
  ];
  const disabledRadioHtml = renderToStaticMarkup(<SettingChoice label="Mode" name="mode" options={disabledOptions} availableInlineSize={500} />);
  assert.match(disabledRadioHtml, /type="radio"[^>]*disabled=""[^>]*name="mode"[^>]*value="unavailable"/);
  const disabledSelectHtml = renderToStaticMarkup(<SettingChoice label="Mode" name="mode" options={disabledOptions} availableInlineSize={100} />);
  assert.match(disabledSelectHtml, /<option[^>]*value="unavailable"[^>]*disabled/);

  const hostHtml = renderToStaticMarkup(
    <SettingsHostSwitcher label="Host" name="host" hosts={binary} availableInlineSize={248} />
  );
  assert.match(hostHtml, /data-settings-host-switcher="true"/);
  assert.match(hostHtml, /data-setting-choice-scope="host-switcher"/);
});

test("STORY-114 collection and open-value controls preserve their distinct native contracts", () => {
  const collection = renderToStaticMarkup(
    <Field label="Prompt languages" hint="Choose one or more supported values.">
      <MultiSelect
        name="prompt-languages"
        defaultValue={["en", "en", "zh-CN"]}
        options={[
          { value: "en", label: "English" },
          { value: "zh-CN", label: "简体中文" },
          { value: "ja", label: "日本語", disabled: true }
        ]}
      />
    </Field>
  );
  assert.match(collection, /data-choice-cardinality="collection"/);
  assert.match(collection, /data-choice-value-mode="closed"/);
  assert.match(collection, /<select[^>]*multiple=""/);
  assert.match(collection, /<option[^>]*value="ja"[^>]*disabled/);
  assert.equal((collection.match(/<option/g) ?? []).length, 3);
  assert.equal((collection.match(/selected=""/g) ?? []).length, 2);

  const open = renderToStaticMarkup(
    <Field label="Model or path">
      <SuggestInput suggestions={["model-alpha", "model-alpha", "docs/example"]} defaultValue="custom-model" />
    </Field>
  );
  assert.match(open, /data-choice-cardinality="single"/);
  assert.match(open, /data-choice-value-mode="open"/);
  assert.match(open, /data-choice-suggestions="advisory"/);
  assert.match(open, /list="[^"]+"/);
  assert.equal((open.match(/<option value="/g) ?? []).length, 2);
  assert.match(open, /value="custom-model"/);
});

test("STORY-114 field metadata resolves cardinality and value domain before rendering", () => {
  const closedSingle = resolveFieldValueControl({
    cardinality: "single",
    valueDomain: "closed",
    options: [
      { value: "a", label: "A", minInlineSize: 112 },
      { value: "b", label: "B", minInlineSize: 112 }
    ],
    availableInlineSize: 248
  });
  assert.deepEqual(closedSingle, { control: "setting-choice", valid: true, reason: "single-closed" });
  assert.deepEqual(resolveFieldValueControl({ cardinality: "collection", valueDomain: "closed", options: [{ value: "a", label: "A" }] }), { control: "multi-select", valid: true, reason: "collection-closed" });
  assert.deepEqual(resolveFieldValueControl({ cardinality: "single", valueDomain: "open", suggestions: ["known"] }), { control: "suggest-input", valid: true, reason: "single-open" });
  assert.equal(resolveFieldValueControl({ cardinality: "collection", valueDomain: "open" }).valid, false);
  assert.equal(resolveFieldValueControl({ cardinality: "single", valueDomain: "closed" }).reason, "closed-options-required");
});

test("STORY-106 NumberInput keeps native numeric entry semantics and full-value visibility markers", () => {
  const html = renderToStaticMarkup(
    <Field label="Token budget" hint="Allowed range: 512–8192">
      <NumberInput name="budget" value={8192} min={512} max={8192} onChange={() => undefined} />
    </Field>
  );

  assert.match(html, /data-number-input="true"/);
  assert.match(html, /data-number-input-semantic="numeric-entry"/);
  assert.match(html, /data-number-input-visibility="full-value"/);
  assert.match(html, /type="number"/);
  assert.match(html, /value="8192"/);
  assert.match(html, /min="512"/);
  assert.match(html, /max="8192"/);
  assert.match(html, /Allowed range: 512–8192/);
  assert.doesNotMatch(html, /tcrn-stepper/);
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
  assert.match(html, /id="[^\"]+" class="tcrn-setting-row__name"/);
  assert.match(html, /<select[^>]*aria-labelledby="[^\"]+"/);
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


test("STORY-092 a date picker keeps the machine format in the value and the reader's on screen", () => {
  const html = renderToStaticMarkup(<DatePicker value="2026-08-18" min="2026-01-01" max="2026-12-31" readOnly />);
  assert.match(html, /type="date"/);
  // ISO in the value regardless of what the reader sees, so a product never parses
  // a localised string. That split is what the native control gives for free.
  assert.match(html, /value="2026-08-18"/);
  assert.match(html, /min="2026-01-01"/);
  assert.match(html, /max="2026-12-31"/);
});
