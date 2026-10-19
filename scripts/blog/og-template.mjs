/**
 * Continental Media — standalone HTML template for one article's Open
 * Graph image, screenshotted at exactly 1200x630 by generate-og-images.mjs.
 * Not a public/blocks/ block — this HTML is never served, only rendered
 * once by Playwright and thrown away. Same visual language as the blog
 * card/hero: solid pillar color block, no photography, big number,
 * type badge, Space Grotesk title.
 *
 * The site logo ships in one color (white-on-transparent). On a light
 * pillar bg (Bone/Periwinkle/Mist) that would be nearly invisible, so
 * this reuses the exact fix already established for the Google logo in
 * aliados-tecnologia.css: `filter: brightness(0)` turns the white PNG
 * solid black while preserving its alpha — no second logo asset needed.
 * `needsDarkLogo` is true whenever the pillar's own fg is a dark color
 * (i.e. the bg is light), so the logo always matches the same fg color
 * every other element on the card already uses.
 */
import { escapeHtml } from '../lib/blog-html-utils.mjs';

export function renderOgHtml({ title, pilarNombre, badgeLabel, number, bg, fg, needsDarkLogo, logoAbsPath }) {
  const safeTitle = escapeHtml(title);
  const safePilar = escapeHtml(pilarNombre);
  const safeBadge = escapeHtml(badgeLabel);

  return `<!doctype html>
<html lang="es-MX">
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    width: 1200px;
    height: 630px;
    overflow: hidden;
  }
  body {
    background: ${bg};
    color: ${fg};
    font-family: 'Inter', -apple-system, 'Segoe UI', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 72px;
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .logo {
    height: 34px;
    width: auto;
    display: block;
    ${needsDarkLogo ? 'filter: brightness(0);' : ''}
  }
  .badge {
    display: inline-flex;
    align-items: center;
    font-weight: 700;
    font-size: 20px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 10px 18px;
    border-radius: 2px;
    background: ${fg};
    color: ${bg};
  }
  .middle {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .number {
    font-family: 'Space Grotesk', 'Inter', sans-serif;
    font-weight: 700;
    font-size: 56px;
    line-height: 1;
    opacity: 0.4;
    margin: 0;
  }
  .title {
    font-family: 'Space Grotesk', 'Inter', sans-serif;
    font-weight: 700;
    font-size: 58px;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 22px;
    font-weight: 600;
  }
  .pillar {
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-size: 18px;
    opacity: 0.75;
  }
  .domain {
    opacity: 0.75;
  }
</style>
</head>
<body>
  <div class="top">
    <img class="logo" src="${logoAbsPath}" alt="" />
    <span class="badge">${safeBadge}</span>
  </div>
  <div class="middle">
    <p class="number">${String(number).padStart(2, '0')}</p>
    <h1 class="title">${safeTitle}</h1>
  </div>
  <div class="bottom">
    <span class="pillar">${safePilar}</span>
    <span class="domain">continentalmedia.com.mx</span>
  </div>
</body>
</html>`;
}
