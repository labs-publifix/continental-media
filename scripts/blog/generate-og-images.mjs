#!/usr/bin/env node
/**
 * Continental Media — generates one 1200x630 Open Graph image per
 * published blog post, at public/assets/images/blog/og/<slug>.jpg —
 * the exact path generate-blog.mjs's article pages already reference
 * in their og:image/twitter:image meta and BlogPosting schema.
 *
 * Renders scripts/blog/og-template.mjs through a headless Chromium
 * (playwright-core, the browser pre-installed in this environment —
 * see CLAUDE.md/session notes: do NOT run `playwright install`) at
 * exactly 1200x630 and screenshots it — same solid pillar-color-block
 * language as the blog card/article hero, no photography.
 *
 * Usage:
 *   node scripts/blog/generate-og-images.mjs
 */
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import os from 'node:os';
import { chromium } from 'playwright-core';

import { buildAllCards } from '../lib/blog-cards.mjs';
import { tipoLabels } from '../lib/blog-format.mjs';
import { renderOgHtml } from './og-template.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const OUT_DIR = join(REPO_ROOT, 'public', 'assets', 'images', 'blog', 'og');
const LOGO_ABS_PATH = pathToFileURL(
  join(REPO_ROOT, 'public', 'assets', 'images', 'continental-media-logo-white.png')
).href;
// A real file:// navigation (not page.setContent, which loads from an
// about:blank origin where Chromium silently refuses to load local
// file:// image resources) — each post's HTML is written here, then
// visited with page.goto(), same fix already needed for the earlier
// blog-card/blog-index Playwright previews in this build.
const TMP_DIR = join(os.tmpdir(), 'cm-og-render');

/** Relative luminance of a hex color (WCAG formula) — decides whether
 *  the light-on-transparent logo needs the brightness(0) dark-recolor
 *  (see og-template.mjs) for this pillar's bg/fg pair. */
function isDark(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

async function main() {
  const all = buildAllCards();
  mkdirSync(OUT_DIR, { recursive: true });

  if (all.length === 0) {
    console.log('No published posts — nothing to render.');
    return;
  }

  mkdirSync(TMP_DIR, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

  for (const entry of all) {
    const { post, pillar, number } = entry;
    const { typeBadge } = tipoLabels(post.tipo);

    const html = renderOgHtml({
      title: post.title,
      pilarNombre: pillar.nombre,
      badgeLabel: typeBadge,
      number,
      bg: pillar.bg,
      fg: pillar.fg,
      needsDarkLogo: isDark(pillar.fg),
      logoAbsPath: LOGO_ABS_PATH,
    });

    const tmpHtmlPath = join(TMP_DIR, `${post.slug}.html`);
    writeFileSync(tmpHtmlPath, html, 'utf8');
    await page.goto(pathToFileURL(tmpHtmlPath).href, { waitUntil: 'networkidle' });

    const outPath = join(OUT_DIR, `${post.slug}.jpg`);
    await page.screenshot({ path: outPath, type: 'jpeg', quality: 90 });
    console.log('Wrote', `assets/images/blog/og/${post.slug}.jpg`);
  }

  await browser.close();
  rmSync(TMP_DIR, { recursive: true, force: true });
  console.log(`\n${all.length} OG image(s) generated.`);
}

main();
