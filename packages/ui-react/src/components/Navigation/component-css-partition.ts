// SPDX-License-Identifier: Apache-2.0
// TCRN-DS-INIT-012 — the component stylesheet, partitioned into core and domain.
//
// `tcrnComponentCss` is one template literal serving every component, and it is
// the sheet the consuming product actually injects. That made it the real obstacle
// to moving domain furniture out of DS core: the components could be moved, but
// their styling could not follow them, and a domain package whose styles still
// shipped from core would not have left core at all.
//
// The split is DERIVED, not cut. `tcrnComponentCss` keeps its exact bytes, so
// every consumer reading it today is untouched; the two halves below are computed
// from it by a function with a gate behind it. A hand-cut pair of sheets would be
// two rosters of the same rules with nothing comparing them — the shape this
// repository spent INC-008 removing.
//
// Migration, once the domain package exists: a consumer injects
// `tcrnCoreComponentCss` plus `tcrnDomainComponentCss` instead of the combined
// sheet, and drops the second when it stops using domain components.

import { tcrnComponentCss } from "./Navigation.js";

/**
 * Class-name prefixes that name a product entity, mirroring the four component
 * prefixes the generality gate refuses (`scripts/generic-primitive-scan.mjs`).
 * `relationship` and `machine-token` are here too: they carry no component of
 * their own but style the Work Management vocabulary.
 */
export const DOMAIN_CLASS_PREFIXES: readonly string[] = Object.freeze([
  "tcrn-work",
  "tcrn-knowledge",
  "tcrn-gate",
  "tcrn-evidence",
  "tcrn-relationship",
  "tcrn-machine-token",
]);

/**
 * Domain furniture whose class names do not carry a domain prefix.
 *
 * Found by looking rather than by reading names: these are the classes that share
 * rule bodies with prefixed domain classes. `MetadataRail` and `SavedViewToolbar`
 * are Work Management components (see the component family index) that happen to
 * be named structurally. The other classes sharing those rules —
 * `tcrn-module-tabs`, `tcrn-section-tabs`, `tcrn-segmented-nav`,
 * `tcrn-product-launcher`, `tcrn-product-switcher`, `tcrn-template-gallery` — are
 * genuinely generic and deliberately absent from this list.
 */
export const DOMAIN_EXTRA_CLASSES: readonly string[] = Object.freeze([
  "tcrn-metadata-rail",
  "tcrn-saved-view-toolbar",
]);

function withoutComments(text: string): string {
  return text.replace(/\/\*[\s\S]*?\*\//gu, "");
}

/** Top-level blocks, in source order. Brace-balanced so nested at-rules stay whole. */
export function topLevelBlocks(css: string): string[] {
  const blocks: string[] = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < css.length; index += 1) {
    const character = css[index];
    if (character === "{") depth += 1;
    else if (character === "}") {
      depth -= 1;
      if (depth === 0) {
        blocks.push(css.slice(start, index + 1));
        start = index + 1;
      }
    }
  }
  return blocks;
}

/**
 * Attribute selectors that name a product entity.
 *
 * `[data-work-list]` is the only one in the current sheet, and the gate is what
 * found it: the first draft matched class syntax alone, so that selector was sorted
 * into CORE while its twin `.tcrn-work-list` went to domain — a Work Management
 * element left styled by the generic sheet. Reading class names is not the same as
 * reading selectors, and the difference was one silent visual defect wide.
 */
const DOMAIN_ATTRIBUTE_PREFIXES: readonly string[] = Object.freeze([
  "data-work",
  "data-knowledge",
  "data-gate",
  "data-evidence",
  "data-relationship",
  "data-machine-token",
]);

export function isDomainSelector(selector: string): boolean {
  const text = selector.trim();
  if (DOMAIN_CLASS_PREFIXES.some((prefix) => text.includes(`.${prefix}`))) return true;
  if (DOMAIN_ATTRIBUTE_PREFIXES.some((prefix) => text.includes(`[${prefix}`))) return true;
  return DOMAIN_EXTRA_CLASSES.some(
    (name) => text.includes(`.${name}`) || text.includes(`[data-${name.slice(5)}]`)
  );
}

export interface CssPartition {
  readonly core: string;
  readonly domain: string;
  /** Blocks whose selector list spans both sides; their body is duplicated. */
  readonly splitBlockCount: number;
}

/**
 * Partition one stylesheet into a generic half and a domain half.
 *
 * Twelve blocks in the current sheet carry a selector list that spans both — a
 * shared hover, focus-visible or dense treatment applied across nav-like surfaces
 * where some are domain and some are not. Those are SPLIT, not assigned: the
 * selector list is divided and the identical declaration body appears in each
 * half. Assigning such a block whole would either drop styling from one side or
 * carry a domain selector into core, and both are silent visual defects.
 *
 * Order is preserved within each half, so the only cascade question is between
 * halves. Concatenating core before domain is safe here because, after the split,
 * no core rule selects a domain element except through these duplicated bodies —
 * which are byte-identical on both sides and therefore cannot disagree.
 */
export function partitionComponentCss(css: string): CssPartition {
  const core: string[] = [];
  const domain: string[] = [];
  let splitBlockCount = 0;

  for (const block of topLevelBlocks(css)) {
    const braceAt = block.indexOf("{");
    const head = block.slice(0, braceAt);
    const body = block.slice(braceAt);
    const selectors = withoutComments(head)
      .split(",")
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);

    if (selectors.length === 0) {
      // An at-rule such as `@media` has no comma-separated selector list at this
      // level; it stays with core and its nested domain rules travel with it. The
      // gate below is what would catch that becoming untrue.
      core.push(block);
      continue;
    }

    const domainSelectors = selectors.filter((entry) => isDomainSelector(entry));
    const coreSelectors = selectors.filter((entry) => !isDomainSelector(entry));

    if (domainSelectors.length === 0) core.push(block);
    else if (coreSelectors.length === 0) domain.push(block);
    else {
      splitBlockCount += 1;
      core.push(`\n${coreSelectors.join(",\n")} ${body}`);
      domain.push(`\n${domainSelectors.join(",\n")} ${body}`);
    }
  }

  return { core: core.join(""), domain: domain.join(""), splitBlockCount };
}

const partition = partitionComponentCss(tcrnComponentCss);

/** The generic half. What `@tcrn/ui-react` keeps once domain furniture moves out. */
export const tcrnCoreComponentCss = partition.core;

/** The domain half. What the domain package will ship. */
export const tcrnDomainComponentCss = partition.domain;
