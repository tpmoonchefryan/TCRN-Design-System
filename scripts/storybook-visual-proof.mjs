import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { createReadStream, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { extname, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { inflateSync } from "node:zlib";
import { chromium } from "@playwright/test";

const require = createRequire(import.meta.url);
const playwrightVersion = JSON.parse(readFileSync(require.resolve("@playwright/test/package.json"), "utf8")).version;

const route = "route_tcrn_design_system_storybook_content_visual_proof_hardening_ilya_s005_local_visual_snapshot_proof_repair_after_elara_verity_raw_hash_contract_revision_concurrence";
const comparisonContractVersion = "bounded_antialias_pixel_delta_v1";
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
  "tcrn-brand-mark.svg"
];

const visualStateAllowlist = [
  {
    id: "docs-shell-overview",
    page: "index.html",
    hash: "welcome-governance",
    storyId: "welcome-governance",
    description: "Static docs shell overview after hash scroll."
  },
  {
    id: "component-dialog-spec",
    page: "components.html",
    hash: "dialog-spec-usage",
    storyId: "dialog-spec-usage",
    description: "Dialog specification static closed state only.",
    staticClosedDialogFixture: true
  },
  {
    id: "pattern-aos-operations-standard",
    page: "patterns.html",
    hash: "aos-operations-cockpit-standard",
    storyId: "aos-operations-cockpit-standard",
    description: "AOS operations cockpit standard after hash scroll."
  },
  {
    id: "proof-no-overclaim",
    page: "proof.html",
    hash: "proof-matrix",
    storyId: "proof-matrix",
    description: "Proof matrix no-overclaim surface after hash scroll."
  }
];

const viewportMatrix = [
  { id: "desktop-1440x900", width: 1440, height: 900 },
  { id: "tablet-1024x768", width: 1024, height: 768 },
  { id: "mobile-390x844", width: 390, height: 844 }
];

const deterministicBrowserSettings = {
  browser: "chromium",
  headless: true,
  deviceScaleFactor: 1,
  colorScheme: "light",
  reducedMotion: "reduce",
  locale: "en-US",
  timezoneId: "UTC",
  fixedDateNow: "2026-01-01T00:00:00.000Z",
  chromiumArgs: [
    "--disable-font-subpixel-positioning",
    "--disable-lcd-text",
    "--font-render-hinting=none",
    "--force-color-profile=srgb"
  ],
  viewportScreenshotsOnly: true,
  animations: "disabled",
  screenshotStability: "two_consecutive_identical_png_hashes_before_write_or_compare",
  routeOwnedLoopbackServer: "127.0.0.1:<ephemeral>"
};

const noOverclaimReadback = {
  localVisualProofDisposition: "local_static_contract_docs_only",
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

function decodePngRgba(path) {
  const buffer = readFileSync(path);
  if (buffer.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    throw new Error(`invalid_png_signature:${path}`);
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
    throw new Error(`missing_png_header:${path}`);
  }
  if (header.bitDepth !== 8 || ![2, 6].includes(header.colorType)) {
    throw new Error(`unsupported_png_format:${path}:${JSON.stringify(header)}`);
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
        throw new Error(`unsupported_png_filter:${path}:${filter}`);
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

async function captureStableScreenshot(page, path, expectedViewport) {
  let previousHash = null;
  let previousBuffer = null;
  const attempts = [];
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    await waitForPaintSettled(page);
    const buffer = await page.screenshot({ fullPage: false, animations: "disabled" });
    const sha256 = hashBuffer(buffer);
    attempts.push({ attempt, sha256, bytes: buffer.length });
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
        scroll-behavior: auto !important;
        transition-delay: 0s !important;
        transition-duration: 0s !important;
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
  return await page.evaluate((input) => {
    const root = document.querySelector("[data-contract-surface='tcrn-design-system-storybook']");
    const target = document.querySelector(`[data-contract-story-id="${input.storyId}"]`);
    const rect = target?.getBoundingClientRect();
    const html = document.documentElement.outerHTML;
    const bodyText = document.body.innerText;
    const forbiddenHits = input.forbiddenPatterns
      .filter((rule) => new RegExp(rule.source, rule.flags).test(html) || new RegExp(rule.source, rule.flags).test(bodyText))
      .map((rule) => rule.id);
    const targetVisible = Boolean(rect && rect.width > 0 && rect.height > 0);
    const targetInViewport = Boolean(rect && rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth);
    const dialogPanel = document.querySelector("#dialog-spec-usage [data-dialog-fixture-panel]");
    const dialogTrigger = document.querySelector("#dialog-spec-usage [data-dialog-fixture-open]");
    return {
      title: document.title,
      url: window.location.href.replace(/http:\/\/127\.0\.0\.1:\d+/g, "http://127.0.0.1:<ephemeral>"),
      rootVisible: Boolean(root),
      activeSection: root?.getAttribute("data-active-story-section") ?? null,
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
      currentDocNavItem: document.querySelector("[data-doc-nav-item][aria-current='location'][data-doc-nav-item-active='true']")?.getAttribute("data-doc-nav-item") ?? null,
      forbiddenHits,
      staticClosedDialogFixture: input.staticClosedDialogFixture ? {
        panelHidden: dialogPanel?.hasAttribute("hidden") ?? false,
        triggerExpanded: dialogTrigger?.getAttribute("aria-expanded") ?? null
      } : null
    };
  }, {
    storyId: state.storyId,
    staticClosedDialogFixture: Boolean(state.staticClosedDialogFixture),
    forbiddenPatterns: forbiddenStaticDocPatterns.map((rule) => ({ id: rule.id, source: rule.pattern.source, flags: rule.pattern.flags }))
  });
}

function assertCapture(entry, health, events, png, stability) {
  const failures = [];
  if (!health.rootVisible) failures.push("missing_contract_surface");
  if (!health.targetVisible) failures.push("target_not_visible");
  if (!health.targetInViewport) failures.push("target_not_in_viewport_after_hash_scroll");
  if (health.bodyOverflowX) failures.push("body_horizontal_overflow");
  if (health.currentDocNavItem !== entry.storyId) failures.push(`active_doc_nav_mismatch:${health.currentDocNavItem}`);
  if (health.forbiddenHits.length > 0) failures.push(`forbidden_static_doc_hits:${health.forbiddenHits.join(",")}`);
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
      const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      colorScheme: "light",
      reducedMotion: "reduce",
      locale: "en-US",
        timezoneId: "UTC"
      });
      await context.addInitScript((fixedNow) => {
        const fixedTime = new Date(fixedNow).getTime();
        Date.now = () => fixedTime;
      }, deterministicBrowserSettings.fixedDateNow);
      for (const state of visualStateAllowlist) {
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

      const targetUrl = `${server.origin}/${state.page}#${state.hash}`;
      await page.goto(targetUrl, { waitUntil: "networkidle" });
      await disableMotion(page);
      await page.waitForSelector("[data-contract-surface='tcrn-design-system-storybook']", { state: "visible" });
      const target = page.locator(`[data-contract-story-id="${state.storyId}"]`);
      await target.waitFor({ state: "visible" });
      await settleStaticViewport(page, state);
      await waitForPaintSettled(page);
      await waitForStableBox(page, target);

      const fileName = `${state.id}__${viewport.id}.png`;
      const path = join(outputDir, fileName);
      const { png, stability } = await captureStableScreenshot(page, path, viewport);
      const health = await collectPageHealth(page, state);
      const failures = assertCapture(state, health, events, png, stability);
      entries.push({
        stateId: state.id,
        page: state.page,
        hash: state.hash,
        storyId: state.storyId,
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
    }
    await context.close();
  }
  return entries;
}

function makeBaseReceipt({ mode, reason, sourceHead, sourceContentDigest, staticPageReadbacks, browserVersion, routeOwnedEphemeralServer, compareFailures = [], comparisonReadbacks = [], entries }) {
  const comparisonByKey = new Map(comparisonReadbacks.map((item) => [`${item.stateId}::${item.viewport}`, item]));
  const failureArrays = {
    staticPageFailures: staticPageReadbacks.filter((page) => !page.ok),
    screenshotFailures: entries.filter((entry) => entry.failures.length > 0).map((entry) => ({
      stateId: entry.stateId,
      viewport: entry.viewport,
      failures: entry.failures
    })),
    compareFailures
  };
  return {
    ok: failureArrays.staticPageFailures.length === 0
      && failureArrays.screenshotFailures.length === 0
      && failureArrays.compareFailures.length === 0,
    route,
    sourceHead,
    sourceContentDigest,
    mode,
    comparisonContractVersion,
    baselineUpdateReason: reason,
    packageName,
    staticPageAllowlist,
    visualStateAllowlist: visualStateAllowlist.map(({ id, page, hash, storyId, description }) => ({ id, page, hash, storyId, description })),
    viewportMatrix,
    deterministicBrowserSettings,
    staticPageReadbacks,
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
      path: entry.path.replaceAll("\\", "/"),
      rawSha256: entry.rawSha256,
      width: entry.width,
      height: entry.height,
      bytes: entry.bytes,
      screenshotStability: entry.stability,
      targetRect: entry.health.targetRect,
      currentDocNavItem: entry.health.currentDocNavItem,
      events: entry.events,
      failures: entry.failures
    })),
    failureArrays,
    noOverclaimReadback,
    deferredBoundaries,
    playwrightVersion,
    chromiumVersion: browserVersion,
    routeOwnedEphemeralServer,
    baselineManifestHash: null,
    compareFailures,
    comparisonReadbacks
  };
}

function writeMarkdownReceipt(receipt) {
  const lines = [
    "# Storybook Visual Proof",
    "",
    `Route: \`${route}\``,
    `Mode: \`${receipt.mode}\``,
    `OK: \`${receipt.ok}\``,
    `Comparison contract: \`${comparisonContractVersion}\``,
    `Source head: \`${receipt.sourceHead}\``,
    `Static pages: ${receipt.staticPageReadbacks.length}`,
    `Screenshots: ${receipt.screenshotReadbacks.length}`,
    `Compare failures: ${receipt.compareFailures.length}`,
    "",
    "## No-Overclaim",
    "",
    `- localVisualProofDisposition: ${noOverclaimReadback.localVisualProofDisposition}`,
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
    ...deferredBoundaries.map((boundary) => `- ${boundary}`),
    ""
  ];
  writeFileSync(markdownReceiptPath, `${lines.join("\n")}\n`);
}

function writeBaselineArtifacts({ reason, receipt, entries }) {
  const manifest = {
    ok: receipt.ok,
    route,
    comparisonContractVersion,
    sourceHead: receipt.sourceHead,
    sourceContentDigest: receipt.sourceContentDigest,
    baselineUpdateReason: reason,
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
	    reason,
    route,
    disposition: "DSCVH-S005-initial-local-static-baseline",
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

    const preconditionFailures = [];
    if (manifest.sourceContentDigest !== context.sourceContentDigest) {
      preconditionFailures.push({ reason: "source_content_digest_mismatch_for_non_exact_png", expected: manifest.sourceContentDigest, actual: context.sourceContentDigest });
    }
    if (manifest.playwrightVersion !== playwrightVersion) {
      preconditionFailures.push({ reason: "playwright_version_mismatch_for_non_exact_png", expected: manifest.playwrightVersion, actual: playwrightVersion });
    }
    if (manifest.chromiumVersion !== context.browserVersion) {
      preconditionFailures.push({ reason: "chromium_version_mismatch_for_non_exact_png", expected: manifest.chromiumVersion, actual: context.browserVersion });
    }
    if (!jsonEqual(manifest.deterministicBrowserSettings, deterministicBrowserSettings)) {
      preconditionFailures.push({ reason: "deterministic_browser_settings_mismatch_for_non_exact_png" });
    }
    if (!jsonEqual(manifest.staticPageAllowlist, staticPageAllowlist)) {
      preconditionFailures.push({ reason: "static_page_allowlist_mismatch_for_non_exact_png" });
    }
    if (!jsonEqual(manifest.visualStateAllowlist, visualStateAllowlist.map(({ id, page, hash, storyId, description }) => ({ id, page, hash, storyId, description })))) {
      preconditionFailures.push({ reason: "visual_state_allowlist_mismatch_for_non_exact_png" });
    }
    if (!jsonEqual(manifest.viewportMatrix, viewportMatrix)) {
      preconditionFailures.push({ reason: "viewport_matrix_mismatch_for_non_exact_png" });
    }
    if (entry.page !== baseline.page || entry.hash !== baseline.hash || entry.storyId !== baseline.storyId) {
      preconditionFailures.push({
        reason: "state_identity_mismatch_for_non_exact_png",
        expected: { page: baseline.page, hash: baseline.hash, storyId: baseline.storyId },
        actual: { page: entry.page, hash: entry.hash, storyId: entry.storyId }
      });
    }
    if (preconditionFailures.length > 0) {
      failures.push({ key, reason: "bounded_antialias_precondition_failed", preconditionFailures });
      continue;
    }

    try {
      comparison.pixelDeltaSummary = comparePngPixelDelta(baseline.path, entry.path, baseline.width, baseline.height);
    } catch (error) {
      failures.push({ key, reason: "png_decode_failed_for_bounded_antialias_comparison", message: error.message });
      continue;
    }
    if (comparison.pixelDeltaSummary.ok) {
      comparison.comparisonMethod = comparisonContractVersion;
    } else {
      failures.push({ key, reason: "bounded_antialias_pixel_delta_threshold_breach", pixelDeltaSummary: comparison.pixelDeltaSummary });
    }
  }
  return { compareFailures: failures, comparisonReadbacks };
}

async function run() {
  const { mode, reason } = parseArgs(process.argv.slice(2));
  assertStaticOutput();
  if (mode === "update-baseline") {
    rmSync(receiptRoot, { recursive: true, force: true });
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
    const entries = await captureVisualMatrix({ server, browser, outputDir: captureDir });
    await browser.close();
    browser = null;
    await server.close();
    serverStopped = true;
    const routeOwnedEphemeralServer = {
      origin: server.stableOrigin,
      loopbackOnly: true,
      retained: false,
      stoppedBeforeReturn: true
    };

    if (mode === "update-baseline") {
      const receipt = makeBaseReceipt({
        mode,
        reason,
        sourceHead,
        sourceContentDigest,
        staticPageReadbacks,
        browserVersion,
        routeOwnedEphemeralServer,
        entries
      });
      writeBaselineArtifacts({ reason, receipt, entries });
      console.log(JSON.stringify({
	        ok: receipt.ok,
	        mode,
	        comparisonContractVersion,
	        baselineUpdateReason: reason,
        sourceHead,
        sourceContentDigest,
        screenshotCount: entries.length,
        baselineManifestPath,
        baselineManifestHash: receipt.baselineManifestHash
      }, null, 2));
      if (!receipt.ok) process.exit(1);
      return;
    }

    const baseline = loadBaselineManifest();
    const { compareFailures, comparisonReadbacks } = compareToBaseline(entries, baseline, { sourceContentDigest, browserVersion });
    const receipt = makeBaseReceipt({
      mode,
      reason: null,
      sourceHead,
      sourceContentDigest,
      staticPageReadbacks,
      browserVersion,
      routeOwnedEphemeralServer,
      compareFailures,
      comparisonReadbacks,
      entries
    });
    receipt.baselineManifestHash = baseline.baselineManifestHash;
    writeFileSync(checkReceiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
    writeMarkdownReceipt(receipt);
    if (receipt.ok) {
      rmSync(currentCaptureDir, { recursive: true, force: true });
    }
    console.log(JSON.stringify({
      ok: receipt.ok,
      mode,
      sourceHead,
      sourceContentDigest,
      comparisonContractVersion,
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
