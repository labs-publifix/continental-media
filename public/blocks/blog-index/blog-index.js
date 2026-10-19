/**
 * Continental Media — blog index scroll entrance.
 * One-shot IntersectionObserver adds .is-visible to the section (hero,
 * filter rows, pagination fade/rise in via CSS once that class lands —
 * see blog-index.css). No card-grid stagger here: blog-card items get
 * their own reveal treatment from the page that wraps them (see
 * generate-blog.mjs), same as Proyectos' cm-projects__card-item does
 * for its own grid rather than this shared index block owning it.
 * If IntersectionObserver isn't available, everything renders already
 * visible; the page's own <noscript> rule covers the no-JS case
 * independently of this script.
 */
(function () {
  'use strict';

  var section = document.querySelector('[data-cm-blog-index]');
  if (!section) return;

  if (!('IntersectionObserver' in window)) {
    section.classList.add('is-visible');
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          section.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  observer.observe(section);
})();
