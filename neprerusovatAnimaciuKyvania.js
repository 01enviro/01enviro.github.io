  document.querySelectorAll('.dlazdica-s-logom-a-textom').forEach(dlazdica => {
    dlazdica.addEventListener('mouseenter', () => {
      dlazdica.classList.add('kyvnutie');

      // Po skončení animácie triedu odstránime
      dlazdica.addEventListener('animationend', () => {
        dlazdica.classList.remove('kyvnutie');
      }, { once: true }); // zabezpečí, že handler sa spustí iba raz
    });
  });