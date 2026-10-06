/**
 * Continental Media — shared Open Graph / Twitter Card / canonical URL
 * meta tags for every page's <head>.
 *
 * Pairs with scripts/lib/seo-schema.mjs (Organization JSON-LD): that
 * module describes the organization once per page; this one describes
 * the *page itself* for link-preview surfaces (iMessage, WhatsApp,
 * Slack, Facebook, LinkedIn, X/Twitter) and search engines, so every
 * shared link gets a real title/description/image instead of a bare
 * URL — the site had zero OG/Twitter/canonical tags before this.
 *
 * title/description are expected PRE-ESCAPED (the same already-escaped
 * strings each generator already computes for its own <title>/<meta
 * description> tags — e.g. escapeHtml(caseStudy.metaTitle) — passed
 * straight through here rather than re-implementing escaping).
 *
 * @param {object} args
 * @param {string} args.rel - relative path prefix back to public/ from
 *   the page's own directory (e.g. '../../'), used only to build the
 *   absolute og:image URL.
 * @param {string} args.canonicalPath - the page's own path from the
 *   site root, no leading slash (e.g. '', 'nosotros.html', 'contacto.html',
 *   'proyectos/', 'proyectos/grand-lounge-elite/'). '' means the site root.
 * @param {string} args.title - pre-escaped page title (same string used
 *   in <title>).
 * @param {string} args.description - pre-escaped meta description (same
 *   string used in <meta name="description">).
 * @param {string} [args.image] - rel-prefixed path to a page-specific OG
 *   image (e.g. '${rel}assets/images/proyectos/<slug>/hero.jpg'). Omit to
 *   use the shared site-wide OG image.
 */
const SITE_URL = 'https://continentalmedia.com.mx';

export function renderSeoMeta({ rel, canonicalPath, title, description, image }) {
  const canonicalUrl = new URL(canonicalPath, `${SITE_URL}/`).href;
  const imagePath = image || `${rel}assets/images/seo/og-image.jpg`;
  const imageUrl = new URL(imagePath, `${SITE_URL}/`).href;

  return `  <link rel="canonical" href="${canonicalUrl}" />

  <!-- Open Graph / Twitter Card — see scripts/lib/seo-meta.mjs -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Continental Media" />
  <meta property="og:locale" content="es_MX" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Continental Media — Marketing, comunicación y RP potenciada por IA" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />`;
}

/**
 * Favicon / home-screen icon <link> tags — the full set exported from
 * the brand's favicon generator (public/*.png, public/favicon.ico,
 * public/site.webmanifest), referenced at every size a browser or OS
 * actually requests rather than relying on the bare /favicon.ico
 * auto-probe (which 404s on this project's current GitHub Pages
 * subpath deployment, since that probe always hits the true domain
 * root regardless of where the file lives in this repo — explicit
 * <link rel="icon"> tags are what make the icon show up correctly
 * until a custom domain is connected).
 *
 * @param {string} rel - relative path prefix back to public/ (e.g. '../../').
 */
export function renderFavicons(rel) {
  return `  <link rel="icon" href="${rel}favicon.ico" sizes="32x32" />
  <link rel="icon" href="${rel}favicon-16x16.png" sizes="16x16" type="image/png" />
  <link rel="icon" href="${rel}favicon-32x32.png" sizes="32x32" type="image/png" />
  <link rel="icon" href="${rel}favicon-48x48.png" sizes="48x48" type="image/png" />
  <link rel="icon" href="${rel}favicon-96x96.png" sizes="96x96" type="image/png" />
  <link rel="icon" href="${rel}favicon-192x192.png" sizes="192x192" type="image/png" />
  <link rel="apple-touch-icon" href="${rel}apple-touch-icon.png" />
  <link rel="apple-touch-icon" sizes="120x120" href="${rel}apple-touch-icon-120x120.png" />
  <link rel="apple-touch-icon" sizes="152x152" href="${rel}apple-touch-icon-152x152.png" />
  <link rel="apple-touch-icon" sizes="167x167" href="${rel}apple-touch-icon-167x167.png" />
  <link rel="manifest" href="${rel}site.webmanifest" />`;
}
