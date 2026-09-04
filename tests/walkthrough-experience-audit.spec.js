const { test, expect } = require('playwright/test');

const base = process.env.BFS218_AUDIT_URL || 'http://127.0.0.1:8872/index.html';
const browserExecutable = process.env.BFS218_CHROMIUM_EXECUTABLE;
const screenshotDirectory = process.env.BFS218_AUDIT_SCREENSHOTS;
if (browserExecutable) test.use({ launchOptions: { executablePath: browserExecutable } });

async function freshExperience(page, week) {
  await page.goto(`${base}?week=${week}&experience=1`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#walk-overlay')).toBeVisible();
  await page.getByRole('button', { name: /Enter the experience|Start the interactive lesson|Enter Week 8/i }).click();
}

test.describe('BFS218 immersive weekly experiences', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); });
  });

  test('every authored chapter opens, contains teaching content, and remains inside the viewport', async ({ page }) => {
    test.setTimeout(180000);
    const runtimeErrors = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));

    for (let week = 1; week <= 14; week += 1) {
      await freshExperience(page, week);
      const dots = page.locator('.walk-dot');
      const chapterCount = await dots.count();
      expect(chapterCount, `Week ${week} chapter count`).toBeGreaterThanOrEqual(6);

      for (let chapter = 1; chapter < chapterCount; chapter += 1) {
        await dots.nth(chapter).click();
        const active = page.locator('.walk-slide[aria-hidden="false"]');
        await expect(active).toHaveCount(1);
        await expect(active).toBeVisible();
        const content = await active.evaluate((node) => String(node.innerText || '').replace(/\s+/g, ' ').trim());
        expect(content.length, `Week ${week}, chapter ${chapter + 1}`).toBeGreaterThan(20);
        expect(await page.locator('.walk-slide[aria-hidden="true"]:not([inert])').count()).toBe(0);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `Week ${week}, chapter ${chapter + 1} horizontal overflow`).toBe(0);
      }
    }

    expect(runtimeErrors).toEqual([]);
  });

  test('documentary 3D rooms explain each state and respond to all three controls', async ({ page }) => {
    test.setTimeout(120000);
    const runtimeErrors = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));

    for (const week of [2, 9, 11]) {
      await freshExperience(page, week);
      await page.getByRole('button', { name: /Evidence visual:/i }).click();
      const active = page.locator('.walk-slide[aria-hidden="false"]');
      const canvas = active.locator('canvas[data-topic-model="overview"]');
      await expect(canvas).toBeVisible();
      await expect.poll(() => canvas.evaluate((node) => Boolean(node.__topicViewApi)), { timeout: 20000 }).toBe(true);

      const summaries = [];
      for (const view of ['observe', 'path', 'risk']) {
        const control = active.locator(`[data-model-view="${view}"]`);
        await control.click();
        await expect(control).toHaveAttribute('aria-pressed', 'true');
        const summary = await active.locator('.walk-model-summary').innerText();
        expect(summary.trim().length).toBeGreaterThan(30);
        summaries.push(summary);
      }
      expect(new Set(summaries).size, `Week ${week} distinct 3D explanations`).toBe(3);

      if (screenshotDirectory && week === 2) await page.screenshot({ path: `${screenshotDirectory}/week02-model-desktop.png`, fullPage: true });
    }

    expect(runtimeErrors).toEqual([]);
  });

  test('keyboard navigation, accessibility display, and mobile 3D remain usable', async ({ page }) => {
    await freshExperience(page, 11);
    await page.getByRole('button', { name: /Evidence visual:/i }).click();
    await page.getByRole('button', { name: 'Accessibility', exact: true }).click();
    await page.getByRole('button', { name: 'High contrast', exact: true }).click();
    await expect(page.locator('#walk-overlay')).toHaveClass(/walk-contrast/);
    await page.getByRole('button', { name: 'Close accessibility settings' }).click();

    await page.setViewportSize({ width: 390, height: 844 });
    const canvas = page.locator('.walk-slide[aria-hidden="false"] canvas[data-topic-model="overview"]');
    await expect(canvas).toBeVisible();
    const geometry = await canvas.evaluate((node) => {
      const r = node.getBoundingClientRect();
      return { left: r.left, right: r.right, viewport: document.documentElement.clientWidth, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    });
    expect(geometry.left).toBeGreaterThanOrEqual(0);
    expect(geometry.right).toBeLessThanOrEqual(geometry.viewport);
    expect(geometry.overflow).toBe(0);
    if (screenshotDirectory) await page.screenshot({ path: `${screenshotDirectory}/week11-model-mobile-contrast.png`, fullPage: true });

    await page.keyboard.press('Escape');
    await expect(page.locator('#walk-overlay')).toHaveCount(0);
  });

  test('visual sequences expose three authored images with controls that change the visible argument', async ({ page }) => {
    await freshExperience(page, 3);
    await page.getByRole('button', { name: /Interactive visual sequence:/i }).click();
    const active = page.locator('.walk-slide[aria-hidden="false"]');
    const tabs = active.getByRole('tab');
    await expect(tabs).toHaveCount(3);
    await expect(active.getByRole('tabpanel', { includeHidden: true })).toHaveCount(3);
    const visibleSources = [];
    for (let i = 0; i < 3; i += 1) {
      await tabs.nth(i).click();
      await expect(tabs.nth(i)).toHaveAttribute('aria-selected', 'true');
      const panel = active.locator('[role="tabpanel"]:visible');
      await expect(panel).toHaveCount(1);
      visibleSources.push(await panel.locator('img').getAttribute('src'));
    }
    expect(new Set(visibleSources).size).toBe(3);
    await expect(active.getByRole('button', { name: /reset|rotate/i })).toHaveCount(0);
  });

  test('Week 8 begins with the customized land acknowledgement', async ({ page }) => {
    await page.goto(`${base}?week=8&experience=1`, { waitUntil: 'domcontentloaded' });
    const first = page.locator('.walk-slide[aria-hidden="false"]');
    await expect(first).toContainText('LAND ACKNOWLEDGEMENT');
    await expect(first).toContainText('Anishinaabe');
    await expect(first).toContainText('Haudenosaunee');
    await expect(first).toContainText('Wendat');
    await expect(first).toContainText('Treaty 13');
    await expect(first).toContainText('Williams Treaties');
    await expect(first).toContainText(/data as relationships|authority and responsibility/i);
    const setting = first.locator('.walk-land-sky > img');
    await expect(setting).toBeVisible();
    await expect(setting).toHaveAttribute('src', /odeyto-first-peoples\.jpg/);
    await expect(setting).toHaveAttribute('alt', /Odeyto.*First Peoples gathering space/i);
  });
});
