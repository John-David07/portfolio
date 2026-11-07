/* Random, occasional glitch bursts for the current-page indicator and headings */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var targets = document.querySelectorAll('nav a.active, .glitch.auto');

  function burst(el) {
    el.classList.add('glitching');
    setTimeout(function () { el.classList.remove('glitching'); }, 220 + Math.random() * 260);
  }

  function schedule(el) {
    setTimeout(function () {
      burst(el);
      if (Math.random() < 0.35) setTimeout(function () { burst(el); }, 380);
      schedule(el);
    }, 1800 + Math.random() * 4200);
  }

  targets.forEach(schedule);
})();
