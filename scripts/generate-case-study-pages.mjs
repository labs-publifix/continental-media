#!/usr/bin/env node
/**
 * Continental Media — case-study page generator.
 *
 * Reads scripts/case-study-data.mjs (the single content source for
 * every project case study) and renders each entry through ONE template
 * function into a real static HTML file at
 * public/proyectos/<slug>/index.html — see
 * public/blocks/case-study/case-study.html's header comment for the
 * full rationale (one reusable template + data, not N hand-duplicated
 * pages, mirroring the exact pattern already established for the 5
 * /servicios pillar pages and scripts/generate-pillar-pages.mjs).
 *
 * Usage:  node scripts/generate-case-study-pages.mjs
 *
 * Only case studies actually present in case-study-data.mjs get a page
 * — today that's just "grand-lounge-elite". Add the next project's
 * object to that file and re-run this script to generate its page; no
 * changes needed here.
 *
 * Output pages are two directories below public/ (public/proyectos/
 * <slug>/index.html), so every asset/page reference in the template
 * uses the REL ('../../') prefix rather than a root-absolute path —
 * this project can deploy under a GitHub Pages project subpath, where a
 * leading "/" would silently 404 (see page-hero.html's own note on the
 * same constraint). A sibling case-study page (the "next project" card)
 * is one directory up instead — '../<slug>/' — since both live at the
 * same depth under public/proyectos/.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { CASE_STUDIES } from './case-study-data.mjs';
import { renderSiteHeader } from './lib/site-header-template.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const REL = '../../';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const IMAGE_ICON = `<svg class="cm-case__placeholder-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>`;

const VIDEO_ICON = `<svg class="cm-case__placeholder-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="9.25" />
              <path d="M10 8.5l6 3.5-6 3.5v-7Z" />
            </svg>`;

function renderPlaceholder(label, altText, extraClass) {
  const bracketText = `[PLACEHOLDER: ${label} — ${altText}]`;
  return `<div class="cm-case__placeholder${extraClass ? ' ' + extraClass : ''}" role="img" aria-label="${escapeHtml(altText)}">
            ${IMAGE_ICON}
            <span class="cm-case__placeholder-label">${escapeHtml(bracketText)}</span>
          </div>`;
}

function renderVideoPlaceholder(altText) {
  const bracketText = `[PLACEHOLDER: Video — ${altText}, con controles de reproducción visibles, no autoplay]`;
  return `<div class="cm-case__placeholder" role="img" aria-label="${escapeHtml(altText)}">
              ${VIDEO_ICON}
              <span class="cm-case__placeholder-label">${escapeHtml(bracketText)}</span>
            </div>`;
}

// Real asset once it exists in scripts/case-study-data.mjs, placeholder
// until then — the same template renders both so a case can be filled
// in incrementally without ever touching this generator.
function renderMedia(media, label, altText, extraClass) {
  if (!media) return renderPlaceholder(label, altText, extraClass);
  return `<img
              class="cm-case__media-img${extraClass ? ' ' + extraClass : ''}"
              src="${REL}assets/images/${media.src}"
              width="${media.width}"
              height="${media.height}"
              alt="${escapeHtml(altText)}"
              loading="lazy"
              decoding="async"
            />`;
}

function renderVideoMedia(video, altText) {
  if (!video || !video.src) return renderVideoPlaceholder(altText);
  const videoUrl = `${REL}assets/video/${video.src}`;
  // preload="none" alone doesn't reliably stop Chromium from eagerly
  // fetching an autoplay+muted video regardless of the hint (verified:
  // the browser starts downloading the full file on page load even
  // with preload="none" here) — so the real source ships as
  // data-cm-case-video-src instead of src, and case-study.js is what
  // actually points the <source> at it once the block nears the
  // viewport. <noscript> carries a second, real <source> with the
  // genuine src: browsers render noscript content only when scripting
  // is OFF, so this contributes nothing while JS is deferring the load,
  // and becomes the only source (autoplaying immediately, same as
  // before) if JS never runs at all.
  return `<div class="cm-case-solution__video-inner" data-cm-case-video>
                <video
                  class="cm-case-solution__video-el"
                  poster="${REL}assets/images/${video.poster}"
                  width="${video.width}"
                  height="${video.height}"
                  autoplay
                  muted
                  loop
                  playsinline
                  preload="none"
                  aria-hidden="true"
                  tabindex="-1"
                >
                  <source data-cm-case-video-src="${videoUrl}" type="video/mp4" />
                  <noscript><source src="${videoUrl}" type="video/mp4" /></noscript>
                </video>
              </div>`;
}

function renderHead(caseStudy) {
  return `<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(caseStudy.metaTitle)}</title>
  <meta name="description" content="${escapeHtml(caseStudy.metaDescription)}" />
  <meta name="theme-color" content="#0a0b0d" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
    rel="stylesheet"
  />

  <link rel="stylesheet" href="${REL}assets/css/tokens.css" />
  <link rel="stylesheet" href="${REL}blocks/site-header/site-header.css" />
  <link rel="stylesheet" href="${REL}blocks/case-study/case-study.css" />

  <style>
    /* Minimal page shell — not a design system, just enough to view
       these blocks in context. Same reset every page on the site uses. */
    * { box-sizing: border-box; }
    html { color-scheme: dark; }
    body {
      margin: 0;
      background: var(--cm-color-bg);
      font-family: var(--cm-font-body);
    }
  </style>
</head>`;
}

function renderHero(caseStudy) {
  const disciplinePills = caseStudy.disciplines
    .map((d) => `<li class="cm-case-hero__discipline-pill">${escapeHtml(d)}</li>`)
    .join('\n            ');
  const hasMedia = !!caseStudy.hero.media;
  const mediaMarkup = hasMedia
    ? `<img
              class="cm-case-hero__media-img"
              src="${REL}assets/images/${caseStudy.hero.media.src}"
              width="${caseStudy.hero.media.width}"
              height="${caseStudy.hero.media.height}"
              alt="${escapeHtml(caseStudy.hero.mediaAlt)}"
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />`
    : renderPlaceholder('Imagen hero', caseStudy.hero.mediaAlt);
  return `    <section class="cm-case-hero" data-cm-case-hero>
      <div class="cm-case-hero__media${hasMedia ? ' cm-case-hero__media--photo' : ''}" data-cm-case-hero-media>
        ${mediaMarkup}
      </div>
      <div class="cm-case-hero__overlay" aria-hidden="true"></div>

      <div class="cm-case-hero__stage">
        <div class="cm-case-hero__content">
          <span class="cm-case-hero__label" data-cm-reveal>${escapeHtml(caseStudy.hero.label)}</span>
          <h1 class="cm-case-hero__title" id="cm-case-heading" data-cm-reveal>${escapeHtml(caseStudy.hero.title)}</h1>
          <p class="cm-case-hero__meta" data-cm-reveal>${escapeHtml(caseStudy.hero.meta)}</p>
          <ul class="cm-case-hero__disciplines" data-cm-reveal aria-label="Disciplinas">
            ${disciplinePills}
          </ul>
          <dl class="cm-case-hero__facts" data-cm-reveal>
            <div class="cm-case-hero__fact">
              <dt>Cliente</dt>
              <dd>${escapeHtml(caseStudy.client)}</dd>
            </div>
            <div class="cm-case-hero__fact">
              <dt>Industria</dt>
              <dd>${escapeHtml(caseStudy.industry)}</dd>
            </div>
            <div class="cm-case-hero__fact">
              <dt>Disciplinas</dt>
              <dd>${escapeHtml(caseStudy.disciplines.join(', '))}</dd>
            </div>
            <div class="cm-case-hero__fact">
              <dt>${escapeHtml(caseStudy.factFour.label)}</dt>
              <dd>${escapeHtml(caseStudy.factFour.value)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>`;
}

function renderSummary(caseStudy) {
  return `    <section class="cm-case-summary" data-cm-case-reveal>
      <div class="cm-case-summary__inner">
        <p class="cm-case-summary__text">${escapeHtml(caseStudy.summary)}</p>
      </div>
    </section>`;
}

function renderContext(caseStudy) {
  const c = caseStudy.context;
  return `    <section class="cm-case-context">
      <div class="cm-case-context__media" data-cm-case-context-media>
        <div class="cm-case-context__media-inner" data-cm-case-context-inner>
          ${renderMedia(c.media, 'Imagen', c.mediaAlt)}
        </div>
      </div>
      <div class="cm-case-context__text" data-cm-case-reveal>
        <span class="cm-case__eyebrow">${escapeHtml(c.eyebrow)}</span>
        <p class="cm-case-context__body">${escapeHtml(c.body)}</p>
      </div>
    </section>`;
}

function renderChallenge(caseStudy) {
  const ch = caseStudy.challenge;
  return `    <section class="cm-case-challenge" data-cm-case-reveal>
      <div class="cm-case-challenge__fade cm-case-challenge__fade--top" aria-hidden="true"></div>
      <div class="cm-case-challenge__inner">
        <span class="cm-case__eyebrow cm-case__eyebrow--on-accent">${escapeHtml(ch.eyebrow)}</span>
        <p class="cm-case-challenge__text">${escapeHtml(ch.body)}</p>
      </div>
      <div class="cm-case-challenge__fade cm-case-challenge__fade--bottom" aria-hidden="true"></div>
    </section>`;
}

function renderApproach(caseStudy) {
  const a = caseStudy.approach;
  const items = a.items
    .map(
      (text, index) => `        <li class="cm-case-approach__item">
          <span class="cm-case-approach__index">${String(index + 1).padStart(2, '0')}</span>
          <p class="cm-case-approach__text">${escapeHtml(text)}</p>
        </li>`
    )
    .join('\n');

  return `    <section class="cm-case-approach">
      <div class="cm-case-approach__inner">
        <div class="cm-case-approach__intro" data-cm-case-reveal>
          <span class="cm-case__eyebrow">${escapeHtml(a.eyebrow)}</span>
          <h2 class="cm-case-approach__title">${escapeHtml(a.title)}</h2>
        </div>
        <ol class="cm-case-approach__list" data-cm-case-approach-list>
${items}
        </ol>
      </div>
    </section>`;
}

function renderSolutionSubsection(sub, index) {
  const reverse = index % 2 === 1;
  const hasVideo = !!sub.video;
  const mediaLabel = sub.mediaLabel || 'Imagen';
  const mediaModifiers = [
    sub.mediaWide ? 'cm-case-solution__media--wide' : '',
    sub.mediaScreenshot ? 'cm-case-solution__media--screenshot' : '',
    sub.mediaPhone ? 'cm-case-solution__media--phone' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const mediaClass = mediaModifiers ? ' ' + mediaModifiers : '';
  // A raw web screenshot reads as an unfinished artifact next to the
  // other subsections' styled photography/brand-deck slides — a
  // minimal browser-chrome bar (3 dots, no address bar/text so it
  // never goes stale) frames it as "this is a live site" instead.
  const chromeBar = sub.mediaScreenshot
    ? `
            <div class="cm-case-solution__browser-chrome" aria-hidden="true">
              <span></span><span></span><span></span>
            </div>`
    : '';

  const videoBlock = hasVideo
    ? `
      <div class="cm-case-solution__video-wrap">
        <div class="cm-case-solution__video" data-cm-case-video-frame>
          ${renderVideoMedia(sub.video, sub.video.alt)}
        </div>
        ${sub.video.caption ? `<p class="cm-case-solution__video-caption">${escapeHtml(sub.video.caption)}</p>` : ''}
      </div>`
    : '';

  // A subsection whose only visual is its video (no companion row
  // image, e.g. when the reel itself is meant to be the whole slot's
  // evidence) skips the media div entirely rather than rendering an
  // empty/placeholder box next to the text.
  const mediaBlock = sub.media
    ? `
          <div class="cm-case-solution__media${mediaClass}">${chromeBar}
            ${renderMedia(sub.media, mediaLabel, sub.mediaAlt)}
          </div>`
    : '';

  return `      <div class="cm-case-solution__section" data-cm-case-reveal>
        <div class="cm-case-solution__row${reverse ? ' cm-case-solution__row--reverse' : ''}">${mediaBlock}
          <div class="cm-case-solution__text">
            <h3>${escapeHtml(sub.title)}</h3>
            <p>${escapeHtml(sub.body)}</p>
          </div>
        </div>${videoBlock}
      </div>`;
}

function renderSolution(caseStudy) {
  const s = caseStudy.solution;
  const subsections = s.subsections.map(renderSolutionSubsection).join('\n');

  return `    <section class="cm-case-solution">
      <div class="cm-case-solution__intro" data-cm-case-reveal>
        <span class="cm-case__eyebrow">${escapeHtml(s.eyebrow)}</span>
      </div>
${subsections}
    </section>`;
}

function renderResult(caseStudy) {
  const r = caseStudy.result;
  return `    <section class="cm-case-result" data-cm-case-reveal>
      <div class="cm-case-result__inner">
        <span class="cm-case__eyebrow">${escapeHtml(r.eyebrow)}</span>
        <p class="cm-case-result__text">${escapeHtml(r.body)}</p>
        <p class="cm-case-result__highlight">${escapeHtml(r.highlight)}</p>
        <p class="cm-case-result__attribution">${escapeHtml(r.highlightAttribution)}</p>
      </div>
    </section>`;
}

function renderClose(caseStudy) {
  const next = caseStudy.nextProject;
  const nextExists = CASE_STUDIES.some((c) => c.slug === next.slug);
  const badge = nextExists
    ? ''
    : `
        <span class="cm-case-next__badge">Próximamente</span>`;
  const ariaSuffix = nextExists ? '' : ' (Próximamente)';

  return `    <section class="cm-case-close">
      <div class="cm-case-close__cta" data-cm-case-reveal>
        <h2 class="cm-case-close__cta-title">¿Quieres resultados como estos para tu marca?</h2>
        <a class="cm-case-close__button" href="${REL}index.html#contacto">Contáctanos</a>
      </div>

      <a
        class="cm-case-next"
        href="../${next.slug}/"
        style="--cm-next-bg: ${next.bg}; --cm-next-fg: ${next.fg};"
        aria-label="Siguiente proyecto: ${escapeHtml(next.client)} — ${escapeHtml(next.category)}${ariaSuffix}"
      >
        <div class="cm-case-next__top">
          <span class="cm-case-next__label">Siguiente proyecto</span>${badge}
        </div>
        <span class="cm-case-next__category">${escapeHtml(next.category)}</span>
        <span class="cm-case-next__name">${escapeHtml(next.client)}</span>
      </a>
    </section>`;
}

function renderCaseStudySection(caseStudy) {
  return `    <!-- ===== CASE STUDY BLOCK — see public/blocks/case-study/ for the canonical source ===== -->
    <!--
      CONTINENTAL MEDIA — CASE STUDY PAGE BLOCK (canonical source)
      This page is GENERATED — see public/blocks/case-study/case-study.html
      for the full direction-contract comment (THESIS/OWN-WORLD/FORM/
      ACCESSIBILITY/USAGE) and the placeholder-asset inventory. Content
      lives in scripts/case-study-data.mjs; never hand-edit this file —
      edit the data and/or the block's CSS/JS, then re-run
      \`node scripts/generate-case-study-pages.mjs\`.
    -->
    <article class="cm-case" data-cm-case aria-labelledby="cm-case-heading">
      <noscript>
        <style>
          [data-cm-case] [data-cm-reveal],
          [data-cm-case] [data-cm-case-reveal],
          [data-cm-case] .cm-case-approach__item,
          [data-cm-case] .cm-case-solution__media,
          [data-cm-case] .cm-case-solution__video,
          [data-cm-case] .cm-case-result__highlight {
            opacity: 1 !important;
            transform: none !important;
          }
        </style>
      </noscript>

${renderHero(caseStudy)}

${renderSummary(caseStudy)}

${renderContext(caseStudy)}

${renderChallenge(caseStudy)}

${renderApproach(caseStudy)}

${renderSolution(caseStudy)}

${renderResult(caseStudy)}

${renderClose(caseStudy)}
    </article>
    <!-- ===== /CASE STUDY BLOCK ===== -->`;
}

function renderPage(caseStudy) {
  return `<!doctype html>
<html lang="es">
${renderHead(caseStudy)}
<body>
${renderSiteHeader(REL, { solid: false })}

  <main id="main-content" tabindex="-1">
${renderCaseStudySection(caseStudy)}
  </main>

  <script type="module" src="${REL}blocks/site-header/site-header.js"></script>
  <script type="module" src="${REL}blocks/case-study/case-study.js"></script>
</body>
</html>
`;
}

function main() {
  CASE_STUDIES.forEach((caseStudy) => {
    const dir = path.join(REPO_ROOT, 'public', 'proyectos', caseStudy.slug);
    mkdirSync(dir, { recursive: true });
    const outPath = path.join(dir, 'index.html');
    writeFileSync(outPath, renderPage(caseStudy), 'utf8');
    console.log('Wrote', path.relative(REPO_ROOT, outPath));
  });
}

main();
