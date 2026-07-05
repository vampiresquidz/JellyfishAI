# HypnoFlow — Waitlist Landing Page

A pre-launch landing page for **HypnoFlow**, the AI hypnosis & meditation app.
Collects a **username + email** waitlist, branded to match the app (aurora/void
palette) with an animated **Professor Jelly** mascot.

## Run locally

Any static server works. From this folder:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

(Opening `index.html` directly as a file also works, except the form POST —
locally it falls back to saving entries in `localStorage` so you can test the UX.)

## Deploy + collect signups

### Option A — Netlify (recommended, zero backend)
The form is already set up for **Netlify Forms** (`data-netlify="true"`).

1. Push this folder to a Git repo, or drag-and-drop it onto <https://app.netlify.com/drop>.
2. That's it — every signup appears under **Site → Forms → “waitlist”** in the
   Netlify dashboard. Export to CSV anytime; add a notification email/webhook there.

### Option B — Formspree
Prefer Formspree? In `main.js`, change the `fetch('/', …)` call to your Formspree
endpoint (`https://formspree.io/f/XXXXXXXX`) and remove the `data-netlify` attributes
from the two `<form>` tags in `index.html`.

## Customize

- **The offer:** the "3 months of Pro free" founding-member perk lives in
  `index.html` (search `founding`). Swap it for whatever incentive you want.
- **Copy & FAQ:** all in `index.html`.
- **Colors/branding:** CSS variables at the top of `styles.css`.
- **Mascot:** the animation is a sprite sheet (`assets/mascot-*-sheet.png`, a 6×5
  grid of 30 frames) driven by `main.js` — the same asset the app uses. Swap the
  `data-sheet` on any `.mascot` element to change pose (wave / hypno).

## Assets

Generated with Higgsfield (hero dreamscape, mascot art) and composited locally
(`og-image.png`, favicons). Professor Jelly poses and animations are shared with
the HypnoFlow app.
