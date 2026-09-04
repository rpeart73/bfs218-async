const { test, expect } = require('playwright/test');
const fs = require('fs');
const { execFileSync } = require('child_process');

const base = process.env.BFS218_AUDIT_URL || 'http://127.0.0.1:8872/index.html';
const browserExecutable = process.env.BFS218_CHROMIUM_EXECUTABLE;
if (browserExecutable) test.use({ launchOptions: { executablePath: browserExecutable } });

const archiveCommand = process.platform === 'win32' ? 'C:\\Windows\\System32\\tar.exe' : 'unzip';
function archiveRead(file, member) {
  const args = process.platform === 'win32' ? ['-xOf', file, member] : ['-p', file, member];
  return execFileSync(archiveCommand, args, { encoding: 'utf8' });
}
function archiveList(file) {
  const args = process.platform === 'win32' ? ['-tf', file] : ['-l', file];
  return execFileSync(archiveCommand, args, { encoding: 'utf8' });
}

async function enterWeek2Scholar(page) {
  await page.goto(`${base}?week=2&experience=1`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#walk-overlay')).toBeVisible();
  const enter = page.getByRole('button', { name: /Enter the experience|Start the interactive lesson/i });
  if (await enter.count()) await enter.click();
  await page.getByRole('button', { name: /Scholar encounter:/i }).click();
  const scholar = page.locator('.walk-slide[aria-hidden="false"] .walk-scholar').first();
  await scholar.locator(':scope > button').click();
  return scholar;
}

async function noteCopies(page) {
  return page.evaluate(async () => {
    const courseKey = Object.keys(localStorage).find((key) => key.startsWith('bfs218corpus.') && key.endsWith('.v2'));
    const local = courseKey ? JSON.parse(localStorage.getItem(courseKey) || '{}') : {};
    const sessionKey = courseKey && `${courseKey}.allStudentNotesMirror.v1`;
    const session = sessionKey ? JSON.parse(sessionStorage.getItem(sessionKey) || 'null') : null;
    const idb = await new Promise((resolve) => {
      const request = indexedDB.open('seneca-student-notes-v1', 2);
      request.onerror = () => resolve(null);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('walkthrough-notes')) db.createObjectStore('walkthrough-notes', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('student-note-vault')) db.createObjectStore('student-note-vault', { keyPath: 'id' });
      };
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('student-note-vault', 'readonly');
        const get = tx.objectStore('student-note-vault').get(courseKey);
        get.onsuccess = () => { const value = get.result || null; db.close(); resolve(value); };
        get.onerror = () => { db.close(); resolve(null); };
      };
    });
    return { courseKey, local, session, idb };
  });
}

test.describe('BFS218 student-authored note integrity', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => new Promise((resolve) => {
      localStorage.clear();
      sessionStorage.clear();
      const request = indexedDB.deleteDatabase('seneca-student-notes-v1');
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
      request.onblocked = () => resolve();
    }));
    await page.goto('about:blank');
  });

  test('verbatim scholar notes survive primary-copy loss and remain separate by lens', async ({ page }) => {
    test.setTimeout(120000);
    const firstNote = '  My exact words — not the site’s.\nSecond line stays here.  ';
    const secondNote = 'Different lens; different thought.\n  Keep this indent.';
    let scholar = await enterWeek2Scholar(page);
    const first = scholar.locator('textarea').first();
    await first.fill(firstNote);
    await scholar.getByRole('tab').nth(1).click();
    const second = scholar.locator('textarea').nth(1);
    await second.fill(secondNote);
    await page.waitForTimeout(500);

    let copies = await noteCopies(page);
    expect(copies.courseKey).toBeTruthy();
    expect(copies.local.walkChapterNotes['2']['scholar-0-lens-0'].text).toBe(firstNote);
    expect(copies.local.walkChapterNotes['2']['scholar-0-lens-1'].text).toBe(secondNote);
    expect(copies.session.maps.walkChapterNotes['2']['scholar-0-lens-0'].text).toBe(firstNote);
    expect(copies.idb.snapshot.maps.walkChapterNotes['2']['scholar-0-lens-1'].text).toBe(secondNote);
    expect(copies.local.wkNotes['2|walkthrough']).toContain(firstNote);
    expect(copies.local.wkNotes['2|walkthrough']).toContain(secondNote);

    await page.evaluate(() => {
      const courseKey = Object.keys(localStorage).find((key) => key.startsWith('bfs218corpus.') && key.endsWith('.v2'));
      localStorage.removeItem(courseKey);
      sessionStorage.clear();
    });

    scholar = await enterWeek2Scholar(page);
    await expect.poll(async () => scholar.locator('textarea').first().inputValue(), { timeout: 10000 }).toBe(firstNote);
    await scholar.getByRole('tab').nth(1).click();
    await expect(scholar.locator('textarea').nth(1)).toHaveValue(secondNote);
    copies = await noteCopies(page);
    expect(copies.local.walkChapterNotes['2']['scholar-0-lens-0'].text).toBe(firstNote);
    expect(copies.local.walkChapterNotes['2']['scholar-0-lens-1'].text).toBe(secondNote);
  });

  test('interactive image notes remain verbatim across reload and every recovery copy', async ({ page }) => {
    const exact = '  The testing rule is the institution — keep my punctuation; exactly.\nSecond line remains mine.  ';
    const openImageNote = async () => {
      await page.goto(`${base}?week=4&experience=1`, { waitUntil: 'domcontentloaded' });
      const enter = page.getByRole('button', { name: /Enter the experience|Start the interactive lesson/i });
      if (await enter.count()) await enter.click();
      await page.getByRole('button', { name: /Image investigation:/i }).click();
      const story = page.locator('.walk-slide[aria-hidden="false"] .walk-story-interactive');
      await story.getByRole('tab').nth(2).click();
      return story.locator('textarea').nth(2);
    };
    let note = await openImageNote();
    await note.fill(exact);
    await page.waitForTimeout(450);
    let copies = await noteCopies(page);
    expect(copies.local.walkChapterNotes['4']['hotspot-2'].text).toBe(exact);
    expect(copies.session.maps.walkChapterNotes['4']['hotspot-2'].text).toBe(exact);
    expect(copies.idb.snapshot.maps.walkChapterNotes['4']['hotspot-2'].text).toBe(exact);
    note = await openImageNote();
    await expect(note).toHaveValue(exact);
  });

  test('Seneca DOCX export preserves student wording and contains no generator signature', async ({ page }) => {
    const exact = '  Evidence, then question — exactly mine.\nDo not rewrite this.  ';
    await enterWeek2Scholar(page);
    await page.locator('.walk-slide[aria-hidden="false"] .walk-scholar').first().locator('textarea').first().fill(exact);
    await page.waitForTimeout(350);
    await page.locator('.walk-dot').last().click();
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Export Seneca notes/i }).click();
    const download = await downloadPromise;
    const file = await download.path();
    expect(file).toBeTruthy();
    expect(fs.statSync(file).size).toBeGreaterThan(10000);

    const documentXml = archiveRead(file, 'word/document.xml');
    const coreXml = archiveRead(file, 'docProps/core.xml');
    const listing = archiveList(file);
    expect(documentXml).toContain('Evidence, then question — exactly mine.');
    expect(documentXml).toContain('Do not rewrite this.  ');
    expect(documentXml).toContain('Student-authored note, preserved exactly');
    expect(coreXml).toContain('<dc:creator>Raymond Peart</dc:creator>');
    expect(coreXml).toContain('<cp:lastModifiedBy>Raymond Peart</cp:lastModifiedBy>');
    expect(`${documentXml}\n${coreXml}\n${listing}`).not.toMatch(/python-docx|generated by|openai|chatgpt|codex/i);
  });

  test('the master notes export organizes every note context without rewriting it', async ({ page }) => {
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    const weekly = '  Weekly activity wording stays exact.  ';
    const study = 'Study-guide thought — my phrasing.';
    const compare = 'Compare line one.\n  Compare line two.';
    await page.evaluate(({ weekly, study, compare }) => {
      SOC.wkNote('1|activity', weekly);
      SOC.sgNote('sg1|c|0', study);
      SOC.cmpNote('sim', compare);
    }, { weekly, study, compare });
    await page.waitForTimeout(350);

    const downloadPromise = page.waitForEvent('download');
    await page.evaluate(() => SOC.exportAllNotes());
    const download = await downloadPromise;
    const file = await download.path();
    const xml = archiveRead(file, 'word/document.xml');
    expect(xml).toContain('Week 1: Introduction to the Course');
    expect(xml).toContain('Activity notes');
    expect(xml).toContain('Study guide');
    expect(xml).toContain('Compare Sources');
    expect(xml).toContain(weekly);
    expect(xml).toContain(study);
    expect(xml).toContain('Compare line one.');
    expect(xml).toContain('Compare line two.');
    expect(xml).toContain('Student-authored note, preserved exactly');
  });

  test('Compare Sources interactions and its Seneca notes export are functional', async ({ page }) => {
    const runtimeErrors = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      SOC.compare(window.BFS218.records[0].id);
      SOC.compare(window.BFS218.records[1].id);
      SOC.go('compare');
    });
    await page.getByRole('button', { name: 'See a worked example' }).click();
    await expect(page.getByText('A WORKED EXAMPLE', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Reveal a model comparison' }).click();
    await expect(page.getByText('A MODEL COMPARISON', { exact: true })).toBeVisible();
    await page.locator('button[onclick="SOC.hideModel()"]')
      .click();
    await expect(page.getByText('A MODEL COMPARISON', { exact: true })).toHaveCount(0);

    const exact = '  My comparison remains mine — exactly.  ';
    await page.getByLabel('Comparison note: Similarities').fill(exact);
    await page.waitForTimeout(300);
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Save my comparison' }).click();
    const download = await downloadPromise;
    const xml = archiveRead(await download.path(), 'word/document.xml');
    expect(xml).toContain(exact);
    expect(xml).toContain('Similarities');
    expect(runtimeErrors).toEqual([]);
  });

  test('an explicit Clear My Work removes primary, mirror, and recovery copies', async ({ page }) => {
    await enterWeek2Scholar(page);
    await page.locator('.walk-slide[aria-hidden="false"] .walk-scholar').first().locator('textarea').first().fill('Private note to remove.');
    await page.waitForTimeout(400);
    page.once('dialog', (dialog) => dialog.accept());
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      page.evaluate(() => SOC.clearMyWork())
    ]);
    const copies = await noteCopies(page);
    expect(copies.local.walkChapterNotes || {}).toEqual({});
    expect(copies.session).toBeNull();
    expect(copies.idb).toBeNull();
  });
});
