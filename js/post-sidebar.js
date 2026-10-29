/* Individual blog post pages only: "Most Recent" + "Read Next" sidebar,
   and a small preview card when hovering a link to another post.
   Reads the current post from <article data-post-slug="...">.
   Newest post first — add a new post to the top of POSTS when it ships. */

(function () {
  var POSTS = [
    { slug: 'someone-else-wants-in', title: 'Someone Else Wants In', image: 'Assets/blog/post-04-scene-1-gauri-at-the-gate.png', author: 'Sakshay Upadhyay', avatar: 'Assets/blog/sakshay-upadhyay-author.jpg', readTime: '8 min read', excerpt: 'A new investor joins at double the share price. Dilution round after round, and who pro-rata really costs.' },
    { slug: 'where-indian-deep-tech-breaks', title: 'Where Indian Deep Tech Really Breaks', image: 'Assets/blog/where-indian-deep-tech-breaks-cover.jpg', author: 'Siddarth Menon', avatar: 'Assets/blog/siddarth-menon-author.jpg', readTime: '10 min read', excerpt: 'A record $2.99 billion raised in 2025, yet only 15% of funds back the lab stage. Capital is arriving, but not evenly.' },
    { slug: 'get-your-fundraise-timing-right', title: 'Too Early or Too Late?', image: 'Assets/blog/get-your-fundraise-timing-right-cover.jpg', author: 'Karan Shah', avatar: 'Assets/blog/karan-shah-author.jpg', readTime: '7 min read', excerpt: 'Seed funding in India fell 37% in 2026 and first-time funded companies dropped 30%. The three signals that say you are ready.' },
    { slug: 'deep-tech-defined', title: 'Deep Tech, Defined', image: 'Assets/blog/deep-tech-defined-cover.jpg', author: 'Siddarth Menon', avatar: 'Assets/blog/siddarth-menon-author.jpg', readTime: '5 min read', excerpt: 'Deep tech is now a legal category in India. What the definition asks for, and why the SaaS playbook does not fit.' },
    { slug: 'right-investors-for-your-startup', title: 'The Right Money: Who Invests Matters', image: 'Assets/blog/right-investors-for-your-startup-cover.jpg', author: 'Monica Gupta', avatar: 'Assets/blog/monica-gupta-author.jpg', readTime: '9 min read', excerpt: "Patient capital, sector-fit investors and the term sheet clauses every founder should read twice." },
    { slug: 'esop-essentials', title: 'ESOP Essentials: A Slice for Farhan', image: 'Assets/blog/post-03-scene-1-one-more-line.png', author: 'Sakshay Upadhyay', avatar: 'Assets/blog/sakshay-upadhyay-author.jpg', readTime: '9 min read', excerpt: "What an ESOP pool is, how vesting and the cliff work, and why a pool in the pre-money comes out of the founders' slice." },
    { slug: 'india-defence-importer-to-builder', title: "From Biggest Importer to Builder", image: 'Assets/blog/india-defence-importer-to-builder-cover.jpg', author: 'Karan Shah', avatar: 'Assets/blog/karan-shah-author.jpg', readTime: '5 min read', excerpt: "India is still the second largest arms importer, yet defence production hit a record Rs 1.78 lakh crore in FY26. Here is what changed." },
    { slug: 'same-money-different-paper', title: "Same Money, Different Paper: Esha's Options", image: 'Assets/blog/post-02-scene-1-same-money-different-paper.png', author: 'Sakshay Upadhyay', avatar: 'Assets/blog/sakshay-upadhyay-author.jpg', readTime: '12 min read', excerpt: 'The same cheque can buy very different things. Equity, CCPS, CCDs, NCDs and iSAFE, explained with a house.' },
    { slug: 'fundraise-fundamentals', title: 'Fundraise Fundamentals: Four Friends', image: 'Assets/blog/post-01-scene-1-house-100-shares.png', author: 'Sakshay Upadhyay', avatar: 'Assets/blog/sakshay-upadhyay-author.jpg', readTime: '10 min read', excerpt: 'Four friends buy a house. One example explains shares, face value, share premium, and dilution.' },
    { slug: 'how-to-value-pre-revenue-startup-india', title: 'How to Value a Pre-Revenue Startup in India', image: 'Assets/blog/how-to-value-pre-revenue-startup-india-cover.jpg', author: 'Monica Gupta', avatar: 'Assets/blog/monica-gupta-author.jpg', readTime: '9 min read', excerpt: 'The five methods investors use, what actually moves the number, and why you still need a valuation report after angel tax.' },
    { slug: 'startup-pitch-deck-examples', title: 'What a Startup Pitch Deck Should Look Like', image: 'Assets/blog/startup-pitch-deck-examples-cover.jpg', author: 'Monica Gupta', avatar: 'Assets/blog/monica-gupta-author.jpg', readTime: '5 min read', excerpt: "Most pitch decks don't fail because the business is weak. They fail because the story is missing." }
  ];

  var article = document.querySelector('article[data-post-slug]');
  if (!article) return;
  var currentSlug = article.dataset.postSlug;

  renderSidebar();
  setupLinkPreviews();

  function renderSidebar() {
    var featuredEl = document.getElementById('sidebarFeatured');
    var nextEl = document.getElementById('sidebarNext');
    if (!featuredEl || !nextEl) return;

    var others = POSTS.filter(function (p) { return p.slug !== currentSlug; });
    if (!others.length) return;

    var featured = others[0];
    var readNext = others.slice(1);

    featuredEl.innerHTML =
      '<a class="sidebar-featured" href="/blog/' + featured.slug + '">' +
        '<img src="' + featured.image + '" alt="" loading="lazy">' +
        '<h3>' + featured.title + '</h3>' +
        '<div class="sidebar-meta"><img src="' + featured.avatar + '" alt=""><span>' + featured.author + ' · ' + featured.readTime + '</span></div>' +
      '</a>';

    var nextSection = nextEl.closest('.sidebar-section');
    if (!readNext.length) {
      if (nextSection) nextSection.hidden = true;
      return;
    }

    nextEl.innerHTML = readNext.map(function (p) {
      return '<a class="sidebar-next-item" href="/blog/' + p.slug + '">' +
        '<img src="' + p.image + '" alt="" loading="lazy">' +
        '<div><h4>' + p.title + '</h4><span>' + p.author + ' · ' + p.readTime + '</span></div>' +
      '</a>';
    }).join('');
  }

  /* Hovering (or keyboard-focusing) a link in the post body that points at
     another post in POSTS shows a small card: cover, title, excerpt, author.
     Pointer devices only — on touch screens a tap just follows the link. */
  function setupLinkPreviews() {
    if (!window.matchMedia || !window.matchMedia('(hover: hover)').matches) return;

    var bySlug = {};
    POSTS.forEach(function (p) { bySlug[p.slug] = p; });

    var main = document.querySelector('.post-main') || article;
    var links = Array.prototype.filter.call(main.querySelectorAll('a[href]'), function (a) {
      var slug = slugOf(a);
      return slug && slug !== currentSlug && bySlug[slug];
    });
    if (!links.length) return;

    var card = document.createElement('a');
    card.className = 'link-preview';
    card.setAttribute('aria-hidden', 'true');
    card.tabIndex = -1;
    card.innerHTML =
      '<img alt="">' +
      '<div class="lp-body">' +
        '<p class="lp-kicker">Prologue Blog</p>' +
        '<p class="lp-title"></p>' +
        '<p class="lp-excerpt"></p>' +
        '<div class="lp-meta"><img alt=""><span></span></div>' +
      '</div>';
    document.body.appendChild(card);

    var showTimer, hideTimer, activeLink = null;

    links.forEach(function (a) {
      a.addEventListener('mouseenter', function () { queueShow(a); });
      a.addEventListener('mouseleave', queueHide);
      a.addEventListener('focus', function () { show(a); });
      a.addEventListener('blur', queueHide);
    });
    card.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
    card.addEventListener('mouseleave', queueHide);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
    window.addEventListener('scroll', hide, { passive: true });

    function slugOf(a) {
      var url;
      try { url = new URL(a.getAttribute('href'), window.location.origin); } catch (err) { return null; }
      if (url.origin !== window.location.origin) return null;
      var m = url.pathname.match(/^\/blog\/([^\/]+)\/?$/) || url.pathname.match(/^\/blog-([^\/]+?)(?:\.html)?$/);
      return m ? m[1] : null;
    }

    function queueShow(a) {
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
      showTimer = setTimeout(function () { show(a); }, 180);
    }

    function queueHide() {
      clearTimeout(showTimer);
      hideTimer = setTimeout(hide, 160);
    }

    function show(a) {
      clearTimeout(hideTimer);
      var p = bySlug[slugOf(a)];
      if (!p) return;
      if (activeLink !== a) {
        card.href = a.getAttribute('href');
        card.querySelector('img').src = p.image;
        card.querySelector('.lp-title').textContent = p.title;
        card.querySelector('.lp-excerpt').textContent = p.excerpt || '';
        card.querySelector('.lp-meta img').src = p.avatar;
        card.querySelector('.lp-meta span').textContent = p.author + ' · ' + p.readTime;
        activeLink = a;
      }
      position(a);
      card.classList.add('is-open');
    }

    function hide() {
      clearTimeout(showTimer);
      card.classList.remove('is-open');
      activeLink = null;
    }

    // Below the link if it fits, otherwise above; kept inside the viewport sideways.
    function position(a) {
      var rects = a.getClientRects();
      var r = rects.length ? rects[0] : a.getBoundingClientRect();
      var gap = 10, edge = 12;
      var w = card.offsetWidth, h = card.offsetHeight;
      var left = Math.min(Math.max(r.left, edge), window.innerWidth - w - edge);
      var top = r.bottom + gap;
      if (top + h > window.innerHeight - edge && r.top - gap - h > edge) top = r.top - gap - h;
      card.style.left = left + 'px';
      card.style.top = top + 'px';
    }
  }
})();
