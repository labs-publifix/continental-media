/**
 * Continental Media — clients marquee behavior.
 * Purely a performance nicety: pauses the CSS animation when the section
 * is off-screen. Hover-pause and prefers-reduced-motion both work from
 * clients-marquee.css alone — this script is optional.
 */
(function () {
  'use strict';

  var section = document.querySelector('[data-cm-marquee]');
  if (!section || !('IntersectionObserver' in window)) return;

  var tracks = section.querySelectorAll('[data-cm-marquee-track]');

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        tracks.forEach(function (track) {
          track.style.animationPlayState = entry.isIntersecting ? '' : 'paused';
        });
      });
    },
    { threshold: 0 }
  );

  observer.observe(section);
})();
