/* Home-page-only interactions: offerings tabs + testimonials carousel.
   The shared header/footer + scroll behaviour live in js/layout.js. */

(function () {
  // Offerings tabs
  const tabs = document.querySelectorAll('.tabs button');
  const panels = document.querySelectorAll('.tab-content');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === btn.dataset.tab));
    });
  });

  // Testimonials carousel
  const testimonials = [
    {
      name: "Sudhir Mehta",
      role: "Founder, YahaWater Pvt. Ltd.",
      quote: "Developing a compelling pitch deck can be one of the hardest parts of being an entrepreneur. Crafting and sequencing its components so it tells an effective story can build a relationship with an investor right at the beginning. ESV not only made a great deck but stuck to our brand guidelines to maintain the ethos of Yahawater.",
      img: "Assets/home page/sudhir .png"
    },
    {
      name: "Nitya Saxena",
      role: "Founder, Revoir",
      quote: "It was amazing working with the team. Very detailed oriented and thorough with their work. Extremely knowledgeable and kind. I really appreciate the guidance. Would highly recommend.",
      img: "Assets/home page/nitya.png"
    }
  ];
  const testi = document.querySelector('.testi');
  if (!testi) return;
  const testiName = document.getElementById('testiName');
  const testiRole = document.getElementById('testiRole');
  const testiQuote = document.getElementById('testiQuote');
  const testiAvatar = document.getElementById('testiAvatar');
  let testiIndex = 0;
  function renderTesti() {
    const t = testimonials[testiIndex];
    testiName.textContent = t.name;
    testiRole.textContent = t.role;
    testiQuote.textContent = t.quote;
    testiAvatar.style.backgroundImage = `url('${encodeURI(t.img)}')`;
    testi.classList.toggle('at-start', testiIndex === 0);
    testi.classList.toggle('at-end', testiIndex === testimonials.length - 1);
  }
  document.getElementById('testiPrev').addEventListener('click', () => {
    if (testiIndex > 0) { testiIndex--; renderTesti(); }
  });
  document.getElementById('testiNext').addEventListener('click', () => {
    if (testiIndex < testimonials.length - 1) { testiIndex++; renderTesti(); }
  });
  renderTesti();
})();
