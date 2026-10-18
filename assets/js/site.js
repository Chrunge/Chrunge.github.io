(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const all = (s) => [...document.querySelectorAll(s)];
  const read = (key) => { try { return localStorage.getItem(key); } catch (_) { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, String(value)); } catch (_) { /* Private mode: this visit still works. */ } };
  const announce = (message) => { $('#status').textContent = message; };
  const syncComments = () => {
    const frame = $('iframe.giscus-frame');
    frame?.contentWindow?.postMessage({ giscus: { setConfig: { theme: document.documentElement.dataset.theme === 'night' ? 'dark' : 'light' } } }, 'https://giscus.app');
  };
  const syncThemes = () => {
    all('[data-theme-value]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeValue === document.documentElement.dataset.theme)));
    syncComments();
  };
  syncThemes();
  // Giscus is optional and may finish loading after the page.
  const commentBox = $('.comments');
  if (commentBox) new MutationObserver(() => {
    const frame = $('iframe.giscus-frame');
    if (frame && !frame.dataset.themeBound) { frame.dataset.themeBound = 'true'; frame.addEventListener('load', syncComments); }
  }).observe(commentBox, { childList: true, subtree: true });
  all('[data-theme-value]').forEach(button => button.addEventListener('click', () => {
    document.documentElement.dataset.theme = button.dataset.themeValue;
    save('cloud-whale-theme', button.dataset.themeValue);
    syncThemes();
    announce('已切换为' + button.textContent.trim() + '主题');
  }));
  document.addEventListener('click', (event) => {
    const picker = $('.theme-picker');
    if (picker?.open && !picker.contains(event.target)) picker.open = false;
  });
  let focusSource;
  const focusMode = (enabled) => {
    document.body.classList.toggle('immersive', enabled);
    $('.focus-exit').hidden = !enabled;
    all('.focus-toggle').forEach(b => b.setAttribute('aria-pressed', String(enabled)));
    if (enabled) { $('.theme-picker').open = false; $('.focus-exit').focus({ preventScroll: true }); }
    else focusSource?.focus({ preventScroll: true });
    announce(enabled ? '已开启沉浸阅读，按 Esc 退出' : '已退出沉浸阅读');
  };
  all('.focus-toggle').forEach(button => button.addEventListener('click', () => {
    focusSource = button;
    focusMode(!document.body.classList.contains('immersive'));
  }));
  $('.focus-exit').addEventListener('click', () => focusMode(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (document.body.classList.contains('immersive')) focusMode(false);
      const picker = $('.theme-picker');
      if (picker.open) { picker.open = false; picker.querySelector('summary').focus(); }
    }
  });
  const search = $('#search');
  if (search) search.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase();
    let count = 0;
    all('[data-search]').forEach(row => { row.hidden = !row.dataset.search.toLocaleLowerCase().includes(query); if (!row.hidden) count++; });
    $('#search-empty').hidden = count > 0;
    $('#search-count').textContent = query ? `找到 ${count} 篇文章` : '';
  });
  const content = $('#reading-content');
  if (content) {
    const storedSize = Number(read('cloud-whale-font'));
    let size = storedSize >= 16 && storedSize <= 26 ? storedSize : 19;
    const applySize = () => {
      document.documentElement.style.setProperty('--reader-size', size + 'px');
      $('#font-size').textContent = size + 'px';
      $('#font-down').disabled = size <= 16;
      $('#font-up').disabled = size >= 26;
      save('cloud-whale-font', size);
    };
    applySize();
    $('#font-down').addEventListener('click', () => { size = Math.max(16, size - 1); applySize(); });
    $('#font-up').addEventListener('click', () => { size = Math.min(26, size + 1); applySize(); });
    const majorHeadings = [...content.querySelectorAll('h2')];
    const headings = majorHeadings.length > 30 ? majorHeadings : [...content.querySelectorAll('h2,h3')];
    if (headings.length) {
      $('.toc').hidden = false;
      headings.forEach((heading, index) => {
        if (!heading.id) heading.id = 'section-' + index;
        const link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        $('#toc-links').append(link);
      });
    }
    content.querySelectorAll('pre').forEach(pre => {
      const code = pre.querySelector('code');
      if (!code || !navigator.clipboard) return;
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'copy-code'; button.textContent = '复制代码';
      button.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(code.textContent); button.textContent = '已复制'; }
        catch (_) { button.textContent = '请选中代码后复制'; }
        setTimeout(() => { button.textContent = '复制代码'; }, 1800);
      });
      pre.prepend(button);
    });
    const progressKey = 'cloud-whale-progress:' + location.pathname;
    const previous = Number(read(progressKey));
    const resume = $('#resume-reading');
    if (previous > .02 && previous < .98) {
      resume.hidden = false;
      resume.addEventListener('click', () => {
        const top = content.getBoundingClientRect().top + scrollY;
        window.scrollTo({ top: top + previous * Math.max(1, content.offsetHeight - innerHeight), behavior: 'auto' });
        resume.hidden = true;
      });
    }
    let scrollTimer;
    const updateProgress = (persist = false) => {
      const top = content.getBoundingClientRect().top + scrollY;
      const fraction = Math.min(1, Math.max(0, (scrollY - top) / Math.max(1, content.offsetHeight - innerHeight)));
      $('.reading-progress span').style.width = Math.round(fraction * 100) + '%';
      $('.reading-progress').setAttribute('aria-valuenow', String(Math.round(fraction * 100)));
      if (persist) save(progressKey, fraction);
    };
    window.addEventListener('scroll', () => { clearTimeout(scrollTimer); scrollTimer = setTimeout(() => updateProgress(true), 120); }, { passive: true });
    window.addEventListener('resize', () => updateProgress());
    updateProgress();
  }
  const gallery = $('#gallery');
  if (gallery) {
    let index = 0;
    let single = false;
    const figures = [...gallery.querySelectorAll('figure')];
    const render = () => {
      gallery.classList.toggle('single', single);
      figures.forEach((figure, i) => { figure.hidden = single && i !== index; });
      $('#gallery-controls').hidden = !single;
      $('#gallery-mode').textContent = single ? '切换为连续浏览' : '切换为逐页';
      $('#gallery-mode').setAttribute('aria-pressed', String(single));
      $('#gallery-counter').textContent = `${index + 1} / ${figures.length}`;
      $('#gallery-prev').disabled = index === 0;
      $('#gallery-next').disabled = index === figures.length - 1;
    };
    $('#gallery-mode').addEventListener('click', () => { single = !single; render(); });
    $('#gallery-prev').addEventListener('click', () => { index = Math.max(0, index - 1); render(); });
    $('#gallery-next').addEventListener('click', () => { index = Math.min(figures.length - 1, index + 1); render(); });
    render();
  }
})();
