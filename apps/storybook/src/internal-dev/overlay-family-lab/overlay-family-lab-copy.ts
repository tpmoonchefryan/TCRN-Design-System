export const overlayFamilyLabCopy = {
  title: "Overlay family lab",
  eyebrow: "Internal developer-only lab",
  description:
    "A narrow internal surface for checking overlay-family behavior with public @tcrn/ui-react primitives. This is not contract documentation.",
  boundary:
    "Contract stories, static docs, package publication, consumer adoption, release readiness, and acceptance state are not moved by this lab.",
  packageProvidedLabel: "Package-provided behavior",
  ownerWiringLabel: "Owner wiring in this lab",
  markersLabel: "No-overclaim markers",
  drawerSharedSemantics:
    "DetailDrawer and ActionDrawer both render structural complementary drawers. The lab toggles visibility and names their distinct read-versus-action intent without claiming modal behavior.",
  disabledConfirmationCopy:
    "The disabled confirmation action exposes assistive disabled-reason copy from Button through ConfirmActionDialog."
} as const;
