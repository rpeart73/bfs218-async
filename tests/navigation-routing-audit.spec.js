const { test, expect } = require('playwright/test');

const base = process.env.BFS218_AUDIT_URL || 'http://127.0.0.1:8872/index.html';
const browserExecutable = process.env.BFS218_CHROMIUM_EXECUTABLE || process.env.SENECA_CHROMIUM_EXECUTABLE;
if (browserExecutable) test.use({ launchOptions: { executablePath: browserExecutable } });

async function reset(page) {
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.goto(base, { waitUntil: 'domcontentloaded' });
}

test.describe('BFS218 navigation and shareable routes', () => {
  test.beforeEach(async ({ page }) => reset(page));

  test('Weekly Journey is nested inside Learn Each Week', async ({ page }) => {
    const group = page.locator('.soc-nav-group').filter({ hasText: 'LEARN EACH WEEK' }).first();
    await expect(group).toBeVisible();
    const label = group.getByText('WEEKLY JOURNEY', { exact: true });
    const range = group.getByText('Weeks 1-14', { exact: true });
    await expect(label).toBeVisible();
    await expect(range).toBeVisible();
    const labelBox = await label.boundingBox(), rangeBox = await range.boundingBox();
    expect(labelBox.y + labelBox.height).toBeLessThanOrEqual(rangeBox.y + 1);
    await expect(group.getByText(/Weekly Experiences|Interactive Lessons/, { exact: true })).toBeVisible();
  });

  test('the normal weekly lesson directory exposes all fourteen weeks', async ({ page }) => {
    await page.locator("button[onclick=\"SOC.go('walkthroughs')\"]").first().click();
    const cards = page.locator('.experience-card');
    await expect(cards).toHaveCount(14);
    for (let week = 1; week <= 14; week += 1) {
      await expect(cards.nth(week - 1).getByText(`WEEK ${week}`, { exact: true })).toBeVisible();
      await expect(cards.nth(week - 1).locator('button[data-experience-week]')).toBeVisible();
      await expect(cards.nth(week - 1).locator('button:not([data-experience-week])').first()).toBeVisible();
    }
  });

  test('screens and weeks write distinct URLs and survive reload', async ({ page }) => {
    await page.evaluate(() => SOC.go('readings'));
    await expect.poll(() => new URL(page.url()).searchParams.get('screen')).toBe('readings');
    await page.evaluate(() => SOC.station(5));
    await expect.poll(() => new URL(page.url()).searchParams.get('week')).toBe('5');
    expect(new URL(page.url()).searchParams.has('screen')).toBeFalsy();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#soc-main')).toContainText(/Week 5/i);
    expect(await page.evaluate(() => history.state.stationWeek)).toBe(5);
  });

  test('source routes are shareable and Back and Forward restore the matching page', async ({ page }) => {
    const sourceId = await page.evaluate(() => BFS218.records[0].id);
    await page.evaluate((id) => SOC.open(id), sourceId);
    await expect.poll(() => new URL(page.url()).searchParams.get('item')).toBe(sourceId);
    await page.reload({ waitUntil: 'domcontentloaded' });
    expect(await page.evaluate(() => history.state.detailId)).toBe(sourceId);

    await page.evaluate(() => SOC.station(5));
    await page.evaluate(() => SOC.go('glossary'));
    await expect.poll(() => new URL(page.url()).searchParams.get('screen')).toBe('glossary');
    await page.evaluate(() => history.back());
    await expect.poll(() => new URL(page.url()).searchParams.get('week')).toBe('5');
    expect(await page.evaluate(() => history.state.stationWeek)).toBe(5);
    await page.evaluate(() => history.forward());
    await expect.poll(() => new URL(page.url()).searchParams.get('screen')).toBe('glossary');
  });
});
