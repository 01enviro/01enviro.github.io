const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');

let width = canvas.width = document.documentElement.clientWidth; // pozor aby nepretekali iné prvky v css cez okraj napr. animovaný text - rozširujú canvas
let height = canvas.height = getFullDocumentHeight();

function getFullDocumentHeight() {
  return Math.max(
    document.body.scrollHeight,
    /*document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight*/
  );
}

const LAYERS = [
  { count: 50, size: 4, speed: 0.07 },
  { count: 50, size: 7, speed: 0.05 },
  { count: 50, size: 10, speed: 0.03 },
  { count: 50,  size: 15, speed: 0.02 },
  { count: 50,  size: 25, speed: 0.01 }
];

const allParticles = [];
const MOUSE_INFLUENCE_RADIUS = 300;
let mouseX = null;
let mouseY = null;

class Particle {
  constructor(x, y, size, speed, isText = false, char = '') {
    this.x = x;
    this.y = y;
    this.tx = x;
    this.ty = y;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = size;
    this.speed = speed;
    this.color = getRandomColor();
    this.opacity = 1;
    this.fadeInProgress = false;
    this.wanderStrength = 0.1;

    this.isText = isText;
    this.char = char;

    // Všetky textové častice majú rotáciu
    this.rotation = isText ? Math.random() * Math.PI * 2 : 0;
  }

  update() {
    // Wander pohyb
    this.vx += (Math.random() - 0.5) * this.wanderStrength;
    this.vy += (Math.random() - 0.5) * this.wanderStrength;

    this.vx *= 0.99;
    this.vy *= 0.99;

    this.tx += this.vx;
    this.ty += this.vy;

    this.x += (this.tx - this.x) * this.speed;
    this.y += (this.ty - this.y) * this.speed;

    // Fade-in efekt
    if (this.fadeInProgress) {
      this.opacity += 0.02;
      if (this.opacity >= 1) {
        this.opacity = 1;
        this.fadeInProgress = false;
      }
    }

    // Reakcia na kurzor
    if (mouseX !== null && mouseY !== null) {
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < MOUSE_INFLUENCE_RADIUS * MOUSE_INFLUENCE_RADIUS) {
        const dist = Math.sqrt(distSq);
        const force = (1 - dist / MOUSE_INFLUENCE_RADIUS) * 0.6;
        this.x += dx * force * 0.08;
        this.y += dy * force * 0.08;
      }
    }

    // Respawn mimo obrazovku
    if (this.x < -50 || this.x > width + 50 || this.y < -50 || this.y > height + 50) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.tx = this.x;
      this.ty = this.y;
      this.opacity = 0;
      this.fadeInProgress = true;
    }


  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;

    if (this.isText && this.char) {
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
      ctx.font = `${this.size * 2}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.char, 0, 0);
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
      ctx.fill();
    }

    ctx.restore();

  }


}

/*function getRandomColor() {
  return {
    r: Math.floor(Math.random() * 200 + 50),
    g: Math.floor(Math.random() * 200 + 50),
    b: Math.floor(Math.random() * 200 + 50)
  };
}*/

/* Len biele, sivé a čierne*/
function getRandomColor() {
  const gray = Math.floor(Math.random() * 256); // 0 - čierna, 255 - biela
  return { r: gray, g: gray, b: gray };
}

function createParticles() {
  allParticles.length = 0;
  for (const layer of LAYERS) {
    for (let i = 0; i < layer.count; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;

      const isText = Math.random() < 0.5; // koľko percent textových častíc
      const char = isText ? (Math.random() < 0.5 ? "0" : "1") : null;

      const p = new Particle(x, y, layer.size, layer.speed, isText, char);

      allParticles.push(p);
    }
  }
}

function scatterPattern() {
  return allParticles.map(() => ({
    x: Math.random() * width,
    y: Math.random() * height
  }));
}

function setTargetPositions(pattern) {
  for (let i = 0; i < allParticles.length; i++) {
    const target = pattern[i % pattern.length];
    allParticles[i].tx = target.x;
    allParticles[i].ty = target.y;
  }
}

function handleClick() {
  setTargetPositions(scatterPattern());
}

function animate() {
  ctx.fillStyle = '#ddd5b0';
  ctx.fillRect(0, 0, width, height);

  for (const p of allParticles) {
    p.update();
    p.draw();
  }

  // Čierne pruhy hore a dole
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, 5); // vrchný
  ctx.fillRect(0, height - 5, width, 5); // spodný*/

  requestAnimationFrame(animate);
}

canvas.addEventListener('click', handleClick);
canvas.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY + window.scrollY;
});
canvas.addEventListener('mouseleave', () => {
  mouseX = null;
  mouseY = null;
});

function resizeCanvasAndParticles() {
  width = canvas.width = document.documentElement.clientWidth;
  height = canvas.height = getFullDocumentHeight();

  canvas.width = width;
  canvas.height = height;

  // Aj CSS rozmer nastav:
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  setTargetPositions(scatterPattern());
}

// Bindni na resize a load
window.addEventListener('resize', resizeCanvasAndParticles);
window.addEventListener('load', () => {
  requestAnimationFrame(() => {
    setTimeout(() => {
      getFullDocumentHeight();
      resizeCanvasAndParticles();
    }, 0); // 1–2 framy oneskorenia pre extra istotu
  });
});

const observer = new ResizeObserver(() => {
  getFullDocumentHeight();
  resizeCanvasAndParticles();
});
observer.observe(document.body);


createParticles();
setTargetPositions(scatterPattern());
animate();
