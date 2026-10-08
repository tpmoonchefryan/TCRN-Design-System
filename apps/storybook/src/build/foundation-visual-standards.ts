export type FoundationVisualStandardCategoryId =
  | "visual-philosophy-ownership"
  | "layout-rhythm"
  | "spacing-density"
  | "typography-localization"
  | "color-elevation-border-radius-focus"
  | "component-composition"
  | "interaction-motion-accessibility"
  | "responsive-mobile"
  | "evidence-proof-oracle"
  | "consumer-enforcement";

export interface FoundationVisualStandard {
  id: FoundationVisualStandardCategoryId;
  label: string;
  category: string;
  sourcePaths: readonly string[];
  storybookRoutes: readonly string[];
  authorityLevel: "package_authority" | "storybook_visual_oracle" | "consumer_contract" | "proof_contract";
  readbackFields: readonly string[];
  allowedConsumerInputs: readonly string[];
  forbiddenConsumerOverrides: readonly string[];
  proofExpectations: readonly string[];
  missingStandardEscalation: string;
}

export const settingControlSelectionContract = {
  id: "setting-control-selection-contract-v1",
  storybookRoutes: ["components.html#field-spec-usage", "patterns.html#forms-patterns"],
  packageExports: ["SettingChoice", "SettingsHostSwitcher", "Select", "RadioGroup", "NumberInput", "SegmentedNav", "Stepper"],
  semanticRoles: {
    valueSelection: ["SettingChoice", "Select", "RadioGroup"],
    navigation: ["SegmentedNav"],
    processPosition: ["Stepper"],
    numericEntry: ["NumberInput"]
  },
  decisionTable: [
    {
      id: "DS-106-R1-3-plus",
      optionCount: "3+",
      condition: "setting values exceed two options",
      selectedControl: "Select",
      rejectedControl: "SegmentedNav"
    },
    {
      id: "DS-106-R1-2-unmeasured",
      optionCount: "2",
      condition: "either option lacks a finite positive label/control measurement",
      selectedControl: "Select",
      rejectedControl: "default-width binary choice"
    },
    {
      id: "DS-106-R1-2-fit",
      optionCount: "2",
      condition: "both measured labels and controls fit the available inline size",
      selectedControl: "RadioGroup",
      rejectedControl: "SegmentedNav"
    },
    {
      id: "DS-106-R1-2-no-fit",
      optionCount: "2",
      condition: "available inline size is missing or below the measured requirement",
      selectedControl: "Select",
      rejectedControl: "wrapped or clipped binary navigation"
    }
  ],
  binaryFitMeasurement: {
    defaultOptionMinInlineSizePx: 112,
    gapPx: 8,
    groupPaddingEachSidePx: 8,
    formula: "sum(option minInlineSize) + gap + 2 * group padding",
    measurementRequirement: "Every binary option must provide a finite positive minInlineSize measured for the current font, locale, content, and container; the default option minimum is a CSS floor only.",
    unknownAvailableSizeDisposition: "select"
  },
  stateRetention: {
    modes: ["controlled value", "uncontrolled defaultValue"],
    branchSwitch: "SettingChoice retains the current valid value when its native radio and Select branches replace one another.",
    callback: "onChange fires once for an actual user value change and does not fire for a layout-only branch switch or an unchanged value."
  },
  numericEntry: {
    component: "NumberInput",
    semanticMarker: "data-number-input-semantic=numeric-entry",
    fullValueMarker: "data-number-input-visibility=full-value",
    minimumInlineSizeToken: "--tcrn-container-settings-number-min",
    minimumInlineSize: "12ch",
    rangeAndInteraction: ["min/max", "keyboard entry", "paste", "disabled", "error"]
  },
  rejectCriteria: [
    "A setting value uses SegmentedNav or another navigation primitive.",
    "A process Stepper is used as a numeric input.",
    "A binary pair lacks finite positive label/control measurements.",
    "A binary radio group is emitted without a measured positive fit result.",
    "A legal numeric value is visually clipped or replaced with an ellipsis.",
    "A radio/Select branch switch resets a valid value or emits a callback without a user value change."
  ]
} as const;

export const fieldValueSelectionContract = {
  id: "field-value-selection-contract-v1",
  storybookRoutes: ["components.html#field-spec-usage", "patterns.html#selection-list-patterns"],
  packageExports: ["SettingChoice", "Select", "RadioGroup", "MultiSelect", "mountStaticMultiSelect", "SuggestInput"],
  resolver: "resolveFieldValueControl",
  decisionTable: [
    {
      cardinality: "single",
      valueDomain: "closed",
      control: "SettingChoice/Select/RadioGroup",
      rule: "Use a native value selector; use measured binary radios only when the pair fits."
    },
    {
      cardinality: "collection",
      valueDomain: "closed",
      control: "MultiSelect",
      rule: "Use the Select-family dropdown for ordinary collection choice. Its closed trigger shows current choices; its open list supports click, Space/Enter, arrows, Home/End, type-to-focus, Escape, outside dismissal and form navigation. Native multiple lists remain for compatibility and checklists require an explicit task reason; neither is a dropdown. Preserve disabled options, unique values, controlled/uncontrolled values, repeated form submission, validation, and reset."
    },
    {
      cardinality: "single",
      valueDomain: "open",
      control: "SuggestInput",
      rule: "Suggestions are advisory; the input keeps free-form values and never turns an open field into a closed set."
    }
  ],
  stateContract: {
    controlled: "value is authoritative and onChange returns the semantic value.",
    uncontrolled: "defaultValue seeds the native select or checkbox list; form reset returns to that default and user changes remain readable from the control.",
    collection: "values are unique and constrained only when the field is declared closed-set; the checkbox list submits repeated native checkbox values."
  },
  domainBoundary: "DS owns cardinality and value-domain presentation; the consumer supplies field ownership, allowed values, labels, defaults, and submission policy.",
  rejectCriteria: [
    "A closed collection is represented by a comma-delimited free-text field.",
    "An open string field is forced into a Select or its suggestions reject a value not in the list.",
    "A collection loses disabled or selected state, emits duplicate values, or breaks native keyboard/form semantics."
  ]
} as const;

export const dictionaryContentContract = {
  id: "dictionary-content-contract-v1",
  storybookRoutes: ["foundations.html#tokens-copy-state", "style-guide.html#copy-creation-rules"],
  packageExports: ["DictionaryTable"],
  contentModel: {
    category: "One category label and one category description per table.",
    value: "Each entry carries a stable machine value and a reader-facing label.",
    description: "Every entry carries its own non-empty explanation of the value's property, function, or selection timing.",
    defaults: "Default and disabled state are explicit metadata and do not replace the entry description."
  },
  validation: [
    "Missing category or entry descriptions are invalid.",
    "Duplicate machine values are machine-detected and rendered for review rather than silently merged.",
    "Exact duplicate labels and descriptions are machine-detected within a category; near-similar text and source conflicts are not automatic claims of business-function equivalence and remain separate semantic/consumer review."
  ],
  domainBoundary: "DS owns the content shape and validation markers; consumers supply domain categories, values, labels, and descriptions."
} as const;

export const overlayBoundaryContract = {
  id: "overlay-boundary-contract-v1",
  storybookRoutes: ["components.html#interaction-disclosure-spec", "components.html#dialog-spec-usage", "proof.html#overlay-focus"],
  packageExports: ["Tooltip", "Popover", "Dialog", "Menu", "DetailDrawer", "ActionDrawer", "mountStaticOverlayBoundary"],
  modeTable: [
    {
      mode: "Tooltip",
      content: "short supplemental text only",
      boundary: "document body in a client-rendered tree",
      interaction: "hover/focus reveal; no interactive descendants"
    },
    {
      mode: "Popover",
      content: "long or interactive local context",
      boundary: "document body when a trigger reference is supplied",
      interaction: "viewport-safe placement, scroll/resize reposition, Escape/outside close, and route-owned focus return"
    },
    {
      mode: "Dialog/Drawer/Menu",
      content: "modal, structural, or command-specific surface",
      boundary: "their declared semantic layer",
      interaction: "each surface must expose only the focus and dismissal capabilities it actually implements"
    }
  ],
  geometry: {
    placementInputs: ["trigger rectangle", "layer rectangle", "viewport rectangle"],
    edgePolicy: "flip when the requested side lacks room, then clamp inside the viewport gap",
    repositionOn: ["scroll", "resize", "trigger resize", "layer resize"],
    zIndexToken: "--tcrn-z-popover"
  },
  staticDisposition: "Server-rendered Storybook examples may remain inline-static; they must not be presented as client portal evidence. Static HTML consumers use a body-level trigger/layer pair, tcrnComponentCss, and mountStaticOverlayBoundary to rehome and position the layer without a React tree.",
  staticConsumerMigration: {
    markup: "Keep the trigger and layer paired by stable id; render the layer with role=tooltip or role=dialog, class=tcrn-tooltip__content or tcrn-popover, and hidden until the bridge opens it.",
    bootstrap: "Import mountStaticOverlayBoundary({ trigger, layer, kind, placement }) from @tcrn/ui-react and include tcrnComponentCss in the page stylesheet.",
    behavior: "The DOM bridge moves the layer to document.body, applies static-fixed positioning, clamps/flips against the viewport, repositions on scroll/resize, and handles tooltip focus/Escape plus popover click/outside/Escape.",
    noScriptBoundary: "If a consumer cannot run the bridge, it may render a server-positioned body sibling with measured left/top, but it must label the surface static-only and cannot claim dynamic portal, edge, or focus behavior."
  },
  rejectCriteria: [
    "A Tooltip or Popover relies on z-index alone while a scroll ancestor clips it.",
    "A long or interactive explanation is placed in a non-interactive Tooltip.",
    "Placement accepts missing, invalid, or out-of-viewport trigger/layer geometry.",
    "Open, Escape, outside close, or focus return is claimed without the corresponding route-owned wiring."
  ]
} as const;

export const clipboardCopyContract = {
  id: "clipboard-copy-contract-v1",
  storybookRoutes: ["components.html#button-spec-usage", "proof.html#ai-consumption-contract"],
  packageExports: ["ClipboardCopyButton", "mountStaticClipboardCopyButton"],
  states: ["idle", "copying", "copied", "failed", "unsupported"],
  resetDelayMs: 2000,
  valueBoundary: "ClipboardCopyButton keeps the copied value out of the DOM, callbacks, and telemetry. The static bridge reads the value from data-clipboard-text, so the value is present in the page: use it only for values the page may already expose, and keep restricted values on the React component.",
  staticConsumerMigration: {
    markup: "Render the ClipboardCopyButton construct: a native button with type=button and data-clipboard-copy-state=idle, its visible label as a direct text node, a polite role=status region named by aria-describedby, and the value in data-clipboard-text.",
    bootstrap: "Import mountStaticClipboardCopyButton({ root, locale }) from @tcrn/ui-react and include tcrnComponentCss in the page stylesheet; the call returns { destroy() }.",
    behavior: "An explicit click or keyboard activation writes data-clipboard-text with navigator.clipboard.writeText; the button moves through idle, copying, copied, failed, and unsupported like the component, returns to idle after 2 seconds, and keeps focus.",
    labels: "State labels come from the package's five-locale copy for the page's language; data-clipboard-idle-label, data-clipboard-copying-label, data-clipboard-copied-label, data-clipboard-failed-label, and data-clipboard-unsupported-label override them per button.",
    boundary: "The bridge never reads the clipboard and has no document.execCommand fallback; without the Clipboard API it fails closed to unsupported."
  },
  rejectCriteria: [
    "A restricted value is placed in data-clipboard-text instead of staying with the React ClipboardCopyButton.",
    "Copying starts on hover, mount, a timer, or anything other than an explicit activation.",
    "A static copy button announces the copied value in its accessible name.",
    "A state change moves focus away from the button or leaves a state without returning to idle."
  ]
} as const;

export const settingsLayoutContract = {
  id: "settings-layout-contract-v1",
  storybookRoutes: ["components.html#field-spec-usage", "patterns.html#forms-patterns"],
  packageExports: ["SettingsLayout", "SettingsHostSwitcher", "SettingRowList", "SettingRow", "Input", "NumberInput"],
  tokens: {
    frameSplit: "--tcrn-container-settings-split",
    contentStack: "--tcrn-container-settings-content-stack",
    localNavigation: "--tcrn-container-settings-local-nav",
    controlMinimum: "--tcrn-container-settings-control-min",
    numberMinimum: "--tcrn-container-settings-number-min"
  },
  containerQueries: [
    {
      id: "DS-107-R1-frame",
      container: "SettingsLayout frame",
      thresholdPx: 960,
      whenAtOrAbove: "compact local navigation column plus one complete content column",
      whenBelow: "one full-width content column with compact local navigation"
    },
    {
      id: "DS-107-R1-content",
      container: "SettingsLayout content",
      thresholdPx: 720,
      whenAtOrAbove: "Direct SettingRow children share the complete form's label, control, and max-content tools grid; SettingRowList owns that shared grid for an explicit group. Each row uses subgrid so rows with and without actions align",
      whenBelow: "SettingRow label, control, and tools stack in source order"
    }
  ],
  construction: {
    hostSelection: "one SettingsHostSwitcher before the selected host's form",
    form: "one complete form column; never parallel host columns",
    settingRows: "wrap related SettingRow children in SettingRowList so tools width and control starts align across rows",
    localNavigation: "compact, bounded by its own scroll container, with no page-level overflow",
    longValue: "native input remains selectable and copyable; no overflow clipping or ellipsis"
  },
  densityRules: [
    "Use the frame query rather than a viewport-only breakpoint.",
    "Use the content query for nested narrow containers.",
    "Stack labels, controls, and tools when the content container is below 720px.",
    "Keep a 240px minimum control column only in the non-stacked form row."
  ],
  rejectCriteria: [
    "A 980px viewport assumption is used without measuring the actual content container.",
    "Two host configuration columns remain visible when the content container cannot hold them.",
    "overflow:hidden conceals an input, label, action, or long value.",
    "A local navigation strip creates root horizontal overflow."
  ]
} as const;

export const pageHierarchyContract = {
  id: "page-hierarchy-contract-v1",
  storybookRoutes: ["patterns-forms-workbench.html#forms-patterns", "patterns-forms-workbench.html#page-hierarchy-contract"],
  packageExports: ["PageHierarchy", "PageHeader", "SubNav", "SectionTabs", "ProductShell"],
  shellBoundary: "ProductShell owns the global topbar; PageHeader owns the page header and is not counted as the global shell.",
  depthDecisionTable: [
    {
      id: "DS-112-R1-two-level",
      depth: "two",
      structure: ["PageHeader", "parent-level SubNav or SectionTabs", "lower-content"],
      internalNavigation: "forbidden",
      rule: "Header -> parent tabs -> lower content; no internal left navigation is added."
    },
    {
      id: "DS-112-R1-three-level",
      depth: "three",
      structure: ["PageHeader", "parent-level SubNav or SectionTabs", "selected-subpage local navigation", "selected-subpage content"],
      internalNavigation: "required",
      rule: "Header -> parent tabs -> selected subpage with local navigation and content."
    }
  ],
  slots: {
    header: "page-level PageHeader",
    sectionTabs: "parent-level SubNav or SectionTabs",
    localNavigation: "third-level only; omitted for two-level pages",
    content: "lower content for two-level pages or right content for third-level pages"
  },
  widthPolicy: "Page depth is explicit and stable; container width only changes the presentation of an admitted third-level region and never infers, adds, or removes a page level.",
  containerRule: {
    thirdLevelSplitToken: "--tcrn-container-page-third-level-split",
    thirdLevelSplitPx: 960,
    localNavigationToken: "--tcrn-container-page-third-level-nav",
    localNavigationPx: 208,
    belowSplit: "third-level local navigation precedes content in one column"
  },
  excludedDepthInputs: ["outer ProductShell application sidebar", "host switcher", "setting values", "mode/value count"],
  rejectCriteria: [
    "A two-level page adds an internal left navigation region.",
    "A three-level page omits the PageHeader or parent-level tabs.",
    "A consumer uses viewport width, option count, or an outer application sidebar to infer page depth.",
    "A consumer duplicates the global ProductShell topbar as a page Header.",
    "A legal hierarchy declaration is accepted when the actual DOM order or rendered regions do not match it."
  ]
} as const;

export const verificationCadenceContract = {
  id: "ds-verification-cadence-contract-v1",
  scope: "EPIC038 implementation and its necessary DS dependencies",
  stages: [
    {
      id: "development",
      trigger: "A source, test, copy, token, consumer-proof, or documentation change is being developed.",
      preferredCommands: ["pnpm typecheck", "pnpm --filter @tcrn/ui-react test:ssr", "pnpm --filter @tcrn/ui-react test:dom", "pnpm tokens:proof", "pnpm ds:consumption:proof", "pnpm full-surface:proof", "pnpm storybook:smoke"],
      selection: "Run only checks affected by the change, plus a focused negative leg when the change alters a validator or boundary.",
      prohibitedDefault: "Do not start the flat full verify/P1/push-gate set for each edit or before this bounded batch is ready."
    },
    {
      id: "candidate-final",
      trigger: "All EPIC038 source, tests, Storybook consumers, documentation, and necessary local dependencies are fixed at one candidate.",
      requiredCommands: ["pnpm verify", "pnpm public-docs:vercel-build"],
      selection: "Run one final top-level verify for the candidate and retain the static-document build as a separate output target when requested.",
      prohibitedDefault: "Do not rerun contained child gates after the same successful parent run without a changed input or a failing result that requires targeted diagnosis."
    },
    {
      id: "post-change",
      trigger: "A merge, publication, environment, dependency, baseline, or candidate change makes an earlier receipt potentially stale.",
      selection: "Rerun only the gates whose source, environment, command, fixture, baseline, or output target changed, then expand by risk.",
      prohibitedDefault: "A prior same-SHA receipt cannot be reused when required input identity or output digest is missing."
    }
  ],
  deduplication: {
    parentCommand: "pnpm verify",
    containedCommands: ["pnpm typecheck", "pnpm build", "pnpm test", "pnpm ds:consumption:proof", "pnpm full-surface:proof", "pnpm internal-alpha:proof"],
    rule: "A successful parent receipt covers its contained commands for the same candidate; do not run the same child again merely because it is listed separately in the repository scripts."
  },
  evidenceReuse: {
    validator: "evaluateEvidenceReuse in scripts/ds-consumption-proof.mjs",
    inputKeys: ["sourceTreeSha", "workingTreeStatus", "lockfileDigest", "packageVersions", "command", "flags", "browserToolVersion", "fixtureDigest", "baselineDigest", "outputTargetDigest"],
    requiredInputs: ["source tree SHA", "working-tree status", "lockfile and package versions", "command and flags", "browser/tool version", "fixture/input digest", "baseline and output-target digest"],
    invalidators: ["source or test change", "dirty or unknown working-tree change", "dependency or lockfile change", "command or flag change", "browser/tool/environment change", "fixture or baseline change", "prior failure", "missing input or output digest", "empty or unknown identity content"],
    rule: "Reuse only records whose required inputs match exactly; otherwise mark the receipt invalidated and rerun the affected check."
  },
  preservation: "This cadence changes timing and parent/child execution selection only; it does not remove security, compatibility, replay, release-identity, localization, visual, or no-overclaim gates."
} as const;

export const operationFeedbackContract = {
  id: "operation-feedback-contract-v1",
  storybookRoutes: ["components.html#display-primitives-spec", "proof.html#ai-consumption-contract"],
  packageExports: ["OperationFeedback", "presentOperationFeedbackPhase", "StatusBadge", "DisclosurePanel", "StateSurface", "ProductShell"],
  phases: ["idle", "loading", "success", "error"],
  phaseSemantics: [
    { phase: "idle", labels: { "zh-CN": "未开始", en: "Idle", ja: "待機中", ko: "대기 중", fr: "En attente" }, stateRule: "No operation has started." },
    { phase: "loading", labels: { "zh-CN": "进行中", en: "In progress", ja: "進行中", ko: "진행 중", fr: "En cours" }, stateRule: "The operation is currently running." },
    { phase: "success", labels: { "zh-CN": "已完成", en: "Completed", ja: "完了", ko: "완료", fr: "Terminé" }, stateRule: "The operation completed successfully." },
    { phase: "error", labels: { "zh-CN": "失败", en: "Failed", ja: "失敗", ko: "실패", fr: "Échec" }, stateRule: "The operation failed." }
  ],
  roles: {
    shortStatus: "StatusBadge carries the accurate short five-locale operation phase label and never carries a readiness/proof label, long reason code, timestamp, or machine id.",
    identity: "OperationFeedback renders the consumer-supplied operation, operation id, actor, actor id, and occurrence time with consumer-supplied accessible labels.",
    details: "The complete receipt and long reason remain in a keyboard-reachable DisclosurePanel controlled by a native button.",
    notification: "The root uses polite aria-live so an operation update is announced without moving focus."
  },
  stateContract: "The optional state is an operation phase string or { phase }; when supplied it must equal phase. Readiness/proof states such as proof_required are not operation phase labels and fail closed.",
  props: ["phase", "state", "identity", "identityLabels", "detailTitle", "detailsLabel", "details", "expanded", "onExpandedChange", "locale"],
  layout: {
    root: "min-inline-size:0; max-inline-size:100%",
    identity: "long labels and values wrap with overflow-wrap:anywhere",
    compactStatus: "StatusBadge remains a bounded short label; full details are not placed in the badge"
  },
  staticConsumerMigration: {
    markup: "Emit one tcrn-operation-feedback root with a tcrn-badge short-status, a labeled dl identity, and a native details button controlling the details section by stable id.",
    stylesheet: "Include tcrnTokenCss and tcrnComponentCss; use tcrn-operation-feedback and its package-emitted child classes without a consumer-local status layout.",
    update: "On a real operation update, replace the phase/state label, identity values, and details text while preserving the same operation identity and aria-expanded/aria-controls relationship.",
    boundary: "Static HTML/CSS expresses the same construction and visible-state semantics; it does not claim React state management, product persistence, or downstream acceptance."
  },
  rejectCriteria: [
    "A long machine reason, timestamp, or id is inserted into the compact StatusBadge label.",
    "Operation identity is dropped, replaced by a synthetic test string, or rendered without labels.",
    "Full details cannot be opened, read, or closed from the keyboard.",
    "Loading or error is represented only by animation or a hidden DOM node.",
    "Operation feedback widens the root/document for a long id or localized label."
  ]
} as const;

export const contentScopeContract = {
  id: "content-scope-contract-v1",
  storybookRoutes: ["foundations.html#tokens-copy-state", "components.html#display-primitives-spec", "proof.html#ai-consumption-contract"],
  packageExports: ["ContentScope", "validateContentScope", "EmptyState", "StateSurface", "ErrorState"],
  modelFields: ["scope", "dataSource", "phase", "shownCount", "totalCount", "filtered", "hasContent", "staleContent"],
  phases: {
    idle: "No content is claimed before the scope has loaded; shown and total counts are zero.",
    loading: "Loading is distinct from empty; counts stay zero unless explicitly rendering stale content.",
    content: "The same scope and source have visible content and shownCount is positive.",
    empty: "The same scope and source have no current content; shownCount is zero and stale content is false.",
    error: "Error is distinct from empty; stale content is allowed only when explicitly marked and still visible."
  },
  countSemantics: {
    unfiltered: "When filtered is not true, totalCount equals shownCount.",
    filtered: "When filtered is true, shownCount is the visible filtered count and totalCount is the source total; totalCount is never below shownCount.",
    sourceBoundary: "Counts and phase describe the declared dataSource for this scope only."
  },
  independentScopes: "Each ContentScope is validated independently, so one empty scope may sit beside another valid nonempty scope.",
  renderedContentEvidence: "The model-valid marker is separate from rendered content evidence: deterministic empty fragments/null/nested empty nodes are invalid, intrinsic non-text accessible content is verified, and custom component output is marked unknown until observed.",
  staticConsumerMigration: {
    construction: "For each independent scope, evaluate the same model with validateContentScope before emitting a root carrying data-content-scope, data-content-source, data-content-phase, data-content-valid, and count markers.",
    rendering: "Render only the declared content, empty, loading, error, or invalid branch for that scope; do not let a sibling array decide this branch.",
    boundary: "Consumers own data, permissions, business values, and copy. DS does not infer product groups, field names, or Workflow enums."
  },
  rejectCriteria: [
    "A nonempty scope renders its own empty state or zero count.",
    "An empty array from another data source controls this scope.",
    "Loading or error is presented as empty without an explicit stale-content declaration.",
    "filtered and total counts are shown with ambiguous or contradictory meaning.",
    "A missing scope or data source passes because data-* markers say it is valid."
  ]
} as const;

export const consumerEvidenceContract = {
  id: "consumer-evidence-verification-contract-v1",
  utility: "evaluateConsumerEvidence",
  packageExports: ["evaluateConsumerEvidence", "serializeConsumerEvidenceValue"],
  valueAdapter: "serializeConsumerEvidenceValue",
  sourcePath: "packages/ui-react/src/verification/ConsumerVerification.ts",
  expectedInventory: ["id", "requestedSurface", "selectedSurface", "expectedPanelSurface", "expectedControl", "expectedValues", "applicability", "applicabilityEvidence"],
  observedInstance: ["instanceId", "requestedSurface", "selectedSurface", "panelSurface", "controlId", "controlPresent", "values", "applicabilityEvidence", "input", "result", "uiFeedback", "geometry", "zoom"],
  valueEvidence: {
    expectedFields: ["key", "serialization", "value"],
    observedFields: ["key", "serialization", "submittedValue", "serializedValue", "readbackValue"],
    serializationModes: ["json", "text", "form-data"],
    equalityRule: "For every expected key, submittedValue, serializedValue, and readbackValue must equal the expected value under the declared serialization mode; missing or extra keys fail."
  },
  traceability: {
    identity: "Every required expected id has exactly one observed instance with matching requested/selected/panel surface and control identity.",
    input: "The exercised target id, modality, change, and keyboard target offset measurement are recorded; an unverified or unknown point fails.",
    result: "The result status and identity are observed in the DOM and must not be synthesized from an HTTP response.",
    feedback: "Status, identity, details reachability, and the actual feedback DOM are visible; error feedback additionally proves error DOM was checked.",
    geometry: "After-operation geometry records page, scroll, visible viewport, requested/selected/panel surfaces, and the actual visible instance; target bounds must fit.",
    zoom: "dpr, pinch-visual-viewport, and page-zoom are separate axes, each with measured effective scale, element width, and visible viewport dimensions."
  },
  zoomAxes: ["dpr", "pinch-visual-viewport", "page-zoom"],
  lifecycleIntersection: "Operation success/error UI feedback and geometry are one observation; navigation-only or write-only green results cannot substitute for the intersection.",
  applicability: "A not-applicable entry still needs one absent-control observation, controlPresent=false, actualControlCount=0, DOM source, and non-empty applicability evidence; a missing required control or unknown control state cannot become N/A.",
  positiveLegs: ["complete DOM-backed success observation", "complete DOM-backed error observation with error DOM check", "measured geometry and all three zoom axes", "evidenced absent not-applicable control"],
  negativeLegs: ["wrong group or instance identity", "missing DOM on error", "value serialization/readback mismatch", "missing or extra value key", "page overflow or target outside visible viewport", "DPR-only or unmeasured scale", "hardcoded wouldFail", "HTTP-only result/UI feedback", "missing required control relabeled N/A", "unknown N/A control state"],
  rejectCriteria: [
    "A proof returns a hardcoded wouldFail result instead of evaluating the observation.",
    "A missing required control is silently treated as not applicable.",
    "DPR is used as a substitute for pinch visual viewport or desktop page zoom.",
    "Geometry is measured only on body/navigation while the selected panel or actual operation feedback is unmeasured.",
    "An error path skips DOM and visibility checks."
  ]
} as const;

export const consumerVerificationContract = {
  id: "consumer-verification-contract-v1",
  script: "scripts/ds-consumption-proof.mjs",
  browserScript: "scripts/full-surface-remediation-proof.mjs",
  proofVersion: "tcrn.ds-consumption-proof.v2",
  contractVersion: "ds_consumption_contract_v2",
  storybookRoutes: ["components.html#field-spec-usage", "patterns.html#forms-patterns", "proof.html#ai-consumption-contract"],
  operationFeedbackContract,
  contentScopeContract,
  consumerEvidenceContract,
  evidenceValidator: "evaluateConsumerEvidence",
  positiveLegs: [
    "native binary value choice with a positive measured fit",
    "more-than-two value choice rendered as Select",
    "binary value choice preserves a disabled option in radio and Select branches",
    "radio/Select branch switching preserves controlled and uncontrolled values without synthetic callbacks",
    "ordinary closed collections use the Select-family MultiSelect dropdown; native lists remain compatible and explicit checklists provide a clear action; open strings use free-form SuggestInput",
    "native NumberInput with complete value and range markers",
    "container-driven SettingsLayout with one host and one complete form",
    "correct explicit two-level PageHierarchy with content below parent tabs",
    "correct explicit three-level PageHierarchy with local navigation inside the selected subpage",
    "dictionary category description appears once and every value has its own explanation",
    "client Tooltip and Popover escape clipping ancestors and stay inside viewport bounds",
    "static HTML/CSS overlay bridge moves body-level layers, preserves geometry, and closes a Tooltip on Escape",
    "consumer-declared not-applicable feature absent from the visible entry",
    "operation feedback keeps short status separate from identity and full receipt details across four phases",
    "content scopes keep source/count/phase truth per scope, including one content scope beside one empty scope",
    "consumer evidence validator accepts DOM-backed lifecycle plus visible geometry and separate zoom axes",
    "consumer evidence compares expected, submitted, serialized, and readback values under one declared adapter mode"
  ],
  negativeLegs: [
    "same-looking class/CSS with navigation semantics",
    "three-option radio value choice",
    "Stepper used as numeric entry",
    "numeric value marked clipped",
    "parallel host columns at a narrow content width",
    "radio/Select branch switching resets a valid value or emits a layout-only callback",
    "closed collection uses comma-delimited text or open suggestions reject free-form values",
    "Tooltip carries interactive descendants or accepts invalid/out-of-viewport geometry",
    "static HTML/CSS consumer leaves a clipping-bound layer or claims portal behavior without the DOM bridge",
    "two-level page with an internal left navigation region",
    "three-level page missing its parent-level tabs",
    "overlapping page hierarchy regions",
    "consumer marks a feature not applicable while leaving its entry visible",
    "operation feedback puts a long reason or id in the compact status or removes keyboard-readable details",
    "content scope shows empty or zero for a nonempty/mismatched source or collapses loading/error into empty",
    "consumer evidence relies on HTTP-only feedback, skips error DOM, accepts missing controls as N/A, substitutes DPR for page zoom, or changes a value during serialization/readback"
  ],
  requiredEvidence: [
    "component identity",
    "semantic markers",
    "native element structure",
    "actual DOM cardinality and option disabled state",
    "radio/Select branch-switch value and callback behavior",
    "collection selected/disabled state and open-value free-form behavior",
    "dictionary category/value description presence and duplicate-value detection",
    "overlay boundary, raw placement geometry, and focus/dismissal behavior",
    "static HTML/CSS trigger/layer pairing, body rehoming, and independent Escape state",
    "computed visibility and rendered geometry",
    "complete numeric value visibility",
    "container and overflow policy",
    "consumer-owned feature applicability",
    "operation phase, short status, full identity, details reachability, update notification, and narrow/wide layout",
    "content scope/source/phase/count markers, rendered branch, independent sibling scope, and invalid-state fail-closed readback",
    "expected-to-observed inventory, requested/selected/panel/actual surface, input/result/UI feedback, operation geometry, and dpr/pinch/page zoom measurements",
    "verification stage, parent/child coverage, and exact reuse/invalidation input identity"
  ],
  independenceBoundary: "The proof renders neutral DS fixtures and does not read or execute a Workflow repository.",
  fullSurfaceCoverage: "The browser script rechecks every DS Storybook route carrying the overlay, field-value, collection, open-value, dictionary, operation-feedback, and content-scope surfaces from the inventory, plus DOM-only static HTML/CSS consumer paths and the reusable evidence validator; the inventory is not limited to the fixed screenshots.",
  noOverclaim: "A green DS consumer proof is a local contract candidate; it does not claim product adoption, Owner visual acceptance, publication, or release readiness."
} as const;

export const storybookDocShellVisualOracle = {
  id: "original-storybook-doc-shell-v1",
  baselineManifest: "docs/verification/internal-alpha/visual-signature-baseline.json",
  oracleRecoveryReceipt:
    "internal DS doc-shell restoration plan (owner-held governance record)",
  baselineManifestClassification: "owner_declared_original_storybook_doc_shell_standard",
  metricSourceDisposition:
    "desktop sidebar, header, search rest, and search expanded metrics are retained only after the owner-approved restoration re-expresses the pre-d1d1291 Storybook documentation shell through current Storybook-owned doc-shell selectors and committed proof receipts.",
  sourceHead: "generated_by_internal_alpha_visual_signature_baseline",
  sourceHeadDisposition:
    "This oracle's visual baseline is now the internal-alpha perceptual visual-signature baseline (docs/verification/internal-alpha/visual-signature-baseline.json, tolerance meanAbsolute<=2 / maxCell<=8) enforced by scripts/internal-alpha-browser-proof.mjs; reviewers must use the internal-alpha browser-proof metric readbacks and signature entries plus the final DS commit SHA rather than treating this static field as a freshness claim.",
  retiredExactPngProofDisposition:
    "The prior canonicalized_raw_png_exact_v1 exact-PNG visual oracle (docs/verification/storybook-visual-proof/, sourceHead ec57b606) is retired as pre-INIT-001 history, is not part of pnpm verify, and is superseded by the internal-alpha perceptual visual-signature baseline. Per the INIT-002 ruling, unreproducible exact-PNG signatures are not signed in as an oracle.",
  metricRevisionDisposition:
    "Search shell metrics are intentionally revised to 260px rest and 360px focused/expanded by the visual-unification repair so localized placeholder plus Ctrl K fit without clipping.",
  storybookRoute: "index.html#welcome-governance",
  shellAuthority: "storybook_doc_shell_with_package_primitives",
  packagePrimitives: [
    "@tcrn/ui-react/ShellBrandLockup",
    "@tcrn/ui-react/SearchInput",
    "@tcrn/ui-react/ShellThemeToggle",
    "@tcrn/ui-react/ShellLocaleMenu",
    "@tcrn/ui-react/SideNavCollapseButton"
  ],
  globalProductShellSelectorsForbidden: [
    "data-storybook-shell-authority",
    "data-storybook-product-shell-skin",
    "data-package-backed-product-shell-boundary",
    "data-product-shell-region='side-navigation'",
    "tcrn-product-shell__sidebar",
    "tcrn-product-shell__main"
  ],
  metricEvidence: [
    {
      metric: "desktopSidebarWidthPx",
      value: 360,
      evidencePath:
        "docs/verification/internal-alpha/screenshots/desktop-1440x900-welcome-governance.png",
      signatureBaseline: "docs/verification/internal-alpha/visual-signature-baseline.json",
      signatureKey: "welcome-governance@desktop-1440x900",
      comparisonPolicy: "perceptual_signature_meanAbsolute<=2_maxCell<=8",
      extraction: "Sidebar geometry (responsive clamp(280px, 20vw, 360px), maxing at 360px and yielding 288px at the 1440px proof viewport) is asserted by the internal-alpha browser-proof sidebar-width metric readback; visual composition is evidenced by the perceptual visual-signature entry welcome-governance@desktop-1440x900."
    },
    {
      metric: "desktopTopbarHeightPx",
      value: 96,
      evidencePath:
        "docs/verification/internal-alpha/screenshots/desktop-1440x900-welcome-governance.png",
      signatureBaseline: "docs/verification/internal-alpha/visual-signature-baseline.json",
      signatureKey: "welcome-governance@desktop-1440x900",
      comparisonPolicy: "perceptual_signature_meanAbsolute<=2_maxCell<=8",
      extraction: "Header/control band height=96px is asserted by the internal-alpha browser-proof topbar-height metric readback; visual composition is evidenced by the perceptual visual-signature entry welcome-governance@desktop-1440x900."
    },
    {
      metric: "searchRestWidthPx",
      value: 260,
      evidencePath:
        "docs/verification/internal-alpha/screenshots/desktop-1440x900-welcome-governance.png",
      signatureBaseline: "docs/verification/internal-alpha/visual-signature-baseline.json",
      signatureKey: "welcome-governance@desktop-1440x900",
      comparisonPolicy: "perceptual_signature_meanAbsolute<=2_maxCell<=8",
      extraction: "Compact search shell width=260px (localized placeholder and shortcut fit without clipping) is asserted by the internal-alpha browser-proof search-rest metric readback; visual composition is evidenced by the perceptual visual-signature entry welcome-governance@desktop-1440x900."
    },
    {
      metric: "searchExpandedWidthPx",
      value: 360,
      evidencePath:
        "docs/verification/internal-alpha/screenshots/desktop-1440x900-welcome-governance.png",
      signatureBaseline: "docs/verification/internal-alpha/visual-signature-baseline.json",
      signatureKey: "welcome-governance@desktop-1440x900",
      comparisonPolicy: "perceptual_signature_meanAbsolute<=2_maxCell<=8",
      extraction: "Focused search state width=360px with one root SearchInput border and no nested input border is asserted by the internal-alpha browser-proof search-focused metric readback; visual composition is evidenced by the perceptual visual-signature entry welcome-governance@desktop-1440x900."
    }
  ],
  shellMetrics: {
    desktopSidebarWidthPx: 288,
    desktopSidebarMinWidthPx: 280,
    desktopSidebarPreferredViewportRatio: 0.2,
    desktopSidebarMaxWidthPx: 360,
    desktopSidebarTolerancePx: 2,
    desktopTopbarHeightPx: 96,
    desktopTopbarTolerancePx: 2,
    searchRestWidthPx: 260,
    searchExpandedWidthPx: 360,
    searchHeightPx: 36,
    searchBorderColor: "rgb(142, 142, 136)",
    searchBorderRadiusPx: 4,
    themeToggleSizePx: 36,
    themeToggleRadiusPx: 999,
    localeTriggerHeightPx: 36,
    trailingUtilityGapMinPx: 16,
    trailingUtilityGapMaxPx: 32
  },
  requiredProofRoutes: [
    "index.html?theme=light&locale=zh-CN#welcome-governance",
    "patterns.html?theme=light&locale=zh-CN#forms-patterns",
    "components.html?theme=light&locale=zh-CN#component-family-index",
    "proof.html?theme=light&locale=zh-CN#proof-matrix",
    "change-log.html?theme=light&locale=zh-CN#local-changelog"
  ],
  reducedMotionExpectation:
    "Storybook doc-shell search/theme/menu/control transitions and animations are suppressed or reduced to the DS-approved zero-duration fallback under prefers-reduced-motion."
} as const;

export const foundationVisualStandards: readonly FoundationVisualStandard[] = [
  {
    id: "visual-philosophy-ownership",
    label: "Visual philosophy and ownership",
    category: "Foundation",
    sourcePaths: [
      "apps/storybook/src/build/foundation-visual-standards.ts",
      "apps/storybook/src/alpha-styles.ts",
      "apps/storybook/src/story-demo-styles.ts",
      "packages/ui-react/src/components/Navigation/Navigation.tsx"
    ],
    storybookRoutes: ["foundations.html#foundation-visual-standards", "proof.html#ai-consumption-contract"],
    authorityLevel: "storybook_visual_oracle",
    readbackFields: ["authorityLevel", "shellAuthority", "visualOracleId", "baselineManifest", "forbiddenGlobalProductShellSelectors"],
    allowedConsumerInputs: ["route IA", "localized labels", "content slots", "DS-defined callbacks"],
    forbiddenConsumerOverrides: ["private shell clones", "package-equivalent local controls", "Storybook-only compliance claims"],
    proofExpectations: ["data-doc-shell online-docs marker", "global ProductShell shell selector count is zero", "doc-shell category navigation is present and scrollable"],
    missingStandardEscalation: "Return to DS for standards admission before product or Storybook visual implementation."
  },
  {
    id: "layout-rhythm",
    label: "Layout and rhythm",
    category: "Foundation",
    sourcePaths: ["apps/storybook/src/alpha-styles.ts", "apps/storybook/src/story-demo-styles.ts", "packages/ui-react/src/components/Navigation/Navigation.tsx"],
    storybookRoutes: ["index.html#welcome-governance", "patterns.html#forms-patterns"],
    authorityLevel: "storybook_visual_oracle",
    readbackFields: ["sidebarWidth", "topbarHeight", "contentStart", "pageHeadPosition", "crossSectionSignature"],
    allowedConsumerInputs: ["route-level content density", "content ordering within admitted layout slots"],
    forbiddenConsumerOverrides: ["shared shell grid", "topbar utility alignment", "sidebar width", "content rhythm tokens"],
    proofExpectations: ["cross-section shell parity", "topbar/content rhythm deltas within tolerance", "no page overflow"],
    missingStandardEscalation: "Block implementation if no route-specific Storybook visual oracle names the layout rhythm."
  },
  {
    id: "spacing-density",
    label: "Spacing and density",
    category: "Foundation",
    sourcePaths: ["apps/storybook/src/alpha-styles.ts", "apps/storybook/src/story-demo-styles.ts", "packages/ui-react/src/components/DataDisplay/DataDisplay.tsx", "packages/ui-react/src/components/Layout/Layout.tsx", "packages/ui-react/src/components/Form/Form.tsx"],
    storybookRoutes: ["foundations.html#foundation-visual-standards", "components.html#table-record-index-spec", "components.html#field-spec-usage", "components.html#records-and-boards-components-spec", "components.html#documents-and-collaboration-components-spec", "patterns.html#forms-patterns"],
    authorityLevel: "package_authority",
    readbackFields: ["densityScale", "panelGap", "tableContainment", "mobileStacking", "overflowContainment", "recordsDensityComponents", "documentsDensityComponents", "settingsLayoutContract", "pageHierarchyContract", "fieldValueSelectionContract", "dictionaryContentContract", "operationFeedbackContract", "contentScopeContract", "containerQueries"],
    allowedConsumerInputs: ["content-specific row data", "table columns", "local filters", "documented functional display density props", "documented documents and collaboration static content props"],
    forbiddenConsumerOverrides: ["ad hoc dense card padding", "global table overflow rules", "page-level horizontal scrollers", "consumer-local row/list/group/detail density systems", "consumer-local tree/document/comment/template systems"],
    proofExpectations: ["mobile no page-level overflow", "table-local overflow only", "long-token containment", "SettingsLayout uses frame/content container queries and one complete form column", "RecordRow/RecordTable/DetailLayout examples fit without overlarge card regression", "TreeNav/DocumentCanvas/TocRail examples fit without vendor-asset leakage"],
    missingStandardEscalation: "Skip product-specific reusable pattern work and list the missing DS primitive/pattern."
  },
  {
    id: "typography-localization",
    label: "Typography and localization",
    category: "Foundation",
    sourcePaths: [
      "apps/storybook/src/build/locales/storybook-locale-text.ts",
      "apps/storybook/src/build/locales/storybook-content-text.ts",
      "packages/ui-copy-state/src"
    ],
    storybookRoutes: ["foundations.html#i18n-theme-contract", "foundations.html#foundation-visual-standards"],
    authorityLevel: "package_authority",
    readbackFields: ["htmlLang", "visibleLocale", "localizedShellLabels", "forbiddenEnglishLeaks", "typeFamily"],
    allowedConsumerInputs: ["approved locale data", "approved product copy keys", "proper names and stable machine ids"],
    forbiddenConsumerOverrides: ["hard-coded shell labels", "English-only category labels", "local type ramps"],
    proofExpectations: ["zh-CN shell/nav/current-location/search labels localized", "story ids and route ids remain stable"],
    missingStandardEscalation: "Block if visible shell labels lack localization; route copy-key admission before implementation."
  },
  {
    id: "color-elevation-border-radius-focus",
    label: "Color, elevation, border radius, and focus",
    category: "Foundation",
    sourcePaths: ["apps/storybook/src/alpha-styles.ts", "apps/storybook/src/story-demo-styles.ts", "packages/ui-react/src/components/Navigation/Navigation.tsx"],
    storybookRoutes: ["style-guide.html#color-palette", "components.html#navigation-shell-spec"],
    authorityLevel: "package_authority",
    readbackFields: ["surfaceColor", "borderColor", "controlRadius", "themeToggleRadius", "focusOutline", "boxShadow"],
    allowedConsumerInputs: ["theme mode", "semantic state", "DS component variant"],
    forbiddenConsumerOverrides: ["square shell icon toggles", "inner-input focus rectangles", "custom focus shadows", "local border systems"],
    proofExpectations: ["theme toggle 36x36 radius 999", "search border/radius parity", "focus outline on wrapper surface"],
    missingStandardEscalation: "Block if actual generated Storybook shell drifts from the restored Storybook doc-shell oracle values."
  },
  {
    id: "component-composition",
    label: "Component composition",
    category: "Foundation",
    sourcePaths: ["packages/ui-react/src/index.tsx", "apps/storybook/src/contract-stories/story-content.tsx"],
    storybookRoutes: ["components.html#component-family-index", "components.html#field-spec-usage", "components.html#navigation-shell-spec", "components.html#records-and-boards-components-spec", "patterns.html#forms-patterns", "patterns.html#records-and-boards-patterns"],
    authorityLevel: "package_authority",
    readbackFields: ["packageExport", "variantProps", "slotContract", "componentIdentity", "storyRoute", "productSuffixColorHierarchy", "functionalDisplayDensityRegistry", "settingControlSelectionContract", "fieldValueSelectionContract", "dictionaryContentContract", "overlayBoundaryContract", "pageHierarchyContract"],
    allowedConsumerInputs: ["IA/data", "locale data", "content slots", "documented callbacks"],
    forbiddenConsumerOverrides: ["local reusable clones", "Storybook-only prototype imports", "package-looking selectors outside DS", "consumer-local page-header/filter/list/group/board/detail/activity systems"],
    proofExpectations: ["package import receipt", "component identity markers", "SettingChoice, MultiSelect, SuggestInput, DictionaryTable, ContentScope, OperationFeedback, and NumberInput semantic markers", "ProductLogo suffix accent hierarchy", "no visible local UI namespace", "functional display layout and density components exported by @tcrn/ui-react"],
    missingStandardEscalation: "Return a needed DS component/pattern list instead of building product-local shared UI."
  },
  {
    id: "interaction-motion-accessibility",
    label: "Interaction, motion, and accessibility",
    category: "Foundation",
    sourcePaths: ["packages/ui-react/src/components/Navigation/Navigation.tsx", "packages/ui-react/src/components/Form/Form.tsx", "packages/ui-react/src/components/Overlay/Overlay.tsx", "scripts/internal-alpha-browser-proof.mjs", "scripts/ds-consumption-proof.mjs", "scripts/full-surface-remediation-proof.mjs"],
    storybookRoutes: ["style-guide.html#icons-motion", "components.html#field-spec-usage", "patterns.html#forms-patterns", "proof.html#overlay-focus"],
    authorityLevel: "proof_contract",
    readbackFields: ["transitionProperty", "duration", "easing", "keyboardActivation", "focusReturn", "reducedMotion", "overlayBoundaryContract", "operationFeedbackContract", "consumerEvidenceContract"],
    allowedConsumerInputs: ["callback implementations", "route-owned state persistence", "semantic disabled reasons"],
    forbiddenConsumerOverrides: ["wrapper-only event delegation", "static endpoint-only motion proof", "unproven no-op affordances"],
    proofExpectations: ["Enter/Space activation", "native numeric keyboard and paste entry", "Escape/blur dismissal", "sampled motion timeline", "reduced-motion suppression"],
    missingStandardEscalation: "Block owner-quality claims until browser interaction proof exercises rendered behavior."
  },
  {
    id: "responsive-mobile",
    label: "Responsive and mobile",
    category: "Foundation",
    sourcePaths: ["apps/storybook/src/alpha-styles.ts", "apps/storybook/src/story-demo-styles.ts", "packages/ui-react/src/components/Navigation/Navigation.tsx", "packages/ui-react/src/components/Layout/Layout.tsx"],
    storybookRoutes: ["foundations.html#foundation-visual-standards", "components.html#field-spec-usage", "patterns.html#forms-patterns", "proof.html#owner-quality-product-shell"],
    authorityLevel: "storybook_visual_oracle",
    readbackFields: ["viewport", "searchMaxWidth", "collapsePolicy", "pageOverflow", "tableLocalOverflow", "overlayBoundaryContract", "pageHierarchyContract"],
    allowedConsumerInputs: ["mobile content order", "mobile route content", "approved hidden-affordance policy"],
    forbiddenConsumerOverrides: ["page-level horizontal overflow", "clickable mobile no-op controls", "full-width search beyond accepted cap"],
    proofExpectations: ["390px mobile no page overflow", "390/768/980/1024/1180/1280/1440 container matrix", "nested narrow content stacks without clipping", "mobile search cap", "mobile collapse hidden/disabled per oracle"],
    missingStandardEscalation: "Return a DS/mobile policy blocker if the oracle does not admit the requested mobile behavior."
  },
  {
    id: "evidence-proof-oracle",
    label: "Evidence, proof, and visual oracle",
    category: "Foundation",
    sourcePaths: [
      "AGENTS.md",
      "apps/storybook/src/build/ai-consumption-contract.ts",
      "scripts/storybook-smoke.mjs",
      "scripts/internal-alpha-browser-proof.mjs",
      "scripts/ds-consumption-proof.mjs",
      "scripts/full-surface-remediation-proof.mjs",
      "scripts/lib/story-budget.mjs"
    ],
    storybookRoutes: ["proof.html#ai-consumption-contract", "proof.html#proof-matrix"],
    authorityLevel: "proof_contract",
    readbackFields: ["contractPayloadDigest", "artifactPaths", "browserMetrics", "screenshotPaths", "noOverclaimBoundaries", "verificationCadenceContract", "consumerVerificationContract", "consumerEvidenceContract", "operationFeedbackContract", "contentScopeContract", "fieldValueSelectionContract", "dictionaryContentContract", "overlayBoundaryContract", "pageHierarchyContract"],
    allowedConsumerInputs: ["proof artifact paths", "route-specific metric readbacks"],
    forbiddenConsumerOverrides: ["marker-only proof", "stale screenshots as current oracle", "hidden failed proof gaps"],
    proofExpectations: ["AI contract digest verified", "llms alignment", "positive and negative consumer legs", "browser screenshot/metric receipts", "no-overclaim scan"],
    missingStandardEscalation: "Do not close implementation until proof receipts fail closed and are source-visible."
  },
  {
    id: "consumer-enforcement",
    label: "Consumer enforcement and reject criteria",
    category: "Foundation",
    sourcePaths: ["AGENTS.md", "apps/storybook/src/build/foundation-visual-standards.ts", "apps/storybook/src/build/ai-consumption-contract.ts", "scripts/ds-consumption-proof.mjs"],
    storybookRoutes: ["foundations.html#foundation-visual-standards", "proof.html#ai-consumption-contract"],
    authorityLevel: "consumer_contract",
    readbackFields: ["allowedInputs", "forbiddenOverrides", "rejectCriteria", "missingStandardEscalation", "routeOwner", "settingControlSelectionContract", "fieldValueSelectionContract", "dictionaryContentContract", "operationFeedbackContract", "contentScopeContract", "overlayBoundaryContract", "settingsLayoutContract", "pageHierarchyContract", "verificationCadenceContract", "consumerVerificationContract", "consumerEvidenceContract"],
    allowedConsumerInputs: ["product data", "IA labels", "copy keys", "documented DS props", "callbacks"],
    forbiddenConsumerOverrides: ["consumer-local shared spacing", "consumer-local typography", "shell-control geometry", "package-equivalent styles", "consumer-local functional display layout/density components"],
    proofExpectations: ["consumer contract present in AI JSON", "local style clone reject criteria present", "llms first-read alignment"],
    missingStandardEscalation: "Route a DS standards admission request before product-local framework/style work."
  }
];

export const consumerVisualStyleContract = {
  id: "consumer-visual-style-contract-v1",
  disposition: "fail_closed_consumer_contract",
  storybookRoute: "foundations.html#foundation-visual-standards",
  aiContractField: "consumerVisualStyleContract",
  allowedConsumerInputs: [
    "product data",
    "IA and route labels",
    "localized copy keys",
    "content slots",
    "documented package props",
    "DS-defined callbacks"
  ],
  forbiddenConsumerOverrides: [
    "consumer-local shared spacing/density systems",
    "consumer-local type ramps",
    "consumer-local shell-control geometry",
    "consumer-local ProductShell/search/theme/locale/sidebar clones",
    "consumer-local page header, route tabs, quick filters, record rows, lists, groups, board density, detail rails, activity feeds, and reference layout clones",
    "Storybook-only compliance claims",
    "package-equivalent visual systems outside @tcrn/ui-react"
  ],
  requiredReadbackFields: [
    "foundationVisualStandards",
    "storybookDocShellVisualOracle",
    "allowedConsumerInputs",
    "forbiddenConsumerOverrides",
    "proofExpectations",
    "missingStandardEscalation",
    "settingControlSelectionContract",
    "settingsLayoutContract",
    "pageHierarchyContract",
    "operationFeedbackContract",
    "contentScopeContract",
    "consumerEvidenceContract",
    "verificationCadenceContract",
    "consumerVerificationContract"
  ],
  rejectCriteria: [
    "A product claims DS compliance without naming a foundation standard id and Storybook route.",
    "A product fixes shared typography, spacing, shell-control geometry, or ProductShell visual behavior locally instead of routing DS standards admission.",
    "A product builds reusable record rows, filters, groups, board cards, detail rails, or activity feeds locally instead of consuming admitted functional display package exports.",
    "A proof compares only endpoints or markers and omits computed style, motion, i18n, overflow, and browser interaction metrics.",
    "A proof accepts matching class names or CSS bytes without checking component identity, semantic purpose, native structure, value visibility, and container policy.",
    "A configuration page keeps parallel host forms or hides fields when the actual content container is below the admitted threshold.",
    "Storybook surfaces hide mandatory owner-review/no-overclaim/proof posture inside optional disclosure."
  ]
} as const;

export const foundationVisualStandardCategoryIds = foundationVisualStandards.map((standard) => standard.id);

export const foundationVisualStandardsReadback = {
  registryId: "foundation-visual-standards-v1",
  storybookRoute: "foundations.html#foundation-visual-standards",
  categoryCount: foundationVisualStandards.length,
  categoryIds: foundationVisualStandardCategoryIds,
  storybookDocShellVisualOracle,
  consumerVisualStyleContract,
  settingControlSelectionContract,
  fieldValueSelectionContract,
  clipboardCopyContract,
  settingsLayoutContract,
  pageHierarchyContract,
  verificationCadenceContract,
  operationFeedbackContract,
  contentScopeContract,
  consumerEvidenceContract,
  consumerVerificationContract,
  noOverclaimBoundary:
    "Foundation visual standards define local Storybook and consumer-contract authority only; package publication, product adoption, owner acceptance, release readiness, and live dispatch are not claimed."
} as const;
