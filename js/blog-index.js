/* Blog index page only (blog.html): featured-post slider + search/author filter.
   The shared header/footer + scroll behaviour live in js/layout.js. */

(function () {
  // Featured slider
  const AUTOPLAY_MS = 6000;
  const slides = document.querySelectorAll('.feat-slide');
  const dashesWrap = document.getElementById('featDashes');
  const slider = document.querySelector('.feat-slider');
  if (slides.length) {
    let index = Math.max(0, [...slides].findIndex(s => s.classList.contains('is-active')));
    let autoplayTimer = null;

    slides.forEach((_, i) => {
      const dash = document.createElement('button');
      dash.className = 'feat-dash';
      dash.setAttribute('aria-label', 'Go to post ' + (i + 1));
      dash.addEventListener('click', () => userShow(i));
      dashesWrap.appendChild(dash);
    });
    const dashes = dashesWrap.querySelectorAll('.feat-dash');

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, j) => s.classList.toggle('is-active', j === index));
      dashes.forEach((d, j) => d.classList.toggle('is-active', j === index));
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => show(index + 1), AUTOPLAY_MS);
    }
    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
    }
    // Manual navigation resets the timer, so the next auto-advance is a full interval away.
    function userShow(i) {
      show(i);
      startAutoplay();
    }

    document.getElementById('featPrev').addEventListener('click', () => userShow(index - 1));
    document.getElementById('featNext').addEventListener('click', () => userShow(index + 1));
    if (slider) {
      slider.addEventListener('mouseenter', stopAutoplay);
      slider.addEventListener('mouseleave', startAutoplay);
    }
    show(index);
    startAutoplay();
  }

  // Search + author filter
  const cards = document.querySelectorAll('.post-card');
  const searchInput = document.getElementById('blogSearch');
  const pillsWrap = document.getElementById('authorPills');
  const noResults = document.getElementById('noResults');
  if (!cards.length || !searchInput || !pillsWrap) return;

  const authors = [...new Set([...cards].map(c => c.dataset.author).filter(Boolean))].sort();
  let activeAuthor = 'All';

  function addPill(label) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.classList.toggle('is-active', label === activeAuthor);
    btn.addEventListener('click', () => {
      activeAuthor = label;
      pillsWrap.querySelectorAll('button').forEach(b => b.classList.toggle('is-active', b.textContent === label));
      applyFilter();
    });
    pillsWrap.appendChild(btn);
  }
  addPill('All');
  authors.forEach(addPill);

  function applyFilter() {
    const q = searchInput.value.trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const matchesAuthor = activeAuthor === 'All' || card.dataset.author === activeAuthor;
      const haystack = (card.dataset.title + ' ' + card.dataset.excerpt + ' ' + card.dataset.author).toLowerCase();
      const matchesSearch = !q || haystack.includes(q);
      const show = matchesAuthor && matchesSearch;
      card.hidden = !show;
      if (show) visible++;
    });
    noResults.hidden = visible !== 0;
  }

  searchInput.addEventListener('input', applyFilter);
})();
