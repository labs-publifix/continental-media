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
 *   node scripts/blog/generate-og-images.mjs --drafts   (content/blog/drafts/*.md,
 *     isolated at public/assets/images/blog/og/_drafts/<slug>.jpg — gitignored,
 *     same isolation as generate-blog.mjs's --drafts)
 *   node scripts/blog/generate-og-images.mjs --preview=G-01   (one real
 *     in-progress post by backlog id, any status — isolated at
 *     public/assets/images/blog/og/_preview/<slug>.jpg, gitignored,
 *     same isolation pattern as generate-blog.mjs's --preview=<id>)
 */
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import os from 'node:os';
import { chromium } from 'playwright-core';

import { buildAllCards, buildDraftCards, buildReviewCard } from '../lib/blog-cards.mjs';
import { tipoLabels } from '../lib/blog-format.mjs';
import { isDarkHex } from '../lib/blog-pillars.mjs';
import { renderOgHtml } from './og-template.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const isDrafts = process.argv.includes('--drafts');
const previewId = (process.argv.find((a) => a.startsWith('--preview=')) || '').split('=')[1];
const OUT_DIR = previewId
  ? join(REPO_ROOT, 'public', 'assets', 'images', 'blog', 'og', '_preview')
  : isDrafts
    ? join(REPO_ROOT, 'public', 'assets', 'images', 'blog', 'og', '_drafts')
    : join(REPO_ROOT, 'public', 'assets', 'images', 'blog', 'og');
const LOGO_ABS_PATH = pathToFileURL(
  join(REPO_ROOT, 'public', 'assets', 'images', 'continental-media-logo-white.png')
).href;
// A real file:// navigation (not page.setContent, which loads from an
// about:blank origin where Chromium silently refuses to load local
// file:// image resources) — each post's HTML is written here, then
// visited with page.goto(), same fix already needed for the earlier
// blog-card/blog-index Playwright previews in this build.
const TMP_DIR = join(os.tmpdir(), 'cm-og-render');

async function main() {
  const all = previewId ? [buildReviewCard(previewId)] : isDrafts ? buildDraftCards() : buildAllCards();
  mkdirSync(OUT_DIR, { recursive: true });

  if (all.length === 0) {
    console.log(isDrafts ? 'No drafts in content/blog/drafts/ — nothing to render.' : 'No published posts — nothing to render.');
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
      needsDarkLogo: isDarkHex(pillar.fg),
      logoAbsPath: LOGO_ABS_PATH,
    });

    const tmpHtmlPath = join(TMP_DIR, `${post.slug}.html`);
    writeFileSync(tmpHtmlPath, html, 'utf8');
    await page.goto(pathToFileURL(tmpHtmlPath).href, { waitUntil: 'networkidle' });

    const outPath = join(OUT_DIR, `${post.slug}.jpg`);
    await page.screenshot({ path: outPath, type: 'jpeg', quality: 90 });
    const subdir = previewId ? '_preview/' : isDrafts ? '_drafts/' : '';
    console.log('Wrote', `assets/images/blog/og/${subdir}${post.slug}.jpg`);
  }

  await browser.close();
  rmSync(TMP_DIR, { recursive: true, force: true });
  console.log(`\n${all.length} OG image(s) generated.`);
}

main();
