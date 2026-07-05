# HypnoFlow — Waitlist Landing Page

A pre-launch landing page for **HypnoFlow**, the AI hypnosis & meditation app.
Collects a **username + email** waitlist, branded to match the app (aurora/void
palette) with an animated **Professor Jelly** mascot.

## Run locally

```bash
python -m http.server 4321
# open http://localhost:4321
```

## Collect emails (Web3Forms — works on any host)

The form posts to **[Web3Forms](https://web3forms.com)**, so signups work on any
static host (DigitalOcean, GitHub Pages, Netlify …) with no backend. Each signup
is emailed to you.

1. Go to <https://web3forms.com>, enter the email where you want signups sent, and
   copy the **access key** (free, instant).
2. In `index.html`, replace **both** occurrences of `YOUR_WEB3FORMS_ACCESS_KEY`
   with your key.
3. Done — every submission arrives in your inbox. (Web3Forms also offers a Google
   Sheets / webhook integration if you'd rather pipe them into a list.)

Until the key is set, submissions fall back to `localStorage` so you can test the UX.

## Host on DigitalOcean (App Platform)

Static site, `.do/app.yaml` included.

1. Push this repo to GitHub (see below).
2. DigitalOcean → **Apps → Create App** → connect the GitHub repo `JellyfishAI`.
   It auto-detects a static site; keep the defaults (index `index.html`) and deploy.
   Or via CLI: `doctl apps create --spec .do/app.yaml`.
3. Every `git push` to `main` redeploys automatically. Add a custom domain under
   the app's **Settings → Domains**.

## Customize

- **Copy & FAQ:** all in `index.html`.
- **Colors/branding:** CSS variables at the top of `styles.css`.
- **Mascot:** a sprite sheet (`assets/mascot-*-sheet.png`, a 6×5 grid of 30 frames)
  driven by `main.js` — the same asset the app uses. Adjust `data-fps` on any
  `.mascot` element to change its speed, or swap `data-sheet` to change pose.

## Assets

Hero dreamscape and mascot art generated with Higgsfield; `og-image.png` and
favicons composited locally. Professor Jelly is shared with the HypnoFlow app.
