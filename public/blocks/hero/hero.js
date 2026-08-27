/**
 * Continental Media — hero block behavior.
 * Self-initializing progressive enhancement: works with markup alone
 * (video autoplays, content is visible) if this script fails to load.
 * The menu toggle/disclosure this file used to own now lives in
 * public/blocks/site-header/site-header.js — this file is video +
 * content-entrance + parallax only.
 */
(function () {
  'use strict';

  var hero = document.querySelector('[data-cm-hero]');
  if (!hero) return;

  var video = hero.querySelector('[data-cm-hero-video]');
  var media = hero.querySelector('[data-cm-hero-media]');
  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Cinematic entrance on load (not on scroll) ---------- */

  function playEntrance() {
    // Double rAF so the initial (opacity:0) state paints before the
    // transition-triggering class is added.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        hero.classList.add('is-ready');
      });
    });
  }

  if (document.readyState === 'complete') {
    playEntrance();
  } else {
    window.addEventListener('load', playEntrance, { once: true });
  }

  /* ---------- Video lifecycle: pause off-screen, freeze under reduced motion ---------- */

  if (video) {
    if (reduceMotionQuery.matches) {
      video.pause();
    } else if ('IntersectionObserver' in window) {
      var visibilityObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (reduceMotionQuery.matches) return;
            if (entry.isIntersecting) {
              video.play().catch(function () {
                /* Autoplay can be blocked by the browser; poster covers it. */
              });
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.1 }
      );
      visibilityObserver.observe(hero);
    }

    reduceMotionQuery.addEventListener('change', function (event) {
      if (event.matches) {
        video.pause();
      } else {
        video.play().catch(function () {});
      }
    });
  }

  /* ---------- Scroll parallax: video lags and settles while pinned ---------- */

  var MAX_TRANSLATE_PERCENT = 8; // video drifts down up to 8% of its own height
  var REST_SCALE = 1.06; // slightly zoomed in at rest
  var END_SCALE = 1.0; // settles to true scale as the section scrolls through

  var ticking = false;
  var heroTop = 0;
  var heroHeight = 0;

  function measure() {
    heroTop = hero.offsetTop;
    heroHeight = hero.offsetHeight || window.innerHeight;
  }

  function applyParallax() {
    ticking = false;
    if (reduceMotionQuery.matches || !media) return;

    var progress = (window.scrollY - heroTop) / heroHeight;
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    var translate = (progress * MAX_TRANSLATE_PERCENT).toFixed(2) + '%';
    var scale = (REST_SCALE - progress * (REST_SCALE - END_SCALE)).toFixed(4);

    media.style.setProperty('--cm-parallax-y', translate);
    media.style.setProperty('--cm-parallax-scale', scale);
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(applyParallax);
    }
  }

  if (!reduceMotionQuery.matches) {
    measure();
    applyParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () {
      measure();
      applyParallax();
    });
  }
})();
