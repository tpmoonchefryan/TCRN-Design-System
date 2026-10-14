// The brand story shell-brand-first-line (TCRN-DS-SUB-161, R2-28): the products' first lines for the
// shell gate's markText. Its id, its category (navigation-shells) and the order of its first lines are
// the gate's, fixed with the gate in tests/fixtures/geometry-measure/shell/manifest.json
// (stories.screens, TCRN-DS-SUB-164, C-12).
//
// The first line is the second of a product's three renditions (MIN-20261013-SHELL D2, STORY-145): the
// lockup's first line alone, centred on the mark by the flex row. A shell shows it for one product, in
// its brand button (the side-rail scale, mark 22) and at the foot of its full menu (the lockup scale,
// mark 44); this story sets every product's first line at both scales, outside any shell, so markText
// reads each product's word against its mark: TMS, Einzbern, Mana Orchestrate and Design System, each
// at the rail scale and then at the lockup scale. Only ProductLockup and its public props are used:
// the marks are the colour marks of logos2 and the words the lockups' own, nothing is redrawn,
// restyled or nudged, and no other lockup with a mark sits in the story.
//
// The story entry is story-content.tsx's (shell-brand-first-line, after shell-intro), as for the other
// shell stories; this module holds what it renders.
import { ProductLockup, tcrnProductMarkIds, type ProductLockupFirstLineScale } from "@tcrn/ui-react";

/** The scales of each product's first lines, in the order the shell gate reads them. */
export const shellBrandFirstLineScales: readonly ProductLockupFirstLineScale[] = ["rail", "lockup"];

/** Every product's first line at both scales, product by product, outside any shell. */
export function ShellBrandFirstLines() {
  return (
    <section className="alpha-story-stack" data-shell-brand-first-lines="">
      {tcrnProductMarkIds.map((productId) => (
        <div key={productId} className="tcrn-doc-action-row" data-shell-brand-first-line-product={productId}>
          {shellBrandFirstLineScales.map((scale) => (
            <ProductLockup key={scale} productId={productId} firstLine={scale} />
          ))}
        </div>
      ))}
    </section>
  );
}
