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
  for (const button of document.querySelectorAll('[data-gallery-open]')) {
    button.addEventListener('click', () => {
      if (button.dataset.galleryOpen === 'photos') {
        displayImage(0);
        photoDialog.showModal();
      } else {
        videoDialog.showModal();
      }
      document.body.classList.add('dialog-open');
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
