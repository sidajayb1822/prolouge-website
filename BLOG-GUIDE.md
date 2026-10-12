# Blog Guide — Adding a Post to Prologue

For any agent (Claude, Claude Code, or a human) adding a new blog post to this
repo. Follow this exactly — it's the only place this process is documented,
and the live site (`blog.html`, the post sidebar, search/filter, the sitemap)
only works correctly if every post follows the same shape.

This is a static site: **no build step, no templating engine.** "Wiring in" a
post means literally editing the handful of files listed in Step 2 by hand.
There is no script that does this for you — you are the script. Follow the
checklist in order and don't skip a step because the post "looks done" after
Step 1; it isn't live/searchable/linked until Step 2 is also complete.

Read `CLAUDE.md` first if you haven't — it covers the whole site, not just
the blog. This file is the zoomed-in version for blog posts specifically.

---

## 0. Before you write anything, gather

- **Slug**: lowercase, hyphenated, no dates (e.g. `fundraise-fundamentals`).
  This becomes the filename (`blog-<slug>.html`) and the live URL
  (`/blog/<slug>`). Pick it like a URL, not a headline.
- **Title** (H1) and, optionally, a short subtitle.
- **Meta description**: one or two plain sentences, ~150–160 characters,
  written for a search result snippet, not a teaser.
- **Category/tags**: 1–2 short labels for the featured-slider pills (e.g.
  "Valuation", "Pre-Revenue"). Keep each under ~16 characters so the pill
  doesn't wrap.
- **Author**: name, exact role string, and a square headshot. If this author
  has written before, reuse their existing `Assets/blog/<name>-author.jpg`
  and copy their role string *exactly* from an existing post — the author
  filter on `/blog` groups posts by exact string match on `data-author`, so
  "Monica Gupta" and "Monica  Gupta" would silently split into two filters.
- **Cover image + any inline figures**, saved into `Assets/blog/` (see
  Images below).
- **Publish date** (`YYYY-MM-DD`), for the JSON-LD and the sitemap.

### Images

- Save into `Assets/blog/`, named `<slug>-<what-it-is>.jpg` (or `.png`), e.g.
  `fundraise-fundamentals-cap-table.png`. Don't reuse a generic name like
  `cover.jpg` — everything in that folder is flat, no subfolders.
- Cover image: 16:9, at least 1600×900.
- Inline figures: whatever aspect ratio the content needs; `.post-figure`
  handles the framing.
- Author headshots: square, at least 200×200.

### Reading time

Estimate it yourself: take the word count of everything that will go inside
`.post-main`, divide by 200, round to the nearest whole minute (minimum 1).
This exact figure is used in four places (byline, slider, grid card, sidebar
data) — compute it once and reuse it everywhere so they agree.

---

## 1. Write the post file

Create `blog-<slug>.html` **in the project root** — never in a subfolder.
This has been tried before and reverted: putting the *file* in a subfolder
needs its own `<base href>` hack to make its relative `Assets/…`, `css/…`
and `js/…` paths resolve, which breaks viewing the file directly (`file://`)
and is one more thing to get wrong. Flat files avoid that specific problem.

**But every post still needs its own `<base href="/">`, for a different,
unavoidable reason: the pretty URL it's served at.** Every post's clean URL
is two path segments deep (`/blog/<slug>`, from the `vercel.json` rewrite in
Step 2a), and a relative path resolves against the *browser's address bar*,
not against where the file sits on disk. At `/blog/<slug>`, `href="css/style.css"`
resolves to the nonexistent `/blog/css/style.css` — a 404 — instead of
`/css/style.css`. `<base href="/">` forces every relative path on the page
back to resolving from the site root regardless of URL depth, which fixes
it. (`blog.html` itself doesn't need this — its clean URL, `/blog`, is only
one segment deep, so relative paths already resolve correctly from root.)
This was broken in production once already by a session that assumed the
`<base href>` was *only* about file location and removed it — don't repeat
that; include it in every post's head (see the template below) even though
local preview works fine without it.

Copy an existing post as your starting point — `blog-fundraise-fundamentals.html`
is the most complete reference — rather than `page-template.html`, which
doesn't have any of the blog-specific head tags.

### 1a. Head

```html
<!DOCTYPE html>
<html lang="en">
<head>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KCS3QGR8');</script>
<!-- End Google Tag Manager -->
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-6NJRMYT00C"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-6NJRMYT00C');
</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- Required: this page is served at the 2-segment clean URL /blog/YOUR-SLUG
     (see vercel.json). Without this, every relative path below (css/, js/, Assets/,
     favicon.*) resolves against /blog/ instead of site root and 404s in production.
     Harmless for local preview via a static server; only breaks a raw file:// double-click. -->
<base href="/">
<link rel="icon" type="image/x-icon" href="favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
<title>YOUR TITLE | Prologue</title>
<meta name="description" content="YOUR META DESCRIPTION">
<link rel="canonical" href="https://www.prologue.co.in/blog/YOUR-SLUG">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Prologue by Earlyseed Ventures">
<meta property="og:title" content="YOUR TITLE">
<meta property="og:description" content="YOUR META DESCRIPTION">
<meta property="og:url" content="https://www.prologue.co.in/blog/YOUR-SLUG">
<meta property="og:image" content="https://www.prologue.co.in/Assets/blog/YOUR-COVER-IMAGE">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Playfair+Display:ital,wght@0,500;0,700&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/blog.css">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "YOUR TITLE",
  "description": "YOUR META DESCRIPTION",
  "image": "https://www.prologue.co.in/Assets/blog/YOUR-COVER-IMAGE",
  "datePublished": "YYYY-MM-DD",
  "dateModified": "YYYY-MM-DD",
  "inLanguage": "en-IN",
  "articleSection": "YOUR CATEGORY",
  "author": {"@type": "Person", "name": "AUTHOR NAME", "jobTitle": "AUTHOR ROLE", "worksFor": {"@type": "Organization", "name": "Earlyseed Ventures"}},
  "publisher": {"@type": "Organization", "name": "Prologue by Earlyseed Ventures", "logo": {"@type": "ImageObject", "url": "https://www.prologue.co.in/Assets/Logo/Prologue_Logo1%20(1).png"}},
  "mainEntityOfPage": "https://www.prologue.co.in/blog/YOUR-SLUG"
}
</script>
</head>
```

Notes:
- `canonical`, `og:url` and the JSON-LD `mainEntityOfPage` all use the
  **pretty URL** (`/blog/<slug>`), on the `www` host — never the real
  filename, and never the bare `prologue.co.in` host (it 308-redirects to
  `www`; every URL on this site should point straight at the final host).
- The `author` object can grow richer fields (`alumniOf`, `knowsAbout`,
  `description`, `sameAs`) — see `blog-fundraise-fundamentals.html` for an
  example — but `name`, `jobTitle` and `worksFor` are the minimum.
- Only add `"isPartOf": {"@type": "CreativeWorkSeries", "name": "..."}` if
  this post is genuinely part of a numbered series.

### 1b. Body

```html
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KCS3QGR8"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

<div id="site-header"></div>

<article data-post-slug="YOUR-SLUG">
  <section class="post-body">
    <div class="wrap">
      <div class="post-layout">
        <div class="post-main">

          <div class="post-top">
            <p class="post-kicker">Prologue Blog · YOUR CATEGORY</p>
            <h1>YOUR TITLE</h1>
            <!-- Optional subtitle, Caveat handwriting font: -->
            <!-- <p class="post-subtitle">Your Subtitle</p> -->
            <div class="post-byline">
              <img class="avatar" src="Assets/blog/AUTHOR-PHOTO" alt="AUTHOR NAME" width="48" height="48">
              <div><strong>AUTHOR NAME</strong>AUTHOR ROLE</div>
            </div>
          </div>

          <!-- Your content goes here. See "Content components" below for
               the TL;DR box, figures, tables, key-terms, napkin box, etc. -->

          <div class="post-cta">
            <h2>Let's write your prologue</h2>
            <p>Your CTA copy.</p>
            <div class="btns">
              <a class="btn btn-orange" href="prefunding.html">Explore our pre-funding packages</a>
              <a class="btn-outline" href="contact.html">Talk to us</a>
            </div>
          </div>

          <div class="author-box">
            <img src="Assets/blog/AUTHOR-PHOTO" alt="AUTHOR NAME, AUTHOR ROLE" width="96" height="96" loading="lazy">
            <div>
              <h3>About AUTHOR NAME</h3>
              <p>A couple of sentences of author bio.</p>
            </div>
          </div>

        </div>
        <aside class="post-sidebar">
          <div class="sidebar-section">
            <p class="sidebar-label">Most Recent</p>
            <div id="sidebarFeatured"></div>
          </div>
          <div class="sidebar-section">
            <p class="sidebar-label">Read Next</p>
            <div id="sidebarNext" class="sidebar-next-list"></div>
          </div>
        </aside>
      </div>
    </div>
  </section>
</article>

<div id="site-footer"></div>

<script src="js/layout.js"></script>
<script src="js/post-sidebar.js"></script>
<script src="js/post-audio.js"></script>
</body>
</html>
```

**Don't skip the sidebar markup or the `data-post-slug` attribute.** Without
`data-post-slug`, `js/post-sidebar.js` can't tell which post it's on and
silently does nothing — the "Most Recent" / "Read Next" boxes just stay
empty. This is also what makes *other* posts' sidebars start linking to your
new post (see Step 2d) — it's not automatic just by the file existing.

**Don't pull the title block (`.post-top`) back out into its own
`<section class="post-hero">`, even though that looks like the "obvious"
place for it.** It lives inside `.post-main`, as the first thing in the
`.post-layout` grid, specifically so it shares a grid row with
`.post-sidebar` — that's what makes "Most Recent" start level with the
kicker/title instead of being pushed down to align with the TL;DR box or
first paragraph. (`.post-hero` the *class* still exists in `blog.css` and is
still correct to use — but only for `blog.html`'s own plain index-page
heading, which has no sidebar next to it.)

### Content components available in `css/blog.css`

Use these instead of inventing new markup:

| Component | Markup | Use for |
|---|---|---|
| Lead paragraph | `<p class="lead">…</p>` | The opening hook line |
| TL;DR box | `<div class="post-tldr"><h2>TL;DR</h2><p>…</p></div>` | A 2–3 sentence summary up top |
| Figure | `<figure class="post-figure"><img …><figcaption>…</figcaption></figure>` | Any inline image |
| Vertical video embed | `<figure class="post-figure post-video"><div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/ID?rel=0" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><figcaption>…</figcaption></figure>` | A YouTube Short / 9:16 clip. Always `youtube-nocookie.com`. |
| Table | `<div class="table-scroll"><table><caption>…</caption><thead>…</thead><tbody>…</tbody></table></div>` | Any tabular data; wrap in `.table-scroll` so it scrolls on mobile instead of breaking layout |
| Table totals row | `<tr class="is-total">…</tr>` | The last row of a table that sums the others |
| Table footnote | `<p class="table-note">…</p>` | A source/sampling note directly under a table |
| Key terms | `<div class="key-terms"><h2>Key Terms</h2><dl><dt>Term</dt><dd>Definition</dd>…</dl></div>` | A glossary block, usually near the end |
| Napkin math box | `<div class="napkin-box"><h2>…</h2><p class="napkin-sub">…</p><div class="table-scroll">…</div></div>` | A formula/worked-example table |
| Callout note | `<p class="post-note">…</p>` | A disclaimer or aside |
| [VERIFY] badge | `<span class="verify">VERIFY</span>` | Flag a claim you haven't confirmed yet — **remove every one before the post ships** |
| CTA block | `<div class="post-cta">…</div>` | End-of-post call to action (template above) |
| Author box | `<div class="author-box">…</div>` | End-of-post author bio (template above) |

Standard `<h2>`, `<h3>`, `<p>`, `<ul>`/`<ol>`, and `<strong>` all already have
post-body styling — don't wrap them in extra classes.

---

## 2. Wire the post into the site

A post isn't done after Step 1 — it exists as a file, but nothing links to
it, the sitemap doesn't know about it, and its own "Most Recent"/"Read Next"
boxes are empty because *other* posts don't know about it either. Do all
four of these:

### 2a. `vercel.json` — the pretty URL

Add one entry to the `rewrites` array:

```json
{
  "source": "/blog/YOUR-SLUG",
  "destination": "/blog-YOUR-SLUG"
}
```

This is what makes `/blog/YOUR-SLUG` resolve on the deployed site. **It does
nothing locally** — Python's `http.server` (or any plain static server) has
no concept of `vercel.json`. To preview locally, open the real filename
directly: `blog-YOUR-SLUG.html`. A 404 on the pretty URL at `localhost` is
expected and not a bug.

### 2b. `sitemap.xml` — so Google finds it

Add one entry:

```xml
<url>
  <loc>https://www.prologue.co.in/blog/YOUR-SLUG</loc>
  <lastmod>YYYY-MM-DD</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

Also bump the `<lastmod>` on the existing `https://www.prologue.co.in/blog`
entry to today's date, since that listing page changed too.

### 2c. `blog.html` — the index page

**Always** add a card to `#blogGrid` (inside `.post-list .wrap`):

```html
<a class="post-card" href="/blog/YOUR-SLUG" data-author="AUTHOR NAME" data-title="YOUR TITLE" data-excerpt="YOUR EXCERPT">
  <img src="Assets/blog/YOUR-COVER-IMAGE" alt="DESCRIPTIVE ALT TEXT" loading="lazy">
  <div class="txt">
    <h2>YOUR TITLE</h2>
    <p>YOUR EXCERPT</p>
    <div class="card-meta">
      <img class="avatar" src="Assets/blog/AUTHOR-PHOTO" alt="" width="28" height="28">
      <span>AUTHOR NAME · N min read</span>
    </div>
    <span class="more">Read the post →</span>
  </div>
</a>
```

`data-author` must match the author's byline string exactly — it's what the
author filter pills on `/blog` group by, generated automatically from
whatever `data-author` values exist in the grid. No other file to edit for
the filter to pick up a new author.

Keep the card's `<h2>` and `<p>` reasonably short — the grid reserves a fixed
two-line title and three-line excerpt (so every card bottom-aligns
regardless of content length); longer text just gets clipped. If your real
title/excerpt is long, shorten what's *displayed* here and keep the full
version in `data-title`/`data-excerpt` (used for search matching, not
display) — see how the Pitch Deck post's long title is shortened on its
card but kept in full in `data-title`.

**If this post is now one of the 3 most recent published**, also add it to
the `.feat-slide` carousel (inside `.feat-track`) **and remove whichever
slide is now the 4th-most-recent** — the slider always shows exactly 3:

```html
<a class="feat-slide" href="/blog/YOUR-SLUG">
  <div class="feat-media"><img src="Assets/blog/YOUR-COVER-IMAGE" alt="DESCRIPTIVE ALT TEXT" loading="lazy"></div>
  <div class="feat-txt">
    <div class="feat-tags"><span class="feat-tag">TAG ONE</span><span class="feat-tag">TAG TWO</span></div>
    <h2>YOUR TITLE</h2>
    <p>YOUR EXCERPT (short — see below)</p>
    <div class="feat-byline">
      <img class="avatar" src="Assets/blog/AUTHOR-PHOTO" alt="AUTHOR NAME" width="48" height="48">
      <div><strong>AUTHOR NAME</strong><span>AUTHOR ROLE · N min read</span></div>
    </div>
  </div>
</a>
```

Put the newest post's slide **first** in `.feat-track` and mark it
`class="feat-slide is-active"` (only one slide ever has `is-active`); the
other two slides get plain `class="feat-slide"`. `js/blog-index.js` handles
the rotation, dots and autoplay — you don't need to touch that file. Keep
the slider's title to ≤2 lines and excerpt to ≤3 lines for its viewport
width (~480px) — the slide box is a fixed height (460px) so it doesn't
reflow the page when the carousel rotates; longer text just clips.

### 2d. `js/post-sidebar.js` — the "Most Recent" / "Read Next" boxes

Add one entry to the **top** of the `POSTS` array (newest first):

```js
{ slug: 'YOUR-SLUG', title: 'YOUR TITLE', image: 'Assets/blog/YOUR-COVER-IMAGE', author: 'AUTHOR NAME', avatar: 'Assets/blog/AUTHOR-PHOTO', readTime: 'N min read', excerpt: 'ONE OR TWO SHORT SENTENCES' },
```

If the title or excerpt contains an apostrophe, wrap that value in double
quotes (`"Esha's Options"`). A bare `'` inside single quotes ends the string,
the whole file fails to parse, and every post's sidebar goes blank.

This is the **only** place this data lives. Adding it here is what makes:
- your new post's own sidebar populate ("Most Recent" = whatever's now #1
  excluding itself, "Read Next" = the rest), and
- every *existing* post's sidebar automatically start including your new
  post, with no edits to those other files.
- hovering a link to your post from any other post's body show a small
  preview card (cover, title, `excerpt`, author). Reuse the short excerpt
  from the post's `blog.html` slide or card.

If you forget this step, your new post's sidebar renders empty (harmless,
but pointless) and no other post will ever link to it.

---

## 3. Verify before calling it done

- [ ] File is `blog-<slug>.html`, flat in the project root (not a subfolder).
- [ ] `<article data-post-slug="...">` slug matches the filename's slug,
      the `vercel.json` rewrite, the `sitemap.xml` entry, the `blog.html`
      card's `href`, and the `js/post-sidebar.js` entry — all five, exactly.
- [ ] `canonical` / `og:url` / JSON-LD `mainEntityOfPage` all use
      `https://www.prologue.co.in/blog/<slug>` (the `www` host, the pretty
      URL — never the bare host, never the real filename).
- [ ] JSON-LD is valid JSON (paste it through any JSON validator, or
      `python3 -c "import json; json.load(open('x.json'))"` on an extracted
      copy).
- [ ] `data-author` on the grid card matches the post's byline name exactly
      (case and spacing).
- [ ] `<base href="/">` **is present** in the head (not missing — see Step 1a).
      Easy to assume a flat-root file doesn't need it; it does, because of the
      post's 2-segment clean URL, not its location on disk.
- [ ] No leftover `.verify` badges.
- [ ] Pressed **Listen** under the byline and heard the post start with its
      title. The player is built by `js/post-audio.js` — no per-post setup
      beyond the `<script>` tag in the template above.
- [ ] Opened the real filename locally (`blog-<slug>.html`) and confirmed:
      images load, the sidebar shows the right "Most Recent"/"Read Next"
      posts, and the browser console has no errors.
- [ ] Opened `blog.html` locally and confirmed: the new card appears in the
      grid, the author pill for a new author appears (or the post groups
      under an existing one correctly), and — if applicable — the new
      featured slide appears and the carousel still has exactly 3 slides.
- [ ] Remember: the pretty `/blog/<slug>` URL will 404 on `localhost` — that
      only resolves once deployed to Vercel. Don't treat that as a bug.

---

## Reference: who owns what

- `js/blog-index.js` — the `/blog` index page's slider rotation, dashes,
  autoplay, search box and author-pill filter. Reads the grid's
  `data-author`/`data-title`/`data-excerpt` attributes; you don't edit this
  file to add a post.
- `js/post-sidebar.js` — the only data source for every post's "Most
  Recent"/"Read Next" sidebar. Edit this file's `POSTS` array (Step 2d) for
  every new post.
- `js/post-audio.js` — the "Listen to this article" player on every post.
  Reads the post aloud with the browser's built-in voice, skipping tables,
  the CTA, the author box and the sidebar. Builds itself under the byline;
  you don't edit this file to add a post, just include its `<script>` tag.
- `css/blog.css` — all styling for `blog.html` and every post page, loaded
  after `css/style.css`. Reuse the classes in the Content Components table
  above before inventing new ones.
- `vercel.json` — maps every pretty `/blog/<slug>` URL to its real
  `blog-<slug>.html` filename (Step 2a). Vercel-only; irrelevant to local
  preview.
