/* Intro "Now Loading" screen — plays once per browser session */
(function () {
  var root = document.documentElement;
  var intro = document.getElementById('intro');
  if (!intro || root.classList.contains('no-intro')) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bar = intro.querySelector('.intro-bar-fill');
  var pct = intro.querySelector('.intro-pct');

  // Timeline (ms)
  var START = 900, END = 2300, LEAVE = 2500, CLEAR = 500;
  if (reduce) { START = 0; END = 900; LEAVE = 1100; CLEAR = 50; }

  var t0 = performance.now();
  var leaving = false;

  function setProgress(p) {
    var v = Math.round(p * 100);
    bar.style.width = v + '%';
    pct.textContent = ('00' + v).slice(-3) + '%';
  }

  function tick(now) {
    if (leaving) return;
    var p = Math.min(1, Math.max(0, (now - t0 - START) / (END - START)));
    setProgress(p);
    if (p < 1) requestAnimationFrame(tick);
  }

  function finish() {
    try { sessionStorage.setItem('introSeen', '1'); } catch (e) {}
    root.classList.add('no-intro');
    if (intro.parentNode) intro.parentNode.removeChild(intro);
    document.dispatchEvent(new Event('intro:done'));
  }

  function leave() {
    if (leaving) return;
    leaving = true;
    setProgress(1);
    root.classList.add('intro-leaving');
    intro.classList.add('leaving');
    setTimeout(finish, CLEAR);
  }

  requestAnimationFrame(tick);
  setTimeout(leave, LEAVE);

  // Click / key press skips the intro (this also unlocks audio playback)
  ['pointerdown', 'keydown'].forEach(function (ev) {
    document.addEventListener(ev, leave, { once: true });
  });
})();
