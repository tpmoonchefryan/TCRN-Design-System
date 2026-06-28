import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { Icon, tcrnIconNames } from "./Icon.js";

test("icon primitive wraps the approved icon library through package exports", () => {
  assert.ok(tcrnIconNames.includes("search"));
  assert.ok(tcrnIconNames.includes("menu"));
  assert.ok(tcrnIconNames.includes("panel-left-close"));
  assert.ok(tcrnIconNames.includes("sun"));
  assert.ok(tcrnIconNames.includes("moon"));
  assert.ok(tcrnIconNames.includes("globe-2"));

  const decorative = renderToStaticMarkup(<Icon name="search" />);
  assert.match(decorative, /class="[^"]*tcrn-icon/);
  assert.match(decorative, /data-icon-name="search"/);
  assert.match(decorative, /aria-hidden="true"/);

  const named = renderToStaticMarkup(<Icon name="menu" decorative={false} title="Open navigation" />);
  assert.match(named, /role="img"/);
  assert.match(named, /aria-label="Open navigation"/);
  assert.doesNotMatch(named, /aria-hidden="true"/);
});
