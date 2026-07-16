# Prologue — Website Guide

Marketing site for **Prologue by Earlyseed Ventures** (a founder-first ecosystem
that prepares startups for investment). Plain static HTML/CSS/JS — no build step,
no framework. Pages are opened directly in the browser (`file://`) or served as
static files.

---

## Project structure

```
Prologue New website/
├─ index.html          # Home page (content only; header/footer injected)
├─ about.html          # About page
├─ prefunding.html     # Pre-funding page
├─ education.html      # Education page
├─ faq.html            # FAQ page
├─ contact.html        # Contact page (form via FormSubmit + embedded map)
├─ page-template.html  # Starter — COPY THIS to make any new page
├─ CLAUDE.md           # This file
├─ css/
│  ├─ style.css        # ALL shared styling (design tokens + components)
│  ├─ about.css        # About-page-only sections (loaded after style.css)
│  ├─ prefunding.css   # Pre-funding-page-only sections (loaded after style.css)
│  ├─ education.css    # Education-page-only sections (loaded after style.css)
│  ├─ faq.css          # FAQ-page-only sections (loaded after style.css)
│  └─ contact.css      # Contact-page-only sections (loaded after style.css)
├─ js/
│  ├─ layout.js        # GLOBAL: injects header + footer, header scroll behavior
│  ├─ home.js          # Home-only: offerings tabs + testimonials carousel
│  ├─ prefunding.js    # Pre-funding-only: tabs + case-work slider
│  ├─ education.js     # Education-only: past-cohorts slider
│  └─ faq.js           # FAQ-only: accordion toggle
└─ Assets/
   ├─ Logo/            # Prologue_Logo1 (colored wordmark), Prologue_Logo2 (lockup)
   ├─ genral/          # footer logo.png (white), footer video.mp4
   └─ home page/       # section photos, sudhir.png, nitya.png, traphy imag.png
```

---

## Creating a new page (IMPORTANT)

**Always copy `page-template.html`.** It already wires up the shared layout. The
recipe for every page:

```html
<head>
  <!-- Google Fonts (keep this exact link) + the shared stylesheet -->
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div id="site-header"></div>   <!-- header injected here -->

  <!-- your page content in <section> blocks -->

  <div id="site-footer"></div>   <!-- footer injected here -->

  <script src="js/layout.js"></script>   <!-- required on every page -->
  <!-- add a page-specific script only if the page needs JS -->
</body>
```

Rules:
- **Header and footer are global.** They live ONLY in `js/layout.js`. Never paste
  header/footer markup into a page — edit `layout.js` once and every page updates.
- **Keep new pages in the project root** (same folder as `index.html`). Asset and
  nav paths are root-relative (`Assets/...`, `index.html#...`). Subfolders would
  break them — ask before introducing them.
- Reuse existing classes from `style.css` before inventing new ones. Add new
  component styles to `style.css`, not inline `<style>` blocks.

---

## Design tokens (CSS variables in `css/style.css` `:root`)

| Token       | Value      | Use                                   |
|-------------|------------|---------------------------------------|
| `--blue`    | `#4361EE`  | Primary brand, headings, links        |
| `--teal`    | `#2FA6B0`  | Nav tabs, accents, arrows             |
| `--mint`    | `#4BE0B0`  | Mint buttons, outline accents         |
| `--orange`  | `#EE6C3B`  | Primary CTA buttons                   |
| `--gold`    | `#E7A93E`  | Footer background, CTA heading        |
| `--indigo`  | `#4F5FE0`  | Secondary blue                        |
| `--ink`     | `#1B2340`  | Default text color                    |
| `--muted`   | `#6B7280`  | Secondary/caption text                |
| `--paper`   | `#FCFCFB`  | Page background base                  |
| `--line`    | `#E7E7E2`  | Borders / dividers                    |

**Page background:** subtle dotted grid — `radial-gradient(circle,#e9e9e4 1px,transparent 1px) 0 0/24px 24px` over `--paper`. This is set on `body`; don't override per page.

---

## Typography

- **Body & headings:** `Poppins` (weights 400–800).
- **Logo cursive "by":** `Caveat`.
- **Logo serif "earlyseed VENTURES":** `Playfair Display`.
- Load all three via the Google Fonts `<link>` already in every page's `<head>`.

Heading scale:
- Hero `h1`: `82px`, uppercase, `--blue`.
- Section titles (`.section-title`): `48px`, `--blue`. Two-line titles use `<br>`.
- CTA heading (`.cta h2`): `46px`, `--gold`.

---

## Layout conventions

- Content container: `.wrap` (max-width `1180px`, `0 32px` padding). Center everything in a `.wrap`.
- Vertical rhythm: each `<section>` has `70px 0` padding.
- Sections carry anchor ids used by the nav: `#about`, `#prefunding`, `#education`, `#contact`. Reuse these ids so the shared nav links keep working.

---

## Components (already in `style.css`)

**Buttons**
- `.btn.btn-orange` — primary CTA (orange, white text).
- `.btn.btn-mint` — mint, dark text.
- `.btn-outline` — mint outline, transparent.

**Header** (`layout.js`)
- Logo lockup: `Prologue_Logo1` wordmark with "by / earlyseed / VENTURES" stacked below (Caveat + Playfair).
- Nav = overlapping **folder tabs** (`nav.links a`): teal, white border, rounded tops, sharp bottoms, staggered z-index.
- Behavior: **transparent at the very top**, **translucent frosted** (`.scrolled`) once scrolled; **hides on scroll down, reappears on scroll up** (`.header-hidden`).

**Footer** (`layout.js`) — two parts:
1. Gold `footer` with a 3-column `.foot-grid` (Contact / Address / Quick links).
2. Dark `.foot-bottom` with looping `footer video.mp4` background, the white `footer logo.png`, blue divider, and legal links.

**Section patterns to reuse**
- `.split` — two-column "title left / copy right".
- `.tabs` + `.offer-panel` + `.tab-content` — tabbed panels (see `home.js` for the switch logic).
- `.offer-cards .card` — colored pricing/feature cards with dashed `.rule` divider.
- `.scale-grid .cell` — 4 full-bleed colored columns with a right-aligned white `.dash`.
- `.testi` — testimonial carousel (content / photo / circular arrow buttons; see `home.js`).

---

## Testing

Open the target `.html` file in a browser. The header/footer only render when the
page runs (they're injected by `layout.js`) — that's expected, and it works on
`file://` because the markup is embedded in the JS (no `fetch`).

## Conventions recap
- Static site, no build. Don't add bundlers/frameworks without asking.
- Shared styling → `css/style.css`. Shared chrome → `js/layout.js`.
- New page → copy `page-template.html`, keep it in the root, reuse tokens & classes.
