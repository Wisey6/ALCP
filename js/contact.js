// Contact form submission via FormSubmit AJAX endpoint.
    // Submissions are emailed to rachael@alcp.com.au. First submission from this
    // site will trigger a one-time activation email from FormSubmit that must be
    // confirmed before deliveries start.
    (function () {
      var form = document.getElementById('contact-form');
      var successEl = document.getElementById('form-success');
      var errorEl = document.getElementById('form-error');
      var errorMsg = document.getElementById('form-error-message');
      var submitBtn = document.getElementById('contact-submit');
      if (!form) return;

      var endpoint = 'https://formsubmit.co/ajax/rachael@alcp.com.au';

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (submitBtn.disabled || !form.reportValidity()) return;
        if (['name', 'email', 'message'].some(function (key) { return !form.elements.namedItem(key).value.trim(); })) {
          errorMsg.textContent = 'Please enter your name, email and message.';
          errorEl.style.display = 'block';
          return;
        }
        successEl.style.display = 'none';
        errorEl.style.display = 'none';
        submitBtn.disabled = true;
        var originalLabel = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';

        var data = {
          name: form.elements.namedItem('name').value.trim(),
          email: form.elements.namedItem('email').value.trim(),
          subject: form.elements.namedItem('subject').value.trim(),
          message: form.elements.namedItem('message').value.trim(),
          _subject: 'New contact form submission from alcp.com.au',
          _captcha: 'false', // Preserve the existing AJAX endpoint configuration.
          _template: 'box'
        };

        var controller = new AbortController();
        var timeout = setTimeout(function () { controller.abort(); }, 20000);
        fetch(endpoint, {
          signal: controller.signal,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        })
          .then(function (res) {
            return res.json().catch(function () { return {}; }).then(function (body) {
              return { ok: res.ok, body: body };
            });
          })
          .then(function (result) {
            if (result.ok && result.body && (result.body.success === 'true' || result.body.success === true)) {
              form.reset();
              successEl.style.display = 'block';
              successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
              var msg = (result.body && result.body.message) ? result.body.message : 'Please try again, or email rachael@alcp.com.au directly.';
              errorMsg.textContent = msg;
              errorEl.style.display = 'block';
              errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          })
          .catch(function () {
            errorMsg.textContent = 'Network error. Please try again, or email rachael@alcp.com.au directly.';
            errorEl.style.display = 'block';
            errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          })
          .then(function () {
            clearTimeout(timeout);
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          });
      });
    })();
