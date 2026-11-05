import { Heading,Text } from "@tcrn/ui-react/approved";
import { approvedApi } from "./approved-api.js";
import { approvedSource, type ApprovedBoardId, type DocsLocale } from "./approved-source.js";
import { pageHref, type DocsEntry } from "./portal-navigation.js";
const labels={"zh-CN":["正式原文：须提供、何时用与不用、行为","用法示例"],en:["Normative original: required inputs, use, exclusions and behavior","Usage example"],ja:["規範原文：必須入力・用途・禁止・動作","使用例"],ko:["규범 원문: 필수 입력·용도·제외·동작","사용 예"],fr:["Original normatif : exigences, usages, exclusions et comportement","Exemple d’utilisation"]};
export function ApiReference({locale,board,entry="static"}:{locale:DocsLocale;board?:ApprovedBoardId;entry?:DocsEntry}){
 return <div data-published-api-reference="">{approvedApi.filter(api=>!board||api.board===board).map(api=><section id={`api-${api.name}`} key={api.name} className="tcrn-doc-api" data-approved-api={api.name} data-api-board={api.board}><Heading level={2} visualLevel={3}>{api.name}</Heading><Text data-api-summary="" lang={locale}>{api.summary[locale]}</Text><code className="tcrn-doc-code">{api.props.join(" · ")}</code><p>{labels[locale][1]}</p><pre className="tcrn-doc-code" data-api-example="">{api.example}</pre><details><summary>{labels[locale][0]}</summary><p lang="zh-CN" data-api-formal="">{api.formal}</p></details><a className="tcrn-link" href={board&&entry==="manager"?approvedSource.site.url:pageHref(locale,api.board,entry)}>{api.board} / L{api.line}</a></section>)}</div>;
}
