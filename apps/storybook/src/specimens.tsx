import { Fragment, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Button, ButtonGroup, IconButton, LinkButton, ClipboardCopyButton, Heading, Text, Highlight, Icon, TcrnBrandMark, ProductLogo, ProductLockup, tcrnProductMarkIds, Input, Textarea, SearchInput, SuggestInput, Select, MultiSelect, NumberInput, DatePicker, Checkbox, RadioGroup, Switch, ProductShell, ShellBrandButton, ShellIntro, Tabs, shellMenuPresentationContext, type IconName, type ProductShellNavGroup, type TcrnProductMarkId } from "@tcrn/ui-react/approved";
import { getTcrnProductLogoAsset } from "@tcrn/ui-react";
import { tcrnGplusThemedTokens, tcrnGplusFixedTokens, tcrnTokens } from "@tcrn/ui-tokens";
import { approvedSource, supportedLocales, type ApprovedBoardId, type DocsLocale } from "./approved-source.js";
import { tcrnLocaleMetadata } from "@tcrn/ui-copy-state";
import { docsCopy } from "./locales.js";
import { specimenCopy } from "./specimen-copy.js";

export function Section({name, title = name, children}: {name: string; title?: string; children: ReactNode}) {
  return <section className="tcrn-doc-section" data-formal-section={name}><Heading level={3}>{title}</Heading>{children}</section>;
}

const themes = ["light", "dark"] as const;

export function Themes({children, locale}: {children: (theme: "light" | "dark") => ReactNode; locale: DocsLocale}) {
  return <div className="tcrn-doc-themes">{themes.map(theme => (
    <div key={theme} className="tcrn-doc-pane" data-tcrn-theme={theme} data-formal-theme={theme}>
      <Heading level={2} visualLevel={4}>{specimenCopy[locale].themes[theme]}</Heading>
      <div className="tcrn-doc-paper">{children(theme)}</div>
    </div>
  ))}</div>;
}

export const Row = ({children}: {children: ReactNode}) => <div className="tcrn-doc-row">{children}</div>;

const spacingRoles = [
  { role: "paragraphs", variable: "--tcrn-space-2h", factor: 1 },
  { role: "groups", variable: "--tcrn-space-3h", factor: 1 },
  { role: "sections", variable: "--tcrn-space-3h", factor: 2 },
] as const;

function TokenValue({value}: {value: string}) {
  return value.split(",").map((part, index) => (
    <Fragment key={index}>{index > 0 && <>,<wbr/></>}{part}</Fragment>
  ));
}

function Tokens({locale}: {locale: DocsLocale}) {
  const { tokens, themes: themeNames } = specimenCopy[locale];
  return <>
    <section className="tcrn-doc-section" data-doc-token-section="themed">
      <Heading level={2} visualLevel={3}>{tokens.themed}</Heading>
      <table className="tcrn-doc-table">
        <thead><tr><th scope="col">{tokens.token}</th><th scope="col">{themeNames.light}</th><th scope="col">{themeNames.dark}</th></tr></thead>
        <tbody>{tcrnGplusThemedTokens.map(t => <tr key={t.key}>
          <td title={t.cssVar}><code>{t.key}</code></td>
          <td title={t.light}><span className="tcrn-doc-swatch" style={{background: t.light}}/><TokenValue value={t.light}/></td>
          <td title={t.dark}><span className="tcrn-doc-swatch" style={{background: t.dark}}/><TokenValue value={t.dark}/></td>
        </tr>)}</tbody>
      </table>
    </section>
    <section className="tcrn-doc-section" data-doc-token-section="fixed">
      <Heading level={2} visualLevel={3}>{tokens.fixed}</Heading>
      <div className="tcrn-doc-grid">{tcrnGplusFixedTokens.filter(t => t.source?.startsWith("01-tokens/")).map(t => (
        <div key={t.key}><code className="tcrn-doc-code">{t.cssVar}</code><Text size="meta">{t.value}</Text></div>
      ))}</div>
    </section>
    <section className="tcrn-doc-section" data-doc-token-section="spacing">
      <Heading level={2} visualLevel={3}>{tokens.spacing}</Heading>
      <Text>{tokens.spacingIntro}</Text>
      <dl className="tcrn-doc-spacing-roles">
        {spacingRoles.map(({role, variable, factor}) => {
          const token = tcrnTokens.find(t => t.variable === variable)!;
          return <div key={role} data-doc-spacing-role={role}>
            <dt>{tokens[role]}</dt>
            <dd><code className="tcrn-doc-code">{factor > 1 && `${factor} × `}{variable}</code>{` · ${parseFloat(token.value) * factor} px`}</dd>
          </div>;
        })}
      </dl>
    </section>
  </>;
}

function Typography({locale,apiHref}:{locale:DocsLocale;apiHref:string}) {const c=docsCopy(locale);return <Themes locale={locale}>{theme=><>
  <Section name="Heading">{([1,2,3,4] as const).map(level=><Heading key={level} level={level} visualLevel={level} data-formal-role={`h${level}`}>{c.project}</Heading>)}</Section>
  <Section name="Text"><Text data-formal-role="body">{c.body}</Text><Text tone="strong" data-formal-role="strong" data-standard-conflict="K5">{c.strong}</Text><Text size="reading" data-formal-role="read">{c.reading}</Text><Text size="meta" data-formal-role="meta">{c.meta}</Text><Text size="caption" data-formal-role="cap">{c.caption}</Text><Text><a className="tcrn-link" href={apiHref} data-formal-role="link">{c.invoice}</a></Text></Section>
  <Row><Text variant="numeral" data-formal-role="num">128<small>{c.seat}</small></Text><Text variant="numeral" className="tcrn-text--numeral-inline">4,280.00</Text><Text variant="numeral" className="tcrn-text--numeral-large">99.8<small>%</small></Text></Row>
  <Text variant="caps"><b>01</b>{c.name}</Text><Text className="tcrn-text--mono" data-formal-role="id">PRJ-2026-0412 · 2026-10-09</Text>
  <Section name="Highlight"><Text data-highlight-empty=""><Highlight text="PRJ-2026-0412" query=""/></Text><Text data-highlight-reference="">{c.project} · PRJ-2026-0412</Text><Text data-highlight-specimen=""><Highlight text={`${c.project} · PRJ-2026-0412`} query="2026"/></Text><table className="tcrn-doc-table"><tbody><tr aria-selected="true"><td><Highlight text="PRJ-2026-0412" query="2026"/></td><td>{c.selected}</td></tr></tbody></table></Section>
  <div data-canvas-type={theme}><Text>{c.body}</Text><Text tone="strong" data-standard-conflict="K5">{c.strong}</Text><Text size="meta">{c.meta}</Text></div>
  </>}</Themes>;}
// Editorial groups for finding names in 03. The 07 pin is presented separately.
const iconGroups = [
  {id: "navigation", names: ["arrow-left", "arrow-right", "chevron-down", "chevron-left", "chevron-right", "chevron-up", "home", "layers", "layout-grid", "menu", "panel-left-close", "panel-left-open"]},
  {id: "find", names: ["book-open", "database", "external-link", "globe-2", "history", "package", "search"]},
  {id: "actions", names: ["calendar", "copy", "minus", "more-horizontal", "plus", "trash", "users", "x"]},
  {id: "appearance", names: ["moon", "palette", "settings", "sun"]},
  {id: "status", names: ["alert-triangle", "bell", "check", "info", "loader-circle", "shield-check"]},
  {id: "shell", names: ["pin"]},
] as const satisfies readonly {id: keyof typeof specimenCopy.en.icons.groups; names: readonly IconName[]}[];

const iconSizes = [
  {size: "sm", glyph: 14, hit: 28},
  {size: "md", glyph: 16, hit: 32},
  {size: "lg", glyph: 20, hit: 40},
] as const;

function Icons({locale}: {locale: DocsLocale}) {
  const c = docsCopy(locale);
  const labels = specimenCopy[locale].icons;
  return <>
    <section className="tcrn-doc-section" data-doc-icon-guide="">
      <Heading level={2} visualLevel={3}>{labels.sizes}</Heading>
      <Text>{labels.geometry}</Text>
    </section>
    <Themes locale={locale}>{() => <>
      <div className="tcrn-doc-grid tcrn-doc-icon-sizes">
        {iconSizes.map(({size, glyph, hit}) => <div className="tcrn-doc-prose" key={size} data-doc-icon-size={size}>
          <Row>
            <Icon name="settings" size={size}/>
            <strong>{size} · {labels.glyph} <span>{glyph} px</span></strong>
          </Row>
          <Text>{labels[size]}</Text>
          <Row>
            <IconButton size={size} ariaLabel={`${c.settings} · ${size}`} iconName="settings"/>
            <span>{labels.hitArea} · <span>{hit} × {hit} px</span></span>
          </Row>
        </div>)}
      </div>
      {iconGroups.map(({id, names}) => <section className="tcrn-doc-section" key={id} data-doc-icon-group={id}>
        <Heading level={3} visualLevel={4}>{labels.groups[id]}</Heading>
        <ul className="tcrn-doc-icon-grid">
          {names.map(name => <li key={name} data-formal-icon={name}>
            <code className="tcrn-doc-code">{name}</code>
            <div className="tcrn-doc-icon-triplet">
              {iconSizes.map(({size, glyph}) => <Icon key={size} name={name} size={size} title={`${name} · ${glyph} px`}/>)}
            </div>
          </li>)}
        </ul>
      </section>)}
      <Section name="icon-states" title={labels.states}>
        <Row>
          <IconButton ariaLabel={c.settings} iconName="settings"/>
          <Button><Icon name="users" size="sm"/>{c.members}</Button>
          <Text size="meta"><Icon name="loader-circle" size="sm"/>{c.loading}</Text>
        </Row>
      </Section>
    </>}</Themes>
  </>;
}

const brandSizes = [128, 64, 48, 32, 24, 16] as const;

function BrandMarkSample({productId, size, variant = "color", label}: {
  productId: TcrnProductMarkId; size: number; variant?: "color" | "mono" | "tile-tint" | "tile-deep"; label?: string;
}) {
  return <figure className="tcrn-doc-brand-sample" data-doc-brand-rendition={variant} data-doc-brand-size={size}>
    <TcrnBrandMark productId={productId} variant={variant} style={{width: size, height: size}}/>
    <figcaption>{label && `${label} · `}{size} px</figcaption>
  </figure>;
}

function Brand({locale}: {locale: DocsLocale}) {
  const labels = specimenCopy[locale].brand;
  return <>
    <section className="tcrn-doc-section" data-doc-brand-guide="">
      <Heading level={2} visualLevel={3}>{labels.guide}</Heading>
      <div className="tcrn-doc-prose">
        <Text>{labels.tileUse}</Text>
        <Text>{labels.monoUse}</Text>
        <Text>{labels.shellUse}</Text>
      </div>
    </section>
    <Themes locale={locale}>{() => tcrnProductMarkIds.map(productId => (
      <Section key={productId} name={productId} title={getTcrnProductLogoAsset(productId).lineOne}>
        <div className="tcrn-doc-section" data-doc-brand-ladder="">
          <Heading level={4}>{labels.ladder}</Heading>
          <Row>{brandSizes.map(size => <BrandMarkSample key={size} productId={productId} size={size}/>)}</Row>
        </div>
        <Row>
          <figure className="tcrn-doc-brand-sample">
            <ProductLogo productId={productId} locale={locale}/>
            <figcaption>{labels.color} · 44 px</figcaption>
          </figure>
          <BrandMarkSample productId={productId} size={56} variant="mono" label={labels.mono}/>
          {([["tile-tint", labels.tint], ["tile-deep", labels.deep]] as const).flatMap(([variant, label]) =>
            [64, 32].map(size => <BrandMarkSample key={`${variant}-${size}`} productId={productId} size={size} variant={variant} label={label}/>))}
        </Row>
        <div className="tcrn-doc-section" data-doc-brand-lockups=""
          data-standard-conflict={productId === "tms" || productId === "design-system" ? "K1" : undefined}>
          <Heading level={4}>{labels.lockups}</Heading>
          {([
            {label: labels.full, size: 44, scale: "lockup"},
            {label: labels.compact, size: 22, scale: "rail"},
            {label: labels.fullLine, size: 44, firstLine: "lockup"},
            {label: labels.compactLine, size: 22, firstLine: "rail"},
          ] as const).map(({label, size, ...props}) => <figure key={label} className="tcrn-doc-brand-sample">
            <ProductLockup productId={productId} locale={locale} {...props}/>
            <figcaption>{label} · {size} px</figcaption>
          </figure>)}
        </div>
      </Section>
    ))}</Themes>
  </>;
}

const actionStates=["default","hover","active","focus","disabled","loading","selected"] as const;
function Actions({locale,apiHref}:{locale:DocsLocale;apiHref:string}) {const c=docsCopy(locale);return <Themes locale={locale}>{()=> <>
  {(["primary","secondary","quiet","danger"] as const).map(variant=><Section key={variant} name={variant}><Row>{actionStates.filter(state=>state!=="selected"||variant==="secondary"||variant==="quiet").map(state=><Button key={state} variant={variant} disabled={state==="disabled"} disabledReason={c.unavailable} loading={state==="loading"} aria-pressed={state==="selected"?true:undefined} data-tcrn-preview-state={state==="hover"||state==="active"||state==="focus"?state:undefined} data-formal-action={`${variant}-${state}`}>{state==="loading"?c.loading:variant==="primary"?c.save:variant==="danger"?c.remove:variant==="quiet"?c.cancel:c.export}</Button>)}</Row><Row>{actionStates.filter(state=>state!=="selected"||variant==="secondary"||variant==="quiet").map(state=><IconButton key={state} ariaLabel={c.settings} iconName="settings" variant={variant} disabled={state==="disabled"} disabledReason={c.unavailable} loading={state==="loading"} aria-pressed={state==="selected"?true:undefined} data-tcrn-preview-state={state==="hover"||state==="active"||state==="focus"?state:undefined}/>)}</Row></Section>)}
  <Row>{(["sm","md","lg"] as const).map(size=><span key={size} className="tcrn-doc-row" data-icon-button-size={size}><IconButton ariaLabel={c.settings} iconName="settings" size={size}/><IconButton ariaLabel={c.settings} iconName="settings" size={size}>{c.settings}</IconButton><Button size={size}><Icon name="users" size={size==="lg"?"md":"sm"}/>{c.invite}</Button></span>)}</Row>
  <Row>{(["primary","secondary","quiet"] as const).map(variant=><LinkButton key={variant} variant={variant} href={apiHref}>{c.invoice}<Icon name="external-link" size="sm"/></LinkButton>)}</Row>
  <ClipboardStates locale={locale}/>
  {(["secondary","quiet"] as const).map(variant=><Section key={variant} name={`ButtonGroup ${variant}`}><Row>{(["sm","md","lg"] as const).flatMap(size=>([2,4,5] as const).map(count=><ActionGroup key={`${size}-${count}`} locale={locale} variant={variant} size={size} count={count}/>))}</Row></Section>)}
  </>}</Themes>;}
function ActionGroup({locale,variant,size,count}:{locale:DocsLocale;variant:"secondary"|"quiet";size:"sm"|"md"|"lg";count:2|4|5}) {
 const c=docsCopy(locale),[selected,setSelected]=useState(0),labels=[c.all,c.signed,c.trial,c.pending,c.settings];
 return <ButtonGroup ariaLabel={`${c.export} ${variant} ${size} ${count}`} size={size} variant={variant} data-group-boundary={count}>{labels.slice(0,count).map((label,i)=>i===count-1?<IconButton key={i} iconName="settings" ariaLabel={label} aria-pressed={selected===i} onClick={()=>setSelected(i)}/>:<Button key={i} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{label}</Button>)}</ButtonGroup>;
}
function ClipboardStates({locale}:{locale:DocsLocale}) {const c=docsCopy(locale);const [state,setState]=useState("idle");return <Section name="ClipboardCopyButton"><ClipboardCopyButton text="PRJ-2026-0412" ariaLabel={c.copy} locale={locale} idleLabel={c.copy} copyingLabel={c.copyBusy} copiedLabel={c.copied} failedLabel={c.failed} unsupportedLabel={c.unsupported} resetDelayMs={2000} onCopyStateChange={s=>setState(s)}/><Text size="meta" role="status" data-clipboard-status="">{state}</Text><Row>{([['idle',c.copy,'copy'],['copying',c.copyBusy,'loader-circle'],['copied',c.copied,'check'],['failed',c.failed,'alert-triangle'],['unsupported',c.unsupported,'info']] as const).map(([value,label,icon])=><Button key={value} size="sm" variant="secondary" data-clipboard-copy-state={value} aria-busy={value==="copying"?true:undefined} data-formal-clipboard-state={value}><Icon name={icon} size={13}/>{label}</Button>)}</Row></Section>;}
function Inputs({locale}:{locale:DocsLocale}) {const c=docsCopy(locale);const prefix=useId();const options=[{value:"review",label:c.project},{value:"release",label:c.schedule},{value:"archive",label:c.contracts,disabled:true}];return <Themes locale={locale}>{theme=><>
  <div className="tcrn-doc-grid">{(["default","hover","focus","filled","readonly","disabled","error","error-focus"] as const).map(state=><label className="tcrn-doc-label" key={state}>{c.name} · {state}<Input data-primary-input-state={state} aria-label={`${c.name} ${state}`} placeholder={c.project} defaultValue={state==="default"?undefined:c.project} readOnly={state==="readonly"} disabled={state==="disabled"} disabledReason={c.unavailable} aria-invalid={state==="error"||state==="error-focus"?true:undefined} aria-describedby={state==="error"||state==="error-focus"?`${prefix}-${theme}-err`:undefined} data-tcrn-preview-state={state==="hover"||state==="focus"||state==="error-focus"?state:undefined}/><span className="tcrn-doc-hint">{c.hint}</span></label>)}</div>
  <p id={`${prefix}-${theme}-err`} className="tcrn-doc-error" data-primary-input-error=""><Icon name="alert-triangle" size="sm"/><span className="tcrn-doc-error__text">{c.error}</span></p>
  <Row>{(["sm","md","lg"] as const).map(size=><Input key={size} aria-label={`${c.name} ${size}`} className={`tcrn-input--${size}`} placeholder={c.project}/>)}</Row>
  <label className="tcrn-doc-label">Textarea<Textarea aria-label={c.name} defaultValue={c.body}/></label>
  {(["default","hover","focus","sm"] as const).map((state,index)=><SearchInput key={state} aria-label={`${c.search} ${state}`} placeholder={c.search} defaultValue={state==="focus"?c.project:undefined} className={state==="sm"?"tcrn-input--sm":undefined} shortcut="auto" fill={state!=="sm"} data-tcrn-preview-state={state==="hover"||state==="focus"?state:undefined} data-published-shortcut-key={`06-inputs:shortcut:${(theme==="dark"?4:0)+index+1}`} data-published-shortcut-state={state}/>)}
  <label className="tcrn-doc-label">SuggestInput<SuggestInput aria-label={c.name} suggestions={[c.project,c.contracts,c.members]} placeholder={c.name}/></label>
  <label className="tcrn-doc-label">Select<Select aria-label={c.status} options={[{value:"",label:c.empty,disabled:true},...options]} defaultValue="review"/></label>
  <div className="tcrn-doc-grid">{(["dropdown","native","checkboxes"] as const).map(presentation=><label key={presentation} className="tcrn-doc-label">MultiSelect · {presentation}<MultiSelect aria-label={`${c.project} ${presentation}`} options={options} defaultValue={["review"]} presentation={presentation} emptySelectionLabel={c.empty} clearSelectionLabel={c.clear}/></label>)}</div>
  <Row><label className="tcrn-doc-label">{c.seat}<NumberInput aria-label={c.seat} min={1} max={120} defaultValue={24}/></label><label className="tcrn-doc-label">{c.day}<DatePicker aria-label={c.day} defaultValue="2026-10-20"/></label></Row>
  <Row><label><Checkbox defaultChecked/>{c.notify}</label><label><Checkbox aria-invalid="true"/>{c.required}</label><label><Checkbox disabled disabledReason={c.unavailable}/>{c.notify}</label></Row>
  <RadioGroup legend={c.status} name={`${prefix}-${theme}-visibility`} defaultValue="team" options={[{value:"public",label:c.public},{value:"team",label:c.team,description:c.hint},{value:"private",label:c.private}]}/>
  <Switch label={c.notify} description={c.hint} defaultChecked/><Switch label={c.notify} className="tcrn-switch--sm" defaultChecked/>
  </>}</Themes>;}

export function rosterGroups(locale:DocsLocale,href:(id:string)=>string=(id)=>`#${id}`):ProductShellNavGroup[]{const c=docsCopy(locale);return [
 {id:"people",label:c.people,items:[{id:"roster",label:c.roster,href:href("roster"),iconName:"users",selected:true},{id:"teams",label:c.group,href:href("teams"),iconName:"layers"},{id:"contracts",label:c.contracts,iconName:"book-open",children:[{id:"contract-list",label:c.contractList,href:href("contract-list")},{id:"templates",label:c.templates,children:[{id:"agreement",label:c.agreement,href:href("agreement")},{id:"agency",label:c.agentAgreement,href:href("agency")},{id:"event-contract",label:c.eventAgreement,href:href("event-contract")},{id:"nda",label:c.nda,href:href("nda")}]},{id:"approval",label:c.approval,href:href("approval")},{id:"reminders",label:c.reminders,href:href("reminders")}]},{id:"settlements",label:c.settlements,href:href("settlements"),iconName:"database"}]},
 {id:"operations",label:c.operations,items:[{id:"schedule",label:c.schedule,iconName:"calendar",children:[{id:"schedule-week",label:c.schedule,href:href("schedule-week")}]},{id:"live",label:c.live,href:href("live"),iconName:"globe-2"},{id:"events",label:c.events,href:href("events"),iconName:"package"},{id:"reports",label:c.reports,href:href("reports"),iconName:"layout-grid"}]},
 {id:"system",label:c.system,items:[{id:"members",label:c.members,href:href("members"),iconName:"users"},{id:"permissions",label:c.permissions,href:href("permissions"),iconName:"shield-check"},{id:"settings",label:c.settings,href:href("settings"),iconName:"settings"},{id:"audit",label:c.audit,href:href("audit"),iconName:"history"}]}
 ];}

function Roster({locale}:{locale:DocsLocale}) {const c=docsCopy(locale);const [selected,setSelected]=useState("all");return <Tabs label={c.roster} selectedId={selected} onSelect={setSelected} items={[{id:"all",label:`${c.all} 24`},{id:"signed",label:`${c.signed} 18`},{id:"trial",label:`${c.trial} 4`},{id:"pending",label:`${c.pending} 3`}]}>
  <table className="tcrn-doc-table tcrn-doc-roster-table" aria-label={c.roster}><thead><tr>{[c.people,c.group,c.status,c.expiry,c.updated].map(label=><th key={label}>{label}</th>)}</tr></thead><tbody>{[
    {name:"星野ひかり",group:`A ${c.group}`,status:c.signed,expiry:"2027-03-31",updated:c.today},
    {name:"白石ゆい",group:`A ${c.group}`,status:c.signed,expiry:"2026-12-31",updated:c.yesterday},
    {name:"Mika Lindqvist",group:`B ${c.group}`,status:c.trial,expiry:"—",updated:c.twoDays},
    {name:"陈嘉怡",group:`B ${c.group}`,status:c.signed,expiry:"2027-06-30",updated:c.threeDays},
    {name:"小鳥遊そら",group:`A ${c.group}`,status:c.signed,expiry:"2027-01-15",updated:c.lastWeek},
    {name:"Léa Moreau",group:`C ${c.group}`,status:c.pending,expiry:"—",updated:c.lastWeek},
    {name:"김하늘",group:`C ${c.group}`,status:c.trial,expiry:"—",updated:c.lastWeek},
    {name:"Aria Vance",group:`B ${c.group}`,status:c.signed,expiry:"2026-11-30",updated:c.twoWeeks}
  ].map((row,i)=><tr key={row.name} aria-selected={i===7}><td title={row.name}><b className="tcrn-doc-roster-name">{row.name}</b> <span className="tcrn-doc-handle">{["hoshino","shiraishi","mika","chen","takanashi","lea","kim","aria"][i]}</span></td><td>{row.group}</td><td><span className={row.status===c.signed?"tcrn-doc-status tcrn-doc-status--ok":row.status===c.trial?"tcrn-doc-status tcrn-doc-status--warn":"tcrn-doc-status"}><i/>{row.status}</span></td><td className="tcrn-doc-date">{row.expiry}</td><td>{row.updated}</td></tr>)}</tbody></table>
  </Tabs>;}
const shellModes = ["band", "menu", "drop", "phone-closed", "phone"] as const;

export function ShellExample({
  locale, mode, theme = "light", shortcut = false, glimpse = false, intro = false
}: {
  locale: DocsLocale;
  mode: (typeof shellModes)[number];
  theme?: "light" | "dark";
  shortcut?: boolean;
  glimpse?: boolean;
  intro?: boolean;
}) {
  const [shownLocale, setShownLocale] = useState(locale);
  const [shownTheme, setShownTheme] = useState(theme);
  const [localeMenuOpen, setLocaleMenuOpen] = useState(false);
  useEffect(() => setShownLocale(locale), [locale]);
  useEffect(() => setShownTheme(theme), [theme]);
  const c = docsCopy(shownLocale);
  const [menuOpen, setMenuOpen] = useState<boolean>();
  const [openPin, setOpenPin] = useState<string | null>();
  const [pins, setPins] = useState<readonly string[]>(["roster", "contracts", "settlements", "schedule"]);
  const frameRef = useRef<HTMLDivElement>(null);
  const frameId = useId();
  const [original, setOriginal] = useState(false);
  const phone = mode.startsWith("phone");
  const shellTheme = glimpse ? theme : shownTheme;
  const labels = specimenCopy[locale];
  const { shell: sceneCopy } = labels;
  const dimensions = `${phone ? 390 : 1240} × 640 px`;
  const contentId = glimpse ? `roster-${locale}-${mode}-${theme}` : `roster-${frameId}`;
  // Until the first open/close request, show the authored scene without moving the reader's focus.
  const previewMenu = menuOpen === undefined && (mode === "menu" || mode === "phone");
  const previewDrop = openPin === undefined && mode === "drop";

  const shell = (
    <shellMenuPresentationContext.Provider value={phone ? "sheet" : "panel"}>
      <ProductShell
        productName="TCRN TMS"
        moduleName={c.roster}
        brandProductId="tms"
        currentRouteLabel={c.roster}
        navGroups={rosterGroups(shownLocale)}
        locales={tcrnLocaleMetadata}
        currentLocale={shownLocale}
        currentTheme={shellTheme}
        localeMenuOpen={localeMenuOpen}
        onLocaleMenuOpenChange={setLocaleMenuOpen}
        onThemeChange={setShownTheme}
        onLocaleChange={next => {
          const allowed = supportedLocales.find(l => l === next);
          if (allowed) setShownLocale(allowed);
        }}
        previewStates={{teams: "hover", settlements: "hover", templates: "open"}}
        pageHeader={{
          title: c.roster,
          breadcrumbs: [{id: "people", label: c.people, href: "#people"}, {id: "roster", label: c.roster}],
          actions: <><Button size="sm">{c.export}</Button><Button variant="primary" size="sm"><Icon name="plus" size="sm"/>{c.invite}</Button></>,
          headingLevel: 2,
          meta: <span className="tcrn-doc-shell-sub">24 · 3 {c.pending}</span>
        }}
        account={{name: "林晓", initials: "林"}}
        notifications={{unread: 3}}
        products={[{id: "tms", label: "TCRN TMS", href: `#${contentId}`, current: true}]}
        pinnedIds={pins}
        onPinnedChange={(id, pinned) => setPins(pinned ? [...pins, id] : pins.filter(p => p !== id))}
        onPinsReorder={setPins}
        menuOpen={menuOpen ?? previewMenu}
        onMenuOpenChange={setMenuOpen}
        openPinId={previewDrop ? "contracts" : openPin ?? null}
        onOpenPinChange={setOpenPin}
        focusNavigationOnOpen={!previewMenu && !previewDrop}
        dropdownBoundaryRef={glimpse || phone ? undefined : frameRef}
        menuShortcut={shortcut}
        landmarkLabel={`${c.roster} ${mode} ${theme}`}
        contentId={contentId}
      >
        <Roster locale={shownLocale}/>
      </ProductShell>
    </shellMenuPresentationContext.Provider>
  );

  if (glimpse) return <div className="portal-shell-fragment" data-phone={phone ? "" : undefined} data-shell-theme={theme}>{shell}</div>;

  return <div className="tcrn-doc-shell-example" data-phone={phone ? "" : undefined}>
    <div className="tcrn-doc-shell-tools">
      <span>{dimensions}</span>
      <Button
        variant="secondary"
        aria-controls={frameId}
        data-doc-shell-view-toggle=""
        // Changing the viewing scale is part of inspecting the current open state.
        onPointerDown={event => event.stopPropagation()}
        onClick={() => setOriginal(value => !value)}
      >{original ? sceneCopy.fit : sceneCopy.original}</Button>
    </div>
    {original && <Text id={`${frameId}-pan`} size="meta">{sceneCopy.pan}</Text>}
    <div
      id={frameId}
      ref={frameRef}
      className="tcrn-doc-shell-frame"
      role="region"
      aria-label={`${intro ? sceneCopy.intro : sceneCopy[mode]} · ${labels.themes[shellTheme]} · ${dimensions}`}
      aria-describedby={original ? `${frameId}-pan` : undefined}
      tabIndex={original ? 0 : undefined}
      data-phone={phone ? "" : undefined}
      data-formal-shell-scene={mode}
      data-shell-theme={shellTheme}
      data-specimen-view={original ? "original" : "fit"}
    >{shell}</div>
  </div>;
}

function Intro({locale, theme}: {locale: DocsLocale; theme: "light" | "dark"}) {
  const c = docsCopy(locale);
  const labels = specimenCopy[locale];
  const ref = useRef<HTMLElement>(null);
  const [start, setStart] = useState(false);
  return <section ref={ref} className="tcrn-doc-section" data-formal-intro="" data-intro-theme={theme} data-tcrn-theme={theme}>
    <Heading level={2} visualLevel={3}>{labels.shell.intro} · {labels.themes[theme]}</Heading>
    <Text>{c.intro}</Text>
    <Button className="tcrn-doc-intro-start" variant="quiet" onClick={() => setStart(true)}>{c.login}</Button>
    <ShellExample locale={locale} mode="band" theme={theme} intro/>
    {start && <ShellIntro productId="tms" locale={locale} shellRef={ref}
      card={<ProductLockup productId="tms" locale={locale} className="tcrn-doc-intro-lockup"/>}
      sessionMarker="tcrn-approved-source-intro" onFinish={() => setStart(false)}/>}
  </section>;
}

function ShellScenes({locale, showMarks = false, shortcutOwner = false}: {
  locale: DocsLocale; showMarks?: boolean; shortcutOwner?: boolean;
}) {
  const labels = specimenCopy[locale];
  return <>{themes.map(theme => <section key={theme} data-tcrn-theme={theme} className="tcrn-doc-section" data-doc-shell-theme={theme}>
    <Heading level={2} visualLevel={3}>{labels.themes[theme]}</Heading>
    {showMarks && <Section name="shell-marks" title={labels.shell.marks}>
      <Row>
        {(["v1", "v2"] as const).map(version => <ShellBrandButton key={version} productId="tms" version={version} locale={locale} data-standalone-brand=""/>)}
        <ProductLockup productId="tms" locale={locale}/>
        <ProductLockup productId="tms" locale={locale} scale="rail"/>
      </Row>
    </Section>}
    {shellModes.map(mode => <Section key={mode} name={mode} title={labels.shell[mode]}>
      <ShellExample locale={locale} mode={mode} theme={theme} shortcut={shortcutOwner && mode === "band" && theme === "light"}/>
    </Section>)}
  </section>)}</>;
}

function ShellUpper({locale, shortcutOwner = false}: {locale: DocsLocale; shortcutOwner?: boolean}) {
  return <>
    <ShellScenes locale={locale} shortcutOwner={shortcutOwner} showMarks/>
    {themes.map(theme => <Intro key={theme} locale={locale} theme={theme}/>)}
  </>;
}

function ShellLower({locale, shortcutOwner = false}: {locale: DocsLocale; shortcutOwner?: boolean}) {
  return <>
    <section className="tcrn-doc-section" data-doc-shell-geometry="">
      <Heading level={2} visualLevel={3}>{specimenCopy[locale].shell.geometry}</Heading>
      <div className="tcrn-doc-prose">
        <Text>52 · (12, 6) · 134 × 40 · 22 + 20 / 16 · 32 · 8 · 952 · 240 + 4 · 6 · 1024</Text>
        <Text>global Y = 26 · pins local Y = 20</Text>
      </div>
    </section>
    {/* The phone strip and Sheet in 07b's contract use the same scenes as 07a. */}
    <ShellScenes locale={locale} shortcutOwner={shortcutOwner}/>
    <Text>{docsCopy(locale).summaries[7]}</Text>
  </>;
}
export function BoardSpecimens({board,locale,apiHref="#api",shortcutOwner=false}:{board:ApprovedBoardId;locale:DocsLocale;apiHref?:string;shortcutOwner?:boolean}) {switch(board){case"01-tokens":return <Tokens locale={locale}/>;case"02-typography":return <Typography locale={locale} apiHref={apiHref}/>;case"03-icons":return <Icons locale={locale}/>;case"04-brand":return <Brand locale={locale}/>;case"05-actions":return <Actions locale={locale} apiHref={apiHref}/>;case"06-inputs":return <Inputs locale={locale}/>;case"07a-shell-upper":return <ShellUpper locale={locale} shortcutOwner={shortcutOwner}/>;case"07b-shell-lower":return <ShellLower locale={locale} shortcutOwner={shortcutOwner}/>;}}
export const formalBoardSource=(id:ApprovedBoardId)=>approvedSource.boards.find(b=>b.slug===id)!;
