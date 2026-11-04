# Vertaalopdracht AreaInspect-website

Bron: `bron/talen/nl.json` (Nederlands). Maak per opgegeven taal `bron/talen/<code>.json`.

Over het bedrijf: AreaInspect (Utrecht, NL) maakt meetunits voor ecologisch onderzoek:
- de "Monitoringunit": mobiele unit op een telescoopmast met twee warmtebeeldcamera's (thermal cameras) voor 3D-stereo,
  ultrasone batdetector en vogelmicrofoon; gebruikt bij mini-windturbines (aanvaringen van vleermuizen/vogels met de rotor)
  en bij gebouwen (vinden van invliegopeningen = roost entrances/access points van vleermuizen in gevels);
- het "Smart Bee Hotel": monitoring van bijenhotels (insect hotels for wild/solitary bees) met drie 4K-camera's en AI.
Lezers: provincies, gemeenten, ecologische adviesbureaus, windturbine-eigenaren, woningcorporaties, natuurorganisaties.

Regels
1. Exact dezelfde sleutels als nl.json, zelfde volgorde. Alleen de waarden vertalen. Geldige JSON (UTF-8, geen \u-escapes nodig).
2. HTML in waarden behouden (`<br>`, `<a href="...">…</a>`): tags en href-waarden ongewijzigd, alleen de zichtbare tekst vertalen.
3. Zakelijke, beleefde aanspreekvorm: Sie (de), vous (fr), usted (es), Lei (it), Państwo (pl), vy/Vy (cs/sk) enz. Natuurlijk en vloeiend, niet woord-voor-woord.
4. Merknamen niet vertalen: AreaInspect, Smart Bee Hotel, GIS, Excel, PDF, 4G, GPS, 4K, AI, LiFePO4, QR, three.js, jsDelivr.
   `hero_label` en `meta_title` blijven exact Engels zoals in nl.json.
5. `prod1_naam` = productnaam na "AreaInspect" (NL "Monitoringunit"): kort, als productnaam, bijv. en "Monitoring Unit", de "Monitoring-Einheit".
6. `_taalnaam` = naam van de taal in die taal zelf (bijv. "Deutsch", "Français", "Polski"). `_og_locale` = bijv. de_DE, fr_FR, es_ES, it_IT, pl_PL, nb_NO, sv_SE, da_DK, fi_FI, pt_PT, cs_CZ, sk_SK, hu_HU, ro_RO, bg_BG, el_GR, hr_HR, sr_RS, sl_SI, et_EE, lv_LV, lt_LT, uk_UA, en_GB.
7. `ct_telefoon` wordt overal "+31 6 48 64 68 95". `ct_land` = "Nederland" in de doeltaal.
8. In `pv_rechten_p`: "Autoriteit Persoonsgegevens" wordt "de Nederlandse toezichthouder (Autoriteit Persoonsgegevens)" in de doeltaal, of de toezichthouder in het eigen land: kies "de Nederlandse privacytoezichthouder, de Autoriteit Persoonsgegevens".
9. Vaktermen: warmtebeeld = thermal imaging; batdetector = bat detector; geelpoothoornaar en Aziatische hoornaar = Vespa velutina (gebruik de gangbare naam in die taal); zweefvliegen = hoverflies; invliegopening = toegang/opening waar vleermuizen een gebouw in- of uitvliegen; kijkkegels = gezichtsvelden/beeldkegels van de camera's; in- en uitvluchten = in- en uitvliegende dieren (tellingen); ballastvoet = ballast base; gevel = facade.
10. Taalvarianten: no = Norsk bokmål; pt = Europees Portugees; sr = Servisch in LATIJNS schrift; en = Brits Engels.
11. Houd teksten ongeveer even lang als het Nederlands (knoppen en menu-items kort).

Controle na schrijven: `python3 -c "import json,sys; a=json.load(open('bron/talen/nl.json')); b=json.load(open(sys.argv[1])); assert list(a)==list(b); print('ok')" bron/talen/<code>.json`
en controleer dat het aantal `<a ` en `<br>` per waarde gelijk is aan nl.json.
