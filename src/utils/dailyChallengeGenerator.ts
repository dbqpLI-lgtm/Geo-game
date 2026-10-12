import { ALL_196_COUNTRIES, CountryFullItem } from '../data/all196Countries';
import { PHYSICAL_GEOGRAPHY_ITEMS } from '../data/geographyData';
import { COUNTRY_NICKNAMES_LIST } from '../data/outlinesAndGeoData';

export interface DailyQuestion {
  id: number;
  category: 'Capitals' | 'Flags' | 'Currency' | 'Physical Geography' | 'Nicknames';
  categoryBadge: string;
  categoryIcon: string;
  question: string;
  flagOrVisual?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Simple deterministic hash based on date string (YYYY-MM-DD)
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function getTimeUntilMidnight(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const diffMs = tomorrow.getTime() - now.getTime();
  const totalSecs = Math.max(0, Math.floor(diffMs / 1000));
  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;
  return { hours, minutes, seconds };
}

export function generateDailyChallenge(dateStr: string): DailyQuestion[] {
  // Convert date string into a numerical seed
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed = (seed * 31 + dateStr.charCodeAt(i)) % 1000000;
  }

  const countries = ALL_196_COUNTRIES;

  // 1. Capital question
  const c1Index = Math.floor(pseudoRandom(seed + 1) * countries.length);
  const c1 = countries[c1Index];
  const c1Distractors = countries
    .filter((c) => c.capital !== c1.capital)
    .sort((a, b) => pseudoRandom(seed + a.name.length) - pseudoRandom(seed + b.name.length))
    .slice(0, 3)
    .map((c) => c.capital);
  const c1Options = [c1.capital, ...c1Distractors].sort(
    (a, b) => pseudoRandom(seed + a.charCodeAt(0)) - pseudoRandom(seed + b.charCodeAt(0))
  );
  const q1: DailyQuestion = {
    id: 1,
    category: 'Capitals',
    categoryBadge: 'Seat of Government',
    categoryIcon: '🏛️',
    question: `What is the official capital city of ${c1.name}?`,
    flagOrVisual: c1.flag,
    options: c1Options,
    correctIndex: c1Options.indexOf(c1.capital),
    explanation: `${c1.capital} is the official capital of ${c1.name} (${c1.continent}). ${c1.funFact}`,
  };

  // 2. Flag Question
  const c2Index = Math.floor(pseudoRandom(seed + 2) * countries.length);
  const c2 = countries[c2Index];
  const c2Distractors = countries
    .filter((c) => c.name !== c2.name)
    .sort((a, b) => pseudoRandom(seed + 10 + a.name.length) - pseudoRandom(seed + 10 + b.name.length))
    .slice(0, 3)
    .map((c) => c.name);
  const c2Options = [c2.name, ...c2Distractors].sort(
    (a, b) => pseudoRandom(seed + 20 + a.charCodeAt(0)) - pseudoRandom(seed + 20 + b.charCodeAt(0))
  );
  const q2: DailyQuestion = {
    id: 2,
    category: 'Flags',
    categoryBadge: 'National Banner',
    categoryIcon: '🚩',
    question: `Which sovereign nation does this national banner belong to?`,
    flagOrVisual: c2.flag,
    options: c2Options,
    correctIndex: c2Options.indexOf(c2.name),
    explanation: `This is the official flag of ${c2.name}. Pop: ${c2.population}, Capital: ${c2.capital}.`,
  };

  // 3. Currency Question
  const c3Index = Math.floor(pseudoRandom(seed + 3) * countries.length);
  const c3 = countries[c3Index];
  const c3Distractors = countries
    .filter((c) => c.currency !== c3.currency)
    .map((c) => c.currency)
    .filter((curr, idx, arr) => arr.indexOf(curr) === idx)
    .slice(0, 3);
  const c3Options = [c3.currency, ...c3Distractors].sort(
    (a, b) => pseudoRandom(seed + 30 + a.charCodeAt(0)) - pseudoRandom(seed + 30 + b.charCodeAt(0))
  );
  const q3: DailyQuestion = {
    id: 3,
    category: 'Currency',
    categoryBadge: 'Global Money',
    categoryIcon: '💰',
    question: `What currency is officially used in ${c3.name}?`,
    flagOrVisual: c3.flag,
    options: c3Options,
    correctIndex: c3Options.indexOf(c3.currency),
    explanation: `${c3.name} officially utilizes the ${c3.currency}. Official language: ${c3.language}.`,
  };

  // 4. Physical Geography Question
  const physIndex = Math.floor(pseudoRandom(seed + 4) * PHYSICAL_GEOGRAPHY_ITEMS.length);
  const phys = PHYSICAL_GEOGRAPHY_ITEMS[physIndex];
  const q4: DailyQuestion = {
    id: 4,
    category: 'Physical Geography',
    categoryBadge: 'Natural Earth Wonder',
    categoryIcon: '🏔️',
    question: phys.quizQuestion,
    options: phys.options,
    correctIndex: phys.correctIndex,
    explanation: `${phys.name}: ${phys.detail} (${phys.record}).`,
  };

  // 5. Nickname Question
  const nickIndex = Math.floor(pseudoRandom(seed + 5) * COUNTRY_NICKNAMES_LIST.length);
  const nick = COUNTRY_NICKNAMES_LIST[nickIndex];
  const q5: DailyQuestion = {
    id: 5,
    category: 'Nicknames',
    categoryBadge: 'Cultural Moniker',
    categoryIcon: '🏷️',
    question: `Which country is famously nicknamed "${nick.nickname}"?`,
    flagOrVisual: nick.flag,
    options: nick.options,
    correctIndex: nick.options.indexOf(nick.country),
    explanation: `${nick.country} (${nick.flag}): ${nick.explanation}`,
  };

  return [q1, q2, q3, q4, q5];
}
