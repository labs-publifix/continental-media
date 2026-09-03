/**
 * Continental Media — "Contacto" block behavior.
 *
 * Three independent pieces:
 *
 * 1. Scroll entrance: one-shot IntersectionObserver adds .is-visible to
 *    the section (contact.css fades the left column in, then the form
 *    column ~180ms later). If this script never runs, the block's
 *    <noscript> rule forces both columns statically visible.
 *
 * 2. Validation: submit-triggered, per the brief — not per-keystroke.
 *    A failed submit fills in each invalid field's inline error and a
 *    focusable error summary at the top of the form (focus moves
 *    there). Once a field has been marked invalid, it starts
 *    revalidating live on input/change so its own error — and its own
 *    line in the summary — clears the moment it's fixed, without
 *    requiring a second submit.
 *
 * 3. Mock submit: there is no real form backend yet (see contact.html).
 *    A valid submit disables the button, flips its label to
 *    "Enviando…", awaits mockSubmitContactRequest() below, then swaps
 *    the <form> for the .cm-contact__success message and moves focus
 *    there. mockSubmitContactRequest() is the one function to replace
 *    with a real network call once a backend exists — everything
 *    around it (loading/disabled state, the success swap, focus
 *    management) already matches what a real async submit needs.
 */
(function () {
  'use strict';

  var section = document.querySelector('[data-cm-contact]');
  if (!section) return;

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

  // --- 2-3. Form ---
  var form = section.querySelector('[data-cm-contact-form]');
  if (!form) return;

  var successEl = section.querySelector('[data-cm-contact-success]');
  var summaryEl = section.querySelector('[data-cm-contact-summary]');
  var summaryList = section.querySelector('[data-cm-contact-summary-list]');
  var submitBtn = section.querySelector('[data-cm-contact-submit]');
  var submitLabel = section.querySelector('[data-cm-contact-submit-label]');

  var nameInput = form.querySelector('#contact-name');
  var emailInput = form.querySelector('#contact-email');
  var messageInput = form.querySelector('#contact-message');
  var methodInputs = Array.prototype.slice.call(form.querySelectorAll('input[name="contact-method"]'));
  var methodFieldset = form.querySelector('.cm-contact__method');

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Each entry: id used in the error summary link target, the element
  // whose aria-invalid/focus we manage, the error <p>, and a validator
  // returning an error message string or '' when valid.
  var fields = [
    {
      id: 'contact-name',
      input: nameInput,
      errorEl: form.querySelector('#contact-name-error'),
      validate: function () {
        return nameInput.value.trim() === '' ? 'Escribe tu nombre.' : '';
      },
    },
    {
      id: 'contact-email',
      input: emailInput,
      errorEl: form.querySelector('#contact-email-error'),
      validate: function () {
        var value = emailInput.value.trim();
        if (value === '') return 'Escribe tu correo electrónico.';
        if (!EMAIL_RE.test(value)) return 'Escribe un correo electrónico válido.';
        return '';
      },
    },
    {
      id: 'contact-message',
      input: messageInput,
      errorEl: form.querySelector('#contact-message-error'),
      validate: function () {
        return messageInput.value.trim() === '' ? 'Cuéntanos qué necesitas.' : '';
      },
    },
    {
      id: 'contact-method',
      // The fieldset carries aria-invalid/aria-describedby for the
      // group as a whole, but a plain <fieldset> isn't reliably
      // focusable across browsers — focusTarget below points the error
      // summary link at the first radio instead.
      input: methodFieldset,
      focusTarget: methodInputs[0],
      errorEl: form.querySelector('#contact-method-error'),
      validate: function () {
        var checked = methodInputs.some(function (radio) {
          return radio.checked;
        });
        return checked ? '' : 'Selecciona un medio de contacto.';
      },
    },
  ];

  fields.forEach(function (field) {
    if (!field.focusTarget) field.focusTarget = field.input;
  });

  var liveValidated = {};

  function setFieldError(field, message) {
    if (message) {
      field.errorEl.textContent = message;
      field.errorEl.hidden = false;
      field.input.setAttribute('aria-invalid', 'true');
    } else {
      field.errorEl.textContent = '';
      field.errorEl.hidden = true;
      field.input.removeAttribute('aria-invalid');
    }
    return message;
  }

  function renderSummary(invalidFields) {
    if (!invalidFields.length) {
      summaryEl.hidden = true;
      summaryList.innerHTML = '';
      return;
    }

    summaryList.innerHTML = '';
    invalidFields.forEach(function (field) {
      var li = document.createElement('li');
      var link = document.createElement('a');
      link.href = '#' + field.id;
      link.textContent = field.message;
      link.addEventListener('click', function (event) {
        event.preventDefault();
        field.focusTarget.focus();
      });
      li.appendChild(link);
      summaryList.appendChild(li);
    });
    summaryEl.hidden = false;
  }

  function watchFieldLive(field) {
    if (liveValidated[field.id]) return;
    liveValidated[field.id] = true;

    var isFieldset = field.input.tagName === 'FIELDSET';
    var targets = isFieldset ? methodInputs : [field.input];
    var eventName = isFieldset ? 'change' : 'input';

    var handler = function () {
      var message = field.validate();
      setFieldError(field, message);
      // Drop this field from the summary the moment it's fixed, rather
      // than waiting for the next submit to rebuild the whole list.
      var stillInvalid = fields.filter(function (f) {
        return f.errorEl && !f.errorEl.hidden;
      });
      renderSummary(
        stillInvalid.map(function (f) {
          return { id: f.id, focusTarget: f.focusTarget, message: f.errorEl.textContent };
        })
      );
    };

    targets.forEach(function (target) {
      target.addEventListener(eventName, handler);
    });
  }

  function validateAll() {
    var invalid = [];
    fields.forEach(function (field) {
      var message = setFieldError(field, field.validate());
      if (message) {
        watchFieldLive(field);
        invalid.push({ id: field.id, focusTarget: field.focusTarget, message: message });
      }
    });
    return invalid;
  }

  /**
   * Stands in for the real form backend, which does not exist yet.
   * Replace this with a real network call (e.g. fetch('/api/contact',
   * { method: 'POST', body: ... })) when one does — everything that
   * calls it already awaits a Promise and handles rejection, so no
   * other code needs to change.
   */
  function mockSubmitContactRequest(payload) {
    return new Promise(function (resolve) {
      window.setTimeout(function () {
        resolve({ ok: true });
      }, 900);
    });
  }

  function showSuccess() {
    form.hidden = true;
    successEl.hidden = false;
    successEl.focus();
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var invalid = validateAll();
    if (invalid.length) {
      renderSummary(invalid);
      summaryEl.focus();
      return;
    }

    summaryEl.hidden = true;

    var payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      company: form.querySelector('#contact-company').value.trim(),
      message: messageInput.value.trim(),
      contactMethod: (
        methodInputs.filter(function (radio) {
          return radio.checked;
        })[0] || {}
      ).value,
    };

    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
    var originalLabel = submitLabel.textContent;
    submitLabel.textContent = 'Enviando…';

    mockSubmitContactRequest(payload).then(
      function () {
        showSuccess();
      },
      function () {
        // Network/backend failure path once a real endpoint exists —
        // restore the button and let the visitor try again.
        submitBtn.disabled = false;
        submitBtn.removeAttribute('aria-busy');
        submitLabel.textContent = originalLabel;
      }
    );
  });
})();
