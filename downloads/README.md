# Put the two app files here

The download buttons on the landing page point at these two exact filenames:

| App | File name it must have |
|---|---|
| English — Teacher's Notes & Lesson Plans | `skyworks-grade9-english.apk` |
| Social Science — Teacher's Resource Book | `skyworks-grade9-social-science.apk` |

Copy your built APKs into this folder and rename them to match. Nothing else needs changing —
the page reads each file's real size from the server and shows it under the button.

## If a file is missing

The page checks both files when it loads. If one is not here yet, its button turns grey and
says "Not published yet" instead of sending a teacher to a 404 page. Add the file and the
button comes back on its own.

## If an APK is larger than 100 MB

GitHub blocks single files over 100 MB in a normal repository. Use a **GitHub Release** instead:

1. On your repo page: **Releases** → **Draft a new release** → tag it `v1.0`.
2. Drag both `.apk` files into the "Attach binaries" box, then **Publish release**.
3. In `index.html`, replace the `href` on each download button with the release file URL, e.g.

   ```
   https://github.com/USERNAME/REPO/releases/download/v1.0/skyworks-grade9-english.apk
   ```

   There are **two** buttons per app (one in the books section, one in the closing call to
   action) — update all four `href` values. Nothing in `assets/js/main.js` needs editing.
