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
 *   resumen       string[] — 2-4 bullets, the "En pocas palabras" direct-answer
 *                 box rendered right after the hero (also what AI Overviews/
 *                 AI search engines tend to lift verbatim)
 *   primaryKeyword
 *   secondaryKeywords  string[]
 *   author        author slug — fixed forever once first written, see blog-authors.mjs
 *   publishDate   'YYYY-MM-DD' — authoritative publish date for this article
 *   updateDate    'YYYY-MM-DD' — defaults to publishDate, bumped on substantive edits
 *   faqs          [{ q, a }] — 3-5 entries, rendered as visible FAQs + FAQPage schema
 *   cruces        backlog IDs this article should link to (only ones already published get a live link)
 *   servicio      /servicios/<slug>/ override — defaults to the pillar's own mapping
 *   pdf           guides only — { pageCount, filename?, title?, subtitle?, sections }.
 *                 pageCount is the AUTHORED/declared value shown on cards/article
 *                 before the PDF exists; scripts/blog/generate-pdfs.mjs computes the
 *                 real page count and warns if it no longer matches. filename
 *                 defaults to '<slug>.pdf'; title/subtitle default to the post's own.
 *                 sections is the PDF's actual content — see
 *                 scripts/blog/pdf-template.mjs for the 4 block types
 *                 (text/checklist/steps/table) and generate-pdfs.mjs for the generator.
 *   status        mirrors the backlog Estado at the time this file was last touched (display/debug only — the xlsx remains authoritative for workflow)
 * Body: Markdown, H2/H3 only (no H1 — the title front matter field is the
 *   page's one <h1>). Every H2/H3 gets an auto-generated id (see the
 *   custom marked renderer below) so the article's sidebar table of
 *   contents (extractToc()) can link straight to each section.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import matter from 'gray-matter';
import { Marked } from 'marked';
import { wordCount, readingMinutes } from './blog-format.mjs';
import { slugify } from './blog-html-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const POSTS_DIR = join(REPO_ROOT, 'content', 'blog', 'posts');
const DRAFTS_DIR = join(REPO_ROOT, 'content', 'blog', 'drafts');

// Own Marked instance (not the module-level singleton) with a renderer
// that slugifies H2/H3 text into an `id`, deduping repeats the way
// GitHub/most static site generators do (-2, -3, ...) — this is the
// only thing that lets the article template's sidebar TOC
// (extractToc()) and FAQ/section deep-links point at a real anchor.
// headingSlugCounts is reset before each document's own parse() call
// (see readMarkdownDir below) so numbering never leaks across articles.
let headingSlugCounts = new Map();
const marked = new Marked({
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const plain = tokens.map((t) => t.raw || '').join('');
      const base = slugify(plain);
      const n = headingSlugCounts.get(base) || 0;
      headingSlugCounts.set(base, n + 1);
      const id = n === 0 ? base : `${base}-${n + 1}`;
      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    },
  },
});

// gray-matter's YAML parser auto-converts an unquoted 'YYYY-MM-DD'
// scalar into a JS Date (midnight UTC) rather than keeping it a
// string — normalize back to 'YYYY-MM-DD' so every date field is
// always a plain ISO string throughout the rest of the blog system,
// regardless of whether a front matter author quoted the date or not.
function toIsoDateString(value) {
  if (!value) return value;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value;
}

function readMarkdownDir(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((filename) => {
      const raw = readFileSync(join(dir, filename), 'utf8');
      const { data, content } = matter(raw);
      const words = wordCount(content);
      headingSlugCounts = new Map();
      return {
        ...data,
        publishDate: toIsoDateString(data.publishDate),
        updateDate: toIsoDateString(data.updateDate),
        slug: data.slug || filename.replace(/\.md$/, ''),
        body: content,
        html: marked.parse(content),
        wordCount: words,
        readingMin: readingMinutes(words),
        sourceFile: join(dir, filename),
      };
    });
}

/** Extracts {level, text, id} for every <h2>/<h3> in an already-rendered
 *  post.html string, in document order — feeds the article sidebar TOC. */
export function extractToc(html) {
  const matches = [...html.matchAll(/<h([23]) id="([^"]+)">(.*?)<\/h[23]>/g)];
  return matches.map((m) => ({
    level: Number(m[1]),
    id: m[2],
    text: m[3].replace(/<[^>]+>/g, ''),
  }));
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
