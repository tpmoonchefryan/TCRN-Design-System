import type { ContractStoryGroup } from "../stories.js";

export function groupSlug(group: ContractStoryGroup): string {
  return group.toLowerCase().replace(/\s+/g, "-");
}

export function groupFileName(group: ContractStoryGroup): string {
  return group === "Welcome" ? "index.html" : `${groupSlug(group)}.html`;
}

export const navAbbreviations: Record<ContractStoryGroup, string> = {
  Welcome: "W",
  "Style Guide": "SG",
  Foundations: "F",
  Components: "C",
  Patterns: "P",
  Proof: "PF",
  "Change Log": "CL"
};

