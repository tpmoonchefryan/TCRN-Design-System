import type { IconName, ShellMenuGroup, TcrnProductMarkId } from "@tcrn/ui-react/approved";
import { apiReaderProps, approvedApi } from "./approved-api.js";
import { approvedSource, type ApprovedBoardId, type DocsLocale } from "./approved-source.js";
import { componentFamily } from "./component-layout.js";
import type { FormalComponentName } from "./component-catalog.js";
import { docsCopy } from "./locales.js";
import { portalCopy, type ExtraDocsPageId } from "./portal-copy.js";

export type BrandProductPage =
  | "brand-tms"
  | "brand-einzbern"
  | "brand-mana-orchestrate"
  | "brand-design-system"
  | "brand-voxward"
  | "brand-platform";

export type DocsPage = ApprovedBoardId | "index" | "api" | ExtraDocsPageId;
export type DocsEntry = "static" | "canvas" | { managerPath: string };

export const brandProductPageMap: Readonly<Record<BrandProductPage, TcrnProductMarkId>> = Object.freeze({
  "brand-tms": "tms",
  "brand-einzbern": "einzbern",
  "brand-mana-orchestrate": "mana-orchestrate",
  "brand-design-system": "design-system",
  "brand-voxward": "voxward",
  "brand-platform": "platform",
});

export const productToBrandPage: Readonly<Record<TcrnProductMarkId, BrandProductPage>> = Object.freeze({
  tms: "brand-tms",
  einzbern: "brand-einzbern",
  "mana-orchestrate": "brand-mana-orchestrate",
  "design-system": "brand-design-system",
  voxward: "brand-voxward",
  platform: "brand-platform",
});

export const extraDocsPages: readonly { id: ExtraDocsPageId; iconName: IconName; keywords: string }[] = [
  { id: "seasonal-halloween", iconName: "palette", keywords: "seasonal halloween theme pumpkin tokens" },
  { id: "brand-tms", iconName: "layout-grid", keywords: "brand mark logo lockup tms" },
  { id: "brand-einzbern", iconName: "layout-grid", keywords: "brand mark logo lockup einzbern" },
  { id: "brand-mana-orchestrate", iconName: "layout-grid", keywords: "brand mark logo lockup mana orchestrate" },
  { id: "brand-design-system", iconName: "layout-grid", keywords: "brand mark logo lockup design system" },
  { id: "brand-voxward", iconName: "layout-grid", keywords: "brand mark logo lockup voxward" },
  { id: "brand-platform", iconName: "layout-grid", keywords: "brand mark logo lockup platform mother" },
  { id: "feedback-data", iconName: "check", keywords: "feedback data display badge status dot alert banner stat card avatar table toolbar pipeline payload" },
  { id: "layout-overlays", iconName: "check", keywords: "layout overlays surface divider settings split view collapsible segmented nav menu popover tooltip confirm" },
  { id: "public-site", iconName: "book-open", keywords: "public site header footer editorial article note legal policy brand icon github" },
  { id: "shell-extended", iconName: "layers", keywords: "shell voxward backoffice pins divider top banner external disabled seasonal" },
];

export const allDocsPages: readonly DocsPage[] = [
  "index",
  ...approvedSource.boards.map(board => board.slug),
  ...extraDocsPages.map(page => page.id),
  "api",
];

const managerStories = {
  index: "home",
  "01-tokens": "tokens",
  "02-typography": "typography",
  "03-icons": "icons",
  "seasonal-halloween": "seasonal-halloween",
  "04-brand": "brand",
  "brand-tms": "brand-tms",
  "brand-einzbern": "brand-einzbern",
  "brand-mana-orchestrate": "brand-mana-orchestrate",
  "brand-design-system": "brand-design-system",
  "brand-voxward": "brand-voxward",
  "brand-platform": "brand-platform",
  "05-actions": "actions",
  "06-inputs": "inputs",
  "feedback-data": "feedback-data",
  "layout-overlays": "layout-overlays",
  "public-site": "public-site",
  "07a-shell-upper": "shell-upper",
  "07b-shell-lower": "shell-lower",
  "shell-extended": "shell-extended",
  api: "api",
} satisfies Record<DocsPage, string>;

const storyId = (page: DocsPage) => `published-standards--${managerStories[page]}`;

export function isBrandProductPage(page: DocsPage): page is BrandProductPage {
  return Object.hasOwn(brandProductPageMap, page);
}

export function isExtraDocsPage(page: DocsPage): page is ExtraDocsPageId {
  return extraDocsPages.some(entry => entry.id === page);
}

export function pageHref(locale: DocsLocale, page: DocsPage, entry: DocsEntry = "static", fragment = ""): string {
  const hash = fragment ? `#${fragment}` : "";
  if (entry === "static") return `/${locale}/${page}.html${hash}`;
  const id = storyId(page);
  if (entry === "canvas") return `?id=${id}&viewMode=story&globals=locale:${locale}${hash}`;
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
  { id: "foundations", iconName: "palette", chapters: ["01-tokens", "02-typography", "03-icons", "seasonal-halloween"] },
  {
    id: "brand",
    iconName: "layout-grid",
    chapters: ["04-brand", "brand-tms", "brand-einzbern", "brand-mana-orchestrate", "brand-design-system", "brand-voxward", "brand-platform"],
  },
  { id: "components", iconName: "check", chapters: ["05-actions", "06-inputs", "feedback-data", "layout-overlays", "public-site", "api"] },
  { id: "shell", iconName: "layers", chapters: ["07a-shell-upper", "07b-shell-lower", "shell-extended"] },
] as const satisfies readonly { id: string; iconName: IconName; chapters: readonly [ApprovedBoardId, ...DocsPage[]] }[];
type DocsMenuItem = ShellMenuGroup["items"][number];

export function docsNavigation(locale: DocsLocale, entry: DocsEntry) {
  const labels = docsCopy(locale);
  const copy = portalCopy[locale];
  const link = (page: DocsPage, label: string, iconName: IconName) => ({ id: page, label, iconName, href: pageHref(locale, page, entry) });
  const home = link("index", copy.home, "home");
  const api = link("api", labels.api, "package");
  const chapters = approvedSource.boards.map((board, index) => link(board.slug, labels.boardTitles[index], "book-open"));
  const extraChapters = extraDocsPages.map(({ id, iconName }) => link(id, copy.extraPages[id].title, iconName));
  const apiOverview = { ...api, id: "api", label: portalCopy[locale].overview };
  const apiAnchors: DocsMenuItem[] = approvedApi.map(component => ({
    id: `api-${component.name}`,
    label: component.name,
    href: pageHref(locale, "api", entry, `api-${component.name}`),
  }));
  const apiBranch: DocsMenuItem = {
    ...api,
    id: "api-branch",
    children: [apiOverview, ...approvedSource.boards.flatMap(board => {
      const members = approvedApi.filter(component => component.board === board.slug);
      return members.length ? [{
        id: `api-family-${board.slug}`, label: `${componentFamily(members[0].name as FormalComponentName)} · ${board.title}`,
        children: apiAnchors.filter(anchor => members.some(member => anchor.id === `api-${member.name}`)),
      }] : [];
    }), { id: "api-adopted-support", label: "Adopted support · awaiting publication", href: pageHref(locale, "api", entry, "adopted-support") }],
  };
  const byPage = new Map([...chapters, ...extraChapters, api, home].map(chapter => [chapter.id, chapter]));
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
  const copy = portalCopy[locale];
  const term = query.trim().normalize("NFKC").toLocaleLowerCase(locale);
  if (!term) return [];
  const inManager = typeof entry === "object";
  const records = [
    ...approvedSource.boards.map((board, index) => ({
      id: board.slug, title: labels.boardTitles[index], meta: labels.summaries[index],
      href: pageHref(locale, board.slug, entry), keywords: board.slug,
    })),
    ...extraDocsPages.map(({ id, keywords }) => ({
      id, title: copy.extraPages[id].title, meta: copy.extraPages[id].summary,
      href: pageHref(locale, id, entry), keywords: `${id} ${keywords}`,
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

/** Resolve stable preference IDs against the current locale/routes, including
 * groups and descendants. */
export function docsPinnedNavigation(groups: readonly ShellMenuGroup[], ids: readonly string[]) {
  const targets = new Map<string, { id: string; label: string; href?: string; items: readonly DocsMenuItem[] }>();
  const visit = (items: readonly DocsMenuItem[]) => {
    for (const item of items) {
      targets.set(item.id, { id: item.id, label: item.label, ...(item.href ? { href: item.href } : {}), items: item.children ?? [] });
      if (item.children) visit(item.children);
    }
  };
  for (const group of groups) {
    targets.set(group.id, { id: group.id, label: group.label, items: group.items });
    visit(group.items);
  }
  return [...new Set(ids)].flatMap(id => {
    const target = targets.get(id);
    return target ? [target] : [];
  });
}
