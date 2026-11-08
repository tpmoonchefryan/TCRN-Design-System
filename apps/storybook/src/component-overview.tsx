import { Heading, Text } from "@tcrn/ui-react/approved";
import { apiReaderSummary } from "./approved-api.js";
import type { DocsLocale } from "./approved-source.js";
import { ComponentExample } from "./component-examples.js";
import { componentContract, componentStates, componentStoryId, type ComponentState, type FormalComponentName } from "./component-catalog.js";
import { componentLayouts } from "./component-layout.js";

const copy = {
  en: { overview: "Overview", states: "States and variants", layout: "Layout responsibility", source: "Standard examples", interaction: "Form submission", help: "Change the control, then save to inspect its native form value. Feedback appears after submission.", detail: "State detail", size: "Sizing", debug: "Open a state for interaction and debugging" },
  "zh-CN": { overview: "组件概览", states: "状态与变体", layout: "布局责任", source: "标准示例", interaction: "表单提交", help: "更改控件后保存，检查原生表单值。提交后显示反馈。", detail: "状态详情", size: "尺寸责任", debug: "打开状态查看交互并调试" },
  ja: { overview: "概要", states: "状態とバリエーション", layout: "レイアウトの責任", source: "標準の使用例", interaction: "フォーム送信", help: "値を変更して保存し、ネイティブのフォーム値を確認します。送信後に結果を表示します。", detail: "状態の詳細", size: "サイズ", debug: "状態を開いて操作とデバッグを確認" },
  ko: { overview: "개요", states: "상태 및 변형", layout: "레이아웃 책임", source: "표준 예제", interaction: "양식 제출", help: "컨트롤을 변경하고 저장하여 기본 양식 값을 확인하세요. 제출 후 결과가 표시됩니다.", detail: "상태 상세", size: "크기 책임", debug: "상태를 열어 상호 작용 및 디버깅 확인" },
  fr: { overview: "Vue d’ensemble", states: "États et variantes", layout: "Responsabilité de mise en page", source: "Exemples de la norme", interaction: "Envoi du formulaire", help: "Modifier le contrôle puis enregistrer pour examiner sa valeur native. Le résultat apparaît après l’envoi.", detail: "Détail de l’état", size: "Dimensionnement", debug: "Ouvrir un état pour tester et déboguer" },
};

export function ComponentOverview({ name, locale }: { name: FormalComponentName; locale: DocsLocale }) {
  const contract = componentContract(name);
  const layout = componentLayouts[name];
  const c = copy[locale];
  const states = componentStates[name];
  const shell = contract.board.startsWith("07");
  const comparisons = shell ? ["default"] : states.filter(state => !["hover", "active", "interaction", "copying", "copied", "failed", "unsupported"].includes(state));
  return <section className="component-overview" data-component-overview={name} lang={locale}>
    <header><Heading level={1}>{name}</Heading><Text>{apiReaderSummary(contract, locale)}</Text></header>
    <div className="component-layout-note">
      <Text tone="strong">{c.layout} · {c.size}: <code>{layout.sizing}</code></Text>
      <Text size="meta" lang="en">{layout.constraint}</Text>
      <Text size="meta">{c.source}: <a className="tcrn-link" href={`?id=published-standards--${contract.board === "07a-shell-upper" ? "shell-upper" : contract.board === "07b-shell-lower" ? "shell-lower" : contract.board.slice(3)}&viewMode=story&globals=locale:${locale}`}>{contract.board}</a> · L{contract.line}</Text>
    </div>
    <nav aria-label={c.states} className="component-state-links">
      {states.map(state => <a key={state} className="tcrn-link" href={`?id=${componentStoryId(name, state)}&viewMode=story&globals=locale:${locale}`}>{state}</a>)}
    </nav>
    <Heading level={2} visualLevel={3}>{c.states}</Heading>
    <div className={`component-comparisons${shell ? " component-comparisons--shell" : ""}`}>
      {comparisons.map(state => <section className="component-comparison" key={state}>
        <Heading level={3} visualLevel={4}>{state}</Heading>
        <ComponentExample name={name} state={state as ComponentState} locale={locale} />
      </section>)}
    </div>
    <Text size="meta">{c.debug}</Text>
  </section>;
}

export function ComponentDetail({ name, state, locale, interaction = false }: {
  name: FormalComponentName; state: ComponentState; locale: DocsLocale; interaction?: boolean;
}) {
  const c = copy[locale];
  return <section className="component-overview" lang={locale}>
    <header><Heading level={1}>{name} · {interaction ? c.interaction : state}</Heading>
      <Text>{interaction ? c.help : apiReaderSummary(componentContract(name), locale)}</Text></header>
    <Text size="meta" lang="en">{componentLayouts[name].constraint}</Text>
    <ComponentExample name={name} state={state} locale={locale} interaction={interaction} />
  </section>;
}
