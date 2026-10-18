(() => {
  document.documentElement.classList.add('js');
  const choices = ['red','orange','yellow','green','cyan','blue','purple','rainbow','white','night'];
  try {
    const saved = localStorage.getItem('cloud-whale-theme');
    document.documentElement.dataset.theme = choices.includes(saved) ? saved : (matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'blue');
  } catch (_) { /* Storage may be disabled; the default theme still works. */ }
})();
