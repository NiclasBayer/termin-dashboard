# Termin-Dashboard Ophthalmologie

Frontend-only Prototyp (Vite + React) zur Visualisierung von Patiententerminen
in einer augenärztlichen Praxis, mit automatischer Prüfung der Abstands- und
Abrechnungsregeln rund um OPs und OCT-Untersuchungen.

> Entstanden als Live-Prototyp im Arzt-Slot am 19.06.2026 (Ophthalmologen-Kongress).
> **Alle Beispieldaten sind frei erfunden / synthetisch — keine echten Patientendaten.**

## Was es kann

- **KPI-Leiste:** Patienten, Termine gesamt, Regelverstöße, Hinweise.
- **Roter Fehler-Block:** listet jeden Regelverstoß als Klartext (Regel-Tag, Patient,
  Kasse, Meldung, betroffene Daten). Klick hebt den Patienten im Kalender hervor.
- **Gelber Hinweis-Block:** z. B. erreichte OCT-Jahresquote.
- **Kalender** (Monatsraster) mit farbcodierten Terminen (OP / OCT / Injektion /
  Kontrolle); Tage mit Verstoß bekommen einen roten Rahmen.
- **Patientenliste** mit Kasse, OCT-Jahresquote (`n/6`) und Verstoß-Zähler; als Filter klickbar.

## Regel-Engine (`frontend/src/rules.js`)

| Regel | Beschreibung |
|-------|--------------|
| **R1** | Mindestens **28 Tage** zwischen zwei OPs. |
| **R2** | Mindestens **21 Tage** zwischen zwei OCTs. |
| **R3** | OCT nach OP kassenabhängig: Kasse A am OP-Tag, Kasse B erst nach 21 Tagen. |
| **R4** | Maximal **6 OCTs pro Kalenderjahr** pro Patient (6 = Hinweis, >6 = Verstoß). |

## Starten

```powershell
.\start-local.ps1
```
→ http://localhost:8080

Oder manuell:

```bash
cd frontend
npm install
npm run dev
```

## Aufbau

```
frontend/src/data.js     # synthetische Termindaten (10 Patienten)
frontend/src/rules.js    # Regel-Engine R1–R4
frontend/src/App.jsx     # Dashboard-UI
frontend/src/styles.css  # Styling
```

Reine Frontend-Auswertung — kein Backend, keine Datenbank. Siehe `SLOT-SUMMARY.md`
für den fachlichen Hintergrund und die nächsten Ideen.
