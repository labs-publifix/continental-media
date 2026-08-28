/**
 * Continental Media — service pillar page behavior.
 *
 * Two independent pieces:
 *
 * 1. Scroll entrance: one-shot IntersectionObservers add .is-visible to
 *    the section (hero fade/rise) and .is-revealed to each row
 *    (staggered fade/rise), matching the site's house reveal-on-scroll
 *    pattern. If IntersectionObserver isn't available, everything is
 *    revealed immediately; the page's own <noscript> rule covers the
 *    no-JS case independently of this script.
 *
 * 2. Row activation: every row already gets the full-bleed accent
 *    background on desktop/keyboard for free via pillar-page.css's
 *    :hover / :focus-visible (the <li> itself carries tabindex="0" in
 *    markup so it's reachable and activatable by keyboard, per the
 *    brief) — those rules are scoped inside @media (hover: hover) and
 *    (pointer: fine), so they never fire on touch at all. That gate
 *    matters: some touch browsers synthesize a "sticky" :hover/:focus
 *    on tap that never clears on its own, which is what used to leave
 *    more than one row highlighted at once on mobile. Touch instead
 *    gets .is-active driven purely by scroll position here: on touch
 *    only (matchMedia('(hover: none), (pointer: coarse)')) this script
 *    watches a thin band at the vertical center of the viewport via
 *    IntersectionObserver, and whichever row is closest to that center
 *    gets .is-active — applyActiveRow() always clears every other row
 *    first, so exactly one is ever active, matching the brief's "solo
 *    una fila puede estar activa a la vez".
 */
(function () {
  'use strict';

  var section = document.querySelector('[data-cm-pillar]');
  if (!section) return;

  var rows = Array.prototype.slice.call(section.querySelectorAll('[data-cm-pillar-row]'));

  // --- 1. Scroll entrance ---
  if (!('IntersectionObserver' in window)) {
    section.classList.add('is-visible');
    rows.forEach(function (row) {
      row.classList.add('is-revealed');
    });
  } else {
    var heroObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            section.classList.add('is-visible');
            heroObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    heroObserver.observe(section);

    var rowRevealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            rowRevealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    rows.forEach(function (row) {
      rowRevealObserver.observe(row);
    });
  }

  // --- 2. Touch scroll-driven single-row activation ---
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (!isTouch || !('IntersectionObserver' in window) || rows.length === 0) return;

  var centered = new Set();

  function applyActiveRow() {
    if (centered.size === 0) {
      rows.forEach(function (row) {
        row.classList.remove('is-active');
      });
      return;
    }

    var viewportCenter = window.innerHeight / 2;
    var closest = null;
    var closestDistance = Infinity;

    centered.forEach(function (row) {
      var rect = row.getBoundingClientRect();
      var rowCenter = rect.top + rect.height / 2;
      var distance = Math.abs(rowCenter - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = row;
      }
    });

    rows.forEach(function (row) {
      row.classList.toggle('is-active', row === closest);
    });
  }

  var centerBandObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          centered.add(entry.target);
        } else {
          centered.delete(entry.target);
        }
      });
      applyActiveRow();
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );

  rows.forEach(function (row) {
    centerBandObserver.observe(row);
  });
})();
