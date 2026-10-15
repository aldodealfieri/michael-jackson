/* ===== Barra di navigazione che cambia allo scroll ===== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ===== Scintille dorate nell'hero ===== */
(function sparkles() {
  const canvas = document.getElementById('sparkles');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    const count = Math.min(120, Math.floor((w * h) / 12000));
    particles = Array.from({ length: count }, () => makeParticle(true));
  }

  function makeParticle(randomY) {
    return {
      x: Math.random() * w,
      y: randomY ? Math.random() * h : h + 10,
      r: Math.random() * 2 + 0.5,
      vy: Math.random() * 0.4 + 0.1,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.03 + 0.01
    };
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.phase += p.speed;
      p.y -= p.vy;
      const alpha = (Math.sin(p.phase) + 1) / 2;
      ctx.beginPath();
      ctx.fillStyle = `rgba(243, 217, 122, ${alpha})`;
      ctx.shadowColor = '#d4af37';
      ctx.shadowBlur = 8;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      if (p.y < -10) Object.assign(p, makeParticle(false));
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

/* ===== Apparizione degli elementi allo scroll ===== */
const revealTargets = document.querySelectorAll('.event, .card, .stat, .quiz, .floor');
revealTargets.forEach(el => el.classList.add('reveal'));
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => revealObserver.observe(el));

/* ===== Card che si girano anche al tocco ===== */
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flip'));
});

/* ===== Contatori animati ===== */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.target;
    const duration = 1600;
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('.num').forEach(el => counterObserver.observe(el));

/* ===== Pista da ballo interattiva ===== */
(function floor() {
  const floorEl = document.getElementById('floor');
  const cols = window.matchMedia('(max-width:640px)').matches ? 8 : 12;
  const rows = cols === 8 ? 6 : 7;
  const colors = ['#d4af37', '#f3d97a', '#ffffff', '#ff4d6d', '#4dd0ff', '#9b5de5'];

  for (let i = 0; i < cols * rows; i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    floorEl.appendChild(tile);
  }

  function light(tile) {
    if (!tile || !tile.classList.contains('tile')) return;
    tile.style.setProperty('--col', colors[Math.floor(Math.random() * colors.length)]);
    tile.classList.add('on');
    // Forza il reflow così la transizione di spegnimento riparte
    void tile.offsetWidth;
    setTimeout(() => tile.classList.remove('on'), 80);
  }

  floorEl.addEventListener('pointermove', (e) => {
    light(document.elementFromPoint(e.clientX, e.clientY));
  });
})();

/* ===== Quiz ===== */
(function quiz() {
  const questions = [
    { q: 'In che anno nasce Michael Jackson?', a: ['1956', '1958', '1960', '1962'], c: 1 },
    { q: 'Con quale gruppo di famiglia inizia la carriera?', a: ['Jackson 5', 'Osmonds', 'Bee Gees', 'Temptations'], c: 0 },
    { q: 'Quale album è uscito nel 1982?', a: ['Bad', 'Dangerous', 'Thriller', 'Invincible'], c: 2 },
    { q: 'Come si chiama il suo celebre passo di danza all\'indietro?', a: ['Robot', 'Moonwalk', 'Twist', 'Floss'], c: 1 },
    { q: 'Quale brano benefico ha co-scritto con Lionel Richie?', a: ['Heal the World', 'Earth Song', 'We Are the World', 'Man in the Mirror'], c: 2 }
  ];

  let index = 0, score = 0;
  const countEl = document.getElementById('q-count');
  const textEl = document.getElementById('q-text');
  const answersEl = document.getElementById('answers');
  const feedbackEl = document.getElementById('feedback');
  const nextBtn = document.getElementById('next');

  function show() {
    const item = questions[index];
    countEl.textContent = `Domanda ${index + 1} di ${questions.length}`;
    textEl.textContent = item.q;
    feedbackEl.textContent = '';
    nextBtn.hidden = true;
    answersEl.innerHTML = '';
    item.a.forEach((label, i) => {
      const b = document.createElement('button');
      b.textContent = label;
      b.addEventListener('click', () => answer(i, b));
      answersEl.appendChild(b);
    });
  }

  function answer(i, button) {
    const item = questions[index];
    const buttons = answersEl.querySelectorAll('button');
    buttons.forEach(b => (b.disabled = true));
    buttons[item.c].classList.add('right');
    if (i === item.c) {
      score++;
      feedbackEl.textContent = 'Esatto! ✦';
    } else {
      button.classList.add('wrong');
      feedbackEl.textContent = 'Non proprio, ma ci sei quasi.';
    }
    nextBtn.textContent = index === questions.length - 1 ? 'Vedi il risultato' : 'Avanti';
    nextBtn.hidden = false;
  }

  function finish() {
    countEl.textContent = 'Risultato';
    textEl.textContent = `Hai totalizzato ${score} su ${questions.length}`;
    const msg = score === questions.length ? 'Sei un vero fan! 👑'
      : score >= 3 ? 'Ottima conoscenza, ancora un po\' e sei un esperto!'
      : 'Ti resta tanta bella musica da scoprire.';
    answersEl.innerHTML = '';
    feedbackEl.textContent = msg;
    nextBtn.textContent = 'Riprova';
    nextBtn.hidden = false;
    nextBtn.onclick = () => { index = 0; score = 0; nextBtn.onclick = handleNext; show(); };
  }

  function handleNext() {
    index++;
    if (index < questions.length) show(); else finish();
  }

  nextBtn.onclick = handleNext;
  show();
})();
