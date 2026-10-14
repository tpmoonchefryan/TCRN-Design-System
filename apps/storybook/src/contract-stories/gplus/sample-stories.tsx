// The five first-batch sample stories on the top-band shell: typography-sample-billing,
// icon-sample-project, brand-sample-product, actions-sample-project and inputs-sample-members. Each
// is the D section of its board — the package ProductShell on the top-band shell (TCRN-DS-SUB-134)
// with generic product content (billing, projects, products, the roster, invite members) — shown as
// a light block and a night block that differ only in data-tcrn-theme on the block and the theme the
// shell control reports. The story ids stay (C-9); the actions sample's page is the roster now, as on
// its board. The composition-three sample (composition-three-sample) follows them: the same top-band
// shell with the page centred at the content width (1040px). It belongs to no family, so it has no
// matrix and is registered after the five family pairs. The story titles and descriptions are the
// five-locale text of storybook-locale-text.ts and describe the top-band shell (TCRN-DS-SUB-173); the
// actions sample's title names its roster page, its id stays.
import type { ContractStory } from "../types.js";
import { storyCategoryFor, storyGovernanceFor } from "../governance.js";
import { GplusSampleBoardView, type GplusSampleBoard } from "./samples/composition-one.js";
import { GplusCompositionThreeView } from "./samples/composition-three.js";

export const gplusSampleSourcePath = "apps/storybook/src/contract-stories/gplus/sample-stories.tsx";

export const gplusSampleStoryIds: Readonly<Record<GplusSampleBoard, string>> = {
  typography: "typography-sample-billing",
  icon: "icon-sample-project",
  brand: "brand-sample-product",
  actions: "actions-sample-project",
  inputs: "inputs-sample-members"
};

export const gplusSampleBoardsInOrder: readonly GplusSampleBoard[] = ["typography", "icon", "brand", "actions", "inputs"];

interface SampleStoryText {
  title: string;
  description: string;
}

/** English source text; the five locales live in storybook-locale-text.ts under story.<id>.*. */
export const gplusSampleStoryText: Readonly<Record<GplusSampleBoard, SampleStoryText>> = {
  typography: {
    title: "Typography sample: billing",
    description: "A billing page on the top-band shell: serif page title and metric numerals, a numbered section label, monospaced IDs, a search hit and links, light and night."
  },
  icon: {
    title: "Icon sample: projects",
    description: "A project list on the top-band shell: the band's menu toggle and bell, header, toolbar, pagination and row icons, light and night."
  },
  brand: {
    title: "Brand sample: products",
    description: "A product page on the top-band shell: the brand button's mark and wordmark in the band, product lockups in the table and the registry note, light and night."
  },
  actions: {
    title: "Actions sample: roster",
    description: "A roster page on the top-band shell: quiet, secondary and primary header actions, two button groups and a link button, row copy and open actions, and a danger zone, light and night."
  },
  inputs: {
    title: "Inputs sample: invite members",
    description: "An invitation form on the top-band shell with text, select, multi-select, number, date, text-area, radio, switch and checkbox controls, and the shell's search in its full menu, light and night."
  }
};

function sampleStory(board: GplusSampleBoard): ContractStory {
  const id = gplusSampleStoryIds[board];
  const governance = storyGovernanceFor(id, "Components");
  const category = storyCategoryFor("Components", governance.categoryId);
  return {
    id,
    title: gplusSampleStoryText[board].title,
    group: "Components",
    description: gplusSampleStoryText[board].description,
    ...governance,
    sourcePath: gplusSampleSourcePath,
    category: category.label,
    render: () => <GplusSampleBoardView board={board} storyId={id} />
  };
}

export const gplusSampleStories: ContractStory[] = gplusSampleBoardsInOrder.map(sampleStory);

export const gplusCompositionThreeStoryId = "composition-three-sample";

/** English source text; the five locales live in storybook-locale-text.ts under story.composition-three-sample.*. */
export const gplusCompositionThreeStoryText: Readonly<SampleStoryText> = {
  title: "Composition three sample: projects",
  description: "A project page on the top-band shell with the page centred at the content width (1040px): the band is the one navigation bar across the top, light and night."
};

function compositionThreeStory(): ContractStory {
  const id = gplusCompositionThreeStoryId;
  const governance = storyGovernanceFor(id, "Components");
  const category = storyCategoryFor("Components", governance.categoryId);
  return {
    id,
    title: gplusCompositionThreeStoryText.title,
    group: "Components",
    description: gplusCompositionThreeStoryText.description,
    ...governance,
    sourcePath: gplusSampleSourcePath,
    category: category.label,
    render: () => <GplusCompositionThreeView storyId={id} />
  };
}

export const gplusCompositionThreeStory: ContractStory = compositionThreeStory();
