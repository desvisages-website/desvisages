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
- **Discography:** aleas has the main release section; the debut EP appears below its artwork. Its Videos link opens the duo's aleas playlist on YouTube; the Gallery video dialog keeps the general channel link. The music dialog loads the existing Bandcamp album IDs only when requested and includes a direct Bandcamp fallback link.
- **Concerts:** each year is a `.events-year` group (an `<h3>` year plus an optional note) inside `.events-list`. Add an `.event` article to the matching group, newest first, with `data-date="YYYY-MM-DD"` and a matching `<time datetime>`; create a new group for a new year. The whole row links to the event page through `.event__link`; `.event__kind` names where it goes (Venue, Event page, Instagram) and an optional `.event__recording` pill links a video. Rows share Contact's hover fill and arrow circle. JavaScript separates upcoming and archived dates against Europe/Amsterdam time and orders them with CSS `order` (upcoming forward, archive backward), hiding empty years. A known month or year can use `YYYY-MM` or `YYYY`; do not invent missing date components. Only publish confirmed events and actual ticket / venue links. On desktop and tablet the Live section is exactly one screen tall and the list scrolls inside it, fading at the edges while more dates remain; on phones the list flows with the page under a photo band cropped on the piano. The Live title sits in the dark area above the piano.
- **Contacts:** the duo's email (`desvisages1@gmail.com`) leads the section, with César Vidal named as the person handling bookings; a Copy address button appears when the browser supports copying. Links are grouped in this order: Follow (Instagram `@desvisages`), Websites (Jorge Care, César Vidal) and Listen & watch (YouTube `@desvisages`, then Bandcamp last). All handles and addresses were supplied by the owner; do not guess new ones. Group labels sit beside their links on wide layouts and above them when the column is narrow. Every contact link has an outlined arrow circle; on hover, keyboard focus or tap the link fills with paper colour, its text turns red and the arrow turns to point forward.
- **Design:** colour and typography variables are at the start of `style.css`. The favicon `assets/favicon.svg` is the duo's DV monogram, white on #b9070a; bump its `?v=` query in `index.html` when it changes, since browsers cache icons. Mobile flows remain scrollable, and reduced-motion preferences disable smooth scrolling / animations.

## Source material and limits of the first version

Release details, album IDs, contacts, the debut EP artwork and the audiovisual excerpt were recovered from `cesarvidalmusic/cesarvidalmusic`, specifically `des-visages.html`, `aleas.html`, `des-visages-ep.html`, `contact.html`, `img/` and `videos/`. Nothing in that repository was edited.

The supplied archives provide `bio.webp` for the biography portrait, `sección-fotos.jpg` for the single Gallery background, `eventos.png` for concerts, and `cover-aleas.png` for the album artwork. Original images were converted to sRGB when needed. The latest hero upload, `1 (todos bordes color sólido).webp`, replaces the earlier transparent cutout. Its 2500 × 2831 px WebP is copied unchanged, with a 1100 × 1246 px mobile version encoded at quality 94. The page background is `#b9070a`, the most common RGB value along its outer edges; subtle CSS masks blend small compression differences at the photograph's top and sides. The larger portrait is framed below the uppercase title to keep faces clear. Source archives remain outside Git; only the web assets are committed.

The red portrait was originally credited to Beatriz Álvarez on the personal site. Per the owner's explicit correction, no photographer credit appears in the site or gallery dialogs; source attribution stays here. The bio is edited from the complete text the owner supplied, retaining the instrumental setup, visual work, influences and release history. The aleas video is a 19.8-second excerpt, encoded for the web at 1280 px. It plays in a dialog without automatic audio.

The archive lists every Des Visages concert published on [jorgecare.com/concerts](https://jorgecare.com/concerts) (checked 23 October 2026), with its titles, venues and links: the six dates of the June 2026 European Tour (Pakt Bern, Café Heloïse Paris, DATA Marseille, SubWaves Amsterdam, The Horse Hospital London, Mayhem Copenhagen) and, in 2025, Fête de la Musique (20 June, with On Press Off) and the EP launch concert (21 February, Électrons libérés), both at the HEM Black Box in Geneva. The Horse Hospital's line-up note comes from the venue page.

No future dates are invented. The empty upcoming view provides a booking link.

The long-scroll structure and side navigation take [Ben van Gelder's site](https://www.benvangelder.com/home/) as a reference. This implementation uses original code and the duo's own texts and materials.

## Source publication and hosting

Preserve `CNAME` (`www.desvisages.net`). GitHub Pages publishes from `main` at the repository root. A successful merge into `main` triggers the `pages build and deployment` workflow. Continue using task branches and pull requests for subsequent changes, then integrate / deploy within the owner's authorization.
