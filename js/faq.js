/* FAQ page: accordion toggle. Shared chrome comes from js/layout.js. */

(function () {
  document.querySelectorAll('.faq-item .faq-q').forEach(q => {
    q.addEventListener('click', () => {
      q.parentElement.classList.toggle('open');
    });
  });
})();
