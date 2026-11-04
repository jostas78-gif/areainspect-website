// AreaInspect – taalkeuze: onthoudt de gekozen taal en sluit het menu netjes
(function () {
  'use strict';
  var menu = document.querySelector('.taalmenu');
  if (!menu) return;
  menu.querySelectorAll('a[data-taal]').forEach(function (a) {
    a.addEventListener('click', function () {
      try { localStorage.setItem('ai-taal', a.dataset.taal); } catch (e) {}
      // Zelfde plek op de pagina houden bij het wisselen
      if (location.hash) a.href = a.href.split('#')[0] + location.hash;
    });
  });
  document.addEventListener('click', function (e) { if (menu.open && !menu.contains(e.target)) menu.open = false; });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); } });
})();
