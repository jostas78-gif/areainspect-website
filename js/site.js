// AreaInspect – kleine interacties, zonder externe bibliotheken
(function () {
  'use strict';

  // Adres waar het contactformulier naartoe gaat (n8n-webhook). Leeg = alleen e-mailprogramma openen.
  var FORMULIER_URL = '';
  var MAIL = 'info@areainspect.com';

  var rustig = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Films: bij "minder beweging" niet automatisch afspelen; buiten beeld pauzeren
  var films = Array.prototype.slice.call(document.querySelectorAll('video'));
  films.forEach(function (v) {
    v.muted = true;
    if (rustig) { v.removeAttribute('autoplay'); v.pause(); v.controls = true; }
  });
  if ('IntersectionObserver' in window && !rustig) {
    var io = new IntersectionObserver(function (items) {
      items.forEach(function (it) {
        var v = it.target;
        if (it.isIntersecting && !v.closest('[hidden]') && !v.closest('.in3d')) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: 0.2 });
    films.forEach(function (v) { io.observe(v); });
  }

  // Keuze windmolen / gebouw
  var merk = document.getElementById('iMerk');
  var knoppen = document.querySelectorAll('[data-toepassing]');
  function kies(t) {
    if (actief) sluit3d(actief, false);
    knoppen.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.toepassing === t ? 'true' : 'false'); });
    document.querySelectorAll('#producten [data-paneel]').forEach(function (el) {
      var aan = el.dataset.paneel === t;
      el.hidden = !aan;
      var v = el.querySelector('video');
      if (v) {
        if (aan && !rustig) { v.preload = 'metadata'; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      }
    });
    if (merk) {
      merk.src = t === 'wind' ? 'img/bird.png' : 'img/bat.png';
      merk.className = t === 'wind' ? 'vogel' : 'vleermuis';
    }
  }
  knoppen.forEach(function (b) { b.addEventListener('click', function () { kies(b.dataset.toepassing); }); });

  // Films: klik = pauzeren op dat moment en in 3D rondkijken; nog een klik = film loopt verder
  var ICOON = '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#f5c000" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l8.5 4.9v9.8L12 21.6 3.5 16.7V6.9z"/><path d="M3.5 6.9L12 11.8l8.5-4.9M12 11.8v9.8"/></svg>';
  var actief = null;
  function sluit3d(fig, verder) {
    var f = fig.querySelector('iframe'); if (f) f.remove();
    var h = fig.querySelector('.hint3d'); if (h) h.remove();
    fig.classList.remove('in3d');
    var v = fig.querySelector('video');
    if (verder && v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    if (actief === fig) actief = null;
  }
  function open3d(fig) {
    if (actief && actief !== fig) sluit3d(actief, true);
    var v = fig.querySelector('video');
    var t = v ? v.currentTime : 0;
    if (v) v.pause();
    fig.classList.add('in3d'); actief = fig;
    var fr = document.createElement('iframe');
    fr.title = '3D-weergave: draai, zoom en bekijk dit moment van de film';
    fr.allow = 'fullscreen';
    fr.src = fig.dataset['3d'] + '&t=' + t.toFixed(2);
    var hint = document.createElement('div'); hint.className = 'hint3d';
    hint.innerHTML = '<span>Sleep om te draaien · scroll of knijp om te zoomen<br>Klik in het beeld om de film verder te laten lopen</span>';
    var knop = document.createElement('button'); knop.type = 'button'; knop.className = 'verder';
    knop.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" fill="#111214"/></svg>Film verder';
    knop.addEventListener('click', function (e) { e.stopPropagation(); sluit3d(fig, true); });
    hint.appendChild(knop);
    fig.appendChild(fr); fig.appendChild(hint);
  }
  document.querySelectorAll('.film[data-3d]').forEach(function (fig) {
    fig.tabIndex = 0;
    fig.setAttribute('role', 'button');
    fig.setAttribute('aria-label', 'Pauzeer de film en bekijk dit moment in 3D');
    var k = document.createElement('div'); k.className = 'knop3d';
    k.innerHTML = '<span class="rond">' + ICOON + 'Klik: pauzeer en bekijk in 3D</span>';
    var b = document.createElement('div'); b.className = 'badge3d';
    b.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5c000" stroke-width="2" aria-hidden="true"><path d="M12 2l8.5 4.9v9.8L12 21.6 3.5 16.7V6.9z"/></svg>3D';
    fig.appendChild(k); fig.appendChild(b);
    fig.addEventListener('click', function () { if (!fig.classList.contains('in3d')) open3d(fig); });
    fig.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && e.target === fig) { e.preventDefault(); fig.classList.contains('in3d') ? sluit3d(fig, true) : open3d(fig); }
    });
  });
  window.addEventListener('message', function (e) {
    if (actief && e.data && e.data.type === 'areainspect-resume' && e.source === (actief.querySelector('iframe') || {}).contentWindow) sluit3d(actief, true);
  });

  // Contactformulier
  var form = document.getElementById('contactformulier');
  var melding = document.getElementById('formMelding');
  function toon(tekst, ok) { melding.hidden = false; melding.textContent = tekst; melding.className = 'melding ' + (ok ? 'ok' : 'fout'); }
  function viaMail(d) {
    var onderwerp = 'Contact via areainspect.com – ' + d.interesse;
    var tekst = d.bericht + '\n\n' + d.naam_organisatie + '\n' + d.email;
    window.location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(onderwerp) + '&body=' + encodeURIComponent(tekst);
    toon('Uw e-mailprogramma wordt geopend met uw bericht. Verstuur de e-mail om het bericht te verzenden.', true);
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { toon('Vul uw naam, een geldig e-mailadres en een bericht in.', false); form.reportValidity && form.reportValidity(); return; }
    var d = {};
    new FormData(form).forEach(function (v, k) { d[k] = String(v).trim(); });
    if (d.website) return; // spamfilter
    delete d.website;
    d.pagina = location.href;
    if (!FORMULIER_URL) { viaMail(d); return; }
    var knop = form.querySelector('button[type=submit]');
    knop.disabled = true; knop.textContent = 'Bezig met versturen…';
    fetch(FORMULIER_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) })
      .then(function (r) { if (!r.ok) throw new Error(r.status); form.reset(); toon('Dank u wel. We hebben uw bericht ontvangen en nemen snel contact met u op.', true); })
      .catch(function () { viaMail(d); })
      .then(function () { knop.disabled = false; knop.textContent = 'Verstuur bericht'; });
  });
})();
