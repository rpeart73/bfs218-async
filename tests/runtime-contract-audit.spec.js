const { test, expect } = require('playwright/test');

const base = process.env.BFS218_AUDIT_URL || 'http://127.0.0.1:8872/index.html';
const browserExecutable = process.env.BFS218_CHROMIUM_EXECUTABLE;
if (browserExecutable) test.use({ launchOptions: { executablePath: browserExecutable } });

test.describe('BFS218 browser runtime contract', () => {
  test('every authored SOC action has a callable runtime handler', async ({ page, request }) => {
    const sourceUrl = new URL('app.js', base).href;
    const response = await request.get(sourceUrl);
    expect(response.ok(), `Could not read ${sourceUrl}`).toBeTruthy();
    const source = await response.text();
    const authoredCalls = [...source.matchAll(/\bSOC\.([A-Za-z_$][\w$]*)\s*\(/g)].map((match) => match[1]);
    const uniqueCalls = [...new Set(authoredCalls)].sort();
    expect(uniqueCalls.length).toBeGreaterThan(25);

    const runtimeErrors = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    const missing = await page.evaluate((names) => names.filter((name) => typeof window.SOC?.[name] !== 'function'), uniqueCalls);

    expect(missing, `Missing SOC handlers referenced by app.js: ${missing.join(', ')}`).toEqual([]);
    expect(runtimeErrors).toEqual([]);
  });
});
