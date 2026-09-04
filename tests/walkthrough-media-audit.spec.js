const { test, expect } = require('playwright/test');

const base = process.env.BFS218_AUDIT_URL || 'http://127.0.0.1:8872/index.html';
const browserExecutable = process.env.BFS218_CHROMIUM_EXECUTABLE;
if (browserExecutable) test.use({ launchOptions: { executablePath: browserExecutable } });

async function openExperience(page, week) {
  await page.goto(`${base}?week=${week}&experience=1`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#walk-overlay')).toBeVisible();
  await page.getByRole('button', { name: /Enter the experience|Start the interactive lesson|Enter Week 8/i }).click();
}

test.describe('BFS218 purposeful walkthrough media', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); });
  });

  test('the two authored walkthrough excerpts are short, contextual, captioned, and click-to-load', async ({ page }) => {
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    const media = await page.evaluate(() => {
      const found = [];
      Object.entries((window.BFS218_VISUAL_STORIES || {}).weeks || {}).forEach(([week, record]) => {
        (record.stories || []).forEach((story) => { if (story.kind === 'video') found.push({ week: Number(week), ...story }); });
      });
      return found;
    });
    expect(media).toHaveLength(2);
    expect(media.map((item) => item.week).sort((a, b) => a - b)).toEqual([2, 5]);
    for (const item of media) {
      expect(item.end - item.start).toBeLessThan(180);
      expect(item.transcript.length).toBeGreaterThan(100);
      expect(item.watchFor.length).toBeGreaterThan(80);
    }
    expect(media.find((item) => item.week === 2).duration).toMatch(/2:45/);
    expect(media.find((item) => item.week === 5).duration).toMatch(/under 1 minute/i);

    await openExperience(page, 2);
    await page.getByRole('button', { name: /Short video:/i }).click();
    const active = page.locator('.walk-slide[aria-hidden="false"]');
    await expect(active.locator('.walk-video-story')).toBeVisible();
    await expect(active.locator('iframe')).toHaveCount(0);
    await expect(active).toContainText('Captions on');
    await expect(active).toContainText('2:45 excerpt');

    const load = active.locator('.walk-video-load');
    await expect(load).toHaveAttribute('data-start', '0');
    await expect(load).toHaveAttribute('data-end', '165');
    await load.click();
    const frame = active.locator('iframe');
    await expect(frame).toBeVisible();
    await expect(frame).toHaveAttribute('src', /youtube-nocookie\.com\/embed\/41sF9ZTRTD4.*end=165.*cc_load_policy=1/);
    await expect(frame).toHaveAttribute('referrerpolicy', 'strict-origin-when-cross-origin');

    await openExperience(page, 5);
    await page.getByRole('button', { name: /Short video:/i }).click();
    const scholarVoice = page.locator('.walk-slide[aria-hidden="false"]');
    await expect(scholarVoice).toContainText('under 1 minute');
    await expect(scholarVoice.locator('iframe')).toHaveCount(0);
    await scholarVoice.locator('.walk-video-load').click();
    await expect(scholarVoice.locator('iframe')).toHaveAttribute('src', /youtube-nocookie\.com\/embed\/3Ihvjo8oh9k.*end=59.*cc_load_policy=1/);
    await expect(scholarVoice.locator('iframe')).toHaveAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  });

  test('the other twelve walkthroughs do not receive a generic video chapter', async ({ page }) => {
    test.setTimeout(180000);
    for (let week = 1; week <= 14; week += 1) {
      if (week === 2 || week === 5) continue;
      await openExperience(page, week);
      await expect(page.locator('#walk-overlay video,#walk-overlay iframe')).toHaveCount(0);
      await expect(page.locator('.walk-video-story,.walk-tour-room')).toHaveCount(0);
    }
  });

  test('legacy weekly video metadata cannot add an unauthored walkthrough chapter', async ({ page }) => {
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      window.BFS218_VIDEOS[7] = {
        file: 'videos/should-never-render.mp4',
        poster: 'videos/should-never-render.jpg',
        vtt: 'videos/should-never-render.vtt'
      };
      SOC.enterExperience(7);
    });
    await expect(page.locator('#walk-overlay')).toBeVisible();
    await page.getByRole('button', { name: /Enter the experience|Start the interactive lesson/i }).click();
    await expect(page.locator('#walk-overlay video,#walk-overlay iframe')).toHaveCount(0);
    await expect(page.locator('.walk-video-story,.walk-tour-room')).toHaveCount(0);
  });

  test('page guides remain step-based and contain no site-tour video', async ({ page }) => {
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    const guideFields = await page.evaluate(() => {
      const screens = Object.values((window.BFS218_HOWTO && window.BFS218_HOWTO.byScreen) || {});
      return screens.flatMap((screen) => Object.keys(screen).filter((key) => key === 'video' || key === 'captions'));
    });
    expect(guideFields).toEqual([]);
    expect(await page.locator('body').innerText()).not.toMatch(/watch the video tour|video tour coming soon/i);
  });
});
