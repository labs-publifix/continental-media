# Continental Media — site & blog reference

Static site, no backend, no bundler. `public/` is deployed as-is to GitHub
Pages by `.github/workflows/deploy-pages.yml` — CI does zero building.
Everything under `scripts/` is dev-time tooling run locally with `node
scripts/...` (see `package.json`'s `scripts` block for the full list).
Production domain: `https://continentalmedia.com.mx`.

## Blog — key URLs (site-root paths, no leading slash in this repo's
own internal links — GitHub Pages subpath deploys break on a literal "/")

| Route | What it is |
|---|---|
| `blog/` | Main index — all published posts, newest first, paginated |
| `blog/page/N/` | Index pagination, N >= 2 |
| `blog/articulos/` (+ `/page/N/`) | Editorial-only filter |
| `blog/guias/` (+ `/page/N/`) | Guía práctica-only filter |
| `blog/categoria/<pilar-slug>/` (+ `/page/N/`) | One per pillar — slugs in `scripts/lib/blog-pillars.mjs` |
| `blog/<slug>/` | One article/guide page |
| `blog/rss.xml` | RSS 2.0 feed, regenerated on every blog build |
| `sitemap.xml` | Whole-site sitemap, includes every blog route above |
| `robots.txt` | Already points at `/sitemap.xml`, no blog-specific changes needed |
| `assets/images/blog/og/<slug>.jpg` | Per-article OG image (1200x630) |
| `assets/pdfs/blog/<slug>.pdf` (or `pdf.filename` override) | Guide PDF deliverable |
| `index.html#blog` | Home page teaser section — generated, empty while 0 posts published |

Draft/test content (never in production) renders to the same shapes
under an isolated, gitignored `_drafts/` subfolder: `blog/_drafts/<slug>/`,
`assets/images/blog/og/_drafts/<slug>.jpg`, `assets/pdfs/blog/_drafts/<slug>.pdf`.

## Blog — build commands

```
npm run blog:build      # generate-blog.mjs — index/article pages, sitemap,
                         # RSS, redirects, home teaser, all in one run
npm run blog:og         # OG images for all published posts
npm run blog:pdf        # PDFs for all published guides with pdf.sections
npm run blog:redirects  # 301-equivalent stubs (also runs inside blog:build)
npm run sitemap         # whole-site sitemap (also runs inside blog:build)

# add --drafts to blog:build/og/pdf to render content/blog/drafts/*.md
# instead of content/blog/posts/*.md — isolated, gitignored, never mixed
# with production.
```

## Blog — content model

- `content/blog/Backlog_Blog_Continental_Media.xlsx` — the 100-topic
  editorial calendar (source of truth for what to write next and when).
  Read with `scripts/lib/blog-backlog.mjs` (Node, read-only). Status
  changes are written with `scripts/blog/update_backlog_status.py`
  (openpyxl — the ONLY thing that writes to this file, since it
  preserves formulas/formatting that the Node `xlsx` package does not).
- `content/blog/posts/<slug>.md` — real/published article content
  (YAML front matter + Markdown body). Schema documented in
  `scripts/lib/blog-content.mjs`'s header comment.
- `content/blog/drafts/<slug>.md` — test-only content, same schema,
  never published.
- Author bios (fixed once per article, in front matter): `scripts/lib/blog-authors.mjs`.
- Pillar → color/service mapping: `scripts/lib/blog-pillars.mjs`.

## Known platform constraint

GitHub Pages has no server-side redirect support. The "301" stubs
`generate-redirects.mjs` writes are a static HTML page (canonical tag +
meta refresh + JS `location.replace()` + a visible manual link) at each
legacy URL — the closest a static host can get, not a literal HTTP 301.
