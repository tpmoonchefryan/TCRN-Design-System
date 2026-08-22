#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
// TCRN-DS-INC-012 — the contract's brand URL must be a live published asset,
// not a development-source path or an untested prose claim.

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const contractPath = "apps/storybook/storybook-static/ai-consumption-contract.json";
const localAssetPath = "apps/storybook/assets/tcrn-brand-mark.svg";
const contract = JSON.parse(readFileSync(contractPath, "utf8"));
const source = contract.brandAssetSource ?? {};
const localDigest = createHash("sha256").update(readFileSync(localAssetPath)).digest("hex");
const failures = [];

if (!/^https:\/\//u.test(source.url ?? "")) failures.push("brandAssetSource.url must be https");
if (/apps\/storybook|packages\/|file:\/\//u.test(source.url ?? "")) failures.push("brandAssetSource.url points at development input");
if (source.mimeType !== "image/svg+xml") failures.push("brandAssetSource.mimeType must be image/svg+xml");
if (source.sha256 !== localDigest) failures.push("brandAssetSource.sha256 does not match the registered local asset");

let response;
let remoteDigest = null;
if (failures.length === 0) {
  try {
    response = await fetch(source.url, { redirect: "follow" });
    const body = Buffer.from(await response.arrayBuffer());
    remoteDigest = createHash("sha256").update(body).digest("hex");
    if (!response.ok) failures.push(`brand asset request returned ${response.status}`);
    if (!response.headers.get("content-type")?.toLowerCase().includes("image/svg+xml")) failures.push("brand asset response is not image/svg+xml");
    if (remoteDigest !== localDigest) failures.push("published brand asset differs from the registered asset");
  } catch (error) {
    failures.push(`brand asset request failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const result = {
  schemaVersion: "tcrn.ds.brand-asset-source-proof.v1",
  ok: failures.length === 0,
  reasonCode: failures.length === 0 ? "BRAND_ASSET_SOURCE_VERIFIED" : "BRAND_ASSET_SOURCE_UNVERIFIED",
  url: source.url ?? null,
  declaredMimeType: source.mimeType ?? null,
  responseStatus: response?.status ?? null,
  responseContentType: response?.headers.get("content-type") ?? null,
  localSha256: localDigest,
  remoteSha256: remoteDigest,
  failures
};
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
if (!result.ok) process.exitCode = 1;
