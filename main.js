(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.registerPlugin(ScrollTrigger);
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  // Lenis
  let lenis;
  if (!reduce) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const id = a.getAttribute('href'); if (id.length < 2) return;
      const el = document.querySelector(id); if (!el) return;
      e.preventDefault(); closeMenu(); lenis.scrollTo(el, { offset: -40, duration: 1.4 });
    }));
  }

  // Menu
  const burger = document.getElementById('burger'), menu = document.getElementById('menu');
  const closeMenu = () => { document.body.classList.remove('menu-open'); menu.classList.remove('open'); burger.setAttribute('aria-expanded','false'); lenis && lenis.start(); };
  burger.addEventListener('click', () => {
    const open = !menu.classList.contains('open');
    document.body.classList.toggle('menu-open', open); menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open)); lenis && (open ? lenis.stop() : lenis.start());
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu(); });
  document.querySelectorAll('.nav a.active').forEach(a => a.setAttribute('aria-current', 'page'));

  // Nav hide on scroll down
  let last = 0; const nav = document.getElementById('nav');
  ScrollTrigger.create({ onUpdate: s => { const y = s.scroll(); nav.classList.toggle('hide', y > last && y > 120 && !document.body.classList.contains('menu-open')); last = y; } });

  // Split headlines into words
  document.querySelectorAll('.split').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => `<span class="line"><span class="word">${w}</span></span>`).join(' ');
    el.setAttribute('aria-label', words.join(' '));
  });

  if (reduce) return;


  // Scroll reveals
  document.querySelectorAll('.split').forEach(el => {
    gsap.to(el.querySelectorAll('.word'), { y: 0, duration: 1.1, ease: 'power4.out', stagger: 0.04,
      scrollTrigger: { trigger: el, start: 'top 85%' } });
  });
  document.querySelectorAll('section:not(.scene) .reveal, .trust').forEach(el => {
    gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });

  // Counters
  document.querySelectorAll('.count').forEach(el => {
    const to = +el.dataset.to, o = { v: 0 };
    gsap.to(o, { v: to, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: () => el.textContent = Math.round(o.v).toLocaleString('de-DE') });
  });

  // Horizontal process
  const track = document.getElementById('track');
  if (track) ScrollTrigger.matchMedia({ '(min-width: 821px)': () => {
    const dist = () => track.scrollWidth - track.parentElement.clientWidth;
    gsap.to(track, { x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: '.process', start: 'center center', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true } });
  }});

  // FAQ: nur eins offen
  document.querySelectorAll('.q').forEach(d => d.addEventListener('toggle', () => { if (d.open) document.querySelectorAll('.q[open]').forEach(o => { if (o !== d) o.open = false; }); ScrollTrigger.refresh(); }));

  // Card tilt
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      gsap.to(card, { rotateY: x * 6, rotateX: -y * 6, transformPerspective: 900, duration: .6, ease: 'power3' });
    });
    card.addEventListener('pointerleave', () => gsap.to(card, { rotateY: 0, rotateX: 0, duration: .8, ease: 'power3' }));
  });

  // Seitenübergang (Vorhang)
  const introCurtain = document.querySelector('.curtain.intro');
  let seen = false; try { seen = sessionStorage.getItem('everia-intro'); } catch (e) {}
  if (introCurtain && !seen) {
    try { sessionStorage.setItem('everia-intro', '1'); } catch (e) {}
    document.body.classList.add('intro-on');
    setTimeout(() => document.body.classList.add('ready'), 1300);
  } else requestAnimationFrame(() => document.body.classList.add('ready'));
  document.querySelectorAll('a[href$=".html"], a[href*=".html#"]').forEach(a => a.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || a.target === '_blank') return;
    const href = a.getAttribute('href'), [path, hash] = href.split('#');
    if (path === location.pathname.split('/').pop()) { // gleiche Seite: nur scrollen
      const el = hash && document.getElementById(hash); if (!el) return;
      e.preventDefault(); closeMenu(); lenis ? lenis.scrollTo(el, { offset: -40, duration: 1.4 }) : el.scrollIntoView(); return;
    }
    e.preventDefault(); document.body.classList.add('leaving');
    setTimeout(() => location.href = a.getAttribute('href'), 650);
  }));
  window.addEventListener('pageshow', e => { if (e.persisted) document.body.classList.remove('leaving'); });

  // Mobile-CTA erst nach der Scroll-Szene zeigen
  const sticky = document.querySelector('.sticky-cta'), scene = document.querySelector('.scene');
  if (sticky && scene) { sticky.classList.add('off'); ScrollTrigger.create({ start: () => scene.offsetHeight - innerHeight * .6, end: 'max', onToggle: t => sticky.classList.toggle('off', !t.isActive) }); }

  document.querySelectorAll('.totop').forEach(a => a.addEventListener('click', e => { e.preventDefault(); lenis ? lenis.scrollTo(0, { duration: 1.4 }) : scrollTo(0, 0); }));

  // Scroll-Fortschritt
  const prog = document.getElementById('progress');
  if (prog) ScrollTrigger.create({ onUpdate: s => prog.style.transform = `scaleX(${s.progress})` });

  // Magnetische Buttons + Glanz
  if (window.matchMedia('(hover:hover)').matches) document.querySelectorAll('.btn').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      b.style.setProperty('--mx', (e.clientX - r.left) + 'px'); b.style.setProperty('--my', (e.clientY - r.top) + 'px');
      gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .18, y: (e.clientY - r.top - r.height / 2) * .3, duration: .5, ease: 'power3' });
    });
    b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1,.5)' }));
  });

  // Parallax für Seiten-Header-Bilder
  document.querySelectorAll('.page-hero img').forEach(im => gsap.fromTo(im, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: im, start: 'top bottom', end: 'bottom top', scrub: true } }));

  // Effizienzklassen-Skala wächst ins Bild
  const scale = document.querySelector('.scale');
  if (scale) gsap.from(scale.children, { scaleX: 0, duration: 1, ease: 'power4.out', stagger: .07, scrollTrigger: { trigger: scale, start: 'top 80%' } });

  // Beispiel-Fahrplan (Sanierungsfahrplan)
  const planSteps = document.getElementById('planSteps');
  if (planSteps) {
    const eur = n => Math.round(n).toLocaleString('de-DE') + ' €';
    const classes = [['A+','#1a9641'],['A','#3fa53a'],['B','#79b830'],['C','#b5c920'],['D','#e8c31b'],['E','#f19a1a'],['F','#e8661a'],['G','#d93a2b'],['H','#b3161b']];
    const steps = [
      { cls: 8, kwh: 265, cost: 4400, inv: 0, f: 0, kicker: 'Ausgangszustand' },
      { cls: 6, kwh: 210, cost: 3500, inv: 28000, f: .20, kicker: 'Nach Schritt 1 · Dach' },
      { cls: 5, kwh: 175, cost: 2900, inv: 22000, f: .20, kicker: 'Nach Schritt 2 · Fenster' },
      { cls: 3, kwh: 115, cost: 1900, inv: 45000, f: .20, kicker: 'Nach Schritt 3 · Fassade' },
      { cls: 1, kwh: 45, cost: 700, inv: 38000, f: .55, kicker: 'Ziel · Wärmepumpe + PV' },
    ];
    const ladder = document.getElementById('ladder');
    classes.forEach(([c, col]) => { const i = document.createElement('i'); i.style.background = col; i.title = c; ladder.appendChild(i); });
    const el = { cls: document.getElementById('planCls'), kwh: document.getElementById('planKwh'), cost: document.getElementById('planCost'), kicker: document.getElementById('planKicker'), glow: document.getElementById('planGlow'), inv: document.getElementById('sumInv'), f: document.getElementById('sumF'), save: document.getElementById('sumSave') };
    const num = { kwh: 265, cost: 4400, inv: 0, f: 0, save: 0 };
    let auto, current = 0;
    const show = i => {
      current = i; const s = steps[i];
      planSteps.querySelectorAll('.pstep').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.i === i)));
      const [name, col] = classes[s.cls];
      el.cls.textContent = name; el.cls.style.color = col; el.glow.style.background = col; el.kicker.textContent = s.kicker;
      ladder.querySelectorAll('i').forEach((x, k) => x.classList.toggle('on', k === s.cls));
      gsap.fromTo(el.cls, { scale: .8, opacity: 0 }, { scale: 1, opacity: 1, duration: .6, ease: 'back.out(1.6)' });
      const inv = steps.slice(1, i + 1).reduce((a, x) => a + x.inv, 0), f = steps.slice(1, i + 1).reduce((a, x) => a + x.inv * x.f, 0);
      gsap.to(num, { kwh: s.kwh, cost: s.cost, inv, f, save: 4400 - s.cost, duration: .9, ease: 'power3.out', onUpdate: () => {
        el.kwh.textContent = Math.round(num.kwh); el.cost.textContent = eur(num.cost); el.inv.textContent = eur(num.inv); el.f.textContent = eur(num.f); el.save.textContent = eur(num.save);
      } });
    };
    planSteps.querySelectorAll('.pstep').forEach(b => b.addEventListener('click', () => { clearInterval(auto); show(+b.dataset.i); }));
    show(0);
    ScrollTrigger.create({ trigger: planSteps, start: 'top 70%', once: true, onEnter: () => { auto = setInterval(() => { if (current >= 4) return clearInterval(auto); show(current + 1); }, 2200); } });
  }

  // Karte erst per Klick (kein Drittanbieter-Aufruf ohne Zustimmung)
  const mapBtn = document.getElementById('mapBtn');
  if (mapBtn) mapBtn.addEventListener('click', () => {
    const m = document.getElementById('map'); const bbox = '7.00%2C49.66%2C7.10%2C49.71';
    m.innerHTML = `<iframe title="Karte: EVERIA GmbH, Neuhütten" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=49.6855%2C7.0527"></iframe>`;
  });

  // Energieausweis-Schnellcheck
  const quiz = document.getElementById('quizBox');
  if (quiz) {
    const qs = quiz.querySelectorAll('.qq'), bar = document.getElementById('quizBar'), res = document.getElementById('quizRes');
    const ans = []; let idx = 0;
    const go = i => { idx = i; qs.forEach((q, k) => q.classList.toggle('on', k === i)); bar.style.width = ((i + 1) / 3 * 100) + '%'; };
    const finish = () => {
      qs.forEach(q => q.classList.remove('on')); bar.style.width = '100%'; res.classList.add('on');
      const [zweck, groesse, bj] = ans; let t, x;
      if (zweck === 'neubau') { t = 'Bedarfsausweis (Neubau)'; x = 'Bei Neubau und größeren Umbauten ist der Bedarfsausweis Pflicht – er wird auf Basis der Planung berechnet und gehört zum GEG-Nachweis. Wir erstellen beides zusammen.'; }
      else if (groesse === 'klein' && bj === 'alt') { t = 'Bedarfsausweis'; x = 'Wohngebäude mit bis zu vier Wohnungen und Bauantrag vor November 1977 brauchen den Bedarfsausweis – außer sie wurden bereits auf das Niveau der Wärmeschutzverordnung 1977 saniert. Wir prüfen das beim Termin.'; }
      else if (zweck === 'info') { t = 'Bedarfsausweis – oder gleich der iSFP'; x = 'Zur Sanierungsplanung ist der Bedarfsausweis aussagekräftiger. Noch besser: ein individueller Sanierungsfahrplan, der zusätzlich Maßnahmen, Kosten und Förderung enthält – und mit bis zu 650 € bezuschusst wird.'; }
      else { t = 'Sie haben die Wahl'; x = 'Für Ihr Gebäude sind Bedarfs- und Verbrauchsausweis zulässig. Der Verbrauchsausweis ist schneller und günstiger (drei Jahresabrechnungen nötig), der Bedarfsausweis unabhängig vom Nutzerverhalten und für Käufer aussagekräftiger. Wir empfehlen, was zu Ihrem Zweck passt.'; }
      document.getElementById('resTitle').textContent = t; document.getElementById('resText').textContent = x;
      gsap.from(res, { y: 20, opacity: 0, duration: .6, ease: 'power3.out' });
    };
    quiz.querySelectorAll('.opts button').forEach(b => b.addEventListener('click', () => {
      ans[idx] = b.dataset.v;
      if (idx === 0 && b.dataset.v === 'neubau') return finish();
      idx < 2 ? go(idx + 1) : finish();
    }));
    document.getElementById('quizAgain').addEventListener('click', () => { ans.length = 0; res.classList.remove('on'); go(0); });
  }

  // Förderrechner
  const inv = document.getElementById('inv');
  if (inv) {
    const eur = n => Math.round(n).toLocaleString('de-DE') + ' €';
    const seg = document.getElementById('seg'), isfp = document.getElementById('isfp');
    const out = { inv: document.getElementById('invOut'), f: document.getElementById('fOut'), l: document.getElementById('fLabel'), rInv: document.getElementById('rInv'), rF: document.getElementById('rF'), rRest: document.getElementById('rRest') };
    const shown = { v: 0 };
    const calc = () => {
      const btn = seg.querySelector('[aria-pressed=true]'); const base = +btn.dataset.rate; const hp = base >= 30;
      const bonus = (!hp && isfp.checked) ? 5 : 0; const rate = Math.min(base + bonus, 70);
      const cap = hp ? 30000 : 60000; const v = +inv.value; const elig = Math.min(v, cap); const f = elig * rate / 100;
      out.inv.textContent = eur(v); out.rInv.textContent = eur(v); out.rF.textContent = '– ' + eur(f); out.rRest.textContent = eur(v - f);
      out.l.textContent = `geschätzte Förderung · ${rate} %` + (elig < v ? ` (förderfähig bis ${eur(cap)})` : '');
      gsap.to(shown, { v: f, duration: .6, ease: 'power3.out', onUpdate: () => out.f.textContent = eur(shown.v) });
    };
    inv.addEventListener('input', calc); isfp.addEventListener('change', calc);
    seg.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { seg.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', 'false')); b.setAttribute('aria-pressed', 'true'); calc(); }));
    calc();
  }

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
    const el = location.hash && document.getElementById(location.hash.slice(1));
    if (el) setTimeout(() => lenis ? lenis.scrollTo(el, { offset: -40, duration: 1.2 }) : el.scrollIntoView(), 300);
  });
})();