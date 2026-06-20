import { useMemo, useState } from 'react';
import { PATIENTS, APPOINTMENTS, KASSEN } from './data';
import { analyze } from './rules';

// ============================================================================
//  Termin-Dashboard Ophthalmologie  (Prototyp, synthetische Daten)
//  Kalender + automatische Abstands-/Quoten-Prüfung der Patiententermine.
// ============================================================================

const TYPE_META = {
  OP:        { label: 'OP',         cls: 'op' },
  OCT:       { label: 'OCT',        cls: 'oct' },
  Injektion: { label: 'Injektion',  cls: 'inj' },
  Kontrolle: { label: 'Kontrolle',  cls: 'ktrl' },
};

const MONTH = { year: 2026, month: 5 }; // Juni 2026 (0-basiert)
const MONTH_LABEL = 'Juni 2026';
const WD = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export default function App() {
  const patientsById = useMemo(() => {
    const m = {};
    for (const p of PATIENTS) m[p.id] = p;
    return m;
  }, []);

  const findings = useMemo(() => analyze(PATIENTS, APPOINTMENTS), []);
  const [focusPid, setFocusPid] = useState(null);

  // Termine des Fokus-Monats nach Tag bündeln
  const byDay = useMemo(() => {
    const m = {};
    for (const a of APPOINTMENTS) {
      const dt = new Date(a.d);
      if (dt.getFullYear() === MONTH.year && dt.getMonth() === MONTH.month)
        (m[dt.getDate()] ||= []).push(a);
    }
    return m;
  }, []);

  // Tage, die in einem Verstoss vorkommen -> Markierung im Kalender
  const flaggedDays = useMemo(() => {
    const s = new Set();
    for (const f of findings) {
      if (f.severity !== 'error') continue;
      for (const d of f.dates) {
        const dt = new Date(d);
        if (dt.getFullYear() === MONTH.year && dt.getMonth() === MONTH.month)
          s.add(dt.getDate());
      }
    }
    return s;
  }, [findings]);

  // Kalenderraster (Wochen) für den Fokus-Monat aufbauen
  const weeks = useMemo(() => {
    const first = new Date(MONTH.year, MONTH.month, 1);
    const daysInMonth = new Date(MONTH.year, MONTH.month + 1, 0).getDate();
    const lead = (first.getDay() + 6) % 7; // Mo=0
    const cells = [];
    for (let i = 0; i < lead; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7) cells.push(null);
    const w = [];
    for (let i = 0; i < cells.length; i += 7) w.push(cells.slice(i, i + 7));
    return w;
  }, []);

  const errors = findings.filter((f) => f.severity === 'error');
  const warns = findings.filter((f) => f.severity === 'warn');

  const visibleDay = (entries) =>
    !focusPid ? entries : entries.filter((e) => e.pid === focusPid);

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="dot" />
          Termin-Dashboard · Ophthalmologie
        </div>
        <span className="pill muted">Live-Kalenderanbindung (simuliert) · {MONTH_LABEL}</span>
      </header>

      <main className="dash">
        {/* KPI-Leiste */}
        <section className="kpis">
          <div className="kpi">
            <span className="kpi-num">{PATIENTS.length}</span>
            <span className="kpi-lbl">Patienten</span>
          </div>
          <div className="kpi">
            <span className="kpi-num">{APPOINTMENTS.length}</span>
            <span className="kpi-lbl">Termine gesamt</span>
          </div>
          <div className={`kpi ${errors.length ? 'bad' : 'good'}`}>
            <span className="kpi-num">{errors.length}</span>
            <span className="kpi-lbl">Regelverstösse</span>
          </div>
          <div className="kpi warnk">
            <span className="kpi-num">{warns.length}</span>
            <span className="kpi-lbl">Hinweise</span>
          </div>
        </section>

        {/* FEHLER-BLOCK (rot, oben) */}
        {errors.length > 0 && (
          <section className="alertbox">
            <div className="alertbox-head">
              ⚠ {errors.length} Regelverstösse erkannt – Termine prüfen / verschieben
            </div>
            <ul className="alertlist">
              {errors.map((f, i) => {
                const p = patientsById[f.pid];
                return (
                  <li key={i} onClick={() => setFocusPid(f.pid)} title="Patient im Kalender hervorheben">
                    <span className="tag-rule">{f.rule}</span>
                    <strong>{p.name}</strong>
                    <span className="tag-kasse">{KASSEN[p.kasse].label}</span>
                    <span className="amsg">{f.msg}</span>
                    {f.dates.length > 0 && (
                      <span className="adates">{f.dates.map(fmt).join(' → ')}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Hinweise (gelb) */}
        {warns.length > 0 && (
          <section className="warnbox">
            <ul className="alertlist">
              {warns.map((f, i) => {
                const p = patientsById[f.pid];
                return (
                  <li key={i} onClick={() => setFocusPid(f.pid)}>
                    <span className="tag-rule warn">{f.rule}</span>
                    <strong>{p.name}</strong>
                    <span className="amsg">{f.msg}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <div className="grid2">
          {/* KALENDER */}
          <section className="card cal">
            <div className="cal-head">
              <h2>Kalender · {MONTH_LABEL}</h2>
              {focusPid && (
                <button className="ghost" onClick={() => setFocusPid(null)}>
                  Filter aufheben: {patientsById[focusPid].name} ✕
                </button>
              )}
            </div>
            <div className="cal-grid">
              {WD.map((w) => (
                <div key={w} className="cal-wd">{w}</div>
              ))}
              {weeks.flat().map((d, i) => {
                if (!d) return <div key={i} className="cal-cell empty" />;
                const entries = visibleDay(byDay[d] || []);
                const flagged = flaggedDays.has(d);
                return (
                  <div key={i} className={`cal-cell ${flagged ? 'flag' : ''}`}>
                    <span className="cal-day">{d}</span>
                    <div className="cal-events">
                      {entries.map((e, j) => {
                        const p = patientsById[e.pid];
                        const t = TYPE_META[e.type];
                        return (
                          <div
                            key={j}
                            className={`ev ${t.cls}`}
                            title={`${p.name} (${p.id}) · ${e.type} · ${e.eye} · ${KASSEN[p.kasse].label}`}
                            onClick={() => setFocusPid(e.pid)}
                          >
                            <span className="ev-t">{t.label}</span>
                            <span className="ev-n">{p.name.split(' ')[0]}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="legend">
              {Object.values(TYPE_META).map((t) => (
                <span key={t.cls} className={`lg ${t.cls}`}>{t.label}</span>
              ))}
              <span className="lg flag-lg">Regelverstoss</span>
            </div>
          </section>

          {/* PATIENTENLISTE */}
          <section className="card">
            <h2>Patienten</h2>
            <ul className="plist">
              {PATIENTS.map((p) => {
                const cnt = errors.filter((f) => f.pid === p.id).length;
                const octN = APPOINTMENTS.filter(
                  (a) => a.pid === p.id && a.type === 'OCT' &&
                    new Date(a.d).getFullYear() === 2026
                ).length;
                return (
                  <li
                    key={p.id}
                    className={`${focusPid === p.id ? 'sel' : ''} ${cnt ? 'haserr' : ''}`}
                    onClick={() => setFocusPid(focusPid === p.id ? null : p.id)}
                  >
                    <div className="pl-main">
                      <strong>{p.name}</strong>
                      <span className="pl-id">{p.id}</span>
                    </div>
                    <span className="tag-kasse">{KASSEN[p.kasse].label}</span>
                    <span className={`pl-oct ${octN >= 6 ? 'full' : ''}`}>{octN}/6 OCT</span>
                    {cnt > 0 && <span className="pl-err">{cnt}</span>}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}

function fmt(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
}
