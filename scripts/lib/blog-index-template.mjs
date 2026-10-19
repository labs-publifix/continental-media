/**
 * Continental Media — renders the blog index section, mirroring
 * public/blocks/blog-index/blog-index.html exactly. One function
 * serves every route the generator produces: /blog/, /blog/articulos/,
 * /blog/guias/, /blog/categoria/<pilar>/, and each of their /page/N/
 * variants — the only things that change between them are which posts
 * are passed in, which filter chip is active, and the pagination base
 * path.
 */
import { escapeHtml } from './blog-html-utils.mjs';
import { renderBlogCardGrid } from './blog-card-template.mjs';
import { PILLARS } from './blog-pillars.mjs';

const TYPE_FILTERS = [
  { key: 'all', label: 'Todo', path: 'blog/' },
  { key: 'articulo', label: 'Artículos', path: 'blog/articulos/' },
  { key: 'guia', label: 'Guías', path: 'blog/guias/' },
];

function renderTypeFilters(rel, activeKey) {
  const chips = TYPE_FILTERS.map((f) => {
    const isActive = f.key === activeKey;
    return `      <a class="cm-blog-index-filters__chip${isActive ? ' is-active' : ''}" href="${rel}${f.path}"${isActive ? ' aria-current="page"' : ''}>${escapeHtml(f.label)}</a>`;
  }).join('\n');

  return `  <nav class="cm-blog-index-filters" aria-label="Filtrar por tipo" data-cm-blog-index-reveal>
    <div class="cm-blog-index-filters__inner">
${chips}
    </div>
  </nav>`;
}

function renderTopicFilters(rel, activePillarSlug) {
  const chips = PILLARS.map((p) => {
    const isActive = p.slug === activePillarSlug;
    return `      <a class="cm-blog-index-filters__chip${isActive ? ' is-active' : ''}" href="${rel}blog/categoria/${p.slug}/"${isActive ? ' aria-current="page"' : ''}>${escapeHtml(p.nombre)}</a>`;
  }).join('\n');

  return `  <nav class="cm-blog-index-filters cm-blog-index-filters--topics" aria-label="Filtrar por tema" data-cm-blog-index-reveal>
    <div class="cm-blog-index-filters__inner">
${chips}
    </div>
  </nav>`;
}

function renderPagination(rel, basePath, pageNum, totalPages) {
  if (totalPages <= 1) return '';

  const items = [];
  for (let p = 1; p <= totalPages; p++) {
    const href = p === 1 ? `${rel}${basePath}` : `${rel}${basePath}page/${p}/`;
    if (p === pageNum) {
      items.push(`      <li><span class="cm-blog-index-pagination__link is-current" aria-current="page">${p}</span></li>`);
    } else {
      items.push(`      <li><a class="cm-blog-index-pagination__link" href="${href}">${p}</a></li>`);
    }
  }

  const nextHref = pageNum < totalPages ? (pageNum + 1 === 1 ? `${rel}${basePath}` : `${rel}${basePath}page/${pageNum + 1}/`) : null;
  const more = nextHref
    ? `\n    <a class="cm-blog-index-pagination__more" href="${nextHref}">Más recursos</a>`
    : '';

  return `  <nav class="cm-blog-index-pagination" aria-label="Paginación" data-cm-blog-index-reveal>
    <ol class="cm-blog-index-pagination__list">
${items.join('\n')}
    </ol>${more}
  </nav>`;
}

function renderEmptyState() {
  return `  <div class="cm-blog-index-empty" data-cm-blog-index-reveal>
    <h2 class="cm-blog-index-empty__title">Estamos preparando el blog</h2>
    <p class="cm-blog-index-empty__text">
      Muy pronto vas a encontrar aquí artículos y guías prácticas sobre marketing digital,
      contenido, relaciones públicas e inteligencia artificial. Vuelve en unos días.
    </p>
  </div>`;
}

/**
 * @param {object} opts
 * @param {string} opts.rel - REL prefix back to public/ for this page.
 * @param {import('./blog-card-template.mjs').BlogCardView[]} opts.cards - already paginated/sliced.
 * @param {'all'|'articulo'|'guia'} opts.typeFilter - which type chip is active.
 * @param {string|null} opts.pillarFilter - active pillar slug, or null if none.
 * @param {number} opts.pageNum
 * @param {number} opts.totalPages
 * @param {string} opts.paginationBasePath - e.g. 'blog/', 'blog/guias/', 'blog/categoria/ia-marketing/'.
 */
export function renderBlogIndexSection(opts) {
  const { rel, cards, typeFilter, pillarFilter, pageNum, totalPages, paginationBasePath } = opts;
  const hasPosts = cards.length > 0;

  const body = hasPosts
    ? `  <div class="cm-blog-index-grid">\n${renderBlogCardGrid(cards)}\n  </div>\n\n${renderPagination(rel, paginationBasePath, pageNum, totalPages)}`
    : renderEmptyState();

  return `<section class="cm-blog-index" data-cm-blog-index aria-labelledby="cm-blog-index-heading">
  <noscript>
    <style>
      [data-cm-blog-index] [data-cm-blog-index-reveal] {
        opacity: 1 !important;
        transform: none !important;
      }
    </style>
  </noscript>

  <div class="cm-blog-index-hero">
    <div class="cm-blog-index-hero__inner" data-cm-blog-index-reveal>
      <span class="cm-blog-index-hero__eyebrow">Blog</span>
      <h1 class="cm-blog-index-hero__title" id="cm-blog-index-heading">
        Ideas y guías para hacer crecer tu marca.
      </h1>
      <p class="cm-blog-index-hero__subtitle">
        Estrategia, contenido, redes sociales, relaciones públicas e inteligencia artificial —
        explicado paso a paso, directo de nuestro equipo.
      </p>
    </div>
  </div>

${renderTypeFilters(rel, typeFilter)}

${renderTopicFilters(rel, pillarFilter)}

${body}
</section>`;
}
