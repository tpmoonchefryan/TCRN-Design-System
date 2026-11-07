# Consume the matching design-system release

This source is a local 4.0.0 producer candidate. The pinned visual Site is v1.
The package, documentation and AI index have separate publication facts. Do not
point a production consumer at this candidate before its required producer delivery.

Start with the producer artifact's `llms.txt` and `ai/index.json`. An offline copy
must retain the `ai/` directory structure. The versioned alias is
`ai/4.0.0/index.json`. Pin the index's entire `identity` object in the consumer
project's `.tcrn-ds.json`; it contains all three exact package versions, the pinned
standard identity and the generator's source digest. Changes invalidate the lock.
Use a trusted release artifact; a hash alone authenticates no publisher.

Declare the task's components, optional applicable patterns and actual source
roots. The loader resolves `globalRequired` and every transitive `required` edge.
Read those loaded rules before implementing. `optional` links are further reading,
not mandatory full-library loading. Rules contain source paths/digests, normative
text, extracted own props/type definitions and the real portal/Storybook example
identity. Native inherited React attributes still follow TypeScript. The complete
`ai-consumption-contract.json` contains the same rule objects for compatibility.

A declaration looks like this; copy `identity` verbatim from your trusted index:

```json
{
  "schemaVersion": "tcrn.consumer-contract.v1",
  "identity": { "packageVersions": {}, "standardSource": {}, "sourceDigest": "COPY_FROM_INDEX" },
  "components": ["ProductShell", "SearchInput", "Select", "Button", "Heading", "Text"],
  "patterns": ["shell-preferences", "product-locales", "customer-list-boundary"],
  "sourceRoots": ["src"],
  "adapterEvidence": "checks/shell-preferences.json"
}
```

Build the three producer packages with the repository's declared pnpm version,
then run the source release's checker against the actual consumer directory:

```sh
node /path/to/source-release/scripts/consumer-contract-check.mjs \
  --project /path/to/consumer \
  --index /path/to/producer-artifact/ai/index.json \
  --declaration .tcrn-ds.json
```

The executable checker uses the source release's TypeScript dependency and built
pure verification module. It does not require the consumer to be in this monorepo.
It checks exact declared and installed versions, required rule bytes and dependency
identities, direct DS imports/JSX, registered token references, bare design values,
component style overrides, shell callback wiring and supplied adapter observations.
A nonzero exit means failure; unreadable/malformed rules never become empty success.
Pin package versions exactly; run the consumer's TypeScript and browser checks too.
C's packaging responsibility must include the checker and its runtime dependencies
in the delivered source/tool artifact; no npm `bin` export is claimed here.

For shell consumption, retain the raw HTTP test commands and results producing
`tcrn.shell-preference-evidence.v1`: authenticated synthetic scope, initial ordered pins, successful
pin/unpin/reorder submissions and ordered readback, fresh session readback, separate
user/tenant/product readbacks and a surfaced failure. The pure validator checks
supplied observations. It does not authenticate them, test JWT protection or
establish that a remote service actually ran. Those facts require the product's
real API/database tests. Anonymous localStorage cannot supply this report.

The scanner covers selected source roots and explicit imports, JSX and literal
style values. Indirect/dynamic wiring, semantic accessibility, contrast, clipping,
keyboard/focus, server authentication and business permissions require their
normal type, runtime and browser checks. Passing it does not guarantee future
model behavior. No token, cost or time benefit is inferred from artifact bytes.

Refresh by replacing index and required shards together from one producer build,
reviewing the new identity and rerunning the checker and affected tests. Never mix
old cached rules or change a version field to conceal stale content. See
[the new-session task](new-session-task.md) for the separately required product
validation. Its outcome is still pending; this implementation's self-tests are
not a new-session result.
