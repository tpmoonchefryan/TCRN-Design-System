// token-contrast-proof: C1 on the G+ tokens (TCRN-DS-STORY-120 GWT2, GWT3).
// The GWT3 mutation lives here: ink-3 reverted to the old text-muted value must turn the gate
// red and name the pair, both in process and through the gate's own command line.
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createResolvedTokenMap, tcrnGplusBrandTokens, tcrnTokens } from "../packages/ui-tokens/dist/index.js";
import { cr, fmt } from "../docs/design/gplus-2026-10/tools/lib.mjs";
import { marks as contractMarks, tokens as contractTokens } from "../docs/design/gplus-2026-10/tools/data.mjs";
import { C1, WORDMARK_EXEMPTIONS, runTokenContrastProof } from "../scripts/token-contrast-proof.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OLD_INK_3 = "#8a8c93";

const withValue = (variable, value) => {
  assert.ok(tcrnTokens.some((token) => token.variable === variable), `${variable} is a published token`);
  return tcrnTokens.map((token) => (token.variable === variable ? { ...token, value } : token));
};
const byName = (report, name) => {
  const result = report.results.find((entry) => entry.name === name);
  assert.ok(result, `the gate checks ${name}`);
  return result;
};
const failing = (report) => report.results.filter((entry) => entry.status === "fail").map((entry) => entry.name).sort();

test("the shipped tokens meet C1 in both themes: GWT2 pairs pass, only the registered wordmark pairs are exempt", () => {
  const report = runTokenContrastProof();
  assert.deepEqual(report.failures, []);
  assert.equal(report.ok, true);
  const gwt2 = [
    ...["ink", "ink-2", "ink-3"].flatMap((ink) => ["panel", "bg"].map((on) => [`${ink} on ${on}`, C1.text])),
    ["on-acc on acc", C1.text],
    ["line-ctl on panel", C1.edge],
    ["line-ctl on bg", C1.edge],
    ["focus ring acc on surface", C1.focus]
  ];
  assert.deepEqual([C1.text, C1.edge, C1.focus], [4.5, 3, 3]);
  for (const theme of ["light", "dark"]) {
    const resolved = createResolvedTokenMap(theme);
    for (const [label, min] of gwt2) {
      const result = byName(report, `${label} (${theme})`);
      assert.equal(result.status, "pass", result.name);
      assert.equal(result.min, min, result.name);
      assert.ok(result.ratio >= min, `${result.name} ${result.ratio}`);
      // The measured colours are the package's resolved values, not copies.
      assert.equal(result.fgValue, resolved[result.fg], result.name);
      assert.equal(result.onValue, resolved[result.on], result.name);
    }
  }
  const exempt = report.exemptions.map((entry) => entry.name).sort();
  assert.deepEqual(exempt, WORDMARK_EXEMPTIONS.map((entry) => `wordmark ${entry.fg.replace("--tcrn-", "")} on ${entry.on.replace("--tcrn-color-", "")} (${entry.theme})`).sort());
  for (const entry of report.exemptions) {
    assert.equal(entry.kind, "wordmark");
    assert.ok(entry.ratio < C1.wordmark, entry.name);
    assert.match(entry.exemption.ruling, /MIN-20261011\b.*\bD2\b/);
    assert.match(entry.exemption.source, /V2-B1-Brand\.dc\.html section F/);
  }
});

test("the gate holds no colour of its own", () => {
  const source = fs.readFileSync(path.join(repoRoot, "scripts/token-contrast-proof.mjs"), "utf8");
  assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(source, /rgba?\(\s*\d/);
});

test("GWT3: ink-3 reverted to #8a8c93 turns the gate red and names the pair", (t) => {
  const report = runTokenContrastProof({ tokens: withValue("--tcrn-color-ink-3", OLD_INK_3) });
  assert.equal(report.ok, false);
  assert.deepEqual(failing(report), ["ink-3 on bg (light)", "ink-3 on panel (light)"]);
  const text = report.failures.join("\n");
  assert.match(text, /^ink-3 on panel \(light\): \d\.\d\d:1 < 4\.5 \(--tcrn-color-ink-3 #8a8c93 on --tcrn-color-panel /m);
  assert.match(text, /^ink-3 on bg \(light\): \d\.\d\d:1 < 4\.5 \(--tcrn-color-ink-3 #8a8c93 on --tcrn-color-bg /m);
  for (const failure of report.failures) t.diagnostic(`red as expected: ${failure}`);
  // The night value is its own token and stays green.
  assert.equal(byName(report, "ink-3 on panel (dark)").status, "pass");
});

// A throwaway copy of the gate, the built token package and the contract tools, so the
// mutation can be written into the build the gate actually reads.
function gateCopy(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "tcrn-contrast-proof-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const rel of ["scripts/token-contrast-proof.mjs", "packages/ui-tokens/package.json", "docs/design/gplus-2026-10/tools/lib.mjs", "docs/design/gplus-2026-10/tools/data.mjs"]) {
    fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    fs.cpSync(path.join(repoRoot, rel), path.join(root, rel));
  }
  for (const rel of ["packages/ui-tokens/dist", "docs/design/gplus-2026-10/contract"]) fs.cpSync(path.join(repoRoot, rel), path.join(root, rel), { recursive: true });
  return root;
}

test("GWT3 through the gate process: green on the shipped build, exit 1 naming the pair once ink-3 is reverted", (t) => {
  const root = gateCopy(t);
  const run = () => spawnSync(process.execPath, [path.join(root, "scripts/token-contrast-proof.mjs")], { encoding: "utf8" });
  const green = run();
  assert.equal(green.status, 0, green.stdout + green.stderr);
  assert.match(green.stdout, /ALL PAIRS PASS/);

  const generated = path.join(root, "packages/ui-tokens/dist/gplus-tokens.generated.js");
  const source = fs.readFileSync(generated, "utf8");
  const pattern = /("key": "ink-3",[^}]*?"light": ")(#[0-9a-f]{6})(")/;
  const shipped = pattern.exec(source)?.[2];
  assert.ok(shipped && shipped !== OLD_INK_3, "the build carries a G+ ink-3");
  fs.writeFileSync(generated, source.replace(pattern, `$1${OLD_INK_3}$3`));

  const red = run();
  assert.equal(red.status, 1, red.stdout + red.stderr);
  assert.match(red.stdout, /^ {2}FAIL {2}ink-3 on panel \(light\): .*--tcrn-color-ink-3 #8a8c93/m);
  assert.match(red.stdout, /^ {2}FAIL {2}ink-3 on bg \(light\): /m);
  assert.match(red.stdout, /2 FAILURE\(S\)/);
  t.diagnostic(red.stdout.split("\n").filter((line) => line.includes("FAIL")).join(" | "));
});

test("translucent colours are composited over their surface before the ratio is taken", () => {
  const report = runTokenContrastProof();
  const line = byName(report, "line-ctl on panel (light)");
  const [r, g, b, alpha] = line.fgValue.match(/[\d.]+/g).map(Number);
  assert.ok(alpha < 1, "line-ctl is translucent");
  assert.equal(line.ratio, cr(line.fgValue, line.onValue, line.onValue));
  const opaque = cr(`rgb(${r}, ${g}, ${b})`, line.onValue, line.onValue);
  assert.ok(line.ratio < opaque / 2, `composited ${line.ratio} against opaque ${opaque}`);

  // line-ctl thinned to the structural line-3 value drops below 3:1 on both surfaces.
  const thin = runTokenContrastProof({ tokens: withValue("--tcrn-color-line-ctl", createResolvedTokenMap("light")["--tcrn-color-line-3"]) });
  assert.deepEqual(failing(thin), ["line-ctl on bg (light)", "line-ctl on panel (light)"]);
});

test("the focus ring pairs are read from --tcrn-focus-ring", () => {
  const ring = tcrnTokens.find((token) => token.variable === "--tcrn-focus-ring").value;
  // Both theme blocks declare the ring with the same text, so the ring pairs apply to both themes.
  const washed = runTokenContrastProof({ tokens: withValue("--tcrn-focus-ring", ring.replace("var(--tcrn-color-acc)", "var(--tcrn-color-acc-bg)")) });
  assert.deepEqual(failing(washed), ["dark", "light"].flatMap((theme) => [`focus ring acc-bg on panel (${theme})`, `focus ring acc-bg on surface (${theme})`]).sort());
  const malformed = runTokenContrastProof({ tokens: withValue("--tcrn-focus-ring", "none") });
  assert.equal(malformed.ok, false);
  assert.match(malformed.failures.join("\n"), /--tcrn-focus-ring is not a gap spread and a ring spread/);
});

test("a wordmark pair below 4.5 without a registration fails and names the pair", () => {
  // The register holds the two light Design System pairs and the two night TMS pairs; without
  // them those four pairs fail.
  assert.deepEqual([...new Set(WORDMARK_EXEMPTIONS.map((entry) => `${entry.theme} ${entry.fg}`))], ["light --tcrn-brand-suffix-design-system", "dark --tcrn-brand-suffix-tms"]);
  const report = runTokenContrastProof({ exemptions: [] });
  assert.deepEqual(failing(report), [
    "wordmark brand-suffix-design-system on bg (light)",
    "wordmark brand-suffix-design-system on panel (light)",
    "wordmark brand-suffix-tms on bg (dark)",
    "wordmark brand-suffix-tms on panel (dark)"
  ]);
  assert.match(report.failures.join("\n"), /logotype text passes only through a registered exemption/);
});

test("D7: by night the TMS suffix keeps the approved colour, below 4.5 on the paper and the canvas, exempt only as a pending known red", () => {
  const report = runTokenContrastProof();
  const tms = tcrnGplusBrandTokens.find((token) => token.cssVar === "--tcrn-brand-suffix-tms");
  assert.equal(tms?.dark, undefined, "the TMS suffix has no night value of its own (MIN-20261013-SHELL D2)");
  assert.equal(tms?.value, "#2c63c8");
  const measured = {};
  for (const on of ["panel", "bg"]) {
    assert.equal(byName(report, `wordmark brand-suffix-tms on ${on} (light)`).status, "pass", `by day the suffix passes on ${on}`);
    const result = byName(report, `wordmark brand-suffix-tms on ${on} (dark)`);
    assert.equal(result.status, "exempt", result.name);
    assert.equal(result.fgValue, tms.value, `${result.name} measures the approved colour`);
    assert.ok(result.ratio < C1.wordmark, `${result.name} ${result.ratio}`);
    assert.match(result.exemption.ruling, /MIN-20261013-SHELL D2\b/);
    assert.match(result.exemption.source, /Shell\.dc\.html section B/);
    assert.match(result.exemption.pending, /^known red, pending the Owner: TCRN-DS-MIN-20261013-SHELL D7\b.*INIT-015 closure S-6/);
    measured[on] = fmt(result.ratio);
  }
  // The measured figures: the Shell board's section B gives the same two for the suffix row.
  assert.deepEqual(measured, { panel: "3.13", bg: "3.33" });

  // The register is what holds them: without the two night entries both pairs fail and are named.
  const unregistered = runTokenContrastProof({ exemptions: WORDMARK_EXEMPTIONS.filter((entry) => entry.fg !== "--tcrn-brand-suffix-tms") });
  assert.deepEqual(failing(unregistered), ["wordmark brand-suffix-tms on bg (dark)", "wordmark brand-suffix-tms on panel (dark)"]);

  // Once a night colour that passes is ruled (S-6; D7 suggests the mark's bright step), the two
  // entries are stale and the gate asks for them to be removed.
  const bright = contractMarks.marks.find((mark) => mark.id === "tms")?.palette.bright;
  assert.ok(bright, "marks.json has the TMS bright step");
  const ruled = runTokenContrastProof({
    resolve: (theme) => ({ ...createResolvedTokenMap(theme), ...(theme === "dark" ? { "--tcrn-brand-suffix-tms": bright } : {}) })
  });
  const ruledText = ruled.failures.join("\n");
  assert.match(ruledText, /stale exemption for wordmark brand-suffix-tms on panel \(dark\)/);
  assert.match(ruledText, /stale exemption for wordmark brand-suffix-tms on bg \(dark\)/);
});

test("an exemption never covers a non-wordmark pair", () => {
  const [model] = WORDMARK_EXEMPTIONS;
  const report = runTokenContrastProof({
    tokens: withValue("--tcrn-color-ink-3", OLD_INK_3),
    exemptions: [...WORDMARK_EXEMPTIONS, { ...model, theme: "light", fg: "--tcrn-color-ink-3", on: "--tcrn-color-panel" }]
  });
  assert.equal(byName(report, "ink-3 on panel (light)").status, "fail");
  assert.match(report.failures.join("\n"), /exemption for ink-3 on panel \(light\) matches no wordmark pair/);
});

test("an exemption whose pair passes is stale, and one without its ruling is not applied", () => {
  const tmsSuffix = tcrnGplusBrandTokens.find((token) => token.cssVar === "--tcrn-brand-suffix-tms").value;
  const stale = runTokenContrastProof({ tokens: withValue("--tcrn-brand-suffix-design-system", tmsSuffix) });
  const staleText = stale.failures.join("\n");
  assert.match(staleText, /stale exemption for wordmark brand-suffix-design-system on panel \(light\)/);
  assert.match(staleText, /stale exemption for wordmark brand-suffix-design-system on bg \(light\)/);

  const unruled = WORDMARK_EXEMPTIONS.map((entry, index) => (index === 0 ? { ...entry, ruling: "Owner said so" } : entry));
  const report = runTokenContrastProof({ exemptions: unruled });
  assert.match(report.failures.join("\n"), /exemption for brand-suffix-design-system on panel \(light\) lacks a ruling reference/);
  assert.equal(byName(report, "wordmark brand-suffix-design-system on panel (light)").status, "fail");
});

test("the wordmark scope comes from the contract; suffix-less marks are reported, not skipped silently", () => {
  const report = runTokenContrastProof();
  const notes = report.notes.join("\n");
  assert.match(notes, /--tcrn-brand-suffix-einzbern: the Einzbern wordmark has no suffix/);
  assert.match(notes, /--tcrn-brand-suffix-mana-orchestrate: the Mana Orchestrate wordmark has no suffix/);

  // Without its suffix, a wordmark draws no suffix text: its registrations then match nothing,
  // the light Design System pairs and the night TMS pairs alike.
  const marks = contractMarks.marks.map((mark) => (mark.id === "ds" ? { ...mark, suffix: undefined } : mark));
  const noSuffix = runTokenContrastProof({ wordmarkContract: { brand: contractTokens.brand, marks } });
  assert.match(noSuffix.failures.join("\n"), /exemption for brand-suffix-design-system on panel \(light\) matches no wordmark pair/);
  assert.equal(noSuffix.results.some((entry) => entry.fg === "--tcrn-brand-suffix-design-system"), false);
  const tmsMarks = contractMarks.marks.map((mark) => (mark.id === "tms" ? { ...mark, suffix: undefined } : mark));
  const noTmsSuffix = runTokenContrastProof({ wordmarkContract: { brand: contractTokens.brand, marks: tmsMarks } });
  const noTmsText = noTmsSuffix.failures.join("\n");
  assert.match(noTmsText, /exemption for brand-suffix-tms on panel \(dark\) matches no wordmark pair/);
  assert.match(noTmsText, /exemption for brand-suffix-tms on bg \(dark\) matches no wordmark pair/);
  assert.equal(noTmsSuffix.results.some((entry) => entry.fg === "--tcrn-brand-suffix-tms"), false);
});
