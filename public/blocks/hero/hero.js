/**
 * Continental Media — hero block behavior.
 * Self-initializing progressive enhancement: works with markup alone
 * (video autoplays, content is visible) if this script fails to load.
 */
(function () {
  'use strict';

  var hero = document.querySelector('[data-cm-hero]');
  if (!hero) return;

  var video = hero.querySelector('[data-cm-hero-video]');
  var media = hero.querySelector('[data-cm-hero-media]');
  var toggle = hero.querySelector('[data-cm-hero-menu-toggle]');
  var nav = hero.querySelector('[data-cm-hero-nav]');
  var menuLabel = hero.querySelector('[data-cm-hero-menu-label]');
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

  /* ---------- Hamburger menu: accessible disclosure ---------- */

  var isOpen = false;

  function openMenu() {
    isOpen = true;
    toggle.setAttribute('aria-expanded', 'true');
    // aria-label carries the accessible name at every breakpoint, including
    // mobile where the visible label span is display:none (and so removed
    // from the accessibility tree) — keep both in sync regardless.
    toggle.setAttribute('aria-label', 'Cerrar menú');
    if (menuLabel) menuLabel.textContent = 'Cerrar';
    nav.scrollTop = 0;
    nav.hidden = false;
    // Lock the background page while the fixed full-screen overlay is
    // open — otherwise a wheel/touch gesture that misses the overlay's
    // own scroll (or lands during its opening transition) can scroll the
    // page behind it, which reads as the menu "breaking".
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    // Let the browser register hidden=false before animating in.
    requestAnimationFrame(function () {
      nav.classList.add('is-open');
    });
    var firstLink = nav.querySelector('a');
    if (firstLink) firstLink.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeMenu(options) {
    isOpen = false;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    if (menuLabel) menuLabel.textContent = 'Menú';
    nav.classList.remove('is-open');
    document.removeEventListener('keydown', onKeydown);
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    var finish = function () {
      nav.hidden = true;
    };
    if (reduceMotionQuery.matches) {
      finish();
    } else {
      nav.addEventListener('transitionend', finish, { once: true });
    }

    if (!options || options.returnFocus !== false) {
      toggle.focus();
    }
  }

  function onKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
    }
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      if (isOpen) {
        closeMenu({ returnFocus: false });
      } else {
        openMenu();
      }
    });

    // Clicking a link, or the empty backdrop/gaps around the panel, both
    // close it — every click inside the nav does, since nothing else in
    // here needs to stay open on click (social links open in a new tab).
    nav.addEventListener('click', function () {
      closeMenu({ returnFocus: false });
    });
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
