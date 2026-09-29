import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const logs = [];
page.on('console', (msg) => logs.push(`${msg.type()}: ${msg.text()}`));
page.on('pageerror', (err) => logs.push(`pageerror: ${err.message}`));

await page.goto('http://127.0.0.1:8765/index.html', { waitUntil: 'networkidle' });
await page.screenshot({ path: '_webcheck/01-hero.png' });

await page.locator('#portfolio').scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await page.screenshot({ path: '_webcheck/02-portfolio.png' });

await page.getByRole('button', { name: 'Brosur & Katalog' }).click();
await page.waitForTimeout(600);
await page.screenshot({ path: '_webcheck/03-filter-brosur.png' });

const count = await page.locator('.portfolio-item').evaluateAll((els) =>
  els.filter((el) => getComputedStyle(el).display !== 'none').length
);
const titles = await page.locator('.portfolio-item').evaluateAll((els) =>
  els
    .filter((el) => getComputedStyle(el).display !== 'none')
    .map((el) => el.querySelector('h4')?.textContent)
);

const firstBrosur = page.locator('.portfolio-item').filter({ hasText: 'Desain Brosur' }).first();
await firstBrosur.click();
await page.waitForTimeout(400);
const lightboxOn = await page.locator('#portfolioLightbox').evaluate((el) => el.classList.contains('active'));
await page.screenshot({ path: '_webcheck/04-lightbox.png' });

await page.locator('#portfolioLightbox .lightbox-close').click();
await page.waitForTimeout(300);

await page.locator('#contact').scrollIntoViewIfNeeded();
await page.screenshot({ path: '_webcheck/05-contact.png' });

const brokenImgs = await page.locator('img').evaluateAll((imgs) =>
  imgs
    .filter((img) => !img.complete || img.naturalWidth === 0)
    .map((img) => img.getAttribute('src'))
);

console.log(JSON.stringify({ count, titles, lightboxOn, brokenImgs, logs }, null, 2));
await browser.close();
