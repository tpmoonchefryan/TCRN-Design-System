import test from "node:test";
import assert from "node:assert/strict";
import { ShellThemeToggle, useProductShellController } from "../index.js";
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
