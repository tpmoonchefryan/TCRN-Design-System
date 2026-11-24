import { useState } from "react";
import {
  Button,
  ButtonGroup,
  Checkbox,
  Heading,
  Highlight,
  Icon,
  IconButton,
  Input,
  MultiSelect,
  ProductLockup,
  ProductShell,
  SearchInput,
  Select,
  Switch,
  Tabs,
  Text,
  productShellCopyFor,
  useProductShellController,
} from "@tcrn/ui-react/approved";
import {
  tcrnDarkThemeTokens,
  tcrnGplusThemedTokens,
  tcrnHalloweenThemeTokens,
  type AnyThemeMode,
} from "@tcrn/ui-tokens";
import { docsCopy } from "./locales.js";
import { rosterGroups } from "./specimens.js";

const themeModes: readonly AnyThemeMode[] = ["light", "dark", "halloween"];
const themeLabels: Record<AnyThemeMode, string> = {
  light: "Day (pinned)",
  dark: "Night (pinned)",
  halloween: "Halloween (opt-in)",
};

const darkByVar = new Map<string, string>(tcrnDarkThemeTokens.map((entry) => [entry.variable, entry.value]));
const halloweenByVar = new Map<string, string>(tcrnHalloweenThemeTokens.map((entry) => [entry.variable, entry.value]));

const halloweenChoiceOptions = [
  { value: "lantern", label: "Lantern relay" },
  { value: "cauldron", label: "Potion ledger" },
  { value: "midnight", label: "Archive curfew", disabled: true },
];

export default {
  title: "Adopted support/Seasonal Halloween theme",
  parameters: { layout: "fullscreen", adoptedSupport: true },
};

function ThemeSpecimenCard({ theme }: { theme: AnyThemeMode }) {
  const c = docsCopy("en");
  const [selectedChoices, setSelectedChoices] = useState<string[]>(["lantern"]);
  const [groupIndex, setGroupIndex] = useState(0);

  return (
    <div className="tcrn-doc-pane" data-tcrn-theme={theme}>
      <Heading level={2} visualLevel={4}>{themeLabels[theme]}</Heading>
      <div className="tcrn-doc-paper">
        <div className="tcrn-doc-row">
          <ProductLockup productId="tms" locale="en" scale="rail" />
          <ProductLockup productId="design-system" locale="en" scale="rail" />
        </div>
        <Heading level={3}>Pumpkin Lantern Dispatch</Heading>
        <Text>
          <Highlight text="Harvest festival cue · PRJ-2026-1031" query="1031" />
        </Text>
        <div className="tcrn-doc-row">
          <Button variant="primary">Publish cue</Button>
          <Button variant="secondary">Inspect</Button>
          <Button variant="quiet">Cancel</Button>
          <Button variant="danger">Banish</Button>
          <IconButton ariaLabel={c.settings} iconName="palette" />
        </div>
        <ButtonGroup ariaLabel={`View mode ${theme}`} size="sm" variant="secondary">
          {(["All", "Ready", "Paused"] as const).map((label, index) => (
            <Button key={label} aria-pressed={groupIndex === index} onClick={() => setGroupIndex(index)}>
              {label}
            </Button>
          ))}
        </ButtonGroup>
        <div className="tcrn-doc-seasonal-fields component-example-field-column">
          <Input name={`title-${theme}`} aria-label="Cue label" defaultValue="Spectral batch #31" />
          <SearchInput name={`search-${theme}`} aria-label="Filter cues" placeholder="Search seasonal cues" shortcut="auto" />
          <Select name={`route-${theme}`} aria-label="Primary route" options={halloweenChoiceOptions} defaultValue="lantern" />
          <MultiSelect
            name={`tags-${theme}`}
            aria-label="Active channels"
            options={halloweenChoiceOptions}
            value={selectedChoices}
            onChange={setSelectedChoices}
            presentation="dropdown"
            emptySelectionLabel="Choose channels"
            clearSelectionLabel="Clear"
          />
          <label className="component-choice-label">
            <Checkbox name={`confirm-${theme}`} defaultChecked />
            Acknowledge AA surface check
          </label>
          <Switch name={`enable-${theme}`} label="Seasonal surface active" defaultChecked={theme === "halloween"} className="tcrn-switch--sm" />
        </div>
      </div>
    </div>
  );
}

export const Overview = {
  render: () => (
    <section className="component-overview" lang="en">
      <header>
        <Heading level={1}>Seasonal Halloween theme</Heading>
        <Text>Opt-in seasonal layer (@tcrn/ui-tokens/halloween.css) · awaiting Owner visual acceptance</Text>
      </header>
      <Text>
        Applies plum-obsidian canvases, warm parchment ink, amber accent buttons, sage status tokens and tight shadow edges via
        <code className="tcrn-doc-code"> data-tcrn-theme="halloween"</code>. Pinned light/dark values, geometries, radii, typography,
        icons and motion remain unchanged.
      </Text>
      <div className="tcrn-doc-themes">
        {themeModes.map((theme) => (
          <ThemeSpecimenCard key={theme} theme={theme} />
        ))}
      </div>
      <div className="component-comparison">
        <Heading level={2} visualLevel={3}>Themed color token comparison</Heading>
        <table className="tcrn-doc-table">
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Day</th>
              <th scope="col">Night</th>
              <th scope="col">Halloween</th>
            </tr>
          </thead>
          <tbody>
            {tcrnGplusThemedTokens.map((entry) => {
              const dark = darkByVar.get(entry.cssVar) ?? entry.dark;
              const halloween = halloweenByVar.get(entry.cssVar) ?? entry.light;
              return (
                <tr key={entry.key}>
                  <td title={entry.cssVar}><code>{entry.key}</code></td>
                  <td title={entry.light}><span className="tcrn-doc-swatch" style={{ background: entry.light }} />{entry.light}</td>
                  <td title={dark}><span className="tcrn-doc-swatch" style={{ background: dark }} />{dark}</td>
                  <td title={halloween}><span className="tcrn-doc-swatch" style={{ background: halloween }} />{halloween}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="tcrn-doc-row">
        <a className="tcrn-link" href="/ai/4.2.0/pattern/seasonal-halloween-theme.json">Read the seasonal Halloween theme contract</a>
      </div>
    </section>
  ),
};

function InteractiveWorkspaceView() {
  const [activeTheme, setActiveTheme] = useState<AnyThemeMode>("halloween");
  const [selectedTab, setSelectedTab] = useState("all");
  const [channels, setChannels] = useState<string[]>(["lantern"]);
  const c = docsCopy("en");
  const controller = useProductShellController({
    initialLocale: "en_PRODUCT",
    localeDefinitions: [{ locale: "en_PRODUCT", lang: "en", copy: productShellCopyFor("en") }] as const,
    requestPreferences: { pins: ["roster"] },
  });

  return (
    <section className="component-overview" lang="en">
      <header>
        <Heading level={1}>Interactive seasonal shell workspace</Heading>
        <Text>Switch theme context cleanly across approved ProductShell, Tabs, Buttons and body-mounted MultiSelect popups.</Text>
      </header>
      <div className="tcrn-doc-row">
        <ButtonGroup ariaLabel="Active preview theme" variant="secondary">
          {themeModes.map((mode) => (
            <Button key={mode} aria-pressed={activeTheme === mode} onClick={() => setActiveTheme(mode)}>
              {themeLabels[mode]}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      <div className="tcrn-doc-seasonal-shell" data-tcrn-theme={activeTheme}>
        <ProductShell
          productName="TCRN TMS"
          brandProductId="tms"
          moduleName={c.roster}
          currentRouteLabel={c.roster}
          navGroups={rosterGroups("en")}
          locales={[{ locale: "en_PRODUCT", nativeName: "English", lang: "en" }]}
          {...controller.productShellControlProps}
          currentTheme={activeTheme === "light" ? "light" : "dark"}
          pageHeader={{
            title: "Seasonal theme shell check",
            description: `Rendering ProductShell inside data-tcrn-theme="${activeTheme}"`,
            actions: (
              <div className="tcrn-doc-row">
                <Button variant="primary">Confirm cue</Button>
                <Button variant="danger">Reset</Button>
              </div>
            ),
          }}
        >
          <Tabs
            label="Cue queues"
            selectedId={selectedTab}
            onSelect={setSelectedTab}
            items={[
              { id: "all", label: "All 12" },
              { id: "active", label: "Active 8" },
              { id: "paused", label: "Paused 4" },
            ]}
          >
            <div className="tcrn-doc-seasonal-fields component-example-field-column">
              <SearchInput name="shell-search" aria-label="Search queues" placeholder="Filter queues" shortcut="auto" />
              <MultiSelect
                name="shell-channels"
                aria-label="Shell channels"
                options={halloweenChoiceOptions}
                value={channels}
                onChange={setChannels}
                presentation="dropdown"
                emptySelectionLabel="Select channels"
                clearSelectionLabel="Clear"
              />
              <Text size="meta">
                <Icon name="palette" size="sm" /> Active surface attribute: <code className="tcrn-doc-code">{activeTheme}</code>
              </Text>
            </div>
          </Tabs>
        </ProductShell>
      </div>
    </section>
  );
}

export const InteractiveWorkspace = {
  render: () => <InteractiveWorkspaceView />,
};
