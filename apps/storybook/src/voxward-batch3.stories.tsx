import { useRef, useState } from "react";
import {
  Avatar,
  Badge,
  BrandIcon,
  Button,
  ButtonGroup,
  Card,
  CollapsibleRegion,
  ConfirmActionDialog,
  Dialog,
  Divider,
  EditorialArticle,
  EditorialNote,
  EmptyState,
  EnvironmentBanner,
  ErrorState,
  Heading,
  Icon,
  InlineAlert,
  InlineConfirmBar,
  Input,
  KeyValueList,
  LinkButton,
  Menu,
  Popover,
  ProductLockup,
  ProductLogo,
  ProductShell,
  PublicSiteFooter,
  PublicSiteHeader,
  RawPayloadBox,
  RecordTable,
  SegmentedNav,
  SettingsLayout,
  ShellThemeToggle,
  SplitView,
  StagePipeline,
  StatCard,
  StateSurface,
  StatusBadge,
  StatusDot,
  Surface,
  TableShell,
  TableToolbar,
  Text,
  Tooltip,
  productShellCopyFor,
  useProductShellController,
  type ProductShellNavGroup,
  type ShellThemeMode,
} from "@tcrn/ui-react/approved";
import type { AnyThemeMode } from "@tcrn/ui-tokens";

const themeModes: readonly AnyThemeMode[] = ["light", "dark", "halloween"];
const themeLabels: Record<AnyThemeMode, string> = {
  light: "Day (pinned)",
  dark: "Night (pinned)",
  halloween: "Halloween (seasonal)",
};

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

export default {
  title: "Adopted support/Batch 3 components and VoxWard shell",
  parameters: { layout: "fullscreen", adoptedSupport: true },
};

function VoxwardShellCard({ initialTheme }: { initialTheme: ShellThemeMode }) {
  const [bannerVisible, setBannerVisible] = useState(true);
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
            />
          ) : undefined
        }
        account={{ name: "Kaito Mori", initials: "KM" }}
        notifications={{ unread: 2 }}
        landmarkLabel={`VoxWard ${initialTheme}`}
        pageHeader={{
          title: "Live stream moderation queue",
          description: `VoxWard shell specimen (${themeLabels[controller.theme]})`,
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
          actions={<StatusBadge state={{ state: "ready" }} />}
        >
          <Text>
            Left primary pins and right backoffice pins share identical internal spacing, separated by a 1×16 divider with external-link and disabled pin semantics.
          </Text>
        </Surface>
      </ProductShell>
    </div>
  );
}

export const ShellAndBrand = {
  render: () => (
    <section className="component-overview" lang="en">
      <header>
        <Heading level={1}>VoxWard brand mark and extended ProductShell</Heading>
        <Text>Pure-package specimens across Day, Night, and Halloween themes · awaiting Owner visual review</Text>
      </header>
      <div className="tcrn-doc-themes">
        {themeModes.map((theme) => (
          <div key={theme} className="tcrn-doc-pane" data-tcrn-theme={theme}>
            <Heading level={2} visualLevel={4}>{themeLabels[theme]}</Heading>
            <div className="tcrn-doc-paper">
              <div className="tcrn-doc-row">
                {(["color", "mono", "tile-tint", "tile-deep"] as const).map((variant) => (
                  <ProductLogo key={variant} productId="voxward" markVariant={variant} locale="en" />
                ))}
              </div>
              <ProductLockup productId="voxward" locale="en" />
              <ProductLockup productId="voxward" locale="zh-CN" scale="rail" />
            </div>
          </div>
        ))}
      </div>
      {themeModes.map((theme) => (
        <VoxwardShellCard key={theme} initialTheme={theme} />
      ))}
      <div className="tcrn-doc-row">
        <a className="tcrn-link" href="/ai/4.2.0/pattern/batch3-components-and-shell.json">
          Read the Batch 3 components and shell contract
        </a>
      </div>
    </section>
  ),
};

function FeedbackAndDataPane({ theme }: { theme: AnyThemeMode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>(["msg-101"]);

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
    <div className="tcrn-doc-pane" data-tcrn-theme={theme}>
      <Heading level={2} visualLevel={4}>{themeLabels[theme]}</Heading>
      <div className="tcrn-doc-paper">
        <Surface heading={<Heading level={3}>Feedback family</Heading>}>
          <div className="tcrn-doc-row">
            <Badge tone="neutral">Neutral</Badge>
            <Badge tone="positive">Cleared</Badge>
            <Badge tone="warning">Slow mode</Badge>
            <Badge tone="danger">Blocked</Badge>
            <Badge tone="accent">Pinned</Badge>
            <StatusBadge state={{ state: "ready" }} />
          </div>
          <div className="tcrn-doc-row">
            <StatusDot tone="neutral" label="Standby" />
            <StatusDot tone="positive" label="Connected" />
            <StatusDot tone="warning" label="Rate limited" />
            <StatusDot tone="danger" label="Disconnected" />
            <StatusDot tone="accent" aria-label="Active indicator" />
          </div>
          <InlineAlert tone="warning" role="status">
             High chat velocity detected; automated phrase hold threshold lowered.
          </InlineAlert>
          <EnvironmentBanner label="Replay verification environment" state={{ state: "local_only", label: "Replay" }} tone="accent" />
          <StateSurface
            tone="positive"
            title="Ward boundary synchronized"
            description="All moderation filters match the active stream policy."
          />
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
            controlsId={`moderation-table-${theme}`}
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
          />
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
          <RecordTable
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

export const FeedbackAndDataDisplay = {
  render: () => (
    <section className="component-overview" lang="en">
      <header>
        <Heading level={1}>Feedback and DataDisplay families</Heading>
        <Text>Semantic state pairs, custom table tracks, avatars, pipelines and raw payload boxes across three themes.</Text>
      </header>
      <div className="tcrn-doc-themes">
        {themeModes.map((theme) => (
          <FeedbackAndDataPane key={theme} theme={theme} />
        ))}
      </div>
    </section>
  ),
};

function LayoutAndOverlayPane({ theme }: { theme: AnyThemeMode }) {
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
    <div className="tcrn-doc-pane" data-tcrn-theme={theme} data-batch3-overlay-pane={theme}>
      <Heading level={2} visualLevel={4}>{themeLabels[theme]}</Heading>
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
                  <Input name={`threshold-${theme}`} aria-label={`Cooldown seconds (${theme})`} defaultValue="30" />
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
              Open policy dialog
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

export const LayoutAndOverlays = {
  render: () => {
    const [focusedTheme, setFocusedTheme] = useState<AnyThemeMode>("light");
    return (
      <section className="component-overview" lang="en">
        <header>
          <Heading level={1}>Layout and Overlay families</Heading>
          <Text>Container-responsive settings and split views, pill segmented nav, floating bottom-end overlays, and two-stage inline confirmation.</Text>
        </header>
        <div className="tcrn-doc-row">
          <ButtonGroup ariaLabel="Highlight theme focus" size="sm" variant="secondary">
            {themeModes.map((mode) => (
              <Button key={mode} aria-pressed={focusedTheme === mode} onClick={() => setFocusedTheme(mode)}>
                {themeLabels[mode]}
              </Button>
            ))}
          </ButtonGroup>
        </div>
        <div className="tcrn-doc-themes" data-focused-theme={focusedTheme}>
          {themeModes.map((theme) => (
            <LayoutAndOverlayPane key={theme} theme={theme} />
          ))}
        </div>
      </section>
    );
  },
};

export const PublicSiteAndEditorial = {
  render: () => (
    <section className="component-overview" lang="en">
      <header>
        <Heading level={1}>Public Site, Editorial &amp; Platform Mother Mark</Heading>
        <Text>Adopted TCRN Platform mother mark, BrandIcon (github), sticky public site chrome, and long-form editorial sheets across all three themes.</Text>
      </header>
      <div className="tcrn-doc-themes">
        {themeModes.map((theme) => (
          <div key={theme} className="tcrn-doc-pane" data-tcrn-theme={theme} data-public-site-theme={theme}>
            <Heading level={2} visualLevel={4}>{themeLabels[theme]}</Heading>
            <div className="tcrn-doc-paper">
              <PublicSiteHeader
                productId="platform"
                locale="en"
                homeHref="#overview"
                navLabel={`Public navigation ${theme}`}
                navItems={[
                  { id: "overview", label: "Overview", href: "#overview" },
                  { id: "privacy", label: "Privacy", href: "#privacy", current: true },
                  { id: "identity", label: "Identity", href: "#identity" },
                  { id: "terms", label: "Terms", href: "#terms" },
                ]}
                controls={
                  <ShellThemeToggle
                    currentTheme={theme === "halloween" ? "dark" : theme}
                    onThemeChange={() => {}}
                    locale="en"
                    variant="quiet"
                  />
                }
              />
              <div className="tcrn-doc-row">
                <ProductLogo productId="platform" markVariant="color" locale="en" />
                <ProductLogo productId="platform" markVariant="mono" locale="en" />
                <ProductLogo productId="platform" markVariant="tile-tint" locale="en" />
                <ProductLogo productId="platform" markVariant="tile-deep" locale="en" />
                <ProductLockup productId="platform" locale="en" />
              </div>
              <EditorialArticle
                title="Google API Services User Data Policy & Limited Use Compliance"
                meta="Effective 2026-11-25 · TCRN Platform"
                lead="How official hosted TCRN services handle sign-in verification and minimal account data."
                backLink={{ label: "Back to overview", href: "#overview" }}
                relatedLinks={[
                  { id: "identity", label: "Unified Identity", href: "#identity" },
                  { id: "terms", label: "Terms of Service", href: "#terms" },
                ]}
              >
                <section>
                  <h2>1. Hosted Scope and Local Tools</h2>
                  <p>Official hosted services store only the minimum identifier needed for authenticated access.</p>
                  <ul>
                    <li>Local packages run offline with zero telemetry.</li>
                    <li>Hosted sessions follow least-privilege OAuth scopes.</li>
                  </ul>
                  <EditorialNote>
                    <strong>Zero built-in telemetry:</strong> open-source projects never phone home.
                  </EditorialNote>
                </section>
              </EditorialArticle>
              <div className="tcrn-doc-row">
                <LinkButton variant="secondary" size="sm" href="https://github.com/The-Cloud-River-Network">
                  <BrandIcon name="github" size="sm" />
                  GitHub
                </LinkButton>
              </div>
              <PublicSiteFooter
                copyright="© 2026 TCRN Platform"
                navLabel={`Footer ${theme}`}
                links={[
                  { id: "privacy", label: "Privacy", href: "#privacy" },
                  { id: "terms", label: "Terms", href: "#terms" },
                  { id: "github", label: "GitHub", href: "https://github.com/The-Cloud-River-Network", external: true, icon: <BrandIcon name="github" size="sm" /> },
                ]}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  ),
};
