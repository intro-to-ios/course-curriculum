import { DATA, isLocked } from './data.js';
import { setGraphActive } from './graph.js';

function getLectureOrder() {
  const order = [];
  DATA.weeks.forEach(w => {
    if (!w.isBreak) w.lectures.forEach(lid => order.push(lid));
  });
  return order;
}

export function showLectureSummary(lid) {
  const order = getLectureOrder();
  const idx = order.indexOf(lid);
  const current = DATA.lectures[lid];
  const locked = isLocked(lid);
  const modal = document.getElementById('lectureModal');
  const content = document.getElementById('modalContent');

  let html = '';

  // Badge + title
  html += `<div class="modal-badge" ${locked ? 'style="background:var(--text-dim)"' : ''}>${current.num}</div>`;
  html += `<div class="modal-title">${current.title}</div>`;

  if (locked) {
    // Under construction modal
    html += `<div class="modal-section">`;
    html += `<div class="locked-banner" style="font-size:1rem;gap:0.6rem;font-style:normal">`;
    html += `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
    html += `This lecture is under construction and will be available soon.`;
    html += `</div>`;
    html += `</div>`;
  } else {
    // Progress bar
    const progress = Math.round(((idx) / (order.length - 1)) * 100);
    html += `<div class="modal-progress">`;
    html += `<div class="modal-progress-bar"><div class="modal-progress-fill" style="width:${progress}%"></div></div>`;
    html += `<div class="modal-progress-text">${idx} of ${order.length - 1} completed</div>`;
    html += `</div>`;

    // Previous lectures
    const previous = order.slice(0, idx).filter(plid => !isLocked(plid));
    if (previous.length > 0) {
      html += `<div class="modal-section">`;
      html += `<div class="modal-section-label">What you've learned so far</div>`;
      html += `<div class="modal-prereqs">`;
      previous.forEach(plid => {
        const pl = DATA.lectures[plid];
        html += `<span class="modal-prereq-chip" data-lid="${plid}"><span class="chip-num">${pl.num}</span> ${pl.title}</span>`;
      });
      html += `</div></div>`;
    }

    // What this lecture covers
    html += `<div class="modal-section">`;
    html += `<div class="modal-section-label">What this lecture covers</div>`;
    html += `<p>${current.body}</p>`;
    html += `</div>`;

    // Prerequisites
    const prereqs = DATA.connections.filter(c => c.to === lid);
    if (prereqs.length > 0) {
      html += `<div class="modal-section">`;
      html += `<div class="modal-section-label">Building on</div>`;
      prereqs.forEach(conn => {
        const from = DATA.lectures[conn.from];
        html += `<div class="modal-connection-arrow" style="flex-direction:column;align-items:stretch;gap:0.3rem">`;
        html += `<div style="display:flex;align-items:center;gap:0.5rem">`;
        html += `<span class="conn-label">${from.num} ${from.title}</span>`;
        html += `<span class="conn-arrow">&rarr;</span>`;
        html += `<span>${conn.label}</span>`;
        html += `</div>`;
        if (conn.desc) {
          html += `<div style="font-size:0.82rem;color:var(--text-dim);line-height:1.45">${conn.desc}</div>`;
        }
        html += `</div>`;
      });
      html += `</div>`;
    }

    // Leads to
    const leadsTo = DATA.connections.filter(c => c.from === lid);
    if (leadsTo.length > 0) {
      html += `<div class="modal-section">`;
      html += `<div class="modal-section-label">This leads to</div>`;
      leadsTo.forEach(conn => {
        const to = DATA.lectures[conn.to];
        html += `<div class="modal-connection-arrow" style="flex-direction:column;align-items:stretch;gap:0.3rem">`;
        html += `<div style="display:flex;align-items:center;gap:0.5rem">`;
        html += `<span>${conn.label}</span>`;
        html += `<span class="conn-arrow">&rarr;</span>`;
        html += `<span class="conn-label">${to.num} ${to.title}</span>`;
        html += `</div>`;
        if (conn.desc) {
          html += `<div style="font-size:0.82rem;color:var(--text-dim);line-height:1.45">${conn.desc}</div>`;
        }
        html += `</div>`;
      });
      html += `</div>`;
    }
  }

  content.innerHTML = html;

  // Make prereq chips clickable
  content.querySelectorAll('.modal-prereq-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      showLectureSummary(chip.dataset.lid);
    });
  });

  setGraphActive(lid);
  modal.classList.add('active');
}

export function initModal() {
  document.getElementById('modalClose').addEventListener('click', () => {
    document.getElementById('lectureModal').classList.remove('active');
  });

  document.getElementById('lectureModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      document.getElementById('lectureModal').classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('lectureModal').classList.contains('active')) {
      document.getElementById('lectureModal').classList.remove('active');
    }
  });
}
