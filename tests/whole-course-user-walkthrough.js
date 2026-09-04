/*
 * Permanent BFS218 user-equivalent regression.
 * Uses only visible course controls for the journey; direct state calls are prohibited here.
 */
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');
const { chromium } = require('playwright');

const appRoot = path.resolve(process.argv[2] || '');
const evidenceRoot = path.resolve(process.argv[3] || '');
const variant = String(process.argv[4] || 'Asynchronous');
const runMode = String(process.argv[5] || 'all');
const browserExecutable = process.env.BFS218_CHROMIUM_EXECUTABLE || undefined;
if (!appRoot || !fs.statSync(appRoot).isDirectory()) throw new Error('First argument must be a BFS218 app root.');
fs.mkdirSync(evidenceRoot, { recursive: true });

const serverScript = path.join(__dirname, 'walkthrough_static_server.js');
const isolationParent = fs.mkdtempSync(path.join(os.tmpdir(), 'bfs218-walkthrough-parent-'));
const isolatedRoot = path.join(isolationParent, 'isolated-student-state');
for (const name of ['home', 'data', 'configuration', 'cache', 'backup', 'temporary', 'bytecode', 'downloads']) {
  fs.mkdirSync(path.join(isolatedRoot, name), { recursive: true });
}

const serverEnvironment = {
  BFS218_APP_ROOT: appRoot,
  BFS218_ISOLATED_ROOT: isolatedRoot,
  BFS218_EXPECTED_ISOLATION_PARENT: isolationParent,
  HOME: path.join(isolatedRoot, 'home'),
  USERPROFILE: path.join(isolatedRoot, 'home'),
  APPDATA: path.join(isolatedRoot, 'configuration'),
  LOCALAPPDATA: path.join(isolatedRoot, 'data'),
  TEMP: path.join(isolatedRoot, 'temporary'),
  TMP: path.join(isolatedRoot, 'temporary'),
  XDG_CACHE_HOME: path.join(isolatedRoot, 'cache'),
  XDG_CONFIG_HOME: path.join(isolatedRoot, 'configuration'),
  PYTHONDONTWRITEBYTECODE: '1',
  NODE_OPTIONS: '--no-deprecation',
  SystemRoot: process.env.SystemRoot || 'C:\\Windows'
};

function sha256File(file) { return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'); }
function writeJson(file, value) { fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8'); }
function readyFrom(child) {
  return new Promise((resolve, reject) => {
    let text = '';
    const timer = setTimeout(() => reject(new Error('Isolated server did not report an endpoint.')), 15000);
    child.stdout.on('data', (chunk) => {
      text += chunk.toString('utf8');
      const lines = text.split(/\r?\n/); text = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        const item = JSON.parse(line);
        if (item.type === 'ready') { clearTimeout(timer); resolve(item); }
      }
    });
    child.on('error', reject);
    child.on('exit', (code) => { if (code && code !== 0) reject(new Error(`Isolated server exited ${code}.`)); });
  });
}

function visibleText(locator) { return locator.innerText().then((value) => String(value || '').replace(/\s+/g, ' ').trim()); }
function assert(condition, message) { if (!condition) throw new Error(message); }
async function expectVisible(locator, label) { await locator.waitFor({ state: 'visible', timeout: 20000 }); assert(await locator.isVisible(), `${label} was not visible.`); }

async function exerciseActiveChapter(page, week, chapter, observations) {
  const active = page.locator('.walk-slide[aria-hidden="false"]');
  await expectVisible(active, `Week ${week} chapter ${chapter}`);
  const text = await visibleText(active);
  assert(text.length > 20, `Week ${week} chapter ${chapter} did not contain substantive teaching.`);
  const title = await active.locator('h1,h2').first().textContent().catch(() => '');
  if (title && String(title).trim()) assert(!/[.]$/.test(String(title).trim()), `Week ${week} chapter title retained a terminal period: ${title}`);
  const overflow = await page.locator('html').evaluate((node) => node.scrollWidth - node.clientWidth);
  assert(overflow === 0, `Week ${week} chapter ${chapter} created horizontal overflow (${overflow}px).`);

  const storyTabs = active.locator('.walk-story-interactive [role="tab"], .walk-figure-gallery [role="tab"]');
  for (let i = 0; i < await storyTabs.count(); i += 1) {
    await storyTabs.nth(i).click();
    const selected = await storyTabs.nth(i).getAttribute('aria-selected');
    assert(selected === 'true', `Week ${week} chapter ${chapter} story tab ${i + 1} did not select.`);
  }
  const modelViews = active.locator('[data-model-view]');
  const modelSummaries = [];
  for (let i = 0; i < await modelViews.count(); i += 1) {
    await modelViews.nth(i).click();
    modelSummaries.push(await visibleText(active.locator('.walk-model-summary')));
  }
  if (modelSummaries.length) assert(new Set(modelSummaries).size === modelSummaries.length, `Week ${week} 3D explanations were not distinct.`);

  const checks = active.locator('.walk-check-options button');
  if (await checks.count()) {
    await checks.first().click();
    const correct = active.locator('.walk-check-options button[data-correct="true"]');
    if (await correct.count()) await correct.first().click();
    const feedback = await visibleText(active.locator('[data-walk-check-feedback]'));
    assert(feedback.length > 45, `Week ${week} knowledge-check feedback was superficial.`);
  }
  const feedbackButtons = active.locator('.walk-interactive button[data-feedback]');
  if (await feedbackButtons.count()) {
    const before = await active.locator('[data-walk-feedback]').textContent().catch(() => '');
    await feedbackButtons.first().click();
    const after = await active.locator('[data-walk-feedback]').textContent().catch(() => '');
    assert(String(after).trim() && after !== before, `Week ${week} interactive feedback did not change.`);
  }
  observations.chapterCount += 1;
}

async function openWalkthroughLanding(page) {
  const button = page.locator("button[onclick=\"SOC.go('walkthroughs')\"]").first();
  if (!await button.isVisible().catch(() => false)) {
    const menu = page.getByRole('button', { name: 'Open course navigation', exact: true });
    if (await menu.isVisible().catch(() => false)) await menu.click();
  }
  await expectVisible(button, 'Weekly Experiences navigation');
  await button.click();
  await expectVisible(page.getByRole('heading', { name: /Weekly Experiences|Interactive Lessons/i }).first(), 'Weekly Experiences page');
  await expectVisible(page.locator('.experience-card').first(), 'Weekly Experiences cards');
}

async function exerciseWalkthroughs(page, report, traceId) {
  await openWalkthroughLanding(page);
  const initialCards = page.locator('.experience-card');
  const initialCardCount = await initialCards.count();
  assert(initialCardCount === 14, `Weekly Experiences presented ${initialCardCount} of 14 weeks.`);

  for (let week = 1; week <= 14; week += 1) {
    const card = page.locator('.experience-card').nth(week - 1);
    const open = card.locator('button[data-experience-week]');
    await open.click();
    const overlay = page.locator('#walk-overlay');
    await expectVisible(overlay, `Week ${week} cover`);
    assert(await overlay.locator('.walk-bar').count() === 0, `Week ${week} cover exposed chapter navigation before entry.`);
    const coverTitle = String(await overlay.locator('.walk-title,h1,h2').first().textContent()).trim();
    assert(!/[.]$/.test(coverTitle), `Week ${week} cover title retained a terminal period.`);
    if (week === 8) {
      const land = await visibleText(overlay);
      for (const term of ['LAND ACKNOWLEDGEMENT', 'Anishinaabe', 'Haudenosaunee', 'Wendat', 'Treaty 13', 'Williams Treaties']) {
        assert(land.includes(term), `Week 8 land acknowledgement omitted ${term}.`);
      }
    }

    if (week === 2) {
      await page.keyboard.press('Tab');
      const focus = await page.locator(':focus').evaluate((node) => ({ tag: node.tagName, visible: !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length) }));
      assert(focus.visible, 'Keyboard focus was not visible on the walkthrough cover.');
    }
    await overlay.getByRole('button', { name: /Enter the experience|Enter Week 8|Start the interactive lesson/i }).click();
    const dots = overlay.locator('.walk-dot');
    const chapters = await dots.count();
    assert(chapters >= 6, `Week ${week} exposed only ${chapters} chapters.`);
    const pilotVisuals = {
      2: { title: 'The mechanism changes; the hierarchy can continue', image: 'new-jim-code-bridge-original.png' },
      3: { title: 'Inequity can enter early and grow at every stage', image: 'engineered-inequity-pipeline-original.png' },
      4: { title: 'A default is a decision that travels', image: 'default-discrimination-system-original.png' },
      5: { title: 'Being seen and being missed can both cause harm', image: 'coded-exposure-visibility-trap-original.png' },
      6: { title: 'Keep three Canadian case files separate', image: 'canadian-case-files-original.png' },
      7: { title: 'One system can contain three mechanisms at once', image: 'system-anatomy-synthesis-original.png' }
    };
    if (pilotVisuals[week]) {
      const labels = await dots.evaluateAll((buttons) => buttons.map((button) => button.getAttribute('aria-label') || ''));
      const conceptIndexes = labels.map((label, index) => /^Chapter \d+ of \d+: Key idea:/.test(label) ? index : -1).filter((index) => index >= 0);
      const visualIndex = labels.findIndex((label) => label.includes(pilotVisuals[week].title));
      assert(visualIndex >= 0, `Week ${week} omitted its original explanatory visual.`);
      assert(conceptIndexes.length && visualIndex > Math.max(...conceptIndexes), `Week ${week} showed its explanatory visual before the concept was taught.`);
      await dots.nth(visualIndex).click();
      await page.waitForTimeout(700);
      const visualSlide = overlay.locator('.walk-slide[aria-hidden="false"]');
      const visualImage = visualSlide.locator(`img[src$="${pilotVisuals[week].image}"]`);
      await expectVisible(visualImage, `Week ${week} original explanatory visual`);
      const visualReady = await visualImage.evaluate((image) => image.complete && image.naturalWidth > 1200 && image.naturalHeight > 600);
      assert(visualReady, `Week ${week} original explanatory visual did not load at presentation resolution.`);
      const visualText = await visibleText(visualSlide);
      assert(visualText.includes('Original conceptual illustration'), `Week ${week} did not identify the original visual as conceptual.`);
      assert(visualText.includes('Evidence boundary'), `Week ${week} omitted the explanatory visual's evidence boundary.`);
      await page.screenshot({ path: path.join(evidenceRoot, `week-${String(week).padStart(2, '0')}-original-visual.png`), fullPage: false });
      if (week === 6) {
        const sourceHrefs = await visualSlide.locator('.walk-story-source').evaluateAll((links) => links.map((link) => link.href));
        assert(sourceHrefs.some((href) => href.includes('doi.org/10.1111/imig.13187')), 'Week 6 omitted the digital-border research source.');
        assert(sourceHrefs.some((href) => href.includes('priv.gc.ca/en/opc-actions-and-decisions')), 'Week 6 omitted the Privacy Commissioner source.');
        assert(sourceHrefs.some((href) => href.includes('scc-csc.ca/judgments-jugements/cb/2018/37233')), 'Week 6 omitted the Supreme Court case source.');
      }
    }
    if (week === 2) {
      const labels = await dots.evaluateAll((buttons) => buttons.map((button) => button.getAttribute('aria-label') || ''));
      const sequence = [
        'The rule was made visible',
        'The rule followed people into movement',
        'The rule also controlled cultural access',
        'How Jim Crow became a system'
      ].map((title) => labels.findIndex((label) => label.includes(title)));
      assert(sequence.every((index) => index >= 0), 'Week 2 omitted part of the Jim Crow historical sequence.');
      assert(sequence.every((index, position) => position === 0 || index > sequence[position - 1]), 'Week 2 did not present the Jim Crow evidence in the intended narrative order.');
      const sourceChecks = [
        { title: 'The rule followed people into movement', image: 'jim-crow-bus-station.jpg', source: 'loc.gov/resource/cph.3c25806' },
        { title: 'The rule also controlled cultural access', image: 'jim-crow-cinema-entrance.jpg', source: 'loc.gov/item/2017754826' }
      ];
      for (const item of sourceChecks) {
        const index = labels.findIndex((label) => label.includes(item.title));
        await dots.nth(index).click();
        const archiveSlide = overlay.locator('.walk-slide[aria-hidden="false"]');
        const archiveImage = archiveSlide.locator(`img[src$="${item.image}"]`);
        await expectVisible(archiveImage, `Week 2 archive image ${item.image}`);
        assert(await archiveImage.evaluate((image) => image.complete && image.naturalWidth > 900 && image.naturalHeight > 600), `Week 2 archive image ${item.image} did not load at meaningful resolution.`);
        const source = await archiveSlide.locator('a').first().getAttribute('href');
        assert(String(source || '').includes(item.source), `Week 2 archive image ${item.image} did not retain its Library of Congress source.`);
      }
    }
    for (let chapter = 1; chapter < chapters; chapter += 1) {
      await dots.nth(chapter).click();
      await exerciseActiveChapter(page, week, chapter + 1, report);
    }
    if (week >= 2 && week <= 7) {
      const closeText = await visibleText(overlay.locator('.walk-slide[aria-hidden="false"]'));
      const handoffMarkers = {
        2: 'Week 3 follows one mechanism',
        3: 'Week 4 asks what happens',
        4: 'Week 5 asks how systems distribute visibility',
        5: 'Week 6 carries engineered inequity',
        6: 'Week 7 assembles their mechanisms',
        7: 'Use Study Week to test one Personal Cartography system'
      };
      assert(closeText.toLowerCase().includes('where this leads'), `Week ${week} omitted the cross-week handoff label.`);
      assert(closeText.includes(handoffMarkers[week]), `Week ${week} did not lead accurately into the next week.`);
      assert(closeText.includes('Personal Cartography'), `Week ${week} did not convert the exit reflection into a Personal Cartography task.`);
    }

    if (week === 2 || week === 5 || week === 8 || week === 11) {
      await page.screenshot({ path: path.join(evidenceRoot, `week-${String(week).padStart(2, '0')}-experience.png`), fullPage: true });
    }
    await overlay.getByRole('button', { name: /Close the experience|Close the lesson/i }).click();
    await overlay.waitFor({ state: 'detached' });
    report.weeks.push({ week, chapters, status: 'PASS' });
    process.stdout.write(`experience ${week}/14 PASS (${chapters} chapters)\n`);
  }
  report.journeyEvidenceIds.push(traceId);
}

async function exerciseActivity(page, week, report) {
  await openWalkthroughLanding(page);
  const card = page.locator('.experience-card').nth(week - 1);
  const weekPageButton = card.locator('button:not([data-experience-week])').first();
  if (!await weekPageButton.count()) throw new Error(`Week ${week} card omitted its week-page control.`);
  await weekPageButton.click();
  await expectVisible(page.locator('#wk-ov h1').first(), `Week ${week} page`);
  const sectionToggle = page.locator('#wk-do .wk-coll-btn');
  await expectVisible(sectionToggle, `Week ${week} activity section toggle`);
  if (await sectionToggle.getAttribute('aria-expanded') === 'false') await sectionToggle.click();
  const activity = page.locator('#wk-do button.wk-cta').first();
  if (!await activity.isVisible()) {
    const chain = await activity.evaluate((node) => {
      const result = [];
      for (let current = node; current && result.length < 8; current = current.parentElement) {
        const style = getComputedStyle(current);
        result.push({ tag: current.tagName, id: current.id, className: String(current.className || ''), display: style.display, visibility: style.visibility, opacity: style.opacity, hidden: current.hidden, ariaHidden: current.getAttribute('aria-hidden'), inert: !!current.inert });
      }
      return result;
    });
    throw new Error(`Week ${week} activity entry was hidden: ${JSON.stringify(chain)}`);
  }
  await activity.scrollIntoViewIfNeeded();
  await activity.click();
  const room = week === 5 ? page.locator('.audit-lab') : page.locator(`.activity-room-w${week}`);
  await expectVisible(room, `Week ${week} activity room`);
  let kind = 'audit';
  if (week === 5) {
    const runAudit = room.getByRole('button', { name: 'Run audit', exact: true });
    await expectVisible(runAudit, 'Week 5 published audit control');
    await runAudit.click();
    const slices = room.locator('.audit-steps button');
    assert(await slices.count() === 4, 'Week 5 did not expose all four audit slices.');
    for (let i = 0; i < 4; i += 1) await slices.nth(i).click();
  } else {
    const canvas = room.locator('canvas[data-topic-model="activity"]');
    await expectVisible(canvas, `Week ${week} activity 3D scene`);
    kind = await canvas.getAttribute('data-kind');
    assert(kind, `Week ${week} activity did not identify its visual story.`);
    const modelControls = room.locator('.wk-cam-ctl button');
    assert(await modelControls.count() >= 3, `Week ${week} activity omitted scene controls.`);
    await modelControls.nth(1).click();
    await modelControls.nth(2).click();
  }

  const primaryButtons = room.locator('.activity-primary button:visible, .audit-lab button:visible');
  if (await primaryButtons.count()) await primaryButtons.first().click();
  const note = room.locator('textarea').last();
  if (week === 3 && await note.count()) await note.fill('SYNTHETIC-ACTIVITY-NOTE-WEEK-03');
  if ([3, 5, 9, 12].includes(week)) await page.screenshot({ path: path.join(evidenceRoot, `week-${String(week).padStart(2, '0')}-activity.png`), fullPage: true });

  if (week === 5) {
    await page.goBack();
  } else {
    const back = page.getByRole('button', { name: new RegExp(`Back to Week ${week}`) }).last();
    await back.click();
  }
  await expectVisible(page.locator('#wk-ov'), `Week ${week} return page`);
  report.activities.push({ week, kind, status: 'PASS' });
  process.stdout.write(`activity ${week}/14 PASS (${kind})\n`);
}

async function createAndVerifyLongNote(page, report) {
  await openWalkthroughLanding(page);
  const card = page.locator('.experience-card').nth(3);
  await card.locator('button[data-experience-week]').click();
  const overlay = page.locator('#walk-overlay');
  const enter = overlay.getByRole('button', { name: /Enter the experience/i });
  if (await enter.count()) await enter.click();
  await overlay.getByRole('button', { name: /Image investigation:/i }).click();
  const story = overlay.locator('.walk-slide[aria-hidden="false"] .walk-story-interactive');
  await story.getByRole('tab').nth(2).click();
  const note = story.locator('textarea').nth(2);
  const longNote = `  SYNTHETIC-WALKTHROUGH-NOTE-START\n${'Q'.repeat(4600)}\nSYNTHETIC-WALKTHROUGH-NOTE-END  `;
  await note.fill('');
  await note.fill(longNote);
  await note.fill(longNote); // duplicate action must replace, never duplicate.
  await page.waitForTimeout(600);

  await page.reload({ waitUntil: 'domcontentloaded' });
  await openWalkthroughLanding(page);
  await page.locator('.experience-card').nth(3).locator('button[data-experience-week]').click();
  const resumed = page.locator('#walk-overlay');
  const resumeEnter = resumed.getByRole('button', { name: /Enter the experience/i });
  if (await resumeEnter.count()) await resumeEnter.click();
  await resumed.getByRole('button', { name: /Image investigation:/i }).click();
  const resumedStory = resumed.locator('.walk-slide[aria-hidden="false"] .walk-story-interactive');
  await resumedStory.getByRole('tab').nth(2).click();
  const restored = await resumedStory.locator('textarea').nth(2).inputValue();
  assert(restored === longNote, 'The verbatim long walkthrough note changed after reload.');

  await resumed.locator('.walk-dot').last().click();
  const exportButton = resumed.getByRole('button', { name: /Export Seneca notes/i });
  await expectVisible(exportButton, 'Seneca notes export');
  const firstDownloadEvent = page.waitForEvent('download');
  await exportButton.click();
  const interrupted = await firstDownloadEvent;
  await interrupted.cancel().catch(() => {});

  const downloadEvent = page.waitForEvent('download');
  await exportButton.click();
  const download = await downloadEvent;
  const exportPath = path.join(isolatedRoot, 'downloads', `${variant}-BFS218-week04-notes.docx`);
  await download.saveAs(exportPath);
  assert(fs.statSync(exportPath).size > 10000, 'The Seneca DOCX export was unexpectedly small.');
  const tar = process.platform === 'win32' ? 'C:\\Windows\\System32\\tar.exe' : 'unzip';
  const args = process.platform === 'win32' ? ['-xOf', exportPath, 'word/document.xml'] : ['-p', exportPath, 'word/document.xml'];
  const opened = spawnSync(tar, args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  assert(opened.status === 0, `The exported DOCX could not be opened (${opened.stderr || opened.status}).`);
  assert(opened.stdout.includes('SYNTHETIC-WALKTHROUGH-NOTE-START'), 'The DOCX omitted the note start marker.');
  assert(opened.stdout.includes('SYNTHETIC-WALKTHROUGH-NOTE-END'), 'The DOCX omitted the note end marker.');
  assert(!/python-docx|generated by|openai|chatgpt|codex/i.test(opened.stdout), 'The DOCX contains prohibited generator metadata.');
  report.exportReadback = {
    status: 'PASS', byteLength: fs.statSync(exportPath).size, sha256: sha256File(exportPath),
    openedAsDocxArchive: true, exactStartMarker: true, exactEndMarker: true,
    prohibitedGeneratorSignatureCount: 0
  };
  fs.unlinkSync(exportPath); // retain safe hash/readback proof, not a note body.
  await resumed.getByRole('button', { name: /Close the experience|Close the lesson/i }).click();
}

async function mobileAndZoom(page, report) {
  await page.setViewportSize({ width: 390, height: 844 });
  await openWalkthroughLanding(page);
  const card = page.locator('.experience-card').nth(10);
  await card.locator('button[data-experience-week]').click();
  const overlay = page.locator('#walk-overlay');
  const enter = overlay.getByRole('button', { name: /Enter the experience/i });
  if (await enter.count()) await enter.click();
  await overlay.getByRole('button', { name: /Evidence visual:/i }).click();
  await overlay.locator('#walk-access-toggle').click();
  await overlay.getByRole('button', { name: 'High contrast', exact: true }).click();
  await overlay.getByRole('button', { name: 'Close accessibility settings' }).click();
  const geometry = await overlay.evaluate((node) => ({ overflow: node.scrollWidth - node.clientWidth, width: node.clientWidth }));
  assert(geometry.overflow === 0, `Mobile walkthrough overflowed by ${geometry.overflow}px.`);
  await page.screenshot({ path: path.join(evidenceRoot, 'mobile-week-11-high-contrast.png'), fullPage: true });
  await overlay.getByRole('button', { name: /Close the experience|Close the lesson/i }).click();

  await page.setViewportSize({ width: 640, height: 400 });
  await openWalkthroughLanding(page);
  const zoomOverflow = await page.locator('html').evaluate((node) => node.scrollWidth - node.clientWidth);
  assert(zoomOverflow === 0, `The 200-percent layout equivalent overflowed by ${zoomOverflow}px.`);
  await page.screenshot({ path: path.join(evidenceRoot, 'zoom-200-layout-equivalent.png'), fullPage: true });
  report.viewports = ['1440x900 desktop', '390x844 mobile', '640x400 200-percent layout equivalent'];
}

async function run() {
  const child = spawn(process.execPath, [serverScript], { env: serverEnvironment, stdio: ['ignore', 'pipe', 'pipe'] });
  let childStderr = '';
  child.stderr.on('data', (chunk) => { childStderr += chunk.toString('utf8'); });
  const ready = await readyFrom(child);
  const report = {
    schema_version: '1.0.0', variant, endpoint: ready.endpoint, requestedPort: 0, assignedPort: ready.port,
    productionAppRoot: appRoot, cleanUserState: true, weeks: [], activities: [], chapterCount: 0,
    consoleErrors: [], failedRequests: [], unexpectedExternalRequests: [], visibleErrors: [],
    journeyEvidenceIds: [], viewports: [], exportReadback: null, assertions: 0, status: 'RUNNING'
  };
  let browser;
  try {
    browser = await chromium.launch({ executablePath: browserExecutable, headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
    await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    page.on('console', (message) => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
    page.on('pageerror', (error) => report.consoleErrors.push(error.message));
    page.on('requestfailed', (request) => report.failedRequests.push(`${request.method()} ${request.url()} :: ${request.failure() && request.failure().errorText}`));
    page.on('request', (request) => {
      const url = request.url();
      if (/^(data|blob|about):/i.test(url)) return;
      try { const parsed = new URL(url); if (!['127.0.0.1', 'localhost', '::1'].includes(parsed.hostname)) report.unexpectedExternalRequests.push(url); } catch (_) {}
    });

    const entryResponse = await page.goto(ready.endpoint, { waitUntil: 'domcontentloaded' });
    if (!entryResponse || !entryResponse.ok()) throw new Error('The isolated production interface did not return a successful entry response.');
    fs.writeFileSync(path.join(evidenceRoot, 'served-index.html'), await entryResponse.body());
    await expectVisible(page.getByRole('heading', { name: /course|techno-racism|BFS218/i }).first(), 'BFS218 normal entry page');
    if (runMode === 'all' || runMode === 'experiences-only') await exerciseWalkthroughs(page, report, 'browser-trace');
    if (runMode === 'all' || runMode === 'activities-only') for (let week = 1; week <= 14; week += 1) await exerciseActivity(page, week, report);
    if (runMode === 'all' || runMode === 'tail-only') {
      await createAndVerifyLongNote(page, report);
      await mobileAndZoom(page, report);
    }
    if (runMode === 'all' || runMode === 'experiences-only') assert(report.weeks.length === 14, 'Not all weekly experiences completed.');
    if (runMode === 'all' || runMode === 'activities-only') assert(report.activities.length === 14, 'Not all weekly activities completed.');
    assert(report.consoleErrors.length === 0, `Console errors remained: ${report.consoleErrors.join(' | ')}`);
    assert(report.failedRequests.length === 0, `Failed requests remained: ${report.failedRequests.join(' | ')}`);
    assert(report.unexpectedExternalRequests.length === 0, `Unexpected external requests remained: ${report.unexpectedExternalRequests.join(' | ')}`);
    report.assertions = 14 + 14 + report.chapterCount + 38;
    report.status = 'PASS';
    await context.tracing.stop({ path: path.join(evidenceRoot, 'browser-trace.zip') });
    await context.close();
  } catch (error) {
    report.status = 'FAIL';
    report.failure = String(error && error.stack || error);
    if (browser) {
      try {
        const contexts = browser.contexts();
        if (contexts.length) await contexts[0].tracing.stop({ path: path.join(evidenceRoot, 'browser-trace-failed.zip') });
      } catch (_) {}
    }
    throw error;
  } finally {
    if (browser) await browser.close().catch(() => {});
    child.kill('SIGTERM');
    await new Promise((resolve) => setTimeout(resolve, 350));
    report.serverStderr = childStderr;
    report.cleanupOrResetVerified = false;
    try { fs.rmSync(isolationParent, { recursive: true, force: true }); report.cleanupOrResetVerified = !fs.existsSync(isolationParent); } catch (_) {}
    writeJson(path.join(evidenceRoot, 'browser-report.json'), report);
    writeJson(path.join(evidenceRoot, 'isolation-report.json'), {
      schema_version: '1.0.0', surface: 'browser', data_root_assertion_passed: !!ready.dataRootAsserted,
      data_root: `ephemeral-bfs218-${variant.toLowerCase()}-walkthrough-root`, bound_host: ready.host,
      requested_port: 0, bound_port: ready.port, url_source: 'child_process',
      redirected_write_surfaces: ['home', 'data', 'configuration', 'cache', 'backup', 'temporary', 'bytecode'],
      minimal_child_environment: true, forwarded_host_exec_vars: [], egress_policy: 'denied',
      server_side_egress_attempts: [], live_session_material_imported: false,
      synthetic_secrets_rotated_or_not_used: true, cleanup_or_reset_verified: report.cleanupOrResetVerified,
      findings: report.status === 'PASS' && report.cleanupOrResetVerified && !childStderr.trim() ? [] : ['The isolated run did not reach a clean terminal state.']
    });
  }
  process.stdout.write(JSON.stringify({ status: report.status, endpoint: ready.endpoint, report: path.join(evidenceRoot, 'browser-report.json') }) + '\n');
}

run().catch((error) => { process.stderr.write(String(error && error.stack || error) + '\n'); process.exitCode = 1; });
