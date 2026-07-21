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
