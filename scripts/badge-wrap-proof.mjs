#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
// TCRN-DS-INC-013 — the wrapping dot belongs to the first line, while the
// ordinary single-line badge keeps its geometric-center safety band.

import { chromium } from "@playwright/test";
import { tcrnComponentCss } from "../packages/ui-react/dist/index.js";

const html = `<!doctype html><style>
  :root {
    --tcrn-space-0h: 2px;
    --tcrn-space-2: 8px;
    --tcrn-space-2h: 10px;
    --tcrn-state-dot-size: 6px;
    --tcrn-state-chip-padding: 3px 8px 3px 6px;
    --tcrn-radius-control: 4px;
    --tcrn-color-surface-muted: #f2f2f0;
    --tcrn-color-text-secondary: #55575e;
    --tcrn-color-state-warning-bg: #f5eee1;
    --tcrn-color-state-warning: #8a5a08;
  }
  body { margin: 0; font: 11px sans-serif; }
  .fixture { width: 110px; }
  .fixture .tcrn-badge--wrap { inline-size: 60px; }
  ${tcrnComponentCss}
</style>
<div class="fixture"><span class="tcrn-badge tcrn-badge--warning tcrn-badge--wrap"><span class="tcrn-badge__label">pending acceptance</span></span></div>
<div class="fixture"><span class="tcrn-badge tcrn-badge--warning"><span class="tcrn-badge__label">ready</span></span></div>`;

async function measure(cssOverride) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const source = cssOverride === undefined ? html : html.replace(tcrnComponentCss, cssOverride);
  await page.setContent(source);
  const result = await page.evaluate(() => {
    const badges = [...document.querySelectorAll(".tcrn-badge")];
    const wrap = badges[0];
    const single = badges[1];
    const label = wrap.querySelector(".tcrn-badge__label");
    const textNode = label?.firstChild;
    const firstLine = textNode ? document.createRange() : null;
    if (firstLine && textNode) {
      firstLine.setStart(textNode, 0);
      firstLine.setEnd(textNode, Math.min(7, textNode.textContent?.length ?? 0));
    }
    const wrapRect = wrap.getBoundingClientRect();
    const singleRect = single.getBoundingClientRect();
    const before = getComputedStyle(wrap, "::before");
    const singleBefore = getComputedStyle(single, "::before");
    const firstLineRect = firstLine?.getClientRects()[0];
    const dotSize = Number.parseFloat(before.width);
    const wrapDotCenter = wrapRect.top + Number.parseFloat(before.insetBlockStart) + Number.parseFloat(before.marginBlockStart) + dotSize / 2;
    const firstLineCenter = firstLineRect ? firstLineRect.top + firstLineRect.height / 2 : Number.NaN;
    const singleDotCenter = singleRect.top + Number.parseFloat(singleBefore.insetBlockStart) + Number.parseFloat(singleBefore.marginBlockStart) + Number.parseFloat(singleBefore.width) / 2;
    const singleBoxCenter = singleRect.top + singleRect.height / 2;
    return { wrapHeight: wrapRect.height, wrapDeltaPx: Math.abs(wrapDotCenter - firstLineCenter), singleDeltaPx: Math.abs(singleDotCenter - singleBoxCenter), firstLineCenter, wrapDotCenter, singleDotCenter, singleBoxCenter, beforeTop: before.top, beforeInsetBlockStart: before.insetBlockStart, beforeMarginBlockStart: before.marginBlockStart };
  });
  await browser.close();
  return result;
}

const fixed = await measure();
const brokenCss = tcrnComponentCss.replace(
  /\.tcrn-badge--wrap::before\s*\{\s*inset-block-start:\s*var\(--tcrn-space-2h\);\s*\}/u,
  ".tcrn-badge--wrap::before { inset-block-start: 50%; }"
);
const broken = await measure(brokenCss);
const result = {
  schemaVersion: "tcrn.ds.badge-wrap-proof.v1",
  ok: fixed.wrapDeltaPx <= 1 && fixed.singleDeltaPx <= 1 && broken.wrapDeltaPx > 1,
  fixed,
  broken,
  safetyBand: "single-line center unchanged; reverting the wrap override must fail"
};
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
if (!result.ok) process.exitCode = 1;
