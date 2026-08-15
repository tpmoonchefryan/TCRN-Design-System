import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * TCRN-CROSS-STORY-283 — the design-authority contract.
 *
 * A project that consumes this design system declares which system it follows by naming
 * this Storybook's URL. A URL identifies a location, not a version: the same address
 * serves whatever was deployed last. Rather than have every consumer maintain a version
 * number that goes stale, the authority reports its own version at a known path, and the
 * consumer reads it there.
 *
 * The reader is a browser on somebody else's origin, so this file is served with a
 * permissive CORS header (configured in the repository's `vercel.json`). That is
 * deliberate and safe: everything here is already public documentation, and the consuming
 * engine never fetches it — only the person's browser does, once, when their page opens.
 *
 * The field names are the platform's, not this design system's: any design system can
 * serve this contract and be named as an authority. Nothing here is specific to TCRN
 * beyond the values.
 */
export const DESIGN_AUTHORITY_SCHEMA_VERSION = "tcrn.design-authority.v1" as const;
export const DESIGN_AUTHORITY_ARTIFACT = "tcrn-design-authority.json" as const;

export interface DesignAuthorityContract {
  readonly schemaVersion: typeof DESIGN_AUTHORITY_SCHEMA_VERSION;
  /** Human-readable name of the design system this address speaks for. */
  readonly name: string;
  /** The version a consumer should understand this address to be serving. */
  readonly version: string;
  /**
   * sha256 of the token stylesheet this build carries. Self-reported: a consumer can
   * compare it against its own vendored copy, but nothing here proves it — the proof is
   * the consumer's own byte gate against its own copy.
   */
  readonly tokensDigest: string;
}

const REPOSITORY_ROOT = join(process.cwd(), "..", "..");
const TOKENS_CSS = join(REPOSITORY_ROOT, "packages", "ui-tokens", "src", "tokens.css");
const VERSION_SOURCE = join(REPOSITORY_ROOT, "packages", "ui-tokens", "package.json");

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/**
 * The version is read from the published token package rather than written here, so the
 * contract cannot drift from what was actually built. The workspace root's own version
 * is not the design system's version — it is the monorepo's — and the Storybook app is
 * private and unversioned, so neither is a usable source.
 */
export function designAuthorityContract(): DesignAuthorityContract {
  const version = String((JSON.parse(readFileSync(VERSION_SOURCE, "utf8")) as { version?: unknown }).version ?? "");
  if (version.length === 0) throw new Error("DESIGN_AUTHORITY_VERSION_UNAVAILABLE");
  return {
    schemaVersion: DESIGN_AUTHORITY_SCHEMA_VERSION,
    name: "TCRN Design System",
    version,
    tokensDigest: sha256(readFileSync(TOKENS_CSS, "utf8"))
  };
}
