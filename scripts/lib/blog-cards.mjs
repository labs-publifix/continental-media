/**
 * Continental Media — resolves published posts into card view-models.
 * Shared by every blog generator (index, article, OG images, PDFs,
 * sitemap, RSS, home teaser) so "how do we turn a post into a card/
 * number/href" is answered in exactly one place. Originally lived
 * inline in generate-blog.mjs; factored out once a second generator
 * (OG images) needed the same resolution.
 */
import { loadPosts, loadDrafts, publishedPosts } from './blog-content.mjs';
import { pillarByCodigo } from './blog-pillars.mjs';
import { authorBySlug } from './blog-authors.mjs';
import { formatDateEs } from './blog-format.mjs';

/** Posts per index page — shared by generate-blog.mjs (pagination) and
 *  generate-sitemap.mjs (which must compute the identical page count
 *  to list the right /page/N/ URLs without duplicating this number). */
export const PAGE_SIZE = 10;

export function relForDepth(dirPath) {
  const depth = dirPath.split('/').filter(Boolean).length;
  return '../'.repeat(depth);
}

/**
 * Output directory (no leading/trailing slash) for a post's own page.
 * Normally `blog/<slug>` — but a post carrying `ruta_heredada` (a
 * conserved legacy URL kept alive at its original path instead of a
 * redirect — see migracion/LEEME_transicion_seo.md §5) lives at that
 * literal path instead, in production only: a preview/draft build
 * (basePath !== 'blog') always stays isolated under its own slug-based
 * subfolder, never at the real conserved path, even for a
 * ruta_heredada post. The single source of truth for this post's
 * route — every generator (article page, index/sitemap/RSS entries,
 * cross-link hrefs) calls this instead of reconstructing `blog/<slug>`
 * by hand, so they can never drift out of sync with each other. */
export function outputDirFor(post, basePath = 'blog') {
  if (basePath === 'blog' && post.ruta_heredada) {
    return post.ruta_heredada.replace(/^\/|\/$/g, '');
  }
  return `${basePath}/${post.slug}`;
}

/** Shared per-post resolution (pillar, author, card view-model) for an
 *  already-ordered list of posts — used for both the real published
 *  archive (buildAllCards) and isolated draft previews (buildDraftCards). */
function buildCardsFromPosts(posts) {
  return posts.map((post, index) => {
    const pillar = pillarByCodigo(post.pilar);
    const author = authorBySlug(post.author);
    if (!pillar) throw new Error(`Post "${post.slug}" has unknown pilar "${post.pilar}"`);
    if (!author) throw new Error(`Post "${post.slug}" has unknown author "${post.author}"`);

    return {
      post,
      pillar,
      author,
      tipo: post.tipo,
      number: index + 1,
      card: {
        href: `${outputDirFor(post)}/`, // REL prefixed later per output page
        tipo: post.tipo,
        pilarNombre: pillar.nombre,
        pilarSlug: pillar.slug,
        bg: pillar.bg,
        fg: pillar.fg,
        number: index + 1,
        title: post.title,
        excerpt: post.excerpt,
        authorName: author.nombre,
        authorAvatar: author.avatar, // REL prefixed later
        dateLabel: formatDateEs(post.publishDate),
        hasPdf: Boolean(post.pdf),
        readingMin: post.readingMin,
      },
    };
  });
}

/** Builds the card view-model list for every published post, newest
 *  first, with a stable consecutive number assigned across the WHOLE
 *  archive (not reset per page/filter) — so "artículo #37" always
 *  means the same post regardless of which filtered page you found it
 *  on. */
export function buildAllCards() {
  return buildCardsFromPosts(publishedPosts(loadPosts()));
}

/** Builds card view-models for content/blog/drafts/*.md — test-only
 *  articles used to QA the template system (see generate-blog.mjs's
 *  --drafts flag). Never mixed with buildAllCards(): drafts render to
 *  an isolated public/blog/_drafts/<slug>/ path and never enter the
 *  index/sitemap/RSS/home teaser. Numbered in filename order (drafts
 *  have no publishDate-driven ordering to speak of). */
export function buildDraftCards() {
  return buildCardsFromPosts(loadDrafts());
}

/** Resolves ONE real post (content/blog/posts/) by its backlog id,
 *  regardless of status — used by each generator's `--preview=<id>`
 *  flag so an in-progress article ("En revisión") can be rendered and
 *  reviewed before it's ever eligible for buildAllCards()'s
 *  status==='Publicado' filter. Never mixed into the production
 *  index/sitemap/RSS/home teaser — see generate-blog.mjs's
 *  buildPreview(). */
export function buildReviewCard(id) {
  const post = loadPosts().find((p) => p.id === id);
  if (!post) throw new Error(`No post with id "${id}" found in content/blog/posts/.`);
  return buildCardsFromPosts([post])[0];
}

export function buildByIdMap(all) {
  const map = new Map();
  all.forEach((entry) => map.set(entry.post.id, entry));
  return map;
}

export function withRel(card, rel, featured) {
  return {
    ...card,
    href: `${rel}${card.href}`,
    authorAvatar: `${rel}${card.authorAvatar}`,
    featured: Boolean(featured),
  };
}
