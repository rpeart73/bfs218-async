/* BFS218 evidence visuals.
   Pure HTML renderers for weekly overview and activity diagrams.
   No learner data is collected, stored, or transmitted by this module. */
(function (global) {
  'use strict';

  var VERSION = '2026.08.28';
  var ACTIVITY_VIEWS = [
    { id: 'read', label: 'Read the task' },
    { id: 'act', label: 'Work the task' },
    { id: 'check', label: 'Check the claim' }
  ];

  var SOURCES = {
    benjamin2019: { label: 'Ruha Benjamin, Race After Technology (2019)' },
    noble2018: { label: 'Safiya Umoja Noble, Algorithms of Oppression (2018)' },
    buolamwini2018: {
      label: 'Joy Buolamwini and Timnit Gebru, Gender Shades (2018)',
      url: 'https://proceedings.mlr.press/v81/buolamwini18a.html'
    },
    opc2021: {
      label: 'Office of the Privacy Commissioner of Canada, special report to Parliament (2021)',
      url: 'https://www.priv.gc.ca/en/opc-actions-and-decisions/ar_index/202021/sr_rcmp/'
    },
    ewert2018: { label: 'Ewert v. Canada, 2018 SCC 30' },
    robertson2020: {
      label: 'Robertson, Khoo, and Song, To Surveil and Predict (2020)',
      url: 'https://citizenlab.ca/wp-content/uploads/2020/09/To-Surveil-and-Predict.pdf'
    },
    molnar2023: {
      label: 'Petra Molnar, Digital Border Technologies, Techno-Racism and Logics of Exclusion (2023)',
      url: 'https://doi.org/10.1111/imig.13187'
    },
    nagra2016: {
      label: 'Baljit Nagra and Paula Maurutto, Crossing Borders and Managing Racialized Identities (2016)',
      url: 'https://journals.library.ualberta.ca/cjs/index.php/CJS/article/view/23031'
    },
    fnigc2014: { label: 'First Nations Information Governance Centre, OCAP principles (2014)' },
    gida2019: { label: 'Global Indigenous Data Alliance, CARE Principles (2019)' },
    mohamed2020: {
      label: 'Mohamed, Png, and Isaac, Decolonial AI (2020)',
      url: 'https://arxiv.org/abs/2007.04068'
    },
    bird2023: {
      label: 'Bird, Castleman, and Song, Are Algorithms Biased in Education? (2023)',
      url: 'https://doi.org/10.26300/yd7z-6e20'
    },
    devlin2023: {
      label: 'Kate Devlin, Power in AI (2023)',
      url: 'https://doi.org/10.1002/9781119800729.ch8'
    },
    attard2023: {
      label: 'Blair Attard-Frost, brief on gaps in the proposed AIDA (2023)',
      url: 'https://www.ourcommons.ca/Content/Committee/441/INDU/Brief/BR12541028/br-external/AttardFrostBlair-e.pdf'
    },
    unhrc2020: { label: 'United Nations Human Rights Council, A/HRC/44/57 (2020)' },
    parliamentc27: {
      label: 'Parliament of Canada, LEGISinfo for Bill C-27, 44th Parliament, 1st session',
      url: 'https://www.parl.ca/legisinfo/en/bill/44-1/c-27'
    },
    costanza2020: {
      label: 'Sasha Costanza-Chock, Design Justice (2020)',
      url: 'https://designjustice.mitpress.mit.edu/'
    }
  };

  var SPECS = {
    1: {
      renderer: 'noticing-map',
      title: 'Notice the ordinary system before you judge it.',
      intro: 'Begin with an object, trace the hidden rule, then ask how its output distributes benefit, burden, visibility, or exclusion.',
      status: 'CONCEPTUAL NOTICING MAP',
      boundary: 'This is a course thinking map, not a claim about a particular product, person, or institution. The objects stand for places to begin an inquiry.',
      sources: ['benjamin2019', 'noble2018'],
      views: [
        { id: 'tool', label: 'Start with the tool' },
        { id: 'rule', label: 'Trace the rule' },
        { id: 'impact', label: 'Ask who carries it' }
      ]
    },
    3: {
      renderer: 'causal-dossier',
      title: 'Open the causal dossier.',
      intro: 'Engineered inequity is a chain. An existing hierarchy enters a design, the design scales it, and the result can return as fresh data.',
      status: 'FICTIONAL CAUSAL DOSSIER',
      boundary: 'The dossier is a conceptual synthesis of Benjamin\'s framework. It does not report a municipal deployment, a scoring weight, a measured disparity, or a proven intention.',
      sources: ['benjamin2019'],
      views: [
        { id: 'trace', label: 'Trace the chain' },
        { id: 'inspect', label: 'Inspect each link' },
        { id: 'limits', label: 'Check the limits' }
      ]
    },
    4: {
      renderer: 'default-inspector',
      title: 'Inspect the choice made before the user arrives.',
      intro: 'A default is a preset assumption. The inspector separates the input, the system\'s interpretation, and the output that follows.',
      status: 'SOURCED EXAMPLE AND CONCEPTUAL INSPECTOR',
      boundary: 'The Malcolm X Boulevard example is drawn from Benjamin. The inspector is a teaching application, not a current audit of any map product or a prevalence claim.',
      sources: ['benjamin2019'],
      views: [
        { id: 'preset', label: 'See the preset' },
        { id: 'output', label: 'Read the output' },
        { id: 'systemic', label: 'Test the system' }
      ]
    },
    5: {
      renderer: 'gender-shades-audit',
      title: 'Read the published error rates intersectionally.',
      intro: 'The same historical product is compared across four groups. The visible table preserves every plotted value.',
      status: 'HISTORICAL PUBLISHED AUDIT',
      boundary: 'Gender Shades tested historical versions of three commercial gender-classification systems. It did not test identity recognition, every demographic group, or current products, and it did not establish one training cause for every result.',
      sources: ['buolamwini2018'],
      views: [
        { id: 'compare', label: 'Compare all' },
        { id: 'ibm', label: 'IBM' },
        { id: 'microsoft', label: 'Microsoft' },
        { id: 'faceplus', label: 'Face++' }
      ]
    },
    6: {
      renderer: 'canadian-case-files',
      title: 'Keep the Canadian case files separate.',
      intro: 'Each source has its own institution, evidence type, finding or argument, course lens, and limit. Moving between files must not turn them into one national pipeline.',
      status: 'DOCUMENTARY EVIDENCE MAP',
      boundary: 'The sources document different systems and make different kinds of claims. Course concepts are labelled as course applications, not attributed to courts, regulators, interview participants, or report authors.',
      sources: ['opc2021', 'ewert2018', 'robertson2020', 'molnar2023', 'nagra2016'],
      views: [
        { id: 'clearview', label: 'RCMP and Clearview' },
        { id: 'ewert', label: 'Ewert v. Canada' },
        { id: 'policing', label: 'Policing landscape' },
        { id: 'border', label: 'Border evidence' }
      ]
    },
    7: {
      renderer: 'system-anatomy',
      title: 'Assemble the system, not a story about one bad part.',
      intro: 'Data, a model or rule, deployment, a decision, and a feedback loop form one inspectable anatomy.',
      status: 'CONCEPTUAL CONSOLIDATION MAP',
      boundary: 'This map joins course mechanisms for review. It is not one documented product, it does not claim that every system contains every mechanism, and it does not require a claim about harmful intent.',
      sources: ['benjamin2019', 'buolamwini2018', 'robertson2020', 'molnar2023'],
      views: [
        { id: 'whole', label: 'See the whole' },
        { id: 'dimensions', label: 'Place the dimensions' },
        { id: 'audit', label: 'Find accountability' }
      ]
    },
    8: {
      renderer: 'governance-map',
      title: 'Separate documentary evidence from governance frameworks.',
      intro: 'The photograph documents one identified community-mapping session. The adjacent diagram keeps OCAP and CARE visible with their distinct sources and scopes.',
      status: 'VERIFIED PHOTOGRAPH AND FRAMEWORK COMPARISON',
      boundary: 'The source identifies Inuit Elders and Sanikiluaq. It does not name the individuals or prove OCAP or CARE implementation. OCAP is a First Nations framework stewarded by FNIGC and must not be applied as a generic label to the Inuit scene.',
      sources: ['fnigc2014', 'gida2019', 'mohamed2020'],
      views: [
        { id: 'together', label: 'Read them together' },
        { id: 'scope', label: 'Check the scope' }
      ]
    },
    10: {
      renderer: 'threshold-laboratory',
      title: 'Change the decision rule, then inspect the allocation.',
      intro: 'The simplified lab separates a fixed cutoff, a moved cutoff, and contextual review without turning a teaching model into a population estimate.',
      status: 'SIMPLIFIED TEACHING MODEL',
      boundary: 'Bird, Castleman, and Song studied one United States community-college system and simulated allocations. Results varied by model, outcome, and threshold. This lab does not reproduce their model, scores, sample, or an operational support system.',
      sources: ['bird2023', 'devlin2023'],
      views: [
        { id: 'fixed', label: 'Fixed cutoff' },
        { id: 'moved', label: 'Move the line' },
        { id: 'review', label: 'Add context review' }
      ]
    },
    12: {
      renderer: 'policy-matrix',
      title: 'Separate proposal, critique, and law.',
      intro: 'The timeline establishes AIDA\'s historical status. The matrix then compares what policy levers can reach and what each can leave unresolved.',
      status: 'HISTORICAL POLICY COMPARISON',
      boundary: 'AIDA was proposed within Bill C-27 and did not become law. Attard-Frost\'s five gap categories are the author\'s policy analysis, not court or committee findings. The human-rights report is not Canadian legislation.',
      sources: ['attard2023', 'parliamentc27', 'unhrc2020'],
      views: [
        { id: 'timeline', label: 'AIDA timeline' },
        { id: 'matrix', label: 'Policy matrix' },
        { id: 'roles', label: 'Source roles' }
      ]
    },
    13: {
      renderer: 'change-map',
      title: 'Put an early entry beside a later one.',
      intro: 'The map leaves the evidence spaces blank so your own cartography, not a supplied example, shows what changed.',
      status: 'LEARNER EVIDENCE FRAME',
      boundary: 'The boxes are prompts. They contain no sample student entry, no claim about your development, and no stored or submitted learner data.',
      sources: ['benjamin2019', 'costanza2020'],
      views: [
        { id: 'compare', label: 'Compare entries' },
        { id: 'change', label: 'Name the change' },
        { id: 'carry', label: 'Carry it forward' }
      ]
    },
    14: {
      renderer: 'commitment-path',
      title: 'Build the closing answer from your own evidence.',
      intro: 'One path connects an entry from your map, a course-grounded response, and a commitment in your field.',
      status: 'LEARNER SYNTHESIS FRAME',
      boundary: 'This path supplies no answer, personal example, grade, or promise on your behalf. It does not store or submit what you decide to say.',
      sources: ['benjamin2019', 'costanza2020'],
      views: [
        { id: 'evidence', label: 'Choose evidence' },
        { id: 'response', label: 'Name a response' },
        { id: 'commitment', label: 'State a commitment' }
      ]
    }
  };

  var GENDER_SHADES = [
    { id: 'ibm', name: 'IBM', values: [0.3, 7.1, 12.0, 34.7] },
    { id: 'microsoft', name: 'Microsoft', values: [0.0, 1.7, 6.0, 20.8] },
    { id: 'faceplus', name: 'Face++', values: [0.8, 6.0, 0.7, 34.5] }
  ];
  var GENDER_SHADE_GROUPS = [
    'Lighter-skinned men',
    'Lighter-skinned women',
    'Darker-skinned men',
    'Darker-skinned women'
  ];

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function headingText(value) {
    return String(value == null ? '' : value).replace(/\.+\s*$/, '').trim();
  }

  function token(value, fallback) {
    var clean = String(value == null ? '' : value).toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
    return clean || fallback || 'item';
  }

  function weekNumber(value) {
    var num = Number(value);
    return isFinite(num) ? Math.round(num) : 0;
  }

  function copyViews(views) {
    return (views || []).map(function (view) {
      return { id: String(view.id || ''), label: String(view.label || view.id || '') };
    }).filter(function (view) { return !!view.id; });
  }

  function mergeSpec(week, supplied) {
    var base = SPECS[week];
    if (!base) return null;
    supplied = supplied && typeof supplied === 'object' ? supplied : {};
    var suppliedSources = Array.isArray(supplied.sourceIds) ? supplied.sourceIds : [];
    var sourceSet = {};
    var sources = [];
    (base.sources || []).concat(suppliedSources).forEach(function (id) {
      id = String(id || '');
      if (id && !sourceSet[id]) { sourceSet[id] = true; sources.push(id); }
    });
    return {
      renderer: base.renderer,
      title: base.title,
      intro: base.intro,
      status: base.status,
      boundary: base.boundary,
      sources: sources,
      views: copyViews(base.views)
    };
  }

  function sourceTrail(ids) {
    var items = (ids || []).map(function (id) {
      var source = SOURCES[id] || { label: id };
      if (!source.url) return '<span>' + esc(source.label) + '</span>';
      return '<a href="' + esc(source.url) + '" target="_blank" rel="noopener noreferrer">' + esc(source.label) + '</a>';
    });
    if (!items.length) return '';
    return '<footer class="bev-sources"><b>Source trail</b><div>' + items.join('<span aria-hidden="true"> | </span>') + '</div></footer>';
  }

  function panelHtml(panel, active, instanceId) {
    var panelId = instanceId + '-panel-' + token(panel.id);
    var tabId = instanceId + '-tab-' + token(panel.id);
    return '<section class="bev-panel" id="' + esc(panelId) + '" role="tabpanel" aria-labelledby="' + esc(tabId) + '" data-bev-panel="' + esc(panel.id) + '"' + (active ? '' : ' hidden') + '>' + panel.html + '</section>';
  }

  function tabsHtml(views, active, instanceId) {
    if (!views || views.length < 2) return '';
    return '<div class="bev-tabs" role="tablist" aria-label="Change this evidence view">' + views.map(function (view) {
      var on = view.id === active;
      return '<button type="button" role="tab" id="' + esc(instanceId + '-tab-' + token(view.id)) + '" aria-controls="' + esc(instanceId + '-panel-' + token(view.id)) + '" aria-selected="' + (on ? 'true' : 'false') + '" tabindex="' + (on ? '0' : '-1') + '" data-bev-view="' + esc(view.id) + '" data-bev-label="' + esc(view.label) + '">' + esc(view.label) + '</button>';
    }).join('') + '</div>';
  }

  function validView(views, requested) {
    var ids = (views || []).map(function (view) { return view.id; });
    return ids.indexOf(String(requested || '')) >= 0 ? String(requested) : (ids[0] || '');
  }

  function shell(week, spec, view, panels, options, context) {
    options = options || {};
    context = context || 'overview';
    var views = panels.map(function (panel) { return { id: panel.id, label: panel.label }; });
    var active = validView(views, view);
    var instanceId = token(options.instanceId, 'bev-w' + week + '-' + context);
    var renderer = token(spec.renderer, 'semantic-map');
    return '<article class="bev bev--w' + week + ' bev--' + esc(renderer) + '" id="' + esc(instanceId) + '" data-bfs-evidence-visual data-week="' + week + '" data-context="' + esc(context) + '" data-view="' + esc(active) + '">'
      + '<header class="bev-head"><div class="bev-head-copy"><span class="bev-kicker">' + (context === 'activity' ? 'ACTIVITY TASK MAP' : 'A VISUAL OVERVIEW') + ' | WEEK ' + week + '</span><h3>' + esc(headingText(spec.title)) + '</h3><p>' + esc(spec.intro) + '</p></div><div class="bev-status"><b>Status</b><span>' + esc(spec.status) + '</span></div></header>'
      + '<aside class="bev-boundary" aria-label="Evidence boundary"><b>Evidence boundary</b><p>' + esc(spec.boundary) + '</p></aside>'
      + tabsHtml(views, active, instanceId)
      + '<p class="bev-live" data-bev-live aria-live="polite">Showing ' + esc((views.filter(function (item) { return item.id === active; })[0] || {}).label || active) + '.</p>'
      + '<div class="bev-panels">' + panels.map(function (panel) { return panelHtml(panel, panel.id === active, instanceId); }).join('') + '</div>'
      + sourceTrail(spec.sources)
      + '</article>';
  }

  function flowSvg(lines, title, description, activeIndex) {
    var count = lines.length;
    var boxWidth = count > 4 ? 148 : 174;
    var gap = count > 4 ? 34 : 58;
    var total = count * boxWidth + (count - 1) * gap;
    var start = Math.max(18, Math.round((960 - total) / 2));
    var parts = [];
    lines.forEach(function (line, index) {
      var x = start + index * (boxWidth + gap);
      var active = index === activeIndex;
      if (index) {
        var from = x - gap + 5;
        var to = x - 7;
        parts.push('<line class="bev-svg-arrow" x1="' + from + '" y1="116" x2="' + to + '" y2="116"/><polygon class="bev-svg-arrowhead" points="' + (to - 2) + ',109 ' + (to + 9) + ',116 ' + (to - 2) + ',123"/>');
      }
      parts.push('<g class="bev-svg-node' + (active ? ' is-active' : '') + '"><rect x="' + x + '" y="55" width="' + boxWidth + '" height="122" rx="14"/><text x="' + (x + boxWidth / 2) + '" y="96" text-anchor="middle"><tspan x="' + (x + boxWidth / 2) + '">' + esc(line[0]) + '</tspan><tspan class="bev-svg-sub" x="' + (x + boxWidth / 2) + '" dy="26">' + esc(line[1] || '') + '</tspan></text></g>');
    });
    return '<svg class="bev-flow-svg" viewBox="0 0 960 230" role="img" aria-label="' + esc(title + '. ' + description) + '" focusable="false"><title>' + esc(title) + '</title><desc>' + esc(description) + '</desc>' + parts.join('') + '</svg>';
  }

  function processList(items) {
    return '<ol class="bev-process-list">' + items.map(function (item, index) {
      return '<li><span>' + (index + 1) + '</span><div><b>' + esc(item[0]) + '</b><p>' + esc(item[1]) + '</p></div></li>';
    }).join('') + '</ol>';
  }

  function renderNoticing(week, spec, view, options) {
    var objects = '<div class="bev-object-map" role="img" aria-label="Four ordinary system starting points: a search box, camera, form, and ranked feed, all pointing toward the same audit questions."><div class="bev-object bev-object--search"><span aria-hidden="true">⌕</span><b>Search</b></div><div class="bev-object bev-object--camera"><span aria-hidden="true">▣</span><b>Camera</b></div><div class="bev-object bev-object--form"><span aria-hidden="true">▤</span><b>Form</b></div><div class="bev-object bev-object--feed"><span aria-hidden="true">⇅</span><b>Ranked feed</b></div><div class="bev-object-centre"><b>Inspect the system</b><span>input | rule | output | impact</span></div></div>';
    var panels = [
      { id: 'tool', label: 'Start with the tool', html: objects + processList([
        ['Name only what is present', 'Begin with the object or service. Do not assume a hidden motive.'],
        ['Locate the system boundary', 'Ask what goes in, what comes out, and which institution acts on it.'],
        ['Find a source', 'A suspicion becomes a claim only when evidence supports it.']
      ]) },
      { id: 'rule', label: 'Trace the rule', html: flowSvg([
        ['Input', 'What enters?'], ['Rule', 'How is it sorted?'], ['Output', 'What follows?'], ['Review', 'Who can challenge?']
      ], 'Ordinary-system tracing map', 'Input moves through a rule to an output, followed by a question about review.', 1) + processList([
        ['Input', 'Data, a label, a query, an image, or a field can enter the system.'],
        ['Rule', 'A default, ranking, threshold, or category turns input into an output.'],
        ['Output and review', 'Ask who receives benefit or burden and whether correction is possible.']
      ]) },
      { id: 'impact', label: 'Ask who carries it', html: '<div class="bev-question-grid"><article><b>Who is centred?</b><p>Whose format, language, history, or body fits easily?</p></article><article><b>Who adapts?</b><p>Who must retry, explain, prove, wait, or leave?</p></article><article><b>What evidence exists?</b><p>Look for a documented outcome, not a generic story about technology.</p></article><article><b>Who can change it?</b><p>Find the designer, buyer, institution, regulator, or community authority.</p></article></div>' }
    ];
    return shell(week, spec, view, panels, options, 'overview');
  }

  function renderDossier(week, spec, view, options) {
    var chain = [
      ['Existing hierarchy', 'unequal starting world'],
      ['Record or proxy', 'history enters'],
      ['Design rule', 'pattern is scaled'],
      ['Decision', 'burden lands'],
      ['Feedback', 'result returns']
    ];
    var panels = [
      { id: 'trace', label: 'Trace the chain', html: flowSvg(chain, 'Engineered inequity causal chain', 'An existing hierarchy enters through records or proxies, is scaled by a design rule, shapes a decision, and can return through feedback.', 2) + processList([
        ['Start before the technology', 'Name the social hierarchy or unequal record the system inherits.'],
        ['Find the design decision', 'Identify the proxy, target, rule, or optimisation that carries the pattern.'],
        ['Follow the result back', 'Ask whether the output becomes new data and makes the pattern harder to escape.']
      ]) },
      { id: 'inspect', label: 'Inspect each link', html: '<div class="bev-dossier-grid"><article><span>FILE A</span><b>Starting condition</b><p>What inequity existed before the tool?</p></article><article><span>FILE B</span><b>Input provenance</b><p>Who produced the record, label, or proxy, and under what conditions?</p></article><article><span>FILE C</span><b>Design choice</b><p>What does the system reward, predict, rank, or treat as normal?</p></article><article><span>FILE D</span><b>Institutional action</b><p>What decision follows, and who can pause, review, or appeal it?</p></article><article><span>FILE E</span><b>Feedback</b><p>Does the result return as evidence for the next run?</p></article></div>' },
      { id: 'limits', label: 'Check the limits', html: '<div class="bev-claim-table"><div><b>The map can support</b><p>A causal question: where might an existing hierarchy enter, scale, and repeat?</p></div><div><b>The map cannot support</b><p>A claim that one named institution deployed this chain, that one variable has a known weight, or that intent has been proved.</p></div><div><b>Evidence needed next</b><p>Records, model documentation, deployment rules, outcomes, appeals, and testimony from people affected.</p></div></div>' }
    ];
    return shell(week, spec, view, panels, options, 'overview');
  }

  function renderDefaultInspector(week, spec, view, options) {
    var inspector = '<div class="bev-inspector" role="img" aria-label="A sourced example moves from the street name Malcolm X Boulevard through a default that reads X as a Roman numeral to the spoken output Malcolm Ten Boulevard."><div><span>INPUT</span><b>Malcolm X Boulevard</b></div><i aria-hidden="true">→</i><div class="bev-inspector-rule"><span>DEFAULT PARSE</span><b>X means ten</b></div><i aria-hidden="true">→</i><div><span>OUTPUT IN THE EXAMPLE</span><b>Malcolm Ten Boulevard</b></div></div>';
    var panels = [
      { id: 'preset', label: 'See the preset', html: inspector + '<p class="bev-reading-note"><b>Sourced illustration:</b> Benjamin uses the map-voice example to show how a technical default can project a narrow worldview into an ordinary system.</p>' },
      { id: 'output', label: 'Read the output', html: '<div class="bev-before-after"><article><span>What entered</span><b>A proper name and place</b><p>The letter is part of Malcolm X\'s name.</p></article><article><span>What the default assumed</span><b>A Roman numeral</b><p>The system applies one interpretation without enough context.</p></article><article><span>What changed</span><b>The name is misread</b><p>The output makes a historical and cultural name fit the preset.</p></article></div><p class="bev-reading-note">This panel describes Benjamin\'s example. It does not claim that the same output occurs in a current product.</p>' },
      { id: 'systemic', label: 'Test the system', html: '<div class="bev-checklist"><h4>Default inspector questions</h4><ul><li><b>Repeat:</b> Does the same rule create the same kind of failure?</li><li><b>Pattern:</b> Whose names, language, histories, or formats fit the preset?</li><li><b>Burden:</b> Who must adapt, retry, or accept being misrecorded?</li><li><b>Power:</b> Can a user see, challenge, and change the default?</li><li><b>Evidence:</b> What would show whether the glitch is systemic?</li></ul></div>' }
    ];
    return shell(week, spec, view, panels, options, 'overview');
  }

  function formatRate(value) {
    return Number(value).toFixed(1) + '%';
  }

  function genderChart(systems, label) {
    var chartLabel = label + '. Exact error rates are repeated in the visible table below.';
    return '<div class="bev-gs-chart" role="img" aria-label="' + esc(chartLabel) + '">' + systems.map(function (system) {
      return '<section class="bev-gs-system"><h4>' + esc(system.name) + '</h4>' + system.values.map(function (rate, index) {
        var width = Math.round((rate / 40) * 1000) / 10;
        return '<div class="bev-bar-row"><div><span>' + esc(GENDER_SHADE_GROUPS[index]) + '</span><b>' + formatRate(rate) + '</b></div><div class="bev-bar-track" aria-hidden="true"><span class="bev-bar bev-bar--g' + index + '" style="width:' + width + '%"></span></div></div>';
      }).join('') + '</section>';
    }).join('') + '</div>';
  }

  function genderTable() {
    return '<div class="bev-table-wrap" role="region" aria-label="Gender Shades exact error-rate table" tabindex="0"><table class="bev-table"><caption>Published intersectional error rates for commercial gender classification, percent</caption><thead><tr><th scope="col">Historical system tested</th>' + GENDER_SHADE_GROUPS.map(function (group) { return '<th scope="col">' + esc(group) + '</th>'; }).join('') + '</tr></thead><tbody>' + GENDER_SHADES.map(function (system) {
      return '<tr><th scope="row">' + esc(system.name) + '</th>' + system.values.map(function (rate) { return '<td>' + formatRate(rate) + '</td>'; }).join('') + '</tr>';
    }).join('') + '</tbody></table></div><p class="bev-table-note">Values reproduce the study\'s reported intersectional error rates. A longer bar means a higher error rate, not a larger group.</p>';
  }

  function renderGenderShades(week, spec, view, options) {
    var panels = [
      { id: 'compare', label: 'Compare all', html: genderChart(GENDER_SHADES, 'Bar chart comparing all twelve published error rates') },
      { id: 'ibm', label: 'IBM', html: genderChart([GENDER_SHADES[0]], 'IBM published error rates') },
      { id: 'microsoft', label: 'Microsoft', html: genderChart([GENDER_SHADES[1]], 'Microsoft published error rates') },
      { id: 'faceplus', label: 'Face++', html: genderChart([GENDER_SHADES[2]], 'Face++ published error rates') }
    ];
    var html = shell(week, spec, view, panels, options, 'overview');
    return html.replace('<footer class="bev-sources">', '<section class="bev-always-table" aria-label="Accessible chart data"><h4>Exact data behind the chart</h4>' + genderTable() + '</section><footer class="bev-sources">');
  }

  function evidenceRoute(items) {
    return '<div class="bev-evidence-route">' + items.map(function (item, index) {
      return '<article><span>' + esc(item[0]) + '</span><b>' + esc(item[1]) + '</b><p>' + esc(item[2]) + '</p></article>' + (index < items.length - 1 ? '<i aria-hidden="true">→</i>' : '');
    }).join('') + '</div>';
  }

  function caseFile(file, route) {
    return '<article class="bev-case-file"><header><span>' + esc(file.code) + '</span><h4>' + esc(headingText(file.title)) + '</h4></header><dl><div><dt>Setting</dt><dd>' + esc(file.setting) + '</dd></div><div><dt>Source type</dt><dd>' + esc(file.type) + '</dd></div><div><dt>Documented</dt><dd>' + esc(file.documented) + '</dd></div><div><dt>Course application</dt><dd>' + esc(file.lens) + '</dd></div><div><dt>Evidence limit</dt><dd>' + esc(file.limit) + '</dd></div></dl>' + evidenceRoute(route) + '</article>';
  }

  function renderCanadianCases(week, spec, view, options) {
    var panels = [
      { id: 'clearview', label: 'RCMP and Clearview', html: caseFile({
        code: 'CASE FILE 01 | REGULATORY FINDING',
        title: 'RCMP use of Clearview AI',
        setting: 'Federal policing and facial recognition',
        type: 'Privacy Commissioner special report to Parliament',
        documented: 'The Office of the Privacy Commissioner found the RCMP\'s use of Clearview AI violated federal privacy law.',
        lens: 'The course reads the non-consensual searchability of images through coded exposure. That phrase is the course\'s application, not the regulator\'s wording.',
        limit: 'The finding concerns the RCMP, Clearview AI, and the applicable privacy-law context. It does not establish the same use or legal result for every police service.'
      }, [['Source', 'OPC investigation', 'A named regulator and deployment'], ['Finding', 'Privacy-law violation', 'A legal finding in this context'], ['Lens', 'Coded exposure', 'A clearly labelled course application']]) },
      { id: 'ewert', label: 'Ewert v. Canada', html: caseFile({
        code: 'CASE FILE 02 | SUPREME COURT HOLDING',
        title: 'Ewert v. Canada',
        setting: 'Federal corrections and assessment tools',
        type: 'Supreme Court of Canada decision',
        documented: 'The Court held that Correctional Service Canada breached section 24(1) of the Corrections and Conditional Release Act by failing to take all reasonable steps to ensure the tools were valid for Indigenous offenders.',
        lens: 'The course uses default discrimination to analyse continued reliance on an unverified default. The Court did not use that phrase.',
        limit: 'The Court did not hold that the tools were proved inaccurate and did not find a Charter breach.'
      }, [['Source', '2018 SCC 30', 'A judicial holding'], ['Finding', 'Statutory breach', 'Failure to take all reasonable steps'], ['Lens', 'Default discrimination', 'Course analysis, not court language']]) },
      { id: 'policing', label: 'Policing landscape', html: caseFile({
        code: 'EVIDENCE FILE 03 | RIGHTS ANALYSIS',
        title: 'Algorithmic policing in Canada',
        setting: 'Predictive policing, facial recognition, and social-media surveillance',
        type: 'Human-rights and Charter analysis',
        documented: 'Robertson, Khoo, and Song documented Canadian examples and possible uses and analysed privacy and equality risks.',
        lens: 'The report supports questions about disclosure, impact assessment, consultation, and oversight.',
        limit: 'The authors described an incomplete factual record and did not establish widespread use at the time.'
      }, [['Record', 'Examples and possible uses', 'Not one national deployment map'], ['Analysis', 'Rights risks', 'Privacy and equality questions'], ['Limit', 'Incomplete record', 'No prevalence claim']]) },
      { id: 'border', label: 'Border evidence', html: '<div class="bev-split-files">' + caseFile({
        code: 'EVIDENCE FILE 04A | COMMENTARY',
        title: 'Digital border technologies',
        setting: 'Borders, migration, surveillance, biometrics, and automated decisions',
        type: 'Scholarly commentary',
        documented: 'Molnar analyses experimental tools operating under weak oversight where people on the move may have limited ability to refuse or seek redress.',
        lens: 'Logics of exclusion direct attention to power, experimentation, and remedy.',
        limit: 'The commentary does not establish how common every tool is or a universal sequence in which technologies move between settings.'
      }, [['Source', 'Molnar, 2023', 'Documented examples and analysis'], ['Question', 'Who can refuse?', 'Power at the border'], ['Limit', 'No universal sequence', 'Keep deployment claims specific']]) + caseFile({
        code: 'EVIDENCE FILE 04B | INTERVIEW STUDY',
        title: 'Reported surveillance experiences',
        setting: 'Young Canadian Muslims, airports, borders, and security practices',
        type: 'Qualitative interview study',
        documented: 'Participants described being questioned, watched, scrutinised, or treated as possible security risks, and described managing their identities in response.',
        lens: 'The accounts show how a security category was experienced by people in this participant group.',
        limit: 'The study does not represent every young Canadian Muslim or every border encounter and does not estimate national prevalence.'
      }, [['Source', 'Nagra and Maurutto, 2016', 'Participant accounts'], ['Evidence', 'Reported experiences', 'Qualitative, situated testimony'], ['Limit', 'No national estimate', 'Do not universalise']]) + '</div>' }
    ];
    return shell(week, spec, view, panels, options, 'overview');
  }

  function renderSystemAnatomy(week, spec, view, options) {
    var anatomy = [
      ['Data', 'record of a world'],
      ['Model', 'score or rule'],
      ['Deployment', 'institutional use'],
      ['Decision', 'benefit or burden'],
      ['Feedback', 'result returns']
    ];
    var panels = [
      { id: 'whole', label: 'See the whole', html: flowSvg(anatomy, 'System anatomy', 'Data moves through a model, deployment, and decision before an outcome can return through feedback.', 2) + processList([
        ['Separate the parts', 'Do not let the word algorithm hide data, rules, deployment, or institutional action.'],
        ['Reconnect the parts', 'A harm can emerge from their arrangement even when no single part explains it alone.'],
        ['Follow the return', 'A decision can become new data and make the next result look self-confirming.']
      ]) },
      { id: 'dimensions', label: 'Place the dimensions', html: '<div class="bev-dimension-map"><article><span>ENGINEERED INEQUITY</span><b>Where does design amplify an existing hierarchy?</b><p>Inspect the target, proxy, optimisation, and scale.</p></article><article><span>DEFAULT DISCRIMINATION</span><b>What inherited assumption is treated as normal?</b><p>Inspect data, settings, categories, and repeated failures.</p></article><article><span>CODED EXPOSURE</span><b>Who is watched, recognised, missed, or made searchable?</b><p>Inspect testing, performance, deployment, and visibility.</p></article><article><span>MORE THAN ONE</span><b>A real system can show several mechanisms.</b><p>The labels organise analysis; they do not replace source-specific evidence.</p></article></div>' },
      { id: 'audit', label: 'Find accountability', html: '<div class="bev-accountability"><div><b>Data authority</b><p>Who can inspect, correct, withdraw, or govern the record?</p></div><div><b>Model authority</b><p>Who defines the target, proxy, threshold, and acceptable error?</p></div><div><b>Deployment authority</b><p>Who buys, approves, pauses, or refuses the tool?</p></div><div><b>Remedy</b><p>Who receives notice, explanation, review, appeal, and correction?</p></div></div>' }
    ];
    return shell(week, spec, view, panels, options, 'overview');
  }

  function sanikiluaqFigure() {
    return '<figure class="bev-documentary"><img src="images/weeks/week08.jpg" alt="Two Inuit Elders point to locations on a digital map during a community mapping session in Sanikiluaq, Nunavut." loading="lazy"><figcaption><b>Documentary evidence:</b> Inuit Elders correcting a community map in Sanikiluaq, Nunavut. Source: <a href="https://blog.google/intl/en-au/products/explore-get-answers/using-maps-to-preserve-indigenous/" target="_blank" rel="noopener noreferrer">Google Earth Outreach</a>. The source does not name the individuals.</figcaption></figure>';
  }

  function governanceDiagram() {
    return '<div class="bev-governance" aria-label="Governance framework comparison"><article><span>FIRST NATIONS FRAMEWORK</span><h4>OCAP®</h4><div class="bev-principles"><b>Ownership</b><b>Control</b><b>Access</b><b>Possession</b></div><p>Stewarded by the First Nations Information Governance Centre. The registered framework concerns First Nations information governance.</p></article><article><span>INDIGENOUS DATA GOVERNANCE PRINCIPLES</span><h4>CARE</h4><div class="bev-principles"><b>Collective benefit</b><b>Authority to control</b><b>Responsibility</b><b>Ethics</b></div><p>Advanced by the Global Indigenous Data Alliance. CARE centres people and purpose in data governance.</p></article><article class="bev-governance-question"><span>DECOLONIAL AI READING</span><h4>Who holds power?</h4><p>Mohamed, Png, and Isaac ask how colonial patterns shape technology and why affected communities must be centred in design and governance.</p></article></div>';
  }

  function renderGovernance(week, spec, view, options) {
    var panels = [
      { id: 'together', label: 'Read them together', html: '<div class="bev-documentary-grid">' + sanikiluaqFigure() + governanceDiagram() + '</div><div class="bev-scope-stop"><b>Do not collapse the evidence.</b><p>The photograph shows an identified Inuit mapping session. It is not evidence that OCAP or CARE was implemented there. The frameworks are taught alongside the photograph as distinct governance resources.</p></div>' },
      { id: 'scope', label: 'Check the scope', html: '<div class="bev-scope-matrix"><article><span>THE PHOTOGRAPH SUPPORTS</span><b>An identified place and activity</b><p>Inuit Elders, Sanikiluaq, and a community-mapping session.</p></article><article><span>THE PHOTOGRAPH DOES NOT SUPPORT</span><b>A wider governance claim</b><p>No named participants, no claim about every Inuit community, and no proof of OCAP or CARE implementation.</p></article><article><span>OCAP SUPPORTS</span><b>Four First Nations governance principles</b><p>Ownership, Control, Access, and Possession, with FNIGC as steward.</p></article><article><span>CARE SUPPORTS</span><b>Four people-and-purpose principles</b><p>Collective benefit, Authority to control, Responsibility, and Ethics, from GIDA.</p></article></div>' }
    ];
    return shell(week, spec, view, panels, options, 'overview');
  }

  function thresholdModel(mode) {
    var descriptions = {
      fixed: ['FIXED CUTOFF', 'Records on one side receive the resource. Records on the other side do not.', 'The line makes allocation consistent, but consistency does not establish validity or fairness.'],
      moved: ['MOVED CUTOFF', 'Moving the line changes which records receive the resource.', 'A changed threshold changes allocation. It does not explain why predictions differ or whether need is measured well.'],
      review: ['CONTEXT REVIEW', 'Records near the line move to review instead of an automatic final result.', 'Review can add missing context, student voice, and appeal. It must still have authority and a clear rule.']
    };
    var d = descriptions[mode];
    return '<div class="bev-threshold-model bev-threshold-model--' + esc(mode) + '" role="img" aria-label="' + esc(d[0] + '. ' + d[1]) + '"><div class="bev-threshold-lane"><span class="bev-record bev-record--a">Record A</span><span class="bev-record bev-record--b">Record B</span><i class="bev-threshold-line" aria-hidden="true"></i><span class="bev-record bev-record--c">Record C</span><span class="bev-record bev-record--d">Record D</span></div><div class="bev-threshold-ends"><span>Resource route</span><span>' + (mode === 'review' ? 'Context review route' : 'Not selected by this rule') + '</span></div></div><div class="bev-threshold-reading"><b>' + esc(d[0]) + '</b><p>' + esc(d[1]) + '</p><p>' + esc(d[2]) + '</p></div>';
  }

  function renderThreshold(week, spec, view, options) {
    var panels = [
      { id: 'fixed', label: 'Fixed cutoff', html: thresholdModel('fixed') },
      { id: 'moved', label: 'Move the line', html: thresholdModel('moved') },
      { id: 'review', label: 'Add context review', html: thresholdModel('review') + '<div class="bev-review-needs"><b>A review route needs:</b><ul><li>the context the prediction omitted</li><li>the student\'s account and observed need</li><li>a person with authority to change the allocation</li><li>notice, reasons, and an appeal path</li><li>an outcome audit across groups</li></ul></div>' }
    ];
    return shell(week, spec, view, panels, options, 'overview');
  }

  function renderPolicy(week, spec, view, options) {
    var panels = [
      { id: 'timeline', label: 'AIDA timeline', html: '<ol class="bev-timeline"><li><span>JUNE 2022</span><b>Bill C-27 introduced</b><p>The bill included the proposed Artificial Intelligence and Data Act.</p></li><li><span>2023</span><b>Attard-Frost submitted a committee brief</b><p>The brief argued that the proposal had five categories of gaps affecting artists and creators. These are the author\'s analysis.</p></li><li><span>JANUARY 2025</span><b>Committee work ceased</b><p>The parliamentary session ended with prorogation before committee consideration was completed.</p></li><li class="bev-timeline-result"><span>LEGAL STATUS</span><b>AIDA did not become law.</b><p>Use it as a historical policy proposal, not as current Canadian legislation.</p></li></ol>' },
      { id: 'matrix', label: 'Policy matrix', html: '<div class="bev-table-wrap" role="region" aria-label="Policy lever comparison table" tabindex="0"><table class="bev-table bev-policy-table"><caption>What different accountability levers can reach</caption><thead><tr><th scope="col">Lever</th><th scope="col">Primary level</th><th scope="col">What it can do</th><th scope="col">What it does not guarantee</th></tr></thead><tbody><tr><th scope="row">Product fix</th><td>Single system</td><td>Change, audit, pause, or stop one tool.</td><td>The rules above the product may still permit the same design elsewhere.</td></tr><tr><th scope="row">Independent audit</th><td>Institution</td><td>Test outcomes before and after deployment.</td><td>An audit is limited by access, independence, consequences, and enforcement.</td></tr><tr><th scope="row">Transparency rule</th><td>Institution or law</td><td>Expose specified data, methods, uses, and limits.</td><td>Visibility alone is not correction, remedy, or power to stop use.</td></tr><tr><th scope="row">Right to redress</th><td>Law or rights</td><td>Create an enforceable route to correction or compensation.</td><td>It often acts after harm and depends on an effective enforcing body.</td></tr><tr><th scope="row">Justice from the start</th><td>Governance</td><td>Give affected communities defined authority in design and governance.</td><td>Consultation without authority, time, access, and resources can remain symbolic.</td></tr></tbody></table></div>' },
      { id: 'roles', label: 'Source roles', html: '<div class="bev-source-roles"><article><span>OFFICIAL STATUS</span><b>Parliament of Canada</b><p>Supports the bill\'s contents, legislative stage, session dates, and incomplete committee consideration.</p></article><article><span>POLICY CRITIQUE</span><b>Attard-Frost, 2023</b><p>Supports the author\'s five gap categories and recommendations. It is not a judicial or committee finding.</p></article><article><span>HUMAN-RIGHTS ANALYSIS</span><b>UN Human Rights Council report, 2020</b><p>Frames racial discrimination in emerging digital technologies as a human-rights issue. It is not Canadian legislation.</p></article><article><span>COURSE SYNTHESIS</span><b>The accountability stack</b><p>Compares levels and levers without claiming that one intervention solves every form of harm.</p></article></div>' }
    ];
    return shell(week, spec, view, panels, options, 'overview');
  }

  function blankEntry(label, prompts) {
    return '<article class="bev-blank-entry"><span>' + esc(label) + '</span><div aria-hidden="true"></div><ul>' + prompts.map(function (prompt) { return '<li>' + esc(prompt) + '</li>'; }).join('') + '</ul></article>';
  }

  function renderChangeMap(week, spec, view, options) {
    var panels = [
      { id: 'compare', label: 'Compare entries', html: '<div class="bev-entry-compare">' + blankEntry('YOUR EARLY ENTRY', ['What did you notice?', 'What evidence did you use?', 'What could you not yet name?']) + '<i aria-hidden="true">→</i>' + blankEntry('YOUR LATER ENTRY', ['What mechanism can you name?', 'What source sharpens it?', 'Who holds power or responsibility?']) + '</div>' },
      { id: 'change', label: 'Name the change', html: '<div class="bev-change-lenses"><article><span>LANGUAGE</span><b>What became more precise?</b><p>Compare the concepts and verbs you used.</p></article><article><span>EVIDENCE</span><b>What became better supported?</b><p>Point to a source, case, or documented outcome.</p></article><article><span>MECHANISM</span><b>What process can you now explain?</b><p>Trace data, default, design, deployment, or governance.</p></article><article><span>ACCOUNTABILITY</span><b>Who can act?</b><p>Name authority, review, appeal, refusal, repair, or redesign.</p></article></div>' },
      { id: 'carry', label: 'Carry it forward', html: evidenceRoute([['Evidence', 'One entry from your map', 'Use your own course record'], ['Change', 'What you can now see', 'Name the sharper analysis'], ['Commitment', 'What you will carry', 'Place it in your field']]) + '<p class="bev-reading-note">Keep the final commitment proportionate. It should name one practice you can explain and stand behind, not promise an outcome beyond your authority.</p>' }
    ];
    return shell(week, spec, view, panels, options, 'overview');
  }

  function closingPath(active) {
    var steps = [
      ['evidence', 'EVIDENCE', 'One entry from your Personal Cartography', 'What happened, and what source helps you read it?'],
      ['response', 'RESPONSE', 'One course-grounded way to answer the harm', 'What would change in design, governance, rights, or power?'],
      ['commitment', 'COMMITMENT', 'One action in your field', 'What will you ask, check, refuse, change, or help govern?']
    ];
    return '<div class="bev-closing-path">' + steps.map(function (step, index) {
      return '<article class="' + (step[0] === active ? 'is-active' : '') + '"><span>' + esc(step[1]) + '</span><b>' + esc(step[2]) + '</b><p>' + esc(step[3]) + '</p></article>' + (index < steps.length - 1 ? '<i aria-hidden="true">→</i>' : '');
    }).join('') + '</div>';
  }

  function renderCommitment(week, spec, view, options) {
    var panels = [
      { id: 'evidence', label: 'Choose evidence', html: closingPath('evidence') + '<div class="bev-prompt-card"><b>Evidence test</b><p>Can another reader locate the entry and distinguish what happened from what you infer?</p></div>' },
      { id: 'response', label: 'Name a response', html: closingPath('response') + '<div class="bev-prompt-card"><b>Response test</b><p>Does the response address the mechanism and shift a rule, resource, right, or decision-making power?</p></div>' },
      { id: 'commitment', label: 'State a commitment', html: closingPath('commitment') + '<div class="bev-prompt-card"><b>Commitment test</b><p>Is it specific, within your role, connected to the evidence, and clear enough to revisit later?</p></div>' }
    ];
    return shell(week, spec, view, panels, options, 'overview');
  }

  var RENDERERS = {
    'noticing-map': renderNoticing,
    'causal-dossier': renderDossier,
    'default-inspector': renderDefaultInspector,
    'gender-shades-audit': renderGenderShades,
    'canadian-case-files': renderCanadianCases,
    'system-anatomy': renderSystemAnatomy,
    'governance-map': renderGovernance,
    'threshold-laboratory': renderThreshold,
    'policy-matrix': renderPolicy,
    'change-map': renderChangeMap,
    'commitment-path': renderCommitment
  };

  function activityStatus(activity) {
    var data = activity && activity.data ? activity.data : {};
    var text = [activity && activity.title, activity && activity.what, data.setup, data.case, data.prompt, data.goal, data.system].join(' ').toLowerCase();
    if (text.indexOf('fictional') >= 0) return 'FICTIONAL TEACHING TASK';
    if (text.indexOf('historical') >= 0 || text.indexOf('published') >= 0 || text.indexOf('documented') >= 0) return 'SOURCE-BASED OR HISTORICAL TASK';
    return 'COURSE ACTIVITY TASK MAP';
  }

  function activityPrompt(activity) {
    var data = activity && activity.data ? activity.data : {};
    return data.prompt || data.setup || data.case || data.goal || data.system || activity.what || 'Read the activity prompt and identify the evidence, choice, and explanation it asks for.';
  }

  function activityMoves(archetype) {
    var moves = {
      match: [['Read each item', 'Stay with the evidence in the example.'], ['Test the match', 'Choose the concept that explains the mechanism.'], ['Use the feedback', 'Check why the match fits and revise if needed.']],
      scenario: [['Read the situation', 'Separate the documented or stated conditions from your assumption.'], ['Choose at the fork', 'Predict what the institutional choice changes.'], ['Trace the outcome', 'Name the mechanism, burden, and evidence limit.']],
      toggle: [['Find the preset', 'Identify what is active before anyone changes it.'], ['Change one condition', 'Compare the output while holding the rest steady.'], ['Name the burden', 'Explain who must adapt and what review is missing.']],
      assemble: [['Separate the parts', 'Name each layer before joining them.'], ['Build the sequence', 'Place data, rule, deployment, decision, and feedback.'], ['Explain the whole', 'Show how the arrangement produces the result.']],
      lab: [['Read the case boundary', 'Know whether the case is fictional, historical, or documented.'], ['Choose the levers', 'Compare what each changes and leaves unresolved.'], ['Defend the pair', 'Use sources and trade-offs, not preference alone.']],
      capstone: [['Return to your work', 'Choose evidence from your own cartography.'], ['Name what changed', 'Compare your early and later analysis.'], ['Carry it forward', 'Connect evidence to one response or commitment.']]
    };
    return moves[archetype] || [['Read the evidence', 'Start with what the activity actually gives you.'], ['Take the action', 'Change, choose, match, or assemble only what the task asks.'], ['Explain the result', 'Use the feedback and evidence boundary to state a proportionate claim.']];
  }

  function renderActivity(week, activity, view, options) {
    week = weekNumber(week);
    activity = activity && typeof activity === 'object' ? activity : {};
    options = options || {};
    var archetype = token(activity.archetype || options.archetype, 'task');
    var title = activity.title || 'Work this activity as an evidence task.';
    var what = activity.what || 'Move from the activity evidence to one clear explanation.';
    var why = activity.why || 'The map keeps the task sequence visible without adding a simulated world.';
    var prompt = activityPrompt(activity);
    var suppliedBoundary = activity.evidenceNote || options.evidenceNote;
    var spec = {
      renderer: 'activity-' + archetype,
      title: title,
      intro: what + (why ? ' This matters ' + why.replace(/^so\s+/i, 'because ') : ''),
      status: activityStatus(activity),
      boundary: suppliedBoundary || 'This lightweight diagram explains the activity sequence only. It does not add people, institutions, scores, outcomes, or factual claims to the activity. Read the activity\'s own status, citations, and feedback for evidence.',
      sources: [],
      views: copyViews(ACTIVITY_VIEWS)
    };
    var moves = activityMoves(archetype);
    var panels = [
      { id: 'read', label: 'Read the task', html: '<div class="bev-activity-prompt"><span>TASK EVIDENCE</span><p>' + esc(prompt) + '</p></div>' + processList([
        ['Read the status', 'Is the activity fictional, historical, documentary, or conceptual?'],
        ['Read the source role', 'Separate a finding, an author\'s argument, and a course application.'],
        ['Read the boundary', 'Know what the example cannot prove before you act.']
      ]) },
      { id: 'act', label: 'Work the task', html: processList(moves) },
      { id: 'check', label: 'Check the claim', html: '<div class="bev-claim-check"><article><b>Evidence</b><p>What in the task or source supports your answer?</p></article><article><b>Mechanism</b><p>What rule, default, design, deployment, or power relationship explains the result?</p></article><article><b>Boundary</b><p>What would be too broad, too certain, or outside the example?</p></article><article><b>Revision</b><p>Use the activity feedback to make the explanation more precise.</p></article></div>' }
    ];
    return shell(week, spec, view, panels, options, 'activity');
  }

  function parseRenderArgs(week, supplied, view, options) {
    var result = { week: weekNumber(week), spec: supplied, view: view, options: options || {}, context: 'overview' };
    if (supplied && typeof supplied === 'object' && !Array.isArray(supplied) && (supplied.context || supplied.spec || supplied.instanceId) && !supplied.renderer && !supplied.title) {
      result.context = supplied.context || 'overview';
      result.spec = supplied.spec || null;
      result.view = supplied.view || view;
      result.options = supplied;
    } else if (options && options.context) {
      result.context = options.context;
    }
    return result;
  }

  function render(week, supplied, view, options) {
    var args = parseRenderArgs(week, supplied, view, options);
    if (args.context === 'activity') return renderActivity(args.week, args.spec, args.view, args.options);
    var spec = mergeSpec(args.week, args.spec);
    if (!spec || !RENDERERS[spec.renderer]) return '';
    return RENDERERS[spec.renderer](args.week, spec, args.view, args.options);
  }

  function resolveRoot(rootOrSelector) {
    if (!rootOrSelector) return null;
    if (typeof rootOrSelector === 'string') return global.document ? global.document.querySelector(rootOrSelector) : null;
    return rootOrSelector.nodeType === 1 ? rootOrSelector : null;
  }

  function visualRoots(root) {
    if (!root) return [];
    var roots = [];
    if (root.hasAttribute && root.hasAttribute('data-bfs-evidence-visual')) roots.push(root);
    if (root.querySelectorAll) Array.prototype.forEach.call(root.querySelectorAll('[data-bfs-evidence-visual]'), function (item) { roots.push(item); });
    return roots;
  }

  function viewButtons(root) {
    return root && root.querySelectorAll ? Array.prototype.slice.call(root.querySelectorAll('[data-bev-view]')) : [];
  }

  function emitView(root, detail) {
    if (!root || !root.dispatchEvent || !global.document) return;
    var event;
    try {
      event = new global.CustomEvent('bfs218:evidence-view', { bubbles: true, detail: detail });
    } catch (error) {
      event = global.document.createEvent('CustomEvent');
      event.initCustomEvent('bfs218:evidence-view', true, false, detail);
    }
    root.dispatchEvent(event);
  }

  function setView(rootOrSelector, view, options) {
    options = options || {};
    var root = resolveRoot(rootOrSelector);
    if (!root || !root.hasAttribute('data-bfs-evidence-visual')) return false;
    var buttons = viewButtons(root);
    var target = null;
    buttons.some(function (button) {
      if (button.getAttribute('data-bev-view') === String(view)) { target = button; return true; }
      return false;
    });
    if (!target) return false;
    buttons.forEach(function (button) {
      var on = button === target;
      button.setAttribute('aria-selected', on ? 'true' : 'false');
      button.setAttribute('tabindex', on ? '0' : '-1');
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-bev-panel]'), function (panel) {
      panel.hidden = panel.getAttribute('data-bev-panel') !== String(view);
    });
    root.setAttribute('data-view', String(view));
    var live = root.querySelector('[data-bev-live]');
    if (live) live.textContent = 'Showing ' + (target.getAttribute('data-bev-label') || target.textContent || view) + '.';
    if (options.focus && target.focus) target.focus();
    var detail = {
      week: Number(root.getAttribute('data-week')),
      context: root.getAttribute('data-context') || 'overview',
      view: String(view)
    };
    if (typeof options.onChange === 'function') options.onChange(detail, root);
    if (options.emit) emitView(root, detail);
    return true;
  }

  function nextView(rootOrWeek, current, delta, context) {
    var ids = [];
    var root = resolveRoot(rootOrWeek);
    if (root) ids = viewButtons(root).map(function (button) { return button.getAttribute('data-bev-view'); });
    else if (String(context || '') === 'activity') ids = ACTIVITY_VIEWS.map(function (item) { return item.id; });
    else {
      var spec = SPECS[weekNumber(rootOrWeek)];
      ids = spec ? spec.views.map(function (item) { return item.id; }) : [];
    }
    if (!ids.length) return '';
    var index = ids.indexOf(String(current || ''));
    if (index < 0) index = 0;
    var move = Number(delta) < 0 ? -1 : 1;
    return ids[(index + move + ids.length) % ids.length];
  }

  function closestViewButton(target, root) {
    while (target && target !== root) {
      if (target.getAttribute && target.hasAttribute('data-bev-view')) return target;
      target = target.parentNode;
    }
    return null;
  }

  function bind(rootOrSelector, options) {
    options = options || {};
    var outer = resolveRoot(rootOrSelector);
    if (!outer) return function () {};
    var cleanups = [];
    visualRoots(outer).forEach(function (root) {
      if (root.__bfs218EvidenceBound) return;
      var click = function (event) {
        var button = closestViewButton(event.target, root);
        if (!button) return;
        setView(root, button.getAttribute('data-bev-view'), { focus: false, emit: true, onChange: options.onChange });
      };
      var keydown = function (event) {
        var button = closestViewButton(event.target, root);
        if (!button) return;
        var buttons = viewButtons(root);
        var currentIndex = buttons.indexOf(button);
        var nextIndex = currentIndex;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % buttons.length;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = buttons.length - 1;
        else return;
        event.preventDefault();
        setView(root, buttons[nextIndex].getAttribute('data-bev-view'), { focus: true, emit: true, onChange: options.onChange });
      };
      root.addEventListener('click', click);
      root.addEventListener('keydown', keydown);
      root.__bfs218EvidenceBound = true;
      cleanups.push(function () {
        root.removeEventListener('click', click);
        root.removeEventListener('keydown', keydown);
        root.__bfs218EvidenceBound = false;
      });
    });
    return function () { cleanups.forEach(function (cleanup) { cleanup(); }); };
  }

  function getSpec(week) {
    var spec = SPECS[weekNumber(week)];
    if (!spec) return null;
    return {
      renderer: spec.renderer,
      title: spec.title,
      intro: spec.intro,
      status: spec.status,
      boundary: spec.boundary,
      sources: (spec.sources || []).slice(),
      views: copyViews(spec.views)
    };
  }

  global.BFS218_EVIDENCE_VISUALS = {
    version: VERSION,
    overviewWeeks: [1, 3, 4, 5, 6, 7, 8, 10, 12, 13, 14],
    hasOverview: function (week) { return !!SPECS[weekNumber(week)]; },
    getSpec: getSpec,
    render: render,
    renderActivity: renderActivity,
    bind: bind,
    setView: setView,
    nextView: nextView
  };
})(window);
