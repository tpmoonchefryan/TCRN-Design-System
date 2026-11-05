import type { ReactNode } from "react";
import {
  Button, Heading, Icon, Input, LinkButton, ProductLockup, Switch, TcrnBrandMark, Text,
  tcrnProductMarkIds, type IconName, type ShellThemeMode,
} from "@tcrn/ui-react/approved";
import type { DocsLocale } from "./approved-source.js";
import { docsCopy } from "./locales.js";
import { portalCopy } from "./portal-copy.js";
import type { docsNavigation } from "./portal-navigation.js";
import { ShellExample } from "./specimens.js";

const swatches = [
  { label: "acc", color: "var(--tcrn-color-acc)" },
  { label: "ink", color: "var(--tcrn-color-ink)" },
  { label: "paper", color: "var(--tcrn-color-panel)" },
] as const;

function SpecimenWindow({ caption, icon, children }: { caption?: string; icon?: IconName; children: ReactNode }) {
  return (
    <div className="portal-glimpse" inert aria-hidden="true">
      <div className="portal-glimpse__window">
        {caption && <div className="portal-glimpse__heading">{icon && <Icon name={icon} size="sm" />}{caption}</div>}
        {children}
      </div>
    </div>
  );
}

export function Portal({ locale, theme, navigation, search }: {
  locale: DocsLocale;
  theme: ShellThemeMode;
  navigation: ReturnType<typeof docsNavigation>;
  search: ReactNode;
}) {
  const labels = docsCopy(locale);
  const copy = portalCopy[locale];
  const specimens = {
    foundations: (
      <SpecimenWindow caption={copy.captions[0]} icon="book-open">
        <div className="portal-glimpse__inside portal-glimpse__foundations">
          <div>
            <Heading level={2}>{labels.project}</Heading>
            <Text>{labels.body}</Text>
            <div className="portal-glimpse__icons">
              <Icon name="book-open" /><Icon name="layers" /><Icon name="layout-grid" />
            </div>
          </div>
          <div className="portal-glimpse__swatches">
            {swatches.map(({ label, color }) => <span key={label}><i style={{ backgroundColor: color }} />{label}</span>)}
          </div>
        </div>
      </SpecimenWindow>
    ),
    brand: (
      <SpecimenWindow caption={copy.captions[1]} icon="layout-grid">
        <div className="portal-glimpse__brands">
          {tcrnProductMarkIds.map(productId => <ProductLockup key={productId} productId={productId} locale={locale} scale="rail" />)}
        </div>
      </SpecimenWindow>
    ),
    components: (
      <SpecimenWindow caption={copy.captions[2]} icon="check">
        <div className="portal-glimpse__inside portal-glimpse__form">
          <label className="tcrn-doc-label">{labels.name}<Input defaultValue={labels.project} readOnly /></label>
          <div className="portal-glimpse__buttons">
            <Button variant="primary">{labels.save}</Button>
            <Button variant="quiet">{labels.cancel}</Button>
          </div>
          <div className="portal-glimpse__switch"><Switch label={labels.notify} className="tcrn-switch--sm" defaultChecked /></div>
        </div>
      </SpecimenWindow>
    ),
    shell: (
      <SpecimenWindow>
        <ShellExample locale={locale} mode="band" theme={theme} glimpse />
      </SpecimenWindow>
    ),
  };

  return (
    <div className="docs-frame">
      <section className="portal-hero">
        <div>
          <span className="portal-kicker">TCRN DESIGN SYSTEM</span>
          <h1>{copy.title[0]}<br />{copy.title[1]}</h1>
          <p>{copy.lead}</p>
          <div className="portal-hero__actions">
            <LinkButton variant="primary" size="lg" href="#standards">{copy.browse}<Icon name="arrow-right" /></LinkButton>
            {search}
          </div>
        </div>
        <div className="portal-hero-art" inert aria-hidden="true">
          <div className="portal-hero-art__sheet">
            <TcrnBrandMark productId="design-system" data-logo="ds" />
            <span>TCRN Design System</span>
          </div>
          <div className="portal-hero-art__example">
            <div className="portal-hero-art__palette">
              {swatches.map(({ label, color }) => <span key={label} style={{ backgroundColor: color }} />)}
            </div>
            <Switch label={labels.notify} className="tcrn-switch--sm" defaultChecked />
            <Button variant="primary">{labels.save}</Button>
          </div>
        </div>
      </section>
      <section className="portal-cards" id="standards" aria-label={copy.browse}>
        {navigation.cards.map(card => (
          <article className="portal-card" key={card.topic} data-portal-card={card.topic}>
            {specimens[card.topic]}
            <div className="portal-card__body">
              <h2>
                <a className="portal-card__primary" href={card.href}>{card.label}<Icon name="arrow-right" /></a>
              </h2>
              <p>{card.description}</p>
              <ul className="portal-card__chapters">
                {card.chapters.map(chapter => <li key={chapter.id}><a href={chapter.href}>{chapter.label}</a></li>)}
              </ul>
            </div>
          </article>
        ))}
      </section>
      <footer className="portal-footer">
        <span>{copy.footer}</span>
        <a className="tcrn-link" href={navigation.source.href}>{copy.source}<Icon name="arrow-right" size="sm" /></a>
      </footer>
    </div>
  );
}
