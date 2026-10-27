#!/usr/bin/env node
/**
 * Continental Media — generates public/blog/rss.xml, an RSS 2.0 feed of
 * every published post, newest first. Re-run (or just re-run
 * generate-blog.mjs — see its own main(), which calls this) every time
 * a post is published so the feed stays current, per the brief's
 * "RSS actualizado en cada publicación".
 *
 * Usage:
 *   node scripts/blog/generate-rss.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

import { buildAllCards, outputDirFor } from '../lib/blog-cards.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const SITE_URL = 'https://continentalmedia.com.mx';

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function rfc822(isoDate) {
  // Midday UTC — this project has no time-of-day for publishDate, only
  // a date, so noon avoids any date ever shifting a day under a
  // reader's local timezone the way midnight UTC risks.
  return new Date(`${isoDate}T12:00:00Z`).toUTCString();
}

function renderItem(entry) {
  const { post, pillar } = entry;
  const url = `${SITE_URL}/${outputDirFor(post)}/`;

  return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(post.publishDate)}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
      <category>${escapeXml(pillar.nombre)}</category>
    </item>`;
}

export function generateRss() {
  const all = buildAllCards();
  const items = all.map(renderItem).join('\n');
  const lastBuildDate = all.length > 0 ? rfc822(all[0].post.publishDate) : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog de Continental Media</title>
    <link>${SITE_URL}/blog/</link>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Artículos y guías prácticas de Continental Media sobre marketing digital, contenido, redes sociales, relaciones públicas e inteligencia artificial.</description>
    <language>es-mx</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  const outDir = join(REPO_ROOT, 'public', 'blog');
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, 'rss.xml');
  writeFileSync(outPath, xml, 'utf8');
  console.log(`Wrote public/blog/rss.xml (${all.length} item(s))`);
}

// Runs standalone (`node scripts/blog/generate-rss.mjs`) but is also
// imported and called directly by generate-blog.mjs's main(), so a
// blog build always refreshes the feed without a separate command.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateRss();
}
