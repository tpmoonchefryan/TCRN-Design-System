// Locale-invariant ledger — TCRN-DS-STORY-048 (systematic English-leak gate).
//
// The only rendered-text localization gate before this story was a hand-authored
// requiredText/forbiddenText blocklist over four sample routes. It caught the specific
// strings a human pre-listed and nothing else, so ~1.5k multi-word English strings render
// on the localized routes with no gate. The runtime content swap is an exact-string
// dictionary lookup (apps/storybook/src/build/client-scripts.ts contentTextFor): any
// visible string with no dictionary entry silently renders English on the zh-CN route.
//
// This ledger backs a systematic scan: on the zh-CN render of every one of the 43 stories,
// a run of two or more consecutive Latin words that is neither exempt nor allowlisted is a
// leak, and it reds the gate. It is modelled on the "Demo-chrome exemption list" in
// scripts/shell-fidelity-proof.mjs: every entry is a documented, audited exception, because
// an entry blinds the gate to that surface ("门只保护它读过的字节").
//
// Three exception categories:
//   exemptSubtreeSelectors  subtrees whose rendered text is deliberately locale-invariant
//                           (visual-instance oracles; machine tokens in code/pre/kbd/samp;
//                           explicit data-locale-invariant opt-out). Removed before the scan.
//   properNouns             standalone Latin tokens that stay Latin on every locale. Stripped
//                           from a line before runs are measured, so they never seed a run.
//   translationDebtAllowlist  the CURRENTLY untranslated multi-word strings, per story. This
//                           is TEMPORARY audited debt: it is the exact worklist that
//                           TCRN-DS-STORY-049 burns down. When S049 translates a string, or
//                           S046/S047 reword one, its entry here is removed/updated in the
//                           SAME commit, or the gate diverges from what actually renders.
export const localeInvariantLedger = {
  // Cat 1 — subtrees whose rendered text is deliberately locale-invariant.
  exemptSubtreeSelectors: [
    // AOS visual-instance oracles. MUST mirror the runtime-swap skip in
    // apps/storybook/src/build/client-scripts.ts (visualInstanceSelector) and the attribute
    // emitted at aos-frontend-shell-slice.tsx / aos-owner-quality-product-shell.tsx. The
    // exemption is attribute-keyed, so it survives S057 relocating the oracles to Proof.
    "[data-storybook-visual-instance]",
    // Machine tokens: the 39-token colour index and every <code> identifier/value, plus the
    // pre/kbd/samp siblings. These are API identifiers and token values, not prose; they are
    // English on every locale by design. (The runtime swap does NOT skip <code> — these stay
    // English because they have no dictionary entry — so the gate must exempt them explicitly.)
    "code",
    "pre",
    "kbd",
    "samp",
    // Explicit opt-out for a machine-token surface rendered outside code/pre that would
    // otherwise false-positive (e.g. a token-value cell). Prefer a tag exemption first; add
    // this attribute at the render site only when the scan proves it necessary.
    "[data-locale-invariant]"
  ],
  // Cat 2 — standalone Latin tokens allowed to render on localized routes. SEED CONSERVATIVELY.
  // Component-name / API nouns (Tooltip, Popover, ProductShell, ...) are deliberately NOT here:
  // per repo doctrine ("understating is not safe") they default to translation debt (scanned)
  // and are an open decision shared with S049, not a silent exemption. Extend this list only
  // after a red-run review proves a token is a true locale-invariant identifier.
  properNouns: ["TCRN", "AOS", "TMS", "Storybook"],
  // Cat 3 — TEMPORARY audited translation debt: the multi-word Latin strings that currently
  // render on the zh-CN route with no dictionary translation, per story. This IS the
  // TCRN-DS-STORY-049 worklist. Seeded from the post-S046/S047 built pages. Append new
  // entries under the owning story id; remove an entry the moment S049 translates it.
  translationDebtAllowlist: {
    "ai-consumption-contract": [
      "AI JSON",
      "Design System",
      "Knowledge Management",
      "Owner Review",
      "Work Item",
      "Work Management",
      "story id",
    ],
    "aos-frontend-shell-slice": [
      "CN Work",
      "Design System",
      "story id",
    ],
    "aos-owner-quality-product-shell": [
      "Audit events",
      "CN Work",
      "Dummy Cockpit",
      "Frontend shell slice",
      "Local structural slice only",
      "Operations Cockpit",
      "frontend shell",
    ],
    "blocked-actions": [
      "GitHub remote",
    ],
    "brand-identity": [
      "iris blue",
    ],
    "button-spec-usage": [
      "trace ID",
    ],
    "color-palette": [
      "Owner review",
    ],
    "component-family-index": [
      "Work Item",
      "Work Management",
    ],
    "contribution-model": [
      "API DTO",
    ],
    "display-primitives-spec": [
      "Owner Review",
      "React ErrorBoundary",
    ],
    "field-spec-usage": [
      "Consent unavailable in this synthetic fixture",
      "Notes editing is unavailable in this synthetic fixture",
      "State selection is unavailable in this synthetic fixture",
    ],
    "foundation-visual-standards": [
      "AI JSON",
      "DS doc",
      "Work Management",
      "route id",
      "story id",
      "x36 radius",
    ],
    "global-states": [
      "Fail closed",
    ],
    "governance-boundaries": [
      "Owner Intent",
    ],
    "i18n-theme-contract": [
      "View Transition",
    ],
    "icons-motion": [
      "Lucide React",
      "ms ease",
      "ms linear",
    ],
    "interaction-disclosure-spec": [
      "Owner Review",
      "expanded prop",
    ],
    "knowledge-management-components-spec": [
      "Design System",
    ],
    "knowledge-management-density-collaboration-spec": [
      "Knowledge publishing is not wired in this static DS fixture",
    ],
    "knowledge-management-templates-spec": [
      "Static Design System template fixture",
      "product route owns creation",
    ],
    "maintainers-routing": [
      "Batch Push Gate",
      "Frontend Studio",
    ],
    "navigation-focused-shells-spec": [
      "Design System",
    ],
    "navigation-product-shell-spec": [
      "AI Operation System",
    ],
    "navigation-shell-spec": [
      "Design System",
    ],
    "release-bug-policy": [
      "Batch Push Gate",
    ],
    "selection-list-patterns": [
      "search list",
    ],
    "stamp-spec-usage": [
      "Design System",
      "pnpm stamp",
    ],
    "text-styles": [
      "Apple SD Gothic Neo",
      "Avenir Next",
      "CSS fallback",
      "Heiti SC",
      "Helvetica Neue",
      "Hiragino Sans",
      "Liberation Mono",
      "Malgun Gothic",
      "Microsoft YaHei",
      "Noto Sans CJK JP",
      "Noto Sans CJK KR",
      "Noto Sans CJK SC",
      "PingFang SC",
      "Source Han Sans JP",
      "Source Han Sans KR",
      "Source Han Sans SC",
      "Yu Gothic",
    ],
    "work-management-backlog-board-spec": [
      "No backend promotion in fixture",
      "Static fixture",
      "Static fixture only",
      "Work Item",
      "only affordance",
      "product route owns saved view changes",
    ],
    "work-management-components-spec": [
      "Evidence Task",
      "Work Item",
      "Work Management",
      "Work item",
    ],
    "work-management-inspector-spec": [
      "Live dispatch is not available in this static fixture",
      "Work Item",
    ],
    "work-management-patterns": [
      "Preview refresh is downstream and route",
    ],
    "work-management-route-detail-spec": [
      "No backend promotion is wired",
      "No live dispatch in this static fixture",
      "Preview inspection remains downstream",
      "Static fixture",
      "product route owns routing",
    ],
  }
};

// TCRN-DS-STORY-049: the per-child leak partition (previously a shared-inheritance shim from
// S059) is now precise — every story carries exactly its own residual runs, so no inheritance
// pass is needed.

// A leak is a run of >=2 consecutive Latin words that survives on the localized render after
// exempt subtrees are removed and proper-noun tokens are stripped. The multi-word floor makes
// the gate's definition equal to the debt's definition (a lone Latin token — an isolated
// identifier — is candidate-only, never a leak). Digits and "/" are not intra-run separators,
// so "28px / 36px", hex values and "px" columns never form a run. This function is the single
// detector: the scan in scripts/internal-alpha-browser-proof.mjs calls it, and the seed was
// produced by a byte-identical replica — the two MUST stay algorithmically identical.
export function findLatinLeaks(text, properNouns = localeInvariantLedger.properNouns) {
  const proper = new Set(properNouns.map((word) => word.toLowerCase()));
  const wordPattern = /[A-Za-z][A-Za-z0-9'’.]*/g;
  const runPattern = /[A-Za-z][A-Za-z0-9'’.]*(?:[ \t]+[A-Za-z][A-Za-z0-9'’.]*)+/g;
  const seen = new Set();
  const leaks = [];
  for (const rawLine of String(text ?? "").split(/[\r\n]+/)) {
    const line = rawLine.replace(/\s+/g, " ").trim();
    if (!line) {
      continue;
    }
    // Strip proper-noun tokens first, letting their neighbours join, so "Storybook governance"
    // reduces to the single word "governance" (no run) while "the AOS shell" -> "the shell".
    const stripped = line.replace(wordPattern, (word) => (proper.has(word.toLowerCase()) ? "" : word));
    for (const match of stripped.matchAll(runPattern)) {
      const run = match[0].replace(/\s+/g, " ").trim();
      if (run && !seen.has(run)) {
        seen.add(run);
        leaks.push(run);
      }
    }
  }
  return leaks;
}

// Story leaks that are present in the story's audited debt allowlist are tolerated; anything
// else is a NEW leak that reds the gate. Returned newLeaks is the delta the gate acts on.
export function partitionStoryLeaks(storyId, leaks) {
  const allowed = new Set(localeInvariantLedger.translationDebtAllowlist[storyId] ?? []);
  const newLeaks = [];
  const allowlisted = [];
  for (const leak of leaks) {
    (allowed.has(leak) ? allowlisted : newLeaks).push(leak);
  }
  return { storyId, newLeaks, allowlistedLeakCount: allowlisted.length };
}
