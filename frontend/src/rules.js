// ============================================================================
//  REGEL-ENGINE  — prüft die Terminabstände je Patient
//  Regeln (Prototyp):
//   R1  Mindestabstand zwischen zwei OPs:  28 Tage
//   R2  Mindestabstand zwischen zwei OCTs: 21 Tage
//   R3  OCT nach OP, kassenabhängig:
//         Kasse A -> am OP-Tag zulässig (kein Mindestabstand)
//         Kasse B -> erst NACH 21 Tagen zulässig
//   R4  Maximal 6 OCTs pro Kalenderjahr  (Quote -> Hinweis/Verstoss)
// ============================================================================

export const RULES = {
  OP_GAP_DAYS: 28,
  OCT_GAP_DAYS: 21,
  OCT_AFTER_OP_B_DAYS: 21,
  OCT_MAX_PER_YEAR: 6,
};

const days = (a, b) =>
  Math.round((new Date(b) - new Date(a)) / 86400000);

const year = (d) => new Date(d).getFullYear();

// Liefert ein Array von Befunden: { pid, severity, rule, dates:[...], msg }
// severity: 'error' (Verstoss) | 'warn' (Quote erreicht / Grenzfall)
export function analyze(patients, appointments) {
  const findings = [];
  const byPid = {};
  for (const p of patients) byPid[p.id] = p;

  // Termine je Patient gruppieren + chronologisch sortieren
  const groups = {};
  for (const a of appointments) (groups[a.pid] ||= []).push(a);
  for (const pid in groups)
    groups[pid].sort((x, y) => new Date(x.d) - new Date(y.d));

  for (const pid in groups) {
    const p = byPid[pid];
    const appts = groups[pid];
    const ops = appts.filter((a) => a.type === 'OP');
    const octs = appts.filter((a) => a.type === 'OCT');

    // R1 — Abstand zwischen aufeinanderfolgenden OPs
    for (let i = 1; i < ops.length; i++) {
      const g = days(ops[i - 1].d, ops[i].d);
      if (g < RULES.OP_GAP_DAYS)
        findings.push({
          pid, severity: 'error', rule: 'R1 · OP-Abstand',
          dates: [ops[i - 1].d, ops[i].d],
          msg: `Zwei OPs nur ${g} Tage auseinander – Mindestabstand ${RULES.OP_GAP_DAYS} Tage unterschritten.`,
        });
    }

    // R2 — Abstand zwischen aufeinanderfolgenden OCTs
    for (let i = 1; i < octs.length; i++) {
      const g = days(octs[i - 1].d, octs[i].d);
      if (g < RULES.OCT_GAP_DAYS)
        findings.push({
          pid, severity: 'error', rule: 'R2 · OCT-Abstand',
          dates: [octs[i - 1].d, octs[i].d],
          msg: `Zwei OCTs nur ${g} Tage auseinander – Mindestabstand ${RULES.OCT_GAP_DAYS} Tage unterschritten.`,
        });
    }

    // R3 — OCT nach OP, kassenabhängig (jeweils erstes OCT nach einer OP)
    for (const op of ops) {
      const nextOct = octs.find((o) => new Date(o.d) >= new Date(op.d));
      if (!nextOct) continue;
      const g = days(op.d, nextOct.d);
      if (p.kasse === 'B' && g <= RULES.OCT_AFTER_OP_B_DAYS) {
        findings.push({
          pid, severity: 'error', rule: 'R3 · OCT nach OP (Kasse B)',
          dates: [op.d, nextOct.d],
          msg: `OCT bereits ${g} Tage nach OP – bei Kasse B erst nach ${RULES.OCT_AFTER_OP_B_DAYS} Tagen abrechenbar.`,
        });
      }
      // Kasse A: am OP-Tag erlaubt -> kein Verstoss
    }

    // R4 — max. 6 OCTs pro Jahr
    const perYear = {};
    for (const o of octs) (perYear[year(o.d)] ||= 0, perYear[year(o.d)]++);
    for (const y in perYear) {
      const n = perYear[y];
      if (n > RULES.OCT_MAX_PER_YEAR)
        findings.push({
          pid, severity: 'error', rule: 'R4 · OCT-Jahresquote',
          dates: [],
          msg: `${n} OCTs in ${y} – Jahresquote von ${RULES.OCT_MAX_PER_YEAR} überschritten.`,
        });
      else if (n === RULES.OCT_MAX_PER_YEAR)
        findings.push({
          pid, severity: 'warn', rule: 'R4 · OCT-Jahresquote',
          dates: [],
          msg: `${n} OCTs in ${y} – Jahresquote von ${RULES.OCT_MAX_PER_YEAR} erreicht.`,
        });
    }
  }

  // Verstösse zuerst, dann Hinweise
  findings.sort((a, b) => (a.severity === b.severity ? 0 : a.severity === 'error' ? -1 : 1));
  return findings;
}
