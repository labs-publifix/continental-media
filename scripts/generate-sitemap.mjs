#!/usr/bin/env node
/**
 * Continental Media — generates public/sitemap.xml.
 *
 * Data-driven from the same sources every page generator already reads
 * (CASE_STUDIES, PILLARS), plus the small fixed set of hand-authored
 * pages (home, nosotros, contacto, the proyectos index) — so a new case
 * study or pillar page is picked up automatically the next time this
 * runs, instead of needing its URL hand-added to a maintained list that
 * silently drifts out of date (exactly the kind of gap a real SEO audit
 * exists to catch).
 *
 * lastmod uses today's date for every URL — this project has no
 * per-page "last edited" timestamp to draw from (it's a static site, no
 * CMS/database), so a single run date is honest about what we actually
 * know, rather than fabricating individual dates. Re-run after adding a
 * new case study, pillar, or top-level page:
 *   node scripts/generate-sitemap.mjs
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { CASE_STUDIES } from './case-study-data.mjs';
import { PILLARS } from './pillar-data.mjs';
import { buildAllCards, outputDirFor, PAGE_SIZE } from './lib/blog-cards.mjs';
import { PILLARS as BLOG_PILLARS } from './lib/blog-pillars.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://continentalmedia.com.mx';

/** One entry per page a paginated route actually produces (page 1 at
 *  `basePath/`, the rest at `basePath/page/N/`) — same PAGE_SIZE /
 *  pagination math as generate-blog.mjs's writePaginatedRoute(), so
 *  this never lists a page that doesn't exist or misses one that does. */
function paginatedUrls(basePath, count, priority) {
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const urls = [];
  for (let p = 1; p <= totalPages; p++) {
    urls.push({
      path: p === 1 ? `${basePath}/` : `${basePath}/page/${p}/`,
      priority: p === 1 ? priority : '0.5',
      changefreq: 'weekly',
    });
  }
  return urls;
}

export function generateSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const blogCards = buildAllCards();
  const articulos = blogCards.filter((c) => c.tipo === 'Editorial');
  const guias = blogCards.filter((c) => c.tipo === 'Guía práctica');

  const blogUrls = [
    ...paginatedUrls('blog', blogCards.length, '0.9'),
    ...paginatedUrls('blog/articulos', articulos.length, '0.7'),
    ...paginatedUrls('blog/guias', guias.length, '0.7'),
    ...BLOG_PILLARS.flatMap((pillar) =>
      paginatedUrls(`blog/categoria/${pillar.slug}`, blogCards.filter((c) => c.card.pilarSlug === pillar.slug).length, '0.6')
    ),
    ...blogCards.map((c) => ({ path: `${outputDirFor(c.post)}/`, priority: '0.8', changefreq: 'monthly' })),
  ];

  const urls = [
    { path: '', priority: '1.0', changefreq: 'weekly' },
    { path: 'nosotros.html', priority: '0.7', changefreq: 'monthly' },
    { path: 'contacto.html', priority: '0.8', changefreq: 'monthly' },
    { path: 'proyectos/', priority: '0.9', changefreq: 'weekly' },
    ...CASE_STUDIES.map((c) => ({ path: `proyectos/${c.slug}/`, priority: '0.8', changefreq: 'monthly' })),
    ...PILLARS.map((p) => ({ path: `servicios/${p.slug}/`, priority: '0.8', changefreq: 'monthly' })),
    ...blogUrls,
  ];

  const body = urls
    .map(
      ({ path, priority, changefreq }) => `  <url>
    <loc>${SITE_URL}/${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

  const outPath = resolve(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(outPath, xml, 'utf8');
  console.log(`Wrote public/sitemap.xml (${urls.length} URLs)`);
}

// Runs standalone (`node scripts/generate-sitemap.mjs`) but is also
// imported and called directly by scripts/blog/generate-blog.mjs's
// main(), so a blog build always refreshes the sitemap's blog URLs
// without a separate command.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateSitemap();
}
