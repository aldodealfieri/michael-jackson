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
const revealTargets = document.querySelectorAll('.event, .card, .stat, .quiz, .floor, .panel, .h-item, .curio, .acc details');
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
  // su PC le card si girano al passaggio del mouse; il click serve solo su touch
  card.addEventListener('click', () => {
    if (window.matchMedia('(hover:none)').matches) card.classList.toggle('flip');
  });
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
  if (!floorEl) return; // la pista è stata rimossa dal sito
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

/* ===== Dischi in vinile sulle card ===== */
document.querySelectorAll('.card-front').forEach(front => {
  front.insertAdjacentHTML('afterbegin', '<div class="disc" aria-hidden="true"></div>');
});

/* ===== Curiosità: tessere che si aprono ===== */
document.querySelectorAll('.curio').forEach(btn => {
  btn.addEventListener('click', () => btn.classList.toggle('open'));
});

/* ===== Barra di avanzamento e pulsante "torna su" ===== */
const progress = document.getElementById('progress');
const toTop = document.getElementById('totop');
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  toTop.classList.toggle('show', window.scrollY > 600);
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== Riflettore che segue il mouse nell'hero ===== */
const hero = document.getElementById('home');
hero.addEventListener('pointermove', (e) => {
  const r = hero.getBoundingClientRect();
  hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
});

/* ===== Scia di scintille dorate che segue il cursore (solo mouse) ===== */
(function trail() {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  let last = 0;
  document.addEventListener('pointermove', (e) => {
    const now = performance.now();
    if (now - last < 45) return;
    last = now;
    const s = document.createElement('span');
    s.className = 'spark';
    s.style.left = e.clientX + 'px';
    s.style.top = e.clientY + 'px';
    s.style.setProperty('--dx', (Math.random() * 40 - 20) + 'px');
    s.style.setProperty('--dy', (Math.random() * 40 + 10) + 'px');
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 800);
  });
})();

/* ===== Schede approfondite degli album ===== */
const ALBUMS = {
  'Off the Wall': {
    slug: 'off-the-wall', year: 1979, prod: 'Quincy Jones',
    story: 'Michael conosce Quincy Jones sul set di The Wiz e gli chiede di produrre il suo disco da solista adulto. Ne esce un suono luminoso, tra disco, funk, soul e pop, che lo trasforma in una star indipendente dal gruppo di famiglia.',
    themes: 'Libertà, voglia di ballare e vita notturna, ma anche malinconia: "She\'s Out of My Life" è una ballata sul dolore di una perdita.',
    singles: ['Don\'t Stop \'Til You Get Enough', 'Rock with You', 'Off the Wall', 'She\'s Out of My Life'],
    credits: 'Rod Temperton firma "Rock with You" e la title track; Paul McCartney scrive "Girlfriend"; Stevie Wonder "I Can\'t Help It".',
    reception: 'Grande successo di pubblico e critica: quattro singoli nella top 10 americana e un Grammy per "Don\'t Stop \'Til You Get Enough". Si racconta che il mancato riconoscimento nelle categorie principali lo abbia spinto a puntare ancora più in alto.'
  },
  'Thriller': {
    slug: 'thriller', year: 1982, prod: 'Quincy Jones',
    story: 'Registrato a Los Angeles con una cura maniacale, mescola pop, rock, funk e R&B. Ogni brano è pensato per essere un singolo potenziale e per parlare a pubblici diversi, comprese le radio rock.',
    themes: 'La paranoia della fama e le accuse infondate (Billie Jean), il rifiuto della violenza (Beat It), l\'amore (Human Nature) e il gioco horror della title track.',
    singles: ['Wanna Be Startin\' Somethin\'', 'The Girl Is Mine (con Paul McCartney)', 'Billie Jean', 'Beat It', 'Human Nature', 'P.Y.T.', 'Thriller'],
    credits: 'Eddie Van Halen all\'assolo di "Beat It"; Rod Temperton firma "Thriller", con la voce recitata di Vincent Price.',
    reception: 'È spesso indicato come l\'album più venduto di sempre, con stime oltre i 70 milioni di copie. Fruttò sette singoli nella top 10 americana e otto Grammy in una sola serata, nel 1984.'
  },
  'Bad': {
    slug: 'bad', year: 1987, prod: 'Quincy Jones (ultima collaborazione insieme)',
    story: 'Seguito attesissimo di Thriller, scritto in gran parte da Michael stesso. Il disco mostra un artista più sicuro e più rock, con un look nuovo e un\'immagine più dura.',
    themes: 'Determinazione, orgoglio, rapporto con la fama e voglia di cambiare sé stessi e il mondo ("Man in the Mirror").',
    singles: ['I Just Can\'t Stop Loving You', 'Bad', 'The Way You Make Me Feel', 'Man in the Mirror', 'Dirty Diana', 'Smooth Criminal', 'Liberian Girl'],
    credits: 'Siedah Garrett duetta nel primo singolo; Stevie Wonder in "Just Good Friends"; il video di "Bad" è un cortometraggio diretto da Martin Scorsese.',
    reception: 'Cinque singoli arrivarono al primo posto della classifica americana, un risultato mai ottenuto prima da un album. Il Bad World Tour (1987-89) fu un enorme successo.'
  },
  'Dangerous': {
    slug: 'dangerous', year: 1991, prod: 'Teddy Riley, Bill Bottrell e Michael Jackson',
    story: 'Il primo album senza Quincy Jones. Jackson si apre al new jack swing di Teddy Riley, ma inserisce anche gospel, rock e momenti cupi.',
    themes: 'Razzismo e unità (Black or White), speranza (Heal the World), amore, ma anche tensione e paranoia in alcuni brani più oscuri.',
    singles: ['Black or White', 'Remember the Time', 'In the Closet', 'Jam', 'Who Is It', 'Heal the World', 'Give In to Me', 'Will You Be There'],
    credits: 'Slash alla chitarra in "Black or White"; Heavy D nel rap di "Jam".',
    reception: 'Grande successo mondiale. Il video di "Black or White" fu trasmesso in contemporanea in moltissimi paesi, con milioni di spettatori davanti alla tv.'
  },
  'HIStory': {
    slug: 'history', year: 1995, prod: 'Michael Jackson con vari produttori',
    story: 'Un doppio album: un disco raccoglie i suoi più grandi successi, l\'altro contiene brani nuovi, nati in un periodo molto difficile della sua vita pubblica.',
    themes: 'Rabbia verso i media, solitudine, ambiente, guerra e ingiustizia sociale.',
    singles: ['Scream (con Janet Jackson)', 'You Are Not Alone', 'Earth Song', 'They Don\'t Care About Us', 'Stranger in Moscow'],
    credits: '"You Are Not Alone" è scritta da R. Kelly; "Scream" è il duetto con la sorella Janet.',
    reception: '"You Are Not Alone" debuttò direttamente al primo posto della classifica americana; "Earth Song" fu numero uno in Gran Bretagna a Natale del 1995.'
  },
  'Invincible': {
    slug: 'invincible', year: 2001, prod: 'Rodney Jerkins, Teddy Riley, R. Kelly e Michael Jackson',
    story: 'Pubblicato il 30 ottobre 2001, a circa sei anni dall\'album precedente di inediti. Il suono unisce R&B moderno, pop e ballate emotive.',
    themes: 'Amore, rinascita, fiducia e voglia di ritrovare il pubblico.',
    singles: ['You Rock My World', 'Cry', 'Butterflies'],
    credits: 'Produzioni di Rodney Jerkins, Teddy Riley e R. Kelly, tra gli altri.',
    reception: 'Successo commerciale importante, con critiche divise. È l\'ultimo album in studio pubblicato mentre era in vita.'
  }
};

/* Prova più formati per le immagini caricate: jpg, png, jpeg, webp */
function coverFallback(img) {
  const exts = ['jpg', 'png', 'jpeg', 'webp'];
  const i = (+img.dataset.i || 0) + 1;
  if (i >= exts.length) { img.remove(); return; }
  img.dataset.i = i;
  img.src = 'img/albums/' + img.dataset.slug + '.' + exts[i];
}

const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
function openAlbum(title) {
  const a = ALBUMS[title];
  if (!a) return;
  modalContent.innerHTML = `
    <div class="m-head">
      <div class="m-cover" style="--c1:${getComputedStyle(document.querySelector('.card[data-t="' + title + '"]')).getPropertyValue('--c1')}">
        <div class="disc"></div>
        <img src="img/albums/${a.slug}.jpg" alt="" data-slug="${a.slug}" onerror="coverFallback(this)">
      </div>
      <div><p class="m-sub">${a.year} · prodotto da ${a.prod}</p><h2>${title}</h2></div>
    </div>
    <div class="m-sec"><h4>La storia</h4><p>${a.story}</p></div>
    <div class="m-sec"><h4>I temi</h4><p>${a.themes}</p></div>
    <div class="m-sec"><h4>Singoli</h4><ul>${a.singles.map(s => '<li>' + s + '</li>').join('')}</ul></div>
    <div class="m-sec"><h4>Crediti e collaborazioni</h4><p>${a.credits}</p></div>
    <div class="m-sec"><h4>Accoglienza</h4><p>${a.reception}</p></div>`;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeModal() { modal.hidden = true; document.body.style.overflow = ''; }
document.querySelectorAll('.card').forEach(card => {
  const title = card.querySelector('h3').textContent.trim();
  card.dataset.t = title;
  if (ALBUMS[title]) {
    const cov = document.createElement('img');
    cov.className = 'cov';
    cov.alt = '';
    cov.dataset.slug = ALBUMS[title].slug;
    cov.onerror = () => coverFallback(cov);
    cov.src = 'img/albums/' + ALBUMS[title].slug + '.jpg';
    card.querySelector('.card-front').appendChild(cov);
  }
  const btn = document.createElement('button');
  btn.textContent = 'Scheda completa';
  btn.addEventListener('click', (e) => { e.stopPropagation(); openAlbum(title); });
  card.querySelector('.card-back').appendChild(btn);
});
document.getElementById('modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

/* ===== Galleria: foto a schermo intero ===== */
(function lightbox() {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.hidden = true;
  lb.innerHTML = '<button class="lb-close" aria-label="Chiudi">×</button>' +
    '<button class="lb-prev" aria-label="Precedente">‹</button>' +
    '<img alt="">' +
    '<button class="lb-next" aria-label="Successiva">›</button>' +
    '<span class="lb-count"></span>';
  document.body.appendChild(lb);
  const big = lb.querySelector('img');
  const count = lb.querySelector('.lb-count');
  let list = [], i = 0;

  function show(n) {
    i = (n + list.length) % list.length;
    big.src = list[i].currentSrc || list[i].src;
    count.textContent = (i + 1) + ' / ' + list.length;
  }
  function open(img) {
    list = [...document.querySelectorAll('.slot img')].filter(x => x.naturalWidth > 0);
    const idx = list.indexOf(img);
    if (idx < 0) return;
    show(idx);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function close() { lb.hidden = true; document.body.style.overflow = ''; }

  document.querySelector('.gallery').addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') open(e.target);
  });
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', (e) => { e.stopPropagation(); show(i - 1); });
  lb.querySelector('.lb-next').addEventListener('click', (e) => { e.stopPropagation(); show(i + 1); });
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
  // swipe su telefono
  let startX = 0;
  lb.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(dx < 0 ? i + 1 : i - 1);
  });
})();

/* ===== Quiz ===== */
(function quiz() {
  const questions = [
    { q: 'In che anno nasce Michael Jackson?', a: ['1956', '1958', '1960', '1962'], c: 1 },
    { q: 'Con quale gruppo di famiglia inizia la carriera?', a: ['Jackson 5', 'Osmonds', 'Bee Gees', 'Temptations'], c: 0 },
    { q: 'Quale album è uscito nel 1982?', a: ['Bad', 'Dangerous', 'Thriller', 'Invincible'], c: 2 },
    { q: 'Come si chiama il suo celebre passo di danza all\'indietro?', a: ['Robot', 'Moonwalk', 'Twist', 'Floss'], c: 1 },
    { q: 'Quale brano benefico ha co-scritto con Lionel Richie?', a: ['Heal the World', 'Earth Song', 'We Are the World', 'Man in the Mirror'], c: 2 },
    { q: 'Quale album contiene "Billie Jean"?', a: ['Off the Wall', 'Thriller', 'Bad', 'Dangerous'], c: 1 },
    { q: 'Quale produttore ha lavorato a Off the Wall, Thriller e Bad?', a: ['Quincy Jones', 'Berry Gordy', 'Teddy Riley', 'Phil Spector'], c: 0 },
    { q: 'In quale città americana è nato Michael Jackson?', a: ['Detroit', 'Gary', 'Chicago', 'Los Angeles'], c: 1 },
    { q: 'Quanti Grammy ha vinto in una sola serata nel 1984?', a: ['3', '5', '8', '10'], c: 2 },
    { q: 'Chi ha suonato l\'assolo di chitarra in "Beat It"?', a: ['Slash', 'Eddie Van Halen', 'Eric Clapton', 'Carlos Santana'], c: 1 },
    { q: 'Quale video di circa 14 minuti fu diretto da John Landis?', a: ['Bad', 'Thriller', 'Scream', 'Earth Song'], c: 1 },
    { q: 'In che anno si esibì al Super Bowl XXVII?', a: ['1983', '1988', '1993', '1999'], c: 2 },
    { q: 'Con chi canta "The Girl Is Mine"?', a: ['Stevie Wonder', 'Paul McCartney', 'Lionel Richie', 'Diana Ross'], c: 1 },
    { q: 'Come si chiama la fondazione benefica che fondò nel 1992?', a: ['Heal the World Foundation', 'Thriller Foundation', 'Neverland Fund', 'Mercy Foundation'], c: 0 },
    { q: 'In quale film interpreta lo Spaventapasseri?', a: ['Moonwalker', 'The Wiz', 'Captain EO', 'Ghosts'], c: 1 },
    { q: 'Quale serie di concerti a Londra non è mai iniziata?', a: ['This Is It', 'Bad Tour', 'HIStory Tour', 'Invincible Live'], c: 0 },
    { q: 'Qual è l\'ultimo album in studio uscito mentre era in vita?', a: ['HIStory', 'Dangerous', 'Invincible', 'Bad'], c: 2 }
  ];

  // domande in ordine casuale, 10 per partita
  questions.sort(() => Math.random() - 0.5);
  questions.length = Math.min(questions.length, 10);

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
