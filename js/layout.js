/* Global site layout: injects the shared header + footer into every page,
   then wires the hide-on-scroll header behaviour.

   To use on a new page, add these to the page:
     <link rel="stylesheet" href="css/style.css">
     <div id="site-header"></div>      (where the header should go — top of <body>)
     <div id="site-footer"></div>      (where the footer should go — end of <body>)
     <script src="js/layout.js"></script>

   Note: asset/nav paths below are relative to the site root, so keep new
   pages in the same folder as index.html. */

(function () {
  const headerHTML = `
  <header id="siteHeader">
    <div class="nav">
      <div class="logo-block">
        <a href="index.html" style="display:flex;flex-direction:column;align-items:flex-start;">
          <img src="Assets/Logo/Prologue_Logo1 (1).png" alt="Prologue" class="header-logo">
          <div class="logo-sub">
            <span class="by">by</span>
            <span class="brand"><span class="top">earlyseed</span><span class="bottom">VENTURES</span></span>
          </div>
        </a>
      </div>
      <nav class="links">
        <a href="about.html">About</a>
        <a href="prefunding.html">Pre-funding</a>
        <a href="education.html">Education</a>
        <a href="faq.html">FAQs</a>
        <a href="contact.html">Contact</a>
      </nav>
    </div>
  </header>`;

  const footerHTML = `
  <footer id="contact">
    <div class="wrap foot-grid">
      <div>
        <h5>Contact us</h5>
        <a href="mailto:info@earlyseedventures.com">info@earlyseedventures.com</a>
        <a href="https://www.prologue.co.in">www.prologue.co.in</a>
      </div>
      <div>
        <h5>Address</h5>
        <p>3, Enterprise Centre, Near Orchid Hotel, Vile Parle (E), Mumbai 400099</p>
      </div>
      <div>
        <h5>Quick links</h5>
        <a href="about.html">About us</a>
        <a href="prefunding.html">Pre-funding</a>
        <a href="education.html">Education</a>
        <a href="faq.html">FAQs</a>
      </div>
    </div>
  </footer>

  <div class="foot-bottom">
    <video autoplay muted loop playsinline>
      <source src="Assets/genral/footer video.mp4" type="video/mp4">
    </video>
    <div class="inner wrap">
      <img class="big-logo" src="Assets/genral/footer logo.png" alt="Prologue by Earlyseed Ventures">
      <div class="divider"></div>
      <p class="meta">An initiative of Earlyseed Ventures</p>
      <p class="meta">&copy; 2026 Prologue. All rights reserved.</p>
      <div class="legal">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms and Conditions</a>
      </div>
    </div>
  </div>`;

  function inject() {
    const headerMount = document.getElementById('site-header');
    const footerMount = document.getElementById('site-footer');
    if (headerMount) headerMount.outerHTML = headerHTML;
    if (footerMount) footerMount.outerHTML = footerHTML;

    // Hide header on scroll down, show on scroll up
    const siteHeader = document.getElementById('siteHeader');
    if (!siteHeader) return;
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      // Transparent at the very top, translucent once scrolled into the page
      siteHeader.classList.toggle('scrolled', currentY > 10);
      // Hide on scroll down, show on scroll up
      if (currentY > lastScrollY && currentY > 120) {
        siteHeader.classList.add('header-hidden');
      } else {
        siteHeader.classList.remove('header-hidden');
      }
      lastScrollY = currentY;
    });
  }

  // Smooth fade-out when navigating to another internal page
  function wireTransitions() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || /^https?:\/\//.test(href)) return;
      // internal .html page link (ignore same-page hash jumps)
      if (!/\.html(\?|#|$)/.test(href)) return;
      const target = href.split('#')[0];
      const here = window.location.pathname.split('/').pop();
      if (target === here) return; // same page, let the hash scroll happen
      e.preventDefault();
      document.body.classList.add('page-leaving');
      setTimeout(() => { window.location.href = href; }, 260);
    });
    // If we arrive via back/forward cache, make sure we're visible
    window.addEventListener('pageshow', () => document.body.classList.remove('page-leaving'));
  }

  function boot() { inject(); wireTransitions(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
