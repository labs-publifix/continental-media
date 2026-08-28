/**
 * Continental Media — "Nosotros" teaser: scroll reveal + touch spotlight
 * + photo skeleton loading.
 *
 * Three independent pieces:
 *
 * 1. Scroll reveal: adds .is-visible to the section the first time it
 *    enters the viewport, which about-teaser.css uses to stagger in the
 *    text block and photo grid. One-shot: once revealed, the observer
 *    stops watching. If this script never runs (JS disabled), the
 *    block's <noscript> rule and the prefers-reduced-motion override in
 *    the CSS both force the final visible state on their own.
 *
 * 2. Touch spotlight: the photo grid's "spotlight" dim/lift effect is
 *    pure CSS :hover on desktop/mouse (see about-teaser.css) — it
 *    carries no information, just a visual embellishment, so it needs no
 *    touch equivalent for accessibility. But touch devices have no
 *    cursor to hover with at all, so without this they'd never see the
 *    effect. On touch only (matchMedia('(hover: none), (pointer:
 *    coarse)')), tapping a photo toggles the same .is-active/.has-active
 *    states the CSS already treats as equivalent to :hover; tapping the
 *    active photo again, or tapping outside the grid, clears it.
 *
 * 3. Photo skeleton: each <img loading="lazy"> only starts fetching once
 *    it nears the viewport, so without this the tile just shows flat
 *    black for a beat. Every photo gets .is-loaded (fading out its CSS
 *    shimmer, fading in the <img>) the moment its image is ready — on
 *    'load', on 'error' (so a broken image never shimmers forever), or
 *    immediately if the browser already served it from cache (img.complete
 *    is true before any listener could fire).
 */
(function () {
  'use strict';

  var section = document.querySelector('[data-cm-about]');
  if (!section) return;

  // --- 1. Scroll reveal ---
  if (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    section.classList.add('is-visible');
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            section.classList.add('is-visible');
            observer.unobserve(section);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
  }

  // --- 2. Touch spotlight tap equivalent ---
  var grid = section.querySelector('[data-cm-about-grid]');
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (grid && isTouch) {
    var photos = grid.querySelectorAll('[data-cm-about-photo]');

    photos.forEach(function (photo) {
      photo.addEventListener('click', function () {
        var wasActive = photo.classList.contains('is-active');
        photos.forEach(function (p) {
          p.classList.remove('is-active');
        });
        if (wasActive) {
          grid.classList.remove('has-active');
        } else {
          photo.classList.add('is-active');
          grid.classList.add('has-active');
        }
      });
    });

    document.addEventListener('click', function (event) {
      if (!grid.contains(event.target)) {
        photos.forEach(function (p) {
          p.classList.remove('is-active');
        });
        grid.classList.remove('has-active');
      }
    });
  }

  // --- 3. Photo skeleton loading ---
  section.querySelectorAll('[data-cm-about-photo]').forEach(function (photo) {
    var img = photo.querySelector('img');
    if (!img) return;

    function markLoaded() {
      photo.classList.add('is-loaded');
    }

    if (img.complete) {
      // True once loading has finished either way (success or a
      // pre-cached failure) — in both cases no further 'load'/'error'
      // event will ever fire, so this is the only chance to catch it.
      markLoaded();
    } else {
      img.addEventListener('load', markLoaded, { once: true });
      img.addEventListener('error', markLoaded, { once: true });
    }
  });
})();
