#!/usr/bin/env node
/**
 * Continental Media — generates the 36 legacy-URL redirects from the
 * SEO migration's "lista corta" (migracion/redirects_lista_corta.csv —
 * see migracion/LEEME_transicion_seo.md). Replaces the old, much
 * broader scripts/blog/generate-redirects.mjs (deleted): this reduced
 * plan redirects only these 36 high-traffic legacy URLs; everything
 * else old (≈929 URLs) must 404 real — see public/404.html.
 *
 * HOSTING: GitHub Pages, decided (LEEME §3.7) — no server-side 301, so
 * the default/active output is a static HTML stub per route, at
 * <ruta>/index.html:
 *   - <meta http-equiv="refresh" content="0; url=DESTINO"> (0s — Google
 *     treats this as a permanent redirect)
 *   - <link rel="canonical" href="ABSOLUTE_DESTINO">
 *   - a visible link + a location.replace() JS fallback
 *   - NO noindex (unlike the old generator — these pages should pass
 *     their signal through, not be excluded)
 * Destinations are recomputed from LIVE data on every run (published
 * posts, pillar categories — see scripts/lib/migracion-redirects.mjs),
 * never trusted from the CSV's own snapshot text, so a redirect
 * upgrades itself (e.g. /blog/ -> the real article) automatically the
 * moment that article's status flips to Publicado — no separate
 * migration step, just run this (generate-blog.mjs already does, every
 * build) after publishing.
 *
 * DECOUPLED: the resolution step (scripts/lib/migracion-redirects.mjs)
 * is hosting-agnostic. This file's default output is the GH-Pages stub
 * adapter; two more adapters exist for whenever hosting changes:
 *   node scripts/migracion/generar-redirects.mjs --format=vercel
 *     -> vercel.json (redirects[], statusCode: 301) at the repo root
 *   node scripts/migracion/generar-redirects.mjs --format=redirects-file
 *     -> public/_redirects (Cloudflare Pages / Netlify style)
 * Neither is wired into the build; GitHub Pages is the decided host.
 *
 * Usage:
 *   node scripts/migracion/generar-redirects.mjs
 */
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

import { resolveAllRedirects, dirPathFromRuta, SITE_URL } from '../lib/migracion-redirects.mjs';
import { relForDepth } from '../lib/blog-cards.mjs';
import { escapeHtml } from '../lib/blog-html-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const PUBLIC_DIR = join(REPO_ROOT, 'public');

const formatArg = process.argv.find((a) => a.startsWith('--format='));
const format = formatArg ? formatArg.split('=')[1] : 'stubs';

function titleFor(resolved) {
  if (resolved.kind === 'article') return `Redirigiendo a ${resolved.title}…`;
  return 'Esta página se movió — Continental Media';
}

function renderStub({ relativeTarget, absoluteTarget, title }) {
  return `<!doctype html>
<html lang="es-MX">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <link rel="canonical" href="${absoluteTarget}" />
  <meta http-equiv="refresh" content="0; url=${relativeTarget}" />
  <script>location.replace(${JSON.stringify(relativeTarget)});</script>
</head>
<body>
  <p>Este contenido se movió. <a href="${relativeTarget}">Haz clic aquí si no eres redirigido automáticamente</a>.</p>
</body>
</html>
`;
}

function writeStubs(redirects) {
  let written = 0;
  for (const row of redirects) {
    if (row.resolved.conserved) continue; // handled by ruta_heredada, not a redirect
    const dirPath = dirPathFromRuta(row.ruta_origen);
    const rel = relForDepth(dirPath);
    const relativeTarget = row.resolved.path.startsWith('/') ? `${rel}${row.resolved.path.slice(1)}` : `${rel}${row.resolved.path}`;
    const absoluteTarget = `${SITE_URL}${row.resolved.path}`;

    const html = renderStub({ relativeTarget, absoluteTarget, title: titleFor(row.resolved) });
    const outDir = join(PUBLIC_DIR, dirPath);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), html, 'utf8');
    written++;
  }
  console.log(`Wrote ${written} redirect stub(s) (static HTML, GitHub Pages).`);
}

function writeVercelJson(redirects) {
  const rules = redirects
    .filter((r) => !r.resolved.conserved)
    .map((r) => ({ source: r.ruta_origen, destination: r.resolved.path, statusCode: 301 }));
  const outPath = join(REPO_ROOT, 'vercel.json');
  writeFileSync(outPath, `${JSON.stringify({ redirects: rules }, null, 2)}\n`, 'utf8');
  console.log(`Wrote vercel.json (${rules.length} rule(s)) — NOT wired into the build; GitHub Pages is the decided host.`);
}

function writeRedirectsFile(redirects) {
  const lines = redirects
    .filter((r) => !r.resolved.conserved)
    .map((r) => `${r.ruta_origen} ${r.resolved.path} 301`);
  const outPath = join(PUBLIC_DIR, '_redirects');
  writeFileSync(outPath, `${lines.join('\n')}\n`, 'utf8');
  console.log(`Wrote public/_redirects (${lines.length} rule(s)) — NOT wired into the build; GitHub Pages is the decided host.`);
}

export function generarRedirects() {
  const redirects = resolveAllRedirects();

  if (format === 'vercel') {
    writeVercelJson(redirects);
  } else if (format === 'redirects-file') {
    writeRedirectsFile(redirects);
  } else {
    writeStubs(redirects);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generarRedirects();
}
