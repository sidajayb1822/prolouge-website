/* Individual blog post pages only: "Listen to this article" player.
   Reads the post aloud with the browser's built-in speech engine (Web Speech
   API) — no audio files, no accounts, no cost. The voice comes from the
   reader's device, so quality varies (best on Edge, Safari/iOS and Chrome).

   The player builds itself and is placed under the byline in .post-top, so a
   post only needs <script src="js/post-audio.js"></script>. Skips tables,
   the CTA, the author box and the sidebar. If the browser can't speak, the
   player simply doesn't appear. */

(function () {
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return;

  var article = document.querySelector('article[data-post-slug]');
  var main = article && article.querySelector('.post-main');
  var top = main && main.querySelector('.post-top');
  if (!top) return;

  var synth = window.speechSynthesis;
  var RATES = [1, 1.25, 1.5, 2, 0.75];
  var WORDS_PER_MIN = 160;
  var MAX_CHUNK = 220; // Chrome cuts off utterances longer than ~15s, so speak in short pieces

  // ---------- 1. Collect what to read ----------
  var READ = 'h2, h3, h4, p, li, dt, dd, blockquote, figcaption, caption';
  var SKIP = '.post-top, .post-cta, .author-box, .post-sidebar, .post-video, .media-todo, .table-note, thead, tbody, .listen-slot';

  var blocks = [];
  function addBlock(el, text) {
    text = speakable(text);
    if (text) blocks.push({ el: el, chunks: chunk(text), words: text.split(/\s+/).length });
  }

  var title = top.querySelector('h1');
  var subtitle = top.querySelector('.post-subtitle');
  var author = top.querySelector('.post-byline strong');
  addBlock(title, endSentence(textOf(title)) + (subtitle ? ' ' + endSentence(textOf(subtitle)) : '') +
    (author ? ' By ' + endSentence(textOf(author)) : ''));

  main.querySelectorAll(READ).forEach(function (el) {
    if (el.closest(SKIP)) return;
    var text = textOf(el);
    if (el.tagName === 'CAPTION') text = 'Table: ' + endSentence(text);
    addBlock(el, text);
  });
  if (blocks.length < 2) return;

  var totalWords = blocks.reduce(function (n, b) { return n + b.words; }, 0);

  function textOf(el) {
    if (!el) return '';
    var copy = el.cloneNode(true);
    copy.querySelectorAll('.verify, sup').forEach(function (n) { n.remove(); });
    return copy.textContent.replace(/\s+/g, ' ').trim();
  }
  function endSentence(t) { return /[.!?]$/.test(t) ? t : t + '.'; }

  // Make Indian-style numbers and symbols sound right.
  function speakable(t) {
    return t
      .replace(/\bTL;DR\b/g, 'In short')
      // 25,00,000 -> 25 lakh, 1,20,00,000 -> 1.2 crore
      .replace(/\b\d{1,2}(?:,\d{2})+,\d{3}\b/g, function (m) { return indianNumber(Number(m.replace(/,/g, ''))); })
      // ₹30 lakh / Rs 8 crore / INR 500 -> 30 lakh rupees
      .replace(/(?:₹|\bRs\.?|\bINR)\s?(\d+(?:,\d+)*(?:\.\d+)?(?:\s(?:thousand|lakh|crore|million|billion|trillion))*)/g, '$1 rupees')
      .replace(/\s=\s/g, ' equals ')
      .replace(/\s\+\s/g, ' plus ')
      .replace(/÷/g, ' divided by ')
      .replace(/×/g, ' times ')
      .replace(/≈/g, ' about ')
      .replace(/→/g, ' to ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function indianNumber(n) {
    function two(x) { return String(Math.round(x * 100) / 100); }
    if (n >= 1e7 && (n / 1e7 * 100) % 1 === 0) return two(n / 1e7) + ' crore';
    if (n >= 1e5 && (n / 1e5 * 100) % 1 === 0) return two(n / 1e5) + ' lakh';
    return String(n);
  }

  // Split into sentences (a full stop only counts when a space follows, so
  // "1.78" stays whole), break any over-long sentence at commas, then pack
  // the pieces into chunks of up to MAX_CHUNK chars.
  function chunk(text) {
    var pieces = [];
    splitAt(text, /[\s\S]*?[.!?]+["')\]]*(?=\s|$)\s*|[\s\S]+$/g).forEach(function (s) {
      if (s.length <= MAX_CHUNK) pieces.push(s);
      else pieces.push.apply(pieces, splitAt(s, /[\s\S]*?[,;:](?=\s)\s*|[\s\S]+$/g));
    });
    var out = [], cur = '';
    pieces.forEach(function (s) {
      if (cur && (cur + s).length > MAX_CHUNK) { out.push(cur.trim()); cur = ''; }
      cur += s;
    });
    if (cur.trim()) out.push(cur.trim());
    return out;
  }
  function splitAt(text, re) { return (text.match(re) || [text]).filter(function (s) { return s.trim(); }); }

  // ---------- 2. Build the player ----------
  var ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>';
  var ICON_PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/></svg>';
  var ICON_BACK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 6.5v11a.8.8 0 0 1-1.25.66L2.5 13a1.2 1.2 0 0 1 0-2l7.25-5.16A.8.8 0 0 1 11 6.5zm10 0v11a.8.8 0 0 1-1.25.66L12.5 13a1.2 1.2 0 0 1 0-2l7.25-5.16A.8.8 0 0 1 21 6.5z"/></svg>';
  var ICON_FWD = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 6.5v11a.8.8 0 0 0 1.25.66L21.5 13a1.2 1.2 0 0 0 0-2l-7.25-5.16A.8.8 0 0 0 13 6.5zm-10 0v11a.8.8 0 0 0 1.25.66L11.5 13a1.2 1.2 0 0 0 0-2L4.25 5.84A.8.8 0 0 0 3 6.5z"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6L19 6.4 17.6 5 12 10.6z"/></svg>';

  var slot = document.createElement('div');
  slot.className = 'listen-slot';
  slot.innerHTML =
    '<div class="listen" role="region" aria-label="Listen to this article">' +
      '<button type="button" class="listen-play" aria-label="Listen to this article">' + ICON_PLAY + '</button>' +
      '<div class="listen-info">' +
        '<span class="listen-title">Listen to this article</span>' +
        '<span class="listen-meta"></span>' +
        '<div class="listen-bar" aria-hidden="true"><span></span></div>' +
      '</div>' +
      '<div class="listen-controls" hidden>' +
        '<button type="button" class="listen-back" aria-label="Previous paragraph">' + ICON_BACK + '</button>' +
        '<button type="button" class="listen-fwd" aria-label="Next paragraph">' + ICON_FWD + '</button>' +
        '<button type="button" class="listen-rate" aria-label="Playback speed">1×</button>' +
        '<button type="button" class="listen-stop" aria-label="Stop listening">' + ICON_CLOSE + '</button>' +
      '</div>' +
    '</div>';
  top.appendChild(slot);

  var player = slot.querySelector('.listen');
  var playBtn = slot.querySelector('.listen-play');
  var titleEl = slot.querySelector('.listen-title');
  var metaEl = slot.querySelector('.listen-meta');
  var barEl = slot.querySelector('.listen-bar span');
  var controls = slot.querySelector('.listen-controls');
  var rateBtn = slot.querySelector('.listen-rate');

  // ---------- 3. Playback ----------
  var bi = 0, ci = 0;          // current block / chunk
  var playing = false, started = false;
  var rate = 1;
  var token = 0;               // ignores events from cancelled utterances
  var current = null;          // keep a reference so Chrome doesn't garbage-collect it mid-speech
  var voice = null;

  function pickVoice() {
    var best = null, bestScore = -1;
    synth.getVoices().forEach(function (v) {
      var lang = (v.lang || '').replace('_', '-').toLowerCase();
      if (lang.indexOf('en') !== 0) return;
      var name = v.name.toLowerCase();
      var score = 0;
      if (lang === 'en-in') score += 3;
      else if (lang === 'en-gb' || lang === 'en-us') score += 1;
      if (/natural|neural|online|premium|enhanced/.test(name)) score += 4;
      if (/google/.test(name)) score += 2;
      if (score > bestScore) { best = v; bestScore = score; }
    });
    return best;
  }
  if (synth.addEventListener) synth.addEventListener('voiceschanged', function () { voice = pickVoice(); });

  function speakCurrent() {
    var block = blocks[bi];
    if (!block) return finish();
    highlight(block.el);
    updateProgress();

    var myToken = ++token;
    var u = new SpeechSynthesisUtterance(block.chunks[ci]);
    voice = voice || pickVoice();
    if (voice) u.voice = voice;
    u.lang = voice ? voice.lang : 'en-IN';
    u.rate = rate;
    u.onend = function () {
      if (myToken !== token || !playing) return;
      ci++;
      if (ci >= block.chunks.length) { ci = 0; bi++; }
      speakCurrent();
    };
    u.onerror = function (e) {
      if (myToken !== token || e.error === 'interrupted' || e.error === 'canceled') return;
      pause();
    };
    current = u;
    synth.cancel();
    synth.speak(u);
  }

  // Pause = stop and remember the spot. Browsers' native pause/resume is unreliable.
  function play() {
    if (!started) {
      started = true;
      controls.hidden = false;
      player.classList.add('is-started');
      track('listen_start');
    }
    playing = true;
    setPlayIcon();
    speakCurrent();
  }
  function pause() {
    playing = false;
    token++;
    synth.cancel();
    setPlayIcon();
  }
  function stop() {
    pause();
    bi = 0; ci = 0;
    started = false;
    controls.hidden = true;
    player.classList.remove('is-started');
    highlight(null);
    titleEl.textContent = 'Listen to this article';
    updateProgress();
    setDocked(false);
  }
  function finish() {
    track('listen_complete');
    stop();
    titleEl.textContent = 'Listen again';
  }
  function jump(delta) {
    bi = Math.max(0, Math.min(blocks.length - 1, bi + delta));
    ci = 0;
    if (playing) speakCurrent(); else { highlight(blocks[bi].el); updateProgress(); }
  }

  playBtn.addEventListener('click', function () { playing ? pause() : play(); });
  slot.querySelector('.listen-back').addEventListener('click', function () { jump(ci > 0 ? 0 : -1); });
  slot.querySelector('.listen-fwd').addEventListener('click', function () { jump(1); });
  slot.querySelector('.listen-stop').addEventListener('click', stop);
  rateBtn.addEventListener('click', function () {
    rate = RATES[(RATES.indexOf(rate) + 1) % RATES.length];
    rateBtn.textContent = rate + '×';
    updateProgress();
    if (playing) speakCurrent(); // restart the current piece at the new speed
  });

  // Don't keep talking after the reader leaves the page.
  window.addEventListener('pagehide', function () { synth.cancel(); });

  // ---------- 4. UI state ----------
  function setPlayIcon() {
    playBtn.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
    playBtn.setAttribute('aria-label', playing ? 'Pause' : (started ? 'Resume' : 'Listen to this article'));
    if (started) titleEl.textContent = playing ? 'Listening…' : 'Paused';
  }

  var reading = null;
  function highlight(el) {
    if (reading) reading.classList.remove('is-reading');
    reading = el;
    if (el) el.classList.add('is-reading');
  }

  function updateProgress() {
    var done = 0;
    for (var i = 0; i < bi && i < blocks.length; i++) done += blocks[i].words;
    var left = Math.max(1, Math.round((totalWords - done) / (WORDS_PER_MIN * rate)));
    barEl.style.width = (started ? (done / totalWords) * 100 : 0) + '%';
    metaEl.textContent = started ? left + ' min left' : left + ' min listen';
  }
  updateProgress();

  // Once listening, dock the player to the bottom of the screen when its
  // spot under the byline scrolls out of view.
  function setDocked(on) {
    slot.style.minHeight = on ? slot.offsetHeight + 'px' : '';
    player.classList.toggle('is-docked', on);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      setDocked(started && !entries[0].isIntersecting);
    }).observe(slot);
  }

  function track(name) {
    try { if (window.gtag) window.gtag('event', name, { post_slug: article.dataset.postSlug }); } catch (e) {}
  }
})();
