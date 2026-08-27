/**
 * Continental Media — "Nuestro ADN" scroll reveal.
 * Adds .is-visible to the section the first time it enters the viewport,
 * which dna.css uses to fade + rise the column in. One-shot: the
 * observer stops after firing. If this script never runs (JS disabled),
 * the block's <noscript> rule and the prefers-reduced-motion override in
 * the CSS both force the final visible state on their own.
 */
(function () {
  'use strict';

  var section = document.querySelector('[data-cm-dna]');
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
    { threshold: 0.25 }
  );

  observer.observe(section);
})();
