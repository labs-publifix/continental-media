/**
 * Continental Media — 404 page behavior.
 *
 * 1. Keyword suggestion: reads the REQUESTED path (not a query param —
 *    there isn't one here) from document.referrer-independent
 *    window.location.pathname, normalizes it (strip accents, lowercase,
 *    non-letters -> space) and matches it against an ordered keyword
 *    table to propose the closest service or blog category. Pure
 *    client-side, no backend — first match wins, so more specific
 *    keywords are listed before generic ones.
 * 2. Analytics: pushes a '404' event (path + referrer) to
 *    window.dataLayer (the GA4/GTM convention) — the site has no
 *    analytics tool wired in yet, but this is the standard async-safe
 *    way to queue the event for whenever one is: GTM/GA4 reads
 *    whatever already sat in dataLayer once it loads, so this needs no
 *    change later, only installing the tag itself.
 */
(function () {
  'use strict';

  var KEYWORD_MAP = [
    { keywords: ['inteligencia artificial', 'ia aplicada'], href: 'servicios/ai-marketing-solutions/', label: 'AI Marketing Solutions' },
    { keywords: ['seo', 'posicionamiento'], href: 'servicios/marketing-digital/', label: 'Marketing Digital — Posicionamiento SEO' },
    { keywords: ['red social', 'redes sociales', 'instagram', 'facebook', 'tiktok'], href: 'servicios/marketing-digital/', label: 'Marketing Digital — Redes Sociales' },
    { keywords: ['publicidad', 'ads', 'anuncio'], href: 'servicios/marketing-digital/', label: 'Marketing Digital — Publicidad' },
    { keywords: ['video', 'fotografia', 'foto'], href: 'servicios/produccion/', label: 'Producción Audiovisual' },
    { keywords: ['branding', 'diseno', 'logo', 'logotipo', 'identidad'], href: 'servicios/marketing-tradicional/', label: 'Marketing Tradicional — Branding y Diseño' },
    { keywords: ['evento', 'radio', 'medio', 'exterior'], href: 'servicios/relaciones-publicas/', label: 'Relaciones Públicas — Eventos y Medios' },
    { keywords: ['portfolio', 'portafolio', 'proyecto', 'caso de exito'], href: 'proyectos/', label: 'Proyectos' },
    { keywords: ['blog', 'articulo', 'noticia', 'guia'], href: 'blog/', label: 'Blog' },
    { keywords: ['contacto'], href: 'index.html#contacto', label: 'Contacto' },
    { keywords: ['nosotros', 'equipo', 'agencia'], href: 'nosotros.html', label: 'Nosotros' },
    { keywords: ['marketing'], href: 'index.html#servicios', label: 'Servicios' },
  ];

  function normalize(str) {
    return str
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '') // strip accents
      .toLowerCase()
      .replace(/[^a-z]+/g, ' ');
  }

  function suggest() {
    var box = document.querySelector('[data-cm-404-suggestion]');
    var link = document.querySelector('[data-cm-404-suggestion-link]');
    if (!box || !link) return;

    var normalized = normalize(decodeURIComponent(window.location.pathname));
    var match = KEYWORD_MAP.find(function (entry) {
      return entry.keywords.some(function (kw) {
        return normalized.indexOf(kw) !== -1;
      });
    });
    if (!match) return;

    link.href = match.href;
    link.textContent = match.label;
    box.hidden = false;
  }

  function trackNotFound() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: '404',
      path: window.location.pathname + window.location.search,
      referrer: document.referrer || null,
    });
  }

  suggest();
  trackNotFound();
})();
