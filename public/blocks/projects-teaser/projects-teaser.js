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
 *    the clicked card's own color "expands" to cover the viewport
 *    before the browser actually navigates, so the teaser and the
 *    (future) case-study page feel continuous instead of an abrupt cut.
 *    Implemented as a single fixed overlay sized/positioned to exactly
 *    match the clicked card's rect (a one-time layout write, not
 *    animated) and then scaled up via `transform` alone — the brief
 *    asks to prioritize animating transform/opacity, and a raw
 *    width/height/top/left animation would fight that. Every card's
 *    href is a real link throughout: a modified click, a middle click,
 *    or JS never loading all still navigate normally.
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
  var TRANSITION_MS = 420;

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

        var rect = link.getBoundingClientRect();
        var cardBg = getComputedStyle(link).backgroundColor;
        var viewportDiagonal = Math.sqrt(
          window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight
        );
        var cardDiagonal = Math.sqrt(rect.width * rect.width + rect.height * rect.height);
        var scale = (viewportDiagonal / cardDiagonal) * 1.5;

        overlay.style.transition = 'none';
        overlay.style.top = rect.top + 'px';
        overlay.style.left = rect.left + 'px';
        overlay.style.width = rect.width + 'px';
        overlay.style.height = rect.height + 'px';
        overlay.style.background = cardBg;
        overlay.style.transform = 'scale(1)';
        overlay.classList.add('is-active');

        // Force a reflow so the "none" transition + starting transform
        // above commit before switching to the real transition below —
        // otherwise the browser could coalesce both into one frame and
        // skip straight to the end state with no visible expansion.
        void overlay.offsetWidth;

        overlay.style.transition =
          'transform ' + TRANSITION_MS + 'ms cubic-bezier(0.65, 0, 0.35, 1), ' +
          'opacity ' + TRANSITION_MS + 'ms ease-out';
        overlay.style.transform = 'scale(' + scale + ')';

        window.setTimeout(function () {
          window.location.href = href;
        }, TRANSITION_MS);
      });
    });
  }
})();
