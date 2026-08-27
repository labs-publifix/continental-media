/**
 * Continental Media — "Nuestra Presencia" map render + scroll reveals.
 *
 * Three responsibilities:
 *   1. Render the Mexico map: builds an SVG from the real 32-state path
 *      data in mexico-states-data.js and injects it into
 *      [data-cm-presence-map-canvas] on load (not gated behind scroll —
 *      the map should be there before the reveal animation runs on it).
 *      Veracruz and Querétaro get a tinted fill and a pin; every pin is a
 *      focusable SVG <g> with its own aria-label, so the office info
 *      reaches screen readers unconditionally, not only via the
 *      hover/focus tooltip built for sighted/keyboard users.
 *   2. Leadership bio tap-to-expand: touch-only tap handling for the two
 *      director cards — desktop/keyboard get the bio reveal for free via
 *      presence.css's :hover/:focus-within, see the code below for the
 *      full reasoning.
 *   3. Scroll reveals: three independent one-shot IntersectionObservers,
 *      matching the block's natural reading order (intro -> map/pins/
 *      cards -> leadership), each adding .is-visible to its own trigger
 *      element the first time it enters the viewport.
 *
 * If this script never runs (JS disabled), the map's own <noscript>
 * paragraph and the block's <noscript> rule cover both pieces (the
 * latter also forces every leader bio open, since touch would otherwise
 * have no way to reveal it without JS); prefers-reduced-motion renders
 * every reveal in its final state and skips the pin-pulse/bounce
 * animations via CSS regardless of JS.
 */
import { MX_STATES } from './mexico-states-data.js';

(function () {
  'use strict';

  var section = document.querySelector('[data-cm-presence]');
  if (!section) return;

  var MAP_W = 900;
  var MAP_H = 620;
  var HIGHLIGHT = ['Veracruz', 'Querétaro'];
  var CITY_POINTS = {
    Veracruz: { x: 632.3, y: 456.0, sub: 'Oficina — Puerto de Veracruz' },
    Querétaro: { x: 511.3, y: 413.2, sub: 'Oficina — Querétaro, Qro.' },
  };

  function renderMap(canvas) {
    var statePaths = MX_STATES.map(function (s) {
      var cls =
        HIGHLIGHT.indexOf(s.name) !== -1 ? 'cm-presence__state cm-presence__state--highlight' : 'cm-presence__state';
      return '<path class="' + cls + '" d="' + s.d + '"><title>' + s.name + '</title></path>';
    }).join('');

    var pins = HIGHLIGHT.map(function (name, index) {
      var p = CITY_POINTS[name];
      var labelWidth = name.length * 7.6 + p.sub.length * 3.6 + 24;
      return (
        '<g class="cm-presence__pin-group" data-cm-presence-pin tabindex="0" role="img" aria-label="Sede ' +
        name +
        ' — ' +
        p.sub +
        '" transform="translate(' +
        p.x +
        ',' +
        p.y +
        ')" style="--cm-pin-delay: ' +
        index * 130 +
        'ms">' +
        '<circle class="cm-presence__pin-pulse" cx="0" cy="0" r="4"></circle>' +
        '<circle class="cm-presence__pin-dot" cx="0" cy="0" r="6"></circle>' +
        '<g class="cm-presence__pin-label" transform="translate(11,-14)">' +
        '<rect x="0" y="-16" width="' + Math.max(labelWidth, name.length * 7.6 + 22) + '" height="34" rx="2"></rect>' +
        '<text x="11" y="-2">' +
        name +
        '</text>' +
        '<text class="cm-presence__pin-label-sub" x="11" y="13">' +
        p.sub +
        '</text>' +
        '</g>' +
        '</g>'
      );
    }).join('');

    canvas.innerHTML =
      '<svg class="cm-presence__map-svg" viewBox="0 0 ' +
      MAP_W +
      ' ' +
      MAP_H +
      '" role="img" aria-label="Mapa de México con sus 32 estados; Veracruz y Querétaro resaltados como nuestras sedes">' +
      '<g>' +
      statePaths +
      '</g>' +
      pins +
      '</svg>';

    canvas.querySelectorAll('.cm-presence__pin-group').forEach(function (g) {
      g.addEventListener('mouseenter', function () {
        g.classList.add('is-active');
      });
      g.addEventListener('mouseleave', function () {
        g.classList.remove('is-active');
      });
      g.addEventListener('focus', function () {
        g.classList.add('is-active');
      });
      g.addEventListener('blur', function () {
        g.classList.remove('is-active');
      });
    });
  }

  var canvas = section.querySelector('[data-cm-presence-map-canvas]');
  if (canvas) renderMap(canvas);

  // --- Leadership bio tap-to-expand ---
  // Desktop/keyboard: :hover / :focus-within in presence.css already
  // reveal the bio with no JS involved (same "preview before commit"
  // mechanic as services-teaser). Touch has no hover step, so mirror
  // services-teaser's touch handling here: a tap toggles the same
  // .is-expanded state the CSS already treats as equivalent to hover.
  // Unlike the services pillars, these triggers aren't links, so there's
  // no second-tap-to-navigate step — a single tap just toggles.
  var leaders = section.querySelectorAll('[data-cm-presence-leader]');
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (isTouch) {
    leaders.forEach(function (leader) {
      var trigger = leader.querySelector('[data-cm-presence-leader-trigger]');
      if (!trigger) return;

      trigger.addEventListener('click', function () {
        var expanded = leader.classList.contains('is-expanded');
        leaders.forEach(function (other) {
          if (other !== leader) {
            other.classList.remove('is-expanded');
            var otherTrigger = other.querySelector('[data-cm-presence-leader-trigger]');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });
        leader.classList.toggle('is-expanded', !expanded);
        trigger.setAttribute('aria-expanded', String(!expanded));
      });
    });
  }

  // --- Scroll reveals ---
  var map = section.querySelector('[data-cm-presence-map]');
  var leadership = section.querySelector('.cm-presence__leadership');

  if (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    section.classList.add('is-visible');
    if (map) map.classList.add('is-visible');
    if (leadership) {
      leadership.querySelectorAll('[data-cm-presence-leader]').forEach(function (leader) {
        leader.classList.add('is-visible');
      });
    }
    return;
  }

  function revealOnce(el, threshold) {
    if (!el) return;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: threshold }
    );
    observer.observe(el);
  }

  revealOnce(section, 0.15);
  revealOnce(map, 0.3);

  if (leadership) {
    var leaderObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            leaderObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    leadership.querySelectorAll('[data-cm-presence-leader]').forEach(function (leader) {
      leaderObserver.observe(leader);
    });
  }
})();
