// Only roles actually shown by the published boards: 02 text/list, 06 label/hint, 07 paper.
export const formalLayoutCss = `
:where([data-tcrn-root]){box-sizing:border-box;color:var(--tcrn-color-ink);font:400 13px/20px var(--tcrn-type-family-ui);font-variant-numeric:tabular-nums;background:var(--tcrn-color-bg)}
:where([data-tcrn-root]) *,:where([data-tcrn-root]) *:before,:where([data-tcrn-root]) *:after{box-sizing:border-box}
.tcrn-heading{min-width:0}
.tcrn-text--body{font-size:13px;line-height:20px}
.tcrn-highlight-text{font:inherit;letter-spacing:inherit;color:inherit}
.tcrn-sr-only,.tcrn-live-region{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.tcrn-product-shell{min-width:0;min-height:100vh;background:var(--tcrn-color-bg);color:var(--tcrn-color-ink);font:400 13px/20px var(--tcrn-type-family-ui)}

.tcrn-shell-grain{position:absolute;inset:0;width:100%;height:100%;opacity:var(--tcrn-texture-grain-opacity);mix-blend-mode:var(--tcrn-texture-grain-blend);pointer-events:none;z-index:0}
.tcrn-skip-link{position:absolute;left:12px;top:6px;padding:4px 10px;border-radius:8px;background:var(--tcrn-color-panel);color:var(--tcrn-color-ink);transform:translateY(-200%);z-index:4}
.tcrn-skip-link:focus{transform:none;box-shadow:var(--tcrn-focus-ring)}
.tcrn-shell-theme-toggle{position:relative;display:inline-grid;place-items:center}
.tcrn-shell-theme-toggle__icon{grid-area:1/1;display:flex;align-items:center;justify-content:center;transition:opacity var(--tcrn-motion-duration-move) var(--tcrn-motion-ease)}
.tcrn-shell-theme-toggle[data-current-theme="light"] [data-theme-icon="dark"],.tcrn-shell-theme-toggle[data-current-theme="dark"] [data-theme-icon="light"]{opacity:0}
.tcrn-shell-locale-menu{position:relative;min-width:0}
.tcrn-shell-locale-menu__trigger,.tcrn-shell-locale-menu__option{display:flex;align-items:center;gap:8px;height:32px;padding:0 10px;border:0;border-radius:8px;background:transparent;color:var(--tcrn-color-ink-2);font:500 12.5px/20px var(--tcrn-type-family-ui);cursor:pointer;white-space:nowrap}
.tcrn-shell-locale-menu__trigger:hover,.tcrn-shell-locale-menu__option:hover{background:var(--tcrn-color-hover);color:var(--tcrn-color-ink)}
.tcrn-shell-locale-menu__option[aria-checked="true"]{background:var(--tcrn-color-wash);color:var(--tcrn-color-ink);font-weight:600}
.tcrn-shell-locale-menu__panel{position:absolute;right:0;top:calc(100% + 6px);width:240px;padding:6px;background:var(--tcrn-color-panel);border-radius:12px;box-shadow:var(--tcrn-elevation-s3);display:flex;flex-direction:column;gap:2px;z-index:3}
.tcrn-page-header{display:flex;flex-direction:column;gap:10px;min-width:0}
.tcrn-page-header__body{display:flex;align-items:flex-end;gap:14px;min-width:0;border-bottom:1px solid var(--tcrn-color-line-2);padding-bottom:12px}
.tcrn-page-header__description{margin:0}
.tcrn-page-header__meta{padding-bottom:4px;flex:none;white-space:nowrap}
.tcrn-page-header__lead{flex:1;min-width:0}
.tcrn-page-header .tcrn-page-header__title{line-height:1.1;letter-spacing:-.005em}
.tcrn-page-header__content{flex:1;min-width:0}
.tcrn-page-header__actions{display:flex;align-items:center;gap:8px;flex:none}
.tcrn-breadcrumb{display:flex;align-items:center;gap:6px;min-width:0;color:var(--tcrn-color-ink-3);font-size:12px;white-space:nowrap}
.tcrn-breadcrumb ol{display:flex;align-items:center;gap:6px;min-width:0;margin:0;padding:0;list-style:none}
.tcrn-breadcrumb__separator{flex:none}
.tcrn-breadcrumb__item{display:inline-flex;align-items:center;gap:6px;min-width:0}
.tcrn-breadcrumb a{color:var(--tcrn-color-ink-2);text-decoration:none}
.tcrn-breadcrumb__crumb{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.tcrn-nav-group{display:flex;flex-direction:column;gap:2px;min-width:0}
.tcrn-nav-group__items{display:flex;flex-direction:column;gap:2px;min-width:0}
.tcrn-nav-group__label{display:grid;grid-template-columns:minmax(0,1fr) 24px;column-gap:10px;align-items:center;min-width:0;height:28px;padding:0 4px 0 8px;margin-top:6px;color:var(--tcrn-color-ink-3)}
.tcrn-nav-group__label-text{margin:0;font:500 10px/16px var(--tcrn-type-family-ui);letter-spacing:.14em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
/* 07 .ts-it paints once across the text and reserved pin slot. Its accessible
   package rendition uses sibling link/button nodes, so the wrapper owns that carrier. */
.tcrn-nav-item-row{--tcrn-pair-row-fill-d:transparent;--tcrn-pair-row-fill-h:var(--tcrn-color-hover);--tcrn-pair-row-fill-s:var(--tcrn-color-wash);--tcrn-pair-row-ink-d:var(--tcrn-color-ink-2);--tcrn-pair-row-ink-h:var(--tcrn-color-ink);--tcrn-pair-row-ink-s:var(--tcrn-color-ink);--tcrn-pair-row-fill:var(--tcrn-pair-row-fill-d);--tcrn-pair-row-ink:var(--tcrn-pair-row-ink-d);display:grid;grid-template-columns:minmax(0,1fr) 24px;align-items:center;column-gap:0;min-width:0;border-radius:8px;font-weight:500;color:var(--tcrn-pair-row-ink);background:var(--tcrn-pair-row-fill)}
.tcrn-nav-item{display:flex;align-items:center;gap:10px;min-width:0;height:var(--tcrn-shell-row-h);padding:0 4px 0 8px;border:0;border-radius:8px;background:transparent;color:inherit;text-decoration:none;text-align:left;font:500 12.5px/20px var(--tcrn-type-family-ui);white-space:nowrap}
.tcrn-nav-item__content,.tcrn-nav-item__label{display:inline-flex;align-items:center;gap:6px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tcrn-nav-item-row:where(:hover,:has(>.tcrn-nav-item[data-tcrn-preview-state~="hover"])){--tcrn-pair-row-fill:var(--tcrn-pair-row-fill-h);--tcrn-pair-row-ink:var(--tcrn-pair-row-ink-h)}
.tcrn-nav-item-row:where(:has(>[aria-current="page"]),:has(>[aria-expanded="true"])){--tcrn-pair-row-fill:var(--tcrn-pair-row-fill-s);--tcrn-pair-row-ink:var(--tcrn-pair-row-ink-s);font-weight:600}
.tcrn-nav-pin{display:inline-flex;align-items:center;justify-content:center;justify-self:end;width:24px;height:24px;padding:0;border:0;border-radius:6px;background:transparent;color:var(--tcrn-color-ink-3);opacity:0;cursor:pointer}
.tcrn-nav-pin>.tcrn-icon{width:16px;height:16px}
.tcrn-nav-item-row:hover .tcrn-nav-pin,.tcrn-nav-item-row:focus-within .tcrn-nav-pin,.tcrn-nav-group__label:hover .tcrn-nav-pin,.tcrn-nav-group__label:focus-within .tcrn-nav-pin,.tcrn-nav-pin[aria-pressed="true"],.tcrn-nav-pin:focus-visible{opacity:1}
.tcrn-nav-pin[aria-pressed="true"]{color:var(--tcrn-color-acc)}
.tcrn-nav-pin[aria-pressed="true"] .tcrn-icon>path:first-child{fill:currentColor}
.tcrn-nav-pin:hover{background:var(--tcrn-color-wash)}
/* 07a/07b: paper Tabs use a 1px ink underline; selected lists/table rows use wash. */
.tcrn-tabs{display:flex;flex-direction:column;gap:12px;min-width:0}
.tcrn-tabs--panel,.tcrn-tabs__panel{min-width:0}
.tcrn-tabs__list{display:flex;gap:18px;border-bottom:1px solid var(--tcrn-color-line);min-width:0}
.tcrn-tabs__tab{position:relative;display:inline-flex;align-items:center;gap:6px;padding:4px 0 9px;border:0;border-radius:0;background:transparent;color:var(--tcrn-color-ink-3);font:500 12.5px/20px var(--tcrn-type-family-ui);text-decoration:none;white-space:nowrap;cursor:pointer}
.tcrn-tabs__tab[aria-selected="true"],.tcrn-tabs__tab[aria-current="page"]{color:var(--tcrn-color-ink);font-weight:600}
.tcrn-tabs__tab[aria-selected="true"]:after,.tcrn-tabs__tab[aria-current="page"]:after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:1px;background:var(--tcrn-color-rule)}
.tcrn-tabs__label{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
`;

// Documentation is a 07 top-band shell; examples are package components, never copied Site runtime.
export const formalDocsCss = `
.tcrn-shell-menu .tcrn-nav-item-row>.tcrn-nav-item{background:transparent}
.tcrn-doc-content{width:min(100%,1040px);margin-inline:auto;display:flex;flex-direction:column;gap:22px;min-width:0}
.tcrn-doc-section{display:flex;flex-direction:column;gap:14px;min-width:0}
.tcrn-doc-themes{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:24px;align-items:start}
.tcrn-doc-pane{display:flex;flex-direction:column;gap:14px;min-width:0;padding:24px 28px 28px;border-radius:14px;background:var(--tcrn-color-bg);color:var(--tcrn-color-ink);box-shadow:var(--tcrn-elevation-s1)}
.tcrn-doc-paper{display:flex;flex-direction:column;gap:14px;min-width:0;padding:16px 18px;border-radius:var(--tcrn-radius-panel);background:var(--tcrn-color-panel);box-shadow:var(--tcrn-elevation-s1);--tcrn-color-surface:var(--tcrn-color-panel)}
.tcrn-doc-row{display:flex;align-items:center;gap:14px;flex-wrap:wrap;min-width:0}
.tcrn-doc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr));gap:14px 18px;min-width:0}
.tcrn-doc-label{display:flex;flex-direction:column;gap:5px;min-width:0;color:var(--tcrn-color-ink);font-size:12.5px;font-weight:500}
.tcrn-doc-hint{font-size:11.5px;line-height:16px;color:var(--tcrn-color-ink-3)}
.tcrn-doc-table{width:100%;table-layout:fixed;border-collapse:collapse;font-size:12.5px}
.tcrn-doc-table th{height:30px;text-align:left;padding:0 10px;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--tcrn-color-ink-3);font-weight:500;border-bottom:1px solid var(--tcrn-color-line-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tcrn-doc-table td{height:38px;padding:0 10px;border-bottom:1px solid var(--tcrn-color-line);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--tcrn-color-ink-2)}
.tcrn-doc-table tr[aria-selected="true"] td{background:var(--tcrn-color-wash);color:var(--tcrn-color-ink)}
.tcrn-doc-code{font:400 11.5px/16px var(--tcrn-type-family-mono);color:var(--tcrn-color-ink-2);overflow-wrap:anywhere}
.tcrn-doc-swatch{display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:middle;margin-right:6px;box-shadow:inset 0 0 0 1px var(--tcrn-color-line-2)}
.tcrn-doc-shell-frame{position:relative;min-width:0;height:640px;overflow:auto;background:var(--tcrn-color-bg);border-radius:14px;box-shadow:var(--tcrn-elevation-s1)}
/* Formal 07 .scr desktop scenes are1240 wide, with scrolling in the specimen host.
   The normal document content keeps its published1040 limit; phone scenes stay390. */
.tcrn-doc-shell-frame>.tcrn-product-shell{width:1240px;min-width:1240px;height:640px;min-height:0}
.tcrn-doc-shell-frame[data-phone]>.tcrn-product-shell{width:390px;min-width:390px}
.tcrn-doc-shell-frame[data-phone]{width:390px;max-width:100%}
.tcrn-doc-source{font:400 11px/16px var(--tcrn-type-family-mono);color:var(--tcrn-color-ink-3);overflow-wrap:anywhere}
 .tcrn-product-shell__paper{--tcrn-color-surface:var(--tcrn-color-panel)}
.tcrn-doc-roster-name{font-size:12.5px;line-height:1.2;font-weight:500;color:var(--tcrn-color-ink)}
.tcrn-doc-status{display:inline-flex;align-items:center;gap:7px;font-size:12px;color:var(--tcrn-color-ink-2);white-space:nowrap}
.tcrn-doc-status i{width:6px;height:6px;border-radius:50%;background:currentColor}
.tcrn-doc-status--ok{color:var(--tcrn-color-ok)}
.tcrn-doc-status--warn{color:var(--tcrn-color-warn)}
.tcrn-doc-handle{font-family:var(--tcrn-type-family-mono);font-size:11.5px;color:var(--tcrn-color-ink-3)}
.tcrn-doc-table .tcrn-doc-date{font-family:var(--tcrn-type-family-mono);font-size:11.5px}
.tcrn-doc-table th:last-child,.tcrn-doc-table td:last-child{text-align:right}
.tcrn-doc-roster-table{width:calc(100% + 16px);margin:0 -8px}
.tcrn-doc-roster-table th:first-child,.tcrn-doc-roster-table td:first-child{padding-left:8px}
.tcrn-doc-roster-table th:last-child,.tcrn-doc-roster-table td:last-child{padding-right:8px}
.tcrn-doc-shell-sub{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--tcrn-color-ink-3);font-weight:500;white-space:nowrap}
.tcrn-breadcrumb [aria-current="page"]{color:var(--tcrn-color-ink);font-weight:600}
.tcrn-doc-selected-row{display:flex;align-items:center;height:36px;padding:0 10px;background:var(--tcrn-color-wash);color:var(--tcrn-color-ink);font-weight:600;border-radius:6px}
.tcrn-doc-error{display:flex;align-items:center;gap:5px;font:400 11.5px/16px var(--tcrn-type-family-ui);color:var(--tcrn-color-bad)}
.tcrn-doc-intro-lockup>.tcrn-brand-mark{width:128px;height:128px}
.tcrn-doc-api pre{white-space:pre-wrap;max-width:100%;margin:0}
.tcrn-doc-api{display:grid;grid-template-columns:minmax(0,1fr);gap:8px;border-bottom:1px solid var(--tcrn-color-line);padding-block:12px}
`;
