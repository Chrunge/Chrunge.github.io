(() => {
  const target = document.getElementById('redirect-target');
  if (target) location.replace(target.href + (target.getAttribute('data-preserve-query') === 'true' ? location.search : '') + location.hash);
})();
