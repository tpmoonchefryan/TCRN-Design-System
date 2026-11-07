import type { IconName, ShellMenuGroup } from "@tcrn/ui-react/approved";
import { apiReaderProps, approvedApi } from "./approved-api.js";
import { approvedSource, type ApprovedBoardId, type DocsLocale } from "./approved-source.js";
import { docsCopy } from "./locales.js";
import { portalCopy } from "./portal-copy.js";

export type DocsPage = ApprovedBoardId | "index" | "api";
export type DocsEntry = "static" | "canvas" | { managerPath: string };

const managerStories = {
  index: "home",
  "01-tokens": "tokens",
  "02-typography": "typography",
  "03-icons": "icons",
  "04-brand": "brand",
  "05-actions": "actions",
  "06-inputs": "inputs",
  "07a-shell-upper": "shell-upper",
  "07b-shell-lower": "shell-lower",
  api: "api",
} satisfies Record<DocsPage, string>;

const storyId = (page: DocsPage) => `published-standards--${managerStories[page]}`;

export function pageHref(locale: DocsLocale, page: DocsPage, entry: DocsEntry = "static", fragment = ""): string {
  const hash = fragment ? `#${fragment}` : "";
  if (entry === "static") return `/${locale}/${page}.html${hash}`;
  const id = storyId(page);
  if (entry === "canvas") return `/iframe.html?id=${id}&viewMode=story&globals=locale:${locale}${hash}`;
  // Manager 10.4.6 appends globals after the route hash. Forward the fragment as a story-scoped query instead.
  const anchor = fragment ? `&docsAnchor=${id}:${encodeURIComponent(fragment)}` : "";
  return `${entry.managerPath}?path=/story/${id}&globals=locale:${locale}${anchor}`;
}

export function managerFragment(page: DocsPage, search: string): string {
  const value = new URLSearchParams(search).get("docsAnchor");
  const prefix = `${storyId(page)}:`;
  return value?.startsWith(prefix) ? value.slice(prefix.length) : "";
}

const topics = [
  { id: "foundations", iconName: "palette", chapters: ["01-tokens", "02-typography", "03-icons"] },
  { id: "brand", iconName: "layout-grid", chapters: ["04-brand"] },
  { id: "components", iconName: "check", chapters: ["05-actions", "06-inputs", "api"] },
  { id: "shell", iconName: "layers", chapters: ["07a-shell-upper", "07b-shell-lower"] },
] as const satisfies readonly { id: string; iconName: IconName; chapters: readonly [ApprovedBoardId, ...DocsPage[]] }[];
type DocsMenuItem = ShellMenuGroup["items"][number];

export function docsNavigation(locale: DocsLocale, entry: DocsEntry) {
  const labels = docsCopy(locale);
  const copy = portalCopy[locale];
  const link = (page: DocsPage, label: string, iconName: IconName) => ({ id: page, label, iconName, href: pageHref(locale, page, entry) });
  const home = link("index", copy.home, "home");
  const api = link("api", labels.api, "package");
  const chapters = approvedSource.boards.map((board, index) => link(board.slug, labels.boardTitles[index], "book-open"));
  const apiOverview = { ...api, id: "api", label: portalCopy[locale].overview };
  const apiAnchors: DocsMenuItem[] = approvedApi.map(component => ({
    id: `api-${component.name}`,
    label: component.name,
    href: pageHref(locale, "api", entry, `api-${component.name}`),
  }));
  const apiBranch: DocsMenuItem = {
    ...api,
    id: "api-branch",
    children: [apiOverview, ...apiAnchors],
  };
  const byPage = new Map([...chapters, api, home].map(chapter => [chapter.id, chapter]));
  const cards = topics.map(({ id, iconName, chapters }) => {
    const [label, description] = copy.topics[id];
    return { topic: id, ...link(chapters[0], label, iconName), description, chapters: chapters.map(page => byPage.get(page)!) };
  });
  const categories = cards.map(card => ({
    id: card.topic,
    label: card.label,
    href: card.href,
    pageId: card.id,
    items: card.chapters.map(chapter => chapter.id === "api" ? apiBranch : chapter),
  }));
  const directory: ShellMenuGroup[] = [
    { id: "portal", label: labels.title, items: [home] },
    ...categories.map(category => ({ id: category.id, label: category.label, items: category.items })),
  ];
  return { home, cards, categories, directory, byPage };
}

export function searchDocs(locale: DocsLocale, query: string, entry: DocsEntry = "static", page?: DocsPage) {
  const labels = docsCopy(locale);
  const term = query.trim().normalize("NFKC").toLocaleLowerCase(locale);
  if (!term) return [];
  const inManager = typeof entry === "object";
  const records = [
    ...approvedSource.boards.map((board, index) => ({
      id: board.slug, title: labels.boardTitles[index], meta: labels.summaries[index],
      href: pageHref(locale, board.slug, entry), keywords: board.slug,
    })),
    ...approvedApi.map(api => ({
      id: `api-${api.name}`, title: api.name, meta: labels.api,
      href: inManager && page === api.board
        ? `#api-${api.name}`
        : pageHref(locale, entry === "static" ? "api" : api.board, entry, `api-${api.name}`),
      keywords: apiReaderProps(api).join(" "),
    })),
  ];
  return records.filter(record => `${record.title} ${record.meta} ${record.keywords}`.normalize("NFKC").toLocaleLowerCase(locale).includes(term))
    .map(({ keywords: _keywords, ...record }) => record);
}
