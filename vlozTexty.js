let jazyk = localStorage.getItem("jazyk") || "sk";

function vlozTexty(callback) {
  fetch("texty/texty.json")
    .then(response => response.json())
    .then(data => {
      const texty = data[jazyk];

      // Nastavenie textov podľa preklad-data-text
      document.querySelectorAll("[preklad-data-text]").forEach(el => {
        const kluc = el.getAttribute("preklad-data-text");
        if (texty[kluc]) {
          el.innerHTML = texty[kluc];

          if (el.hasAttribute("overlay-data-text")) {
            el.setAttribute("overlay-data-text", texty[kluc]);
          }

          if (el.tagName.toLowerCase() === 'header') {
            el.setAttribute("header-data-text", texty[kluc]);
          }
        }
      });

      // 🔥 NOVINKA: Nastavenie placeholderov
      document.querySelectorAll("[preklad-placeholder]").forEach(el => {
        const kluc = el.getAttribute("preklad-placeholder");
        if (texty[kluc]) {
          el.setAttribute("placeholder", texty[kluc]);
        }
      });

      if (typeof callback === "function") {
        callback();
      }
    })
    .catch(error => console.error("Chyba pri načítaní textov:", error));
}

function nastavJazyk(novyJazyk) {
  jazyk = novyJazyk;
  localStorage.setItem("jazyk", jazyk);
  vlozTexty();
}

document.addEventListener("DOMContentLoaded", () => {

  // Sem sa môžu vložiť funkcie zo skriptov, ktoré by mali byť spustené po načítaní textu
  vlozTexty(() => {
    spustiAnimaciuTextu();
    spracujOdsadeniePoBR();
  });

  // jazykové tlačidlá
  document.querySelectorAll("[data-lang-switch]").forEach(button => {
    button.addEventListener("click", () => {
      const jazyk = button.getAttribute("data-lang-switch");
      nastavJazyk(jazyk);
    });
  });
});

