// SPDX-License-Identifier: Apache-2.0
// TCRN-DS-SUB-036 — a small CSS rule reader for the contract static gate (scripts/contract-static-proof.mjs).
//
// No dependency: the gate reads the package CSS (tcrnComponentCss of the built @tcrn/ui-react) and the
// published token sheet, so the reader only needs what those sheets use. It returns flat style rules
// with their at-rule context, selector list, declarations and the comments inside the block; gives
// selector specificity (Selectors Level 4: :where() counts zero, :is()/:not()/:has() count their most
// specific argument) and compound parsing; and value helpers for colours, gradients, shadows and blur.
//
// Nesting (`&` or a rule inside a rule) is read the CSS Nesting way: a nested selector without `&`
// is a descendant of each parent selector. Nested at-rules inside a style rule keep the parent selector.

const GROUPING_AT_RULES = new Set(["media", "supports", "container", "layer", "document", "scope", "starting-style"]);

/** Replace comment bodies with spaces (newlines kept, so offsets and lines stay put). */
export function maskComments(css) {
  const comments = [];
  let out = "";
  let i = 0;
  while (i < css.length) {
    const ch = css[i];
    if (ch === '"' || ch === "'") {
      const end = skipString(css, i);
      out += css.slice(i, end);
      i = end;
      continue;
    }
    if (ch === "/" && css[i + 1] === "*") {
      const close = css.indexOf("*/", i + 2);
      const end = close === -1 ? css.length : close + 2;
      comments.push({ start: i, end, body: css.slice(i + 2, close === -1 ? css.length : close).trim() });
      out += css.slice(i, end).replace(/[^\n]/gu, " ");
      i = end;
      continue;
    }
    out += ch;
    i += 1;
  }
  return { text: out, comments };
}

/** Index just past the string that opens at `i` (backslash escapes honoured). */
export function skipString(text, i) {
  const quote = text[i];
  let j = i + 1;
  while (j < text.length) {
    if (text[j] === "\\") {
      j += 2;
      continue;
    }
    if (text[j] === quote || text[j] === "\n") return j + 1;
    j += 1;
  }
  return text.length;
}

function skipBalanced(text, i, open, close) {
  let depth = 0;
  let j = i;
  while (j < text.length) {
    const ch = text[j];
    if (ch === '"' || ch === "'") {
      j = skipString(text, j);
      continue;
    }
    if (ch === open) depth += 1;
    else if (ch === close) {
      depth -= 1;
      if (depth === 0) return j + 1;
    }
    j += 1;
  }
  return text.length;
}

/** Index of the `}` that closes the block opened at `open`. */
function blockEnd(text, open) {
  let depth = 0;
  let j = open;
  while (j < text.length) {
    const ch = text[j];
    if (ch === '"' || ch === "'") {
      j = skipString(text, j);
      continue;
    }
    if (ch === "(") {
      j = skipBalanced(text, j, "(", ")");
      continue;
    }
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return j;
    }
    j += 1;
  }
  return text.length;
}

/** Split on a separator character outside strings, parentheses and brackets. */
export function splitTopLevel(text, separator) {
  const parts = [];
  let depth = 0;
  let start = 0;
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === '"' || ch === "'") {
      i = skipString(text, i);
      continue;
    }
    if (ch === "\\") {
      i += 2;
      continue;
    }
    if (ch === "(" || ch === "[") depth += 1;
    else if (ch === ")" || ch === "]") depth = Math.max(0, depth - 1);
    else if (ch === separator && depth === 0) {
      parts.push(text.slice(start, i));
      start = i + 1;
    }
    i += 1;
  }
  parts.push(text.slice(start));
  return parts;
}

export function selectorList(text) {
  return splitTopLevel(text, ",").map((part) => part.trim().replace(/\s+/gu, " ")).filter(Boolean);
}

/** Declarations of a block body: { prop, value, important, offset }. Custom property names keep their case. */
export function parseDeclarations(body, baseOffset = 0) {
  const declarations = [];
  let offset = 0;
  for (const piece of splitTopLevel(body, ";")) {
    const at = offset;
    offset += piece.length + 1;
    const colon = topLevelIndexOf(piece, ":");
    if (colon === -1) continue;
    const rawProp = piece.slice(0, colon).trim();
    if (!rawProp || /[{}]/u.test(rawProp)) continue;
    let value = piece.slice(colon + 1).trim();
    const important = /!\s*important\s*$/iu.test(value);
    if (important) value = value.replace(/!\s*important\s*$/iu, "").trim();
    const prop = rawProp.startsWith("--") ? rawProp : rawProp.toLowerCase();
    declarations.push({ prop, value, important, offset: baseOffset + at + (piece.length - piece.trimStart().length) });
  }
  return declarations;
}

function topLevelIndexOf(text, target) {
  let depth = 0;
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === '"' || ch === "'") {
      i = skipString(text, i);
      continue;
    }
    if (ch === "(" || ch === "[") depth += 1;
    else if (ch === ")" || ch === "]") depth = Math.max(0, depth - 1);
    else if (ch === target && depth === 0) return i;
    i += 1;
  }
  return -1;
}

function lineIndex(text) {
  const starts = [0];
  for (let i = 0; i < text.length; i += 1) if (text[i] === "\n") starts.push(i + 1);
  return (offset) => {
    let lo = 0;
    let hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= offset) lo = mid;
      else hi = mid - 1;
    }
    return lo + 1;
  };
}

/**
 * Read a stylesheet into flat rules.
 *   rules: { kind: "style"|"keyframe"|"at-block", selectorText, selectors, declarations, atRules, comments, line, index }
 *   statements: at-rule statements without a block (@import, @charset, @layer a, b;)
 *   errors: unbalanced braces
 */
export function parseCss(css, { source = "css" } = {}) {
  const { text, comments } = maskComments(String(css));
  const lineAt = lineIndex(text);
  const rules = [];
  const statements = [];
  const errors = [];
  const commentsIn = (start, end) => comments.filter((comment) => comment.start > start && comment.end <= end).map((comment) => comment.body);

  const pushStyle = (selectors, body, bodyStart, atRules, prelude) => {
    // A body may hold nested rules; split it into declaration text and nested blocks.
    let declText = "";
    let i = 0;
    let start = 0;
    const nested = [];
    while (i < body.length) {
      const ch = body[i];
      if (ch === '"' || ch === "'") {
        i = skipString(body, i);
        continue;
      }
      if (ch === "(") {
        i = skipBalanced(body, i, "(", ")");
        continue;
      }
      if (ch === ";") {
        declText += body.slice(start, i + 1);
        start = i + 1;
      } else if (ch === "{") {
        const end = blockEnd(body, i);
        nested.push({ prelude: body.slice(start, i).trim(), body: body.slice(i + 1, end), bodyStart: bodyStart + i + 1 });
        declText += " ".repeat(Math.max(0, i - start));
        i = end + 1;
        start = i;
        continue;
      }
      i += 1;
    }
    declText += body.slice(start);
    rules.push({
      kind: "style",
      source,
      selectorText: selectors.join(", "),
      selectors,
      prelude,
      declarations: parseDeclarations(declText, bodyStart),
      atRules,
      comments: commentsIn(bodyStart - 1, bodyStart + body.length + 1),
      line: lineAt(bodyStart),
      index: rules.length
    });
    for (const child of nested) {
      if (child.prelude.startsWith("@")) {
        pushStyle(selectors, child.body, child.bodyStart, [...atRules, child.prelude], prelude);
        continue;
      }
      const resolved = [];
      for (const inner of selectorList(child.prelude)) {
        for (const parent of selectors) resolved.push(inner.includes("&") ? inner.replaceAll("&", `:is(${parent})`) : `${parent} ${inner}`);
      }
      pushStyle(resolved, child.body, child.bodyStart, atRules, child.prelude);
    }
  };

  const stack = [{ kind: "root", atRules: [] }];
  let i = 0;
  let start = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === '"' || ch === "'") {
      i = skipString(text, i);
      continue;
    }
    if (ch === "(") {
      i = skipBalanced(text, i, "(", ")");
      continue;
    }
    if (ch === "{") {
      const prelude = text.slice(start, i).trim().replace(/\s+/gu, " ");
      const context = stack[stack.length - 1];
      if (prelude.startsWith("@")) {
        const name = (/^@([-\w]+)/u.exec(prelude)?.[1] ?? "").toLowerCase();
        if (GROUPING_AT_RULES.has(name)) {
          stack.push({ kind: "group", atRules: [...context.atRules, prelude] });
          i += 1;
          start = i;
          continue;
        }
        if (name.endsWith("keyframes")) {
          stack.push({ kind: "keyframes", atRules: [...context.atRules, prelude] });
          i += 1;
          start = i;
          continue;
        }
      }
      const end = blockEnd(text, i);
      if (end >= text.length) errors.push({ reasonCode: "CSS_UNCLOSED_BLOCK", line: lineAt(i), prelude });
      const body = text.slice(i + 1, end);
      if (context.kind === "keyframes" || prelude.startsWith("@")) {
        rules.push({
          kind: context.kind === "keyframes" ? "keyframe" : "at-block",
          source,
          selectorText: prelude,
          selectors: [],
          prelude,
          declarations: parseDeclarations(body, i + 1),
          atRules: context.atRules,
          comments: commentsIn(i, end),
          line: lineAt(i),
          index: rules.length
        });
      } else {
        pushStyle(selectorList(prelude), body, i + 1, context.atRules, prelude);
      }
      i = end + 1;
      start = i;
      continue;
    }
    if (ch === "}") {
      if (stack.length > 1) stack.pop();
      else errors.push({ reasonCode: "CSS_UNMATCHED_CLOSE", line: lineAt(i) });
      i += 1;
      start = i;
      continue;
    }
    if (ch === ";") {
      const statement = text.slice(start, i).trim();
      if (statement) statements.push({ text: statement, line: lineAt(start) });
      i += 1;
      start = i;
      continue;
    }
    i += 1;
  }
  if (stack.length > 1) errors.push({ reasonCode: "CSS_UNCLOSED_GROUP", line: lineAt(text.length) });
  return { rules, statements, errors };
}

// ---------------------------------------------------------------------------------------------
// Selectors

/** Compound selectors with the combinator that precedes each ("" for the first). */
export function compounds(selector) {
  const out = [];
  let current = "";
  let combinator = "";
  let pendingSpace = false;
  let i = 0;
  const text = selector.trim();
  const flush = () => {
    if (current.trim()) out.push({ text: current.trim(), combinator });
    current = "";
  };
  while (i < text.length) {
    const ch = text[i];
    if (ch === '"' || ch === "'") {
      const end = skipString(text, i);
      current += text.slice(i, end);
      i = end;
      continue;
    }
    if (ch === "\\") {
      current += text.slice(i, i + 2);
      i += 2;
      continue;
    }
    if (ch === "(" || ch === "[") {
      const end = skipBalanced(text, i, ch, ch === "(" ? ")" : "]");
      if (pendingSpace && current.trim()) {
        flush();
        combinator = " ";
      }
      pendingSpace = false;
      current += text.slice(i, end);
      i = end;
      continue;
    }
    if (ch === ">" || ch === "+" || ch === "~") {
      flush();
      combinator = ch;
      pendingSpace = false;
      i += 1;
      continue;
    }
    if (/\s/u.test(ch)) {
      pendingSpace = true;
      i += 1;
      continue;
    }
    if (pendingSpace && current.trim()) {
      flush();
      combinator = " ";
    } else if (pendingSpace && !current.trim() && out.length > 0 && combinator === "") {
      combinator = " ";
    }
    pendingSpace = false;
    current += ch;
    i += 1;
  }
  flush();
  return out;
}

const IDENT = /^(?:\\.|[-\w -￿])+/u;
const LEGACY_PSEUDO_ELEMENTS = new Set(["before", "after", "first-line", "first-letter"]);

/** One compound: { tag, ids, classes, attributes, pseudoClasses, pseudoElements }. */
export function parseCompound(text) {
  const result = { tag: null, ids: [], classes: [], attributes: [], pseudoClasses: [], pseudoElements: [] };
  let i = 0;
  const readIdent = () => {
    const match = IDENT.exec(text.slice(i));
    if (!match) return "";
    i += match[0].length;
    return match[0].replace(/\\(.)/gu, "$1");
  };
  const readArg = () => {
    if (text[i] !== "(") return null;
    const end = skipBalanced(text, i, "(", ")");
    const arg = text.slice(i + 1, end - 1);
    i = end;
    return arg;
  };
  while (i < text.length) {
    const ch = text[i];
    if (ch === ".") {
      i += 1;
      result.classes.push(readIdent());
    } else if (ch === "#") {
      i += 1;
      result.ids.push(readIdent());
    } else if (ch === "[") {
      const end = skipBalanced(text, i, "[", "]");
      const raw = text.slice(i + 1, end - 1).trim();
      const match = /^([-\w|]+)\s*(?:([~|^$*]?=)\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[^\s\]]+)\s*([is])?)?$/u.exec(raw);
      result.attributes.push({
        name: match ? match[1].replace(/^\|/u, "") : raw,
        op: match?.[2] ?? null,
        value: match?.[3] ? match[3].replace(/^["']|["']$/gu, "") : null,
        raw
      });
      i = end;
    } else if (ch === ":" && text[i + 1] === ":") {
      i += 2;
      const name = readIdent().toLowerCase();
      result.pseudoElements.push({ name, arg: readArg() });
    } else if (ch === ":") {
      i += 1;
      const name = readIdent().toLowerCase();
      const arg = readArg();
      if (LEGACY_PSEUDO_ELEMENTS.has(name)) result.pseudoElements.push({ name, arg });
      else result.pseudoClasses.push({ name, arg });
    } else if (ch === "*") {
      i += 1;
      if (text[i] === "|") i += 1;
    } else if (ch === "&") {
      i += 1;
    } else if (ch === "|") {
      i += 1;
    } else {
      const ident = readIdent();
      if (!ident) i += 1;
      else if (text[i] === "|") i += 1;
      else result.tag = ident.toLowerCase();
    }
  }
  return result;
}

const MAX_ARG_PSEUDOS = new Set(["is", "matches", "any", "-webkit-any", "-moz-any", "not", "has"]);

export function specificity(selector) {
  const total = [0, 0, 0];
  for (const compound of compounds(selector)) {
    const s = compoundSpecificity(parseCompound(compound.text));
    total[0] += s[0];
    total[1] += s[1];
    total[2] += s[2];
  }
  return total;
}

function maxSpecificity(list) {
  let best = [0, 0, 0];
  for (const selector of selectorList(list ?? "")) {
    const s = specificity(selector);
    if (compareSpecificity(s, best) > 0) best = s;
  }
  return best;
}

export function compoundSpecificity(compound) {
  const s = [compound.ids.length, compound.classes.length + compound.attributes.length, compound.tag ? 1 : 0];
  for (const pseudo of compound.pseudoClasses) {
    if (pseudo.name === "where") continue;
    if (MAX_ARG_PSEUDOS.has(pseudo.name)) {
      const inner = maxSpecificity(pseudo.arg);
      s[0] += inner[0];
      s[1] += inner[1];
      s[2] += inner[2];
      continue;
    }
    s[1] += 1;
    if ((pseudo.name === "nth-child" || pseudo.name === "nth-last-child") && pseudo.arg && /\sof\s/u.test(pseudo.arg)) {
      const inner = maxSpecificity(pseudo.arg.split(/\sof\s/u).slice(1).join(" of "));
      s[0] += inner[0];
      s[1] += inner[1];
      s[2] += inner[2];
    }
  }
  s[2] += compound.pseudoElements.length;
  return s;
}

export function compareSpecificity(x, y) {
  for (let k = 0; k < 3; k += 1) if (x[k] !== y[k]) return x[k] - y[k];
  return 0;
}

export function formatSpecificity(s) {
  return `(${s.join(",")})`;
}

/** Selector without its pseudo-elements (so a ::before rule compares like its element rule). */
export function withoutPseudoElements(selector) {
  return selector.replace(/::(?:[-\w]+)(?:\([^)]*\))?|:(?:before|after|first-line|first-letter)(?![-\w])/giu, "");
}

/**
 * Every class name in a selector, including those inside functional pseudo-classes. With
 * `targetOnly`, classes inside :not() and :has() are left out: the selector does not style them.
 */
export function selectorClasses(selector, { targetOnly = false } = {}) {
  const found = new Set();
  const visit = (text) => {
    for (const compound of compounds(text)) {
      const parsed = parseCompound(compound.text);
      for (const name of parsed.classes) found.add(name);
      for (const pseudo of parsed.pseudoClasses) {
        if (!pseudo.arg || !/[.#[:]/u.test(pseudo.arg)) continue;
        if (targetOnly && (pseudo.name === "not" || pseudo.name === "has")) continue;
        for (const inner of selectorList(pseudo.arg)) visit(inner);
      }
    }
  };
  visit(selector);
  return [...found];
}

// ---------------------------------------------------------------------------------------------
// Values

export const NAMED_COLOURS = new Set(
  (
    "aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse " +
    "chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta " +
    "darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet " +
    "deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green " +
    "greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan " +
    "lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey " +
    "lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen " +
    "mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive " +
    "olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple " +
    "rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow " +
    "springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen transparent currentcolor"
  ).split(" ")
);

const COLOUR_FUNCTION = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark)\(/giu;
const GRADIENT_FUNCTION = /(?:-webkit-|-moz-)?(?:repeating-)?(?:linear|radial|conic)-gradient\(|-webkit-gradient\(/giu;

export function varReferences(value) {
  return [...String(value).matchAll(/var\(\s*(--[-\w]+)/gu)].map((match) => match[1]);
}

/** The value with var() names, url() bodies and strings blanked, so words inside them are not read as colours. */
export function valueWords(value) {
  return String(value)
    .replace(/url\((?:"[^"]*"|'[^']*'|[^)]*)\)/giu, "url()")
    .replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/gu, '""')
    .replace(/var\(\s*--[-\w]+/gu, "var(");
}

/** Colour literals in a value: hex, colour functions, gradients and named colours (transparent and currentcolor included). */
export function colourLiterals(value) {
  const words = valueWords(value);
  const found = [];
  for (const match of words.matchAll(/#[0-9a-f]{3,8}\b/giu)) if ([3, 4, 6, 8].includes(match[0].length - 1)) found.push(match[0]);
  for (const match of words.matchAll(COLOUR_FUNCTION)) found.push(match[0]);
  for (const match of words.matchAll(GRADIENT_FUNCTION)) found.push(match[0]);
  for (const match of words.matchAll(/(?<![-\w#.])[a-z]+(?![-\w(])/giu)) if (NAMED_COLOURS.has(match[0].toLowerCase())) found.push(match[0]);
  return found;
}

export function gradientFunctions(value) {
  return [...valueWords(value).matchAll(GRADIENT_FUNCTION)].map((match) => match[0].replace(/\($/u, ""));
}

/** A length in px (px, rem and em at 16px, unitless zero), or null. */
export function lengthPx(token) {
  const match = /^(-?(?:\d+\.?\d*|\.\d+))(px|rem|em)?$/iu.exec(String(token).trim());
  if (!match) return null;
  const number = Number(match[1]);
  if (!match[2]) return number === 0 ? 0 : null;
  return match[2].toLowerCase() === "px" ? number : number * 16;
}

/** Radii of blur() functions in a value, in px (null where the length cannot be read). */
export function blurRadii(value) {
  return [...valueWords(value).matchAll(/\bblur\(\s*([^)]*)\)/giu)].map((match) => ({ raw: match[0], px: match[1].trim() === "" ? 0 : lengthPx(match[1]) }));
}

/**
 * Shadow layers of a box-shadow-like value, or null when the value is not a shadow list.
 * Each layer: { inset, x, y, blur, spread, colour, raw }. Lengths in px; a layer needs two to four lengths.
 */
export function shadowLayers(value) {
  const text = String(value).trim();
  if (!text || /^(?:none|initial|inherit|unset|revert)$/iu.test(text)) return [];
  const layers = [];
  for (const rawLayer of splitTopLevel(text, ",")) {
    const raw = rawLayer.trim();
    if (!raw) return null;
    const parts = splitTopLevel(raw.replace(/\s+/gu, " "), " ").map((part) => part.trim()).filter(Boolean);
    let inset = false;
    const lengths = [];
    const colour = [];
    for (const part of parts) {
      if (/^inset$/iu.test(part)) {
        inset = true;
        continue;
      }
      const px = lengthPx(part);
      if (px !== null && colour.length === 0) {
        lengths.push(px);
        continue;
      }
      if (/^var\(/iu.test(part) && lengths.length === 0 && parts.length === 1) return null;
      colour.push(part);
    }
    if (lengths.length < 2 || lengths.length > 4) return null;
    layers.push({ inset, x: lengths[0], y: lengths[1], blur: lengths[2] ?? 0, spread: lengths[3] ?? 0, colour: colour.join(" ") || null, raw });
  }
  return layers;
}

/** Whether a shadow layer is invisible: transparent colour, or a zero-size outer layer. */
export function invisibleLayer(layer) {
  const colour = (layer.colour ?? "").toLowerCase().replace(/\s+/gu, "");
  if (/^(?:transparent|#0000|#00000000|rgba\([^)]*,0\)|rgba\([^)]*\/0\))$/u.test(colour)) return true;
  return layer.x === 0 && layer.y === 0 && layer.blur === 0 && layer.spread === 0;
}

const EMOJI = /\p{Emoji_Presentation}|\p{Extended_Pictographic}️/gu;

/** Emoji in the strings of a value (content: "…", custom property strings). */
export function emojiIn(value) {
  const found = [];
  for (const match of String(value).matchAll(/"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'/gu)) {
    const body = (match[1] ?? match[2] ?? "").replace(/\\([0-9a-f]{1,6})\s?/giu, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)));
    for (const emoji of body.matchAll(EMOJI)) found.push(emoji[0]);
  }
  return found;
}
