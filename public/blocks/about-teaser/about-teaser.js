/**
 * Continental Media — "Nosotros" teaser scroll reveal.
 * Adds .is-visible to the section the first time it enters the viewport,
 * which about-teaser.css uses to stagger in the text block and photo grid.
 * One-shot: once revealed, the observer stops watching. If this script
 * never runs (JS disabled), the block's <noscript> rule and the
 * prefers-reduced-motion override in the CSS both force the final
 * visible state on their own — this file is a progressive enhancement.
 */
(function () {
  'use strict';

  var section = document.querySelector('[data-cm-about]');
  if (!section) return;

  if (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    section.classList.add('is-visible');
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          section.classList.add('is-visible');
          observer.unobserve(section);
        }
      });
    },
    { threshold: 0.15 }
  );

  observer.observe(section);
})();
