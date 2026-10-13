// ShellBrandButton — the brand button at the start of the top band (TCRN-DS-SUB-114; 07a board,
// section 1 and section A; 07b board, section F).
//
// The button is the sidebar-scale first lockup line (the product mark and its wordmark) plus a
// toggle cell with the roster chevron; pressing it opens the full menu, which is a non-modal
// dialog, so the button says aria-haspopup="dialog" and aria-expanded. It comes in two versions:
// the second (mark, wordmark, toggle; --tcrn-shell-brand-w wide) and, narrower than 1024, the
// first (mark and toggle, as wide as its content). Both are --tcrn-shell-brand-h high, which is
// also the touch height. `version="auto"` (the default) picks by the viewport: the stylesheet
// switches at the breakpoint, so the first paint is already right, and once mounted the button
// reports the version it shows in data-shell-brand.
//
// The mark is the registered product mark drawn by TcrnBrandMark from the design contract
// (product-marks.generated, the bytes of docs/design/gplus-2026-10/logos2), in colour and opaque:
// no redrawn, single-colour or translucent mark. The first-line markup — a data-lockup="lkr-line"
// container holding svg[data-logo] and <b>{word} <em>{suffix}</em></b> — is the one the
// ProductLockup first-line variant uses too; the two implement it separately.
//
// This module and Navigation.tsx may import each other; what it takes from Navigation.tsx is
// used inside the component body only, never evaluated when the module loads (C-4).
import { forwardRef, useEffect, useState, type ButtonHTMLAttributes } from "react";
import type { TcrnLocale } from "@tcrn/ui-copy-state";
import { Icon } from "../Icon/index.js";
import { cx } from "../../utils.js";
import { TcrnBrandMark, type TcrnProductMarkId } from "./Navigation.js";
import { tcrnProductMarks } from "./product-marks.generated.js";
import { tcrnShellCopyFor } from "./shell-copy.js";

/** "auto" follows the viewport; "v1" is the mark alone, "v2" the mark with its wordmark. */
export type ShellBrandButtonVersion = "auto" | "v1" | "v2";

/** Viewports that match this show the first version and no pinned items (narrower than 1024). */
const shellNarrowMediaQuery = "(max-width: 1023px)";

/** Whether the viewport matches `query`, after mount; false on the server and before mount. */
function useViewportMatch(query: string, enabled: boolean): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (!enabled || typeof window === "undefined" || typeof window.matchMedia !== "function") return undefined;
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query, enabled]);
  return enabled && matches;
}

export interface ShellBrandButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "type"> {
  /** The product whose mark and wordmark the button shows. */
  productId: TcrnProductMarkId;
  /** Whether the full menu the button opens is open: aria-expanded, the chevron and the open fill. */
  expanded?: boolean;
  /** Which version to show; "auto" (the default) follows the viewport. */
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
  const narrow = useViewportMatch(shellNarrowMediaQuery, version === "auto");
  const shown = version === "auto" ? (narrow ? "v1" : "v2") : version;
  const copy = tcrnShellCopyFor(locale);
  const name = expanded ? copy.closeNavigationOf(mark.name) : copy.openNavigationOf(mark.name);
  return (
    <button
      {...props}
      ref={ref}
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
        <TcrnBrandMark productId={productId} className="tcrn-shell-brand__mark" aria-hidden="true" data-logo={productId} data-guide="tab" />
        {version === "v1" ? null : (
          <b className="tcrn-shell-brand__word" title={mark.name}>
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
        <Icon name={expanded ? "chevron-up" : "chevron-down"} size={16} />
      </span>
    </button>
  );
});
