/**
 * Continental Media — renders the home page's "Blog" teaser section,
 * mirroring public/blocks/blog-teaser/blog-teaser.html exactly.
 * Spliced directly into public/index.html by generate-blog.mjs between
 * two sentinel comments — see that file's injectHomeTeaser() and
 * blog-teaser.html's own FORM note for why this block is generated
 * rather than hand-maintained.
 */
import { renderBlogCardGrid } from './blog-card-template.mjs';

/**
 * @param {import('./blog-card-template.mjs').BlogCardView[]} cards - the
 *   3 latest published posts, already REL-prefixed for index.html's own
 *   depth (home-page depth: no REL prefix needed, same as every other
 *   home-page asset).
 * @returns {string} empty string when `cards` is empty — per the brief,
 *   "mientras ninguno esté publicado, no lo muestres": the section
 *   doesn't render at all, not an empty-state message.
 */
export function renderBlogTeaserSection(cards) {
  if (cards.length === 0) return '';

  return `<section id="blog" class="cm-blog-teaser" data-cm-blog-teaser aria-labelledby="cm-blog-teaser-heading">
      <noscript>
        <style>
          [data-cm-blog-teaser] [data-cm-blog-teaser-reveal] {
            opacity: 1 !important;
            transform: none !important;
          }
        </style>
      </noscript>

      <div class="cm-blog-teaser__inner">
        <div class="cm-blog-teaser__intro" data-cm-blog-teaser-reveal>
          <span class="cm-blog-teaser__eyebrow">Blog</span>
          <h2 class="cm-blog-teaser__title" id="cm-blog-teaser-heading">
            Ideas y guías para hacer crecer tu marca.
          </h2>
          <p class="cm-blog-teaser__subtitle">
            Estrategia, contenido, redes sociales, relaciones públicas e inteligencia artificial —
            explicado paso a paso, directo de nuestro equipo.
          </p>
        </div>

${renderBlogCardGrid(cards)}

        <div class="cm-blog-teaser__cta-row" data-cm-blog-teaser-reveal>
          <a class="cm-blog-teaser__cta" href="blog/">Ver todo el blog</a>
        </div>
      </div>
    </section>`;
}
