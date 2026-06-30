import {
  Badge,
  DisclosurePanel,
  EnvironmentBanner,
  EvidenceStrip,
  Heading,
  KeyValueList,
  ProductShell,
  StatusBadge,
  Surface,
  TableShell,
  Text,
  WorkIndex,
  type ProductShellNavGroup,
  type ProductShellSearchResult,
  type WorkIndexRow
} from "@tcrn/ui-react";
import { tcrnLocaleMetadata } from "@tcrn/ui-copy-state";

type OwnerQualityRoute = "cockpit" | "work";
type OwnerQualitySearchMode = "rest" | "results";
type OwnerQualityViewport = "desktop" | "mobile";

type OwnerQualityVariant = {
  id: string;
  label: string;
  theme: "light" | "dark";
  locale: "en" | "zh-CN";
  collapsed: boolean;
  route: OwnerQualityRoute;
  searchMode: OwnerQualitySearchMode;
  viewport: OwnerQualityViewport;
  reducedMotion: boolean;
  contentMode: OwnerQualityRoute;
};

const variants: readonly OwnerQualityVariant[] = [
  {
    id: "desktop-light-operations-cockpit",
    label: "Desktop light Operations Cockpit",
    theme: "light",
    locale: "en",
    collapsed: false,
    route: "cockpit",
    searchMode: "rest",
    viewport: "desktop",
    reducedMotion: false,
    contentMode: "cockpit"
  },
  {
    id: "desktop-light-operations-cockpit-collapsed",
    label: "Desktop light Operations Cockpit collapsed",
    theme: "light",
    locale: "en",
    collapsed: true,
    route: "cockpit",
    searchMode: "rest",
    viewport: "desktop",
    reducedMotion: false,
    contentMode: "cockpit"
  },
  {
    id: "desktop-dark-operations-cockpit",
    label: "Desktop dark Operations Cockpit",
    theme: "dark",
    locale: "en",
    collapsed: false,
    route: "cockpit",
    searchMode: "rest",
    viewport: "desktop",
    reducedMotion: false,
    contentMode: "cockpit"
  },
  {
    id: "desktop-dark-operations-cockpit-collapsed",
    label: "Desktop dark Operations Cockpit collapsed",
    theme: "dark",
    locale: "en",
    collapsed: true,
    route: "cockpit",
    searchMode: "rest",
    viewport: "desktop",
    reducedMotion: false,
    contentMode: "cockpit"
  },
  {
    id: "desktop-light-work-queue",
    label: "Desktop light Work queue",
    theme: "light",
    locale: "en",
    collapsed: false,
    route: "work",
    searchMode: "rest",
    viewport: "desktop",
    reducedMotion: false,
    contentMode: "work"
  },
  {
    id: "desktop-light-work-queue-collapsed",
    label: "Desktop light Work queue collapsed",
    theme: "light",
    locale: "en",
    collapsed: true,
    route: "work",
    searchMode: "rest",
    viewport: "desktop",
    reducedMotion: false,
    contentMode: "work"
  },
  {
    id: "mobile-dark-zh-cn-work-queue",
    label: "Mobile dark zh-CN Work queue",
    theme: "dark",
    locale: "zh-CN",
    collapsed: false,
    route: "work",
    searchMode: "rest",
    viewport: "mobile",
    reducedMotion: false,
    contentMode: "work"
  },
  {
    id: "desktop-light-operations-search-results",
    label: "Desktop light Operations Cockpit with search results",
    theme: "light",
    locale: "en",
    collapsed: false,
    route: "cockpit",
    searchMode: "results",
    viewport: "desktop",
    reducedMotion: false,
    contentMode: "cockpit"
  },
  {
    id: "reduced-motion",
    label: "Reduced-motion Operations Cockpit",
    theme: "light",
    locale: "en",
    collapsed: false,
    route: "cockpit",
    searchMode: "rest",
    viewport: "desktop",
    reducedMotion: true,
    contentMode: "cockpit"
  }
] as const;

export const aosOwnerQualityProductShellReadback = {
  storyId: "aos-owner-quality-product-shell",
  page: "components.html#aos-owner-quality-product-shell",
  selector: "[data-storybook-visual-instance=\"aos-owner-quality-product-shell\"]",
  visualInstanceName: "AosOwnerQualityProductShell",
  ownerVisualAdmissionBoundary: "internal_ds_oracle_review_required_before_owner_visual_admission",
  disposition: "owner_quality_candidate_requires_ds_review_before_product_use",
  packageMapping: {
    shell: "ProductShell",
    controllerContract: "useProductShellController",
    search: "ProductShellSearch",
    brand: "ProductLogo through ShellBrandLockup/ProductShell",
    productLogoRegistry: "tcrnProductLogoRegistry",
    content: [
      "Surface",
      "WorkIndex",
      "TableShell",
      "KeyValueList",
      "StatusBadge",
      "EvidenceStrip",
      "EnvironmentBanner",
      "DisclosurePanel"
    ]
  },
  slots: [
    "registered AOS product logo lockup",
    "attached ProductShell side navigation",
    "compact topbar controls",
    "ProductShellSearch rest/results surface",
    "product-first operations cockpit",
    "work queue and gate evidence",
    "secondary developer detail disclosure"
  ],
  props: {
    productName: "AOS Rebuild Workspace",
    moduleName: "Operations Cockpit",
    brandProductId: "aos",
    productLogoAssetId: "tcrn-aos-two-line",
    navLabel: "AOS operations navigation",
    primaryIa: ["Operations Cockpit", "Work queue"],
    contentRole: "region"
  },
  variants: variants.map((variant) => variant.id),
  variantFixtures: variants.map((variant) => ({
    id: variant.id,
    selector: `[data-storybook-visual-instance="aos-owner-quality-product-shell"][data-visual-instance-variant="${variant.id}"]`,
    theme: variant.theme,
    locale: variant.locale,
    collapsed: variant.collapsed,
    route: variant.route,
    searchMode: variant.searchMode,
    viewport: variant.viewport,
    reducedMotion: variant.reducedMotion,
    contentMode: variant.contentMode
  })),
  supportedStates: [
    "desktop light Operations Cockpit",
    "desktop light Operations Cockpit collapsed",
    "desktop dark Operations Cockpit",
    "desktop dark Operations Cockpit collapsed",
    "desktop Work queue",
    "desktop Work queue collapsed",
    "mobile zh-CN Work queue",
    "search rest visual state",
    "search results visual state",
    "reduced-motion shell/search fallback",
    "desktop owner-quality side navigation collapse and expand visual states",
    "mobile owner-quality side navigation collapse affordance hidden by DS policy"
  ],
  ownerQualityAcceptanceCriteria: [
    "first viewport reads as AOS Operations Cockpit or AOS Rebuild Workspace",
    "exactly one primary H1 per rendered fixture",
    "product content leads with current work, gates, evidence, decisions, owner actions, service health, and activity",
    "zh-CN owner-quality fixtures localize critical first-viewport table headers and state labels",
    "ProductShell topbar controls stay within the fixture root and viewport without horizontal clipping",
    "read-only and no-live-dispatch boundaries are visible but low-prominence",
    "developer proof/API/readback details are secondary disclosure",
    "Cockpit and Work are meaningful product modules rather than placeholder labels"
  ],
  rejectCriteria: [
    "first viewport headline is AOS frontend shell, Frontend shell slice, Local structural slice only, or Dummy Cockpit",
    "implementation/proof/debug terminology dominates the first viewport",
    "no-overclaim copy becomes the primary product story",
    "Runtime/Stories/Gates/Audit events verification metrics lead the hierarchy",
    "ProductShell topbar, search, locale, or theme controls are cropped or create root/topbar horizontal overflow",
    "visible local product CSS/effects or Storybook-only prototype classes appear",
    "owner/product/release/live-dispatch/final-Cockpit readiness is claimed"
  ],
  delegatedSubOracles: [
    "ProductShell owns responsive posture, theme, locale, focus, reduced-motion behavior, and actionable desktop side-nav collapse/expand behavior for this owner-quality oracle.",
    "Mobile owner-quality side navigation uses a DS-approved hidden collapse affordance policy; mobile collapsed owner-quality variants remain out of scope until a later DS decision admits them.",
    "ProductShellSearch owns search rest/results/dismissal behavior.",
    "This owner-quality oracle defines first-viewport hierarchy and copy semantics; product adoption remains separate."
  ],
  negativeCriteria: [
    "no proof-scaffold headline as Level 1 content",
    "no Dummy Cockpit or structural-placeholder first viewport",
    "no primary raw API/debug/readback payload",
    "no deprecated AOS wordmark assets",
    "no unregistered primary IA",
    "no owner/product/release/live-dispatch readiness claim"
  ]
} as const;

function labels(locale: OwnerQualityVariant["locale"]) {
  if (locale === "zh-CN") {
    return {
      productName: "AOS 重建工作区",
      moduleName: "运营驾驶舱",
      navLabel: "AOS 运营导航",
      cockpit: "运营驾驶舱",
      work: "工作队列",
      currentLocation: "当前位置",
      searchLabel: "搜索 AOS 运营",
      searchPlaceholder: "搜索工作、门禁、证据或 owner 动作",
      searchResultsLabel: "AOS 运营搜索结果",
      emptyLabel: "没有匹配的运营记录",
      skipLink: "跳转到运营内容",
      contentLabel: "AOS 运营工作区",
      primaryTitle: "AOS 运营驾驶舱",
      primaryDescription: "查看当前重建工作、门禁、证据、决策和 owner 动作，不执行实时派发。",
      workTitle: "工作队列",
      gateTitle: "门禁与证据",
      actionTitle: "Owner 动作",
      healthTitle: "服务健康",
      activityTitle: "活动",
      disclosureTitle: "开发者细节",
      boundary: "只读预览",
      noDispatch: "无实时派发"
    };
  }
  return {
    productName: "AOS Rebuild Workspace",
    moduleName: "Operations Cockpit",
    navLabel: "AOS operations navigation",
    cockpit: "Operations Cockpit",
    work: "Work queue",
    currentLocation: "Current location",
    searchLabel: "Search AOS operations",
    searchPlaceholder: "Search operations",
    searchResultsLabel: "AOS operations search results",
    emptyLabel: "No matching operations records",
    skipLink: "Skip to operations content",
    contentLabel: "AOS operations workspace",
    primaryTitle: "AOS Operations Cockpit",
    primaryDescription: "Track current rebuild work, gates, evidence, decisions, and owner actions without live dispatch.",
    workTitle: "Work queue",
    gateTitle: "Gates and evidence",
    actionTitle: "Owner actions",
    healthTitle: "Service health",
    activityTitle: "Activity",
    disclosureTitle: "Developer details",
    boundary: "Read-only preview",
    noDispatch: "No live dispatch"
  };
}

function navGroups(variant: OwnerQualityVariant): ProductShellNavGroup[] {
  const copy = labels(variant.locale);
  return [
    {
      id: `${variant.id}-primary`,
      label: variant.locale === "zh-CN" ? "运营模块" : "Operations modules",
      selected: true,
      items: [
        {
          id: "cockpit",
          label: copy.cockpit,
          href: "/cockpit",
          iconName: "home",
          selected: variant.route === "cockpit"
        },
        {
          id: "work",
          label: copy.work,
          href: "/work",
          iconName: "database",
          selected: variant.route === "work"
        }
      ]
    }
  ];
}

function searchResults(variant: OwnerQualityVariant): ProductShellSearchResult[] {
  const copy = labels(variant.locale);
  return [
    {
      id: "gate-owner-review",
      title: variant.locale === "zh-CN" ? "Owner 审查门禁" : "Owner review gate",
      meta: variant.locale === "zh-CN" ? "需要证据包" : "Evidence packet required",
      href: "/cockpit",
      selected: variant.route === "cockpit"
    },
    {
      id: "work-queue",
      title: copy.work,
      meta: variant.locale === "zh-CN" ? "6 个开放工作项" : "6 open work items",
      href: "/work",
      selected: variant.route === "work"
    },
    {
      id: "service-health",
      title: copy.healthTitle,
      meta: variant.locale === "zh-CN" ? "本地只读服务在线" : "Read-only service online",
      href: "/cockpit"
    }
  ];
}

function queueRows(locale: OwnerQualityVariant["locale"]): WorkIndexRow[] {
  const isZh = locale === "zh-CN";
  return [
    {
      id: "owner-quality-oracle",
      title: isZh ? "定义 owner 质量视觉基准" : "Define owner-quality visual baseline",
      state: { state: "review_required" },
      owner: "Elara"
    },
    {
      id: "aos-remediation",
      title: isZh ? "将 AOS 首页映射到新基准" : "Map AOS first viewport to new baseline",
      state: { state: "blocked" },
      owner: "Ilya"
    },
    {
      id: "qa-evidence",
      title: isZh ? "专业 QA 证据包" : "Professional QA evidence packet",
      state: { state: "not_configured" },
      owner: "Rowan"
    }
  ];
}

function gateRows(locale: OwnerQualityVariant["locale"]) {
  const isZh = locale === "zh-CN";
  return [
    {
      gate: isZh ? "DS 视觉基准" : "DS visual baseline",
      evidence: isZh ? "Storybook owner 质量实例" : "Storybook owner-quality instance",
      decision: isZh ? "等待 review" : "Awaiting review",
      owner: "Elara",
      state: <StatusBadge state={{ state: "review_required" }} locale={locale} />
    },
    {
      gate: isZh ? "运行时新鲜度" : "Runtime freshness",
      evidence: isZh ? "4317 同端口刷新" : "4317 same-port refresh",
      decision: isZh ? "实现后路由" : "Route after implementation",
      owner: "Atlas",
      state: <StatusBadge state={{ state: "blocked" }} locale={locale} />
    },
    {
      gate: isZh ? "Owner 检查" : "Owner inspection",
      evidence: isZh ? "QA 与 PM 通过后" : "After QA and PM pass",
      decision: isZh ? "未准备" : "Not ready",
      owner: "Mara",
      state: <StatusBadge state={{ state: "not_claimed" }} locale={locale} />
    }
  ];
}

function actionRows(locale: OwnerQualityVariant["locale"]) {
  const isZh = locale === "zh-CN";
  return [
    {
      action: isZh ? "批准 owner 可见预览" : "Approve owner-visible preview",
      reason: isZh ? "等待 DS review、QA 与 PM" : "Waiting on DS review, QA, and PM",
      state: <Badge tone="warning">{isZh ? "已禁用" : "Disabled"}</Badge>
    },
    {
      action: isZh ? "打开实时派发" : "Enable live dispatch",
      reason: isZh ? "不在此切片范围" : "Out of scope for this slice",
      state: <Badge tone="neutral">{isZh ? "不可用" : "Unavailable"}</Badge>
    }
  ];
}

function serviceItems(locale: OwnerQualityVariant["locale"]) {
  const isZh = locale === "zh-CN";
  return [
    { key: "api", label: isZh ? "API" : "API", value: isZh ? "本地只读摘要" : "Read-only local summary" },
    { key: "queue", label: isZh ? "外部队列" : "External queue", value: isZh ? "无" : "None" },
    { key: "dispatch", label: isZh ? "实时派发" : "Live dispatch", value: isZh ? "未启用" : "Not enabled" },
    { key: "nextGate", label: isZh ? "下一门禁" : "Next gate", value: isZh ? "Elara DS 评审" : "Elara DS review" }
  ];
}

function OperationsContent({ variant }: { variant: OwnerQualityVariant }) {
  const copy = labels(variant.locale);
  const isWorkFirst = variant.contentMode === "work";
  return (
    <div className="tcrn-product-shell-content-stack" data-package-owned-spacing-rhythm="product-shell-content-stack">
      <Surface
        data-owner-quality-primary-heading="true"
        data-owner-quality-first-viewport="product-led"
      >
        <Heading level={1} visualLevel={2}>{isWorkFirst ? copy.workTitle : copy.primaryTitle}</Heading>
        <Text>
          {isWorkFirst
            ? (variant.locale === "zh-CN" ? "按 owner、门禁和下一步查看当前工作。" : "Scan current work by owner, gate, and next action.")
            : copy.primaryDescription}
        </Text>
        <EvidenceStrip items={[copy.boundary, copy.noDispatch]} />
      </Surface>
      <div className="tcrn-product-shell-section-grid" data-package-owned-section-rhythm="work-gates">
        <Surface data-owner-quality-work-queue="true" aria-label={`${copy.workTitle}: ${variant.id}`}>
          <Heading level={2}>{copy.workTitle}</Heading>
          <WorkIndex rows={queueRows(variant.locale)} label={copy.workTitle} locale={variant.locale} />
        </Surface>
        <Surface data-owner-quality-gates="true" aria-label={`${copy.gateTitle}: ${variant.id}`}>
          <Heading level={2}>{copy.gateTitle}</Heading>
          <TableShell
            label={copy.gateTitle}
            columns={[
              { key: "gate", label: variant.locale === "zh-CN" ? "门禁" : "Gate" },
              { key: "evidence", label: variant.locale === "zh-CN" ? "证据" : "Evidence" },
              { key: "decision", label: variant.locale === "zh-CN" ? "决策" : "Decision" },
              { key: "owner", label: "Owner" },
              { key: "state", label: variant.locale === "zh-CN" ? "状态" : "State" }
            ]}
            rows={gateRows(variant.locale)}
          />
        </Surface>
      </div>
      <Surface data-owner-quality-actions="true" aria-label={`${copy.actionTitle}: ${variant.id}`}>
        <Heading level={2}>{copy.actionTitle}</Heading>
        <TableShell
          label={copy.actionTitle}
          columns={[
            { key: "action", label: variant.locale === "zh-CN" ? "动作" : "Action" },
            { key: "reason", label: variant.locale === "zh-CN" ? "原因" : "Reason" },
            { key: "state", label: variant.locale === "zh-CN" ? "状态" : "State" }
          ]}
          rows={actionRows(variant.locale)}
        />
      </Surface>
      <Surface data-owner-quality-service-health="true" aria-label={`${copy.healthTitle}: ${variant.id}`}>
        <Heading level={2}>{copy.healthTitle}</Heading>
        <KeyValueList items={serviceItems(variant.locale)} />
      </Surface>
      <Surface data-owner-quality-activity="true" aria-label={`${copy.activityTitle}: ${variant.id}`}>
        <Heading level={2}>{copy.activityTitle}</Heading>
        <Text>{variant.locale === "zh-CN"
          ? "最近活动聚焦于 DS 基准、AOS 实现、QA 证据和 PM readiness。"
          : "Recent activity focuses on the DS baseline, AOS implementation, QA evidence, and PM readiness."}</Text>
      </Surface>
      <EnvironmentBanner label={copy.boundary} state={{ state: "local_only" }} locale={variant.locale} />
      <DisclosurePanel expanded={false} title={copy.disclosureTitle} data-owner-quality-secondary-disclosure="true">
        <Text>{variant.locale === "zh-CN"
          ? "技术收据、API 摘要和调试载荷必须留在二级披露中，不能成为 owner 首屏故事。"
          : "Technical receipts, API summaries, and debug payloads stay in secondary disclosure and must not become the owner first-viewport story."}</Text>
      </DisclosurePanel>
    </div>
  );
}

function OwnerQualityVariantFixture({ variant }: { variant: OwnerQualityVariant }) {
  const copy = labels(variant.locale);
  const searchExpanded = variant.searchMode === "results";
  const query = searchExpanded ? (variant.locale === "zh-CN" ? "门禁" : "gate") : "";
  const currentRouteLabel = variant.route === "work" ? copy.work : copy.cockpit;
  return (
    <ProductShell
      productName={copy.productName}
      moduleName={copy.moduleName}
      brandProductId="aos"
      brandMarkSrc="tcrn-brand-mark.svg"
      brandMarkAlt="TCRN registered brand mark"
      currentRouteLabel={currentRouteLabel}
      currentLocationLabel={copy.currentLocation}
      navLabel={`${copy.navLabel}: ${variant.id}`}
      navGroups={navGroups(variant)}
      collapsed={variant.collapsed}
      collapsedStorageKey={`tcrn-aos-owner-quality-collapsed-${variant.id}`}
      currentTheme={variant.theme}
      locales={tcrnLocaleMetadata}
      currentLocale={variant.locale}
      contentId={`${variant.id}-owner-quality-content`}
      contentRole="region"
      contentLabel={`${copy.contentLabel}: ${variant.id}`}
      navId={`${variant.id}-owner-quality-side-nav`}
      skipLinkLabel={copy.skipLink}
      search={{
        label: copy.searchLabel,
        placeholder: copy.searchPlaceholder,
        shortcut: "auto",
        query,
        expanded: searchExpanded,
        results: searchResults(variant),
        resultsLabel: copy.searchResultsLabel,
        emptyLabel: copy.emptyLabel
      }}
      data-storybook-visual-instance="aos-owner-quality-product-shell"
      data-visual-instance-name="AosOwnerQualityProductShell"
      data-visual-instance-disposition="ds_oracle_review_required_before_owner_admission"
      data-visual-instance-style-source="@tcrn/ui-react/tcrnComponentCss"
      data-visual-instance-owner-quality="product-first"
      data-visual-instance-slots="brand side-nav topbar search operations-cockpit work-queue gates-evidence owner-actions service-health secondary-disclosure"
      data-visual-instance-primary-ia="operations-cockpit-work-queue"
      data-visual-instance-negative-criteria="no-proof-scaffold-hero no-dummy-cockpit no-raw-primary no-owner-readiness"
      data-visual-instance-product-logo="tcrn-aos-two-line"
      data-visual-instance-mobile-collapse-policy="hidden-affordance"
      data-visual-instance-variant={variant.id}
      data-visual-instance-theme={variant.theme}
      data-tcrn-theme={variant.theme}
      data-visual-instance-locale={variant.locale}
      data-visual-instance-collapsed={variant.collapsed ? "true" : "false"}
      data-visual-instance-route={variant.route}
      data-visual-instance-search={variant.searchMode}
      data-visual-instance-viewport={variant.viewport}
      data-visual-instance-reduced-motion={variant.reducedMotion ? "true" : "false"}
      data-visual-instance-content={variant.contentMode}
      data-product-acceptance="not-claimed"
      data-release-readiness="not-claimed"
      data-live-dispatch="not-enabled"
      data-owner-quality-product-shell-oracle="true"
    >
      <OperationsContent variant={variant} />
    </ProductShell>
  );
}

export function AosOwnerQualityProductShell() {
  return (
    <div data-visual-instance-fixture-matrix="aos-owner-quality-product-shell">
      {variants.map((variant) => (
        <section key={variant.id} data-visual-instance-fixture={variant.id} aria-labelledby={`${variant.id}-owner-quality-heading`}>
          <OwnerQualityVariantFixture variant={variant} />
          <Surface>
            <Heading level={3} id={`${variant.id}-owner-quality-heading`}>{variant.label}</Heading>
            <KeyValueList
              items={[
                { key: "theme", label: "Theme", value: variant.theme },
                { key: "locale", label: "Locale", value: variant.locale },
                { key: "collapsed", label: "Collapsed", value: variant.collapsed ? "true" : "false" },
                { key: "route", label: "Route", value: variant.route },
                { key: "search", label: "Search", value: variant.searchMode },
                { key: "viewport", label: "Viewport proof", value: variant.viewport },
                { key: "reducedMotion", label: "Reduced motion", value: variant.reducedMotion ? "true" : "false" }
              ]}
            />
          </Surface>
        </section>
      ))}
    </div>
  );
}
