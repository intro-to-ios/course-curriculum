# iOS Development Course - Curriculum Visualizer

Single-page web app displaying a 14-lecture iOS course curriculum with an interactive graph, searchable content sections, and lecture detail modals.

## File Structure

```
Course/
├── index.html              # HTML skeleton only — no logic or styles
├── styles.css              # All CSS (themes, layout, components, responsive)
├── start.command            # Double-click to launch local dev server (python3, port 8765)
└── js/
    ├── app.js              # Entry point — imports all modules, runs init
    ├── data.js             # Course data (lectures, weeks, connections) + MAX_AVAILABLE_LECTURE config
    ├── state.js            # Shared mutable state (activeNodeId, graphNodeElements, etc.)
    ├── theme.js            # Dark/light theme toggle + localStorage persistence
    ├── graph.js            # Desktop SVG graph rendering, node hover/click, scroll sync
    ├── mobile-graph.js     # Mobile graph (text-based grid for ≤640px)
    ├── modal.js            # Lecture summary modal (prereqs, progress, connections)
    ├── content.js          # Main content sections (collapsible lecture cards)
    └── search.js           # Search filtering, highlight, expand/collapse all
```

## Key Concepts

- **Locked lectures**: Controlled by `MAX_AVAILABLE_LECTURE` in `data.js`. Lectures beyond this number show "under construction" in content, graph nodes, mobile graph, and modal.
- **ES modules**: All JS uses `import`/`export`. Must be served via HTTP server (not `file://`).
- **No build step**: Vanilla HTML/CSS/JS, no bundler or framework.

## What to edit for common tasks

| Task | File(s) |
|---|---|
| Add/edit lecture content | `js/data.js` |
| Change which lectures are available | `js/data.js` → `MAX_AVAILABLE_LECTURE` |
| Change styling/colors/theme | `styles.css` |
| Change graph layout or interactions | `js/graph.js` |
| Change mobile graph | `js/mobile-graph.js` |
| Change modal content/layout | `js/modal.js` |
| Change search behavior | `js/search.js` |
| Change lecture card rendering | `js/content.js` |
| Change HTML structure | `index.html` |
