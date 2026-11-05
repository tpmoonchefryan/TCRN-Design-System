import { useEffect, useGlobals } from "storybook/preview-api";
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
  render: (_args: unknown, { initialGlobals }: { initialGlobals: Record<string, unknown> }) => {
    const [globals, updateGlobals] = useGlobals();
    // frameElement is available only for same-origin embeds. The Manager owns this named canvas.
    const frame = globalThis.window?.frameElement;
    const manager = frame?.id === "storybook-preview-iframe" && frame.getAttribute("data-is-storybook") === "true"
      ? frame.ownerDocument.location
      : null;
    useEffect(() => {
      if (!manager || globals.locale !== initialGlobals.locale) return;
      // Manager removes default globals from its URL. Preview 10.4.6 merges that query update and retains stale keys.
      const url = new URL(window.location.href);
      const serialized = url.searchParams.get("globals");
      if (!serialized) return;
      const remaining = serialized.split(";").filter(value => !value.startsWith("locale:")).join(";");
      if (remaining === serialized) return;
      if (remaining) url.searchParams.set("globals", remaining);
      else url.searchParams.delete("globals");
      window.history.replaceState(window.history.state, "", url);
    }, [manager, globals.locale, initialGlobals.locale]);
    return (
      <App
        key={page}
        page={page}
        locale={resolveDocsLocale(String(globals.locale))}
        entry={manager ? { managerPath: manager.pathname } : "canvas"}
        onLocaleChange={manager ? locale => updateGlobals({ locale }) : undefined}
      />
    );
  },
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
