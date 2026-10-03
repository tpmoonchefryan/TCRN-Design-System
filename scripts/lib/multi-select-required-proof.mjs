import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

// This fixture stays inside the existing consumer proof. It exercises native
// validation and submission in a browser, including a deliberately broken
// ARIA-only group, without substituting SSR attributes for form behavior.
const fixtureSource = `
  import React, { useState } from "react";
  import { createRoot } from "react-dom/client";
  import { flushSync } from "react-dom";
  import { MultiSelect, tcrnComponentCss } from "./packages/ui-react/dist/index.js";
  import { tcrnTokenCss } from "./packages/ui-tokens/dist/index.js";
  const options = [
    { value: "blocked", label: "Blocked", disabled: true },
    { value: "one", label: "One" },
    { value: "two", label: "Two" }
  ];
  window.collectionChanges = [];
  window.collectionCallbackStates = [];
  window.collectionSubmissions = [];
  function Fixture() {
    const [config, setConfig] = useState({
      required: true, disabled: false, presentation: "checkboxes",
      defaultValue: [], options, ...window.collectionInitialConfig
    });
    window.updateCollection = (patch) => flushSync(() => setConfig((current) => ({ ...current, ...patch })));
    const props = {
      id: "collection", name: "values", options: config.options,
      required: config.required, disabled: config.disabled,
      disabledReason: "disabled", presentation: config.presentation,
      clearSelectionLabel: "Clear selection", "aria-label": "Collection",
      defaultValue: config.defaultValue,
      value: config.controlled ? config.value : undefined,
      form: config.external ? config.formId ?? "selection-form" : undefined,
      onChange: (values) => {
        window.collectionChanges.push(values);
        const form = document.getElementById(config.external ? config.formId ?? "selection-form" : "selection-form");
        window.collectionCallbackStates.push({ valid: form.checkValidity(), values: new FormData(form).getAll("values") });
        if (config.submitOnChange) form.requestSubmit();
        if (config.controlled && config.acceptChanges) setConfig((current) => ({ ...current, value: values }));
      }
    };
    const control = config.ariaOnly
      ? <div id="collection" role="group" aria-required="true">
          {config.options.map((option) => <input key={option.value} type="checkbox" name="values" value={option.value} disabled={option.disabled} />)}
        </div>
      : <MultiSelect {...props} />;
    const submit = (event) => {
      event.preventDefault();
      window.collectionSubmissions.push({ form: event.currentTarget.id, values: new FormData(event.currentTarget).getAll("values") });
    };
    return <section data-collection-fixture="true" data-locale-invariant="true">
      <style>{tcrnTokenCss + tcrnComponentCss}</style>
      <form id="selection-form" onSubmit={submit}>
        {!config.external && <fieldset disabled={config.fieldsetDisabled}>{control}</fieldset>}
        <button id="submit" type="submit">submit</button><button id="reset-button" type="reset">reset</button>
      </form>
      <form id="alternate-form" onSubmit={submit}><button id="alternate-submit" type="submit">submit</button></form>
      <form id="decoy-form">{config.external && control}</form>
    </section>;
  }
  const root = createRoot(document.querySelector("#root"));
  window.disposeCollection = () => root.unmount();
  flushSync(() => root.render(<Fixture />));
`;

export async function runMultiSelectRequiredProof(browser) {
  const bundle = await build({
    stdin: { resolveDir: resolve("."), sourcefile: "multi-select-required-fixture.tsx", loader: "tsx", contents: fixtureSource },
    bundle: true, write: false, format: "iife", platform: "browser"
  });
  const page = await browser.newPage();
  const checks = [];
  const compare = (id, observed, expected) => {
    const ok = Object.entries(expected).every(([key, value]) => JSON.stringify(observed[key]) === JSON.stringify(value));
    checks.push({ id, expected, observed, ok });
  };
  const mount = async (config = {}) => {
    await page.evaluate(() => window.disposeCollection?.());
    await page.setContent("<!doctype html><meta charset='utf-8'><div id='root'></div>");
    await page.evaluate((initial) => { window.collectionInitialConfig = initial; }, config);
    await page.addScriptTag({ content: bundle.outputFiles[0].text });
    await page.waitForSelector("[data-collection-fixture]");
  };
  const observe = (formId = "selection-form") => page.evaluate((id) => {
    const form = document.getElementById(id);
    return {
      valid: form.checkValidity(), values: new FormData(form).getAll("values"),
      entries: Array.from(new FormData(form).entries()),
      checked: Array.from(document.querySelectorAll('#collection input[type="checkbox"]:checked'), (input) => input.value),
      optionRequired: Array.from(document.querySelectorAll('#collection input[type="checkbox"]'), (input) => input.required),
      active: document.activeElement?.id,
      changes: window.collectionChanges.map((values) => [...values]),
      callbackStates: window.collectionCallbackStates.map((entry) => ({ ...entry, values: [...entry.values] })),
      submissions: window.collectionSubmissions.map((entry) => ({ ...entry, values: [...entry.values] }))
    };
  }, formId);
  const reset = (formId = "selection-form") => page.evaluate((id) => {
    const form = document.getElementById(id);
    form.reset();
    return { valid: form.checkValidity(), values: new FormData(form).getAll("values"), changes: window.collectionChanges.map((values) => [...values]) };
  }, formId);
  const update = (patch) => page.evaluate((value) => window.updateCollection(value), patch);
  try {
    await mount();
    compare("required-empty", await observe(), { valid: false, values: [] });
    await page.locator("#submit").click();
    compare("validated-submit-blocked-and-focus", await observe(), { valid: false, submissions: [], active: "collection-option-1" });
    await page.locator("#collection-option-1").focus();
    await page.keyboard.press("Space");
    compare("keyboard-one-enabled-selection", await observe(), { valid: true, entries: [["values", "one"]], changes: [["one"]], active: "collection-option-1" });
    await page.keyboard.press("Tab");
    compare("tab-reaches-next-option", await observe(), { active: "collection-option-2" });
    await page.keyboard.press("Space");
    compare("keyboard-multiple-selections", await observe(), { valid: true, entries: [["values", "one"], ["values", "two"]], changes: [["one"], ["one", "two"]] });
    await page.locator("#submit").click();
    compare("validated-submit-successful-values", await observe(), { submissions: [{ form: "selection-form", values: ["one", "two"] }] });
    await page.locator(".tcrn-multi-select-group__clear").click();
    compare("clear-restores-invalidity", await observe(), { valid: false, values: [], changes: [["one"], ["one", "two"], []] });
    await page.locator("#collection-option-2").click();
    compare("reset-empty-immediate", await reset(), { valid: false, values: [] });
    await page.waitForFunction(() => !document.querySelector("#collection-option-2").checked);
    compare("reset-empty-model-and-callbacks", await observe(), { valid: false, values: [], changes: [["one"], ["one", "two"], [], ["two"]] });

    await mount({ submitOnChange: true });
    await page.locator("#collection-option-2").click();
    compare("callback-synchronous-validated-submit", await observe(), {
      valid: true, values: ["two"], callbackStates: [{ valid: true, values: ["two"] }],
      submissions: [{ form: "selection-form", values: ["two"] }]
    });
    await page.locator(".tcrn-multi-select-group__clear").click();
    const afterCallbackClear = await observe();
    compare("callback-clear-blocks-synchronous-submit", { ...afterCallbackClear, callbackValidity: afterCallbackClear.callbackStates.map((entry) => entry.valid) }, {
      valid: false, values: [], callbackValidity: [true, false],
      submissions: [{ form: "selection-form", values: ["two"] }]
    });

    await mount({ defaultValue: ["two", "one", "two", "unknown", "blocked"] });
    compare("closed-deduplicated-defaults-disabled-not-successful", await observe(), { valid: true, entries: [["values", "one"], ["values", "two"]], checked: ["blocked", "one", "two"] });
    await page.locator(".tcrn-multi-select-group__clear").click();
    compare("reset-valid-default-immediate", await reset(), { valid: true, values: ["one", "two"] });
    await page.waitForFunction(() => document.querySelector("#collection-option-1").checked);
    compare("reset-valid-default-model", await observe(), { valid: true, values: ["one", "two"], changes: [[]] });
    await update({ defaultValue: ["unknown", "blocked"] });
    compare("updated-default-reset-immediate", await reset(), { valid: false, values: [] });
    await page.waitForFunction(() => !document.querySelector("#collection-option-1").checked);
    compare("disabled-only-default-invalid", await observe(), { valid: false, checked: ["blocked"], values: [], changes: [[]] });

    await mount({ controlled: true, value: [], defaultValue: ["two"] });
    await page.locator("#collection-option-1").click();
    compare("controlled-rejected-change-retains-authority", await observe(), { valid: false, checked: [], changes: [["one"]] });
    await update({ value: ["two", "one", "two", "unknown", "blocked"], acceptChanges: true });
    compare("controlled-prop-update-normalizes-domain", await observe(), { valid: true, values: ["one", "two"], checked: ["blocked", "one", "two"], changes: [["one"]] });
    compare("controlled-reset-current-model-immediate", await reset(), { valid: true, values: ["one", "two"], changes: [["one"]] });
    await page.locator(".tcrn-multi-select-group__clear").click();
    compare("controlled-accepted-clear", await observe(), { valid: false, values: [], changes: [["one"], []] });
    await update({ value: ["one"] });
    await update({ options: [{ value: "one", label: "One", disabled: true }, { value: "two", label: "Two" }] });
    compare("selected-option-becomes-disabled", await observe(), { valid: false, checked: ["one"], values: [] });
    await update({ options: [{ value: "one", label: "One" }, { value: "two", label: "Two" }] });
    compare("selected-option-reenabled", await observe(), { valid: true, values: ["one"] });
    await update({ options: [{ value: "two", label: "Two" }] });
    compare("selected-option-removed", await observe(), { valid: false, checked: [], values: [] });

    await mount({ disabled: true, defaultValue: ["one"] });
    compare("disabled-group-excluded", await observe(), { valid: true, values: [], changes: [] });
    await update({ disabled: false });
    compare("reenabled-group-retains-selection", await observe(), { valid: true, values: ["one"] });
    await update({ fieldsetDisabled: true });
    compare("disabled-fieldset-native-exclusion", await observe(), { valid: true, values: [] });
    await mount({ required: false });
    compare("optional-empty", await observe(), { valid: true, values: [] });
    await page.locator("#submit").click();
    compare("optional-validated-submit", await observe(), { submissions: [{ form: "selection-form", values: [] }] });
    await update({ required: true });
    compare("required-prop-update", await observe(), { valid: false, values: [] });
    await update({ required: false });
    compare("optional-prop-update", await observe(), { valid: true, values: [] });

    for (const options of [[], [{ value: "blocked", label: "Blocked", disabled: true }]]) {
      await mount({ options, defaultValue: ["blocked"] });
      compare(`no-enabled-options-${options.length}`, await observe(), { valid: false, values: [] });
      await page.locator("#submit").click();
      compare(`no-enabled-options-submit-${options.length}`, await observe(), { valid: false, submissions: [], active: "collection" });
      await update({ disabled: true });
      compare(`no-enabled-options-disabled-${options.length}`, await observe(), { valid: true, values: [] });
    }

    await mount({ external: true });
    compare("external-required-empty", await observe(), { valid: false, values: [] });
    compare("enclosing-decoy-is-not-owner", await observe("decoy-form"), { valid: true, values: [] });
    await page.locator("#collection-option-1").click();
    await page.locator("#submit").click();
    compare("external-submit-values", await observe(), { valid: true, entries: [["values", "one"]], submissions: [{ form: "selection-form", values: ["one"] }] });
    compare("external-reset-immediate", await reset(), { valid: false, values: [] });
    await page.waitForFunction(() => !document.querySelector("#collection-option-1").checked);
    await update({ formId: "alternate-form" });
    await page.locator("#collection-option-2").click();
    compare("form-prop-reassociation", await observe("alternate-form"), { valid: true, values: ["two"] });
    compare("previous-form-released", await observe(), { valid: true, values: [] });
    compare("reassociated-reset-immediate", await reset("alternate-form"), { valid: false, values: [] });
    await page.waitForFunction(() => !document.querySelector("#collection-option-2").checked);
    compare("reassociated-reset-model", await observe("alternate-form"), { valid: false, values: [], changes: [["one"], ["two"]] });

    await mount({ presentation: "native" });
    compare("native-required-empty", await observe(), { valid: false, values: [] });
    await page.locator("select[name=values]").selectOption(["one", "two"]);
    compare("native-multiple-selection", await observe(), { valid: true, entries: [["values", "one"], ["values", "two"]], changes: [["one", "two"]] });
    await page.locator("#submit").click();
    compare("native-validated-submit", await observe(), { submissions: [{ form: "selection-form", values: ["one", "two"] }] });
    await page.locator("select[name=values]").selectOption([]);
    compare("native-clear", await observe(), { valid: false, values: [], changes: [["one", "two"], []] });
    compare("native-reset", await reset(), { valid: false, values: [] });
    await update({ disabled: true });
    compare("native-disabled", await observe(), { valid: true, values: [] });
    await mount({ presentation: "native", controlled: true, value: ["one"], external: true });
    compare("native-controlled-external", await observe(), { valid: true, values: ["one"] });

    await mount({ ariaOnly: true });
    const ariaOnly = await observe();
    compare("negative-aria-only-does-not-constrain-form", ariaOnly, { valid: true, values: [] });
    await page.locator("#submit").click();
    compare("negative-aria-only-submit-actually-succeeds", await observe(), { submissions: [{ form: "selection-form", values: [] }] });
    return {
      fixtureDigest: `sha256:${createHash("sha256").update(readFileSync(fileURLToPath(import.meta.url))).digest("hex")}`,
      browserVersion: browser.version(), checks,
      mismatches: checks.filter((check) => !check.ok).map((check) => check.id),
      ok: checks.every((check) => check.ok)
    };
  } finally {
    await page.evaluate(() => window.disposeCollection?.());
    await page.close();
  }
}
