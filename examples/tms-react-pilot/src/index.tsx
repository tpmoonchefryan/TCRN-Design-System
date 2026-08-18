import { renderToStaticMarkup } from "react-dom/server";
import { EnvironmentBanner, TopBar } from "@tcrn/ui-react";
import { WorkIndex } from "@tcrn/ui-domain";

export function renderSyntheticTmsPilot(): string {
  return renderToStaticMarkup(
    <section data-example="tms-react-pilot">
      <TopBar productName="TCRN" moduleName="Talent fixture" />
      <EnvironmentBanner label="Synthetic TMS pilot" state={{ state: "local_only" }} />
      <WorkIndex rows={[{ id: "talent-row", title: "Synthetic talent workflow", state: { state: "proof_required" }, owner: "product-role-placeholder" }]} />
    </section>
  );
}
