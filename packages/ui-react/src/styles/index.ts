// tcrnComponentCss, the package component stylesheet, joined from its family segment
// modules in cascade order.
//
// Each family module owns the rules whose selector subject belongs to it: the subject is
// the rightmost compound selector, or the nearest compound to its left that carries a
// tcrn- class when the subject has none, and a compound naming two components
// (.tcrn-button.tcrn-shell-theme-toggle) belongs to the last one. Selector lists and
// at-rule blocks that spanned two families were split in place into adjacent rules with
// the same declarations and at-rule context, so no rule is shared between modules.
//
// The list below is the stylesheet's cascade order and the only place it is written. It
// keeps the original order of every rule and comment, including the three section
// markers apps/storybook/src/build/page-template.tsx slices the sheet on.

import {
  baseCss01, baseCss02, baseCss03, baseCss04, baseCss05, baseCss06, baseCss07, baseCss08,
  baseCss09, baseCss10, baseCss11, baseCss12, baseCss13, baseCss14, baseCss15, baseCss16,
  baseCss17, baseCss18, baseCss19, baseCss20, baseCss21, baseCss22, baseCss23, baseCss24,
  baseCss25, baseCss26, baseCss27, baseCss28, baseCss29, baseCss30, baseCss31, baseCss32,
  baseCss33, baseCss34, baseCss35, baseCss36, baseCss37, baseCss38, baseCss39
} from "./base.css.js";
import {
  typographyCss01, typographyCss02, typographyCss03, typographyCss04, typographyCss05,
  typographyCss06, typographyCss07, typographyCss08, typographyCss09, typographyCss10,
  typographyCss11, typographyCss12
} from "./typography.css.js";
import { iconCss01 } from "./icon.css.js";
import {
  actionsCss01, actionsCss02, actionsCss03, actionsCss04, actionsCss05, actionsCss06,
  actionsCss07, actionsCss08
} from "./actions.css.js";
import {
  inputsCss01, inputsCss02, inputsCss03, inputsCss04, inputsCss05, inputsCss06, inputsCss07,
  inputsCss08, inputsCss09, inputsCss10, inputsCss11, inputsCss12, inputsCss13, inputsCss14
} from "./inputs.css.js";
import { brandCss01, brandCss02, brandCss03, brandCss04 } from "./brand.css.js";
// The top-band shell parts come after every family module (TCRN-DS-INIT-016, C-8).
import { shellCss01 } from "./shell.css.js";

export const tcrnComponentCss: string = [
  baseCss01,
  iconCss01,
  actionsCss01,
  baseCss02,
  actionsCss02,
  baseCss03,
  actionsCss03,
  baseCss04,
  actionsCss04,
  baseCss05,
  inputsCss01,
  baseCss06,
  actionsCss05,
  baseCss07,
  brandCss01,
  baseCss08,
  brandCss02,
  baseCss09,
  brandCss03,
  baseCss10,
  inputsCss02,
  baseCss11,
  inputsCss03,
  baseCss12,
  typographyCss01,
  baseCss13,
  typographyCss02,
  baseCss14,
  typographyCss03,
  baseCss15,
  typographyCss04,
  baseCss16,
  typographyCss05,
  baseCss17,
  typographyCss06,
  baseCss18,
  typographyCss07,
  baseCss19,
  typographyCss08,
  baseCss20,
  typographyCss09,
  baseCss21,
  typographyCss10,
  baseCss22,
  typographyCss11,
  baseCss23,
  brandCss04,
  baseCss24,
  actionsCss06,
  baseCss25,
  inputsCss04,
  baseCss26,
  actionsCss07,
  baseCss27,
  actionsCss08,
  baseCss28,
  typographyCss12,
  baseCss29,
  inputsCss05,
  baseCss30,
  inputsCss06,
  baseCss31,
  inputsCss07,
  baseCss32,
  inputsCss08,
  baseCss33,
  inputsCss09,
  baseCss34,
  inputsCss10,
  baseCss35,
  inputsCss11,
  baseCss36,
  inputsCss12,
  baseCss37,
  inputsCss13,
  baseCss38,
  inputsCss14,
  baseCss39,
  shellCss01
].join("");
