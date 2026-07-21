import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { createReadStream, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { extname, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { deflateSync, inflateSync } from "node:zlib";
import { chromium } from "@playwright/test";

const require = createRequire(import.meta.url);
const playwrightVersion = JSON.parse(readFileSync(require.resolve("@playwright/test/package.json"), "utf8")).version;

const comparisonContractVersion = "canonicalized_raw_png_exact_v1";
const visualArtifactContractDisposition = {
  comparisonPolicy: "canonicalized_raw_png_sha256_exact_required",
  retainedArtifacts: [
    "docs/verification/storybook-visual-proof/baseline-manifest.json",
    "docs/verification/storybook-visual-proof/update-receipt.json",
    "docs/verification/storybook-visual-proof/check-receipt.json",
    "docs/verification/storybook-visual-proof/screenshots/baseline/*.png"
  ],
  failClosedSignals: [
    "missing_baseline_png",
    "baseline_png_hash_mismatch",
    "dimension_mismatch",
    "raw_png_sha256_exact_match_required",
    "current_check_cleanup_failed",
    "missing_current_entry",
    "unexpected_current_entry"
  ]
};
const exactMismatchDisposition = "raw_png_sha256_exact_match_required";
const currentCaptureCleanupFailure = "current_check_cleanup_failed";
const packageName = "@tcrn/design-system-workspace";
const staticRoot = "apps/storybook/storybook-static";
const receiptRoot = "docs/verification/storybook-visual-proof";
const baselineDir = join(receiptRoot, "screenshots", "baseline");
const currentCaptureDir = join(receiptRoot, ".current-check");
const baselineManifestPath = join(receiptRoot, "baseline-manifest.json");
const intentionalDiffManifestPath = join(receiptRoot, "intentional-diff-manifest.json");
const updateReceiptPath = join(receiptRoot, "update-receipt.json");
const checkReceiptPath = join(receiptRoot, "check-receipt.json");
const markdownReceiptPath = join(receiptRoot, "README.md");

const staticPageAllowlist = [
  "index.html",
  "style-guide.html",
  "foundations.html",
  "components.html",
  "patterns.html",
  "proof.html",
  "change-log.html",
  "tcrn-brand-mark.svg",
  "ai-consumption-contract.json",
  "llms.txt",
  "robots.txt"
];

const firstStoryVisualStates = [
  {
    id: "welcome-first-story",
    page: "index.html",
    hash: "welcome-governance",
    storyId: "welcome-governance",
    description: "Welcome first-story route after hash scroll."
  },
  {
    id: "style-guide-first-story",
    page: "style-guide.html",
    hash: "brand-identity",
    storyId: "brand-identity",
    description: "Style Guide first-story route after hash scroll."
  },
  {
    id: "foundations-first-story",
    page: "foundations.html",
    hash: "tokens-copy-state",
    storyId: "tokens-copy-state",
    description: "Foundations first-story route after hash scroll."
  },
  {
    id: "components-first-story",
    page: "components.html",
    hash: "component-family-index",
    storyId: "component-family-index",
    description: "Components first-story route after hash scroll."
  },
  {
    id: "patterns-first-story",
    page: "patterns.html",
    hash: "forms-patterns",
    storyId: "forms-patterns",
    description: "Patterns first-story route after hash scroll."
  },
  {
    id: "proof-first-story",
    page: "proof.html",
    hash: "proof-matrix",
    storyId: "proof-matrix",
    description: "Proof first-story route after hash scroll."
  },
  {
    id: "change-log-first-story",
    page: "change-log.html",
    hash: "local-changelog",
    storyId: "local-changelog",
    description: "Change Log first-story route after hash scroll."
  }
];

const requiredLocales = ["en", "zh-CN"];
const requiredThemeModes = ["light", "dark"];

const baseVisualStateAllowlist = firstStoryVisualStates.flatMap((state) =>
  requiredLocales.flatMap((locale) =>
    requiredThemeModes.map((themeMode) => ({
      ...state,
      id: `${state.id}-${locale.toLowerCase()}-${themeMode}`,
      locale,
      themeMode,
      description: `${state.description} Locale ${locale}, ${themeMode} theme.`
    }))
  )
);

const focusedVisualStateAllowlist = [
  {
    id: "welcome-search-focus-zh-cn-light",
    page: "index.html",
    hash: "welcome-governance",
    storyId: "welcome-governance",
    locale: "zh-CN",
    themeMode: "light",
    interaction: "search-focus",
    description: "Welcome route with Storybook doc-shell search focused."
  },
  {
    id: "welcome-search-results-zh-cn-light",
    page: "index.html",
    hash: "welcome-governance",
    storyId: "welcome-governance",
    locale: "zh-CN",
    themeMode: "light",
    interaction: "search-results",
    description: "Welcome route with Storybook doc-shell search results open."
  },
  {
    id: "welcome-locale-menu-zh-cn-light",
    page: "index.html",
    hash: "welcome-governance",
    storyId: "welcome-governance",
    locale: "zh-CN",
    themeMode: "light",
    interaction: "locale-menu",
    description: "Welcome route with Storybook doc-shell locale menu open."
  },
  {
    id: "welcome-scrolled-zh-cn-light",
    page: "index.html",
    hash: "welcome-governance",
    storyId: "welcome-governance",
    locale: "zh-CN",
    themeMode: "light",
    interaction: "scrolled-topbar",
    viewportIds: ["desktop-2048x1024", "desktop-1440x900", "tablet-1024x768"],
    description: "Owner-rejected retained-style Welcome route scrolled with topbar and content rhythm visible."
  },
  {
    id: "foundations-visual-standards-zh-cn-light",
    page: "foundations.html",
    hash: "foundation-visual-standards",
    storyId: "foundation-visual-standards",
    locale: "zh-CN",
    themeMode: "light",
    description: "Foundation visual standards hash route with Storybook doc-shell header/content rhythm visible."
  },
  {
    id: "welcome-sidebar-collapsed-zh-cn-light",
    page: "index.html",
    hash: "welcome-governance",
    storyId: "welcome-governance",
    locale: "zh-CN",
    themeMode: "light",
    interaction: "sidebar-collapsed",
    viewportIds: ["desktop-2048x1024", "desktop-1440x900", "tablet-1024x768"],
    description: "Welcome route with Storybook doc-shell sidebar collapsed."
  }
];

const visualStateAllowlist = [...baseVisualStateAllowlist, ...focusedVisualStateAllowlist];

const viewportMatrix = [
  { id: "desktop-2048x1024", width: 2048, height: 1024 },
  { id: "desktop-1440x900", width: 1440, height: 900 },
  { id: "tablet-1024x768", width: 1024, height: 768 },
  { id: "mobile-390x844", width: 390, height: 844 }
];

const storybookDocShellMetricOracle = {
  id: "original-storybook-doc-shell-v1",
  shellAuthority: "storybook_doc_shell_with_package_primitives",
  baselineManifestClassification: "owner_declared_original_storybook_doc_shell_standard",
  comparisonMethod: "storybook_doc_shell_metric_oracle_v1",
  desktopMinWidth: 1200,
  sidebarWidthPx: 288,
  sidebarMinWidthPx: 280,
  sidebarPreferredViewportRatio: 0.2,
  sidebarMaxWidthPx: 360,
  sidebarCollapsedWidthPx: 88,
  sidebarTolerancePx: 2,
  topbarHeightPx: 96,
  topbarTolerancePx: 2,
  searchRestWidthPx: 260,
  searchExpandedWidthPx: 360,
  searchHeightPx: 36,
  searchMetricTolerancePx: 2,
  searchBorderColor: "rgb(142, 142, 136)",
  searchBorderColorDark: "rgb(102, 104, 110)",
  searchBorderRadiusPx: 4,
  themeToggleSizePx: 36,
  themeToggleRadiusPx: 999,
  localeTriggerHeightPx: 36,
  currentLocationContentAlignmentTolerancePx: 24,
  contentTopGapMinPx: -1,
  contentTopGapMaxPx: 64,
  trailingUtilityGapMinPx: 16,
  trailingUtilityGapMaxPx: 32
};

const expectedStorybookSidebarWidthForViewport = (viewportWidth, expectedOracle) => {
  const {
    sidebarMinWidthPx,
    sidebarPreferredViewportRatio,
    sidebarMaxWidthPx,
    sidebarWidthPx
  } = expectedOracle;
  if (
    typeof sidebarMinWidthPx === "number"
    && typeof sidebarPreferredViewportRatio === "number"
    && typeof sidebarMaxWidthPx === "number"
  ) {
    return Math.min(sidebarMaxWidthPx, Math.max(sidebarMinWidthPx, viewportWidth * sidebarPreferredViewportRatio));
  }
  return sidebarWidthPx;
};

const deterministicBrowserSettings = {
  browser: "chromium",
  headless: true,
  deviceScaleFactor: 1,
  colorScheme: "per_visual_state_theme_mode",
  defaultThemeMode: "light",
  visualThemeModes: ["light", "dark"],
  reducedMotion: "reduce",
  locale: "en-US",
  timezoneId: "UTC",
  fixedDateNow: "2026-01-01T00:00:00.000Z",
  chromiumArgs: [
    "--deterministic-mode",
    "--disable-accelerated-2d-canvas",
    "--disable-font-subpixel-positioning",
    "--disable-gpu",
    "--disable-gpu-rasterization",
    "--disable-lcd-text",
    "--disable-threaded-animation",
    "--disable-threaded-scrolling",
    "--font-render-hinting=none",
    "--run-all-compositor-stages-before-draw",
    "--force-color-profile=srgb"
  ],
  viewportScreenshotsOnly: true,
  animations: "disabled",
  screenshotCanonicalization: {
    id: "rgb_channel_quantized_png_v1",
    channelQuantum: 32,
    alphaHandling: "composite_over_white_then_drop_alpha",
    topbarBandNormalization: "3x3_median_filter_first_240px_to_stabilize_control_edge_antialiasing",
    rowFilter: 0
  },
  scrollbarRendering: "suppressed_for_visual_hash_stability",
  screenshotStability: "two_consecutive_identical_png_hashes_before_write_or_compare"
};

const noOverclaimReadback = {
  localVisualProofDisposition: "local_static_contract_docs_only",
  themeModeVisualCoverageDisposition: "bounded_light_and_dark_static_docs_shell_only",
  hostedVisualSaasDisposition: "deferred_not_admitted",
  ciGateDisposition: "not_admitted",
  storybookDocsPublicationDisposition: "not_published",
  packagePublicationDisposition: "not_published",
  consumerAdoptionDisposition: "not_claimed",
  releaseReadinessDisposition: "not_claimed",
  acceptanceStateDisposition: "not_mutated",
  componentLocalStoryGateDisposition: "not_admitted",
  hostedVisualSaas: false,
  ciGateAdmission: false,
  publicHostedSnapshotPublication: false,
  packagePublication: false,
  storybookDocsPublication: false,
  aosAdoption: false,
  tmsAdoption: false,
  releaseReadiness: false,
  productAcceptance: false,
  finalMvpAcceptance: false
};

const deferredBoundaries = [
  "hosted_visual_saas",
  "ci_gate_admission",
  "public_hosted_snapshots",
  "package_publication",
  "storybook_docs_publication",
  "aos_or_tms_adoption",
  "release_readiness",
  "acceptance_state_movement",
  "component_local_story_gate",
  "internal_overlay_lab_visual_coverage",
  "dialog_popover_drawer_search_interaction_visual_states",
  "all_36_story_visual_matrix",
  "cross_browser_visual_proof"
];

const forbiddenStaticDocPatterns = [
  { id: "internal-overlay-lab-title", pattern: /Internal\/Overlay family lab/i },
  { id: "internal-dev-marker", pattern: /data-internal-dev-surface="overlay-family-lab"/i },
  { id: "internal-contract-docs-excluded", pattern: /data-contract-docs="excluded"/i },
  { id: "internal-not-authoritative-marker", pattern: /data-storybook-contract-truth="not-authoritative"/i },
  { id: "storybook-preview-iframe", pattern: /storybook-preview-iframe/i },
  { id: "storybook-global-runtime", pattern: /__STORYBOOK_/ },
  { id: "storybook-manager-bundle", pattern: /sb-(?:manager|addons|common-manager)/i },
  { id: "product-accepted", pattern: /\bproduct accepted\b/i },
  { id: "final-mvp-accepted", pattern: /\bfinal mvp accepted\b/i },
  { id: "release-ready", pattern: /\brelease ready\b/i },
  { id: "public-ready", pattern: /\bpublic ready\b/i },
  { id: "deployment-ready", pattern: /\bdeployment ready\b/i }
];

const forbiddenOwnerVisibleShellText = [
  { id: "zh-cn-private-local-scaffold-proof-caption", text: "私有本地脚手架证明" },
  { id: "en-private-local-scaffold-proof-caption", text: "Private local scaffold proof" }
];

function parseArgs(argv) {
  let mode = "check";
  let reason = null;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") {
      continue;
    }
    if (arg === "--check") {
      mode = "check";
      continue;
    }
    if (arg === "--update-baseline") {
      mode = "update-baseline";
      continue;
    }
    if (arg === "--reason") {
      reason = argv[index + 1] ?? "";
      index += 1;
      continue;
    }
    throw new Error(`unknown_argument:${arg}`);
  }
  if (mode === "update-baseline" && !reason) {
    throw new Error("update_baseline_requires_reason");
  }
  return { mode, reason };
}

function contentType(path) {
  switch (extname(path)) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".json":
      return "application/json; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}

function hashBuffer(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function hashFile(path) {
  return hashBuffer(readFileSync(path));
}

function decodePngRgbaBuffer(buffer, label) {
  if (buffer.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    throw new Error(`invalid_png_signature:${label}`);
  }
  let offset = 8;
  let header = null;
  const idatChunks = [];
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    offset += 4;
    const type = buffer.subarray(offset, offset + 4).toString("ascii");
    offset += 4;
    const data = buffer.subarray(offset, offset + length);
    offset += length + 4;
    if (type === "IHDR") {
      header = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9]
      };
    } else if (type === "IDAT") {
      idatChunks.push(data);
    } else if (type === "IEND") {
      break;
    }
  }
  if (!header) {
    throw new Error(`missing_png_header:${label}`);
  }
  if (header.bitDepth !== 8 || ![2, 6].includes(header.colorType)) {
    throw new Error(`unsupported_png_format:${label}:${JSON.stringify(header)}`);
  }
  const channels = header.colorType === 6 ? 4 : 3;
  const bytesPerPixel = channels;
  const stride = header.width * channels;
  const inflated = inflateSync(Buffer.concat(idatChunks));
  const rawPixels = Buffer.alloc(stride * header.height);
  let inputOffset = 0;
  let outputOffset = 0;
  let previousRow = Buffer.alloc(stride);
  for (let y = 0; y < header.height; y += 1) {
    const filter = inflated[inputOffset];
    inputOffset += 1;
    const row = Buffer.from(inflated.subarray(inputOffset, inputOffset + stride));
    inputOffset += stride;
    for (let index = 0; index < stride; index += 1) {
      const left = index >= bytesPerPixel ? row[index - bytesPerPixel] : 0;
      const up = previousRow[index] ?? 0;
      const upLeft = index >= bytesPerPixel ? previousRow[index - bytesPerPixel] : 0;
      let predictor = 0;
      if (filter === 1) {
        predictor = left;
      } else if (filter === 2) {
        predictor = up;
      } else if (filter === 3) {
        predictor = Math.floor((left + up) / 2);
      } else if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        predictor = pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft;
      } else if (filter !== 0) {
        throw new Error(`unsupported_png_filter:${label}:${filter}`);
      }
      row[index] = (row[index] + predictor) & 0xff;
    }
    row.copy(rawPixels, outputOffset);
    previousRow = row;
    outputOffset += stride;
  }
  const rgba = Buffer.alloc(header.width * header.height * 4);
  for (let pixel = 0; pixel < header.width * header.height; pixel += 1) {
    const source = pixel * channels;
    const target = pixel * 4;
    rgba[target] = rawPixels[source];
    rgba[target + 1] = rawPixels[source + 1];
    rgba[target + 2] = rawPixels[source + 2];
    rgba[target + 3] = channels === 4 ? rawPixels[source + 3] : 255;
  }
  return { width: header.width, height: header.height, rgba };
}

function decodePngRgba(path) {
  return decodePngRgbaBuffer(readFileSync(path), path);
}

const crcTable = (() => {
  const table = [];
  for (let value = 0; value < 256; value += 1) {
    let crc = value;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
    table[value] = crc >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data = Buffer.alloc(0)) {
  const typeBuffer = Buffer.from(type, "ascii");
  const chunk = Buffer.alloc(12 + data.length);
  chunk.writeUInt32BE(data.length, 0);
  typeBuffer.copy(chunk, 4);
  data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 8 + data.length);
  return chunk;
}

function quantizeRgbChannel(value) {
  const quantum = deterministicBrowserSettings.screenshotCanonicalization.channelQuantum;
  return Math.max(0, Math.min(255, Math.round(value / quantum) * quantum));
}

function canonicalizeScreenshotPng(buffer) {
  const decoded = decodePngRgbaBuffer(buffer, "playwright-screenshot-buffer");
  const rgb = Buffer.alloc(decoded.width * decoded.height * 3);
  for (let y = 0; y < decoded.height; y += 1) {
    for (let x = 0; x < decoded.width; x += 1) {
      const source = (y * decoded.width + x) * 4;
      const target = (y * decoded.width + x) * 3;
      const alpha = decoded.rgba[source + 3] / 255;
      const composite = (channel) => Math.round(decoded.rgba[source + channel] * alpha + 255 * (1 - alpha));
      rgb[target] = quantizeRgbChannel(composite(0));
      rgb[target + 1] = quantizeRgbChannel(composite(1));
      rgb[target + 2] = quantizeRgbChannel(composite(2));
    }
  }
  const canonicalRgb = normalizeIsolatedPixels(rgb, decoded.width, decoded.height);
  const rowStride = decoded.width * 3;
  const rows = Buffer.alloc((rowStride + 1) * decoded.height);
  for (let y = 0; y < decoded.height; y += 1) {
    const rowStart = y * (rowStride + 1);
    rows[rowStart] = 0;
    canonicalRgb.copy(rows, rowStart + 1, y * rowStride, (y + 1) * rowStride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(decoded.width, 0);
  ihdr.writeUInt32BE(decoded.height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from("89504e470d0a1a0a", "hex"),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", deflateSync(rows, { level: 9 })),
    pngChunk("IEND")
  ]);
}

function normalizeIsolatedPixels(rgb, width, height) {
  const output = Buffer.from(rgb);
  const readAt = (x, y) => {
    const offset = (y * width + x) * 3;
    return [rgb[offset], rgb[offset + 1], rgb[offset + 2]];
  };
  const maxProofControlBandY = Math.min(height, 240);
  for (let y = 0; y < maxProofControlBandY; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const channels = [[], [], []];
      for (let ny = Math.max(0, y - 1); ny <= Math.min(height - 1, y + 1); ny += 1) {
        for (let nx = Math.max(0, x - 1); nx <= Math.min(width - 1, x + 1); nx += 1) {
          const [r, g, b] = readAt(nx, ny);
          channels[0].push(r);
          channels[1].push(g);
          channels[2].push(b);
        }
      }
      const target = (y * width + x) * 3;
      output[target] = channels[0].toSorted((left, right) => left - right)[Math.floor(channels[0].length / 2)];
      output[target + 1] = channels[1].toSorted((left, right) => left - right)[Math.floor(channels[1].length / 2)];
      output[target + 2] = channels[2].toSorted((left, right) => left - right)[Math.floor(channels[2].length / 2)];
    }
  }
  return output;
}

function clusterChangedPixels(changedPixels, width, height) {
  const remaining = new Set(changedPixels.map((pixel) => pixel.index));
  const byIndex = new Map(changedPixels.map((pixel) => [pixel.index, pixel]));
  const clusters = [];
  while (remaining.size > 0) {
    const [start] = remaining;
    remaining.delete(start);
    const queue = [start];
    const cluster = {
      pixelCount: 0,
      bounds: { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
    };
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      const index = queue[cursor];
      const pixel = byIndex.get(index);
      if (!pixel) continue;
      cluster.pixelCount += 1;
      cluster.bounds.left = Math.min(cluster.bounds.left, pixel.x);
      cluster.bounds.top = Math.min(cluster.bounds.top, pixel.y);
      cluster.bounds.right = Math.max(cluster.bounds.right, pixel.x);
      cluster.bounds.bottom = Math.max(cluster.bounds.bottom, pixel.y);
      for (let y = pixel.y - 1; y <= pixel.y + 1; y += 1) {
        for (let x = pixel.x - 1; x <= pixel.x + 1; x += 1) {
          if (x === pixel.x && y === pixel.y) continue;
          if (x < 0 || y < 0 || x >= width || y >= height) continue;
          const neighbor = y * width + x;
          if (remaining.has(neighbor)) {
            remaining.delete(neighbor);
            queue.push(neighbor);
          }
        }
      }
    }
    clusters.push(cluster);
  }
  return clusters.toSorted((a, b) => b.pixelCount - a.pixelCount || a.bounds.top - b.bounds.top || a.bounds.left - b.bounds.left);
}

function comparePngPixelDelta(baselinePath, currentPath, expectedWidth, expectedHeight) {
  const baseline = decodePngRgba(baselinePath);
  const current = decodePngRgba(currentPath);
  if (baseline.width !== expectedWidth || baseline.height !== expectedHeight || current.width !== expectedWidth || current.height !== expectedHeight) {
    return {
      ok: false,
      reason: "decoded_png_dimension_mismatch",
      baselineDimensions: { width: baseline.width, height: baseline.height },
      currentDimensions: { width: current.width, height: current.height },
      expectedDimensions: { width: expectedWidth, height: expectedHeight }
    };
  }
  const changedPixels = [];
  let maxAbsoluteRgbChannelDelta = 0;
  let maxAlphaDelta = 0;
  const changedPixelBounds = { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity };
  const changedPixelSamples = [];
  const pixelCount = expectedWidth * expectedHeight;
  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const offset = pixel * 4;
    const baselineRgba = [
      baseline.rgba[offset],
      baseline.rgba[offset + 1],
      baseline.rgba[offset + 2],
      baseline.rgba[offset + 3]
    ];
    const currentRgba = [
      current.rgba[offset],
      current.rgba[offset + 1],
      current.rgba[offset + 2],
      current.rgba[offset + 3]
    ];
    if (baselineRgba.every((value, index) => value === currentRgba[index])) {
      continue;
    }
    const x = pixel % expectedWidth;
    const y = Math.floor(pixel / expectedWidth);
    const deltaRgba = currentRgba.map((value, index) => value - baselineRgba[index]);
    maxAbsoluteRgbChannelDelta = Math.max(maxAbsoluteRgbChannelDelta, Math.abs(deltaRgba[0]), Math.abs(deltaRgba[1]), Math.abs(deltaRgba[2]));
    maxAlphaDelta = Math.max(maxAlphaDelta, Math.abs(deltaRgba[3]));
    changedPixelBounds.left = Math.min(changedPixelBounds.left, x);
    changedPixelBounds.top = Math.min(changedPixelBounds.top, y);
    changedPixelBounds.right = Math.max(changedPixelBounds.right, x);
    changedPixelBounds.bottom = Math.max(changedPixelBounds.bottom, y);
    const changedPixel = { index: pixel, x, y };
    changedPixels.push(changedPixel);
    if (changedPixelSamples.length < 20) {
      changedPixelSamples.push({ x, y, baselineRgba, currentRgba, deltaRgba });
    }
  }
  const diffPixelCount = changedPixels.length;
  const diffPixelRatio = diffPixelCount / pixelCount;
  const changedPixelClusters = clusterChangedPixels(changedPixels, expectedWidth, expectedHeight);
  const largestChangedPixelCluster = changedPixelClusters[0]?.pixelCount ?? 0;
  const maxDiffPixelCount = Math.max(8, Math.ceil(pixelCount * 0.00001));
  const summary = {
    diffPixelCount,
    diffPixelRatio,
    maxAllowedDiffPixelCount: maxDiffPixelCount,
    maxAllowedDiffPixelRatio: 0.00001,
    maxAbsoluteRgbChannelDelta,
    maxAllowedAbsoluteRgbChannelDelta: 2,
    maxAlphaDelta,
    requiredMaxAlphaDelta: 0,
    largestChangedPixelCluster,
    requiredLargestChangedPixelClusterLessThan: 4,
    changedPixelBounds: diffPixelCount === 0 ? null : changedPixelBounds,
    changedPixelClusters: changedPixelClusters.slice(0, 20),
    changedPixelSamples
  };
  return {
    ...summary,
    ok: diffPixelCount <= maxDiffPixelCount
      && diffPixelRatio <= 0.00001
      && maxAbsoluteRgbChannelDelta <= 2
      && maxAlphaDelta === 0
      && largestChangedPixelCluster < 4
  };
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

function canonicalJson(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function manifestHash(manifest) {
  const { baselineManifestHash, ...rest } = manifest;
  return createHash("sha256").update(canonicalJson(rest)).digest("hex");
}

function digestFiles(paths) {
  const hash = createHash("sha256");
  for (const path of paths.toSorted()) {
    hash.update(path);
    hash.update("\0");
    hash.update(readFileSync(path));
    hash.update("\0");
  }
  return hash.digest("hex");
}

function assertStaticOutput() {
  if (!existsSync(staticRoot)) {
    throw new Error(`missing_static_output:${staticRoot}`);
  }
  const files = readdirSync(staticRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .toSorted();
  const missing = staticPageAllowlist.filter((file) => !files.includes(file));
  const unexpected = files.filter((file) => !staticPageAllowlist.includes(file));
  if (missing.length > 0 || unexpected.length > 0) {
    throw new Error(`static_output_allowlist_mismatch:${JSON.stringify({ missing, unexpected })}`);
  }
}

function startStaticServer(rootDirectory) {
  const root = resolve(rootDirectory);
  const server = createServer((request, response) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const requested = decodeURIComponent(url.pathname).replace(/^\/+/, "") || "index.html";
    const target = resolve(root, requested);
    if (relative(root, target).startsWith("..")) {
      response.writeHead(403);
      response.end("forbidden");
      return;
    }
    try {
      const stat = statSync(target);
      if (!stat.isFile()) {
        response.writeHead(404);
        response.end("not found");
        return;
      }
      response.writeHead(200, { "content-type": contentType(target) });
      createReadStream(target).pipe(response);
    } catch {
      response.writeHead(404);
      response.end("not found");
    }
  });
  return new Promise((resolveServer, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("static_server_missing_port"));
        return;
      }
      resolveServer({
        origin: `http://127.0.0.1:${address.port}`,
        stableOrigin: "http://127.0.0.1:<ephemeral>",
        close: () => new Promise((resolveClose, rejectClose) => server.close((error) => error ? rejectClose(error) : resolveClose()))
      });
    });
  });
}

function inspectPng(path, expectedViewport) {
  const buffer = readFileSync(path);
  const signature = buffer.subarray(0, 8).toString("hex");
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  const sampleStep = Math.max(1, Math.floor(buffer.length / 4096));
  const sampled = [];
  for (let index = 0; index < buffer.length; index += sampleStep) {
    sampled.push(buffer[index]);
  }
  const uniqueSampleBytes = new Set(sampled).size;
  return {
    ok: signature === "89504e470d0a1a0a"
      && width === expectedViewport.width
      && height === expectedViewport.height
      && buffer.length > 4000
      && uniqueSampleBytes >= 24,
    width,
    height,
    bytes: buffer.length,
    uniqueSampleBytes,
    sha256: hashBuffer(buffer)
  };
}

async function waitForStableBox(page, locator) {
  let previous = null;
  let stableCount = 0;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const box = await locator.boundingBox();
    if (box && previous
      && Math.abs(box.x - previous.x) < 0.5
      && Math.abs(box.y - previous.y) < 0.5
      && Math.abs(box.width - previous.width) < 0.5
      && Math.abs(box.height - previous.height) < 0.5) {
      stableCount += 1;
      if (stableCount >= 2) {
        return box;
      }
    } else {
      stableCount = 0;
    }
    previous = box;
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  }
  throw new Error("target_bounding_box_not_stable");
}

async function waitForPaintSettled(page) {
  await page.evaluate(async () => {
    await document.fonts?.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

async function settleStaticViewport(page, state) {
  await page.evaluate(async (input) => {
    const settleFrames = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    window.tcrnStorybookScrollToHash?.();
    await settleFrames();
    const target = document.querySelector(`[data-contract-story-id="${input.storyId}"]`);
    if (target instanceof HTMLElement) {
      const rawOffset = window.getComputedStyle(document.documentElement).getPropertyValue("--tcrn-anchor-scroll-offset");
      const parsedOffset = Number.parseFloat(rawOffset);
      const offset = Number.isFinite(parsedOffset) ? parsedOffset : 22;
      const top = Math.max(0, Math.round(target.getBoundingClientRect().top + window.scrollY - offset));
      window.scrollTo({ top, left: 0, behavior: "auto" });
    }
    const scrollContainers = Array.from(document.querySelectorAll(".tcrn-doc-sidebar, [data-doc-nav], [data-doc-scroll-region]"));
    for (const container of scrollContainers) {
      if (container instanceof HTMLElement) {
        container.scrollTop = Math.round(container.scrollTop);
        container.scrollLeft = 0;
      }
    }
    window.tcrnUpdateCurrentStoryContext?.();
    await settleFrames();
  }, { storyId: state.storyId });
}

async function applyVisualInteraction(page, state) {
  if (!state.interaction) {
    return;
  }
  if (state.interaction === "search-focus") {
    await page.locator(".tcrn-search-input__control").focus();
	  } else if (state.interaction === "search-results") {
	    const input = page.locator(".tcrn-search-input__control");
	    await input.focus();
	    await input.fill("proof");
	    await page.waitForSelector("[data-doc-search-results]:not([hidden])");
  } else if (state.interaction === "locale-menu") {
    await page.locator(".tcrn-shell-locale-menu__trigger").click();
    await page.waitForSelector("[data-locale-menu]:not([hidden])");
	  } else if (state.interaction === "sidebar-collapsed") {
	    await page.locator(".tcrn-shell-side-nav-toggle").click();
	    await page.waitForSelector("[data-contract-surface='tcrn-design-system-storybook'][data-sidebar-collapsed='true']");
  } else if (state.interaction === "scrolled-topbar") {
    await page.evaluate(() => {
      window.scrollTo({ top: 220, left: 0, behavior: "auto" });
      window.tcrnUpdateCurrentStoryContext?.();
    });
  } else {
    throw new Error(`unknown_visual_interaction:${state.interaction}`);
  }
  await waitForPaintSettled(page);
}

async function captureStableScreenshot(page, path, expectedViewport) {
  let previousHash = null;
  let previousBuffer = null;
  const attempts = [];
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    await waitForPaintSettled(page);
    const rawBuffer = await page.screenshot({ fullPage: false, animations: "disabled" });
    const buffer = canonicalizeScreenshotPng(rawBuffer);
    const sha256 = hashBuffer(buffer);
    attempts.push({ attempt, sha256, rawSha256: hashBuffer(rawBuffer), bytes: buffer.length, rawBytes: rawBuffer.length });
    if (previousHash === sha256 && previousBuffer) {
      writeFileSync(path, buffer);
      return {
        png: inspectPng(path, expectedViewport),
        stability: {
          ok: true,
          requiredConsecutiveIdenticalHashes: 2,
          stableAtAttempt: attempt,
          attempts
        }
      };
    }
    previousHash = sha256;
    previousBuffer = buffer;
  }
  if (previousBuffer) {
    writeFileSync(path, previousBuffer);
  }
  return {
    png: inspectPng(path, expectedViewport),
    stability: {
      ok: false,
      requiredConsecutiveIdenticalHashes: 2,
      stableAtAttempt: null,
      attempts
    }
  };
}

async function disableMotion(page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-delay: 0s !important;
        animation-duration: 0s !important;
        caret-color: transparent !important;
        -webkit-font-smoothing: antialiased !important;
        font-kerning: none !important;
        font-variant-ligatures: none !important;
        scroll-behavior: auto !important;
        text-rendering: geometricPrecision !important;
        transition-delay: 0s !important;
        transition-duration: 0s !important;
      }
      svg, svg * {
        shape-rendering: geometricPrecision !important;
      }
      html, body, * {
        scrollbar-color: transparent transparent !important;
        scrollbar-width: none !important;
      }
      *::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
      }
    `
  });
}

async function collectStaticPageReadbacks(server) {
  const readbacks = [];
  for (const file of staticPageAllowlist) {
    const response = await fetch(`${server.origin}/${file}`);
    const body = Buffer.from(await response.arrayBuffer());
    readbacks.push({
      file,
      status: response.status,
      ok: response.status === 200,
      bytes: body.length,
      sha256: hashBuffer(body),
      contentType: response.headers.get("content-type") ?? ""
    });
  }
  return readbacks;
}

async function collectPageHealth(page, state) {
  return await page.evaluate(async (input) => {
    const root = document.querySelector("[data-contract-surface='tcrn-design-system-storybook']");
    const target = document.querySelector(`[data-contract-story-id="${input.storyId}"]`);
    const rect = target?.getBoundingClientRect();
    const html = document.documentElement.outerHTML;
    const bodyText = document.body.innerText;
    const storybookLocale = root?.getAttribute("data-storybook-locale") ?? document.documentElement.getAttribute("data-storybook-locale");
    const brandNode = document.querySelector(".tcrn-doc-brand");
    const brandCaptionNode = brandNode?.querySelector(".tcrn-product-logo__line-two, .tcrn-shell-brand-lockup__caption") ?? null;
    const docBrandText = brandNode?.textContent?.replace(/\s+/g, " ").trim() ?? null;
    const docBrandCaptionText = brandCaptionNode?.textContent?.replace(/\s+/g, " ").trim() ?? null;
    const visibleShellTextSurface = [
      brandNode?.textContent ?? "",
      document.querySelector(".tcrn-doc-current-location")?.textContent ?? "",
      document.querySelector(".tcrn-doc-header-controls")?.textContent ?? "",
      target instanceof HTMLElement ? target.innerText : ""
    ].join("\n");
    const ownerVisibleShellTextHits = input.forbiddenOwnerVisibleShellText
      .filter((rule) => visibleShellTextSurface.includes(rule.text))
      .map((rule) => rule.id);
    if (storybookLocale === "zh-CN" && (docBrandText?.includes("Component Library") || docBrandCaptionText !== "组件库")) {
      ownerVisibleShellTextHits.push(`zh-cn-doc-brand-caption:${docBrandCaptionText ?? "missing"}`);
    }
    const forbiddenHits = input.forbiddenPatterns
      .filter((rule) => new RegExp(rule.source, rule.flags).test(html) || new RegExp(rule.source, rule.flags).test(bodyText))
      .map((rule) => rule.id);
    const readRect = (selector) => {
      const node = document.querySelector(selector);
      if (!node) {
        return null;
      }
      const nodeRect = node.getBoundingClientRect();
      return {
        x: Number(nodeRect.x.toFixed(2)),
        y: Number(nodeRect.y.toFixed(2)),
        top: Number(nodeRect.top.toFixed(2)),
        right: Number(nodeRect.right.toFixed(2)),
        bottom: Number(nodeRect.bottom.toFixed(2)),
        left: Number(nodeRect.left.toFixed(2)),
        width: Number(nodeRect.width.toFixed(2)),
        height: Number(nodeRect.height.toFixed(2))
      };
    };
    const readStyle = (selector, properties) => {
      const node = document.querySelector(selector);
      if (!node) {
        return null;
      }
      const style = getComputedStyle(node);
      return Object.fromEntries(properties.map((property) => [property, style.getPropertyValue(property)]));
    };
    const waitFrames = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const widthWithin = (actual, expected, tolerance) =>
      typeof actual === "number" && typeof expected === "number" && Math.abs(actual - expected) <= tolerance;
    const searchRoot = document.querySelector(".tcrn-doc-header-search");
    const searchInput = searchRoot?.querySelector(".tcrn-search-input__control");
    const readSearchState = () => {
      const inputShell = readRect(".tcrn-search-input");
      const control = readRect(".tcrn-doc-header-search .tcrn-search-input__control");
      const icon = readRect(".tcrn-doc-header-search .tcrn-search-input__icon");
      const shortcut = readRect(".tcrn-doc-header-search .tcrn-search-input__shortcut");
      const fitFailures = [];
      if (inputShell && control && icon && shortcut) {
        if (control.width < 84) fitFailures.push(`control-width:${control.width}`);
        if (icon.left < inputShell.left - 1 || icon.right > control.left + 1) fitFailures.push("icon-track-overlap");
        if (shortcut.left < control.right - 1 || shortcut.right > inputShell.right + 1) fitFailures.push("shortcut-track-overlap");
      } else {
        fitFailures.push("search-track-missing");
      }
      const inputShellStyles = readStyle(".tcrn-search-input", [
        "border-color",
        "border-radius",
        "display",
        "grid-template-columns",
        "transition-duration",
        "transition-property",
        "transition-timing-function"
      ]);
      if (inputShellStyles?.display !== "grid") fitFailures.push(`display:${inputShellStyles?.display ?? "missing"}`);
      return {
        expanded: searchRoot?.closest(".tcrn-doc-header__workspace")?.getAttribute("data-search-expanded") ?? null,
        resultsVisible: document.querySelector("[data-doc-search-results]")?.hasAttribute("hidden") ? "false" : "true",
        wrapper: readRect(".tcrn-doc-header-search"),
        inputShell,
        control,
        icon,
        shortcut,
        fitFailures,
        inputShellStyles,
        wrapperStyles: readStyle(".tcrn-doc-header-search", [
          "transition-duration",
          "transition-property",
          "transition-timing-function"
        ])
      };
    };
    const searchInteractionReadback = {
      rest: readSearchState(),
      focused: null,
      afterBlurCollapse: null,
      reducedMotionSuppressed: null
    };
    if (searchInput instanceof HTMLElement) {
      const previousActive = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const previousScroll = { x: window.scrollX, y: window.scrollY };
      searchInput.focus({ preventScroll: true });
      await waitFrames();
      searchInteractionReadback.focused = readSearchState();
      searchInput.blur();
      await new Promise((resolve) => window.setTimeout(resolve, 150));
      await waitFrames();
      searchInteractionReadback.afterBlurCollapse = readSearchState();
      if (previousActive && previousActive !== searchInput) {
        previousActive.focus({ preventScroll: true });
      }
      window.scrollTo({ top: previousScroll.y, left: previousScroll.x, behavior: "auto" });
      const wrapperDuration = searchInteractionReadback.focused?.wrapperStyles?.["transition-duration"] ?? "";
      const inputDuration = searchInteractionReadback.focused?.inputShellStyles?.["transition-duration"] ?? "";
      searchInteractionReadback.reducedMotionSuppressed =
        [wrapperDuration, inputDuration].every((duration) => /(^|,\s*)0(?:ms|s)(?:,|$)/.test(duration.trim()) || duration.trim() === "0s");
    }
    const topbar = readRect(".tcrn-doc-header");
    const topbarStyles = readStyle(".tcrn-doc-header", ["background-color", "background-image"]);
    const sideNavRegion = readRect(".tcrn-doc-sidebar");
    const currentLocation = readRect(".tcrn-doc-current-location");
    const themeToggle = readRect(".tcrn-shell-theme-toggle");
    const localeTrigger = readRect(".tcrn-shell-locale-menu__trigger");
    const themeToggleStyles = readStyle(".tcrn-shell-theme-toggle", ["border-radius"]);
    const topbarContentAlignmentDelta = currentLocation && rect
      ? Number((currentLocation.left - rect.left).toFixed(2))
      : null;
    const topbarToContentGap = topbar && rect
      ? Number((rect.top - topbar.bottom).toFixed(2))
      : null;
    const activeDocShellRoute =
      document.querySelector("[data-doc-nav-item][aria-current='location'][data-doc-nav-item-active='true']")?.getAttribute("data-doc-nav-item") ?? null;
    const metricFailures = [];
    if (root?.getAttribute("data-doc-shell") !== "online-docs") {
      metricFailures.push(`docShellAuthority:${root?.getAttribute("data-doc-shell") ?? "missing"}`);
    }
    const globalProductShellShellSelectorCount = Array.from(document.querySelectorAll("[data-product-shell-region='side-navigation'], .tcrn-product-shell__sidebar, .tcrn-product-shell__main"))
      .filter((node) => !node.closest(".story-body"))
      .length;
    if (globalProductShellShellSelectorCount > 0) {
      metricFailures.push("globalProductShellShellSelectorPresent");
    }
    if (!document.querySelector("[data-doc-nav-category-toggle]")) {
      metricFailures.push("docShellCategoryNavigationMissing");
    }
    const docShellSelectorCount = document.querySelectorAll("[data-doc-shell], .tcrn-doc-header, .tcrn-doc-global-bar, .tcrn-doc-header-search, .tcrn-doc-nav, .tcrn-doc-sidebar").length;
    if (docShellSelectorCount < 6) {
      metricFailures.push(`docShellSelectorCount:${docShellSelectorCount}`);
    }
    if (activeDocShellRoute !== input.storyId) {
      metricFailures.push(`activeDocShellRoute:${activeDocShellRoute ?? "missing"}`);
    }
    if (window.innerWidth >= input.expectedOracle.desktopMinWidth) {
      const expectedSidebarWidth = input.interaction === "sidebar-collapsed"
        ? input.expectedOracle.sidebarCollapsedWidthPx
        : input.expectedSidebarWidthPx;
      if (!widthWithin(sideNavRegion?.width, expectedSidebarWidth, input.expectedOracle.sidebarTolerancePx)) {
        metricFailures.push(`sidebarWidth:${sideNavRegion?.width ?? "missing"}:expected:${expectedSidebarWidth}`);
      }
      if (!widthWithin(topbar?.height, input.expectedOracle.topbarHeightPx, input.expectedOracle.topbarTolerancePx)) {
        metricFailures.push(`topbarHeight:${topbar?.height ?? "missing"}:expected:${input.expectedOracle.topbarHeightPx}`);
      }
      const expectedInitialSearchWidth = ["search-focus", "search-results"].includes(input.interaction)
        ? input.expectedOracle.searchExpandedWidthPx
        : input.expectedOracle.searchRestWidthPx;
      if (!widthWithin(searchInteractionReadback.rest.wrapper?.width, expectedInitialSearchWidth, input.expectedOracle.searchMetricTolerancePx)) {
        metricFailures.push(`searchInitialWidth:${searchInteractionReadback.rest.wrapper?.width ?? "missing"}:expected:${expectedInitialSearchWidth}`);
      }
      if ((searchInteractionReadback.rest.fitFailures ?? []).length > 0) {
        metricFailures.push(`searchFit:${searchInteractionReadback.rest.fitFailures.join("|")}`);
      }
      if (!widthWithin(searchInteractionReadback.focused?.wrapper?.width, input.expectedOracle.searchExpandedWidthPx, input.expectedOracle.searchMetricTolerancePx)) {
        metricFailures.push(`searchFocusedWidth:${searchInteractionReadback.focused?.wrapper?.width ?? "missing"}:expected:${input.expectedOracle.searchExpandedWidthPx}`);
      }
      if (!widthWithin(searchInteractionReadback.afterBlurCollapse?.wrapper?.width, input.expectedOracle.searchRestWidthPx, input.expectedOracle.searchMetricTolerancePx)) {
        metricFailures.push(`searchCollapsedWidth:${searchInteractionReadback.afterBlurCollapse?.wrapper?.width ?? "missing"}:expected:${input.expectedOracle.searchRestWidthPx}`);
      }
      if (!widthWithin(searchInteractionReadback.rest.inputShell?.height, input.expectedOracle.searchHeightPx, input.expectedOracle.searchMetricTolerancePx)) {
        metricFailures.push(`searchHeight:${searchInteractionReadback.rest.inputShell?.height ?? "missing"}:expected:${input.expectedOracle.searchHeightPx}`);
      }
      const expectedSearchBorderColor = input.themeMode === "dark"
        ? input.expectedOracle.searchBorderColorDark
        : input.expectedOracle.searchBorderColor;
      if (searchInteractionReadback.rest.inputShellStyles?.["border-color"] !== expectedSearchBorderColor) {
        metricFailures.push(`searchBorderColor:${searchInteractionReadback.rest.inputShellStyles?.["border-color"] ?? "missing"}:expected:${expectedSearchBorderColor}`);
      }
      if (searchInteractionReadback.rest.inputShellStyles?.["border-radius"] !== `${input.expectedOracle.searchBorderRadiusPx}px`) {
        metricFailures.push(`searchBorderRadius:${searchInteractionReadback.rest.inputShellStyles?.["border-radius"] ?? "missing"}:expected:${input.expectedOracle.searchBorderRadiusPx}px`);
      }
      if (!widthWithin(themeToggle?.width, input.expectedOracle.themeToggleSizePx, 1) || !widthWithin(themeToggle?.height, input.expectedOracle.themeToggleSizePx, 1)) {
        metricFailures.push(`themeToggleSize:${themeToggle?.width ?? "missing"}x${themeToggle?.height ?? "missing"}:expected:${input.expectedOracle.themeToggleSizePx}`);
      }
      if (themeToggleStyles?.["border-radius"] !== `${input.expectedOracle.themeToggleRadiusPx}px`) {
        metricFailures.push(`themeToggleRadius:${themeToggleStyles?.["border-radius"] ?? "missing"}:expected:${input.expectedOracle.themeToggleRadiusPx}px`);
      }
      if (!widthWithin(localeTrigger?.height, input.expectedOracle.localeTriggerHeightPx, 1)) {
        metricFailures.push(`localeTriggerHeight:${localeTrigger?.height ?? "missing"}:expected:${input.expectedOracle.localeTriggerHeightPx}`);
      }
      if (!["search-focus", "search-results"].includes(input.interaction ?? "") && !(currentLocation && searchInteractionReadback.rest.wrapper && currentLocation.right <= searchInteractionReadback.rest.wrapper.left + 1)) {
        metricFailures.push("currentLocationNotBeforeSearch");
      }
      if (!(searchInteractionReadback.rest.wrapper && themeToggle && searchInteractionReadback.rest.wrapper.right <= themeToggle.left + 1)) {
        metricFailures.push("searchNotBeforeThemeToggle");
      }
      if (
        /(?:rgba\\(0, 0, 0, 0\\)|transparent)/i.test(topbarStyles?.["background-color"] ?? "transparent")
        && (topbarStyles?.["background-image"] ?? "none") === "none"
      ) {
        metricFailures.push("transparentTopbarLayer");
      }
      if (!["scrolled-topbar"].includes(input.interaction ?? "") && typeof topbarContentAlignmentDelta === "number" && Math.abs(topbarContentAlignmentDelta) > input.expectedOracle.currentLocationContentAlignmentTolerancePx) {
        metricFailures.push(`currentLocationContentAlignmentDelta:${topbarContentAlignmentDelta}:max:${input.expectedOracle.currentLocationContentAlignmentTolerancePx}`);
      }
      if (!["scrolled-topbar"].includes(input.interaction ?? "") && (typeof topbarToContentGap !== "number" || topbarToContentGap < input.expectedOracle.contentTopGapMinPx || topbarToContentGap > input.expectedOracle.contentTopGapMaxPx)) {
        metricFailures.push(`topbarToContentGap:${topbarToContentGap ?? "missing"}:expected:${input.expectedOracle.contentTopGapMinPx}-${input.expectedOracle.contentTopGapMaxPx}`);
      }
      const trailingGap = localeTrigger ? Number((window.innerWidth - localeTrigger.right).toFixed(2)) : null;
      if (typeof trailingGap !== "number" || trailingGap < input.expectedOracle.trailingUtilityGapMinPx || trailingGap > input.expectedOracle.trailingUtilityGapMaxPx) {
        metricFailures.push(`utilityTrailingGap:${trailingGap ?? "missing"}`);
      }
      if (!searchInteractionReadback.reducedMotionSuppressed) {
        metricFailures.push("searchReducedMotionNotSuppressed");
      }
    }
    const targetVisible = Boolean(rect && rect.width > 0 && rect.height > 0);
    const targetInViewport = Boolean(rect && rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth);
    const dialogPanel = document.querySelector("#dialog-spec-usage [data-dialog-fixture-panel]");
    const dialogTrigger = document.querySelector("#dialog-spec-usage [data-dialog-fixture-open]");
    return {
      title: document.title,
      url: window.location.href.replace(/http:\/\/127\.0\.0\.1:\d+/g, "http://127.0.0.1:<ephemeral>"),
      rootVisible: Boolean(root),
      activeSection: root?.getAttribute("data-active-story-section") ?? null,
      storybookLocale,
      docBrandText,
      docBrandCaptionText,
      htmlTheme: document.documentElement.getAttribute("data-tcrn-theme"),
      rootTheme: root?.getAttribute("data-storybook-theme") ?? null,
      colorScheme: getComputedStyle(document.documentElement).colorScheme,
      storyId: input.storyId,
      targetVisible,
      targetInViewport,
      targetRect: rect ? {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom)
      } : null,
      bodyScrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      bodyOverflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      storyRegionCount: document.querySelectorAll("[data-contract-story-id]").length,
      currentDocShellRoute: activeDocShellRoute,
      docShellAuthority: root?.getAttribute("data-doc-shell") ?? null,
      globalProductShellShellSelectorCount,
      docShellSelectorCount,
      ownerVisibleShellTextHits,
      storybookDocShellOracleMetrics: {
        topbar,
        topbarStyles,
        sideNavRegion,
        currentLocation,
        topbarContentAlignmentDelta,
        topbarToContentGap,
        search: searchInteractionReadback.rest.wrapper,
        searchInputShell: searchInteractionReadback.rest.inputShell,
        searchInputShellStyles: searchInteractionReadback.rest.inputShellStyles,
        searchInteractionReadback,
        themeToggle,
        themeToggleRadius: themeToggleStyles?.["border-radius"] ?? null,
        localeTrigger,
        metricFailures
      },
      forbiddenHits,
      staticClosedDialogFixture: input.staticClosedDialogFixture ? {
        panelHidden: dialogPanel?.hasAttribute("hidden") ?? false,
        triggerExpanded: dialogTrigger?.getAttribute("aria-expanded") ?? null
      } : null
    };
	  }, {
	    storyId: state.storyId,
	    interaction: state.interaction ?? "rest",
	    themeMode: state.themeMode ?? deterministicBrowserSettings.defaultThemeMode,
	    staticClosedDialogFixture: Boolean(state.staticClosedDialogFixture),
	    expectedOracle: storybookDocShellMetricOracle,
	    expectedSidebarWidthPx: state.expectedSidebarWidthPx,
	    forbiddenOwnerVisibleShellText,
    forbiddenPatterns: forbiddenStaticDocPatterns.map((rule) => ({ id: rule.id, source: rule.pattern.source, flags: rule.pattern.flags }))
  });
}

function assertCapture(entry, health, events, png, stability) {
  const failures = [];
  if (!health.rootVisible) failures.push("missing_contract_surface");
  if (!health.targetVisible) failures.push("target_not_visible");
  if (!health.targetInViewport && !["search-focus", "search-results", "locale-menu"].includes(entry.interaction ?? "")) {
    failures.push("target_not_in_viewport_after_hash_scroll");
  }
  if (health.bodyOverflowX) failures.push("body_horizontal_overflow");
  if (health.currentDocShellRoute !== entry.storyId) failures.push(`active_doc_shell_route_mismatch:${health.currentDocShellRoute}`);
  if (health.storybookDocShellOracleMetrics?.metricFailures?.length > 0) {
    failures.push(`storybook_doc_shell_oracle_metric_failures:${health.storybookDocShellOracleMetrics.metricFailures.join(",")}`);
  }
  const expectedTheme = entry.themeMode ?? deterministicBrowserSettings.defaultThemeMode;
  if (health.htmlTheme !== expectedTheme) failures.push(`html_theme_mismatch:${health.htmlTheme}`);
  if (health.rootTheme !== expectedTheme) failures.push(`root_theme_mismatch:${health.rootTheme}`);
  if (health.forbiddenHits.length > 0) failures.push(`forbidden_static_doc_hits:${health.forbiddenHits.join(",")}`);
  if (health.ownerVisibleShellTextHits.length > 0) failures.push(`owner_visible_shell_text_hits:${health.ownerVisibleShellTextHits.join(",")}`);
  if (health.staticClosedDialogFixture && !health.staticClosedDialogFixture.panelHidden) failures.push("dialog_fixture_not_static_closed");
  if (health.staticClosedDialogFixture && health.staticClosedDialogFixture.triggerExpanded !== "false") failures.push("dialog_trigger_not_static_closed");
  if (events.consoleMessages.length > 0) failures.push("console_warning_or_error");
  if (events.pageErrors.length > 0) failures.push("page_error");
  if (events.failedRequests.length > 0) failures.push("request_failure");
  if (events.nonOkResponses.length > 0) failures.push("non_200_response");
  if (events.nonLoopbackRequests.length > 0) failures.push("non_loopback_request");
  if (!png.ok) failures.push("blank_low_entropy_or_incorrect_dimension_screenshot");
  if (!stability.ok) failures.push("screenshot_hash_not_stable_before_capture");
  return failures;
}

async function captureVisualMatrix({ server, browser, outputDir }) {
  rmSync(outputDir, { recursive: true, force: true });
  mkdirSync(outputDir, { recursive: true });
  const entries = [];
  for (const viewport of viewportMatrix) {
    for (const state of visualStateAllowlist) {
      if (Array.isArray(state.viewportIds) && !state.viewportIds.includes(viewport.id)) {
        continue;
      }
      const themeMode = state.themeMode ?? deterministicBrowserSettings.defaultThemeMode;
      const locale = state.locale ?? "en";
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
        colorScheme: themeMode,
        reducedMotion: "reduce",
        locale: locale === "zh-CN" ? "zh-CN" : "en-US",
        timezoneId: "UTC"
      });
      await context.addInitScript((fixedNow) => {
        const fixedTime = new Date(fixedNow).getTime();
        Date.now = () => fixedTime;
      }, deterministicBrowserSettings.fixedDateNow);
      const page = await context.newPage();
      const events = {
        consoleMessages: [],
        pageErrors: [],
        failedRequests: [],
        nonOkResponses: [],
        nonLoopbackRequests: []
      };
      page.on("console", (message) => {
        if (["error", "warning"].includes(message.type())) {
          events.consoleMessages.push({ type: message.type(), text: message.text().slice(0, 300) });
        }
      });
      page.on("pageerror", (error) => events.pageErrors.push(error.message.slice(0, 300)));
      page.on("request", (request) => {
        const url = request.url();
        if (url.startsWith("http://") && !url.startsWith(server.origin)) {
          events.nonLoopbackRequests.push(url.replace(/http:\/\/127\.0\.0\.1:\d+/g, server.stableOrigin));
        }
      });
      page.on("requestfailed", (request) => {
        events.failedRequests.push({
          url: request.url().replace(server.origin, server.stableOrigin),
          error: request.failure()?.errorText ?? "unknown"
        });
      });
      page.on("response", (response) => {
        if (response.url().startsWith(server.origin) && response.status() !== 200) {
          events.nonOkResponses.push({
            url: response.url().replace(server.origin, server.stableOrigin),
            status: response.status()
          });
        }
      });

      const targetUrl = `${server.origin}/${state.page}?theme=${themeMode}&locale=${encodeURIComponent(locale)}#${state.hash}`;
      await page.goto(targetUrl, { waitUntil: "networkidle" });
      await disableMotion(page);
      await page.waitForSelector("[data-contract-surface='tcrn-design-system-storybook']", { state: "visible" });
      await page.waitForSelector(`[data-storybook-locale='${locale}']`);
      const target = page.locator(`[data-contract-story-id="${state.storyId}"]`);
      await target.waitFor({ state: "visible" });
      await settleStaticViewport(page, state);
      await applyVisualInteraction(page, state);
      await waitForPaintSettled(page);
      await waitForStableBox(page, target);

      const fileName = `${state.id}__${viewport.id}.png`;
      const path = join(outputDir, fileName);
      const { png, stability } = await captureStableScreenshot(page, path, viewport);
      const stateWithViewportOracle = {
        ...state,
        expectedSidebarWidthPx: expectedStorybookSidebarWidthForViewport(viewport.width, storybookDocShellMetricOracle)
      };
      const health = await collectPageHealth(page, stateWithViewportOracle);
      const failures = assertCapture(stateWithViewportOracle, health, events, png, stability);
      entries.push({
        stateId: state.id,
        page: state.page,
        hash: state.hash,
        storyId: state.storyId,
        locale,
        interaction: state.interaction ?? "rest",
        themeMode,
        viewport: viewport.id,
        width: viewport.width,
        height: viewport.height,
        path,
        rawSha256: png.sha256,
        bytes: png.bytes,
        png,
        stability,
        health,
        events,
        failures
      });
      await page.close();
      await context.close();
    }
  }
  return entries;
}

function makeBaseReceipt({
  mode,
  sourceHead,
  sourceContentDigest,
  staticPageReadbacks,
  oracleRecoveryReadback,
  browserVersion,
  compareFailures = [],
  comparisonReadbacks = [],
  entries
}) {
  const comparisonByKey = new Map(comparisonReadbacks.map((item) => [`${item.stateId}::${item.viewport}`, item]));
  const failureArrays = {
    staticPageFailures: staticPageReadbacks.filter((page) => !page.ok),
    screenshotFailures: entries.filter((entry) => entry.failures.length > 0).map((entry) => ({
      stateId: entry.stateId,
      viewport: entry.viewport,
      failures: entry.failures
    })),
    compareFailures,
    oracleRecoveryFailures: oracleRecoveryReadback?.ok === false ? oracleRecoveryReadback.failures : []
  };
  return {
    ok: failureArrays.staticPageFailures.length === 0
      && failureArrays.screenshotFailures.length === 0
      && failureArrays.compareFailures.length === 0
      && failureArrays.oracleRecoveryFailures.length === 0,
    sourceContentDigest,
    sourceHead,
    mode,
    comparisonContractVersion,
    visualArtifactContractDisposition,
    packageName,
    staticPageAllowlist,
    visualStateAllowlist: visualStateAllowlist.map(({ id, page, hash, storyId, description, locale, themeMode, interaction, viewportIds }) => ({
      id,
      page,
      hash,
      storyId,
      description,
      locale: locale ?? "en",
      themeMode: themeMode ?? deterministicBrowserSettings.defaultThemeMode,
      interaction: interaction ?? "rest",
      viewportIds: viewportIds ?? null
    })),
    viewportMatrix,
    deterministicBrowserSettings,
    staticPageReadbacks,
    oracleRecoveryReadback,
    screenshotReadbacks: entries.map((entry) => ({
      ...(() => {
        const comparison = comparisonByKey.get(`${entry.stateId}::${entry.viewport}`);
        return comparison
          ? {
              rawIntegrity: comparison.rawIntegrity,
              comparisonMethod: comparison.comparisonMethod,
              pixelDeltaSummary: comparison.pixelDeltaSummary
            }
          : {};
      })(),
      stateId: entry.stateId,
      viewport: entry.viewport,
      page: entry.page,
      hash: entry.hash,
      storyId: entry.storyId,
      locale: entry.locale,
      interaction: entry.interaction,
      themeMode: entry.themeMode,
      path: entry.path.replaceAll("\\", "/"),
      rawSha256: entry.rawSha256,
      width: entry.width,
      height: entry.height,
      bytes: entry.bytes,
      screenshotStability: entry.stability,
      targetRect: entry.health.targetRect,
      currentDocShellRoute: entry.health.currentDocShellRoute,
      storybookDocShellOracleMetrics: entry.health.storybookDocShellOracleMetrics,
      events: entry.events,
      failures: entry.failures
    })),
    failureArrays,
    noOverclaimReadback,
    deferredBoundaries,
    playwrightVersion,
    chromiumVersion: browserVersion,
    baselineManifestHash: null,
    compareFailures,
    comparisonReadbacks
  };
}

function collectOracleRecoveryReadback() {
  const aiContractPath = join(staticRoot, "ai-consumption-contract.json");
  const llmsPath = join(staticRoot, "llms.txt");
  const contract = JSON.parse(readFileSync(aiContractPath, "utf8"));
  const llmsText = readFileSync(llmsPath, "utf8");
  const expectedReceipt =
    "TCRN Workflow/vault/initiatives/projects/TCRN-DESIGN-SYSTEM/active/storybook-shell-control-stabilization/50-implementation-plan.md#storybook-original-shell-restoration-implementation-plan";
  const expectedClassification = "owner_declared_original_storybook_doc_shell_standard";
  const metricEvidence = contract.storybookDocShellVisualOracle?.metricEvidence ?? [];
  const requiredMetrics = ["desktopSidebarWidthPx", "desktopTopbarHeightPx", "searchRestWidthPx", "searchExpandedWidthPx"];
  const missingMetricEvidence = requiredMetrics.filter((metric) => !metricEvidence.some((item) => (
    item.metric === metric
    && typeof item.sha256 === "string"
    && item.sha256.length === 64
    && String(item.evidencePath ?? "").includes("docs/verification/storybook-visual-proof/screenshots/baseline/")
  )));
  const failures = [];
  if (contract.storybookDocShellVisualOracle?.oracleRecoveryReceipt !== expectedReceipt) {
    failures.push("oracleRecoveryReceipt");
  }
  if (contract.storybookDocShellVisualOracle?.baselineManifestClassification !== expectedClassification) {
    failures.push("baselineManifestClassification");
  }
  if (!String(contract.storybookDocShellVisualOracle?.metricSourceDisposition ?? "").includes("Storybook documentation shell")) {
    failures.push("metricSourceDisposition");
  }
  if (missingMetricEvidence.length > 0) {
    failures.push(`metricEvidence:${missingMetricEvidence.join(",")}`);
  }
  if (!llmsText.includes(`oracle recovery: ${expectedReceipt}`)) {
    failures.push("llmsOracleRecovery");
  }
  if (!llmsText.includes(`baseline classification: ${expectedClassification}`)) {
    failures.push("llmsBaselineClassification");
  }
  return {
    ok: failures.length === 0,
    baselineManifestClassification: contract.storybookDocShellVisualOracle?.baselineManifestClassification ?? null,
    metricSourceDisposition: contract.storybookDocShellVisualOracle?.metricSourceDisposition ?? null,
    metricEvidenceCount: metricEvidence.length,
    missingMetricEvidence,
    requiredMetrics,
    failures
  };
}

function writeMarkdownReceipt(receipt) {
  const lines = [
    "# Storybook Visual Proof",
    "",
    `Mode: \`${receipt.mode}\``,
    `OK: \`${receipt.ok}\``,
    `Comparison contract: \`${comparisonContractVersion}\``,
    `Visual artifact contract: \`${visualArtifactContractDisposition.comparisonPolicy}\``,
    `Source head: \`${receipt.sourceHead}\``,
    `Oracle recovery: \`${receipt.oracleRecoveryReadback.ok}\``,
    `Static pages: ${receipt.staticPageReadbacks.length}`,
    `Screenshots: ${receipt.screenshotReadbacks.length}`,
    `Compare failures: ${receipt.compareFailures.length}`,
    "",
    "## No-Overclaim",
    "",
    `- localVisualProofDisposition: ${noOverclaimReadback.localVisualProofDisposition}`,
    `- themeModeVisualCoverageDisposition: ${noOverclaimReadback.themeModeVisualCoverageDisposition}`,
    `- hostedVisualSaasDisposition: ${noOverclaimReadback.hostedVisualSaasDisposition}`,
    `- ciGateDisposition: ${noOverclaimReadback.ciGateDisposition}`,
    `- storybookDocsPublicationDisposition: ${noOverclaimReadback.storybookDocsPublicationDisposition}`,
    `- packagePublicationDisposition: ${noOverclaimReadback.packagePublicationDisposition}`,
    `- consumerAdoptionDisposition: ${noOverclaimReadback.consumerAdoptionDisposition}`,
    `- releaseReadinessDisposition: ${noOverclaimReadback.releaseReadinessDisposition}`,
    `- acceptanceStateDisposition: ${noOverclaimReadback.acceptanceStateDisposition}`,
    `- componentLocalStoryGateDisposition: ${noOverclaimReadback.componentLocalStoryGateDisposition}`,
    "",
    "## Deferred",
    "",
    ...deferredBoundaries.map((boundary) => `- ${boundary}`)
  ];
  writeFileSync(markdownReceiptPath, `${lines.join("\n")}\n`);
}

function writeBaselineArtifacts({ receipt, entries }) {
  const manifest = {
    ok: receipt.ok,
    comparisonContractVersion,
    visualArtifactContractDisposition,
    sourceHead: receipt.sourceHead,
    sourceContentDigest: receipt.sourceContentDigest,
    packageName,
    staticPageAllowlist,
    visualStateAllowlist: receipt.visualStateAllowlist,
    viewportMatrix,
    deterministicBrowserSettings,
    playwrightVersion,
    chromiumVersion: receipt.chromiumVersion,
    noOverclaimReadback,
    deferredBoundaries,
    entries: entries.map((entry) => ({
      stateId: entry.stateId,
      viewport: entry.viewport,
      page: entry.page,
      hash: entry.hash,
      storyId: entry.storyId,
      locale: entry.locale,
      interaction: entry.interaction,
      themeMode: entry.themeMode,
      path: entry.path.replaceAll("\\", "/"),
      rawSha256: entry.rawSha256,
      width: entry.width,
      height: entry.height,
      bytes: entry.bytes
    }))
  };
  manifest.baselineManifestHash = manifestHash(manifest);
  receipt.baselineManifestHash = manifest.baselineManifestHash;
  writeFileSync(baselineManifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  writeFileSync(intentionalDiffManifestPath, `${JSON.stringify({
    ok: true,
    mode: "update-baseline",
    comparisonContractVersion,
    disposition: "visual_baseline_updated",
    entries: manifest.entries
  }, null, 2)}\n`);
  writeFileSync(updateReceiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
  writeMarkdownReceipt(receipt);
}

function loadBaselineManifest() {
  if (!existsSync(baselineManifestPath)) {
    throw new Error(`missing_baseline_manifest:${baselineManifestPath}`);
  }
  const manifest = JSON.parse(readFileSync(baselineManifestPath, "utf8"));
  const actualHash = manifestHash(manifest);
  if (manifest.baselineManifestHash !== actualHash) {
    throw new Error(`baseline_manifest_hash_mismatch:${manifest.baselineManifestHash}:${actualHash}`);
  }
  return manifest;
}

function jsonEqual(left, right) {
  return canonicalJson(left) === canonicalJson(right);
}

function compareToBaseline(entries, manifest, context) {
  const failures = [];
  const comparisonReadbacks = [];
  const expectedKeys = new Set(manifest.entries.map((entry) => `${entry.stateId}::${entry.viewport}`));
  const actualKeys = new Set(entries.map((entry) => `${entry.stateId}::${entry.viewport}`));
  for (const key of expectedKeys) {
    if (!actualKeys.has(key)) {
      failures.push({ key, reason: "missing_current_entry" });
    }
  }
  for (const key of actualKeys) {
    if (!expectedKeys.has(key)) {
      failures.push({ key, reason: "unexpected_current_entry" });
    }
  }
  if (manifest.comparisonContractVersion !== comparisonContractVersion) {
    failures.push({ key: "baseline-manifest", reason: "comparison_contract_version_mismatch", expected: comparisonContractVersion, actual: manifest.comparisonContractVersion ?? null });
  }
  for (const entry of entries) {
    const baseline = manifest.entries.find((item) => item.stateId === entry.stateId && item.viewport === entry.viewport);
    if (!baseline) {
      continue;
    }
    const key = `${entry.stateId}::${entry.viewport}`;
    const comparison = {
      stateId: entry.stateId,
      viewport: entry.viewport,
      rawIntegrity: {
        baselineRawSha256: baseline.rawSha256 ?? null,
        currentRawSha256: entry.rawSha256,
        rawExactMatch: false
      },
      comparisonMethod: "failed",
      pixelDeltaSummary: null
    };
    comparisonReadbacks.push(comparison);
    if (!existsSync(baseline.path)) {
      failures.push({ key, reason: "missing_baseline_png", path: baseline.path });
      continue;
    }
    const baselineHash = hashFile(baseline.path);
    if (baselineHash !== baseline.rawSha256) {
      failures.push({ key, reason: "baseline_png_hash_mismatch", expected: baseline.rawSha256, actual: baselineHash });
    }
    comparison.rawIntegrity.rawExactMatch = entry.rawSha256 === baseline.rawSha256;
    if (entry.rawSha256 === baseline.rawSha256) {
      comparison.comparisonMethod = "raw_png_sha256_exact";
    }
    if (entry.width !== baseline.width || entry.height !== baseline.height) {
      failures.push({ key, reason: "dimension_mismatch", expected: { width: baseline.width, height: baseline.height }, actual: { width: entry.width, height: entry.height } });
      continue;
    }
    if (comparison.rawIntegrity.rawExactMatch) {
      continue;
    }
    comparison.pixelDeltaSummary = {
      computed: false,
      disposition: exactMismatchDisposition
    };
    failures.push({
      key,
      reason: "raw_png_sha256_exact_match_required",
      comparisonContractVersion,
      disposition: exactMismatchDisposition,
      baselineRawSha256: baseline.rawSha256,
      currentRawSha256: entry.rawSha256
    });
    continue;
  }
  return { compareFailures: failures, comparisonReadbacks };
}

function markCurrentCapturePathsNonRetained(receipt) {
  receipt.screenshotReadbacks = receipt.screenshotReadbacks.map((readback) => ({
    ...Object.fromEntries(Object.entries(readback).filter(([key]) => key !== "path"))
  }));
  return receipt;
}

function listCurrentCaptureArtifacts() {
  if (!existsSync(currentCaptureDir)) {
    return [];
  }
  return readdirSync(currentCaptureDir).map((name) => join(currentCaptureDir, name).replaceAll("\\", "/"));
}

function cleanupCurrentCaptureDir() {
  rmSync(currentCaptureDir, { recursive: true, force: true });
  const residualArtifacts = listCurrentCaptureArtifacts();
  return {
    ok: residualArtifacts.length === 0,
    residualArtifacts
  };
}

async function run() {
  const { mode, reason } = parseArgs(process.argv.slice(2));
  assertStaticOutput();
  if (mode === "update-baseline") {
    rmSync(baselineDir, { recursive: true, force: true });
    rmSync(currentCaptureDir, { recursive: true, force: true });
  }
  mkdirSync(receiptRoot, { recursive: true });
  const sourceHead = git(["rev-parse", "HEAD"]);
  const sourceContentDigest = digestFiles([
    "package.json",
    "scripts/storybook-visual-proof.mjs",
    "scripts/no-private-input-scan.mjs",
    ...staticPageAllowlist.map((file) => join(staticRoot, file))
  ]);
  const captureDir = mode === "update-baseline" ? baselineDir : currentCaptureDir;
  const server = await startStaticServer(staticRoot);
  let browser;
  let serverStopped = false;
  try {
    browser = await chromium.launch({
      headless: true,
      args: deterministicBrowserSettings.chromiumArgs
    });
    const browserVersion = browser.version();
    const staticPageReadbacks = await collectStaticPageReadbacks(server);
    const oracleRecoveryReadback = collectOracleRecoveryReadback();
    const entries = await captureVisualMatrix({ server, browser, outputDir: captureDir });
    await browser.close();
    browser = null;
    await server.close();
    serverStopped = true;

    if (mode === "update-baseline") {
      const receipt = makeBaseReceipt({
        mode,
        sourceHead,
        sourceContentDigest,
        staticPageReadbacks,
        oracleRecoveryReadback,
        browserVersion,
        entries
      });
      writeBaselineArtifacts({ receipt, entries });
      console.log(JSON.stringify({
        ok: receipt.ok,
        mode,
        comparisonContractVersion,
        sourceHead,
        sourceContentDigest,
        oracleRecoveryOk: receipt.oracleRecoveryReadback.ok,
        screenshotCount: entries.length,
        baselineManifestPath,
        baselineManifestHash: receipt.baselineManifestHash
      }, null, 2));
      if (!receipt.ok) process.exit(1);
      return;
    }

    const baseline = loadBaselineManifest();
    const { compareFailures, comparisonReadbacks } = compareToBaseline(entries, baseline, {
      sourceContentDigest,
      browserVersion,
      oracleRecoveryReadback
    });
    const receipt = makeBaseReceipt({
      mode,
      sourceHead,
      sourceContentDigest,
      staticPageReadbacks,
      oracleRecoveryReadback,
      browserVersion,
      compareFailures,
      comparisonReadbacks,
      entries
    });
    receipt.baselineManifestHash = baseline.baselineManifestHash;
    if (receipt.ok) {
      receipt.currentCaptureCleanupReadback = cleanupCurrentCaptureDir();
      if (!receipt.currentCaptureCleanupReadback.ok) {
        const cleanupFailure = {
          key: "current-check",
          reason: currentCaptureCleanupFailure,
          residualArtifacts: receipt.currentCaptureCleanupReadback.residualArtifacts
        };
        receipt.compareFailures.push(cleanupFailure);
        receipt.failureArrays.compareFailures.push(cleanupFailure);
        receipt.ok = false;
      } else {
        markCurrentCapturePathsNonRetained(receipt);
      }
    }
    delete receipt.currentCaptureCleanupReadback;
    receipt.baselineManifestHash = baseline.baselineManifestHash;
    writeFileSync(checkReceiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
    writeMarkdownReceipt(receipt);
    console.log(JSON.stringify({
      ok: receipt.ok,
      mode,
      sourceHead,
      sourceContentDigest,
      comparisonContractVersion,
      oracleRecoveryOk: receipt.oracleRecoveryReadback.ok,
      screenshotCount: entries.length,
      baselineManifestHash: receipt.baselineManifestHash,
      compareFailureCount: compareFailures.length
    }, null, 2));
    if (!receipt.ok) process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
    if (!serverStopped) {
      await server.close().catch(() => {});
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch((error) => {
    console.error(error.stack ?? error.message);
    process.exit(1);
  });
}
