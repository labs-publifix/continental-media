/**
 * Continental Media — blog-specific structured data (schema.org JSON-LD).
 * Pairs with scripts/lib/seo-schema.mjs (site-wide Organization, present
 * on every page) and scripts/lib/seo-meta.mjs (OG/Twitter/canonical).
 *
 * renderBlogCollectionPageSchema: used by the index routes (generate-blog.mjs)
 * — CollectionPage + ItemList of the posts shown on that specific page.
 * renderBlogPostingSchema / renderBreadcrumbListSchema / renderFaqPageSchema:
 * used by the article/guide pages (generate-blog.mjs's article step).
 */
const SITE_URL = 'https://continentalmedia.com.mx';

/**
 * @param {object} args
 * @param {string} args.canonicalPath - this page's own path, no leading slash.
 * @param {string} args.name - page title (pre-escaped not required — JSON.stringify escapes).
 * @param {string} args.description
 * @param {{ url: string, name: string }[]} args.items - url is the canonical
 *   site-root path (e.g. 'blog/mi-articulo/', no leading slash, NOT
 *   REL-prefixed — this is resolved against SITE_URL, not the page).
 */
export function renderBlogCollectionPageSchema({ canonicalPath, name, description, items }) {
  const pageUrl = new URL(canonicalPath, `${SITE_URL}/`).href;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    url: pageUrl,
    name,
    description,
    isPartOf: {
      '@type': 'Blog',
      name: 'Blog de Continental Media',
      url: new URL('blog/', `${SITE_URL}/`).href,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: new URL(item.url, `${SITE_URL}/`).href,
        name: item.name,
      })),
    },
  };

  return `  <script type="application/ld+json">
${JSON.stringify(data, null, 2)}
  </script>`;
}

/**
 * @param {object} args
 * @param {string} args.canonicalPath - 'blog/<slug>/'
 * @param {string} args.headline
 * @param {string} args.description
 * @param {string} args.imageCanonicalPath - site-root path to the OG image (1200x630), no leading slash, NOT REL-prefixed.
 * @param {{ name: string, teamCanonicalPath: string }} args.author - teamCanonicalPath e.g. 'nosotros.html', NOT REL-prefixed.
 * @param {string} args.publishDate - ISO 'YYYY-MM-DD'
 * @param {string} args.updateDate - ISO 'YYYY-MM-DD'
 * @param {string} args.pillarName - 'articleSection'
 * @param {string[]} args.keywords
 * @param {number} args.wordCount
 */
export function renderBlogPostingSchema({
  canonicalPath,
  headline,
  description,
  imageCanonicalPath,
  author,
  publishDate,
  updateDate,
  pillarName,
  keywords,
  wordCount,
}) {
  const pageUrl = new URL(canonicalPath, `${SITE_URL}/`).href;
  const imageUrl = new URL(imageCanonicalPath, `${SITE_URL}/`).href;
  const logoUrl = new URL('assets/images/continental-media-logo-white.png', `${SITE_URL}/`).href;
  const authorUrl = new URL(author.teamCanonicalPath, `${SITE_URL}/`).href;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    headline,
    description,
    image: imageUrl,
    datePublished: publishDate,
    dateModified: updateDate,
    articleSection: pillarName,
    keywords: keywords.join(', '),
    wordCount,
    inLanguage: 'es-MX',
    author: {
      '@type': 'Person',
      name: author.name,
      url: authorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Continental Media',
      logo: { '@type': 'ImageObject', url: logoUrl },
    },
  };

  return `  <script type="application/ld+json">
${JSON.stringify(data, null, 2)}
  </script>`;
}

/** @param {{ name: string, path: string }[]} crumbs - path is canonical, no leading slash ('' = home). */
export function renderBreadcrumbListSchema(crumbs) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: new URL(c.path, `${SITE_URL}/`).href,
    })),
  };

  return `  <script type="application/ld+json">
${JSON.stringify(data, null, 2)}
  </script>`;
}

/** @param {{ q: string, a: string }[]} faqs */
export function renderFaqPageSchema(faqs) {
  if (!faqs || faqs.length === 0) return '';

  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  return `  <script type="application/ld+json">
${JSON.stringify(data, null, 2)}
  </script>`;
}
