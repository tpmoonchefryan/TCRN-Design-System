function TcrnBrandMark() {
  return (
    <img
      className="tcrn-brand-mark"
      src="tcrn-brand-mark.svg"
      alt="TCRN brand mark"
      aria-label="TCRN brand mark"
      data-storybook-only="brand-mark-prototype"
      data-component-library-status="deferred"
    />
  );
}

function ProductLockup({ suffix, suffixClassName }: { suffix: string; suffixClassName?: string }) {
  const isLongSuffix = suffix.length > 8;
  const suffixClasses = ["tcrn-brand-wordmark__suffix", suffixClassName].filter(Boolean).join(" ");

  return (
    <div
      className={`tcrn-brand-lockup${isLongSuffix ? " tcrn-brand-lockup--long-name" : ""}`}
      data-storybook-only="brand-lockup-prototype"
      data-component-library-status="deferred"
    >
      <TcrnBrandMark />
      <span className="tcrn-brand-wordmark">
        <span className="tcrn-brand-wordmark__base">TCRN</span>
        <span className={suffixClasses}>{suffix}</span>
      </span>
    </div>
  );
}

function ShellBrandLockup({ suffix, caption, suffixClassName }: { suffix: string; caption: string; suffixClassName?: string }) {
  const suffixClasses = ["tcrn-brand-wordmark__suffix", suffixClassName].filter(Boolean).join(" ");

  return (
    <div
      className="tcrn-shell-brand-lockup"
      data-storybook-only="shell-brand-lockup-prototype"
      data-component-library-status="deferred"
    >
      <TcrnBrandMark />
      <span className="tcrn-shell-brand-lockup__copy">
        <span className="tcrn-brand-wordmark">
          <span className="tcrn-brand-wordmark__base">TCRN</span>
          <span className={suffixClasses}>{suffix}</span>
        </span>
        <span className="tcrn-shell-brand-lockup__caption">{caption}</span>
      </span>
    </div>
  );
}

export { ProductLockup, ShellBrandLockup, TcrnBrandMark };
