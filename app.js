/* BFS218: the course source library. Vanilla JS, no build step, no framework.
   Organized by WEEK (the course arc): Racism and the Digital Age readings, glossary,
   and self-checks. This is the canonical public BFS218 site for all sections.
   A companion to Blackboard: no accounts, no grading, no student-to-student
   interaction. Saved + compare live on the student's own device (localStorage). */
(function () {
  'use strict';
  var D = window.BFS218;
  var MC = window.BFS218_MC || {};
  if (!D) { document.getElementById('app').textContent = 'Course data did not load.'; return; }
  var HAS_EYE = !!(D.course && D.course.frame);

  var SKEY = 'bfs218corpus.' + (location.pathname.split('/')[1] || 'local') + '.v2';
  var VKEY = SKEY + '.view.v1';
  var HKEY = SKEY + '.hardResetNext';
  var WKKEY = SKEY + '.walk.v1';
  function load() { try { var o = JSON.parse(localStorage.getItem(SKEY) || '{}'); return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; } }
  function persist() { try { localStorage.setItem(SKEY, JSON.stringify({ saved: state.saved, cmpNotes: state.cmpNotes, rcNotes: state.rcNotes, sgNotes: state.sgNotes, sgTick: state.sgTick, wkCheck: state.wkCheck, wkReflect: state.wkReflect, wkNotes: state.wkNotes, wkSteps: state.wkSteps, actResult: state.actResult, mcSel: state.mcSel, mcConf: state.mcConf, kcVersion: state.kcVersion, kcShort: state.kcShort, kcShortRate: state.kcShortRate, kcHist: state.kcHist, careerReflect: state.careerReflect, mediaNotes: state.mediaNotes, assignmentStarter: state.assignmentStarter, rl: state.rl, exp: state.exp, studentName: state.studentName, visits: state.visits, careerField: state.careerField, programViewField: state.programViewField })); } catch (e) {} }
  function loadView() { try { var o = JSON.parse(sessionStorage.getItem(VKEY) || '{}'); return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; } }
  function clearView() { try { sessionStorage.removeItem(VKEY); sessionStorage.removeItem(HKEY); } catch (e) {} }
  function shouldResumeView(v) {
    var hard = false;
    try { hard = sessionStorage.getItem(HKEY) === '1'; sessionStorage.removeItem(HKEY); } catch (e) {}
    if (hard) { clearView(); return false; }
    return !!(v && v.screen);
  }
  function cleanScreen(s) {
    return ['journey', 'site', 'library', 'station', 'detail', 'pathways', 'assignments', 'assignment-program', 'assignment-details', 'assignment-rubric', 'assignment-release', 'assignment-ai', 'assignment-faq', 'starter', 'videos', 'readings', 'compare', 'reading', 'glossary', 'career', 'cards', 'walkthroughs', 'sandbox', 'activity', 'calendar'].indexOf(s) >= 0 ? s : 'journey';
  }
  function cleanWeek(w) {
    w = Number(w);
    return (isFinite(w) && w >= 1 && w <= 20) ? w : null;
  }
  function cleanWeekPart(part) {
    part = String(part || '');
    return ['ov', 'path', 'vid', 'pre', 'learn', 'out', 'gq', 'lens', 'con', 'term', 'read', 'rescue', 'visual', 'watch', 'case', 'do', 'reflect', 'sg', 'kc', 'notes', 'how', 'catch'].indexOf(part) >= 0 ? part : null;
  }
  function cleanAssignmentTab(t) {
    t = String(t || '').toLowerCase();
    return ['story', 'program', 'assignments', 'quality', 'release', 'ai', 'faq'].indexOf(t) >= 0 ? t : 'story';
  }
  function cleanStarterFormat(t) {
    t = String(t || '').toLowerCase();
    return ['text', 'table', 'diagram', 'all'].indexOf(t) >= 0 ? t : 'all';
  }
  function initialRoute() {
    try {
      var p = new URLSearchParams(location.search || '');
      var w = cleanWeek(p.get('week') || p.get('w'));
      if (w) return { screen: 'station', week: w, part: cleanWeekPart(p.get('part')) };
      var s = cleanScreen(p.get('screen') || p.get('view'));
      if (s && s !== 'journey') {
        var r = { screen: s };
        var ai = p.get('asg');
        if (ai != null && ai !== '' && s === 'assignment-details') r.assignmentIndex = Math.max(0, Math.min(4, Number(ai) || 0));
        return r;
      }
    } catch (e) {}
    return null;
  }
  /* Term shell URL: replace with the exact Blackboard course link once the Fall shell is published. */
  var BB_URL = 'https://learn.senecapolytechnic.ca';
  var ICS_PATH = './calendar/BFS218_key_dates.ics';
  var saved0 = load();
  var view0 = loadView();
  var route0 = initialRoute();
  var resumeView0 = shouldResumeView(view0);
  var __isReload = false;
  try { var __nav = performance.getEntriesByType && performance.getEntriesByType('navigation'); __isReload = !!(__nav && __nav[0] && __nav[0].type === 'reload'); } catch (e) {}
  /* a plain refresh resumes the last screen; the Home reset uses the hard flag */
  var routePart0 = route0 && route0.part;

  var state = {
    screen: route0 ? route0.screen : (resumeView0 ? cleanScreen(view0.screen) : 'journey'),
    navOpen: false,
    readerLensOpen: false,
    readerLensX: 84,
    readerLensY: 86,
    journeyWeek: route0 ? route0.week : (resumeView0 ? cleanWeek(view0.journeyWeek) : null),
    stationWeek: route0 ? route0.week : (resumeView0 ? cleanWeek(view0.stationWeek) : null),
    sgNotes: (saved0.sgNotes || {}),
    sgTick: (saved0.sgTick || {}),
    wkCheck: (saved0.wkCheck && typeof saved0.wkCheck === 'object') ? saved0.wkCheck : {},
    wkReflect: (saved0.wkReflect && typeof saved0.wkReflect === 'object') ? saved0.wkReflect : {},
    wkNotes: (saved0.wkNotes && typeof saved0.wkNotes === 'object') ? saved0.wkNotes : {},
    wkSteps: (saved0.wkSteps && typeof saved0.wkSteps === 'object') ? saved0.wkSteps : {},
    wkOpen: {},
    studentName: typeof saved0.studentName === 'string' ? saved0.studentName.slice(0, 40) : '',
    visits: (saved0.visits && typeof saved0.visits === 'object') ? saved0.visits : {},
    act: (resumeView0 && view0.act && typeof view0.act === 'object') ? view0.act : {},
    actResult: (saved0.actResult && typeof saved0.actResult === 'object') ? saved0.actResult : {},
    layout: 'byweek',
    search: '',
    activeTypes: [],
    activeWeek: null,
    sort: 'week',
    detailId: null,
    compareIds: [],
    saved: Array.isArray(saved0.saved) ? saved0.saved : [],
    introOpen: true,
    savedView: false,
    showSynthesis: false,
    walkWeek: null,
    walkSlide: 0,
    lens: 'thematic',
    cmpNotes: (saved0.cmpNotes && typeof saved0.cmpNotes === 'object') ? saved0.cmpNotes : {},
    showModel: false,
    exampleOpen: false,
    rcReading: null,
    rcNotes: (saved0.rcNotes && typeof saved0.rcNotes === 'object') ? saved0.rcNotes : {},
    revealed: {},
    mcSel: (saved0.mcSel && typeof saved0.mcSel === 'object') ? saved0.mcSel : {},
    mcConf: (saved0.mcConf && typeof saved0.mcConf === 'object') ? saved0.mcConf : {},
    kcVersion: (saved0.kcVersion && typeof saved0.kcVersion === 'object') ? saved0.kcVersion : {},
    kcReveal: {},
    kcShort: (saved0.kcShort && typeof saved0.kcShort === 'object') ? saved0.kcShort : {},
    kcShortShown: {},
    kcShortRate: (saved0.kcShortRate && typeof saved0.kcShortRate === 'object') ? saved0.kcShortRate : {},
    kcHist: (saved0.kcHist && typeof saved0.kcHist === 'object') ? saved0.kcHist : {},
    careerField: (typeof saved0.careerField === 'string' && saved0.careerField) ? saved0.careerField : (resumeView0 ? (view0.careerField || '') : ''),
    programViewField: (typeof saved0.programViewField === 'string' && saved0.programViewField) ? saved0.programViewField : (resumeView0 ? (view0.programViewField || '') : ''),
    programViewAssignment: resumeView0 ? (view0.programViewAssignment || 'all') : 'all',
    careerReflect: (saved0.careerReflect && typeof saved0.careerReflect === 'object') ? saved0.careerReflect : {},
    mediaNotes: (saved0.mediaNotes && typeof saved0.mediaNotes === 'object') ? saved0.mediaNotes : {},
    libScroll: 0,
    toast: null,
    cardWeek: resumeView0 ? cleanWeek(view0.cardWeek) : null,
    glossWeek: 'all',
    glossSearch: '',
    auditView: resumeView0 ? (view0.auditView || 'errors') : 'errors',
    visualView: {},
    assignmentIndex: (route0 && route0.assignmentIndex != null) ? route0.assignmentIndex : (resumeView0 ? (Number(view0.assignmentIndex) || 0) : 0),
    assignmentTab: (route0 && route0.screen === 'assignment-details') ? 'assignments' : (resumeView0 ? cleanAssignmentTab(view0.assignmentTab) : 'story'),
    assignmentFaq: resumeView0 ? (view0.assignmentFaq == null ? null : Number(view0.assignmentFaq)) : null,
    assignmentStarter: (saved0.assignmentStarter && typeof saved0.assignmentStarter === 'object') ? saved0.assignmentStarter : {},
    exp: (saved0.exp && typeof saved0.exp === 'object') ? saved0.exp : {},
    assignmentChecks: {},
    videoWeek: resumeView0 ? (view0.videoWeek || 'all') : 'all',
    mediaKind: resumeView0 ? (view0.mediaKind || 'all') : 'all',
    prevView: (resumeView0 && view0.prevView && typeof view0.prevView === 'object') ? view0.prevView : null,
  };
  if (resumeView0) {
    state.activityReturn = cleanWeek(view0.activityReturn);
    state.detailId = view0.detailId || null;
    state.activeTypes = Array.isArray(view0.activeTypes) ? view0.activeTypes : [];
    state.activeWeek = cleanWeek(view0.activeWeek);
    state.search = view0.search || '';
    state.savedView = !!view0.savedView;
    state.rcReading = view0.rcReading || null;
    state.lens = view0.lens || state.lens || 'thematic';
    state.compareIds = Array.isArray(view0.compareIds) ? view0.compareIds : [];
    state.showSynthesis = !!view0.showSynthesis;
    state.galWeek = cleanWeek(view0.galWeek);
    state.galTopic = view0.galTopic || null;
    state.glossWeek = view0.glossWeek || state.glossWeek || 'all';
    state.glossSearch = view0.glossSearch || '';
    state.auditRun = !!view0.auditRun;
    state.auditSystem = Number(view0.auditSystem) || 0;
    state.auditSlice = view0.auditSlice || 'overall';
    state.auditView = view0.auditView || state.auditView || 'errors';
    state.auditedSystems = (view0.auditedSystems && typeof view0.auditedSystems === 'object') ? view0.auditedSystems : {};
  }
  function saveView() {
    try {
      sessionStorage.setItem(VKEY, JSON.stringify({
        screen: state.screen,
        journeyWeek: state.journeyWeek,
        stationWeek: state.stationWeek,
        activityReturn: state.activityReturn,
        detailId: state.detailId,
        cardWeek: state.cardWeek,
        careerField: state.careerField,
        programViewField: state.programViewField,
        programViewAssignment: state.programViewAssignment || 'all',
        activeTypes: state.activeTypes || [],
        activeWeek: state.activeWeek,
        search: state.search || '',
        savedView: !!state.savedView,
        rcReading: state.rcReading,
        lens: state.lens || 'thematic',
        compareIds: state.compareIds || [],
        showSynthesis: !!state.showSynthesis,
        galWeek: state.galWeek,
        galTopic: state.galTopic,
        glossWeek: state.glossWeek || 'all',
        glossSearch: state.glossSearch || '',
        auditRun: !!state.auditRun,
        auditSystem: state.auditSystem || 0,
        auditSlice: state.auditSlice || 'overall',
        auditView: state.auditView || 'errors',
        auditedSystems: state.auditedSystems || {},
        act: state.act || {},
        assignmentIndex: state.assignmentIndex || 0,
        assignmentTab: state.assignmentTab || 'story',
        assignmentFaq: state.assignmentFaq,
        videoWeek: state.videoWeek || 'all',
        mediaKind: state.mediaKind || 'all',
        prevView: state.prevView || null
      }));
    } catch (e) {}
  }
  window.addEventListener('pagehide', saveView);
  window.addEventListener('beforeunload', saveView);
  window.addEventListener('keydown', function (e) {
    var k = String(e.key || '').toLowerCase();
    if (((e.ctrlKey || e.metaKey) && e.shiftKey && k === 'r') || (e.ctrlKey && k === 'f5')) {
      try { sessionStorage.setItem(HKEY, '1'); sessionStorage.removeItem(VKEY); } catch (err) {}
    }
  }, true);
  var refocusSearch = false, focusTarget = null, toastTimer = null, auditRenderStamp = 0, threePromise = null, modelCleanups = [];
  function registerModelCleanup(fn) {
    if (typeof fn === 'function') modelCleanups.push(fn);
  }
  function cleanupModels() {
    var fns = modelCleanups.splice(0);
    fns.forEach(function (fn) { try { fn(); } catch (e) {} });
  }
  function disposeThreeScene(scene) {
    if (!scene || !scene.traverse) return;
    scene.traverse(function (obj) {
      if (obj.geometry && obj.geometry.dispose) obj.geometry.dispose();
      var mat = obj.material;
      if (Array.isArray(mat)) mat.forEach(function (m) { if (m && m.dispose) m.dispose(); });
      else if (mat && mat.dispose) mat.dispose();
    });
  }

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function jsArg(s) { return String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/[\r\n]+/g, ' '); }
  function typeMeta(t) { return D.types[t] || D.types.Article; }
  function rec(id) { for (var i = 0; i < D.records.length; i++) if (D.records[i].id === id) return D.records[i]; return null; }
  // Only free, openly accessible readings get a public link. Copyrighted or
  // library readings (access 'verified' or 'library') are reached through
  // Blackboard or the Seneca Library, never linked or hosted here (copyright).
  function readUrl(r) {
    return r.pdfUrl || r.url || (r.doi ? 'https://doi.org/' + r.doi : null);
  }
  function sourceUrl(r) {
    var primary = readUrl(r);
    var source = r.sourceUrl || r.landingUrl || r.recordUrl || ((r.pdfUrl && r.url) ? r.url : null) || (r.doi ? 'https://doi.org/' + r.doi : null);
    return (source && source !== primary) ? source : null;
  }
  function sourceLabel(r) {
    if (r.sourceLabel) return r.sourceLabel;
    return r.doi ? 'Source page / DOI' : 'Source page';
  }
  function sourceButton(r) {
    if (!sourceUrl(r)) return '';
    return '<button onclick="SOC.source(\'' + r.id + '\')" style="width:100%;margin:8px 0 9px;display:inline-flex;align-items:center;justify-content:center;gap:7px;background:#fff;border:1px solid #DEE3EA;color:#1552D8;border-radius:9px;padding:9px 11px;font-size:.8125rem;font-weight:600;cursor:pointer">' + esc(sourceLabel(r)) + '<span style="display:flex">' + ic('external', 14) + '</span></button>';
  }
  function isPdfReading(r) {
    var u = readUrl(r) || '';
    return !!r.pdfUrl || /\.pdf($|[?#])/i.test(u) || /\/article\/download\/|\/servlets\/purl\/|arxiv\.org\/pdf|EIMJ20241604_09|\/jonus\/index\.php\/jonus\/article\/download\//.test(u);
  }
  function readLabel(r) {
    if (r.fulltext === false) return 'Find it in the Seneca Library';
    return isPdfReading(r) ? 'Open the PDF' : 'Open the reading';
  }
  function accessNote(r) {
    if (r.access === 'openstax') return 'Free and open on OpenStax. Opens in a new tab.';
    if (r.access === 'open') return 'Open access. Opens in a new tab.';
    if (r.access === 'library') return 'A licensed reading. Read it through the Seneca Library, and in this week\'s Readings folder on Blackboard.';
    return 'Posted in this week\'s Readings folder on Blackboard.';
  }
  function eyeLabel(r) { return r.eye === 'indigenous' ? 'Indigenous-scholar reading' : 'Western reading'; }
  function weekTitle(n) { return (D.weeks && D.weeks[n]) ? D.weeks[n] : ''; }
  function weeksWithReadings() { var set = {}; D.records.forEach(function (r) { set[r.week] = (set[r.week] || 0) + 1; }); return Object.keys(set).map(Number).sort(function (a, b) { return a - b; }); }
  function templatedSynthesis(recs) {
    function who(r) { return r.authors.indexOf('OpenStax') >= 0 ? 'OpenStax' : r.authors; }
    function lower(s) { return s.charAt(0).toLowerCase() + s.slice(1); }
    function trim(s) { return s.replace(/\.\s*$/, ''); }
    var west = recs.filter(function (r) { return r.eye === 'western'; });
    var ind = recs.filter(function (r) { return r.eye === 'indigenous'; });
    var both = west.length && ind.length;
    var named = recs.map(function (r) { return r.title + ' by ' + who(r); });
    var lead = recs.length === 2
      ? 'This compares ' + named[0] + ' and ' + named[1] + '.'
      : 'This compares ' + named.slice(0, -1).join(', ') + ', and ' + named[named.length - 1] + '.';
    var ideas = recs.map(function (r, i) {
      var ord = recs.length === 2 ? (i === 0 ? 'The first' : 'The second') : ('The ' + (['first', 'second', 'third'][i] || 'next'));
      return ord + ' says that ' + lower(trim(r.coreIdea)) + '.';
    }).join(' ');
    var rel = !HAS_EYE
      ? 'Read them together for how the same ideas and approaches play out across different topics.'
      : (both
      ? 'These include a Western reading and an Indigenous one. The course asks you to read them together rather than choose between them.'
      : (ind.length
        ? 'Both are by Indigenous scholars. Read them for how Indigenous knowledge applies to different topics.'
        : 'Both are Western readings. Read them for how the same approach applies to different topics.'));
    var close = 'Reading them together shows what you would miss from ' + (recs.length === 2 ? 'either one' : 'any one') + ' alone.';
    return [lead + ' ' + ideas + ' ' + rel + ' ' + close];
  }
  function pairText(a, b) {
    var k = [a.id, b.id].sort().join('|');
    return (D.syntheses && D.syntheses[k]) ? D.syntheses[k] : templatedSynthesis([a, b])[0];
  }
  function surnameOf(r) {
    var first = String(r.authors).replace(/\s*\([^)]*\)/g, '').split(',')[0].split(' and ')[0].split('&')[0].trim();
    var parts = first.split(' ');
    return parts.length > 3 ? first : parts[parts.length - 1];
  }
  function tripleLead(recs) {
    var names = recs.map(surnameOf);
    var listed = recs.map(function (r) { return r.title + ' (' + surnameOf(r) + ', Week ' + r.week + ')'; });
    return 'Holding three at once: ' + listed[0] + '; ' + listed[1] + '; and ' + listed[2] + '. A three-way comparison is really three relationships, so each pairing is taken in turn below: ' + names[0] + ' with ' + names[1] + ', then ' + names[0] + ' with ' + names[2] + ', then ' + names[1] + ' with ' + names[2] + '. Notice what each pairing sharpens, and what only appears when all three are on the table.';
  }
  function buildSynthesis(recs) {
    if (recs.length <= 2) {
      if (recs.length === 2) return { paras: [pairText(recs[0], recs[1])] };
      return { paras: templatedSynthesis(recs) };
    }
    var paras = [tripleLead(recs)];
    for (var i = 0; i < recs.length; i++) for (var j = i + 1; j < recs.length; j++) paras.push(pairText(recs[i], recs[j]));
    return { paras: paras };
  }

  var ICON = {
    help: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', 'M12 8v5', 'M12 16h.01'],
    book: ['M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21z', 'M4 18.5A2.5 2.5 0 0 1 6.5 16H20'],
    file: ['M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8z', 'M14 3v5h5'],
    clipboard: ['M9 4.5h6v3H9z', 'M9 6H6v15h12V6h-3'],
    search: ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'M20 20l-4-4'],
    x: ['M6 6l12 12', 'M18 6L6 18'],
    check: ['M4 12.5l5 5 11-11'],
    bookmark: ['M6 3h12v18l-6-4-6 4z'],
    grid: ['M4 4h7v7H4z', 'M13 4h7v7h-7z', 'M4 13h7v7H4z', 'M13 13h7v7h-7z'],
    list: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01'],
    layers: ['M12 3l9 5-9 5-9-5z', 'M3 13l9 5 9-5'],
    columns: ['M4 4h7v16H4z', 'M13 4h7v16h-7z'],
    sparkle: ['M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z'],
    chevron: ['M9 6l6 6-6 6'],
    external: ['M14 4h6v6', 'M20 4l-9 9', 'M19 14v5H5V5h5'],
    plus: ['M12 5v14', 'M5 12h14'],
    clock: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 6v6l4 2'],
    globe: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M2 12h20', 'M12 2a15 15 0 0 1 0 20', 'M12 2a15 15 0 0 0 0 20'],
    gauge: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 12l4-3'],
    calendar: ['M5 5h14v15H5z', 'M5 9h14', 'M9 3v4', 'M15 3v4'],
    type: ['M4 7V5h16v2', 'M9 19h6', 'M12 5v14'],
    eye: ['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
    unlock: ['M7 11V8a5 5 0 0 1 9.9-1', 'M5 11h14v10H5z'],
    play: ['M7 5l11 7-11 7z'],
    map: ['M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z', 'M9 3v15', 'M15 6v15'],
    gallery: ['M3 5h18v14H3z', 'M3 16l5-5 4 4 3-3 6 6', 'M8.5 9.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2'],
  };
  function ic(name, size, w) {
    var paths = ICON[name] || ICON.file, s = size || 20;
    var out = '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.8) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
    for (var i = 0; i < paths.length; i++) out += '<path d="' + paths[i] + '"></path>';
    return out + '</svg>';
  }

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function announce(msg) {
    var lr = document.getElementById('soc-live');
    if (lr) { lr.textContent = ''; setTimeout(function () { lr.textContent = msg; }, 30); }
  }
  function readerLensButton() {
    var on = !!state.rlPanelOpen;
    var rn = rlActiveCount();
    return '<button type="button" class="reader-lens-btn' + (on ? ' on' : '') + '" onclick="SOC.rlPanel()" aria-pressed="' + (on ? 'true' : 'false') + '" aria-expanded="' + (on ? 'true' : 'false') + '" aria-label="Reading Lens: open reading supports' + (rn ? ', ' + rn + ' support' + (rn === 1 ? '' : 's') + ' active' : '') + '" title="Reading Lens: text size, spacing, font, tint, ruler, magnifier, read aloud">' + ic('search', 17, 2) + '<span class="reader-lens-label">Reading Lens</span>' + (rn ? '<span class="rl-count" aria-hidden="true">' + rn + '</span>' : '') + '</button>'
      + (('speechSynthesis' in window) ? '<button type="button" class="reader-lens-btn listen-btn' + (rlSpeaking ? ' on' : '') + '" onclick="SOC.listenMenu()" aria-pressed="' + (rlSpeaking ? 'true' : 'false') + '" aria-label="' + (rlSpeaking ? 'Stop reading this page aloud' : 'Listen: open the read aloud controls') + '"><span aria-hidden="true">' + (rlSpeaking ? '&#9632;' : '&#9654;') + '</span><span class="reader-lens-label">' + (rlSpeaking ? 'Stop' : 'Listen') + '</span></button>' : '');
  }
  function rlLangLabel(tag) {
    var t = String(tag || '').replace('_', '-');
    var MAP = {
      'en-US': 'English, United States', 'en-GB': 'English, United Kingdom', 'en-CA': 'English, Canada',
      'en-AU': 'English, Australia', 'en-IN': 'English, India', 'en-NG': 'English, Nigeria',
      'en-ZA': 'English, South Africa', 'en-KE': 'English, Kenya', 'en-IE': 'English, Ireland',
      'en-JM': 'English, Jamaica', 'en-TT': 'English, Trinidad and Tobago', 'en-GH': 'English, Ghana',
      'fr-FR': 'French, France', 'fr-CA': 'French, Canada', 'es-ES': 'Spanish, Spain', 'es-MX': 'Spanish, Mexico',
      'es-US': 'Spanish, United States', 'pt-BR': 'Portuguese, Brazil', 'pt-PT': 'Portuguese, Portugal',
      'zh-CN': 'Chinese, Mainland', 'zh-HK': 'Chinese, Hong Kong', 'zh-TW': 'Chinese, Taiwan',
      'hi-IN': 'Hindi', 'pa-IN': 'Punjabi', 'ta-IN': 'Tamil', 'ur-PK': 'Urdu', 'ar-SA': 'Arabic',
      'sw-KE': 'Swahili', 'am-ET': 'Amharic', 'yo-NG': 'Yoruba', 'ig-NG': 'Igbo', 'ha-NG': 'Hausa',
      'so-SO': 'Somali', 'vi-VN': 'Vietnamese', 'tl-PH': 'Filipino', 'fa-IR': 'Persian', 'ru-RU': 'Russian',
      'uk-UA': 'Ukrainian', 'pl-PL': 'Polish', 'de-DE': 'German', 'it-IT': 'Italian', 'ko-KR': 'Korean', 'ja-JP': 'Japanese'
    };
    return MAP[t] || t;
  }
  function rlVoiceSelect(r) {
    try {
      var vs = (window.speechSynthesis.getVoices() || []).slice();
      if (!vs.length) return '<span class="rl-hint">Your browser has not shared its voice list yet.</span>' + rlBtn('', 'Load voices', false, 'SOC.rlVoicesRefresh()');
      vs.sort(function (x, y) {
        var xe = String(x.lang).indexOf('en') === 0 ? 0 : 1;
        var ye = String(y.lang).indexOf('en') === 0 ? 0 : 1;
        if (xe !== ye) return xe - ye;
        if (x.lang !== y.lang) return String(x.lang) < String(y.lang) ? -1 : 1;
        return String(x.name) < String(y.name) ? -1 : 1;
      });
      return '<select class="rl-voice" aria-label="Read aloud voice and language" onchange="SOC.rlVoice(this.value)"><option value="">Default voice</option>'
        + vs.map(function (v) { var vn = String(v.name).split(' - ')[0].replace(/\s*\([^)]*\)\s*$/, ''); return '<option value="' + esc(v.voiceURI) + '"' + (r.voice === v.voiceURI ? ' selected' : '') + '>' + esc(rlLangLabel(v.lang) + ': ' + vn) + '</option>'; }).join('')
        + '</select>'
        + '<details class="sc-how" style="margin-top:6px"><summary>About voices and languages</summary><p>This reads the page\'s own words aloud, so the words stay in English: picking a voice changes the accent and pronunciation, not the language of the text. Voices come from your own device, so the list differs by phone or computer. Every voice on your device is listed, in a range of tones and styles, labelled only by region and name. Pick whichever sounds most like your community, or simply the one you find easiest to listen to; you can add more voices in your device settings.</p></details>';
    } catch (e) { return ''; }
  }
  function rlActiveCount() {
    var r = rlState(), n = 0;
    if (r.zoom !== 100) n++;
    if (r.space) n++;
    if (r.font) n++;
    if (r.tint !== 'none') n++;
    if (r.ruler) n++;
    if (state.readerLensOpen) n++;
    return n;
  }
  function readerLensOverlay() {
    if (!state.readerLensOpen) return '';
    return '<section id="reader-lens-dock" class="rl-dock" role="region" aria-label="Reading magnifier">'
      + '<div class="rl-dock-head"><strong>' + ic('search', 15, 2) + ' Magnifier</strong>'
      + '<span class="rl-dock-hint">Shows the text under your pointer in large print. Keyboard: Tab to any item and it appears here. Escape turns it off.</span>'
      + '<button type="button" class="rl-btn rl-close" onclick="SOC.toggleReaderLens()" aria-label="Turn magnifier off">' + ic('x', 15, 2) + '</button></div>'
      + '<div id="reader-lens-copy" class="rl-dock-copy" aria-hidden="true">Move your pointer over any text, or Tab through the page.</div>'
      + '</section>';
  }
  var rlDockRaf = 0;
  function readerLensTextAt(x, y) {
    var dock = document.getElementById('reader-lens-dock');
    var stack = document.elementsFromPoint ? document.elementsFromPoint(x, y) : [document.elementFromPoint(x, y)];
    var allowed = /^(p|li|h1|h2|h3|h4|h5|h6|blockquote|td|th|figcaption|label|button|a|summary|small|strong|b)$/;
    for (var i = 0; i < stack.length; i++) {
      var node = stack[i];
      if (dock && dock.contains(node)) continue;
      while (node && node !== document.body) {
        if (dock && dock.contains(node)) break;
        var tag = String(node.tagName || '').toLowerCase();
        if (allowed.test(tag)) {
          var text = (node.textContent || '').replace(/\s+/g, ' ').trim();
          if (text) return text.length > 700 ? text.slice(0, 697) + '...' : text;
        }
        node = node.parentElement;
      }
    }
    return '';
  }
  function rlDockShow(text) {
    var out = document.getElementById('reader-lens-copy');
    if (out && text) out.textContent = text;
  }
  function rlDockPointer(e) {
    if (rlDockRaf) return;
    var x = e.clientX, y = e.clientY;
    rlDockRaf = requestAnimationFrame(function () {
      rlDockRaf = 0;
      rlDockShow(readerLensTextAt(x, y));
    });
  }
  function rlDockFocus(e) {
    var dock = document.getElementById('reader-lens-dock');
    if (!e.target || (dock && dock.contains(e.target))) return;
    var text = (e.target.textContent || e.target.getAttribute && e.target.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
    if (text) rlDockShow(text.length > 700 ? text.slice(0, 697) + '...' : text);
  }
  function rlDockKey(e) {
    if (e.key === 'Escape' && state.readerLensOpen) { SOC.toggleReaderLens(); }
  }
  function rlDockWire(on) {
    if (on) {
      document.addEventListener('pointermove', rlDockPointer, true);
      document.addEventListener('pointerdown', rlDockPointer, true);
      document.addEventListener('focusin', rlDockFocus, true);
      document.addEventListener('keydown', rlDockKey, true);
    } else {
      document.removeEventListener('pointermove', rlDockPointer, true);
      document.removeEventListener('pointerdown', rlDockPointer, true);
      document.removeEventListener('focusin', rlDockFocus, true);
      document.removeEventListener('keydown', rlDockKey, true);
    }
  }

  /* ---------- Reading Supports (Reading Lens v2) ---------- */
  function rlState() {
    if (!state.rl || typeof state.rl !== 'object') state.rl = {};
    var r = state.rl;
    if (r.zoom === 85 || r.zoom === 92) r.zoom = 87;
    if ([75, 87, 100, 115, 130, 150, 175].indexOf(r.zoom) < 0) r.zoom = 100;
    if (['s', 'm', 'l'].indexOf(r.rulerH) < 0) r.rulerH = 'm';
    if (r.rate === 85) r.rate = 75;
    if (r.rate === 115) r.rate = 125;
    if ([50, 75, 100, 125, 150, 200].indexOf(r.rate) < 0) r.rate = 100;
    if (['none', 'warm', 'cream', 'yellow', 'peach', 'rose', 'green', 'blue', 'lilac', 'grey'].indexOf(r.tint) < 0) r.tint = 'none';
    r.space = !!r.space; r.font = !!r.font; r.ruler = !!r.ruler;
    if ([85, 100, 115].indexOf(r.rate) < 0) r.rate = 100;
    return r;
  }
  var rlRulerY = 220, rlRulerRaf = 0, rlSpeaking = false, rlSpeakIdx = -1, rlSpeakBlocks = [];
  function rlRefocus() { setTimeout(function () { var p = document.getElementById('rl-panel'); if (p) p.focus(); }, 0); }
  function rlApply() {
    var r = rlState(), root = document.documentElement;
    ['rl-z75', 'rl-z87', 'rl-z115', 'rl-z130', 'rl-z150', 'rl-z175'].forEach(function (c) { root.classList.remove(c); });
    if (r.zoom !== 100) root.classList.add('rl-z' + r.zoom);
    root.classList.toggle('rl-space', r.space);
    root.classList.toggle('rl-font', r.font);
    var tint = document.getElementById('rl-tint');
    if (r.tint !== 'none') {
      if (!tint) { tint = document.createElement('div'); tint.id = 'rl-tint'; document.body.appendChild(tint); }
      tint.style.background = ({ warm: 'rgba(255,183,106,.42)', cream: 'rgba(255,236,190,.34)', yellow: 'rgba(255,246,153,.32)', peach: 'rgba(255,214,182,.32)', rose: 'rgba(255,205,216,.30)', green: 'rgba(198,236,203,.32)', blue: 'rgba(199,222,255,.34)', lilac: 'rgba(222,208,255,.30)', grey: 'rgba(214,219,227,.4)' })[r.tint] || 'rgba(214,219,227,.4)';
      tint.style.mixBlendMode = (r.tint === 'warm') ? 'multiply' : '';
    } else if (tint) { tint.remove(); }
    rlRulerApply();
  }
  function rlRulerParts() {
    return { top: document.getElementById('rl-ruler-top'), band: document.getElementById('rl-ruler-band'), bot: document.getElementById('rl-ruler-bot') };
  }
  function rlRulerApply() {
    var r = rlState(), p = rlRulerParts();
    if (r.ruler) {
      if (!p.top) {
        ['rl-ruler-top', 'rl-ruler-band', 'rl-ruler-bot'].forEach(function (id) {
          var d = document.createElement('div'); d.id = id; d.setAttribute('aria-hidden', 'true'); document.body.appendChild(d);
        });
        document.addEventListener('pointermove', rlRulerFollow, true);
        document.addEventListener('pointerdown', rlRulerDragStart, true);
        document.addEventListener('pointerup', rlRulerDragEnd, true);
        document.addEventListener('keydown', rlRulerKeys, true);
      }
      rlRulerPosition();
    } else if (p.top) {
      p.top.remove(); p.band.remove(); p.bot.remove();
      document.removeEventListener('pointermove', rlRulerFollow, true);
      document.removeEventListener('pointerdown', rlRulerDragStart, true);
      document.removeEventListener('pointerup', rlRulerDragEnd, true);
      document.removeEventListener('keydown', rlRulerKeys, true);
    }
  }
  function rlRulerPosition() {
    var p = rlRulerParts();
    if (!p.top) return;
    var r = rlState();
    var fs = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    var half = Math.round(fs * (r.rulerH === 's' ? 1.05 : r.rulerH === 'l' ? 2.6 : 1.6));
    var y = Math.max(70, Math.min(window.innerHeight - 40, rlRulerY));
    p.top.style.cssText = 'position:fixed;left:0;right:0;top:0;height:' + Math.max(0, y - half) + 'px;pointer-events:none;z-index:61;background:rgba(27,42,74,.32)';
    p.band.style.cssText = 'position:fixed;left:0;right:0;top:' + (y - half) + 'px;height:' + (half * 2) + 'px;' + (rlState().rulerPin ? 'pointer-events:auto;cursor:grab;' : 'pointer-events:none;') + 'z-index:62;border-top:2px solid rgba(218,41,28,.7);border-bottom:2px solid rgba(218,41,28,.7)';
    p.bot.style.cssText = 'position:fixed;left:0;right:0;top:' + (y + half) + 'px;bottom:0;pointer-events:none;z-index:61;background:rgba(27,42,74,.32)';
  }
  var rlRulerDragging = false;
  function rlRulerFollow(e) {
    if (rlState().rulerPin && !rlRulerDragging) return;
    rlRulerY = e.clientY;
    if (!rlRulerRaf) rlRulerRaf = requestAnimationFrame(function () { rlRulerRaf = 0; rlRulerPosition(); });
  }
  function rlRulerDragStart(e) {
    if (e.target && e.target.id === 'rl-ruler-band' && rlState().rulerPin) {
      rlRulerDragging = true;
      e.preventDefault();
    }
  }
  function rlRulerDragEnd() { rlRulerDragging = false; }
  function rlRulerKeys(e) {
    if (!e.altKey || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
    e.preventDefault();
    rlRulerY += (e.key === 'ArrowDown' ? 34 : -34);
    rlRulerPosition();
  }
  function rlSpeakStop() {
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
    rlSpeaking = false; rlSpeakIdx = -1;
    var cur = document.querySelector('.rl-reading-now');
    if (cur) cur.classList.remove('rl-reading-now');
    var b = document.getElementById('rl-speak-btn');
    if (b) { b.setAttribute('aria-pressed', 'false'); b.textContent = 'Read this page aloud'; }
    rlListenBtnSync();
  }
  function rlListenBtnSync() {
    Array.prototype.forEach.call(document.querySelectorAll('.listen-btn'), function (lb) {
      lb.classList.toggle('on', rlSpeaking);
      lb.setAttribute('aria-pressed', String(rlSpeaking));
      lb.setAttribute('aria-label', rlSpeaking ? 'Stop reading this page aloud' : 'Listen: read this page aloud');
      lb.innerHTML = '<span aria-hidden="true">' + (rlSpeaking ? '&#9632;' : '&#9654;') + '</span><span class="reader-lens-label">' + (rlSpeaking ? 'Stop' : 'Listen') + '</span>';
    });
  }
  function rlSpeakNext() {
    if (!rlSpeaking) return;
    rlSpeakIdx++;
    var prev = document.querySelector('.rl-reading-now');
    if (prev) prev.classList.remove('rl-reading-now');
    if (rlSpeakIdx >= rlSpeakBlocks.length) { rlSpeakStop(); announce('Finished reading the page aloud.'); return; }
    var el = rlSpeakBlocks[rlSpeakIdx];
    if (!el || !el.isConnected) { rlSpeakNext(); return; }
    el.classList.add('rl-reading-now');
    var reduced = false;
    try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    try { el.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' }); } catch (e) {}
    var u = new SpeechSynthesisUtterance(el.textContent.replace(/\s+/g, ' ').trim().slice(0, 2000));
    u.rate = rlState().rate / 100;
    try {
      var vsel = rlState().voice;
      if (vsel) {
        var vv = (window.speechSynthesis.getVoices() || []).filter(function (v) { return v.voiceURI === vsel; })[0];
        if (vv) { u.voice = vv; u.lang = vv.lang; }
      }
    } catch (e) {}
    u.onend = function () { setTimeout(rlSpeakNext, 120); };
    u.onerror = function () { rlSpeakStop(); };
    try { window.speechSynthesis.speak(u); } catch (e) { rlSpeakStop(); }
  }
  function rlSpeakToggle() {
    if (!('speechSynthesis' in window)) { announce('Read aloud is not available in this browser.'); return; }
    if (rlSpeaking) { rlSpeakStop(); announce('Stopped reading aloud.'); return; }
    var main = document.getElementById('soc-main');
    if (!main) return;
    rlSpeakBlocks = Array.prototype.slice.call(main.querySelectorAll('h1, h2, h3, h4, p, li'))
      .filter(function (el) { return el.offsetParent !== null && el.textContent.replace(/\s+/g, ' ').trim().length > 2; });
    if (!rlSpeakBlocks.length) { announce('Nothing to read on this page.'); return; }
    rlSpeaking = true; rlSpeakIdx = -1;
    var b = document.getElementById('rl-speak-btn');
    if (b) { b.setAttribute('aria-pressed', 'true'); b.textContent = 'Stop reading aloud'; }
    rlListenBtnSync();
    announce('Reading the page aloud from the top.');
    rlSpeakNext();
  }
  function rlBtn(id, label, pressed, handler, extra) {
    return '<button type="button" id="' + (id || '') + '" class="rl-btn" aria-pressed="' + (pressed ? 'true' : 'false') + '" onclick="' + handler + '"' + (extra || '') + '>' + label + '</button>';
  }
  function listenOverlay() {
    if (!state.listenOpen) return '';
    var r = rlState();
    return '<div class="rl-panel listen-pop" role="dialog" aria-label="Listen to this page">'
      + '<div class="rl-head"><strong>Listen</strong><button type="button" class="rl-btn rl-close" onclick="SOC.listenMenu()" aria-label="Close listen controls">' + ic('x', 16, 2) + '</button></div>'
      + '<div class="rl-row"><b>Voice and language</b>' + rlVoiceSelect(r) + '</div>'
      + '<div class="rl-row"><b>Speed</b>' + [50, 75, 100, 125, 150, 200].map(function (v) { return rlBtn('', v === 100 ? '1x' : (v / 100) + 'x', r.rate === v, 'SOC.rlRate(' + v + ')'); }).join('') + '</div>'
      + '<button type="button" id="listen-play" class="wk-cta" style="margin:12px 0 0;width:100%" onclick="SOC.listenGo()">Read this page aloud</button>'
      + '</div>';
  }
  function rlPanelOverlay() {
    if (!state.rlPanelOpen) return '';
    var r = rlState();
    var zoomBtns = [75, 87, 100, 115, 130, 150, 175].map(function (z) {
      return rlBtn('', z === 75 ? 'Smaller' : z === 87 ? 'Small' : z === 100 ? 'Default' : z + '%', r.zoom === z, "SOC.rlZoom(" + z + ")");
    }).join('');
    var tintBtns = [['none', 'None'], ['warm', 'Blue light filter'], ['cream', 'Cream'], ['yellow', 'Yellow'], ['peach', 'Peach'], ['rose', 'Rose'], ['green', 'Green'], ['blue', 'Blue'], ['lilac', 'Lilac'], ['grey', 'Grey']].map(function (t) {
      return rlBtn('', t[1], r.tint === t[0], "SOC.rlTint('" + t[0] + "')");
    }).join('');
    var speech = ('speechSynthesis' in window)
      ? '<div class="rl-row"><b>Listen</b>' + rlBtn('rl-speak-btn', rlSpeaking ? 'Stop reading aloud' : 'Read this page aloud', rlSpeaking, 'SOC.rlSpeak()')
        + [50, 75, 100, 125, 150, 200].map(function (v) { return rlBtn('', v === 100 ? '1x' : (v / 100) + 'x', r.rate === v, 'SOC.rlRate(' + v + ')'); }).join('') + '</div>'
        + '<div class="rl-row"><b>Voice and language</b>' + rlVoiceSelect(r) + '</div>'
      : '';
    return '<section id="rl-panel" class="rl-panel" role="dialog" aria-label="Reading Lens: reading supports" tabindex="-1" onkeydown="SOC.rlPanelKey(event)">'
      + '<div class="rl-head"><strong>Reading Lens</strong><button type="button" class="rl-btn rl-close" onclick="SOC.rlPanel()" aria-label="Close Reading Lens panel">' + ic('x', 16, 2) + '</button></div>'
      + '<p class="rl-sub">Reading supports for this site. Your choices apply everywhere here and save only in this browser.</p>'
      + '<div class="rl-row"><b>Text size</b>' + zoomBtns + '</div>'
      + '<div class="rl-row"><b>Comfortable spacing</b>' + rlBtn('', r.space ? 'On' : 'Off', r.space, 'SOC.rlSpace()') + '</div>'
      + '<div class="rl-row"><b>High-legibility font</b>' + rlBtn('', r.font ? 'On' : 'Off', r.font, 'SOC.rlFont()') + '</div>'
      + '<div class="rl-row"><b>Page tint</b>' + tintBtns + '</div>'
      + '<div class="rl-row"><b>Reading ruler</b>' + rlBtn('', r.ruler ? 'On' : 'Off', r.ruler, 'SOC.rlRuler()')
      + (r.ruler ? [['s', 'Narrow'], ['m', 'Medium'], ['l', 'Wide']].map(function (h) { return rlBtn('', h[1], r.rulerH === h[0], "SOC.rlRulerH('" + h[0] + "')"); }).join('') + rlBtn('', r.rulerPin ? 'Pinned' : 'Pin in place', !!r.rulerPin, 'SOC.rlRulerPin()') : '')
      + '<span class="rl-hint">' + (r.rulerPin ? 'Pinned: drag the band by hand, or press Alt plus Up or Down.' : 'Follows your pointer. Pin it to drag it by hand. Alt plus Up or Down also moves it.') + '</span></div>'
      + '<div class="rl-row"><b>Magnifier</b>' + rlBtn('', state.readerLensOpen ? 'On' : 'Off', !!state.readerLensOpen, 'SOC.toggleReaderLens()') + '<span class="rl-hint">A movable lens that repeats the text under it in large print.</span></div>'
      + speech
      + '<div class="rl-row"><b>Start fresh</b>' + rlBtn('', 'Reset all supports', false, 'SOC.rlReset()') + '<span class="rl-hint">Everything back to default. Your settings otherwise stay on, even with this panel closed, and are remembered for your next visit.</span></div>'
      + '<p class="rl-hint" style="margin:10px 0 0">Escape closes this panel. If any part of the site is still hard to use, use Blackboard and contact the instructor so access can be supported.</p>'
      + '</section>';
  }

  /* ---------- filtering + sorting ---------- */
  function filtered() {
    var q = state.search.trim().toLowerCase();
    var base = state.savedView ? D.records.filter(function (r) { return state.saved.indexOf(r.id) >= 0; }) : D.records;
    var list = base.filter(function (r) {
      if (state.activeTypes.length && state.activeTypes.indexOf(r.type) < 0) return false;
      if (state.activeWeek != null && r.week !== state.activeWeek) return false;
      if (q) {
        var hay = (r.title + ' ' + r.authors + ' ' + r.abstract + ' ' + r.coreIdea + ' ' + r.type + ' Week ' + r.week + ' ' + weekTitle(r.week)).toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    });
    var by = state.sort;
    list.sort(function (a, b) {
      return by === 'year' ? b.year - a.year : by === 'title' ? a.title.localeCompare(b.title) : by === 'type' ? (a.type.localeCompare(b.type) || a.week - b.week) : (a.week - b.week || (a.eye === b.eye ? 0 : a.eye === 'western' ? -1 : 1));
    });
    return list;
  }

  /* ---------- style builders ---------- */
  function saveBtnStyle(on) { return 'display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:8px;border:1px solid ' + (on ? '#f0d89a' : '#DEE3EA') + ';background:' + (on ? '#FCEFD2' : '#fff') + ';color:' + (on ? '#B7791F' : '#6B7280') + ';flex:none'; }
  function cmpBtnStyle(on) { return 'display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:8px;border:1px solid ' + (on ? '#bcd0f2' : '#DEE3EA') + ';background:' + (on ? '#E7EEFB' : '#fff') + ';color:' + (on ? '#1552D8' : '#6B7280') + ';flex:none'; }
  function chipStyle(active, accent) { return 'display:inline-flex;align-items:center;gap:6px;border:1px solid ' + (active ? accent : '#DEE3EA') + ';background:' + (active ? accent + '22' : '#fff') + ';color:' + (active ? '#15171C' : '#474C57') + ';font-size:.8125rem;font-weight:' + (active ? '600' : '500') + ';padding:6px 11px;border-radius:999px'; }
  function segStyle(active) { return 'border:none;border-radius:7px;padding:6px 12px;font-size:.8125rem;font-weight:' + (active ? '600' : '500') + ';background:' + (active ? '#fff' : 'transparent') + ';color:' + (active ? '#15171C' : '#474C57') + ';box-shadow:' + (active ? '0 1px 2px rgba(21,23,28,.12)' : 'none') + ';display:flex;align-items:center;gap:6px'; }
  function eyePill(r) {
    if (!HAS_EYE) return '';
    var ind = r.eye === 'indigenous';
    return '<span title="' + esc(eyeLabel(r)) + '" style="display:inline-flex;align-items:center;gap:5px;font-family:var(--mono);font-size:.625rem;font-weight:600;letter-spacing:.04em;color:' + (ind ? '#961A13' : '#3a47a8') + ';background:' + (ind ? '#FBF4F3' : '#E7E9FB') + ';padding:3px 8px;border-radius:999px">' + (ind ? 'INDIGENOUS' : 'WESTERN') + '</span>';
  }
  function weekTag(r) { return '<span class="mono" style="font-size:.6875rem;color:#6B7280;background:#EEF1F5;padding:3px 8px;border-radius:6px">Week ' + r.week + '</span>'; }

  /* ---------- cards ---------- */
  function tileCard(r) {
    var tm = typeMeta(r.type), savedOn = state.saved.indexOf(r.id) >= 0, inC = state.compareIds.indexOf(r.id) >= 0;
    return '<div class="card" style="background:#fff;border:1px solid #DEE3EA;border-radius:14px;overflow:hidden;box-shadow:0 1px 2px rgba(21,23,28,.04);display:flex;flex-direction:column">'
      + '<button onclick="SOC.open(\'' + r.id + '\')" style="text-align:left;background:none;border:none;padding:0;display:flex;flex-direction:column;flex:1">'
      + '<div style="height:5px;background:' + tm.color + ';width:100%"></div>'
      + '<div style="padding:16px 17px 12px;flex:1;display:flex;flex-direction:column">'
      + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:11px;flex-wrap:wrap">'
      + '<span style="display:inline-flex;align-items:center;gap:6px;background:' + tm.soft + ';color:' + tm.color + ';font-size:.6875rem;font-weight:600;letter-spacing:.03em;padding:4px 9px;border-radius:999px">' + ic(tm.icon, 13) + esc(r.type) + '</span>'
      + eyePill(r)
      + '<span class="mono" style="font-size:.75rem;color:#6B7280;margin-left:auto">' + esc(String(r.year)) + '</span></div>'
      + '<h3 style="font-size:1.125rem;line-height:1.28;font-weight:600;margin:0 0 4px;color:#15171C">' + esc(r.title) + '</h3>'
      + '<div style="font-size:.8125rem;color:#474C57;margin-bottom:11px">' + esc(r.authors) + '</div>'
      + '<p style="font-size:.875rem;line-height:1.5;color:#474C57;margin:0 0 13px">' + esc(r.abstract) + '</p>'
      + '<div style="margin-top:auto">' + weekTag(r) + '</div>'
      + '</div></button>'
      + '<div style="display:flex;align-items:center;gap:8px;padding:11px 17px;border-top:1px solid #EEF1F5;background:#FBFCFD">'
      + '<span class="mono" style="font-size:.75rem;color:#6B7280">' + esc(r.len) + '</span>'
      + '<button onclick="SOC.compare(\'' + r.id + '\')" aria-label="' + (inC ? 'In compare' : 'Add to compare') + '" title="' + (inC ? 'In compare' : 'Add to compare') + '" style="' + cmpBtnStyle(inC) + ';margin-left:auto">' + ic('columns', 15) + '</button>'
      + '</div></div>';
  }
  function indexRow(r) {
    var tm = typeMeta(r.type), savedOn = state.saved.indexOf(r.id) >= 0, inC = state.compareIds.indexOf(r.id) >= 0;
    return '<div class="idxrow" style="display:flex;align-items:center;gap:14px;padding:13px 18px;border-bottom:1px solid #EEF1F5">'
      + '<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:9px;background:' + tm.soft + ';color:' + tm.color + ';flex:none">' + ic(tm.icon, 18) + '</span>'
      + '<button onclick="SOC.open(\'' + r.id + '\')" style="flex:1;min-width:0;text-align:left;background:none;border:none;padding:0">'
      + '<div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap"><span style="font-size:1rem;font-weight:600;color:#15171C">' + esc(r.title) + '</span><span style="font-size:.8125rem;color:#474C57">' + esc(r.authors) + ' · ' + esc(String(r.year)) + '</span></div>'
      + '<div style="font-size:.8125rem;color:#6B7280;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + esc(r.abstract) + '</div></button>'
      + eyePill(r)
      + '<span class="mono" style="font-size:.75rem;color:#6B7280;flex:none;width:64px;text-align:right">Week ' + r.week + '</span>'
      + '<button onclick="SOC.compare(\'' + r.id + '\')" aria-label="' + (inC ? 'In compare' : 'Add to compare') + '" style="' + cmpBtnStyle(inC) + '">' + ic('columns', 15) + '</button>'
      + '</div>';
  }

  /* ---------- chrome ---------- */
  function header() {
    return '<header style="position:sticky;top:0;z-index:40;height:62px;background:#fff;border-bottom:3px solid var(--amode);display:flex;align-items:center;padding:0 22px;gap:14px;flex:none">'
      + '<button class="soc-mobile-menu" onclick="SOC.toggleNav()" aria-label="' + (state.navOpen ? 'Close course navigation' : 'Open course navigation') + '" aria-expanded="' + (state.navOpen ? 'true' : 'false') + '" style="align-items:center;justify-content:center;width:38px;height:38px;border:1px solid #DEE3EA;border-radius:10px;background:#fff;color:#474C57;flex:none">' + ic(state.navOpen ? 'x' : 'list', 18) + '</button>'
      + '<div class="soc-head-brand" style="display:flex;align-items:center;gap:10px;flex:none;min-width:0"><img src="./seneca-logo.png" alt="Seneca Polytechnic" style="height:34px;width:auto;display:block"><span class="soc-head-title" style="font-weight:600;font-size:1.0625rem;color:var(--ink);letter-spacing:0;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">BFS218 Companion</span></div>'
      + readerLensButton()
      + (D.course.mode ? '<span class="mono soc-head-mode" style="font-size:.75rem;font-weight:700;color:#fff;background:var(--amode);padding:6px 12px;border-radius:6px;letter-spacing:.05em;flex:none">' + esc(D.course.mode).toUpperCase() + '</span>' : '')
      + (String(state.programViewField || state.careerField || '').trim() ? '<button type="button" class="mono soc-head-term" onclick="SOC.go(\'career\')" title="Change your program lens" style="font-size:.72rem;font-weight:600;color:#1B2A4A;background:#EEF1F5;border:1px solid #DEE3EA;padding:5px 10px;border-radius:6px;flex:none;cursor:pointer;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">VIEWING AS: ' + esc(selLabel(state.programViewField || state.careerField)) + '</button>' : '')
      + '<span class="mono soc-head-term" style="font-size:.75rem;font-weight:600;color:#B02318;background:#F6E3E1;padding:5px 10px;border-radius:6px;flex:none">FALL 2026</span>'
      + '</header>';
  }
  function sidebar() {
    var s = state;
    var navDefs = [['journey', 'Home', 'gauge'], ['site', 'How This Site Works', 'file'], ['pathways', 'Course Pathways', 'map'], ['readings', 'Readings Library', 'gallery'], ['compare', 'Compare Readings', 'columns'], ['reading', 'Reading Practice', 'book'], ['videos', 'Videos and Podcasts', 'play'], ['glossary', 'Glossary', 'book'], ['cards', 'Concept Flashcards', 'clipboard'], ['assignments', 'Starting Your Assignment', 'clipboard'], ['career', 'Career Choices', 'globe']];
    var btns = navDefs.map(function (d) {
      var key = d[0], active = (key === 'journey' && (s.screen === 'journey' || s.screen === 'library' || s.screen === 'station' || s.screen === 'detail')) || s.screen === key;
      var badge = '';
      if (key === 'compare' && s.compareIds.length) badge = '<span class="mono" style="font-size:.6875rem;font-weight:600;color:#1552D8;background:#E7EEFB;padding:1px 7px;border-radius:999px">' + s.compareIds.length + '</span>';
      var click = "SOC.go('" + key + "')";
      return '<button onclick="' + click + '" aria-current="' + (active ? 'page' : 'false') + '" style="display:flex;align-items:center;gap:11px;width:100%;border:none;border-radius:10px;padding:10px 12px;font-size:.9375rem;font-weight:' + (active ? '600' : '500') + ';background:' + (active ? '#EEF1F5' : 'transparent') + ';color:' + (active ? '#15171C' : '#474C57') + ';text-align:left">'
        + '<span style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;flex:none;color:' + (active ? 'var(--red)' : '#6B7280') + '">' + ic(d[2], 19) + '</span><span style="flex:1;text-align:left">' + d[1] + '</span>' + badge + '</button>';
    });
    var wkActive = s.screen === 'walkthroughs';
    var walk = '<button onclick="SOC.go(\'walkthroughs\')" aria-current="' + (wkActive ? 'page' : 'false') + '" style="display:flex;align-items:center;gap:11px;width:100%;border:none;border-radius:10px;padding:10px 12px;font-size:.9375rem;font-weight:' + (wkActive ? '600' : '500') + ';background:' + (wkActive ? '#EEF1F5' : 'transparent') + ';color:' + (wkActive ? '#15171C' : '#474C57') + ';text-align:left"><span style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;flex:none;color:' + (wkActive ? 'var(--red)' : '#6B7280') + '">' + ic('layers', 19) + '</span><span style="flex:1;text-align:left">Weekly Walkthroughs</span></button>';
    var guide = '<div style="border-radius:10px;padding:10px 12px;color:#474C57"><div style="display:flex;align-items:flex-start;gap:11px;font-size:.9375rem;font-weight:500;line-height:1.25"><span style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;flex:none;color:#6B7280">' + ic('file', 19) + '</span><span style="flex:1;min-width:0">Course Website Instructions</span></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0 0 33px"><a href="./guide/" target="_blank" rel="noopener" style="font-size:.75rem;font-weight:600;color:#1B2A4A;background:#EEF1F5;border:1px solid #DEE3EA;border-radius:999px;padding:4px 9px;text-decoration:none">Online guide <span aria-hidden="true">&#8599;</span></a><a href="./guide/BFS218-Companion-Guide.pdf" download style="font-size:.75rem;font-weight:600;color:#1B2A4A;background:#EEF1F5;border:1px solid #DEE3EA;border-radius:999px;padding:4px 9px;text-decoration:none">PDF <span aria-hidden="true">&#8595;</span></a></div></div>';
    var repActive = s.screen === 'report';
    var report = '<button onclick="SOC.reportProblem()" style="display:flex;align-items:center;gap:11px;width:100%;border:none;border-radius:10px;padding:10px 12px;font-size:.9375rem;font-weight:500;background:transparent;color:#474C57;text-align:left"><span style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;flex:none;color:#6B7280">' + ic('help', 19) + '</span><span style="flex:1;text-align:left">Report a problem</span></button>';
    var calActive = s.screen === 'calendar';
    var cal = '<button onclick="SOC.go(\'calendar\')" aria-current="' + (calActive ? 'page' : 'false') + '" style="display:flex;align-items:center;gap:11px;width:100%;border:none;border-radius:10px;padding:10px 12px;font-size:.9375rem;font-weight:' + (calActive ? '600' : '500') + ';background:' + (calActive ? '#EEF1F5' : 'transparent') + ';color:' + (calActive ? '#15171C' : '#474C57') + ';text-align:left"><span style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;flex:none;color:' + (calActive ? 'var(--red)' : '#6B7280') + '">' + ic('calendar', 19) + '</span><span style="flex:1;text-align:left">Calendar and Due Dates</span></button>';
    var lbl = function (t) { return '<div class="mono" style="font-size:.6875rem;letter-spacing:.06em;color:#6B7280;padding:16px 12px 6px">' + t + '</div>'; };
    var nav = btns[0] + btns[1] + cal + lbl('LEARN EACH WEEK') + walk + btns[2];
    var study = lbl('STUDY THE SOURCES') + btns[3] + btns[5] + btns[4] + btns[6] + btns[7] + btns[8] + lbl('DO THE WORK') + btns[9] + lbl('MORE') + btns[10] + guide + report;
    var counts = {}; D.records.forEach(function (r) { counts[r.week] = (counts[r.week] || 0) + 1; });
    var navWeeks = [];
    for (var nw = 1; nw <= 14; nw++) navWeeks.push(nw);
    var weekNav = navWeeks.map(function (w) {
      var active = s.screen === 'station' && s.stationWeek === w;
      return '<button onclick="SOC.station(' + w + ')" style="display:flex;align-items:center;gap:9px;width:100%;border:none;border-radius:9px;padding:7px 12px;font-size:.8125rem;font-weight:' + (active ? '600' : '500') + ';background:' + (active ? '#E6EAF1' : 'transparent') + ';color:' + (active ? '#1B2A4A' : '#474C57') + ';text-align:left">'
        + '<span class="mono" style="font-size:.6875rem;color:' + (active ? '#1B2A4A' : '#6B7280') + ';flex:none;width:18px">' + w + '</span>'
        + '<span style="flex:1;text-align:left;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(weekTitle(w)) + '</span>'
      + '<span class="mono" style="font-size:.6875rem;color:#6B7280">' + (counts[w] || 0) + '</span></button>';
    }).join('');
    return '<nav class="soc-sidebar' + (state.navOpen ? ' soc-sidebar-open' : '') + '" aria-label="Primary" style="width:240px;flex:none;border-right:1px solid #DEE3EA;background:#fff;padding:18px 14px;display:flex;flex-direction:column;gap:4px;position:sticky;top:62px;align-self:flex-start;height:calc(100vh - 62px);overflow:auto">'
      + nav
      + '<div style="margin-top:14px;padding-top:14px;border-top:1px solid #EEF1F5"><div class="mono" style="font-size:.6875rem;letter-spacing:.04em;color:#6B7280;padding:0 12px 8px">WEEKS</div>' + weekNav + '</div>'
      + study
      + '<div style="margin-top:auto;padding:13px 12px;border-radius:12px;background:#EEF1F5"><div class="mono" style="font-size:.75rem;color:#474C57;margin-bottom:4px">BFS218</div><div style="font-size:.8125rem;color:#15171C;line-height:1.45">A living collection, week by week. A companion to Blackboard.</div></div>'
      + '</nav>';
  }

  /* ---------- library ---------- */
  function library() {
    var s = section_state();
    return s;
  }
  function section_state() {
    var s = state, list = filtered();
    var typeCounts = {}; D.records.forEach(function (r) { typeCounts[r.type] = (typeCounts[r.type] || 0) + 1; });
    var html = '<div class="rise">' + (s.introOpen ? '' : '<h1 class="vh">BFS218 source library, by week</h1>');

    if (s.introOpen) {
      var stats = [['Readings', D.records.length], ['Weeks', weeksWithReadings().length], ['Formats', Object.keys(typeCounts).length]];
      html += '<section style="background:#fff;border:1px solid #DEE3EA;border-top:4px solid var(--red);border-radius:14px;padding:28px 30px;margin-bottom:22px;position:relative;box-shadow:0 1px 2px rgba(21,23,28,.04)">'
        + '<div style="display:flex;align-items:flex-start;gap:24px;flex-wrap:wrap;justify-content:space-between">'
        + '<div style="flex:1;min-width:280px"><div class="mono" style="font-size:.75rem;letter-spacing:.06em;color:var(--red);margin-bottom:10px;font-weight:600">THE COURSE CORPUS</div>'
        + '<h1 style="font-size:2.125rem;line-height:1.14;font-weight:600;margin:0 0 10px;color:var(--ink)">Every reading, week by week.</h1>'
        + '<p style="font-size:1rem;line-height:1.6;color:#474C57;margin:0;">These are the readings behind BFS218, in course order. Search them, hold two against each other, and follow the course as it moves.</p></div>'
        + '<div style="display:flex;gap:10px;flex:none">' + stats.map(function (st) { return '<div style="background:#EEF1F5;border:1px solid #DEE3EA;border-radius:12px;padding:12px 16px;text-align:center;min-width:78px"><div class="mono" style="font-size:1.75rem;font-weight:600;line-height:1;color:var(--red)">' + st[1] + '</div><div style="font-size:.6875rem;text-transform:uppercase;letter-spacing:.06em;color:#474C57;margin-top:5px">' + st[0] + '</div></div>'; }).join('') + '</div></div>'
        + '<button onclick="SOC.dismissIntro()" aria-label="Dismiss" style="position:absolute;top:14px;right:14px;background:#EEF1F5;border:none;border-radius:8px;width:30px;height:30px;color:#474C57;display:flex;align-items:center;justify-content:center">' + ic('x', 16) + '</button></section>';
    }

    var layoutDefs = [['byweek', 'By week', 'layers'], ['tiles', 'Tiles', 'grid'], ['index', 'Index', 'list']];
    var layoutChips = layoutDefs.map(function (d) { return '<button onclick="SOC.layout(\'' + d[0] + '\')" title="' + d[1] + '" aria-label="' + d[1] + '" aria-pressed="' + (s.layout === d[0]) + '" style="' + segStyle(s.layout === d[0]) + '">' + ic(d[2], 15) + '<span>' + d[1] + '</span></button>'; }).join('');
    var filtersActive = s.activeTypes.length || s.activeWeek != null || s.search.trim().length || s.savedView;
    var n = list.length;
    var resultLabel = s.savedView ? ('Saved shelf · ' + n + (n === 1 ? ' reading' : ' readings')) : (s.activeWeek != null ? ('Week ' + s.activeWeek + ' · ' + n + (n === 1 ? ' reading' : ' readings')) : (n === D.records.length ? 'All ' + n + ' readings' : n + ' of ' + D.records.length));
    var weekStrip = '<div class="soc-weekstrip" style="gap:8px;overflow-x:auto;margin-bottom:16px;padding-bottom:4px" aria-label="Filter by week">' + weeksWithReadings().map(function (w) { var aw = s.activeWeek === w; return '<button onclick="SOC.week(' + w + ')" aria-pressed="' + aw + '" style="flex:none;border:1px solid ' + (aw ? '#1B2A4A' : '#DEE3EA') + ';background:' + (aw ? '#E6EAF1' : '#fff') + ';color:' + (aw ? '#1B2A4A' : '#474C57') + ';font-size:.8125rem;font-weight:' + (aw ? '600' : '500') + ';padding:8px 12px;border-radius:999px;white-space:nowrap"><span class="mono" style="opacity:.7">W' + w + '</span> ' + esc(weekTitle(w)) + '</button>'; }).join('') + '</div>';

    html += '<section style="background:#fff;border:1px solid #DEE3EA;border-radius:14px;padding:16px 18px;margin-bottom:18px;box-shadow:0 1px 2px rgba(21,23,28,.04)">'
      + '<div style="display:flex;align-items:center;gap:10px;background:#F7F8FA;border:1px solid #DEE3EA;border-radius:10px;padding:11px 14px">'
      + '<span style="display:flex;color:#6B7280;flex:none">' + ic('search', 18) + '</span>'
      + '<input id="soc-search" value="' + esc(s.search) + '" oninput="SOC.search(this.value)" placeholder="Search by title, author, idea, or week..." aria-label="Search readings" style="flex:1;border:none;background:none;outline:none;font-size:1rem;color:#15171C;min-width:0" />'
      + (s.search ? '<button onclick="SOC.clearSearch()" aria-label="Clear search" style="background:none;border:none;color:#6B7280;display:flex;padding:2px">' + ic('x', 16) + '</button>' : '')
      + '</div>'
      + '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:14px;padding-top:14px;border-top:1px solid #EEF1F5">'
      + '<span style="font-size:.8125rem;color:#474C57">' + resultLabel + '</span>'
      + (filtersActive ? '<button onclick="SOC.clearFilters()" style="background:none;border:none;color:var(--red);font-size:.8125rem;font-weight:600;padding:2px 4px">Clear</button>' : '')
      + '<div style="margin-left:auto;display:flex;gap:4px;background:#EEF1F5;border-radius:9px;padding:4px" role="group" aria-label="Layout">' + layoutChips + '</div>'
      + '</div></section>';
    html += weekStrip;

    if (n === 0) {
      html += '<div style="text-align:center;padding:70px 20px;color:#474C57"><div style="display:inline-flex;color:#C9D1DC;margin-bottom:14px">' + ic('search', 44, 1.4) + '</div><div style="font-size:1.125rem;font-weight:600;color:#15171C;margin-bottom:6px">No readings match that yet.</div><p style="margin:0 0 16px;font-size:.9375rem">Try a broader term or clear a filter.</p><button onclick="SOC.clearFilters()" style="background:#1B2A4A;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:.9375rem;font-weight:600">Reset filters</button></div>';
    } else if (s.layout === 'tiles') {
      html += '<div class="soc-cardgrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(296px,1fr));gap:16px">' + list.map(tileCard).join('') + '</div>';
    } else if (s.layout === 'index') {
      html += '<div style="background:#fff;border:1px solid #DEE3EA;border-radius:14px;overflow:hidden;box-shadow:0 1px 2px rgba(21,23,28,.04)">' + list.map(indexRow).join('') + '</div>';
    } else {
      // by week
      var weeks = {};
      list.forEach(function (r) { (weeks[r.week] = weeks[r.week] || []).push(r); });
      var order = Object.keys(weeks).map(Number).sort(function (a, b) { return a - b; });
      html += '<div style="display:flex;flex-direction:column;gap:26px">' + order.map(function (w) {
        var cards = weeks[w].map(tileCard).join('');
        return '<section><div style="display:flex;align-items:baseline;gap:10px;margin-bottom:12px">'
          + '<span style="display:inline-flex;align-items:center;justify-content:center;min-width:30px;height:26px;padding:0 8px;border-radius:8px;background:#1B2A4A;color:#fff;font-family:var(--mono);font-size:.8125rem;font-weight:600;flex:none">' + w + '</span>'
          + '<h2 style="font-size:1.1875rem;font-weight:600;margin:0;color:#15171C">' + esc(weekTitle(w)) + '</h2>'
          + '<span class="mono" style="font-size:.75rem;color:#6B7280">' + weeks[w].length + (weeks[w].length === 1 ? ' reading' : ' readings') + '</span>'
          + '<div style="flex:1;height:1px;background:#EEF1F5"></div></div>'
          + '<div class="soc-cardgrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(296px,1fr));gap:16px">' + cards + '</div></section>';
      }).join('') + '</div>';
    }
    return html + '</div>';
  }

  /* ---------- library of readings (immersive gallery) ---------- */
  function topicLabel(k) {
    var M = { twoeyed: 'Two-Eyed Seeing', facial: 'Facial Recognition', bias: 'Algorithmic Bias', policing: 'Policing', surveillance: 'Surveillance', policy: 'Law and Policy', resistance: 'Resistance and Design Justice', intersectionality: 'Intersectionality', reconciliation: 'Reconciliation', sociology: 'Sociology', anthropology: 'Anthropology', psychology: 'Psychology', family: 'Family and Kinship', stratification: 'Stratification', socialization: 'Socialization', culture: 'Culture', learning: 'Learning', memory: 'Memory and Recall', motivation: 'Motivation', cognition: 'Cognition', development: 'Development', behaviour: 'Behaviour', behavior: 'Behaviour', identity: 'Identity', education: 'Education', conditioning: 'Conditioning', emotion: 'Emotion' };
    return M[k] || (String(k).charAt(0).toUpperCase() + String(k).slice(1));
  }
  function rgTopics() {
    var seen = {}, out = [];
    D.records.forEach(function (r) { (r.themes || []).forEach(function (t) { if (!seen[t]) { seen[t] = 1; out.push(t); } }); });
    return out.sort(function (a, b) { return topicLabel(a).localeCompare(topicLabel(b)); });
  }
  function rgList() {
    var w = state.galWeek, t = state.galTopic;
    return D.records.filter(function (r) {
      if (w != null && r.week !== w) return false;
      if (t && (r.themes || []).indexOf(t) < 0) return false;
      return true;
    }).sort(function (a, b) { return (a.week - b.week) || a.title.localeCompare(b.title); });
  }
  function rgAccessBadge(r) {
    var full = r.fulltext !== false;
    var fg = full ? '#1f7a4d' : '#B7791F', bg = full ? '#E4F0E9' : '#FCEFD2';
    return '<span style="display:inline-flex;align-items:center;gap:5px;font-size:.6875rem;font-weight:600;letter-spacing:.03em;color:' + fg + ';background:' + bg + ';padding:4px 9px;border-radius:999px">' + ic(full ? 'unlock' : 'book', 12) + (full ? 'Read online' : 'Seneca Library') + '</span>';
  }
  function rgVideoCover(r) {
    var v = r.video;
    return '<div class="rgvideo" style="position:relative;width:100%;aspect-ratio:16/9;background:#15171C;overflow:hidden">'
      + '<button onclick="SOC.playVideo(this,\'' + v.yt + '\')" aria-label="Play a talk by ' + esc(v.scholar || r.authors) + '" style="position:absolute;inset:0;width:100%;height:100%;border:none;padding:0;cursor:pointer;background:none">'
      + '<div class="vid-cover" aria-hidden="true"><span class="vid-cover-play"></span><span class="vid-cover-note">Loads only when you choose</span></div>'
      + '<span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center"><span style="display:flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:999px;background:rgba(218,41,28,.94);color:#fff;box-shadow:0 4px 16px rgba(0,0,0,.45)">' + ic('play', 24) + '</span></span>'
      + '<span style="position:absolute;left:0;right:0;bottom:0;padding:22px 13px 10px;background:linear-gradient(transparent,rgba(0,0,0,.9));color:#fff;text-align:left">'
      + '<span class="mono" style="display:block;font-size:.6rem;letter-spacing:.08em;color:#f3b0a8;font-weight:600;margin-bottom:2px">WATCH</span>'
      + '<span style="display:block;font-size:.8125rem;font-weight:700;line-height:1.2">' + esc(v.scholar || r.authors) + '</span>'
      + (v.title ? '<span style="display:block;font-size:.7rem;color:rgba(255,255,255,.8);line-height:1.3;margin-top:2px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">' + esc(v.title) + '</span>' : '')
      + '</span>'
      + '</button></div>';
  }
  function rgCard(r) {
    var tm = typeMeta(r.type);
    var topics = (r.themes || []).slice(0, 3).map(function (t) {
      var on = state.galTopic === t;
      return '<button onclick="SOC.galTopic(\'' + t + '\')" style="border:1px solid ' + (on ? '#DA291C' : '#DEE3EA') + ';background:' + (on ? '#F6E3E1' : '#F7F8FA') + ';color:' + (on ? '#DA291C' : '#474C57') + ';font-size:.6875rem;font-weight:600;padding:3px 9px;border-radius:999px;cursor:pointer">' + esc(topicLabel(t)) + '</button>';
    }).join('');
    return '<div class="rgcard" style="background:#fff;border:1px solid #DEE3EA;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(21,23,28,.06);display:flex;flex-direction:column">'
      + (r.video ? rgVideoCover(r) : '<div style="height:6px;background:' + tm.color + '"></div>')
      + '<div style="padding:16px 17px 15px;flex:1;display:flex;flex-direction:column">'
      + '<div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:10px">'
      + '<span style="display:inline-flex;align-items:center;gap:5px;background:' + tm.soft + ';color:' + tm.color + ';font-size:.6875rem;font-weight:600;padding:4px 9px;border-radius:999px">' + ic(tm.icon, 12) + esc(r.type) + '</span>'
      + rgAccessBadge(r)
      + '<span class="mono" style="font-size:.75rem;color:#6B7280;margin-left:auto">' + esc(String(r.year)) + '</span>'
      + '</div>'
      + '<h3 style="font-size:1.0625rem;line-height:1.3;font-weight:600;margin:0 0 4px;color:#15171C">' + esc(r.title) + '</h3>'
      + '<div style="font-size:.8125rem;color:#474C57;margin-bottom:9px">' + esc(r.authors) + '</div>'
      + '<p style="font-size:.84rem;line-height:1.5;color:#5a616e;margin:0 0 12px">' + esc(r.coreIdea || r.abstract) + '</p>'
      + (topics ? '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:13px">' + topics + '</div>' : '')
      + (r.assigned ? '<div style="display:flex;align-items:flex-start;gap:7px;background:#FBF3F2;border:1px solid #F1D5D2;border-radius:9px;padding:8px 11px;margin:0 0 12px"><span style="display:flex;color:var(--red);flex:none;margin-top:1px">' + ic('book', 13) + '</span><span style="font-size:.78rem;line-height:1.4;color:#15171C"><span style="font-weight:700">Read:</span> ' + esc(r.assigned) + '</span></div>' : '')
      + '<div style="margin-top:auto;display:flex;align-items:center;gap:9px">'
      + '<button onclick="SOC.read(\'' + r.id + '\')" style="flex:1;display:inline-flex;align-items:center;justify-content:center;gap:7px;background:var(--red);color:#fff;border:none;border-radius:10px;padding:11px;font-size:.875rem;font-weight:600;cursor:pointer">' + readLabel(r) + '<span style="display:flex">' + ic('external', 15) + '</span></button>'
      + '<button onclick="SOC.open(\'' + r.id + '\')" title="Details" aria-label="Open details" style="display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:10px;border:1px solid #DEE3EA;background:#fff;color:#474C57;cursor:pointer;flex:none">' + ic('chevron', 18) + '</button>'
      + '</div>'
      + sourceButton(r)
      + '<div style="margin-top:10px;display:flex;align-items:center;gap:7px">' + weekTag(r) + ((D.course && D.course.frame) ? eyePill(r) : '') + '</div>'
      + '</div></div>';
  }
  function readingsGallery() {
    var s = state, list = rgList();
    var nFull = D.records.filter(function (r) { return r.fulltext !== false; }).length;
    var nMedia = D.records.filter(function (r) { return !!(r.video || r.audio); }).length;
    var weeks = weeksWithReadings(), topics = rgTopics();
    var stats = [['Readings', D.records.length], ['Read online', nFull]];
    if (nMedia) stats.push(['Scholar media', nMedia]);
    var hero = '<section style="background:#fff;border:1px solid #DEE3EA;border-top:4px solid var(--red);border-radius:14px;padding:26px 30px;margin-bottom:18px;box-shadow:0 1px 2px rgba(21,23,28,.04)">'
      + '<div style="display:flex;align-items:flex-start;gap:24px;flex-wrap:wrap;justify-content:space-between">'
      + '<div style="flex:1;min-width:280px">'
      + '<div class="mono" style="font-size:.75rem;letter-spacing:.06em;color:var(--red);font-weight:600;margin-bottom:10px">LIBRARY OF READINGS</div>'
      + '<h1 style="font-size:2.125rem;line-height:1.14;font-weight:600;margin:0 0 10px;color:var(--ink)">Open every source online.</h1>'
      + '<p style="font-size:1rem;line-height:1.6;color:#474C57;margin:0;">Click any reading to open the full text in a new tab, watch the scholars speak, and filter the collection by week or by topic.</p></div>'
      + '<div style="display:flex;gap:10px;flex:none">'
      + stats.map(function (st) { return '<div style="background:#EEF1F5;border:1px solid #DEE3EA;border-radius:12px;padding:12px 16px;text-align:center;min-width:82px"><div class="mono" style="font-size:1.75rem;font-weight:600;line-height:1;color:var(--red)">' + st[1] + '</div><div style="font-size:.6875rem;text-transform:uppercase;letter-spacing:.06em;color:#474C57;margin-top:5px">' + st[0] + '</div></div>'; }).join('')
      + '</div></div></section>';
    function pill(active, label, onclick, accent) {
      accent = accent || '#DA291C';
      return '<button onclick="' + onclick + '" aria-pressed="' + active + '" style="flex:none;border:1px solid ' + (active ? accent : '#DEE3EA') + ';background:' + (active ? accent : '#fff') + ';color:' + (active ? '#fff' : '#474C57') + ';font-size:.8125rem;font-weight:' + (active ? '600' : '500') + ';padding:7px 13px;border-radius:999px;white-space:nowrap;cursor:pointer">' + label + '</button>';
    }
    var weekRail = '<div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px">'
      + pill(s.galWeek == null, 'All weeks', 'SOC.galWeek(null)')
      + weeks.map(function (w) { return pill(s.galWeek === w, '<span class="mono" style="opacity:.7">W' + w + '</span> ' + esc(weekTitle(w)), 'SOC.galWeek(' + w + ')'); }).join('')
      + '</div>';
    var topicRail = '<div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px">'
      + pill(s.galTopic == null, 'All topics', 'SOC.galTopic(null)', '#15171C')
      + topics.map(function (t) { return pill(s.galTopic === t, esc(topicLabel(t)), 'SOC.galTopic(\'' + t + '\')', '#15171C'); }).join('')
      + '</div>';
    var anyFilter = (s.galWeek != null) || s.galTopic;
    var filterBar = '<section style="background:#fff;border:1px solid #DEE3EA;border-radius:14px;padding:14px 16px;margin-bottom:16px;box-shadow:0 1px 2px rgba(21,23,28,.04);position:relative;z-index:1">'
      + '<div style="display:flex;align-items:center;gap:7px;margin-bottom:7px"><span style="display:flex;color:#6B7280">' + ic('calendar', 15) + '</span><span style="font-size:.7rem;font-weight:600;letter-spacing:.05em;color:#6B7280;text-transform:uppercase">Filter by week</span></div>'
      + weekRail
      + '<div style="display:flex;align-items:center;gap:7px;margin:13px 0 7px"><span style="display:flex;color:#6B7280">' + ic('sparkle', 15) + '</span><span style="font-size:.7rem;font-weight:600;letter-spacing:.05em;color:#6B7280;text-transform:uppercase">Filter by topic</span></div>'
      + topicRail
      + '<div style="display:flex;align-items:center;gap:11px;margin-top:13px;padding-top:12px;border-top:1px solid #EEF1F5"><span style="font-size:.8125rem;font-weight:500;color:#474C57">' + list.length + ' of ' + D.records.length + ' readings</span>' + (anyFilter ? '<button onclick="SOC.galClear()" style="background:none;border:none;color:var(--red);font-size:.8125rem;font-weight:600;cursor:pointer">Clear filters</button>' : '') + '</div>'
      + '</section>';
    var grid = list.length
      ? '<div class="soc-cardgrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px">' + list.map(rgCard).join('') + '</div>'
      : '<div style="text-align:center;padding:60px 20px;color:#474C57"><div style="font-size:1.0625rem;font-weight:600;color:#15171C;margin-bottom:10px">No readings match those filters.</div><button onclick="SOC.galClear()" style="background:var(--red);color:#fff;border:none;border-radius:9px;padding:10px 18px;font-size:.9375rem;font-weight:600;cursor:pointer">Clear filters</button></div>';
    return '<div class="rise">' + hero + filterBar + grid + '</div>';
  }

  /* ---------- detail ---------- */
  function detail() {
    var r = rec(state.detailId); if (!r) return library();
    var tm = typeMeta(r.type), savedOn = state.saved.indexOf(r.id) >= 0, inC = state.compareIds.indexOf(r.id) >= 0;
    var related = (r.related || []).map(function (id) {
      var rr = rec(id); if (!rr) return ''; var rtm = typeMeta(rr.type);
      var conn = rr.week === r.week ? 'Also in Week ' + rr.week : (HAS_EYE ? eyeLabel(rr) : ('Week ' + rr.week));
      return '<button onclick="SOC.open(\'' + id + '\')" class="relrow" style="display:flex;align-items:center;gap:13px;text-align:left;background:#fff;border:1px solid #DEE3EA;border-radius:12px;padding:13px 15px"><span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:9px;background:' + rtm.soft + ';color:' + rtm.color + ';flex:none">' + ic(rtm.icon, 16) + '</span><span style="flex:1;min-width:0"><span style="display:block;font-size:.9375rem;font-weight:600;color:#15171C">' + esc(rr.title) + '</span><span style="display:block;font-size:.8125rem;color:#474C57">' + esc(rr.authors) + ' · ' + esc(conn) + '</span></span><span style="display:flex;color:#C9D1DC;flex:none">' + ic('chevron', 18) + '</span></button>';
    }).join('');
    var facts = [
      [ic('calendar', 16), 'Used in', 'Week ' + r.week + ': ' + esc(weekTitle(r.week))],
      [ic('type', 16), 'Format', esc(r.type)],
      [ic('clock', 16), 'Length', esc(r.len)],
      [ic('gauge', 16), 'Level', esc(D.levels[r.diff] || '')],
      [ic('unlock', 16), 'Access', esc((D.accessLabels && D.accessLabels[r.access]) || '')],
      [ic('globe', 16), 'Origin', esc(r.origin)],
    ].map(function (f) { return '<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #EEF1F5"><span style="display:flex;color:#6B7280;flex:none">' + f[0] + '</span><span style="font-size:.8125rem;color:#474C57;flex:none;width:84px">' + f[1] + '</span><span style="font-size:.875rem;font-weight:500;color:#15171C;text-align:right;flex:1">' + f[2] + '</span></div>'; }).join('');
    var hasLink = !!readUrl(r);

    return '<div class="rise"><button onclick="SOC.back()" style="background:none;border:none;color:#474C57;font-size:.875rem;font-weight:500;padding:0 0 16px;display:inline-flex;align-items:center;gap:6px">&larr; Back to the library</button>'
      + '<div class="soc-detailgrid" style="display:grid;grid-template-columns:1fr 312px;gap:26px;align-items:start"><div>'
      + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:13px;flex-wrap:wrap"><span style="display:inline-flex;align-items:center;gap:7px;background:' + tm.soft + ';color:' + tm.color + ';font-size:.8125rem;font-weight:600;padding:5px 12px;border-radius:999px">' + ic(tm.icon, 15) + esc(r.type) + '</span>' + eyePill(r) + '<button onclick="SOC.week(' + r.week + ')" class="mono" style="font-size:.8125rem;color:#1B2A4A;background:#E6EAF1;border:none;padding:4px 10px;border-radius:999px">Week ' + r.week + '</button><span class="mono" style="font-size:.8125rem;color:#474C57">' + esc(String(r.year)) + ' · ' + esc(r.origin) + '</span></div>'
      + '<h1 style="font-size:2.125rem;line-height:1.15;font-weight:600;margin:0 0 8px">' + esc(r.title) + '</h1>'
      + '<div style="font-size:1.0625rem;color:#474C57;margin-bottom:24px">' + esc(r.authors) + '</div>'
      + '<div class="mono" style="font-size:.75rem;letter-spacing:.04em;color:#6B7280;margin-bottom:9px">ABSTRACT</div><p style="font-size:1.0625rem;line-height:1.62;color:#15171C;margin:0 0 26px;">' + esc(r.abstract) + '</p>'
      + '<div style="background:' + tm.soft + ';border-radius:14px;padding:20px 22px;margin-bottom:26px;border:1px solid ' + tm.color + '33"><div style="display:flex;align-items:center;gap:9px;margin-bottom:9px"><span style="display:flex;color:' + tm.color + '">' + ic('sparkle', 17) + '</span><span style="font-size:.8125rem;font-weight:600;color:' + tm.color + ';letter-spacing:.02em">THE CORE IDEA</span></div><p style="font-size:1.1875rem;line-height:1.5;font-weight:500;color:#15171C;margin:0">' + esc(r.coreIdea) + '</p></div>'
      + (related ? '<div class="mono" style="font-size:.75rem;letter-spacing:.04em;color:#6B7280;margin-bottom:12px">READ ALONGSIDE</div><div style="display:flex;flex-direction:column;gap:10px">' + related + '</div>' : '')
      + '</div>'
      + '<aside class="soc-rail" style="position:sticky;top:84px;display:flex;flex-direction:column;gap:14px">'
      + '<div style="background:#fff;border:1px solid #DEE3EA;border-radius:14px;padding:18px;box-shadow:0 1px 2px rgba(21,23,28,.04)">'
      + '<button onclick="SOC.read(\'' + r.id + '\')" aria-label="' + esc(readLabel(r)) + ' in a new tab" style="width:100%;background:var(--red);color:#fff;border:none;border-radius:9px;padding:13px;font-size:1rem;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:9px">' + readLabel(r) + '<span style="display:flex">' + ic('external', 16) + '</span></button>'
      + '<div style="font-size:.75rem;line-height:1.4;color:#6B7280;margin:-2px 0 9px;text-align:center">' + esc(accessNote(r)) + '</div>'
      + sourceButton(r)
      + '<button onclick="SOC.compare(\'' + r.id + '\')" style="width:100%;display:inline-flex;align-items:center;justify-content:center;gap:7px;border-radius:9px;padding:11px;font-size:.9375rem;font-weight:600;border:1px solid ' + (inC ? '#bcd0f2' : '#DEE3EA') + ';background:' + (inC ? '#E7EEFB' : '#fff') + ';color:' + (inC ? '#1552D8' : '#15171C') + '">' + ic('columns', 16) + (inC ? 'In tray' : 'Compare') + '</button>'
      + '</div>'
      + '<div style="background:#fff;border:1px solid #DEE3EA;border-radius:14px;padding:6px 18px;box-shadow:0 1px 2px rgba(21,23,28,.04)">' + facts + '</div>'
      + '</aside></div></div>';
  }

  /* ---------- compare ---------- */
  function comparePickList() {
    var list = D.records.slice().sort(function (a, b) { return a.week - b.week || (a.eye === b.eye ? 0 : a.eye === 'western' ? -1 : 1); });
    return list.map(function (r) {
      var tm = typeMeta(r.type), sel = state.compareIds.indexOf(r.id) >= 0;
      return '<button onclick="SOC.compare(\'' + r.id + '\')" class="mapsrc cmp-pick" style="display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:' + (sel ? '#E7EEFB' : 'none') + ';border:none;border-bottom:1px solid #EEF1F5;padding:10px 12px">'
        + '<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:7px;background:' + tm.soft + ';color:' + tm.color + ';flex:none">' + ic(tm.icon, 14) + '</span>'
        + '<span style="flex:1;min-width:0"><span class="cmp-pick-title" style="display:block;font-size:.8125rem;font-weight:600;color:#15171C;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(r.title) + '</span><span style="display:block;font-size:.6875rem;color:#6B7280">Week ' + r.week + (HAS_EYE ? ' · ' + (r.eye === 'indigenous' ? 'Indigenous' : 'Western') : '') + '</span></span>'
        + (sel ? '<span style="display:flex;color:#1552D8;flex:none">' + ic('check', 16, 2.2) + '</span>' : '<span style="display:flex;color:#6b7280;flex:none">' + ic('plus', 16) + '</span>') + '</button>';
    }).join('');
  }
  var LENSES = {
    thematic: { label: 'Thematic', hint: 'shared themes or topics, and how each text handles them differently', diff: 'How does each reading treat the shared topic? What does each one emphasize, include, or leave out?' },
    stylistic: { label: 'Stylistic', hint: 'tone, structure, and how each text is written', diff: 'How do their tone, structure, and word choices differ? Who does each one seem written for?' },
    contextual: { label: 'Contextual', hint: 'the history, culture, and who is speaking', diff: 'How do the authors background, time, or community shape what each one says?' },
    theoretical: { label: 'Theoretical', hint: 'a critical lens, for example power or whose knowledge counts', diff: 'Read both through one lens, for example power or whose knowledge counts. What does that lens show in each?' }
  };
  var CMP_EXAMPLE = [
    ['The subject', 'Two newspapers report the same event: a 1.5% city property tax increase.'],
    ['Article A, the Community Gazette', 'A human-interest lens. Empathetic, a little critical. Leads with retirees on fixed incomes and asks whether the council tried other cuts first.'],
    ['Article B, the Metro Financial Daily', 'An economic lens. Objective and forward-looking. Focuses on the transit and roads the revenue funds, and the long-run savings.'],
    ['Similarities', 'Both agree on the core fact, a 1.5% increase, and both treat it as controversial.'],
    ['Differences', 'The Gazette uses a local, emotional frame. The Financial Daily uses a structural, analytical one.'],
    ['The insight', 'A city makeup and its politics shape how the same policy gets framed in the press. The framing is the story behind the story.']
  ];
  function comparativeStudio(recs) {
    var lens = LENSES[state.lens] || LENSES.thematic;
    function zone(n, title, prompt, key, ph) {
      var v = esc((state.cmpNotes && state.cmpNotes[key]) || '');
      return '<div style="background:#fff;border:1px solid #DEE3EA;border-radius:12px;padding:15px 17px;margin-bottom:11px">'
        + '<div style="display:flex;align-items:baseline;gap:10px;margin-bottom:5px"><span style="display:inline-flex;width:24px;height:24px;align-items:center;justify-content:center;background:#15171C;color:#fff;border-radius:50%;font-size:.8rem;font-weight:700;flex:none">' + n + '</span><h3 style="margin:0;font-size:1.0625rem">' + title + '</h3></div>'
        + '<p style="margin:0 0 8px;font-size:.875rem;color:#474C57">' + prompt + '</p>'
        + '<textarea oninput="SOC.cmpNote(\'' + key + '\',this.value)" placeholder="' + ph + '" style="width:100%;min-height:68px;font:inherit;font-size:.9rem;line-height:1.5;padding:10px 12px;border:1px solid #DEE3EA;border-radius:8px;color:#15171C;background:#fff;resize:vertical">' + v + '</textarea></div>';
    }
    var chips = Object.keys(LENSES).map(function (k) {
      var on = state.lens === k;
      return '<button onclick="SOC.setLens(\'' + k + '\')" style="border:1px solid ' + (on ? '#15171C' : '#DEE3EA') + ';background:' + (on ? '#15171C' : '#fff') + ';color:' + (on ? '#fff' : '#15171C') + ';border-radius:999px;padding:7px 15px;font-size:.85rem;font-weight:600">' + LENSES[k].label + '</button>';
    }).join(' ');
    var ex = state.exampleOpen
      ? '<div style="background:#15171C;color:#fff;border-radius:13px;padding:16px 18px;margin-bottom:15px"><div style="display:flex;align-items:center;margin-bottom:10px"><span class="mono" style="font-size:.72rem;letter-spacing:.05em;color:#fff">A WORKED EXAMPLE</span><button onclick="SOC.toggleExample()" style="margin-left:auto;background:rgba(255,255,255,.14);border:none;border-radius:7px;color:#fff;padding:4px 10px;font-size:.78rem;font-weight:600">Hide</button></div>'
        + CMP_EXAMPLE.map(function (r) { return '<div style="margin-bottom:8px"><div class="mono" style="font-size:.6875rem;letter-spacing:.04em;color:#9aa3b2">' + esc(r[0]).toUpperCase() + '</div><div style="font-size:.875rem;line-height:1.5;color:rgba(255,255,255,.93)">' + esc(r[1]) + '</div></div>'; }).join('') + '</div>'
      : '<button onclick="SOC.toggleExample()" style="background:none;border:1px solid #DEE3EA;border-radius:9px;padding:9px 14px;font-size:.875rem;font-weight:600;color:#15171C;margin-bottom:15px">See a worked example</button>';
    var model = state.showModel
      ? '<div style="background:#15171C;color:#fff;border-radius:14px;padding:18px 20px;margin-top:12px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><span style="display:flex;color:#fff">' + ic('sparkle', 16) + '</span><span class="mono" style="font-size:.72rem;letter-spacing:.04em;color:#fff">A MODEL COMPARISON</span><button onclick="SOC.hideModel()" aria-label="Hide" style="margin-left:auto;background:rgba(255,255,255,.14);border:none;border-radius:7px;color:#fff;width:26px;height:26px">' + ic('x', 14) + '</button></div>'
        + buildSynthesis(recs).paras.map(function (p) { return '<p style="font-size:.95rem;line-height:1.6;margin:0 0 10px;color:rgba(255,255,255,.94)">' + esc(p) + '</p>'; }).join('')
        + '<p style="font-size:.82rem;margin:6px 0 0;color:#9aa3b2">One way to read it. Compare it with yours, do not copy it.</p></div>'
      : '<button onclick="SOC.revealModel()" style="background:none;border:1px solid #15171C;color:#15171C;border-radius:9px;padding:10px 16px;font-size:.9rem;font-weight:600">Reveal a model comparison</button>';
    return '<div class="cmp-studio" style="margin-bottom:18px">'
      + '<h2 style="font-size:1.25rem;margin:0 0 4px">Compare them</h2>'
      + '<p style="font-size:.9375rem;color:#474C57;margin:0 0 14px;">Comparative reading goes past what each text says on its own. Read the two together and look for what they share, how they differ, and why those differences matter.</p>'
      + ex
      + '<div style="font-size:.8125rem;font-weight:600;color:#15171C;margin-bottom:7px">Read them through a lens</div>'
      + '<div style="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:6px">' + chips + '</div>'
      + '<p style="font-size:.82rem;color:#6B7280;margin:0 0 16px">' + esc(lens.label) + ': ' + esc(lens.hint) + '.</p>'
      + zone('1', 'Similarities', 'What do these readings share? Where do they agree, in facts, topic, or the same idea?', 'sim', 'They both...')
      + zone('2', 'Differences', esc(lens.diff), 'diff', 'The first... while the second...')
      + zone('3', 'Why the differences matter', 'Finish the thought: these differences matter because...', 'ins', 'These differences matter because...')
      + '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:4px"><button onclick="SOC.saveComparison()" style="background:var(--red);border:none;color:#fff;border-radius:9px;padding:10px 18px;font-size:.9rem;font-weight:600">Save my comparison</button>' + (state.showModel ? '' : model) + '</div>'
      + (state.showModel ? model : '')
      + '</div>';
  }
  var RC_QUESTIONS = {
    thematic: ['What is the main idea or argument of this reading? Put it in one sentence.', 'What evidence or examples does the author use to support it?', 'What is the author really saying about the larger topic or theme?', 'How does this reading change or add to how you understand the topic?'],
    stylistic: ['What is the author tone (for example plain, urgent, careful, personal)?', 'How is the reading organized, and how does that shape its argument?', 'Which words, images, or moments stood out, and what effect did they have?', 'Who does the writing seem to be for?'],
    contextual: ['Who wrote this, and from what background or position?', 'How might the time, place, or community shape what the author says?', 'Whose perspective is centred here, and whose is missing?', 'What would someone need to know about the context to read this fairly?'],
    theoretical: ['Read this through one lens, for example power, or whose knowledge counts. What does that lens reveal?', 'Who benefits from the way this is framed, and who is left out?', 'What does the author assume that a critical reader should question?', 'What would change if you read it through a different lens?']
  };
  var RC_GUIDANCE = {
    thematic: [
      ['States the single main idea in one clear sentence, in your own words.', 'Names the central claim the author argues, not just the topics covered.', 'Is specific enough that a reader could tell which reading it came from.'],
      ['Points to specific evidence the author uses (a study, example, case, or text), not just that evidence exists.', 'Shows HOW that evidence supports the claim, not only that it is there.', 'Separates the author\'s strongest support from a minor or passing example.'],
      ['Moves past the surface topic to the deeper claim the author makes about it.', 'Names what the author wants you to think or do differently.', 'Connects the reading to the wider course theme it speaks to.'],
      ['Names something specific that shifted, was added to, or was challenged in your thinking.', 'Explains why that change matters, not just that it happened.', 'Is honest about what still feels unclear or unresolved.']
    ],
    stylistic: [
      ['Names the tone in a word or two (for example plain, urgent, careful, personal).', 'Points to a specific line or moment where you felt that tone.', 'Says what the tone does to you as a reader (draws you in, warns, reassures).'],
      ['Describes the structure (for example story then analysis, problem then solution, a list of cases).', 'Links that structure to how the argument builds or lands.', 'Notes one place where the order of the ideas matters.'],
      ['Picks one specific word, image, phrase, or moment, not a general impression.', 'Describes the effect it had on you as a reader.', 'Says why the author might have chosen it.'],
      ['Names the likely audience (students, scholars, the public, a community).', 'Points to what in the writing signals who it is for (vocabulary, references, assumptions).', 'Considers who is not addressed.']
    ],
    contextual: [
      ['Identifies the author and the position or background they write from.', 'Notes how that position might shape what they notice or value.', 'Stays within what the reading or its context actually tells you, without guessing.'],
      ['Ties the time, place, or community to a specific choice the author makes.', 'Shows how the same idea might read differently in another context.', 'Treats context as shaping the argument, not just decorating it.'],
      ['Names whose perspective is centred in the reading.', 'Names a perspective that is absent or mentioned only in passing.', 'Gives a reason that absence matters for the argument.'],
      ['Names the specific background a fair reader needs, not just that context matters.', 'Separates what the reading assumes you know from what it explains.', 'Considers how a reader without that background might misread it.']
    ],
    theoretical: [
      ['Picks one clear lens (for example power, gender, colonialism, whose knowledge counts).', 'Says what that lens makes visible in this specific reading.', 'Uses the lens to read the text, not just to label it.'],
      ['Names who benefits from the way the reading frames the issue.', 'Names who is disadvantaged, ignored, or carries the cost.', 'Ties the benefit or harm to a specific part of the text.'],
      ['Identifies an assumption the author treats as given.', 'Explains why a critical reader should question it.', 'Considers what changes if that assumption does not hold.'],
      ['Names a second, different lens.', 'Shows how the reading would look different through it.', 'Says what each lens catches that the other misses.']
    ]
  };
  function rcChips() {
    return Object.keys(LENSES).map(function (k) {
      var on = state.lens === k;
      return '<button onclick="SOC.setLens(\'' + k + '\')" style="border:1px solid ' + (on ? '#15171C' : '#DEE3EA') + ';background:' + (on ? '#15171C' : '#fff') + ';color:' + (on ? '#fff' : '#15171C') + ';border-radius:999px;padding:7px 15px;font-size:.85rem;font-weight:600">' + LENSES[k].label + '</button>';
    }).join(' ');
  }
  function numList(arr) { if (!arr.length) return ''; if (arr.length === 1) return 'question ' + arr[0]; if (arr.length === 2) return 'questions ' + arr[0] + ' and ' + arr[1]; return 'questions ' + arr.slice(0, -1).join(', ') + ', and ' + arr[arr.length - 1]; }
  function listJoin(arr) { if (!arr.length) return ''; if (arr.length === 1) return arr[0]; if (arr.length === 2) return arr[0] + ' and ' + arr[1]; return arr.slice(0, -1).join(', ') + ', and ' + arr[arr.length - 1]; }
  var RC_SKILLS = { argument: 'the main argument', concepts: 'the key concepts', context: 'the context and who is speaking', significance: 'why the reading matters' };
  var RC_SKILL_ORDER = ['argument', 'concepts', 'context', 'significance'];
  function rcSkillProfile(rid, items) {
    var stat = {};
    items.forEach(function (m, mi) { var sk = m.skill; if (!sk) return; var sel = state.mcSel[rid + '|mc|' + mi]; if (sel === undefined || sel === null) return; if (!stat[sk]) stat[sk] = { right: 0, total: 0, whys: [] }; stat[sk].total++; if (sel === m.answer) stat[sk].right++; else if (m.why) stat[sk].whys.push(m.why); });
    var strengths = [], opps = [];
    RC_SKILL_ORDER.forEach(function (sk) { var s = stat[sk]; if (!s) return; if (s.right === s.total) strengths.push(RC_SKILLS[sk]); else opps.push({ key: sk, label: RC_SKILLS[sk], whys: s.whys }); });
    return { strengths: strengths, opps: opps, has: (strengths.length + opps.length) > 0 };
  }
  function lcFirst(s) { s = String(s == null ? '' : s); return s.charAt(0).toLowerCase() + s.slice(1); }
  function ucFirst(s) { s = String(s == null ? '' : s); return s.charAt(0).toUpperCase() + s.slice(1); }
  function rcBand(correct, total) {
    if (correct === total) return { label: 'Strong grasp', color: '#2c6b3f', bg: '#E9EFE7', icon: 'check', msg: 'You have a strong hold on this reading across every kind of question. The read-out below shows what came through.' };
    var pct = correct / total;
    if (pct >= 0.6) return { label: 'On your way', color: '#1552D8', bg: '#E7EEFB', icon: 'book', msg: 'You have the core of this reading. The read-out below shows where you are strong and where to look again.' };
    if (pct >= 0.4) return { label: 'Building', color: '#8F5E0F', bg: '#F3ECE0', icon: 'book', msg: 'You are part way into this reading. The read-out below shows what is landing and what to firm up.' };
    return { label: 'Worth another read', color: '#b23121', bg: '#FBE9E7', icon: 'book', msg: 'This reading has not fully landed yet. The read-out below shows exactly where to focus your next pass.' };
  }
  function readingComp() {
    var practiceNote = '<div style="display:flex;align-items:flex-start;gap:9px;background:#EEF1F5;border:1px solid #DEE3EA;border-radius:10px;padding:11px 14px;margin:0 0 16px;font-size:.85rem;line-height:1.5;color:#474C57"><span style="display:flex;color:#6B7280;flex:none;margin-top:1px">' + ic('book', 16) + '</span><span>This is a private space for practice and self-study. Nothing here is graded, recorded, or counted toward a mark. It is here to help you check your own understanding and see where to focus.</span></div>';
    var r = state.rcReading ? rec(state.rcReading) : null;
    if (!r) {
      var picks = D.records.map(function (rd) {
        var tm = typeMeta(rd.type);
        return '<button onclick="SOC.rcPick(\'' + rd.id + '\')" style="display:flex;align-items:center;gap:11px;width:100%;text-align:left;background:#fff;border:1px solid #DEE3EA;border-radius:10px;padding:12px 14px;margin-bottom:8px;color:#15171C"><span style="width:9px;height:9px;border-radius:50%;background:' + tm.color + ';flex:none"></span><span style="flex:1;min-width:0"><span style="display:block;font-weight:600;font-size:.95rem">' + esc(rd.title) + '</span><span style="font-size:.8125rem;color:#474C57">Week ' + rd.week + ' · ' + esc(rd.authors) + '</span></span><span style="color:#6B7280">' + ic('book', 16) + '</span></button>';
      }).join('');
      return '<div class="rise"><h1 style="font-size:1.75rem;margin:0 0 6px">Build Your Reading Comprehension</h1><p class="lede" style="margin:0 0 18px">Pick one reading. You will work through questions that build your understanding of it. Switch the lens to change the kind of questions you answer. Your answers save to your notes.</p>' + practiceNote + picks + '</div>';
    }
    var lens = LENSES[state.lens] || LENSES.thematic;
    var qs = RC_QUESTIONS[state.lens] || RC_QUESTIONS.thematic;
    var guide = RC_GUIDANCE[state.lens] || RC_GUIDANCE.thematic;
    var zones = qs.map(function (q, i) {
      var key = r.id + '|' + state.lens + '|' + i;
      var v = esc((state.rcNotes && state.rcNotes[key]) || '');
      var coreIdea = (i === 0 && r.coreIdea) ? esc(String(r.coreIdea).replace(/\s*\.?\s*$/, '')) + '.' : '';
      var crit = guide[i] || [];
      var rev = state.revealed[key]
        ? '<div style="margin-top:10px;background:#15171C;color:#fff;border-radius:10px;padding:13px 16px"><div class="mono" style="font-size:.66rem;letter-spacing:.05em;color:#9aa3b2;margin-bottom:8px">A STRONG RESPONSE COVERS</div><ul style="margin:0;padding-left:17px;font-size:.875rem;line-height:1.55;color:rgba(255,255,255,.93)">' + crit.map(function (c) { return '<li style="margin-bottom:5px">' + esc(c) + '</li>'; }).join('') + '</ul>' + (coreIdea ? '<div style="margin-top:11px;padding-top:10px;border-top:1px solid rgba(255,255,255,.16);font-size:.85rem;line-height:1.5;color:rgba(255,255,255,.9)"><span style="color:#F2A900;font-weight:600">From this reading: </span>the central idea is ' + coreIdea + '</div>' : '') + '<div style="margin-top:11px;font-size:.78rem;color:#9aa3b2">Compare your answer against this. There is no single right wording.</div><button onclick="SOC.rcReveal(\'' + key + '\')" style="margin-top:9px;background:rgba(255,255,255,.14);border:none;color:#fff;border-radius:7px;padding:5px 11px;font-size:.78rem;font-weight:600">Hide</button></div>'
        : '<button onclick="SOC.rcReveal(\'' + key + '\')" style="margin-top:10px;background:none;border:1px solid #DEE3EA;border-radius:8px;padding:7px 13px;font-size:.82rem;font-weight:600;color:#15171C">Reveal a strong response</button>';
      return '<div style="background:#fff;border:1px solid #DEE3EA;border-radius:12px;padding:15px 17px;margin-bottom:11px"><div style="display:flex;align-items:baseline;gap:10px;margin-bottom:7px"><span style="display:inline-flex;width:24px;height:24px;align-items:center;justify-content:center;background:#15171C;color:#fff;border-radius:50%;font-size:.8rem;font-weight:700;flex:none">' + (i + 1) + '</span><p style="margin:0;font-size:.95rem;color:#15171C">' + esc(q) + '</p></div><textarea oninput="SOC.rcNote(\'' + key + '\',this.value)" placeholder="Your answer" style="width:100%;min-height:68px;font:inherit;font-size:.9rem;line-height:1.5;padding:10px 12px;border:1px solid #DEE3EA;border-radius:8px;color:#15171C;background:#fff;resize:vertical">' + v + '</textarea>' + rev + '</div>';
    }).join('');
    var mcItems = MC[r.id] || [];
    var mcHtml = '';
    if (mcItems.length) {
      var answered = 0, correct = 0, missed = [];
      var rows = mcItems.map(function (m, mi) {
        var mkey = r.id + '|mc|' + mi;
        var sel = state.mcSel[mkey];
        var done = (sel !== undefined && sel !== null);
        if (done) { answered++; if (sel === m.answer) correct++; else missed.push(mi + 1); }
        var opts = (m.options || []).map(function (o, oi) {
          var isSel = (sel === oi), isCor = (oi === m.answer);
          var bg = '#fff', bd = '#DEE3EA', col = '#15171C';
          if (done && isCor) { bg = '#E9EFE7'; bd = '#50694C'; col = '#2c3b29'; }
          else if (done && isSel) { bg = '#F6E3E1'; bd = '#DA291C'; col = '#8f1b12'; }
          var mark = (done && isCor) ? ' &#10003;' : ((done && isSel) ? ' &#10007;' : '');
          return '<button onclick="SOC.mcPick(\'' + mkey + '\',' + oi + ')" style="display:block;width:100%;text-align:left;border:1px solid ' + bd + ';background:' + bg + ';color:' + col + ';border-radius:8px;padding:9px 12px;margin-bottom:7px;font-size:.9rem;font-weight:500">' + esc(o) + mark + '</button>';
        }).join('');
        var ok = (sel === m.answer);
        var why = done ? '<div style="margin:9px 0 0;padding:10px 13px;border-radius:9px;background:' + (ok ? '#E9EFE7' : '#FBE9E7') + ';border:1px solid ' + (ok ? '#9CC4A8' : '#E5A9A2') + '"><span style="display:inline-flex;align-items:center;gap:6px;font-weight:700;font-size:.9rem;color:' + (ok ? '#2c6b3f' : '#b23121') + '">' + (ok ? ic('check', 15, 2.4) + 'Correct' : ic('x', 15, 2.4) + 'Not quite') + '</span><div style="margin-top:4px;font-size:.85rem;line-height:1.5;color:#474C57">' + esc(m.why || '') + '</div></div>' : '';
        return '<div style="background:#fff;border:1px solid #DEE3EA;border-radius:12px;padding:15px 17px;margin-bottom:11px"><p style="margin:0 0 9px;font-size:.95rem;font-weight:600;color:#15171C">' + (mi + 1) + '. ' + esc(m.q) + '</p>' + opts + why + '</div>';
      }).join('');
      var total = mcItems.length, pct = Math.round(100 * correct / total);
      var score = '<div style="margin:2px 0 16px;max-width:460px">'
        + '<div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:6px"><span style="font-size:.9rem;font-weight:700;color:#15171C">' + (answered ? 'You got ' + correct + ' of ' + total : 'Answer to fill the meter') + '</span><span style="font-size:.78rem;color:#6B7280">' + answered + ' of ' + total + ' answered</span></div>'
        + '<div style="height:11px;background:#EEF1F5;border-radius:999px;overflow:hidden"><div style="height:100%;width:' + pct + '%;background:linear-gradient(90deg,#50694C,#74a878);border-radius:999px;transition:width .35s ease"></div></div>'
        + (answered ? '' : '<p style="font-size:.8rem;color:#6B7280;margin:8px 0 0">Pick an answer to check it right away. You can change your choice.</p>') + '</div>';
      var band = (answered === total && total) ? rcBand(correct, total) : null;
      var pctLabel = band ? Math.round(100 * correct / total) + '%' : '';
      var diagLine = '';
      if (band) {
        var prof = rcSkillProfile(r.id, mcItems);
        if (prof.has) {
          if (prof.strengths.length) { var coreBit = (prof.strengths.indexOf(RC_SKILLS.argument) >= 0 && r.coreIdea) ? ' You have the central point, that ' + lcFirst(esc(String(r.coreIdea).replace(/\s*\.?\s*$/, ''))) + '.' : ''; diagLine += '<div style="margin-top:12px"><span class="mono" style="font-size:.66rem;letter-spacing:.05em;color:#2c6b3f">YOUR STRENGTHS</span><div style="font-size:.9rem;line-height:1.5;color:#15171C;margin-top:3px">Your answers show you read ' + listJoin(prof.strengths) + ' well.' + coreBit + '</div></div>'; }
          if (prof.opps.length) { var oppRows = prof.opps.map(function (o) { return '<div style="margin-top:7px"><span style="font-weight:600;color:#15171C">' + ucFirst(o.label) + '.</span> <span style="color:#474C57">' + (o.whys.length ? esc(o.whys.join(' ')) : 'Go back to this in the reading and read for it directly.') + '</span></div>'; }).join(''); diagLine += '<div style="margin-top:12px"><span class="mono" style="font-size:.66rem;letter-spacing:.05em;color:#8F5E0F">AREAS OF OPPORTUNITY</span><div style="font-size:.875rem;line-height:1.5;color:#15171C;margin-top:1px">' + oppRows + '</div></div>'; }
          else diagLine += '<div style="margin-top:10px;font-size:.85rem;color:#2c6b3f">No gaps stood out. You handled the argument, the concepts, the context, and the significance, all of it.</div>';
        } else {
          diagLine = (missed.length) ? '<p style="margin:7px 0 0;font-size:.9rem;line-height:1.5;color:#15171C"><span style="font-weight:600">Look again at ' + numList(missed) + '.</span> Those are the ideas to firm up before you move on.</p>' : '<p style="margin:7px 0 0;font-size:.9rem;color:#15171C"><span style="font-weight:600">You answered every question correctly.</span> Nothing to revisit here.</p>';
        }
      }
      var bandHtml = band ? '<div style="margin:18px 0 4px;background:' + band.bg + ';border:1.5px solid ' + band.color + ';border-radius:13px;padding:17px 19px">'
        + '<div class="mono" style="font-size:.68rem;letter-spacing:.06em;color:' + band.color + ';margin-bottom:7px">WHERE YOU ARE IN THIS READING</div>'
        + '<div style="display:flex;align-items:center;gap:11px;flex-wrap:wrap"><span style="display:flex;color:' + band.color + '">' + ic(band.icon, 24, 2.2) + '</span><span style="font-size:1.35rem;font-weight:700;color:' + band.color + '">' + band.label + '</span><span style="margin-left:auto;text-align:right"><span style="display:block;font-size:1.05rem;font-weight:700;color:' + band.color + '">' + correct + ' of ' + total + '</span><span style="font-size:.72rem;color:#474C57">correct (' + pctLabel + ')</span></span></div>'
        + '<div style="height:8px;background:#fff;border-radius:999px;overflow:hidden;margin:11px 0 2px"><div style="height:100%;width:' + Math.round(100 * correct / total) + '%;background:' + band.color + ';border-radius:999px"></div></div>'
        + '<p style="margin:11px 0 0;font-size:.92rem;line-height:1.55;color:#15171C">' + band.msg + '</p>'
        + diagLine
        + '<div style="margin-top:14px;display:flex;gap:9px;flex-wrap:wrap"><button onclick="SOC.read(\'' + r.id + '\')" style="background:' + band.color + ';border:none;color:#fff;border-radius:9px;padding:8px 15px;font-size:.875rem;font-weight:600">' + readLabel(r) + ' &#8599;</button><button onclick="SOC.mcReset(\'' + r.id + '\')" style="background:#fff;border:1px solid ' + band.color + ';color:' + band.color + ';border-radius:9px;padding:8px 15px;font-size:.875rem;font-weight:600">Try these questions again</button></div></div>' : '';
      mcHtml = '<div style="margin:24px 0 4px"><h2 style="font-size:1.15rem;margin:0 0 3px">Check your understanding</h2><p style="font-size:.85rem;color:#6B7280;margin:0 0 12px">Quick questions on this reading, with the answer right away.</p>' + score + rows + bandHtml + '</div>';
    }
    return '<div class="rise"><div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:4px"><h1 style="font-size:1.5rem;margin:0">Build Your Reading Comprehension</h1><button onclick="SOC.rcClear()" style="margin-left:auto;background:none;border:none;color:var(--red);font-size:.875rem;font-weight:600">Choose a different reading</button></div>'
      + practiceNote
      + '<div style="background:#15171C;color:#fff;border-radius:12px;padding:15px 18px;margin:8px 0 16px"><div class="mono" style="font-size:.6875rem;letter-spacing:.04em;color:#9aa3b2;margin-bottom:3px">YOUR READING</div><div style="font-size:1.0625rem;font-weight:600">' + esc(r.title) + '</div><div style="font-size:.875rem;color:rgba(255,255,255,.85)">Week ' + r.week + ' · ' + esc(r.authors) + ' · ' + esc(r.year) + '</div><button onclick="SOC.read(\'' + r.id + '\')" style="margin-top:10px;background:rgba(255,255,255,.14);border:none;color:#fff;border-radius:7px;padding:7px 13px;font-size:.85rem;font-weight:600">' + readLabel(r) + ' ↗</button></div>'
      + '<div style="font-size:.8125rem;font-weight:600;color:#15171C;margin-bottom:7px">Choose a lens (this changes the questions)</div><div style="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:6px">' + rcChips() + '</div><p style="font-size:.82rem;color:#6B7280;margin:0 0 16px">' + esc(lens.label) + ': ' + esc(lens.hint) + '.</p>'
      + zones
      + mcHtml
      + '<button onclick="SOC.saveReadingNotes()" style="background:var(--red);border:none;color:#fff;border-radius:9px;padding:10px 18px;font-size:.9rem;font-weight:600;margin-top:8px">Save my notes</button></div>';
  }
  function compare() {
    var recs = state.compareIds.map(rec).filter(Boolean);
    var html = '<div class="rise cmp-page"><div style="display:flex;align-items:baseline;gap:12px;margin-bottom:6px;flex-wrap:wrap"><h1 style="font-size:1.75rem;font-weight:600;margin:0">Hold them side by side</h1><span style="font-size:.9375rem;color:#474C57">' + (recs.length ? recs.length + ' of 3 selected' : 'choose 2 or 3') + '</span>'
      + (recs.length ? '<button onclick="SOC.clearCompare()" style="margin-left:auto;background:none;border:none;color:var(--red);font-size:.875rem;font-weight:600">Clear all</button>' : '') + '</div>'
      + '<p style="font-size:.9375rem;color:#474C57;margin:0 0 22px;">Choose up to three readings from the picker. They appear together so you can compare what they share, where they differ, and why the difference matters.</p>';

    var left;
    if (recs.length >= 1) {
      var cols = recs.map(function (r) {
        var tm = typeMeta(r.type);
        var rows = [['WEEK', 'Week ' + r.week + ': ' + weekTitle(r.week)], ['YEAR', String(r.year)], ['ORIGIN', r.origin], ['LENGTH', r.len], ['LEVEL', D.levels[r.diff] || ''], ['THE CORE IDEA', r.coreIdea]]
          .map(function (row) { return '<div style="padding:11px 17px;border-top:1px solid #EEF1F5"><div class="mono" style="font-size:.625rem;letter-spacing:.05em;color:#6B7280;margin-bottom:4px">' + row[0] + '</div><div style="font-size:.875rem;line-height:1.45;color:#15171C">' + esc(row[1]) + '</div></div>'; }).join('');
        return '<div class="cmp-card" style="flex:none;width:280px;background:#fff;border:1px solid #DEE3EA;border-radius:14px;overflow:hidden;box-shadow:0 1px 2px rgba(21,23,28,.04);display:flex;flex-direction:column"><div style="height:5px;background:' + tm.color + '"></div><div style="padding:16px 17px 14px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:11px"><span style="display:inline-flex;align-items:center;gap:6px;background:' + tm.soft + ';color:' + tm.color + ';font-size:.6875rem;font-weight:600;padding:4px 9px;border-radius:999px">' + ic(tm.icon, 13) + esc(r.type) + '</span><button onclick="SOC.compare(\'' + r.id + '\')" class="removebtn" aria-label="Remove" style="margin-left:auto;background:none;border:none;color:#6b7280;display:flex;padding:6px">' + ic('x', 16) + '</button></div><button onclick="SOC.open(\'' + r.id + '\')" style="text-align:left;background:none;border:none;padding:0;display:block;margin-bottom:4px"><h3 style="font-size:1.0625rem;line-height:1.3;font-weight:600;margin:0;color:#15171C">' + esc(r.title) + '</h3></button><div style="font-size:.8125rem;color:#474C57">' + esc(r.authors) + '</div></div>' + rows + '</div>';
      }).join('');
      var hint = recs.length < 2 ? '<p style="font-size:.875rem;color:#6B7280;margin:0 0 12px">Pick one more reading on the right to compare it against this one.</p>' : '';
      var synthBlock = '';
      if (recs.length >= 2) {
        if (state.showSynthesis) {
          var syn = buildSynthesis(recs);
          synthBlock = '<div style="background:#15171C;color:#fff;border-radius:14px;padding:20px 22px;margin-bottom:18px">'
            + '<div style="display:flex;align-items:center;gap:9px;margin-bottom:12px"><span style="display:flex;color:#fff">' + ic('sparkle', 17) + '</span><span class="mono" style="font-size:.75rem;letter-spacing:.04em;color:#fff">HOW THESE CONNECT</span><button onclick="SOC.hideSynthesis()" aria-label="Hide" style="margin-left:auto;background:rgba(255,255,255,.12);border:none;border-radius:7px;color:#fff;width:26px;height:26px;display:flex;align-items:center;justify-content:center">' + ic('x', 15) + '</button></div>'
            + '<div id="syn-body">' + syn.paras.map(function (p) { return '<p style="font-size:1rem;line-height:1.6;margin:0 0 12px;color:rgba(255,255,255,.92)">' + esc(p) + '</p>'; }).join('') + '</div>'
            + '<div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:6px;border-top:1px solid rgba(255,255,255,.14);padding-top:14px">'
            + '<button type="button" onclick="SOC.synCopy()" style="border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.12);color:#fff;border-radius:8px;font-size:.85rem;font-weight:600;padding:8px 14px;cursor:pointer">Copy</button>'
            + '<button type="button" onclick="SOC.synPrint()" style="border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.12);color:#fff;border-radius:8px;font-size:.85rem;font-weight:600;padding:8px 14px;cursor:pointer">Print</button>'
            + '<button type="button" onclick="SOC.synSave()" style="border:1px solid rgba(255,255,255,.35);background:#fff;color:#15171C;border-radius:8px;font-size:.85rem;font-weight:600;padding:8px 14px;cursor:pointer">Save to my notes</button>'
            + '</div>'
            + (state.cmpNotes && state.cmpNotes['saved-synthesis'] ? '<div style="margin-top:10px;font-size:.78rem;color:rgba(255,255,255,.7)">Saved to your notes. Find it under Compare Readings notes, or copy or print it above.</div>' : '')
            + '</div>';
        } else {
          synthBlock = '<button class="cmp-model" onclick="SOC.synthesize()" style="display:inline-flex;align-items:center;gap:8px;border:none;border-radius:9px;padding:12px 22px;font-size:1rem;font-weight:600;color:#fff;background:#15171C;margin-bottom:18px">' + ic('sparkle', 16) + 'Synthesize their relationship</button>';
        }
      }
      left = hint + synthBlock + '<div class="hshelf cmp-shelf" style="display:flex;gap:16px;align-items:stretch;overflow-x:auto;padding-bottom:10px">' + cols + '</div>';
    } else {
      left = '<div class="cmp-empty" style="background:#fff;border:1px dashed #DEE3EA;border-radius:14px;padding:48px 26px;text-align:center;color:#474C57"><div style="display:inline-flex;color:#C9D1DC;margin-bottom:12px">' + ic('columns', 40, 1.4) + '</div><div style="font-size:1.0625rem;font-weight:600;color:#15171C;margin-bottom:6px">Nothing selected yet.</div><p style="font-size:.9375rem;margin:0">Choose two or three readings from the picker.</p></div>';
    }

    var right = '<aside class="soc-rail cmp-picker" style="position:sticky;top:84px">'
      + '<div class="soc-pickbox" style="background:#fff;border:1px solid #DEE3EA;border-radius:14px;overflow:hidden;box-shadow:0 1px 2px rgba(21,23,28,.04);display:flex;flex-direction:column;max-height:calc(100vh - 110px)">'
      + '<div style="padding:13px 14px;border-bottom:1px solid #EEF1F5;flex:none"><div style="font-size:.9375rem;font-weight:600;color:#15171C">Readings</div><div style="font-size:.75rem;color:#6B7280;margin-top:2px">' + recs.length + ' of 3 selected. Tap to add or remove.</div></div>'
      + '<div class="scrollarea" style="overflow:auto">' + comparePickList() + '</div>'
      + '</div></aside>';

    html += '<div class="soc-detailgrid cmp-layout" style="display:grid;grid-template-columns:1fr 300px;gap:26px;align-items:start"><div class="cmp-selected">' + left + '</div>' + right + '</div>';
    return html + '</div>';
  }

  /* ---------- glossary & thinkers + self-check (course concepts) ---------- */
  function conceptsForWeek(w) { return (D.glossary || []).filter(function (g) { return g.week === w; }); }
  function thinkersForWeek(w) { return D.records.filter(function (r) { return r.week === w && r.authors.indexOf('OpenStax') < 0; }); }

  function glossaryByWeek(sel) {
    var weeks = (sel === 'all' || sel == null) ? weeksWithReadings() : [parseInt(sel, 10)];
    return weeks.map(function (w) {
      var cons = conceptsForWeek(w).map(function (g) {
        return '<div style="margin:12px 0"><div style="font-size:.9375rem;font-weight:600;color:#15171C">' + esc(g.term) + '</div><div style="font-size:.875rem;line-height:1.55;color:#474C57;margin-top:3px">' + esc(g.def) + '</div>' + (g.cite ? '<div style="font-size:.75rem;color:#6B7280;border-left:3px solid #DEE3EA;padding-left:10px;margin-top:7px">' + esc(g.cite) + '</div>' : '') + '</div>';
      }).join('');
      var thinks = thinkersForWeek(w);
      var tk = thinks.length ? '<div class="mono" style="font-size:.6875rem;letter-spacing:.04em;color:#6B7280;margin:14px 0 5px">SCHOLARS THIS WEEK</div>' + thinks.map(function (r) {
        return '<div style="margin:5px 0;font-size:.8125rem;color:#15171C;line-height:1.5">' + eyePill(r) + ' <button onclick="SOC.open(\'' + r.id + '\')" style="background:none;border:none;padding:0;color:#1552D8;font-weight:600;cursor:pointer">' + esc(r.authors) + '</button>. ' + esc(r.coreIdea) + '</div>';
      }).join('') : '';
      return '<div style="border:1px solid #DEE3EA;border-radius:12px;padding:10px 16px 15px;margin-bottom:14px;background:#fff"><div class="mono" style="font-size:.6875rem;letter-spacing:.04em;color:#1B2A4A;margin:6px 0 2px">WEEK ' + w + ' &middot; ' + esc(weekTitle(w)) + '</div>' + (cons || '<p style="color:#6B7280;font-size:.875rem">No concepts listed.</p>') + tk + '</div>';
    }).join('');
  }
  function glossarySearchHTML(q) {
    q = (q || '').toLowerCase().trim(); if (!q) return '';
    var hits = (D.glossary || []).filter(function (g) { return (g.term + ' ' + g.def).toLowerCase().indexOf(q) >= 0; });
    if (!hits.length) return '<p style="color:#6B7280;font-size:.875rem">No matches. Try another word.</p>';
    return '<div class="soc-cardgrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">' + hits.map(function (g) {
      return '<div style="background:#fff;border:1px solid #DEE3EA;border-radius:12px;padding:14px 16px"><div style="font-size:.9375rem;font-weight:600;color:#15171C">' + esc(g.term) + '</div><div style="font-size:.8125rem;line-height:1.55;color:#474C57;margin:4px 0 8px">' + esc(g.def) + '</div>' + (g.cite ? '<div style="font-size:.7rem;color:#6B7280;margin-bottom:8px">' + esc(g.cite) + '</div>' : '') + '<button onclick="SOC.glossWeekGo(' + g.week + ')" class="mono" style="font-size:.6875rem;color:#1B2A4A;background:#E6EAF1;border:none;padding:3px 8px;border-radius:6px;cursor:pointer">Week ' + g.week + '</button></div>';
    }).join('') + '</div>';
  }
  function glossaryScreen() {
    var sel = state.glossWeek;
    var weekOpts = '<option value="all"' + (sel === 'all' ? ' selected' : '') + '>All weeks</option>' + weeksWithReadings().map(function (w) { return '<option value="' + w + '"' + (String(w) === String(sel) ? ' selected' : '') + '>Week ' + w + ': ' + esc(weekTitle(w)) + '</option>'; }).join('');
    return '<div class="rise">'
      + '<div class="mono" style="font-size:.75rem;letter-spacing:.06em;color:#6B7280;margin-bottom:8px">REFERENCE</div>'
      + '<h1 style="font-size:1.75rem;font-weight:600;margin:0 0 8px">Glossary and Thinkers</h1>'
      + '<p style="font-size:.9375rem;color:#474C57;margin:0 0 18px;">The course concepts in plain words, week by week, and the scholars behind the readings.</p>'
      + '<label for="soc-gsearch" style="font-size:.8125rem;font-weight:600;color:#474C57;display:block;margin-bottom:6px">Search every concept</label>'
      + '<input id="soc-gsearch" oninput="SOC.glossSearch(this.value)" value="' + esc(state.glossSearch) + '" placeholder="Type a concept, for example: ways of knowing" autocomplete="off" style="width:100%;max-width:460px;padding:10px 13px;border:1px solid #DEE3EA;border-radius:9px;background:#fff;font-size:.9375rem;color:#15171C" />'
      + '<div id="soc-gsearchout" style="margin-top:12px">' + glossarySearchHTML(state.glossSearch) + '</div>'
      + '<label for="soc-gweek" style="font-size:.8125rem;font-weight:600;color:#474C57;display:block;margin:18px 0 6px">Or browse by week</label>'
      + '<select id="soc-gweek" onchange="SOC.glossWeek(this.value)" style="max-width:440px;padding:9px 12px;border:1px solid #DEE3EA;border-radius:9px;background:#fff;font-size:.9375rem;color:#15171C">' + weekOpts + '</select>'
      + '<div id="soc-gout" style="margin-top:16px">' + glossaryByWeek(sel) + '</div>'
      + '</div>';
  }

  function card(g) {
    return '<button class="flip" onclick="SOC.flip(this)" aria-label="Self-check: ' + esc(g.term) + '. Activate to reveal the definition.">'
      + '<span class="flip-inner">'
      + '<span class="flip-face flip-front">'
      + '<span style="display:flex;align-items:center;gap:8px;margin-bottom:11px"><span class="mono" style="font-size:.6875rem;color:#6B7280;margin-left:auto">WEEK ' + g.week + '</span></span>'
      + '<span class="mono" style="font-size:.6875rem;letter-spacing:.05em;color:#1B2A4A;margin-bottom:6px">RECALL</span>'
      + '<span style="font-size:1.0625rem;font-weight:600;line-height:1.3;color:#15171C">' + esc(g.term) + '</span>'
      + '<span style="margin-top:auto;padding-top:14px;font-size:.8125rem;color:#1552D8;font-weight:600">Reveal the definition &rarr;</span>'
      + '</span>'
      + '<span class="flip-face flip-back">'
      + '<span class="mono" style="font-size:.6875rem;letter-spacing:.05em;color:#F2A900;margin-bottom:8px">DEFINITION</span>'
      + '<span style="font-size:.9rem;line-height:1.5;font-weight:500">' + esc(g.def) + '</span>'
      + '<span style="margin-top:auto;padding-top:10px;font-size:.7rem;color:rgba(255,255,255,.62)">' + (g.cite ? esc(g.cite) : 'Week ' + g.week + ' &middot; ' + esc(weekTitle(g.week))) + '</span>'
      + '</span>'
      + '</span></button>';
  }
  function courseCode() { return (D.course && D.course.code) || ''; }
  function courseTitle() { return (D.course && (D.course.name || D.course.title)) || courseCode() || 'this course'; }
  function siteCard(kicker, title, text) {
    return '<article style="border:1px solid #DEE3EA;border-radius:12px;background:#fff;padding:15px 16px"><div class="mono" style="font-size:.64rem;letter-spacing:.07em;color:var(--red);font-weight:700;margin-bottom:6px">' + esc(kicker) + '</div><h3 style="font-size:1rem;line-height:1.25;margin:0 0 6px;color:var(--ink)">' + esc(title) + '</h3><p style="font-size:.88rem;line-height:1.55;color:var(--ink-dim);margin:0">' + esc(text) + '</p></article>';
  }
  function institutionalNoticeHtml() {
    var code = courseCode() || 'this course';
    return '<section class="node" aria-label="Companion website and Blackboard relationship" style="border-left:4px solid var(--red);border-radius:0 14px 14px 0;margin-bottom:18px">'
      + '<div class="mono" style="font-size:.7rem;letter-spacing:.08em;color:var(--red);font-weight:700;margin-bottom:8px">COMPANION WEBSITE</div>'
      + '<h2 class="wk-sec" style="margin-bottom:10px">What this site is for</h2>'
      + '<p style="font-size:1rem;line-height:1.62;color:var(--ink);margin:0 0 10px">This instructor-created companion website supports weekly learning in ' + esc(code) + '. Students use this site for weekly learning pathways, readings, key concepts, walkthroughs, and study supports. Blackboard remains the official Seneca course platform for announcements, assignment submission, grades, discussions, course records, and required administrative functions.</p>'
      + '<p style="font-size:.92rem;line-height:1.55;color:var(--ink-dim);margin:0">Use this site to learn and prepare. Use Blackboard for official instructions, submissions, grades, announcements, discussions, and course records.</p>'
      + '</section>';
  }
  function howToUseSiteHtml() {
    var steps = [
      'Start with the current week\'s learning pathway.',
      'Review the guiding questions and key concepts.',
      'Open the assigned readings and media.',
      'Use the walkthroughs and self-checks to prepare for class and assessments.',
      'Use Blackboard for official announcements, assignment submission, discussions, grades, and course records.'
    ];
    return '<section class="node" aria-labelledby="how-site-title"><h2 id="how-site-title" class="wk-sec">How to Use This Site</h2><ol style="display:grid;gap:9px;margin:0;padding-left:22px">'
      + steps.map(function (s) { return '<li style="font-size:.96rem;line-height:1.55;color:var(--ink-dim);padding-left:4px">' + esc(s) + '</li>'; }).join('')
      + '</ol></section>';
  }
  function homeIntroCollapsible() {
    var code = courseCode() || 'this course';
    var name = String(state.studentName || '').trim();
    var days = Object.keys((state.visits && state.visits.days) || {}).length;
    var touched = Object.keys((state.visits && state.visits.weeks) || {}).length;
    var isNew = !name && touched === 0 && days <= 1;
    var steps = [
      'Start with the current week\'s learning pathway.',
      'Review the guiding questions and key concepts.',
      'Open the assigned readings and media.',
      'Use the walkthroughs and self-checks to prepare for class and assessments.',
      'Use Blackboard for official announcements, assignment submission, discussions, grades, and course records.'
    ];
    return '<section class="node home-intro" aria-label="About this companion website" style="border-left:4px solid var(--red);border-radius:0 14px 14px 0;margin-bottom:16px">'
      + '<div class="mono" style="font-size:.7rem;letter-spacing:.08em;color:var(--red);font-weight:700;margin-bottom:8px">COMPANION WEBSITE</div>'
      + '<p style="font-size:1rem;line-height:1.6;color:var(--ink);margin:0"><strong>Learn and prepare here. Use Blackboard to submit work, get your grades, and read official announcements.</strong></p>'
      + '<details class="home-about"' + (isNew ? ' open' : '') + '>'
      + '<summary>What this site is for, and how to use it</summary>'
      + '<div class="home-about-body">'
      + '<p style="font-size:.96rem;line-height:1.6;color:var(--ink);margin:0 0 10px">This instructor-created companion website supports weekly learning in ' + esc(code) + '. Students use this site for weekly learning pathways, readings, key concepts, walkthroughs, and study supports. Blackboard remains the official Seneca course platform for announcements, assignment submission, grades, discussions, course records, and required administrative functions.</p>'
      + '<h3>How to use this site</h3>'
      + '<ol style="display:grid;gap:8px;margin:0;padding-left:22px">'
      + steps.map(function (s) { return '<li style="font-size:.93rem;line-height:1.5;color:var(--ink-dim);padding-left:4px">' + esc(s) + '</li>'; }).join('')
      + '</ol></div></details>'
      + '</section>';
  }
  function bbDiagramHtml() {
    var code = courseCode() || 'this course';
    var svg = '<svg viewBox="0 0 760 260" role="img" aria-labelledby="bbd-t bbd-d" style="width:100%;height:auto;display:block;max-width:760px">'
      + '<title id="bbd-t">How this site and Blackboard work together</title>'
      + '<desc id="bbd-d">Two panels. This site is for learning and practice and saves only to your device. Blackboard is the official platform where you submit work and receive grades. Arrows show moving between them: submit on Blackboard, come back here to study.</desc>'
      + '<rect x="10" y="20" width="330" height="190" rx="14" fill="#F7F9FB" stroke="#1B2A4A" stroke-width="2"/>'
      + '<text x="30" y="52" font-size="15" font-weight="700" fill="#1B2A4A" style="letter-spacing:.06em">THIS SITE</text>'
      + '<text x="30" y="82" font-size="13.5" fill="#15171C">Weekly pathway, readings, key concepts</text>'
      + '<text x="30" y="108" font-size="13.5" fill="#15171C">Practice checks, notes, study supports</text>'
      + '<text x="30" y="134" font-size="13.5" fill="#15171C">Never graded, nothing submitted here</text>'
      + '<text x="30" y="160" font-size="13.5" fill="#15171C">Saves only to this device</text>'
      + '<text x="30" y="192" font-size="12" font-weight="600" fill="#6B7280">LEARN AND PRACTICE</text>'
      + '<rect x="420" y="20" width="330" height="190" rx="14" fill="#FFF6F5" stroke="#DA291C" stroke-width="2"/>'
      + '<text x="440" y="52" font-size="15" font-weight="700" fill="#DA291C" style="letter-spacing:.06em">BLACKBOARD</text>'
      + '<text x="440" y="82" font-size="13.5" fill="#15171C">Submit every assignment</text>'
      + '<text x="440" y="108" font-size="13.5" fill="#15171C">Discussions, announcements, messages</text>'
      + '<text x="440" y="134" font-size="13.5" fill="#15171C">Grades and official records</text>'
      + '<text x="440" y="160" font-size="13.5" fill="#15171C">Official due dates</text>'
      + '<text x="440" y="192" font-size="12" font-weight="600" fill="#6B7280">ACT AND SUBMIT</text>'
      + '<line x1="345" y1="80" x2="412" y2="80" stroke="#DA291C" stroke-width="2.5"/>'
      + '<polygon points="412,80 400,74 400,86" fill="#DA291C"/>'
      + '<text x="378" y="66" font-size="11.5" font-weight="600" fill="#DA291C" text-anchor="middle">submit</text>'
      + '<line x1="415" y1="150" x2="348" y2="150" stroke="#1B2A4A" stroke-width="2.5"/>'
      + '<polygon points="348,150 360,144 360,156" fill="#1B2A4A"/>'
      + '<text x="380" y="172" font-size="11.5" font-weight="600" fill="#1B2A4A" text-anchor="middle">study, review</text>'
      + '<text x="380" y="242" font-size="13" font-weight="700" fill="#15171C" text-anchor="middle">If the two ever disagree, Blackboard is the source of truth.</text>'
      + '</svg>';
    return '<section class="node" aria-labelledby="bbd-h" style="margin:16px 0">'
      + '<h2 id="bbd-h" class="wk-sec">How this site works with Blackboard</h2>'
      + '<p style="margin:0 0 14px;font-size:.95rem;line-height:1.6;color:var(--ink-dim)">Think of the two as one loop. You learn and practice here: the weekly pathway, readings, concepts, checks, and notes. You act on Blackboard: every submission, discussion post, grade, and official date lives there. Nothing you do on this site is graded or visible to anyone, and nothing here replaces a Blackboard step.</p>'
      + svg
      + '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">'
      + '<a href="' + BB_URL + '" target="_blank" rel="noopener" class="wk-cta" style="text-decoration:none;display:inline-flex;align-items:center;gap:6px">Open Blackboard <span aria-hidden="true">&#8599;</span></a>'
      + (typeof ICS_PATH === 'string' && ICS_PATH ? '<a href="' + ICS_PATH + '" download class="wk-cta" style="text-decoration:none;background:#fff;color:#1B2A4A;border:1px solid #1B2A4A;display:inline-flex;align-items:center;gap:6px">Add the key dates to your calendar</a>' : '')
      + '</div>'
      + (typeof ICS_PATH === 'string' && ICS_PATH ? '<p style="margin:8px 0 0;font-size:.78rem;color:var(--ink-faint)">The calendar file adds every assessment open and due date to Outlook, Google Calendar, or Apple Calendar. Blackboard remains the official word on dates.</p>' : '')
      + '</section>';
  }
  function asyncSuccessGuide() {
    var groups = [
      ['Make a plan you can keep', 'Pick two or three fixed times a week for this course and protect them like a class you cannot miss. The suggested pace is one week per week. If you fall behind, do not panic, just open the progress spine on the home page and pick up the next week you have not driven.'],
      ['Learn without a live lecture', 'The walkthrough is your lecture: in walkthrough weeks (2 to 12), open it first and move through every slide. Then read actively, not passively, by stopping after each reading to say, in one sentence, what it argued. If you cannot, read it again.'],
      ['Prove it to yourself', 'No one is quizzing you, so you have to quiz yourself. Use the checks honestly, use the flashcards, and try to explain each key concept out loud without looking. Being able to explain it is the real test.'],
      ['Have a plan for being stuck', 'Being stuck is normal and it is not a dead end. Re-open the walkthrough, search the Glossary, re-read the reading the idea comes from, post in the Blackboard discussion, and email the instructor. Replies come within about a business day, so ask early, not the night before a deadline.'],
      ['Keep your own evidence', 'At the end of every week, run Generate Your Weekly Notes and keep the downloaded file. Do not treat this site as storage: anything you type here lives only in this one browser and can be lost to a cleared cache, a different device, or a lab computer reset. The downloaded notes are yours for good, and they are exactly what you draw on for your graded work.']
    ];
    return '<section class="node async-success" style="border-top:4px solid var(--amode);margin:0 0 16px">'
      + '<div class="mono" style="font-size:.72rem;letter-spacing:.08em;color:var(--amode);font-weight:700;margin-bottom:8px">SUCCEEDING ON YOUR OWN</div>'
      + '<h2 style="font-size:1.5rem;font-weight:600;margin:0 0 8px;color:var(--ink)">A short guide to doing an asynchronous course well</h2>'
      + '<p style="font-size:1rem;line-height:1.6;color:var(--ink-dim);margin:0 0 18px">An asynchronous course hands you control, and control only helps if you use it. These five habits are what separate students who thrive on their own from students who drift.</p>'
      + '<div style="display:grid;gap:14px">' + groups.map(function (g, i) { return '<div style="display:flex;gap:14px;align-items:flex-start"><span class="mono" style="flex:none;width:27px;height:27px;border-radius:50%;background:var(--amode);color:#fff;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:700">' + (i + 1) + '</span><div><b style="font-size:1.02rem;color:var(--ink)">' + esc(g[0]) + '</b><p style="font-size:.93rem;line-height:1.55;color:var(--ink-dim);margin:3px 0 0">' + esc(g[1]) + '</p></div></div>'; }).join('') + '</div>'
      + '</section>';
  }
  function siteInfoPage() {
    var code = courseCode() || 'this course';
    var title = courseTitle();
    var cards = [
      ['BLACKBOARD', 'Where official course work happens', 'Blackboard remains the official Seneca course platform for announcements, assignment submission, discussions, grades, course records, and required administrative functions.'],
      ['PRIVACY', 'What this site does not send', 'This site does not require an account, does not collect student submissions, does not store grades, and does not send personal student information to the instructor, Seneca, or any server. The optional first name, notes, and check answers stay in this browser only, and browser storage can be cleared at any time: treat everything you type here as temporary and download what you want to keep.'],
      ['COPYRIGHT', 'How readings and media are used', 'Course readings and media are linked for educational use. Copyright remains with the original creators and publishers. Access readings through the provided links, Seneca library access, or Blackboard where applicable.'],
      ['MEDIA', 'External media', 'Nothing on this site contacts an external service until you choose to load or play a video. When you press a load button, that platform (YouTube in privacy-enhanced mode) applies its own privacy practices inside its player.'],
      ['LANGUAGE', 'Reading in another language', 'Your browser can translate this whole site: right click the page and choose Translate (Chrome, Edge, and Safari all offer this, in more than one hundred languages). It is your choice and happens in your browser. One caution: machine translation can bend key course terms and citations, so check important ideas against the English original before you use them in graded work.'],
      ['ACCESS', 'Accessibility support', 'This site is designed to support accessible course navigation. The Reading Lens button at the top of every page offers text size, spacing, a high-legibility font, page tints, a reading ruler, a magnifier, and read-aloud. If you experience a barrier, use Blackboard and contact the instructor so access can be supported.'],
      ['STUDY', 'What this site is for', 'Use this companion website for weekly learning pathways, readings, key concepts, walkthroughs, self-checks, glossary materials, and study supports.'],
      ['TECHNICAL', 'How this site is built', 'This is a static website: plain HTML, CSS, and JavaScript served from GitHub Pages, with no server, no database, no accounts, and no third-party trackers or analytics. All fonts and scripts load from this site itself.'],
      ['MAINTENANCE', 'How this site is maintained', 'The instructor maintains this site and updates it alongside Blackboard postings each term. If anything here ever looks out of date, Blackboard is the source of truth, and the instructor can be reached through Blackboard.'],
      ['LIMITS', 'Known limits', 'Saved notes and check answers live only in this browser on this device: clearing browser data removes them, and they do not move between devices. Some week videos may not yet have captions; their full scripts are posted in Blackboard. This site needs JavaScript; everything required for the course also remains available through Blackboard.']
    ];
    return '<div class="rise path-page">'
      + '<section class="path-hero"><div><div class="mono">COMPANION WEBSITE &middot; ASYNCHRONOUS</div><h1>How this site works, and how to work it</h1><p>This is your self-paced ' + esc(code) + ' course, and this site is the whole of it. This page shows you how to succeed on your own, then explains what belongs on Blackboard and how readings, privacy, accessibility, and media are handled.</p></div><div class="path-compass" aria-label="Companion website and Blackboard relationship"><span>THIS SITE</span><b>weekly learning pathway</b><i></i><span>BLACKBOARD</span><b>official course platform</b></div></section>'
      + asyncSuccessGuide()
      + institutionalNoticeHtml()
      + howToUseSiteHtml()
      + bbDiagramHtml()
      + '<section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin:16px 0">' + cards.map(function (c) { return siteCard(c[0], c[1], c[2]); }).join('') + '</section>'
      + reportBlock()
      + '<section class="exp-card" style="border-left-color:#1B2A4A" aria-label="Clear saved work"><div class="mono" style="font-size:.68rem;letter-spacing:.08em;color:#1B2A4A;font-weight:700">SHARED OR LAB COMPUTER?</div><h2 style="margin:4px 0 8px;font-size:1.1rem">Clear my saved work on this device</h2><p style="font-size:.9rem;line-height:1.55;margin:0 0 12px">Removes every note, check answer, and setting this site has saved in this browser. Download your weekly notes first if you want to keep them.</p><button type="button" class="wk-cta" style="margin:0" onclick="SOC.clearMyWork()">Clear everything saved here</button></section>'
      + '</div>';
  }
  function screenAnnounceText() {
    if (state.screen === 'station') return 'Week ' + state.stationWeek + ': ' + weekTitle(state.stationWeek);
    if (state.screen === 'site') return 'How This Site Works';
    if (state.screen === 'pathways') return 'Course Pathways';
    if (state.screen === 'readings') return 'Readings Library';
    if (state.screen === 'compare') return 'Compare Readings';
    if (state.screen === 'reading') return 'Reading Practice';
    if (state.screen === 'walkthroughs') return 'Weekly Walkthroughs';
    if (state.screen === 'videos') return 'Videos and Podcasts';
    if (state.screen === 'glossary') return 'Glossary';
    if (state.screen === 'cards') return 'Concept Flashcards';
    if (state.screen === 'calendar') return 'Calendar and Due Dates';
    if (state.screen === 'assignments' || state.screen === 'starter') return 'Understanding Your Assignment';
    if (state.screen === 'career') return 'Career Choices';
    if (state.screen === 'activity') return 'Activity';
    if (state.screen === 'detail') return 'Reading Details';
    if (state.screen && state.screen.indexOf('assignment') === 0) return 'Starting Your Assignment';
    return 'Home';
  }
  function reportBlock() {
    return '<section class="node" aria-labelledby="rep-h" style="margin:16px 0"><h2 id="rep-h" class="wk-sec">Something not working?</h2>'
      + '<p style="margin:0 0 12px;font-size:.95rem;line-height:1.6;color:var(--ink-dim)">If a video will not load, a link is broken, or anything looks wrong, tell the instructor so it can be fixed. The button opens your own email with the page details filled in; you just add what happened and press send. Nothing is collected by this site.</p>'
      + '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">'
      + '<button type="button" class="wk-cta" style="margin:0" onclick="SOC.reportProblem()">Report a problem by email</button>'
      + '<span style="font-size:.85rem;color:var(--ink-dim)">Use Seneca email or Blackboard messages for course support.</span>'
      + '</div></section>';
  }
  function siteFooter() {
    var code = courseCode() || 'Course';
    return '<footer role="contentinfo" style="margin:28px 0 0;padding:18px 20px;border:1px solid #DEE3EA;border-top:4px solid var(--red);border-radius:14px;background:#fff;color:var(--ink-dim)">'
      + '<p style="font-size:.9rem;line-height:1.55;margin:0 0 8px"><strong style="color:var(--ink)">' + esc(code) + ' companion website.</strong> Blackboard remains the official course platform for submissions, grades, announcements, discussions, and course records.</p>'
      + '<p style="font-size:.84rem;line-height:1.55;margin:0 0 8px">This site does not require an account, does not collect student submissions, does not store grades, and does not send personal student information to the instructor, Seneca, or any server. The optional first name, notes, and check answers stay in this browser only, and browser storage can be cleared at any time: treat everything you type here as temporary and download what you want to keep. No external service is contacted unless you choose to play a video.</p>'
      + '<p style="font-size:.84rem;line-height:1.55;margin:0">This site is designed to support accessible course navigation. Students who experience barriers using the site should use Blackboard and contact the instructor so access can be supported.</p>'
      + '</footer>';
  }
  function focusWeek(sel) { var ws = weeksWithReadings(); return sel == null ? (ws[0] || 1) : sel; }
  function selField(v) {
    v = String(v || '').trim();
    var i = v.indexOf('::');
    return i >= 0 ? v.slice(0, i) : v;
  }
  function selProgram(v) {
    v = String(v || '').trim();
    var i = v.indexOf('::');
    return i >= 0 ? v.slice(i + 2) : '';
  }
  function selLabel(v) { return selProgram(v) || selField(v); }
  function fieldExampleFor(w, key) {
    try {
      var fx = window.BFS218_FIELD_EXAMPLES;
      if (!fx) return null;
      var raw = String(state.programViewField || state.careerField || '').trim();
      if (!raw) return null;
      var prog = selProgram(raw), fld = selField(raw);
      var srcs = [prog, fld];
      for (var i = 0; i < srcs.length; i++) {
        var s = srcs[i];
        if (s && fx[s] && fx[s][w] && fx[s][w][key]) return { label: selLabel(raw), text: fx[s][w][key] };
      }
      return null;
    } catch (e) { return null; }
  }
  function trackVisit(w) {
    try {
      var d = new Date(), dk = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      state.visits.days = state.visits.days || {};
      state.visits.days[dk] = 1;
      state.visits.weeks = state.visits.weeks || {};
      var vw = state.visits.weeks[w] = state.visits.weeks[w] || { n: 0 };
      vw.n++; vw.last = Date.now();
    } catch (e) {}
  }
  function wkOpenResetWeek(w) {
    if (!state.wkOpen) return;
    var pfx = w + '|';
    Object.keys(state.wkOpen).forEach(function (k) { if (k.indexOf(pfx) === 0) delete state.wkOpen[k]; });
  }
  function wkOpenKey(id) { return (state.stationWeek || 0) + '|' + id; }
  function wkOpenHas(id) { return !!(state.wkOpen && state.wkOpen[wkOpenKey(id)]); }
  var wkSeq = 1;
  function wkOpenSet(id, open) {
    state.wkOpen = state.wkOpen || {};
    if (open) {
      var k; for (k in state.wkOpen) { var v = +state.wkOpen[k] || 1; if (v >= wkSeq) wkSeq = v + 1; }
      state.wkOpen[wkOpenKey(id)] = wkSeq++;
    } else delete state.wkOpen[wkOpenKey(id)];
  }
  /* Raymond rule: at most two sections open per week. Opening a third quietly closes the earliest opened. */
  function wkCapEnforce(keepId) {
    try {
      var secs = document.querySelectorAll('#soc-main section[id^="wk-"]');
      var open = [];
      Array.prototype.forEach.call(secs, function (sec) {
        if (sec.id === 'wk-ov' || sec.id === keepId || !sec.querySelector('h2.wk-sec')) return;
        if (!sec.querySelector('.wk-coll-btn')) return;
        if (sec.classList.contains('wk-collapsed')) return;
        open.push({ id: sec.id, seq: +((state.wkOpen || {})[wkOpenKey(sec.id)]) || 0 });
      });
      open.sort(function (a, b) { return a.seq - b.seq; });
      while (open.length > 1) {
        var old = open.shift();
        wkOpenSet(old.id, false);
        var osec = document.getElementById(old.id);
        if (osec) {
          osec.classList.add('wk-collapsed');
          var ob = osec.querySelector('.wk-coll-btn');
          if (ob) { ob.setAttribute('aria-expanded', 'false'); ob.setAttribute('aria-label', 'Show this section'); ob.textContent = '+'; }
        }
      }
    } catch (e) {}
  }
  function wkExpandFor(id) {
    if (!id || id.indexOf('wk-') !== 0 || id === 'wk-ov') return;
    var el = document.getElementById(id);
    if (!el) return;
    var sec = null;
    if (el.classList && el.classList.contains('wk-collapsed')) sec = el;
    else if (el.closest) sec = el.closest('section.wk-collapsed');
    if (!sec || !sec.id || sec.id === 'wk-ov') return;
    id = sec.id;
    wkOpenSet(id, true);
    sec.classList.remove('wk-collapsed');
    var b = sec.querySelector('.wk-coll-btn');
    if (b) { b.setAttribute('aria-expanded', 'true'); b.setAttribute('aria-label', 'Hide this section'); b.textContent = '\u2212'; }
    wkCapEnforce(id);
    persist();
  }
  function wkEnhanceSections() {
    if (state.screen !== 'station') return;
    var secs = document.querySelectorAll('#soc-main section[id^="wk-"]');
    Array.prototype.forEach.call(secs, function (sec) {
      var h = sec.querySelector('h2.wk-sec');
      if (!h && sec.id !== 'wk-ov' && sec.id !== 'wk-asg') {
        h = sec.querySelector('h2');
        if (h) h.classList.add('wk-sec');
      }
      if (!h || h.parentElement !== sec || h.querySelector('.wk-coll-btn')) return;
      var id = sec.id;
      if (id === 'wk-path') return;
      var collapsed = !wkOpenHas(id);
      if (collapsed) sec.classList.add('wk-collapsed');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'wk-coll-btn';
      btn.setAttribute('aria-controls', id);
      btn.setAttribute('aria-expanded', String(!collapsed));
      btn.setAttribute('aria-label', collapsed ? 'Show this section' : 'Hide this section');
      btn.textContent = collapsed ? '+' : '\u2212';
      btn.onclick = function () { SOC.wkColl(id); };
      h.appendChild(btn);
    });
    var rail = document.querySelector('.wk-rail');
    if (rail && !rail.__wkExpandWired) {
      rail.__wkExpandWired = true;
      rail.addEventListener('click', function (e) {
        var link = e.target && e.target.closest ? e.target.closest('a[href^="#wk-"]') : null;
        if (link) { try { wkExpandFor(link.getAttribute('href').slice(1)); } catch (e2) {} }
      });
    }
  }
  function compassRecs() {
    var recs = [];
    try {
      var ws = journeyWeeks();
      var vweeks = (state.visits && state.visits.weeks) || {};
      var visited = ws.filter(function (w) { return vweeks[w]; });
      if (!visited.length) {
        recs.push({ t: 'Begin with Week ' + (ws[0] || 1), b: 'Open the first week and try one section. The site keeps your place on this device.', go: 'SOC.station(' + (ws[0] || 1) + ')', gl: 'Open Week ' + (ws[0] || 1) });
        return recs;
      }
      var lastW = visited[visited.length - 1], lastTs = 0;
      visited.forEach(function (w) { if (vweeks[w].last && vweeks[w].last > lastTs) lastTs = vweeks[w].last; });
      if (lastTs && (Date.now() - lastTs) > 7 * 86400000) {
        recs.push({ t: 'Ease back in', b: 'It has been more than a week since your last visit. Reopening your most recent week can rebuild momentum without asking you to start something new.', go: 'SOC.station(' + lastW + ')', gl: 'Reopen Week ' + lastW });
      }
      if (window.BFS218_EXPERIMENTS) {
        for (var i = visited.length - 1; i >= 0; i--) {
          var w1 = visited[i];
          if (window.BFS218_EXPERIMENTS[w1] && !(state.exp && state.exp[w1] && state.exp[w1].ran)) {
            recs.push({ t: 'Run the Week ' + w1 + ' experiment', b: 'You opened Week ' + w1 + ' but have not run its experiment. The prediction you commit to is the part that teaches.', go: 'SOC.station(' + w1 + ')', gl: 'Go to Week ' + w1 });
            break;
          }
        }
      }
      if (!(state.programViewField || state.careerField || '')) {
        recs.push({ t: 'See yourself in this course', b: 'Pick your program area and the course starts speaking your language: each week gains a lens, a scenario, and a career link written for your field. It shapes how the material reads, never what is graded.', go: 'SOC.go(\'career\')', gl: 'Choose your field' });
      }
      var kcTried = state.kcHist && Object.keys(state.kcHist).length;
      if (!kcTried && visited.length >= 1) {
        recs.push({ t: 'Test yourself once', b: 'You have been reading but have not tried a Knowledge Check yet. One set tells you what actually stuck.', go: 'SOC.jumpWeek(' + lastW + ', \'kc\')', gl: 'Try a check' });
      }
      var noteCount = state.wkNotes ? Object.keys(state.wkNotes).filter(function (k) { return String(state.wkNotes[k]).trim(); }).length : 0;
      if (!noteCount && visited.length >= 2) {
        recs.push({ t: 'Capture one note', b: 'You have visited ' + visited.length + ' weeks without saving a note. One sentence per section becomes your study sheet at exam time.', go: 'SOC.station(' + lastW + ')', gl: 'Add a note' });
      }
      var refl = state.wkReflect && String(state.wkReflect[lastW] || '').trim();
      if (!refl && recs.length < 3) {
        recs.push({ t: 'Close the loop on Week ' + lastW, b: 'A short written reflection helps turn an idea you have seen into one you can use.', go: 'SOC.jumpWeek(' + lastW + ', \'reflect\')', gl: 'Write it' });
      }
      if (!recs.length) {
        var nextW = null;
        for (var j = 0; j < ws.length; j++) { if (!vweeks[ws[j]]) { nextW = ws[j]; break; } }
        if (nextW) recs.push({ t: 'You are current. Week ' + nextW + ' is next', b: 'Everything you have opened has work in it. Starting the next week early beats cramming it later.', go: 'SOC.station(' + nextW + ')', gl: 'Open Week ' + nextW });
        else recs.push({ t: 'All weeks visited', b: 'Use the Knowledge Checks and your notes to review the weeks you found hardest.', go: 'SOC.go(\'practice\')', gl: 'Practice' });
      }
    } catch (e) {}
    return recs.slice(0, 3);
  }
  function compassPanel() {
    var name = String(state.studentName || '').trim();
    var days = Object.keys((state.visits && state.visits.days) || {}).length;
    var vweeks = (state.visits && state.visits.weeks) || {};
    var touched = Object.keys(vweeks).length;
    var total = journeyWeeks().length;
    var recs = compassRecs();
    var greet = name ? ('Welcome back, ' + esc(name) + '.') : 'Your study compass';
    var nameUi = name
      ? '<small class="sc-nameline">Saved as ' + esc(name) + ' in this browser only. <button type="button" class="sc-linkbtn" onclick="SOC.nameClear()">Remove my name</button></small>'
      : '<form class="sc-nameform" onsubmit="return SOC.nameSave(event)"><label for="sc-name">Add your first name (optional)</label><div><input id="sc-name" maxlength="40" autocomplete="off" placeholder="Your name"><button type="submit">Save</button></div><small>Stays in this browser on this device, is never sent anywhere, and Clear My Work removes it.</small></form>';
    var scField = selLabel(state.programViewField || state.careerField || '');
    var stats = (days || scField)
      ? '<div class="sc-stats">' + (days ? '<span><b>' + days + '</b> day' + (days === 1 ? '' : 's') + ' here</span><span><b>' + touched + '</b> of ' + total + ' weeks opened</span>' : '') + (scField ? '<span>Your lens: <b>' + esc(scField) + '</b></span>' : '') + '</div>'
      : '';
    var recHtml = recs.map(function (r) {
      return '<div class="sc-rec"><div><b>' + r.t + '</b><p>' + r.b + '</p></div><button type="button" onclick="' + r.go + '">' + r.gl + '</button></div>';
    }).join('');
    return '<section class="node sc-panel jfade" aria-label="Your study compass">'
      + '<h2 class="wk-sec" style="margin-top:0">' + greet + '</h2>'
      + stats + recHtml + nameUi
      + '<details class="sc-how"><summary>How these suggestions work</summary><p>No AI and no server. A few fixed rules run in your browser over what you have done on this device: which weeks you opened, whether you ran checks and experiments, and whether you saved notes. None of it leaves this page, none of it is graded, and Clear My Work in How This Site Works erases all of it.</p></details>'
      + '</section>';
  }
  function weekHasWork(w) {
    try {
      var pfx = w + '|';
      if (state.wkNotes) { for (var k in state.wkNotes) { if (k.indexOf(pfx) === 0 && String(state.wkNotes[k]).trim()) return true; } }
      if (state.wkReflect && String(state.wkReflect[w] || '').trim()) return true;
      if (state.exp && state.exp[w] && state.exp[w].ran) return true;
      if (state.kcHist) { for (var k2 in state.kcHist) { if (k2.indexOf(w + '|') === 0 || k2.indexOf('w' + w) === 0) return true; } }
    } catch (e) {}
    return false;
  }
  function recordsForWeek(w) { return D.records.filter(function (r) { return r.week === w; }); }
  function firstWhere(list, fn) { for (var i = 0; i < list.length; i++) if (fn(list[i])) return list[i]; return null; }
  function firstSentence(s) { var t = String(s || '').replace(/\s+/g, ' ').trim(), m = t.match(/^(.{60,220}?[.!?])\s/); return m ? m[1] : t.slice(0, 240); }
  function studioOpenBtn(r) {
    return r ? '<button onclick="SOC.read(\'' + r.id + '\')" style="margin-top:6px;align-self:flex-start;background:none;border:none;color:#1552D8;font-size:.78rem;font-weight:600;padding:0;cursor:pointer">Open the reading &#8599;</button>' : '';
  }
  function studioPanel(kicker, title, body, meta, icon, accent, r) {
    return '<div style="background:#fff;border:1px solid #DEE3EA;border-top:4px solid ' + accent + ';border-radius:12px;padding:15px 16px;display:flex;flex-direction:column;gap:8px;min-height:190px">'
      + '<div class="mono" style="display:flex;align-items:center;gap:7px;font-size:.6875rem;letter-spacing:.05em;color:#6B7280">' + ic(icon || 'clipboard', 14) + esc(kicker) + '</div>'
      + '<h3 style="font-size:1.0625rem;line-height:1.3;margin:0;color:#15171C">' + esc(title) + '</h3>'
      + '<p style="font-size:.875rem;line-height:1.55;color:#474C57;margin:0">' + esc(body) + '</p>'
      + (meta ? '<div style="margin-top:auto;border-left:3px solid #DEE3EA;padding-left:10px;font-size:.75rem;line-height:1.45;color:#6b7280">' + esc(meta) + '</div>' : '')
      + studioOpenBtn(r)
      + '</div>';
  }
  function studioCheck(key, check) {
    var sel = state.mcSel[key], done = (sel !== undefined && sel !== null), ok = done && sel === check.answer;
    var opts = check.options.map(function (o, oi) {
      var isSel = sel === oi, isCor = oi === check.answer, bg = '#fff', bd = '#DEE3EA', col = '#15171C';
      if (done && isCor) { bg = '#E9EFE7'; bd = '#50694C'; col = '#2c3b29'; }
      else if (done && isSel) { bg = '#F6E3E1'; bd = '#DA291C'; col = '#8f1b12'; }
      var mark = (done && isCor) ? ' &#10003;' : ((done && isSel) ? ' &#10007;' : '');
      return '<button onclick="SOC.mcPick(\'' + key + '\',' + oi + ')" aria-pressed="' + (isSel ? 'true' : 'false') + '" style="display:block;width:100%;text-align:left;border:1px solid ' + bd + ';background:' + bg + ';color:' + col + ';border-radius:8px;padding:9px 12px;margin-bottom:7px;font-size:.875rem;font-weight:500;cursor:pointer">' + esc(o) + mark + '</button>';
    }).join('');
    var why = done ? '<div style="margin:8px 0 0;padding:10px 13px;border-radius:9px;background:' + (ok ? '#E9EFE7' : '#FBE9E7') + ';border:1px solid ' + (ok ? '#9CC4A8' : '#E5A9A2') + '"><span style="display:inline-flex;align-items:center;gap:6px;font-weight:700;font-size:.875rem;color:' + (ok ? '#2c6b3f' : '#b23121') + '">' + (ok ? ic('check', 14, 2.4) + 'Correct' : ic('x', 14, 2.4) + 'Not quite') + '</span><div style="margin-top:4px;font-size:.84rem;line-height:1.5;color:#474C57">' + esc(check.why) + '</div></div>' : '';
    return '<div role="group" style="background:#F7F8FA;border:1px solid #DEE3EA;border-radius:12px;padding:14px 16px;margin-top:14px"><div class="mono" style="font-size:.6875rem;letter-spacing:.05em;color:#6B7280;margin-bottom:8px">QUICK CHECK</div><p style="margin:0 0 9px;font-size:.9rem;font-weight:600;color:#15171C">' + esc(check.q) + '</p>' + opts + why + '</div>';
  }
  function studioShell(title, intro, inner) {
    return '<section style="background:#fff;border:1px solid #DEE3EA;border-radius:14px;padding:18px 18px 20px;margin:0 0 22px;box-shadow:0 1px 2px rgba(21,23,28,.04)">'
      + '<div class="mono" style="font-size:.6875rem;letter-spacing:.06em;color:var(--red);font-weight:600;margin-bottom:6px">SELF-CHECK STUDIO</div>'
      + '<h2 style="font-size:1.3125rem;line-height:1.25;margin:0 0 7px;color:#15171C">' + esc(title) + '</h2>'
      + '<p style="font-size:.9375rem;line-height:1.55;color:#474C57;margin:0 0 15px;">' + esc(intro) + '</p>' + inner + '</section>';
  }
  function socStudio(sel) {
    if (!HAS_EYE) return '';
    var w = focusWeek(sel), recs = recordsForWeek(w);
    var west = firstWhere(recs, function (r) { return r.eye === 'western'; });
    var ind = firstWhere(recs, function (r) { return r.eye === 'indigenous'; });
    if (!ind) return '';
    var panels = (west ? studioPanel('WESTERN EYE', west.authors, west.coreIdea, west.title + ' (' + west.year + ')', 'eye', '#3a47a8', west) : '')
      + studioPanel('INDIGENOUS EYE', ind.authors, ind.coreIdea, ind.title + ' (' + ind.year + ')', 'eye', '#1f4d38', ind);
    var soloNote = west ? '' : '<div style="margin-top:12px;background:#FBF4F3;border:1px solid #F0C8C3;border-radius:11px;padding:12px 15px;font-size:.85rem;line-height:1.55;color:#961A13">This week centres Indigenous knowledge; there is no separate Western-eye reading to set beside it. That is itself a Two-Eyed Seeing observation: not every topic carries a Western counterpart, and the Indigenous frame stands on its own here.</div>';
    var prompts = west
      ? ['What does ' + ind.authors + '\'s reading let you see that ' + west.authors + '\'s does not?', 'What would be missed if this week were read with only the Western eye?', 'What responsibility does ' + ind.authors + ' ask you to keep visible?']
      : ['What does ' + ind.authors + '\'s reading let you see about this week\'s topic?', 'What responsibility does ' + ind.authors + ' ask you to keep visible?'];
    var practice = '<div style="margin-top:14px;background:#F7F8FA;border:1px solid #DEE3EA;border-radius:12px;padding:14px 16px"><div class="mono" style="font-size:.6875rem;letter-spacing:.05em;color:#6B7280;margin-bottom:7px">TWO-EYED SEEING PRACTICE</div><p style="font-size:.78rem;color:#6b7280;line-height:1.5;margin:0 0 9px">Two-Eyed Seeing (Etuaptmumk) was named by Mi\'kmaw Elder Albert Marshall: seeing with the strengths of Indigenous knowledge in one eye and Western knowledge in the other, both kept whole. It is a practice you bring, not a synthesis the app writes.</p>' + prompts.map(function (p) { return '<div style="display:flex;gap:9px;align-items:flex-start;font-size:.875rem;line-height:1.5;color:#15171C;margin:6px 0"><span style="color:var(--red);font-weight:700">+</span><span>' + esc(p) + '</span></div>'; }).join('') + '</div>';
    var check = west ? studioCheck('SOC122|studio|' + w, {
      q: 'What is most at risk if this week\'s topic is treated as only a Western research-methods question?',
      options: [firstSentence(ind.coreIdea), 'Nothing important; the Western frame already covers it', 'Only the choice of examples or the citation style'],
      answer: 0,
      why: 'What is lost is exactly what ' + ind.authors + ' brings: ' + lcFirst(String(ind.coreIdea).replace(/\s*\.?\s*$/, '')) + '. Two-Eyed Seeing keeps both eyes open so this is not flattened into a footnote.'
    }) : '';
    var woven = '';
    if (west) {
      var wk2 = 'SOC122|weave|' + w, syn = (D.syntheses || {})[[west.id, ind.id].sort().join('|')];
      if (syn) woven = state.revealed[wk2]
        ? '<div style="margin-top:12px;background:#15171C;color:#fff;border-radius:11px;padding:14px 16px"><div class="mono" style="font-size:.62rem;letter-spacing:.05em;color:#9aa3b2;margin-bottom:6px">ONE GROUNDED WEAVE</div><p style="font-size:.86rem;line-height:1.55;color:rgba(255,255,255,.92);margin:0">' + esc(syn) + '</p><p style="font-size:.72rem;color:#9aa3b2;margin:9px 0 0">One way the course readings have been held together, not the answer. Two-Eyed Seeing keeps both eyes distinct (Etuaptmumk), never blended. <button onclick="SOC.rcReveal(\'' + wk2 + '\')" style="background:none;border:none;color:#f3b0a8;font-weight:600;cursor:pointer;padding:0">Hide</button></p></div>'
        : '<button onclick="SOC.rcReveal(\'' + wk2 + '\')" style="margin-top:12px;background:#fff;border:1px solid #DEE3EA;color:#15171C;border-radius:9px;padding:9px 14px;font-size:.84rem;font-weight:600;cursor:pointer">Reflect first, then see one grounded weave &#8595;</button>';
    }
    var save = '<div style="margin-top:14px"><button onclick="SOC.saveStudio()" style="background:var(--red);border:none;color:#fff;border-radius:9px;padding:9px 16px;font-size:.875rem;font-weight:600;cursor:pointer">Save my work to the Personal Cartography (.docx)</button></div>';
    return studioShell('Two attributed eyes', 'Read the two source frames as attributed readings, then bring Two-Eyed Seeing yourself. The app does not write a bridge for you.', '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px">' + panels + '</div>' + soloNote + practice + check + woven + save);
  }
  function psyStudio(sel) {
    var w = focusWeek(sel), recs = recordsForWeek(w), r = recs[0] || D.records[0], g = conceptsForWeek(w)[0] || (D.glossary || [])[0], items = (r && MC[r.id]) || [];
    if (!r) return '';
    var ev = firstWhere(items, function (m) { return m.skill === 'argument' || m.skill === 'context'; });
    var panels = studioPanel('CLAIM', r.title, r.coreIdea, r.authors + ' (' + r.year + ')', 'book', '#1552D8')
      + studioPanel('EVIDENCE', ev ? ev.q : 'What supports the claim?', ev ? ev.why : firstSentence(r.abstract), 'Ground this in the reading before applying it.', 'search', '#1f7a4d')
      + studioPanel('BOUNDARY', 'What this does not prove', 'Do not turn this idea into a rule for every learner. Check the context, supports, workload, strategy, and evidence before giving advice.', g ? g.term : 'Course concept', 'x', '#B7791F')
      + studioPanel('TRANSFER', 'Academic next step', 'Name one course task, one support, one study strategy, and one sign that the strategy is working.', 'No clinical or diagnostic framing.', 'external', '#7C3AED');
    var check = studioCheck('PSY355|studio|' + w, {
      q: 'Which next step uses this idea responsibly, without turning it into a rule or blaming the student?',
      options: ['Name one course task, one support, and one sign the strategy is working, then check the context before advising.', 'Tell the student they just need more grit or a better attitude.', 'Apply it the same way to every student, whatever their situation.'],
      answer: 0,
      why: 'The responsible step respects the boundary: ' + lcFirst(String(r.coreIdea).replace(/\s*\.?\s*$/, '')) + ', but only within its supports and context. Grit-talk blames the learner; one-size-fits-all overstates the reading.'
    });
    var save = '<div style="margin-top:14px"><button onclick="SOC.saveStudio()" style="background:var(--red);border:none;color:#fff;border-radius:9px;padding:9px 16px;font-size:.875rem;font-weight:600;cursor:pointer">Save my work to the Resilience Plan (.docx)</button></div>';
    return studioShell('Evidence Transfer Lab', 'Move from definition to responsible application: claim, evidence, boundary, then academic transfer.', '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px">' + panels + '</div>' + check + save);
  }
  function bfsStudio(sel) {
    var w = focusWeek(sel), recs = recordsForWeek(w), r = recs[0] || D.records[0], g = conceptsForWeek(w)[0] || (D.glossary || [])[0];
    if (!r) return '';
    var response = firstWhere(D.records, function (x) { return (x.themes || []).indexOf('resistance') >= 0 || /Benjamin|Costanza|Tanksley/i.test(x.authors + ' ' + x.title); }) || r;
    var rows = [['System or technology', 'Name the system, platform, model, database, policy, or technical process.'], ['Design, data, or default', 'Locate the design choice, data source, rule, threshold, category, or default setting.'], ['Racialized mechanism', 'Explain how the system sorts, exposes, excludes, predicts, surveils, or ranks people.'], ['Harm and accountability', 'Name the harm and the institutions responsible for changing the structure, not just one bad actor.'], ['Response', 'Ground the repair, refusal, abolitionist tool, or policy response in the course readings.']];
    var chain = rows.map(function (row, i) { return '<div style="display:grid;grid-template-columns:34px minmax(0,1fr);gap:11px;align-items:start;background:#fff;border:1px solid #DEE3EA;border-radius:12px;padding:12px 14px"><div class="mono" style="display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9px;background:#F6E3E1;color:var(--red);font-weight:700">' + (i + 1) + '</div><div><div style="font-size:.9375rem;font-weight:600;color:#15171C;margin-bottom:3px">' + esc(row[0]) + '</div><div style="font-size:.8125rem;line-height:1.5;color:#474C57">' + esc(row[1]) + '</div></div></div>'; }).join('');
    var anchor = '<div style="margin-top:14px;background:#F7F8FA;border:1px solid #DEE3EA;border-radius:12px;padding:14px 16px"><div class="mono" style="font-size:.6875rem;letter-spacing:.05em;color:#6B7280;margin-bottom:7px">SOURCE ANCHORS</div><p style="font-size:.875rem;line-height:1.55;color:#15171C;margin:0 0 8px"><strong>' + esc(r.authors) + ':</strong> ' + esc(r.coreIdea) + '</p><p style="font-size:.875rem;line-height:1.55;color:#15171C;margin:0"><strong>Response reading:</strong> ' + esc(response.coreIdea) + '</p></div>';
    var check = studioCheck('BFS218|studio|' + w, {
      q: 'Which option names the racialized MECHANISM, not only the outcome or someone\'s intent?',
      options: [firstSentence(r.coreIdea), 'Someone built the system to be racist on purpose.', 'The unequal results just happened by chance.'],
      answer: 0,
      why: 'The mechanism sits in the design and data, not in intent or luck: ' + lcFirst(String(r.coreIdea).replace(/\s*\.?\s*$/, '')) + '. That is the New Jim Code, harm built into how the system is made.'
    });
    var save = '<div style="margin-top:14px"><button onclick="SOC.saveStudio()" style="background:var(--red);border:none;color:#fff;border-radius:9px;padding:9px 16px;font-size:.875rem;font-weight:600;cursor:pointer">Save my work to the Personal Cartography (.docx)</button></div>';
    return studioShell('Accountability Chain Lab', 'Trace techno-racism through mechanism and responsibility. A strong answer names structure, not only intent.', '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px">' + chain + '</div>' + anchor + (g ? '<div style="font-size:.75rem;color:#6B7280;margin-top:10px">Concept anchor: ' + esc(g.term) + '</div>' : '') + check + save);
  }
  function selfCheckStudio(sel) {
    var code = courseCode();
    if (code === 'SOC122') return socStudio(sel);
    if (code === 'PSY355') return psyStudio(sel);
    if (code === 'BFS218') return bfsStudio(sel);
    return '';
  }
  /* ---------- BFS218 bias audit: staged audit + avatar scan (gated to BFS218) ---------- */
  /* Published Gender Shades (Buolamwini and Gebru, 2018) intersectional error rates.
     darker-skinned women 34.7% and lighter-skinned men 0.8% are the corpus headline figures;
     lighter-skinned women ~7% and darker-skinned men ~12% are the published per-system intersectional results. */
  var GS = {
    perGroup: 25,
    groups: [
      { id: 'lm', label: 'Lighter-skinned men', short: 'Lighter men', skin: 'lighter', gender: 'men' },
      { id: 'lw', label: 'Lighter-skinned women', short: 'Lighter women', skin: 'lighter', gender: 'women' },
      { id: 'dm', label: 'Darker-skinned men', short: 'Darker men', skin: 'darker', gender: 'men' },
      { id: 'dw', label: 'Darker-skinned women', short: 'Darker women', skin: 'darker', gender: 'women' }
    ],
    systems: [
      { id: 'ibm', name: 'IBM', rate: { lm: 0.3, lw: 7.1, dm: 12.0, dw: 34.7 } },
      { id: 'microsoft', name: 'Microsoft', rate: { lm: 0.0, lw: 1.7, dm: 6.0, dw: 20.8 } },
      { id: 'faceplus', name: 'Face++', rate: { lm: 0.8, lw: 6.0, dm: 0.7, dw: 34.5 } }
    ]
  };
  function auditSys() { return GS.systems[state.auditSystem || 0]; }
  function rateOf(g) { return auditSys().rate[g.id]; }
  function gsFails(g) { return Math.round(rateOf(g) / 100 * GS.perGroup); }
  function gsAvg(fn) { var a = GS.groups.filter(fn), s = 0; a.forEach(function (g) { s += rateOf(g); }); return Math.round(s / a.length * 10) / 10; }
  function auditSliceData(slice) {
    if (slice === 'overall') return [['All faces, one number', gsAvg(function () { return true; }), '#15171C']];
    if (slice === 'gender') return [['Men', gsAvg(function (g) { return g.gender === 'men'; }), '#3a47a8'], ['Women', gsAvg(function (g) { return g.gender === 'women'; }), '#3a47a8']];
    if (slice === 'skin') return [['Lighter-skinned', gsAvg(function (g) { return g.skin === 'lighter'; }), '#B7791F'], ['Darker-skinned', gsAvg(function (g) { return g.skin === 'darker'; }), '#B7791F']];
    return GS.groups.map(function (g) { return [g.label, rateOf(g), g.id === 'dw' ? '#DA291C' : '#15171C']; });
  }
  function auditInsight(slice) {
    var sys = auditSys();
    if (slice === 'overall') return 'One number for ' + sys.name + ': about ' + Math.round(100 - gsAvg(function () { return true; })) + ' percent accurate overall. A marketing slide would stop here. Would you ship it?';
    if (slice === 'gender') return 'Split by gender, a gap opens: ' + sys.name + ' fails women more than men. Averaging still keeps it looking manageable.';
    if (slice === 'skin') return 'Split by skin type, a wider gap: ' + sys.name + ' fails darker-skinned faces more. Each single axis on its own still understates the harm.';
    return sys.name + ': darker-skinned women fail ' + sys.rate.dw.toFixed(1) + ' percent of the time, against ' + sys.rate.lm.toFixed(1) + ' percent for lighter-skinned men. A single-axis test would have passed it. That is intersectionality (Crenshaw) and the coded gaze (Buolamwini).';
  }
  function auditBars(slice) {
    var data = auditSliceData(slice);
    var bars = data.map(function (d) {
      var w = Math.max(2, Math.round(d[1] / 40 * 100));
      return '<div style="margin:0 0 11px"><div style="display:flex;justify-content:space-between;font-size:.8125rem;font-weight:600;color:#15171C;margin-bottom:4px"><span>' + esc(d[0]) + '</span><span class="mono">' + d[1].toFixed(1) + '%</span></div><div style="height:18px;background:#EEF1F5;border-radius:6px;overflow:hidden"><div style="height:100%;width:' + w + '%;background:' + d[2] + ';border-radius:6px;transition:width .4s ease"></div></div></div>';
    }).join('');
    return '<div role="img" aria-label="Misclassification rate, ' + esc(slice) + ' view. ' + esc(data.map(function (d) { return d[0] + ' ' + d[1].toFixed(1) + ' percent'; }).join('. ')) + '.">' + bars + '</div>';
  }
  function auditModelControls(active) {
    var defs = [['errors', 'Failure pattern'], ['pipeline', 'Audit pipeline'], ['orbit', 'Free rotate']];
    return '<div class="audit-model-controls" aria-label="3D model view controls">' + defs.map(function (d) {
      var on = active === d[0];
      return '<button onclick="SOC.auditView(\'' + d[0] + '\')" aria-pressed="' + on + '" class="' + (on ? 'on' : '') + '">' + esc(d[1]) + '</button>';
    }).join('') + '</div>';
  }
  function auditModelHtml(run, slice, sys) {
    var idx = Math.max(0, GS.systems.map(function (s) { return s.id; }).indexOf(sys.id));
    var view = state.auditView || 'errors';
    var aria = 'Semi-manipulable 3D model of the Gender Shades audit for ' + sys.name + '. It shows a scanner, four benchmark trays, and red failure pins concentrated in the darker-skinned women tray after the audit runs.';
    return '<div class="audit-model-stack"><div class="audit-model-shell">'
      + '<canvas class="audit-model-canvas" role="img" aria-label="' + esc(aria) + '" data-audit-model="week5" data-run="' + (run ? '1' : '0') + '" data-slice="' + esc(slice) + '" data-system-index="' + idx + '" data-view="' + esc(view) + '"></canvas>'
      + '<div class="audit-model-hint"><b>How to read the model</b><span>Each tray is 25 benchmark faces. Red pins are errors. Rotate the model, then use the slice buttons to test what the average hides.</span></div>'
      + auditModelControls(view)
      + '<div class="audit-model-fallback" hidden>The 3D model could not load. The data table below still shows the audit results.</div>'
      + '</div><div class="audit-model-guide"><b>Use it in order</b><ol><li>Run the audit: red pins appear where the system misclassifies benchmark faces.</li><li>Switch systems: IBM, Microsoft, and Face++ repeat the same pattern at different levels.</li><li>Change the slice: overall looks safe; intersectional shows who is carrying the error.</li></ol></div></div>';
  }
  function loadThree() {
    if (!threePromise) threePromise = import('./assets/lib/three.module.min.js');
    return threePromise;
  }
  function initAuditModels() {
    var canvases = Array.prototype.slice.call(document.querySelectorAll('canvas[data-audit-model="week5"]'));
    if (!canvases.length) return;
    loadThree().then(function (THREE) {
      canvases.forEach(function (canvas) { initAuditModel(THREE, canvas, auditRenderStamp); });
    }).catch(function () {
      canvases.forEach(function (canvas) {
        var fb = canvas.parentNode && canvas.parentNode.querySelector('.audit-model-fallback');
        if (fb) fb.hidden = false;
      });
    });
  }
  function initAuditModel(THREE, canvas, stamp) {
    if (!canvas || canvas.__auditInit || !canvas.isConnected || stamp !== auditRenderStamp) return;
    canvas.__auditInit = true;
    canvas.__auditStamp = stamp;
    var shell = canvas.parentNode, run = canvas.getAttribute('data-run') === '1';
    var slice = canvas.getAttribute('data-slice') || 'overall';
    var sys = GS.systems[Number(canvas.getAttribute('data-system-index')) || 0] || GS.systems[0];
    var view = canvas.getAttribute('data-view') || 'errors';
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, preserveDrawingBuffer: false });
    canvas.__auditGL = renderer.getContext ? renderer.getContext() : null;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.1, 80);
    camera.position.set(4.9, 3.5, 6.5);
    camera.lookAt(0, 0.45, 0.35);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb8c4d0, 2.6));
    var sun = new THREE.DirectionalLight(0xffffff, 3.1); sun.position.set(3.6, 6.5, 4.8); scene.add(sun);
    var fill = new THREE.DirectionalLight(0xe7f7ff, 1.1); fill.position.set(-4, 3, -3); scene.add(fill);
    var root = new THREE.Group(); root.scale.set(0.82, 0.82, 0.82); root.position.set(0, -0.02, 0.02); scene.add(root);
    var mats = {
      floor: new THREE.MeshStandardMaterial({ color: 0xe9eef2, roughness: 0.72, metalness: 0.02 }),
      teal: new THREE.MeshPhysicalMaterial({ color: 0x00aeb3, transparent: true, opacity: 0.36, roughness: 0.18, metalness: 0.05, transmission: 0.18 }),
      orange: new THREE.MeshPhysicalMaterial({ color: 0xff8a1d, transparent: true, opacity: 0.38, roughness: 0.16, metalness: 0.05, transmission: 0.18 }),
      tray: new THREE.MeshPhysicalMaterial({ color: 0x9fdde0, transparent: true, opacity: 0.28, roughness: 0.22, metalness: 0.03, transmission: 0.18 }),
      trayHot: new THREE.MeshPhysicalMaterial({ color: 0xff9d80, transparent: true, opacity: 0.46, roughness: 0.2, metalness: 0.03, transmission: 0.16 }),
      token: new THREE.MeshStandardMaterial({ color: 0xe9dfcc, roughness: 0.55, metalness: 0.02 }),
      red: new THREE.MeshStandardMaterial({ color: 0xda291c, emissive: 0x8f120b, emissiveIntensity: 0.35, roughness: 0.35 }),
      dark: new THREE.MeshStandardMaterial({ color: 0x1b2a4a, roughness: 0.38, metalness: 0.25 }),
      suit: new THREE.MeshStandardMaterial({ color: 0xff7a18, roughness: 0.42, metalness: 0.05 }),
      suit2: new THREE.MeshStandardMaterial({ color: 0x00aeb3, roughness: 0.42, metalness: 0.05 }),
      glassLine: new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.52 }),
      cable: new THREE.MeshStandardMaterial({ color: 0x222831, roughness: 0.6, metalness: 0.12 }),
      beam: new THREE.MeshBasicMaterial({ color: 0xffcc66, transparent: true, opacity: 0.22, side: THREE.DoubleSide })
    };
    function addMesh(parent, geo, mat, pos, rot, scale) {
      var m = new THREE.Mesh(geo, mat);
      if (pos) m.position.set(pos[0], pos[1], pos[2]);
      if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
      if (scale) m.scale.set(scale[0], scale[1], scale[2]);
      parent.add(m);
      return m;
    }
    function edges(parent, mesh, color, opacity) {
      var e = new THREE.EdgesGeometry(mesh.geometry);
      var l = new THREE.LineSegments(e, new THREE.LineBasicMaterial({ color: color || 0xffffff, transparent: true, opacity: opacity == null ? 0.48 : opacity }));
      l.position.copy(mesh.position); l.rotation.copy(mesh.rotation); l.scale.copy(mesh.scale); parent.add(l); return l;
    }
    root.add(new THREE.GridHelper(7, 10, 0xd6dde5, 0xd6dde5));
    addMesh(root, new THREE.BoxGeometry(7.3, 0.08, 5.3), mats.floor, [0, -0.07, 0], null, null);
    var dataCube = addMesh(root, new THREE.BoxGeometry(1.35, 1.35, 1.35), mats.teal, [-2.25, 0.72, -1.18]);
    var sysCube = addMesh(root, new THREE.BoxGeometry(1.35, 1.35, 1.35), mats.orange, [2.25, 0.72, -1.18]);
    edges(root, dataCube, 0x00f2ff, 0.68); edges(root, sysCube, 0xffbd69, 0.74);
    for (var chip = 0; chip < 9; chip++) {
      addMesh(root, new THREE.BoxGeometry(0.08 + (chip % 3) * 0.025, 0.02, 0.42), mats.dark, [-2.58 + (chip % 3) * 0.25, 0.75 + Math.floor(chip / 3) * 0.15, -1.86 + (chip % 2) * 0.16]);
      addMesh(root, new THREE.BoxGeometry(0.08 + (chip % 2) * 0.02, 0.02, 0.36), mats.dark, [2.02 + (chip % 3) * 0.2, 0.75 + Math.floor(chip / 3) * 0.13, -1.85 + (chip % 2) * 0.18]);
    }
    function cable(a, b, c) {
      var curve = new THREE.CatmullRomCurve3([new THREE.Vector3(a[0], a[1], a[2]), new THREE.Vector3(c[0], c[1], c[2]), new THREE.Vector3(b[0], b[1], b[2])]);
      addMesh(root, new THREE.TubeGeometry(curve, 28, 0.025, 8, false), mats.cable);
    }
    cable([-1.55, 0.5, -1.15], [-0.55, 0.25, -0.45], [-1.15, 0.62, -0.1]);
    cable([1.55, 0.5, -1.15], [0.55, 0.25, -0.45], [1.1, 0.62, -0.1]);
    cable([2.35, 0.22, -0.5], [1.42, 0.16, 1.2], [2.0, 0.18, 0.6]);
    var trayGeo = new THREE.BoxGeometry(1.35, 0.1, 1.05);
    var headGeo = new THREE.SphereGeometry(0.055, 14, 10);
    var neckGeo = new THREE.CylinderGeometry(0.026, 0.034, 0.09, 10);
    var pinGeo = new THREE.CylinderGeometry(0.021, 0.021, 0.42, 10);
    var pinTopGeo = new THREE.SphereGeometry(0.04, 12, 8);
    var trayPos = { lm: [-0.78, 0.08, 0.08], lw: [0.78, 0.08, 0.08], dm: [-0.78, 0.08, 1.28], dw: [0.78, 0.08, 1.28] };
    function visibleFor(g) {
      if (slice === 'overall') return true;
      if (slice === 'gender') return g.gender === 'women';
      if (slice === 'skin') return g.skin === 'darker';
      return g.id === 'dw';
    }
    GS.groups.forEach(function (g) {
      var p = trayPos[g.id], hot = (g.id === 'dw' && (slice === 'intersectional' || view === 'errors'));
      var tray = addMesh(root, trayGeo, hot ? mats.trayHot : mats.tray, p);
      tray.material.opacity = visibleFor(g) ? tray.material.opacity : 0.16;
      edges(root, tray, hot ? 0xda291c : 0x31aeb7, hot ? 0.9 : 0.48);
      var fail = run ? gsFails(g) : 0;
      for (var i = 0; i < GS.perGroup; i++) {
        var col = i % 5, row = Math.floor(i / 5);
        var x = p[0] - 0.43 + col * 0.215, z = p[2] - 0.32 + row * 0.16;
        addMesh(root, neckGeo, mats.token, [x, 0.19, z]);
        addMesh(root, headGeo, mats.token, [x, 0.27, z]);
        if (i < fail) {
          addMesh(root, pinGeo, mats.red, [x, 0.5, z]);
          addMesh(root, pinTopGeo, mats.red, [x, 0.73, z]);
        }
      }
      if (hot && run) {
        addMesh(root, new THREE.TorusGeometry(0.78, 0.018, 10, 80), mats.red, [p[0], 0.83, p[2]], [Math.PI / 2, 0, 0]);
      }
    });
    if (slice === 'overall') {
      addMesh(root, new THREE.BoxGeometry(3.25, 0.04, 2.55), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.22, roughness: 0.08, transmission: 0.1 }), [0, 0.88, 0.68]);
    }
    var person = new THREE.Group(); root.add(person); person.position.set(-0.25, 0.05, -0.45); person.rotation.y = -0.7;
    addMesh(person, new THREE.CylinderGeometry(0.11, 0.14, 0.38, 14), mats.suit, [0, 0.38, 0]);
    addMesh(person, new THREE.SphereGeometry(0.12, 16, 10), mats.suit2, [0, 0.66, 0]);
    addMesh(person, new THREE.CylinderGeometry(0.035, 0.035, 0.34, 10), mats.suit, [-0.12, 0.22, 0.05], [0.85, 0.1, 0.2]);
    addMesh(person, new THREE.CylinderGeometry(0.035, 0.035, 0.34, 10), mats.suit, [0.12, 0.22, -0.02], [0.9, -0.2, -0.2]);
    addMesh(person, new THREE.BoxGeometry(0.18, 0.11, 0.12), mats.dark, [0.19, 0.42, 0.18], [0, 0.3, 0]);
    addMesh(person, new THREE.ConeGeometry(0.18, 0.8, 24, 1, true), mats.beam, [0.38, 0.4, 0.48], [Math.PI / 2, 0.2, 0]);
    var target = { x: view === 'pipeline' ? -0.08 : -0.2, y: view === 'pipeline' ? -0.82 : -0.45 };
    if (view === 'orbit') target.y = -0.55;
    var cur = { x: target.x, y: target.y }, dragging = false, last = null;
    function beginDrag(x, y) { dragging = true; last = { x: x, y: y }; }
    function isModelControl(e) { return !!(e.target && e.target.closest && e.target.closest('.audit-model-controls')); }
    function moveDrag(x, y) {
      if (!dragging || !last) return;
      target.y += (x - last.x) * 0.014;
      target.x += (y - last.y) * 0.008;
      target.x = Math.max(-0.65, Math.min(0.35, target.x));
      last = { x: x, y: y };
      canvas.setAttribute('data-dragged', '1');
    }
    function onPointer(e) { if (isModelControl(e)) return; beginDrag(e.clientX, e.clientY); if (e.currentTarget && e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId); }
    function movePointer(e) { moveDrag(e.clientX, e.clientY); }
    function upPointer() { dragging = false; last = null; }
    function onMouseDown(e) { if (isModelControl(e)) return; beginDrag(e.clientX, e.clientY); }
    function onMouseMove(e) { moveDrag(e.clientX, e.clientY); }
    function onTouchStart(e) { if (isModelControl(e)) return; if (e.touches && e.touches[0]) { e.preventDefault(); beginDrag(e.touches[0].clientX, e.touches[0].clientY); } }
    function onTouchMove(e) { if (e.touches && e.touches[0]) { e.preventDefault(); moveDrag(e.touches[0].clientX, e.touches[0].clientY); } }
    canvas.addEventListener('pointerdown', onPointer);
    canvas.addEventListener('pointermove', movePointer);
    canvas.addEventListener('pointerup', upPointer);
    canvas.addEventListener('pointercancel', upPointer);
    canvas.addEventListener('mousedown', onMouseDown);
    shell.addEventListener('pointerdown', onPointer);
    shell.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', upPointer);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', upPointer);
    shell.addEventListener('touchstart', onTouchStart, { passive: false });
    shell.addEventListener('touchmove', onTouchMove, { passive: false });
    shell.addEventListener('touchend', upPointer);
    var reduced = false;
    try { reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    function resize() {
      var w = Math.max(320, shell.clientWidth || canvas.clientWidth || 720);
      var h = Math.max(300, Math.round(w * 0.58));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    var ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(shell);
    var disposed = false;
    function cleanupAuditModel() {
      if (disposed) return;
      disposed = true;
      if (ro) ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', upPointer);
      canvas.removeEventListener('pointerdown', onPointer);
      canvas.removeEventListener('pointermove', movePointer);
      canvas.removeEventListener('pointerup', upPointer);
      canvas.removeEventListener('pointercancel', upPointer);
      canvas.removeEventListener('mousedown', onMouseDown);
      shell.removeEventListener('pointerdown', onPointer);
      shell.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', upPointer);
      shell.removeEventListener('touchstart', onTouchStart);
      shell.removeEventListener('touchmove', onTouchMove);
      shell.removeEventListener('touchend', upPointer);
      disposeThreeScene(scene);
      renderer.dispose();
      if (renderer.forceContextLoss) renderer.forceContextLoss();
      canvas.__auditGL = null;
    }
    registerModelCleanup(cleanupAuditModel);
    function animate() {
      if (!canvas.isConnected || canvas.__auditStamp !== auditRenderStamp) {
        cleanupAuditModel();
        return;
      }
      if (!dragging && view === 'orbit' && !reduced) target.y += 0.002;
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      root.rotation.x = cur.x;
      root.rotation.y = cur.y;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  }
  function auditGrid(run) {
    var cols = GS.groups.map(function (g) {
      var fail = gsFails(g), dots = '';
      for (var i = 0; i < GS.perGroup; i++) { var isFail = run && i < fail; dots += '<span class="bfs-face' + (isFail ? ' fail' : '') + '"' + (isFail ? ' style="animation-delay:' + (i * 0.05).toFixed(2) + 's"' : '') + ' aria-hidden="true"></span>'; }
      return '<div style="flex:1;min-width:118px"><div style="font-size:.7rem;font-weight:700;color:#15171C;text-align:center;margin-bottom:8px;line-height:1.25;min-height:2.4em">' + esc(g.short) + '</div><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:5px;justify-items:center">' + dots + '</div>' + (run ? '<div class="mono" style="text-align:center;font-size:.7rem;color:' + (g.id === 'dw' ? '#DA291C' : '#6B7280') + ';margin-top:8px;font-weight:700">' + fail + ' of ' + GS.perGroup + ' failed</div>' : '') + '</div>';
    }).join('');
    return '<div style="display:flex;gap:14px;flex-wrap:wrap">' + cols + '</div>';
  }
  function audit3dDots(g, run) {
    var fail = gsFails(g), dots = '';
    for (var i = 0; i < GS.perGroup; i++) {
      var isFail = run && i < fail;
      dots += '<span class="audit-dot' + (isFail ? ' fail' : '') + '" style="--z:' + ((i % 5) * 2) + 'px;--d:' + ((i * 0.035).toFixed(2)) + 's" aria-hidden="true"></span>';
    }
    return dots;
  }
  function audit3dBench(run) {
    return '<div class="audit-bench" aria-label="Balanced benchmark with four groups, 25 markers per group">'
      + GS.groups.map(function (g) {
        return '<div class="audit-tray"><div class="audit-tray-label">' + esc(g.short) + '</div><div class="audit-dots">' + audit3dDots(g, run) + '</div>'
          + (run ? '<div class="audit-tray-count">' + gsFails(g) + ' of ' + GS.perGroup + ' failed</div>' : '<div class="audit-tray-count">25 markers</div>') + '</div>';
      }).join('')
      + '</div>';
  }
  function auditSliceStep(slice, id, title, body) {
    var active = slice === id;
    return '<button onclick="SOC.auditSlice(\'' + id + '\')" aria-pressed="' + active + '" class="audit-step' + (active ? ' on' : '') + '"><span>' + esc(title) + '</span><small>' + esc(body) + '</small></button>';
  }
  function audit3dScene(run, slice, sys) {
    var auditedCount = Object.keys(state.auditedSystems || {}).length;
    var label = run ? ('Auditing ' + sys.name) : 'Ready to audit';
    var status = run ? (auditedCount + ' of 3 systems audited') : 'Run the first benchmark';
    var steps = auditSliceStep(slice, 'overall', 'Overall', 'One number looks safe')
      + auditSliceStep(slice, 'gender', 'Gender', 'A gap begins to show')
      + auditSliceStep(slice, 'skin', 'Skin type', 'The gap gets sharper')
      + auditSliceStep(slice, 'intersectional', 'Intersectional', 'The harm is finally visible');
    return '<section class="audit-lab" aria-label="Immersive coded gaze audit lab">'
      + '<div class="audit-stage">'
      + '<div class="audit-wall"><div class="audit-wall-kicker">AUDIT LAB</div><h2>Slice the results until the hidden harm appears.</h2><p>' + esc(auditInsight(slice)) + '</p><div class="audit-wall-guide"><b>What you are doing</b><span>Do not judge the system by the average. Use the model to inspect where errors cluster, then use the slice buttons to decide which report would expose or hide the harm.</span></div><div id="bfs-slicebtns" class="audit-steps">' + steps + '</div></div>'
      + '<div class="audit-workspace"><div class="audit-table">'
      + auditModelHtml(run, slice, sys)
      + '<div class="audit-systems">' + GS.systems.map(function (s, i) {
        var active = run && sys.id === s.id;
        var done = state.auditedSystems && state.auditedSystems[s.id];
        return '<button onclick="SOC.auditSystem(' + i + ')" class="audit-system' + (active ? ' active' : '') + (done ? ' done' : '') + '"><span>' + esc(s.name) + '</span><b>' + s.rate.dw.toFixed(1) + '%</b><small>darker-skinned women</small></button>';
      }).join('') + '</div>'
      + '</div>'
      + '<div class="audit-console"><div><div class="audit-console-label">' + esc(label) + '</div><div class="audit-console-note">' + esc(status) + '</div></div>'
      + (run ? '<button onclick="SOC.nextSystem()">Audit next system</button>' : '<button onclick="SOC.runAudit()">Run audit</button>') + '</div>'
      + '</div></div>'
      + '<div class="audit-readout"><div><h3>What the lab is showing</h3><p>The benchmark is balanced. The reporting is not. Overall accuracy hides the harm, single-axis slices only partly expose it, and the intersectional slice shows who the system fails most.</p></div><div id="bfs-bars">' + auditBars(slice) + '</div></div>'
      + '</section>';
  }
  function auditSliceBtns(active) {
    var defs = [['overall', 'Overall'], ['gender', 'By gender'], ['skin', 'By skin type'], ['intersectional', 'Intersectional']];
    return '<div id="bfs-slicebtns" style="display:flex;flex-wrap:wrap;gap:8px;margin:0 0 14px">' + defs.map(function (d) {
      var on = active === d[0];
      return '<button onclick="SOC.auditSlice(\'' + d[0] + '\')" aria-pressed="' + on + '" style="border:1.5px solid ' + (on ? '#DA291C' : '#DEE3EA') + ';background:' + (on ? '#F6E3E1' : '#fff') + ';color:#15171C;border-radius:999px;padding:7px 13px;font-size:.8125rem;font-weight:600;cursor:pointer">' + esc(d[1]) + '</button>';
    }).join('') + '</div>';
  }
  function auditFallbackTable() {
    var sys = auditSys();
    var rows = GS.groups.map(function (g) { return '<tr><td style="padding:6px 8px;border-top:1px solid #EEF1F5">' + esc(g.label) + '</td><td style="text-align:right;padding:6px 8px;border-top:1px solid #EEF1F5">' + rateOf(g).toFixed(1) + '%</td><td style="text-align:right;padding:6px 8px;border-top:1px solid #EEF1F5">' + gsFails(g) + ' of ' + GS.perGroup + '</td></tr>'; }).join('');
    return '<table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:.8125rem"><caption class="mono" style="text-align:left;font-size:.6875rem;letter-spacing:.05em;color:#6B7280;margin-bottom:6px">' + esc(sys.name) + ' RESULTS (DATA TABLE)</caption><thead><tr><th scope="col" style="text-align:left;padding:6px 8px;border-bottom:1px solid #DEE3EA">Group</th><th scope="col" style="text-align:right;padding:6px 8px;border-bottom:1px solid #DEE3EA">Error rate</th><th scope="col" style="text-align:right;padding:6px 8px;border-bottom:1px solid #DEE3EA">Faces failed of 25</th></tr></thead><tbody>' + rows + '</tbody></table><p style="font-size:.72rem;line-height:1.5;color:#6B7280;margin:8px 0 0">Per-system intersectional error rates from Buolamwini and Gebru, Gender Shades (2018), the three commercial systems they audited (IBM, Microsoft, Face++). Gender, skin-type, and overall figures are averages across the balanced benchmark of 25 faces per group.</p>';
  }
  function sandboxScreen() {
    var run = !!state.auditRun, slice = state.auditSlice || 'overall', sys = auditSys();
    var auditedCount = Object.keys(state.auditedSystems || {}).length;
    var openBtn = '<button onclick="SOC.read(\'buolamwini2018\')" style="margin-top:2px;background:none;border:none;color:#1552D8;font-size:.8125rem;font-weight:600;padding:0;cursor:pointer">Open Gender Shades (Buolamwini and Gebru, 2018) &#8599;</button>';
    var predict = '<div style="background:#F7F8FA;border:1px solid #DEE3EA;border-radius:12px;padding:14px 16px;margin:16px 0 0"><div class="mono" style="font-size:.6875rem;letter-spacing:.05em;color:#6B7280;margin-bottom:6px">PREDICT FIRST</div><p style="font-size:.9rem;line-height:1.55;color:#15171C;margin:0">You are about to audit three real facial-analysis systems against a benchmark balanced by gender and skin type. Before you run it: which group do you expect them to fail the most, and why?</p></div>';
    var method = '<p style="font-size:.78rem;line-height:1.5;color:#6b7280;margin:14px 0 0">This re-enacts Buolamwini and Gebru\'s published audit of three commercial systems (IBM, Microsoft, and Face++). The systems, the balanced benchmark, and the results are theirs; you are walking through what they found, not running a live classifier. Each marker is one benchmark face the system was tested on; red means the system got it wrong. The markers are neutral and do not depict anyone.</p>';
    var how = '<section class="activity-run-guide" aria-label="How this activity works" style="margin-top:16px"><div><b>How this activity works</b><ol><li>Run the audit on the first system.</li><li>Use the slice buttons to compare overall, gender, skin-type, and intersectional results.</li><li>Audit the next systems and ask whether the pattern repeats across the industry.</li></ol></div></section>';
    var leave = '<section class="activity-run-guide" aria-label="What to produce from this activity"><div><b>What you should leave with</b><p style="margin:0;font-size:.84rem;line-height:1.52;color:var(--ink-dim)">Write one sentence explaining why a high overall accuracy score can hide who the system fails most. Add that sentence to Activity Notes so it appears in Generate Your Weekly Notes.</p></div></section>';
    var grid = audit3dScene(run, slice, sys);
    var summary = run ? '<div style="background:' + (auditedCount >= 3 ? '#15171C' : '#F7F8FA') + ';color:' + (auditedCount >= 3 ? '#fff' : '#15171C') + ';border:1px solid ' + (auditedCount >= 3 ? '#15171C' : '#DEE3EA') + ';border-radius:12px;padding:14px 16px;margin:14px 0 0;font-size:.875rem;line-height:1.55">' + (auditedCount >= 3 ? 'You audited all three: IBM, Microsoft, and Face++. Every one failed darker-skinned women the most. The coded gaze is an industry pattern, not one bad product.' : esc(sys.name) + ' failed darker-skinned women the most. Audit the next system and watch whether the pattern repeats. (' + auditedCount + ' of 3 audited.)') + '</div>' : '';
    var results = run
      ? '<p id="bfs-insight" style="font-size:.875rem;line-height:1.55;color:#474C57;margin:14px 0 0">' + esc(auditInsight(slice)) + '</p>'
      : '<p style="font-size:.85rem;color:#6b7280;margin:14px 0 0">Run the audit, then slice the results to see what a single number hides.</p>';
    var check = studioCheck('BFS218|sandbox', {
      q: 'You ran a balanced benchmark and the system failed darker-skinned women far more than anyone else, with no racist rule written into it. Which concept names a harm like that, built into a system through its design and data rather than through intent?',
      options: ['The New Jim Code (Benjamin): discrimination built into systems that are sold as neutral, through their design and data', 'A prejudiced programmer who coded the bias on purpose', 'A random one-off software bug that can be patched and then forgotten'],
      answer: 0,
      why: 'This is the New Jim Code: the failure is produced by whose faces the system was built and tested to see, not by anyone writing a racist rule. Buolamwini and Gebru measured it, and the product still shipped, sold as neutral.'
    });
    var chain = '<div style="background:#F7F8FA;border:1px solid #DEE3EA;border-radius:12px;padding:15px 17px;margin:16px 0 0"><div class="mono" style="font-size:.6875rem;letter-spacing:.05em;color:#6B7280;margin-bottom:7px">CARRY THIS INTO YOUR ACCOUNTABILITY CHAIN</div><p style="font-size:.875rem;line-height:1.55;color:#15171C;margin:0">The system that fails darker-skinned women &#8594; the makers who built and shipped it, hiding the gap behind a high overall accuracy score &#8594; the institutions that buy and deploy it, in policing and at borders (the OPC and Robertson readings) &#8594; the people it is then used against &#8594; accountability across that whole chain, not one programmer &#8594; a response grounded in the resistance and design-justice readings (Tanksley, Costanza-Chock).</p></div>';
    var save = '<div style="margin-top:16px"><button onclick="SOC.saveSandbox()" style="background:var(--red);border:none;color:#fff;border-radius:9px;padding:10px 18px;font-size:.875rem;font-weight:600;cursor:pointer">Save my audit to the Accountability file (.docx)</button></div>';
    return mobileActivityActions(5, weekData(5) || {}) + '<section style="background:#fff;border:1px solid #DEE3EA;border-radius:14px;padding:18px 18px 22px;margin:0 0 22px;box-shadow:0 1px 2px rgba(21,23,28,.04)">'
      + '<div class="mono" style="font-size:.6875rem;letter-spacing:.06em;color:var(--red);font-weight:600;margin-bottom:6px">BIAS AUDIT</div>'
      + '<h1 style="font-size:1.75rem;font-weight:600;margin:0 0 8px">Audit the coded gaze</h1>'
      + '<p style="font-size:.9375rem;line-height:1.55;color:#474C57;margin:0 0 4px;">You are the auditor. Run a balanced benchmark on a facial-analysis system, then find the bias its makers missed, the way Buolamwini and Gebru did.</p>'
      + openBtn + predict + method + how + grid + summary + results + auditFallbackTable() + check + leave + chain + weekNoteBox(5, 'activity', 'Activity Notes', 'Write the sentence you would use to explain why the coded gaze is an intersectional problem.') + save
      + '</section>';
  }
  function cardsScreen() {
    var weeks = weeksWithReadings();
    var sel = state.cardWeek;
    var list = (D.glossary || []).filter(function (g) { return sel == null || g.week === sel; });
    var opts = '<option value="">All weeks</option>' + weeks.map(function (w) { return '<option value="' + w + '"' + (sel === w ? ' selected' : '') + '>Week ' + w + ': ' + esc(weekTitle(w)) + '</option>'; }).join('');
    return '<div class="rise">'
      + '<div class="mono" style="font-size:.75rem;letter-spacing:.06em;color:#6B7280;margin-bottom:8px">SELF-CHECK</div>'
      + '<h1 style="font-size:1.75rem;font-weight:600;margin:0 0 8px">Recall the concepts</h1>'
      + '<p style="font-size:.9375rem;color:#474C57;margin:0 0 18px;">Read the concept, define it in your own words, then flip the card to check yourself. Each card is one concept. Private study, never a test.</p>'
      + '<label for="soc-cardweek" style="font-size:.8125rem;font-weight:600;color:#474C57;display:block;margin-bottom:6px">Show concepts for</label>'
      + '<select id="soc-cardweek" onchange="SOC.cardWeek(this.value)" style="max-width:360px;padding:9px 12px;border:1px solid #DEE3EA;border-radius:9px;background:#fff;font-size:.9375rem;color:#15171C;margin-bottom:20px">' + opts + '</select>'
      + selfCheckStudio(sel)
      + '<div class="soc-cardgrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">' + list.map(card).join('') + '</div></div>';
  }

  /* ---------- immersive journey shell (cascaded, course-aware) ---------- */
  var JOURNEY_Q = {
    BFS218: {
      1: 'Can a technology sold as neutral still carry old racism forward?',
      2: 'Why does harm show up most clearly at the intersection of systems?',
      3: 'If no one set out to discriminate, how does a system still get built to produce unequal outcomes?',
      4: 'When a system\'s default setting quietly harms some people, who chose that default, and why does it look neutral?',
      5: 'What happens when a system is built to see some faces better than others?',
      6: 'When policing and borders run on algorithms, who is watched, and who gets to decide?',
      7: 'What are the parts of a discriminatory system, and how do they work together to produce harm?',
      8: 'Who owns the data, and who controls the story it tells?',
      9: 'When technology is sold as help, who really benefits, and who pays the hidden cost?',
      10: 'When an algorithm decides who gets help, who gets left behind?',
      11: 'If the tools carry the harm, who gets to redesign them?',
      12: 'Who is accountable when the system causes harm, and does the law keep up?',
      13: 'What does your own map show you now that it could not show you in Week 1?',
      14: 'Can a machine be racist? Answer it in your own words, with your map as the evidence.'
    },
    PSY355: {
      1: 'What actually makes someone resilient: their grit, or the resources around them?',
      3: 'Does believing you can grow change your results, and when does it not?',
      4: 'Where does the confidence to keep going actually come from?',
      5: 'Is a hard stretch a verdict on who you are, or a stage you move through?',
      6: 'Why does the same support help one person and not another?',
      7: 'Can adversity itself become a source of growth, and how?',
      8: 'Is being hard on yourself what keeps you going, or what wears you down?',
      9: 'What lets you keep going without breaking, persistence or flexibility?',
      10: 'Can writing about your own experience actually build resilience?',
      11: 'What makes asking for help actually work?'
    }
  };
  function journeyQ(w) { var c = (D.course && D.course.code) || ''; return (JOURNEY_Q[c] && JOURNEY_Q[c][w]) || 'What is this week asking you to see?'; }
  function journeyWeeks() {
    var ws = weeksWithReadings(), c = (D.course && D.course.code) || '', set = {};
    ws.forEach(function (w) { set[w] = 1; });
    if (typeof WEEKPAGE !== 'undefined' && WEEKPAGE[c]) Object.keys(WEEKPAGE[c]).forEach(function (w) { set[+w] = 1; });
    return Object.keys(set).map(Number).sort(function (a, b) { return a - b; });
  }
  function currentJourneyWeek() { var ws = journeyWeeks(); if (!ws.length) return null; if (state.journeyWeek && ws.indexOf(state.journeyWeek) >= 0) return state.journeyWeek; return ws[0]; }
  function heroArt() {
    return '<svg class="jhero-art" viewBox="0 0 800 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'
      + '<path d="M0,250 C160,210 300,300 460,250 C620,200 720,260 800,230 L800,320 L0,320 Z" fill="#961A13" fill-opacity=".06"/>'
      + '<path d="M0,285 C180,250 320,320 500,280 C660,245 740,295 800,275 L800,320 L0,320 Z" fill="#1B2A4A" fill-opacity=".04"/>'
      + '<g stroke="#961A13" stroke-opacity=".12" fill="none" stroke-width="1.4"><path d="M360,150 C480,110 600,180 760,130 C800,116 810,120 830,112"/><path d="M360,185 C480,150 600,215 760,165 C800,150 810,156 830,148"/></g>'
      + '<g fill="#961A13" fill-opacity=".18"><circle cx="690" cy="70" r="2.6"/><circle cx="742" cy="118" r="1.8"/><circle cx="636" cy="52" r="1.6"/></g>'
      + '</svg>';
  }
  function journeyIntro() { return 'Follow one question through the whole course, week by week. Each week sets up what to read, why it matters, and one thing to do with it. Start at the top, or pick up where you left off.'; }
  function journeyHome() {
    var ws = journeyWeeks(), cur = currentJourneyWeek(), started = !!state.journeyWeek;
    var title = (D.course && (D.course.name || D.course.code)) || 'Your course';
    var ctaLabel = started ? ('Resume Week ' + cur) : ('Start Week ' + (ws[0] || 1));
    var hero = '<section class="jhero jfade" style="margin-bottom:26px;border-top:5px solid var(--amode)">' + heroArt()
      + '<img class="home-hero-img" src="images/hero.jpg" alt="' + esc(title) + '" loading="lazy" onerror="this.remove()">'
      + '<div style="position:relative;">'
      + '<div class="mono" style="font-size:.78rem;letter-spacing:.09em;color:var(--amode);font-weight:700;margin-bottom:14px">FULLY ASYNCHRONOUS &middot; YOU SET THE PACE</div>'
      + '<h1 class="jhero-title" style="font-size:3rem;line-height:1.04;font-weight:700;margin:0 0 16px;letter-spacing:-.01em;color:var(--ink)">You run this course.</h1>'
      + '<p style="font-size:1.18rem;line-height:1.55;color:var(--ink);margin:0 0 20px;font-weight:500">No live class carries you along, and nothing waits somewhere else. Every reading, walkthrough, activity, and check is right here, and the pace between the two due dates is yours to set. That is not a lighter class. It is the harder skill that outlasts any single course: learning to direct yourself.</p>'
      + '<div style="display:flex;flex-wrap:wrap;gap:8px;margin:0 0 18px">' + ['No live classes', 'You set the pace', 'Two fixed due dates', 'Complete by design'].map(function (t) { return '<span class="mono" style="font-size:.72rem;font-weight:700;letter-spacing:.03em;color:var(--amode);background:#FBF4F3;border:1px solid #F0C8C3;border-radius:999px;padding:5px 12px">' + esc(t) + '</span>'; }).join('') + '</div>'
      + '<div class="mono" style="font-size:.72rem;letter-spacing:.06em;color:var(--ink-faint);font-weight:600">SENECA POLYTECHNIC &middot; FALL 2026 &middot; <span style="color:var(--ink-dim)">' + esc(title) + '</span></div>'
      + '</div></section>';
    var spineHead = '<div style="display:flex;align-items:baseline;gap:12px;margin:0 0 16px;flex-wrap:wrap"><h2 style="font-size:1.375rem;font-weight:600;margin:0;color:var(--ink)">Your journey</h2><span style="font-size:.875rem;color:var(--ink-faint)">' + ws.length + ' weeks, in course order</span></div>';
    var cw = courseWeekByDate();
    var doneN = ws.filter(function (x) { return weekHasWork(x); }).length;
    var thisWeek = '<button type="button" class="jnow" onclick="SOC.station(' + cw.week + ')"><div class="jnow-l"><span class="mono jnow-tag">' + (cw.phase === 'before' ? 'BEFORE YOU START' : (cw.phase === 'after' ? 'FINAL STRETCH' : 'SUGGESTED PACE, YOU ARE HERE')) + '</span><b>Week ' + cw.week + ': ' + esc(weekTitle(cw.week)) + '</b><span class="jnow-date">' + esc(weekDate(cw.week)) + '</span></div><span class="jnow-go">Open' + ic('chevron', 16, 2.4) + '</span></button>';
    var meter = '<div class="jprog"><div class="jprog-bar"><span style="width:' + Math.round(100 * doneN / (ws.length || 1)) + '%"></span></div><span class="jprog-txt">' + doneN + ' of ' + ws.length + ' weeks started</span></div>';
    var frame = '<section class="node home-frame" aria-label="How to read this course" style="border-left:4px solid #1B2A4A;border-radius:0 14px 14px 0;margin:0 0 16px">' + '<div class="mono" style="font-size:.7rem;letter-spacing:.08em;color:#1B2A4A;font-weight:700;margin-bottom:8px">HOW TO READ THIS COURSE</div>' + '<p style="font-size:1rem;line-height:1.62;color:var(--ink);margin:0">Techno-racism is not the problem of a single group, and it is not a simple story of one side against another. Digital systems sort everyone: who is seen clearly and who is blurred, who is trusted by default and who has to prove themselves, who a tool was built for and who it was not. That sorting falls hardest on communities already marked: Black and Indigenous peoples, Muslim and Asian communities, women, disabled people, and language minorities, often several of these at once. It also quietly hands advantages to others. Part of the work this term is to see the whole picture, including where you and your own community sit in it. The honest view is not black and white. It is grey, and it includes everyone.</p>' + '</section>';
    return '<div class="rise">' + hero + asyncOrientation() + asyncCase() + asyncProgress(ws) + thisWeek + spineHead + journeyStations(cw.week) + frame + homeIntroCollapsible() + compassPanel() + lensHomeIntro() + '</div>';
  }
  function asyncCase() {
    var points = [
      ['It builds the rarest skill: directing yourself', 'Planning your own time, setting your own pace, checking your own understanding, and pushing through when you are stuck are the exact capacities that matter in work and in life. A live class carries you along. An asynchronous course teaches you to carry yourself, and that skill outlasts the course.'],
      ['It makes a serious course reachable', 'You can learn at six in the morning or eleven at night, from anywhere, around a job, a family, or a long commute. Flexibility is not a discount on rigour. It is what lets more people do rigorous work at all.'],
      ['It lets you learn at the depth each idea needs', 'Slow down on a hard concept. Move quickly through a familiar one. Go back as many times as you want. No one is setting a single speed for the whole room, so you can reach real understanding instead of only keeping up.'],
      ['It is complete by design', 'Because there is no live class to fill the gaps, everything is here and built to stand on its own: the walkthrough teaches, the readings anchor, the activities rehearse, and the checks confirm. Nothing you need is somewhere else.']
    ];
    return '<section class="node async-case" style="border:1px solid #F0C8C3;border-left:4px solid var(--amode);border-radius:0 14px 14px 0;background:#FBF4F3;padding:24px 26px;margin:0 0 22px">'
      + '<div class="mono" style="font-size:.72rem;letter-spacing:.08em;color:var(--amode);font-weight:700;margin-bottom:10px">WHY LEARN THIS WAY</div>'
      + '<h2 style="font-size:1.35rem;line-height:1.2;font-weight:600;margin:0 0 8px;color:var(--ink)">Asynchronous is not a lesser version of a class. It is a different way to learn, with real advantages.</h2>'
      + '<p style="font-size:1rem;line-height:1.6;color:var(--ink-dim);margin:0 0 16px">This course was designed to be taken on your own, on purpose. Here is what that design gives you.</p>'
      + '<div style="display:grid;gap:14px">' + points.map(function (pt) { return '<div><b style="font-size:1.02rem;color:var(--ink)">' + esc(pt[0]) + '</b><p style="font-size:.93rem;line-height:1.55;color:var(--ink-dim);margin:3px 0 0">' + esc(pt[1]) + '</p></div>'; }).join('') + '</div>'
      + '</section>';
  }
  function asyncOrientation() {
    var moves = [
      ['You set the pace', 'No one is moving the class along. The suggested rhythm is one week at a time, but you can go faster or catch up. The only fixed points are the two due dates.'],
      ['The walkthrough is your lecture', 'There is no live class explaining the ideas out loud. In Weeks 2 to 12, the walkthrough is where the teaching happens. Open it first, then read.'],
      ['You check your own understanding', 'No one is watching you learn. The Knowledge Checks, Reading Practice, and flashcards are how you find out whether an idea actually landed. Use them honestly.'],
      ['When you are stuck, you still have moves', 'You cannot raise your hand in the moment, but you are not alone: re-open the walkthrough, search the Glossary, post in the Blackboard discussion, and email me. Replies come within about a business day, not in real time.'],
      ['You keep your own record', 'This site is a study space, not storage. Run Generate Your Weekly Notes at the end of each week and keep the downloaded file. Never draft graded work here, and never count on the browser to hold anything you care about.']
    ];
    return '<section class="node async-guide" style="border:1px solid var(--soft);border-top:4px solid var(--amode);border-radius:14px;padding:26px 28px;margin:0 0 22px">'
      + '<div class="mono" style="font-size:.72rem;letter-spacing:.08em;color:var(--amode);font-weight:700;margin-bottom:10px">HOW TO RUN IT YOURSELF</div>'
      + '<h2 style="font-size:1.6rem;line-height:1.16;font-weight:600;margin:0 0 10px;color:var(--ink)">Five moves put you in the driver\'s seat.</h2>'
      + '<p style="font-size:1.05rem;line-height:1.6;color:var(--ink);margin:0 0 20px">A classroom usually carries the load of keeping everyone moving, checking who understood, and filling the gaps as they show up. Here that job is yours, by design. These five moves are how you carry it well.</p>'
      + '<div style="display:grid;gap:14px">' + moves.map(function (m, i) { return '<div style="display:flex;gap:14px;align-items:flex-start"><span class="mono" style="flex:none;width:27px;height:27px;border-radius:50%;background:var(--amode);color:#fff;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:700">' + (i + 1) + '</span><div><b style="font-size:1.02rem;color:var(--ink)">' + esc(m[0]) + '</b><p style="font-size:.93rem;line-height:1.5;color:var(--ink-dim);margin:3px 0 0">' + esc(m[1]) + '</p></div></div>'; }).join('') + '</div>'
      + '</section>';
  }
  function weekDriven(w) {
    try { var s = (state.wkSteps && state.wkSteps[w]) || {}; var n = 0, k; for (k in s) { if (s[k]) n++; } return n >= 4 || weekDone(w); } catch (e) { return false; }
  }
  function asyncProgress(ws) {
    var driven = ws.filter(weekDriven).length, cw = courseWeekByDate();
    var dots = ws.map(function (w) {
      var dv = weekDriven(w), isCur = (w === cw.week);
      return '<button type="button" class="ap-dot' + (dv ? ' on' : '') + (isCur ? ' cur' : '') + '" onclick="SOC.station(' + w + ')" title="Week ' + w + ': ' + esc(weekTitle(w)) + '" aria-label="Week ' + w + (dv ? ', driven' : '') + '">' + (dv ? '&#10003;' : w) + '</button>';
    }).join('');
    var pct = Math.round(100 * driven / (ws.length || 1));
    var pace = '';
    if (cw.phase === 'during') {
      var expected = ws.filter(function (x) { return x < cw.week; }).length;
      var firstOpen = null, wi;
      for (wi = 0; wi < ws.length; wi++) { if (ws[wi] <= cw.week && !weekDriven(ws[wi])) { firstOpen = ws[wi]; break; } }
      if (firstOpen === null) firstOpen = cw.week;
      if (driven >= expected && expected > 0) {
        pace = '<div class="ap-pace ap-pace-on"><b>You are on pace.</b> The calendar sits in Week ' + cw.week + ' territory and your driving matches it. Keep the rhythm.</div>';
      } else if (expected - driven === 1) {
        pace = '<div class="ap-pace"><b>One week of breathing room used.</b> The calendar sits in Week ' + cw.week + ' territory. No penalty, the pace is yours: the next unfinished week is <button type="button" class="ap-pace-go" onclick="SOC.station(' + firstOpen + ')">Week ' + firstOpen + '</button>.</div>';
      } else if (expected - driven > 1) {
        pace = '<div class="ap-pace"><b>The calendar has moved ahead of your map.</b> It sits in Week ' + cw.week + ' territory. That is allowed here; the shortest way back is one week at a time, starting with <button type="button" class="ap-pace-go" onclick="SOC.station(' + firstOpen + ')">Week ' + firstOpen + '</button>.</div>';
      }
    }
    var WINDOWS = [
      { name: 'Window 1', opens: '2026-09-21', due: '2026-10-25', dueTxt: 'due Sunday, October 25', items: 'Compass Check, Map Exchange checkpoint, Canadian Case File' },
      { name: 'Window 2', opens: '2026-11-02', due: '2026-12-11', dueTxt: 'due Friday, December 11', items: 'Design the Repair, Personal Cartography, Map Exchange close' }
    ];
    var arcs = WINDOWS.map(function (wd) {
      var toOpen = kdDaysUntil(wd.opens), toDue = kdDaysUntil(wd.due);
      var span = Math.max(1, Math.round((new Date(wd.due + 'T12:00:00') - new Date(wd.opens + 'T12:00:00')) / 86400000));
      var st, bar = 0;
      if (toOpen > 0) st = '<span class="aw-chip">Opens in ' + toOpen + (toOpen === 1 ? ' day' : ' days') + '</span>';
      else if (toDue >= 0) { bar = Math.min(100, Math.round(100 * (span - toDue) / span)); st = '<span class="aw-chip aw-open">OPEN, ' + toDue + (toDue === 1 ? ' day' : ' days') + ' left</span>'; }
      else { st = '<span class="aw-chip aw-done">Closed</span>'; bar = 100; }
      return '<div class="aw-card"><div class="aw-head"><b>' + wd.name + '</b>' + st + '</div>'
        + '<div class="aw-track"><span style="width:' + bar + '%"></span></div>'
        + '<div class="aw-items">' + wd.items + ' <em>' + wd.dueTxt + '</em></div></div>';
    }).join('');
    return '<section class="node async-progress">'
      + '<div class="ap-head"><div><div class="mono" style="font-size:.72rem;letter-spacing:.08em;color:var(--amode);font-weight:700;margin-bottom:6px">YOUR PROGRESS, YOUR PACE</div>'
      + '<h2 style="font-size:1.5rem;font-weight:600;margin:0;color:var(--ink)">You have driven <span style="color:var(--amode)">' + driven + '</span> of ' + ws.length + ' weeks</h2></div>'
      + '<div class="ap-pct">' + pct + '%</div></div>'
      + '<div class="ap-dots">' + dots + '</div>'
      + pace
      + '<div class="aw-row">' + arcs + '</div>'
      + '<p class="ap-note">A week counts as driven once you have checked off its four steps. No one marks this for you. The pace is yours, and the only fixed points are the two due dates.</p>'
      + '</section>';
  }
  function journeyStations(cur) {
    var ws = journeyWeeks();
    var studyDivider = '<div style="display:flex;align-items:center;gap:12px;padding:11px 16px;border:1px dashed var(--border);border-radius:12px;background:#FAFBFC"><span class="mono" style="font-size:.66rem;font-weight:700;letter-spacing:.06em;color:var(--red)">STUDY WEEK</span><span style="font-size:.86rem;color:var(--ink-dim)">' + STUDY_WEEK_DATE + ' &middot; Nothing new opens and nothing is due. The first half closed on Sunday, October 25; rest and reset</span></div>';
    var out = '', studyIn = false;
    var studyMarker = function () { var m = (ws.indexOf(7) < 0) ? '<div style="display:flex;align-items:center;gap:12px;padding:11px 16px;border:1px dashed var(--border);border-radius:12px;background:#FAFBFC"><span class="mono" style="font-size:.66rem;font-weight:700;letter-spacing:.06em;color:var(--ink-faint)">WEEK 7</span><span style="font-size:.86rem;color:var(--ink-dim)">' + esc(weekDate(7)) + ' &middot; Cumulative review, no new readings</span></div>' : ''; return m + studyDivider; };
    ws.forEach(function (w) {
      if (!studyIn && w >= 8) { out += studyMarker(); studyIn = true; }
      var recs = recordsForWeek(w), n = recs.length, isCur = (w === cur);
      var note = (w === OVERVIEW_WEEK && !weekData(w)) ? 'Course overview' : (WORK_WEEKS.indexOf(w) >= 0 ? 'Focus on your work, no new material' : (n + (n === 1 ? ' reading' : ' readings')));
      out += '<button class="jstation' + (isCur ? ' cur' : '') + '" onclick="SOC.station(' + w + ')">'
        + '<div style="display:flex;align-items:flex-start;gap:16px">'
        + '<span class="jdot" style="display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;flex:none;border-radius:12px;background:' + (weekDriven(w) ? 'var(--amode)' : (isCur ? 'var(--red)' : '#1B2A4A')) + ';color:#fff;font-family:var(--mono);font-size:1.0625rem;font-weight:600">' + (weekDriven(w) ? '&#10003;' : w) + '</span>'
        + '<div style="flex:1;min-width:0">'
        + '<div style="display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:3px">' + (isCur ? '<span class="mono" style="font-size:.625rem;font-weight:700;letter-spacing:.06em;color:#B02318;background:#F6E3E1;padding:2px 8px;border-radius:999px">THIS WEEK</span>' : '') + lensCardBadge(w) + '<span class="mono" style="font-size:.66rem;color:var(--ink-faint);letter-spacing:.03em">' + esc(weekDate(w)) + '</span></div>'
        + (weekDriven(w) ? '<span class="mono" style="font-size:.625rem;font-weight:700;letter-spacing:.06em;color:#961A13;background:#FBF4F3;border:1px solid #F0C8C3;border-radius:999px;padding:2px 8px">DRIVEN</span>' : (weekHasWork(w) ? '<span class="mono" style="font-size:.625rem;font-weight:700;letter-spacing:.06em;color:#961A13;background:#FBF4F3;border:1px solid #F0C8C3;border-radius:999px;padding:2px 8px">IN PROGRESS</span>' : ''))
        + '<h3 style="font-size:1.0625rem;font-weight:600;margin:0 0 2px;color:var(--ink)">' + esc(weekTitle(w)) + '</h3>'
        + '<p style="font-size:.9375rem;line-height:1.5;color:var(--ink-dim);margin:0 0 8px">' + esc(journeyQ(w)) + '</p>' + lensCardLine(w)
        + '<div style="display:flex;align-items:center;gap:7px;font-size:.75rem;color:var(--ink-faint)"><span style="display:inline-flex;color:#6B7280">' + ic('book', 13) + '</span>' + esc(note) + '<span style="margin:0 4px">&middot;</span><span style="color:var(--red);font-weight:600">Open &rarr;</span></div>'
        + '</div></div></button>';
      if (w === 7) { out += studyDivider; studyIn = true; }
    });
    return '<div style="display:flex;flex-direction:column;gap:12px">' + out + '</div>';
  }
  function stationFraming(w, recs) {
    if (recs.length > 1) return 'This week brings ' + recs.length + ' readings together. Read them as parts of one argument, not as separate facts.';
    if (recs.length === 1) return 'This week turns on one reading. Read it closely, then do something with it.';
    return '';
  }
  function stationReading(r, kicker) {
    var u = readUrl(r), accent = '#3a47a8';
    var look = r.assigned ? ('<div style="margin-top:10px;background:#F7F8FA;border-left:3px solid ' + accent + ';padding:8px 12px;border-radius:0 8px 8px 0;font-size:.8125rem;line-height:1.5;color:var(--ink-dim)"><span style="font-weight:600;color:var(--ink)">Read:</span> ' + esc(r.assigned) + '</div>') : '';
    return '<div style="border:1px solid var(--border);border-top:4px solid ' + accent + ';background:#fff;border-radius:13px;padding:17px 19px">'
      + '<div style="display:flex;align-items:center;gap:9px;margin-bottom:7px"><span class="mono" style="font-size:.625rem;font-weight:700;letter-spacing:.04em;color:' + accent + '">' + esc(kicker) + '</span></div>'
      + '<h3 style="font-size:1.1875rem;line-height:1.3;font-weight:600;margin:0 0 3px;color:var(--ink)">' + esc(r.title) + '</h3>'
      + '<div style="font-size:.8125rem;color:var(--ink-dim);margin-bottom:9px">' + esc(r.authors) + ' &middot; ' + esc(String(r.year)) + '</div>'
      + '<p style="font-size:.9375rem;line-height:1.55;color:var(--ink-dim);margin:0">' + esc(r.coreIdea) + '</p>'
      + look
      + '<div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap">'
      + (u ? '<button onclick="SOC.read(\'' + r.id + '\')" style="display:inline-flex;align-items:center;gap:7px;background:var(--red);border:none;color:#fff;border-radius:9px;padding:9px 16px;font-size:.875rem;font-weight:600;cursor:pointer">Open the reading' + ic('external', 14, 2.2) + '</button>' : '')
      + '<button onclick="SOC.open(\'' + r.id + '\')" style="background:#fff;border:1px solid var(--border);color:var(--ink);border-radius:9px;padding:9px 16px;font-size:.875rem;font-weight:600;cursor:pointer">Details</button>'
      + '</div></div>';
  }
  function stationDo(w) {
    var tiles = [['See it for yourself', 'Work this week\'s readings in the Self-Check Studio.', 'clipboard', 'SOC.goWeek(\'cards\',' + w + ')']];
    if (D.course && D.course.frame) tiles.push(['Locate it on your map', 'Add this week to your Personal Cartography.', 'globe', 'SOC.go(\'map\')']);
    if (D.course && D.course.code === 'BFS218') tiles.push(['Audit a system', 'Watch a racialized harm appear in the sandbox, then name it.', 'search', 'SOC.go(\'sandbox\')']);
    if (D.course && D.course.code === 'PSY355') tiles.push(['Build your resilience', 'Bring this week into your Resilience Ecology.', 'layers', 'SOC.go(\'ecology\')']);
    tiles.push(['Hold two readings together', 'Compare any two readings, side by side.', 'columns', 'SOC.go(\'compare\')']);
    var th = tiles.map(function (t) {
      return '<button class="jtile" onclick="' + t[3] + '"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:11px;background:#F6E3E1;color:var(--red)">' + ic(t[2], 19) + '</span><h4 style="font-size:1rem;font-weight:600;margin:4px 0 0;color:var(--ink)">' + t[0] + '</h4><p style="font-size:.84rem;line-height:1.5;color:var(--ink-dim);margin:0">' + t[1] + '</p></button>';
    }).join('');
    return '<div style="margin-top:8px"><div class="mono" style="font-size:.6875rem;letter-spacing:.05em;color:var(--ink-faint);margin:0 0 12px">NOW DO SOMETHING WITH IT</div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px">' + th + '</div></div>';
  }
  var WEEKPAGE = {
    BFS218: {
      5: {
        time: 'Flexible pacing: work in manageable blocks and use breaks and accessibility supports as needed.',
        deck: 'BFS218_Week05',
        overview: 'This week is about who gets seen by technology, and who does not, and why that is not an accident. Some people are watched, scanned, and tracked far more than others. Some are barely recognized at all. Both can do harm, and for racialized communities the two often happen at the same time. You will learn to name this pattern, look at hard evidence for it in real facial-recognition systems, and find an example of it in your own life.',
        purpose: 'Coded exposure is the third part of Ruha Benjamin\'s idea of the New Jim Code: being visible to technology is handed out unevenly, on purpose, in the way systems are designed. The point of this week is to help you spot that unevenness and say plainly what harm it causes. It builds on intersectionality from Week 2 and sets up the work on accountability later in the course.',
        outcomes: ['Explain coded exposure: the uneven, designed way technology makes some people very visible and others invisible.', 'Explain why being over-watched and being unrecognized can both be harmful, and can happen to the same people at once.', 'Describe the coded gaze and point to the Gender Shades study as evidence for it.', 'Find a real example of coded exposure and add it to your Personal Cartography.'],
        guiding: ['What are the different meanings of the word "exposure," and how does Benjamin use them all at once?', 'Is being visible a trap? When does being seen by a system protect you, and when does it put you at risk?', 'Where have you seen the coded gaze: a camera or app that reads some people well and others badly?', 'Who does a system you use make very visible, and who does it make invisible?', 'Koenecke and colleagues found speech-to-text systems making about twice as many errors for Black speakers. Where does being misheard by a machine, not only unseen, put someone at a disadvantage?'],
        checks: [
          { t: 'What coded exposure means: who technology makes very visible, and who it makes invisible', look: 'the Key Concepts and the Benjamin reading' },
          { t: 'Why being over-watched and being unseen can both be harms, often at the same time', look: 'the Key Concepts for this week' },
          { t: 'The coded gaze: whose face a system is built to recognize, and the Gender Shades evidence', look: 'the Buolamwini and Gebru reading' },
          { t: 'Why a system can be very accurate overall and still be unsafe', look: 'the activity and the Key Concepts' },
          { t: 'Spotting an example of coded exposure in your own daily life', look: 'the activity and your Personal Cartography' }
        ],
        concepts: [
          { h: 'Visibility is handed out by design', body: 'Technology does not see everyone equally, and that gap is built in, not an accident. Some groups are made highly visible to cameras and systems, while others are barely registered at all. Think of an automatic faucet that turns on for some hands but not others, or a camera that locks onto some faces and slides past the rest: the unevenness is a design choice, even when no single person chose it on purpose.', cite: 'Benjamin, 2019' },
          { h: 'Being seen can hurt, and so can being unseen', body: 'Being watched, scanned, and tracked is a harm. But not being recognized, by a system that cannot read your face or will not serve you, is also a harm. For racialized people these are not opposites you choose between; both can land at once, over-surveilled by police cameras yet missed by the systems meant to help.', cite: 'Benjamin, 2019' },
          { h: 'The coded gaze: whose face a system is built to see', body: 'This is Joy Buolamwini\'s name for the way a system is designed and tested around some faces and not others. The 2018 Gender Shades study measured it: facial-analysis tools were nearly perfect on lighter-skinned men but failed darker-skinned women far more often. The bias does not come from one cruel programmer, it comes from whose faces filled the data and the tests.', cite: 'Buolamwini & Gebru, 2018' },
          { h: 'Accurate is not the same as safe', body: 'Even a system that recognizes you correctly can still put you in danger by watching and exposing you. A face scanner that works perfectly at a protest or a border does not protect the people it identifies, it exposes them. So the real question is not only how often a system is wrong, but who it gets used against.', cite: 'Benjamin, 2019' },
          { h: 'The coded gaze has an ear', body: 'The coded gaze is not only about what a system sees, it is also about what it hears. Koenecke and colleagues tested five major speech-to-text systems and found they misrecognized Black speakers about twice as often as white speakers, even when both said the same words. The failure sits in systems trained on too little Black speech, not in how anyone speaks. So voice assistants, captioning, and voice-controlled services can quietly shut out the people they mishear.', cite: 'Koenecke et al., 2020' }
        ],
        terms: [
          { term: 'Coded exposure', def: 'the uneven, designed way technology makes some people highly visible and others invisible.', cite: 'Benjamin, 2019' },
          { term: 'The coded gaze', def: 'whose face a system is built to recognize; the bias baked into who it sees well and who it does not.', cite: 'Buolamwini & Gebru, 2018' },
          { term: 'Intersectionality', def: 'the idea that race and gender (and other parts of who we are) overlap, so a harm aimed at darker-skinned women can be missed if you look at race alone or gender alone.', cite: 'Crenshaw, 1991' },
          { term: 'The New Jim Code', def: 'Benjamin\'s name for new technologies that carry old racism forward while looking neutral or even fair.', cite: 'Benjamin, 2019' },
          { term: 'Speech recognition bias', def: 'the pattern where automated speech recognition makes far more errors for racialized and non-standard speech, so language minorities are misheard or locked out of voice-driven tools.', cite: 'Koenecke et al., 2020' }
        ],
        readings: [
          { apa: 'Benjamin, R. (2019). Race after technology: Abolitionist tools for the New Jim Code. Polity Press.', scope: 'Read: the chapter on coded exposure (pages assigned on Blackboard)', id: 'benjamin2019' },
          { apa: 'Buolamwini, J., & Gebru, T. (2018). Gender shades: Intersectional accuracy disparities in commercial gender classification. Proceedings of Machine Learning Research, 81, 77-91.', scope: 'Open access', id: 'buolamwini2018' },
          { apa: 'Crenshaw, K. (1991). Mapping the margins: Intersectionality, identity politics, and violence against women of color. Stanford Law Review, 43(6), 1241-1299.', scope: 'Foundational, first assigned in Week 2', id: 'crenshaw1991' },
          { apa: 'Koenecke, A., Nam, A., Lake, E., Nudell, J., Quartey, M., Mengesha, Z., Toups, C., Rickford, J. R., Jurafsky, D., & Goel, S. (2020). Racial disparities in automated speech recognition. Proceedings of the National Academy of Sciences, 117(14), 7684-7689. https://doi.org/10.1073/pnas.1915768117', scope: 'Open access, about 6 pages', id: 'koenecke2020' }
        ],
        activity: { screen: 'sandbox', title: 'Audit the Coded Gaze', what: 'You step into the role of a bias auditor and run a real benchmark, the same test Buolamwini and Gebru used, on three commercial facial-analysis systems (IBM, Microsoft, and Face++).', why: 'so you find the bias yourself instead of being told about it. You will see how it hides behind a high overall accuracy score, and how it shows up in every system, not just one bad product.' },
        youcan: ['Explain coded exposure in your own words', 'Say why being over-watched and being unrecognized can both be harms', 'Describe the coded gaze and point to the Gender Shades evidence'],
        reflectPrompt: 'In a sentence or two: where in your own life is being visible handed out by design, and who decides?'
      },
      1: {"time": "Flexible pacing: work in manageable blocks and use breaks and accessibility supports as needed.", "deck": "", "overview": "Welcome to the course. Our work this term is to learn to see something that is built to stay out of sight: techno-racism, the way racial bias is carried inside the technologies we use every day, from search bars to hiring tools to facial recognition. It hides because the systems look neutral, even helpful, while they quietly do the old work of exclusion in new clothes. That is exactly why a course about racism spends a whole term on technology: the harm has moved into the design, the data, and the defaults, and learning to read it there is the skill this course builds. This first week is lighter on dense theory on purpose, because before we analyse a single algorithm we need a shared language and a shared question.", "purpose": "Week 1 answers one question: why would a course about racism spend an entire term on technology? It introduces techno-racism as a real and specific form of racial inequity that lives inside the design of digital systems, not only inside individual attitudes. This is a week about learning to look, and it launches the Personal Cartography, the assignment that turns that critical looking into a habit.", "outcomes": ["By the end of this week you can define techno-racism in your own words and explain why it is often invisible to the people it does not harm.", "By the end of this week you can name Benjamin's New Jim Code and give one clear example of a system that looks neutral while reproducing inequity.", "By the end of this week you can begin to apply an intersectional lens, recognizing that race interacts with gender, class, and other identities in how technology treats people.", "By the end of this week you can start your Personal Cartography by noticing at least one moment from your own digital life to map."], "guiding": ["Can a machine be racist, when a machine has no feelings and no intent?", "Why is techno-racism harder to see than a sign on a door or a slur said out loud?", "Who builds the digital systems that sort, score, and screen us, and whose experience gets treated as the default?", "If a system is promoted as objective, neutral, or helpful, what questions should that promise make you ask?"], "checks": [{"t": "What techno-racism means: racial bias built into the data, defaults, and design of digital systems, not only into people", "look": "the Key Concepts and the Benjamin reading"}, {"t": "The New Jim Code: how an old inequity gets carried forward by a tool that looks objective, fair, or even helpful", "look": "the Benjamin reading"}, {"t": "Why a system can produce racially unequal outcomes even when no single person intends harm", "look": "the Key Concepts for this week"}, {"t": "An intersectional lens: how race interacts with gender and class in how a system treats people, and the Gender Shades example", "look": "the Crenshaw and Buolamwini and Gebru readings"}, {"t": "Noticing one moment in your own digital life where a machine sorts, scores, or screens you", "look": "the activity and your Personal Cartography"}], "concepts": [{"h": "Techno-racism", "body": "Techno-racism names the way racial bias is embedded inside technical systems: the algorithms, datasets, defaults, and design choices that shape digital life. It is racism that operates through technology rather than only through individual people. A landlord can refuse a tenant; a tenant-screening algorithm can do the same thing at scale, quietly, and call it a risk score. The key move is to stop treating technology as separate from society and to notice that these systems are often shaped by people with racial, ethnic, and cultural privilege, who can build, without meaning to, systems that treat whiteness as the default.", "cite": "Benjamin, 2019"}, {"h": "The New Jim Code", "body": "This is the engine of the whole course. Ruha Benjamin defines the New Jim Code as new technologies that reflect and reproduce existing inequities while being promoted and perceived as more objective or progressive than the discriminatory systems of an earlier era. Hold onto three things. First, the technology carries an old inequity forward; it does not invent racism. Second, it is dressed in the language of progress, so it looks neutral, fair, or even benevolent. Third, that appearance of objectivity is exactly what makes it dangerous, because it discourages the scrutiny that would catch it. Benjamin names four dimensions of the New Jim Code that organize the middle of the term, and you meet each one in its own week.", "cite": "Benjamin, 2019"}, {"h": "Intersectionality", "body": "Intersectionality, from legal scholar Kimberle Crenshaw, is the idea that systems of identity and power do not act one at a time. Race, gender, class, and other categories overlap, and a person at the intersection can face a harm that looking at any single category would miss. We introduce it in Week 1 because the harms we will study are rarely about race alone. Buolamwini and Gebru found that facial-analysis systems failed most often not for darker-skinned people in general, nor for women in general, but specifically for darker-skinned women, at the overlap. Intersectionality is the tool that lets you ask the sharper question: who exactly does this system fail, and at which overlap?", "cite": "Crenshaw, 1991"}], "terms": [{"term": "Techno-racism", "def": "racial bias embedded inside technical systems, the algorithms, datasets, defaults, and design choices that shape digital life; racism that operates through technology, not only through individual people.", "cite": "Benjamin, 2019"}, {"term": "The New Jim Code", "def": "Benjamin's name for new technologies that reflect and reproduce existing inequities while being promoted and perceived as more objective or progressive than the discriminatory systems of an earlier era.", "cite": "Benjamin, 2019"}, {"term": "Intersectionality", "def": "Crenshaw's idea that race, gender, class, and other categories of identity and power overlap, so a harm aimed at people at the intersection can be missed if you look at any single category alone.", "cite": "Crenshaw, 1991"}, {"term": "Personal Cartography", "def": "your first major course task, a map of your own relationship to digital technology, the tools you use and the moments where you have felt seen, sorted, watched, or misread by a machine.", "cite": "Benjamin, 2019"}], "readings": [{"apa": "Benjamin, R. (2019). Introduction: The New Jim Code. In Race after technology: Abolitionist tools for the New Jim Code (pp. 1-32). Polity Press.", "scope": "Read this on Blackboard", "id": "benjamin2019"}, {"apa": "Noble, S. U. (2018). Introduction: The power of algorithms. In Algorithms of oppression: How search engines reinforce racism. New York University Press.", "scope": "Read this on Blackboard", "id": "noble2018"}, {"apa": "Buolamwini, J., & Gebru, T. (2018). Gender shades: Intersectional accuracy disparities in commercial gender classification. Proceedings of Machine Learning Research, 81, 77-91.", "scope": "Open access", "id": "buolamwini2018"}, {"apa": "Crenshaw, K. (1991). Mapping the margins: Intersectionality, identity politics, and violence against women of color. Stanford Law Review, 43(6), 1241-1299.", "scope": "Core excerpt pp. 1241-1252 this week; explored further in Week 2", "id": "crenshaw1991"}], "activity": {"screen": "activity", "archetype": "match", "title": "Read the map", "what": "You match a real everyday technology to the idea it raises, using examples from this week's readings.", "why": "so you start the term already practising the core move of the course: looking at an ordinary tool and naming what it might be doing.", "data": {"prompt": "Match each everyday example to the idea it raises. There is one idea per example. After you match, read the short why and notice that none of these requires a single villain to do harm.", "pairs": [{"item": "A search engine returns demeaning and stereotyped results when someone looks up Black girls, while the company describes the ranking as just a neutral reflection of what people search and click.", "match": "Techno-racism", "why": "Noble shows that a tool presented as a neutral information service can carry racial bias inside its ranking, which is racism operating through the design of a system rather than through one person.", "cite": "Noble, 2018"}, {"item": "A commercial facial-analysis product is sold as accurate and objective, yet it classifies lighter-skinned men almost perfectly while misclassifying darker-skinned women far more often.", "match": "Intersectionality", "why": "Buolamwini and Gebru found the worst failures at the overlap of race and gender, a harm you only see when you look at darker-skinned women specifically, not race alone or gender alone.", "cite": "Buolamwini & Gebru, 2018"}, {"item": "A hiring or screening tool is promoted as a modern, data-driven upgrade over biased human recruiters, yet it quietly keeps surfacing the same kinds of applicants the old system favoured.", "match": "The New Jim Code", "why": "Benjamin's definition fits exactly: an old inequity is reproduced by a tool experienced as more objective and progressive than the system it replaced, and the appearance of neutrality is what hides it.", "cite": "Benjamin, 2019"}, {"item": "An automatic faucet or soap dispenser turns on reliably for some hands but not for others, and the gap was never chosen on purpose by anyone who built it.", "match": "Techno-racism", "why": "Benjamin uses small everyday objects to show that bias can be built into design and defaults without intent, so the technology treats one group as the default user and the rest as an afterthought.", "cite": "Benjamin, 2019"}, {"item": "A platform presents its results as the neutral output of a fair algorithm, so users are taught to trust the ranking rather than ask whose experience the system was built around.", "match": "The New Jim Code", "why": "The danger Benjamin names is precisely this appearance of objectivity, which discourages the scrutiny that would catch the inequity the tool is carrying forward.", "cite": "Benjamin, 2019"}]}}, "youcan": ["You can now define techno-racism in your own words and say why it is often invisible to the people it does not harm.", "You can now name the New Jim Code and point to a system that looks neutral while reproducing inequity.", "You can now start your Personal Cartography by noticing where a machine sorts, scores, or screens you in everyday life."], "reflectPrompt": "This week, begin your Personal Cartography by paying attention. Notice the technologies that touch your life, a search bar, a feed, a payment app, a camera, an ID check, and write down one moment where you felt seen, sorted, watched, or misread by a machine. You are not solving anything yet; you are just learning to notice."},
      2: {"time": "Flexible pacing: work in manageable blocks and use breaks and accessibility supports as needed.", "deck": "BFS218_Week02", "overview": "This week gives you the theory underneath the New Jim Code vocabulary. Critical race theory, or CRT, makes one hard claim: racism is ordinary and structural, built into laws, institutions, and everyday systems, and it can produce racially unequal outcomes even when a system looks neutral. Ruha Benjamin takes that lens to technology and calls the result the New Jim Code, old inequities carried forward by tools that look new, objective, and fair. By the end of the week you can explain CRT, connect it to the New Jim Code, and use both to read a real example from your own digital life. Your Map Exchange posts begin next week; this week gives you the lenses for them.", "purpose": "Week 2 closes the opening arc of the course by giving you the body of thought that techno-racism and the New Jim Code rest on. The point is to help you stop asking whether the person behind a system is racist and start asking what the system does, to whom, and who pays. You will use that shift on a real technology in your first Map Exchange post.", "outcomes": ["By the end of this week you can explain clearly what critical race theory argues: that racism is ordinary and structural and can operate through systems that look neutral.", "By the end of this week you can connect critical race theory to Benjamin's New Jim Code, showing how the New Jim Code applies CRT to technology.", "By the end of this week you can distinguish an intentions-based account of a racist system from an outcomes-based account.", "By the end of this week you can use an outcomes-focused, intersectional lens to analyse a real technology from your own Personal Cartography."], "guiding": ["Critical race theory says racism is ordinary and structural, not only personal. What changes when you stop asking whether the person behind a system is racist and start asking what the system does, and to whom?", "Benjamin calls technology that reproduces old inequities while looking objective the New Jim Code. Why is the appearance of neutrality the most dangerous part?", "CRT asks us to weigh outcomes, not just intentions. Where in your digital life would an outcomes lens reveal something an intentions lens would miss?", "How does intersectionality (Crenshaw) sharpen the question from who a system harms to who it harms most, and at which overlap?"], "checks": [{"t": "What critical race theory argues: that racism is ordinary and structural, built into systems, not only into personal prejudice", "look": "the Key Concepts and the Crenshaw reading"}, {"t": "Structural racism: how a system can produce racially unequal outcomes even when no single person intends harm", "look": "the Benjamin reading"}, {"t": "How the New Jim Code applies critical race theory to technology, so old inequity rides inside a tool that looks neutral", "look": "the Benjamin reading"}, {"t": "The shift from intentions to outcomes: asking what a system does, to whom, and who pays, rather than who designed it", "look": "the Key Concepts for this week"}, {"t": "Reading one real technology from your own digital life through outcomes and an intersectional lens", "look": "the activity and your Personal Cartography"}], "concepts": [{"h": "Critical race theory (CRT)", "body": "Critical race theory is a body of scholarship holding that racism is ordinary and structural: built into laws, institutions, and everyday systems, not only into individual prejudice. A central CRT claim is that systems can produce racially unequal outcomes while appearing neutral. Kimberle Crenshaw, who introduced intersectionality, is one of CRT's founding scholars.", "cite": "Crenshaw, 1991"}, {"h": "Structural and systemic racism", "body": "Structural racism is racism that lives in how systems are designed and how they routinely operate, so that unequal outcomes recur even when no single person intends them. This is why the course studies design and data, not only attitudes. It also means you can find a racial harm without ever finding a single villain who chose it.", "cite": "Benjamin, 2019"}, {"h": "The New Jim Code as applied critical race theory", "body": "Ruha Benjamin defines the New Jim Code as new technologies that reflect and reproduce existing inequities while being promoted and experienced as more objective or progressive than the systems of an earlier era. Read it as CRT applied to code: the same structural racism, now carried by technology that looks like progress. The danger is that the inequity becomes harder to see precisely because the tool looks neutral.", "cite": "Benjamin, 2019"}, {"h": "Intentions versus outcomes", "body": "The key analytic shift this week is to stop asking whether a system intends harm and start asking what it does, to whom, and who pays. A system with no intent at all can still produce a racial harm, and CRT trains you to see it. An intentions lens looks for a guilty designer; an outcomes lens looks at who the system actually sorts, scores, or fails.", "cite": "Benjamin, 2019"}], "terms": [{"term": "Critical race theory (CRT)", "def": "a body of scholarship holding that racism is ordinary and structural, built into laws, institutions, and everyday systems, and able to produce unequal outcomes while appearing neutral.", "cite": "Crenshaw, 1991"}, {"term": "Structural and systemic racism", "def": "racism that lives in how systems are designed and routinely operate, so unequal outcomes recur even when no single person intends them.", "cite": "Benjamin, 2019"}, {"term": "The New Jim Code", "def": "Benjamin's name for new technologies that reflect and reproduce existing inequities while being experienced as more objective or progressive than earlier systems.", "cite": "Benjamin, 2019"}, {"term": "Intersectionality", "def": "Crenshaw's idea that harm is best understood at the intersection of systems, so an analysis that looks at one axis at a time misses the people hit hardest.", "cite": "Crenshaw, 1991"}], "readings": [{"apa": "Crenshaw, K. (1991). Mapping the margins: Intersectionality, identity politics, and violence against women of color. Stanford Law Review, 43(6), 1241-1299. https://doi.org/10.2307/1229039", "scope": "Core excerpt pp. 1241-1265. Open access", "id": "crenshaw1991"}, {"apa": "Benjamin, R. (2019). Introduction: The New Jim Code. In Race after technology: Abolitionist tools for the New Jim Code (pp. 1-32). Polity Press.", "scope": "Revisit from Week 1. Read this on Blackboard", "id": "benjamin2019"}], "activity": {"screen": "activity", "archetype": "match", "title": "Name the code", "what": "You match a real system, policy, or example to the critical race theory mechanism it reveals.", "why": "so you practise reading technology through outcomes, not intentions, which is the exact lens you need for your Personal Cartography this week.", "data": {"prompt": "Choose the CRT mechanism button under each real example. There is one mechanism per example. After you match, read the short why and notice that none of these requires a single villain to do harm.", "pairs": [{"item": "A hiring algorithm trained on a company's past hires keeps surfacing candidates who look like the people already there, and the firm calls it an objective, data-driven screen.", "match": "The New Jim Code: old inequity reproduced by a tool experienced as more objective than earlier systems", "why": "The tool reflects and reproduces an existing inequity while being promoted as neutral and progressive, which is exactly Benjamin's definition.", "cite": "Benjamin, 2019"}, {"item": "A tenant-screening or risk-scoring system produces racially unequal results even though no one who built it set out to discriminate.", "match": "Structural and systemic racism: unequal outcomes recur even when no single person intends them", "why": "The harm lives in how the system is designed and routinely operates, not in one person's intent, so you find the harm without finding a villain.", "cite": "Benjamin, 2019"}, {"item": "A standardized application form treats one group as the default user, so anyone who does not fit that template has to do extra work to be read correctly.", "match": "Critical race theory: racism is ordinary and built into everyday systems that look normal", "why": "CRT holds that racism is ordinary and structural, sitting in routine machinery that presents itself as neutral rather than in open hostility.", "cite": "Crenshaw, 1991"}, {"item": "A facial-analysis tool works well for lighter-skinned men but fails far more often for darker-skinned women, a gap that only appears when you look at race and gender together.", "match": "Intersectionality: harm appears at the overlap of systems and is missed by single-axis analysis", "why": "Looking at race alone or gender alone hides the harm; Crenshaw's move is to look at the intersection where the people hit hardest become visible.", "cite": "Crenshaw, 1991"}, {"item": "A welfare-fraud detection system is praised as efficient and modern, yet it flags and burdens racialized claimants at higher rates while its defenders point only to the good intentions of its designers.", "match": "Intentions versus outcomes: ask what the system does and who pays, not whether it meant harm", "why": "An intentions lens stops at the designers' good faith; an outcomes lens asks what the system actually does, to whom, and who carries the cost.", "cite": "Benjamin, 2019"}, {"item": "A search engine returns demeaning or stereotyped results for queries about a racial group while the company describes the ranking as just a neutral reflection of what people click.", "match": "The New Jim Code: inequity carried by a tool framed as objective and neutral", "why": "The system reproduces existing inequity while being experienced as a neutral, objective ranking, which is how the New Jim Code hides in plain sight.", "cite": "Benjamin, 2019"}]}}, "youcan": ["You can now explain clearly what critical race theory argues and why racism can be structural, not only personal.", "You can now connect critical race theory to the New Jim Code and say how the New Jim Code applies CRT to technology.", "You can now read a real technology through outcomes rather than intentions, using an intersectional lens."], "reflectPrompt": "Choose one digital moment from your own life, study program, or future field. Looking at the outcome rather than the intention, whose world does that system assume, and who pays when it gets that person wrong?"},
      3: {"time": "Flexible pacing: work in manageable blocks and use breaks and accessibility supports as needed.", "deck": "BFS218_Week03", "overview": "This week opens Part II of the course, where we take the New Jim Code apart one dimension at a time. We begin with the first dimension, engineered inequity: technology that, by its design, amplifies social hierarchies of race, class, and gender while presenting itself as neutral or efficient. The key idea is amplify, not create: the inequality is already in society, and the design widens it, speeds it up, and makes it harder to escape. By the end of the week you should be able to define engineered inequity, answer Benjamin's question are robots racist, and name a real example from your own digital life.", "purpose": "The purpose of this week is to give you a precise definition of engineered inequity and the habit of looking for design choices rather than bad intentions. It builds directly on the New Jim Code from Part I and sets up the three dimensions that follow: default discrimination, coded exposure, and technological benevolence.", "outcomes": ["By the end of this week you can define engineered inequity as technology that, by design, amplifies existing hierarchies of race, class, and gender.", "By the end of this week you can distinguish amplifying an existing inequity from the looser idea that a technology creates bias from nothing.", "By the end of this week you can explain Benjamin's answer to the question are robots racist, and why design, not intent, is the issue.", "By the end of this week you can identify a real example of engineered inequity and add it to your Personal Cartography."], "guiding": ["What is the difference between a technology that creates a bias and one that amplifies an inequality that already exists, and why does Benjamin insist on the second?", "Are robots racist? After this week, how would you answer, and what would you point to as evidence?", "Where in your own digital life does a system seem to widen a gap that was already there, while presenting itself as neutral or efficient?", "Engineered inequity is framed across race, class, and gender at once. Where might those amplifications stack on the same person?"], "checks": [{"t": "What engineered inequity means: a design that, by the way it is built, amplifies existing hierarchies of race, class, and gender", "look": "the Key Concepts and the Benjamin reading"}, {"t": "Amplify, not create: why engineered inequity widens a gap that already exists rather than inventing one from nothing", "look": "the Benjamin reading"}, {"t": "Benjamin's question are robots racist, and why a machine can do racial harm with no hatred and no racist programmer", "look": "the Benjamin reading"}, {"t": "Why the fix for engineered inequity is a different design choice, not just better intentions", "look": "the activity and the Key Concepts"}, {"t": "Spotting a system in your own digital life that widens a gap already there while looking neutral or efficient", "look": "the activity and your Personal Cartography"}], "concepts": [{"h": "Engineered inequity", "body": "Engineered inequity is Benjamin's first dimension of the New Jim Code: technology that, by its design, explicitly amplifies social hierarchies based on race, class, and gender. The harm is built into the design, and the system presents itself as neutral or efficient while widening a gap that already exists. The point is that the harm comes from how the system is designed, not from a feeling, a slur, or a single mistake.", "cite": "Benjamin, 2019"}, {"h": "Amplify, not create", "body": "The careful move this week is the word amplify. Engineered inequity does not conjure inequality out of nothing; it takes an existing inequity and makes it wider, faster, or harder to escape. Because the problem lives in the design and not in anyone's intentions, the fix is never just better intentions, it is a different design choice.", "cite": "Benjamin, 2019"}, {"h": "Are robots racist?", "body": "This is Benjamin's framing question for the dimension, and her answer is that robots can be racist. Not because a machine feels hatred, but because it is designed inside a society already structured by racism and carries that structure forward. The question deliberately moves us from intent to design: a system can do racial harm with no racist programmer behind it.", "cite": "Benjamin, 2019"}], "terms": [{"term": "Engineered inequity", "def": "technology that, by its design, amplifies existing social hierarchies of race, class, and gender, while presenting itself as neutral or efficient.", "cite": "Benjamin, 2019"}, {"term": "Amplify, not create", "def": "the idea that engineered inequity widens an inequality that already exists rather than inventing one from nothing, which is why the fix is different design rather than better intentions.", "cite": "Benjamin, 2019"}, {"term": "Are robots racist?", "def": "Benjamin's framing question for engineered inequity; her answer is that a machine can do racial harm by design, with no hatred and no racist programmer, when it is built inside a society already structured by racism.", "cite": "Benjamin, 2019"}, {"term": "The New Jim Code", "def": "Benjamin's name for new technologies that carry old racism forward while appearing neutral or even fair; engineered inequity is the first of its four dimensions.", "cite": "Benjamin, 2019"}], "readings": [{"apa": "Benjamin, R. (2019). Race after technology: Abolitionist tools for the New Jim Code. Polity Press. Read the first dimension, engineered inequity (the chapter framed as Are Robots Racist?).", "scope": "Read this on Blackboard", "id": "benjamin2019"}], "activity": {"screen": "activity", "archetype": "scenario", "title": "Trace the design choice", "what": "You walk a design team's decisions for a real-world system, step by step, and choose what they do at each fork.", "why": "It makes engineered inequity concrete: you watch a neutral-looking design amplify an existing gap one choice at a time, this week's exact dimension.", "data": {"setup": "A city hires a team to build an automated screening tool that ranks tenant applications for subsidized housing. The neighbourhood already has a long history of who gets approved and who does not, and the team is told to make the process faster and more objective.", "steps": [{"situation": "The team needs data to train the tool. The fastest option is to learn from years of past approval decisions made by human officers in this same city.", "choices": [{"label": "Train on the past approval records as they are, because they are the data on hand", "outcome": "The tool learns the existing pattern of who was approved before, including its bias, and forwards that hierarchy at speed and scale while looking objective.", "harm": true, "cite": "Benjamin, 2019"}, {"label": "Treat the past records as evidence of an existing gap and design to correct for it, not just reproduce it", "outcome": "The team names the existing inequity first and changes the design so the tool does not simply amplify the old pattern.", "harm": false, "cite": "Benjamin, 2019"}]}, {"situation": "The team cannot use race directly, so they must choose other inputs. One easy, predictive input is the applicant's postal code and rental history.", "choices": [{"label": "Use postal code and rental history because they boost accuracy", "outcome": "These inputs stand in for race and class, so the tool widens the same hierarchy without ever naming race, presenting the result as neutral and efficient.", "harm": true, "cite": "Benjamin, 2019"}, {"label": "Drop inputs that act as proxies for an existing hierarchy and document why", "outcome": "The team refuses a design choice that would amplify race and class through the back door, accepting a small accuracy cost.", "harm": false, "cite": "Benjamin, 2019"}, {"label": "Keep the inputs but add a label that calls the tool objective", "outcome": "The alibi of neutrality hides the amplification rather than removing it, so the harm continues while looking fair.", "harm": true, "cite": "Benjamin, 2019"}]}, {"situation": "The finished tool works. It is faster than the old process and its overall approval numbers look reasonable, so leadership wants to deploy it now.", "choices": [{"label": "Deploy it because it is efficient and the overall numbers look fine", "outcome": "Efficiency and a clean overall number become the cover; the amplified gap lands on the same families as before, now faster and harder to appeal.", "harm": true, "cite": "Benjamin, 2019"}, {"label": "Ask who carries the cost when it is wrong before deploying", "outcome": "The team checks who is hurt by the errors and finds the design still amplifies the existing gap, so they redesign rather than ship.", "harm": false, "cite": "Benjamin, 2019"}]}]}}, "youcan": ["You can now define engineered inequity as a design that amplifies an existing hierarchy of race, class, and gender.", "You can now explain why amplify, not create, makes the fix a matter of design rather than intentions.", "You can now name a real example of engineered inequity from your own digital life for your Personal Cartography."], "reflectPrompt": "Think of one system you used today that seems to widen a gap that was already there. In a sentence or two, name the existing gap, the design choice that amplifies it, and who carries the cost."},
      4: {"time": "Flexible pacing: work in manageable blocks and use breaks and accessibility supports as needed.", "deck": "BFS218_Week04", "overview": "This week is about a quieter kind of harm: the harm that arrives through a system's defaults. Default discrimination is Benjamin's second dimension of the New Jim Code, the way technology can carry inequity forward through the settings, data, and assumptions that treat one group's world as normal. No one has to type a slur into the code, because the inequity is already sitting in the defaults and no one designed against it. Your job is to learn the sharp question that holds the week, is the glitch systemic, and to find a real default that quietly disadvantages a group in your own world.", "purpose": "Default discrimination is Benjamin's second dimension of the New Jim Code, and the point of this week is to help you name it and test it. You will learn to apply her glitch-versus-systemic question to a real failure, to explain why she calls database design an exercise in worldbuilding, and to spot a default that treats one group's world as the norm. It builds on engineered inequity from last week and sets up coded exposure next week.", "outcomes": ["By the end of this week you can define default discrimination as harm that arrives through the defaults, data, and assumptions of a system, not only through active design.", "By the end of this week you can apply Benjamin's glitch-versus-systemic test to a real technological failure.", "By the end of this week you can explain why database design is, in Benjamin's words, an exercise in worldbuilding.", "By the end of this week you can identify a real default that quietly disadvantages a group and add it to your Personal Cartography."], "guiding": ["What is the difference between a harm someone designs on purpose and a harm that arrives through a default, and why does Benjamin insist the second is just as real?", "Is the glitch systemic? When a system fails a group and the failure is called a glitch, how would you decide whether it is an accident or a design working as built?", "Whose world is treated as the default in a system you use, and who has to adapt themselves to fit it?", "If the fix is not patching the glitch but changing the default, what default would you change first?"], "checks": [{"t": "What default discrimination means: harm that arrives through a system's settings, data, and assumptions, not only through active design", "look": "the Key Concepts and the Benjamin reading"}, {"t": "Benjamin's glitch-versus-systemic question: how to tell an accident from a system working exactly as built", "look": "the Benjamin reading"}, {"t": "Design as worldbuilding: how database design encodes whose world counts as normal, with the Malcolm X Boulevard example", "look": "the Benjamin reading"}, {"t": "Why the real fix is changing the default itself, not patching the glitch faster", "look": "the activity and the Key Concepts"}, {"t": "Naming a default in your own life, program, or future field that quietly assumes someone who is not you", "look": "the activity and your Personal Cartography"}], "concepts": [{"h": "Default discrimination", "body": "Default discrimination is Benjamin's second dimension of the New Jim Code: harm that arrives through the defaults of a system, the settings, data, and assumptions that treat one group's world as the norm. It does not require a racist designer. It requires only that the existing inequity is left in the defaults and that no one designs against it. Engineered inequity is active, a design that amplifies a gap on purpose, but default discrimination is quieter, the harm that arrives when no one is looking.", "cite": "Benjamin, 2019"}, {"h": "Is the glitch systemic?", "body": "This is Benjamin's framing question for the dimension. A glitch is supposed to be minor and temporary, a brief irregularity that someone will patch. Benjamin asks whether the glitch is actually systemic, that is, whether the failure is not an accident but the predictable result of how the system was built. When the answer is yes, the word glitch is doing work: it makes a designed harm sound like bad luck and closes the case before anyone asks who carries the cost.", "cite": "Benjamin, 2019"}, {"h": "Design as worldbuilding", "body": "Benjamin describes database design as an exercise in worldbuilding: programmers project their assumptions, interests, and view of the world into the system, and that world too often reproduces the technology of race. When Google Maps reads Malcolm X Boulevard aloud as Malcolm Ten, it reads the X as a Roman numeral because that is the default, a small sign of whose knowledge is set as normal and whose is treated as the exception.", "cite": "Benjamin, 2019"}], "terms": [{"term": "Default discrimination", "def": "harm that arrives through the defaults of a system, the settings, data, and assumptions that treat one group's world as the norm, without needing a racist designer.", "cite": "Benjamin, 2019"}, {"term": "Is the glitch systemic?", "def": "Benjamin's framing question, which asks whether a failure called a glitch is really an accident or the predictable result of how the system was built.", "cite": "Benjamin, 2019"}, {"term": "Design as worldbuilding", "def": "Benjamin's phrase for how database design projects a worldview into a system, encoding assumptions about who is normal as defaults that reproduce the technology of race.", "cite": "Benjamin, 2019"}, {"term": "Automating anti-Blackness", "def": "the way everyday tools such as credit scores, hiring algorithms, and risk assessments sift and sort people at scale, carrying old inequities forward in their defaults without ever using an explicit slur.", "cite": "Benjamin, 2019"}], "readings": [{"apa": "Benjamin, R. (2019). Race after technology: Abolitionist tools for the New Jim Code. Polity Press. Read the second dimension, default discrimination (the chapter Is the Glitch Systemic?, including the section Automating Anti-Blackness).", "scope": "Read this on Blackboard", "id": "benjamin2019"}], "activity": {"screen": "activity", "archetype": "toggle", "title": "Defaults are not neutral", "what": "You flip a system's default settings one at a time and watch who is helped and who is harmed when each default is treated as neutral.", "why": "It shows you in real time that a default is never just neutral, so a failure called a glitch is often the system working exactly as it was built.", "data": {"system": "A set of everyday systems whose defaults sift and sort people: a map voice, a credit-score screen, neighbourhood surveillance, and an autofill name field.", "toggles": [{"label": "Map voice reads the letter X as a Roman numeral by default", "on": "Malcolm X Boulevard is read aloud as Malcolm Ten, so the Black liberation leader's name disappears from the system.", "off": "The map treats X in a street name as a name, so Malcolm X Boulevard is read correctly.", "whoHarmed": "Communities whose history and naming the default treats as the exception, who must adapt to be heard correctly.", "cite": "Benjamin, 2019"}, {"label": "Hiring screen uses a credit score as a default proxy for a good candidate", "on": "Applicants with thin or damaged credit are filtered out before a human ever sees them, and the bias hides inside a number that looks objective.", "off": "Candidates are judged on the job's actual requirements, so a credit history shaped by inequality does not stand in for race or class.", "whoHarmed": "Racialized and lower-income applicants, whose credit reflects old inequities rather than their ability to do the job.", "cite": "Benjamin, 2019"}, {"label": "Surveillance system watches blocks flagged by historical crime data by default", "on": "The same neighbourhoods are watched again and again because the past data is treated as a neutral map of risk.", "off": "Watching is not steered by historical data alone, so a biased past does not decide who is surveilled in the present.", "whoHarmed": "Residents of over-policed neighbourhoods, who carry the cost of a default that recycles an unequal past.", "cite": "Benjamin, 2019"}, {"label": "Name field treats a narrow set of names as the default normal", "on": "Names outside the assumed norm are rejected, truncated, or misread, so people are misrecorded by the system.", "off": "The field accepts the full range of real names, so no one has to alter their name to fit the database.", "whoHarmed": "People whose names fall outside the worldview encoded into the default, who must adapt or be misread.", "cite": "Benjamin, 2019"}]}}, "youcan": ["You can now define default discrimination as harm that arrives through a system's defaults, not only through active design.", "You can now apply Benjamin's glitch-versus-systemic test to a real technological failure.", "You can now explain why Benjamin calls database design an exercise in worldbuilding."], "reflectPrompt": "In a sentence or two: where in your own life, your Seneca program, placement, workplace, or future field, does a default just seem to assume someone who is not you, and who has to adapt to fit it?"},
      6: {"time": "Flexible pacing: work in manageable blocks and use breaks and accessibility supports as needed.", "deck": "BFS218_Week06", "overview": "This week we bring the New Jim Code home to Canada. You have already named the dimensions of algorithmic harm in the abstract; now you watch them operate in real Canadian systems across three domains: borders, policing, and the wider field of housing and services. You will study documented Canadian cases, including the RCMP's use of Clearview AI and the Supreme Court ruling in Ewert v Canada, and connect each one to the harm it produces for racialized and Indigenous communities. The point is to see that techno-racism is not somewhere else; it is here, and it has already been named in a federal report and a Supreme Court ruling.", "purpose": "Week 6 grounds the New Jim Code in Canada. Having named the dimensions, you now examine documented Canadian cases in borders, policing, and corrections, and connect each to the harm it produces for racialized and Indigenous communities. The aim is to spot which dimension is at work in a real Canadian system, name who is harmed, and ask whether any law or oversight body is holding it accountable.", "outcomes": ["By the end of this week you can describe at least one documented Canadian case of algorithmic harm in borders, policing, or corrections.", "By the end of this week you can explain the OPC finding on the RCMP's use of Clearview AI, and the holding in Ewert v Canada (2018).", "By the end of this week you can connect a Canadian case to one dimension of the New Jim Code: engineered inequity, default discrimination, or coded exposure.", "By the end of this week you can identify a Canadian example from your own life and add it to your Personal Cartography, naming the dimension, the harm, and the oversight gap."], "guiding": ["Which dimension, engineered inequity, default discrimination, or coded exposure, do you see in the RCMP's use of Clearview AI?", "In Ewert v Canada, why did it matter that the risk tools were not validated for Indigenous offenders, and which dimension is that?", "Molnar calls border technology a testing ground. Who is it tested on, and why there first?", "Singh notes much algorithmic policing is authorized by courts, not legislation. Why does that gap matter?", "Nagra and Maurutto show young Canadian Muslims being watched and stopped at borders as a matter of routine. What does it do to people to be treated as a security category before they have done anything?"], "checks": [{"t": "What algorithmic policing is, and how it spread across Canada often with little public knowledge", "look": "the Robertson, Khoo, and Song reading"}, {"t": "The RCMP's use of Clearview AI as coded exposure, and the finding that it violated federal privacy law", "look": "the Office of the Privacy Commissioner of Canada reading"}, {"t": "Why Ewert v Canada matters: risk tools never validated for Indigenous people, named as default discrimination by the Supreme Court", "look": "the Ewert v Canada ruling"}, {"t": "Why border technology is tried out first on the people with the least power to refuse it, and the oversight gap left by court rulings", "look": "the Molnar and Singh readings"}, {"t": "Naming a place in your own Canadian life where these systems already operate, and the dimension, harm, and oversight gap", "look": "the activity and your Personal Cartography"}], "concepts": [{"h": "Algorithmic policing", "body": "Algorithmic policing is the use of data-driven tools by law enforcement: predictive policing, facial recognition, and social-media surveillance. Robertson, Khoo, and Song document its spread across Canada, often with little public knowledge. Much of it has been authorized through court rulings rather than clear legislation, which leaves a gap in oversight: powerful tools running without debated rules to govern them.", "cite": "Robertson, Khoo, and Song, 2020"}, {"h": "Digital border technologies", "body": "Digital border technologies are the surveillance, biometrics, and automated decision systems used at borders, and Petra Molnar shows they operate through logics of exclusion. Migrants and refugees have the least power to refuse, so they are often the testing ground for tools that are later used more widely. The border is where harmful systems get tried out first, on the people least able to say no.", "cite": "Molnar, 2023"}, {"h": "Coded exposure at the border of policing", "body": "Clearview AI scraped billions of images from the web to build a face-search tool, and the RCMP used it. The Office of the Privacy Commissioner of Canada found that this use violated federal privacy law. People who never agreed to be in a police database were made searchable in one anyway, which is coded exposure: being made visible to a system that was never meant to see you.", "cite": "Office of the Privacy Commissioner of Canada, 2021"}, {"h": "Default discrimination, named by the Supreme Court", "body": "In Ewert v Canada the Supreme Court found that Correctional Service Canada breached its statutory duty by relying on actuarial risk-assessment tools that had never been shown to be valid for Indigenous people. No one had to intend harm: the tool was simply not tested on Indigenous people and used anyway. That is default discrimination, and here the highest court in the country named it.", "cite": "Ewert v Canada, 2018"}, {"h": "Muslim communities treated as a security category", "body": "Baljit Nagra and Paula Maurutto interviewed young Canadian Muslims about airports, borders, and everyday security checks. Their participants are pulled aside, questioned, and watched as a matter of routine, treated as a security risk because of their faith rather than anything they have done. Watchlists and border risk-flagging turn a whole community into a category to be managed, and young Muslims end up managing how they look and speak just to move through a checkpoint. The harm is not one rude officer, it is a system that reads a community as suspect.", "cite": "Nagra and Maurutto, 2016"}], "terms": [{"term": "Algorithmic policing", "def": "the use of data-driven tools by law enforcement, including predictive policing, facial recognition, and social-media surveillance, much of it authorized through court rulings rather than clear legislation.", "cite": "Robertson, Khoo, and Song, 2020"}, {"term": "Digital border technologies", "def": "the surveillance, biometrics, and automated decision systems used at borders, which work through logics of exclusion and test new tools on migrants and refugees first.", "cite": "Molnar, 2023"}, {"term": "Logics of exclusion", "def": "Molnar's term for how border technologies are built and used to keep certain people out, treating those with the least power to refuse as a testing ground.", "cite": "Molnar, 2023"}, {"term": "Oversight gap", "def": "the space that opens when a technology is deployed and authorized by court rulings rather than debated legislation, so powerful tools run without clear rules governing them.", "cite": "Singh, 2021"}, {"term": "The security category", "def": "being treated by border and security systems as a potential risk because of your religion or racialized identity rather than anything you have done, so a whole community is watched and managed as suspect.", "cite": "Nagra and Maurutto, 2016"}], "readings": [{"apa": "Robertson, K., Khoo, C., & Song, Y. (2020). To surveil and predict: A human rights analysis of algorithmic policing in Canada. Citizen Lab and International Human Rights Program, University of Toronto.", "scope": "Required. Read the Executive Summary and Part I.", "id": "robertson2020"}, {"apa": "Nagra, B., & Maurutto, P. (2016). Crossing borders and managing racialized identities: Experiences of security and surveillance among young Canadian Muslims. Canadian Journal of Sociology, 41(2), 165-194. https://doi.org/10.29173/cjs23031", "scope": "Required. Open access, about 30 pages.", "id": "nagra2016"}, {"apa": "Molnar, P. (2023). Digital border technologies, techno-racism and logics of exclusion. International Migration. https://doi.org/10.1111/imig.13187", "scope": "Optional / Explore.", "id": "molnar2023"}, {"apa": "Office of the Privacy Commissioner of Canada. (2021). Police use of facial recognition technology in Canada and the way forward. Special report to Parliament.", "scope": "Optional / Explore. Findings summary.", "id": "opc2021"}, {"apa": "Ewert v Canada, 2018 SCC 30.", "scope": "Required. Read the case summary and the holding.", "id": "ewert2018", "url": "https://scc-csc.lexum.com/scc-csc/scc-csc/en/item/17133/index.do"}, {"apa": "Singh, S. (2021). Algorithmic policing technologies in Canada. Manitoba Law Journal, 44(6).", "scope": "Optional / Explore. Executive summary.", "id": "singh2021"}], "activity": {"screen": "activity", "archetype": "scenario", "title": "Map the Canadian case", "what": "You walk a documented Canadian deployment of facial recognition step by step, deciding what an institution does at each turn and watching where the harm lands and where the accountability gap opens.", "why": "so you practise naming the dimension, the harm, and the oversight gap on a real Canadian case before you add one to your own Personal Cartography.", "data": {"setup": "Clearview AI scraped billions of images from the web to build a face-search tool, and the RCMP used it for facial recognition without telling the public or seeking clear legal authority. You step into the choices Canadian institutions faced as this deployment unfolded, from acquisition to oversight.", "steps": [{"situation": "A facial-recognition vendor offers a police service a tool whose database was built by scraping billions of public images without consent. The service is deciding whether and how to use it.", "choices": [{"label": "Use the tool quietly, since the images were already public online", "outcome": "People who never agreed to be in a police database are now searchable in one. They are made visible to a system that was never meant to see them, which is coded exposure, and the OPC later finds this use unlawful.", "harm": true, "cite": "Office of the Privacy Commissioner of Canada, 2021"}, {"label": "Pause and ask whether scraped images can lawfully be used before deploying", "outcome": "The service confronts the consent problem up front. Treating the scraped database as a privacy question, not a convenience, is exactly the gap the OPC report says should have been closed first.", "harm": false, "cite": "Office of the Privacy Commissioner of Canada, 2021"}]}, {"situation": "The tool is being rolled out across the country. The institution must decide what legal basis and public disclosure to attach to algorithmic policing of this kind.", "choices": [{"label": "Rely on existing court rulings and roll it out without new legislation or public debate", "outcome": "The tool runs with thin oversight. Singh shows this is the common pattern: authorization through court rulings rather than clear legislation leaves an oversight gap where harm collects.", "harm": true, "cite": "Singh, 2021"}, {"label": "Document the tool and its human-rights risks in a public human-rights analysis", "outcome": "The deployment is made visible to scrutiny. Robertson, Khoo, and Song show that naming the specific tool and the rights at stake is what turns a hidden system into one that can be challenged.", "harm": false, "cite": "Robertson, Khoo, and Song, 2020"}, {"label": "Expand the same tool to the border, where refusal is hardest", "outcome": "The technology moves to the place with the least power to refuse. Molnar shows the border becomes a testing ground, and migrants and refugees absorb the harm first.", "harm": true, "cite": "Molnar, 2023"}]}, {"situation": "Harm has now been documented and the case reaches an oversight body. The question is whether accountability arrives in time to protect the people affected.", "choices": [{"label": "Wait for a complaint and let the oversight body rule case by case after the fact", "outcome": "Accountability arrives late. As with the Ewert risk tools, the harm is named only after people have already lived through it, and the lag itself is where the damage was done.", "harm": true, "cite": "Ewert v Canada, 2018"}, {"label": "Treat the OPC's finding as a rule for future deployments, not just this one", "outcome": "The finding becomes a standard rather than a one-off. The OPC's report points beyond the single case toward a way forward that closes the gap before the next tool ships.", "harm": false, "cite": "Office of the Privacy Commissioner of Canada, 2021"}]}]}}, "youcan": ["You can now describe a documented Canadian case of algorithmic harm in borders, policing, or corrections", "You can now connect a Canadian case to one dimension of the New Jim Code and name who is harmed", "You can now ask of any Canadian system whether a law, court ruling, or oversight body is holding it accountable"], "reflectPrompt": "In a sentence or two: where in your own Canadian life, your city, your program, or your future field, do these systems already operate, and what changes the moment you can name the harm where you live?"},
      7: {"time": "Flexible pacing: work in manageable blocks and use breaks and accessibility supports as needed.", "deck": "BFS218_Week07", "overview": "This week closes Part II by assembling the parts you already have. Over the last few weeks you named three dimensions of the New Jim Code one at a time: engineered inequity, default discrimination, and coded exposure. There is no new reading. Instead, you put those three layers together into one working picture of how a discriminatory system produces harm, then use the practice tools to check whether you can explain that anatomy clearly.", "purpose": "Week 7 consolidates Part II. You assemble the three dimensions of the New Jim Code and the Canadian cases into one working picture, then rehearse that understanding before Study Week. The aim is to hold the whole anatomy in one view: the three dimensions, how they differ, and how they show up together in real Canadian systems.", "outcomes": ["By the end of this week you can define and distinguish the three dimensions of the New Jim Code studied so far.", "By the end of this week you can analyse a real system and name which dimension or dimensions it reveals.", "By the end of this week you can judge whether a harm is designed or incidental, and give your reasons.", "By the end of this week you can use the Knowledge Check, Reading Practice, and Concept Flashcards to rehearse one system from your own Personal Cartography before Study Week."], "guiding": ["In one sentence each, how would you define engineered inequity, default discrimination, and coded exposure?", "Pick a real system. Does it show one dimension, or more than one at once? How can you tell?", "How would you decide whether a harm is designed into a system or merely incidental?", "Where do the dimensions stack on the same person, at the intersection of race, gender, class, or status?"], "checks": [{"t": "Defining and telling apart the three dimensions: engineered inequity, default discrimination, and coded exposure", "look": "the Key Concepts and the Benjamin reading"}, {"t": "Coded exposure as visibility handed out unevenly, with the Gender Shades evidence on darker-skinned women", "look": "the Buolamwini and Gebru reading"}, {"t": "How the three dimensions are one anatomy, not separate machines, and can show up together in a single Canadian system", "look": "the Benjamin and Robertson, Khoo, and Song readings"}, {"t": "Judging whether a harm is designed into a system or merely incidental, and giving your reasons", "look": "the activity and the Key Concepts"}, {"t": "Using one system from your own Personal Cartography to rehearse which dimension or dimensions it reveals", "look": "the activity and your Personal Cartography"}], "concepts": [{"h": "Engineered inequity: amplify, not create", "body": "Engineered inequity is the first dimension of the New Jim Code: a design that, by the way it is built, amplifies an existing hierarchy of race, class, or gender. The harm is active and built into the design, not a side effect. The key word is amplify, not create: the technology takes a gap that already existed in the world and makes it bigger and faster.", "cite": "Benjamin, 2019"}, {"h": "Default discrimination: ride the defaults", "body": "Default discrimination is the second dimension: harm that arrives through the defaults, the settings, data, and assumptions that treat one group's world as normal. No one has to set out to discriminate for it to happen. The key question is whether the glitch is systemic, because when the same error keeps landing on the same people, it is not a glitch, it is the design.", "cite": "Benjamin, 2019"}, {"h": "Coded exposure: visibility handed out unevenly", "body": "Coded exposure is the third dimension: the uneven, designed distribution of visibility, where some people are watched too closely and others are not seen at all. The key question is whether visibility is a trap. Buolamwini and Gebru measured one version of it, finding facial-analysis systems near-perfect on lighter-skinned men and far worse on darker-skinned women.", "cite": "Benjamin, 2019"}, {"h": "Not separate machines: one anatomy", "body": "These three dimensions are not separate machines; they are three ways the same systemic racism enters technology. A single real system can show more than one at once, and in Canada we saw them together in policing, corrections, and at the border. Assembling the anatomy means seeing how the whole system, not one part, produces the harm.", "cite": "Benjamin, 2019"}], "terms": [{"term": "Engineered inequity (dimension one)", "def": "technology that, by its design, amplifies an existing hierarchy of race, class, or gender; the harm is active and built in, and the key word is amplify, not create.", "cite": "Benjamin, 2019"}, {"term": "Default discrimination (dimension two)", "def": "harm that arrives through the defaults, the settings, data, and assumptions that treat one group's world as normal; the key question is whether the glitch is systemic.", "cite": "Benjamin, 2019"}, {"term": "Coded exposure (dimension three)", "def": "the uneven, designed distribution of visibility, where some people are watched too closely and others are not seen at all; the key question is whether visibility is a trap.", "cite": "Benjamin, 2019"}, {"term": "Algorithmic policing", "def": "the use of data-driven tools, predictive policing, facial recognition, and social-media surveillance by law enforcement, documented spreading across Canada.", "cite": "Robertson, Khoo, and Song, 2020"}], "readings": [{"apa": "Benjamin, R. (2019). Race after technology: Abolitionist tools for the New Jim Code. Polity Press. (Engineered inequity; default discrimination; coded exposure.)", "scope": "Read this on Blackboard", "id": "benjamin2019"}, {"apa": "Buolamwini, J., and Gebru, T. (2018). Gender shades: Intersectional accuracy disparities in commercial gender classification. Proceedings of Machine Learning Research, 81, 77-91.", "scope": "Open access", "id": "buolamwini2018"}, {"apa": "Robertson, K., Khoo, C., and Song, Y. (2020). To surveil and predict: A human rights analysis of algorithmic policing in Canada. Citizen Lab and International Human Rights Program, University of Toronto.", "scope": "Open access", "id": "robertson2020"}, {"apa": "Molnar, P. (2023). Digital border technologies, techno-racism and logics of exclusion. International Migration. https://doi.org/10.1111/imig.13187", "scope": "Open access", "id": "molnar2023"}], "activity": {"screen": "activity", "archetype": "assemble", "title": "Assemble the anatomy", "what": "You take one real discriminatory system and build it layer by layer, the data, the model, the deployment, and the feedback loop, then name which dimension of the New Jim Code each layer reveals.", "why": "so you see how the whole system, not one part, produces harm, and arrive ready for Study Week and the next assignment work.", "data": {"goal": "Assemble the four layers of one real system into a single anatomy, then name the dimension each layer reveals, so the harm is shown to come from the whole structure rather than one bad part.", "components": [{"label": "The data layer", "role": "feeds the system a record of an unequal world, so the defaults treat one group's world as normal and others as the exception.", "cite": "Benjamin, 2019"}, {"label": "The model layer", "role": "scores or sorts people by that data, amplifying an existing hierarchy of race, class, or gender rather than creating a new one.", "cite": "Benjamin, 2019"}, {"label": "The deployment layer", "role": "puts the system to work in policing, predictive tools, facial recognition, and surveillance, where the harm lands on real people across Canada.", "cite": "Robertson, Khoo, and Song, 2020"}, {"label": "The border deployment", "role": "runs the system at the border through surveillance, biometrics, and automated decisions, on those with the least power to refuse, who become the testing ground.", "cite": "Molnar, 2023"}, {"label": "The visibility setting", "role": "hands out being seen unevenly, watching some people too closely and missing others, so accuracy and safety come apart.", "cite": "Buolamwini and Gebru, 2018"}, {"label": "The feedback loop", "role": "feeds each biased result back in as new data, so the whole anatomy keeps reproducing the same harm and the glitch proves systemic.", "cite": "Benjamin, 2019"}]}}, "youcan": ["You can now define and distinguish engineered inequity, default discrimination, and coded exposure in your own words", "You can now take one real system and name which dimension or dimensions it reveals", "You can now judge whether a harm is designed or incidental, and give your reasons"], "reflectPrompt": "You can now name the anatomy of the New Jim Code, but naming a harm is not the same as ending it. For one system in your own life, what is the difference between seeing the harm clearly and being able to change it?"},
      8: {"time": "Flexible pacing: work in manageable blocks and use breaks and accessibility supports as needed.", "deck": "BFS218_Week08", "overview": "This week the course turns from naming the New Jim Code to answering it, and it begins on purpose not with a Western fix but with a different relation to data altogether. Indigenous data sovereignty is the principle that First Nations, Inuit, and Metis peoples have the right to govern the data about their own communities. You will learn the OCAP principles (Ownership, Control, Access, Possession), a registered trademark of the First Nations Information Governance Centre, alongside the CARE Principles from the Global Indigenous Data Alliance, and you will run a real data-governance case through them. The point is to ask not only whether a system is biased, but who should govern the data, and on whose terms.", "purpose": "Week 8 opens Part III by reframing the central question from bias to governance. You will learn Indigenous data sovereignty and the OCAP principles as a model of agency, meet the CARE Principles and decolonial approaches to AI, and practise asking who governs a community's data and what would change if the community held it. The aim is to treat a community holding its own data as a form of agency, not just a critique.", "outcomes": ["By the end of this week you can explain Indigenous data sovereignty as the right of First Nations, Inuit, and Metis communities to govern data about themselves.", "By the end of this week you can describe the four OCAP principles, attribute them to the First Nations Information Governance Centre, and say what each one protects.", "By the end of this week you can summarise what a decolonial approach to AI centres, after Mohamed, Png, and Isaac (2020), and name what algorithmic colonialism means.", "By the end of this week you can run a data-governance case through OCAP and CARE and connect it to your own Personal Cartography, naming where a community could hold its own data."], "guiding": ["Most systems assume whoever collects data owns it. What changes if the community owns it instead?", "What do Ownership, Control, Access, and Possession each protect, and why are all four needed together?", "Mohamed, Png, and Isaac warn against algorithmic colonialism. What would a decolonial approach to AI centre instead?"], "checks": [{"t": "Indigenous data sovereignty: the right of First Nations, Inuit, and Metis communities to govern data about themselves", "look": "the Key Concepts and the First Nations Information Governance Centre reading"}, {"t": "The four OCAP principles, Ownership, Control, Access, and Possession, and what each one protects", "look": "the First Nations Information Governance Centre reading"}, {"t": "What a decolonial approach to AI centres, and what algorithmic colonialism means", "look": "the Mohamed, Png, and Isaac reading"}, {"t": "Naming a community whose data has been governed mostly by others, and what would change if it governed its own data", "look": "the activity and your Personal Cartography"}], "concepts": [{"h": "Indigenous data sovereignty", "body": "Indigenous data sovereignty is the principle that First Nations, Inuit, and Metis peoples have the right to govern the collection, ownership, and use of data about their own communities, lands, and knowledge. It reframes data from something extracted by outsiders to something a community holds and governs. Instead of asking only whether a system is biased, it asks who should govern the data at all, moving the community from the subject of the data to its steward.", "cite": "First Nations Information Governance Centre, 2014"}, {"h": "OCAP: Ownership, Control, Access, Possession", "body": "OCAP names four First Nations principles for data governance, stewarded by the First Nations Information Governance Centre, and is a registered trademark of that Centre. Ownership means a community collectively owns its information. Control means it controls how data about it is collected and used. Access means the community can reach data about itself. Possession means it physically holds and stewards that data. All four are needed together: ownership without possession is hollow, and access without control is thin.", "cite": "First Nations Information Governance Centre, 2014"}, {"h": "Decolonial AI and algorithmic colonialism", "body": "Mohamed, Png, and Isaac (2020) argue that decolonial and postcolonial theory should guide how artificial intelligence is built and governed. They warn against algorithmic colonialism, where tools built elsewhere are imposed on communities while the power and benefit flow back outward to those who built them. A decolonial approach instead centres those most affected in how systems are designed and governed.", "cite": "Mohamed, Png, and Isaac, 2020"}], "terms": [{"term": "Indigenous data sovereignty", "def": "the right of First Nations, Inuit, and Metis peoples to govern the collection, ownership, and use of data about their own communities, lands, and knowledge.", "cite": "First Nations Information Governance Centre, 2014"}, {"term": "OCAP (Ownership, Control, Access, Possession)", "def": "four First Nations principles for data governance, a registered trademark stewarded by the First Nations Information Governance Centre: a community owns its information, controls how it is collected and used, can access it, and physically possesses it.", "cite": "First Nations Information Governance Centre, 2014"}, {"term": "Algorithmic colonialism", "def": "the pattern in which AI tools built elsewhere are imposed on communities, with power and benefit flowing back outward to those who built them rather than to those most affected.", "cite": "Mohamed, Png, and Isaac, 2020"}, {"term": "CARE Principles for Indigenous Data Governance", "def": "people-and-purpose principles (Collective benefit, Authority to control, Responsibility, and Ethics) from the Global Indigenous Data Alliance that sit alongside data-sharing rules to keep Indigenous rights and wellbeing at the centre.", "cite": "Global Indigenous Data Alliance, 2019"}], "readings": [{"apa": "Mohamed, S., Png, M.-T., & Isaac, W. (2020). Decolonial AI: Decolonial theory as sociotechnical foresight in artificial intelligence. Philosophy & Technology, 33, 659-684.", "scope": "Open access", "id": "mohamed2020"}, {"apa": "Smillie-Adjarkwa, C. (2005). Is the internet a useful resource for Indigenous women living in remote communities? National Network for Aboriginal Mental Health Research.", "scope": "Open access", "id": "smillie2005"}, {"apa": "First Nations Information Governance Centre. (2014). Ownership, control, access and possession (OCAP): The path to First Nations information governance. First Nations Information Governance Centre.", "scope": "Open access", "id": "fnigc2014", "url": "https://fnigc.ca/wp-content/uploads/2020/09/5776c4ee9387f966e6771aa93a04f389_ocap_path_to_fn_information_governance_en_final.pdf"}, {"apa": "Global Indigenous Data Alliance. (2019). CARE principles for Indigenous data governance. Global Indigenous Data Alliance.", "scope": "Open access", "id": "gida2019", "url": "https://www.gida-global.org/careprinciples"}], "activity": {"screen": "activity", "archetype": "lab", "title": "Apply OCAP and CARE", "what": "You run a real data-governance case through the OCAP and CARE principles and decide what would change if the community governed its own data.", "why": "It turns Indigenous data sovereignty from a definition into a tool you can use, and it asks the system, not the community, to justify who governs the data.", "data": {"case": "A provincial health agency holds a dataset about a First Nation's community health, collected by outside researchers and stored on the agency's own servers. The community can request reports but cannot change what is collected, cannot reach the raw records, and does not hold a copy. You decide which governance principles to apply.", "levers": [{"label": "Ownership (OCAP)", "effect": "Recognises the community, not the agency, as the collective owner of its information, so it is the community's claim to the data that is honoured first.", "tradeoff": "Ownership on paper can be hollow if the agency still controls and physically holds the data, so this principle alone does not move real power.", "cite": "First Nations Information Governance Centre, 2014"}, {"label": "Control (OCAP)", "effect": "Gives the community say over what is collected and how it is used, so research and reporting happen on the community's terms rather than the agency's.", "tradeoff": "Control without access or possession means the community can set rules but still cannot reach or hold the records, which slows decisions and depends on the agency's cooperation.", "cite": "First Nations Information Governance Centre, 2014"}, {"label": "Access (OCAP)", "effect": "Ensures the community can reach the data about itself, including the raw records, not just curated reports the agency chooses to share.", "tradeoff": "Access lets the community see the data but not decide its use, so it is thin on its own and must be paired with control to matter.", "cite": "First Nations Information Governance Centre, 2014"}, {"label": "Possession (OCAP)", "effect": "Moves physical stewardship of the data to the community, turning a right on paper into a right it can actually exercise, withhold, or undo.", "tradeoff": "Possession demands infrastructure and capacity the community may not yet have, and Smillie-Adjarkwa (2005) reminds us access to that infrastructure is not equal in remote communities.", "cite": "First Nations Information Governance Centre, 2014"}, {"label": "Collective benefit (CARE)", "effect": "Requires that the data and any AI built on it work for the community's wellbeing first, not mainly for the agency's research goals or outside funders.", "tradeoff": "Naming collective benefit does not by itself transfer control, so it can be stated as a value while the real decisions stay with the agency unless paired with OCAP.", "cite": "Global Indigenous Data Alliance, 2019"}, {"label": "Authority to control (CARE)", "effect": "Affirms the community's right and authority to govern how the data is used at every stage, which is the CARE principle that most directly answers algorithmic colonialism by keeping authority with those most affected.", "tradeoff": "Authority must be resourced and recognised by the agency to be real, and a decolonial approach warns that authority granted in name only repeats the extraction it claims to refuse.", "cite": "Global Indigenous Data Alliance, 2019"}], "pick": 2}}, "youcan": ["You can now explain Indigenous data sovereignty in your own words and attribute it to First Nations, Inuit, and Metis communities.", "You can now describe the four OCAP principles, attribute them to the First Nations Information Governance Centre, and say what each protects.", "You can now run a data-governance case through OCAP and CARE and name what would change if the community governed its own data."], "reflectPrompt": "Think of a community you belong to or work with. Who governs the data collected about it now, and what would change if that community governed its own data under principles like OCAP? Connect it to your Seneca program or field."},
      9: {"time": "Flexible pacing: work in manageable blocks and use breaks and accessibility supports as needed.", "deck": "BFS218_Week09", "overview": "This week completes the four dimensions of the New Jim Code with the one Benjamin saves for last: technological benevolence, the false promise of help. The idea is simple but slippery: the most dangerous systems may be the ones that arrive as care, a fix, an upgrade, an act of help, while still carrying the old harms. You will learn to name the benevolence trap, where a tool sold as the solution becomes harder to question than one that is openly harmful. Then you will practice Benjamin's hard test, will the fix fix it, and add a technology of your own to your Personal Cartography.", "purpose": "Technological benevolence is the fourth and final dimension of the New Jim Code, and it completes the anatomy you have built since Week 2. The point of this week is to help you look past benevolent framing and ask, of any proposed fix, whether it actually changes the harm or only makes it harder to question. It turns the whole course toward response: once you can see harm hiding inside help, you can test the solutions you are offered instead of trusting them.", "outcomes": ["By the end of this week you can define technological benevolence as harm carried inside the language of help.", "By the end of this week you can recognize the benevolence trap, where a fix sold as care disarms criticism in advance.", "By the end of this week you can explain Benjamin's argument in Raising Robots about helpers, disposability, and race.", "By the end of this week you can apply the will-the-fix-fix-it test to a real technology and add it to your Personal Cartography."], "guiding": ["What makes a technology sold as help harder to criticize than one that is openly harmful?", "In Raising Robots, why does Benjamin connect the disposability of robots to the denigration of racialized people?", "Who benefits when a harm is reframed as a problem that technology has already solved?", "How would you tell a real repair from a comfortable story about one?"], "checks": [{"t": "What technological benevolence means: harm carried inside the language of help, care, a fix, or an upgrade", "look": "the Key Concepts and the Benjamin reading"}, {"t": "The benevolence trap: why a tool sold as care can be harder to question than one that is openly harmful", "look": "the Benjamin reading"}, {"t": "Benjamin's argument in Raising Robots about helpers, disposability, and race, and the police throwbots example", "look": "the Benjamin reading"}, {"t": "The will-the-fix-fix-it test: asking whether a fix actually changes the harm, and for whom", "look": "the activity and the Key Concepts"}, {"t": "Naming a technology in your own life that was sold to you, or to your community, as help", "look": "the activity and your Personal Cartography"}], "concepts": [{"h": "Help can be how harm survives", "body": "Technological benevolence is Benjamin's fourth dimension: technology promoted as good for us, a fix, an upgrade, an act of care, that still carries the old harms. The benevolent framing is not a side effect; it is part of how the harm survives, because help is hard to argue with. A tool sold as the solution is harder to question than one that is openly harmful, and that difficulty is the point.", "cite": "Benjamin, 2019"}, {"h": "The benevolence trap", "body": "The benevolence trap is what makes this dimension dangerous. A tool sold as the solution disarms criticism in advance, so to question it can feel like opposing progress or refusing help. The trap is not only the harm itself but the difficulty of naming it once it wears the language of care. A harm you cannot name, you cannot organize against.", "cite": "Benjamin, 2019"}, {"h": "Raising Robots connects disposability to race", "body": "In Raising Robots, Benjamin shows how robots and automation are imagined as helpers and even servants, and how the disposability of robots travels with the denigration of racialized people. Her example is police throwbots, sent in first so officers can own the real estate with their eyes before paying with their bodies. The machine is framed as safety, which is why the right question becomes safety for whom.", "cite": "Benjamin, 2019"}, {"h": "Will the fix fix it?", "body": "This is Benjamin's working question for the dimension. For any proposed fix, ask what it actually changes and for whom. A comfortable story makes harm look solved while who carries the cost has not changed; a real repair changes who pays. The test is to separate a real repair from a comfortable story about one, and to remember that benevolence rarely arrives alone.", "cite": "Benjamin, 2019"}], "terms": [{"term": "Technological benevolence", "def": "Benjamin's fourth dimension of the New Jim Code: technology promoted as good for us, a fix, an upgrade, an act of help, that still carries existing harms because the framing of care disarms criticism.", "cite": "Benjamin, 2019"}, {"term": "The benevolence trap", "def": "what makes this dimension dangerous: a tool sold as the solution is harder to question than one that is openly harmful, so the harm is not only done but hard to name.", "cite": "Benjamin, 2019"}, {"term": "Will the fix fix it?", "def": "Benjamin's working test for any proposed solution: ask what it actually changes and for whom, to tell a real repair from a comfortable story about one.", "cite": "Benjamin, 2019"}, {"term": "Raising Robots", "def": "the chapter section where Benjamin examines machines framed as helpers, including police throwbots, and shows how the disposability of robots travels with the denigration of racialized people.", "cite": "Benjamin, 2019"}], "readings": [{"apa": "Benjamin, R. (2019). Race after technology: Abolitionist tools for the New Jim Code. Polity Press. (Technological benevolence, the fourth dimension; the chapter section Raising Robots.)", "scope": "Read this on Blackboard", "id": "benjamin2019"}], "activity": {"screen": "activity", "archetype": "scenario", "title": "The benevolence test", "what": "You evaluate a 'tech for good' pitch one promise at a time and decide whether each one is a real repair or a comfortable story that hides a harm.", "why": "so you practice Benjamin's working question, will the fix fix it, on a friendly-sounding system before you trust the next one you are offered.", "data": {"setup": "A start-up pitches CareScan, a 'tech for good' tool for a city shelter network: an AI camera and check-in app that promises to keep residents safe, speed up intake, and flag people who need help, all framed as care for a vulnerable community.", "steps": [{"situation": "The pitch opens: CareScan will make the shelter safer by watching every common area around the clock and alerting staff to incidents automatically.", "choices": [{"label": "Accept it: more watching means more safety for residents.", "outcome": "This is the benevolence trap. The camera is sold as safety, but constant surveillance of a vulnerable, often racialized population is the same exposure harm wrapped in the language of care. Ask: safety for whom.", "harm": true, "cite": "Benjamin, 2019"}, {"label": "Ask who the watching actually serves and who carries its cost.", "outcome": "This is the right move. Naming who is watched and who benefits separates a real safety measure from coded exposure sold as care, which is exactly the question Benjamin's framework demands.", "harm": false, "cite": "Benjamin, 2019"}]}, {"situation": "Next promise: CareScan's intake app uses an automated risk score to decide who gets a bed first, which the founders call a fairer, faster fix than staff judgment.", "choices": [{"label": "Run the will-the-fix-fix-it test: what does the score actually change, and for whom?", "outcome": "This is the right move. The test exposes that a fix sold as fairness can simply relocate the harm. If the score has not changed who carries the cost, it is a comfortable story, not a real repair.", "harm": false, "cite": "Benjamin, 2019"}, {"label": "Trust the score because it removes human bias and is faster.", "outcome": "This is the comfortable story. A faster, friendlier tool can still carry engineered inequity underneath; benevolence rarely arrives alone, so an automated score deserves more scrutiny, not less.", "harm": true, "cite": "Benjamin, 2019"}, {"label": "Ask whether the score has been tested for who it advantages and who it sets back.", "outcome": "This is also a strong move. Asking who the fix advantages and who it sets back is how you tell a real repair from a harm reframed as a problem technology has already solved.", "harm": false, "cite": "Benjamin, 2019"}]}, {"situation": "Closing promise: the founders say CareScan deploys cleanup and delivery robots so staff face less risky work, and they add that the robots are cheap and disposable.", "choices": [{"label": "Approve it: disposable robots take on the dangerous tasks, so no person is put at risk.", "outcome": "This repeats Benjamin's warning in Raising Robots. Machines framed as helpers can serve power, and the language of disposability travels with the denigration of the racialized people whose labour and risk the system still depends on. Ask who is really treated as disposable.", "harm": true, "cite": "Benjamin, 2019"}, {"label": "Ask who is still doing the risky labour and who the friendly framing leaves out.", "outcome": "This is the right move. Looking past the helper framing to who actually carries the risk is how you refuse the comfortable story and apply Benjamin's politics of help.", "harm": false, "cite": "Benjamin, 2019"}]}]}}, "youcan": ["You can now define technological benevolence as harm carried inside the language of help.", "You can now name the benevolence trap and explain why a fix sold as care is harder to criticize than open harm.", "You can now apply the will-the-fix-fix-it test to a real technology and tell a repair from a comfortable story."], "reflectPrompt": "Think of one technology in your own life that was sold to you, or to a community you belong to, as help. What is the harm underneath, and what does the language of help make hard to question?"},
      10: {"time": "Flexible pacing: work in manageable blocks and use breaks and accessibility supports as needed.", "deck": "BFS218_Week10", "overview": "This week is about who is let through the gate, and who is kept out, when the gatekeeper is an algorithm. Automated systems now decide access in hiring, in lending, and in education, and they decide at scale and at speed. You will learn how an automated gate can reproduce racial inequity, name where that inequity lives, and ask the hard question that follows: when a model keeps someone out, quietly and at scale, who can they ask, and who is accountable.", "purpose": "Gatekeeping is where the dimensions you have studied this term meet a person's life chances. The point of this week is to help you explain how an automated gate can reproduce racial inequity at scale, and to name who is accountable when it does. It carries the New Jim Code forward into the systems that govern real opportunity, and it sets up the work on resistance and policy still to come.", "outcomes": ["By the end of this week you can explain algorithmic gatekeeping and give an example from hiring, lending, or education.", "By the end of this week you can summarise the Bird, Castleman, and Song (2023) finding on bias in predicting student success.", "By the end of this week you can distinguish inequality within the algorithm from inequality without it, after Devlin (2023).", "By the end of this week you can identify a gate in your own life decided by a system, and add it to your Personal Cartography."], "guiding": ["When an algorithm decides who is let through a gate, who can the person who is kept out actually ask?", "Bird, Castleman, and Song found bias in predicting student success. What is the harm in being flagged, early and wrongly, as likely to fail?", "Devlin distinguishes inequality within and without the algorithm. What does each mean, and why do both matter?", "Which gate in your own life, a job portal, a loan, an admission, a benefit, was decided in part by a system?"], "checks": [{"t": "What algorithmic gatekeeping is: automated systems deciding access in hiring, lending, or education, at scale and at speed", "look": "the Key Concepts and the Devlin reading"}, {"t": "The harm in being flagged, early and wrongly, as likely to fail, and how that label can come true", "look": "the Bird, Castleman, and Song reading"}, {"t": "Inequality within the algorithm versus inequality without it, and why both matter", "look": "the Devlin reading"}, {"t": "How a search or ranking system can reproduce racism and sexism while looking like a neutral utility", "look": "the Noble reading"}, {"t": "Naming a gate in your own life, a job portal, a loan, or an admission, that a system helped decide, and who you could ask", "look": "the activity and your Personal Cartography"}], "concepts": [{"h": "An algorithmic gate decides at scale and in an instant", "body": "Algorithmic gatekeeping is the use of automated systems to decide who is granted access: who is hired, who is approved for credit, who is admitted or flagged in education. The gate operates at scale and at speed, sorting thousands of people on the same rule. The person it keeps out often has no one to ask and no decision to appeal, because the human gatekeeper who could once explain a decision has been replaced by a model that answers no one.", "cite": "Devlin, 2023"}, {"h": "A tool sold as help can still harm", "body": "Bird, Castleman, and Song (2023) studied predictive models that colleges use to flag community college students as likely to succeed or fail. They found that algorithmic bias can reinforce racial inequities. A model meant to point support toward students who need it can instead label some students, early and wrongly, as poor bets. That label shapes who gets help and who is quietly written off, and it can become true precisely because the system acted on it.", "cite": "Bird, Castleman & Song, 2023"}, {"h": "Inequality lives within and without the algorithm", "body": "Devlin (2023) argues that inequality in AI sits in two places at once. Within the algorithm, it lives in the data and the design. Without it, it lives in who builds these systems and who is subject to them. Both matter, because fixing the data does not fix who holds the power, and changing who builds the tool does not fix biased data on its own.", "cite": "Devlin, 2023"}, {"h": "A ranking is a gate too", "body": "Safiya Umoja Noble shows that search and ranking systems can reproduce racism and sexism, often against Black women, while presenting as neutral utilities. A ranking is a gate too: what is pushed to the top is let through, and what is buried is kept out. The harm is easy to miss because the system looks like an objective tool rather than a decision about who counts.", "cite": "Noble, 2018"}], "terms": [{"term": "Algorithmic gatekeeping", "def": "the use of automated systems to decide who is granted access, such as who is hired, approved for credit, or admitted; the gate runs at scale and at speed, and the person kept out often has no one to ask and no decision to appeal.", "cite": "Devlin, 2023"}, {"term": "Bias in predicting success", "def": "the finding that predictive models used to flag students as likely to succeed or fail can carry algorithmic bias that reinforces racial inequities, labelling some students early and wrongly as poor bets.", "cite": "Bird, Castleman & Song, 2023"}, {"term": "Inequality within and without the algorithm", "def": "Devlin's distinction between inequality inside the system, in its data and design, and inequality outside it, in who builds these systems and who is subject to them.", "cite": "Devlin, 2023"}, {"term": "Algorithms of oppression", "def": "Noble's argument that search and ranking systems can reproduce racism and sexism, especially against Black women, while presenting themselves as neutral tools.", "cite": "Noble, 2018"}], "readings": [{"apa": "Bird, K. A., Castleman, B. L., & Song, Y. (2023). Are algorithms biased in education? Exploring racial bias in predicting community college student success. EdWorkingPaper No. 23-717. Annenberg Institute at Brown University.", "scope": "Open access", "id": "bird2023"}, {"apa": "Devlin, K. (2023). Power in AI: Inequality within and without the algorithm. In The handbook of gender, communication, and women's human rights (pp. 123-139). Wiley-Blackwell. https://doi.org/10.1002/9781119800729.ch8", "scope": "Read this on Blackboard", "id": "devlin2023"}, {"apa": "Noble, S. U. (2018). Chapter 1: A society, searching. In Algorithms of oppression: How search engines reinforce racism. NYU Press.", "scope": "Read this on Blackboard", "id": "noble2018"}], "activity": {"screen": "activity", "archetype": "toggle", "title": "At the gate", "what": "You adjust an automated screening system, moving a threshold and switching criteria on or off, and watch who gets filtered out.", "why": "so you see for yourself how a design choice, not a person, decides who is let through and who is kept out, and where the harm falls.", "data": {"system": "An automated screening gate for a job, a loan, or a college program", "toggles": [{"label": "Resume keyword filter (auto-screen applicants before any person reads them)", "on": "Applicants whose words do not match the model's idea of a strong candidate are cut before a human ever sees them.", "off": "Every application reaches a person who can ask a question and weigh context.", "whoHarmed": "Applicants from backgrounds, schools, or first languages the training data underrepresented, screened out at scale with no one to ask.", "cite": "Devlin, 2023"}, {"label": "Early risk flag (predict who is likely to fail and sort support accordingly)", "on": "Students the model flags as likely to fail are watched, steered away, or simply not offered the help given to students it trusts.", "off": "Support is offered on need and request, not on a prediction made before the term has run.", "whoHarmed": "Students the biased model marks early and wrongly as poor bets, who lose support and can be made to fail by the flag itself.", "cite": "Bird, Castleman & Song, 2023"}, {"label": "Credit-score cutoff (set the threshold that decides who is trusted with money)", "on": "A hard cutoff approves applicants above the line and refuses everyone below it, with no review of the history behind the number.", "off": "A person reviews borderline cases and can weigh circumstances the score cannot see.", "whoHarmed": "Applicants whose communities carry the legacy of unequal access to credit, refused at the threshold while the gate looks objective.", "cite": "Devlin, 2023"}, {"label": "Search ranking (push some results to the top and bury others)", "on": "What the ranking promotes is let through to attention; what it buries is effectively kept out, while the system looks like a neutral utility.", "off": "Results are shown without a hidden ordering that sorts who and what is seen.", "whoHarmed": "Groups the ranking demeans or buries, often Black women, harmed by a sorting that presents itself as a neutral tool.", "cite": "Noble, 2018"}]}}, "youcan": ["You can now explain algorithmic gatekeeping and give an example from hiring, lending, or education.", "You can now distinguish inequality within the algorithm from inequality without it, after Devlin.", "You can now name the harm in being flagged, early and wrongly, as likely to fail, after Bird, Castleman, and Song."], "reflectPrompt": "Every gate an algorithm guards was once guarded by a person who could be asked to explain. Name one gate in your own life or future field that a system helped decide: who did it let through, who did it keep out, and who could you actually ask?"},
      11: {"time": "Flexible pacing: work in manageable blocks and use breaks and accessibility supports as needed.", "deck": "BFS218_Week11", "overview": "This is the week the whole course has been building toward. All term you have learned to see the New Jim Code and trace its harms, and now the course turns from critique to construction: you stop only naming what is wrong and start asking how to build differently. The subtitle of Benjamin's book is Abolitionist Tools for the New Jim Code, and this week you pick up those tools. You will learn design justice and the abolitionist stance, learn to tell a reform that leaves a system intact from a real repair that moves power, and begin Design the Repair.", "purpose": "Week 11 reframes the course from critique to construction. The point is to give you concrete anti-racist strategies, design justice and abolitionist tools, so you can bring a response, not only a diagnosis, to a system in your own map. It sets up the final move of the course toward accountability and policy.", "outcomes": ["By the end of this week you can explain design justice and name several of its principles.", "By the end of this week you can explain what Benjamin means by abolitionist tools, as opposed to patches.", "By the end of this week you can distinguish a reform that leaves a system intact from a real repair that moves power.", "By the end of this week you can begin Design the Repair by returning to one system from your Personal Cartography and proposing a design-justice or abolitionist response."], "guiding": ["What is the difference between a reform that leaves a system intact and a real repair?", "Design justice centres those most affected. What changes when the people harmed lead the design, instead of being consulted at the end?", "Benjamin calls for abolitionist tools, not patches. What would it mean to refuse a system rather than improve it?", "Tanksley centres Black youth as technological innovators. Where have you seen communities build their own tools?"], "checks": [{"t": "What design justice is, and several of its principles, including centring those most affected and impact over intentions", "look": "the Key Concepts and the Costanza-Chock reading"}, {"t": "What Benjamin means by abolitionist tools as opposed to patches, asking whether the gate should exist at all", "look": "the Benjamin reading"}, {"t": "Telling a reform that leaves a system intact from a real repair that moves who holds power and who carries the cost", "look": "the Benjamin reading"}, {"t": "Centring Black youth as technological innovators, not only as people who are harmed", "look": "the Tanksley reading"}, {"t": "Bringing a design-justice or abolitionist response, not only a diagnosis, to a system in your own Personal Cartography", "look": "the activity and your Personal Cartography"}], "concepts": [{"h": "Design justice", "body": "Design justice rethinks how things get designed so that it centres the people who are normally marginalized by design. Its principles include centring the voices of those directly impacted, prioritizing the design's impact on the community over the designer's intentions, treating everyone as an expert in their own lived experience, and looking first for what is already working at the community level. The people most affected lead the design, they are not consulted after it is built.", "cite": "Costanza-Chock, 2020"}, {"h": "Abolitionist tools", "body": "Benjamin calls for abolitionist tools: not patches that make an unjust system run more smoothly, but tools that refuse the system and help build something more just. The distinction is between reform, which preserves the structure while easing its worst edges, and abolition, which reimagines the structure itself. An abolitionist tool asks not how to fix the gate, but whether the gate should exist at all.", "cite": "Benjamin, 2019"}, {"h": "Reform versus real repair", "body": "The working test this week is to ask of any proposed response: is it a reform or a real repair? A reform eases harm but leaves power in place, so after the change the same people still decide. A real repair changes who holds power and who carries the cost. The test exposes fixes that sound generous, like more diverse data or a fairness audit, that can soften harm while the same company keeps deciding everything.", "cite": "Benjamin, 2019"}, {"h": "Centring Black youth as innovators", "body": "Tanksley models the abolitionist move in education with a critical race pedagogy in computer science that centres the voices, experiences, and technological innovations of Black youth. The shift is from seeing communities only as people who are harmed to seeing them as designers and builders. If communities are only ever the harmed, others still hold the power to fix them, so treating Black youth as innovators is itself part of moving that power.", "cite": "Tanksley, 2023"}], "terms": [{"term": "Design justice", "def": "an approach that rethinks design to centre people normally marginalized by it, so those most affected lead the work and count as experts by their own lived experience.", "cite": "Costanza-Chock, 2020"}, {"term": "Abolitionist tools", "def": "tools that do not make an unjust system run more smoothly but refuse it and help build a just alternative; the question shifts from how to fix the gate to whether the gate should exist.", "cite": "Benjamin, 2019"}, {"term": "Impact over intentions", "def": "the design justice rule that a design is judged by its real effect on the community, not by whether the designer meant well.", "cite": "Costanza-Chock, 2020"}, {"term": "Critical race pedagogy in computer science", "def": "an abolitionist way of teaching that centres the voices, experiences, and technological innovations of Black youth, treating them as designers rather than only as those harmed.", "cite": "Tanksley, 2023"}], "readings": [{"apa": "Costanza-Chock, S. (2020). Design justice: Community-led practices to build the worlds we need (Introduction, pp. 1-30). MIT Press.", "scope": "Read this on Blackboard", "id": "costanza2020"}, {"apa": "Tanksley, T. (2023). Employing an abolitionist, critical race pedagogy in CS: Centering the voices, experiences and technological innovations of Black youth. Journal of Computer Science Integration, 6(1).", "scope": "Open access", "id": "tanksley2023"}, {"apa": "Benjamin, R. (2019). Race after technology: Abolitionist tools for the New Jim Code (Chapter 5: Retooling solidarity, reimagining justice). Polity Press.", "scope": "Read this on Blackboard", "id": "benjamin2019"}], "activity": {"screen": "activity", "archetype": "assemble", "title": "Build the abolitionist toolkit", "what": "You pick one harmful system from your Personal Cartography and assemble a toolkit of abolitionist tactics against it, choosing which tactics to include and saying what each one contributes.", "why": "so you move from naming harm to proposing a real response, and learn to judge whether your toolkit reforms a system or actually repairs it by moving power.", "data": {"goal": "The harm is a racialized gatekeeping system, for example a biased screening, scoring, or recognition tool that decides who gets through and quietly leaves the same people deciding. A good toolkit does not just smooth that system's edges; it shifts who leads the design and who holds power, so the response is a real repair rather than a reform.", "components": [{"label": "Audit the system", "role": "Measure who the system fails and who it serves, so the harm is documented evidence rather than a feeling, and the case for change is grounded.", "cite": "Benjamin, 2019"}, {"label": "Refuse or abolish", "role": "Ask whether the gate should exist at all and be willing to not build or to retire the system, the abolitionist move that a patch never makes.", "cite": "Benjamin, 2019"}, {"label": "Centre those most affected", "role": "Put the people normally marginalized by the design in the lead, as experts in their own lived experience, not consulted after the fact.", "cite": "Costanza-Chock, 2020"}, {"label": "Judge by impact, not intentions", "role": "Hold the response to its real effect on the community rather than to the designer's good intentions, so a well-meaning fix that still harms does not pass.", "cite": "Costanza-Chock, 2020"}, {"label": "Build with community-led innovation", "role": "Treat the affected community, including Black youth, as designers and builders of their own tools, so the alternative is built by those closest to the harm.", "cite": "Tanksley, 2023"}, {"label": "Apply the reform-or-repair test", "role": "Check the assembled toolkit against one question: after this, who still decides? If power has not moved, it is a reform, not a real repair.", "cite": "Benjamin, 2019"}]}}, "youcan": ["You can now explain design justice and name several of its principles in your own words.", "You can now tell the difference between a patch and an abolitionist tool, and between a reform and a real repair.", "You can now bring a response, not only a diagnosis, to a system in your own Personal Cartography."], "reflectPrompt": "You have spent a term learning to see harm. Resistance asks something harder: to build. What is the difference between refusing a bad system and creating a better one, and which is being asked of you, in your own field, right now?"},
      12: {"time": "Flexible pacing: work in manageable blocks and use breaks and accessibility supports as needed.", "deck": "BFS218_Week12", "overview": "This is the last content week of the course, and it lifts the question up a level. So far you have named harmful systems, measured the harm, and proposed fixes for single tools. This week asks what holds technology accountable at the scale of law, institutions, and international human rights, because an individual fix does not last if the rules above it still permit the harm. You will look at Canada's proposed AI law and its gaps, see techno-racism named as a human rights matter, and weigh what a just policy future could include.", "purpose": "Week 12 lifts the course to the level of accountability and policy. You examine how Canadian law, international human rights, and decolonial frameworks each try to govern technology, and you judge where each one succeeds and where it falls short. The point is to see accountability as a stack and to work the levels above the single system, where lasting change is made.", "outcomes": ["By the end of this week you can explain why accountability for technology must operate at the level of law and institutions, not only individual fixes.", "By the end of this week you can identify one documented gap in Canada's proposed Artificial Intelligence and Data Act, after Attard-Frost (2023).", "By the end of this week you can summarise how the UN frames racial discrimination in digital technologies as a human rights issue.", "By the end of this week you can describe what it means to build justice into AI governance from the start, and add a policy entry to your Personal Cartography."], "guiding": ["Why are individual fixes not enough when the rules themselves permit the harm?", "Attard-Frost documents gaps in Canada's draft AI law. What is one gap, and who does it leave unprotected?", "The UN frames techno-racism as a human rights issue. What changes when harm is named as a rights violation?", "For a technology you use, what rule or policy would you change, and who would have to be at the table?"], "checks": [{"t": "Accountability as a stack: why fixing one system does not last when the rules above it still permit the harm", "look": "the Key Concepts and the Attard-Frost reading"}, {"t": "One documented gap in Canada's proposed Artificial Intelligence and Data Act, and who it leaves exposed", "look": "the Attard-Frost reading"}, {"t": "How the UN frames racial discrimination in digital technologies as a human rights issue, and what that changes", "look": "the United Nations Human Rights Council reading"}, {"t": "What it means to build justice into AI governance from the start, with affected communities at the table", "look": "the activity and the Key Concepts"}, {"t": "Naming a technology in your own life and what rule or policy you would change, and who would need to be at the table", "look": "the activity and your Personal Cartography"}], "concepts": [{"h": "Accountability is a stack, not a patch", "body": "Accountability for technology operates at several levels: the single system at the bottom, then institutions and frameworks, then national law, then international human rights at the top. A fix aimed at one system does not last if the rules above it still permit the harm, because the next company can ship the same design. That is why this week works the top three levels, where lasting change is made.", "cite": "Attard-Frost, 2023"}, {"h": "AI governance and its gaps", "body": "AI governance is the set of laws, rules, and institutions that try to constrain how AI is built and used. In Canada, the proposed Artificial Intelligence and Data Act (AIDA) is the leading attempt. In a 2023 submission to the Standing Committee on Industry and Technology, Blair Attard-Frost documented real gaps in it, including weak protection for artists and creators facing generative AI. A law with gaps still leaves people exposed, so a gap is not just a missing detail, it shows whose harm the rule was not written to count.", "cite": "Attard-Frost, 2023"}, {"h": "Techno-racism as a human rights issue", "body": "In a 2020 report, the UN Special Rapporteur on contemporary forms of racism analysed racial discrimination in emerging digital technologies as a human rights matter. Naming techno-racism as a rights violation, rather than a technical glitch, changes what it asks of governments. It creates obligations on states and gives affected communities a stronger basis to demand change and redress.", "cite": "United Nations Human Rights Council, 2020"}, {"h": "Building justice in from the start", "body": "Building justice in means accountability is designed into a system from the beginning, with the communities most affected at the table, rather than added after harm has already happened. It is the governance counterpart to design justice: not only how we build a tool, but how we govern it, and with whom. Attard-Frost (2023) shows the stakes: when accountability is left out of AI law at the start, the gaps fall hardest on the people with the least power to push back.", "cite": "Attard-Frost, 2023"}], "terms": [{"term": "AI governance", "def": "the set of laws, rules, and institutions that try to constrain how AI is built and used; in Canada, the proposed Artificial Intelligence and Data Act (AIDA) is the leading attempt.", "cite": "Attard-Frost, 2023"}, {"term": "Documented gap", "def": "a place where a law leaves people exposed, such as the weak protection for artists and creators facing generative AI that Attard-Frost found in AIDA; a gap shows whose harm the rule was not written to count.", "cite": "Attard-Frost, 2023"}, {"term": "Techno-racism as a human rights issue", "def": "naming racial discrimination in digital technologies as a rights violation rather than a technical glitch, which creates obligations on states and gives affected communities a stronger basis to demand change.", "cite": "United Nations Human Rights Council, 2020"}, {"term": "Building justice in from the start", "def": "designing accountability into a system from the beginning, with affected communities at the table, rather than regulating only after harm.", "cite": "Attard-Frost, 2023"}], "readings": [{"apa": "Attard-Frost, B. (2023). Generative AI systems: Impacts on artists and creators and related gaps in the Artificial Intelligence and Data Act. Submission to the Standing Committee on Industry and Technology, Parliament of Canada.", "scope": "Open access", "id": "attard2023"}, {"apa": "United Nations Human Rights Council. (2020). Racial discrimination and emerging digital technologies: A human rights analysis (A/HRC/44/57). Report of the Special Rapporteur on contemporary forms of racism.", "scope": "Open access", "id": "unhrc2020", "url": "https://undocs.org/A/HRC/44/57"}], "activity": {"screen": "activity", "archetype": "lab", "title": "Draft the policy", "what": "You take a real accountability case, choose two policy levers to apply to it, and weigh what each one would fix and what it would cost.", "why": "so accountability stops being an abstract word and becomes a set of real trade-offs you have to reason through, the same choices a regulator faces.", "data": {"case": "Canada is deciding how to govern a generative AI system that scrapes artists' and creators' work to train itself, the same kind of gap Attard-Frost (2023) found left open in the proposed Artificial Intelligence and Data Act.", "levers": [{"label": "Outright ban", "effect": "Prohibits the system or use entirely, so the harm cannot happen at all.", "tradeoff": "Blunt and hard to pass; it can sweep up beneficial uses and pushes development to places with no rules at all.", "cite": "Attard-Frost, 2023"}, {"label": "Audit mandate", "effect": "Requires independent, ongoing testing of the system for discriminatory or harmful effects before and after it is deployed.", "tradeoff": "Only as strong as who runs the audit and what they are allowed to see; an audit can find harm yet still leave the rules that permit it untouched.", "cite": "United Nations Human Rights Council, 2020"}, {"label": "Transparency requirement", "effect": "Forces disclosure of what data trained the system and how it is used, so the public can see and name the harm.", "tradeoff": "Visibility is not redress; people can see exactly how they are harmed and still have no power to stop it without enforcement behind it.", "cite": "Attard-Frost, 2023"}, {"label": "Right to redress", "effect": "Gives the people harmed a real, enforceable way to demand correction or compensation, treating the harm as a rights violation.", "tradeoff": "Acts after the harm has already landed, and is only as strong as the body meant to enforce it.", "cite": "United Nations Human Rights Council, 2020"}, {"label": "Moratorium", "effect": "Pauses deployment until proper governance and affected communities are in place, buying time before harm becomes entrenched.", "tradeoff": "Temporary by design; if the pause is not used to write better rules with the right people at the table, the harm simply resumes.", "cite": "United Nations Human Rights Council, 2020"}, {"label": "Justice built in from the start", "effect": "Designs and governs the system with affected communities at the table from the beginning, so accountability is built in rather than bolted on.", "tradeoff": "Slower and harder to set up than a quick rule, and it asks those already holding power to share the table, which they rarely do willingly.", "cite": "Attard-Frost, 2023"}], "pick": 2}}, "youcan": ["You can now explain why accountability has to operate above the single system, at institutions, national law, and human rights", "You can now name one documented gap in Canada's AIDA and say who it leaves exposed", "You can now describe what it means to build justice into AI governance from the start"], "reflectPrompt": "Laws move slower than the systems they try to govern, and they are often written by some people about others. Think of one technology in your own life: who would have to be at the table for a rule about it to be written with you, not just about you?"},
      13: {"time": "Flexible pacing: work in manageable blocks and use breaks and accessibility supports as needed.", "deck": "", "overview": "This is not a new topic; it is a return. For twelve weeks the course travelled out, into the anatomy of the New Jim Code, into Canada, agency, resistance, and policy. Now Part IV turns back toward you, and you reread your Personal Cartography from the first entry to the most recent, with the eyes you have grown over the term. This week you also record the Personal Cartography, the final project of the course, which is due at the end of this week.", "purpose": "The point of this week is to make your own growth visible to you. By rereading your whole map across the term, you can see your analysis deepening week by week and name how your seeing changed since Week 1. That rereading is the ground your final video grows from.", "outcomes": ["Read your own Personal Cartography across the whole term as one connected analysis, not a set of separate entries.", "Name how your seeing has changed since Week 1, pointing to specific entries that show the change.", "Identify which of the four dimensions, or which response from Part III, most changed how you read technology.", "Complete and submit the Personal Cartography, including one commitment you carry into your own field."], "guiding": ["Read your Week 1 entry beside your most recent one. What can you name now that you could not name in Week 1?", "Which of the four dimensions most changed how you read technology, and why?", "Which single entry in your map changed the most across the term?", "Where, in your own map, did harms compound across race, gender, class, or status?"], "checks": [{"t": "The Personal Cartography read in order as one record of your own seeing changing, not only a list of harmful systems", "look": "the Key Concepts and the Benjamin reading"}, {"t": "The four dimensions held together as a single lens you can read any system across at once", "look": "the Benjamin reading"}, {"t": "Naming which of the four dimensions, or which Part III response, most changed how you read technology", "look": "the activity and your Personal Cartography"}, {"t": "Moving from seeing to commitment: naming something you will carry into your own field, after design justice", "look": "the Costanza-Chock reading"}, {"t": "Setting your Week 1 entry beside your most recent one and naming what you can see now that you could not then", "look": "the activity and your Personal Cartography"}], "concepts": [{"h": "The Personal Cartography as a record of change", "body": "Your map is not only a record of harmful systems; it is a record of you learning to see them. Reread in order from Week 1, it shows your own analysis deepening week by week: the language sharpens, the examples get closer to home, and the responses you imagined in Part III start to appear. The technologies did not change between your first entry and your last. You did, and the point of the return is to make that growth visible to you.", "cite": "Benjamin, 2019"}, {"h": "The four dimensions, as a single lens", "body": "Engineered inequity, default discrimination, coded exposure, and technological benevolence are not four separate tests you run one at a time. Together they are one way of reading any system, and by now you can hold all four at once and ask which are at work in a given case. Rereading your map, you can see yourself moving from naming one dimension at a time toward reading a system across all four together.", "cite": "Benjamin, 2019"}, {"h": "From seeing to commitment", "body": "Seeing clearly is where this course began; it is not where it ends. Part III moved you from naming harm toward imagining response, and the return asks you to name a commitment, something you will carry into your own field now that you cannot unsee what you have learned. Costanza-Chock's design justice gives that commitment a shape: not only seeing a harmful system, but asking who should be at the table when a better one is built.", "cite": "Costanza-Chock, 2020"}], "terms": [{"term": "Personal Cartography", "def": "the map you have kept all term, one entry per week, recording the techno-racism you found and how you read it; reread in order, it is also a record of your own seeing changing across the course.", "cite": "Benjamin, 2019"}, {"term": "The four dimensions of the New Jim Code", "def": "engineered inequity, default discrimination, coded exposure, and technological benevolence, the four ways Benjamin shows technology can carry racism; together they form one lens for reading any system.", "cite": "Benjamin, 2019"}, {"term": "The return", "def": "the move that opens Part IV, where the course turns back toward you and your own map, so that rereading your earlier entries beside your later ones shows how your analysis deepened.", "cite": "Benjamin, 2019"}, {"term": "Commitment", "def": "the thing you decide to carry into your own field now that you can see techno-racism, naming not only a harmful system but who should be at the table when a better one is built.", "cite": "Costanza-Chock, 2020"}], "readings": [{"apa": "Benjamin, R. (2019). Race after technology: Abolitionist tools for the New Jim Code. Polity Press. (The four dimensions and the New Jim Code, your spine for rereading the whole map.)", "scope": "Read this on Blackboard", "id": "benjamin2019"}, {"apa": "Costanza-Chock, S. (2020). Design justice: Community-led practices to build the worlds we need. MIT Press. (For what an alternative looks like, and the commitment you carry forward.)", "scope": "Read this on Blackboard", "id": "costanza2020"}], "activity": {"screen": "activity", "archetype": "capstone", "title": "Reread your map", "what": "You revisit your Personal Cartography one dimension at a time, comparing what you saw at the start of the term with what you can see now.", "why": "so your final video grows out of a real rereading of your own map, not a summary of the lectures.", "data": {"prompt": "Reread your cartography across the four dimensions of the New Jim Code. Mark each as you revisit it.", "items": [{"label": "Engineered inequity", "prompt": "Find an early entry and a later entry where you wrote about a system that was built to advantage some people over others. What did you see in the early entry, and what can you name now that you could not name then?", "cite": "Benjamin, 2019"}, {"label": "Default discrimination", "prompt": "Where in your map did you describe harm that ran on through old patterns without anyone choosing it again? Compare your earliest reading of it with your most recent. How did your language for it sharpen?", "cite": "Benjamin, 2019"}, {"label": "Coded exposure", "prompt": "Trace where you wrote about who a system makes very visible and who it makes invisible. Read your first entry on this beside your last. What can you see now about who is watched and who is missed?", "cite": "Benjamin, 2019"}, {"label": "Technological benevolence", "prompt": "Find an entry about a tool that was sold as helpful or fair. How did your reading of that promise change as the term went on, and what do you notice now that you missed at first?", "cite": "Benjamin, 2019"}], "callout": "Open your Personal Cartography from the tools menu and reread your Week 1 entry beside your most recent one. Then record your Personal Cartography (instructions on Blackboard). It is due at the end of this week (Week 13)."}}, "youcan": ["You can now read your whole Personal Cartography across the term as one connected analysis", "You can now name how your seeing changed since Week 1, pointing to specific entries", "You can now begin the Personal Cartography, including one commitment you carry forward"], "reflectPrompt": "Reread your Personal Cartography in order and find the single entry that changed the most across the term. Which entry is it, and why did it change more than the others?"},
      14: {"time": "Flexible pacing: work in manageable blocks and use breaks and accessibility supports as needed.", "deck": "", "overview": "This is the last week, and it closes the course the way it opened, with a single question. Your Personal Cartography and final Map Exchange close were due by December 11, 2026 in Week 13; this week you answer together the question from the very first day: can a machine be racist? You answer it now in your own words, with your own map as the evidence, not from a textbook. What you carry forward is the lens you built and a commitment to use it in your own field.", "purpose": "Week 14 completes the course. You answer the opening question with evidence from your Personal Cartography, summarise the whole arc from seeing to return, and name one commitment you carry into your own work. The point is to leave able to say plainly what you could only sense in Week 1.", "outcomes": ["By the end of this week you can answer, in your own words and with an entry from your map as evidence, whether a machine can be racist.", "By the end of this week you can summarise the whole arc of the course: seeing, anatomy, response, and return.", "By the end of this week you can name one concrete commitment to equitable, accountable technology that you carry into your own field.", "By the end of this week you can use your completed Personal Cartography to answer the course's opening question in your own words."], "guiding": ["Can a machine be racist? Answer it now in your own words, and name one entry in your map as your evidence.", "Of everything you learned, what will you find hardest to unsee?", "What is the one commitment you are willing to make to your own field?", "When a future system arrives looking neutral, what will you do that you would not have done in Week 1?"], "checks": [{"t": "Answering can a machine be racist in your own words, with an entry from your own map as the evidence", "look": "the Key Concepts and the Benjamin reading"}, {"t": "Summarising the whole arc of the course in one breath: seeing, anatomy, response, and return", "look": "the Benjamin reading"}, {"t": "Why the answer does not end in despair: the same course that named the harm also named the tools to respond", "look": "the Costanza-Chock reading"}, {"t": "The map as yours to keep: carrying the four-dimension lens and the habit of asking who is harmed into your own field", "look": "the activity and your Personal Cartography"}, {"t": "Naming one concrete commitment to equitable, accountable technology that you carry forward", "look": "the activity and your Personal Cartography"}], "concepts": [{"h": "The whole arc, in one breath", "body": "Part I taught you to see: a harm needs no hatred, only a design, some data, and a default. Part II took the New Jim Code apart into four dimensions, engineered inequity, default discrimination, coded exposure, and technological benevolence. Part III turned to response, with data sovereignty, abolitionist tools, design justice, and policy. Part IV brought it home to your own map. Seeing, anatomy, response, return.", "cite": "Benjamin, 2019"}, {"h": "The question, answered", "body": "Can a machine be racist? Yes. It can carry racism forward through its design and defaults, inside a society already structured by racism, with no one intending it. But the answer does not end in despair, because the same course that showed you the harm also showed you the tools to respond: design justice, abolitionist tools, data sovereignty, and policy. The harm is real, and so is the response. Naming it clearly is where change begins.", "cite": "Benjamin, 2019"}, {"h": "The map is yours to keep", "body": "Your Personal Cartography does not end with the course. The lens you built, the four dimensions, the response, and the habit of asking who is harmed and who is accountable, goes with you into your field. The final task is not to finish a map but to keep one, so that when a future system arrives looking neutral you have somewhere to mark what you see.", "cite": "Benjamin, 2019"}], "terms": [{"term": "The four dimensions", "def": "the single lens for any system you will meet: engineered inequity, default discrimination, coded exposure, and technological benevolence, the four ways the New Jim Code carries racism without anyone having to hate.", "cite": "Benjamin, 2019"}, {"term": "The harm needs no hatred", "def": "the idea that a system can carry racism through a design, some data, and a default, inside a society already structured by racism, with no one intending it.", "cite": "Benjamin, 2019"}, {"term": "The response is real", "def": "the answer to the harm is not despair, because design justice, abolitionist tools, data sovereignty, and policy futures are concrete ways to respond that you can now name.", "cite": "Costanza-Chock, 2020"}, {"term": "Personal Cartography", "def": "your own completed map of techno-racism, the record of a term spent learning to see, which is yours to keep and to keep adding to beyond the course.", "cite": "Benjamin, 2019"}], "readings": [{"apa": "Benjamin, R. (2019). Race after technology: Abolitionist tools for the New Jim Code. Polity Press. The spine of the course and a book to keep.", "scope": "Read this on Blackboard", "id": "benjamin2019"}, {"apa": "Costanza-Chock, S. (2020). Design justice: Community-led practices to build the worlds we need. MIT Press. The response, for the work ahead.", "scope": "Read this on Blackboard", "id": "costanza2020"}], "activity": {"screen": "activity", "archetype": "capstone", "title": "The question, re-answered", "what": "You walk your whole map one last time and answer the question the course opened with, using your own entries as the evidence.", "why": "so the course closes the way it opened, with your own seeing, now able to say plainly what you could only sense in Week 1.", "data": {"prompt": "Walk your cartography one last time. Mark each part as you finish your final video.", "items": [{"label": "The harm, named", "prompt": "Name how a machine can carry racism through the four dimensions, engineered inequity, default discrimination, coded exposure, or technological benevolence, and point to one entry in your map that shows it.", "cite": "Benjamin, 2019"}, {"label": "The response, real", "prompt": "Point to one response you can now name, design justice, an abolitionist tool, data sovereignty, or policy, and say what it would change for the harm you just named.", "cite": "Costanza-Chock, 2020"}, {"label": "Your sharpest entry", "prompt": "Find the one entry in your map that changed the most from Week 1 to now, and say in a sentence what you can see in it today that you could not see then.", "cite": "Benjamin, 2019"}, {"label": "Your commitment", "prompt": "Name the one commitment you carry into your own field, the thing you will do that you would not have done before this course.", "cite": "Benjamin, 2019"}], "callout": "Finish recording your Personal Cartography (instructions on Blackboard) and prepare your reflection for the Blackboard Map Exchange. Your Personal Cartography and your commitment are yours to keep beyond the course."}}, "youcan": ["You can now answer the opening question, whether a machine can be racist, in your own words and with your own map as the evidence", "You can now summarise the whole arc of the course in one breath: seeing, anatomy, response, and return", "You can now name one commitment to equitable, accountable technology that you carry into your own field"], "reflectPrompt": "The course ends, but the map does not. Name the one commitment about technology and racism that you carry into your own field, in a sentence you would be willing to stand behind a year from now."},
    }
  };
  function weekData(w) { var c = (D.course && D.course.code) || ''; return (WEEKPAGE[c] && WEEKPAGE[c][w]) || null; }
  (function strengthenWeek2Terms() {
    var c = (D.course && D.course.code) || '', w2 = WEEKPAGE[c] && WEEKPAGE[c][2];
    if (!w2 || !Array.isArray(w2.terms)) return;
    var defs = {
      'Critical race theory (CRT)': 'a way of studying racism as more than individual prejudice. CRT asks how normal rules, policies, institutions, and everyday systems can repeatedly produce racial advantage and disadvantage while still sounding neutral. In this course, it helps you ask what a digital system does, who benefits, who is burdened, and what evidence would show harm.',
      'Structural and systemic racism': 'racial inequality produced by the routine design of systems: the data they use, the rules they apply, the defaults they assume, and the decisions they repeat. It does not require a single person with racist intent. A screening tool can reproduce housing, policing, or employment inequities because those inequities are already built into the records and rules it learns from.',
      'The New Jim Code': 'Benjamin\'s term for technologies that carry old racial inequities into new tools while being marketed as objective, efficient, fair, or progressive. The danger is not only that the tool reproduces harm, but that its technical language makes the harm harder to see and easier to defend.',
      'Intersectionality': 'Crenshaw\'s framework for seeing how systems of power overlap. It is not just adding identities together; it asks how race, gender, class, disability, immigration status, and other forces combine to create a specific kind of harm. In technology, it helps students ask who is harmed most clearly at the overlap, not only on one axis at a time.'
    };
    w2.terms = w2.terms.map(function (t) {
      if (t && defs[t.term]) return { term: t.term, def: defs[t.term], cite: t.cite };
      return t;
    });
    if (!w2.terms.some(function (t) { return t && t.term === 'Racism'; })) {
      w2.terms.unshift({
        term: 'Racism',
        def: 'a system of advantage and disadvantage organized around race. It can show up in individual prejudice, but in this course the key point is that racism also works through ordinary rules, institutions, data, defaults, and habits that produce unequal outcomes even when no one says a racist word or intends harm.',
        cite: 'Benjamin, 2019; Crenshaw, 1991'
      });
    }
  })();
  (function strengthenWeek5Terms() {
    var c = (D.course && D.course.code) || '', w5 = WEEKPAGE[c] && WEEKPAGE[c][5];
    if (!w5 || !Array.isArray(w5.terms)) return;
    var defs = {
      'Coded exposure': 'Benjamin\'s term for the uneven way technology makes people visible or invisible. Some people are over-watched, scanned, tracked, and flagged; others are not recognized, not served, or not counted correctly. Both can cause harm. The point is that visibility is designed through cameras, datasets, tests, thresholds, and institutions, not handed out naturally or equally.',
      'The coded gaze': 'Buolamwini\'s term for the way a system is built to see some faces better than others. In Gender Shades, commercial facial-analysis systems worked best on lighter-skinned men and failed most often on darker-skinned women. The coded gaze is not just a bad camera. It is a design and testing problem: whose faces filled the data, whose errors were noticed, and whose misrecognition was treated as acceptable.',
      'Intersectionality': 'Crenshaw\'s framework for seeing harm at the overlap of systems of power. Week 5 uses it because the facial-analysis problem is not visible if students look only at race or only at gender. The sharpest harm appears for darker-skinned women, at the intersection. Intersectionality asks: who is harmed most clearly when categories meet, and what does a single-axis view miss?',
      'The New Jim Code': 'Benjamin\'s name for technologies that carry old racial inequities forward while appearing new, neutral, efficient, fair, or even helpful. In Week 5, the New Jim Code appears when a modern facial-analysis system is trusted as objective even though its errors fall unevenly across race and gender. The danger is not only the mistake; it is the authority the technical system receives.'
    };
    w5.terms = w5.terms.map(function (t) {
      if (t && defs[t.term]) return { term: t.term, def: defs[t.term], cite: t.cite };
      return t;
    });
  })();
  (function strengthenBfs218ThinTerms() {
    var c = (D.course && D.course.code) || '';
    if (c !== 'BFS218') return;
    var defsByWeek = {
      1: {
        'Personal Cartography': 'your first major course task and your working map of digital life. You track tools you use, moments when you feel seen, sorted, watched, helped, or misread, and the questions those moments raise. The goal is not to prove harm immediately. It is to build a record you can return to as your course lens gets sharper.'
      },
      3: {
        'Engineered inequity': 'Benjamin\'s first dimension of the New Jim Code: technology that amplifies a hierarchy that already exists. The system does not have to create racism from nothing. It can take unequal records, assumptions, or access and make them faster, wider, and harder to challenge while calling the result neutral or efficient.',
        'Amplify, not create': 'the key distinction in engineered inequity. A tool may not invent the inequality it produces; it may inherit it from housing, policing, hiring, schooling, health care, or other social systems. The design then widens that existing gap, which means the fix is not better intentions but a different design and different accountability.',
        'The New Jim Code': 'Benjamin\'s name for technologies that carry old racial inequities forward while appearing neutral, fair, modern, or progressive. In Week 3, engineered inequity is one part of that pattern: a system can make an old hierarchy look like a clean technical result.'
      },
      4: {
        'Default discrimination': 'Benjamin\'s second dimension of the New Jim Code: harm that happens through a system\'s built-in defaults, settings, categories, data, and assumptions. A default treats one group\'s world as normal and makes everyone else adapt. The harm can continue without a racist designer because the system quietly keeps choosing for people.',
        'Is the glitch systemic?': 'Benjamin\'s question for failures that are dismissed as accidents. A one-time glitch is random; a systemic glitch repeats because of how the system was built, trained, tested, or deployed. The question asks students to look for a pattern, not only for a broken moment.',
        'Design as worldbuilding': 'Benjamin\'s phrase for the way design does more than make a tool look or work a certain way. Design builds a version of the world into categories, forms, databases, and defaults. When that built world treats whiteness, wealth, English, or one body type as normal, the technology reproduces those assumptions.'
      },
      6: {
        'Digital border technologies': 'the surveillance, biometrics, databases, risk tools, drones, and automated systems used to manage borders and migration. Molnar shows that these tools often test powerful technologies on people with limited ability to refuse: migrants, refugees, and asylum seekers. The issue is not only accuracy; it is power.',
        'Logics of exclusion': 'Molnar\'s way of naming the purpose built into many border technologies: deciding who is allowed through and who is kept out. The logic turns movement into suspicion and treats people with the least power as test subjects. Students should ask what the tool excludes, not only what it detects.',
        'Oversight gap': 'the space where powerful technologies operate without strong public rules, democratic debate, or clear accountability. Singh\'s concern is that court rulings and institutional decisions can permit surveillance tools before lawmakers define limits. A gap like this matters because harm can become normal before anyone has to justify it.'
      },
      7: {
        'Engineered inequity (dimension one)': 'the first dimension of the New Jim Code: technology that actively amplifies an existing hierarchy of race, class, gender, or status. The key word is amplify. The system makes an old gap larger or faster while making the result look like technical efficiency.',
        'Default discrimination (dimension two)': 'the second dimension of the New Jim Code: harm that runs through defaults, categories, settings, and assumptions. A default can quietly make one group fit the system easily and force others to prove, correct, translate, or defend themselves.',
        'Coded exposure (dimension three)': 'the third dimension of the New Jim Code: the unequal distribution of visibility. Some people are watched, tracked, scanned, and flagged too much; others are not recognized or served correctly. The same group can experience both harms depending on the setting.',
        'Algorithmic policing': 'data-driven policing tools such as predictive policing, facial recognition, social-media monitoring, and automated risk assessment. The issue is not only whether the tool is accurate. Students should ask what communities are watched, what past records feed the system, and who can challenge the result.'
      },
      8: {
        'Indigenous data sovereignty': 'the right of First Nations, Inuit, and Metis peoples to govern data about their own communities, lands, bodies, histories, and knowledge. It asks who collects the data, who owns it, who interprets it, and who benefits. The key point is authority: data about a community should not be controlled only from outside it.',
        'Algorithmic colonialism': 'the pattern where powerful companies, states, or institutions impose AI systems on communities while extracting data, labour, knowledge, or value from them. The technology may look new, but the power relation is colonial: benefit flows outward while the risk and loss stay with the people most affected.'
      },
      9: {
        'The benevolence trap': 'the danger that a tool sold as help becomes harder to question. When a system is framed as care, safety, efficiency, or inclusion, criticism can look like refusing progress. Benjamin asks students to look underneath the helpful promise and ask who gains power, who becomes exposed, and whether the harm actually changes.',
        'Will the fix fix it?': 'Benjamin\'s practical test for proposed solutions. Do not ask only whether the fix sounds kind or modern. Ask what it changes, for whom, who still carries the cost, and whether the people most affected have power over the repair. A fix that leaves the same people exposed is not a real repair.'
      },
      10: {
        'Inequality within and without the algorithm': 'Devlin\'s distinction between inequity inside a system and inequity around it. Inside means the data, labels, model, or thresholds produce unfair results. Without means the social world around the algorithm, who builds it, who is governed by it, and who has power to refuse, is already unequal.',
        'Algorithms of oppression': 'Noble\'s argument that search and ranking systems can reproduce racism and sexism while presenting results as neutral information. The system does not merely find what exists online; it orders, promotes, and legitimizes some images and ideas over others, especially in ways that harm Black women.'
      },
      11: {
        'Design justice': 'Costanza-Chock\'s approach to design that centres people usually harmed, ignored, or spoken for by design systems. It treats affected communities as experts and asks them to lead decisions, not only give feedback after the fact. The goal is a shift in power, not a nicer interface.',
        'Abolitionist tools': 'Benjamin\'s term for tools that refuse to make unjust systems run more smoothly. An abolitionist tool asks whether the gate, score, cage, or surveillance system should exist at all, then helps build a more just alternative. It is repair that changes the conditions, not just the interface.',
        'Impact over intentions': 'a design justice rule: judge a design by what it does to the community, not by whether the designer meant well. Good intentions do not erase harm. Students should ask who is affected, what changed in their life, and whether they had power in the design process.',
        'Critical race pedagogy in computer science': 'Tanksley\'s approach to teaching computing through race, power, history, and student expertise rather than treating code as separate from society. It centres Black youth as thinkers, designers, and innovators, not only as people harmed by technology.'
      },
      12: {
        'AI governance': 'the laws, rules, institutions, audits, rights, and public processes that shape how AI is built and used. In Canada, AIDA is one proposed governance route. The key question is not whether a rule exists, but whose harm it counts, who can enforce it, and what happens when the rule has gaps.',
        'Building justice in from the start': 'designing accountability before harm lands, not after. It means affected communities, rights concerns, data quality, consultation, redress, and limits on use are part of the system from the beginning. A late fix often leaves the original power structure in place.'
      }
    };
    Object.keys(defsByWeek).forEach(function (wk) {
      var d = WEEKPAGE[c] && WEEKPAGE[c][wk], defs = defsByWeek[wk];
      if (!d || !Array.isArray(d.terms)) return;
      d.terms = d.terms.map(function (t) {
        if (t && defs[t.term]) return { term: t.term, def: defs[t.term], cite: t.cite };
        return t;
      });
    });
  })();
  function wkOptBtns(key) {
    var sel = state.wkCheck[key], opts = ['New to me', 'Getting it', 'I can'];
    return opts.map(function (o, i) { var on = sel === i; return '<button onclick="SOC.wkCheck(\'' + key + '\',' + i + ')" aria-pressed="' + on + '" title="' + (on ? 'Click again to clear this rating' : 'Set this rating') + '" class="wk-opt' + (on ? ' on' : '') + '">' + o + '</button>'; }).join('');
  }
  function wkOpts(key) { return '<div class="wk-opts" id="opts-' + key + '">' + wkOptBtns(key) + '</div>'; }
  function refreshWeekChecks(w, d) {
    if (!d) return;
    ['pre', 'post'].forEach(function (ph) {
      d.checks.forEach(function (c, i) {
        var key = ph + '|' + w + '|' + i, el = document.getElementById('opts-' + key);
        if (el) el.innerHTML = wkOptBtns(key);
      });
      var m = document.getElementById('wkmeter-' + ph + '-' + w);
      if (m) m.innerHTML = checkMeter(w, ph, d);
    });
  }
  // a check is {t: a key idea from the week, look?: where to revisit it}. The student rates their OWN grasp:
  // New to me (0) / Getting it (1) / I can (2). This monitors understanding; there is no right or wrong.
  function checkText(c) { return (typeof c === 'string') ? c : ((c && c.t) ? c.t : ''); }
  function checkStat(w, phase, d) {
    var items = d.checks.map(function (c, i) {
      var r = state.wkCheck[phase + '|' + w + '|' + i];
      return { t: checkText(c), look: (typeof c === 'string') ? '' : (c.look || ''), r: (r == null ? null : r) };
    });
    var g = { can: 0, getting: 0, newto: 0 };
    items.forEach(function (x) { if (x.r === 2) g.can++; else if (x.r === 1) g.getting++; else if (x.r === 0) g.newto++; });
    return { items: items, total: d.checks.length, answered: items.filter(function (x) { return x.r != null; }).length, g: g };
  }
  function checkBand(g, n) {
    if (n && g.can === n) return { label: 'You can speak to all of this', color: '#2c6b3f', bg: '#E9EFE7' };
    if (n && g.can >= Math.ceil(n * 0.6)) return { label: 'Most of this is yours', color: '#1552D8', bg: '#E7EEFB' };
    if (n && (g.can + g.getting) >= Math.ceil(n * 0.6)) return { label: 'Coming together', color: '#8F5E0F', bg: '#F3ECE0' };
    return { label: 'Still early, and that is fine', color: '#6b7280', bg: '#F3F4F6' };
  }
  function checkBars(items) {
    return '<div style="display:flex;gap:4px;margin:10px 0" role="img" aria-label="your grasp across the ' + items.length + ' ideas">' + items.map(function (x) {
      var col = x.r === 2 ? '#2c6b3f' : (x.r === 1 ? '#C99A2E' : '#C7CDD6');
      return '<div style="flex:1;height:8px;border-radius:4px;background:' + col + '"></div>';
    }).join('') + '</div>';
  }
  function checkMeter(w, phase, d) {
    var s = checkStat(w, phase, d), L = ['New to me', 'Getting it', 'I can'];
    if (s.answered < s.total) return '<div style="margin-top:12px;font-size:.82rem;color:var(--ink-faint)">Rate all ' + s.total + ' to see where your understanding sits (' + s.answered + ' of ' + s.total + ' done). No grade, just your own read.</div>';
    var b = checkBand(s.g, s.total);
    var head = '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:10px;flex-wrap:wrap"><div style="font-size:1.05rem;font-weight:700;color:' + b.color + '">' + b.label + '</div><div style="font-family:var(--mono);font-size:.78rem;color:' + b.color + '">' + (phase === 'pre' ? 'your starting read' : 'where you are now') + '</div></div>';
    if (phase === 'pre') {
      var profile = 'You can already speak to <b>' + s.g.can + ' of ' + s.total + '</b>, getting there on ' + s.g.getting + ', new to ' + s.g.newto + '. You will rate these again at the end, to see how far your understanding moves.';
      return '<div style="margin-top:14px;background:' + b.bg + ';border:1px solid ' + b.color + '40;border-radius:12px;padding:14px 16px">' + head + checkBars(s.items) + '<div style="font-size:.85rem;color:var(--ink-dim)">' + profile + '</div></div>';
    }
    var pre = checkStat(w, 'pre', d), moved = 0;
    var detail = s.items.map(function (x, i) {
      var pr = pre.items[i] ? pre.items[i].r : null, up = (pr != null && x.r != null && x.r > pr); if (up) moved++;
      var arrow = (pr == null) ? '' : (x.r > pr ? ' (moved up)' : (x.r < pr ? ' (moved back)' : ' (steady)'));
      var from = (pr == null ? 'not rated before' : L[pr]);
      var still = (x.r < 2) ? '<div style="font-size:.8rem;color:#8F5E0F;margin-top:2px">Still building. ' + esc(x.look || 'Revisit the readings and the activity for this idea.') + '</div>' : '';
      return '<div style="border-top:1px solid var(--border);padding:9px 0"><div style="font-size:.86rem;font-weight:600;color:var(--ink)">' + esc(x.t) + '</div><div style="font-size:.8rem;color:var(--ink-dim);margin-top:3px">' + from + ' &#8594; ' + L[x.r] + arrow + '</div>' + still + '</div>';
    }).join('');
    var movedLine = (pre.answered === pre.total) ? '<div style="font-size:.86rem;color:var(--ink-dim);margin:2px 0 6px">Your understanding moved forward on <b>' + moved + ' of ' + s.total + '</b> since the start.</div>' : '<div style="font-size:.82rem;color:var(--ink-faint);margin:2px 0 6px">Rate the same ideas under Before you begin to see your movement.</div>';
    return '<div style="margin-top:14px;background:' + b.bg + ';border:1px solid ' + b.color + '40;border-radius:12px;padding:14px 16px">' + head + checkBars(s.items) + movedLine + '<div style="margin-top:4px">' + detail + '</div></div>';
  }
  function wkChecks(w, phase, d) {
    var qs = d.checks.map(function (c, i) { return '<div class="wk-q">' + (i + 1) + '. ' + esc(checkText(c)) + wkOpts(phase + '|' + w + '|' + i) + '</div>'; }).join('');
    var label = phase === 'pre' ? 'Before' : 'Now';
    var reset = '<div class="wk-resetrow"><button onclick="SOC.wkClear(' + w + ',\'' + phase + '\')" class="wk-reset">Reset ' + label + ' ratings</button><span>Click a selected rating again to clear only that idea.</span></div>';
    return qs + reset + '<div id="wkmeter-' + phase + '-' + w + '">' + checkMeter(w, phase, d) + '</div>';
  }
  function sgSection(w) {
    var d = weekData(w);
    if (!d || !d.concepts || !d.concepts.length) return { html: '' };
    state.sgNotes = state.sgNotes || {}; state.sgShow = state.sgShow || {}; state.sgFlip = state.sgFlip || {}; state.sgTick = state.sgTick || {};
    /* 1. spaced-recall warm-up: two terms from earlier weeks */
    var warm = '';
    var priorTerms = [];
    for (var pw = w - 1; pw >= 1 && priorTerms.length < 2; pw--) {
      var pd = weekData(pw);
      if (pd && pd.terms && pd.terms.length) priorTerms.push({ t: pd.terms[(w + pw) % pd.terms.length], wk: pw });
    }
    if (priorTerms.length) {
      warm = '<div style="margin:0 0 18px"><h3 style="font-size:1rem;margin:0 0 8px">Still got these?</h3><p class="wk-hint" style="margin:0 0 10px">Two ideas from earlier weeks. Say the meaning out loud, then flip to check yourself.</p>'
        + priorTerms.map(function (x, xi) {
          var fk = 'sg' + w + '|warm|' + xi;
          var open = state.sgFlip[fk];
          return '<button onclick="SOC.sgFlip(\'' + fk + '\',' + w + ')" aria-expanded="' + !!open + '" style="display:block;width:100%;text-align:left;background:#fff;border:1.5px solid var(--border);border-radius:12px;padding:13px 16px;margin-bottom:8px;cursor:pointer">'
            + '<span class="mono" style="font-size:.62rem;letter-spacing:.05em;color:#6B7280">WEEK ' + x.wk + '</span>'
            + '<div style="font-weight:700;margin-top:2px">' + esc(x.t.term) + '</div>'
            + (open ? '<div style="margin-top:8px;font-size:.9rem;line-height:1.55;color:var(--ink-dim)">' + esc(x.t.def) + ' <span class="wk-cite">(' + esc(x.t.cite) + ')</span></div>' : '<div style="margin-top:6px;font-size:.8rem;color:var(--ink-faint)">Flip to check \u2192</div>')
            + '</button>';
        }).join('') + '</div>';
    }
    /* 2. explain-it-back tiles: one per key concept */
    var tiles = '<div style="margin:0 0 18px"><h3 style="font-size:1rem;margin:0 0 8px">Explain it back</h3><p class="wk-hint" style="margin:0 0 10px">The real test of understanding: explain each idea to someone who has not done this week yet, in your own words. Then compare with the reading\'s version. Nothing you type is recorded or graded.</p>'
      + d.concepts.map(function (c, ci) {
        var nk = 'sg' + w + '|c|' + ci;
        var val = state.sgNotes[nk] || '';
        var show = state.sgShow[nk];
        return '<div style="background:#fff;border:1px solid var(--border);border-radius:12px;padding:14px 16px;margin-bottom:10px">'
          + '<div style="font-weight:700;margin-bottom:8px">' + esc(c.h) + '</div>'
          + '<textarea oninput="SOC.sgNote(\'' + nk + '\', this.value)" placeholder="Your explanation, one or two sentences..." style="width:100%;min-height:64px;border:1px solid var(--border);border-radius:8px;padding:9px 11px;font:inherit;font-size:.9rem;resize:vertical">' + esc(val) + '</textarea>'
          + '<button onclick="SOC.sgCompare(\'' + nk + '\',' + w + ')" style="margin-top:8px;border:1px solid var(--border);background:#fff;border-radius:8px;padding:6px 12px;font-size:.82rem;cursor:pointer">' + (show ? 'Hide the reading\'s version' : 'Compare with the reading') + '</button>'
          + (show ? '<div style="margin-top:9px;padding:10px 13px;border-radius:9px;background:#FBF8F3;border:1px solid var(--border);font-size:.875rem;line-height:1.55">' + esc(c.body) + ' <span class="wk-cite">(' + esc(c.cite) + ')</span></div>' : '')
          + '</div>';
      }).join('') + '</div>';
    /* 3. the question ladder: guiding questions as rungs, recall -> connect -> apply */
    var rungNames = ['Recall', 'Connect', 'Apply'];
    var gqs = (d.guiding || []).slice(0, 3);
    var ladder = '';
    if (gqs.length) {
      var rows = '';
      for (var ri = 0; ri < gqs.length; ri++) {
        var rk = 'sg' + w + '|r|' + ri;
        var prevDone = ri === 0 || (state.sgTick[('sg' + w + '|r|' + (ri - 1))] && (state.sgNotes[('sg' + w + '|r|' + (ri - 1))] || '').length >= 20);
        if (!prevDone) { rows += '<div style="border:1.5px dashed var(--border);border-radius:12px;padding:13px 16px;margin-bottom:10px;color:var(--ink-faint);font-size:.88rem">Rung ' + (ri + 1) + ' \u00B7 ' + rungNames[Math.min(ri, 2)] + ' unlocks when you finish the rung above.</div>'; continue; }
        var rv = state.sgNotes[rk] || '';
        var ticked = state.sgTick[rk] && rv.length >= 20;
        rows += '<div style="background:#fff;border:1.5px solid ' + (ticked ? '#50694C' : 'var(--border)') + ';border-radius:12px;padding:14px 16px;margin-bottom:10px">'
          + '<div class="mono" style="font-size:.62rem;letter-spacing:.06em;color:' + (ticked ? '#961A13' : '#6B7280') + '">RUNG ' + (ri + 1) + ' \u00B7 ' + rungNames[Math.min(ri, 2)].toUpperCase() + (ticked ? ' \u2713' : '') + '</div>'
          + '<div style="font-weight:600;margin:5px 0 8px;line-height:1.5">' + esc(gqs[ri]) + '</div>'
          + '<textarea oninput="SOC.sgNote(\'' + rk + '\', this.value)" placeholder="Work it out here..." style="width:100%;min-height:56px;border:1px solid var(--border);border-radius:8px;padding:9px 11px;font:inherit;font-size:.9rem;resize:vertical">' + esc(rv) + '</textarea>'
          + (ticked ? '' : '<button onclick="SOC.sgTickRung(\'' + rk + '\',' + w + ')" style="margin-top:8px;border:1px solid var(--border);background:#fff;border-radius:8px;padding:6px 12px;font-size:.82rem;cursor:pointer">Done, next rung</button>')
          + '</div>';
      }
      var lastRk = 'sg' + w + '|r|' + (gqs.length - 1);
      var ladderDone = state.sgTick[lastRk] && (state.sgNotes[lastRk] || '').length >= 20;
      ladder = '<div><h3 style="font-size:1rem;margin:0 0 8px">The question ladder</h3><p class="wk-hint" style="margin:0 0 10px">This week\'s guiding questions, one rung at a time: remember it, connect it, apply it to your own world. Twenty words or more moves you up.</p>' + rows
        + (ladderDone ? '<div style="background:#FBF4F3;border:1px solid #F0C8C3;border-radius:12px;padding:13px 16px;font-size:.92rem;font-weight:600;color:#961A13">You have worked the whole ladder. You are ready for the Knowledge Check below. <a href="#wk-kc" style="color:#961A13">Go to it \u2193</a></div>' : '')
        + '</div>';
    }
    var html = '<section id="wk-sg" class="node"><h2 class="wk-sec">Study Guide</h2>'
      + '<p class="wk-hint">Your rehearsal space before the Knowledge Check. Nothing here is recorded or graded; it lives only in your browser.</p>'
      + warm + tiles + ladder + '</section>';
    return { html: html };
  }
  function kcHashKey(s) { var h = 0, str = String(s || ''); for (var i = 0; i < str.length; i++) { h = ((h << 5) - h + str.charCodeAt(i)) | 0; } return 'q' + (h >>> 0).toString(36); }
  function kcSection(w, reviewOnly) {
    var kcVer = (state.kcVersion && state.kcVersion[w]) || 0;   /* 0 = Set A, 1 = Set B, 2 = Set C */
    var isC = (kcVer === 2);
    var revKey = w + '|' + kcVer;
    var kcTier = kcVer + 1;
    var KB = window.BFS218_KC || {};
    var hist = state.kcHist || {};
    function bank(week) { return KB[week] || []; }
    function isShort(m) { return !!(m && m.type === 'short'); }
    function isMatch(m) { return !!(m && m.kind === 'match'); }
    function isScenario(m) { return !!(m && m.kind === 'scenario'); }
    /* Sets A and B: plain multiple choice, from the readings and the plain-MC bank */
    function mcPool(week) {
      var pool = [];
      recordsForWeek(week).forEach(function (r) { if (MC[r.id]) pool = pool.concat(MC[r.id]); });
      pool = pool.concat(bank(week).filter(function (m) { return !m.kind && !isShort(m); }));
      pool = pool.filter(function (m) { return (m.options || []).length >= 4; });
      pool.sort(function (a, b) { return Math.abs((a.diff || 2) - kcTier) - Math.abs((b.diff || 2) - kcTier); });
      return pool;
    }
    /* Set C: something different, scenario + matching (both auto-scored) */
    function scoredCPool(week) { return bank(week).filter(function (m) { return (isScenario(m) || isMatch(m)) && (m.options || []).length >= 4; }); }
    function shortCPool(week) { return bank(week).filter(isShort); }

    var kcItems = [], kcSeen = {}, shortItems = [];
    if (isC) {
      var cp = scoredCPool(w);
      for (var ci = 0; ci < cp.length && kcItems.length < 15; ci++) { if (!kcSeen[cp[ci].q]) { kcSeen[cp[ci].q] = 1; kcItems.push(cp[ci]); } }
      shortItems = shortCPool(w).slice(0, 3);
    } else {
      var kcOwnPool = mcPool(w);
      /* adaptive review: gather up to two per earlier week, weighting ideas missed before to the front */
      var reviewPool = [];
      for (var pw = w - 1; pw >= 1; pw--) {
        var pool = mcPool(pw).slice();
        pool.sort(function (a, b) { var ha = hist[kcHashKey(a.q)], hb = hist[kcHashKey(b.q)]; var wa = (ha && ha.n && ha.right < ha.n) ? 0 : 1, wb = (hb && hb.n && hb.right < hb.n) ? 0 : 1; return wa - wb; });
        var took = 0, rseen = {};
        for (var pi = 0; pi < pool.length && took < 2; pi++) {
          var cand = pool[pi];
          if (!rseen[cand.q]) { rseen[cand.q] = 1; took++; reviewPool.push({ q: cand.q, options: cand.options, answer: cand.answer, why: cand.why, whyWrong: cand.whyWrong, diff: cand.diff, rw: pw }); }
        }
      }
      var reserve = Math.min(5, reviewPool.length);
      var ownTarget = Math.min(kcOwnPool.length, 15 - reserve);
      for (var oi2 = 0; oi2 < kcOwnPool.length && kcItems.length < ownTarget; oi2++) { var own = kcOwnPool[(oi2 + kcVer * 4) % kcOwnPool.length]; if (!kcSeen[own.q]) { kcSeen[own.q] = 1; kcItems.push(own); } }
      for (var ri = 0; ri < reviewPool.length && kcItems.length < 15; ri++) { if (!kcSeen[reviewPool[ri].q]) { kcSeen[reviewPool[ri].q] = 1; kcItems.push(reviewPool[ri]); } }
    }

    if (!kcItems.length && !shortItems.length) return { html: '', items: [] };

    /* score + calibration pass */
    var kAns = 0, kCor = 0, nT = 0, nC = 0, rT = 0, rC = 0, missWk = {};
    var mastered = 0, fragile = 0, misc = [], edge = 0, confSet = 0;
    kcItems.forEach(function (m, mi) {
      var key = 'wk' + w + '|kc' + kcVer + '|' + mi;
      var sel = state.mcSel[key];
      if (sel !== undefined && sel !== null) {
        kAns++; var right = (sel === m.answer); if (right) kCor++;
        if (m.rw) { rT++; if (right) rC++; else missWk[m.rw] = 1; }
        else { nT++; if (right) nC++; }
        var conf = state.mcConf && state.mcConf[key];
        if (conf) {
          confSet++;
          if (right && conf === 'sure') mastered++;
          else if (right && conf !== 'sure') fragile++;
          else if (!right && conf === 'sure') misc.push({ q: m.q, rw: m.rw, mi: mi });
          else edge++;
        }
      }
    });
    var allAns = kcItems.length ? (kAns === kcItems.length) : false;
    var reveal = allAns && !!(state.kcReveal && state.kcReveal[revKey]);
    /* record outcomes to the on-device history once a set is fully answered */
    if (reveal) {
      state.kcHist = state.kcHist || {};
      kcItems.forEach(function (m, mi) {
        var sel = state.mcSel['wk' + w + '|kc' + kcVer + '|' + mi]; if (sel === undefined || sel === null) return;
        var hk = kcHashKey(m.q), h = state.kcHist[hk] || { n: 0, right: 0 };
        if (!h._seen || h._seen !== (kcVer + 1)) { h.n = (h.n || 0) + 1; if (sel === m.answer) h.right = (h.right || 0) + 1; h._seen = kcVer + 1; state.kcHist[hk] = h; }
      });
      persist();
    }

    var lastGroup = null;
    var kRows = kcItems.map(function (m, mi) {
      var mkey = 'wk' + w + '|kc' + kcVer + '|' + mi;
      var sel = state.mcSel[mkey];
      var done = (sel !== undefined && sel !== null);
      var conf = state.mcConf && state.mcConf[mkey];
      var groupHead = '';
      if (isMatch(m)) { if (m.mgroup !== lastGroup) { lastGroup = m.mgroup; groupHead = '<p style="margin:6px 0 9px;font-size:.92rem;font-weight:600;color:var(--ink)">' + esc(m.mlabel || 'Match each item to the best fit.') + '</p>'; } }
      else { lastGroup = null; }

      /* matching row: compact dropdown, same scoring key as an MC item */
      if (isMatch(m)) {
        var optHtml = '<option value="-1"' + (!done ? ' selected' : '') + '>Choose...</option>' + (m.options || []).map(function (o, oi) { return '<option value="' + oi + '"' + (sel === oi ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('');
        var rowMark = '', bd = 'var(--border)';
        if (reveal) { if (sel === m.answer) { rowMark = '<span style="color:#2c6b3f;font-weight:700;margin-left:8px">✓</span>'; bd = '#50694C'; } else { rowMark = '<span style="color:var(--red);font-weight:600;margin-left:8px;font-size:.85rem">✗ ' + esc(m.options[m.answer] || '') + '</span>'; bd = 'var(--red)'; } }
        var whyM = (reveal && sel !== m.answer && m.why) ? '<div style="margin:7px 0 0;font-size:.83rem;color:var(--ink-dim);line-height:1.5">' + esc(m.why) + '</div>' : '';
        return groupHead + '<div style="background:#fff;border:1px solid var(--border);border-radius:10px;padding:12px 15px;margin-bottom:9px"><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><span style="font-size:.92rem;font-weight:600;flex:1;min-width:130px">' + esc(m.q) + '</span><select onchange="SOC.mcPickSel(\'' + mkey + '\',this.value)" aria-label="Match for ' + esc(m.q) + '" style="font:inherit;font-size:.88rem;padding:7px 10px;border:1.5px solid ' + bd + ';border-radius:8px;background:#fff;color:var(--ink);max-width:100%">' + optHtml + '</select>' + rowMark + '</div>' + whyM + '</div>';
      }

      /* standard / scenario multiple choice */
      var opts = (m.options || []).map(function (o, oi) {
        var isSel = (sel === oi), isCor = (oi === m.answer);
        var bg = '#fff', bd = 'var(--border)', col = 'var(--ink)', mark = '';
        if (reveal && isCor) { bg = '#E9EFE7'; bd = '#50694C'; col = '#2c3b29'; mark = ' ✓'; }
        else if (reveal && isSel && !isCor) { bg = '#F6E3E1'; bd = 'var(--red)'; col = '#8f1b12'; mark = ' ✗'; }
        else if (isSel) { bg = '#FDF0EE'; bd = 'var(--red)'; col = 'var(--ink)'; mark = ' ●'; }
        return '<button onclick="SOC.mcPick(\'' + mkey + '\',' + oi + ')" aria-pressed="' + isSel + '" style="display:block;width:100%;text-align:left;border:1.5px solid ' + bd + ';background:' + bg + ';color:' + col + ';border-radius:8px;padding:9px 12px;margin-bottom:7px;font-size:.9rem;cursor:pointer">' + esc(o) + mark + '</button>';
      }).join('');
      /* confidence prompt appears once answered, before the whole set is revealed */
      var confRow = (done && !reveal) ? '<div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin:2px 0 2px"><span style="font-size:.78rem;color:var(--ink-faint)">How sure?</span>' + [['sure', 'Sure'], ['mid', 'Think so'], ['guess', 'Guessing']].map(function (c) { var on = conf === c[0]; return '<button onclick="SOC.mcConf(\'' + mkey + '\',\'' + c[0] + '\',' + w + ')" aria-pressed="' + on + '" style="border:1px solid ' + (on ? 'var(--red)' : 'var(--border)') + ';background:' + (on ? '#FDF0EE' : '#fff') + ';color:' + (on ? 'var(--red)' : 'var(--ink-dim)') + ';border-radius:999px;padding:4px 11px;font-size:.76rem;font-weight:' + (on ? '700' : '500') + ';cursor:pointer">' + c[1] + '</button>'; }).join('') + '</div>' : '';
      /* diagnostic on reveal: distractor-specific note for a wrong pick, else the general why */
      var diag = '';
      if (reveal) {
        var wrongNote = (sel !== m.answer && m.whyWrong && m.whyWrong[sel]) ? m.whyWrong[sel] : '';
        var body = wrongNote || m.why;
        if (body) { var okBg = (sel === m.answer); var confTag = (conf === 'sure' && sel !== m.answer) ? '<div style="font-size:.72rem;font-weight:700;letter-spacing:.03em;color:#8f1b12;margin-bottom:5px">A CONFIDENT MISS, WORTH UNLEARNING</div>' : ''; diag = '<div style="margin:9px 0 0;padding:10px 13px;border-radius:9px;background:' + (okBg ? '#E9EFE7' : '#FBE9E7') + ';border:1px solid ' + (okBg ? '#9CC4A8' : '#E5B8B0') + ';font-size:.875rem;line-height:1.55">' + confTag + esc(body) + '</div>'; }
      }
      var revTag = m.rw ? '<span class="mono" style="font-size:.62rem;letter-spacing:.05em;color:#6B7280;background:#EEF1F5;border-radius:999px;padding:2px 8px;margin-left:8px;vertical-align:middle">REVIEW · WEEK ' + m.rw + '</span>' : (isScenario(m) ? '<span class="mono" style="font-size:.62rem;letter-spacing:.05em;color:#8a5a1a;background:#FBEFD9;border-radius:999px;padding:2px 8px;margin-left:8px;vertical-align:middle">SCENARIO</span>' : '');
      return groupHead + '<div id="kcq-' + mkey.replace(/[^a-zA-Z0-9]/g, '-') + '" style="background:#fff;border:1px solid var(--border);border-radius:12px;padding:15px 17px;margin-bottom:11px"><p style="margin:0 0 9px;font-size:.95rem;font-weight:600">' + (mi + 1) + '. ' + esc(m.q) + revTag + '</p>' + opts + confRow + diag + '</div>';
    }).join('');

    /* Set C short-answer: write first, then reveal a model to compare against, then self-rate */
    var shortHtml = '';
    if (shortItems.length) {
      var srows = shortItems.map(function (m, si) {
        var skey = 'wk' + w + '|kc' + kcVer + '|short' + si;
        var txt = (state.kcShort && state.kcShort[skey]) || '';
        var shown = state.kcShortShown && state.kcShortShown[skey];
        var rated = state.kcShortRate && state.kcShortRate[skey];
        var model = shown
          ? '<div style="background:#15171C;color:#fff;border-radius:12px;padding:15px 18px;margin-top:11px"><div class="mono" style="font-size:.68rem;letter-spacing:.05em;color:#9aa3b2;margin-bottom:8px">A MODEL ANSWER</div><p style="margin:0;font-size:.92rem;line-height:1.6;color:rgba(255,255,255,.94)">' + esc(m.model || '') + '</p><p style="font-size:.8rem;margin:9px 0 0;color:#9aa3b2">One strong answer. Compare it with yours, do not copy it. How close were you?</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:11px">' + [['got', 'I had this'], ['part', 'Partly there'], ['not', 'Not yet']].map(function (r) { var on = rated === r[0]; return '<button onclick="SOC.kcShortRate(\'' + skey + '\',\'' + r[0] + '\',' + w + ')" aria-pressed="' + on + '" style="border:1px solid ' + (on ? '#fff' : 'rgba(255,255,255,.35)') + ';background:' + (on ? '#fff' : 'transparent') + ';color:' + (on ? '#15171C' : '#fff') + ';border-radius:999px;padding:6px 13px;font-size:.82rem;font-weight:600;cursor:pointer">' + r[1] + '</button>'; }).join('') + '</div></div>'
          : '<button onclick="SOC.kcShortReveal(\'' + skey + '\',' + w + ')" style="margin-top:10px;background:none;border:1px solid #15171C;color:#15171C;border-radius:9px;padding:9px 15px;font-size:.88rem;font-weight:600;cursor:pointer">Reveal a model answer</button>';
        var ratedLine = (shown && rated) ? '<p style="margin:9px 0 0;font-size:.82rem;color:var(--ink-faint)">You rated yourself: ' + (rated === 'got' ? 'I had this.' : rated === 'part' ? 'Partly there.' : 'Not yet, and that is fine, that is what the reading is for.') + '</p>' : '';
        return '<div style="background:#F7F8FA;border:1px solid var(--border);border-radius:12px;padding:15px 17px;margin-bottom:11px"><p style="margin:0 0 9px;font-size:.95rem;font-weight:600">' + esc(m.q) + '</p><textarea oninput="SOC.kcShortText(\'' + skey + '\',this.value)" aria-label="Your answer" class="wk-ta" placeholder="Write your answer, then reveal a model to compare..." style="min-height:80px">' + esc(txt) + '</textarea>' + model + ratedLine + '</div>';
      }).join('');
      shortHtml = '<div style="margin-top:6px"><h3 style="margin:14px 0 4px;font-size:1.05rem">Reflect and compare</h3><p class="wk-hint" style="margin-bottom:11px">Not scored, nothing recorded. Write your own answer first, then reveal a model answer and rate how close you were. The point is the comparison, not a mark.</p>' + srows + '</div>';
    }

    var setMeta = [['A', 'multiple choice'], ['B', 'more multiple choice'], ['C', 'applied and different']];
    var vers = [0, 1, 2].map(function (v) { var on = (v === kcVer); return '<button onclick="SOC.kcVer(' + w + ',' + v + ')" aria-pressed="' + on + '" style="border:1px solid ' + (on ? 'var(--red)' : 'var(--border)') + ';background:' + (on ? '#FDF0EE' : '#fff') + ';color:' + (on ? 'var(--red)' : 'var(--ink)') + ';font-weight:' + (on ? '700' : '500') + ';border-radius:999px;padding:6px 14px;font-size:.82rem;cursor:pointer">Set ' + setMeta[v][0] + '</button>'; }).join('');
    var setNote = '<p class="wk-hint" style="margin:0 0 12px;font-size:.82rem">Set ' + setMeta[kcVer][0] + ': ' + setMeta[kcVer][1] + '. ' + (isC ? 'Scenarios and matching are scored; the short written reflections at the end are for you to compare against a model.' : 'Fresh multiple choice, ' + (kcVer === 0 ? 'foundational' : 'a step harder') + ', from this week plus a short review of earlier weeks that leans on ideas you have missed before.') + '</p>';
    var retake = kAns ? '<button onclick="SOC.kcClear(' + w + ',' + kcVer + ')" style="border:1px solid var(--border);background:#fff;border-radius:999px;padding:6px 14px;font-size:.82rem;cursor:pointer">Clear and retake this set</button>' : '';
    var progress = (kcItems.length && !allAns) ? '<p class="wk-hint" style="margin:0 0 12px">' + kAns + ' of ' + kcItems.length + ' answered. Mark how sure you were as you go.</p>' : '';
    var revealCta = (allAns && !reveal) ? '<button onclick="SOC.kcShow(' + w + ')" class="wk-cta" style="margin:2px 0 14px">See how I did →</button>' : '';

    var summary = '';
    if (reveal && kcItems.length) {
      var pct = Math.round(100 * kCor / kcItems.length);
      var head, body;
      if (pct >= 93) { head = 'Command'; body = 'You are not just recognising these ideas, you can tell them apart under pressure, which is exactly what the course asks of you.'; }
      else if (pct >= 80) { head = 'Solid'; body = 'You have the spine of this material. The few you missed are explained below; read those once more and you are at full strength.'; }
      else if (pct >= 60) { head = 'Developing'; body = 'A real start. You are recognising the ideas but some are still blurring together. Read the explanations below, then take another set fresh.'; }
      else { head = 'Starting point'; body = 'This tells you where you are starting from, and that is useful information, not a judgment. Work back through this week\'s key concepts and readings, then take another set and watch the difference.'; }
      /* calibration read-out leads with confident misses */
      var calib = '';
      if (confSet) {
        var mlist = misc.map(function (x) { return '<li style="margin:3px 0;font-size:.88rem;line-height:1.5;color:#f3d3ce">' + esc(x.q) + (x.rw ? ' <span style="color:#9aa3b2">(review, Week ' + x.rw + ')</span>' : '') + '</li>'; }).join('');
        calib = '<div style="margin:12px 0 0;padding-top:12px;border-top:1px solid rgba(255,255,255,.16)">'
          + '<div class="mono" style="font-size:.64rem;letter-spacing:.06em;color:#9aa3af;margin-bottom:7px">HOW SURE YOU WERE vs HOW IT WENT</div>'
          + '<div style="display:flex;gap:14px;flex-wrap:wrap;font-size:.85rem">'
          + '<span style="color:#bfe3c8">● Mastered ' + mastered + '</span>'
          + '<span style="color:#e7dca6">● Right but unsure ' + fragile + '</span>'
          + '<span style="color:#f3b1a8">● Confident miss ' + misc.length + '</span>'
          + '<span style="color:#c8cdd6">● Still finding it ' + edge + '</span></div>'
          + (misc.length ? '<p style="margin:10px 0 4px;font-size:.88rem;line-height:1.55;color:#f3d3ce">Start here. You were sure on these and they did not land, a confident wrong belief is the one that costs you later:</p><ul style="margin:0;padding-left:18px">' + mlist + '</ul>' : (mastered ? '<p style="margin:9px 0 0;font-size:.88rem;color:#bfe3c8">No confident misses, what you are sure of, you have right. That is the calibration you want.</p>' : ''))
          + (fragile ? '<p style="margin:9px 0 0;font-size:.85rem;color:#e7dca6">' + fragile + ' you got right but were not sure about. You know more than you trust; name why the answer is right and it becomes solid.</p>' : '')
          + '</div>';
      }
      var split = '';
      if (nT && rT) split = '<p style="margin:8px 0 0;font-size:.9rem;line-height:1.55">On this week\'s new ideas you got ' + nC + ' of ' + nT + '. On review from earlier weeks you got ' + rC + ' of ' + rT + '.' + (rC < rT ? ' Earlier material fades fastest; a short revisit brings it back.' : ' Your earlier weeks are holding, which is the whole point of the review.') + '</p>';
      var revisit = Object.keys(missWk).map(function (n) { return '<button onclick="SOC.station(' + n + ')" style="border:1px solid rgba(255,255,255,.35);background:transparent;color:#fff;border-radius:8px;padding:7px 13px;font-size:.85rem;margin:10px 8px 0 0;cursor:pointer">Revisit Week ' + n + ' →</button>'; }).join('');
      var refLine = shortItems.length ? '<p style="margin:8px 0 0;font-size:.88rem;color:#e5e7eb">Then there ' + (shortItems.length === 1 ? 'is 1 short reflection' : 'are ' + shortItems.length + ' short reflections') + ' below to compare against a model, not scored.</p>' : '';
      summary = '<div style="margin:6px 0 14px;background:#15171C;color:#fff;border-radius:12px;padding:17px 20px">'
        + '<div class="mono" style="font-size:.66rem;letter-spacing:.08em;color:#9aa3af">WHERE YOU STAND · ' + kCor + ' OF ' + kcItems.length + '</div>'
        + '<div style="font-size:1.05rem;font-weight:700;margin:6px 0 4px">' + head + '</div>'
        + '<p style="margin:0;font-size:.9rem;line-height:1.6;color:#e5e7eb">' + body + '</p>'
        + (split ? '<div style="color:#e5e7eb">' + split + '</div>' : '')
        + calib + refLine + (revisit ? '<div>' + revisit + '</div>' : '')
        + '</div>';
    }

    var badge = '<span class="mono" style="font-size:.62rem;letter-spacing:.06em;color:#961A13;background:#FBF4F3;border:1px solid #F0C8C3;border-radius:999px;padding:3px 10px;margin-left:10px;vertical-align:middle">NOT GRADED</span>';
    var kc = '<section id="wk-kc" class="node"><h2 class="wk-sec">Knowledge Check ' + badge + '</h2>'
      + '<p class="wk-hint">Nothing here counts toward your grade and nothing is recorded. Three sets: Set A and Set B are multiple choice; Set C brings scenarios, matching, and short written reflections. Answer, say how sure you were, and the check shows you not just what you got right but where a confident answer was actually wrong, the thing most worth fixing.</p>'
      + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:0 0 10px">' + vers + retake + '</div>'
      + setNote + progress + revealCta + summary + kRows + shortHtml + '</section>';
    return { html: kc, items: kcItems.concat(shortItems) };
  }
  function visualSpec(w, d) {
    var V = window.BFS218_VISUALS || {};
    var spec = V.weeks && V.weeks[w];
    if (spec) return enrichVisualSpec(spec);
    var topic = d && d.concepts && d.concepts[0] ? d.concepts[0].h : weekTitle(w);
    return enrichVisualSpec({
      kind: 'pipeline',
      title: topic || 'This week as a process',
      scene: 'A simple 3D process model for the week. Read it from left to right: tool, rule, impact, and response.',
      steps: [
        ['Find the tool', 'Start with the system, record, platform, or object being studied.'],
        ['Follow the rule', 'Ask what decision or default the system applies.'],
        ['Name the impact', 'End by asking who benefits, who carries risk, and what accountability would require.']
      ],
      activity: {
        title: 'Use the model before the activity.',
        steps: ['Look at the tool.', 'Follow the decision path.', 'Name the harm or repair clearly.']
      }
    });
  }
  function visualShortText(text, limit) {
    text = String(text || '').replace(/\s+/g, ' ').trim();
    limit = limit || 82;
    return text.length <= limit ? text : text.slice(0, limit - 3).replace(/[ ,;:]+$/, '').replace(/\s+\S*$/, '').replace(/[ ,;:]+$/, '').replace(/\s+(and|or|to|the|a|an|of|for|with|by)$/i, '') + '...';
  }
  function visualKindLabelPositions(kind) {
    var map = {
      map: [[22, 64], [50, 64], [77, 64]],
      lens: [[27, 64], [52, 64], [77, 64]],
      pipeline: [[20, 64], [50, 64], [80, 64]],
      outcomelens: [[22, 63], [52, 63], [80, 63]],
      switches: [[24, 64], [52, 64], [78, 64]],
      audit: [[24, 64], [52, 64], [78, 64]],
      gate: [[23, 64], [52, 64], [78, 64]],
      review: [[24, 64], [52, 64], [78, 64]],
      vault: [[24, 64], [52, 64], [78, 64]],
      benevolence: [[24, 64], [52, 64], [78, 64]],
      sorting: [[22, 64], [52, 64], [79, 64]],
      repair: [[24, 64], [52, 64], [78, 64]],
      policy: [[24, 64], [52, 64], [78, 64]],
      return: [[24, 64], [52, 64], [78, 64]],
      compass: [[24, 64], [52, 64], [78, 64]],
      startermap: [[22, 64], [52, 64], [78, 64]],
      mechanismmatch: [[22, 63], [52, 63], [80, 63]]
    };
    return map[kind] || [[22, 64], [52, 64], [78, 64]];
  }
  function visualKindLabelAnchors(kind) {
    var H = window.BFS218_HOLO;
    if (H && H.anchors && H.anchors[kind]) return H.anchors[kind];
    var map = {
      matchwork: [[-2.15, 0.82, -0.55], [-0.18, 1.22, 0.15], [2.25, 0.9, 0.08]],
      decisionpath: [[-2.0, 1.08, 0], [-0.55, 1.05, 0], [1.28, 0.88, 0.82]],
      defaultboard: [[-1.8, 0.9, -0.2], [0.45, 0.9, 0.1], [2.1, 1.05, 0.45]],
      toolkit: [[-1.85, 0.84, -0.35], [0.45, 1.22, 0], [1.35, 1.02, 0.56]],
      policydeck: [[-1.9, 0.55, 0], [0, 1.18, 0], [1.85, 1.05, 0.2]],
      capstonemap: [[-1.95, 0.55, -0.85], [-0.45, 0.9, -0.25], [2.15, 1.0, 0.82]],
      surveillanceflow: [[-2.2, 0.95, 0], [0.1, 1.1, 0.4], [2.2, 0.65, 0.8]],
      datastory: [[-1.3, 0.75, -0.5], [0.35, 1.15, 0], [1.75, 0.78, 0.6]],
      promisefunnel: [[-1.6, 1.1, -0.55], [0, 0.95, 0], [1.75, 0.5, 0.6]],
      thresholdaudit: [[-1.8, 0.65, -0.55], [0, 0.9, 0], [1.8, 0.5, 0.65]],
      mechanismmatch: [[-2.2, 0.72, -0.4], [-0.2, 1.18, 0], [2.08, 0.8, 0.42]],
      repairtable: [[-1.6, 0.75, -0.6], [0, 1.0, 0], [1.65, 0.75, 0.65]],
      futurecompass: [[-1.4, 0.75, -0.9], [0, 1.15, 0], [1.6, 0.75, 0.9]],
      startermap: [[-2.0, 0.65, -1.0], [0, 0.8, 0], [2.0, 0.65, 1.0]],
      map: [[-2.1, 0.8, 1.1], [0, 0.95, 0], [2, 0.8, -1.3]],
      lens: [[-0.28, 1.35, 0], [0, 1.25, 0], [0.28, 1.35, 0]],
      outcomelens: [[-2.25, 0.9, 0], [0.12, 1.28, 0], [2.18, 0.86, 0.78]],
      pipeline: [[-2.4, 0.9, 0], [0, 0.9, 0], [2.4, 0.9, 0]],
      switches: [[-1.35, 1.05, 0], [0.45, 1.05, 0], [2.45, 0.7, 0]],
      audit: [[-0.9, 0.75, -0.75], [0, 1.15, 0], [0.9, 0.75, 0.75]],
      gate: [[-2.2, 0.95, 0], [0, 1.55, 0], [2.2, 0.95, 0]],
      review: [[-1.65, 0.65, -0.4], [0, 0.85, 0], [1.65, 0.85, 0.4]],
      vault: [[-0.65, 1.35, 0], [1.05, 0.9, 0.1], [0.75, 1.1, 0.9]],
      benevolence: [[0, 1.45, -0.38], [0, 0.95, 0.82], [1.7, 0.8, 0.82]],
      sorting: [[-1.8, 0.55, -0.9], [0.85, 1.2, 0], [2.2, 0.7, 0.9]],
      repair: [[-0.5, 1.15, 0], [1.1, 0.85, -0.8], [1.65, 0.85, 0]],
      policy: [[0, 0.45, 0], [0, 1.05, 0], [0, 1.35, 0]],
      return: [[-1.8, 0.55, -1.05], [0, 1.0, 0], [1.8, 1.25, 1.05]],
      compass: [[-1.8, 0.75, -1.05], [0, 1.0, 0], [1.8, 0.75, -1.05]]
    };
    return map[kind] || [[-2.2, 0.9, 0], [0, 1.1, 0], [2.2, 0.9, 0]];
  }
  function visualReadingSentence(spec) {
    var steps = spec.steps || [];
    var a = steps[0] && steps[0][0] ? steps[0][0] : 'the first object';
    var b = steps[1] && steps[1][0] ? steps[1][0] : 'the middle of the model';
    var c = steps[2] && steps[2][0] ? steps[2][0] : 'the final result';
    return 'This visual is a map of the week. Read it from label 1 to label 3: start with "' + a + '", move to "' + b + '", and end with "' + c + '". You are looking for the movement, not memorising the picture.';
  }
  function enrichVisualSpec(spec) {
    spec = Object.assign({}, spec || {});
    var steps = (spec.steps || []).slice(0, 3);
    var anchors = visualKindLabelAnchors(spec.kind || 'pipeline');
    var coords = visualKindLabelPositions(spec.kind || 'pipeline');
    if (!spec.labels || !spec.labels.length) {
      spec.labels = coords.map(function (xy, i) {
        var step = steps[i] || [];
        return {
          x: xy[0],
          y: xy[1],
          t: (i + 1) + '. ' + (step[0] || ['Start', 'Trace', 'Name'][i]),
          sub: visualShortText(step[1] || '', 70)
        };
      });
    }
    spec.labels = (spec.labels || []).map(function (l, i) {
      l = Object.assign({}, l);
      if ((l.x == null || l.y == null) && coords[i]) {
        l.x = coords[i][0];
        l.y = coords[i][1];
      }
      if (!l.anchor && anchors[i]) l.anchor = anchors[i];
      return l;
    });
    if (!spec.reading) spec.reading = visualReadingSentence(spec);
    return spec;
  }
  function activityVisualSpec(w, a) {
    var base = visualSpec(w, weekData(w));
    var baseKind = base.kind || 'pipeline';
    var choices = {
      match: ['matchwork'],
      scenario: ['decisionpath'],
      toggle: ['defaultboard'],
      assemble: ['toolkit'],
      lab: ['policydeck'],
      capstone: ['capstonemap']
    };
    var profile = {
      match: {
        title: 'Activity model: match examples to ideas.',
        scene: 'Example cards sort into concept bins. Use this model to remember that you are choosing which idea each case shows.',
        steps: [['Read the example', 'Stay with one case at a time instead of scanning for the right answer.'], ['Choose the idea', 'Click the button that best names what the example shows.'], ['Use the feedback', 'The feedback explains why the match works or why another idea fits better.']],
        labels: [
          { x: 24, y: 58, t: '1. Example', sub: 'Read one real case.' },
          { x: 52, y: 39, t: '2. Choice', sub: 'Click one course idea.' },
          { x: 76, y: 58, t: '3. Feedback', sub: 'Green or red explains why.' }
        ]
      },
      scenario: {
        title: 'Activity model: walk the decision path.',
        scene: 'A decision path branches toward harm or repair. Use this model to remember that each click is one institutional choice.',
        steps: [['Read the situation', 'Start with the decision point the institution faces.'], ['Choose one path', 'Click the option you think the institution takes or should take.'], ['Read the outcome', 'The result shows whether that decision hides harm or makes accountability possible.']],
        labels: [
          { x: 22, y: 50, t: 'Decision', sub: 'What is the institution choosing?' },
          { x: 51, y: 35, t: 'Path', sub: 'One click sends the case forward.' },
          { x: 77, y: 57, t: 'Outcome', sub: 'Read who is helped or harmed.' }
        ]
      },
      toggle: {
        title: 'Activity model: test the defaults.',
        scene: 'A control board shows settings before and after they are switched. Use this model to see that defaults make choices before people notice.',
        steps: [['Find the setting', 'Each switch stands for a rule that can be left in place or changed.'], ['Flip it on or off', 'Click the switch and read what changes.'], ['Name the cost', 'Ask who carries the burden when that default is treated as normal.']],
        labels: [
          { x: 26, y: 42, t: 'Default', sub: 'A rule is already set.' },
          { x: 53, y: 56, t: 'Switch', sub: 'Turn it on or off.' },
          { x: 77, y: 43, t: 'Cost', sub: 'Ask who carries the burden.' }
        ]
      },
      assemble: {
        title: 'Activity model: build the response.',
        scene: 'A workbench collects repair tools into one toolkit. Use this model to see how a response is assembled from several parts.',
        steps: [['Add one part', 'Choose one tool from the left side.'], ['Watch the toolkit grow', 'The right side shows what you have built so far.'], ['Check the whole system', 'Ask whether the toolkit shifts power or only patches damage.']],
        labels: [
          { x: 23, y: 56, t: 'Parts', sub: 'Add one repair tool.' },
          { x: 52, y: 39, t: 'Toolkit', sub: 'The response builds as you click.' },
          { x: 77, y: 58, t: 'Power test', sub: 'Did the fix change who decides?' }
        ]
      },
      lab: {
        title: 'Activity model: choose policy levers.',
        scene: 'A policy stack shows different levers at different levels. Use this model to compare what each lever fixes and what it leaves exposed.',
        steps: [['Choose a lever', 'Pick one response from the list.'], ['Read the trade-off', 'Every policy move buys something and costs something.'], ['Build a pair', 'Your final choice should show the tension, not pretend there is one clean answer.']],
        labels: [
          { x: 25, y: 60, t: 'Lever', sub: 'Pick a policy move.' },
          { x: 52, y: 38, t: 'Level', sub: 'System, institution, law, or rights.' },
          { x: 77, y: 59, t: 'Trade-off', sub: 'What does it fix and cost?' }
        ]
      },
      capstone: {
        title: 'Activity model: prepare the final map.',
        scene: 'A compass and return path organize the final pieces. Use this model to turn your course map into a clear final response.',
        steps: [['Revisit one piece', 'Open one part of your cartography or final response.'], ['Mark what changed', 'Name what you can now see that you could not name at the start.'], ['Carry it forward', 'Turn the final answer into a commitment you can use after the course.']],
        labels: [
          { x: 24, y: 55, t: 'Map', sub: 'Return to your own evidence.' },
          { x: 52, y: 38, t: 'Change', sub: 'Name what you now see.' },
          { x: 77, y: 55, t: 'Commitment', sub: 'Carry the answer forward.' }
        ]
      }
    };
    var type = (a && a.archetype) || 'scenario';
    var kinds = choices[type] || ['pipeline', 'review', 'map'];
    var kind = kinds.filter(function (k) { return k !== baseKind; })[0] || kinds[0] || baseKind;
    var p = profile[type] || profile.scenario;
    var custom = base.activity || {};
    return enrichVisualSpec({
      kind: custom.modelKind || kind,
      title: custom.modelTitle || p.title,
      scene: custom.modelScene || p.scene,
      modelNote: custom.modelNote || p.modelNote,
      learningJob: custom.modelLearningJob || custom.learningJob || p.learningJob,
      display: custom.modelDisplay || p.display,
      controls: custom.modelControls || custom.controls || p.controls,
      steps: custom.modelSteps || p.steps,
      labels: custom.modelLabels || p.labels || [],
      activity: custom
    });
  }
  function visualViewFor(w, context) {
    state.visualView = state.visualView || {};
    var key = (context || 'week') + '|' + w;
    return state.visualView[key] || (context === 'activity' ? 'predict' : 'observe');
  }
  function visualControls(w, spec, context, active) {
    var V = window.BFS218_VISUALS || {}, labels = V.viewLabels || {};
    var custom = spec.controls || {};
    var defs = context === 'activity'
      ? [['predict', custom.predict || labels.predict || 'Predict'], ['try', custom.try || labels.try || 'Try it'], ['explain', custom.explain || labels.explain || 'Explain']]
      : [['observe', custom.observe || labels.observe || 'Observe'], ['path', custom.path || labels.path || 'Follow the path'], ['risk', custom.risk || labels.risk || 'Find the risk']];
    var lead = context === 'activity' ? 'Choose a model step' : 'Change the display';
    return '<div class="wk-model-controls" aria-label="' + esc(lead) + '"><span class="wk-model-control-title">' + esc(lead) + '</span>' + defs.map(function (d) {
      var on = active === d[0];
      return '<button type="button" onmousedown="event.preventDefault()" ontouchstart="this.blur()" onclick="return SOC.visualView(event,' + w + ',\'' + context + '\',\'' + d[0] + '\')" aria-pressed="' + on + '" class="' + (on ? 'on' : '') + '">' + esc(d[1]) + '</button>';
    }).join('') + '</div>';
  }
  function visualLearningJob(spec, context) {
    if (spec.learningJob) return spec.learningJob;
    var steps = spec.steps || [];
    var first = steps[0] && steps[0][0] ? steps[0][0] : 'start with the example';
    var last = steps[2] && steps[2][0] ? steps[2][0] : 'name the impact';
    if (context === 'activity') return 'This model prepares you to move from "' + first + '" to "' + last + '" before you answer.';
    return 'This visual helps you move from "' + first + '" to "' + last + '" so the week becomes a process you can explain.';
  }
  function visualDisplayHtml(spec, context, view) {
    var display = spec.display || {};
    var d = display[view] || {};
    var modeNames = context === 'activity'
      ? { predict: 'Prediction display', try: 'Action display', explain: 'Explanation display' }
      : { observe: 'Orientation display', path: 'Path display', risk: 'Risk display' };
    var focus = d.focus || spec.title || 'Read the model as a process.';
    var action = d.action || ((spec.steps && spec.steps[1] && spec.steps[1][1]) || spec.scene || 'Follow the movement from left to right.');
    var learning = d.learning || visualLearningJob(spec, context);
    return '<div class="wk-holo-display" aria-label="Learning display for this 3D model">'
      + '<div class="wk-holo-kicker">' + esc(modeNames[view] || 'Learning display') + '</div>'
      + '<b>' + esc(focus) + '</b>'
      + '<dl><dt>Do</dt><dd>' + esc(action) + '</dd><dt>Learn</dt><dd>' + esc(learning) + '</dd></dl>'
      + '</div>';
  }
  function visualLabels(spec) {
    var labels = spec.labels || [];
    if (!labels.length) return '';
    return '<div class="wk-model-labels" aria-label="Model labels"><svg class="wk-label-leaders" focusable="false"></svg>' + labels.map(function (l, i) {
      var left = Math.max(8, Math.min(92, Number(l.x) || 50));
      var top = Math.max(12, Math.min(82, Number(l.y) || 50));
      var anchor = Array.isArray(l.anchor) ? l.anchor : [0, 1, 0];
      return '<span class="wk-model-label" data-label-index="' + i + '" data-anchor="' + esc(anchor.join(',')) + '" style="left:' + left + '%;top:' + top + '%"><b>' + esc(l.t || '') + '</b><small>' + esc(l.sub || '') + '</small></span>';
    }).join('') + '</div>';
  }
  function visualStepStrip(w, spec, context, view) {
    var order = context === 'activity' ? ['predict', 'try', 'explain'] : ['observe', 'path', 'risk'];
    var idx = Math.max(0, order.indexOf(view));
    var steps = spec.steps || [];
    var step = steps[idx] || [];
    var title = step[0] || '';
    var body = step[1] || '';
    return '<div class="wk-step-strip" role="group" aria-label="Story steps for this model">'
      + '<button type="button" class="wk-step-btn wk-step-prev" onclick="return SOC.visualStep(event,' + w + ',\'' + context + '\',-1)"' + (idx === 0 ? ' disabled' : '') + '>&#9664; Back</button>'
      + '<div class="wk-step-text"><b>Step ' + (idx + 1) + ' of ' + order.length + ': ' + esc(title) + '.</b> ' + esc(body) + '</div>'
      + '<button type="button" class="wk-step-btn wk-step-next" onclick="return SOC.visualStep(event,' + w + ',\'' + context + '\',1)"' + (idx === order.length - 1 ? ' disabled' : '') + '>Next step &#9654;</button>'
      + '</div>';
  }
  function visualModelHtml(w, spec, context) {
    var view = visualViewFor(w, context);
    var rotateHelp = 'Click or touch and drag any open space in this 3D picture to turn the scene; there is no drag-and-drop here. The numbered labels below the model explain what to inspect without covering the scene.';
    var labelList = (spec.labels || []).map(function (l) { return (l.t || '') + ': ' + (l.sub || ''); }).join('. ');
    var label = (context === 'activity' ? 'Activity model for Week ' : 'Visual overview for Week ') + w + ': ' + spec.title + '. ' + spec.scene + ' Labels: ' + labelList + '. ' + rotateHelp;
    var noteText = spec.modelNote || spec.scene;
    var shellKind = String(spec.kind || 'pipeline').replace(/[^a-z0-9_-]/gi, '').toLowerCase() || 'pipeline';
    var holoDriven = !!(window.BFS218_HOLO && window.BFS218_HOLO.supports && window.BFS218_HOLO.supports(spec.kind));
    return '<div class="wk-model-frame">'
      + (holoDriven ? '' : visualControls(w, spec, context, view))
      + '<div class="wk-model-shell wk-model-kind-' + esc(shellKind) + '">'
      + '<canvas class="wk-model-canvas" role="img" aria-label="' + esc(label) + '" data-topic-model="' + esc(context) + '" data-week="' + w + '" data-kind="' + esc(spec.kind || 'pipeline') + '" data-view="' + esc(view) + '"></canvas>'
      + '<div class="wk-cam-ctl" role="group" aria-label="3D view controls">'
      + '<button type="button" onclick="return SOC.camCtl(event,\'spin\',-1)" aria-label="Rotate left" title="Rotate left">&#8634;</button>'
      + '<button type="button" onclick="return SOC.camCtl(event,\'spin\',1)" aria-label="Rotate right" title="Rotate right">&#8635;</button>'
      + '<button type="button" onclick="return SOC.camCtl(event,\'zoom\',-1)" aria-label="Zoom out" title="Zoom out">&#8722;</button>'
      + '<button type="button" onclick="return SOC.camCtl(event,\'zoom\',1)" aria-label="Zoom in" title="Zoom in">+</button>'
      + '<button type="button" class="wk-cam-reset" onclick="return SOC.camCtl(event,\'reset\',0)">Reset view</button>'
      + '<span class="wk-cam-hint">Drag the scene to turn it. Pinch, or click then scroll, to zoom.</span>'
      + '</div>'
      + '<div class="wk-model-note"><b>' + esc(spec.title) + '</b><span>' + esc(noteText) + ' The labels inside the scene name each part. You can turn the scene by dragging any open space in the picture; nothing needs to be dropped anywhere. The buttons and the steps below change what the scene shows.</span></div>'
      + visualDisplayHtml(spec, context, view)
      + '<div class="wk-model-fallback" hidden>The 3D model could not load. The explanation below still walks you through the idea.</div>'
      + '</div>'
      + visualStepStrip(w, spec, context, view)
      + visualLabels(spec)
      + '</div>';
  }
  function visualGuideHtml(spec) {
    var labels = (spec.labels || []).slice(0, 3);
    return '<div class="wk-model-guide"><b>How to read this visual</b><p>' + esc(spec.reading || visualReadingSentence(spec)) + '</p>'
      + '<ol>' + labels.map(function (l) { return '<li><strong>' + esc(l.t || '') + '</strong><span>' + esc(l.sub || '') + '</span></li>'; }).join('') + '</ol></div>';
  }
  function visualTaskHtml(spec) {
    var task = spec.task || {};
    var steps = spec.steps || [];
    var first = steps[0] && steps[0][0] ? steps[0][0] : 'the first label';
    var mid = steps[1] && steps[1][0] ? steps[1][0] : 'the path';
    var last = steps[2] && steps[2][0] ? steps[2][0] : 'the risk or result';
    var taskSteps = task.steps || [
      'Press each display button below the model. After each press, read the Do and Learn lines.',
      'Turn the model once with your mouse or finger if you like. You are not solving a puzzle and nothing gets dropped anywhere; it is a movable diagram for seeing the process.',
      'In your notes, finish this sentence: ' + first + ' leads to ' + last + ' because...'
    ];
    var title = task.title || 'What to do with this visual';
    var lead = task.lead || ('Use the model as a thinking aid. Read it in order: ' + first + ', then ' + mid + ', then ' + last + '.');
    var answer = task.answer || 'Your goal is one clear sentence you could explain to another student.';
    return '<div class="wk-model-task" aria-label="Student task for this visual"><div><b>' + esc(title) + '</b><p>' + esc(lead) + '</p><em>' + esc(answer) + '</em></div><ol>' + taskSteps.slice(0, 3).map(function (s, i) { return '<li><strong>' + (i + 1) + '. Do this</strong>' + esc(s) + '</li>'; }).join('') + '</ol></div>';
  }
  function visualStepCards(steps) {
    return '<div class="wk-model-steps">' + (steps || []).slice(0, 3).map(function (c, i) {
      return '<div class="wk-model-step"><div class="mono">STEP ' + (i + 1) + '</div><h3>' + esc(c[0]) + '</h3><p>' + esc(c[1]) + '</p></div>';
    }).join('') + '</div>';
  }
  function conceptsSectionFor(w, d) {
    if (!d || !d.concepts || !d.concepts.length) return '';
    var inner = '<p class="wk-hint">These are the week\'s big ideas, explained. Read them to understand the argument; this is what your discussions and written work draw on.</p>' + d.concepts.map(function (c) {
      var fe = '';
      var fer = fieldExampleFor(w, c.h);
      if (fer) fe = '<div class="wk-concept" style="border-left:4px solid #B02318;padding-left:12px;margin-top:8px"><div class="mono" style="font-size:.64rem;letter-spacing:.08em;color:#B02318;font-weight:700;margin-bottom:3px">IN ' + esc(fer.label).toUpperCase() + '</div><p style="margin:0">' + esc(fer.text) + '</p></div>';
      return '<div class="wk-concept"><h3>' + esc(c.h) + '</h3><p>' + esc(c.body) + ' <span class="wk-cite">(' + esc(c.cite) + ')</span></p></div>' + fe;
    }).join('');
    return '<section id="wk-con" class="node"><h2 class="wk-sec">Key concepts</h2>' + inner + '</section>';
  }
  function termsSectionFor(w, d) {
    if (!d || !d.terms || !d.terms.length) return '';
    var inner = '<p class="wk-hint">These are the precise vocabulary. Learn them to speak and write accurately; they feed the flashcards and Knowledge Check.</p>' + d.terms.map(function (t) {
      var te = '';
      var ter = fieldExampleFor(w, 'term:' + t.term);
      if (ter) te = '<div style="border-left:4px solid #B02318;padding:6px 0 6px 12px;margin:6px 0 2px"><div class="mono" style="font-size:.64rem;letter-spacing:.08em;color:#B02318;font-weight:700;margin-bottom:3px">IN ' + esc(ter.label).toUpperCase() + '</div><p style="margin:0;font-size:.9rem;line-height:1.55">' + esc(ter.text) + '</p></div>';
      return '<div class="wk-term"><b>' + esc(t.term) + '</b>: ' + esc(t.def) + ' <span class="wk-cite">(' + esc(t.cite) + ')</span>' + te + '</div>'; }).join('');
    return '<section id="wk-term" class="node"><h2 class="wk-sec">Key terms</h2>' + inner + '</section>';
  }
  function audioPackSection(w) {
    var AU = window.BFS218_AUDIO || {};
    var ep = AU[w];
    if (!ep || !ep.file) return '';
    return '<section id="wk-audio" class="node"><h2 class="wk-sec">Listen to this week</h2>'
      + '<p class="wk-hint">Made for your ears: about ' + (ep.minutes || 10) + ' minutes covering this week\'s question, core concept, and readings. ' + esc(ep.blurb || '') + '</p>'
      + '<audio controls preload="none" style="width:100%" src="' + esc(ep.file) + '">Your browser cannot play this audio. Use the download link below.</audio>'
      + '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px">'
      + '<a href="' + esc(ep.file) + '" download class="wk-cta" style="text-decoration:none">Download for offline listening</a>'
      + (ep.transcript ? '<a href="' + esc(ep.transcript) + '" target="_blank" rel="noopener" class="wk-cta" style="text-decoration:none;background:#fff;color:#1B2A4A;border:1px solid #1B2A4A">Read the transcript</a>' : '')
      + '</div>'
      + '<p style="margin:10px 0 0;font-size:.78rem;color:var(--ink-faint)">Download before you travel; the subway has no signal. This episode teaches the week\'s ideas in audio form, and the readings still carry the citations and evidence your graded work needs.</p>'
      + '</section>';
  }
  function visualOverviewSection(w, d) {
    var spec = visualSpec(w, d);
    var V = window.BFS218_VISUALS || {};
    var vw = V.weeks && V.weeks[w];
    if (vw && vw.activity && vw.activity.modelKind && d && d.activity && d.activity.screen) {
      return '';
    }
    if (false) {
      return '<section id="wk-visual" class="node"><h2 class="wk-sec">A Visual Overview</h2>'
        + '<div class="wk-visual-card"><b>' + esc(spec.title) + '</b>'
        + '<p>' + esc(spec.scene) + '</p>'
        + '<p class="wk-hint">This week has one interactive 3D model, and it lives inside the activity, so you explore it while you experiment. You can rotate it, zoom it, and click inside it.</p>'
        + '<button type="button" class="wk-cta" onclick="SOC.startActivity(\'' + d.activity.screen + '\',' + w + ')">Open the 3D model in this week\'s activity</button>'
        + '</div></section>';
    }
    return '<section id="wk-visual" class="node"><h2 class="wk-sec">A Visual Overview</h2>'
      + '<p class="wk-hint">Use this as a labelled, movable teaching diagram. The point is not the picture by itself; the point is the process it helps you explain.</p>'
      + visualGuideHtml(spec)
      + visualTaskHtml(spec)
      + visualModelHtml(w, spec, 'week')
      + visualStepCards(spec.steps)
      + weekNoteBox(w, 'visual', 'A Visual Overview Notes', spec.notePrompt || 'Write one sentence that explains what the model helped you see. Focus on the process, not the graphics.')
      + '</section>';
  }
  function wkNoteKey(w, part) { return w + '|' + part; }
  function wkNoteValue(w, part) { return String((state.wkNotes && state.wkNotes[wkNoteKey(w, part)]) || '').trim(); }
  function weekNoteBox(w, part, title, prompt) {
    var key = wkNoteKey(w, part), id = 'wk-note-' + w + '-' + part;
    var val = (state.wkNotes && state.wkNotes[key]) || '';
    return '<label class="wk-notebox" for="' + id + '"><b>' + esc(title) + '</b><span>' + esc(prompt) + '</span><textarea id="' + id + '" oninput="SOC.wkNote(\'' + key + '\',this.value)" placeholder="Write a short note for your weekly document...">' + esc(val) + '</textarea><small class="wk-save-note">Never submitted, and never treat it as saved: this note lives only in this one browser and can be lost to a cleared cache, a different device, or a lab computer reset. To keep anything, download it with Generate Your Weekly Notes.</small></label>';
  }
  function weekActionLine(w, d) {
    var concept = d && d.concepts && d.concepts[0] ? d.concepts[0].h : weekTitle(w);
    return 'Your job is to understand ' + concept + ' well enough to explain one real example clearly.';
  }
  function pathCards(steps) {
    return '<div class="wk-path-grid">' + steps.map(function (s, i) {
      return '<div class="wk-path-card"><span>' + (i + 1) + '</span><b>' + esc(s[0]) + '</b><p>' + esc(s[1]) + '</p></div>';
    }).join('') + '</div>';
  }
  function weekLearningPath(w, d) {
    d = d || {};
    var activityTitle = d.activity && d.activity.title ? d.activity.title : 'the activity';
    var steps = [
      ['Read the week', 'Start with the overview, key concepts, and readings. Look for the main pattern, not every detail.'],
      ['Watch the walkthrough', 'This is your lecture. Use the walkthrough and A Visual Overview to see the pattern before you move on.'],
      ['Practise and check', 'Open ' + activityTitle + ' and the checks. The feedback is your teacher here. It is practice, not a grade.'],
      ['Reflect to finish', 'Write your reflection and generate your notes once you can explain the idea in your own words.']
    ];
    var done = [
      'You can say the week\'s main idea in your own words, without looking.',
      'You used the activity and the checks to test your own thinking, not just to finish them.',
      'You downloaded your weekly notes file, so you hold a record no browser can lose.'
    ];
    var st = (state.wkSteps && state.wkSteps[w]) || {};
    var doneN = steps.filter(function (_, i) { return st[i]; }).length;
    var rows = steps.map(function (s, i) {
      var on = !!st[i];
      return '<button type="button" class="wk-step' + (on ? ' on' : '') + '" onclick="SOC.wkStep(' + w + ',' + i + ')" aria-pressed="' + (on ? 'true' : 'false') + '"><span class="wk-step-box" aria-hidden="true">' + (on ? '&#10003;' : (i + 1)) + '</span><span class="wk-step-t"><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></span></button>';
    }).join('');
    return '<section id="wk-path" class="node wk-path wk-drive">'
      + '<div class="wk-drive-head"><div class="wk-path-kicker" style="color:var(--amode)">YOU DRIVE THIS WEEK</div><span class="wk-drive-count" id="wk-drive-count-' + w + '">' + doneN + ' of ' + steps.length + ' done</span></div>'
      + '<h2>Move through this week yourself, in four steps</h2>'
      + '<p>' + esc(weekActionLine(w, d)) + ' No one is pacing you, so check each step off as you finish it and you will always know where you stand.</p>'
      + '<div class="wk-steps">' + rows + '</div>'
      + '<div class="wk-done"><b>You have really got it when</b><ul>' + done.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div></section>';
  }
  function capstoneLearningPath(w, d) {
    var steps = [
      ['Return to your map', 'Use the visual to remember the course arc. Your own entries are the evidence now.'],
      ['Open the final project', 'Check each piece one at a time. The prompts help you turn the map into a final answer.'],
      ['Name the change', 'Write what you can see now that you could not see at the start of the course.'],
      ['Save the record', 'Save your .docx so the week has a clear record of your thinking.']
    ];
    return '<section id="wk-path" class="node wk-path"><div class="wk-path-kicker">Your learning path</div><h2>Use this week to finish clearly</h2>'
      + '<p>There is no new content here. The work is to return to your own map, name what changed, and carry one clear commitment forward.</p>'
      + pathCards(steps) + '</section>';
  }
  function overviewLearningPath(w, d) {
    var steps = [
      ['Start here', 'This week orients you. There are no readings and nothing to submit.'],
      ['Learn the rhythm', 'Each week uses the same pattern: read, see, try, reflect, save.'],
      ['Use the visual', 'The first visual shows that ordinary tools can carry hidden sorting rules.'],
      ['Begin Week 2', 'When the course rhythm makes sense, move into the first full teaching week.']
    ];
    return '<section id="wk-path" class="node wk-path"><div class="wk-path-kicker">Your learning path</div><h2>Start the course without guessing</h2>'
      + '<p>This course asks serious questions, but the weekly path is simple. You will learn one main idea at a time, test it with an activity, then save your own thinking.</p>'
      + pathCards(steps) + '</section>';
  }
  function weekVideoBrief(w, d) {
    var copy = {
      1: {
        title: 'Start by learning to notice.',
        sentences: [
          'Picture something you used this week: a search bar, phone camera, payment app, school portal, or feed.',
          'This course begins by asking you to notice what that tool sorts, recommends, watches, approves, or refuses.',
          'You do not need to prove a person behind it had bad intentions.',
          'You are looking for data, design, defaults, and patterns that already exist in the world around the tool.',
          'That is why your own digital life can become course evidence.',
          'By the end of the week, you should have one real moment you can place in your Personal Cartography.'
        ],
        watch: ['Notice one ordinary tool that sorts, scores, watches, recommends, approves, or refuses.', 'Ask what the tool treats as normal and who might not fit that default.', 'Choose one digital moment from your own life that could begin your map.']
      },
      2: {
        title: 'Shift from intention to outcome.',
        sentences: [
          'Once you can notice a tool, the next step is judging what it actually does.',
          'Imagine a tenant screen that uses the same rule for everyone but blocks one group more often.',
          'The key question is not only who meant harm.',
          'Ask what the system produces, who benefits, and who carries the burden.',
          'Critical race theory gives you that outcomes lens, and Benjamin uses it to explain the New Jim Code.',
          'By the end, you should be able to write: the rule looks neutral, but the outcome shows...'
        ],
        watch: ['Compare what the rule claims to do with what the outcome actually does.', 'Ask who carries the burden when the system looks neutral.', 'Connect CRT to the New Jim Code by naming how old inequity travels through a new tool.']
      },
      3: {
        title: 'Look for the design choice.',
        sentences: [
          'After you can read outcomes, start asking how the outcome was built.',
          'Picture a hiring tool trained on years of old hiring records.',
          'If those records already favoured some applicants, the tool can learn that pattern and repeat it faster.',
          'Engineered inequity is not a random glitch.',
          'It often lives in training data, thresholds, categories, access rules, and other design choices.',
          'Your task this week is to name one design choice and the inequality it speeds up or locks in.'
        ],
        watch: ['Look for the existing inequality before the technology enters the scene.', 'Name the design choice that makes the gap wider or faster.', 'Ask what would have to be redesigned, not just apologized for.']
      },
      4: {
        title: 'Notice what runs by default.',
        sentences: [
          'After looking at design choices, look at the choices that have become automatic.',
          'Picture a form that already has one box checked, one category missing, or one old record carried forward.',
          'Students, workers, clients, or residents may be pushed down that path before anyone notices.',
          'That is how discrimination can repeat without a new act of prejudice each time.',
          'This week, slow down when a system says, this is just how it works.',
          'Ask who set the default, who gets pushed by it, and who is allowed to change it.'
        ],
        watch: ['Find the setting or old record that keeps working automatically.', 'Ask who benefits when no one changes the default.', 'Name who has the power to pause, revise, or remove that default.']
      },
      5: {
        title: 'Ask who the system sees.',
        sentences: [
          'Once you have studied defaults, ask who the system can actually see.',
          'Picture a facial analysis tool that works well for lighter-skinned men but fails darker-skinned women far more often.',
          'That is not just a technical inconvenience.',
          'It tells you whose faces were centred in building and testing the tool.',
          'The Gender Shades audit gives you numbers you can read, compare, and explain.',
          'By the end, you should be able to show why a high average score can hide the group most at risk.'
        ],
        watch: ['Notice the difference between being over watched and being poorly recognized.', 'Use the error rates as evidence, not decoration.', 'Ask which group is hidden by the average score.']
      },
      6: {
        title: 'Bring the question to public power.',
        sentences: [
          'After asking who a system sees, ask who gets power from that seeing.',
          'Picture facial recognition in policing, a border screening tool, or social media surveillance used by a public agency.',
          'These systems do not only process information.',
          'They can shape who is stopped, delayed, watched, or treated as risky.',
          'This week brings the course language into Canadian cases and rights questions.',
          'Follow the chain from tool, to agency, to person affected, then ask where accountability should begin.'
        ],
        watch: ['Track the chain from tool, to institution, to person affected.', 'Ask what changes when a system is used by police, border agencies, or public bodies.', 'Name the right or freedom that becomes harder to exercise.']
      },
      7: {
        title: 'Hold the machine together.',
        sentences: [
          'By this point, you have several parts of the machine on the table.',
          'Take one example, such as a risk score, hiring screen, or camera system, and run it through the pieces.',
          'Ask what was engineered into it, what runs by default, and who is exposed or missed.',
          'Week 7 is not about memorizing a list of terms.',
          'It is about explaining how harm is produced across design, data, deployment, and power.',
          'A strong answer traces the pattern before jumping to a fix.'
        ],
        watch: ['Connect engineered inequity, defaults, and exposure as parts of one system.', 'Describe the pattern before jumping to a fix.', 'Explain how the harm is produced step by step.']
      },
      8: {
        title: 'Ask who governs the data.',
        sentences: [
          'After tracing how systems produce harm, change the starting question.',
          'Picture a health dataset, school record, or community survey held by an outside agency.',
          'Instead of asking only whether the data is accurate, ask who has the right to govern it.',
          'Indigenous data sovereignty treats data as connected to people, land, relationships, and authority.',
          'OCAP gives you concrete language for ownership, control, access, and possession.',
          'By the end, you should be able to say what changes when the community governs its own data.'
        ],
        watch: ['Treat data as connected to people and authority, not only as neutral information.', 'Use OCAP to ask who owns, controls, accesses, and possesses the data.', 'Ask what changes when the community holds authority over its own data.']
      },
      9: {
        title: 'Be careful with help.',
        sentences: [
          'After asking who controls data, look at tools that arrive as help.',
          'Picture an app that promises safety, a benefit system that promises efficiency, or a platform that promises inclusion.',
          'The promise may sound generous, but the result can still deepen inequity.',
          'That does not mean every helpful tool is false.',
          'It means you must ask who defined the problem and who benefits from the solution.',
          'By the end, judge the tool by what it does in real lives, not by the kindness of its language.'
        ],
        watch: ['Listen for the promise of help, care, safety, or inclusion.', 'Ask who defined the problem before the tool arrived.', 'Judge the tool by its effect on people, not by the kindness of its language.']
      },
      10: {
        title: 'Stand at the gate.',
        sentences: [
          'After questioning tools that claim to help, look at tools that decide access.',
          'A gate can be a hiring screen, loan score, admissions model, benefit form, or search ranking.',
          'The person kept out may never learn why.',
          'One model can sort thousands of people quickly, so a small design choice can have a large effect.',
          'Devlin helps you ask what inequality lives inside the algorithm and what inequality surrounds it.',
          'After this week, name one gate in your own world and ask who could appeal its decision.'
        ],
        watch: ['Identify the gate: job, loan, school, benefit, search result, or opportunity.', 'Ask what inequality sits inside the model and what inequality surrounds it.', 'Name who a person can ask when the gate keeps them out.']
      },
      11: {
        title: 'Move from critique to repair.',
        sentences: [
          'After standing at the gate, the course asks what response could look like.',
          'Picture a design meeting where the people most affected are not invited until the end.',
          'Design justice asks what changes when they lead from the beginning.',
          'Repair is not a nicer screen on top of the same old structure.',
          'It means changing who has power, whose knowledge counts, and who can say no.',
          'Bring this back to your field and name the first thing a community-led version of the tool would change.'
        ],
        watch: ['Separate real repair from a nicer interface over the same structure.', 'Ask who should lead the design if affected communities come first.', 'Name who has the power to refuse the tool or change its purpose.']
      },
      12: {
        title: 'Test the rulebook.',
        sentences: [
          'After imagining repair, test the rulebook.',
          'Picture a company deploying an AI system faster than the policy around it can respond.',
          'A regulation can sound strong and still leave gaps where people get hurt.',
          'This week asks you to compare what AI systems already do with what current rules actually cover.',
          'Look for the distance between promise and protection, because that is where accountability often disappears.',
          'By the end, name one policy lever and one thing it cannot fix by itself.'
        ],
        watch: ['Compare what the policy promises with what it actually protects.', 'Find the gap where harm can still happen.', 'Name one thing a single rule cannot fix by itself.']
      },
      13: {
        title: 'Return to your own map.',
        sentences: [
          'After the policy week, return to your own evidence.',
          'Open your Personal Cartography and place an early entry beside a later one.',
          'Your map is not just a folder of examples.',
          'It is a record of your seeing getting sharper over time.',
          'Look for places where your language changed, your examples got closer, or your questions became harder.',
          'That change is the evidence you need for the Personal Cartography walkthrough.'
        ],
        watch: ['Reread an early map entry and notice what you can now name.', 'Look for a place where your question became sharper.', 'Use your own map as evidence of your learning.']
      },
      14: {
        title: 'Answer the first question again.',
        sentences: [
          'The course closes by returning to the question it opened with.',
          'Can a machine be racist?',
          'Do not answer with a slogan.',
          'Choose one entry from your map and use it as evidence.',
          'Your answer should show the full path: seeing the tool, explaining the harm, naming accountability, and imagining response.',
          'You leave with a habit you can use whenever a future system arrives looking neutral.'
        ],
        watch: ['Answer the opening question with evidence from your own map.', 'Connect seeing, anatomy, response, and return in one explanation.', 'Name the habit of questioning technology that you will carry forward.']
      }
    };
    var item = copy[w] || {};
    var sentences = item.sentences || [d.overview || weekTitle(w)];
    return { title: item.title || 'Use this as your doorway into the week.', sentences: sentences.slice(0, 7), watch: (item.watch || (d.guiding || []).slice(0, 3)).slice(0, 3) };
  }
  function weekVideoSection(w, d, VID) {
    var brief = weekVideoBrief(w, d);
    var text = brief.sentences.map(function (s) { return esc(s); }).join(' ');
    var watch = brief.watch.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');
    var watchTitle = VID ? 'While you watch, do this' : 'Use this to focus';
    var media = VID
      ? '<video controls preload="none" playsinline poster="./' + VID.poster + '"><source src="./' + VID.file + '" type="video/mp4">' + (VID.vtt ? '<track kind="captions" srclang="en" label="English" src="./' + VID.vtt + '">' : '') + '</video><p>Made with NotebookLM from this week\'s readings and reviewed by your instructor.</p>'
      : '<div class="wk-video-map"><div class="mono">80 SECOND MAP</div><b>Read this before you start.</b><span>This week does not need a separate video player. Use the orientation beside it as the fast entry point into the readings, visual, and activity.</span></div>';
    return '<section id="wk-vid" class="node wk-video"><h2 class="wk-sec">This week in 80 seconds</h2><div class="wk-video-grid"><div class="wk-video-media">' + media + '</div><div class="wk-video-copy"><div class="mono">QUICK ORIENTATION</div><h3>' + esc(brief.title) + '</h3><p>' + text + '</p><div class="wk-video-watch"><b>' + esc(watchTitle) + '</b><ul>' + watch + '</ul></div></div></div></section>';
  }
  function activityStudentPath(w, a) {
    var map = {
      match: ['Read one case.', 'Choose the course idea that fits.', 'Use the feedback to understand why.'],
      scenario: ['Read the decision point.', 'Choose one path.', 'Read who is helped or harmed.'],
      toggle: ['Turn a default on or off.', 'Read what changes.', 'Name who carries the cost.'],
      assemble: ['Add one part.', 'Watch the system map build.', 'Ask how the parts work together.'],
      lab: ['Choose the levers.', 'Read the trade-off.', 'Keep the tension in view.'],
      capstone: ['Open one part of your map.', 'Mark what changed.', 'Turn it into your final answer.']
    };
    var steps = map[a.archetype] || ['Read the prompt.', 'Make a choice.', 'Use the feedback.'];
    return '<section class="activity-path" aria-label="Activity path"><div><b>Your task, in brief</b><p>This is not a quiz. It is a way to practise the week\'s idea until you can explain it.</p></div><ol>' + steps.map(function (s, i) { return '<li><span>' + (i + 1) + '</span>' + esc(s) + '</li>'; }).join('') + '</ol></section>';
  }
  function weekReadingRecords(d) {
    var out = [];
    ((d && d.readings) || []).forEach(function (r) {
      var rr = r.id && rec(r.id);
      if (rr) out.push(rr);
    });
    return out;
  }
  function readingRescueQuestion(w, d, anchor, concept) {
    if (w === 1) return 'What ordinary technology in your life already sorts, watches, scores, recommends, or misreads you?';
    if (w === 5) return 'Which group carries the highest error or risk when the system is tested intersectionally?';
    if (w === 6) return 'What public power does this system use, and who has the least ability to refuse it?';
    if (w === 8) return 'Who should govern the data, and what changes if the community holds that authority?';
    if (w === 11) return 'What would change if the people most affected had real authority over the design?';
    return (d.guiding && d.guiding[0]) || ('What does ' + (concept ? concept.h : 'this week') + ' help you notice?');
  }
  function readingRescueSection(w, d) {
    if (!d || !d.readings || !d.readings.length) return '';
    var records = weekReadingRecords(d);
    var anchor = records[0] || null;
    var concept = (d.concepts && d.concepts[0]) || null;
    var first = d.readings[0] || {};
    var rtitle = anchor ? anchor.title : (first.apa || 'this week\'s first reading');
    var rauth = anchor ? anchor.authors : '';
    var open = anchor ? '<button onclick="SOC.read(\'' + anchor.id + '\')" class="wk-rescue-open">Open the anchor reading <span aria-hidden="true">&#8599;</span></button>' : '';
    var q = readingRescueQuestion(w, d, anchor, concept);
    var conceptName = concept ? concept.h : 'the week\'s main concept';
    var conceptBody = concept ? concept.body.slice(0, 190).replace(/\s+\S*$/, '') + '...' : 'Use this concept to read the week, not just summarize it.';
    return '<div id="wk-rescue" class="wk-rescue" aria-label="Reading Rescue"><div class="wk-rescue-head"><div class="mono">READING RESCUE</div><h3>If you are behind, start here</h3><p>This is not a replacement for the readings. It is the shortest honest path back into them.</p></div>'
      + '<div class="wk-rescue-grid"><div><b>1. Read one anchor source</b><span>' + esc(rtitle) + (rauth ? ' by ' + esc(rauth) : '') + '</span>' + open + '</div>'
      + '<div><b>2. Carry one concept</b><span>' + esc(conceptName) + '</span><small>' + esc(conceptBody) + '</small></div>'
      + '<div><b>3. Answer one evidence question</b><span>' + esc(q) + '</span><small>Your answer should point back to the reading, not only the video, visual, or activity.</small></div></div>'
      + '<div class="wk-rescue-foot"><b>Do not stop at the rescue path.</b><span>Use it when you are stuck, then return to the full reading list before you submit anything for marks.</span></div></div>';
  }
  function activityModelSection(w, a) {
    var spec = activityVisualSpec(w, a);
    var guide = spec.steps ? spec.steps.map(function (s) { return Array.isArray(s) ? s[0] + ': ' + s[1] : s; }) : ['Look at the model.', 'Do the activity below.', 'Name what the activity helped you see.'];
    var title = spec.title || 'Use the model before the activity.';
    return '<section class="activity-model" aria-label="Activity 3D model">'
      + '<div class="activity-how"><b>' + esc(title) + '</b><ol>' + guide.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('') + '</ol></div>'
      + visualModelHtml(w, spec, 'activity')
      + '</section>';
  }
  function activityStartGuide(w) {
    var spec = visualSpec(w, weekData(w));
    var guide = (spec.activity && spec.activity.steps) ? spec.activity.steps : ['Look at the model.', 'Do the activity.', 'Name what it helped you see.'];
    return '<div class="activity-how" style="margin:14px 0 16px"><b>Before you start</b><ol>' + guide.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('') + '</ol><p style="margin:8px 0 0;font-size:.82rem;line-height:1.5;color:var(--ink-dim)">The next screen gives the exact clicks or taps for this activity.</p></div>';
  }
  function activityInteractionGuide(w, a) {
    var d = a.data || {};
    var guides = {
      match: ['Read one example at a time.', 'Choose one mechanism button under that example. There is no dragging in this activity.', 'Green shows the best match. Red shows a try that does not fit. You can choose again.'],
      scenario: ['Read the decision point.', 'Choose one option.', 'Read the result, then move to the next decision.'],
      toggle: ['Use each switch to turn a default on or off.', 'Read what changes.', 'Look for who carries the cost when the default is treated as neutral.'],
      assemble: ['Use the buttons on the left to add parts.', 'Watch the right side build the system map.', 'The goal is to see how the parts work together, not to find one bad part.'],
      lab: ['Choose ' + esc(d.pick || 2) + ' levers.', 'Each chosen lever opens with what it does and what it costs.', 'Click a lever again to remove it or choose another one.'],
      capstone: ['Check each part as you revisit it.', 'Read the prompt that opens under it.', 'Use the prompts to shape your final video or map.']
    };
    var steps = guides[a.archetype] || ['Use the controls on this page.', 'Read the feedback that appears.', 'Connect what happened back to the reading.'];
    return '<section class="activity-run-guide" aria-label="How this activity works"><div><b>How this activity works</b><ol>' + steps.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('') + '</ol></div></section>';
  }
  function activityOutputGuide(w, a) {
    var map = {
      match: 'Make at least one choice under each example. The useful output is not the score; it is being able to explain why the correct mechanism fits.',
      scenario: 'Work through each decision point. The useful output is a short explanation of which choice reduces harm and which choice hides it.',
      toggle: 'Turn the defaults on and off. The useful output is naming who carries the cost when a default is treated as normal.',
      assemble: 'Add parts to the response. The useful output is explaining how the parts work together, not just collecting them.',
      lab: 'Choose the policy levers and compare the trade-offs. The useful output is naming what each lever can and cannot fix.',
      capstone: 'Check each part of your map. The useful output is a final answer grounded in your own evidence.'
    };
    return '<section class="activity-run-guide" aria-label="What to produce from this activity"><div><b>What you should leave with</b><p style="margin:0;font-size:.84rem;line-height:1.52;color:var(--ink-dim)">' + esc(map[a.archetype] || 'Use the controls, read the feedback, and write down what the activity helped you understand.') + ' Add that sentence to Activity Notes so it appears in Generate Your Weekly Notes.</p></div></section>';
  }
  function initTopicModels() {
    var canvases = Array.prototype.slice.call(document.querySelectorAll('canvas[data-topic-model]'));
    if (!canvases.length) return;
    loadThree().then(function (THREE) {
      canvases.forEach(function (canvas) { initTopicModel(THREE, canvas, auditRenderStamp); });
    }).catch(function () {
      canvases.forEach(function (canvas) {
        var fb = canvas.parentNode && canvas.parentNode.querySelector('.wk-model-fallback');
        if (fb) fb.hidden = false;
      });
    });
  }
  function initTopicModel(THREE, canvas, stamp) {
    if (!canvas || canvas.__topicInit || !canvas.isConnected || stamp !== auditRenderStamp) return;
    canvas.__topicInit = true;
    canvas.__topicStamp = stamp;
    var shell = canvas.parentNode, week = Number(canvas.getAttribute('data-week')) || 1;
    var kind = canvas.getAttribute('data-kind') || 'pipeline';
    var view = canvas.getAttribute('data-view') || 'observe';
    var riskOn = view === 'risk' || view === 'explain';
    var pathOn = view === 'path' || view === 'try';
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, preserveDrawingBuffer: false });
    canvas.__topicGL = renderer.getContext ? renderer.getContext() : null;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
    if (THREE.ACESFilmicToneMapping) renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf8fbfd, 8, 18);
    var camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.1, 90);
    camera.position.set(4.8, 3.4, 6.6);
    camera.lookAt(0, 0.55, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb8c4d0, 2.5));
    var sun = new THREE.DirectionalLight(0xffffff, 3.0); sun.position.set(3.5, 6.5, 4.8); scene.add(sun);
    var fill = new THREE.DirectionalLight(0xe7f7ff, 1.0); fill.position.set(-4, 3, -3); scene.add(fill);
    var rim = new THREE.DirectionalLight(0xcff9ff, 0.65); rim.position.set(-3.2, 4.4, 4.5); scene.add(rim);
    var root = new THREE.Group(); root.scale.set(0.9, 0.9, 0.9); root.position.set(0, -0.05, 0); scene.add(root);
    var labelEls = shell ? Array.prototype.slice.call(shell.querySelectorAll('.wk-model-label[data-anchor]')) : [];
    labelEls.forEach(function (el) {
      var nums = String(el.getAttribute('data-anchor') || '0,1,0').split(',').map(function (n) { return Number(n); });
      el.__topicAnchor = nums.length >= 3 && nums.every(function (n) { return !isNaN(n); }) ? nums.slice(0, 3) : [0, 1, 0];
    });
    var leaderSvg = shell ? shell.querySelector('.wk-label-leaders') : null;
    var leaderParts = [];
    if (leaderSvg && labelEls.length) {
      var NS = 'http://www.w3.org/2000/svg';
      leaderSvg.innerHTML = '';
      leaderParts = labelEls.map(function () {
        var line = document.createElementNS(NS, 'line');
        var dot = document.createElementNS(NS, 'circle');
        line.setAttribute('class', 'wk-label-line');
        dot.setAttribute('class', 'wk-label-anchor');
        dot.setAttribute('r', '4.2');
        leaderSvg.appendChild(line);
        leaderSvg.appendChild(dot);
        return { line: line, dot: dot };
      });
    }
    var labelVec = new THREE.Vector3();
    function updateTopicLabels() {
      if (!labelEls.length || !shell || !canvas.isConnected) return;
      var mobile = false;
      try { mobile = window.matchMedia && window.matchMedia('(max-width: 760px)').matches; } catch (e) {}
      if (mobile) {
        labelEls.forEach(function (el) {
          el.style.left = '';
          el.style.top = '';
          el.style.opacity = '';
          el.style.transform = '';
          el.style.zIndex = '';
        });
        if (leaderSvg) leaderSvg.setAttribute('hidden', 'hidden');
        return;
      }
      var box = canvas.getBoundingClientRect();
      var shellBox = shell.getBoundingClientRect();
      var shellW = shellBox.width || shell.clientWidth || box.width;
      var shellH = shellBox.height || shell.clientHeight || box.height;
      var canvasTop = box.top - shellBox.top;
      var canvasH = box.height;
      if (leaderSvg) {
        leaderSvg.removeAttribute('hidden');
        leaderSvg.setAttribute('viewBox', '0 0 ' + Math.round(shellW) + ' ' + Math.round(shellH));
      }
      var note = shell.querySelector('.wk-model-note');
      var noteBottom = 0;
      if (note) {
        var nb = note.getBoundingClientRect();
        noteBottom = Math.max(0, nb.bottom - shellBox.top);
      }
      var slots = [
        { x: shellW * 0.12, y: canvasTop + canvasH * 0.18 },
        { x: shellW * 0.62, y: canvasTop + Math.max(12, canvasH * 0.025) },
        { x: shellW * 0.88, y: canvasTop + canvasH * 0.18 }
      ];
      if (kind === 'outcomelens') {
        slots = [
          { x: shellW * 0.17, y: canvasTop + canvasH * 0.34 },
          { x: shellW * 0.52, y: canvasTop + canvasH * 0.34 },
          { x: shellW * 0.84, y: canvasTop + canvasH * 0.48 }
        ];
      } else if (kind === 'mechanismatch') {
        slots = [
          { x: shellW * 0.14, y: canvasTop + canvasH * 0.32 },
          { x: shellW * 0.62, y: canvasTop + canvasH * 0.14 },
          { x: shellW * 0.86, y: canvasTop + canvasH * 0.27 }
        ];
      } else if (kind === 'audit') {
        slots = [
          { x: shellW * 0.15, y: canvasTop + canvasH * 0.33 },
          { x: shellW * 0.18, y: canvasTop + canvasH * 0.58 },
          { x: shellW * 0.85, y: canvasTop + canvasH * 0.5 }
        ];
      } else if (kind === 'auditturntable') {
        slots = [
          { x: shellW * 0.15, y: canvasTop + canvasH * 0.33 },
          { x: shellW * 0.18, y: canvasTop + canvasH * 0.58 },
          { x: shellW * 0.85, y: canvasTop + canvasH * 0.5 }
        ];
      }
      root.updateMatrixWorld(true);
      labelEls.forEach(function (el, i) {
        var a = el.__topicAnchor || [0, 1, 0];
        labelVec.set(a[0], a[1], a[2]).applyMatrix4(root.matrixWorld).project(camera);
        var anchorX = (box.left - shellBox.left) + (labelVec.x * 0.5 + 0.5) * box.width;
        var anchorY = canvasTop + (-labelVec.y * 0.5 + 0.5) * box.height;
        var slot = slots[i % slots.length];
        var wobbleX = Math.max(-24, Math.min(24, (anchorX - slot.x) * 0.1));
        var wobbleY = Math.max(i === 1 ? -5 : -10, Math.min(i === 1 ? 5 : 10, (anchorY - slot.y) * 0.05));
        var ew = el.offsetWidth || 180, eh = el.offsetHeight || 62;
        var x = slot.x + wobbleX;
        var y = slot.y + wobbleY;
        [note, shell.querySelector('.wk-holo-display')].forEach(function (panel) {
          if (!panel) return;
          var pb = panel.getBoundingClientRect();
          var pLeft = pb.left - shellBox.left, pRight = pb.right - shellBox.left, pTop = pb.top - shellBox.top, pBottom = pb.bottom - shellBox.top;
          var overlapsPanel = x + ew * 0.5 > pLeft - 8 && x - ew * 0.5 < pRight + 8 && y + eh * 0.5 > pTop - 8 && y - eh * 0.5 < pBottom + 8;
          if (overlapsPanel) y = pBottom + eh * 0.5 + 10;
        });
        x = Math.max(ew * 0.5 + 12, Math.min(shellW - ew * 0.5 - 12, x));
        y = Math.max(eh * 0.5 + 10, Math.min(canvasTop + canvasH - eh * 0.5 - 18, y));
        var visible = labelVec.z > -1 && labelVec.z < 1;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.opacity = visible ? '1' : '.22';
        el.style.transform = 'translate(-50%, -50%)';
        el.style.zIndex = String(20 + Math.round((1 - labelVec.z) * 10));
        var leader = leaderParts[i];
        if (leader) {
          var dx = anchorX - x, dy = anchorY - y;
          var useX = Math.abs(dx) > Math.abs(dy);
          var lineX = x + (useX ? (dx > 0 ? ew * 0.5 : -ew * 0.5) : Math.max(-ew * 0.38, Math.min(ew * 0.38, dx)));
          var lineY = y + (useX ? Math.max(-eh * 0.38, Math.min(eh * 0.38, dy)) : (dy > 0 ? eh * 0.5 : -eh * 0.5));
          leader.line.setAttribute('x1', lineX.toFixed(1));
          leader.line.setAttribute('y1', lineY.toFixed(1));
          leader.line.setAttribute('x2', anchorX.toFixed(1));
          leader.line.setAttribute('y2', anchorY.toFixed(1));
          leader.line.style.opacity = visible ? '1' : '.18';
          leader.dot.setAttribute('cx', anchorX.toFixed(1));
          leader.dot.setAttribute('cy', anchorY.toFixed(1));
          leader.dot.style.opacity = visible ? '1' : '.18';
        }
      });
    }
    var mats = {};
    function m(color, opt) {
      opt = opt || {};
      var opacityKey = opt.opacity == null ? 1 : opt.opacity;
      var roughKey = opt.rough == null ? 0.48 : opt.rough;
      var metalKey = opt.metal == null ? 0.06 : opt.metal;
      var transKey = opt.transmission == null ? 0.12 : opt.transmission;
      var key = color + '|' + opacityKey + '|' + roughKey + '|' + metalKey + '|' + transKey + '|' + !!opt.glass + '|' + !!opt.emissive + '|' + !!opt.clearcoat;
      if (!mats[key]) {
        var args = { color: color, roughness: roughKey, metalness: metalKey };
        if (opt.opacity != null && opt.opacity < 1) { args.transparent = true; args.opacity = opt.opacity; }
        if (opt.emissive) { args.emissive = color; args.emissiveIntensity = 0.25; }
        if (opt.glass) {
          args.transparent = true;
          args.opacity = opt.opacity == null ? 0.38 : opt.opacity;
          args.depthWrite = false;
          if (opt.clearcoat) {
            args.roughness = Math.min(args.roughness, 0.22);
            args.metalness = Math.max(args.metalness, 0.08);
          }
        }
        mats[key] = new THREE.MeshStandardMaterial(args);
      }
      return mats[key];
    }
    function mesh(geo, mat, pos, rot, scale) {
      var x = new THREE.Mesh(geo, mat);
      if (pos) x.position.set(pos[0], pos[1], pos[2]);
      if (rot) x.rotation.set(rot[0], rot[1], rot[2]);
      if (scale) x.scale.set(scale[0], scale[1], scale[2]);
      root.add(x);
      return x;
    }
    function box(wd, ht, dp, color, pos, opt) {
      var x = mesh(new THREE.BoxGeometry(wd, ht, dp), m(color, opt), pos);
      if (opt && opt.edge) edge(x, opt.edge);
      return x;
    }
    function sph(r, color, pos, opt) { return mesh(new THREE.SphereGeometry(r, 22, 14), m(color, opt), pos); }
    function cyl(r, h, color, pos, rot, opt) { return mesh(new THREE.CylinderGeometry(r, r, h, 22), m(color, opt), pos, rot); }
    function tor(r, tube, color, pos, rot, opt) { return mesh(new THREE.TorusGeometry(r, tube, 14, 80), m(color, opt), pos, rot); }
    function cone(r, h, color, pos, rot, opt) { return mesh(new THREE.ConeGeometry(r, h, 32, 1, true), m(color, opt), pos, rot); }
    var contactShadowTexture = null;
    function contactShadow(wd, dp, pos, opt) {
      opt = opt || {};
      if (!contactShadowTexture) {
        var c = document.createElement('canvas');
        c.width = 128; c.height = 128;
        var ctx = c.getContext('2d');
        var g = ctx.createRadialGradient(64, 64, 6, 64, 64, 60);
        g.addColorStop(0, 'rgba(27,42,74,.24)');
        g.addColorStop(0.55, 'rgba(27,42,74,.10)');
        g.addColorStop(1, 'rgba(27,42,74,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 128, 128);
        contactShadowTexture = new THREE.CanvasTexture(c);
      }
      var mat = new THREE.MeshBasicMaterial({ map: contactShadowTexture, transparent: true, opacity: opt.opacity == null ? 0.34 : opt.opacity, depthWrite: false });
      var sh = mesh(new THREE.PlaneGeometry(wd, dp), mat, [pos[0], -0.028, pos[2]], [-Math.PI / 2, 0, opt.rot || 0]);
      sh.renderOrder = -4;
      return sh;
    }
    function edge(x, color) {
      var e = new THREE.LineSegments(new THREE.EdgesGeometry(x.geometry), new THREE.LineBasicMaterial({ color: color || 0xffffff, transparent: true, opacity: 0.55 }));
      e.position.copy(x.position); e.rotation.copy(x.rotation); e.scale.copy(x.scale); root.add(e);
    }
    function tube(points, color, radius) {
      var curve = new THREE.CatmullRomCurve3(points.map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); }));
      mesh(new THREE.TubeGeometry(curve, 28, radius || 0.025, 10, false), m(color, { rough: 0.35, metal: 0.12, emissive: riskOn && color === 0xda291c }));
    }
    var holo = null;
    if (window.BFS218_HOLO && window.BFS218_HOLO.supports && window.BFS218_HOLO.supports(kind)) {
      try {
        var expCtx = null;
        try {
          var EXH = window.BFS218_EXPERIMENTS || {};
          var ctxName = canvas.getAttribute('data-topic-model');
          if (ctxName === 'activity' && EXH[week]) {
            var est = (state.exp && state.exp[week]) || {};
            expCtx = { options: EXH[week].options, pick: typeof est.pick === 'number' ? est.pick : null, ran: !!est.ran };
          }
        } catch (e2) {}
        holo = window.BFS218_HOLO.build(THREE, { kind: kind, week: week, view: view, riskOn: riskOn, pathOn: pathOn, root: root, scene: scene, camera: camera, renderer: renderer, canvas: canvas, sun: sun, context: canvas.getAttribute('data-topic-model'), expOptions: expCtx && expCtx.options, expPick: expCtx && expCtx.pick, expRan: expCtx && expCtx.ran });
      } catch (e) {
        holo = null;
        try { (window.__HOLO_ERRS = window.__HOLO_ERRS || []).push(kind + ': ' + (e && (e.message || e))); } catch (e2) {}
      }
    }
    if (!holo) {
      var grid = new THREE.GridHelper(7.2, 10, 0xd6dde5, 0xd6dde5);
      var gridMats = Array.isArray(grid.material) ? grid.material : [grid.material];
      gridMats.forEach(function (gm) {
        gm.transparent = true;
        gm.opacity = (kind === 'outcomelens' || kind === 'mechanismatch') ? 0.16 : 0.24;
      });
      root.add(grid);
      box(7.3, 0.08, 5.2, 0xe9eef2, [0, -0.08, 0], { rough: 0.72 });
    }
    function miniPerson(x, z, color) {
      cyl(0.11, 0.38, color || 0x1b2a4a, [x, 0.22, z]);
      sph(0.14, 0x9fdde0, [x, 0.5, z], { rough: 0.36 });
    }
    function paperCard(x, z, wd, dp, accent, rot) {
      var y = 0.24;
      var r = rot || 0;
      var card = box(wd, 0.04, dp, 0xffffff, [x, y, z], { edge: 0xc9d3dc, rough: 0.24, metal: 0.01 });
      card.rotation.y = r;
      var tab = box(wd * 0.28, 0.045, dp * 0.16, accent || 0x00aeb3, [x - wd * 0.26, y + 0.052, z - dp * 0.34], { edge: 0xffffff, rough: 0.3 });
      tab.rotation.y = r;
      for (var pc = 0; pc < 3; pc++) {
        var line = box(wd * (0.62 - pc * 0.08), 0.026, dp * 0.045, pc === 0 ? 0x1b2a4a : 0x8ba0b4, [x + wd * 0.08, y + 0.075 + pc * 0.055, z - dp * 0.16 + pc * dp * 0.16], { edge: pc === 0 ? 0x1b2a4a : 0x8ba0b4, rough: 0.38 });
        line.rotation.y = r;
      }
      return card;
    }
    function decisionMark(x, z, good) {
      var c = good ? 0x1c7a43 : 0xda291c;
      if (good) {
        tube([[x - 0.18, 0.56, z], [x - 0.05, 0.43, z], [x + 0.22, 0.72, z]], c, 0.026);
      } else {
        tube([[x - 0.2, 0.44, z - 0.16], [x + 0.2, 0.76, z + 0.16]], c, 0.026);
        tube([[x + 0.2, 0.44, z - 0.16], [x - 0.2, 0.76, z + 0.16]], c, 0.026);
      }
    }
    function burdenDiscs(x, z, n) {
      for (var bd = 0; bd < n; bd++) {
        cyl(0.18 + bd * 0.018, 0.09, bd > 1 ? 0xda291c : 0xffa12b, [x + (bd % 2) * 0.1, 0.23 + bd * 0.095, z + Math.floor(bd / 2) * 0.1], null, { rough: 0.26, metal: 0.16, emissive: bd > 2 && riskOn });
      }
    }
    function arrow(a, b, color) {
      tube([a, [(a[0] + b[0]) / 2, Math.max(a[1], b[1]) + 0.18, (a[2] + b[2]) / 2], b], color || 0x1b2a4a, 0.028);
      cone(0.09, 0.28, color || 0x1b2a4a, b, [Math.PI / 2, 0, 0]);
    }
    function rowBlocks(n, color, hotIndex) {
      for (var i = 0; i < n; i++) {
        var x = -2.4 + i * (4.8 / Math.max(1, n - 1));
        var hot = i === hotIndex;
        box(0.72, 0.56, 0.72, hot ? 0xda291c : color, [x, 0.28, 0], { edge: hot ? 0xda291c : 0xffffff, opacity: hot ? 0.96 : 0.78, glass: !hot });
        if (i > 0) arrow([x - (4.8 / Math.max(1, n - 1)) + 0.38, 0.38, 0], [x - 0.42, 0.38, 0], pathOn || hot ? 0xda291c : 0x1b2a4a);
      }
    }
      if (!holo) switch (kind) {
      case 'startermap':
        miniPerson(0, -0.1, 0x1b2a4a);
        [[-2.05, -1.05, 0xffffff], [-2.1, 0.95, 0xe7f3ec], [1.95, -1.05, 0xfbe9ea], [2.05, 0.95, 0xffffff]].forEach(function (p, si) {
          box(0.78, 0.12, 0.58, p[2], [p[0], 0.18, p[1]], { edge: si === 2 && riskOn ? 0xda291c : 0x8ba0b4 });
          sph(0.06, si === 2 && riskOn ? 0xda291c : 0x00aeb3, [p[0] + 0.22, 0.32, p[1] - 0.12]);
          tube([[p[0], 0.32, p[1]], [p[0] * 0.42, 0.62, p[1] * 0.42], [0, 0.62, -0.1]], (si === 2 || pathOn) ? 0xda291c : 0x8ba0b4, 0.016);
        });
        box(1.35, 0.08, 0.88, 0xffffff, [0, 0.14, 1.72], { edge: 0x8ba0b4 });
        tube([[-0.2, 0.54, 0.18], [0.35, 0.72, 0.9], [0.18, 0.3, 1.42]], riskOn ? 0xda291c : 0x1b2a4a, 0.024);
        cone(0.12, 0.32, riskOn ? 0xda291c : 0x1b2a4a, [0.18, 0.3, 1.42], [Math.PI / 2, 0, 0]);
        break;
      case 'matchwork':
        box(2.15, 0.12, 1.2, 0xffffff, [-2.15, 0.18, -0.55], { edge: 0x8ba0b4 });
        box(2.15, 0.12, 1.2, 0xffffff, [-2.15, 0.18, 0.95], { edge: 0x8ba0b4 });
        box(0.82, 1.1, 0.18, 0x1b2a4a, [-0.18, 0.65, 0.15], { edge: 0xffffff });
        [[1.42, -0.78], [2.25, 0.08], [1.42, 0.94]].forEach(function (p, mi) {
          box(1.08, 0.44, 0.82, mi === 1 && riskOn ? 0xda291c : 0x9fdde0, [p[0], 0.32, p[1]], { opacity: 0.62, glass: true, edge: mi === 1 ? 0xda291c : 0x00aeb3 });
          tube([[-1.08, 0.34, mi ? 0.92 : -0.52], [0.05, 0.74, p[1]], [p[0] - 0.52, 0.42, p[1]]], pathOn || mi === 1 ? 0xda291c : 0x8ba0b4, 0.022);
        });
        sph(0.14, riskOn ? 0xda291c : 0x1c7a43, [2.75, 0.62, 0.08]);
        break;
      case 'mechanismatch':
        contactShadow(1.62, 1.16, [-2.32, 0, -0.42], { opacity: 0.2 });
        contactShadow(1.55, 1.35, [-0.28, 0, 0], { opacity: 0.16 });
        contactShadow(2.3, 1.25, [2.05, 0, 0.05], { opacity: 0.18 });
        paperCard(-2.32, -0.42, 1.48, 1.08, 0xffa12b);
        box(0.22, 0.12, 0.22, 0x1b2a4a, [-2.86, 0.46, -0.07], { rough: 0.34, metal: 0.08 });
        box(0.22, 0.12, 0.22, 0xda291c, [-2.58, 0.46, 0.02], { rough: 0.3, metal: 0.1, emissive: riskOn });
        box(0.38, 0.08, 0.34, riskOn ? 0xda291c : 0xffa12b, [-1.76, 0.34, -0.1], { edge: 0xffffff, rough: 0.26, metal: 0.08, emissive: riskOn });
        tube([[-1.64, 0.42, -0.2], [-1.08, 0.78, -0.08], [-0.52, 0.84, 0]], pathOn || riskOn ? 0xda291c : 0x1b2a4a, 0.03);
        tor(0.66, 0.026, pathOn || riskOn ? 0xda291c : 0x00aeb3, [-0.28, 0.72, 0], [Math.PI / 2, 0, 0], { opacity: 0.92, rough: 0.22, metal: 0.18, emissive: riskOn });
        box(0.12, 1.26, 1.42, 0x9fdde0, [-0.28, 0.72, 0], { opacity: 0.3, glass: true, transmission: 0.2, clearcoat: true, edge: 0x00aeb3, rough: 0.18, metal: 0.03 });
        box(1.16, 0.045, 1.16, 0xffffff, [-0.28, 0.18, 0], { opacity: 0.44, glass: true, transmission: 0.16, clearcoat: true, edge: 0xd6dde5, rough: 0.22 });
        tube([[-0.02, 0.82, 0.02], [0.7, 1.02, 0.24], [1.2, 0.68, 0.34]], pathOn || riskOn ? 0xda291c : 0x8ba0b4, 0.028);
        [
          [-0.05, -0.66, 0x9fdde0, 0x00aeb3],
          [0.84, -0.66, 0xffcc66, 0xffa12b],
          [-0.05, 0.5, 0xffa12b, 0xda291c],
          [0.84, 0.5, 0xe7f3ec, 0x1c7a43]
        ].forEach(function (p, mm) {
          var hot = riskOn ? mm === 2 : (pathOn ? mm === 1 : false);
          var px = 1.42 + p[0], pz = p[1];
          box(0.78, hot ? 0.64 : 0.46, 0.66, hot ? 0xda291c : p[2], [px, hot ? 0.42 : 0.34, pz], { opacity: hot ? 0.92 : 0.62, glass: !hot, transmission: hot ? 0 : 0.14, clearcoat: !hot, rough: hot ? 0.28 : 0.2, metal: hot ? 0.08 : 0.03, edge: hot ? 0xda291c : p[3], emissive: hot });
          box(0.48, 0.045, 0.1, hot ? 0xffffff : 0x1b2a4a, [px, hot ? 0.78 : 0.62, pz - 0.14], { edge: hot ? 0xffffff : 0x1b2a4a, rough: 0.3 });
          box(0.34, 0.035, 0.08, hot ? 0xffffff : 0x8ba0b4, [px, hot ? 0.89 : 0.72, pz + 0.08], { edge: hot ? 0xffffff : 0x8ba0b4, rough: 0.3 });
        });
        if (riskOn) {
          tor(0.48, 0.018, 0xda291c, [1.38, 0.88, 0.5], [Math.PI / 2, 0, 0], { opacity: 0.9, emissive: true });
          box(1.06, 0.06, 0.72, 0xfbe9ea, [2.22, 0.94, 0.5], { edge: 0xda291c });
          sph(0.08, 0xda291c, [2.68, 1.08, 0.74], { emissive: true });
        }
        break;
      case 'decisionpath':
        box(1.05, 0.72, 1.0, 0xffffff, [-2.0, 0.45, 0], { edge: 0x8ba0b4 });
        sph(0.24, 0xffa12b, [-0.55, 0.62, 0]);
        arrow([-1.46, 0.52, 0], [-0.88, 0.6, 0], pathOn ? 0xda291c : 0x1b2a4a);
        box(1.3, 0.46, 0.85, 0xe7f3ec, [1.28, 0.35, -0.82], { edge: 0x1c7a43 });
        box(1.3, 0.46, 0.85, 0xfbe9ea, [1.28, 0.35, 0.82], { edge: 0xda291c });
        tube([[-0.35, 0.62, 0], [0.45, 0.92, -0.46], [0.8, 0.42, -0.82]], 0x1c7a43, 0.028);
        tube([[-0.35, 0.62, 0], [0.45, 0.92, 0.46], [0.8, 0.42, 0.82]], riskOn ? 0xda291c : 0x1b2a4a, 0.028);
        cone(0.12, 0.34, riskOn ? 0xda291c : 0x1b2a4a, [0.88, 0.42, 0.82], [Math.PI / 2, 0, 0]);
        break;
      case 'defaultboard':
        box(3.95, 0.24, 2.0, 0xffffff, [-0.35, 0.14, 0], { edge: 0x8ba0b4 });
        for (var db = 0; db < 4; db++) {
          var active = db < (pathOn ? 3 : 1);
          box(0.78, 0.08, 0.22, 0xd6dde5, [-1.78 + db * 0.78, 0.34, -0.2], { edge: 0x8ba0b4 });
          sph(0.15, active ? 0xda291c : 0x00aeb3, [-2.02 + db * 0.78 + (active ? 0.26 : 0), 0.48, -0.2]);
          tube([[-1.78 + db * 0.78, 0.48, 0.1], [-1.78 + db * 0.78, 0.58, 0.8]], active && riskOn ? 0xda291c : 0x8ba0b4, 0.014);
        }
        box(1.18, 0.72, 0.92, riskOn ? 0xfbe9ea : 0xe7f3ec, [2.1, 0.42, 0.45], { edge: riskOn ? 0xda291c : 0x1c7a43 });
        miniPerson(2.1, -0.85, riskOn ? 0xda291c : 0x1b2a4a);
        break;
      case 'toolkit':
        box(4.7, 0.16, 2.0, 0xe9eef2, [0, 0.12, 0], { edge: 0x8ba0b4 });
        [[-2.0, -0.65], [-1.35, 0.15], [-1.95, 0.85]].forEach(function (p, ti) {
          box(0.7, 0.38, 0.42, ti === 1 && riskOn ? 0xda291c : 0xffffff, [p[0], 0.36, p[1]], { edge: ti === 1 ? 0xda291c : 0x8ba0b4 });
        });
        box(1.55, 0.9, 1.12, 0x9fdde0, [0.45, 0.58, 0], { opacity: 0.38, glass: true, edge: 0x00aeb3 });
        cyl(0.06, 1.4, 0xffa12b, [1.42, 0.44, -0.62], [0, 0, Math.PI / 2]);
        cyl(0.05, 1.25, riskOn ? 0xda291c : 0x1b2a4a, [1.35, 0.54, 0.56], [0.4, 0, Math.PI / 2]);
        tube([[-1.1, 0.42, 0], [-0.3, 0.72, 0.1], [0.45, 0.74, 0]], pathOn ? 0xda291c : 0x1b2a4a, 0.026);
        break;
      case 'policydeck':
        ['system', 'institution', 'law', 'rights'].forEach(function (name, pi) {
          box(3.2 - pi * 0.25, 0.2, 1.8 - pi * 0.12, [0xe9eef2, 0x9fdde0, 0xffcc66, 0x1b2a4a][pi], [-0.25, 0.16 + pi * 0.28, 0], { opacity: pi === 3 ? 0.9 : 0.72, glass: pi < 2, edge: 0xffffff });
          cyl(0.04, 1.18, pi === 2 && riskOn ? 0xda291c : 0xffa12b, [1.85, 0.22 + pi * 0.28, -0.55 + pi * 0.35], [0, 0, Math.PI / 2]);
        });
        cone(0.16, 0.42, riskOn ? 0xda291c : 0xffa12b, [2.55, 0.86, 0.15], [0, 0, -Math.PI / 2]);
        arrow([-2.25, 0.28, 0], [-1.62, 1.02, 0], pathOn ? 0xda291c : 0x1b2a4a);
        break;
      case 'capstonemap':
        box(1.25, 0.08, 0.92, 0xffffff, [-1.95, 0.16, -0.85], { edge: 0x8ba0b4 });
        box(1.25, 0.08, 0.92, 0xffffff, [-0.45, 0.34, -0.25], { edge: 0x8ba0b4 });
        box(1.25, 0.08, 0.92, 0xffffff, [1.05, 0.52, 0.35], { edge: riskOn ? 0xda291c : 0x8ba0b4 });
        tube([[-1.5, 0.24, -0.78], [-0.45, 0.58, -0.25], [0.75, 0.78, 0.3], [1.55, 0.62, 0.82]], pathOn || riskOn ? 0xda291c : 0x1b2a4a, 0.026);
        tor(0.58, 0.025, 0x1b2a4a, [2.15, 0.46, 0.82], [Math.PI / 2, 0, 0]);
        cyl(0.035, 0.86, riskOn ? 0xda291c : 0xffa12b, [2.15, 0.48, 0.82], [0, 0, 0.82]);
        break;
      case 'surveillanceflow':
        miniPerson(-2.25, 0, 0x1b2a4a);
        box(0.16, 1.15, 0.16, 0x1b2a4a, [-1.2, 0.58, -0.36]);
        box(0.16, 1.15, 0.16, 0x1b2a4a, [-1.2, 0.58, 0.36]);
        box(0.14, 0.14, 0.95, 0x1b2a4a, [-1.2, 1.12, 0]);
        cone(0.5, 1.8, riskOn ? 0xda291c : 0xffcc66, [-1.0, 0.58, 0.05], [Math.PI / 2, 0, 0], { opacity: 0.22 });
        box(1.0, 0.7, 0.9, 0x9fdde0, [0.05, 0.46, 0.4], { opacity: 0.42, glass: true, edge: 0x00aeb3 });
        box(0.9, 0.56, 0.76, riskOn ? 0xfbe9ea : 0xffffff, [1.2, 0.36, -0.25], { edge: riskOn ? 0xda291c : 0x8ba0b4 });
        box(1.0, 0.12, 0.75, 0xffffff, [2.2, 0.16, 0.8], { edge: 0x8ba0b4 });
        tube([[-1.78, 0.55, 0], [-0.55, 0.86, 0.22], [0.05, 0.8, 0.4], [0.82, 0.64, -0.12], [1.75, 0.42, 0.65]], pathOn || riskOn ? 0xda291c : 0x1b2a4a, 0.028);
        sph(0.12, riskOn ? 0xda291c : 0xffa12b, [0.05, 0.92, 0.4]);
        break;
      case 'datastory':
        box(1.2, 0.78, 1.0, 0x00aeb3, [-1.3, 0.48, -0.5], { opacity: 0.3, glass: true, edge: 0x00aeb3 });
        for (var ds = 0; ds < 4; ds++) box(0.66, 0.06, 0.42, 0xffffff, [-0.18 + ds * 0.28, 0.23 + ds * 0.13, -0.18 + ds * 0.12], { edge: 0x8ba0b4 });
        tor(0.24, 0.03, 0xffa12b, [0.85, 0.7, 0.2], [0, Math.PI / 2, 0]);
        cyl(0.04, 0.92, 0xffa12b, [1.22, 0.7, 0.2], [0, 0, Math.PI / 2]);
        box(1.02, 0.08, 0.72, riskOn ? 0xfbe9ea : 0xe7f3ec, [1.75, 0.18, 0.6], { edge: riskOn ? 0xda291c : 0x1c7a43 });
        tube([[-0.82, 0.72, -0.5], [0.15, 1.02, 0.0], [1.1, 0.82, 0.28]], pathOn ? 0xda291c : 0x1b2a4a, 0.026);
        break;
      case 'promisefunnel':
        box(1.0, 0.82, 0.82, 0xffffff, [-1.6, 0.48, -0.55], { edge: 0x8ba0b4 });
        sph(0.2, 0x00aeb3, [-1.6, 1.0, -0.55], { opacity: 0.68, glass: true });
        cone(0.92, 1.45, riskOn ? 0xda291c : 0xffcc66, [0, 0.54, 0], [Math.PI, 0, 0], { opacity: riskOn ? 0.42 : 0.24 });
        for (var pf = 0; pf < 7; pf++) sph(0.07, pf > 3 && riskOn ? 0xda291c : 0x00aeb3, [-0.55 + pf * 0.17, 1.05 - pf * 0.08, -0.15 + pf * 0.06]);
        box(1.1, 0.12, 0.75, 0xfbe9ea, [1.75, 0.18, 0.6], { edge: 0xda291c });
        arrow([0.46, 0.42, 0.28], [1.25, 0.28, 0.52], riskOn ? 0xda291c : 0x1b2a4a);
        break;
      case 'thresholdaudit':
        box(4.1, 0.1, 1.05, 0xffffff, [-0.2, 0.12, -0.1], { edge: 0x8ba0b4 });
        for (var th = 0; th < 9; th++) sph(0.08, th > (pathOn ? 4 : 6) ? (riskOn ? 0xda291c : 0xffa12b) : 0x00aeb3, [-1.8 + th * 0.35, 0.32, -0.55 + (th % 2) * 0.28]);
        box(0.12, 1.0, 1.55, riskOn ? 0xda291c : 0x1b2a4a, [0.35, 0.56, 0], { opacity: 0.78 });
        box(0.92, 0.42, 0.7, 0xe7f3ec, [1.25, 0.32, -0.55], { edge: 0x1c7a43 });
        box(0.92, 0.42, 0.7, 0xfbe9ea, [1.8, 0.32, 0.65], { edge: 0xda291c });
        tube([[0.42, 0.5, 0], [1.08, 0.7, -0.45], [1.25, 0.48, -0.55]], 0x1c7a43, 0.022);
        tube([[0.42, 0.5, 0], [1.25, 0.7, 0.5], [1.8, 0.48, 0.65]], riskOn ? 0xda291c : 0x1b2a4a, 0.022);
        break;
      case 'repairtable':
        box(3.2, 0.16, 1.55, 0xe9eef2, [0, 0.14, 0], { edge: 0x8ba0b4 });
        box(0.92, 0.7, 0.76, riskOn ? 0xfbe9ea : 0xffffff, [-1.2, 0.48, -0.25], { edge: riskOn ? 0xda291c : 0x8ba0b4 });
        tube([[-1.54, 0.8, -0.45], [-1.15, 0.45, -0.2], [-0.82, 0.78, 0.05]], 0xda291c, 0.016);
        [[0.2, -0.68], [0.8, 0.62], [1.45, -0.18]].forEach(function (p, rt) { miniPerson(p[0], p[1], rt === 1 ? 0xffa12b : 0x00aeb3); });
        cyl(0.055, 1.05, 0xffa12b, [0.35, 0.4, 0.05], [0, 0, Math.PI / 2]);
        cyl(0.04, 0.95, 0x1b2a4a, [1.15, 0.45, 0.32], [0.35, 0, Math.PI / 2]);
        break;
      case 'futurecompass':
        miniPerson(-2.1, -1.05, 0x1b2a4a);
        box(0.94, 0.1, 0.62, 0xffffff, [-1.35, 0.16, -0.8], { edge: 0x8ba0b4 });
        box(0.94, 0.1, 0.62, 0xe7f3ec, [0, 0.2, 0], { edge: 0x1c7a43 });
        box(0.94, 0.1, 0.62, riskOn ? 0xfbe9ea : 0xffffff, [1.45, 0.24, 0.78], { edge: riskOn ? 0xda291c : 0x8ba0b4 });
        tube([[-1.75, 0.28, -0.95], [-0.72, 0.62, -0.45], [0.2, 0.7, 0.05], [1.25, 0.44, 0.62]], pathOn || riskOn ? 0xda291c : 0x1b2a4a, 0.034);
        cone(0.16, 0.42, pathOn || riskOn ? 0xda291c : 0x1b2a4a, [1.28, 0.44, 0.64], [Math.PI / 2, 0, 0]);
        cyl(0.035, 1.45, 0x1b2a4a, [1.86, 0.82, 0.92]);
        box(0.62, 0.36, 0.06, riskOn ? 0xda291c : 0xffa12b, [2.12, 1.22, 0.92], { edge: 0xffffff });
        miniPerson(0.1, -0.62, 0x00aeb3);
        miniPerson(1.96, 0.22, 0xffa12b);
        break;
      case 'map':
        miniPerson(0, 0, 0x1b2a4a);
        [[-2, -1.3], [0, -1.8], [2, -1.3], [-2.1, 1.1], [0, 1.7], [2.1, 1.1]].forEach(function (p, i) {
          box(0.58, 0.35, 0.5, i === 2 && riskOn ? 0xda291c : 0xffffff, [p[0], 0.22, p[1]], { edge: i === 2 ? 0xda291c : 0x8ba0b4 });
          tube([[p[0], 0.35, p[1]], [0, 0.55, 0]], (i === 2 || pathOn) ? 0xda291c : 0x8ba0b4, 0.018);
        });
        break;
      case 'lens':
        box(1.1, 0.9, 1.1, 0xffffff, [0, 0.46, 0], { edge: 0x8ba0b4 });
        box(0.06, 1.55, 2.9, 0x00aeb3, [-0.28, 0.78, 0], { opacity: 0.28, glass: true, edge: 0x00aeb3 });
        box(2.9, 1.55, 0.06, riskOn ? 0xda291c : 0xffa12b, [0.28, 0.78, 0], { opacity: 0.32, glass: true, edge: riskOn ? 0xda291c : 0xffa12b });
        tor(1.35, 0.025, riskOn ? 0xda291c : 0x1b2a4a, [0, 0.85, 0], [Math.PI / 2, 0, 0]);
        break;
      case 'outcomelens':
        contactShadow(1.74, 0.74, [-2.72, 0, -0.86], { opacity: 0.14 });
        contactShadow(1.74, 0.74, [-2.72, 0, 0.86], { opacity: 0.14 });
        contactShadow(1.1, 2.5, [-0.72, 0, 0], { opacity: 0.18 });
        contactShadow(3.15, 0.78, [1.4, 0, -0.86], { opacity: 0.13 });
        contactShadow(1.7, 0.85, [1.55, 0, 0.86], { opacity: 0.22 });
        paperCard(-2.72, -0.86, 1.62, 0.66, 0x00aeb3);
        paperCard(-2.72, 0.86, 1.62, 0.66, 0xffa12b);
        for (var ol = 0; ol < 6; ol++) {
          sph(0.075, 0x00aeb3, [-3.22 + ol * 0.18, 0.32, -0.92 + (ol % 2) * 0.13], { rough: 0.34, metal: 0.08 });
          sph(0.075, ol > 2 ? 0xda291c : 0xffa12b, [-3.22 + ol * 0.18, 0.32, 0.8 + (ol % 2) * 0.15], { rough: 0.34, metal: 0.08, emissive: ol > 2 && riskOn });
        }
        box(0.18, 1.52, 2.68, 0xffffff, [-0.72, 0.78, 0], { opacity: 0.78, glass: true, transmission: 0.18, clearcoat: true, edge: 0x8ba0b4, rough: 0.2, metal: 0.03 });
        box(0.1, 1.2, 2.28, 0x1b2a4a, [-0.72, 0.72, 0], { opacity: 0.88, edge: 0xffffff, rough: 0.32, metal: 0.12 });
        box(0.08, 0.06, 1.48, 0xffffff, [-0.9, 1.02, 0], { edge: 0xffffff, rough: 0.28 });
        box(0.08, 0.06, 1.48, 0xffffff, [-0.9, 0.82, 0], { edge: 0xffffff, rough: 0.28 });
        box(1.46, 0.08, 2.88, 0x9fdde0, [-0.72, 1.5, 0], { opacity: 0.2, glass: true, transmission: 0.22, clearcoat: true, edge: 0x00aeb3, rough: 0.16 });
        paperCard(1.18, -0.86, 1.72, 0.64, 0x1c7a43);
        decisionMark(2.25, -0.86, true);
        paperCard(0.72, 0.86, 1.16, 0.5, 0xda291c);
        box(0.34, 0.96, 0.9, 0xda291c, [1.58, 0.64, 0.86], { opacity: riskOn ? 0.95 : 0.76, edge: 0xffffff, rough: 0.24, metal: 0.12, emissive: riskOn });
        burdenDiscs(2.02, 0.58, 5);
        decisionMark(1.42, 0.86, false);
        tube([[-1.9, 0.42, -0.86], [-1.12, 0.8, -0.82], [-0.46, 0.64, -0.84], [0.48, 0.42, -0.86], [2.56, 0.34, -0.86]], pathOn ? 0x1c7a43 : 0x8ba0b4, 0.032);
        tube([[-1.9, 0.42, 0.86], [-1.12, 0.8, 0.78], [-0.48, 0.64, 0.84], [0.36, 0.5, 0.86], [1.38, 0.58, 0.86]], pathOn || riskOn ? 0xda291c : 0x8ba0b4, 0.04);
        cone(0.13, 0.35, pathOn ? 0x1c7a43 : 0x8ba0b4, [2.62, 0.34, -0.86], [Math.PI / 2, 0, 0]);
        cone(0.13, 0.35, pathOn || riskOn ? 0xda291c : 0x8ba0b4, [1.4, 0.58, 0.86], [Math.PI / 2, 0, 0]);
        tor(0.48, 0.018, 0x00aeb3, [1.98, 0.54, -0.86], [Math.PI / 2, 0, 0], { opacity: 0.58 });
        tor(0.46, 0.018, 0xffa12b, [1.96, 0.58, 0.74], [Math.PI / 2, 0.12, 0], { opacity: 0.62 });
        for (var ob = 0; ob < 8; ob++) {
          var bx = 1.94 + (ob % 2) * 0.19, bz = 0.54 + Math.floor(ob / 2) * 0.15;
          box(0.17, 0.17, 0.17, 0xda291c, [bx, 0.25 + ob * 0.07, bz], { edge: 0xffffff, emissive: riskOn });
        }
        if (riskOn) {
          tor(0.58, 0.02, 0xda291c, [2.08, 0.88, 0.76], [Math.PI / 2, 0, 0], { opacity: 0.92, emissive: true });
          tor(0.36, 0.018, 0xda291c, [2.34, 0.82, 0.56], [Math.PI / 2, 0.2, 0], { opacity: 0.78, emissive: true });
          box(1.08, 0.06, 0.74, 0xfbe9ea, [2.18, 1.15, 0.72], { edge: 0xda291c });
        }
        break;
      case 'pipeline':
        rowBlocks(5, 0x00aeb3, riskOn ? 3 : -1);
        break;
      case 'switches':
        box(3.8, 0.18, 1.8, 0xffffff, [0, 0.08, 0], { edge: 0x8ba0b4 });
        for (var si = 0; si < 4; si++) {
          var on = si < (pathOn ? 3 : 1);
          cyl(0.12, 0.65, on && (riskOn || si === 2) ? 0xda291c : 0x1b2a4a, [-1.35 + si * 0.9, 0.42, 0], [0.78, 0, 0]);
          sph(0.17, on ? 0xffa12b : 0xc7cdd6, [-1.35 + si * 0.9, 0.75, -0.28]);
        }
        arrow([1.55, 0.32, 0], [2.45, 0.32, 0], riskOn ? 0xda291c : 0x1b2a4a);
        break;
      case 'audit':
        [[-0.9, -0.75], [0.9, -0.75], [-0.9, 0.75], [0.9, 0.75]].forEach(function (p, i) {
          var hot = i === 3;
          box(1.25, 0.12, 0.92, hot && riskOn ? 0xff8a65 : 0x9fdde0, [p[0], 0.1, p[1]], { opacity: hot ? 0.48 : 0.28, glass: true, edge: hot ? 0xda291c : 0x00aeb3 });
          for (var ai = 0; ai < 16; ai++) {
            var x = p[0] - 0.42 + (ai % 4) * 0.28, z = p[1] - 0.28 + Math.floor(ai / 4) * 0.18;
            sph(0.045, 0xe9dfcc, [x, 0.25, z]);
            if (hot && ai < (riskOn ? 8 : 3)) cyl(0.018, 0.38, 0xda291c, [x, 0.54, z]);
          }
        });
        tor(1.9, 0.02, riskOn ? 0xda291c : 0x1b2a4a, [0, 0.82, 0], [Math.PI / 2, 0, 0], { opacity: 0.75 });
        break;
      case 'gate':
        box(0.14, 1.4, 0.14, 0x1b2a4a, [-1.1, 0.62, 0]);
        box(0.14, 1.4, 0.14, 0x1b2a4a, [1.1, 0.62, 0]);
        box(2.34, 0.14, 0.14, 0x1b2a4a, [0, 1.3, 0]);
        miniPerson(-2.2, 0, 0x00aeb3); miniPerson(2.2, 0, 0xffa12b);
        cone(0.7, 2.4, riskOn ? 0xda291c : 0xffcc66, [0, 0.62, 0.12], [Math.PI / 2, 0, 0], { opacity: 0.2 });
        arrow([-1.75, 0.35, 0], [1.75, 0.35, 0], riskOn ? 0xda291c : 0x1b2a4a);
        break;
      case 'review':
        for (var ri = 0; ri < 6; ri++) {
          var ang = -1.85 + ri * 0.74, x2 = Math.cos(ang) * 1.65, z2 = Math.sin(ang) * 1.05;
          box(0.48, 0.36, 0.48, ri === 5 && riskOn ? 0xda291c : 0xffffff, [x2, 0.2 + ri * 0.04, z2], { edge: 0x8ba0b4 });
          if (ri) tube([[Math.cos(ang - 0.74) * 1.65, 0.32, Math.sin(ang - 0.74) * 1.05], [x2, 0.32 + ri * 0.04, z2]], pathOn ? 0xda291c : 0x8ba0b4, 0.018);
        }
        tor(1.75, 0.02, 0x1b2a4a, [0, 0.48, 0], [Math.PI / 2, 0, 0], { opacity: 0.38 });
        break;
      case 'vault':
        box(1.45, 1.15, 1.15, 0x00aeb3, [-0.65, 0.62, 0], { opacity: 0.28, glass: true, edge: 0x00aeb3 });
        box(0.22, 0.5, 1.0, riskOn ? 0xda291c : 0x1b2a4a, [-0.65, 0.62, 0]);
        for (var vi = 0; vi < 4; vi++) box(0.72, 0.05, 0.42, 0xffffff, [1.05, 0.22 + vi * 0.18, -0.45 + vi * 0.3], { edge: 0x8ba0b4 });
        cyl(0.05, 1.1, 0xffa12b, [0.45, 0.75, 0.9], [0, 0, Math.PI / 2]);
        tor(0.22, 0.035, 0xffa12b, [1.05, 0.75, 0.9], [0, Math.PI / 2, 0]);
        break;
      case 'benevolence':
        box(1.55, 0.85, 1.15, 0xffffff, [0, 0.52, -0.38], { edge: 0x8ba0b4 });
        sph(0.28, 0x00aeb3, [0, 1.08, -0.38], { opacity: 0.72, glass: true });
        cone(0.85, 1.25, riskOn ? 0xda291c : 0xffa12b, [0, 0.48, 0.82], [Math.PI, 0, 0], { opacity: riskOn ? 0.5 : 0.24 });
        miniPerson(-1.7, 0.82, 0x1b2a4a); miniPerson(1.7, 0.82, 0x1b2a4a);
        break;
      case 'sorting':
        for (var li = 0; li < 3; li++) {
          box(4.6, 0.04, 0.09, li === 2 && riskOn ? 0xda291c : 0x8ba0b4, [0, 0.07, -0.9 + li * 0.9]);
          for (var ti = 0; ti < 4; ti++) sph(0.09, li === 2 && ti > 1 ? 0xda291c : 0x00aeb3, [-1.8 + ti * 0.55, 0.22, -0.9 + li * 0.9]);
        }
        box(0.18, 1.1, 2.35, 0x1b2a4a, [0.85, 0.55, 0]);
        arrow([1.1, 0.35, 0], [2.2, 0.35, riskOn ? 0.9 : 0], riskOn ? 0xda291c : 0x1b2a4a);
        break;
      case 'repair':
        box(1.25, 1.0, 1.05, riskOn ? 0xda291c : 0xffffff, [-0.5, 0.55, 0], { edge: riskOn ? 0xda291c : 0x8ba0b4, opacity: 0.88 });
        tube([[-1.0, 0.95, -0.35], [-0.55, 0.58, 0.1], [-0.1, 0.95, 0.35]], 0x1b2a4a, 0.018);
        [[1.1, -0.8], [1.65, 0], [1.1, 0.8]].forEach(function (p) { miniPerson(p[0], p[1], 0x00aeb3); });
        box(0.72, 0.14, 0.26, 0xffa12b, [0.95, 0.23, -0.1]); cyl(0.05, 0.75, 0xffa12b, [1.25, 0.32, -0.1], [0, 0, Math.PI / 2]);
        break;
      case 'policy':
        ['system', 'institution', 'law', 'rights'].forEach(function (name, pi) {
          box(2.6 - pi * 0.26, 0.22, 1.55 - pi * 0.14, pi === 2 && riskOn ? 0xda291c : [0x9fdde0, 0x00aeb3, 0xffa12b, 0x1b2a4a][pi], [0, 0.13 + pi * 0.28, 0], { opacity: pi === 3 ? 0.88 : 0.72, glass: pi < 2, edge: 0xffffff });
        });
        arrow([-2, 0.18, 0], [-1.42, 1.05, 0], pathOn ? 0xda291c : 0x1b2a4a);
        break;
      case 'return':
        for (var rr = 0; rr < 18; rr++) {
          var a = rr * 0.48, rad = 0.25 + rr * 0.07;
          sph(0.055, rr > 13 && riskOn ? 0xda291c : 0x00aeb3, [Math.cos(a) * rad, 0.2 + rr * 0.035, Math.sin(a) * rad]);
        }
        box(0.85, 0.08, 0.62, 0xffffff, [-1.8, 0.12, -1.05], { edge: 0x8ba0b4 });
        box(0.85, 0.08, 0.62, 0xffffff, [1.8, 0.9, 1.05], { edge: 0xda291c });
        break;
      case 'compass':
        tor(1.35, 0.035, 0x1b2a4a, [0, 0.35, 0], [Math.PI / 2, 0, 0]);
        cyl(0.035, 1.95, riskOn ? 0xda291c : 0xffa12b, [0, 0.5, 0], [0, 0, 0.85]);
        cone(0.18, 0.42, riskOn ? 0xda291c : 0xffa12b, [0.67, 0.5, 0.75], [0, 0, -0.75]);
        [[-1.8, -1.05], [0, 1.65], [1.8, -1.05]].forEach(function (p, ci) { box(0.7, 0.46, 0.7, ci === 2 && riskOn ? 0xda291c : 0xffffff, [p[0], 0.28, p[1]], { edge: ci === 2 ? 0xda291c : 0x8ba0b4 }); });
        break;
      default:
        rowBlocks(4, 0x00aeb3, riskOn ? 2 : -1);
    }
    var fr0 = (window.BFS218_HOLO && window.BFS218_HOLO.frame) ? window.BFS218_HOLO.frame(kind, false) : null;
    var target = (riskOn && fr0 && fr0.swingRisk)
      ? { x: fr0.swingRisk[0], y: fr0.swingRisk[1] }
      : { x: pathOn ? -0.02 : (riskOn ? -0.52 : -0.28), y: pathOn ? 0.42 : (riskOn ? -1.05 : -0.5) };
    var cur = { x: target.x, y: target.y }, dragging = false, last = null, animating = false, frames = 0;
    var view0 = { x: target.x, y: target.y };
    var zoom = 1, pinchD = 0, wheelArmed = false;
    var baseCam = new THREE.Vector3(4.8, 3.4, 6.6), baseLook = new THREE.Vector3(0, 0.55, 0), camTmp = new THREE.Vector3();
    function applyZoom() {
      camTmp.copy(baseCam).sub(baseLook).multiplyScalar(1 / zoom);
      camera.position.copy(baseLook).add(camTmp);
      camera.lookAt(baseLook);
    }
    function zoomBy(f) { zoom = Math.max(0.55, Math.min(2.4, zoom * f)); applyZoom(); frames = 0; schedule(); }
    function schedule() { if (!animating) { animating = true; requestAnimationFrame(animate); } }
    function begin(x, y) { dragging = true; last = { x: x, y: y }; frames = 0; schedule(); }
    function move(x, y) {
      if (!dragging || !last) return;
      target.y += (x - last.x) * 0.014;
      target.x += (y - last.y) * 0.008;
      target.x = Math.max(-0.65, Math.min(0.35, target.x));
      last = { x: x, y: y };
      canvas.setAttribute('data-dragged', '1');
      schedule();
    }
    function up() { dragging = false; last = null; frames = 0; schedule(); }
    function onPointer(e) { begin(e.clientX, e.clientY); if (e.currentTarget && e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId); }
    function movePointer(e) { move(e.clientX, e.clientY); }
    function pinchDist(t) { var dx = t[0].clientX - t[1].clientX, dy = t[0].clientY - t[1].clientY; return Math.sqrt(dx * dx + dy * dy) || 1; }
    function onTouchStart(e) {
      if (e.touches && e.touches.length === 2) { e.preventDefault(); pinchD = pinchDist(e.touches); dragging = false; return; }
      if (e.touches && e.touches[0]) { e.preventDefault(); begin(e.touches[0].clientX, e.touches[0].clientY); }
    }
    function onTouchMove(e) {
      if (e.touches && e.touches.length === 2 && pinchD) { e.preventDefault(); var pd = pinchDist(e.touches); zoomBy(pd / pinchD); pinchD = pd; return; }
      if (e.touches && e.touches[0]) { e.preventDefault(); move(e.touches[0].clientX, e.touches[0].clientY); }
    }
    function onWheel(e) {
      if (!wheelArmed && !e.ctrlKey) return;
      e.preventDefault();
      zoomBy(e.deltaY < 0 ? 1.12 : 0.89);
    }
    canvas.addEventListener('pointerdown', onPointer);
    canvas.addEventListener('pointermove', movePointer);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', up);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('pointerdown', function () { wheelArmed = true; });
    canvas.addEventListener('pointerleave', function () { wheelArmed = false; });
    canvas.__camApi = {
      zoom: function (dir) { zoomBy(dir > 0 ? 1.18 : 0.85); },
      spin: function (dir) { target.y += dir * 0.45; canvas.setAttribute('data-dragged', '1'); frames = 0; schedule(); },
      reset: function () {
        zoom = 1; target.x = view0.x; target.y = view0.y;
        applyZoom(); frames = 0;
        canvas.removeAttribute('data-dragged');
        schedule();
      }
    };
    var reduced = false;
    try { reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    function resize() {
      var wd = Math.max(320, shell.clientWidth || canvas.clientWidth || 720);
      var focusModel = kind === 'outcomelens' || kind === 'mechanismatch';
      var narrow = wd <= 520;
      var ht = focusModel && narrow ? 430 : Math.max(300, Math.round(wd * 0.56));
      if (holo && window.BFS218_HOLO && window.BFS218_HOLO.frame) {
        var hf = window.BFS218_HOLO.frame(kind, narrow);
        root.scale.set(hf.scale, hf.scale, hf.scale);
        root.position.set(0, -0.02, 0);
        baseCam.set(hf.cam[0], hf.cam[1], hf.cam[2]);
        baseLook.set(hf.look[0], hf.look[1], hf.look[2]);
      } else if (focusModel && narrow) {
        root.scale.set(0.82, 0.82, 0.82);
        root.position.set(0, 0.04, 0);
        baseCam.set(5.6, 3.8, 8.2);
        baseLook.set(0, 0.6, 0);
      } else if (focusModel) {
        root.scale.set(0.76, 0.76, 0.76);
        root.position.set(0, -0.34, 0);
        baseCam.set(4.9, 3.5, 7.1);
        baseLook.set(0, 0.32, 0);
      } else {
        root.scale.set(0.9, 0.9, 0.9);
        root.position.set(0, -0.05, 0);
        baseCam.set(4.8, 3.4, 6.6);
        baseLook.set(0, 0.55, 0);
      }
      applyZoom();
      renderer.setSize(wd, ht, false);
      camera.aspect = wd / ht;
      camera.updateProjectionMatrix();
      updateTopicLabels();
    }
    resize();
    var ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(shell);
    var disposed = false;
    var inView = true;
    var io = null;
    if (holo && window.IntersectionObserver) {
      io = new IntersectionObserver(function (entries) {
        inView = !!(entries[0] && entries[0].isIntersecting);
        if (inView) schedule();
      }, { threshold: 0.05 });
      io.observe(canvas);
    }
    function cleanupTopicModel() {
      if (disposed) return;
      disposed = true;
      if (ro) ro.disconnect();
      if (io) io.disconnect();
      canvas.removeEventListener('pointerdown', onPointer);
      canvas.removeEventListener('pointermove', movePointer);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', up);
      canvas.removeEventListener('wheel', onWheel);
      canvas.__camApi = null;
      if (holo && holo.dispose) { try { holo.dispose(); } catch (e) {} }
      disposeThreeScene(scene);
      renderer.dispose();
      if (renderer.forceContextLoss) renderer.forceContextLoss();
      canvas.__topicGL = null;
    }
    if (holo && holo.pickMeshes && holo.pickMeshes.length) {
      var pickDown = null;
      var pickCaster = new THREE.Raycaster();
      var pickVec = new THREE.Vector2();
      canvas.addEventListener('pointerdown', function (e) { pickDown = [e.clientX, e.clientY]; }, true);
      canvas.addEventListener('click', function (e) {
        if (pickDown && (Math.abs(e.clientX - pickDown[0]) > 7 || Math.abs(e.clientY - pickDown[1]) > 7)) return;
        var r = canvas.getBoundingClientRect();
        pickVec.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        pickVec.y = -((e.clientY - r.top) / r.height) * 2 + 1;
        pickCaster.setFromCamera(pickVec, camera);
        var hits = pickCaster.intersectObjects(holo.pickMeshes.map(function (pm) { return pm.mesh; }), false);
        if (!hits.length) return;
        var first = hits[0].object;
        for (var pi = 0; pi < holo.pickMeshes.length; pi++) {
          if (holo.pickMeshes[pi].mesh === first) { SOC.expPick(week, holo.pickMeshes[pi].idx); break; }
        }
      });
    }
    registerModelCleanup(cleanupTopicModel);
    function animate() {
      if (!canvas.isConnected || canvas.__topicStamp !== auditRenderStamp) {
        cleanupTopicModel();
        animating = false;
        return;
      }
      frames++;
      if (!dragging && !reduced && frames < 150) target.y += 0.0015 + (week % 3) * 0.0004;
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      root.rotation.x = cur.x;
      root.rotation.y = cur.y;
      if (holo && holo.tick && !reduced) holo.tick(performance.now() / 1000);
      renderer.render(scene, camera);
      updateTopicLabels();
      var holoLive = holo && inView && !reduced;
      if (!window.__HOLO_FREEZE && (dragging || frames < 180 || holoLive)) requestAnimationFrame(animate);
      else animating = false;
    }
    schedule();
  }
  function assignmentWeekEvents(w) {
    var items = assignmentsData();
    var byId = {};
    items.forEach(function (item) { byId[item.id] = item; });
    var events = [
      {
        week: 2,
        id: 'map-exchange',
        focus: 'Begin collecting one small observation each week. Look for an ordinary digital system that sorts, scores, verifies, watches, delays, or protects people.'
      },
      {
        week: 6,
        id: 'coded-encounter',
        focus: 'Complete Weeks 2 to 6 before you begin. Review the concept trail, then take the timed Compass Check in Blackboard and reflect on your own choices.'
      },
      {
        week: 6,
        id: 'case-file',
        focus: 'Move from a personal example to a documented Canadian system. Start gathering public evidence before forming your claim.'
      },
      {
        week: 11,
        id: 'repair',
        focus: 'Return to one harm you can explain clearly. Your task is to design a repair that changes a rule, process, review step, or accountability path.'
      },
      {
        week: 13,
        id: 'cartography',
        focus: 'Pull together the map you have been building across the term. Show what you now notice, what changed, and what responsibility follows.'
      }
    ];
    return events.filter(function (event) { return event.week === w; }).map(function (event) {
      return Object.assign({}, event, byId[event.id] || {});
    }).filter(function (event) { return event.title; });
  }

  function weekAssignmentNotice(w) {
    var events = assignmentWeekEvents(w);
    if (!events.length) return '';
    return '<section class="week-assignment-note" id="wk-asg">'
      + '<div class="mono">BLACKBOARD ASSIGNMENT TIMING</div>'
      + '<h2>This week in the assignment arc</h2>'
      + events.map(function (event) {
        return '<article>'
          + '<div><span>Opened on Blackboard</span><strong>' + esc(event.title) + ': ' + esc(assignmentDateLabel(event.release)) + '</strong></div>'
          + '<p><b>Due:</b> ' + esc(event.due) + '</p>'
          + '<p><b>Use this week to:</b> ' + esc(event.focus) + '</p>'
          + '</article>';
      }).join('')
      + '<div style="display:flex;gap:9px;flex-wrap:wrap;align-items:center"><button type="button" onclick="SOC.go(\'assignments\')">Open Assignments Guide</button>'
      + '<a href="' + BB_URL + '" target="_blank" rel="noopener" style="font-size:.8125rem;font-weight:700;color:#fff;background:#1B2A4A;border-radius:9px;padding:9px 14px;text-decoration:none">Open Blackboard <span aria-hidden="true">&#8599;</span></a>'
      + '<a href="' + ICS_PATH + '" download style="font-size:.8125rem;font-weight:700;color:#1B2A4A;background:#fff;border:1px solid #1B2A4A;border-radius:9px;padding:8px 14px;text-decoration:none">Add dates to calendar</a></div>'
      + '</section>';
  }

  function weekPage(w, d) {
    var ws = journeyWeeks(), idx = ws.indexOf(w), prev = idx > 0 ? ws[idx - 1] : null, next = idx < ws.length - 1 ? ws[idx + 1] : null;
    var sec = function (id, title, inner) { return '<section id="wk-' + id + '" class="node"><h2 class="wk-sec">' + esc(title) + '</h2>' + inner + '</section>'; };
    var hero = weekHero(w, d, { label: 'TEACHING WEEK', route: ['Read', 'See', 'Try', 'Reflect'], startPart: 'read', startLabel: 'Start with readings' });
    var path = weekLearningPath(w, d);
    var VID = window.BFS218_VIDEOS && window.BFS218_VIDEOS[w];
    var vid = weekVideoSection(w, d, VID);
    var pre = sec('pre', 'Before you begin', '<p class="wk-hint">A quick read on where your understanding sits right now, no grade. Rate each idea, then meet them again at the end to see how far your thinking moves.</p>' + wkChecks(w, 'pre', d));
    var purpose = '<section id="wk-learn" class="node"><h2 class="wk-sec">Purpose</h2><p style="margin:0">' + esc(d.purpose) + '</p></section>';
    var outcomes = sec('out', 'Learning outcomes', '<p style="margin:0 0 8px;font-size:.9rem">By the end of this week, you will be able to:</p>' + d.outcomes.map(function (o) { return '<div class="wk-oc"><span class="b"></span>' + esc(o) + '</div>'; }).join(''));
    var guiding = sec('gq', 'Guiding questions', '<p style="margin:0 0 8px;font-size:.9rem">Hold these in mind as you work:</p>' + d.guiding.map(function (q) { return '<div class="wk-gq"><span class="q">+</span>' + esc(q) + '</div>'; }).join(''));
    var assignmentTiming = weekAssignmentNotice(w);
    var programLens = lensProgramSection(w, d);
    var programCase = lensCaseStudySection(w, d);
    var fldEg = '';
    try {
      var fld = selField(state.programViewField || state.careerField || '');
      var bf = window.BFS218_CAREER && window.BFS218_CAREER.byField;
      if (fld && bf && bf[fld] && bf[fld].lens) {
        fldEg = '<div class="wk-concept" style="border-left:4px solid #1B2A4A;padding-left:12px"><h3>Through your ' + esc(fld) + ' lens</h3><p>' + esc(bf[fld].lens) + ' Hold each concept above against that question: where would it show up in your field this week?</p></div>';
      }
    } catch (efe) {}
    var concepts = sec('con', 'Key concepts', '<p class="wk-hint">These are the week\'s big ideas, explained. Read them to understand the argument; this is what your discussions and written work draw on.</p>' + d.concepts.map(function (c) {
      var fe = '';
      var fer = fieldExampleFor(w, c.h);
      if (fer) fe = '<div class="wk-concept" style="border-left:4px solid #B02318;padding-left:12px;margin-top:8px"><div class="mono" style="font-size:.64rem;letter-spacing:.08em;color:#B02318;font-weight:700;margin-bottom:3px">IN ' + esc(fer.label).toUpperCase() + '</div><p style="margin:0">' + esc(fer.text) + '</p></div>'; return '<div class="wk-concept"><h3>' + esc(c.h) + '</h3><p>' + esc(c.body) + ' <span class="wk-cite">(' + esc(c.cite) + ')</span></p></div>' + fe; }).join('') + fldEg);
    var terms = sec('term', 'Key terms', '<p class="wk-hint">These are the precise vocabulary. Learn them to speak and write accurately; they feed the flashcards and Knowledge Check.</p>' + d.terms.map(function (t) {
      var te = '';
      var ter = fieldExampleFor(w, 'term:' + t.term);
      if (ter) te = '<div style="border-left:4px solid #B02318;padding:6px 0 6px 12px;margin:6px 0 2px"><div class="mono" style="font-size:.64rem;letter-spacing:.08em;color:#B02318;font-weight:700;margin-bottom:3px">IN ' + esc(ter.label).toUpperCase() + '</div><p style="margin:0;font-size:.9rem;line-height:1.55">' + esc(ter.text) + '</p></div>';
      return '<div class="wk-term"><b>' + esc(t.term) + '</b>: ' + esc(t.def) + ' <span class="wk-cite">(' + esc(t.cite) + ')</span>' + te + '</div>'; }).join(''));
    var readingsInner = d.readings.map(function (r) { var resolves = (typeof rec === 'function') && r.id && rec(r.id); var tail = resolves ? '<button onclick="SOC.read(\'' + r.id + '\')" class="wk-scope">' + esc(r.scope || 'Open the reading') + ' &#8599;</button>' : (r.url ? '<a href="' + r.url + '" target="_blank" rel="noopener" class="wk-scope">' + esc(r.scope || 'Open the reading') + ' &#8599;</a>' : (r.scope ? '<div class="wk-scope" style="background:none;border:none;color:var(--ink-faint);padding:6px 0;cursor:default">' + esc(r.scope) + '</div>' : '')); return '<div class="wk-read"><div class="ref">' + r.apa + '</div>' + tail + '</div>'; }).join('')
      + weekNoteBox(w, 'readings', 'Readings Notes', 'After the reading or Reading Rescue, write the one idea you want to remember and where you saw it.');
    var rescue = readingRescueSection(w, d);
    var readings = sec('read', 'Readings', readingsInner + rescue);
    var audioPk = audioPackSection(w);
    var visual = visualOverviewSection(w, d);
    var watch = d.deck ? '<section id="wk-watch" class="node"><h2 class="wk-sec">Walkthrough</h2><p style="margin:0 0 12px;font-size:.92rem">A short, immersive walk through this week\'s core idea, with its diagrams. Step through it right here at your own pace.</p><button type="button" class="wk-cta" style="margin:0 0 4px" onclick="SOC.playWalk(' + w + ')">Play the walkthrough</button>' + weekNoteBox(w, 'walkthrough', 'Walkthrough Notes', 'Write one thing the walkthrough made clearer, or one question you still have.') + '</section>' : '';
    var act = '<section id="wk-do" class="node interactive"><h2 class="wk-sec">The activity: ' + esc(d.activity.title) + '</h2><div class="wk-whatwhy"><b>What this is:</b> ' + esc(d.activity.what) + '<br><br><b>Why you are doing it:</b> ' + esc(d.activity.why) + '</div>' + activityStartGuide(w) + lensActivityBlock(w, d.activity, false) + '<button onclick="SOC.startActivity(\'' + d.activity.screen + '\',' + w + ')" class="wk-cta">Start the activity' + ic('chevron', 17, 2.4) + '</button><p style="margin:10px 0 0;font-size:.74rem;color:var(--ink-faint)">Each activity gives you a guided model first, then a specific set of choices or checks. Read the short guide before you click.</p>' + weekNoteBox(w, 'activity', 'Activity Notes', 'After trying the activity, write what the model or feedback helped you notice.') + '</section>';
    var reflect = '<section id="wk-reflect" class="node"><h2 class="wk-sec">Reflection</h2>'
      + '<div class="wk-ocheck"><div class="mono" style="font-size:.78rem;font-weight:700;color:var(--ink-faint);margin-bottom:7px">YOU CAN NOW</div>' + d.youcan.map(function (y) { return '<div class="wk-row"><span class="t">' + ic('check', 14, 2.6) + '</span>' + esc(y) + '</div>'; }).join('') + '</div>'
      + '<h3 style="margin:16px 0 4px">Now, what do you think?</h3><p class="wk-hint" style="margin-bottom:8px">The same ideas from the start. Rate them again to see where your understanding sits now, and how far it moved.</p>' + wkChecks(w, 'post', d)
      + '<h3 style="margin:16px 0 4px">Your reflection</h3><p style="margin:0 0 8px;font-size:.95rem">' + esc(d.reflectPrompt) + '</p>'
      + '<textarea oninput="SOC.wkReflect(' + w + ',this.value)" class="wk-ta" placeholder="Your reflection...">' + esc(state.wkReflect[w] || '') + '</textarea>'
      + weekNoteBox(w, 'revisit', 'What I Still Need to Revisit', 'Name anything you want to return to before the assessment or discussion.')
      + '</section>';
    var notes = '<section id="wk-notes" class="node"><h2 class="wk-sec">Generate Your Weekly Notes</h2>'
      + '<div class="wk-savebox" style="margin-top:0"><h3>Your organized Week ' + w + ' record</h3><p style="margin:0 0 4px;font-size:.9rem">This makes one Word file (.docx) on Seneca letterhead. It organizes your notes and private practice results so you can review them before Blackboard work.</p><ul><li>your notes from readings, visuals, walkthrough, activity, media, and reflection</li><li>your before-and-after understanding check</li><li>your activity, knowledge-check, and reading-comprehension practice results</li></ul><button onclick="SOC.saveWeek(' + w + ')" class="wk-save">Generate Your Weekly Notes</button></div>'
      + '</section>';
    var navRow = '<div style="display:flex;gap:12px;margin-top:18px;flex-wrap:wrap">'
      + (prev != null ? '<button onclick="SOC.station(' + prev + ')" style="flex:1;min-width:180px;text-align:left;border:1px solid var(--border);background:#fff;border-radius:12px;padding:13px 16px;cursor:pointer"><div class="mono" style="font-size:.66rem;color:var(--ink-faint)">&larr; PREVIOUS</div><div style="font-size:.92rem;font-weight:700;color:var(--ink);margin-top:2px">Week ' + prev + ': ' + esc(weekTitle(prev)) + '</div></button>' : '')
      + (next != null ? '<button onclick="SOC.station(' + next + ')" style="flex:1;min-width:180px;text-align:right;border:1px solid var(--border);background:#fff;border-radius:12px;padding:13px 16px;cursor:pointer"><div class="mono" style="font-size:.66rem;color:var(--red)">NEXT &rarr;</div><div style="font-size:.92rem;font-weight:700;color:var(--ink);margin-top:2px">Week ' + next + ': ' + esc(weekTitle(next)) + '</div></button>' : '')
      + '</div>';
    var sg = sgSection(w).html;
    var kcR = kcSection(w);
    var kc = kcR.html, kcItems = kcR.items;
    var rail = '<aside class="wk-rail"><div class="wk-railbox"><div class="wk-railh">IN THIS WEEK</div>'
      + [['ov', 'Overview'], ['path', 'Your learning path']].concat(assignmentTiming ? [['asg', 'Assignment dates']] : []).concat([['vid', 'This week in 80 seconds']]).concat([['pre', 'Before you begin'], ['learn', 'Purpose'], ['out', 'Learning outcomes'], ['gq', 'Guiding questions']]).concat(audioPk ? [['audio', 'Listen to this week']] : []).concat(programLens ? [['lens', 'For your program']] : []).concat([['con', 'Key concepts'], ['term', 'Key terms'], ['read', 'Readings']]).concat(visual ? [['visual', 'A Visual Overview']] : []).concat(d.deck ? [['watch', 'Walkthrough']] : []).concat(programCase ? [['case', 'Case study']] : []).concat([['do', 'The activity'], ['reflect', 'Reflection']]).concat(sg ? [['sg', 'Study Guide']] : []).concat(kcItems.length ? [['kc', 'Knowledge Check']] : []).concat([['notes', 'Generate notes']]).map(function (it) { return '<a href="#wk-' + it[0] + '"><span class="s"></span>' + it[1] + '</a>'; }).join('')
      + '<div class="wk-railt">Flexible pacing</div></div></aside>';
    var collBar = '<div class="wk-coll-bar" role="group" aria-label="Section display controls"><button type="button" onclick="SOC.wkCollAll(' + w + ',1)">Collapse all sections</button><span>Weeks start folded so you can see the whole map. Up to two sections stay open at once; opening a third closes the earliest one. Sections fold again when you leave the week.</span></div>';
    return '<div class="rise wk-page">' + mobileWeekActions(w, d) + hero + path + '<div class="wk-grid"><section>' + collBar + assignmentTiming + vid + pre + purpose + outcomes + guiding + audioPk + programLens + concepts + terms + readings + visual + watch + programCase + act + reflect + sg + kc + notes + navRow + '</section>' + rail + '</div></div>';
  }
  function weekHero(w, d, opt) {
    d = d || {};
    opt = opt || {};
    var route = opt.route || ['Read', 'See', 'Try', 'Reflect'];
    var routeHtml = route.map(function (x, i) { return '<span><b>' + (i + 1) + '</b>' + esc(x) + '</span>'; }).join('');
    var startPart = opt.startPart || 'path';
    var startLabel = opt.startLabel || 'Start this week';
    var sub = opt.sub || d.overview || '';
    var q = opt.question === false ? '' : (opt.question || journeyQ(w));
    return '<section id="wk-ov" class="node jhero jfade wk-hero2">'
      + '<img class="wk-hero-img" src="images/weeks/week' + (w < 10 ? '0' : '') + w + '.jpg" alt="' + esc(weekTitle(w)) + '" loading="lazy" onerror="this.remove()">'
      + '<div class="wk-hero-main"><div class="mono wk-hero-kicker">WEEK ' + w + ' | ' + esc(weekDate(w)) + ' | ' + esc(opt.label || 'WEEKLY MODULE') + '</div>'
      + '<h1>' + esc(opt.title || weekTitle(w)) + '</h1>'
      + (sub ? '<p>' + esc(sub) + '</p>' : '')
      + (q ? '<div class="wk-hero-question">' + esc(q) + '</div>' : '')
      + '<div class="wk-hero-actions"><button type="button" onclick="SOC.jumpWeek(' + w + ',\'' + startPart + '\')">' + esc(startLabel) + '</button><span>Work in manageable blocks. Use breaks, accessibility tools, and approved accommodations as needed.</span></div></div>'
      + '<aside class="wk-hero-route" aria-label="Weekly route"><div class="mono">MODULE ROUTE</div>' + routeHtml + '</aside>'
      + '</section>';
  }
  function pathwaysPage() {
    var route = function (kind, title, subtitle, steps) {
      return '<section class="path-route path-' + kind + '"><div class="path-route-head"><div class="mono">' + esc('YOUR WEEKLY RHYTHM') + '</div><h2>' + esc(title) + '</h2><p>' + esc(subtitle) + '</p></div>'
        + '<ol>' + steps.map(function (s, i) { return '<li><span>' + (i + 1) + '</span><div><b>' + esc(s[0]) + '</b><em>' + esc(s[1]) + '</em><p>' + esc(s[2]) + '</p></div></li>'; }).join('') + '</ol></section>';
    };
    var asyncSteps = [
      ['Start', 'Weekly page', 'Work through the module in order.'],
      ['Learn', 'Walkthrough plus readings', 'Use the walkthrough as your lecture, then anchor it in the readings.'],
      ['Practise', 'Activity and checks', 'Use the activity, Reading Practice, flashcards, and Knowledge Check as private rehearsal.'],
      ['Capture', 'Notes as you go', 'Write in the note boxes while your thinking is fresh.'],
      ['Finish', 'Generate notes', 'Download one organized weekly record for review and Blackboard preparation.']
    ];
    return '<div class="rise path-page">'
      + '<section class="path-hero"><div><div class="mono">HOW EACH WEEK WORKS</div><h1>The weekly page is your classroom</h1><p>There is no live class. Each week is a complete, self-paced learning room. Here is how to move through it, at your own speed.</p></div></section>'
      + '<section class="path-summary"><div><span class="path-mark">1</span><b>Everything is here</b><p>Readings, walkthrough, activity, and concepts, all in the weekly page.</p></div><div><span class="path-mark">2</span><b>Your own pace</b><p>Move ahead or catch up. The only fixed points are the two due dates.</p></div><div><span class="path-mark">3</span><b>One weekly record</b><p>Each week ends with Generate Your Weekly Notes.</p></div></section>'
      + '<div class="path-routes">' + route('async', 'The weekly rhythm', 'Five moves, every week.', asyncSteps) + '</div>'
      + '<section class="path-close"><h2>Where to start</h2><p>Enter the Week 2 learning room and work through the whole module. Use the walkthrough from inside the week whenever you want an idea explained again. When you are ready, plan the graded work.</p><div class="path-actions"><button type="button" class="primary" onclick="SOC.station(2)"><b>Enter Week 2 Learning Room</b><small>Start the full module.</small></button><button type="button" onclick="SOC.assignmentPage(\'program\')"><b>Understand your Program\'s Connection to the Course</b><small>Preview field examples.</small></button><button type="button" onclick="SOC.careerChoices()"><b>Career Choices</b><small>See how BFS218 connects to your path.</small></button><button type="button" class="guide" onclick="SOC.assignmentPage(\'assignments\')"><b>Starting Your Assignment</b><small>Plan the graded work.</small></button></div></section>'
      + '</div>';
  }
  /* ---------- generic week activities: match / scenario / toggle / assemble / lab ---------- */
  function actCard(inner) { return '<div style="background:#fff;border:1px solid var(--border);border-radius:12px;padding:16px 18px;margin:0 0 12px">' + inner + '</div>'; }
  function actCite(c) { return c ? '<div style="font-size:.74rem;color:var(--ink-faint);margin-top:6px">(' + esc(c) + ')</div>' : ''; }
  function actBadge(harm) { return harm ? '<span style="display:inline-block;background:#FBE9EA;color:#B11722;font-size:.7rem;font-weight:700;border-radius:999px;padding:2px 9px;margin-left:8px">leads to harm</span>' : '<span style="display:inline-block;background:#E7EEFB;color:#1B2A4A;font-size:.7rem;font-weight:700;border-radius:999px;padding:2px 9px;margin-left:8px">reduces harm</span>'; }
  function actCaseBox(label, txt) { return txt ? '<div style="background:#15171C;color:#fff;border-radius:12px;padding:14px 18px;margin:0 0 16px"><div style="font-size:.7rem;font-weight:700;color:#F2A900;margin-bottom:4px">' + label + '</div><div style="font-size:.98rem;line-height:1.5">' + esc(txt) + '</div></div>' : ''; }
  function actMatch(w, a) {
    var d = a.data || {}, pairs = d.pairs || [], uniq = [], seen = {};
    pairs.forEach(function (p) { if (!seen[p.match]) { seen[p.match] = 1; uniq.push(p.match); } });
    var rows = pairs.map(function (p, i) {
      var key = 'a|' + w + '|m|' + i, sel = state.act[key];
      var btns = uniq.map(function (o, oi) {
        var picked = (sel === oi), correct = (o === p.match), bg = '#fff', bd = 'var(--border)', col = 'var(--ink)';
        if (sel != null) { if (correct) { bg = '#E7F3EC'; bd = '#1C7A43'; col = '#155f34'; } else if (picked) { bg = '#FBE9EA'; bd = '#B11722'; col = '#8f1119'; } }
        return '<button onclick="SOC.actPick(\'' + key + '\',' + oi + ')" aria-pressed="' + picked + '" style="text-align:left;border:1px solid ' + bd + ';background:' + bg + ';color:' + col + ';border-radius:9px;padding:8px 12px;font-size:.86rem;font-weight:600;cursor:pointer;margin:0 6px 6px 0">' + esc(o) + '</button>';
      }).join('');
      var fb = (sel != null) ? '<div style="margin-top:8px;font-size:.86rem;color:var(--ink-dim)">' + (uniq[sel] === p.match ? '<b style="color:#1C7A43">Yes. </b>' : '<b style="color:#B11722">Not quite. </b>') + esc(p.why) + actCite(p.cite) + '</div>' : '';
      return actCard('<div style="font-size:.7rem;font-weight:700;color:var(--red);margin-bottom:5px">EXAMPLE ' + (i + 1) + '</div><div style="font-size:1rem;font-weight:600;color:var(--ink);margin-bottom:10px">' + esc(p.item) + '</div><div style="font-size:.78rem;color:var(--ink-faint);margin-bottom:6px">Which mechanism does this show?</div>' + btns + fb);
    }).join('');
    var prompt = d.prompt || 'Match each example to the mechanism it shows.';
    prompt = String(prompt).replace(/[Dd]rag each real example to the CRT mechanism it best illustrates\./, 'Choose the CRT mechanism button under each real example.');
    return '<p style="margin:0 0 14px;color:var(--ink-dim)">' + esc(prompt) + '</p>' + rows;
  }
  function actScenario(w, a) {
    var d = a.data || {}, steps = d.steps || [];
    var rows = steps.map(function (st, i) {
      var key = 'a|' + w + '|s|' + i, sel = state.act[key];
      var choices = (st.choices || []).map(function (c, ci) {
        var picked = (sel === ci), bd = picked ? (c.harm ? '#B11722' : '#1C7A43') : 'var(--border)', bg = picked ? (c.harm ? '#FBE9EA' : '#E7F3EC') : '#fff';
        return '<button onclick="SOC.actPick(\'' + key + '\',' + ci + ')" style="display:block;width:100%;text-align:left;border:1px solid ' + bd + ';background:' + bg + ';color:var(--ink);border-radius:9px;padding:10px 13px;font-size:.9rem;font-weight:600;cursor:pointer;margin:0 0 7px">' + esc(c.label) + (picked ? actBadge(c.harm) : '') + '</button>' + (picked ? '<div style="font-size:.86rem;color:var(--ink-dim);margin:0 0 10px;padding:0 2px">' + esc(c.outcome) + actCite(c.cite) + '</div>' : '');
      }).join('');
      return actCard('<div style="font-size:.7rem;font-weight:700;color:var(--red);margin-bottom:6px">DECISION ' + (i + 1) + '</div><div style="font-size:.98rem;font-weight:600;color:var(--ink);margin-bottom:10px">' + esc(st.situation) + '</div>' + choices);
    }).join('');
    return actCaseBox('THE CASE', d.setup) + '<p style="margin:0 0 14px;color:var(--ink-dim)">Make a call at each point, then see where the design choice leads.</p>' + rows;
  }
  function actToggle(w, a) {
    var d = a.data || {}, tgs = d.toggles || [];
    var rows = tgs.map(function (t, i) {
      var key = 'a|' + w + '|t|' + i, on = !!state.act[key];
      var sw = '<button onclick="SOC.actToggle(\'' + key + '\')" aria-pressed="' + on + '" aria-label="' + esc(t.label) + '" style="border:none;border-radius:999px;width:52px;height:28px;background:' + (on ? '#1C7A43' : '#C7CDD6') + ';position:relative;cursor:pointer;flex:0 0 auto"><span style="position:absolute;top:3px;left:' + (on ? '27px' : '3px') + ';width:22px;height:22px;border-radius:50%;background:#fff"></span></button>';
      return actCard('<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">' + sw + '<div style="font-size:.96rem;font-weight:700;color:var(--ink)">' + esc(t.label) + '<span style="font-size:.72rem;font-weight:600;color:var(--ink-faint);margin-left:8px">' + (on ? 'ON' : 'OFF') + '</span></div></div><div style="font-size:.88rem;color:var(--ink-dim)">' + esc(on ? t.on : t.off) + '</div><div style="font-size:.82rem;color:#B11722;margin-top:6px"><b>Who bears the cost:</b> ' + esc(t.whoHarmed) + '</div>' + actCite(t.cite));
    }).join('');
    return actCaseBox('THE SYSTEM', d.system) + '<p style="margin:0 0 14px;color:var(--ink-dim)">Flip each default and watch what changes, and who pays for it. A default is never neutral.</p>' + rows;
  }
  function actAssemble(w, a) {
    var d = a.data || {}, comps = d.components || [], key = 'a|' + w + '|asm', added = state.act[key] || [];
    var avail = comps.map(function (c, i) { return added.indexOf(i) >= 0 ? '' : '<button onclick="SOC.actAdd(\'' + key + '\',' + i + ')" style="display:block;width:100%;text-align:left;border:1px dashed var(--border);background:#fff;color:var(--ink);border-radius:9px;padding:10px 13px;font-size:.9rem;font-weight:600;cursor:pointer;margin:0 0 7px">+ ' + esc(c.label) + '</button>'; }).join('');
    var built = added.map(function (idx, n) { var c = comps[idx] || {}; return '<div style="border-left:3px solid var(--red);background:#fff;border:1px solid var(--border);border-radius:9px;padding:10px 13px;margin:0 0 8px"><div style="font-size:.92rem;font-weight:700;color:var(--ink)">' + (n + 1) + '. ' + esc(c.label) + '</div><div style="font-size:.85rem;color:var(--ink-dim);margin-top:3px">' + esc(c.role) + actCite(c.cite) + '</div></div>'; }).join('');
    var done = (added.length >= comps.length && comps.length) ? '<div style="margin-top:14px;background:#E7F3EC;border:1px solid #1C7A43;border-radius:10px;padding:12px 15px;font-size:.9rem;color:#155f34;font-weight:600">You have assembled the whole picture. Seeing the parts together is the point: the harm is not one bad piece, it is how the pieces work as a system.</div>' : '';
    return actCaseBox('THE GOAL', d.goal) + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px"><div><div style="font-size:.7rem;font-weight:700;color:var(--ink-faint);margin-bottom:8px">PARTS TO ADD</div>' + (avail || '<div style="font-size:.85rem;color:var(--ink-faint)">All parts added.</div>') + '</div><div><div style="font-size:.7rem;font-weight:700;color:var(--red);margin-bottom:8px">WHAT YOU HAVE BUILT</div>' + (built || '<div style="font-size:.85rem;color:var(--ink-faint)">Nothing yet. Add parts from the left.</div>') + '</div></div>' + done;
  }
  function actLab(w, a) {
    var d = a.data || {}, levers = d.levers || [], pick = d.pick || 2, key = 'a|' + w + '|lab', chosen = state.act[key] || [];
    var rows = levers.map(function (l, i) {
      var sel = chosen.indexOf(i) >= 0;
      var head = '<button onclick="SOC.actLabPick(\'' + key + '\',' + i + ',' + pick + ')" style="display:flex;align-items:center;gap:9px;width:100%;text-align:left;border:1px solid ' + (sel ? 'var(--red)' : 'var(--border)') + ';background:' + (sel ? '#FDECEC' : '#fff') + ';color:var(--ink);border-radius:9px;padding:10px 13px;font-size:.92rem;font-weight:700;cursor:pointer;margin:0 0 ' + (sel ? '0' : '8px') + '"><span style="width:18px;height:18px;border-radius:5px;border:2px solid ' + (sel ? 'var(--red)' : '#C7CDD6') + ';background:' + (sel ? 'var(--red)' : '#fff') + ';flex:0 0 auto"></span>' + esc(l.label) + '</button>';
      var body = sel ? '<div style="border:1px solid var(--red);border-top:none;border-radius:0 0 9px 9px;background:#fff;padding:10px 13px;margin:0 0 8px;font-size:.86rem;color:var(--ink-dim)"><b>What it does:</b> ' + esc(l.effect) + '<br><b>The trade-off:</b> ' + esc(l.tradeoff) + actCite(l.cite) + '</div>' : '';
      return head + body;
    }).join('');
    var note = chosen.length >= pick ? '<div style="margin-top:8px;background:#E7F3EC;border:1px solid #1C7A43;border-radius:10px;padding:12px 15px;font-size:.88rem;color:#155f34;font-weight:600">You picked your ' + pick + '. There is no clean answer here: every lever buys something and costs something. That tension is the policy problem.</div>' : '<div style="margin-top:8px;font-size:.82rem;color:var(--ink-faint)">Choose ' + pick + ' levers (' + chosen.length + ' of ' + pick + ' chosen).</div>';
    return actCaseBox('THE CASE', d['case']) + '<p style="margin:0 0 12px;color:var(--ink-dim)">You are the policy advisor. Pick the ' + pick + ' levers you would use, and weigh what each one costs.</p>' + rows + note;
  }
  function actCapstone(w, a) {
    var d = a.data || {}, items = d.items || [];
    var rows = items.map(function (it, i) {
      var key = 'a|' + w + '|cap|' + i, on = !!state.act[key];
      var btn = '<button onclick="SOC.actToggle(\'' + key + '\')" style="display:flex;align-items:center;gap:11px;width:100%;text-align:left;border:1px solid ' + (on ? '#1C7A43' : 'var(--border)') + ';background:' + (on ? '#E7F3EC' : '#fff') + ';border-radius:9px;padding:11px 14px;font-size:.95rem;font-weight:700;color:var(--ink);cursor:pointer;margin:0 0 ' + (on ? '0' : '8px') + '"><span style="width:20px;height:20px;border-radius:50%;border:2px solid ' + (on ? '#1C7A43' : '#C7CDD6') + ';background:' + (on ? '#1C7A43' : '#fff') + ';color:#fff;flex:0 0 auto;display:flex;align-items:center;justify-content:center">' + (on ? ic('check', 12, 3) : '') + '</span>' + esc(it.label) + '</button>';
      var body = on ? '<div style="border:1px solid #1C7A43;border-top:none;border-radius:0 0 9px 9px;background:#fff;padding:10px 14px;margin:0 0 8px;font-size:.88rem;color:var(--ink-dim)">' + esc(it.prompt) + actCite(it.cite) + '</div>' : '';
      return btn + body;
    }).join('');
    var callout = d.callout ? '<div style="margin-top:14px;background:#15171C;color:#fff;border-radius:12px;padding:16px 18px"><div style="font-size:.7rem;font-weight:700;color:#F2A900;margin-bottom:5px">YOUR FINAL PROJECT</div><div style="font-size:.95rem;line-height:1.5">' + esc(d.callout) + '</div></div>' : '';
    return '<p style="margin:0 0 14px;color:var(--ink-dim)">' + esc(d.prompt || 'Revisit your cartography one dimension at a time. Mark each as you reread it.') + '</p>' + rows + callout;
  }
  var expRunning = 0;
  function experimentSection(w) {
    var EX = window.BFS218_EXPERIMENTS || {};
    var ex = EX[w];
    if (!ex) return '';
    var st = (state.exp && state.exp[w]) || {};
    var picked = typeof st.pick === 'number' ? st.pick : null;
    var ran = !!st.ran;
    var running = expRunning === w;
    var stage = ran ? 3 : running ? 2 : picked != null ? 1 : 0;
    var rail = ['Predict', 'Run', 'The reveal', 'Your mirror'].map(function (nm, i) {
      var cls = i < stage ? 'done' : i === stage ? 'now' : '';
      return '<span class="exp-station ' + cls + '"><i>' + (i + 1) + '</i>' + nm + '</span>';
    }).join('<span class="exp-rail-line" aria-hidden="true"></span>');
    var body = '';
    if (!ran && !running) {
      var opts = ex.options.map(function (o, i) {
        var on = picked === i;
        return '<button type="button" class="exp-opt' + (on ? ' on' : '') + '" aria-pressed="' + on + '" onclick="SOC.expPick(' + w + ',' + i + ')">' + esc(o.label) + '</button>';
      }).join('');
      body = '<p class="exp-phase-title">Step 1. Make your prediction</p>'
        + '<p class="exp-setup">' + esc(ex.setup) + '</p>'
        + '<p class="exp-commit"><b>' + esc(ex.commit) + '</b> Click one of the three glowing prediction pads inside the scene above, or choose a written option here; they are the same choices.</p>'
        + '<div class="exp-opts">' + opts + '</div>'
        + (picked != null
          ? '<p class="exp-locked">Your prediction is chosen. Nothing runs until you press the button.</p><button type="button" class="wk-cta exp-run" onclick="SOC.expRun(' + w + ')">Step 2. Run the experiment ' + ic('chevron', 16, 2.4) + '</button>'
          : '<p class="exp-locked">Choose one prediction above to unlock the run button. The gap between your guess and the outcome is where the learning is.</p>');
    } else if (running) {
      body = '<p class="exp-phase-title">Step 2. Running</p>'
        + '<div class="exp-running" role="status">Your prediction is locked in. The system is running...</div>';
    } else {
      var lens = (ex.options[picked] || {}).lens;
      var runsSoFar = Object.keys(state.exp).filter(function (k) { return state.exp[k] && state.exp[k].ran; }).length;
      var lensCounts = {};
      Object.keys(state.exp).forEach(function (k) {
        var s2 = state.exp[k];
        if (s2 && s2.ran && s2.lens) lensCounts[s2.lens] = (lensCounts[s2.lens] || 0) + 1;
      });
      var topLens = null, topN = 0;
      Object.keys(lensCounts).forEach(function (l) { if (lensCounts[l] > topN) { topN = lensCounts[l]; topLens = l; } });
      var pattern = runsSoFar >= 2 && topLens
        ? '<p class="exp-pattern">Across your ' + runsSoFar + ' experiments so far, your first instinct has leaned toward the <b>' + esc(topLens) + '</b> lens ' + topN + ' time' + (topN === 1 ? '' : 's') + '. That is not a verdict on you; it is a pattern worth knowing you carry into systems.</p>'
        : '';
      body = '<p class="exp-echo"><span class="mono">YOU PREDICTED</span> ' + esc((ex.options[picked] || {}).label) + '</p>'
        + '<div class="exp-outcome"><p class="exp-phase-title" style="color:#9aa3af">Step 3. What actually happened</p><b>' + esc(ex.outcome.headline) + '</b><p>' + esc(ex.outcome.body) + '</p></div>'
        + '<div class="exp-mirror"><p class="exp-phase-title" style="color:#961A13">Step 4. The mirror: what your prediction shows</p><p>' + esc(ex.mirrors[lens] || '') + '</p>' + pattern + '</div>'
        + weekNoteBox(w, 'experiment', 'Step 5. Keep one sentence', ex.reflect)
        + '<button type="button" class="exp-reset" onclick="SOC.expReset(' + w + ')">Reset and try a different prediction</button>';
    }
    return '<section class="exp-card" aria-label="This week\'s experiment">'
      + '<div class="mono exp-kicker">THE WEEK ' + w + ' EXPERIMENT</div>'
      + '<h2>' + esc(ex.title) + '</h2>'
      + '<div class="exp-rail" aria-hidden="true">' + rail + '</div>'
      + body
      + '</section>';
  }
  function activityScreen() {
    var w = state.activityReturn, d = weekData(w);
    if (!d || !d.activity) return '<div style="padding:30px 0;color:var(--ink-dim)">No activity here. <button onclick="SOC.go(\'journey\')" style="background:none;border:none;color:var(--red);font-weight:600;cursor:pointer">Back to your journey</button></div>';
    var a = d.activity;
    var head = '<section class="jhero" style="margin:0 0 18px;padding:26px 28px"><div class="mono" style="font-size:.7rem;letter-spacing:.06em;color:var(--red);font-weight:700;margin-bottom:7px">WEEK ' + w + ' ACTIVITY</div><h1 style="font-size:1.7rem;line-height:1.15;font-weight:700;margin:0 0 12px;color:var(--ink)">' + esc(a.title) + '</h1><div class="wk-whatwhy" style="margin:0"><b>What this is:</b> ' + esc(a.what) + '<br><br><b>Why you are doing it:</b> ' + esc(a.why) + '</div></section>' + lensActivityBlock(w, a, true) + activityStudentPath(w, a) + activityModelSection(w, a);
    var inner = '';
    switch (a.archetype) { case 'match': inner = actMatch(w, a); break; case 'scenario': inner = actScenario(w, a); break; case 'toggle': inner = actToggle(w, a); break; case 'assemble': inner = actAssemble(w, a); break; case 'lab': inner = actLab(w, a); break; case 'capstone': inner = actCapstone(w, a); break; default: inner = '<p style="color:var(--ink-dim)">This activity is not set up yet.</p>'; }
    var foot = '<div style="margin-top:22px;padding-top:18px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap"><div style="font-size:.86rem;color:var(--ink-dim)">When you are done, go back to the week to answer the reflection and save your work.</div><button onclick="SOC.station(' + w + ')" class="wk-cta" style="margin:0">Back to Week ' + w + ' ' + ic('chevron', 16, 2.4) + '</button></div>';
    return '<div class="rise" style="margin:0 auto">' + mobileActivityActions(w, d) + head + experimentSection(w) + '<div class="exp-workbench-head"><span class="mono">THE WORKBENCH</span><b>Now practise the idea the experiment just showed you</b></div>' + activityInteractionGuide(w, a) + activityOutputGuide(w, a) + inner + weekNoteBox(w, 'activity', 'Activity Notes', 'What did this activity make you notice about the week\'s idea?') + foot + '</div>';
  }
  function activitySummary(w, d) {
    var a = d.activity || {};
    var actMap = (state.actResult && typeof state.actResult === 'object') ? state.actResult : (state.act || {});
    if (a.screen === 'sandbox' || a.archetype == null) {
      var audited = Object.keys(state.auditedSystems || {});
      return audited.length ? ('You audited ' + audited.length + ' of 3 systems. Every system you tested failed darker-skinned women the most (up to 34.7 percent), against near-zero error for lighter-skinned men. The disparity was hidden by overall accuracy and only an intersectional cut revealed it.') : '(activity not run yet)';
    }
    var data = a.data || {};
    if (a.archetype === 'match') { var pairs = data.pairs || [], uniq = [], seen = {}, done = 0, correct = 0; pairs.forEach(function (q) { if (!seen[q.match]) { seen[q.match] = 1; uniq.push(q.match); } }); pairs.forEach(function (p, i) { var s = actMap['a|' + w + '|m|' + i]; if (s != null) { done++; if (uniq[s] === p.match) correct++; } }); return done ? ('You matched ' + correct + ' of ' + pairs.length + ' examples to the mechanism each one shows.') : '(activity not started yet)'; }
    if (a.archetype === 'scenario') { var steps = data.steps || [], n = 0; steps.forEach(function (st, i) { if (actMap['a|' + w + '|s|' + i] != null) n++; }); return n ? ('You worked through ' + n + ' of ' + steps.length + ' decision points and saw which design choices lead to harm.') : '(activity not started yet)'; }
    if (a.archetype === 'toggle') { var tgs = data.toggles || [], n2 = 0; tgs.forEach(function (t, i) { if (actMap['a|' + w + '|t|' + i]) n2++; }); return 'You explored the system defaults and saw who each one harms (' + n2 + ' of ' + tgs.length + ' turned on).'; }
    if (a.archetype === 'assemble') { var comps = data.components || [], added = (actMap['a|' + w + '|asm'] || []).length; return added ? ('You assembled ' + added + ' of ' + comps.length + ' parts and saw how they work together as a system.') : '(activity not started yet)'; }
    if (a.archetype === 'lab') { var levers = data.levers || [], ch = actMap['a|' + w + '|lab'] || []; if (!ch.length) return '(activity not started yet)'; var names = ch.map(function (i) { return levers[i] ? levers[i].label : ''; }).filter(Boolean); return 'For the case, you chose: ' + names.join(', ') + '. Each lever buys something and costs something.'; }
    if (a.archetype === 'capstone') { var citems = data.items || [], cn = 0; citems.forEach(function (it, i) { if (actMap['a|' + w + '|cap|' + i]) cn++; }); return cn ? ('You revisited ' + cn + ' of ' + citems.length + ' dimensions of your cartography across the term.') : '(revisit not started yet)'; }
    return '(activity not started yet)';
  }
  var WEEK_DATES = { 1: 'Week of Sept 8', 2: 'Week of Sept 14', 3: 'Week of Sept 21', 4: 'Week of Sept 28', 5: 'Week of Oct 5', 6: 'Week of Oct 13', 7: 'Week of Oct 19', 8: 'Week of Nov 2', 9: 'Week of Nov 9', 10: 'Week of Nov 16', 11: 'Week of Nov 23', 12: 'Week of Nov 30', 13: 'Week of Dec 7', 14: 'Week of Dec 14' };
  var WEEK_START = { 1: '2026-09-08', 2: '2026-09-14', 3: '2026-09-21', 4: '2026-09-28', 5: '2026-10-05', 6: '2026-10-13', 7: '2026-10-19', 8: '2026-11-02', 9: '2026-11-09', 10: '2026-11-16', 11: '2026-11-23', 12: '2026-11-30', 13: '2026-12-07', 14: '2026-12-14' };
  function courseWeekByDate() {
    try {
      var today = new Date(); today.setHours(0, 0, 0, 0);
      if (today < new Date('2026-09-08T00:00:00')) return { week: 1, phase: 'before' };
      var cur = 1;
      for (var w = 1; w <= 14; w++) { if (WEEK_START[w] && today >= new Date(WEEK_START[w] + 'T00:00:00')) cur = w; }
      return { week: cur, phase: today > new Date('2026-12-20T00:00:00') ? 'after' : 'during' };
    } catch (e) { return { week: 1, phase: 'before' }; }
  }
  function weekDone(w) { try { return !!(state.wkReflect && String(state.wkReflect[w] || '').trim()); } catch (e) { return false; } }
  var STUDY_WEEK_DATE = 'Oct 26 to 30';
  var WORK_WEEKS = [13, 14];
  function weekDate(w) { return WEEK_DATES[w] || ''; }
  function workWeekPage(w) {
    var d = weekData(w) || {};
    var ws = journeyWeeks(), idx = ws.indexOf(w), prev = idx > 0 ? ws[idx - 1] : null, next = idx < ws.length - 1 ? ws[idx + 1] : null;
    var isFinal = (next == null);
    var hero = '<section id="wk-ov" class="node jhero jfade" style="margin:0 0 16px">' + '<img class="wk-hero-img" src="images/weeks/week' + (w < 10 ? '0' : '') + w + '.jpg" alt="' + esc(weekTitle(w)) + '" loading="lazy" onerror="this.remove()">' + '<div style="position:relative">'
      + '<div class="mono" style="font-size:.7rem;letter-spacing:.08em;color:var(--red);font-weight:700;margin-bottom:8px">WEEK ' + w + ' · ' + esc(weekDate(w)) + ' · ' + (isFinal ? 'FINAL WEEK' : 'FINAL PROJECT WEEK') + '</div>'
      + '<h1 style="font-size:2rem;line-height:1.12;font-weight:700;margin:0 0 12px;color:var(--ink)">' + esc(weekTitle(w)) + '</h1>'
      + (d.overview ? '<p style="font-size:1.04rem;line-height:1.6;color:var(--ink);margin:0 0 4px;">' + esc(d.overview) + '</p>' : '')
      + '<div style="font-size:1.02rem;font-weight:600;color:var(--ink);border-left:3px solid var(--red);padding-left:14px;margin:16px 0">No new readings or teaching material this week. This time is yours: focus on your work' + (isFinal ? ' and close out the course. Nothing is due.' : '. Your final project is due this week.') + '</div>'
      + '</div></section>';
    var path = capstoneLearningPath(w, d);
    var VID = window.BFS218_VIDEOS && window.BFS218_VIDEOS[w];
    var vid = weekVideoSection(w, d, VID);
    var audioPk = audioPackSection(w);
    var visual = visualOverviewSection(w, d);
    var act = d.activity ? '<section id="wk-do" class="node interactive"><h2 class="wk-sec">' + esc(d.activity.title) + '</h2><div class="wk-whatwhy"><b>What this is:</b> ' + esc(d.activity.what) + '<br><br><b>Why you are doing it:</b> ' + esc(d.activity.why) + '</div>' + activityStartGuide(w) + '<button onclick="SOC.startActivity(\'' + d.activity.screen + '\',' + w + ')" class="wk-cta">Open your final project' + ic('chevron', 17, 2.4) + '</button>' + weekNoteBox(w, 'activity', 'Activity Notes', 'Write what this final activity helped you organize or decide.') + '</section>' : '';
    var reflect = '<section id="wk-reflect" class="node"><h2 class="wk-sec">Your reflection</h2>'
      + (d.reflectPrompt ? '<p style="margin:0 0 8px;font-size:.95rem">' + esc(d.reflectPrompt) + '</p>' : '')
      + '<textarea oninput="SOC.wkReflect(' + w + ',this.value)" class="wk-ta" placeholder="Your reflection...">' + esc(state.wkReflect[w] || '') + '</textarea>'
      + weekNoteBox(w, 'revisit', 'What I Still Need to Revisit', 'Name anything you want to return to before you finish the course.')
      + '</section>';
    var notes = '<section id="wk-notes" class="node"><h2 class="wk-sec">Generate Your Weekly Notes</h2>'
      + '<div class="wk-savebox" style="margin-top:0"><h3>Your organized Week ' + w + ' record</h3><p style="margin:0 0 6px;font-size:.9rem">This makes one Word file (.docx) on Seneca letterhead, your organized weekly record.</p><button onclick="SOC.saveWeek(' + w + ')" class="wk-save">Generate Your Weekly Notes</button></div></section>';
    var navRow = '<div style="display:flex;gap:12px;margin-top:18px;flex-wrap:wrap">'
      + (prev != null ? '<button onclick="SOC.station(' + prev + ')" style="flex:1;min-width:180px;text-align:left;border:1px solid var(--border);background:#fff;border-radius:12px;padding:13px 16px;cursor:pointer"><div class="mono" style="font-size:.66rem;color:var(--ink-faint)">&larr; PREVIOUS</div><div style="font-size:.92rem;font-weight:700;color:var(--ink);margin-top:2px">Week ' + prev + ': ' + esc(weekTitle(prev)) + '</div></button>' : '')
      + (next != null ? '<button onclick="SOC.station(' + next + ')" style="flex:1;min-width:180px;text-align:right;border:1px solid var(--border);background:#fff;border-radius:12px;padding:13px 16px;cursor:pointer"><div class="mono" style="font-size:.66rem;color:var(--red)">NEXT &rarr;</div><div style="font-size:.92rem;font-weight:700;color:var(--ink);margin-top:2px">Week ' + next + ': ' + esc(weekTitle(next)) + '</div></button>' : '')
      + '</div>';
    var rail = '<aside class="wk-rail"><div class="wk-railbox"><div class="wk-railh">IN THIS WEEK</div>'
      + [['ov', 'This week'], ['path', 'Your learning path'], ['vid', 'This week in 80 seconds'], ['visual', 'A Visual Overview']].concat(d.activity ? [['do', 'Your final project']] : []).concat([['reflect', 'Reflection'], ['notes', 'Generate notes']]).map(function (it) { return '<a href="#wk-' + it[0] + '"><span class="s"></span>' + it[1] + '</a>'; }).join('')
      + '<div class="wk-railt">' + ic('clock', 12) + ' No new material</div></div></aside>';
    return '<div class="rise">' + mobileWeekActions(w, d, { activityLabel: 'Final Project' }) + hero + path + '<div class="wk-grid"><section>' + audioPk + conceptsSectionFor(w, d) + termsSectionFor(w, d) + vid + visual + act + reflect + notes + navRow + '</section>' + rail + '</div></div>';
  }
  var OVERVIEW_WEEK = 1;
  function overviewPage(w) {
    var d = weekData(w) || {};
    var ws = journeyWeeks(), idx = ws.indexOf(w), next = idx < ws.length - 1 ? ws[idx + 1] : null;
    var cname = (D.course && (D.course.name || D.course.title)) || weekTitle(w);
    var hero = '<section id="wk-ov" class="node jhero jfade" style="margin:0 0 16px"><div style="position:relative">'
      + '<div class="mono" style="font-size:.7rem;letter-spacing:.08em;color:var(--red);font-weight:700;margin-bottom:8px">WEEK ' + w + ' · ' + esc(weekDate(w)) + ' · COURSE OVERVIEW</div>'
      + '<h1 style="font-size:2rem;line-height:1.12;font-weight:700;margin:0 0 12px;color:var(--ink)">' + esc(cname) + '</h1>'
      + (d.overview ? '<p style="font-size:1.04rem;line-height:1.6;color:var(--ink);margin:0 0 4px;">' + esc(d.overview) + '</p>' : '')
      + '</div></section>';
    var how = '<section id="wk-how" class="node"><h2 class="wk-sec">How this course works</h2>'
      + '<p style="margin:0 0 10px;font-size:1rem;line-height:1.6">Each teaching week opens a module with its readings, a short interactive activity, and optional practice, a study guide and a knowledge check, that are never graded and never recorded. You work through the week at your own pace. A Study Week (October 26 to 30) falls between Weeks 7 and 8, a break with no new work, and nothing is due in the final week. Blackboard remains the official Seneca course platform for announcements, submissions, discussions, grades, course records, and administrative functions.</p>'
      + '<p style="margin:0;font-size:1rem;line-height:1.6">This week is your orientation. There are no readings and nothing to submit. When you are ready, begin with Week ' + (next != null ? next : 2) + '.</p></section>';
    var audioPk = audioPackSection(w);
    var visual = visualOverviewSection(w, d);
    var path = overviewLearningPath(w, d);
    var beginRow = (next != null) ? '<div style="margin-top:18px"><button onclick="SOC.station(' + next + ')" style="border:1px solid var(--border);background:#fff;border-radius:12px;padding:13px 18px;cursor:pointer;text-align:left;min-width:220px"><div class="mono" style="font-size:.66rem;color:var(--red)">BEGIN &rarr;</div><div style="font-size:.95rem;font-weight:700;color:var(--ink);margin-top:2px">Week ' + next + ': ' + esc(weekTitle(next)) + '</div></button></div>' : '';
    var rail = '<aside class="wk-rail"><div class="wk-railbox"><div class="wk-railh">IN THIS WEEK</div>'
      + [['ov', 'Overview'], ['path', 'Your learning path'], ['how', 'How this course works'], ['visual', 'A Visual Overview']].map(function (it) { return '<a href="#wk-' + it[0] + '"><span class="s"></span>' + it[1] + '</a>'; }).join('')
      + '<div class="wk-railt">' + ic('clock', 12) + ' Overview, no readings</div></div></aside>';
    return '<div class="rise">' + mobileWeekActions(w, d, { reflect: false }) + hero + path + '<div class="wk-grid"><section>' + audioPk + conceptsSectionFor(w, d) + termsSectionFor(w, d) + how + visual + beginRow + '</section>' + rail + '</div></div>';
  }
  var STUDY_WEEK = 7;
  function studyWeekPage(w) {
    var ws = journeyWeeks(), idx = ws.indexOf(w), prev = idx > 0 ? ws[idx - 1] : null, next = idx < ws.length - 1 ? ws[idx + 1] : null;
    var priors = ws.filter(function (x) { return x < w; });
    var hero = '<section id="wk-ov" class="node jhero jfade" style="margin:0 0 16px"><div style="position:relative">'
      + '<div class="mono" style="font-size:.7rem;letter-spacing:.08em;color:var(--red);font-weight:700;margin-bottom:8px">WEEK ' + w + ' · STUDY WEEK</div>'
      + '<h1 style="font-size:2rem;line-height:1.12;font-weight:700;margin:0 0 12px;color:var(--ink)">Study Week</h1>'
      + '<p style="font-size:1.04rem;line-height:1.6;color:var(--ink);margin:0 0 4px;">Study Week runs October 26 to 30: no new readings and no new content here. Nothing is due during Study Week. The first half of the course closed on Sunday, October 25: the Map Exchange checkpoint, the Compass Check, and the Canadian Case File. Use the week to rest and let the first half settle.</p>'
      + '<div style="font-size:1.02rem;font-weight:600;color:var(--ink);border-left:3px solid var(--red);padding-left:14px;margin:16px 0">Nothing here is graded or required. Everything below is optional, and only for your own review.</div>'
      + '</div></section>';
    var catchup = priors.length ? '<section id="wk-catch" class="node"><h2 class="wk-sec">Catch up and review</h2>'
      + '<p style="margin:0 0 12px;font-size:.95rem;color:var(--ink-dim)">If you want to use the week to consolidate, revisit any earlier week. Nothing new to read, only what you have already met.</p>'
      + '<div style="display:flex;flex-wrap:wrap;gap:8px">' + priors.map(function (n) { return '<button onclick="SOC.station(' + n + ')" style="border:1px solid var(--border);background:#fff;border-radius:9px;padding:9px 13px;font-size:.86rem;font-weight:600;color:var(--ink);cursor:pointer;text-align:left">Week ' + n + ': ' + esc(weekTitle(n)) + '</button>'; }).join('') + '</div></section>' : '';
    var kcR = kcSection(w, true);
    var kc = kcR.html, kcItems = kcR.items;
    var navRow = '<div style="display:flex;gap:12px;margin-top:18px;flex-wrap:wrap">'
      + (prev != null ? '<button onclick="SOC.station(' + prev + ')" style="flex:1;min-width:180px;text-align:left;border:1px solid var(--border);background:#fff;border-radius:12px;padding:13px 16px;cursor:pointer"><div class="mono" style="font-size:.66rem;color:var(--ink-faint)">&larr; PREVIOUS</div><div style="font-size:.92rem;font-weight:700;color:var(--ink);margin-top:2px">Week ' + prev + ': ' + esc(weekTitle(prev)) + '</div></button>' : '')
      + (next != null ? '<button onclick="SOC.station(' + next + ')" style="flex:1;min-width:180px;text-align:right;border:1px solid var(--border);background:#fff;border-radius:12px;padding:13px 16px;cursor:pointer"><div class="mono" style="font-size:.66rem;color:var(--red)">NEXT &rarr;</div><div style="font-size:.92rem;font-weight:700;color:var(--ink);margin-top:2px">Week ' + next + ': ' + esc(weekTitle(next)) + '</div></button>' : '')
      + '</div>';
    var rail = '<aside class="wk-rail"><div class="wk-railbox"><div class="wk-railh">IN THIS WEEK</div>'
      + [['ov', 'Study Week']].concat(priors.length ? [['catch', 'Catch up and review']] : []).concat(kcItems.length ? [['kc', 'Knowledge Check']] : []).map(function (it) { return '<a href="#wk-' + it[0] + '"><span class="s"></span>' + it[1] + '</a>'; }).join('')
      + '<div class="wk-railt">' + ic('clock', 12) + ' No classes this week</div></div></aside>';
    return '<div class="rise">' + mobileWeekActions(w, {}, { reflect: false }) + hero + '<div class="wk-grid"><section>' + catchup + kc + navRow + '</section>' + rail + '</div></div>';
  }
  function weekStation(w) {
    if (w === OVERVIEW_WEEK && !weekData(w)) return overviewPage(w);
    if (WORK_WEEKS.indexOf(w) >= 0) return workWeekPage(w);
    var d = weekData(w);
    if (d) return weekPage(w, d);
    var ws = journeyWeeks(), idx = ws.indexOf(w), recs = recordsForWeek(w);
    if (idx < 0 || !recs.length) return '<div style="padding:40px 0;color:var(--ink-dim);font-size:1rem">This week has no readings posted yet. <button onclick="SOC.go(\'journey\')" style="background:none;border:none;color:var(--red);font-weight:600;cursor:pointer">Back to your journey</button></div>';
    var hero = '<section class="jfade jhero" style="margin-bottom:22px;padding:30px 32px 28px">' + heroArt()
      + '<div style="position:relative">'
      + '<div class="mono" style="font-size:.6875rem;letter-spacing:.06em;color:var(--red);font-weight:600;margin-bottom:9px">WEEK ' + w + ' OF YOUR JOURNEY</div>'
      + '<h1 style="font-size:1.875rem;line-height:1.16;font-weight:600;margin:0 0 12px">' + esc(weekTitle(w)) + '</h1>'
      + '<p style="font-size:1.0625rem;line-height:1.5;color:var(--ink);font-weight:500;margin:0;">' + esc(journeyQ(w)) + '</p>'
      + '</div></section>';
    var framing = '<p style="font-size:1rem;line-height:1.65;color:var(--ink-dim);margin:0 0 22px;">' + esc(stationFraming(w, recs)) + '</p>';
    var readBlocks = '<div style="display:flex;flex-direction:column;gap:14px;margin-bottom:24px">';
    recs.forEach(function (r, i) { readBlocks += stationReading(r, i === 0 ? 'This week\'s reading' : 'Also this week'); });
    readBlocks += '</div>';
    var prev = idx > 0 ? ws[idx - 1] : null, next = idx < ws.length - 1 ? ws[idx + 1] : null;
    var navRow = '<div style="display:flex;gap:12px;margin-top:26px;flex-wrap:wrap">'
      + (prev != null ? '<button onclick="SOC.station(' + prev + ')" style="flex:1;min-width:190px;text-align:left;border:1px solid var(--border);background:#fff;border-radius:12px;padding:13px 16px;cursor:pointer"><div class="mono" style="font-size:.6875rem;color:var(--ink-faint)">&larr; PREVIOUS</div><div style="font-size:.9375rem;font-weight:600;color:var(--ink);margin-top:2px">Week ' + prev + ': ' + esc(weekTitle(prev)) + '</div></button>' : '')
      + (next != null ? '<button onclick="SOC.station(' + next + ')" style="flex:1;min-width:190px;text-align:right;border:1px solid var(--border);background:#fff;border-radius:12px;padding:13px 16px;cursor:pointer"><div class="mono" style="font-size:.6875rem;color:var(--red)">NEXT &rarr;</div><div style="font-size:.9375rem;font-weight:600;color:var(--ink);margin-top:2px">Week ' + next + ': ' + esc(weekTitle(next)) + '</div></button>' : '')
      + '</div>';
    return '<div class="rise">' + mobileWeekActions(w, {}, { reflect: false }) + hero + framing + '<div class="mono" style="font-size:.6875rem;letter-spacing:.05em;color:var(--ink-faint);margin:0 0 12px">WHAT YOU ARE READING</div>' + readBlocks + stationDo(w) + navRow + '</div>';
  }

  /* ---------- render ---------- */
  /* ---------- Field Lens: persistent, visible, optional program personalization ---------- */
  function programAreaForName(name) {
    var PROG = window.SENECA_PROGRAMS || null;
    name = String(name || '');
    if (!PROG || !name) return null;
    var areas = Object.keys(PROG);
    for (var i = 0; i < areas.length; i++) {
      if ((PROG[areas[i]] || []).indexOf(name) >= 0) return areas[i];
    }
    return null;
  }
  function normalizeLensRaw(raw) {
    raw = String(raw || '');
    if (!raw || raw === '__explore' || raw.indexOf('::') >= 0) return raw;
    var area = programAreaForName(raw);
    return area ? (area + '::' + raw) : raw;
  }
  function lensFromRaw(raw) {
    raw = normalizeLensRaw(raw);
    if (!raw || raw === '__explore') return null;
    if (raw.indexOf('::') >= 0) { var p = raw.split('::'); return { area: p[0], program: p[1], label: p[1] }; }
    return { area: raw, program: null, label: 'All of ' + raw };
  }
  function lensParse() {
    return lensFromRaw(state.careerField || '');
  }
  function programViewParse() {
    var raw = state.programViewField || '';
    if (!raw) return generalStreamLens();
    if (raw === '__explore') return generalStreamLens('Still exploring / undecided');
    return lensFromRaw(raw);
  }
  function lensProgramOpts(raw, placeholder) {
    var C = window[(D.course && D.course.code) + '_CAREER'] || {};
    var PROG = window.SENECA_PROGRAMS || null;
    var opts = '<option value=""' + (!raw ? ' selected' : '') + '>General stream / no program</option>';
    if (PROG) {
      (C.fields || []).forEach(function (fld) {
        var progs = PROG[fld] || [];
        opts += '<optgroup label="' + esc(fld) + '">';
        opts += '<option value="' + esc(fld) + '"' + (raw === fld ? ' selected' : '') + '>All of ' + esc(fld) + '</option>';
        progs.forEach(function (pr) { var v = fld + '::' + pr; opts += '<option value="' + esc(v) + '"' + (raw === v ? ' selected' : '') + '>' + esc(pr) + '</option>'; });
        opts += '</optgroup>';
      });
      opts += '<option value="__explore"' + (raw === '__explore' ? ' selected' : '') + '>Still exploring / undecided</option>';
    } else {
      (C.fields || []).forEach(function (fld) { opts += '<option value="' + esc(fld) + '"' + (raw === fld ? ' selected' : '') + '>' + esc(fld) + '</option>'; });
    }
    return opts;
  }
  function assignmentLensPicker() {
    var raw = state.careerField || '';
    return '<label class="asg-inline-lens"><span>Program lens</span><select onchange="SOC.assignmentLens(this.value)" aria-label="Choose a program lens for assignment examples">' + lensProgramOpts(raw, '') + '</select><small>Changing this updates the assignment rooms and starter questions below.</small></label>';
  }
  function assignmentLensPanel(L) {
    var label = L ? (L.program || L.area) : 'General stream';
    return '<section class="asg-lens-panel" aria-label="Assignment program lens selector"><div><div class="mono">ASSIGNMENT PROCESS</div><h2>Choose your program for the assignments</h2><p>Start here when you are ready to plan assignment examples. This choice updates the assignment rooms and Starter Studio only. The assignment prompt, grading, due dates, and Blackboard submission rules stay the same.</p></div><div>' + assignmentLensPicker() + '<p>Current assignment lens: <b>' + esc(label) + '</b>.</p></div></section>';
  }
  function programViewPicker() {
    var raw = state.programViewField || '';
    return '<label class="asg-inline-lens"><span>View program</span><select onchange="SOC.viewProgram(this.value);return false" aria-label="Preview a program connection without changing assignments">' + lensProgramOpts(raw, '') + '</select><small>Selecting here changes only this page. Starting Your Assignment has its own program choice.</small></label>';
  }
  function programViewAssignmentId() {
    var id = state.programViewAssignment || 'all';
    if (id === 'all') return 'all';
    var items = assignmentsData();
    for (var i = 0; i < items.length; i++) if (items[i].id === id) return id;
    return 'all';
  }
  function programViewAssignmentItem() {
    var id = programViewAssignmentId();
    if (id === 'all') return null;
    var items = assignmentsData();
    for (var i = 0; i < items.length; i++) if (items[i].id === id) return items[i];
    return null;
  }
  function programViewAssignmentPicker() {
    var id = programViewAssignmentId();
    var opts = '<option value="all"' + (id === 'all' ? ' selected' : '') + '>All assignments</option>';
    assignmentsData().forEach(function (a) {
      opts += '<option value="' + esc(a.id) + '"' + (id === a.id ? ' selected' : '') + '>' + esc(a.title) + '</option>';
    });
    return '<label class="asg-inline-lens asg-assignment-focus"><span>Assignment focus</span><select onchange="SOC.viewProgramAssignment(this.value);return false" aria-label="Choose which assignment Section 3 should focus on">' + opts + '</select><small>This changes only Section 3 on this page.</small></label>';
  }
  function capPhrase(s) {
    s = String(s == null ? '' : s).trim();
    return s.replace(/^([a-z])/, function (m) { return m.toUpperCase(); });
  }
  function capList(arr) {
    return (arr || []).map(capPhrase).join(', ');
  }
  function uniqList(arr) {
    var seen = {}, out = [];
    (arr || []).forEach(function (x) {
      x = String(x || '').trim();
      var k = x.toLowerCase();
      if (x && !seen[k]) { seen[k] = 1; out.push(x); }
    });
    return out;
  }
  function generalStreamLens(label) {
    return { area: 'General stream', program: 'General stream', label: label || 'General stream', general: true };
  }
  function titleNuance(name, area) {
    name = String(name || '');
    area = String(area || '');
    var p = name.toLowerCase();
    var note = '', topic = '', artifact = '', question = '';
    function set(t, a, n, q) { topic = topic || t; artifact = artifact || a; note = note || n; question = question || q; }
    if (/general stream/.test(p)) set('everyday digital sorting', 'a screen, score, form, policy, notice, or platform output', 'The general stream works best when students choose one ordinary system from daily life, school, work, media, housing, policing, health, travel, finance, or public services.', 'Ask what the system does, who it sorts, who benefits, who is exposed, and who can challenge the outcome.');
    if (/payroll/.test(p)) set('payroll exception rules', 'a payroll exception report', 'Payroll examples should focus on how hours, status, deductions, tax rules, and benefit eligibility become official pay decisions.', 'Ask who gets paid smoothly, who has to prove an exception, and how a worker corrects the record.');
    if (/accounting and finance|commerce - accounting/.test(p)) set('financial statement controls', 'a reconciliation note', 'Accounting and finance examples should connect ledgers, controls, credit history, and risk evidence to decisions about trust.', 'Ask what the financial record treats as proof and who is harmed when the record is incomplete.');
    if (/accounting\b|professional accounting/.test(p)) set('audit trails', 'an internal-control checklist', 'Accounting examples should focus on how records, audit samples, and control systems turn messy activity into official evidence.', 'Ask what the record makes visible, what it hides, and who can correct it.');
    if (/fraud/.test(p)) set('fraud-detection thresholds', 'a suspicious-activity flag', 'Fraud examination examples should focus on surveillance, anomaly detection, computer forensics, and the risk of treating unusual activity as guilt.', 'Ask what counts as suspicious, who gets over-flagged, and what evidence clears the person.');
    if (/asset management/.test(p)) set('portfolio risk scoring', 'a suitability note', 'Asset management examples should focus on how client profiles, risk ratings, and investment rules define suitability.', 'Ask whose financial life fits the model and whose needs are flattened by the rating.');
    if (/financial technology|fintech/.test(p)) set('fintech onboarding screens', 'an automated approval result', 'Fintech examples should focus on app-based trust, automated approval, identity checks, and financial data pipelines.', 'Ask who the app approves, rejects, or suspects and what appeal path exists.');
    if (/financial services compliance|compliance administration/.test(p)) set('compliance screening rules', 'a compliance exception log', 'Compliance examples should focus on how rules, flags, and documentation decide whether a client or transaction is allowed to proceed.', 'Ask whether the rule prevents harm or quietly shifts suspicion onto some groups.');
    if (/financial planning/.test(p)) set('client risk profiles', 'a client suitability form', 'Financial planning examples should focus on how advice systems turn income, debt, family needs, and risk tolerance into recommendations.', 'Ask whose future the profile imagines and whose obligations it fails to see.');
    if (/insurance/.test(p)) set('insurance pricing rules', 'a premium quote', 'Insurance examples should focus on how risk pools, postal codes, claims history, and eligibility rules shape access and price.', 'Ask who pays more for a risk category and whether the category can be challenged.');
    if (/human resources/.test(p)) set('applicant tracking systems', 'an interview rubric', 'Human resources examples should focus on hiring screens, interview rubrics, performance data, accommodation workflows, and workplace records.', 'Ask who is screened out before human judgment and what evidence would change the decision.');
    if (/business analytics/.test(p)) set('dashboard metrics', 'a dashboard tile', 'Business analytics examples should focus on metrics, segments, model features, and the way a chart can hide group harm inside an average.', 'Ask what the dashboard measures, whose data is missing, and who acts on the result.');
    if (/marketing communications|social media marketing|digital marketing|marketing management|business - marketing/.test(p)) set('audience targeting', 'a campaign segment', 'Marketing examples should focus on audience categories, platform metrics, targeting tools, and the difference between representation and extraction.', 'Ask who the campaign imagines, who it stereotypes, and who controls the story.');
    if (/sports, entertainment and event/.test(p)) set('fan and event analytics', 'an event access rule', 'Sports, entertainment, and event marketing examples should focus on ticketing, crowd data, sponsorship metrics, fan profiles, and event access.', 'Ask who is welcomed, priced out, screened, or represented by the event system.');
    if (/supply chain|global logistics/.test(p)) set('supplier scoring', 'a vendor scorecard', 'Supply chain examples should focus on supplier ratings, warehouse data, route optimization, procurement thresholds, and labour hidden by efficiency language.', 'Ask who gains speed and who carries the delay, surveillance, or cost.');
    if (/international transportation|customs/.test(p)) set('customs risk flags', 'a customs hold notice', 'International transportation and customs examples should focus on border paperwork, risk flags, country codes, compliance holds, and shipment delays.', 'Ask what the border system treats as risk and who can contest the hold.');
    if (/office administration - health/.test(p)) set('health-service intake records', 'a patient scheduling field', 'Health office administration examples should focus on patient records, appointment priority, referral paperwork, and privacy-sensitive routing.', 'Ask whose care path is sped up, delayed, or made harder by the record.');
    if (/office administration - legal/.test(p)) set('legal file intake records', 'a client file note', 'Legal office administration examples should focus on intake fields, deadlines, file categories, correspondence, and the record a client must live with.', 'Ask how the file shapes credibility, access, and appeal.');
    if (/office administration/.test(p)) set('office workflow records', 'a scheduling rule', 'Office administration examples should focus on routine records, templates, calendars, databases, and the small choices that become institutional memory.', 'Ask who the workflow sees as urgent, complete, credible, or difficult.');
    if (/flight training|aviation technology/.test(p)) set('simulator and training records', 'a check ride record', 'Flight training and aviation technology examples should focus on cockpit automation, simulator scoring, weather margins, and check ride evidence.', 'Ask who is treated as ready, risky, credible, or needing manual review.');
    if (/aviation safety/.test(p)) set('hazard classification systems', 'a risk matrix', 'Aviation safety examples should focus on incident reports, hazard matrices, audits, corrective actions, and whose safety evidence is taken seriously.', 'Ask what counts as a hazard and whose report changes the system.');
    if (/aviation operations|aviation - management|bachelor of aviation - management/.test(p)) set('operations-control decisions', 'a delay code', 'Aviation operations and management examples should focus on dispatch, delay codes, crew schedules, passenger flow, and operational recovery.', 'Ask who the system moves smoothly and who it delays or reroutes.');
    if (/flight services/.test(p)) set('passenger service handoffs', 'a cabin manifest', 'Flight services examples should focus on cabin manifests, boarding, accessibility requests, service recovery, and the handoff between care and screening.', 'Ask who is welcomed, questioned, accommodated, or sent for manual review.');
    if (/3d animation|game art|visual effects|animation/.test(p)) set('asset and rendering pipelines', 'a render test', 'Animation and visual effects examples should focus on rigs, shaders, lighting, reference images, game engines, and whose body the pipeline treats as normal.', 'Ask whose face, skin, hair, movement, or body works well in the system.');
    if (/graphic design|interactive media|illustration|visual content|art and design/.test(p)) set('visual and interface defaults', 'a wireframe or prompt result', 'Design examples should focus on UX defaults, prompts, accessibility, brand systems, and whose needs the design centres.', 'Ask who can use the design easily and who has to work around it.');
    if (/floral design|visual merchandising/.test(p)) set('retail display decisions', 'a display plan or product placement rule', 'Display and merchandising examples should focus on layout, visibility, pricing, trend data, and whose bodies or cultures become decoration.', 'Ask who is invited into the space and who is only used as style.');
    if (/acting|camera|voice|music|songwriting|performance/.test(p)) set('casting and platform categories', 'a casting notice or platform tag', 'Performance examples should focus on voice, accent, genre, casting labels, platform metadata, and audience categories.', 'Ask whose voice, body, story, or genre is treated as marketable.');
    if (/911|emergency services/.test(p)) set('dispatch triage records', 'a call code', 'Emergency communications examples should focus on call classification, dispatch notes, priority codes, and the first record created under pressure.', 'Ask whose call is treated as urgent, credible, risky, or low priority.');
    if (/investigations|enforcement|crime and intelligence|police/.test(p)) set('risk and investigation records', 'an incident report field', 'Public safety examples should focus on incident reports, intelligence data, risk flags, patrol priorities, facial recognition, and complaint pathways.', 'Ask who is marked as risk, who is believed, and who can challenge the record.');
    if (/firefighter|fire protection/.test(p)) set('life-safety inspection records', 'an inspection checklist', 'Fire and life-safety examples should focus on alarms, inspections, emergency access, building records, and who is protected when time is short.', 'Ask whose safety is designed into the system and whose access is assumed.');
    if (/behavioural|mental health|addiction|social service|child|youth|gerontology|immigrants|refugees|early child/.test(p)) set('intake and support records', 'an intake field', 'Community service examples should focus on intake, risk notes, referrals, placement, consent, and how a file describes a person.', 'Ask whose context is flattened and whose voice travels with the record.');
    if (/library and information/.test(p)) set('metadata and access systems', 'a catalogue field', 'Library and information examples should focus on metadata, search terms, access rules, archives, and whose knowledge is easy to find.', 'Ask what the catalogue makes searchable and what it makes hard to see.');
    if (/non-profit|social sector/.test(p)) set('funding and service dashboards', 'an eligibility rule', 'Non-profit and social sector examples should focus on service metrics, donor reports, eligibility, case management, and whose needs become countable.', 'Ask who gets served, who gets measured, and what relationship the metric misses.');
    if (/civil engineering|building systems|urban|transportation planning/.test(p)) set('built-environment standards', 'a site drawing note', 'Built-environment examples should focus on access, routes, drainage, inspection, public space, and who the standard imagines as the user.', 'Ask who can move through the space safely and who has to adapt.');
    if (/mechanical|cnc|electromechanical|automation/.test(p)) set('machine and automation settings', 'a maintenance log', 'Mechanical and automation examples should focus on tolerances, settings, guards, maintenance logs, and how production defaults affect workers.', 'Ask who is protected by the setting and who is exposed when it fails.');
    if (/electronics|computer engineering/.test(p)) set('sensor and control systems', 'a calibration note', 'Electronics and computer engineering examples should focus on sensors, controls, access, failure modes, and the people affected by technical assumptions.', 'Ask who the system detects reliably and who becomes an error case.');
    if (/environmental/.test(p)) set('environmental monitoring', 'a sample result', 'Environmental examples should focus on samples, GIS layers, compliance thresholds, land relationships, and community evidence.', 'Ask whose land and health the data describes and who controls the evidence.');
    if (/cosmetic techniques|esthetic|medical spa|medical esthetics|cosmetic science/.test(p)) set('skin and shade assessment', 'a shade chart or skin-analysis output', 'Cosmetic and esthetics examples should focus on skin, shade range, device readings, client records, product claims, and whose body the tool was built for.', 'Ask whose skin the tool recognizes well and whose result is treated as an exception.');
    if (/fashion arts|fashion business|fashion studies/.test(p)) set('fashion trend and fit systems', 'a size chart or merchandising plan', 'Fashion examples should focus on sizing, trend forecasting, supply chains, retail data, models, and whose body becomes the assumed customer.', 'Ask whose body, culture, labour, and spending power the system treats as normal.');
    if (/nursing|personal support|therapeutic|occupational therapist|physiotherapist|fitness|pre-health/.test(p)) set('care assessment tools', 'a care-plan note', 'Health practice examples should focus on triage, pain assessment, device readings, referrals, care plans, and whose symptoms are believed.', 'Ask whose care path is changed by the score and what patient evidence must sit beside it.');
    if (/health administration/.test(p)) set('health administration dashboards', 'a referral dashboard', 'Health administration examples should focus on waitlists, referrals, scheduling, records, privacy, and the systems that decide access to care.', 'Ask who moves through the system faster and who carries the paperwork burden.');
    if (/optician/.test(p)) set('vision measurement and fitting systems', 'a lens fitting record', 'Opticianry examples should focus on measurements, fittings, device outputs, product access, and whether assumptions fit diverse faces and needs.', 'Ask whose vision needs are read clearly and whose fitting becomes an exception.');
    if (/veterinary/.test(p)) set('animal care records and client access', 'a veterinary triage note', 'Veterinary examples should focus on triage, owner communication, cost estimates, records, and access to care.', 'Ask whose animal receives timely care and whose ability to pay or communicate shapes the outcome.');
    if (/workplace safety/.test(p)) set('hazard and injury reporting', 'an incident report', 'Workplace safety examples should focus on hazards, injury reports, inspections, training records, PPE, and whose risk is normalized.', 'Ask who is protected by the safety system and who is expected to absorb risk.');
    if (/hospitality|hotel|restaurant|tourism|travel/.test(p)) set('booking and guest service systems', 'a booking rule', 'Hospitality and tourism examples should focus on booking, guest profiles, dynamic pricing, ratings, accessibility, and service recovery.', 'Ask who is welcomed, priced out, screened, or treated as risk.');
    if (/ai workplace|artificial intelligence|data science|software|computer science|programming|cloud|systems|cybersecurity|information technology/.test(p)) set('data and access systems', 'a test case or access log', 'Technology examples should focus on data fields, model outputs, permissions, logs, security rules, release choices, and who can challenge a system decision.', 'Ask where bias enters the stack and what evidence would prove the fix works.');
    if (/business information technology|project management - information technology/.test(p)) set('IT business workflow decisions', 'a ticket pattern', 'Business IT examples should focus on requirements, tickets, dashboards, vendor systems, project priorities, and who the workflow serves first.', 'Ask whose problem gets prioritized and whose need becomes backlog.');
    if (/immigration/.test(p)) set('immigration case records', 'a case note or document checklist', 'Immigration case examples should focus on forms, document rules, credibility, translation, timelines, and the power of a file to shape status.', 'Ask who can prove eligibility and who is harmed by missing context.');
    if (/law clerk|paralegal|justice administration|legal/.test(p)) set('legal file and appeal records', 'a limitation-date tracker', 'Legal administration examples should focus on forms, file notes, deadlines, evidence, appeal paths, and how records shape rights.', 'Ask who can understand the process and who can challenge the outcome.');
    if (/public administration|government relations/.test(p)) set('public policy and consultation records', 'a consultation summary', 'Public administration examples should focus on policy rules, consultations, service standards, records, and how government systems justify decisions.', 'Ask whose evidence shapes the policy and whose experience is summarized away.');
    if (/real property/.test(p)) set('property assessment models', 'an assessment notice', 'Real property examples should focus on assessment models, appraisal data, addresses, neighbourhood history, and who can appeal a valuation.', 'Ask what the model treats as value and who pays for the assumption.');
    if (/academic upgrading|english for academic|general arts|university transfer|interdisciplinary|liberal arts|arts and science/.test(p)) set('source and evidence choices', 'a source annotation', 'Liberal arts and transfer examples should focus on evidence, definitions, theory, source choice, and how a discipline decides what counts as knowledge.', 'Ask whose experience is treated as evidence and whose is treated as background.');
    if (/broadcast|journalism|media production|communications|public relations|technical communication/.test(p)) set('story and message systems', 'a headline, script, or message map', 'Media and communications examples should focus on source lists, story frames, platform ranking, audience data, crisis messages, and public claims.', 'Ask who becomes credible, who becomes a problem, and who controls the frame.');
    if (/biotechnology|chemical|pharmaceutical|clinical research|regulatory affairs|science/.test(p)) set('lab and regulatory evidence', 'a protocol line or assay cutoff', 'Science examples should focus on samples, thresholds, instruments, trial criteria, quality evidence, and what gets called objective.', 'Ask whose data fits the method and whose result is treated as noise.');
    var credential = '';
    if (/graduate certificate/.test(p)) credential = ' Because this is a graduate certificate, the strongest examples usually come from workplace-ready documents, professional decisions, and systems a graduate might quickly be asked to use or explain.';
    else if (/honours bachelor|bachelor/.test(p)) credential = ' Because this is a degree pathway, the strongest examples can connect practice to policy, research evidence, professional judgement, and long-term responsibility.';
    else if (/accelerated|fast track|bridge/.test(p)) credential = ' Because this pathway builds on earlier learning, the strongest examples can compare prior practice with the course lens and name what changes.';
    else if (/foundations|pre-health|academic upgrading|one year certificate/.test(p)) credential = ' Because this is an entry pathway, the strongest examples can start with visible everyday systems before moving toward a future field.';
    if (!note) note = 'This specific program should not be treated as the whole ' + area + ' area. Use the title, ' + name + ', to choose a tighter system, record, artifact, and group of people affected.';
    return { topic: topic || (name + ' systems'), artifact: artifact || (name + ' artifact'), note: note + credential, question: question || ('Ask how ' + name + ' turns a routine tool, record, standard, or decision into a consequence for people.') };
  }
  function programBoundaryPhrase(name, area) {
    name = String(name || '').trim();
    area = String(area || '').trim();
    if (!name || name === 'General stream') return 'general course pathway';
    var phrase = name.toLowerCase()
      .replace(/\s*\(graduate certificate\)/g, ' graduate-certificate pathway')
      .replace(/\s*\(accelerated\)/g, ' accelerated pathway')
      .replace(/\s*\(fast track\)/g, ' fast-track pathway')
      .replace(/\s*\(bridge\)/g, ' bridge pathway')
      .replace(/^honours bachelor of /, 'honours bachelor pathway in ')
      .replace(/^bachelor of /, 'bachelor pathway in ')
      .replace(/^master of /, 'master pathway in ')
      .replace(/\s+-\s+/g, ' with ');
    return phrase + (area ? ' within ' + area.toLowerCase() : '');
  }
  function lensChip() {
    var C = window[(D.course && D.course.code) + '_CAREER'] || null;
    if (!C) return '';
    var L = lensParse();
    var raw = state.careerField || '';
    var sel = '<select onchange="SOC.careerField(this.value)" aria-label="Choose your program to personalize this course" style="font:inherit;font-size:.82rem;padding:6px 10px;border:1.5px solid var(--border);border-radius:8px;background:#fff;color:var(--ink);max-width:260px">' + lensProgramOpts(raw, L ? 'Change program...' : 'See this course through your program...') + '</select>';
    if (!L) {
      return '<div style="display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:16px"><span style="color:var(--red);display:inline-flex">' + ic('globe', 15, 2) + '</span><span style="font-size:.85rem;color:var(--ink-dim);font-weight:500">See this course through your program:</span>' + sel + '</div>';
    }
    return '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:16px;background:#FDF0EE;border:1px solid var(--red);border-radius:12px;padding:8px 8px 8px 14px"><span style="color:var(--red);display:inline-flex">' + ic('globe', 15, 2) + '</span><span style="font-size:.85rem;color:var(--ink);font-weight:500">Viewing as <b>' + esc(L.label) + '</b></span>' + sel + '<button onclick="SOC.lensOff()" aria-label="Turn off program personalization" style="background:#fff;border:1px solid var(--border);border-radius:8px;color:var(--ink-dim);font-size:.8rem;font-weight:600;cursor:pointer;padding:5px 11px">Turn off</button></div>';
  }
  function lensHomeIntro() {
    var L = lensParse();
    if (!L) return '';
    var C = window[(D.course && D.course.code) + '_CAREER'];
    var f = C && C.byField && C.byField[L.area];
    var spec = programSpecificProfile(L);
    var line = spec && spec.overview ? spec.overview : (f && (f.lens || (f.paras && f.paras[0])));
    if (!line) return '';
    return '<section class="jfade" style="background:#15171C;color:#fff;border-radius:16px;padding:20px 24px;margin:0 0 24px">'
      + '<div class="mono" style="font-size:.66rem;letter-spacing:.06em;color:#f3b1a8;font-weight:700;margin-bottom:8px">FOR YOUR FIELD &middot; ' + esc(L.label.toUpperCase()) + '</div>'
      + '<p style="margin:0 0 9px;font-size:1.05rem;line-height:1.55;font-weight:500">' + esc(line) + '</p>'
      + '<p style="margin:0;font-size:.8rem;color:#B9BEC8;line-height:1.5">This is a lens on the course. Every student does the same readings and the same assessments. <button onclick="SOC.go(\'career\')" style="background:none;border:none;color:#f3b1a8;font-weight:600;cursor:pointer;padding:0;font-size:.8rem;text-decoration:underline">See the full write-up for your field</button></p>'
      + '</section>';
  }
  function lensCardBadge(w) {
    var L = lensParse();
    if (!L) return '';
    var C = window[(D.course && D.course.code) + '_CAREER'];
    var f = C && C.byField && C.byField[L.area];
    var spec = programSpecificProfile(L);
    if (spec && spec.weeks && spec.weeks.indexOf(w) >= 0) return '<span class="mono" style="font-size:.6rem;font-weight:700;letter-spacing:.05em;color:var(--red);background:#F6E3E1;padding:2px 8px;border-radius:999px">KEY FOR YOUR PROGRAM</span>';
    if (f && f.weeks && f.weeks.indexOf(w) >= 0) return '<span class="mono" style="font-size:.6rem;font-weight:700;letter-spacing:.05em;color:var(--red);background:#F6E3E1;padding:2px 8px;border-radius:999px">KEY FOR YOUR FIELD</span>';
    return '';
  }
  function lensCardLine(w) {
    var L = lensParse();
    if (!L) return '';
    var LENS = window[(D.course && D.course.code) + '_LENS'];
    var hook = LENS && LENS.byArea && LENS.byArea[L.area] && LENS.byArea[L.area][String(w)];
    if (!hook) return '';
    return '<div style="display:flex;gap:8px;margin:0 0 9px;padding:8px 11px;background:#FDF0EE;border-radius:9px">'
      + '<span class="mono" style="color:var(--red);flex:none;font-weight:700;font-size:.62rem;letter-spacing:.04em;padding-top:2px">FOR YOUR FIELD</span>'
      + '<span style="font-size:.82rem;line-height:1.5;color:var(--ink)">' + esc(hook) + '</span></div>';
  }
  function lensPracticeLine(L) {
    if (!L) return '';
    var spec = programSpecificProfile(L);
    if (spec && spec.practice) return spec.practice;
    var label = L.program || L.area;
    var byArea = {
      "Aviation": "For {program}, put this beside flight planning, crew decisions, passenger screening, safety checks, and handoff logs. Ask who the procedure protects, who it delays, and who can challenge a bad flag.",
      "Business": "For {program}, put this beside hiring, pricing, credit, customer data, vendor tools, and performance targets. Ask who the metric rewards, who it filters out, and who gets a human explanation.",
      "Creative Arts, Animation and Design": "For {program}, put this beside briefs, references, style defaults, image tools, platform rules, and audience testing. Ask whose face, body, story, or culture the tool treats as normal.",
      "Education, Community and Social Services": "For {program}, put this beside intake forms, placement decisions, risk notes, referrals, and family records. Ask which clients get seen clearly, which get watched harder, and who has voice in the file.",
      "Engineering Technology": "For {program}, put this beside specs, drawings, materials, site measurements, safety margins, and infrastructure defaults. Ask who is protected by the standard, who is left out, and who gets to challenge the decision when the built system fails them.",
      "Fashion and Esthetics": "For {program}, put this beside shade ranges, skin analysis, client records, product matching, trend tools, and service scripts. Ask whose body and beauty the system is built to recognize.",
      "Health and Wellness": "For {program}, put this beside triage, assessment tools, patient records, risk scores, referrals, and care plans. Ask who the tool reads accurately, who it misses, and who carries the cost of a wrong screen.",
      "Hospitality and Tourism": "For {program}, put this beside booking systems, guest screening, service recovery, ratings, staffing, and travel access. Ask who feels welcomed, who gets treated as risk, and who can contest the decision.",
      "Information Technology": "For {program}, put this beside requirements, data models, access controls, logs, tests, releases, and support tickets. Ask where bias can enter the stack and what evidence would prove the system is fairer.",
      "Law, Administration and Public Safety": "For {program}, put this beside case notes, incident reports, policy thresholds, discretion, risk tools, and public safety decisions. Ask who gets flagged, who gets believed, and who has a path to appeal.",
      "Liberal Arts and University Transfers": "For {program}, put this beside source reading, seminar debate, research methods, writing choices, and the discipline you move into next. Ask what each field counts as evidence and whose experience it leaves out.",
      "Media and Communications": "For {program}, put this beside story angles, audience data, platform ranking, moderation, public messaging, and crisis response. Ask who gets framed as credible, who gets flattened, and who controls the narrative.",
      "Science": "For {program}, put this beside sampling, instruments, lab protocols, data cleaning, thresholds, and peer review. Ask whose data fits the method, whose results look like noise, and who gets to question the model."
    };
    var template = byArea[L.area] || "For {program}, connect this week to the decisions, tools, records, clients, and standards you will work with. Ask who benefits, who carries risk, and who can challenge a bad outcome.";
    return template.replace(/\{program\}/g, label);
  }
  function lensChangeLine() {
    return 'What changes: your program filter adds field hooks, diagrams, case studies, activity prompts, media prompts, assignment planning prompts, key-week badges, and Career Choices notes. What stays the same: readings, activities, assessments, grading criteria, and outcomes.';
  }
  function lensFieldContext(L) {
    var label = (L && (L.program || L.area)) || 'your field';
    var byArea = {
      "Aviation": { place: 'flight plans, crew calls, maintenance logs, passenger screening, safety checks, and handoff records', decision: 'a procedure, threshold, route, checklist, or risk flag', people: 'passengers, crew, dispatchers, maintenance teams, and people delayed or flagged by the system', pressure: 'a changed route, weather call, failed check, passenger issue, or crew handoff', setting: 'an airport, aircraft, dispatch desk, security line, or maintenance bay' },
      "Business": { place: 'hiring screens, customer data, pricing tools, credit checks, vendor dashboards, and performance targets', decision: 'a metric, approval rule, pricing choice, ranking, or vendor recommendation', people: 'customers, applicants, staff, suppliers, and people filtered out by the metric', pressure: 'a missed target, client complaint, hiring decision, cash-flow problem, or team deadline', setting: 'a store, office, client file, sales funnel, HR process, or financial decision' },
      "Creative Arts, Animation and Design": { place: 'briefs, references, style defaults, image tools, platform rules, audience tests, and production pipelines', decision: 'a visual default, character choice, dataset, crop, lighting setup, or platform rule', people: 'viewers, clients, creators, performers, and people represented or erased by the work', pressure: 'a critique, rejected draft, changing brief, technical failure, or production deadline', setting: 'a studio, editing bay, platform feed, client presentation, or production pipeline' },
      "Education, Community and Social Services": { place: 'intake forms, risk notes, placement decisions, referrals, classroom records, and family files', decision: 'a screening question, risk label, placement rule, referral, or eligibility threshold', people: 'children, families, clients, frontline workers, teachers, and communities named in the record', pressure: 'a difficult placement, crisis call, family meeting, behaviour concern, or referral decision', setting: 'a classroom, agency, intake desk, program meeting, or family support plan' },
      "Engineering Technology": { place: 'specs, drawings, site measurements, safety margins, materials, drainage, access, and infrastructure defaults', decision: 'a standard, threshold, material, layout, measurement, or access choice', people: 'residents, workers, commuters, inspectors, and communities using the built space', pressure: 'a failed test, changed site condition, deadline, inspection issue, or team handoff', setting: 'a project site, public space, transport route, utility system, or housing development' },
      "Fashion and Esthetics": { place: 'shade ranges, skin analysis, product matching, client records, trend tools, portfolios, and service scripts', decision: 'a shade, image, service recommendation, product match, style default, or client note', people: 'clients, models, stylists, estheticians, and people whose bodies or skin are misread by the tool', pressure: 'a difficult client service, critique, trend shift, product mismatch, or event deadline', setting: 'a salon, studio, treatment room, runway, retail floor, or client consultation' },
      "Health and Wellness": { place: 'triage notes, patient records, assessment tools, care plans, referrals, devices, and risk scores', decision: 'a screen, score, referral, treatment priority, device reading, or care-plan choice', people: 'patients, families, practitioners, caregivers, and people missed by the tool', pressure: 'a high-stress placement, patient concern, difficult assessment, shift handoff, or care decision', setting: 'a clinic, hospital unit, treatment room, wellness program, or patient chart' },
      "Hospitality and Tourism": { place: 'booking systems, guest profiles, ratings, staffing, service recovery, travel access, and event plans', decision: 'a booking approval, room assignment, service script, rating, staffing call, or guest-risk flag', people: 'guests, workers, hosts, families, travellers, and people treated as risk by the system', pressure: 'a difficult guest, busy service, bad review, changed itinerary, or event problem', setting: 'a hotel, restaurant, event, booking desk, tour route, or guest-service counter' },
      "Information Technology": { place: 'requirements, data models, access controls, logs, tests, releases, dashboards, and support tickets', decision: 'a data field, default, permission, model output, test case, or release choice', people: 'users, clients, admins, support staff, and people denied access or misread by the system', pressure: 'a broken build, outage, new requirement, security issue, or support escalation', setting: 'a codebase, help desk, database, deployment pipeline, app screen, or security review' },
      "Law, Administration and Public Safety": { place: 'case notes, incident reports, policy thresholds, forms, discretion points, risk tools, and public safety records', decision: 'a flag, file note, eligibility rule, enforcement choice, priority level, or appeal path', people: 'clients, residents, officers, staff, witnesses, and people subject to the decision', pressure: 'a tense interaction, urgent file, policy conflict, client appeal, or public safety decision', setting: 'a counter, case file, dispatch desk, hearing room, patrol context, or public office' },
      "Liberal Arts and University Transfers": { place: 'source reading, seminar debate, research questions, evidence standards, writing choices, and disciplinary methods', decision: 'a definition, source choice, theory, evidence rule, research question, or argument structure', people: 'readers, communities studied, classmates, researchers, and people left out of the frame', pressure: 'a difficult reading, seminar debate, research pivot, writing block, or transfer decision', setting: 'a seminar, essay, research file, library search, or future discipline' },
      "Media and Communications": { place: 'story angles, audience data, platform ranking, public messaging, moderation, campaigns, and crisis response', decision: 'a headline, frame, edit, platform rule, source choice, or message priority', people: 'audiences, sources, communities in the story, clients, and people flattened by the narrative', pressure: 'a fast deadline, public response, client change, source conflict, or platform issue', setting: 'a newsroom, campaign room, social feed, client brief, podcast, or crisis channel' },
      "Science": { place: 'sampling, instruments, lab protocols, data cleaning, thresholds, models, and peer review', decision: 'a sample, measure, control, cutoff, instrument setting, or model assumption', people: 'participants, lab teams, patients, communities, and people whose data the method misses', pressure: 'a failed trial, lab error, uncertain result, deadline, or protocol change', setting: 'a lab, field site, dataset, protocol, instrument, or research report' }
    };
    var ctx = byArea[L && L.area] || { place: 'tools, records, standards, clients, decisions, and everyday work in the field', decision: 'a rule, threshold, tool, or professional judgment', people: 'clients, coworkers, communities, and people affected by the decision', pressure: 'a hard task, deadline, failed attempt, or team problem', setting: 'a workplace, client file, project, service, or public decision' };
    ctx = Object.assign({}, ctx);
    var spec = programSpecificProfile(L);
    if (spec) {
      ['place', 'decision', 'people', 'pressure', 'setting'].forEach(function (k) {
        if (spec[k]) ctx[k] = spec[k];
      });
    }
    ctx.label = label;
    return ctx;
  }
  function pfFirst(s) {
    var t = String(s || '').split(',')[0].trim();
    return t.replace(/^an? /, '');
  }
  function pfLast(s) {
    var parts = String(s || '').split(',');
    var t = (parts[parts.length - 1] || '').trim().replace(/^and /, '');
    return t || 'the people the process misses';
  }
  function pfPair(s) {
    var parts = String(s || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean);
    return parts.slice(0, 2).join(' and ').replace(/ and and /, ' and ');
  }
  function pfHash(s) {
    var h = 0; s = String(s || '');
    for (var i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    return Math.abs(h);
  }
  function areaCaseQuestions(area, o, name) {
    var d = pfFirst(o.decision), pl = pfPair(o.place), pe = pfLast(o.people), pr = pfFirst(o.pressure), st = pfFirst(o.setting);
    var BY = {
      'Business': [
        'A ' + d + ' fires during ' + pr + ' in ' + name + '. Whose file does it land on, what history set the threshold, and who signs off without ever seeing the person?',
        'Walk the exception path: once someone is flagged inside ' + pl + ', how many steps until a human with authority reviews it, and what would that human need to overturn it?',
        'If you pulled this process\u2019s outcomes by demographic the way you pull results by region, what pattern would you expect, and what would you do the day the pattern confirmed?',
        'What would ' + pe + ' say the process feels like from their side, and where could their evidence enter before the ' + d + ' becomes policy?'
      ],
      'Health and Wellness': [
        'It is ' + pr + ' and a ' + d + ' decides before you do. Which patient does it see accurately, which one does it misread, and what in its calibration history explains the difference?',
        'Chart the moment: inside ' + pl + ', where does the score\u2019s output become your documentation, and what happens downstream to whatever you write next?',
        'Who on your unit can override the ' + d + ', on what evidence, in how much time, and does ' + pe + ' ever learn an override was possible?',
        'If this tool were a medication, what would its monograph say about populations it was never trialled on, and would you still administer it unmonitored?'
      ],
      'Law, Administration and Public Safety': [
        'A ' + d + ' shapes the first contact during ' + pr + '. What record trained it, who entered that record, and could the person in front of you contest any of it in real time?',
        'Follow the file through ' + pl + ': at which step does the score stop being a suggestion and start being the reason, and who is accountable at that step?',
        'Apply R. v. Le\u2019s logic here: how does this same procedure land differently across the communities you serve, and what would your documentation need to show to make that reviewable?',
        'What lawful path exists for ' + pe + ' to challenge the outcome, how long does it take, and what does that delay cost them meanwhile?'
      ],
      'Information Technology': [
        'The ' + d + ' ships inside ' + pl + ' with a threshold someone set under ' + pr + '. Where is that threshold in the repo, who last touched it, and what test would catch its skew?',
        'Trace one false positive end to end: what did the user see, what did the logs keep, and could support reverse it without an engineer?',
        'Slice this system\u2019s error rates by population: which slice was never in the fixtures, and what would a regression test for ' + pe + ' actually assert?',
        'If you inherited this pipeline tomorrow, what provenance questions would you file before trusting its training data, and who could even answer them?'
      ],
      'Education, Community and Social Services': [
        'A ' + d + ' meets a child\u2019s file during ' + pr + '. What did the instrument assume about a normal family, and which of your actual families does that assumption turn into paperwork problems?',
        'Inside ' + pl + ', what does the flag make the next adult expect before they meet the person, and what could you write instead that would change that expectation?',
        'Who explains the decision to ' + pe + ', in what language, with what real chance of reversing it before it shapes services?',
        'If you disaggregated this program\u2019s outcomes by the families it claims to serve, what pattern do you already suspect, and what would you owe the families if you found it?'
      ],
      'Engineering Technology': [
        'The ' + d + ' was set against a reference case that is not everyone. Under ' + pr + ', who falls outside the tested envelope of ' + pl + ', and what failure mode do they experience first?',
        'Read the validation record like a stress report: which populations, conditions, and edge geometries were actually tested, and what does the silence in the matrix tell you?',
        'A demographic performance gap shows up in the field data for ' + st + ': write the root-cause chain from spec to harm, and mark the step where an engineer\u2019s signature could have stopped it.',
        'What would it cost to widen the envelope for ' + pe + ' now versus at design time, and who is currently paying the difference?'
      ],
      'Science': [
        'The ' + d + ' rests on a sampling frame someone chose. Under ' + pr + ', which population\u2019s data is thinnest in ' + pl + ', and what does the method report as fact anyway?',
        'Stratify the error: if the result holds on average and fails for ' + pe + ', what is the honest limitations paragraph, and where else has that paragraph been missing?',
        'Trace provenance like materials: what archive fed this instrument, who assembled it, under what consent, and what does that history predict about its blind spots?',
        'Design the follow-up study that the affected community would co-govern: what changes first, the question, the cohort, or the authorship?'
      ],
      'Aviation': [
        'A ' + d + ' fires at the checkpoint during ' + pr + '. Which traveller absorbs the friction, what upstream data put them there, and what does redress actually require of them?',
        'Treat the pattern like an occurrence: the same ' + d + ' keeps flagging the same demographics across ' + pl + '. Write the report: probable cause, contributing factors, corrective action.',
        'Where in the passenger-processing stack could ' + pe + ' see, contest, or correct the record that keeps routing them to secondary?',
        'If this system faced certification like an instrument, what demographic performance envelope would it have to publish, and would it pass?'
      ],
      'Hospitality and Tourism': [
        'A ' + d + ' quietly decides a guest\u2019s welcome during ' + pr + '. What does their arrival feel like, step by step, and at which step could staff still change the outcome?',
        'Audit the algorithmic guest journey through ' + pl + ' the way you would mystery-shop the human one: where does suspicion enter, and on what data?',
        'Which repeat friction would ' + pe + ' report if anyone asked, and why has no dashboard asked?',
        'Write the service-recovery protocol for an algorithmic decline: who apologizes, who overrides, and what changes so it stops recurring?'
      ],
      'Creative Arts, Animation and Design': [
        'The ' + d + ' inside ' + pl + ' has a learned taste. Put your own work through it: whose faces, bodies, and styles does it handle worst, and what does it quietly do to them?',
        'Under ' + pr + ', the default renders and nobody checks. What ships, who is erased or distorted in the final frame, and who approves it without noticing?',
        'Trace one asset\u2019s provenance: what archive taught the tool its defaults, and what would consent-based sourcing have changed about this exact output?',
        'Design the pipeline test that protects ' + pe + ': what does it check, at which stage, and what happens when it fails?'
      ],
      'Fashion and Esthetics': [
        'A ' + d + ' meets a real client in ' + st + ' during ' + pr + '. Which skin, hair, or body does it read confidently, whom does it misread, and what does the client walk away believing about themselves?',
        'Follow the assortment loop through ' + pl + ': what was never stocked, so never sold, so never forecast, and which client keeps arriving to find themselves missing?',
        'What would ' + pe + ' tell you the tools get wrong, and where in the buying or treatment workflow could their answer change the range?',
        'Write the validation standard you would demand before this tool touches a chair: tested on whom, verified how, refused when?'
      ],
      'Liberal Arts and University Transfers': [
        'Read the ' + d + ' as a text: who is its implied subject, what archive is its author, and what does it assume a normal case looks like inside ' + pl + '?',
        'Under ' + pr + ', the system\u2019s classification becomes the record. Trace how that record will be cited later as if it were neutral observation, and name the move.',
        'Whose testimony would count as evidence against this process, in what forum, and why is ' + pe + ' the least likely to be heard there?',
        'Place this mechanism in a lineage you have studied: what older practice does it continue, what changed with automation, and what does the continuity argument require you to prove?'
      ],
      'Media and Communications': [
        'A ' + d + ' decides reach during ' + pr + '. Who was shown the story, who never saw it, and what would the delivery data reveal that the content analytics hide?',
        'Cover this system as an institution: who sets its thresholds inside ' + pl + ', under what review, and what is your lede when the pattern lands on ' + pe + '?',
        'Trace one moderation decision end to end: what got flagged, by what training history, appealable to whom, and what did the silence cost the creator meanwhile?',
        'If this platform published its ranking criteria the way mastheads publish standards, what would the first correction have to be?'
      ]
    };
    var base = BY[area] || null;
    if (!base) return null;
    var ALT = {
      'Business': [
        [
          'Sit with the person on the wrong side of the ' + d + ': what do they receive, a letter, a hold, a silence, and what would they have to gather to fight it?',
          'Your manager asks why the numbers dipped in one segment. The honest answer runs through ' + pl + '. Draft the two sentences you would actually say.',
          'Find the oldest assumption still alive inside this workflow: what year does it come from, and what did the business look like then?',
          'If ' + pe + ' designed the exception process themselves, what is the first step they would delete?'
        ],
        [
          'Reconstruct the decision from the log alone: could an auditor tell why the ' + d + ' fired, or only that it did? What is missing from the record?',
          'Price the error: one wrongful flag inside ' + pl + ', multiplied across a quarter. Who absorbs that cost today, the firm or the flagged?',
          'Which incentive in this process rewards speed over scrutiny, and what would have to change in the bonus math for scrutiny to win?',
          'Write the memo line that would make ' + pr + ' a trigger for review instead of a reason to skip it.'
        ]
      ],
      'Health and Wellness': [
        [
          'Follow one patient through a shift where the ' + d + ' misreads them: chart the three moments a human could have caught it, and what each would have needed to notice.',
          'What does the patient hear when the number disagrees with their body, and who in the room is trained to believe which?',
          'Your preceptor trusts the tool completely. Compose the question you could ask that respects them and still opens the audit.',
          'Where does ' + pe + ' appear in the validation study, if at all? Go look; write down what you find.'
        ],
        [
          'Treat the score like a colleague: what is its scope of practice, who supervises it, and what happens when it exceeds both?',
          'Map the data trail from bedside to dashboard through ' + pl + ': at which hop does context get stripped, and who reads the stripped version?',
          'A near-miss review lands on your desk during ' + pr + ': write the contributing-factors line that names the tool without blaming the nurse.',
          'What consent did the patient actually give for this measurement, and what is being done with it that they never heard about?'
        ]
      ],
      'Law, Administration and Public Safety': [
        [
          'Cross-examine the ' + d + ' as if it were a witness: what did it observe, what did it infer, what is hearsay from its training data?',
          'The person flagged inside ' + pl + ' asks you directly: what is this based on? Give the answer you could defend to a supervisor and to them.',
          'Which part of this process would collapse if disclosure were mandatory, and what does that tell you about the part?',
          'Write the policy sentence that would give ' + pe + ' a route to correction that does not require a lawyer.'
        ],
        [
          'Run the counterfactual: same facts, no score. What would the officer, clerk, or adjudicator have done, and why did the score change it?',
          'Under ' + pr + ', discretion narrows. Where exactly does the tool absorb the discretion, and who owns the outcome now?',
          'Take one week of decisions through ' + pl + ' and sort them: score-confirmed, score-overridden, score-unquestioned. What does the third pile tell you?',
          'What would a Le-style contextual analysis add to this process, and which paragraph of your report would carry it?'
        ]
      ],
      'Information Technology': [
        [
          'Write the incident ticket for a harm with no crash: what is the severity, what is the repro, and who gets paged when the victim is a demographic?',
          'The PM wants the ' + d + ' threshold lowered to hit a KPI during ' + pr + '. Write your comment on that PR.',
          'Which dashboard would show this system quietly failing ' + pe + ', and does that dashboard exist? If not, that is the sprint.',
          'Trace one label back through ' + pl + ' to the human who created it: what were they paid, what were they told, what did they assume?'
        ],
        [
          'Read the system like an attacker who wants unfairness: where is the cheapest place to make it discriminate, and is anyone watching that surface?',
          'Diff the docs against the deployment: what does the model card claim that the logs cannot verify?',
          'You inherit this code with no handover. What test do you write first to learn who it fails?',
          'The vendor calls the bias fixed. Design the two-week check that would make you believe them, or not.'
        ]
      ],
      'Education, Community and Social Services': [
        [
          'Sit in the parent seat: the ' + d + ' has flagged your child and the meeting is tomorrow. What do you not know, and who could have told you sooner?',
          'Find the moment the number became the narrative in one file you know: which sentence did it write, and who signed it?',
          'What does pushing back look like from inside your role during ' + pr + ', concretely, without losing the placement or the job?',
          'Design the one question every intake through ' + pl + ' should ask that none currently does.'
        ],
        [
          'Take the tool\u2019s vendor page into supervision: which promise would your families laugh at, and what does that tell the procurement committee?',
          'Whose language does the system speak, literally: which of your families signs forms they cannot read, and what has that already cost them?',
          'Track one child\u2019s flag across agencies through ' + pl + ': who saw it, what did each add, and where could it have been retired?',
          'Write the strengths-based sentence that could sit beside the risk score in the same file, and would survive an audit.'
        ]
      ],
      'Engineering Technology': [
        [
          'Do the tolerance stack on people: each subsystem within spec, whose use case falls outside the stack-up, and where did their margin go?',
          'The field data disagrees with the lab data for ' + pe + '. Which instrument do you trust, and what does the discrepancy tell you about the test plan?',
          'Draft the requirement line that was missing: measurable, testable, and covering the population the ' + d + ' currently fails.',
          'What would preventive maintenance look like for fairness on ' + pl + ': what drifts, on what schedule, checked by whom?'
        ],
        [
          'Reverse-engineer the assumption: given how this system fails, reconstruct the test population it was built on.',
          'Under ' + pr + ', someone signs the acceptance anyway. Write the dissent memo you would want on record, in three sentences.',
          'Which cheaper sensor, dataset, or shortcut created this exposure, and what did the savings actually buy?',
          'Spec the recall criteria: what measured gap on ' + pe + ' would trigger one, and why is that number not already in the contract?'
        ]
      ],
      'Science': [
        [
          'Referee your own field: the paper validates the ' + d + ' on aggregate metrics during ' + pr + '. Write the review comment that blocks publication until it stratifies.',
          'What would a replication in a different population cost, and what is the field currently spending on not knowing?',
          'Trace the citation chain: who first normalized this baseline in ' + pl + ', and does anyone cite the limitation or only the convenience?',
          'Design the smallest experiment that would surface the gap for ' + pe + ', cheap enough that no one can refuse it.'
        ],
        [
          'Treat the dataset as a field site: who gatekept entry, what was recorded as noise, and whose absence is load-bearing?',
          'The instrument disagrees with the community\u2019s lived report. Write the research question that takes both seriously.',
          'Which grant incentive keeps this blind spot funded, and what would the program officer need to hear to move it?',
          'Pre-register your own bias: before running it, write down which result would surprise you and why.'
        ]
      ],
      'Aviation': [
        [
          'Fly the passenger\u2019s leg: from curb to gate, log every automated decision that touched them, and mark the two they never saw.',
          'The ' + d + ' alarms on the same profile again during ' + pr + '. Write the ASRS-style report: what happened, what usually happens, what should happen.',
          'What does just-culture reporting look like for algorithmic screening: who can file without career risk, and where does the report go?',
          'Which airport in the network would show the pattern first for ' + pe + ', and why does the data never get pooled?'
        ],
        [
          'Run the checklist discipline on the checkpoint: what is the challenge-and-response for a machine decision, and who is pilot-in-command of it?',
          'Compare the redress queue to the maintenance backlog: which gets cleared faster inside ' + pl + ', and what does the difference say about priorities?',
          'What would a line operations safety audit find if it shadowed the ' + d + ' for a week?',
          'Draft the crew briefing line that tells staff what to do when the system flags someone the officer would not have.'
        ]
      ],
      'Hospitality and Tourism': [
        [
          'Replay the stay from the declined side: the booking that never confirmed, the deposit that doubled. Write the review they never posted.',
          'Front desk, 11 pm, ' + pr + ': the system says no and the guest is standing there. Script the sixty seconds that follow, both ways.',
          'Which loyalty tier would this friction be intolerable for, and why is it tolerable below it?',
          'Mystery-shop your own stack in ' + pl + ': book as two different profiles and log where the journeys split.'
        ],
        [
          'Cost the suspicion: every extra verification for ' + pe + ' is seconds, staff time, and a story told to friends. Put numbers on one month of it.',
          'The ' + d + ' protects revenue; who protects the guest it misjudges, and is that role staffed tonight?',
          'Trace one flag across brands: does it travel with the guest, and who could see it, dispute it, delete it?',
          'Write the standard-operating line that turns an automated decline into a human welcome without breaking compliance.'
        ]
      ],
      'Creative Arts, Animation and Design': [
        [
          'Storyboard the failure: panel one, the subject; panel two, what the ' + d + ' saw; panel three, what shipped. Caption each honestly.',
          'Open your own portfolio through ' + pl + ': which piece would the tool have altered, and would you have caught it on deadline?',
          'Whose reference images are missing from your studio\u2019s library, and what does every render inherit from that absence?',
          'Design the credit line for training data: what would honest provenance look like on the final frame?'
        ],
        [
          'Brief the tool as a junior artist: what taste did it arrive with during ' + pr + ', and what would you have to unteach first?',
          'Find the default you have been compensating for by hand: what does the workaround cost per project, and who never learned it?',
          'A client asks for everyone in the campaign. Audit ' + pl + ' for where everyone quietly narrows.',
          'What would ' + pe + ' see in your output that the crit room misses, and how do you get them into the room?'
        ]
      ],
      'Fashion and Esthetics': [
        [
          'Stand at the counter with the client the ' + d + ' cannot read: what happens in the next ninety seconds, and what does she buy instead, nothing?',
          'Pull last season\u2019s sell-through for the shades that were never displayed at eye level: what did placement decide before demand could?',
          'Which certification, school unit, or trade test still teaches the default body inside ' + pl + ', and what would updating it cost?',
          'Write the product brief line that makes coverage across ' + pe + ' a launch requirement, not a line extension.'
        ],
        [
          'Reverse the flow: start from the client the industry calls niche during ' + pr + ' and design the range outward from her.',
          'The rep says the tool is inclusive now. Which three clients from your own chair would you test it on before believing it?',
          'Trace one trend the forecast missed because the data never saw its community: where did it live before the industry noticed?',
          'What does the return rate hide inside ' + pl + ': who stopped returning because they stopped buying?'
        ]
      ],
      'Liberal Arts and University Transfers': [
        [
          'Periodize the ' + d + ': what did this decision look like in 1950, 1990, and now, and what actually changed besides the interface?',
          'Write the footnote the system cannot: what context about ' + pe + ' would change the reading of its output entirely?',
          'Whose account survives in the record produced by ' + pl + ', and what genre is that record, testimony, surveillance, or bureaucracy?',
          'Translate the concept across two of your disciplines: what does this mechanism gain and lose in each vocabulary?'
        ],
        [
          'Read the interface as rhetoric: what does its confidence perform during ' + pr + ', and on whom does the performance work?',
          'Find the archive behind the archive: what collection, census, or ledger ultimately feeds this system, and who compiled it, under what power?',
          'Draft the seminar question that would make a defender of this system say something falsifiable.',
          'What would count as evidence that the pattern ended, and who gets to certify it?'
        ]
      ],
      'Media and Communications': [
        [
          'Pitch the story twice: once as a tech piece about the ' + d + ', once as a story about ' + pe + '. Which desk buys which, and what dies in the difference?',
          'FOI the threshold: draft the exact records request that would surface how ' + pl + ' decides, and predict the denial.',
          'Your own outlet uses the same stack during ' + pr + ': write the disclosure sentence that should sit under the story.',
          'Find the source the algorithm silenced: whose reach dropped when the model changed, and what were they saying?'
        ],
        [
          'Fact-check the feed itself: sample fifty items and code who is shown as threat, victim, expert. Publish the method with the count.',
          'The platform offers you the data under embargo. What conditions do you accept, refuse, and counter, and why?',
          'Write the correction the recommender owes: what would making the harmed audience whole even look like in distribution terms?',
          'Which beat reporter had this story five years early and was not believed, and what does that say about your desk\u2019s sourcing?'
        ]
      ]
    };
    var alts = ALT[area];
    if (!alts) return base;
    var pick = pfHash(name) % (alts.length + 1);
    return pick === 0 ? base : alts[pick - 1];
  }
  function programSpecificProfile(L) {
    if (!L || !L.program) return null;
    var name = L.program, area = L.area || programAreaForName(name) || '', p = name.toLowerCase();
    function pack(o) {
      o.label = name;
      o.area = area;
      o.overview = o.overview || (name + ' gives the course a concrete place to look: the tools, records, standards, and decisions students meet in this program.');
      o.interface = o.interface || ('The course themes show up in ' + name + ' when a routine tool, record, or standard looks neutral but sorts people unevenly.');
      o.practice = o.practice || ('For ' + name + ', put each week beside the program tools, records, standards, clients, and decisions you are learning to handle. Ask who benefits, who carries risk, and who can challenge a bad outcome.');
      o.focus = o.focus || ('For this program, pay close attention to the systems, records, standards, people, and decision points that shape everyday work in ' + name + '.');
      o.caseQuestions = o.caseQuestions || areaCaseQuestions(area, o, name) || [
        'Which tool, record, standard, client interaction, or professional judgment would shape the first decision in ' + name + '?',
        'Who is easiest for that process to see, and who becomes an exception, a delay, or a problem to manage?',
        'What evidence from affected people would change the decision before it becomes routine?',
        'How would you make the decision reviewable by someone harmed by it?'
      ];
      var nuance = titleNuance(name, area);
      if (nuance) {
        var boundary = programBoundaryPhrase(name, area);
        o.topics = uniqList([nuance.topic, 'Program-specific boundary: ' + boundary].concat(o.topics || []));
        o.artifacts = uniqList([nuance.artifact, 'A program-specific artifact from the ' + boundary + ' context'].concat(o.artifacts || []));
        o.overview = o.overview + ' ' + nuance.note;
        o.interface = o.interface + ' For this specific option, the course question is: ' + nuance.question;
        o.question = nuance.question || o.question;
      }
      return o;
    }
    if (p === 'general stream' || area === 'General stream') {
      return pack({
        place: 'apps, forms, screens, cameras, scores, search results, feeds, school systems, workplace tools, public-service portals, and everyday policies',
        decision: 'a ranking, rule, score, setting, default, label, recommendation, flag, approval, or denial',
        people: 'students, workers, users, renters, patients, travellers, families, communities, and people affected by ordinary digital systems',
        pressure: 'a confusing form, unfair result, search problem, service delay, unexpected flag, or public system that feels hard to challenge',
        setting: 'daily life, school, work, housing, health care, travel, media, shopping, banking, policing, or public services',
        topics: ['everyday digital sorting', 'search and feed rankings', 'public-service forms', 'screening rules', 'automated recommendations'],
        artifacts: ['a screenshot', 'a form field', 'a policy line', 'a score output', 'a notice or result screen'],
        question: 'Ask what the system does, who it sorts, who benefits, who is exposed, and who can challenge the outcome.',
        focus: 'For the General Stream, start with one ordinary digital system you can actually see. The course works best when you choose a concrete screen, form, rule, score, or platform moment instead of a broad social issue.',
        overview: 'The General Stream is for students who do not want to connect the course to one program yet. It still gives a strong path: choose one ordinary digital system from daily life, school, work, housing, health, media, finance, travel, policing, or public services.',
        interface: 'Techno-racism can appear in everyday systems when a neutral-looking screen, rule, score, label, camera, or platform decision makes some people easier to trust, serve, find, flag, or ignore.',
        weeks: [2, 5, 6, 10, 12],
        caseQuestions: [
          'What exact system, screen, form, score, rule, or platform moment are you looking at?',
          'What did the system do before anyone explained or judged it?',
          'Who moved through easily, and who was delayed, watched, hidden, misread, or given extra work?',
          'What evidence would let a person question, correct, or appeal the outcome?'
        ]
      });
    }
    if (area === 'Aviation') {
      if (/flight training|aviation technology/.test(p)) return pack({ place: 'flight deck procedures, simulator records, navigation decisions, weather limits, crew-resource notes, and training check rides', decision: 'a go/no-go call, automation mode, proficiency threshold, checklist interpretation, or weather margin', people: 'student pilots, instructors, passengers, dispatchers, crew, and people affected by a safety call', pressure: 'a weather change, failed approach, automation surprise, training assessment, or cockpit handoff', setting: 'a simulator, flight deck, briefing room, runway environment, or training flight', topics: ['simulator scoring', 'automation-mode choices', 'weather minima', 'crew-resource management', 'check ride records'], artifacts: ['a training record', 'a checklist item', 'a simulator score', 'a weather note', 'a debrief comment'], question: 'Ask who the flight system treats as ready, risky, credible, or in need of manual review, and how that judgment can be challenged.', focus: 'For this program, pay attention to how cockpit automation, safety margins, checklists, and training records decide who is trusted to act.', overview: name + ' connects the course to flight judgment. Students can examine how training records, cockpit automation, and safety thresholds decide who is trusted as competent.', interface: 'Techno-racism can enter when a supposedly objective performance record, simulation score, or risk threshold ignores context and turns unequal access to training into a neutral-looking judgment.', weeks: [4, 5, 6, 12] });
      if (/safety/.test(p)) return pack({ place: 'safety reports, occurrence databases, audit trails, hazard matrices, compliance checks, and investigation records', decision: 'a hazard rating, incident classification, risk threshold, investigation priority, or safety recommendation', people: 'flight crews, safety officers, passengers, maintenance teams, investigators, and communities affected by aviation risk', pressure: 'a reported hazard, data gap, incident investigation, audit finding, or corrective-action deadline', setting: 'a safety office, hangar, incident review, flight-data meeting, or regulatory audit', topics: ['hazard matrices', 'incident reports', 'flight-data monitoring', 'corrective-action systems', 'audit findings'], artifacts: ['a hazard report', 'a risk matrix', 'an incident category', 'an audit note', 'a corrective-action log'], question: 'Ask what the safety system counts as evidence, whose report is taken seriously, and who is protected when the finding is acted on.', focus: 'For this program, pay attention to safety data, incident records, risk matrices, and the people left exposed when evidence is incomplete.', overview: name + ' connects the course to risk evidence. Students can examine how aviation safety systems classify hazards and decide which risks become visible.', interface: 'Techno-racism can appear when safety databases and audit systems treat incomplete reporting, uneven surveillance, or unequal credibility as neutral evidence.', weeks: [3, 4, 6, 12] });
      if (/operations|management/.test(p)) return pack({ place: 'dispatch systems, gate dashboards, crew scheduling, route planning, delay codes, passenger-flow tools, and operational handoffs', decision: 'a route change, dispatch release, delay code, crew assignment, gate decision, or service recovery choice', people: 'passengers, dispatchers, crew, gate agents, ground handlers, and people delayed or rerouted by operations systems', pressure: 'a weather disruption, crew shortage, aircraft swap, missed connection, passenger issue, or schedule recovery', setting: 'an operations centre, gate area, dispatch desk, ramp, or airline control room', topics: ['crew scheduling', 'dispatch records', 'delay coding', 'passenger-flow dashboards', 'gate decision systems'], artifacts: ['a dispatch release', 'a delay code', 'a crew schedule', 'a gate dashboard', 'a passenger-service note'], question: 'Ask who the operations system moves smoothly, who it delays, and whether the person affected can understand or challenge the decision.', focus: 'For this program, pay attention to dispatch data, crew schedules, delay codes, and passenger-flow dashboards that turn operational pressure into decisions about people.', overview: name + ' connects the course to the hidden decisions that keep flights moving. Students can inspect how operational tools sort passengers, crews, aircraft, and delays.', interface: 'Techno-racism can appear when delay codes, watchlist checks, staffing assumptions, or passenger-flow tools turn old patterns of suspicion into routine operations.', weeks: [6, 10, 12] });
      return pack({ place: 'reservation records, boarding systems, cabin manifests, service notes, accessibility requests, passenger screening, and irregular-operations files', decision: 'a boarding flag, seating decision, service priority, screening referral, accessibility accommodation, or passenger handoff', people: 'travellers, cabin crew, gate staff, families, disabled passengers, racialized passengers, and people flagged by travel systems', pressure: 'a full flight, disrupted itinerary, difficult service moment, passenger concern, or security handoff', setting: 'a gate, cabin, check-in desk, boarding bridge, or passenger-service counter', topics: ['biometric boarding', 'passenger manifests', 'accessibility requests', 'service-recovery notes', 'screening referrals'], artifacts: ['a boarding pass message', 'a cabin manifest', 'a service note', 'an accessibility request', 'a screening notice'], question: 'Ask who gets welcomed, questioned, delayed, accommodated, or sent for manual review, and whether the passenger can challenge that treatment.', focus: 'For this program, pay attention to passenger-facing records, boarding systems, service notes, and the handoffs where customer care meets surveillance.', overview: name + ' connects the course to passenger movement and service. Students can examine how travel systems decide who is welcomed smoothly and who is treated as a problem.', interface: 'Techno-racism can appear when names, faces, documents, disability needs, or travel histories are processed as risk instead of context.', weeks: [5, 6, 10] });
    }
    if (area === 'Business') {
      if (/account|payroll|forensic|fraud/.test(p)) return pack({ place: 'ledger systems, payroll files, audit trails, fraud flags, expense rules, tax records, internal controls, and compliance dashboards', decision: 'a reconciliation rule, fraud threshold, payroll exception, audit sample, expense flag, or approval workflow', people: 'clients, employees, vendors, auditors, payroll staff, and people whose records are flagged or delayed', pressure: 'a month-end close, payroll exception, audit request, suspicious transaction, or compliance deadline', setting: 'an accounting office, payroll file, audit room, client ledger, or compliance review', topics: ['fraud flags', 'payroll exceptions', 'credit records', 'audit sampling', 'expense approvals'], artifacts: ['a ledger note', 'a payroll exception', 'a fraud alert', 'an audit trail', 'a control checklist'], question: 'Ask who the financial rule protects, who it suspects, what proxy variable may be doing the sorting, and how a person can correct the record.', focus: 'For this program, pay attention to financial records, audit trails, payroll systems, and fraud rules that can turn unequal data into official decisions.', overview: name + ' connects the course to records that look factual because they are numeric. Students can inspect how financial tools classify risk, credibility, and compliance.', interface: 'Techno-racism can appear when a neutral-looking financial rule uses credit history, address, employment pattern, or transaction data as a proxy for trust.', weeks: [2, 3, 10, 12] });
      if (/human resources/.test(p)) return pack({ place: 'applicant-tracking systems, interview rubrics, HRIS records, performance dashboards, attendance rules, and accommodation files', decision: 'a resume screen, ranking score, interview threshold, performance flag, scheduling rule, or accommodation workflow', people: 'job applicants, employees, recruiters, managers, union representatives, and workers filtered by the system', pressure: 'a hiring deadline, performance concern, accommodation request, staffing shortage, or complaint', setting: 'an HR office, applicant portal, interview panel, payroll system, or employee file', topics: ['resume screening', 'interview rubrics', 'HRIS flags', 'performance dashboards', 'accommodation workflows'], artifacts: ['a job filter', 'an interview rubric', 'a ranking score', 'an HRIS field', 'a performance note'], question: 'Ask who gets screened out before human review, who is treated as a fit, and what evidence would let an applicant or worker challenge the decision.', focus: 'For this program, pay attention to hiring technology, HR records, performance systems, and accommodation workflows that turn workplace judgment into data.', overview: name + ' connects the course to employment decisions. Students can examine how hiring and workplace systems decide who belongs, who advances, and who must prove themselves.', interface: 'Techno-racism can appear when a hiring model learns old workplace patterns and presents them as an objective ranking of people.', weeks: [3, 10, 11, 12] });
      if (/marketing|advertising|social media|sports|event/.test(p)) return pack({ place: 'audience segments, campaign dashboards, ad targeting, social metrics, fan databases, sponsorship analytics, and brand-safety tools', decision: 'a target segment, creative default, spend allocation, audience score, venue-screening choice, or platform recommendation', people: 'customers, fans, creators, communities represented in campaigns, and people excluded or over-targeted by marketing systems', pressure: 'a campaign launch, client demand, event problem, low conversion rate, sponsorship report, or public response', setting: 'a campaign room, brand dashboard, event venue, social platform, or client presentation', topics: ['ad targeting', 'audience segmentation', 'brand-safety filters', 'fan analytics', 'campaign dashboards'], artifacts: ['a target segment', 'an audience metric', 'a platform rule', 'a creative brief', 'a sponsorship report'], question: 'Ask who the campaign treats as valuable, who it stereotypes or excludes, and who controls the story the brand circulates.', focus: 'For this program, pay attention to audience data, campaign defaults, platform metrics, and the way marketing systems decide whose attention counts.', overview: name + ' connects the course to public persuasion. Students can inspect how data-driven marketing sorts audiences and turns representation into a business decision.', interface: 'Techno-racism can appear when ad systems repeat stereotypes, exclude communities from opportunity, or use engagement metrics that reward harmful visibility.', weeks: [2, 9, 10, 12] });
      if (/supply|logistics|transportation|customs|international/.test(p)) return pack({ place: 'ERP records, customs documents, vendor ratings, route plans, warehouse dashboards, procurement rules, and compliance checks', decision: 'a supplier score, customs flag, route priority, inventory rule, procurement threshold, or delivery exception', people: 'customers, suppliers, warehouse staff, drivers, border officers, communities near routes, and people affected by trade decisions', pressure: 'a delayed shipment, supplier dispute, customs hold, stockout, compliance deadline, or route disruption', setting: 'a warehouse, customs file, procurement meeting, logistics dashboard, or supply-chain control room', topics: ['supplier scoring', 'customs holds', 'route optimization', 'warehouse dashboards', 'procurement thresholds'], artifacts: ['a vendor scorecard', 'a customs notice', 'a route exception', 'an ERP field', 'a procurement rule'], question: 'Ask who gains speed from the system, who carries the delay or surveillance burden, and how the decision can be reviewed.', focus: 'For this program, pay attention to logistics records, supplier scores, border paperwork, and optimization systems that make people and communities feel the cost of efficiency.', overview: name + ' connects the course to movement, trade, and hidden labour. Students can examine how supply-chain systems decide what moves fast, what gets held, and whose work is made invisible.', interface: 'Techno-racism can appear when trade and logistics systems use country, address, vendor history, or labour data in ways that turn global inequality into a neutral business rule.', weeks: [6, 9, 10, 12] });
      if (/financial|finance|insurance|asset|fintech/.test(p)) return pack({ place: 'credit models, insurance quotes, portfolio dashboards, risk ratings, client onboarding, fraud screens, and regulatory records', decision: 'a credit approval, premium adjustment, suitability flag, risk rating, fraud rule, or client-segmentation choice', people: 'clients, borrowers, policyholders, advisors, compliance staff, and people priced out or flagged by financial systems', pressure: 'a loan decision, insurance claim, compliance review, client onboarding, market change, or suspicious activity alert', setting: 'a branch, brokerage desk, insurance file, compliance office, fintech app, or client dashboard', topics: ['credit scoring', 'insurance pricing', 'risk ratings', 'client onboarding', 'fraud screens'], artifacts: ['a credit decision', 'a premium quote', 'a risk score', 'a suitability note', 'a fraud alert'], question: 'Ask what the financial system treats as trust, who pays more for that definition, and whether a client can correct or appeal the output.', focus: 'For this program, pay attention to credit, insurance, risk, and financial-technology systems that can make unequal histories look like individual risk.', overview: name + ' connects the course to automated financial trust. Students can inspect how financial systems price, approve, reject, and suspect people.', interface: 'Techno-racism can appear when financial models use address, income history, banking access, or past exclusions as neutral evidence of risk.', weeks: [2, 10, 12] });
      if (/office administration/.test(p)) return pack({ place: 'office records, scheduling tools, client files, correspondence templates, intake forms, database fields, and workflow dashboards', decision: 'a filing category, appointment priority, routing rule, form field, data-entry choice, or access permission', people: 'clients, patients, lawyers, managers, coworkers, and people whose files are routed or misread by office systems', pressure: 'a deadline, missing document, urgent appointment, file conflict, privacy concern, or manager request', setting: 'an office, front desk, client file, shared drive, records system, or scheduling screen', topics: ['client intake forms', 'scheduling rules', 'records access', 'workflow dashboards', 'file categories'], artifacts: ['an intake field', 'a calendar rule', 'a database field', 'a template line', 'a file note'], question: 'Ask how routine office records shape who is seen as urgent, credible, complete, or difficult, and who can correct the file.', focus: 'For this program, pay attention to the small administrative choices that turn into official records, access, and service pathways.', overview: name + ' connects the course to the office systems that make institutional decisions possible. Students can inspect how routine records shape access and trust.', interface: 'Techno-racism can appear when an administrative category, missing field, or template turns unequal assumptions into a permanent record.', weeks: [4, 8, 10] });
      if (/analytics|data/.test(p)) return pack({ place: 'datasets, dashboards, predictive models, KPIs, data-cleaning rules, visualizations, and decision reports', decision: 'a model feature, dashboard metric, threshold, segmentation rule, confidence score, or reporting choice', people: 'customers, workers, managers, analysts, communities in the data, and people misclassified by the model', pressure: 'a forecast request, dashboard deadline, model drift, stakeholder demand, missing data, or audit question', setting: 'an analytics team, dashboard review, data warehouse, model notebook, or business report', topics: ['predictive models', 'segmentation rules', 'dashboard metrics', 'data-cleaning choices', 'KPI thresholds'], artifacts: ['a data dictionary', 'a dashboard tile', 'a model feature', 'a confusion matrix', 'a reporting note'], question: 'Ask what the model is really measuring, whose data is missing, and what result would prove the tool is harming a group.', focus: 'For this program, pay attention to features, proxies, thresholds, visualizations, and the decisions that convert data into authority.', overview: name + ' connects the course to the act of turning data into decisions. Students can inspect how models and dashboards make inequality look like evidence.', interface: 'Techno-racism can appear when a model uses a proxy for race, treats missing data as neutral, or hides group harm inside an average score.', weeks: [3, 5, 10, 12] });
      return pack({ place: 'management dashboards, customer records, vendor platforms, hiring systems, pricing tools, operations reports, and policy documents', decision: 'a hiring choice, customer segment, pricing rule, vendor recommendation, performance target, or approval workflow', people: 'customers, staff, applicants, suppliers, managers, and people filtered out before human review', pressure: 'a sales target, complaint, staffing issue, vendor pitch, budget decision, or compliance concern', setting: 'an office, store, client file, HR process, sales funnel, or management meeting', topics: ['hiring screens', 'pricing tools', 'customer segmentation', 'vendor AI recommendations', 'performance dashboards'], artifacts: ['a dashboard metric', 'a job filter', 'a pricing rule', 'a vendor claim', 'a customer segment'], question: 'Ask who the business system rewards, who it filters out, and what human explanation or appeal path exists.', focus: 'For this program, pay attention to business systems that turn people into scores, segments, targets, and workflow exceptions.', overview: name + ' connects the course to practical business decisions. Students can inspect how tools used for efficiency also decide who gets opportunity, credit, service, or scrutiny.', interface: 'Techno-racism can appear when a business tool treats old customer, hiring, credit, or neighbourhood patterns as neutral evidence for future decisions.', weeks: [2, 10, 12] });
    }
    if (area === 'Creative Arts, Animation and Design') {
      if (/3d|animation|game|visual effects/.test(p)) return pack({ place: 'asset libraries, motion rigs, rendering defaults, facial references, lighting tools, game engines, and production pipelines', decision: 'a model reference, rigging default, skin shader, lighting setup, dataset, crop, or engine assumption', people: 'characters, players, actors, viewers, artists, and communities represented or erased by the visual system', pressure: 'a production deadline, render issue, critique, client note, reference gap, or technical handoff', setting: 'an animation studio, game pipeline, compositing desk, render review, or asset library', topics: ['character rigs', 'lighting defaults', 'asset libraries', 'facial references', 'rendering pipelines'], artifacts: ['a model sheet', 'a render test', 'a reference board', 'a shader setting', 'a pipeline note'], question: 'Ask whose face, body, motion, and skin the visual system was built around, and who has to fight the default.', focus: 'For this program, pay attention to the technical image pipeline: models, rigs, shaders, lighting, reference sets, and the bodies they treat as normal.', overview: name + ' connects the course to visual systems that build people on screen. Students can inspect how technical defaults shape representation before an audience ever sees the work.', interface: 'Techno-racism can appear when a visual pipeline handles some skin, hair, movement, or facial features poorly and treats the failure as an edge case.', weeks: [5, 11, 12] });
      if (!/floral/.test(p) && /graphic|interactive|design|advertising|visual content/.test(p)) return pack({ place: 'brand systems, UX flows, image generators, accessibility checks, campaign briefs, layout defaults, and audience tests', decision: 'a visual hierarchy, interface default, prompt result, brand choice, accessibility trade-off, or audience frame', people: 'users, viewers, clients, communities represented in the work, and people excluded by the design', pressure: 'a client pitch, usability issue, campaign deadline, accessibility review, or platform change', setting: 'a design studio, UX review, campaign board, prototype test, or client presentation', topics: ['UX defaults', 'image-generator outputs', 'brand systems', 'audience testing', 'accessibility checks'], artifacts: ['a prompt result', 'a wireframe', 'a brand guideline', 'a usability note', 'a campaign frame'], question: 'Ask whose needs the design centers, whose story becomes decorative, and who can change the design before it ships.', focus: 'For this program, pay attention to interface defaults, visual systems, prompts, and campaign frames that decide who feels included or ignored.', overview: name + ' connects the course to designed experience. Students can inspect how visual and interface choices turn assumptions about users into finished work.', interface: 'Techno-racism can appear when a design tool, campaign, or interface treats one culture, body, language, or user path as the default.', weeks: [2, 5, 11, 12] });
      if (/music|songwriting|acting|camera|voice/.test(p)) return pack({ place: 'casting calls, voice references, platform algorithms, streaming metadata, audition tapes, production notes, and audience analytics', decision: 'a casting category, voice match, recommendation tag, performance note, playlist rule, or audience metric', people: 'performers, listeners, viewers, casting teams, producers, and artists whose work is misread or buried by platforms', pressure: 'an audition, release deadline, audience target, producer note, platform change, or performance critique', setting: 'a studio, stage, audition room, streaming platform, recording session, or production meeting', topics: ['casting categories', 'voice references', 'streaming metadata', 'recommendation tags', 'audition notes'], artifacts: ['a casting notice', 'a platform tag', 'an audition note', 'a playlist category', 'a production brief'], question: 'Ask whose voice, body, accent, genre, or story is treated as marketable, risky, authentic, or invisible.', focus: 'For this program, pay attention to performance categories, platform tags, casting defaults, and who controls the meaning of a voice or story.', overview: name + ' connects the course to performance and cultural circulation. Students can inspect how platforms and production systems decide who is heard, seen, and categorized.', interface: 'Techno-racism can appear when casting systems, platform tags, or audience metrics turn racialized expectations into ordinary creative decisions.', weeks: [2, 9, 12] });
      return pack({ place: 'portfolios, reference boards, merchandising plans, design briefs, client concepts, material choices, and display systems', decision: 'a reference choice, display default, material decision, style label, client brief, or visual standard', people: 'clients, viewers, makers, shoppers, communities represented in the work, and people left outside the visual frame', pressure: 'a critique, event setup, client request, limited materials, portfolio review, or display deadline', setting: 'a studio, shop floor, gallery, portfolio review, floral workspace, or merchandising display', topics: ['reference boards', 'portfolio platforms', 'display standards', 'material choices', 'client briefs'], artifacts: ['a reference image', 'a display plan', 'a portfolio page', 'a material note', 'a client brief'], question: 'Ask whose taste, body, culture, and story are treated as the standard, and who gets made into an exception.', focus: 'For this program, pay attention to references, display decisions, portfolios, and client briefs that shape what counts as beautiful, professional, or visible.', overview: name + ' connects the course to the politics of looking. Students can inspect how creative choices carry assumptions about people and culture.', interface: 'Techno-racism can appear when a creative standard presents one body, culture, or style as neutral and others as special cases.', weeks: [2, 5, 11] });
    }
    if (area === 'Education, Community and Social Services') {
      if (/911|emergency/.test(p)) return pack({ place: 'call-taking software, dispatch codes, location data, risk flags, scripted questions, and handoff notes', decision: 'a dispatch priority, call category, risk flag, script prompt, unit recommendation, or caller credibility judgment', people: 'callers, dispatchers, responders, families, residents, and people described in crisis records', pressure: 'a high-stress call, incomplete information, language barrier, risk flag, or responder handoff', setting: 'a communications centre, dispatch screen, incident queue, radio handoff, or call record', topics: ['dispatch codes', 'call-taking scripts', 'risk flags', 'location data', 'handoff notes'], artifacts: ['a call code', 'a script prompt', 'a dispatch note', 'a location flag', 'an incident record'], question: 'Ask how the emergency record defines risk, whose voice is believed, and who can correct the record after the crisis.', focus: 'For this program, pay attention to dispatch categories, call records, risk flags, and the speed at which a stressful moment becomes official data.', overview: name + ' connects the course to emergency records. Students can inspect how crisis systems turn partial information into urgent decisions.', interface: 'Techno-racism can appear when a caller, address, accent, neighbourhood, or prior contact is processed as risk before the person is fully heard.', weeks: [4, 6, 10] });
      if (/police|investigation|enforcement|firefighter/.test(p)) return pack({ place: 'incident reports, dispatch records, body-camera policies, investigative databases, risk tools, enforcement thresholds, and complaint pathways', decision: 'a risk flag, enforcement priority, investigative lead, report category, use-of-discretion point, or appeal pathway', people: 'residents, complainants, witnesses, accused people, officers, families, and racialized communities', pressure: 'a tense call, incomplete report, safety concern, investigation deadline, public complaint, or risk-alert handoff', setting: 'a dispatch desk, patrol context, interview room, incident file, training scenario, or public safety meeting', topics: ['incident reports', 'body-camera rules', 'facial recognition searches', 'risk flags', 'complaint pathways'], artifacts: ['a report field', 'a risk flag', 'a policy threshold', 'a dispatch record', 'an appeal instruction'], question: 'Ask who gets marked as risk, who gets believed, what data fed the decision, and how the person can challenge the outcome.', focus: 'For this program, pay attention to public safety records, risk tools, discretion points, and the rights of people affected by state power.', overview: name + ' connects the course to public safety decisions. Students can inspect how records, risk tools, and enforcement systems can make suspicion look objective.', interface: 'Techno-racism can appear when over-policing becomes data, then that data becomes a risk score or investigative priority that appears neutral.', weeks: [6, 10, 12] });
      if (/social service|mental health|behaviour|child|youth|early childhood|infant|gerontology/.test(p)) return pack({ place: 'intake forms, family records, risk notes, behaviour logs, support plans, referral systems, placement criteria, and consent records', decision: 'a risk label, referral rule, placement recommendation, behaviour category, eligibility threshold, or service priority', people: 'children, youth, families, elders, clients, caregivers, frontline workers, and communities represented in files', pressure: 'a family meeting, crisis note, waitlist decision, behaviour concern, placement review, or referral deadline', setting: 'a classroom, agency, intake desk, counselling room, care plan, or family support meeting', topics: ['intake forms', 'risk notes', 'support plans', 'placement criteria', 'referral systems'], artifacts: ['an intake field', 'a behaviour log', 'a referral rule', 'a case-note template', 'a support-plan goal'], question: 'Ask whose context is flattened by the file, who is watched harder, and how client or family voice can change the record.', focus: 'For this program, pay attention to how files, risk notes, and referral tools describe people before anyone meets the full person.', overview: name + ' connects the course to care records. Students can inspect how support systems can help people while also turning poverty, disability, age, migration, or race into risk.', interface: 'Techno-racism can appear when a service tool mistakes heavy surveillance or limited access for individual failure and then routes support away from the people who need it.', weeks: [8, 10, 11] });
      if (/library/.test(p)) return pack({ place: 'catalogue records, metadata standards, search systems, access rules, circulation data, digital collections, and reference interactions', decision: 'a subject heading, search ranking, access rule, metadata field, collection priority, or privacy choice', people: 'patrons, researchers, students, communities described in records, library staff, and people misnamed by classification systems', pressure: 'a reference request, catalogue problem, access barrier, privacy concern, or collection decision', setting: 'a library desk, catalogue system, digital archive, database search, or community collection', topics: ['subject headings', 'catalogue metadata', 'search ranking', 'access rules', 'digital collections'], artifacts: ['a catalogue record', 'a subject term', 'a search result', 'an access note', 'a privacy policy'], question: 'Ask whose knowledge is easy to find, whose words are missing or misnamed, and who controls the record.', focus: 'For this program, pay attention to metadata, search, access, and the power libraries hold when they name and organize knowledge.', overview: name + ' connects the course to knowledge systems. Students can inspect how classification and search make some communities visible and others difficult to find.', interface: 'Techno-racism can appear when old subject headings, search rankings, or access rules preserve biased ways of naming people.', weeks: [2, 8, 12] });
      return pack({ place: 'program records, client files, volunteer databases, service dashboards, funding reports, advocacy campaigns, and community consultations', decision: 'an eligibility rule, service priority, reporting category, referral pathway, or community engagement choice', people: 'clients, families, volunteers, staff, funders, community members, and people represented by the organization', pressure: 'a funding report, waitlist decision, client concern, staff shortage, or community request', setting: 'a non-profit office, community meeting, program dashboard, case file, or service plan', topics: ['eligibility rules', 'service dashboards', 'program reports', 'client records', 'community consultations'], artifacts: ['a funding metric', 'an intake field', 'a referral note', 'a program report', 'a consent form'], question: 'Ask who is counted, who is helped, whose story becomes data, and how the community can shape the system.', focus: 'For this program, pay attention to service data, community accountability, and the difference between helping people and speaking over them.', overview: name + ' connects the course to community systems. Students can inspect how social-sector tools can either support people or reduce them to files and metrics.', interface: 'Techno-racism can appear when an organization uses data about a community without giving that community real control over the story and the decision.', weeks: [8, 9, 11] });
    }
    if (area === 'Engineering Technology') {
      if (/civil|building|urban|transportation/.test(p)) return pack({ place: 'site drawings, grading plans, drainage models, accessibility standards, traffic counts, inspection notes, and public-space data', decision: 'a design standard, route priority, access choice, drainage assumption, measurement threshold, or inspection finding', people: 'residents, workers, commuters, disabled users, inspectors, nearby communities, and people using the built environment', pressure: 'a site constraint, inspection issue, public complaint, deadline, safety margin, or design change', setting: 'a project site, public space, road corridor, building system, planning meeting, or inspection file', topics: ['site standards', 'traffic counts', 'accessibility defaults', 'drainage assumptions', 'inspection records'], artifacts: ['a drawing note', 'a site measurement', 'an inspection record', 'a planning map', 'a standard detail'], question: 'Ask who the built system was designed around, who has trouble moving through it, and what evidence would force a redesign.', focus: 'For this program, pay attention to the standards and measurements that turn design assumptions into concrete access or exclusion.', overview: name + ' connects the course to the built environment. Students can inspect how drawings, standards, and data decide who a space works for.', interface: 'Techno-racism can appear when infrastructure data and design standards reflect old patterns of investment, policing, transit access, or environmental burden.', weeks: [3, 4, 8, 11] });
      if (/fire protection|firefighter/.test(p)) return pack({ place: 'alarm systems, inspection records, code requirements, occupancy data, emergency access plans, and hazard classifications', decision: 'a code interpretation, alarm threshold, inspection priority, evacuation assumption, access route, or hazard rating', people: 'residents, firefighters, inspectors, building owners, disabled occupants, and communities facing uneven safety protection', pressure: 'an inspection deadline, alarm failure, blocked access route, high-risk occupancy, or emergency response', setting: 'a building inspection, fire plan review, training ground, emergency route, or code meeting', topics: ['alarm thresholds', 'inspection records', 'occupancy data', 'emergency access', 'hazard ratings'], artifacts: ['an inspection note', 'a code line', 'an alarm report', 'an access plan', 'a hazard classification'], question: 'Ask who the safety system protects first, who is assumed able to evacuate, and who gets overlooked by the standard.', focus: 'For this program, pay attention to life-safety systems, code assumptions, emergency access, and whose bodies and neighbourhoods the standard imagines.', overview: name + ' connects the course to public safety infrastructure. Students can inspect how life-safety systems distribute protection unevenly.', interface: 'Techno-racism can appear when emergency planning and inspection systems inherit unequal housing, infrastructure, and service patterns but treat the risk map as neutral.', weeks: [4, 6, 11] });
      if (/mechanical|cnc|automation|electromechanical/.test(p)) return pack({ place: 'machine programs, tolerances, maintenance logs, automation settings, production dashboards, safety guards, and quality checks', decision: 'a tolerance, machine setting, automation sequence, maintenance priority, quality threshold, or safety interlock', people: 'operators, technicians, inspectors, supervisors, end users, and workers exposed by the production system', pressure: 'a production target, failed part, maintenance issue, safety concern, quality hold, or automation fault', setting: 'a shop floor, CNC station, automated cell, maintenance bay, or quality lab', topics: ['machine settings', 'tolerance ranges', 'automation sequences', 'maintenance logs', 'quality thresholds'], artifacts: ['a CNC program', 'a tolerance note', 'a maintenance log', 'a quality report', 'a safety checklist'], question: 'Ask who the technical standard protects, who absorbs the risk when production speeds up, and how workers can challenge an unsafe default.', focus: 'For this program, pay attention to machine defaults, tolerances, automation decisions, and how technical efficiency changes risk for people.', overview: name + ' connects the course to production systems. Students can inspect how automation and quality rules can make worker risk look like process data.', interface: 'Techno-racism can appear when production systems ignore whose labour is exposed by efficiency targets and whose safety concerns are recorded as exceptions.', weeks: [3, 4, 11] });
      if (/electronics|computer engineering/.test(p)) return pack({ place: 'sensor specs, circuit tests, embedded systems, firmware logs, calibration rules, access controls, and device diagnostics', decision: 'a sensor threshold, calibration setting, firmware default, access rule, diagnostic code, or test condition', people: 'users, technicians, operators, clients, support staff, and people whose bodies or environments the device misreads', pressure: 'a failed test, firmware bug, sensor drift, support ticket, security concern, or deployment deadline', setting: 'a test bench, device lab, embedded system, field deployment, or support queue', topics: ['sensor calibration', 'firmware defaults', 'access controls', 'diagnostic logs', 'test conditions'], artifacts: ['a test result', 'a sensor spec', 'a firmware log', 'a calibration note', 'an access rule'], question: 'Ask whose environment and body the device was tested on, who it misreads, and what evidence would prove the fix works.', focus: 'For this program, pay attention to sensors, firmware, calibration, and test coverage because bias can enter through technical settings.', overview: name + ' connects the course to devices that claim to read the world. Students can inspect how sensors and embedded systems can fail unevenly.', interface: 'Techno-racism can appear when a device performs well in the lab but was never tested across the people and conditions it will meet in the field.', weeks: [5, 10, 12] });
      return pack({ place: 'environmental samples, field measurements, lab results, compliance records, project plans, GIS layers, and community-impact documents', decision: 'a sample rule, monitoring threshold, compliance finding, mitigation priority, GIS layer, or project assumption', people: 'residents, workers, Indigenous communities, regulators, project teams, and people living with environmental consequences', pressure: 'a contaminated sample, public concern, compliance deadline, field constraint, or project change', setting: 'a field site, lab, watershed, project meeting, GIS map, or environmental report', topics: ['sampling rules', 'field measurements', 'GIS layers', 'compliance records', 'community-impact reports'], artifacts: ['a sample result', 'a monitoring threshold', 'a GIS map', 'a compliance note', 'a consultation record'], question: 'Ask whose land, health, and evidence are represented in the data, and who controls how that data is used.', focus: 'For this program, pay attention to environmental evidence, community impact, and Indigenous data sovereignty when technical data describes people and land.', overview: name + ' connects the course to technical evidence about place. Students can inspect how environmental and project data can include or exclude community knowledge.', interface: 'Techno-racism can appear when environmental decisions treat community evidence as less valid than technical data gathered without community control.', weeks: [8, 11, 12] });
    }
    if (area === 'Fashion and Esthetics') {
      if (/esthetic|cosmetic|spa|nursing/.test(p)) return pack({ place: 'skin-analysis apps, shade systems, client consultation forms, treatment records, product recommendations, beauty filters, and device readings', decision: 'a shade match, treatment recommendation, skin category, device setting, contraindication note, or product choice', people: 'clients, estheticians, nurses, models, retail staff, and people whose skin or body is misread by beauty technology', pressure: 'a client concern, product mismatch, service consultation, treatment risk, event deadline, or retail recommendation', setting: 'a salon, treatment room, medical spa, retail counter, consultation, or product demo', topics: ['shade matching', 'skin-analysis apps', 'treatment records', 'beauty filters', 'product recommendations'], artifacts: ['a shade result', 'a skin-analysis output', 'a client form', 'a device setting', 'a product match'], question: 'Ask whose skin the tool recognizes, who it corrects or misreads, and how the professional can override the default.', focus: 'For this program, pay attention to skin, shade, device, and consultation systems that decide what counts as normal, healthy, or beautiful.', overview: name + ' connects the course to how faces and skin are read by tools. Students can inspect how beauty technology can reproduce narrow standards while claiming precision.', interface: 'Techno-racism can appear when a tool is calibrated for lighter skin, treats deeper skin tones as exceptions, or corrects features instead of serving the client.', weeks: [5, 9, 11] });
      return pack({ place: 'trend forecasting, merchandising plans, sizing data, buying systems, portfolio images, retail surveillance, and brand campaigns', decision: 'a size range, display choice, trend category, buying rule, model selection, or loss-prevention flag', people: 'clients, shoppers, models, stylists, buyers, retail workers, and people excluded by fashion systems', pressure: 'a seasonal launch, buying deadline, client consultation, inventory issue, event setup, or retail incident', setting: 'a studio, retail floor, runway, buying meeting, client fitting, or merchandising display', topics: ['sizing data', 'trend algorithms', 'retail surveillance', 'display standards', 'model selection'], artifacts: ['a size chart', 'a trend report', 'a display plan', 'a model board', 'a store policy'], question: 'Ask whose body, culture, and style the system treats as the market, and who is made hard to fit, see, or welcome.', focus: 'For this program, pay attention to sizing, trend, display, retail, and brand systems that define who fashion is built for.', overview: name + ' connects the course to how bodies and style become data. Students can inspect how fashion systems decide whose body is normal and whose presence is risk.', interface: 'Techno-racism can appear when retail and fashion tools use narrow body standards, biased surveillance, or trend data that erases racialized style and labour.', weeks: [5, 10, 11] });
    }
    if (area === 'Health and Wellness') {
      if (/nursing|personal support|therapeutic|occupational|physiotherapist|fitness/.test(p)) return pack({ place: 'patient charts, triage tools, care plans, device readings, referral rules, mobility assessments, and shift handoff notes', decision: 'a triage score, pain note, device reading, care priority, referral threshold, mobility category, or handoff decision', people: 'patients, families, nurses, support workers, therapists, caregivers, and people whose symptoms are misread or delayed', pressure: 'a busy shift, pain complaint, fall risk, referral wait, device reading, or discharge plan', setting: 'a clinic, hospital unit, long-term care room, rehabilitation space, fitness program, or patient chart', topics: ['triage scores', 'pain notes', 'device readings', 'care plans', 'referral thresholds'], artifacts: ['a chart field', 'a device output', 'a care-plan note', 'a referral rule', 'a handoff record'], question: 'Ask who the care system reads accurately, whose pain or risk is discounted, and how a patient can get a second look.', focus: 'For this program, pay attention to care records, clinical tools, pain assessment, and device readings that can turn unequal treatment into routine workflow.', overview: name + ' connects the course to care decisions. Students can inspect how health systems decide who is urgent, believable, risky, or ready for support.', interface: 'Techno-racism can appear when clinical tools, device readings, or chart fields encode unequal past care and then steer future care.', weeks: [5, 6, 8, 10] });
      if (/optician|veterinary/.test(p)) return pack({ place: 'diagnostic devices, client records, appointment systems, screening results, insurance files, product recommendations, and consent notes', decision: 'a screening result, referral rule, product match, appointment priority, device reading, or client-education choice', people: 'clients, patients, families, practitioners, technicians, and people whose care depends on a correct screen', pressure: 'a device reading, anxious client, referral question, product fit, busy schedule, or care handoff', setting: 'a clinic, optical lab, veterinary practice, exam room, client file, or service counter', topics: ['diagnostic devices', 'screening results', 'appointment triage', 'client records', 'product recommendations'], artifacts: ['a device output', 'a referral note', 'a client form', 'a product match', 'a consent record'], question: 'Ask who the device or record reads well, who it misses, and what professional judgment must sit beside the output.', focus: 'For this program, pay attention to devices and client records that look precise but still need human review and accountability.', overview: name + ' connects the course to technical care tools. Students can inspect how screening devices and records shape trust before a person explains their context.', interface: 'Techno-racism can appear when a device, record, or insurance rule performs unevenly but is treated as objective because it produces a number.', weeks: [5, 10, 12] });
      if (/health administration|office administration/.test(p)) return pack({ place: 'patient portals, appointment systems, billing records, privacy rules, referral queues, waitlists, and quality dashboards', decision: 'a waitlist priority, portal access rule, referral routing, billing flag, privacy choice, or quality metric', people: 'patients, families, administrators, clinicians, privacy staff, and people delayed by health-system paperwork', pressure: 'a long waitlist, missing record, privacy concern, referral delay, billing problem, or quality report', setting: 'a clinic office, hospital administration, patient portal, referral queue, or health-records system', topics: ['patient portals', 'referral queues', 'waitlist rules', 'privacy records', 'quality dashboards'], artifacts: ['a portal message', 'a referral note', 'a waitlist category', 'a billing flag', 'a privacy policy'], question: 'Ask who can access care information, who gets delayed by the system, and who controls sensitive health data.', focus: 'For this program, pay attention to patient access, privacy, referral queues, and health data systems that decide who reaches care.', overview: name + ' connects the course to health administration. Students can inspect how records and portals shape access to care before clinical judgment begins.', interface: 'Techno-racism can appear when a health system treats digital access, past spending, postal code, or missing records as neutral evidence of need.', weeks: [6, 8, 10, 12] });
      return pack({ place: 'safety inspections, workplace records, incident reports, wellness plans, risk assessments, and prevention dashboards', decision: 'a hazard rating, prevention priority, incident category, wellness metric, training requirement, or reporting threshold', people: 'workers, supervisors, clients, patients, families, and people exposed to risk by policy choices', pressure: 'an incident report, safety concern, prevention deadline, training gap, or workplace complaint', setting: 'a workplace, clinic, training room, safety meeting, wellness program, or incident file', topics: ['incident reports', 'risk assessments', 'wellness metrics', 'training records', 'prevention dashboards'], artifacts: ['a hazard report', 'a training record', 'a wellness metric', 'an incident category', 'a prevention plan'], question: 'Ask who the prevention system protects, whose risk is normalized, and how workers or clients can challenge unsafe conditions.', focus: 'For this program, pay attention to risk records, prevention systems, and who carries the cost when safety is measured narrowly.', overview: name + ' connects the course to prevention and access. Students can inspect how wellness and safety systems define risk and responsibility.', interface: 'Techno-racism can appear when workplace or wellness systems treat unequal exposure as individual behaviour instead of a structural condition.', weeks: [4, 8, 11] });
    }
    if (area === 'Hospitality and Tourism') {
      if (/tourism|travel|flight services/.test(p)) return pack({ place: 'reservation systems, global distribution tools, passport checks, itinerary records, biometric screening, customer profiles, and travel advisories', decision: 'a booking approval, fare rule, screening referral, itinerary change, document flag, or service recovery choice', people: 'travellers, agents, airline staff, families, border officers, and people flagged or delayed by travel systems', pressure: 'a missed connection, document issue, border delay, fare change, complaint, or emergency itinerary', setting: 'a travel agency, airport counter, booking platform, border queue, or itinerary desk', topics: ['reservation systems', 'biometric screening', 'travel advisories', 'document checks', 'fare rules'], artifacts: ['a booking code', 'a document notice', 'a fare rule', 'a screening message', 'an itinerary record'], question: 'Ask who travel systems move smoothly, who they flag, and whether the traveller can understand or challenge the decision.', focus: 'For this program, pay attention to travel records, booking systems, border technologies, and the way movement can be made easier or harder for different people.', overview: name + ' connects the course to mobility. Students can inspect how travel systems decide who moves easily and who becomes a risk to process.', interface: 'Techno-racism can appear when border and booking systems use name, document, passport, face, or origin data in ways that make some travellers repeatedly prove themselves.', weeks: [5, 6, 10] });
      return pack({ place: 'booking systems, guest profiles, room assignments, review platforms, staffing tools, menu systems, venue screening, and service-recovery records', decision: 'a guest-risk flag, room assignment, price change, staffing call, service script, review response, or booking rule', people: 'guests, workers, managers, hosts, families, and people treated as risk by service systems', pressure: 'a difficult guest interaction, busy service, bad review, event issue, staffing shortage, or pricing dispute', setting: 'a hotel, restaurant, event space, booking desk, service counter, or guest profile', topics: ['guest profiles', 'dynamic pricing', 'booking rules', 'review platforms', 'service recovery'], artifacts: ['a booking rule', 'a guest note', 'a price change', 'a review prompt', 'a service script'], question: 'Ask who is welcomed, who is watched, who pays more, and how a guest can contest the decision.', focus: 'For this program, pay attention to guest data, booking tools, review systems, and the line between hospitality and surveillance.', overview: name + ' connects the course to the service promise of welcome. Students can inspect how hospitality systems can make some guests feel served and others treated as risk.', interface: 'Techno-racism can appear when booking, review, pricing, or venue-screening tools use names, locations, or appearance as risk cues.', weeks: [6, 9, 10] });
    }
    if (area === 'Information Technology') {
      if (/artificial intelligence|ai workplace|data science|analytics/.test(p)) return pack({ place: 'training data, model features, evaluation sets, prompt systems, dashboards, AI policies, and deployment logs', decision: 'a model feature, training set, evaluation metric, confidence threshold, prompt rule, or release decision', people: 'users, clients, developers, analysts, decision-makers, and people misclassified or excluded by AI systems', pressure: 'a model deadline, accuracy target, bias report, client demo, audit request, or deployment problem', setting: 'a model lab, analytics team, prompt workspace, dashboard review, or AI governance meeting', topics: ['training datasets', 'model features', 'evaluation metrics', 'prompt rules', 'AI governance'], artifacts: ['a data card', 'a model output', 'a confusion matrix', 'a prompt log', 'an audit note'], question: 'Ask what the AI system is really optimizing, whose data is missing, and what group-level harm the average score hides.', focus: 'For this program, pay attention to data provenance, evaluation design, prompts, model outputs, and how AI accountability is proven.', overview: name + ' connects the course to the systems at the centre of current AI debates. Students can inspect how model choices become social decisions.', interface: 'Techno-racism can appear when an AI system learns from unequal data, hides harm in aggregate performance, or gives authority to outputs people cannot challenge.', weeks: [3, 5, 10, 12] });
      if (/cyber|cloud|systems|network|computer systems/.test(p)) return pack({ place: 'identity systems, permissions, access logs, cloud policies, support tickets, security alerts, and incident-response records', decision: 'an access rule, authentication flag, risk alert, logging policy, account lockout, or incident priority', people: 'users, admins, clients, support staff, security teams, and people denied service by access systems', pressure: 'an outage, breach alert, locked account, access request, policy change, or support escalation', setting: 'a help desk, cloud console, security operations centre, access review, or incident queue', topics: ['access controls', 'security alerts', 'identity systems', 'support tickets', 'logging policies'], artifacts: ['an access log', 'a ticket pattern', 'a security alert', 'a permission setting', 'an incident note'], question: 'Ask whose access is protected, whose behaviour is marked suspicious, and how a user can correct or appeal a system block.', focus: 'For this program, pay attention to permissions, identity, security alerts, and the human consequences of automated access decisions.', overview: name + ' connects the course to infrastructure that decides who gets in and who gets blocked. Students can inspect how security systems can misread people as threats.', interface: 'Techno-racism can appear when access and security systems treat location, name, device history, or support patterns as neutral evidence of risk.', weeks: [4, 10, 12] });
      if (/programming|software|computer science|software development|engineering/.test(p)) return pack({ place: 'requirements documents, data models, default settings, test cases, user stories, release notes, and bug reports', decision: 'a data field, default state, validation rule, test case, user flow, ranking rule, or release choice', people: 'users, clients, developers, QA testers, support staff, and people whose needs are treated as edge cases', pressure: 'a sprint deadline, bug report, changing requirement, accessibility issue, release decision, or support escalation', setting: 'a codebase, design review, QA cycle, app screen, database, or deployment pipeline', topics: ['data models', 'default settings', 'test cases', 'user stories', 'release decisions'], artifacts: ['a user story', 'a test case', 'a database field', 'a default setting', 'a bug report'], question: 'Ask who the software imagines as the default user, who is missing from the test case, and how a wrong output can be challenged.', focus: 'For this program, pay attention to requirements, data fields, defaults, test coverage, and release decisions where inequity can become code.', overview: name + ' connects the course to building systems. Students can inspect how small design and data choices become rules that affect people at scale.', interface: 'Techno-racism can appear when a software team ships defaults and tests built around a narrow user and calls everyone else an edge case.', weeks: [3, 4, 5, 11] });
      if (/business information|financial technology|project management/.test(p)) return pack({ place: 'business systems, vendor platforms, implementation plans, data migrations, fintech apps, dashboards, and change requests', decision: 'a vendor recommendation, implementation default, payment rule, dashboard metric, workflow setting, or project priority', people: 'clients, users, managers, analysts, vendors, and people affected by system configuration choices', pressure: 'a go-live date, vendor pitch, migration issue, compliance request, payment problem, or stakeholder conflict', setting: 'an implementation meeting, fintech app, project board, dashboard review, or client workflow', topics: ['vendor platforms', 'implementation defaults', 'payment rules', 'data migrations', 'workflow settings'], artifacts: ['a vendor claim', 'a configuration note', 'a payment flag', 'a dashboard metric', 'a change request'], question: 'Ask who the system configuration helps, who it filters or delays, and how the decision remains accountable after go-live.', focus: 'For this program, pay attention to how business technology is selected, configured, and justified, because those choices decide how people experience the system.', overview: name + ' connects the course to technology implementation. Students can inspect how vendor tools and configurations translate business goals into unequal outcomes.', interface: 'Techno-racism can appear when a purchased system imports bias through defaults, data migration, payment rules, or vendor claims no one audits.', weeks: [9, 10, 12] });
      return pack({ place: 'catalogues, databases, information systems, user-support records, search tools, metadata, and privacy settings', decision: 'a search rule, metadata field, access permission, privacy choice, support priority, or database category', people: 'users, patrons, clients, support staff, administrators, and people misnamed or blocked by information systems', pressure: 'a search failure, access issue, privacy concern, support ticket, data-cleaning problem, or classification dispute', setting: 'a database, help desk, information system, catalogue, user portal, or support queue', topics: ['metadata fields', 'database categories', 'search tools', 'privacy settings', 'support records'], artifacts: ['a metadata field', 'a search result', 'an access setting', 'a support ticket', 'a privacy rule'], question: 'Ask whose information is easy to find, whose access is blocked, and who can correct the way the system names them.', focus: 'For this program, pay attention to information architecture, access, search, metadata, and the privacy consequences of organizing people as data.', overview: name + ' connects the course to information systems. Students can inspect how search, access, and metadata shape who is visible and who is misread.', interface: 'Techno-racism can appear when old categories and access rules are rebuilt into modern information systems without being questioned.', weeks: [2, 8, 12] });
    }
    if (area === 'Law, Administration and Public Safety') {
      if (/immigration/.test(p)) return pack({ place: 'client files, eligibility checklists, border records, document requests, appointment systems, translation notes, and digital portals', decision: 'an eligibility flag, missing-document request, appointment priority, risk note, portal message, or file category', people: 'applicants, sponsors, families, case workers, interpreters, and people moving through border systems', pressure: 'a deadline, missing document, status change, client fear, portal problem, or policy update', setting: 'an immigration office, client file, border record, digital portal, or case meeting', topics: ['border technologies', 'eligibility flags', 'client files', 'document requests', 'digital portals'], artifacts: ['a portal message', 'a document checklist', 'a case note', 'an eligibility rule', 'a border record'], question: 'Ask how the system reads migration, whose story is reduced to risk, and how a person can correct or contest the file.', focus: 'For this program, pay attention to the border and administrative systems that turn movement, identity, and documentation into decisions.', overview: name + ' connects the course to migration administration. Students can inspect how digital border systems and case files shape whose movement is trusted.', interface: 'Techno-racism can appear when immigration tools treat country, name, document gaps, or travel history as neutral risk evidence.', weeks: [6, 8, 12] });
      if (/law clerk|paralegal|justice|court|legal/.test(p)) return pack({ place: 'case-management systems, court forms, disclosure records, legal databases, client files, filing rules, and tribunal portals', decision: 'a file category, disclosure note, deadline rule, eligibility screen, evidence tag, or tribunal workflow', people: 'clients, lawyers, clerks, tribunal staff, accused people, tenants, families, and people named in legal records', pressure: 'a filing deadline, missing record, client interview, disclosure issue, tribunal date, or urgent motion', setting: 'a law office, court file, tribunal portal, client meeting, or legal database', topics: ['case-management systems', 'court forms', 'disclosure records', 'tribunal portals', 'legal databases'], artifacts: ['a court form', 'a file note', 'a disclosure tag', 'a portal message', 'a legal database result'], question: 'Ask who the legal record makes credible, who it burdens with proof, and what path exists to correct or appeal a decision.', focus: 'For this program, pay attention to how legal files, portals, forms, and evidence categories turn people into cases.', overview: name + ' connects the course to legal administration. Students can inspect how records and portals shape access to justice.', interface: 'Techno-racism can appear when legal technology and forms reproduce unequal assumptions about credibility, risk, compliance, or deservingness.', weeks: [6, 10, 12] });
      if (/property|assessment|appraisal/.test(p)) return pack({ place: 'property records, valuation models, assessment databases, tax files, GIS layers, neighbourhood data, and appeal records', decision: 'a valuation model, assessment rule, comparable-property choice, tax category, GIS layer, or appeal threshold', people: 'homeowners, tenants, assessors, municipalities, neighbourhoods, and people affected by property valuation', pressure: 'an assessment appeal, market change, tax complaint, missing record, or valuation deadline', setting: 'an assessment office, property database, municipal file, GIS map, or appeal hearing', topics: ['valuation models', 'assessment databases', 'GIS layers', 'property-tax rules', 'appeal records'], artifacts: ['an assessment notice', 'a valuation field', 'a GIS layer', 'a comparable-property list', 'an appeal instruction'], question: 'Ask what the property system treats as value, whose neighbourhood history is carried forward, and how the assessment can be challenged.', focus: 'For this program, pay attention to valuation data, property records, neighbourhood histories, and the appeal paths attached to assessment decisions.', overview: name + ' connects the course to land, housing, and value. Students can inspect how property systems can encode historical inequity as market data.', interface: 'Techno-racism can appear when valuation tools treat unequal neighbourhood investment and housing history as objective evidence of worth.', weeks: [2, 10, 12] });
      if (/public administration|government relations/.test(p)) return pack({ place: 'policy dashboards, service portals, eligibility rules, public consultations, briefing notes, procurement files, and complaint data', decision: 'an eligibility threshold, service priority, procurement choice, consultation design, complaint category, or policy metric', people: 'residents, applicants, public servants, communities consulted, elected officials, and people governed by automated services', pressure: 'a policy deadline, service backlog, public complaint, procurement decision, or consultation controversy', setting: 'a municipal office, policy shop, service portal, council report, or public consultation', topics: ['service portals', 'eligibility rules', 'policy dashboards', 'procurement files', 'public consultations'], artifacts: ['a briefing note', 'a service rule', 'a dashboard metric', 'a consultation summary', 'a procurement clause'], question: 'Ask who the public system serves, who it burdens, and how democratic accountability reaches the technology.', focus: 'For this program, pay attention to public service design, procurement, consultation, and the policy choices that decide how technology governs people.', overview: name + ' connects the course to public power. Students can inspect how government systems make automated decisions on behalf of the public.', interface: 'Techno-racism can appear when public-sector technology is procured and deployed before communities can see, question, or govern its effects.', weeks: [6, 11, 12] });
      return pack({ place: 'risk tools, incident files, intelligence reports, policy thresholds, dispatch records, public-safety dashboards, and appeal processes', decision: 'a risk score, enforcement priority, intelligence flag, discretion point, report category, or review path', people: 'residents, officers, analysts, complainants, witnesses, clients, and people subject to public safety decisions', pressure: 'a public-safety concern, urgent file, risk alert, complaint, policy conflict, or intelligence request', setting: 'a case file, dispatch desk, operations centre, hearing room, public counter, or community-safety meeting', topics: ['risk tools', 'incident reports', 'intelligence flags', 'policy thresholds', 'appeal paths'], artifacts: ['a risk flag', 'a report field', 'an intelligence note', 'a policy line', 'an appeal instruction'], question: 'Ask who gets marked as risk, who gets believed, what data fed the decision, and whether there is a real review path.', focus: 'For this program, pay attention to how public safety and administrative systems turn discretion into records and records into decisions.', overview: name + ' connects the course to state power and administrative judgment. Students can inspect how risk and records shape rights in practice.', interface: 'Techno-racism can appear when systems treat over-surveillance as neutral data and then use that data to justify more surveillance.', weeks: [6, 10, 12] });
    }
    if (area === 'Liberal Arts and University Transfers') {
      if (/english|academic|upgrading|general arts/.test(p)) return pack({ place: 'placement tests, academic records, learning platforms, language assessments, transfer pathways, writing rubrics, and support referrals', decision: 'a placement level, readiness label, writing standard, support referral, transfer rule, or learning-platform recommendation', people: 'students, instructors, advisors, tutors, multilingual learners, and people labelled unready by academic systems', pressure: 'a placement decision, writing deadline, transfer plan, language barrier, or support referral', setting: 'a classroom, advising office, learning platform, writing assignment, or transfer file', topics: ['placement tests', 'writing rubrics', 'learning platforms', 'support referrals', 'transfer rules'], artifacts: ['a placement result', 'a rubric line', 'a portal message', 'a support note', 'a transfer requirement'], question: 'Ask what the academic system treats as readiness, whose knowledge is undervalued, and how a student can challenge the label.', focus: 'For this program, pay attention to the tools and standards that decide who is seen as ready for academic work.', overview: name + ' connects the course to access and academic judgment. Students can inspect how readiness labels and support systems shape opportunity.', interface: 'Techno-racism can appear when language, previous schooling, or digital access is treated as individual ability instead of shaped by unequal systems.', weeks: [2, 7, 10] });
      if (/interdisciplinary|university transfer|arts and science|liberal arts/.test(p)) return pack({ place: 'research questions, source lists, seminar debates, disciplinary methods, theory choices, citation practices, and transfer pathways', decision: 'a source choice, definition, evidence rule, theory frame, research question, or disciplinary standard', people: 'readers, communities studied, students, researchers, instructors, and people left out of academic knowledge', pressure: 'a seminar debate, research pivot, transfer plan, essay deadline, or difficult reading', setting: 'a seminar, essay, library database, research file, or future university discipline', topics: ['research methods', 'source choices', 'disciplinary claims', 'theory frames', 'evidence rules'], artifacts: ['a source', 'a definition', 'a research question', 'a citation pattern', 'an evidence standard'], question: 'Ask what the argument treats as evidence, whose experience it leaves out, and how the course concept changes the claim.', focus: 'For this program, pay attention to how disciplines build knowledge and how claims of objectivity can hide exclusions.', overview: name + ' connects the course to transferable academic thinking. Students can inspect how methods, sources, and evidence rules shape what counts as knowledge.', interface: 'Techno-racism can appear when a discipline treats its own categories as neutral and ignores the people those categories cannot explain.', weeks: [2, 7, 8] });
      return pack({ place: 'policy research, government documents, catalogue records, public reports, source databases, and civic communication', decision: 'a policy frame, source selection, metadata term, consultation record, government message, or evidence rule', people: 'residents, readers, researchers, public servants, communities named in records, and people affected by policy claims', pressure: 'a public issue, source conflict, policy deadline, research problem, or civic debate', setting: 'a library, policy office, public meeting, database search, or research file', topics: ['policy sources', 'catalogue metadata', 'government reports', 'public consultations', 'source credibility'], artifacts: ['a public report', 'a catalogue record', 'a policy brief', 'a source list', 'a consultation note'], question: 'Ask whose knowledge is easy to find, whose voice is treated as evidence, and who can challenge the public story.', focus: 'For this program, pay attention to how records, sources, and public claims organize civic knowledge.', overview: name + ' connects the course to public knowledge. Students can inspect how information systems and policy language shape whose experience becomes evidence.', interface: 'Techno-racism can appear when public records or research tools repeat old categories while sounding neutral and evidence-based.', weeks: [2, 8, 12] });
    }
    if (area === 'Media and Communications') {
      if (/journalism|broadcast|television|event|production/.test(p)) return pack({ place: 'news scripts, story rundowns, source lists, production schedules, audience metrics, platform clips, and moderation rules', decision: 'a headline, source choice, edit, story order, audience metric, clip selection, or platform rule', people: 'audiences, sources, reporters, producers, communities in the story, and people flattened by coverage', pressure: 'a breaking story, deadline, source conflict, public response, production issue, or platform change', setting: 'a newsroom, control room, field shoot, podcast desk, social feed, or production meeting', topics: ['story framing', 'source lists', 'audience metrics', 'platform clips', 'moderation rules'], artifacts: ['a headline', 'a source list', 'a rundown item', 'an audience metric', 'a platform rule'], question: 'Ask who becomes credible, who becomes a problem, who is missing, and what platform logic shapes the story.', focus: 'For this program, pay attention to editorial choices, source patterns, platform metrics, and the speed at which a story can flatten people.', overview: name + ' connects the course to public storytelling. Students can inspect how media systems decide whose story rises and whose disappears.', interface: 'Techno-racism can appear when search, ranking, source habits, and deadline pressure make racialized communities visible only through narrow frames.', weeks: [2, 8, 12] });
      if (/public relations|communications|government relations|technical/.test(p)) return pack({ place: 'message maps, stakeholder lists, crisis plans, technical documentation, social analytics, AI drafts, and public-facing claims', decision: 'a message frame, stakeholder priority, disclosure choice, documentation default, crisis response, or AI-assisted wording decision', people: 'clients, publics, communities named by the message, technical users, journalists, and people affected by organizational claims', pressure: 'a crisis, launch, policy change, client request, technical confusion, or public criticism', setting: 'a communications office, client meeting, crisis channel, documentation workspace, or public consultation', topics: ['message framing', 'stakeholder mapping', 'AI-assisted copy', 'technical documentation', 'crisis response'], artifacts: ['a message map', 'a stakeholder list', 'a disclosure line', 'a documentation note', 'a social metric'], question: 'Ask whose story the organization protects, whose harm the message hides, and what honest disclosure requires.', focus: 'For this program, pay attention to how organizations explain technology and whether their message makes harm easier or harder to see.', overview: name + ' connects the course to institutional storytelling. Students can inspect how communications can either clarify algorithmic harm or cover it with benevolent language.', interface: 'Techno-racism can appear when a public message calls a harmful system innovative, efficient, or neutral while avoiding who pays the cost.', weeks: [9, 11, 12] });
      return pack({ place: 'campaign briefs, audience segments, creative concepts, platform analytics, brand-safety filters, and production assets', decision: 'a target audience, campaign frame, creative default, media buy, platform rule, or content ranking', people: 'audiences, clients, creators, communities represented in campaigns, and people stereotyped or ignored by media systems', pressure: 'a campaign deadline, client demand, public response, platform change, or creative pitch', setting: 'a campaign room, agency, social feed, production meeting, or client presentation', topics: ['audience segments', 'campaign frames', 'platform analytics', 'brand-safety filters', 'content ranking'], artifacts: ['a creative brief', 'an audience segment', 'a platform metric', 'a brand-safety rule', 'a content calendar'], question: 'Ask who the campaign imagines, who it stereotypes, and who controls what the public is invited to notice.', focus: 'For this program, pay attention to the platform and campaign systems that turn audience data into public meaning.', overview: name + ' connects the course to media persuasion. Students can inspect how audience tools and campaign choices make some groups hypervisible and others invisible.', interface: 'Techno-racism can appear when campaigns repeat platform bias, treat stereotypes as engagement data, or make diversity visible only as branding.', weeks: [2, 9, 12] });
    }
    if (area === 'Science') {
      if (/biotech|biology|clinical|pharmaceutical|chemical/.test(p)) return pack({ place: 'samples, lab protocols, assay thresholds, clinical trial criteria, quality records, regulatory submissions, and data-cleaning rules', decision: 'a sample rule, inclusion criterion, assay cutoff, instrument setting, adverse-event category, or regulatory interpretation', people: 'participants, patients, lab teams, regulators, communities in the data, and people excluded by the method', pressure: 'a failed assay, trial deadline, quality deviation, regulatory question, uncertain result, or missing sample', setting: 'a lab, clinical trial file, quality office, regulatory submission, instrument bench, or research report', topics: ['sampling rules', 'clinical trial criteria', 'assay thresholds', 'quality deviations', 'regulatory submissions'], artifacts: ['a protocol line', 'a sample record', 'an assay cutoff', 'a quality note', 'a regulatory table'], question: 'Ask whose data fits the method, whose result is treated as noise, and who controls the use of biological or health data.', focus: 'For this program, pay attention to sampling, thresholds, quality evidence, and the communities represented in scientific data.', overview: name + ' connects the course to scientific evidence. Students can inspect how methods and thresholds decide what counts as valid data.', interface: 'Techno-racism can appear when samples, trial criteria, or reference ranges underrepresent groups and then call the result objective.', weeks: [5, 8, 12] });
      if (/cosmetic/.test(p)) return pack({ place: 'formulation records, shade tests, skin studies, product claims, consumer panels, regulatory files, and instrument readings', decision: 'a shade category, claim threshold, formulation choice, panel selection, safety result, or regulatory wording', people: 'clients, consumers, formulators, testers, retail staff, and people whose skin is poorly represented by product testing', pressure: 'a product launch, failed shade match, claim review, safety concern, panel result, or regulatory question', setting: 'a formulation lab, product-testing room, regulatory review, retail counter, or consumer study', topics: ['shade testing', 'consumer panels', 'formulation choices', 'product claims', 'skin-analysis data'], artifacts: ['a shade chart', 'a panel result', 'a claim line', 'a formulation note', 'a regulatory file'], question: 'Ask whose skin and body the product was tested for, who is missing from the panel, and what claim the evidence can honestly support.', focus: 'For this program, pay attention to product testing, shade range, consumer evidence, and regulatory claims about bodies and skin.', overview: name + ' connects the course to product science and skin. Students can inspect how cosmetic evidence decides whose body is treated as the standard.', interface: 'Techno-racism can appear when skin-tone ranges, panels, or claims work well for some consumers while treating others as outside the product norm.', weeks: [5, 9, 12] });
      if (/environment|landscape|project management/.test(p)) return pack({ place: 'field samples, environmental monitoring, GIS layers, compliance records, project files, land-use data, and community reports', decision: 'a sampling site, monitoring threshold, compliance finding, GIS layer, mitigation plan, or consultation record', people: 'residents, workers, Indigenous communities, regulators, project teams, and communities living with environmental decisions', pressure: 'a public concern, field constraint, compliance deadline, weather event, contaminated sample, or project conflict', setting: 'a field site, watershed, lab, GIS map, project meeting, or environmental report', topics: ['field sampling', 'environmental monitoring', 'GIS layers', 'compliance records', 'community reports'], artifacts: ['a sample result', 'a monitoring threshold', 'a GIS map', 'a consultation record', 'a compliance note'], question: 'Ask whose land and health the data describes, who controls the evidence, and what community knowledge the method misses.', focus: 'For this program, pay attention to environmental evidence, land relationships, and Indigenous data sovereignty when technical data guides action.', overview: name + ' connects the course to science in place. Students can inspect how environmental data can support or override community knowledge.', interface: 'Techno-racism can appear when environmental decisions treat technical measurements as neutral while ignoring unequal exposure, land history, or Indigenous authority.', weeks: [8, 11, 12] });
      return pack({ place: 'lab reports, academic pathways, sampling exercises, instrument settings, datasets, methods sections, and research rubrics', decision: 'a measurement, sample choice, cutoff, control, dataset field, or source interpretation', people: 'students, researchers, participants, lab teams, patients, and communities represented by scientific claims', pressure: 'a lab deadline, unclear result, method change, transfer plan, or research question', setting: 'a lab, classroom, dataset, methods section, instrument bench, or research report', topics: ['sampling methods', 'instrument settings', 'lab thresholds', 'dataset fields', 'research questions'], artifacts: ['a lab result', 'a protocol line', 'a dataset field', 'a cutoff', 'a methods note'], question: 'Ask what the method measures, who fits the sample, whose result becomes noise, and who can question the claim.', focus: 'For this program, pay attention to the scientific method as a human system: sampling, thresholds, assumptions, and evidence rules.', overview: name + ' connects the course to scientific reasoning. Students can inspect how objectivity depends on the people and assumptions inside the method.', interface: 'Techno-racism can appear when a method claims neutrality but its samples, thresholds, or assumptions fit some groups better than others.', weeks: [2, 5, 8] });
    }
    return pack({ topics: ['program records', 'digital tools', 'decision rules', 'workplace dashboards', 'client interactions'], artifacts: ['a form field', 'a policy line', 'a screenshot', 'a score output', 'a source document'], question: 'Ask who benefits, who carries risk, and who can challenge a bad outcome.' });
  }
  function lensActivityProfile(w, a, L) {
    var ctx = lensFieldContext(L);
    var code = (D.course && D.course.code) || '';
    var title = a && a.title ? a.title : 'this activity';
    if (code === 'PSY355') {
      return {
        flow: [
          ['Course skill', title],
          ['Field pressure', ctx.pressure],
          ['Recovery move', 'plan, practise, ask, adjust, and try again'],
          ['Who depends on it', ctx.people]
        ],
        use: 'Use the activity as a rehearsal for how you learn under pressure in ' + ctx.label + ': what you try first, what support you use, and how you recover when the first attempt does not work.',
        check: 'The custom question: what would keep your judgment steady in ' + ctx.setting + '?'
      };
    }
    if (code === 'SOC122') {
      return {
        flow: [
          ['Course lens', title],
          ['Field setting', ctx.setting],
          ['People and power', ctx.people],
          ['Respectful action', 'listen, compare perspectives, and let affected communities lead']
        ],
        use: 'Use the activity to translate the course idea into ' + ctx.label + ': who is present, who has power, whose knowledge is trusted, and what respectful action would look like.',
        check: 'The custom question: what would this activity make visible in ' + ctx.setting + '?'
      };
    }
    return {
      flow: [
        ['Course idea', title],
        ['Field system', ctx.place],
        ['Decision point', ctx.decision],
        ['People affected', ctx.people]
      ],
      use: 'Use the activity to test one field decision in ' + ctx.label + ': who benefits, who carries risk, what evidence you would need, and what would make the system more accountable.',
      check: 'The custom question: where could this same pattern appear in ' + ctx.setting + '?'
    };
  }
  function lensActivityBlock(w, a, inScreen) {
    var L = lensParse();
    if (!L || !a) return '';
    var profile = lensActivityProfile(w, a, L);
    var cells = profile.flow.map(function (x, i) {
      return '<div style="border:1px solid var(--border);background:#fff;border-radius:8px;padding:10px 12px;min-height:74px">'
        + '<div class="mono" style="font-size:.6rem;letter-spacing:.05em;color:var(--red);font-weight:700;margin-bottom:5px">STEP ' + (i + 1) + '</div>'
        + '<div style="font-size:.83rem;font-weight:700;color:var(--ink);margin-bottom:4px">' + esc(x[0]) + '</div>'
        + '<div style="font-size:.78rem;line-height:1.35;color:var(--ink-dim)">' + esc(x[1]) + '</div></div>';
    }).join('');
    return '<div style="background:#F7F8FA;border:1px solid var(--border);border-left:3px solid var(--red);border-radius:0 10px 10px 0;padding:14px 16px;margin:' + (inScreen ? '0 0 18px' : '14px 0 16px') + '">'
      + '<div class="mono" style="font-size:.64rem;letter-spacing:.06em;color:var(--red);font-weight:700;margin-bottom:7px">FIELD PROMPT FOR ' + esc((L.program || L.area).toUpperCase()) + '</div>'
      + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:10px">' + cells + '</div>'
      + '<p style="margin:0 0 6px;font-size:.9rem;line-height:1.5;color:var(--ink)">' + esc(profile.use) + '</p>'
      + '<p style="margin:0;font-size:.78rem;line-height:1.45;color:var(--ink-dim)">' + esc(profile.check) + ' The activity itself stays the same for everyone.</p></div>';
  }
  function lensProgramFocus(L) {
    var p = ((L && (L.program || L.area)) || '').toLowerCase();
    var spec = programSpecificProfile(L);
    if (spec && spec.focus) return spec.focus;
    if (/civil|building|construction/.test(p)) return 'For this program, pay special attention to public infrastructure, site drawings, grading, drainage, accessibility, inspection records, and the people who rely on the built environment every day.';
    if (/fire/.test(p)) return 'For this program, pay special attention to life-safety systems, emergency access, alarms, codes, inspection records, and the people who depend on fast, clear decisions.';
    if (/mechanical|manufacturing|mechatronic|tool|cnc/.test(p)) return 'For this program, pay special attention to tolerances, machine settings, maintenance logs, safety guards, production defaults, and the workers affected by every technical choice.';
    if (/electrical|electronics|energy/.test(p)) return 'For this program, pay special attention to circuits, sensors, controls, power access, failure modes, and who is protected or exposed when a system behaves badly.';
    if (/environment|water|chemical|biotech|bio/.test(p)) return 'For this program, pay special attention to samples, lab thresholds, environmental monitoring, compliance records, and communities affected by technical evidence.';
    if (/computer|software|cyber|informatics|data|programming/.test(p)) return 'For this program, pay special attention to data fields, defaults, permissions, logs, testing, release decisions, and users who cannot see or challenge the system.';
    if (/nursing|health|fitness|therapeutic|pharmacy|optician|veterinary/.test(p)) return 'For this program, pay special attention to assessment tools, patient records, devices, care plans, referrals, and who carries the cost when a screen is wrong.';
    if (/early childhood|social service|child|youth|community|mental health|behaviour/.test(p)) return 'For this program, pay special attention to intake forms, family records, risk notes, referrals, placements, and how families are represented in the file.';
    if (/aviation|flight/.test(p)) return 'For this program, pay special attention to checklists, crew handoffs, dispatch records, screening tools, safety margins, and who can challenge a bad flag.';
    if (/account|finance|business|marketing|human resources|supply|project management/.test(p)) return 'For this program, pay special attention to metrics, dashboards, hiring screens, customer data, approvals, and who gets filtered before a person reviews the case.';
    if (/law|paralegal|police|public safety|security|immigration|court/.test(p)) return 'For this program, pay special attention to case notes, policy thresholds, discretion points, risk tools, records, and appeal paths.';
    if (/journalism|media|communication|public relations|broadcast/.test(p)) return 'For this program, pay special attention to story frames, source choices, platform ranking, audience data, moderation, and who controls the public narrative.';
    if (/animation|design|visual|fashion|esthetic|cosmetic|art/.test(p)) return 'For this program, pay special attention to visual defaults, references, body and skin assumptions, client records, platform tools, and who gets represented well.';
    if (/hospitality|tourism|event|culinary/.test(p)) return 'For this program, pay special attention to booking systems, guest profiles, ratings, staffing, service scripts, and who is welcomed or treated as risk.';
    return 'For this program, pay special attention to the tools, records, standards, clients, and decisions that shape everyday work in the field.';
  }
  function lensTopicFocus(d) {
    var c = d && d.concepts && d.concepts[0] ? d.concepts[0] : null;
    var q = d && d.guiding && d.guiding[0] ? d.guiding[0] : '';
    var r = d && d.readings && d.readings[0] ? d.readings[0] : null;
    return {
      concept: c && c.h ? c.h : (d && d.title ? d.title : 'This week\'s concept'),
      explanation: c && c.body ? c.body : (d && d.purpose ? d.purpose : ''),
      cite: c && c.cite ? c.cite : '',
      question: q,
      reading: r && r.apa ? r.apa : ''
    };
  }
  function lensProgramCaseQuestions(code, L, ctx) {
    var p = ((L && L.program) || '').toLowerCase();
    var spec = programSpecificProfile(L);
    if (spec && spec.caseQuestions && spec.caseQuestions.length) return spec.caseQuestions;
    if (/mental health|behaviour|behavior|social service|child|youth|community|early childhood/.test(p)) {
      return [
        'Which intake field, risk note, referral rule, or placement label would shape how this client is first understood?',
        'What family, culture, disability, housing, trauma, or community context might be flattened by that record?',
        'Who can challenge the risk score or placement recommendation before it follows the client into the next service?',
        'How would you document strengths, consent, and client voice so the file does not become only a deficit story?'
      ];
    }
    if (/civil|building|construction/.test(p)) {
      return [
        'Which drawing, site measurement, code requirement, drainage assumption, or access standard would drive the first design choice?',
        'Who uses this space in ways the default spec might not imagine, including disabled users, shift workers, children, elders, or transit riders?',
        'What field evidence would show that the design works for the people most likely to be overlooked?',
        'Where would you build in a review point before the technical choice becomes concrete, steel, traffic flow, or permanent access?'
      ];
    }
    if (/computer|software|cyber|informatics|data|programming/.test(p)) {
      return [
        'Which data field, permission level, model output, log, test case, or default setting would shape the user experience first?',
        'Which users are missing from the test set, support tickets, access review, or release decision?',
        'How would someone discover, contest, or appeal a wrong system decision?',
        'What evidence would prove that the fix works for the user group most likely to be misread?'
      ];
    }
    if (/nursing|health|fitness|therapeutic|pharmacy|optician|veterinary/.test(p)) {
      return [
        'Which screen, device reading, chart note, referral rule, or care-plan default would shape the first response?',
        'Whose pain, risk, communication style, body, or history might the tool read poorly?',
        'What patient, family, or practitioner evidence should sit beside the score before a decision is made?',
        'How would you create a check-back so a wrong first screen does not become the whole care pathway?'
      ];
    }
    if (/law|paralegal|police|public safety|security|immigration|court/.test(p)) {
      return [
        'Which policy threshold, report field, risk flag, discretion point, or file note would shape the first decision?',
        'Who gets treated as credible, risky, compliant, or suspicious before they can explain their own context?',
        'What appeal path, review step, or documentation practice would let a person challenge the decision?',
        'How would you record uncertainty so the file does not make a contested judgment look final?'
      ];
    }
    if (/account|finance|business|marketing|human resources|supply|project management/.test(p)) {
      return [
        'Which metric, dashboard, hiring screen, credit rule, price model, or approval threshold would drive the decision?',
        'Who is filtered out before a person reviews the case, and what proxy variable might be doing that work?',
        'What human explanation, audit trail, or exception process would make the decision answerable?',
        'How would you test whether the rule rewards the same people it was already built around?'
      ];
    }
    if (/aviation|flight/.test(p)) {
      return [
        'Which checklist, screening tool, dispatch note, maintenance log, weather call, or safety margin would shape the decision?',
        'Who is delayed, flagged, rerouted, or silenced by the procedure when the pressure is high?',
        'What crew, passenger, maintenance, or operations evidence would challenge a bad flag?',
        'Where does the handoff need a second look so safety does not become unequal treatment?'
      ];
    }
    if (/animation|design|visual|fashion|esthetic|cosmetic|art/.test(p)) {
      return [
        'Which reference, visual default, shade range, body assumption, image crop, style guide, or platform tool shapes what looks normal?',
        'Who is represented accurately, who is made invisible, and who is treated as an exception to the design?',
        'What client, audience, model, or community feedback would change the creative decision?',
        'How would you document the choice so representation is part of the work, not a late correction?'
      ];
    }
    if (/hospitality|tourism|event|culinary/.test(p)) {
      return [
        'Which booking rule, guest profile, rating, staffing call, service script, or event plan shapes the first response?',
        'Who is welcomed, who is treated as a risk, and who has trouble getting the same level of service?',
        'What worker, guest, or accessibility evidence should change the service decision?',
        'How would you build a recovery step that fixes the harm without blaming the guest or front-line worker?'
      ];
    }
    if (/journalism|media|communication|public relations|broadcast/.test(p)) {
      return [
        'Which headline, source list, edit, platform rule, audience metric, or campaign frame shapes what the public sees first?',
        'Who becomes credible, who becomes a problem, and who is missing from the story or message?',
        'What source, community review, or audience evidence would complicate the first frame?',
        'How would you revise the message so speed does not flatten people into a single story?'
      ];
    }
    if (/science|environment|water|chemical|biotech|bio/.test(p)) {
      return [
        'Which sample, instrument setting, threshold, lab protocol, model assumption, or compliance record shapes the finding?',
        'Whose data fits the method, whose results are treated as noise, and who lives with the consequence?',
        'What field, lab, participant, or community evidence would test the assumption?',
        'How would you report uncertainty so the method does not hide its limits?'
      ];
    }
    return areaCaseQuestions(L && L.area, ctx, ctx.label) || [
      'Which tool, record, standard, client interaction, or professional judgment would shape the first decision in ' + ctx.label + '?',
      'Who is easiest for that process to see, and who becomes an exception, a delay, or a problem to manage?',
      'What evidence from affected people would change the decision before it becomes routine?',
      'How would you make the decision reviewable by someone who was harmed by it?'
    ];
  }
  function lensProgramCaseFrame(code, L, ctx, topic, profile, focus, w) {
    var label = (L && (L.program || L.area)) || 'your program';
    if (code === 'PSY355') {
      return {
        nodes: [
          ['Week topic', topic.concept],
          ['Program pressure', ctx.pressure],
          ['Learning move', 'notice, practise, ask for feedback, and recover'],
          ['Who depends on it', ctx.people],
          ['Activity test', profile.check.replace(/^The custom question: /, '')]
        ],
        intro: 'Imagine this week\'s psychology concept showing up inside ' + ctx.setting + '. The pressure is ' + ctx.pressure + ', and the professional move is not just knowing the concept. It is noticing how stress, feedback, bias, motivation, memory, or recovery can shape what you do next.',
        concept: 'Use it to ask what the person is experiencing, what support would change the path, and how a small recovery move could prevent a bad first attempt from becoming a fixed story about ability.',
        focus: focus,
        questions: lensProgramCaseQuestions(code, L, ctx),
        lensQuestions: ['What pressure triggers the setback?', 'What support or feedback changes the outcome?', 'What recovery move keeps learning possible?', 'What would you try differently next time?']
      };
    }
    if (code === 'SOC122') {
      return {
        nodes: [
          ['Week topic', topic.concept],
          ['Program setting', ctx.setting],
          ['People and power', ctx.people],
          ['Missing voices', 'who is not in the room, record, source, or decision'],
          ['Respectful action', 'listen, compare perspectives, and let affected communities lead']
        ],
        intro: 'Imagine this week\'s sociology concept showing up inside ' + ctx.setting + '. The issue is not only what happened. It is who is present, who is missing, whose knowledge is trusted, and how the setting teaches people what counts as normal.',
        concept: 'Use it to map people, place, power, representation, and responsibility before you decide what respectful action would look like in ' + label + '.',
        focus: focus,
        questions: lensProgramCaseQuestions(code, L, ctx),
        lensQuestions: ['Who is present and who is missing?', 'Whose knowledge is trusted?', 'What power relationship shapes the setting?', 'What would respectful action look like here?']
      };
    }
    return {
      nodes: [
        ['Week topic', topic.concept],
        ['Program setting', ctx.setting],
        ['Field decision', ctx.decision],
        ['Who feels it', ctx.people],
        ['Activity test', profile.check.replace(/^The custom question: /, '')]
      ],
      intro: 'Imagine this week\'s concept showing up inside ' + ctx.setting + '. The decision is not abstract: it is ' + ctx.decision + '. In ' + label + ', that decision sits inside ' + ctx.place + '.',
      concept: 'Use it to ask who the system sees clearly, who it treats as an exception, and what evidence would show the harm before it becomes normal practice.',
      focus: focus,
      questions: lensProgramCaseQuestions(code, L, ctx),
      lensQuestions: ['Who benefits from the default?', 'Who carries the risk if it fails?', 'What data or testimony is missing?', 'What would accountability look like here?']
    };
  }
  function lensProgramSection(w, d) {
    var L = lensParse();
    if (!L || !d) return '';
    var ctx = lensFieldContext(L);
    var topic = lensTopicFocus(d);
    var profile = lensActivityProfile(w, d.activity || {}, L);
    var focus = lensProgramFocus(L);
    var code = (D.course && D.course.code) || '';
    var frame = lensProgramCaseFrame(code, L, ctx, topic, profile, focus, w);
    var pc = window.BFS218_PROGRAM_CASES && L && L.program && window.BFS218_PROGRAM_CASES[L.program];
    if (pc) {
      if (pc.s) frame.intro = pc.s;
      if (pc.q && pc.q.length) frame.questions = pc.q;
    }
    var nodes = frame.nodes;
    var label = L.program || L.area;
    var diagram = nodes.map(function (n, i) {
      return '<div style="position:relative;border:1px solid var(--border);background:#fff;border-radius:10px;padding:12px 13px;min-height:92px">'
        + '<div class="mono" style="font-size:.6rem;letter-spacing:.05em;color:var(--red);font-weight:700;margin-bottom:6px">' + esc(n[0].toUpperCase()) + '</div>'
        + '<div style="font-size:.86rem;line-height:1.4;color:var(--ink);font-weight:600">' + esc(n[1]) + '</div>'
        + (i < nodes.length - 1 ? '<div aria-hidden="true" style="position:absolute;right:-14px;top:40%;font-size:1.1rem;color:var(--red);font-weight:700;z-index:2">&rarr;</div>' : '')
        + '</div>';
    }).join('');
    return '<section id="wk-lens" class="node"><h2 class="wk-sec">For your program</h2>'
      + '<p style="margin:0 0 12px;font-size:.95rem;line-height:1.55;color:var(--ink-dim)">This section changes with your selected program. It turns the week\'s topic into a field diagram while keeping the same readings, activity, assessment, and outcomes for everyone.</p>'
      + '<div style="background:#FDF0EE;border-left:3px solid var(--red);border-radius:0 10px 10px 0;padding:14px 16px;margin-bottom:14px"><div class="mono" style="font-size:.64rem;letter-spacing:.06em;color:var(--red);font-weight:700;margin-bottom:7px">TOPIC-AWARE FIELD DIAGRAM: ' + esc(label.toUpperCase()) + '</div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px">' + diagram + '</div></div>'
      + '</section>';
  }
  function lensCaseStudySection(w, d) {
    var L = lensParse();
    if (!L || !d) return '';
    var ctx = lensFieldContext(L);
    var topic = lensTopicFocus(d);
    var profile = lensActivityProfile(w, d.activity || {}, L);
    var focus = lensProgramFocus(L);
    var code = (D.course && D.course.code) || '';
    var frame = lensProgramCaseFrame(code, L, ctx, topic, profile, focus, w);
    var pc = window.BFS218_PROGRAM_CASES && L && L.program && window.BFS218_PROGRAM_CASES[L.program];
    if (pc) {
      if (pc.s) frame.intro = pc.s;
      if (pc.q && pc.q.length) frame.questions = pc.q;
    }
    var label = L.program || L.area;
    var qGrid = function (title, questions) {
      return '<div style="margin-top:14px"><div class="mono" style="font-size:.62rem;letter-spacing:.06em;color:var(--red);font-weight:700;margin-bottom:8px">' + title + '</div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px">'
        + (questions || []).map(function (q) { return '<div style="background:#F7F8FA;border:1px solid var(--border);border-radius:8px;padding:11px 13px;font-size:.86rem;line-height:1.48;color:var(--ink)">' + esc(q) + '</div>'; }).join('')
        + '</div></div>';
    };
    return '<section id="wk-case" class="node"><h2 class="wk-sec">Case study</h2>'
      + '<div class="mono" style="font-size:.64rem;letter-spacing:.06em;color:var(--red);font-weight:700;margin-bottom:7px">IN-DEPTH PROGRAM CASE STUDY</div>'
      + '<h3 style="font-size:1.08rem;margin:0 0 8px;color:var(--ink)">' + esc(label + ': a field case for Week ' + w) + '</h3>'
      + '<p style="margin:0 0 10px;line-height:1.62;color:var(--ink)">' + esc(frame.intro) + '</p>'
      + '<p style="margin:0 0 10px;line-height:1.62;color:var(--ink)"><b>' + esc(topic.concept) + '</b>' + (topic.cite ? ' (' + esc(topic.cite) + ')' : '') + ': ' + esc(frame.concept) + '</p>'
      + '<p style="margin:0 0 10px;line-height:1.62;color:var(--ink)">' + esc(frame.focus) + '</p>'
      + '<p style="margin:0 0 10px;line-height:1.62;color:var(--ink)">Work the case in two passes. First, trace the program-specific tool, record, standard, or professional judgment that would shape the decision. Then bring the course concept back in and ask what the case reveals that routine practice might miss.</p>'
      + qGrid('PROGRAM TRACE QUESTIONS', frame.questions)
      + qGrid('COURSE LENS QUESTIONS', frame.lensQuestions)
      + '</section>';
  }
  function lensHookExpansion(w) {
    var L = lensParse();
    var d = weekData(w);
    if (!L || !d) return '';
    var ctx = lensFieldContext(L);
    var topic = lensTopicFocus(d);
    var profile = lensActivityProfile(w, d.activity || {}, L);
    var focus = lensProgramFocus(L);
    var code = (D.course && D.course.code) || '';
    var frame = lensProgramCaseFrame(code, L, ctx, topic, profile, focus, w);
    var pc = window.BFS218_PROGRAM_CASES && L && L.program && window.BFS218_PROGRAM_CASES[L.program];
    if (pc) {
      if (pc.s) frame.intro = pc.s;
      if (pc.q && pc.q.length) frame.questions = pc.q;
    }
    var label = L.program || L.area;
    var lead = 'Read this week as a field systems check. In ' + label + ', the week matters when ' + ctx.decision + ' becomes a default inside ' + ctx.place + '.';
    if (code === 'PSY355') lead = 'Read this week as a field rehearsal, not a generic psychology unit. In ' + label + ', the week matters when ' + ctx.pressure + ' and the first interpretation of a client, learner, patient, teammate, or system problem starts to shape the response.';
    if (code === 'SOC122') lead = 'Read this week as a field map. In ' + label + ', the week matters when a setting such as ' + ctx.setting + ' hides power relationships, missing voices, or inherited assumptions.';
    var cells = frame.questions.slice(0, 3).map(function (q) {
      return '<div style="background:#fff;border:1px solid var(--border);border-radius:8px;padding:9px 11px;font-size:.82rem;line-height:1.42;color:var(--ink)">' + esc(q) + '</div>';
    }).join('');
    return '<div style="margin-top:11px;padding-top:11px;border-top:1px solid rgba(177,23,34,.18)">'
      + '<div class="mono" style="font-size:.6rem;letter-spacing:.06em;color:var(--red);font-weight:700;margin-bottom:6px">READ IT THROUGH ' + esc(label.toUpperCase()) + '</div>'
      + '<p style="margin:0 0 8px;font-size:.9rem;line-height:1.55;color:var(--ink)">' + esc(lead) + '</p>'
      + '<p style="margin:0 0 9px;font-size:.88rem;line-height:1.55;color:var(--ink-dim)">Carry the week\'s concept, ' + esc(topic.concept) + ', into the concrete tools, records, people, and pressures of the program. The goal is to notice where the course idea would change what you ask, document, design, recommend, or challenge.</p>'
      + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px">' + cells + '</div>'
      + '</div>';
  }
  function lensHook(w) {
    var L = lensParse();
    if (!L) return '';
    var LENS = window[(D.course && D.course.code) + '_LENS'];
    if (!LENS || !LENS.byArea || !LENS.byArea[L.area]) return '';
    var hook = LENS.byArea[L.area][String(w)];
    if (!hook) return '';
    var practice = lensPracticeLine(L);
    var expanded = lensHookExpansion(w);
    return '<div style="background:#FDF0EE;border-left:3px solid var(--red);border-radius:0 10px 10px 0;padding:12px 16px;margin:0 0 18px">'
      + '<div class="mono" style="font-size:.64rem;letter-spacing:.06em;color:var(--red);font-weight:700;margin-bottom:5px">FOR YOUR FIELD &middot; ' + esc(L.label.toUpperCase()) + '</div>'
      + '<p style="margin:0;font-size:.97rem;line-height:1.6;color:var(--ink)">' + esc(hook) + '</p>'
      + (practice ? '<p style="margin:8px 0 0;font-size:.92rem;line-height:1.55;color:var(--ink)">' + esc(practice) + '</p>' : '')
      + expanded
      + '<div style="margin-top:9px;font-size:.76rem;line-height:1.45;color:var(--ink-dim)">' + esc(lensChangeLine()) + '</div>'
      + '</div>';
  }
  function keyDatesList() {
    /* schema: [label, subtext, category, assignmentIndex?]  category = 'due' | 'open' | 'class' (finalized ASYNC due dates) */
    return [
      { d: '2026-09-08', it: [['First day of classes', '', 'class']] },
      { d: '2026-09-21', it: [['Map Exchange opens', '', 'open', 0], ['Compass Check opens', '', 'open', 1], ['Canadian Case File opens', '', 'open', 2]] },
      { d: '2026-10-25', it: [['Map Exchange checkpoint', 'due', 'due', 0], ['Compass Check', 'due', 'due', 1], ['Canadian Case File', 'due', 'due', 2]] },
      { d: '2026-10-26', it: [['Study Week', 'Oct 26 to 30. No classes.', 'class']] },
      { d: '2026-11-02', it: [['Design the Repair opens', '', 'open', 3], ['Personal Cartography opens', 'your final project', 'open', 4]] },
      { d: '2026-12-11', it: [['Design the Repair', 'due', 'due', 3], ['Map Exchange final close', 'due', 'due', 0], ['Personal Cartography', 'due', 'due', 4]] },
      { d: '2026-12-16', it: [['Last day of classes', 'Nothing is due this week.', 'class']] }
    ];
  }
  var KD_MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function kdDaysUntil(iso) {
    try { var t = new Date(); var a0 = Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()); var p = iso.split('-'); var b0 = Date.UTC(+p[0], +p[1] - 1, +p[2]); return Math.round((b0 - a0) / 86400000); } catch (e) { return 999; }
  }
  function kdMonthDay(iso) { var p = iso.split('-'); return KD_MON[+p[1] - 1] + ' ' + (+p[2]); }
  function nextDue() {
    var K = keyDatesList(), byDate = {};
    K.forEach(function (row) { row.it.forEach(function (x) { if (x[2] === 'due') { (byDate[row.d] = byDate[row.d] || []).push(x[0]); } }); });
    var dates = Object.keys(byDate).sort().filter(function (d) { return kdDaysUntil(d) >= 0; });
    if (!dates.length) return null;
    return { d: dates[0], names: byDate[dates[0]], days: kdDaysUntil(dates[0]) };
  }
  function dueReminderStrip() {
    if (state.screen === 'calendar') return '';
    var nd = nextDue(); if (!nd) return '';
    var lead = nd.days <= 0 ? 'Due today' : nd.days === 1 ? 'Due tomorrow' : nd.days <= 21 ? ('Due in ' + nd.days + ' days') : 'Next due';
    var urgent = nd.days <= 7 ? ' due-strip-urgent' : '';
    return '<div class="due-wrap"><button type="button" class="due-strip' + urgent + '" onclick="SOC.go(\'calendar\')" aria-label="Next due date. Opens the calendar page.">'
      + '<span class="due-strip-dot" aria-hidden="true"></span>'
      + '<span class="due-strip-main"><strong>' + esc(lead) + ':</strong> ' + esc(nd.names.join(', ')) + '</span>'
      + '<span class="due-strip-date">' + esc(kdMonthDay(nd.d)) + '</span>'
      + '<span class="due-strip-cta">See all dates <span aria-hidden="true">&#8594;</span></span>'
      + '</button></div>';
  }
  var WEBCAL = 'webcal://' + location.host + location.pathname.replace(/[^\/]*$/, '') + 'calendar/BFS218_key_dates.ics';
  function kdPad2(n) { return (n < 10 ? '0' : '') + n; }
  function kdIsoPlus1(iso) { var p = iso.split('-'); var dt = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2] + 1)); return dt.getUTCFullYear() + '-' + kdPad2(dt.getUTCMonth() + 1) + '-' + kdPad2(dt.getUTCDate()); }
  function kdIcsEsc(s) { return String(s).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n'); }
  function addCalUrls(iso, title, details) {
    var d0 = iso.replace(/-/g, ''), d1 = kdIsoPlus1(iso).replace(/-/g, '');
    var g = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(title) + '&dates=' + d0 + '/' + d1 + '&details=' + encodeURIComponent(details);
    var o = 'https://outlook.office.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=' + encodeURIComponent(title) + '&startdt=' + iso + '&enddt=' + kdIsoPlus1(iso) + '&allday=true&body=' + encodeURIComponent(details);
    var ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//BFS218//Companion//EN\r\nCALSCALE:GREGORIAN\r\nBEGIN:VEVENT\r\nUID:' + d0 + '-bfs218-async@rpeart73.github.io\r\nDTSTART;VALUE=DATE:' + d0 + '\r\nDTEND;VALUE=DATE:' + d1 + '\r\nSUMMARY:' + kdIcsEsc(title) + '\r\nDESCRIPTION:' + kdIcsEsc(details) + '\r\nBEGIN:VALARM\r\nTRIGGER:-P2D\r\nACTION:DISPLAY\r\nDESCRIPTION:' + kdIcsEsc(title) + '\r\nEND:VALARM\r\nEND:VEVENT\r\nEND:VCALENDAR';
    return { g: g, o: o, a: 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics) };
  }
  function phoneReminders() {
    return '<section class="node phone-rem">'
      + '<div class="mono" style="font-size:.7rem;letter-spacing:.08em;color:var(--red);font-weight:700;margin-bottom:4px">REMINDERS</div>'
      + '<h2 class="wk-sec" style="margin:0 0 4px">Get these on your phone</h2>'
      + '<p style="font-size:.9rem;line-height:1.55;color:var(--ink-dim);margin:0 0 12px">One tap adds the deadlines to your own phone calendar, with a reminder two days before. Nothing is downloaded, and nothing about you is stored here.</p>'
      + '<a href="' + WEBCAL + '" class="phone-sub">Subscribe on your phone <span aria-hidden="true">&#8594;</span></a>'
      + '<p style="font-size:.8rem;color:var(--ink-faint);margin:9px 0 0;line-height:1.5">This adds every deadline at once and keeps them updated if a date ever changes. It works with Apple Calendar and Google Calendar. You can also add one date at a time with the Google, Apple, or Outlook links beside each due date below.</p>'
      + '</section>';
  }
  function keyDatesRows(cats) {
    var K = keyDatesList(), out = '', curMon = '';
    var todayIso = '';
    try { var t = new Date(); todayIso = t.getFullYear() + '-' + ('0' + (t.getMonth() + 1)).slice(-2) + '-' + ('0' + t.getDate()).slice(-2); } catch (e) {}
    K.forEach(function (row) {
      var rowItems = cats ? row.it.filter(function (x) { return cats.indexOf(x[2]) >= 0; }) : row.it;
      if (!rowItems.length) return;
      var parts = row.d.split('-'), mi = parseInt(parts[1], 10) - 1, day = parseInt(parts[2], 10), mon = KD_MON[mi];
      if (mon !== curMon) { out += '<div class="kd-mon">' + mon + '</div>'; curMon = mon; }
      var past = todayIso && row.d < todayIso;
      var badge = '<div class="kd-date' + (past ? ' kd-past' : '') + '"><span class="kd-day">' + day + '</span><span class="kd-mo">' + mon.slice(0, 3) + '</span></div>';
      var items = rowItems.map(function (x) {
        var inner = '<span class="kd-dot"></span><span class="kd-t">' + esc(x[0]) + (x[1] ? ' <em>' + esc(x[1]) + '</em>' : '') + '</span>';
        if (x[3] != null) return '<a href="?screen=assignment-details&asg=' + x[3] + '" target="_blank" rel="noopener" class="kd-item kd-' + x[2] + ' kd-link" aria-label="Open the ' + esc(x[0]) + ' assignment in a new tab">' + inner + '<span class="kd-go" aria-hidden="true">&#8599;</span></a>';
        return '<div class="kd-item kd-' + x[2] + '">' + inner + '</div>';
      }).join('');
      var dueItems = rowItems.filter(function (x) { return x[2] === 'due'; });
      var add = '';
      if (dueItems.length) {
        var names = dueItems.map(function (x) { return x[0]; }).join(', ');
        var title = 'BFS218: ' + (dueItems.length > 1 ? (dueItems.length + ' assignments due') : (dueItems[0][0] + ' due'));
        var u = addCalUrls(row.d, title, names + '. Details on Blackboard and the BFS218 companion site.');
        add = '<div class="kd-add"><span class="kd-add-lbl">Remind me:</span> <a href="' + u.g + '" target="_blank" rel="noopener">Google</a> <a href="' + u.a + '">Apple</a> <a href="' + u.o + '" target="_blank" rel="noopener">Outlook</a></div>';
      }
      out += '<div class="kd-row' + (past ? ' kd-rowpast' : '') + '">' + badge + '<div class="kd-items">' + items + add + '</div></div>';
    });
    return out;
  }
  function keyDatesCompact() { return '<div class="kd-list">' + keyDatesRows() + '</div>'; }
  function keyDatesCalendar() {
    return '<section class="node kd-cal" aria-label="Key dates for this course">'
      + '<div class="mono" style="font-size:.7rem;letter-spacing:.08em;color:var(--red);font-weight:700;margin-bottom:4px">DUE DATES</div>'
      + '<h2 class="wk-sec" style="margin:0 0 4px">What you hand in, and when</h2>'
      + '<p style="font-size:.9rem;line-height:1.55;color:var(--ink-dim);margin:0 0 12px">There are two due dates. Roughly half of the work is due at the first, half at the second. Nothing is due in the final week. These are your due dates.</p>'
      + '<div class="kd-list">' + keyDatesRows(['due']) + '</div>'
      + '<h2 class="wk-sec" style="margin:24px 0 4px">When each assignment opens on Blackboard</h2>'
      + '<p style="font-size:.85rem;line-height:1.5;color:var(--ink-faint);margin:0 0 10px">These are opening dates, not deadlines.</p>'
      + '<div class="kd-list">' + keyDatesRows(['open']) + '</div>'
      + '<h2 class="wk-sec" style="margin:24px 0 4px">The class schedule</h2>'
      + '<p style="font-size:.85rem;line-height:1.5;color:var(--ink-faint);margin:0 0 10px">The shape of the term. Nothing here is due.</p>'
      + '<div class="kd-list">' + keyDatesRows(['class']) + '</div>'
      + '</section>';
  }
  function calEventsByIso() {
    var K = keyDatesList(), map = {};
    K.forEach(function (row) {
      var dues = row.it.filter(function (x) { return x[2] === 'due'; });
      var cls = row.it.filter(function (x) { return x[2] === 'class'; });
      var ops = row.it.filter(function (x) { return x[2] === 'open'; });
      var asg = row.it.filter(function (x) { return x[3] != null; }).map(function (x) { return x[3]; });
      var idx = asg.length === 1 ? asg[0] : (asg.length > 1 ? -1 : null);
      if (dues.length) map[row.d] = { kind: 'due', label: dues.length > 1 ? (dues.length + ' assignments due') : dues[0][0] + ' due', idx: idx };
      else if (cls.length) map[row.d] = { kind: 'class', label: cls[0][0], idx: null };
      else if (ops.length) map[row.d] = { kind: 'open', label: ops[0][0], idx: idx };
    });
    ['2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29'].forEach(function (d) { map[d] = { kind: 'study', label: 'Study Week' }; });
    return map;
  }
  function calMonthGrid(year, m) {
    var first = new Date(Date.UTC(year, m, 1)).getUTCDay();
    var days = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();
    var ev = calEventsByIso();
    var todayIso = '';
    try { var t = new Date(); todayIso = t.getFullYear() + '-' + ('0' + (t.getMonth() + 1)).slice(-2) + '-' + ('0' + t.getDate()).slice(-2); } catch (e) {}
    var dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(function (x) { return '<div class="cal-dow">' + x + '</div>'; }).join('');
    var cells = '';
    for (var i = 0; i < first; i++) cells += '<div class="cal-cell cal-blank"></div>';
    for (var d = 1; d <= days; d++) {
      var iso = year + '-' + ('0' + (m + 1)).slice(-2) + '-' + ('0' + d).slice(-2);
      var e = ev[iso], cls = 'cal-cell', tag = '';
      if (e) { cls += ' cal-' + e.kind; tag = '<span class="cal-tag">' + esc(e.label) + '</span>'; }
      if (iso === todayIso) cls += ' cal-today';
      var inner = '<span class="cal-num">' + d + '</span>' + tag;
      if (e && e.idx != null) {
        var href = e.idx >= 0 ? '?screen=assignment-details&asg=' + e.idx : '?screen=assignment-details';
        cells += '<a href="' + href + '" target="_blank" rel="noopener" class="' + cls + ' cal-link" aria-label="Open assignment information in a new tab">' + inner + '</a>';
      } else {
        cells += '<div class="' + cls + '">' + inner + '</div>';
      }
    }
    return '<div class="cal-month"><div class="cal-mhead">' + KD_MON[m] + ' ' + year + '</div><div class="cal-grid">' + dow + cells + '</div></div>';
  }
  function calendarLegend() {
    return '<div class="cal-legend">'
      + '<span class="cal-lg"><span class="cal-sw cal-sw-due"></span>Due date</span>'
      + '<span class="cal-lg"><span class="cal-sw cal-sw-open"></span>Assignment opens</span>'
      + '<span class="cal-lg"><span class="cal-sw cal-sw-class"></span>Class schedule</span>'
      + '<span class="cal-lg"><span class="cal-sw cal-sw-study"></span>Study Week</span>'
      + '</div>';
  }
  function calendarBody() {
    var grids = [8, 9, 10, 11].map(function (m) { return calMonthGrid(2026, m); }).join('');
    return calendarLegend() + '<div class="cal-grids">' + grids + '</div>' + keyDatesCalendar();
  }
  function calendarPage() {
    return '<div class="rise cal-page">'
      + '<div class="mono" style="font-size:.7rem;letter-spacing:.08em;color:var(--red);font-weight:700;margin-bottom:4px">CALENDAR</div>'
      + '<h1 style="font-size:1.9rem;line-height:1.15;font-weight:600;margin:0 0 8px;color:var(--ink)">Every date that matters</h1>'
      + '<p style="font-size:1rem;line-height:1.6;color:var(--ink-dim);margin:0 0 20px">This calendar keeps two things clearly apart: the red days when you hand something in, and the class schedule in navy (first day of classes, Study Week, and last day of classes). These are your due dates. Click any assignment to open its page in a new tab. Blackboard remains the official word on dates, and nothing here should ever be a surprise.</p>'
      + phoneReminders()
      + calendarBody()
      + '</div>';
  }
  function assignmentsData() {
    return [
      {
        id: 'map-exchange',
        title: 'Map Exchange',
        short: 'Share one located observation each week',
        weight: '20 marks (20%)',
        timing: 'Ongoing Weeks 3-12. Graded at the October 25 checkpoint and again at the end of Week 13.',
        opens: 'Starts Week 3',
        release: '2026-09-21',
        due: 'Checkpoint due by October 25, 2026. Final close due by December 11, 2026.',
        sectionDue: {
          async: 'Checkpoint due by October 25, 2026; final close due by December 11, 2026.',
          sync: 'Weekly Weeks 2 to 12; closes in Week 12.'
        },
        purpose: 'This assignment builds the habit that makes the rest of the course possible: noticing how ordinary digital systems shape people differently.',
        role: 'This is the weekly habit. You keep noticing where technology sorts, watches, helps, hides, or misreads people in everyday life.',
        really: [
          'Post one specific observation from your digital life, community, workplace, or field.',
          'Connect it to one course idea or reading in a sentence.',
          'Name who is affected, and at which intersection, then reply to one classmate with a question, addition, or respectful challenge.'
        ],
        submit: [
          'A short weekly Blackboard contribution. Text, a captioned image, or a short audio note are acceptable if Blackboard allows the format.',
          'One brief peer reply for that week.'
        ],
        criteria: [
          ['Consistency', 5, 'You show up across the term instead of posting everything at the end.'],
          ['Located specificity', 5, 'Your example is concrete: a tool, platform, form, camera, score, feed, or rule.'],
          ['Connection to reading', 4, 'You use the week\'s concept or source accurately.'],
          ['Exchange', 3, 'Your reply helps the conversation move, not just "I agree."'],
          ['Growth', 3, 'Your later posts show sharper noticing than your early posts.']
        ],
        strong: [
          'Names the exact technology or digital setting.',
          'Uses one course term correctly.',
          'Shows who carries the harm or who benefits from the default.'
        ],
        misses: [
          'Posting a general opinion with no real example.',
          'Forgetting the reading connection.',
          'Leaving the peer reply until the end.'
        ],
        checks: ['I named a real tool or digital moment.', 'I connected it to one course idea.', 'I replied to a classmate in a useful way.']
      },
      {
        id: 'coded-encounter',
        title: 'Compass Check',
        short: 'Scenario decisions and your mirror',
        weight: '20 marks (20%)',
        timing: 'Available in the first-half window. Complete Weeks 2 to 6 before you begin. Due Sunday, October 25, before Study Week.',
        opens: 'Week 3',
        release: '2026-09-21',
        due: 'Due by October 25, 2026.',
        sectionDue: {
          async: 'Due by October 25, 2026.',
          sync: 'Due by Friday, October 23, 2026.'
        },
        purpose: 'This Blackboard assessment helps you notice how you currently interpret first-half techno-racism scenarios and how carefully you can examine your own choices through the course concepts.',
        role: 'This is your first-half mirror. Part A records where your thinking begins; Part B is where you examine that pattern through Weeks 2 to 6.',
        really: [
          'Complete the learning for Weeks 2 to 6 before you begin.',
          'In Blackboard, answer 25 required single-answer scenarios. Every Part A choice is worth 0 marks and has no right or wrong answer.',
          'Finish with four short mirror reflections tied to choices you made in the same sitting. Each reflection is worth 5 marks.',
          'In every reflection, name the required scenarios by title and state the exact option you selected before you analyse it. Your instructor checks those citations against your recorded Blackboard answers.'
        ],
        submit: [
          'One completed Blackboard assessment: 25 selected answers and 4 written mirror responses. Each response cites the required scenario titles and selected options.'
        ],
        criteria: [
          ['Reflection 1', 5, 'You name three scenarios and selected options, then identify and explain a pattern.'],
          ['Reflection 2', 5, 'You name the scenario, selected option, and almost-picked option, then examine the hesitation.'],
          ['Reflection 3', 5, 'You name the scenario and selected option, then use one Weeks 2 to 6 concept accurately to reread it.'],
          ['Reflection 4', 5, 'You name two scenarios and selected options, compare responsibility across the settings, and identify a forward move.']
        ],
        strong: [
          'Names scenario titles and selected options that match the Blackboard attempt record.',
          'Uses a first-half concept accurately to examine, not correct, a choice.',
          'Examines thinking honestly rather than guessing what sounds virtuous.'
        ],
        misses: [
          'Starting before completing Weeks 2 to 6.',
          'Treating Part A as a hunt for the instructor\'s preferred attitude.',
          'Writing general reflections that do not name the required scenario titles and selected options.'
        ],
        checks: ['I completed Weeks 2 to 6.', 'I protected the full standard 90-minute window, or my approved accommodated time.', 'My approved accommodations appear correctly in Blackboard.', 'I know I must cite my scenario titles and selected options in Part B.']
      },
      {
        id: 'case-file',
        title: 'Canadian Case File',
        short: 'Investigate one real Canadian system',
        weight: '20 marks (20%)',
        timing: 'Opens with the whole first half in Week 3. Due Sunday, October 25, the night before Study Week.',
        opens: 'Week 3',
        release: '2026-09-21',
        due: 'Due by October 25, 2026.',
        sectionDue: {
          async: 'Due by October 25, 2026.',
          sync: 'Due in Week 8.'
        },
        purpose: 'This assignment moves from personal observation to a public Canadian system so your analysis is grounded in documented evidence.',
        role: 'This turns the course outward. You move from your own encounter to a real Canadian system with sources.',
        really: [
          'Pick one system from the Week 6 options: facial recognition, predictive or algorithmic policing, or a border or immigration algorithm.',
          'Build a short file explaining what the system is, how it works, and what concern the course lens reveals.',
          'Use three sources: one system or oversight source, one news source, and one scholarly source.'
        ],
        submit: [
          'About a two-page case file.',
          'A 60 to 90 second recorded brief answering the Blackboard prompt.'
        ],
        criteria: [
          ['Dossier', 5, 'The system is identified clearly and described accurately.'],
          ['Lens application', 5, 'You use the course concept to explain the problem, not just summarize the case.'],
          ['Local connection', 4, 'You connect the system to your city, community, field, or likely professional world.'],
          ['Recorded brief', 4, 'Your short recording is clear, direct, and in your own voice.'],
          ['Integrity', 2, 'Sources are real, cited, and used honestly.']
        ],
        strong: [
          'Uses sources to build evidence, not decoration.',
          'Explains the system before judging it.',
          'Makes a concrete Canadian or local connection.'
        ],
        misses: [
          'Choosing a non-Canadian case when the task asks for Canada.',
          'Using only news sources.',
          'Reading a script that sounds disconnected from your own understanding.'
        ],
        checks: ['I have three different source types.', 'I explained how the system works.', 'My recording answers the assigned prompt.']
      },
      {
        id: 'repair',
        title: 'Design the Repair',
        short: 'Propose a concrete response to one harm',
        weight: '20 marks (20%)',
        timing: 'Opens with the whole second half in Week 8, right after Study Week. Due by the end of Week 13.',
        opens: 'Week 8',
        release: '2026-11-02',
        due: 'Due by December 11, 2026.',
        sectionDue: {
          async: 'Due by December 11, 2026.',
          sync: 'Due in Week 12.'
        },
        purpose: 'This assignment asks you to stop at neither critique nor outrage. You design a concrete response to a harm you can explain.',
        role: 'This is where the course refuses to stop at critique. You design a response that fits one harm you already mapped.',
        really: [
          'Choose one harm from your Compass Check reflection or Canadian Case File.',
          'Design a concrete response using design justice, abolitionist tools, policy, accountability, or community governance.',
          'Explain who the response serves, who it asks something of, and why it fits the harm.'
        ],
        submit: [
          'A one-page peer-facing brief.',
          'Optional short pitch if Blackboard asks for or permits it.'
        ],
        criteria: [
          ['Grounding', 5, 'The repair responds to a harm you already documented.'],
          ['Use of reading', 4, 'The response is connected to Week 11 or Week 12 ideas.'],
          ['Specificity and feasibility', 5, 'The repair is concrete enough that a reader can picture what changes.'],
          ['Justice awareness', 3, 'You consider who gains power, protection, voice, or appeal.'],
          ['Argument', 3, 'You make a clear case for why this repair fits.']
        ],
        strong: [
          'Starts from a documented harm.',
          'Names a real change in design, policy, governance, review, or accountability.',
          'Explains trade-offs without giving up on repair.'
        ],
        misses: [
          'Offering a slogan instead of a design.',
          'Inventing a new harm instead of using earlier work.',
          'Saying "raise awareness" without naming what changes.'
        ],
        checks: ['I pointed back to the original harm.', 'My repair changes a process, rule, design, or accountability path.', 'I used at least one Week 11 or Week 12 idea.']
      },
      {
        id: 'cartography',
        title: 'Personal Cartography',
        short: 'Tell the story of your map',
        weight: '20 marks (20%)',
        timing: 'Opens with the whole second half in Week 8, right after Study Week. Due by the end of Week 13. Nothing is due in the final week.',
        opens: 'Week 8',
        release: '2026-11-02',
        due: 'Due by December 11, 2026. Nothing is due in Week 14.',
        sectionDue: {
          async: 'Due by December 11, 2026. Nothing is due in Week 14.',
          sync: 'Due by December 7, 2026. Nothing is due in Week 14.'
        },
        purpose: 'This assignment gathers the whole course into one map and asks you to explain how your way of seeing changed.',
        role: 'This is the final integration. You gather the pieces and show how your way of seeing changed across the term.',
        really: [
          'Gather four earlier pieces from the term.',
          'Weave them into one coherent map, visual, written, audio-described, or another approved format.',
          'Record a two to three minute walkthrough in your own voice, then respond to the assigned follow-up prompt.'
        ],
        submit: [
          'Your completed map or map description.',
          'A short reflective narrative.',
          'A two to three minute recorded walkthrough.'
        ],
        criteria: [
          ['Integration', 5, 'The earlier pieces connect into one map rather than sitting as separate assignments.'],
          ['Coherence', 4, 'A viewer can follow the story of your thinking.'],
          ['Reflection', 5, 'You show what changed in how you notice technology and racism.'],
          ['Walkthrough', 4, 'The recording is clear, organized, and in your own voice.'],
          ['Ownership', 2, 'The work sounds like you and shows your own relationship to the material.']
        ],
        strong: [
          'Shows a before-and-after in your own thinking.',
          'Uses specific earlier evidence.',
          'Ends with a commitment you can carry into your field.'
        ],
        misses: [
          'Making a pretty map with no explanation.',
          'Summarizing the course instead of tracing your own learning.',
          'Submitting only the recording or only the map when both are required.'
        ],
        checks: ['I used four earlier pieces.', 'My map tells one connected story.', 'My walkthrough is in my own voice and within the time range.']
      }
    ];
  }
  function assignmentFaqs() {
    return [
      ['Where do I submit?', 'Submit in Blackboard. This companion site helps you understand, practise, and prepare; it is not the submission system and it does not record grades.'],
      ['Where can I access the complete assignments?', 'The complete assignments will be opened on Blackboard. This page explains the assignment arc and helps you prepare, but Blackboard is the official place for the full instructions, files, dropboxes, due dates, feedback, and grades.'],
      ['Can I email my assignment or send a link?', 'No. The assessment briefs say Blackboard submission only. Email submissions or email-only links are not accepted.'],
      ['Are all five assignments separate?', 'They are graded separately, but they build one thing: your Personal Cartography. Each assignment adds another layer to the same map.'],
      ['What if I miss a deadline?', 'The course assessment documents describe firm deadlines. Check Blackboard for the exact date and time, and ask the instructor early if you are unsure.'],
      ['Can I use generative AI?', 'Only as study support. You may use it to brainstorm, check clarity, or organize your own notes, but you must disclose the tool, date, and purpose. Do not submit AI-written or AI-rewritten work as your own. Use How to Use AI Properly for examples.'],
      ['What happens if AI writes my paper?', 'Submitting AI-written or AI-rewritten work as your own can be treated as academic misconduct. That can lead to a zero on the assignment, a formal academic-integrity process, and further course or institutional penalties. If you are unsure, do not submit the AI text. Ask first and disclose.'],
      ['What happens if there is an academic-integrity concern?', 'The instructor will contact you first and identify the concern so you can respond before any formal report. The review focuses on the suspected issue, your explanation, assignment evidence, and Blackboard process records where relevant.'],
      ['Can AI fix my grammar?', 'A grammar or clarity check is different from having AI write the assignment. If a tool changes wording, structure, claims, sources, or analysis, disclose it. Your final ideas, course connections, examples, and evidence must be yours.'],
      ['What if screenshots do not work for my example?', 'Use another artifact you can explain clearly: a form field, prompt, output, setting, rule, notice, policy line, captioned photo, or short audio description.'],
      ['Do I need advanced technical knowledge?', 'No. The course asks you to notice patterns, explain evidence, connect to readings, and speak clearly. You do not need to code or reverse-engineer a system.'],
      ['Where do accommodations fit?', 'Formal ALS accommodations are honoured. Use the approved Seneca process and check Blackboard or the instructor message for any course-specific direction.']
    ];
  }
  function assignmentPolicyPanel() {
    var policies = [
      ['Blackboard is official', 'Use Blackboard for assignment instructions, submissions, due dates, feedback, and grades.'],
      ['The site is a guide', 'This page explains the assignment arc clearly. It does not replace the official Blackboard dropboxes or assessment files.'],
      ['Your work stays yours', 'Use the activities and notes here to practise. Export or submit only through the course process described in Blackboard.'],
      ['AI disclosure matters', 'If you use generative AI as study support, disclose it. Do not use AI to write or rewrite submitted work as if it were yours.'],
      ['Concerns are discussed first', 'If an academic-integrity concern arises, the instructor contacts you before any formal report so you can respond to the specific issue.']
    ];
    return '<section class="asg-policy" aria-label="Important assignment rules">' + policies.map(function (p) {
      return '<div><b>' + esc(p[0]) + '</b><span>' + esc(p[1]) + '</span></div>';
    }).join('') + '</section>';
  }
  function assignmentIntegrityProcessNote() {
    var rows = [
      ['Instructor contact first', 'If there is an academic-integrity concern, the instructor contacts you and names the specific issue before any formal report is submitted.'],
      ['Your response matters', 'The first step is information gathering. You have a chance to explain your process, disclosure, sources, and assignment choices.'],
      ['Blackboard records', 'Blackboard Activity Log evidence may be reviewed. A Progress report is not enough by itself and needs the Activity Log with it.']
    ];
    return '<div class="asg-ai-rule"><b>Academic-integrity process</b><p>Concerns are handled through direct communication and evidence review, not guesses about writing style alone.</p><div class="asg-lens-steps">' + rows.map(function (r) {
      return '<article><b>' + esc(r[0]) + '</b><p>' + esc(r[1]) + '</p></article>';
    }).join('') + '</div></div>';
  }
  function assignmentLocalDate() {
    var d = new Date(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }
  function assignmentDateLabel(ymd) {
    if (!ymd) return 'Date to be confirmed';
    var p = String(ymd).split('-'), d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    return d.toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' });
  }
  function assignmentDateParts(ymd) {
    if (!ymd) return { month: 'TBD', day: '', year: '' };
    var p = String(ymd).split('-'), d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    return {
      month: d.toLocaleDateString('en-CA', { month: 'short' }).toUpperCase().replace('.', ''),
      day: String(d.getDate()),
      year: String(d.getFullYear())
    };
  }
  function assignmentDueText(a) {
    if (!a || !a.sectionDue) return (a && a.due) || '';
    return a.sectionDue.async;
  }
  function assignmentDueHtml(a) {
    if (!a || !a.sectionDue) return '<small class="asg-due">' + esc((a && a.due) || '') + '</small>';
    return '<small class="asg-due" style="font-size:.84rem;line-height:1.45;color:var(--ink)"><b>Due:</b> ' + esc(a.sectionDue.async) + '</small>';
  }
  function assignmentPreviewBanner() {
    return '<section class="asg-preview-mode" aria-label="Assignment guide status"><b>Preparation guide</b><p>This page helps you understand the assignment arc and prepare stronger examples. The complete official assignment files, dropboxes, due dates, feedback, and grades will be opened on Blackboard.</p></section>';
  }
  function assignmentDirectory(items) {
    var cur = Math.max(0, Math.min(items.length - 1, Number(state.assignmentIndex) || 0));
    return '<section id="asg-assignments" class="asg-directory" aria-label="Assignment rooms"><div class="mono">ASSIGNMENT ROOMS</div><h2>Choose one assignment</h2><p>Pick a card to see the guidance for that assignment. The page shows one assignment room at a time so you are not scrolling through the whole term.</p><div>'
      + items.map(function (a, i) {
        return '<button type="button" onclick="SOC.assignPick(' + i + ')" class="' + (i === cur ? 'current' : '') + '" aria-pressed="' + (i === cur ? 'true' : 'false') + '"><span>' + esc(a.weight) + ' &middot; Blackboard</span><b>' + esc(a.title) + '</b><small>' + esc(a.short) + '</small></button>';
      }).join('') + '</div></section>';
  }
  function assignmentJumpNav() {
    var active = assignmentActivePage();
    var items = [['story', 'Overview'], ['program', 'View Programs'], ['assignments', 'Starting Your Assignment'], ['quality', 'How I Grade'], ['release', 'Release & Due Dates'], ['ai', 'How to Use AI Properly'], ['faq', 'FAQ']];
    return '<nav class="asg-jump" aria-label="Assignments guide sections">' + items.map(function (it) {
      var on = active === it[0];
      return '<button type="button" onclick="SOC.assignmentPage(\'' + it[0] + '\')" aria-current="' + (on ? 'page' : 'false') + '" class="' + (on ? 'on' : '') + '">' + esc(it[1]) + '</button>';
    }).join('') + '</nav>';
  }
  function assignmentQualityPath() {
    var levels = [
      ['Emerging', 'You are beginning the task. The example, concept, evidence, or relationship to the topic still needs support and clearer detail.'],
      ['Acquiring', 'You are gathering what you need: a clearer example, stronger evidence, course language, and a better sense of who is affected.'],
      ['Demonstrating', 'You meet the task clearly. Your example, evidence, course language, and explanation work together and are easy to follow.'],
      ['Connecting', 'You show how the example, evidence, course idea, your position, and the people affected fit together. The work explains why the connection matters.']
    ];
    var readFor = [
      ['Specific evidence', 'Name the exact tool, rule, form, score, platform, source, case, screen, or decision point. I need to see what you are analysing.'],
      ['Course thinking', 'Use the course concept to explain what the system does. Do not just name the term and move on.'],
      ['Your own voice', 'A polished answer that says little is weaker than a rougher answer that is honestly working through evidence.'],
      ['Connection', 'Show how the example, people affected, source evidence, and your own position fit together.'],
      ['Responsibility', 'Explain what the example asks a person, field, institution, or system to notice or change.']
    ];
    var process = [
      ['Start with the task', 'I first ask whether the submission answered the actual prompt and included the required pieces.'],
      ['Read the evidence', 'I look for concrete proof: an artifact, source, scene, case, data point, or documented system.'],
      ['Check the concept', 'I check whether the course idea is accurate and whether it is being used to explain the example.'],
      ['Look for growth', 'Across the term, stronger work becomes more specific, more careful, and more connected.'],
      ['Write useful feedback', 'Feedback names what is working and the next one or two moves that would make the work stronger.']
    ];
    var integrity = [
      ['Format is not the grade', 'Text, audio, video, map, table, or diagram can all work when the substance answers the prompt.'],
      ['Polish is not proof', 'Clean writing helps, but it does not replace evidence, course language, or your own analysis.'],
      ['AI cannot write the work', 'If a tool writes or rewrites the assignment, that can become an academic-integrity issue. Use How to Use AI Properly before submitting.'],
      ['Late and wrong-channel work', 'Blackboard is the official submission space. Late work and email submissions follow the course rules posted in Blackboard.']
    ];
    return '<section id="asg-quality" class="asg-qualitypath" aria-label="How I Grade"><div><div class="mono">HOW I GRADE</div><h2>What I read for</h2><p>Each assignment is marked out of 20. The exact criteria change by assignment, but the standard stays consistent: accurate course thinking, specific evidence where the task calls for it, your own voice, and a clear connection to why the system matters.</p></div>'
      + '<div class="asg-grade-note"><b>How Compass Check is different</b><p>All 25 Part A choices are required but earn 0 marks. They have no right or wrong answer. The four reflections earn 5 marks each and carry the full 20 marks. Your choices are evidence for reflection; their content is not graded as a preferred attitude. Every cited scenario title and selected option is checked against the recorded Blackboard attempt.</p></div>'
      + '<div class="asg-grade-note"><b>The short version</b><p>I am looking for the part of the work that could only have come from you: the example you noticed, the evidence you chose, the course idea you used, and the connection you made. Feedback is help, not punishment.</p></div>'
      + '<div class="asg-qualitypath-grid">' + levels.map(function (l) {
      return '<article><b>' + esc(l[0]) + '</b><p>' + esc(l[1]) + '</p></article>';
    }).join('') + '</div>'
      + '<div class="asg-program-wide"><div class="mono">WHAT COUNTS AS STRONGER WORK</div><h3>Specific before polished</h3><div class="asg-lens-map">' + readFor.map(function (m) {
      return '<article><span>' + esc(m[0]) + '</span><p>' + esc(m[1]) + '</p></article>';
    }).join('') + '</div></div>'
      + '<div class="asg-program-wide"><div class="mono">HOW THE GRADE IS BUILT</div><h3>How I move through a submission</h3><div class="asg-lens-steps">' + process.map(function (m) {
      return '<article><b>' + esc(m[0]) + '</b><p>' + esc(m[1]) + '</p></article>';
    }).join('') + '</div></div>'
      + '<details class="asg-moves"><summary>Important grading boundaries</summary><div>' + integrity.map(function (m) {
      return '<article><b>' + esc(m[0]) + '</b><p>' + esc(m[1]) + '</p></article>';
    }).join('') + '</div></details></section>';
  }
  function assignmentProgramMove(a, L) {
    var ctx = lensFieldContext(L);
    if (!L) return [
      ['Choose', 'Pick one real system from a field you know.'],
      ['Ask', 'What does it do, and who feels the effect?'],
      ['Show', 'Use a visible detail, artifact, or source as evidence.']
    ];
    var profile = assignmentLensProfile(L);
    return [
      ['Choose', 'Start with ' + profile.topics.slice(0, 3).join(', ') + '.'],
      ['Use evidence', 'Bring in ' + profile.artifacts.slice(0, 3).join(', ') + '.'],
      ['Answer the course', profile.question]
    ];
  }
  function assignmentLensProfile(L) {
    var ctx = lensFieldContext(L), label = (L && (L.program || L.area)) || 'your program';
    var spec = programSpecificProfile(L);
    var byArea = {
      "Aviation": {
        topics: ['passenger screening', 'biometric boarding', 'watchlist checks', 'dispatch records', 'crew handoff systems'],
        artifacts: ['a screening notice', 'a kiosk message', 'a checklist item', 'a policy threshold', 'an incident or delay record'],
        question: 'Ask who gets delayed, flagged, or sent for manual review, and whether the person can challenge the flag.'
      },
      "Business": {
        topics: ['hiring screens', 'credit rules', 'pricing tools', 'customer dashboards', 'vendor AI recommendations'],
        artifacts: ['a score output', 'a dashboard metric', 'a job filter', 'a customer segment', 'a vendor claim or policy line'],
        question: 'Ask who the metric rewards, who it filters out before human review, and what proxy variable might be doing the work.'
      },
      "Creative Arts, Animation and Design": {
        topics: ['image generators', 'style defaults', 'portfolio platforms', 'audience testing', 'asset libraries'],
        artifacts: ['a prompt result', 'a reference board', 'a crop or lighting default', 'a style guide', 'a platform rule'],
        question: 'Ask whose face, body, culture, or story is treated as normal, and who is made invisible or stereotyped.'
      },
      "Education, Community and Social Services": {
        topics: ['intake forms', 'risk notes', 'early-warning dashboards', 'placement decisions', 'referral systems'],
        artifacts: ['an intake field', 'a risk label', 'a referral rule', 'a case-note template', 'a placement criterion'],
        question: 'Ask whose context is flattened by the record, who gets watched harder, and who has voice in the file.'
      },
      "Engineering Technology": {
        topics: ['sensor calibration', 'site standards', 'testing plans', 'safety thresholds', 'accessibility defaults'],
        artifacts: ['a spec', 'a test result', 'a drawing note', 'a tolerance range', 'an inspection record'],
        question: 'Ask who the standard was tested on, who the built system protects, and who is left outside the default.'
      },
      "Fashion and Esthetics": {
        topics: ['shade matching', 'skin-analysis apps', 'beauty filters', 'retail surveillance', 'client records'],
        artifacts: ['a shade result', 'a filter output', 'a product match', 'a client form field', 'a store policy'],
        question: 'Ask whose skin, body, hair, or beauty standard the tool recognizes, and who it tries to correct.'
      },
      "Health and Wellness": {
        topics: ['triage scores', 'patient portals', 'device readings', 'risk tools', 'referral rules'],
        artifacts: ['a chart field', 'a device output', 'a referral rule', 'a care-plan default', 'a risk score'],
        question: 'Ask who the tool reads accurately, who it misses, and who carries the cost of a wrong screen.'
      },
      "Hospitality and Tourism": {
        topics: ['booking systems', 'guest screening', 'dynamic pricing', 'ratings', 'staffing tools'],
        artifacts: ['a booking rule', 'a price change', 'a guest profile', 'a rating prompt', 'a service script'],
        question: 'Ask who is welcomed, who is treated as risk, and who can contest a booking, price, or service decision.'
      },
      "Information Technology": {
        topics: ['data models', 'permissions', 'logs', 'testing sets', 'support queues'],
        artifacts: ['a data field', 'a default setting', 'a ticket pattern', 'a test case', 'an access rule'],
        question: 'Ask where bias enters the stack, what the system records, and what evidence would prove the fix works.'
      },
      "Law, Administration and Public Safety": {
        topics: ['risk tools', 'case notes', 'policy thresholds', 'incident reports', 'appeal paths'],
        artifacts: ['a report field', 'a risk flag', 'a policy rule', 'a file note', 'an appeal instruction'],
        question: 'Ask who gets flagged, who gets believed, and how a person can challenge the decision.'
      },
      "Liberal Arts and University Transfers": {
        topics: ['research methods', 'source choices', 'disciplinary claims', 'essay arguments', 'public policy debates'],
        artifacts: ['a source', 'a definition', 'an evidence rule', 'a theory', 'a research question'],
        question: 'Ask what the claim treats as evidence, whose experience it leaves out, and how the course concept changes the argument.'
      },
      "Media and Communications": {
        topics: ['search ranking', 'feed algorithms', 'story framing', 'content moderation', 'audience analytics'],
        artifacts: ['a headline', 'a search result', 'a platform rule', 'a moderation note', 'an audience metric'],
        question: 'Ask who gets framed as credible, who gets flattened, and who controls which story rises.'
      },
      "Science": {
        topics: ['sampling', 'instruments', 'lab thresholds', 'data cleaning', 'model assumptions'],
        artifacts: ['a sample rule', 'an instrument setting', 'a cutoff', 'a dataset field', 'a protocol line'],
        question: 'Ask whose data fits the method, whose result gets treated as noise, and who can question the model.'
      }
    };
    var profile = byArea[L && L.area] || {
      topics: [ctx.setting, ctx.place, ctx.decision],
      artifacts: ['a form field', 'a policy line', 'a screenshot', 'a score output', 'a source'],
      question: 'Ask who benefits, who carries risk, and who can challenge a bad outcome.'
    };
    if (spec) {
      profile = Object.assign({}, profile);
      if (spec.topics && spec.topics.length) profile.topics = spec.topics;
      if (spec.artifacts && spec.artifacts.length) profile.artifacts = spec.artifacts;
      if (spec.question) profile.question = spec.question;
      if (spec.overview) profile.overview = spec.overview;
      if (spec.interface) profile.interface = spec.interface;
    }
    profile.label = label;
    profile.focus = lensProgramFocus(L);
    return profile;
  }
  function assignmentProgramAssignmentRows(L, profile) {
    L = L || generalStreamLens();
    var ctx = lensFieldContext(L);
    profile = profile || assignmentLensProfile(L);
    var t = profile.topics || [], a = profile.artifacts || [];
    return [
      ['Map Exchange', 'Notice one field moment', 'Use ' + (t[0] || ctx.decision) + ' as a weekly observation. Keep the example small enough that you can describe what happened, who was affected, and what question it raises.'],
      ['Compass Check', 'Connect the first-half concept trail', 'Use your program setting to rehearse how a rule, default, data choice, visibility pattern, or Canadian system can shape an outcome. The graded scenarios remain in Blackboard.'],
      ['Canadian Case File', 'Move from example to system', 'Find a Canadian system connected to ' + (t[1] || ctx.setting) + '. Use sources to explain what the system does before you make the argument about harm.'],
      ['Design the Repair', 'Change a process', 'Return to a harm you can prove. Propose a change to a rule, review step, design choice, appeal path, or accountability process.'],
      ['Cartography', 'Connect the term', 'Choose earlier pieces that show how your thinking about ' + ctx.label + ' changed. The goal is not to list work. It is to tell the story of how your analysis grew.']
    ];
  }
  function assignmentProgramCaseCards(L, profile) {
    L = L || generalStreamLens();
    var ctx = lensFieldContext(L);
    profile = profile || assignmentLensProfile(L);
    var t = profile.topics || [], a = profile.artifacts || [];
    return [
      ['Start with the system', 'Pick ' + (t[0] || ctx.decision) + ', not the whole field. A narrow system gives you something you can actually inspect.'],
      ['Anchor it in evidence', 'Use ' + (a[0] || 'one artifact') + ' or ' + (a[1] || 'one policy line') + '. A reader should be able to see what you are analysing.'],
      ['Ask the course question', profile.question],
      ['Name the consequence', 'Explain who is sorted, delayed, watched, excluded, protected, or given a way to challenge the outcome.']
    ];
  }
  function assignmentProgramStrengthCheck(L, profile) {
    L = L || generalStreamLens();
    var ctx = lensFieldContext(L);
    profile = profile || assignmentLensProfile(L);
    var topic = (profile.topics && profile.topics[0]) || ctx.decision;
    var artifact = (profile.artifacts && profile.artifacts[0]) || 'a visible artifact';
    return [
      ['Too broad', 'Technology in ' + ctx.label + ' can be biased.'],
      ['Stronger', 'A ' + topic + ' uses ' + artifact + ' to sort people, and the assignment asks who benefits, who is exposed, and who can challenge the result.'],
      ['Best next move', 'Bring the example back to one course concept and one assigned source before you write the answer.']
    ];
  }
  function assignmentProgramRoomDetail(a, L) {
    L = L || generalStreamLens();
    var rows = assignmentProgramAssignmentRows(L).filter(function (r) { return a && a.title && r[0] === a.title.replace('Personal ', '').replace(' Capstone', ''); });
    if (!rows.length && a) {
      var byId = {
        'map-exchange': assignmentProgramAssignmentRows(L)[0],
        'coded-encounter': assignmentProgramAssignmentRows(L)[1],
        'case-file': assignmentProgramAssignmentRows(L)[2],
        'repair': assignmentProgramAssignmentRows(L)[3],
        'cartography': assignmentProgramAssignmentRows(L)[4]
      };
      rows = [byId[a.id] || assignmentProgramAssignmentRows(L)[0]];
    }
    var profile = assignmentLensProfile(L), ctx = lensFieldContext(L), row = rows[0] || [];
    return '<div class="asg-room-lens"><span>Program-lens example</span><article><b>' + esc(row[1] || 'Use your field') + '</b><p>' + esc(row[2] || profile.question) + '</p></article><article><b>Keep the course lens</b><p>Use ' + esc(ctx.label) + ' for the example, then answer what the course asks: what the system does, who it sorts, who benefits, who is exposed, and who can challenge the outcome.</p></article></div>';
  }
  function assignmentProgramFit(a, L) {
    L = L || generalStreamLens();
    var profile = assignmentLensProfile(L), ctx = lensFieldContext(L), field = ctx.label, topic = profile.topics[0] || ctx.decision, topic2 = profile.topics[1] || ctx.setting, artifact = profile.artifacts[0] || 'one visible artifact', artifact2 = profile.artifacts[1] || 'one policy line';
    var base = {
      title: 'How ' + field + ' connects to this assignment',
      intro: 'Your program helps you choose the example, the artifact, and the people affected. The course gives you the question you must answer.',
      cards: [
        ['Program connection', 'Look at ' + topic + ' in ' + ctx.setting + '.'],
        ['Evidence connection', 'Use ' + artifact + ' or ' + artifact2 + ' so the reader can see what you are analysing.'],
        ['Course connection', profile.question]
      ],
      steps: [
        'Name the concrete system, not the whole profession.',
        'Point to the artifact or rule that shows how the system works.',
        'Use a course concept to explain what the system does to people.'
      ],
      starter: 'In ' + field + ', this matters because ' + ctx.people + ' can be sorted, delayed, watched, excluded, protected, or given no clear way to challenge the outcome.'
    };
    var byId = {
      'map-exchange': {
        intro: 'For Map Exchange, your program gives you a place to notice one small moment each week. Do not solve it yet. Learn to see it clearly.',
        cards: [
          ['Where to look', 'Watch for ' + topic + ', ' + topic2 + ', or another routine system in ' + ctx.setting + '.'],
          ['What to capture', 'Record the screen, rule, wording, score, form field, checklist, or decision point that shaped what happened.'],
          ['What to ask', 'Who did the system make things easier for, harder for, more visible for, or less visible for?']
        ],
        steps: [
          'Choose one small moment from the week, not a broad issue.',
          'Describe what the system did clearly.',
          'Connect it to the week concept so the entry becomes analysis, not only an opinion.'
        ],
        starter: 'This week, I noticed ' + topic + ' in ' + field + '. The system mattered because it shaped what happened to ' + ctx.people + '.'
      },
      'coded-encounter': {
        intro: 'For Compass Check, your program lens gives you a familiar setting for practice. The graded scenarios stay in Blackboard and are not stored on this site.',
        cards: [
          ['Review the concept trail', 'Connect New Jim Code, engineered inequity, default discrimination, coded exposure, and Canadian algorithmic systems.'],
          ['Use your field as rehearsal', 'Ask how ' + topic + ', ' + artifact + ', or another routine system in ' + ctx.place + ' might sort, expose, delay, or protect people.'],
          ['Keep the mirror honest', 'The orientation choices are not graded as right or wrong. The reflection is strongest when it points to what you actually chose.']
        ],
        steps: [
          'Finish the Weeks 2 to 6 learning before opening the assessment.',
          'Use the Knowledge Checks and flashcards to rehearse the concepts, not the assessment items.',
          'Complete the timed assessment independently in Blackboard.'
        ],
        starter: 'In ' + field + ', I will watch for the rule, data, default, or visibility pattern that shapes what happens to ' + ctx.people + '.'
      },
      'case-file': {
        intro: 'For Canadian Case File, your program helps you choose a public system that has documents, reports, policy, or news coverage you can verify.',
        cards: [
          ['Find the Canadian system', 'Look for a Canadian example connected to ' + topic + ', ' + topic2 + ', or a public system your field depends on.'],
          ['Use source evidence', 'Bring in a report, policy page, public notice, article, legal document, dataset note, or institutional statement.'],
          ['Keep the analysis grounded', 'Explain what the system does before you argue why it matters.']
        ],
        steps: [
          'Choose a real Canadian case with sources you can cite.',
          'Explain the system, actor, tool, and decision point.',
          'Connect the evidence to a course concept and to the people affected.'
        ],
        starter: 'This Canadian case matters to ' + field + ' because a technical or administrative rule creates a real consequence for ' + ctx.people + '.'
      },
      'repair': {
        intro: 'For Design the Repair, your program helps you imagine a response that could actually change a process, not just name a problem.',
        cards: [
          ['Return to a proved harm', 'Use an example from ' + topic + ', ' + topic2 + ', or an earlier artifact you already explained.'],
          ['Change something concrete', 'Change a rule, review step, design default, appeal path, documentation habit, or accountability process.'],
          ['Explain the protection', 'Show who gains voice, notice, consent, review, appeal, safety, or control.']
        ],
        steps: [
          'Start from the harm you already documented.',
          'Name the exact repair and who would have to do it.',
          'Explain what the repair changes for the people affected.'
        ],
        starter: 'The repair fits ' + field + ' because it changes ' + ctx.decision + ' and gives ' + ctx.people + ' more voice, protection, appeal, or control.'
      },
      'cartography': {
        intro: 'For the final project, your program helps you tell a story of changed seeing. You are not proving that the field is good or bad. You are showing what you can now notice.',
        cards: [
          ['Choose your pattern', 'Return to earlier entries about ' + topic + ', ' + topic2 + ', or another repeated system in ' + field + '.'],
          ['Show growth', 'Compare what you noticed early in the course with what you can name now.'],
          ['Carry it forward', 'End with one responsibility, question, or habit you will bring into ' + ctx.setting + '.']
        ],
        steps: [
          'Pick earlier pieces that connect instead of listing everything.',
          'Explain how your language and evidence changed.',
          'Name what responsibility you carry into your field.'
        ],
        starter: 'My map shows that I now notice how ' + field + ' systems can shape ' + ctx.people + ', and what I need to ask before I trust a tool, rule, or score.'
      }
    };
    var fit = byId[a && a.id] || {};
    return {
      title: base.title,
      intro: fit.intro || base.intro,
      cards: fit.cards || base.cards,
      steps: fit.steps || base.steps,
      starter: fit.starter || base.starter
    };
  }
  function assignmentFrameworkContract(a, L) {
    L = L || generalStreamLens();
    var profile = assignmentLensProfile(L), ctx = lensFieldContext(L), field = ctx.label, topic = profile.topics[0] || ctx.decision, artifact = profile.artifacts[0] || 'one visible artifact';
    var base = {
      title: 'This is a framework, not an answer',
      intro: 'Use this page to decide where to look, what kind of evidence to collect, and how to connect the example to the course. Do not copy the wording as your answer. Your submission must be built from your own example, your own evidence, and your own explanation.',
      rows: [
        ['What this gives you', 'A concrete place to look in ' + field + ', likely artifacts, people affected, and the course question to keep in view.'],
        ['What you must supply', 'Your own real example, one visible artifact or source, one assigned course concept, and a clear explanation of what the system does.'],
        ['What you must not do', 'Do not turn this into general career advice, do not submit the sentence frames as final writing, and do not skip the assigned readings.']
      ]
    };
    var byId = {
      'map-exchange': {
        intro: 'For Map Exchange, the framework helps you notice one small weekly moment. It does not tell you what to post. You still choose the moment, describe what happened, connect it to that week, and write a peer reply that moves the conversation forward.',
        rows: [
          ['Use the guide to find', 'A small moment involving ' + topic + ', a screen, a rule, a setting, or a decision that actually appeared in your week.'],
          ['You still have to write', 'What happened, who was affected, which weekly idea helps explain it, and why the example is more than a personal opinion.'],
          ['Do not overreach', 'One precise observation is stronger than a broad claim about the whole field.']
        ]
      },
      'coded-encounter': {
        intro: 'For Compass Check, this page can help you review where course mechanisms might appear in your field. It does not preview the graded scenarios. The assessment itself is a closed, timed Blackboard sitting.',
        rows: [
          ['Use the guide to rehearse', 'How ' + topic + ', ' + artifact + ', a rule, a default, a data choice, or a visibility pattern could affect people in ' + field + '.'],
          ['You still have to do', 'The Weeks 2 to 6 learning, 25 honest scenario choices, and four reflections on your own pattern.'],
          ['Do not use AI during the assessment', 'Generative AI, outside answers, and shared response banks are not permitted in the timed sitting.']
        ]
      },
      'case-file': {
        intro: 'For Canadian Case File, the framework helps you move from an example to a documented Canadian system. It does not choose the case or sources for you. You must verify the case, use different source types, and explain the system before making the argument.',
        rows: [
          ['Use the guide to find', 'A Canadian system connected to ' + topic + ', a public institution, an oversight report, a court case, a policy document, or a documented media report.'],
          ['You still have to verify', 'The source trail, what the system actually does, who is affected, and how the course concept changes the reading of the case.'],
          ['Do not summarize only', 'A case file is analysis. It must explain the mechanism and consequence, not just retell a news story.']
        ]
      },
      'repair': {
        intro: 'For Design the Repair, the framework helps you turn critique into a concrete response. It does not let you invent an easy fix. You must start from a harm you can prove and design a repair that changes a rule, process, design choice, review step, or accountability path.',
        rows: [
          ['Use the guide to return to', 'A harm involving ' + topic + ', a source, an artifact, or an earlier case where the mechanism is already clear.'],
          ['You still have to design', 'Who must act, what changes, who gains voice or protection, what trade-off remains, and why the repair fits the harm.'],
          ['Do not stop at awareness', 'A strong repair names a change someone could picture, test, revise, or be held accountable for.']
        ]
      },
      'cartography': {
        intro: 'For the final project, the framework helps you connect the term into one map of changed thinking. It does not assemble the story for you. You must choose earlier pieces, explain what changed, and show how the course altered what you now notice.',
        rows: [
          ['Use the guide to gather', 'Earlier work involving ' + topic + ', course terms, activity notes, media notes, reading notes, and artifacts that show a pattern.'],
          ['You still have to connect', 'What you noticed at first, what you understand now, which evidence changed your thinking, and what responsibility you carry forward.'],
          ['Do not list assignments', 'The final project is a connected learning story, not a folder of separate tasks.']
        ]
      }
    };
    var fit = byId[a && a.id] || {};
    return {
      title: fit.title || base.title,
      intro: fit.intro || base.intro,
      rows: fit.rows || base.rows
    };
  }
  function assignmentFrameworkContractHtml(a, L) {
    var c = assignmentFrameworkContract(a, L);
    return '<div class="asg-framework-contract"><div><div class="mono">FRAMEWORK ONLY</div><h3>' + esc(c.title) + '</h3><p>' + esc(c.intro) + '</p></div><div>' + c.rows.map(function (r) {
      return '<article><span>' + esc(r[0]) + '</span><p>' + esc(r[1]) + '</p></article>';
    }).join('') + '</div></div>';
  }
  function assignmentProgramGuide() {
    var L = programViewParse();
    var intro = '<div><div class="mono">VIEW PROGRAMS</div><h2>Understand your program\'s connection to the course</h2><p>Use this page when you want help seeing how the course can connect to a program area. It is optional. It does not choose your assignment lens, generate assignment work, or change your saved assignment setup.</p><small>When you are ready to plan an assignment, go to Starting Your Assignment.</small></div>';
    var picker = '<div class="asg-program-picker"><h3>Choose a program to understand the connection</h3>' + programViewPicker() + '<p>The explanation below changes when you select a field or a specific program. Use it to see possible systems, artifacts, people affected, and course questions.</p></div>';
    var guard = '<div class="asg-program-alert"><b>Understanding page only.</b><span>This page helps you see possible connections. Starting Your Assignment is where the program choice updates assignment examples, starter questions, tables, diagrams, and the Word starter pack.</span></div>';
    var route = '<div class="asg-program-route-card"><div><span>Ready to start planning?</span><b>Go to Starting Your Assignment.</b><p>Use that page when you want to choose an assignment, select a program lens for that assignment, answer preparation questions, and generate a starter pack.</p></div><button type="button" onclick="SOC.assignmentPage(\'assignments\')">Starting Your Assignment</button></div>';
    var preview = '';
    if (L) {
      var profile = assignmentLensProfile(L);
      var ctx = lensFieldContext(L);
      var spec = programSpecificProfile(L);
      var overviewText = (spec && spec.overview) || (ctx.label + ' gives students concrete places to look: ' + ctx.setting + '. The course connection begins with everyday systems, not with a broad opinion about the whole field.');
      var interfaceText = (spec && spec.interface) || 'Techno-racism is not only about hostile intent. It can appear when a system sorts people through data, defaults, records, scores, screens, or rules that feel objective but produce unequal consequences.';
      var cases = [
        ['Neutral tools are still choices', 'A screen, checklist, score, camera, or form can look routine while still shaping who is trusted, delayed, exposed, or given extra work.'],
        ['Records can carry old patterns forward', 'The course asks students to notice how past decisions, missing data, labels, and defaults can become part of a new system.'],
        ['Challenge matters', 'A useful example asks whether a person can see the decision, understand it, correct it, appeal it, or refuse it without being punished.']
      ].map(function (c) { return '<article><b>' + esc(c[0]) + '</b><p>' + esc(c[1]) + '</p></article>'; }).join('');
      var check = assignmentProgramStrengthCheck(L, profile).map(function (r) {
        return '<article><span>' + esc(r[0]) + '</span><p>' + esc(r[1]) + '</p></article>';
      }).join('');
      var focusA = programViewAssignmentItem();
      var section3 = '';
      if (focusA) {
        var fit = assignmentProgramFit(focusA, L);
        var fitCards = (fit.cards || []).map(function (c) {
          return '<article><span>' + esc(c[0]) + '</span><p>' + esc(c[1]) + '</p></article>';
        }).join('');
        var brief = (focusA.really || []).map(function (s, i) {
          return '<article><span>Task ' + (i + 1) + '</span><p>' + esc(s) + '</p></article>';
        }).join('');
        var steps = (fit.steps || []).map(function (s, i) {
          return '<article><b>' + esc(['Choose', 'Show', 'Connect'][i] || ('Move ' + (i + 1))) + '</b><p>' + esc(s) + '</p></article>';
        }).join('');
        section3 = '<div class="asg-program-wide"><div class="mono">SECTION 3</div><h3>How to integrate this into ' + esc(focusA.title) + '</h3><p>' + esc(fit.intro) + '</p>' + programViewAssignmentPicker()
          + assignmentFrameworkContractHtml(focusA, L)
          + '<div class="asg-program-grid" style="margin-top:12px">' + fitCards + '</div>'
          + '<div class="asg-program-wide asg-inner-panel"><div class="mono">WHAT THIS ASSIGNMENT ASKS</div><div class="asg-lens-steps">' + brief + '</div></div>'
          + '<div class="asg-program-wide asg-inner-panel"><div class="mono">HOW TO USE THE PROGRAM CONNECTION</div><div class="asg-lens-steps">' + steps + '</div></div>'
          + '<div class="asg-program-alert asg-answer-shape"><b>Possible answer shape</b><span>' + esc(fit.starter) + '</span></div>'
          + '<div class="asg-lens-check" style="margin-top:12px"><div><div class="mono">FROM BROAD TO USABLE</div><h3>Before you write</h3></div><div>' + check + '</div></div></div>';
      } else {
        var map = assignmentProgramAssignmentRows(L, profile).map(function (r) {
          return '<article><b>' + esc(r[0]) + '</b><span>' + esc(r[1]) + '</span><p>' + esc(r[2]) + '</p></article>';
        }).join('');
        section3 = '<div class="asg-program-wide"><div class="mono">SECTION 3</div><h3>How to integrate this into the actual assignments</h3><p>The program gives the example. The course gives the analysis: what the system does, who it sorts, who benefits, who is exposed, and who can challenge the outcome.</p>' + programViewAssignmentPicker() + assignmentFrameworkContractHtml(null, L) + '<div class="asg-lens-map" style="margin-top:12px">' + map + '</div><div class="asg-lens-check" style="margin-top:12px"><div><div class="mono">FROM BROAD TO USABLE</div><h3>Before you write</h3></div><div>' + check + '</div></div></div>';
      }
      preview = '<div class="asg-program-wide asg-program-preview"><div class="mono">SECTION 1</div><h3>Program overview: ' + esc(L.label) + '</h3><p>' + esc(overviewText) + '</p><div class="asg-program-grid"><article><span>Where to look</span><p>' + esc(capPhrase(ctx.place)) + '</p></article><article><span>Common decisions</span><p>' + esc(capPhrase(ctx.decision)) + '</p></article><article><span>People in the picture</span><p>' + esc(capPhrase(ctx.people)) + '</p></article></div></div>'
        + '<div class="asg-program-wide"><div class="mono">SECTION 2</div><h3>How this can interface with techno-racism and course themes</h3><p>' + esc(interfaceText) + '</p><div class="asg-lens-steps">' + cases + '</div><div class="asg-program-grid" style="margin-top:10px"><article><span>Strong starting points</span><p>' + esc(capList(profile.topics)) + '</p></article><article><span>Evidence you could use</span><p>' + esc(capList(profile.artifacts)) + '</p></article><article><span>Question to carry</span><p>' + esc(profile.question) + '</p></article></div></div>'
        + section3;
    } else {
      preview = '<div class="asg-program-wide asg-program-preview"><div class="mono">GENERAL STREAM</div><h3>Start from everyday systems</h3><p>The course works even if a student does not choose a program lens. The student can still inspect a real system from school, work, housing, media, finance, health care, travel, public services, policing, or daily digital life.</p><div class="asg-program-grid"><article><span>Systems</span><p>Tools, forms, scores, dashboards, platforms, rules, records, cameras, and defaults.</p></article><article><span>Artifacts</span><p>Screenshots, policy lines, notices, checklists, reports, outputs, labels, case files, and source documents.</p></article><article><span>Course questions</span><p>What does the system do, who is sorted, who benefits, who is exposed, and who can challenge the outcome?</p></article></div></div>';
    }
    return '<section id="asg-program" class="asg-program compact expanded" aria-label="View program connections">' + intro + picker + guard + preview + route + '</section>';
  }
  function assignmentAiDisclosureGuide() {
    var allowed = [
      ['Brainstorming a direction', 'You can ask for possible places to look, then choose your own example and check it against the readings.'],
      ['Understanding a term', 'You can ask for a clear explanation of a course term, then verify the explanation with the assigned reading.'],
      ['Planning a search', 'You can ask for search terms or public-source places to check. You still need to find, read, and judge the sources yourself.'],
      ['Organizing your own notes', 'You can ask for help turning your own notes into a checklist, table, or outline before you write.'],
      ['Clarity check', 'You can use spelling, grammar, or sentence-level clarity support if it does not add claims, evidence, course concepts, or analysis.']
    ];
    var prohibited = [
      ['Writing the paper', 'Do not ask AI to draft paragraphs, answers, reflections, scripts, or assignment sections for submission.'],
      ['Rewriting your voice', 'Do not paste your draft into AI and submit a rewritten version as your own work.'],
      ['Replacing the reading', 'Do not use an AI summary instead of reading the assigned source. Your assignment must use course evidence accurately.'],
      ['Creating sources', 'Do not ask AI to invent sources, quotations, cases, statistics, citations, links, or legal facts.'],
      ['Hiding AI use', 'Do not leave AI use undisclosed. A vague line like "I used AI" is not enough.']
    ];
    var good = [
      ['No AI used', 'I did not use generative AI tools for this assignment.'],
      ['Brainstorming only', 'I used ChatGPT on [date] to brainstorm possible example areas after I read the Week [number] material. I chose my own example, checked it against the reading, and wrote the final analysis myself.'],
      ['Term support', 'I used Microsoft Copilot on [date] to help me restate the term [course term] in simpler language. I checked the meaning against [reading name] before using it.'],
      ['Search planning', 'I used Perplexity on [date] to identify search terms for Canadian public reports about [topic]. I opened and read the sources myself before deciding what to use.'],
      ['Organizing notes', 'I used ChatGPT on [date] to turn my own point-form notes into a planning checklist. I wrote the assignment myself and did not submit AI-written sentences.'],
      ['Clarity check', 'I used Grammarly or Microsoft Editor on [date] to check grammar and sentence clarity. I did not use it to add course concepts, sources, claims, or analysis.']
    ];
    var assignmentExamples = [
      ['Map Exchange', 'I used ChatGPT on [date] to list possible digital systems I might notice in my program area. I chose the weekly example myself, connected it to the reading, and wrote the post in my own words.'],
      ['Compass Check', 'Generative AI is not permitted during this closed, timed Blackboard assessment.'],
      ['Canadian Case File', 'I used Perplexity on [date] to find search terms for Canadian oversight reports. I read the reports myself, checked the facts, and wrote the case file in my own words.'],
      ['Design the Repair', 'I used ChatGPT on [date] to organize my own notes into categories: rule, review step, appeal path, and accountability. The repair idea and final explanation are mine.'],
      ['Cartography', 'I used Microsoft Editor on [date] for grammar and sentence clarity only. The map, reflection, examples, and recorded walkthrough are my own work.']
    ];
    var promptPairs = [
      ['Safer prompt', 'Give me five questions I could ask about passenger screening. Do not write my assignment.'],
      ['Risky prompt', 'Write my Canadian Case File on passenger screening with sources.'],
      ['Safer prompt', 'Turn these notes I wrote into a checklist. Do not add new claims or examples.'],
      ['Risky prompt', 'Rewrite my draft so it sounds academic and stronger.'],
      ['Safer prompt', 'Explain intersectionality clearly, then tell me what I should verify in Crenshaw before using it.'],
      ['Risky prompt', 'Give me a paragraph using intersectionality for my assignment.']
    ];
    var weak = [
      ['Too vague', 'I used AI.'],
      ['Not acceptable', 'AI helped write my assignment.'],
      ['Not enough', 'I used AI to make it better.'],
      ['Missing boundary', 'I used ChatGPT for research.'],
      ['Missing ownership', 'AI helped with my wording.']
    ];
    return '<section id="asg-ai" class="asg-ai asg-ai-page" aria-label="How to Use AI Properly"><div class="asg-ai-head"><span>HOW TO USE AI PROPERLY</span><b>Use AI only as support</b><small>Name the tool, date, purpose, and boundary.</small></div>'
      + '<div class="asg-ai-warning"><b>Penalty risk: do not use AI to write your papers.</b><p>Submitting AI-written or AI-rewritten work as your own can be treated as academic misconduct. Penalties can include a zero on the assignment, a formal academic-integrity process, and further course or institutional consequences. When unsure, do not submit the AI text. Ask first and disclose.</p></div>'
      + assignmentIntegrityProcessNote()
      + '<div class="asg-ai-rule"><b>The simple rule</b><p>AI can help you prepare to think. It cannot do the thinking, reading, evidence selection, course analysis, reflection, script, or final writing for you.</p></div>'
      + '<div class="asg-ai-columns"><div><h3>Acceptable study support</h3>' + allowed.map(function (a) {
        return '<article><b>' + esc(a[0]) + '</b><p>' + esc(a[1]) + '</p></article>';
      }).join('') + '</div><div><h3>Not acceptable</h3>' + prohibited.map(function (p) {
        return '<article><b>' + esc(p[0]) + '</b><p>' + esc(p[1]) + '</p></article>';
      }).join('') + '</div></div>'
      + '<div class="asg-ai-example-head"><h3>Disclosure examples you can adapt</h3><p>Replace the brackets with the real tool, date, week, source, and purpose. Do not copy an example that is not true for your work.</p></div>'
      + '<div class="asg-ai-grid">' + good.map(function (g) {
        return '<article><b>' + esc(g[0]) + '</b><p>' + esc(g[1]) + '</p></article>';
      }).join('') + '</div>'
      + '<div class="asg-ai-example-head"><h3>Assignment-specific examples</h3><p>These show the level of detail I expect when AI was part of your preparation.</p></div>'
      + '<div class="asg-ai-grid asg-ai-grid-wide">' + assignmentExamples.map(function (g) {
        return '<article><b>' + esc(g[0]) + '</b><p>' + esc(g[1]) + '</p></article>';
      }).join('') + '</div>'
      + '<div class="asg-ai-example-head"><h3>Prompt boundary examples</h3><p>The safer prompts ask for planning help. The risky prompts ask the tool to do assignment work for you.</p></div>'
      + '<div class="asg-ai-grid">' + promptPairs.map(function (g) {
        var risk = g[0] === 'Risky prompt';
        return '<article class="' + (risk ? 'risk' : 'safe') + '"><b>' + esc(g[0]) + '</b><p>' + esc(g[1]) + '</p></article>';
      }).join('') + '</div><div class="asg-ai-weak"><b>Weak disclosures to avoid</b><div>' + weak.map(function (w) {
        return '<span><strong>' + esc(w[0]) + ':</strong> ' + esc(w[1]) + '</span>';
      }).join('') + '</div></div><p class="asg-ai-bottom">The standard is simple: a reader should know what tool touched the work, what it was used for, and what parts are still fully yours.</p></section>';
  }
  function assignmentReleaseSchedule(items) {
    return '<section id="asg-release" class="asg-release" aria-label="Assignment release and due date schedule"><div><div class="mono">BLACKBOARD RELEASE & DUE DATES</div><h2>When each assignment opens and when it is due</h2><p>The companion guide stays open so you can prepare. The complete assignment instructions and submission dropboxes will be released on Blackboard on the dates below. The due date tells you when the work must be submitted in Blackboard.</p></div><div class="asg-release-grid">' + items.map(function (a) {
      var dp = assignmentDateParts(a.release);
      return '<article><div class="asg-release-head"><div class="asg-date"><span>' + esc(dp.month) + '</span><b>' + esc(dp.day) + '</b><small>' + esc(dp.year) + '</small></div><div><b>' + esc(a.title) + '</b><p>Released on Blackboard: ' + esc(assignmentDateLabel(a.release)) + '.</p></div></div>' + assignmentDueHtml(a) + '</article>';
    }).join('') + '</div></section>';
  }
  function assignmentList(title, arr) {
    return '<div class="asg-list"><b>' + esc(title) + '</b><ul>' + (arr || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
  }
  function assignmentCriteria(a) {
    var total = (a.criteria || []).reduce(function (sum, c) { return sum + Math.max(0, Number(c[1]) || 0); }, 0) || 20;
    return '<div class="asg-criteria"><h3>How this is marked out of ' + total + '</h3>' + a.criteria.map(function (c) {
      var marks = Math.max(0, Number(c[1]) || 0);
      var width = Math.round((marks / total) * 100);
      return '<div class="asg-bar"><div><b>' + esc(c[0]) + '</b><span>' + marks + ' marks</span></div><p>' + esc(c[2]) + '</p><i style="width:' + width + '%"></i></div>';
    }).join('') + '</div>';
  }
  function assignmentChecklist(a) {
    var checked = (state.assignmentChecks && state.assignmentChecks[a.id]) || {};
    return '<div class="asg-submit"><h3>Before you submit</h3><p>Use this as a quick self-check. It is saved in this browser on this device and is not submitted.</p><div>'
      + a.checks.map(function (c, i) {
        var on = !!checked[i];
        return '<button type="button" onclick="SOC.assignCheck(\'' + a.id + '\',' + i + ')" aria-pressed="' + (on ? 'true' : 'false') + '" class="' + (on ? 'on' : '') + '"><span>' + (on ? '&#10003;' : '') + '</span>' + esc(c) + '</button>';
      }).join('') + '</div></div>';
  }
  function assignmentProgramBlock(a, L, hidePicker) {
    var picker = hidePicker ? '' : assignmentLensPicker();
    if (!L) {
      var generalL = generalStreamLens();
      var generalFit = assignmentProgramFit(a, generalL);
      return '<div class="asg-room-program"><div class="asg-room-program-head"><span>GENERAL STREAM CONNECTION</span><b>' + esc(generalFit.title) + '</b><p>Use this path if you have not chosen a program lens. The assignment still needs one concrete system, artifact, affected group, and course concept.</p>' + picker + '</div>' + assignmentFrameworkContractHtml(a, generalL) + '<div class="asg-room-moves">' + generalFit.cards.map(function (m) {
        return '<article><span>' + esc(m[0]) + '</span><p>' + esc(m[1]) + '</p></article>';
      }).join('') + '</div><div class="asg-room-example"><b>How to build it into this assignment</b><ol>' + generalFit.steps.map(function (s) {
        return '<li>' + esc(s) + '</li>';
      }).join('') + '</ol><p><strong>Possible answer shape:</strong> ' + esc(generalFit.starter) + '</p></div>' + assignmentAnswerBuilder(a, generalL) + '</div>';
    }
    var fit = assignmentProgramFit(a, L);
    return '<div class="asg-room-program"><div class="asg-room-program-head"><span>PROGRAM CONNECTION</span><b>' + esc(fit.title) + '</b><p>' + esc(fit.intro) + '</p>' + picker + '</div>' + assignmentFrameworkContractHtml(a, L) + '<div class="asg-room-moves">' + fit.cards.map(function (m) {
      return '<article><span>' + esc(m[0]) + '</span><p>' + esc(m[1]) + '</p></article>';
    }).join('') + '</div><div class="asg-room-example"><b>How to build it into this assignment</b><ol>' + fit.steps.map(function (s) {
      return '<li>' + esc(s) + '</li>';
    }).join('') + '</ol><p><strong>Possible answer shape:</strong> ' + esc(fit.starter) + '</p></div>' + assignmentAnswerBuilder(a, L) + '</div>';
  }
  function assignmentAnswerBuilder(a, L) {
    L = L || generalStreamLens();
    var ctx = lensFieldContext(L), field = ctx.label || 'your field', profile = assignmentLensProfile(L), topic1 = profile.topics[0] || ctx.setting, artifact1 = profile.artifacts[0] || 'one artifact';
    if (a.id === 'coded-encounter') {
      var compassRows = [
        ['Review', 'Connect the Weeks 2 to 6 concept trail. Use your field only to rehearse where a mechanism might appear; the graded scenarios stay in Blackboard.'],
        ['Decide', 'Read each scenario carefully and select one response. Work independently and do not use AI, outside answers, or a shared response bank.'],
        ['Reflect', 'Use the pattern in your own choices as evidence. Strong reflection names what shaped a choice, what surprised you, and what you want to examine next.']
      ];
      return '<div class="asg-answer-builder asg-answer-path"><div class="asg-answer-head"><span>Compass readiness path</span><b>Prepare the concepts, then examine your own choices</b><p>This guide does not preview any graded item. It helps you enter the Blackboard sitting with the course concepts and assessment conditions clear.</p></div><div class="asg-answer-steps">' + compassRows.map(function (r, i) {
        return '<article><i>' + (i + 1) + '</i><div><b>' + esc(r[0]) + '</b><p>' + esc(r[1]) + '</p></div></article>';
      }).join('') + '</div></div>';
    }
    var rows = {
      'map-exchange': [
        ['Field move', 'Notice one real moment involving ' + topic1 + ' in ' + field + '.'],
        ['Course move', 'Name the system and connect it to the week\'s concept.'],
        ['Answer shape', 'In my field, this matters because ' + ctx.people + ' may be sorted, delayed, watched, excluded, or protected differently.']
      ],
      'coded-encounter': [
        ['Review move', 'Connect the Weeks 2 to 6 concepts before you enter Blackboard.'],
        ['Decision move', 'Choose one response to each scenario without outside help.'],
        ['Reflection move', 'Use your own choices as evidence instead of trying to perform a preferred attitude.']
      ],
      'case-file': [
        ['Field move', 'Pick a Canadian system connected to ' + topic1 + ', or to a public system ' + field + ' depends on.'],
        ['Course move', 'Use sources to explain what the system does before judging it.'],
        ['Answer shape', 'The case matters because the system turns a technical rule into a real consequence for people.']
      ],
      'repair': [
        ['Start from evidence', 'Return to one harm you already documented in ' + field + '. Use the artifact, source, or system detail that proves the harm is real.'],
        ['Name what changes', 'Choose one concrete repair: a rule, review step, design choice, appeal path, record-keeping habit, or accountability process.'],
        ['Explain the difference', 'Show who gains voice, protection, appeal, control, safety, or a clearer way to challenge the system.']
      ],
      'cartography': [
        ['Field move', 'Choose earlier pieces that show how your thinking about ' + field + ' changed.'],
        ['Course move', 'Connect evidence across the term instead of listing assignments.'],
        ['Answer shape', 'My map shows what I now notice in my field, what I missed before, and what responsibility I carry forward.']
      ]
    }[a.id] || [];
    return '<div class="asg-answer-builder asg-answer-path"><div class="asg-answer-head"><span>Build it into an answer</span><b>Turn the example into course analysis</b><p>Use this path when your idea feels like a career example but does not yet sound like an assignment answer.</p></div><div class="asg-answer-steps">' + rows.map(function (r, i) {
      return '<article><i>' + (i + 1) + '</i><div><b>' + esc(r[0]) + '</b><p>' + esc(r[1]) + '</p></div></article>';
    }).join('') + '</div></div>';
  }
  function assignmentStarterProfile(L) {
    var ctx = lensFieldContext(L), profile = assignmentLensProfile(L), program = L && L.program;
    if (program === 'Police Foundations') {
      return {
        label: 'Police Foundations',
        system: 'a dispatch decision, record check, incident report, body camera rule, facial recognition search, social media check, patrol priority, risk flag, or complaint pathway',
        artifact: 'an incident report field, policy threshold, call log, record check screen, body camera notice, facial recognition policy, case note, dispatch record, or appeal instruction',
        people: 'residents, complainants, witnesses, accused people, officers, families, and racialized communities',
        benefit: 'people who are treated as credible, low risk, protected, or easy to process',
        burden: 'people who are watched harder, flagged faster, disbelieved, delayed, misidentified, or left with no clear appeal',
        lens: 'Ask what the public safety system does, who it marks as risk, who gets believed, and who can challenge the outcome.'
      };
    }
    if (L) {
      return {
        label: ctx.label,
        system: (profile.topics || []).join(', ') || ctx.place,
        artifact: (profile.artifacts || []).join(', ') || 'a form field, policy line, screenshot, score output, notice, or record',
        people: ctx.people,
        benefit: 'people who are protected, trusted, approved, ranked higher, served faster, or treated as the default user',
        burden: 'people who are delayed, exposed, filtered out, misread, watched harder, or given no clear way to challenge the result',
        lens: profile.question
      };
    }
    return {
      label: 'General BFS218',
      system: 'a platform, app, score, screen, camera, form, record, rule, dashboard, search result, or policy',
      artifact: 'a screenshot, form field, policy line, notice, output, score, rule, source, or short description of what you saw',
      people: 'users, workers, clients, students, families, communities, and people affected by the decision',
      benefit: 'people who are protected, believed, approved, served faster, or treated as the default user',
      burden: 'people who are delayed, exposed, watched, excluded, misread, or left without a clear appeal path',
      lens: 'Ask what the system does, who it sorts, who benefits, who is exposed, and who can challenge the outcome.'
    };
  }
  function assignmentStarterQuestions(a, L) {
    var p = assignmentStarterProfile(L);
    var common = [
      ['piece', 'What part of this assignment are you starting today?', 'Name the piece you want to work on first. Example: choosing an artifact, naming the harm, building the claim, finding a source.'],
      ['program', 'How does your program lens shape the example?', L ? 'Use ' + p.label + ' to choose the example, not to change the assignment. ' + p.lens : 'If you are not using a program lens, name the everyday setting you are using. The general course question still applies.'],
      ['concept', 'Which course concept best fits this example?', 'Choose one course concept first. Do not list every concept.'],
      ['claim', 'What is your first working claim?', 'Write one sentence that connects the system, the people affected, and the course concept.']
    ];
    var byAssignment = {
      'map-exchange': [
        ['system', 'What ordinary digital moment did you notice this week?', 'For ' + p.label + ', look for ' + p.system + '. Keep it small enough to describe in a few sentences.'],
        ['artifact', 'What can you show or describe from that moment?', 'Use ' + p.artifact + ', or write a clear description if you cannot use a screenshot.'],
        ['action', 'What did the system do?', 'Name the action. Did it sort, rank, flag, approve, delay, watch, hide, recommend, or block something?'],
        ['affected', 'Who was touched by this moment?', 'Think about ' + p.people + '.'],
        ['benefit', 'Who did the system make things easier for?', 'Look for who moved through smoothly, got trusted, or was treated as the default user.'],
        ['burden', 'Who might have carried the cost?', 'Look for ' + p.burden + '.']
      ],
      'coded-encounter': [
        ['system', 'Which part of the Weeks 2 to 6 concept trail needs one more review?', 'Choose one area: New Jim Code and intersectionality, engineered inequity, default discrimination, coded exposure, or Canadian algorithmic systems.'],
        ['artifact', 'Which course support will you use for that review?', 'Choose the weekly learning room, Key Concepts, Knowledge Checks, flashcards, or your own course notes. The graded items are not on this site.'],
        ['action', 'What conditions do you need for the Blackboard sitting?', 'Plan for the standard 90-minute limit, or your approved accommodated time, a reliable connection, and a place where you can work independently.'],
        ['affected', 'Have you checked your approved accommodations?', 'Confirm the Blackboard timer and any approved settings before you begin. Contact the instructor before starting if something is wrong.'],
        ['benefit', 'What will help you read carefully without rushing?', 'Use the full allowed window, allow backtracking, and remember that the ten orientation items have no right answer.'],
        ['burden', 'What could interrupt the sitting?', 'Reduce avoidable interruptions and know how to report a verified access or platform problem.']
      ],
      'case-file': [
        ['system', 'What Canadian system or case are you investigating?', 'Start with a Canadian example connected to ' + p.system + '.'],
        ['artifact', 'What public evidence will anchor the case file?', 'Use reports, policy pages, court documents, oversight findings, public notices, news coverage, or ' + p.artifact + '.'],
        ['action', 'What does the system do before you judge it?', 'Explain the tool, institution, decision point, and outcome clearly.'],
        ['affected', 'Who is affected in the Canadian case?', 'Think about ' + p.people + ' and any communities named in the evidence.'],
        ['benefit', 'Who gains power, speed, authority, protection, or convenience from the system?', 'Name the institution or group that benefits from the current setup.'],
        ['burden', 'Who carries the risk, delay, surveillance, exclusion, or appeal burden?', 'Look for ' + p.burden + '.']
      ],
      'repair': [
        ['system', 'Which harm are you trying to repair?', 'Return to one harm involving ' + p.system + ' that you can explain clearly.'],
        ['artifact', 'What evidence proves the harm is real?', 'Use an earlier artifact, source, case, policy, report, or ' + p.artifact + '.'],
        ['action', 'What exactly needs to change?', 'Name the rule, process, default, review step, design choice, appeal path, or accountability path.'],
        ['affected', 'Who should lead or shape the repair?', 'Think about ' + p.people + ', especially the people most affected by the harm.'],
        ['benefit', 'Who might resist the repair because the current system works for them?', 'Name who benefits from the current setup.'],
        ['burden', 'Who should be less exposed, less delayed, less watched, or better protected after the repair?', 'Look for ' + p.burden + '.']
      ],
      'cartography': [
        ['system', 'What pattern across your map are you ready to explain?', 'Look across your earlier entries for repeated systems, tools, records, platforms, or decisions connected to ' + p.system + '.'],
        ['artifact', 'Which earlier pieces of your work will you use as evidence?', 'Choose entries, notes, artifacts, readings, activity results, or ' + p.artifact + '.'],
        ['action', 'What changed in how you see the system?', 'Compare what you noticed early with what you can name now.'],
        ['affected', 'Whose experience can you now see more clearly?', 'Think about ' + p.people + '.'],
        ['benefit', 'What do you now notice about who systems protect or centre?', 'Name the pattern you missed before.'],
        ['burden', 'What do you now notice about who systems expose or leave with the cost?', 'Look for ' + p.burden + '.']
      ]
    };
    var middle = byAssignment[a && a.id] || byAssignment['map-exchange'];
    return common.slice(0, 2).concat(middle).concat(common.slice(2));
  }
  function assignmentStarterOptionalQuestions(a, L) {
    return [
      ['source', 'What reading, source, or case might support this?', 'Name the reading, Blackboard source, public document, or case you still need to use.'],
      ['verify', 'What do you still need to verify?', 'List what you need to check before this becomes assignment-ready.'],
      ['stronger', 'What would make this answer stronger?', 'Name one missing detail, clearer artifact, better source, or sharper course concept.']
    ];
  }
  function starterData(a) {
    var root = state.assignmentStarter || {};
    var key = (a && a.id) || 'general';
    return root[key] || { format: 'all', answers: {} };
  }
  function assignmentStarterLaunch(a, L) {
    var label = L ? (L.program || L.area) : 'General stream';
    return '<section class="asg-starter-launch" aria-label="Open the assignment starter studio">'
      + '<div><div class="mono">PREPARATION STUDIO</div><h2>Build your starting document</h2><p>Use this when you are ready to move from understanding the assignment to planning your own answer. It uses the assignment and program lens you selected on the guide, then helps you read the tailored guidance, answer guided questions, and generate a Word preparation pack.</p></div>'
      + '<div class="asg-starter-launch-panel"><p>Current path: <b>' + esc(a.title) + '</b> with <b>' + esc(label) + '</b>.</p><button type="button" onclick="SOC.openStarter()">Open Starter Studio</button></div>'
      + '</section>';
  }
  function assignmentStarterAssignmentChooser(items) {
    var idx = Math.max(0, Math.min(items.length - 1, Number(state.assignmentIndex) || 0));
    return '<section id="asg-starter-chooser" class="asg-starter-chooser" aria-label="Selected assignment for the starter studio"><div><div class="mono">STEP 1</div><h2>Confirm the assignment you selected</h2><p>This preparation page uses the assignment you chose on Starting Your Assignment. To change assignments, return there first.</p></div><div>' + items.map(function (a, i) {
      var on = i === idx;
      return '<button type="button" ' + (on ? '' : 'aria-disabled="true" tabindex="-1" ') + 'class="' + (on ? 'current' : 'locked') + '" aria-pressed="' + (on ? 'true' : 'false') + '"><span>' + esc(assignmentDateLabel(a.release)) + '</span><b>' + esc(a.title) + '</b><small>' + esc(a.short) + '</small></button>';
    }).join('') + '</div><button type="button" class="asg-starter-change" onclick="SOC.assignmentPage(\'assignments\')">Return to Starting Your Assignment to change</button></section>';
  }
  function assignmentProgramBrief(a, L) {
    var activeL = L || generalStreamLens();
    var fit = assignmentProgramFit(a, activeL);
    var cards = (fit.cards || []).slice(0, 3).map(function (m) {
      return '<article><span>' + esc(m[0]) + '</span><p>' + esc(m[1]) + '</p></article>';
    }).join('');
    var steps = (fit.steps || []).slice(0, 3).map(function (s, i) {
      return '<li><b>' + esc(['Choose', 'Show', 'Connect'][i] || 'Move') + ':</b> ' + esc(s) + '</li>';
    }).join('');
    return '<section class="asg-program-brief" aria-label="Program lens for this assignment"><div><div class="mono">' + (L ? 'PROGRAM CONNECTION' : 'GENERAL STREAM CONNECTION') + '</div><h3>' + esc(fit.title) + '</h3><p>' + esc(fit.intro) + '</p></div><div class="asg-program-brief-cards">' + cards + '</div>' + assignmentFrameworkContractHtml(a, activeL) + '<div class="asg-program-alert asg-answer-shape"><b>Use it this way</b><span>' + esc(fit.starter) + '</span></div><ol class="asg-program-brief-list">' + steps + '</ol></section>';
  }
  function assignmentPrepPrompt(a, L) {
    var label = L ? (L.program || L.area) : 'General Stream';
    if (a.id === 'coded-encounter') {
      return '<section class="asg-prep-prompt" aria-label="Compass Check readiness"><div><div class="mono">BLACKBOARD READINESS</div><h3>Prepare the conditions, not the answers</h3><p>There is no starter document for this closed, timed assessment. Review Weeks 2 to 6, confirm your accommodations, and protect the full standard 90-minute limit or your approved accommodated time. The limit is a Blackboard setting, not an estimate of how long every student should need.</p></div><div><button type="button" onclick="SOC.station(2)">Review from Week 2</button><button type="button" onclick="SOC.go(\'cards\')">Review concept flashcards</button></div></section>';
    }
    return '<section class="asg-prep-prompt" aria-label="Outline and preparation choice"><div><div class="mono">OUTLINE AND PREPARATION</div><h3>Would you like help building a starting document?</h3><p>If yes, the site will open a separate preparation page for <b>' + esc(a.title) + '</b> using <b>' + esc(label) + '</b>. You will answer guided questions and generate a Word file with a text outline, table, diagram, or all three.</p></div><div><button type="button" onclick="SOC.openStarter()">Yes, build my outline</button><button type="button" onclick="SOC.skipStarter()">No, stay with the brief</button></div></section>';
  }
  function assignmentStarterStudio(a, L) {
    var data = starterData(a), answers = data.answers || {}, fmt = cleanStarterFormat(data.format);
    var qs = assignmentStarterQuestions(a, L), opt = assignmentStarterOptionalQuestions(a, L);
    var formatBtn = function (key, label) {
      var on = fmt === key;
      return '<button type="button" onclick="SOC.starterFormat(\'' + esc(a.id) + '\',\'' + key + '\')" aria-pressed="' + (on ? 'true' : 'false') + '" class="' + (on ? 'on' : '') + '">' + esc(label) + '</button>';
    };
    var field = function (q, optional) {
      var id = 'starter-' + a.id + '-' + q[0];
      return '<label for="' + esc(id) + '"><span>' + (optional ? 'Optional' : 'Required') + '</span><b>' + esc(q[1]) + '</b><small>' + esc(q[2]) + '</small><textarea id="' + esc(id) + '" oninput="SOC.starterAnswer(\'' + esc(a.id) + '\',\'' + esc(q[0]) + '\',this.value)" placeholder="Write your answer here...">' + esc(answers[q[0]] || '') + '</textarea></label>';
    };
    var lensLine = L ? 'Using ' + (L.program || L.area) + '. This lens was chosen on Starting Your Assignment and now shapes the guidance below.' : 'Using the general course path selected on Starting Your Assignment.';
    return '<section id="asg-starter" class="asg-starter asg-starter-full" aria-label="Assignment preparation studio">'
      + '<div class="asg-starter-top"><div class="asg-starter-context"><div><div class="mono">STEP 2</div><h1>Start strong before you write</h1><p>You are planning <b>' + esc(a.title) + '</b>. Answer in your own words. The preparation pack organizes your thinking, but it does not write the assignment for you.</p><small>' + esc(lensLine) + '</small></div><div class="asg-starter-flow"><span>Read the tailored guidance</span><span>Answer the questions</span><span>Generate a preparation pack</span></div></div></div>'
      + assignmentProgramBlock(a, L, true)
      + '<div class="asg-starter-format"><b>Choose what the Word file should include</b><div>' + formatBtn('text', 'Text') + formatBtn('table', 'Table') + formatBtn('diagram', 'Diagram') + formatBtn('all', 'All 3') + '</div></div>'
      + '<div class="asg-starter-prompt-head"><div class="mono">STEP 3</div><h2>Answer the starter questions</h2><p>Short, honest answers are fine. The goal is to leave with a usable plan: example, evidence, system action, people affected, course concept, and first claim.</p></div>'
      + '<div class="asg-starter-grid">' + qs.map(function (q) { return field(q, false); }).join('') + '</div>'
      + '<details class="asg-starter-optional"><summary>Optional expansion questions</summary><div>' + opt.map(function (q) { return field(q, true); }).join('') + '</div></details>'
      + '<div class="asg-starter-actions"><button type="button" onclick="SOC.saveStarter()">Generate Organized Notes Pack</button><button type="button" onclick="SOC.clearStarter(\'' + esc(a.id) + '\')">Clear answers</button></div>'
      + '</section>';
  }
  function starterPage() {
    var items = assignmentsData();
    var L = lensParse();
    var idx = Math.max(0, Math.min(items.length - 1, Number(state.assignmentIndex) || 0));
    var selected = items[idx] || items[0];
    if (selected.id === 'coded-encounter') {
      return '<div class="rise asg-starter-page">'
        + '<section class="asg-hero asg-starter-hero"><div class="mono">COMPASS CHECK READINESS</div><h1>No starter pack is used for this assessment</h1><p>Compass Check is a closed, timed Blackboard sitting. The companion site can help you review the Weeks 2 to 6 concepts, but it will not generate an outline, preview a graded scenario, or draft a reflection.</p></section>'
        + assignmentPrepPrompt(selected, L)
        + '<section class="asg-preview-mode"><b>Return to the assignment room</b><p>Use the room for the marking breakdown, assessment conditions, program-based rehearsal, and final readiness check.</p><button type="button" class="wk-cta" onclick="SOC.assignmentPage(\'assignments\')">Return to Assignment Rooms</button></section>'
        + '</div>';
    }
    return '<div class="rise asg-starter-page">'
      + '<section class="asg-hero asg-starter-hero"><div class="mono">OUTLINE AND PREPARATION</div><h1>Build your first draft plan</h1><p>This page uses the assignment and program lens you already selected. Read the tailored guidance, answer the starter questions, and generate a Word document you can use before writing your final submission.</p></section>'
      + assignmentStarterAssignmentChooser(items)
      + assignmentStarterStudio(selected, L)
      + '</div>';
  }
  function assignmentRoom(a, L) {
    var body = '<div class="asg-detail-grid"><div>'
      + assignmentList('What you are really doing', a.really)
      + assignmentList('What to submit', a.submit)
      + '</div><div>' + assignmentCriteria(a) + '</div></div>'
      + assignmentProgramBrief(a, L)
      + '<details class="asg-room-more"><summary>Show final self-check and common misses</summary><div class="asg-quality"><div>' + assignmentList('Strong work usually does this', a.strong) + '</div><div>' + assignmentList('Common misses to avoid', a.misses) + '</div></div>' + assignmentChecklist(a) + '</details>'
      + assignmentPrepPrompt(a, L);
    return '<section id="asg-' + esc(a.id) + '" class="asg-detail asg-room" aria-label="' + esc(a.title) + ' details">'
      + '<div class="asg-detail-head"><div><h2>' + esc(a.title) + '</h2><p>' + esc(a.purpose) + '</p></div>'
      + '<dl><div><dt>Weight</dt><dd>' + esc(a.weight) + '</dd></div><div><dt>Opens on Blackboard</dt><dd>' + esc(a.opens) + ' &middot; ' + esc(assignmentDateLabel(a.release)) + '</dd></div><div><dt>Due for this section</dt><dd>' + esc(assignmentDueText(a)) + '</dd></div><div><dt>Timing</dt><dd>' + esc(a.timing) + '</dd></div></dl></div>'
      + body
      + '</section>';
  }
  function assignmentFaqSection() {
    var faqs = assignmentFaqs();
    return '<section id="asg-faq" class="asg-faq" aria-label="Assignment FAQ"><div class="mono">FAQ</div><h2>Questions students usually ask</h2>'
      + faqs.map(function (f, i) {
        var on = state.assignmentFaq === i;
        return '<div class="asg-faq-item"><button type="button" onclick="SOC.assignFaq(' + i + ')" aria-expanded="' + (on ? 'true' : 'false') + '"><span>' + esc(f[0]) + '</span><b>' + (on ? '-' : '+') + '</b></button>'
          + (on ? '<p>' + esc(f[1]) + '</p>' : '') + '</div>';
      }).join('') + '</section>';
  }
  function assignmentStorySection(summary) {
    return assignmentPolicyPanel()
      + assignmentIntegrityProcessNote()
      + summary
      + '<section id="asg-story" class="asg-story"><div><div class="mono">ASSIGNMENT OVERVIEW</div><h2>You are building one map across the term</h2><p>The assignments are not random separate tasks. You begin by noticing real digital life, use Compass Check to recognize first-half mechanisms and examine your own decision patterns, investigate one Canadian system, design a repair, and finally walk someone through how your thinking changed.</p></div><ol><li>Notice</li><li>Interpret</li><li>Investigate</li><li>Repair</li><li>Integrate</li></ol></section>';
  }
  function assignmentActivePage() {
    if (state.screen === 'assignment-program') return 'program';
    if (state.screen === 'assignment-details') return 'assignments';
    if (state.screen === 'assignment-rubric') return 'quality';
    if (state.screen === 'assignment-release') return 'release';
    if (state.screen === 'assignment-ai') return 'ai';
    if (state.screen === 'assignment-faq') return 'faq';
    return 'story';
  }
  function assignmentScreenFor(tab) {
    tab = cleanAssignmentTab(tab);
    if (tab === 'program') return 'assignment-program';
    if (tab === 'assignments') return 'assignment-details';
    if (tab === 'quality') return 'assignment-rubric';
    if (tab === 'release') return 'assignment-release';
    if (tab === 'ai') return 'assignment-ai';
    if (tab === 'faq') return 'assignment-faq';
    return 'assignments';
  }
  function assignmentPageHero(label, title, text, extraClass) {
    return '<section class="asg-hero ' + esc(extraClass || '') + '"><div class="mono">' + esc(label) + '</div><h1>' + esc(title) + '</h1><p>' + esc(text) + '</p></section>';
  }
  function assignmentSummaryPanel() {
    return '<section class="asg-summary" aria-label="Assignment overview"><div><span>5 assignments</span><b>Each is worth 20%</b><small>Together they build one Personal Cartography.</small></div><div><span>Due dates</span><b>Two deadlines</b><small>First half due October 25; second half due December 11. Nothing is due in the final week.</small></div></section>';
  }
  function assignmentSelectedContext() {
    var items = assignmentsData();
    var L = lensParse();
    var idx = Math.max(0, Math.min(items.length - 1, Number(state.assignmentIndex) || 0));
    var selected = items[idx] || items[0];
    return { items: items, L: L, selected: selected };
  }
  function assignmentsPage() {
    return '<div class="rise asg-page asg-story-route">'
      + assignmentJumpNav()
      + assignmentPageHero('OVERVIEW', 'Understanding the Assignments', 'The five assignments build one map across the term. This page explains the arc before you enter the specific assignment rooms.')
      + '<div class="asg-tabpanel">' + assignmentStorySection(assignmentSummaryPanel()) + '</div>'
      + '</div>';
  }
  function assignmentProgramPage() {
    return '<div class="rise asg-page asg-program-route">'
      + assignmentJumpNav()
      + assignmentPageHero('VIEW PROGRAMS', 'Understand Your Program\'s Connection to the Course', 'Preview how different program areas can supply concrete examples for the course. This page is exploratory; the assignment workflow starts on Starting Your Assignment.')
      + '<div class="asg-tabpanel">' + assignmentProgramGuide() + '</div>'
      + '</div>';
  }
  function assignmentDetailsPage() {
    var ctx = assignmentSelectedContext();
    return '<div class="rise asg-page asg-details-route">'
      + assignmentJumpNav()
      + assignmentPageHero('ASSIGNMENT ROOMS', 'Understanding Your Assignment', 'Open one assignment at a time. Each room explains the purpose, submission pieces, marking criteria, program connection, and preparation option.')
      + assignmentPreviewBanner()
      + assignmentIntegrityProcessNote()
      + assignmentLensPanel(ctx.L)
      + '<div class="asg-tabpanel">' + assignmentDirectory(ctx.items) + assignmentRoom(ctx.selected, ctx.L) + '</div>'
      + '</div>';
  }
  function assignmentRubricPage() {
    return '<div class="rise asg-page asg-rubric-route">'
      + assignmentJumpNav()
      + assignmentPageHero('HOW I GRADE', 'How Stronger Work Grows', 'Use this page to understand what stronger work does before you submit in Blackboard.')
      + '<div class="asg-tabpanel">' + assignmentQualityPath() + '</div>'
      + '</div>';
  }
  function assignmentReleasePage() {
    var ctx = assignmentSelectedContext();
    return '<div class="rise asg-page asg-release-route">'
      + assignmentJumpNav()
      + assignmentPageHero('RELEASE & DUE DATES', 'Blackboard Opening and Due Dates', 'This page lists when the complete assignment files and dropboxes will be opened on Blackboard and when the work is due.')
      + '<div class="asg-tabpanel">' + keyDatesCalendar() + assignmentReleaseSchedule(ctx.items) + '</div>'
      + '</div>';
  }
  function assignmentFaqPage() {
    return '<div class="rise asg-page asg-faq-route">'
      + assignmentJumpNav()
      + assignmentPageHero('FAQ', 'Assignment Questions Students Usually Ask', 'Use this page for quick answers about submissions, Blackboard, AI disclosure, evidence, accommodations, and assignment scope.')
      + '<div class="asg-tabpanel">' + assignmentFaqSection() + '</div>'
      + '</div>';
  }
  function assignmentAiPage() {
    return '<div class="rise asg-page asg-ai-route">'
      + assignmentJumpNav()
      + '<section class="asg-hero asg-ai-hero"><div><div class="mono">HOW TO USE AI PROPERLY</div><h1>How to Use AI Properly</h1><p>This page gives the AI-use rules clearly, with examples students can adapt honestly. Use it before submitting any assignment if a generative AI tool helped you brainstorm, organize, search, or check clarity.</p></div><div class="asg-ai-page-actions"><button type="button" onclick="SOC.assignmentPage(\'assignments\')">Starting Your Assignment</button></div></section>'
      + '<div class="asg-tabpanel">' + assignmentAiDisclosureGuide() + '</div>'
      + '</div>';
  }
  function scholarMedia() {
    var meta = {
      benjamin2019: {
        synopsis: 'Benjamin introduces the New Jim Code as a way to understand how racism can travel through systems that are marketed as neutral, objective, or progressive. The recorded lecture connects race, carceral technology, and liberatory imagination, so it is useful for seeing why the course treats technology as a site of power, not just a set of tools.',
        watchFor: ['How a system can reproduce inequity without announcing racist intent', 'Why neutrality can hide power', 'What Benjamin means by liberatory imagination'],
        readNext: 'Read Benjamin\'s Introduction on Blackboard. Use the video to enter the idea, then use the chapter for the exact concept and evidence.'
      },
      noble2018: {
        synopsis: 'Noble explains the argument behind Algorithms of Oppression: search engines and ranking systems are not neutral information machines. They can reproduce racist and sexist patterns while looking like ordinary search results, which makes the talk a direct bridge into the course theme of hidden technical power.',
        watchFor: ['Why search results are designed and ranked, not simply discovered', 'How racism and sexism can appear inside information systems', 'Why commercial platforms should not be treated as neutral public knowledge'],
        readNext: 'Read Noble\'s introduction. Look for the difference between a bad result, a biased system, and a profit-driven information structure.'
      },
      crenshaw1991: {
        synopsis: 'Crenshaw explains intersectionality by showing how people can disappear when institutions look at race or gender one at a time. For BFS218, the key lesson is that technology must be checked at the overlap of identities, because single-category analysis can hide the people most harmed.',
        watchFor: ['Why single-axis thinking misses people', 'How invisibility becomes a system problem', 'Why naming the overlap changes the analysis'],
        readNext: 'Read the Crenshaw excerpt and use intersectionality to sharpen one example from your own digital life.'
      },
      buolamwini2018: {
        synopsis: 'Buolamwini explains how facial-analysis systems failed to detect or classify her face until she used a white mask, then connects that experience to measured error rates across race and gender. The talk prepares students to read Gender Shades as evidence, not just as a story about one technology.',
        watchFor: ['What failed in the system', 'Which groups carried the highest error', 'Why a technical benchmark can hide racialized harm'],
        readNext: 'Read Buolamwini and Gebru on Gender Shades. Track how the audit design makes the hidden disparity visible.'
      },
      robertson2020: {
        synopsis: 'This talk presents the Canadian human-rights concerns behind algorithmic policing: predictive policing, facial recognition, social-media surveillance, privacy, equality, and Charter risks. It gives students a Canadian case base for moving from abstract algorithmic bias to state power.',
        watchFor: ['Which policing tools are being discussed', 'What rights are at stake', 'Why racialized communities carry greater risk'],
        readNext: 'Read the executive summary and Part I of To Surveil and Predict. Note which risks come from the technology and which come from weak governance.'
      },
      molnar2023: {
        synopsis: 'Molnar discusses new border technologies and the people made subject to them, including migrants and refugees who often cannot refuse automated screening or surveillance. The interview helps students see digital border systems as techno-racism operating through exclusion, mobility control, and unequal power.',
        watchFor: ['Who is treated as a testing ground', 'How border technologies sort and exclude', 'Why consent is thin at the border'],
        readNext: 'Read Molnar on digital border technologies. Identify one technology and one logic of exclusion.'
      },
      mohamed2020: {
        synopsis: 'In this interview, Mohamed discusses AI practice through questions of power, responsibility, and the worlds that technical systems help produce. Use it as an on-ramp to Decolonial AI, where Mohamed, Png, and Isaac argue that AI needs decolonial theory and affected communities at the centre.',
        watchFor: ['Who gets to define the problem AI is solving', 'How technical practice connects to social power', 'Why decolonial thinking changes the starting point'],
        readNext: 'Read Mohamed, Png, and Isaac on Decolonial AI. Look for the move from better tools to different authority.'
      },
      devlin2023: {
        synopsis: 'Crawford maps AI as a planetary system built from data, labour, infrastructure, and institutional power. For Week 10, use this beside Devlin\'s chapter: the harm is not only in model outputs, but also in who builds, funds, deploys, and bears the costs of AI systems.',
        watchFor: ['AI infrastructure as material and political', 'Where labour and extraction sit outside the model', 'Why power is not only inside the algorithm'],
        readNext: 'Read Devlin on inequality within and without the algorithm. Use Crawford to sharpen the "without" side: who builds, who supplies the data, labour, and infrastructure, and who absorbs risk.'
      },
      tanksley2023: {
        synopsis: 'Tanksley discusses abolitionist technology and the power of centring Black youth as creators, not just subjects, of technology. The video supports Week 11 by showing that repair means changing who has authority to build, teach, and imagine technology.',
        watchFor: ['What abolitionist tech refuses', 'How Black youth are positioned as creators', 'Why repair is deeper than reform'],
        readNext: 'Read Tanksley\'s article. Track the difference between reforming a system and repairing who holds power.'
      },
      costanza2020: {
        synopsis: 'Costanza-Chock explains community-led design practices and the worlds they make possible. The talk supports Design Justice by shifting attention from expert designers working for communities to affected communities leading the design process themselves.',
        watchFor: ['Who leads the design process', 'Why impact matters more than designer intention', 'How design justice turns critique into practice'],
        readNext: 'Read Costanza-Chock\'s introduction and the Design Justice Network principles. Choose one principle and connect it to your repair design.'
      }
    };
    var out = [];
    function addMedia(r, source, kind) {
      if (!source || !meta[r.id]) return;
      var m = meta[r.id];
      var isYouTube = !!source.yt;
      var mediaId = String(source.yt || source.platform || source.kind || kind || 'media').replace(/[^A-Za-z0-9_-]/g, '');
      out.push({
        key: r.id + '|' + mediaId,
        week: r.week,
        kind: source.kind || kind || (isYouTube ? 'Video' : 'Podcast'),
        title: source.title || r.title,
        scholar: source.scholar || r.authors,
        source: source.channel || source.source || (isYouTube ? 'YouTube' : 'Source site'),
        platform: source.platform || (isYouTube ? 'youtube' : 'source'),
        id: source.yt || '',
        embed: source.embed === false ? false : isYouTube,
        url: source.url || (isYouTube ? 'https://www.youtube.com/watch?v=' + source.yt : readUrl(r)),
        synopsis: m.synopsis,
        watchFor: m.watchFor || [],
        readNext: m.readNext || '',
        fieldPrompt: mediaFieldPrompt(r.week, m)
      });
    }
    D.records.forEach(function (r) {
      addMedia(r, r.video, 'Video');
      addMedia(r, r.audio, 'Podcast');
    });
    return out.sort(function (a, b) { return (a.week - b.week) || a.scholar.localeCompare(b.scholar); });
  }
  function mediaFieldPrompt(w, meta) {
    var L = lensParse();
    if (!L) return '';
    var ctx = lensFieldContext(L);
    var label = L.program || L.area;
    var topic = weekData(w);
    var concept = topic && topic.concepts && topic.concepts[0] ? topic.concepts[0].h : 'this week\'s concept';
    return 'For ' + label + ', use this media item to notice one decision point in ' + ctx.place + '. After watching or listening, write one sentence that connects ' + concept + ' to ' + ctx.decision + ' and one sentence naming who is affected.';
  }
  function mediaWeekOptions(items) {
    var weeks = [];
    items.forEach(function (v) { if (weeks.indexOf(v.week) < 0) weeks.push(v.week); });
    weeks.sort(function (a, b) { return a - b; });
    return '<div class="vid-tabs" role="group" aria-label="Filter scholar media by week">'
      + '<button type="button" onclick="SOC.videoWeek(\'all\')" class="' + (state.videoWeek === 'all' ? 'on' : '') + '">All weeks</button>'
      + weeks.map(function (w) { return '<button type="button" onclick="SOC.videoWeek(' + w + ')" class="' + (String(state.videoWeek) === String(w) ? 'on' : '') + '">Week ' + w + '</button>'; }).join('')
      + '</div>';
  }
  function mediaKindOptions(items) {
    var kinds = [];
    items.forEach(function (v) { var k = String(v.kind || 'Media'); if (kinds.indexOf(k) < 0) kinds.push(k); });
    return '<div class="vid-tabs vid-kind-tabs" role="group" aria-label="Filter scholar media by type">'
      + '<button type="button" onclick="SOC.mediaKind(\'all\')" class="' + (state.mediaKind === 'all' ? 'on' : '') + '">All media</button>'
      + kinds.map(function (k) { return '<button type="button" onclick="SOC.mediaKind(\'' + esc(k) + '\')" class="' + (String(state.mediaKind) === k ? 'on' : '') + '">' + esc(k) + '</button>'; }).join('')
      + '</div>';
  }
  function videoEmbed(v) {
    if (v.platform === 'youtube' && v.embed) {
      return '<button type="button" class="vid-load" onclick="SOC.playVideo(this,\'' + esc(v.id) + '\')" aria-label="Load video: ' + esc(v.title + ' - ' + v.scholar) + '"><span>' + esc(v.kind || 'Video') + '</span><b>Load official player</b><small>Loads YouTube only after you choose to play it.</small></button>';
    }
    return '<a class="vid-linkout" href="' + esc(v.url) + '" target="_blank" rel="noopener"><span>' + esc(v.kind || 'Media') + '</span><b>Open on source site</b><small>Playback stays with the official source. Nothing is downloaded or rehosted here.</small></a>';
  }
  function videoCard(v) {
    var note = state.mediaNotes && state.mediaNotes[v.key] ? state.mediaNotes[v.key] : '';
    return '<article class="vid-card">'
      + '<div class="vid-frame">' + videoEmbed(v) + '</div>'
      + '<div class="vid-copy"><div class="mono">WEEK ' + v.week + ' &middot; ' + esc(v.kind || 'Media') + ' &middot; ' + esc(v.source) + '</div><h2>' + esc(v.title) + '</h2><h3>' + esc(v.scholar) + '</h3><p>' + esc(v.synopsis) + '</p>'
      + '<div class="vid-watch"><b>Watch for</b><ul>' + v.watchFor.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>'
      + '<div class="vid-read"><b>Then read</b><span>' + esc(v.readNext) + '</span></div>'
      + (v.fieldPrompt ? '<div class="vid-field"><b>Use it in your program</b><span>' + esc(v.fieldPrompt) + '</span></div>' : '')
      + '<label class="vid-note"><b>Reading Rescue note</b><span>After the media, write one sentence you can prove from the reading.</span><textarea oninput="SOC.mediaNote(\'' + esc(v.key) + '\',this.value)" placeholder="One evidence-backed sentence...">' + esc(note) + '</textarea></label>'
      + '<a href="' + esc(v.url) + '" target="_blank" rel="noopener">Open source page <span aria-hidden="true">&#8599;</span></a></div>'
      + '</article>';
  }
  function walkPad(w) { return (w < 10 ? '0' : '') + w; }
  function walkFig(w, idx) {
    var d = weekData(w);
    if (!d || !d.deck) return null;
    var code = (D.course && D.course.code) || '';
    var man = (typeof window !== 'undefined' && window[code + '_WALKFIGS']) || {};
    var list = man[w] || man[String(w)];
    if (!list || !list[idx]) return null;
    return 'walkthroughs/' + d.deck + '/images/' + list[idx];
  }
  function walkPrefs() {
    var r = rlState();
    if (['dark', 'light', 'soft', 'warm', 'contrast'].indexOf(r.walkTheme) < 0) r.walkTheme = 'dark';
    if ([100, 115, 130, 150].indexOf(r.walkSize) < 0) r.walkSize = 100;
    if ([75, 100, 125, 150].indexOf(r.walkRate) < 0) r.walkRate = 100;
    r.walkFont = !!r.walkFont;
    r.walkMotion = !!r.walkMotion;
    return r;
  }
  function walkTheme() { return walkPrefs().walkTheme; }
  var walkSpeaking = false, walkPaused = false;
  function walkSpeakStop() {
    try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (e) {}
    walkSpeaking = false; walkPaused = false; walkControlSync();
  }
  function walkSlideText() {
    var el = document.querySelector('#walk-overlay .walk-slide');
    return el ? String(el.textContent || '').replace(/\s+/g, ' ').trim() : '';
  }
  function walkControlSync() {
    var b = document.getElementById('walk-speak'), stop = document.getElementById('walk-stop');
    if (b) { b.textContent = walkSpeaking ? (walkPaused ? 'Resume' : 'Pause') : 'Read this slide'; b.setAttribute('aria-pressed', String(walkSpeaking && !walkPaused)); }
    if (stop) stop.disabled = !walkSpeaking;
  }
  function walkSpeakToggle() {
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') { announce('Voice narration is not available in this browser.'); return; }
    if (walkSpeaking) {
      if (walkPaused) { window.speechSynthesis.resume(); walkPaused = false; announce('Voice narration resumed.'); }
      else { window.speechSynthesis.pause(); walkPaused = true; announce('Voice narration paused.'); }
      walkControlSync(); return;
    }
    var text = walkSlideText();
    if (!text) { announce('There is no slide text to read.'); return; }
    var p = walkPrefs(), u = new SpeechSynthesisUtterance(text.slice(0, 5000));
    u.rate = p.walkRate / 100;
    try {
      var voices = window.speechSynthesis.getVoices() || [];
      for (var i = 0; i < voices.length; i++) if (voices[i].voiceURI === p.voice) { u.voice = voices[i]; break; }
    } catch (e) {}
    u.onend = function () { walkSpeaking = false; walkPaused = false; walkControlSync(); announce('Finished reading this slide.'); };
    u.onerror = function () { walkSpeaking = false; walkPaused = false; walkControlSync(); };
    walkSpeaking = true; walkPaused = false; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); walkControlSync(); announce('Reading this slide aloud.');
  }
  function walkVoiceOptions() {
    var p = walkPrefs(), voices = [];
    try { voices = (window.speechSynthesis.getVoices() || []).slice(); } catch (e) {}
    voices.sort(function (a, b) { return String(a.lang + a.name).localeCompare(String(b.lang + b.name)); });
    return '<option value="">Default device voice</option>' + voices.map(function (v) {
      return '<option value="' + esc(v.voiceURI) + '"' + (p.voice === v.voiceURI ? ' selected' : '') + '>' + esc(rlLangLabel(v.lang) + ': ' + v.name) + '</option>';
    }).join('');
  }
  function walkPanelHtml() {
    if (!_walk || !_walk.panel) return '';
    var p = walkPrefs(), themes = [['dark', 'Dark'], ['light', 'Light'], ['soft', 'Soft grey'], ['warm', 'Warm'], ['contrast', 'High contrast']];
    return '<section id="walk-access-panel" class="walk-access-panel" role="region" aria-label="Walkthrough accessibility settings" tabindex="-1">'
      + '<div class="walk-access-head"><h2>Accessibility</h2><button type="button" onclick="SOC.walkPanel()" aria-label="Close accessibility settings">' + ic('x', 17, 2) + '</button></div>'
      + '<div class="walk-access-group"><b>Screen</b><div>' + themes.map(function (x) { return '<button type="button" onclick="SOC.walkSetting(\'theme\',\'' + x[0] + '\')" aria-pressed="' + (p.walkTheme === x[0]) + '">' + x[1] + '</button>'; }).join('') + '</div></div>'
      + '<div class="walk-access-group"><b>Text size</b><div>' + [100, 115, 130, 150].map(function (n) { return '<button type="button" onclick="SOC.walkSetting(\'size\',' + n + ')" aria-pressed="' + (p.walkSize === n) + '">' + n + '%</button>'; }).join('') + '</div></div>'
      + '<div class="walk-access-group"><b>Reading display</b><div><button type="button" onclick="SOC.walkSetting(\'font\',' + (!p.walkFont) + ')" aria-pressed="' + p.walkFont + '">High-legibility font</button><button type="button" onclick="SOC.walkSetting(\'motion\',' + (!p.walkMotion) + ')" aria-pressed="' + p.walkMotion + '">Reduce motion</button></div></div>'
      + (('speechSynthesis' in window) ? '<div class="walk-access-group"><b>Voice narration</b><label>Voice<select onchange="SOC.walkVoice(this.value)">' + walkVoiceOptions() + '</select></label><label>Speed<select onchange="SOC.walkRate(Number(this.value))"><option value="75"' + (p.walkRate === 75 ? ' selected' : '') + '>0.75x</option><option value="100"' + (p.walkRate === 100 ? ' selected' : '') + '>1x</option><option value="125"' + (p.walkRate === 125 ? ' selected' : '') + '>1.25x</option><option value="150"' + (p.walkRate === 150 ? ' selected' : '') + '>1.5x</option></select></label><div><button id="walk-speak" type="button" onclick="SOC.walkSpeak()">Read this slide</button><button id="walk-stop" type="button" onclick="SOC.walkStop()" disabled>Stop</button></div><small>Voice options come from your device. Narration reads only the current slide.</small></div>' : '<p class="walk-access-note">Voice narration is not available in this browser.</p>')
      + '<p class="walk-access-note">Your choices stay on this device. They do not change the course content or send information anywhere.</p></section>';
  }
  function walkSlides(w) {
    var d = weekData(w);
    if (!d) return [];
    var s = [];
    s.push({ kind: 'cover', title: weekTitle(w), question: (d.guiding && d.guiding[0]) || journeyQ(w), lead: firstSentence(d.overview || '') });
    try { var _cc = (typeof courseCode === 'function') ? courseCode() : ''; var _HOLO = _cc && (typeof window !== 'undefined') && window[_cc + '_HOLO']; if (_HOLO && _HOLO.supports && typeof visualSpec === 'function') { var _vs = visualSpec(w, d); if (_vs && _HOLO.supports(_vs.kind)) s.push({ kind: 'model', week: w }); } } catch (e) {}
    (d.concepts || []).forEach(function (c, ci) {
      s.push({ kind: 'concept', h: c.h, body: c.body, cite: c.cite });
      var fig = walkFig(w, ci);
      if (fig) s.push({ kind: 'figure', src: fig, h: c.h });
    });
    if (d.terms && d.terms.length) s.push({ kind: 'terms', items: d.terms.slice(0, 4) });
    if (d.guiding && d.guiding.length > 1) s.push({ kind: 'questions', items: d.guiding.slice(0, 4) });
    s.push({ kind: 'close', youcan: (d.youcan || []).slice(0, 3), reflect: d.reflectPrompt || '' });
    return s;
  }
  var _walk = null;
  function walkSlideHtml(s, w) {
    if (s.kind === 'cover') {
      return '<div class="walk-kicker">WEEK ' + w + ' WALKTHROUGH</div>'
        + '<h2 class="walk-title">' + esc(s.title) + '</h2>'
        + (s.lead ? '<p class="walk-lead">' + esc(s.lead) + '</p>' : '')
        + '<div class="walk-q"><span>The question this week</span><b>' + esc(s.question) + '</b></div>';
    }
    if (s.kind === 'concept') {
      return '<div class="walk-kicker">KEY IDEA</div><h2 class="walk-h">' + esc(s.h) + '</h2>'
        + '<p class="walk-body">' + esc(s.body) + '</p>'
        + (s.cite ? '<div class="walk-cite">' + esc(s.cite) + '</div>' : '');
    }
    if (s.kind === 'figure') {
      return '<div class="walk-figwrap">'
        + '<div class="walk-figtext">'
        + '<div class="walk-kicker">THE DIAGRAM</div>'
        + '<h2 class="walk-fighead">' + esc(s.h) + '</h2>'
        + '<p class="walk-figcap">A visual map of this idea. Follow how each part connects.</p>'
        + '</div>'
        + '<div class="walk-figview"><img class="walk-figimg" src="' + esc(s.src) + '" alt="Diagram for ' + esc(s.h) + '" onerror="var f=this.closest(&quot;.walk-figwrap&quot;);if(f){var v=f.querySelector(&quot;.walk-figview&quot;);if(v)v.innerHTML=&quot;<p class=walk-fignote>The diagram could not load.</p>&quot;;}"></div>'
        + '</div>';
    }
    if (s.kind === 'model') {
      var md = weekData(s.week);
      var sp = visualSpec(s.week, md);
      var vw = visualViewFor(s.week, 'overview');
      var mt = esc(sp.title || weekTitle(s.week));
      return '<div class="walk-figwrap">'
        + '<div class="walk-figtext">'
        + '<div class="walk-kicker">EXAMINE IN 3D</div>'
        + '<h2 class="walk-fighead">' + mt + '</h2>'
        + '<p class="walk-figcap">A 3D model of the core idea for this week. Drag the scene to turn it, and use the buttons to zoom or reset.</p>'
        + '</div>'
        + '<div class="walk-figview walk-modelview"><div class="wk-model-shell walk-modelshell">'
        + '<canvas class="wk-model-canvas" role="img" aria-label="Interactive 3D model for ' + mt + '" data-topic-model="overview" data-week="' + s.week + '" data-kind="' + esc(sp.kind || 'pipeline') + '" data-view="' + esc(vw) + '"></canvas>'
        + '<div class="wk-cam-ctl" role="group" aria-label="3D view controls">'
        + '<button type="button" onclick="return SOC.camCtl(event,\'spin\',-1)" aria-label="Rotate left">&#8634;</button>'
        + '<button type="button" onclick="return SOC.camCtl(event,\'spin\',1)" aria-label="Rotate right">&#8635;</button>'
        + '<button type="button" onclick="return SOC.camCtl(event,\'zoom\',1)" aria-label="Zoom in">+</button>'
        + '<button type="button" onclick="return SOC.camCtl(event,\'zoom\',-1)" aria-label="Zoom out">&#8722;</button>'
        + '<button type="button" onclick="return SOC.camCtl(event,\'reset\')" aria-label="Reset the view">Reset</button>'
        + '</div></div></div>';
    }
    if (s.kind === 'terms') {
      return '<div class="walk-kicker">THE WORDS TO KNOW</div><div class="walk-terms">'
        + s.items.map(function (t) { return '<div class="walk-term"><div class="walk-term-h">' + esc(t.term) + '</div><div class="walk-term-d">' + esc(t.def) + (t.cite ? ' <i>(' + esc(t.cite) + ')</i>' : '') + '</div></div>'; }).join('')
        + '</div>';
    }
    if (s.kind === 'questions') {
      return '<div class="walk-kicker">CARRY THESE QUESTIONS</div><ul class="walk-qlist">' + s.items.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ul>';
    }
    return '<div class="walk-kicker">YOU CAN NOW</div><ul class="walk-can">' + (s.youcan || []).map(function (y) { return '<li>' + esc(y) + '</li>'; }).join('') + '</ul>'
      + (s.reflect ? '<div class="walk-reflect"><span>Then reflect</span><p>' + esc(s.reflect) + '</p></div>' : '')
      + '<button type="button" class="walk-cta" onclick="SOC.walkGoWeek()">Open Week ' + _walk.week + ' in full</button>';
  }
  function walkFigApply() {
    if (!_walk) return;
    var img = document.querySelector('.walk-figimg');
    if (img && _walk.fig) img.style.transform = 'translate(' + _walk.fig.tx + 'px,' + _walk.fig.ty + 'px) scale(' + _walk.fig.scale + ') rotate(' + _walk.fig.rot + 'deg)';
  }
  function walkFigWire() {
    var view = document.querySelector('.walk-figview'), img = document.querySelector('.walk-figimg');
    if (!view || !img) return;
    _walk.fig = { scale: 1, rot: 0, tx: 0, ty: 0 };
    var drag = null;
    view.addEventListener('pointerdown', function (e) { drag = { x: e.clientX - _walk.fig.tx, y: e.clientY - _walk.fig.ty }; try { view.setPointerCapture(e.pointerId); } catch (er) {} view.style.cursor = 'grabbing'; });
    view.addEventListener('pointermove', function (e) { if (!drag) return; _walk.fig.tx = e.clientX - drag.x; _walk.fig.ty = e.clientY - drag.y; walkFigApply(); });
    view.addEventListener('pointerup', function () { drag = null; view.style.cursor = 'grab'; });
    view.addEventListener('wheel', function (e) { e.preventDefault(); _walk.fig.scale = Math.max(0.4, Math.min(6, _walk.fig.scale * (e.deltaY < 0 ? 1.12 : 0.89))); walkFigApply(); }, { passive: false });
  }
  function walkMount() {
    var ov = document.getElementById('walk-overlay');
    if (!ov || !_walk) return;
    var slides = _walk.slides, i = Math.max(0, Math.min(slides.length - 1, _walk.i)), s = slides[i], p = walkPrefs();
    ov.className = 'walk-' + walkTheme() + ' walk-size-' + p.walkSize + (p.walkFont ? ' walk-font' : '') + (p.walkMotion ? ' walk-reduce' : '');
    var dots = slides.map(function (_, k) { return '<button type="button" class="walk-dot' + (k === i ? ' on' : '') + '" onclick="SOC.walkGoto(' + k + ')" aria-label="Slide ' + (k + 1) + '"></button>'; }).join('');
    ov.innerHTML = '<button type="button" class="walk-theme" onclick="SOC.walkPanel()" aria-expanded="' + (!!_walk.panel) + '" aria-controls="walk-access-panel">Accessibility</button>'
      + '<button type="button" class="walk-close" onclick="SOC.walkClose()" aria-label="Close the walkthrough">' + ic('x', 20) + '</button>'
      + walkPanelHtml()
      + '<div class="walk-stage" aria-live="polite"><div class="walk-slide wkslide-' + s.kind + '" key="' + i + '" tabindex="-1">' + walkSlideHtml(s, _walk.week) + '</div></div>'
      + '<div class="walk-bar"><button type="button" class="walk-prev" onclick="SOC.walkNav(-1)"' + (i === 0 ? ' disabled' : '') + ' aria-label="Previous slide">' + ic('chevron', 20, 2.4) + '</button>'
      + '<div class="walk-dots">' + dots + '</div><div class="walk-count">' + (i + 1) + ' / ' + slides.length + '</div>'
      + '<button type="button" class="walk-next" onclick="SOC.walkNav(1)"' + (i === slides.length - 1 ? ' disabled' : '') + ' aria-label="Next slide">' + ic('chevron', 20, 2.4) + '</button></div>';
    if (s.kind === 'model') { try { initTopicModels(); } catch (e) {} }
    walkControlSync();
    setTimeout(function () {
      var target = _walk && _walk.panel ? document.getElementById('walk-access-panel') : (_walk && _walk.focusSlide ? ov.querySelector('.walk-slide') : null);
      if (target) { target.focus(); if (_walk) _walk.focusSlide = false; }
    }, 0);
    try { sessionStorage.setItem(WKKEY, JSON.stringify({ w: _walk.week, i: _walk.i })); } catch (e) {}
  }
  function walkKey(e) {
    if (!_walk) return;
    if (e.key === 'Escape') { e.preventDefault(); if (_walk.panel) { _walk.panel = false; walkMount(); } else SOC.walkClose(); }
    else if (e.key === 'Tab') {
      var ov = document.getElementById('walk-overlay'), f = ov && ov.querySelectorAll('button:not([disabled]),select:not([disabled]),[href], [tabindex]:not([tabindex="-1"])');
      if (!f || !f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    else if (!_walk.panel && !/^(SELECT|INPUT|TEXTAREA|BUTTON)$/.test(String(e.target && e.target.tagName)) && (e.key === 'ArrowRight' || e.key === 'PageDown')) { e.preventDefault(); SOC.walkNav(1); }
    else if (!_walk.panel && !/^(SELECT|INPUT|TEXTAREA|BUTTON)$/.test(String(e.target && e.target.tagName)) && (e.key === 'ArrowLeft' || e.key === 'PageUp')) { e.preventDefault(); SOC.walkNav(-1); }
  }
  function walkOpen(w) {
    walkCloseDom();
    var slides = walkSlides(w);
    if (!slides.length) return;
    _walk = { week: w, i: 0, slides: slides, fig: null, panel: false, focusSlide: true, returnFocus: document.activeElement, bodyOverflow: document.body.style.overflow };
    var ov = document.createElement('div');
    ov.id = 'walk-overlay'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Week ' + w + ' walkthrough'); ov.tabIndex = -1;
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';
    walkMount();
    document.addEventListener('keydown', walkKey, true);
  }
  function walkCloseDom() {
    var ret = _walk && _walk.returnFocus, oldOverflow = _walk && _walk.bodyOverflow;
    walkSpeakStop();
    var ov = document.getElementById('walk-overlay');
    if (ov) ov.remove();
    if (document.body) document.body.style.overflow = oldOverflow || '';
    document.removeEventListener('keydown', walkKey, true);
    try { sessionStorage.removeItem(WKKEY); } catch (e) {}
    if (ret && ret.focus) setTimeout(function () { try { ret.focus(); } catch (e) {} }, 0);
  }
  function walkthroughsPage() {
    var ws = [];
    for (var w = 1; w <= 14; w++) { var d = weekData(w); if (d && d.deck) ws.push({ w: w, deck: d.deck }); }
    var cards = ws.map(function (it) {
      return '<article class="vid-card" style="padding:0"><div style="padding:18px 20px">'
        + '<div class="mono" style="font-size:.7rem;letter-spacing:.06em;color:var(--red);font-weight:700;margin-bottom:6px">WEEK ' + it.w + '</div>'
        + '<h2 style="font-size:1.0625rem;margin:0 0 4px;color:#15171C">' + esc(weekTitle(it.w)) + '</h2>'
        + '<p style="font-size:.875rem;color:#474C57;margin:0 0 14px">A short slide walkthrough of this week\'s core idea, built to step through at your own pace.</p>'
        + '<div style="display:flex;gap:9px;flex-wrap:wrap">'
        + '<button type="button" class="wk-cta" style="margin:0" onclick="SOC.playWalk(' + it.w + ')">Play the walkthrough</button>'
        + '<button type="button" onclick="SOC.station(' + it.w + ')" style="border:1px solid #DEE3EA;background:#fff;color:#1B2A4A;border-radius:9px;font-size:.85rem;font-weight:600;padding:8px 14px;cursor:pointer">Go to Week ' + it.w + '</button>'
        + '</div></div></article>';
    }).join('');
    return '<div class="rise vid-page">'
      + '<section class="vid-hero"><div class="mono">SLIDE WALKTHROUGHS &middot; YOUR LECTURES</div><h1>Weekly Walkthroughs</h1><p>In an asynchronous course, the walkthrough is your lecture. Weeks 2 to 12 each have a short set of slides that walks through the core idea, and you step through them at your own pace. Open one right here, then jump straight into that week. The walkthroughs anchor the readings; they do not replace them.</p></section>'
      + (cards ? '<section class="vid-grid" aria-label="Weekly walkthrough decks">' + cards + '</section>' : '<p class="vid-empty">Walkthroughs are being prepared.</p>')
      + '</div>';
  }
  function videosPage() {
    var items = scholarMedia();
    var filter = state.videoWeek || 'all';
    var kindFilter = state.mediaKind || 'all';
    var shown = items.filter(function (v) { return (filter === 'all' || String(v.week) === String(filter)) && (kindFilter === 'all' || String(v.kind) === String(kindFilter)); });
    var L = lensParse();
    var field = L ? '<section class="vid-field-hero"><div><div class="mono">PROGRAM LENS IS ON</div><h2>' + esc(L.program || L.area) + '</h2><p>Each card now includes a field prompt. Use it to turn the media item into a concrete question about your future work, then return to the reading for the evidence.</p></div><button type="button" onclick="SOC.go(\'career\')">Review my field notes</button></section>' : '';
    return '<div class="rise vid-page">'
      + '<section class="vid-hero"><div class="mono">CURATED SCHOLAR MEDIA</div><h1>Scholar Media Gallery</h1><p>Use these videos and podcasts as on-ramps into the readings, not replacements for them. Each card tells you what the item explains, what to watch or listen for, and which reading move to make next.</p></section>'
      + '<section class="vid-rule"><div><b>Watch or listen, then read</b><span>The media gives you a way in. Your assignments still need concepts and evidence from the readings.</span></div><div><b>Official sources only</b><span>Embeddable videos use official platform players. Podcasts and restricted media link out to the source site.</span></div><div><b>Use the program lens</b><span>If you choose a program, each card adds a field prompt without changing the required work.</span></div></section>'
      + field
      + mediaWeekOptions(items)
      + mediaKindOptions(items)
      + '<section class="vid-grid" aria-label="Scholar media cards">' + shown.map(videoCard).join('') + '</section>'
      + (shown.length ? '' : '<p class="vid-empty">No media items are currently curated for that filter.</p>')
      + '</div>';
  }
  function homeBar() {
    return '<div class="page-return-row" aria-label="Page navigation"><button type="button" onclick="SOC.prev()">&#8592; Return to Previous Screen</button><button type="button" onclick="SOC.go(\'journey\')">Home</button></div>';
  }
  function backBar() {
    return homeBar();
  }
  function docBlank(s) { return String(s || '').trim() || '(not written yet)'; }
  function yesNoDoc(x) { return x ? 'Yes' : 'Not yet'; }
  function readingsDoc(w, d) {
    var refs = ((d && d.readings) || []).map(function (r, i) {
      return (i + 1) + '. ' + String(r.apa || '').replace(/<[^>]+>/g, '');
    }).join('\n\n') || '(no assigned readings this week)';
    return 'Assigned readings:\n' + refs + '\n\nYour notes:\n' + docBlank(wkNoteValue(w, 'readings'));
  }
  function visualDoc(w, d) {
    var spec = visualSpec(w, d);
    var labels = (spec.labels || []).slice(0, 3).map(function (l, i) { return (i + 1) + '. ' + (l.t || '') + ': ' + (l.sub || ''); }).join('\n');
    return 'What the visual is conveying:\n' + (spec.reading || spec.scene || '(visual guide)') + (labels ? '\n\nLabels:\n' + labels : '') + '\n\nYour notes:\n' + docBlank(wkNoteValue(w, 'visual'));
  }
  function walkthroughDoc(w, d) {
    if (!d || !d.deck) return 'No walkthrough deck for this week.\n\nYour notes:\n' + docBlank(wkNoteValue(w, 'walkthrough'));
    return 'Walkthrough used: ' + d.deck + '\n\nYour notes:\n' + docBlank(wkNoteValue(w, 'walkthrough'));
  }
  function kcDoc(w) {
    var kcVer = (state.kcVersion && state.kcVersion[w]) || 0;
    var label = ['A', 'B', 'C'][kcVer] || 'A';
    var items = kcSection(w).items || [];
    var scored = items.filter(function (m) { return !(m && m.type === 'short'); });
    var answered = 0, correct = 0, confidentMiss = 0, confidenceSet = 0;
    scored.forEach(function (m, mi) {
      var key = 'wk' + w + '|kc' + kcVer + '|' + mi, sel = state.mcSel && state.mcSel[key];
      if (sel !== undefined && sel !== null) {
        answered++;
        if (sel === m.answer) correct++;
        var conf = state.mcConf && state.mcConf[key];
        if (conf) {
          confidenceSet++;
          if (conf === 'sure' && sel !== m.answer) confidentMiss++;
        }
      }
    });
    var shortRows = items.filter(function (m) { return m && m.type === 'short'; }).map(function (m, si) {
      var skey = 'wk' + w + '|kc' + kcVer + '|short' + si;
      var rate = state.kcShortRate && state.kcShortRate[skey];
      return (si + 1) + '. ' + (m.q || 'Short reflection') + '\n   Your answer: ' + docBlank(state.kcShort && state.kcShort[skey]) + '\n   Your self-rating: ' + (rate === 'got' ? 'I had this' : rate === 'part' ? 'Partly there' : rate === 'not' ? 'Not yet' : '(not rated)');
    }).join('\n\n');
    return 'Set used: ' + label + '\nPractice result: ' + correct + ' of ' + scored.length + ' correct (' + answered + ' of ' + scored.length + ' answered).\nConfidence marks added: ' + confidenceSet + '. Confident misses: ' + confidentMiss + '.\n\n' + (shortRows ? 'Short written practice:\n' + shortRows : 'No short written practice completed in this set.');
  }
  function readingCompDoc(w, d) {
    var records = weekReadingRecords(d), any = false;
    var lines = records.map(function (r) {
      var mcItems = MC[r.id] || [], ans = 0, cor = 0;
      mcItems.forEach(function (m, mi) { var s = state.mcSel && state.mcSel[r.id + '|mc|' + mi]; if (s !== undefined && s !== null) { ans++; if (s === m.answer) cor++; } });
      var noteLines = Object.keys(state.rcNotes || {}).filter(function (k) { return k.indexOf(r.id + '|') === 0 && String(state.rcNotes[k] || '').trim(); }).map(function (k) { any = true; return '- ' + String(state.rcNotes[k]).trim(); }).join('\n');
      if (ans || noteLines) any = true;
      return r.title + '\nPractice result: ' + cor + ' of ' + mcItems.length + ' correct (' + ans + ' answered).' + (noteLines ? '\nWritten responses:\n' + noteLines : '\nWritten responses: (not written yet)');
    });
    return any ? lines.join('\n\n') : 'No reading-comprehension practice saved for this week yet.';
  }
  function checksDoc(w, d) {
    if (!d || !d.checks || !d.checks.length) return 'No before-and-after understanding check for this week.';
    var lab = ['New to me', 'Getting it', 'I can'];
    var rate = function (k) { var s = state.wkCheck[k]; return s == null ? '(not rated)' : lab[s]; };
    var postStat = checkStat(w, 'post', d), moved = 0;
    var checkLines = d.checks.map(function (q, i) {
      var pr = state.wkCheck['pre|' + w + '|' + i], po = state.wkCheck['post|' + w + '|' + i];
      if (pr != null && po != null && po > pr) moved++;
      return (i + 1) + '. ' + checkText(q) + '\n   Before: ' + rate('pre|' + w + '|' + i) + '   After: ' + rate('post|' + w + '|' + i);
    }).join('\n\n');
    return 'After the week you can speak to ' + postStat.g.can + ' of ' + postStat.total + ' ideas (getting there on ' + postStat.g.getting + ', new to ' + postStat.g.newto + '), and your read moved forward on ' + moved + ' of ' + postStat.total + ' since the start.\n\n' + checkLines;
  }
  function mediaDoc(w) {
    var mediaText = scholarMedia().filter(function (v) {
      return v.week === w && state.mediaNotes && String(state.mediaNotes[v.key] || '').trim();
    }).map(function (v) {
      return v.title + ' (' + v.scholar + '):\n' + String(state.mediaNotes[v.key] || '').trim();
    }).join('\n\n');
    return mediaText || '(not written yet)';
  }
  function revisitDoc(w, d) {
    var note = docBlank(wkNoteValue(w, 'revisit'));
    if (!d || !d.checks || !d.checks.length) return note;
    var post = checkStat(w, 'post', d);
    var auto = (post.items || []).filter(function (it) { return it.r !== 2; }).map(function (it, i) { return (i + 1) + '. ' + checkText(it); }).join('\n');
    return note + (auto ? '\n\nAuto-suggested revisit list from your final understanding check:\n' + auto : '');
  }
  function checklistDoc(w, d) {
    var actSum = activitySummary(w, d);
    var activityDone = actSum.indexOf('not started') < 0 && actSum.indexOf('not run') < 0 && actSum.indexOf('revisit not started') < 0;
    var kcItems = kcSection(w).items || [], kcVer = (state.kcVersion && state.kcVersion[w]) || 0;
    var kcAnswered = kcItems.some(function (m, mi) { return m && m.type !== 'short' && state.mcSel && state.mcSel['wk' + w + '|kc' + kcVer + '|' + mi] != null; });
    return [
      'Readings notes added: ' + yesNoDoc(!!wkNoteValue(w, 'readings')),
      'Visual overview notes added: ' + yesNoDoc(!!wkNoteValue(w, 'visual')),
      'Walkthrough notes added: ' + yesNoDoc(!!wkNoteValue(w, 'walkthrough') || !(d && d.deck)),
      'Activity attempted: ' + yesNoDoc(activityDone),
      'Knowledge check attempted: ' + yesNoDoc(kcAnswered),
      'Reading-comprehension practice attempted: ' + yesNoDoc(readingCompDoc(w, d).indexOf('No reading-comprehension practice') !== 0),
      'Reflection written: ' + yesNoDoc(!!String(state.wkReflect[w] || '').trim()),
      'Revisit note written: ' + yesNoDoc(!!wkNoteValue(w, 'revisit'))
    ].join('\n');
  }
  function mobileJumpItem(label, action, primary) {
    return '<button type="button" class="' + (primary ? 'primary' : '') + '" onclick="' + action + '">' + esc(label) + '</button>';
  }
  function mobileWeekActions(w, d, opt) {
    opt = opt || {};
    d = d || {};
    var items = [
      mobileJumpItem('Menu', 'SOC.openNav()', true),
      mobileJumpItem('Home', "SOC.go('journey')", false)
    ];
    if (d.deck) items.push(mobileJumpItem('Walkthrough', "SOC.jumpWeek(" + w + ",'watch')", false));
    if (d.activity) items.push(mobileJumpItem(opt.activityLabel || 'Activity', "SOC.jumpWeek(" + w + ",'do')", false));
    if (opt.reflect !== false) {
      items.push(mobileJumpItem('Reflect', "SOC.jumpWeek(" + w + ",'reflect')", false));
      items.push(mobileJumpItem('Notes', "SOC.jumpWeek(" + w + ",'notes')", false));
    }
    return '<nav class="soc-mobile-jump" aria-label="Mobile week shortcuts">' + items.join('') + '</nav>';
  }
  function mobileActivityActions(w, d) {
    d = d || {};
    var items = [
      mobileJumpItem('Menu', 'SOC.openNav()', true),
      mobileJumpItem('Week ' + w, 'SOC.station(' + w + ')', false),
      mobileJumpItem('Home', "SOC.go('journey')", false)
    ];
    if (d.deck) items.push(mobileJumpItem('Walkthrough', "SOC.jumpWeek(" + w + ",'watch')", false));
    items.push(mobileJumpItem('Reflect', "SOC.jumpWeek(" + w + ",'reflect')", false));
    items.push(mobileJumpItem('Notes', "SOC.jumpWeek(" + w + ",'notes')", false));
    return '<nav class="soc-mobile-jump" aria-label="Mobile activity shortcuts">' + items.join('') + '</nav>';
  }
  function body() {
    if (state.screen === 'journey' || state.screen === 'library') return journeyHome();
    if (state.screen === 'station') { var _sw = state.stationWeek || currentJourneyWeek(); return homeBar() + lensHook(_sw) + weekStation(_sw); }
    if (state.screen === 'detail') return homeBar() + detail();
    if (state.screen === 'pathways') return homeBar() + pathwaysPage();
    if (state.screen === 'site') return homeBar() + siteInfoPage();
    if (state.screen === 'assignments') return homeBar() + assignmentsPage();
    if (state.screen === 'calendar') return '<div class="page-return-row" aria-label="Page navigation"><button type="button" onclick="SOC.prev()">&#8592; Hide All Dates</button><button type="button" onclick="SOC.go(\'journey\')">Home</button></div>' + calendarPage();
    if (state.screen === 'assignment-program') return homeBar() + assignmentProgramPage();
    if (state.screen === 'assignment-details') return homeBar() + assignmentDetailsPage();
    if (state.screen === 'assignment-rubric') return homeBar() + assignmentRubricPage();
    if (state.screen === 'assignment-release') return homeBar() + assignmentReleasePage();
    if (state.screen === 'assignment-ai') return homeBar() + assignmentAiPage();
    if (state.screen === 'assignment-faq') return homeBar() + assignmentFaqPage();
    if (state.screen === 'starter') return homeBar() + starterPage();
    if (state.screen === 'walkthroughs') return homeBar() + walkthroughsPage();
    if (state.screen === 'videos') return homeBar() + videosPage();
    if (state.screen === 'readings') return homeBar() + readingsGallery();
    if (state.screen === 'compare') return homeBar() + compare();
    if (state.screen === 'reading') return homeBar() + readingComp();
    if (state.screen === 'glossary') return homeBar() + glossaryScreen();
    if (state.screen === 'career') return homeBar() + careerScreen();
    if (state.screen === 'cards') return homeBar() + cardsScreen();
    if (state.screen === 'sandbox' && D.course && D.course.code === 'BFS218') return backBar() + sandboxScreen();
    if (state.screen === 'activity' && D.course && D.course.code === 'BFS218') return backBar() + activityScreen();
    return journeyHome();
  }
  function careerScreen() {
    var C = window[(D.course && D.course.code) + '_CAREER'] || null;
    if (!C) return '<div class="rise career-page"><section class="career-empty"><h2>Career Choices is being prepared.</h2><p>This section is not ready yet.</p></section></div>';
    var raw = state.careerField || '', area = raw, program = null;
    if (raw.indexOf('::') >= 0) { var parts = raw.split('::'); area = parts[0]; program = parts[1]; }
    var PROG = window.SENECA_PROGRAMS || null;
    var opts;
    if (PROG) {
      opts = '<option value=""' + (!raw ? ' selected' : '') + '>General stream / no program</option>';
      (C.fields || []).forEach(function (fld) {
        var progs = PROG[fld] || [];
        opts += '<optgroup label="' + esc(fld) + '">';
        opts += '<option value="' + esc(fld) + '"' + (raw === fld ? ' selected' : '') + '>All of ' + esc(fld) + '</option>';
        progs.forEach(function (pr) { var v = fld + '::' + pr; opts += '<option value="' + esc(v) + '"' + (raw === v ? ' selected' : '') + '>' + esc(pr) + '</option>'; });
        opts += '</optgroup>';
      });
      opts += '<option value="__explore"' + (raw === '__explore' ? ' selected' : '') + '>Still exploring / undecided</option>';
    } else {
      opts = '<option value=""' + (!raw ? ' selected' : '') + '>General stream / no program</option>'
        + (C.fields || []).map(function (fld) { return '<option value="' + esc(fld) + '"' + (raw === fld ? ' selected' : '') + '>' + esc(fld) + '</option>'; }).join('')
        + '<option value="__explore"' + (raw === '__explore' ? ' selected' : '') + '>Still exploring / undecided</option>';
    }
    var selected = raw ? (program || area || 'Selected lens') : 'No program lens selected yet';
    var picker = '<aside class="career-picker"><label for="career-sel">Choose your program lens</label><select id="career-sel" onchange="SOC.careerField(this.value)" aria-label="Select your program or field of study">' + opts + '</select><p>Current lens: <b>' + esc(selected) + '</b>. You can change this any time. The assignments stay the same.</p></aside>';
    var hero = '<section class="career-hero"><div><div class="mono">CAREER CHOICES</div><h1>Read BFS218 through your future work</h1><p>' + esc(C.intro || 'Choose a program lens to connect the course to your field.') + ' The lens does not change the required course. It changes the examples, prompts, and field questions that help the course feel closer to your world.</p></div>' + picker + '</section>';
    var impact = '<section id="career-choices" class="career-impact" aria-label="What the program lens changes"><div><b>Weekly field hooks</b><span>The weekly page points to examples that feel closer to your program or field.</span></div><div><b>Stronger assignment choices</b><span>You get help finding artifacts, systems, and cases that fit the assignment prompt.</span></div><div><b>Same grading standard</b><span>Your work is still assessed on the same BFS218 expectations as everyone else.</span></div></section>';
    var box = function (label, inner) { return '<div class="career-box"><div class="mono">' + esc(label) + '</div>' + inner + '</div>'; };
    var systemsBox = function (spec) {
      if (!spec) return '';
      return box('SYSTEMS TO WATCH', '<p><b>Examples:</b> ' + esc(capList(spec.topics || [])) + '</p><p><b>Artifacts:</b> ' + esc(capList(spec.artifacts || [])) + '</p><p><b>Question:</b> ' + esc(spec.question || 'Ask who benefits, who carries risk, and who can challenge a bad outcome.') + '</p>');
    };
    var programCareerBoxes = function (spec, L, fieldData) {
      if (!spec || !L || !L.program || L.general) return '';
      var ctx = lensFieldContext(L);
      var topic = capPhrase((spec.topics && spec.topics[0]) || ctx.decision);
      var artifact = capPhrase((spec.artifacts && spec.artifacts[0]) || 'a visible artifact');
      var boundary = programBoundaryPhrase(L.program, L.area);
      var weeks = ((spec.weeks && spec.weeks.length) ? spec.weeks : ((fieldData && fieldData.weeks) || [])).slice(0, 4);
      var buttons = weeks.map(function (w) { return '<button type="button" onclick="SOC.station(' + w + ')">Week ' + w + ': ' + esc(weekTitle(w)) + ' &#8594;</button>'; }).join('');
      var skills = [
        'Trace how ' + topic.toLowerCase() + ' can turn a routine task into a decision about people.',
        'Use ' + artifact.toLowerCase() + ' as evidence instead of writing a general opinion.',
        'Explain who is trusted, delayed, watched, excluded, protected, or given a way to challenge the outcome.',
        'Keep the course lens visible without turning the work into career advice.'
      ];
      var roles = [
        'A class assignment example from the ' + boundary + ' context',
        'A workplace conversation about a tool, record, rule, or dashboard',
        'A professional decision where someone needs evidence, review, consent, appeal, or accountability'
      ];
      return box('PROGRAM-LEVEL READING', '<p>This page does not give students an answer. It gives a way to see where the course can enter ' + esc(L.program) + '. The student still has to choose the real example, verify the evidence, define the course concept, and write the analysis in their own words.</p><p>For this program, start with ' + esc(topic.toLowerCase()) + ' and ask a precise question: ' + esc(spec.question || 'What does the system do, and who can challenge the result?') + '</p>')
        + box('IN THIS PROGRAM', '<p>Imagine a student in ' + esc(L.program) + ' working with ' + esc(topic.toLowerCase()) + '. The important move is not to say the tool is good or bad immediately. First, they describe what the tool or record does, point to ' + esc(artifact.toLowerCase()) + ', name who is affected, and then bring in the course concept.</p><p>The stronger example will usually sit inside ' + esc(ctx.setting) + ', where ' + esc(ctx.decision) + ' can shape what happens next.</p>')
        + box('WHAT STUDENTS PRACTISE', '<ul>' + skills.map(function (sk) { return '<li>' + esc(sk) + '</li>'; }).join('') + '</ul>')
        + (weeks.length ? box('ZOOM IN ON THESE WEEKS', '<p>These weeks are the strongest starting points for this program lens. Students still need to read the assigned materials and make their own connection.</p><div class="career-week-buttons">' + buttons + '</div>') : '')
        + box('WHERE THIS SHOWS UP', '<ul>' + roles.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul>');
    };
    var generalCareerBlock = function (title, body) {
      var g = generalStreamLens(), spec = programSpecificProfile(g);
      return '<div class="rise career-page">' + hero + impact + '<section id="career-main" class="career-field"><div class="mono">GENERAL STREAM</div><h2>' + esc(title) + '</h2><p>' + esc(body) + '</p>' + box('HOW TO USE THIS PATH', '<p>The General Stream is not a weaker option. It asks you to choose one ordinary system from daily life, school, work, housing, health, media, finance, travel, policing, or public services and analyse it with the course question.</p>') + systemsBox(spec) + '</section></div>';
    };
    var empty = function (title, body) { return '<section id="career-main" class="career-empty"><h2>' + esc(title) + '</h2><p>' + esc(body) + '</p><p>Start with the general course path if you are unsure. You can choose a field later without losing your notes or progress.</p></section>'; };
    if (!raw) return generalCareerBlock('Start general, or choose a lens now', 'The general path is the standard course experience. Use it when you want to begin from everyday systems rather than a specific program. You still need one concrete artifact, one course concept, and your own analysis.');
    if (raw === '__explore') return generalCareerBlock('Still exploring is a valid lens', 'Read the course with one question in mind: wherever I end up, what systems will make decisions about people, and how will I notice when those systems harm someone?');
    var f = (C.byField || {})[area];
    if (!f) return '<div class="rise career-page">' + hero + impact + empty('This lens is being prepared', 'The write-up for ' + area + ' is not ready yet. Keep using the general route for now.') + '</div>';
    var out = '<section id="career-main" class="career-field"><div class="mono">YOUR SELECTED FIELD</div><h2>' + esc(program || area) + '</h2>';
    var careerSpec = programSpecificProfile({ area: area, program: program || area, label: program || area });
    if (program) {
      var pnote = (C.byProgram || {})[program];
      out += box('FOR THIS PROGRAM', '<p>' + esc(pnote || (careerSpec && careerSpec.overview) || (program + ' gives the course a specific place to inspect systems, records, standards, and decisions.')) + '</p>');
    } else if (careerSpec && careerSpec.overview) {
      out += box('FOR THIS FIELD', '<p>' + esc(careerSpec.overview) + '</p>');
    }
    if (f.lens) out += '<div class="career-lens"><div class="mono">READ THE COURSE THIS WAY</div><p>' + esc(f.lens) + '</p></div>';
    out += systemsBox(careerSpec);
    if (program) {
      out += programCareerBoxes(careerSpec, { area: area, program: program, label: program }, f);
    } else {
      (f.paras || []).forEach(function (pp) { out += '<p>' + esc(pp) + '</p>'; });
      if (f.scenario) out += box('IN YOUR FIELD', '<p>' + esc(f.scenario) + '</p>');
      if (f.skills && f.skills.length) out += box('WHAT YOU WILL WALK AWAY ABLE TO DO', '<ul>' + f.skills.map(function (sk) { return '<li>' + esc(sk) + '</li>'; }).join('') + '</ul>');
      if (f.weeks && f.weeks.length) {
        var wl = f.weeks.map(function (w) { return '<button type="button" onclick="SOC.station(' + w + ')">Week ' + w + ' &#8594;</button>'; }).join('');
        out += box('ZOOM IN ON THESE WEEKS', (f.weeksWhy ? '<p>' + esc(f.weeksWhy) + '</p>' : '') + '<div class="career-week-buttons">' + wl + '</div>');
      }
      if (f.roles && f.roles.length) out += box('WHERE THIS SHOWS UP', '<p>' + f.roles.map(esc).join(' &middot; ') + '</p>');
    }
    var rk = 'career|' + area, rv = esc((state.careerReflect && state.careerReflect[rk]) || '');
    out += '<div class="career-note"><h3 style="margin:10px 0 4px;font-size:1.02rem">Where might this land in your field?</h3><p class="wk-hint" style="margin-bottom:8px">A quick note to yourself, saved in this browser on this device. Nothing is submitted. Use Generate Your Weekly Notes to keep a permanent copy.</p>'
      + '<textarea oninput="SOC.careerReflect(\'' + rk + '\',this.value)" aria-label="Your reflection" class="wk-ta" placeholder="One place I can already picture this showing up in my field...">' + rv + '</textarea></div></section>';
    return '<div class="rise career-page">' + hero + impact + out + '</div>';
  }
  var __fromPop = false, __lastNavKey = null, __pushed = false;
  function navKey() {
    return [state.screen, state.stationWeek, state.journeyWeek, state.detailId, state.cardWeek, state.activeWeek, state.galWeek, state.galTopic, state.assignmentTab, state.assignmentFaq, state.rcReading, state.showSynthesis ? 1 : 0, (state.compareIds || []).length].join('~');
  }
  function navHistorySync() {
    if (__fromPop) return;
    var k = navKey();
    try {
      if (__lastNavKey === null) history.replaceState(viewSnapshot(), '');
      else if (k !== __lastNavKey) { history.pushState(viewSnapshot(), ''); __pushed = true; }
    } catch (e) {}
    __lastNavKey = k;
  }
  function render() {
    if (state.screen !== 'compare' && render._prev !== undefined && render._prev !== state.screen && (state.compareIds.length || state.showSynthesis)) { state.compareIds = []; state.showSynthesis = false; }
    render._prev = state.screen;
    cleanupModels();
    auditRenderStamp++;
    var toast = state.toast ? '<div role="status" style="position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:80;background:#15171C;color:#fff;font-size:.9375rem;font-weight:500;padding:12px 20px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.24);display:flex;align-items:center;gap:10px"><span style="display:flex;color:#F2A900">' + ic('check', 16, 2.2) + '</span>' + esc(state.toast) + '</div>' : '';
    document.getElementById('app').innerHTML =
      '<div style="min-height:100vh;display:flex;flex-direction:column;background:#F7F8FA">' + header()
      + (state.navOpen ? '<button class="soc-mobile-scrim" onclick="SOC.closeNav()" aria-label="Close course navigation"></button>' : '')
      + '<div style="display:flex;flex:1;min-height:0">' + sidebar()
      + '<main id="soc-main" tabindex="-1" class="scrollarea" style="flex:1;min-width:0;overflow:auto;height:calc(100vh - 62px)"><div style="margin:0 auto;padding:30px 30px 110px">' + (['journey','library','station','videos'].indexOf(state.screen) >= 0 ? lensChip() : '') + dueReminderStrip() + body() + siteFooter() + '</div></main>'
      + '</div>' + readerLensOverlay() + rlPanelOverlay() + listenOverlay() + toast + '</div>';
    if (refocusSearch) {
      var el = document.getElementById('soc-search');
      if (el) { el.focus(); var v = el.value; el.setSelectionRange(v.length, v.length); }
      refocusSearch = false;
    }
    if (focusTarget) {
      var ft = document.getElementById(focusTarget);
      if (ft) { if (!ft.hasAttribute('tabindex')) ft.setAttribute('tabindex', '-1'); ft.focus(); }
      focusTarget = null;
    }
    var ann = screenAnnounceText();
    if (ann && render._announced !== ann) {
      render._announced = ann;
      document.title = ann + ' | ' + (courseCode() || 'Course') + ' Asynchronous';
      var lr = document.getElementById('soc-live');
      if (lr) { lr.textContent = ''; setTimeout(function () { lr.textContent = 'Loaded ' + ann; }, 30); }
    }
    saveView();
    initAuditModels();
    wkEnhanceSections();
    initTopicModels();
    navHistorySync();
  }
  function topScroll() { var m = document.getElementById('soc-main'); if (m) m.scrollTop = 0; }
  function renderKeepScroll() {
    var m = document.getElementById('soc-main'), y = m ? m.scrollTop : 0;
    render();
    var m2 = document.getElementById('soc-main');
    if (m2) m2.scrollTop = y;
  }
  function scrollWeekPart(part) {
    if (!part) { topScroll(); return; }
    setTimeout(function () {
      try { wkExpandFor('wk-' + part); } catch (e) {}
      var el = document.getElementById('wk-' + part);
      var m = document.getElementById('soc-main');
      if (el && m) m.scrollTop = Math.max(0, el.offsetTop - 10);
      else if (el && el.scrollIntoView) el.scrollIntoView({ block: 'start' });
    }, 20);
  }
  function scrollToId(id) {
    setTimeout(function () {
      var el = document.getElementById(id);
      var m = document.getElementById('soc-main');
      if (el && m) m.scrollTop = Math.max(0, el.offsetTop - 12);
      else if (el && el.scrollIntoView) el.scrollIntoView({ block: 'start' });
    }, 20);
  }
  function viewSnapshot() {
    return {
      screen: state.screen,
      journeyWeek: state.journeyWeek,
      stationWeek: state.stationWeek,
      activityReturn: state.activityReturn,
      detailId: state.detailId,
      cardWeek: state.cardWeek,
      activeTypes: (state.activeTypes || []).slice(),
      activeWeek: state.activeWeek,
      search: state.search || '',
      savedView: !!state.savedView,
      rcReading: state.rcReading,
      lens: state.lens || 'thematic',
      compareIds: (state.compareIds || []).slice(),
      showSynthesis: !!state.showSynthesis,
      galWeek: state.galWeek,
      galTopic: state.galTopic,
      glossWeek: state.glossWeek || 'all',
      glossSearch: state.glossSearch || '',
      auditRun: !!state.auditRun,
      auditSystem: state.auditSystem || 0,
      auditSlice: state.auditSlice || 'overall',
      auditView: state.auditView || 'errors',
      auditedSystems: state.auditedSystems || {},
      act: state.act || {},
      assignmentIndex: state.assignmentIndex || 0,
      assignmentTab: state.assignmentTab || 'story',
      assignmentFaq: state.assignmentFaq,
      programViewField: state.programViewField || '',
      programViewAssignment: state.programViewAssignment || 'all',
      videoWeek: state.videoWeek || 'all',
      mediaKind: state.mediaKind || 'all'
    };
  }
  function sameView(a, b) {
    try { return JSON.stringify(a || {}) === JSON.stringify(b || {}); } catch (e) { return false; }
  }
  function rememberPrevious() {
    var v = viewSnapshot();
    if (!state.prevView || !sameView(v, state.prevView)) state.prevView = v;
  }
  function restoreView(v) {
    v = v || { screen: 'journey' };
    state.screen = cleanScreen(v.screen);
    state.journeyWeek = cleanWeek(v.journeyWeek);
    state.stationWeek = cleanWeek(v.stationWeek);
    state.activityReturn = cleanWeek(v.activityReturn);
    state.detailId = v.detailId || null;
    state.cardWeek = cleanWeek(v.cardWeek);
    state.activeTypes = Array.isArray(v.activeTypes) ? v.activeTypes.slice() : [];
    state.activeWeek = cleanWeek(v.activeWeek);
    state.search = v.search || '';
    state.savedView = !!v.savedView;
    state.rcReading = v.rcReading || null;
    state.lens = v.lens || 'thematic';
    state.compareIds = Array.isArray(v.compareIds) ? v.compareIds.slice() : [];
    state.showSynthesis = !!v.showSynthesis;
    state.galWeek = cleanWeek(v.galWeek);
    state.galTopic = v.galTopic || null;
    state.glossWeek = v.glossWeek || 'all';
    state.glossSearch = v.glossSearch || '';
    state.auditRun = !!v.auditRun;
    state.auditSystem = Number(v.auditSystem) || 0;
    state.auditSlice = v.auditSlice || 'overall';
    state.auditView = v.auditView || 'errors';
    state.auditedSystems = (v.auditedSystems && typeof v.auditedSystems === 'object') ? v.auditedSystems : {};
    state.act = (v.act && typeof v.act === 'object') ? v.act : (state.act || {});
    state.assignmentIndex = Number(v.assignmentIndex) || 0;
    state.assignmentTab = cleanAssignmentTab(v.assignmentTab);
    state.assignmentFaq = v.assignmentFaq == null ? null : Number(v.assignmentFaq);
    state.programViewField = v.programViewField || '';
    state.programViewAssignment = v.programViewAssignment || 'all';
    state.videoWeek = v.videoWeek || 'all';
    state.mediaKind = v.mediaKind || 'all';
    state.navOpen = false;
  }
  function goPrevious() {
    if (__pushed) { try { history.back(); return; } catch (e) {} }
    var current = viewSnapshot();
    var prev = state.prevView;
    if (prev && prev.screen && !sameView(prev, current)) {
      restoreView(prev);
      state.prevView = current;
    } else if (state.activityReturn != null) {
      restoreView({ screen: 'station', stationWeek: state.activityReturn, journeyWeek: state.activityReturn });
      state.prevView = current;
    } else {
      restoreView({ screen: 'journey' });
      state.prevView = current;
    }
    persist();
    focusTarget = 'soc-main';
    render();
    topScroll();
  }

  /* ---------- actions ---------- */
  function flash(msg) { clearTimeout(toastTimer); var lr = document.getElementById('soc-live'); if (lr) { lr.textContent = ''; setTimeout(function () { lr.textContent = msg; }, 30); } state.toast = msg; render(); toastTimer = setTimeout(function () { state.toast = null; render(); }, 2200); }
  function flashKeep(msg) { clearTimeout(toastTimer); var lr = document.getElementById('soc-live'); if (lr) { lr.textContent = ''; setTimeout(function () { lr.textContent = msg; }, 30); } state.toast = msg; renderKeepScroll(); toastTimer = setTimeout(function () { state.toast = null; renderKeepScroll(); }, 2200); }
  /* ---- real .docx (OOXML, dependency-free) ---- */
  var DX_FONT = 'IBM Plex Sans';
  var DX_BODY_SIZE = 22;
  function dxEsc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]; }); }
  function dxRun(text, opt) {
    opt = opt || {};
    var size = opt.size || DX_BODY_SIZE;
    var rpr = '<w:rPr>';
    if (opt.bold) rpr += '<w:b/>';
    if (opt.italic) rpr += '<w:i/>';
    if (opt.color) rpr += '<w:color w:val="' + opt.color + '"/>';
    rpr += '<w:sz w:val="' + size + '"/><w:szCs w:val="' + size + '"/>';
    rpr += '<w:rFonts w:ascii="' + DX_FONT + '" w:hAnsi="' + DX_FONT + '" w:cs="' + DX_FONT + '"/></w:rPr>';
    var parts = String(text == null ? '' : text).split('\n'), t = '';
    for (var i = 0; i < parts.length; i++) {
      if (i > 0) t += '<w:br/>';
      t += '<w:t xml:space="preserve">' + dxEsc(parts[i]) + '</w:t>';
    }
    return '<w:r>' + rpr + t + '</w:r>';
  }
  function dxPara(runsXml, opt) {
    opt = opt || {};
    var ppr = '<w:pPr>';
    if (opt.style) ppr += '<w:pStyle w:val="' + opt.style + '"/>';
    if (opt.keep) ppr += '<w:keepNext/><w:keepLines/>';
    if (opt.align) ppr += '<w:jc w:val="' + opt.align + '"/>';
    ppr += '<w:spacing w:before="' + (opt.before || 0) + '" w:after="' + (opt.after || 120) + '" w:line="300" w:lineRule="auto"/>';
    if (opt.border) ppr += '<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="6" w:color="DEE3EA"/></w:pBdr>';
    ppr += '</w:pPr>';
    return '<w:p>' + ppr + runsXml + '</w:p>';
  }
  function dxLogoRun(rid, id, cx, cy) {
    return '<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="' + cx + '" cy="' + cy + '"/><wp:docPr id="' + id + '" name="Seneca logo"/><wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="' + (id + 1) + '" name="seneca-logo.png"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="' + rid + '"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="' + cx + '" cy="' + cy + '"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>';
  }
  function dxLogoPara(rid) {
    return dxPara(dxLogoRun(rid, 1, 1760000, 360000), { align: 'left', after: 180 });
  }
  function dxTc(inner, opt) { opt = opt || {}; var props = '<w:tcPr>'; if (opt.w) props += '<w:tcW w:w="' + opt.w + '" w:type="dxa"/>'; if (opt.shade) props += '<w:shd w:fill="' + opt.shade + '"/>'; props += '<w:tcMar><w:top w:w="110" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="110" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar></w:tcPr>'; return '<w:tc>' + props + inner + '</w:tc>'; }
  function dxCellText(text, opt) { opt = opt || {}; return dxPara(dxRun(text, { bold: opt.bold, color: opt.color || '15171C', size: opt.size || DX_BODY_SIZE }), { after: opt.after == null ? 60 : opt.after }); }
  function dxTable(rows, opt) {
    opt = opt || {};
    var out = '<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="single" w:sz="6" w:color="DEE3EA"/><w:left w:val="single" w:sz="6" w:color="DEE3EA"/><w:bottom w:val="single" w:sz="6" w:color="DEE3EA"/><w:right w:val="single" w:sz="6" w:color="DEE3EA"/><w:insideH w:val="single" w:sz="4" w:color="DEE3EA"/><w:insideV w:val="single" w:sz="4" w:color="DEE3EA"/></w:tblBorders><w:tblCellMar><w:top w:w="90" w:type="dxa"/><w:left w:w="90" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/><w:right w:w="90" w:type="dxa"/></w:tblCellMar></w:tblPr>';
    rows.forEach(function (row, ri) {
      out += '<w:tr><w:trPr><w:cantSplit/>' + (ri === 0 && opt.header ? '<w:tblHeader/>' : '') + '</w:trPr>';
      row.forEach(function (cell) {
        var obj = (cell && typeof cell === 'object') ? cell : { text: cell };
        var shade = obj.shade || (ri === 0 && opt.header ? '1B2A4A' : null);
        var color = obj.color || (ri === 0 && opt.header ? 'FFFFFF' : '15171C');
        out += dxTc(dxCellText(obj.text || '', { bold: obj.bold || (ri === 0 && opt.header), color: color, size: obj.size || DX_BODY_SIZE }), { shade: shade, w: obj.w || opt.w });
      });
      out += '</w:tr>';
    });
    return out + '</w:tbl>';
  }
  function dxList(items) {
    return (items || []).map(function (item) { return dxPara(dxRun(String(item || ''), { color: '15171C' }), { after: 50 }); }).join('');
  }
  function dxDiagram(nodes) {
    var cells = nodes.map(function (n, i) {
      var txt = (i + 1) + '. ' + n.label + '\n' + (n.value || '(not written yet)');
      return { text: txt, shade: i % 2 ? 'F8FBFC' : 'FFF8F7', bold: true, size: DX_BODY_SIZE };
    });
    while (cells.length < 6) cells.push({ text: (cells.length + 1) + '. Planning note\n(not written yet)', shade: 'F8FBFC', bold: true, size: DX_BODY_SIZE });
    return dxTable([cells.slice(0, 3), cells.slice(3, 6)], { w: 3000 }) + dxPara(dxRun('Flow: System or case -> Evidence -> System action -> People affected -> Course concept -> Working claim.', { italic: true, color: '474C57' }), { before: 90, after: 80 });
  }
  function dxHeaderXml() {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">' + dxPara(dxLogoRun('rIdLogoHeader', 10, 1320000, 270000), { align: 'right', after: 40 }) + '</w:hdr>';
  }
  function dxFooterXml(assignmentName) {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:jc w:val="center"/><w:pBdr><w:top w:val="single" w:sz="4" w:space="6" w:color="DEE3EA"/></w:pBdr></w:pPr>' + dxRun(assignmentName + ' | Page ', { color: '474C57', size: 20 }) + '<w:fldSimple w:instr="PAGE"><w:r><w:rPr><w:rFonts w:ascii="' + DX_FONT + '" w:hAnsi="' + DX_FONT + '"/><w:sz w:val="20"/></w:rPr><w:t>1</w:t></w:r></w:fldSimple>' + dxRun(' of ', { color: '474C57', size: 20 }) + '<w:fldSimple w:instr="NUMPAGES"><w:r><w:rPr><w:rFonts w:ascii="' + DX_FONT + '" w:hAnsi="' + DX_FONT + '"/><w:sz w:val="20"/></w:rPr><w:t>1</w:t></w:r></w:fldSimple></w:p></w:ftr>';
  }
  function dxDoc(course, title, subLines, sections, opt) {
    opt = opt || {};
    var body = '';
    body += dxLogoPara('rIdLogo');
    body += dxPara(dxRun('SENECA POLYTECHNIC | ' + course, { bold: true, color: 'DA291C', size: 20 }), { after: 40, keep: true });
    body += dxPara(dxRun(title, { bold: true, color: '15171C', size: 32 }), { style: 'Title', after: 60, keep: true });
    (subLines || []).forEach(function (line, i) { body += dxPara(dxRun(line, { color: '474C57' }), { after: (i === subLines.length - 1 ? 160 : 40), border: (i === subLines.length - 1) }); });
    (sections || []).forEach(function (sec) {
      body += dxPara(dxRun(sec.h, { bold: true, color: 'DA291C', size: 26 }), { style: 'Heading1', before: 170, after: 60, keep: true });
      if (sec.type === 'table') body += dxTable(sec.rows || [], { header: true });
      else if (sec.type === 'diagram') body += dxDiagram(sec.nodes || []);
      else if (sec.type === 'list') body += dxList(sec.items || []);
      else if (sec.t !== undefined && sec.t !== null) { var t = (String(sec.t).trim()) ? sec.t : '(not written yet)'; body += dxPara(dxRun(t, { color: '15171C' }), { after: 80 }); }
    });
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:body>' + body + '<w:sectPr><w:headerReference w:type="default" r:id="rIdHeader"/><w:footerReference w:type="default" r:id="rIdFooter"/><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr></w:body></w:document>';
  }
  function dxStylesXml() {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:rFonts w:ascii="' + DX_FONT + '" w:hAnsi="' + DX_FONT + '" w:cs="' + DX_FONT + '"/><w:sz w:val="' + DX_BODY_SIZE + '"/><w:szCs w:val="' + DX_BODY_SIZE + '"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:rFonts w:ascii="' + DX_FONT + '" w:hAnsi="' + DX_FONT + '"/><w:sz w:val="32"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:keepLines/></w:pPr><w:rPr><w:b/><w:color w:val="DA291C"/><w:rFonts w:ascii="' + DX_FONT + '" w:hAnsi="' + DX_FONT + '"/><w:sz w:val="26"/></w:rPr></w:style></w:styles>';
  }
  function dxCoreXml(course, title) {
    var now = new Date().toISOString();
    var docTitle = title ? ((course && String(title).indexOf(course) !== 0) ? course + ' ' + title : title) : (course || 'Seneca Document');
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>' + dxEsc(docTitle) + '</dc:title><dc:creator>Raymond Peart</dc:creator><cp:lastModifiedBy>Raymond Peart</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">' + now + '</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">' + now + '</dcterms:modified></cp:coreProperties>';
  }
  var DX_CT = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/></Types>';
  var DX_RELS = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>';
  var DX_DOC_RELS = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdLogo" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/seneca-logo.png"/><Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rIdHeader" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/><Relationship Id="rIdFooter" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/></Relationships>';
  var DX_HEADER_RELS = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdLogoHeader" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/seneca-logo.png"/></Relationships>';
  var dxCrcT = null;
  function dxCrc(bytes) { if (!dxCrcT) { dxCrcT = []; for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); dxCrcT[n] = c >>> 0; } } var crc = 0xFFFFFFFF; for (var i = 0; i < bytes.length; i++) crc = (crc >>> 8) ^ dxCrcT[(crc ^ bytes[i]) & 0xFF]; return (crc ^ 0xFFFFFFFF) >>> 0; }
  function dxCat(arrs) { var len = 0, i; for (i = 0; i < arrs.length; i++) len += arrs[i].length; var out = new Uint8Array(len), off = 0; for (i = 0; i < arrs.length; i++) { out.set(arrs[i], off); off += arrs[i].length; } return out; }
  function dxU16(n) { return new Uint8Array([n & 255, (n >> 8) & 255]); }
  function dxU32(n) { return new Uint8Array([n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255]); }
  function dxZip(files) { var enc = new TextEncoder(); var chunks = [], central = [], offset = 0; files.forEach(function (f) { var nameB = enc.encode(f.name); var data = (f.data instanceof Uint8Array) ? f.data : enc.encode(f.data); var crc = dxCrc(data), size = data.length; var lfh = dxCat([dxU32(0x04034b50), dxU16(20), dxU16(0), dxU16(0), dxU16(0), dxU16(0), dxU32(crc), dxU32(size), dxU32(size), dxU16(nameB.length), dxU16(0), nameB, data]); chunks.push(lfh); central.push(dxCat([dxU32(0x02014b50), dxU16(20), dxU16(20), dxU16(0), dxU16(0), dxU16(0), dxU16(0), dxU32(crc), dxU32(size), dxU32(size), dxU16(nameB.length), dxU16(0), dxU16(0), dxU16(0), dxU16(0), dxU32(0), dxU32(offset), nameB])); offset += lfh.length; }); var centralB = dxCat(central); var eocd = dxCat([dxU32(0x06054b50), dxU16(0), dxU16(0), dxU16(files.length), dxU16(files.length), dxU32(centralB.length), dxU32(offset), dxU16(0)]); return dxCat([dxCat(chunks), centralB, eocd]); }
  function dxLogoBytes() {
    return fetch('./seneca-logo.png').then(function (r) {
      if (!r.ok) throw new Error('Seneca logo could not be loaded.');
      return r.arrayBuffer();
    }).then(function (buf) { return new Uint8Array(buf); });
  }
  function senecaDoc(course, title, subLines, sections, fn, opt) {
    opt = opt || {};
    return dxLogoBytes().then(function (logoBytes) {
      var assignmentName = opt.assignmentName || title;
      var bytes = dxZip([
        { name: '[Content_Types].xml', data: DX_CT },
        { name: '_rels/.rels', data: DX_RELS },
        { name: 'docProps/core.xml', data: dxCoreXml(course, title) },
        { name: 'word/_rels/document.xml.rels', data: DX_DOC_RELS },
        { name: 'word/_rels/header1.xml.rels', data: DX_HEADER_RELS },
        { name: 'word/media/seneca-logo.png', data: logoBytes },
        { name: 'word/styles.xml', data: dxStylesXml() },
        { name: 'word/header1.xml', data: dxHeaderXml() },
        { name: 'word/footer1.xml', data: dxFooterXml(assignmentName) },
        { name: 'word/document.xml', data: dxDoc(course, title, subLines, sections, opt) }
      ]);
      var blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fn + '.docx';
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(a.href);
      flash('Saved to your device as a Seneca branded organized notes document.');
    }).catch(function () {
      flashKeep('Export stopped: the Seneca logo could not be embedded.');
    });
  }
  function starterRows(a, L) {
    var data = starterData(a), answers = data.answers || {};
    return assignmentStarterQuestions(a, L).concat(assignmentStarterOptionalQuestions(a, L)).map(function (q) {
      return { key: q[0], question: q[1], answer: String(answers[q[0]] || '').trim() };
    });
  }
  function starterTextOutput(rows) {
    return rows.map(function (r) { return r.question + '\n' + (r.answer || '(not written yet)'); }).join('\n\n');
  }
  function starterAnswer(rows, key) {
    var hit = rows.filter(function (r) { return r.key === key; })[0];
    return hit && hit.answer ? hit.answer : '(not written yet)';
  }
  function starterTableRows(rows) {
    return [[
      { text: 'Planning question', w: 3200 },
      { text: 'Your notes', w: 4100 },
      { text: 'How to use it', w: 2300 }
    ]].concat(rows.map(function (r) {
      return [
        { text: r.question, w: 3200 },
        { text: r.answer || '(not written yet)', w: 4100 },
        { text: starterUseHint(r.key), w: 2300 }
      ];
    }));
  }
  function starterUseHint(key) {
    var hints = {
      piece: 'Use this to decide what work comes first.',
      program: 'Use this to keep the example concrete.',
      system: 'Use this as the centre of the assignment.',
      artifact: 'Use this as proof, not decoration.',
      action: 'Use this to explain the mechanism.',
      affected: 'Use this to name who is involved.',
      benefit: 'Use this to show who the system helps.',
      burden: 'Use this to show who carries the cost.',
      concept: 'Use this to connect the example to the course.',
      claim: 'Use this as the first draft of your thesis.',
      source: 'Use this to plan evidence.',
      verify: 'Use this as a research to-do item.',
      stronger: 'Use this for revision before submission.'
    };
    return hints[key] || 'Use this to strengthen the final answer.';
  }
  function starterDiagramNodes(rows) {
    return [
      { label: 'System or case', value: starterAnswer(rows, 'system') },
      { label: 'Evidence', value: starterAnswer(rows, 'artifact') },
      { label: 'System action', value: starterAnswer(rows, 'action') },
      { label: 'People affected', value: starterAnswer(rows, 'affected') },
      { label: 'Course concept', value: starterAnswer(rows, 'concept') },
      { label: 'Working claim', value: starterAnswer(rows, 'claim') }
    ];
  }
  function starterBriefRows(a, L, fmt) {
    var label = L ? (L.program || L.area) : 'General stream / no program';
    return [
      [{ text: 'Item' }, { text: 'Details' }],
      [{ text: 'Course' }, { text: 'BFS218: Racism and the Digital Age' }],
      [{ text: 'Assignment' }, { text: a.title }],
      [{ text: 'Program lens' }, { text: label }],
      [{ text: 'Blackboard posting date' }, { text: assignmentDateLabel(a.release) }],
      [{ text: 'Timing' }, { text: a.timing }],
      [{ text: 'Weight' }, { text: a.weight }],
      [{ text: 'Selected output' }, { text: fmt === 'all' ? 'Text notes, table, and visual map' : fmt.charAt(0).toUpperCase() + fmt.slice(1) }],
      [{ text: 'Official location' }, { text: 'Blackboard has the complete instructions, dropbox, due date, feedback, and grade.' }]
    ];
  }
  function starterSnapshotRows(rows) {
    return [
      [{ text: 'Part of the answer' }, { text: 'Student starting point' }],
      [{ text: 'Working claim' }, { text: starterAnswer(rows, 'claim') }],
      [{ text: 'System or case' }, { text: starterAnswer(rows, 'system') }],
      [{ text: 'Evidence or artifact' }, { text: starterAnswer(rows, 'artifact') }],
      [{ text: 'System action' }, { text: starterAnswer(rows, 'action') }],
      [{ text: 'People affected' }, { text: starterAnswer(rows, 'affected') }],
      [{ text: 'Course concept' }, { text: starterAnswer(rows, 'concept') }]
    ];
  }
  function starterEvidenceRows(rows) {
    return [
      [{ text: 'Evidence task' }, { text: 'Student notes' }, { text: 'Status' }],
      [{ text: 'Artifact or example' }, { text: starterAnswer(rows, 'artifact') }, { text: 'Check details before writing' }],
      [{ text: 'Source to find or use' }, { text: starterAnswer(rows, 'source') }, { text: 'Verify before citing' }],
      [{ text: 'What still needs checking' }, { text: starterAnswer(rows, 'verify') }, { text: 'Resolve before Blackboard submission' }]
    ];
  }
  function starterConceptRows(rows) {
    return [
      [{ text: 'Course move' }, { text: 'Student notes' }, { text: 'Use in the final answer' }],
      [{ text: 'Main concept' }, { text: starterAnswer(rows, 'concept') }, { text: 'Define it in your own words and cite the reading.' }],
      [{ text: 'What the system does' }, { text: starterAnswer(rows, 'action') }, { text: 'Show the mechanism before judging the outcome.' }],
      [{ text: 'Who benefits' }, { text: starterAnswer(rows, 'benefit') }, { text: 'Name who moves through the system more easily.' }],
      [{ text: 'Who carries the burden' }, { text: starterAnswer(rows, 'burden') }, { text: 'Name who is delayed, watched, exposed, misread, or excluded.' }]
    ];
  }
  function saveAssignmentStarterDoc() {
    var items = assignmentsData(), a = items[Math.max(0, Math.min(items.length - 1, Number(state.assignmentIndex) || 0))] || items[0], L = lensParse();
    var data = starterData(a), fmt = cleanStarterFormat(data.format), rows = starterRows(a, L), label = L ? (L.program || L.area) : 'General stream / no program';
    var sections = [
      { h: 'How to Use This Preparation Pack', t: 'This document organizes your own starting notes. It is not a finished assignment and it does not replace Blackboard. Use it to plan your example, evidence, course concept, and claim. Then write the final submission yourself in your own words.' },
      { h: 'Assignment Brief', type: 'table', rows: starterBriefRows(a, L, fmt) },
      { h: 'Strong Start Snapshot', type: 'table', rows: starterSnapshotRows(rows) }
    ];
    if (fmt === 'text' || fmt === 'all') sections.push({ h: 'Organized Notes', t: starterTextOutput(rows) });
    if (fmt === 'table' || fmt === 'all') sections.push({ h: 'Planning Table', type: 'table', rows: starterTableRows(rows) });
    if (fmt === 'diagram' || fmt === 'all') sections.push({ h: 'Visual Planning Map', type: 'diagram', nodes: starterDiagramNodes(rows) });
    sections.push(
      { h: 'Evidence and Source Tracker', type: 'table', rows: starterEvidenceRows(rows) },
      { h: 'Course Concept Tracker', type: 'table', rows: starterConceptRows(rows) },
      { h: 'Before You Write the Final Submission', type: 'list', items: [
        'Check Blackboard for the complete assignment instructions and due date.',
        'Replace any general answer with a specific artifact, source, example, or case.',
        'Use the course concept accurately and connect it to what the system does.',
        'Make sure your evidence supports the claim instead of sitting beside it.',
        'Write the final submission yourself in your own words.',
        'If you used generative AI for brainstorming, disclose the tool, date, and exact use.'
      ] }
    );
    return senecaDoc('BFS218', a.title + ' Preparation Pack', ['Racism and the Digital Age', 'Program lens: ' + label, 'IBM Plex Sans 11 pt body text'], sections, 'BFS218_' + a.id + '_organized_notes_pack', { assignmentName: a.title });
  }
  function keepActivityRoute(w, screen) {
    var cw = cleanWeek(w);
    if (cw) state.activityReturn = cw;
    state.screen = cleanScreen(screen || 'activity');
  }
  function routeActivityFromKey(key) {
    var m = /^a\|(\d+)\|/.exec(String(key || ''));
    if (m) keepActivityRoute(Number(m[1]), 'activity');
  }
  function keepAuditActivity() {
    keepActivityRoute(5, 'sandbox');
  }
  window.SOC = {
    toggleNav: function () { state.navOpen = !state.navOpen; renderKeepScroll(); },
    openNav: function () { state.navOpen = true; renderKeepScroll(); },
    closeNav: function () { state.navOpen = false; renderKeepScroll(); },
    toggleReaderLens: function () {
      state.readerLensOpen = !state.readerLensOpen;
      if (state.readerLensOpen) state.rlPanelOpen = false;
      rlDockWire(state.readerLensOpen);
      renderKeepScroll();
      announce(state.readerLensOpen ? 'Magnifier on. Text under your pointer or keyboard focus appears in large print at the bottom of the screen.' : 'Magnifier off.');
    },
    rlPanel: function () { state.rlPanelOpen = !state.rlPanelOpen; renderKeepScroll(); announce(state.rlPanelOpen ? 'Reading Lens panel open.' : 'Reading Lens panel closed.'); if (state.rlPanelOpen) { var p = document.getElementById('rl-panel'); if (p) p.focus(); } else { var b = document.querySelector('.reader-lens-btn'); if (b) b.focus(); } },
    rlPanelKey: function (e) { if (e.key === 'Escape') { e.stopPropagation(); SOC.rlPanel(); } },
    rlZoom: function (v) { rlState().zoom = v; persist(); rlApply(); renderKeepScroll(); rlRefocus(); announce('Text size ' + (v === 100 ? 'default.' : v + ' percent.')); },
    rlSpace: function () { var r = rlState(); r.space = !r.space; persist(); rlApply(); renderKeepScroll(); rlRefocus(); announce(r.space ? 'Comfortable spacing on.' : 'Comfortable spacing off.'); },
    rlFont: function () { var r = rlState(); r.font = !r.font; persist(); rlApply(); renderKeepScroll(); rlRefocus(); announce(r.font ? 'High-legibility font on.' : 'High-legibility font off.'); },
    rlTint: function (v) { rlState().tint = v; persist(); rlApply(); renderKeepScroll(); rlRefocus(); announce(v === 'none' ? 'Page tint off.' : v + ' page tint on.'); },
    rlReset: function () {
      if (rlSpeaking) rlSpeakStop();
      state.rl = {};
      if (state.readerLensOpen) { state.readerLensOpen = false; rlDockWire(false); }
      persist();
      rlApply();
      renderKeepScroll();
      rlRefocus();
      announce('All reading supports are back to default.');
    },
    rlRulerH: function (h) { var r = rlState(); r.rulerH = h; persist(); rlRulerPosition(); renderKeepScroll(); rlRefocus(); announce('Ruler band set to ' + (h === 's' ? 'narrow' : h === 'l' ? 'wide' : 'medium') + '.'); },
    rlRulerPin: function () { var r = rlState(); r.rulerPin = !r.rulerPin; persist(); rlRulerPosition(); renderKeepScroll(); rlRefocus(); announce(r.rulerPin ? 'Ruler pinned. Drag the band by hand, or use Alt with the arrow keys.' : 'Ruler released. It follows your pointer again.'); },
    rlRuler: function () { var r = rlState(); r.ruler = !r.ruler; persist(); rlApply(); renderKeepScroll(); rlRefocus(); announce(r.ruler ? 'Reading ruler on. Move your pointer, or hold Alt and press the up or down arrows.' : 'Reading ruler off.'); },
    rlSpeak: function () { rlSpeakToggle(); },
    listenMenu: function () {
      if (rlSpeaking) { rlSpeakToggle(); return; }
      state.listenOpen = !state.listenOpen;
      renderKeepScroll();
      if (state.listenOpen) {
        setTimeout(function () { var b = document.getElementById('listen-play'); if (b) b.focus(); }, 60);
        announce('Listen controls open. Pick a voice and speed if you like, then press Read this page aloud.');
      } else { announce('Listen controls closed.'); }
    },
    listenGo: function () {
      state.listenOpen = false;
      renderKeepScroll();
      rlSpeakToggle();
    },
    rlVoicesRefresh: function () {
      try { window.speechSynthesis.getVoices(); } catch (e) {}
      setTimeout(function () { if (state.rlPanelOpen || state.listenOpen) renderKeepScroll(); }, 250);
      announce('Checking for voices.');
    },
    rlVoice: function (v) { rlState().voice = String(v || ''); persist(); announce(v ? 'Voice updated. It applies from the next line read.' : 'Default voice restored.'); },
    rlRate: function (v) { rlState().rate = v; persist(); renderKeepScroll(); rlRefocus(); announce('Reading speed set.'); },
    closeReaderLens: function () { if (state.readerLensOpen) SOC.toggleReaderLens(); },
    readerLensPointerDown: function () {},
    readerLensKey: function () {},
    prev: goPrevious,
    reportProblem: function () {
      var scr = screenAnnounceText ? screenAnnounceText() : (state.screen || 'a page');
      var wk = state.screen === 'station' ? (' (Week ' + state.stationWeek + ')') : '';
      var vp = (window.innerWidth || '?') + 'x' + (window.innerHeight || '?');
      var ua = (navigator.userAgent || '').slice(0, 160);
      var course = (D.course && D.course.code) || 'Course';
      var subject = course + ' companion site: problem report';
      var body = 'Hi Professor Peart,\n\nI ran into a problem on the ' + course + ' companion website.\n\nWhat happened (please describe):\n\n\n---- details that help fix it (please leave these) ----\nPage: ' + scr + wk + '\nAddress: ' + (location.href || '') + '\nScreen: ' + vp + '\nBrowser: ' + ua + '\n';
      var href = 'mailto:raymond.peart@senecapolytechnic.ca?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      try { window.location.href = href; } catch (e) {}
      announce('Opening your email app with the page details filled in. Add what happened, then send.');
    },
    go: function (s) {
      var target = cleanScreen(s); if (target !== state.screen) rememberPrevious(); state.navOpen = false; if (target === 'library') { state.savedView = false; } if (target === 'reading') { state.rcReading = null; state.lens = 'thematic'; } if (target === 'readings') { state.galWeek = null; state.galTopic = null; } state.screen = target; focusTarget = 'soc-main'; render(); topScroll(); },
    assignPick: function (i) {
      var items = assignmentsData(), idx = Math.max(0, Math.min(items.length - 1, Number(i) || 0));
      state.assignmentIndex = idx;
      state.assignmentTab = 'assignments';
      state.screen = 'assignment-details';
      render();
      scrollToId('asg-' + items[idx].id);
    },
    openStarter: function () { if (state.screen !== 'starter') rememberPrevious(); state.screen = 'starter'; state.assignmentTab = 'assignments'; focusTarget = 'soc-main'; render(); topScroll(); },
    starterPick: function (i) { var items = assignmentsData(); state.assignmentIndex = Math.max(0, Math.min(items.length - 1, Number(i) || 0)); persist(); render(); scrollToId('asg-starter-chooser'); },
    asgJump: function (id) { scrollToId(id); },
    assignmentPage: function (t) {
      var tab = cleanAssignmentTab(t);
      var target = assignmentScreenFor(tab);
      if (target !== state.screen) rememberPrevious();
      state.screen = target;
      state.assignmentTab = tab;
      if (state.assignmentTab !== 'faq') state.assignmentFaq = null;
      focusTarget = 'soc-main';
      render();
      topScroll();
    },
    assignTab: function (t) { this.assignmentPage(t); },
    assignmentAi: function () { this.assignmentPage('ai'); },
    assignFaq: function (i) { state.assignmentFaq = (state.assignmentFaq === i) ? null : i; renderKeepScroll(); },
    viewProgram: function (v) { state.programViewField = normalizeLensRaw(v); renderKeepScroll(); },
    viewProgramAssignment: function (v) { state.programViewAssignment = v || 'all'; renderKeepScroll(); },
    assignCheck: function (id, i) { state.assignmentChecks = state.assignmentChecks || {}; state.assignmentChecks[id] = state.assignmentChecks[id] || {}; state.assignmentChecks[id][i] = !state.assignmentChecks[id][i]; renderKeepScroll(); },
    starterAnswer: function (id, key, value) { state.assignmentStarter = state.assignmentStarter || {}; state.assignmentStarter[id] = state.assignmentStarter[id] || { format: 'all', answers: {} }; state.assignmentStarter[id].answers = state.assignmentStarter[id].answers || {}; state.assignmentStarter[id].answers[key] = value; persist(); },
    starterFormat: function (id, fmt) { state.assignmentStarter = state.assignmentStarter || {}; state.assignmentStarter[id] = state.assignmentStarter[id] || { format: 'all', answers: {} }; state.assignmentStarter[id].format = cleanStarterFormat(fmt); persist(); renderKeepScroll(); },
    clearStarter: function (id) { state.assignmentStarter = state.assignmentStarter || {}; state.assignmentStarter[id] = { format: 'all', answers: {} }; persist(); renderKeepScroll(); flash('Starter answers cleared.'); },
    saveStarter: function () { saveAssignmentStarterDoc(); },
    skipStarter: function () { flashKeep('No problem. Stay with the brief and return when you want a preparation document.'); },
    videoWeek: function (w) { state.videoWeek = w || 'all'; render(); topScroll(); },
    mediaKind: function (k) { state.mediaKind = k || 'all'; render(); topScroll(); },
    careerLens: function () { if (state.screen !== 'career') rememberPrevious(); state.screen = 'career'; focusTarget = 'soc-main'; render(); scrollToId('career-sel'); },
    careerChoices: function () { if (state.screen !== 'career') rememberPrevious(); state.screen = 'career'; focusTarget = 'soc-main'; render(); scrollToId('career-choices'); },
    assignmentLens: function (v) { state.careerField = v; persist(); renderKeepScroll(); },
    careerField: function (v) { state.careerField = v; persist(); render(); topScroll(); },
    lensOff: function () { state.careerField = ''; persist(); render(); },
    careerReflect: function (k, v) { state.careerReflect = state.careerReflect || {}; state.careerReflect[k] = v; persist(); },
    station: function (w) { w = cleanWeek(w) || w; if (state.screen !== 'station' || state.stationWeek !== w) rememberPrevious(); state.navOpen = false; state.stationWeek = w; state.journeyWeek = w; state.activityReturn = null; state.screen = 'station'; trackVisit(w); persist(); focusTarget = 'soc-main'; render(); topScroll(); },
    jumpWeek: function (w, part) { w = cleanWeek(w) || w; if (state.screen !== 'station' || state.stationWeek !== w) rememberPrevious(); state.navOpen = false; state.stationWeek = w; state.journeyWeek = w; state.activityReturn = null; state.screen = 'station'; trackVisit(w); persist(); focusTarget = 'soc-main'; render(); scrollWeekPart(part); },
    startActivity: function (s, w) { rememberPrevious(); keepActivityRoute(w, s); focusTarget = 'soc-main'; render(); topScroll(); },
    goWeek: function (s, w) { if (state.screen !== cleanScreen(s) || state.cardWeek !== w) rememberPrevious(); state.cardWeek = w; state.screen = cleanScreen(s); focusTarget = 'soc-main'; render(); topScroll(); },
    galWeek: function (w) { var m = document.getElementById('soc-main'); var y = m ? m.scrollTop : 0; state.galWeek = (state.galWeek === w) ? null : w; render(); var m2 = document.getElementById('soc-main'); if (m2) m2.scrollTop = y; },
    galTopic: function (t) { var m = document.getElementById('soc-main'); var y = m ? m.scrollTop : 0; state.galTopic = (state.galTopic === t) ? null : t; render(); var m2 = document.getElementById('soc-main'); if (m2) m2.scrollTop = y; },
    galClear: function () { state.galWeek = null; state.galTopic = null; render(); },
    playVideo: function (el, id) { var box = el.closest ? el.closest('.rgvideo, .vid-frame') : el.parentNode; if (box) { box.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1" referrerpolicy="strict-origin-when-cross-origin" title="Scholar talk" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe>'; } },
    back: function () { if (state.screen !== 'library') rememberPrevious(); state.screen = 'library'; focusTarget = 'soc-main'; render(); var m = document.getElementById('soc-main'); if (m) m.scrollTop = state.libScroll || 0; },
    open: function (id) { rememberPrevious(); var m = document.getElementById('soc-main'); if (m) state.libScroll = m.scrollTop; state.screen = 'detail'; state.detailId = id; focusTarget = 'soc-main'; render(); topScroll(); },
    layout: function (l) { state.layout = l; persist(); render(); },
    sort: function (s) { state.sort = s; render(); },
    search: function (v) { state.search = v; refocusSearch = true; render(); },
    clearSearch: function () { state.search = ''; render(); },
    type: function (t) { state.activeTypes = (state.activeTypes.length === 1 && state.activeTypes[0] === t) ? [] : [t]; render(); },
    week: function (w) { if (state.screen !== 'library' || state.activeWeek !== w) rememberPrevious(); state.activeWeek = (state.activeWeek === w) ? null : w; state.savedView = false; state.screen = 'library'; focusTarget = 'soc-main'; render(); topScroll(); },
    clearFilters: function () { state.activeTypes = []; state.activeWeek = null; state.search = ''; state.savedView = false; render(); },
    dismissIntro: function () { state.introOpen = false; persist(); render(); },
    save: function (id) { var a = state.saved, i = a.indexOf(id); var msg; if (i >= 0) { a.splice(i, 1); msg = 'Removed from saved.'; } else { a.push(id); msg = 'Saved to your shelf.'; } persist(); flash(msg); },
    compare: function (id) { var a = state.compareIds, i = a.indexOf(id); if (i >= 0) { a.splice(i, 1); persist(); flash('Removed from compare.'); } else { if (a.length >= 3) { flash('Compare holds three at a time.'); return; } a.push(id); persist(); flash('Added to compare.'); } render(); },
    synCopy: function () {
      var el = document.getElementById('syn-body');
      var txt = el ? el.textContent.replace(/\s+\n/g, '\n').trim() : '';
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(txt).then(function () { announce('Synthesis copied to your clipboard.'); }, function () { announce('Copy failed. Select the text and copy it manually.'); }); }
      else { announce('Copy is not available in this browser. Select the text to copy it.'); }
    },
    synPrint: function () {
      var el = document.getElementById('syn-body');
      var txt = el ? el.innerHTML : '';
      var w = window.open('', '_blank');
      if (!w) { announce('Allow pop-ups to print, or use Copy instead.'); return; }
      w.document.write('<!doctype html><meta charset=utf-8><title>Synthesis</title><body style="font-family:Georgia,serif;max-width:640px;margin:40px auto;padding:0 20px;color:#15171C;line-height:1.6"><h1 style="font-size:1.2rem">How these readings connect</h1>' + txt + '<script>window.onload=function(){window.print();}<\/script></body>');
      w.document.close();
    },
    synSave: function () {
      var el = document.getElementById('syn-body');
      var txt = el ? el.textContent.replace(/\s+\n/g, '\n').trim() : '';
      if (!txt) { announce('Nothing to save yet.'); return; }
      state.cmpNotes = state.cmpNotes || {};
      state.cmpNotes['saved-synthesis'] = txt;
      persist();
      renderKeepScroll();
      announce('Saved to your notes on this device. It will be here when you come back in this browser.');
    },
    clearCompare: function () { state.compareIds = []; state.showSynthesis = false; render(); },
    synthesize: function () { state.showSynthesis = true; render(); },
    playWalk: function (w) { walkOpen(cleanWeek(w) || w); },
    walkNav: function (dir) { if (!_walk) return; var n = Math.max(0, Math.min(_walk.slides.length - 1, _walk.i + dir)); if (n === _walk.i) return; walkSpeakStop(); _walk.i = n; _walk.focusSlide = true; walkMount(); announce('Slide ' + (n + 1) + ' of ' + _walk.slides.length + '.'); },
    walkGoto: function (k) { if (!_walk) return; walkSpeakStop(); _walk.i = Math.max(0, Math.min(_walk.slides.length - 1, k)); _walk.focusSlide = true; walkMount(); announce('Slide ' + (_walk.i + 1) + ' of ' + _walk.slides.length + '.'); },
    walkClose: function () { walkCloseDom(); _walk = null; },
    walkGoWeek: function () { var w = _walk && _walk.week; walkCloseDom(); _walk = null; if (w) SOC.station(w); },
    walkPanel: function () { if (!_walk) return; _walk.panel = !_walk.panel; walkMount(); announce(_walk.panel ? 'Accessibility settings opened.' : 'Accessibility settings closed.'); },
    walkSetting: function (key, value) { var p = walkPrefs(); if (key === 'theme') p.walkTheme = String(value); else if (key === 'size') p.walkSize = Number(value); else if (key === 'font') p.walkFont = !!value; else if (key === 'motion') p.walkMotion = !!value; persist(); walkMount(); announce('Walkthrough display updated.'); },
    walkTheme: function () { if (!_walk) return; _walk.panel = true; walkMount(); },
    walkSpeak: function () { walkSpeakToggle(); },
    walkStop: function () { walkSpeakStop(); announce('Voice narration stopped.'); },
    walkRate: function (v) { walkPrefs().walkRate = Number(v); persist(); walkSpeakStop(); announce('Narration speed updated.'); },
    walkVoice: function (v) { walkPrefs().voice = String(v || ''); persist(); walkSpeakStop(); announce(v ? 'Narration voice updated.' : 'Default narration voice restored.'); },
    walkFig: function (op) {
      if (!_walk || !_walk.fig) return;
      if (op === 'zin') _walk.fig.scale = Math.min(6, _walk.fig.scale * 1.2);
      else if (op === 'zout') _walk.fig.scale = Math.max(0.4, _walk.fig.scale / 1.2);
      else if (op === 'rl') _walk.fig.rot -= 90;
      else if (op === 'rr') _walk.fig.rot += 90;
      else { _walk.fig = { scale: 1, rot: 0, tx: 0, ty: 0 }; }
      walkFigApply();
    },
    hideSynthesis: function () { state.showSynthesis = false; render(); },
    setLens: function (l) { state.lens = l; render(); },
    rcPick: function (id) { state.rcReading = id; state.lens = 'thematic'; persist(); render(); topScroll(); },
    rcClear: function () { state.rcReading = null; render(); topScroll(); },
    rcNote: function (k, v) { state.rcNotes[k] = v; persist(); },
    wkCheck: function (k, o) {
      if (state.wkCheck[k] === o) delete state.wkCheck[k]; else state.wkCheck[k] = o;
      persist();
      var el = document.getElementById('opts-' + k); if (el) el.innerHTML = wkOptBtns(k);
      var parts = k.split('|'), w = +parts[1], d = weekData(w);
      refreshWeekChecks(w, d);
    },
    wkClear: function (w, phase) {
      var d = weekData(w); if (!d) return;
      d.checks.forEach(function (c, i) { delete state.wkCheck[phase + '|' + w + '|' + i]; });
      persist(); refreshWeekChecks(w, d);
    },
    wkReflect: function (w, v) { state.wkReflect[w] = v; persist(); },
    wkStep: function (w, i) {
      state.wkSteps = state.wkSteps || {};
      var s = state.wkSteps[w] = state.wkSteps[w] || {};
      s[i] = !s[i]; persist();
      var btns = document.querySelectorAll('.wk-steps .wk-step'), btn = btns[i];
      if (btn) { var on = !!s[i]; btn.classList.toggle('on', on); btn.setAttribute('aria-pressed', on ? 'true' : 'false'); var box = btn.querySelector('.wk-step-box'); if (box) box.innerHTML = on ? '&#10003;' : (i + 1); }
      var cnt = document.getElementById('wk-drive-count-' + w); if (cnt) { var n = 0, k; for (k in s) { if (s[k]) n++; } cnt.textContent = n + ' of ' + btns.length + ' done'; }
    },
    wkNote: function (k, v) { state.wkNotes = state.wkNotes || {}; state.wkNotes[k] = v; persist(); },
    clearMyWork: function () {
      if (!window.confirm('Remove all notes, check answers, and settings saved by this site in this browser? Downloaded files are not affected.')) return;
      try {
        var prefix = SKEY; /* full site-scoped key: never touch another course site's saves on the shared github.io origin */
        Object.keys(localStorage).forEach(function (k) { if (k.indexOf(prefix) === 0) localStorage.removeItem(k); });
      } catch (e) {}
      location.reload();
    },
    expPick: function (w, i) {
      state.exp[w] = state.exp[w] || {};
      if (state.exp[w].ran) return;
      state.exp[w].pick = i;
      var EX = window.BFS218_EXPERIMENTS || {};
      state.exp[w].lens = ((EX[w] || {}).options[i] || {}).lens;
      persist(); renderKeepScroll();
      announce('Prediction chosen. Run the experiment when you are ready.');
    },
    expRun: function (w) {
      state.exp[w] = state.exp[w] || {};
      if (typeof state.exp[w].pick !== 'number') return;
      var reduced = false;
      try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
      var finish = function () {
        expRunning = 0;
        state.exp[w].ran = true;
        state.visualView = state.visualView || {};
        state.visualView['activity|' + w] = 'explain';
        persist(); renderKeepScroll();
        announce('Experiment complete. Read what happened, then the mirror on your prediction.');
      };
      if (reduced) { finish(); return; }
      expRunning = w;
      renderKeepScroll();
      announce('Running the experiment.');
      setTimeout(finish, 1100);
    },
    expReset: function (w) {
      state.exp[w] = {};
      persist(); renderKeepScroll();
      announce('Experiment reset. Choose a new prediction.');
    },
    wkColl: function (id) {
      var nowColl = wkOpenHas(id);
      wkOpenSet(id, nowColl ? false : true);
      persist();
      var sec = document.getElementById(id);
      if (sec) {
        sec.classList.toggle('wk-collapsed', nowColl);
        var b = sec.querySelector('.wk-coll-btn');
        if (b) {
          b.setAttribute('aria-expanded', String(!nowColl));
          b.setAttribute('aria-label', nowColl ? 'Show this section' : 'Hide this section');
          b.textContent = nowColl ? '+' : '\u2212';
        }
      }
      if (!nowColl) { wkCapEnforce(id); persist(); }
      announce(nowColl ? 'Section hidden. The heading stays so you can bring it back.' : 'Section shown.');
    },
    wkCollAll: function (w, mode) {
      var secs = document.querySelectorAll('#soc-main section[id^="wk-"]');
      Array.prototype.forEach.call(secs, function (sec) {
        if (sec.id === 'wk-ov' || !sec.querySelector('h2.wk-sec')) return;
        wkOpenSet(sec.id, mode ? false : true);
      });
      persist();
      renderKeepScroll();
      announce(mode ? 'All sections collapsed to their headings.' : 'All sections expanded.');
    },
    nameSave: function (ev) {
      if (ev && ev.preventDefault) ev.preventDefault();
      var el = document.getElementById('sc-name');
      var v = el ? String(el.value || '').replace(/[<>&"]/g, '').trim().slice(0, 40) : '';
      if (!v) { announce('Type a name first, or skip this. It is optional.'); return false; }
      state.studentName = v;
      persist();
      render();
      announce('Saved. Your name stays in this browser only.');
      return false;
    },
    nameClear: function () {
      state.studentName = '';
      persist();
      render();
      announce('Name removed.');
    },
    camCtl: function (ev, op, dir) {
      if (ev && ev.preventDefault) ev.preventDefault();
      var host = ev && ev.currentTarget && ev.currentTarget.closest ? ev.currentTarget.closest('.wk-model-shell') : null;
      var cv = host ? host.querySelector('canvas[data-topic-model]') : null;
      if (!cv || !cv.__camApi) return false;
      if (op === 'zoom') cv.__camApi.zoom(dir);
      else if (op === 'spin') cv.__camApi.spin(dir);
      else cv.__camApi.reset();
      return false;
    },
    visualStep: function (ev, w, context, dir) {
      var order = context === 'activity' ? ['predict', 'try', 'explain'] : ['observe', 'path', 'risk'];
      var cur = order.indexOf(visualViewFor(w, context));
      var nxt = Math.max(0, Math.min(order.length - 1, (cur < 0 ? 0 : cur) + dir));
      return SOC.visualView(ev, w, context, order[nxt]);
    },
    visualView: function (ev, w, context, v) {
      if (typeof ev === 'number') { v = context; context = w; w = ev; ev = null; }
      if (ev && ev.preventDefault) ev.preventDefault();
      if (ev && ev.stopPropagation) ev.stopPropagation();
      var focusSel = null;
      if (ev && ev.currentTarget) {
        var cls = String(ev.currentTarget.className || '');
        if (cls.indexOf('wk-step-next') >= 0) focusSel = '.wk-step-next';
        else if (cls.indexOf('wk-step-prev') >= 0) focusSel = '.wk-step-prev';
      }
      var m = document.getElementById('soc-main'), top = m ? m.scrollTop : 0;
      var wy = window.pageYOffset || 0;
      state.visualView = state.visualView || {};
      state.visualView[(context || 'week') + '|' + w] = v;
      if (context === 'activity') keepActivityRoute(w, 'activity');
      render();
      var restore = function () { var m2 = document.getElementById('soc-main'); if (m2) m2.scrollTop = top; window.scrollTo(0, wy); };
      restore();
      if (window.requestAnimationFrame) window.requestAnimationFrame(restore);
      setTimeout(restore, 0);
      setTimeout(restore, 80);
      if (focusSel) setTimeout(function () {
        var fb = document.querySelector(focusSel + ':not(:disabled)') || document.querySelector(focusSel);
        if (fb && fb.focus) { try { fb.focus({ preventScroll: true }); } catch (e2) { fb.focus(); } }
      }, 90);
      return false;
    },
    actPick: function (key, idx) { var m = document.getElementById('soc-main'), top = m ? m.scrollTop : 0; routeActivityFromKey(key); state.act[key] = idx; state.actResult = state.actResult || {}; state.actResult[key] = idx; persist(); render(); var m2 = document.getElementById('soc-main'); if (m2) m2.scrollTop = top; },
    actToggle: function (key) { var m = document.getElementById('soc-main'), top = m ? m.scrollTop : 0; routeActivityFromKey(key); var val = !state.act[key]; state.act[key] = val; state.actResult = state.actResult || {}; state.actResult[key] = val; persist(); render(); var m2 = document.getElementById('soc-main'); if (m2) m2.scrollTop = top; },
    actAdd: function (key, idx) { var m = document.getElementById('soc-main'), top = m ? m.scrollTop : 0; routeActivityFromKey(key); var arr = state.act[key] || []; if (arr.indexOf(idx) < 0) arr.push(idx); state.act[key] = arr; state.actResult = state.actResult || {}; state.actResult[key] = arr.slice(); persist(); render(); var m2 = document.getElementById('soc-main'); if (m2) m2.scrollTop = top; },
    actLabPick: function (key, idx, max) { var m = document.getElementById('soc-main'), top = m ? m.scrollTop : 0; routeActivityFromKey(key); var arr = state.act[key] || [], p = arr.indexOf(idx); if (p >= 0) arr.splice(p, 1); else { if (arr.length >= max) arr.shift(); arr.push(idx); } state.act[key] = arr; state.actResult = state.actResult || {}; state.actResult[key] = arr.slice(); persist(); render(); var m2 = document.getElementById('soc-main'); if (m2) m2.scrollTop = top; },
    saveWeek: function (w) {
      var d = weekData(w); if (!d) { flash('Open a week first.'); return; }
      var sections = [
        { h: 'Week Snapshot', t: d.purpose || d.overview || weekTitle(w) },
        { h: 'Readings Notes', t: readingsDoc(w, d) },
        { h: 'A Visual Overview Notes', t: visualDoc(w, d) },
        { h: 'Walkthrough Notes', t: walkthroughDoc(w, d) },
        { h: 'Activity Notes and Results', t: 'Activity: ' + ((d.activity && d.activity.title) || 'This week\'s activity') + '\nResult: ' + activitySummary(w, d) + '\n\nYour notes:\n' + docBlank(wkNoteValue(w, 'activity')) },
        { h: 'Knowledge Check Results', t: kcDoc(w) },
        { h: 'Reading Comprehension Practice Results', t: readingCompDoc(w, d) },
        { h: 'Before and After Understanding Check', t: checksDoc(w, d) },
        { h: 'Scholar Media Notes', t: mediaDoc(w) },
        { h: 'Reflection', t: docBlank(state.wkReflect[w]) },
        { h: 'What I Still Need to Revisit', t: revisitDoc(w, d) },
        { h: 'Submission Checklist', t: checklistDoc(w, d) }
      ];
      senecaDoc('BFS218', 'BFS218 Week ' + w + ': ' + weekTitle(w), ['Racism and the Digital Age', 'Your weekly notes and private practice results'], sections, 'BFS218_Week' + w + '_weekly_notes');
    },
    mediaNote: function (k, v) { state.mediaNotes = state.mediaNotes || {}; state.mediaNotes[k] = v; persist(); },
    rcReveal: function (k) { var m = document.getElementById('soc-main'); var top = m ? m.scrollTop : 0; state.revealed[k] = !state.revealed[k]; render(); var m2 = document.getElementById('soc-main'); if (m2) m2.scrollTop = top; },
    sgNote: function (k, v) { state.sgNotes = state.sgNotes || {}; state.sgNotes[k] = v; persist(); },
    sgCompare: function (k, w) { state.sgShow = state.sgShow || {}; state.sgShow[k] = !state.sgShow[k]; var sec = document.getElementById('wk-sg'); if (sec) sec.outerHTML = sgSection(w).html; },
    sgFlip: function (k, w) { state.sgFlip = state.sgFlip || {}; state.sgFlip[k] = !state.sgFlip[k]; var sec = document.getElementById('wk-sg'); if (sec) sec.outerHTML = sgSection(w).html; },
    sgTickRung: function (k, w) { state.sgTick = state.sgTick || {}; state.sgTick[k] = true; persist(); var sec = document.getElementById('wk-sg'); if (sec) sec.outerHTML = sgSection(w).html; },
    mcPick: function (k, i) {
      if (state.mcSel[k] === i) { delete state.mcSel[k]; } else { state.mcSel[k] = i; }
      persist();
      var kcm = /^wk(\d+)\|kc/.exec(k);
      if (kcm) {
        var sec = document.getElementById('wk-kc');
        if (sec) { sec.outerHTML = kcSection(Number(kcm[1])).html; return; }
      }
      var m = document.getElementById('soc-main'); var top = m ? m.scrollTop : 0; var wy = window.scrollY;
      render();
      var m2 = document.getElementById('soc-main'); if (m2) m2.scrollTop = top;
      window.scrollTo(0, wy);
    },
    kcVer: function (w, v) { state.kcVersion = state.kcVersion || {}; state.kcVersion[w] = v; persist(); var sec = document.getElementById('wk-kc'); if (sec) { sec.outerHTML = kcSection(w).html; } },
    kcClear: function (w, v) { var pre = 'wk' + w + '|kc' + v + '|'; [state.mcSel, state.mcConf].forEach(function (map) { if (!map) return; Object.keys(map).forEach(function (k) { if (k.indexOf(pre) === 0) delete map[k]; }); }); if (state.kcReveal) delete state.kcReveal[w + '|' + v]; persist(); var sec = document.getElementById('wk-kc'); if (sec) { sec.outerHTML = kcSection(w).html; } },
    mcConf: function (k, c, w) { state.mcConf = state.mcConf || {}; if (state.mcConf[k] === c) delete state.mcConf[k]; else state.mcConf[k] = c; persist(); var sec = document.getElementById('wk-kc'); if (sec) sec.outerHTML = kcSection(w).html; },
    mcPickSel: function (k, v) { v = Number(v); if (isNaN(v) || v < 0) delete state.mcSel[k]; else state.mcSel[k] = v; persist(); var kcm = /^wk(\d+)\|kc/.exec(k); if (kcm) { var sec = document.getElementById('wk-kc'); if (sec) { sec.outerHTML = kcSection(Number(kcm[1])).html; return; } } render(); },
    kcShow: function (w) { var v = (state.kcVersion && state.kcVersion[w]) || 0; state.kcReveal = state.kcReveal || {}; state.kcReveal[w + '|' + v] = true; persist(); var sec = document.getElementById('wk-kc'); if (sec) sec.outerHTML = kcSection(w).html; },
    kcShortText: function (k, v) { state.kcShort = state.kcShort || {}; state.kcShort[k] = v; persist(); },
    kcShortReveal: function (k, w) { state.kcShortShown = state.kcShortShown || {}; state.kcShortShown[k] = !state.kcShortShown[k]; var sec = document.getElementById('wk-kc'); if (sec) sec.outerHTML = kcSection(w).html; },
    kcShortRate: function (k, r, w) { state.kcShortRate = state.kcShortRate || {}; state.kcShortRate[k] = r; persist(); var sec = document.getElementById('wk-kc'); if (sec) sec.outerHTML = kcSection(w).html; },
    mcReset: function (id) { var m = document.getElementById('soc-main'); var top = m ? m.scrollTop : 0; var keep = {}; Object.keys(state.mcSel).forEach(function (k) { if (k.indexOf(id + '|mc|') !== 0) keep[k] = state.mcSel[k]; }); state.mcSel = keep; persist(); render(); var m2 = document.getElementById('soc-main'); if (m2) m2.scrollTop = top; },
    saveReadingNotes: function () {
      var r = state.rcReading && rec(state.rcReading); if (!r) { flash('Pick a reading first.'); return; }
      var cc = (D.course && D.course.code) || 'Course';
      var L = (LENSES[state.lens] || LENSES.thematic).label, qs = RC_QUESTIONS[state.lens] || RC_QUESTIONS.thematic;
      var sections = qs.map(function (q, i) { return { h: q, t: (state.rcNotes[r.id + '|' + state.lens + '|' + i] || '').trim() }; });
      var mcItems = MC[r.id] || [];
      if (mcItems.length) {
        var ans = 0, cor = 0, miss = [];
        mcItems.forEach(function (m, mi) { var s = state.mcSel[r.id + '|mc|' + mi]; if (s !== undefined && s !== null) { ans++; if (s === m.answer) cor++; else miss.push(mi + 1); } });
        var head = 'Score: ' + cor + ' of ' + mcItems.length + ' correct' + (ans < mcItems.length ? ' (' + ans + ' of ' + mcItems.length + ' answered).' : '.');
        if (ans === mcItems.length) {
          var b = rcBand(cor, mcItems.length); head += '\nWhere you are: ' + b.label + '. ' + b.msg;
          var prof = rcSkillProfile(r.id, mcItems);
          if (prof.has) {
            if (prof.strengths.length) { var cb = (prof.strengths.indexOf(RC_SKILLS.argument) >= 0 && r.coreIdea) ? ' You have the central point, that ' + lcFirst(String(r.coreIdea).replace(/\s*\.?\s*$/, '')) + '.' : ''; head += '\nYour strengths: you read ' + listJoin(prof.strengths) + ' well.' + cb; }
            if (prof.opps.length) { head += '\nAreas of opportunity:'; prof.opps.forEach(function (o) { head += '\n  ' + ucFirst(o.label) + '. ' + (o.whys.length ? o.whys.join(' ') : 'Go back to this in the reading and read for it directly.'); }); }
          } else if (miss.length) head += '\nLook again at ' + numList(miss) + '.';
        }
        sections.push({ h: 'Check your understanding', t: head });
        mcItems.forEach(function (m, mi) {
          var sel = state.mcSel[r.id + '|mc|' + mi];
          var done = (sel !== undefined && sel !== null);
          var chosen = done ? (m.options[sel] || '') : '(not answered)';
          var verdict = !done ? 'Not answered.' : (sel === m.answer ? 'Correct.' : 'Not quite.');
          var t = 'Your answer: ' + chosen + '\n' + verdict;
          if (done && sel !== m.answer) t += ' The correct answer is: ' + (m.options[m.answer] || '') + '.';
          if (m.why) t += '\n' + m.why;
          sections.push({ h: (mi + 1) + '. ' + m.q, t: t });
        });
      }
      senecaDoc(cc, 'Build Your Reading Comprehension', ['Reading: ' + r.title + ' by ' + r.authors, 'Lens: ' + L], sections, cc + '_reading_comprehension');
    },
    saveStudio: function () {
      var cc = courseCode(), w = focusWeek(state.cardWeek), recs = recordsForWeek(w), sections = [], sub = [], sel = state.mcSel[cc + '|studio|' + w], checkQ = '';
      if (cc === 'SOC122') {
        var west = firstWhere(recs, function (r) { return r.eye === 'western'; }), ind = firstWhere(recs, function (r) { return r.eye === 'indigenous'; });
        if (!ind) { flash('Open a week first.'); return; }
        sub = ['Self-Check Studio: Two attributed eyes', 'Week ' + w];
        if (west) sections.push({ h: 'Western eye', t: west.authors + ', ' + west.title + ' (' + west.year + ')\n' + west.coreIdea });
        sections.push({ h: 'Indigenous eye', t: ind.authors + ', ' + ind.title + ' (' + ind.year + ')\n' + ind.coreIdea });
        sections.push({ h: 'Two-Eyed Seeing practice', t: 'Two-Eyed Seeing (Etuaptmumk), named by Mi\'kmaw Elder Albert Marshall. The bridge is the practice you bring, not one the app writes.' });
        checkQ = 'What is most at risk if this is treated as only a Western research-methods question?';
      } else if (cc === 'PSY355') {
        var rp = recs[0] || D.records[0]; if (!rp) { flash('Open a week first.'); return; }
        sub = ['Self-Check Studio: Evidence Transfer Lab', 'Week ' + w];
        sections.push({ h: 'Claim', t: rp.authors + ' (' + rp.year + '): ' + rp.coreIdea });
        sections.push({ h: 'Boundary', t: 'What this does not prove: do not turn it into a rule for every learner; check context, supports, workload, strategy, and evidence first.' });
        sections.push({ h: 'Academic transfer', t: 'One course task, one support, one study strategy, and one sign the strategy is working. No clinical framing.' });
        checkQ = 'Which next step applies the idea responsibly, without blaming the student or overstating the reading?';
      } else if (cc === 'BFS218') {
        var rb = recs[0] || D.records[0]; if (!rb) { flash('Open a week first.'); return; }
        sub = ['Self-Check Studio: Accountability Chain Lab', 'Week ' + w];
        sections.push({ h: 'Source anchor', t: rb.authors + ': ' + rb.coreIdea });
        sections.push({ h: 'Accountability chain', t: 'System or technology, then design or data or default, then the racialized mechanism, then harm and the institutions responsible (not one bad actor), then a response grounded in the readings.' });
        checkQ = 'Which option names the racialized mechanism, not only the outcome or intent?';
      } else { flash('Self-Check Studio save is for the course sites.'); return; }
      if (sel !== undefined && sel !== null) sections.push({ h: 'Quick check', t: 'Q: ' + checkQ + '\nYour answer was ' + (sel === 0 ? 'the grounded one. Correct.' : 'not the grounded one. Look again at what the reading actually claims.') });
      senecaDoc(cc || 'Course', 'Self-Check Studio', sub, sections, (cc || 'Course') + '_self_check_studio');
    },
    runAudit: function () { var m = document.getElementById('soc-main'), top = m ? m.scrollTop : 0; keepAuditActivity(); state.auditRun = true; state.auditSystem = 0; state.auditedSystems = state.auditedSystems || {}; state.auditedSystems[GS.systems[0].id] = true; if (!state.auditSlice) state.auditSlice = 'overall'; render(); var m2 = document.getElementById('soc-main'); if (m2) m2.scrollTop = top; },
    auditSystem: function (idx) { var m = document.getElementById('soc-main'), top = m ? m.scrollTop : 0; keepAuditActivity(); state.auditRun = true; state.auditSystem = idx; state.auditedSystems = state.auditedSystems || {}; state.auditedSystems[auditSys().id] = true; if (!state.auditSlice) state.auditSlice = 'overall'; render(); var m2 = document.getElementById('soc-main'); if (m2) m2.scrollTop = top; },
    nextSystem: function () { var m = document.getElementById('soc-main'), top = m ? m.scrollTop : 0; keepAuditActivity(); state.auditSystem = ((state.auditSystem || 0) + 1) % GS.systems.length; state.auditedSystems = state.auditedSystems || {}; state.auditedSystems[auditSys().id] = true; render(); var m2 = document.getElementById('soc-main'); if (m2) m2.scrollTop = top; },
    auditSlice: function (s) { var m = document.getElementById('soc-main'), top = m ? m.scrollTop : 0; keepAuditActivity(); state.auditSlice = s; render(); var m2 = document.getElementById('soc-main'); if (m2) m2.scrollTop = top; },
    auditView: function (v) { var m = document.getElementById('soc-main'), top = m ? m.scrollTop : 0; keepAuditActivity(); state.auditView = v || 'errors'; render(); var m2 = document.getElementById('soc-main'); if (m2) m2.scrollTop = top; },
    saveSandbox: function () {
      var gs = rec('buolamwini2018'), sel = state.mcSel['BFS218|sandbox'];
      var sections = [
        { h: 'Systems audited', t: 'Three commercial facial-analysis systems, audited against a benchmark balanced by gender and skin type (Buolamwini and Gebru, Gender Shades, 2018): IBM, Microsoft, and Face++.' },
        { h: 'What the audit found', t: 'Every system failed darker-skinned women the most: 34.7 percent (IBM), 34.5 percent (Face++), and 20.8 percent (Microsoft), against near-zero error for lighter-skinned men. Not one bad product, an industry pattern.' },
        { h: 'Why the bias was hidden', t: 'Overall accuracy and single-axis tests (gender alone, or skin type alone) averaged the harm away. Only looking at gender and skin type together revealed it. That is intersectionality (Crenshaw) and the coded gaze (Buolamwini).' },
        { h: 'Harm and accountability', t: 'These systems are sold as neutral, and they land hardest where they are deployed, in policing and at borders (the OPC and Robertson readings). Accountability sits with the institutions that build, buy, and deploy them, not one programmer. This is the New Jim Code (Benjamin); a response can be grounded in the resistance and design-justice readings (Tanksley, Costanza-Chock).' }
      ];
      if (sel !== undefined && sel !== null) sections.push({ h: 'Quick check', t: 'You named the harm as ' + (sel === 0 ? 'the New Jim Code, built into design and data. Correct.' : 'intent or a one-off bug. Look again: the failure came from how the system was built and tested, not from intent or chance.') });
      senecaDoc('BFS218', 'Bias Audit', ['Audit the coded gaze', (gs ? gs.title : 'Gender Shades') + ' (Buolamwini and Gebru, 2018)'], sections, 'BFS218_bias_audit');
    },
    read: function (id) { var r = rec(id); var u = r && readUrl(r); if (u) { window.open(u, '_blank', 'noopener'); } else { state.screen = 'detail'; state.detailId = id; focusTarget = 'soc-main'; render(); topScroll(); } },
    source: function (id) { var r = rec(id); var u = r && sourceUrl(r); if (u) window.open(u, '_blank', 'noopener'); },
    openSaved: function () { state.screen = 'library'; state.activeTypes = []; state.activeWeek = null; state.search = ''; state.savedView = state.saved.length > 0; flash(state.saved.length ? 'Your saved shelf.' : 'Nothing saved yet. Tap the bookmark on any reading.'); topScroll(); },
    cardWeek: function (v) { state.cardWeek = (v === '' ? null : parseInt(v, 10)); render(); },
    glossWeek: function (v) { state.glossWeek = v; var o = document.getElementById('soc-gout'); if (o) o.innerHTML = glossaryByWeek(v); },
    glossSearch: function (v) { state.glossSearch = v; var o = document.getElementById('soc-gsearchout'); if (o) o.innerHTML = glossarySearchHTML(v); },
    glossWeekGo: function (w) { state.glossWeek = String(w); var sel = document.getElementById('soc-gweek'); if (sel) sel.value = String(w); var o = document.getElementById('soc-gout'); if (o) { o.innerHTML = glossaryByWeek(String(w)); o.scrollIntoView({ behavior: 'smooth', block: 'start' }); } },
    flip: function (el) { var c = el && (el.classList && el.classList.contains('flip') ? el : (el.closest ? el.closest('.flip') : null)); if (c) c.classList.toggle('flipped'); },
  };

  state.wkOpen = {};
  render();
  try { if (location.search) history.replaceState(viewSnapshot(), '', location.pathname + location.hash); } catch (e) {}
  window.addEventListener('popstate', function (e) {
    var __ov = document.getElementById('walk-overlay');
    if (__ov) { try { walkCloseDom(); _walk = null; } catch (er) {} try { history.pushState(viewSnapshot(), ''); } catch (er) {} return; }
    __fromPop = true;
    try { restoreView(e.state && typeof e.state === 'object' && e.state.screen ? e.state : { screen: 'journey' }); } catch (er) {}
    __lastNavKey = navKey();
    render();
    __fromPop = false;
  });
  if (routePart0) scrollWeekPart(routePart0);
  try { var __wk = JSON.parse(sessionStorage.getItem(WKKEY) || 'null'); if (__wk && __wk.w) { walkOpen(cleanWeek(__wk.w) || __wk.w); if (_walk && __wk.i) { _walk.i = Math.max(0, Math.min(_walk.slides.length - 1, __wk.i)); walkMount(); } } } catch (e) {}

  /* Reading Supports boot: apply saved settings, keep them across renders, stop speech on navigation */
  try {
    try { if ('speechSynthesis' in window) window.speechSynthesis.getVoices(); } catch (e0) {}
    if ('speechSynthesis' in window && window.speechSynthesis.addEventListener) {
      window.speechSynthesis.addEventListener('voiceschanged', function () { if (state.rlPanelOpen) renderKeepScroll(); });
    }
    var rlSaved = load();
    if (rlSaved && rlSaved.rl && typeof rlSaved.rl === 'object') state.rl = rlSaved.rl;
    rlApply();
    var rlMo = new MutationObserver(function () {
      if (rlSpeaking) rlSpeakStop();
      rlApply();
    });
    var rlMain = document.getElementById('soc-main');
    if (rlMain && rlMain.parentElement) rlMo.observe(rlMain.parentElement, { childList: true, subtree: false });
  } catch (e) {}
})();
