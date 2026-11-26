import React, { useState, useEffect, useMemo } from 'react';
import {
  Plane,
  Ship,
  MapPin,
  Calendar,
  Clock,
  Users,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sun,
  Compass,
  Share2,
  Download,
  Upload,
  X,
  ChevronRight,
  ChevronLeft,
  Info,
  Heart,
  Home,
  Sparkles,
  Check,
  Filter,
  UserCheck,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

// ============================================================================
// CONFIGURATION & DONNÉES INITIALES (MAI - JUILLET 2027, HEURE DE TAHITI UTC-10)
// ============================================================================

const PARTICIPANTS = [
  { id: 'martin', name: 'Martin', role: 'Hôte à Tahiti', color: 'bg-teal-600', lightBg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', initials: 'MA' },
  { id: 'lahaina', name: 'Lahaina', role: 'Hôte à Tahiti', color: 'bg-emerald-600', lightBg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', initials: 'LA' },
  { id: 'louise', name: 'Louise', role: 'Mariée 💍', color: 'bg-rose-500', lightBg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', initials: 'LO' },
  { id: 'jeremy', name: 'Jérémy', role: 'Marié 💍', color: 'bg-sky-600', lightBg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', initials: 'JÉ' },
  { id: 'morgan', name: 'Morgan', role: 'Frère de Jérémy', color: 'bg-indigo-600', lightBg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', initials: 'MO' },
  { id: 'margaux', name: 'Margaux', role: 'Copine de Morgan', color: 'bg-purple-600', lightBg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', initials: 'MX' },
  { id: 'thomas', name: 'Thomas', role: 'Frère de Margaux', color: 'bg-amber-600', lightBg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', initials: 'TH' },
];

const LOCATIONS = {
  Tahiti: {
    label: 'Tahiti',
    badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
    cellBg: 'bg-teal-500 text-white',
    dot: 'bg-teal-500',
    short: 'Tahiti',
    description: 'Chez Martin & Lahaina (Papeete / Arue / Punaauia)'
  },
  'Bora Bora': {
    label: 'Bora Bora',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
    cellBg: 'bg-sky-600 text-white',
    dot: 'bg-sky-600',
    short: 'Bora Bora',
    description: 'Lune de miel — Perle du Pacifique'
  },
  Maupiti: {
    label: 'Maupiti',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
    cellBg: 'bg-rose-500 text-white',
    dot: 'bg-rose-500',
    short: 'Maupiti',
    description: 'Lune de miel — Île authentique'
  },
  Rangiroa: {
    label: 'Rangiroa',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    cellBg: 'bg-emerald-600 text-white',
    dot: 'bg-emerald-600',
    short: 'Rangiroa',
    description: 'Lune de miel — Atoll des Tuamotu'
  },
  Fakarava: {
    label: 'Fakarava',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    cellBg: 'bg-amber-500 text-white',
    dot: 'bg-amber-500',
    short: 'Fakarava',
    description: 'Réserve de biosphère — Tuamotu'
  },
  Transit: {
    label: 'En vol / Transit',
    badgeBg: 'bg-slate-200 text-slate-800 border-slate-300',
    cellBg: 'bg-slate-600 text-white',
    dot: 'bg-slate-600',
    short: 'Transit',
    description: 'Déplacement aérien ou maritime'
  },
  France: {
    label: 'France (Gironde / Paris)',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    cellBg: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
    dot: 'bg-indigo-400',
    short: 'France',
    description: 'Métropole (Mariage en Gironde / Départ Paris)'
  }
};

// Tous les timestamps sont strictement exprimés en HEURE DE TAHITI (TAHT, UTC-10)
// Rappel : Paris (CEST, UTC+2) = Tahiti (UTC-10) + 12h00
const INITIAL_EVENTS = [
  {
    id: 'evt-mariage',
    title: 'Mariage de Louise & Jérémy en Gironde',
    type: 'activite',
    location: 'France',
    fromLocation: 'France',
    toLocation: 'France',
    startTaht: '2027-05-22T03:00', // 15h00 heure de Paris
    endTaht: '2027-05-22T17:00',   // 05h00 (+1j) heure de Paris
    parisNote: 'Samedi 22 mai 2027 en Gironde (15h00 heure locale de Paris)',
    participants: ['martin', 'lahaina', 'louise', 'jeremy', 'morgan', 'margaux', 'thomas'],
    status: 'confirmed',
    notes: 'Le grand jour en Gironde avant le départ pour le Pacifique ! Martin et Lahaina sont venus spécialement de Tahiti.',
    createdBy: 'louise'
  },
  {
    id: 'evt-vol-aller-1',
    title: 'Vol Paris Orly → Tahiti (Papeete)',
    type: 'avion',
    location: 'Tahiti',
    fromLocation: 'Paris Orly (ORY)',
    toLocation: 'Tahiti Faa’a (PPT)',
    startTaht: '2027-05-26T06:30', // Départ Paris 26 mai 18h30 CEST
    endTaht: '2027-05-27T04:50',   // Arrivée Papeete 27 mai 04h50 TAHT
    parisNote: 'Billet : Départ Paris 26 mai 18h30 → Arrivée Papeete 27 mai 04h50',
    participants: ['martin', 'lahaina', 'louise', 'jeremy'],
    status: 'confirmed',
    notes: 'Retour à la maison pour Martin & Lahaina, début du voyage de noces pour Louise & Jérémy !',
    createdBy: 'louise'
  },
  {
    id: 'evt-vol-bora',
    title: 'Vol Tahiti → Bora Bora (Motu Mute)',
    type: 'avion',
    location: 'Bora Bora',
    fromLocation: 'Tahiti (PPT)',
    toLocation: 'Bora Bora (BOB)',
    startTaht: '2027-05-27T07:15',
    endTaht: '2027-05-27T08:05',
    parisNote: 'Correspondance matinale à Papeete (2h25 d’escale)',
    participants: ['louise', 'jeremy'],
    status: 'confirmed',
    notes: 'Enchaînement direct après l’arrivée de Paris. Navette bateau jusqu’à l’hôtel.',
    createdBy: 'louise'
  },
  {
    id: 'evt-sejour-bora',
    title: 'Lune de miel à Bora Bora',
    type: 'sejour',
    location: 'Bora Bora',
    fromLocation: 'Bora Bora',
    toLocation: 'Bora Bora',
    startTaht: '2027-05-27T08:05',
    endTaht: '2027-06-01T13:40',
    parisNote: '5 nuits sur le lagon de Bora Bora',
    participants: ['louise', 'jeremy'],
    status: 'confirmed',
    notes: 'Première étape de la lune de miel de Louise et Jérémy.',
    createdBy: 'louise'
  },
  {
    id: 'evt-ferry-maupiti',
    title: 'Ferry Apetahi Express : Bora Bora → Maupiti',
    type: 'ferry',
    location: 'Maupiti',
    fromLocation: 'Bora Bora (Vaitape)',
    toLocation: 'Maupiti',
    startTaht: '2027-06-01T13:40',
    endTaht: '2027-06-01T14:55',
    parisNote: 'Traversée maritime (1h15)',
    participants: ['louise', 'jeremy'],
    status: 'confirmed',
    notes: 'Arrivée sur la petite sœur sauvage de Bora Bora.',
    createdBy: 'louise'
  },
  {
    id: 'evt-sejour-maupiti',
    title: 'Lune de miel à Maupiti',
    type: 'sejour',
    location: 'Maupiti',
    fromLocation: 'Maupiti',
    toLocation: 'Maupiti',
    startTaht: '2027-06-01T14:55',
    endTaht: '2027-06-05T06:30',
    parisNote: '4 nuits à Maupiti',
    participants: ['louise', 'jeremy'],
    status: 'confirmed',
    notes: 'Mont Teurafaatiu, plage de Tereia et raies manta.',
    createdBy: 'louise'
  },
  {
    id: 'evt-ferry-retour-bora',
    title: 'Ferry Apetahi Express : Maupiti → Bora Bora (Vaitape)',
    type: 'ferry',
    location: 'Bora Bora',
    fromLocation: 'Maupiti',
    toLocation: 'Bora Bora (Vaitape)',
    startTaht: '2027-06-05T06:30',
    endTaht: '2027-06-05T07:45',
    parisNote: 'Départ matinal en ferry vers Bora Bora Vaitape',
    participants: ['louise', 'jeremy'],
    status: 'confirmed',
    notes: 'Transfert Vaitape → aéroport Motu Mute pour le vol vers les Tuamotu.',
    createdBy: 'louise'
  },
  {
    id: 'evt-vol-rangi',
    title: 'Vol Bora Bora → Rangiroa',
    type: 'avion',
    location: 'Rangiroa',
    fromLocation: 'Bora Bora (BOB)',
    toLocation: 'Rangiroa (RGI)',
    startTaht: '2027-06-05T11:40',
    endTaht: '2027-06-05T12:55',
    parisNote: 'Vol direct Air Tahiti vers les Tuamotu',
    participants: ['louise', 'jeremy'],
    status: 'confirmed',
    notes: 'Arrivée dans le plus grand atoll de Polynésie.',
    createdBy: 'louise'
  },
  {
    id: 'evt-sejour-rangi',
    title: 'Lune de miel à Rangiroa',
    type: 'sejour',
    location: 'Rangiroa',
    fromLocation: 'Rangiroa',
    toLocation: 'Rangiroa',
    startTaht: '2027-06-05T12:55',
    endTaht: '2027-06-10T14:55',
    parisNote: '5 nuits à Rangiroa',
    participants: ['louise', 'jeremy'],
    status: 'confirmed',
    notes: 'Passe de Tiputa, Lagon Bleu et dauphins.',
    createdBy: 'louise'
  },
  {
    id: 'evt-vol-aller-2',
    title: 'Vol Paris Orly → Tahiti (Papeete)',
    type: 'avion',
    location: 'Tahiti',
    fromLocation: 'Paris Orly (ORY)',
    toLocation: 'Tahiti Faa’a (PPT)',
    startTaht: '2027-06-06T06:30', // Départ Paris 6 juin 18h30 CEST
    endTaht: '2027-06-07T04:50',   // Arrivée Papeete 7 juin 04h50 TAHT
    parisNote: 'Billet : Départ Paris dim. 6 juin 18h30 → Arrivée Papeete lun. 7 juin 04h50',
    participants: ['morgan', 'margaux', 'thomas'],
    status: 'confirmed',
    notes: 'Arrivée matinale de Morgan, Margaux et Thomas chez Martin & Lahaina !',
    createdBy: 'louise'
  },
  {
    id: 'evt-vol-rangi-tahiti',
    title: 'Vol Rangiroa → Tahiti',
    type: 'avion',
    location: 'Tahiti',
    fromLocation: 'Rangiroa (RGI)',
    toLocation: 'Tahiti Faa’a (PPT)',
    startTaht: '2027-06-10T14:55',
    endTaht: '2027-06-10T15:55',
    parisNote: 'Fin de la boucle des îles pour Louise & Jérémy',
    participants: ['louise', 'jeremy'],
    status: 'confirmed',
    notes: 'Retrouvailles au complet (les 7 !) à Tahiti chez Martin et Lahaina.',
    createdBy: 'louise'
  },
  {
    id: 'evt-sejour-tahiti-tous',
    title: 'Séjour collectif à Tahiti chez Martin & Lahaina',
    type: 'sejour',
    location: 'Tahiti',
    fromLocation: 'Tahiti',
    toLocation: 'Tahiti',
    startTaht: '2027-06-10T16:00',
    endTaht: '2027-06-24T07:00',
    parisNote: 'Toute la bande réunie sur l’île de Tahiti',
    participants: ['martin', 'lahaina', 'louise', 'jeremy', 'morgan', 'margaux', 'thomas'],
    status: 'confirmed',
    notes: 'Presqu’île de Tahiti Iti, randonnées, surf, roulottes de Vaiete et week-end à Moorea possible.',
    createdBy: 'martin'
  },
  {
    id: 'evt-vol-retour-maries',
    title: 'Vol Tahiti → Paris Orly (Retour Louise & Jérémy)',
    type: 'avion',
    location: 'France',
    fromLocation: 'Tahiti Faa’a (PPT)',
    toLocation: 'Paris Orly (ORY)',
    startTaht: '2027-06-24T07:00',
    endTaht: '2027-06-25T04:20', // 16h20 heure de Paris le 25 juin
    parisNote: 'Billet : Départ Papeete 24 juin 07h00 → Arrivée Paris 25 juin 16h20',
    participants: ['louise', 'jeremy'],
    status: 'confirmed',
    notes: 'Fin des 4 semaines en Polynésie pour les jeunes mariés.',
    createdBy: 'louise'
  },
  {
    id: 'evt-vol-retour-thomas',
    title: 'Vol retour Tahiti → Paris (Thomas) — Horaires à préciser',
    type: 'avion',
    location: 'France',
    fromLocation: 'Tahiti Faa’a (PPT)',
    toLocation: 'Paris Orly (ORY)',
    startTaht: '2027-06-26T07:00',
    endTaht: '2027-06-27T04:20',
    parisNote: 'Départ prévu 1 semaine avant Morgan & Margaux (vers le 26 juin)',
    participants: ['thomas'],
    status: 'pending',
    notes: '⚠️ Thomas : clique sur "Modifier" pour renseigner la date et l’heure exactes de ton billet retour !',
    createdBy: 'louise'
  },
  {
    id: 'evt-sejour-fakarava',
    title: 'Semaine à Fakarava (Morgan & Margaux)',
    type: 'sejour',
    location: 'Fakarava',
    fromLocation: 'Fakarava',
    toLocation: 'Fakarava',
    startTaht: '2027-06-26T10:00',
    endTaht: '2027-07-02T16:00',
    parisNote: 'Dernière semaine aux Tuamotu (dates exactes des vols internes à confirmer)',
    participants: ['morgan', 'margaux'],
    status: 'pending',
    notes: 'Passe Nord Garuae / Passe Sud Tumakohua. Morgan & Margaux : précisez vos heures de vols Air Tahiti !',
    createdBy: 'louise'
  },
  {
    id: 'evt-vol-retour-morgan',
    title: 'Vol Tahiti → Paris Orly (Retour Morgan & Margaux)',
    type: 'avion',
    location: 'France',
    fromLocation: 'Tahiti Faa’a (PPT)',
    toLocation: 'Paris Orly (ORY)',
    startTaht: '2027-07-03T07:00',
    endTaht: '2027-07-04T04:20', // 16h20 heure de Paris le 4 juillet
    parisNote: 'Billet : Départ Papeete 3 juillet 07h00 → Arrivée Paris 4 juillet 16h20',
    participants: ['morgan', 'margaux'],
    status: 'confirmed',
    notes: 'Retour en métropole après 4 semaines en Polynésie.',
    createdBy: 'louise'
  }
];

// ============================================================================
// UTILITAIRES DE DATES & FUSEAUX HORAIRES (STRICTEMENT TAHT UTC-10)
// ============================================================================

// Génère la liste des jours du 22 mai 2027 au 4 juillet 2027
function generateTripDays() {
  const days = [];
  const start = new Date(Date.UTC(2027, 4, 22)); // 22 Mai 2027
  const end = new Date(Date.UTC(2027, 6, 4));    // 4 Juillet 2027
  let curr = new Date(start);
  while (curr <= end) {
    const yyyy = curr.getUTCFullYear();
    const mm = String(curr.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(curr.getUTCDate()).padStart(2, '0');
    days.push(`${yyyy}-${mm}-${dd}`);
    curr.setUTCDate(curr.getUTCDate() + 1);
  }
  return days;
}

const ALL_TRIP_DAYS = generateTripDays();

const FRENCH_DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const FRENCH_MONTHS = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];

function formatDateFr(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.slice(0, 10).split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${FRENCH_DAYS[dt.getUTCDay()]} ${d} ${FRENCH_MONTHS[m - 1]}`;
}

function formatDateTimeTaht(isoStr) {
  if (!isoStr) return '';
  const datePart = isoStr.slice(0, 10);
  const timePart = isoStr.slice(11, 16);
  return `${formatDateFr(datePart)} à ${timePart.replace(':', 'h')}`;
}

// Convertit un ISO string en minutes depuis 2027-01-01 00:00 (comparaison pure sans décalage navigateur)
function isoToMinutes(isoStr) {
  const [datePart, timePart = '00:00'] = isoStr.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  const [hh, mm] = timePart.split(':').map(Number);
  return Math.floor(Date.UTC(y, m - 1, d, hh, mm) / 60000);
}

// Convertit une date/heure saisie en Heure de Paris (CEST, UTC+2) vers Heure de Tahiti (TAHT, UTC-10) -> -12h
function parisToTahtIso(parisIso) {
  if (!parisIso) return '';
  const [datePart, timePart = '00:00'] = parisIso.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  const [hh, mm] = timePart.split(':').map(Number);
  const utcMs = Date.UTC(y, m - 1, d, hh, mm) - 12 * 3600 * 1000;
  const dt = new Date(utcMs);
  const ny = dt.getUTCFullYear();
  const nm = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const nd = String(dt.getUTCDate()).padStart(2, '0');
  const nh = String(dt.getUTCHours()).padStart(2, '0');
  const nmin = String(dt.getUTCMinutes()).padStart(2, '0');
  return `${ny}-${nm}-${nd}T${nh}:${nmin}`;
}

// Convertit Heure de Tahiti vers Heure de Paris (+12h) pour affichage informatif
function tahtToParisIso(tahtIso) {
  if (!tahtIso) return '';
  const [datePart, timePart = '00:00'] = tahtIso.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  const [hh, mm] = timePart.split(':').map(Number);
  const utcMs = Date.UTC(y, m - 1, d, hh, mm) + 12 * 3600 * 1000;
  const dt = new Date(utcMs);
  const ny = dt.getUTCFullYear();
  const nm = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const nd = String(dt.getUTCDate()).padStart(2, '0');
  const nh = String(dt.getUTCHours()).padStart(2, '0');
  const nmin = String(dt.getUTCMinutes()).padStart(2, '0');
  return `${ny}-${nm}-${nd}T${nh}:${nmin}`;
}

/**
 * Calcule où se trouve chaque personne un jour donné (en heure de Tahiti).
 * Retourne { location: string, eventsToday: Event[], isTransition: boolean }
 */
function getPersonStatusOnDay(personId, dayStr, events) {
  const dayStartMin = isoToMinutes(`${dayStr}T00:00`);
  const dayEndMin = isoToMinutes(`${dayStr}T23:59`);
  const noonMin = isoToMinutes(`${dayStr}T12:00`);

  // Événements de la personne qui touchent cette journée
  const personEvents = events.filter(ev => ev.participants.includes(personId));
  const eventsToday = personEvents.filter(ev => {
    const s = isoToMinutes(ev.startTaht);
    const e = isoToMinutes(ev.endTaht);
    return s <= dayEndMin && e >= dayStartMin;
  });

  // 1. Vérifier s'il y a un transport (avion ou ferry) ce jour-là
  const transportsToday = eventsToday.filter(ev => ev.type === 'avion' || ev.type === 'ferry');

  // 2. Déterminer le lieu principal en fin de journée (ou à midi)
  // On cherche le dernier événement terminé ou en cours avant la fin de la journée
  let currentLocation = null;

  // Par défaut avant le départ de France :
  // Martin et Lahaina habitent à Tahiti à l'année (sauf mariage le 22 mai -> vol retour 26/27 mai)
  const isHost = personId === 'martin' || personId === 'lahaina';

  if (dayStr < '2027-05-26') {
    currentLocation = 'France'; // Mariage en Gironde le 22 mai et préparatifs
  } else if (isHost && dayStr >= '2027-05-27') {
    currentLocation = 'Tahiti'; // Résidents à Tahiti
  } else {
    currentLocation = 'France'; // Par défaut en métropole avant arrivée ou après retour
  }

  // Trier tous les événements de la personne chronologiquement pour déterminer sa position exacte à 23h59 le dayStr
  const sortedEvents = [...personEvents].sort((a, b) => isoToMinutes(a.startTaht) - isoToMinutes(b.startTaht));

  for (const ev of sortedEvents) {
    const s = isoToMinutes(ev.startTaht);
    const e = isoToMinutes(ev.endTaht);

    if (s <= dayEndMin) {
      if (ev.type === 'avion' || ev.type === 'ferry') {
        if (e <= dayEndMin) {
          // Arrivé à destination avant minuit heure de Tahiti
          currentLocation = ev.location;
        } else {
          // Toujours en vol à minuit (ex: départ 26 mai 06h30 TAHT -> arrivée 27 mai 04h50 TAHT)
          currentLocation = 'Transit';
        }
      } else if (ev.type === 'sejour') {
        if (noonMin >= s && noonMin <= e) {
          currentLocation = ev.location;
        } else if (e <= dayEndMin && e >= dayStartMin) {
          // Fin de séjour ce jour-là, un transport prend généralement le relais
          currentLocation = ev.location;
        }
      }
    }
  }

  // Cas particulier du vol retour Tahiti -> Paris :
  // Départ Papeete 07h00 TAHT le jour J -> Arrivée Paris le jour J+1 à 04h20 TAHT (16h20 Paris)
  // Le jour J, la personne est "Transit" (départ matin de Tahiti), le jour J+1 elle est en "France".
  for (const ev of sortedEvents) {
    if (ev.type === 'avion' && ev.location === 'France') {
      const s = isoToMinutes(ev.startTaht);
      const e = isoToMinutes(ev.endTaht);
      if (s >= dayStartMin && s <= dayEndMin) {
        currentLocation = 'Transit';
      } else if (e >= dayStartMin && e <= dayEndMin) {
        currentLocation = 'France';
      }
    }
  }

  return {
    location: currentLocation,
    eventsToday,
    hasPending: eventsToday.some(e => e.status === 'pending'),
    isTransition: transportsToday.length > 0
  };
}

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export default function App() {
  // État utilisateur courant (façon Tricount)
  const [currentUserId, setCurrentUserId] = useState(() => {
    try {
      return localStorage.getItem('iaorana_user_2027') || '';
    } catch {
      return '';
    }
  });
  const [showUserModal, setShowUserModal] = useState(false);

  // Événements du voyage (chargés depuis URL partagée, localStorage ou données initiales)
  const [events, setEvents] = useState(() => {
    try {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#data=')) {
        const encoded = hash.slice(6);
        const decoded = JSON.parse(decodeURIComponent(atob(encoded)));
        if (Array.isArray(decoded) && decoded.length > 0) {
          return decoded;
        }
      }
      const saved = localStorage.getItem('iaorana_events_2027');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Erreur chargement données:', e);
    }
    return INITIAL_EVENTS;
  });

  // Navigation & Filtres
  const [activeTab, setActiveTab] = useState('matrix'); // 'matrix' | 'timeline' | 'share'
  const [selectedDay, setSelectedDay] = useState('2027-06-10'); // Jour des retrouvailles à Tahiti par défaut
  const [filterPerson, setFilterPerson] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Modale ajout / édition d'événement
  const [editingEvent, setEditingEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // Toast de notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sauvegarde automatique dans localStorage
  useEffect(() => {
    try {
      localStorage.setItem('iaorana_events_2027', JSON.stringify(events));
    } catch (e) {
      console.error('Erreur sauvegarde localStorage:', e);
    }
  }, [events]);

  useEffect(() => {
    if (!currentUserId) {
      setShowUserModal(true);
    }
  }, [currentUserId]);

  const handleSelectUser = (userId) => {
    setCurrentUserId(userId);
    try {
      localStorage.setItem('iaorana_user_2027', userId);
    } catch {}
    setShowUserModal(false);
    const p = PARTICIPANTS.find(x => x.id === userId);
    if (p) showToast(`Ia ora na ${p.name} ! Profil activé.`);
  };

  const currentUser = PARTICIPANTS.find(p => p.id === currentUserId);

  // Événements nécessitant une confirmation (ex: vol retour de Thomas, Fakarava)
  const pendingEvents = useMemo(() => events.filter(e => e.status === 'pending'), [events]);

  // Liste filtrée pour la chronologie
  const filteredTimelineEvents = useMemo(() => {
    return [...events]
      .filter(ev => {
        if (filterPerson !== 'all' && !ev.participants.includes(filterPerson)) return false;
        if (filterLocation !== 'all' && ev.location !== filterLocation) return false;
        if (filterCategory === 'pending' && ev.status !== 'pending') return false;
        if (filterCategory !== 'all' && filterCategory !== 'pending' && ev.type !== filterCategory) return false;
        return true;
      })
      .sort((a, b) => isoToMinutes(a.startTaht) - isoToMinutes(b.startTaht));
  }, [events, filterPerson, filterLocation, filterCategory]);

  // Détails du jour sélectionné dans la matrice
  const selectedDayDetails = useMemo(() => {
    const statuses = PARTICIPANTS.map(p => ({
      person: p,
      ...getPersonStatusOnDay(p.id, selectedDay, events)
    }));

    const dayStartMin = isoToMinutes(`${selectedDay}T00:00`);
    const dayEndMin = isoToMinutes(`${selectedDay}T23:59`);

    const dayEvents = events
      .filter(ev => {
        const s = isoToMinutes(ev.startTaht);
        const e = isoToMinutes(ev.endTaht);
        return s <= dayEndMin && e >= dayStartMin;
      })
      .sort((a, b) => isoToMinutes(a.startTaht) - isoToMinutes(b.startTaht));

    const tahitiCount = statuses.filter(s => s.location === 'Tahiti').length;

    return { statuses, dayEvents, tahitiCount };
  }, [selectedDay, events]);

  // Ouverture modale création / édition
  const openCreateModal = (preset = {}) => {
    setEditingEvent({
      id: null,
      title: preset.title || '',
      type: preset.type || 'avion',
      location: preset.location || 'Tahiti',
      fromLocation: preset.fromLocation || '',
      toLocation: preset.toLocation || '',
      startTaht: preset.startTaht || `${selectedDay}T08:00`,
      endTaht: preset.endTaht || `${selectedDay}T10:00`,
      parisNote: preset.parisNote || '',
      participants: preset.participants || (currentUserId ? [currentUserId] : ['louise', 'jeremy']),
      status: preset.status || 'confirmed',
      notes: preset.notes || '',
      createdBy: currentUserId || 'louise'
    });
    setIsEventModalOpen(true);
  };

  const openEditModal = (ev) => {
    setEditingEvent({ ...ev });
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (eventData) => {
    if (eventData.id) {
      setEvents(prev => prev.map(e => (e.id === eventData.id ? eventData : e)));
      showToast('Étape mise à jour avec succès !');
    } else {
      const newEv = {
        ...eventData,
        id: `evt-${Date.now()}`,
        createdBy: currentUserId || 'louise'
      };
      setEvents(prev => [...prev, newEv]);
      showToast('Nouvel événement ajouté au planning !');
    }
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setIsEventModalOpen(false);
    setEditingEvent(null);
    showToast('Événement supprimé.', 'info');
  };

  const handleResetData = () => {
    setEvents(INITIAL_EVENTS);
    window.history.replaceState(null, '', window.location.pathname);
    showToast('Planning réinitialisé avec les données d’origine.');
  };

  // Partage via lien encodé dans l'URL
  const handleCopyShareLink = () => {
    try {
      const jsonStr = JSON.stringify(events);
      const encoded = btoa(encodeURIComponent(jsonStr));
      const shareUrl = `${window.location.origin}${window.location.pathname}#data=${encoded}`;
      navigator.clipboard.writeText(shareUrl);
      showToast('Lien de partage copié ! Envoie-le sur le groupe WhatsApp.');
    } catch (e) {
      showToast('Impossible de générer le lien.', 'error');
    }
  };

  // Export JSON
  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'planning-polynesie-2027.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Fichier JSON téléchargé.');
  };

  // Import JSON
  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (Array.isArray(parsed)) {
          setEvents(parsed);
          showToast('Planning importé avec succès !');
        }
      } catch {
        showToast('Fichier JSON invalide.', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      {/* ====================================================================
          HEADER LAGON POLYNÉSIEN
         ==================================================================== */}
      <header className="bg-gradient-to-r from-sky-700 via-teal-600 to-emerald-600 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          {/* Titre & Badge Fuseau Horaire */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/25 shadow-inner">
              <Sun className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                  Ia Ora Na 2027
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-100 border border-amber-300/30">
                  <Clock className="w-3 h-3" />
                  Heure de Tahiti (UTC-10)
                </span>
              </div>
              <p className="text-xs text-sky-100 hidden sm:block">
                Mariage Louise & Jérémy • Voyage en Polynésie française (22 mai – 4 juil. 2027)
              </p>
            </div>
          </div>

          {/* Actions & Sélecteur de profil (Tricount style) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => openCreateModal()}
              className="inline-flex items-center gap-1.5 bg-white text-teal-800 hover:bg-sky-50 font-semibold text-sm px-3.5 py-2 rounded-xl shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-teal-600" />
              <span>Ajouter</span>
            </button>

            <button
              onClick={() => setShowUserModal(true)}
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 px-3 py-1.5 rounded-xl text-sm font-medium transition cursor-pointer"
              title="Changer de voyageur"
            >
              {currentUser ? (
                <>
                  <span className={`w-6 h-6 rounded-full ${currentUser.color} text-white text-xs font-bold flex items-center justify-center ring-2 ring-white/60`}>
                    {currentUser.initials}
                  </span>
                  <span className="hidden md:inline">{currentUser.name}</span>
                  <RefreshCw className="w-3.5 h-3.5 text-sky-200" />
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Qui es-tu ?</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Barre d'onglets */}
        <div className="bg-black/10 backdrop-blur-xs border-t border-white/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'matrix'
                  ? 'border-amber-300 text-white bg-white/10'
                  : 'border-transparent text-sky-100 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Qui est où ? (Calendrier)</span>
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'timeline'
                  ? 'border-amber-300 text-white bg-white/10'
                  : 'border-transparent text-sky-100 hover:text-white hover:bg-white/5'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>Vols & Étapes</span>
              {pendingEvents.length > 0 && (
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-amber-400 text-slate-900 font-bold">
                  {pendingEvents.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('share')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'share'
                  ? 'border-amber-300 text-white bg-white/10'
                  : 'border-transparent text-sky-100 hover:text-white hover:bg-white/5'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Partager & Sauvegarder</span>
            </button>
          </div>
        </div>
      </header>

      {/* ====================================================================
          BANDEAU D'ALERTE POUR LES ÉLÉMENTS À COMPLÉTER (EX: VOL DE THOMAS)
         ==================================================================== */}
      {pendingEvents.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>{pendingEvents.length} info(s) à compléter :</strong>{' '}
                {pendingEvents.map(p => p.title).join(' • ')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {pendingEvents.map(pe => (
                <button
                  key={pe.id}
                  onClick={() => openEditModal(pe)}
                  className="text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg shadow-xs transition cursor-pointer"
                >
                  Compléter ({pe.participants.map(id => PARTICIPANTS.find(x => x.id === id)?.name).join(', ')})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          CONTENU PRINCIPAL
         ==================================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Note pédagogique fuseau horaire */}
        <div className="mb-5 bg-white border border-sky-100 rounded-2xl p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-600">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-800">100 % calé sur l’heure de Tahiti (UTC-10) :</span>{' '}
              Paris est à <strong>+12h</strong> en été (ex : un départ de Paris à 18h30 correspond à 06h30 le même jour à Tahiti).
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {Object.entries(LOCATIONS).map(([key, loc]) => (
              <span
                key={key}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${loc.badgeBg}`}
              >
                <span className={`w-2 h-2 rounded-full ${loc.dot}`} />
                {loc.short}
              </span>
            ))}
          </div>
        </div>

        {/* ==================================================================
            ONGLET 1 : MATRICE "QUI EST OÙ ?" + PANNEAU DÉTAIL DU JOUR
           ================================================================== */}
        {activeTab === 'matrix' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Grille Calendrier (8 colonnes sur grand écran) */}
            <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-slate-50/70">
                <div>
                  <h2 className="font-bold text-slate-800 text-base sm:text-lg">
                    Présence jour par jour (22 Mai – 4 Juillet 2027)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Clique sur une ligne pour voir le programme heure par heure à Tahiti
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedDay('2027-05-27')}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-medium cursor-pointer"
                  >
                    Arrivée Mariés (27 mai)
                  </button>
                  <button
                    onClick={() => setSelectedDay('2027-06-10')}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-medium cursor-pointer"
                  >
                    Tous à Tahiti (10 juin)
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto max-h-[68vh] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100/95 backdrop-blur-xs sticky top-0 z-10 text-xs font-semibold text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 min-w-[115px] sticky left-0 bg-slate-100 z-20">
                        Date (Tahiti)
                      </th>
                      {PARTICIPANTS.map(p => (
                        <th key={p.id} className="py-2.5 px-1.5 text-center min-w-[76px]">
                          <div className="flex flex-col items-center gap-0.5">
                            <span className={`w-6 h-6 rounded-full ${p.color} text-white text-[10px] font-bold flex items-center justify-center`}>
                              {p.initials}
                            </span>
                            <span className="text-slate-800">{p.name}</span>
                          </div>
                        </th>
                      ))}
                      <th className="py-2.5 px-2 text-center min-w-[68px]" title="Nombre de personnes présentes à Tahiti">
                        À Tahiti
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {ALL_TRIP_DAYS.map(dayStr => {
                      const isSelected = dayStr === selectedDay;
                      const rowStatuses = PARTICIPANTS.map(p => ({
                        id: p.id,
                        ...getPersonStatusOnDay(p.id, dayStr, events)
                      }));
                      const tahitiCount = rowStatuses.filter(s => s.location === 'Tahiti').length;
                      const anyTransition = rowStatuses.some(s => s.isTransition);
                      const isWeekend = ['Sam', 'Dim'].includes(formatDateFr(dayStr).slice(0, 3));

                      return (
                        <tr
                          key={dayStr}
                          onClick={() => setSelectedDay(dayStr)}
                          className={`transition cursor-pointer ${
                            isSelected
                              ? 'bg-sky-50/90 ring-2 ring-inset ring-sky-400'
                              : isWeekend
                              ? 'bg-slate-50/60 hover:bg-sky-50/40'
                              : 'hover:bg-sky-50/40'
                          }`}
                        >
                          <td className={`py-2 px-3 font-medium whitespace-nowrap sticky left-0 z-10 ${
                            isSelected ? 'bg-sky-100 text-sky-900 font-bold' : 'bg-white text-slate-700'
                          }`}>
                            <div className="flex items-center gap-1.5">
                              <span>{formatDateFr(dayStr)}</span>
                              {anyTransition && (
                                <Plane className="w-3 h-3 text-sky-600 shrink-0" title="Vol ou ferry ce jour" />
                              )}
                            </div>
                          </td>

                          {rowStatuses.map(st => {
                            const locInfo = LOCATIONS[st.location] || LOCATIONS.Tahiti;
                            return (
                              <td key={st.id} className="py-1.5 px-1 text-center">
                                <div
                                  className={`px-1.5 py-1 rounded-md text-[11px] font-semibold truncate relative ${locInfo.cellBg} ${
                                    st.hasPending ? 'ring-2 ring-amber-400' : ''
                                  }`}
                                  title={`${PARTICIPANTS.find(x => x.id === st.id)?.name} : ${locInfo.label}`}
                                >
                                  {locInfo.short}
                                  {st.isTransition && (
                                    <span className="ml-0.5 text-[9px] opacity-90">✈</span>
                                  )}
                                </div>
                              </td>
                            );
                          })}

                          <td className="py-1.5 px-2 text-center">
                            <span
                              className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                tahitiCount === 7
                                  ? 'bg-teal-600 text-white'
                                  : tahitiCount > 0
                                  ? 'bg-teal-100 text-teal-800'
                                  : 'bg-slate-100 text-slate-400'
                              }`}
                            >
                              {tahitiCount}/7
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Panneau latéral : Détail de la journée sélectionnée (4 colonnes) */}
            <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sticky top-32">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-teal-600">
                    Détail du jour (Tahiti)
                  </span>
                  <h3 className="text-xl font-bold text-slate-800 mt-0.5">
                    {formatDateFr(selectedDay)} 2027
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      const idx = ALL_TRIP_DAYS.indexOf(selectedDay);
                      if (idx > 0) setSelectedDay(ALL_TRIP_DAYS[idx - 1]);
                    }}
                    disabled={ALL_TRIP_DAYS.indexOf(selectedDay) === 0}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                    title="Jour précédent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const idx = ALL_TRIP_DAYS.indexOf(selectedDay);
                      if (idx < ALL_TRIP_DAYS.length - 1) setSelectedDay(ALL_TRIP_DAYS[idx + 1]);
                    }}
                    disabled={ALL_TRIP_DAYS.indexOf(selectedDay) === ALL_TRIP_DAYS.length - 1}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                    title="Jour suivant"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Récapitulatif par île ce jour-là */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-slate-500">
                    Où dort chacun ce soir-là ?
                  </span>
                  <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                    {selectedDayDetails.tahitiCount} à Tahiti
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {selectedDayDetails.statuses.map(({ person, location }) => {
                    const loc = LOCATIONS[location] || LOCATIONS.Tahiti;
                    return (
                      <div
                        key={person.id}
                        className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full ${person.color} text-white text-[10px] font-bold flex items-center justify-center`}>
                            {person.initials}
                          </span>
                          <span className="text-sm font-medium text-slate-800">{person.name}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${loc.badgeBg}`}>
                          {loc.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Événements & Transports de la journée */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold uppercase text-slate-500">
                    Mouvements & Activités du jour
                  </span>
                  <button
                    onClick={() => openCreateModal({ startTaht: `${selectedDay}T09:00`, endTaht: `${selectedDay}T11:00` })}
                    className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ajouter ce jour
                  </button>
                </div>

                {selectedDayDetails.dayEvents.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-3 text-center">
                    Aucun transport enregistré ce jour.
                  </p>
                ) : (
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {selectedDayDetails.dayEvents.map(ev => (
                      <div
                        key={ev.id}
                        onClick={() => openEditModal(ev)}
                        className={`p-3 rounded-xl border transition cursor-pointer ${
                          ev.status === 'pending'
                            ? 'bg-amber-50/70 border-amber-300 hover:bg-amber-50'
                            : 'bg-white border-slate-200 hover:border-sky-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-800">
                            {ev.type === 'avion' && <Plane className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                            {ev.type === 'ferry' && <Ship className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                            {ev.type === 'sejour' && <Home className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                            {ev.type === 'activite' && <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                            <span>{ev.title}</span>
                          </div>
                          <Edit3 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </div>

                        <div className="mt-1.5 text-[11px] text-slate-600 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>
                            {formatDateTimeTaht(ev.startTaht)} → {formatDateTimeTaht(ev.endTaht)} (TAHT)
                          </span>
                        </div>

                        {ev.parisNote && (
                          <div className="mt-1 text-[11px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md inline-block">
                            {ev.parisNote}
                          </div>
                        )}

                        <div className="mt-2 flex flex-wrap gap-1">
                          {ev.participants.map(pid => {
                            const p = PARTICIPANTS.find(x => x.id === pid);
                            if (!p) return null;
                            return (
                              <span key={pid} className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${p.lightBg} ${p.text}`}>
                                {p.name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            ONGLET 2 : CHRONOLOGIE DES VOLS, FERRIES & ÉTAPES
           ================================================================== */}
        {activeTab === 'timeline' && (
          <div className="space-y-5">
            {/* Barre de filtres */}
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-1">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filtres :</span>
                </div>

                {/* Filtre personne */}
                <select
                  value={filterPerson}
                  onChange={e => setFilterPerson(e.target.value)}
                  className="text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">Tous les voyageurs (7)</option>
                  {PARTICIPANTS.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
                  ))}
                </select>

                {/* Filtre île / lieu */}
                <select
                  value={filterLocation}
                  onChange={e => setFilterLocation(e.target.value)}
                  className="text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">Toutes les îles / destinations</option>
                  {Object.keys(LOCATIONS).map(loc => (
                    <option key={loc} value={loc}>{LOCATIONS[loc].label}</option>
                  ))}
                </select>

                {/* Filtre type */}
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">Tous types d’étapes</option>
                  <option value="avion">✈️ Avions uniquement</option>
                  <option value="ferry">⛴️ Ferries uniquement</option>
                  <option value="sejour">🏝️ Séjours / Hébergements</option>
                  <option value="activite">🎉 Activités / Événements</option>
                  <option value="pending">⚠️ À confirmer ({pendingEvents.length})</option>
                </select>
              </div>

              <button
                onClick={() => openCreateModal()}
                className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvel événement</span>
              </button>
            </div>

            {/* Liste des cartes chronologiques */}
            <div className="space-y-3">
              {filteredTimelineEvents.map(ev => {
                const locStyle = LOCATIONS[ev.location] || LOCATIONS.Tahiti;
                const creator = PARTICIPANTS.find(p => p.id === ev.createdBy);

                return (
                  <div
                    key={ev.id}
                    className={`bg-white rounded-2xl p-4 sm:p-5 border transition shadow-2xs ${
                      ev.status === 'pending'
                        ? 'border-amber-300 ring-2 ring-amber-100'
                        : 'border-slate-200 hover:border-sky-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${locStyle.badgeBg}`}>
                            {ev.type === 'avion' && <Plane className="w-3.5 h-3.5" />}
                            {ev.type === 'ferry' && <Ship className="w-3.5 h-3.5" />}
                            {ev.type === 'sejour' && <Home className="w-3.5 h-3.5" />}
                            {ev.type === 'activite' && <Sparkles className="w-3.5 h-3.5" />}
                            {locStyle.label}
                          </span>

                          {ev.status === 'pending' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              <AlertCircle className="w-3.5 h-3.5" />
                              À confirmer / compléter
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                              <CheckCircle2 className="w-3 h-3" />
                              Confirmé
                            </span>
                          )}

                          {creator && (
                            <span className="text-[11px] text-slate-400">
                              Ajouté par {creator.name}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-800">
                          {ev.title}
                        </h3>

                        {/* Horaires strictement en heure de Tahiti */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-700">
                          <div className="flex items-center gap-1.5 font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg">
                            <Clock className="w-4 h-4 text-teal-600" />
                            <span>
                              {formatDateTimeTaht(ev.startTaht)}
                              <ArrowRight className="w-3.5 h-3.5 inline mx-1.5 text-teal-500" />
                              {formatDateTimeTaht(ev.endTaht)} (Heure Tahiti)
                            </span>
                          </div>

                          {ev.fromLocation && ev.toLocation && ev.fromLocation !== ev.toLocation && (
                            <div className="flex items-center gap-1 text-slate-500 text-xs">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{ev.fromLocation} → {ev.toLocation}</span>
                            </div>
                          )}
                        </div>

                        {ev.parisNote && (
                          <p className="text-xs text-indigo-700 bg-indigo-50/80 border border-indigo-100 px-2.5 py-1 rounded-lg inline-block">
                            🇫🇷 Repère Paris : {ev.parisNote}
                          </p>
                        )}

                        {ev.notes && (
                          <p className="text-xs sm:text-sm text-slate-600 pt-1">
                            {ev.notes}
                          </p>
                        )}
                      </div>

                      {/* Participants & Boutons d'action */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="flex flex-wrap sm:justify-end gap-1">
                          {ev.participants.map(pid => {
                            const p = PARTICIPANTS.find(x => x.id === pid);
                            if (!p) return null;
                            return (
                              <span
                                key={pid}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${p.lightBg} ${p.text} ${p.border}`}
                              >
                                <span className={`w-2 h-2 rounded-full ${p.color}`} />
                                {p.name}
                              </span>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => openEditModal(ev)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800 transition cursor-pointer shrink-0"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Modifier</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredTimelineEvents.length === 0 && (
                <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
                  <p className="text-slate-500 text-sm">Aucune étape ne correspond à ces filtres.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================
            ONGLET 3 : PARTAGE & SAUVEGARDE (WHATSAPP / JSON / VERCEL)
           ================================================================== */}
        {activeTab === 'share' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Share2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Partager le planning à jour avec le groupe
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Dès que Thomas ou Morgan ajoute un vol, génère un lien direct à envoyer sur WhatsApp !
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 text-sm text-sky-900 space-y-2">
                <p className="font-semibold">Comment fonctionne le partage ?</p>
                <p className="text-xs sm:text-sm text-sky-800">
                  Toutes tes modifications sont enregistrées automatiquement sur ton appareil. Pour que les 6 autres voyageurs voient tes ajouts immédiatement sans création de compte, clique sur <strong>« Copier le lien avec mes modifications »</strong> et colle-le dans la conversation du voyage.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-sm transition cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Copier le lien avec mes modifications</span>
                </button>

                <button
                  onClick={handleExportJson}
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm px-4 py-3 rounded-xl transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger sauvegarde (.json)</span>
                </button>

                <label className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm px-4 py-3 rounded-xl transition cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Importer un fichier (.json)</span>
                  <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                </label>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Réinitialiser le planning d’origine</h3>
                <p className="text-xs text-slate-500">
                  Restaure uniquement les billets initiaux saisis par Louise.
                </p>
              </div>
              <button
                onClick={handleResetData}
                className="text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-xl transition cursor-pointer"
              >
                Restaurer les données initiales
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ====================================================================
          MODALE DE SÉLECTION D'IDENTITÉ ("QUI ES-TU ?" FAÇON TRICOUNT)
         ==================================================================== */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                <Sun className="w-8 h-8 text-amber-200" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800">
                Ia Ora Na ! Qui es-tu ?
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Choisis ton profil pour consulter et compléter le planning du voyage en Polynésie.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PARTICIPANTS.map(person => {
                const isCurrent = person.id === currentUserId;
                return (
                  <button
                    key={person.id}
                    onClick={() => handleSelectUser(person.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition cursor-pointer ${
                      isCurrent
                        ? 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-200'
                        : 'border-slate-200 hover:border-sky-400 hover:bg-sky-50/50'
                    }`}
                  >
                    <span className={`w-10 h-10 rounded-full ${person.color} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs`}>
                      {person.initials}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 text-sm truncate">
                        {person.name}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {person.role}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {currentUserId && (
              <div className="mt-5 text-center">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          MODALE AJOUT / MODIFICATION D'ÉVÉNEMENT (AVEC CONVERTISSEUR PARIS/TAHITI)
         ==================================================================== */}
      {isEventModalOpen && editingEvent && (
        <EventFormModal
          event={editingEvent}
          onClose={() => {
            setIsEventModalOpen(false);
            setEditingEvent(null);
          }}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      )}

      {/* ====================================================================
          TOAST NOTIFICATION
         ==================================================================== */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-medium border border-slate-700">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// COMPOSANT MODALE DE FORMULAIRE D'ÉVÉNEMENT + CONVERTISSEUR DE FUSEAU HORAIRE
// ============================================================================

function EventFormModal({ event, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({ ...event });
  const [inputTimezone, setInputTimezone] = useState('TAHT'); // 'TAHT' (UTC-10) ou 'PARIS' (UTC+2)
  const [startInput, setStartInput] = useState(event.startTaht);
  const [endInput, setEndInput] = useState(event.endTaht);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Bascule entre saisie en Heure de Tahiti ou Heure de Paris
  const handleSwitchTimezone = (tz) => {
    if (tz === inputTimezone) return;
    if (tz === 'PARIS') {
      setStartInput(tahtToParisIso(formData.startTaht));
      setEndInput(tahtToParisIso(formData.endTaht));
    } else {
      setStartInput(formData.startTaht);
      setEndInput(formData.endTaht);
    }
    setInputTimezone(tz);
  };

  const handleStartChange = (val) => {
    setStartInput(val);
    const tahtVal = inputTimezone === 'PARIS' ? parisToTahtIso(val) : val;
    setFormData(prev => ({ ...prev, startTaht: tahtVal }));
  };

  const handleEndChange = (val) => {
    setEndInput(val);
    const tahtVal = inputTimezone === 'PARIS' ? parisToTahtIso(val) : val;
    setFormData(prev => ({ ...prev, endTaht: tahtVal }));
  };

  const toggleParticipant = (pid) => {
    setFormData(prev => {
      const exists = prev.participants.includes(pid);
      const next = exists
        ? prev.participants.filter(id => id !== pid)
        : [...prev.participants, pid];
      return { ...prev, participants: next };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    const safeParticipants = formData.participants.length > 0 ? formData.participants : ['louise'];
    onSave({
      ...formData,
      participants: safeParticipants
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-lg font-extrabold text-slate-800">
            {formData.id ? 'Modifier cette étape' : 'Ajouter un vol, ferry ou séjour'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Titre */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Titre de l’étape *
            </label>
            <input
              type="text"
              required
              placeholder="Ex : Vol retour Tahiti → Paris (Thomas)"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Type & Île de destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Catégorie
              </label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="avion">✈️ Avion</option>
                <option value="ferry">⛴️ Ferry / Bateau</option>
                <option value="sejour">🏝️ Séjour / Hébergement</option>
                <option value="activite">🎉 Activité / Excursion</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Île / Lieu d’arrivée
              </label>
              <select
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {Object.keys(LOCATIONS).map(loc => (
                  <option key={loc} value={loc}>{LOCATIONS[loc].label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Convertisseur de fuseau horaire intégré */}
          <div className="p-3.5 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-600" />
                Fuseau de saisie des horaires :
              </span>
              <div className="inline-flex rounded-xl bg-white p-1 border border-sky-200">
                <button
                  type="button"
                  onClick={() => handleSwitchTimezone('TAHT')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    inputTimezone === 'TAHT'
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇵🇫 Heure Tahiti (UTC-10)
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchTimezone('PARIS')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    inputTimezone === 'PARIS'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇫🇷 Heure Paris (UTC+2)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Départ ({inputTimezone === 'TAHT' ? 'Tahiti' : 'Paris'})
                </label>
                <input
                  type="datetime-local"
                  required
                  value={startInput}
                  onChange={e => handleStartChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Arrivée / Fin ({inputTimezone === 'TAHT' ? 'Tahiti' : 'Paris'})
                </label>
                <input
                  type="datetime-local"
                  required
                  value={endInput}
                  onChange={e => handleEndChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Aperçu automatique en heure de Tahiti */}
            <div className="text-xs text-teal-900 bg-teal-100/70 px-3 py-2 rounded-xl flex items-center justify-between">
              <span>Affichage retenu (Heure de Tahiti) :</span>
              <span className="font-bold">
                {formatDateTimeTaht(formData.startTaht)} → {formatDateTimeTaht(formData.endTaht)}
              </span>
            </div>
          </div>

          {/* Sélection des participants */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase text-slate-600">
                Voyageurs concernés
              </label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, participants: PARTICIPANTS.map(p => p.id) })}
                  className="text-[11px] font-semibold text-teal-700 hover:underline cursor-pointer"
                >
                  Tous (7)
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, participants: ['louise', 'jeremy'] })}
                  className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                >
                  Mariés
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {PARTICIPANTS.map(p => {
                const active = formData.participants.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleParticipant(p.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      active
                        ? `${p.color} text-white border-transparent shadow-2xs`
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{p.name}</span>
                    {active && <Check className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Statut & Note billet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Statut de réservation
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="confirmed">✅ Confirmé / Réservé</option>
                <option value="pending">⚠️ À confirmer / Horaire provisoire</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Repère heure de Paris (optionnel)
              </label>
              <input
                type="text"
                placeholder="Ex : Départ Paris 18h30"
                value={formData.parisNote || ''}
                onChange={e => setFormData({ ...formData, parisNote: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Notes, numéro de vol ou infos pratiques
            </label>
            <textarea
              rows={2}
              placeholder="Ex : Vol Air Tahiti Nui TN07, terminal, compagnie..."
              value={formData.notes || ''}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          {/* Boutons d'action */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            {formData.id ? (
              !confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onDelete(formData.id)}
                    className="text-xs font-bold bg-rose-600 text-white px-3 py-2 rounded-xl cursor-pointer"
                  >
                    Confirmer la suppression
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="text-xs text-slate-500 hover:underline cursor-pointer"
                  >
                    Annuler
                  </button>
                </div>
              )
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition cursor-pointer"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
