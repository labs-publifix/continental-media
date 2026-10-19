#!/usr/bin/env node
/**
 * Continental Media — blog build entry point (`npm run blog:build`).
 *
 * Builds incrementally as the blog system comes together — see the
 * task list in the session this was built from. Currently implemented:
 *   - the index routes (/blog/, /blog/articulos/, /blog/guias/,
 *     /blog/categoria/<pilar>/, and every /page/N/ variant of each).
 *   - individual article/guide pages at /blog/<slug>/, with full SEO
 *     (BlogPosting/BreadcrumbList/FAQPage schema, OG/Twitter meta).
 * Still to come (each will be added as its own step in main(), reusing
 * the same loadPosts()/pillar/author data this file already loads):
 *   - per-article OG images, PDF guides (image/href currently point at
 *     the path they'll occupy once generated; both 404 until then)
 *   - the home page teaser, sitemap.xml, RSS feed, 301 redirect stubs
 *   - retroactive cross-linking from already-published articles into a
 *     newly published one (task #21 — this file only resolves a NEW
 *     article's OWN cruces into already-published targets; it doesn't
 *     yet rewrite older articles to link back)
 *
 * Usage:
 *   node scripts/blog/generate-blog.mjs
 */
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

import { extractToc } from '../lib/blog-content.mjs';
import { PILLARS, SERVICIO_NAMES } from '../lib/blog-pillars.mjs';
import { formatDateEs, tipoLabels } from '../lib/blog-format.mjs';
import { relForDepth, buildAllCards, buildByIdMap, withRel, PAGE_SIZE } from '../lib/blog-cards.mjs';
import { renderBlogIndexSection } from '../lib/blog-index-template.mjs';
import { renderBlogArticleSection } from '../lib/blog-article-template.mjs';
import { renderBlogTeaserSection } from '../lib/blog-teaser-template.mjs';
import { generateSitemap } from '../generate-sitemap.mjs';
import { generateRss } from './generate-rss.mjs';
import { generateRedirects } from './generate-redirects.mjs';
import { renderSiteHeader } from '../lib/site-header-template.mjs';
import { renderFooter } from '../lib/footer-template.mjs';
import { renderOrganizationSchema } from '../lib/seo-schema.mjs';
import {
  renderBlogCollectionPageSchema,
  renderBlogPostingSchema,
  renderBreadcrumbListSchema,
  renderFaqPageSchema,
} from '../lib/blog-schema.mjs';
import { renderFavicons, renderSeoMeta } from '../lib/seo-meta.mjs';
import { escapeHtml } from '../lib/blog-html-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const PUBLIC_DIR = join(REPO_ROOT, 'public');
const RELATED_COUNT = 3;

function renderIndexPage({ dirPath, basePath, cards, pageNum, totalPages, typeFilter, pillarFilter, title, description, featuredFirst }) {
  const rel = relForDepth(dirPath);
  const viewCards = cards.map((c, i) => withRel(c.card, rel, featuredFirst && pageNum === 1 && i === 0));

  const canonicalPath = `${dirPath}/`;
  const fullTitle = pageNum === 1 ? title : `${title} | Página ${pageNum}`;

  const section = renderBlogIndexSection({
    rel,
    cards: viewCards,
    typeFilter,
    pillarFilter,
    pageNum,
    totalPages,
    paginationBasePath: `${basePath}/`,
  });

  const schemaItems = cards.map((c) => ({ url: `blog/${c.post.slug}/`, name: c.post.title }));

  const head = `<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="theme-color" content="#0a0b0d" />
  <link rel="alternate" type="application/rss+xml" title="Blog de Continental Media" href="${rel}blog/rss.xml" />

${renderFavicons(rel)}

${renderSeoMeta({ rel, canonicalPath, title: escapeHtml(fullTitle), description: escapeHtml(description) })}

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
    rel="stylesheet"
  />

  <link rel="stylesheet" href="${rel}assets/css/tokens.css" />
  <link rel="stylesheet" href="${rel}blocks/site-header/site-header.css" />
  <link rel="stylesheet" href="${rel}blocks/blog-card/blog-card.css" />
  <link rel="stylesheet" href="${rel}blocks/blog-index/blog-index.css" />
  <link rel="stylesheet" href="${rel}blocks/footer/footer.css" />

${renderOrganizationSchema(rel)}
${renderBlogCollectionPageSchema({ canonicalPath, name: fullTitle, description, items: schemaItems })}

  <style>
    * { box-sizing: border-box; }
    html { color-scheme: dark; }
    body {
      margin: 0;
      background: var(--cm-color-bg);
      font-family: var(--cm-font-body);
    }
  </style>
</head>`;

  return `<!doctype html>
<html lang="es-MX">
${head}
<body>
${renderSiteHeader(rel, { solid: true })}

  <main id="main-content" tabindex="-1">
${section}
  </main>

${renderFooter(rel)}

  <script type="module" src="${rel}blocks/site-header/site-header.js"></script>
  <script type="module" src="${rel}blocks/blog-index/blog-index.js"></script>
</body>
</html>
`;
}

/**
 * Internal cross-link engine for the "Te puede interesar" rail — this
 * IS the backlog's Cruces wiring, per the brief: "enlazado interno
 * usando los Cruces del backlog (solo a artículos ya publicados, y al
 * publicar uno nuevo, agregar enlaces retroactivos desde artículos ya
 * publicados que lo referencian)".
 *
 * Priority order:
 *   1. OUTGOING — posts this article's own `cruces` front matter lists,
 *      already published (an unpublished cruce target is silently
 *      skipped, never a broken link).
 *   2. INCOMING ("retroactive") — already-published posts whose OWN
 *      `cruces` list THIS post. Never requires editing that older
 *      post's file: since generate-blog.mjs regenerates every article
 *      page on every run, the older post's rail picks up the new
 *      cross-link automatically the next time the build runs — the
 *      "retroactive" link appears without any retroactive file edit.
 *   3. Same pillar (newest first), then anything else (newest first),
 *      backfilled only if 1-2 don't fill RELATED_COUNT slots.
 * Never empty unless this is the only published post.
 */
function pickRelated(entry, all) {
  const others = all.filter((e) => e.post.slug !== entry.post.slug);
  const myCruces = new Set(entry.post.cruces || []);

  const outgoing = others.filter((e) => myCruces.has(e.post.id));
  const outgoingSlugs = new Set(outgoing.map((e) => e.post.slug));
  const incoming = others.filter(
    (e) => !outgoingSlugs.has(e.post.slug) && (e.post.cruces || []).includes(entry.post.id)
  );
  const crossLinked = [...outgoing, ...incoming];
  const crossLinkedSlugs = new Set(crossLinked.map((e) => e.post.slug));

  const remaining = others.filter((e) => !crossLinkedSlugs.has(e.post.slug));
  const samePillar = remaining.filter((e) => e.pillar.slug === entry.pillar.slug);
  const rest = remaining.filter((e) => e.pillar.slug !== entry.pillar.slug);

  return [...crossLinked, ...samePillar, ...rest].slice(0, RELATED_COUNT);
}

/** First cruce (backlog ID) that resolves to an already-published guide
 *  with a PDF — becomes the "Llévate la guía en PDF, gratis" promo. */
function pickPdfPromo(entry, byId) {
  for (const crossId of entry.post.cruces || []) {
    const target = byId.get(crossId);
    if (target && target.post.tipo === 'Guía práctica' && target.post.pdf) {
      return target;
    }
  }
  return null;
}

function renderArticlePage(entry, all, byId) {
  const { post, pillar, author } = entry;
  const dirPath = `blog/${post.slug}`;
  const rel = relForDepth(dirPath);
  const { isGuia } = tipoLabels(post.tipo);

  const canonicalPath = `${dirPath}/`;
  const fullTitle = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;

  const pdfView = post.pdf
    ? {
        title: post.pdf.title || post.title,
        meta: `PDF · ${post.pdf.pageCount} página${post.pdf.pageCount === 1 ? '' : 's'}`,
        href: `${rel}assets/pdfs/blog/${post.slug}.pdf`,
      }
    : null;

  const promoTarget = pickPdfPromo(entry, byId);
  const promoView = promoTarget
    ? {
        bg: promoTarget.pillar.bg,
        fg: promoTarget.pillar.fg,
        title: promoTarget.post.title,
        href: `${rel}blog/${promoTarget.post.slug}/`,
      }
    : null;

  const servicioSlug = post.servicio || pillar.servicioSlug;
  const servicioNombre = SERVICIO_NAMES[servicioSlug] || servicioSlug;

  const related = pickRelated(entry, all).map((e, i) => withRel(e.card, rel, false));

  const section = renderBlogArticleSection({
    rel,
    breadcrumbs: [
      { name: 'Blog', href: `${rel}blog/` },
      { name: pillar.nombre, href: `${rel}blog/categoria/${pillar.slug}/` },
      { name: post.title },
    ],
    isGuide: isGuia,
    badgeBg: pillar.bg,
    badgeFg: pillar.fg,
    title: post.title,
    subtitle: post.excerpt,
    authorName: author.nombre,
    authorRole: author.rol,
    authorAvatar: `${rel}${author.avatar}`,
    publishLabel: formatDateEs(post.publishDate, { long: true }),
    updateLabel: formatDateEs(post.updateDate || post.publishDate, { long: true }),
    readingMin: post.readingMin,
    resumen: post.resumen || [],
    pdf: pdfView,
    toc: extractToc(post.html),
    bodyHtml: post.html,
    promo: promoView,
    faqs: post.faqs || [],
    serviceCta: {
      text: '¿Quieres que te ayudemos a implementarlo?',
      label: `Conoce ${servicioNombre}`,
      href: `${rel}servicios/${servicioSlug}/`,
    },
    author: {
      name: author.nombre,
      bio: author.bio,
      avatar: `${rel}${author.avatar}`,
      teamHref: `${rel}${author.teamUrl}`,
    },
    related,
  });

  const keywords = [post.primaryKeyword, ...(post.secondaryKeywords || [])].filter(Boolean);
  const ogImagePath = `assets/images/blog/og/${post.slug}.jpg`;

  const head = `<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="theme-color" content="#0a0b0d" />
  <link rel="alternate" type="application/rss+xml" title="Blog de Continental Media" href="${rel}blog/rss.xml" />

${renderFavicons(rel)}

${renderSeoMeta({ rel, canonicalPath, title: escapeHtml(fullTitle), description: escapeHtml(description), image: `${rel}${ogImagePath}` })}

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
    rel="stylesheet"
  />

  <link rel="stylesheet" href="${rel}assets/css/tokens.css" />
  <link rel="stylesheet" href="${rel}blocks/site-header/site-header.css" />
  <link rel="stylesheet" href="${rel}blocks/blog-card/blog-card.css" />
  <link rel="stylesheet" href="${rel}blocks/blog-article/blog-article.css" />
  <link rel="stylesheet" href="${rel}blocks/footer/footer.css" />

${renderOrganizationSchema(rel)}
${renderBreadcrumbListSchema([
    { name: 'Inicio', path: '' },
    { name: 'Blog', path: 'blog/' },
    { name: post.title, path: canonicalPath },
  ])}
${renderBlogPostingSchema({
    canonicalPath,
    headline: post.title,
    description,
    imageCanonicalPath: ogImagePath,
    author: { name: author.nombre, teamCanonicalPath: author.teamUrl },
    publishDate: post.publishDate,
    updateDate: post.updateDate || post.publishDate,
    pillarName: pillar.nombre,
    keywords,
    wordCount: post.wordCount,
  })}
${renderFaqPageSchema(post.faqs || [])}

  <style>
    * { box-sizing: border-box; }
    html { color-scheme: dark; }
    body {
      margin: 0;
      background: var(--cm-color-bg);
      font-family: var(--cm-font-body);
    }
  </style>
</head>`;

  return `<!doctype html>
<html lang="es-MX">
${head}
<body>
${renderSiteHeader(rel, { solid: true })}

  <main id="main-content" tabindex="-1">
${section}
  </main>

${renderFooter(rel)}

  <script type="module" src="${rel}blocks/site-header/site-header.js"></script>
  <script type="module" src="${rel}blocks/blog-article/blog-article.js"></script>
</body>
</html>
`;
}

function writePage(dirPath, html) {
  const dir = join(PUBLIC_DIR, dirPath);
  mkdirSync(dir, { recursive: true });
  const outPath = join(dir, 'index.html');
  writeFileSync(outPath, html, 'utf8');
  console.log('Wrote', join(dirPath, 'index.html'));
}

/** Paginates `items` and writes one page per chunk under `basePath`
 *  (e.g. 'blog', 'blog/articulos', 'blog/categoria/ia-marketing'),
 *  page 1 at basePath/ and the rest at basePath/page/N/. */
function writePaginatedRoute({ basePath, items, typeFilter, pillarFilter, title, description, featuredFirst }) {
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const slice = items.slice((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE);
    const dirPath = pageNum === 1 ? basePath : `${basePath}/page/${pageNum}`;
    const html = renderIndexPage({
      dirPath,
      basePath,
      cards: slice,
      pageNum,
      totalPages,
      typeFilter,
      pillarFilter,
      title,
      description,
      featuredFirst,
    });
    writePage(dirPath, html);
  }
}

const HOME_PAGE_PATH = join(PUBLIC_DIR, 'index.html');
const TEASER_START = '<!-- ===== BLOG TEASER BLOCK (generated — see public/blocks/blog-teaser/ and scripts/blog/generate-blog.mjs; never hand-edit the span between these two comments) ===== -->';
const TEASER_END = '<!-- ===== /BLOG TEASER BLOCK ===== -->';
const TEASER_EMPTY_NOTE =
  '<!-- No posts published yet — generate-blog.mjs leaves this empty per the brief ("mientras ninguno esté publicado, no lo muestres"). -->';

/** Splices the 3 latest published posts into public/index.html, between
 *  the BLOG TEASER sentinel comments — see blog-teaser.html's FORM note
 *  for why this lives here instead of being hand-maintained. Per the
 *  brief, the section renders nothing at all (not an empty state) while
 *  zero posts are published. */
function injectHomeTeaser(all) {
  const html = readFileSync(HOME_PAGE_PATH, 'utf8');
  const startIdx = html.indexOf(TEASER_START);
  const endIdx = html.indexOf(TEASER_END);
  if (startIdx === -1 || endIdx === -1) {
    throw new Error('BLOG TEASER sentinel comments not found in public/index.html — was the markup moved or renamed?');
  }

  const latest = all.slice(0, 3).map((c) => withRel(c.card, '', false));
  const body = latest.length > 0 ? `\n    ${renderBlogTeaserSection(latest)}\n\n    ` : `\n    ${TEASER_EMPTY_NOTE}\n    `;

  const before = html.slice(0, startIdx + TEASER_START.length);
  const after = html.slice(endIdx);
  const next = `${before}${body}${after}`;

  if (next !== html) {
    writeFileSync(HOME_PAGE_PATH, next, 'utf8');
    console.log(`Updated index.html blog teaser (${latest.length} post(s))`);
  } else {
    console.log('index.html blog teaser already up to date');
  }
}

function main() {
  const all = buildAllCards();
  const byId = buildByIdMap(all);

  // /blog/<slug>/ — one page per published post.
  all.forEach((entry) => {
    const html = renderArticlePage(entry, all, byId);
    writePage(`blog/${entry.post.slug}`, html);
  });

  // /blog/ — everything, newest first, featured lead card on page 1.
  writePaginatedRoute({
    basePath: 'blog',
    items: all,
    typeFilter: 'all',
    pillarFilter: null,
    title: 'Blog — Continental Media | Marketing, contenido e IA',
    description:
      'Artículos y guías prácticas de Continental Media sobre marketing digital, contenido, redes sociales, relaciones públicas e inteligencia artificial.',
    featuredFirst: true,
  });

  // /blog/articulos/ — Editorial only.
  writePaginatedRoute({
    basePath: 'blog/articulos',
    items: all.filter((c) => c.tipo === 'Editorial'),
    typeFilter: 'articulo',
    pillarFilter: null,
    title: 'Artículos — Blog de Continental Media',
    description: 'Artículos de Continental Media sobre estrategia de marketing, contenido, redes sociales y más.',
  });

  // /blog/guias/ — Guía práctica only.
  writePaginatedRoute({
    basePath: 'blog/guias',
    items: all.filter((c) => c.tipo === 'Guía práctica'),
    typeFilter: 'guia',
    pillarFilter: null,
    title: 'Guías prácticas — Blog de Continental Media',
    description: 'Guías prácticas descargables de Continental Media, con plantillas y checklists listos para usar.',
  });

  // /blog/categoria/<pilar>/ — one per pillar.
  PILLARS.forEach((pillar) => {
    writePaginatedRoute({
      basePath: `blog/categoria/${pillar.slug}`,
      items: all.filter((c) => c.card.pilarSlug === pillar.slug),
      typeFilter: 'all',
      pillarFilter: pillar.slug,
      title: `${pillar.nombre} — Blog de Continental Media`,
      description: `Artículos y guías de Continental Media sobre ${pillar.nombre.toLowerCase()}.`,
    });
  });

  injectHomeTeaser(all);
  generateSitemap();
  generateRss();
  generateRedirects();

  console.log(`\n${all.length} published post(s).`);
}

main();
