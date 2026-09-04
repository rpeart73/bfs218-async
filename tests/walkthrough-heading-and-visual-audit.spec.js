const { test, expect } = require('playwright/test');

const base = process.env.BFS218_AUDIT_URL || 'http://127.0.0.1:8872/index.html';
const browserExecutable = process.env.BFS218_CHROMIUM_EXECUTABLE;
const screenshotDirectory = process.env.BFS218_AUDIT_SCREENSHOTS;
if (browserExecutable) test.use({ launchOptions: { executablePath: browserExecutable } });

test.describe('BFS218 walkthrough heading and visual integrity', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.setViewportSize({ width: 1151, height: 769 });
  });

  test('all fourteen entry screens use the available title width and hide chapter navigation until entry', async ({ page }) => {
    test.setTimeout(180000);
    await page.goto(base, { waitUntil: 'domcontentloaded' });

    for (let week = 1; week <= 14; week += 1) {
      await page.evaluate((selectedWeek) => SOC.enterExperience(selectedWeek), week);
      const overlay = page.locator('#walk-overlay');
      await expect(overlay).toBeVisible();
      await expect(overlay.locator('.walk-bar')).toHaveCount(0);

      const title = overlay.locator('.walk-slide[aria-hidden="false"] .walk-title');
      if (await title.count()) {
        const geometry = await title.evaluate((node) => {
          const style = getComputedStyle(node);
          const rect = node.getBoundingClientRect();
          const parent = node.parentElement.getBoundingClientRect();
          return {
            lines: Math.round(rect.height / parseFloat(style.lineHeight)),
            width: rect.width,
            available: parent.width
          };
        });
        expect(geometry.lines, `Week ${week} entry title should remain on one line when space exists`).toBe(1);
        expect(geometry.width, `Week ${week} title should use the full entry column`).toBeLessThanOrEqual(geometry.available + 1);
      }

      await overlay.locator('.walk-enter').click();
      await expect(overlay.locator('.walk-bar')).toBeVisible();
      await page.evaluate(() => SOC.walkClose());
    }
  });

  test('every visible walkthrough heading is unpunctuated, contained, and paired with a real visual chapter', async ({ page }) => {
    test.setTimeout(240000);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(base, { waitUntil: 'domcontentloaded' });

    for (let week = 1; week <= 14; week += 1) {
      await page.evaluate((selectedWeek) => SOC.enterExperience(selectedWeek), week);
      await page.locator('#walk-overlay .walk-enter').click();
      const dots = page.locator('#walk-overlay .walk-dot');
      const count = await dots.count();
      let visualChapters = 0;

      for (let chapter = 0; chapter < count; chapter += 1) {
        await dots.nth(chapter).click();
        const slide = page.locator('#walk-overlay .walk-slide[aria-hidden="false"]');
        await expect(slide).toHaveCount(1);
        const audit = await slide.evaluate((node) => {
          const box = node.getBoundingClientRect();
          const headings = Array.from(node.querySelectorAll('h1,h2,h3,h4,h5,h6')).filter((heading) => {
            const style = getComputedStyle(heading);
            return style.display !== 'none' && style.visibility !== 'hidden';
          }).map((heading) => {
            const rect = heading.getBoundingClientRect();
            return { text: heading.textContent.trim(), left: rect.left, right: rect.right };
          });
          const hasVisual = Boolean(node.querySelector('img,canvas,svg,.bev-shell,.walk-diagram-gallery,.walk-case-gallery,.walk-video-story,.walk-story-interactive'));
          return { headings, box: { left: box.left, right: box.right }, hasVisual };
        });
        if (audit.hasVisual) visualChapters += 1;
        for (const heading of audit.headings) {
          expect(heading.text, `Week ${week}, chapter ${chapter + 1} heading should not end with a period`).not.toMatch(/\.$/);
          expect(heading.left, `Week ${week}, chapter ${chapter + 1} heading should not clip left`).toBeGreaterThanOrEqual(audit.box.left - 2);
          expect(heading.right, `Week ${week}, chapter ${chapter + 1} heading should not clip right`).toBeLessThanOrEqual(audit.box.right + 2);
        }
      }

      expect(visualChapters, `Week ${week} should tell part of its story visually`).toBeGreaterThanOrEqual(2);
      await page.evaluate(() => SOC.walkClose());
    }

    expect(errors).toEqual([]);
  });

  test('Week 3 makes the robot question visible before explaining the mechanism', async ({ page }) => {
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => SOC.enterExperience(3));
    await page.locator('#walk-overlay .walk-enter').click();
    await page.getByRole('button', { name: /Visual story: A robot can carry a hierarchy into action/i }).click();
    const slide = page.locator('#walk-overlay .walk-slide[aria-hidden="false"]');
    await expect(slide.locator('img')).toHaveAttribute('src', /robot-bias-jhu\.jpg/);
    await expect(slide).toContainText('The machine has no hatred');
    await expect(slide).toContainText('Evidence boundary');
    await expect(slide.getByRole('link', { name: /View record/i })).toHaveAttribute('href', /hub\.jhu\.edu\/2022\/06\/21\/flawed-artificial-intelligence/);
  });

  test('Weeks 4, 9, and 12 use different image interactions and preserve evidence boundaries', async ({ page }) => {
    const cases = [
      { week: 4, chapter: /Image investigation:/i, count: 3, title: 'The default travels into testing', image: /default-body-crash-test\.jpg/ },
      { week: 9, chapter: /Change the lens:/i, count: 3, title: 'Freedom arrives with conditions', image: /electronic-monitor-aclu\.jpg/ },
      { week: 12, chapter: /Policy layers:/i, count: 4, title: 'What can a person do when harmed?', image: /eu-ai-act-vote\.jpg/ }
    ];
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    for (const item of cases) {
      await page.evaluate((week) => SOC.enterExperience(week), item.week);
      await page.locator('#walk-overlay .walk-enter').click();
      await page.getByRole('button', { name: item.chapter }).click();
      const slide = page.locator('#walk-overlay .walk-slide[aria-hidden="false"]');
      await expect(slide.locator('.walk-story-interactive')).toBeVisible();
      await expect(slide.locator('.walk-story-image>img')).toHaveAttribute('src', item.image);
      await expect(slide.locator('[role="tab"]')).toHaveCount(item.count);
      await slide.locator('[role="tab"]').last().click();
      await expect(slide.locator('.walk-story-panel:not([hidden]) h3')).toHaveText(item.title);
      await expect(slide).toContainText('Evidence boundary');
      const imageReady = await slide.locator('.walk-story-image>img').evaluate((image) => image.complete && image.naturalWidth > 300 && image.naturalHeight > 200);
      expect(imageReady, `Week ${item.week} story image should load at meaningful resolution`).toBe(true);
      if (screenshotDirectory) await slide.screenshot({ path: `${screenshotDirectory}/week-${String(item.week).padStart(2, '0')}-interactive-story.png` });
      await page.evaluate(() => SOC.walkClose());
    }
  });
});
