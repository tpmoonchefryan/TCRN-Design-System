import { approvedSource } from "../approved-source.js";
import { approvedApi } from "../approved-api.js";
import type { createAiRuleBundle, AiCandidate } from "./ai-rule-bundle.js";

export function createAiConsumptionContract(candidate: AiCandidate, fontFiles: unknown[], bundle: ReturnType<typeof createAiRuleBundle>) {
  return {
    schemaVersion: "tcrn.storybook.published-source.v1", candidate,
    standardSource: approvedSource.site, boards: approvedSource.boards, components: approvedApi,
    assets: { favicon: { productId: "design-system", variant: "tile-deep", sourceBoard: "04-brand", sourceSection: "C" }, fonts: fontFiles },
    implementationFidelity: {
      formShortcut: { board: "06-inputs", selector: ".sw>kbd", role: "ink-3" },
      shellShortcut: { boards: ["07a-shell-upper", "07b-shell-lower"], selector: ".ts-srch kbd", role: "ink-2" },
      validation: "pending original batch-end checks",
    },
    publishedStandardConflicts: [
      "K1: published suffix text colors conflict with the 4.5 text threshold",
      "S03-C01: published06 dark shortcut ink-3 has nominal wash/panel contrast 3.876922 below4.5;07 ink-2 is a separate published role",
    ],
    sourceWordingAmbiguities: ["K5: strong prose says no color change; explicit specimen and CSS use ink/600; implementation retains the actual sample"],
    unconfirmedProposals: {
      state: "selected directions only; visually unconfirmed and unapplied", K1: "suffix text contrast direction retained", K5: "strong wording direction retained",
      C01: { minute: "TCRN-DS-MIN-20261103-SHORTCUT-INK D1-D4", proposedRole: "only06 shortcut text shares ink-2", day: "#4f4c43", night: "#a9a69c", textMinimum: 4.5 },
      minute: "TCRN-DS-MIN-20261102-STANDARD-AMENDMENTS D1-D4",
    },
    ownerClarificationMinute: "TCRN-DS-MIN-20261104-VISUAL-BEFORE-STANDARD D1-D4", publicationRequest: "withdrawn",
    preferenceStorage: { documentation: "local anonymous documentation theme; locale is part of the page URL", consumerObligation: "supply per-user per-product server preference adapter (07b L60)" },
    ownerVisualAcceptance: "not-performed",
    ownerVisualAcceptanceScope: "current package candidate",
    priorOwnerVisualAcceptance: {
      minute: "minutes:d8848542e0a64a1e26d07aaf",
      scope: "first Storybook portal layout at the recorded prior candidate",
    },
    publication: "local-candidate-only", identity: bundle.identity,
    aiIndex: "ai/index.json", rules: bundle.rules,
  };
}
