export type OverlayFamilyScenarioId =
  | "dialog"
  | "popover"
  | "confirm-action-dialog"
  | "drawer-family";

export interface OverlayFamilyScenario {
  id: OverlayFamilyScenarioId;
  title: string;
  packageProvided: readonly string[];
  ownerWiring: readonly string[];
}

export const overlayFamilyNoOverclaimMarkers = {
  "data-internal-dev-surface": "overlay-family-lab",
  "data-contract-docs": "excluded",
  "data-storybook-contract-truth": "not-authoritative",
  "data-package-publication": "not-claimed",
  "data-storybook-docs-publication": "not-claimed",
  "data-consumer-adoption": "not-claimed",
  "data-release-readiness": "not-claimed",
  "data-acceptance-state": "not-moved"
} as const;

export const overlayFamilyScenarios: readonly OverlayFamilyScenario[] = [
  {
    id: "dialog",
    title: "Dialog",
    packageProvided: [
      "role=dialog with aria-modal=true",
      "focus entry when opened",
      "capability metadata for focus entry, Escape close, focus return, and tab containment"
    ],
    ownerWiring: [
      "trigger ref",
      "initial focus ref",
      "onOpenChange for close state",
      "button-triggered open and close"
    ]
  },
  {
    id: "popover",
    title: "Popover",
    packageProvided: [
      "role=dialog with aria-modal=false",
      "non-modal popover scope and placement metadata",
      "focus entry when opened"
    ],
    ownerWiring: [
      "trigger ref",
      "initial focus ref",
      "onOpenChange for Escape close and focus return",
      "button-triggered open and close"
    ]
  },
  {
    id: "confirm-action-dialog",
    title: "ConfirmActionDialog",
    packageProvided: [
      "disabled confirmation action copy",
      "initial focus on cancel action",
      "dialog surface through public ConfirmActionDialog"
    ],
    ownerWiring: [
      "mount/unmount state",
      "trigger focus return",
      "Escape close wrapper because ConfirmActionDialog does not own route-level close state"
    ]
  },
  {
    id: "drawer-family",
    title: "DetailDrawer and ActionDrawer",
    packageProvided: [
      "role=complementary",
      "data-modal-scope=structural-drawer",
      "aria-hidden reflects open state"
    ],
    ownerWiring: [
      "detail drawer visibility toggle",
      "action drawer visibility toggle",
      "explicit distinction between read context and action context"
    ]
  }
];
