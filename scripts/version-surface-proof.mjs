#!/usr/bin/env node
/**
 * Every document that states this system's version states the current one.
 *
 * Three surfaces were found drifting at the 3.0.0 release, each by a different amount
 * (TCRN-DS-INC-007): docs/tms-adoption-guide.md said the packages were all at 2.0.0,
 * one release behind, and the three package READMEs said 1.0.0, two releases behind.
 * None of them was wrong when written. They drifted because a version bump was a
 * remembered list rather than a measured one, and the bump was remembered twice and
 * both times it was the same items that were forgotten — the ones no gate reads.
 *
 * The register below is the list, and it is closed: a version-bearing document that is
 * not in it fails this gate, so adding one forces the decision about who keeps it
 * current instead of leaving it to be discovered two releases later.
 *
 * The truth is packages/ui-react/package.json. It is the version this system publishes
 * under, and the other two packages are asserted equal to it rather than checked
 * independently — three manifests that can disagree is a different defect, and this
 * gate names it if they ever do.
 *
 * Deliberately NOT in the register: the frozen 1.0.0 baseline observation in
 * scripts/scaffold-proof.mjs. Those constants record what was true at a past readback
 * and moving them would falsify the record. They are required to be labelled as past
 * rather than required to be current, which is checked here as a wording assertion.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => readFileSync(join(repoRoot, relative), "utf8");

const TRUTH = "packages/ui-react/package.json";
const version = JSON.parse(read(TRUTH)).version;

/**
 * Every file that states the current package version, and the shape it states it in.
 * `pattern` must capture the version as group 1.
 */
const REGISTER = [
  { file: "packages/ui-tokens/package.json", pattern: /"version":\s*"([^"]+)"/ },
  { file: "packages/ui-copy-state/package.json", pattern: /"version":\s*"([^"]+)"/ },
  { file: "packages/ui-react/package.json", pattern: /"version":\s*"([^"]+)"/ },
  { file: "packages/ui-tokens/README.md", pattern: /Version `([^`]+)` is prepared/ },
  { file: "packages/ui-copy-state/README.md", pattern: /Version `([^`]+)` is prepared/ },
  { file: "packages/ui-react/README.md", pattern: /Version `([^`]+)` is prepared/ },
  { file: "docs/tms-adoption-guide.md", pattern: /Three packages, all at ([0-9]+\.[0-9]+\.[0-9]+):/ },
];

const findings = [];
const readbacks = [];

for (const entry of REGISTER) {
  let body;
  try {
    body = read(entry.file);
  } catch {
    findings.push(`${entry.file} is in the version register but does not exist — remove it from the register or restore the file`);
    continue;
  }
  const match = entry.pattern.exec(body);
  if (!match) {
    findings.push(
      `${entry.file} is in the version register but no longer states a version in the expected shape (${entry.pattern}) — either the wording changed and the register must follow, or the version claim was dropped and the entry should be removed deliberately`
    );
    continue;
  }
  readbacks.push({ file: entry.file, states: match[1] });
  if (match[1] !== version) {
    findings.push(`${entry.file} states version ${match[1]}, but ${TRUTH} says ${version}`);
  }
}

/**
 * The frozen baseline must keep saying it is frozen. If someone "helpfully" repoints
 * those constants at a later release, the labels are the thing that stops the receipt
 * from reading as a present-tense claim — so the labels are what is asserted.
 */
const scaffoldSource = read("scripts/scaffold-proof.mjs");
const baselineLabels = ["Release baseline version (frozen at the", "GitHub Release observed at baseline"];
for (const label of baselineLabels) {
  if (!scaffoldSource.includes(label)) {
    findings.push(
      `scripts/scaffold-proof.mjs no longer labels its 1.0.0 release observation as a past baseline ("${label}" is gone) — without that wording the receipt reads as a statement about the repository now`
    );
  }
}

const report = {
  ok: findings.length === 0,
  proof: "ds_version_surface",
  truth: TRUTH,
  version,
  registerSize: REGISTER.length,
  readbacks,
  findings,
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
process.exit(report.ok ? 0 : 1);
