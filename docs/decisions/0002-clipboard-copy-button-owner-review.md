# 0002 - ClipboardCopyButton Owner Review

Date: 2026-06-27

## Decision

`ClipboardCopyButton` is admitted as a package-backed `@tcrn/ui-react` component after Owner Review for the bounded clipboard action contract.

This admission authorizes:

- a native-button clipboard action component;
- `navigator.clipboard.writeText` as the only clipboard write path;
- fail-closed `unsupported` behavior when the Clipboard API is unavailable;
- local state readback through `"idle" | "copying" | "copied" | "failed" | "unsupported"`;
- Storybook/static contract documentation for the component-library surface.

## Required Boundaries

- No clipboard reads.
- No `document.execCommand` fallback.
- No automatic copy on mount, hover, focus, timer, or layout.
- No arbitrary wrapper/render-prop component shape.
- No raw copied text in callbacks, logs, DOM attributes, disabled reasons, or Storybook claims.
- No product-level authorization, RBAC, telemetry, secret policy, or value-selection logic in the Design System component.

## Non-Claims

This decision does not claim package publication, Storybook/docs publication, hosted-doc readiness, CI gate admission, AOS/TMS product adoption, product acceptance, release readiness, or Batch Push Gate completion.
