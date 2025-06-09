document.addEventListener("DOMContentLoaded", function() {
  const menuHtml = `
    <a href="podkladove-modely.html" class="menu-item" preklad-data-text="podkladoveModely"></a>
    <a href="mestsky-tepelny-ostrov.html" class="menu-item" preklad-data-text="tepelnyOstrov"></a>
    <a href="noise-solver.html" class="menu-item" preklad-data-text="noiseSolver"></a>
    <a href="programovanie.html" class="menu-item" preklad-data-text="programovanie"></a>
    <a href="klimaticka-zmena.html" class="menu-item" preklad-data-text="klimatickaZmena"></a>
    <a href="tvorba-webstranok.html" class="menu-item" preklad-data-text="tvorbaWebstranok"></a>
    <a href="export-map.html" class="menu-item" preklad-data-text="exportMap"></a>
    <a href="mapa-projektov.html" class="menu-item" preklad-data-text="mapa"></a>
  `;

  const menuPanels = document.querySelectorAll('.menu-panel');
  menuPanels.forEach(panel => {
    panel.innerHTML = menuHtml;
  });
});