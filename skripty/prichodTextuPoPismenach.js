  /* - funkčné samostatne, nie ako funkcia
  document.addEventListener("DOMContentLoaded", function () {
    const triedy = [".normalny-text-bledy"/*, ".normalny-text"];

    triedy.forEach(trieda => {
      const prvky = document.querySelectorAll(trieda);

      prvky.forEach(el => {
        const nodes = Array.from(el.childNodes);
        el.innerHTML = "";

        let slovoIndex = 0;

        nodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            const slova = node.textContent.split(/(\s+)/); // zachová medzery ako samostatné položky
            slova.forEach((cast) => {
              if (cast.trim() === "") {
                el.appendChild(document.createTextNode(cast)); // medzera
              } else {
                const span = document.createElement("span");
                span.textContent = cast;
                span.style.display = "inline-block";
                span.style.transform = "translateX(300px)";
                span.style.opacity = "0";
                span.style.animation = `fadeInRight 0.3s forwards`;
                span.style.animationDelay = `${slovoIndex * 0.08}s`;
                el.appendChild(span);
                slovoIndex++;
              }
            });
          } else if (node.nodeName === "BR") {
            el.appendChild(document.createElement("br")); // zachová <br>
          }
        });
      });
    });
  });*/

  // funkcia napojená na skript vlozTexty.js - predtým sa dialo to že sa spustila animácia a nebolo čo animovať, pretože neboli načítané texty
  function spustiAnimaciuTextu() {
  const triedy = [".normalny-text-bledy"/*, ".normalny-text"*/];

  triedy.forEach(trieda => {
    const prvky = document.querySelectorAll(trieda);

    prvky.forEach(el => {
      const nodes = Array.from(el.childNodes);
      el.innerHTML = "";

      let slovoIndex = 0;

      nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const slova = node.textContent.split(/(\s+)/); // zachová medzery
          slova.forEach((cast) => {
            if (cast.trim() === "") {
              el.appendChild(document.createTextNode(cast));
            } else {
              const span = document.createElement("span");
              span.textContent = cast;
              span.style.display = "inline-block";
              span.style.transform = "translateX(300px)";
              span.style.opacity = "0";
              span.style.animation = `fadeInRight 0.3s forwards`;
              span.style.animationDelay = `${slovoIndex * 0.08}s`;
              el.appendChild(span);
              slovoIndex++;
            }
          });
        } else if (node.nodeName === "BR") {
          el.appendChild(document.createElement("br"));
        }
      });
    });
  });
}
