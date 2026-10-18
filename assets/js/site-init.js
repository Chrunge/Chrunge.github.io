(() => {
  'use strict';
  const storage = {
    read(key) { try { return localStorage.getItem(key); } catch (_) { return null; } },
    save(key, value) { try { localStorage.setItem(key, String(value)); } catch (_) {} }
  };
  const shortcutAllowed = (event, extraSelector = '') => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.isComposing || event.repeat) return false;
    const controls = 'input,textarea,select,summary,[contenteditable]:not([contenteditable="false"]),dialog' + extraSelector;
    return !event.target.closest?.(controls) && !document.querySelector('dialog[open]');
  };
  window.CloudWhale = Object.freeze({ storage, shortcutAllowed });
  const root = document.documentElement;
  root.classList.add('js');
  const choices = root.dataset.themeChoices.split(',');
  const saved = storage.read('cloud-whale-theme');
  root.dataset.theme = choices.includes(saved) ? saved : (matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'blue');
})();
