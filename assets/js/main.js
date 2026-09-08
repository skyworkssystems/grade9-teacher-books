/* =========================================================
   Skyworks System — Grade 9 Teacher's Books
   Landing page behaviour
   ---------------------------------------------------------
   Download links live in index.html (the href on each
   .js-download button). To serve the apps from GitHub
   Releases instead of the /downloads folder, change those
   hrefs — nothing in this file needs editing.
   ========================================================= */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Footer year ---------- */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Sticky nav shadow ---------- */
  var nav = $('#nav');
  var onScroll = function () {
    if (nav) nav.classList.toggle('is-stuck', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = $('#navToggle');
  var links  = $('#navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    $$('a', links).forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- FAQ: one answer open at a time ---------- */
  var qas = $$('.qa');
  qas.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      qas.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------- Screenshot rail arrows ---------- */
  var rail = $('#screenRail');
  if (rail) {
    var railBtns = $$('.rail-btn');

    var syncRail = function () {
      var max = rail.scrollWidth - rail.clientWidth - 2;
      railBtns.forEach(function (b) {
        var back = b.getAttribute('data-dir') === '-1';
        b.disabled = back ? rail.scrollLeft <= 2 : rail.scrollLeft >= max;
      });
    };

    railBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var card = $('.screen', rail);
        var step = card ? card.getBoundingClientRect().width + 26 : 260;
        rail.scrollBy({ left: step * 2 * (+b.getAttribute('data-dir')), behavior: 'smooth' });
      });
    });

    rail.addEventListener('scroll', syncRail, { passive: true });
    window.addEventListener('resize', syncRail);
    syncRail();
  }

  /* ---------- Toast ---------- */
  var toast = $('#toast');
  var toastTitle = $('#toastTitle');
  var toastText = $('#toastText');
  var toastTimer;
  function showToast(title, text) {
    if (!toast) return;
    if (toastTitle) toastTitle.textContent = title;
    if (toastText) toastText.textContent = text;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-on'); }, 7000);
  }

  /* ---------- Downloads ---------- */
  var downloads = $$('.js-download');

  function appName(el) {
    return el.getAttribute('data-app') || 'the app';
  }

  downloads.forEach(function (el) {
    el.addEventListener('click', function (ev) {
      if (el.classList.contains('is-unavailable')) {
        ev.preventDefault();
        showToast('Not published yet',
          appName(el) + ' is not available for download yet. Please check back soon.');
        return;
      }
      showToast('Downloading ' + appName(el),
        'When it finishes, open the file from your Downloads and tap Install.');
    });
  });

  /* Download both apps — fires the two book buttons in turn. */
  var both = $('#downloadBoth');
  if (both) {
    both.addEventListener('click', function () {
      var apps = $$('.books .js-download');
      var live = apps.filter(function (a) { return !a.classList.contains('is-unavailable'); });

      if (!live.length) {
        showToast('Not published yet', 'The apps are not available for download yet. Please check back soon.');
        return;
      }

      live.forEach(function (a, i) {
        setTimeout(function () {
          var tmp = document.createElement('a');
          tmp.href = a.href;
          tmp.setAttribute('download', a.getAttribute('download') || '');
          document.body.appendChild(tmp);
          tmp.click();
          document.body.removeChild(tmp);
        }, i * 900);
      });

      showToast(
        live.length > 1 ? 'Downloading both apps' : 'Downloading ' + appName(live[0]),
        live.length > 1
          ? 'Your browser may ask permission to save two files — allow it, then install each one.'
          : 'When it finishes, open the file from your Downloads and tap Install.'
      );
    });
  }

  /* ---------- Availability + file size ----------
     Asks the server about each app file. When it is there we
     show its real size; when it is missing the button says so
     instead of sending the teacher to a 404 page. Skipped when
     the page is opened straight off disk (file://), and any
     network error simply leaves the buttons untouched.        */
  function humanSize(bytes) {
    var mb = bytes / (1024 * 1024);
    if (mb >= 1024) return (mb / 1024).toFixed(2) + ' GB';
    if (mb >= 10) return Math.round(mb) + ' MB';
    if (mb >= 1) return mb.toFixed(1) + ' MB';
    return Math.max(1, Math.round(bytes / 1024)) + ' KB';
  }

  function markUnavailable(el) {
    el.classList.add('is-unavailable');
    var note = el.parentElement && el.parentElement.querySelector('.book__note');
    if (note) note.textContent = 'Not published yet — please check back soon.';
  }

  function showSize(el, size) {
    var note = el.parentElement && el.parentElement.querySelector('.book__note');
    if (note) note.textContent = 'Android app file (.apk) · ' + size + ' · installs directly on your phone';
  }

  if (window.fetch && location.protocol.indexOf('http') === 0) {
    var seen = {};
    downloads.forEach(function (el) {
      var url = el.href;
      if (seen[url]) return;
      seen[url] = true;

      var twins = downloads.filter(function (o) { return o.href === url; });

      fetch(url, { method: 'HEAD' }).then(function (res) {
        if (!res.ok) {
          twins.forEach(markUnavailable);
          return;
        }
        var len = res.headers.get('content-length');
        if (len && +len > 0) {
          var size = humanSize(+len);
          twins.forEach(function (t) { showSize(t, size); });
        }
      }).catch(function () {
        /* Offline, blocked by CORS, or served from another host —
           leave the buttons alone and let the browser try. */
      });
    });
  }
})();
