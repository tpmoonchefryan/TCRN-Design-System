// Storybook story-id derivation — TCRN-DS-STORY-055.
//
// The internal-alpha browser proof needs each contract story's Storybook `toId`
// value (kind + "--" + name). This reproduces Storybook's own @storybook/csf toId
// exactly for the TCRN contract stories, so `storybookId` can be derived from the
// single registry (governance.storyRegistryOrder) instead of being hand-maintained.
//
// The one non-obvious case is digit-splitting: Storybook derives the story name from
// the CSF export (e.g. `I18nThemeContract`) via lodash startCase, which inserts
// boundaries at every letter/digit transition, so `i18n-theme-contract` becomes
// `i-18-n-theme-contract`. The two boundary replacements below reproduce that from
// the kebab-case story id. Verified against all 43 current hand values in
// scripts/internal-alpha-browser-proof.mjs.

// Storybook @storybook/csf `sanitize`: lowercase, replace punctuation/space runs with
// a single hyphen, and trim leading/trailing hyphens.
const sanitize = (value) =>
  value
    .toLowerCase()
    .replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

// Reproduces Storybook's toId(kind, name) for a TCRN contract story.
// kind  = sanitize("TCRN Design System/" + group)
// name  = sanitize(id) with letter<->digit boundaries split (startCase behaviour)
export function storybookId(group, id) {
  const kind = sanitize(`TCRN Design System/${group}`);
  const name = sanitize(id)
    .replace(/([a-z])(\d)/g, "$1-$2")
    .replace(/(\d)([a-z])/g, "$1-$2");
  return `${kind}--${name}`;
}
