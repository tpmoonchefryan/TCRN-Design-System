import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { BrandIcon } from "../Icon/BrandIcon.js";
import { ShellThemeToggle } from "../Navigation/Navigation.js";
import { tcrnComponentCss } from "../../styles/index.js";
import { EditorialArticle, EditorialNote, PublicSiteFooter, PublicSiteHeader } from "./PublicSite.js";

test("PublicSiteHeader renders ProductLockup, navigation aria-current, skip link, and controls", () => {
  const html = renderToStaticMarkup(
    <PublicSiteHeader
      productId="platform"
      locale="en"
      skipLinkLabel="Skip to content"
      navItems={[
        { id: "overview", label: "Overview", href: "/", current: true },
        { id: "privacy", label: "Privacy", href: "/privacy" },
        { id: "github", label: "GitHub", href: "https://github.com/example", external: true }
      ]}
      controls={<ShellThemeToggle currentTheme="light" onThemeChange={() => {}} locale="en" variant="quiet" />}
    />
  );
  assert.match(html, /class="tcrn-skip-link"/);
  assert.match(html, /data-public-site-header="true"/);
  assert.match(html, /data-product-mark="platform"/);
  assert.match(html, /aria-current="page"/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.match(html, /tcrn-public-header__controls/);
});

test("PublicSiteFooter renders copyright line and external brand icon links", () => {
  const html = renderToStaticMarkup(
    <PublicSiteFooter
      copyright="© 2026 TCRN Platform"
      links={[
        { id: "privacy", label: "Privacy Policy", href: "/privacy" },
        { id: "github", label: "GitHub", href: "https://github.com/example", external: true, icon: <BrandIcon name="github" size="sm" /> }
      ]}
    />
  );
  assert.match(html, /data-public-site-footer="true"/);
  assert.match(html, /© 2026 TCRN Platform/);
  assert.match(html, /data-brand-icon-name="github"/);
  assert.match(html, /target="_blank"/);
});

test("EditorialArticle and EditorialNote render wrapping headings, reading body, left-ruled callout, and related links", () => {
  const html = renderToStaticMarkup(
    <EditorialArticle
      title="Google API Services User Data Policy & Limited Use Compliance"
      meta="Effective 2026-11-25 · TCRN Platform"
      lead="How official hosted TCRN services handle identity verification and minimal account data."
      backLink={{ label: "Back to overview", href: "/" }}
      relatedLinks={[{ id: "terms", label: "Terms of Service", href: "/terms" }]}
    >
      <section>
        <h2>1. Scope of Hosted Services</h2>
        <p>Applies exclusively to official hosted deployments.</p>
        <EditorialNote>
          <strong>Zero built-in telemetry:</strong> open-source local tools make no outbound calls.
        </EditorialNote>
        <EditorialNote tone="neutral">Neutral archival note.</EditorialNote>
      </section>
    </EditorialArticle>
  );
  assert.match(html, /data-editorial-article="true"/);
  assert.match(html, /class="tcrn-editorial-article__title"/);
  assert.match(html, /data-editorial-note="accent"/);
  assert.match(html, /data-editorial-note="neutral"/);
  assert.match(html, /class="tcrn-editorial-article__related-link"/);
  assert.match(tcrnComponentCss, /\.tcrn-public-header\b/);
  assert.match(tcrnComponentCss, /\.tcrn-public-footer\b/);
  assert.match(tcrnComponentCss, /\.tcrn-editorial-article\b/);
  assert.match(tcrnComponentCss, /\.tcrn-editorial-note\b/);
  assert.match(tcrnComponentCss, /\.tcrn-brand-icon\b/);
});
