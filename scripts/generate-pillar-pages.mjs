#!/usr/bin/env node
/**
 * Continental Media — service pillar page generator.
 *
 * Reads scripts/pillar-data.mjs (the single content source for all 5
 * service pillars) and renders each entry through ONE template function
 * into a real static HTML file at public/servicios/<slug>/index.html —
 * see public/blocks/pillar-page/pillar-page.html's header comment for
 * the full rationale (one reusable template + data, not 5 hand-
 * duplicated pages).
 *
 * Usage:  node scripts/generate-pillar-pages.mjs
 *
 * Output pages are two directories below public/ (public/servicios/
 * <slug>/index.html), so every asset/page reference in the template
 * uses the REL ('../../') prefix rather than a root-absolute path —
 * this project can deploy under a GitHub Pages project subpath, where a
 * leading "/" would silently 404 (see page-hero.html's own note on the
 * same constraint).
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { PILLARS } from './pillar-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const REL = '../../';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugify(str) {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritics left by NFD
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function renderHead(pillar) {
  return `<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(pillar.metaTitle)}</title>
  <meta name="description" content="${escapeHtml(pillar.metaDescription)}" />
  <meta name="theme-color" content="#0a0b0d" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
    rel="stylesheet"
  />

  <link rel="stylesheet" href="${REL}assets/css/tokens.css" />
  <link rel="stylesheet" href="${REL}blocks/site-header/site-header.css" />
  <link rel="stylesheet" href="${REL}blocks/pillar-page/pillar-page.css" />

  <style>
    /* Minimal page shell — not a design system, just enough to view
       these blocks in context. Same reset every page on the site uses. */
    * { box-sizing: border-box; }
    html { color-scheme: dark; }
    body {
      margin: 0;
      background: var(--cm-color-bg);
      font-family: var(--cm-font-body);
    }
  </style>
</head>`;
}

function renderHeader() {
  return `  <!-- ===== SITE HEADER BLOCK — see public/blocks/site-header/ for the canonical source ===== -->
  <!--
    CONTINENTAL MEDIA — SITE HEADER BLOCK (canonical source)
    THESIS: the menu must always be one tap away — extracted from the home
      hero (where it used to live as position:absolute, scrolling away with
      it) into its own page-agnostic, always-reachable component.
    OWN-WORLD: same near-black ground, same restrained blue accent, same
      Space Grotesk display / Inter body pairing as every other block on
      the site. The bar and the full-screen expandable menu are the exact
      same markup/behavior the home hero shipped with (numbered links,
      dividers, spotlight-dim-on-hover, social icons, hamburger-to-X morph)
      — only namespaced and relocated, not redesigned.
    FORM: position:fixed at all times (never absolute), so it survives
      scroll on every page. Two visual states, both driven by
      site-header.js:
        - Default (home, at the very top): transparent bar over the hero
          video, exactly as before.
        - .is-scrolled (added once scrollY passes a small threshold): the
          bar gets a solid/blurred dark background, tighter padding, and a
          smaller logo — added via a class, not a position:absolute ->
          fixed swap, so there is no layout jump at the transition.
        - .cm-site-header--solid (set in markup, not by scroll): interior
          pages without a hero video — like this one, which has no photo/
          video to sit transparently over — get the same solid/compact
          treatment permanently, from first paint, instead of starting
          transparent over a background that can't guarantee contrast.
    ACCESSIBILITY: the skip link targets #main-content (a landmark present
      on every page that uses this header), not a hero-specific heading id,
      so it works unmodified everywhere this block is used. Full-screen nav
      is a disclosure (not a modal): Escape closes it, background scroll is
      locked while open, first link receives focus on open, focus returns
      to the toggle on close. See site-header.js's own header comment for
      the rest.

    USAGE — canonical source for this block. To use it on a page:
      1. Link assets/css/tokens.css, then blocks/site-header/site-header.css.
      2. Copy the <header class="cm-site-header"> markup below as the very
         first element inside <body>, before any other section. Add the
         \`cm-site-header--solid\` modifier class for interior pages that
         don't have a full-bleed video/photo hero to overlay transparently.
      3. Load blocks/site-header/site-header.js as a module (drives the
         menu disclosure and the scroll-triggered .is-scrolled toggle).
    Asset paths are root-relative (no leading slash), matching every other
    block on the site.
  -->
  <header class="cm-site-header cm-site-header--solid" data-cm-site-header>
    <a class="cm-site-header__skip" href="#main-content">Saltar al contenido</a>

    <div class="cm-site-header__bar">
      <a class="cm-site-header__logo-link" href="${REL}index.html" aria-label="Continental Media — ir al inicio">
        <img
          class="cm-site-header__logo"
          src="${REL}assets/images/continental-media-logo-white.png"
          alt="Continental Media"
          width="380"
          height="151"
        />
      </a>

      <button
        type="button"
        class="cm-site-header__menu-toggle"
        data-cm-site-header-menu-toggle
        aria-expanded="false"
        aria-controls="cm-site-header-nav"
        aria-label="Abrir menú"
      >
        <span class="cm-site-header__menu-icon" aria-hidden="true">
          <span class="cm-site-header__menu-bar"></span>
          <span class="cm-site-header__menu-bar"></span>
          <span class="cm-site-header__menu-bar"></span>
        </span>
        <span class="cm-site-header__menu-label" data-cm-site-header-menu-label>Menú</span>
      </button>
    </div>

    <nav
      class="cm-site-header__nav"
      id="cm-site-header-nav"
      data-cm-site-header-nav
      aria-label="Menú principal"
      hidden
    >
      <div class="cm-site-header__nav-inner">
        <ol class="cm-site-header__nav-list">
          <li class="cm-site-header__nav-item">
            <a href="${REL}index.html#top">
              <span class="cm-site-header__nav-index">01</span>
              <span class="cm-site-header__nav-text">Inicio</span>
              <svg class="cm-site-header__nav-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
            </a>
          </li>
          <li class="cm-site-header__nav-item">
            <a href="${REL}nosotros.html">
              <span class="cm-site-header__nav-index">02</span>
              <span class="cm-site-header__nav-text">Nosotros</span>
              <svg class="cm-site-header__nav-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
            </a>
          </li>
          <li class="cm-site-header__nav-item">
            <a href="${REL}index.html#servicios">
              <span class="cm-site-header__nav-index">03</span>
              <span class="cm-site-header__nav-text">Servicios</span>
              <svg class="cm-site-header__nav-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
            </a>
          </li>
          <li class="cm-site-header__nav-item">
            <a href="${REL}index.html#portafolio">
              <span class="cm-site-header__nav-index">04</span>
              <span class="cm-site-header__nav-text">Portafolio</span>
              <svg class="cm-site-header__nav-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
            </a>
          </li>
          <li class="cm-site-header__nav-item">
            <a href="${REL}index.html#blog">
              <span class="cm-site-header__nav-index">05</span>
              <span class="cm-site-header__nav-text">Blog</span>
              <svg class="cm-site-header__nav-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
            </a>
          </li>
          <li class="cm-site-header__nav-item">
            <a href="${REL}index.html#contacto">
              <span class="cm-site-header__nav-index">06</span>
              <span class="cm-site-header__nav-text">Contacto</span>
              <svg class="cm-site-header__nav-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
            </a>
          </li>
        </ol>

        <div class="cm-site-header__nav-aside">
          <p class="cm-site-header__nav-tagline">
            La Inteligencia Artificial no reemplaza tu equipo, lo multiplica.
          </p>

          <div class="cm-site-header__nav-social">
            <span class="cm-site-header__nav-social-label">Síguenos</span>
            <ul class="cm-site-header__nav-social-list">
              <li>
                <a
                  href="https://www.facebook.com/ContinentalMkt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Continental Media en Facebook (abre en una pestaña nueva)"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M13.5 21v-7.2h2.1l.3-2.5h-2.4V9.6c0-.7.2-1.2 1.2-1.2h1.3V6.1c-.3 0-1.3-.1-2.1-.1-2.1 0-3.3 1.2-3.3 3.5v1.9H8.5v2.5h2.1V21" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/continental_mkt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Continental Media en Instagram (abre en una pestaña nueva)"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
                    <circle cx="12" cy="12" r="4.2" />
                    <circle class="cm-site-header__nav-social-dot" cx="16.9" cy="7.1" r="0.6" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/channel/UCcsRE-pEJrz0B2Ain6gqWow"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Continental Media en YouTube (abre en una pestaña nueva)"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
                    <path class="cm-site-header__nav-social-dot" d="M10.3 9.3 15.4 12 10.3 14.7Z" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://mx.linkedin.com/company/continentalmkt"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Continental Media en LinkedIn (abre en una pestaña nueva)"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
                    <circle class="cm-site-header__nav-social-dot" cx="7.7" cy="8.3" r="1" />
                    <path d="M7.7 11.2V17" />
                    <path d="M11.6 17v-3.6c0-1.3.8-2.1 1.9-2.1s1.8.8 1.8 2.1V17M11.6 17v-5.5" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          <p class="cm-site-header__nav-copyright">© 2026 Continental Media</p>
        </div>
      </div>
    </nav>
  </header>
  <!-- ===== /SITE HEADER BLOCK ===== -->`;
}

function renderRow(pillar, sub, index) {
  const order = String(index + 1).padStart(2, '0');
  const rowId = `${pillar.slug}-${slugify(sub.name)}`;
  const extra = sub.extra
    ? `
            <div class="cm-pillar-row__extra">
              <p class="cm-pillar-row__extra-label">${escapeHtml(sub.extra.label)}</p>
              <a
                class="cm-pillar-row__extra-link"
                href="${escapeHtml(sub.extra.ctaHref)}"
                target="_blank"
                rel="noopener noreferrer"
                >${escapeHtml(sub.extra.ctaText)}</a
              >
            </div>`
    : '';

  return `      <li class="cm-pillar-row" id="${rowId}" data-cm-pillar-row tabindex="0">
        <div class="cm-pillar-row__inner">
          <div class="cm-pillar-row__title-col">
            <span class="cm-pillar-row__index">${order}</span>
            <h2 class="cm-pillar-row__name">${escapeHtml(sub.name)}</h2>
          </div>
          <div class="cm-pillar-row__content-col">
            <p class="cm-pillar-row__description">
              ${escapeHtml(sub.description)}
            </p>${extra}
          </div>
        </div>
      </li>`;
}

function renderPillarSection(pillar) {
  const badge = pillar.badge
    ? `<span class="cm-pillar-hero__badge">${escapeHtml(pillar.badge)}</span>`
    : '';
  const intro = pillar.intro
    ? `\n      <p class="cm-pillar-hero__intro">${escapeHtml(pillar.intro)}</p>`
    : '';
  const rows = pillar.subservices
    .map((sub, index) => renderRow(pillar, sub, index))
    .join('\n');
  const extraBlock = pillar.extra
    ? `
  <div class="cm-pillar-extra">
    <div class="cm-pillar-extra__inner">
      <p class="cm-pillar-extra__label">${escapeHtml(pillar.extra.label)}</p>
      <a
        class="cm-pillar-extra__link"
        href="${escapeHtml(pillar.extra.ctaHref)}"
        target="_blank"
        rel="noopener noreferrer"
        >${escapeHtml(pillar.extra.ctaText)}</a
      >
    </div>
  </div>
`
    : '';

  return `    <!-- ===== PILLAR PAGE BLOCK — see public/blocks/pillar-page/ for the canonical source ===== -->
    <!--
      CONTINENTAL MEDIA — SERVICE PILLAR PAGE BLOCK (canonical source)
      This page is GENERATED — see public/blocks/pillar-page/pillar-page.html
      for the full direction-contract comment (THESIS/OWN-WORLD/FORM/
      ACCESSIBILITY/USAGE). Content lives in scripts/pillar-data.mjs;
      never hand-edit this file — edit the data and/or the block's CSS/JS,
      then re-run \`node scripts/generate-pillar-pages.mjs\`.
    -->
    <section class="cm-pillar" data-cm-pillar aria-labelledby="cm-pillar-heading">
      <noscript>
        <style>
          [data-cm-pillar] .cm-pillar-hero__eyebrow,
          [data-cm-pillar] .cm-pillar-hero__title,
          [data-cm-pillar] .cm-pillar-hero__intro,
          [data-cm-pillar] [data-cm-pillar-row] {
            opacity: 1 !important;
            transform: none !important;
          }
        </style>
      </noscript>

      <div class="cm-pillar-hero">
        <div class="cm-pillar-hero__inner">
          <span class="cm-pillar-hero__eyebrow">Nuestra expertise</span>
          <h1 class="cm-pillar-hero__title" id="cm-pillar-heading">${escapeHtml(pillar.name)}${badge}</h1>${intro}
        </div>
      </div>

      <div class="cm-pillar-rows">
        <ol class="cm-pillar-rows__list">
${rows}
        </ol>
      </div>
${extraBlock}
      <div class="cm-pillar-cta">
        <div class="cm-pillar-cta__inner">
          <h2 class="cm-pillar-cta__title">¿Listo para que logremos juntos tus objetivos?</h2>
          <div class="cm-pillar-cta__actions">
            <a class="cm-pillar-cta__button cm-pillar-cta__button--primary" href="${REL}index.html#contacto"
              >Contáctanos</a
            >
            <a class="cm-pillar-cta__button cm-pillar-cta__button--secondary" href="${REL}index.html#servicios"
              >Ver todos los servicios</a
            >
          </div>
        </div>
      </div>
    </section>
    <!-- ===== /PILLAR PAGE BLOCK ===== -->`;
}

function renderPage(pillar) {
  return `<!doctype html>
<html lang="es">
${renderHead(pillar)}
<body>
${renderHeader()}

  <main id="main-content" tabindex="-1">
${renderPillarSection(pillar)}
  </main>

  <script type="module" src="${REL}blocks/site-header/site-header.js"></script>
  <script type="module" src="${REL}blocks/pillar-page/pillar-page.js"></script>
</body>
</html>
`;
}

function main() {
  PILLARS.forEach((pillar) => {
    const dir = path.join(REPO_ROOT, 'public', 'servicios', pillar.slug);
    mkdirSync(dir, { recursive: true });
    const outPath = path.join(dir, 'index.html');
    writeFileSync(outPath, renderPage(pillar), 'utf8');
    console.log('Wrote', path.relative(REPO_ROOT, outPath));
  });
}

main();
