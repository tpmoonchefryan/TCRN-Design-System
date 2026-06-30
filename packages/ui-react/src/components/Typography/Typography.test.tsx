import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { Heading } from "./Typography.js";

test("heading can separate semantic level from visual level", () => {
  const markup = renderToStaticMarkup(<Heading level={1} visualLevel={2}>Operations Cockpit</Heading>);
  assert.match(markup, /^<h1 /);
  assert.match(markup, /tcrn-heading--2/);
  assert.doesNotMatch(markup, /tcrn-heading--1/);
});
