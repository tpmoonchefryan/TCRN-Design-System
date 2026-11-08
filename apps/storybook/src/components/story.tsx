import { ComponentDetail, ComponentOverview } from "../component-overview.js";
import { componentContract, componentExamplesSource, type ComponentState, type FormalComponentName } from "../component-catalog.js";
import { resolveDocsLocale } from "../approved-source.js";

export function componentParameters(name: FormalComponentName) {
  const contract = componentContract(name);
  return { layout: "fullscreen", formalComponent: name, sourceBoard: contract.board, exampleSource: componentExamplesSource };
}

export function componentStory(name: FormalComponentName, state: ComponentState = "default") {
  return {
    name: state === "default" ? "Overview" : state,
    parameters: { applicableState: state },
    render: (_args: unknown, context: { globals: Record<string, unknown> }) => state === "default"
      ? <ComponentOverview name={name} locale={resolveDocsLocale(String(context.globals.locale))} />
      : <ComponentDetail name={name} state={state} locale={resolveDocsLocale(String(context.globals.locale))} />,
  };
}

export function componentInteraction(name: FormalComponentName) {
  return {
    name: "Form submission",
    render: (_args: unknown, context: { globals: Record<string, unknown> }) => <ComponentDetail
      name={name} state="default" interaction locale={resolveDocsLocale(String(context.globals.locale))} />,
  };
}
