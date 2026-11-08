import { createHash } from "node:crypto";
import { componentLayouts } from "../component-layout.js";
import { componentUsage } from "../component-usage.js";
import { approvedApi } from "../approved-api.js";
import { approvedSource } from "../approved-source.js";
import { componentStates, componentStoryId, componentExamplesSource } from "../component-catalog.js";

export interface AiCandidate { version: string; commit: string; dirty: boolean }
export interface AiApiEntry {
  name: string;
  props: unknown[];
  variants: Record<string, unknown>;
  slots: string[];
  source: { path: string; line: number };
  extractionError?: string;
}
export interface AiToken { variable: string; value: string }
export interface AiSource { path: string; sha256: string; content: string }
export interface Rule { id: string; kind: string; required: string[]; optional: string[]; content: unknown }
export const aiJson = (value: unknown) => JSON.stringify(value, null, 2) + "\n";
export const aiHash = (bytes: string | Uint8Array) => createHash("sha256").update(bytes).digest("hex");

export function createAiRuleBundle(input: {
  candidate: AiCandidate;
  packageVersions: Record<string, string>;
  api: { ok: boolean; components: Record<string, AiApiEntry> };
  tokens: readonly AiToken[];
  examples: Record<string, { path: string; line: number; snippet: string }>;
  sources: AiSource[];
  fonts: unknown[];
  icons: readonly string[];
  products: readonly string[];
}) {
  const { candidate, sources } = input;
  if (Object.values(input.packageVersions).some(version => version !== candidate.version)) throw new Error("AI package versions disagree");
  if (!input.api.ok) throw new Error("AI type extraction is incomplete");
  const sourceMap = new Map(sources.map(source => [source.path, source]));
  const requireSource = (file: string) => {
    const source = sourceMap.get(file);
    if (!source || aiHash(source.content) !== source.sha256) throw new Error(`Required AI source missing or corrupt: ${file}`);
    return source;
  };
  const patterns = [
    { id: "component-layout", file: "docs/consumption/rules/layout.md", required: [] },
    {
      id: "shell-preferences", file: "docs/consumption/patterns/shell-preferences-and-navigation.md",
      required: ["tokens/shell", "assets/brand", "standard/07a-shell-upper", "pattern/product-locales"],
    },
    { id: "product-locales", file: "docs/consumption/patterns/product-shell-locales.md", required: [] },
    { id: "customer-list-boundary", file: "docs/consumption/patterns/customer-list-support.md", required: ["pattern/product-locales"] },
  ];
  const rules: Rule[] = [{
    id: "global", kind: "global", required: ["tokens/core", "assets/fonts", "standard/01-tokens", "pattern/component-layout"], optional: ["pattern/customer-list-boundary"],
    content: requireSource("docs/consumption/rules/global.md"),
  }];
  for (const board of approvedSource.boards) rules.push({
    id: `standard/${board.slug}`, kind: "standard",
    required: board.slug === "07a-shell-upper" ? ["standard/07b-shell-lower"] : [], optional: [],
    content: { ...requireSource(`docs/design/approved-site-v1/src/boards/${board.slug}/index.dc.html`), format: "text/html", status: "pinned-published-v1" },
  });
  const tokenClosure = (seeds: readonly AiToken[]) => {
    const selected = new Map(seeds.map(token => [token.variable, token]));
    for (const token of selected.values()) {
      for (const match of token.value.matchAll(/var\((--tcrn-[\w-]+)/g)) {
        const dependency = input.tokens.find(item => item.variable === match[1]);
        if (!dependency) throw new Error(`Missing token dependency ${match[1]}`);
        selected.set(dependency.variable, dependency);
      }
    }
    return [...selected.values()];
  };
  for (const [id, seeds] of [
    ["core", input.tokens.filter(token => !token.variable.startsWith("--tcrn-shell-"))],
    ["shell", input.tokens.filter(token => token.variable.startsWith("--tcrn-shell-"))],
  ] as const) rules.push({ id: `tokens/${id}`, kind: "tokens", required: [], optional: [], content: tokenClosure(seeds) });
  rules.push(
    { id: "assets/fonts", kind: "assets", required: ["standard/02-typography"], optional: [], content: { source: "packages/ui-tokens/fonts/manifest.json", css: "@tcrn/ui-tokens/fonts.css", files: input.fonts } },
    { id: "assets/icons", kind: "assets", required: ["standard/03-icons"], optional: [], content: { names: input.icons, viewBox: "0 0 20 20", strokeWidth: 1.25 } },
    { id: "assets/brand", kind: "assets", required: ["standard/04-brand"], optional: [], content: { products: input.products, variants: ["color", "mono", "tile-tint", "tile-deep"] } },
  );
  for (const { id, file, required } of patterns) rules.push({
    id: `pattern/${id}`, kind: "pattern",
    required, optional: [], content: requireSource(file),
  });
  for (const api of approvedApi) {
    const types = input.api.components[api.name];
    if (!types || types.extractionError || !types.source) throw new Error(`Required component type missing: ${api.name}`);
    const example = input.examples[api.name];
    if (!example?.snippet) throw new Error(`Executable component example missing: ${api.name}`);
    const states = componentStates[api.name as keyof typeof componentStates];
    if (!states?.length) throw new Error(`Required component stories missing: ${api.name}`);
    const board = requireSource(`docs/design/approved-site-v1/src/boards/${api.board}/index.dc.html`);
    const shell = api.name === "ProductShell" || api.name.startsWith("Shell");
    rules.push({
      id: `component/${api.name}`, kind: "component",
      required: ["global", `standard/${api.board}`, ...(shell ? ["pattern/shell-preferences"] : []), ...(api.board === "04-brand" ? ["assets/brand"] : []), ...(api.name === "Icon" || shell ? ["assets/icons"] : [])],
      optional: shell ? ["pattern/customer-list-boundary"] : [],
      content: {
        name: api.name, board: api.board, source: { path: board.path, sha256: board.sha256, line: api.line },
        normativeText: api.formal, readerSummary: api.summary, types,
        layout: componentLayouts[api.name as keyof typeof componentLayouts],
        implementationSource: { path: types.source.path, sha256: requireSource(types.source.path).sha256 },
        example: {
          ...example, sha256: requireSource(componentExamplesSource).sha256,
          snippetKind: "producer scenario excerpt; helpers and imports are in the source module",
          usage: componentUsage(api.name as keyof typeof componentStates),
          usageSource: { path: "apps/storybook/src/component-usage.ts", sha256: requireSource("apps/storybook/src/component-usage.ts").sha256 },
          contextSources: ["apps/storybook/src/docs.css", "apps/storybook/src/component-layout.ts", `packages/ui-react/src/styles/${componentLayouts[api.name as keyof typeof componentLayouts].implementation}`].map(path => ({ path, sha256: requireSource(path).sha256 })),
          productInputs: shell ? "Supply the typed component props and read pattern/shell-preferences; the snippet does not invent product data or a backend adapter." : null,
        },
        stories: states.map(state => ({ state, id: componentStoryId(api.name, state) })),
      },
    });
  }
  const sourceManifest = sources.map(({ content: _content, ...source }) => source).sort((a, b) => a.path.localeCompare(b.path));
  const sourceManifestBytes = aiJson(sourceManifest);
  const sourceDigest = aiHash(sourceManifestBytes);
  const identity = { packageVersions: input.packageVersions, standardSource: approvedSource.site, sourceDigest };
  const prefix = `ai/${candidate.version}`;
  const files = new Map<string, string>([[`${prefix}/sources.json`, sourceManifestBytes]]);
  const entries = rules.map(rule => {
    const path = `${prefix}/${rule.id}.json`;
    const bytes = aiJson({ schemaVersion: "tcrn.ai-rule.v1", identity, ...rule });
    files.set(path, bytes);
    return { id: rule.id, kind: rule.kind, path, sha256: aiHash(bytes), required: rule.required, optional: rule.optional };
  });
  const known = new Set(entries.map(entry => entry.id));
  const visit = (id: string, trail: string[]) => {
    if (!known.has(id)) throw new Error(`Missing rule dependency: ${id}`);
    if (trail.includes(id)) throw new Error(`Cyclic rule dependency: ${[...trail, id].join(" -> ")}`);
    const rule = entries.find(entry => entry.id === id)!;
    for (const dependency of rule.required) visit(dependency, [...trail, id]);
    for (const related of rule.optional) if (!known.has(related)) throw new Error(`Missing optional rule: ${related}`);
  };
  entries.forEach(entry => visit(entry.id, []));
  const index = {
    schemaVersion: "tcrn.ai-index.v1", identity, candidate, sourceManifest: { path: `${prefix}/sources.json`, sha256: sourceDigest },
    publication: "local-candidate-only", globalRequired: ["global"], rules: entries,
    refresh: { invalidateOn: ["packageVersions", "standardSource", "sourceDigest", "shard sha256", "required dependency"], action: "Refresh the index and required closure atomically from one trusted producer build; rerun consumer-contract-check." },
    compatibility: "ai-consumption-contract.json", coverage: { formalComponents: approvedApi.length, engineeringExportsAreFormal: false },
  };
  files.set(`${prefix}/index.json`, aiJson(index));
  files.set("ai/index.json", aiJson(index));
  return { index, rules, files, identity };
}
