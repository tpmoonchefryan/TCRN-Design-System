import type { ReactNode } from "react";

export type ContractStoryGroup = "Welcome" | "Style Guide" | "Foundations" | "Components" | "Patterns" | "Proof" | "Change Log";

export interface ContractStory {
  id: string;
  title: string;
  group: ContractStoryGroup;
  description: string;
  render: () => ReactNode;
}
