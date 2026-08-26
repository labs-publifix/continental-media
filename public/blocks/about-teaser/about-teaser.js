/**
 * Continental Media — "Nosotros" teaser scroll reveal + touch photo reveal.
 * If this script never runs (JS disabled), the block's <noscript> rule and
 * the prefers-reduced-motion override in the CSS both force the final
 * visible state on their own — everything here is a progressive
 * enhancement.
 */
(function () {
  'use strict';

  var section = document.querySelector('[data-cm-about]');
  if (!section) return;

  // Scroll-triggered reveal: adds .is-visible the first time the section
  // enters the viewport, which about-teaser.css uses to stagger in the
  // text block and photo grid. One-shot: the observer stops after firing.
  if (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    section.classList.add('is-visible');
  } else {
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
  }

  // Touch equivalent of the desktop :hover photo reveal (full-color photo
  // + name/role caption): devices with no real hover pointer get the same
  // payoff on tap instead. Scoped to hover:none so it never fights the
  // CSS :hover rules on a mouse/trackpad.
  var grid = section.querySelector('[data-cm-about-grid]');
  if (grid && window.matchMedia('(hover: none)').matches) {
    var photos = grid.querySelectorAll('.cm-about__photo');

    grid.addEventListener('click', function (event) {
      var photo = event.target.closest('.cm-about__photo');
      if (!photo) return;
      var wasActive = photo.classList.contains('is-active');
      photos.forEach(function (p) {
        p.classList.remove('is-active');
      });
      if (!wasActive) photo.classList.add('is-active');
    });

    document.addEventListener('click', function (event) {
      if (!grid.contains(event.target)) {
        photos.forEach(function (p) {
          p.classList.remove('is-active');
        });
      }
    });
  }
})();
