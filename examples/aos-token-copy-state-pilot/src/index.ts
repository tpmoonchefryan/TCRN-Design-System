import { createTokenMap } from "@tcrn/ui-tokens";
import { presentCopyState } from "@tcrn/ui-copy-state";

export function createSyntheticAosReadback() {
  return {
    tokenCount: Object.keys(createTokenMap()).length,
    readbackState: presentCopyState({ state: "local_only" }),
    productRepoMutation: false,
    productAcceptanceClaim: false
  };
}
