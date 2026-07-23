// Component props/variants/slots machine manifest — TCRN-DS-STORY-043.
//
// Emits a deterministic, byte-stable JSON describing the public @tcrn/ui-react
// component API (props, string-literal-union variants, ReactNode slots) so an AI
// agent can diff/validate the component surface without reading the TSX by hand.
//
// The extraction reads the TypeScript SOURCE (packages/ui-react/src/**) through the
// TypeScript compiler API — build-independent and more faithful than walking dist
// .d.ts. It keys the manifest by the registry's componentLibraryPublicComponentNames
// (index.tsx) and cross-checks coverage: every public name must resolve to an export
// (coverage.missingFromManifest must be empty) or the gate fails.
//
// Only OWN props are recorded: a property is kept only when at least one of its
// declarations lives under packages/ui-react/src, which drops the hundreds of
// inherited native DOM attributes (ButtonHTMLAttributes, HTMLAttributes, …) that
// come from @types/react while keeping props inherited from sibling ui-react
// interfaces (e.g. IconButton inheriting variant/size from ButtonProps).
//
// Convention mirrors scripts/package-contract-manifest.mjs: regenerate-and-commit.
//   node scripts/component-api-manifest.mjs           # regenerate + semantic gate
//   node scripts/component-api-manifest.mjs --check    # fail on drift, do not write
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const uiReactSrcMarker = "/packages/ui-react/src/";
const entrySourcePath = "packages/ui-react/src/index.tsx";
const outputRoot = "docs/verification/internal-alpha";
const outputPath = join(outputRoot, "component-api-manifest.json");

function normalizePath(value) {
  return value.replaceAll("\\", "/");
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function typescriptVersion() {
  try {
    return JSON.parse(readFileSync(join(root, "package.json"), "utf8")).devDependencies?.typescript ?? ts.version;
  } catch {
    return ts.version;
  }
}

function buildProgram() {
  const configPath = join(root, "packages/ui-react/tsconfig.json");
  const parsed = ts.getParsedCommandLineOfConfigFile(configPath, {}, {
    ...ts.sys,
    onUnRecoverableConfigFileDiagnostic(diagnostic) {
      throw new Error(`ui-react tsconfig unreadable: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
    }
  });
  if (!parsed) {
    throw new Error("failed_to_parse_ui_react_tsconfig");
  }
  const program = ts.createProgram({
    rootNames: parsed.fileNames,
    options: { ...parsed.options, noEmit: true },
    projectReferences: parsed.projectReferences
  });
  const checker = program.getTypeChecker();
  const entry = program.getSourceFile(join(root, entrySourcePath))
    ?? program.getSourceFiles().find((file) => normalizePath(file.fileName).endsWith(entrySourcePath));
  if (!entry) {
    throw new Error(`entry_module_not_found:${entrySourcePath}`);
  }
  const moduleSymbol = checker.getSymbolAtLocation(entry);
  if (!moduleSymbol) {
    throw new Error("entry_module_symbol_not_found");
  }
  return { checker, moduleSymbol };
}

function resolveAlias(checker, symbol) {
  let current = symbol;
  const seen = new Set();
  while (current && current.flags & ts.SymbolFlags.Alias && !seen.has(current)) {
    seen.add(current);
    const next = checker.getAliasedSymbol(current);
    if (!next || next === current) {
      break;
    }
    current = next;
  }
  return current;
}

// The registry's own source-of-truth name list, read from the AST so the coverage
// cross-check needs no dist build.
function registryComponentNames(checker, exportsByName) {
  const symbol = exportsByName.get("componentLibraryPublicComponentNames");
  if (!symbol) {
    throw new Error("componentLibraryPublicComponentNames_export_missing");
  }
  const declaration = resolveAlias(checker, symbol).valueDeclaration;
  if (!declaration || !ts.isVariableDeclaration(declaration) || !declaration.initializer) {
    throw new Error("componentLibraryPublicComponentNames_declaration_unreadable");
  }
  let initializer = declaration.initializer;
  if (ts.isAsExpression(initializer)) {
    initializer = initializer.expression;
  }
  if (!ts.isArrayLiteralExpression(initializer)) {
    throw new Error("componentLibraryPublicComponentNames_not_array_literal");
  }
  return initializer.elements
    .filter((element) => ts.isStringLiteral(element))
    .map((element) => element.text);
}

function bindingDefaults(valueDeclaration) {
  let fn = null;
  if (valueDeclaration && ts.isFunctionDeclaration(valueDeclaration)) {
    fn = valueDeclaration;
  } else if (valueDeclaration && ts.isVariableDeclaration(valueDeclaration) && valueDeclaration.initializer) {
    const initializer = valueDeclaration.initializer;
    if (ts.isCallExpression(initializer)) {
      // forwardRef(fn) / memo(fn) — the render function is the first argument.
      const arg = initializer.arguments[0];
      if (arg && (ts.isArrowFunction(arg) || ts.isFunctionExpression(arg))) {
        fn = arg;
      }
    } else if (ts.isArrowFunction(initializer) || ts.isFunctionExpression(initializer)) {
      fn = initializer;
    }
  }
  if (!fn || fn.parameters.length === 0) {
    return {};
  }
  const first = fn.parameters[0];
  if (!first.name || !ts.isObjectBindingPattern(first.name)) {
    return {};
  }
  const defaults = {};
  for (const element of first.name.elements) {
    if (!element.initializer) {
      continue;
    }
    const key = element.propertyName && ts.isIdentifier(element.propertyName)
      ? element.propertyName.text
      : (ts.isIdentifier(element.name) ? element.name.text : null);
    if (key) {
      defaults[key] = element.initializer.getText().replace(/\s+/g, " ").trim();
    }
  }
  return defaults;
}

function literalUnionValues(checker, type) {
  const parts = type.isUnion() ? type.types : [type];
  const values = [];
  for (const part of parts) {
    if (part.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)) {
      continue;
    }
    if (part.isStringLiteral() || part.isNumberLiteral()) {
      values.push(part.value);
    } else {
      return null;
    }
  }
  return values.length > 0 ? values : null;
}

function propOwnDeclaration(symbol) {
  const declarations = symbol.getDeclarations() ?? [];
  const owned = declarations.filter((declaration) =>
    normalizePath(declaration.getSourceFile().fileName).includes(uiReactSrcMarker));
  if (owned.length === 0) {
    return null;
  }
  return owned.find((declaration) => ts.isPropertySignature(declaration) || ts.isPropertyDeclaration(declaration)) ?? owned[0];
}

const SLOT_TYPE_PATTERN = /\b(?:ReactNode|ReactElement)\b|\bJSX\.Element\b/;

function describeProp(checker, symbol, contextNode, defaults) {
  const declaration = propOwnDeclaration(symbol);
  if (!declaration) {
    return null; // inherited native DOM / non-ui-react attribute — excluded on purpose.
  }
  const propType = checker.getTypeOfSymbolAtLocation(symbol, declaration);
  const writtenType = declaration.type
    ? declaration.type.getText().replace(/\s+/g, " ").trim()
    : checker.typeToString(propType);
  const enumValues = literalUnionValues(checker, propType);
  const required = !(symbol.flags & ts.SymbolFlags.Optional);
  const entry = {
    name: symbol.getName(),
    type: writtenType,
    required
  };
  if (Object.prototype.hasOwnProperty.call(defaults, symbol.getName())) {
    entry.default = defaults[symbol.getName()];
  }
  if (enumValues) {
    entry.enumValues = enumValues;
  }
  if (SLOT_TYPE_PATTERN.test(writtenType)) {
    entry.slot = true;
  }
  return entry;
}

function describeComponent(checker, name, symbol) {
  const resolved = resolveAlias(checker, symbol);
  const valueDeclaration = resolved.valueDeclaration ?? resolved.getDeclarations()?.[0] ?? null;
  const entry = { name, kind: "function", props: [], variants: {}, slots: [] };
  if (!valueDeclaration) {
    entry.extractionError = "no_value_declaration";
    return entry;
  }
  if (ts.isVariableDeclaration(valueDeclaration)
    && valueDeclaration.initializer
    && ts.isCallExpression(valueDeclaration.initializer)) {
    const callee = valueDeclaration.initializer.expression.getText();
    entry.kind = /forwardRef/.test(callee) ? "forwardRef" : (/\bmemo\b/.test(callee) ? "memo" : "wrapped");
  }

  const componentType = checker.getTypeOfSymbolAtLocation(resolved, valueDeclaration);
  const propsTypeNode = ts.isFunctionDeclaration(valueDeclaration) && valueDeclaration.parameters[0]?.type
    ? valueDeclaration.parameters[0].type.getText().replace(/\s+/g, " ").trim()
    : null;
  if (propsTypeNode) {
    entry.propsType = propsTypeNode;
  }

  const signatures = componentType.getCallSignatures();
  if (signatures.length === 0) {
    entry.extractionError = "no_call_signature";
    return entry;
  }
  const propsParam = signatures[0].getParameters()[0];
  if (!propsParam) {
    return entry; // component takes no props.
  }
  const propsType = checker.getTypeOfSymbolAtLocation(propsParam, propsParam.valueDeclaration ?? valueDeclaration);
  const defaults = bindingDefaults(valueDeclaration);

  const props = [];
  for (const propSymbol of checker.getPropertiesOfType(propsType)) {
    const described = describeProp(checker, propSymbol, valueDeclaration, defaults);
    if (described) {
      props.push(described);
    }
  }
  props.sort((a, b) => a.name.localeCompare(b.name));
  entry.props = props;

  const variants = {};
  const slots = [];
  for (const prop of props) {
    if (prop.enumValues) {
      variants[prop.name] = prop.enumValues;
    }
    if (prop.slot) {
      slots.push(prop.name);
    }
  }
  entry.variants = Object.fromEntries(Object.keys(variants).sort().map((key) => [key, variants[key]]));
  entry.slots = slots.sort();
  return entry;
}

function buildManifest() {
  const { checker, moduleSymbol } = buildProgram();
  const exportsByName = new Map(
    checker.getExportsOfModule(moduleSymbol).map((symbol) => [symbol.getName(), symbol])
  );

  const registryNames = registryComponentNames(checker, exportsByName);
  const components = {};
  const missingFromManifest = [];
  for (const name of registryNames) {
    const symbol = exportsByName.get(name);
    if (!symbol) {
      missingFromManifest.push(name);
      continue;
    }
    try {
      components[name] = describeComponent(checker, name, symbol);
    } catch (error) {
      // A subtle extraction failure degrades to a recorded note, not a missing name:
      // the export exists (coverage is satisfied); the props surface is flagged for
      // follow-up rather than silently dropped or crashing the whole gate.
      components[name] = {
        name,
        kind: "function",
        props: [],
        variants: {},
        slots: [],
        extractionError: error instanceof Error ? error.message : String(error)
      };
    }
  }

  const manifestNames = Object.keys(components).sort();
  const sortedComponents = Object.fromEntries(manifestNames.map((name) => [name, components[name]]));

  // Informational: exported Capitalized components not covered by the registry.
  // Not part of the ok gate (S030's parity gate owns registry↔export completeness);
  // surfaced here purely as a consistency signal.
  const knownNames = new Set(registryNames);
  const extraNotInRegistry = [];
  for (const [name, symbol] of exportsByName) {
    if (!/^[A-Z]/.test(name) || knownNames.has(name)) {
      continue;
    }
    const resolved = resolveAlias(checker, symbol);
    const declaration = resolved.valueDeclaration;
    if (!declaration || !normalizePath(declaration.getSourceFile().fileName).includes(uiReactSrcMarker)) {
      continue;
    }
    const type = checker.getTypeOfSymbolAtLocation(resolved, declaration);
    if (type.getCallSignatures().length > 0 && (declaration.kind === ts.SyntaxKind.FunctionDeclaration
      || (ts.isVariableDeclaration(declaration) && declaration.initializer))) {
      extraNotInRegistry.push(name);
    }
  }
  extraNotInRegistry.sort();

  const componentsWithExtractionErrors = manifestNames.filter((name) => sortedComponents[name].extractionError);

  const manifest = {
    ok: missingFromManifest.length === 0,
    route: "route_tcrn_design_system_component_api_machine_manifest",
    generatedFrom: entrySourcePath,
    typescriptVersion: typescriptVersion(),
    componentCount: manifestNames.length,
    coverage: {
      registryComponentCount: registryNames.length,
      publicComponentNames: [...registryNames].sort(),
      manifestComponentNames: manifestNames,
      missingFromManifest: [...missingFromManifest].sort(),
      extraNotInRegistry,
      componentsWithExtractionErrors
    },
    noOverclaim: {
      packagePublished: false,
      productAdoptionClaimed: false,
      describesSourceApiOnly: true
    },
    components: sortedComponents
  };
  return manifest;
}

function run() {
  const check = process.argv.includes("--check");
  const manifest = buildManifest();
  const serialized = stableJson(manifest);
  const absoluteOutput = join(root, outputPath);

  if (check) {
    let current = null;
    try {
      current = readFileSync(absoluteOutput, "utf8");
    } catch {
      current = null;
    }
    if (current !== serialized) {
      console.error(`COMPONENT API MANIFEST DRIFT: ${outputPath}`);
      console.error("Run `node scripts/component-api-manifest.mjs` (or `pnpm internal-alpha:contracts`) to regenerate it.");
      process.exit(1);
    }
  } else {
    mkdirSync(join(root, outputRoot), { recursive: true });
    writeFileSync(absoluteOutput, serialized);
  }

  console.log(JSON.stringify({
    ok: manifest.ok,
    componentCount: manifest.componentCount,
    registryComponentCount: manifest.coverage.registryComponentCount,
    missingFromManifest: manifest.coverage.missingFromManifest,
    extraNotInRegistry: manifest.coverage.extraNotInRegistry,
    componentsWithExtractionErrors: manifest.coverage.componentsWithExtractionErrors,
    mode: check ? "check" : "regenerate"
  }, null, 2));

  if (!manifest.ok) {
    process.exit(1);
  }
}

// pathToFileURL, not string concatenation: this repository lives under a path with a
// space in it, so `file://${argv[1]}` never matches the percent-encoded import.meta.url
// and the entry point silently does nothing.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}

export { buildManifest };
