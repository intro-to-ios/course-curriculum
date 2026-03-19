# iOS Development Course — Curriculum Visualizer

A single-page web app that displays a 14-lecture iOS development course as an interactive dependency graph with searchable content and lecture detail modals.

## Running locally

Double-click `start.command`, or:

```sh
python3 -m http.server 8765
```

Then open [localhost:8765](http://localhost:8765).

> The app uses ES modules, so it must be served over HTTP — opening `index.html` directly won't work.

## Features

- Interactive SVG dependency graph showing lecture prerequisites
- Dark/light theme with persistence
- Search and filter across all lectures
- Collapsible lecture cards with detailed content
- Mobile-friendly layout
- No build step — vanilla HTML, CSS, and JavaScript
