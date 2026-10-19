#!/usr/bin/env node
/**
 * Continental Media — generates the downloadable PDF for every
 * published guide (post.tipo === 'Guía práctica' with a `pdf.sections`
 * front matter field), at public/assets/pdfs/blog/<slug>.pdf — the
 * exact path the article template's PDF card/TOC button already link
 * to (see generate-blog.mjs).
 *
 * Three separate Chromium print-to-PDF passes, merged with pdf-lib:
 *   1. the cover (full-bleed pillar color, no header/footer chrome)
 *   2. the content pages (white background, repeating branded
 *      header/footer via Playwright's native displayHeaderFooter)
 *   3. a back cover (constant brand-blue, no header/footer chrome —
 *      see pdf-template.mjs's renderBackCoverHtml)
 * — see scripts/blog/pdf-template.mjs's header comment for why this
 * needs three passes instead of one. Content flows with ordinary HTML
 * pagination (page-break-inside: avoid on every list item/table row,
 * nothing manually sized to a fixed page height), so Chromium's own
 * print engine decides how many pages a guide needs — never a
 * fixed-height div that could clip content.
 *
 * Usage:
 *   node scripts/blog/generate-pdfs.mjs
 *   node scripts/blog/generate-pdfs.mjs --drafts   (content/blog/drafts/*.md,
 *     isolated at public/assets/pdfs/blog/_drafts/<slug>.pdf — gitignored,
 *     same isolation as generate-blog.mjs's --drafts)
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import os from 'node:os';
import { chromium } from 'playwright-core';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

import { buildAllCards, buildDraftCards } from '../lib/blog-cards.mjs';
import { formatDateEs } from '../lib/blog-format.mjs';
import {
  renderCoverHtml,
  renderContentHtml,
  renderBackCoverHtml,
  renderHeaderTemplate,
  renderFooterTemplate,
} from './pdf-template.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const isDrafts = process.argv.includes('--drafts');
const OUT_DIR = isDrafts
  ? join(REPO_ROOT, 'public', 'assets', 'pdfs', 'blog', '_drafts')
  : join(REPO_ROOT, 'public', 'assets', 'pdfs', 'blog');
const LOGO_ABS_PATH = pathToFileURL(
  join(REPO_ROOT, 'public', 'assets', 'images', 'continental-media-logo-white.png')
).href;
const TMP_DIR = join(os.tmpdir(), 'cm-pdf-render');

/** Stamps the true "N / Total" page number (bottom-right, matching the
 *  footer template's own 0.6in right inset) on the content pages only
 *  — the cover (always index 0) and the back cover (always the last
 *  page) have no footer at all, so neither gets a stamp.
 *  @param {number} contentStart - first content page index (0-based).
 *  @param {number} contentCount - how many content pages there are.
 *  See pdf-template.mjs's renderFooterTemplate for why this can't just
 *  be Playwright's native pageNumber/totalPages tokens. */
async function stampPageNumbers(pdfDoc, contentStart, contentCount) {
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const size = 7.5;
  const total = pdfDoc.getPageCount();
  const color = rgb(0x6b / 255, 0x6b / 255, 0x70 / 255);
  const rightInset = 0.6 * 72;
  const bottomY = 0.26 * 72;

  for (let i = contentStart; i < contentStart + contentCount; i++) {
    const page = pdfDoc.getPage(i);
    const { width } = page.getSize();
    const label = `${i + 1} / ${total}`;
    const textWidth = font.widthOfTextAtSize(label, size);
    page.drawText(label, { x: width - rightInset - textWidth, y: bottomY, size, font, color });
  }
}

function isDark(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

async function renderOnePdf(page, html, tmpName, pdfOptions) {
  const tmpPath = join(TMP_DIR, tmpName);
  writeFileSync(tmpPath, html, 'utf8');
  await page.goto(pathToFileURL(tmpPath).href, { waitUntil: 'networkidle' });
  return page.pdf(pdfOptions);
}

async function buildGuidePdf(browser, entry) {
  const { post, pillar, author } = entry;
  const page = await browser.newPage();

  const coverHtml = renderCoverHtml({
    title: post.pdf.title || post.title,
    subtitle: post.pdf.subtitle || post.excerpt,
    pilarNombre: pillar.nombre,
    authorName: author.nombre,
    dateLabel: formatDateEs(post.publishDate, { long: true }),
    bg: pillar.bg,
    fg: pillar.fg,
    needsDarkLogo: isDark(pillar.fg),
    logoAbsPath: LOGO_ABS_PATH,
  });

  // Print-safe accent for text/borders on the white content pages — a
  // light pillar's own bg (Bone/Periwinkle/Mist) is too pale to read
  // as heading text on paper, so fall back to that pillar's (always
  // dark) fg instead. See pdf-template.mjs's renderContentHtml doc.
  const accent = isDark(pillar.bg) ? pillar.bg : pillar.fg;

  const contentHtml = renderContentHtml({
    title: post.pdf.title || post.title,
    pilarNombre: pillar.nombre,
    bg: pillar.bg,
    fg: pillar.fg,
    accent,
    sections: post.pdf.sections,
  });

  const coverBuffer = await renderOnePdf(page, coverHtml, `${post.slug}-cover.html`, {
    width: '8.5in',
    height: '11in',
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
    printBackground: true,
  });

  const contentBuffer = await renderOnePdf(page, contentHtml, `${post.slug}-content.html`, {
    format: 'Letter',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: renderHeaderTemplate(post.pdf.title || post.title, accent),
    footerTemplate: renderFooterTemplate(accent),
    margin: { top: '0.5in', bottom: '0.55in', left: '0.6in', right: '0.6in' },
  });

  const backCoverBuffer = await renderOnePdf(page, renderBackCoverHtml({ logoAbsPath: LOGO_ABS_PATH }), `${post.slug}-back.html`, {
    width: '8.5in',
    height: '11in',
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
    printBackground: true,
  });

  await page.close();

  const merged = await PDFDocument.create();
  const coverDoc = await PDFDocument.load(coverBuffer);
  const contentDoc = await PDFDocument.load(contentBuffer);
  const backCoverDoc = await PDFDocument.load(backCoverBuffer);

  const [coverPage] = await merged.copyPages(coverDoc, [0]);
  merged.addPage(coverPage);
  const contentPages = await merged.copyPages(contentDoc, contentDoc.getPageIndices());
  contentPages.forEach((p) => merged.addPage(p));
  const [backPage] = await merged.copyPages(backCoverDoc, [0]);
  merged.addPage(backPage);

  await stampPageNumbers(merged, 1, contentPages.length);

  merged.setTitle(post.pdf.title || post.title);
  merged.setAuthor(author.nombre);
  merged.setSubject(post.excerpt);
  merged.setKeywords([post.primaryKeyword, ...(post.secondaryKeywords || [])].filter(Boolean));
  merged.setProducer('Continental Media');
  merged.setCreator('Continental Media blog PDF generator');
  merged.setCreationDate(new Date());

  const bytes = await merged.save();
  const filename = post.pdf.filename || `${post.slug}.pdf`;
  const outPath = join(OUT_DIR, filename);
  writeFileSync(outPath, bytes);
  return { outPath, pageCount: merged.getPageCount() };
}

async function main() {
  const all = isDrafts ? buildDraftCards() : buildAllCards();
  const guides = all.filter((e) => e.post.tipo === 'Guía práctica' && e.post.pdf && e.post.pdf.sections);

  if (guides.length === 0) {
    console.log(
      isDrafts
        ? 'No draft guides with pdf.sections in content/blog/drafts/ — nothing to render.'
        : 'No published guides with pdf.sections — nothing to render.'
    );
    return;
  }

  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(TMP_DIR, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

  for (const entry of guides) {
    const { outPath, pageCount } = await buildGuidePdf(browser, entry);
    console.log(`Wrote ${outPath.replace(REPO_ROOT + '/', '')} (${pageCount} pages)`);
    if (pageCount !== entry.post.pdf.pageCount) {
      console.warn(
        `  WARNING: front matter pdf.pageCount (${entry.post.pdf.pageCount}) doesn't match the generated PDF (${pageCount}). Update the front matter so the card/article "N páginas" badge stays accurate.`
      );
    }
  }

  await browser.close();
  console.log(`\n${guides.length} PDF(s) generated.`);
}

main();
