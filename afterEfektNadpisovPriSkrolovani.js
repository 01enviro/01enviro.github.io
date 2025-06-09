// Nájde všetky <header> prvky
const headers = document.querySelectorAll('header');

headers.forEach(header => {
  // Nastaví data-text podľa textového obsahu
  header.setAttribute('header-data-text', header.textContent);

  // Sleduje pozíciu pri scrollovaní
  function updateAfterEffect() {
    const rect = header.getBoundingClientRect();
    const center = window.innerHeight / 2;
    const distance = Math.abs(rect.top + rect.height / 2 - center);
    const maxDistance = 400;
    const ratio = Math.min(distance / maxDistance, 1);

    const scale = 2.5 - 1.5 * (1 - ratio);
    const opacity = 0.15 + 0.25 * (1 - ratio);

    header.style.setProperty('--after-scale', scale);
    header.style.setProperty('--after-opacity', opacity);
  }

  // Inicializuj a nastav listener
  window.addEventListener('scroll', updateAfterEffect);
  window.addEventListener('resize', updateAfterEffect);
  updateAfterEffect();
});
