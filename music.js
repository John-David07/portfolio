/* Background music — keeps playing across pages, starts after the intro */
(function () {
  /* >>> Path to the song. Put irwsayh.mp3 next to your HTML files, or change this path. <<< */
  var AUDIO_SRC = 'irwsayh.mp3';
  var DEFAULT_VOLUME = 0.15;          // 15%
  var KEY = 'nc-bgm';
  var RESUME_WINDOW_MS = 10000;       // resume where we left off if the last page was left <10s ago

  /* ---------- saved settings ---------- */
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }

  var saved = load();
  var volume = typeof saved.vol === 'number' ? saved.vol : DEFAULT_VOLUME;
  var muted = !!saved.muted;

  /* ---------- audio ---------- */
  var audio = new Audio(AUDIO_SRC);
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = volume;
  audio.muted = muted;

  var resumeAt = 0;
  if (typeof saved.t === 'number' && saved.ts && Date.now() - saved.ts < RESUME_WINDOW_MS) {
    resumeAt = saved.t + (Date.now() - saved.ts) / 1000;
  }
  audio.addEventListener('loadedmetadata', function () {
    if (resumeAt && audio.duration) audio.currentTime = resumeAt % audio.duration;
  });

  function persist() {
    var s = load();
    s.vol = volume;
    s.muted = muted;
    if (!audio.paused) { s.t = audio.currentTime; s.ts = Date.now(); }
    save(s);
  }
  setInterval(persist, 1000);
  window.addEventListener('pagehide', persist);

  /* ---------- UI ---------- */
  var wrap = document.createElement('div');
  wrap.className = 'bgm-wrap';
  wrap.innerHTML =
    '<div class="bgm" role="group" aria-label="Background music">' +
      '<button type="button" class="bgm-btn" aria-label="Mute music" aria-pressed="false"><i class="fas fa-volume-low"></i></button>' +
      '<input class="bgm-range" type="range" min="0" max="100" step="1" aria-label="Music volume">' +
      '<span class="bgm-val" aria-hidden="true"></span>' +
    '</div>' +
    '<div class="bgm-hint" role="status" hidden></div>';
  document.body.appendChild(wrap);

  var panel = wrap.querySelector('.bgm');
  var btn = wrap.querySelector('.bgm-btn');
  var icon = btn.querySelector('i');
  var range = wrap.querySelector('.bgm-range');
  var val = wrap.querySelector('.bgm-val');
  var hint = wrap.querySelector('.bgm-hint');

  function render() {
    var silent = muted || volume === 0;
    var pct = Math.round(volume * 100);
    range.value = pct;
    range.style.setProperty('--fill', pct + '%');
    val.textContent = silent ? 'MUTE' : pct + '%';
    panel.classList.toggle('is-muted', silent);
    btn.setAttribute('aria-pressed', String(silent));
    btn.setAttribute('aria-label', silent ? 'Unmute music' : 'Mute music');
    icon.className = 'fas ' + (silent ? 'fa-volume-xmark' : volume < 0.5 ? 'fa-volume-low' : 'fa-volume-high');
  }

  btn.addEventListener('click', function () {
    muted = !muted;
    if (!muted && volume === 0) volume = DEFAULT_VOLUME;
    audio.muted = muted;
    audio.volume = volume;
    render(); persist();
  });

  range.addEventListener('input', function () {
    volume = range.value / 100;
    if (volume > 0 && muted) { muted = false; audio.muted = false; }
    audio.volume = volume;
    render(); persist();
  });

  /* ---------- start / autoplay handling ---------- */
  var armed = false;
  var EVENTS = ['pointerdown', 'keydown', 'touchstart'];

  function showHint(text) { hint.textContent = text; hint.hidden = false; }

  function unlock() {
    EVENTS.forEach(function (ev) { window.removeEventListener(ev, unlock, true); });
    armed = false;
    tryPlay();
  }

  function onBlocked() {
    showHint('▶ Click anywhere to start the music');
    if (!armed) {
      armed = true;
      EVENTS.forEach(function (ev) { window.addEventListener(ev, unlock, true); });
    }
  }

  function tryPlay() {
    var p = audio.play();
    if (p && p.then) {
      p.then(function () { hint.hidden = true; }).catch(onBlocked);
    }
  }

  audio.addEventListener('playing', function () { hint.hidden = true; });
  audio.addEventListener('error', function () {
    showHint('Music file not found: ' + AUDIO_SRC);
    console.warn('[music] Could not load', AUDIO_SRC);
  });

  render();

  // Wait for the intro to finish (if it's showing on this page), then play
  if (document.documentElement.classList.contains('no-intro')) {
    tryPlay();
  } else {
    document.addEventListener('intro:done', tryPlay, { once: true });
  }
})();
