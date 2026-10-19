#!/usr/bin/env node
/**
 * Continental Media — generates 301-equivalent redirect stubs for the
 * old blog's URLs, from the backlog workbook's "Posts actuales" sheet
 * (see blog-backlog.mjs's `redirects`), at the exact legacy path each
 * one used to live at (e.g. public/2012/08/marketing-olfativo/index.html).
 *
 * GITHUB PAGES HAS NO SERVER-SIDE REDIRECT SUPPORT — there is no config
 * file or host setting that emits a real HTTP 301 from a static
 * deployment here. This generator's "redirect" is the realistic
 * equivalent: a tiny static page at the old URL with a canonical tag
 * pointing at the new one (for search engines), a 0-second meta
 * refresh (for browsers, including ones with JS disabled) and a
 * `location.replace()` JS fallback (so the back button doesn't return
 * to the stub), plus a visible manual link as the last-resort fallback
 * if both of those somehow fail. Flag this constraint to the user
 * directly — it is NOT a literal 301, just the closest a static host
 * can get.
 *
 * ACTIVATION: per the brief, each redirect must go live "el mismo día
 * en que se publique su artículo destino" — the backlog's own
 * `activateOn` column is always exactly that target's own scheduled
 * publish date (verified 1:1 against Backlog.fechaPublicacion), so the
 * simplest and most self-consistent way to honor that is to only
 * generate a stub once its target is actually published (found in
 * buildAllCards()). Since this generator runs as part of the same
 * blog:build pipeline that publishes an article, a redirect goes live
 * in the exact same build as its target — never earlier. Rows whose
 * decision is "Mantener (vigente)" (activateOn === null) are excluded
 * entirely: the backlog's own action for those is "Conservar URL y
 * enlazar con el tema destino" — keep the old URL working, don't
 * redirect it.
 *
 * Usage:
 *   node scripts/blog/generate-redirects.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

import { loadBacklog } from '../lib/blog-backlog.mjs';
import { buildAllCards, buildByIdMap, relForDepth } from '../lib/blog-cards.mjs';
import { escapeHtml } from '../lib/blog-html-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const PUBLIC_DIR = join(REPO_ROOT, 'public');
const SITE_URL = 'https://continentalmedia.com.mx';

function pathFromUrl(fromUrl) {
  const { pathname } = new URL(fromUrl);
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

function renderRedirectStub({ rel, relativeTarget, absoluteTarget, title }) {
  return `<!doctype html>
<html lang="es-MX">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <link rel="canonical" href="${absoluteTarget}" />
  <meta name="robots" content="noindex, follow" />
  <meta http-equiv="refresh" content="0; url=${relativeTarget}" />
  <script>location.replace(${JSON.stringify(relativeTarget)});</script>
</head>
<body>
  <p>Este contenido se movió. <a href="${relativeTarget}">Haz clic aquí si no eres redirigido automáticamente</a>.</p>
</body>
</html>
`;
}

export function generateRedirects() {
  const { redirects } = loadBacklog();
  const all = buildAllCards();
  const byId = buildByIdMap(all);

  const eligible = redirects.filter((r) => r.activateOn !== null);
  let written = 0;
  let pending = 0;

  for (const redirect of eligible) {
    const target = byId.get(redirect.targetId);
    if (!target) {
      pending++;
      continue;
    }

    const dirPath = pathFromUrl(redirect.fromUrl).replace(/^\/|\/$/g, '');
    const rel = relForDepth(dirPath);
    const relativeTarget = `${rel}blog/${target.post.slug}/`;
    const absoluteTarget = `${SITE_URL}/blog/${target.post.slug}/`;

    const html = renderRedirectStub({
      rel,
      relativeTarget,
      absoluteTarget,
      title: `Redirigiendo a ${target.post.title}…`,
    });

    const outDir = join(PUBLIC_DIR, dirPath);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), html, 'utf8');
    written++;
  }

  console.log(`Wrote ${written} redirect stub(s). ${pending} still pending (target not yet published).`);
}

// Runs standalone (`node scripts/blog/generate-redirects.mjs`) but is
// also imported and called directly by generate-blog.mjs's main(), so
// a blog build always activates any redirect whose target just
// published, without a separate command.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateRedirects();
}
