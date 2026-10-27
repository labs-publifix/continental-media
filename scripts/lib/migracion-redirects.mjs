/**
 * Continental Media — shared resolver for the SEO-migration redirect
 * list (see migracion/LEEME_transicion_seo.md). Reads the 38-row
 * "lista corta" CSV and turns each row into a concrete relative path,
 * recomputed from LIVE data (published posts, pillar categories) on
 * every call — never from the CSV's own descriptive text, which is
 * only a snapshot from the day the plan was exported.
 *
 * Shared by scripts/migracion/generar-redirects.mjs (the generator)
 * and scripts/migracion/probar-redirects.mjs (the test script), so
 * both always agree on what "correct" means — the test re-derives its
 * own expectation from this same function rather than hand-copying
 * values, which would drift the moment an article publishes.
 *
 * Replaces scripts/blog/generate-redirects.mjs (deleted this round —
 * see CLAUDE.md): that mechanism redirected every backlog row with a
 * resolvable decision (155 of them), which the reduced SEO plan
 * explicitly rules out — everything outside this 38-row list must 404
 * real, not redirect (see LEEME section 1 and 8).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

import { loadBacklog } from './blog-backlog.mjs';
import { loadPosts } from './blog-content.mjs';
import { pillarByNombre } from './blog-pillars.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
export const CSV_PATH = join(REPO_ROOT, 'migracion', 'redirects_lista_corta.csv');
export const SITE_URL = 'https://continentalmedia.com.mx';

const CSV_COLUMNS = ['ruta_origen', 'accion_final', 'ruta_destino_al_corte', 'destino_final', 'fecha_cambio_destino_final', 'clics_16m'];

/** Minimal CSV line splitter — handles double-quoted fields (with ""
 *  escaping) since this file is simple enough not to need a
 *  dependency, but still correct if a field ever contains a comma. */
function splitCsvLine(line) {
  const fields = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      fields.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  fields.push(cur);
  return fields;
}

/** @returns {object[]} one object per CSV data row, keyed by CSV_COLUMNS. */
export function loadRedirectRows(path = CSV_PATH) {
  const text = readFileSync(path, 'utf8').replace(/\r\n/g, '\n').replace(/^﻿/, '');
  const lines = text.split('\n').filter((l) => l.length > 0);
  const [, ...dataLines] = lines; // first line is the header, already known (CSV_COLUMNS)
  return dataLines.map((line) => {
    const fields = splitCsvLine(line);
    const row = {};
    CSV_COLUMNS.forEach((col, i) => {
      // NFC — the CSV itself stores at least one path (the "ñ" in
      // .../diseñar-un-logotipo-exitoso/) in NFD (decomposed) form;
      // real browsers normalize typed/pasted URLs to NFC before
      // requesting them, so an NFD-named directory on a byte-exact
      // filesystem (GitHub Pages) would silently 404 for everyone.
      row[col] = (fields[i] ?? '').trim().normalize('NFC');
    });
    return row;
  });
}

const ARTICULO_RE = /Artículo\s+([A-Z]+-\d+)/u;

// The Plan_Transición xlsx's own "Destinos" sheet assumes category
// slugs that don't match what's actually implemented in
// blog-pillars.mjs (7 of 9 differ, e.g. it assumes
// "estrategia-de-marketing", the live site uses
// "estrategia-contenidos"). An "Artículo <ID> →" row never hits this —
// it always resolves through the live PILLARS config directly (see
// resolveRow below) — but 2 rows in the CSV (/marketing/,
// /inteligencia-artificial/) reference a category path literally, with
// the plan's assumed slug baked in. Remapped here instead of trusting
// that text.
const LEGACY_CATEGORY_SLUG_MAP = {
  'estrategia-de-marketing': 'estrategia-contenidos',
  'ia-aplicada-al-marketing': 'ia-marketing',
  'branding-y-diseno': 'branding-diseno',
  'web-seo-y-publicidad': 'web-seo-publicidad',
  'video-y-fotografia': 'video-fotografia',
  'eventos-y-medios': 'eventos-medios',
  'marketing-por-industria': 'marketing-industria',
  // redes-sociales and relaciones-publicas already match the plan 1:1.
};

function remapLegacyCategoryPath(path) {
  const m = path.match(/^\/blog\/categoria\/([^/]+)\/$/);
  if (!m) return path;
  const real = LEGACY_CATEGORY_SLUG_MAP[m[1]];
  return real ? `/blog/categoria/${real}/` : path;
}

/**
 * Resolves one CSV row to its current destination.
 * @returns {{conserved:true}|{path:string, kind:'fixed'|'article'|'category'|'blog-index', targetId?:string}}
 */
export function resolveRow(row, { backlogPosts, publishedPosts }) {
  if (row.accion_final.startsWith('200')) {
    return { conserved: true };
  }

  const m = row.destino_final.match(ARTICULO_RE);
  if (!m) {
    // No "Artículo <ID> →" reference — destino_final (or, as a
    // fallback, ruta_destino_al_corte) is already a literal relative
    // path (/#contacto, /proyectos/, /, /#servicios, /blog/...).
    const literal = row.destino_final.startsWith('/') ? row.destino_final : row.ruta_destino_al_corte;
    return { path: remapLegacyCategoryPath(literal), kind: 'fixed' };
  }

  const targetId = m[1];
  const published = publishedPosts.find((p) => p.id === targetId);
  if (published) {
    return { path: `/blog/${published.slug}/`, kind: 'article', targetId, title: published.title };
  }

  const backlogRow = backlogPosts.find((p) => p.id === targetId);
  const pillar = backlogRow ? pillarByNombre(backlogRow.pilar) : null;
  if (pillar) {
    const pillarHasPublished = publishedPosts.some((p) => p.pilar === pillar.codigo);
    if (pillarHasPublished) {
      return { path: `/blog/categoria/${pillar.slug}/`, kind: 'category', targetId };
    }
  }

  return { path: '/blog/', kind: 'blog-index', targetId };
}

/** Full resolved list — every 301 row from the CSV with its current
 *  destination, plus the 2 conserved ("200 · misma URL") rows flagged
 *  so callers can skip them (they're handled by ruta_heredada, not a
 *  redirect at all). */
export function resolveAllRedirects() {
  const rows = loadRedirectRows();
  const { posts: backlogPosts } = loadBacklog();
  const publishedPosts = loadPosts().filter((p) => p.status === 'Publicado');

  return rows.map((row) => ({
    ...row,
    resolved: resolveRow(row, { backlogPosts, publishedPosts }),
  }));
}

/** site-root-relative dir segments for a CSV ruta_origen, e.g.
 *  '/2013/04/historia-de-la-publicidad-en-mexico/' -> '2013/04/historia-de-la-publicidad-en-mexico'. */
export function dirPathFromRuta(rutaOrigen) {
  return rutaOrigen.replace(/^\/|\/$/g, '');
}
