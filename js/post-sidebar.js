/* Individual blog post pages only: "Most Recent" + "Read Next" sidebar.
   Reads the current post from <article data-post-slug="...">.
   Newest post first — add a new post to the top of POSTS when it ships. */

(function () {
  var POSTS = [
    { slug: 'same-money-different-paper', title: "Same Money, Different Paper: Esha's Options", image: 'Assets/blog/post-02-scene-1-same-money-different-paper.png', author: 'Sakshay Upadhyay', avatar: 'Assets/blog/sakshay-upadhyay-author.jpg', readTime: '12 min read' },
    { slug: 'fundraise-fundamentals', title: 'Fundraise Fundamentals: Four Friends', image: 'Assets/blog/post-01-scene-1-house-100-shares.png', author: 'Sakshay Upadhyay', avatar: 'Assets/blog/sakshay-upadhyay-author.jpg', readTime: '10 min read' },
    { slug: 'how-to-value-pre-revenue-startup-india', title: 'How to Value a Pre-Revenue Startup in India', image: 'Assets/blog/valuation-cover.jpg', author: 'Monica Gupta', avatar: 'Assets/blog/monica-gupta-author.jpg', readTime: '9 min read' },
    { slug: 'startup-pitch-deck-examples', title: 'What a Startup Pitch Deck Should Look Like', image: 'Assets/blog/kalaneca-story-slide.jpg', author: 'Monica Gupta', avatar: 'Assets/blog/monica-gupta-author.jpg', readTime: '5 min read' }
  ];

  var article = document.querySelector('article[data-post-slug]');
  var featuredEl = document.getElementById('sidebarFeatured');
  var nextEl = document.getElementById('sidebarNext');
  if (!article || !featuredEl || !nextEl) return;

  var currentSlug = article.dataset.postSlug;
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
})();
