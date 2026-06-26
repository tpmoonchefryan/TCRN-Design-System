export const aosServedSurfaceCoverageRows = [
  {
    surface: "operations-cockpit",
    standard: "Product workspace shell plus operations workbench",
    packageComponents: "Surface, SideNav, NavGroup, NavItem, TopBar, WorkIndex, TableShell, FilterBar, SearchInput, DetailDrawer, GateReadinessPanel, ReadbackPanel, EvidenceStrip",
    boundary: "Service/read-model data and AOS-specific labels stay product-owned."
  },
  {
    surface: "docs-search-release-readiness",
    standard: "Readiness workspace with evidence, linkage, search, and selected detail",
    packageComponents: "Surface, SideNav, NavGroup, NavItem, TopBar, WorkIndex, TableShell, FilterBar, SearchInput, StateView, DetailDrawer, EvidenceStrip, ReadbackPanel",
    boundary: "Docs export, release handoff, GitHub mutation, and CI mutation stay outside this UI standard."
  },
  {
    surface: "aos-wide-product-design",
    standard: "Target-set workspace with module index, target path, readiness gates, and detail inspection",
    packageComponents: "Surface, SideNav, NavGroup, NavItem, TopBar, TableShell, WorkIndex, GateReadinessPanel, DetailDrawer, KeyValueList, Badge, StatusBadge",
    boundary: "Target-set presentation does not implement the target modules as product features."
  }
];

export const aosWorkspaceShellRows = [
  {
    primitive: "Surface",
    rule: "Owns major workspace bands, summary regions, and detail panels with 8px-or-less radius and predictable spacing.",
    proof: "Page sections are package-backed surfaces or unframed layout bands, never nested cards."
  },
  {
    primitive: "SideNav and NavGroup",
    rule: "Keep primary navigation grouped, sticky on wide viewports, and collapsed or wrapped without label collision on narrow viewports.",
    proof: "Disabled nav items show a clean label plus a separate reason line or assistive reason."
  },
  {
    primitive: "TopBar",
    rule: "Names the active product surface and service/workspace status while leaving page headings to the content area.",
    proof: "Controls wrap before they collide with project, target-path, or status fields."
  },
  {
    primitive: "FilterBar, Field, SearchInput, Select",
    rule: "Group local search/filter controls with persistent labels, disabled reasons, and zero-match or unavailable states.",
    proof: "Disabled form controls expose title, data-disabled-reason, and a unique described-by target."
  }
];

export const aosWorkbenchRows = [
  {
    area: "Summary grid",
    standard: "Use Surface, Heading, Text, Badge, StatusBadge, GateReadinessPanel, and ReadbackPanel for dense status cards.",
    responsive: "Cards wrap in source order and keep metric labels adjacent to values."
  },
  {
    area: "Stage and phase timeline",
    standard: "Use package text/status primitives and table/list rows; timeline connectors are presentation only.",
    responsive: "Timeline labels wrap under their status badges on mobile instead of shrinking into one line."
  },
  {
    area: "Evidence, risk, and claim lanes",
    standard: "Use EvidenceStrip and StatusBadge for warning/readiness lanes; pair details with ReadbackPanel or KeyValueList.",
    responsive: "Badges wrap as readable chips and never concatenate with adjacent labels."
  },
  {
    area: "Selected detail",
    standard: "Use DetailDrawer for structural inspection and KeyValueList for label/value content.",
    responsive: "Drawer content remains complementary, readable, and non-modal unless Dialog behavior is wired."
  }
];

export const aosDocsReadinessRows = [
  {
    area: "Readiness board",
    components: "Surface, Heading, Text, StatusBadge, GateReadinessPanel",
    rule: "Show local/read-only readiness and blocked states without implying external release movement."
  },
  {
    area: "Search inspection",
    components: "FilterBar, Field, SearchInput, Select, TableShell, StateView",
    rule: "Search, filter, empty, and no-match states stay in one readable local inspection flow."
  },
  {
    area: "GitHub PR and CI linkage",
    components: "EvidenceStrip, ReadbackPanel, Badge, LinkButton",
    rule: "Links are presented as references unless the consumer owns mutation behavior."
  },
  {
    area: "Selected detail",
    components: "DetailDrawer, KeyValueList, EvidenceStrip",
    rule: "Selected repo paths, linkage status, and notes remain inspectable without publication claims."
  }
];

export const aosTargetSetRows = [
  {
    area: "Target path",
    components: "TopBar, Field, Select, StatusBadge",
    rule: "Target-path controls wrap before collision and disabled state explains why editing is unavailable."
  },
  {
    area: "Module cards",
    components: "Surface, Heading, Text, Badge, StatusBadge",
    rule: "Cards show target-set status only and do not imply module implementation."
  },
  {
    area: "Surface index",
    components: "WorkIndex, TableShell, SearchInput, FilterBar, StateView",
    rule: "Dense index rows keep row/cell semantics, mobile labels, and contained overflow."
  },
  {
    area: "Gate and evidence panels",
    components: "GateReadinessPanel, EvidenceStrip, ReadbackPanel, DetailDrawer",
    rule: "Unavailable actions remain disabled with their own reason and no live-action affordance."
  }
];

export const aosTargetSetModuleCards = [
  { id: "operations", title: "Operations cockpit", state: { state: "local_only" } },
  { id: "docs", title: "Docs readiness", state: { state: "fixture_only" } },
  { id: "target-set", title: "Product design target set", state: { state: "blocked" } }
] as const;

export const aosDisabledReasonRows = [
  {
    control: "NavItem",
    reasonContract: "Visible label stays clean; reason appears in the nav reason line, title, data-disabled-reason, and described-by target.",
    requiredFor: "Sidebar navigation, local secondary navigation, target set links"
  },
  {
    control: "Button, IconButton, LinkButton",
    reasonContract: "Blocked commands keep a concise label and expose their reason through title, data-disabled-reason, and assistive text.",
    requiredFor: "Refresh, drawer actions, unavailable workspace commands"
  },
  {
    control: "Input, Textarea, Select, SearchInput, Checkbox",
    reasonContract: "Disabled form controls expose title, data-disabled-reason, and a unique sr-only described-by target.",
    requiredFor: "Target path, filters, owner-trial fields, local preview toggles"
  },
  {
    control: "DetailDrawer actions",
    reasonContract: "Drawer actions use Button/IconButton semantics and keep unavailable explanations separate from labels.",
    requiredFor: "Selected detail, service preview, readiness inspection"
  }
];

export const aosTokenDensityRows = [
  {
    tokenArea: "Color",
    rule: "Navy, teal, and blue may anchor AOS workspaces only when paired with neutral surfaces and warning/positive state tokens.",
    boundary: "Do not build one-hue pages or use decorative orbs/gradients as the visual system."
  },
  {
    tokenArea: "Density",
    rule: "Operational surfaces use compact spacing and readable scan rows instead of marketing-scale heroes.",
    boundary: "Hero-scale type belongs only to true first-view hero contexts, not cockpit or readiness cards."
  },
  {
    tokenArea: "Radius",
    rule: "Cards, panels, and controls stay at 8px radius or less unless an existing primitive defines otherwise.",
    boundary: "No nested cards inside page-section cards."
  },
  {
    tokenArea: "Focus and selected states",
    rule: "Selected, hover, focus, disabled, and warning states must remain visible with tokenized contrast and text labels.",
    boundary: "Color alone is never enough for selected or blocked state."
  }
];

export const aosExceptionRows = [
  {
    exceptionId: "aos-brand-lockup-product-specific",
    disposition: "product_specific_exception",
    scope: "AOS product suffix, owner-facing naming, and service/read-model labels may remain consumer-owned copy.",
    limit: "TcrnBrandMark, ProductLockup, and ShellBrandLockup remain Storybook-only prototypes until a separate package-backed brand route promotes them."
  },
  {
    exceptionId: "aos-data-semantics-product-owned",
    disposition: "product_specific_exception",
    scope: "Service schema, row IDs, workspace health, target-set business fields, and local/read-only posture remain AOS-owned data truth.",
    limit: "The Design System owns presentation, disabled-control contracts, layout behavior, and reusable component registration."
  }
];
