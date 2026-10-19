/**
 * Continental Media — HTML templates for a guide's downloadable PDF.
 * Rendered by generate-pdfs.mjs as THREE separate Chromium print-to-PDF
 * passes (cover, content, back cover), merged with pdf-lib — the cover
 * and back cover have no repeating header/footer chrome and the
 * content pages do, and Playwright's page.pdf() only supports one
 * header/footer per call, so each "look" needs its own pass.
 *
 * PRINT, NOT DARK MODE: unlike every screen surface on this site, a
 * PDF meant to be printed or read on paper gets a white page with dark
 * text and the pillar color as an accent — the opposite of the site's
 * near-black ground. Same Space Grotesk/Inter pairing and near-sharp
 * radius as everywhere else; only the ground/figure swap.
 *
 * TWO DIFFERENT USES OF BRAND COLOR, kept strictly separate so every
 * pillar stays accessible without a per-pillar contrast exception:
 *   - `accent` = TEXT-ON-WHITE color (section headings, rules,
 *     checkbox outlines, table header tint+text). This is never the
 *     pillar's raw `bg` — for a light pillar (Bone/Periwinkle/Mist)
 *     that bg is too pale to read as text on paper, so the caller
 *     (generate-pdfs.mjs) passes that pillar's `fg` instead. Chosen
 *     this way, `accent` is always a dark, readable color.
 *   - `bg`/`fg` TOGETHER = a FILLED badge/circle (the cover's type
 *     chip, numbered step circles, numbered section tags) — the same
 *     pillar bg/fg pair already verified >=4.5:1 everywhere else on
 *     the site (blog-pillars.mjs). Never put white text directly on
 *     raw `accent`: two of the nine pillars (Blue, Cornflower) are too
 *     bright for that to pass contrast at small sizes — `bg`/`fg`
 *     together is the only combination guaranteed accessible for a
 *     filled shape.
 *
 * Content schema (a guide's `pdf.sections` front matter field) — one
 * of four block types, rendered by renderSection() below:
 *   { type: 'text',      heading, paragraphs: string[] }
 *   { type: 'checklist', heading, items: string[] }
 *   { type: 'steps',     heading, items: string[] }        (numbered)
 *   { type: 'table',     heading, columns: string[], rows: string[][] }
 */
import { escapeHtml } from '../lib/blog-html-utils.mjs';

function baseStyles() {
  return `
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, 'Segoe UI', sans-serif;
      color: #17161b;
    }
    h1, h2, h3 { font-family: 'Space Grotesk', 'Inter', sans-serif; }
  `;
}

// The logo file is 760x303 (2.508:1) — fixed width/height attributes
// here (not just CSS) so Chromium's print layout always has a real
// aspect ratio to respect instead of guessing from a not-yet-loaded
// image. See the .logo rule's own comment for the flex bug this
// paired with to cause the distortion this replaces.
const LOGO_W = 760;
const LOGO_H = 303;

/** A large, faint outline ring — the site has no decorative brand
 *  shape beyond the logo's own "C" swoosh, so this cover reuses that
 *  same circular motif at a much bigger scale, stroked at low opacity
 *  in the page's own fg color, bleeding off the top-right corner. One
 *  flourish, not decoration for its own sake: it's what keeps a
 *  solid-color cover from reading as "just a color field with text on
 *  it" the way the very first version did. */
function decorativeRing(fg) {
  return `<svg class="ring" viewBox="0 0 400 400" aria-hidden="true">
    <circle cx="200" cy="200" r="170" fill="none" stroke="${fg}" stroke-width="1.5" opacity="0.14" />
    <circle cx="200" cy="200" r="130" fill="none" stroke="${fg}" stroke-width="1.5" opacity="0.1" />
  </svg>`;
}

/** @param {{ title, subtitle, pilarNombre, authorName, dateLabel, bg, fg, needsDarkLogo, logoAbsPath }} view */
export function renderCoverHtml(view) {
  return `<!doctype html>
<html lang="es-MX">
<head>
<meta charset="utf-8" />
<style>
  ${baseStyles()}
  body {
    position: relative;
    width: 8.5in;
    height: 11in;
    background: ${view.bg};
    color: ${view.fg};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0.8in 0.75in;
    overflow: hidden;
  }
  .ring {
    position: absolute;
    top: -3.2in;
    right: -3.2in;
    width: 7.5in;
    height: 7.5in;
  }
  .top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    align-self: stretch;
  }
  .logo {
    flex: none;
    align-self: center;
    height: 0.62in;
    width: auto;
    display: block;
    ${view.needsDarkLogo ? 'filter: brightness(0);' : ''}
  }
  .badge {
    flex: none;
    display: inline-flex;
    align-items: center;
    font-weight: 700;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.09in 0.16in;
    border-radius: 2px;
    background: ${view.fg};
    color: ${view.bg};
  }
  .body-copy {
    position: relative;
    max-width: 6in;
  }
  .pillar {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
    font-size: 12px;
    opacity: 0.75;
    margin: 0 0 0.22in;
  }
  .rule {
    width: 0.55in;
    height: 3px;
    background: ${view.fg};
    opacity: 0.85;
    margin: 0 0 0.28in;
  }
  .title {
    font-weight: 700;
    font-size: 42px;
    line-height: 1.12;
    letter-spacing: -0.025em;
    margin: 0 0 0.22in;
  }
  .subtitle {
    font-weight: 400;
    font-size: 16px;
    line-height: 1.55;
    opacity: 0.88;
    max-width: 5in;
    margin: 0;
  }
  .meta {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 12.5px;
    padding-top: 0.22in;
    border-top: 1px solid ${view.fg}40;
  }
  .meta-label {
    display: block;
    font-size: 9.5px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.65;
    margin-bottom: 0.05in;
  }
  .meta-author { font-weight: 600; }
  .meta-right { text-align: right; opacity: 0.85; }
</style>
</head>
<body>
  ${decorativeRing(view.fg)}
  <div class="top-row">
    <img class="logo" src="${view.logoAbsPath}" alt="" width="${LOGO_W}" height="${LOGO_H}" />
    <span class="badge">Guía práctica</span>
  </div>
  <div class="body-copy">
    <p class="pillar">${escapeHtml(view.pilarNombre)}</p>
    <div class="rule"></div>
    <h1 class="title">${escapeHtml(view.title)}</h1>
    ${view.subtitle ? `<p class="subtitle">${escapeHtml(view.subtitle)}</p>` : ''}
  </div>
  <div class="meta">
    <div>
      <span class="meta-label">Escrito por</span>
      <span class="meta-author">${escapeHtml(view.authorName)}</span>
    </div>
    <div class="meta-right">
      <span class="meta-label">Continental Media</span>
      continentalmedia.com.mx · ${escapeHtml(view.dateLabel)}
    </div>
  </div>
</body>
</html>`;
}

function renderSection(section, accent, bg, fg, index) {
  const tag = `<span class="section-tag" style="background:${bg};color:${fg}">${String(index + 1).padStart(2, '0')}</span>`;
  const heading = `<h2 class="section-heading" style="color:${accent};border-color:${accent}40">${tag}${escapeHtml(section.heading)}</h2>`;

  if (section.type === 'text') {
    const paras = section.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n');
    return `<section class="block">${heading}<div class="block-body">${paras}</div></section>`;
  }

  if (section.type === 'checklist') {
    const items = section.items
      .map(
        (item) =>
          `<li class="checklist-item"><span class="checkbox" style="border-color:${accent}"></span><span>${escapeHtml(item)}</span></li>`
      )
      .join('\n');
    return `<section class="block">${heading}<ul class="checklist">${items}</ul></section>`;
  }

  if (section.type === 'steps') {
    const items = section.items
      .map(
        (item, i) =>
          `<li><span class="step-num" style="background:${bg};color:${fg}">${i + 1}</span><span class="step-text">${escapeHtml(item)}</span></li>`
      )
      .join('\n');
    return `<section class="block">${heading}<ol class="steps">${items}</ol></section>`;
  }

  if (section.type === 'table') {
    const thead = section.columns
      .map((c) => `<th style="background:${accent}17;color:${accent};border-bottom-color:${accent}">${escapeHtml(c)}</th>`)
      .join('');
    const rows = section.rows
      .map(
        (row, i) =>
          `<tr${i % 2 === 1 ? ' class="alt"' : ''}>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`
      )
      .join('\n');
    return `<section class="block"><div class="table-wrap">${heading}<table><thead><tr>${thead}</tr></thead><tbody>${rows}</tbody></table></div></section>`;
  }

  throw new Error(`Unknown PDF section type: "${section.type}"`);
}

/**
 * @param {{ title, pilarNombre, bg, fg, accent, sections: object[] }} view
 *   See this file's header comment for the accent vs. bg/fg split.
 */
export function renderContentHtml(view) {
  const sections = view.sections.map((s, i) => renderSection(s, view.accent, view.bg, view.fg, i)).join('\n');

  return `<!doctype html>
<html lang="es-MX">
<head>
<meta charset="utf-8" />
<style>
  ${baseStyles()}
  body { font-size: 12.5px; line-height: 1.65; }
  .block { page-break-inside: avoid; margin-bottom: 0.34in; }
  .section-heading {
    display: flex;
    align-items: center;
    gap: 0.14in;
    font-weight: 700;
    font-size: 18px;
    letter-spacing: -0.01em;
    margin: 0 0 0.18in;
    padding-bottom: 0.1in;
    border-bottom: 1.5px solid;
  }
  .section-tag {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 0.3in;
    height: 0.3in;
    border-radius: 2px;
    font-family: 'Space Grotesk', 'Inter', sans-serif;
    font-weight: 700;
    font-size: 12px;
  }
  .block-body { padding-left: 0.44in; }
  p { margin: 0 0 0.12in; }

  .checklist { list-style: none; margin: 0; padding-left: 0.44in; }
  .checklist-item {
    display: flex;
    align-items: flex-start;
    gap: 0.14in;
    padding: 0.09in 0;
    border-bottom: 1px solid #ece7de;
    page-break-inside: avoid;
  }
  .checkbox {
    flex: none;
    width: 13px;
    height: 13px;
    margin-top: 2px;
    border: 2px solid;
    border-radius: 2px;
  }

  .steps { margin: 0; padding-left: 0.44in; list-style: none; }
  .steps li {
    display: flex;
    align-items: flex-start;
    gap: 0.14in;
    padding: 0.09in 0;
    border-bottom: 1px solid #ece7de;
    page-break-inside: avoid;
  }
  .step-num {
    flex: none;
    width: 0.24in;
    height: 0.24in;
    margin-top: 1px;
    border-radius: 50%;
    font-family: 'Space Grotesk', 'Inter', sans-serif;
    font-weight: 700;
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .step-text { padding-top: 0.02in; }

  .table-wrap { padding-left: 0.44in; }
  table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
  th, td { text-align: left; padding: 0.1in 0.12in; }
  th { font-weight: 700; font-size: 10.5px; letter-spacing: 0.02em; text-transform: uppercase; border-bottom: 1.5px solid; }
  td { border-bottom: 1px solid #ece7de; }
  tr.alt td { background: #faf9f6; }
</style>
</head>
<body>
${sections}
</body>
</html>`;
}

/** Closing branded page — a third, header/footer-less print pass (see
 *  this file's header comment), always rendered in the brand's core
 *  accent blue regardless of the guide's own pillar color. Every other
 *  page of a Continental Media PDF varies by pillar; this one page is
 *  deliberately constant across every guide — the signature that closes
 *  every deliverable the same way, the same reason a printed report
 *  gets one fixed back cover regardless of its chapter color-coding. */
export function renderBackCoverHtml({ logoAbsPath }) {
  return `<!doctype html>
<html lang="es-MX">
<head>
<meta charset="utf-8" />
<style>
  ${baseStyles()}
  body {
    position: relative;
    width: 8.5in;
    height: 11in;
    background: #1e5fff;
    color: #f2f6ff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
  }
  .logo { height: 0.68in; width: auto; margin-bottom: 0.45in; }
  .tagline {
    font-family: 'Space Grotesk', 'Inter', sans-serif;
    font-weight: 700;
    font-size: 26px;
    line-height: 1.3;
    letter-spacing: -0.01em;
    max-width: 5.2in;
    margin: 0 0 0.45in;
  }
  .contact {
    font-size: 13px;
    line-height: 1.9;
    opacity: 0.9;
  }
  .contact strong { display: block; font-weight: 600; opacity: 1; }
</style>
</head>
<body>
  <img class="logo" src="${logoAbsPath}" alt="" width="${LOGO_W}" height="${LOGO_H}" />
  <p class="tagline">La inteligencia artificial no reemplaza a tu equipo, lo multiplica.</p>
  <p class="contact">
    <strong>¿Hablamos de tu próximo proyecto?</strong>
    contacto@continentalmedia.com.mx · continentalmedia.com.mx
  </p>
</body>
</html>`;
}

/** Playwright headerTemplate: small accent mark + guide title, repeats
 *  on every content page. `accent` is the print-safe color — see this
 *  file's header comment. */
export function renderHeaderTemplate(title, accent) {
  return `<div style="width:100%; font-family: Inter, sans-serif; font-size:9px; color:#6b6b70; padding: 0 0.6in; display:flex; align-items:center; gap:6px; justify-content:space-between;">
    <span style="display:flex; align-items:center; gap:6px; font-weight:700; color:${accent};">
      <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:${accent};"></span>
      Continental Media
    </span>
    <span>${escapeHtml(title)}</span>
  </div>`;
}

/**
 * Playwright footerTemplate: domain + accent rule, repeats on every
 * content page. Deliberately NOT using Playwright's native
 * .pageNumber/.totalPages classes for the "X / Y" page count: those
 * are computed relative to THIS print-to-PDF call alone (the content
 * pages only), but the final file merges this onto a cover AND a back
 * cover generated in separate passes — Chromium has no way to know
 * about pages a later merge step adds on either side. The correct
 * "N / Total" (counting the whole final document) is stamped
 * afterward by generate-pdfs.mjs with pdf-lib, once it knows the real
 * page count — see stampPageNumbers() there. This template just
 * reserves the matching blank space (same right inset) so the stamped
 * text lands aligned with the domain text's baseline instead of
 * drifting between them.
 */
export function renderFooterTemplate(accent) {
  return `<div style="width:100%; font-family: Inter, sans-serif; font-size:9px; color:#6b6b70; padding: 0 0.6in; display:flex; align-items:center; justify-content:space-between; border-top: 1.5px solid ${accent}; padding-top: 4px;">
    <span>continentalmedia.com.mx</span>
    <span></span>
  </div>`;
}
