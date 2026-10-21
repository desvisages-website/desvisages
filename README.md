# Des Visages

A single page in six sections: home, aleas / discography, biography, gallery, live and contact. Native HTML, CSS and JavaScript; no installation or build step. The repository root is ready for GitHub Pages.

## Preview locally

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/`. Display titles use **Bodoni Moda Black (weight 900)**; body text uses Archivo Narrow. Both fonts are self-hosted with their SIL Open Font Licenses in `assets/fonts/`. Bodoni Moda is sourced from [Google Fonts](https://github.com/google/fonts/tree/main/ofl/bodonimoda).

The earlier Rebak file is a personal-use demo and remains ignored by Git. The public site uses Bodoni Moda throughout; it has no demo font request or query-string typography switch.

## Editing the site

- **Sections:** the six `.section-nav` links and six `main > section` elements in `index.html` correspond one to one. The hero menu links to the same sections. The right-side marks track normal page scrolling. Inactive marks are 24 × 4 px, with a 24 × 24 px active square and 32 px row spacing (20 px / 28 px on mobile).
- **Photos:** put optimized WebP files in `assets/images/`, then update `<img>` paths, dimensions, alt text, and entries in the `#gallery-data` JSON block. The biography uses its supplied portrait alongside text instead of stretching a vertical image across the viewport. Keep visible copy limited to section titles, functional labels and the biography based on the owner’s supplied text; do not add slogans.
- **Films:** the Gallery cover has a single photo background; Photos opens the collection in a lightbox and Videos opens `#video-dialog`. Add videos to that dialog. Native controls, posters and `preload="none"` keep playback intentional and initial loading light.
- **Discography:** aleas has the main release section; the debut EP appears below its artwork. The music dialog loads the existing Bandcamp album IDs only when requested and includes a direct Bandcamp fallback link.
- **Concerts:** add an `.event` article inside `.events-list`, with `data-date="YYYY-MM-DD"` and a matching `<time datetime>`. JavaScript sorts / separates upcoming and archived dates against Europe/Amsterdam time. A known month or year can use `YYYY-MM` or `YYYY`; do not invent missing date components. Only publish confirmed events and actual ticket / venue links.
- **Contacts:** current bookings use César's public email. Instagram / YouTube are explicitly labelled as his accounts; Bandcamp is the duo's page. Replace with the duo's own contacts when supplied; do not guess handles or addresses.
- **Design:** colour and typography variables are at the start of `style.css`. Mobile flows remain scrollable, and reduced-motion preferences disable smooth scrolling / animations.

## Source material and limits of the first version

Release details, album IDs, contacts, the debut EP artwork and the audiovisual excerpt were recovered from `cesarvidalmusic/cesarvidalmusic`, specifically `des-visages.html`, `aleas.html`, `des-visages-ep.html`, `contact.html`, `img/` and `videos/`. Nothing in that repository was edited.

The two supplied archives have now been integrated: `index.png` supplies the transparent hero cutout, `bio.webp` the biography portrait, `sección-fotos.jpg` the single Gallery background, `eventos.png` the concert background, and `cover-aleas.png` the album artwork. WebP versions include smaller mobile variants. Original images were converted to sRGB when needed; the hero retains transparency. The page background is `#b80c10`, sampled from the red border around the cutout. Original full-size uploads remain outside Git; only the web assets are committed.

The red portrait was originally credited to Beatriz Álvarez on the personal site. Per the owner's explicit correction, no photographer credit appears in the site or gallery dialogs; source attribution stays here. The bio is edited from the complete text the owner supplied, retaining the instrumental setup, visual work, influences and release history. The aleas video is a 19.8-second excerpt, encoded for the web at 1280 px. It plays in a dialog without automatic audio.

The initial archive contains only documented appearances:

- The Horse Hospital, London, 15 June 2026 — [venue](https://thehorsehospital.squarespace.com/events/dirarkalash-momokogill-desvisages).
- Fête de la Musique, Geneva, 2025 — existing personal-site bio; no precise day or month is asserted.
- Électrons libérés, HEM Black Box, Geneva, 21 February 2025 — [HEM](https://hem.hesge.ch/en/evenements/electrons-liberes).

No future dates are invented. The empty upcoming view provides a booking link.

The long-scroll structure and side navigation take [Ben van Gelder's site](https://www.benvangelder.com/home/) as a reference. This implementation uses original code and the duo's own texts and materials.

## Source publication and hosting

Preserve `CNAME` (`www.desvisages.net`). GitHub Pages publishes from `main` at the repository root. A successful merge into `main` triggers the `pages build and deployment` workflow. Continue using task branches and pull requests for subsequent changes, then integrate / deploy within the owner's authorization.
