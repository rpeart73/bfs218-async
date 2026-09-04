/* Verify that the real local BFS218 pages identify themselves to YouTube embeds. */
'use strict';

const { chromium } = require('playwright');

const browserExecutable = process.env.BFS218_CHROMIUM_EXECUTABLE || undefined;
const roots = process.argv.slice(2);
const sites = roots.length ? roots : ['http://127.0.0.1:8872/index.html', 'http://127.0.0.1:8873/index.html'];
const videos = [
  { week: 2, id: '41sF9ZTRTD4', label: 'Jim Crow historical explainer' },
  { week: 5, id: '3Ihvjo8oh9k', label: 'Joy Buolamwini explainer' }
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function verifyVideo(browser, site, video) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  let embedHeaders = null;
  page.on('request', (request) => {
    if (request.url().includes(`/embed/${video.id}`)) {
      embedHeaders = request.allHeaders().catch(() => ({}));
    }
  });
  await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.goto(`${site}?week=${video.week}&experience=1`, { waitUntil: 'domcontentloaded' });
  const overlay = page.locator('#walk-overlay');
  await overlay.getByRole('button', { name: /Enter the experience|Start the interactive lesson/i }).click();
  await overlay.getByRole('button', { name: /Short video:/i }).click();
  await overlay.locator('.walk-video-load').click();
  const iframe = overlay.locator(`iframe[src*="/embed/${video.id}"]`);
  await iframe.waitFor({ state: 'visible', timeout: 15000 });
  assert(await iframe.getAttribute('referrerpolicy') === 'strict-origin-when-cross-origin', `${video.label} iframe omitted the required referrer policy.`);

  for (let attempt = 0; attempt < 40 && !embedHeaders; attempt += 1) await page.waitForTimeout(250);
  assert(embedHeaders, `${video.label} did not request the YouTube player.`);
  const headers = await embedHeaders;
  assert(/^http:\/\/127\.0\.0\.1:\d+\/?$/i.test(headers.referer || ''), `${video.label} did not send the local course origin as its HTTP Referer.`);

  const iframeHandle = await iframe.elementHandle();
  const playerFrame = iframeHandle && await iframeHandle.contentFrame();
  assert(playerFrame, `${video.label} player frame was not attached.`);
  await playerFrame.locator('#movie_player').waitFor({ state: 'attached', timeout: 20000 });
  await page.waitForTimeout(2500);
  const errorText = await playerFrame.locator('.ytp-error').innerText().catch(() => '');
  assert(!/error\s*153|video player configuration error/i.test(errorText), `${video.label} still returned YouTube error 153.`);
  const playerClass = await playerFrame.locator('#movie_player').getAttribute('class');
  assert(!/ytp-error/i.test(playerClass || ''), `${video.label} entered YouTube's error state.`);
  await context.close();
  process.stdout.write(`${site} · Week ${video.week} · ${video.label}: PASS\n`);
}

(async () => {
  const browser = await chromium.launch({ executablePath: browserExecutable, headless: true });
  try {
    for (const site of sites) for (const video of videos) await verifyVideo(browser, site, video);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  process.stderr.write(String(error && error.stack || error) + '\n');
  process.exitCode = 1;
});
