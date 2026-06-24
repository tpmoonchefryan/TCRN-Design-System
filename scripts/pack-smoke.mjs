import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const outDir = ".tarball-smoke";
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const packages = ["@tcrn/ui-tokens", "@tcrn/ui-copy-state", "@tcrn/ui-react"];
const receipts = packages.map((name) => {
  for (const existing of readdirSync(outDir)) {
    if (existing.endsWith(".tgz")) {
      rmSync(join(outDir, existing), { force: true });
    }
  }
  execFileSync("pnpm", ["--filter", name, "pack", "--pack-destination", outDir], { stdio: "pipe" });
  const tarball = readdirSync(outDir).filter((file) => file.endsWith(".tgz")).sort().at(0);
  if (!tarball) {
    throw new Error(`pack_smoke_missing_tarball:${name}`);
  }
  const body = readFileSync(join(outDir, tarball));
  return {
    name,
    tarball,
    bytes: body.byteLength,
    sha256: createHash("sha256").update(body).digest("hex")
  };
});

rmSync(outDir, { recursive: true, force: true });

console.log(JSON.stringify({ ok: true, packages: receipts }, null, 2));
