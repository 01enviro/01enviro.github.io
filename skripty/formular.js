const openFormButton = document.getElementById('open-form-button');
const formContainer = document.getElementById('form-container');
const contactForm = document.getElementById('contact-form');

// 1. Po kliknutí na tlačidlo "Mám záujem" sa formulár rozbalí
openFormButton.addEventListener('click', function () {
  formContainer.classList.add('show');
  this.style.display = 'none';
});

// 2. Po ukončení animácie rozbalenia (transitionend) sa spustí resize funkcia skriptu backgroundScript.js
formContainer.addEventListener('transitionend', function handler(e) {
  if (e.propertyName === 'opacity' && formContainer.classList.contains('show')) {
    if (typeof window.resizeCanvasAndParticles === 'function') {
      window.resizeCanvasAndParticles();
    }
    formContainer.removeEventListener('transitionend', handler); // spustí sa iba raz
  }
});

// 3. Validácia e-mailu a odoslanie formulára
contactForm.addEventListener('submit', function (e) {
  // ➕ Pridaj skryté pole s titulkom stránky
  let pageTitle = document.title;
  let pageInfoInput = document.createElement('input');
  pageInfoInput.type = 'hidden';
  pageInfoInput.name = 'page_title';
  pageInfoInput.value = pageTitle;
  contactForm.appendChild(pageInfoInput);

  const emailInput = this.querySelector('input[name="email"]');
  const email = emailInput.value.trim();
  const emailRegex = /^[^@\s]+@[^@\s]+\.[a-z]{2,4}$/i;

  if (!emailRegex.test(email)) {
    e.preventDefault();
    alert("Zadajte platnú e-mailovú adresu s podporovanou doménou (napr. .sk, .eu, .com, ...)");
    emailInput.focus();
    return;
  }

  e.preventDefault();

  // 💡 Nový bezpečný formData (bez File príloh)
  const allowedFields = ['email', 'message', 'page_title'];
  const originalFormData = new FormData(this);
  const formData = new FormData();

  // 🥇 Najprv pridaj page_title ako prvé
  formData.append('page_title', document.title);

  // Potom pridaj ostatné polia v poradí
  for (let [key, value] of originalFormData.entries()) {
    if (allowedFields.includes(key) && key !== 'page_title' && !(value instanceof File)) {
      formData.append(key, value);
    }
  }

  // ⏳ Zobraz animáciu odosielania
  const loader = document.getElementById('form-loader');
  loader.style.display = 'block';
  contactForm.style.opacity = '0.5';
  contactForm.querySelector('button[type="submit"]').disabled = true;

  fetch(this.action, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => {
    loader.style.display = 'none';

    if (response.ok) {
      contactForm.style.display = 'none';
      document.getElementById('success-check').style.display = 'flex';
    } else {
      alert('Nastala chyba pri odosielaní. Skúste znova.');
      contactForm.style.opacity = '1';
      contactForm.querySelector('button[type="submit"]').disabled = false;
    }
  });
});

