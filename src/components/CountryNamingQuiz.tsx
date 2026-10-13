import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Globe2, Search, Trophy, CheckCircle2, HelpCircle, Sparkles, Filter, Clock, RotateCcw, Info, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALL_197_COUNTRIES, CountryFullItem } from '../data/all197Countries';
import { useGameSettings } from '../context/GameSettingsContext';
import { getCurrencyDisplayName } from '../utils/currencyName';
import { FlagImage } from './FlagImage';

const CountryDiscoveryMap = React.lazy(() =>
  import('./CountryDiscoveryMap').then((module) => ({ default: module.CountryDiscoveryMap }))
);

interface CountryNamingQuizProps {
  onEarnXP: (amount: number) => void;
}

export const CountryNamingQuiz: React.FC<CountryNamingQuizProps> = ({ onEarnXP }) => {
  const { difficulty, hintsAllowed, isLearningMode } = useGameSettings();
  const defaultSeconds = isLearningMode ? 9999 : difficulty === 'easy' ? 600 : difficulty === 'hard' ? 120 : 300;
  const [selectedContinent, setSelectedContinent] = useState<string>('All');
  const [inputGuess, setInputGuess] = useState('');
  const [foundCountries, setFoundCountries] = useState<Set<string>>(new Set());
  const [isGameActive, setIsGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isTimedMode, setIsTimedMode] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedCountryModal, setSelectedCountryModal] = useState<CountryFullItem | null>(null);
  const [lastGuessedCountry, setLastGuessedCountry] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Filter countries by continent
  const availableCountries = ALL_197_COUNTRIES.filter((c) => {
    if (selectedContinent === 'All') return true;
    if (selectedContinent === 'Americas') return c.continent === 'North America' || c.continent === 'South America';
    return c.continent === selectedContinent;
  });

  const totalCount = availableCountries.length;
  const foundCount = availableCountries.filter((c) => foundCountries.has(c.code)).length;
  const progressPercent = Math.round((foundCount / totalCount) * 100) || 0;

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimedMode && isGameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isGameActive) {
      setIsGameActive(false);
      setIsRevealed(true);
    }
    return () => clearInterval(timer);
  }, [isTimedMode, isGameActive, timeLeft]);

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    setInputGuess(rawVal);
    const normalized = rawVal.trim().toLowerCase();

    if (!normalized) return;

    // Check against available countries
    for (const country of availableCountries) {
      if (foundCountries.has(country.code)) continue;

      const isMatch =
        country.name.toLowerCase() === normalized ||
        country.aliases.some((alias) => alias.toLowerCase() === normalized);

      if (isMatch) {
        // MATCH!
        setFoundCountries((prev) => new Set(prev).add(country.code));
        setInputGuess('');
        setLastGuessedCountry(country.name);
        onEarnXP(25);

        // Check if finished
        if (foundCount + 1 >= totalCount) {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
          onEarnXP(200);
        }

        setTimeout(() => setLastGuessedCountry(null), 2500);
        break;
      }
    }
  };

  const handleStartGame = (timed: boolean) => {
    setIsTimedMode(timed);
    setTimeLeft(defaultSeconds);
    setFoundCountries(new Set());
    setIsRevealed(false);
    setIsGameActive(true);
    setInputGuess('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleReset = () => {
    setFoundCountries(new Set());
    setIsRevealed(false);
    setIsGameActive(false);
    setInputGuess('');
    setTimeLeft(defaultSeconds);
  };

  const handleRevealAll = () => {
    setIsRevealed(true);
    setIsGameActive(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Controls Banner */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900/80 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5" /> Global Roster Quiz
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                {selectedContinent}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">Name Every Country Challenge</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Type the country names in this roster as fast as you can. No need to press enter—our cartographic engine recognizes them in real time!
            </p>
          </div>

          {/* Continent Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:block mr-1" />
            {['All', 'Europe', 'Asia', 'Africa', 'Americas', 'Oceania'].map((cont) => {
              const continentFilterKey = cont === 'Americas' ? 'North America' : cont;
              const isSelected = selectedContinent === cont;
              return (
                <button
                  key={cont}
                  onClick={() => {
                    setSelectedContinent(cont === 'Americas' ? 'North America' : cont);
                    setFoundCountries(new Set());
                    setIsRevealed(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {cont}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Input & Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Input Box (8 Cols) */}
          <div className="md:col-span-8 relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={inputGuess}
                onChange={handleInputChange}
                disabled={isRevealed}
                placeholder="Type any country name (e.g. France, Japan, Brazil, Germany)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/90 border border-indigo-500/40 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 shadow-inner"
              />
            </div>
            {lastGuessedCountry && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 animate-bounce">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>+25 XP: {lastGuessedCountry}!</span>
              </div>
            )}
          </div>

          {/* Controls & Timer (4 Cols) */}
          <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-3">
            {isTimedMode && (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold font-mono">
                <Clock className="w-4 h-4 text-rose-400" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}

            <button
              onClick={() => handleStartGame(true)}
              className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm"
            >
              {difficulty === 'easy' ? '10m Relaxed' : difficulty === 'hard' ? '2m Hard Blitz' : '5m Blitz'}
            </button>

            <button
              onClick={handleRevealAll}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Reveal All
            </button>

            <button
              onClick={handleReset}
              title="Reset"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
            <span>
              Discovered: <strong className="text-indigo-400 font-mono">{foundCount}</strong> of {totalCount} countries
            </span>
            <span className="font-mono text-indigo-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="h-[320px] animate-pulse rounded-3xl border border-slate-800 bg-slate-900 sm:h-[440px]" />}>
        <CountryDiscoveryMap discoveredCountryCodes={foundCountries} />
      </Suspense>

      {/* Country Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {availableCountries.map((country) => {
          const isFound = foundCountries.has(country.code);
          const shouldShow = isFound || isRevealed;

          return (
            <div
              key={country.code}
              onClick={() => shouldShow && setSelectedCountryModal(country)}
              className={`p-3.5 rounded-2xl border transition-all duration-300 relative select-none ${
                isFound
                  ? 'bg-emerald-950/40 border-emerald-500/40 hover:border-emerald-400 shadow-md shadow-emerald-900/20 cursor-pointer'
                  : isRevealed
                  ? 'bg-rose-950/30 border-rose-500/30 opacity-70 cursor-pointer'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                {shouldShow ? (
                  <FlagImage
                    countryCode={country.code}
                    emoji={country.flag}
                    alt={`${country.name} flag`}
                    className="h-7 w-10 rounded object-contain"
                  />
                ) : (
                  <span className="text-2xl">🌐</span>
                )}
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-400 border border-white/5">
                  {country.code}
                </span>
              </div>

              <div className="font-bold text-xs truncate">
                {shouldShow ? (
                  <span className={isFound ? 'text-white' : 'text-rose-300'}>{country.name}</span>
                ) : (
                  <span className="text-slate-600">••••••••••</span>
                )}
              </div>

              <div className="text-[10px] text-slate-400 mt-1 truncate">
                {shouldShow ? `Cap: ${country.capital}` : country.continent}
              </div>

              {shouldShow && (
                <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-400">
                  <span>Pop: {country.population}</span>
                  <Info className="w-3 h-3 text-slate-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Encyclopedic Country Detail Modal */}
      {selectedCountryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white">
            <button
              onClick={() => setSelectedCountryModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <FlagImage
                key={selectedCountryModal.code}
                countryCode={selectedCountryModal.code}
                emoji={selectedCountryModal.flag}
                alt={`${selectedCountryModal.name} flag`}
                className="h-14 w-20 rounded object-contain"
              />
              <div>
                <h3 className="text-2xl font-black text-white">{selectedCountryModal.name}</h3>
                <span className="text-xs text-indigo-400 font-semibold">
                  {selectedCountryModal.continent} • Capital: {selectedCountryModal.capital}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 font-semibold">Population</span>
                <div className="text-sm font-bold text-white mt-0.5">{selectedCountryModal.population}</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 font-semibold">Surface Area</span>
                <div className="text-sm font-bold text-white mt-0.5">
                  {selectedCountryModal.areaKm2.toLocaleString()} km²
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[9px] uppercase text-amber-400 font-bold">Currency</span>
                <div className="text-xs font-bold text-white mt-0.5 truncate">{getCurrencyDisplayName(selectedCountryModal.currency)}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[9px] uppercase text-sky-400 font-bold">Language</span>
                <div className="text-xs font-bold text-white mt-0.5 truncate">{selectedCountryModal.language}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[9px] uppercase text-purple-400 font-bold">Religion</span>
                <div className="text-xs font-bold text-white mt-0.5 truncate">{selectedCountryModal.religion}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <div className="font-bold text-amber-400 mb-1">Geographic Fact & Lore</div>
              <p className="text-slate-300">{selectedCountryModal.funFact}</p>
              {selectedCountryModal.nickname && (
                <div className="mt-2 text-indigo-300 font-medium">
                  Nickname: "{selectedCountryModal.nickname}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
