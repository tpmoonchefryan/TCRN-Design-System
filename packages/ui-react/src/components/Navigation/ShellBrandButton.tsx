// ShellBrandButton — the brand button at the start of the top band (TCRN-DS-SUB-114; 07a board,
// section 1 and section A; 07b board, section F).
//
// The button is the sidebar-scale first lockup line (the product mark and its wordmark) plus a
// toggle cell with the roster chevron; pressing it opens the full menu, which is a non-modal
// dialog, so the button says aria-haspopup="dialog" and aria-expanded. It comes in two versions:
// the second (mark, wordmark, toggle; --tcrn-shell-brand-w wide) and, narrower than 1024, the
// first (mark and toggle, as wide as its content). Both are --tcrn-shell-brand-h high, which is
// also the touch height. `version="auto"` (the default) picks by the shell container: the stylesheet
// switches at the breakpoint, so the first paint is already right, and once mounted the button
// reports the version it shows in data-shell-brand.
//
// The mark is the registered product mark drawn by TcrnBrandMark from the design contract
// (product-marks.generated from the pinned published 04-brand SVG bodies), in colour and opaque:
// no redrawn, single-colour or translucent mark. The first-line markup — a data-lockup="lkr-line"
// container holding svg[data-logo] and <b>{word} <em>{suffix}</em></b> — is the one the
// ProductLockup first-line variant uses too; the two implement it separately. Both write the mark's
// own id in data-logo (tms, ds, mana, einzbern; productMarkIdOf, TCRN-DS-SUB-212), while the SVG is
// drawn from the product key.
//
// This module and Navigation.tsx may import each other; what it takes from Navigation.tsx is
// used inside the component body only, never evaluated when the module loads (C-4).
import { forwardRef, useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type RefObject } from "react";
import type { TcrnLocale } from "@tcrn/ui-copy-state";
import { Icon } from "../Icon/index.js";
import { cx } from "../../utils.js";
import { TcrnBrandMark, type TcrnProductMarkId } from "./Navigation.js";
import { productMarkIdOf } from "./product-mark-id.js";
import { tcrnProductMarks } from "./product-marks.generated.js";
import { useTcrnShellCopy } from "./shell-copy.js";

/** "auto" follows the shell container; "v1" is the mark alone, "v2" the mark with its wordmark. */
export type ShellBrandButtonVersion = "auto" | "v1" | "v2";

/** Read the owning shell before paint, and observe that container rather than the window. */
function useShellNarrow(ref: RefObject<HTMLButtonElement | null>, enabled: boolean): boolean {
  const [narrow, setNarrow] = useState(false);
  useLayoutEffect(() => {
    const button = ref.current;
    if (!enabled || !button) return undefined;
    const shell = button.closest<HTMLElement>(".tcrn-product-shell");
    const view = button.ownerDocument.defaultView;
    const update = () => setNarrow((shell ? shell.getBoundingClientRect().width : view?.innerWidth ?? 1024) < 1024);
    update();
    const observer = shell && view?.ResizeObserver ? new view.ResizeObserver(update) : null;
    if (shell) observer?.observe(shell);
    view?.addEventListener("resize", update);
    return () => { observer?.disconnect(); view?.removeEventListener("resize", update); };
  }, [ref, enabled]);
  return enabled && narrow;
}

export interface ShellBrandButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "type"> {
  /** The product whose mark and wordmark the button shows. */
  productId: TcrnProductMarkId;
  /** Whether the full menu the button opens is open: aria-expanded, the chevron and the open fill. */
  expanded?: boolean;
  /** Which version to show; "auto" (the default) follows the shell container. */
  version?: ShellBrandButtonVersion;
  /** Language of the button's accessible name; the page's own when omitted. */
  locale?: TcrnLocale | string;
}

export const ShellBrandButton = forwardRef<HTMLButtonElement, ShellBrandButtonProps>(function ShellBrandButton(
  { productId, expanded = false, version = "auto", locale, className, ...props },
  ref
) {
  const mark = tcrnProductMarks.find((candidate) => candidate.productId === productId);
  if (!mark) throw new Error(`ShellBrandButton: no product mark is generated for "${productId}"`);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const narrow = useShellNarrow(buttonRef, version === "auto");
  const shown = version === "auto" ? (narrow ? "v1" : "v2") : version;
  const copy = useTcrnShellCopy(locale);
  const name = expanded ? copy.closeNavigationOf(mark.name) : copy.openNavigationOf(mark.name);
  return (
    <button
      {...props}
      ref={(node) => {
        buttonRef.current = node;
        if (typeof ref === "function") return ref(node);
        if (ref) ref.current = node;
      }}
      type="button"
      className={cx("tcrn-shell-brand", mark.font === "serif" && "tcrn-shell-brand--serif", className)}
      aria-label={props["aria-label"] ?? name}
      aria-expanded={expanded}
      aria-haspopup="dialog"
      data-tab=""
      data-shell-brand={shown}
      data-shell-brand-auto={version === "auto" ? "" : undefined}
    >
      <span className="tcrn-shell-brand__line" data-lockup="lkr-line">
        <TcrnBrandMark productId={productId} className="tcrn-shell-brand__mark" aria-hidden="true" data-logo={productMarkIdOf(productId)} data-guide="tab" />
        {version === "v1" ? null : (
          <b className="tcrn-shell-brand__word">
            {mark.word}
            {mark.suffix ? (
              <>
                {" "}
                <em className={cx("tcrn-shell-brand__suffix", `tcrn-shell-brand__suffix--${productId}`)}>{mark.suffix}</em>
              </>
            ) : null}
          </b>
        )}
      </span>
      <span className="tcrn-shell-brand__toggle" data-shell-toggle="">
        <Icon name={expanded ? "chevron-up" : "chevron-down"} size="md" />
      </span>
    </button>
  );
});
