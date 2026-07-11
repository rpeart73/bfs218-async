/* BFS218 developer mode (shared across the signpost and both section sites).
   Bypasses the section selector and the opening popups so the sites can be
   built and fixed. Client-side only: this gates UI conveniences, not data.
   This file must load before router.js or app.js so it can capture ?dev
   before either application normalizes the URL. Activate with ?dev (enter
   the password) on any site; turn off with the
   Exit button on the bar, or with ?dev=off. The flag lives in localStorage
   (bfs218.dev) and is shared across all three sites on this origin. */
(function () {
  var KEY = 'bfs218.dev';
  var HASH = '429b53055b40fabbe7bd8459ee089b31e61ed4389ce71b67d17acd71af0d8c56';
  var SITES = {
    signpost: 'https://rpeart73.github.io/bfs218/',
    async: 'https://rpeart73.github.io/bfs218-async/',
    sync: 'https://rpeart73.github.io/bfs218-sync/'
  };
  function on() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function set(v) { try { if (v) localStorage.setItem(KEY, '1'); else localStorage.removeItem(KEY); } catch (e) {} if (window.BFS218_DEV) window.BFS218_DEV.active = !!v; }
  function cleanUrl() { return location.origin + location.pathname; }
  function sha256hex(s) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    });
  }

  var params;
  try { params = new URLSearchParams(location.search || ''); } catch (e) { params = null; }
  var hasCommand = !!(params && params.has('dev'));
  window.BFS218_DEV = { pending: hasCommand, active: on() };

  // Activation / deactivation via ?dev
  if (hasCommand) {
    if (params.get('dev') === 'off') { set(false); location.replace(cleanUrl()); return; }
    var pw = window.prompt('Developer password');
    if (pw == null) { location.replace(cleanUrl()); return; }
    sha256hex(pw).then(function (h) {
      if (h === HASH) { set(true); } else { window.alert('Wrong developer password.'); }
      location.replace(cleanUrl());
    }).catch(function () { location.replace(cleanUrl()); });
    return;
  }

  // Render the dev bar when active
  function bar() {
    if (!on() || document.getElementById('bfs218-devbar')) return;
    var here = location.href.replace(/[?#].*$/, '');
    var el = document.createElement('div');
    el.id = 'bfs218-devbar';
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', 'Developer mode');
    el.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:2147483000;display:flex;align-items:center;gap:9px;flex-wrap:wrap;justify-content:center;background:#111318;color:#fff;font:600 12px/1.3 ui-monospace,Consolas,monospace;letter-spacing:.04em;padding:7px 12px calc(7px + env(safe-area-inset-bottom,0px));box-shadow:0 -6px 20px rgba(0,0,0,.3)';
    function link(label, href) {
      var current = href.replace(/[?#].*$/, '') === here;
      return '<a href="' + href + '"' + (current ? ' aria-current="true"' : '') + ' style="color:' + (current ? '#fff' : '#cdd3dc') + ';text-decoration:none;border:1px solid ' + (current ? '#DA291C' : '#333a45') + ';border-radius:6px;padding:3px 9px;background:' + (current ? '#2a1210' : 'transparent') + '">' + label + '</a>';
    }
    el.innerHTML = '<span style="background:#DA291C;color:#fff;border-radius:5px;padding:2px 8px;font-weight:700;letter-spacing:.1em">DEV PORTAL</span>'
      + '<span style="color:#8b93a1">selector and popups bypassed</span>'
      + link('Signpost', SITES.signpost)
      + link('Async', SITES.async)
      + link('Sync', SITES.sync)
      + '<button type="button" id="bfs218-devexit" style="background:#fff;color:#111318;border:none;border-radius:6px;padding:4px 11px;font:inherit;font-weight:700;cursor:pointer">Exit dev mode</button>';
    document.body.appendChild(el);
    var ex = document.getElementById('bfs218-devexit');
    if (ex) ex.addEventListener('click', function () { set(false); location.reload(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bar);
  else bar();
})();
