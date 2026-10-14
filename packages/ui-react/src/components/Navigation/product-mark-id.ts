// The mark registered under a product key, and the mark's own id (TCRN-DS-SUB-212).
//
// A product mark is registered under its product key (tms, einzbern, mana-orchestrate,
// design-system), but the mark has an id of its own: the name of its logos2 file and of the Brand
// board's mark (tms, einzbern, mana, ds). Every element that marks a drawn colour mark with
// data-logo writes that id, so the attribute has one value per product wherever the mark is drawn:
// a measured lockup and the first line (TCRN-DS-SUB-194), the brand button (TCRN-DS-SUB-212) and
// the intro's flying mark (TCRN-DS-SUB-214). The shell gate's brandDigest finds the source file by
// it. The SVG itself is still drawn from the product key.
//
// The module belongs to the Navigation directory: neither components/Navigation/index.ts nor
// src/index.tsx exports it. It takes only a type from Navigation.tsx, so nothing in it waits on
// Navigation.tsx when the modules load, and Navigation.tsx can call it at load time.
import type { TcrnProductMarkId } from "./Navigation.js";
import { tcrnProductMarks, type TcrnProductMark } from "./product-marks.generated.js";

/** The generated mark registered under the product key `productId`. */
export function productMark(productId: TcrnProductMarkId): TcrnProductMark {
  const mark = tcrnProductMarks.find((candidate) => candidate.productId === productId);
  if (!mark) throw new Error(`No product mark is generated for "${productId}"`);
  return mark;
}

/**
 * The mark's own id, which data-logo carries: tms → tms, design-system → ds,
 * mana-orchestrate → mana, einzbern → einzbern.
 */
export function productMarkIdOf(productId: TcrnProductMarkId): string {
  return productMark(productId).id;
}
