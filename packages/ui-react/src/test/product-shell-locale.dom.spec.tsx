import test from "node:test";
import assert from "node:assert/strict";
import { act, useState, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ProductShell,
  ProductShellSearch,
  productShellCopyFor,
  ShellLocaleMenu,
  ShellThemeToggle,
  readPreferenceCookieValues,
  useProductShellController,
  type ProductShellProps
} from "../approved.js";
import type { TcrnLocale } from "@tcrn/ui-copy-state";
import { createDomInteractionHarness, type DomInteractionHarness } from "./dom-harness.js";
import {
  TalentShellLocaleFixture,
  productLocaleDefinitions,
  productLocaleOptions,
  talentGroupsFor,
  type BusinessLocale
} from "./product-shell-locale-fixture.js";

function LegacyShell({ locale = "en", children }: { locale?: TcrnLocale; children: ReactNode }) {
  const controller = useProductShellController({ initialLocale: locale });
  const legacyLocale: TcrnLocale = controller.locale;
  return (
    <ProductShell
      {...controller.productShellControlProps}
      data-fixture="legacy"
      productName="Documentation"
      moduleName="Documentation"
      brandProductId="design-system"
      currentRouteLabel="Examples"
      currentLocale={legacyLocale}
      navGroups={[]}
      locales={[{ locale, nativeName: locale }]}
      pageHeader={{ title: "Examples" }}
      menuShortcut={false}
      contentId="legacy-content"
    >{children}</ProductShell>
  );
}

const talent = (harness: DomInteractionHarness) => harness.document.querySelector<HTMLElement>('[data-fixture="talent"]')!;
const element = <T extends HTMLElement = HTMLElement>(root: ParentNode, selector: string): T => {
  const found = root.querySelector<T>(selector);
  assert.ok(found, `expected ${selector}`);
  return found;
};

async function type(harness: DomInteractionHarness, input: HTMLInputElement, value: string) {
  await act(async () => {
    Object.getOwnPropertyDescriptor(harness.window.HTMLInputElement.prototype, "value")?.set?.call(input, value);
    input.dispatchEvent(new harness.window.Event("input", { bubbles: true }));
  });
}

async function chooseLocale(harness: DomInteractionHarness, locale: BusinessLocale) {
  const root = talent(harness);
  if (element(root, "[data-shell-avatar]").getAttribute("aria-expanded") !== "true") {
    await harness.dispatchClick(element(root, "[data-shell-avatar]"));
  }
  await harness.dispatchClick(element(root, "[data-locale-menu-toggle]"));
  await harness.dispatchClick(element(root, `[data-locale-option="${locale}"]`));
}

test("the first render preserves a validated product locale, and copy cannot be assigned to another locale", () => {
  const preferences = readPreferenceCookieValues("locale=zh_HANT; session=private", {
    localeKey: "locale", localeDefinitions: productLocaleDefinitions
  });
  assert.throws(() => productShellCopyFor("zh_HANT" as TcrnLocale), /requires an explicit complete product copy/);
  const requestLocale: BusinessLocale | undefined = preferences.locale;
  assert.equal(requestLocale, "zh_HANT");
  assert.deepEqual(readPreferenceCookieValues("locale=zh_HANT", { localeKey: "locale" }), { theme: undefined, locale: undefined });
  const markup = renderToStaticMarkup(<TalentShellLocaleFixture initialLocale="en" requestPreferences={preferences} />);
  assert.match(markup, /lang="zh-Hant"/);
  assert.match(markup, /data-current-locale="zh_HANT"/);
  assert.match(markup, /展開導覽 · TCRN TMS/);
  assert.doesNotMatch(markup, /Open navigation|展开导航/);

  const props: ProductShellProps = {
    productName: "TCRN TMS", moduleName: "Talent", brandProductId: "tms", currentRouteLabel: "Customers",
    currentLocale: "en", localeDefinition: productLocaleDefinitions[2], navGroups: talentGroupsFor("en"),
    locales: productLocaleOptions, pageHeader: { title: "Customers" }, children: null
  };
  assert.throws(() => renderToStaticMarkup(<ProductShell {...props} />), /copy for "zh_HANT" cannot render locale "en"/);
  assert.throws(() => renderToStaticMarkup(<TalentShellLocaleFixture initialLocale="unknown" />), /no copy is defined/);
});

test("the nearest shell owns nested menu, pins, search, breadcrumb and brand copy", async () => {
  const harness = createDomInteractionHarness({ shellContainerWidth: 1200 });
  const pins: (readonly string[])[] = [];
  try {
    await harness.render(<LegacyShell><TalentShellLocaleFixture onPinsChange={(value) => pins.push(value)} /></LegacyShell>);
    const root = talent(harness);
    const outer = element(harness.document, '[data-fixture="legacy"]');
    assert.equal(outer.lang, "en");
    assert.equal(root.lang, "zh-Hant");
    assert.equal(element(root, ".tcrn-skip-link").textContent, "跳至外殼內容");
    assert.equal(element(root, ".tcrn-page-header .tcrn-breadcrumb").getAttribute("aria-label"), "藝人 · 麵包屑導覽");
    assert.equal(element(root, "[data-pins]").getAttribute("aria-label"), "藝人 · 固定項");
    assert.equal(element(outer, "[data-shell-brand]").getAttribute("aria-label"), "Open navigation · TCRN Design System");

    await harness.dispatchClick(element(root, "[data-shell-brand]"));
    assert.equal(element(root, '[data-panel="expanded"]').getAttribute("aria-label"), "藝人 · 導覽");
    assert.equal(element(root, ".tcrn-product-logo__line-two").textContent, "藝人管理系統");
    assert.equal(element(root, ".tcrn-product-logo").getAttribute("aria-label"), "TCRN TMS 藝人管理系統");
    const search = element<HTMLInputElement>(root, '[data-shell-search] input');
    assert.equal(search.placeholder, "搜尋頁面與內容");
    assert.equal(search.getAttribute("aria-label"), "搜尋產品外殼");
    const pin = element(root, '[aria-label="固定至頂帶：客戶管理"]');
    assert.equal(pin.getAttribute("aria-label"), "固定至頂帶：客戶管理");
    await harness.dispatchClick(pin);
    assert.deepEqual(pins, [["talent", "customers"]]);
    assert.equal(element(root, '[aria-label="從頂帶移除：客戶管理"]').getAttribute("aria-label"), "從頂帶移除：客戶管理");
    await type(harness, search, "客戶");
    assert.equal(element(root, '[data-product-shell-search-results]').getAttribute("aria-label"), "搜尋結果");
    assert.match(element(root, '[data-product-shell-search-results]').textContent ?? "", /客戶管理/);
    await type(harness, search, "no-match");
    assert.equal(element(root, '[data-product-shell-search-empty]').textContent, "沒有結果");
    await harness.dispatchKeydown(search, "Escape");
    await harness.dispatchClick(element(root, '[data-pin="talent"] .tcrn-shell-pins__item'));
    assert.equal(element<HTMLInputElement>(root, '[data-panel="drop"] input').placeholder, "搜尋藝人工作區");
  } finally {
    await harness.cleanup();
  }
});

test("locale selection keeps exact ids and updates every nested control through all six product locales", async () => {
  const harness = createDomInteractionHarness({ shellContainerWidth: 1200 });
  const changes: string[] = [];
  const products: string[] = [];
  try {
    harness.window.localStorage.setItem("locale-user-a%2Ftms", "unconfigured");
    await harness.render(<TalentShellLocaleFixture onLocaleChange={(value) => changes.push(value)} onProductClick={(href) => products.push(href)} />);
    assert.equal(talent(harness).getAttribute("data-current-locale"), "zh_HANT", "a stale stored id cannot substitute English");
    await harness.dispatchClick(element(talent(harness), "[data-shell-avatar]"));
    assert.equal(element(talent(harness), '[data-panel="account"]').getAttribute("aria-label"), "藝人 · 帳戶");
    assert.equal(element(talent(harness), '[data-shell-products]').getAttribute("aria-label"), "藝人 · 切換產品");
    assert.equal(element(talent(harness), '[data-theme-toggle]').getAttribute("aria-label"), "切換至夜間模式");
    assert.equal(element(talent(harness), '[data-shell-bell]').getAttribute("aria-label"), "通知 · 3 則未讀");
    await harness.dispatchClick(element(talent(harness), '[data-theme-toggle]'));
    assert.equal(element(talent(harness), '[data-theme-toggle]').getAttribute("aria-label"), "切換至日間模式");
    assert.equal(element(talent(harness), '[data-locale-menu-toggle]').getAttribute("aria-label"), "語言");

    const expectations = [
      ["en", "en", "Open navigation · TCRN TMS", "Language"],
      ["zh_HANS", "zh-Hans", "展开导航 · TCRN TMS", "语言"],
      ["ja", "ja", "ナビゲーションを開く · TCRN TMS", "言語"],
      ["ko", "ko", "내비게이션 열기 · TCRN TMS", "언어"],
      ["fr", "fr", "Ouvrir la navigation · TCRN TMS", "Langue"],
      ["zh_HANT", "zh-Hant", "展開導覽 · TCRN TMS", "語言"]
    ] as const;
    for (const [locale, lang, brand, language] of expectations) {
      await chooseLocale(harness, locale);
      const root = talent(harness);
      assert.equal(root.lang, lang);
      assert.equal(root.getAttribute("data-current-locale"), locale);
      assert.equal(element(root, "[data-controller-locale]").getAttribute("data-controller-locale"), locale);
      assert.equal(element(root, "[data-shell-brand]").getAttribute("aria-label"), brand);
      assert.equal(element(root, "[data-locale-menu-toggle]").getAttribute("aria-label"), language);
      assert.equal(element(root, "[data-locale-current]").lang, lang);
    }
    assert.deepEqual(changes, expectations.map(([locale]) => locale));
    assert.equal(harness.window.localStorage.getItem("locale-user-a%2Ftms"), "zh_HANT");
    assert.match(harness.document.cookie, /locale-user-a%2Ftms=zh_HANT/);
    await harness.dispatchClick(element(talent(harness), '[data-shell-product="other"]'));
    assert.deepEqual(products, ["/other"]);
  } finally {
    await harness.cleanup();
  }
});

function AccountSwitchFixture() {
  const [identity, setIdentity] = useState("user-a/tms");
  return <>
    <button data-switch-account onClick={() => setIdentity("user-b/tms")}>B</button>
    <button data-switch-product onClick={() => setIdentity("user-b/other")}>Other</button>
    <button data-return-account onClick={() => setIdentity("user-a/tms")}>A</button>
    <TalentShellLocaleFixture key={identity} identity={identity} accountName={identity} />
  </>;
}

test("account and product remounts keep their own locale preference and copy", async () => {
  const harness = createDomInteractionHarness({ shellContainerWidth: 1200 });
  try {
    await harness.render(<AccountSwitchFixture />);
    await chooseLocale(harness, "ja");
    await harness.dispatchClick(element(harness.document, "[data-switch-account]"));
    assert.equal(talent(harness).getAttribute("data-current-locale"), "zh_HANT");
    assert.match(element(talent(harness), "[data-shell-avatar]").getAttribute("aria-label") ?? "", /user-b\/tms · 帳戶/);
    await chooseLocale(harness, "fr");
    await harness.dispatchClick(element(harness.document, "[data-switch-product]"));
    assert.equal(talent(harness).getAttribute("data-current-locale"), "zh_HANT");
    await harness.dispatchClick(element(harness.document, "[data-return-account]"));
    assert.equal(talent(harness).getAttribute("data-current-locale"), "ja");
    assert.equal(harness.window.localStorage.getItem("locale-user-b%2Ftms"), "fr");
    assert.equal(harness.window.localStorage.getItem("locale-user-b%2Fother"), null);
  } finally {
    await harness.cleanup();
  }
});

test("a legacy shell nested inside a custom locale keeps the original five-language copy", async () => {
  const harness = createDomInteractionHarness();
  try {
    await harness.render(<TalentShellLocaleFixture><LegacyShell locale="fr"><p>Inner content</p></LegacyShell></TalentShellLocaleFixture>);
    const inner = element(harness.document, '[data-fixture="legacy"]');
    assert.equal(inner.lang, "fr");
    assert.equal(element(inner, "[data-shell-brand]").getAttribute("aria-label"), "Ouvrir la navigation · TCRN Design System");
    assert.equal(element(talent(harness), "[data-shell-brand]").getAttribute("aria-label"), "展開導覽 · TCRN TMS");
  } finally {
    await harness.cleanup();
  }
});


test("the phone sheet retains the product copy for its pinned and complete navigation lists", async () => {
  const harness = createDomInteractionHarness({ shellContainerWidth: 390 });
  try {
    await harness.render(<TalentShellLocaleFixture />);
    await harness.dispatchClick(element(talent(harness), "[data-shell-brand]"));
    const sheet = element(talent(harness), '[data-panel="sheet"]');
    assert.equal(sheet.getAttribute("aria-label"), "藝人 · 導覽");
    assert.match(sheet.textContent ?? "", /固定項 · 1/);
    assert.match(sheet.textContent ?? "", /全部/);
    assert.equal(element<HTMLInputElement>(sheet, "input").placeholder, "搜尋頁面與內容");
  } finally {
    await harness.cleanup();
  }
});

function StrictLocaleFixture({ errors, changes }: { errors: string[]; changes: string[] }) {
  const controller = useProductShellController({ localeDefinitions: productLocaleDefinitions, initialLocale: "zh_HANT", onLocaleChange: (value) => changes.push(value) });
  return <button data-strict-locale={controller.locale} onClick={() => {
    try {
      controller.setLocale("unconfigured");
    } catch (error) {
      errors.push(String(error));
    }
  }}>Invalid locale</button>;
}

test("an unconfigured locale selection fails before state, preference or callback mutation", async () => {
  const harness = createDomInteractionHarness();
  const errors: string[] = [];
  const changes: string[] = [];
  try {
    await harness.render(<StrictLocaleFixture errors={errors} changes={changes} />);
    await harness.dispatchClick(element(harness.document, "[data-strict-locale]"));
    assert.match(errors[0] ?? "", /no copy is defined for locale "unconfigured"/);
    assert.deepEqual(changes, []);
    assert.equal(element(harness.document, "[data-strict-locale]").getAttribute("data-strict-locale"), "zh_HANT");
  } finally {
    await harness.cleanup();
  }
});


function ControllerPartsFixture() {
  const controller = useProductShellController({ initialLocale: "zh_HANT", localeDefinitions: productLocaleDefinitions });
  return <>
    <ShellLocaleMenu {...controller.shellLocaleMenuProps} locales={productLocaleOptions} />
    <ShellThemeToggle {...controller.shellThemeToggleProps} />
    <ProductShellSearch {...controller.productShellSearchProps} />
  </>;
}

test("the controller's standalone control props use the same complete product copy", async () => {
  const harness = createDomInteractionHarness();
  try {
    await harness.render(<ControllerPartsFixture />);
    assert.equal(element(harness.document, "[data-locale-menu-toggle]").getAttribute("aria-label"), "語言");
    assert.equal(element(harness.document, "[data-theme-toggle]").getAttribute("aria-label"), "切換至夜間模式");
    assert.equal(element<HTMLInputElement>(harness.document, "input[type=search]").placeholder, "搜尋");
  } finally {
    await harness.cleanup();
  }
});
