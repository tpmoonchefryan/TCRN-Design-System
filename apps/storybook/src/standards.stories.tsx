import { App } from "./app.js";
import { approvedSource, resolveDocsLocale, type ApprovedBoardId } from "./approved-source.js";
import type { DocsPage } from "./portal-navigation.js";

export default {
  title: "Published standards",
  parameters: { layout: "fullscreen", publishedSource: approvedSource.site },
  tags: [],
};

const pageStory = (page: DocsPage, name: string) => ({
  name,
  render: (_args: unknown, { globals }: { globals: Record<string, unknown> }) => (
    <App key={page} page={page} locale={resolveDocsLocale(String(globals.locale))} entry="manager" />
  ),
});

const boardStory = (id: ApprovedBoardId) => {
  const board = approvedSource.boards.find(board => board.slug === id)!;
  return { ...pageStory(id, board.title), parameters: { sourceBoard: id, sourceId: board.sourceId } };
};

export const Home = pageStory("index", "Home");
export const Tokens = boardStory("01-tokens");
export const Typography = boardStory("02-typography");
export const Icons = boardStory("03-icons");
export const Brand = boardStory("04-brand");
export const Actions = boardStory("05-actions");
export const Inputs = boardStory("06-inputs");
export const ShellUpper = boardStory("07a-shell-upper");
export const ShellLower = boardStory("07b-shell-lower");
export const Api = pageStory("api", "Component contracts");
export const Source = pageStory("source", "Published source");
