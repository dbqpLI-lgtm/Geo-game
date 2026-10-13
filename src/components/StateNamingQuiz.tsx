import React, { useEffect, useState, useRef } from 'react';
import { MapPin, Search, CheckCircle2, RotateCcw, Eye, Trophy, Sparkles, Building2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { COUNTRY_DIVISIONS, StateItem } from '../data/geographyData';
import { useGameSettings } from '../context/GameSettingsContext';
import { getWrongGuessLimit } from '../utils/guessAttempts';

interface StateNamingQuizProps {
  onEarnXP: (amount: number) => void;
}

export const StateNamingQuiz: React.FC<StateNamingQuizProps> = ({ onEarnXP }) => {
  const { difficulty } = useGameSettings();
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('US');
  const [inputVal, setInputVal] = useState('');
  const [foundStates, setFoundStates] = useState<Set<string>>(new Set());
  const [isRevealed, setIsRevealed] = useState(false);
  const [lastGuessedState, setLastGuessedState] = useState<string | null>(null);
  const [quizMode, setQuizMode] = useState<'name-states' | 'capitals-trivia'>('name-states');
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [wrongGuessMessage, setWrongGuessMessage] = useState('');
  const guessLimit = getWrongGuessLimit(difficulty);
  const guessesRemaining = Math.max(0, guessLimit - wrongGuesses);

  // Capital Trivia state
  const [capitalQuestionIndex, setCapitalQuestionIndex] = useState(0);
  const [selectedCapitalChoice, setSelectedCapitalChoice] = useState<string | null>(null);
  const [capitalAnswerStatus, setCapitalAnswerStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setWrongGuesses(0);
    setWrongGuessMessage('');
  }, [difficulty]);

  const activeDivision = COUNTRY_DIVISIONS[selectedCountryCode] || COUNTRY_DIVISIONS.US;
  const items = activeDivision.items;
  const totalStates = items.length;
  const foundCount = items.filter((s) => foundStates.has(s.name)).length;
  const progressPercent = Math.round((foundCount / totalStates) * 100) || 0;

  const handleCountryChange = (code: string) => {
    setSelectedCountryCode(code);
    setFoundStates(new Set());
    setIsRevealed(false);
    setInputVal('');
    setCapitalQuestionIndex(0);
    setSelectedCapitalChoice(null);
    setCapitalAnswerStatus('idle');
    setWrongGuesses(0);
    setWrongGuessMessage('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputVal(raw);
    const normalized = raw.trim().toLowerCase();

    if (!normalized) return;

    for (const item of items) {
      if (foundStates.has(item.name)) continue;

      const isMatch =
        item.name.toLowerCase() === normalized ||
        (item.code && item.code.toLowerCase() === normalized) ||
        (item.aliases && item.aliases.some((a) => a.toLowerCase() === normalized));

      if (isMatch) {
        setFoundStates((prev) => new Set(prev).add(item.name));
        setInputVal('');
        setLastGuessedState(item.name);
        onEarnXP(20);

        if (foundCount + 1 >= totalStates) {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
          onEarnXP(250);
        }

        setTimeout(() => setLastGuessedState(null), 2500);
        break;
      }
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' || !inputVal.trim() || isRevealed) return;
    event.preventDefault();
    const nextWrongGuesses = wrongGuesses + 1;
    setWrongGuesses(nextWrongGuesses);
    setInputVal('');
    setWrongGuessMessage(
      nextWrongGuesses >= guessLimit
        ? 'Guess limit reached — all divisions are revealed.'
        : `That division was not recognized. ${guessLimit - nextWrongGuesses} guesses left.`,
    );
    if (nextWrongGuesses >= guessLimit) setIsRevealed(true);
  };

  const handleReset = () => {
    setFoundStates(new Set());
    setIsRevealed(false);
    setInputVal('');
    setWrongGuesses(0);
    setWrongGuessMessage('');
  };

  const handleRevealAll = () => {
    setIsRevealed(true);
  };

  // Capital Trivia Logic
  const currentCapitalQuestion = items[capitalQuestionIndex % items.length];
  // Generate 4 multiple choice options
  const capitalChoices = React.useMemo(() => {
    if (!currentCapitalQuestion) return [];
    const others = items
      .filter((s) => s.capital !== currentCapitalQuestion.capital)
      .map((s) => s.capital)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    return [currentCapitalQuestion.capital, ...others].sort(() => 0.5 - Math.random());
  }, [currentCapitalQuestion, capitalQuestionIndex]);

  const handleAnswerCapital = (choice: string) => {
    if (capitalAnswerStatus !== 'idle') return;
    setSelectedCapitalChoice(choice);

    if (choice === currentCapitalQuestion.capital) {
      setCapitalAnswerStatus('correct');
      onEarnXP(30);
      setTimeout(() => {
        setCapitalQuestionIndex((prev) => prev + 1);
        setSelectedCapitalChoice(null);
        setCapitalAnswerStatus('idle');
      }, 1400);
    } else {
      setCapitalAnswerStatus('wrong');
      setTimeout(() => {
        setCapitalQuestionIndex((prev) => prev + 1);
        setSelectedCapitalChoice(null);
        setCapitalAnswerStatus('idle');
      }, 1800);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900/80 to-slate-950 border border-amber-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Administrative Divisions
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                {activeDivision.flag} {activeDivision.countryName}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">
              Name Every State / Region in {activeDivision.countryName}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Can you name all {activeDivision.totalCount} {activeDivision.divisionTitle}? Choose your country, type states, or switch to State Capitals Trivia!
            </p>
          </div>

          {/* Country Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {Object.entries(COUNTRY_DIVISIONS).map(([code, div]) => (
              <button
                key={code}
                onClick={() => handleCountryChange(code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCountryCode === code
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span>{div.flag}</span>
                <span>{div.countryName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mode Toggle: Name States vs Capitals Trivia */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setQuizMode('name-states')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              quizMode === 'name-states'
                ? 'bg-amber-500 text-slate-950 font-extrabold'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Name States ({foundCount}/{totalStates})</span>
          </button>
          <button
            onClick={() => setQuizMode('capitals-trivia')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              quizMode === 'capitals-trivia'
                ? 'bg-amber-500 text-slate-950 font-extrabold'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Capitals Trivia Challenge</span>
          </button>
        </div>

        {quizMode === 'name-states' ? (
          <>
            {/* Typing search & controls */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  disabled={isRevealed}
                  placeholder={`Type any state/province in ${activeDivision.countryName}...`}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/90 border border-amber-500/40 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                />
                <p className="mt-2 text-xs text-slate-400" aria-live="polite">
                  {guessesRemaining} wrong guesses left{wrongGuessMessage ? ` · ${wrongGuessMessage}` : ''}
                </p>
                {lastGuessedState && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 animate-bounce">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>+20 XP: {lastGuessedState}!</span>
                  </div>
                )}
              </div>

              <div className="md:col-span-4 flex items-center justify-end gap-3">
                <button
                  onClick={handleRevealAll}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1" /> Reveal All
                </button>
                <button
                  onClick={handleReset}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-5">
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                <span>
                  Discovered: <strong className="text-amber-400 font-mono">{foundCount}</strong> of {totalStates}
                </span>
                <span className="font-mono text-amber-400">{progressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          /* Capitals Multiple Choice Challenge */
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-amber-500/30 max-w-2xl mx-auto my-2">
            <div className="flex items-center justify-between text-xs text-amber-300 mb-2">
              <span className="font-bold uppercase tracking-wider">Capital City Match</span>
              <span className="font-mono">Question {capitalQuestionIndex + 1}</span>
            </div>
            <h3 className="text-xl font-black text-white mb-4">
              What is the capital of <span className="text-amber-400">{currentCapitalQuestion?.name}</span>?
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {capitalChoices.map((choice, i) => {
                const isSelected = selectedCapitalChoice === choice;
                const isCorrect = choice === currentCapitalQuestion?.capital;

                let btnStyle = 'bg-slate-900 border-slate-700 text-slate-200 hover:border-amber-400';
                if (capitalAnswerStatus !== 'idle') {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-950 border-rose-500 text-rose-200';
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswerCapital(choice)}
                    disabled={capitalAnswerStatus !== 'idle'}
                    className={`p-3.5 rounded-xl border text-left text-sm font-semibold transition ${btnStyle}`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* State Cards Grid (When in name-states mode) */}
      {quizMode === 'name-states' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((state) => {
            const isFound = foundStates.has(state.name);
            const shouldShow = isFound || isRevealed;

            return (
              <div
                key={state.name}
                className={`p-3.5 rounded-2xl border transition-all duration-300 select-none ${
                  isFound
                    ? 'bg-amber-950/40 border-amber-500/40 shadow-md shadow-amber-900/20'
                    : isRevealed
                    ? 'bg-rose-950/30 border-rose-500/30 opacity-70'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-black/40 text-amber-300">
                    {state.code || state.name.slice(0, 2).toUpperCase()}
                  </span>
                  {isFound && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>

                <div className="font-bold text-xs truncate">
                  {shouldShow ? (
                    <span className={isFound ? 'text-white' : 'text-rose-300'}>{state.name}</span>
                  ) : (
                    <span className="text-slate-600">••••••••••</span>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 mt-1 truncate">
                  {shouldShow ? `Cap: ${state.capital}` : '••••••'}
                </div>

                {shouldShow && state.nickname && (
                  <div className="text-[9px] text-amber-400/80 mt-1 truncate italic">
                    "{state.nickname}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
