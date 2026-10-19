/**
 * Continental Media — renders one blog card <li>, mirroring
 * public/blocks/blog-card/blog-card.html exactly. Shared by the blog
 * index generator, the home page teaser generator and any "related
 * articles" rail — never hand-duplicate this markup in a generator.
 *
 * @typedef {object} BlogCardView
 * @property {string} href - link target, already REL-prefixed.
 * @property {string} tipo - 'Editorial' | 'Guía práctica'.
 * @property {string} pilarNombre - pillar display name (category line).
 * @property {string} bg - pillar bg hex (--cm-blog-card-bg).
 * @property {string} fg - pillar fg hex (--cm-blog-card-fg).
 * @property {number} number - consecutive card number (1-based).
 * @property {string} title
 * @property {string} excerpt
 * @property {string} authorName
 * @property {string} authorAvatar - REL-prefixed image src.
 * @property {string} dateLabel - already formatted (see blog-format.mjs formatDateEs).
 * @property {boolean} hasPdf - shows "Incluye PDF" instead of the reading-time badge.
 * @property {number} [readingMin] - required when hasPdf is false.
 * @property {boolean} [featured] - adds the featured/horizontal modifier.
 */
import { escapeHtml } from './blog-html-utils.mjs';
import { tipoLabels, padNumber } from './blog-format.mjs';

/** @param {BlogCardView} card */
export function renderBlogCard(card) {
  const { typeBadge, ctaText, kind } = tipoLabels(card.tipo);
  const metaBadge = card.hasPdf ? 'Incluye PDF' : `${card.readingMin} min de lectura`;
  const itemClass = card.featured ? 'cm-blog-card-item cm-blog-card-item--featured' : 'cm-blog-card-item';
  const cardClass = card.featured ? 'cm-blog-card cm-blog-card--featured' : 'cm-blog-card';
  const ariaLabel = `${ctaText}: ${card.title} — ${card.pilarNombre}`;

  return `  <li class="${itemClass}" data-cm-blog-card-kind="${kind}">
    <a
      class="${cardClass}"
      href="${escapeHtml(card.href)}"
      style="--cm-blog-card-bg:${card.bg};--cm-blog-card-fg:${card.fg}"
      aria-label="${escapeHtml(ariaLabel)}"
    >
      <span class="cm-blog-card__top">
        <span class="cm-blog-card__badge cm-blog-card__badge--type">${typeBadge}</span>
        <span class="cm-blog-card__badge cm-blog-card__badge--meta">${escapeHtml(metaBadge)}</span>
      </span>
      <span class="cm-blog-card__number">${padNumber(card.number)}</span>
      <span class="cm-blog-card__body">
        <span class="cm-blog-card__category">${escapeHtml(card.pilarNombre)}</span>
        <span class="cm-blog-card__title">${escapeHtml(card.title)}</span>
        <span class="cm-blog-card__excerpt">${escapeHtml(card.excerpt)}</span>
        <span class="cm-blog-card__footer">
          <span class="cm-blog-card__author">
            <img
              class="cm-blog-card__author-avatar"
              src="${escapeHtml(card.authorAvatar)}"
              alt=""
              width="64"
              height="64"
              loading="lazy"
              decoding="async"
            />
            <span class="cm-blog-card__author-name">${escapeHtml(card.authorName)}</span>
          </span>
          <span class="cm-blog-card__date">${escapeHtml(card.dateLabel)}</span>
        </span>
        <span class="cm-blog-card__cta">
          ${ctaText}
          <svg class="cm-blog-card__cta-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </span>
      </span>
    </a>
  </li>`;
}

/** @param {BlogCardView[]} cards */
export function renderBlogCardGrid(cards) {
  return `<ul class="cm-blog-card-grid">\n${cards.map(renderBlogCard).join('\n')}\n</ul>`;
}
