# Slot-Zusammenfassung — Termin-Dashboard Ophthalmologie

- **Datum/Uhrzeit:** 2026-06-19, ~17:36 Uhr
- **Slot-Ordner:** `2026-06-19_1736_termin-dashboard`
- **Fachbereich/Kontext:** Ophthalmologie — Praxisorganisation / Terminmanagement, Abrechnungs- und Abstandsregeln rund um OPs und OCT-Untersuchungen.

## Problem des Arztes
Im Praxisalltag existiert eine große „Excel-Tabelle" mit diversen Optimierungs-/Regelfällen
(medizinisch + organisatorisch). Statt Tabelle sollte EIN konkreter Bereich als **Dashboard**
visualisiert werden: die **Terminierung**. In einem Kalender soll automatisch geprüft werden,
ob die **Abstände zwischen Patiententerminen** korrekt eingehalten wurden, mit einer gut
sichtbaren Fehleranalyse oben (großer roter Rahmen).

## Fachliche Regeln (für den Prototyp festgelegt)
- **R1 — OP-Abstand:** Mindestens **28 Tage** zwischen zwei OPs (darf größer sein, nicht kleiner).
- **R2 — OCT-Abstand:** Mindestens **21 Tage** zwischen zwei OCTs.
- **R3 — OCT nach OP, kassenabhängig:**
  - **Kasse A:** OCT bereits **am OP-Tag** zulässig/abrechenbar.
  - **Kasse B:** OCT erst **nach 21 Tagen** zulässig/abrechenbar.
  - (Vereinfachung: reale Dutzende Kassen → im Prototyp zwei Varianten A/B.)
- **R4 — OCT-Jahresquote:** Maximal **6 OCTs pro Kalenderjahr** pro Patient. Mehr ist möglich,
  soll aber angezeigt werden (6 erreicht = Hinweis, >6 = Verstoß).

Klarstellung aus dem Gespräch: OCT ist nach OP **nicht zwingend** — entscheidend ist die
**Abrechnungsfähigkeit/Zulässigkeit** je nach Kasse. Indikationsstellung kann auch via FAG
oder rein funduskopisch erfolgen.

## Was gebaut wurde
Funktionierendes Frontend-Dashboard (Juni 2026 als Fokusmonat):
- **KPI-Leiste:** Patienten, Termine gesamt, Regelverstöße, Hinweise.
- **Roter Fehler-Block** oben: listet jeden Verstoß als Klartext mit Regel-Tag, Patient, Kasse,
  Meldung und betroffenen Daten. Klick → hebt Patient im Kalender hervor.
- **Gelber Hinweis-Block:** z. B. erreichte OCT-Jahresquote.
- **Kalender** (Monatsraster) mit farbcodierten Terminen (OP / OCT / Injektion / Kontrolle);
  Tage mit Verstoß bekommen roten Rahmen. Termin-Tooltip zeigt Patient-ID, Name, Auge, Kasse.
- **Patientenliste** rechts mit Kasse, OCT-Jahresquote (`n/6`) und Verstoß-Zähler; klickbar als Filter.
- **Regel-Engine** (`rules.js`) prüft R1–R4 automatisch aus den Termindaten.

## Architektur
**Frontend-only** (Vite + React, keine Backend-Logik nötig — reine Auswertung synthetischer Daten).
Dateien: `frontend/src/data.js` (Daten), `frontend/src/rules.js` (Regel-Engine), `frontend/src/App.jsx`, `frontend/src/styles.css`.

**So wieder starten:**
```powershell
.\start-local.ps1 -FrontendOnly
```
→ http://localhost:8080

## Verwendete Beispieldaten
**Ausschließlich synthetisch / frei erfunden — keine echten Patientendaten.** 10 Patienten
(P-1042…P-1051), gemischt Kasse A/B, mit bewusst eingebauten sauberen Fällen UND Verstößen
(OCT zu früh nach OP bei Kasse B, zwei OPs zu dicht, zwei OCTs zu dicht, 7 OCTs/Jahr → Quote
überschritten, 6 OCTs/Jahr → Quote erreicht). Die „Live-Kalenderanbindung" ist simuliert.

## Iterationen & Entscheidungen
- Excel-Idee → bewusst auf EINE Kernfunktion (Terminierung) heruntergebrochen.
- Kassenvielfalt → auf zwei prototypische Varianten A/B reduziert.
- Änderungen im Kalender selbst werden NICHT vorgenommen (würde real im echten Kalendersystem
  passieren) — der Prototyp liest nur und analysiert.

## Offene Ideen / nächste Schritte
1. **Detail-Ansicht pro Patient** (komplette Termin-Timeline mit eingezeichneten Abständen).
2. **Konkreter Korrektur-Vorschlag** im Fehler-Block (z. B. „frühestes zulässiges OCT-Datum: …").
3. **Diagnose-/Medikament-abhängige Regeln** (z. B. diabetisches Makulaödem) als Zusatzregel —
   im Gespräch als „falls Zeit bleibt" markiert.
4. Mehr Kassen-Profile / konfigurierbare Regelparameter.

## Status
Funktionierender Prototyp, Richtung bestätigt — als Diskussionsgrundlage live gezeigt.
