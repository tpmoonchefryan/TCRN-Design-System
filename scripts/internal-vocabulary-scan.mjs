import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";

// Forbidden internal-vocabulary gate (TCRN-DS-STORY-053).
//
// Scans the RENDERED visible text of every built page under
// apps/storybook/storybook-static/ for internal team vocabulary that must never
// reach a reader: internal story/epic/initiative keys, team persona names,
// vendor/model names, the retired agent net, dev ports, and vault paths. It
// exists to stop S046's one-time scrub from silently re-accruing.
//
// Why RENDERED text (not a source scan): source carries comment-only and
// dictionary-embedded occurrences that never render and would false-positive
// (e.g. `TCRN-DS-STORY-037` in CSS comments, `S039` in JSX comments). Stripping
// <script>/<style>/tags before matching scans only what a reader actually sees —
// which also drops the embedded i18n dictionary (a <script> tag), closing the
// gate-design hole where a pinned string can stop rendering without a gate noticing.
//
// FIXTURE-EXEMPTION LEDGER (domainDataExemptions below): four tokens are the
// functional sample hierarchy (story-content.tsx) that
// MachineTokenCell / WorkItemInspector legitimately render as *domain data*, not
// as internal references. They match the INIT-/EPIC-/STORY- rules but are exempt
// by EXACT literal (never by prefix) so the real INIT-008 / STORY-053 still fire.
// AOS-###, EV-###, DS-## fixture IDs are deliberately NOT in the lexicon at all
// (pure domain data) — do not add AOS-/EV-/DS- forbidden rules.

const outputRoot = "apps/storybook/storybook-static";
const outputReceiptPath = "docs/verification/internal-alpha/internal-vocabulary-scan.json";

// iframe.html is Storybook's preview host; sb-* are manager/addon bundles;
// index.json is a manifest, not a rendered page. None carry reader-facing copy.
const skippedPageNames = new Set(["iframe.html", "index.json"]);

const patterns = [
  { id: "gemini", pattern: /\bGemini\b/i },
  { id: "codex", pattern: /\bCodex\b/i },
  { id: "internal-story-key", pattern: /\bS0[0-9]{2}\b/ },
  { id: "initiative-id", pattern: /\bINIT-[A-Z0-9]+\b/ },
  { id: "epic-id", pattern: /\bEPIC-[A-Z0-9]+\b/ },
  { id: "story-id", pattern: /\bSTORY-[A-Z0-9][A-Z0-9-]*\b/ },
  { id: "tcrn-ds-key", pattern: /\bTCRN-DS-[A-Z0-9][A-Z0-9-]*\b/ },
  { id: "persona", pattern: /\b(?:Elara|Rowan|Ilya|Mara|Atlas|Arturo|Sable|Minerva)\b/i },
  { id: "dev-port", pattern: /\b4317\b/ },
  { id: "vault-path", pattern: /(?:TCRN-DESIGN-SYSTEM|vault\/initiatives)/i }
];

// Registered fixture domain-data — exempt by exact matched literal only.
const domainDataExemptions = new Set([
  "INIT-WM", // functional sample initiative
  "EPIC-CAPABILITY", // sample epic
  "EPIC-WORKSTREAM", // sample epic
  "STORY-WM-03" // sample story
]);

export function extractVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ");
}

function findRuleMatches(body, pattern) {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const regex = new RegExp(pattern.source, flags);
  const matches = [];
  let match;
  while ((match = regex.exec(body)) !== null) {
    matches.push(match[0]);
    if (match[0].length === 0) {
      regex.lastIndex += 1;
    }
  }
  return matches;
}

function redactedHit(page, rule, matched) {
  return {
    page,
    rule,
    matchSha256: createHash("sha256").update(matched).digest("hex"),
    matchLength: matched.length
  };
}

// Aggregate identical redacted hits per (page, rule, matchSha256) with a count so
// the receipt is stable and never stores a raw forbidden string.
function aggregate(records) {
  const byKey = new Map();
  for (const record of records) {
    const key = `${record.page}\u0000${record.rule}\u0000${record.matchSha256}`;
    const existing = byKey.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      byKey.set(key, { ...record, count: 1 });
    }
  }
  return [...byKey.values()].sort((a, b) =>
    a.page.localeCompare(b.page) || a.rule.localeCompare(b.rule) || a.matchSha256.localeCompare(b.matchSha256)
  );
}

// Classify already-extracted visible text into forbidden hits vs exempt domain
// data. Exposed for the companion test.
export function classifyVisibleText(page, visibleText) {
  const rawHits = [];
  const rawExempted = [];
  for (const rule of patterns) {
    for (const matched of findRuleMatches(visibleText, rule.pattern)) {
      const normalized = matched.replace(/\s+/g, " ").trim();
      const record = redactedHit(page, rule.id, normalized);
      if (domainDataExemptions.has(normalized)) {
        rawExempted.push(record);
      } else {
        rawHits.push(record);
      }
    }
  }
  return { hits: aggregate(rawHits), exempted: aggregate(rawExempted) };
}

export function classifyHtml(page, html) {
  return classifyVisibleText(page, extractVisibleText(html));
}

function ruleFor(id) {
  return patterns.find((rule) => rule.id === id).pattern;
}

// Detector self-tests: AND-ed into `ok`, so a regressed regex or exemption reds
// the gate deterministically on every run without any live-source dependency.
const negativeFixtureChecks = [
  { id: "codex_rule_detects_live_codex_dispatch", passed: ruleFor("codex").test("live Codex dispatch") },
  { id: "persona_rule_is_case_insensitive", passed: ruleFor("persona").test("elara") },
  { id: "internal_story_key_detects_s036", passed: ruleFor("internal-story-key").test("S036") },
  { id: "internal_story_key_ignores_short_prefix", passed: !ruleFor("internal-story-key").test("S0 rows") },
  { id: "internal_story_key_ignores_four_digit_run", passed: !ruleFor("internal-story-key").test("S1234") },
  { id: "initiative_rule_detects_init_008", passed: ruleFor("initiative-id").test("INIT-008") },
  { id: "exemption_covers_init_wm", passed: domainDataExemptions.has("INIT-WM") },
  { id: "exemption_excludes_init_008", passed: !domainDataExemptions.has("INIT-008") },
  { id: "vault_path_rule_detects_repo_slug", passed: ruleFor("vault-path").test("TCRN-DESIGN-SYSTEM") },
  {
    id: "clean_synthetic_page_yields_no_hits",
    passed: classifyHtml("synthetic.html", "<p>Buttons and badges render cleanly.</p>").hits.length === 0
  }
];

function collectScannablePages(root) {
  if (!existsSync(root)) {
    return [];
  }
  const pages = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const abs = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(abs);
        continue;
      }
      if (!entry.isFile() || !entry.name.toLowerCase().endsWith(".html")) {
        continue;
      }
      const rel = relative(root, abs).split(sep).join("/");
      if (skippedPageNames.has(entry.name) || /(?:^|\/)sb-/.test(rel)) {
        continue;
      }
      pages.push({ abs, name: rel });
    }
  };
  walk(root);
  return pages.sort((a, b) => a.name.localeCompare(b.name));
}

export function exitCodeForReceipt(receipt) {
  return receipt.ok ? 0 : 1;
}

export function buildScanReceipt() {
  const pages = collectScannablePages(outputRoot);
  const allHits = [];
  const allExempted = [];

  for (const page of pages) {
    const { hits, exempted } = classifyHtml(page.name, readFileSync(page.abs, "utf8"));
    allHits.push(...hits);
    allExempted.push(...exempted);
  }

  const hits = aggregate(allHits);
  const exemptedDomainDataHits = aggregate(allExempted);
  const scannedPages = pages.length;

  return {
    ok: hits.length === 0 && negativeFixtureChecks.every((check) => check.passed) && scannedPages > 0,
    outputRoot,
    scannedPages,
    pages: pages.map((page) => page.name),
    patterns: patterns.map((rule) => rule.id),
    exemptions: [...domainDataExemptions].sort(),
    negativeFixtureChecks,
    claim:
      "forbidden internal vocabulary is absent from rendered visible text; registered fixture domain-data tokens are classified separately",
    exemptedDomainDataHits,
    hits
  };
}

export function writeScanReceipt(receipt) {
  mkdirSync("docs/verification/internal-alpha", { recursive: true });
  writeFileSync(outputReceiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
}

export function runScanCli() {
  const receipt = buildScanReceipt();
  writeScanReceipt(receipt);
  console.log(JSON.stringify(receipt, null, 2));
  if (receipt.scannedPages === 0) {
    console.error(
      `internal-vocabulary-scan: found zero pages under ${outputRoot}/ — run the Storybook static build before this gate.`
    );
  }
  return exitCodeForReceipt(receipt);
}

// pathToFileURL, not string concatenation: this repository lives under a path
// with a space in it, so `file://${argv[1]}` never matches import.meta.url.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(runScanCli());
}
