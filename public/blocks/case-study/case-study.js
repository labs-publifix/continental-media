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
 *
 * 4. Solution reel(s): once a case study has a real [data-cm-case-video]
 *    (a <video> replacing that subsection's placeholder), the same
 *    pause-off-screen / freeze-on-reduced-motion lifecycle as the home
 *    hero's own background video (public/blocks/hero/hero.js), plus a
 *    scroll-driven "grow a little" scale written to --cm-case-video-
 *    scale — the same rAF-throttled getBoundingClientRect() progress
 *    technique as the context image parallax above, just mapped to a
 *    subtle 1 -> 1.08 scale instead of a translate. The reel is often
 *    the single heaviest asset on the page, so its markup ships with
 *    preload="none" (nothing fetches on page load) and the visibility
 *    observer below carries a generous rootMargin — the first .play()
 *    call is what actually starts the download, and it fires while the
 *    block is still ~400px below the viewport so playback is already
 *    running by the time the user scrolls to it, not starting cold.
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

  // --- 4. Solution reel(s): deferred source + visibility play/pause + scroll-driven grow ---
  var videoFrames = article.querySelectorAll('[data-cm-case-video-frame]');
  videoFrames.forEach(function (frame) {
    var inner = frame.querySelector('[data-cm-case-video]');
    var video = inner && inner.querySelector('video');
    if (!inner || !video) return;

    // The <source> ships with data-cm-case-video-src instead of src (see
    // generate-case-study-pages.mjs's own comment on renderVideoMedia) —
    // nothing to fetch until this runs once, right before the first
    // play() call.
    var loadRealSource = function () {
      var source = video.querySelector('source[data-cm-case-video-src]');
      if (!source) return;
      source.src = source.getAttribute('data-cm-case-video-src');
      source.removeAttribute('data-cm-case-video-src');
      video.load();
    };

    if (reduceMotionQuery.matches) {
      video.pause();
    } else if ('IntersectionObserver' in window) {
      var videoVisibilityObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (reduceMotionQuery.matches) return;
            if (entry.isIntersecting) {
              loadRealSource();
              video.play().catch(function () {
                /* Autoplay can be blocked by the browser; poster covers it. */
              });
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.1, rootMargin: '400px 0px' }
      );
      videoVisibilityObserver.observe(frame);
    }

    reduceMotionQuery.addEventListener('change', function (event) {
      if (event.matches) {
        video.pause();
      } else {
        loadRealSource();
        video.play().catch(function () {});
      }
    });

    if (reduceMotionQuery.matches) return;

    var VIDEO_MAX_SCALE = 1.08;
    var videoTicking = false;

    var applyVideoScale = function () {
      videoTicking = false;
      var rect = frame.getBoundingClientRect();
      var viewportH = window.innerHeight;
      // Same 0..1 span as the context parallax above: 0 when the frame's
      // top just enters the viewport bottom, 1 when its bottom just
      // leaves the viewport top.
      var progress = (viewportH - rect.top) / (viewportH + rect.height);
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      var scale = (1 + progress * (VIDEO_MAX_SCALE - 1)).toFixed(4);
      inner.style.setProperty('--cm-case-video-scale', scale);
    };

    var onVideoScroll = function () {
      if (!videoTicking) {
        videoTicking = true;
        requestAnimationFrame(applyVideoScale);
      }
    };

    applyVideoScale();
    window.addEventListener('scroll', onVideoScroll, { passive: true });
    window.addEventListener('resize', onVideoScroll);
  });

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
