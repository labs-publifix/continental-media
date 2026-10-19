/**
 * Continental Media — renders the blog article/guide section, mirroring
 * public/blocks/blog-article/blog-article.html exactly. One function
 * for both Editorial articles and Guía práctica guides — see that
 * file's header comment for what differs between them (pdf/promo are
 * simply omitted when null).
 */
import { escapeHtml } from './blog-html-utils.mjs';
import { renderBlogCardGrid } from './blog-card-template.mjs';

function renderBreadcrumbs(crumbs) {
  const items = crumbs
    .map((c, i) => {
      if (i === crumbs.length - 1) {
        return `          <li aria-current="page">${escapeHtml(c.name)}</li>`;
      }
      return `          <li><a href="${escapeHtml(c.href)}">${escapeHtml(c.name)}</a></li>`;
    })
    .join('\n');
  return `      <nav class="cm-blog-article__breadcrumbs" aria-label="Ruta de navegación">
        <ol>
${items}
        </ol>
      </nav>`;
}

function renderPdfCard(pdf) {
  if (!pdf) return '';
  return `
  <div class="cm-blog-article__pdf-card" data-cm-blog-article-reveal>
    <div class="cm-blog-article__pdf-card-text">
      <span class="cm-blog-article__pdf-card-eyebrow">Descarga incluida</span>
      <p class="cm-blog-article__pdf-card-title">${escapeHtml(pdf.title)}</p>
      <p class="cm-blog-article__pdf-card-meta">${escapeHtml(pdf.meta)}</p>
    </div>
    <a class="cm-blog-article__pdf-card-button" href="${escapeHtml(pdf.href)}" download>
      Descargar PDF
    </a>
  </div>`;
}

function renderToc(toc, pdf, isGuide) {
  const items = toc
    .map((h) => `          <li><a href="#${h.id}">${escapeHtml(h.text)}</a></li>`)
    .join('\n');
  const pdfLink = pdf
    ? `
        <a class="cm-blog-article__toc-pdf" href="${escapeHtml(pdf.href)}" download>
          Descargar PDF
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 4v12m0 0 4-4m-4 4-4-4M5 20h14" /></svg>
        </a>`
    : '';

  return `    <aside class="cm-blog-article__toc">
      <nav aria-label="${isGuide ? 'En esta guía' : 'En este artículo'}">
        <p class="cm-blog-article__toc-title">${isGuide ? 'En esta guía' : 'En este artículo'}</p>
        <ol class="cm-blog-article__toc-list">
${items}
        </ol>${pdfLink}
      </nav>
    </aside>`;
}

function renderPromo(promo) {
  if (!promo) return '';
  return `
      <div class="cm-blog-article__promo" style="--cm-blog-article-bg:${promo.bg};--cm-blog-article-fg:${promo.fg}">
        <p class="cm-blog-article__promo-eyebrow">Guía relacionada</p>
        <p class="cm-blog-article__promo-title">${escapeHtml(promo.title)}</p>
        <a class="cm-blog-article__promo-link" href="${escapeHtml(promo.href)}">
          Ver guía
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7M9 7h8v8" /></svg>
        </a>
      </div>`;
}

function renderFaqs(faqs) {
  if (!faqs || faqs.length === 0) return '';
  const items = faqs
    .map(
      (faq) => `        <details class="cm-blog-article__faq">
          <summary>${escapeHtml(faq.q)}</summary>
          <p>${escapeHtml(faq.a)}</p>
        </details>`
    )
    .join('\n');
  return `
      <section class="cm-blog-article__faqs" aria-labelledby="cm-blog-article-faqs-heading">
        <h2 id="cm-blog-article-faqs-heading">Preguntas frecuentes</h2>
${items}
      </section>`;
}

/** @param {object} view - see blog-article.html for the shape of every field. */
export function renderBlogArticleSection(view) {
  const badgeLabel = view.isGuide ? 'Guía' : 'Artículo';

  return `<article class="cm-blog-article" data-cm-blog-article>
  <noscript>
    <style>
      [data-cm-blog-article] [data-cm-blog-article-reveal] {
        opacity: 1 !important;
        transform: none !important;
      }
    </style>
  </noscript>

  <header class="cm-blog-article__hero">
    <div class="cm-blog-article__hero-inner" data-cm-blog-article-reveal>
${renderBreadcrumbs(view.breadcrumbs)}

      <span class="cm-blog-article__badge" style="--cm-blog-article-bg:${view.badgeBg};--cm-blog-article-fg:${view.badgeFg}">${badgeLabel}</span>

      <h1 class="cm-blog-article__title">${escapeHtml(view.title)}</h1>
      <p class="cm-blog-article__subtitle">${escapeHtml(view.subtitle)}</p>

      <div class="cm-blog-article__byline">
        <img
          class="cm-blog-article__byline-avatar"
          src="${escapeHtml(view.authorAvatar)}"
          alt=""
          width="64"
          height="64"
          loading="eager"
          decoding="async"
        />
        <span class="cm-blog-article__byline-text">
          <span class="cm-blog-article__byline-name">${escapeHtml(view.authorName)}</span>
          <span class="cm-blog-article__byline-role">${escapeHtml(view.authorRole)}</span>
        </span>
      </div>

      <p class="cm-blog-article__dates">
        Publicado el ${escapeHtml(view.publishLabel)} · Actualizado el ${escapeHtml(view.updateLabel)} · ${view.readingMin} min de lectura
      </p>
    </div>
  </header>

  <div class="cm-blog-article__summary" data-cm-blog-article-reveal>
    <h2 class="cm-blog-article__summary-title">En pocas palabras</h2>
    <ul class="cm-blog-article__summary-list">
${view.resumen.map((item) => `      <li>${escapeHtml(item)}</li>`).join('\n')}
    </ul>
  </div>
${renderPdfCard(view.pdf)}

  <div class="cm-blog-article__layout">
${renderToc(view.toc, view.pdf, view.isGuide)}

    <div class="cm-blog-article__content">
      <div class="cm-blog-article__body">
${view.bodyHtml}
      </div>
${renderPromo(view.promo)}
${renderFaqs(view.faqs)}

      <div class="cm-blog-article__service-cta">
        <p class="cm-blog-article__service-cta-text">${escapeHtml(view.serviceCta.text)}</p>
        <a class="cm-blog-article__service-cta-link" href="${escapeHtml(view.serviceCta.href)}">
          ${escapeHtml(view.serviceCta.label)}
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7M9 7h8v8" /></svg>
        </a>
      </div>

      <div class="cm-blog-article__author-box">
        <img
          class="cm-blog-article__author-box-avatar"
          src="${escapeHtml(view.author.avatar)}"
          alt=""
          width="96"
          height="96"
          loading="lazy"
          decoding="async"
        />
        <div class="cm-blog-article__author-box-text">
          <p class="cm-blog-article__author-box-label">Escrito por</p>
          <p class="cm-blog-article__author-box-name">${escapeHtml(view.author.name)}</p>
          <p class="cm-blog-article__author-box-bio">${escapeHtml(view.author.bio)}</p>
          <a class="cm-blog-article__author-box-link" href="${escapeHtml(view.author.teamHref)}">Conoce al equipo</a>
        </div>
      </div>
    </div>
  </div>

  ${
    view.related.length > 0
      ? `<section class="cm-blog-article__related" aria-labelledby="cm-blog-article-related-heading">
    <div class="cm-blog-article__related-inner">
      <h2 class="cm-blog-article__related-title" id="cm-blog-article-related-heading">Te puede interesar</h2>
${renderBlogCardGrid(view.related)}
    </div>
  </section>`
      : ''
  }
</article>`;
}
