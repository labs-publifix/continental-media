/**
 * Continental Media — "/proyectos" index page behavior.
 *
 * Four independent, progressively-enhanced pieces:
 *
 * 1. Scroll entrance: one-shot IntersectionObserver adds .is-visible to
 *    the section root, which projects-index.css uses to fade/rise the
 *    hero in, then cascade the 9 rows via their own nth-child delays —
 *    same one-trigger-plus-stagger shape projects-teaser.css already
 *    uses for its 6 cards, not pillar-page's per-row observer. If this
 *    script never runs, the block's <noscript> rule forces the final
 *    visible state; prefers-reduced-motion does the same via CSS.
 *
 * 2. Filter chips: exactly one active at a time (a single-select, not
 *    independent toggles). Clicking a chip sets aria-pressed across the
 *    group and shows only rows whose data-filter matches (or every row,
 *    for "all"). A row being filtered out fades first (CSS), then gets
 *    `hidden` once that transition ends — collapsing its layout space
 *    and pulling it out of the tab order — rather than just opacity:0,
 *    which would leave it focusable and taking up room.
 *
 * 3. Row hover/focus dimming: knowing "every OTHER row" needs all rows
 *    at once, which a single row's own :hover can't express — this is
 *    why it's JS (mouseenter/focusin toggles .is-row-active on the list
 *    + .is-hovered on the target row) rather than a CSS :has() selector,
 *    matching the site's established convention of JS-driven interaction
 *    state classes (pillar-page's .is-active is the same shape). Gated
 *    to (hover: hover) and (pointer: fine) — touch never attaches these
 *    listeners, since the brief's own mobile spec shows every row's
 *    thumbnail/description directly, with no dimming needed.
 *
 * 4. Click exit-transition: on a plain left-click (not a modified click,
 *    not under prefers-reduced-motion), a full-viewport layer — using
 *    the clicked row's own thumbnail as its background — fades in
 *    before the browser actually navigates, so the jump to the
 *    case-study page (which opens on that same photo) feels continuous.
 *    Exact same "opacity-only, no rect math" shape as
 *    projects-teaser.js's own click transition, for the same bfcache
 *    reason documented there: every row's href is a real link
 *    throughout, so a modified click, a middle click, or JS never
 *    loading all still navigate normally.
 */
(function () {
  'use strict';

  var section = document.querySelector('[data-cm-pindex]');
  if (!section) return;

  var rows = Array.prototype.slice.call(section.querySelectorAll('[data-cm-pindex-row]'));
  var rowsList = section.querySelector('[data-cm-pindex-rows]');

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
      { threshold: 0.1 }
    );
    revealObserver.observe(section);
  } else {
    section.classList.add('is-visible');
  }

  // --- 2. Filter chips ---
  var chips = Array.prototype.slice.call(section.querySelectorAll('[data-cm-pindex-filter]'));
  var FILTER_FADE_MS = 240;

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var filter = chip.getAttribute('data-cm-pindex-filter');

      chips.forEach(function (c) {
        var isActive = c === chip;
        c.classList.toggle('is-active', isActive);
        c.setAttribute('aria-pressed', String(isActive));
      });

      rows.forEach(function (row) {
        var matches = filter === 'all' || row.getAttribute('data-filter') === filter;

        if (matches) {
          row.hidden = false;
          // Force a reflow so the browser registers the un-hidden state
          // before the class change below, or the fade-in transition
          // never runs (it would start and end in the same frame).
          void row.offsetHeight;
          row.classList.remove('is-filtered-out');
        } else {
          row.classList.add('is-filtered-out');
          window.setTimeout(function () {
            if (row.classList.contains('is-filtered-out')) row.hidden = true;
          }, FILTER_FADE_MS);
        }
      });
    });
  });

  // --- 3. Row hover/focus dimming ---
  if (rowsList && rows.length > 0 && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    rows.forEach(function (row) {
      row.addEventListener('mouseenter', function () {
        rowsList.classList.add('is-row-active');
        row.classList.add('is-hovered');
      });
      row.addEventListener('mouseleave', function () {
        row.classList.remove('is-hovered');
        rowsList.classList.remove('is-row-active');
      });
      row.addEventListener('focusin', function () {
        rowsList.classList.add('is-row-active');
        row.classList.add('is-hovered');
      });
      row.addEventListener('focusout', function () {
        row.classList.remove('is-hovered');
        rowsList.classList.remove('is-row-active');
      });
    });
  }

  // --- 4. Click exit-transition ---
  var overlay = section.querySelector('[data-cm-pindex-transition]');
  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var TRANSITION_MS = 260;

  function resetTransitionOverlay() {
    if (!overlay) return;
    overlay.classList.remove('is-active');
    overlay.style.backgroundImage = '';
  }

  // Defensive reset regardless of which browser/scenario restores this
  // page from bfcache — guarantees the overlay is never left active when
  // this page becomes visible again (see projects-teaser.js's own
  // identical comment for why).
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) resetTransitionOverlay();
  });

  if (overlay) {
    section.querySelectorAll('[data-cm-pindex-row-link]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        var isModifiedClick =
          event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

        if (event.defaultPrevented || isModifiedClick || reduceMotionQuery.matches) {
          return;
        }

        var href = link.getAttribute('href');
        if (!href) return;

        event.preventDefault();

        var img = link.querySelector('.cm-pindex-row__media-img');
        if (img && img.currentSrc) {
          overlay.style.backgroundImage = 'url(' + img.currentSrc + ')';
        }
        overlay.classList.add('is-active');

        window.setTimeout(function () {
          window.location.href = href;
        }, TRANSITION_MS);
      });
    });
  }
})();
