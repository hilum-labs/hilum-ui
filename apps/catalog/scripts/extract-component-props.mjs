/**
 * Component prop extraction for the catalog docs, using the TypeScript
 * compiler API (no extra dependency — `typescript` is a workspace devDep).
 *
 * For every exported PascalCase value of a component module that is callable
 * (function components, forwardRef/memo exotics), the props type is the first
 * parameter of its first call signature. Each prop is reported with:
 *   - name, required
 *   - type        (checker-resolved, `undefined` stripped; falls back to the
 *                  written annotation when the resolved type is huge)
 *   - default     (`@default`/`@defaultValue` JSDoc tag, else the destructuring
 *                  initializer in the implementation, else "Default: `x`" prose)
 *   - description (JSDoc text)
 *   - source      "own" (declared in the workspace) or the npm package it is
 *                 inherited from (e.g. "@types/react", "@radix-ui/react-tabs")
 */
import { relative, sep } from "path";
import ts from "typescript";

const MAX_TYPE_LENGTH = 160;

function packageOfFile(fileName) {
  const normalized = fileName.split(sep).join("/");
  const idx = normalized.lastIndexOf("/node_modules/");
  if (idx === -1) return null;
  const rest = normalized.slice(idx + "/node_modules/".length).split("/");
  return rest[0].startsWith("@") ? `${rest[0]}/${rest[1]}` : rest[0];
}

function isPascalCase(name) {
  return /^[A-Z][A-Za-z0-9]*$/.test(name);
}

function collapseWhitespace(text) {
  return text.replace(/\s+/g, " ").trim();
}

function findDefaultInProse(description) {
  const match = description.match(/\bDefault(?:s to)?:?\s*`([^`]+)`/i);
  return match ? match[1] : null;
}

/** Locate the props parameter's binding pattern in the component's implementation. */
function findImplementationFunction(checker, symbol, depth = 0) {
  if (!symbol || depth > 4) return null;
  for (const decl of symbol.getDeclarations() ?? []) {
    if (ts.isFunctionDeclaration(decl)) return decl;
    if (ts.isVariableDeclaration(decl) && decl.initializer) {
      let init = decl.initializer;
      while (ts.isAsExpression(init) || ts.isParenthesizedExpression(init)) init = init.expression;
      if (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) return init;
      if (ts.isCallExpression(init)) {
        // forwardRef(fn), React.forwardRef(fn), memo(forwardRef(fn)), …
        let call = init;
        while (call) {
          const [first] = call.arguments;
          if (!first) break;
          if (ts.isArrowFunction(first) || ts.isFunctionExpression(first)) return first;
          if (ts.isCallExpression(first)) {
            call = first;
            continue;
          }
          if (ts.isIdentifier(first)) {
            return findImplementationFunction(
              checker,
              checker.getSymbolAtLocation(first),
              depth + 1,
            );
          }
          break;
        }
      }
      if (ts.isIdentifier(init) || ts.isPropertyAccessExpression(init)) {
        // `const TabsTrigger = TabItem`
        const target = checker.getSymbolAtLocation(init);
        return findImplementationFunction(checker, target, depth + 1);
      }
    }
  }
  return null;
}

function collectBindingDefaults(fn) {
  const defaults = new Map();
  const param = fn?.parameters?.[0];
  if (!param) return defaults;

  const visitPattern = (pattern) => {
    if (!ts.isObjectBindingPattern(pattern)) return;
    for (const element of pattern.elements) {
      if (element.dotDotDotToken) continue;
      const key = element.propertyName ?? element.name;
      if (!ts.isIdentifier(key) && !ts.isStringLiteral(key)) continue;
      if (element.initializer) {
        defaults.set(key.text, collapseWhitespace(element.initializer.getText()));
      }
    }
  };

  if (ts.isObjectBindingPattern(param.name)) {
    visitPattern(param.name);
  } else if (ts.isIdentifier(param.name) && fn.body && ts.isBlock(fn.body)) {
    // `(props, ref) => { const { a = 1, ...rest } = props; }`
    for (const statement of fn.body.statements) {
      if (!ts.isVariableStatement(statement)) continue;
      for (const decl of statement.declarationList.declarations) {
        if (
          decl.initializer &&
          ts.isIdentifier(decl.initializer) &&
          decl.initializer.text === param.name.text &&
          ts.isObjectBindingPattern(decl.name)
        ) {
          visitPattern(decl.name);
        }
      }
    }
  }
  return defaults;
}

/** @returns {Array<import("typescript").Symbol[]>} one entry per prop name, one symbol per union member */
function propertiesOf(checker, type) {
  const members = type.isUnion() ? type.types : [checker.getApparentType(type)];
  // Discriminated prop unions (e.g. single | multiple): list every member's props once.
  const byName = new Map();
  for (const member of members) {
    for (const prop of checker.getPropertiesOfType(member)) {
      if (!byName.has(prop.name)) byName.set(prop.name, []);
      byName.get(prop.name).push(prop);
    }
  }
  return [...byName.values()].map((symbols) => ({ symbols, memberCount: members.length }));
}

/** `cva(base, { variants: { size: {…} }, defaultVariants: { size: "md" } })` → "md" for `size`. */
function findCvaDefault(decl) {
  if (!decl || !ts.isPropertyAssignment(decl)) return null;
  const name = decl.name.getText().replace(/^["']|["']$/g, "");
  let node = decl.parent;
  while (node && !ts.isCallExpression(node)) node = node.parent;
  if (!node || node.expression.getText() !== "cva") return null;
  const config = node.arguments[1];
  if (!config || !ts.isObjectLiteralExpression(config)) return null;
  const defaults = config.properties.find(
    (p) => ts.isPropertyAssignment(p) && p.name.getText() === "defaultVariants",
  );
  if (!defaults || !ts.isObjectLiteralExpression(defaults.initializer)) return null;
  const entry = defaults.initializer.properties.find(
    (p) => ts.isPropertyAssignment(p) && p.name.getText().replace(/^["']|["']$/g, "") === name,
  );
  return entry ? collapseWhitespace(entry.initializer.getText()) : null;
}

function isLiteralLike(type) {
  return (
    type.isStringLiteral() ||
    type.isNumberLiteral() ||
    (type.flags & (ts.TypeFlags.BooleanLiteral | ts.TypeFlags.Null)) !== 0
  );
}

function formatType(checker, prop, decl, location) {
  const type = checker.getTypeOfSymbolAtLocation(prop, location);
  const nonNullable = checker.getNonNullableType(type);
  const flags =
    ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;
  let text;
  if (nonNullable.isUnion() && nonNullable.types.every(isLiteralLike)) {
    // Expand literal unions, including local aliases (`ControlDensity` → `"default" | "compact"`).
    text = checker.typeToString(nonNullable, location, flags | ts.TypeFormatFlags.InTypeAlias);
  } else if (decl && decl.type) {
    // Otherwise prefer what the author wrote (`ReactNode`, `IconComponent`, callbacks).
    text = collapseWhitespace(decl.type.getText());
  } else {
    // Mapped/synthesised props (e.g. CVA VariantProps) have no annotation.
    text = checker.typeToString(nonNullable, location, flags);
  }
  // CVA variant props come through as `"a" | "b" | null`.
  text = text
    .replace(/\s*\|\s*null\b/g, "")
    .replace(/^null\s*\|\s*/, "")
    .replace(/\s*\|\s*undefined\b/g, "");
  if (text.length > MAX_TYPE_LENGTH) {
    text = `${text.slice(0, MAX_TYPE_LENGTH - 1)}…`;
  }
  return text;
}

/**
 * @param {{ tsconfigPath: string, rootNames: string[], workspaceRoot: string }} options
 */
export function createPropsExtractor({ tsconfigPath, rootNames, workspaceRoot }) {
  const parsed = ts.getParsedCommandLineOfConfigFile(
    tsconfigPath,
    { noEmit: true },
    {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
        throw new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
      },
    },
  );
  const program = ts.createProgram({
    rootNames: [...new Set([...parsed.fileNames, ...rootNames])],
    options: { ...parsed.options, noEmit: true },
  });
  const checker = program.getTypeChecker();

  /** @returns {Array<{ name: string, props: object[], inherited: Record<string, number> }>} */
  function getComponents(fileName) {
    const sourceFile = program.getSourceFile(fileName);
    if (!sourceFile) return [];
    const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
    if (!moduleSymbol) return [];

    const components = [];
    for (const exported of checker.getExportsOfModule(moduleSymbol)) {
      if (!isPascalCase(exported.name)) continue;
      const symbol =
        exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
      if (!(symbol.flags & ts.SymbolFlags.Value)) continue; // skip types/interfaces

      const valueType = checker.getTypeOfSymbolAtLocation(symbol, sourceFile);
      const [signature] = valueType.getCallSignatures();
      const propsParam = signature?.getParameters()[0];
      if (!propsParam) continue;

      const propsType = checker.getTypeOfSymbolAtLocation(propsParam, sourceFile);
      const defaults = collectBindingDefaults(findImplementationFunction(checker, symbol));
      const inherited = {};
      const props = [];

      for (const { symbols, memberCount } of propertiesOf(checker, propsType)) {
        const [prop] = symbols;
        if (prop.name === "ref" || prop.name === "key") continue;
        const decls = symbols.flatMap((symbol) => symbol.getDeclarations() ?? []);
        // A prop re-declared in the workspace (e.g. narrowing `value`) counts as own.
        const ownDecl = decls.find((d) => !packageOfFile(d.getSourceFile().fileName));

        if (!ownDecl) {
          const declFile = decls[0]?.getSourceFile().fileName ?? "";
          const from = (declFile && packageOfFile(declFile)) || "unknown";
          inherited[from] = (inherited[from] ?? 0) + 1;
          continue;
        }

        const description = collapseWhitespace(
          ts.displayPartsToString(prop.getDocumentationComment(checker)),
        );
        const tags = prop.getJsDocTags(checker);
        if (tags.some((tag) => tag.name === "internal" || tag.name === "deprecated")) continue;
        const defaultTag = tags.find(
          (tag) => tag.name === "default" || tag.name === "defaultValue",
        );
        const defaultValue =
          (defaultTag && collapseWhitespace(ts.displayPartsToString(defaultTag.text))) ||
          defaults.get(prop.name) ||
          findCvaDefault(ownDecl) ||
          findDefaultInProse(description) ||
          null;

        const types = [
          ...new Set(
            symbols.map((symbol) => {
              const symbolDecls = symbol.getDeclarations() ?? [];
              const decl =
                symbolDecls.find((d) => !packageOfFile(d.getSourceFile().fileName)) ??
                symbolDecls[0];
              return formatType(checker, symbol, decl, decl ?? sourceFile);
            }),
          ),
        ].map((text, _i, all) => (all.length > 1 && text.includes("=>") ? `(${text})` : text));

        props.push({
          name: prop.name,
          type: types.join(" | "),
          // Required only when every union member requires it.
          required:
            symbols.length === memberCount &&
            symbols.every((symbol) => !(symbol.flags & ts.SymbolFlags.Optional)),
          default: defaultValue,
          description,
          declaredIn: relative(workspaceRoot, ownDecl.getSourceFile().fileName)
            .split(sep)
            .join("/"),
        });
      }

      components.push({ name: exported.name, props, inherited });
    }
    return components;
  }

  return { getComponents };
}

/** Human-readable summary of inherited prop sources for the docs panel. */
export function describeInherited(inherited) {
  const entries = Object.entries(inherited).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return null;
  const parts = entries.map(([pkg, count]) => {
    if (pkg === "@types/react") return `native HTML/React attributes (${count})`;
    if (pkg.startsWith("@radix-ui/") || pkg === "radix-ui")
      return `Radix ${pkg.replace(/^@radix-ui\/(react-)?/, "")} props (${count})`;
    return `${pkg} props (${count})`;
  });
  return `Also accepts ${parts.join(", ")}.`;
}
