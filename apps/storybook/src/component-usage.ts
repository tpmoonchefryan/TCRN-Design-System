import { componentContract, type FormalComponentName } from "./component-catalog.js";

/** Complete consumer module. Shell inputs stay explicit at the product boundary. */
export function componentUsage(name: FormalComponentName) {
  const contract = componentContract(name);
  const shell = contract.board.startsWith("07");
  const contentAligned = contract.board === "05-actions" || name === "ProductLogo" || name === "ShellBrandButton";
  const imports = [name, ...(name === "ButtonGroup" ? ["Button"] : []), "tcrnComponentCss"];
  const declarations = [
    ...(shell ? ['import type { ComponentProps } from "react";'] : []),
    `import { ${imports.join(", ")} } from "@tcrn/ui-react/approved";`,
    'import { tcrnTokenCss } from "@tcrn/ui-tokens";',
    'import "@tcrn/ui-tokens/fonts.css";',
  ];
  const signature = shell ? `props: ComponentProps<typeof ${name}>` : "";
  const content = shell ? `<${name} {...props} />`
    : contract.example.replace("text={secret}", 'text="PRJ-2026-0412"').replace(" shortcut=\"auto\" fill", ' shortcut="auto"');
  const options = ["MultiSelect", "RadioGroup"].includes(name)
    ? '  const options = [{ value: "review", label: "Review" }, { value: "release", label: "Release" }];\n'
    : "";
  const error = name === "Input" ? '      <p id="error">Name is required.</p>\n' : "";
  const alignment = contentAligned ? ' justifyItems: "start",' : "";
  return `${declarations.join("\n")}

export function Example(${signature}) {
${options}  return <>
    <style>{tcrnTokenCss + "\\n" + tcrnComponentCss}</style>
    <div data-tcrn-root data-tcrn-theme="light" style={{ display: "grid",${alignment} gap: "var(--tcrn-space-2)" }}>
      ${content}
${error}    </div>
  </>;
}
`;
}
