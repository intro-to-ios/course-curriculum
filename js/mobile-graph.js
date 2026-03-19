import { DATA, isLocked } from './data.js';
import { showLectureSummary } from './modal.js';

export function buildMobileGraph() {
  const mg = document.getElementById('mobileGraph');
  DATA.weeks.forEach(week => {
    if (week.isBreak) {
      const br = document.createElement('div');
      br.className = 'mg-break';
      br.textContent = '\u2014 Spring Break \u2014';
      mg.appendChild(br);
      return;
    }
    const row = document.createElement('div');
    row.className = 'mg-week';

    const label = document.createElement('div');
    label.className = 'mg-label';
    label.textContent = week.label;
    row.appendChild(label);

    const nodes = document.createElement('div');
    nodes.className = 'mg-nodes';
    week.lectures.forEach(lid => {
      const l = DATA.lectures[lid];
      const locked = isLocked(lid);
      const node = document.createElement('div');
      node.className = locked ? 'mg-node mg-locked' : 'mg-node';
      node.dataset.lid = lid;
      node.innerHTML = `<div class="mg-num">${l.num}</div><div class="mg-title">${locked ? 'Coming soon' : l.title}</div>`;
      if (!locked) {
        node.addEventListener('click', () => {
          showLectureSummary(lid);
        });
      }
      nodes.appendChild(node);
    });
    row.appendChild(nodes);
    mg.appendChild(row);
  });
}
