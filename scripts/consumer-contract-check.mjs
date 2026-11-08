#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import ts from "typescript";
import { evaluateShellPreferenceEvidence } from "../packages/ui-react/dist/verification/ShellPreferenceEvidence.js";

const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const json = (file, label) => {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch (error) { throw new Error(`${label}: ${file}: ${error.message}`); }
};
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function within(root, relative) {
  if (typeof relative !== "string" || !relative || path.isAbsolute(relative)) throw new Error(`Expected relative path: ${relative}`);
  const absolute = path.resolve(root, relative);
  if (!absolute.startsWith(path.resolve(root) + path.sep)) throw new Error(`Path escapes its root: ${relative}`);
  if (fs.lstatSync(absolute).isSymbolicLink()) throw new Error(`Symbolic input is not supported: ${relative}`);
  const real = fs.realpathSync(absolute);
  if (!real.startsWith(fs.realpathSync(root) + path.sep)) throw new Error(`Real path escapes its root: ${relative}`);
  return absolute;
}

/** Loads only the required task closure and verifies every byte/edge before use. */
export function loadRuleClosure(indexPath, declaration) {
  const index = json(indexPath, "AI_INDEX_UNREADABLE");
  if (index.schemaVersion !== "tcrn.ai-index.v1") throw new Error("AI_INDEX_SCHEMA_INVALID");
  if (!declaration || declaration.schemaVersion !== "tcrn.consumer-contract.v1") throw new Error("CONSUMER_DECLARATION_INVALID");
  if (!index.identity || !/^[a-f0-9]{64}$/.test(index.identity.sourceDigest ?? "") || !index.identity.standardSource?.sourceCommit || !index.identity.packageVersions || Object.keys(index.identity.packageVersions).length !== 3) throw new Error("AI_IDENTITY_INVALID");
  if (!equal(index.identity, declaration.identity)) throw new Error("AI_VERSION_OR_SOURCE_MISMATCH: refresh index and lock identity together");
  if (!Array.isArray(index.rules) || !Array.isArray(index.globalRequired) || !index.globalRequired.includes("global")) throw new Error("AI_REQUIRED_GLOBAL_MISSING");
  if (!Array.isArray(declaration.components) || !declaration.components.length || !Array.isArray(declaration.patterns)) throw new Error("CONSUMER_TASK_COMPONENTS_MISSING");
  const rules = new Map(index.rules.map(rule => [rule.id, rule]));
  if (rules.size !== index.rules.length) throw new Error("AI_DUPLICATE_RULE");
  // Index paths are relative to the published artifact root, independent of a
  // versioned index's own directory. This also supports an offline snapshot.
  let artifactRoot = path.dirname(indexPath);
  while (path.basename(artifactRoot) !== "ai" && path.dirname(artifactRoot) !== artifactRoot) artifactRoot = path.dirname(artifactRoot);
  if (path.basename(artifactRoot) !== "ai") throw new Error("AI_INDEX_LOCATION_INVALID: retain the producer ai/ layout");
  artifactRoot = path.dirname(artifactRoot);
  if (!index.sourceManifest || index.sourceManifest.sha256 !== index.identity.sourceDigest) throw new Error("AI_SOURCE_MANIFEST_IDENTITY_INVALID");
  const sourceManifest = within(artifactRoot, index.sourceManifest.path);
  const sourceBytes = fs.readFileSync(sourceManifest);
  if (hash(sourceBytes) !== index.identity.sourceDigest) throw new Error("AI_SOURCE_MANIFEST_DIGEST_MISMATCH");
  const provenance = json(sourceManifest, "AI_SOURCE_MANIFEST_UNREADABLE");
  if (!Array.isArray(provenance) || !provenance.length || provenance.some(source => typeof source.path !== "string" || !/^[a-f0-9]{64}$/.test(source.sha256))) throw new Error("AI_SOURCE_MANIFEST_INVALID");
  const loaded = new Map();
  const visit = (id, trail = []) => {
    if (trail.includes(id)) throw new Error(`AI_CYCLIC_REQUIRED_RULE:${[...trail, id].join(" -> ")}`);
    if (loaded.has(id)) return;
    const entry = rules.get(id);
    if (!entry || !Array.isArray(entry.required) || !Array.isArray(entry.optional) || !/^[a-f0-9]{64}$/.test(entry.sha256)) throw new Error(`AI_REQUIRED_RULE_MISSING:${id}`);
    const file = within(artifactRoot, entry.path);
    const bytes = fs.readFileSync(file);
    if (hash(bytes) !== entry.sha256) throw new Error(`AI_RULE_DIGEST_MISMATCH:${id}`);
    const rule = json(file, "AI_RULE_UNREADABLE");
    if (rule.schemaVersion !== "tcrn.ai-rule.v1" || rule.id !== id || !equal(rule.identity, index.identity) || !equal(rule.required, entry.required) || !equal(rule.optional, entry.optional)) throw new Error(`AI_RULE_IDENTITY_OR_DEPENDENCY_MISMATCH:${id}`);
    if (rule.kind !== entry.kind) throw new Error(`AI_RULE_KIND_MISMATCH:${id}`);
    if (["global", "pattern", "standard"].includes(rule.kind) && (typeof rule.content?.content !== "string" || !rule.content.content.trim() || !/^[a-f0-9]{64}$/.test(rule.content.sha256 ?? ""))) throw new Error(`AI_RULE_CONTENT_INVALID:${id}`);
    if (["global", "pattern", "standard"].includes(rule.kind) && hash(rule.content.content) !== rule.content.sha256) throw new Error(`AI_SOURCE_CONTENT_DIGEST_MISMATCH:${id}`);
    if (rule.kind === "tokens" && (!Array.isArray(rule.content) || !rule.content.length || rule.content.some(token => typeof token.variable !== "string" || typeof token.value !== "string"))) throw new Error(`AI_RULE_CONTENT_INVALID:${id}`);
    if (rule.kind === "component" && (!rule.content?.name || !rule.content.normativeText || !Array.isArray(rule.content.types?.props) || !rule.content.example?.sha256 || !rule.content.stories?.length)) throw new Error(`AI_RULE_CONTENT_INVALID:${id}`);
    for (const dependency of rule.required) visit(dependency, [...trail, id]);
    loaded.set(id, rule);
  };
  for (const id of [...index.globalRequired, ...declaration.components.map(name => `component/${name}`), ...declaration.patterns.map(name => `pattern/${name}`)]) visit(id);
  return { index, rules: loaded, artifactRoot };
}

function projectInputs(root, sourceRoots) {
  if (!Array.isArray(sourceRoots) || !sourceRoots.length) throw new Error("CONSUMER_SOURCE_ROOTS_MISSING");
  const files = new Set();
  const walk = file => {
    const stat = fs.lstatSync(file);
    if (stat.isSymbolicLink()) throw new Error(`Symbolic input is not supported: ${file}`);
    if (stat.isDirectory()) for (const entry of fs.readdirSync(file)) walk(path.join(file, entry));
    else if (/\.(?:[cm]?[jt]sx?|css)$/.test(file)) files.add(file);
  };
  for (const relative of sourceRoots) walk(within(root, relative));
  if (!files.size) throw new Error("CONSUMER_SOURCE_INPUTS_EMPTY");
  return [...files].sort();
}

const designProperty = /^(?:color|background(?:Color|Image)?|border(?:Color|Width|Radius)?|boxShadow|font(?:Family|Size|Weight)?|lineHeight|letterSpacing|fill|stroke)$/;
const bareColor = /#[a-f0-9]{3,8}\b|\b(?:rgba?|hsla?|oklch|lab|color)\s*\(/i;
export function checkConsumerSources(files, declaration, closure) {
  const findings = [];
  const usedComponents = new Set();
  const knownTokens = new Set([...closure.rules.values()].filter(rule => rule.kind === "tokens").flatMap(rule => rule.content.map(token => token.variable)));
  const formalNames = new Set(closure.index.rules.filter(rule => rule.kind === "component").map(rule => rule.id.slice("component/".length)));
  let shellInstances = 0;
  let controllers = 0;
  const report = (file, message) => findings.push(`${file}: ${message}`);
  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    for (const match of source.matchAll(/--tcrn-[\w-]+/g)) if (!knownTokens.has(match[0])) report(file, `UNREGISTERED_TOKEN:${match[0]}`);
    if (/--tcrn-[\w-]+\s*:/.test(source)) report(file, "TOKEN_OVERRIDE");
    if (file.endsWith(".css")) {
      if (bareColor.test(source)) report(file, "BARE_COLOR");
      for (const match of source.matchAll(/(?:^|[;{])\s*(?:color|background(?:-color)?|border-color|fill|stroke)\s*:\s*([^;{}]+)/g)) {
        if (!match[1].includes("var(--tcrn-") && !["inherit", "transparent", "currentColor", "none"].includes(match[1].trim())) report(file, "BARE_DESIGN_VALUE");
      }
      if (/\.tcrn-(?!doc)[\w-]+/.test(source)) report(file, "COMPONENT_STYLE_OVERRIDE");
      continue;
    }
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, /x$/.test(file) ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    if (ast.parseDiagnostics.length) report(file, "SOURCE_PARSE_ERROR");
    const imports = new Map();
    const namespaces = new Set();
    for (const statement of ast.statements) {
      if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
      const from = statement.moduleSpecifier.text;
      if (!from.startsWith("@tcrn/ui-react")) continue;
      const clause = statement.importClause;
      if (clause?.isTypeOnly) continue;
      const bindings = clause?.namedBindings;
      if (bindings && ts.isNamedImports(bindings)) for (const binding of bindings.elements) {
        if (binding.isTypeOnly) continue;
        const name = binding.propertyName?.text ?? binding.name.text;
        imports.set(binding.name.text, name);
        if (/^[A-Z]/.test(name) && (!formalNames.has(name) || from !== "@tcrn/ui-react/approved")) report(file, `UNPUBLISHED_COMPONENT_FAMILY:${name}`);
      }
      if (bindings && ts.isNamespaceImport(bindings)) {
        if (from !== "@tcrn/ui-react/approved") report(file, "UNPUBLISHED_NAMESPACE_ENTRY");
        namespaces.add(bindings.name.text);
      }
    }
    const imported = expression => {
      if (ts.isIdentifier(expression)) return imports.get(expression.text);
      if (ts.isPropertyAccessExpression(expression) && ts.isIdentifier(expression.expression) && namespaces.has(expression.expression.text)) return expression.name.text;
      return undefined;
    };
    const visit = node => {
      if (ts.isCallExpression(node) && imported(node.expression) === "useProductShellController") {
        controllers++;
        const options = node.arguments[0];
        const properties = options && ts.isObjectLiteralExpression(options) ? options.properties.map(property => property.name?.getText()).filter(Boolean) : [];
        if (!properties.includes("requestPreferences") || !properties.includes("onPinsChange")) report(file, "SHELL_CONTROLLER_ADAPTER_MISSING");
        if (properties.includes("productId") && !properties.includes("pinsStorageKey")) report(file, "ANONYMOUS_PIN_FALLBACK");
      }
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const component = imported(node.tagName);
        const attributes = node.attributes.properties.filter(ts.isJsxAttribute);
        const names = attributes.map(attribute => attribute.name.getText());
        if (component) {
          if (!formalNames.has(component)) report(file, `UNPUBLISHED_COMPONENT_FAMILY:${component}`);
          else usedComponents.add(component);
          if (!declaration.components.includes(component)) report(file, `TASK_RULE_NOT_SELECTED:${component}`);
          if (component === "ProductShell") {
            shellInstances++;
            const direct = ["pinnedIds", "onPinnedChange", "onPinsReorder"].every(name => names.includes(name));
            const spread = node.attributes.properties.some(attribute => ts.isJsxSpreadAttribute(attribute) && /\.productShellControlProps$/.test(attribute.expression.getText()));
            if (!direct && !spread) report(file, "SHELL_PIN_CALLBACKS_MISSING");
          }
          for (const attribute of attributes) if (attribute.name.getText() === "style") report(file, "COMPONENT_STYLE_OVERRIDE");
        }
        // Published root markers identify ShellPins even beside a valid ProductShell.
        let classExpression = attributes.find(attribute => attribute.name.getText() === "className")?.initializer;
        if (classExpression && ts.isJsxExpression(classExpression)) classExpression = classExpression.expression;
        const pinsClass = classExpression && (ts.isStringLiteral(classExpression) || ts.isNoSubstitutionTemplateLiteral(classExpression))
          && classExpression.text.split(/\s+/).includes("tcrn-shell-pins");
        const nativePins = ts.isIdentifier(node.tagName) && /^[a-z]/.test(node.tagName.text)
          && (names.includes("data-pins") || pinsClass);
        if (component !== "ShellPins" && (names.includes("data-ds-shell-pins") || nativePins)) report(file, "SHELL_PINS_SUBSTITUTED");
      }
      if (ts.isPropertyAssignment(node) && designProperty.test(node.name.getText().replace(/["']/g, ""))) {
        const value = node.initializer.getText();
        if (bareColor.test(value) || (ts.isStringLiteral(node.initializer) && !/^var\(--tcrn-/.test(node.initializer.text) && !["inherit", "transparent", "currentColor"].includes(node.initializer.text))) report(file, "BARE_DESIGN_VALUE");
      }
      ts.forEachChild(node, visit);
    };
    visit(ast);
    if (/localStorage[\s\S]{0,180}(?:pins|shell)/i.test(source)) report(file, "LOCAL_STORAGE_IS_NOT_ACCOUNT_SYNC");
  }
  const shellUsed = [...usedComponents, ...declaration.components].some(name => name === "ProductShell" || name.startsWith("Shell"));
  if (!usedComponents.size) findings.push("DS_COMPONENT_USE_MISSING");
  if (shellUsed && !shellInstances) findings.push("SHELL_COMPOSITION_MISSING: render ProductShell and its real family");
  if (shellUsed && !controllers && !declaration.adapterEvidence) findings.push("SHELL_ADAPTER_MISSING");
  return { findings, usedComponents: [...usedComponents].sort(), shellUsed };
}

export function checkConsumerContract({ projectRoot, indexPath, declarationPath }) {
  const root = path.resolve(projectRoot);
  const declaration = json(path.resolve(root, declarationPath), "CONSUMER_DECLARATION_UNREADABLE");
  const closure = loadRuleClosure(path.resolve(indexPath), declaration);
  const files = projectInputs(root, declaration.sourceRoots);
  const manifest = json(path.join(root, "package.json"), "CONSUMER_PACKAGE_UNREADABLE");
  const findings = [];
  const require = createRequire(path.join(root, "package.json"));
  for (const [name, version] of Object.entries(closure.index.identity.packageVersions)) {
    const installed = manifest.dependencies?.[name] ?? manifest.devDependencies?.[name];
    if (installed !== version) findings.push(`PACKAGE_VERSION_MISMATCH:${name}:${installed ?? "missing"}:${version}`);
    try {
      let directory = path.dirname(require.resolve(name));
      let actual;
      while (path.dirname(directory) !== directory) {
        const file = path.join(directory, "package.json");
        if (fs.existsSync(file)) {
          const candidate = json(file, "INSTALLED_PACKAGE_UNREADABLE");
          if (candidate.name === name) { actual = candidate.version; break; }
        }
        directory = path.dirname(directory);
      }
      if (actual !== version) findings.push(`INSTALLED_PACKAGE_VERSION_MISMATCH:${name}:${actual ?? "unresolved"}:${version}`);
    } catch (error) { findings.push(`INSTALLED_PACKAGE_UNREADABLE:${name}:${error.message}`); }
  }
  const scanned = checkConsumerSources(files, declaration, closure);
  findings.push(...scanned.findings);
  if (scanned.shellUsed) {
    if (!declaration.adapterEvidence) findings.push("SHELL_ADAPTER_EVIDENCE_MISSING");
    else {
      const evidence = json(within(root, declaration.adapterEvidence), "SHELL_ADAPTER_EVIDENCE_UNREADABLE");
      findings.push(...evaluateShellPreferenceEvidence(evidence).findings);
    }
  }
  return {
    ok: findings.length === 0, findings, identity: closure.index.identity,
    requiredRules: [...closure.rules.keys()], files: files.map(file => path.relative(root, file)),
    usedComponents: scanned.usedComponents,
    limits: ["Selected source roots and explicit imports/JSX only; run TypeScript for types and indirect/dynamic wiring.", "Native ShellPins markers are explicit data-pins attributes and literal className tokens, including unused JSX; computed values, spreads and runtime reachability are not resolved.", "Adapter observations are caller-supplied, not authenticated by this checker; retain raw HTTP/session evidence.", "This check does not measure visuals, keyboard/focus, business permissions, publication or future model behavior."],
  };
}

function run() {
  const args = process.argv.slice(2);
  const allowed = ["--project", "--index", "--declaration"];
  if (args.length !== 6 || args.filter((arg, index) => index % 2 === 0).some(arg => !allowed.includes(arg)) || new Set(args.filter((_, index) => index % 2 === 0)).size !== 3) throw new Error("Usage: node scripts/consumer-contract-check.mjs --project <consumer> --index <producer>/ai/index.json --declaration <relative.json>");
  const values = Object.fromEntries(allowed.map(flag => [flag, args[args.indexOf(flag) + 1]]));
  const result = checkConsumerContract({ projectRoot: values["--project"], indexPath: values["--index"], declarationPath: values["--declaration"] });
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exitCode = 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { run(); } catch (error) { console.error(JSON.stringify({ ok: false, error: error.message })); process.exitCode = 1; }
}
