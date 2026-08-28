/**
 * Continental Media — "Proyectos" teaser behavior.
 *
 * Three independent, progressively-enhanced pieces:
 *
 * 1. Scroll entrance: one-shot IntersectionObserver adds .is-visible to
 *    the section, which projects-teaser.css uses to fade/rise the intro
 *    in, then cascade the 6 cards and the closing CTA. If this script
 *    never runs (JS disabled), the block's <noscript> rule forces the
 *    final visible state; prefers-reduced-motion does the same via CSS
 *    regardless of JS.
 *
 * 2. Desktop cursor follower (progressive enhancement, desktop/mouse
 *    only): a small "Ver caso" pill tracks the pointer while it's
 *    inside the card grid, reinforcing that every block is clickable —
 *    the exact same rAF-throttled technique services-teaser already
 *    uses for its own cursor pill, just retargeted to this grid.
 *
 * 3. Click exit-transition: on a plain left-click (not a modified click
 *    that should open a new tab, and not under prefers-reduced-motion),
 *    a full-viewport layer fades in to the clicked card's own color
 *    before the browser actually navigates, so the jump to the
 *    case-study page feels continuous instead of an abrupt cut.
 *    Deliberately opacity-only on a layer that is always exactly
 *    viewport-sized (no rect math, no transform/scale-from-the-card
 *    geometry): an earlier version animated the clicked card's rect
 *    expanding to cover the screen, but that geometry could get stuck
 *    mid-expansion if the browser restored this page from its
 *    back/forward cache (bfcache) after the user clicked "back" from
 *    the case-study page — blocking the entire viewport with no click
 *    able to reach anything under it. This version has no persistent
 *    "mid-transition" state to get stuck in, and the pageshow listener
 *    below resets it defensively regardless. Every card's href is a
 *    real link throughout: a modified click, a middle click, or JS
 *    never loading all still navigate normally.
 */
(function () {
  'use strict';

  var section = document.querySelector('[data-cm-projects]');
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

  // --- 2. Desktop cursor follower ---
  var grid = section.querySelector('[data-cm-projects-grid]');
  var cursor = section.querySelector('[data-cm-projects-cursor]');

  if (grid && cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var ticking = false;
    var pendingX = 0;
    var pendingY = 0;

    var applyCursorPosition = function () {
      ticking = false;
      cursor.style.transform =
        'translate3d(' + pendingX + 'px, ' + pendingY + 'px, 0) translate(-50%, -50%)';
    };

    grid.addEventListener('mouseenter', function () {
      cursor.classList.add('is-visible');
    });

    grid.addEventListener('mouseleave', function () {
      cursor.classList.remove('is-visible');
    });

    grid.addEventListener('mousemove', function (event) {
      pendingX = event.clientX;
      pendingY = event.clientY;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(applyCursorPosition);
      }
    });
  }

  // --- 3. Click exit-transition ---
  var overlay = section.querySelector('[data-cm-projects-transition]');
  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var TRANSITION_MS = 260;

  function resetTransitionOverlay() {
    if (!overlay) return;
    overlay.classList.remove('is-active');
    overlay.style.background = '';
  }

  // Defensive reset regardless of which browser/scenario restores this
  // page from bfcache (Safari and Firefox fire this even on a fresh
  // load, with event.persisted false then) — guarantees the overlay is
  // never left in its active state when this page becomes visible again.
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) resetTransitionOverlay();
  });

  if (overlay) {
    section.querySelectorAll('.cm-projects__card').forEach(function (link) {
      link.addEventListener('click', function (event) {
        var isModifiedClick =
          event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

        if (event.defaultPrevented || isModifiedClick || reduceMotionQuery.matches) {
          return; // let the browser handle it natively (new tab, reduced motion, etc.)
        }

        var href = link.getAttribute('href');
        if (!href) return;

        event.preventDefault();

        overlay.style.background = getComputedStyle(link).backgroundColor;
        overlay.classList.add('is-active');

        window.setTimeout(function () {
          window.location.href = href;
        }, TRANSITION_MS);
      });
    });
  }
})();
