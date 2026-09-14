# Ayush Shukla — Portfolio

A dark, gold/red-branded, installable (PWA) personal portfolio for **Ayush Shukla** — AI/ML Engineer & Mathematics Educator.

## Run it locally

No build step needed — it's plain HTML/CSS/JS.

```bash
cd portfolio
python3 -m http.server 8000
# open http://localhost:8000
```

Or open `index.html` directly in a browser (some PWA/service-worker features require a local server, not `file://`).

## Deploy

Upload the whole folder as-is to any static host: GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.
No `npm install` / build step is required.

## What's real vs. placeholder

- **Real, from your resumes:** education, work experience, skills, project descriptions.
- **Real assets:** your AS logo, your photo, your 3 project screenshots, both resume PDFs.
- **Live data:** the GitHub section calls the public GitHub API for `itxayushshukla` (repo count, followers, languages, repo list). If the API is unreachable, it falls back to the 5 known repositories you listed, with no invented data.
- **Placeholders (clearly marked, easy to replace):**
  - "View Code" / "Live Demo" buttons on Pothole Finder & JARVIS — add real links in `index.html` once you have them (search for `is-placeholder`).
  - Teaching demo videos — currently "Demo lecture coming soon" cards. To add a real video, edit the `teachingVideos` array near the bottom of `script.js`:
    ```js
    const teachingVideos = [
      { title: "Quadratic Equations", src: "assets/videos/quadratics.mp4", poster: "assets/videos/quadratics.jpg" },
    ];
    ```
    Drop your video files into `assets/videos/` and they'll appear automatically, in order, on the existing cards.
  - Chemistry topics in the Concept Lab are intentionally empty until real teaching material exists (per your instructions not to fabricate credentials/content).

## Structure

```
index.html        → all markup / sections
styles.css         → design system + all styling
script.js          → loader, cursor, particles, tilt, mode switch, modals, GitHub API, PWA
manifest.json      → PWA app manifest (name, icons, theme)
sw.js              → service worker (offline caching)
offline.html       → shown when offline and page isn't cached
icons/             → favicons + PWA icons (generated from your AS logo)
assets/
  logo.png         → your AS logo
  profile.jpg      → your photo
  projects/        → your 3 project screenshots
  resumes/         → your 2 resume PDFs (downloadable as-is)
```

## Editing content

Everything text-based lives directly in `index.html` — section by section, in plain English, no templating engine. Project detail-modal copy (problem/solution/pipeline) lives in the `projectData` object near the top of `script.js`.

## Notes on the audit checklist

- Mobile responsive from 360px up; hamburger menu below 980px.
- Reduced-motion is respected (`prefers-reduced-motion`) — animations and the loader shortcut automatically.
- Custom cursor and 3D tilt are desktop-only (disabled on touch devices).
- Resume PDFs, GitHub link, and LinkedIn link all point to the real files/URLs you provided.
- No invented companies, degrees, marks, or projects — anything not in your resumes is either omitted or shown as a placeholder.
