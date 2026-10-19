/**
 * Continental Media — tiny shared HTML-escaping helper for the blog
 * generators. Mirrors the local escapeHtml() already duplicated in
 * scripts/generate-pillar-pages.mjs / generate-case-study-pages.mjs;
 * factored out here so the blog's own templates (card, index, article)
 * share one implementation instead of re-copying it again.
 */
export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function slugify(str) {
  return String(str)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritics left by NFD
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
