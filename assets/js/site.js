(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const all = (s) => [...document.querySelectorAll(s)];
  const { save } = window.CloudWhale.storage;
  const announce = (message) => { $('#status').textContent = message; };
  const syncComments = () => {
    const frame = $('iframe.giscus-frame');
    frame?.contentWindow?.postMessage({ giscus: { setConfig: { theme: document.documentElement.dataset.theme === 'night' ? 'dark' : 'light' } } }, 'https://giscus.app');
  };
  const syncThemes = () => {
    all('[data-theme-value]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeValue === document.documentElement.dataset.theme)));
    syncComments();
    document.dispatchEvent(new Event('whale:theme'));
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
    document.dispatchEvent(new Event('whale:layout'));
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
      if (picker?.open) { picker.open = false; picker.querySelector('summary').focus(); }
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
  // Images retain their real URL; failed requests can be retried without hiding path errors.
  const watchImage = image => {
    if (image.closest('.image-viewer') || image.dataset.watched) return;
    image.dataset.watched = 'true';
    let notice;
    const failed = () => {
      if (notice || !image.getAttribute('src')) return;
      notice = document.createElement('div'); notice.className = 'image-notice';
      const message = document.createElement('span'); message.textContent = '图片未能加载';
      const retry = document.createElement('button'); retry.type = 'button'; retry.textContent = '重新加载';
      retry.addEventListener('click', () => { retry.disabled = true; retry.textContent = '加载中…'; image.src = image.src; });
      notice.append(message, retry); (image.closest('a') || image).after(notice);
      image.hidden = true;
    };
    image.addEventListener('error', () => { failed(); const retry = notice?.querySelector('button'); if (retry) { retry.disabled = false; retry.textContent = '重新加载'; } });
    image.addEventListener('load', () => { notice?.remove(); notice = null; image.hidden = false; });
    if (image.complete && !image.naturalWidth) failed();
  };
  all('img').forEach(watchImage);
})();
