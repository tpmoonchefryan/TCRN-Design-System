export const aiConsumptionContract = {
  contractVersion: "ai_consumption_contract_v1",
  storyId: "ai-consumption-contract",
  route: "proof.html#ai-consumption-contract",
  requiredBeforeProductFrontendImplementation: [
    "read_ai_consumption_contract",
    "use_tcrn_i18n_and_copy_state",
    "use_admitted_brand_asset_or_route_brand_component_admission",
    "import_package_backed_ds_primitives",
    "use_design_tokens_and_accessibility_rules",
    "prove_product_adoption_before_ds_compliance_claim"
  ],
  requiredProof: [
    "contract_story_readback",
    "i18n_copy_state_receipt",
    "brand_surface_receipt",
    "package_import_receipt",
    "product_adoption_route_receipt"
  ],
  brandSurfaceDisposition:
    "Product implementations may use admitted brand assets only. Storybook-only brand lockups are prototypes and are not package-backed product exports.",
  i18nDisposition:
    "All visible product UI copy must use the approved locale and copy-state contract before rendering.",
  componentConsumptionDisposition:
    "Product implementations must import package-backed Design System primitives instead of rebuilding local clones.",
  tokenConsumptionDisposition:
    "Product implementations must use Design System tokens, reduced-motion rules, and accessibility states before custom CSS.",
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
