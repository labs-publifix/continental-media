/**
 * Continental Media — reader for content/blog/Backlog_Blog_Continental_Media.xlsx.
 *
 * READ-ONLY from the Node side. This file is the single place every blog
 * build script (index/pagination, sitemap, RSS, redirects, cross-link
 * resolution, the "siguiente artículo" status report) gets backlog data
 * from — never hand-copy a row's content elsewhere.
 *
 * Status changes go the OTHER direction: scripts/blog/update_backlog_status.py
 * (openpyxl, not this file) is what writes back to the .xlsx, specifically
 * because openpyxl preserves the workbook's formulas (Mes de publicación,
 * Día, Semana, Lote are all formula-derived columns) and formatting on
 * save, which the `xlsx` (SheetJS) package used here does not reliably do
 * — this module only ever reads.
 *
 * Usage: `node --experimental-vm-modules` not needed; plain ESM import.
 *   import { loadBacklog } from './lib/blog-backlog.mjs';
 *   const { posts, pillars, crossLinks, redirects } = loadBacklog();
 */
import XLSX from 'xlsx';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_PATH = resolve(__dirname, '..', '..', 'content', 'blog', 'Backlog_Blog_Continental_Media.xlsx');

function sheetRows(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found in backlog workbook.`);
  // raw:false -> formatted strings for most cells; we want raw values and
  // real JS Dates instead, so raw:true + cellDates (set when reading the
  // workbook below) and handle blanks ourselves.
  return XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true, defval: null });
}

function toISODate(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string') {
    // Already ISO-ish from a formula-evaluated string cell.
    const m = value.match(/^\d{4}-\d{2}-\d{2}/);
    if (m) return m[0];
  }
  return null;
}

function splitIds(value) {
  if (!value || typeof value !== 'string') return [];
  return value
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
}

// Columns T, Y, Z, AA (mesPublicacion/dia/semana/lote) are formula-derived
// in the workbook (see Esquema), e.g.:
//   T  =CHOOSE(MONTH(X2),"Ene",...,"Dic")&" "&YEAR(X2)
//   Y  =CHOOSE(WEEKDAY(X2,2),"lunes",...,"domingo")
//   Z  =INT((X2-MIN($X$2:$X$101))/7)+1
//   AA =IF(X2=MIN($X$2:$X$101),"Lanzamiento","Calendario semanal")
// openpyxl (the only thing that writes this file — see
// update_backlog_status.py) has no formula engine: saving a workbook it
// loaded discards Excel's cached results for these cells, leaving them
// blank. The `xlsx` package used here is also read-only w.r.t. formulas
// (it reads whatever cached value is present, computing nothing), so
// after any Python-side edit these four columns would silently read as
// null. We recompute them ourselves from fechaPublicacion instead of
// ever trusting the spreadsheet's own cached formula output.
const MESES_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const DIAS_ES = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const DAY_MS = 24 * 60 * 60 * 1000;

function computeCalendarFields(posts) {
  const times = posts
    .map((p) => (p.fechaPublicacion ? Date.parse(`${p.fechaPublicacion}T00:00:00Z`) : null))
    .filter((t) => t !== null && !Number.isNaN(t));
  if (times.length === 0) return;
  const minTime = Math.min(...times);

  for (const p of posts) {
    if (!p.fechaPublicacion) continue;
    const t = Date.parse(`${p.fechaPublicacion}T00:00:00Z`);
    if (Number.isNaN(t)) continue;
    const d = new Date(t);
    p.mesPublicacion = `${MESES_ES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
    const isoWeekday = d.getUTCDay() === 0 ? 7 : d.getUTCDay(); // WEEKDAY(.,2): Mon=1..Sun=7
    p.dia = DIAS_ES[isoWeekday - 1];
    p.semana = Math.floor((t - minTime) / (7 * DAY_MS)) + 1;
    p.lote = t === minTime ? 'Lanzamiento' : 'Calendario semanal';
  }
}

/**
 * @param {string} [path] - override path to the .xlsx (defaults to the
 *   committed content/blog/ copy).
 */
export function loadBacklog(path = DEFAULT_PATH) {
  const workbook = XLSX.readFile(path, { cellDates: true });

  // ---------- Backlog ----------
  const backlogRows = sheetRows(workbook, 'Backlog');
  const posts = backlogRows.slice(1).filter((r) => r[0]).map((r) => ({
    id: String(r[0]).trim(),
    tipo: r[1], // 'Editorial' | 'Guía práctica'
    tituloTentativo: r[2],
    pilar: r[3],
    keywordSemilla: r[4],
    intencion: r[5],
    embudo: r[6],
    objetivoSeo: r[7],
    audiencia: r[8],
    mercado: r[9],
    origen: r[10], // 'Re-redacción 2026' | 'Nuevo'
    articuloBaseUrl: r[11] || null,
    postsAConsolidar: r[12] || null,
    anguloActualizacion: r[13] || null,
    entregablePdf: r[14] && r[14] !== '—' ? r[14] : null,
    servicioAImpulsar: r[15],
    cruces: splitIds(r[16]),
    prioridad: r[17],
    orden: typeof r[18] === 'number' ? r[18] : Number(r[18]) || null,
    // mesPublicacion/dia/semana/lote (formerly read raw from r[19]/r[24]/
    // r[25]/r[26]) are recomputed below by computeCalendarFields — see
    // the comment above that function for why.
    mesPublicacion: null,
    volumen: r[20],
    dificultad: r[21],
    estado: r[22] || 'Idea',
    fechaPublicacion: toISODate(r[23]),
    dia: null,
    semana: null,
    lote: null,
  }));
  posts.sort((a, b) => (a.orden ?? 9999) - (b.orden ?? 9999));
  computeCalendarFields(posts);

  // ---------- Pilares ----------
  const pilarRows = sheetRows(workbook, 'Pilares');
  const pillars = pilarRows
    .slice(1)
    .filter((r) => r[0] && r[1] && r[1] !== 'Total')
    .map((r) => ({
      codigo: r[0],
      nombre: r[1],
      servicio: r[2],
      editoriales: r[3],
      guias: r[4],
      total: r[5],
    }));

  // ---------- Cruces ----------
  const cruceRows = sheetRows(workbook, 'Cruces');
  const crossLinks = cruceRows.slice(1).filter((r) => r[0] && r[2]).map((r) => ({
    fromId: String(r[0]).trim(),
    fromTitle: r[1],
    toId: String(r[2]).trim(),
    toTitle: r[3],
    tipo: r[4],
  }));

  // ---------- Posts actuales (redirects) ----------
  // activateOn (column I) is itself a formula in the workbook:
  //   =IF(OR(D2="Consolidar",D2="Re-redactar v2026",D2="Actualizar v2026"),
  //       IFERROR(INDEX(Backlog!$X$2:$X$101,MATCH(E2,Backlog!$A$2:$A$101,0)),""),"")
  // i.e. "the target post's own fechaPublicacion, but only for these 3
  // decisions". Same openpyxl-strips-cached-formulas problem as
  // computeCalendarFields() above, so recomputed here in JS from
  // `posts` (already loaded, fechaPublicacion is a literal cell, not a
  // formula) instead of ever trusting column I's cached value.
  const ACTIVATES_ON_TARGET_PUBLISH = new Set(['Consolidar', 'Re-redactar v2026', 'Actualizar v2026']);
  const fechaPublicacionById = new Map(posts.map((p) => [p.id, p.fechaPublicacion]));

  const redirectRows = sheetRows(workbook, 'Posts actuales');
  const redirects = redirectRows
    .slice(1)
    .filter((r) => r[0] && r[4]) // only rows with a resolved target ID
    .map((r) => {
      const decision = r[3];
      const targetId = String(r[4]).trim();
      const activateOn = ACTIVATES_ON_TARGET_PUBLISH.has(decision) ? fechaPublicacionById.get(targetId) || null : null;
      return {
        fromUrl: r[0],
        year: r[1],
        lastModified: r[2],
        decision,
        targetId,
        targetTitle: r[5],
        action: r[6],
        note: r[7],
        activateOn,
      };
    });

  return { posts, pillars, crossLinks, redirects, path };
}

/** Convenience: posts with Estado === 'Publicado', in publish-date order. */
export function publishedPosts(posts) {
  return posts
    .filter((p) => p.estado === 'Publicado')
    .sort((a, b) => (a.fechaPublicacion || '').localeCompare(b.fechaPublicacion || ''));
}

/** Look up one backlog row by ID (e.g. 'E-01', 'G-07'). */
export function findById(posts, id) {
  return posts.find((p) => p.id === id) || null;
}
