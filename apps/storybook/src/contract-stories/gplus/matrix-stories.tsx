// The five first-batch family matrices as contract stories: typography-matrix, icon-matrix,
// brand-matrix, actions-matrix and inputs-matrix. Each board renders the contract cell count
// (typography 44, icon 28, brand 10, actions 116, inputs 42) as a light block and a night block,
// and every package component of the family has its own labelled section. The shell board (07a
// section B) is the shell-matrix story of the navigation-shells category (TCRN-DS-SUB-136): its 66
// cells on the package shell parts, light and night, under the board names.
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
  ProductShell,
  RadioGroup,
  SearchInput,
  Select,
  ShellBrandButton,
  ShellDropdown,
  ShellMenu,
  ShellPins,
  SuggestInput,
  Surface,
  Switch,
  TcrnBrandMark,
  Text,
  Textarea,
  type IconName,
  type ShellMenuGroup,
  type ShellMenuItem,
  type ShellPinItem
} from "@tcrn/ui-react";
import type { CSSProperties, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { tcrnDefaultLocale, tcrnLocaleMetadata } from "@tcrn/ui-copy-state";
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
  StaticHtml,
  StaticMarkup,
  cellAttributes,
  cellEdit,
  previewState,
  shellCellAttributes,
  type MatrixCellProbe,
  type MatrixTheme
} from "./matrix-renderer.js";

export const gplusMatrixSourcePath = "apps/storybook/src/contract-stories/gplus/matrix-stories.tsx";

/** The five first-batch family boards; the shell board has its own story (shellMatrixStory). */
export type GplusFamilyMatrixBoard = Exclude<GplusMatrixBoard, "shell">;

/** The 23 first-batch package components, by family matrix. */
export const gplusMatrixComponents: Readonly<Record<GplusFamilyMatrixBoard, readonly string[]>> = {
  typography: ["Heading", "Text", "Highlight"],
  icon: ["Icon"],
  brand: ["TcrnBrandMark", "ProductLogo", "ProductLockup"],
  actions: ["Button", "IconButton", "LinkButton", "ClipboardCopyButton", "ButtonGroup"],
  inputs: ["Input", "Textarea", "SearchInput", "SuggestInput", "Select", "MultiSelect", "NumberInput", "DatePicker", "Checkbox", "RadioGroup", "Switch"]
};

export const gplusMatrixStoryIds: Readonly<Record<GplusFamilyMatrixBoard, string>> = {
  typography: "typography-matrix",
  icon: "icon-matrix",
  brand: "brand-matrix",
  actions: "actions-matrix",
  inputs: "inputs-matrix"
};

const disabledFieldReason = "Field unavailable in this example";

// data-h declares a control's rendered height for the controlHeight measurement: the package size
// tier of the control (sm 28, md 32, lg 40; Button, IconButton, LinkButton and the text-like inputs
// default to md). Controls without a height tier (Textarea, Checkbox, RadioGroup, Switch) carry none.
type ControlSize = "sm" | "md" | "lg";
const controlHeightPx: Readonly<Record<ControlSize, number>> = { sm: 28, md: 32, lg: 40 };

function heightHook(size: ControlSize): Record<string, string> {
  return { "data-h": String(controlHeightPx[size]) };
}

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
          <Text variant="numeral" data-criterion-plain-numeral="">4,280.00</Text>
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
        <Button variant={variant} {...actionStateProps(state)} {...cell(`${actionCellPrefix[variant]}-${state}`)} {...heightHook("md")}>
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
          {...heightHook("md")}
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
          <LinkButton variant="primary" href="#actions-matrix" {...heightHook("md")}>Invoices</LinkButton>
          <LinkButton variant="secondary" href="#actions-matrix" {...heightHook("md")}>Settings</LinkButton>
          <LinkButton variant="quiet" href="#actions-matrix" {...heightHook("md")}>Members</LinkButton>
        </MatrixRow>
      </MatrixSection>
      <MatrixSection component="ClipboardCopyButton">
        <MatrixRow label="state">
          <ClipboardCopyButton text="PRJ-2026-0412" ariaLabel="Copy ID" idleLabel="Copy ID" variant="secondary" size="sm" {...cell("cb-idle")} {...heightHook("sm")} />
          {clipboardStateMarkup(`actions-copying-${theme}`, "copying", "Copying", { ...cell("cb-copying"), ...heightHook("sm") })}
          {clipboardStateMarkup(`actions-copied-${theme}`, "copied", "Copied", { ...cell("cb-copied"), ...heightHook("sm") })}
          {clipboardStateMarkup(`actions-failed-${theme}`, "failed", "Copy failed", { ...cell("cb-failed"), ...heightHook("sm") })}
          {clipboardStateMarkup(`actions-unsupported-${theme}`, "unsupported", "Copy unavailable", { ...cell("cb-unsupported"), ...heightHook("sm") })}
        </MatrixRow>
      </MatrixSection>
      <MatrixSection component="ButtonGroup">
        <MatrixRow label="selected">
          <ButtonGroup ariaLabel="View">
            <IconButton ariaLabel="Layers" iconName="layers" aria-pressed="true" {...cell("grp-sel")} {...heightHook("md")} />
            <IconButton ariaLabel="Grid" iconName="layout-grid" aria-pressed="false" {...heightHook("md")} />
          </ButtonGroup>
          <ButtonGroup ariaLabel="Period">
            <Button size="sm" aria-pressed="true" {...heightHook("sm")}>Day</Button>
            <Button size="sm" aria-pressed="false" {...heightHook("sm")}>Week</Button>
            <Button size="sm" aria-pressed="false" {...heightHook("sm")}>Month</Button>
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
        <MatrixRow label="placeholder"><Input aria-label="Project name" placeholder="Project name" {...cell("in-ph", "ph")} {...heightHook("md")} /></MatrixRow>
        <MatrixRow label="default"><Input aria-label="Project name" defaultValue="Quarterly review" {...cell("in-text")} {...heightHook("md")} /></MatrixRow>
        <MatrixRow label="focus"><Input aria-label="Project name" defaultValue="Quarterly review" {...previewState("focus")} {...cell("in-focus")} {...heightHook("md")} /></MatrixRow>
        <MatrixRow label="read-only"><Input aria-label="Team" defaultValue="Design team" readOnly {...cell("in-ro")} {...heightHook("md")} /></MatrixRow>
        <MatrixRow label="disabled"><Input aria-label="Team" defaultValue="Design team" disabled disabledReason={disabledFieldReason} {...cell("in-dis")} {...heightHook("md")} /></MatrixRow>
        <MatrixRow label="error">
          <StaticMarkup
            id={`inputs-error-${theme}`}
            element={(
              <Field label="Email" error="Enter a complete email address">
                <Input defaultValue="lin.xiao@" aria-invalid="true" {...cell("in-err")} {...heightHook("md")} />
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
        <MatrixRow label="focus"><SearchInput aria-label="Search" defaultValue="design" {...previewState("focus")} {...cell("search-focus")} {...heightHook("md")} /></MatrixRow>
        <MatrixRow label="placeholder"><SearchInput aria-label="Search" placeholder="Search" {...cell("search-ph", "ph")} {...heightHook("md")} /></MatrixRow>
      </MatrixSection>
      <MatrixSection component="SuggestInput">
        <SuggestInput aria-label="Team" defaultValue="Design team" suggestions={["Design team", "Product team"]} {...heightHook("md")} />
      </MatrixSection>
      <MatrixSection component="Select">
        <StaticMarkup
          id={`inputs-select-${theme}`}
          element={<Select aria-label="Project" defaultValue="review" options={projectOptions} {...heightHook("md")} />}
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
          element={<MultiSelect aria-label="Projects" aria-invalid={false} presentation="dropdown" defaultValue={["review", "launch"]} options={projectOptions} />}
          edits={[
            { marker: 'data-choice-presentation="dropdown"', remove: ["data-choice-presentation"] },
            { marker: 'aria-haspopup="listbox"', set: { "aria-expanded": "true", ...heightHook("md") } },
            { marker: 'role="listbox"', remove: ["hidden"] },
            cellEdit('aria-selected="true"', cell("opt-sel"))
          ]}
        />
      </MatrixSection>
      <MatrixSection component="NumberInput">
        <NumberInput aria-label="Seats" defaultValue={12} min={1} max={120} {...cell("num")} {...heightHook("md")} />
      </MatrixSection>
      <MatrixSection component="DatePicker">
        <StaticMarkup
          id={`inputs-date-${theme}`}
          element={<DatePicker aria-label="Due date" defaultValue="2026-10-31" min="2026-10-01" {...cell("date")} {...heightHook("md")} />}
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

const boardRenderers: Record<GplusFamilyMatrixBoard, (props: { theme: MatrixTheme }) => ReactNode> = {
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
export const gplusMatrixStoryText: Readonly<Record<GplusFamilyMatrixBoard, MatrixStoryText>> = {
  typography: {
    title: "Typography matrix",
    description: "Heading, Text and Highlight in every style on paper and canvas, light and night, each sample with its contrast target."
  },
  icon: {
    title: "Icon matrix",
    description: "The 38-icon roster at 14, 16 and 20 px and the icon colours on paper and canvas, light and night."
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
const columnBoards: ReadonlySet<GplusFamilyMatrixBoard> = new Set<GplusFamilyMatrixBoard>(["typography", "inputs"]);

function matrixStory(board: GplusFamilyMatrixBoard): ContractStory {
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

export const gplusMatrixBoardsInOrder: readonly GplusFamilyMatrixBoard[] = ["typography", "icon", "brand", "actions", "inputs"];

export const gplusMatrixStories: ContractStory[] = gplusMatrixBoardsInOrder.map(matrixStory);

// ---------- The shell board: 07a (Shell.dc.html) section B, the shell-matrix story ----------
//
// Every cell of section B on the package part that shows it, light and night: the brand button idle,
// on hover (its open pair is the same) and focused, the pinned items, the bell and the avatar on the canvas; the full menu (search,
// group title, rows, pins, bottom bar and side-rail lockup), the pinned drop-down's search and the
// phone Sheet over the paper. Static states use data-tcrn-preview-state, aria-current and
// aria-expanded as the package reads them. The floating layers stand in the flow of the matrix (a
// shell places them under the band), so their position is the only attribute switched besides the
// cell attributes; the Sheet keeps its fixed scrim and panel inside a layout-contained phone block.
// The bell and the avatar are parts of ProductShell's cluster, taken from its own markup.
const shellMatrixHref = "#shell-matrix";
const shellMatrixPins: readonly ShellPinItem[] = [
  { id: "roster", label: "Roster", href: shellMatrixHref },
  { id: "contracts", label: "Contracts", hasMenu: true },
  { id: "statements", label: "Statements", href: shellMatrixHref },
  { id: "schedule", label: "Schedule", hasMenu: true }
];
const shellMatrixSchedule: ShellMenuItem = {
  id: "schedule",
  label: "Schedule",
  iconName: "calendar",
  children: [
    { id: "this-week", label: "This week", href: shellMatrixHref },
    { id: "month-view", label: "Month view", href: shellMatrixHref },
    { id: "conflict-check", label: "Conflict check", href: shellMatrixHref }
  ]
};
const shellMatrixGroups: readonly ShellMenuGroup[] = [
  {
    id: "people",
    label: "People",
    items: [
      { id: "roster", label: "Roster", href: shellMatrixHref, iconName: "users" },
      { id: "teams", label: "Teams", href: shellMatrixHref, iconName: "layers" },
      {
        id: "contracts",
        label: "Contracts",
        iconName: "book-open",
        children: [
          { id: "all-contracts", label: "All contracts", href: shellMatrixHref },
          { id: "approvals", label: "Approvals", href: shellMatrixHref }
        ]
      }
    ]
  }
];
const shellMatrixInFlow = "position:relative;top:0;left:0;margin-top:0";
const shellMatrixPhoneBlock: CSSProperties = { contain: "layout", position: "relative", inlineSize: "390px", blockSize: "320px" };
const shellMatrixPinItem = 'class="tcrn-shell-pins__item"';
/**
 * The name each shell part of the matrix gives its landmarks (landmarkLabel), so that the light and
 * the night matrix on one page, and the full menu and the Sheet in one matrix, share none (axe
 * landmark-unique; TCRN-DS-SUB-184). The Sheet is a second full menu, so it has its own.
 */
function shellMatrixLandmarkOf(theme: MatrixTheme, sample?: "sheet"): string {
  return `${shellMatrixStoryText.title}${theme === "night" ? " (night)" : ""}${sample ? `, ${sample}` : ""}`;
}

/** One button of ProductShell's markup, found by a marker in its opening tag. */
function productShellButton(html: string, marker: string): string {
  const at = html.indexOf(marker);
  const start = at < 0 ? -1 : html.lastIndexOf("<button", at);
  const end = at < 0 ? -1 : html.indexOf("</button>", at);
  if (start < 0 || end < 0) {
    throw new Error(`shell_matrix_part_missing:${marker}`);
  }
  return html.slice(start, end + "</button>".length);
}

function ShellMatrix({ theme }: { theme: MatrixTheme }) {
  const cell = (key: string, probe?: MatrixCellProbe) => shellCellAttributes(key, theme, probe);
  const prefix = `shell-matrix-${theme}`;
  const menuIdOf = (id: string) => `${prefix}-menu-${id}`;
  const shellHtml = renderToStaticMarkup(
    <ProductShell
      productName="TCRN TMS"
      moduleName="People"
      brandProductId="tms"
      currentRouteLabel="Roster"
      pageHeader={{ title: "Roster" }}
      navGroups={[]}
      locales={tcrnLocaleMetadata}
      currentLocale={tcrnDefaultLocale}
      account={{ name: "Lin Xia", initials: "LX" }}
      notifications={{ unread: 3 }}
      landmarkLabel={shellMatrixLandmarkOf(theme)}
    >
      <Text>Twelve people across four teams, updated today.</Text>
    </ProductShell>,
    { identifierPrefix: `${prefix}-shell-` }
  );
  const bell = productShellButton(shellHtml, 'class="tcrn-shell-bell"');
  const avatar = productShellButton(shellHtml, 'class="tcrn-shell-avatar"');
  return (
    <>
      <div className="tcrn-doc-form-stack" data-gplus-matrix-canvas="ShellBrandButton">
        <MatrixRow label="idle">
          <StaticMarkup
            id={`${prefix}-brand-idle`}
            element={<ShellBrandButton productId="tms" />}
            edits={[
              cellEdit('data-logo="tms"', cell("brand-mark")),
              cellEdit('class="tcrn-shell-brand__word"', cell("brand-word")),
              cellEdit('class="tcrn-shell-brand__suffix', cell("brand-suffix")),
              cellEdit('class="tcrn-shell-brand__toggle"', cell("tgl"))
            ]}
          />
          <code>hover</code>
          {/* Section B row "hover / open": the open pair equals the hover pair, so the sample is the hover
              preview, and the matrix adds no aria-expanded="true" for the brand button. */}
          <StaticMarkup
            id={`${prefix}-brand-hover`}
            element={<ShellBrandButton productId="tms" />}
            edits={[
              { marker: 'class="tcrn-shell-brand"', set: previewState("hover") },
              cellEdit('class="tcrn-shell-brand__word"', cell("brand-word-open")),
              cellEdit('class="tcrn-shell-brand__suffix', cell("brand-suffix-open"))
            ]}
          />
          <code>focus</code>
          <StaticMarkup
            id={`${prefix}-brand-focus`}
            element={<ShellBrandButton productId="tms" />}
            edits={[{ marker: 'class="tcrn-shell-brand"', set: { ...previewState("focus"), ...cell("brand-focus", "shadow") } }]}
          />
        </MatrixRow>
        <MatrixRow label="pins">
          <StaticMarkup
            id={`${prefix}-pins`}
            element={<ShellPins items={shellMatrixPins} selectedId="roster" openId="schedule" menuIdOf={menuIdOf} landmarkLabel={shellMatrixLandmarkOf(theme)} />}
            edits={[
              cellEdit(shellMatrixPinItem, cell("pin-on"), 0),
              cellEdit(shellMatrixPinItem, cell("pin-rest"), 1),
              cellEdit('class="tcrn-icon tcrn-shell-pins__chevron"', cell("pin-chev"), 0),
              { marker: shellMatrixPinItem, nth: 2, set: { ...previewState("hover"), ...cell("pin-hover") } },
              cellEdit(shellMatrixPinItem, cell("pin-open"), 3)
            ]}
          />
          <code>cluster</code>
          <StaticHtml id={`${prefix}-bell`} html={bell} edits={[cellEdit('class="tcrn-shell-bell"', cell("bell"))]} />
          <StaticHtml id={`${prefix}-bell-hover`} html={bell} edits={[{ marker: 'class="tcrn-shell-bell"', set: { ...previewState("hover"), ...cell("bell-hover") } }]} />
          <StaticHtml id={`${prefix}-avatar`} html={avatar} edits={[cellEdit('class="tcrn-shell-avatar"', cell("avatar"))]} />
        </MatrixRow>
      </div>
      <div className="tcrn-doc-form-stack" data-gplus-matrix-canvas="ShellMenu">
        <code>expanded</code>
        <StaticMarkup
          id={`${prefix}-menu`}
          block
          element={
            <ShellMenu
              groups={shellMatrixGroups}
              open
              productId="tms"
              selectedId="roster"
              currentPath={[{ label: "People" }, { label: "Roster" }]}
              pinnedIds={["roster", "contracts"]}
              onPinnedChange={() => undefined}
              previewStates={{ people: "hover", teams: "hover" }}
              presentation="panel"
              shortcut={false}
              landmarkLabel={shellMatrixLandmarkOf(theme)}
            />
          }
          edits={[
            { marker: 'data-shell-menu=""', set: { style: shellMatrixInFlow } },
            cellEdit('class="tcrn-shell-menu__panel"', cell("panel-edge")),
            cellEdit('class="tcrn-input tcrn-search-input__control"', cell("srch-ph", "ph")),
            cellEdit('class="tcrn-search-input__shortcut"', cell("srch-kbd")),
            cellEdit('class="tcrn-nav-group__label-text"', cell("grp-hover")),
            cellEdit('title="Roster" data-shell-row=""', cell("it-on")),
            cellEdit('aria-label="Unpin from top bar: Roster"', cell("pinb-on-wash")),
            cellEdit('title="Teams" data-shell-row=""', cell("it-hover")),
            cellEdit('aria-label="Pin to top bar: Teams"', cell("pinb-outline")),
            cellEdit('title="Contracts" data-shell-row=""', cell("it-rest")),
            cellEdit('data-icon-name="chevron-right"', cell("it-chev")),
            cellEdit('aria-label="Unpin from top bar: Contracts"', cell("pinb-on")),
            cellEdit('class="tcrn-shell-menu__crumbs-label"', cell("pbar-label")),
            cellEdit('class="tcrn-product-logo__line-one-base"', cell("lk-b")),
            cellEdit('class="tcrn-product-logo__line-one-suffix', cell("lk-em")),
            cellEdit('class="tcrn-product-logo__line-two"', cell("lk-small"))
          ]}
        />
        <MatrixRow label="drop">
          <StaticMarkup
            id={`${prefix}-drop`}
            block
            element={<ShellDropdown id={menuIdOf("schedule")} source={shellMatrixSchedule} open landmarkLabel={shellMatrixLandmarkOf(theme)} />}
            edits={[{ marker: 'data-shell-dropdown=""', set: { style: shellMatrixInFlow } }, cellEdit('class="tcrn-input tcrn-search-input__control"', cell("drop-srch", "ph"))]}
          />
          <code>sheet</code>
          <div style={shellMatrixPhoneBlock} data-shell-matrix-phone="">
            <Surface>
              <Text {...cell("scrim-paper")}>Twelve people across four teams, updated today.</Text>
            </Surface>
            <StaticMarkup
              id={`${prefix}-sheet`}
              block
              element={<ShellMenu groups={shellMatrixGroups} open productId="tms" presentation="sheet" shortcut={false} landmarkLabel={shellMatrixLandmarkOf(theme, "sheet")} />}
              edits={[cellEdit('title="People" data-shell-row=""', cell("sheet-row"))]}
            />
          </div>
        </MatrixRow>
      </div>
    </>
  );
}

/** English source text; the five locales live in storybook-locale-text.ts under story.shell-matrix.*. */
export const shellMatrixStoryText: MatrixStoryText = {
  title: "Top-band shell matrix",
  description: "Every state of the top-band shell with its contrast target, light and night: the brand button, pinned items, bell and avatar on the canvas; the full menu, the drop-down and the phone sheet on paper."
};

function shellMatrixStoryOf(): ContractStory {
  const id = "shell-matrix";
  const governance = storyGovernanceFor(id, "Components");
  const category = storyCategoryFor("Components", governance.categoryId);
  return {
    id,
    title: shellMatrixStoryText.title,
    group: "Components",
    description: shellMatrixStoryText.description,
    ...governance,
    sourcePath: gplusMatrixSourcePath,
    category: category.label,
    render: () => <MatrixBoard board="shell">{(theme) => <ShellMatrix theme={theme} />}</MatrixBoard>
  };
}

/** The shell-matrix story of the navigation-shells category (C-9 of TCRN-DS-INIT-016). */
export const shellMatrixStory: ContractStory = shellMatrixStoryOf();
