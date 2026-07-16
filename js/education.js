/* Education page: past-cohorts slider. Shared chrome comes from js/layout.js. */

(function () {
  const track = document.getElementById('cohortTrack');
  const prev = document.getElementById('cohortPrev');
  const next = document.getElementById('cohortNext');
  if (!track || !prev || !next) return;

  const perView = window.matchMedia('(max-width:900px)').matches ? 1 : 2;
  const count = track.children.length;
  const maxIdx = Math.max(0, count - perView);
  let idx = 0;

  function update() {
    const card = track.children[0];
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 24);
    const step = card.offsetWidth + gap;
    track.style.transform = `translateX(${-idx * step}px)`;
  }
  prev.addEventListener('click', () => { idx = Math.max(0, idx - 1); update(); });
  next.addEventListener('click', () => { idx = Math.min(maxIdx, idx + 1); update(); });
  window.addEventListener('resize', update);
})();
