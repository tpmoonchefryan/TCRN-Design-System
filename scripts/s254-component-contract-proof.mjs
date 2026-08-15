import { readFileSync } from "node:fs";

const files = {
  registry: "packages/ui-react/src/index.tsx",
  css: "packages/ui-react/src/components/Navigation/Navigation.tsx",
  story: "apps/storybook/src/contract-stories/story-content.tsx",
  formTest: "packages/ui-react/src/components/Form/Form.test.tsx",
  dataTest: "packages/ui-react/src/components/DataDisplay/DataDisplay.test.tsx",
  layoutTest: "packages/ui-react/src/components/Layout/Layout.test.tsx",
  domTest: "packages/ui-react/src/test/dom-harness.dom.spec.tsx"
};

const constructs = [
  { name: "Switch", root: "tcrn-switch", registryFile: "registry", testFile: "formTest" },
  { name: "StatCard", root: "tcrn-stat-card", registryFile: "registry", testFile: "dataTest" },
  { name: "SettingRow", root: "tcrn-setting-row", registryFile: "registry", testFile: "formTest" },
  { name: "FieldProvenance", root: "tcrn-field-provenance", registryFile: "registry", testFile: "formTest" },
  { name: "LineNumberedEditor", root: "tcrn-line-numbered-editor", registryFile: "registry", testFile: "formTest" },
  { name: "AppStatusBar", root: "tcrn-app-status-bar", registryFile: "registry", testFile: "layoutTest" },
  { name: "DefinitionList", root: "tcrn-definition-list", registryFile: "registry", testFile: "dataTest" },
  { name: "LockHint", root: "tcrn-lock-hint", registryFile: "registry", testFile: "formTest" }
];

const source = Object.fromEntries(Object.entries(files).map(([key, path]) => [key, readFileSync(path, "utf8")]));

function cssExport(sourceText) {
  const match = sourceText.match(/export const tcrnComponentCss = `([\s\S]*?)`;/);
  return match?.[1] ?? "";
}

function storyUsesConstruct(story, name) {
  return new RegExp(`<${name}(?:\\s|>)`).test(story);
}

function cssHasRoot(css, root) {
  return new RegExp(`\\.${root}(?=[\\s:{,>+~])`).test(css);
}

function checkContract(input = source) {
  const css = cssExport(input.css);
  const missing = [];
  for (const construct of constructs) {
    if (!input[construct.registryFile].includes(`"${construct.name}"`)) {
      missing.push(`registry:${construct.name}`);
    }
    if (!cssHasRoot(css, construct.root)) {
      missing.push(`css:${construct.root}`);
    }
    if (!storyUsesConstruct(input.story, construct.name)) {
      missing.push(`story:${construct.name}`);
    }
    if (!input[construct.testFile].includes(construct.name)) {
      missing.push(`test:${construct.name}`);
    }
  }
  if (!input.domTest.includes("tcrn-line-numbered-editor__gutter")) {
    missing.push("dom:line-numbered-editor-scroll");
  }
  return { ok: missing.length === 0, missing };
}

const baseline = checkContract();
const cssMutation = checkContract({
  ...source,
  css: source.css.replace(".tcrn-switch {", ".tcrn-switch-mutated {")
});
const registryMutation = checkContract({
  ...source,
  registry: source.registry.replace('  "Switch",\n', "")
});
const storyMutation = checkContract({
  ...source,
  story: source.story.replace("<Switch label=", "<SwitchMutated label=")
});

const receipt = {
  schemaVersion: "tcrn.inc254-component-contract-proof.v1",
  constructs: constructs.map(({ name, root }) => ({ name, root })),
  mergedNinthSlot: {
    name: "ModifiedIndicator",
    implementation: "SettingRow built-in modified marker and reset action",
    reason: "The marker has one consumer-owned meaning and must remain attached to the row that owns reset semantics.",
    alternative: "A separate public component could expose only the dot, but would split state ownership and add no independent layout contract.",
    ownerDecision: "unresolved_until_owner_acceptance"
  },
  baseline,
  mutations: {
    cssRootRemoved: cssMutation,
    registryNameRemoved: registryMutation,
    storyClassRemoved: storyMutation
  },
  ok: baseline.ok && !cssMutation.ok && !registryMutation.ok && !storyMutation.ok
};

console.log(JSON.stringify(receipt, null, 2));
if (!receipt.ok) process.exit(1);
