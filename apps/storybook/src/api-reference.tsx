import { Heading, Text } from "@tcrn/ui-react/approved";
import { apiReaderDetails, apiReaderProps, apiReaderSummary, approvedApi } from "./approved-api.js";
import { approvedSource, type ApprovedBoardId, type DocsLocale } from "./approved-source.js";
import { ComponentOverview } from "./component-overview.js";
import { componentUsage } from "./component-usage.js";
import { componentFamily, componentLayouts } from "./component-layout.js";
import type { FormalComponentName } from "./component-catalog.js";
import { docsCopy } from "./locales.js";
import { pageHref, type DocsEntry } from "./portal-navigation.js";

const labels = {
  "zh-CN": { details: "要求、用途与行为", usage: "用法示例", examples: "交互示例" },
  en: { details: "Requirements, use and behavior", usage: "Usage example", examples: "Interactive examples" },
  ja: { details: "要件・用途・動作", usage: "使用例", examples: "操作例" },
  ko: { details: "요구 사항, 용도 및 동작", usage: "사용 예", examples: "인터랙션 예시" },
  fr: { details: "Exigences, usages et comportement", usage: "Exemple d’utilisation", examples: "Exemples interactifs" },
};

export function ApiReference({ locale, board, entry = "static" }: {
  locale: DocsLocale;
  board?: ApprovedBoardId;
  entry?: DocsEntry;
}) {
  const copy = labels[locale];
  const titles = docsCopy(locale).boardTitles;
  const apis = approvedApi.filter(api => !board || api.board === board);
  return (
    <div data-published-api-reference="">
      {apis.map(api => (
        <section id={`api-${api.name}`} key={api.name} className="tcrn-doc-api" data-approved-api={api.name} data-api-board={api.board}>
          <Heading level={2} visualLevel={3}>{api.name}</Heading>
          <Text data-api-summary="" lang={locale}>{apiReaderSummary(api, locale)}</Text>
          <code className="tcrn-doc-code">{apiReaderProps(api).join(" · ")}</code>
          <Text size="meta" lang="en">{componentFamily(api.name as FormalComponentName)} · {componentLayouts[api.name as FormalComponentName].sizing}: {componentLayouts[api.name as FormalComponentName].constraint}</Text>
          <details><summary>{copy.usage}</summary>
            <pre className="tcrn-doc-code" data-api-example="">{componentUsage(api.name as FormalComponentName)}</pre>
          </details>
          <details data-shared-component-example="">
            <summary>{copy.examples}</summary>
            <ComponentOverview name={api.name as FormalComponentName} locale={locale} />
          </details>
          <details>
            <summary>{copy.details}</summary>
            <p lang="zh-CN" data-api-formal="">{apiReaderDetails(api.name, api.formal)}</p>
          </details>
          {!board && (
            <a className="tcrn-link" href={pageHref(locale, api.board, entry)}>
              {copy.examples} · {titles[approvedSource.boards.findIndex(item => item.slug === api.board)]}
            </a>
          )}
        </section>
      ))}
      {!board && <section id="adopted-support" className="tcrn-doc-api" lang="en">
        <Heading level={2} visualLevel={3}>Adopted support · awaiting publication</Heading>
        <Text>Customer table/cards, pagination, five business states, confirmation and product locale copy: Owner-adopted under minutes:6f3e0a9a1e07e3980867d82e#D2. Formal source publication is deferred; the 28-component catalogue and five built-in locales remain unchanged.</Text>
        <a className="tcrn-link" href="/ai/4.0.0/pattern/customer-list-boundary.json">Customer list support contract</a>
      </section>}
    </div>
  );
}
