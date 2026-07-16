/* Pre-funding page interactions: Pitch Deck / Financial Modelling tabs + case-work slider.
   Shared header/footer come from js/layout.js. */

(function () {
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
    "Assets/pre funding/case work/Mool.png",
    "Assets/pre funding/case work/revior.png",
    "Assets/pre funding/case work/superhuman.png",
    "Assets/pre funding/case work/INNOEVERSITY.png",
    "Assets/pre funding/case work/TFG.png",
    "Assets/pre funding/case work/the growing girrafe.png",
    "Assets/pre funding/case work/the skin studio.png"
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
