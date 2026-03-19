import { DATA, isLocked } from './data.js';
import { state } from './state.js';
import { showLectureSummary } from './modal.js';

export function renderGraph() {
  const container = document.getElementById('graph-container');
  const old = document.getElementById('graph-svg');
  if (old) old.remove();
  state.graphNodeElements = {};
  state.graphEdgeElements = [];

  if (window.innerWidth <= 640) return;

  const W = 1160, H = 520;
  const style = getComputedStyle(document.documentElement);
  const get = (v) => style.getPropertyValue(v).trim();

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'graph-svg';
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Course lecture map showing progression through 14 lectures');

  // Arrowhead markers
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const makeMarker = (id, color) => {
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', id);
    marker.setAttribute('viewBox', '0 0 12 8');
    marker.setAttribute('refX', '10');
    marker.setAttribute('refY', '4');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('orient', 'auto');
    marker.setAttribute('markerUnits', 'userSpaceOnUse');
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    poly.setAttribute('d', 'M1,1 L10,4 L1,7');
    poly.setAttribute('fill', 'none');
    poly.setAttribute('stroke', color);
    poly.setAttribute('stroke-width', '1.5');
    poly.setAttribute('stroke-linejoin', 'round');
    poly.setAttribute('stroke-linecap', 'round');
    marker.appendChild(poly);
    return marker;
  };
  defs.appendChild(makeMarker('arrow', get('--edge-color')));
  defs.appendChild(makeMarker('arrow-hover', get('--edge-hover')));
  defs.appendChild(makeMarker('arrow-active', get('--accent')));
  svg.appendChild(defs);

  function rectEdgePoint(cx, cy, w, h, targetX, targetY) {
    const dx = targetX - cx;
    const dy = targetY - cy;
    if (dx === 0 && dy === 0) return { x: cx, y: cy };
    const hw = w / 2;
    const hh = h / 2;
    const sx = dx !== 0 ? hw / Math.abs(dx) : Infinity;
    const sy = dy !== 0 ? hh / Math.abs(dy) : Infinity;
    const s = Math.min(sx, sy);
    return { x: cx + dx * s, y: cy + dy * s };
  }

  // Positions
  const positions = {};
  const nodeW = 120, nodeH = 52, nodeR = 10;

  const nonBreakWeeks = DATA.weeks.filter(w => !w.isBreak);
  const totalWeeks = nonBreakWeeks.length;
  const xPad = 90;
  const usableW = W - 2 * xPad;
  const colSpacing = usableW / (totalWeeks - 1);
  const yCenter = H / 2;
  const yGap = 76;

  let weekIdx = 0;
  DATA.weeks.forEach(week => {
    if (week.isBreak) return;
    const cx = xPad + weekIdx * colSpacing;
    const lectures = week.lectures;
    const count = lectures.length;
    lectures.forEach((lid, li) => {
      const yOff = (li - (count - 1) / 2) * yGap;
      positions[lid] = { x: cx, y: yCenter + yOff };
    });
    weekIdx++;
  });

  // Column backgrounds
  const colGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  weekIdx = 0;
  DATA.weeks.forEach(week => {
    if (week.isBreak) return;
    const cx = xPad + weekIdx * colSpacing;
    const bgW = Math.min(colSpacing * 0.82, nodeW + 36);
    const lectures = week.lectures;
    const count = lectures.length;
    const topY = yCenter - ((count - 1) / 2) * yGap - nodeH / 2 - 14;
    const botY = yCenter + ((count - 1) / 2) * yGap + nodeH / 2 + 14;
    const bgH = botY - topY;

    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('x', cx - bgW / 2);
    bg.setAttribute('y', topY);
    bg.setAttribute('width', bgW);
    bg.setAttribute('height', bgH);
    bg.setAttribute('rx', 12);
    bg.setAttribute('fill', get('--col-bg'));
    colGroup.appendChild(bg);

    const wt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    wt.setAttribute('x', cx);
    wt.setAttribute('y', 28);
    wt.setAttribute('text-anchor', 'middle');
    wt.setAttribute('fill', get('--week-text'));
    wt.setAttribute('font-size', '10');
    wt.setAttribute('font-weight', '600');
    wt.setAttribute('font-family', 'Sora, sans-serif');
    wt.setAttribute('letter-spacing', '0.05em');
    wt.textContent = week.label;
    colGroup.appendChild(wt);

    const tt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    tt.setAttribute('x', cx);
    tt.setAttribute('y', 42);
    tt.setAttribute('text-anchor', 'middle');
    tt.setAttribute('fill', get('--text-dim'));
    tt.setAttribute('font-size', '8');
    tt.setAttribute('font-family', 'Outfit, sans-serif');
    tt.textContent = week.topic;
    colGroup.appendChild(tt);

    weekIdx++;
  });
  svg.appendChild(colGroup);

  // Spring break
  const breakX = (positions['l5'].x + positions['l6'].x) / 2;
  const breakGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const bl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  bl.setAttribute('x1', breakX);
  bl.setAttribute('x2', breakX);
  bl.setAttribute('y1', 55);
  bl.setAttribute('y2', H - 20);
  bl.setAttribute('stroke', get('--break-border'));
  bl.setAttribute('stroke-width', '1');
  bl.setAttribute('stroke-dasharray', '5 4');
  breakGroup.appendChild(bl);
  const bt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  bt.setAttribute('x', breakX);
  bt.setAttribute('y', H - 8);
  bt.setAttribute('text-anchor', 'middle');
  bt.setAttribute('fill', get('--accent'));
  bt.setAttribute('font-size', '9');
  bt.setAttribute('font-weight', '600');
  bt.setAttribute('font-family', 'Sora, sans-serif');
  bt.setAttribute('letter-spacing', '0.08em');
  bt.textContent = 'SPRING BREAK';
  breakGroup.appendChild(bt);
  svg.appendChild(breakGroup);

  // Edges
  const edgeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  DATA.connections.forEach((conn, ci) => {
    const p1 = positions[conn.from];
    const p2 = positions[conn.to];
    if (!p1 || !p2) return;

    const locked = isLocked(conn.from) || isLocked(conn.to);

    const arrowGap = 6;
    const start = rectEdgePoint(p1.x, p1.y, nodeW + arrowGap, nodeH + arrowGap, p2.x, p2.y);
    const end = rectEdgePoint(p2.x, p2.y, nodeW + arrowGap * 2, nodeH + arrowGap * 2, p1.x, p1.y);
    const startX = start.x, startY = start.y;
    const endX = end.x, endY = end.y;

    const edgeDx = endX - startX;
    const edgeDy = endY - startY;
    const edgeLen = Math.sqrt(edgeDx * edgeDx + edgeDy * edgeDy) || 1;
    const mx = (startX + endX) / 2;
    const my = (startY + endY) / 2;
    const perpX = -edgeDy;
    const perpY = edgeDx;
    const pLen = Math.sqrt(perpX * perpX + perpY * perpY) || 1;
    const curvature = Math.min(edgeLen * 0.15, 30) * (ci % 2 === 0 ? 1 : -1);
    const cx = mx + (perpX / pLen) * curvature;
    const cy = my + (perpY / pLen) * curvature;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M${startX},${startY} Q${cx},${cy} ${endX},${endY}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', get('--edge-color'));
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('marker-end', 'url(#arrow)');
    path.dataset.from = conn.from;
    path.dataset.to = conn.to;
    path.style.transition = 'stroke 0.2s, opacity 0.2s';

    if (locked) {
      path.style.opacity = '0.25';
      path.setAttribute('stroke-dasharray', '4 3');
    }

    state.graphEdgeElements.push({ path, from: conn.from, to: conn.to });

    // Hit zone
    const hitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    hitPath.setAttribute('d', `M${startX},${startY} Q${cx},${cy} ${endX},${endY}`);
    hitPath.setAttribute('fill', 'none');
    hitPath.setAttribute('stroke', 'transparent');
    hitPath.setAttribute('stroke-width', '12');
    hitPath.style.cursor = 'default';

    const showEdgeLabel = (e) => {
      if (!conn.label) return;
      const et = document.getElementById('edgeTooltip');
      et.textContent = conn.label;
      et.style.opacity = '1';
      et.style.left = (e.clientX + 10) + 'px';
      et.style.top = (e.clientY - 28) + 'px';
      path.setAttribute('stroke', get('--edge-hover'));
      path.setAttribute('stroke-width', '2.5');
      path.setAttribute('marker-end', 'url(#arrow-hover)');
    };
    const hideEdgeLabel = () => {
      document.getElementById('edgeTooltip').style.opacity = '0';
      const isActive = state.activeNodeId && (conn.from === state.activeNodeId || conn.to === state.activeNodeId);
      path.setAttribute('stroke', isActive ? get('--accent') : get('--edge-color'));
      path.setAttribute('stroke-width', isActive ? '2' : '1.5');
      path.setAttribute('marker-end', isActive ? 'url(#arrow-active)' : 'url(#arrow)');
    };
    hitPath.addEventListener('mouseenter', showEdgeLabel);
    hitPath.addEventListener('mousemove', (e) => {
      const et = document.getElementById('edgeTooltip');
      if (et.style.opacity === '1') {
        et.style.left = (e.clientX + 10) + 'px';
        et.style.top = (e.clientY - 28) + 'px';
      }
    });
    hitPath.addEventListener('mouseleave', hideEdgeLabel);

    edgeGroup.appendChild(path);
    edgeGroup.appendChild(hitPath);
  });
  svg.appendChild(edgeGroup);

  // Nodes
  const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const lectureIds = Object.keys(DATA.lectures);

  lectureIds.forEach((lid, i) => {
    const l = DATA.lectures[lid];
    const pos = positions[lid];
    if (!pos) return;

    const locked = isLocked(lid);

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.style.cursor = locked ? 'default' : 'pointer';
    g.dataset.id = lid;

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', pos.x - nodeW / 2);
    rect.setAttribute('y', pos.y - nodeH / 2);
    rect.setAttribute('width', nodeW);
    rect.setAttribute('height', nodeH);
    rect.setAttribute('rx', nodeR);
    rect.setAttribute('fill', get('--node-bg'));
    rect.setAttribute('stroke', get('--node-border'));
    rect.setAttribute('stroke-width', '1.5');
    rect.style.transition = 'fill 0.2s, stroke 0.2s, stroke-width 0.2s';

    if (locked) {
      rect.setAttribute('stroke-dasharray', '4 3');
      g.style.opacity = '0.35';
    }

    g.appendChild(rect);
    state.graphNodeElements[lid] = { rect, g };

    // Lecture number
    const numText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    numText.setAttribute('x', pos.x);
    numText.setAttribute('y', pos.y - 7);
    numText.setAttribute('text-anchor', 'middle');
    numText.setAttribute('fill', locked ? get('--text-dim') : get('--accent'));
    numText.setAttribute('font-size', '11');
    numText.setAttribute('font-weight', '600');
    numText.setAttribute('font-family', 'Sora, sans-serif');
    numText.textContent = l.num;
    g.appendChild(numText);

    // Title wrapping
    const maxCharsPerLine = 16;
    const title = l.title;
    let lines = [];
    if (title.length <= maxCharsPerLine) {
      lines = [title];
    } else {
      const words = title.split(/\s+/);
      let line = '';
      for (const word of words) {
        if (line && (line + ' ' + word).length > maxCharsPerLine) {
          lines.push(line);
          line = word;
        } else {
          line = line ? line + ' ' + word : word;
        }
      }
      if (line) lines.push(line);
      if (lines.length > 2) {
        lines = [lines[0], lines.slice(1).join(' ')];
        if (lines[1].length > maxCharsPerLine + 2) {
          lines[1] = lines[1].substring(0, maxCharsPerLine) + '\u2026';
        }
      }
    }

    lines.forEach((ln, li) => {
      const tt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tt.setAttribute('x', pos.x);
      tt.setAttribute('y', pos.y + 6 + li * 12);
      tt.setAttribute('text-anchor', 'middle');
      tt.setAttribute('fill', get('--node-text'));
      tt.setAttribute('font-size', '9.5');
      tt.setAttribute('font-family', 'Outfit, sans-serif');
      tt.textContent = ln;
      g.appendChild(tt);
    });

    // Staggered fade-in (locked nodes stay dim)
    if (!locked) {
      g.style.opacity = '0';
      setTimeout(() => {
        g.style.transition = 'opacity 0.35s ease';
        g.style.opacity = '1';
      }, 50 * i);
    } else {
      const finalOpacity = '0.35';
      g.style.opacity = '0';
      setTimeout(() => {
        g.style.transition = 'opacity 0.35s ease';
        g.style.opacity = finalOpacity;
      }, 50 * i);
    }

    if (!locked) {
      // Hover
      g.addEventListener('mouseenter', (e) => {
        rect.setAttribute('stroke', get('--accent'));
        rect.setAttribute('stroke-width', '2.5');
        rect.setAttribute('fill', get('--node-hover-bg'));

        const connected = new Set([lid]);
        DATA.connections.forEach(c => {
          if (c.from === lid) connected.add(c.to);
          if (c.to === lid) connected.add(c.from);
        });
        nodeGroup.querySelectorAll('g').forEach(ng => {
          const ngLocked = isLocked(ng.dataset.id);
          if (ngLocked) return;
          ng.style.opacity = connected.has(ng.dataset.id) ? '1' : '0.2';
          ng.style.transition = 'opacity 0.2s';
        });
        state.graphEdgeElements.forEach(({ path, from, to }) => {
          const show = from === lid || to === lid;
          path.style.opacity = show ? '1' : '0.08';
          if (show) {
            path.setAttribute('stroke', get('--edge-hover'));
            path.setAttribute('stroke-width', '2');
            path.setAttribute('marker-end', 'url(#arrow-hover)');
          }
        });

        const tooltip = document.getElementById('tooltip');
        const plain = l.body.replace(/<[^>]+>/g, '');
        const first = plain.split('. ').slice(0, 2).join('. ') + '.';
        tooltip.textContent = first;
        tooltip.style.opacity = '1';
        tooltip.style.left = Math.min(e.clientX + 14, window.innerWidth - 300) + 'px';
        tooltip.style.top = (e.clientY - 50) + 'px';
      });

      g.addEventListener('mousemove', (e) => {
        const tooltip = document.getElementById('tooltip');
        if (tooltip.style.opacity === '1') {
          tooltip.style.left = Math.min(e.clientX + 14, window.innerWidth - 300) + 'px';
          tooltip.style.top = (e.clientY - 50) + 'px';
        }
      });

      g.addEventListener('mouseleave', () => {
        const isScrollActive = lid === state.activeNodeId;
        rect.setAttribute('stroke', isScrollActive ? get('--accent') : get('--node-border'));
        rect.setAttribute('stroke-width', isScrollActive ? '2' : '1.5');
        rect.setAttribute('fill', isScrollActive ? get('--node-active-bg') : get('--node-bg'));
        nodeGroup.querySelectorAll('g').forEach(ng => {
          if (!isLocked(ng.dataset.id)) ng.style.opacity = '1';
        });
        state.graphEdgeElements.forEach(({ path, from, to }) => {
          const isConnected = state.activeNodeId && (from === state.activeNodeId || to === state.activeNodeId);
          path.style.opacity = (isLocked(from) || isLocked(to)) ? '0.25' : '1';
          path.setAttribute('stroke', isConnected ? get('--accent') : get('--edge-color'));
          path.setAttribute('stroke-width', isConnected ? '2' : '1.5');
          path.setAttribute('marker-end', isConnected ? 'url(#arrow-active)' : 'url(#arrow)');
        });
        document.getElementById('tooltip').style.opacity = '0';
      });

      g.addEventListener('click', () => {
        showLectureSummary(lid);
      });
    } else {
      // Locked hover: show "coming soon" tooltip
      g.addEventListener('mouseenter', (e) => {
        const tooltip = document.getElementById('tooltip');
        tooltip.textContent = 'Under construction \u2014 coming soon';
        tooltip.style.opacity = '1';
        tooltip.style.left = Math.min(e.clientX + 14, window.innerWidth - 300) + 'px';
        tooltip.style.top = (e.clientY - 50) + 'px';
      });
      g.addEventListener('mousemove', (e) => {
        const tooltip = document.getElementById('tooltip');
        if (tooltip.style.opacity === '1') {
          tooltip.style.left = Math.min(e.clientX + 14, window.innerWidth - 300) + 'px';
          tooltip.style.top = (e.clientY - 50) + 'px';
        }
      });
      g.addEventListener('mouseleave', () => {
        document.getElementById('tooltip').style.opacity = '0';
      });
    }

    nodeGroup.appendChild(g);
  });
  svg.appendChild(nodeGroup);

  container.insertBefore(svg, container.firstChild);

  if (state.activeNodeId) setGraphActive(state.activeNodeId);
}

export function setGraphActive(lid) {
  const style = getComputedStyle(document.documentElement);
  const get = (v) => style.getPropertyValue(v).trim();

  Object.entries(state.graphNodeElements).forEach(([id, { rect }]) => {
    if (isLocked(id)) return;
    const isActive = id === lid;
    rect.setAttribute('stroke', isActive ? get('--accent') : get('--node-border'));
    rect.setAttribute('stroke-width', isActive ? '2' : '1.5');
    rect.setAttribute('fill', isActive ? get('--node-active-bg') : get('--node-bg'));
  });

  state.graphEdgeElements.forEach(({ path, from, to }) => {
    if (isLocked(from) || isLocked(to)) return;
    const isConnected = from === lid || to === lid;
    path.setAttribute('stroke', isConnected ? get('--accent') : get('--edge-color'));
    path.setAttribute('stroke-width', isConnected ? '2' : '1.5');
    path.setAttribute('marker-end', isConnected ? 'url(#arrow-active)' : 'url(#arrow)');
  });

  document.querySelectorAll('.mg-node').forEach(n => n.classList.remove('mg-active'));
  const mobileNode = document.querySelector(`.mg-node[data-lid="${lid}"]`);
  if (mobileNode) mobileNode.classList.add('mg-active');

  state.activeNodeId = lid;
}

export function setupScrollSync() {
  const sectionIds = Object.keys(DATA.lectures).filter(lid => !isLocked(lid));
  const observer = new IntersectionObserver((entries) => {
    let bestId = state.activeNodeId;
    entries.forEach(e => {
      if (e.isIntersecting && e.intersectionRatio > 0.3) {
        bestId = e.target.id.replace('section-', '');
      }
    });
    if (bestId && bestId !== state.activeNodeId) {
      setGraphActive(bestId);
    }
  }, { threshold: [0.3, 0.6], rootMargin: '-10% 0px -40% 0px' });

  sectionIds.forEach(lid => {
    const el = document.getElementById('section-' + lid);
    if (el) observer.observe(el);
  });
}
