import React, { useMemo, useState } from 'react';

const PEOPLE = ['Martin', 'Lahaina', 'Louise', 'Jérémy', 'Morgan', 'Margaux', 'Thomas'];
const PLACES = ['France', 'Tahiti', 'Bora Bora', 'Maupiti', 'Rangiroa', 'Fakarava', 'Transit'];

const INITIAL_EVENTS = [
  {
    id: 1,
    title: 'Vol Paris Orly → Papeete',
    date: '2027-05-27',
    timeTaht: '04:50',
    note: 'Départ Paris Orly le 26/05 à 18h30 (heure locale) → Arrivée Papeete le 27/05 à 04h50 (TAHT)',
    people: ['Martin', 'Lahaina', 'Louise', 'Jérémy'],
    place: 'Tahiti',
    todo: false,
  },
  {
    id: 2,
    title: 'Vol Papeete → Bora Bora (Motu Mute)',
    date: '2027-05-27',
    timeTaht: '08:05',
    note: 'Départ 07h15 → Arrivée 08h05 (heure de Tahiti)',
    people: ['Louise', 'Jérémy'],
    place: 'Bora Bora',
    todo: false,
  },
  {
    id: 3,
    title: 'Ferry Apetahi Express Bora Bora → Maupiti',
    date: '2027-06-01',
    timeTaht: '14:55',
    note: 'Départ 13h40 → Arrivée 14h55 (heure de Tahiti)',
    people: ['Louise', 'Jérémy'],
    place: 'Maupiti',
    todo: false,
  },
  {
    id: 4,
    title: 'Ferry Apetahi Express Maupiti → Bora Bora (Vaitape)',
    date: '2027-06-05',
    timeTaht: '07:45',
    note: 'Départ 06h30 → Arrivée 07h45 (heure de Tahiti)',
    people: ['Louise', 'Jérémy'],
    place: 'Bora Bora',
    todo: false,
  },
  {
    id: 5,
    title: 'Vol Bora Bora → Rangiroa',
    date: '2027-06-05',
    timeTaht: '12:55',
    note: 'Départ 11h40 → Arrivée 12h55 (heure de Tahiti)',
    people: ['Louise', 'Jérémy'],
    place: 'Rangiroa',
    todo: false,
  },
  {
    id: 6,
    title: 'Vol Paris Orly → Papeete',
    date: '2027-06-07',
    timeTaht: '04:50',
    note: 'Départ Paris Orly le 06/06 à 18h30 (heure locale) → Arrivée Papeete le 07/06 à 04h50 (TAHT)',
    people: ['Morgan', 'Margaux', 'Thomas'],
    place: 'Tahiti',
    todo: false,
  },
  {
    id: 7,
    title: 'Vol Rangiroa → Tahiti',
    date: '2027-06-10',
    timeTaht: '15:55',
    note: 'Départ 14h55 → Arrivée 15h55 (TAHT) ; séjour chez Martin & Lahaina',
    people: ['Louise', 'Jérémy'],
    place: 'Tahiti',
    todo: false,
  },
  {
    id: 8,
    title: 'Vol Papeete → Paris Orly',
    date: '2027-06-24',
    timeTaht: '07:00',
    note: 'Départ Papeete le 24/06 à 07h00 (TAHT) → Arrivée Orly le 25/06 à 16h20 (heure locale)',
    people: ['Louise', 'Jérémy'],
    place: 'France',
    todo: false,
  },
  {
    id: 9,
    title: 'Vol retour Thomas (à compléter)',
    date: '2027-06-26',
    timeTaht: '07:00',
    note: 'À renseigner par Thomas (départ environ 1 semaine avant Morgan & Margaux)',
    people: ['Thomas'],
    place: 'France',
    todo: true,
  },
  {
    id: 10,
    title: 'Vol Papeete → Paris Orly',
    date: '2027-07-03',
    timeTaht: '07:00',
    note: 'Départ Papeete le 03/07 à 07h00 (TAHT) → Arrivée Orly le 04/07 à 16h20 (heure locale)',
    people: ['Morgan', 'Margaux'],
    place: 'France',
    todo: false,
  },
];

function getDatesRange(startStr, endStr) {
  const dates = [];
  const cur = new Date(`${startStr}T12:00:00Z`);
  const end = new Date(`${endStr}T12:00:00Z`);
  while (cur <= end) {
    dates.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return dates;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState('');
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2027-06-26');
  const [timeTaht, setTimeTaht] = useState('07:00');
  const [place, setPlace] = useState('France');
  const [selectedPeople, setSelectedPeople] = useState(['Thomas']);
  const [note, setNote] = useState('');

  const dates = useMemo(() => getDatesRange('2027-05-22', '2027-07-04'), []);

  const presenceMatrix = useMemo(() => {
    const stateByPerson = {
      Martin: 'Tahiti',
      Lahaina: 'Tahiti',
      Louise: 'France',
      Jérémy: 'France',
      Morgan: 'France',
      Margaux: 'France',
      Thomas: 'France',
    };
    const matrix = {};
    for (const d of dates) {
      const dayEvents = events
        .filter((ev) => ev.date === d)
        .sort((a, b) => a.timeTaht.localeCompare(b.timeTaht));
      for (const ev of dayEvents) {
        for (const p of ev.people) {
          stateByPerson[p] = ev.place;
        }
      }
      matrix[d] = { ...stateByPerson };
    }
    return matrix;
  }, [dates, events]);

  function togglePerson(person) {
    setSelectedPeople((prev) =>
      prev.includes(person) ? prev.filter((x) => x !== person) : [...prev, person]
    );
  }

  function handleAddEvent(e) {
    e.preventDefault();
    if (!title.trim() || selectedPeople.length === 0) return;
    setEvents((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: title.trim(),
        date,
        timeTaht,
        place,
        people: selectedPeople,
        note: note.trim() || 'Horaire exprimé en heure de Polynésie (TAHT)',
        todo: false,
      },
    ]);
    setTitle('');
    setNote('');
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <header className="bg-white rounded-2xl shadow-sm border p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-sky-900">Polynésie 2027 — Qui est où ?</h1>
          <p className="text-sm text-slate-600">
            Tous les horaires sont raménés à l&apos;<strong>Heure de Tahiti (TAHT, UTC-10)</strong>.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-slate-700">Qui es-tu ?</span>
          {PEOPLE.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setCurrentUser(p);
                setSelectedPeople([p]);
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                currentUser === p
                  ? 'bg-sky-700 text-white border-sky-700'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-sky-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </header>

      <section className="bg-white rounded-2xl shadow-sm border p-5">
        <h2 className="text-lg font-semibold mb-3">Présences jour par jour (22 mai – 4 juillet 2027)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="p-2 border sticky left-0 bg-slate-100">Date</th>
                {PEOPLE.map((p) => (
                  <th key={p} className="p-2 border">{p}</th>
                ))}
                <th className="p-2 border">À Tahiti</th>
              </tr>
            </thead>
            <tbody>
              {dates.map((d) => {
                const row = presenceMatrix[d];
                const atTahiti = PEOPLE.filter((p) => row[p] === 'Tahiti');
                return (
                  <tr key={d} className="hover:bg-sky-50/40">
                    <td className="p-2 border font-medium sticky left-0 bg-white">{d}</td>
                    {PEOPLE.map((p) => (
                      <td key={p} className="p-2 border">{row[p]}</td>
                    ))}
                    <td className="p-2 border text-slate-600">
                      {atTahiti.length ? atTahiti.join(', ') : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl shadow-sm border p-5">
          <h2 className="text-lg font-semibold mb-3">Ajouter un événement (heure de Tahiti TAHT)</h2>
          <form onSubmit={handleAddEvent} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Titre</label>
              <input
                type="text"
                required
                placeholder="Ex. Vol retour Thomas Papeete → Paris"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Date (TAHT)</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Heure (TAHT)</label>
                <input
                  type="time"
                  value={timeTaht}
                  onChange={(e) => setTimeTaht(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Lieu d&apos;arrivée</label>
                <select
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  {PLACES.map((pl) => (
                    <option key={pl} value={pl}>{pl}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Personnes concernées</label>
              <div className="flex flex-wrap gap-2">
                {PEOPLE.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePerson(p)}
                    className={`px-2.5 py-1 rounded-full text-xs border ${
                      selectedPeople.includes(p)
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Détails / correspondance</label>
              <input
                type="text"
                placeholder="Numéro de vol, horaire local d'arrivée..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-800"
            >
              Enregistrer l&apos;événement
            </button>
          </form>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border p-5">
          <h2 className="text-lg font-semibold mb-3">Événements &amp; vols enregistrés</h2>
          <ul className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {events.map((ev) => (
              <li
                key={ev.id}
                className={`p-3 rounded-xl border text-sm ${
                  ev.todo ? 'bg-amber-50 border-amber-300' : 'bg-slate-50'
                }`}
              >
                <div className="flex justify-between font-semibold">
                  <span>{ev.title}</span>
                  <span className="text-sky-800">{ev.date} · {ev.timeTaht} TAHT</span>
                </div>
                <div className="text-xs text-slate-700 mt-1">
                  <strong>Qui :</strong> {ev.people.join(', ')} — <strong>Lieu :</strong> {ev.place}
                </div>
                <p className="text-xs text-slate-500 mt-1">{ev.note}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
