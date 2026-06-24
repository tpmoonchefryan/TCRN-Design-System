# Manual Keyboard Checklist

Route: `route_tcrn_design_system_internal_alpha_hardening_proof_implementation`

- [x] tab-reachable controls: passed. Evidence: Buttons and form controls are native focusable controls in rendered story DOM.
- [x] dialog initial focus: passed. Evidence: button:Close
- [x] escape closes dialog: passed. Evidence: button:Open confirmation
- [x] focus returns to trigger: passed. Evidence: button:Open confirmation
- [x] dialog capability metadata truthfulness: passed. Evidence: interactive={"focusEntry":"implemented","tabContainment":"not-implemented","focusTrap":null,"escapeClose":"implemented","focusReturn":"implemented"} static={"focusEntry":"implemented","tabContainment":"not-implemented","focusTrap":null,"escapeClose":"requires-on-open-change","focusReturn":"requires-trigger-ref"}
- [x] reduced motion: passed. Evidence: Browser proof emulated reducedMotion=reduce for all viewports.
