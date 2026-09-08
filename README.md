# Grade 9 Teacher's Books — landing page

The download page for the two Skyworks System teaching apps: **English — Teacher's Notes &
Lesson Plans** and **Social Science — Teacher's Resource Book**, Grade 9 Junior High,
standards-based curriculum, Papua New Guinea.

A static site. No build step, no dependencies — open `index.html` and it runs.

```
index.html                 the whole page
assets/css/styles.css      design system + every section
assets/js/main.js          nav, reveals, downloads, file-size check
assets/img/                logo, book covers, app screenshots, backgrounds (web-optimised)
downloads/                 >>> put the two .apk files here <<<
```

## 1. Add the app files

Copy the two APKs into `downloads/` with these exact names:

- `downloads/skyworks-grade9-english.apk`
- `downloads/skyworks-grade9-social-science.apk`

See [`downloads/README.md`](downloads/README.md) — it also covers what to do if an APK is
over GitHub's 100 MB file limit.

## 2. Publish it on GitHub Pages

```bash
git init
git add .
git commit -m "Grade 9 teacher's books landing page"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

Then on the repo page: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save.**

The site goes live at `https://USERNAME.github.io/REPO/` within a minute or two. The
`.nojekyll` file is already here so GitHub serves the folders as-is.

## How the downloads work

Each download button is a plain link with a `download` attribute pointing at the APK in
`downloads/`. Tapping it saves the file to the phone, and Android takes over from there — the
page's install section walks the teacher through allowing the install.

Two things the page does on top of that:

- **Real file sizes.** On load it asks the server for each APK's size and prints it under the
  button, so nobody starts a download blind on a slow connection.
- **No dead links.** If an APK is missing, that button turns grey and says "Not published yet"
  rather than opening a 404. Add the file and it re-enables itself.

`Download both apps` in the hero fires both links in turn. Browsers ask permission before
saving two files — that is normal, and the on-screen message says so.

## Changing things

| To change | Edit |
|---|---|
| Download URLs (e.g. to point at GitHub Releases) | the four `href`s on `.js-download` in `index.html` |
| Version number shown on a card | `book__meta` in `index.html` |
| Colours, spacing, shadows, radius | the `:root` tokens at the top of `assets/css/styles.css` |
| Book cover images | replace files in `assets/img/`, keep the same names |
| Logo | `assets/img/logo.png` / `.webp` (round, transparent) |
| WhatsApp / email | the two `.foot__contact` links in `index.html` |

Colours, type scale, radius and shadows all come from CSS variables in one block, so a change
there carries across every section.

## Design

Built against the *Modern Website Design Golden Rules*: layered shadows on every card,
gradient backgrounds rather than flat fills, generous spacing, Inter throughout, a consistent
16–28px radius scale, two primary colours plus a gold accent, hover lift on cards and buttons,
sticky glass navigation, and full responsive layouts for desktop, tablet and phone. Reduced
motion and print styles are included.

Each book keeps the colour of its own cover — blue for English, magenta for Social Science —
so the download button matches the book beside it.
