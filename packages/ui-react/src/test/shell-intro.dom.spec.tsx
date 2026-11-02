// ShellIntro in a browser (TCRN-DS-SUB-122; STORY-141 GWT1-GWT4). The first sign-in of a session
// plays the three phases once (120, 240 and 100 on transform and opacity only) and leaves the band
// in its final state; with the session marker there (a reload) and under prefers-reduced-motion it
// plays 0 times; a server-rendered first screen is not replayed on hydration; the mark on the layer
// is the published 04 color mark, opaque, placed on the card's mark and landing on the brand button's;
// the card is inert and the layer hidden, so the keyboard reaches the brand button at once.
import test, { mock } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { publishedMarkBody } from "./published-source.js";
import { act } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { ProductLockup, ShellBrandButton, ShellIntro, shellIntroSessionMarker, type TcrnProductMarkId } from "../index.js";
import { tcrnProductMarks } from "../components/Navigation/product-marks.generated.js";
import { shellIntroCss01 } from "../styles/shell-intro.css.js";
import { createDomInteractionHarness, type DomInteractionHarness } from "./dom-harness.js";

interface AnimateCall {
  readonly element: Element;
  readonly keyframes: Keyframe[];
  readonly options: KeyframeAnimationOptions;
}

const sha256 = (text: string) => createHash("sha256").update(text).digest("hex");

// The 07a board's storyboard at full size: the card's mark at the 128 tier, the brand button's at 22.
const cardMark = { left: 556, top: 146, width: 128, height: 128 };
const brandMark = { left: 18, top: 15, width: 22, height: 22 };

/**
 * jsdom lays nothing out and has neither matchMedia nor the Web Animations API: the boxes of the
 * two marks are the storyboard's, the reduced-motion preference is the test's, and every
 * animate() call is recorded.
 */
function instrument(harness: DomInteractionHarness, reducedMotion = false): AnimateCall[] {
  const calls: AnimateCall[] = [];
  const { window } = harness;
  window.matchMedia = ((query: string) => ({
    matches: reducedMotion && query === "(prefers-reduced-motion: reduce)",
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined
  })) as unknown as typeof window.matchMedia;
  window.Element.prototype.animate = function animate(this: Element, keyframes, options) {
    calls.push({ element: this, keyframes: keyframes as Keyframe[], options: options as KeyframeAnimationOptions });
    return { finish: () => undefined, cancel: () => undefined } as unknown as Animation;
  };
  window.Element.prototype.getBoundingClientRect = function getBoundingClientRect(this: Element) {
    const box = this.closest(".tcrn-shell-intro__card") ? cardMark : this.closest("[data-shell-brand]") ? brandMark : { left: 0, top: 0, width: 0, height: 0 };
    return { ...box, x: box.left, y: box.top, right: box.left + box.width, bottom: box.top + box.height, toJSON: () => box } as DOMRect;
  };
  return calls;
}

function SignInCard({ productId = "tms" }: { productId?: TcrnProductMarkId }) {
  return (
    <form aria-label="Sign in">
      <ProductLockup productId={productId} />
      <input aria-label="Account" />
      <button type="submit">Sign in</button>
    </form>
  );
}

interface ShellProps {
  locale?: string;
  onFinish?: (played: boolean) => void;
  /** The product signed in to; TMS when omitted. */
  productId?: TcrnProductMarkId;
}

/** The band as the top-band shell lays it out (C-5 hooks), with the intro mounted at sign-in. */
function Shell({ locale = "en", onFinish, productId = "tms" }: ShellProps) {
  return (
    <div data-shell="closed">
      <div data-shell-strip="">
        <ShellBrandButton productId={productId} version="v2" locale={locale} />
        <nav data-pins="" aria-label="Pinned">
          <a href="#roster" data-pin="roster">
            Roster
          </a>
        </nav>
        <div data-cluster="">
          <button type="button">Account</button>
        </div>
      </div>
      <main data-paper="">Roster</main>
      <ShellIntro productId={productId} card={<SignInCard productId={productId} />} locale={locale} onFinish={onFinish} />
    </div>
  );
}

/** Which part of the shell or the layer an animate() call moved. */
function partOf(element: Element): string {
  if (element.classList.contains("tcrn-shell-intro__card")) return "card";
  if (element.classList.contains("tcrn-shell-intro__mark")) return "mark";
  if (element.matches("[data-shell-brand] [data-lockup]")) return "line";
  if (element.matches("[data-shell-brand] [data-lockup] > b")) return "word";
  if (element.matches("[data-shell-toggle]")) return "toggle";
  if (element.matches("[data-pins]")) return "pins";
  if (element.matches("[data-cluster]")) return "cluster";
  if (element.matches("[data-paper]")) return "paper";
  return "other";
}

test("the first sign-in of a session plays once: fade, move, rise, then the band in its final state", async () => {
  const harness = createDomInteractionHarness();
  const calls = instrument(harness);
  const finishes: boolean[] = [];
  mock.timers.enable({ apis: ["setTimeout"] });
  try {
    await harness.render(<Shell onFinish={(played) => finishes.push(played)} />);
    const layer = harness.document.querySelector("[data-shell-intro]");
    assert.ok(layer, "the layer is up on the first frame");
    assert.equal(layer.getAttribute("data-intro-phase"), "fade");
    assert.equal(harness.window.sessionStorage.getItem(shellIntroSessionMarker), "played", "the session is marked");

    const phaseAfter = async (ms: number) => {
      await act(async () => {
        mock.timers.tick(ms);
      });
      return harness.document.querySelector("[data-shell-intro]")?.getAttribute("data-intro-phase") ?? null;
    };
    assert.equal(await phaseAfter(119), "fade");
    assert.equal(await phaseAfter(1), "move");
    assert.equal(await phaseAfter(239), "move");
    assert.equal(await phaseAfter(1), "rise");
    assert.equal(await phaseAfter(99), "rise");
    assert.deepEqual(finishes, []);
    assert.equal(await phaseAfter(1), null, "at 460 the layer is gone");
    assert.deepEqual(finishes, [true]);
    assert.equal(harness.document.querySelector("[role='status']"), null);

    // GWT1 and the conformance: transform and opacity only; 120, then 240, then 100; inside 700.
    const timing = Object.fromEntries(calls.map((call) => [partOf(call.element), [call.options.delay, call.options.duration]]));
    assert.deepEqual(timing, {
      card: [0, 120],
      mark: [120, 240],
      line: [0, 360],
      word: [360, 100],
      toggle: [360, 100],
      pins: [360, 100],
      cluster: [360, 100],
      paper: [360, 100]
    });
    const properties = new Set(calls.flatMap((call) => call.keyframes.flatMap((frame) => Object.keys(frame))));
    assert.deepEqual([...properties].sort(), ["opacity", "transform"]);
    const end = Math.max(...calls.map((call) => Number(call.options.delay) + Number(call.options.duration)));
    assert.equal(end, 460);
    assert.ok(end <= 700);
  } finally {
    mock.timers.reset();
    await harness.cleanup();
  }
});

test("a reload in the same session plays 0 times: the marker is read; without it the intro would play again", async () => {
  const harness = createDomInteractionHarness();
  const calls = instrument(harness);
  const finishes: boolean[] = [];
  mock.timers.enable({ apis: ["setTimeout"] });
  try {
    await harness.render(<Shell onFinish={(played) => finishes.push(played)} />);
    await act(async () => {
      mock.timers.tick(460);
    });
    assert.deepEqual(finishes, [true]);
    const played = calls.length;

    // The page reloads: the shell and the intro mount again in the same session.
    await harness.render(<div />);
    await harness.render(<Shell onFinish={(again) => finishes.push(again)} />);
    assert.equal(harness.document.querySelector("[data-shell-intro]"), null, "no layer");
    assert.equal(calls.length, played, "nothing animates");
    assert.deepEqual(finishes, [true, false]);

    // The marker is what keeps it to once a session: taken away, the same mount plays again.
    harness.window.sessionStorage.removeItem(shellIntroSessionMarker);
    await harness.render(<div />);
    await harness.render(<Shell />);
    assert.ok(harness.document.querySelector("[data-shell-intro]"));
    assert.ok(calls.length > played);
  } finally {
    mock.timers.reset();
    await harness.cleanup();
  }
});

test("under prefers-reduced-motion: reduce it plays 0 times and the shell is in its final state at once", async () => {
  const harness = createDomInteractionHarness();
  const calls = instrument(harness, true);
  const finishes: boolean[] = [];
  try {
    await harness.render(<Shell onFinish={(played) => finishes.push(played)} />);
    assert.equal(harness.document.querySelector("[data-shell-intro]"), null, "no layer");
    assert.equal(harness.document.querySelector("[role='status']"), null);
    assert.equal(calls.length, 0, "nothing animates");
    assert.deepEqual(finishes, [false]);
    assert.equal(harness.window.sessionStorage.getItem(shellIntroSessionMarker), "played", "the sign-in moment is spent");
  } finally {
    await harness.cleanup();
  }
});

test("a server-rendered first screen is not replayed on hydration: the band stays final", async () => {
  const harness = createDomInteractionHarness();
  const calls = instrument(harness);
  const finishes: boolean[] = [];
  const roots: Root[] = [];
  const host = harness.document.createElement("div");
  harness.document.body.append(host);
  try {
    host.innerHTML = renderToString(<Shell />);
    assert.equal(host.querySelector("[data-shell-intro]"), null, "the server renders no layer");
    await act(async () => {
      roots.push(hydrateRoot(host, <Shell onFinish={(played) => finishes.push(played)} />));
    });
    assert.equal(host.querySelector("[data-shell-intro]"), null, "nor does hydration put one up");
    assert.equal(calls.length, 0);
    assert.deepEqual(finishes, [false]);
    assert.equal(harness.window.sessionStorage.getItem(shellIntroSessionMarker), null, "the session is not marked");
  } finally {
    await act(async () => {
      for (const root of roots) root.unmount();
    });
    await harness.cleanup();
  }
});

test("the mark on the layer is the published 04 color mark, opaque, placed on the card's mark and landing on the brand button's", async () => {
  const harness = createDomInteractionHarness();
  const calls = instrument(harness);
  mock.timers.enable({ apis: ["setTimeout"] });
  try {
    await harness.render(<Shell />);
    const flying = harness.document.querySelector("[data-shell-intro] svg[data-logo='tms']");
    assert.ok(flying, "the layer draws the product's mark");
    assert.equal(flying.getAttribute("class"), "tcrn-brand-mark tcrn-shell-intro__mark");
    assert.equal(flying.getAttribute("data-product-mark-variant"), "color");

    // GWT4: the normalized published SVG. jsdom re-serialises what it parsed, so the file's body goes
    // through the same parser before the two are compared.
    const mark = tcrnProductMarks.find((candidate) => candidate.productId === "tms");
    assert.ok(mark);
    const body = publishedMarkBody(mark.id);
    const probe = harness.document.createElementNS("http://www.w3.org/2000/svg", "svg");
    probe.innerHTML = body;
    assert.equal(sha256(flying.innerHTML), sha256(probe.innerHTML), "the flying mark is the file's");
    const landing = harness.document.querySelector("[data-shell-brand] svg[data-logo='tms']");
    assert.ok(landing);
    assert.equal(flying.innerHTML, landing.innerHTML, "and the brand button's: one mark, 128 to 22");

    // Placed on the card's mark, it travels by translate and scale onto the brand button's mark.
    const style = (flying as SVGElement).style;
    assert.deepEqual([style.left, style.top, style.width, style.height], ["556px", "146px", "128px", "128px"]);
    const travel = calls.find((call) => call.element === flying);
    assert.ok(travel);
    assert.deepEqual(travel.keyframes, [{ transform: "none" }, { transform: "translate(-538px, -131px) scale(0.171875)" }]);
    assert.equal(travel.options.fill, "forwards");

    // In colour all the way: neither the flying mark nor any mark in the shell is faded.
    assert.ok(calls.every((call) => !call.element.matches("svg") || call.keyframes.every((frame) => !("opacity" in frame))));
    assert.equal(flying.getAttribute("aria-hidden"), "true");
  } finally {
    mock.timers.reset();
    await harness.cleanup();
  }
});

// The design system and Mana Orchestrate are the two products whose key is not their mark's id: the
// flying mark writes the mark's id in data-logo (ds, mana), the brand button's landing mark does too
// (TCRN-DS-SUB-212), and the SVG is still drawn from the product key (TCRN-DS-SUB-214).
for (const [productId, markId] of [
  ["design-system", "ds"],
  ["mana-orchestrate", "mana"]
] as const) {
  test(`the flying mark of ${productId} writes its mark's id, ${markId}, in data-logo and draws the published 04 ${markId} SVG (TCRN-DS-SUB-214)`, async () => {
    const harness = createDomInteractionHarness();
    instrument(harness);
    mock.timers.enable({ apis: ["setTimeout"] });
    try {
      await harness.render(<Shell productId={productId} />);
      const flying = harness.document.querySelector("[data-shell-intro] svg.tcrn-shell-intro__mark");
      assert.ok(flying, "the layer draws the product's mark");
      assert.equal(flying.getAttribute("data-logo"), markId, "data-logo is the mark's id, not the product key");
      assert.equal(flying.getAttribute("data-product-mark"), productId, "the SVG is drawn from the product key");
      assert.equal(flying.getAttribute("data-product-mark-variant"), "color");

      const mark = tcrnProductMarks.find((candidate) => candidate.productId === productId);
      assert.ok(mark);
      assert.equal(mark.id, markId);
      const body = publishedMarkBody(markId);
      const probe = harness.document.createElementNS("http://www.w3.org/2000/svg", "svg");
      probe.innerHTML = body;
      assert.equal(sha256(flying.innerHTML), sha256(probe.innerHTML), "the flying mark is the file's");
      const landing = harness.document.querySelector(`[data-shell-brand] svg[data-logo='${markId}']`);
      assert.ok(landing, "the brand button's mark writes the same id");
      assert.equal(flying.innerHTML, landing.innerHTML, "one mark, 128 to 22");
    } finally {
      mock.timers.reset();
      await harness.cleanup();
    }
  });
}

test("input is not held up: the card is inert, the layer hidden, the brand button reachable; the status speaks five languages", async () => {
  const expected: Record<string, string> = {
    en: "Signed in to TCRN TMS",
    "zh-CN": "已登录 TCRN TMS",
    ja: "TCRN TMS にサインインしました",
    ko: "TCRN TMS에 로그인했습니다",
    fr: "Connecté à TCRN TMS"
  };
  const harness = createDomInteractionHarness();
  instrument(harness);
  mock.timers.enable({ apis: ["setTimeout"] });
  try {
    // jsdom can read the real layer CSS and phases, but has no physical pointer hit-testing.
    // Programmatic focus below remains keyboard evidence only.
    const style = harness.document.createElement("style");
    style.textContent = shellIntroCss01;
    harness.document.head.append(style);
    for (const [locale, text] of Object.entries(expected)) {
      harness.window.sessionStorage.clear();
      await harness.render(<div />);
      await harness.render(<Shell key={locale} locale={locale} />);
      const layer = harness.document.querySelector("[data-shell-intro]");
      assert.ok(layer, `${locale}: the layer is up`);
      assert.equal(layer.getAttribute("data-intro-phase"), "fade");
      assert.equal(harness.window.getComputedStyle(layer).pointerEvents, "none", "the initial decorative layer passes the pointer through");
      assert.equal(layer.getAttribute("aria-hidden"), "true", "the layer is decoration");
      assert.equal(layer.querySelector(".tcrn-shell-intro__card")?.hasAttribute("inert"), true, "the card takes no focus and no press");
      assert.equal(layer.querySelectorAll("a, button, input, [tabindex]").length > 0, true, "the card is the reader's own, form and all");
      const button = harness.document.querySelector("[data-shell-brand]");
      assert.ok(button instanceof harness.window.HTMLButtonElement);
      assert.equal(button.closest("[aria-hidden='true'], [inert]"), null, "the brand button is outside the layer");
      button.focus();
      assert.equal(harness.document.activeElement, button, "the keyboard reaches the brand button during the intro");
      assert.equal(harness.document.querySelector("[role='status']")?.textContent, "", "nothing is said while the card is still up");
      await act(async () => {
        mock.timers.tick(120);
      });
      assert.equal(layer.getAttribute("data-intro-phase"), "move");
      assert.equal(harness.window.getComputedStyle(layer).pointerEvents, "none", "the moving layer keeps pointer pass-through");
      assert.equal(harness.document.querySelector("[role='status']")?.textContent, text, `${locale}: the status says it`);
      await act(async () => {
        mock.timers.tick(240);
      });
      assert.equal(layer.getAttribute("data-intro-phase"), "rise");
      assert.equal(harness.window.getComputedStyle(layer).pointerEvents, "none", "the rising layer keeps pointer pass-through");
      await act(async () => {
        mock.timers.tick(100);
      });
      assert.equal(harness.document.querySelector("[data-shell-intro]"), null);
    }
    assert.equal(new Set(Object.values(expected)).size, 5);
  } finally {
    mock.timers.reset();
    await harness.cleanup();
  }
});
