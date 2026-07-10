(function () {
  'use strict';
  function weekFromPath() {
    var m = String(location.pathname || '').match(/BFS218_Week(\d+)/i) || String(document.title || '').match(/Week\s+(\d+)/i);
    return m ? String(parseInt(m[1], 10)) : '';
  }
  function close(menu, scrim, btn) {
    menu.hidden = true;
    scrim.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  }
  function open(menu, scrim, btn) {
    menu.hidden = false;
    scrim.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
  }
  function init() {
    if (document.querySelector('.deck-menu-toggle')) return;
    var week = weekFromPath();
    var root = '../../';
    var weekUrl = root + (week ? '?week=' + encodeURIComponent(week) + '&part=watch' : '');
    var btn = document.createElement('button');
    btn.className = 'deck-menu-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Open BFS218 course menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'deck-return-menu');
    btn.innerHTML = '<span></span><span></span><span></span>';
    var menu = document.createElement('nav');
    menu.id = 'deck-return-menu';
    menu.className = 'deck-menu';
    menu.hidden = true;
    menu.setAttribute('aria-label', 'BFS218 course navigation');
    menu.innerHTML = '<a class="primary" href="' + weekUrl + '">Back to Week ' + (week || '') + ' in BFS218</a><a href="' + root + '">Course Home</a><a href="' + root + '?screen=walkthroughs">Weekly Walkthroughs</a><small>This fullscreen deck is outside the app shell. Use this menu to return to BFS218.</small>';
    var scrim = document.createElement('button');
    scrim.className = 'deck-menu-scrim';
    scrim.type = 'button';
    scrim.hidden = true;
    scrim.setAttribute('aria-label', 'Close BFS218 course menu');
    btn.addEventListener('click', function () {
      if (menu.hidden) open(menu, scrim, btn);
      else close(menu, scrim, btn);
    });
    scrim.addEventListener('click', function () { close(menu, scrim, btn); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) close(menu, scrim, btn);
    });
    document.body.appendChild(btn);
    document.body.appendChild(scrim);
    document.body.appendChild(menu);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
