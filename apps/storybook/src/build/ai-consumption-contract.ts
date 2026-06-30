export const aiConsumptionContract = {
  contractVersion: "ai_consumption_contract_v1",
  storyId: "ai-consumption-contract",
  route: "proof.html#ai-consumption-contract",
  artifact: "ai-consumption-contract.json",
  mustReadFirst: true,
  discovery: {
    staticArtifact: "apps/storybook/storybook-static/ai-consumption-contract.json",
    hostedArtifact: "https://tcrn-design-system-storybook.vercel.app/ai-consumption-contract.json",
    llmsTxt: "llms.txt",
    robotsTxt: "robots.txt",
    htmlHead: {
      alternateJson: {
        rel: "alternate",
        type: "application/json",
        href: "ai-consumption-contract.json",
        title: "TCRN AI consumption contract",
        dataMarker: "data-tcrn-ai-consumption-contract=\"true\""
      },
      help: {
        rel: "help",
        type: "text/plain",
        href: "llms.txt"
      },
      meta: {
        contract: "tcrn-ai-consumption-contract",
        route: "tcrn-ai-consumption-contract-route",
        required: "tcrn-ai-consumption-contract-required"
      }
    }
  },
  firstReadRoutes: ["ai-consumption-contract.json", "llms.txt", "proof.html#ai-consumption-contract"],
  requiredReadbackFields: [
    "contractVersion",
    "contractPayloadDigest",
    "artifact",
    "route",
    "readAt",
    "coveredRules",
    "coveredStorybookSections",
    "requiredProof",
    "noOverclaimBoundaries"
  ],
  requiredStorybookSectionChecklist: [
    {
      section: "Welcome",
      route: "index.html",
      requiredStories: [
        "welcome-governance",
        "governance-boundaries",
        "maintainers-routing",
        "contribution-model",
        "release-bug-policy"
      ],
      consumerChecks: [
        "read governance and contribution boundaries before treating Storybook as product adoption",
        "confirm owner review, release, publication, and bug-policy boundaries before claims",
        "record maintainers/routing expectations before asking a product repo to consume DS"
      ]
    },
    {
      section: "Style Guide",
      route: "style-guide.html",
      requiredStories: [
        "brand-identity",
        "color-palette",
        "text-styles",
        "grid-system",
        "icons-motion",
        "global-states",
        "copy-creation-rules"
      ],
      consumerChecks: [
        "compare brand, color, type, grid, icon, motion, global state, and copy rules before visual implementation",
        "prove motion/effect parity, including duration, easing, opacity, transform, focus treatment, and reduced-motion fallback",
        "do not treat static state changes as motion compliance"
      ]
    },
    {
      section: "Foundations",
      route: "foundations.html",
      requiredStories: [
        "tokens-copy-state",
        "i18n-theme-contract",
        "copy-guidelines"
      ],
      consumerChecks: [
        "consume semantic tokens, theme variables, locale metadata, and copy-state vocabulary before product copy or CSS",
        "verify light/dark and supported locale behavior against Storybook before product compliance claims",
        "block hard-coded copy, ad hoc status language, and theme-specific behavior forks"
      ]
    },
    {
      section: "Components",
      route: "components.html",
      requiredStories: [
        "component-family-index",
        "display-primitives-spec",
        "interaction-disclosure-spec",
        "button-spec-usage",
        "field-spec-usage",
        "navigation-shell-spec",
        "aos-frontend-shell-slice",
        "aos-owner-quality-product-shell",
        "dialog-spec-usage",
        "table-work-index-spec"
      ],
      consumerChecks: [
        "identify every registered primitive, export, variant, prop, slot, and state required by the product surface",
        "prove product code consumes package-backed components instead of local clones",
        "prove the same Storybook visual instance, then compare rendered component metrics against Storybook: size, radius, padding, border, background, typography, hover, focus, active, disabled, dark, locale, mobile, and reduced-motion states"
      ]
    },
    {
      section: "Patterns",
      route: "patterns.html",
      requiredStories: [
        "forms-patterns",
        "workbench-patterns",
        "readiness-notification-patterns",
        "selection-list-patterns",
        "modal-validation-patterns",
        "datagrid-fields-patterns",
        "big-list-search-patterns",
        "dashboard-page-templates"
      ],
      consumerChecks: [
        "consume page, dashboard, workbench, list, form, notification, validation, data-grid, and search composition rules before arranging product screens",
        "prove information hierarchy, density, mobile reflow, empty/loading/error states, and route-level IA match the relevant Storybook pattern",
        "block proof/status panels from replacing product-first page composition unless the Storybook pattern explicitly requires them"
      ]
    },
    {
      section: "Proof",
      route: "proof.html",
      requiredStories: [
        "proof-matrix",
        "ai-consumption-contract",
        "blocked-actions",
        "overlay-focus"
      ],
      consumerChecks: [
        "read proof matrix, this AI contract, blocked actions, and overlay/focus proof before implementation closeout",
        "carry required receipts for browser interaction, accessibility, visual parity, no-overclaim, owner-visible preview, and product-owned adoption proof",
        "do not use Storybook-only evidence as product adoption, acceptance, release, or hosted readiness proof"
      ]
    },
    {
      section: "Change Log",
      route: "change-log.html",
      requiredStories: [
        "local-changelog"
      ],
      consumerChecks: [
        "read local changelog for recently changed DS contract behavior before using older memory or cached screenshots",
        "record the consumed Storybook/DS basis when comparing a product repo against the contract",
        "block stale Storybook baselines from being used as current visual truth"
      ]
    }
  ],
  visualEquivalenceLevels: [
    "same_package_version",
    "same_exported_component",
    "same_variant_props_slots",
    "same_storybook_visual_instance"
  ],
  storybookVisualParityProof:
    "Design System compliance requires the same Storybook visual instance, not merely package import or boundary markers. Product proof must compare DOM/component identity where available plus computed size, radius, padding, border, background, typography, spacing, hover/focus/active/disabled states, menu/search/drawer position, motion duration/easing/opacity/transform, theme transition, reduced-motion fallback, locale behavior, mobile reflow, and information hierarchy against the relevant Storybook section.",
  visualInstanceOracles: [
    {
      id: "aos-frontend-shell-slice",
      name: "AosFrontendShellSliceVisualInstance",
      route: "components.html#aos-frontend-shell-slice",
      disposition: "internal_registered_shell_proof_scaffold_not_owner_quality_target",
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
      primaryIa: ["Cockpit", "Work"],
      requiredVariants: [
        "desktop-light-expanded-cockpit-search-results",
        "desktop-light-expanded-cockpit-search-rest",
        "desktop-dark-expanded-cockpit",
        "desktop-light-collapsed-work",
        "mobile-dark-work-stacked",
        "reduced-motion"
      ],
      requiredVariantFixtures: [
        {
          id: "desktop-light-expanded-cockpit-search-results",
          selector: "[data-storybook-visual-instance=\"aos-frontend-shell-slice\"][data-visual-instance-variant=\"desktop-light-expanded-cockpit-search-results\"]",
          expectedState: {
            theme: "light",
            locale: "en",
            collapsed: false,
            selectedRoute: "cockpit",
            search: "results",
            searchExpanded: true,
            searchResultsVisible: true,
            viewport: "desktop",
            reducedMotion: false,
            content: "cockpit"
          }
        },
        {
          id: "desktop-light-expanded-cockpit-search-rest",
          selector: "[data-storybook-visual-instance=\"aos-frontend-shell-slice\"][data-visual-instance-variant=\"desktop-light-expanded-cockpit-search-rest\"]",
          expectedState: {
            theme: "light",
            locale: "en",
            collapsed: false,
            selectedRoute: "cockpit",
            search: "rest",
            searchExpanded: false,
            searchResultsVisible: false,
            viewport: "desktop",
            reducedMotion: false,
            content: "cockpit"
          }
        },
        {
          id: "desktop-dark-expanded-cockpit",
          selector: "[data-storybook-visual-instance=\"aos-frontend-shell-slice\"][data-visual-instance-variant=\"desktop-dark-expanded-cockpit\"]",
          expectedState: {
            theme: "dark",
            locale: "en",
            collapsed: false,
            selectedRoute: "cockpit",
            search: "rest",
            searchExpanded: false,
            searchResultsVisible: false,
            viewport: "desktop",
            reducedMotion: false,
            content: "cockpit"
          }
        },
        {
          id: "desktop-light-collapsed-work",
          selector: "[data-storybook-visual-instance=\"aos-frontend-shell-slice\"][data-visual-instance-variant=\"desktop-light-collapsed-work\"]",
          expectedState: {
            theme: "light",
            locale: "en",
            collapsed: true,
            selectedRoute: "work",
            search: "rest",
            searchExpanded: false,
            searchResultsVisible: false,
            viewport: "desktop",
            reducedMotion: false,
            content: "work"
          }
        },
        {
          id: "mobile-dark-work-stacked",
          selector: "[data-storybook-visual-instance=\"aos-frontend-shell-slice\"][data-visual-instance-variant=\"mobile-dark-work-stacked\"]",
          expectedState: {
            theme: "dark",
            locale: "zh-CN",
            collapsed: false,
            selectedRoute: "work",
            search: "rest",
            searchExpanded: false,
            searchResultsVisible: false,
            viewport: "mobile",
            reducedMotion: false,
            content: "work"
          }
        },
        {
          id: "reduced-motion",
          selector: "[data-storybook-visual-instance=\"aos-frontend-shell-slice\"][data-visual-instance-variant=\"reduced-motion\"]",
          expectedState: {
            theme: "light",
            locale: "en",
            collapsed: false,
            selectedRoute: "cockpit",
            search: "rest",
            searchExpanded: false,
            searchResultsVisible: false,
            viewport: "desktop",
            reducedMotion: true,
            content: "cockpit"
          }
        }
      ],
      delegatedInteractionProofs: [
        "Locale menu dismissal and focus return are delegated to ShellLocaleMenu/ProductShell interaction sub-oracles.",
        "Search blur/outside-pointer/tab/Escape dismissal is delegated to ProductShellSearch and field/search sub-oracles.",
        "This oracle proves rendered visual states and remains blocked from owner visual admission until review completes."
      ],
      ownerVisualAdmissionBoundary: "internal_ds_oracle_review_required_before_owner_visual_admission",
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
      negativeCriteria: [
        "no Storybook-only prototype classes",
        "no product-local visible CSS/effect system",
        "no deprecated AOS wordmark assets",
        "no unregistered primary IA",
        "no raw API/debug payload as primary UX",
        "no owner/product/release/live-dispatch readiness claim"
      ]
    },
    {
      id: "aos-owner-quality-product-shell",
      name: "AosOwnerQualityProductShell",
      route: "components.html#aos-owner-quality-product-shell",
      disposition: "owner_quality_candidate_requires_ds_review_before_product_use",
      replacesOwnerQualityTarget: "aos-frontend-shell-slice",
      packageMapping: [
        "ProductShell",
        "ProductShellSearch",
        "useProductShellController",
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
      primaryIa: ["Operations Cockpit", "Work queue"],
      requiredVariants: [
        "desktop-light-operations-cockpit",
        "desktop-dark-operations-cockpit",
        "desktop-light-work-queue",
        "mobile-dark-zh-cn-work-queue",
        "desktop-light-operations-search-results",
        "reduced-motion"
      ],
      requiredVariantFixtures: [
        {
          id: "desktop-light-operations-cockpit",
          selector: "[data-storybook-visual-instance=\"aos-owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-light-operations-cockpit\"]",
          expectedState: {
            theme: "light",
            locale: "en",
            collapsed: false,
            selectedRoute: "cockpit",
            search: "rest",
            searchExpanded: false,
            searchResultsVisible: false,
            viewport: "desktop",
            reducedMotion: false,
            content: "cockpit"
          }
        },
        {
          id: "desktop-dark-operations-cockpit",
          selector: "[data-storybook-visual-instance=\"aos-owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-dark-operations-cockpit\"]",
          expectedState: {
            theme: "dark",
            locale: "en",
            collapsed: false,
            selectedRoute: "cockpit",
            search: "rest",
            searchExpanded: false,
            searchResultsVisible: false,
            viewport: "desktop",
            reducedMotion: false,
            content: "cockpit"
          }
        },
        {
          id: "desktop-light-work-queue",
          selector: "[data-storybook-visual-instance=\"aos-owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-light-work-queue\"]",
          expectedState: {
            theme: "light",
            locale: "en",
            collapsed: false,
            selectedRoute: "work",
            search: "rest",
            searchExpanded: false,
            searchResultsVisible: false,
            viewport: "desktop",
            reducedMotion: false,
            content: "work"
          }
        },
        {
          id: "mobile-dark-zh-cn-work-queue",
          selector: "[data-storybook-visual-instance=\"aos-owner-quality-product-shell\"][data-visual-instance-variant=\"mobile-dark-zh-cn-work-queue\"]",
          expectedState: {
            theme: "dark",
            locale: "zh-CN",
            collapsed: false,
            selectedRoute: "work",
            search: "rest",
            searchExpanded: false,
            searchResultsVisible: false,
            viewport: "mobile",
            reducedMotion: false,
            content: "work"
          }
        },
        {
          id: "desktop-light-operations-search-results",
          selector: "[data-storybook-visual-instance=\"aos-owner-quality-product-shell\"][data-visual-instance-variant=\"desktop-light-operations-search-results\"]",
          expectedState: {
            theme: "light",
            locale: "en",
            collapsed: false,
            selectedRoute: "cockpit",
            search: "results",
            searchExpanded: true,
            searchResultsVisible: true,
            viewport: "desktop",
            reducedMotion: false,
            content: "cockpit"
          }
        },
        {
          id: "reduced-motion",
          selector: "[data-storybook-visual-instance=\"aos-owner-quality-product-shell\"][data-visual-instance-variant=\"reduced-motion\"]",
          expectedState: {
            theme: "light",
            locale: "en",
            collapsed: false,
            selectedRoute: "cockpit",
            search: "rest",
            searchExpanded: false,
            searchResultsVisible: false,
            viewport: "desktop",
            reducedMotion: true,
            content: "cockpit"
          }
        }
      ],
      slots: [
        "registered AOS brand lockup",
        "attached ProductShell side navigation",
        "compact topbar controls",
        "ProductShellSearch rest/results surface",
        "product-first operations cockpit",
        "work queue and gate evidence",
        "secondary developer detail disclosure"
      ],
      ownerQualityAcceptanceCriteria: [
        "first viewport reads as AOS Operations Cockpit or AOS Rebuild Workspace",
        "exactly one primary H1 per rendered fixture",
        "product content leads with current work, gates, evidence, decisions, owner actions, service health, and activity",
        "read-only and no-live-dispatch boundaries are visible but low-prominence",
        "developer proof/API/readback details are secondary disclosure",
        "Cockpit and Work are meaningful product modules rather than placeholder labels"
      ],
      rejectCriteria: [
        "first viewport headline is AOS frontend shell, Frontend shell slice, Local structural slice only, or Dummy Cockpit",
        "implementation/proof/debug terminology dominates the first viewport",
        "no-overclaim copy becomes the primary product story",
        "Runtime/Stories/Gates/Audit events verification metrics lead the hierarchy",
        "visible local product CSS/effects or Storybook-only prototype classes appear",
        "owner/product/release/live-dispatch/final-Cockpit readiness is claimed"
      ],
      delegatedSubOracles: [
        "ProductShell owns side-nav collapse, responsive posture, theme, locale, focus, and reduced-motion behavior.",
        "ProductShellSearch owns search rest/results/dismissal behavior.",
        "This owner-quality oracle defines first-viewport hierarchy and copy semantics; product adoption remains separate."
      ],
      ownerVisualAdmissionBoundary: "internal_ds_oracle_review_required_before_owner_visual_admission",
      negativeCriteria: [
        "no proof-scaffold headline as Level 1 content",
        "no Dummy Cockpit or structural-placeholder first viewport",
        "no primary raw API/debug/readback payload",
        "no deprecated AOS wordmark assets",
        "no unregistered primary IA",
        "no owner/product/release/live-dispatch readiness claim"
      ]
    }
  ],
  requiredBeforeProductFrontendImplementation: [
    "read_ai_consumption_contract",
    "read_every_required_storybook_section",
    "prove_same_storybook_visual_instance_not_only_package_import",
    "use_tcrn_i18n_and_copy_state",
    "use_admitted_brand_asset_or_route_brand_component_admission",
    "use_registered_brand_lockup_components_for_product_suffixes",
    "reject_unregistered_or_deprecated_brand_assets",
    "import_package_backed_ds_primitives",
    "use_design_tokens_and_accessibility_rules",
    "verify_light_and_dark_storybook_theme_contract",
    "verify_motion_effect_parity_and_reduced_motion",
    "preserve_compact_storybook_shell_controls",
    "use_product_shell_semantic_control_api",
    "prove_locale_popup_dismissal_and_focus_return",
    "prove_side_navigation_collapse_state",
    "block_unregistered_modules_from_primary_navigation",
    "prove_browser_interactions_not_static_markers",
    "prove_product_adoption_before_ds_compliance_claim"
  ],
  requiredProof: [
    "contract_story_readback",
    "i18n_copy_state_receipt",
    "brand_surface_receipt",
    "forbidden_brand_asset_absence_receipt",
    "package_import_receipt",
    "theme_mode_receipt",
    "storybook_shell_control_receipt",
    "locale_popup_dismissal_receipt",
    "side_navigation_collapse_receipt",
    "registered_navigation_receipt",
    "browser_interaction_receipt",
    "storybook_section_coverage_receipt",
    "visual_equivalence_receipt",
    "motion_effect_receipt",
    "product_adoption_route_receipt"
  ],
  supportedThemeModes: ["light", "dark"],
  forbiddenBrandAssets: [
    "tcrn-aos-wordmark-geometric-dark.png",
    "tcrn-aos-wordmark-geometric-dark-preview.png",
    "tcrn-aos-wordmark-geometric-spec.md",
    "tcrn-aos-wordmark.png",
    "tcrn-aos-wordmark.svg",
    "aos-favicon.png",
    "favicon.ico"
  ],
  brandSurfaceDisposition:
    "Product implementations may use admitted brand assets and package-backed brand primitives only. TcrnBrandMark, ProductLockup, and ShellBrandLockup are registered @tcrn/ui-react exports for TCRN mother-brand and product suffix lockups. Generic icons or text-only substitutes are not brand marks. Deprecated or unregistered AOS wordmark image assets are forbidden product shell inputs.",
  i18nDisposition:
    "All visible product UI copy must use the approved locale and copy-state contract before rendering.",
  componentConsumptionDisposition:
    "Product implementations must import package-backed Design System primitives for ProductShell, ProductShellSearch, TopBar, SideNav, NavGroup, NavItem, SearchInput, ShellThemeToggle, ShellLocaleMenu, SideNavCollapseButton, brand lockups, status, readback, table, and disclosure surfaces instead of rebuilding reusable local clones. Product shell state/effect behavior must use ProductShell semantic callbacks, ProductShellSearch controlled props, or useProductShellController prop bundles including productShellControlProps, productShellSearchProps, shellLocaleMenuProps, shellThemeToggleProps, and sideNavCollapseButtonProps; product consumers may supply only IA/data, route labels, locale data, search records, content slots, and DS-defined callbacks such as onCollapsedChange, onThemeChange, onLocaleMenuOpenChange, onLocaleChange, onSearchQueryChange, onSearchExpandedChange, onSearchDismiss, and onSearchResultActivate.",
  tokenConsumptionDisposition:
    "Product implementations must use Design System tokens, reduced-motion rules, and accessibility states before custom CSS.",
  themeModeDisposition:
    "Product implementations must preserve semantic token behavior across light and dark Storybook shell modes and prove both modes before claiming Design System compliance.",
  storybookShellControlContract: {
    themeToggle:
      "The Storybook docs shell uses one compact circular icon-only theme toggle that reflects the current mode and toggles only on explicit activation.",
    themeTransition:
      "Theme changes must use one whole-page transition through the root View Transition API when available, with a single full-page fallback wash; sidebar, header, and content must not darken as independent sections.",
    localeSelector:
      "The language control uses a globe trigger plus the current locale name in that locale; menu options use native names only and avoid long bilingual labels. Locale popups close on selection, outside pointer down or click, and Escape; aria-expanded reflects state, and focus returns to the trigger when dismissed by keyboard or selection.",
    search:
      "Shell search stays compact at rest, expands smoothly on focus, collapses on blur, and reserves shortcut labels for shell search with real focus/result behavior.",
    aiContractAccess:
      "AI consumption contract access remains in the Proof story and static ai-consumption-contract.json artifact, not in the human top toolbar."
  },
  productShellHardeningRules: {
    sideNavigation:
      "Product and documentation shells that claim SideNav behavior must expose a keyboard-accessible collapse and expand control, persist or route-own collapsed state, preserve active location/accessibility, and prove both expanded and collapsed states.",
    brandSurface:
      "Product shells must use registered package-backed brand lockups or route brand admission before product use; generic icons, text-only substitutes, and deprecated AOS wordmark images are not accepted brand marks.",
    registeredNavigation:
      "Product shells must not surface unregistered or planned modules as primary navigation, registered module cards, or active product IA before an owning route admits them.",
    primitiveConsumption:
      "Product frontends must consume registered package-backed primitives from @tcrn/ui-react, including ProductShell/ProductShellSearch/useProductShellController for side-nav shell effects and semantic control callbacks, and must not create reusable local clones for shell, navigation, search, theme, locale, status, readback, table, or disclosure behaviors without a DS admission route.",
    shellEffectBoundary:
      "The package-backed ProductShell boundary owns attached side-nav shell layout, collapsed rail styling, responsive desktop/mobile posture, compact/rest/focused search result surfaces, locale menu open-state markers and dismissal/focus-return hooks, theme-toggle transition hooks, one whole-page transition/fallback wash styling, focus treatment, reduced-motion behavior, and light/dark token behavior. Product routes may pass IA/data/content/search records and DS-defined callbacks but must not fork those effects.",
    semanticControlApi:
      "AOS-style product shells must consume ProductShell semantic props or useProductShellController prop bundles for onCollapsedChange, onThemeChange, onLocaleMenuOpenChange, onLocaleChange, onSearchQueryChange, onSearchExpandedChange, onSearchDismiss, and onSearchResultActivate. Wrapper-level event delegation around rendered controls is not a valid substitute for the package boundary.",
    browserProof:
      "Product adoption proof must exercise rendered browser interactions, including menu dismissal and side navigation collapse, rather than relying only on static marker checks."
  },
  forbiddenClaims: [
    "storybook_docs_publication",
    "hosted_doc_readiness",
    "package_publication",
    "automatic_component_registration",
    "automatic_product_adoption",
    "aos_tms_acceptance",
    "release_readiness",
    "owner_intent_live_dispatch"
  ],
  noOverclaimBoundaries: [
    "local_storybook_contract_only",
    "consumer_product_adoption_separate",
    "aos_tms_mutation_not_authorized",
    "package_publication_not_claimed",
    "hosted_docs_readiness_not_claimed"
  ]
} as const;

export type AiConsumptionContract = typeof aiConsumptionContract;
