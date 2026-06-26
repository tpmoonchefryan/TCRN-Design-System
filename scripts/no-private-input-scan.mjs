import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { pathToFileURL } from "node:url";

const ignoredDirectories = new Set([
  ".codegraph",
  ".git",
  ".tarball-smoke",
  "dist",
  "node_modules",
  "storybook-preview-static",
  "storybook-static"
]);

const maxScanBytes = 1_000_000;
const outputReceiptPath = "docs/verification/internal-alpha/no-overclaim-scan.json";
const visualReceiptRoots = [
  "docs/verification/internal-alpha/screenshots",
  "docs/verification/storybook-visual-proof/screenshots"
];
const visualReceiptExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function isBinaryVisualReceipt(path) {
  return visualReceiptRoots.some((root) => path.startsWith(`${root}/`))
    && visualReceiptExtensions.has(extname(path).toLowerCase());
}

function walk(directory, context) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        walk(join(directory, entry.name), context);
      }
      continue;
    }
    if (!entry.isFile()) {
      continue;
    }
    const path = join(directory, entry.name);
    if (path === outputReceiptPath) {
      context.generatedReceiptExclusions.push({ file: path, reason: "regenerated_by_current_scan" });
      continue;
    }
    if (isBinaryVisualReceipt(path)) {
      context.binaryVisualReceiptExclusions.push({ file: path, reason: "binary_visual_receipt_not_text_scanned" });
      continue;
    }
    const stat = statSync(path);
    if (stat.size > maxScanBytes) {
      context.skippedFiles.push({ file: path, reason: "larger_than_scan_limit", bytes: stat.size });
      continue;
    }
    context.scannedFiles.push(path);
  }
}

const patterns = [
  { id: "private-key", pattern: /BEGIN (?:RSA |OPENSSH |EC |DSA )?PRIVATE KEY/ },
  { id: "aws-secret", pattern: /\bAWS_SECRET_ACCESS_KEY\b/ },
  { id: "env-assignment", pattern: /(?:^|\n)\s*(?:export\s+)?(?:[A-Z][A-Z0-9_]*_)?(?:API|AUTH|SESSION|SECRET|PASSWORD|TOKEN|KEY)(?:_[A-Z0-9]+)*\s*=/i },
  { id: "npm-token", pattern: /\/\/registry\.npmjs\.org\/:_authToken=/i },
  { id: "product-import", pattern: /from\s+["'][^"']*(?:TCRN-AOS|TCRN-TMS)/ },
  { id: "raw-local-path-dump", pattern: /\/Users\/ryanlan\/(?:\.ssh|\.aws|Library\/Keychains|Library\/Application Support)/ },
  { id: "raw-scanner-output", pattern: /\braw_(?:scanner|secret_scan)_output\s*:/i },
  { id: "positive-overclaim", pattern: /\b(?:product accepted|final mvp accepted|release ready|deployment ready|public ready|legal complete|dependency clean)\b/i }
];

function redactedHit(file, rule, matched) {
  return {
    file,
    rule,
    matchSha256: createHash("sha256").update(matched).digest("hex"),
    matchLength: matched.length,
    matchDisposition: rule === "positive-overclaim"
      ? "redacted_positive_overclaim_phrase"
      : "redacted_restricted_pattern_match"
  };
}

function isAllowedPolicyFixture(file, rule) {
  if (rule !== "positive-overclaim") {
    return false;
  }
  return file === "packages/ui-copy-state/src/index.ts"
    || file.endsWith(".test.ts")
    || file.endsWith(".test.tsx")
    || file.startsWith("scripts/");
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

const negativeFixtureChecks = [
  {
    id: "case_insensitive_env_assignment_detected",
    passed: patterns.find((rule) => rule.id === "env-assignment").pattern.test("api_token=redacted")
  },
  {
    id: "camel_case_non_env_assignment_ignored",
    passed: !patterns.find((rule) => rule.id === "env-assignment").pattern.test("keyboardChecklist = {}")
  },
  {
    id: "verification_receipt_overclaim_not_blanket_exempt",
    passed: !isAllowedPolicyFixture("docs/verification/internal-alpha/future-proof.md", "positive-overclaim")
  }
];

export function exitCodeForReceipt(receipt) {
  return receipt.ok ? 0 : 1;
}

export function buildScanReceipt() {
  const context = {
    scannedFiles: [],
    skippedFiles: [],
    binaryVisualReceiptExclusions: [],
    generatedReceiptExclusions: []
  };
  const hits = [];
  const policyOrNegativeFixtureHits = [];

  walk(".", context);

  for (const file of context.scannedFiles) {
    const body = readFileSync(file, "utf8");
    for (const rule of patterns) {
      const matches = findRuleMatches(body, rule.pattern);
      for (const matched of matches) {
        const hit = redactedHit(file, rule.id, matched.replace(/\s+/g, " ").trim());
        if (isAllowedPolicyFixture(file, rule.id)) {
          policyOrNegativeFixtureHits.push(hit);
        } else {
          hits.push(hit);
        }
      }
    }
  }

  return {
    ok: hits.length === 0 && context.skippedFiles.length === 0 && negativeFixtureChecks.every((check) => check.passed),
    scannedFiles: context.scannedFiles.length,
    skippedFiles: context.skippedFiles,
    binaryVisualReceiptExclusions: context.binaryVisualReceiptExclusions,
    generatedReceiptExclusions: context.generatedReceiptExclusions,
    negativeFixtureChecks,
    patterns: patterns.map((rule) => rule.id),
    claim: "policy_and_negative_fixture_hits_are_classified_separately_from_real_payload_leakage",
    policyOrNegativeFixtureHits,
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
  return exitCodeForReceipt(receipt);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(runScanCli());
}
