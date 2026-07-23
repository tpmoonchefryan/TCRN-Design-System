import {
  Badge,
  DisclosurePanel,
  EnvironmentBanner,
  EvidenceStrip,
  Heading,
  InlineAlert,
  KeyValueList,
  ProductShell,
  ReadbackPanel,
  StatusBadge,
  TableShell,
  Text,
  type ProductShellNavGroup,
  type ProductShellSearchResult
} from "@tcrn/ui-react";
import { tcrnLocaleMetadata } from "@tcrn/ui-copy-state";

type AosVisualInstanceRoute = "cockpit" | "work";
type AosVisualInstanceSearchMode = "results" | "rest";

type AosVisualInstanceVariant = {
  id: string;
  label: string;
  theme: "light" | "dark";
  locale: "en" | "zh-CN";
  collapsed: boolean;
  route: AosVisualInstanceRoute;
  searchMode: AosVisualInstanceSearchMode;
  viewport: "desktop" | "mobile";
  reducedMotion: boolean;
  contentMode: "cockpit" | "work";
};

const aosDefaultLocale = "en" as const;

const variants: readonly AosVisualInstanceVariant[] = [
  {
    id: "desktop-light-expanded-cockpit-search-results",
    label: "Desktop light, expanded Cockpit with search results",
    theme: "light",
    locale: aosDefaultLocale,
    collapsed: false,
    route: "cockpit",
    searchMode: "results",
    viewport: "desktop",
    reducedMotion: false,
    contentMode: "cockpit"
  },
  {
    id: "desktop-light-expanded-cockpit-search-rest",
    label: "Desktop light, expanded Cockpit at search rest",
    theme: "light",
    locale: aosDefaultLocale,
    collapsed: false,
    route: "cockpit",
    searchMode: "rest",
    viewport: "desktop",
    reducedMotion: false,
    contentMode: "cockpit"
  },
  {
    id: "desktop-dark-expanded-cockpit",
    label: "Desktop dark, expanded Cockpit at search rest",
    theme: "dark",
    locale: aosDefaultLocale,
    collapsed: false,
    route: "cockpit",
    searchMode: "rest",
    viewport: "desktop",
    reducedMotion: false,
    contentMode: "cockpit"
  },
  {
    id: "desktop-light-collapsed-work",
    label: "Desktop light, collapsed Work route",
    theme: "light",
    locale: aosDefaultLocale,
    collapsed: true,
    route: "work",
    searchMode: "rest",
    viewport: "desktop",
    reducedMotion: false,
    contentMode: "work"
  },
  {
    id: "mobile-dark-work-stacked",
    label: "Mobile dark, zh-CN Work route",
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
    id: "reduced-motion",
    label: "Reduced-motion fallback, Cockpit rest state",
    theme: "light",
    locale: aosDefaultLocale,
    collapsed: false,
    route: "cockpit",
    searchMode: "rest",
    viewport: "desktop",
    reducedMotion: true,
    contentMode: "cockpit"
  }
] as const;

const persistedCockpitRestPolicy = {
  defaultCockpitRestVariant: "desktop-light-expanded-cockpit-search-rest",
  ownerReviewRoutesMustBeDeterministic: true,
  coveredOwnerReachableRoutes: [
    "/",
    "/cockpit",
    "/cockpit?locale=en&theme=light",
    "post-search-dismissal:/cockpit?locale=en&theme=light&collapsed=false&search=shell"
  ],
  routePersistenceBoundary:
    "Owner-review routes must not inherit localStorage into unadmitted visual states; product persistence may remain DS-defined outside reviewed parity routes.",
  notAutomaticallyAdmitted: [
    "zh-CN Cockpit rest",
    "collapsed Cockpit rest",
    "dark zh-CN Cockpit rest",
    "mobile Cockpit rest"
  ],
  outsideMatrixMarkerForbiddenForOwnerReview: "aos-route-state-outside-accepted-oracle-matrix"
} as const;

export const aosFrontendShellSliceVisualInstanceReadback = {
  storyId: "aos-frontend-shell-slice",
  page: "components.html#aos-frontend-shell-slice",
  selector: "[data-storybook-visual-instance=\"aos-frontend-shell-slice\"]",
  visualInstanceName: "AosFrontendShellSliceVisualInstance",
  ownerVisualAdmissionBoundary: "internal_ds_oracle_review_required_before_owner_visual_admission",
  packageMapping: {
    shell: "ProductShell",
    controllerContract: "useProductShellController",
    search: "ProductShellSearch",
    brand: "ProductLogo through ShellBrandLockup/ProductShell",
    productLogoRegistry: "tcrnProductLogoRegistry",
    content: [
      "EnvironmentBanner",
      "InlineAlert",
      "ReadbackPanel",
      "KeyValueList",
      "EvidenceStrip",
      "TableShell",
      "StatusBadge",
      "DisclosurePanel"
    ]
  },
  slots: [
    "brand lockup",
    "attached side navigation",
    "topbar current-location and utility controls",
    "search rest/focus/results surface",
    "primary shell content",
    "secondary raw technical disclosure"
  ],
  props: {
    productName: "AOS Rebuild Workspace",
    moduleName: "Frontend shell slice",
    brandProductId: "aos",
    productLogoAssetId: "tcrn-aos-two-line",
    navLabel: "AOS visual instance modules",
    primaryIa: ["Cockpit", "Work"],
    contentRole: "region"
  },
  variants: variants.map((variant) => variant.id),
  variantFixtures: variants.map((variant) => ({
    id: variant.id,
    selector: `[data-storybook-visual-instance="aos-frontend-shell-slice"][data-visual-instance-variant="${variant.id}"]`,
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
    "light visual state",
    "dark visual state",
    "zh-CN selected locale visual state",
    "desktop viewport",
    "mobile viewport",
    "expanded side navigation visual state",
    "collapsed side navigation visual state",
    "Cockpit selected route",
    "Work selected route",
    "search rest/dismissed visual state",
    "search results visual state",
    "theme wash or reduced-motion fallback visual state"
  ],
  delegatedInteractionProofs: [
    "Locale menu open/close/focus-return interaction remains delegated to ShellLocaleMenu/ProductShell sub-oracles.",
    "Search blur/outside-pointer/tab/Escape dismissal remains delegated to ProductShellSearch and field/search sub-oracles.",
    "This visual instance proves rendered state fixtures and must not be used as final owner admission."
  ],
  persistedCockpitRestPolicy,
  negativeCriteria: [
    "no Storybook-only prototype classes",
    "no product-local visible CSS system",
    "no deprecated AOS wordmark assets",
    "no unregistered primary IA",
    "no raw API/debug payload as primary UX",
    "no owner/product/release/live-dispatch readiness claim"
  ]
} as const;

function routeLabels(locale: "en" | "zh-CN") {
  if (locale === "zh-CN") {
    return {
      productName: "AOS 重建工作区",
      moduleName: "前端壳切片",
      navLabel: "AOS 视觉实例模块",
      cockpit: "驾驶舱",
      work: "工作",
      currentLocation: "当前位置",
      searchLabel: "搜索 AOS 壳",
      searchPlaceholder: "搜索模块、工作项或证据",
      searchResultsLabel: "AOS 壳搜索结果",
      emptyLabel: "没有本地样例结果",
      skipLink: "跳转到壳内容",
      contentLabel: "AOS 壳内容"
    };
  }
  return {
    productName: "AOS Rebuild Workspace",
    moduleName: "Frontend shell slice",
    navLabel: "AOS visual instance modules",
    cockpit: "Cockpit",
    work: "Work",
    currentLocation: "Current location",
    searchLabel: "Search AOS shell",
    searchPlaceholder: "Search modules, work items, or proof",
    searchResultsLabel: "AOS shell search results",
    emptyLabel: "No local fixture results",
    skipLink: "Skip to shell content",
    contentLabel: "AOS shell content"
  };
}

function buildNavGroups(variant: AosVisualInstanceVariant): ProductShellNavGroup[] {
  const labels = routeLabels(variant.locale);
  return [
    {
      id: `${variant.id}-primary-ia`,
      label: variant.locale === "zh-CN" ? "已注册壳入口" : "Registered shell entries",
      selected: true,
      items: [
        {
          id: "cockpit",
          label: labels.cockpit,
          href: "/cockpit",
          iconName: "home",
          selected: variant.route === "cockpit"
        },
        {
          id: "work",
          label: labels.work,
          href: "/work",
          iconName: "database",
          selected: variant.route === "work"
        }
      ]
    }
  ];
}

function buildSearchResults(variant: AosVisualInstanceVariant): ProductShellSearchResult[] {
  const labels = routeLabels(variant.locale);
  return [
    {
      id: "cockpit",
      title: labels.cockpit,
      meta: variant.locale === "zh-CN" ? "已注册壳入口" : "Registered shell entry",
      href: "/cockpit",
      selected: variant.route === "cockpit"
    },
    {
      id: "work",
      title: labels.work,
      meta: variant.locale === "zh-CN" ? "工作模块入口" : "Work module entry",
      href: "/work",
      selected: variant.route === "work"
    },
    {
      id: "work-gate",
      title: variant.locale === "zh-CN" ? "门禁证据" : "Gate evidence",
      meta: variant.locale === "zh-CN" ? "样例安全工作行" : "Fixture-safe Work row",
      href: "/work"
    }
  ];
}

function workRows(locale: "en" | "zh-CN") {
  const isZh = locale === "zh-CN";
  return [
    {
      project: "AOS",
      initiative: isZh ? "前端壳恢复" : "Frontend shell recovery",
      story: isZh ? "已注册壳切片" : "Registered shell slice",
      gate: isZh ? "DS 视觉实例" : "DS visual instance",
      evidence: isZh ? "Storybook 奇偶性证明" : "Storybook parity proof",
      assignment: "Engineering",
      state: <StatusBadge state={{ state: "proof_required" }} />
    },
    {
      project: "AOS",
      initiative: isZh ? "驾驶舱" : "Cockpit",
      story: isZh ? "仅 Dummy Cockpit" : "Dummy Cockpit only",
      gate: isZh ? "聚合延后" : "Deferred aggregation",
      evidence: isZh ? "无实时派发" : "No live dispatch",
      assignment: isZh ? "产品路线" : "Product route",
      state: <StatusBadge state={{ state: "not_claimed" }} />
    }
  ];
}

function CockpitContent({ variant }: { variant: AosVisualInstanceVariant }) {
  const isZh = variant.locale === "zh-CN";
  return (
    <>
      <EnvironmentBanner label={isZh ? "AOS 前端壳切片" : "AOS frontend shell slice"} state={{ state: "local_only" }} />
      <InlineAlert tone="warning">
        <strong>{isZh ? "仅本地结构切片" : "Local structural slice only"}</strong>
        <span>
          {isZh
            ? "不声明实时派发、外部队列、产品验收或发布就绪。"
            : "No live dispatch, external queue, product acceptance, or release readiness is claimed."}
        </span>
      </InlineAlert>
      <ReadbackPanel title={isZh ? "AOS 前端壳首屏" : "AOS frontend shell first viewport"}>
        <Heading level={4} id={`${variant.id}-shell-slice-heading`}>{isZh ? "AOS 前端壳" : "AOS frontend shell"}</Heading>
        <Text>
          {isZh
            ? "此视觉实例定义第一个 AOS 壳切片的包支持 Storybook 基准：DS ProductShell 导航、紧凑壳控件、本地只读姿态、Dummy Cockpit 和 Work 入口。"
            : "This visual instance is the package-backed Storybook oracle for the first AOS shell slice: DS ProductShell navigation, compact shell controls, local-only readback posture, dummy Cockpit, and the Work entry."}
        </Text>
        <KeyValueList
          items={[
            { key: "runtime", label: isZh ? "运行时" : "Runtime", value: isZh ? "本地样例" : "local fixture" },
            { key: "stories", label: isZh ? "故事" : "Stories", value: isZh ? "有限读回" : "finite readback" },
            { key: "gates", label: isZh ? "门禁" : "Gates", value: isZh ? "需要证明" : "proof required" },
            { key: "auditEvents", label: isZh ? "审计事件" : "Audit events", value: isZh ? "仅合成" : "synthetic only" }
          ]}
        />
        <EvidenceStrip items={isZh ? ["已注册 DS 表面", "ProductShell 边界", "仅 Cockpit + Work"] : ["registered DS surfaces", "ProductShell boundary", "Cockpit + Work only"]} />
      </ReadbackPanel>
      <section
        id={`${variant.id}-cockpit`}
        data-aos-dummy-cockpit="true"
        aria-label={`${variant.label}: ${isZh ? "Dummy Cockpit" : "Dummy Cockpit"}`}
      >
        <ReadbackPanel title={isZh ? "Dummy Cockpit" : "Dummy Cockpit"}>
          <Heading level={4} id={`${variant.id}-cockpit-heading`}>{isZh ? "Dummy Cockpit" : "Dummy Cockpit"}</Heading>
          <Badge tone="warning">{isZh ? "结构占位" : "structural placeholder"}</Badge>
          <KeyValueList
            items={[
              { key: "queue", label: isZh ? "外部队列" : "External queue", value: isZh ? "无" : "none" },
              { key: "dispatch", label: isZh ? "实时派发" : "Live dispatch", value: isZh ? "未启用" : "not enabled" },
              { key: "acceptance", label: isZh ? "产品验收" : "Product acceptance", value: isZh ? "未声明" : "not claimed" },
              { key: "release", label: isZh ? "发布就绪" : "Release readiness", value: isZh ? "未声明" : "not claimed" }
            ]}
          />
          <EvidenceStrip items={isZh ? ["本地样例", "仅 Dummy Cockpit", "无实时派发"] : ["local fixture", "dummy Cockpit only", "no live dispatch"]} />
        </ReadbackPanel>
      </section>
    </>
  );
}

function WorkContent({ variant }: { variant: AosVisualInstanceVariant }) {
  const isZh = variant.locale === "zh-CN";
  return (
    <section
      id={`${variant.id}-work`}
      data-aos-work-module-entry="work-module"
      aria-label={`${variant.label}: ${isZh ? "工作模块入口" : "Work module entry"}`}
    >
      <ReadbackPanel title={isZh ? "工作模块入口" : "Work module entry"}>
        <Heading level={4} id={`${variant.id}-work-heading`}>{isZh ? "工作模块入口" : "Work module entry"}</Heading>
        <Badge tone="neutral">{isZh ? "样例安全行" : "fixture-safe rows"}</Badge>
        <TableShell
          label={isZh ? "AOS 工作模块入口视觉实例" : "AOS work module entry visual instance"}
          columns={[
            { key: "project", label: isZh ? "项目" : "Project" },
            { key: "initiative", label: isZh ? "事项" : "Initiative" },
            { key: "story", label: isZh ? "故事" : "Story" },
            { key: "gate", label: isZh ? "门禁" : "Gate" },
            { key: "evidence", label: isZh ? "证据" : "Evidence" },
            { key: "assignment", label: isZh ? "分配" : "Assignment" },
            { key: "state", label: isZh ? "状态" : "State" }
          ]}
          rows={workRows(variant.locale)}
        />
      </ReadbackPanel>
      <ReadbackPanel title={isZh ? "后端读回" : "Backend readback"}>
        <Text data-api-state>
          {isZh
            ? "API 读回使用样例安全服务摘要，不是一级原始 JSON 或调试界面。"
            : "API readbacks use fixture-safe service summaries, not a primary raw JSON/debug surface."}
        </Text>
        <KeyValueList
          items={[
            { key: "runtime", label: isZh ? "运行时" : "Runtime", value: isZh ? "本地样例" : "local fixture" },
            { key: "queue", label: isZh ? "外部队列" : "External queue", value: isZh ? "无" : "none" },
            { key: "policy", label: isZh ? "策略" : "Policy", value: isZh ? "仅服务证明" : "service proof only" },
            { key: "readback", label: isZh ? "读回计数" : "Readback counts", value: isZh ? "有限本地计数" : "finite local counts" }
          ]}
        />
        <EvidenceStrip items={["/api/health", "/api/readback", "/api/policy"]} />
        <DisclosurePanel expanded={false} title={isZh ? "技术 API 载荷" : "Technical API payload"} data-raw-json-disclosure="secondary">
          <pre hidden data-api-summary>{JSON.stringify({ ok: true, source: "fixture-safe-readback" }, null, 2)}</pre>
        </DisclosurePanel>
      </ReadbackPanel>
    </section>
  );
}

function BoundaryContent({ variant }: { variant: AosVisualInstanceVariant }) {
  const isZh = variant.locale === "zh-CN";
  return (
    <section
      aria-label={`${variant.label}: ${isZh ? "已注册切片边界" : "Registered slice boundary"}`}
      data-aos-registered-module-boundary="cockpit-work-only"
    >
      <ReadbackPanel title={isZh ? "已注册切片边界" : "Registered slice boundary"}>
        <Heading level={4} id={`${variant.id}-boundary-heading`}>{isZh ? "已注册切片边界" : "Registered slice boundary"}</Heading>
        <Badge tone="neutral">{isZh ? "仅 Cockpit + Work" : "Cockpit + Work only"}</Badge>
        <KeyValueList
          items={[
            { key: "visible-nav", label: isZh ? "可见主导航" : "Visible primary navigation", value: isZh ? "Cockpit 和 Work" : "Cockpit and Work" },
            { key: "future-modules", label: isZh ? "未来模块" : "Future modules", value: isZh ? "需要单独 owner route" : "require separate owner route" },
            { key: "raw-payload", label: isZh ? "原始技术载荷" : "Raw technical payload", value: isZh ? "仅二级披露" : "secondary disclosure only" },
            { key: "acceptance", label: isZh ? "验收" : "Acceptance", value: isZh ? "未声明" : "not claimed" }
          ]}
        />
      </ReadbackPanel>
    </section>
  );
}

function AosFrontendShellVariantFixture({ variant }: { variant: AosVisualInstanceVariant }) {
  const labels = routeLabels(variant.locale);
  const isSearchResults = variant.searchMode === "results";
  const query = variant.searchMode === "results" ? (variant.route === "work" ? labels.work : labels.cockpit) : "";
  const currentRouteLabel = variant.route === "work" ? labels.work : labels.cockpit;
  return (
    <ProductShell
      productName={labels.productName}
      moduleName={labels.moduleName}
      brandProductId="aos"
      brandMarkSrc="tcrn-brand-mark.svg"
      brandMarkAlt="TCRN registered brand mark"
      currentRouteLabel={currentRouteLabel}
      navLabel={`${labels.navLabel}: ${variant.id}`}
      navGroups={buildNavGroups(variant)}
      collapsed={variant.collapsed}
      collapsedStorageKey={`tcrn-aos-side-nav-collapsed-${variant.id}`}
      currentTheme={variant.theme}
      locales={tcrnLocaleMetadata}
      currentLocale={variant.locale}
      contentId={`${variant.id}-content`}
      contentRole="region"
      contentLabel={`${labels.contentLabel}: ${variant.id}`}
      navId={`${variant.id}-side-nav`}
      skipLinkLabel={labels.skipLink}
      search={{
        label: labels.searchLabel,
        placeholder: labels.searchPlaceholder,
        shortcut: "auto",
        query,
        expanded: isSearchResults,
        results: buildSearchResults(variant),
        resultsLabel: labels.searchResultsLabel,
        emptyLabel: labels.emptyLabel
      }}
      data-storybook-visual-instance="aos-frontend-shell-slice"
      data-visual-instance-name="AosFrontendShellSliceVisualInstance"
      data-visual-instance-disposition="ds_oracle_review_required_before_owner_admission"
      data-visual-instance-style-source="@tcrn/ui-react/tcrnComponentCss"
      data-visual-instance-slots="brand side-nav topbar search content secondary-disclosure"
      data-visual-instance-primary-ia="cockpit-work-only"
      data-visual-instance-negative-criteria="no-local-visible-css no-storybook-only-prototype no-raw-primary no-owner-readiness"
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
      data-aos-visual-instance-oracle="true"
    >
      {variant.contentMode === "cockpit" ? <CockpitContent variant={variant} /> : <WorkContent variant={variant} />}
      {variant.contentMode === "cockpit" ? <WorkContent variant={variant} /> : <CockpitContent variant={variant} />}
      <BoundaryContent variant={variant} />
    </ProductShell>
  );
}

export function AosFrontendShellSliceVisualInstance() {
  return (
    <div data-visual-instance-fixture-matrix="aos-frontend-shell-slice">
      {variants.map((variant) => (
        <section key={variant.id} data-visual-instance-fixture={variant.id} aria-labelledby={`${variant.id}-fixture-heading`}>
          <ReadbackPanel title={variant.label}>
            <Heading level={4} id={`${variant.id}-fixture-heading`}>{variant.label}</Heading>
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
          </ReadbackPanel>
          <AosFrontendShellVariantFixture variant={variant} />
        </section>
      ))}
    </div>
  );
}
