import { readFileSync, readdirSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join } from "node:path";
import { chromium } from "@playwright/test";
import { storyRegistryOrder } from "../apps/storybook/dist/contract-stories/governance.js";
import { referencePages } from "../apps/storybook/dist/build/reference-pages.js";
import { gplusMatrixSourcePath, gplusMatrixStoryIds } from "../apps/storybook/dist/contract-stories/gplus/matrix-stories.js";
import { gplusCompositionThreeStoryId, gplusSampleSourcePath, gplusSampleStoryIds } from "../apps/storybook/dist/contract-stories/gplus/sample-stories.js";
import { createResolvedTokenMap } from "../packages/ui-tokens/dist/index.js";
import {
  CATEGORY_STORY_COUNT_CAP,
  CATEGORY_STORY_COUNT_GRACE_ALLOWLIST,
  evaluateBudget
} from "./lib/story-budget.mjs";

const pagesByGroup = {
  Welcome: "index.html",
  "Style Guide": "style-guide.html",
  Foundations: "foundations.html",
  Components: "components.html",
  Patterns: "patterns.html",
  Proof: "proof.html",
  "Change Log": "change-log.html"
};
const expectedContractStoryGroups = Object.keys(pagesByGroup);
// Derived from the single registry source (governance.storyRegistryOrder, built to dist).
// Byte-equal to the former hand list: 43 {id, group} entries in registry order. The
// smoke.test tie-gate ties storyRegistryOrder to the emitted contractStories so this
// cannot drift from groups/*.ts (TCRN-DS-STORY-055).
const requiredStories = storyRegistryOrder.map((entry) => ({ id: entry.id, group: entry.group, categoryId: entry.categoryId }));

// TCRN-DS-STORY-056 page helpers (mirror apps/storybook/src/build/navigation.ts). Category
// filenames are group-namespaced because categoryId is NOT globally unique.
const groupSlugFor = (group) => group.toLowerCase().replace(/\s+/g, "-");
const categorySlug = (categoryId) => categoryId.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const categoryFileName = (group, categoryId) => `${groupSlugFor(group)}-${categorySlug(categoryId)}.html`;
const categoryFileForStory = (story) => categoryFileName(story.group, story.categoryId);

// Derived page registry: 7 section INDEX pages + one CATEGORY page per non-empty category, in
// registry (emission) order. Never hand-listed — a new story/category flows in automatically.
const contractPages = (() => {
  const list = [];
  for (const group of expectedContractStoryGroups) {
    list.push({ kind: "index", group, file: pagesByGroup[group], storyIds: [] });
    const seen = new Set();
    for (const story of requiredStories.filter((entry) => entry.group === group)) {
      if (seen.has(story.categoryId)) continue;
      seen.add(story.categoryId);
      list.push({
        kind: "category",
        group,
        categoryId: story.categoryId,
        file: categoryFileName(group, story.categoryId),
        storyIds: requiredStories.filter((entry) => entry.group === group && entry.categoryId === story.categoryId).map((entry) => entry.id)
      });
    }
  }
  // TCRN-DS-STORY-058: the generated per-component API reference pages come from the same shared
  // helper the emitter uses, so the emitted-page-set gate can never drift from what was written.
  for (const page of referencePages()) {
    list.push({ kind: "reference", file: page.file, componentNames: page.components.map((component) => component.name) });
  }
  return list;
})();

const pageHtmlByFile = Object.fromEntries(
  contractPages.map((page) => [page.file, readFileSync(`apps/storybook/storybook-static/${page.file}`, "utf8")])
);
// A group's "page" for the ~content pins is the concatenation of its bounded INDEX page (first,
// so the structural nav readers below still read the complete index nav) plus every one of its
// category pages, so every existing story-body pin still resolves.
const pages = Object.fromEntries(expectedContractStoryGroups.map((group) => [
  group,
  contractPages.filter((page) => page.group === group).map((page) => pageHtmlByFile[page.file]).join("\n")
]));
const combinedHtml = Object.values(pageHtmlByFile).join("\n");
// The documentation shell is the package's top-band ProductShell (TCRN-DS-SUB-131): sections and category
// pages are rows of its full menu, and a page's stories are the links of the paper's contents rail
// (TocRail) (TCRN-DS-SUB-132). The helpers read the first page's menu and every rail in the given HTML.
const readDocShellNavHtml = (html) => {
  const start = html.indexOf('<div class="tcrn-shell-menu" data-shell-menu="" hidden="">');
  const end = start === -1 ? -1 : html.indexOf('data-shell-pbar=""', start);
  return start === -1 || end === -1 ? "" : html.slice(start, end);
};
const docShellRowHrefs = (navHtml) => [...new Set(Array.from(navHtml.matchAll(/<a [^>]*data-shell-row=""[^>]*>/g), (match) => match[0].match(/href="([^"]+)"/)?.[1] ?? ""))];
const readDocShellTocRails = (html) => Array.from(html.matchAll(/<div class="tcrn-doc-page__toc" data-doc-toc="">([\s\S]*?)<\/aside>/g), (match) => match[1]);
const readStoryHtml = (html, storyId) => {
  const storyMarker = `data-contract-story-id="${storyId}"`;
  const markerStart = html.indexOf(storyMarker);
  if (markerStart === -1) {
    return "";
  }
  const articleStart = html.lastIndexOf("<article", markerStart);
  const articleEnd = html.indexOf("</article>", markerStart);
  if (articleStart === -1 || articleEnd === -1 || articleEnd < articleStart) {
    return "";
  }
  return html.slice(articleStart, articleEnd + "</article>".length);
};
const contract = JSON.parse(readFileSync("apps/storybook/storybook-static/ai-consumption-contract.json", "utf8"));
// G+ expectations (TCRN-DS-SUB-041). Every visual value below is derived from the G+ design
// contract (docs/design/gplus-2026-10/contract) and the resolved @tcrn/ui-tokens map, never
// copied from a rendering: control heights, radii, type sizes, weights, motion, the wash and
// the focus ring all come from here, serialized the way getComputedStyle reports them.
const gplusContractRoot = "docs/design/gplus-2026-10/contract";
const gplusPairs = JSON.parse(readFileSync(`${gplusContractRoot}/pairs.json`, "utf8"));
const gplusTypography = JSON.parse(readFileSync(`${gplusContractRoot}/typography.json`, "utf8"));
const gplusTokens = { light: createResolvedTokenMap("light"), dark: createResolvedTokenMap("dark") };
// Top-band shell (TCRN-DS-SUB-131/132): the documentation shell has no resident rail and its band is the
// shell.strip-h token, so the doc shell expectations below read 0 and that token instead of the retired rail
// (--tcrn-shell-sidebar-width) and top bar (--tcrn-shell-topbar-height) tokens and the older literals.
const shellStripHeightVar = "--tcrn-shell-strip-h";
const docShellRailWidthPx = 0;
const docShellTopbarHeightPx = Number.parseFloat(gplusTokens.light[shellStripHeightVar]);
// The search is the full menu's field: 936 wide in the 952 panel at the 1440 proof viewport, and focus does not widen it.
const docShellSearchWidthPx = 936;
const gplusThemes = ["light", "dark"];
function gplusComputedColor(value) {
  const text = String(value).trim();
  const hex = /^#([0-9a-f]{6})$/i.exec(text);
  if (hex) {
    const [r, g, b] = [0, 2, 4].map((offset) => Number.parseInt(hex[1].slice(offset, offset + 2), 16));
    return `rgb(${r}, ${g}, ${b})`;
  }
  const rgba = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(text);
  if (rgba) {
    const [r, g, b] = rgba.slice(1, 4).map(Number);
    if (rgba[4] === undefined || Number(rgba[4]) === 1) return `rgb(${r}, ${g}, ${b})`;
    return `rgba(${r}, ${g}, ${b}, ${Number(rgba[4])})`;
  }
  throw new Error(`gplus-color-unparsed:${text}`);
}
const gplusColor = (cssVar, theme = "light") => gplusComputedColor(gplusTokens[theme][cssVar]);
const gplusColorBothThemes = (cssVar) => gplusThemes.map((theme) => gplusColor(cssVar, theme));
const gplusPx = (cssVar) => Number.parseFloat(gplusTokens.light[cssVar]);
// Composition one's shell geometry (O-1, TCRN-DS-SUB-090): the ProductShell top bar and the
// collapsed sidebar rail are read from the shell tokens, not pinned as literals.
const gplusShellTopBarHeightPx = gplusPx("--tcrn-shell-topbar-height");
const gplusShellCollapsedRailWidthPx = gplusPx("--tcrn-shell-sidebar-width-collapsed");
if (!Number.isFinite(gplusShellTopBarHeightPx) || !Number.isFinite(gplusShellCollapsedRailWidthPx)) {
  throw new Error("gplus-shell-token-missing:--tcrn-shell-topbar-height|--tcrn-shell-sidebar-width-collapsed");
}
const gplusSeconds = (cssVar) => `${Number.parseFloat(gplusTokens.light[cssVar]) / 1000}s`;
const gplusEase = (cssVar) => String(gplusTokens.light[cssVar])
  .replace(/\s+/g, "")
  .replace(/\(([^)]*)\)/, (_, args) => `(${args.split(",").map((part) => String(Number(part))).join(", ")})`);
const gplusFirstFamily = (cssVar) => String(gplusTokens.light[cssVar]).split(",")[0].replace(/["']/g, "").trim();
const gplusTextLine = (name) => (gplusTypography.text.sizes.find((size) => size.name === name)?.line ?? Number.NaN);
const gplusStrongWeight = String(gplusTypography.text.tones.find((tone) => tone.name === "strong")?.weight ?? "missing");
const gplusActionsWeight = String(gplusPairs.tables.actions.weight.default);
const gplusStateSelector = (base, table, stateKey) =>
  `${base}:where(${gplusPairs.tables[table].states.find((state) => state.key === stateKey).when.join(",")})`;
// The focus ring is --tcrn-focus-ring: a 2px gap in the carrying surface's colour, then a 2px
// acc ring out to 4px. The gap colour follows whatever surface carries the control, so only its
// spread is pinned; the acc ring is pinned per theme. Controls drawn from the pair table add
// their own edge layers (an inset acc edge for text inputs), listed per control.
const gplusFocusRingLayers = [
  { spread: 2, inset: false },
  { spread: 4, inset: false, colors: gplusColorBothThemes("--tcrn-color-acc") }
];
// Ring-drawn focus keeps a transparent 2px outline at 2px offset as the forced-colors fallback.
const gplusForcedColorsOutline = { outlineWidth: "2px", outlineStyle: "solid", outlineOffset: "2px" };
const llmsTxt = readFileSync("apps/storybook/storybook-static/llms.txt", "utf8");
const robotsTxt = readFileSync("apps/storybook/storybook-static/robots.txt", "utf8");
const localAbsolutePathDenyPatterns = [
  { name: "file-url", pattern: /file:\/\//i },
  { name: "users-home-path", pattern: /\/Users\//i },
  { name: "tmp-path", pattern: /\/tmp(?:\/|$)/i },
  { name: "private-tmp-path", pattern: /\/private\/tmp(?:\/|$)/i },
  { name: "mac-temp-path", pattern: /\/var\/folders(?:\/|$)/i },
  { name: "remote-workspace-path", pattern: /\/srv\/tcrn(?:\/|$)/i }
];
// 21 + the two G+ categories under Components: gplus-matrices (TCRN-DS-SUB-030) and
// gplus-samples (TCRN-DS-SUB-031).
const expectedStoryCategoryCount = 23;
const expectedStorybookShellNavGroupCount = expectedContractStoryGroups.length;
const expectedFoundationStandardCategoryIds = [
  "visual-philosophy-ownership",
  "layout-rhythm",
  "spacing-density",
  "typography-localization",
  "color-elevation-border-radius-focus",
  "component-composition",
  "interaction-motion-accessibility",
  "responsive-mobile",
  "evidence-proof-oracle",
  "consumer-enforcement"
];
const storybookDocShellVisualOracleContract = contract.storybookDocShellVisualOracle ?? {};
const expectedStorybookVisualSkin = {
  id: storybookDocShellVisualOracleContract.id ?? "missing",
  sidebarWidthPx: storybookDocShellVisualOracleContract.shellMetrics?.desktopSidebarWidthPx ?? null,
  sidebarMinWidthPx: storybookDocShellVisualOracleContract.shellMetrics?.desktopSidebarMinWidthPx ?? null,
  sidebarPreferredViewportRatio: storybookDocShellVisualOracleContract.shellMetrics?.desktopSidebarPreferredViewportRatio ?? null,
  sidebarMaxWidthPx: storybookDocShellVisualOracleContract.shellMetrics?.desktopSidebarMaxWidthPx ?? null,
  sidebarTolerancePx: storybookDocShellVisualOracleContract.shellMetrics?.desktopSidebarTolerancePx ?? 0,
  topbarHeightPx: storybookDocShellVisualOracleContract.shellMetrics?.desktopTopbarHeightPx ?? null,
  topbarTolerancePx: storybookDocShellVisualOracleContract.shellMetrics?.desktopTopbarTolerancePx ?? 0,
  searchRestWidthPx: storybookDocShellVisualOracleContract.shellMetrics?.searchRestWidthPx ?? null,
  searchHeightPx: storybookDocShellVisualOracleContract.shellMetrics?.searchHeightPx ?? null,
  searchBorderColor: storybookDocShellVisualOracleContract.shellMetrics?.searchBorderColor ?? null,
  searchBorderRadiusPx: storybookDocShellVisualOracleContract.shellMetrics?.searchBorderRadiusPx ?? null,
  themeToggleRadiusPx: storybookDocShellVisualOracleContract.shellMetrics?.themeToggleRadiusPx ?? null,
  trailingUtilityGapMinPx: storybookDocShellVisualOracleContract.shellMetrics?.trailingUtilityGapMinPx ?? null,
  trailingUtilityGapMaxPx: storybookDocShellVisualOracleContract.shellMetrics?.trailingUtilityGapMaxPx ?? null
};
const expectedStorybookSidebarWidthForViewport = (viewportWidth) => {
  const { sidebarMinWidthPx, sidebarPreferredViewportRatio, sidebarMaxWidthPx, sidebarWidthPx } = expectedStorybookVisualSkin;
  if (
    typeof sidebarMinWidthPx === "number"
    && typeof sidebarPreferredViewportRatio === "number"
    && typeof sidebarMaxWidthPx === "number"
  ) {
    return Math.min(sidebarMaxWidthPx, Math.max(sidebarMinWidthPx, viewportWidth * sidebarPreferredViewportRatio));
  }
  return sidebarWidthPx;
};
const storybookAlphaStylesSource = readFileSync("apps/storybook/src/alpha-styles.ts", "utf8");
const storybookStaticCssSource = readFileSync("apps/storybook/src/storybook.css", "utf8");
const staticRoot = "apps/storybook/storybook-static";
// TCRN-DS-SUB-168 (STORY-140, STORY-147; judgment §3.4 item 1): the three ProductShell comparators
// read the top-band shell (TCRN-DS-SUB-121). The band holds the brand button, the pins and the
// cluster (header actions, bell, avatar); theme and language sit in the avatar menu; the search, the
// selected row and the current position live in the full menu, and the paper's page header carries
// the trail. The side rail, its collapse toggle, the top bar and the band search are retired, so their
// selectors, metrics, motion and state checks went with them. Every part that still exists keeps its
// checks (the theme toggle, the locale trigger and its chevron, the theme wash), and the band gets
// its own: its height, no fill and no line, its parts' order, the 26 midline, the paper's inset and
// top, the brand button and the avatar with their focus ring. Values come from the shell tokens:
// strip-h 52, brand-w 134 × brand-h 40, the 12 inset (space-3), the avatar 28 (2 × space-3h).
const shellBandInsetPx = gplusPx("--tcrn-space-3");
const shellAvatarPx = 2 * gplusPx("--tcrn-space-3h");
const productShellComparatorContract = {
  styleSource: "@tcrn/ui-react/tcrnComponentCss",
  // TCRN-DS-STORY-059: the ProductShell contract-proof was split out of navigation-shell-spec
  // into navigation-product-shell-spec (same navigation-shells category page). It shows the shell
  // closed with the avatar menu open, so the theme toggle and the locale trigger are measured there.
  storyId: "navigation-product-shell-spec",
  page: "components-navigation-shells.html#navigation-product-shell-spec",
  scopedSelector: ".tcrn-doc-product-shell-contract-proof .tcrn-product-shell",
  componentSelectors: {
    strip: "[data-shell-strip]",
    brandButton: "[data-shell-brand]",
    pins: ".tcrn-shell-pins",
    cluster: "[data-cluster]",
    avatar: "[data-shell-avatar]",
    themeToggle: ".tcrn-shell-theme-toggle",
    localeTrigger: ".tcrn-shell-locale-menu__trigger",
    localeChevron: ".tcrn-shell-locale-menu__chevron",
    currentLocation: ".tcrn-page-header .tcrn-breadcrumb [aria-current]",
    searchResults: "[data-shell-menu] [data-product-shell-search-results]",
    paper: "[data-paper]",
    contentRegion: "[data-product-shell-region=\"content\"]",
    contentStack: ".tcrn-product-shell-content-stack",
    sectionGrid: ".tcrn-product-shell-section-grid"
  },
  // The band's parts left to right; the pins are left out when the shell has none to show.
  expectedControlOrder: ["brandButton", "pins", "cluster"],
  optionalControls: ["pins"],
  expectedControlMetrics: {
    // MIN-20261013-SHELL D2: the band has no fill and no line; the paper sits 12 in from its edges.
    strip: {
      minHeight: gplusPx(shellStripHeightVar),
      height: gplusPx(shellStripHeightVar),
      display: "flex",
      borderStyle: "none",
      borderWidth: "0px",
      backgroundColor: "rgba(0, 0, 0, 0)",
      paddingLeft: `${shellBandInsetPx}px`,
      paddingRight: `${shellBandInsetPx}px`
    },
    brandButton: {
      width: gplusPx("--tcrn-shell-brand-w"),
      height: gplusPx("--tcrn-shell-brand-h"),
      radius: gplusPx("--tcrn-radius-control"),
      transitionPropertyIncludes: ["background-color", "color", "box-shadow"],
      transitionDurationIncludes: gplusSeconds("--tcrn-motion-duration-fill"),
      transitionTimingFunctionIncludes: gplusEase("--tcrn-motion-ease"),
      focus: { ...gplusForcedColorsOutline, boxShadow: { layers: gplusFocusRingLayers } }
    },
    avatar: {
      width: shellAvatarPx,
      height: shellAvatarPx,
      radius: 999,
      backgroundRequired: true,
      focus: { ...gplusForcedColorsOutline, boxShadow: { layers: gplusFocusRingLayers } }
    },
    // TCRN-DS-SUB-041: the shell toggles are IconButtons on the Actions pair table (secondary
    // variant), so weight, motion and the focus ring are the table's. Its box stays what the base
    // segment sizes it to (36 pill): G+ has not yet ruled on this size, recorded in
    // runs/r1/problems/W6-B.md, so the geometry is not re-pinned here. The Actions base rule sets
    // line-height 1, so the line box is the type size.
    themeToggle: {
      width: 36,
      height: 36,
      radius: 999,
      backgroundRequired: true,
      fontSize: `${gplusPx("--tcrn-type-size-control")}px`,
      fontWeight: gplusActionsWeight,
      lineHeight: `${gplusPx("--tcrn-type-size-control")}px`,
      transitionPropertyIncludes: ["background-color", "color", "box-shadow"],
      transitionDurationIncludes: gplusSeconds("--tcrn-motion-duration-fill"),
      transitionTimingFunctionIncludes: gplusEase("--tcrn-motion-ease"),
      focus: { ...gplusForcedColorsOutline, boxShadow: { layers: gplusFocusRingLayers } }
    },
    // The locale trigger is not a pair-table control: the base segment draws its edge and the
    // G+ focus ring directly, in the strong weight on the body line, moving on the move token.
    localeTrigger: {
      minHeight: 36,
      radius: 999,
      backgroundRequired: true,
      fontSize: `${gplusPx("--tcrn-type-size-control")}px`,
      fontWeight: gplusStrongWeight,
      lineHeight: `${gplusTextLine("body")}px`,
      letterSpacing: "normal",
      transitionPropertyIncludes: ["background-color", "border-color", "color", "box-shadow"],
      transitionDurationIncludes: gplusSeconds("--tcrn-motion-duration-move"),
      transitionTimingFunctionIncludes: gplusEase("--tcrn-motion-ease"),
      focus: { ...gplusForcedColorsOutline, boxShadow: { layers: gplusFocusRingLayers } }
    },
    // The current position is the last step of the page header's trail, in the paper.
    currentLocation: {},
    paper: {
      radius: gplusPx("--tcrn-radius-paper"),
      backgroundRequired: true
    }
  },
  // The paper starts at the band's bottom and 12 in from its edges; the band's parts sit on its
  // midline, the brand button at its start and the cluster at its end.
  bandGeometry: {
    midlineTolerancePx: 1,
    edgeTolerancePx: 1
  },
  motionProof: {
    // TCRN-DS-SUB-041: the locale chevron and the theme wash move on the G+ move duration and the
    // G+ ease. The top band has no rail to animate and no band search to widen.
    localeChevronTransition: "transform",
    localeChevronTransitionDuration: gplusSeconds("--tcrn-motion-duration-move"),
    themeWashPseudo: "tcrn-product-shell-theme-wash",
    themeWashAnimationDuration: gplusSeconds("--tcrn-motion-duration-move"),
    themeWashAnimationTimingFunctionIncludes: gplusEase("--tcrn-motion-ease"),
    reducedMotionFallback: "transition-none"
  }
};
// The AI consumption contract's shellControlVisualParityProof and owner-quality oracle still
// describe the old shell (its rail toggle, top-bar search and collapse policy) until its text is
// rewritten (judgment R2-29). The cross-checks below pin what it says today, apart from the
// comparator above, so the two can move separately.
const aiContractShellControlReadback = {
  controlOrder: ["currentLocation", "searchWrapper", "themeToggle", "localeTrigger"],
  searchTransitionDuration: "0.24s",
  searchTransitionProperties: ["flex-basis", "width", "max-width"],
  ownerQualityAdmittedCollapsedVariants: [
    "desktop-light-operations-cockpit-collapsed",
    "desktop-dark-operations-cockpit-collapsed",
    "desktop-light-work-queue-collapsed"
  ]
};
// The visual instances show the shell closed with the avatar menu closed: the band and the paper
// are what they render, so those are what they are held to.
const productShellBandMetrics = {
  strip: productShellComparatorContract.expectedControlMetrics.strip,
  brandButton: productShellComparatorContract.expectedControlMetrics.brandButton,
  avatar: productShellComparatorContract.expectedControlMetrics.avatar,
  currentLocation: productShellComparatorContract.expectedControlMetrics.currentLocation,
  paper: productShellComparatorContract.expectedControlMetrics.paper
};
const aosFrontendShellVisualInstanceContract = {
  styleSource: "@tcrn/ui-react/tcrnComponentCss",
  storyId: "frontend-shell-slice",
  page: "proof-proof-visual-instances.html#frontend-shell-slice",
  scopedSelector: "[data-storybook-visual-instance=\"frontend-shell-slice\"]",
  componentSelectors: productShellComparatorContract.componentSelectors,
  expectedControlOrder: productShellComparatorContract.expectedControlOrder,
  optionalControls: productShellComparatorContract.optionalControls,
  expectedControlMetrics: productShellBandMetrics,
  motionProof: productShellComparatorContract.motionProof,
  visualInstanceName: "FrontendShellSliceVisualInstance",
  packageMapping: [
    "ProductShell",
    "ProductShellSearch",
    "useProductShellController",
    "EnvironmentBanner",
    "InlineAlert",
    "ReadbackPanel",
    "KeyValueList",
    "ReferenceList",
    "TableShell",
    "StatusBadge",
    "DisclosurePanel"
  ],
  variants: [
    "desktop-light-expanded-cockpit-search-results",
    "desktop-light-expanded-cockpit-search-rest",
    "desktop-dark-expanded-cockpit",
    "desktop-light-collapsed-work",
    "mobile-dark-work-stacked",
    "reduced-motion"
  ],
  variantFixtures: [
    {
      id: "desktop-light-expanded-cockpit-search-results",
      selector: "[data-storybook-visual-instance=\"frontend-shell-slice\"][data-visual-instance-variant=\"desktop-light-expanded-cockpit-search-results\"]",
      viewport: { width: 1440, height: 900 },
      reducedMotion: "no-preference",
      expectedState: {
        theme: "light",
        locale: "en",
        collapsed: "false",
        route: "cockpit",
        search: "results",
        searchExpanded: "true",
        searchResultsVisible: "true",
        viewport: "desktop",
        reducedMotion: "false",
        content: "cockpit"
      }
    },
    {
      id: "desktop-light-expanded-cockpit-search-rest",
      selector: "[data-storybook-visual-instance=\"frontend-shell-slice\"][data-visual-instance-variant=\"desktop-light-expanded-cockpit-search-rest\"]",
      viewport: { width: 1440, height: 900 },
      reducedMotion: "no-preference",
      expectedState: {
        theme: "light",
        locale: "en",
        collapsed: "false",
        route: "cockpit",
        search: "rest",
        searchExpanded: "false",
        searchResultsVisible: "false",
        viewport: "desktop",
        reducedMotion: "false",
        content: "cockpit"
      }
    },
    {
      id: "desktop-dark-expanded-cockpit",
      selector: "[data-storybook-visual-instance=\"frontend-shell-slice\"][data-visual-instance-variant=\"desktop-dark-expanded-cockpit\"]",
      viewport: { width: 1440, height: 900 },
      reducedMotion: "no-preference",
      expectedState: {
        theme: "dark",
        locale: "en",
        collapsed: "false",
        route: "cockpit",
        search: "rest",
        searchExpanded: "false",
        searchResultsVisible: "false",
        viewport: "desktop",
        reducedMotion: "false",
        content: "cockpit"
      }
    },
    {
      id: "desktop-light-collapsed-work",
      selector: "[data-storybook-visual-instance=\"frontend-shell-slice\"][data-visual-instance-variant=\"desktop-light-collapsed-work\"]",
      viewport: { width: 1440, height: 900 },
      reducedMotion: "no-preference",
      expectedState: {
        theme: "light",
        locale: "en",
        collapsed: "true",
        route: "work",
        search: "rest",
        searchExpanded: "false",
        searchResultsVisible: "false",
        viewport: "desktop",
        reducedMotion: "false",
        content: "work"
      }
    },
    {
      id: "mobile-dark-work-stacked",
      selector: "[data-storybook-visual-instance=\"frontend-shell-slice\"][data-visual-instance-variant=\"mobile-dark-work-stacked\"]",
      viewport: { width: 390, height: 844 },
      reducedMotion: "no-preference",
      expectedState: {
        theme: "dark",
        locale: "zh-CN",
        collapsed: "false",
        route: "work",
        search: "rest",
        searchExpanded: "false",
        searchResultsVisible: "false",
        viewport: "mobile",
        reducedMotion: "false",
        content: "work"
      }
    },
    {
      id: "reduced-motion",
      selector: "[data-storybook-visual-instance=\"frontend-shell-slice\"][data-visual-instance-variant=\"reduced-motion\"]",
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
      expectedState: {
        theme: "light",
        locale: "en",
        collapsed: "false",
        route: "cockpit",
        search: "rest",
        searchExpanded: "false",
        searchResultsVisible: "false",
        viewport: "desktop",
        reducedMotion: "true",
        content: "cockpit"
      }
    }
  ],
  delegatedInteractionProofs: [
    "Locale menu dismissal and focus return are delegated to ShellLocaleMenu/ProductShell interaction sub-oracles.",
    "Search blur/outside-pointer/tab/Escape dismissal is delegated to ProductShellSearch and field/search sub-oracles.",
    "This oracle proves rendered visual states and remains blocked from owner visual admission until review completes."
  ],
  persistedCockpitRestPolicy: {
    defaultCockpitRestVariant: "desktop-light-expanded-cockpit-search-rest",
    ownerReviewRoutesMustBeDeterministic: true,
    coveredOwnerReachableRoutes: [
      "/",
      "/cockpit",
      "/cockpit?locale=en&theme=light",
      "post-search-dismissal:/cockpit?locale=en&theme=light&collapsed=false&search=shell"
    ],
    routePersistenceBoundary:
      "Owner-review routes must not inherit localStorage into unadmitted visual states; product persistence may remain DS-defined outside reviewed parity routes.",
    notAutomaticallyAdmitted: [
      "zh-CN Cockpit rest",
      "collapsed Cockpit rest",
      "dark zh-CN Cockpit rest",
      "mobile Cockpit rest"
    ],
    outsideMatrixMarkerForbiddenForOwnerReview: "aos-route-state-outside-accepted-oracle-matrix"
  },
  ownerVisualAdmissionBoundary: "internal_ds_oracle_review_required_before_owner_visual_admission",
  slots: ["brand lockup", "attached side navigation", "topbar", "search", "content", "secondary disclosure"],
  requiredContentSelectors: {
    common: {
      registeredBoundary: "[data-aos-registered-module-boundary=\"cockpit-work-only\"]",
      notAccepted: "[data-product-acceptance=\"not-claimed\"]",
      notReleaseReady: "[data-release-readiness=\"not-claimed\"]",
      noLiveDispatch: "[data-live-dispatch=\"not-enabled\"]"
    },
    cockpit: {
      dummyCockpit: "[data-aos-dummy-cockpit=\"true\"]"
    },
    work: {
      workEntry: "[data-aos-work-module-entry=\"work-module\"]",
      rawSecondaryDisclosure: "[data-raw-json-disclosure=\"secondary\"]"
    }
  },
  forbiddenText: [
    "Conference",
    "Dependency",
    "Resource",
    "Settings / Admin",
    "Product accepted",
    "Release ready",
    "Live dispatch enabled",
    "tcrn-aos-wordmark"
  ],
  negativeCriteria: [
    "no Storybook-only prototype classes",
    "no product-local visible CSS/effect system",
    "no deprecated AOS wordmark assets",
    "no unregistered primary IA",
    "no raw API/debug payload as primary UX",
    "no owner/product/release/live-dispatch readiness claim"
  ]
};
const aosOwnerQualityProductShellContract = {
  styleSource: "@tcrn/ui-react/tcrnComponentCss",
  storyId: "owner-quality-product-shell",
  page: "proof-proof-visual-instances.html#owner-quality-product-shell",
  scopedSelector: "[data-storybook-visual-instance=\"owner-quality-product-shell\"]",
  componentSelectors: productShellComparatorContract.componentSelectors,
  expectedControlOrder: productShellComparatorContract.expectedControlOrder,
  optionalControls: productShellComparatorContract.optionalControls,
  expectedControlMetrics: productShellBandMetrics,
  motionProof: productShellComparatorContract.motionProof,
  noOverflowProof: true,
  controlBoundsProof: {
    controls: ["brandButton", "avatar"],
    containers: ["strip", "shell", "viewport"]
  },
  visualInstanceName: "OwnerQualityShellOracle",
  packageMapping: [
    "ProductShell",
    "ProductShellSearch",
    "useProductShellController",
    "ProductLogo",
    "tcrnProductLogoRegistry",
    "Surface",
    "RecordTable",
    "TableShell",
    "KeyValueList",
    "StatusBadge",
    "Badge",
    "ReferenceList",
    "EnvironmentBanner",
    "DisclosurePanel",
    "Heading",
    "Text"
  ],
  variants: [
    "desktop-light-operations-cockpit",
    "desktop-light-operations-cockpit-collapsed",
    "desktop-dark-operations-cockpit",
    "desktop-dark-operations-cockpit-collapsed",
    "desktop-light-work-queue",
    "desktop-light-work-queue-collapsed",
    "mobile-dark-zh-cn-work-queue",
    "desktop-light-operations-search-results",
    "reduced-motion"
  ],
  variantFixtures: [
    {
      id: "desktop-light-operations-cockpit",
      selector: "[data-storybook-visual-instance=\"owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-light-operations-cockpit\"]",
      viewport: { width: 1440, height: 900 },
      reducedMotion: "no-preference",
      expectedState: {
        theme: "light",
        locale: "en",
        collapsed: "false",
        route: "cockpit",
        search: "rest",
        searchExpanded: "false",
        searchResultsVisible: "false",
        viewport: "desktop",
        reducedMotion: "false",
        content: "cockpit"
      }
    },
    {
      id: "desktop-light-operations-cockpit-collapsed",
      selector: "[data-storybook-visual-instance=\"owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-light-operations-cockpit-collapsed\"]",
      viewport: { width: 1440, height: 900 },
      reducedMotion: "no-preference",
      expectedState: {
        theme: "light",
        locale: "en",
        collapsed: "true",
        route: "cockpit",
        search: "rest",
        searchExpanded: "false",
        searchResultsVisible: "false",
        viewport: "desktop",
        reducedMotion: "false",
        content: "cockpit"
      }
    },
    {
      id: "desktop-dark-operations-cockpit",
      selector: "[data-storybook-visual-instance=\"owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-dark-operations-cockpit\"]",
      viewport: { width: 1440, height: 900 },
      reducedMotion: "no-preference",
      expectedState: {
        theme: "dark",
        locale: "en",
        collapsed: "false",
        route: "cockpit",
        search: "rest",
        searchExpanded: "false",
        searchResultsVisible: "false",
        viewport: "desktop",
        reducedMotion: "false",
        content: "cockpit"
      }
    },
    {
      id: "desktop-dark-operations-cockpit-collapsed",
      selector: "[data-storybook-visual-instance=\"owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-dark-operations-cockpit-collapsed\"]",
      viewport: { width: 1440, height: 900 },
      reducedMotion: "no-preference",
      expectedState: {
        theme: "dark",
        locale: "en",
        collapsed: "true",
        route: "cockpit",
        search: "rest",
        searchExpanded: "false",
        searchResultsVisible: "false",
        viewport: "desktop",
        reducedMotion: "false",
        content: "cockpit"
      }
    },
    {
      id: "desktop-light-work-queue",
      selector: "[data-storybook-visual-instance=\"owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-light-work-queue\"]",
      viewport: { width: 1440, height: 900 },
      reducedMotion: "no-preference",
      expectedState: {
        theme: "light",
        locale: "en",
        collapsed: "false",
        route: "work",
        search: "rest",
        searchExpanded: "false",
        searchResultsVisible: "false",
        viewport: "desktop",
        reducedMotion: "false",
        content: "work"
      }
    },
    {
      id: "desktop-light-work-queue-collapsed",
      selector: "[data-storybook-visual-instance=\"owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-light-work-queue-collapsed\"]",
      viewport: { width: 1440, height: 900 },
      reducedMotion: "no-preference",
      expectedState: {
        theme: "light",
        locale: "en",
        collapsed: "true",
        route: "work",
        search: "rest",
        searchExpanded: "false",
        searchResultsVisible: "false",
        viewport: "desktop",
        reducedMotion: "false",
        content: "work"
      }
    },
    {
      id: "mobile-dark-zh-cn-work-queue",
      selector: "[data-storybook-visual-instance=\"owner-quality-product-shell\"][data-visual-instance-variant=\"mobile-dark-zh-cn-work-queue\"]",
      viewport: { width: 390, height: 844 },
      reducedMotion: "no-preference",
      expectedState: {
        theme: "dark",
        locale: "zh-CN",
        collapsed: "false",
        route: "work",
        search: "rest",
        searchExpanded: "false",
        searchResultsVisible: "false",
        viewport: "mobile",
        reducedMotion: "false",
        content: "work"
      },
      requiredText: ["工作项", "状态", "负责人", "需要评审", "已阻止", "未配置", "仅本地证明"],
      forbiddenText: ["Work item", "State", "Unknown", "Blocked", "Not configured", "Local proof only"]
    },
    {
      id: "desktop-light-operations-search-results",
      selector: "[data-storybook-visual-instance=\"owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-light-operations-search-results\"]",
      viewport: { width: 1440, height: 900 },
      reducedMotion: "no-preference",
      expectedState: {
        theme: "light",
        locale: "en",
        collapsed: "false",
        route: "cockpit",
        search: "results",
        searchExpanded: "true",
        searchResultsVisible: "true",
        viewport: "desktop",
        reducedMotion: "false",
        content: "cockpit"
      }
    },
    {
      id: "reduced-motion",
      selector: "[data-storybook-visual-instance=\"owner-quality-product-shell\"][data-visual-instance-variant=\"reduced-motion\"]",
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
      expectedState: {
        theme: "light",
        locale: "en",
        collapsed: "false",
        route: "cockpit",
        search: "rest",
        searchExpanded: "false",
        searchResultsVisible: "false",
        viewport: "desktop",
        reducedMotion: "true",
        content: "cockpit"
      }
    }
  ],
  ownerVisualAdmissionBoundary: "internal_ds_oracle_review_required_before_owner_visual_admission",
  requiredContentSelectors: {
    primaryHeading: "[data-owner-quality-primary-heading=\"true\"][data-owner-quality-first-viewport=\"product-led\"]",
    workQueue: "[data-owner-quality-work-queue=\"true\"]",
    gatesEvidence: "[data-owner-quality-gates=\"true\"]",
    ownerActions: "[data-owner-quality-actions=\"true\"]",
    serviceHealth: "[data-owner-quality-service-health=\"true\"]",
    secondaryDisclosure: "[data-owner-quality-secondary-disclosure=\"true\"]",
    notAccepted: "[data-product-acceptance=\"not-claimed\"]",
    notReleaseReady: "[data-release-readiness=\"not-claimed\"]",
    noLiveDispatch: "[data-live-dispatch=\"not-enabled\"]"
  },
  expectedPrimaryHeadingCount: 1,
  productFirstRequired: true,
  forbiddenText: [
    "AOS frontend shell",
    "Frontend shell slice",
    "Local structural slice only",
    "Dummy Cockpit",
    "structural placeholder",
    "Backend readback",
    "Registered slice boundary",
    "Storybook parity proof",
    "proof required",
    "runtime readbacks",
    "API receipts",
    "Product accepted",
    "Release ready",
    "Live dispatch enabled",
    "tcrn-aos-wordmark"
  ],
  delegatedSubOracles: [
    "ProductShell owns side-nav collapse, responsive posture, theme, locale, focus, and reduced-motion behavior.",
    "ProductShellSearch owns search rest/results/dismissal behavior.",
    "This owner-quality oracle defines first-viewport hierarchy and copy semantics; product adoption remains separate."
  ],
  negativeCriteria: [
    "no proof-scaffold headline as Level 1 content",
    "no Dummy Cockpit or structural-placeholder first viewport",
    "no primary raw API/debug/readback payload",
    "no deprecated AOS wordmark assets",
    "no unregistered primary IA",
    "no owner/product/release/live-dispatch readiness claim"
  ]
};
// The documentation pages render in the package's top-band ProductShell (TCRN-DS-SUB-131): the band, the
// brand button that opens the full menu, the menu's groups and rows, and the paper's contents rail with
// the current story (TCRN-DS-SUB-132). There is no side rail and no collapse control (MIN-20261013-SHELL D1).
const required = [
  "data-doc-shell=\"online-docs\"",
  "data-shell=\"doc\" data-doc-shell=\"online-docs\"",
  "<header class=\"tcrn-shell-strip\"",
  "<div class=\"tcrn-shell-menu\" data-shell-menu=\"\" hidden=\"\">",
  "data-shell-group=\"\"",
  "data-shell-row=\"\"",
  "<div class=\"tcrn-doc-page__toc\" data-doc-toc=\"\">",
  "aria-current=\"location\" data-selected=\"true\"",
  "data-anchor-scroll-controlled=\"true\"",
  "data-shell-control=\"theme-toggle\"",
  "data-shell-control=\"locale-menu\"",
  "data-tab=\"\"",
  "data-doc-chapter-pager=\"true\"",
  "<link rel=\"icon\" href=\"tcrn-brand-mark.svg\" type=\"image/svg+xml\" />",
  "--tcrn-anchor-scroll-offset: var(--tcrn-space-3h)",
  "tcrnStorybookScrollToHash",
  "tcrnStorybookScrollSpy",
  "data-i18n-locale-select",
  "data-storybook-locale=\"en\"",
  "data-storybook-supported-locales=\"zh-CN,en,ja,ko,fr\"",
  "data-storybook-theme=\"light\"",
  "data-storybook-supported-themes=\"light,dark\"",
  "data-current-theme=\"light\"",
  "tcrn-design-system-storybook-theme",
  "data-package-backed-shell-control=\"theme-toggle\"",
  "data-theme-icon=\"light\"",
  "data-theme-icon=\"dark\"",
  "data-icon-name=\"sun\"",
  "data-icon-name=\"moon\"",
  "--tcrn-doc-motion-smooth: 0.4s ease",
  "--tcrn-doc-theme-crossfade-duration: 0.4s",
  "::view-transition-old(root)",
  "::view-transition-new(root)",
  "data-theme-switching",
  "tcrn-doc-theme-transition-wash",
  "document.startViewTransition",
  "runFallbackThemeTransition",
  "<input data-doc-search-input=\"\"",
  "data-doc-search-results",
  "data-doc-search-result",
  "data-locale-menu-toggle",
  "data-package-backed-shell-control=\"locale-menu\"",
  "data-icon-name=\"globe-2\"",
  "data-locale-current-name",
  "data-locale-menu-option",
  "tcrn-shell-locale-menu__name",
  "data-locale-name=\"简体中文\"",
  "option value=\"zh-CN\"",
  "option value=\"en\"",
  "option value=\"ja\"",
  "option value=\"ko\"",
  "option value=\"fr\"",
  "data-i18n=\"story.welcome-governance.title\"",
  // TCRN-DS-STORY-051: ja/ko shell titles moved to payloadTranslationCoverage (below) — they
  // ship in the embedded i18n payload for runtime switching but never render on the static en
  // pages, so keeping them as raw combinedContractText pins would falsely read as rendered text.
  "data-contract-surface=\"tcrn-design-system-storybook\"",
  "data-contract-story-id=\"tokens-copy-state\"",
  "data-contract-story-id=\"foundation-visual-standards\"",
  "data-foundation-visual-standards=\"registry\"",
  "data-foundation-standard-category-id=\"consumer-enforcement\"",
  "consumer-visual-style-contract-v1",
  "original-storybook-doc-shell-v1",
  "Missing standard escalation",
  "data-contract-story-id=\"brand-identity\"",
  "data-contract-story-id=\"color-palette\"",
  "data-contract-story-id=\"dashboard-page-templates\"",
  "data-contract-story-id=\"frontend-shell-slice\"",
  "data-contract-story-id=\"owner-quality-product-shell\"",
  "data-registered-product-logo=\"@tcrn/ui-react/ProductLogo\"",
  "AI Operation System",
  "data-storybook-visual-instance=\"frontend-shell-slice\"",
  "data-visual-instance-name=\"FrontendShellSliceVisualInstance\"",
  "data-visual-instance-disposition=\"ds_oracle_review_required_before_owner_admission\"",
  "data-visual-instance-primary-ia=\"cockpit-work-only\"",
  "data-visual-instance-variant=\"desktop-light-expanded-cockpit-search-results\"",
  "data-visual-instance-variant=\"desktop-dark-expanded-cockpit\"",
  "data-visual-instance-variant=\"desktop-light-collapsed-work\"",
  "data-visual-instance-variant=\"mobile-dark-work-stacked\"",
  "data-visual-instance-variant=\"reduced-motion\"",
  "data-visual-instance-locale=\"zh-CN\"",
  "data-visual-instance-search=\"rest\"",
  "data-visual-instance-search=\"results\"",
  "data-visual-instance-reduced-motion=\"true\"",
  "data-aos-visual-instance-oracle=\"true\"",
  "data-storybook-visual-instance=\"owner-quality-product-shell\"",
  "data-visual-instance-name=\"OwnerQualityShellOracle\"",
  "data-visual-instance-owner-quality=\"product-first\"",
  "data-owner-quality-product-shell-oracle=\"true\"",
  "data-visual-instance-variant=\"desktop-light-operations-cockpit\"",
  "data-visual-instance-variant=\"desktop-light-operations-cockpit-collapsed\"",
  "data-visual-instance-variant=\"desktop-dark-operations-cockpit\"",
  "data-visual-instance-variant=\"desktop-dark-operations-cockpit-collapsed\"",
  "data-visual-instance-variant=\"desktop-light-work-queue\"",
  "data-visual-instance-variant=\"desktop-light-work-queue-collapsed\"",
  "data-visual-instance-variant=\"mobile-dark-zh-cn-work-queue\"",
  "data-visual-instance-variant=\"desktop-light-operations-search-results\"",
  "data-contract-story-id=\"ai-consumption-contract\"",
  "data-ai-consumption-contract-story=\"true\"",
  "ai-consumption-contract.json",
  "rel=\"alternate\" type=\"application/json\" href=\"ai-consumption-contract.json\"",
  "data-tcrn-ai-consumption-contract=\"true\"",
  "rel=\"help\" type=\"text/plain\" href=\"llms.txt\"",
  "name=\"tcrn-ai-consumption-contract\" content=\"ai-consumption-contract.json\"",
  "name=\"tcrn-ai-consumption-contract-route\" content=\"proof.html#ai-consumption-contract\"",
  "name=\"tcrn-ai-consumption-contract-required\" content=\"must-read-first\"",
  // TCRN-DS-STORY-051: "Light and dark Storybook shell" + "Storybook doc shell control contract"
  // moved to requiredRendered (checked against script-stripped page bytes) so they assert
  // rendered content, not the embedded dictionary payload.
  "Use one circular icon-only button",
  "one whole-page transition",
  "current locale name in that locale",
  "Keep search compact at rest, expand smoothly on focus, and collapse on blur",
  "not as a top-bar human navigation item",
  "Storybook shell controls",
  "single icon theme toggle, native-name locale menu, focus-expanded search, no AI JSON link in the top bar, and one whole-page theme transition",
  // TCRN-DS-STORY-051: "Theme modes" moved to requiredRendered (script-stripped assertion).
  "aria-label=\"TCRN brand mark\"",
  "src=\"tcrn-brand-mark.svg\"",
  // TCRN-DS-STORY-051: the three brand-mark description sentences moved to requiredRendered
  // (script-stripped assertion). The shell.noClaim sentence ("Product adoption, publication,
  // release readiness, product acceptance, and final MVP acceptance are not claimed.") is
  // RETIRED — that dictionary key never rendered and is deleted from all five locales; the
  // no-overclaim boundary is carried by the rendered page-head chips (shell.noPackagePublicationClaim
  // / shell.noProductAdoptionClaim / shell.acceptanceDownstreamClaim).
  "data-anchor-scroll-controlled=\"true\"",
  // TCRN-DS-SUB-168: the knowledge-base sample is the top-band shell now (its rail and chapter
  // navigation sentence retired with the sample's side rail).
  "The knowledge-base shell is the top-band shell: the navigation opens from the brand button"
];
const componentPage = pages.Components;
const staticDocStyleIndex = componentPage.indexOf("data-tcrn-static-doc-style-source=\"storybook\"");
const componentStyleIndex = componentPage.indexOf("data-tcrn-component-style-source=\"@tcrn/ui-react\"");
const docShellComponentStyleIndex = componentPage.indexOf("data-tcrn-doc-shell-component-style=\"package-backed\"");
const comparatorComponentStyleIndex = componentPage.indexOf("data-tcrn-product-shell-comparator-style=\"package-backed\"");
if (staticDocStyleIndex < 0) {
  required.push("data-tcrn-static-doc-style-source=\"storybook\"");
}
if (componentStyleIndex < 0) {
  required.push("data-tcrn-component-style-source=\"@tcrn/ui-react\"");
}
if (docShellComponentStyleIndex < 0) {
  required.push("data-tcrn-doc-shell-component-style=\"package-backed\"");
}
if (comparatorComponentStyleIndex < 0) {
  required.push("data-tcrn-product-shell-comparator-style=\"package-backed\"");
}
if (comparatorComponentStyleIndex >= 0 && staticDocStyleIndex >= 0 && comparatorComponentStyleIndex < staticDocStyleIndex) {
  required.push("product-shell-component-style-after-static-doc-style");
}
for (const text of [
  "data-tcrn-product-shell-comparator-style=\"package-backed\"",
  ".tcrn-product-shell",
  ".tcrn-shell-theme-toggle",
  ".tcrn-shell-locale-menu__trigger",
  // TCRN-DS-SUB-168: the band's brand button replaced the rail toggle (its rule and its desktop markup).
  ".tcrn-shell-brand",
  "data-shell-brand=\"v2\"",
  "--tcrn-motion-product-shell-search: 240ms var(--tcrn-motion-ease-drawer)",
  "flex-basis: 260px",
  "flex-basis: 420px",
  // TCRN-DS-STORY-063: the feedback-family rules must stay in the package stylesheet. These are
  // CSS-selector markers (never present in the i18n payload), so they can only be satisfied by the
  // actual component-style block. Runtime hover is proven separately in internal-alpha:proof.
  ".tcrn-button:focus-visible",
  // G+ state rules: the active state is a :where() state rule on the pair table (TCRN-DS-SUB-016).
  gplusStateSelector(".tcrn-link-button", "actions", "a"),
  ".tcrn-search-result-list__head a:focus-visible",
  // TCRN-DS-SUB-168: the tab-shaped forms are one family (TCRN-DS-SUB-124): the tab's focus state
  // rule and its selected state (the 6% wash and the strong weight) replace SegmentedNav's focus and
  // press rules.
  ".tcrn-tabs__tab:where(:focus-visible",
  ".tcrn-tabs__tab:where([data-selected=\"true\"])",
  ".tcrn-product-shell-search[data-search-expanded=\"true\"]",
  ".tcrn-product-shell[data-theme-switching=\"true\"]::after",
  "tcrn-product-shell-theme-wash",
  "@media (prefers-reduced-motion: reduce)"
]) {
  required.push(text);
}
for (const text of [
  "data-functional-components-contract=\"package-backed-static\"",
  "data-records-and-boards-patterns=\"static-no-live\"",
  "RelationshipChip",
  "MachineToken",
  "MachineTokenCell",
  "SubNav",
  "PageHeader",
  "ViewTabs",
  "QuickFilters",
  "RecordRow",
  "RecordTable",
  "SplitView",
  "SearchableList",
  "RowGroup",
  "LaneBoard",
  "DetailLayout",
  "MetadataRail",
  "DetailInspector",
  "TreeNav",
  "DocumentCanvas",
  "TocRail",
  "InlineCommentList",
  "AttachmentList",
  "LabelSet",
  "VersionHistory",
  "TemplateGallery",
  "SearchResultList",
  "ActivityFeed",
  "RelationGraph",
  "StagePipeline",
  "RecordInspector",
  "SavedViewToolbar",
  "functional_display_static_pattern_receipt",
  "Functional display package exports cover static records, stages, relations, documents, and machine-token presentation",
  "API integration, backend persistence, live dispatch, external queues, runtime data mutation, product adoption, owner acceptance, release readiness, and package publication are not claimed"
]) {
  required.push(text);
}
for (const relation of ["blocks", "blocked_by", "depends_on", "relates_to", "duplicates", "supersedes", "split_from", "caused_by", "implements", "verifies", "reviews", "refreshes"]) {
  required.push(`data-relationship="${relation}"`);
}
const combinedContractText = `${combinedHtml}\n${JSON.stringify(contract)}\n${llmsTxt}`;
// TCRN-DS-STORY-051: page bytes inline the entire i18n dictionary inside each page's
// storybookI18nScript <script> block, so a raw `required` pin can be satisfied by the payload
// even when the string never renders. Strip <script>/<style> so rendered-content pins assert
// what is actually in the document, not the embedded dictionary.
const renderedCombinedText = Object.values(pages)
  .map((html) => html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ""))
  .join("\n");
// Render-intent dictionary-backed literals: these must appear in the stripped (rendered) page
// bytes, not merely in the embedded payload.
const requiredRendered = [
  "Light and dark Storybook shell",
  "Storybook doc shell control contract",
  "Theme modes",
  "Four large rounded diamond tiles use iris blue, violet-blue, aqua, and slate with tight even gaps.",
  "Each point uses a white ring with a same-family inner color that differs from the tile fill.",
  "No red, pink, coral, or orange connector points."
];
// Payload translation coverage: the ja/ko shell titles legitimately ship inside the embedded
// i18n payload for runtime locale switching but never render on the static en pages. Assert the
// translation is present in the payload (raw bytes) — explicitly NOT a rendered-text assertion.
const payloadTranslationCoverage = [
  "TCRN デザインシステム契約ストーリー",
  "TCRN 디자인 시스템 계약 스토리"
];
const missing = required.filter((text) => !combinedContractText.includes(text));
// O-9 (judgment §3.1, default until the Owner rules): AOS has no mark in logos2 yet, so its two
// visual instances wear the design-system mark as a placeholder and keep declaring the AOS asset
// they are owed. The two AOS pins are read in that placeholder form, not dropped: the owner-quality
// instance still names tcrn-aos-two-line, and both AOS instances carry the design-system mark.
for (const storyId of ["frontend-shell-slice", "owner-quality-product-shell"]) {
  const storyHtml = readStoryHtml(combinedHtml, storyId);
  if (!/data-aos-visual-instance-oracle="true"|data-visual-instance-product-logo="tcrn-aos-two-line"/.test(storyHtml)) {
    missing.push(`aos-placeholder:${storyId}:aos-instance`);
  }
  if (!storyHtml.includes('data-product-mark="design-system"')) {
    missing.push(`aos-placeholder:${storyId}:design-system-mark`);
  }
}
if (!readStoryHtml(combinedHtml, "owner-quality-product-shell").includes('data-visual-instance-product-logo="tcrn-aos-two-line"')) {
  missing.push("aos-placeholder:owner-quality-product-shell:declared-asset:tcrn-aos-two-line");
}
for (const text of requiredRendered.filter((text) => !renderedCombinedText.includes(text))) {
  missing.push(`unrendered-dictionary-backed-pin:${text}`);
}
for (const text of payloadTranslationCoverage.filter((text) => !combinedHtml.includes(text))) {
  missing.push(`missing-payload-translation:${text}`);
}
for (const { label, value } of [
  { label: "generated-static-html", value: combinedHtml },
  { label: "generated-ai-contract-json", value: JSON.stringify(contract) },
  { label: "generated-llms-txt", value: llmsTxt },
  { label: "generated-robots-txt", value: robotsTxt },
  { label: "functional-display-story-source", value: readFileSync("apps/storybook/src/contract-stories/story-content.tsx", "utf8") },
  { label: "functional-display-package-test-fixture", value: readFileSync("packages/ui-react/src/components/DataDisplay/DataDisplay.test.tsx", "utf8") },
  { label: "visual-proof-baseline-manifest", value: readFileSync("docs/verification/storybook-visual-proof/baseline-manifest.json", "utf8") },
  { label: "visual-proof-check-receipt", value: readFileSync("docs/verification/storybook-visual-proof/check-receipt.json", "utf8") },
  { label: "visual-proof-update-receipt", value: readFileSync("docs/verification/storybook-visual-proof/update-receipt.json", "utf8") },
  { label: "internal-alpha-browser-proof-summary", value: readFileSync("docs/verification/internal-alpha/browser-proof-summary.json", "utf8") },
  { label: "internal-alpha-story-coverage-manifest", value: readFileSync("docs/verification/internal-alpha/story-coverage-manifest.json", "utf8") },
  { label: "internal-alpha-visual-baseline-manifest", value: readFileSync("docs/verification/internal-alpha/visual-baseline-manifest.json", "utf8") },
  { label: "internal-alpha-package-contract-manifest", value: readFileSync("docs/verification/internal-alpha/package-contract-manifest.json", "utf8") }
]) {
  for (const { name, pattern } of localAbsolutePathDenyPatterns) {
    if (pattern.test(value)) {
      missing.push(`forbidden-local-absolute-path:${label}:${name}`);
    }
  }
}
for (const forbiddenGlobalShellMarker of [
  "data-storybook-shell-authority=\"@tcrn/ui-react/ProductShell\"",
  "data-storybook-product-shell-skin=\"confirmed-storybook-visual-v1\"",
  "data-anchor-scroll-controlled=\"product-shell-topbar-aware\""
]) {
  if (combinedHtml.includes(forbiddenGlobalShellMarker)) {
    missing.push(`forbidden-global-shell-marker:${forbiddenGlobalShellMarker}`);
  }
}
for (const forbiddenCleanRoomRuntimePattern of [
  /Atlassian/i,
  /Jira/i,
  /jira-like/i,
  /issue-style/i,
  /WorkIssueRow/,
  /IssueRow/,
  /Kanban/,
  /Scrum/
]) {
  if (forbiddenCleanRoomRuntimePattern.test(combinedHtml)) {
    missing.push(`forbidden-clean-room-runtime:${forbiddenCleanRoomRuntimePattern.source}`);
  }
}
// ProductShell renders in two designated homes: Components (navigation-shell-spec comparator +
// component examples) and Proof (the AOS visual-instance oracles, moved there by TCRN-DS-STORY-057).
const nonComponentHtml = Object.entries(pages)
  .filter(([group]) => group !== "Components" && group !== "Proof")
  .map(([, html]) => html)
  .join("\n");
for (const forbiddenGlobalShellMarker of [
  "data-package-backed-product-shell-boundary=\"side-nav-shell-v1\""
]) {
  if (nonComponentHtml.includes(forbiddenGlobalShellMarker)) {
    missing.push(`forbidden-global-shell-marker:${forbiddenGlobalShellMarker}`);
  }
}
for (const forbiddenGlobalShellPattern of [
  /data-product-shell-region="side-navigation"/,
  /class="[^"]*tcrn-product-shell__sidebar/,
]) {
  if (forbiddenGlobalShellPattern.test(nonComponentHtml)) {
    missing.push(`forbidden-global-shell-pattern:${forbiddenGlobalShellPattern.source}`);
  }
}
// The page chrome is itself a ProductShell (TCRN-DS-SUB-131): outside Components and Proof its main region
// occurs once per page, on the documentation shell, and never on a story.
{
  const docShellRoots = nonComponentHtml.match(/data-shell="doc"/g)?.length ?? 0;
  for (const pattern of [/class="[^"]*tcrn-product-shell__main/g, /class="[^"]*tcrn-product-shell-search__results/g]) {
    const occurrences = nonComponentHtml.match(pattern)?.length ?? 0;
    if (docShellRoots === 0 || occurrences !== docShellRoots) {
      missing.push(`forbidden-global-shell-pattern:${pattern.source}:${occurrences}/${docShellRoots}`);
    }
  }
}
const brandIdentityStoryHtml = readStoryHtml(pages["Style Guide"], "brand-identity");
if (!brandIdentityStoryHtml.includes("Product lockups")) {
  missing.push("brand-identity:product-lockups");
}
if ((brandIdentityStoryHtml.match(/data-brand-lockup="product"/g) ?? []).length !== 3) {
  missing.push("brand-identity:three-product-lockups");
}
if (brandIdentityStoryHtml.includes("Registered product logos")) {
  missing.push("brand-identity:registered-product-logos-primary-surface");
}
if (brandIdentityStoryHtml.includes("ProductLogo / tcrnProductLogoRegistry")) {
  missing.push("brand-identity:product-logo-registry-table-primary-surface");
}

// The breadcrumb story is where consumers read the way-back contract, so the shipped
// page has to show the linked/inert pairing rather than describe it. Asserting the
// rendered trail rather than the story source is the point: the source could keep the
// href while the component stopped emitting the anchor, and the reader would be copying
// a pattern that no longer works.
const navigationPrimitivesStoryHtml = readStoryHtml(pages["Components"], "navigation-primitives-spec");
const renderedTrail = /<nav class="tcrn-breadcrumb"[^>]*>([\s\S]*?)<\/nav>/.exec(navigationPrimitivesStoryHtml);
if (!renderedTrail) {
  missing.push("navigation-reversibility:breadcrumb-not-rendered");
} else {
  if (!/<a\s[^>]*href="/.test(renderedTrail[1])) {
    missing.push("navigation-reversibility:no-linked-ancestor-crumb");
  }
  if (!/aria-current="page"/.test(renderedTrail[1])) {
    missing.push("navigation-reversibility:no-inert-current-crumb");
  }
  // An all-linked trail would teach a self-link on the page the reader is already on.
  if (/aria-current="page"[^>]*>\s*<a\s/.test(renderedTrail[1])) {
    missing.push("navigation-reversibility:current-crumb-is-a-link");
  }
}
for (const [sourceName, source] of [
  ["alpha-styles.ts", storybookAlphaStylesSource],
  ["storybook.css", storybookStaticCssSource]
]) {
  for (const [ruleName, pattern] of [
    ["broad-focus-visible", /(^|\n)\s*button:focus-visible\s*,/],
    ["raw-search-input", /(^|\n)\s*\.tcrn-search-input\s*\{/],
    ["raw-search-control", /(^|\n)[^{\n]*\.tcrn-search-input__control[^{]*\{/],
    ["raw-search-shortcut", /(^|\n)[^{\n]*\.tcrn-search-input__shortcut[^{]*\{/],
    ["raw-table-shell-row", /(^|\n)[^{\n]*\.tcrn-table-shell__(?:head|row|cell|empty)[^{]*\{/],
    ["raw-brand-mark", /(^|\n)[^{\n]*\.tcrn-brand-mark[^{]*\{/],
    ["raw-brand-lockup", /(^|\n)[^{\n]*\.tcrn-brand-lockup(?:[\s.{:#,[>+~]|$)/],
    ["raw-top-bar", /(^|\n)\s*\.tcrn-top-bar\s*\{/],
    ["raw-top-bar-actions", /(^|\n)\s*\.tcrn-top-bar__actions\s*\{/],
    ["raw-nav-item", /(^|\n)\s*\.tcrn-nav-item\s*\{/],
    ["raw-nav-item-selected", /(^|\n)\s*\.tcrn-nav-item\[data-selected="true"\]\s*\{/]
  ]) {
    if (pattern.test(source)) {
      missing.push(`storybook-doc-css-contamination:${sourceName}:${ruleName}`);
    }
  }
}
if (contract.mustReadFirst !== true) {
  missing.push("contract.mustReadFirst:true");
}
const shellControlVisualParityProof = contract.shellControlVisualParityProof;
if (shellControlVisualParityProof?.disposition !== "executable_required_for_product_shell_consumption") {
  missing.push("contract.shellControlVisualParityProof.disposition");
}
for (const field of ["productLogo", "themeToggle", "sideNavToggle", "localeTrigger", "searchInput", "searchControl", "searchShortcut", "currentLocation", "selectedNavItem", "topBar"]) {
  if (!shellControlVisualParityProof?.measuredControls?.includes(field)) {
    missing.push(`contract.shellControlVisualParityProof.measuredControls:${field}`);
  }
}
for (const field of ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "backgroundColor", "borderRadius", "boxShadow"]) {
  if (!shellControlVisualParityProof?.computedStyleFields?.includes(field)) {
    missing.push(`contract.shellControlVisualParityProof.computedStyleFields:${field}`);
  }
}
for (const field of ["outlineWidth", "outlineStyle", "outlineColor", "outlineOffset", "boxShadow"]) {
  if (!shellControlVisualParityProof?.focusFields?.includes(field)) {
    missing.push(`contract.shellControlVisualParityProof.focusFields:${field}`);
  }
}
for (const field of ["transitionProperty", "transitionDuration", "transitionTimingFunction", "sampledWidthTimeline", "animationDuration", "animationTimingFunction"]) {
  if (!shellControlVisualParityProof?.motionFields?.includes(field)) {
    missing.push(`contract.shellControlVisualParityProof.motionFields:${field}`);
  }
}
if (shellControlVisualParityProof?.controlOrder?.join(">") !== aiContractShellControlReadback.controlOrder.join(">")) {
  missing.push("contract.shellControlVisualParityProof.controlOrder");
}
if (shellControlVisualParityProof?.searchRestWidth?.maxPx !== 260 || shellControlVisualParityProof?.searchRestWidth?.expandedMaxPx !== 420) {
  missing.push("contract.shellControlVisualParityProof.searchRestWidth");
}
if (shellControlVisualParityProof?.searchMotionTimeline?.transitionDuration !== aiContractShellControlReadback.searchTransitionDuration) {
  missing.push("contract.shellControlVisualParityProof.searchMotionTimeline.transitionDuration");
}
if (shellControlVisualParityProof?.searchMotionTimeline?.transitionProperties?.join(">") !== aiContractShellControlReadback.searchTransitionProperties.join(">")) {
  missing.push("contract.shellControlVisualParityProof.searchMotionTimeline.transitionProperties");
}
if (!String(shellControlVisualParityProof?.ownerQualitySideNavCollapsePolicy ?? "").includes("actionable")) {
  missing.push("contract.shellControlVisualParityProof.ownerQualitySideNavCollapsePolicy");
}
// The published tagline is a five-locale object, not a string. Checking only the
// English member is what let the contract describe a translated field as one
// English value; a consumer reading it would render English on four routes.
const expectedTaglines = {
  aos: { assetId: "tcrn-aos-two-line", en: "AI Operation System", "zh-CN": "AI 运营系统" },
  // G+ tagline (TCRN-DS-STORY-127, marks.json via the generated product marks).
  tms: { assetId: "tcrn-tms-two-line", en: "Talent Management System", "zh-CN": "艺人管理系统" }
};
for (const [productId, expected] of Object.entries(expectedTaglines)) {
  const logo = contract.productLogoRegistry?.find?.((entry) => entry.productId === productId);
  const localesPresent = logo?.lineTwo && typeof logo.lineTwo === "object"
    && ["en", "fr", "ja", "ko", "zh-CN"].every((locale) => typeof logo.lineTwo[locale] === "string");
  if (!logo || logo.assetId !== expected.assetId || !localesPresent
    || logo.lineTwo.en !== expected.en || logo.lineTwo["zh-CN"] !== expected["zh-CN"]) {
    missing.push(`contract.productLogoRegistry:${productId}`);
  }
}
const aosVisualInstanceOracle = contract.visualInstanceOracles?.find?.((entry) => entry.id === "frontend-shell-slice");
if (!aosVisualInstanceOracle) {
  missing.push("contract.visualInstanceOracles:frontend-shell-slice");
} else {
  for (const requiredField of [
    "route",
    "packageMapping",
    "primaryIa",
    "requiredVariants",
    "requiredVariantFixtures",
    "delegatedInteractionProofs",
    "ownerVisualAdmissionBoundary",
    "persistedCockpitRestPolicy",
    "negativeCriteria"
  ]) {
    if (aosVisualInstanceOracle[requiredField] === undefined) {
      missing.push(`contract.visualInstanceOracles.aos.${requiredField}`);
    }
  }
  for (const variant of aosFrontendShellVisualInstanceContract.variants) {
    if (!aosVisualInstanceOracle.requiredVariantFixtures?.some?.((fixture) => fixture.id === variant)) {
      missing.push(`contract.visualInstanceOracles.aos.requiredVariantFixtures:${variant}`);
    }
  }
  for (const packageName of aosFrontendShellVisualInstanceContract.packageMapping) {
    if (!aosVisualInstanceOracle.packageMapping?.includes(packageName)) {
      missing.push(`contract.visualInstanceOracles.aos.packageMapping:${packageName}`);
    }
  }
  if (aosVisualInstanceOracle.persistedCockpitRestPolicy?.defaultCockpitRestVariant !== aosFrontendShellVisualInstanceContract.persistedCockpitRestPolicy.defaultCockpitRestVariant) {
    missing.push("contract.visualInstanceOracles.aos.persistedCockpitRestPolicy.defaultCockpitRestVariant");
  }
  if (!aosVisualInstanceOracle.persistedCockpitRestPolicy?.coveredOwnerReachableRoutes?.includes("post-search-dismissal:/cockpit?locale=en&theme=light&collapsed=false&search=shell")) {
    missing.push("contract.visualInstanceOracles.aos.persistedCockpitRestPolicy.searchDismissalRoute");
  }
  if (aosVisualInstanceOracle.persistedCockpitRestPolicy?.outsideMatrixMarkerForbiddenForOwnerReview !== "aos-route-state-outside-accepted-oracle-matrix") {
    missing.push("contract.visualInstanceOracles.aos.persistedCockpitRestPolicy.outsideMatrixMarker");
  }
}
const ownerQualityVisualInstanceOracle = contract.visualInstanceOracles?.find?.((entry) => entry.id === "owner-quality-product-shell");
if (!ownerQualityVisualInstanceOracle) {
  missing.push("contract.visualInstanceOracles:owner-quality-product-shell");
} else {
  for (const requiredField of [
    "route",
    "disposition",
    "replacesOwnerQualityTarget",
    "packageMapping",
    "primaryIa",
    "requiredVariants",
    "requiredVariantFixtures",
    "slots",
    "ownerQualityAcceptanceCriteria",
    "rejectCriteria",
    "ownerQualitySideNavPolicy",
    "delegatedSubOracles",
    "ownerVisualAdmissionBoundary",
    "negativeCriteria"
  ]) {
    if (ownerQualityVisualInstanceOracle[requiredField] === undefined) {
      missing.push(`contract.visualInstanceOracles.ownerQuality.${requiredField}`);
    }
  }
  if (ownerQualityVisualInstanceOracle.replacesOwnerQualityTarget !== "frontend-shell-slice") {
    missing.push("contract.visualInstanceOracles.ownerQuality.replacesOwnerQualityTarget");
  }
  for (const variant of aosOwnerQualityProductShellContract.variants) {
    if (!ownerQualityVisualInstanceOracle.requiredVariantFixtures?.some?.((fixture) => fixture.id === variant)) {
      missing.push(`contract.visualInstanceOracles.ownerQuality.requiredVariantFixtures:${variant}`);
    }
  }
  for (const packageName of aosOwnerQualityProductShellContract.packageMapping) {
    if (!ownerQualityVisualInstanceOracle.packageMapping?.includes(packageName)) {
      missing.push(`contract.visualInstanceOracles.ownerQuality.packageMapping:${packageName}`);
    }
  }
  if (!ownerQualityVisualInstanceOracle.ownerQualityAcceptanceCriteria?.join(" ")?.includes("first viewport reads as a product shell")) {
    missing.push("contract.visualInstanceOracles.ownerQuality.ownerQualityAcceptanceCriteria");
  }
  if (!ownerQualityVisualInstanceOracle.ownerQualityAcceptanceCriteria?.join(" ")?.includes("registered product identity")) {
    missing.push("contract.visualInstanceOracles.ownerQuality.registeredProductIdentityCriteria");
  }
  if (ownerQualityVisualInstanceOracle.ownerQualityAcceptanceCriteria?.join(" ")?.includes("Rebuild Workspace")) {
    missing.push("contract.visualInstanceOracles.ownerQuality.staleProductWorkspaceCriteria");
  }
  if (!ownerQualityVisualInstanceOracle.rejectCriteria?.join(" ")?.includes("placeholder shell")) {
    missing.push("contract.visualInstanceOracles.ownerQuality.rejectCriteria");
  }
  if (ownerQualityVisualInstanceOracle.ownerVisualAdmissionBoundary !== aosOwnerQualityProductShellContract.ownerVisualAdmissionBoundary) {
    missing.push("contract.visualInstanceOracles.ownerQuality.ownerVisualAdmissionBoundary");
  }
  if (ownerQualityVisualInstanceOracle.ownerQualitySideNavPolicy?.collapseAffordance !== "actionable_toggle") {
    missing.push("contract.visualInstanceOracles.ownerQuality.ownerQualitySideNavPolicy.collapseAffordance");
  }
  if (ownerQualityVisualInstanceOracle.ownerQualitySideNavPolicy?.expandedOnly !== false) {
    missing.push("contract.visualInstanceOracles.ownerQuality.ownerQualitySideNavPolicy.expandedOnly");
  }
  for (const variant of aiContractShellControlReadback.ownerQualityAdmittedCollapsedVariants) {
    if (!ownerQualityVisualInstanceOracle.ownerQualitySideNavPolicy?.admittedCollapsedVariants?.includes?.(variant)) {
      missing.push(`contract.visualInstanceOracles.ownerQuality.ownerQualitySideNavPolicy.admittedCollapsedVariants:${variant}`);
    }
  }
}
for (const route of ["ai-consumption-contract.json", "llms.txt", "proof.html#ai-consumption-contract"]) {
  if (!contract.firstReadRoutes?.includes(route)) {
    missing.push(`contract.firstReadRoutes:${route}`);
  }
}
for (const field of [
  "contractVersion",
  "contractPayloadDigest",
  "artifact",
  "route",
  "readAt",
  "coveredRules",
  "coveredStorybookSections",
  "foundationVisualStandards",
  "consumerVisualStyleContract",
  "requiredProof",
  "noOverclaimBoundaries"
]) {
  if (!contract.requiredReadbackFields?.includes(field)) {
    missing.push(`contract.requiredReadbackFields:${field}`);
  }
}
const contractSectionChecklist = contract.requiredStorybookSectionChecklist;
if (!Array.isArray(contractSectionChecklist)) {
  missing.push("contract.requiredStorybookSectionChecklist");
} else {
  const sections = contractSectionChecklist.map((section) => section.section);
  const sectionStories = contractSectionChecklist.flatMap((section) => section.requiredStories ?? []);
  for (const section of expectedContractStoryGroups) {
    if (!sections.includes(section)) {
      missing.push(`contract.coveredStorybookSections:${section}`);
    }
  }
  for (const story of requiredStories) {
    if (!sectionStories.includes(story.id)) {
      missing.push(`contract.coveredStorybookSections.story:${story.id}`);
    }
  }
}
const coveredStorybookSections = contract.coveredStorybookSections;
if (!Array.isArray(coveredStorybookSections)) {
  missing.push("contract.coveredStorybookSections");
} else {
  const sections = coveredStorybookSections.map((section) => section.section);
  const categoryCount = coveredStorybookSections.reduce((total, section) => total + (section.categories?.length ?? 0), 0);
  const coveredStoryIds = coveredStorybookSections.flatMap((section) => section.categories?.flatMap((category) => category.storyIds ?? []) ?? []);
  for (const section of expectedContractStoryGroups) {
    if (!sections.includes(section)) {
      missing.push(`contract.coveredStorybookSections.section:${section}`);
    }
  }
  if (categoryCount !== expectedStoryCategoryCount) {
    missing.push(`contract.coveredStorybookSections.categoryCount:${categoryCount}`);
  }
  for (const story of requiredStories) {
    if (!coveredStoryIds.includes(story.id)) {
      missing.push(`contract.coveredStorybookSections.story:${story.id}`);
    }
  }
}
if (contract.storybookGovernanceTraceability?.hierarchy !== "section -> category -> story") {
  missing.push("contract.storybookGovernanceTraceability.hierarchy");
}
if (!contract.storybookGovernanceTraceability?.requiredStoryFields?.includes?.("sourcePath")) {
  missing.push("contract.storybookGovernanceTraceability.requiredStoryFields.sourcePath");
}
if (!String(contract.storybookGovernanceTraceability?.mandatoryBoundaryVisibility ?? "").includes("outside optional disclosure")) {
  missing.push("contract.storybookGovernanceTraceability.mandatoryBoundaryVisibility");
}
if (!contract.changelogGovernance?.records?.length) {
  missing.push("contract.changelogGovernance.records");
}
if (!contract.changelogGovernance?.requiredFields?.includes?.("proofArtifacts")) {
  missing.push("contract.changelogGovernance.requiredFields.proofArtifacts");
}
if (contract.functionalDisplayStaticAuthority?.disposition !== "static_contract_authority_explicit_and_smoke_proven") {
  missing.push("contract.functionalDisplayStaticAuthority.disposition");
}
if (!String(contract.functionalDisplayStaticAuthority?.managerRuntimeCoverageDisposition ?? "").includes("static contract story ids are the authoritative")) {
  missing.push("contract.functionalDisplayStaticAuthority.managerRuntimeCoverageDisposition");
}
if (contract.foundationVisualStandards?.registryId !== "foundation-visual-standards-v1") {
  missing.push("contract.foundationVisualStandards.registryId");
}
if (contract.foundationVisualStandards?.storybookRoute !== "foundations.html#foundation-visual-standards") {
  missing.push("contract.foundationVisualStandards.storybookRoute");
}
if (JSON.stringify(contract.foundationVisualStandards?.categoryIds ?? []) !== JSON.stringify(expectedFoundationStandardCategoryIds)) {
  missing.push("contract.foundationVisualStandards.categoryIds");
}
if ((contract.foundationVisualStandardCategories?.length ?? 0) !== expectedFoundationStandardCategoryIds.length) {
  missing.push(`contract.foundationVisualStandardCategories.length:${contract.foundationVisualStandardCategories?.length ?? "missing"}`);
}
for (const standardId of expectedFoundationStandardCategoryIds) {
  const standard = contract.foundationVisualStandardCategories?.find?.((item) => item.id === standardId);
  if (!standard) {
    missing.push(`contract.foundationVisualStandardCategories:${standardId}`);
    continue;
  }
  for (const field of ["sourcePaths", "storybookRoutes", "readbackFields", "proofExpectations"]) {
    if (!Array.isArray(standard[field]) || standard[field].length === 0) {
      missing.push(`contract.foundationVisualStandardCategories.${standardId}.${field}`);
    }
  }
  if (!String(standard.missingStandardEscalation ?? "").match(/Block|Return|Route|Skip|Do not close/)) {
    missing.push(`contract.foundationVisualStandardCategories.${standardId}.missingStandardEscalation`);
  }
}
if (contract.storybookDocShellVisualOracle?.id !== "original-storybook-doc-shell-v1") {
  missing.push("contract.storybookDocShellVisualOracle.id");
}
if (contract.storybookDocShellVisualOracle?.oracleRecoveryReceipt !== "internal DS doc-shell restoration plan (owner-held governance record)") {
  missing.push("contract.storybookDocShellVisualOracle.oracleRecoveryReceipt");
}
if (contract.storybookDocShellVisualOracle?.baselineManifestClassification !== "owner_declared_original_storybook_doc_shell_standard") {
  missing.push("contract.storybookDocShellVisualOracle.baselineManifestClassification");
}
if (!String(contract.storybookDocShellVisualOracle?.metricSourceDisposition ?? "").includes("Storybook documentation shell")) {
  missing.push("contract.storybookDocShellVisualOracle.metricSourceDisposition");
}
if (!(contract.storybookDocShellVisualOracle?.metricEvidence ?? []).some((item) => (
  item.metric === "desktopSidebarWidthPx"
  && item.signatureBaseline === "docs/verification/internal-alpha/visual-signature-baseline.json"
))) {
  missing.push("contract.storybookDocShellVisualOracle.metricEvidence.desktopSidebarWidthPx");
}
if (contract.storybookDocShellVisualOracle?.shellMetrics?.desktopSidebarWidthPx !== docShellRailWidthPx) {
  missing.push("contract.storybookDocShellVisualOracle.shellMetrics.desktopSidebarWidthPx");
}
if (contract.storybookDocShellVisualOracle?.shellMetrics?.desktopSidebarMinWidthPx !== docShellRailWidthPx) {
  missing.push("contract.storybookDocShellVisualOracle.shellMetrics.desktopSidebarMinWidthPx");
}
if (contract.storybookDocShellVisualOracle?.shellMetrics?.desktopSidebarMaxWidthPx !== docShellRailWidthPx) {
  missing.push("contract.storybookDocShellVisualOracle.shellMetrics.desktopSidebarMaxWidthPx");
}
if (contract.storybookDocShellVisualOracle?.shellMetrics?.desktopTopbarHeightPx !== docShellTopbarHeightPx) {
  missing.push("contract.storybookDocShellVisualOracle.shellMetrics.desktopTopbarHeightPx");
}
if (contract.storybookDocShellVisualOracle?.shellMetrics?.searchRestWidthPx !== docShellSearchWidthPx) {
  missing.push("contract.storybookDocShellVisualOracle.shellMetrics.searchRestWidthPx");
}
if (contract.storybookDocShellVisualOracle?.shellMetrics?.searchExpandedWidthPx !== docShellSearchWidthPx) {
  missing.push("contract.storybookDocShellVisualOracle.shellMetrics.searchExpandedWidthPx");
}
if (contract.storybookDocShellVisualOracle?.shellMetrics?.themeToggleRadiusPx !== 999) {
  missing.push("contract.storybookDocShellVisualOracle.shellMetrics.themeToggleRadiusPx");
}
if (contract.designSystemAuthorityDisposition !== "package_primitives_and_storybook_doc_shell_split") {
  missing.push("contract.designSystemAuthorityDisposition");
}
if (contract.componentStorybookParityDisposition !== "package_primitives_consumed_without_internal_clones") {
  missing.push("contract.componentStorybookParityDisposition");
}
if (contract.ownerVisualAdmissionDisposition !== "owner_review_required") {
  missing.push("contract.ownerVisualAdmissionDisposition");
}
if (contract.visualFitControlContract?.search?.storybookRestWidthPx !== 260 || contract.visualFitControlContract?.search?.storybookExpandedWidthPx !== 360) {
  missing.push("contract.visualFitControlContract.search.storybookWidth");
}
if (contract.visualFitControlContract?.search?.packageDefaultControlMinInlineSize !== "9ch") {
  missing.push("contract.visualFitControlContract.search.packageDefaultControlMinInlineSize");
}
if (!String(contract.visualFitControlContract?.productLockups?.rule ?? "").includes("suffix accents are package-owned")) {
  missing.push("contract.visualFitControlContract.productLockups.rule");
}
if (!String(contract.visualFitControlContract?.sidebar?.rule ?? "").includes("orphan visual lane")) {
  missing.push("contract.visualFitControlContract.sidebar.rule");
}
if (!String(contract.visualFitControlContract?.tablesAndContainers?.rule ?? "").includes("package-emitted column/min-width variables")) {
  missing.push("contract.visualFitControlContract.tablesAndContainers.rule");
}
if (!String(contract.visualFitControlContract?.workLayoutDensity?.authority ?? "").includes("Functional display exports")) {
  missing.push("contract.visualFitControlContract.workLayoutDensity.authority");
}
if (!contract.visualFitControlContract?.workLayoutDensity?.packageExports?.includes?.("RecordRow")
  || !contract.visualFitControlContract?.workLayoutDensity?.packageExports?.includes?.("DetailLayout")
  || !contract.visualFitControlContract?.workLayoutDensity?.packageExports?.includes?.("MachineTokenCell")) {
  missing.push("contract.visualFitControlContract.workLayoutDensity.packageExports");
}
if (contract.consumerVisualStyleContract?.id !== "consumer-visual-style-contract-v1") {
  missing.push("contract.consumerVisualStyleContract.id");
}
if (!contract.consumerVisualStyleContract?.forbiddenConsumerOverrides?.includes?.("consumer-local ProductShell/search/theme/locale/sidebar clones")) {
  missing.push("contract.consumerVisualStyleContract.forbiddenConsumerOverrides.productShellClones");
}
if (!String(contract.consumerVisualStyleContract?.forbiddenConsumerOverrides?.join(" ") ?? "").includes("consumer-local page header")) {
  missing.push("contract.consumerVisualStyleContract.forbiddenConsumerOverrides.workLayoutClones");
}
if (!contract.consumerVisualStyleContract?.requiredReadbackFields?.includes?.("foundationVisualStandards")) {
  missing.push("contract.consumerVisualStyleContract.requiredReadbackFields.foundationVisualStandards");
}
if (contract.settingControlSelectionContract?.id !== "setting-control-selection-contract-v1") {
  missing.push("contract.settingControlSelectionContract.id");
}
if (!contract.settingControlSelectionContract?.packageExports?.includes?.("SettingChoice")
  || !contract.settingControlSelectionContract?.packageExports?.includes?.("NumberInput")
  || !contract.settingControlSelectionContract?.packageExports?.includes?.("SegmentedNav")) {
  missing.push("contract.settingControlSelectionContract.packageExports");
}
if (!String(contract.settingControlSelectionContract?.stateRetention?.callback ?? "").includes("layout-only branch switch")) {
  missing.push("contract.settingControlSelectionContract.stateRetention");
}
if (contract.fieldValueSelectionContract?.id !== "field-value-selection-contract-v1"
  || !contract.fieldValueSelectionContract?.packageExports?.includes?.("MultiSelect")
  || !contract.fieldValueSelectionContract?.packageExports?.includes?.("SuggestInput")) {
  missing.push("contract.fieldValueSelectionContract");
}
if (contract.dictionaryContentContract?.id !== "dictionary-content-contract-v1"
  || !contract.dictionaryContentContract?.packageExports?.includes?.("DictionaryTable")) {
  missing.push("contract.dictionaryContentContract");
}
if (contract.overlayBoundaryContract?.id !== "overlay-boundary-contract-v1"
  || !contract.overlayBoundaryContract?.packageExports?.includes?.("Tooltip")
  || !contract.overlayBoundaryContract?.packageExports?.includes?.("Popover")
  || !contract.overlayBoundaryContract?.packageExports?.includes?.("mountStaticOverlayBoundary")
  || !String(contract.overlayBoundaryContract?.geometry?.edgePolicy ?? "").includes("flip")) {
  missing.push("contract.overlayBoundaryContract");
}
if (!String(contract.overlayBoundaryContract?.staticConsumerMigration?.bootstrap ?? "").includes("tcrnComponentCss")
  || !String(contract.overlayBoundaryContract?.staticConsumerMigration?.behavior ?? "").includes("document.body")) {
  missing.push("contract.overlayBoundaryContract.staticConsumerMigration");
}
if (contract.settingsLayoutContract?.id !== "settings-layout-contract-v1"
  || contract.settingsLayoutContract?.containerQueries?.[0]?.thresholdPx !== 960
  || contract.settingsLayoutContract?.containerQueries?.[1]?.thresholdPx !== 720) {
  missing.push("contract.settingsLayoutContract.containerQueries");
}
if (contract.pageHierarchyContract?.id !== "page-hierarchy-contract-v1"
  || !contract.pageHierarchyContract?.packageExports?.includes?.("PageHierarchy")
  || contract.pageHierarchyContract?.depthDecisionTable?.map?.((row) => row.depth).join(",") !== "two,three"
  || !String(contract.pageHierarchyContract?.widthPolicy ?? "").includes("never infers")) {
  missing.push("contract.pageHierarchyContract");
}
if (contract.operationFeedbackContract?.id !== "operation-feedback-contract-v1"
  || !contract.operationFeedbackContract?.packageExports?.includes?.("OperationFeedback")
  || JSON.stringify(contract.operationFeedbackContract?.phases) !== JSON.stringify(["idle", "loading", "success", "error"])
  || contract.operationFeedbackContract?.phaseSemantics?.find?.((entry) => entry.phase === "loading")?.labels?.en !== "In progress"
  || !String(contract.operationFeedbackContract?.stateContract ?? "").includes("must equal phase")
  || !String(contract.operationFeedbackContract?.roles?.details ?? "").includes("keyboard-reachable")) {
  missing.push("contract.operationFeedbackContract");
}
if (contract.contentScopeContract?.id !== "content-scope-contract-v1"
  || !contract.contentScopeContract?.packageExports?.includes?.("ContentScope")
  || !contract.contentScopeContract?.packageExports?.includes?.("validateContentScope")
  || !String(contract.contentScopeContract?.renderedContentEvidence ?? "").includes("empty fragments")
  || !String(contract.contentScopeContract?.independentScopes ?? "").includes("independently")) {
  missing.push("contract.contentScopeContract");
}
if (contract.consumerEvidenceContract?.id !== "consumer-evidence-verification-contract-v1"
  || contract.consumerEvidenceContract?.utility !== "evaluateConsumerEvidence"
  || !contract.consumerEvidenceContract?.valueEvidence?.observedFields?.includes?.("readbackValue")
  || JSON.stringify(contract.consumerEvidenceContract?.zoomAxes) !== JSON.stringify(["dpr", "pinch-visual-viewport", "page-zoom"])
  || !String(contract.consumerEvidenceContract?.lifecycleIntersection ?? "").includes("one observation")) {
  missing.push("contract.consumerEvidenceContract");
}
if (contract.verificationCadenceContract?.id !== "ds-verification-cadence-contract-v1"
  || JSON.stringify(contract.verificationCadenceContract?.stages?.map?.((stage) => stage.id)) !== JSON.stringify(["development", "candidate-final", "post-change"])
  || !contract.verificationCadenceContract?.deduplication?.containedCommands?.includes?.("pnpm full-surface:proof")
  || !contract.verificationCadenceContract?.evidenceReuse?.invalidators?.includes?.("prior failure")) {
  missing.push("contract.verificationCadenceContract");
}
if (!pages.Patterns.includes('id="page-hierarchy-contract"')
  || (pages.Patterns.match(/data-page-hierarchy-depth="two"/g) ?? []).length !== 1
  || (pages.Patterns.match(/data-page-hierarchy-depth="three"/g) ?? []).length !== 1
  || !pages.Patterns.includes('data-page-hierarchy-shell-boundary="global-product-shell-external"')) {
  missing.push("patterns.pageHierarchyContract.story");
}
if (contract.consumerVerificationContract?.id !== "consumer-verification-contract-v1"
  || contract.consumerVerificationContract?.browserScript !== "scripts/full-surface-remediation-proof.mjs"
  || contract.consumerVerificationContract?.proofVersion !== "tcrn.ds-consumption-proof.v2"
  || contract.consumerVerificationContract?.contractVersion !== "ds_consumption_contract_v2"
  || !contract.consumerVerificationContract?.negativeLegs?.some?.((leg) => leg.includes("class/CSS"))) {
  missing.push("contract.consumerVerificationContract.negativeLegs");
}
if (!llmsTxt.includes("Agents must read ai-consumption-contract.json before implementation work.")) {
  missing.push("llms-first-read-requirement");
}
if (!llmsTxt.includes("Required readback fields: contractVersion, contractPayloadDigest, artifact, route, readAt, coveredRules, foundationVisualStandards, consumerVisualStyleContract, settingControlSelectionContract, fieldValueSelectionContract, dictionaryContentContract, overlayBoundaryContract, settingsLayoutContract, pageHierarchyContract, verificationCadenceContract, operationFeedbackContract, contentScopeContract, consumerEvidenceContract, consumerVerificationContract, requiredProof, noOverclaimBoundaries, coveredStorybookSections")) {
  missing.push("llms-required-readback-fields");
}
if (!llmsTxt.includes("Required Storybook sections:")) {
  missing.push("llms-required-storybook-sections");
}
if (!llmsTxt.includes("Covered Storybook section/category/story hierarchy:")) {
  missing.push("llms-covered-storybook-hierarchy");
}
if (!llmsTxt.includes("Changelog governance:")) {
  missing.push("llms-changelog-governance");
}
if (!llmsTxt.includes("Functional display authority: static_contract_authority_explicit_and_smoke_proven")) {
  missing.push("llms-functional-display-static-authority");
}
if (!llmsTxt.includes("Foundation visual standards: foundation-visual-standards-v1")) {
  missing.push("llms-foundation-visual-standards");
}
if (!llmsTxt.includes("Consumer visual style contract: consumer-visual-style-contract-v1")) {
  missing.push("llms-consumer-visual-style-contract");
}
if (!llmsTxt.includes("Setting control selection contract: setting-control-selection-contract-v1")) {
  missing.push("llms-setting-control-selection-contract");
}
if (!llmsTxt.includes("Field value selection contract: field-value-selection-contract-v1")) {
  missing.push("llms-field-value-selection-contract");
}
if (!llmsTxt.includes("Dictionary content contract: dictionary-content-contract-v1")) {
  missing.push("llms-dictionary-content-contract");
}
if (!llmsTxt.includes("Overlay boundary contract: overlay-boundary-contract-v1")) {
  missing.push("llms-overlay-boundary-contract");
}
if (!llmsTxt.includes("Settings layout contract: settings-layout-contract-v1")) {
  missing.push("llms-settings-layout-contract");
}
if (!llmsTxt.includes("Page hierarchy contract: page-hierarchy-contract-v1")) {
  missing.push("llms-page-hierarchy-contract");
}
if (!llmsTxt.includes("Verification cadence contract: ds-verification-cadence-contract-v1")) {
  missing.push("llms-verification-cadence-contract");
}
if (!llmsTxt.includes("Operation feedback contract: operation-feedback-contract-v1")) {
  missing.push("llms-operation-feedback-contract");
}
if (!llmsTxt.includes("Content scope contract: content-scope-contract-v1")) {
  missing.push("llms-content-scope-contract");
}
if (!llmsTxt.includes("Consumer evidence contract: consumer-evidence-verification-contract-v1")) {
  missing.push("llms-consumer-evidence-contract");
}
if (!llmsTxt.includes("Consumer verification contract: consumer-verification-contract-v1")) {
  missing.push("llms-consumer-verification-contract");
}
if (!llmsTxt.includes("Storybook doc shell visual oracle: original-storybook-doc-shell-v1")) {
  missing.push("llms-storybook-doc-shell-visual-oracle");
}
if (!llmsTxt.includes("oracle recovery: internal DS doc-shell restoration plan (owner-held governance record)")) {
  missing.push("llms-storybook-doc-shell-visual-oracle-recovery");
}
if (!llmsTxt.includes("baseline classification: owner_declared_original_storybook_doc_shell_standard")) {
  missing.push("llms-storybook-doc-shell-visual-oracle-classification");
}
if (!llmsTxt.includes("Shell control visual parity proof:")) {
  missing.push("llms-shell-control-visual-parity-proof");
}
for (const section of expectedContractStoryGroups) {
  if (!llmsTxt.includes(`- ${section} (${pagesByGroup[section]}):`)) {
    missing.push(`llms-covered-storybook-section:${section}`);
  }
}
if (!robotsTxt.includes("AI-Consumption-Contract: ai-consumption-contract.json")) {
  missing.push("robots-ai-contract-pointer");
}
const forbidden = [
  "data-contract-story-id=\"aos-operations-cockpit-standard\"",
  "data-contract-story-id=\"aos-docs-readiness-standard\"",
  "data-contract-story-id=\"aos-product-design-target-set-standard\"",
  "data-aos-served-surface-standard=",
  "data-aos-component-registration=\"registered\"",
  "data-aos-exception-record=\"brand-lockup-product-specific\""
].filter((text) => combinedHtml.includes(text));
if (forbidden.length > 0) {
  missing.push(...forbidden.map((text) => `forbidden:${text}`));
}
for (const [group, html] of Object.entries(pages)) {
  const defaultStory = requiredStories.find((story) => story.group === group);
  const navHtml = readDocShellNavHtml(html);
  if (!navHtml) {
    missing.push(`doc-shell-side-navigation:${group}`);
  }
  if (!html.includes(`data-active-story-section="${group}"`)) {
    missing.push(`data-active-story-section="${group}"`);
  }
  if (!html.includes(`data-story-section="${group}"`)) {
    missing.push(`data-story-section="${group}"`);
  }
  const tocRails = readDocShellTocRails(html);
  const defaultRail = defaultStory ? tocRails.find((rail) => rail.includes(`<a href="#${defaultStory.id}"`)) ?? "" : "";
  if (!defaultStory || !new RegExp(`<a href="#${defaultStory.id}" aria-current="location" data-selected="true"`).test(defaultRail)) {
    missing.push(`current-doc-nav-item:${group}:${defaultStory?.id ?? "missing"}`);
  }
  const sectionFiles = new Set(Object.values(pagesByGroup));
  const rowHrefs = docShellRowHrefs(navHtml);
  const groupNavCount = rowHrefs.filter((href) => sectionFiles.has(href)).length;
  if (groupNavCount !== expectedStorybookShellNavGroupCount) {
    missing.push(`doc-shell-nav-group-count:${group}:${groupNavCount}`);
  }
  const categoryNavCount = rowHrefs.filter((href) => href.endsWith(".html") && !sectionFiles.has(href)).length;
  if (categoryNavCount !== expectedStoryCategoryCount) {
    missing.push(`doc-shell-category-count:${group}:${categoryNavCount}`);
  }
  for (const marker of [
    "data-doc-toc=\"\"",
    "data-mandatory-boundary-block=\"visible\"",
    "data-no-overclaim-boundary=\"visible\"",
    "data-governance-boundary-strip=\"visible\""
  ]) {
    if (!html.includes(marker)) {
      missing.push(`${group}:${marker}`);
    }
  }
  // Each story is listed once across its group's contents rails; the rail with the group's first story marks one current link.
  const storyNavCount = new Set(tocRails.flatMap((rail) => Array.from(rail.matchAll(/<a href="#([^"]+)"/g), (match) => match[1]))).size;
  if (storyNavCount !== requiredStories.filter((story) => story.group === group).length) {
    missing.push(`doc-shell-story-count:${group}:${storyNavCount}`);
  }
  const currentStoryNavCount = defaultRail.match(/<a href="#[^"]+"[^>]*data-selected="true"/g)?.length ?? 0;
  if (currentStoryNavCount !== 1) {
    missing.push(`doc-shell-current-story-count:${group}:${currentStoryNavCount}`);
  }
  const ariaCurrentStoryCount = defaultRail.match(/<a href="#[^"]+" aria-current="location"/g)?.length ?? 0;
  if (ariaCurrentStoryCount !== 1) {
    missing.push(`doc-shell-current-story-aria-count:${group}:${ariaCurrentStoryCount}`);
  }
  // TCRN-DS-STORY-056: the group "page" is now the concatenation of its bounded index page plus
  // one category page per non-empty category. Each category page carries exactly one story
  // section, so the concatenation carries one per category page.
  const sectionCount = html.match(/data-story-section="/g)?.length ?? 0;
  const expectedSectionCount = contractPages.filter((page) => page.group === group && page.kind === "category").length;
  if (sectionCount !== expectedSectionCount) {
    missing.push(`section-page-count:${group}:${sectionCount}!=${expectedSectionCount}`);
  }
}
// TCRN-DS-STORY-056 bounded-page gate: exactly the derived file set is emitted; every section
// INDEX page carries ZERO story bodies; every category page carries EXACTLY its category's
// stories; and each index page's hashRouteScript maps every legacy deep link to its category page.
const emittedHtmlFiles = readdirSync("apps/storybook/storybook-static").filter((file) => file.endsWith(".html"));
const expectedHtmlFiles = contractPages.map((page) => page.file);
if ([...emittedHtmlFiles].sort().join(",") !== [...expectedHtmlFiles].sort().join(",")) {
  missing.push(`emitted-page-set:${[...emittedHtmlFiles].sort().join("|")}`);
}
for (const page of contractPages) {
  const html = pageHtmlByFile[page.file];
  const bodyIds = Array.from(html.matchAll(/data-contract-story-id="([^"]+)"/g), (match) => match[1]);
  if (page.kind === "index") {
    if (bodyIds.length !== 0) {
      missing.push(`index-page-has-bodies:${page.file}:${bodyIds.length}`);
    }
    for (const story of requiredStories.filter((entry) => entry.group === page.group)) {
      const mapEntry = `"${story.id}":"${categoryFileForStory(story)}#${story.id}"`;
      if (!html.includes(mapEntry)) {
        missing.push(`hashroute-map:${page.file}:${story.id}`);
      }
    }
  } else if (page.kind === "reference") {
    // TCRN-DS-STORY-058: a reference page carries NO story bodies (data-contract-story-id) — it
    // holds one machine-generated API region (data-component-reference-id) per component, in the
    // same order the shared helper paginated.
    if (bodyIds.length !== 0) {
      missing.push(`reference-page-has-story-bodies:${page.file}:${bodyIds.length}`);
    }
    const referenceIds = Array.from(html.matchAll(/data-component-reference-id="([^"]+)"/g), (match) => match[1]);
    if (referenceIds.join(",") !== page.componentNames.join(",")) {
      missing.push(`reference-page-components:${page.file}:${referenceIds.join("|")}`);
    }
  } else if (bodyIds.join(",") !== page.storyIds.join(",")) {
    missing.push(`category-page-bodies:${page.file}:${bodyIds.join("|")}`);
  }
}
for (const story of requiredStories) {
  if (!pages[story.group].includes(`data-story-id="${story.id}"`)) {
    missing.push(`owning-page-story:${story.group}:${story.id}`);
  }
  // The G+ matrix and sample stories are rendered from their own modules and declare that
  // module as their source path (TCRN-DS-SUB-030, TCRN-DS-SUB-031); the composition three sample
  // (TCRN-DS-SUB-092) is rendered from the sample module too, outside the five sample ids
  // (R3 integration item I-P2b-1); every other story is rendered from story-content.tsx.
  const owningSourcePath = Object.values(gplusMatrixStoryIds).includes(story.id)
    ? gplusMatrixSourcePath
    : Object.values(gplusSampleStoryIds).includes(story.id) || story.id === gplusCompositionThreeStoryId
      ? gplusSampleSourcePath
      : "apps/storybook/src/contract-stories/story-content.tsx";
  const owningPageStory = new RegExp(`data-story-id="${story.id}"[^>]*data-story-category="[^"]+"[^>]*data-story-source-path="${owningSourcePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`);
  if (!owningPageStory.test(pages[story.group])) {
    missing.push(`owning-page-story-governance-metadata:${story.group}:${story.id}`);
  }
  // Each story is a link of its own page's contents rail (TocRail in the paper), not of a global side rail.
  if (!new RegExp(`data-doc-toc=""[\\s\\S]*?<a href="#${story.id}"`).test(pages[story.group])) {
    missing.push(`missing-doc-toc-item:${story.group}:${story.id}`);
  }
  for (const [group, html] of Object.entries(pages)) {
    if (group !== story.group && html.includes(`data-story-id="${story.id}"`)) {
      missing.push(`cross-section-story:${group}:${story.id}`);
    }
  }
}
if (pages.Welcome.includes("data-story-id=\"component-family-index\"")) {
  missing.push("legacy-single-page-stack:index-includes-components");
}
if (pages.Welcome.includes("data-story-id=\"color-palette\"")) {
  missing.push("legacy-single-page-stack:index-includes-style-guide");
}
if (pages["Style Guide"].includes("data-story-id=\"tokens-copy-state\"")) {
  missing.push("style-guide-includes-foundations-story");
}
if (combinedHtml.includes("data-doc-global-nav=\"sections\"")) {
  missing.push("duplicate-topbar-global-nav-present");
}
if (combinedHtml.includes("data-doc-global-nav-item=\"")) {
  missing.push("duplicate-topbar-global-nav-item-present");
}
const forbiddenPositiveHits = [
  /\bproduct accepted\b/i,
  /\bfinal mvp accepted\b/i,
  /\brelease ready\b/i,
  /\bdeployment ready\b/i,
  /\bpublic ready\b/i
].filter((pattern) => pattern.test(combinedHtml)).map((pattern) => String(pattern));
const storybookPreviewExists = combinedHtml.includes("data-contract-surface=\"tcrn-design-system-storybook\"");
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8"
};

function startStaticServer(rootDirectory) {
  return new Promise((resolve, reject) => {
    const server = createServer((request, response) => {
      const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
      const pathname = decodeURIComponent(requestUrl.pathname);
      const fileName = pathname === "/" ? "index.html" : pathname.replace(/^\//, "");
      if (fileName.includes("..")) {
        response.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
        response.end("invalid path");
        return;
      }
      try {
        const filePath = join(rootDirectory, fileName);
        const body = readFileSync(filePath);
        response.writeHead(200, { "content-type": contentTypes[extname(filePath)] ?? "application/octet-stream" });
        response.end(body);
      } catch {
        response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
        response.end("not found");
      }
    });
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("storybook_smoke_server_address_unavailable"));
        return;
      }
      resolve({ server, origin: `http://127.0.0.1:${address.port}` });
    });
  });
}

function parsePixels(value) {
  const parsed = Number.parseFloat(String(value).replace("px", ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeTransitionProperty(value) {
  return String(value).split(",").map((part) => part.trim()).filter(Boolean);
}

// TCRN-DS-SUB-098 (R3-5): the focus comparator shared by productShellComparatorProof,
// designSystemVisualInstanceParityReadback and ownerQualityProductShellProof (all three reach it
// through validateMetric). An outline whose style is "none" draws nothing, so when the expectation
// and the reading both say "none", outline-width and outline-offset are not compared: Chromium 149
// reports the initial 3px width for an outline that was never set. The style itself is still
// compared, so a drawn outline against a "none" expectation stays a failure, and a drawn outline
// is compared on width and offset as before. Returns the mismatched property names.
export function focusStyleMismatches(expectedFocus, actualFocus) {
  const mismatches = [];
  const outlineNotDrawn = expectedFocus?.outlineStyle === "none" && actualFocus?.outlineStyle === "none";
  for (const [property, expectedValue] of Object.entries(expectedFocus ?? {})) {
    if (outlineNotDrawn && (property === "outlineWidth" || property === "outlineOffset")) continue;
    if (expectedValue && typeof expectedValue === "object" && Array.isArray(expectedValue.layers)) {
      if (!boxShadowHasLayers(actualFocus?.[property], expectedValue.layers)) mismatches.push(property);
      continue;
    }
    if (actualFocus?.[property] !== expectedValue) mismatches.push(property);
  }
  return mismatches;
}

// Self-check of the comparator, run first in main() before any browser work (TCRN-DS-SUB-098):
// "none" with Chromium's 3px initial width is judged the same; a solid outline with another width,
// and a drawn outline against a "none" expectation, are judged different.
export function runFocusComparatorSelfCheck() {
  const noneExpected = { outlineWidth: "0px", outlineStyle: "none", outlineOffset: "0px", boxShadow: "none" };
  const solidExpected = { outlineWidth: "2px", outlineStyle: "solid", outlineOffset: "2px" };
  const cases = [
    {
      name: "none-with-initial-3px-is-same",
      mismatches: focusStyleMismatches(noneExpected, { outlineWidth: "3px", outlineStyle: "none", outlineOffset: "0px", boxShadow: "none" }),
      expected: []
    },
    {
      name: "solid-with-other-width-is-different",
      mismatches: focusStyleMismatches(solidExpected, { outlineWidth: "3px", outlineStyle: "solid", outlineOffset: "2px" }),
      expected: ["outlineWidth"]
    },
    {
      name: "drawn-outline-against-none-is-different",
      mismatches: focusStyleMismatches(noneExpected, { outlineWidth: "3px", outlineStyle: "solid", outlineOffset: "0px", boxShadow: "none" }),
      expected: ["outlineWidth", "outlineStyle"]
    }
  ].map((entry) => ({ ...entry, ok: JSON.stringify(entry.mismatches) === JSON.stringify(entry.expected) }));
  return { ok: cases.every((entry) => entry.ok), cases };
}

function validateMetric({ failures, name, metric, expected }) {
  const width = Number(metric.width.toFixed(2));
  const height = Number(metric.height.toFixed(2));
  const radius = parsePixels(metric.borderRadius);
  const minWidth = expected.minWidth ?? expected.width;
  const minHeight = expected.minHeight ?? expected.height;
  const gridColumnCount = String(metric.gridTemplateColumns).split(/\s+/).filter(Boolean).length;
  if (expected.width !== undefined && Math.abs(width - expected.width) > 1) {
    failures.push(`${name}:width:${width}`);
  }
  if (expected.height !== undefined && Math.abs(height - expected.height) > 1) {
    failures.push(`${name}:height:${height}`);
  }
  if (minWidth !== undefined && width + 1 < minWidth) {
    failures.push(`${name}:min-width:${width}`);
  }
  if (minHeight !== undefined && height + 1 < minHeight) {
    failures.push(`${name}:min-height:${height}`);
  }
  if (expected.radius !== undefined && Math.abs(radius - expected.radius) > 1) {
    failures.push(`${name}:radius:${metric.borderRadius}`);
  }
  if (expected.borderRadius !== undefined && metric.borderRadius !== expected.borderRadius) {
    failures.push(`${name}:border-radius:${metric.borderRadius}`);
  }
  if (expected.borderStyle !== undefined && metric.borderStyle !== expected.borderStyle) {
    failures.push(`${name}:border-style:${metric.borderStyle}`);
  }
  if (expected.borderWidth !== undefined && metric.borderWidth !== expected.borderWidth) {
    failures.push(`${name}:border-width:${metric.borderWidth}`);
  }
  if (expected.display !== undefined && metric.display !== expected.display) {
    failures.push(`${name}:display:${metric.display}`);
  }
  if (expected.position !== undefined && metric.position !== expected.position) {
    failures.push(`${name}:position:${metric.position}`);
  }
  if (expected.gap !== undefined && metric.gap !== expected.gap) {
    failures.push(`${name}:gap:${metric.gap}`);
  }
  if (expected.justifyContent !== undefined && metric.justifyContent !== expected.justifyContent) {
    failures.push(`${name}:justify-content:${metric.justifyContent}`);
  }
  if (expected.paddingLeft !== undefined && metric.paddingLeft !== expected.paddingLeft) {
    failures.push(`${name}:padding-left:${metric.paddingLeft}`);
  }
  if (expected.paddingRight !== undefined && metric.paddingRight !== expected.paddingRight) {
    failures.push(`${name}:padding-right:${metric.paddingRight}`);
  }
  if (expected.gridColumnCount !== undefined && gridColumnCount !== expected.gridColumnCount) {
    failures.push(`${name}:grid-column-count:${metric.gridTemplateColumns}`);
  }
  if (expected.iconCenterDeltaMax !== undefined && typeof metric.iconCenterDelta === "number" && metric.iconCenterDelta > expected.iconCenterDeltaMax) {
    failures.push(`${name}:icon-center-delta:${metric.iconCenterDelta}`);
  }
  if (expected.fontFamilyIncludes !== undefined && !String(metric.fontFamily).includes(expected.fontFamilyIncludes)) {
    failures.push(`${name}:font-family:${metric.fontFamily}`);
  }
  // backgroundColor joined this list in TCRN-DS-STORY-087: the selection ink is
  // the text colour at low alpha, so it serializes differently per theme exactly
  // like the rail it replaced, and the strict single-value check it used to have
  // could only ever pin one of the two themes.
  for (const property of ["fontSize", "fontWeight", "lineHeight", "letterSpacing", "boxShadow", "backgroundColor"]) {
    if (expected[property] === undefined) {
      continue;
    }
    // TCRN-DS-STORY-062: an expected value may be an ARRAY of acceptable serializations for
    // checks that run under both themes (e.g. the selection rail resolves brand-primary to a
    // different computed color per theme; both are the same ruled single-axis language).
    const allowedValues = Array.isArray(expected[property]) ? expected[property] : [expected[property]];
    if (!allowedValues.includes(metric[property])) {
      failures.push(`${name}:${property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}:${metric[property]}`);
    }
  }
  for (const property of expected.transitionPropertyIncludes ?? []) {
    if (!transitionIncludes(metric, property)) {
      failures.push(`${name}:transition-missing:${property}:${metric.transitionProperty}`);
    }
  }
  if (expected.transitionDurationIncludes !== undefined && !String(metric.transitionDuration).includes(expected.transitionDurationIncludes)) {
    failures.push(`${name}:transition-duration:${metric.transitionDuration}`);
  }
  if (expected.transitionTimingFunctionIncludes !== undefined && !String(metric.transitionTimingFunction).includes(expected.transitionTimingFunctionIncludes)) {
    failures.push(`${name}:transition-timing-function:${metric.transitionTimingFunction}`);
  }
  if (expected.focus !== undefined && metric.disabled !== true) {
    for (const property of focusStyleMismatches(expected.focus, metric.focus)) {
      failures.push(`${name}:focus-${property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}:${metric.focus?.[property] ?? "missing"}`);
    }
  }
  if (metric.borderStyle === "outset") {
    failures.push(`${name}:default-browser-border-style`);
  }
  if (expected.backgroundRequired === true && (metric.backgroundColor === "rgba(0, 0, 0, 0)" || metric.backgroundColor === "transparent")) {
    failures.push(`${name}:transparent-background`);
  }
}

// A computed box-shadow is a comma list of layers such as "rgb(11, 107, 101) 0px 0px 0px 4px"
// (Chromium puts the colour first and "inset" last). Each expected layer must appear with its
// spread (within 0.1px) and, when colours are given, one of them (channels within 1, alpha at
// least 0.95: a focus transition still settling reports 0.996 and 3.99px, the same ring).
function parseBoxShadowLayers(value) {
  const text = String(value ?? "").trim();
  if (!text || text === "none") return [];
  const layers = [];
  let depth = 0;
  let current = "";
  for (const character of text) {
    if (character === "(") depth += 1;
    if (character === ")") depth -= 1;
    if (character === "," && depth === 0) {
      layers.push(current.trim());
      current = "";
      continue;
    }
    current += character;
  }
  if (current.trim()) layers.push(current.trim());
  return layers.map((layer) => {
    const color = /rgba?\([^)]*\)/.exec(layer)?.[0] ?? null;
    const lengths = layer.replace(/rgba?\([^)]*\)/, "").replace(/inset/, "").trim().split(/\s+/).filter(Boolean).map((part) => Number.parseFloat(part));
    return { color, inset: /\binset\b/.test(layer), spread: lengths[3] ?? 0, offsetX: lengths[0] ?? 0, offsetY: lengths[1] ?? 0, blur: lengths[2] ?? 0 };
  });
}

function colorChannels(value) {
  const match = /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/.exec(String(value ?? ""));
  return match ? [Number(match[1]), Number(match[2]), Number(match[3]), match[4] === undefined ? 1 : Number(match[4])] : null;
}

function colorsMatch(actual, expected) {
  const a = colorChannels(actual);
  const e = colorChannels(expected);
  if (!a || !e) return false;
  return Math.abs(a[0] - e[0]) <= 1 && Math.abs(a[1] - e[1]) <= 1 && Math.abs(a[2] - e[2]) <= 1 && a[3] >= Math.min(e[3], 0.95) && a[3] <= e[3] + 0.01;
}

function boxShadowHasLayers(value, expectedLayers) {
  const layers = parseBoxShadowLayers(value);
  return expectedLayers.every((expectedLayer) => layers.some((layer) =>
    layer.inset === Boolean(expectedLayer.inset)
    && layer.offsetX === 0
    && layer.offsetY === 0
    && Math.abs(layer.spread - expectedLayer.spread) <= 0.1
    && (!expectedLayer.colors || expectedLayer.colors.some((color) => colorsMatch(layer.color, color)))));
}

function transitionIncludes(metric, property) {
  const properties = normalizeTransitionProperty(metric.transitionProperty);
  return properties.includes(property) || properties.includes("all");
}

function maxCssDurationMs(value) {
  return Math.max(0, ...String(value).split(",").map((part) => {
    const trimmed = part.trim();
    if (trimmed.endsWith("ms")) return Number(trimmed.slice(0, -2));
    if (trimmed.endsWith("s")) return Number(trimmed.slice(0, -1)) * 1000;
    return Number(trimmed) || 0;
  }));
}

function validateNoHorizontalOverflow({ failures, label, name, metric }) {
  if (!metric || metric.missing || metric.scrollWidth === undefined || metric.clientWidth === undefined) return;
  if (metric.scrollWidth > metric.clientWidth + 1) {
    failures.push(`${label}:${name}-overflow:${metric.scrollWidth}>${metric.clientWidth}`);
  }
}

function validateControlBounds({ failures, label, proof, contract }) {
  const controls = contract.controlBoundsProof?.controls ?? [];
  const containers = contract.controlBoundsProof?.containers ?? [];
  const containerMetrics = {
    shell: proof.shell,
    strip: proof.measured?.strip,
    viewport: {
      left: 0,
      right: proof.viewport?.width,
      top: 0,
      bottom: proof.viewport?.height,
      width: proof.viewport?.width,
      height: proof.viewport?.height
    }
  };

  for (const controlName of controls) {
    const control = proof.measured?.[controlName];
    if (!control || control.missing) {
      failures.push(`${label}:${controlName}:missing-for-bounds-proof`);
      continue;
    }
    for (const containerName of containers) {
      const container = containerMetrics[containerName];
      if (!container || container.missing) {
        failures.push(`${label}:${controlName}:missing-${containerName}-bounds-container`);
        continue;
      }
      if (control.left < container.left - 1 || control.right > container.right + 1) {
        failures.push(
          `${label}:${controlName}-outside-${containerName}:${control.left.toFixed(2)}-${control.right.toFixed(2)}:${container.left.toFixed(2)}-${container.right.toFixed(2)}`
        );
      }
    }
  }
}

// The band's relations (MIN-20261013-SHELL D2, STORY-140): every part sits on the band's midline
// (26 in the 52 band), the brand button starts at the band's inset and the cluster ends at it, and
// the paper starts at the band's bottom, inset by the band's own 12 on both sides. These replace the
// top bar's utility alignment, which had a current location, a search and two toggles to line up.
function validateBandAlignment({ failures, label, proof, contract }) {
  const band = proof.bandAlignmentReadback;
  const midlineTolerance = contract.bandGeometry?.midlineTolerancePx ?? 1;
  const edgeTolerance = contract.bandGeometry?.edgeTolerancePx ?? 1;
  for (const name of ["strip", "brand", "cluster", "avatar", "paper"]) {
    if (!band?.[name]) {
      failures.push(`${label}:band-alignment-missing-${name}`);
      return;
    }
  }
  const midline = band.strip.top + band.strip.height / 2;
  for (const name of ["brand", "mark", "pins", "cluster", "avatar"]) {
    const rect = band[name];
    if (!rect) continue;
    const centre = rect.top + rect.height / 2;
    if (Math.abs(centre - midline) > midlineTolerance) {
      failures.push(`${label}:band-midline-${name}:${(centre - band.strip.top).toFixed(2)}:expected:${(midline - band.strip.top).toFixed(2)}`);
    }
  }
  const insetLeft = parsePixels(band.paddingLeft);
  const insetRight = parsePixels(band.paddingRight);
  const brandStart = band.brand.left - band.strip.left;
  if (Math.abs(brandStart - insetLeft) > edgeTolerance) {
    failures.push(`${label}:band-brand-start:${brandStart.toFixed(2)}:expected:${insetLeft}`);
  }
  const clusterEnd = band.strip.right - band.cluster.right;
  if (Math.abs(clusterEnd - insetRight) > edgeTolerance) {
    failures.push(`${label}:band-cluster-end:${clusterEnd.toFixed(2)}:expected:${insetRight}`);
  }
  const paperTop = band.paper.top - band.strip.top;
  if (Math.abs(paperTop - band.strip.height) > edgeTolerance) {
    failures.push(`${label}:paper-top:${paperTop.toFixed(2)}:expected:${band.strip.height}`);
  }
  const paperStart = band.paper.left - band.strip.left;
  const paperEnd = band.strip.right - band.paper.right;
  if (Math.abs(paperStart - insetLeft) > edgeTolerance || Math.abs(paperEnd - insetRight) > edgeTolerance) {
    failures.push(`${label}:paper-inset:${paperStart.toFixed(2)}/${paperEnd.toFixed(2)}:expected:${insetLeft}/${insetRight}`);
  }
}

async function collectProductShellMetrics(origin, viewport, reducedMotion, contract = productShellComparatorContract, fixture = undefined) {
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--disable-gpu",
      "--font-render-hinting=none",
      "--force-color-profile=srgb"
    ]
  });
  const page = await browser.newPage({
    viewport,
    deviceScaleFactor: 1,
    colorScheme: "light",
    reducedMotion,
    locale: "en-US",
    timezoneId: "UTC"
  });
  const pageErrors = [];
  const consoleMessages = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      consoleMessages.push(`${message.type()}:${message.text()}`);
    }
  });
  await page.goto(`${origin}/${contract.page}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts?.ready);
  const metrics = await page.evaluate(async ({ contract, fixture }) => {
    const selector = fixture?.selector ?? contract.scopedSelector;
    const shell = document.querySelector(selector);
    if (!shell) {
      return { missingShell: true };
    }
    const measured = {};
    const readRect = (element) => {
      const rect = element?.getBoundingClientRect();
      if (!rect) return null;
      return {
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height
      };
    };
    // The band's parts and the paper, read once before any focus moves (the relations are checked
    // by validateBandAlignment).
    const readBandAlignment = () => {
      const strip = shell.querySelector("[data-shell-strip]");
      const stripStyle = strip ? getComputedStyle(strip) : null;
      return {
        strip: readRect(strip),
        brand: readRect(strip?.querySelector("[data-shell-brand]")),
        mark: readRect(strip?.querySelector("[data-shell-brand] .tcrn-shell-brand__mark")),
        pins: readRect(strip?.querySelector(".tcrn-shell-pins")),
        cluster: readRect(strip?.querySelector("[data-cluster]")),
        avatar: readRect(strip?.querySelector("[data-shell-avatar]")),
        paper: readRect(shell.querySelector("[data-paper]")),
        paddingLeft: stripStyle?.paddingLeft ?? "0px",
        paddingRight: stripStyle?.paddingRight ?? "0px"
      };
    };
    const bandAlignmentReadback = readBandAlignment();
    // TCRN-DS-SUB-081 (R2-21a): the rest values used to come from a live getComputedStyle object
    // taken before focus and read after focus, a fixed 190ms wait and blur, so a fill transition
    // still on its way back from the focus fill (white) to the rest wash was read as the rest fill.
    // Reads now wait until every finite animation in the document has finished (no duration is
    // named, so the reduced-motion timing and every expected value stay as they were; infinite
    // loops never finish and are left alone), and the rest values are copied as plain values
    // before focus moves.
    const settleAnimations = async () => {
      if (typeof document.getAnimations !== "function") return;
      for (let round = 0; round < 20; round += 1) {
        const running = document.getAnimations().filter((animation) => animation.playState === "running"
          && animation.effect?.getComputedTiming?.().iterations !== Infinity);
        if (running.length === 0) return;
        await Promise.all(running.map((animation) => animation.finished.catch(() => undefined)));
      }
    };
    const restStyleProperties = [
      "display", "position", "gridTemplateColumns", "gap", "columnGap", "rowGap", "justifyContent",
      "paddingLeft", "paddingRight", "borderRadius", "borderStyle", "borderWidth", "backgroundColor",
      "color", "fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "boxShadow",
      "outlineWidth", "outlineStyle", "outlineColor", "outlineOffset", "transitionProperty",
      "transitionDuration", "transitionTimingFunction", "animationName", "animationDuration",
      "animationTimingFunction"
    ];
    const measure = async (name, selector) => {
      const element = shell.querySelector(selector);
      if (!element) {
        measured[name] = { missing: true };
        return;
      }
      await settleAnimations();
      const rect = element.getBoundingClientRect();
      const restComputed = getComputedStyle(element);
      const style = Object.fromEntries(restStyleProperties.map((property) => [property, restComputed[property]]));
      const focusTarget = element.matches("button, input, a, select, textarea, [tabindex]")
        ? element
        : element.querySelector("button, input, a, select, textarea, [tabindex]");
      const previousActive = document.activeElement;
      let focus = null;
      if (focusTarget instanceof HTMLElement) {
        focusTarget.focus({ preventScroll: true });
        await settleAnimations();
        const focusStyle = getComputedStyle(name === "searchInput" ? element : focusTarget);
        focus = {
          outlineWidth: focusStyle.outlineWidth,
          outlineStyle: focusStyle.outlineStyle,
          outlineColor: focusStyle.outlineColor,
          outlineOffset: focusStyle.outlineOffset,
          boxShadow: focusStyle.boxShadow
        };
        focusTarget.blur();
        if (previousActive instanceof HTMLElement && previousActive !== focusTarget) {
          previousActive.focus({ preventScroll: true });
        }
      }
      const visibleIcon = Array.from(element.querySelectorAll(".tcrn-shell-side-nav-toggle__icon, [data-side-nav-icon]"))
        .find((icon) => {
          const iconStyle = getComputedStyle(icon);
          const iconRect = icon.getBoundingClientRect();
          return iconStyle.display !== "none" && iconRect.width > 0 && iconRect.height > 0;
        });
      const iconRect = visibleIcon?.getBoundingClientRect();
      const iconCenterDelta = iconRect
        ? Math.max(
            Math.abs((iconRect.left + iconRect.width / 2) - (rect.left + rect.width / 2)),
            Math.abs((iconRect.top + iconRect.height / 2) - (rect.top + rect.height / 2))
          )
        : null;
      measured[name] = {
        width: rect.width,
        height: rect.height,
        disabled: element instanceof HTMLButtonElement ? element.disabled : element.getAttribute("disabled") !== null,
        title: element.getAttribute("title"),
        ariaDisabled: element.getAttribute("aria-disabled"),
        ariaExpanded: element.getAttribute("aria-expanded"),
        sideNavAction: element.getAttribute("data-side-nav-action"),
        sideNavKeyboardActivation: element.getAttribute("data-side-nav-keyboard-activation"),
        sideNavDisabledReason: element.getAttribute("data-side-nav-disabled-reason"),
        iconCenterDelta,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
        display: style.display,
        position: style.position,
        gridTemplateColumns: style.gridTemplateColumns,
        gap: style.gap,
        columnGap: style.columnGap,
        rowGap: style.rowGap,
        justifyContent: style.justifyContent,
        paddingLeft: style.paddingLeft,
        paddingRight: style.paddingRight,
        borderRadius: style.borderRadius,
        borderStyle: style.borderStyle,
        borderWidth: style.borderWidth,
        backgroundColor: style.backgroundColor,
        color: style.color,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
        boxShadow: style.boxShadow,
        outlineWidth: style.outlineWidth,
        outlineStyle: style.outlineStyle,
        outlineColor: style.outlineColor,
        outlineOffset: style.outlineOffset,
        transitionProperty: style.transitionProperty,
        transitionDuration: style.transitionDuration,
        transitionTimingFunction: style.transitionTimingFunction,
        animationName: style.animationName,
        animationDuration: style.animationDuration,
        animationTimingFunction: style.animationTimingFunction,
        focus
      };
    };
    for (const [name, selector] of Object.entries(contract.componentSelectors)) {
      await measure(name, selector);
    }
    const contentMode = shell.getAttribute("data-visual-instance-content");
    const declaredContentSelectors = contract.requiredContentSelectors ?? {};
    const requiredContentSelectors = declaredContentSelectors.common || declaredContentSelectors[contentMode]
      ? {
          ...(declaredContentSelectors.common ?? {}),
          ...(declaredContentSelectors[contentMode] ?? {})
        }
      : declaredContentSelectors;
    const requiredContent = {};
    for (const [name, selector] of Object.entries(requiredContentSelectors)) {
      requiredContent[name] = shell.matches(selector) || Boolean(shell.querySelector(selector));
    }
    const strip = shell.querySelector("[data-shell-strip]");
    const controlOrder = strip
      ? Array.from(strip.children).map((child) => {
          if (child.matches("[data-shell-brand]")) return "brandButton";
          if (child.matches(".tcrn-shell-pins")) return "pins";
          if (child.matches("[data-cluster]")) return "cluster";
          return child.className || child.tagName.toLowerCase();
        })
      : [];
    const primaryHeadings = Array.from(shell.querySelectorAll("h1"));
    const state = {
      variant: shell.getAttribute("data-visual-instance-variant"),
      theme: shell.getAttribute("data-visual-instance-theme"),
      productShellTheme: shell.getAttribute("data-product-shell-theme"),
      tcrnTheme: shell.getAttribute("data-tcrn-theme"),
      locale: shell.getAttribute("data-visual-instance-locale"),
      collapsed: shell.getAttribute("data-visual-instance-collapsed"),
      route: shell.getAttribute("data-visual-instance-route"),
      search: shell.getAttribute("data-visual-instance-search"),
      menuState: shell.getAttribute("data-state"),
      viewport: shell.getAttribute("data-visual-instance-viewport"),
      reducedMotion: shell.getAttribute("data-visual-instance-reduced-motion"),
      content: shell.getAttribute("data-visual-instance-content"),
      ownerVisualAdmissionBoundary: shell.getAttribute("data-visual-instance-disposition")
    };
    const bandReadback = {
      text: strip?.textContent?.replace(/\s+/g, " ").trim() ?? "",
      staleWorkspaceTitlePresent: Boolean(strip?.textContent?.includes("AOS Rebuild Workspace"))
    };
	    const shellText = shell.textContent ?? "";
	    const forbiddenTextHits = (contract.forbiddenText ?? []).filter((text) => shellText.includes(text));
	    const fixtureForbiddenTextHits = (fixture?.forbiddenText ?? []).filter((text) => shellText.includes(text));
	    const missingRequiredText = (fixture?.requiredText ?? []).filter((text) => !shellText.includes(text));
	    const firstPrimaryHeading = primaryHeadings[0]?.textContent?.trim() ?? null;
	    const shellRect = shell.getBoundingClientRect();
	    const shellStyle = getComputedStyle(shell);
	    shell.setAttribute("data-theme-switching", "true");
	    const themeWashStyle = getComputedStyle(shell, "::after");
	    const documentElement = document.documentElement;
	    return {
	      missingShell: false,
	      shell: {
	        width: shellRect.width,
	        height: shellRect.height,
	        left: shellRect.left,
	        right: shellRect.right,
	        top: shellRect.top,
	        bottom: shellRect.bottom,
	        scrollWidth: shell.scrollWidth,
	        clientWidth: shell.clientWidth,
	        gridTemplateColumns: shellStyle.gridTemplateColumns,
	        transitionProperty: shellStyle.transitionProperty,
	        transitionDuration: shellStyle.transitionDuration,
	        transitionTimingFunction: shellStyle.transitionTimingFunction,
	        backgroundColor: shellStyle.backgroundColor,
	        color: shellStyle.color,
	        themeWashAnimationName: themeWashStyle.animationName,
	        themeWashAnimationDuration: themeWashStyle.animationDuration,
	        themeWashAnimationTimingFunction: themeWashStyle.animationTimingFunction,
	        sourceMarker: document.querySelector("style[data-tcrn-product-shell-comparator-style=\"package-backed\"]")?.getAttribute("data-tcrn-product-shell-comparator-style") ?? null
	      },
	      measured,
	      requiredContent,
      controlOrder,
      bandReadback,
      bandAlignmentReadback,
      state,
	      forbiddenTextHits,
	      fixtureForbiddenTextHits,
	      missingRequiredText,
	      primaryHeadingCount: primaryHeadings.length,
	      firstPrimaryHeading,
	      viewport: { width: window.innerWidth, height: window.innerHeight, scrollWidth: documentElement.scrollWidth }
	    };
	  }, { contract, fixture });
  await browser.close();
  return { ...metrics, pageErrors, consoleMessages, reducedMotion, viewport };
}

function validateProductShellReadback({
  failures,
  proof,
  contract,
  label,
  expectSearchResults = true,
  expectedState = undefined,
  validateMetrics = true
}) {
  if (proof.missingShell) {
    failures.push(`${label}:missing-product-shell-comparator`);
    return;
  }
  for (const error of proof.pageErrors ?? []) failures.push(`${label}:pageerror:${error}`);
  for (const message of proof.consoleMessages ?? []) failures.push(`${label}:console:${message}`);
  if (proof.shell.sourceMarker !== "package-backed") {
    failures.push(`${label}:missing-package-backed-style-marker`);
  }
  const reduced = proof.reducedMotion === "reduce";
  if (validateMetrics) {
    for (const [name, expected] of Object.entries(contract.expectedControlMetrics)) {
      const metric = proof.measured[name];
      if (!metric || metric.missing) {
        failures.push(`${label}:${name}:missing`);
      } else {
        const expectedForMotion = reduced
          ? Object.fromEntries(Object.entries(expected).filter(([key]) => !key.startsWith("transition")))
          : expected;
        validateMetric({ failures, name: `${label}:${name}`, metric, expected: expectedForMotion });
      }
    }
  }
  if (contract.noOverflowProof) {
    validateNoHorizontalOverflow({ failures, label, name: "root", metric: proof.shell });
    validateNoHorizontalOverflow({ failures, label, name: "strip", metric: proof.measured.strip });
    if (proof.viewport.scrollWidth > proof.viewport.width + 1) {
      failures.push(`${label}:viewport-horizontal-overflow:${proof.viewport.scrollWidth}>${proof.viewport.width}`);
    }
  }
  if (contract.controlBoundsProof) {
    validateControlBounds({ failures, label, proof, contract });
  }
  if (contract.expectedControlOrder) {
    // An optional part (the pins) is expected only when the shell shows it.
    const absentOptional = (contract.optionalControls ?? []).filter((name) => !(proof.controlOrder ?? []).includes(name));
    const expectedOrder = contract.expectedControlOrder.filter((name) => !absentOptional.includes(name)).join(">");
    const actualOrder = (proof.controlOrder ?? []).join(">");
    if (actualOrder !== expectedOrder) {
      failures.push(`${label}:control-order:${actualOrder || "missing"}:expected:${expectedOrder}`);
    }
  }
  if (proof.bandReadback?.staleWorkspaceTitlePresent) {
    failures.push(`${label}:band-stale-aos-rebuild-workspace-title`);
  }
  validateBandAlignment({ failures, label, proof, contract });
  if (expectedState) {
    for (const [name, expected] of Object.entries(expectedState)) {
      if (["searchExpanded", "searchResultsVisible"].includes(name)) continue;
      if (proof.state?.[name] !== expected) {
        failures.push(`${label}:state:${name}:${proof.state?.[name] ?? "missing"}`);
      }
    }
    if (proof.state?.productShellTheme !== expectedState.theme) {
      failures.push(`${label}:product-shell-theme:${proof.state?.productShellTheme ?? "missing"}`);
    }
    if (proof.state?.tcrnTheme !== expectedState.theme) {
      failures.push(`${label}:tcrn-theme:${proof.state?.tcrnTheme ?? "missing"}`);
    }
    // The rail's collapsed state, the selected rail row and the band search's expanded and
    // results states are retired with those parts; the variant's own route, search and collapsed
    // attributes are still read through the loop above.
    if (proof.state?.ownerVisualAdmissionBoundary !== "ds_oracle_review_required_before_owner_admission") {
      failures.push(`${label}:owner-admission-boundary:${proof.state?.ownerVisualAdmissionBoundary ?? "missing"}`);
    }
  }
  if (reduced) {
    // Motion v2 (TCRN-DS-INIT-001, WS3): reduced motion removes travel, not the cue
    // that something changed. The v1 oracle demanded `transition: none`, which threw
    // away comprehension along with the movement. The check below is stricter, not
    // looser: it proves positional properties are absent AND that at least one
    // comprehension cue survives, so neither failure mode can pass silently.
    const POSITIONAL = ["transform", "translate", "scale", "rotate", "top", "left", "right", "bottom", "margin", "inset", "width", "height"];
    const COMPREHENSION = ["opacity", "background-color", "color", "border-color"];
    const auditReducedMotion = (name, measured) => {
      const declared = normalizeTransitionProperty(measured?.transitionProperty ?? "none");
      if (declared.includes("all")) {
        failures.push(`${label}:reduced-motion-${name}-transition-all:${measured?.transitionProperty}`);
        return;
      }
      const travelling = declared.filter((property) => POSITIONAL.includes(property));
      if (travelling.length > 0) {
        failures.push(`${label}:reduced-motion-${name}-positional:${travelling.join("+")}`);
      }
      const cues = declared.filter((property) => COMPREHENSION.includes(property));
      if (declared.length > 0 && cues.length === 0) {
        failures.push(`${label}:reduced-motion-${name}-no-comprehension-cue:${measured?.transitionProperty}`);
      }
    };
    auditReducedMotion("product-shell", proof.shell);
    // Only the parts the shell shows are audited: the avatar menu's controls are absent while it is closed.
    for (const controlName of ["brandButton", "themeToggle", "localeTrigger", "localeChevron"]) {
      const measured = proof.measured[controlName];
      if (measured && !measured.missing) auditReducedMotion(controlName, measured);
    }
    if (proof.shell.themeWashAnimationName !== "none") {
      failures.push(`${label}:reduced-motion-theme-wash:${proof.shell.themeWashAnimationName}`);
    }
  } else {
    // The locale chevron is read where the avatar menu is open; the theme wash is the shell's own.
    if (proof.measured.localeChevron && !proof.measured.localeChevron.missing) {
      if (!transitionIncludes(proof.measured.localeChevron, contract.motionProof.localeChevronTransition)) {
        failures.push(`${label}:locale-chevron-transition:${proof.measured.localeChevron?.transitionProperty}`);
      }
      if (proof.measured.localeChevron?.transitionDuration !== contract.motionProof.localeChevronTransitionDuration) {
        failures.push(`${label}:locale-chevron-transition-duration:${proof.measured.localeChevron?.transitionDuration}`);
      }
    }
    if (proof.shell.themeWashAnimationName !== contract.motionProof.themeWashPseudo) {
      failures.push(`${label}:theme-wash-animation:${proof.shell.themeWashAnimationName}`);
    }
    if (proof.shell.themeWashAnimationDuration !== contract.motionProof.themeWashAnimationDuration) {
      failures.push(`${label}:theme-wash-animation-duration:${proof.shell.themeWashAnimationDuration}`);
    }
    if (!String(proof.shell.themeWashAnimationTimingFunction).includes(contract.motionProof.themeWashAnimationTimingFunctionIncludes)) {
      failures.push(`${label}:theme-wash-animation-timing:${proof.shell.themeWashAnimationTimingFunction}`);
    }
  }
  // The search results are the full menu's: shown only while the menu is open with a query, so a
  // results state reads them there and a rest state shows none.
  const searchResults = proof.measured.searchResults;
  const searchResultsShown = Boolean(searchResults && !searchResults.missing && searchResults.display !== "none" && searchResults.height > 0);
  if (expectSearchResults && !searchResultsShown) {
    failures.push(`${label}:search-results-not-visible-for-expanded-proof`);
  }
  if (!expectSearchResults && searchResultsShown) {
    failures.push(`${label}:search-results-visible-for-rest-proof`);
  }
  for (const [name, present] of Object.entries(proof.requiredContent ?? {})) {
    if (!present) failures.push(`${label}:visual-instance-content:${name}`);
  }
  if (contract.expectedPrimaryHeadingCount !== undefined && proof.primaryHeadingCount !== contract.expectedPrimaryHeadingCount) {
    failures.push(`${label}:primary-heading-count:${proof.primaryHeadingCount}`);
  }
  if (contract.productFirstRequired && !proof.requiredContent?.primaryHeading) {
    failures.push(`${label}:missing-product-first-primary-heading`);
  }
  if (contract.productFirstRequired && /AOS frontend shell|Frontend shell slice|Local structural slice only|Dummy Cockpit/i.test(proof.firstPrimaryHeading ?? "")) {
    failures.push(`${label}:proof-scaffold-primary-heading:${proof.firstPrimaryHeading}`);
  }
  for (const hit of proof.forbiddenTextHits ?? []) {
    failures.push(`${label}:visual-instance-forbidden-text:${hit}`);
  }
  for (const hit of proof.fixtureForbiddenTextHits ?? []) {
    failures.push(`${label}:visual-instance-fixture-forbidden-text:${hit}`);
  }
  for (const missing of proof.missingRequiredText ?? []) {
    failures.push(`${label}:visual-instance-fixture-missing-required-text:${missing}`);
  }
  if (proof.viewport.width <= 390) {
    if (proof.viewport.scrollWidth > proof.viewport.width + 1) {
      failures.push(`${label}:horizontal-overflow:${proof.viewport.scrollWidth}>${proof.viewport.width}`);
    }
    const bandControlSizes = [proof.measured.brandButton?.height, proof.measured.avatar?.width, proof.measured.avatar?.height];
    if (bandControlSizes.some((size) => typeof size === "number" && size > 44)) {
      failures.push(`${label}:mobile-control-size-exceeds-package-shell-boundary`);
    }
    if (proof.measured.contentRegion?.width > proof.viewport.width + 1) {
      failures.push(`${label}:mobile-content-width:${proof.measured.contentRegion.width}`);
    }
    for (const [containerName, metric] of Object.entries({
      contentStack: proof.measured.contentStack,
      sectionGrid: proof.measured.sectionGrid
    })) {
      if (metric && !metric.missing && metric.scrollWidth > metric.clientWidth + 1) {
        failures.push(`${label}:mobile-${containerName}-overflow:${metric.scrollWidth}>${metric.clientWidth}`);
      }
      if (metric && !metric.missing && metric.right > proof.viewport.width + 1) {
        failures.push(`${label}:mobile-${containerName}-right:${metric.right}>${proof.viewport.width}`);
      }
    }
  }
}

async function runProductShellComparatorProof(contract = productShellComparatorContract) {
  const failures = [];
  const { server, origin } = await startStaticServer(staticRoot);
  try {
    if (contract.variantFixtures) {
      const variantReadbacks = {};
      for (const fixture of contract.variantFixtures) {
        const proof = await collectProductShellMetrics(origin, fixture.viewport, fixture.reducedMotion, contract, fixture);
        variantReadbacks[fixture.id] = proof;
        validateProductShellReadback({
          failures,
          proof,
          contract,
          label: fixture.id,
          expectSearchResults: fixture.expectedState.searchResultsVisible === "true",
          expectedState: fixture.expectedState,
          validateMetrics: fixture.expectedState.viewport !== "mobile"
        });
      }
      return {
        ok: failures.length === 0,
        failures,
        contract,
        readbacks: {
          variants: variantReadbacks
        }
      };
    }
	    const desktop = await collectProductShellMetrics(origin, { width: 1440, height: 900 }, "no-preference", contract);
	    const reduced = await collectProductShellMetrics(origin, { width: 1440, height: 900 }, "reduce", contract);
	    const mobile = await collectProductShellMetrics(origin, { width: 390, height: 844 }, "no-preference", contract);
    // The contract story shows the shell closed with the avatar menu open: no full menu, so no results.
    validateProductShellReadback({ failures, proof: desktop, contract, label: "desktop", expectSearchResults: false });
    validateProductShellReadback({ failures, proof: reduced, contract, label: "reduced", expectSearchResults: false, validateMetrics: false });
    validateProductShellReadback({ failures, proof: mobile, contract, label: "mobile", expectSearchResults: false, validateMetrics: false });
	    return {
	      ok: failures.length === 0,
	      failures,
	      contract,
	      readbacks: {
        desktop,
        reducedMotion: reduced,
        mobile
      }
    };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

async function runChangelogI18nReadabilityProof() {
  const { server, origin } = await startStaticServer(staticRoot);
  const failures = [];
  const route = "change-log.html?theme=light&locale=zh-CN#local-changelog";
  const requiredText = [
    "治理变更记录",
    "Storybook 治理检查点",
    "源路线",
    "故事覆盖",
    "AI 契约摘要",
    "证明工件",
    "无过度声明边界",
    "耐久源记录",
    "不发布",
    "本页内容",
    "治理记录"
  ];
  const forbiddenText = [
    "Governance changelog records",
    "Date",
    "Source route",
    "Story ids",
    "AI contract digest readback",
    "Proof artifacts and boundaries",
    "Proof artifacts",
    "No-overclaim boundaries",
    "durable source record",
    "AI contract digest verified by smoke",
    "proof receipts required",
    "no publication",
    "Current location",
    "On this page",
	    "Documentation sections",
    "Welcome and governance",
    "Component Library",
	    "Maintainers and routing",
	    "Contribution model",
	    "Icons and motion",
	    "Global states",
	    "Copy creation rules",
	    "Component family index",
	    "AI consumption contract",
	    "Local changelog",
	    "Governance entry",
    "Routing and contribution",
    "Identity and brand",
    "Type and layout",
    "Functional display",
    "Proof governance",
    "Governance records"
  ];

  async function collect(viewport) {
    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    try {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      await page.goto(`${origin}/${route}`);
      await page.waitForSelector("[data-storybook-locale='zh-CN']");
      await page.waitForSelector("[data-contract-story-id='local-changelog']");
      // The current story is the current link of the paper's contents rail (TocRail) on the top-band documentation
      // shell (TCRN-DS-SUB-131); the former side rail's nav items are gone (TCRN-DS-SUB-132).
      await page.waitForSelector(".tcrn-doc-page__toc a[href='#local-changelog'][aria-current='location']");
      await page.waitForTimeout(150);
      const metrics = await page.evaluate(({ requiredText, forbiddenText }) => {
        const bodyText = document.body.innerText;
        const html = document.documentElement;
        const body = document.body;
        const compactNodes = Array.from(document.querySelectorAll(
          "[data-changelog-full-token] .tcrn-machine-token__value, .tcrn-doc-changelog-record__artifact, .tcrn-doc-changelog-record__boundary"
        ));
        const compactNodeReadbacks = compactNodes.map((node) => {
          const rect = node.getBoundingClientRect();
          const style = window.getComputedStyle(node);
          const traceabilityNode = node.closest("[data-changelog-full-token], [data-changelog-proof-artifact], [data-changelog-no-overclaim-boundary]") ?? node;
          return {
            text: node.textContent?.trim() ?? "",
            width: Number(rect.width.toFixed(2)),
            right: Number(rect.right.toFixed(2)),
            maxWidth: style.maxWidth,
            overflow: style.overflow,
            textOverflow: style.textOverflow,
            whiteSpace: style.whiteSpace,
            overflowWrap: style.overflowWrap,
            machineToken: node.classList.contains("tcrn-machine-token__value"),
            viewportWidth: document.documentElement.clientWidth,
            hasTraceabilityMetadata: Boolean(traceabilityNode.getAttribute("title")
              || traceabilityNode.getAttribute("data-changelog-full-token")
              || traceabilityNode.getAttribute("data-changelog-proof-artifact")
              || traceabilityNode.getAttribute("data-changelog-no-overclaim-boundary"))
          };
        });
        const pageOverflow = Math.max(html.scrollWidth, body.scrollWidth) > Math.max(html.clientWidth, body.clientWidth) + 1;
        return {
          locale: document.querySelector("[data-storybook-locale]")?.getAttribute("data-storybook-locale") ?? document.documentElement.getAttribute("data-storybook-locale"),
          bodyClientWidth: body.clientWidth,
          bodyScrollWidth: body.scrollWidth,
          htmlClientWidth: html.clientWidth,
          htmlScrollWidth: html.scrollWidth,
          pageOverflow,
          missingRequiredText: requiredText.filter((text) => !bodyText.includes(text)),
          leakedForbiddenText: forbiddenText.filter((text) => bodyText.includes(text)),
          visibleRawRouteLeak: bodyText.includes("route_tcrn_ds_storybook_governance_"),
          recordCount: document.querySelectorAll("[data-changelog-route-id]").length,
          metadataRoutePreserved: Boolean(document.querySelector("[data-changelog-route-id='route_tcrn_ds_storybook_governance_engineering_implementation_after_plan_reviews_success_a1f19b1a_dded541']")),
          proofArtifactMetadataCount: document.querySelectorAll("[data-changelog-proof-artifact]").length,
          boundaryMetadataCount: document.querySelectorAll("[data-changelog-no-overclaim-boundary]").length,
          compactNodeReadbacks,
          // The full token is now the package MachineToken (TCRN-DS-SUB-027). Its value keeps
          // overflow hidden inside max-width 100% and breaks anywhere instead of truncating with
          // an ellipsis (the MachineToken rule in @tcrn/ui-react), so it is held to that contract:
          // clipped, wrapping, inside the viewport and traceable. The remaining doc-owned compact
          // nodes keep the single-line ellipsis contract.
          compactNodeFailures: compactNodeReadbacks.filter((item) => (item.machineToken
            ? item.overflow === "visible"
              || item.overflowWrap !== "anywhere"
              || item.right > item.viewportWidth + 1
            : item.overflow === "visible"
              || item.textOverflow !== "ellipsis"
              || item.whiteSpace !== "nowrap")
            || !item.hasTraceabilityMetadata)
        };
      }, { requiredText, forbiddenText });
      await context.close();
      return {
        viewport,
        route,
        url: page.url(),
        ...metrics,
        ok: metrics.locale === "zh-CN"
          && metrics.missingRequiredText.length === 0
          && metrics.leakedForbiddenText.length === 0
          && !metrics.visibleRawRouteLeak
          && !metrics.pageOverflow
          && metrics.recordCount > 0
          && metrics.metadataRoutePreserved
          && metrics.proofArtifactMetadataCount > 0
          && metrics.boundaryMetadataCount > 0
          && metrics.compactNodeFailures.length === 0
      };
    } finally {
      await browser.close();
    }
  }

  try {
    const desktop = await collect({ width: 1440, height: 900 });
    const mobile = await collect({ width: 390, height: 844 });
    if (!desktop.ok) {
      failures.push({ viewport: "desktop", desktop });
    }
    if (!mobile.ok) {
      failures.push({ viewport: "mobile", mobile });
    }
    return {
      ok: failures.length === 0,
      route,
      failures,
      readbacks: { desktop, mobile }
    };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

async function runGlobalStorybookZhCnIaProof() {
  const { server, origin } = await startStaticServer(staticRoot);
  const failures = [];
  const route = "index.html?theme=light&locale=zh-CN#welcome-governance";
  const requiredText = [
    "当前位置",
    "受治理的 Storybook 栏目",
    "本页内容",
    "欢迎",
    "样式指南",
    "基础",
    "组件",
    "模式",
    "证明",
    "变更日志"
  ];
  const forbiddenText = [
    "Current location",
    "Governed Storybook section",
    "On this page",
	    "Documentation sections",
	    "Welcome and governance",
	    "Component Library",
	    "Maintainers and routing",
	    "Contribution model",
	    "Icons and motion",
	    "Global states",
	    "Copy creation rules",
	    "Component family index",
	    "AI consumption contract",
	    "Local changelog",
	    "Governance entry",
    "Routing and contribution",
    "Identity and brand",
    "Type and layout",
    "Interaction and copy",
    "Tokens and i18n",
    "Copy governance",
    "Component inventory",
    "Controls and data",
    "Navigation and shells",
    "Functional display",
    "Forms and workbench",
    "Feedback and selection",
    "Data and pages",
    "Proof governance",
    "Governance records"
  ];

  async function collect(viewport) {
    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    try {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      await page.goto(`${origin}/${route}`);
      await page.waitForSelector("[data-storybook-locale='zh-CN']");
      await page.waitForSelector("[data-contract-story-id='welcome-governance']");
      // Top-band documentation shell (TCRN-DS-SUB-131/132): the current story is the contents rail's current link,
      // and the sections and categories are rows of the shell's own full menu (outside the paper), carried hidden.
      await page.waitForSelector(".tcrn-doc-page__toc a[href='#welcome-governance'][aria-current='location']");
      await page.waitForSelector("[data-shell='doc'] [data-shell-menu]:not([data-paper] *) a[data-shell-row]", { state: "attached" });
      await page.waitForTimeout(150);
      const metrics = await page.evaluate(({ requiredText, forbiddenText, sectionFiles }) => {
        const bodyText = document.body.innerText;
        const html = document.documentElement;
        const body = document.body;
        const accessibilityAttributeNames = ["aria-label", "title", "placeholder", "alt"];
        const accessibilityAttributeLeaks = Array.from(document.querySelectorAll("[aria-label], [title], [placeholder], [alt]"))
          .filter((node) => !node.matches("link[data-tcrn-ai-consumption-contract], link[data-tcrn-ai-consumption-contract-help]"))
          .flatMap((node) => accessibilityAttributeNames
            .map((name) => ({ name, value: node.getAttribute(name) }))
            .filter((item) => item.value)
            .flatMap((item) => forbiddenText
              .filter((term) => item.value.includes(term))
              .map((term) => ({
                term,
                tag: node.tagName,
                attribute: item.name,
                value: item.value
              }))));
        // The category labels and their descriptions are read on the category rows of the documentation shell's own
        // full menu (one row per category page, deduplicated by page); the current location is the menu's bottom bar,
        // "on this page" is the paper's contents rail, and the doc brand lockup is the one in the bottom bar.
        const docShellOwn = (layer) => document.querySelector(`[data-shell="doc"] ${layer}:not([data-paper] *)`);
        const storybookNav = docShellOwn("[data-shell-menu]");
        const rowsByPage = new Map();
        for (const link of Array.from(storybookNav?.querySelectorAll("a[data-shell-row]") ?? [])) {
          const page = (link.getAttribute("href") ?? "").split(/[?#]/)[0];
          if (page && !rowsByPage.has(page)) rowsByPage.set(page, link);
        }
        const categoryRows = Array.from(rowsByPage.entries())
          .filter(([page]) => page.endsWith(".html") && !sectionFiles.includes(page))
          .map(([, link]) => link);
        const categoryLabels = categoryRows
          .map((node) => node.textContent?.trim() ?? "")
          .filter(Boolean);
        const categoryDescriptions = categoryRows
          .map((node) => document.getElementById(node.getAttribute("aria-describedby") ?? "")?.textContent?.trim() ?? "")
          .filter(Boolean);
        // The section labels the former rail showed as group headings are the menu's section rows (the band pins
        // them only at desktop widths).
        const sectionLabels = Array.from(rowsByPage.entries())
          .filter(([page]) => sectionFiles.includes(page))
          .map(([, link]) => link.textContent?.trim() ?? "")
          .filter(Boolean);
        const currentLocation = docShellOwn("[data-shell-pbar]");
	        const onThisPage = document.querySelector(".tcrn-doc-page__toc[data-doc-toc] .tcrn-toc-rail");
	        const brandNode = currentLocation?.querySelector("[data-lockup]") ?? null;
	        const brandCaptionNode = brandNode?.querySelector(".tcrn-product-logo__line-two, .tcrn-shell-brand-lockup__caption") ?? null;
	        const pageOverflow = Math.max(html.scrollWidth, body.scrollWidth) > Math.max(html.clientWidth, body.clientWidth) + 1;
	        const localizedTextSurface = [
	          bodyText,
	          currentLocation?.textContent ?? "",
	          sectionLabels.join("\\n"),
	          categoryLabels.join("\\n"),
	          categoryDescriptions.join("\\n")
	        ].join("\\n");
	        return {
          locale: document.querySelector("[data-storybook-locale]")?.getAttribute("data-storybook-locale") ?? document.documentElement.getAttribute("data-storybook-locale"),
          bodyClientWidth: body.clientWidth,
          bodyScrollWidth: body.scrollWidth,
          htmlClientWidth: html.clientWidth,
          htmlScrollWidth: html.scrollWidth,
          pageOverflow,
	          missingRequiredText: requiredText.filter((text) => !localizedTextSurface.includes(text)),
	          leakedForbiddenText: forbiddenText.filter((text) => localizedTextSurface.includes(text)),
          accessibilityAttributeLeaks,
          categoryLabelCount: categoryLabels.length,
          categoryLabels,
          categoryDescriptions,
          categoryDescriptionCount: categoryDescriptions.length,
          categoryDescriptionEnglishLeaks: categoryDescriptions.filter((text) => forbiddenText.some((term) => text.includes(term))),
          docBrandText: brandNode?.textContent?.replace(/\s+/g, " ").trim() ?? null,
          docBrandCaptionText: brandCaptionNode?.textContent?.replace(/\s+/g, " ").trim() ?? null,
          docBrandCaptionLocalized: (brandCaptionNode?.textContent ?? "").includes("设计系统") && !(brandNode?.textContent ?? "").includes("Component Library"),
          currentLocationText: currentLocation?.textContent?.replace(/\s+/g, " ").trim() ?? null,
          onThisPageAriaLabel: onThisPage?.getAttribute("aria-label") ?? null
        };
      }, { requiredText, forbiddenText, sectionFiles: Object.values(pagesByGroup) });
      await context.close();
      return {
        viewport,
        route,
        url: page.url(),
        ...metrics,
        ok: metrics.locale === "zh-CN"
          && metrics.missingRequiredText.length === 0
          && metrics.leakedForbiddenText.length === 0
          && metrics.accessibilityAttributeLeaks.length === 0
          && !metrics.pageOverflow
          && metrics.categoryLabelCount === expectedStoryCategoryCount
          && metrics.categoryDescriptionCount === expectedStoryCategoryCount
          && metrics.categoryDescriptionEnglishLeaks.length === 0
          && metrics.docBrandCaptionLocalized
          && metrics.currentLocationText?.includes("当前位置")
          && metrics.onThisPageAriaLabel === "本页内容"
      };
    } finally {
      await browser.close();
    }
  }

  try {
    const desktop = await collect({ width: 1440, height: 900 });
    const mobile = await collect({ width: 390, height: 844 });
    if (!desktop.ok) {
      failures.push({ viewport: "desktop", desktop });
    }
    if (!mobile.ok) {
      failures.push({ viewport: "mobile", mobile });
    }
    return {
      ok: failures.length === 0,
      route,
      failures,
      readbacks: { desktop, mobile }
    };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

async function runCrossSectionShellParityProof() {
  const { server, origin } = await startStaticServer(staticRoot);
  const failures = [];
  const firstStoryByGroup = Object.fromEntries(expectedContractStoryGroups.map((group) => [
    group,
    requiredStories.find((story) => story.group === group)?.id ?? null
  ]));
  const targetGroups = ["Welcome", "Style Guide", "Foundations", "Components", "Patterns", "Proof", "Change Log"];
  const routes = targetGroups.map((group) => ({
    group,
    file: pagesByGroup[group],
    storyId: firstStoryByGroup[group]
  }));
  const forbiddenZhCnProductShellText = [
    "Welcome and governance",
    "Maintainers and routing",
    "Component Library",
    "Contribution model",
    "Icons and motion",
    "Global states",
    "Copy creation rules",
    "Component family index",
    "Functional display",
    "AI consumption contract",
    "Local changelog"
  ];
  const forbiddenOwnerVisibleCaptionText = [
    "私有本地脚手架证明",
    "Private local scaffold proof"
  ];
  const expectedThemeToggleRadius = `${productShellComparatorContract.expectedControlMetrics.themeToggle.radius}px`;

  async function collect(viewport) {
    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    try {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      const readbacks = [];
      const isDesktopViewport = viewport.width >= 1024;
      for (const route of routes) {
        if (!route.storyId) {
          readbacks.push({ ...route, ok: false, failures: ["missing-first-story"] });
          continue;
        }
        await page.goto(`${origin}/${route.file}?theme=light&locale=zh-CN#${route.storyId}`);
        await page.waitForSelector("[data-storybook-locale='zh-CN']");
        await page.waitForSelector(`[data-active-story-section='${route.group}']`);
        // Top-band documentation shell (TCRN-DS-SUB-131/132): the current story is the current link of the paper's
        // contents rail; the band holds the brand button, the pinned sections and the avatar cluster.
        await page.waitForSelector(`.tcrn-doc-page__toc a[href='#${route.storyId}'][aria-current='location']`);
        await page.waitForTimeout(180);
        // The search sits in the full menu and the theme and language controls in the avatar menu; each layer is read
        // open through the page's layer interface and closed again before the next readback.
        const readOpenLayer = async (layer, read) => {
          await page.evaluate((name) => window.tcrnDocShellLayers?.[name]?.(true), layer);
          await page.waitForTimeout(180);
          const value = await page.evaluate(read);
          await page.evaluate((name) => window.tcrnDocShellLayers?.[name]?.(false), layer);
          return value;
        };
        const closedMetrics = await page.evaluate(({ group, storyId, forbiddenZhCnProductShellText, forbiddenOwnerVisibleCaptionText, sectionFiles }) => {
          const rectOf = (node) => {
            if (!node) {
              return null;
            }
            const rect = node.getBoundingClientRect();
            return {
              top: Number(rect.top.toFixed(2)),
              left: Number(rect.left.toFixed(2)),
              right: Number(rect.right.toFixed(2)),
              bottom: Number(rect.bottom.toFixed(2)),
              width: Number(rect.width.toFixed(2)),
              height: Number(rect.height.toFixed(2))
            };
          };
          const styleOf = (node, properties) => {
            if (!node) {
              return null;
            }
            const style = window.getComputedStyle(node);
            return Object.fromEntries(properties.map((property) => [property, style.getPropertyValue(property)]));
          };
          const docShellOwn = (layer) => document.querySelector(`[data-shell="doc"] ${layer}:not([data-paper] *)`);
          const html = document.documentElement;
          const body = document.body;
          const shell = document.querySelector("[data-contract-surface]");
          const strip = docShellOwn("[data-shell-strip]");
          const brandTab = docShellOwn("[data-tab][data-shell-brand]");
          const pins = docShellOwn("[data-pins]");
          const cluster = docShellOwn("[data-cluster]");
          const storybookNav = docShellOwn("[data-shell-menu]");
          const currentLocationNode = docShellOwn("[data-shell-pbar]");
          const paper = document.querySelector("[data-shell='doc'] [data-paper]:not([data-paper] *)");
          const docMain = document.querySelector("[data-shell='doc'] main#content");
          const header = rectOf(strip);
          const brandTabRect = rectOf(brandTab);
          const pinsRect = rectOf(pins);
          const clusterRect = rectOf(cluster);
          const pageHead = rectOf(document.querySelector("[data-doc-page-head='governed-section']"));
          const firstStory = document.querySelector(`[data-contract-story-id='${storyId}']`);
          const activeStory = document.querySelector(".tcrn-doc-page__toc[data-doc-toc] a[aria-current='location']");
          const rowsByPage = new Map();
          for (const link of Array.from(storybookNav?.querySelectorAll("a[data-shell-row]") ?? [])) {
            const page = (link.getAttribute("href") ?? "").split(/[?#]/)[0];
            if (page && !rowsByPage.has(page)) rowsByPage.set(page, link);
          }
          const sectionRowCount = Array.from(rowsByPage.keys()).filter((page) => sectionFiles.includes(page)).length;
          const categoryLabels = Array.from(rowsByPage.entries())
            .filter(([page]) => page.endsWith(".html") && !sectionFiles.includes(page))
            .map(([, link]) => link.textContent?.trim() ?? "")
            .filter(Boolean);
          // The visible brand is the band's brand button; the doc brand lockup with its caption is the one in the
          // full menu's bottom bar.
          const brandNode = currentLocationNode?.querySelector("[data-lockup]") ?? null;
          const brandCaptionNode = brandNode?.querySelector(".tcrn-product-logo__line-two, .tcrn-shell-brand-lockup__caption") ?? null;
          const searchInput = storybookNav?.querySelector("[data-doc-search-input]") ?? null;
          const docShellTextSurface = [
            brandTab?.textContent ?? "",
            brandNode?.textContent ?? "",
            storybookNav?.innerText ?? "",
            currentLocationNode?.textContent ?? "",
            searchInput?.getAttribute("aria-label") ?? "",
            searchInput?.getAttribute("placeholder") ?? ""
          ].join("\\n");
          const ownerVisibleCaptionSurface = [
            docShellTextSurface,
            firstStory instanceof HTMLElement ? firstStory.innerText : ""
          ].join("\\n");
          const docShellEnglishLeaks = forbiddenZhCnProductShellText.filter((text) => docShellTextSurface.includes(text));
          const ownerVisibleCaptionHits = forbiddenOwnerVisibleCaptionText.filter((text) => ownerVisibleCaptionSurface.includes(text));
          const brandIdentityLogoSectionReadback = storyId === "brand-identity" && firstStory instanceof HTMLElement
            ? {
              productLockupCount: firstStory.querySelectorAll("[data-brand-lockup='product']").length,
              hasProductLockupsLabel: firstStory.innerText.includes("产品组合标识") || firstStory.innerText.includes("Product lockups"),
              hasRegisteredProductLogosLabel: firstStory.innerText.includes("Registered product logos"),
              hasRegistryExportText: firstStory.innerText.includes("ProductLogo / tcrnProductLogoRegistry"),
              hasAosRegisteredAssetId: firstStory.innerText.includes("tcrn-aos-two-line")
            }
            : null;
          const headerBottom = header?.bottom ?? 0;
          const pageOverflow = Math.max(html.scrollWidth, body.scrollWidth) > Math.max(html.clientWidth, body.clientWidth) + 1;
          return {
            group,
            storyId,
            url: window.location.pathname + window.location.search + window.location.hash,
            locale: shell?.getAttribute("data-storybook-locale") ?? null,
            activeSection: shell?.getAttribute("data-active-story-section") ?? null,
            activeStoryId: activeStory?.getAttribute("href")?.replace(/^#/, "") ?? null,
            // The paper's main region is the scroll container; the first story's hash keeps it at the top.
            scrollY: Number(((docMain?.scrollTop ?? 0) + window.scrollY).toFixed(2)),
            pageOverflow,
            shellAuthority: shell?.getAttribute("data-doc-shell") ?? null,
            docShellSelectorCount: [shell?.matches("[data-shell='doc'][data-doc-shell]") ? shell : null, strip, brandTab, storybookNav, searchInput, paper].filter(Boolean).length,
            // The page chrome is itself the package ProductShell: its root and main region are the documentation
            // shell's own; any other global ProductShell marker outside a story body still counts.
            globalProductShellShellSelectorCount: Array.from(document.querySelectorAll("[data-storybook-shell-authority], [data-storybook-product-shell-skin], [data-package-backed-product-shell-boundary], [data-product-shell-region='side-navigation'], .tcrn-product-shell__sidebar, .tcrn-product-shell__main"))
              .filter((node) => !node.closest(".story-body") && node !== shell && node !== docMain)
              .length,
            docPageHeadCount: document.querySelectorAll("[data-doc-page-head='governed-section']").length,
            onThisPageCount: document.querySelectorAll(".tcrn-doc-page__toc[data-doc-toc]").length,
            mandatoryBoundaryCount: document.querySelectorAll("[data-mandatory-boundary-block='visible']").length,
            noOverclaimBoundaryCount: document.querySelectorAll("[data-no-overclaim-boundary='visible']").length,
            legacyProductShellGlobalNavCount: Array.from(document.querySelectorAll("[data-product-shell-region='side-navigation'], [data-product-shell-route]"))
              .filter((node) => !node.closest(".story-body"))
              .length,
            navGroupCount: sectionRowCount,
            categoryLabelCount: categoryLabels.length,
            categoryLabels,
            docBrandText: brandNode?.textContent?.replace(/\s+/g, " ").trim() ?? null,
            docBrandCaptionText: brandCaptionNode?.textContent?.replace(/\s+/g, " ").trim() ?? null,
            docBrandCaptionLocalized: (brandCaptionNode?.textContent ?? "").includes("设计系统") && !(brandNode?.textContent ?? "").includes("Component Library"),
            docShellEnglishLeaks,
            ownerVisibleCaptionHits,
            brandIdentityLogoSectionReadback,
            firstStoryTop: firstStory ? Number(firstStory.getBoundingClientRect().top.toFixed(2)) : null,
            pageHead,
            header,
            brandTab: brandTabRect,
            pins: pinsRect,
            cluster: clusterRect,
            sideNavRegion: rectOf(docShellOwn("[data-product-shell-region='side-navigation']")),
            headerStyles: styleOf(strip, ["display", "grid-template-columns", "min-height"]),
            workspaceStyles: styleOf(cluster, ["display", "grid-template-columns", "gap", "padding-left", "padding-right"]),
            pageHeadStyles: styleOf(document.querySelector("[data-doc-page-head='governed-section']"), ["display", "grid-template-columns", "gap", "border-bottom-style"]),
            layoutStyles: styleOf(paper, ["display", "grid-template-columns"]),
            brandBeforePins: Boolean(brandTabRect && pinsRect && brandTabRect.right <= pinsRect.left + 1),
            pinsBeforeCluster: Boolean(pinsRect && clusterRect && pinsRect.right <= clusterRect.left + 1),
            utilityTrailingGap: clusterRect ? Number((window.innerWidth - clusterRect.right).toFixed(2)) : null,
            pageHeadStartsBelowHeader: Boolean(pageHead && pageHead.top >= headerBottom - 1),
            storyStartsAfterPageHead: Boolean(pageHead && firstStory && firstStory.getBoundingClientRect().top >= pageHead.bottom - 1)
          };
        }, { group: route.group, storyId: route.storyId, forbiddenZhCnProductShellText, forbiddenOwnerVisibleCaptionText, sectionFiles: Object.values(pagesByGroup) });
        const menuMetrics = await readOpenLayer("setMenu", () => {
          const rectOf = (node) => {
            if (!node) {
              return null;
            }
            const rect = node.getBoundingClientRect();
            return {
              top: Number(rect.top.toFixed(2)),
              left: Number(rect.left.toFixed(2)),
              right: Number(rect.right.toFixed(2)),
              bottom: Number(rect.bottom.toFixed(2)),
              width: Number(rect.width.toFixed(2)),
              height: Number(rect.height.toFixed(2))
            };
          };
          const styleOf = (node, properties) => {
            if (!node) {
              return null;
            }
            const style = window.getComputedStyle(node);
            return Object.fromEntries(properties.map((property) => [property, style.getPropertyValue(property)]));
          };
          const storybookNav = document.querySelector("[data-shell='doc'] [data-shell-menu]:not([data-paper] *)");
          const searchRoot = storybookNav?.querySelector(".tcrn-search-input") ?? null;
          const searchControlNode = searchRoot?.querySelector(".tcrn-search-input__control") ?? null;
          const search = rectOf(storybookNav?.querySelector("[data-shell-search]") ?? searchRoot);
          const searchInputShell = rectOf(searchRoot);
          const searchInputShellStyles = styleOf(searchRoot, ["border-color", "border-radius", "border-top-style", "border-top-width", "background-color"]);
          const searchControlStyles = styleOf(searchControlNode, ["border-radius", "background-color", "padding-left", "padding-right"]);
          const searchControl = rectOf(searchControlNode);
          const searchIcon = rectOf(searchRoot?.querySelector(".tcrn-search-input__icon"));
          const searchShortcut = rectOf(searchRoot?.querySelector(".tcrn-search-input__shortcut"));
          const searchInputGridStyles = styleOf(searchRoot, ["display", "grid-template-columns", "overflow"]);
          const searchFitFailures = [];
          if (searchInputShell && searchControl && searchIcon && searchShortcut) {
            if (searchControl.width < 84) searchFitFailures.push(`control-width:${searchControl.width}`);
            // G+ tool form (TCRN-DS-SUB-020): the icon and the shortcut sit over the control,
            // inside its box, and the control's inline padding keeps the text clear of both.
            const controlPaddingStart = Number.parseFloat(searchControlStyles?.["padding-left"] ?? "0");
            const controlPaddingEnd = Number.parseFloat(searchControlStyles?.["padding-right"] ?? "0");
            if (searchIcon.left < searchControl.left - 1 || searchIcon.right > searchControl.left + controlPaddingStart + 1) searchFitFailures.push("icon-track-overlap");
            if (searchShortcut.right > searchControl.right + 1 || searchShortcut.left < searchControl.right - controlPaddingEnd - 1) searchFitFailures.push("shortcut-track-overlap");
          } else {
            searchFitFailures.push("search-track-missing");
          }
          if (searchInputGridStyles?.display !== "grid") searchFitFailures.push(`display:${searchInputGridStyles?.display ?? "missing"}`);
          // The rows of the open full menu stand in for the former side rail's labels.
          const sidebarNoIconLabelReadbacks = window.innerWidth >= 900
            ? Array.from(storybookNav?.querySelectorAll("a[data-shell-row]") ?? [])
              .map((item) => {
                const label = item;
                const itemRect = item.getBoundingClientRect();
                const labelRect = label.getBoundingClientRect();
                if (itemRect.width < 1 || itemRect.height < 1 || labelRect.width < 1 || labelRect.height < 1) {
                  return null;
                }
                const style = window.getComputedStyle(label);
                const lineHeight = Number.parseFloat(style.lineHeight) || 1;
                const lineCount = Math.max(1, Math.round(labelRect.height / lineHeight));
                const text = label.textContent?.replace(/\s+/g, " ").trim() ?? "";
                const textLength = text.replace(/\s+/g, "").length;
                const hasNoIconContract = true;
                const minReadableWidth = Math.min(64, Math.max(40, itemRect.width * 0.25));
                return {
                  route: (item.getAttribute("href") ?? "").split(/[?#]/)[0],
                  text,
                  textLength,
                  itemWidth: Number(itemRect.width.toFixed(2)),
                  labelWidth: Number(labelRect.width.toFixed(2)),
                  labelHeight: Number(labelRect.height.toFixed(2)),
                  lineHeight: Number(lineHeight.toFixed(2)),
                  lineCount,
                  overflowWrap: style.overflowWrap,
                  wordBreak: style.wordBreak,
                  hasNoIconContract,
                  ok: hasNoIconContract
                    && (textLength < 8
                      || (labelRect.width >= minReadableWidth
                        && lineCount <= 3
                        && style.overflowWrap !== "anywhere"))
                };
              })
              .filter(Boolean)
            : [];
          return {
            search,
            searchInputShell,
            searchInputShellStyles,
            searchControlStyles,
            searchControl,
            searchIcon,
            searchShortcut,
            searchInputGridStyles,
            searchFitFailures,
            sidebarNoIconLabelReadbacks,
            sidebarNoIconLabelReadabilityFailures: sidebarNoIconLabelReadbacks.filter((item) => !item.ok)
          };
        });
        const accountMetrics = await readOpenLayer("setAccount", () => {
          const rectOf = (node) => {
            if (!node) {
              return null;
            }
            const rect = node.getBoundingClientRect();
            return {
              top: Number(rect.top.toFixed(2)),
              left: Number(rect.left.toFixed(2)),
              right: Number(rect.right.toFixed(2)),
              bottom: Number(rect.bottom.toFixed(2)),
              width: Number(rect.width.toFixed(2)),
              height: Number(rect.height.toFixed(2))
            };
          };
          const account = document.querySelector("[data-shell='doc'] [data-panel='account']:not([data-paper] *)");
          const themeToggle = account?.querySelector("[data-shell-control='theme-toggle']") ?? null;
          return {
            controls: rectOf(themeToggle),
            themeToggleRadius: themeToggle ? window.getComputedStyle(themeToggle).getPropertyValue("border-radius") : null,
            localeControl: rectOf(account?.querySelector(".tcrn-shell-locale-menu"))
          };
        });
        const metrics = { ...closedMetrics, ...menuMetrics, ...accountMetrics };
        const routeFailures = [];
        if (metrics.locale !== "zh-CN") routeFailures.push(`locale:${metrics.locale}`);
        if (metrics.activeSection !== route.group) routeFailures.push(`active-section:${metrics.activeSection}`);
        if (metrics.activeStoryId !== route.storyId) routeFailures.push(`active-story:${metrics.activeStoryId}`);
        if (metrics.scrollY > 2) routeFailures.push(`first-story-hash-scrollY:${metrics.scrollY}`);
        if (metrics.shellAuthority !== "online-docs") routeFailures.push(`doc-shell-authority:${metrics.shellAuthority}`);
        if (metrics.docShellSelectorCount < 6) routeFailures.push(`doc-shell-selector-count:${metrics.docShellSelectorCount}`);
        if (metrics.globalProductShellShellSelectorCount !== 0) routeFailures.push(`global-product-shell-shell-selectors:${metrics.globalProductShellShellSelectorCount}`);
        if (metrics.docPageHeadCount !== 1) routeFailures.push(`page-head-count:${metrics.docPageHeadCount}`);
        if (metrics.onThisPageCount !== 1) routeFailures.push(`on-this-page-count:${metrics.onThisPageCount}`);
        if (metrics.mandatoryBoundaryCount !== 1 || metrics.noOverclaimBoundaryCount !== 1) routeFailures.push("mandatory-boundary-missing");
        if (metrics.legacyProductShellGlobalNavCount !== 0) routeFailures.push(`legacy-product-shell-global-nav:${metrics.legacyProductShellGlobalNavCount}`);
        if (metrics.navGroupCount !== expectedStorybookShellNavGroupCount) routeFailures.push(`nav-group-count:${metrics.navGroupCount}`);
        if (metrics.categoryLabelCount !== expectedStoryCategoryCount) routeFailures.push(`category-label-count:${metrics.categoryLabelCount}`);
        if (!metrics.docBrandCaptionLocalized) {
          routeFailures.push(`doc-brand-caption-zh-cn:${metrics.docBrandCaptionText ?? "missing"}`);
        }
        if (metrics.docShellEnglishLeaks.length > 0) {
          routeFailures.push(`doc-shell-zh-cn-english-leaks:${metrics.docShellEnglishLeaks.join("|")}`);
        }
        if (metrics.ownerVisibleCaptionHits.length > 0) {
          routeFailures.push(`owner-visible-caption-hits:${metrics.ownerVisibleCaptionHits.join("|")}`);
        }
        if (metrics.brandIdentityLogoSectionReadback) {
          const readback = metrics.brandIdentityLogoSectionReadback;
          if (readback.productLockupCount !== 3) routeFailures.push(`brand-identity-product-lockup-count:${readback.productLockupCount}`);
          if (!readback.hasProductLockupsLabel) routeFailures.push("brand-identity-product-lockups-label-missing");
          if (readback.hasRegisteredProductLogosLabel) routeFailures.push("brand-identity-registered-product-logos-primary-surface");
          if (readback.hasRegistryExportText) routeFailures.push("brand-identity-registry-export-primary-surface");
          if (readback.hasAosRegisteredAssetId) routeFailures.push("brand-identity-registered-asset-id-primary-surface");
        }
        if (metrics.sidebarNoIconLabelReadabilityFailures.length > 0) {
          routeFailures.push(`sidebar-no-icon-label-readability:${JSON.stringify(metrics.sidebarNoIconLabelReadabilityFailures.slice(0, 3))}`);
        }
        if (metrics.themeToggleRadius !== expectedThemeToggleRadius) {
          routeFailures.push(`theme-toggle-radius:${metrics.themeToggleRadius ?? "missing"}:expected:${expectedThemeToggleRadius}`);
        }
        if (metrics.pageOverflow) routeFailures.push("page-overflow");
        if (isDesktopViewport) {
          const widthWithin = (actual, expected, tolerance) => typeof actual === "number" && typeof expected === "number" && Math.abs(actual - expected) <= tolerance;
          const expectedSidebarWidth = expectedStorybookSidebarWidthForViewport(viewport.width);
          // No resident side rail on the top-band shell: the expected width is 0 and an absent rail reads as 0.
          if (!widthWithin(metrics.sideNavRegion?.width ?? 0, expectedSidebarWidth, expectedStorybookVisualSkin.sidebarTolerancePx)) {
            routeFailures.push(`storybook-skin-sidebar-width:${metrics.sideNavRegion?.width ?? "missing"}:expected:${expectedSidebarWidth}`);
          }
          if (!widthWithin(metrics.header?.height, expectedStorybookVisualSkin.topbarHeightPx, expectedStorybookVisualSkin.topbarTolerancePx)) {
            routeFailures.push(`storybook-skin-topbar-height:${metrics.header?.height ?? "missing"}:expected:${expectedStorybookVisualSkin.topbarHeightPx}`);
          }
          if (!widthWithin(metrics.search?.width, expectedStorybookVisualSkin.searchRestWidthPx, 2)) {
            routeFailures.push(`storybook-skin-search-width:${metrics.search?.width ?? "missing"}:expected:${expectedStorybookVisualSkin.searchRestWidthPx}`);
          }
          if ((metrics.searchFitFailures ?? []).length > 0) {
            routeFailures.push(`storybook-skin-search-fit:${metrics.searchFitFailures.join("|")}`);
          }
          if (!widthWithin(metrics.searchInputShell?.height, expectedStorybookVisualSkin.searchHeightPx, 2)) {
            routeFailures.push(`storybook-skin-search-height:${metrics.searchInputShell?.height ?? "missing"}:expected:${expectedStorybookVisualSkin.searchHeightPx}`);
          }
          // G+ SearchInput (TCRN-DS-SUB-020): the wrapper paints nothing; the control is the box,
          // with the wash fill at rest and the control radius. The docs contract's former wrapper
          // border colour and radius describe the retired outlined field and are not read here.
          const searchWrapperPaints = (metrics.searchInputShellStyles?.["border-top-style"] ?? "none") !== "none"
            && Number.parseFloat(metrics.searchInputShellStyles?.["border-top-width"] ?? "0") > 0;
          const searchWrapperFill = metrics.searchInputShellStyles?.["background-color"] ?? "missing";
          if (searchWrapperPaints || !["rgba(0, 0, 0, 0)", "transparent"].includes(searchWrapperFill)) {
            routeFailures.push(`storybook-skin-search-wrapper-paints:${metrics.searchInputShellStyles?.["border-top-style"] ?? "missing"}:${searchWrapperFill}`);
          }
          if (!gplusColorBothThemes("--tcrn-color-wash").includes(metrics.searchControlStyles?.["background-color"])) {
            routeFailures.push(`storybook-skin-search-fill:${metrics.searchControlStyles?.["background-color"] ?? "missing"}:expected:${gplusColorBothThemes("--tcrn-color-wash").join("|")}`);
          }
          if (metrics.searchControlStyles?.["border-radius"] !== `${gplusPx("--tcrn-radius-control")}px`) {
            routeFailures.push(`storybook-skin-search-radius:${metrics.searchControlStyles?.["border-radius"] ?? "missing"}:expected:${gplusPx("--tcrn-radius-control")}px`);
          }
          // The band reads left to right: brand button, pinned sections, avatar cluster (07a A segment).
          if (!metrics.brandBeforePins) routeFailures.push("brand-not-before-pins");
          if (!metrics.pinsBeforeCluster) routeFailures.push("pins-not-before-cluster");
          if (typeof metrics.utilityTrailingGap !== "number"
            || metrics.utilityTrailingGap < expectedStorybookVisualSkin.trailingUtilityGapMinPx
            || metrics.utilityTrailingGap > expectedStorybookVisualSkin.trailingUtilityGapMaxPx) {
            routeFailures.push(`utility-trailing-gap:${metrics.utilityTrailingGap}:expected:${expectedStorybookVisualSkin.trailingUtilityGapMinPx}-${expectedStorybookVisualSkin.trailingUtilityGapMaxPx}`);
          }
        }
        if (!metrics.pageHeadStartsBelowHeader) routeFailures.push("page-head-not-below-header");
        if (!metrics.storyStartsAfterPageHead) routeFailures.push("story-not-after-page-head");
        readbacks.push({ ...metrics, ok: routeFailures.length === 0, failures: routeFailures });
      }
      await context.close();
      const desktopReadbacks = readbacks.filter((item) => viewport.width >= 1024);
      const signatures = {
        headerStyles: new Set(desktopReadbacks.map((item) => JSON.stringify(item.headerStyles))).size,
        workspaceStyles: new Set(desktopReadbacks.map((item) => JSON.stringify(item.workspaceStyles))).size,
        pageHeadStyles: new Set(desktopReadbacks.map((item) => JSON.stringify(item.pageHeadStyles))).size,
        layoutStyles: new Set(desktopReadbacks.map((item) => JSON.stringify(item.layoutStyles))).size,
        utilityTrailingGapDelta: desktopReadbacks.length
          ? Number((Math.max(...desktopReadbacks.map((item) => item.utilityTrailingGap ?? 0)) - Math.min(...desktopReadbacks.map((item) => item.utilityTrailingGap ?? 0))).toFixed(2))
          : 0
      };
      const parityFailures = [];
      if (viewport.width >= 1024) {
        for (const [name, count] of Object.entries(signatures)) {
          if (name.endsWith("Delta")) {
            if (count > 2) parityFailures.push(`${name}:${count}`);
          } else if (count !== 1) {
            parityFailures.push(`${name}:${count}`);
          }
        }
      }
      return {
        viewport,
        routes: readbacks,
        signatures,
        parityFailures,
        ok: readbacks.every((item) => item.ok) && parityFailures.length === 0
      };
    } finally {
      await browser.close();
    }
  }

  try {
    const desktop = await collect({ width: 1440, height: 900 });
    const mobile = await collect({ width: 390, height: 844 });
    if (!desktop.ok) {
      failures.push({ viewport: "desktop", desktop });
    }
    if (!mobile.ok) {
      failures.push({ viewport: "mobile", mobile });
    }
    return {
      ok: failures.length === 0,
      routes: routes.map((route) => `${route.file}?theme=light&locale=zh-CN#${route.storyId}`),
      failures,
      readbacks: { desktop, mobile }
    };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

async function runLocaleMenuFocusReturnProof() {
  const { server, origin } = await startStaticServer(staticRoot);
  const failures = [];
  const routes = [
    {
      id: "welcome-doc-shell-locale-escape-desktop",
      route: "index.html?theme=light&locale=zh-CN#welcome-governance",
      viewport: { width: 1440, height: 900 }
    },
    {
      id: "welcome-doc-shell-locale-escape-mobile",
      route: "index.html?theme=light&locale=zh-CN#welcome-governance",
      viewport: { width: 390, height: 844 }
    }
  ];
  const readbacks = [];
  try {
    for (const route of routes) {
      const browser = await chromium.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
      });
      try {
        const page = await browser.newPage({ viewport: route.viewport });
        await page.goto(`${origin}/${route.route}`);
        await page.waitForSelector("[data-storybook-locale='zh-CN']");
        // The language menu is the package ShellLocaleMenu in the documentation shell's avatar menu (TCRN-DS-SUB-131):
        // open that panel through the page's layer interface, then work the trigger inside it (TCRN-DS-SUB-132).
        const localeTriggerSelector = "[data-shell='doc'] [data-panel='account']:not([data-paper] *) .tcrn-shell-locale-menu__trigger";
        const localeMenuSelector = "[data-shell='doc'] [data-panel='account']:not([data-paper] *) [data-locale-menu]";
        await page.evaluate(() => window.tcrnDocShellLayers?.setAccount(true));
        await page.waitForSelector(localeTriggerSelector);
        await page.locator(localeTriggerSelector).click();
        await page.waitForSelector(`${localeMenuSelector}:not([hidden])`);
        const openReadback = await page.evaluate(({ localeTriggerSelector, localeMenuSelector }) => ({
          activeTag: document.activeElement?.tagName?.toLowerCase() ?? null,
          activeId: document.activeElement?.id ?? null,
          expanded: document.querySelector(localeTriggerSelector)?.getAttribute("aria-expanded") ?? null,
          menuHidden: document.querySelector(localeMenuSelector)?.hasAttribute("hidden") ?? null
        }), { localeTriggerSelector, localeMenuSelector });
        await page.keyboard.press("Escape");
        // Bounded waits: when the menu stays open or focus lands elsewhere, the readback below reports it as a failure
        // instead of the proof aborting on a timeout.
        await page.waitForFunction((selector) => document.querySelector(selector)?.hasAttribute("hidden"), localeMenuSelector, { timeout: 3000 }).catch(() => null);
        await page.waitForFunction((selector) => document.activeElement?.matches(selector) === true, localeTriggerSelector, { timeout: 3000 }).catch(() => null);
        const closeReadback = await page.evaluate(({ localeTriggerSelector, localeMenuSelector }) => {
          const shell = document.querySelector("[data-contract-surface]");
          const docMain = document.querySelector("[data-shell='doc'] main#content");
          return {
            activeTag: document.activeElement?.tagName?.toLowerCase() ?? null,
            activeId: document.activeElement?.id ?? null,
            activeIsLocaleTrigger: document.activeElement?.matches(localeTriggerSelector) === true,
            activeText: (document.activeElement?.textContent ?? "").replace(/\s+/g, " ").trim(),
            expanded: document.querySelector(localeTriggerSelector)?.getAttribute("aria-expanded") ?? null,
            menuHidden: document.querySelector(localeMenuSelector)?.hasAttribute("hidden") ?? null,
            dismissalContract: document.querySelector("[data-shell='doc'] [data-panel='account']:not([data-paper] *) [data-locale-dismissal-contract]")?.getAttribute("data-locale-dismissal-contract") ?? null,
            shellAuthority: shell?.getAttribute("data-doc-shell") ?? null,
            // The documentation shell's own root and main region are the page chrome; other markers still count.
            globalProductShellShellSelectorCount: Array.from(document.querySelectorAll("[data-storybook-shell-authority], [data-storybook-product-shell-skin], [data-package-backed-product-shell-boundary], [data-product-shell-region='side-navigation'], .tcrn-product-shell__sidebar, .tcrn-product-shell__main"))
              .filter((node) => !node.closest(".story-body") && node !== shell && node !== docMain)
              .length
          };
        }, { localeTriggerSelector, localeMenuSelector });
        const routeFailures = [];
        if (openReadback.expanded !== "true" || openReadback.menuHidden !== false) {
          routeFailures.push(`locale-menu-open-state:${JSON.stringify(openReadback)}`);
        }
        if (closeReadback.expanded !== "false") routeFailures.push(`aria-expanded-after-escape:${closeReadback.expanded}`);
        if (closeReadback.menuHidden !== true) routeFailures.push(`menu-hidden-after-escape:${closeReadback.menuHidden}`);
        if (!closeReadback.activeIsLocaleTrigger) routeFailures.push(`focus-after-escape:${closeReadback.activeTag ?? "missing"}#${closeReadback.activeId ?? ""}`);
        if (closeReadback.dismissalContract !== "selection-outside-pointer-escape-focus-return") routeFailures.push(`dismissal-contract:${closeReadback.dismissalContract}`);
        if (closeReadback.shellAuthority !== "online-docs") routeFailures.push(`doc-shell-authority:${closeReadback.shellAuthority}`);
        if (closeReadback.globalProductShellShellSelectorCount !== 0) routeFailures.push(`global-product-shell-shell-selectors:${closeReadback.globalProductShellShellSelectorCount}`);
        if (routeFailures.length > 0) {
          failures.push({ route: route.id, failures: routeFailures });
        }
        readbacks.push({
          ...route,
          openReadback,
          closeReadback,
          ok: routeFailures.length === 0,
          failures: routeFailures
        });
      } finally {
        await browser.close();
      }
    }
    return {
      ok: failures.length === 0,
      failures,
      readbacks
    };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

async function main() {
  const focusComparatorSelfCheck = runFocusComparatorSelfCheck();
  if (!focusComparatorSelfCheck.ok) {
    console.log(JSON.stringify({ ok: false, focusComparatorSelfCheck }, null, 2));
    process.exitCode = 1;
    return;
  }
  const productShellComparatorProof = await runProductShellComparatorProof().catch((error) => ({
    ok: false,
    failures: [`product-shell-comparator-proof-error:${error instanceof Error ? error.message : String(error)}`],
    contract: productShellComparatorContract
  }));
  const designSystemVisualInstanceParityReadback = await runProductShellComparatorProof(aosFrontendShellVisualInstanceContract).catch((error) => ({
    ok: false,
    failures: [`aos-frontend-shell-visual-instance-proof-error:${error instanceof Error ? error.message : String(error)}`],
    contract: aosFrontendShellVisualInstanceContract
  }));
  const ownerQualityProductShellProof = await runProductShellComparatorProof(aosOwnerQualityProductShellContract).catch((error) => ({
    ok: false,
    failures: [`owner-quality-product-shell-proof-error:${error instanceof Error ? error.message : String(error)}`],
    contract: aosOwnerQualityProductShellContract
  }));
  const changelogI18nReadabilityProof = await runChangelogI18nReadabilityProof().catch((error) => ({
    ok: false,
    failures: [`changelog-i18n-readability-proof-error:${error instanceof Error ? error.message : String(error)}`]
  }));
  const globalStorybookZhCnIaProof = await runGlobalStorybookZhCnIaProof().catch((error) => ({
    ok: false,
    failures: [`global-storybook-zh-cn-ia-proof-error:${error instanceof Error ? error.message : String(error)}`]
  }));
  const crossSectionShellParityProof = await runCrossSectionShellParityProof().catch((error) => ({
    ok: false,
    failures: [`cross-section-shell-parity-proof-error:${error instanceof Error ? error.message : String(error)}`]
  }));
  const localeMenuFocusReturnProof = await runLocaleMenuFocusReturnProof().catch((error) => ({
    ok: false,
    failures: [`locale-menu-focus-return-proof-error:${error instanceof Error ? error.message : String(error)}`]
  }));
  // Category-story-count budget gate (TCRN-DS-STORY-052). `contract` is already read at module
  // scope; this is additive. The category cap is a preventive ceiling that is green today.
  // Failures are pushed into `missing` (which folds into `ok`) so they surface in the existing
  // stdout list, and asserted explicitly below so the intent stays legible.
  const categoryStoryCountBudget = evaluateBudget({
    label: "category-story-count",
    items: (contract.coveredStorybookSections ?? []).flatMap((section) =>
      (section.categories ?? []).map((category) => ({
        id: `${section.section}/${category.id}`,
        measure: (category.storyIds ?? []).length
      }))),
    budget: CATEGORY_STORY_COUNT_CAP,
    allowlist: CATEGORY_STORY_COUNT_GRACE_ALLOWLIST
  });
  for (const violation of categoryStoryCountBudget.unbudgetedViolations) {
    missing.push(`category-count-budget:${violation.id}:${violation.measure}>${violation.budget}`);
  }
  for (const stale of categoryStoryCountBudget.staleAllowlist) {
    missing.push(`stale-category-count-allowlist:${stale.id}:${stale.reason}`);
  }
  const ok = focusComparatorSelfCheck.ok
    && missing.length === 0
    && forbiddenPositiveHits.length === 0
    && storybookPreviewExists
    && productShellComparatorProof.ok
    && designSystemVisualInstanceParityReadback.ok
    && ownerQualityProductShellProof.ok
    && changelogI18nReadabilityProof.ok
    && globalStorybookZhCnIaProof.ok
    && crossSectionShellParityProof.ok
    && localeMenuFocusReturnProof.ok
    && categoryStoryCountBudget.ok;
  console.log(JSON.stringify({
    ok,
    focusComparatorSelfCheck,
    missing,
    forbiddenPositiveHits,
    storybookPreviewExists,
    pages: pagesByGroup,
	    productShellComparatorProof,
	    designSystemVisualInstanceParityReadback,
	    ownerQualityProductShellProof,
	    changelogI18nReadabilityProof,
	    globalStorybookZhCnIaProof,
	    crossSectionShellParityProof,
	    localeMenuFocusReturnProof,
	    categoryStoryCountBudget
	  }, null, 2));
  // TCRN-DS-SUB-082 (R2-22): set the exit code instead of exiting at once. process.exit() ended the
  // process while stdout still held unwritten bytes, so the report above was cut off when piped
  // (the R1 log stopped at 65,750 B, in the middle of an object). Node now drains stdout first.
  if (!ok) {
    process.exitCode = 1;
  }
}

await main();
