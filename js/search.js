import { DATA, isLocked } from './data.js';
import { state } from './state.js';

export function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');
  const noResults = document.getElementById('noResults');
  const toggleAllBtn = document.getElementById('toggleAllBtn');

  // Expand / Collapse all
  toggleAllBtn.addEventListener('click', () => {
    state.allCollapsed = !state.allCollapsed;
    document.querySelectorAll('.section:not(.locked)').forEach(sec => {
      if (sec.classList.contains('search-hidden')) return;
      if (state.allCollapsed) {
        sec.classList.add('collapsed');
        sec.querySelector('.section-header').setAttribute('aria-expanded', 'false');
      } else {
        sec.classList.remove('collapsed');
        sec.querySelector('.section-header').setAttribute('aria-expanded', 'true');
      }
    });
    toggleAllBtn.textContent = state.allCollapsed ? 'Expand all' : 'Collapse all';
  });

  // Search
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    searchClear.style.display = q ? 'block' : 'none';

    if (!q) {
      document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('search-hidden', 'search-match');
        const lid = sec.dataset.lid;
        if (!isLocked(lid)) {
          const l = DATA.lectures[lid];
          sec.querySelector('.section-body p').innerHTML = l.body;
        }
      });
      document.querySelectorAll('.week-group').forEach(g => g.classList.remove('search-hidden'));
      document.querySelectorAll('.break-banner').forEach(b => b.style.display = '');
      noResults.style.display = 'none';
      return;
    }

    let matchCount = 0;
    const weekHasMatch = {};

    Object.keys(DATA.lectures).forEach(lid => {
      const l = DATA.lectures[lid];
      const sec = document.getElementById('section-' + lid);
      const locked = isLocked(lid);

      // Locked lectures only match on title (not body content)
      const searchText = locked ? l.title : l.title + ' ' + l.body.replace(/<[^>]+>/g, '');
      const matches = searchText.toLowerCase().includes(q);

      if (matches) {
        matchCount++;
        sec.classList.remove('search-hidden');
        sec.classList.add('search-match');

        if (!locked) {
          sec.classList.remove('collapsed');
          sec.querySelector('.section-header').setAttribute('aria-expanded', 'true');

          const bodyP = sec.querySelector('.section-body p');
          let html = l.body;
          const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
          html = html.replace(/>([^<]+)</g, (match, text) => {
            return '>' + text.replace(regex, '<mark>$1</mark>') + '<';
          });
          bodyP.innerHTML = html;
        }

        const weekGroup = sec.closest('.week-group');
        if (weekGroup) weekHasMatch[weekGroup.dataset.weekLabel] = true;
      } else {
        sec.classList.add('search-hidden');
        sec.classList.remove('search-match');
      }
    });

    document.querySelectorAll('.week-group').forEach(g => {
      g.classList.toggle('search-hidden', !weekHasMatch[g.dataset.weekLabel]);
    });

    document.querySelectorAll('.break-banner').forEach(b => {
      b.style.display = q ? 'none' : '';
    });

    noResults.style.display = matchCount === 0 ? 'block' : 'none';
  });

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
    searchInput.focus();
  });

  // Keyboard shortcut: / to focus search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
    if (e.key === 'Escape' && document.activeElement === searchInput) {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      searchInput.blur();
    }
  });
}
