/* Contact form: submit via FormSubmit AJAX so the visitor stays on the page
   and sees an inline confirmation. Sends a separate direct email to each
   recipient (no CC). Works only on the deployed site, not file://. */

(function () {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const status = document.getElementById('formStatus');
  const btn = form.querySelector('.send-btn');

  // Each recipient gets their own direct email.
  const recipients = [
    'sakshay@earlyseedventures.com'
  ];

  // Use FormData (a CORS "simple" request) to avoid a preflight that
  // FormSubmit does not handle, then check the real success flag.
  function send(email) {
    return fetch('https://formsubmit.co/ajax/' + encodeURIComponent(email), {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    })
      .then(function (r) { return r.json(); })
      .then(function (data) { return String(data && data.success) === 'true'; });
  }

  function show(kind, msg) {
    if (!status) return;
    status.className = 'form-status ' + kind;
    status.textContent = msg;
    status.style.display = 'block';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';
    if (status) status.style.display = 'none';

    Promise.allSettled(recipients.map(send))
      .then(function (results) {
        const anyOk = results.some(function (r) { return r.status === 'fulfilled' && r.value; });
        if (anyOk) {
          form.reset();
          show('ok', "Message sent! We'll get back to you within 24 hours.");
        } else {
          show('err', 'Sorry, the message could not be sent right now. Please email us directly at info@earlyseedventures.com.');
        }
      })
      .finally(function () { btn.disabled = false; btn.textContent = label; });
  });
})();
