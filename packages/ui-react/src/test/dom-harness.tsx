import type { ReactElement } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { JSDOM } from "jsdom";

const globalKeys = [
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "Node",
  "Event",
  "MouseEvent",
  "KeyboardEvent",
  "getComputedStyle",
  "requestAnimationFrame",
  "cancelAnimationFrame",
  "IS_REACT_ACT_ENVIRONMENT"
] as const;

type GlobalKey = (typeof globalKeys)[number];
type GlobalSnapshot = Partial<Record<GlobalKey, unknown>>;

function setGlobal(globals: Partial<Record<GlobalKey, unknown>>, key: GlobalKey, value: unknown) {
  Object.defineProperty(globals, key, {
    configurable: true,
    writable: true,
    value
  });
}

export interface DomInteractionHarness {
  readonly document: Document;
  readonly window: JSDOM["window"];
  readonly portalRoot: HTMLElement;
  render(ui: ReactElement): Promise<void>;
  dispatchClick(target: Element): Promise<void>;
  dispatchKeydown(target: EventTarget, key: string): Promise<void>;
  cleanup(): Promise<void>;
}

export function createDomInteractionHarness(): DomInteractionHarness {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    pretendToBeVisual: true,
    url: "http://localhost/"
  });
  const { document, window } = dom.window;
  const globals = globalThis as unknown as Partial<Record<GlobalKey, unknown>>;
  const previousGlobals: GlobalSnapshot = {};

  for (const key of globalKeys) {
    previousGlobals[key] = globals[key];
  }

  setGlobal(globals, "window", window);
  setGlobal(globals, "document", document);
  setGlobal(globals, "navigator", window.navigator);
  setGlobal(globals, "HTMLElement", window.HTMLElement);
  setGlobal(globals, "Node", window.Node);
  setGlobal(globals, "Event", window.Event);
  setGlobal(globals, "MouseEvent", window.MouseEvent);
  setGlobal(globals, "KeyboardEvent", window.KeyboardEvent);
  setGlobal(globals, "getComputedStyle", window.getComputedStyle.bind(window));
  setGlobal(globals, "requestAnimationFrame", window.requestAnimationFrame.bind(window));
  setGlobal(globals, "cancelAnimationFrame", window.cancelAnimationFrame.bind(window));
  setGlobal(globals, "IS_REACT_ACT_ENVIRONMENT", true);

  const htmlElementPrototype = window.HTMLElement.prototype as typeof window.HTMLElement.prototype & {
    attachEvent?: () => void;
    detachEvent?: () => void;
  };
  htmlElementPrototype.attachEvent ??= () => undefined;
  htmlElementPrototype.detachEvent ??= () => undefined;

  const container = document.createElement("div");
  document.body.append(container);

  let root: Root | null = createRoot(container);

  return {
    document,
    window,
    portalRoot: document.body,
    async render(ui) {
      await act(async () => {
        root?.render(ui);
      });
    },
    async dispatchClick(target) {
      await act(async () => {
        target.dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true }));
      });
    },
    async dispatchKeydown(target, key) {
      await act(async () => {
        target.dispatchEvent(new window.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
      });
    },
    async cleanup() {
      await act(async () => {
        root?.unmount();
      });
      root = null;
      for (const key of globalKeys) {
        const previousValue = previousGlobals[key];
        if (typeof previousValue === "undefined") {
          delete globals[key];
        } else {
          setGlobal(globals, key, previousValue);
        }
      }
      dom.window.close();
    }
  };
}
