import { Heading } from "@tcrn/ui-react/approved";
import { approvedApi } from "./approved-api.js";
import { approvedSource,type ApprovedBoardId,type DocsLocale } from "./approved-source.js";
export function ApiReference({locale,board,linkMode="local"}:{locale:DocsLocale;board?:ApprovedBoardId;linkMode?:"local"|"formal"}){
 return <div data-published-api-reference="">{approvedApi.filter(api=>!board||api.board===board).map(api=><section id={`api-${api.name}`} key={api.name} className="tcrn-doc-api" data-approved-api={api.name} data-api-board={api.board}><Heading level={2} visualLevel={3}>{api.name}</Heading><code className="tcrn-doc-code">{api.props.join(" · ")}</code><a className="tcrn-link" href={linkMode==="local"?`/${locale}/${api.board}.html`:approvedSource.site.url}>{api.board} / L{api.line}</a></section>)}</div>;
}
