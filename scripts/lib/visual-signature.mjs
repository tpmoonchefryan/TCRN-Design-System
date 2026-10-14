// Perceptual visual signatures — TCRN-DS-INIT-002.
//
// A screenshot's sha256 is the wrong invariant for a visual baseline. Headless
// rasterisation is not byte-reproducible (font hinting, GPU compositing, sub-pixel
// timing), so the recorded hashes churned for a rotating handful of stories on every
// run. That trains readers to ignore the file, which is the actual danger: a real
// visual regression shows up the same way and gets ignored with it.
//
// This replaces the invariant rather than the timing. Each capture is reduced to a
// 16x16 greyscale signature using the browser's own high-quality downscaler, which
// averages away the sub-pixel noise while preserving layout, colour and contrast.
// Measured on this repo before the tolerance was chosen:
//
//   noise floor, 5 captures in one process        mad 0.000, max 0
//   noise floor, 3 separate browser processes     mad 0.000, max 0
//   signal, one surface token nudged ~3% luma     mad 9.086, max 11
//
// The separation is wide enough that the thresholds below are not a judgement call.
// They sit an order of magnitude above the measured noise and well under the
// smallest change worth catching.

export const SIGNATURE_GRID = 16;
export const SIGNATURE_TOLERANCE = Object.freeze({
  // Mean absolute difference across all cells: catches a wash of change.
  meanAbsolute: 2,
  // Worst single cell: catches a small element changing a lot when the mean stays low.
  maxCell: 8
});

/**
 * A blank, CSP-free page used solely for measurement. The docs shell sets a policy that
 * refuses data: image sources, so the reduction cannot run inside the page being
 * captured — and keeping it separate also avoids perturbing the subject.
 */
export async function createSignatureContext(browser) {
  const context = await browser.newContext({ bypassCSP: true });
  const page = await context.newPage();
  await page.goto("about:blank");
  return {
    page,
    async close() {
      await context.close();
    }
  };
}

/**
 * Reduce a PNG buffer to its perceptual signature. The browser is already running and
 * its downscaler is the same one that produced the pixels, so this needs no
 * image-decoding dependency.
 */
export async function computeSignature(page, pngBuffer) {
  const cells = await page.evaluate(async ([base64, grid]) => {
    const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
    const blob = new Blob([bytes], { type: "image/png" });
    // createImageBitmap decodes and downscales in one step, and unlike Image.decode()
    // it copes with captures taller than the renderer's maximum texture dimension —
    // section-components is 1440x59489, which Image refuses outright.
    const bitmap = await createImageBitmap(blob, { resizeWidth: grid, resizeHeight: grid, resizeQuality: "high" });
    const canvas = document.createElement("canvas");
    canvas.width = grid;
    canvas.height = grid;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(bitmap, 0, 0);
    bitmap.close();
    const { data } = context.getImageData(0, 0, grid, grid);
    const luma = [];
    for (let index = 0; index < data.length; index += 4) {
      luma.push(Math.round(0.2126 * data[index] + 0.7152 * data[index + 1] + 0.0722 * data[index + 2]));
    }
    return luma;
  }, [pngBuffer.toString("base64"), SIGNATURE_GRID]);
  return cells;
}

// The capture self-check (TCRN-DS-SUB-217). A story taller than the documentation paper's visible
// height, captured while the paper clipped it, came back as one paper-high slice of the story with
// bare canvas above and below it: 44 desktop captures in the R3 run, desktop i18n-theme-contract
// 1040x1807 with about 450-490 canvas rows at either end. A story captured whole ends in its own rows
// (the story block paints its own ground). The self-check reads the capture's lower half from the
// bottom edge up and counts the full-width rows in the canvas colour; a story taller than the paper
// passes only when that count is 0. It does not touch the signature or its tolerance.
export const CANVAS_ROW_CHANNEL_TOLERANCE = 2;

/** Width and height from a PNG's IHDR chunk. */
export function pngSize(pngBuffer) {
  return { width: pngBuffer.readUInt32BE(16), height: pngBuffer.readUInt32BE(20) };
}

/**
 * Full-width canvas-colour rows at the bottom edge of a capture, counted inside its lower half.
 * Decoded in the CSP-free signature page a band at a time from the bottom, so a capture that ends in
 * its own rows costs one band and a tall capture is never decoded whole.
 */
export async function trailingCanvasRows(page, pngBuffer, canvasRgb, { tolerance = CANVAS_ROW_CHANNEL_TOLERANCE, bandRows = 256 } = {}) {
  const { width, height } = pngSize(pngBuffer);
  const lowerHalfRows = height - Math.floor(height / 2);
  const rows = await page.evaluate(async ([base64, size, rgb, channelTolerance, band]) => {
    const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
    const blob = new Blob([bytes], { type: "image/png" });
    const canvas = document.createElement("canvas");
    canvas.width = size.width;
    let count = 0;
    for (let bottom = size.height; bottom > size.height - size.lowerHalfRows; bottom -= band) {
      const top = Math.max(size.height - size.lowerHalfRows, bottom - band);
      const bitmap = await createImageBitmap(blob, 0, top, size.width, bottom - top);
      canvas.height = bottom - top;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(bitmap, 0, 0);
      bitmap.close();
      const { data } = context.getImageData(0, 0, size.width, bottom - top);
      for (let row = bottom - top - 1; row >= 0; row -= 1) {
        for (let column = 0; column < size.width; column += 1) {
          const index = (row * size.width + column) * 4;
          if (Math.abs(data[index] - rgb[0]) > channelTolerance
            || Math.abs(data[index + 1] - rgb[1]) > channelTolerance
            || Math.abs(data[index + 2] - rgb[2]) > channelTolerance) {
            return count;
          }
        }
        count += 1;
      }
    }
    return count;
  }, [pngBuffer.toString("base64"), { width, height, lowerHalfRows }, canvasRgb, tolerance, bandRows]);
  return { width, height, lowerHalfRows, trailingCanvasRows: rows };
}

/** The self-check's verdict for a story taller than the paper: its capture does not end in canvas. */
export function capturedWholeStory({ trailingCanvasRows: canvasRows }) {
  return canvasRows === 0;
}

/** Signatures are stored as hex so the baseline file stays small and diffable. */
export function encodeSignature(cells) {
  return cells.map((value) => value.toString(16).padStart(2, "0")).join("");
}

export function decodeSignature(hex) {
  const cells = [];
  for (let index = 0; index < hex.length; index += 2) {
    cells.push(Number.parseInt(hex.slice(index, index + 2), 16));
  }
  return cells;
}

/** Distance between two signatures, in the two dimensions the tolerance is stated in. */
export function compareSignatures(left, right) {
  if (left.length !== right.length) {
    return { comparable: false, meanAbsolute: Infinity, maxCell: Infinity };
  }
  let total = 0;
  let maxCell = 0;
  for (let index = 0; index < left.length; index += 1) {
    const delta = Math.abs(left[index] - right[index]);
    total += delta;
    if (delta > maxCell) maxCell = delta;
  }
  return {
    comparable: true,
    meanAbsolute: Number((total / left.length).toFixed(3)),
    maxCell
  };
}

export function withinTolerance(distance) {
  return distance.comparable
    && distance.meanAbsolute <= SIGNATURE_TOLERANCE.meanAbsolute
    && distance.maxCell <= SIGNATURE_TOLERANCE.maxCell;
}

/** Bounded updates are explicit compare-and-swap operations, never capture side effects. */
export function validateBaselineSelection(selection, baseline, baselineDigest, digest) {
  if (selection?.schemaVersion !== "tcrn.visual-baseline-selection.v1"
    || selection.baselineSha256 !== baselineDigest
    || !Array.isArray(selection.entries) || selection.entries.length === 0) {
    throw new Error("VISUAL_SELECTION_INVALID_OR_STALE");
  }
  if (JSON.stringify(baseline.tolerance) !== JSON.stringify(SIGNATURE_TOLERANCE)) {
    throw new Error("VISUAL_TOLERANCE_CHANGED");
  }
  const selected = new Map();
  for (const entry of selection.entries) {
    if (typeof entry.key !== "string" || !entry.key || selected.has(entry.key)
      || entry.disposition !== "accepted-layout-change"
      || typeof entry.reason !== "string" || !entry.reason.trim()
      || typeof entry.evidence !== "string" || !entry.evidence.trim()
      || !/^[a-f0-9]{64}$/.test(entry.expectedSignatureSha256 ?? "")
      || entry.beforeSignatureSha256 !== (baseline.entries[entry.key] ? digest(baseline.entries[entry.key]) : null)) {
      throw new Error("VISUAL_SELECTION_ENTRY_INVALID_OR_STALE");
    }
    selected.set(entry.key, entry);
  }
  return selected;
}

export function applyBaselineSelection(baseline, selected, captures, { geometryOk, proofOk, digest }) {
  const refused = [];
  const changes = [];
  const entries = { ...baseline.entries };
  for (const [key, entry] of selected) {
    const capture = captures.find((row) => row.key === key && row.gated);
    if (!capture || !capture.encoded || capture.geometryOk !== true
      || digest(capture.encoded) !== entry.expectedSignatureSha256) {
      refused.push({ key, reason: "missing-or-unexpected-capture-or-geometry" });
      continue;
    }
    entries[key] = capture.encoded;
    changes.push({ ...entry, afterSignatureSha256: digest(capture.encoded), captureSha256: capture.captureSha256 });
  }
  for (const capture of captures) {
    if (capture.gated && ["regression", "new"].includes(capture.status) && !selected.has(capture.key)) {
      refused.push({ key: capture.key, reason: "unselected-visual-change" });
    }
  }
  if (!geometryOk || !proofOk) refused.push({ reason: "current-proof-or-geometry-failed" });
  return { ok: refused.length === 0, refused, changes, baseline: refused.length ? baseline : { ...baseline, entries } };
}
