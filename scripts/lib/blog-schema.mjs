/**
 * Continental Media — blog-specific structured data (schema.org JSON-LD).
 * Pairs with scripts/lib/seo-schema.mjs (site-wide Organization, present
 * on every page) and scripts/lib/seo-meta.mjs (OG/Twitter/canonical).
 *
 * renderBlogCollectionPageSchema: used by the index routes (generate-blog.mjs)
 * — CollectionPage + ItemList of the posts shown on that specific page.
 * BlogPosting / BreadcrumbList / FAQPage (per-article schema) are added
 * here once the article template is built (see task #16).
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
