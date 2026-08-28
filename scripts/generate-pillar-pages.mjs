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
import { renderSiteHeader } from './lib/site-header-template.mjs';

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
  return renderSiteHeader(REL, { solid: true });
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

function renderExtraBlock(extra) {
  const subtitle = extra.subtitle
    ? `\n      <p class="cm-pillar-extra__subtitle">${escapeHtml(extra.subtitle)}</p>`
    : '';
  const platforms = extra.platforms
    .map(
      (platform) => `
        <li class="cm-pillar-extra__platform">
          <a
            class="cm-pillar-extra__platform-link"
            href="${escapeHtml(platform.href)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="cm-pillar-extra__platform-name">${escapeHtml(platform.name)}</span>
            <span class="cm-pillar-extra__platform-desc">${escapeHtml(platform.description)}</span>
            <span class="cm-pillar-extra__platform-cta"
              >Visitar sitio
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7M9 7h8v8" /></svg>
            </span>
          </a>
        </li>`
    )
    .join('');

  return `
  <div class="cm-pillar-extra">
    <div class="cm-pillar-extra__inner">
      <h2 class="cm-pillar-extra__title">${escapeHtml(extra.title)}</h2>${subtitle}
      <ul class="cm-pillar-extra__platforms">${platforms}
      </ul>
    </div>
  </div>
`;
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
  const extraBlock = pillar.extra ? renderExtraBlock(pillar.extra) : '';

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
