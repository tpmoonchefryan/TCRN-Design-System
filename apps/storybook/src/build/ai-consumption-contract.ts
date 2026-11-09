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
  ownerVisualAcceptanceMinute: string;
  ownerVisualAcceptanceCommit: string;
  ownerVisualAcceptanceScope: string;
  adoptedAmendments: {
    ids: string[];
    minute: string;
    authorSourceCommit: string;
    sourcePublication: string;
    publicationMinute: string;
    publicationReadbackMinute: string;
    priorPublicationHoldMinute: string;
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
      formShortcut: { board: "06-inputs", selector: ".sw>kbd", role: "ink-2" },
      shellShortcut: { boards: ["07a-shell-upper", "07b-shell-lower"], selector: ".ts-srch kbd", role: "ink-2" },
      validation: "pending original batch-end checks",
    },
    publishedStandardConflicts: [],
    sourceWordingAmbiguities: [],
    publishedSourceLimitations: [
      "Anonymous HTTP reads of the public Site returned Cloudflare 403; the native saved-source publication and normal in-app browser readback are retained separately",
    ],
    ...reviewStatus,
    preferenceStorage: { documentation: "local anonymous documentation theme; locale is part of the page URL", consumerObligation: "supply per-user per-product server preference adapter (07b L60)" },
    priorOwnerVisualAcceptance: {
      minute: "minutes:024a8b72088fac0970916091#D1",
      commit: "69e37265d0f5bfa766cb6f97f85aa3d289fb9abc",
      scope: "S11 local candidate checklist: button/field widths, category/status display, Storybook entry, date focus and new states of the existing 28 components; only at its recorded commit",
    },
    publication: "local-candidate-only", identity: bundle.identity,
    aiIndex: "ai/index.json", rules: bundle.rules,
  };
}
