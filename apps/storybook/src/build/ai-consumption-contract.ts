import { approvedSource } from "../approved-source.js";
import { approvedApi } from "../approved-api.js";
import type { createAiRuleBundle, AiCandidate } from "./ai-rule-bundle.js";

export interface AiReviewStatus {
  unconfirmedProposals: string[];
  proposalState: string;
  proposalMinutes: Record<string, string>;
  ownerClarificationMinute: string;
  publicationRequest: string;
  ownerVisualAcceptance: string;
  adoptedAmendments: {
    ids: string[];
    minute: string;
    authorSourceCommit: string;
    sourcePublication: string;
    publicationHoldMinute: string;
  };
  adoptedSupport: {
    minute: string;
    state: string;
    patterns: string[];
    formalComponents: number;
    builtInLocales: number;
    productLocales: string[];
  };
}

export function createAiConsumptionContract(candidate: AiCandidate, fontFiles: unknown[], bundle: ReturnType<typeof createAiRuleBundle>, reviewStatus: AiReviewStatus) {
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
    publishedSourceLimitations: [
      "Pinned v1 retains six K1 text contrast failures and one S03-C01 dark shortcut failure against the unchanged 4.5 threshold",
      "03 icon panel contrast labels and 07b menu width wording retain their published-v1 bytes; the adopted author-source corrections are unpublished",
    ],
    ...reviewStatus,
    preferenceStorage: { documentation: "local anonymous documentation theme; locale is part of the page URL", consumerObligation: "supply per-user per-product server preference adapter (07b L60)" },
    ownerVisualAcceptanceScope: "current package candidate",
    priorOwnerVisualAcceptance: {
      minute: "minutes:d8848542e0a64a1e26d07aaf",
      scope: "first Storybook portal layout at the recorded prior candidate",
    },
    publication: "local-candidate-only", identity: bundle.identity,
    aiIndex: "ai/index.json", rules: bundle.rules,
  };
}
