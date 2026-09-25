#!/usr/bin/env node
/**
 * Continental Media — generates public/proyectos/index.html.
 *
 * A single standalone page (not a data-driven family like the case-study
 * or pillar pages — there is exactly one /proyectos index), but still
 * built through a small generator rather than hand-authored, so the
 * shared site-header/footer templates stay the single source of truth
 * for that markup instead of a third hand-transcribed copy. See
 * public/blocks/projects-index/ for the block's own canonical source and
 * full direction-contract comment.
 *
 * Re-run after editing PROJECTS/FILTERS below:
 *   node scripts/generate-projects-index.mjs
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { renderSiteHeader } from './lib/site-header-template.mjs';
import { renderFooter } from './lib/footer-template.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REL = '../';

// One entry per already-built case study, in the exact order/content the
// brief pinned. Each media.src/width/height is that case's own real
// hero.jpg, reused as-is (verified against public/assets/images/proyectos/
// before writing this file) — never a new/duplicated asset.
const PROJECTS = [
  {
    index: '01',
    slug: 'grand-lounge-elite',
    client: 'The Grand Lounge Elite',
    category: 'Hospitalidad',
    filter: 'hospitalidad',
    description: 'Consolidar la red de salas VIP más importante en aeropuertos de México.',
    media: { src: 'proyectos/grand-lounge-elite/hero.jpg', width: 2048, height: 1365 },
  },
  {
    index: '02',
    slug: 'parroquia-veracruz',
    client: 'La Parroquia de Veracruz',
    category: 'Café y Gastronomía',
    filter: 'cafe-gastronomia',
    description: 'Casi 100 años de historia, traducidos a una marca integral.',
    media: { src: 'proyectos/parroquia-veracruz/hero.jpg', width: 1467, height: 2200 },
  },
  {
    index: '03',
    slug: 'bitali-desarrollos',
    client: 'Bitali Desarrollos',
    category: 'Inmobiliario',
    filter: 'inmobiliario',
    description: 'Convertir 60 conversaciones diarias en los leads que realmente importan.',
    media: { src: 'proyectos/bitali-desarrollos/hero.jpg', width: 2400, height: 1350 },
  },
  {
    index: '04',
    slug: 'camino-real-veracruz',
    client: 'Camino Real Veracruz',
    category: 'Hotelería',
    filter: 'hoteleria',
    description: 'Contenido mensual que da vida a cada rincón del hotel.',
    media: { src: 'proyectos/camino-real-veracruz/hero.jpg', width: 1467, height: 2200 },
  },
  {
    index: '05',
    slug: 'new-you-wellness',
    client: 'New You Wellness Center',
    category: 'Bienestar · Houston, TX',
    filter: 'bienestar',
    description: 'De un sitio de contacto a un motor de marketing con IA integrada.',
    media: { src: 'proyectos/new-you-wellness/hero.jpg', width: 1181, height: 787 },
  },
  {
    index: '06',
    slug: 'u3m',
    client: 'U3M — Universidad del Tercer Milenio',
    category: 'Educación',
    filter: 'educacion',
    description: 'Una alianza de más de 5 años que sigue formando generaciones.',
    media: { src: 'proyectos/u3m/hero.jpg', width: 2200, height: 1652 },
  },
  {
    index: '07',
    slug: 'amda-veracruz-tabasco',
    client: 'AMDA Veracruz Tabasco',
    category: 'Asociación / Sector Automotriz',
    filter: 'asociacion',
    description: 'Presencia digital constante para la voz del sector automotriz.',
    media: { src: 'proyectos/amda-veracruz-tabasco/hero.jpg', width: 1600, height: 1200 },
  },
  {
    index: '08',
    slug: 'bosque-residencial-san-lucas',
    client: 'Bosque Residencial San Lucas',
    category: 'Desarrollo Inmobiliario',
    filter: 'desarrollo-residencial',
    description: 'Una estrategia digital que conecta con el equipo comercial.',
    media: { src: 'proyectos/bosque-residencial-san-lucas/hero.jpg', width: 1238, height: 2200 },
  },
  {
    index: '09',
    slug: 'punta-tiburon',
    client: 'Punta Tiburón',
    category: 'Desarrollo Residencial / Club Deportivo',
    filter: 'desarrollo-residencial',
    description: 'Más de una década construyendo la identidad de un torneo.',
    media: { src: 'proyectos/punta-tiburon/hero.jpg', width: 1920, height: 1080 },
  },
];

// One chip per distinct filter value above (in first-appearance order),
// "Desarrollo Residencial" covers both Bosque and Punta Tiburón despite
// their differing displayed category text — the chip groups by a
// simplified umbrella key, the row still shows its own full category.
const FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'hospitalidad', label: 'Hospitalidad' },
  { key: 'cafe-gastronomia', label: 'Café y Gastronomía' },
  { key: 'inmobiliario', label: 'Inmobiliario' },
  { key: 'hoteleria', label: 'Hotelería' },
  { key: 'bienestar', label: 'Bienestar' },
  { key: 'educacion', label: 'Educación' },
  { key: 'asociacion', label: 'Asociación' },
  { key: 'desarrollo-residencial', label: 'Desarrollo Residencial' },
];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderFilterChip(filter) {
  const isAll = filter.key === 'all';
  return `          <button
            type="button"
            class="cm-pindex-filters__chip${isAll ? ' is-active' : ''}"
            data-cm-pindex-filter="${filter.key}"
            aria-pressed="${isAll ? 'true' : 'false'}"
          >
            ${escapeHtml(filter.label)}
          </button>`;
}

function renderRow(project) {
  const altText = `${project.client} — ${project.category}`;
  return `        <li class="cm-pindex-row" data-cm-pindex-row data-filter="${project.filter}">
          <a
            class="cm-pindex-row__link"
            href="${escapeHtml(project.slug)}/"
            data-cm-pindex-row-link
            aria-label="Ver caso de estudio: ${escapeHtml(altText)}"
          >
            <span class="cm-pindex-row__index">${project.index}</span>
            <span class="cm-pindex-row__text">
              <span class="cm-pindex-row__category">${escapeHtml(project.category)}</span>
              <span class="cm-pindex-row__name">${escapeHtml(project.client)}</span>
              <span class="cm-pindex-row__description">${escapeHtml(project.description)}</span>
            </span>
            <span class="cm-pindex-row__media">
              <span class="cm-pindex-row__media-frame">
                <img
                  class="cm-pindex-row__media-img"
                  src="${REL}assets/images/${project.media.src}"
                  width="${project.media.width}"
                  height="${project.media.height}"
                  alt="${escapeHtml(altText)}"
                  loading="lazy"
                  decoding="async"
                />
                <span class="cm-pindex-row__media-overlay" aria-hidden="true"></span>
              </span>
            </span>
          </a>
        </li>`;
}

function renderBlock() {
  const chips = FILTERS.map(renderFilterChip).join('\n');
  const rows = PROJECTS.map(renderRow).join('\n');

  return `    <section class="cm-pindex" data-cm-pindex aria-labelledby="cm-pindex-heading">
      <noscript>
        <style>
          [data-cm-pindex] .cm-pindex-hero__eyebrow,
          [data-cm-pindex] .cm-pindex-hero__title,
          [data-cm-pindex] .cm-pindex-hero__subtitle,
          [data-cm-pindex] .cm-pindex-filters,
          [data-cm-pindex] .cm-pindex-row {
            opacity: 1 !important;
            transform: none !important;
          }
          [data-cm-pindex] .cm-pindex-row__description {
            opacity: 1 !important;
          }
        </style>
      </noscript>

      <div class="cm-pindex-hero">
        <div class="cm-pindex-hero__inner">
          <span class="cm-pindex-hero__eyebrow">Proyectos</span>
          <h1 class="cm-pindex-hero__title" id="cm-pindex-heading">25 años de trabajo que hablan por sí solos.</h1>
          <p class="cm-pindex-hero__subtitle">
            Exploración de proyectos reales, estrategias comprobadas e impacto medible para marcas en
            México y Estados Unidos.
          </p>
        </div>
      </div>

      <div class="cm-pindex-filters" role="group" aria-label="Filtrar proyectos por industria">
        <div class="cm-pindex-filters__inner">
${chips}
        </div>
      </div>

      <div class="cm-pindex-list">
        <ol class="cm-pindex-list__inner" data-cm-pindex-rows>
${rows}
        </ol>
      </div>

      <div class="cm-pindex-transition" data-cm-pindex-transition aria-hidden="true"></div>
    </section>`;
}

function renderPage() {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Proyectos — Continental Media | Casos de éxito reales</title>
  <meta
    name="description"
    content="Explora los casos de éxito de Continental Media: 9 proyectos reales, estrategias comprobadas e impacto medible para marcas en México y Estados Unidos."
  />
  <meta name="theme-color" content="#0a0b0d" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
    rel="stylesheet"
  />

  <link rel="stylesheet" href="${REL}assets/css/tokens.css" />
  <link rel="stylesheet" href="${REL}blocks/site-header/site-header.css" />
  <link rel="stylesheet" href="${REL}blocks/projects-index/projects-index.css" />
  <link rel="stylesheet" href="${REL}blocks/footer/footer.css" />

  <style>
    /* Minimal page shell — not a design system, just enough to view
       these blocks in context. Same reset every page on the site uses. */
    * { box-sizing: border-box; }
    html { color-scheme: dark; }
    body {
      margin: 0;
      background: var(--cm-color-bg);
      font-family: var(--cm-font-body);
    }
  </style>
</head>
<body>
${renderSiteHeader(REL, { solid: true })}

  <main id="main-content" tabindex="-1">
${renderBlock()}
  </main>

${renderFooter(REL)}

  <script type="module" src="${REL}blocks/site-header/site-header.js"></script>
  <script type="module" src="${REL}blocks/projects-index/projects-index.js"></script>
</body>
</html>
`;
}

const outPath = resolve(__dirname, '..', 'public', 'proyectos', 'index.html');
writeFileSync(outPath, renderPage(), 'utf8');
console.log(`Wrote public/proyectos/index.html`);
