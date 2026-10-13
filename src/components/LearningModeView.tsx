import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  RotateCcw,
  Volume2,
  Sparkles,
  Building2,
  Coins,
  Languages,
  Church,
  Users,
  Compass,
  ArrowRight,
  Eye,
  Check,
  Star,
  Award,
} from 'lucide-react';
import { ALL_197_COUNTRIES, CountryFullItem } from '../data/all197Countries';
import { FlagImage } from './FlagImage';
import { getCurrencyDisplayName } from '../utils/currencyName';

interface LearningModeViewProps {
  onStartQuiz: () => void;
}

export const LearningModeView: React.FC<LearningModeViewProps> = ({ onStartQuiz }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [activeTab, setActiveTab] = useState<'flashcards' | 'atlas' | 'cheatsheet'>('flashcards');

  // Flashcard Deck State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCountries, setMasteredCountries] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('geomaster_mastered_countries');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Selected Country for Detailed Modal/Dossier
  const [selectedCountry, setSelectedCountry] = useState<CountryFullItem | null>(null);

  // Filtered Country List
  const filteredCountries = useMemo(() => {
    return ALL_197_COUNTRIES.filter((c) => {
      const matchesContinent =
        selectedContinent === 'All' ||
        (selectedContinent === 'Americas'
          ? c.continent === 'North America' || c.continent === 'South America'
          : c.continent === selectedContinent);

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q) ||
        c.currency.toLowerCase().includes(q) ||
        c.language.toLowerCase().includes(q) ||
        c.religion.toLowerCase().includes(q);

      return matchesContinent && matchesQuery;
    });
  }, [selectedContinent, searchQuery]);

  const currentFlashcard = filteredCountries[currentCardIndex % (filteredCountries.length || 1)];

  // Text to Speech
  const speakCountry = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleMastered = (code: string) => {
    setMasteredCountries((prev) => {
      const updated = new Set(prev);
      if (updated.has(code)) {
        updated.delete(code);
      } else {
        updated.add(code);
      }
      try {
        localStorage.setItem('geomaster_mastered_countries', JSON.stringify(Array.from(updated)));
      } catch {}
      return updated;
    });
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % filteredCountries.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + filteredCountries.length) % filteredCountries.length);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950/70 via-slate-900/90 to-indigo-950/70 border border-purple-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border border-purple-500/40">
              <BookOpen className="w-3.5 h-3.5" /> Interactive Atlas & Learning Desk
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
              Study Mode • 0 Pressure
            </span>
          </div>
          <h2 className="text-2xl font-black text-white">Master All 196 World Nations</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Learn capitals, currencies, languages, religions, and flag layouts with flashcards and interactive reference tools at your own pace.
          </p>
        </div>

        {/* Study Progress */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-purple-500/30 text-purple-300 text-xs font-bold shadow-sm">
            <div className="text-[10px] text-slate-400 uppercase leading-none mb-1">Mastered Nations</div>
            <div className="text-base font-black text-white flex items-center gap-1.5 leading-none">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{masteredCountries.size} / 196</span>
              <span className="text-[10px] text-slate-400 font-normal">
                ({Math.round((masteredCountries.size / 196) * 100)}%)
              </span>
            </div>
          </div>

          <button
            onClick={onStartQuiz}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-purple-600/30 active:scale-95"
          >
            <span>Test in Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-3 backdrop-blur-md">
        {/* Study Tools View Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'flashcards'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🗂️ Flashcard Desk
          </button>
          <button
            onClick={() => setActiveTab('atlas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'atlas'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🌍 Interactive Atlas
          </button>
          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'cheatsheet'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 Quick Reference Matrix
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search country, capital, currency..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
          />
        </div>
      </div>

      {/* Continent Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {['All', 'Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania'].map(
          (continent) => (
            <button
              key={continent}
              onClick={() => {
                setSelectedContinent(continent);
                setCurrentCardIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedContinent === continent
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {continent}
            </button>
          )
        )}
      </div>

      {/* TAB 1: FLASHCARD DESK */}
      {activeTab === 'flashcards' && currentFlashcard && (
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Card {currentCardIndex + 1} of {filteredCountries.length}
            </span>
            <span className="font-semibold text-purple-300">
              {currentFlashcard.continent}
            </span>
          </div>

          {/* Flip Flashcard */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-tr from-slate-900 via-slate-900/90 to-slate-800 border-2 border-purple-500/40 hover:border-purple-400 rounded-3xl p-8 backdrop-blur-xl shadow-2xl cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between select-none"
          >
            {/* Top Indicator */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {isFlipped ? 'Back (Answer & Profile)' : 'Front (Prompt)'}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speakCountry(`${currentFlashcard.name}. Capital is ${currentFlashcard.capital}.`);
                }}
                className="p-1.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition"
                title="Pronounce"
              >
                <Volume2 className="w-4 h-4 text-purple-300" />
              </button>
            </div>

            {/* Front of Card: Flag & Country Name */}
            {!isFlipped ? (
              <div className="text-center my-auto space-y-3">
                <FlagImage
                  key={currentFlashcard.code}
                  countryCode={currentFlashcard.code}
                  emoji={currentFlashcard.flag}
                  alt={`${currentFlashcard.name} flag`}
                  className="mx-auto h-32 w-48 rounded-lg object-contain drop-shadow-2xl"
                />
                <h3 className="text-3xl font-black text-white">{currentFlashcard.name}</h3>
                {currentFlashcard.nickname && (
                  <p className="text-xs text-amber-300 font-medium italic">
                    "{currentFlashcard.nickname}"
                  </p>
                )}
                <div className="pt-2">
                  <span className="text-[11px] px-3 py-1 rounded-full bg-slate-800/80 text-slate-400 font-semibold">
                    Tap to flip and reveal facts ↻
                  </span>
                </div>
              </div>
            ) : (
              /* Back of Card: Complete Geographic Dossier */
              <div className="my-auto space-y-4 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <FlagImage
                    countryCode={currentFlashcard.code}
                    emoji={currentFlashcard.flag}
                    alt={`${currentFlashcard.name} flag`}
                    className="h-8 w-12 rounded object-contain"
                  />
                  <div>
                    <h3 className="text-2xl font-black text-white">{currentFlashcard.name}</h3>
                    <span className="text-xs text-purple-300">{currentFlashcard.continent}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                      <Building2 className="w-3.5 h-3.5 text-blue-400" /> Capital
                    </span>
                    <strong className="text-white text-sm">{currentFlashcard.capital}</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                      <Coins className="w-3.5 h-3.5 text-amber-400" /> Currency
                    </span>
                    <strong className="text-white text-sm">{getCurrencyDisplayName(currentFlashcard.currency)}</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                      <Languages className="w-3.5 h-3.5 text-emerald-400" /> Official Language
                    </span>
                    <strong className="text-white text-sm">{currentFlashcard.language}</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                      <Church className="w-3.5 h-3.5 text-purple-400" /> Major Religion
                    </span>
                    <strong className="text-white text-sm">{currentFlashcard.religion}</strong>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                  <span className="text-slate-400 block mb-0.5 font-bold uppercase text-[10px]">
                    Did you know?
                  </span>
                  <p className="text-slate-300 italic text-[11px]">{currentFlashcard.funFact}</p>
                </div>
              </div>
            )}

            {/* Bottom Controls */}
            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-500 font-mono">
                Pop: {currentFlashcard.population}
              </span>
              <span className="text-slate-500">Click to flip</span>
            </div>
          </div>

          {/* Flashcard Action Buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handlePrevCard}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
            >
              Previous Card
            </button>

            <button
              onClick={() => toggleMastered(currentFlashcard.code)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                masteredCountries.has(currentFlashcard.code)
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/40'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {masteredCountries.has(currentFlashcard.code)
                  ? 'Mastered ✅'
                  : 'Mark as Mastered'}
              </span>
            </button>

            <button
              onClick={handleNextCard}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-md shadow-purple-600/25"
            >
              Next Card
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE ATLAS (Grid of All Nations) */}
      {activeTab === 'atlas' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredCountries.map((c) => {
            const isMastered = masteredCountries.has(c.code);
            return (
              <div
                key={c.code}
                onClick={() => setSelectedCountry(c)}
                className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer backdrop-blur-md group"
              >
                <div className="flex items-start justify-between mb-2">
                  <FlagImage
                    countryCode={c.code}
                    emoji={c.flag}
                    alt={`${c.name} flag`}
                    className="h-10 w-14 rounded object-contain drop-shadow group-hover:scale-110 transition-transform"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMastered(c.code);
                    }}
                    className={`p-1.5 rounded-lg transition ${
                      isMastered
                        ? 'text-emerald-400 bg-emerald-500/20'
                        : 'text-slate-600 hover:text-slate-300'
                    }`}
                    title={isMastered ? 'Mastered' : 'Mark as Mastered'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                  {c.name}
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3 h-3 text-blue-400" />
                  <span>{c.capital}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between border-t border-slate-800/60 pt-2">
                  <span>{c.continent}</span>
                  <span className="font-mono text-amber-400/80">{getCurrencyDisplayName(c.currency)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: QUICK REFERENCE MATRIX (Table View) */}
      {activeTab === 'cheatsheet' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Flag</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">Capital</th>
                  <th className="py-3 px-4">Currency</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Religion</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCountries.map((c) => {
                  const isMastered = masteredCountries.has(c.code);
                  return (
                    <tr
                      key={c.code}
                      onClick={() => setSelectedCountry(c)}
                      className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 px-4">
                        <FlagImage countryCode={c.code} emoji={c.flag} alt={`${c.name} flag`} className="h-6 w-9 rounded object-contain" />
                      </td>
                      <td className="py-2.5 px-4 font-bold text-white">{c.name}</td>
                      <td className="py-2.5 px-4 text-sky-300">{c.capital}</td>
                      <td className="py-2.5 px-4 text-amber-300">{getCurrencyDisplayName(c.currency)}</td>
                      <td className="py-2.5 px-4 text-emerald-300">{c.language}</td>
                      <td className="py-2.5 px-4 text-purple-300">{c.religion}</td>
                      <td className="py-2.5 px-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMastered(c.code);
                          }}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isMastered
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isMastered ? 'Mastered' : 'Study'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected Country Detailed Modal */}
      {selectedCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setSelectedCountry(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/80"
            >
              ✕
            </button>

            <div className="flex items-center gap-4">
              <FlagImage
                key={selectedCountry.code}
                countryCode={selectedCountry.code}
                emoji={selectedCountry.flag}
                alt={`${selectedCountry.name} flag`}
                className="h-14 w-20 rounded object-contain drop-shadow"
              />
              <div>
                <h3 className="text-2xl font-black text-white">{selectedCountry.name}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold">
                  {selectedCountry.continent}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block mb-0.5 font-semibold">Capital City</span>
                <strong className="text-white text-sm">{selectedCountry.capital}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block mb-0.5 font-semibold">Official Currency</span>
                <strong className="text-white text-sm">{getCurrencyDisplayName(selectedCountry.currency)}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block mb-0.5 font-semibold">Language</span>
                <strong className="text-white text-sm">{selectedCountry.language}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block mb-0.5 font-semibold">Religion</span>
                <strong className="text-white text-sm">{selectedCountry.religion}</strong>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
              <span className="text-amber-400 font-bold uppercase text-[10px]">
                Encyclopedic Fact
              </span>
              <p className="text-slate-300 italic">{selectedCountry.funFact}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => speakCountry(`${selectedCountry.name}. Capital: ${selectedCountry.capital}.`)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:text-white"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear Pronunciation</span>
              </button>

              <button
                onClick={() => {
                  toggleMastered(selectedCountry.code);
                  setSelectedCountry(null);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
              >
                {masteredCountries.has(selectedCountry.code) ? 'Mastered ✅' : 'Mark as Mastered'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
