import type { ReactNode } from "react";

export type ContractStoryGroup = "Welcome" | "Style Guide" | "Foundations" | "Components" | "Patterns" | "Proof" | "Change Log";

export interface ContractStory {
  id: string;
  title: string;
  group: ContractStoryGroup;
  category: string;
  categoryId: string;
  description: string;
  sourcePath: string;
  packageAuthority: string;
  readiness: string;
  proofPosture: string;
  render: () => ReactNode;
}
