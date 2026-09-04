const { test, expect } = require('playwright/test');

const base = process.env.BFS218_AUDIT_URL || 'http://127.0.0.1:8872/index.html';
const browserExecutable = process.env.BFS218_CHROMIUM_EXECUTABLE;
if (browserExecutable) test.use({ launchOptions: { executablePath: browserExecutable } });

test.describe('BFS218 multiple-choice option order', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); });
  });

  test('correct answers occupy every available position across the knowledge bank', async ({ page }) => {
    test.setTimeout(180000);
    await page.goto(base, { waitUntil: 'networkidle' });
    const positions = [];
    let mappedQuestions = 0;

    for (let week = 1; week <= 14; week += 1) {
      await page.evaluate((selectedWeek) => SOC.station(selectedWeek), week);
      if (!(await page.locator('#wk-kc').count())) continue;
      for (const set of [0, 1]) {
        await page.evaluate(({ selectedWeek, selectedSet }) => SOC.kcVer(selectedWeek, selectedSet), { selectedWeek: week, selectedSet: set });
        const result = await page.locator('#wk-kc').evaluate((section) => {
          const bank = [];
          Object.values(window.BFS218_KC || {}).forEach((items) => bank.push(...items));
          Object.values(window.BFS218_MC || {}).forEach((items) => bank.push(...items));
          const found = [];
          section.querySelectorAll('[id^="kcq-"]').forEach((card) => {
            const questionText = (card.querySelector('p') || {}).textContent || '';
            const authored = bank.find((item) => item && item.q && questionText.includes(item.q));
            const buttons = Array.from(card.querySelectorAll('button[data-option-index]'));
            if (!authored || buttons.length < 4) return;
            found.push(buttons.findIndex((button) => Number(button.dataset.optionIndex) === Number(authored.answer)));
          });
          return found;
        });
        positions.push(...result);
        mappedQuestions += result.length;
      }
    }

    expect(mappedQuestions).toBeGreaterThan(40);
    expect(new Set(positions)).toEqual(new Set([0, 1, 2, 3]));
    for (const position of [0, 1, 2, 3]) {
      expect(positions.filter((value) => value === position).length).toBeGreaterThan(3);
    }
  });

  test('visual shuffling preserves the authored answer identity used for scoring', async ({ page }) => {
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(() => SOC.station(4));
    const audit = await page.locator('#wk-kc [id^="kcq-"]').first().evaluate((card) => {
      const questionText = (card.querySelector('p') || {}).textContent || '';
      const bank = Object.values(window.BFS218_KC || {}).flat().concat(Object.values(window.BFS218_MC || {}).flat());
      const authored = bank.find((item) => item && item.q && questionText.includes(item.q));
      const buttons = Array.from(card.querySelectorAll('button[data-option-index]'));
      const correctButton = authored && buttons.find((button) => Number(button.dataset.optionIndex) === Number(authored.answer));
      return correctButton ? { originalIndex: Number(correctButton.dataset.optionIndex), position: buttons.indexOf(correctButton), text: correctButton.textContent.trim() } : null;
    });

    expect(audit).not.toBeNull();
    const correct = page.locator('#wk-kc [id^="kcq-"]').first().locator(`button[data-option-index="${audit.originalIndex}"]`);
    await correct.evaluate((button) => button.click());
    await expect(correct).toHaveAttribute('aria-pressed', 'true');
  });
});
