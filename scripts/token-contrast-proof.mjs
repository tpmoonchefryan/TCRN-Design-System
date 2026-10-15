// Token contrast proof (C1) — TCRN-DS-STORY-120 GWT2 and GWT3.
//
// Every foreground/carrier pair the design system renders is checked in both themes against
// C1: text 4.5:1 (WCAG 1.4.3); control edges and the focus ring 3:1 (WCAG 1.4.11). Icons draw
// in currentColor, so each text pair also covers an icon drawn in that ink (4.5 is above 3);
// G+ has no icon-only colour token to check.
//
// Values come from @tcrn/ui-tokens only: createResolvedTokenMap(theme) expands every var()
// chain the way a browser computes it at the theme root, so the deprecated aliases and the
// focus ring resolve exactly as shipped. Nothing here repeats a colour value. Translucent
// colours (line-ctl, the washes) are composited over the surface they sit on before the ratio
// is taken, with the colour math the G+ boards use (docs/design/gplus-2026-10/tools/lib.mjs,
// `cr`), so a ratio printed here equals the boards' figure for the same pair.
//
// Product wordmark suffixes are logotype text. Which brand tokens are drawn as text comes from
// the contract (marks.json: a mark with a `suffix` draws it in its deep colour). Those pairs are
// measured at 4.5 like any text; a failing one passes only through an entry in
// WORDMARK_EXEMPTIONS that names the pair and the ruling. The entries are checked too: an entry
// that names a non-wordmark pair, lacks its ruling, or covers a pair that already passes fails
// the gate, so the register cannot turn into a blanket skip.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createResolvedTokenMap, tcrnGplusBrandTokens, tcrnThemeModes, tcrnTokens } from "../packages/ui-tokens/dist/index.js";
import { marks as contractMarks, tokens as contractTokens } from "../docs/design/gplus-2026-10/tools/data.mjs";
import { cr, fmt, parseColor } from "../docs/design/gplus-2026-10/tools/lib.mjs";

/** C1 minimum ratio for each role. */
export const C1 = Object.freeze({ text: 4.5, wordmark: 4.5, edge: 3, focus: 3 });

const color = (key) => `--tcrn-color-${key}`;
const pair = (kind, fg, on, under) => Object.freeze({ kind, fg: color(fg), on: color(on), ...(under ? { under: color(under) } : {}) });

/**
 * Fixed pairs. GWT2 asks for the first block. The rest are the pairs the previous gate held,
 * under their G+ names (the alias table in @tcrn/ui-tokens maps each old name to its new one).
 * `under` is the opaque surface beneath a translucent carrier.
 */
export const CONTRAST_PAIRS = Object.freeze([
  // GWT2: primary, secondary and tertiary ink on the paper and the canvas; the filled-primary label.
  pair("text", "ink", "panel"),
  pair("text", "ink", "bg"),
  pair("text", "ink-2", "panel"),
  pair("text", "ink-2", "bg"),
  pair("text", "ink-3", "panel"),
  pair("text", "ink-3", "bg"),
  pair("text", "on-acc", "acc"),
  // Accent text, stamp ink and status text, plain and on their washes.
  pair("text", "acc", "panel"),
  pair("text", "acc", "bg"),
  pair("text", "red", "panel"),
  pair("text", "red", "red-bg", "panel"),
  pair("text", "ok", "panel"),
  pair("text", "ok", "wash", "panel"),
  pair("text", "bad", "panel"),
  pair("text", "bad", "bad-bg", "panel"),
  pair("text", "warn", "panel"),
  pair("text", "warn", "wash", "panel"),
  // GWT2 and D2: line-ctl identifies a control and holds 3:1 on both surfaces. line, line-2 and
  // line-3 draw structural rules that never identify a control on their own, so they are not
  // held to 3:1.
  pair("edge", "line-ctl", "panel"),
  pair("edge", "line-ctl", "bg")
]);

const RULING = "TCRN-DS-MIN-20261011-GPLUS-RENEWAL D2 (each product's wordmark suffix takes its mark's deep colour)";
const SOURCE = "docs/design/gplus-2026-10/boards/V2-B1-Brand.dc.html section F (the wordmark is exempt from 4.5 as logotype)";
/**
 * Wordmark pairs below 4.5 that the rulings exempt, one entry per theme and surface. The two
 * night TMS entries are gone again (TCRN-DS-SUB-232): TCRN-DS-MIN-20261016-R6 D4 rules the TMS
 * suffix's night value for O-8 and INIT-015 closure S-6 as its mark's bright step (marks.json, the
 * value MIN-20261013-SHELL D7 suggested), which passes on the paper and on the canvas by itself;
 * by day the suffix keeps the approved deep colour (SHELL D2). An entry may still carry a
 * `pending` note, which the report and the axe run that reads this register print.
 */
export const WORDMARK_EXEMPTIONS = Object.freeze([
  Object.freeze({ theme: "light", fg: "--tcrn-brand-suffix-design-system", on: color("panel"), ruling: RULING, source: SOURCE }),
  Object.freeze({ theme: "light", fg: "--tcrn-brand-suffix-design-system", on: color("bg"), ruling: RULING, source: SOURCE })
]);

const short = (variable) => variable.replace(/^--tcrn-color-/, "").replace(/^--tcrn-/, "");

export function pairLabel({ kind, fg, on, under }) {
  const role = kind === "focus" ? "focus ring " : kind === "wordmark" ? "wordmark " : "";
  return `${role}${short(fg)} on ${short(on)}${under ? ` over ${short(under)}` : ""}`;
}

const FOCUS_RING = "--tcrn-focus-ring";

/**
 * The focus ring pairs, read from the --tcrn-focus-ring declaration: a gap spread and a wider
 * ring spread, each over a colour token. The ring must hold 3:1 against the gap colour, and
 * against the paper for containers that re-declare the gap surface as panel.
 */
export function focusRingPairs(tokens = tcrnTokens) {
  const raw = tokens.find((token) => token.variable === FOCUS_RING)?.value;
  if (!raw) return { pairs: [], problem: `${FOCUS_RING} is not defined` };
  const spreads = raw.split(/,(?![^()]*\))/).map((shadow) => /^\s*0\s+0\s+0\s+([\d.]+)px\s+var\(\s*(--[a-z0-9-]+)\s*\)\s*$/.exec(shadow));
  if (spreads.length < 2 || spreads.some((match) => !match)) {
    return { pairs: [], problem: `${FOCUS_RING} is not a gap spread and a ring spread over colour tokens: ${raw}` };
  }
  const ordered = spreads.map((match) => ({ spread: Number(match[1]), variable: match[2] })).sort((a, b) => a.spread - b.spread);
  const gap = ordered[0].variable;
  const ring = ordered[ordered.length - 1].variable;
  const pairs = [{ kind: "focus", fg: ring, on: gap }];
  if (gap !== color("panel")) pairs.push({ kind: "focus", fg: ring, on: color("panel") });
  return { pairs, problem: null };
}

/** Brand suffix tokens from the contract, split by whether their product's wordmark draws the suffix. */
export function wordmarkSuffixPairs({ brand = contractTokens.brand, marks = contractMarks.marks, published = tcrnGplusBrandTokens } = {}) {
  const pairs = [];
  const notes = [];
  const problems = [];
  const marksById = new Map(marks.map((mark) => [mark.id, mark]));
  const publishedVariables = new Set(published.map((token) => token.cssVar));
  const covered = new Set();
  for (const entry of brand) {
    if (!publishedVariables.has(entry.cssVar)) problems.push(`contract brand token ${entry.cssVar} is missing from @tcrn/ui-tokens`);
    const markId = /^marks\.json#([^.]+)\./.exec(entry.ref ?? "")?.[1];
    const mark = markId ? marksById.get(markId) : undefined;
    if (!mark) {
      problems.push(`contract brand token ${entry.cssVar} does not reference a mark in marks.json (ref ${entry.ref ?? "missing"})`);
      continue;
    }
    covered.add(mark.id);
    if (mark.suffix) {
      for (const on of [color("panel"), color("bg")]) pairs.push({ kind: "wordmark", fg: entry.cssVar, on });
    } else {
      notes.push(`${entry.cssVar}: the ${mark.name} wordmark has no suffix (marks.json wordmark rule for ${mark.font}), so the colour is never drawn as text`);
    }
  }
  for (const mark of marks) {
    if (mark.suffix && !covered.has(mark.id)) problems.push(`the ${mark.name} wordmark draws a suffix but the contract has no brand token for it`);
  }
  return { pairs, notes, problems };
}

const exemptionKey = (theme, fg, on) => `${theme}|${fg}|${on}`;

function exemptionProblem(entry) {
  if (!entry || typeof entry !== "object") return "is not an object";
  if (!tcrnThemeModes.includes(entry.theme)) return `names theme "${entry.theme}"`;
  if (typeof entry.fg !== "string" || typeof entry.on !== "string") return "does not name its pair";
  if (!/\bMIN-\d{8}\b/.test(entry.ruling ?? "") || !/\bD\d+\b/.test(entry.ruling ?? "")) return "lacks a ruling reference (minutes MIN-YYYYMMDD and decision Dn)";
  if (!String(entry.source ?? "").trim()) return "lacks the source that states the exemption";
  return null;
}

function compositeRatio(map, { fg, on, under }) {
  for (const variable of [fg, on, under]) {
    if (variable && map[variable] === undefined) return { missing: variable };
  }
  const fgValue = map[fg];
  const onValue = map[on];
  const underValue = under ? map[under] : undefined;
  try {
    if (underValue !== undefined && parseColor(underValue)[3] < 1) return { error: `${under} (${underValue}) is translucent; name the opaque surface beneath`, fgValue, onValue, underValue };
    if (underValue === undefined && parseColor(onValue)[3] < 1) return { error: `${on} (${onValue}) is translucent; name the surface beneath it`, fgValue, onValue };
    return { ratio: cr(fgValue, onValue, underValue ?? onValue), fgValue, onValue, underValue };
  } catch (error) {
    return { error: `not a colour: ${error.message}`, fgValue, onValue, underValue };
  }
}

/**
 * Runs C1 over the resolved token maps of both themes. `tokens` and `resolve` let a test swap a
 * value (GWT3); `exemptions` and `wordmarkContract` let it vary the register and the brand data.
 */
export function runTokenContrastProof({
  tokens = tcrnTokens,
  exemptions = WORDMARK_EXEMPTIONS,
  resolve = (theme) => createResolvedTokenMap(theme, tokens),
  wordmarkContract
} = {}) {
  const failures = [];
  const notes = [];
  const results = [];
  const focus = focusRingPairs(tokens);
  if (focus.problem) failures.push(focus.problem);
  const wordmarks = wordmarkSuffixPairs(wordmarkContract);
  failures.push(...wordmarks.problems);
  notes.push(...wordmarks.notes);
  const pairs = [...CONTRAST_PAIRS, ...focus.pairs, ...wordmarks.pairs];

  const register = new Map();
  for (const entry of exemptions) {
    const label = entry && typeof entry === "object" ? `${short(String(entry.fg))} on ${short(String(entry.on))} (${entry.theme})` : String(entry);
    const problem = exemptionProblem(entry);
    if (problem) {
      failures.push(`exemption for ${label} ${problem}; it is not applied`);
      continue;
    }
    const key = exemptionKey(entry.theme, entry.fg, entry.on);
    if (register.has(key)) {
      failures.push(`exemption for ${label} is registered twice`);
      continue;
    }
    register.set(key, { entry, label, used: false });
  }

  for (const theme of tcrnThemeModes) {
    let map;
    try {
      map = resolve(theme);
    } catch (error) {
      failures.push(`${theme}: the tokens do not resolve: ${error.message}`);
      continue;
    }
    for (const candidate of pairs) {
      const label = pairLabel(candidate);
      const name = `${label} (${theme})`;
      const min = C1[candidate.kind];
      const exemption = candidate.kind === "wordmark" ? register.get(exemptionKey(theme, candidate.fg, candidate.on)) : undefined;
      if (exemption) exemption.used = true;
      const measured = compositeRatio(map, candidate);
      const result = { theme, ...candidate, label, name, min, ...measured, status: "pass" };
      delete result.missing;
      delete result.error;
      if (measured.missing) {
        result.status = "missing";
        failures.push(`${name}: ${measured.missing} is not defined in the ${theme} token map`);
      } else if (measured.error) {
        result.status = "error";
        failures.push(`${name}: ${measured.error}`);
      } else {
        const below = measured.ratio < min;
        const values = `${candidate.fg} ${measured.fgValue} on ${candidate.on} ${measured.onValue}${candidate.under ? ` over ${candidate.under} ${measured.underValue}` : ""}`;
        if (below && exemption) {
          result.status = "exempt";
          result.exemption = exemption.entry;
        } else if (below) {
          result.status = "fail";
          const hint = candidate.kind === "wordmark" ? "; logotype text passes only through a registered exemption with its ruling" : "";
          failures.push(`${name}: ${fmt(measured.ratio)}:1 < ${min} (${values})${hint}`);
        } else if (exemption) {
          failures.push(`stale exemption for ${name}: the pair passes at ${fmt(measured.ratio)}:1; remove the registration`);
        }
      }
      results.push(result);
    }
  }

  for (const { label, used } of register.values()) {
    if (!used) failures.push(`exemption for ${label} matches no wordmark pair; exemptions cover product wordmark suffix text only`);
  }

  const lowest = (kinds) =>
    results
      .filter((result) => kinds.includes(result.kind) && result.status === "pass")
      .reduce((low, result) => (low && low.ratio <= result.ratio ? low : result), null);
  return {
    ok: failures.length === 0,
    results,
    failures,
    notes,
    exemptions: results.filter((result) => result.status === "exempt"),
    lowest: { text: lowest(["text", "wordmark"]), nonText: lowest(["edge", "focus"]) }
  };
}

export function formatReport(report) {
  const lines = ["token-contrast-proof · C1: text 4.5:1, control edge and focus ring 3:1; translucent colours composited over their surface"];
  for (const theme of tcrnThemeModes) {
    lines.push("", `── ${theme} ──`);
    for (const result of report.results.filter((entry) => entry.theme === theme)) {
      const ratio = result.ratio === undefined ? "  —  " : `${fmt(result.ratio)}:1`;
      const values = result.fgValue === undefined ? "" : `  ${result.fgValue} on ${result.onValue}${result.under ? ` over ${result.underValue}` : ""}`;
      const status = { pass: "pass", fail: "FAIL", exempt: "exempt", missing: "MISSING", error: "ERROR" }[result.status];
      const exemption = result.exemption ? `  — exempt: ${result.exemption.ruling}; ${result.exemption.source}${result.exemption.pending ? `; ${result.exemption.pending}` : ""}` : "";
      lines.push(`  ${status.padEnd(7)} ${ratio.padStart(8)}  min ${String(result.min).padEnd(3)}  ${result.label}${values}${exemption}`);
    }
  }
  if (report.notes.length) lines.push("", ...report.notes.map((note) => `note  ${note}`));
  if (report.failures.length) lines.push("", `FAILURES (${report.failures.length})`, ...report.failures.map((failure) => `  FAIL  ${failure}`));
  const low = (entry) => (entry ? `${fmt(entry.ratio)}:1, ${entry.name}` : "none");
  lines.push(
    "",
    `lowest text ${low(report.lowest.text)} · lowest edge or focus ring ${low(report.lowest.nonText)} · ${report.exemptions.length} wordmark exemption(s) applied`,
    report.ok ? "ALL PAIRS PASS" : `${report.failures.length} FAILURE(S)`
  );
  return lines.join("\n");
}

function isMain() {
  if (!process.argv[1]) return false;
  try {
    return fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (isMain()) {
  const report = runTokenContrastProof();
  console.log(formatReport(report));
  process.exit(report.ok ? 0 : 1);
}
