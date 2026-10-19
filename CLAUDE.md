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

A real in-progress post (`content/blog/posts/<slug>.md`, any status —
typically "En revisión") previews the same way via `--preview=<id>`
(backlog id, e.g. `G-01`) instead of `--drafts`, on `generate-blog.mjs`
/ `generate-og-images.mjs` / `generate-pdfs.mjs`: renders to an
isolated, gitignored `blog/_preview/<slug>/` (+ matching `_preview/`
OG/PDF paths), without needing `status: Publicado` and without
touching the production index/sitemap/RSS/home teaser.

## Blog — publishing cadence

Two new posts a week, same mechanic each time: **Tuesdays and
Thursdays**, starting **Tuesday 2026-10-20**. Per-article workflow:
1. "¿cuál es el siguiente artículo?" → show the next 5 pending backlog
   items (by `orden`), no writing yet.
2. "redáctalo `<ID>`" → write the content file (`status: "En
   revisión"`), render with `--preview=<id>`, screenshot, hand it over
   for review. `origen: Re-redacción 2026` pieces are written from
   scratch (no access to the legacy article), per standing instruction
   — read more current that way.
3. User corrections, if any.
4. "autorizado" → flip `status: Publicado`, full `blog:build`/`blog:og`/
   `blog:pdf`, verify retroactive cross-links + redirect activation,
   commit + push, then sync the xlsx Estado with
   `python3 scripts/blog/update_backlog_status.py <ID> Publicado --fecha <YYYY-MM-DD>`.

Published so far (all `Lote: Lanzamiento`, 2026-10-19): **E-09**
(`tendencias-marketing-2027`), **G-01** (`plan-de-marketing-2027`),
**E-01** (`ia-en-el-marketing-2026`). Next up by `orden`: **G-07**,
then **E-03**, **G-09** (see the backlog for the full queue).

## SEO — indexable URL list

`public/sitemap.xml` (regenerated on every `blog:build`) is the always-
current source of truth for every URL that should be indexed once the
real site is live at `https://continentalmedia.com.mx` — `robots.txt`
already points at it, nothing extra to configure per article. Pull the
current list any time with:
```
grep -o '<loc>[^<]*</loc>' public/sitemap.xml | sed 's/<\/\?loc>//g'
```
It's additive: every `blog:build` run only ever adds newly-published
routes (new `blog/<slug>/`, its `blog/categoria/<pilar>/` entry once
that pillar's first post lands, etc.) — nothing is removed by this
workflow.

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
  openpyxl has no formula engine, so saving strips every formula
  cell's cached result workbook-wide (not just the row touched) — both
  the Backlog sheet's `mesPublicacion`/`dia`/`semana`/`lote` AND the
  "Posts actuales" sheet's `activateOn` (redirect go-live date) are
  formulas for exactly this reason. `blog-backlog.mjs` recomputes all
  of them in JS from literal cells (`fechaPublicacion`) instead of
  ever trusting those columns' cached values — if the xlsx ever grows
  another formula column some script needs to read, it needs the same
  treatment, not a raw cell read.
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
