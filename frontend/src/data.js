// ============================================================================
//  SYNTHETISCHE BEISPIELDATEN  (frei erfunden, KEINE echten Patientendaten)
//  Simuliert die Anbindung an ein Praxis-Kalendersystem.
//  Terminarten: OP | OCT | Injektion | Kontrolle
//  Kasse: 'A' = OCT am OP-Tag zulässig, 'B' = OCT erst nach >21 Tagen
// ============================================================================

export const KASSEN = {
  A: { label: 'Kasse A', hint: 'OCT am OP-Tag abrechenbar' },
  B: { label: 'Kasse B', hint: 'OCT erst nach 21 Tagen' },
};

// Patientenstamm — synthetisch
export const PATIENTS = [
  { id: 'P-1042', name: 'Anna Berg',        kasse: 'A' },
  { id: 'P-1043', name: 'Bernd Falk',       kasse: 'B' },
  { id: 'P-1044', name: 'Clara Sommer',     kasse: 'B' },
  { id: 'P-1045', name: 'Dieter Wolf',      kasse: 'A' },
  { id: 'P-1046', name: 'Eva Klein',        kasse: 'B' },
  { id: 'P-1047', name: 'Frank Lorenz',     kasse: 'A' },
  { id: 'P-1048', name: 'Greta Hoffmann',   kasse: 'B' },
  { id: 'P-1049', name: 'Heinz Vogt',       kasse: 'A' },
  { id: 'P-1050', name: 'Ingrid Maurer',    kasse: 'B' },
  { id: 'P-1051', name: 'Jonas Reiter',     kasse: 'A' },
];

// Termine im Jahr 2026 (Fokus-Monat Juni). Mischung aus sauberen Fällen
// und bewusst eingebauten Regelverstössen, damit die Analyse etwas zeigt.
//   d = ISO-Datum, type = Terminart, eye = Auge (re/li)
export const APPOINTMENTS = [
  // P-1042 Anna Berg (Kasse A) — sauber: OCT am OP-Tag erlaubt
  { pid: 'P-1042', d: '2026-06-03', type: 'OP',        eye: 're' },
  { pid: 'P-1042', d: '2026-06-03', type: 'OCT',       eye: 're' },
  { pid: 'P-1042', d: '2026-07-02', type: 'OP',        eye: 're' }, // 29 Tage -> ok

  // P-1043 Bernd Falk (Kasse B) — VERSTOSS: OCT 8 Tage nach OP (B braucht >21)
  { pid: 'P-1043', d: '2026-06-02', type: 'OP',        eye: 'li' },
  { pid: 'P-1043', d: '2026-06-10', type: 'OCT',       eye: 'li' },
  { pid: 'P-1043', d: '2026-06-24', type: 'Kontrolle', eye: 'li' },

  // P-1044 Clara Sommer (Kasse B) — VERSTOSS: zwei OPs nur 14 Tage auseinander
  { pid: 'P-1044', d: '2026-06-05', type: 'OP',        eye: 're' },
  { pid: 'P-1044', d: '2026-06-19', type: 'OP',        eye: 'li' },
  { pid: 'P-1044', d: '2026-07-01', type: 'OCT',       eye: 're' },

  // P-1045 Dieter Wolf (Kasse A) — VERSTOSS: zwei OCT nur 12 Tage auseinander
  { pid: 'P-1045', d: '2026-06-04', type: 'OCT',       eye: 're' },
  { pid: 'P-1045', d: '2026-06-16', type: 'OCT',       eye: 're' },
  { pid: 'P-1045', d: '2026-06-09', type: 'Injektion', eye: 're' },

  // P-1046 Eva Klein (Kasse B) — sauber: OCT 24 Tage nach OP
  { pid: 'P-1046', d: '2026-06-01', type: 'OP',        eye: 'li' },
  { pid: 'P-1046', d: '2026-06-25', type: 'OCT',       eye: 'li' },

  // P-1047 Frank Lorenz (Kasse A) — VIEL-NUTZER: 6 OCTs im Jahr (Quote erreicht)
  { pid: 'P-1047', d: '2026-01-15', type: 'OCT',       eye: 're' },
  { pid: 'P-1047', d: '2026-02-20', type: 'OCT',       eye: 're' },
  { pid: 'P-1047', d: '2026-03-24', type: 'OCT',       eye: 're' },
  { pid: 'P-1047', d: '2026-04-28', type: 'OCT',       eye: 're' },
  { pid: 'P-1047', d: '2026-05-26', type: 'OCT',       eye: 're' },
  { pid: 'P-1047', d: '2026-06-22', type: 'OCT',       eye: 're' },

  // P-1048 Greta Hoffmann (Kasse B) — sauber
  { pid: 'P-1048', d: '2026-06-08', type: 'Injektion', eye: 're' },
  { pid: 'P-1048', d: '2026-06-29', type: 'Kontrolle', eye: 're' },

  // P-1049 Heinz Vogt (Kasse A) — VERSTOSS: 7 OCTs -> Quote überschritten
  { pid: 'P-1049', d: '2026-01-10', type: 'OCT',       eye: 'li' },
  { pid: 'P-1049', d: '2026-02-12', type: 'OCT',       eye: 'li' },
  { pid: 'P-1049', d: '2026-03-18', type: 'OCT',       eye: 'li' },
  { pid: 'P-1049', d: '2026-04-22', type: 'OCT',       eye: 'li' },
  { pid: 'P-1049', d: '2026-05-20', type: 'OCT',       eye: 'li' },
  { pid: 'P-1049', d: '2026-06-15', type: 'OCT',       eye: 'li' },
  { pid: 'P-1049', d: '2026-06-30', type: 'OCT',       eye: 'li' },

  // P-1050 Ingrid Maurer (Kasse B) — sauber
  { pid: 'P-1050', d: '2026-06-11', type: 'OP',        eye: 're' },
  { pid: 'P-1050', d: '2026-06-12', type: 'Kontrolle', eye: 're' },

  // P-1051 Jonas Reiter (Kasse A) — sauber: OCT am OP-Tag
  { pid: 'P-1051', d: '2026-06-17', type: 'OP',        eye: 'li' },
  { pid: 'P-1051', d: '2026-06-17', type: 'OCT',       eye: 'li' },
];
