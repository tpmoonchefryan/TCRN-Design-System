// Shared demo-layer sync + drift proof — TCRN-DS-STORY-034.
//
// `apps/storybook/src/story-demo-styles.ts` (`demoStoryCss`) is the single source for
// the story-demo/presentation CSS that BOTH doc stylesheets used to hand-maintain:
//   1. apps/storybook/src/alpha-styles.ts (Track B, static docs) imports `demoStoryCss`
//      and interpolates it directly — no sync needed there.
//   2. apps/storybook/src/storybook.css (Track A, real Storybook preview) is a plain
//      .css file that cannot import, so it carries a generated copy of `demoStoryCss`
//      between the marker comments below. This script keeps that copy in lockstep.
//
// Run with `--check` to prove storybook.css's generated region matches the module
// (build gate, wired into `tokens:proof`); run with no flag to regenerate it.
// The Track-A-only scaffolding and the token :root blocks live OUTSIDE the markers and
// are left untouched.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { demoStoryCss } from "../apps/storybook/dist/story-demo-styles.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STORYBOOK_CSS = path.join(root, "apps/storybook/src/storybook.css");

const START = "/* Demo layer generated from story-demo-styles.ts — do not hand-edit; run `pnpm demo-styles:sync` */";
const END = "/* End demo layer generated from story-demo-styles.ts */";

function region(raw) {
  const startIdx = raw.indexOf(START);
  if (startIdx === -1) throw new Error("storybook.css: demo-layer START marker not found");
  const endIdx = raw.indexOf(END, startIdx + START.length);
  if (endIdx === -1) throw new Error("storybook.css: demo-layer END marker not found");
  return {
    before: raw.slice(0, startIdx + START.length),
    current: raw.slice(startIdx + START.length, endIdx),
    after: raw.slice(endIdx)
  };
}

const check = process.argv.includes("--check");
const raw = fs.readFileSync(STORYBOOK_CSS, "utf8");
const { before, current, after } = region(raw);
const expected = `\n${demoStoryCss.replace(/\n+$/, "")}\n`;

if (current !== expected) {
  if (check) {
    console.error("DEMO LAYER DRIFT: apps/storybook/src/storybook.css generated region");
    console.error("  has drifted from apps/storybook/src/story-demo-styles.ts (demoStoryCss).");
    console.error("Run `pnpm demo-styles:sync` to regenerate it.");
    process.exit(1);
  }
  fs.writeFileSync(STORYBOOK_CSS, before + expected + after);
  console.log("regenerated apps/storybook/src/storybook.css demo layer from story-demo-styles.ts");
} else if (check) {
  console.log("demo layer in sync: storybook.css matches story-demo-styles.ts");
} else {
  console.log("apps/storybook/src/storybook.css demo layer already in sync");
}
