// The five first-batch family matrices as contract stories: typography-matrix, icon-matrix,
// brand-matrix, actions-matrix and inputs-matrix. Each board renders the contract cell count
// (typography 44, icon 28, brand 10, actions 116, inputs 42) as a light block and a night block,
// and every package component of the family has its own labelled section.
import {
  Button,
  ButtonGroup,
  Checkbox,
  ClipboardCopyButton,
  DatePicker,
  Field,
  Heading,
  Highlight,
  Icon,
  IconButton,
  Input,
  LinkButton,
  LockHint,
  MultiSelect,
  NumberInput,
  ProductLockup,
  ProductLogo,
  RadioGroup,
  SearchInput,
  Select,
  SuggestInput,
  Switch,
  TcrnBrandMark,
  Text,
  Textarea,
  type IconName
} from "@tcrn/ui-react";
import type { CSSProperties, ReactNode } from "react";
import type { ContractStory } from "../types.js";
import { storyCategoryFor, storyGovernanceFor } from "../governance.js";
import type { GplusMatrixBoard } from "./generated/matrices.generated.js";
import { IconRoster, iconRosterSizes } from "./icon-roster.js";
import {
  MatrixBoard,
  MatrixRow,
  MatrixSection,
  NoState,
  StateGrid,
  StaticMarkup,
  cellAttributes,
  cellEdit,
  previewState,
  type MatrixTheme
} from "./matrix-renderer.js";

export const gplusMatrixSourcePath = "apps/storybook/src/contract-stories/gplus/matrix-stories.tsx";

/** The 23 first-batch package components, by family matrix. */
export const gplusMatrixComponents: Readonly<Record<GplusMatrixBoard, readonly string[]>> = {
  typography: ["Heading", "Text", "Highlight"],
  icon: ["Icon"],
  brand: ["TcrnBrandMark", "ProductLogo", "ProductLockup"],
  actions: ["Button", "IconButton", "LinkButton", "ClipboardCopyButton", "ButtonGroup"],
  inputs: ["Input", "Textarea", "SearchInput", "SuggestInput", "Select", "MultiSelect", "NumberInput", "DatePicker", "Checkbox", "RadioGroup", "Switch"]
};

export const gplusMatrixStoryIds: Readonly<Record<GplusMatrixBoard, string>> = {
  typography: "typography-matrix",
  icon: "icon-matrix",
  brand: "brand-matrix",
  actions: "actions-matrix",
  inputs: "inputs-matrix"
};

const disabledFieldReason = "Field unavailable in this example";

function TypographyMatrix({ theme }: { theme: MatrixTheme }) {
  const cell = (id: string) => cellAttributes("typography", id, theme);
  return (
    <>
      <MatrixSection component="Heading">
        <MatrixRow label="h1"><Heading level={1} {...cell("h1")}>Quarterly review</Heading></MatrixRow>
        <MatrixRow label="h2"><Heading level={2} {...cell("h2")}>Members and permissions</Heading></MatrixRow>
        <MatrixRow label="h3"><Heading level={3} {...cell("h3")}>October invoice</Heading></MatrixRow>
        <MatrixRow label="h4"><Heading level={4} {...cell("h4")}>Notification preferences</Heading></MatrixRow>
      </MatrixSection>
      <MatrixSection component="Text">
        <MatrixRow label="body"><Text {...cell("body")}>The project has 12 members and 3 pending invitations.</Text></MatrixRow>
        <MatrixRow label="strong"><Text tone="strong" {...cell("strong")}>Deleted items can be restored for 30 days.</Text></MatrixRow>
        <MatrixRow label="reading"><Text size="reading" {...cell("read")}>Seats are billed monthly; annual plans are charged once per term.</Text></MatrixRow>
        <MatrixRow label="meta"><Text size="meta" {...cell("meta")}>Active 2 minutes ago</Text></MatrixRow>
        <MatrixRow label="caption"><Text size="caption" {...cell("cap")}>Visible to team members</Text></MatrixRow>
        <MatrixRow label="link">
          <Text><a className="tcrn-link" href="#typography-matrix" {...cell("link")}>All invoices</a></Text>
          <code>hover</code>
          <Text><a className="tcrn-link" href="#typography-matrix" {...previewState("hover")} {...cell("link-hover")}>Billing history</a></Text>
        </MatrixRow>
        <MatrixRow label="numeral">
          <Text variant="numeral" {...cell("num")}>128<small {...cell("unit")}>seats</small></Text>
          <Text variant="numeral" className="tcrn-text--numeral-inline" {...cell("num-inl")}>4,280.00</Text>
        </MatrixRow>
        <MatrixRow label="caps"><Text variant="caps" {...cell("caps")}><b>01</b>Basic info</Text></MatrixRow>
        <MatrixRow label="mono"><Text className="tcrn-text--mono" {...cell("id")}>PRJ-2026-0412 · INV-2026-10-0031</Text></MatrixRow>
      </MatrixSection>
      <MatrixSection component="Highlight">
        <MatrixRow label="mark">
          <Text>
            <StaticMarkup
              id={`typography-mark-${theme}`}
              element={<Highlight text="PRJ-2026-0412" query="2026" />}
              edits={[cellEdit('class="tcrn-highlight__mark"', cell("mark"))]}
            />
          </Text>
        </MatrixRow>
        <MatrixRow label="selected">
          <Button variant="quiet" aria-pressed="true" {...cell("sel")}>
            <Highlight text="PRJ-2026-0391" query="2026" />
          </Button>
        </MatrixRow>
      </MatrixSection>
      <div className="tcrn-doc-form-stack" data-gplus-matrix-canvas="Text">
        <MatrixRow label="body"><Text {...cell("body-canvas")}>Body text on the canvas</Text></MatrixRow>
        <MatrixRow label="strong"><Text tone="strong" {...cell("strong-canvas")}>Emphasis keeps the same ink</Text></MatrixRow>
        <MatrixRow label="meta"><Text size="meta" {...cell("meta-canvas")}>Updated 2 minutes ago</Text></MatrixRow>
        <MatrixRow label="link"><Text><a className="tcrn-link" href="#typography-matrix" {...cell("link-canvas")}>View project</a></Text></MatrixRow>
      </div>
    </>
  );
}

function clipboardStateMarkup(id: string, state: "copying" | "copied" | "failed" | "unsupported", label: string, attributes: Record<string, string>, iconCell?: Record<string, string>) {
  const edits = [
    { marker: 'data-clipboard-copy-state="idle"', set: { "data-clipboard-copy-state": state, ...(state === "copying" ? { "aria-busy": "true" } : {}) } },
    ...(iconCell ? [cellEdit(`data-clipboard-state-icon="${state}"`, iconCell)] : [])
  ];
  return (
    <StaticMarkup
      id={id}
      element={<ClipboardCopyButton text="PRJ-2026-0412" ariaLabel="Copy ID" idleLabel={label} variant="secondary" size="sm" {...attributes} />}
      edits={edits}
    />
  );
}

function IconMatrix({ theme }: { theme: MatrixTheme }) {
  const cell = (id: string) => cellAttributes("icon", id, theme);
  const sample: IconName = "layers";
  return (
    <>
      <MatrixSection component="Icon">
        <IconRoster theme={theme} />
        <MatrixRow label="size">
          {iconRosterSizes.map((size) => (
            <Text key={size}>
              <Icon name="settings" size={size} />
              <code>{size}</code>
            </Text>
          ))}
        </MatrixRow>
        <MatrixRow label="ink">
          <Text tone="strong"><Icon name={sample} {...cell("ink-panel")} /></Text>
          <Text><Icon name={sample} {...cell("ink2-panel")} /></Text>
          <Text size="meta"><Icon name={sample} {...cell("ink3-panel")} /></Text>
          <Text><a className="tcrn-link" href="#icon-matrix" aria-label="Layers"><Icon name={sample} {...cell("acc-panel")} /></a></Text>
        </MatrixRow>
        <MatrixRow label="host">
          <IconButton ariaLabel="Layers" variant="primary" icon={<Icon name={sample} {...cell("onacc-acc")} />} />
          <IconButton ariaLabel="Layers" variant="secondary" aria-pressed="true" icon={<Icon name={sample} {...cell("ink-wash")} />} />
          <IconButton ariaLabel="Delete" variant="danger" icon={<Icon name="trash" {...cell("red-panel")} />} />
          <IconButton ariaLabel="Layers" disabled icon={<Icon name={sample} {...cell("dis")} />} />
        </MatrixRow>
        <MatrixRow label="status">
          {clipboardStateMarkup(`icon-copied-${theme}`, "copied", "Copied", {}, cell("ok-panel"))}
          <LockHint icon={<Icon name="alert-triangle" {...cell("warn-panel")} />}>Seat limit reached</LockHint>
          {clipboardStateMarkup(`icon-failed-${theme}`, "failed", "Copy failed", {}, cell("bad-panel"))}
        </MatrixRow>
      </MatrixSection>
      <div className="tcrn-doc-form-stack" data-gplus-matrix-canvas="Icon">
        <MatrixRow label="canvas">
          <Text><Icon name={sample} {...cell("ink2-bg")} /></Text>
          <Text size="meta"><Icon name={sample} {...cell("ink3-bg")} /></Text>
        </MatrixRow>
      </div>
    </>
  );
}

// A mark used on its own takes its size from --tcrn-brand-mark-size, which the lockups set
// (ProductLogo 38, ProductLockup 28, shell rail 22) and a consumer overrides for other tiers (56 on
// an about page). The standalone samples set that package variable and nothing else.
const brandMarkTiers = [22, 28, 38, 56] as const;
const productMarkIds = ["tms", "einzbern", "mana-orchestrate", "design-system"] as const;

function brandMarkSize(px: number): CSSProperties {
  return { "--tcrn-brand-mark-size": `${px}px` } as CSSProperties;
}

function BrandMatrix({ theme }: { theme: MatrixTheme }) {
  const cell = (id: string) => cellAttributes("brand", id, theme);
  return (
    <>
      <MatrixSection component="TcrnBrandMark">
        <MatrixRow label="size">
          {brandMarkTiers.map((tier) => (
            <span key={tier} style={brandMarkSize(tier)} data-gplus-brand-mark-tier={tier}><TcrnBrandMark /></span>
          ))}
        </MatrixRow>
        <MatrixRow label="mark">
          {productMarkIds.map((productId) => (
            <span key={productId} style={brandMarkSize(38)}><TcrnBrandMark productId={productId} /></span>
          ))}
        </MatrixRow>
        <MatrixRow label="mono">
          {productMarkIds.map((productId) => (
            <span key={productId} style={brandMarkSize(38)}><TcrnBrandMark productId={productId} variant="mono" /></span>
          ))}
        </MatrixRow>
      </MatrixSection>
      <MatrixSection component="ProductLogo">
        <MatrixRow label="sans">
          <StaticMarkup
            id={`brand-logo-ds-${theme}`}
            element={<ProductLogo productId="design-system" />}
            edits={[cellEdit('class="tcrn-product-logo__line-two"', cell("tagline"))]}
          />
          <ProductLogo productId="tms" />
        </MatrixRow>
        <MatrixRow label="serif">
          <ProductLogo productId="einzbern" />
          <ProductLogo productId="mana-orchestrate" />
        </MatrixRow>
      </MatrixSection>
      <MatrixSection component="ProductLockup">
        <MatrixRow label="suffix">
          <StaticMarkup
            id={`brand-lockup-${theme}`}
            element={<ProductLockup suffix="Docs" />}
            edits={[
              cellEdit('class="tcrn-brand-wordmark"', cell("wm")),
              cellEdit('class="tcrn-brand-wordmark__suffix"', cell("suffix-ink"))
            ]}
          />
          <ProductLockup productId="design-system" />
        </MatrixRow>
      </MatrixSection>
      <div className="tcrn-doc-form-stack" data-gplus-matrix-canvas="ProductLogo">
        <MatrixRow label="canvas">
          <StaticMarkup
            id={`brand-rail-${theme}`}
            element={<ProductLogo productId="einzbern" />}
            edits={[
              cellEdit('class="tcrn-product-logo__line-one"', cell("rail-wm")),
              cellEdit('class="tcrn-product-logo__line-two"', cell("rail-tag"))
            ]}
          />
        </MatrixRow>
      </div>
    </>
  );
}

type ActionVariant = "primary" | "secondary" | "quiet" | "danger";
type ActionState = "d" | "h" | "a" | "f" | "x" | "l" | "s";

const actionColumns = ["default", "hover", "active", "focus", "disabled", "loading", "selected"] as const;
const actionStates: readonly ActionState[] = ["d", "h", "a", "f", "x", "l", "s"];
const actionVariants: readonly ActionVariant[] = ["primary", "secondary", "quiet", "danger"];
const actionCellPrefix: Record<ActionVariant, string> = { primary: "pri", secondary: "sec", quiet: "quiet", danger: "danger" };
const actionLabels: Record<ActionVariant, string> = { primary: "Save", secondary: "Export", quiet: "Archive", danger: "Delete" };
const actionIcons: Record<ActionVariant, IconName> = { primary: "plus", secondary: "copy", quiet: "more-horizontal", danger: "trash" };

function actionStateProps(state: ActionState): Record<string, unknown> {
  switch (state) {
    case "h":
      return previewState("hover");
    case "a":
      return previewState("active");
    case "f":
      return previewState("focus");
    case "x":
      return { disabled: true };
    case "l":
      return { loading: true };
    case "s":
      return { "aria-pressed": "true" };
    default:
      return {};
  }
}

function hasActionState(variant: ActionVariant, state: ActionState): boolean {
  return state !== "s" || variant === "secondary" || variant === "quiet";
}

function ActionsMatrix({ theme }: { theme: MatrixTheme }) {
  const cell = (id: string) => cellAttributes("actions", id, theme);
  const buttonRows = actionVariants.map((variant) => ({
    label: variant,
    cells: actionStates.map((state) =>
      hasActionState(variant, state) ? (
        <Button variant={variant} {...actionStateProps(state)} {...cell(`${actionCellPrefix[variant]}-${state}`)}>
          {actionLabels[variant]}
        </Button>
      ) : (
        <NoState />
      )
    )
  }));
  const iconRows = actionVariants.map((variant) => ({
    label: variant,
    cells: actionStates.map((state) =>
      hasActionState(variant, state) ? (
        <IconButton
          ariaLabel={actionLabels[variant]}
          variant={variant}
          iconName={actionIcons[variant]}
          {...actionStateProps(state)}
          {...cell(`ico-${actionCellPrefix[variant]}-${state}`)}
        />
      ) : (
        <NoState />
      )
    )
  }));
  return (
    <>
      <MatrixSection component="Button">
        <StateGrid columns={actionColumns} rows={buttonRows} />
      </MatrixSection>
      <MatrixSection component="IconButton">
        <StateGrid columns={actionColumns} rows={iconRows} />
      </MatrixSection>
      <MatrixSection component="LinkButton">
        <MatrixRow label="variant">
          <LinkButton variant="primary" href="#actions-matrix">Invoices</LinkButton>
          <LinkButton variant="secondary" href="#actions-matrix">Settings</LinkButton>
          <LinkButton variant="quiet" href="#actions-matrix">Members</LinkButton>
        </MatrixRow>
      </MatrixSection>
      <MatrixSection component="ClipboardCopyButton">
        <MatrixRow label="state">
          <ClipboardCopyButton text="PRJ-2026-0412" ariaLabel="Copy ID" idleLabel="Copy ID" variant="secondary" size="sm" {...cell("cb-idle")} />
          {clipboardStateMarkup(`actions-copying-${theme}`, "copying", "Copying", cell("cb-copying"))}
          {clipboardStateMarkup(`actions-copied-${theme}`, "copied", "Copied", cell("cb-copied"))}
          {clipboardStateMarkup(`actions-failed-${theme}`, "failed", "Copy failed", cell("cb-failed"))}
          {clipboardStateMarkup(`actions-unsupported-${theme}`, "unsupported", "Copy unavailable", cell("cb-unsupported"))}
        </MatrixRow>
      </MatrixSection>
      <MatrixSection component="ButtonGroup">
        <MatrixRow label="selected">
          <ButtonGroup ariaLabel="View">
            <IconButton ariaLabel="Layers" iconName="layers" aria-pressed="true" {...cell("grp-sel")} />
            <IconButton ariaLabel="Grid" iconName="layout-grid" aria-pressed="false" />
          </ButtonGroup>
          <ButtonGroup ariaLabel="Period">
            <Button size="sm" aria-pressed="true">Day</Button>
            <Button size="sm" aria-pressed="false">Week</Button>
            <Button size="sm" aria-pressed="false">Month</Button>
          </ButtonGroup>
        </MatrixRow>
      </MatrixSection>
    </>
  );
}

const projectOptions = [
  { value: "review", label: "Quarterly review" },
  { value: "launch", label: "October launch" },
  { value: "hiring", label: "Autumn hiring" },
  { value: "archive", label: "Archived project", disabled: true }
];

function InputsMatrix({ theme }: { theme: MatrixTheme }) {
  const cell = (id: string, probe?: Parameters<typeof cellAttributes>[3]) => cellAttributes("inputs", id, theme, probe);
  return (
    <>
      <MatrixSection component="Input">
        <MatrixRow label="placeholder"><Input aria-label="Project name" placeholder="Project name" {...cell("in-ph", "ph")} /></MatrixRow>
        <MatrixRow label="default"><Input aria-label="Project name" defaultValue="Quarterly review" {...cell("in-text")} /></MatrixRow>
        <MatrixRow label="focus"><Input aria-label="Project name" defaultValue="Quarterly review" {...previewState("focus")} {...cell("in-focus")} /></MatrixRow>
        <MatrixRow label="read-only"><Input aria-label="Team" defaultValue="Design team" readOnly {...cell("in-ro")} /></MatrixRow>
        <MatrixRow label="disabled"><Input aria-label="Team" defaultValue="Design team" disabled disabledReason={disabledFieldReason} {...cell("in-dis")} /></MatrixRow>
        <MatrixRow label="error">
          <StaticMarkup
            id={`inputs-error-${theme}`}
            element={(
              <Field label="Email" error="Enter a complete email address">
                <Input defaultValue="lin.xiao@" aria-invalid="true" {...cell("in-err")} />
              </Field>
            )}
            edits={[cellEdit('class="tcrn-field__error"', cell("err-msg"))]}
          />
        </MatrixRow>
      </MatrixSection>
      <MatrixSection component="Textarea">
        <Textarea aria-label="Notes" defaultValue="Seats are billed monthly; annual plans are charged once per term." />
      </MatrixSection>
      <MatrixSection component="SearchInput">
        <MatrixRow label="focus"><SearchInput aria-label="Search" defaultValue="design" {...previewState("focus")} {...cell("search-focus")} /></MatrixRow>
        <MatrixRow label="placeholder"><SearchInput aria-label="Search" placeholder="Search" {...cell("search-ph", "ph")} /></MatrixRow>
      </MatrixSection>
      <MatrixSection component="SuggestInput">
        <SuggestInput aria-label="Team" defaultValue="Design team" suggestions={["Design team", "Product team"]} />
      </MatrixSection>
      <MatrixSection component="Select">
        <StaticMarkup
          id={`inputs-select-${theme}`}
          element={<Select aria-label="Project" defaultValue="review" options={projectOptions} />}
          edits={[cellEdit("tcrn-select-wrap__icon", cell("chev"))]}
        />
      </MatrixSection>
      <MatrixSection component="MultiSelect">
        {/* The open list is shown in place: MultiSelect has no open entry, and the page's static
            bridge mounts every [data-choice-presentation=dropdown] root and moves an open list to
            document.body, out of this theme block. Dropping that hook keeps the expanded list and
            its selected option (opt-sel) inside the block. */}
        <StaticMarkup
          id={`inputs-multi-${theme}`}
          block
          element={<MultiSelect aria-label="Projects" presentation="dropdown" defaultValue={["review", "launch"]} options={projectOptions} />}
          edits={[
            { marker: 'data-choice-presentation="dropdown"', remove: ["data-choice-presentation"] },
            { marker: 'aria-haspopup="listbox"', set: { "aria-expanded": "true" } },
            { marker: 'role="listbox"', remove: ["hidden"] },
            cellEdit('aria-selected="true"', cell("opt-sel"))
          ]}
        />
      </MatrixSection>
      <MatrixSection component="NumberInput">
        <NumberInput aria-label="Seats" defaultValue={12} min={1} max={120} {...cell("num")} />
      </MatrixSection>
      <MatrixSection component="DatePicker">
        <StaticMarkup
          id={`inputs-date-${theme}`}
          element={<DatePicker aria-label="Due date" defaultValue="2026-10-31" min="2026-10-01" {...cell("date")} />}
          edits={[cellEdit("tcrn-date-picker-wrap__icon", cell("cal"))]}
        />
      </MatrixSection>
      <MatrixSection component="Checkbox">
        <MatrixRow label="state">
          <Checkbox aria-label="Weekly digest" {...cell("ck-edge", "shadow")} />
          <Checkbox aria-label="Weekly digest" defaultChecked {...cell("ck-on", "after-border")} />
          <Checkbox aria-label="Weekly digest" defaultChecked disabled disabledReason={disabledFieldReason} {...cell("ck-dis", "after-border")} />
        </MatrixRow>
      </MatrixSection>
      <MatrixSection component="RadioGroup">
        <StaticMarkup
          id={`inputs-radio-${theme}`}
          block
          element={(
            <RadioGroup
              legend="Billing cycle"
              name={`gplus-billing-cycle-${theme}`}
              defaultValue="monthly"
              options={[
                { value: "monthly", label: "Monthly" },
                { value: "annual", label: "Annual" }
              ]}
            />
          )}
          edits={[cellEdit('type="radio"', cell("rd-on", "after-shadow"), 0), cellEdit('type="radio"', cell("rd-edge", "shadow"), 1)]}
        />
      </MatrixSection>
      <MatrixSection component="Switch">
        <MatrixRow label="state">
          <Switch label="Email notifications" {...cell("sw-edge", "shadow")} />
          <Switch label="Weekly digest" defaultChecked {...cell("sw-on", "before-bg")} />
        </MatrixRow>
      </MatrixSection>
    </>
  );
}

const boardRenderers: Record<GplusMatrixBoard, (props: { theme: MatrixTheme }) => ReactNode> = {
  typography: TypographyMatrix,
  icon: IconMatrix,
  brand: BrandMatrix,
  actions: ActionsMatrix,
  inputs: InputsMatrix
};

interface MatrixStoryText {
  title: string;
  description: string;
}

/** English source text; the five locales live in storybook-locale-text.ts under story.<id>.*. */
export const gplusMatrixStoryText: Readonly<Record<GplusMatrixBoard, MatrixStoryText>> = {
  typography: {
    title: "Typography matrix",
    description: "Heading, Text and Highlight in every style on paper and canvas, light and night, each sample with its contrast target."
  },
  icon: {
    title: "Icon matrix",
    description: "The 37-icon roster at 14, 16 and 20 px and the icon colours on paper and canvas, light and night."
  },
  brand: {
    title: "Brand matrix",
    description: "TcrnBrandMark, ProductLogo and ProductLockup with their wordmark, suffix and tagline inks, light and night."
  },
  actions: {
    title: "Actions matrix",
    description: "Button, IconButton, LinkButton, ClipboardCopyButton and ButtonGroup across variants and states, light and night."
  },
  inputs: {
    title: "Inputs matrix",
    description: "The eleven input controls in their states, from placeholder to error, light and night."
  }
};

// Boards whose two blocks sit side by side to stay inside the story height budget.
const columnBoards: ReadonlySet<GplusMatrixBoard> = new Set<GplusMatrixBoard>(["typography", "inputs"]);

function matrixStory(board: GplusMatrixBoard): ContractStory {
  const id = gplusMatrixStoryIds[board];
  const governance = storyGovernanceFor(id, "Components");
  const category = storyCategoryFor("Components", governance.categoryId);
  const Renderer = boardRenderers[board];
  return {
    id,
    title: gplusMatrixStoryText[board].title,
    group: "Components",
    description: gplusMatrixStoryText[board].description,
    ...governance,
    sourcePath: gplusMatrixSourcePath,
    category: category.label,
    render: () => (
      <MatrixBoard board={board} columns={columnBoards.has(board)}>{(theme) => <Renderer theme={theme} />}</MatrixBoard>
    )
  };
}

export const gplusMatrixBoardsInOrder: readonly GplusMatrixBoard[] = ["typography", "icon", "brand", "actions", "inputs"];

export const gplusMatrixStories: ContractStory[] = gplusMatrixBoardsInOrder.map(matrixStory);
