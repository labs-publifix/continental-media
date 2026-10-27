#!/usr/bin/env node
/**
 * Continental Media — generates public/404.html (LEEME §4). GitHub
 * Pages serves a file literally named 404.html at the published root
 * with a real HTTP 404 status for any unmatched path — no extra config
 * needed, see migracion/LEEME_transicion_seo.md.
 *
 * noindex, excluded from the sitemap (never referenced by
 * generate-sitemap.mjs). The "lo más reciente" rail is the 3 latest
 * published posts, regenerated here on every blog:build run so it
 * never goes stale — see generate-blog.mjs's main(), which calls this
 * after the rest of the blog build.
 *
 * Usage:
 *   node scripts/generate-404-page.mjs
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

import { buildAllCards, withRel } from './lib/blog-cards.mjs';
import { renderBlogCardGrid } from './lib/blog-card-template.mjs';
import { renderSiteHeader } from './lib/site-header-template.mjs';
import { renderFooter } from './lib/footer-template.mjs';
import { renderFavicons } from './lib/seo-meta.mjs';
import { renderOrganizationSchema } from './lib/seo-schema.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const OUT_PATH = join(REPO_ROOT, 'public', '404.html');

export function generate404Page() {
  const rel = ''; // 404.html lives at the site root

  const latest = buildAllCards()
    .slice(0, 3)
    .map((c) => withRel(c.card, rel, false));

  const recentSection = latest.length
    ? `
      <div class="cm-404__recent">
        <h2 class="cm-404__recent-title">Lo más reciente del blog</h2>
${renderBlogCardGrid(latest)}
      </div>`
    : '';

  const html = `<!doctype html>
<html lang="es-MX">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Página no encontrada (404) — Continental Media</title>
  <meta name="robots" content="noindex" />
  <meta name="theme-color" content="#0a0b0d" />

${renderFavicons(rel)}

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
    rel="stylesheet"
  />

  <link rel="stylesheet" href="${rel}assets/css/tokens.css" />
  <link rel="stylesheet" href="${rel}blocks/site-header/site-header.css" />
  <link rel="stylesheet" href="${rel}blocks/error-404/error-404.css" />
  <link rel="stylesheet" href="${rel}blocks/blog-card/blog-card.css" />
  <link rel="stylesheet" href="${rel}blocks/footer/footer.css" />

${renderOrganizationSchema(rel)}

  <style>
    * { box-sizing: border-box; }
    html { color-scheme: dark; }
    body {
      margin: 0;
      background: var(--cm-color-bg);
      color: var(--cm-color-fg);
      font-family: var(--cm-font-body);
    }
  </style>
</head>
<body>
${renderSiteHeader(rel, { solid: true })}

  <main id="main-content" tabindex="-1">
    <article class="cm-404">
      <header class="cm-404__hero">
        <div class="cm-404__inner">
          <span class="cm-404__eyebrow">Error 404</span>
          <h1 class="cm-404__title">Esta página ya no existe.</h1>
          <p class="cm-404__subtitle">
            El sitio de Continental Media se renovó por completo. Es probable que lo que
            buscabas ahora viva en otro lugar — aquí tienes los accesos directos más útiles.
          </p>

          <div class="cm-404__actions">
            <a class="cm-404__action cm-404__action--primary" href="${rel}index.html#servicios">Servicios</a>
            <a class="cm-404__action" href="${rel}proyectos/">Proyectos</a>
            <a class="cm-404__action" href="${rel}blog/">Blog</a>
            <a class="cm-404__action" href="${rel}index.html#contacto">Contacto</a>
            <a class="cm-404__action cm-404__action--whatsapp" href="https://wa.me/522292100926" target="_blank" rel="noopener">
              WhatsApp
            </a>
          </div>

          <div class="cm-404__suggestion" data-cm-404-suggestion hidden>
            <p class="cm-404__suggestion-label">Basado en lo que buscabas:</p>
            <a class="cm-404__suggestion-link" data-cm-404-suggestion-link href="${rel}blog/"></a>
          </div>
        </div>
      </header>
${recentSection}
    </article>
  </main>

${renderFooter(rel)}

  <script type="module" src="${rel}blocks/site-header/site-header.js"></script>
  <script src="${rel}blocks/error-404/error-404.js"></script>
</body>
</html>
`;

  writeFileSync(OUT_PATH, html, 'utf8');
  console.log('Wrote public/404.html');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generate404Page();
}
