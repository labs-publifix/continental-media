/**
 * Continental Media — reader for the actual blog content: hand-authored
 * Markdown + YAML front matter files under content/blog/posts/ (real,
 * in-progress or published articles) and content/blog/drafts/ (test-only
 * articles used to QA the template system — see generate-blog.mjs's
 * --drafts flag; drafts never reach the production index/sitemap/RSS).
 *
 * The xlsx backlog (blog-backlog.mjs) is the *planning* source of truth
 * (status, schedule, keyword, cruces); this module is the *content*
 * source of truth (the actual written article). A post's `id` front
 * matter field is how the two are joined — see joinWithBacklog().
 *
 * Front matter schema (see any content/blog/posts/*.md once written):
 *   id            backlog ID, e.g. 'E-09' — joins to blog-backlog.mjs
 *   slug          URL slug, no accents/dates, e.g. 'tendencias-marketing-2027'
 *   tipo          'Editorial' | 'Guía práctica'
 *   pilar         pillar codigo, e.g. 'P1' — resolves via blog-pillars.mjs
 *   title         full title, contains the primary keyword, becomes the <h1>
 *   metaTitle     <=60 chars
 *   metaDescription <=155 chars
 *   excerpt       1-2 sentence card/index excerpt
 *   primaryKeyword
 *   secondaryKeywords  string[]
 *   author        author slug — fixed forever once first written, see blog-authors.mjs
 *   publishDate   'YYYY-MM-DD' — authoritative publish date for this article
 *   updateDate    'YYYY-MM-DD' — defaults to publishDate, bumped on substantive edits
 *   faqs          [{ q, a }] — 3-5 entries, rendered as visible FAQs + FAQPage schema
 *   cruces        backlog IDs this article should link to (only ones already published get a live link)
 *   servicio      /servicios/<slug>/ override — defaults to the pillar's own mapping
 *   pdf           { filename, pageCount } — guides only
 *   status        mirrors the backlog Estado at the time this file was last touched (display/debug only — the xlsx remains authoritative for workflow)
 * Body: Markdown, starting with an "En pocas palabras" direct-answer
 *   section, then clean H2/H3 structure.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { wordCount, readingMinutes } from './blog-format.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const POSTS_DIR = join(REPO_ROOT, 'content', 'blog', 'posts');
const DRAFTS_DIR = join(REPO_ROOT, 'content', 'blog', 'drafts');

function readMarkdownDir(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((filename) => {
      const raw = readFileSync(join(dir, filename), 'utf8');
      const { data, content } = matter(raw);
      const words = wordCount(content);
      return {
        ...data,
        slug: data.slug || filename.replace(/\.md$/, ''),
        body: content,
        html: marked.parse(content),
        wordCount: words,
        readingMin: readingMinutes(words),
        sourceFile: join(dir, filename),
      };
    });
}

/** Real posts only — content/blog/posts/. */
export function loadPosts() {
  return readMarkdownDir(POSTS_DIR);
}

/** Test-only posts — content/blog/drafts/. Never mixed with loadPosts(). */
export function loadDrafts() {
  return readMarkdownDir(DRAFTS_DIR);
}

/** Posts whose front matter status is 'Publicado', sorted newest first. */
export function publishedPosts(posts) {
  return posts
    .filter((p) => p.status === 'Publicado' && p.publishDate)
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate));
}

export function postBySlug(posts, slug) {
  return posts.find((p) => p.slug === slug) || null;
}

/**
 * Cross-reference a content post against its backlog row (keyword,
 * cruces titles, prioridad, etc. that don't belong duplicated in front
 * matter). Returns the post unchanged if no matching backlog row exists.
 */
export function joinWithBacklog(post, backlogPosts) {
  const row = backlogPosts.find((p) => p.id === post.id);
  return row ? { ...post, backlog: row } : post;
}
