import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { BrandIcon, tcrnBrandIconNames, tcrnBrandIcons } from "./BrandIcon.js";
import { tcrnIconNames } from "./Icon.js";

test("BrandIcon stays separate from the closed 38-icon UI stroke roster and renders filled github mark", () => {
  assert.equal(tcrnIconNames.length, 38);
  assert.equal((tcrnIconNames as readonly string[]).includes("github"), false);
  assert.deepEqual([...tcrnBrandIconNames], ["github"]);
  assert.equal(tcrnBrandIcons.github.viewBox, "0 0 16 16");

  const decorative = renderToStaticMarkup(<BrandIcon name="github" size="sm" />);
  assert.match(decorative, /class="tcrn-brand-icon"/);
  assert.match(decorative, /width="14" height="14"/);
  assert.match(decorative, /fill="currentColor" stroke="none"/);
  assert.match(decorative, /aria-hidden="true"/);
  assert.match(decorative, /data-brand-icon-name="github"/);

  const labelled = renderToStaticMarkup(<BrandIcon name="github" size="lg" title="GitHub" />);
  assert.match(labelled, /width="20" height="20"/);
  assert.match(labelled, /role="img"/);
  assert.match(labelled, /aria-label="GitHub"/);
  assert.doesNotMatch(labelled, /aria-hidden="true"/);

  assert.throws(() => renderToStaticMarkup(<BrandIcon name={"unknown" as never} />), /unregistered brand icon/);
});
