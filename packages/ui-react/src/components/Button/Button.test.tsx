import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { Button, IconButton } from "./Button.js";

test("core primitives render normalized class names and accessibility attributes", () => {
  assert.match(renderToStaticMarkup(<Button>Save</Button>), /tcrn-button--secondary/);
});

test("disabled controls and icon buttons fail closed with accessible names", () => {
  const disabled = renderToStaticMarkup(<Button disabled>Publish</Button>);
  assert.match(disabled, /data-disabled-reason="Action unavailable in this route"/);
  assert.match(disabled, /title="Action unavailable in this route"/);
  assert.match(disabled, /aria-describedby="[^"]+"/);
  assert.match(disabled, /class="tcrn-sr-only"/);
  assert.match(disabled, /Action unavailable in this route/);
  assert.doesNotMatch(disabled, /PublishRequires|PublishAction unavailable/);

  const icon = renderToStaticMarkup(<IconButton ariaLabel="   " iconName="menu" />);
  assert.match(icon, /aria-label="Unnamed icon action"/);
  assert.match(icon, /data-icon-name="menu"/);
});
