import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { checkConsumerContract, checkConsumerSources, loadRuleClosure } from "../scripts/consumer-contract-check.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const producer = path.join(root, "apps/storybook/storybook-static");
const indexPath = path.join(producer, "ai/index.json");
const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
const positive = `import { Button, Input } from "@tcrn/ui-react/approved";
export function CustomerFilter() { return <form><Input name="query" aria-label="Customer" /><Button type="submit">Search</Button></form>; }`;

function fixture(t, source = positive, components = ["Button", "Input"]) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "tcrn-consumer-contract-"));
  t.after(() => fs.rmSync(directory, { recursive: true }));
  fs.mkdirSync(path.join(directory, "src"));
  fs.writeFileSync(path.join(directory, "src/customer.tsx"), source);
  fs.writeFileSync(path.join(directory, "package.json"), JSON.stringify({ dependencies: index.identity.packageVersions }));
  fs.mkdirSync(path.join(directory, "node_modules/@tcrn"), { recursive: true });
  for (const name of ["ui-react", "ui-tokens", "ui-copy-state"]) fs.symlinkSync(path.join(root, "packages", name), path.join(directory, "node_modules/@tcrn", name));
  const declaration = { schemaVersion: "tcrn.consumer-contract.v1", identity: index.identity, components, patterns: [], sourceRoots: ["src"] };
  const declarationPath = path.join(directory, ".tcrn-ds.json");
  const write = () => fs.writeFileSync(declarationPath, JSON.stringify(declaration));
  write();
  return { directory, declaration, write, run: () => checkConsumerContract({ projectRoot: directory, indexPath, declarationPath: ".tcrn-ds.json" }) };
}

test("normal source consumer resolves only its required rule closure and passes", t => {
  const input = fixture(t);
  fs.writeFileSync(path.join(input.directory, "src/business.css"), '.customer-list{--customer-column:240px;min-width:var(--customer-column);color:var(--tcrn-color-ink)}');
  const result = input.run();
  assert.equal(result.ok, true, JSON.stringify(result.findings));
  assert.deepEqual(result.usedComponents, ["Button", "Input"]);
  assert.ok(result.requiredRules.includes("global"));
  assert.ok(!result.requiredRules.includes("component/ShellMenu"));
  assert.ok(!result.requiredRules.includes("pattern/customer-list-boundary"));
});

test("normal entry rejects stale versions and required source corruption", t => {
  const input = fixture(t);
  input.declaration.identity = { ...index.identity, sourceDigest: "old-version" };
  input.write();
  assert.throws(input.run, /AI_VERSION_OR_SOURCE_MISMATCH/);
  input.declaration.identity = index.identity;
  input.write();
  const artifact = path.join(input.directory, "artifact");
  fs.cpSync(path.join(producer, "ai"), path.join(artifact, "ai"), { recursive: true });
  const copiedIndex = path.join(artifact, "ai/index.json");
  const global = index.rules.find(rule => rule.id === "global");
  fs.rmSync(path.join(artifact, global.path));
  assert.throws(() => loadRuleClosure(copiedIndex, input.declaration), /ENOENT/);
  fs.writeFileSync(path.join(artifact, global.path), "{broken");
  assert.throws(() => loadRuleClosure(copiedIndex, input.declaration), /AI_RULE_DIGEST_MISMATCH/);
  const bad = structuredClone(index);
  bad.rules = bad.rules.filter(rule => rule.id !== "global");
  fs.writeFileSync(copiedIndex, JSON.stringify(bad));
  assert.throws(() => loadRuleClosure(copiedIndex, input.declaration), /AI_REQUIRED_RULE_MISSING:global/);
});

test("same normal checker rejects actual token, family, style and adapter violations", t => {
  const cases = [
    [positive + '\nconst token = "var(--tcrn-not-a-token)";', /UNREGISTERED_TOKEN/],
    [positive.replace('<Button type="submit">', '<Button style={{color: "#ff0000"}} type="submit">'), /COMPONENT_STYLE_OVERRIDE|BARE_DESIGN_VALUE/],
    ['import { Dialog } from "@tcrn/ui-react"; export const X = () => <Dialog open />;', /UNPUBLISHED_COMPONENT_FAMILY/],
    ['import { ProductShell } from "@tcrn/ui-react/approved"; export const X = () => <ProductShell brandProductId="tms" productName="TMS" navGroups={[]} pageHeader={{title:"Customers"}} />;', /SHELL_PIN_CALLBACKS_MISSING/],
    ['import { ShellPins } from "@tcrn/ui-react/approved"; export const X = () => <button data-ds-shell-pins="">Fake pins</button>;', /SHELL_PINS_SUBSTITUTED/],
    [positive + '\nlocalStorage.setItem("shell-pins", "[]");', /LOCAL_STORAGE_IS_NOT_ACCOUNT_SYNC/],
    [positive + '\nconst override = {color: "var(--customer-color)"};', /BARE_DESIGN_VALUE/],
  ];
  for (const [source, failure] of cases) {
    const input = fixture(t, source, ["Button", "Input", "ProductShell", "ShellPins"]);
    const result = input.run();
    assert.equal(result.ok, false);
    assert.match(result.findings.join("\n"), failure);
  }
});

test("published ShellPins markers reject native imitations without banning business navigation or formal aliases", t => {
  const shell = child => `import { ProductShell as Shell, ShellPins as Pins, useProductShellController as useShell } from "@tcrn/ui-react/approved";
export function CustomerShell() {
  const controller = useShell({requestPreferences:{pins:[]},onPinsChange: savePins});
  return <Shell productName="TMS" brandProductId="tms" navGroups={[]} pageHeader={{title:"Customers"}} {...controller.productShellControlProps}>${child}</Shell>;
}
function savePins(pins: readonly string[]) { return fetch("/preferences/tms", {method:"PUT",body:JSON.stringify({pins})}); }`;
  const nativePins = '<nav className="tcrn-shell-pins" data-pins><a href="/">Fake shell pin</a></nav>';
  const namespaceShell = `import * as DS from "@tcrn/ui-react/approved";
export function CustomerShell() {
  const controller = DS.useProductShellController({requestPreferences:{pins:[]},onPinsChange: savePins});
  return <DS.ProductShell productName="TMS" brandProductId="tms" navGroups={[]} pageHeader={{title:"Customers"}} {...controller.productShellControlProps}><DS.ShellPins items={[]} data-pins /></DS.ProductShell>;
}
function savePins(pins: readonly string[]) { return fetch("/preferences/tms", {method:"PUT",body:JSON.stringify({pins})}); }`;
  const cases = [
    ["rendered child beside a lawful shell", shell(nativePins), true],
    ["unused export in the selected source roots", shell("") + `\nexport const Bad = () => ${nativePins};`, true],
    ["published class without the data marker", shell('<nav className="business tcrn-shell-pins"><a href="/">Fake shell pin</a></nav>'), true],
    ["published data marker without a class", shell('<nav data-pins><a href="/">Fake shell pin</a></nav>'), true],
    ["literal class in a JSX expression", shell('<nav className={"tcrn-shell-pins"}><a href="/">Fake shell pin</a></nav>'), true],
    ["literal template class in a JSX expression", shell('<nav className={`tcrn-shell-pins`}><a href="/">Fake shell pin</a></nav>'), true],
    ["ordinary semantic business navigation", shell('<nav className="customer-pins" data-pinned aria-label="Pinned customers"><a href="/">Customer</a></nav>'), false],
    ["class names must match complete tokens", shell('<nav className="customer-tcrn-shell-pins tcrn-shell-pins-extra"><a href="/">Customer</a></nav>'), false],
    ["formal named import alias", shell('<Pins items={[]} className="tcrn-shell-pins" data-pins data-ds-shell-pins />'), false],
    ["formal namespace import", namespaceShell, false],
  ];
  for (const [label, source, substituted] of cases) {
    const input = fixture(t, source, ["ProductShell", "ShellPins"]);
    const closure = loadRuleClosure(indexPath, input.declaration);
    const result = checkConsumerSources([path.join(input.directory, "src/customer.tsx")], input.declaration, closure);
    if (substituted) {
      assert.equal(result.findings.length, 1, label);
      assert.match(result.findings[0], /SHELL_PINS_SUBSTITUTED$/, label);
    } else {
      assert.deepEqual(result.findings, [], label);
    }
  }
});

test("exact consumer and installed package versions are enforced", t => {
  const input = fixture(t);
  fs.writeFileSync(path.join(input.directory, "package.json"), JSON.stringify({ dependencies: { ...index.identity.packageVersions, "@tcrn/ui-react": "3.0.0" } }));
  assert.ok(input.run().findings.some(finding => finding.startsWith("PACKAGE_VERSION_MISMATCH")));
});

test("required closure has no cycles, every formal component has source types and real stories", () => {
  const components = index.rules.filter(rule => rule.kind === "component").map(rule => rule.id.slice("component/".length));
  assert.equal(components.length, 28);
  const closure = loadRuleClosure(indexPath, { schemaVersion: "tcrn.consumer-contract.v1", identity: index.identity, components, patterns: [] });
  for (const name of components) {
    const rule = closure.rules.get(`component/${name}`);
    assert.ok(rule.content.types.props.length > 0, name);
    assert.ok(rule.content.stories.some(story => story.state === "default"), name);
    assert.match(rule.content.example.sha256, /^[a-f0-9]{64}$/);
  }
  const complete = JSON.parse(fs.readFileSync(path.join(producer, "ai-consumption-contract.json"), "utf8"));
  assert.equal(complete.ownerVisualAcceptance, "not-performed");
  assert.equal(complete.ownerVisualAcceptanceScope, "current package candidate");
  assert.equal(complete.priorOwnerVisualAcceptance.minute, "minutes:d8848542e0a64a1e26d07aaf");
  assert.deepEqual(complete.unconfirmedProposals, []);
  assert.equal(complete.adoptedAmendments.minute, "minutes:6f3e0a9a1e07e3980867d82e#D1");
  assert.equal(complete.adoptedAmendments.publicationHoldMinute, "minutes:00710c786ec8423e5dce0186#D1-D2");
  assert.equal(complete.publicationRequest, "deferred-by-owner");
  assert.equal(complete.adoptedSupport.formalComponents, 28);
  assert.equal(complete.adoptedSupport.builtInLocales, 5);
  const customer = loadRuleClosure(indexPath, { schemaVersion: "tcrn.consumer-contract.v1", identity: index.identity, components: ["Heading"], patterns: ["customer-list-boundary"] });
  assert.ok(customer.rules.has("pattern/product-locales"));
  assert.ok(customer.rules.has("global"));
  assert.deepEqual(complete.rules, [...index.rules].map(entry => JSON.parse(fs.readFileSync(path.join(producer, entry.path), "utf8"))).map(({ schemaVersion, identity, ...rule }) => rule));
});

test("normal shell consumer accepts scoped HTTP observations and rejects anonymous-only evidence", async t => {
  const { createServer } = await import("node:http");
  const rows = new Map();
  const server = createServer(async (request, response) => {
    const key = `${request.headers['x-synthetic-user']}:${request.headers['x-synthetic-tenant']}:${request.url}`;
    response.setHeader("content-type", "application/json");
    if (!request.headers['x-synthetic-user']) { response.writeHead(401); response.end('{"error":"authentication required"}'); return; }
    if (request.method === "PUT") {
      const chunks = []; for await (const chunk of request) chunks.push(chunk);
      rows.set(key, JSON.parse(Buffer.concat(chunks).toString()).pins);
    }
    response.end(JSON.stringify({ pins: rows.get(key) ?? [] }));
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const url = `http://127.0.0.1:${server.address().port}/preferences/tms`;
  const headers = { 'x-synthetic-user': 'user-a', 'x-synthetic-tenant': 'tenant-a' };
  const read = async (target = url, scope = headers) => (await (await fetch(target, { headers: scope })).json()).pins;
  const initialPins = ["a", "b"];
  await fetch(url, { method: "PUT", headers, body: JSON.stringify({ pins: initialPins }) });
  const actions = [];
  for (const [kind, submitted] of [["pin", ["a", "b", "c"]], ["unpin", ["a", "c"]], ["reorder", ["c", "a"]]]) {
    const response = await fetch(url, { method: "PUT", headers, body: JSON.stringify({ pins: submitted }) });
    actions.push({ kind, submitted, readback: await read(), status: response.ok ? "success" : "error" });
  }
  const evidence = {
    schemaVersion: "tcrn.shell-preference-evidence.v1", source: "http-observation", scope: { user: "user-a", tenant: "tenant-a", product: "tms" },
    initialPins, actions, freshSessionReadback: await read(),
    isolatedUserReadback: await read(url, { ...headers, 'x-synthetic-user': 'user-b' }),
    isolatedTenantReadback: await read(url, { ...headers, 'x-synthetic-tenant': 'tenant-b' }),
    isolatedProductReadback: await read(url.replace("tms", "other")),
    failureReported: (await fetch(url)).status === 401,
    command: "node --test tests/consumer-contract-check.test.mjs (isolated synthetic HTTP harness, not TMS)",
  };
  const source = `import { ProductShell, useProductShellController } from "@tcrn/ui-react/approved";
export function CustomerShell() { const controller = useProductShellController({requestPreferences:{pins:[]},onPinsChange: savePins});
return <ProductShell productName="TMS" brandProductId="tms" moduleName="Customers" currentRouteLabel="Customers" navGroups={[]} pageHeader={{title:"Customers"}} {...controller.productShellControlProps} />; }
function savePins(pins: readonly string[]) { return fetch("/preferences/tms", {method:"PUT",body:JSON.stringify({pins})}); }`;
  const input = fixture(t, source, ["ProductShell"]);
  input.declaration.adapterEvidence = "adapter.json";
  input.write();
  fs.writeFileSync(path.join(input.directory, "adapter.json"), JSON.stringify(evidence));
  const result = input.run();
  console.log(JSON.stringify({ kind: "synthetic-http-observation", endpoint: url, ...evidence }));
  assert.equal(result.ok, true, JSON.stringify(result.findings));
  fs.writeFileSync(path.join(input.directory, "adapter.json"), JSON.stringify({ ...evidence, source: "localStorage" }));
  assert.ok(input.run().findings.includes("adapter_evidence_source_invalid"));
});

test("required rule parser rejects malformed content and cyclic dependencies through the normal loader", t => {
  const input = fixture(t);
  const artifact = path.join(input.directory, "artifact");
  fs.cpSync(path.join(producer, "ai"), path.join(artifact, "ai"), { recursive: true });
  const copiedIndex = path.join(artifact, "ai/index.json");
  const changeGlobal = transform => {
    const changedIndex = structuredClone(index);
    const entry = changedIndex.rules.find(rule => rule.id === "global");
    const original = JSON.parse(fs.readFileSync(path.join(producer, entry.path), "utf8"));
    const rule = transform(original, entry);
    const bytes = typeof rule === "string" ? rule : JSON.stringify(rule);
    entry.sha256 = createHash("sha256").update(bytes).digest("hex");
    fs.writeFileSync(path.join(artifact, entry.path), bytes);
    fs.writeFileSync(copiedIndex, JSON.stringify(changedIndex));
  };
  changeGlobal(() => '{malformed');
  assert.throws(() => loadRuleClosure(copiedIndex, input.declaration), /AI_RULE_UNREADABLE/);
  changeGlobal(rule => ({ ...rule, content: null }));
  assert.throws(() => loadRuleClosure(copiedIndex, input.declaration), /AI_RULE_CONTENT_INVALID/);
  changeGlobal((rule, entry) => {
    entry.required = [...entry.required, "component/Button"];
    return { ...rule, required: entry.required };
  });
  assert.throws(() => loadRuleClosure(copiedIndex, input.declaration), /AI_CYCLIC_REQUIRED_RULE/);
});

test("the installed package's actual version is checked independently of the declared dependency", t => {
  const input = fixture(t);
  const installed = path.join(input.directory, "node_modules/@tcrn/ui-react");
  fs.unlinkSync(installed);
  fs.mkdirSync(installed);
  fs.writeFileSync(path.join(installed, "package.json"), JSON.stringify({ name: "@tcrn/ui-react", version: "3.0.0", main: "index.js" }));
  fs.writeFileSync(path.join(installed, "index.js"), "");
  assert.ok(input.run().findings.some(finding => finding.startsWith("INSTALLED_PACKAGE_VERSION_MISMATCH:@tcrn/ui-react:3.0.0")));
});

test("the generator extracts executable example branches and fails missing formal types", async () => {
  const { buildManifest, extractComponentExamples } = await import("../scripts/component-api-manifest.mjs");
  const examples = extractComponentExamples();
  assert.equal(Object.keys(examples).length, 28);
  for (const rule of index.rules.filter(rule => rule.kind === "component")) {
    const shard = JSON.parse(fs.readFileSync(path.join(producer, rule.path), "utf8"));
    assert.equal(shard.content.example.snippet, examples[shard.content.name].snippet);
  }
  const missing = buildManifest({ entryPath: "packages/ui-react/src/approved.tsx", componentNames: ["Heading", "NoSuchFormalComponent"] });
  assert.equal(missing.ok, false);
  assert.deepEqual(missing.coverage.missingFromManifest, ["NoSuchFormalComponent"]);
});
