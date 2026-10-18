(() => {
  'use strict';
  let dialog, stage, image, caption, sourceLink, trigger, scale = 1, x = 0, y = 0, pointer;
  let oldOverflow, oldPadding;
  const paint = () => {
    image.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    dialog.querySelector('[data-zoom="reset"]').textContent = Math.round(scale * 100) + '% · 复位';
    stage.classList.toggle('zoomed', scale > 1);
  };
  const zoom = amount => { scale = Math.max(1, Math.min(5, scale + amount)); if (scale === 1) x = y = 0; paint(); };
  const create = () => {
    dialog = document.createElement('dialog'); dialog.className = 'image-viewer'; dialog.setAttribute('aria-label', '图片放大查看');
    dialog.innerHTML = '<div class="viewer-toolbar"><button type="button" data-zoom="out" aria-label="缩小图片">−</button><button type="button" data-zoom="reset">100% · 复位</button><button type="button" data-zoom="in" aria-label="放大图片">＋</button><a class="text-link" target="_blank" rel="noopener" hidden>打开原图 ↗</a><button type="button" data-zoom="close" autofocus>关闭 Esc</button></div><div class="viewer-stage"><img class="zoom-image" alt="" draggable="false"></div><p class="viewer-caption"></p><p class="viewer-hint">滚轮或按钮缩放，放大后可拖动</p>';
    document.body.append(dialog); stage = dialog.querySelector('.viewer-stage'); image = dialog.querySelector('img');
    caption = dialog.querySelector('.viewer-caption'); sourceLink = dialog.querySelector('a');
    dialog.addEventListener('click', event => {
      const action = event.target.closest('[data-zoom]')?.dataset.zoom;
      if (action === 'in') zoom(.5); if (action === 'out') zoom(-.5);
      if (action === 'reset') { scale = 1; x = y = 0; paint(); }
      if (action === 'close' || event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.style.overflow = oldOverflow; document.body.style.paddingRight = oldPadding;
      pointer = null; image.removeAttribute('src'); trigger?.focus({ preventScroll: true });
    });
    dialog.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); dialog.close(); }
      if (!event.target.matches('button,a')) {
        if (event.key === '+' || event.key === '=') { event.preventDefault(); zoom(.5); }
        if (event.key === '-') { event.preventDefault(); zoom(-.5); }
      }
    });
    stage.addEventListener('wheel', event => { event.preventDefault(); zoom(event.deltaY < 0 ? .25 : -.25); }, { passive: false });
    stage.addEventListener('pointerdown', event => {
      if (scale <= 1 || event.button !== 0) return;
      pointer = { id: event.pointerId, x: event.clientX - x, y: event.clientY - y };
      stage.setPointerCapture(event.pointerId);
    });
    stage.addEventListener('pointermove', event => {
      if (!pointer || pointer.id !== event.pointerId) return;
      x = Math.max(-stage.clientWidth * scale / 2, Math.min(stage.clientWidth * scale / 2, event.clientX - pointer.x));
      y = Math.max(-stage.clientHeight * scale / 2, Math.min(stage.clientHeight * scale / 2, event.clientY - pointer.y)); paint();
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(name => stage.addEventListener(name, () => { pointer = null; }));
    image.addEventListener('error', () => { caption.textContent = '图片加载失败，请关闭后重试，或打开原图。'; });
  };
  const open = ({ src, alt, target, original }) => {
    if (!dialog) create(); if (dialog.open) return;
    trigger = target; scale = 1; x = y = 0;
    image.src = src; image.alt = alt || '放大图片'; caption.textContent = alt || '';
    sourceLink.hidden = !original; if (original) sourceLink.href = original;
    oldOverflow = document.body.style.overflow; oldPadding = document.body.style.paddingRight;
    const gap = innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = (parseFloat(getComputedStyle(document.body).paddingRight) + gap) + 'px';
    document.body.style.overflow = 'hidden'; paint(); dialog.showModal();
  };
  document.querySelectorAll('.prose img, #gallery img').forEach(img => {
    const anchor = img.closest('a');
    // An image linked to another article must keep its original navigation.
    if (anchor && new URL(anchor.href).pathname !== new URL(img.src).pathname) return;
    const target = anchor || img;
    if (!anchor) { img.tabIndex = 0; img.setAttribute('role', 'button'); }
    target.classList.add('zoom-trigger'); target.setAttribute('aria-label', '放大查看：' + (img.alt || '图片'));
    const activate = event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      if (!img.naturalWidth) return;
      event.preventDefault(); open({ src: img.currentSrc || img.src, alt: img.alt, target, original: img.src });
    };
    target.addEventListener('click', activate);
    target.addEventListener('keydown', event => { if (event.key === ' ' || (!anchor && event.key === 'Enter')) activate(event); });
  });
  document.addEventListener('whale:zoom', event => open(event.detail));
})();
