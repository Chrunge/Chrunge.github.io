(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const { storage: { read, save }, shortcutAllowed } = window.CloudWhale;
  const latestKey = 'cloud-whale-latest-reading';
  const content = $('#reading-content');
  if (content) {
    let size = Number(read('cloud-whale-font')) || 19;
    const applySize = () => {
      size = Math.min(26, Math.max(16, size));
      document.documentElement.style.setProperty('--reader-size', size + 'px');
      $('#font-size').textContent = size + 'px';
      $('#font-down').disabled = size <= 16; $('#font-up').disabled = size >= 26;
      save('cloud-whale-font', size);
    };
    applySize();
    $('#font-down').addEventListener('click', () => { size--; applySize(); });
    $('#font-up').addEventListener('click', () => { size++; applySize(); });
    const levels = (content.dataset.tocLevels || 'h2,h3').split(',').map(s => s.trim()).filter(s => /^h[2-6]$/.test(s));
    const headings = [...content.querySelectorAll(levels.join(',') || 'h2,h3')];
    const toc = $('.toc');
    const sidebar = document.createElement('aside');
    sidebar.className = 'reading-outline'; sidebar.setAttribute('aria-label', '本页目录');
    const label = document.createElement('p'); label.textContent = '本页目录';
    const outline = document.createElement('nav'); sidebar.append(label, outline);
    if (headings.length) {
      toc.hidden = false;
      headings.forEach((heading, index) => {
        if (!heading.id) heading.id = 'section-' + index;
        const link = document.createElement('a'); link.href = '#' + encodeURIComponent(heading.id); link.textContent = heading.textContent;
        link.className = 'toc-' + heading.tagName.toLowerCase();
        $('#toc-links').append(link); outline.append(link.cloneNode(true));
      });
      document.body.append(sidebar);
      document.body.classList.add('has-outline');
    }
    content.querySelectorAll('pre').forEach(pre => {
      const code = pre.querySelector('code'); if (!code) return;
      const languageClass = (code.className + ' ' + (pre.closest('[class*="language-"]')?.className || '')).match(/language-([\w+-]+)/);
      const tools = document.createElement('div'); tools.className = 'code-tools';
      const language = document.createElement('span'); language.className = 'code-language'; language.textContent = languageClass?.[1] || '代码';
      const button = document.createElement('button'); button.type = 'button'; button.className = 'copy-code'; button.textContent = '复制代码';
      button.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(code.textContent); button.textContent = '已复制'; }
        catch (_) { button.textContent = '请选中代码后复制'; }
        setTimeout(() => { button.textContent = '复制代码'; }, 1800);
      });
      tools.append(language, button); pre.prepend(tools);
    });
    const key = 'cloud-whale-progress:' + location.pathname;
    const stored = Number(read(key)); const previous = Number.isFinite(stored) ? Math.max(0, Math.min(1, stored)) : 0;
    const resume = $('#resume-reading');
    let touched = false, pendingResume = false, scrollTimer;
    const fraction = () => {
      const top = content.getBoundingClientRect().top + scrollY;
      return Math.min(1, Math.max(0, (scrollY - top) / Math.max(1, content.offsetHeight - innerHeight)));
    };
    const update = () => {
      const progress = Math.round(fraction() * 100);
      $('.reading-progress span').style.width = progress + '%';
      $('.reading-progress').setAttribute('aria-valuenow', String(progress));
      let active = headings[0];
      for (const heading of headings) { if (heading.getBoundingClientRect().top <= 140) active = heading; else break; }
      for (const link of [...outline.children, ...$('#toc-links').children]) {
        if (link.hash === '#' + encodeURIComponent(active?.id)) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    };
    const persist = () => {
      if (!touched || pendingResume) return;
      const progress = fraction(); save(key, progress);
      save(latestKey, JSON.stringify({ version: 1, url: location.pathname, progress }));
    };
    if (previous > .02 && previous < .98) {
      resume.hidden = false;
      const restore = () => {
        const top = content.getBoundingClientRect().top + scrollY;
        window.scrollTo({ top: top + previous * Math.max(1, content.offsetHeight - innerHeight), behavior: 'instant' });
        resume.hidden = true; touched = true; pendingResume = false; update(); persist();
      };
      resume.addEventListener('click', restore);
      if (location.hash === '#continue-reading') {
        pendingResume = true;
        // Wait for fonts, ordinary images and Mermaid before restoring the reading position.
        const images = [...content.querySelectorAll('img')];
        images.forEach(image => { image.loading = 'eager'; });
        const assets = Promise.allSettled(images.map(image => image.decode?.()));
        let diagramsReady, deadline;
        const diagrams = new Promise(resolve => {
          if (!content.querySelector('code.language-mermaid, .language-mermaid code')) return resolve();
          diagramsReady = resolve;
          document.addEventListener('whale:diagrams-ready', diagramsReady, { once: true });
        });
        const timeout = new Promise(resolve => { deadline = setTimeout(resolve, 10000); });
        Promise.race([Promise.allSettled([document.fonts.ready, assets, diagrams]), timeout]).then(() => {
          clearTimeout(deadline);
          if (diagramsReady) document.removeEventListener('whale:diagrams-ready', diagramsReady);
          if (pendingResume) restore();
        });
      }
    }
    const markIntent = () => { touched = true; pendingResume = false; };
    ['wheel', 'touchstart', 'pointerdown'].forEach(name => window.addEventListener(name, markIntent, { passive: true }));
    window.addEventListener('keydown', event => { if (['PageDown','PageUp','ArrowDown','ArrowUp','Home','End',' '].includes(event.key)) markIntent(); });
    window.addEventListener('scroll', () => { update(); clearTimeout(scrollTimer); scrollTimer = setTimeout(persist, 180); }, { passive: true });
    window.addEventListener('pagehide', persist);
    document.addEventListener('visibilitychange', () => { if (document.hidden) persist(); });
    window.addEventListener('resize', update);
    document.addEventListener('whale:diagrams-ready', update);
    document.addEventListener('whale:layout', update);
    new ResizeObserver(update).observe(content);
    update();
    // Sideways keys are reserved for chapter navigation outside editable controls and dialogs.
    document.addEventListener('keydown', event => {
      if (!shortcutAllowed(event, ',pre')) return;
      const direction = event.key === 'ArrowLeft' ? 'prev' : event.key === 'ArrowRight' ? 'next' : null;
      const link = direction && $('.chapter-navigation a[rel="' + direction + '"]');
      if (link) { event.preventDefault(); persist(); location.assign(link.href); }
    });
  }
  const chapter = $('[data-chapter-url]');
  if (chapter) save('cloud-whale-book:' + chapter.dataset.bookId, chapter.dataset.chapterUrl);
  const book = $('.book-detail');
  if (book) {
    const last = read('cloud-whale-book:' + book.dataset.bookId);
    const match = [...document.querySelectorAll('.chapter-list a')].find(link => link.getAttribute('href') === last);
    if (match) {
      const resume = $('.book-resume'); resume.href = match.href + '#continue-reading'; resume.hidden = false;
      match.classList.add('last-read'); match.setAttribute('aria-label', match.textContent.trim() + '，上次读到这里');
    }
    $('#chapter-search').addEventListener('input', event => {
      const query = event.target.value.trim().toLocaleLowerCase(); let count = 0;
      document.querySelectorAll('[data-chapter-title]').forEach(row => { row.hidden = !row.dataset.chapterTitle.toLocaleLowerCase().includes(query); if (!row.hidden) count++; });
      $('#chapter-count').textContent = query ? `找到 ${count} 章` : ''; $('#chapter-empty').hidden = count > 0;
    });
  }
  const card = $('#continue-reading');
  if (card) {
    const catalog = $('#reading-catalog').content;
    const show = () => {
      card.hidden = true;
      try {
        const record = JSON.parse(read(latestKey));
        if (!record || record.version !== 1 || typeof record.progress !== 'number' || !Number.isFinite(record.progress) || record.progress < 0 || record.progress >= .98) return;
        const entry = [...catalog.querySelectorAll('a')].find(link => new URL(link.getAttribute('href'), location.href).pathname === record.url);
        if (!entry) return;
        const percent = Math.round(record.progress * 100);
        $('#continue-title').textContent = entry.dataset.title; $('#continue-title').href = entry.href + '#continue-reading';
        $('#continue-link').href = entry.href + '#continue-reading';
        $('#continue-detail').textContent = (entry.dataset.bookTitle ? entry.dataset.bookTitle + ' · ' : '') + '进度 ' + percent + '%';
        $('#continue-progress').value = percent; card.hidden = false;
      } catch (_) { /* Corrupt or unavailable storage leaves the homepage unchanged. */ }
    };
    $('#forget-reading').addEventListener('click', () => {
      try {
        const keys = Object.keys(localStorage).filter(key => key === latestKey || key.startsWith('cloud-whale-progress:') || key.startsWith('cloud-whale-book:'));
        keys.forEach(key => localStorage.removeItem(key));
      } catch (_) {}
      card.hidden = true;
      $('#status').textContent = '已清除阅读记录，主题和字号保留';
    });
    window.addEventListener('pageshow', show); window.addEventListener('storage', show); show();
  }
})();
