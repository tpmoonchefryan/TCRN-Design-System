import test from "node:test";
import assert from "node:assert/strict";
import { act } from "react";
import { ProductShell, ShellThemeToggle, useProductShellController, type ProductShellNavGroup } from "../index.js";
import { createDomInteractionHarness } from "./dom-harness.js";

/**
 * Where the shell puts a preference the reader just chose.
 *
 * The server-render half of this rule is asserted in `Navigation.test.tsx`: given a
 * request cookie, the controller's first render already carries the reader's theme
 * and locale. That half is only reachable if something wrote the cookie, and the
 * write needs a real `document`, so it is proven here.
 *
 * Storing to `localStorage` alone is the defect a consumer reported — the server
 * cannot read it, so the first paint goes out in the default and corrects itself
 * after hydration, visibly, on every navigation rather than only the first. The
 * assertion is therefore on the cookie specifically, not on "the preference was
 * saved somewhere": the store that made the old behaviour wrong is still written,
 * and a test that accepted either would pass on the broken version.
 *
 * The pins are the other way round (TCRN-DS-SUB-120): the product's backend keeps
 * them, so the shell writes only its local fallback, under the product's own key,
 * and never a cookie.
 */
function PreferenceFixture() {
  const controller = useProductShellController({
    productId: "spec",
    themeStorageKey: "tcrn-spec-theme",
    localeStorageKey: "tcrn-spec-locale"
  });
  return (
    <section>
      <ShellThemeToggle {...controller.shellThemeToggleProps} />
      <button type="button" data-spec-pin="" onClick={() => controller.setPinned("roster", true)}>
        Pin
      </button>
      <output data-spec-state={`${controller.theme}/${controller.pins.join(",") || "none"}`} />
    </section>
  );
}

const cookieValue = (harness: ReturnType<typeof createDomInteractionHarness>, name: string): string | null => {
  for (const pair of harness.document.cookie.split(";")) {
    const separator = pair.indexOf("=");
    if (separator < 0) continue;
    if (pair.slice(0, separator).trim() !== name) continue;
    return decodeURIComponent(pair.slice(separator + 1).trim());
  }
  return null;
};

test("a chosen preference is written where the server can read it", async () => {
  const harness = createDomInteractionHarness();
  const root = harness.document.body.firstElementChild as HTMLElement;
  try {
    await harness.render(<PreferenceFixture />);

    assert.equal(cookieValue(harness, "tcrn-spec-theme"), null, "no cookie before a choice is made");

    const themeToggle = root.querySelector("button.tcrn-shell-theme-toggle") as HTMLElement | null;
    assert.ok(themeToggle, "the shell theme toggle is rendered");
    await harness.dispatchClick(themeToggle);

    assert.equal(
      root.querySelector("output")?.getAttribute("data-spec-state"),
      "dark/none",
      "the controller holds the new theme"
    );
    // The point of the whole rule: a server rendering the next request can see this.
    assert.equal(cookieValue(harness, "tcrn-spec-theme"), "dark");
    // And the client store is still written, because a cookie can be cleared by a
    // privacy setting that keeps site storage. Neither store contains the other.
    assert.equal(harness.window.localStorage.getItem("tcrn-spec-theme"), "dark");

    const pinButton = root.querySelector("[data-spec-pin]") as HTMLElement | null;
    assert.ok(pinButton, "the pin control is rendered");
    await harness.dispatchClick(pinButton);
    assert.equal(root.querySelector("output")?.getAttribute("data-spec-state"), "dark/roster");
    assert.equal(harness.window.localStorage.getItem("tcrn-shell-pins:spec"), JSON.stringify(["roster"]));
    assert.equal(harness.document.cookie.includes("pins"), false, "the pins never go into a cookie");
  } finally {
    await harness.cleanup();
  }
});

/**
 * A reordered pin is a pin preference like any other (TCRN-DS-SUB-149): Alt+← / Alt+→ or a drag
 * in the band reaches the controller through ProductShell's onPinsReorder, movePin puts the one
 * entry that moved in its place, the product is told once and the local fallback is written,
 * and no cookie carries the pins.
 */
const reorderGroups: ProductShellNavGroup[] = ["g1", "g2", "g3"].map((id) => ({
  id,
  label: id.toUpperCase(),
  items: [{ id: `${id}-page`, label: `${id.toUpperCase()} page`, href: `/${id}` }]
}));

function ReorderFixture({ changes }: { changes: string[] }) {
  const controller = useProductShellController({
    productId: "spec-reorder",
    initialPins: ["g1", "g2", "g3"],
    onPinsChange: (pins) => changes.push(pins.join(","))
  });
  return (
    <ProductShell
      productName="TCRN TMS"
      moduleName="Talent"
      brandProductId="tms"
      currentRouteLabel="Roster"
      pageHeader={{ title: "Roster" }}
      navGroups={reorderGroups}
      locales={[{ locale: "en", nativeName: "English" }]}
      {...controller.productShellControlProps}
    >
      <p>page</p>
    </ProductShell>
  );
}

test("a reordered pin is kept in the pins preference: the product is told once, the local fallback is written, no cookie", async () => {
  const harness = createDomInteractionHarness();
  try {
    harness.window.localStorage.clear();
    const original = harness.window.HTMLElement.prototype.getBoundingClientRect;
    harness.window.HTMLElement.prototype.getBoundingClientRect = function (this: HTMLElement) {
      if (!this.hasAttribute("data-pin") || !this.parentElement) return original.call(this);
      const left = Array.from(this.parentElement.children).indexOf(this) * 100;
      return { left, right: left + 90, width: 90, top: 0, bottom: 32, height: 32, x: left, y: 0, toJSON: () => ({}) } as DOMRect;
    };
    const changes: string[] = [];
    await harness.render(<ReorderFixture changes={changes} />);
    const band = () => [...harness.document.querySelectorAll("[data-pins] > [data-pin]")].map((pin) => pin.getAttribute("data-pin"));
    const item = (id: string) => harness.document.querySelector(`[data-pin="${id}"] .tcrn-shell-pins__item`) as HTMLElement;
    assert.deepEqual(band(), ["g1", "g2", "g3"]);

    await act(async () => {
      item("g1").dispatchEvent(new harness.window.KeyboardEvent("keydown", { key: "ArrowRight", altKey: true, bubbles: true, cancelable: true }));
    });
    assert.deepEqual(changes, ["g2,g1,g3"]);
    assert.deepEqual(band(), ["g2", "g1", "g3"]);
    assert.equal(harness.window.localStorage.getItem("tcrn-shell-pins:spec-reorder"), JSON.stringify(["g2", "g1", "g3"]));

    // A drag of the last item to the front.
    const pointer = (type: string, clientX: number) => new harness.window.MouseEvent(type, { bubbles: true, cancelable: true, clientX, clientY: 16, button: 0 });
    await act(async () => {
      item("g3").dispatchEvent(pointer("pointerdown", 245));
      harness.document.dispatchEvent(pointer("pointermove", 20));
      harness.document.dispatchEvent(pointer("pointerup", 20));
    });
    assert.deepEqual(changes, ["g2,g1,g3", "g3,g2,g1"]);
    assert.deepEqual(band(), ["g3", "g2", "g1"]);
    assert.equal(harness.window.localStorage.getItem("tcrn-shell-pins:spec-reorder"), JSON.stringify(["g3", "g2", "g1"]));
    assert.equal(harness.document.cookie.includes("pins"), false, "the pins never go into a cookie");
  } finally {
    await harness.cleanup();
  }
});
