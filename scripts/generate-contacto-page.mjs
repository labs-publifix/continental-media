#!/usr/bin/env node
/**
 * Continental Media — generates public/contacto.html.
 *
 * A single standalone page (there is exactly one /contacto), built
 * through a small generator — like generate-projects-index.mjs — rather
 * than hand-authored, so the shared site-header/footer templates stay
 * the single source of truth for that markup instead of a third
 * hand-transcribed copy.
 *
 * CONTENT: reuses the Contacto block's own markup (public/blocks/contact/
 * — eyebrow, intro copy, the full form) verbatim, with four
 * page-specific adjustments: the heading is a real <h1> here (it's an
 * <h2> on the home page, subordinate to that page's own <h1>), and the
 * success-state heading is bumped from <h3> to <h2> to match (it sits
 * directly under the section's own heading with nothing between them —
 * home doesn't need this since its <h2>/<h3> pair was already correctly
 * one level apart); the
 * section carries the `cm-contact--page` modifier class for the extra
 * top padding a page's very-first section under the fixed site-header
 * needs (home's copy doesn't, since it's reached by scrolling past six
 * sections first) — see contact.css's own comment on that modifier; and
 * a short `.cm-contact__facts` list sits under the subtitle, page-only
 * (not added to the shared contact.html block, so home's version is
 * untouched) — the 6-field form makes the intro column's own content
 * much taller than its copy on home, where it's one of several sections
 * and the gap never gets this exposed. Every fact restates something
 * already established elsewhere on the site (the "<24h" response time
 * from this same subtitle, the three contact-method chips already in
 * the form below, the "México y Estados Unidos" reach from the footer's
 * own documented copy) — no new claims, no fabricated trust content
 * (address, office photos, etc.). The dedicated page's real value is
 * being independently indexable/shareable/linkable with its own meta
 * title+description and nothing else competing for attention, not a
 * rewrite of a form that already works.
 *
 * FLAT FILE, NOT A DIRECTORY: public/contacto.html (not
 * public/contacto/index.html) — matches nosotros.html's own flat-file
 * convention at the same depth, and resolves a pre-existing href
 * (evolution-timeline.html's own closing CTA already pointed at
 * "contacto.html" before this page existed).
 *
 * Re-run after editing this file or the shared contact block:
 *   node scripts/generate-contacto-page.mjs
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { renderSiteHeader } from './lib/site-header-template.mjs';
import { renderFooter } from './lib/footer-template.mjs';
import { renderOrganizationSchema } from './lib/seo-schema.mjs';
import { renderFavicons, renderSeoMeta } from './lib/seo-meta.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REL = '';
const TITLE = 'Contacto — Continental Media | Hablemos de tu marca';
const DESCRIPTION =
  'Escríbenos y cuéntanos qué necesita tu marca. Te contactamos en menos de 24 horas por WhatsApp, llamada o correo — agencia de marketing y RP potenciada por IA.';

function renderHead() {
  return `<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${TITLE}</title>
  <meta
    name="description"
    content="${DESCRIPTION}"
  />
  <meta name="theme-color" content="#0a0b0d" />

${renderFavicons(REL)}

${renderSeoMeta({ rel: REL, canonicalPath: 'contacto.html', title: TITLE, description: DESCRIPTION })}

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
    rel="stylesheet"
  />

  <link rel="stylesheet" href="${REL}assets/css/tokens.css" />
  <link rel="stylesheet" href="${REL}blocks/site-header/site-header.css" />
  <link rel="stylesheet" href="${REL}blocks/contact/contact.css" />
  <link rel="stylesheet" href="${REL}blocks/footer/footer.css" />

${renderOrganizationSchema(REL)}

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

function renderContact() {
  return `    <section id="contacto" class="cm-contact cm-contact--page" data-cm-contact aria-labelledby="cm-contact-heading">
      <noscript>
        <style>
          [data-cm-contact] [data-cm-contact-reveal] {
            opacity: 1 !important;
            transform: none !important;
          }
        </style>
      </noscript>

      <div class="cm-contact__inner">
        <div class="cm-contact__intro" data-cm-contact-reveal>
          <span class="cm-contact__eyebrow">Contacto</span>
          <h1 class="cm-contact__title" id="cm-contact-heading">Hablemos de lo que tu marca necesita.</h1>
          <p class="cm-contact__subtitle">Cuéntanos qué necesitas — te contactamos en menos de 24 horas.</p>

          <ul class="cm-contact__facts">
            <li>
              <span class="cm-contact__facts-label">Tiempo de respuesta</span>
              <span class="cm-contact__facts-value">Menos de 24 horas</span>
            </li>
            <li>
              <span class="cm-contact__facts-label">Medios de contacto</span>
              <span class="cm-contact__facts-value">WhatsApp, llamada o correo</span>
            </li>
            <li>
              <span class="cm-contact__facts-label">Cobertura</span>
              <span class="cm-contact__facts-value">México y Estados Unidos</span>
            </li>
          </ul>
        </div>

        <div class="cm-contact__panel" data-cm-contact-reveal>
          <form class="cm-contact__form" data-cm-contact-form novalidate>
            <div class="cm-contact__summary" data-cm-contact-summary role="alert" tabindex="-1" hidden>
              <p class="cm-contact__summary-title">Revisa los campos marcados antes de continuar.</p>
              <ul class="cm-contact__summary-list" data-cm-contact-summary-list></ul>
            </div>

            <div class="cm-contact__field">
              <label class="cm-contact__label" for="contact-name">Nombre</label>
              <input
                class="cm-contact__input"
                type="text"
                id="contact-name"
                name="name"
                autocomplete="name"
                required
                aria-describedby="contact-name-error"
              />
              <p class="cm-contact__error" id="contact-name-error" data-cm-contact-error hidden></p>
            </div>

            <div class="cm-contact__field">
              <label class="cm-contact__label" for="contact-email">Correo electrónico</label>
              <input
                class="cm-contact__input"
                type="email"
                id="contact-email"
                name="email"
                autocomplete="email"
                required
                aria-describedby="contact-email-error"
              />
              <p class="cm-contact__error" id="contact-email-error" data-cm-contact-error hidden></p>
            </div>

            <div class="cm-contact__field">
              <label class="cm-contact__label" for="contact-company">Empresa <span class="cm-contact__label-optional">(opcional)</span></label>
              <input class="cm-contact__input" type="text" id="contact-company" name="company" autocomplete="organization" />
            </div>

            <div class="cm-contact__field">
              <label class="cm-contact__label" for="contact-message">¿Qué necesitas?</label>
              <textarea
                class="cm-contact__input cm-contact__textarea"
                id="contact-message"
                name="message"
                rows="5"
                required
                placeholder="Cuéntanos sobre tu marca y qué te gustaría lograr"
                aria-describedby="contact-message-error"
              ></textarea>
              <p class="cm-contact__error" id="contact-message-error" data-cm-contact-error hidden></p>
            </div>

            <fieldset class="cm-contact__field cm-contact__method" aria-describedby="contact-method-error">
              <legend class="cm-contact__label">Medio de contacto preferido</legend>
              <div class="cm-contact__chip-group" data-cm-contact-method-group>
                <label class="cm-contact__chip">
                  <input class="cm-contact__chip-input" type="radio" name="contact-method" value="whatsapp" />
                  <span class="cm-contact__chip-text">WhatsApp</span>
                </label>
                <label class="cm-contact__chip">
                  <input class="cm-contact__chip-input" type="radio" name="contact-method" value="llamada" />
                  <span class="cm-contact__chip-text">Llamada</span>
                </label>
                <label class="cm-contact__chip">
                  <input class="cm-contact__chip-input" type="radio" name="contact-method" value="correo" />
                  <span class="cm-contact__chip-text">Correo</span>
                </label>
              </div>
              <p class="cm-contact__error" id="contact-method-error" data-cm-contact-error hidden></p>
            </fieldset>

            <button class="cm-contact__submit" type="submit" data-cm-contact-submit>
              <span data-cm-contact-submit-label>Enviar mensaje</span>
            </button>
          </form>

          <div class="cm-contact__success" data-cm-contact-success role="status" tabindex="-1" hidden>
            <svg class="cm-contact__success-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="9" />
              <path d="M8 12.5l2.5 2.5L16 9.5" />
            </svg>
            <h2 class="cm-contact__success-title">¡Mensaje enviado!</h2>
            <p class="cm-contact__success-text">Gracias por escribirnos. Te contactamos en menos de 24 horas.</p>
          </div>
        </div>
      </div>
    </section>`;
}

function renderPage() {
  return `<!doctype html>
<html lang="es">
${renderHead()}
<body>
${renderSiteHeader(REL, { solid: true })}

  <main id="main-content" tabindex="-1">
${renderContact()}
  </main>

${renderFooter(REL, { showCta: false })}

  <script type="module" src="${REL}blocks/site-header/site-header.js"></script>
  <script type="module" src="${REL}blocks/contact/contact.js"></script>
</body>
</html>
`;
}

const outPath = resolve(__dirname, '..', 'public', 'contacto.html');
writeFileSync(outPath, renderPage(), 'utf8');
console.log('Wrote public/contacto.html');
