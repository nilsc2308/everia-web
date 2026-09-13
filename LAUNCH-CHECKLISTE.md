# EVERIA GmbH – Launch-Checkliste

Quelle der Inhalte: everia-gmbh.de/energieberatung + Impressum (Stand 2026-09-13).
Seiten: index · leistungen · sanierungsfahrplan · foerderung · energieausweis · ueber-uns · ratgeber (+3 Artikel) · faq · kontakt · impressum · datenschutz · 404
Technik: statisch, `styles.css` / `main.js` / `scene.js` (Startseiten-Sequenz), GSAP + Lenis per CDN. Getestet in Chromium + WebKit (Desktop 1400px, iPhone 390px).

## Offen / vom Kunden zu klären
- [ ] Einverständnis der EVERIA GmbH (Inhalte wurden von deren Seite übernommen)
- [ ] Telefonnummer: Landingpage nennt 0160 99544632, Impressum 0151 463 287 44 – welche gilt? (aktuell 0160 im Kontakt, 0151 im Impressum)
- [ ] Förderprozentsätze (foerderung.html + Förderrechner) mit aktuellem BEG-Stand abgleichen
- [ ] Einzugsgebiet auf ueber-uns.html bestätigen (Hunsrück / Trier / Saarland / RLP – abgeleitet, nicht von der Website)
- [ ] Social-Media-Links im Footer eintragen (derzeit "#")
- [ ] Kontaktformular ist für **Netlify Forms** vorbereitet (`data-netlify`, Honeypot, danke.html). Bei anderem Hoster: Formspree o. ä. eintragen
- [ ] Echte Fotos (Team, Vor-Ort-Termin) statt Stockfotos? Unsplash-Bilder sind lizenzfrei nutzbar (img/BILDNACHWEIS.md)
- [ ] Logos EEE-Liste / DEN als Bilddateien
- [x] Inter lokal gehostet (fonts/), Datenschutz angepasst
- [ ] Ratgeber-Artikel fachlich gegenlesen (Fördersätze, GEG-Regeln – allgemein formuliert, Stand 2026)
- [ ] Beispiel-Fahrplan (sanierungsfahrplan.html) und Förderrechner: Zahlen sind Beispielwerte
- [ ] Karte: OpenStreetMap-Embed lädt erst per Klick; Koordinaten Neuhütten grob – ggf. exakt setzen
- [ ] 404.html beim Hoster als Fehlerseite eintragen (Netlify: automatisch)
- [ ] Datenschutzerklärung juristisch prüfen lassen
- [ ] Domain / Hosting (Netlify wie bei den anderen Projekten?)
