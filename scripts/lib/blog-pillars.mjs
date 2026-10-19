/**
 * Continental Media — blog pillar config: maps each of the Backlog
 * workbook's 9 "Pilares" (see blog-backlog.mjs -> pillars) to
 *   - a URL slug for /blog/categoria/<slug>/
 *   - a card/hero color block, reusing the home page's existing 9-color
 *     "checkerboard" palette 1:1 (public/blocks/projects-teaser/
 *     projects-teaser.css lines 134-142) rather than inventing a new
 *     one — assigned in the same order the palette already uses (P1-P9
 *     -> colors 1-9), which also happens to be the Pilares sheet's own
 *     row order, so neither ordering is an arbitrary pick grafted onto
 *     the other.
 *   - the real /servicios/<slug>/ page it should link to (see
 *     scripts/pillar-data.mjs), chosen by matching the Backlog's own
 *     "Pilares.Servicio" column against each service page's actual
 *     subservice list. 5 of the 9 map onto a pillar's own dedicated
 *     subservice (P2/P6 -> Redes/Web/SEO/Ads under marketing-digital,
 *     P3 -> ai-marketing-solutions, P4 -> Branding under
 *     marketing-tradicional, P5/P8 -> relaciones-publicas, P7 ->
 *     Producción Audiovisual under produccion); P1 and P9 are
 *     cross-cutting (general strategy / industry-vertical content) and
 *     fall back to marketing-digital as the broadest umbrella page.
 *     This is a judgment call, not a 1:1 fact from the source data —
 *     trivially re-pointed later if the real mapping should differ.
 *
 * All 9 bg/fg pairs are the same ones already contrast-verified (WCAG
 * AA, >=4.5:1 normal text) in projects-teaser.css's own header comment;
 * reused verbatim here, never recomputed.
 */

export const PILLARS = [
  {
    codigo: 'P1',
    nombre: 'Estrategia de marketing y contenidos',
    slug: 'estrategia-contenidos',
    colorName: 'Blue',
    bg: '#1e5fff',
    fg: '#f2f6ff',
    servicioSlug: 'marketing-digital',
  },
  {
    codigo: 'P2',
    nombre: 'Redes sociales y comunidad',
    slug: 'redes-sociales',
    colorName: 'Charcoal',
    bg: '#1b1d22',
    fg: '#edebe4',
    servicioSlug: 'marketing-digital',
  },
  {
    codigo: 'P3',
    nombre: 'IA aplicada al marketing',
    slug: 'ia-marketing',
    colorName: 'Bone',
    bg: '#e7e2d9',
    fg: '#17161b',
    servicioSlug: 'ai-marketing-solutions',
  },
  {
    codigo: 'P4',
    nombre: 'Branding, diseño y creatividad',
    slug: 'branding-diseno',
    colorName: 'Navy',
    bg: '#0e2455',
    fg: '#c7d6ff',
    servicioSlug: 'marketing-tradicional',
  },
  {
    codigo: 'P5',
    nombre: 'Relaciones públicas y comunicación',
    slug: 'relaciones-publicas',
    colorName: 'Periwinkle',
    bg: '#9fb2e8',
    fg: '#101a3d',
    servicioSlug: 'relaciones-publicas',
  },
  {
    codigo: 'P6',
    nombre: 'Web, SEO y publicidad digital',
    slug: 'web-seo-publicidad',
    colorName: 'Indigo',
    bg: '#221d3e',
    fg: '#dad6f5',
    servicioSlug: 'marketing-digital',
  },
  {
    codigo: 'P7',
    nombre: 'Video y fotografía',
    slug: 'video-fotografia',
    colorName: 'Mist',
    bg: '#e7e9f0',
    fg: '#14161f',
    servicioSlug: 'produccion',
  },
  {
    codigo: 'P8',
    nombre: 'Eventos, medios y publicidad exterior',
    slug: 'eventos-medios',
    colorName: 'Midnight',
    bg: '#0b1024',
    fg: '#c9d3f5',
    servicioSlug: 'relaciones-publicas',
  },
  {
    codigo: 'P9',
    nombre: 'Marketing por industria y mercado',
    slug: 'marketing-industria',
    colorName: 'Cornflower',
    bg: '#3555cc',
    fg: '#f4f7ff',
    servicioSlug: 'marketing-digital',
  },
];

/** Display name for each /servicios/<slug>/ page — see scripts/pillar-data.mjs. */
export const SERVICIO_NAMES = {
  'marketing-digital': 'Marketing Digital',
  'ai-marketing-solutions': 'AI Marketing Solutions',
  'marketing-tradicional': 'Marketing Tradicional',
  'relaciones-publicas': 'Relaciones Públicas',
  produccion: 'Producción',
};

export function pillarByCodigo(codigo) {
  return PILLARS.find((p) => p.codigo === codigo) || null;
}

export function pillarByNombre(nombre) {
  return PILLARS.find((p) => p.nombre === nombre) || null;
}

export function pillarBySlug(slug) {
  return PILLARS.find((p) => p.slug === slug) || null;
}
