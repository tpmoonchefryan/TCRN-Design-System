import { needsHostFormColumn } from "./component-layout.js";
import { useEffect, useId, useRef, useState } from "react";
import {
  Button, ButtonGroup, Checkbox, ClipboardCopyButton, DatePicker, Heading, Highlight,
  Icon, IconButton, Input, LinkButton, MultiSelect, NumberInput, ProductLockup,
  ProductLogo, RadioGroup, SearchInput, Select, ShellBrandButton, ShellIntro,
  SuggestInput, Switch, Text, Textarea, tcrnProductMarkIds, ProductShell, productShellCopyFor, useProductShellController,
} from "@tcrn/ui-react/approved";
import type { DocsLocale } from "./approved-source.js";
import { componentStates, type ComponentState, type FormalComponentName } from "./component-catalog.js";
import { docsCopy } from "./locales.js";
import { rosterGroups, ShellExample } from "./specimens.js";

function GroupExample({ locale, state, size = "md" }: { locale: DocsLocale; state: string; size?: "sm" | "md" | "lg" }) {
  const c = docsCopy(locale);
  const [selected, setSelected] = useState(0);
  const labels = [c.all, c.signed, c.trial, c.pending, c.settings].slice(0, state === "five-actions" ? 5 : 3);
  return <ButtonGroup ariaLabel={`${c.status} ${size}`} size={size} variant={state === "quiet" ? "quiet" : "secondary"}>
    {labels.map((label, index) => <Button key={label} aria-pressed={selected === index} onClick={() => setSelected(index)}>{label}</Button>)}
  </ButtonGroup>;
}

function IntroExample({ locale }: { locale: DocsLocale }) {
  const c = docsCopy(locale);
  const shellRef = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  return <div ref={shellRef}>
    <Button onClick={() => { sessionStorage.removeItem("tcrn-component-example-intro"); setResult("playing"); setRun(true); }}>{c.login}</Button>
    <ShellExample locale={locale} mode="band" />
    {run && <ShellIntro productId="tms" locale={locale} shellRef={shellRef}
      sessionMarker="tcrn-component-example-intro" card={<ProductLockup productId="tms" locale={locale} className="tcrn-doc-intro-lockup" />}
      onFinish={played => { setResult(played ? "played" : "not-played"); setRun(false); }} />}
    {result !== null && <output aria-live="polite">{result}</output>}
  </div>;
}

function ClipboardScenario({ locale, state }: { locale: DocsLocale; state: ComponentState }) {
  const c = docsCopy(locale);
  const root = useRef<HTMLDivElement>(null);
  const [observed, setObserved] = useState<string | null>(null);
  const deterministic = ["copying", "copied", "failed", "unsupported"].includes(state);
  useEffect(() => {
    if (!deterministic) return;
    // Only these explicitly labelled boundary fixtures replace the browser API.
    // The default and interaction examples use the real navigator clipboard.
    const descriptor = Object.getOwnPropertyDescriptor(navigator, "clipboard");
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: state === "unsupported" ? undefined : {
      writeText: () => state === "copying" ? new Promise<void>(() => {}) : state === "failed" ? Promise.reject(new Error("Clipboard boundary fixture")) : Promise.resolve(),
    } });
    const frame = requestAnimationFrame(() => root.current?.querySelector<HTMLButtonElement>("button")?.click());
    return () => {
      cancelAnimationFrame(frame);
      if (descriptor) Object.defineProperty(navigator, "clipboard", descriptor);
      else Reflect.deleteProperty(navigator, "clipboard");
    };
  }, [deterministic, state]);
  return <div ref={root} data-clipboard-boundary={deterministic ? "controlled-browser-api-fixture" : "native-browser-api"}>
    {deterministic && <Text size="meta">Clipboard API boundary fixture: {state}</Text>}
    <ClipboardCopyButton text="PRJ-2026-0412" ariaLabel={c.copy} locale={locale} onCopyStateChange={setObserved} />
    {observed !== null && <output data-clipboard-observed="" aria-live="polite">{observed}</output>}
  </div>;
}

function ProductLocaleExample() {
  const controller = useProductShellController({
    initialLocale: "en_PRODUCT",
    localeDefinitions: [
      { locale: "en_PRODUCT", lang: "en", copy: productShellCopyFor("en") },
      { locale: "fr_PRODUCT", lang: "fr", copy: productShellCopyFor("fr") },
    ] as const,
    requestPreferences: { pins: ["roster"] },
  });
  const locale = controller.locale === "fr_PRODUCT" ? "fr" : "en";
  return <div>
    <ProductShell productName="TCRN TMS" brandProductId="tms" moduleName={docsCopy(locale).roster} currentRouteLabel={docsCopy(locale).roster} navGroups={rosterGroups(locale)}
      locales={[{ locale: "en_PRODUCT", nativeName: "English", lang: "en" }, { locale: "fr_PRODUCT", nativeName: "Français", lang: "fr" }]}
      {...controller.productShellControlProps} pageHeader={{ title: docsCopy(locale).roster }}>
      <Text>{docsCopy(locale).body}</Text>
    </ProductShell>
    <output data-product-locale="">{controller.locale}</output>
  </div>;
}

const fieldColumnContext = {
  en: "Documentation context: a fluid form column capped at 28rem, not a Design System token. Products use their existing form-column rule.",
  "zh-CN": "文档示例上下文：表单列随可用空间收缩，上限为 28rem；这不是设计系统令牌。产品应使用自身已有的表单列规则。",
  ja: "ドキュメント用の例：フォーム列は利用可能な幅に追従し、上限は 28rem です。Design System のトークンではありません。製品では既存のフォーム列ルールを使います。",
  ko: "문서 예제 환경: 폼 열은 가용 너비에 맞춰 줄어들며 최대 28rem입니다. Design System 토큰이 아닙니다. 제품의 기존 폼 열 규칙을 사용하세요.",
  fr: "Contexte documentaire : colonne de formulaire fluide, plafonnée à 28rem. Ce n’est pas un jeton du Design System. Utilisez la règle de colonne existante du produit.",
};

export function ComponentExample({ name, state = "default", locale = "en", interaction = false }: {
  name: FormalComponentName;
  state?: ComponentState;
  locale?: DocsLocale;
  interaction?: boolean;
}) {
  if (!(componentStates[name] as readonly string[]).includes(state)) throw new Error(`Unsupported ${name} state: ${state}`);
  const c = docsCopy(locale);
  const id = useId();
  const [value, setValue] = useState<string[]>(["review"]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (name !== "Checkbox") return;
    const control = rootRef.current?.querySelector<HTMLInputElement>("input[type=checkbox]");
    if (control) control.indeterminate = state === "indeterminate";
  }, [name, state]);
  const disabled = state === "disabled";
  const invalid = state === "error" || state === "error-focus";
  const props = {
    disabled, disabledReason: c.unavailable, readOnly: state === "readonly",
    "aria-invalid": invalid || undefined,
    "aria-describedby": invalid ? `${id}-error` : undefined,
    "data-tcrn-preview-state": ["hover", "active", "focus", "error-focus"].includes(state) ? state : undefined,
  };
  const { disabledReason: _disabledReason, ...nativeProps } = props;
  const options = [{ value: "review", label: c.project }, { value: "release", label: c.schedule }, { value: "archive", label: c.contracts, disabled: true }];
  const example = () => {
    switch (name) {

      case "Heading": return state === "levels"
        ? ([1, 2, 3, 4] as const).map(level => <Heading key={level} level={level}>{c.project}</Heading>)
        : <Heading level={2}>{state === "truncated" ? `${c.project} · `.repeat(20) : c.project}</Heading>;

      case "Text": return state === "sizes"
        ? (["body", "reading", "meta", "caption"] as const).map(size => <Text key={size} size={size}>{c.body}</Text>)
        : <Text tone={state === "strong" ? "strong" : undefined} variant={state === "numeral" || state === "caps" ? state : undefined}>{state === "numeral" ? <>128<small>{c.seat}</small></> : state === "caps" ? c.status : c.body}</Text>;

      case "Highlight": return <Highlight text={`${c.project} · PRJ-2026`} query={state === "empty" ? "" : state === "case-sensitive" ? "prj" : "2026"} caseSensitive={state === "case-sensitive"} />;

      case "Icon": return state === "sizes" ? (["sm", "md", "lg"] as const).map(size => <Icon key={size} name="settings" size={size} />)
        : <Icon name="settings" title={state === "meaningful" ? c.settings : undefined} />;

      case "ProductLogo": return state === "products" ? tcrnProductMarkIds.map(productId => <ProductLogo key={productId} productId={productId} locale={locale} />)
        : state === "variants" ? (["color", "mono", "tile-tint", "tile-deep"] as const).map(markVariant => <ProductLogo key={markVariant} productId="tms" markVariant={markVariant} />) : <ProductLogo productId="tms" locale={locale} />;

      case "ProductLockup": return state === "products" ? tcrnProductMarkIds.map(productId => <ProductLockup key={productId} productId={productId} locale={locale} />)
        : <ProductLockup productId="tms" locale={locale} scale={state === "rail" ? "rail" : "lockup"} firstLine={state === "first-line" ? "rail" : undefined} />;

      case "Button": return state === "variants" ? (["primary", "secondary", "quiet", "danger"] as const).map(variant => <Button key={variant} variant={variant}>{c.save}</Button>)
        : state === "sizes" ? (["sm", "md", "lg"] as const).map(size => <Button key={size} size={size}>{c.save}</Button>)
        : <Button {...props} loading={state === "loading"} aria-pressed={state === "selected" || undefined} onClick={() => setFeedback("activated")}>{c.save}</Button>;

      case "IconButton": return state === "sizes" ? (["sm", "md", "lg"] as const).map(size => <IconButton key={size} size={size} ariaLabel={c.settings} iconName="settings" />) : <IconButton {...props} ariaLabel={c.settings} iconName="settings" loading={state === "loading"} aria-pressed={state === "selected" || undefined} onClick={() => setFeedback("activated")}>{state === "labelled" ? c.settings : undefined}</IconButton>;

      case "LinkButton": return state === "variants" ? (["primary", "secondary", "quiet"] as const).map(variant => <LinkButton key={variant} href={`#${id}-result`} variant={variant}>{c.invoice}</LinkButton>)
        : <LinkButton href={state === "external" ? "https://example.com/" : `#${id}-result`} rel={state === "external" ? "noreferrer" : undefined} data-tcrn-preview-state={state === "focus" ? "focus" : undefined}>{c.invoice}{state === "external" && <Icon name="external-link" />}</LinkButton>;

      case "ClipboardCopyButton": return <ClipboardScenario locale={locale} state={state} />;

      case "ButtonGroup": return state === "sizes" ? (["sm", "md", "lg"] as const).map(size => <GroupExample key={size} size={size} locale={locale} state={state} />) : <GroupExample locale={locale} state={state} />;

      case "Input": return <Input {...props} name="name" aria-label={c.name} placeholder={c.name} defaultValue={state === "default" ? "" : c.project} />;

      case "Textarea": return <Textarea {...props} name="description" aria-label={c.name} defaultValue={state === "default" ? "" : c.body} />;

      case "SearchInput": return <SearchInput {...props} name="query" aria-label={c.search} placeholder={c.search} shortcut="auto" defaultValue={state === "filled" ? c.project : ""} />;

      case "SuggestInput": return <SuggestInput {...props} name="project" aria-label={c.name} suggestions={[c.project, c.contracts, c.members]} defaultValue={state === "filled" ? c.project : ""} />;

      case "Select": return <Select {...props} name="status" aria-label={c.status} options={options} defaultValue="review" />;

      case "MultiSelect": return <MultiSelect {...props} name="projects" aria-label={c.project} options={options} value={state === "empty" ? [] : value} onChange={setValue} presentation={state === "native" || state === "checkboxes" ? state : "dropdown"} emptySelectionLabel={c.empty} clearSelectionLabel={c.clear} />;

      case "NumberInput": return <NumberInput {...props} name="seats" aria-label={c.seat} min={1} max={120} defaultValue={state === "bounds" ? 120 : 24} />;

      case "DatePicker": return <DatePicker {...nativeProps} title={disabled ? c.unavailable : undefined} name="date" aria-label={c.day} min="2026-01-01" max="2027-12-31" defaultValue="2026-10-20" />;

      case "Checkbox": return <label className="component-choice-label"><Checkbox {...props} name="notify" defaultChecked={state === "checked"} data-tcrn-preview-state={state === "indeterminate" ? "indeterminate" : props["data-tcrn-preview-state"]} />{c.notify}</label>;

      case "RadioGroup": return <RadioGroup legend={c.status} name={id} options={options} defaultValue={state === "selected" ? "release" : "review"} disabled={disabled} aria-invalid={invalid || undefined} aria-describedby={invalid ? `${id}-error` : undefined} />;

      case "Switch": return <Switch title={disabled ? c.unavailable : undefined} name="notify" label={c.notify} disabled={disabled} defaultChecked={state === "checked"} className={state === "small" ? "tcrn-switch--sm" : undefined} />;

      case "ShellBrandButton": return <ShellBrandButton productId="tms" locale={locale} expanded={state === "expanded"} version={state === "v1" || state === "v2" ? state : "auto"} onClick={() => setFeedback("activated")} />;

      case "ShellIntro": return <IntroExample locale={locale} />;

      case "ProductShell": if (state === "product-locales") return <ProductLocaleExample />;

      case "ShellMenu": case "ShellPins": case "ShellDropdown": return <ShellExample locale={locale} mode={state === "phone" || state === "sheet" ? "phone" : name === "ShellDropdown" || state === "dropdown" || state === "cascade" ? "drop" : name === "ShellMenu" || state === "menu" || state === "panel" || state === "search" ? "menu" : "band"} initialPinCount={state === "overflow" ? 8 : 4} />;
    }
  };
  return <>
    {needsHostFormColumn(name) && <Text size="meta" data-doc-field-context="">{fieldColumnContext[locale]}</Text>}
    <div ref={rootRef} className={needsHostFormColumn(name) ? "component-example-field-column" : undefined} data-doc-field-column={needsHostFormColumn(name) ? "" : undefined} data-component-example={name} data-example-state={state} lang={locale}>
      {interaction ? <form onSubmit={event => {
        event.preventDefault();
        setFeedback(JSON.stringify([...new FormData(event.currentTarget)]));
      }}>
        {example()}
        <Button type="submit">{c.save}</Button>
      </form> : example()}
      {invalid && <p id={`${id}-error`} className="tcrn-doc-error">{name === "DatePicker" ? c.dateError : name === "Select" ? c.selectionError : c.error}</p>}
      {feedback !== null && <output id={`${id}-result`} data-example-result="" aria-live="polite">{feedback}</output>}
    </div>
  </>;
}
