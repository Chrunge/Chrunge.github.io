const assert = require('node:assert/strict');

// Exercise published templates as well as the independent interaction fixtures.
module.exports = async function checkRealLayouts(page, base, prefix) {
  const visit = href => page.goto(new URL(href, base).href);
  const scripts = async names => {
    const loaded = await page.locator('script[src]').evaluateAll(nodes => nodes.map(node => new URL(node.src).pathname));
    for (const name of names) assert(loaded.includes(prefix + '/assets/js/' + name + '.js'), 'Missing module: ' + name);
  };
  const reader = async () => {
    assert.equal(await page.locator('#reading-content').count(), 1, 'Published reader needs its content container');
    for (const id of ['font-down', 'font-up', 'font-size', 'resume-reading', 'toc-links']) assert.equal(await page.locator('#' + id).count(), 1, 'Missing reader tool: ' + id);
    await scripts(['site-init', 'site', 'reading', 'lightbox', 'diagrams']);
    const before = Number(await page.locator('#font-size').textContent().then(value => value.replace('px', '')));
    await page.locator('#font-up').click();
    assert.equal(await page.locator('#font-size').textContent(), (before + 1) + 'px');
    await page.locator('#font-down').click();
  };
  await visit(prefix + '/blog/');
  const post = page.locator('.post-row').first();
  if (await post.count()) { await visit(await post.getAttribute('href')); await reader(); }

  await visit(prefix + '/works/');
  const book = page.locator('.book-entry').first();
  if (await book.count()) {
    const bookUrl = await book.getAttribute('href');
    await visit(bookUrl);
    assert.equal(await page.locator('.book-detail[data-book-id]').count(), 1);
    assert.equal(await page.locator('#chapter-search').count(), 1);
    const chapter = page.locator('.chapter-list a').first();
    assert(await chapter.count(), 'Published books need a chapter');
    await visit(await chapter.getAttribute('href'));
    await reader();
    assert.equal(await page.locator('.chapter-navigation').count(), 1);
    assert.equal(await page.locator('.chapter-navigation a').filter({ hasText: '章节目录' }).getAttribute('href'), bookUrl);
  }

  await visit(prefix + '/manga/');
  const manga = page.locator('.work-card').first();
  if (await manga.count()) {
    await visit(await manga.getAttribute('href'));
    await scripts(['site-init', 'site', 'reading', 'lightbox', 'gallery']);
    const count = await page.locator('#gallery figure').count();
    assert(count > 0, 'Published galleries need images');
    await page.locator('#gallery-mode').click();
    assert(await page.locator('#gallery-controls').isVisible());
    assert.equal(await page.locator('#gallery figure:visible').count(), 1);
    assert.equal(await page.locator('#gallery-counter').textContent(), '1 / ' + count);
  }
};
