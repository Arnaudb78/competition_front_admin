export type EventType = "afterwork" | "experience" | "talks";

// ─── AFTERWORK ────────────────────────────────────────────────────────────────
export const afterworkEditions = [
  { edition: "Éd. 1",  date: "20/03/2025", inscrits: 150, checkedIn: 97,  notAttending: 0,  orders: 107 },
  { edition: "Éd. 2",  date: "17/04/2025", inscrits: 186, checkedIn: 111, notAttending: 5,  orders: 127 },
  { edition: "Éd. 3",  date: "15/05/2025", inscrits: 133, checkedIn: 86,  notAttending: 0,  orders: 92  },
  { edition: "Éd. 4",  date: "19/06/2025", inscrits: 169, checkedIn: 92,  notAttending: 6,  orders: 94  },
  { edition: "Éd. 5",  date: "17/07/2025", inscrits: 155, checkedIn: 85,  notAttending: 15, orders: 98  },
  { edition: "Éd. 6",  date: "18/09/2025", inscrits: 182, checkedIn: 60,  notAttending: 5,  orders: 101 },
  { edition: "Éd. 7",  date: "16/10/2025", inscrits: 135, checkedIn: 76,  notAttending: 15, orders: 83  },
  { edition: "Éd. 8",  date: "20/11/2025", inscrits: 162, checkedIn: 80,  notAttending: 14, orders: 99  },
  { edition: "Éd. 9",  date: "15/01/2026", inscrits: 75,  checkedIn: 50,  notAttending: 0,  orders: 49  },
];

export const afterworkDiscoverySources = [
  { source: "Employé Enchanted Tools", count: 36 },
  { source: "Amis / Famille",          count: 36 },
  { source: "Eventbrite",              count: 12 },
  { source: "Web",                     count: 11 },
  { source: "Voisinage",               count: 10 },
  { source: "Réseaux Sociaux",         count: 4  },
  { source: "Presse",                  count: 2  },
];

export const afterworkTopCities = [
  { city: "Paris",              count: 325 },
  { city: "Valenton",          count: 21  },
  { city: "Aubervilliers",     count: 15  },
  { city: "Orléans",           count: 12  },
  { city: "Montreuil",         count: 9   },
  { city: "Colombes",          count: 9   },
  { city: "Suresnes",          count: 7   },
  { city: "Versailles",        count: 7   },
];

// ─── EXPÉRIENCE MIROKAÏ ───────────────────────────────────────────────────────
export const experienceCheckinStats = {
  checkedIn:  79,
  noShow:     112,
  attending:  163,
};

export const experienceAudit = {
  capaciteTotale:    1635,
  totalVendus:       242,
  nombreCreneaux:    109,
  capaciteParCreneau: 15,
};

export const experienceDiscoverySources = [
  { source: "Bouche à oreille", count: 8 },
  { source: "Réseaux Sociaux",  count: 6 },
  { source: "Presse",           count: 2 },
  { source: "Autre",            count: 1 },
];

export const experienceTopZip = [
  { zip: "94800", count: 5 },
  { zip: "94200", count: 4 },
  { zip: "75015", count: 3 },
  { zip: "75013", count: 3 },
  { zip: "92270", count: 2 },
  { zip: "75018", count: 1 },
  { zip: "75019", count: 1 },
];

// ─── TALKS ────────────────────────────────────────────────────────────────────
export const talksEditions = [
  {
    title: "Talk #1 — Peut-on avoir confiance en l'IA ?",
    shortTitle: "Talk #1",
    speaker: "Rodolphe Gelin",
    date: "05/06/2025",
    inscrits: 39,
    checkedIn: 21,
    noShow: 18,
  },
  {
    title: "Talk #2 — Communiquer avec des agents socialement interactifs",
    shortTitle: "Talk #2",
    speaker: "",
    date: "03/07/2025",
    inscrits: 30,
    checkedIn: 10,
    noShow: 20,
  },
  {
    title: "Talk #3 — Connecter un robot manipulateur au corps humain",
    shortTitle: "Talk #3",
    speaker: "",
    date: "04/09/2025",
    inscrits: 37,
    checkedIn: 17,
    noShow: 20,
  },
];

export const talksTopCities = [
  { city: "Paris",              count: 37 },
  { city: "Colombes",          count: 4  },
  { city: "Issy-les-Moulineaux", count: 3 },
  { city: "Saint-Denis",       count: 2  },
  { city: "Vitry-sur-Seine",   count: 2  },
  { city: "Romainville",       count: 2  },
];
