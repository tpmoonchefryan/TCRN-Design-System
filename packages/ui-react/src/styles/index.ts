// Current visual stylesheet: published Site v2 families, top-band shell, and adopted Batch 3 families.
// Other package engineering exports do not imply a published design or Storybook route.
import { typographyScaleCss } from "./generated/typography.scale.js";
import { iconCss01 } from "./icon.css.js";
import * as actions from "./actions.css.js";
import * as inputs from "./inputs.css.js";
import { brandCss01, brandCss02 } from "./brand.css.js";
import { shellCss01, shellCss02, shellCss03, shellCss04, shellCss05, shellReducedMotionCss } from "./shell.css.js";
import { shellIntroCss01 } from "./shell-intro.css.js";
import { shellSheetCss01 } from "./shell-sheet.css.js";
import { formalLayoutCss, formalDocsCss } from "./formal-layout.css.js";
import { layoutCss } from "./layout.css.js";
import { feedbackCss } from "./feedback.css.js";
import { dataDisplayCss } from "./data-display.css.js";
import { overlayCss } from "./overlay.css.js";

export const tcrnComponentCss = [
  formalLayoutCss,
  layoutCss,
  iconCss01,
  ...Object.values(actions),
  ...Object.values(inputs),
  typographyScaleCss,
  brandCss01,
  brandCss02,
  shellCss01,
  shellCss02,
  shellCss03,
  shellCss04,
  shellCss05,
  shellIntroCss01,
  shellSheetCss01,
  shellReducedMotionCss,
  feedbackCss,
  dataDisplayCss,
  overlayCss,
  formalDocsCss
].join("\n");
