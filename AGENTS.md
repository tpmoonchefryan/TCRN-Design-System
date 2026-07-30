# AGENTS.md

The canonical agent guidance for this repository lives in `CLAUDE.md`. Open it before
changing any source. This file is a deliberate pointer, not a copy — keeping one source
avoids two-file drift.

Four rules you must not miss:

1. Run `pnpm verify` and let it pass before reporting any change as done.
2. Styles take their values from tokens in `docs/style-scale.md` — never a raw literal.
3. Use the code graph for structural questions, but run `codegraph status` first — a
   stale index is worse than grep: grep is slow and honest, a stale index is fast and
   confidently wrong.
4. **The platform's governed partitions are no longer all on one machine.** This
   repository's partition is still hosted locally, so ordinary local engine invocation
   applies — but check rather than assume (the recheck command is in `CLAUDE.md`), and do
   not copy a governance recipe from `TCRN-AOS`: its chain moved to another host and its
   ceremony wrapper would drive the wrong machine.

For everything else — do-not-hand-edit generated token blocks, component-CSS truth, the
AI contract source, and the no-overclaim house rules — read `CLAUDE.md`.
