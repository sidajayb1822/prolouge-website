/* Pre-funding page interactions: Pitch Deck / Financial Modelling tabs + case-work slider.
   Shared header/footer come from js/layout.js. */

(function () {
  // Pricing cards: show the first 8 features, "See more" expands all cards together.
  // The +N counts only hidden services the tier actually includes (not greyed-out ones).
  const VISIBLE = 8;
  const cards = document.querySelectorAll('.price-card');
  const toggles = [];
  cards.forEach(card => {
    const extra = Array.from(card.querySelectorAll('.feature')).slice(VISIBLE);
    if (!extra.length) return;
    const included = extra.filter(f => !f.classList.contains('off')).length;
    const moreLabel = included ? 'See more (+' + included + (included === 1 ? ' service)' : ' services)') : 'See more';
    extra.forEach(f => { f.hidden = true; });
    const t = document.createElement('button');
    t.type = 'button';
    t.className = 'feature-more';
    t.setAttribute('aria-expanded', 'false');
    t.textContent = moreLabel;
    card.appendChild(t);
    toggles.push({ t, extra, moreLabel });
  });
  toggles.forEach(({ t }) => t.addEventListener('click', () => {
    const open = t.getAttribute('aria-expanded') !== 'true';
    toggles.forEach(({ t: b, extra, moreLabel }) => {
      extra.forEach(f => { f.hidden = !open; });
      b.setAttribute('aria-expanded', String(open));
      b.textContent = open ? 'See less' : moreLabel;
    });
  }));

  // Tabs
  const tabs = document.querySelectorAll('.tabs button');
  const panels = document.querySelectorAll('.tab-content');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === btn.dataset.tab));
    });
  });

  // Case-work slider
  const slides = [
    "Assets/PreFunding/Case work/Mool.png",
    "Assets/PreFunding/Case work/revior.png",
    "Assets/PreFunding/Case work/superhuman.png",
    "Assets/PreFunding/Case work/INNOEVERSITY.png",
    "Assets/PreFunding/Case work/TFG.png",
    "Assets/PreFunding/Case work/the growing girrafe.png",
    "Assets/PreFunding/Case work/the skin studio.png"
  ];
  const img = document.getElementById('cwImage');
  const btn = document.getElementById('cwNext');
  if (!img || !btn) return;
  let i = 0;
  btn.addEventListener('click', () => {
    i = (i + 1) % slides.length;
    img.src = encodeURI(slides[i]);
  });
})();
