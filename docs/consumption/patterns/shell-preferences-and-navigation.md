# Existing shell preferences and navigation interfaces

This is a technical description of the existing shell interface, audited in
INIT-086 package A. It grants no production release or new visual authority.
`@tcrn/ui-react/approved` exports the existing controller and, in this candidate,
also exposes its `ProductShellControllerConfig`, `ProductShellRequestPreferences`,
`ProductShellProps`, `ProductShellNavItem` and `ProductShellNavGroup` types.
There is no new runtime entry or storage service.

## Pins owned by the product

The existing interfaces are:

```ts
requestPreferences?: {
  pins?: readonly string[];
  theme?: "light" | "dark";
  locale?: "zh-CN" | "en" | "ja" | "ko" | "fr";
};
onPinsChange?: (pins: readonly string[]) => void;
```

`setPinned(id, pinned)` appends or removes an identifier; `movePin(id, index)` and
`reorderPins(orderedIds)` preserve the entire ordered preference. The controller
deduplicates changes and notifies once per actual move. The band displays six;
additional identifiers remain stored and are reachable through the full menu.
`ProductShell` preserves identifiers missing from a temporarily filtered menu
when ordering its visible pins. Changing the actual pin list during a pointer
drag now cancels the obsolete drag before it can report a stale order.

Initialization prefers `requestPreferences.pins`, then the optional local
fallback, then `initialPins`, then `[]`. Request preferences seed a mount; they
are not a reactive replacement command. Mount the account/product controller
under a key derived from the authenticated identity and product, and supply the
resolved preference before rendering it. Switching identities must retire the
previous controller. The backend derives the user and tenant from authenticated
session context, not a client-supplied user id. Product ids are explicit.

For the authenticated product adapter, omit `productId` and `pinsStorageKey` on
the controller if browser fallback is not wanted. This disables the local pins
store while leaving the server seed and callbacks intact; the brand product is
still supplied to `ProductShell` separately. If the product deliberately enables
a browser fallback, give `pinsStorageKey` an explicit user/tenant/product
namespace. The implicit `tcrn-shell-pins:<productId>` key is an anonymous
browser convenience and is not account synchronization.

`onPinsChange` is a synchronous notification with a `void` return contract. The
product adapter owns its async save ordering, pending/error state and server
readback. The DS does not await or acknowledge network persistence, retries or
database migrations. A failed read/save cannot be relabeled as an empty or
successful server preference. The local fixture proves callback sequences and
the separate browser fallback, not backend persistence.

For TMS, wire only the pin state and callbacks into its shell if its existing
locale/theme providers remain authoritative:

```tsx
const pins = useProductShellController({
  requestPreferences: { pins: preference.pins },
  onPinsChange: saveCurrentUserProductPins,
});

<ProductShell
  pinnedIds={pins.pins}
  onPinnedChange={pins.setPinned}
  onPinsReorder={pins.reorderPins}
  // The remaining shell props come from the actual TMS route/session providers.
  {...productShellProps}
/>;
```

Do not spread the controller's five-locale setter over a six-locale TMS provider.
The implemented complete product locale input is described in
`product-shell-locales.md`; matching production delivery remains a dependency.

## Native links at the Next boundary

Shell rows, pins, search results, product links and breadcrumbs retain native
anchors. Use the existing `ProductShellProps.onClickCapture` for product-owned
Next navigation. Capture runs before the native transient-layer selection
listener can close and remove a row. A real Chromium test observed an ordinary
bubble-only handler miss that removed row; its raw failing run is retained.

The adapter handles ordinary unmodified primary-button, same-origin navigation
to its supported application routes. It leaves modifier/middle clicks,
`download`, non-self targets, external destinations and local-only hash anchors
to the browser. The product calls `preventDefault()` and then its normal
`router.push` or established `onNavigate`; route builders and authorization gates
stay in TMS. The DS does not import `next/link` or `next/navigation`.

`useShellTransientLayer` now leaves modifier-click selection alone. An ordinary
capture-intercepted click still closes the transient layer, including when
`preventDefault()` was used for the router. Escape returns focus; an outside
pointer leaves focus at the pointer destination. The account locale list owns
its first Escape before the account layer. These behaviors are covered by the
package DOM tests and the retained Chromium fixture.

The normal root package's engineering `Dialog`, `Menu`, `Tree` and `DataGrid`
received behavior repairs during the audit. They retain their existing exports
and are not promoted into the 28-entry design catalogue by this document.
