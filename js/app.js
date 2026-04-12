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

// Hamburger menu
const hamburgerBtn = document.getElementById('hamburgerBtn');
const hamburgerMenu = document.getElementById('hamburgerMenu');
hamburgerBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const open = hamburgerMenu.classList.toggle('open');
  hamburgerBtn.setAttribute('aria-expanded', open);
});
document.addEventListener('click', (e) => {
  if (!hamburgerMenu.contains(e.target) && e.target !== hamburgerBtn) {
    hamburgerMenu.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }
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
