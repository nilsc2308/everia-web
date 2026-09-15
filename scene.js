/* ===== Foto-Scroll-Sequenz: Haus → Porsche → Solardach → Zelle → Quartier ===== */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  const $ = q => document.querySelector(q);
  const shots = { haus: $('.shot-haus'), porsche: $('.shot-porsche'), solar: $('.shot-solar'), zelle: $('.shot-zelle'), quartier: $('.shot-quartier') };
  const img = k => shots[k].querySelector('img');
  const layers = { hero: $('#l-hero'), porsche: $('#l-porsche'), solar: $('#l-solar'), zelle: $('#l-zelle'), city: $('#l-city') };
  const flash = $('#flash');

  // Headlines der Layer in Wörter zerlegen (Wort-für-Wort-Reveal im Scroll)
  const wordsOf = layer => {
    const h = layer.querySelector('h2'); if (!h) return [];
    if (!h.querySelector('.w')) { const t = h.textContent.trim().split(/\s+/); h.setAttribute('aria-label', t.join(' ')); h.innerHTML = t.map(w => `<span class="lw"><span class="w">${w}</span></span>`).join(' '); }
    return h.querySelectorAll('.w');
  };
  const W = { porsche: wordsOf(layers.porsche), solar: wordsOf(layers.solar), zelle: wordsOf(layers.zelle), city: wordsOf(layers.city) };

  // Start state
  gsap.set([shots.porsche, shots.solar, shots.zelle, shots.quartier], { opacity: 0 });
  gsap.set(shots.solar, { clipPath: 'circle(0% at 50% 50%)', opacity: 1 });
  gsap.set(shots.quartier, { clipPath: 'circle(0% at 50% 50%)', opacity: 1 });
  gsap.set(img('haus'), { scale: 1.08 });
  gsap.set(img('porsche'), { scale: 1.2, xPercent: 6 });
  gsap.set(img('solar'), { scale: 1.15 });
  gsap.set(img('zelle'), { scale: 1.0 });
  gsap.set(img('quartier'), { scale: 1.35 });
  gsap.set(layers.hero, { opacity: 1 });

  // Intro (einmalig)
  gsap.from(layers.hero.querySelectorAll('.eyebrow,.h-xl,.lead,.actions'), { y: 40, opacity: 0, duration: 1.2, ease: 'power4.out', stagger: .12, delay: .2 });
  gsap.from(img('haus'), { scale: 1.25, duration: 2.4, ease: 'power3.out' });

  const tl = gsap.timeline({ defaults: { ease: 'none' },
    scrollTrigger: { trigger: '.scene', start: 'top top', end: 'bottom bottom', scrub: 0.6,
    } });

  // 0–1: Haus, langsamer Push-in, Hero-Text weg
  tl.to(img('haus'), { scale: 1.3, yPercent: -4, duration: 1.4 }, 0)
    .to(layers.hero, { opacity: 0, y: -60, duration: .5 }, .35)
  // 1–2: Cross-Dissolve zum Porsche, Kamera fährt seitlich
    .to(shots.porsche, { opacity: 1, duration: .6 }, 1.0)
    .fromTo(img('porsche'), { scale: 1.25, xPercent: 8, yPercent: 4 }, { scale: 1.05, xPercent: -3, yPercent: -3, duration: 1.6 }, 1.0)
    .fromTo(layers.porsche, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .4 }, 1.4)
    .fromTo(W.porsche, { yPercent: 110 }, { yPercent: 0, stagger: .02, duration: .12 }, 1.4)
    .to(layers.porsche, { opacity: 0, y: -40, duration: .4 }, 2.3)
  // 2.4–3.6: Iris-Wipe aufs Solardach, Push-in
    .to(shots.solar, { clipPath: 'circle(120% at 50% 50%)', duration: .8 }, 2.4)
    .fromTo(img('solar'), { scale: 1.3, yPercent: 6 }, { scale: 1.02, yPercent: 0, duration: 1.6 }, 2.4)
    .fromTo(layers.solar, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .4 }, 2.9)
    .fromTo(W.solar, { yPercent: 110 }, { yPercent: 0, stagger: .02, duration: .12 }, 2.9)
    .to(layers.solar, { opacity: 0, duration: .3 }, 3.7)
  // 3.6–4.6: Kamera taucht in die Zelle (starker Zoom + Dissolve auf Makro), warmes Licht
    .to(img('solar'), { scale: 2.6, duration: 1.0, ease: 'power2.in' }, 3.6)
    .to(shots.zelle, { opacity: 1, duration: .5 }, 3.9)
    .fromTo(img('zelle'), { scale: 1.0 }, { scale: 2.2, duration: 1.3, ease: 'power2.in' }, 3.9)
    .fromTo(layers.zelle, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .3 }, 4.1)
    .fromTo(W.zelle, { yPercent: 110 }, { yPercent: 0, stagger: .02, duration: .1 }, 4.1)
    .to(layers.zelle, { opacity: 0, duration: .25 }, 4.75)
  // 4.9–6: Aufblende ins Quartier bei Sonnenuntergang, sanfter Pull-back
    .to(shots.quartier, { clipPath: 'circle(120% at 50% 50%)', duration: .6, ease: 'power2.inOut' }, 4.9)
    .to(shots.zelle, { opacity: 0, duration: .01 }, 5.5)
    .fromTo(img('quartier'), { scale: 1.45, yPercent: 8 }, { scale: 1.0, yPercent: 0, duration: 1.4 }, 4.9)
    .fromTo(layers.city, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .4 }, 5.5)
    .fromTo(W.city, { yPercent: 110 }, { yPercent: 0, stagger: .02, duration: .12 }, 5.5);
})();