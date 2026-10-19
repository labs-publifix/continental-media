/**
 * Continental Media — blog article behavior.
 *
 * 1. Scroll entrance: one-shot IntersectionObserver adds .is-visible to
 *    the article (hero fade/rise — see blog-article.css). The body,
 *    FAQs, author box etc. render already visible; only the hero gets
 *    the entrance treatment, matching the blog-index hero. The
 *    observer's TARGET is the hero itself, not the whole (very tall)
 *    article element — threshold is a ratio of the TARGET's own area,
 *    so observing the full article made the ratio depend on total
 *    page length: on a long guide viewed on a narrow/tall mobile
 *    layout, the hero's visible slice at load could be under the 0.1
 *    ratio of the ENTIRE article, so the callback never fired on load
 *    and only did once scrolling changed the ratio — hero stayed
 *    invisible (opacity 0) the whole time, reading as a blank black
 *    screen. Observing the hero directly keeps the ratio bounded to
 *    ~viewport-vs-hero size regardless of how long the article is.
 * 2. Active TOC section: on desktop (where the sidebar TOC is actually
 *    shown — see the CSS breakpoint), an IntersectionObserver watching
 *    a thin band near the top of the viewport toggles .is-active on
 *    whichever TOC link points at the H2/H3 currently in that band.
 *    Pure enhancement — every TOC link already works as a plain
 *    same-page anchor without this; it only adds the "you are here"
 *    highlight.
 * If IntersectionObserver isn't available, everything renders already
 * visible and the TOC simply never highlights an active section; the
 * page's own <noscript> rule covers the no-JS case independently.
 */
(function () {
  'use strict';

  var article = document.querySelector('[data-cm-blog-article]');
  if (!article) return;

  if (!('IntersectionObserver' in window)) {
    article.classList.add('is-visible');
    return;
  }

  var hero = article.querySelector('.cm-blog-article__hero') || article;
  var heroObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          article.classList.add('is-visible');
          heroObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  heroObserver.observe(hero);

  var tocLinks = Array.prototype.slice.call(article.querySelectorAll('.cm-blog-article__toc-list a'));
  if (tocLinks.length === 0) return;

  var targets = tocLinks
    .map(function (link) {
      var id = link.getAttribute('href').replace('#', '');
      var heading = document.getElementById(id);
      return heading ? { link: link, heading: heading } : null;
    })
    .filter(Boolean);
  if (targets.length === 0) return;

  var activeHeading = null;

  function setActive(heading) {
    activeHeading = heading;
    targets.forEach(function (t) {
      t.link.classList.toggle('is-active', t.heading === heading);
    });
  }

  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive(entry.target);
        }
      });
    },
    { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
  );

  targets.forEach(function (t) {
    sectionObserver.observe(t.heading);
  });
})();
