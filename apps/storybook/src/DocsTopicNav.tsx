import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { Icon } from "@tcrn/ui-react/approved";
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
  href: string;
  pageId: string;
  items: readonly DocsTopicLink[];
}

export interface DocsTopicNavProps {
  home: DocsTopicLink;
  label: string;
  categories: readonly DocsTopicCategory[];
  page: string;
  selectedTopic: string | undefined;
  open: string | null;
  onOpenChange: (topic: string | null) => void;
}

const dropWidth = 240;
const edgeInset = 12;
const chevronToken = tcrnTokens.find(token => token.variable === "--tcrn-shell-chevron")?.value ?? "";
const chevronSize = /^\d+(?:\.\d+)?px$/.test(chevronToken) ? Number.parseFloat(chevronToken) : Number.NaN;
if (!Number.isFinite(chevronSize)) throw new Error("DocsTopicNav: --tcrn-shell-chevron is missing from @tcrn/ui-tokens or is not a pixel length.");

export function DocsTopicNav({ home, label, categories, page, selectedTopic, open, onOpenChange }: DocsTopicNavProps) {
  const navRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());
  const layerRefs = useRef(new Map<string, HTMLDivElement>());
  const branchRefs = useRef(new Map<string, HTMLButtonElement>());
  const pointerDownRef = useRef(false);
  const skipFocusOpenRef = useRef(false);
  const idPrefix = useId();
  const [openBranch, setOpenBranch] = useState<string | null>(null);
  const [categorySide, setCategorySide] = useState<"start" | "end">("start");
  const [submenuSide, setSubmenuSide] = useState<"start" | "end">("end");
  const [submenuTop, setSubmenuTop] = useState(0);

  const menuId = (topic: string) => `${idPrefix}-${topic}-menu`;
  const submenuId = (topic: string) => `${idPrefix}-${topic}-submenu`;
  const categoryOfBranch = categories.find(category => category.id === open && category.items.some(item => item.id === openBranch && item.children?.length));
  const activeBranch = categoryOfBranch?.items.find(item => item.id === openBranch && item.children?.length);

  const positionCategory = (button: HTMLButtonElement) => {
    const rect = button.getBoundingClientRect();
    setCategorySide(rect.right + dropWidth > window.innerWidth - edgeInset ? "end" : "start");
  };

  const positionSubmenu = (topic: string, branchId: string) => {
    const button = branchRefs.current.get(branchId);
    const layer = layerRefs.current.get(topic);
    if (!button || !layer) return;
    const row = button.getBoundingClientRect();
    const layerBox = layer.getBoundingClientRect();
    setSubmenuTop(Math.max(0, row.top - layerBox.top));
    setSubmenuSide(row.right + dropWidth > window.innerWidth - edgeInset ? "start" : "end");
  };

  const openCategory = (category: DocsTopicCategory, button?: HTMLButtonElement) => {
    if (button) positionCategory(button);
    setOpenBranch(null);
    onOpenChange(category.id);
  };

  const openSubmenu = (topic: string, item: DocsTopicLink) => {
    setOpenBranch(item.id);
    positionSubmenu(topic, item.id);
  };

  useEffect(() => {
    if (!open) {
      setOpenBranch(null);
      return;
    }
    const nav = navRef.current;
    if (!nav) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && !nav.contains(target)) onOpenChange(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !nav.contains(nav.ownerDocument.activeElement)) return;
      event.preventDefault();
      event.stopPropagation();
      if (openBranch) {
        const branch = branchRefs.current.get(openBranch);
        setOpenBranch(null);
        skipFocusOpenRef.current = true;
        branch?.focus();
        skipFocusOpenRef.current = false;
      } else {
        const trigger = triggerRefs.current.get(open);
        onOpenChange(null);
        skipFocusOpenRef.current = true;
        trigger?.focus();
        skipFocusOpenRef.current = false;
      }
    };
    nav.ownerDocument.addEventListener("pointerdown", onPointerDown);
    nav.ownerDocument.addEventListener("keydown", onKeyDown, true);
    return () => {
      nav.ownerDocument.removeEventListener("pointerdown", onPointerDown);
      nav.ownerDocument.removeEventListener("keydown", onKeyDown, true);
    };
  }, [open, openBranch, onOpenChange]);

  useEffect(() => {
    if (open && openBranch) positionSubmenu(open, openBranch);
  }, [open, openBranch]);

  useEffect(() => {
    const onResize = () => {
      if (open) {
        const trigger = triggerRefs.current.get(open);
        if (trigger) positionCategory(trigger);
      }
      if (open && openBranch) positionSubmenu(open, openBranch);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open, openBranch]);

  const handlePointerLeave = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "touch" && open) onOpenChange(null);
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
        aria-expanded={expanded}
        aria-controls={submenuId(topic)}
        aria-current={isCurrent ? "true" : undefined}
        onPointerDown={() => { pointerDownRef.current = true; }}
        onPointerEnter={event => { if (event.pointerType !== "touch") openSubmenu(topic, item); }}
        onFocus={() => { if (!pointerDownRef.current && !skipFocusOpenRef.current) openSubmenu(topic, item); }}
        onClick={event => {
          pointerDownRef.current = false;
          if (expanded && event.detail > 0) setOpenBranch(null);
          else openSubmenu(topic, item);
        }}
      >
        <span className="docs-topic-menu__label" title={item.label}>{item.label}</span>
        <Icon name="chevron-right" size={chevronSize} className="docs-topic-menu__chevron" />
      </button>
    );
  };

  return (
    <nav
      ref={navRef}
      className="tcrn-shell-pins docs-topics"
      aria-label={label}
      onPointerLeave={handlePointerLeave}
      onBlurCapture={event => {
        if (open && event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) onOpenChange(null);
      }}
    >
      <span className="tcrn-shell-pins__pin">
        <a className="tcrn-shell-pins__item" href={home.href} aria-current={home.id === page ? "page" : undefined}>
          <span className="tcrn-shell-pins__label" title={home.label}>{home.label}</span>
        </a>
      </span>
      {categories.map(category => {
        const expanded = category.id === open;
        const branch = category.items.find(item => item.children?.length);
        return (
          <span key={category.id} className="tcrn-shell-pins__pin docs-topics__category">
            <button
              ref={node => { if (node) triggerRefs.current.set(category.id, node); else triggerRefs.current.delete(category.id); }}
              type="button"
              className="tcrn-shell-pins__item"
              aria-expanded={expanded}
              aria-controls={menuId(category.id)}
              data-docs-topic={category.id}
              data-current-topic={category.id === selectedTopic ? "" : undefined}
              onPointerDown={() => { pointerDownRef.current = true; }}
              onPointerEnter={event => { if (event.pointerType !== "touch") openCategory(category, event.currentTarget); }}
              onFocus={event => { if (!pointerDownRef.current && !skipFocusOpenRef.current) openCategory(category, event.currentTarget); }}
              onClick={event => {
                pointerDownRef.current = false;
                if (expanded && event.detail > 0) onOpenChange(null);
                else openCategory(category, event.currentTarget);
              }}
            >
              <span className="tcrn-shell-pins__label" title={category.label}>{category.label}</span>
            </button>
            <div
              className="docs-topics__layer"
              ref={node => { if (node) layerRefs.current.set(category.id, node); else layerRefs.current.delete(category.id); }}
              data-side={categorySide}
              hidden={!expanded}
            >
              <div className="docs-topic-menu" id={menuId(category.id)} aria-label={category.label}>
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
                data-side={submenuSide}
                style={{ "--docs-topic-submenu-top": `${submenuTop}px` } as CSSProperties}
                hidden={!expanded || !branch || openBranch !== branch.id}
              >
                <div className="docs-topic-menu docs-topic-menu--submenu" id={submenuId(category.id)} aria-label={branch?.label ?? ""}>
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
          </span>
        );
      })}
    </nav>
  );
}
