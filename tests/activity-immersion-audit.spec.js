const { test, expect } = require('playwright/test');

const base = process.env.BFS218_AUDIT_URL || 'http://127.0.0.1:8872/index.html';
const browserExecutable = process.env.BFS218_CHROMIUM_EXECUTABLE;
const screenshotDirectory = process.env.BFS218_AUDIT_SCREENSHOTS;
if (browserExecutable) test.use({ launchOptions: { executablePath: browserExecutable } });

const expectedKinds = {
  1: 'startermap', 2: 'mechanismatch', 3: 'decisionpath', 4: 'defaultboard',
  5: 'audit', 6: 'surveillanceflow', 7: 'toolkit', 8: 'datastory',
  9: 'promisefunnel', 10: 'thresholdaudit', 11: 'repairtable', 12: 'policydeck',
  13: 'capstonemap', 14: 'futurecompass'
};
const expectedFamilies = {
  1: 'archive', 2: 'garden', 3: 'maze', 4: 'paper', 5: 'paper',
  6: 'archive', 7: 'maze', 8: 'paper', 9: 'archive', 10: 'maze',
  11: 'maze', 12: 'paper', 13: 'terrain', 14: 'garden'
};

async function openSite(page) {
  const ready = await page.evaluate(() => Boolean(window.SOC && typeof window.SOC.startActivity === 'function')).catch(() => false);
  if (ready) return;
  await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => Boolean(window.SOC && typeof window.SOC.startActivity === 'function'), null, { timeout: 60000 });
}

async function openActivity(page, week) {
  await openSite(page);
  await page.evaluate((selectedWeek) => SOC.startActivity('activity', selectedWeek), week);
  await expect(page.locator(`.activity-room-w${week}`)).toBeVisible();
}

test.describe('BFS218 immersive weekly activities', () => {
  test('every week opens a distinct authored room with a meaningful activity model', async ({ page }) => {
    test.setTimeout(180000);
    const rooms = new Set();
    const kinds = new Set();
    const routes = new Set();
    const families = new Set();

    for (let week = 1; week <= 14; week += 1) {
      await openActivity(page, week);
      const room = page.locator(`.activity-room-w${week}`);
      const canvas = room.locator('canvas[data-topic-model="activity"]');
      if (week === 2 || week === 3) {
        await expect(canvas).toHaveCount(0);
        await expect(room.locator('.wk-causal-story')).toBeVisible();
        await expect(room.locator('.wk-model-shell')).toHaveCount(0);
      } else if (week === 6) {
        await expect(canvas).toHaveCount(0);
        await expect(room.locator('.wk-canada-case-trail')).toBeVisible();
        await expect(room.locator('.wk-model-shell')).toHaveCount(0);
      } else if (week === 13 || week === 14) {
        await expect(canvas).toHaveCount(0);
        await expect(room.locator(week === 13 ? '.wk-archive-lab' : '.wk-compass-lab')).toBeVisible();
        await expect(room.locator('.wk-model-shell')).toHaveCount(0);
      } else {
        await expect(canvas).toHaveCount(1);
        await expect(canvas).toBeVisible();
        await expect(canvas).toHaveAttribute('data-kind', expectedKinds[week]);
      }

      const roomName = (await room.locator('.activity-mission .mono').innerText()).replace(/^WEEK\s+\d+\s+·\s+/i, '');
      const route = await room.locator('.activity-mission-route span').allInnerTexts();
      rooms.add(roomName.trim());
      kinds.add(expectedKinds[week]);
      routes.add(route.join(' > '));
      const visual = await page.evaluate((kind) => ({
        family: window.BFS218_HOLO.styleFor(kind),
        frame: window.BFS218_HOLO.frame(kind, false)
      }), expectedKinds[week]);
      expect(visual.family, `Week ${week} should use its intended visual grammar`).toBe(expectedFamilies[week]);
      families.add(visual.family);
      expect(visual.frame.cam).toHaveLength(3);
      expect(visual.frame.look).toHaveLength(3);
      expect(await page.evaluate(() => window.BFS218_HOLO.version)).toBeGreaterThanOrEqual(12);

      const geometry = await room.locator('.activity-zone').first().evaluate((node) => {
        const r = node.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom, viewportHeight: window.innerHeight, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
      });
      expect(geometry.top, `Week ${week} first authored zone should begin in the first viewport`).toBeLessThan(geometry.viewportHeight);
      expect(geometry.bottom).toBeGreaterThan(0);
      expect(geometry.overflow).toBe(0);
      if (![2, 3, 6, 13, 14].includes(week)) {
        const modelGap = await room.locator('.activity-zone-model').evaluate((node) => {
          const box = node.getBoundingClientRect();
          const bottoms = Array.from(node.children).filter((child) => getComputedStyle(child).display !== 'none').map((child) => child.getBoundingClientRect().bottom);
          return Math.round(box.bottom - Math.max(box.top, ...bottoms));
        });
        expect(modelGap, `Week ${week} model zone should not contain a blank tail`).toBeLessThanOrEqual(24);
        if (screenshotDirectory) await room.locator('.activity-zone-model').screenshot({ path: `${screenshotDirectory}/week-${String(week).padStart(2, '0')}-activity-model.png` });
      }
    }

    expect(rooms.size).toBe(14);
    expect(kinds.size).toBe(14);
    expect(routes.size).toBeGreaterThanOrEqual(6);
    expect([...families].sort()).toEqual(['archive', 'garden', 'maze', 'paper', 'terrain']);
  });

  test('the five visual families use materially different viewpoints', async ({ page }) => {
    test.setTimeout(120000);
    await openSite(page);
    const signatures = await page.evaluate(() => {
      const samples = ['startermap', 'mechanismatch', 'decisionpath', 'defaultboard', 'capstonemap'];
      return samples.map((kind) => {
        const f = window.BFS218_HOLO.frame(kind, false);
        return { family: window.BFS218_HOLO.styleFor(kind), camera: f.cam.map((n) => Number(n.toFixed(2))).join(',') };
      });
    });
    expect(new Set(signatures.map((entry) => entry.family)).size).toBe(5);
    expect(new Set(signatures.map((entry) => entry.camera)).size).toBe(5);
  });

  test('portrait framing keeps every visual family inside the mobile viewport', async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width: 390, height: 844 });
    for (const week of [1, 2, 3, 4, 8]) {
      await openActivity(page, week);
      if (week === 2 || week === 3) {
        const story = page.locator(`.activity-room-w${week} .wk-causal-story`);
        const geometry = await story.evaluate((node) => {
          const r = node.getBoundingClientRect();
          return { left: r.left, right: r.right, viewportWidth: window.innerWidth, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
        });
        expect(geometry.left).toBeGreaterThanOrEqual(0);
        expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth);
        expect(geometry.overflow).toBe(0);
        await expect(page.locator(`.activity-room-w${week} img.wk-model-render`)).toHaveCount(0);
        await expect(page.locator(`.activity-room-w${week} .wk-model-shell`)).toHaveCount(0);
        continue;
      }
      const canvas = page.locator(`.activity-room-w${week} canvas[data-topic-model="activity"]`);
      await expect.poll(() => canvas.evaluate((node) => Boolean(node.__topicViewApi)), { timeout: 20000 }).toBe(true);
      const geometry = await canvas.evaluate((node) => {
        const r = node.getBoundingClientRect();
        return { left: r.left, right: r.right, viewportWidth: window.innerWidth, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
      });
      expect(geometry.left, `Week ${week} canvas should not clip on the left`).toBeGreaterThanOrEqual(0);
      expect(geometry.right, `Week ${week} canvas should not clip on the right`).toBeLessThanOrEqual(geometry.viewportWidth);
      expect(geometry.overflow, `Week ${week} should not create horizontal overflow`).toBe(0);
    }
  });

  test('representative 3D rooms initialise and expose scene controls', async ({ page }) => {
    test.setTimeout(120000);
    for (const week of [4, 7, 9, 12]) {
      await openActivity(page, week);
      const canvas = page.locator(`.activity-room-w${week} canvas[data-topic-model="activity"]`);
      await expect.poll(() => canvas.evaluate((node) => Boolean(node.__topicViewApi)), { timeout: 20000 }).toBe(true);
      await expect(page.locator(`.activity-room-w${week} .wk-cam-ctl button`)).toHaveCount(5);
    }
  });

  test('Weeks 2 and 3 use direct guided investigations without separate graphic environments', async ({ page }) => {
    for (const week of [2, 3]) {
      await openActivity(page, week);
      const room = page.locator(`.activity-room-w${week}`);
      await expect(room.locator('.wk-causal-story')).toBeVisible();
      await expect(room.locator('canvas[data-topic-model="activity"]')).toHaveCount(0);
      await expect(room.locator('.wk-model-shell')).toHaveCount(0);
      await expect(room.locator('img.wk-model-render')).toHaveCount(0);
    }
    expect(await page.evaluate(() => ({
      week2Signature: window.BFS218_HOLO.activitySignature('mechanismatch'),
      week2Asset: window.BFS218_HOLO.activityAsset('mechanismatch'),
      week3Signature: window.BFS218_HOLO.activitySignature('decisionpath'),
      week3Asset: window.BFS218_HOLO.activityAsset('decisionpath')
    }))).toEqual({ week2Signature: null, week2Asset: null, week3Signature: null, week3Asset: null });
  });

  test('Weeks 2 and 3 teach the techno-racism mechanism through guided decision paths', async ({ page }) => {
    test.setTimeout(120000);
    const cases = {
      2: {
        steps: ['Existing racial inequality', 'Technology makes a choice', 'Unequal burden looks objective'],
        concept: 'New Jim Code',
        caution: 'Intent is not enough',
        strong: 'stronger critical race theory question'
      },
      3: {
        steps: ['An unequal pattern already exists', 'Design turns a name into a proxy', 'The system amplifies the burden'],
        concept: 'engineered inequity',
        caution: 'old pattern becomes the new target',
        strong: 'stops treating racialized names as risk'
      }
    };

    for (const [weekText, expected] of Object.entries(cases)) {
      const week = Number(weekText);
      await openActivity(page, week);
      const room = page.locator(`.activity-room-w${week}`);
      const story = room.locator('.wk-causal-story');
      const shell = room.locator('.wk-model-shell[data-rendered-environment="true"]');
      await expect(story).toBeVisible();
      await expect(story).toContainText(week === 3 ? 'fictional matched-application audit' : 'fictional housing example');
      await expect(story).toContainText('How this shows techno-racism');
      await expect(story).toContainText(expected.concept);

      if (week === 3) {
        const audit = story.locator('.wk-applicant-audit');
        const safeName = audit.locator('.wk-safe-name');
        const applicants = [
          { name: 'Ali Khan', proxy: 'surname KHAN', perceived: 'South Asian or Muslim-coded', result: 'Extra review' },
          { name: 'Tyrone Smith', proxy: 'given name TYRONE', perceived: 'perceived Black', result: 'Denied' },
          { name: 'Christopher Parker', proxy: 'full name CHRISTOPHER PARKER', perceived: 'perceived White', result: 'Approved' }
        ];
        await expect(audit).toBeVisible();
        await expect(audit).toContainText('same verified income, complete references, and no current rent arrears');
        await expect(audit).toContainText('Only the name changes');
        await expect(safeName).toBeVisible();
        await expect(safeName).toContainText('processes it only on this page and does not save it');
        const safeNameInput = safeName.locator('[data-safe-name-input]');
        const safeNameOutput = safeName.locator('[data-safe-name-output]');
        const safeNameQuestion = safeName.locator('[data-safe-name-question]');
        await expect(safeNameQuestion).toBeHidden();
        await safeName.getByRole('button', { name: 'Inspect the filter' }).click();
        await expect(safeNameOutput).toContainText('Enter a name or fictional alias first');
        await expect(safeNameInput).toBeFocused();
        const storedBefore = await page.evaluate(() => JSON.stringify({
          local: Object.entries(localStorage),
          session: Object.entries(sessionStorage)
        }));
        await safeNameInput.fill('Jordan Example');
        await safeName.getByRole('button', { name: 'Inspect the filter' }).click();
        await expect(safeNameOutput).toContainText('JORDAN · EXAMPLE');
        await expect(safeNameOutput).toContainText('racial proxy');
        await expect(safeNameOutput).toContainText('does not infer identity');
        await expect(safeNameOutput).toContainText('approval or denial');
        await expect(safeNameQuestion).toBeVisible();
        const unsafeNameDecision = safeName.locator('[data-safe-name-decision="allow"]');
        const safeNameDecision = safeName.locator('[data-safe-name-decision="separate"]');
        await unsafeNameDecision.click();
        await expect(safeName.locator('[data-safe-name-feedback]')).toContainText('That recreates the problem');
        await safeNameDecision.click();
        await expect(safeNameDecision).toHaveAttribute('aria-pressed', 'true');
        await expect(unsafeNameDecision).toHaveAttribute('aria-pressed', 'false');
        await expect(safeName.locator('[data-safe-name-feedback]')).toContainText('Stronger design choice');
        await expect(safeName.locator('[data-safe-name-feedback]')).toContainText('Keep it out of risk scoring');
        const storedAfter = await page.evaluate(() => JSON.stringify({
          local: Object.entries(localStorage),
          session: Object.entries(sessionStorage)
        }));
        expect(storedAfter).toBe(storedBefore);
        expect(storedAfter.toLowerCase()).not.toContain('jordan example');
        const applicantButtons = audit.locator('[data-applicant-case]');
        await expect(applicantButtons).toHaveCount(3);
        for (let index = 0; index < applicants.length; index += 1) {
          const applicant = applicants[index];
          const choice = applicantButtons.nth(index);
          await expect(choice).toContainText(applicant.name);
          await choice.click();
          await expect(choice).toHaveAttribute('aria-pressed', 'true');
          const next = audit.locator('[data-applicant-next]');
          await next.click();
          await expect(audit.locator('[data-applicant-stage="1"]')).toHaveClass(/is-current/);
          await next.click();
          await expect(audit.locator('[data-applicant-stage="2"]')).toContainText(applicant.proxy);
          await expect(audit.locator('[data-applicant-stage="2"]')).toContainText(applicant.perceived);
          await next.click();
          await expect(audit.locator('[data-applicant-stage="3"]')).toContainText('biased past approvals');
          await next.click();
          await expect(choice).toHaveAttribute('data-complete', 'true');
          await expect(audit.locator('[data-applicant-filter-result]')).toContainText(applicant.result);
        }
        await expect(audit.locator('[data-applicant-conclusion]')).toBeVisible();
        await expect(audit.locator('[data-applicant-conclusion]')).toContainText('same current evidence, different treatment');
        await expect(audit.locator('[data-applicant-conclusion]')).toContainText('engineered inequity');
        await expect(audit).toContainText('A name does not establish a person\'s race, ethnicity, religion, or tenancy risk');
      }

      const steps = story.locator('.wk-causal-step');
      await expect(steps).toHaveCount(3);
      for (let index = 0; index < expected.steps.length; index += 1) {
        await expect(steps.nth(index)).toContainText(expected.steps[index]);
        await steps.nth(index).click();
        await expect(steps.nth(index)).toHaveAttribute('aria-pressed', 'true');
      }
      await expect(shell).toHaveCount(0);
      await expect(room.locator('canvas[data-topic-model="activity"]')).toHaveCount(0);
      if (week === 3) {
        await expect(story.locator('[data-applicant-conclusion]')).toBeVisible();
        await expect(story.locator('[data-safe-name-input]')).toHaveValue('Jordan Example');
      }

      const choices = story.locator('[data-causal-choice]');
      await expect(choices).toHaveCount(2);
      await choices.nth(0).click();
      await expect(choices.nth(0)).toHaveAttribute('aria-pressed', 'true');
      await expect(story.locator('.wk-causal-result')).toContainText(expected.caution);
      await expect(story.locator('.wk-causal-result')).toHaveClass(/is-caution/);
      await choices.nth(1).click();
      await expect(choices.nth(1)).toHaveAttribute('aria-pressed', 'true');
      await expect(story.locator('.wk-causal-result')).toContainText(expected.strong);
      await expect(story.locator('.wk-causal-result')).toHaveClass(/is-strong/);
      await expect(shell).toHaveCount(0);
      if (week === 3) {
        await expect(story.locator('[data-applicant-conclusion]')).toBeVisible();
      }
      if (screenshotDirectory) await story.screenshot({ path: `${screenshotDirectory}/week-${String(week).padStart(2, '0')}-guided-techno-racism-case.png` });
    }

    await page.setViewportSize({ width: 390, height: 844 });
    for (const week of [2, 3]) {
      await openActivity(page, week);
      const story = page.locator(`.activity-room-w${week} .wk-causal-story`);
      const geometry = await story.evaluate((node) => {
        const box = node.getBoundingClientRect();
        return { left: box.left, right: box.right, viewport: document.documentElement.clientWidth, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
      });
      expect(geometry.left, `Week ${week} guided case should stay inside the mobile viewport`).toBeGreaterThanOrEqual(0);
      expect(geometry.right, `Week ${week} guided case should stay inside the mobile viewport`).toBeLessThanOrEqual(geometry.viewport);
      expect(geometry.overflow, `Week ${week} guided case should not create horizontal overflow`).toBe(0);
      await expect(story.locator('.wk-causal-step')).toHaveCount(3);
      await expect(story.locator('[data-causal-choice]')).toHaveCount(2);
      if (screenshotDirectory) await story.screenshot({ path: `${screenshotDirectory}/week-${String(week).padStart(2, '0')}-guided-techno-racism-case-mobile.png` });
    }
  });

  test('Week 4 uses a full default-control investigation and a realistic compact model', async ({ page }) => {
    test.setTimeout(120000);
    await openActivity(page, 4);
    const room = page.locator('.activity-room-w4');
    const lab = room.locator('.wk-default-lab');
    await expect(lab).toBeVisible();
    await expect(lab.locator('.wk-default-case')).toHaveCount(4);
    await expect(lab.locator('.wk-default-workbench > article')).toHaveCount(3);

    for (let index = 0; index < 4; index += 1) {
      await lab.locator('.wk-default-case').nth(index).click();
      const toggle = lab.locator('.wk-default-switch');
      await expect(toggle).toContainText('Run this default');
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-pressed', 'true');
      await expect(lab.locator('.wk-default-output')).toHaveClass(/is-running/);
      await lab.getByRole('button', { name: 'A systemic default' }).click();
      await expect(lab.locator('.wk-default-finding')).toContainText('failure is systemic');
    }
    await expect(lab.locator('.wk-default-complete')).toContainText('default becomes discriminatory');
    await lab.locator('.wk-default-case').first().click();
    await expect(lab).toContainText('Malcolm Ten');

    const canvas = room.locator('canvas[data-kind="defaultboard"]');
    await expect.poll(() => canvas.evaluate((node) => node.__topicMetrics && node.__topicMetrics().activityOverhaul), { timeout: 20000 }).toBe('bfs218-w04-default-control-room-real-v2');
    const modelGeometry = await canvas.evaluate((node) => {
      const box = node.getBoundingClientRect();
      return { height: Math.round(box.height), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    });
    expect(modelGeometry.height).toBeLessThanOrEqual(360);
    expect(modelGeometry.overflow).toBe(0);
  });

  test('Week 6 keeps four Canadian case files separate and source bounded', async ({ page }) => {
    test.setTimeout(120000);
    await openActivity(page, 6);
    const room = page.locator('.activity-room-w6');
    const lab = room.locator('.wk-canada-case-trail');
    await expect(lab).toBeVisible();
    await expect(room.locator('canvas[data-topic-model="activity"]')).toHaveCount(0);
    await expect(lab.locator('.wk-case-file-tab')).toHaveCount(4);

    const requiredBoundaries = [
      'Coded exposure is the course lens',
      'did not find that the tools were proven inaccurate',
      'cannot be used to claim one national system',
      'must not be merged into the RCMP or Ewert cases'
    ];
    for (let index = 0; index < 4; index += 1) {
      await lab.locator('.wk-case-file-tab').nth(index).click();
      for (let step = 0; step < 4; step += 1) await lab.locator('.wk-case-reveal').click();
      await expect(lab).toContainText(requiredBoundaries[index]);
      await lab.getByRole('button', { name: /Keep the documented finding, course lens, and evidence limit separate/i }).click();
      await expect(lab.locator('.wk-case-claim-result')).toContainText('Source boundary held');
    }
    await lab.locator('.wk-case-file-tab').first().click();
    await expect(lab).toContainText('contravened federal privacy law');
    await lab.locator('.wk-case-file-tab').nth(1).click();
    await expect(lab).toContainText('section 24(1)');
  });

  test('Week 7 assembles five meaningful system roles without drag dependence', async ({ page }) => {
    test.setTimeout(120000);
    await openActivity(page, 7);
    const room = page.locator('.activity-room-w7');
    const lab = room.locator('.wk-anatomy-lab');
    await expect(lab).toBeVisible();
    await expect(lab).toContainText('Nothing needs to be dragged');
    await expect(lab.locator('.wk-anatomy-case')).toHaveCount(3);
    await expect(lab.locator('.wk-anatomy-part')).toHaveCount(5);
    await expect(lab.locator('.wk-anatomy-track li')).toHaveCount(5);

    for (let index = 0; index < 5; index += 1) await lab.locator('.wk-anatomy-part:not(:disabled)').first().click();
    await expect(lab.locator('.wk-anatomy-track li.is-placed')).toHaveCount(5);
    await lab.getByRole('button', { name: /Trace the records, rule, deployment, decision/i }).click();
    await expect(lab.locator('.wk-anatomy-reading')).toContainText('Coded exposure');
    await expect(lab).toContainText('does not establish a self-reinforcing feedback loop');

    const canvas = room.locator('canvas[data-kind="toolkit"]');
    await expect.poll(() => canvas.evaluate((node) => node.__topicMetrics && node.__topicMetrics().activityOverhaul), { timeout: 20000 }).toBe('bfs218-w07-system-anatomy-bench-real-v2');
    const modelGeometry = await canvas.evaluate((node) => {
      const box = node.getBoundingClientRect();
      return { height: Math.round(box.height), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    });
    expect(modelGeometry.height).toBeLessThanOrEqual(360);
    expect(modelGeometry.overflow).toBe(0);
  });

  test('Weeks 4 and 7 keep optional 3D inspection draggable', async ({ page }) => {
    test.setTimeout(120000);
    for (const week of [4, 7]) {
      await openActivity(page, week);
      const canvas = page.locator(`.activity-room-w${week} canvas[data-topic-model="activity"]`);
      await expect.poll(() => canvas.evaluate((node) => Boolean(node.__topicMetrics)), { timeout: 20000 }).toBe(true);
      await canvas.scrollIntoViewIfNeeded();
      await expect(canvas).toBeVisible();
      const box = await canvas.boundingBox();
      expect(box).toBeTruthy();
      await page.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.48);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.48, { steps: 8 });
      await page.mouse.up();
      await expect(canvas).toHaveAttribute('data-dragged', '1');
      const metrics = await canvas.evaluate((node) => node.__topicMetrics && node.__topicMetrics());
      expect(Math.abs(metrics.rotationY), `Week ${week} should visibly respond to a horizontal drag`).toBeGreaterThan(0.03);
    }
  });

  test('Weeks 4, 6, and 7 use the phone viewport without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const selectors = { 4: '.wk-default-lab', 6: '.wk-canada-case-trail', 7: '.wk-anatomy-lab' };
    for (const week of [4, 6, 7]) {
      await openActivity(page, week);
      const surface = page.locator(`.activity-room-w${week} ${selectors[week]}`);
      const geometry = await surface.evaluate((node) => {
        const box = node.getBoundingClientRect();
        return { left: box.left, right: box.right, viewport: document.documentElement.clientWidth, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
      });
      expect(geometry.left, `Week ${week} should stay inside the left edge`).toBeGreaterThanOrEqual(0);
      expect(geometry.right, `Week ${week} should stay inside the right edge`).toBeLessThanOrEqual(geometry.viewport);
      expect(geometry.overflow, `Week ${week} should not create horizontal scrolling`).toBe(0);
    }
  });

  test('the repaired activity models teach the actual weekly task in plain language', async ({ page }) => {
    test.setTimeout(120000);
    const required = {
      1: ['Ordinary tool', 'Hidden assumption', 'Map entry'],
      7: ['Data and rule', 'Deployment and decision', 'Feedback loop'],
      8: ['RHS record', 'Four OCAP® responsibilities', 'Scope boundary', 'Ownership', 'Control', 'Access', 'Possession'],
      9: ['promised benefit', 'surveillance, sorting, or control', 'burden, refusal, decision authority'],
      10: ['study boundary', 'model from policy', 'explanation and recourse'],
      11: ['community knowledge', 'network work', 'governance authority'],
      12: ['historical status', 'argued gap', 'institutional response']
    };
    for (const [weekText, phrases] of Object.entries(required)) {
      const week = Number(weekText);
      await openActivity(page, week);
      const model = page.locator(`.activity-room-w${week} .activity-zone-model`);
      const canvas = model.locator('canvas[data-topic-model="activity"]');
      const text = `${await model.innerText()} ${await canvas.getAttribute('aria-label')}`;
      for (const phrase of phrases) expect(text, `Week ${week} should teach "${phrase}"`).toContain(phrase);
    }

    await openActivity(page, 7);
    await expect(page.locator('.activity-room-w7 .activity-zone-model')).not.toContainText(/assemble your review kit|choose a week|return point/i);
    await openActivity(page, 8);
    await expect(page.locator('.activity-room-w8 .activity-zone-model')).not.toContainText(/pick a policy move|system, institution, law, or rights|what does it fix and cost/i);
    await openActivity(page, 10);
    await expect(page.locator('.activity-room-w10 .activity-zone-model')).not.toContainText(/Default\s*Switch\s*Cost/i);
  });

  test('each repaired 3D story exposes and preserves all three learning states', async ({ page }) => {
    test.setTimeout(240000);
    for (const week of [1, 7, 8, 9, 10, 11, 12]) {
      await openActivity(page, week);
      const room = page.locator(`.activity-room-w${week}`);
      const states = room.locator('.wk-scene-key-step');
      await expect(states).toHaveCount(3);
      const canvas = room.locator('canvas[data-topic-model="activity"]');
      await expect(states.nth(0)).toHaveAttribute('aria-pressed', 'true');
      await expect(canvas).toHaveAttribute('data-view', 'predict');
      /* One representative room exercises the intermediate transition. Every
         repaired room exercises Explain, where the old camera swing clipped
         the teaching composition. This avoids rebuilding 21 WebGL rooms. */
      const transitions = week === 7 ? [1, 2] : [2];
      for (const index of transitions) {
        await states.nth(index).click();
        const current = room.locator('.wk-scene-key-step').nth(index);
        await expect(current).toHaveAttribute('aria-pressed', 'true');
        const view = ['predict', 'try', 'explain'][index];
        await expect(canvas).toHaveAttribute('data-view', view);
      }
      await page.waitForTimeout(900);
      const rotation = await canvas.evaluate((node) => node.__topicMetrics && node.__topicMetrics());
      expect(Math.abs(rotation.rotationX), `Week ${week} should keep the explanation composition upright`).toBeLessThanOrEqual(0.16);
      expect(Math.abs(rotation.rotationY), `Week ${week} should keep the explanation composition in frame`).toBeLessThanOrEqual(0.16);
    }
  });

  test('Weeks 8-12 use documented cases, preserve their evidence limits, and reach the intended learning result', async ({ page }) => {
    test.setTimeout(240000);
    const signatures = {
      8: 'bfs218-w08-rhs-governance-table-real-v1',
      9: 'bfs218-w09-benevolence-case-xray-real-v1',
      10: 'bfs218-w10-threshold-review-desk-real-v1',
      11: 'bfs218-w11-dctp-community-network-real-v1',
      12: 'bfs218-w12-aida-evidence-docket-real-v1'
    };

    await openActivity(page, 8);
    let room = page.locator('.activity-room-w8');
    await expect(room).toContainText('First Nations Regional Health Survey');
    await expect(room).toContainText('cannot be used as an Inuit or Métis governance framework');
    for (let index = 0; index < 4; index += 1) await room.locator('.wk-rhs-principle button').nth(index).click();
    await room.locator('.wk-rhs-scope button').first().click();
    await expect(room.locator('.wk-case-claim-result')).toContainText('erases an important boundary');
    await room.locator('.wk-rhs-scope button').nth(1).click();
    await expect(room.locator('.wk-activity-complete')).toContainText('Access to a report is not the same as ownership');

    await openActivity(page, 9);
    room = page.locator('.activity-room-w9');
    await expect(room).toContainText('Electronic monitoring as an alternative to confinement');
    await expect(room).toContainText('Amazon\'s scrapped recruitment tool');
    await expect(room).toContainText('Health-care hotspotting');
    for (let index = 0; index < 3; index += 1) {
      await room.locator('.wk-benevolence-promise button').nth(index).click();
      await room.locator('.wk-benevolence-case').nth(index).locator('.wk-benevolence-judgement button').first().click();
      await expect(room.locator('.wk-benevolence-case').nth(index).locator('.wk-benevolence-result')).toContainText('benefit is real');
      await room.locator('.wk-benevolence-case').nth(index).locator('.wk-benevolence-judgement button').nth(1).click();
    }
    await expect(room).toContainText('gender-related failure in one discontinued tool');
    await expect(room.locator('.wk-activity-complete')).toContainText('kept the benefit visible');

    await openActivity(page, 10);
    room = page.locator('.activity-room-w10');
    await expect(room).toContainText('5,168,903 student-course observations');
    await expect(room).toContainText('385,800 students');
    await expect(room).toContainText('allocation was simulated');
    await room.locator('.wk-threshold-policy button').nth(1).click();
    for (const [index, choice] of [[0, 0], [1, 0], [2, 1]]) await room.locator('.wk-threshold-rows article').nth(index).locator('button').nth(choice).click();
    await expect(room.locator('.wk-activity-complete')).toContainText('institution still chooses the target, cutoff, support rule');

    await openActivity(page, 11);
    room = page.locator('.activity-room-w11');
    await expect(room).toContainText('Detroit Community Technology Project');
    await expect(room).toContainText('design, install, and maintain wireless mesh networks');
    for (let index = 0; index < 4; index += 1) await room.locator('.wk-dctp-roles article').nth(index).locator('button').nth(1).click();
    await expect(room.locator('.wk-activity-complete')).toContainText('Residents do not merely receive a finished network');

    await openActivity(page, 12);
    room = page.locator('.activity-room-w12');
    await expect(room).toContainText('proposal did not become law');
    await expect(room).toContainText('not findings adopted by a court or parliamentary committee');
    for (let index = 0; index < 5; index += 1) {
      await room.locator('.wk-aida-tabs button').nth(index).click();
      await room.locator('.wk-aida-docket section button').nth(index).click();
    }
    await expect(room.locator('.wk-activity-complete')).toContainText('five criticisms to five institutional responses');

    for (const [weekText, signature] of Object.entries(signatures)) {
      const week = Number(weekText);
      await openActivity(page, week);
      const canvas = page.locator(`.activity-room-w${week} canvas[data-topic-model="activity"]`);
      await expect.poll(() => canvas.evaluate((node) => node.__topicMetrics && node.__topicMetrics().activityOverhaul), { timeout: 20000 }).toBe(signature);
      const geometry = await canvas.evaluate((node) => ({ height: Math.round(node.getBoundingClientRect().height), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
      expect(geometry.height, `Week ${week} model should remain compact enough to manipulate comfortably`).toBeLessThanOrEqual(360);
      expect(geometry.overflow).toBe(0);
    }
  });

  test('Weeks 13 and 14 use the student\'s actual saved evidence without inventing or writing the conclusion', async ({ page }) => {
    test.setTimeout(120000);
    await openSite(page);
    await page.evaluate(() => {
      SOC.wkReflect(1, 'My early entry names a hiring screen but does not yet explain how old approval patterns shape the result.');
      SOC.wkNote('8|activity', 'My later entry separates ownership, control, access, and possession in the real RHS case.');
    });

    await openActivity(page, 13);
    let room = page.locator('.activity-room-w13');
    await expect(room.locator('canvas[data-topic-model="activity"]')).toHaveCount(0);
    await expect(room.locator('.activity-zone-model')).toHaveCount(0);
    await room.locator('.wk-archive-pickers section').first().locator('button:not(:disabled)').first().click();
    await room.locator('.wk-archive-pickers section').nth(1).locator('button:not(:disabled)').first().click();
    await expect(room.locator('.wk-archive-compare')).toContainText('My early entry names a hiring screen');
    await expect(room.locator('.wk-archive-compare')).toContainText('My later entry separates ownership');
    await room.locator('.wk-archive-change button').nth(1).click();
    await expect(room.locator('.wk-activity-complete')).toContainText('Comparison built from your evidence');
    await expect(room).toContainText('does not infer growth for you');

    await openActivity(page, 14);
    room = page.locator('.activity-room-w14');
    await expect(room.locator('canvas[data-topic-model="activity"]')).toHaveCount(0);
    await expect(room.locator('.activity-zone-model')).toHaveCount(0);
    await room.locator('.wk-compass-builder select').selectOption('0');
    for (let index = 0; index < 3; index += 1) await room.locator('.wk-compass-builder section').nth(index).locator('button').first().click();
    await expect(room.locator('.wk-compass-plan')).toContainText('My early entry names a hiring screen');
    await expect(room.locator('.wk-compass-plan')).toContainText('This is a plan, not your final answer');
    await expect(room).toContainText('without asking the site to write your conclusion');
  });

  test('Weeks 8-14 remain usable on a phone and saved activity decisions survive a reload', async ({ page }) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width: 390, height: 844 });
    const surfaces = { 8: '.wk-rhs-lab', 9: '.wk-benevolence-lab', 10: '.wk-threshold-lab', 11: '.wk-dctp-lab', 12: '.wk-aida-lab', 13: '.wk-archive-lab', 14: '.wk-compass-lab' };
    await openActivity(page, 8);
    await page.locator('.wk-rhs-principle button').first().click();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('.activity-room-w8 .wk-rhs-principle').first()).toHaveClass(/is-open/);

    for (let week = 8; week <= 14; week += 1) {
      await openActivity(page, week);
      const surface = page.locator(`.activity-room-w${week} ${surfaces[week]}`);
      const geometry = await surface.evaluate((node) => {
        const box = node.getBoundingClientRect();
        return { left: box.left, right: box.right, viewport: document.documentElement.clientWidth, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
      });
      expect(geometry.left, `Week ${week} should stay inside the phone viewport`).toBeGreaterThanOrEqual(0);
      expect(geometry.right, `Week ${week} should stay inside the phone viewport`).toBeLessThanOrEqual(geometry.viewport);
      expect(geometry.overflow, `Week ${week} should not create horizontal scrolling`).toBe(0);
    }
  });

  test('the design studio is deterministic and never presents invented population results', async ({ page }) => {
    await openActivity(page, 2);
    const studio = page.locator('.sim-lab');
    await expect(studio).toContainText('SYSTEM DESIGN STUDIO');
    await expect(studio).toContainText('no fake people, random cases, or population percentages');
    await expect(studio.getByRole('button', { name: 'Run one case' })).toHaveCount(0);
    await expect(studio.getByRole('button', { name: 'Run 100 cases' })).toHaveCount(0);
    await studio.getByRole('button', { name: 'Interpret this configuration' }).click();
    await expect(studio.locator('.sim-reading')).toBeVisible();
    expect(await studio.locator('.sim-reading').innerText()).not.toMatch(/\d+\s*%/);

    const activityGuide = await page.evaluate(() => window.BFS218_HOWTO.byScreen.activity || null);
    if (activityGuide) {
      const guideText = JSON.stringify(activityGuide);
      expect(guideText).not.toMatch(/run one case|run one hundred|then the simulation/i);
      expect(guideText).toContain('Compare system designs deliberately');
    }
  });

  test('the walkthrough action room responds before handing off to the full guided activity', async ({ page }) => {
    await page.goto(`${base}?week=3&experience=1`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: /Enter the experience|Start the interactive lesson/i }).click();
    await page.getByRole('button', { name: /Action room:/i }).click();

    const preview = page.locator('.walk-slide[aria-hidden="false"] .walk-interactive-scenario');
    await expect(preview).toBeVisible();
    const feedback = preview.locator('[data-walk-feedback]');
    const before = await feedback.innerText();
    await preview.locator('button[data-feedback]').first().click();
    await expect(feedback).not.toHaveText(before);
    await expect(preview.locator('button[data-feedback]').first()).toHaveAttribute('aria-pressed', 'true');

    await preview.getByRole('button', { name: /Open the full activity/i }).click();
    await expect(page.locator('#walk-overlay')).toHaveCount(0);
    await expect(page.locator('.activity-room-w3 .wk-causal-story')).toBeVisible();
    await expect(page.locator('.activity-room-w3 canvas[data-topic-model="activity"]')).toHaveCount(0);
    await expect(page.locator('.activity-room-w3 .wk-model-shell')).toHaveCount(0);
    if (screenshotDirectory) await page.screenshot({ path: `${screenshotDirectory}/week03-immersive-activity.png`, fullPage: true });
  });

  test('Week 5 safely recreates the published Coded Gaze audit without a webcam or live classifier', async ({ page }) => {
    test.setTimeout(120000);
    const requestedMedia = [];
    await page.addInitScript(() => {
      window.__mediaRequests = [];
      if (navigator.mediaDevices) navigator.mediaDevices.getUserMedia = (...args) => { window.__mediaRequests.push(args); throw new Error('Camera access is forbidden in this activity'); };
    });
    page.on('request', (request) => {
      if (/camera|webcam|face-api|vision-api|clarifai/i.test(request.url())) requestedMedia.push(request.url());
    });

    await page.goto(`${base}?week=5&experience=1`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: /Enter the experience|Start the interactive lesson/i }).click();
    await page.getByRole('button', { name: /Action room:/i }).click();
    const preview = page.locator('.walk-slide[aria-hidden="false"]');
    await expect(preview.locator('.walk-audit-trays button')).toHaveCount(4);
    await expect(preview).toContainText('34.7% error');
    await preview.getByRole('button', { name: /Run the full Coded Gaze audit/i }).click();

    const lab = page.locator('.audit-lab');
    await expect(lab).toBeVisible();
    await expect(page.getByText(/teaching re-enactment|re-enacts/i)).toBeVisible();
    await expect(lab.locator('.audit-system')).toHaveCount(3);
    const auditModelGeometry = await lab.locator('.audit-model-canvas').evaluate((node) => Math.round(node.getBoundingClientRect().height));
    expect(auditModelGeometry).toBeLessThanOrEqual(350);
    for (const label of ['Failure pattern', 'Audit pipeline', 'Free rotate']) {
      await lab.getByRole('button', { name: label }).click();
      await expect(lab.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'true');
    }
    await expect(lab.getByRole('button', { name: 'Run audit' })).toBeVisible();
    await lab.getByRole('button', { name: 'Run audit' }).click();
    await expect(lab.locator('.audit-model-canvas')).toHaveAttribute('data-run', '1');
    const dataTable = page.locator('table').filter({ hasText: 'RESULTS (DATA TABLE)' });
    await expect(dataTable.locator('tbody tr')).toHaveCount(4);
    await expect(dataTable).toContainText('34.7%');
    await expect(dataTable).toContainText('Published error rate');
    await expect(lab).toContainText(/rounded visual translation|normalized scale/i);
    await expect(lab).toContainText(/not the study sample size|not faces or participant counts/i);
    await expect(lab).not.toContainText('Faces failed of 25');

    const publishedSliceRates = {
      Overall: ['12.1%'],
      Gender: ['5.6%', '20.3%'],
      'Skin type': ['3.2%', '22.4%'],
      Intersectional: ['0.3%', '7.1%', '12.0%', '34.7%']
    };
    const sliceSummaries = [];
    for (const label of ['Overall', 'Gender', 'Skin type', 'Intersectional']) {
      await lab.getByRole('button', { name: new RegExp(`^${label}`) }).click();
      sliceSummaries.push((await lab.locator('.audit-wall > p').innerText()).trim());
      for (const rate of publishedSliceRates[label]) await expect(lab.locator('#bfs-bars')).toContainText(rate);
    }
    expect(new Set(sliceSummaries).size).toBe(4);
    await expect(page.locator('body')).toContainText(/published audit|published Gender Shades/i);
    await expect(page.locator('body')).toContainText(/not running a live classifier/i);
    expect(await page.evaluate(() => window.__mediaRequests)).toEqual([]);
    expect(requestedMedia).toEqual([]);
  });

  test('fact-check boundaries replace misleading legacy diagrams and preserve source scope', async ({ page }) => {
    await openSite(page);
    const retired = await page.evaluate(() => {
      const weeks = [3, 6, 8, 10, 12];
      return weeks.flatMap((week) => (window.BFS218_WALKFIGS[week] || []).map((figure) => figure.file));
    });
    expect(retired).not.toContain('fig-intersectionality.svg');
    expect(retired).not.toContain('fig-week06.svg');
    expect(retired).not.toContain('fig-week06-b.svg');
    expect(retired).not.toContain('fig-week06-c.svg');
    expect(retired).not.toContain('fig-week08.svg');
    expect(retired).not.toContain('fig-week08-b.svg');
    expect(retired).not.toContain('fig-week08-c.svg');
    expect(retired).not.toContain('fig-week10-b.svg');
    expect(retired).not.toContain('fig-week12.svg');
    expect(retired).not.toContain('fig-week12-b.svg');
    expect(retired).not.toContain('fig-week12-c.svg');

    await page.evaluate(() => { SOC.station(6); SOC.wkColl('wk-con'); });
    const policing = await page.locator('#wk-con').innerText();
    expect(policing).toContain('patchwork of Charter, privacy, human-rights, and criminal-law safeguards');
    expect(policing).not.toMatch(/authorized through court rulings/i);
    await page.evaluate(() => { SOC.wkColl('wk-gq'); SOC.wkColl('wk-term'); });
    const policingBoundaries = await page.locator('#wk-gq, #wk-term').allInnerTexts();
    expect(policingBoundaries.join(' ')).toContain('public reporting, independent review, and accessible remedies');
    expect(policingBoundaries.join(' ')).not.toMatch(/much (?:of it |algorithmic policing )?(?:has been |is )authorized (?:through|by) court rulings/i);

    await page.evaluate(() => { SOC.station(8); SOC.wkColl('wk-con'); SOC.wkColl('wk-term'); });
    await expect(page.locator('#wk-con')).toContainText('OCAP®');
    await expect(page.locator('#wk-con')).toContainText('specifically First Nations framework');
    await expect(page.locator('#wk-con')).toContainText('First Nations, Inuit, and Métis governance must be treated as distinct');
  });
});
