import { Fragment, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { Icon, ShellPins } from "@tcrn/ui-react/approved";
import type { TcrnLocale } from "@tcrn/ui-copy-state";
import { tcrnTokens } from "@tcrn/ui-tokens";

export interface DocsTopicLink {
  id: string;
  label: string;
  href?: string;
  children?: readonly DocsTopicLink[];
}

export interface DocsTopicCategory {
  id: string;
  label: string;
  href?: string;
  pageId?: string;
  items: readonly DocsTopicLink[];
}

export interface DocsTopicNavProps {
  home: DocsTopicLink;
  label: string;
  categories: readonly DocsTopicCategory[];
  page: string;
  selectedTopic: string | undefined;
  inManager: boolean;
  open: string | null;
  onOpenChange: (topic: string | null) => void;
  onPinsReorder: (ids: readonly string[]) => void;
  locale: TcrnLocale;
}

const dropWidth = 240;
const edgeInset = 12;
const chevronToken = tcrnTokens.find(token => token.variable === "--tcrn-shell-chevron")?.value ?? "";
const chevronSize = /^\d+(?:\.\d+)?px$/.test(chevronToken) ? Number.parseFloat(chevronToken) : Number.NaN;
if (!Number.isFinite(chevronSize)) throw new Error("DocsTopicNav: --tcrn-shell-chevron is missing from @tcrn/ui-tokens or is not a pixel length.");

export function DocsTopicNav({ home, label, categories, page, selectedTopic, inManager, open, onOpenChange, onPinsReorder, locale }: DocsTopicNavProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const triggerOf = (id: string) => [...(navRef.current?.querySelectorAll<HTMLButtonElement>("[data-pin] > button") ?? [])]
    .find(button => button.parentElement?.getAttribute("data-pin") === id);
  const layerRefs = useRef(new Map<string, HTMLDivElement>());
  const branchRefs = useRef(new Map<string, HTMLButtonElement>());
  const pointerDownRef = useRef(false);
  const skipFocusOpenRef = useRef(false);
  const idPrefix = useId();
  const [openBranch, setOpenBranch] = useState<string | null>(null);
  const [categoryTop, setCategoryTop] = useState(0);
  const [categoryLeft, setCategoryLeft] = useState(0);
  const [submenuSide, setSubmenuSide] = useState<"start" | "end">("end");
  const [submenuTop, setSubmenuTop] = useState(0);
  const [submenuLeft, setSubmenuLeft] = useState(0);

  const holdsPage = (items: readonly DocsTopicLink[]): boolean => items.some(item => item.id === page || holdsPage(item.children ?? []));
  const selectedPin = categories.find(category => category.id === page) ?? categories.find(category => holdsPage(category.items));
  const menuId = (topic: string) => `${idPrefix}-${topic}-menu`;
  const submenuId = (topic: string) => `${idPrefix}-${topic}-submenu`;
  const positionCategory = (button: HTMLButtonElement) => {
    const rect = button.getBoundingClientRect();
    setCategoryTop(rect.bottom);
    const origin = navRef.current?.getBoundingClientRect().left ?? 0;
    setCategoryLeft(Math.max(edgeInset, Math.min(rect.left, window.innerWidth - edgeInset - dropWidth)) - origin);
  };

  const positionSubmenu = (topic: string, branchId: string) => {
    const button = branchRefs.current.get(branchId);
    const layer = layerRefs.current.get(topic);
    if (!button || !layer) return;
    const layerBox = layer.getBoundingClientRect();
    const gap = Number.parseFloat(getComputedStyle(layer).getPropertyValue("--tcrn-shell-cascade-gap"));
    const row = button.getBoundingClientRect();
    const side = row.right + gap + dropWidth > window.innerWidth - edgeInset ? "start" : "end";
    setSubmenuTop(Math.max(0, row.top - layerBox.top));
    setSubmenuSide(side);
    setSubmenuLeft((side === "end" ? row.right : row.left - gap - dropWidth) - layerBox.left);
  };

  const openCategory = (category: DocsTopicCategory, button?: HTMLButtonElement) => {
    if (button) positionCategory(button);
    setOpenBranch(null);
    onOpenChange(category.id);
  };

  const menuHasFocus = () => {
    const layer = open ? layerRefs.current.get(open) : undefined;
    return layer?.contains(layer.ownerDocument.activeElement);
  };

  useEffect(() => {
    if (!open) {
      setOpenBranch(null);
      return;
    }
    const nav = navRef.current;
    if (!nav) return;
    const doc = nav.ownerDocument;
    // Hover can open the preview menu while the same-origin Manager still owns keyboard input.
    const managerDoc = inManager ? doc.defaultView?.frameElement?.ownerDocument : undefined;
    const documents = [doc, managerDoc];
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (event.currentTarget === managerDoc || (target instanceof Node && !nav.contains(target))) onOpenChange(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const trigger = triggerOf(open);
      const active = doc.activeElement;
      const layer = layerRefs.current.get(open);
      if (event.currentTarget === managerDoc || (active !== trigger && !layer?.contains(active))) {
        onOpenChange(null);
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (openBranch) {
        const branch = branchRefs.current.get(openBranch);
        setOpenBranch(null);
        skipFocusOpenRef.current = true;
        branch?.focus();
        skipFocusOpenRef.current = false;
      } else {
        onOpenChange(null);
        skipFocusOpenRef.current = true;
        trigger?.focus();
        skipFocusOpenRef.current = false;
      }
    };
    for (const target of documents) {
      target?.addEventListener("pointerdown", onPointerDown, true);
      target?.addEventListener("keydown", onKeyDown, true);
    }
    return () => {
      for (const target of documents) {
        target?.removeEventListener("pointerdown", onPointerDown, true);
        target?.removeEventListener("keydown", onKeyDown, true);
      }
    };
  }, [inManager, open, openBranch, onOpenChange]);

  useLayoutEffect(() => {
    if (open) {
      const trigger = triggerOf(open);
      if (trigger) positionCategory(trigger);
      else onOpenChange(null);
    }
    if (open && openBranch) positionSubmenu(open, openBranch);
  }, [open, openBranch, categories]);

  useEffect(() => {
    const onResize = () => {
      if (open) {
        const trigger = triggerOf(open);
        if (trigger) positionCategory(trigger);
      }
      if (open && openBranch) positionSubmenu(open, openBranch);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open, openBranch]);

  const handlePointerLeave = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "touch" && open && !menuHasFocus()) onOpenChange(null);
  };

  const row = (topic: string, item: DocsTopicLink, isCurrent: boolean) => {
    if (!item.children?.length) {
      return (
        <a className="docs-topic-menu__row" href={item.href} aria-current={item.id === page ? "page" : undefined}>
          <span className="docs-topic-menu__label" title={item.label}>{item.label}</span>
        </a>
      );
    }
    const expanded = topic === open && item.id === openBranch;
    return (
      <button
        ref={node => { if (node) branchRefs.current.set(item.id, node); else branchRefs.current.delete(item.id); }}
        type="button"
        className="docs-topic-menu__row"
        aria-haspopup="dialog"
        aria-expanded={expanded}
        aria-controls={submenuId(topic)}
        aria-current={isCurrent ? "true" : undefined}
        onPointerDown={() => { pointerDownRef.current = true; }}
        onPointerEnter={event => { if (event.pointerType !== "touch") setOpenBranch(item.id); }}
        onFocus={() => { if (!pointerDownRef.current && !skipFocusOpenRef.current) setOpenBranch(item.id); }}
        onClick={event => {
          pointerDownRef.current = false;
          if (expanded && event.detail > 0) setOpenBranch(null);
          else setOpenBranch(item.id);
        }}
      >
        <span className="docs-topic-menu__label" title={item.label}>{item.label}</span>
        <Icon name="chevron-right" size={chevronSize} className="docs-topic-menu__chevron" />
      </button>
    );
  };

  return (
    <div
      ref={navRef}
      className="docs-topic-nav"
      onPointerLeave={handlePointerLeave}
      onKeyDown={event => {
        // Storybook forwards unhandled preview keys to Manager navigation. The
        // existing ShellPins reorder must remain local to its focused control.
        if (event.defaultPrevented && event.altKey && ["ArrowLeft", "ArrowRight"].includes(event.key)) event.stopPropagation();
        if (event.defaultPrevented || event.altKey) return;
        const focused = event.target as HTMLElement;
        if (event.key === "Tab" && open) {
          const layer = layerRefs.current.get(open);
          const first = [...(layer?.querySelectorAll<HTMLElement>(".docs-topic-menu__row") ?? [])]
            .find(row => row.tabIndex >= 0 && row.getClientRects().length > 0 && !row.closest("[inert]"));
          const trigger = triggerOf(open);
          if (!event.shiftKey && focused === trigger && first) { event.preventDefault(); first.focus(); }
          else if (event.shiftKey && focused === first) { event.preventDefault(); trigger?.focus(); }
          else if (!event.shiftKey && layer?.contains(focused)) {
            const rows = [...layer.querySelectorAll<HTMLElement>(".docs-topic-menu__row")].filter(row => row.tabIndex >= 0 && row.getClientRects().length > 0 && !row.closest("[inert]"));
            if (focused === rows.at(-1)) {
              const triggers = [...(navRef.current?.querySelectorAll<HTMLElement>(".docs-topics .tcrn-shell-pins__item") ?? [])];
              const next = trigger && triggers[triggers.indexOf(trigger) + 1];
              if (next) { event.preventDefault(); onOpenChange(null); next.focus(); }
            }
          }
          return;
        }
        if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(event.key)) return;
        const target = event.target as HTMLElement;
        if (!open) return;
        const layer = layerRefs.current.get(open);
        const list = target.closest(".docs-topic-menu__list");
        const rows = [...(list?.querySelectorAll<HTMLElement>(".docs-topic-menu__row") ?? [])];
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          const next = rows.length ? rows[(rows.indexOf(target) + (event.key === "ArrowDown" ? 1 : rows.length - 1)) % rows.length]
            : layer?.querySelector<HTMLElement>(".docs-topic-menu__row");
          if (next) { event.preventDefault(); next.focus(); }
        } else if (event.key === "ArrowRight" && target.hasAttribute("aria-expanded")) {
          event.preventDefault();
          if (target.getAttribute("aria-expanded") !== "true") target.click();
          requestAnimationFrame(() => layer?.querySelector<HTMLElement>(".docs-topics__submenu-wrap:not([hidden]) .docs-topic-menu__row")?.focus());
        } else if (event.key === "ArrowLeft" && target.closest(".docs-topics__submenu-wrap")) {
          event.preventDefault();
          const branch = openBranch && branchRefs.current.get(openBranch);
          setOpenBranch(null);
          skipFocusOpenRef.current = true;
          if (branch) branch.focus();
          skipFocusOpenRef.current = false;
        }
      }}
      onBlurCapture={event => {
        if (open && !event.currentTarget.contains(event.relatedTarget)) onOpenChange(null);
      }}
    >
      <span className="tcrn-shell-pins__pin">
        <a className="tcrn-shell-pins__item" href={home.href} aria-current={home.id === page ? "page" : undefined}>
          <span className="tcrn-shell-pins__label" title={home.label}>{home.label}</span>
        </a>
      </span>
      <ShellPins
        className="docs-topics"
        aria-label={label}
        locale={locale}
        items={categories.map(category => ({ ...category, hasMenu: category.items.length > 0 }))}
        selectedId={selectedPin?.id ?? selectedTopic}
        openId={open}
        menuIdOf={menuId}
        onPinsReorder={onPinsReorder}
        onOpenChange={id => {
          const category = categories.find(category => category.id === id);
          if (category) openCategory(category, triggerOf(category.id));
          else onOpenChange(null);
          pointerDownRef.current = false;
        }}
        onPointerDown={() => { pointerDownRef.current = true; }}
        onPointerUp={() => { pointerDownRef.current = false; }}
        onPointerCancel={() => { pointerDownRef.current = false; }}
        onPointerOver={event => {
          if (event.pointerType === "touch" || menuHasFocus() || event.buttons) return;
          const button = (event.target as Element).closest<HTMLButtonElement>("[data-pin] > button");
          const category = categories.find(category => category.id === button?.parentElement?.getAttribute("data-pin"));
          if (category && button && category.id !== open) openCategory(category, button);
        }}
        onFocusCapture={event => {
          if (pointerDownRef.current || skipFocusOpenRef.current) return;
          const button = (event.target as Element).closest<HTMLButtonElement>("[data-pin] > button");
          const category = categories.find(category => category.id === button?.parentElement?.getAttribute("data-pin"));
          if (category && button) openCategory(category, button);
        }}
      />
      {categories.filter(category => category.items.length > 0).map(category => {
        const expanded = category.id === open;
        const branch = category.items.find(item => item.children?.length);
        const submenuExpanded = expanded && branch?.id === openBranch;
        return (
          <Fragment key={category.id}>
            <div
              className="docs-topics__layer"
              data-docs-topic-layer={category.id}
              id={menuId(category.id)}
              role="dialog"
              aria-modal="false"
              aria-label={category.label}
              ref={node => { if (node) layerRefs.current.set(category.id, node); else layerRefs.current.delete(category.id); }}
              data-side="start"
              style={{ "--docs-topic-layer-top": `${categoryTop}px`, left: `${categoryLeft}px` } as CSSProperties}
              hidden={!expanded}
              inert={!expanded}
            >
              <div className="docs-topic-menu" aria-label={category.label}>
                <ul className="docs-topic-menu__list" onScroll={() => { if (expanded && branch && openBranch) positionSubmenu(category.id, openBranch); }}>
                  {category.items.map(item => (
                    <li key={item.id} className="docs-topic-menu__item">
                      {row(category.id, item, item.id === page)}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className="docs-topics__submenu-wrap"
                id={submenuId(category.id)}
                role="dialog"
                aria-label={branch?.label}
                data-side={submenuSide}
                style={{ "--docs-topic-submenu-top": `${submenuTop}px`, left: `${submenuLeft}px` } as CSSProperties}
                hidden={!submenuExpanded}
                inert={!submenuExpanded}
              >
                <div className="docs-topic-menu docs-topic-menu--submenu" aria-label={branch?.label ?? ""}>
                  <ul className="docs-topic-menu__list">
                    {branch?.children?.map(item => (
                      <li key={item.id} className="docs-topic-menu__item">
                        <a className="docs-topic-menu__row" href={item.href} aria-current={item.id === page ? "page" : undefined}>
                          <span className="docs-topic-menu__label" title={item.label}>{item.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
