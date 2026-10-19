/**
 * Continental Media — home blog teaser scroll entrance.
 * One-shot IntersectionObserver adds .is-visible (intro fade/rise,
 * cards scale in staggered, CTA fades in — see blog-teaser.css),
 * same pattern as every other home teaser (Proyectos, Testimonios).
 * Guard clause at the top: when zero posts are published the
 * generator omits the whole <section> from index.html (see
 * blog-teaser.html's own note on this), so this script is a no-op
 * then — loaded unconditionally regardless, same as every other
 * block's script tag.
 */
(function () {
  'use strict';

  var section = document.querySelector('[data-cm-blog-teaser]');
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
