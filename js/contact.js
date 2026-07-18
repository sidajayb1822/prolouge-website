/* Contact form: submit via FormSubmit AJAX so the visitor stays on the page
   and sees an inline confirmation instead of being redirected. */

(function () {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const status = document.getElementById('formStatus');
  const btn = form.querySelector('.send-btn');

  // Each recipient gets their own direct email (separate submissions, no CC).
  const recipients = [
    'info@earlyseedventures.com',
    'sakshay@earlyseedventures.com'
  ];

  function send(email) {
    return fetch('https://formsubmit.co/ajax/' + encodeURIComponent(email), {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    }).then(function (r) { if (!r.ok) throw new Error('bad'); return r.json(); });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';
    if (status) status.style.display = 'none';

    Promise.all(recipients.map(send))
      .then(function () {
        form.reset();
        if (status) {
          status.className = 'form-status ok';
          status.textContent = "Message sent! We'll get back to you within 24 hours.";
          status.style.display = 'block';
        }
      })
      .catch(function () {
        if (status) {
          status.className = 'form-status err';
          status.textContent = 'Something went wrong. Please email us directly at info@earlyseedventures.com.';
          status.style.display = 'block';
        }
      })
      .finally(function () { btn.disabled = false; btn.textContent = label; });
  });
})();
