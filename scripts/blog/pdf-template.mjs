/**
 * Continental Media — HTML templates for a guide's downloadable PDF.
 * Rendered by generate-pdfs.mjs as TWO separate Chromium print-to-PDF
 * passes (cover, then content), merged with pdf-lib — the cover has no
 * repeating header/footer chrome and the content pages do, and
 * Playwright's page.pdf() only supports one header/footer per call.
 *
 * PRINT, NOT DARK MODE: unlike every screen surface on this site, a
 * PDF meant to be printed or read on paper gets a white page with dark
 * text and the pillar color as an accent (section headings, checkbox
 * outlines, table header row, footer rule) — the opposite of the
 * site's near-black ground. Same Space Grotesk/Inter pairing and
 * near-sharp radius as everywhere else; only the ground/figure swap.
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

/** @param {{ title, subtitle, pilarNombre, authorName, dateLabel, bg, fg, needsDarkLogo, logoAbsPath }} view */
export function renderCoverHtml(view) {
  return `<!doctype html>
<html lang="es-MX">
<head>
<meta charset="utf-8" />
<style>
  ${baseStyles()}
  body {
    width: 8.5in;
    height: 11in;
    background: ${view.bg};
    color: ${view.fg};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0.85in 0.75in;
  }
  .logo { height: 0.4in; width: auto; ${view.needsDarkLogo ? 'filter: brightness(0);' : ''} }
  .pillar {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;
    font-size: 13px;
    opacity: 0.8;
    margin: 0 0 0.25in;
  }
  .title {
    font-weight: 700;
    font-size: 40px;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin: 0 0 0.2in;
  }
  .subtitle {
    font-weight: 400;
    font-size: 17px;
    line-height: 1.5;
    opacity: 0.9;
    max-width: 5.4in;
    margin: 0;
  }
  .meta {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 13px;
    font-weight: 600;
  }
  .meta-domain { opacity: 0.8; font-weight: 400; }
</style>
</head>
<body>
  <img class="logo" src="${view.logoAbsPath}" alt="" />
  <div>
    <p class="pillar">${escapeHtml(view.pilarNombre)}</p>
    <h1 class="title">${escapeHtml(view.title)}</h1>
    ${view.subtitle ? `<p class="subtitle">${escapeHtml(view.subtitle)}</p>` : ''}
  </div>
  <div class="meta">
    <span>${escapeHtml(view.authorName)}</span>
    <span class="meta-domain">continentalmedia.com.mx · ${escapeHtml(view.dateLabel)}</span>
  </div>
</body>
</html>`;
}

function renderSection(section, accent) {
  const heading = `<h2 class="section-heading" style="color:${accent}">${escapeHtml(section.heading)}</h2>`;

  if (section.type === 'text') {
    const paras = section.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n');
    return `<section class="block">${heading}${paras}</section>`;
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
    const items = section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('\n');
    return `<section class="block">${heading}<ol class="steps" style="counter-reset: step;">${items}</ol></section>`;
  }

  if (section.type === 'table') {
    const thead = section.columns.map((c) => `<th style="background:${accent}22">${escapeHtml(c)}</th>`).join('');
    const rows = section.rows
      .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`)
      .join('\n');
    return `<section class="block">${heading}<table><thead><tr>${thead}</tr></thead><tbody>${rows}</tbody></table></section>`;
  }

  throw new Error(`Unknown PDF section type: "${section.type}"`);
}

/**
 * @param {{ title, pilarNombre, bg, fg, accent, sections: object[] }} view
 *   `accent` is the print-safe color for text/borders on the WHITE
 *   content pages — NOT always the same as `bg` (the pillar's card
 *   background): for a light pillar (Bone/Periwinkle/Mist) `bg` itself
 *   is too pale to read as heading text on white paper, so the caller
 *   (generate-pdfs.mjs) passes that pillar's `fg` as `accent` instead.
 *   `bg`/`fg` stay available for the one place a filled pillar-color
 *   shape (not text-on-white) still makes sense: the numbered step
 *   circle, which is a small badge, not running text.
 */
export function renderContentHtml(view) {
  const sections = view.sections.map((s) => renderSection(s, view.accent)).join('\n');

  return `<!doctype html>
<html lang="es-MX">
<head>
<meta charset="utf-8" />
<style>
  ${baseStyles()}
  body { font-size: 12.5px; line-height: 1.6; }
  .block { page-break-inside: avoid; margin-bottom: 0.3in; }
  .section-heading {
    font-weight: 700;
    font-size: 19px;
    letter-spacing: -0.01em;
    margin: 0 0 0.14in;
    padding-bottom: 0.08in;
    border-bottom: 2px solid currentColor;
  }
  p { margin: 0 0 0.12in; }

  .checklist { list-style: none; margin: 0; padding: 0; }
  .checklist-item {
    display: flex;
    align-items: flex-start;
    gap: 0.12in;
    padding: 0.08in 0;
    border-bottom: 1px solid #e7e2d9;
    page-break-inside: avoid;
  }
  .checkbox {
    flex: none;
    width: 14px;
    height: 14px;
    margin-top: 2px;
    border: 2px solid;
    border-radius: 2px;
  }

  .steps { margin: 0; padding: 0; list-style: none; counter-reset: step; }
  .steps li {
    counter-increment: step;
    position: relative;
    padding: 0.08in 0 0.08in 0.4in;
    border-bottom: 1px solid #e7e2d9;
    page-break-inside: avoid;
  }
  .steps li::before {
    content: counter(step);
    position: absolute;
    left: 0;
    top: 0.08in;
    width: 0.26in;
    height: 0.26in;
    border-radius: 50%;
    background: ${view.bg};
    color: ${view.fg};
    font-weight: 700;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th, td { text-align: left; padding: 0.08in 0.1in; border: 1px solid #d9d4ca; }
  th { font-weight: 700; }
</style>
</head>
<body>
${sections}
</body>
</html>`;
}

/** Playwright headerTemplate: small logo mark + guide title, repeats on
 *  every content page. `accent` is the print-safe color — see renderContentHtml's doc comment. */
export function renderHeaderTemplate(title, accent) {
  return `<div style="width:100%; font-family: Inter, sans-serif; font-size:9px; color:#6b6b70; padding: 0 0.6in; display:flex; align-items:center; justify-content:space-between;">
    <span style="font-weight:700; color:${accent};">Continental Media</span>
    <span>${escapeHtml(title)}</span>
  </div>`;
}

/**
 * Playwright footerTemplate: domain + accent rule, repeats on every
 * content page. Deliberately NOT using Playwright's native
 * .pageNumber/.totalPages classes for the "X / Y" page count: those
 * are computed relative to THIS print-to-PDF call alone (the content
 * pages only), but the final file is this content PDF merged onto a
 * 1-page cover PDF generated separately — Chromium has no way to know
 * about pages a later merge step will prepend, so it would print
 * "1 / 2" on what is actually page 2 of a 3-page document. The correct
 * "N / Total" is stamped afterward by generate-pdfs.mjs with pdf-lib,
 * once it knows the real, final page count — see
 * stampPageNumbers() there. This template just reserves the matching
 * blank space (same right inset) so the stamped text lands aligned
 * with the domain text's baseline instead of drifting between them.
 */
export function renderFooterTemplate(accent) {
  return `<div style="width:100%; font-family: Inter, sans-serif; font-size:9px; color:#6b6b70; padding: 0 0.6in; display:flex; align-items:center; justify-content:space-between; border-top: 2px solid ${accent}; padding-top: 4px;">
    <span>continentalmedia.com.mx</span>
    <span></span>
  </div>`;
}
