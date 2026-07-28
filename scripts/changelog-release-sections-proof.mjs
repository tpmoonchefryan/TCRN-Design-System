#!/usr/bin/env node
/**
 * The changelog tells the truth about what has shipped.
 *
 * Two releases were cut without moving the "## Unreleased" heading, so the section
 * a reader is told is unreleased held content that went out under v2.0.0 and v2.1.0,
 * and neither tag had a section of its own (TCRN-DS-INC-006).
 *
 * Nothing caught it, but not for the reason it first looks like. This file IS read by
 * a gate: the privacy scan walks the whole tree and reads every file's bytes, so
 * CHANGELOG.md goes through it — for forbidden phrases. Nothing asked whether what the
 * document says about releases is true. A file can be scanned thoroughly and still lie,
 * as long as nothing compares it to the thing it describes.
 *
 * Three rules, each measured against git rather than against the document's own claims:
 *
 *   shipped-not-unreleased  No entry under "## Unreleased" may be one that a tag already
 *                           contains. This is the defect itself: the earliest commit that
 *                           introduced the entry is looked up, and if any tag contains that
 *                           commit, the entry has shipped and is in the wrong section.
 *   tag-has-section         Every tag at or above the floor has a "## <version>" section.
 *   ahead-has-somewhere     If HEAD is ahead of the newest tag, there is somewhere for that
 *                           work to be written down — either a populated "## Unreleased"
 *                           or a section for a version no tag carries yet.
 *
 * The floor is 2.0.0 and is deliberate, though not for the reason it might seem: this
 * repository did cut version headings once — v1.0.0 and v1.0.5 both ship a CHANGELOG
 * whose only section is `## 1.0.0`, with no `## Unreleased` at all. So the five patch
 * releases v1.0.1 through v1.0.5 went out with no section of their own, and writing
 * them now would mean inventing five changelogs from memory, which is a worse defect
 * than the one being fixed. The floor is what this gate covers, stated rather than
 * implied.
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHANGELOG = "CHANGELOG.md";
const SECTION_FLOOR = "2.0.0";

function git(args) {
  return execFileSync("git", args, { cwd: repoRoot, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function parseVersion(text) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(text);
  return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : null;
}

function compareVersion(a, b) {
  for (let i = 0; i < 3; i += 1) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

const changelog = readFileSync(join(repoRoot, CHANGELOG), "utf8");
const lines = changelog.split("\n");

const sections = [];
lines.forEach((line, index) => {
  const match = /^## (.+?)\s*$/.exec(line);
  if (match) sections.push({ title: match[1], line: index + 1 });
});

/** Every "### " entry that sits under the "## Unreleased" heading. */
const unreleasedIndex = sections.findIndex((section) => section.title.toLowerCase() === "unreleased");
const unreleasedEntries = [];
if (unreleasedIndex !== -1) {
  const start = sections[unreleasedIndex].line;
  const end = sections[unreleasedIndex + 1] ? sections[unreleasedIndex + 1].line : lines.length + 1;
  for (let i = start; i < end - 1; i += 1) {
    const match = /^### (.+?)\s*$/.exec(lines[i]);
    if (match) unreleasedEntries.push({ heading: lines[i], title: match[1], line: i + 1 });
  }
}

const tags = git(["tag", "--list"])
  .split("\n")
  .map((tag) => tag.trim())
  .filter(Boolean)
  .map((tag) => ({ tag, version: parseVersion(tag.replace(/^v/, "")) }))
  .filter((entry) => entry.version !== null);

const findings = [];

if (tags.length === 0) {
  // A clone fetched without tags cannot answer any of these questions. Say that,
  // rather than reporting the silence as a pass.
  process.stdout.write(
    `${JSON.stringify({ ok: true, proof: "ds_changelog_release_sections", skipped: "no-tags-visible", note: "this clone has no version tags, so nothing here could be measured" }, null, 2)}\n`
  );
  process.exit(0);
}

// shipped-not-unreleased
for (const entry of unreleasedEntries) {
  let addedBy = "";
  try {
    const history = git(["log", "--format=%H", "-S", entry.heading, "--", CHANGELOG]);
    addedBy = history ? history.split("\n").filter(Boolean).pop() : "";
  } catch {
    addedBy = "";
  }
  if (!addedBy) continue;
  let containing = [];
  try {
    containing = git(["tag", "--contains", addedBy]).split("\n").map((tag) => tag.trim()).filter(Boolean);
  } catch {
    containing = [];
  }
  if (containing.length > 0) {
    findings.push(
      `${CHANGELOG}:${entry.line} "${entry.title}" sits under Unreleased, but the commit that added it (${addedBy.slice(0, 8)}) is already carried by ${containing.join(", ")} — it shipped, and belongs under that version's section`
    );
  }
}

// tag-has-section
const floor = parseVersion(SECTION_FLOOR);
const sectionTitles = new Set(sections.map((section) => section.title));
const covered = tags.filter((entry) => compareVersion(entry.version, floor) >= 0);
for (const entry of covered) {
  const want = entry.version.join(".");
  if (!sectionTitles.has(want)) {
    findings.push(`${CHANGELOG} has no "## ${want}" section, but tag ${entry.tag} exists — this file does not account for a version that shipped (the GitHub Release may still carry notes; this gate is about this document)`);
  }
}

// ahead-has-somewhere
const newest = tags.slice().sort((a, b) => compareVersion(a.version, b.version)).pop();
let aheadCount = 0;
try {
  aheadCount = Number(git(["rev-list", "--count", `${newest.tag}..HEAD`]) || "0");
} catch {
  aheadCount = 0;
}
const taggedVersions = new Set(tags.map((entry) => entry.version.join(".")));
const pendingSections = sections
  .filter((section) => parseVersion(section.title) && !taggedVersions.has(section.title))
  .map((section) => section.title);
const unreleasedPopulated = unreleasedIndex !== -1 && unreleasedEntries.length > 0;
if (aheadCount > 0 && pendingSections.length === 0 && !unreleasedPopulated) {
  findings.push(
    `HEAD is ${aheadCount} commit(s) ahead of ${newest.tag}, but ${CHANGELOG} has neither a populated "## Unreleased" section nor a section for an untagged version — that work is written down nowhere`
  );
}

const report = {
  ok: findings.length === 0,
  proof: "ds_changelog_release_sections",
  source: CHANGELOG,
  sectionFloor: SECTION_FLOOR,
  sections: sections.map((section) => section.title),
  tagsCovered: covered.map((entry) => entry.tag),
  tagsBelowFloor: tags.filter((entry) => compareVersion(entry.version, floor) < 0).map((entry) => entry.tag),
  unreleasedEntryCount: unreleasedEntries.length,
  headAheadOfNewestTag: aheadCount,
  pendingSections,
  findings,
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
process.exit(report.ok ? 0 : 1);
