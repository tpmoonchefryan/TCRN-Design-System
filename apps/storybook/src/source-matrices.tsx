import { Heading,Text,Highlight,Icon,Button,IconButton,Input,SearchInput,NumberInput,DatePicker,Select,MultiSelect,Checkbox,RadioGroup,Switch,type IconName } from "@tcrn/ui-react/approved";
import { approvedMatrixOccurrences,type ApprovedMatrixOccurrence } from "./contract-stories/gplus/generated/matrices.generated.js";
import type { ApprovedBoardId,DocsLocale } from "./approved-source.js";
import { docsCopy } from "./locales.js";

// Every first-family source occurrence is represented by the actual package control.
// Source identifiers are discovery hooks, never a candidate-provided contrast oracle.
function Probe({cell,locale}:{cell:ApprovedMatrixOccurrence;locale:DocsLocale}){
  const c=docsCopy(locale),id=cell.cellId.replace(/-[ln]$/,""),p={"data-source-cell-key":cell.key,"data-source-cell-id":cell.cellId,"data-source-probe":cell.probe};
  if(cell.board==="02-typography"){
    if(/^h[1-4]$/.test(id))return <Heading {...p} level={Number(id[1]) as 1|2|3|4}>{c.project}</Heading>;
    if(id==="mark")return <Text><span {...p} data-source-probe-target=".tcrn-highlight__mark"><Highlight text="PRJ-2026-0412" query="2026"/></span></Text>;
    if(id==="sel")return <div {...p} className="tcrn-doc-selected-row"><Highlight text="PRJ-2026-0412" query="2026"/></div>;
    if(id==="unit")return <Text variant="numeral">128<small {...p}>{c.seat}</small></Text>;
    if(id==="num"||id==="num-inl")return <Text {...p} variant="numeral" className={id==="num-inl"?"tcrn-text--numeral-inline":undefined}>4,280.00</Text>;
    if(id==="caps")return <Text {...p} variant="caps"><b>01</b>{c.name}</Text>;
    if(id==="id")return <Text {...p} className="tcrn-text--mono">PRJ-2026-0412</Text>;
    if(id.startsWith("link"))return <a {...p} className={`tcrn-link${id==="link-hover"?" is-hover":""}`} href="#api">{c.invoice}</a>;
    return <Text {...p} tone={id.startsWith("strong")?"strong":undefined} size={id.startsWith("meta")?"meta":id==="cap"?"caption":id==="read"?"reading":undefined} data-standard-conflict={id.startsWith("strong")?"K5":undefined}>{id.startsWith("strong")?c.strong:c.body}</Text>;
  }
  if(cell.board==="03-icons"){
    const role=id.split("-")[0],ink=role==="onacc"?"on-acc":role==="ink2"?"ink-2":role==="ink3"||id==="dis"?"ink-3":role==="roster"?"ink-2":role;
    const bg=id==="onacc-acc"?"acc":id==="ink-wash"?"wash":id==="dis"?"dis":id.endsWith("bg")?"bg":"panel";
    return <span style={{display:"inline-flex",color:`var(--tcrn-color-${ink})`,background:`var(--tcrn-color-${bg})`}}><Icon {...p} name="layers" size="md"/></span>;
  }
  if(cell.board==="05-actions"){
    if(id.startsWith("cb-")){const state=id.slice(3);const labels={idle:c.copy,copying:c.copyBusy,copied:c.copied,failed:c.failed,unsupported:c.unsupported};const icons:{[key:string]:IconName}={idle:"copy",copying:"loader-circle",copied:"check",failed:"alert-triangle",unsupported:"info"};return <Button {...p} variant="secondary" size="sm" aria-busy={state==="copying"?true:undefined} data-clipboard-copy-state={state}><Icon name={icons[state]} size={13}/>{labels[state as keyof typeof labels]}</Button>;}
    if(id==="grp-sel")return <Button {...p} variant="secondary" aria-pressed="true">{c.all}</Button>;
    const isIcon=id.startsWith("ico-"),[short,state]=(isIcon?id.slice(4):id).split("-"),variant=short==="pri"?"primary":short==="sec"?"secondary":short==="danger"?"danger":"quiet";
    const props={...p,variant,disabled:state==="x",disabledReason:c.unavailable,loading:state==="l","aria-pressed":state==="s"?true:undefined,"data-tcrn-preview-state":state==="h"?"hover":state==="a"?"active":state==="f"?"focus":undefined} as const;
    return isIcon?<IconButton {...props} ariaLabel={c.settings} iconName="settings"/>:<Button {...props}>{state==="l"?c.loading:c.save}</Button>;
  }
  if(cell.board==="06-inputs"){
    if(id==="err-msg")return <span {...p} className="tcrn-doc-error"><Icon name="alert-triangle" size="sm"/>{c.error}</span>;
    if(id.startsWith("in-"))return <Input {...p} aria-label={`${c.name} ${cell.key}`} placeholder={id==="in-ph"?c.project:undefined} defaultValue={id==="in-ph"?undefined:c.project} readOnly={id==="in-ro"} disabled={id==="in-dis"} disabledReason={c.unavailable} aria-invalid={id==="in-err"?true:undefined} data-tcrn-preview-state={id==="in-focus"?"focus":undefined}/>;
    if(id.startsWith("search-"))return <SearchInput {...p} aria-label={c.search} placeholder={c.search} defaultValue={id==="search-focus"?c.project:undefined} className={id==="search-ph"?"tcrn-input--sm":undefined} shortcut="auto" data-tcrn-preview-state={id==="search-focus"?"focus":undefined}/>;
    if(id==="chev")return <span {...p} data-source-probe-target=".tcrn-select-wrap__icon"><Select aria-label={c.status} options={[{value:"team",label:c.team}]}/></span>;
    if(id==="opt-sel")return <div {...p} data-source-open-control=".tcrn-multi-select-dropdown__trigger" data-source-probe-target="body .tcrn-multi-select-dropdown__option[aria-selected=true]"><MultiSelect aria-label={`${c.project} ${cell.key}`} presentation="dropdown" options={[{value:"review",label:c.project}]} defaultValue={["review"]} emptySelectionLabel={c.empty}/></div>;
    if(id==="num")return <NumberInput {...p} aria-label={c.seat} defaultValue={24}/>;
    if(id==="date"||id==="cal")return <span {...p} data-source-probe-target={id==="cal"?".tcrn-date-picker-wrap__icon":".tcrn-date-picker"}><DatePicker aria-label={c.day} defaultValue="2026-10-20"/></span>;
    if(id.startsWith("ck-"))return <Checkbox {...p} aria-label={c.notify} defaultChecked={id==="ck-on"||id==="ck-dis"} disabled={id==="ck-dis"} disabledReason={c.unavailable}/>;
    if(id.startsWith("rd-"))return <div {...p} data-source-probe-target=".tcrn-radio-group__control"><RadioGroup legend={c.status} name={cell.key} defaultValue={id==="rd-on"?"team":undefined} options={[{value:"team",label:c.team}]}/></div>;
    return <Switch {...p} label={c.notify} defaultChecked={id==="sw-on"}/>;
  }
  return null;
}
export function SourceMatrices({board,locale}:{board:ApprovedBoardId;locale:DocsLocale}){
  const cells=approvedMatrixOccurrences.filter(c=>c.board===board);
  if(!cells.length||board.startsWith("07"))return null;
  return <section className="tcrn-doc-section" data-published-matrix={board}><Heading level={2} visualLevel={3}>B · {board}</Heading><div className="tcrn-doc-grid">{cells.map(cell=><div key={cell.key} className="tcrn-doc-pane" data-tcrn-theme={cell.theme==="night"?"dark":"light"}><code>{cell.cellId}</code><div className={cell.cellId.includes("canvas")||cell.cellId.endsWith("-bg-l")||cell.cellId.endsWith("-bg-n")?undefined:"tcrn-doc-paper"}><Probe cell={cell} locale={locale}/></div></div>)}</div></section>;
}
