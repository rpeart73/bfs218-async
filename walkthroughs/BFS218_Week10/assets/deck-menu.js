(function () {
  'use strict';

  var STORE = 'bfs218-deck-accessibility-v1';
  var state = { theme: 'light', text: 100, motion: 'system', rate: 1, voice: '' };
  var speechOn = false;
  var returnFocus = null;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
    });
  }
  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORE) || '{}');
      if (['light', 'soft', 'warm', 'dark', 'contrast'].indexOf(saved.theme) >= 0) state.theme = saved.theme;
      if ([100, 115, 130, 150].indexOf(Number(saved.text)) >= 0) state.text = Number(saved.text);
      if (['system', 'reduce'].indexOf(saved.motion) >= 0) state.motion = saved.motion;
      if ([0.75, 1, 1.25, 1.5].indexOf(Number(saved.rate)) >= 0) state.rate = Number(saved.rate);
      state.voice = String(saved.voice || '');
    } catch (e) {}
  }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {}
  }
  function weekFromPath() {
    var m = String(location.pathname || '').match(/BFS218_Week(\d+)/i) || String(document.title || '').match(/Week\s+(\d+)/i);
    return m ? String(parseInt(m[1], 10)) : '';
  }
  function live(message) {
    var el = document.getElementById('deck-access-live');
    if (!el) return;
    el.textContent = '';
    setTimeout(function () { el.textContent = message; }, 30);
  }
  function currentSlide() {
    try { if (window.Reveal && Reveal.getCurrentSlide) return Reveal.getCurrentSlide(); } catch (e) {}
    return document.querySelector('.reveal .slides section.present') || document.querySelector('.reveal .slides section');
  }
  function cleanText(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
  function slideRecord() {
    var slide = currentSlide();
    if (!slide) return { title: 'Current slide', blocks: ['No slide text is available.'] };
    var titleEl = slide.querySelector('h1,h2,h3,.wk');
    var title = cleanText(titleEl && titleEl.textContent) || 'Current slide';
    var blocks = [];
    function add(label, value) {
      value = cleanText(value);
      if (!value) return;
      var entry = label ? label + ': ' + value : value;
      if (blocks.indexOf(entry) < 0) blocks.push(entry);
    }
    Array.prototype.forEach.call(slide.querySelectorAll('.narration p'), function (el) { add('', el.textContent); });
    Array.prototype.forEach.call(slide.querySelectorAll('.insight p'), function (el) { add('Insight', el.textContent); });
    Array.prototype.forEach.call(slide.querySelectorAll('.think p'), function (el) { add('Think about it', el.textContent); });
    var concepts = Array.prototype.map.call(slide.querySelectorAll('.concepts .chip'), function (el) { return cleanText(el.textContent); }).filter(Boolean);
    if (concepts.length) add('Course concepts', concepts.join('; '));
    Array.prototype.forEach.call(slide.querySelectorAll('img[alt]'), function (img) {
      if (cleanText(img.getAttribute('alt'))) add('Image description', img.getAttribute('alt'));
    });
    Array.prototype.forEach.call(slide.querySelectorAll('figcaption'), function (el) { add('Figure note', el.textContent); });
    if (!blocks.length) {
      Array.prototype.forEach.call(slide.querySelectorAll('p,li,dt,dd'), function (el) { add('', el.textContent); });
    }
    if (!blocks.length) add('', slide.textContent);
    return { title: title, blocks: blocks };
  }
  function speechText() {
    var rec = slideRecord();
    return rec.title + '. ' + rec.blocks.join(' ');
  }
  function stopSpeech(announce) {
    try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (e) {}
    speechOn = false;
    document.documentElement.classList.remove('deck-speaking');
    if (announce) live('Voice narration stopped.');
  }
  function selectedVoice() {
    try {
      return (window.speechSynthesis.getVoices() || []).filter(function (voice) { return voice.voiceURI === state.voice; })[0] || null;
    } catch (e) { return null; }
  }
  function speakSlide() {
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      live('Voice narration is not available in this browser.');
      return;
    }
    stopSpeech(false);
    var utterance = new SpeechSynthesisUtterance(speechText().slice(0, 7000));
    utterance.rate = state.rate;
    var voice = selectedVoice();
    if (voice) utterance.voice = voice;
    utterance.onend = function () { speechOn = false; document.documentElement.classList.remove('deck-speaking'); live('Finished reading the current slide.'); };
    utterance.onerror = function () { speechOn = false; document.documentElement.classList.remove('deck-speaking'); live('Voice narration stopped.'); };
    speechOn = true;
    document.documentElement.classList.add('deck-speaking');
    window.speechSynthesis.speak(utterance);
    live('Reading the current slide aloud.');
  }
  function pauseSpeech() {
    if (!speechOn || !('speechSynthesis' in window)) { speakSlide(); return; }
    try {
      if (window.speechSynthesis.paused) { window.speechSynthesis.resume(); live('Voice narration resumed.'); }
      else { window.speechSynthesis.pause(); live('Voice narration paused.'); }
    } catch (e) {}
  }
  function populateVoices() {
    var select = document.getElementById('deck-access-voice');
    if (!select || !('speechSynthesis' in window)) return;
    var voices = [];
    try { voices = window.speechSynthesis.getVoices() || []; } catch (e) {}
    select.innerHTML = '<option value="">Default device voice</option>' + voices.map(function (voice) {
      return '<option value="' + esc(voice.voiceURI) + '"' + (voice.voiceURI === state.voice ? ' selected' : '') + '>' + esc((voice.lang || 'Voice') + ': ' + voice.name) + '</option>';
    }).join('');
  }
  function apply() {
    var root = document.documentElement;
    root.setAttribute('data-deck-theme', state.theme);
    root.setAttribute('data-deck-text', String(state.text));
    root.classList.toggle('deck-reduce-motion', state.motion === 'reduce');
    root.style.setProperty('--deck-font-scale', String(Math.min(state.text, 115) / 100));
    root.style.setProperty('--deck-reading-scale', String(state.text / 100));
    Array.prototype.forEach.call(document.querySelectorAll('[data-theme-choice]'), function (btn) {
      var on = btn.getAttribute('data-theme-choice') === state.theme;
      btn.classList.toggle('on', on); btn.setAttribute('aria-pressed', String(on));
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-text-choice]'), function (btn) {
      var on = Number(btn.getAttribute('data-text-choice')) === state.text;
      btn.classList.toggle('on', on); btn.setAttribute('aria-pressed', String(on));
    });
    var motion = document.getElementById('deck-access-motion');
    if (motion) motion.checked = state.motion === 'reduce';
    var rate = document.getElementById('deck-access-rate');
    if (rate) rate.value = String(state.rate);
    refreshTranscript();
  }
  function setTheme(theme) { state.theme = theme; save(); apply(); live(theme === 'contrast' ? 'High-contrast screen on.' : theme + ' screen on.'); }
  function setText(size) {
    state.text = Number(size); save(); apply();
    if (state.text >= 130) openTranscript();
    live('Text size set to ' + state.text + ' percent.');
  }
  function focusables(host) {
    return Array.prototype.slice.call(host.querySelectorAll('button:not([disabled]),select:not([disabled]),input:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')).filter(function (el) { return !el.hidden && el.offsetParent !== null; });
  }
  function closePanel() {
    var panel = document.getElementById('deck-access-panel');
    var scrim = document.getElementById('deck-access-scrim');
    var toggle = document.querySelector('.deck-access-toggle');
    if (!panel) return;
    panel.hidden = true; scrim.hidden = true; toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus && returnFocus.focus) returnFocus.focus();
  }
  function openPanel() {
    var panel = document.getElementById('deck-access-panel');
    var scrim = document.getElementById('deck-access-scrim');
    var toggle = document.querySelector('.deck-access-toggle');
    returnFocus = document.activeElement;
    panel.hidden = false; scrim.hidden = false; toggle.setAttribute('aria-expanded', 'true');
    populateVoices();
    var first = panel.querySelector('button,select,input'); if (first) first.focus();
  }
  function refreshTranscript() {
    var title = document.getElementById('deck-transcript-title');
    var body = document.getElementById('deck-transcript-body');
    if (!title || !body) return;
    var rec = slideRecord();
    title.textContent = rec.title;
    body.innerHTML = rec.blocks.map(function (block) { return '<p>' + esc(block) + '</p>'; }).join('');
  }
  function openTranscript() {
    var modal = document.getElementById('deck-transcript');
    var scrim = document.getElementById('deck-transcript-scrim');
    if (!modal) return;
    returnFocus = document.activeElement;
    refreshTranscript();
    modal.hidden = false; scrim.hidden = false;
    document.body.classList.add('deck-transcript-open');
    var heading = document.getElementById('deck-transcript-title'); if (heading) heading.focus();
  }
  function closeTranscript() {
    var modal = document.getElementById('deck-transcript');
    var scrim = document.getElementById('deck-transcript-scrim');
    if (!modal) return;
    modal.hidden = true; scrim.hidden = true;
    document.body.classList.remove('deck-transcript-open');
    stopSpeech(false);
    if (returnFocus && returnFocus.focus) returnFocus.focus();
  }
  function trap(event, host) {
    if (event.key !== 'Tab') return;
    var items = focusables(host); if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  function buildCourseMenu() {
    if (document.querySelector('.deck-menu-toggle')) return;
    var week = weekFromPath();
    var root = '../../';
    var weekUrl = root + (week ? '?week=' + encodeURIComponent(week) + '&part=watch' : '');
    var btn = document.createElement('button');
    btn.className = 'deck-menu-toggle'; btn.type = 'button';
    btn.setAttribute('aria-label', 'Open BFS218 course menu'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'deck-return-menu');
    btn.innerHTML = '<span></span><span></span><span></span>';
    var menu = document.createElement('nav');
    menu.id = 'deck-return-menu'; menu.className = 'deck-menu'; menu.hidden = true; menu.setAttribute('aria-label', 'BFS218 course navigation');
    menu.innerHTML = '<a class="primary" href="' + weekUrl + '">Back to Week ' + (week || '') + ' in BFS218</a><a href="' + root + '">Course Home</a><a href="' + root + '?screen=walkthroughs">Weekly Experiences</a><small>This legacy full-screen route is outside the app shell. Use this menu to return to BFS218.</small>';
    var scrim = document.createElement('button');
    scrim.className = 'deck-menu-scrim'; scrim.type = 'button'; scrim.hidden = true; scrim.setAttribute('aria-label', 'Close BFS218 course menu');
    function close() { menu.hidden = true; scrim.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
    function open() { menu.hidden = false; scrim.hidden = false; btn.setAttribute('aria-expanded', 'true'); var link = menu.querySelector('a'); if (link) link.focus(); }
    btn.addEventListener('click', function () { if (menu.hidden) open(); else close(); });
    scrim.addEventListener('click', close);
    document.body.appendChild(btn); document.body.appendChild(scrim); document.body.appendChild(menu);
  }

  function buildAccessibility() {
    if (document.querySelector('.deck-access-toggle')) return;
    var reveal = document.querySelector('.reveal');
    if (reveal) { reveal.id = reveal.id || 'deck-main'; reveal.setAttribute('role', 'main'); }
    var skip = document.createElement('a'); skip.className = 'deck-skip'; skip.href = '#deck-main'; skip.textContent = 'Skip to slide content';
    var toggle = document.createElement('button');
    toggle.className = 'deck-access-toggle'; toggle.type = 'button'; toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-controls', 'deck-access-panel'); toggle.textContent = 'Accessibility';
    var scrim = document.createElement('button'); scrim.id = 'deck-access-scrim'; scrim.className = 'deck-access-scrim'; scrim.type = 'button'; scrim.hidden = true; scrim.setAttribute('aria-label', 'Close accessibility controls');
    var panel = document.createElement('aside'); panel.id = 'deck-access-panel'; panel.className = 'deck-access-panel'; panel.hidden = true; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-labelledby', 'deck-access-title');
    panel.innerHTML = '<div class="deck-access-head"><h2 id="deck-access-title">Experience accessibility</h2><button type="button" data-access-close aria-label="Close accessibility controls">Close</button></div>'
      + '<p class="deck-access-note">Choose the screen, text, motion, and voice settings that work for you. They stay only in this browser.</p>'
      + '<fieldset><legend>Screen</legend><div class="deck-access-choices"><button type="button" data-theme-choice="light">Light</button><button type="button" data-theme-choice="soft">Soft grey</button><button type="button" data-theme-choice="warm">Warm</button><button type="button" data-theme-choice="dark">Dark</button><button type="button" data-theme-choice="contrast">High contrast</button></div></fieldset>'
      + '<fieldset><legend>Text size</legend><div class="deck-access-choices"><button type="button" data-text-choice="100">100%</button><button type="button" data-text-choice="115">115%</button><button type="button" data-text-choice="130">130%</button><button type="button" data-text-choice="150">150%</button></div><small>At 130% and 150%, the text view opens so every word can flow to the screen margins without being cut off.</small></fieldset>'
      + '<label class="deck-access-check"><input id="deck-access-motion" type="checkbox"> Reduce motion</label>'
      + '<fieldset><legend>Voice narration</legend><label>Voice<select id="deck-access-voice"><option value="">Default device voice</option></select></label><label>Speed<select id="deck-access-rate"><option value="0.75">0.75x</option><option value="1">1x</option><option value="1.25">1.25x</option><option value="1.5">1.5x</option></select></label><div class="deck-access-choices"><button type="button" data-speech="read">Read current slide</button><button type="button" data-speech="pause">Pause or resume</button><button type="button" data-speech="stop">Stop</button></div></fieldset>'
      + '<button type="button" class="deck-text-view" data-open-transcript>Open text view for this slide</button>';
    var transcriptScrim = document.createElement('button'); transcriptScrim.id = 'deck-transcript-scrim'; transcriptScrim.className = 'deck-transcript-scrim'; transcriptScrim.type = 'button'; transcriptScrim.hidden = true; transcriptScrim.setAttribute('aria-label', 'Close slide text view');
    var transcript = document.createElement('section'); transcript.id = 'deck-transcript'; transcript.className = 'deck-transcript'; transcript.hidden = true; transcript.setAttribute('role', 'dialog'); transcript.setAttribute('aria-modal', 'true'); transcript.setAttribute('aria-labelledby', 'deck-transcript-title');
    transcript.innerHTML = '<div class="deck-transcript-head"><div><span>Current slide text</span><h2 id="deck-transcript-title" tabindex="-1">Current slide</h2></div><button type="button" data-transcript-close>Close</button></div><div id="deck-transcript-body" class="deck-transcript-body"></div><div class="deck-transcript-actions"><button type="button" data-speech="read">Read this slide aloud</button><button type="button" data-speech="stop">Stop voice</button></div>';
    var liveRegion = document.createElement('div'); liveRegion.id = 'deck-access-live'; liveRegion.className = 'deck-vh'; liveRegion.setAttribute('role', 'status'); liveRegion.setAttribute('aria-live', 'polite');
    document.body.insertBefore(skip, document.body.firstChild);
    document.body.appendChild(toggle); document.body.appendChild(scrim); document.body.appendChild(panel);
    document.body.appendChild(transcriptScrim); document.body.appendChild(transcript); document.body.appendChild(liveRegion);
    toggle.addEventListener('click', function () { if (panel.hidden) openPanel(); else closePanel(); });
    scrim.addEventListener('click', closePanel); panel.querySelector('[data-access-close]').addEventListener('click', closePanel);
    transcriptScrim.addEventListener('click', closeTranscript); transcript.querySelector('[data-transcript-close]').addEventListener('click', closeTranscript);
    panel.querySelector('[data-open-transcript]').addEventListener('click', function () { closePanel(); openTranscript(); });
    Array.prototype.forEach.call(panel.querySelectorAll('[data-theme-choice]'), function (btn) { btn.addEventListener('click', function () { setTheme(btn.getAttribute('data-theme-choice')); }); });
    Array.prototype.forEach.call(panel.querySelectorAll('[data-text-choice]'), function (btn) { btn.addEventListener('click', function () { setText(btn.getAttribute('data-text-choice')); }); });
    panel.querySelector('#deck-access-motion').addEventListener('change', function (event) { state.motion = event.target.checked ? 'reduce' : 'system'; save(); apply(); live(event.target.checked ? 'Reduced motion on.' : 'Motion follows your device setting.'); });
    panel.querySelector('#deck-access-rate').addEventListener('change', function (event) { state.rate = Number(event.target.value) || 1; save(); });
    panel.querySelector('#deck-access-voice').addEventListener('change', function (event) { state.voice = event.target.value; save(); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-speech]'), function (btn) { btn.addEventListener('click', function () { var action = btn.getAttribute('data-speech'); if (action === 'read') speakSlide(); else if (action === 'pause') pauseSpeech(); else stopSpeech(true); }); });
    document.addEventListener('keydown', function (event) {
      if (!transcript.hidden) { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeTranscript(); } else trap(event, transcript); return; }
      if (!panel.hidden) { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closePanel(); } else trap(event, panel); }
    }, true);
    try {
      if (window.Reveal && Reveal.on) Reveal.on('slidechanged', function () { stopSpeech(false); refreshTranscript(); live('Slide changed to ' + slideRecord().title + '.'); });
    } catch (e) {}
    if ('speechSynthesis' in window && window.speechSynthesis.addEventListener) window.speechSynthesis.addEventListener('voiceschanged', populateVoices);
    apply(); populateVoices();
  }

  function init() {
    load();
    buildCourseMenu();
    buildAccessibility();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
