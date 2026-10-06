/**
 * Continental Media — shared Organization structured data (schema.org
 * JSON-LD) for every page.
 *
 * WHY: ties the footer's own NAP (name/email/phone) and social links to
 * a machine-readable record search engines can use directly — eligible
 * for a logo/sameAs knowledge-panel treatment, and lets Google tie every
 * page back to one canonical Organization entity instead of re-guessing
 * it per page. This is the one piece of the footer's "mucho enfoque SEO"
 * brief that lives in <head> rather than in the visible footer markup,
 * since schema.org JSON-LD has no visual footprint — but the data itself
 * (name, contact info, sameAs) is exactly what the footer displays.
 *
 * DOMAIN: https://continentalmedia.com.mx/ — the agency's own registered
 * domain (confirmed by the user), used here even though the site is
 * currently only deployed at the GitHub Pages URL; this schema describes
 * the organization, not "whatever host currently serves this HTML", and
 * stays correct once a CNAME points the real domain at this deployment.
 *
 * NOT LocalBusiness: schema.org's LocalBusiness type expects a verified
 * street address (PostalAddress); nothing in this project confirms one,
 * and a wrong/fabricated address is worse than no address. Organization
 * needs no address and is still the right type for sameAs/logo/contact
 * eligibility.
 *
 * @param {string} rel - relative path prefix back to public/ from the
 *   page's own directory (e.g. '../../'), used only to build the
 *   absolute logo URL.
 */
const SITE_URL = 'https://continentalmedia.com.mx';

export function renderOrganizationSchema(rel) {
  const logoPath = `${rel}assets/images/continental-media-logo-white.png`;
  const logoUrl = new URL(logoPath, `${SITE_URL}/`).href;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Continental Media',
    url: `${SITE_URL}/`,
    logo: logoUrl,
    description:
      'Agencia de marketing, comunicación y relaciones públicas potenciada por Inteligencia Artificial, con presencia en Veracruz y Querétaro.',
    email: 'contacto@continentalmedia.com.mx',
    telephone: '+52-229-210-0926',
    sameAs: [
      'https://www.facebook.com/ContinentalMkt/',
      'https://www.instagram.com/continental_mkt/',
      'https://www.youtube.com/channel/UCcsRE-pEJrz0B2Ain6gqWow',
      'https://mx.linkedin.com/company/continentalmkt',
    ],
  };

  return `  <script type="application/ld+json">
${JSON.stringify(data, null, 2)}
  </script>`;
}
