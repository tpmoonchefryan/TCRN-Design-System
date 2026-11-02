// Current visual stylesheet: only the published five families and top-band shell.
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
export const tcrnComponentCss = [formalLayoutCss,iconCss01,...Object.values(actions),...Object.values(inputs),typographyScaleCss,brandCss01,brandCss02,shellCss01,shellCss02,shellCss03,shellCss04,shellCss05,shellIntroCss01,shellSheetCss01,shellReducedMotionCss,formalDocsCss].join("\n");
