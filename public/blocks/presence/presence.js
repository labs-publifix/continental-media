/**
 * Continental Media — "Nuestra Presencia" scroll reveals.
 * Three independent one-shot IntersectionObservers, matching the block's
 * natural reading order (intro -> map/pins/cards -> leadership), each
 * adding .is-visible to its own trigger element the first time it enters
 * the viewport:
 *   1. The section itself — reveals the intro text column
 *      (presence.css fades/rises it via .cm-presence.is-visible).
 *   2. The map — drops the two pins in and cascades the three data cards
 *      (presence.css keys both off .cm-presence.is-visible too, but this
 *      observer watches the map specifically so the pins' drop-in timing
 *      matches when the map itself is actually on screen).
 *   3. The leadership row — fades/rises the two leader cards in,
 *      naturally later than the map/cards since it sits lower on the
 *      page and enters the viewport after them.
 * If this script never runs (JS disabled), the block's <noscript> rule
 * forces everything visible; prefers-reduced-motion does the same via
 * CSS regardless of JS.
 */
(function () {
  'use strict';

  var section = document.querySelector('[data-cm-presence]');
  if (!section) return;

  var map = section.querySelector('[data-cm-presence-map]');
  var leadership = section.querySelector('.cm-presence__leadership');

  if (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    section.classList.add('is-visible');
    if (map) map.classList.add('is-visible');
    if (leadership) {
      leadership.querySelectorAll('[data-cm-presence-leader]').forEach(function (leader) {
        leader.classList.add('is-visible');
      });
    }
    return;
  }

  function revealOnce(el, threshold) {
    if (!el) return;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: threshold }
    );
    observer.observe(el);
  }

  revealOnce(section, 0.15);
  revealOnce(map, 0.4);

  if (leadership) {
    var leaderObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            leaderObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    leadership.querySelectorAll('[data-cm-presence-leader]').forEach(function (leader) {
      leaderObserver.observe(leader);
    });
  }
})();
