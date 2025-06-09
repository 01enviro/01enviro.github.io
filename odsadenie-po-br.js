// Len pre niektoré štýly
/*
function spracujOdsadeniePoBR() {
  const triedy = [".normalny-text", ".normalny-text-bledy", ".normalny-text-vlavo", ".popis-v-dlazdici"];

  triedy.forEach(trieda => {
    const prvky = document.querySelectorAll(trieda);

    prvky.forEach(el => {
      const nodes = Array.from(el.childNodes);
      const nahradene = [];

      nodes.forEach(node => {
        if (node.nodeName === "BR") {
          const br = document.createElement("br");
          const spacer = document.createElement("span");
          spacer.className = "odsadenie-po-br";
          nahradene.push(br, spacer);
        } else {
          nahradene.push(node);
        }
      });

      el.innerHTML = "";
      nahradene.forEach(n => el.appendChild(n));
    });
  });
}
*/

// Pre celý dokument
function spracujOdsadeniePoBR() {
  const vsetkyBR = document.querySelectorAll("br");
   vsetkyBR.forEach(br => {
    const spacer = document.createElement("span");
    spacer.className = "odsadenie-po-br";
    br.parentNode.insertBefore(spacer, br.nextSibling);
  });

  //setTimeout(initParticlesBackground, 2000); // 2000 milisekúnd = 2 sekundy

}

