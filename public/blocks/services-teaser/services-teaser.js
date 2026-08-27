/**
 * Continental Media — "Servicios" teaser behavior.
 *
 * Three independent, progressively-enhanced pieces:
 *
 * 1. Scroll entrance: adds .is-visible to the section the first time it
 *    enters the viewport (one-shot IntersectionObserver), which
 *    services-teaser.css uses to fade/rise the intro in, then cascade
 *    the 5 pillar rows.
 *
 * 2. Touch tap-to-expand: each pillar trigger is a real <a href> so
 *    desktop/keyboard get native link behavior — hover or focus reveals
 *    the subservice chips via pure CSS *before* any activation, so a
 *    single click/Enter always navigates straight through (the preview
 *    already happened via hover/focus-within, see the CSS). Touch has no
 *    hover step, so a tap IS the only signal — the brief explicitly asks
 *    for tap-to-expand/collapse there, which would conflict with also
 *    being a link. Resolution: on touch only (matchMedia('(hover: none),
 *    (pointer: coarse)')), the FIRST tap on a collapsed pillar is
 *    intercepted (preventDefault) to expand it instead of navigating —
 *    mirroring what hover/focus already gives everyone else for free — a
 *    SECOND tap on an already-expanded pillar is left alone and follows
 *    the link normally. Expanding one pillar collapses any other
 *    (accordion, one open at a time, per the brief's mobile guidance).
 *
 * 3. Desktop cursor follower (progressive enhancement, desktop/mouse
 *    only): a small "Ver más" pill tracks the pointer while it's inside
 *    the pillar list, reinforcing that the whole row is clickable.
 *    rAF-throttled so it costs nothing beyond a single transform write
 *    per frame.
 *
 * If this script never runs (JS disabled), the block's <noscript> rule
 * forces the intro/pillars visible and every panel open; prefers-
 * reduced-motion removes the transitions via CSS regardless of JS.
 */
(function () {
  'use strict';

  var section = document.querySelector('[data-cm-services]');
  if (!section) return;

  // --- 1. Scroll entrance ---
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

  // --- 2. Touch tap-to-expand / tap-to-follow ---
  var pillars = section.querySelectorAll('[data-cm-services-pillar]');
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (isTouch) {
    pillars.forEach(function (pillar) {
      var trigger = pillar.querySelector('[data-cm-services-trigger]');
      if (!trigger) return;

      trigger.addEventListener('click', function (event) {
        var expanded = pillar.classList.contains('is-expanded');
        if (expanded) return; // second tap: let the link navigate normally

        event.preventDefault();
        pillars.forEach(function (p) {
          if (p !== pillar) {
            p.classList.remove('is-expanded');
            var t = p.querySelector('[data-cm-services-trigger]');
            if (t) t.setAttribute('aria-expanded', 'false');
          }
        });
        pillar.classList.add('is-expanded');
        trigger.setAttribute('aria-expanded', 'true');
      });
    });
  }

  // --- 3. Desktop cursor follower ---
  var list = section.querySelector('[data-cm-services-list]');
  var cursor = section.querySelector('[data-cm-services-cursor]');
  if (
    !list ||
    !cursor ||
    !window.matchMedia('(hover: hover) and (pointer: fine)').matches
  ) {
    return;
  }

  var ticking = false;
  var pendingX = 0;
  var pendingY = 0;

  function applyCursorPosition() {
    ticking = false;
    cursor.style.transform =
      'translate3d(' + pendingX + 'px, ' + pendingY + 'px, 0) translate(-50%, -50%)';
  }

  list.addEventListener('mouseenter', function () {
    cursor.classList.add('is-visible');
  });

  list.addEventListener('mouseleave', function () {
    cursor.classList.remove('is-visible');
  });

  list.addEventListener('mousemove', function (event) {
    pendingX = event.clientX;
    pendingY = event.clientY;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(applyCursorPosition);
    }
  });
})();
