import { Heading, Text } from "@tcrn/ui-react/approved";

export default { title: "Adopted support/Customer list boundary", parameters: { layout: "fullscreen", adoptedSupport: true } };

export const Overview = {
  render: () => <section className="component-overview" lang="en">
    <header><Heading level={1}>Customer list support</Heading>
      <Text>Owner-adopted composition · awaiting formal publication</Text></header>
    <Text>Desktop ledger and narrow cards, pagination, loading / empty / error / denied / unavailable, confirmation actions and explicit product locale copy form one support contract. The formal catalogue remains 28 components and five built-in languages.</Text>
    <Text>Adoption: minutes:6f3e0a9a1e07e3980867d82e#D2. Source publication remains deferred under minutes:00710c786ec8423e5dce0186#D1-D2. Actual TMS integration and the new package candidate’s visual review remain pending.</Text>
    <a className="tcrn-link" href="/ai/4.0.0/pattern/customer-list-boundary.json">Read the adopted support contract and source</a>
    <a className="tcrn-link" href="/ai/4.0.0/pattern/product-locales.json">Read the product locale boundary</a>
  </section>,
};
