import { useRef, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  CollapsibleRegion,
  ConfirmActionDialog,
  Dialog,
  Divider,
  EmptyState,
  EnvironmentBanner,
  ErrorState,
  Heading,
  Highlight,
  Icon,
  IconButton,
  InlineAlert,
  InlineConfirmBar,
  Input,
  KeyValueList,
  LinkButton,
  Menu,
  MultiSelect,
  Popover,
  ProductLockup,
  ProductShell,
  RawPayloadBox,
  RecordTable,
  SearchInput,
  SegmentedNav,
  Select,
  SettingsLayout,
  SplitView,
  StagePipeline,
  StatCard,
  StateSurface,
  StatusBadge,
  StatusDot,
  Surface,
  Switch,
  TableShell,
  TableToolbar,
  Tabs,
  Text,
  Tooltip,
  productShellCopyFor,
  useProductShellController,
  type ProductShellNavGroup,
  type ShellThemeMode,
} from "@tcrn/ui-react/approved";
import {
  tcrnDarkThemeTokens,
  tcrnGplusThemedTokens,
  tcrnHalloweenThemeTokens,
  type AnyThemeMode,
} from "@tcrn/ui-tokens";
import type { DocsLocale } from "./approved-source.js";
import { docsCopy } from "./locales.js";
import { pageHref, type DocsEntry } from "./portal-navigation.js";
import { specimenCopy } from "./specimen-copy.js";
import { rosterGroups } from "./specimens.js";

const threeThemes: readonly AnyThemeMode[] = ["light", "dark", "halloween"];
const darkByVar = new Map<string, string>(tcrnDarkThemeTokens.map((entry) => [entry.variable, entry.value]));
const halloweenByVar = new Map<string, string>(tcrnHalloweenThemeTokens.map((entry) => [entry.variable, entry.value]));

const halloweenChoiceOptions = [
  { value: "lantern", label: "Lantern relay" },
  { value: "cauldron", label: "Potion ledger" },
  { value: "midnight", label: "Archive curfew", disabled: true },
];

const voxwardNavGroups: readonly ProductShellNavGroup[] = [
  {
    id: "ward",
    label: "Live ward",
    items: [
      { id: "stream-queue", label: "Stream queue", href: "#stream-queue", iconName: "layers", selected: true },
      { id: "triage-rules", label: "Triage rules", href: "#triage-rules", iconName: "shield-check" },
      { id: "ward-metrics", label: "Ward metrics", href: "#ward-metrics", iconName: "layout-grid" },
    ],
  },
  {
    id: "backoffice",
    label: "Backoffice",
    align: "end",
    items: [
      { id: "moderation-log", label: "Moderation log", href: "#moderation-log", iconName: "history" },
      { id: "obs-handbook", label: "OBS guide", href: "https://example.com/obs-guide", external: true, iconName: "book-open" },
      { id: "archive-export", label: "Archive export", href: "#archive-export", disabled: true, disabledReason: "Restricted in sandbox mode", iconName: "database" },
    ],
  },
];

function SeasonalThemeCard({ theme, locale }: { theme: AnyThemeMode; locale: DocsLocale }) {
  const c = docsCopy(locale);
  const themeLabel = specimenCopy[locale].themes[theme];
  const [selectedChoices, setSelectedChoices] = useState<string[]>(["lantern"]);
  const [groupIndex, setGroupIndex] = useState(0);

  return (
    <div className="tcrn-doc-pane" data-tcrn-theme={theme} data-formal-theme={theme}>
      <Heading level={2} visualLevel={4}>{themeLabel}</Heading>
      <div className="tcrn-doc-paper">
        <div className="tcrn-doc-row">
          <ProductLockup productId="tms" locale={locale} scale="rail" />
          <ProductLockup productId="voxward" locale={locale} scale="rail" />
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
          <IconButton ariaLabel={`${c.settings} (${themeLabel})`} iconName="palette" />
        </div>
        <ButtonGroup ariaLabel={`View mode ${theme}`} size="sm" variant="secondary">
          {(["All", "Ready", "Paused"] as const).map((label, index) => (
            <Button key={label} aria-pressed={groupIndex === index} onClick={() => setGroupIndex(index)}>
              {label}
            </Button>
          ))}
        </ButtonGroup>
        <div className="tcrn-doc-seasonal-fields component-example-field-column">
          <Input name={`portal-seasonal-title-${theme}`} aria-label={`Cue label (${theme})`} defaultValue="Spectral batch #31" />
          <SearchInput name={`portal-seasonal-search-${theme}`} aria-label={`Filter cues (${theme})`} placeholder="Search seasonal cues" shortcut="auto" />
          <Select name={`portal-seasonal-route-${theme}`} aria-label={`Primary route (${theme})`} options={halloweenChoiceOptions} defaultValue="lantern" />
          <MultiSelect
            name={`portal-seasonal-tags-${theme}`}
            aria-label={`Active channels (${theme})`}
            options={halloweenChoiceOptions}
            value={selectedChoices}
            onChange={setSelectedChoices}
            presentation="dropdown"
            emptySelectionLabel="Choose channels"
            clearSelectionLabel="Clear"
          />
          <label className="component-choice-label">
            <Checkbox name={`portal-seasonal-confirm-${theme}`} defaultChecked />
            Acknowledge AA surface check
          </label>
          <Switch name={`portal-seasonal-enable-${theme}`} label="Seasonal surface active" defaultChecked={theme === "halloween"} className="tcrn-switch--sm" />
        </div>
      </div>
    </div>
  );
}

export function SeasonalHalloweenSpecimen({ locale }: { locale: DocsLocale }) {
  const { tokens, themes } = specimenCopy[locale];
  const [activeTheme, setActiveTheme] = useState<AnyThemeMode>("halloween");
  const [selectedTab, setSelectedTab] = useState("all");
  const [channels, setChannels] = useState<string[]>(["lantern"]);
  const c = docsCopy(locale);
  const controller = useProductShellController({
    initialLocale: "en_PRODUCT",
    initialTheme: "halloween",
    seasonalThemes: ["halloween"],
    localeDefinitions: [{ locale: "en_PRODUCT", lang: "en", copy: productShellCopyFor("en") }] as const,
    requestPreferences: { pins: ["roster"], theme: "halloween" },
  });

  const handleThemeSelect = (mode: AnyThemeMode) => {
    setActiveTheme(mode);
    controller.setTheme(mode);
  };

  return (
    <>
      <section className="tcrn-doc-section" data-doc-seasonal-overview="">
        <Text>
          <code className="tcrn-doc-code">@tcrn/ui-tokens/halloween.css</code> ·{" "}
          <code className="tcrn-doc-code">data-tcrn-theme="halloween"</code>
        </Text>
        <div className="tcrn-doc-themes tcrn-doc-themes--three">
          {threeThemes.map((theme) => (
            <SeasonalThemeCard key={theme} theme={theme} locale={locale} />
          ))}
        </div>
      </section>

      <section className="tcrn-doc-section" data-doc-seasonal-shell="">
        <div className="tcrn-doc-brand-scales__head">
          <Heading level={2} visualLevel={3}>{themes.halloween} · ProductShell</Heading>
          <ButtonGroup ariaLabel="Active seasonal preview theme" size="sm" variant="secondary">
            {threeThemes.map((mode) => (
              <Button key={mode} aria-pressed={activeTheme === mode} onClick={() => handleThemeSelect(mode)}>
                {themes[mode]}
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
            navGroups={rosterGroups(locale)}
            locales={[{ locale: "en_PRODUCT", nativeName: "English", lang: "en" }]}
            seasonalThemes={["halloween"]}
            {...controller.productShellControlProps}
            currentTheme={activeTheme}
            onThemeChange={handleThemeSelect}
            landmarkLabel="Seasonal workspace"
            contentId="portal-seasonal-shell-workspace"
            pageHeader={{
              title: "Seasonal theme shell check",
              description: `Rendering ProductShell inside data-tcrn-theme="${activeTheme}"`,
              headingLevel: 2,
              actions: (
                <div className="tcrn-doc-row">
                  <Button variant="primary" size="sm">Confirm cue</Button>
                  <Button variant="danger" size="sm">Reset</Button>
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
                <SearchInput name="portal-shell-search" aria-label="Search queues" placeholder="Filter queues" shortcut="auto" />
                <MultiSelect
                  name="portal-shell-channels"
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

      <section className="tcrn-doc-section" data-doc-seasonal-tokens="">
        <Heading level={2} visualLevel={3}>{tokens.themed}</Heading>
        <div className="tcrn-doc-table-wrap">
          <table className="tcrn-doc-table">
            <thead>
              <tr>
                <th scope="col">{tokens.token}</th>
                <th scope="col">{themes.light}</th>
                <th scope="col">{themes.dark}</th>
                <th scope="col">{themes.halloween}</th>
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
      </section>

      <div className="tcrn-doc-row">
        <a className="tcrn-link" href="/ai/4.2.0/pattern/seasonal-halloween-theme.json">
          Seasonal Halloween theme contract (JSON)
        </a>
      </div>
    </>
  );
}

function FeedbackDataPane({ theme, locale }: { theme: AnyThemeMode; locale: DocsLocale }) {
  const [selectedIds, setSelectedIds] = useState<string[]>(["msg-101"]);
  const themeLabel = specimenCopy[locale].themes[theme];

  const tableRows = [
    {
      id: "msg-101",
      author: (
        <span className="tcrn-doc-row">
          <Avatar name="Hoshino Hikari" size="sm" />
          <span>Hoshino Hikari</span>
        </span>
      ),
      channel: "Main stage",
      status: <StatusDot tone="positive" label="Cleared" />,
      score: "0.04",
    },
    {
      id: "msg-102",
      author: (
        <span className="tcrn-doc-row">
          <Avatar name="Kenji Sato" size="sm" />
          <span>Kenji Sato</span>
        </span>
      ),
      channel: "Member relay",
      status: <StatusDot tone="warning" label="Held for review" />,
      score: "0.78",
    },
  ];

  return (
    <div className="tcrn-doc-pane" data-tcrn-theme={theme} data-formal-theme={theme}>
      <Heading level={2} visualLevel={4}>{themeLabel}</Heading>
      <div className="tcrn-doc-paper">
        <Surface heading={<Heading level={3}>Feedback family</Heading>}>
          <div className="tcrn-doc-row">
            <Badge tone="neutral">Neutral</Badge>
            <Badge tone="positive">Cleared</Badge>
            <Badge tone="warning">Slow mode</Badge>
            <Badge tone="danger">Blocked</Badge>
            <Badge tone="accent">Pinned</Badge>
            <StatusBadge state={{ state: "ready" }} locale={locale} />
          </div>
          <div className="tcrn-doc-row">
            <StatusDot tone="neutral" label="Standby" />
            <StatusDot tone="positive" label="Connected" />
            <StatusDot tone="warning" label="Rate limited" />
            <StatusDot tone="danger" label="Disconnected" />
            <StatusDot tone="accent" aria-label={`Active indicator (${theme})`} />
          </div>
          <InlineAlert tone="warning" role="status">
            High chat velocity detected; automated phrase hold threshold lowered.
          </InlineAlert>
          <EnvironmentBanner label="Replay verification environment" state={{ state: "local_only", label: "Replay" }} tone="accent" locale={locale} />
          <StateSurface
            tone="positive"
            title="Ward boundary synchronized"
            description="All moderation filters match the active stream policy."
          />
          <div className="tcrn-doc-grid">
            <EmptyState
              title="No held messages"
              description="Messages matching hold rules will appear in this queue."
              action={<Button variant="secondary" size="sm">Refresh queue</Button>}
            />
            <ErrorState
              title="Relay stream interrupted"
              description="Reconnect the chat ingest socket to resume live moderation."
              action={<Button variant="primary" size="sm">Reconnect</Button>}
            />
          </div>
        </Surface>

        <Divider />

        <Surface heading={<Heading level={3}>DataDisplay family</Heading>}>
          <div className="tcrn-doc-row">
            <StatCard label="Processed / min" value="1,420" note="+12% vs baseline" tone="positive" />
            <StatCard label="Held in ward" value="7" note="2 awaiting moderator" tone="warning" />
            <StatCard label="Blocked bursts" value="19" note="Auto-muted" tone="danger" />
          </div>
          <div className="tcrn-doc-row">
            <Card tone="neutral">
              <Heading level={4}>Neutral card</Heading>
              <Text size="meta">1px hairline panel carrier</Text>
            </Card>
            <Card tone="raised">
              <Heading level={4}>Raised card</Heading>
              <Text size="meta">Tight s1 elevation carrier</Text>
            </Card>
            <Card tone="quiet">
              <Heading level={4}>Quiet card</Heading>
              <Text size="meta">Wash background carrier</Text>
            </Card>
          </div>
          <div className="tcrn-doc-row">
            <Avatar name="Aoi Takahashi" size="sm" />
            <Avatar name="Mika Lindqvist" size="md" />
            <Avatar name="Sora Takanashi" size="lg" />
          </div>
          <TableToolbar
            label={`Moderation toolbar (${theme})`}
            controlsId={`portal-moderation-table-${theme}`}
            searchLabel={`Filter stream messages (${theme})`}
            searchPlaceholder="Search author or channel"
            filterLabel="Message status"
            filterOptions={[
              { id: "held", label: "Held" },
              { id: "cleared", label: "Cleared" },
            ]}
            selectedCount={selectedIds.length}
            onClearSelection={() => setSelectedIds([])}
            bulkActions={<Button size="sm" variant="secondary">Approve selected</Button>}
            matchCountFormat={`${tableRows.length} messages`}
            locale={locale}
          />
          <div className="tcrn-doc-table-wrap">
            <TableShell
              label={`Moderation queue (${theme})`}
              selectableRows
              selectedRowIds={selectedIds}
              onSelectedRowIdsChange={setSelectedIds}
              columns={[
                { key: "author", label: "Author", width: "minmax(160px, 1.4fr)" },
                { key: "channel", label: "Channel", width: "minmax(110px, 1fr)" },
                { key: "status", label: "Status", width: "minmax(130px, 1fr)" },
                { key: "score", label: "Risk score", width: "96px", align: "end" },
              ]}
              rows={tableRows}
            />
          </div>
          <RecordTable
            locale={locale}
            selectableRows
            selectedRowIds={selectedIds.slice(0, 1)}
            onSelectedRowIdsChange={setSelectedIds}
            rows={[
              {
                id: "msg-101",
                title: "Phrase filter · main stage",
                summary: "Rule #14 matched burst cadence",
                state: { state: "ready" },
                owner: "Ward auto-triage",
                fields: [{ key: "updated", label: "Updated", value: "2m ago" }],
              },
            ]}
          />
          <KeyValueList
            items={[
              { key: "room", label: "Broadcast room", value: "Stage Alpha" },
              { key: "latency", label: "Ingest latency", value: "42 ms" },
              { key: "mode", label: "Protection mode", value: "Strict keyword + slow-mode" },
            ]}
          />
          <StagePipeline
            locale={locale}
            label={`Ingest pipeline (${theme})`}
            stages={[
              { id: "ingest", label: "Chat ingest", state: { state: "ready" }, owner: "Ingest worker", references: ["VW-PIPE-01"], nextAction: "Forward to classifier" },
              { id: "classify", label: "Classifier", state: { state: "ready" }, owner: "Policy engine", references: ["VW-PIPE-02"], nextAction: "Emit ward decision" },
              { id: "publish", label: "Overlay relay", state: { state: "local_only", label: "Standby" }, owner: "Stage sink", references: ["VW-PIPE-03"] },
            ]}
          />
          <RawPayloadBox
            label="Normalized event payload"
            copyLabel={`Copy payload ${theme}`}
            payload={'{\n  "event": "chat.message.held",\n  "channel": "stage-alpha",\n  "riskScore": 0.78\n}'}
          />
        </Surface>
      </div>
    </div>
  );
}

export function FeedbackDataSpecimen({ locale }: { locale: DocsLocale }) {
  const { themes } = specimenCopy[locale];
  const [filterTheme, setFilterTheme] = useState<"all" | AnyThemeMode>("all");
  const visibleThemes = filterTheme === "all" ? threeThemes : [filterTheme];

  return (
    <>
      <div className="tcrn-doc-row">
        <ButtonGroup ariaLabel="Filter preview theme" size="sm" variant="secondary">
          <Button aria-pressed={filterTheme === "all"} onClick={() => setFilterTheme("all")}>
            {docsCopy(locale).all}
          </Button>
          {threeThemes.map((mode) => (
            <Button key={mode} aria-pressed={filterTheme === mode} onClick={() => setFilterTheme(mode)}>
              {themes[mode]}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      <div className="tcrn-doc-themes tcrn-doc-themes--stack">
        {visibleThemes.map((theme) => (
          <FeedbackDataPane key={theme} theme={theme} locale={locale} />
        ))}
      </div>
      <div className="tcrn-doc-row">
        <a className="tcrn-link" href="/ai/4.2.0/pattern/batch3-components-and-shell.json">
          Feedback &amp; DataDisplay contract (JSON)
        </a>
      </div>
    </>
  );
}

function LayoutOverlayPane({ theme, locale }: { theme: AnyThemeMode; locale: DocsLocale }) {
  const themeLabel = specimenCopy[locale].themes[theme];
  const [segment, setSegment] = useState("live");
  const [expanded, setExpanded] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [inlineConfirmArmed, setInlineConfirmArmed] = useState(true);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const popoverTriggerRef = useRef<HTMLButtonElement>(null);
  const dialogTriggerRef = useRef<HTMLButtonElement>(null);
  const confirmTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="tcrn-doc-pane" data-tcrn-theme={theme} data-formal-theme={theme} data-batch3-overlay-pane={theme}>
      <Heading level={2} visualLevel={4}>{themeLabel}</Heading>
      <div className="tcrn-doc-paper">
        <SettingsLayout
          navigationLabel={`Ward settings sections (${theme})`}
          contentLabel={`Ward settings form (${theme})`}
          navigation={
            <>
              <Button variant="quiet" size="sm" aria-pressed>Ingest policy</Button>
              <Button variant="quiet" size="sm">Moderator roles</Button>
              <Button variant="quiet" size="sm">Webhook sinks</Button>
            </>
          }
          hostSwitcher={
            <>
              <Text tone="strong">Active room: Stage Alpha</Text>
              <SegmentedNav
                label={`Stream mode (${theme})`}
                onSelect={setSegment}
                items={[
                  { id: "live", label: "Live", selected: segment === "live" },
                  { id: "rehearsal", label: "Rehearsal", selected: segment === "rehearsal" },
                  { id: "standby", label: "Standby", selected: segment === "standby" },
                ]}
              />
            </>
          }
        >
          <SplitView
            label={`Rule list and inspector (${theme})`}
            detailPopulated
            list={
              <Card tone="neutral">
                <Heading level={4}>Active filter rules</Heading>
                <Text>1. Burst flood limiter (8 msg / 5s)</Text>
                <Text>2. Repeated link quarantine</Text>
              </Card>
            }
            detail={
              <Card tone="neutral">
                <Heading level={4}>Selected rule inspector</Heading>
                <Text>Quarantines unverified external links until moderator approval.</Text>
                <div className="component-example-field-column">
                  <Input name={`portal-threshold-${theme}`} aria-label={`Cooldown seconds (${theme})`} defaultValue="30" />
                </div>
              </Card>
            }
          />

          <div className="tcrn-doc-row">
            <Button variant="secondary" size="sm" aria-expanded={expanded} onClick={() => setExpanded((prev) => !prev)}>
              {expanded ? "Collapse advanced thresholds" : "Expand advanced thresholds"}
            </Button>
          </div>
          <CollapsibleRegion expanded={expanded}>
            <Card tone="quiet">
              <Text>Advanced escalation window: 120 seconds rolling burst memory.</Text>
            </Card>
          </CollapsibleRegion>
        </SettingsLayout>

        <Divider />

        <Surface
          heading={<Heading level={3}>Overlay family</Heading>}
          actions={
            <>
              <Button
                ref={menuTriggerRef}
                variant="secondary"
                size="sm"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                data-batch3-menu-trigger={theme}
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                Actions
              </Button>
              <Menu
                open={menuOpen}
                onOpenChange={setMenuOpen}
                triggerRef={menuTriggerRef}
                placement="bottom-end"
                label={`Moderation actions (${theme})`}
                items={[
                  { id: "approve", label: "Approve message", description: "Release immediately to live stage overlay" },
                  { id: "hold", label: "Escalate to lead", description: "Keep muted and notify shift lead" },
                  { id: "ban", label: "Ban sender", description: "Block account across current broadcast", tone: "danger" },
                ]}
              />
              <Button
                ref={popoverTriggerRef}
                variant="secondary"
                size="sm"
                aria-haspopup="dialog"
                aria-expanded={popoverOpen}
                data-batch3-popover-trigger={theme}
                onClick={() => setPopoverOpen((prev) => !prev)}
              >
                Limits
              </Button>
              <Popover
                title="Rate limit window"
                open={popoverOpen}
                onOpenChange={setPopoverOpen}
                triggerRef={popoverTriggerRef}
                placement="bottom-end"
              >
                <Text>Current bucket allows 4 messages per 10 seconds per viewer.</Text>
              </Popover>
            </>
          }
        >
          <div className="tcrn-doc-row">
            <Tooltip content="Anchored supplemental guidance" placement="top">
              <Button variant="quiet" size="sm">Hover or focus tooltip</Button>
            </Tooltip>
            <Button ref={dialogTriggerRef} variant="secondary" size="sm" onClick={() => setDialogOpen(true)}>
              Open policy modal
            </Button>
            <Dialog title="Broadcast ward policy" open={dialogOpen} onOpenChange={setDialogOpen} triggerRef={dialogTriggerRef}>
              <div className="tcrn-dialog__body">
                <Text>Changes apply immediately to connected ingest workers without dropping active sockets.</Text>
              </div>
              <div className="tcrn-dialog__actions">
                <Button variant="quiet" size="sm" onClick={() => setDialogOpen(false)}>Close</Button>
              </div>
            </Dialog>
            <Button ref={confirmTriggerRef} variant="danger" size="sm" onClick={() => setConfirmOpen(true)}>
              Purge held queue
            </Button>
            <ConfirmActionDialog
              open={confirmOpen}
              onOpenChange={setConfirmOpen}
              triggerRef={confirmTriggerRef}
              tone="danger"
              title="Purge 7 held messages?"
              message="Purged messages are removed from the moderation queue and will not reach the broadcast overlay."
              confirmLabel="Purge queue"
              cancelLabel="Cancel"
              onConfirm={() => setConfirmOpen(false)}
            />
          </div>
          <div data-batch3-following-flow={theme}>
            <Text size="meta">In-flow status line following anchored Menu and Popover triggers (0px shift invariant).</Text>
          </div>
          {inlineConfirmArmed ? (
            <InlineConfirmBar
              tone="warning"
              title="Reset slow-mode cooldown?"
              message="Viewers in Stage Alpha will immediately return to standard posting cadence."
              confirmLabel="Confirm reset"
              cancelLabel="Keep cooldown"
              onConfirm={() => setInlineConfirmArmed(false)}
              onCancel={() => setInlineConfirmArmed(false)}
            />
          ) : (
            <div className="tcrn-doc-row">
              <Button variant="secondary" size="sm" onClick={() => setInlineConfirmArmed(true)}>
                Arm inline confirmation bar
              </Button>
            </div>
          )}
        </Surface>
      </div>
    </div>
  );
}

export function LayoutOverlaySpecimen({ locale }: { locale: DocsLocale }) {
  const { themes } = specimenCopy[locale];
  const [filterTheme, setFilterTheme] = useState<"all" | AnyThemeMode>("all");
  const visibleThemes = filterTheme === "all" ? threeThemes : [filterTheme];

  return (
    <>
      <div className="tcrn-doc-row">
        <ButtonGroup ariaLabel="Filter preview theme" size="sm" variant="secondary">
          <Button aria-pressed={filterTheme === "all"} onClick={() => setFilterTheme("all")}>
            {docsCopy(locale).all}
          </Button>
          {threeThemes.map((mode) => (
            <Button key={mode} aria-pressed={filterTheme === mode} onClick={() => setFilterTheme(mode)}>
              {themes[mode]}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      <div className="tcrn-doc-themes tcrn-doc-themes--stack">
        {visibleThemes.map((theme) => (
          <LayoutOverlayPane key={theme} theme={theme} locale={locale} />
        ))}
      </div>
      <div className="tcrn-doc-row">
        <a className="tcrn-link" href="/ai/4.2.0/pattern/batch3-components-and-shell.json">
          Layout &amp; Overlays contract (JSON)
        </a>
      </div>
    </>
  );
}

function ExtendedShellCard({ initialTheme, locale }: { initialTheme: ShellThemeMode; locale: DocsLocale }) {
  const [bannerVisible, setBannerVisible] = useState(true);
  const themeNames = specimenCopy[locale].themes;
  const controller = useProductShellController({
    initialLocale: "en_VW",
    initialTheme,
    seasonalThemes: ["halloween"],
    localeDefinitions: [{ locale: "en_VW", lang: "en", copy: productShellCopyFor("en") }] as const,
    requestPreferences: {
      pins: ["stream-queue", "triage-rules", "moderation-log", "obs-handbook", "archive-export"],
      theme: initialTheme,
    },
  });

  return (
    <section className="tcrn-doc-section" data-doc-extended-shell={initialTheme}>
      <Heading level={2} visualLevel={4}>{themeNames[controller.theme]}</Heading>
      <div className="tcrn-doc-seasonal-shell" data-tcrn-theme={controller.theme} data-batch3-shell-theme={initialTheme}>
        <ProductShell
          productName="VoxWard"
          brandProductId="voxward"
          moduleName="Stream queue"
          currentRouteLabel="Stream queue"
          navGroups={voxwardNavGroups}
          locales={[{ locale: "en_VW", nativeName: "English", lang: "en" }]}
          seasonalThemes={["halloween"]}
          {...controller.productShellControlProps}
          topBanner={
            bannerVisible ? (
              <EnvironmentBanner
                label="Sandbox stream relay · synthetic moderation feed"
                state={{ state: "local_only", label: "Sandbox" }}
                tone="warning"
                locale={locale}
              />
            ) : undefined
          }
          account={{ name: "Kaito Mori", initials: "KM" }}
          notifications={{ unread: 2 }}
          landmarkLabel={`VoxWard ${initialTheme}`}
          contentId={`portal-voxward-shell-${initialTheme}`}
          pageHeader={{
            title: "Live stream moderation queue",
            description: `VoxWard shell specimen (${themeNames[controller.theme]})`,
            headingLevel: 2,
            actions: (
              <div className="tcrn-doc-row">
                <Button variant="secondary" size="sm" onClick={() => setBannerVisible((prev) => !prev)}>
                  {bannerVisible ? "Hide sandbox bar" : "Show sandbox bar"}
                </Button>
                <Button variant="primary" size="sm">
                  <Icon name="shield-check" size="sm" />
                  Apply ward rule
                </Button>
              </div>
            ),
          }}
        >
          <Surface
            heading={<Heading level={3}>Active channel guard</Heading>}
            actions={<StatusBadge state={{ state: "ready" }} locale={locale} />}
          >
            <Text>
              Left primary pins and right backoffice pins share identical internal spacing, separated by a 1×16 divider with external-link and disabled pin semantics.
            </Text>
          </Surface>
        </ProductShell>
      </div>
    </section>
  );
}

export function ExtendedShellSpecimen({ locale, entry }: { locale: DocsLocale; entry: DocsEntry }) {
  return (
    <>
      {threeThemes.map((theme) => (
        <ExtendedShellCard key={theme} initialTheme={theme} locale={locale} />
      ))}
      <div className="tcrn-doc-row">
        <LinkButton variant="secondary" size="sm" href={pageHref(locale, "brand-voxward", entry)}>
          VoxWard · {specimenCopy[locale].brand.openProduct}
          <Icon name="arrow-right" size="sm" />
        </LinkButton>
        <a className="tcrn-link" href="/ai/4.2.0/pattern/batch3-components-and-shell.json">
          Extended ProductShell contract (JSON)
        </a>
      </div>
    </>
  );
}
