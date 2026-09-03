/**
 * Continental Media — "Testimonios" block behavior.
 *
 * Four independent, progressively-enhanced pieces:
 *
 * 1. Scroll entrance: one-shot IntersectionObserver adds .is-visible to
 *    the section, fading the intro then the stage in (projects-teaser's
 *    exact pattern). If this script never runs, the block's <noscript>
 *    rule forces every slide statically visible/stacked instead — the
 *    carousel behavior below never applies to a no-JS visitor.
 *
 * 2. Carousel state: exactly one of the 3 slides is ever .is-active.
 *    Changing slides toggles aria-hidden on the <li>s and tabindex="-1"
 *    on their "Ver caso completo" link (only the active slide's link is
 *    reachable by keyboard), updates the dots' .is-active/aria-current,
 *    and writes a one-line summary to the visually-hidden aria-live
 *    status region. Reachable via the prev/next buttons, the dots, or
 *    ArrowLeft/ArrowRight while focus is inside the stage.
 *
 * 3. Auto-advance: every 7s, pauses on hover or focus-within (resumes on
 *    leave/blur), and restarts its timer after any manual navigation so
 *    a just-interacted-with visitor gets a full interval before the next
 *    auto-tick. Disabled entirely under prefers-reduced-motion, per the
 *    same "auto-rotating content needs user control, and reduced motion
 *    turns it off" rule used to gate the hero/context parallax elsewhere
 *    on the site — manual navigation still works instantly.
 *
 * 4. Count-up: the one numeric stat (Bitali's "+60...") counts from 0 to
 *    its target over ~900ms (rAF, eased) each time that slide becomes
 *    active, and resets to 0 when it leaves so it replays next time.
 *    Skipped entirely under reduced motion — the number just shows its
 *    target value immediately, no animation.
 */
(function () {
  'use strict';

  var section = document.querySelector('[data-cm-testimonials]');
  if (!section) return;

  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

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
      { threshold: 0.15 }
    );
    revealObserver.observe(section);
  } else {
    section.classList.add('is-visible');
  }

  // --- 2-4. Carousel ---
  var stage = section.querySelector('[data-cm-testimonials-stage]');
  var slides = Array.prototype.slice.call(section.querySelectorAll('[data-cm-testimonials-slide]'));
  var dots = Array.prototype.slice.call(section.querySelectorAll('[data-cm-testimonials-dot]'));
  var prevBtn = section.querySelector('[data-cm-testimonials-prev]');
  var nextBtn = section.querySelector('[data-cm-testimonials-next]');
  var status = section.querySelector('[data-cm-testimonials-status]');
  if (!stage || !slides.length) return;

  var current = slides.findIndex(function (slide) {
    return slide.classList.contains('is-active');
  });
  if (current < 0) current = 0;

  // The static markup deliberately ships every slide fully reachable
  // (no aria-hidden, no tabindex="-1") so a no-JS visitor gets all 3 as
  // real content — this script is what actually hides the inactive ones
  // from keyboard/AT now that it's confirmed to be running.
  slides.forEach(function (slide, i) {
    if (i === current) return;
    slide.setAttribute('aria-hidden', 'true');
    var link = slide.querySelector('.cm-testimonials__link');
    if (link) link.setAttribute('tabindex', '-1');
  });

  var AUTO_ADVANCE_MS = 7000;
  var COUNT_UP_MS = 900;
  var autoTimer = null;
  var countRaf = null;

  function easeOutQuad(t) {
    return 1 - (1 - t) * (1 - t);
  }

  function resetCount(slide) {
    var numberEl = slide.querySelector('[data-cm-testimonials-stat-number]');
    if (!numberEl) return;
    numberEl.textContent = '0';
  }

  function playCount(slide) {
    var numberEl = slide.querySelector('[data-cm-testimonials-stat-number]');
    if (!numberEl) return;
    var target = parseInt(numberEl.getAttribute('data-target'), 10);
    if (!target) return;

    if (reduceMotionQuery.matches) {
      numberEl.textContent = String(target);
      return;
    }

    if (countRaf) cancelAnimationFrame(countRaf);
    var start = null;

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / COUNT_UP_MS, 1);
      numberEl.textContent = String(Math.round(target * easeOutQuad(progress)));
      if (progress < 1) {
        countRaf = requestAnimationFrame(step);
      } else {
        countRaf = null;
      }
    }

    countRaf = requestAnimationFrame(step);
  }

  function goTo(index) {
    var next = ((index % slides.length) + slides.length) % slides.length;
    if (next === current) return;

    var outgoing = slides[current];
    var incoming = slides[next];

    outgoing.classList.remove('is-active');
    outgoing.setAttribute('aria-hidden', 'true');
    var outgoingLink = outgoing.querySelector('.cm-testimonials__link');
    if (outgoingLink) outgoingLink.setAttribute('tabindex', '-1');
    resetCount(outgoing);

    incoming.classList.add('is-active');
    incoming.removeAttribute('aria-hidden');
    var incomingLink = incoming.querySelector('.cm-testimonials__link');
    if (incomingLink) incomingLink.removeAttribute('tabindex');
    playCount(incoming);

    dots.forEach(function (dot, i) {
      var isActive = i === next;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });

    if (status) {
      status.textContent = 'Testimonio ' + (next + 1) + ' de ' + slides.length + ': ' + incoming.getAttribute('data-client');
    }

    current = next;
  }

  function stopAuto() {
    if (autoTimer) {
      window.clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function startAuto() {
    if (reduceMotionQuery.matches) return; // auto-rotating content must respect reduced motion
    stopAuto();
    autoTimer = window.setInterval(function () {
      goTo(current + 1);
    }, AUTO_ADVANCE_MS);
  }

  function restartAuto() {
    // Give a manually-navigated-to slide a full interval before the next
    // auto-tick, instead of picking up an already-part-elapsed timer.
    startAuto();
  }

  function manualGoTo(index) {
    goTo(index);
    restartAuto();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      manualGoTo(current - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      manualGoTo(current + 1);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      manualGoTo(i);
    });
  });

  stage.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      manualGoTo(current - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      manualGoTo(current + 1);
    }
  });

  stage.addEventListener('mouseenter', stopAuto);
  stage.addEventListener('mouseleave', startAuto);
  stage.addEventListener('focusin', stopAuto);
  stage.addEventListener('focusout', function (event) {
    // Only resume once focus has actually left the stage, not when it
    // just moved from one control inside it to another.
    if (!stage.contains(event.relatedTarget)) startAuto();
  });

  reduceMotionQuery.addEventListener('change', function (event) {
    if (event.matches) {
      stopAuto();
    } else {
      startAuto();
    }
  });

  // Prime the initially-active slide's count-up and start the clock.
  playCount(slides[current]);
  startAuto();
})();
