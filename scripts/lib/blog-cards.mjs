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
        href: `blog/${post.slug}/`, // REL prefixed later per output page
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
