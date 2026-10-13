// ShellIntro — the sign-in intro of the top-band shell (TCRN-DS-SUB-122; STORY-141; 07a board,
// section C; 07b board, section F, motion.intro).
//
// At the moment sign-in succeeds, the lockup on the sign-in card converges into the brand button,
// in three phases timed by the motion intro tokens of @tcrn/ui-tokens:
//
//   fade  --tcrn-motion-intro-fade (120)  the sign-in card fades; its mark stays where it is
//   move  --tcrn-motion-intro-move (240)  the mark travels from the card's lockup (the 128 tier)
//                                         to the brand button's mark (22)
//   rise  --tcrn-motion-intro-rise (100)  the paper rises while the wordmark, the toggle, the
//                                         pinned items and the cluster come in
//
// 460 in all, under --tcrn-motion-intro-max (700), every phase on --tcrn-motion-ease.
//
// Only transform and opacity move, through the Web Animations API. The flying mark is the
// registered colour mark (TcrnBrandMark, from product-marks.generated: the bytes of logos2),
// opaque from start to end; it travels by translate and scale alone. Its end is read from the
// brand button's own mark (getBoundingClientRect), so it lands on that mark's geometry and nothing
// jumps when the layer goes; its start is the mark of the card's lockup, read the same way. Until
// it lands, the brand button's lockup line is held at opacity 0 (the mark itself is never made
// translucent); the paper, the wordmark, the toggle, the pinned items and the cluster are held
// back until the rise and then come in.
//
// It plays once per session, at the moment sign-in succeeds: mounting ShellIntro is that moment.
// The first time, a sessionStorage marker is written; with the marker there (a reload, a restored
// session, a switch to another product in the same tab) nothing plays. Under
// prefers-reduced-motion: reduce nothing plays and the shell is in its final state at once, as it
// is on the server, on a server-rendered first screen (hydration), and in a browser without
// sessionStorage or the Web Animations API.
//
// The flying mark is placed with the physical box getBoundingClientRect reports (left, top, width,
// height), so its place and its travel are in the same coordinates.
//
// It never holds input up: the card is inert from the first frame, so the keyboard reaches the
// brand button directly, and after the fade the layer lets the pointer through to the shell
// (styles/shell-intro.css.ts). The layer is decoration and hidden from assistive technology; a
// polite status says that sign-in went through, in the reader's language (the table below, five
// locales; C-10 keeps it out of shell-copy.ts).
//
// This module and Navigation.tsx may import each other; what it takes from Navigation.tsx is used
// inside the component body only, never evaluated when the module loads (C-4).
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type HTMLAttributes,
  type ReactNode,
  type RefObject
} from "react";
import type { TcrnLocale } from "@tcrn/ui-copy-state";
import { tcrnTokens } from "@tcrn/ui-tokens";
import { cx, resolveDocumentLocale } from "../../utils.js";
import { TcrnBrandMark, type TcrnProductMarkId } from "./Navigation.js";
import { tcrnProductMarks } from "./product-marks.generated.js";

/** The phases of the intro, in order; the layer carries the current one in data-intro-phase. */
export type ShellIntroPhase = "fade" | "move" | "rise";

/** The sessionStorage item that records that this session has had its intro. */
export const shellIntroSessionMarker = "tcrn-shell-intro";

/** The intro's timing, in milliseconds, and its curve. */
export interface ShellIntroTimeline {
  /** The card fades: --tcrn-motion-intro-fade. */
  readonly fade: number;
  /** The mark travels: --tcrn-motion-intro-move. */
  readonly move: number;
  /** The paper rises and the band's parts come in: --tcrn-motion-intro-rise. */
  readonly rise: number;
  /** The three phases together. */
  readonly total: number;
  /** The ceiling the whole intro stays under: --tcrn-motion-intro-max. */
  readonly max: number;
  /** The curve of every phase: --tcrn-motion-ease. */
  readonly easing: string;
}

function tokenValueOf(variable: string): string {
  const entry = tcrnTokens.find((candidate) => candidate.variable === variable);
  if (!entry) throw new Error(`ShellIntro: ${variable} is missing from @tcrn/ui-tokens`);
  return entry.value;
}

function tokenAmount(variable: string, unit: "ms" | "px"): number {
  const value = tokenValueOf(variable);
  const amount = new RegExp(`^\\d+(?:\\.\\d+)?${unit}$`).test(value) ? Number.parseFloat(value) : Number.NaN;
  if (!Number.isFinite(amount)) throw new Error(`ShellIntro: ${variable} is not an amount in ${unit} in @tcrn/ui-tokens`);
  return amount;
}

/** The intro's timing, read from the motion intro tokens of @tcrn/ui-tokens (07b board, section F). */
export function shellIntroTimeline(): ShellIntroTimeline {
  const fade = tokenAmount("--tcrn-motion-intro-fade", "ms");
  const move = tokenAmount("--tcrn-motion-intro-move", "ms");
  const rise = tokenAmount("--tcrn-motion-intro-rise", "ms");
  const max = tokenAmount("--tcrn-motion-intro-max", "ms");
  const total = fade + move + rise;
  if (total > max) throw new Error(`ShellIntro: the three phases take ${total}ms, over the ${max}ms of --tcrn-motion-intro-max`);
  return { fade, move, rise, total, max, easing: tokenValueOf("--tcrn-motion-ease") };
}

/** A box in viewport coordinates, as getBoundingClientRect reports it. */
export interface ShellIntroBox {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

/**
 * What moves: on the intro layer, the sign-in card and the flying mark; in the shell, the brand
 * button's lockup line (held back until the mark lands), the band's parts that come in with the
 * rise (the wordmark, the toggle, the pinned items and the cluster) and the paper.
 */
export type ShellIntroPart = "card" | "mark" | "line" | "band" | "paper";

export interface ShellIntroStep {
  readonly part: ShellIntroPart;
  /** Keyframes of transform and opacity only. */
  readonly keyframes: readonly Keyframe[];
  readonly timing: {
    readonly delay: number;
    readonly duration: number;
    readonly easing: string;
    readonly fill: FillMode;
  };
}

/**
 * The steps of the intro for a mark that starts on `from` (the mark of the card's lockup) and
 * lands on `to` (the brand button's mark): what moves, between which keyframes, when and for how
 * long. Nothing but transform and opacity appears in it, and the mark ends exactly on `to`: it is
 * placed on `from` and scales from its top left corner.
 */
export function shellIntroPlan(from: ShellIntroBox, to: ShellIntroBox, timeline: ShellIntroTimeline = shellIntroTimeline()): ShellIntroStep[] {
  const { fade, move, rise, easing } = timeline;
  const landed = fade + move;
  const scale = from.width > 0 ? to.width / from.width : 1;
  const travel = `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${scale})`;
  // The paper starts the space-2h below its place (07a board, section C: 3 at the storyboard's 0.3).
  const lift = tokenAmount("--tcrn-space-2h", "px");
  return [
    { part: "card", keyframes: [{ opacity: 1 }, { opacity: 0 }], timing: { delay: 0, duration: fade, easing, fill: "forwards" } },
    { part: "mark", keyframes: [{ transform: "none" }, { transform: travel }], timing: { delay: fade, duration: move, easing, fill: "forwards" } },
    { part: "line", keyframes: [{ opacity: 0 }, { opacity: 0 }], timing: { delay: 0, duration: landed, easing, fill: "none" } },
    { part: "band", keyframes: [{ opacity: 0 }, { opacity: 1 }], timing: { delay: landed, duration: rise, easing, fill: "backwards" } },
    {
      part: "paper",
      keyframes: [{ opacity: 0, transform: `translateY(${lift}px)` }, { opacity: 1, transform: "none" }],
      timing: { delay: landed, duration: rise, easing, fill: "backwards" }
    }
  ];
}

// The C-5 hooks the intro reads in the shell: the brand button's mark is where the flying mark
// lands; the brand button's lockup line is held back until then; the wordmark, the toggle, the
// pinned items and the cluster come in with the rise; the paper rises.
const shellIntroTargets = {
  landing: "[data-shell-brand] svg[data-logo]",
  line: "[data-shell-brand] [data-lockup]",
  band: "[data-shell-brand] [data-lockup] > b, [data-shell-brand] [data-shell-toggle], [data-pins], [data-cluster]",
  paper: "[data-paper]"
} as const;

/** The status the intro says, in the reader's language (C-10: this part's own table). */
interface ShellIntroCopy {
  /** Said once the card has faded: sign-in went through and the product opens. */
  signedIn: (productName: string) => string;
}

const shellIntroCopy: Readonly<Record<TcrnLocale, ShellIntroCopy>> = {
  "zh-CN": { signedIn: (productName) => `已登录 ${productName}` },
  en: { signedIn: (productName) => `Signed in to ${productName}` },
  ja: { signedIn: (productName) => `${productName} にサインインしました` },
  ko: { signedIn: (productName) => `${productName}에 로그인했습니다` },
  fr: { signedIn: (productName) => `Connecté à ${productName}` }
};

type ShellIntroState =
  | { readonly status: "deciding" }
  | { readonly status: "playing"; readonly from: ShellIntroBox; readonly to: ShellIntroBox }
  | { readonly status: "done"; readonly played: boolean };

const notPlayed: ShellIntroState = { status: "done", played: false };

// A layout effect in the browser, so the layer and the held-back parts are in place before the
// first paint; an ordinary effect where there is no document (it never runs there).
const useBrowserLayoutEffect = typeof document === "undefined" ? useEffect : useLayoutEffect;

const subscribeToNothing = () => () => undefined;

function boxOf(element: Element): ShellIntroBox {
  const { left, top, width, height } = element.getBoundingClientRect();
  return { left, top, width, height };
}

/** Whether the intro plays now, and between which boxes. The first decision of a session marks it. */
function decideShellIntro(card: HTMLElement | null, scope: ParentNode | null, marker: string): ShellIntroState {
  const view = card?.ownerDocument.defaultView;
  if (!card || !scope || !view) return notPlayed;
  try {
    const storage = view.sessionStorage;
    if (storage.getItem(marker) !== null) return notPlayed;
    storage.setItem(marker, "played");
  } catch {
    // Without sessionStorage the intro cannot be kept to once a session, so it does not play.
    return notPlayed;
  }
  if (typeof view.matchMedia === "function" && view.matchMedia("(prefers-reduced-motion: reduce)").matches) return notPlayed;
  const start = card.querySelector("svg[data-product-mark], svg[data-logo]");
  const landing = scope.querySelector(shellIntroTargets.landing);
  if (!start || !landing || typeof landing.animate !== "function") return notPlayed;
  const from = boxOf(start);
  const to = boxOf(landing);
  if (from.width <= 0 || to.width <= 0) return notPlayed;
  return { status: "playing", from, to };
}

export interface ShellIntroProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** The product signed in to: its mark makes the journey, the mark the brand button shows. */
  productId: TcrnProductMarkId;
  /**
   * The sign-in card as the reader saw it, with the product lockup on it (the mark at the 128
   * tier). The layer shows it for the first phase while it fades; the mark of its lockup is where
   * the journey starts. Without a mark in it, nothing plays.
   */
  card: ReactNode;
  /** The shell the mark lands in (its brand button's mark is the landing); the document when omitted. */
  shellRef?: RefObject<HTMLElement | null>;
  /** The sessionStorage item that marks the session's intro as had; shellIntroSessionMarker when omitted. */
  sessionMarker?: string;
  /** Called once the shell is in its final state: true after the intro played, false when it did not. */
  onFinish?: (played: boolean) => void;
  /** Language of the status the intro says; the page's own when omitted. */
  locale?: TcrnLocale | string;
}

export function ShellIntro({
  productId,
  card,
  shellRef,
  sessionMarker = shellIntroSessionMarker,
  onFinish,
  locale,
  className,
  ...props
}: ShellIntroProps) {
  const mark = tcrnProductMarks.find((candidate) => candidate.productId === productId);
  if (!mark) throw new Error(`ShellIntro: no product mark is generated for "${productId}"`);
  // False on the server and while hydrating, true on a mount in the browser: a server-rendered
  // first screen keeps the band in its final state (07a board, section C).
  const onClient = useSyncExternalStore(subscribeToNothing, () => true, () => false);
  const [state, setState] = useState<ShellIntroState>(() => (onClient ? { status: "deciding" } : notPlayed));
  const [phase, setPhase] = useState<ShellIntroPhase>("fade");
  const layerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const decision = useRef<ShellIntroState | null>(null);
  const finishRef = useRef(onFinish);
  const finished = useRef(false);

  useEffect(() => {
    finishRef.current = onFinish;
  });

  useBrowserLayoutEffect(() => {
    if (state.status !== "deciding") return;
    // Decided once: a second run of this effect (StrictMode) must not read the marker it wrote.
    decision.current ??= decideShellIntro(cardRef.current, shellRef?.current ?? layerRef.current?.ownerDocument ?? null, sessionMarker);
    setState(decision.current);
  }, [state.status]);

  const playing = state.status === "playing";
  useBrowserLayoutEffect(() => {
    if (state.status !== "playing") return undefined;
    const layer = layerRef.current;
    const scope: ParentNode | null = shellRef?.current ?? layer?.ownerDocument ?? null;
    const timeline = shellIntroTimeline();
    const elements: Record<ShellIntroPart, Element[]> = {
      card: cardRef.current ? [cardRef.current] : [],
      mark: layer ? [...layer.querySelectorAll(".tcrn-shell-intro__mark")] : [],
      line: scope ? [...scope.querySelectorAll(shellIntroTargets.line)] : [],
      band: scope ? [...scope.querySelectorAll(shellIntroTargets.band)] : [],
      paper: scope ? [...scope.querySelectorAll(shellIntroTargets.paper)] : []
    };
    const animations: Animation[] = [];
    for (const step of shellIntroPlan(state.from, state.to, timeline)) {
      for (const element of elements[step.part]) animations.push(element.animate([...step.keyframes], { ...step.timing }));
    }
    const timers = [
      setTimeout(() => setPhase("move"), timeline.fade),
      setTimeout(() => setPhase("rise"), timeline.fade + timeline.move),
      setTimeout(() => setState({ status: "done", played: true }), timeline.total)
    ];
    return () => {
      for (const timer of timers) clearTimeout(timer);
      // Finished, not cancelled: whatever is cut short ends where the intro would have left it.
      for (const animation of animations) {
        try {
          animation.finish();
        } catch {
          animation.cancel();
        }
      }
    };
  }, [playing]);

  useEffect(() => {
    if (state.status !== "done" || finished.current) return;
    finished.current = true;
    finishRef.current?.(state.played);
  }, [state]);

  if (state.status === "done") return null;
  const copy = shellIntroCopy[resolveDocumentLocale(locale)];
  return (
    <>
      <div
        {...props}
        ref={layerRef}
        className={cx("tcrn-shell-intro", className)}
        aria-hidden="true"
        data-shell-intro=""
        data-intro-phase={phase}
      >
        <div ref={cardRef} className="tcrn-shell-intro__card" inert>
          {card}
        </div>
        {state.status === "playing" ? (
          <TcrnBrandMark
            productId={productId}
            variant="color"
            className="tcrn-shell-intro__mark"
            aria-hidden="true"
            data-logo={productId}
            style={{ left: state.from.left, top: state.from.top, width: state.from.width, height: state.from.height }}
          />
        ) : null}
      </div>
      <span className="tcrn-sr-only" role="status">
        {state.status === "playing" && phase !== "fade" ? copy.signedIn(mark.name) : ""}
      </span>
    </>
  );
}
