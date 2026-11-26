import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { TcrnLocale } from "@tcrn/ui-copy-state";
import { cx } from "../../utils.js";
import { Icon } from "../Icon/index.js";
import { ProductLockup, SkipLink, type TcrnProductMarkId } from "../Navigation/Navigation.js";
import { Divider } from "./Layout.js";

export interface PublicSiteNavLink {
  id: string;
  label: ReactNode;
  href: string;
  current?: boolean;
  external?: boolean;
  labelProps?: HTMLAttributes<HTMLSpanElement>;
}

export interface PublicSiteHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Registered product mark rendered inside the compact header lockup. */
  productId: TcrnProductMarkId;
  /** Locale forwarded to ProductLockup and semantic labels. */
  locale?: TcrnLocale | string;
  /** Destination for the brand home link. Defaults to "/". */
  homeHref?: string;
  /** Accessible label for the brand home link. */
  homeLabel?: string;
  /** Accessible label for the primary navigation landmark. */
  navLabel?: string;
  /** Primary navigation links displayed across the top strip. */
  navItems?: readonly PublicSiteNavLink[];
  /** Right-side utility controls slot (for example ShellLocaleMenu and ShellThemeToggle). */
  controls?: ReactNode;
  /** Optional skip-to-content link label rendered before the header strip. */
  skipLinkLabel?: ReactNode;
  /** Optional skip-to-content target anchor. Defaults to "#main". */
  skipLinkHref?: string;
  /** Optional attributes merged onto the brand link element. */
  brandLinkProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
  /** Optional attributes merged onto the primary navigation landmark. */
  navProps?: HTMLAttributes<HTMLElement>;
}

export function PublicSiteHeader({
  productId,
  locale,
  homeHref = "/",
  homeLabel,
  navLabel = "Primary",
  navItems = [],
  controls,
  skipLinkLabel,
  skipLinkHref = "#main",
  brandLinkProps,
  navProps,
  className,
  ...props
}: PublicSiteHeaderProps) {
  return (
    <>
      {skipLinkLabel ? <SkipLink href={skipLinkHref}>{skipLinkLabel}</SkipLink> : null}
      <header {...props} className={cx("tcrn-public-header", className)} data-public-site-header="true">
        <div className="tcrn-public-header__inner">
          <a
            {...brandLinkProps}
            href={homeHref}
            aria-label={brandLinkProps?.["aria-label"] ?? homeLabel}
            className={cx("tcrn-public-header__brand", brandLinkProps?.className)}
          >
            <ProductLockup productId={productId} locale={locale} firstLine="rail" />
          </a>
          {navItems.length > 0 ? (
            <nav
              {...navProps}
              aria-label={navProps?.["aria-label"] ?? navLabel}
              className={cx("tcrn-public-header__nav", navProps?.className)}
            >
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="tcrn-public-header__link"
                >
                  {item.labelProps ? <span {...item.labelProps}>{item.label}</span> : item.label}
                </a>
              ))}
            </nav>
          ) : null}
          {controls ? <div className="tcrn-public-header__controls">{controls}</div> : null}
        </div>
      </header>
    </>
  );
}

export interface PublicSiteFooterLink {
  id: string;
  label: ReactNode;
  href: string;
  external?: boolean;
  icon?: ReactNode;
  labelProps?: HTMLAttributes<HTMLSpanElement>;
}

export interface PublicSiteFooterProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Brand and copyright line rendered at the start of the footer bar. */
  copyright?: ReactNode;
  /** Horizontal wrapped navigation and compliance links. */
  links?: readonly PublicSiteFooterLink[];
  /** Accessible label for the footer navigation landmark. */
  navLabel?: string;
  /** Optional supplemental footer content. */
  children?: ReactNode;
}

export function PublicSiteFooter({
  copyright,
  links = [],
  navLabel = "Footer",
  children,
  className,
  ...props
}: PublicSiteFooterProps) {
  return (
    <footer {...props} className={cx("tcrn-public-footer", className)} data-public-site-footer="true">
      <div className="tcrn-public-footer__inner">
        {copyright ? <div className="tcrn-public-footer__meta">{copyright}</div> : null}
        {links.length > 0 ? (
          <nav className="tcrn-public-footer__links" aria-label={navLabel}>
            {links.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="tcrn-public-footer__link"
              >
                {item.icon}
                {item.labelProps ? <span {...item.labelProps}>{item.label}</span> : item.label}
              </a>
            ))}
          </nav>
        ) : null}
        {children ? <div className="tcrn-public-footer__extra">{children}</div> : null}
      </div>
    </footer>
  );
}

export type EditorialNoteTone = "accent" | "neutral";

export interface EditorialNoteProps extends HTMLAttributes<HTMLElement> {
  /** Left rule color tone: accent (default) or neutral hairline. */
  tone?: EditorialNoteTone;
}

export function EditorialNote({ tone = "accent", className, children, ...props }: EditorialNoteProps) {
  return (
    <aside
      {...props}
      className={cx("tcrn-editorial-note", `tcrn-editorial-note--${tone}`, className)}
      data-editorial-note={tone}
    >
      {children}
    </aside>
  );
}

export interface EditorialRelatedLink {
  id: string;
  label: ReactNode;
  href: string;
  external?: boolean;
  labelProps?: HTMLAttributes<HTMLSpanElement>;
}

export interface EditorialArticleProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Wrapping serif document title (36/40, weight 400). */
  title: ReactNode;
  /** Optional plain meta byline (for example effective date, operator, contact). */
  meta?: ReactNode;
  /** Optional lead summary paragraph displayed above the body divider. */
  lead?: ReactNode;
  /** Optional parent/home back link shown above the title. */
  backLink?: {
    label: ReactNode;
    href: string;
    labelProps?: HTMLAttributes<HTMLSpanElement>;
  };
  /** Optional related document links shown at the foot of the paper sheet. */
  relatedLinks?: readonly EditorialRelatedLink[];
  /** Accessible label for the related links navigation. */
  relatedLabel?: string;
  /** Optional attributes merged onto the wrapping h1 title element. */
  titleProps?: HTMLAttributes<HTMLHeadingElement>;
  /** Optional attributes merged onto the meta paragraph element. */
  metaProps?: HTMLAttributes<HTMLParagraphElement>;
  /** Optional attributes merged onto the lead paragraph element. */
  leadProps?: HTMLAttributes<HTMLParagraphElement>;
  /** Main article content (sections, paragraphs, lists, and EditorialNote blocks). */
  children: ReactNode;
}

export function EditorialArticle({
  title,
  meta,
  lead,
  backLink,
  relatedLinks = [],
  relatedLabel = "Related documents",
  titleProps,
  metaProps,
  leadProps,
  className,
  children,
  ...props
}: EditorialArticleProps) {
  return (
    <article {...props} className={cx("tcrn-editorial-article", className)} data-editorial-article="true">
      <header className="tcrn-editorial-article__header">
        {backLink ? (
          <a href={backLink.href} className="tcrn-editorial-article__back">
            <Icon name="arrow-left" size="sm" />
            {backLink.labelProps ? <span {...backLink.labelProps}>{backLink.label}</span> : backLink.label}
          </a>
        ) : null}
        <h1 {...titleProps} className={cx("tcrn-editorial-article__title", titleProps?.className)}>
          {title}
        </h1>
        {meta ? (
          <p {...metaProps} className={cx("tcrn-editorial-article__meta", metaProps?.className)}>
            {meta}
          </p>
        ) : null}
        {lead ? (
          <p {...leadProps} className={cx("tcrn-editorial-article__lead", leadProps?.className)}>
            {lead}
          </p>
        ) : null}
      </header>
      <Divider className="tcrn-editorial-article__divider" />
      <div className="tcrn-editorial-article__body">{children}</div>
      {relatedLinks.length > 0 ? (
        <>
          <Divider className="tcrn-editorial-article__divider" />
          <nav className="tcrn-editorial-article__related" aria-label={relatedLabel}>
            {relatedLinks.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="tcrn-editorial-article__related-link"
              >
                {item.labelProps ? <span {...item.labelProps}>{item.label}</span> : item.label}
                <Icon name={item.external ? "external-link" : "arrow-right"} size="sm" />
              </a>
            ))}
          </nav>
        </>
      ) : null}
    </article>
  );
}
