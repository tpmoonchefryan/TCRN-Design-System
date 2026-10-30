import test from "node:test";
import assert from "node:assert/strict";
import { act } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { chromium } from "@playwright/test";
import { tcrnTokenCss } from "@tcrn/ui-tokens";
import { Button, FilterBar, TableToolbar, Tooltip, tcrnComponentCss } from "../index.js";
import { createDomInteractionHarness } from "./dom-harness.js";

test("static SSR previews have visible four-way placement using only package CSS; FilterBar keeps both owning layouts", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    for (const placement of ["top", "right", "bottom", "left"] as const) {
      const html = renderToStaticMarkup(<Tooltip staticPreview placement={placement} content="Supplemental detail"><button type="button">Inspect</button></Tooltip>);
      await page.setContent(`<style>${tcrnTokenCss}${tcrnComponentCss}</style><div style="position:absolute;left:300px;top:200px">${html}</div>`);
      const geometry = await page.locator(".tcrn-tooltip").evaluate((wrapper) => {
        const trigger = wrapper.querySelector("button")!;
        const layer = wrapper.querySelector<HTMLElement>('[role="tooltip"]')!;
        const a = trigger.getBoundingClientRect(), b = layer.getBoundingClientRect();
        const css = getComputedStyle(layer);
        return { opacity: css.opacity, pointerEvents: css.pointerEvents, linked: trigger.getAttribute("aria-describedby") === layer.id,
          ax: a.x, ay: a.y, ar: a.right, ab: a.bottom, acx: a.x + a.width / 2, acy: a.y + a.height / 2,
          bx: b.x, by: b.y, br: b.right, bb: b.bottom, bcx: b.x + b.width / 2, bcy: b.y + b.height / 2 };
      });
      assert.equal(geometry.opacity, "1");
      assert.equal(geometry.pointerEvents, "none");
      assert.equal(geometry.linked, true);
      if (placement === "top" || placement === "bottom") {
        assert.ok(Math.abs(geometry.acx - geometry.bcx) < 0.1);
        assert.ok(Math.abs((placement === "top" ? geometry.ay - geometry.bb : geometry.by - geometry.ab) - 6) < 0.1);
      } else {
        assert.ok(Math.abs(geometry.acy - geometry.bcy) < 0.1);
        assert.ok(Math.abs((placement === "left" ? geometry.ax - geometry.br : geometry.bx - geometry.ar) - 8) < 0.1);
      }
    }
    for (const width of [390, 1240]) {
      const filters = renderToStaticMarkup(<>
        <FilterBar label="Standalone filters">{Array.from({ length: 8 }, (_, i) => <Button key={i} size="sm" variant="secondary">Team {i + 1}</Button>)}</FilterBar>
        <TableToolbar label="Table tools" controlsId="rows" searchLabel="Search rows" filterOptions={Array.from({ length: 8 }, (_, i) => ({ id: `team-${i}`, label: `Team ${i + 1}` }))} />
      </>);
      await page.setContent(`<style>${tcrnTokenCss}${tcrnComponentCss}</style><div style="width:${width}px">${filters}</div>`);
      const layouts = await page.locator(".tcrn-filter-bar").evaluateAll((bars) => bars.map((bar) => {
        const css = getComputedStyle(bar); const rect = bar.getBoundingClientRect();
        return { display: css.display, wrap: css.flexWrap, gap: css.gap, minWidth: css.minWidth, align: css.alignItems, width: rect.width,
          rows: new Set([...bar.children].map((child) => child.getBoundingClientRect().top)).size };
      }));
      assert.equal(layouts.length, 2);
      assert.equal(layouts[0].display, "flex");
      assert.equal(layouts[0].wrap, "wrap");
      assert.equal(layouts[0].gap, "6px");
      assert.equal(layouts[0].minWidth, "0px");
      assert.ok(layouts[0].width <= width);
      assert.equal(layouts[0].rows > 1, width === 390, "standalone wraps at its actual narrow owning width");
      assert.equal(layouts[1].display, "flex");
      assert.equal(layouts[1].wrap, "wrap");
      assert.equal(layouts[1].gap, "4px");
      assert.equal(layouts[1].align, "center");
      assert.ok(layouts[1].width <= width);
    }
  } finally {
    await browser.close();
  }
});

test("static preview portals keep linkage and reposition at viewport and scrolling boundaries", async () => {
  const h = createDomInteractionHarness();
  let anchor = { x: 280, y: 1, width: 30, height: 24 };
  const proto = h.window.HTMLElement.prototype;
  const originalRect = proto.getBoundingClientRect;
  proto.getBoundingClientRect = function () {
    if (this.matches(".tcrn-tooltip")) return new h.window.DOMRect(anchor.x, anchor.y, anchor.width, anchor.height);
    if (this.matches(".tcrn-tooltip__content")) return new h.window.DOMRect(0, 0, 100, 40);
    return originalRect.call(this);
  };
  Object.defineProperty(h.window, "innerWidth", { configurable: true, value: 320 });
  Object.defineProperty(h.window, "innerHeight", { configurable: true, value: 240 });
  try {
    await h.render(<div style={{ overflow: "hidden" }}><Tooltip staticPreview placement="top" content="Detail"><button type="button">Inspect</button></Tooltip></div>);
    const layer = h.document.querySelector<HTMLElement>('[role="tooltip"]')!;
    const trigger = h.document.querySelector("button")!;
    assert.equal(layer.parentElement, h.portalRoot, "the layer escapes the clipping ancestor");
    assert.equal(trigger.getAttribute("aria-describedby"), layer.id);
    assert.equal(layer.dataset.tooltipOpen, "true");
    assert.equal(layer.dataset.tooltipPlacement, "bottom", "top boundary flips the requested placement");
    assert.equal(layer.style.visibility, "visible");
    assert.ok(parseFloat(layer.style.left) + 100 <= 320);
    await h.dispatchKeydown(trigger, "Escape");
    assert.equal(layer.dataset.tooltipOpen, "true", "a static specimen is not Escape-dismissible");
    anchor = { ...anchor, x: 100, y: 180 };
    await act(async () => { h.window.dispatchEvent(new h.window.Event("scroll")); });
    assert.equal(layer.dataset.tooltipPlacement, "top");
    assert.equal(layer.style.top, "140px", "scroll reads the current anchor rect");
    Object.defineProperty(h.window, "innerWidth", { configurable: true, value: 180 });
    await act(async () => { h.window.dispatchEvent(new h.window.Event("resize")); });
    assert.ok(parseFloat(layer.style.left) + 100 <= 180);
  } finally {
    proto.getBoundingClientRect = originalRect;
    await h.cleanup();
  }
});

test("ordinary Tooltip keeps hover, focus, blur, mouseleave and Escape behavior", async () => {
  const h = createDomInteractionHarness();
  try {
    await h.render(<Tooltip content="Detail"><button type="button">Inspect</button></Tooltip>);
    const wrapper = h.document.querySelector<HTMLElement>(".tcrn-tooltip")!;
    const layer = h.document.querySelector<HTMLElement>('[role="tooltip"]')!;
    const trigger = h.document.querySelector<HTMLButtonElement>("button")!;
    assert.equal(layer.dataset.tooltipOpen, undefined);
    await act(async () => { wrapper.dispatchEvent(new h.window.MouseEvent("mouseover", { bubbles: true })); });
    assert.equal(layer.dataset.tooltipOpen, "true");
    await act(async () => { wrapper.dispatchEvent(new h.window.MouseEvent("mouseout", { bubbles: true, relatedTarget: h.document.body })); });
    assert.equal(layer.dataset.tooltipOpen, undefined);
    await act(async () => { trigger.focus(); });
    assert.equal(layer.dataset.tooltipOpen, "true");
    await h.dispatchKeydown(trigger, "Escape");
    assert.equal(layer.dataset.tooltipOpen, undefined);
    await act(async () => { trigger.blur(); trigger.focus(); });
    assert.equal(layer.dataset.tooltipOpen, "true");
    await act(async () => { trigger.blur(); });
    assert.equal(layer.dataset.tooltipOpen, undefined);
  } finally {
    await h.cleanup();
  }
});
