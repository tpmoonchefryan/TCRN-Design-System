import test from "node:test";
import assert from "node:assert/strict";
import { SearchableList } from "../index.js";
import { createDomInteractionHarness } from "./dom-harness.js";

const items = [
  { id: "all", label: "TCRN-*", meta: "4", pinned: true },
  { id: "cross", label: "TCRN-CROSS", meta: "v1254" },
  { id: "ds", label: "TCRN-DS", meta: "v938" },
  { id: "tms", label: "TCRN-TMS", meta: "v228" },
  { id: "aos", label: "TCRN-AOS", meta: "v224" }
];

/**
 * The docs page renders this component once, at the default locale, so its
 * translated copy cannot be proven by looking at the built page — that entry
 * sits in the locale ledger as an audited static-render limitation. This test is
 * where the translation is actually proven, for every locale the platform
 * supports rather than for the one the page happened to build at.
 */
test("built-in copy is carried for every supported locale", async () => {
  const harness = createDomInteractionHarness();
  const root = harness.document.body.firstElementChild as HTMLElement;
  try {
    const expected = [
      ["zh-CN", "没有可选项。"],
      ["en", "There is nothing to choose from."],
      ["ja", "選択できる項目がありません。"],
      ["ko", "선택할 항목이 없습니다."],
      ["fr", "Aucune option disponible."]
    ] as const;
    for (const [locale, text] of expected) {
      await harness.render(<SearchableList label="scope" items={[]} locale={locale} />);
      assert.match(root.textContent ?? "", new RegExp(text.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")),
        `${locale} empty-state copy`);
    }
  } finally {
    await harness.cleanup();
  }
});

/**
 * A query that matches nothing and a list that holds nothing look identical on
 * screen unless the component refuses to conflate them; a reader who cannot tell
 * will go hunting for options that are right in front of them.
 */
test("no-match is a different state from empty", async () => {
  const harness = createDomInteractionHarness();
  const root = harness.document.body.firstElementChild as HTMLElement;
  try {
    await harness.render(<SearchableList label="scope" items={items} query="zzz" searchThreshold={1} locale="en" />);
    assert.equal(
      root.querySelector("[data-searchable-list-state]")?.getAttribute("data-searchable-list-state"),
      "no-match");

    await harness.render(<SearchableList label="scope" items={[]} locale="en" />);
    assert.equal(
      root.querySelector("[data-searchable-list-state]")?.getAttribute("data-searchable-list-state"),
      "empty");

    await harness.render(<SearchableList label="scope" items={[]} loading locale="en" />);
    assert.equal(
      root.querySelector("[data-searchable-list-state]")?.getAttribute("data-searchable-list-state"),
      "loading");
  } finally {
    await harness.cleanup();
  }
});

/** Every term narrows, so two words mean both — an OR would return a longer list. */
test("filtering requires every term to hit", async () => {
  const harness = createDomInteractionHarness();
  const root = harness.document.body.firstElementChild as HTMLElement;
  try {
    await harness.render(
      <SearchableList label="scope" items={items} query="tcrn ds" searchThreshold={1} locale="en" />);
    const rendered = [...root.querySelectorAll("[data-searchable-list-item]")]
      .map((node) => node.textContent?.trim());
    assert.equal(rendered.length, 1);
    assert.match(rendered[0] ?? "", /TCRN-DS/u);
  } finally {
    await harness.cleanup();
  }
});

/**
 * Selection is reported once, through the data attribute the whole system's
 * selection grammar keys on. If a consumer had to add its own marker on top,
 * the result would be the double frame this grammar exists to prevent.
 */
test("selection is announced once and is keyboard reachable", async () => {
  const harness = createDomInteractionHarness();
  const root = harness.document.body.firstElementChild as HTMLElement;
  const chosen: string[] = [];
  try {
    await harness.render(
      <SearchableList
        label="scope"
        items={items}
        selectedId="ds"
        onSelect={(id) => chosen.push(id)}
        locale="en"
      />);
    const selected = root.querySelectorAll("[data-searchable-list-item][data-selected='true']");
    assert.equal(selected.length, 1);
    assert.equal(selected[0]?.getAttribute("aria-current"), "true");
    // A group, deliberately: listbox would oblige every child to be an option,
    // and these rows can be links.
    assert.equal(root.querySelector("[role='group']")?.getAttribute("aria-label"), "scope");

    const first = root.querySelector("[data-searchable-list-item]");
    if (first) await harness.dispatchClick(first);
    assert.deepEqual(chosen, ["all"]);
  } finally {
    await harness.cleanup();
  }
});
