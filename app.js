(() => {
  'use strict';
  document.documentElement.classList.add('js');

  const sections = [...document.querySelectorAll('main > section[id]')];
  const sectionLinks = [...document.querySelectorAll('.section-nav a')];
  let framePending = false;
  // As the second aleas screen rises into view, --mix goes from 0 to 1 and shifts the background towards Biography.
  const release = document.querySelector('.release');
  const releaseMore = document.querySelector('.release__more');
  function updateReleaseColour() {
    const progress = 1 - releaseMore.getBoundingClientRect().top / window.innerHeight;
    release.style.setProperty('--mix', Math.min(1, Math.max(0, progress)).toFixed(3));
  }
  function updateCurrentSection() {
    updateReleaseColour();
    const marker = window.innerHeight * 0.45;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= marker) current = section;
    }
    document.body.dataset.scene = current.id;
    for (const link of sectionLinks) {
      if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    framePending = false;
  }
  function scheduleSectionUpdate() {
    if (!framePending) {
      framePending = true;
      requestAnimationFrame(updateCurrentSection);
    }
  }
  window.addEventListener('scroll', scheduleSectionUpdate, { passive: true });
  window.addEventListener('resize', scheduleSectionUpdate, { passive: true });
  window.addEventListener('pageshow', updateCurrentSection);
  updateCurrentSection();

  // Typeset the approved paragraphs into equal columns with a fixed 8px gap.
  // Adjust word breaks and the heading's space, never stretch paragraph gaps.
  const biography = document.querySelector('.biography__copy');
  const biographySource = biography.querySelector('.biography__text');
  const biographyTitle = biography.querySelector('h2');
  const biographyParagraphs = [...biographySource.querySelectorAll('p')];
  const biographyWords = biographyParagraphs.map(p => p.textContent.trim().split(/\s+/));
  const biographyEnds = [];
  biographyWords.reduce((offset, words) => {
    biographyEnds.push(offset + words.length);
    return offset + words.length;
  }, 0);
  const biographyFlatWords = biographyWords.flat();
  const biographyCanvas = document.createElement('canvas').getContext('2d');

  function biographyFragments(start, end) {
    let offset = 0;
    return biographyWords.flatMap((words, paragraph) => {
      const lo = Math.max(0, start - offset);
      const hi = Math.min(words.length, end - offset);
      offset += words.length;
      return hi > lo ? [{ paragraph, words: words.slice(lo, hi), continues: hi < words.length }] : [];
    });
  }

  function biographyColumn(fragments) {
    const column = document.createElement('div');
    column.className = 'biography__column';
    const text = document.createElement('div');
    text.className = 'biography__column-text';
    for (const fragment of fragments) {
      const p = document.createElement('p');
      if (fragment.continues) p.className = 'continues';
      const copy = fragment.words.join(' ');
      const emphasis = biographyParagraphs[fragment.paragraph].querySelector('em')?.textContent;
      if (emphasis && copy.includes(emphasis)) {
        const at = copy.indexOf(emphasis);
        const em = document.createElement('em');
        em.textContent = emphasis;
        p.append(copy.slice(0, at), em, copy.slice(at + emphasis.length));
      } else p.textContent = copy;
      text.append(p);
    }
    column.append(text);
    return column;
  }

  function layoutBiography() {
    biography.insertBefore(biographyTitle, biographySource);
    biography.querySelector('.biography__columns')?.remove();
    biography.classList.remove('biography__copy--balanced');
    biography.style.removeProperty('font-size');
    biographyTitle.style.removeProperty('margin-bottom');
    biographySource.hidden = false;
    const css = getComputedStyle(biography);
    const count = Number(css.getPropertyValue('--bio-columns'));
    if (count < 2) return;

    const baseSize = parseFloat(css.fontSize);
    const ratio = parseFloat(css.lineHeight) / baseSize;
    const gap = parseFloat(css.columnGap);
    const width = (biography.getBoundingClientRect().width - (count - 1) * gap) / count;
    const titleHeight = biographyTitle.getBoundingClientRect().height;
    const measure = document.createElement('div');
    measure.className = 'biography__columns biography__measure';
    measure.setAttribute('aria-hidden', 'true');
    measure.style.lineHeight = ratio;
    const sample = biographyColumn([{ paragraph: 0, words: ['Des'], continues: false }]);
    measure.append(sample);
    biography.append(measure);
    const candidates = [];

    // Word widths make this search inexpensive; final candidates are checked
    // against the browser's actual paragraph layout before being displayed.
    for (let step = -25; step <= 25; step++) {
      const size = Math.round((baseSize + step / 10) * 10) / 10;
      if (size < 14) continue;
      measure.style.fontSize = `${size}px`;
      const leading = sample.getBoundingClientRect().height;
      const normal = `400 ${size}px ${css.fontFamily}`;
      biographyCanvas.font = normal;
      const space = biographyCanvas.measureText(' ').width;
      const widths = biographyFlatWords.map(word => {
        biographyCanvas.font = word.includes('aleas') ? `italic ${normal}` : normal;
        return biographyCanvas.measureText(word).width;
      });
      const cache = new Map();
      function height(start, end) {
        const key = `${start}:${end}`;
        if (cache.has(key)) return cache.get(key);
        let offset = 0, lines = 0, paragraphs = 0, lastWidth = 0;
        for (const words of biographyWords) {
          const lo = Math.max(start, offset), hi = Math.min(end, offset + words.length);
          offset += words.length;
          if (lo >= hi) continue;
          paragraphs++;
          let line = 0;
          for (let i = lo; i < hi; i++) {
            if (line && line + space + widths[i] > width) { lines++; line = widths[i]; }
            else line = line ? line + space + widths[i] : widths[i];
          }
          lines++; lastWidth = line;
        }
        const value = { height: lines * leading + (paragraphs - 1) * 8, lastWidth };
        cache.set(key, value);
        return value;
      }
      const last = biographyFlatWords.length;
      for (let split = biographyEnds[0]; split < biographyEnds[2]; split++) {
        const breaks = count === 3 ? [0, split, biographyEnds[2], last] : [0, split, last];
        if (count === 3 && split >= biographyEnds[1]) continue;
        const blocks = breaks.slice(0, -1).map((start, i) => height(start, breaks[i + 1]));
        const target = blocks.slice(1).reduce((sum, b) => sum + b.height, 0) / (count - 1);
        const margin = target - blocks[0].height - titleHeight;
        const spread = Math.max(...blocks.slice(1).map(b => b.height)) - Math.min(...blocks.slice(1).map(b => b.height));
        const outside = Math.max(0, -margin, margin - Math.max(24, size * 1.4));
        const cost = spread * 10 + outside * 10 + Math.abs(size - baseSize) * 8
          + Math.abs(margin - size / 2) * .1 + (1 - blocks[0].lastWidth / width);
        candidates.push({ size, breaks, cost });
      }
    }
    candidates.sort((a, b) => a.cost - b.cost);
    for (const candidate of candidates) {
      measure.style.fontSize = `${candidate.size}px`;
      measure.replaceChildren(...candidate.breaks.slice(0, -1).map((start, i) =>
        biographyColumn(biographyFragments(start, candidate.breaks[i + 1]))));
      const heights = [...measure.children].map(c => c.firstElementChild.getBoundingClientRect().height);
      const spread = Math.max(...heights.slice(1)) - Math.min(...heights.slice(1));
      const margin = heights[1] - heights[0] - titleHeight;
      if (spread > .1 || margin < 0 || margin > Math.max(24, candidate.size * 1.4)) continue;
      biography.style.fontSize = `${candidate.size}px`;
      biographyTitle.style.marginBottom = `${margin}px`;
      measure.firstElementChild.prepend(biographyTitle);
      measure.classList.remove('biography__measure');
      measure.removeAttribute('aria-hidden');
      measure.style.removeProperty('font-size');
      measure.style.removeProperty('line-height');
      biographySource.hidden = true;
      biography.classList.add('biography__copy--balanced');
      return;
    }
    measure.remove(); // Natural columns remain readable if an unusual size cannot fit.
  }
  let biographyResize;
  window.addEventListener('resize', () => {
    clearTimeout(biographyResize);
    biographyResize = setTimeout(layoutBiography, 120);
  }, { passive: true });
  document.fonts.ready.then(layoutBiography);

  const eventFilters = [...document.querySelectorAll('[data-event-filter]')];
  const events = [...document.querySelectorAll('.event[data-date]')];
  const dateFormatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Europe/Amsterdam'
  });
  function todayISO() {
    const parts = dateFormatter.formatToParts(new Date());
    return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type).value).join('-');
  }
  // Fade the scrolling list's edges only where more dates remain out of view.
  const eventsList = document.querySelector('.events-list');
  function updateEventsFade() {
    const remaining = eventsList.scrollHeight - eventsList.clientHeight - eventsList.scrollTop;
    eventsList.classList.toggle('fade-top', eventsList.scrollTop > 4);
    eventsList.classList.toggle('fade-bottom', remaining > 4);
  }
  eventsList.addEventListener('scroll', updateEventsFade, { passive: true });
  window.addEventListener('resize', updateEventsFade, { passive: true });
  function filterEvents(category) {
    const today = todayISO();
    let visibleCount = 0;
    const sorted = [...events].sort((a, b) => category === 'upcoming'
      ? a.dataset.date.localeCompare(b.dataset.date)
      : b.dataset.date.localeCompare(a.dataset.date));
    // CSS order keeps each date inside its year group: upcoming runs forward, the archive backward.
    sorted.forEach((event, index) => {
      const isFuture = event.dataset.date.length === 10
        ? event.dataset.date >= today
        : event.dataset.date >= today.slice(0, event.dataset.date.length);
      event.hidden = (category === 'upcoming') !== isFuture;
      event.style.order = index;
      if (!event.hidden) visibleCount++;
    });
    const years = [...document.querySelectorAll('.events-year')].sort((a, b) => category === 'upcoming'
      ? a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent)
      : b.querySelector('h3').textContent.localeCompare(a.querySelector('h3').textContent));
    years.forEach((year, index) => {
      year.hidden = !year.querySelector('.event:not([hidden])');
      year.style.order = index;
    });
    eventsList.scrollTop = 0;
    updateEventsFade();
    document.querySelector('.events-empty').hidden = visibleCount !== 0;
    for (const filter of eventFilters) {
      const active = filter.dataset.eventFilter === category;
      filter.classList.toggle('is-active', active);
      filter.setAttribute('aria-pressed', String(active));
    }
    scheduleSectionUpdate();
  }
  for (const filter of eventFilters) {
    filter.addEventListener('click', () => filterEvents(filter.dataset.eventFilter));
  }
  filterEvents(events.some(event => event.dataset.date.length === 10 && event.dataset.date >= todayISO()) ? 'upcoming' : 'past');

  const copyButton = document.querySelector('[data-copy]');
  const copyStatus = document.querySelector('.contact__copy-status');
  let copyTimer;
  if (copyButton && navigator.clipboard && window.isSecureContext) {
    copyButton.hidden = false;
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(copyButton.dataset.copy);
        copyStatus.textContent = 'Copied';
      } catch {
        // Some embedded browsers block the Clipboard API: select the address instead.
        const range = document.createRange();
        range.selectNodeContents(document.querySelector('.contact__address'));
        getSelection().removeAllRanges();
        getSelection().addRange(range);
        copyStatus.textContent = document.execCommand('copy') ? 'Copied' : 'Address selected';
      }
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => { copyStatus.textContent = ''; }, 2500);
    });
  }

  const galleryImages = JSON.parse(document.querySelector('#gallery-data').textContent);
  const photoDialog = document.querySelector('#photo-dialog');
  const videoDialog = document.querySelector('#video-dialog');
  let imageIndex = 0;
  function displayImage(index) {
    imageIndex = (index + galleryImages.length) % galleryImages.length;
    const selected = galleryImages[imageIndex];
    const image = document.querySelector('#photo-full');
    image.src = selected.src;
    image.alt = selected.alt;
    document.querySelector('#photo-caption').textContent = selected.caption;
    document.querySelector('#photo-counter').textContent = `${imageIndex + 1} / ${galleryImages.length}`;
  }
  function openGallery(dialog, trigger) {
    const origin = trigger.getBoundingClientRect();
    document.body.classList.add('dialog-open');
    dialog.showModal();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = dialog.getBoundingClientRect();
    dialog.style.transformOrigin = `${origin.left + origin.width / 2 - bounds.left}px ${origin.top + origin.height / 2 - bounds.top}px`;
    dialog.animate([
      { opacity: 0, transform: 'scale(.08)', borderRadius: '24px' },
      { opacity: 1, transform: 'scale(1)', borderRadius: '0' }
    ], { duration: 440, easing: 'cubic-bezier(.22, 1, .36, 1)' });
  }
  for (const button of document.querySelectorAll('[data-gallery-open]')) {
    button.addEventListener('click', () => {
      if (button.dataset.galleryOpen === 'photos') {
        displayImage(0);
        openGallery(photoDialog, button);
      } else openGallery(videoDialog, button);
    });
  }
  document.querySelector('#photo-previous').addEventListener('click', () => displayImage(imageIndex - 1));
  document.querySelector('#photo-next').addEventListener('click', () => displayImage(imageIndex + 1));
  photoDialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      displayImage(imageIndex + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });

  const playerDialog = document.querySelector('#player-dialog');
  for (const button of document.querySelectorAll('[data-album]')) {
    button.addEventListener('click', () => {
      const albumID = button.dataset.album;
      const iframe = document.createElement('iframe');
      iframe.src = `https://bandcamp.com/EmbeddedPlayer/album=${albumID}/size=large/bgcol=191b16/linkcol=f8f4e9/tracklist=true/artwork=small/transparent=true/`;
      iframe.title = `Listen to ${button.dataset.albumTitle} on Bandcamp`;
      iframe.allow = 'autoplay';
      document.querySelector('#player-title').textContent = button.dataset.albumTitle;
      document.querySelector('#player-slot').replaceChildren(iframe);
      document.querySelector('#player-fallback').href = `https://desvisages.bandcamp.com/album/${albumID === '2317617485' ? 'aleas' : 'des-visages'}`;
      playerDialog.showModal();
      document.body.classList.add('dialog-open');
    });
  }
  // aleas videos play in a dialog; the YouTube player loads only when requested.
  const youtubeDialog = document.querySelector('#youtube-dialog');
  for (const card of document.querySelectorAll('[data-youtube]')) {
    card.addEventListener('click', event => {
      event.preventDefault();
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${card.dataset.youtube}?autoplay=1&rel=0`;
      iframe.title = `${card.dataset.videoTitle} — Des Visages on YouTube`;
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      document.querySelector('#youtube-title').textContent = card.dataset.videoTitle;
      document.querySelector('#youtube-slot').replaceChildren(iframe);
      document.querySelector('#youtube-fallback').href = card.href;
      youtubeDialog.showModal();
      document.body.classList.add('dialog-open');
    });
  }
  for (const dialog of document.querySelectorAll('dialog')) {
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('dialog-open');
      if (dialog === photoDialog || dialog === videoDialog) {
        for (const animation of dialog.getAnimations()) animation.cancel();
      }
      if (dialog === playerDialog) document.querySelector('#player-slot').replaceChildren();
      if (dialog === youtubeDialog) document.querySelector('#youtube-slot').replaceChildren();
      if (dialog === videoDialog) {
        const video = videoDialog.querySelector('video');
        video.pause();
        if (video.readyState > 0) video.currentTime = 0;
      }
    });
  }
})();
