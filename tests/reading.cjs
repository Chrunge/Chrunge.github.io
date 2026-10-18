/* Exercise the generated site, including failure paths, rather than source snapshots.
   Usage: NODE_PATH=<Playwright node_modules> node tests/reading.cjs _site */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(process.argv[2] || '_site');
const homepage = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const postPath = homepage.match(/<h3><a href="([^"]+)"/)[1];
const postFile = path.join(root, decodeURIComponent(postPath), 'index.html');
const original = fs.readFileSync(postFile, 'utf8');
const start = original.indexOf('<div class="prose reader-content"');
const end = original.indexOf('<nav class="article-nav"', start);
assert(start > 0 && end > start, 'Post fixture must preserve the real layout and scripts');
const fixture = '<div class="prose reader-content" id="reading-content"><h2 id="intro">阅读检查</h2>' +
  '<pre><code class="language-javascript">const whale = 1;</code></pre>' +
  '<pre><code class="language-mermaid">flowchart TD\n A[Markdown] --&gt; B[Jekyll]\n click A "https://example.com"</code></pre>' +
  '<pre><code class="language-mermaid">this is not a diagram</code></pre>' +
  '<img src="/assets/images/reader-check.svg" alt="重试示例" width="640" height="360">' +
  Array.from({ length: 45 }, (_, i) => `<h3 id="part-${i}">段落 ${i + 1}</h3><p>${'阅读内容与进度检查。'.repeat(15)}</p>`).join('') + '</div>';
let broken = true;
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (pathname === '/assets/images/reader-check.svg') {
    res.writeHead(broken ? 404 : 200, { 'Content-Type': 'image/svg+xml' });
    return res.end(broken ? '' : '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#7BC6FF"/></svg>');
  }
  let target = path.resolve(root, '.' + pathname);
  if (!target.startsWith(root + path.sep) && target !== root) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  if (!fs.existsSync(target)) { res.writeHead(404); return res.end(); }
  const type = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png' }[path.extname(target)] || 'application/octet-stream';
  res.setHeader('Content-Type', type);
  res.end(target === postFile ? original.slice(0, start) + fixture + original.slice(end) : fs.readFileSync(target));
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  // Serve the exact pinned Mermaid package locally so CI does not depend on CDN availability.
  const mermaidDist = path.dirname(require.resolve('mermaid'));
  await page.route('https://cdn.jsdelivr.net/npm/mermaid@11.12.0/**', route => {
    const asset = new URL(route.request().url()).pathname.split('/dist/')[1];
    const file = path.resolve(mermaidDist, asset || 'missing');
    if (!file.startsWith(mermaidDist + path.sep) || !fs.existsSync(file)) return route.abort();
    return route.fulfill({ path: file, contentType: 'text/javascript', headers: { 'Access-Control-Allow-Origin': '*' } });
  });
  // Existing tutorials include live iframe examples; isolate their third-party scripts from reader checks.
  await page.route('**/*', route => route.request().isNavigationRequest() && route.request().frame().parentFrame() ? route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Embedded example</title>' }) : route.fallback());
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  let mermaidRequests = 0;
  page.on('request', request => { if (request.url().includes('mermaid.esm.min.mjs')) mermaidRequests++; });
  await page.goto(base);
  assert.equal(await page.locator('#continue-reading').isVisible(), false);
  assert.equal(mermaidRequests, 0, 'Homepage must not load Mermaid');
  const cardStyle = await page.locator('.recent-card').first().evaluate(el => ({ border: getComputedStyle(el).borderTopWidth, shadow: getComputedStyle(el).boxShadow, top: el.getBoundingClientRect().top }));
  assert.equal(cardStyle.border, '2px'); assert.notEqual(cardStyle.shadow, 'none'); assert(cardStyle.top < 768, 'First article must remain above the fold');
  for (const theme of ['red','orange','yellow','green','cyan','blue','purple','rainbow','white','night']) {
    await page.locator('.theme-picker summary').click(); await page.locator('[data-theme-value="' + theme + '"]').click();
    assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), theme);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.locator('.theme-picker summary').click();
  }
  await page.screenshot({ path: path.join(root, 'reader-home-desktop.png') });
  await page.goto(base + postPath);
  await page.waitForFunction(() => document.querySelectorAll('.diagram-canvas svg').length === 1, null, { timeout: 60000 });
  assert(await page.locator('.diagram-source[open]').count() >= 1, 'Invalid Mermaid must keep its source readable');
  assert.equal(await page.locator('.diagram-canvas a[href], .diagram-canvas a[*|href]').count(), 0, 'Strict Mermaid must not activate diagram links');
  assert.equal(await page.locator('.code-language').first().textContent(), 'javascript');
  assert(await page.locator('.image-notice').isVisible(), 'Broken images must expose retry');
  broken = false; await page.getByRole('button', { name: '重新加载', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('img[alt="重试示例"]').naturalWidth > 0);
  assert.equal(await page.locator('.image-notice').count(), 0);
  await page.locator('.theme-picker summary').click(); await page.locator('[data-theme-value="night"]').click();
  await page.waitForFunction(() => document.querySelector('.diagram-canvas svg')?.textContent.includes('#192F46'));
  await page.locator('.diagram').first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(root, 'reader-diagram-night.png') });
  await page.getByRole('button', { name: '放大图表', exact: true }).first().click();
  assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
  await page.getByRole('button', { name: '放大图片', exact: true }).click();
  assert((await page.locator('[data-zoom="reset"]').textContent()).includes('150%'));
  const stage = await page.locator('.viewer-stage').boundingBox();
  await page.mouse.move(stage.x + stage.width / 2, stage.y + stage.height / 2); await page.mouse.down(); await page.mouse.move(stage.x + stage.width / 2 + 60, stage.y + stage.height / 2 + 30); await page.mouse.up();
  assert((await page.locator('.zoom-image').getAttribute('style')).includes('60px'));
  await page.keyboard.press('Escape'); assert.equal(await page.locator('dialog[open]').count(), 0);
  await page.waitForFunction(() => document.body.style.overflow === '');
  assert(await page.locator('.reading-outline').isVisible());
  await page.mouse.wheel(0, 10); await page.waitForTimeout(200);
  await page.evaluate(() => { const c = document.querySelector('#reading-content'); window.scrollTo({top:c.getBoundingClientRect().top + scrollY + .45 * (c.offsetHeight - innerHeight),behavior:'instant'}); });
  await page.waitForTimeout(500);
  const remembered = await page.evaluate(() => JSON.parse(localStorage.getItem('cloud-whale-latest-reading')));
  assert(remembered.progress > .4 && remembered.progress < .5);
  await page.goto(base); assert(await page.locator('#continue-reading').isVisible());
  await page.locator('#continue-link').click();
  await page.waitForFunction(() => Number(document.querySelector('.reading-progress').getAttribute('aria-valuenow')) > 35, null, { timeout: 20000 });
  assert(Number(await page.locator('.reading-progress').getAttribute('aria-valuenow')) < 55);
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.locator('.reading-outline').isVisible(), false);
  assert(await page.locator('.toc').isVisible());
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.goto(base); await page.locator('#forget-reading').click();
  assert.equal(await page.locator('#continue-reading').isVisible(), false);
  assert.equal(await page.evaluate(() => Object.keys(localStorage).some(key => key.startsWith('cloud-whale-progress:'))), false);
  assert.equal(await page.evaluate(() => localStorage.getItem('cloud-whale-theme')), 'night');
  await page.evaluate(() => localStorage.setItem('cloud-whale-latest-reading', JSON.stringify({ version: 1, progress: .5, url: 'javascript:alert(1)' })));
  await page.reload(); assert.equal(await page.locator('#continue-reading').isVisible(), false);
  await page.evaluate(() => localStorage.setItem('cloud-whale-latest-reading', JSON.stringify({version:1,progress:.5,url:'/blog/deleted-post/'})));
  await page.reload(); assert.equal(await page.locator('#continue-reading').isVisible(), false);
  await page.evaluate(() => localStorage.setItem('cloud-whale-latest-reading', '{broken'));
  await page.reload(); assert.equal(await page.locator('#continue-reading').isVisible(), false);
  await page.goto(base + '/manga/ai-girl/'); await page.locator('#gallery-mode').click(); await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#gallery-counter').textContent(), '2 / 9');
  assert((await page.locator('#gallery img[loading="eager"]').count()) <= 3);
  await page.locator('#gallery figure:visible a').click(); await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#gallery-counter').textContent(), '2 / 9', 'Dialog keys must not change gallery pages');
  await page.keyboard.press('Escape');
  const library = JSON.parse(fs.readFileSync(path.resolve('_data/library.json'), 'utf8'));
  const book = Object.values(library).find(book => book.chapters.length > 1);
  await page.goto(base + book.chapters[0].url);
  await page.locator('#reading-content').evaluate(el => { const input = document.createElement('input'); input.id = 'shortcut-check'; el.prepend(input); });
  await page.locator('#shortcut-check').focus(); await page.keyboard.press('ArrowRight'); assert(page.url().includes(book.chapters[0].url));
  await page.locator('h1').click(); await page.keyboard.press('ArrowRight'); await page.waitForURL('**' + book.chapters[1].url);
  const markdownChapter = Object.values(library).flatMap(book => book.chapters).find(chapter => chapter.title.includes('Markdown'));
  if (markdownChapter) {
    await page.goto(base + markdownChapter.url);
    await page.waitForFunction(() => [...document.querySelectorAll('.diagram-tools span')].every(el => !el.textContent.includes('正在绘制') && !el.textContent.includes('准备中')));
    assert.equal(await page.locator('.diagram-canvas svg').count(), await page.locator('.diagram').count(), 'Existing Markdown guide diagrams must all render');
  }
  const offline = await browser.newPage();
  await offline.route('**/mermaid.esm.min.mjs', route => route.abort());
  await offline.goto(base + postPath);
  await offline.getByText('图表组件未能加载，源码仍可阅读', { exact: true }).first().waitFor();
  assert.equal(await offline.locator('.diagram-source[open]').count(), 2);
  await offline.close();
  const noStorage = await browser.newPage();
  await noStorage.addInitScript(() => { Storage.prototype.getItem = Storage.prototype.setItem = Storage.prototype.removeItem = () => { throw new Error('storage disabled'); }; });
  noStorage.on('pageerror', error => errors.push(error.message)); await noStorage.goto(base); assert.equal(await noStorage.locator('#continue-reading').isVisible(), false);
  assert.deepEqual(errors, []);
  await page.screenshot({ path: path.join(root, 'reader-mobile.png') });
  await browser.close(); server.close();
  console.log('PASS: real Mermaid + strict/failure/night rendering; zoom/pan/Esc/scroll restoration; progress/resume/clear; mobile TOC; lazy loading; gallery and chapter shortcuts; unavailable/corrupt storage.');
})().catch(error => { console.error(error); server.close(); process.exit(1); });
