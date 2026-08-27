/**
 * Continental Media — site header behavior.
 * Two independent pieces:
 *   1. Hamburger menu: accessible disclosure (not a modal) — Escape
 *      closes it, background scroll locks while open, first link gets
 *      focus on open, focus returns to the toggle on close. Ported
 *      as-is from the block this replaced (public/blocks/hero); the only
 *      change is the element it queries from (data-cm-site-header-*
 *      instead of data-cm-hero-*).
 *   2. Scroll-triggered compact state: adds .is-scrolled to the header
 *      once the page scrolls past a small threshold, which
 *      site-header.css uses to swap the bar from transparent/large to
 *      solid+blurred/compact. rAF-throttled so it costs at most one
 *      class check per frame.
 * Self-initializing progressive enhancement: the menu toggle button and
 * nav markup work as inert content (nav just never opens) if this script
 * fails to load; the header still displays and stays reachable via its
 * always-on position:fixed.
 */
(function () {
  'use strict';

  var header = document.querySelector('[data-cm-site-header]');
  if (!header) return;

  var toggle = header.querySelector('[data-cm-site-header-menu-toggle]');
  var nav = header.querySelector('[data-cm-site-header-nav]');
  var menuLabel = header.querySelector('[data-cm-site-header-menu-label]');
  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Hamburger menu: accessible disclosure ---------- */

  var isOpen = false;

  function openMenu() {
    isOpen = true;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    if (menuLabel) menuLabel.textContent = 'Cerrar';
    nav.scrollTop = 0;
    nav.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
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

    nav.addEventListener('click', function () {
      closeMenu({ returnFocus: false });
    });
  }

  /* ---------- Scroll-triggered compact state ---------- */

  var SCROLL_THRESHOLD = 24;
  var ticking = false;

  function updateScrolledState() {
    ticking = false;
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateScrolledState);
    }
  }

  updateScrolledState();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
