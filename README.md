# BFS218 Asynchronous Course Site

Instructor-created course site for the fully asynchronous section of **BFS218: Racism and the Digital Age (Understanding Techno-Racism)** at Seneca Polytechnic. There are no live classes in this section: the site carries the weekly teaching and the student sets the pace between two fixed due dates.

A student-facing weekly learning pathway on the shared corpus engine: search and filter the course readings, move through the course by week, drill into one source, browse the glossary and key thinkers, and run self-check cards. Weekly pages carry the overview, purpose, outcomes, guiding questions, concepts, readings, an immersive weekly experience, and an activity. The repo also serves the legacy weekly presentation routes at `/walkthroughs/`.

It is a **companion to Blackboard**, not a replacement. Official course records, discussion, grades, and submission live in Blackboard. No accounts, no grading, no student-to-student interaction, no analytics, no PDFs, and no reproduced reading text. Reading links point outward (open access, publisher, Seneca Library, or Blackboard).

## Canonical public site
This repository serves the asynchronous section site (planned URL `https://rpeart73.github.io/bfs218-async/`). The synchronous-online section has its own site; shared curriculum data cascades from the course master via `_shared/cascade.sh`, and presentation stays forked per section.

Edit and deploy this repository for all BFS218 site updates.

## Editing content
Live data is `data/corpus-data.js` (one `window.BFS218` object) plus `data/bfs218-mc.js` (self-check banks). Weekly page copy lives in the `WEEKPAGE` block of `app.js`.
- Never use em or en dashes anywhere.
- Every glossary term and key concept cites the week's assigned reading.
- Book readings are always pinned to a chapter or page range; nothing is due in the final week (the final project is due in Week 13, matching the official outline).
- After editing JavaScript or data, bump the matching `?v=` cache-buster in `index.html`.

## Run it
Static site, no build step, no framework. Serve the folder and open it:

```bash
python3 -m http.server 8200
```

IBM Plex Sans and Mono are self-hosted from `./fonts/` (OFL 1.1, license in `fonts/OFL.txt`); the site loads no CDN scripts and no Google Fonts. The only external requests are user-facing scholar media embeds or source links. Embeddable videos use official YouTube no-cookie players; podcasts or restricted media link to the official source site and are not downloaded or rehosted.
