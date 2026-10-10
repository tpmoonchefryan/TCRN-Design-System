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
  SettingRowList,
  SettingsHostSwitcher,
  SuggestInput,
  resolveFieldValueControl,
  resolveSettingChoiceControl,
  SettingRow,
  Switch,
  Textarea
} from "./Form.js";
import { tcrnComponentCss } from "../../styles/index.js";
import { inputsCheckPairsCss, inputsSwitchPairsCss, inputsTextPairsCss } from "../../styles/generated/inputs.pairs.js";

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** The body of the first rule in the sheet whose whole selector text is `selector`. */
function cssRule(selector: string): string {
  const match = new RegExp(`(?:^|\\}|\\*\\/)\\s*${escapeRegExp(selector)}\\s*\\{([^}]*)\\}`).exec(tcrnComponentCss);
  assert.ok(match, `missing rule: ${selector}`);
  return match[1];
}

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

  const checklist = renderToStaticMarkup(
    <Field group label="Prompt languages" hint="Choose one or more supported values.">
      <MultiSelect
        id="prompt-languages"
        name="prompt-languages"
        presentation="checkboxes"
        clearSelectionLabel="Clear selection"
        defaultValue={["en", "en"]}
        options={[
          { value: "en", label: "English" },
          { value: "zh-CN", label: "简体中文" },
          { value: "ja", label: "日本語", disabled: true }
        ]}
      />
    </Field>
  );
  assert.match(checklist, /<fieldset[^>]*aria-describedby=/);
  assert.match(checklist, /<legend id="[^"]+"[^>]*>Prompt languages<\/legend>/);
  assert.match(checklist, /role="group"[^>]*aria-labelledby="[^"]+"[^>]*data-choice-presentation="checkboxes"/);
  assert.match(checklist, /<input[^>]*type="checkbox"[^>]*name="prompt-languages"[^>]*checked=""[^>]*value="en"/);
  assert.match(checklist, /<input[^>]*type="checkbox"[^>]*disabled=""[^>]*value="ja"/);
  assert.match(checklist, />Clear selection<\/button>/);
  assert.equal((checklist.match(/type="checkbox"/g) ?? []).length, 3);

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
      <SettingRowList>
        <SettingRow label="No tools" control={<Input defaultValue="value" />} />
        <SettingRow label="Reset available" modified control={<Input defaultValue="other" />} />
      </SettingRowList>
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
  assert.match(html, /class="tcrn-setting-row-list" data-setting-row-list="true"/);
  assert.equal((html.match(/class="tcrn-setting-row__tools"/g) ?? []).length, 3);
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


// TCRN-DS-SUB-019 (STORY-126). The text-like controls share one pair table. The family
// base only reads the live pair; the segment generated from the design contract declares
// it, and its state rules decide which pair is live.

test("STORY-126 every text-like control carries a shared pair target", () => {
  const html = renderToStaticMarkup(
    <>
      <Input name="a" />
      <Textarea name="b" />
      <NumberInput name="c" />
      <DatePicker name="d" />
      <SuggestInput name="e" suggestions={["one"]} />
      <Select name="f" options={[{ value: "a", label: "A" }]} />
      <MultiSelect name="g" presentation="dropdown" emptySelectionLabel="Nothing chosen" defaultValue={["a"]} options={[{ value: "a", label: "Alpha" }]} />
    </>
  );
  assert.equal((html.match(/class="tcrn-input[ "]/g) ?? []).length, 5);
  assert.match(html, /type="date" class="tcrn-input tcrn-date-picker" data-date-picker="true"/);
  assert.match(html, /<select[^>]*class="tcrn-select"/);
  assert.match(html, /class="tcrn-select tcrn-multi-select-dropdown__trigger"/);
  // The summary is cut to one line, so it carries its full text as a title.
  assert.match(html, /<span data-multi-select-summary="[^"]*" title="Alpha">Alpha<\/span>/);
  assert.match(html, /<svg[^>]*width="14" height="14"[^>]*class="[^"]*tcrn-multi-select-dropdown__caret"[^>]*data-icon-name="chevron-down"/);

  const disabled = renderToStaticMarkup(
    <MultiSelect presentation="dropdown" disabled disabledReason="Choices are locked" emptySelectionLabel="Nothing chosen" options={[{ value: "a", label: "Alpha" }]} />
  );
  assert.match(disabled, /title="Choices are locked"/);
  assert.doesNotMatch(disabled, /data-multi-select-summary="[^"]*" title=/);
});

test("STORY-126 the text-control base reads the live pair and paints nothing itself", () => {
  const base = cssRule(".tcrn-input,\n.tcrn-select");
  for (const declaration of [
    "border: 0;",
    "background-color: var(--tcrn-pair-fill);",
    "color: var(--tcrn-pair-ink);",
    "box-shadow: var(--tcrn-pair-edge);",
    "block-size: var(--tcrn-control-height-md);",
    "border-radius: var(--tcrn-radius-control);"
  ]) {
    assert.ok(base.includes(declaration), `base declares ${declaration}`);
  }
  assert.doesNotMatch(base, /--tcrn-color-/);
  assert.doesNotMatch(base, /--tcrn-pair-[a-z-]+\s*:/);
  const segment = tcrnComponentCss.indexOf(inputsTextPairsCss.trim());
  assert.notEqual(segment, -1, "the generated text pair segment is joined into the sheet");
  assert.ok(segment > tcrnComponentCss.indexOf(".tcrn-input,\n.tcrn-select {"), "the pair segment follows the base it serves");
});

test("STORY-126 GWT1 and GWT2: line-ctl edge by default, red edge and red ring when invalid and focused", () => {
  for (const target of ["tcrn-input", "tcrn-select"]) {
    const declarations = new RegExp(`^\\.${target}\\{([^}]*)\\}`, "m").exec(inputsTextPairsCss)?.[1] ?? "";
    assert.match(declarations, /--tcrn-pair-edge-d:inset 0 0 0 1px var\(--tcrn-color-line-ctl\)/);
    assert.match(declarations, /--tcrn-pair-edge-h:inset 0 0 0 1px var\(--tcrn-color-ink-2\)/);
    assert.match(declarations, /--tcrn-pair-edge-f:inset 0 0 0 1px var\(--tcrn-color-acc\),var\(--tcrn-focus-ring\)/);
    assert.match(declarations, /--tcrn-pair-edge-e:inset 0 0 0 1px var\(--tcrn-color-bad\)/);
    const invalidFocus = /--tcrn-pair-edge-ef:([^;}]*)/.exec(declarations)?.[1] ?? "";
    assert.match(invalidFocus, /var\(--tcrn-color-bad\)[\s\S]*var\(--tcrn-color-bad\)/);
    assert.doesNotMatch(invalidFocus, /acc|focus-ring/);
    for (const slot of ["fill-e", "ink-e"]) {
      assert.doesNotMatch(new RegExp(`--tcrn-pair-${slot}:([^;}]*)`).exec(declarations)?.[1] ?? "acc", /acc/);
    }
  }
  const focusRule = tcrnComponentCss.indexOf(".tcrn-input:where(:focus-visible,");
  const invalidRule = tcrnComponentCss.indexOf('.tcrn-input:where([aria-invalid="true"]),');
  const invalidFocusRule = tcrnComponentCss.indexOf('.tcrn-input:where([aria-invalid="true"]:focus-visible,');
  assert.ok(focusRule !== -1 && focusRule < invalidRule && invalidRule < invalidFocusRule, "the invalid rules follow the focus rule, so they win");
  assert.doesNotMatch(tcrnComponentCss, /aria-invalid[^{}]*\{[^}]*--tcrn-color-acc/);
});

test("STORY-126 number, date, placeholder and collection details follow the Inputs board", () => {
  assert.match(cssRule(".tcrn-number-input"), /appearance:textfield/);
  assert.match(tcrnComponentCss, /\.tcrn-number-input::-webkit-inner-spin-button,\.tcrn-number-input::-webkit-outer-spin-button\{-webkit-appearance:none;margin:0\}/);
  // GWT4: the native indicator stays the click target, transparent over the end 30px.
  const indicator = cssRule(".tcrn-date-picker::-webkit-calendar-picker-indicator");
  for (const declaration of ["position: absolute;", "inset-inline-end: 0;", "inline-size: 30px;", "block-size: 100%;", "opacity: 0;", "cursor: pointer;"]) {
    assert.ok(indicator.includes(declaration), `indicator declares ${declaration}`);
  }
  assert.match(cssRule(".tcrn-date-picker"), /position: relative; padding-inline-end: 30px;/);
  assert.match(cssRule(".tcrn-input::placeholder"), /color: var\(--tcrn-color-ink-3\);\s*opacity: 1;/);
  assert.match(cssRule(".tcrn-select.tcrn-multi-select"), /block-size:auto/);
  assert.equal(cssRule('.tcrn-multi-select-dropdown__option[aria-selected="true"]'), "background:var(--tcrn-color-wash);font-weight:600");
  assert.match(cssRule(".tcrn-multi-select-dropdown__option:not(:disabled):hover"), /var\(--tcrn-color-hover\)/);
});


// TCRN-DS-SUB-020 (STORY-126). Checkable controls take a fill, edge and mark triple,
// the switch a track, edge, knob and knob-edge quadruple; SearchInput is the quiet tool
// form; the field no longer washes as a whole on focus.

test("STORY-126 checkbox and radio draw a 16px box from the pair table with a border-drawn tick", () => {
  const box = cssRule(".tcrn-checkbox,\n.tcrn-radio-group__control");
  for (const declaration of [
    "appearance: none;",
    "inline-size: 16px;",
    "block-size: 16px;",
    "border: 0;",
    "border-radius: var(--tcrn-radius-check);",
    "background-color: var(--tcrn-pair-fill);",
    "box-shadow: var(--tcrn-pair-edge);"
  ]) {
    assert.ok(box.includes(declaration), `box declares ${declaration}`);
  }
  assert.doesNotMatch(box, /--tcrn-color-/);
  const tick = cssRule(".tcrn-checkbox::after");
  assert.match(tick, /border: solid var\(--tcrn-pair-mark\);/);
  assert.match(tick, /border-width: 0 1\.5px 1\.5px 0;/);
  assert.match(tick, /transform: rotate\(45deg\);/);
  assert.match(cssRule(".tcrn-radio-group__control"), /border-radius: 50%;/);
  assert.match(cssRule(".tcrn-radio-group__control::after"), /box-shadow: inset 0 0 0 5px var\(--tcrn-pair-mark\);/);
  assert.doesNotMatch(tcrnComponentCss, /url\(\s*["']?data:/);
  assert.ok(tcrnComponentCss.includes(inputsCheckPairsCss.trim()), "the generated check pair segment is joined into the sheet");
  assert.match(inputsCheckPairsCss, /^\.tcrn-checkbox\{[^}]*--tcrn-pair-fill-c:var\(--tcrn-color-acc\);[^}]*--tcrn-pair-mark-c:var\(--tcrn-color-on-acc\)/m);
  assert.match(inputsCheckPairsCss, /^\.tcrn-radio-group__control\{[^}]*--tcrn-pair-fill-c:var\(--tcrn-color-panel\);[^}]*--tcrn-pair-mark-c:var\(--tcrn-color-acc\)/m);
});

test("STORY-126 the switch is a 34 by 20 track whose 16px knob travels 14px and turns on-acc when on", () => {
  const track = cssRule(".tcrn-switch__control");
  for (const declaration of [
    "appearance: none;",
    "inline-size: 34px;",
    "block-size: 20px;",
    "border: 0;",
    "border-radius: var(--tcrn-radius-pill);",
    "background-color: var(--tcrn-pair-fill);",
    "box-shadow: var(--tcrn-pair-edge);"
  ]) {
    assert.ok(track.includes(declaration), `track declares ${declaration}`);
  }
  const knob = cssRule(".tcrn-switch__control::before");
  for (const declaration of ["inline-size: 16px;", "block-size: 16px;", "background-color: var(--tcrn-pair-knob);", "box-shadow: var(--tcrn-pair-knob-edge);"]) {
    assert.ok(knob.includes(declaration), `knob declares ${declaration}`);
  }
  assert.match(cssRule(".tcrn-switch__control:where(:checked)::before"), /transform: translateX\(14px\);/);
  assert.ok(tcrnComponentCss.includes(inputsSwitchPairsCss.trim()), "the generated switch pair segment is joined into the sheet");
  assert.match(inputsSwitchPairsCss, /--tcrn-pair-fill-c:var\(--tcrn-color-acc\);[^}]*--tcrn-pair-knob-c:var\(--tcrn-color-on-acc\)/);
  assert.doesNotMatch(tcrnComponentCss, /\.tcrn-switch[^{]*\{[^}]*opacity:/);
  const html = renderToStaticMarkup(<Switch label="Archive automatically" defaultChecked />);
  assert.match(html, /type="checkbox" role="switch"[^>]*class="tcrn-switch__control"/);
});

test("STORY-126 GWT3 SearchInput is a quiet tool: wash without an edge, ink-2 placeholder, paper and ring on focus", () => {
  const search = /^\.tcrn-input\.tcrn-search-input__control\{([^}]*)\}/m.exec(inputsTextPairsCss)?.[1] ?? "";
  assert.match(search, /--tcrn-pair-fill-d:var\(--tcrn-color-wash\);--tcrn-pair-edge-d:0 0 #0000/);
  assert.match(search, /--tcrn-pair-edge-h:inset 0 0 0 1px var\(--tcrn-color-line-2\)/);
  assert.match(search, /--tcrn-pair-fill-f:var\(--tcrn-color-panel\)/);
  assert.match(cssRule(".tcrn-input.tcrn-search-input__control::placeholder"), /color: var\(--tcrn-color-ink-2\);/);
  assert.doesNotMatch(cssRule(".tcrn-search-input .tcrn-search-input__control"), /background|box-shadow|border|color:/);
  assert.doesNotMatch(cssRule(".tcrn-search-input"), /background|border|box-shadow|outline/);
  assert.doesNotMatch(tcrnComponentCss, /\.tcrn-search-input:focus-within\s*\{[^}]*outline:\s*[1-9]/);
  const html = renderToStaticMarkup(<SearchInput placeholder="Search members" shortcut="auto" />);
  assert.match(html, /class="tcrn-input tcrn-search-input__control"/);
  assert.match(html, /data-shortcut-visible="true"/);
});

test("STORY-126 the field no longer washes on focus, and every ring keeps a forced-colours outline", () => {
  assert.doesNotMatch(tcrnComponentCss, /\.tcrn-field:focus-within/);
  assert.match(cssRule(".tcrn-field--error"), /outline-color/);
  for (const control of [".tcrn-input", ".tcrn-select", ".tcrn-checkbox", ".tcrn-radio-group__control", ".tcrn-switch__control"]) {
    assert.match(tcrnComponentCss, new RegExp(`${escapeRegExp(control)}:where\\(:focus-visible\\)[^{]*\\{\\s*outline: 2px solid transparent;\\s*outline-offset: 2px;`));
  }
  assert.match(tcrnComponentCss, /@media \(forced-colors: active\) \{[\s\S]*\.tcrn-checkbox,\s*\.tcrn-radio-group__control,\s*\.tcrn-switch__control \{\s*-webkit-appearance: auto;\s*appearance: auto;/);
});
