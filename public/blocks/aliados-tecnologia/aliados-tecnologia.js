/**
 * Continental Media — "Aliados y Tecnología" block behavior.
 *
 * A single job: one-shot IntersectionObserver adds .is-visible to the
 * section, which aliados-tecnologia.css uses to cascade the eyebrow,
 * then each row's label, then that row's logos/chips (all timing is
 * plain CSS transition-delay, no per-item JS needed). If this script
 * never runs, the block's <noscript> rule forces every row statically
 * visible with zero motion — the chips are real <a> elements and the
 * logos are real <img>s throughout, so nothing here is required for
 * the section to function without JS.
 */
(function () {
  'use strict';

  var section = document.querySelector('[data-cm-aliados]');
  if (!section) return;

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            section.classList.add('is-visible');
            revealObserver.unobserve(section);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealObserver.observe(section);
  } else {
    section.classList.add('is-visible');
  }
})();
