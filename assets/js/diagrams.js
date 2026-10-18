(() => {
  'use strict';
  const codes = [...document.querySelectorAll('.prose pre code')].filter(code => code.matches('.language-mermaid') || code.closest('.language-mermaid'));
  if (!codes.length) return;
  let engine, count = 0, rendering = false, rerender = false;
  const charts = codes.map(code => {
    const source = code.closest('pre');
    const block = document.createElement('figure'); block.className = 'diagram';
    const canvas = document.createElement('div'); canvas.className = 'diagram-canvas'; canvas.setAttribute('aria-live', 'polite');
    const tools = document.createElement('figcaption'); tools.className = 'diagram-tools';
    const status = document.createElement('span'); status.textContent = '图表准备中…';
    const retry = document.createElement('button'); retry.type = 'button'; retry.textContent = '重试图表'; retry.hidden = true;
    const expand = document.createElement('button'); expand.type = 'button'; expand.textContent = '放大图表'; expand.hidden = true;
    const details = document.createElement('details'); details.className = 'diagram-source';
    const summary = document.createElement('summary'); summary.textContent = 'Mermaid 源码';
    source.before(block); details.append(summary, source); tools.append(status, expand, retry); block.append(canvas, tools, details);
    const chart = { text: code.textContent, block, canvas, status, retry, expand, details };
    expand.addEventListener('click', () => {
      const svg = canvas.querySelector('svg'); if (!svg) return;
      const clone = svg.cloneNode(true); clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      clone.style.maxWidth = 'none';
      const bounds = svg.viewBox.baseVal;
      if (bounds.width && bounds.height) { clone.setAttribute('width', bounds.width); clone.setAttribute('height', bounds.height); }
      document.dispatchEvent(new CustomEvent('whale:zoom', { detail: { src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone)), alt: 'Mermaid 架构图', target: expand } }));
    });
    retry.addEventListener('click', () => render());
    return chart;
  });
  const configure = mermaid => {
    const dark = document.documentElement.dataset.theme === 'night';
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', suppressErrorRendering: true, maxTextSize: 50000, theme: 'base',
      themeVariables: { darkMode: dark, fontFamily: 'system-ui, Microsoft YaHei, sans-serif', fontSize: '16px',
        primaryColor: dark ? '#192F46' : '#FFFDF5', primaryTextColor: dark ? '#E3EDF5' : '#0F2942', primaryBorderColor: dark ? '#779DBE' : '#0F2942',
        lineColor: dark ? '#92C8FF' : '#0F2942', secondaryColor: dark ? '#284865' : '#7BC6FF', tertiaryColor: dark ? '#112236' : '#F8FBFF',
        secondaryTextColor: dark ? '#E3EDF5' : '#0F2942', tertiaryTextColor: dark ? '#E3EDF5' : '#0F2942',
        edgeLabelBackground: dark ? '#112236' : '#FFFDF5', background: dark ? '#112236' : '#FFFDF5' },
      themeCSS: '.node rect,.node polygon,.node circle,.node path{stroke-width:2px}.flowchart-link{stroke-width:2px}',
      flowchart: { htmlLabels: false, useMaxWidth: true }, sequence: { useMaxWidth: true } });
  };
  async function render() {
    if (rendering) { rerender = true; return; }
    rendering = true;
    try {
      charts.forEach(chart => { chart.retry.hidden = true; chart.status.textContent = '正在绘制图表…'; });
      // Pinned version, loaded only on pages that contain Mermaid blocks.
      engine ||= await import('https://cdn.jsdelivr.net/npm/mermaid@11.12.0/dist/mermaid.esm.min.mjs').then(module => module.default);
      configure(engine);
      for (const chart of charts) {
        try {
          const { svg } = await engine.render('whale-chart-' + (++count), chart.text);
          chart.canvas.innerHTML = svg;
          // Technical diagrams are view-only; strip link destinations as well as callbacks.
          chart.canvas.querySelectorAll('a').forEach(link => { link.removeAttribute('href'); link.removeAttribute('xlink:href'); link.removeAttributeNS('http://www.w3.org/1999/xlink', 'href'); });
          chart.canvas.querySelector('svg').setAttribute('aria-label', 'Mermaid 技术图表');
          chart.expand.hidden = false; chart.status.textContent = 'Mermaid 图表';
        } catch (_) {
          chart.canvas.replaceChildren(); chart.expand.hidden = true; chart.retry.hidden = false; chart.details.open = true;
          chart.status.textContent = '图表语法无法解析，请查看源码';
        }
      }
    } catch (_) {
      charts.forEach(chart => { chart.status.textContent = '图表组件未能加载，源码仍可阅读'; chart.details.open = true; chart.retry.hidden = false; });
    } finally {
      rendering = false; document.dispatchEvent(new Event('whale:diagrams-ready'));
      if (rerender) { rerender = false; render(); }
    }
  }
  document.addEventListener('whale:theme', render);
  render();
})();
