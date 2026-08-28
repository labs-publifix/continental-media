/**
 * Continental Media — case-study page behavior.
 *
 * Three independent pieces:
 *
 * 1. Hero: cinematic entrance on load (fade/rise, same double-rAF timing
 *    as the home hero) plus a scroll parallax on the hero media —
 *    literally the same technique as public/blocks/hero/hero.js's own
 *    parallax (translate + scale written to CSS custom properties,
 *    rAF-throttled), just retargeted to this page's hero. Both skip
 *    entirely under prefers-reduced-motion.
 *
 * 2. Context image parallax: a lighter version of the same idea, scoped
 *    to the full-bleed image between the "Resumen" and "Reto" blocks —
 *    its inner layer drifts at a fraction of scroll speed while the
 *    section is on screen, the classic "image moves slower than the
 *    page" parallax read. Also rAF-throttled, also skipped under
 *    reduced motion.
 *
 * 3. Scroll reveals: one-shot IntersectionObservers add .is-visible to
 *    every [data-cm-case-reveal] block (fade + rise) and to the Enfoque
 *    list specifically (whose 4 items then cascade via nth-child delay
 *    in CSS — one observer, not four, same pattern as about-teaser's
 *    photo grid). If this script never runs, the page's own <noscript>
 *    rule forces every block to its final visible state; prefers-
 *    reduced-motion does the same via CSS regardless of JS.
 */
(function () {
  'use strict';

  var article = document.querySelector('[data-cm-case]');
  if (!article) return;

  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  // --- 1. Hero entrance + parallax ---
  var hero = article.querySelector('[data-cm-case-hero]');
  if (hero) {
    var heroMedia = hero.querySelector('[data-cm-case-hero-media]');

    function playHeroEntrance() {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          hero.classList.add('is-ready');
        });
      });
    }

    if (document.readyState === 'complete') {
      playHeroEntrance();
    } else {
      window.addEventListener('load', playHeroEntrance, { once: true });
    }

    if (!reduceMotionQuery.matches && heroMedia) {
      var HERO_MAX_TRANSLATE_PERCENT = 8;
      var HERO_REST_SCALE = 1.06;
      var HERO_END_SCALE = 1.0;
      var heroTicking = false;
      var heroTop = 0;
      var heroHeight = 0;

      var measureHero = function () {
        heroTop = hero.offsetTop;
        heroHeight = hero.offsetHeight || window.innerHeight;
      };

      var applyHeroParallax = function () {
        heroTicking = false;
        var progress = (window.scrollY - heroTop) / heroHeight;
        if (progress < 0) progress = 0;
        if (progress > 1) progress = 1;

        var translate = (progress * HERO_MAX_TRANSLATE_PERCENT).toFixed(2) + '%';
        var scale = (HERO_REST_SCALE - progress * (HERO_REST_SCALE - HERO_END_SCALE)).toFixed(4);

        heroMedia.style.setProperty('--cm-case-parallax-y', translate);
        heroMedia.style.setProperty('--cm-case-parallax-scale', scale);
      };

      measureHero();
      applyHeroParallax();
      window.addEventListener(
        'scroll',
        function () {
          if (!heroTicking) {
            heroTicking = true;
            requestAnimationFrame(applyHeroParallax);
          }
        },
        { passive: true }
      );
      window.addEventListener('resize', function () {
        measureHero();
        applyHeroParallax();
      });
    }
  }

  // --- 2. Context image parallax ---
  var contextMedia = article.querySelector('[data-cm-case-context-media]');
  var contextInner = article.querySelector('[data-cm-case-context-inner]');

  if (contextMedia && contextInner && !reduceMotionQuery.matches) {
    var CONTEXT_MAX_DRIFT_PX = 60;
    var contextTicking = false;

    var applyContextParallax = function () {
      contextTicking = false;
      var rect = contextMedia.getBoundingClientRect();
      var viewportH = window.innerHeight;
      // 0 when the section's top just enters the viewport bottom, 1 when
      // its bottom just leaves the viewport top — a 0..1 progress value
      // for exactly the span the section is ever visible.
      var progress = (viewportH - rect.top) / (viewportH + rect.height);
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      var drift = (progress - 0.5) * 2 * CONTEXT_MAX_DRIFT_PX;
      contextInner.style.transform = 'translate3d(0, ' + drift.toFixed(1) + 'px, 0)';
    };

    var onContextScroll = function () {
      if (!contextTicking) {
        contextTicking = true;
        requestAnimationFrame(applyContextParallax);
      }
    };

    applyContextParallax();
    window.addEventListener('scroll', onContextScroll, { passive: true });
    window.addEventListener('resize', onContextScroll);
  }

  // --- 3. Scroll reveals ---
  var revealTargets = article.querySelectorAll('[data-cm-case-reveal]');
  var approachList = article.querySelector('[data-cm-case-approach-list]');

  if (!('IntersectionObserver' in window) || reduceMotionQuery.matches) {
    revealTargets.forEach(function (el) {
      el.classList.add('is-visible');
    });
    if (approachList) approachList.classList.add('is-visible');
    return;
  }

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach(function (el) {
    revealObserver.observe(el);
  });

  if (approachList) {
    var approachObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            approachObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    approachObserver.observe(approachList);
  }
})();
