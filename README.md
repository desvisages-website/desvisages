# Des Visages

A single page in six sections: home, aleas / discography, biography, gallery, live and contact. Native HTML, CSS and JavaScript; no installation or build step. The repository root is ready for GitHub Pages.

## Preview locally

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/`. Titles use **Apfel Grotezk Mittel (weight 500)** by Luigi Gorlero; all other text uses **Aujournuit Variable** by Teo Gaudet, initially at regular width 100. Both are supplied by the owner from [Collletttivo](https://www.collletttivo.it/typefaces/) and self-hosted with their SIL Open Font Licenses in `assets/fonts/`.

Apfel is served as WOFF2, with its original OTF also included. Aujournuit is served from the original variable TTF: the supplied `Aujournuit-VariableVF.woff2` actually renders at a fixed width, whereas the TTF preserves the `wdth` axis (50–200). Keep using the TTF unless a replacement is verified to change width in the browser. The earlier Rebak personal-use demo remains ignored by Git and is never requested by the public site.

## Editing the site

- **Sections:** the six `.section-nav` links and six `main > section` elements in `index.html` correspond one to one. The hero menu links to the same sections. The right-side marks track normal page scrolling. Inactive marks are rounded 18 × 3 px lines; the current section becomes an 18 × 9 px rounded rectangle. Mobile uses 15 × 3 px / 15 × 8 px. Both use 24 px row spacing and translucent marks, with stronger opacity on hover / keyboard focus; link targets remain wider than the marks.
- **Photos:** put optimized WebP files in `assets/images/`, then update `<img>` paths, dimensions, alt text, and entries in the `#gallery-data` JSON block. Biography fills the section with its existing photo: CSS crops around the faces and anchors the left hairline about 24 px from the top (16 px on phones). Its BIOGRAPHY title and white text sit lower over the dark clothing, with three desktop columns, two tablet columns and one column on narrow phones. A lower gradient maintains contrast; mobile lets the text continue into the same dark background. Short desktop windows allow a taller section so the text stays below the faces. The full portrait stays available in the photo gallery. Keep visible copy limited to section titles, functional labels and the biography based on the owner’s supplied text; do not add slogans.
- **Films:** the Gallery cover has a single photo background; Photos opens the collection in a lightbox and Videos opens `#video-dialog`. Add videos to that dialog. Native controls, posters and `preload="none"` keep playback intentional and initial loading light.
- **Discography:** aleas has the main release section; the debut EP appears below its artwork. The music dialog loads the existing Bandcamp album IDs only when requested and includes a direct Bandcamp fallback link.
- **Concerts:** add an `.event` article inside `.events-list`, with `data-date="YYYY-MM-DD"` and a matching `<time datetime>`. JavaScript sorts / separates upcoming and archived dates against Europe/Amsterdam time. A known month or year can use `YYYY-MM` or `YYYY`; do not invent missing date components. Only publish confirmed events and actual ticket / venue links.
- **Contacts:** current bookings use César's public email. Instagram / YouTube are explicitly labelled as his accounts; Bandcamp is the duo's page. Replace with the duo's own contacts when supplied; do not guess handles or addresses.
- **Design:** colour and typography variables are at the start of `style.css`. Mobile flows remain scrollable, and reduced-motion preferences disable smooth scrolling / animations.

## Source material and limits of the first version

Release details, album IDs, contacts, the debut EP artwork and the audiovisual excerpt were recovered from `cesarvidalmusic/cesarvidalmusic`, specifically `des-visages.html`, `aleas.html`, `des-visages-ep.html`, `contact.html`, `img/` and `videos/`. Nothing in that repository was edited.

The supplied archives provide `bio.webp` for the biography portrait, `sección-fotos.jpg` for the single Gallery background, `eventos.png` for concerts, and `cover-aleas.png` for the album artwork. Original images were converted to sRGB when needed. The latest hero upload, `1 (todos bordes color sólido).webp`, replaces the earlier transparent cutout. Its 2500 × 2831 px WebP is copied unchanged, with a 1100 × 1246 px mobile version encoded at quality 94. The page background is `#b9070a`, the most common RGB value along its outer edges; subtle CSS masks blend small compression differences at the photograph's top and sides. The larger portrait is framed below the uppercase title to keep faces clear. Source archives remain outside Git; only the web assets are committed.

The red portrait was originally credited to Beatriz Álvarez on the personal site. Per the owner's explicit correction, no photographer credit appears in the site or gallery dialogs; source attribution stays here. The bio is edited from the complete text the owner supplied, retaining the instrumental setup, visual work, influences and release history. The aleas video is a 19.8-second excerpt, encoded for the web at 1280 px. It plays in a dialog without automatic audio.

The initial archive contains only documented appearances:

- The Horse Hospital, London, 15 June 2026 — [venue](https://thehorsehospital.squarespace.com/events/dirarkalash-momokogill-desvisages).
- Fête de la Musique, Geneva, 2025 — existing personal-site bio; no precise day or month is asserted.
- Électrons libérés, HEM Black Box, Geneva, 21 February 2025 — [HEM](https://hem.hesge.ch/en/evenements/electrons-liberes).

No future dates are invented. The empty upcoming view provides a booking link.

The long-scroll structure and side navigation take [Ben van Gelder's site](https://www.benvangelder.com/home/) as a reference. This implementation uses original code and the duo's own texts and materials.

## Source publication and hosting

Preserve `CNAME` (`www.desvisages.net`). GitHub Pages publishes from `main` at the repository root. A successful merge into `main` triggers the `pages build and deployment` workflow. Continue using task branches and pull requests for subsequent changes, then integrate / deploy within the owner's authorization.
