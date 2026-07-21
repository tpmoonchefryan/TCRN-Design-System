// Stamp whitelist proof — TCRN-DS-STORY-006 acceptance condition #6.
//
// The B「治理纸感」stamp language (serif face, oxblood ink, double rule) is admitted
// at three identity moments only: a gate closing, a ruling landing, a release being
// accepted. That restriction is the whole reason the language carries weight — an
// impression that appears on every panel is just decoration — so it is enforced here
// rather than asked for in prose.
//
// Two rules:
//   1. The stamp tokens may only be referenced by the stamp components themselves.
//      Any other component reaching for the serif face or the stamp geometry is a
//      violation, because it means the language leaked out of its moment.
//   2. `<Stamp moment=...>` may only name a moment from the closed set.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "packages/ui-react/src");

const STAMP_TOKENS = [
  "--tcrn-type-family-stamp",
  "--tcrn-type-size-stamp-min",
  "--tcrn-type-tracking-stamp"
];
const ALLOWED_MOMENTS = new Set(["gate-close", "ruling", "release"]);

// The stamp rules themselves live in the Navigation stylesheet (where the component
// CSS is authored) and the components live in Feedback.
const TOKEN_OWNERS = new Set([
  path.join(SRC, "components/Navigation/Navigation.tsx"),
  path.join(SRC, "components/Feedback/Feedback.tsx")
]);

const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) files.push(full);
  }
})(SRC);

const violations = [];
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  if (!TOKEN_OWNERS.has(file)) {
    for (const token of STAMP_TOKENS) {
      if (text.includes(token)) {
        violations.push(`${path.relative(root, file)} references ${token} outside the stamp components`);
      }
    }
    if (text.includes("tcrn-stamp")) {
      violations.push(`${path.relative(root, file)} uses the .tcrn-stamp class directly; render <Stamp> instead`);
    }
  }
  for (const match of text.matchAll(/moment=["']([a-z-]+)["']/g)) {
    if (!ALLOWED_MOMENTS.has(match[1])) {
      violations.push(`${path.relative(root, file)} stamps an unlisted moment "${match[1]}"`);
    }
  }
}

if (violations.length) {
  console.error("STAMP WHITELIST VIOLATION:");
  for (const v of violations) console.error(`  - ${v}`);
  console.error(`\nAdmitted moments: ${[...ALLOWED_MOMENTS].join(", ")}.`);
  console.error("The stamp language is restricted by design; widening it is an Owner decision, not a code change.");
  process.exit(1);
}

console.log(`pass  stamp language confined to its components; moments limited to ${[...ALLOWED_MOMENTS].join(", ")}`);
