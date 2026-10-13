import React, { useMemo, useState } from 'react';
import { CheckCircle2, Crown, RotateCcw, Search, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GOVERNMENT_LEADER_ROSTERS } from '../data/governmentLeaders';

interface GovernmentLeadersQuizProps {
  onEarnXP: (amount: number) => void;
}

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

export const GovernmentLeadersQuiz: React.FC<GovernmentLeadersQuizProps> = ({ onEarnXP }) => {
  const [selectedCountry, setSelectedCountry] = useState(GOVERNMENT_LEADER_ROSTERS[0].country);
  const [answer, setAnswer] = useState('');
  const [foundLeaders, setFoundLeaders] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);

  const roster = useMemo(
    () => GOVERNMENT_LEADER_ROSTERS.find((item) => item.country === selectedCountry)!,
    [selectedCountry],
  );
  const foundCount = foundLeaders.size;
  const isComplete = foundCount === roster.leaders.length;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!answer.trim() || isRevealed || isComplete) return;

    const guess = normalize(answer);
    const match = roster.leaders.find(
      (leader) =>
        !foundLeaders.has(leader.name) &&
        [leader.name, ...leader.aliases].some((name) => normalize(name) === guess),
    );

    if (!match) {
      const alreadyFound = roster.leaders.some(
        (leader) =>
          foundLeaders.has(leader.name) &&
          [leader.name, ...leader.aliases].some((name) => normalize(name) === guess),
      );
      setMessage(alreadyFound ? 'You already named that leader.' : 'Not on this roster—try another name.');
      return;
    }

    const nextFound = new Set(foundLeaders).add(match.name);
    setFoundLeaders(nextFound);
    setAnswer('');
    setMessage(`Correct: ${match.name}`);
    onEarnXP(15);

    if (nextFound.size === roster.leaders.length) {
      setMessage('You named every leader on this roster!');
      onEarnXP(100);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }
  };

  const resetQuiz = (country = selectedCountry) => {
    setSelectedCountry(country);
    setFoundLeaders(new Set());
    setAnswer('');
    setMessage('');
    setIsRevealed(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <section className="rounded-3xl border border-violet-500/30 bg-gradient-to-r from-violet-950/70 via-slate-900/80 to-slate-950 p-6 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-violet-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-violet-300">
              <Crown className="h-3.5 w-3.5" /> Government Leaders Challenge
            </span>
            <h2 className="text-2xl font-black text-white">Name Every Prime Minister</h2>
            <p className="mt-1 max-w-xl text-sm text-slate-400">
              Pick a country and name its heads of government in any order. Common short names and surnames are accepted.
            </p>
          </div>
          <label className="flex min-w-52 flex-col gap-1.5 text-xs font-bold text-slate-300">
            Choose a country
            <select
              value={selectedCountry}
              onChange={(event) => resetQuiz(event.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            >
              {GOVERNMENT_LEADER_ROSTERS.map((item) => (
                <option key={item.country} value={item.country}>{item.country}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold text-white">{roster.country}</h3>
            <p className="text-xs text-slate-400">{roster.coverage}</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-violet-300">
            <Trophy className="h-4 w-4" /> {foundCount} / {roster.leaders.length}
          </div>
        </div>

        <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky-400 transition-all"
            style={{ width: `${(foundCount / roster.leaders.length) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              autoComplete="off"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              disabled={isComplete || isRevealed}
              placeholder={`Name a prime minister of ${roster.country}...`}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:opacity-60"
            />
          </div>
          <button
            type="submit"
            disabled={!answer.trim() || isComplete || isRevealed}
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Check name
          </button>
        </form>
        <p aria-live="polite" className="mt-2 min-h-5 text-sm text-slate-400">{message}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsRevealed((value) => !value)}
            className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 transition-colors hover:border-violet-400 hover:text-white"
          >
            {isRevealed ? 'Hide answers' : 'Reveal answers'}
          </button>
          <button
            type="button"
            onClick={() => resetQuiz()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Start over
          </button>
        </div>

        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {roster.leaders.map((leader) => {
            const isFound = foundLeaders.has(leader.name);
            const isVisible = isFound || isRevealed;
            return (
              <li
                key={leader.name}
                className={`flex min-h-12 items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                  isFound
                    ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-200'
                    : isRevealed
                      ? 'border-slate-700 bg-slate-950/50 text-slate-300'
                      : 'border-slate-800 bg-slate-950/30 text-slate-500'
                }`}
              >
                {isFound && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />}
                <span>{isVisible ? leader.name : '—'}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};
