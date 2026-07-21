import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join } from "node:path";
import { chromium } from "@playwright/test";

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
const requiredStories = [
  { id: "welcome-governance", group: "Welcome" },
  { id: "governance-boundaries", group: "Welcome" },
  { id: "maintainers-routing", group: "Welcome" },
  { id: "contribution-model", group: "Welcome" },
  { id: "release-bug-policy", group: "Welcome" },
  { id: "brand-identity", group: "Style Guide" },
  { id: "color-palette", group: "Style Guide" },
  { id: "text-styles", group: "Style Guide" },
  { id: "grid-system", group: "Style Guide" },
  { id: "icons-motion", group: "Style Guide" },
  { id: "global-states", group: "Style Guide" },
  { id: "copy-creation-rules", group: "Style Guide" },
  { id: "tokens-copy-state", group: "Foundations" },
  { id: "i18n-theme-contract", group: "Foundations" },
  { id: "foundation-visual-standards", group: "Foundations" },
  { id: "copy-guidelines", group: "Foundations" },
  { id: "component-family-index", group: "Components" },
  { id: "display-primitives-spec", group: "Components" },
  { id: "interaction-disclosure-spec", group: "Components" },
  { id: "button-spec-usage", group: "Components" },
  { id: "field-spec-usage", group: "Components" },
  { id: "navigation-shell-spec", group: "Components" },
  { id: "aos-frontend-shell-slice", group: "Components" },
  { id: "aos-owner-quality-product-shell", group: "Components" },
  { id: "dialog-spec-usage", group: "Components" },
  { id: "table-work-index-spec", group: "Components" },
  { id: "work-management-components-spec", group: "Components" },
  { id: "knowledge-management-components-spec", group: "Components" },
  { id: "forms-patterns", group: "Patterns" },
  { id: "workbench-patterns", group: "Patterns" },
  { id: "work-management-patterns", group: "Patterns" },
  { id: "readiness-notification-patterns", group: "Patterns" },
  { id: "selection-list-patterns", group: "Patterns" },
  { id: "modal-validation-patterns", group: "Patterns" },
  { id: "datagrid-fields-patterns", group: "Patterns" },
  { id: "big-list-search-patterns", group: "Patterns" },
  { id: "dashboard-page-templates", group: "Patterns" },
  { id: "proof-matrix", group: "Proof" },
  { id: "ai-consumption-contract", group: "Proof" },
  { id: "blocked-actions", group: "Proof" },
  { id: "overlay-focus", group: "Proof" },
  { id: "local-changelog", group: "Change Log" }
];
const pages = Object.fromEntries(Object.entries(pagesByGroup).map(([group, file]) => [
  group,
  readFileSync(`apps/storybook/storybook-static/${file}`, "utf8")
]));
const combinedHtml = Object.values(pages).join("\n");
const readDocShellNavHtml = (html) => {
  const start = html.indexOf('class="tcrn-doc-nav"');
  if (start === -1) {
    return "";
  }
  const asideStart = html.lastIndexOf("<aside", start);
  const end = html.indexOf("</nav>", start);
  if (asideStart === -1 || end === -1) {
    return "";
  }
  return html.slice(asideStart, end + "</nav>".length);
};
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
const expectedStoryCategoryCount = 19;
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
  themeToggleRadiusPx: storybookDocShellVisualOracleContract.shellMetrics?.themeToggleRadiusPx ?? null
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
const productShellComparatorContract = {
  styleSource: "@tcrn/ui-react/tcrnComponentCss",
  storyId: "navigation-shell-spec",
  page: "components.html#navigation-shell-spec",
  scopedSelector: ".tcrn-product-shell-contract-proof .tcrn-product-shell",
  componentSelectors: {
    productLogo: ".tcrn-product-logo",
    themeToggle: ".tcrn-shell-theme-toggle",
    localeTrigger: ".tcrn-shell-locale-menu__trigger",
    sideNavToggle: ".tcrn-shell-side-nav-toggle",
    searchWrapper: ".tcrn-product-shell-search",
    searchInput: ".tcrn-search-input",
    searchControl: ".tcrn-search-input__control",
    searchShortcut: ".tcrn-search-input__shortcut",
    searchResults: ".tcrn-product-shell-search__results",
    utilityRow: ".tcrn-product-shell__utility-row",
    currentLocation: ".tcrn-product-shell__current-location",
    selectedNavItem: ".tcrn-nav-item[data-selected=\"true\"], .tcrn-nav-item[aria-current=\"page\"]",
    localeChevron: ".tcrn-shell-locale-menu__chevron",
    topBar: ".tcrn-top-bar",
    sideNavRegion: ".tcrn-product-shell__sidebar",
    contentRegion: "[data-product-shell-region=\"content\"]",
    contentStack: ".tcrn-product-shell-content-stack",
    sectionGrid: ".tcrn-product-shell-section-grid"
  },
  expectedControlOrder: ["currentLocation", "searchWrapper", "themeToggle", "localeTrigger"],
  expectedControlMetrics: {
    themeToggle: {
      width: 36,
      height: 36,
      radius: 999,
      backgroundRequired: true,
      fontSize: "13px",
      fontWeight: "700",
      lineHeight: "17.55px",
      transitionPropertyIncludes: ["background-color", "border-color", "color", "box-shadow"],
      transitionDurationIncludes: "0.16s",
      transitionTimingFunctionIncludes: "cubic-bezier(0.23, 1, 0.32, 1)",
      focus: { outlineWidth: "3px", outlineStyle: "solid", outlineOffset: "2px", boxShadow: "none" }
    },
    sideNavToggle: {
      width: 38,
      height: 38,
      radius: 5,
      backgroundRequired: true,
      fontSize: "13px",
      fontWeight: "700",
      lineHeight: "17.55px",
      iconCenterDeltaMax: 1,
      transitionPropertyIncludes: ["background-color", "border-color", "color", "box-shadow"],
      transitionDurationIncludes: "0.16s",
      transitionTimingFunctionIncludes: "cubic-bezier(0.23, 1, 0.32, 1)",
      focus: { outlineWidth: "3px", outlineStyle: "solid", outlineOffset: "2px", boxShadow: "none" }
    },
    localeTrigger: {
      minHeight: 36,
      radius: 999,
      backgroundRequired: true,
      fontSize: "13px",
      fontWeight: "700",
      lineHeight: "17.55px",
      letterSpacing: "normal",
      transitionPropertyIncludes: ["background-color", "border-color", "color", "box-shadow"],
      transitionDurationIncludes: "0.16s",
      transitionTimingFunctionIncludes: "cubic-bezier(0.23, 1, 0.32, 1)",
      focus: { outlineWidth: "3px", outlineStyle: "solid", outlineOffset: "2px", boxShadow: "none" }
    },
    searchInput: {
      minHeight: 38,
      radius: 5,
      minWidth: 220,
      backgroundRequired: true,
      fontSize: "13px",
      lineHeight: "17.55px",
      gap: "8px",
      focus: { outlineWidth: "3px", outlineStyle: "solid", outlineOffset: "2px", boxShadow: "none" }
    },
    searchControl: {
      fontSize: "13px",
      fontWeight: "400",
      lineHeight: "17.55px",
      letterSpacing: "normal",
      focus: { outlineWidth: "0px", outlineStyle: "none", outlineOffset: "0px", boxShadow: "none" }
    },
    searchShortcut: {
      position: "static",
      fontFamilyIncludes: "Inter",
      fontSize: "11px",
      fontWeight: "700",
      lineHeight: "14.85px",
      letterSpacing: "normal",
      paddingLeft: "6px",
      paddingRight: "6px"
    },
    currentLocation: { fontSize: "11px", lineHeight: "14.85px", letterSpacing: "normal" },
    selectedNavItem: { backgroundRequired: true, fontSize: "13px", lineHeight: "17.55px", boxShadow: "none" },
    topBar: {
      minHeight: 68,
      borderRadius: "0px",
      borderStyle: "none none solid",
      borderWidth: "0px 0px 1px",
      backgroundColor: "color(srgb 1 1 1 / 0.95)",
      display: "grid",
      gap: "16px",
      paddingLeft: "20px",
      paddingRight: "20px",
      justifyContent: "stretch",
      gridColumnCount: 1
    }
  },
  motionProof: {
    productShellTransition: "grid-template-columns",
    productShellTransitionDuration: "0.22s",
    productShellTransitionTimingFunctionIncludes: "cubic-bezier(0.32, 0.72, 0, 1)",
    searchTransition: "width",
    searchTransitionProperties: ["flex-basis", "width", "max-width"],
    searchTransitionDuration: "0.24s",
    searchTransitionTimingFunctionIncludes: "cubic-bezier(0.32, 0.72, 0, 1)",
    searchMotionTimeline: {
      sampleTimesMs: [0, 60, 120, 180, 240, 300],
      minIntermediateSamples: 2,
      // What this guards is that the surface *animated* rather than jumped. It is
      // not a statement about curve shape, and it used to be read as one: the v1
      // threshold sat at 75% of the duration, which silently assumed a curve that
      // spreads travel evenly. The v2 drawer curve deliberately front-loads —
      // measured, it is 78% travelled at 25% of the duration and 98% at 65% — which
      // is exactly why it reads as responsive. Holding it to the old threshold would
      // have been the oracle enforcing a design decision the ruling reversed. The
      // floor below still catches a real jump (final value at the first sample), and
      // minIntermediateSamples above still proves genuine in-between frames.
      finalFrameEarliestMs: 50,
      endpointTolerancePx: 2
    },
    localeChevronTransition: "transform",
    localeChevronTransitionDuration: "0.22s",
    themeWashPseudo: "tcrn-product-shell-theme-wash",
    themeWashAnimationDuration: "0.22s",
    themeWashAnimationTimingFunctionIncludes: "cubic-bezier(0.32, 0.72, 0, 1)",
    reducedMotionFallback: "transition-none"
  }
};
const aosFrontendShellVisualInstanceContract = {
  styleSource: "@tcrn/ui-react/tcrnComponentCss",
  storyId: "aos-frontend-shell-slice",
  page: "components.html#aos-frontend-shell-slice",
  scopedSelector: "[data-storybook-visual-instance=\"aos-frontend-shell-slice\"]",
  componentSelectors: productShellComparatorContract.componentSelectors,
  expectedControlOrder: productShellComparatorContract.expectedControlOrder,
  expectedControlMetrics: {
    themeToggle: productShellComparatorContract.expectedControlMetrics.themeToggle,
    sideNavToggle: productShellComparatorContract.expectedControlMetrics.sideNavToggle,
    localeTrigger: productShellComparatorContract.expectedControlMetrics.localeTrigger,
    searchInput: productShellComparatorContract.expectedControlMetrics.searchInput,
    searchControl: productShellComparatorContract.expectedControlMetrics.searchControl,
    searchShortcut: productShellComparatorContract.expectedControlMetrics.searchShortcut,
    currentLocation: productShellComparatorContract.expectedControlMetrics.currentLocation,
    selectedNavItem: productShellComparatorContract.expectedControlMetrics.selectedNavItem,
    topBar: {
      minHeight: 68,
      borderRadius: "0px",
      borderStyle: "none none solid",
      borderWidth: "0px 0px 1px",
      display: "grid",
      gap: "16px",
      paddingLeft: "20px",
      paddingRight: "20px",
      justifyContent: "stretch",
      gridColumnCount: 1
    }
  },
  motionProof: productShellComparatorContract.motionProof,
  visualInstanceName: "AosFrontendShellSliceVisualInstance",
  packageMapping: [
    "ProductShell",
    "ProductShellSearch",
    "useProductShellController",
    "EnvironmentBanner",
    "InlineAlert",
    "ReadbackPanel",
    "KeyValueList",
    "EvidenceStrip",
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
      selector: "[data-storybook-visual-instance=\"aos-frontend-shell-slice\"][data-visual-instance-variant=\"desktop-light-expanded-cockpit-search-results\"]",
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
      selector: "[data-storybook-visual-instance=\"aos-frontend-shell-slice\"][data-visual-instance-variant=\"desktop-light-expanded-cockpit-search-rest\"]",
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
      selector: "[data-storybook-visual-instance=\"aos-frontend-shell-slice\"][data-visual-instance-variant=\"desktop-dark-expanded-cockpit\"]",
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
      selector: "[data-storybook-visual-instance=\"aos-frontend-shell-slice\"][data-visual-instance-variant=\"desktop-light-collapsed-work\"]",
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
      selector: "[data-storybook-visual-instance=\"aos-frontend-shell-slice\"][data-visual-instance-variant=\"mobile-dark-work-stacked\"]",
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
      selector: "[data-storybook-visual-instance=\"aos-frontend-shell-slice\"][data-visual-instance-variant=\"reduced-motion\"]",
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
    dummyCockpit: "[data-aos-dummy-cockpit=\"true\"]",
    workEntry: "[data-aos-work-module-entry=\"work-module\"]",
    rawSecondaryDisclosure: "[data-raw-json-disclosure=\"secondary\"]",
    registeredBoundary: "[data-aos-registered-module-boundary=\"cockpit-work-only\"]",
    notAccepted: "[data-product-acceptance=\"not-claimed\"]",
    notReleaseReady: "[data-release-readiness=\"not-claimed\"]",
    noLiveDispatch: "[data-live-dispatch=\"not-enabled\"]"
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
  storyId: "aos-owner-quality-product-shell",
  page: "components.html#aos-owner-quality-product-shell",
  scopedSelector: "[data-storybook-visual-instance=\"aos-owner-quality-product-shell\"]",
  componentSelectors: productShellComparatorContract.componentSelectors,
  expectedControlOrder: productShellComparatorContract.expectedControlOrder,
  expectedControlMetrics: {
    themeToggle: productShellComparatorContract.expectedControlMetrics.themeToggle,
    sideNavToggle: productShellComparatorContract.expectedControlMetrics.sideNavToggle,
    localeTrigger: productShellComparatorContract.expectedControlMetrics.localeTrigger,
    searchInput: productShellComparatorContract.expectedControlMetrics.searchInput,
    searchControl: productShellComparatorContract.expectedControlMetrics.searchControl,
    searchShortcut: productShellComparatorContract.expectedControlMetrics.searchShortcut,
    currentLocation: productShellComparatorContract.expectedControlMetrics.currentLocation,
    selectedNavItem: productShellComparatorContract.expectedControlMetrics.selectedNavItem,
    topBar: aosFrontendShellVisualInstanceContract.expectedControlMetrics.topBar
  },
  motionProof: productShellComparatorContract.motionProof,
  searchRestWidth: {
    maxPx: 260,
    expandedMaxPx: 420,
    mobileMaxPx: 320
  },
  ownerQualitySideNavPolicy: {
    expandedOnly: false,
    collapseAffordance: "actionable_toggle",
    expectedAction: "toggle",
    admittedCollapsedVariants: [
      "desktop-light-operations-cockpit-collapsed",
      "desktop-dark-operations-cockpit-collapsed",
      "desktop-light-work-queue-collapsed"
    ],
    mobilePolicy: "hidden_affordance_until_mobile_collapsed_owner_quality_variant_admission",
    iconCenterDeltaMaxPx: 1,
    railWidthPx: 92
  },
  noOverflowProof: true,
  controlBoundsProof: {
    controls: ["searchWrapper", "searchInput", "localeTrigger", "themeToggle"],
    containers: ["topBar", "shell", "viewport"]
  },
  visualInstanceName: "AosOwnerQualityProductShell",
  packageMapping: [
    "ProductShell",
    "ProductShellSearch",
    "useProductShellController",
    "ProductLogo",
    "tcrnProductLogoRegistry",
    "Surface",
    "WorkIndex",
    "TableShell",
    "KeyValueList",
    "StatusBadge",
    "Badge",
    "EvidenceStrip",
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
      selector: "[data-storybook-visual-instance=\"aos-owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-light-operations-cockpit\"]",
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
      selector: "[data-storybook-visual-instance=\"aos-owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-light-operations-cockpit-collapsed\"]",
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
      selector: "[data-storybook-visual-instance=\"aos-owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-dark-operations-cockpit\"]",
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
      selector: "[data-storybook-visual-instance=\"aos-owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-dark-operations-cockpit-collapsed\"]",
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
      selector: "[data-storybook-visual-instance=\"aos-owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-light-work-queue\"]",
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
      selector: "[data-storybook-visual-instance=\"aos-owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-light-work-queue-collapsed\"]",
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
      selector: "[data-storybook-visual-instance=\"aos-owner-quality-product-shell\"][data-visual-instance-variant=\"mobile-dark-zh-cn-work-queue\"]",
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
      selector: "[data-storybook-visual-instance=\"aos-owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-light-operations-search-results\"]",
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
      selector: "[data-storybook-visual-instance=\"aos-owner-quality-product-shell\"][data-visual-instance-variant=\"reduced-motion\"]",
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
const required = [
  "data-doc-shell=\"online-docs\"",
  "class=\"tcrn-doc-header\"",
  "class=\"tcrn-doc-global-bar\"",
  "class=\"tcrn-doc-sidebar\"",
  "class=\"tcrn-doc-nav\"",
  "data-doc-nav-item=\"",
  "data-doc-nav-category-toggle=\"",
  "data-doc-nav-item-active=\"true\"",
  "data-anchor-scroll-controlled=\"true\"",
  "data-shell-control=\"theme-toggle\"",
  "data-shell-control=\"locale-menu\"",
  "data-shell-control=\"side-nav-collapse\"",
  "data-doc-chapter-pager=\"true\"",
  "<link rel=\"icon\" href=\"tcrn-brand-mark.svg\" type=\"image/svg+xml\" />",
  "--tcrn-anchor-scroll-offset: 96px",
  "tcrnStorybookScrollToHash",
  "keepActiveLinkVisible",
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
  "--tcrn-doc-motion-spring: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  "--tcrn-doc-motion-smooth: 0.4s ease",
  "--tcrn-doc-theme-crossfade-duration: 0.4s",
  "::view-transition-old(root)",
  "::view-transition-new(root)",
  "data-theme-switching",
  "tcrn-doc-theme-transition-wash",
  "document.startViewTransition",
  "runFallbackThemeTransition",
  "class=\"tcrn-doc-search-results\"",
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
  "TCRN デザインシステム契約ストーリー",
  "TCRN 디자인 시스템 계약 스토리",
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
  "data-contract-story-id=\"aos-frontend-shell-slice\"",
  "data-contract-story-id=\"aos-owner-quality-product-shell\"",
  "data-registered-product-logo=\"@tcrn/ui-react/ProductLogo\"",
  "data-product-id=\"aos\"",
  "data-product-logo-asset-id=\"tcrn-aos-two-line\"",
  "AI Operation System",
  "data-storybook-visual-instance=\"aos-frontend-shell-slice\"",
  "data-visual-instance-name=\"AosFrontendShellSliceVisualInstance\"",
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
  "data-storybook-visual-instance=\"aos-owner-quality-product-shell\"",
  "data-visual-instance-name=\"AosOwnerQualityProductShell\"",
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
  "Light and dark Storybook shell",
  "Storybook doc shell control contract",
  "Use one circular icon-only button",
  "one whole-page transition",
  "current locale name in that locale",
  "Keep search compact at rest, expand smoothly on focus, and collapse on blur",
  "not as a top-bar human navigation item",
  "Storybook shell controls",
  "single icon theme toggle, native-name locale menu, focus-expanded search, no AI JSON link in the top bar, and one whole-page theme transition",
  "Theme modes",
  "aria-label=\"TCRN brand mark\"",
  "src=\"tcrn-brand-mark.svg\"",
  "Four large rounded diamond tiles use iris blue, violet-blue, aqua, and slate with tight even gaps.",
  "Each point uses a white ring with a same-family inner color that differs from the tile fill.",
  "No red, pink, coral, or orange connector points.",
  "Product adoption, publication, release readiness, product acceptance, and final MVP acceptance are not claimed.",
  "data-anchor-scroll-controlled=\"true\"",
  "tcrn-shell-layer",
  "data-shell-layer=\"mega-menu\"",
  "Top bar, attached side navigation, content column, and chapter navigation stay one shell"
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
  ".tcrn-shell-side-nav-toggle",
  "data-side-nav-action=\"toggle\"",
  "--tcrn-motion-product-shell-search: 240ms var(--tcrn-motion-ease-drawer)",
  "flex-basis: 260px",
  "flex-basis: 420px",
  ".tcrn-product-shell-search[data-search-expanded=\"true\"]",
  ".tcrn-product-shell[data-theme-switching=\"true\"]::after",
  "tcrn-product-shell-theme-wash",
  "@media (prefers-reduced-motion: reduce)"
]) {
  required.push(text);
}
for (const text of [
  "data-work-management-contract=\"package-backed-static\"",
  "data-work-management-patterns=\"static-no-live\"",
  "RelationshipChip",
  "MachineToken",
  "MachineTokenCell",
  "WorkManagementSubnav",
  "WorkPageHeader",
  "WorkViewTabs",
  "WorkQuickFilters",
  "WorkItemRow",
  "WorkList",
  "WorkSplitView",
  "WorkBacklogGroup",
  "WorkBoard",
  "WorkBoardView",
  "WorkDetailLayout",
  "MetadataRail",
  "WorkFieldPanel",
  "KnowledgePageTree",
  "KnowledgeDocumentCanvas",
  "KnowledgeTocRail",
  "KnowledgeInlineCommentList",
  "KnowledgeMetadataRail",
  "KnowledgeAttachmentList",
  "KnowledgeLabelSet",
  "KnowledgeVersionHistory",
  "KnowledgeTemplateGallery",
  "KnowledgeSearchResults",
  "WorkActivityFeed",
  "WorkHierarchy",
  "GatePipeline",
  "GatePipelineCompact",
  "EvidenceAttachmentList",
  "WorkItemInspector",
  "SavedViewToolbar",
  "work_management_static_pattern_receipt",
  "Work Management package exports cover static Initiative/Epic/Story/Task or Work Item/Subtask or Evidence Task presentation",
  "API integration, backend persistence, live Codex dispatch, external queues, runtime data mutation, AOS/TMS product adoption, owner acceptance, release readiness, and package publication are not claimed"
]) {
  required.push(text);
}
for (const relation of ["blocks", "blocked_by", "depends_on", "relates_to", "duplicates", "supersedes", "split_from", "caused_by", "implements", "verifies", "reviews", "refreshes"]) {
  required.push(`data-work-relationship="${relation}"`);
}
const combinedContractText = `${combinedHtml}\n${JSON.stringify(contract)}\n${llmsTxt}`;
const missing = required.filter((text) => !combinedContractText.includes(text));
for (const { label, value } of [
  { label: "generated-static-html", value: combinedHtml },
  { label: "generated-ai-contract-json", value: JSON.stringify(contract) },
  { label: "generated-llms-txt", value: llmsTxt },
  { label: "generated-robots-txt", value: robotsTxt },
  { label: "work-management-story-source", value: readFileSync("apps/storybook/src/contract-stories/story-content.tsx", "utf8") },
  { label: "work-management-package-test-fixture", value: readFileSync("packages/ui-react/src/components/DataDisplay/DataDisplay.test.tsx", "utf8") },
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
const nonComponentHtml = Object.entries(pages)
  .filter(([group]) => group !== "Components")
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
  /class="[^"]*tcrn-product-shell__main/,
  /class="[^"]*tcrn-product-shell-search__results/
]) {
  if (forbiddenGlobalShellPattern.test(nonComponentHtml)) {
    missing.push(`forbidden-global-shell-pattern:${forbiddenGlobalShellPattern.source}`);
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
if (shellControlVisualParityProof?.controlOrder?.join(">") !== productShellComparatorContract.expectedControlOrder.join(">")) {
  missing.push("contract.shellControlVisualParityProof.controlOrder");
}
if (shellControlVisualParityProof?.searchRestWidth?.maxPx !== 260 || shellControlVisualParityProof?.searchRestWidth?.expandedMaxPx !== 420) {
  missing.push("contract.shellControlVisualParityProof.searchRestWidth");
}
if (shellControlVisualParityProof?.searchMotionTimeline?.transitionDuration !== productShellComparatorContract.motionProof.searchTransitionDuration) {
  missing.push("contract.shellControlVisualParityProof.searchMotionTimeline.transitionDuration");
}
if (shellControlVisualParityProof?.searchMotionTimeline?.transitionProperties?.join(">") !== productShellComparatorContract.motionProof.searchTransitionProperties.join(">")) {
  missing.push("contract.shellControlVisualParityProof.searchMotionTimeline.transitionProperties");
}
if (!String(shellControlVisualParityProof?.ownerQualitySideNavCollapsePolicy ?? "").includes("actionable")) {
  missing.push("contract.shellControlVisualParityProof.ownerQualitySideNavCollapsePolicy");
}
if (!contract.productLogoRegistry?.some?.((logo) => logo.productId === "aos" && logo.assetId === "tcrn-aos-two-line" && logo.lineTwo === "AI Operation System")) {
  missing.push("contract.productLogoRegistry:aos");
}
if (!contract.productLogoRegistry?.some?.((logo) => logo.productId === "tms" && logo.assetId === "tcrn-tms-two-line" && logo.lineTwo === "Talent Management System")) {
  missing.push("contract.productLogoRegistry:tms");
}
const aosVisualInstanceOracle = contract.visualInstanceOracles?.find?.((entry) => entry.id === "aos-frontend-shell-slice");
if (!aosVisualInstanceOracle) {
  missing.push("contract.visualInstanceOracles:aos-frontend-shell-slice");
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
const ownerQualityVisualInstanceOracle = contract.visualInstanceOracles?.find?.((entry) => entry.id === "aos-owner-quality-product-shell");
if (!ownerQualityVisualInstanceOracle) {
  missing.push("contract.visualInstanceOracles:aos-owner-quality-product-shell");
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
  if (ownerQualityVisualInstanceOracle.replacesOwnerQualityTarget !== "aos-frontend-shell-slice") {
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
  if (!ownerQualityVisualInstanceOracle.ownerQualityAcceptanceCriteria?.join(" ")?.includes("AOS Operations Cockpit")) {
    missing.push("contract.visualInstanceOracles.ownerQuality.ownerQualityAcceptanceCriteria");
  }
  if (!ownerQualityVisualInstanceOracle.ownerQualityAcceptanceCriteria?.join(" ")?.includes("registered TCRN AOS product identity")) {
    missing.push("contract.visualInstanceOracles.ownerQuality.registeredTcrnAosIdentityCriteria");
  }
  if (ownerQualityVisualInstanceOracle.ownerQualityAcceptanceCriteria?.join(" ")?.includes("AOS Rebuild Workspace")) {
    missing.push("contract.visualInstanceOracles.ownerQuality.staleAosRebuildWorkspaceCriteria");
  }
  if (!ownerQualityVisualInstanceOracle.rejectCriteria?.join(" ")?.includes("Dummy Cockpit")) {
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
  for (const variant of aosOwnerQualityProductShellContract.ownerQualitySideNavPolicy.admittedCollapsedVariants) {
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
if (contract.workManagementStaticAuthority?.disposition !== "static_contract_authority_explicit_and_smoke_proven") {
  missing.push("contract.workManagementStaticAuthority.disposition");
}
if (!String(contract.workManagementStaticAuthority?.managerRuntimeCoverageDisposition ?? "").includes("static contract story ids are the authoritative")) {
  missing.push("contract.workManagementStaticAuthority.managerRuntimeCoverageDisposition");
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
if (contract.storybookDocShellVisualOracle?.oracleRecoveryReceipt !== "TCRN Workflow/vault/initiatives/projects/TCRN-DESIGN-SYSTEM/active/storybook-shell-control-stabilization/50-implementation-plan.md#storybook-original-shell-restoration-implementation-plan") {
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
  && item.sha256 === "d9b5fdcd59f1baf9819bde3ae35761acde0cfb62ce28a17af2c4acbfd667f953"
))) {
  missing.push("contract.storybookDocShellVisualOracle.metricEvidence.desktopSidebarWidthPx");
}
if (contract.storybookDocShellVisualOracle?.shellMetrics?.desktopSidebarWidthPx !== 288) {
  missing.push("contract.storybookDocShellVisualOracle.shellMetrics.desktopSidebarWidthPx");
}
if (contract.storybookDocShellVisualOracle?.shellMetrics?.desktopSidebarMinWidthPx !== 280) {
  missing.push("contract.storybookDocShellVisualOracle.shellMetrics.desktopSidebarMinWidthPx");
}
if (contract.storybookDocShellVisualOracle?.shellMetrics?.desktopSidebarMaxWidthPx !== 360) {
  missing.push("contract.storybookDocShellVisualOracle.shellMetrics.desktopSidebarMaxWidthPx");
}
if (contract.storybookDocShellVisualOracle?.shellMetrics?.desktopTopbarHeightPx !== 96) {
  missing.push("contract.storybookDocShellVisualOracle.shellMetrics.desktopTopbarHeightPx");
}
if (contract.storybookDocShellVisualOracle?.shellMetrics?.searchRestWidthPx !== 260) {
  missing.push("contract.storybookDocShellVisualOracle.shellMetrics.searchRestWidthPx");
}
if (contract.storybookDocShellVisualOracle?.shellMetrics?.searchExpandedWidthPx !== 360) {
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
if (!String(contract.visualFitControlContract?.workLayoutDensity?.authority ?? "").includes("Work Management exports")) {
  missing.push("contract.visualFitControlContract.workLayoutDensity.authority");
}
if (!contract.visualFitControlContract?.workLayoutDensity?.packageExports?.includes?.("WorkItemRow")
  || !contract.visualFitControlContract?.workLayoutDensity?.packageExports?.includes?.("WorkDetailLayout")
  || !contract.visualFitControlContract?.workLayoutDensity?.packageExports?.includes?.("MachineTokenCell")) {
  missing.push("contract.visualFitControlContract.workLayoutDensity.packageExports");
}
if (contract.consumerVisualStyleContract?.id !== "consumer-visual-style-contract-v1") {
  missing.push("contract.consumerVisualStyleContract.id");
}
if (!contract.consumerVisualStyleContract?.forbiddenConsumerOverrides?.includes?.("consumer-local ProductShell/search/theme/locale/sidebar clones")) {
  missing.push("contract.consumerVisualStyleContract.forbiddenConsumerOverrides.productShellClones");
}
if (!String(contract.consumerVisualStyleContract?.forbiddenConsumerOverrides?.join(" ") ?? "").includes("consumer-local Work page header")) {
  missing.push("contract.consumerVisualStyleContract.forbiddenConsumerOverrides.workLayoutClones");
}
if (!contract.consumerVisualStyleContract?.requiredReadbackFields?.includes?.("foundationVisualStandards")) {
  missing.push("contract.consumerVisualStyleContract.requiredReadbackFields.foundationVisualStandards");
}
if (!llmsTxt.includes("Agents must read ai-consumption-contract.json before implementation work.")) {
  missing.push("llms-first-read-requirement");
}
if (!llmsTxt.includes("Required readback fields: contractVersion, contractPayloadDigest, artifact, route, readAt, coveredRules, foundationVisualStandards, consumerVisualStyleContract, requiredProof, noOverclaimBoundaries, coveredStorybookSections")) {
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
if (!llmsTxt.includes("Work Management authority: static_contract_authority_explicit_and_smoke_proven")) {
  missing.push("llms-work-management-static-authority");
}
if (!llmsTxt.includes("Foundation visual standards: foundation-visual-standards-v1")) {
  missing.push("llms-foundation-visual-standards");
}
if (!llmsTxt.includes("Consumer visual style contract: consumer-visual-style-contract-v1")) {
  missing.push("llms-consumer-visual-style-contract");
}
if (!llmsTxt.includes("Storybook doc shell visual oracle: original-storybook-doc-shell-v1")) {
  missing.push("llms-storybook-doc-shell-visual-oracle");
}
if (!llmsTxt.includes("oracle recovery: TCRN Workflow/vault/initiatives/projects/TCRN-DESIGN-SYSTEM/active/storybook-shell-control-stabilization/50-implementation-plan.md#storybook-original-shell-restoration-implementation-plan")) {
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
  if (!defaultStory || !new RegExp(`data-doc-nav-item="${defaultStory.id}"[^>]*aria-current="location"`).test(navHtml)) {
    missing.push(`current-doc-nav-item:${group}:${defaultStory?.id ?? "missing"}`);
  }
  const groupNavCount = navHtml.match(/data-doc-nav-group="/g)?.length ?? 0;
  if (groupNavCount !== expectedStorybookShellNavGroupCount) {
    missing.push(`doc-shell-nav-group-count:${group}:${groupNavCount}`);
  }
  const categoryNavCount = navHtml.match(/data-doc-nav-category="/g)?.length ?? 0;
  if (categoryNavCount !== expectedStoryCategoryCount) {
    missing.push(`doc-shell-category-count:${group}:${categoryNavCount}`);
  }
  for (const marker of [
    "data-doc-on-this-page=\"true\"",
    "data-mandatory-boundary-block=\"visible\"",
    "data-no-overclaim-boundary=\"visible\"",
    "data-governance-boundary-strip=\"visible\""
  ]) {
    if (!html.includes(marker)) {
      missing.push(`${group}:${marker}`);
    }
  }
  const storyNavCount = navHtml.match(/data-doc-nav-item="/g)?.length ?? 0;
  if (storyNavCount !== requiredStories.length) {
    missing.push(`doc-shell-story-count:${group}:${storyNavCount}`);
  }
  const currentStoryNavCount = navHtml.match(/<a [^>]*data-doc-nav-item="[^"]+"[^>]*data-doc-nav-item-active="true"/g)?.length ?? 0;
  if (currentStoryNavCount !== 1) {
    missing.push(`doc-shell-current-story-count:${group}:${currentStoryNavCount}`);
  }
  const ariaCurrentStoryCount = navHtml.match(/<a [^>]*data-doc-nav-item="[^"]+"[^>]*aria-current="location"/g)?.length ?? 0;
  if (ariaCurrentStoryCount !== 1) {
    missing.push(`doc-shell-current-story-aria-count:${group}:${ariaCurrentStoryCount}`);
  }
  const sectionCount = html.match(/data-story-section="/g)?.length ?? 0;
  if (sectionCount !== 1) {
    missing.push(`single-section-page:${group}:${sectionCount}`);
  }
}
for (const story of requiredStories) {
  if (!pages[story.group].includes(`data-story-id="${story.id}"`)) {
    missing.push(`owning-page-story:${story.group}:${story.id}`);
  }
  const owningPageStory = new RegExp(`data-story-id="${story.id}"[^>]*data-story-category="[^"]+"[^>]*data-story-source-path="apps/storybook/src/contract-stories/story-content\\.tsx"`);
  if (!owningPageStory.test(pages[story.group])) {
    missing.push(`owning-page-story-governance-metadata:${story.group}:${story.id}`);
  }
  for (const html of Object.values(pages)) {
    if (!html.includes(`data-doc-nav-item="${story.id}"`)) {
      missing.push(`missing-doc-nav-item:${story.id}`);
    }
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
  if (expected.backgroundColor !== undefined && metric.backgroundColor !== expected.backgroundColor) {
    failures.push(`${name}:background:${metric.backgroundColor}`);
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
  for (const property of ["fontSize", "fontWeight", "lineHeight", "letterSpacing", "boxShadow"]) {
    if (expected[property] !== undefined && metric[property] !== expected[property]) {
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
    for (const [property, expectedValue] of Object.entries(expected.focus)) {
      if (metric.focus?.[property] !== expectedValue) {
        failures.push(`${name}:focus-${property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}:${metric.focus?.[property] ?? "missing"}`);
      }
    }
  }
  if (metric.borderStyle === "outset") {
    failures.push(`${name}:default-browser-border-style`);
  }
  if (expected.backgroundRequired === true && (metric.backgroundColor === "rgba(0, 0, 0, 0)" || metric.backgroundColor === "transparent")) {
    failures.push(`${name}:transparent-background`);
  }
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

function validateSearchMotionTimeline({ failures, label, proof, contract }) {
  const expected = contract.motionProof.searchMotionTimeline;
  const timeline = proof.searchMotionTimeline;
  if (!timeline || timeline.missing) {
    failures.push(`${label}:search-motion-timeline-missing`);
    return;
  }
  for (const property of contract.motionProof.searchTransitionProperties ?? [contract.motionProof.searchTransition]) {
    if (!transitionIncludes(timeline.expand.motion, property) || !transitionIncludes(timeline.collapse.motion, property)) {
      failures.push(`${label}:search-motion-transition-property:${property}:${timeline.expand.motion.transitionProperty}/${timeline.collapse.motion.transitionProperty}`);
    }
  }
  const expectedDurationMs = maxCssDurationMs(contract.motionProof.searchTransitionDuration);
  for (const phase of ["expand", "collapse"]) {
    const phaseTimeline = timeline[phase];
    const durationMs = maxCssDurationMs(phaseTimeline.motion.transitionDuration);
    if (Math.abs(durationMs - expectedDurationMs) > 1) {
      failures.push(`${label}:search-motion-${phase}-duration:${phaseTimeline.motion.transitionDuration}`);
    }
    if (!String(phaseTimeline.motion.transitionTimingFunction).includes(contract.motionProof.searchTransitionTimingFunctionIncludes)) {
      failures.push(`${label}:search-motion-${phase}-timing:${phaseTimeline.motion.transitionTimingFunction}`);
    }
    const samples = phaseTimeline.samples ?? [];
    const start = samples[0]?.width;
    const end = samples[samples.length - 1]?.width;
    if (!Number.isFinite(start) || !Number.isFinite(end) || Math.abs(end - start) < 8) {
      failures.push(`${label}:search-motion-${phase}-insufficient-width-delta:${start}->${end}`);
      continue;
    }
    const direction = end > start ? 1 : -1;
    const low = Math.min(start, end) + expected.endpointTolerancePx;
    const high = Math.max(start, end) - expected.endpointTolerancePx;
    const intermediateCount = samples.filter((sample) => sample.width > low && sample.width < high).length;
    if (intermediateCount < expected.minIntermediateSamples) {
      failures.push(`${label}:search-motion-${phase}-intermediate-frames:${intermediateCount}`);
    }
    const monotonic = samples.every((sample, index) => {
      if (index === 0) return true;
      const previous = samples[index - 1].width;
      return direction > 0 ? sample.width + 1 >= previous : sample.width - 1 <= previous;
    });
    if (!monotonic) {
      failures.push(`${label}:search-motion-${phase}-non-monotonic`);
    }
    const finalWidth = end;
    const reachedFinal = samples.find((sample) => Math.abs(sample.width - finalWidth) <= expected.endpointTolerancePx);
    if (reachedFinal && reachedFinal.t < expected.finalFrameEarliestMs) {
      failures.push(`${label}:search-motion-${phase}-jumped-to-final:${reachedFinal.t}ms`);
    }
  }
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
    topBar: proof.measured?.topBar,
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

function validateTopbarUtilityAlignment({ failures, label, proof }) {
  const snapshot = proof.topbarAlignmentReadback;
  const measured = proof.measured ?? {};
  const topBar = snapshot?.topBar
    ? { ...snapshot.topBar, paddingLeft: snapshot.paddingLeft, paddingRight: snapshot.paddingRight }
    : measured.topBar;
  const currentLocation = snapshot?.currentLocation ?? measured.currentLocation;
  const search = snapshot?.search ?? measured.searchWrapper;
  const theme = snapshot?.theme ?? measured.themeToggle;
  const locale = snapshot?.locale ?? measured.localeTrigger;
  const required = { topBar, currentLocation, search, theme, locale };
  for (const [name, metric] of Object.entries(required)) {
    if (!metric || metric.missing) {
      failures.push(`${label}:topbar-utility-alignment-missing-${name}`);
      return;
    }
  }

  const leadingTolerance = 4;
  const trailingTolerance = 4;
  const orderTolerance = 1;
  const paddingLeft = parsePixels(topBar.paddingLeft);
  const paddingRight = parsePixels(topBar.paddingRight);
  const currentLocationLeadingGap = currentLocation.left - topBar.left - paddingLeft;
  const utilityTrailingGap = topBar.right - locale.right - paddingRight;
  const searchTrailingGap = topBar.right - search.right - paddingRight;
  const themeTrailingGap = topBar.right - theme.right - paddingRight;
  const searchSharesThemeRow = controlsShareVerticalRow(search, theme);
  const currentLocationSharesSearchRow = controlsShareVerticalRow(currentLocation, search);
  const themeSharesLocaleRow = controlsShareVerticalRow(theme, locale);

  if (Math.abs(currentLocationLeadingGap) > leadingTolerance) {
    failures.push(`${label}:topbar-current-location-leading-gap:${currentLocationLeadingGap.toFixed(2)}:max:${leadingTolerance}`);
  }
  if (Math.abs(utilityTrailingGap) > trailingTolerance) {
    failures.push(`${label}:topbar-utility-trailing-gap:${utilityTrailingGap.toFixed(2)}:max:${trailingTolerance}`);
  }
  if (!searchSharesThemeRow && Math.abs(searchTrailingGap) > trailingTolerance) {
    failures.push(`${label}:topbar-wrapped-search-trailing-gap:${searchTrailingGap.toFixed(2)}:max:${trailingTolerance}`);
  }
  if (!themeSharesLocaleRow && Math.abs(themeTrailingGap) > trailingTolerance) {
    failures.push(`${label}:topbar-wrapped-theme-trailing-gap:${themeTrailingGap.toFixed(2)}:max:${trailingTolerance}`);
  }
  if (currentLocationSharesSearchRow && currentLocation.right > search.left + orderTolerance) {
    failures.push(`${label}:topbar-current-location-overlaps-search:${currentLocation.right.toFixed(2)}>${search.left.toFixed(2)}`);
  }
  if (searchSharesThemeRow && search.right > theme.left + orderTolerance) {
    failures.push(`${label}:topbar-search-overlaps-theme:${search.right.toFixed(2)}>${theme.left.toFixed(2)}`);
  }
  if (themeSharesLocaleRow && theme.right > locale.left + orderTolerance) {
    failures.push(`${label}:topbar-theme-overlaps-locale:${theme.right.toFixed(2)}>${locale.left.toFixed(2)}`);
  }
}

function controlsShareVerticalRow(a, b) {
  const overlap = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  return overlap > 1;
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
    const readTopbarAlignment = () => {
      const topBar = shell.querySelector(".tcrn-top-bar");
      const currentLocation = topBar?.querySelector(".tcrn-product-shell__current-location");
      const search = topBar?.querySelector(".tcrn-product-shell-search");
      const theme = topBar?.querySelector(".tcrn-shell-theme-toggle");
      const locale = topBar?.querySelector(".tcrn-shell-locale-menu__trigger");
      const topBarStyle = topBar ? getComputedStyle(topBar) : null;
      return {
        topBar: readRect(topBar),
        currentLocation: readRect(currentLocation),
        search: readRect(search),
        theme: readRect(theme),
        locale: readRect(locale),
        paddingLeft: topBarStyle?.paddingLeft ?? "0px",
        paddingRight: topBarStyle?.paddingRight ?? "0px"
      };
    };
    const topbarAlignmentReadback = readTopbarAlignment();
    const waitForFocusTransition = () => new Promise((resolve) => window.setTimeout(resolve, 190));
    const measure = async (name, selector) => {
      const element = shell.querySelector(selector);
      if (!element) {
        measured[name] = { missing: true };
        return;
      }
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const focusTarget = element.matches("button, input, a, select, textarea, [tabindex]")
        ? element
        : element.querySelector("button, input, a, select, textarea, [tabindex]");
      const previousActive = document.activeElement;
      let focus = null;
      if (focusTarget instanceof HTMLElement) {
        focusTarget.focus({ preventScroll: true });
        await waitForFocusTransition();
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
    const requiredContent = {};
    for (const [name, selector] of Object.entries(contract.requiredContentSelectors ?? {})) {
      requiredContent[name] = shell.matches(selector) || Boolean(shell.querySelector(selector));
    }
    const topBar = shell.querySelector(".tcrn-top-bar");
    const selectedNavItem = shell.querySelector(".tcrn-nav-item[aria-current=\"page\"]");
    const searchWrapper = shell.querySelector(contract.componentSelectors.searchWrapper);
    const utilityRow = shell.querySelector(contract.componentSelectors.utilityRow);
    const controlOrder = utilityRow
      ? Array.from(utilityRow.children).map((child) => {
          if (child.matches(".tcrn-product-shell__current-location")) return "currentLocation";
          if (child.matches(".tcrn-product-shell-search")) return "searchWrapper";
          if (child.matches(".tcrn-shell-theme-toggle")) return "themeToggle";
          if (child.matches(".tcrn-shell-locale-menu")) return "localeTrigger";
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
      productShellCollapsed: shell.getAttribute("data-product-shell-collapsed"),
      sideNavCollapsed: shell.getAttribute("data-side-nav-collapsed"),
      route: shell.getAttribute("data-visual-instance-route"),
      selectedRoute: selectedNavItem?.getAttribute("data-product-shell-route") ?? null,
      search: shell.getAttribute("data-visual-instance-search"),
      searchExpanded: searchWrapper?.getAttribute("data-search-expanded") ?? null,
      searchResultsVisible: searchWrapper?.getAttribute("data-search-results-visible") ?? null,
      viewport: shell.getAttribute("data-visual-instance-viewport"),
      reducedMotion: shell.getAttribute("data-visual-instance-reduced-motion"),
      content: shell.getAttribute("data-visual-instance-content"),
      ownerVisualAdmissionBoundary: shell.getAttribute("data-visual-instance-disposition")
    };
    const topbarReadback = {
      text: topBar?.textContent?.replace(/\s+/g, " ").trim() ?? "",
      staleWorkspaceTitlePresent: Boolean(topBar?.textContent?.includes("AOS Rebuild Workspace")),
      brandCellPresent: Boolean(topBar?.querySelector(".tcrn-top-bar__brand")),
      moduleCellPresent: Boolean(topBar?.querySelector(".tcrn-top-bar__module"))
    };
    const sampleSearchMotionTimeline = async () => {
      if (!searchWrapper) return { missing: true };
	      const originalExpanded = searchWrapper.getAttribute("data-search-expanded");
	      const originalResultsVisible = searchWrapper.getAttribute("data-search-results-visible");
	      const readWidth = () => Number(searchWrapper.getBoundingClientRect().width.toFixed(3));
	      const readMotion = () => {
	        const style = getComputedStyle(searchWrapper);
	        return {
	          transitionProperty: style.transitionProperty,
	          transitionDuration: style.transitionDuration,
	          transitionTimingFunction: style.transitionTimingFunction
	        };
	      };
	      const settle = () => new Promise((resolve) => window.setTimeout(resolve, 440));
	      const capture = async (name, action) => {
	        const samples = [];
	        const start = performance.now();
	        const read = () => {
	          samples.push({
	            t: Number((performance.now() - start).toFixed(1)),
	            width: readWidth(),
	            expanded: searchWrapper.getAttribute("data-search-expanded")
	          });
	        };
	        read();
	        action();
	        await new Promise((resolve) => {
	          const tick = () => {
	            read();
	            if (performance.now() - start >= 430) {
	              resolve();
              } else {
                requestAnimationFrame(tick);
	            }
	          };
	          requestAnimationFrame(tick);
	        });
	        return { name, motion: readMotion(), samples };
	      };
	      searchWrapper.setAttribute("data-search-expanded", "false");
	      searchWrapper.setAttribute("data-search-results-visible", "false");
	      await settle();
	      const restWidth = readWidth();
	      const expand = await capture("expand", () => {
	        searchWrapper.setAttribute("data-search-expanded", "true");
	        searchWrapper.setAttribute("data-search-results-visible", "false");
	      });
	      await settle();
	      const expandedWidth = readWidth();
	      const collapse = await capture("collapse", () => {
	        searchWrapper.setAttribute("data-search-expanded", "false");
	        searchWrapper.setAttribute("data-search-results-visible", "false");
	      });
	      await settle();
	      if (originalExpanded === null) {
	        searchWrapper.removeAttribute("data-search-expanded");
	      } else {
	        searchWrapper.setAttribute("data-search-expanded", originalExpanded);
	      }
	      if (originalResultsVisible === null) {
	        searchWrapper.removeAttribute("data-search-results-visible");
	      } else {
	        searchWrapper.setAttribute("data-search-results-visible", originalResultsVisible);
	      }
	      return {
	        restWidth,
	        expandedWidth,
	        expand,
	        collapse,
	        restored: {
	          expanded: searchWrapper.getAttribute("data-search-expanded"),
	          resultsVisible: searchWrapper.getAttribute("data-search-results-visible")
	        }
	      };
	    };
	    const searchMotionTimeline = await sampleSearchMotionTimeline();
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
	      searchMotionTimeline,
	      requiredContent,
      controlOrder,
      topbarReadback,
      topbarAlignmentReadback,
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
    validateNoHorizontalOverflow({ failures, label, name: "topbar", metric: proof.measured.topBar });
    if (proof.viewport.scrollWidth > proof.viewport.width + 1) {
      failures.push(`${label}:viewport-horizontal-overflow:${proof.viewport.scrollWidth}>${proof.viewport.width}`);
    }
  }
  if (contract.controlBoundsProof) {
    validateControlBounds({ failures, label, proof, contract });
  }
  if (contract.expectedControlOrder) {
    const expectedOrder = contract.expectedControlOrder.join(">");
    const actualOrder = (proof.controlOrder ?? []).join(">");
    if (actualOrder !== expectedOrder) {
      failures.push(`${label}:control-order:${actualOrder || "missing"}:expected:${expectedOrder}`);
    }
  }
  if (proof.topbarReadback?.staleWorkspaceTitlePresent) {
    failures.push(`${label}:topbar-stale-aos-rebuild-workspace-title`);
  }
  if (proof.topbarReadback?.brandCellPresent || proof.topbarReadback?.moduleCellPresent) {
    failures.push(`${label}:topbar-visible-product-title-cells`);
  }
  if (proof.viewport?.width > 760) {
    validateTopbarUtilityAlignment({ failures, label, proof });
  }
  if (contract.searchRestWidth) {
    const searchWidth = proof.measured.searchWrapper?.width;
    const searchInputWidth = proof.measured.searchInput?.width;
    const maxWidth = expectSearchResults
      ? contract.searchRestWidth.expandedMaxPx
      : proof.viewport.width <= 760
        ? (contract.searchRestWidth.mobileMaxPx ?? contract.searchRestWidth.maxPx)
        : contract.searchRestWidth.maxPx;
    if (typeof searchWidth !== "number" || searchWidth > maxWidth + 1) {
      failures.push(`${label}:search-width:${searchWidth ?? "missing"}:max:${maxWidth}`);
    }
    if (typeof searchInputWidth !== "number" || searchInputWidth > maxWidth + 1) {
      failures.push(`${label}:search-input-width:${searchInputWidth ?? "missing"}:max:${maxWidth}`);
    }
  }
  if (contract.ownerQualitySideNavPolicy?.collapseAffordance === "actionable_toggle") {
    const sideNavToggle = proof.measured.sideNavToggle;
    if (proof.viewport.width <= 760 && contract.ownerQualitySideNavPolicy.mobilePolicy?.includes("hidden")) {
      if (sideNavToggle && !sideNavToggle.missing && sideNavToggle.display !== "none" && sideNavToggle.width > 1) {
        failures.push(`${label}:mobile-side-nav-collapse-affordance-visible:${sideNavToggle.width}`);
      }
    } else {
      if (sideNavToggle?.disabled) {
        failures.push(`${label}:side-nav-collapse-control-disabled`);
      }
      if (sideNavToggle?.ariaDisabled === "true") {
        failures.push(`${label}:side-nav-collapse-aria-disabled:${sideNavToggle?.ariaDisabled}`);
      }
      if (sideNavToggle?.sideNavAction !== contract.ownerQualitySideNavPolicy.expectedAction) {
        failures.push(`${label}:side-nav-action:${sideNavToggle?.sideNavAction ?? "missing"}`);
      }
      if (sideNavToggle?.sideNavKeyboardActivation !== "enter-space") {
        failures.push(`${label}:side-nav-keyboard-activation:${sideNavToggle?.sideNavKeyboardActivation ?? "missing"}`);
      }
      const expectedExpanded = expectedState?.collapsed === "true" ? "false" : "true";
      if (sideNavToggle?.ariaExpanded !== expectedExpanded) {
        failures.push(`${label}:side-nav-aria-expanded:${sideNavToggle?.ariaExpanded ?? "missing"}:expected:${expectedExpanded}`);
      }
      const maxDelta = contract.ownerQualitySideNavPolicy.iconCenterDeltaMaxPx ?? 1;
      if (typeof sideNavToggle?.iconCenterDelta !== "number" || sideNavToggle.iconCenterDelta > maxDelta) {
        failures.push(`${label}:side-nav-icon-center-delta:${sideNavToggle?.iconCenterDelta ?? "missing"}:max:${maxDelta}`);
      }
      if (expectedState?.collapsed === "true") {
        const expectedRailWidth = contract.ownerQualitySideNavPolicy.railWidthPx ?? 92;
        const railWidth = proof.measured.sideNavRegion?.width;
        if (typeof railWidth !== "number" || Math.abs(railWidth - expectedRailWidth) > 1) {
          failures.push(`${label}:side-nav-collapsed-rail-width:${railWidth ?? "missing"}:expected:${expectedRailWidth}`);
        }
      }
    }
  }
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
    if (proof.state?.productShellCollapsed !== expectedState.collapsed) {
      failures.push(`${label}:product-shell-collapsed:${proof.state?.productShellCollapsed ?? "missing"}`);
    }
    if (proof.state?.sideNavCollapsed !== expectedState.collapsed) {
      failures.push(`${label}:side-nav-collapsed:${proof.state?.sideNavCollapsed ?? "missing"}`);
    }
    if (proof.state?.selectedRoute !== expectedState.route) {
      failures.push(`${label}:selected-route:${proof.state?.selectedRoute ?? "missing"}`);
    }
    if (proof.state?.searchExpanded !== expectedState.searchExpanded) {
      failures.push(`${label}:search-expanded:${proof.state?.searchExpanded ?? "missing"}`);
    }
    if (proof.state?.searchResultsVisible !== expectedState.searchResultsVisible) {
      failures.push(`${label}:search-results-visible:${proof.state?.searchResultsVisible ?? "missing"}`);
    }
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
    for (const controlName of ["themeToggle", "sideNavToggle", "localeTrigger", "localeChevron"]) {
      auditReducedMotion(controlName, proof.measured[controlName]);
    }
    auditReducedMotion("search", proof.measured.searchWrapper);
    if (proof.shell.themeWashAnimationName !== "none") {
      failures.push(`${label}:reduced-motion-theme-wash:${proof.shell.themeWashAnimationName}`);
    }
  } else {
    if (!transitionIncludes(proof.shell, contract.motionProof.productShellTransition)) {
      failures.push(`${label}:product-shell-transition:${proof.shell.transitionProperty}`);
    }
    if (proof.shell.transitionDuration !== contract.motionProof.productShellTransitionDuration) {
      failures.push(`${label}:product-shell-transition-duration:${proof.shell.transitionDuration}`);
    }
    if (!String(proof.shell.transitionTimingFunction).includes(contract.motionProof.productShellTransitionTimingFunctionIncludes)) {
      failures.push(`${label}:product-shell-transition-timing:${proof.shell.transitionTimingFunction}`);
    }
    for (const property of contract.motionProof.searchTransitionProperties ?? [contract.motionProof.searchTransition]) {
      if (!transitionIncludes(proof.measured.searchWrapper, property)) {
        failures.push(`${label}:search-transition:${property}:${proof.measured.searchWrapper?.transitionProperty}`);
      }
    }
    if (Math.abs(maxCssDurationMs(proof.measured.searchWrapper?.transitionDuration) - maxCssDurationMs(contract.motionProof.searchTransitionDuration)) > 1) {
      failures.push(`${label}:search-transition-duration:${proof.measured.searchWrapper?.transitionDuration}`);
    }
    if (!String(proof.measured.searchWrapper?.transitionTimingFunction).includes(contract.motionProof.searchTransitionTimingFunctionIncludes)) {
      failures.push(`${label}:search-transition-timing:${proof.measured.searchWrapper?.transitionTimingFunction}`);
    }
    if (validateMetrics) {
      validateSearchMotionTimeline({ failures, label, proof, contract });
    }
    if (!transitionIncludes(proof.measured.localeChevron, contract.motionProof.localeChevronTransition)) {
      failures.push(`${label}:locale-chevron-transition:${proof.measured.localeChevron?.transitionProperty}`);
    }
    if (proof.measured.localeChevron?.transitionDuration !== contract.motionProof.localeChevronTransitionDuration) {
      failures.push(`${label}:locale-chevron-transition-duration:${proof.measured.localeChevron?.transitionDuration}`);
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
  if (expectSearchResults && proof.measured.searchResults?.display === "none") {
    failures.push(`${label}:search-results-not-visible-for-expanded-proof`);
  }
  if (!expectSearchResults && proof.measured.searchResults?.display !== "none") {
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
    const mobileSearchMax = contract.searchRestWidth?.mobileMaxPx;
    if (typeof mobileSearchMax === "number") {
      for (const [controlName, metric] of Object.entries({
        searchWrapper: proof.measured.searchWrapper,
        searchInput: proof.measured.searchInput
      })) {
        if (typeof metric?.width !== "number" || metric.width > mobileSearchMax + 1) {
          failures.push(`${label}:mobile-${controlName}-width:${metric?.width ?? "missing"}:max:${mobileSearchMax}`);
        }
      }
    }
    if (proof.measured.sideNavToggle?.width > 44 || proof.measured.themeToggle?.width > 44) {
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
    validateProductShellReadback({ failures, proof: desktop, contract, label: "desktop", expectSearchResults: true });
    validateProductShellReadback({ failures, proof: reduced, contract, label: "reduced", expectSearchResults: true, validateMetrics: false });
    validateProductShellReadback({ failures, proof: mobile, contract, label: "mobile", expectSearchResults: true, validateMetrics: false });
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
    "Work Management",
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
      await page.waitForSelector("[data-doc-nav-item='local-changelog'][aria-current='location'][data-doc-nav-item-active='true']");
      await page.waitForTimeout(150);
      const metrics = await page.evaluate(({ requiredText, forbiddenText }) => {
        const bodyText = document.body.innerText;
        const html = document.documentElement;
        const body = document.body;
        const compactNodes = Array.from(document.querySelectorAll(
          ".tcrn-changelog-token__value, .tcrn-changelog-record__artifact, .tcrn-changelog-record__boundary"
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
          metadataRoutePreserved: Boolean(document.querySelector("[data-changelog-route-id='route_tcrn_ds_storybook_governance_ilya_implementation_after_plan_reviews_success_a1f19b1a_dded541']")),
          proofArtifactMetadataCount: document.querySelectorAll("[data-changelog-proof-artifact]").length,
          boundaryMetadataCount: document.querySelectorAll("[data-changelog-no-overclaim-boundary]").length,
          compactNodeReadbacks,
          compactNodeFailures: compactNodeReadbacks.filter((item) => item.overflow === "visible"
            || item.textOverflow !== "ellipsis"
            || item.whiteSpace !== "nowrap"
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
    "Work Management",
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
      await page.waitForSelector("[data-doc-nav-item='welcome-governance'][aria-current='location'][data-doc-nav-item-active='true']");
      await page.waitForSelector("[data-doc-nav-group]");
      await page.waitForTimeout(150);
      const metrics = await page.evaluate(({ requiredText, forbiddenText }) => {
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
        const storybookNav = document.querySelector("[data-contract-surface='tcrn-design-system-storybook'] .tcrn-doc-nav");
        const navRoot = storybookNav ?? document;
        const categoryLabels = Array.from(navRoot.querySelectorAll(".tcrn-doc-nav__category-label"))
          .map((node) => node.textContent?.trim() ?? "")
          .filter(Boolean);
        const categoryDescriptions = Array.from(navRoot.querySelectorAll("[data-doc-nav-category-toggle][aria-describedby]"))
          .map((node) => document.getElementById(node.getAttribute("aria-describedby") ?? "")?.textContent?.trim() ?? "")
          .filter(Boolean);
        const currentLocation = document.querySelector(".tcrn-doc-current-location");
	        const onThisPage = document.querySelector(".tcrn-doc-on-this-page");
	        const brandNode = document.querySelector(".tcrn-doc-brand");
	        const brandCaptionNode = brandNode?.querySelector(".tcrn-product-logo__line-two, .tcrn-shell-brand-lockup__caption") ?? null;
	        const pageOverflow = Math.max(html.scrollWidth, body.scrollWidth) > Math.max(html.clientWidth, body.clientWidth) + 1;
	        const localizedTextSurface = [
	          bodyText,
	          currentLocation?.textContent ?? "",
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
          docBrandCaptionLocalized: (brandCaptionNode?.textContent ?? "").includes("组件库") && !(brandNode?.textContent ?? "").includes("Component Library"),
          currentLocationText: currentLocation?.textContent?.replace(/\s+/g, " ").trim() ?? null,
          onThisPageAriaLabel: onThisPage?.getAttribute("aria-label") ?? null
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
    "Work Management",
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
        await page.waitForSelector(`[data-doc-nav-item='${route.storyId}'][aria-current='location'][data-doc-nav-item-active='true']`);
        await page.waitForTimeout(180);
        const metrics = await page.evaluate(({ group, storyId, forbiddenZhCnProductShellText, forbiddenOwnerVisibleCaptionText }) => {
          const rectFor = (selector) => {
            const node = document.querySelector(selector);
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
          const styleFor = (selector, properties) => {
            const node = document.querySelector(selector);
            if (!node) {
              return null;
            }
            const style = window.getComputedStyle(node);
            return Object.fromEntries(properties.map((property) => [property, style.getPropertyValue(property)]));
          };
          const html = document.documentElement;
          const body = document.body;
          const header = rectFor(".tcrn-doc-header");
          const globalBar = rectFor(".tcrn-doc-global-bar");
          const workspace = rectFor(".tcrn-doc-header__workspace");
          const currentLocation = rectFor(".tcrn-doc-current-location");
          const search = rectFor(".tcrn-doc-header-search");
          const controls = rectFor("[data-shell-control='theme-toggle']");
          const themeToggleStyles = styleFor("[data-shell-control='theme-toggle']", ["border-radius"]);
          const locale = rectFor(".tcrn-shell-locale-menu");
	          const pageHead = rectFor("[data-doc-page-head='governed-section']");
	          const shell = document.querySelector("[data-contract-surface]");
          const storybookNav = shell?.querySelector(".tcrn-doc-nav");
          const firstStory = document.querySelector(`[data-contract-story-id='${storyId}']`);
          const activeStory = storybookNav?.querySelector("[data-doc-nav-item][aria-current='location'][data-doc-nav-item-active='true']");
          const categoryLabels = Array.from((storybookNav ?? document).querySelectorAll(".tcrn-doc-nav__category-label"))
            .map((node) => node.textContent?.trim() ?? "")
            .filter(Boolean);
          const currentLocationNode = document.querySelector(".tcrn-doc-current-location");
          const brandNode = document.querySelector(".tcrn-doc-brand");
          const brandCaptionNode = brandNode?.querySelector(".tcrn-product-logo__line-two, .tcrn-shell-brand-lockup__caption") ?? null;
          const searchInput = document.querySelector(".tcrn-search-input__control");
          const searchInputShell = rectFor(".tcrn-search-input");
          const searchInputShellStyles = styleFor(".tcrn-search-input", ["border-color", "border-radius"]);
          const searchControl = rectFor(".tcrn-doc-header-search .tcrn-search-input__control");
          const searchIcon = rectFor(".tcrn-doc-header-search .tcrn-search-input__icon");
          const searchShortcut = rectFor(".tcrn-doc-header-search .tcrn-search-input__shortcut");
          const searchInputGridStyles = styleFor(".tcrn-doc-header-search .tcrn-search-input", ["display", "grid-template-columns", "overflow"]);
          const searchFitFailures = [];
          if (searchInputShell && searchControl && searchIcon && searchShortcut) {
            if (searchControl.width < 84) searchFitFailures.push(`control-width:${searchControl.width}`);
            if (searchIcon.left < searchInputShell.left - 1 || searchIcon.right > searchControl.left + 1) searchFitFailures.push("icon-track-overlap");
            if (searchShortcut.left < searchControl.right - 1 || searchShortcut.right > searchInputShell.right + 1) searchFitFailures.push("shortcut-track-overlap");
          } else {
            searchFitFailures.push("search-track-missing");
          }
          if (searchInputGridStyles?.display !== "grid") searchFitFailures.push(`display:${searchInputGridStyles?.display ?? "missing"}`);
          const sideNavRegion = rectFor(".tcrn-doc-sidebar");
          const docShellTextSurface = [
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
          const sidebarNoIconLabelReadbacks = window.innerWidth >= 900 && shell?.getAttribute("data-sidebar-collapsed") !== "true"
            ? Array.from((storybookNav ?? document).querySelectorAll("[data-doc-nav-item]"))
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
                  route: item.getAttribute("data-doc-nav-item"),
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
          const sidebarNoIconLabelReadabilityFailures = sidebarNoIconLabelReadbacks.filter((item) => !item.ok);
	          const headerBottom = header?.bottom ?? 0;
	          const pageOverflow = Math.max(html.scrollWidth, body.scrollWidth) > Math.max(html.clientWidth, body.clientWidth) + 1;
	          return {
            group,
            storyId,
            url: window.location.pathname + window.location.search + window.location.hash,
            locale: shell?.getAttribute("data-storybook-locale") ?? null,
            activeSection: shell?.getAttribute("data-active-story-section") ?? null,
            activeStoryId: activeStory?.getAttribute("data-doc-nav-item") ?? null,
            scrollY: Number(window.scrollY.toFixed(2)),
            pageOverflow,
            shellAuthority: shell?.getAttribute("data-doc-shell") ?? null,
            docShellSelectorCount: document.querySelectorAll("[data-doc-shell], .tcrn-doc-header, .tcrn-doc-global-bar, .tcrn-doc-header-search, .tcrn-doc-nav, .tcrn-doc-sidebar").length,
            globalProductShellShellSelectorCount: Array.from(document.querySelectorAll("[data-storybook-shell-authority], [data-storybook-product-shell-skin], [data-package-backed-product-shell-boundary], [data-product-shell-region='side-navigation'], .tcrn-product-shell__sidebar, .tcrn-product-shell__main"))
              .filter((node) => !node.closest(".story-body"))
              .length,
            docPageHeadCount: document.querySelectorAll("[data-doc-page-head='governed-section']").length,
            onThisPageCount: document.querySelectorAll("[data-doc-on-this-page='true']").length,
            mandatoryBoundaryCount: document.querySelectorAll("[data-mandatory-boundary-block='visible']").length,
            noOverclaimBoundaryCount: document.querySelectorAll("[data-no-overclaim-boundary='visible']").length,
            legacyProductShellGlobalNavCount: Array.from(document.querySelectorAll("[data-product-shell-region='side-navigation'], [data-product-shell-route]"))
              .filter((node) => !node.closest(".story-body"))
              .length,
          navGroupCount: (storybookNav ?? document).querySelectorAll(".tcrn-doc-nav__group").length,
            categoryLabelCount: categoryLabels.length,
            categoryLabels,
            docBrandText: brandNode?.textContent?.replace(/\s+/g, " ").trim() ?? null,
            docBrandCaptionText: brandCaptionNode?.textContent?.replace(/\s+/g, " ").trim() ?? null,
            docBrandCaptionLocalized: (brandCaptionNode?.textContent ?? "").includes("组件库") && !(brandNode?.textContent ?? "").includes("Component Library"),
            docShellEnglishLeaks,
            ownerVisibleCaptionHits,
            brandIdentityLogoSectionReadback,
            sidebarNoIconLabelReadbacks,
            sidebarNoIconLabelReadabilityFailures,
	            firstStoryTop: firstStory ? Number(firstStory.getBoundingClientRect().top.toFixed(2)) : null,
            pageHead,
            header,
            sideNavRegion,
            globalBar,
            workspace,
            currentLocation,
            search,
            searchInputShell,
            searchInputShellStyles,
            searchControl,
            searchIcon,
            searchShortcut,
            searchInputGridStyles,
            searchFitFailures,
            controls,
            themeToggleRadius: themeToggleStyles?.["border-radius"] ?? null,
            localeControl: locale,
            headerStyles: styleFor(".tcrn-doc-header", ["display", "grid-template-columns", "min-height"]),
            workspaceStyles: styleFor(".tcrn-doc-header__workspace", ["display", "grid-template-columns", "gap", "padding-left", "padding-right"]),
            pageHeadStyles: styleFor("[data-doc-page-head='governed-section']", ["display", "grid-template-columns", "gap", "border-bottom-style"]),
            layoutStyles: styleFor(".tcrn-doc-layout", ["display", "grid-template-columns"]),
            currentLocationBeforeSearch: Boolean(currentLocation && search && currentLocation.right <= search.left + 1),
            searchBeforeControls: Boolean(search && controls && search.right <= controls.left + 1),
            utilityTrailingGap: locale ? Number((window.innerWidth - locale.right).toFixed(2)) : null,
            pageHeadStartsBelowHeader: Boolean(pageHead && pageHead.top >= headerBottom - 1),
            storyStartsAfterPageHead: Boolean(pageHead && firstStory && firstStory.getBoundingClientRect().top >= pageHead.bottom - 1)
          };
        }, { group: route.group, storyId: route.storyId, forbiddenZhCnProductShellText, forbiddenOwnerVisibleCaptionText });
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
          if (!widthWithin(metrics.sideNavRegion?.width, expectedSidebarWidth, expectedStorybookVisualSkin.sidebarTolerancePx)) {
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
          if (metrics.searchInputShellStyles?.["border-color"] !== expectedStorybookVisualSkin.searchBorderColor) {
            routeFailures.push(`storybook-skin-search-border:${metrics.searchInputShellStyles?.["border-color"] ?? "missing"}:expected:${expectedStorybookVisualSkin.searchBorderColor}`);
          }
          if (metrics.searchInputShellStyles?.["border-radius"] !== `${expectedStorybookVisualSkin.searchBorderRadiusPx}px`) {
            routeFailures.push(`storybook-skin-search-radius:${metrics.searchInputShellStyles?.["border-radius"] ?? "missing"}:expected:${expectedStorybookVisualSkin.searchBorderRadiusPx}px`);
          }
          if (!metrics.currentLocationBeforeSearch) routeFailures.push("current-location-not-before-search");
          if (!metrics.searchBeforeControls) routeFailures.push("search-not-before-controls");
          if (typeof metrics.utilityTrailingGap !== "number" || metrics.utilityTrailingGap < 16 || metrics.utilityTrailingGap > 32) {
            routeFailures.push(`utility-trailing-gap:${metrics.utilityTrailingGap}`);
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
        await page.waitForSelector("#tcrn-doc-locale-trigger");
        await page.locator("#tcrn-doc-locale-trigger").click();
        await page.waitForSelector("[data-locale-menu]:not([hidden])");
        const openReadback = await page.evaluate(() => ({
          activeTag: document.activeElement?.tagName?.toLowerCase() ?? null,
          activeId: document.activeElement?.id ?? null,
          expanded: document.querySelector("#tcrn-doc-locale-trigger")?.getAttribute("aria-expanded") ?? null,
          menuHidden: document.querySelector("[data-locale-menu]")?.hasAttribute("hidden") ?? null
        }));
        await page.keyboard.press("Escape");
        await page.waitForFunction(() => document.querySelector("[data-locale-menu]")?.hasAttribute("hidden"));
        await page.waitForFunction(() => document.activeElement?.id === "tcrn-doc-locale-trigger");
        const closeReadback = await page.evaluate(() => ({
          activeTag: document.activeElement?.tagName?.toLowerCase() ?? null,
          activeId: document.activeElement?.id ?? null,
          activeText: (document.activeElement?.textContent ?? "").replace(/\s+/g, " ").trim(),
          expanded: document.querySelector("#tcrn-doc-locale-trigger")?.getAttribute("aria-expanded") ?? null,
          menuHidden: document.querySelector("[data-locale-menu]")?.hasAttribute("hidden") ?? null,
          dismissalContract: document.querySelector("[data-locale-dismissal-contract]")?.getAttribute("data-locale-dismissal-contract") ?? null,
          shellAuthority: document.querySelector("[data-contract-surface]")?.getAttribute("data-doc-shell") ?? null,
          globalProductShellShellSelectorCount: Array.from(document.querySelectorAll("[data-storybook-shell-authority], [data-storybook-product-shell-skin], [data-package-backed-product-shell-boundary], [data-product-shell-region='side-navigation'], .tcrn-product-shell__sidebar, .tcrn-product-shell__main"))
            .filter((node) => !node.closest(".story-body"))
            .length
        }));
        const routeFailures = [];
        if (openReadback.expanded !== "true" || openReadback.menuHidden !== false) {
          routeFailures.push(`locale-menu-open-state:${JSON.stringify(openReadback)}`);
        }
        if (closeReadback.expanded !== "false") routeFailures.push(`aria-expanded-after-escape:${closeReadback.expanded}`);
        if (closeReadback.menuHidden !== true) routeFailures.push(`menu-hidden-after-escape:${closeReadback.menuHidden}`);
        if (closeReadback.activeId !== "tcrn-doc-locale-trigger") routeFailures.push(`focus-after-escape:${closeReadback.activeTag ?? "missing"}#${closeReadback.activeId ?? ""}`);
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
    failures: [`aos-owner-quality-product-shell-proof-error:${error instanceof Error ? error.message : String(error)}`],
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
  const ok = missing.length === 0
    && forbiddenPositiveHits.length === 0
    && storybookPreviewExists
    && productShellComparatorProof.ok
    && designSystemVisualInstanceParityReadback.ok
    && ownerQualityProductShellProof.ok
    && changelogI18nReadabilityProof.ok
    && globalStorybookZhCnIaProof.ok
    && crossSectionShellParityProof.ok
    && localeMenuFocusReturnProof.ok;
  console.log(JSON.stringify({
    ok,
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
	    localeMenuFocusReturnProof
	  }, null, 2));
  if (!ok) {
    process.exit(1);
  }
}

await main();
