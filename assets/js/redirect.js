(() => {
  const target = document.getElementById('redirect-target');
  if (target) location.replace(target.href + location.hash);
})();
