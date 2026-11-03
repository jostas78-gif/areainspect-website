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
        if (it.isIntersecting && !v.closest('[hidden]')) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: 0.2 });
    films.forEach(function (v) { io.observe(v); });
  }

  // Keuze windmolen / gebouw
  var merk = document.getElementById('iMerk');
  var knoppen = document.querySelectorAll('[data-toepassing]');
  function kies(t) {
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

  // Vergroten van renders
  var lb = document.getElementById('lightbox'), lbImg = document.getElementById('lbImg'), lbTekst = document.getElementById('lbTekst');
  document.querySelectorAll('.renders button').forEach(function (b) {
    b.addEventListener('click', function () {
      var img = b.querySelector('img');
      lbImg.src = img.dataset.groot || img.src; lbImg.alt = img.alt; lbTekst.textContent = img.alt;
      if (lb.showModal) lb.showModal(); else window.open(lbImg.src, '_blank');
    });
  });
  document.getElementById('lbSluit').addEventListener('click', function () { lb.close(); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });

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
