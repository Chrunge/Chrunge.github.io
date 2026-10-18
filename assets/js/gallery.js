(() => {
  'use strict';
  const gallery = document.querySelector('#gallery'); if (!gallery) return;
  const $ = s => document.querySelector(s);
  const { shortcutAllowed } = window.CloudWhale;
  const figures = [...gallery.querySelectorAll('figure')];
  if (!figures.length) return;
  let index = 0, single = false;
  const render = () => {
    gallery.classList.toggle('single', single);
    figures.forEach((figure, i) => { figure.hidden = single && i !== index; });
    $('#gallery-controls').hidden = !single;
    $('#gallery-mode').textContent = single ? '切换为连续浏览' : '切换为逐页';
    $('#gallery-mode').setAttribute('aria-pressed', String(single));
    $('#gallery-counter').textContent = `${index + 1} / ${figures.length}`;
    $('#gallery-prev').disabled = index === 0; $('#gallery-next').disabled = index === figures.length - 1;
    if (single) {
      // Only the current page and immediate neighbours are explicitly preloaded.
      figures.slice(Math.max(0, index - 1), index + 2).forEach(figure => { figure.querySelector('img').loading = 'eager'; });
    }
  };
  const change = amount => { index = Math.max(0, Math.min(figures.length - 1, index + amount)); render(); };
  $('#gallery-mode').addEventListener('click', () => { single = !single; render(); });
  $('#gallery-prev').addEventListener('click', () => change(-1));
  $('#gallery-next').addEventListener('click', () => change(1));
  document.addEventListener('keydown', event => {
    if (!single || !shortcutAllowed(event)) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); change(event.key === 'ArrowLeft' ? -1 : 1); }
  });
  render();
})();
