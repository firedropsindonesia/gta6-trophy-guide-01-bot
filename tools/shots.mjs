// Takes the entry's 4 screenshots with Playwright Chromium: serves app/
// on localhost, seeds localStorage progress to 13 of 55 earned, and
// captures the checklist (with a guide open), a trophy guide detail,
// the roadmap and the missables page — 1280x800 JPEG, quality 82.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
// Playwright is not installed in the repo (nothing is installed for an
// entry); it resolves from the local npx cache, so run this script with
// NODE_PATH set to that cache's node_modules, e.g.
// NODE_PATH=$HOME/.npm/_npx/e41f203b7505f1fb/node_modules node tools/shots.mjs
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('..', import.meta.url));
const shotsDir = join(here, 'screenshots');
const SEEDED = [2, 3, 4, 5, 8, 9, 15, 16, 17, 18, 19, 21, 35]; // 13 earned

function startServer() {
  return new Promise((resolve, reject) => {
    const server = spawn('node', ['serve.ts', '--port', '8080'], { cwd: here, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    const timer = setTimeout(() => reject(new Error('server did not start: ' + out)), 10000);
    server.stdout.on('data', (d) => {
      out += d;
      if (out.includes('http://localhost:8080')) {
        clearTimeout(timer);
        resolve(server);
      }
    });
    server.stderr.on('data', (d) => { out += d; });
    server.on('error', reject);
  });
}

const server = await startServer();
// The cached full Chromium (chromium-1148); Playwright 1.65's default
// headless-shell build is not in the cache, so point at the real binary.
let browser;
try {
  browser = await chromium.launch({
    executablePath: '/home/hatch/.cache/ms-playwright/chromium-1148/chrome-linux/chrome',
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const badRequests = [];
  page.on('requestfailed', (r) => badRequests.push(r.url()));
  page.on('response', (r) => { if (r.status() >= 400) badRequests.push(`${r.status()} ${r.url()}`); });
  await page.addInitScript((seeded) => {
    localStorage.setItem('leonida-platinum-guide-v1', JSON.stringify({
      earned: seeded, notes: {}, spoiler: true, theme: 'paper',
    }));
  }, SEEDED);

  // 1 — checklist cover, with a guide open in the side pane.
  await page.goto('http://localhost:8080/#/', { waitUntil: 'networkidle' });
  await page.waitForSelector('.trophy-row', { timeout: 10000 });
  await page.locator('.trophy-body').nth(16).click(); // The Shootist
  await page.waitForTimeout(400);
  // The click scrolls the list down; the cover must show the header,
  // the toolbar and the progress counters at the top.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  await page.screenshot({ path: join(shotsDir, '1-checklist.jpg'), type: 'jpeg', quality: 82 });

  // 2 — a trophy guide detail, sources visible.
  await page.goto('http://localhost:8080/#/trophy/17', { waitUntil: 'networkidle' });
  await page.waitForSelector('.detail', { timeout: 10000 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(shotsDir, '2-guide.jpg'), type: 'jpeg', quality: 82 });

  // 3 — roadmap to the platinum.
  await page.goto('http://localhost:8080/#/roadmap', { waitUntil: 'networkidle' });
  await page.waitForSelector('.stage', { timeout: 10000 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(shotsDir, '3-roadmap.jpg'), type: 'jpeg', quality: 82 });

  // 4 — missables page.
  await page.goto('http://localhost:8080/#/missables', { waitUntil: 'networkidle' });
  await page.waitForSelector('.missable-list', { timeout: 10000 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(shotsDir, '4-missables.jpg'), type: 'jpeg', quality: 82 });

  if (badRequests.length) console.log('BAD REQUESTS:', badRequests.join('\n'));
  else console.log('no failed requests');
  console.log('4 screenshots taken');
} finally {
  await browser.close();
  server.kill();
}
