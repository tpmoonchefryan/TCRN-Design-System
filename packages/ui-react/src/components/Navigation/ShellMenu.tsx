// ShellMenu — the full menu the brand button opens (TCRN-DS-SUB-116; 07a board, section A, the
// expanded state; 07b board, section D rows "完整菜单" and "右下角锁定块", section F tokens).
//
// One step opens it: there is no small panel and no collapse button. The menu is a non-modal
// dialog under the brand button. Its top is the brand button's bottom plus the hand-off gap,
// written as the token calculation (strip-h − brand-h) / 2 + brand-h + menu-gap; its start edge
// is the paper's (space-3, 12); it is --tcrn-shell-panel-w-expanded wide and at most the
// viewport less the top band high. Inside, top to bottom: the search (ProductShellSearch, whose
// field is SearchInput at --tcrn-shell-srch-h), the groups in three columns (gap space-4, rows
// --tcrn-shell-row-h; a group title is a NavGroup and an item a NavItem, each with its pin slot
// when the product handles pinning) and the bottom bar: the current position and the side-rail
// lockup. The bar is --tcrn-shell-pbar-h plus the panel's bottom inset (space-2) high, so the
// lockup and the trail sit midway between the bar's top rule and the panel's bottom edge. The
// lockup is ShellBrandLockup as the Brand board's section E draws it, a picture and not a
// control: role="img", outside the Tab sequence, no hover.
//
// The menu model is the product's: groups, their items, the items' children (third level) and
// theirs (fourth level, the last); deeper entries are not shown.
//
// This module and Navigation.tsx may import each other; what it takes from Navigation.tsx is
// used inside function bodies only, never evaluated when the module loads (C-4).
import { Fragment, useId, useState, type HTMLAttributes, type ReactNode } from "react";
import type { TcrnLocale } from "@tcrn/ui-copy-state";
import { Icon, type IconName } from "../Icon/index.js";
import { cx } from "../../utils.js";
import { NavGroup, NavItem, ProductShellSearch, ShellBrandLockup, type TcrnProductLogoId } from "./Navigation.js";
import { tcrnShellCopyFor } from "./shell-copy.js";

/** An entry of the menu model below the groups: an item (second level) or a child (third, fourth). */
export interface ShellMenuItem {
  /** Stable id: the key of the row in the pin preferences, the selected id and data-pin. */
  id: string;
  /** Visible name; it truncates on one line and is repeated in the title. */
  label: string;
  /** Destination of the row. */
  href?: string;
  /** Roster icon; the full menu's columns show it, the drop-down and the cascades do not. */
  iconName?: IconName;
  /** The next level. An item's children are the third level, theirs the fourth and last. */
  children?: readonly ShellMenuItem[];
}

/** The first level of the menu model: a titled group of items, one column of the full menu. */
export interface ShellMenuGroup {
  id: string;
  label: string;
  iconName?: IconName;
  items: readonly ShellMenuItem[];
}

/** One step of the current position in the bottom bar; the last step is the current page. */
export interface ShellMenuCrumb {
  label: string;
  href?: string;
}

/** The deepest level the menu model reaches: group, item, child, child of a child. */
export const shellMenuMaxDepth = 4;

/** What a row needs from the menu that renders it (the full menu, a cascade or a drop-down). */
export interface ShellMenuRowContext {
  selectedId: string | null;
  pinnedIds: ReadonlySet<string>;
  onPinnedChange?: (id: string, pinned: boolean) => void;
  locale?: TcrnLocale | string;
  /** Static states for documentation, by row id: data-tcrn-preview-state (hover, focus). */
  previewStates?: Readonly<Record<string, string>>;
}

/** The pin props of a row: present only when the product handles pinning (C-6). */
export function shellMenuPinProps(id: string, label: string, context: ShellMenuRowContext) {
  const onPinnedChange = context.onPinnedChange;
  if (!onPinnedChange) return {};
  return { pinned: context.pinnedIds.has(id), onPinnedChange: (pinned: boolean) => onPinnedChange(id, pinned), pinLabel: label };
}

/**
 * One row of a menu column: a NavItem whose text truncates on one line (with the name in the
 * title) and which carries a 12 chevron when the entry has a next level within the model's four.
 */
export function shellMenuRow(item: ShellMenuItem, level: number, context: ShellMenuRowContext, extra: { iconName?: IconName } = {}): ReactNode {
  const hasNext = level < shellMenuMaxDepth && (item.children?.length ?? 0) > 0;
  return (
    <NavItem
      key={item.id}
      href={item.href}
      selected={item.id === context.selectedId}
      iconName={extra.iconName}
      locale={context.locale}
      title={item.label}
      data-shell-row=""
      data-shell-level={level}
      data-tcrn-preview-state={context.previewStates?.[item.id]}
      {...shellMenuPinProps(item.id, item.label, context)}
    >
      <span className="tcrn-shell-menu__text">{item.label}</span>
      {hasNext ? <Icon name="chevron-right" size={12} className="tcrn-shell-menu__sub" /> : null}
    </NavItem>
  );
}

export interface ShellMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  /** The menu model: groups → items → children → children. */
  groups: readonly ShellMenuGroup[];
  /** Whether the menu is open; closed, nothing is rendered. */
  open: boolean;
  /** The product whose side-rail lockup sits in the bottom bar. */
  productId: TcrnProductLogoId;
  /** The row of the current page: aria-current="page", the 6% wash and weight 600. */
  selectedId?: string | null;
  /** The current position shown in the bottom bar; the last step is the current page. */
  currentPath?: readonly ShellMenuCrumb[];
  /** Ids of the pinned groups, items and children. */
  pinnedIds?: readonly string[];
  /** Pins or unpins a row; without it the rows have no pin. */
  onPinnedChange?: (id: string, pinned: boolean) => void;
  /** Placeholder of the search; a product-neutral one in the reader's language when omitted. */
  searchPlaceholder?: string;
  /** Language of the menu's copy; the page's own when omitted. */
  locale?: TcrnLocale | string;
  /** Static states for documentation, by row or group id: data-tcrn-preview-state. */
  previewStates?: Readonly<Record<string, string>>;
}

export function ShellMenu({
  groups,
  open,
  productId,
  selectedId = null,
  currentPath = [],
  pinnedIds = [],
  onPinnedChange,
  searchPlaceholder,
  locale,
  previewStates,
  id,
  className,
  ...props
}: ShellMenuProps) {
  const generatedId = useId();
  const [query, setQuery] = useState("");
  if (!open) return null;
  const dialogId = id ?? `${generatedId}-menu`;
  const copy = tcrnShellCopyFor(locale);
  const context: ShellMenuRowContext = { selectedId, pinnedIds: new Set(pinnedIds), onPinnedChange, locale, previewStates };
  const last = currentPath.length - 1;
  return (
    <div {...props} className={cx("tcrn-shell-menu", className)} data-shell-menu="">
      <section id={dialogId} className="tcrn-shell-menu__panel" role="dialog" aria-modal="false" aria-label={copy.navigation} data-panel="expanded">
        <ProductShellSearch
          className="tcrn-shell-menu__search"
          locale={locale}
          placeholder={searchPlaceholder ?? copy.searchNavigation}
          query={query}
          onQueryChange={setQuery}
          data-shell-search=""
        />
        <div className="tcrn-shell-menu__cols" data-shell-cols="">
          {groups.map((group) => (
            <NavGroup
              key={group.id}
              label={group.label}
              locale={locale}
              className="tcrn-shell-menu__col"
              data-shell-group=""
              data-shell-col=""
              data-tcrn-preview-state={previewStates?.[group.id]}
              {...shellMenuPinProps(group.id, group.label, context)}
            >
              {group.items.map((item) => shellMenuRow(item, 2, context, { iconName: item.iconName }))}
            </NavGroup>
          ))}
        </div>
        <div className="tcrn-shell-menu__pbar" data-shell-pbar="">
          <nav className="tcrn-shell-menu__crumbs" aria-label={copy.currentPosition}>
            <span className="tcrn-shell-menu__crumbs-label" aria-hidden="true">
              {copy.currentPosition}
            </span>
            {currentPath.map((crumb, index) => (
              <Fragment key={`${index}-${crumb.label}`}>
                {index > 0 ? <Icon name="chevron-right" size={12} className="tcrn-shell-menu__crumb-sep" /> : null}
                {index === last ? (
                  <b className="tcrn-shell-menu__crumb tcrn-shell-menu__crumb--current" aria-current="page" title={crumb.label}>
                    {crumb.label}
                  </b>
                ) : crumb.href ? (
                  <a className="tcrn-shell-menu__crumb" href={crumb.href} title={crumb.label}>
                    {crumb.label}
                  </a>
                ) : (
                  <span className="tcrn-shell-menu__crumb" title={crumb.label}>
                    {crumb.label}
                  </span>
                )}
              </Fragment>
            ))}
          </nav>
          <ShellBrandLockup productId={productId} locale={locale} role="img" className="tcrn-shell-menu__lockup" data-lockup="lkr" />
        </div>
      </section>
    </div>
  );
}
