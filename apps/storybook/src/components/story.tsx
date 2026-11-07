import { ComponentExample } from "../component-examples.js";
import { componentContract, componentExamplesSource, type ComponentState, type FormalComponentName } from "../component-catalog.js";
import { resolveDocsLocale } from "../approved-source.js";

export function componentParameters(name: FormalComponentName) {
  const contract = componentContract(name);
  return { layout: "fullscreen", formalComponent: name, sourceBoard: contract.board, exampleSource: componentExamplesSource };
}

export function componentStory(name: FormalComponentName, state: ComponentState = "default") {
  return {
    name: state,
    parameters: { applicableState: state },
    render: (_args: unknown, context: { globals: Record<string, unknown> }) => <ComponentExample
      name={name} state={state} locale={resolveDocsLocale(String(context.globals.locale))} />,
  };
}
