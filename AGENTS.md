# Working on Des Visages

- This repository belongs to the duo. Keep work separate from the owner's personal-site repositories.
- Use native HTML, CSS and JavaScript. There is no dependency installation or build step.
- Preserve the single-page structure, correspondence between sections / navigation marks, hero-only menu, red identity and absence of site headers / footers unless the user requests a change.
- Keep section headings direct: BIOGRAPHY, Gallery, Live, Contact, and the release title. Do not add slogans, promotional taglines or decorative prose. Base biography edits on the user's supplied text, preserving concrete details.
- Biography uses the existing photograph as a full-width background, cropped through CSS around the faces with the left hairline near the top edge. Keep white text in lower columns over the dark part of the photo, with a lower gradient for contrast and the title clear of faces. Use three columns on desktop, two on tablet and one on narrow phones. Preserve the full portrait in the gallery.
- The navigation rail belongs on the right. Use small translucent rounded lines and a rounded active rectangle of the same width (18 × 3 / 18 × 9 px desktop, 15 × 3 / 15 × 8 px mobile), with 24 px row spacing and usable click targets. Do not restore active squares.
- Gallery has one full-screen background photo with Photos / Videos controls opening dialogs. Do not reintroduce a thumbnail grid or visible photographer credits; the owner explicitly requested their removal.
- Use task branches so Codex and Claude Code can collaborate. Push reviewable changes and describe the relevant checks. Integrate / deploy within the user's current authorization; do not introduce redundant permission requests.
- Preserve `CNAME` and existing user changes. Do not force-push or alter DNS as a routine editing step.
- Do not commit the ignored `assets/fonts/rebak-demo.ttf`. It is the supplied personal-use demo for local typography comparison. Titles use the supplied OFL Apfel Grotezk Mittel (500); all other text uses Aujournuit Variable, initially at regular width 100. Serve Aujournuit from the included TTF: the supplied WOFF2 labelled Variable is actually fixed-width. Preserve both fonts' licenses and author credits in documentation. The hero title is uppercase and large; keep it clear of the faces.
- The hero uses the owner's 2500 × 2831 WebP unchanged, plus a smaller mobile version. The red background is #b9070a, sampled from the outer edges. Preserve its match and the subtle edge blending; avoid a visible rectangular photo border.
- Use the user's own photographs, artwork and recordings. Resize / convert carefully, preserve colour profiles / transparency and alt text, and retain source attribution in documentation rather than adding visible credits the user removed.
- Ground biographies, releases, contacts and concert dates in supplied / verified sources. Upcoming dates remain empty until confirmed. Do not invent a group email or social handles.
- Check scrolling / navigation markers, keyboard access, gallery / music dialogs, media and concert filters, and mobile layout after relevant changes. Respect reduced motion and avoid automatic sound.
