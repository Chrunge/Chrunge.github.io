const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

module.exports = function readerFixtures(root) {
  const homepage = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const prefix = homepage.match(/href="([^"]*)\/assets\/css\/site\.css"/)[1];
  const url = suffix => prefix + suffix;
  const routes = { post: url('/__reader-check__/post/'), book: url('/__reader-check__/book/'), chapters: [1, 2].map(n => url(`/__reader-check__/book/${n}/`)), gallery: url('/__reader-check__/gallery/') };
  const images = [1, 2, 3].map(n => url(`/__reader-check__/images/${n}.svg`));
  const tools = fs.readFileSync(path.resolve('_includes/reader-tools.html'), 'utf8');
  const paragraphs = Array.from({ length: 45 }, (_, i) => `<h3 id="part-${i}">段落 ${i + 1}</h3><p>${'阅读内容与进度检查。'.repeat(15)}</p>`).join('');
  const content = '<h2 id="intro">阅读检查</h2><pre><code class="language-javascript">const whale = 1;</code></pre>' +
    '<pre><code class="language-mermaid">flowchart TD\n A[Markdown] --&gt; B[Jekyll]\n click A "https://example.com"</code></pre>' +
    '<pre><code class="language-mermaid">this is not a diagram</code></pre>' +
    `<img src="${url('/__reader-check__/retry.svg')}" alt="重试示例" width="640" height="360">` + paragraphs;
  const article = (body, chapter) => `<article class="reading-page" ${chapter === undefined ? '' : `data-book-id="fixture-book" data-chapter-url="${routes.chapters[chapter]}"`}><a class="back-link" href="${url('/works/')}">返回作品</a><header class="article-heading"><p class="eyebrow">阅读检查</p><h1>${chapter === undefined ? '阅读测试文章' : `第 ${chapter + 1} 章`}</h1><p>独立测试资料。</p></header>${tools}<div class="prose reader-content" id="reading-content">${body}</div>${chapter === undefined ? '' : `<nav class="chapter-navigation">${chapter ? `<a rel="prev" href="${routes.chapters[0]}">上一章</a>` : '<span>第一章</span>'}<a href="${routes.book}">目录</a>${chapter ? '<span>最后一章</span>' : `<a rel="next" href="${routes.chapters[1]}">下一章</a>`}</nav>`}</article>`;
  const gallery = `<article class="reading-page gallery-page"><h1>测试画集</h1><div class="reading-tools"><button id="gallery-mode" type="button">切换为逐页</button><div id="gallery-controls" hidden><button id="gallery-prev" type="button">上一页</button><span id="gallery-counter"></span><button id="gallery-next" type="button">下一页</button></div></div><div id="gallery">${images.map((src, i) => `<figure><a href="${src}"><img src="${src}" alt="测试画集 ${i + 1}" width="640" height="360" loading="lazy"></a><figcaption>${i + 1} / ${images.length}</figcaption></figure>`).join('')}</div></article>`;
  const book = `<article class="book-detail" data-book-id="fixture-book"><h1>测试作品</h1><a class="book-resume" hidden>继续阅读</a><input id="chapter-search" type="search"><p id="chapter-count"></p><p id="chapter-empty" hidden>没有章节</p><ul class="chapter-list">${routes.chapters.map((href, i) => `<li data-chapter-title="第 ${i + 1} 章"><a href="${href}">第 ${i + 1} 章</a></li>`).join('')}</ul></article>`;
  const shell = (body, modules = ['lightbox', 'diagrams']) => {
    const main = homepage.indexOf('<main id="main"');
    const head = homepage.slice(0, homepage.indexOf('>', main) + 1);
    const tail = homepage.slice(homepage.lastIndexOf('</main>'));
    return (head + body + tail).replace('</head>', modules.map(name => `<script src="${url(`/assets/js/${name}.js`)}" defer></script>`).join('') + '</head>');
  };
  const pages = new Map([[routes.post, shell(article(content))], [routes.gallery, shell(gallery, ['lightbox', 'gallery'])], [routes.book, shell(book, [])], ...routes.chapters.map((route, i) => [route, shell(article('<h2>本章内容</h2>' + paragraphs, i))])]);
  const catalog = `<a href="${routes.post}" data-title="阅读测试文章"></a>` + routes.chapters.map((href, i) => `<a href="${href}" data-title="第 ${i + 1} 章" data-book-title="测试作品"></a>`).join('');
  let broken = true;
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname.startsWith(url('/__reader-check__/')) && pathname.endsWith('.svg')) {
      const failed = pathname.endsWith('/retry.svg') && broken;
      res.writeHead(failed ? 404 : 200, { 'Content-Type': 'image/svg+xml' });
      return res.end(failed ? '' : '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#7BC6FF"/></svg>');
    }
    if (pages.has(pathname)) { res.setHeader('Content-Type', 'text/html; charset=utf-8'); return res.end(pages.get(pathname)); }
    if (prefix && !pathname.startsWith(prefix + '/')) { res.writeHead(404); return res.end(); }
    let file = path.resolve(root, '.' + pathname.slice(prefix.length));
    if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    const type = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png' }[path.extname(file)] || 'application/octet-stream';
    res.setHeader('Content-Type', type);
    res.end(file === path.join(root, 'index.html') ? homepage.replace('</template>', catalog + '</template>') : fs.readFileSync(file));
  });
  return { server, routes, prefix, imageCount: images.length, repairImage: () => { broken = false; } };
};
