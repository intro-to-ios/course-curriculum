import { DATA, isLocked } from './data.js';

export function buildContent() {
  const main = document.getElementById('content');

  DATA.weeks.forEach(week => {
    if (week.isBreak) {
      const b = document.createElement('div');
      b.className = 'break-banner';
      b.dataset.isBreak = 'true';
      b.innerHTML = '<span>\u2600 Spring Break \u2600</span>';
      main.appendChild(b);
      return;
    }

    const group = document.createElement('div');
    group.className = 'week-group';
    group.dataset.weekLabel = week.label;

    const wh = document.createElement('div');
    wh.className = 'week-header';
    wh.innerHTML = `<span class="week-label">${week.label}</span><span class="week-topic">${week.topic}</span><div class="week-line"></div>`;
    group.appendChild(wh);

    week.lectures.forEach(lid => {
      const l = DATA.lectures[lid];
      const locked = isLocked(lid);
      const sec = document.createElement('article');
      sec.className = locked ? 'section locked' : 'section collapsed';
      sec.id = 'section-' + lid;
      sec.dataset.lid = lid;

      if (locked) {
        sec.innerHTML = `
          <div class="section-header">
            <span class="lecture-badge">${l.num}</span>
            <h2>${l.title}</h2>
          </div>
          <div class="section-body" id="body-${lid}">
            <div class="locked-banner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Under construction &mdash; coming soon
            </div>
          </div>
        `;
      } else {
        sec.innerHTML = `
          <div class="section-header" role="button" tabindex="0" aria-expanded="false" aria-controls="body-${lid}">
            <span class="lecture-badge">${l.num}</span>
            <h2>${l.title}</h2>
            <span class="collapse-icon" aria-hidden="true">\u25BE</span>
          </div>
          <div class="section-body" id="body-${lid}">
            <p>${l.body}</p>
            <a class="back-link" aria-label="Back to graph" onclick="document.getElementById('graph-container').scrollIntoView({behavior:'smooth'})">\u2191 Back to graph</a>
          </div>
        `;

        const header = sec.querySelector('.section-header');
        header.addEventListener('click', () => {
          const expanded = !sec.classList.contains('collapsed');
          sec.classList.toggle('collapsed');
          header.setAttribute('aria-expanded', !expanded);
        });
        header.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); header.click(); }
        });
      }

      group.appendChild(sec);
    });

    main.appendChild(group);
  });

  // Fade-in observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.section, .break-banner').forEach(el => observer.observe(el));
}
