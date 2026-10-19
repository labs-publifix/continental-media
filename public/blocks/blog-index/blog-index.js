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
 * The observer's TARGET is the hero, not the whole (potentially very
 * tall, paginated) section — threshold is a ratio of the TARGET's own
 * area, so observing the full section made the ratio depend on total
 * page length and could fail to fire on load on a long/narrow mobile
 * layout (same bug fixed in blog-article.js — see its comment).
 */
(function () {
  'use strict';

  var section = document.querySelector('[data-cm-blog-index]');
  if (!section) return;

  if (!('IntersectionObserver' in window)) {
    section.classList.add('is-visible');
    return;
  }

  var hero = section.querySelector('.cm-blog-index-hero') || section;
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
  observer.observe(hero);
})();
