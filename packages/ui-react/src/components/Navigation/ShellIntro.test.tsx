// ShellIntro (TCRN-DS-SUB-122; STORY-141): what a static read can hold. The server renders no layer
// (the band is in its final state); the timing is the motion intro tokens' (120, 240 and 100, 460
// under 700); the plan moves nothing but transform and opacity and lands the mark on the brand
// button's mark; the segment places the layer and animates nothing. The behaviour in a browser
// (once a session, none on reload or under reduced motion, the colour mark on the layer) is
// test/shell-intro.dom.spec.tsx's; the rendered trace is the shell gate's (TCRN-DS-SUB-137).
import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { createTokenMap } from "@tcrn/ui-tokens";
import { tcrnComponentCss } from "../../styles/index.js";
import { shellCss04 } from "../../styles/shell.css.js";
import { shellIntroCss01 } from "../../styles/shell-intro.css.js";
import { ProductLockup } from "./Navigation.js";
import { ShellIntro, shellIntroPlan, shellIntroTimeline, type ShellIntroBox, type ShellIntroPart, type ShellIntroStep } from "./ShellIntro.js";

const tokens = createTokenMap();
const amount = (variable: string) => Number.parseFloat(tokens[variable]);

// The 07a board's storyboard at full size: the card's mark at the 128 tier in the middle of the
// 1240 by 640 screen, the brand button's mark at 22 in the band (the button at 12, 6 and its mark
// 6 in from its start edge and centred on its 40).
const cardMark: ShellIntroBox = { left: 556, top: 146, width: 128, height: 128 };
const brandMark: ShellIntroBox = { left: 18, top: 15, width: 22, height: 22 };

function stepOf(plan: readonly ShellIntroStep[], part: ShellIntroPart): ShellIntroStep {
  const step = plan.find((candidate) => candidate.part === part);
  assert.ok(step, `the plan moves the ${part}`);
  return step;
}

test("on the server nothing renders: a server-rendered first screen keeps the band in its final state", () => {
  const html = renderToStaticMarkup(<ShellIntro productId="tms" card={<ProductLockup productId="tms" />} locale="zh-CN" />);
  assert.equal(html, "");
});

test("an unknown product is refused, as the brand button refuses it", () => {
  assert.throws(
    () => renderToStaticMarkup(<ShellIntro productId={"aos" as unknown as "tms"} card={null} />),
    /no product mark is generated for "aos"/
  );
});

test("the three phases take the motion intro tokens: 120, 240 and 100, 460 in all under 700", () => {
  const timeline = shellIntroTimeline();
  assert.deepEqual(
    { fade: timeline.fade, move: timeline.move, rise: timeline.rise, total: timeline.total, max: timeline.max },
    { fade: 120, move: 240, rise: 100, total: 460, max: 700 }
  );
  assert.equal(timeline.fade, amount("--tcrn-motion-intro-fade"));
  assert.equal(timeline.move, amount("--tcrn-motion-intro-move"));
  assert.equal(timeline.rise, amount("--tcrn-motion-intro-rise"));
  assert.equal(timeline.max, amount("--tcrn-motion-intro-max"));
  assert.ok(timeline.total <= timeline.max);
  assert.equal(timeline.easing, tokens["--tcrn-motion-ease"]);
});

test("the plan moves transform and opacity only, one phase after another, and ends inside the ceiling", () => {
  const timeline = shellIntroTimeline();
  const plan = shellIntroPlan(cardMark, brandMark, timeline);
  const properties = new Set(plan.flatMap((step) => step.keyframes.flatMap((frame) => Object.keys(frame))));
  assert.deepEqual([...properties].sort(), ["opacity", "transform"]);
  const span = (part: ShellIntroPart) => {
    const { delay, duration } = stepOf(plan, part).timing;
    return [delay, delay + duration];
  };
  assert.deepEqual(span("card"), [0, 120], "the card fades first");
  assert.deepEqual(span("mark"), [120, 360], "then the mark travels");
  assert.deepEqual(span("line"), [0, 360], "the brand button's line is held back until the mark lands");
  assert.deepEqual(span("band"), [360, 460], "then the wordmark, the toggle, the pinned items and the cluster come in");
  assert.deepEqual(span("paper"), [360, 460], "while the paper rises");
  for (const step of plan) {
    assert.equal(step.timing.easing, tokens["--tcrn-motion-ease"], `${step.part} runs on the one curve`);
    assert.ok(step.timing.delay + step.timing.duration <= timeline.max, `${step.part} ends under the ceiling`);
  }
  assert.deepEqual(stepOf(plan, "card").keyframes, [{ opacity: 1 }, { opacity: 0 }]);
  assert.deepEqual(stepOf(plan, "band").keyframes, [{ opacity: 0 }, { opacity: 1 }]);
  assert.deepEqual(stepOf(plan, "line").keyframes, [{ opacity: 0 }, { opacity: 0 }]);
  assert.equal(stepOf(plan, "band").timing.fill, "backwards", "held back from the first frame");
  assert.equal(stepOf(plan, "paper").timing.fill, "backwards", "held back from the first frame");
});

test("the mark lands exactly on the brand button's mark and is never faded: no jump when the layer goes", () => {
  for (const to of [brandMark, { left: 12 + 6, top: 6 + 9, width: 22, height: 22 }, { left: 200.5, top: 40.25, width: 22, height: 22 }]) {
    const mark = stepOf(shellIntroPlan(cardMark, to), "mark");
    assert.deepEqual(mark.keyframes[0], { transform: "none" }, "it starts on the card's mark");
    const travel = /^translate\((-?[\d.]+)px, (-?[\d.]+)px\) scale\(([\d.]+)\)$/.exec(String(mark.keyframes[1].transform));
    assert.ok(travel, "it travels by translate and scale alone");
    const [x, y, scale] = travel.slice(1).map(Number);
    // Scaling from the top left corner: the corner moves by the translation, the size by the scale.
    assert.ok(Math.abs(cardMark.left + x - to.left) < 1e-9 && Math.abs(cardMark.top + y - to.top) < 1e-9, "its corner lands on the mark's");
    assert.ok(Math.abs(cardMark.width * scale - to.width) < 1e-9 && Math.abs(cardMark.height * scale - to.height) < 1e-9, "128 becomes 22");
    assert.equal(mark.timing.fill, "forwards", "and stays there until the layer goes");
    assert.ok(mark.keyframes.every((frame) => !("opacity" in frame)), "the mark is opaque from start to end");
  }
});

test("the paper rises by the space-2h token while it comes in", () => {
  const paper = stepOf(shellIntroPlan(cardMark, brandMark), "paper");
  assert.equal(tokens["--tcrn-space-2h"], "10px");
  assert.deepEqual(paper.keyframes, [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }]);
});

test("the segment places the layer and animates nothing; the pointer goes through from the initial phase", () => {
  assert.doesNotMatch(shellIntroCss01, /transition|animation|@keyframes/, "only the Web Animations of the plan move anything");
  assert.doesNotMatch(shellIntroCss01, /opacity|filter|color|background/, "no fade, filter or colour of its own");
  const rule = (selector: string) => {
    const match = new RegExp(`\\n${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{\\n([^}]*)\\}`).exec(shellIntroCss01);
    assert.ok(match, `${selector} has a rule`);
    return match[1];
  };
  const layer = rule(".tcrn-shell-intro");
  assert.match(layer, /^ {2}position: fixed;\n {2}inset: 0;\n {2}z-index: var\(--tcrn-z-overlay\);/);
  assert.match(layer, /\n {2}pointer-events: none;/);
  assert.equal(rule('.tcrn-shell-intro:where([data-intro-phase="move"], [data-intro-phase="rise"])').trim(), "pointer-events: none;");
  assert.match(rule(".tcrn-shell-intro__mark"), /^ {2}position: fixed;\n {2}margin: 0;\n {2}transform-origin: 0 0;/);
  assert.ok(rule(".tcrn-shell-intro__card"));
  // Joined after the shell segments (C-8): the shell parts first, the intro after them.
  const intro = tcrnComponentCss.indexOf(shellIntroCss01);
  assert.ok(intro > tcrnComponentCss.indexOf(shellCss04) && tcrnComponentCss.indexOf(shellCss04) >= 0);
});
