/**
 * Continental Media — internal page hero load entrance.
 * Adds .is-loaded once the page has finished loading (fonts/images
 * settled enough to avoid a flash), which page-hero.css uses to fade +
 * rise the title/subtitle in. If this script never runs (JS disabled),
 * the block's <noscript> rule forces the final visible state; under
 * prefers-reduced-motion the CSS does the same regardless of JS.
 */
(function () {
  'use strict';

  var hero = document.querySelector('[data-cm-page-hero]');
  if (!hero) return;

  function reveal() {
    hero.classList.add('is-loaded');
  }

  if (document.readyState === 'complete') {
    reveal();
  } else {
    window.addEventListener('load', reveal, { once: true });
  }
})();
