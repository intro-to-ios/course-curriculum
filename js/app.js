import { initTheme } from './theme.js';
import { renderGraph, setupScrollSync } from './graph.js';
import { buildMobileGraph } from './mobile-graph.js';
import { buildContent } from './content.js';
import { initModal } from './modal.js';
import { initSearch } from './search.js';

// Responsive re-render
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(renderGraph, 150);
});

// Init
initTheme();
initModal();
renderGraph();
buildMobileGraph();
buildContent();
setupScrollSync();
initSearch();
document.documentElement.style.scrollBehavior = 'smooth';
