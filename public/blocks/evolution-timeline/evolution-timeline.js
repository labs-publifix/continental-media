/**
 * Continental Media — "Un Equipo en Constante Evolución" scroll behavior.
 * Two independent effects, both progressive enhancements:
 *   1. Per-milestone reveal: each <li> fades/rises in the first time it
 *      enters the viewport (one-shot IntersectionObserver per item), so
 *      the four milestones light up in sequence as the visitor scrolls
 *      past them — no manual stagger delays needed, the scroll order
 *      does it naturally.
 *   2. Connecting-line draw: the SVG line's stroke-dashoffset is tied to
 *      the track's scroll position (a real scrub, not a one-shot
 *      trigger), so the line visibly draws itself as the visitor scrolls
 *      through the section.
 * If this script never runs (JS disabled), the block's <noscript> rule
 * forces every item visible and the line fully drawn. Under
 * prefers-reduced-motion, both effects render in their final state
 * immediately and the scroll listener never attaches.
 */
(function () {
  'use strict';

  var section = document.querySelector('[data-cm-timeline]');
  if (!section) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- 1. Per-milestone reveal ---
  var items = section.querySelectorAll('[data-cm-timeline-item]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach(function (item) {
      item.classList.add('is-visible');
    });
  } else {
    var itemObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            itemObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    items.forEach(function (item) {
      itemObserver.observe(item);
    });
  }

  // --- 2. Connecting-line scroll-scrubbed draw ---
  var track = section.querySelector('[data-cm-timeline-track]');
  var progressLines = section.querySelectorAll('[data-cm-timeline-progress]');
  if (!track || !progressLines.length) return;

  if (reduceMotion) {
    progressLines.forEach(function (line) {
      line.style.strokeDashoffset = '0';
    });
    return;
  }

  var ticking = false;

  function updateLineProgress() {
    ticking = false;
    var rect = track.getBoundingClientRect();
    var viewportH = window.innerHeight;
    var start = viewportH * 0.85;
    var end = viewportH * 0.2;
    var raw = (start - rect.top) / (start - end);
    var progress = Math.max(0, Math.min(1, raw));
    var dashoffset = 100 - progress * 100;
    progressLines.forEach(function (line) {
      line.style.strokeDashoffset = String(dashoffset);
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateLineProgress);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateLineProgress();
})();
