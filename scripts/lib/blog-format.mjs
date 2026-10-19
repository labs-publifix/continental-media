/**
 * Continental Media — shared blog formatting helpers.
 * Used by blog-card-template.mjs, the index/article generators, the OG
 * image generator and the RSS feed — kept in one place so "Artículo" vs
 * "Guía", date formatting and reading-time math can't drift between them.
 */

const MESES_LARGOS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
const MESES_CORTOS = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

/**
 * @param {string} isoDate - 'YYYY-MM-DD'
 * @param {{ long?: boolean }} [options] - long: "19 de octubre de 2026"
 *   (article bylines). Default short: "19 oct 2026" (cards).
 */
export function formatDateEs(isoDate, options = {}) {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-').map(Number);
  const day = d;
  if (options.long) {
    return `${day} de ${MESES_LARGOS[m - 1]} de ${y}`;
  }
  return `${day} ${MESES_CORTOS[m - 1]} ${y}`;
}

/** 'Editorial' -> Artículo copy; 'Guía práctica' -> Guía copy. */
export function tipoLabels(tipo) {
  const isGuia = tipo === 'Guía práctica';
  return {
    isGuia,
    typeBadge: isGuia ? 'Guía' : 'Artículo',
    ctaText: isGuia ? 'Leer la guía' : 'Leer el artículo',
    ariaVerb: isGuia ? 'Leer la guía' : 'Leer el artículo',
    kind: isGuia ? 'guia' : 'articulo',
  };
}

/** ~200 wpm Spanish reading speed, rounded up, minimum 1. */
export function readingMinutes(wordCount) {
  return Math.max(1, Math.round(wordCount / 200));
}

export function wordCount(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Zero-padded consecutive card/article number, e.g. 1 -> "01". */
export function padNumber(n, width = 2) {
  return String(n).padStart(width, '0');
}
