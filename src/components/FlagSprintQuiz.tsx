import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Zap,
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  Flame,
  HelpCircle,
  Keyboard,
  ListFilter,
  Clock,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALL_197_COUNTRIES, CountryFullItem } from '../data/all197Countries';
import { useGameSettings } from '../context/GameSettingsContext';
import { FlagImage } from './FlagImage';
import { selectCountryQuizPool } from '../utils/countryQuizPool';
import { getWrongGuessLimit } from '../utils/guessAttempts';

interface FlagSprintQuizProps {
  onEarnXP: (amount: number) => void;
}

export const FlagSprintQuiz: React.FC<FlagSprintQuizProps> = ({ onEarnXP }) => {
  const { difficulty, hintsAllowed, isLearningMode, getTimeLimit } = useGameSettings();
  const [selectedContinent, setSelectedContinent] = useState<string>('All');
  const [quizInputType, setQuizInputType] = useState<'type' | 'choice'>('type');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedGuess, setTypedGuess] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [wrongGuesses, setWrongGuesses] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // Time limit based on difficulty: Easy (30s), Medium (15s), Hard (6s blitz)
  const timeLimitForFlag = isLearningMode ? 9999 : difficulty === 'easy' ? 30 : difficulty === 'medium' ? 15 : 6;
  const guessLimit = getWrongGuessLimit(difficulty);
  const [timeLeft, setTimeLeft] = useState(timeLimitForFlag);

  // Filter pool by continent
  const continentPool = useMemo(() => {
    return ALL_197_COUNTRIES.filter((c) => {
      if (selectedContinent === 'All') return true;
      if (selectedContinent === 'Americas') return c.continent === 'North America' || c.continent === 'South America';
      return c.continent === selectedContinent;
    });
  }, [selectedContinent]);

  // Select a difficulty-sized round from the selected region.
  const [roundList, setRoundList] = useState<CountryFullItem[]>([]);

  const startNewRound = () => {
    const shuffled = selectCountryQuizPool(continentPool, difficulty);
    setRoundList(shuffled);
    setCurrentIndex(0);
    setTypedGuess('');
    setSelectedChoice(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
    setWrongGuesses(0);
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
    setTimeLeft(timeLimitForFlag);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    startNewRound();
  }, [continentPool, quizInputType, difficulty, isLearningMode]);

  // Reset timer on question change
  useEffect(() => {
    setTimeLeft(timeLimitForFlag);
    setShowHint(false);
  }, [currentIndex, difficulty, isLearningMode]);

  // Countdown timer effect
  useEffect(() => {
    if (isLearningMode || isAnswered || isGameOver) return;

    if (timeLeft <= 0) {
      // Time up!
      setIsAnswered(true);
      setIsCorrect(false);
      setSelectedChoice('__TIME_UP__');
      setStreak(0);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, isGameOver, isLearningMode]);

  const currentCountry: CountryFullItem | undefined = roundList[currentIndex];

  // 4 multiple-choice options (when in choice mode)
  const choices = useMemo(() => {
    if (!currentCountry) return [];
    const others = continentPool
      .filter((c) => c.name !== currentCountry.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((c) => c.name);

    return [currentCountry.name, ...others].sort(() => 0.5 - Math.random());
  }, [currentCountry, currentIndex, continentPool]);

  // Normalization for typing recognition
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');

  const checkAnswerCorrectness = (guess: string) => {
    if (!currentCountry) return false;
    const cleanGuess = normalize(guess);
    const cleanName = normalize(currentCountry.name);
    if (cleanGuess === cleanName) return true;

    // Check aliases
    if (currentCountry.aliases.some((alias) => normalize(alias) === cleanGuess)) {
      return true;
    }

    // Special common shorthands
    const commonAliases: Record<string, string[]> = {
      'United States': ['usa', 'us', 'america', 'unitedstatesofamerica'],
      'United Kingdom': ['uk', 'britain', 'greatbritain', 'england'],
      'United Arab Emirates': ['uae', 'emirates'],
      'Democratic Republic of the Congo': ['drc', 'drcongo', 'congokinshasa'],
      'Republic of the Congo': ['congo', 'congobrazzaville'],
      'South Korea': ['korea', 'republicofkorea'],
      'North Korea': ['dprk'],
      'Central African Republic': ['car'],
      'Dominican Republic': ['dr', 'dominicana'],
      'Saint Vincent and the Grenadines': ['stvincent'],
      'Saint Kitts and Nevis': ['stkitts'],
      'Saint Lucia': ['stlucia'],
    };

    if (commonAliases[currentCountry.name]) {
      return commonAliases[currentCountry.name].includes(cleanGuess);
    }

    return false;
  };

  // Handle typing input change (instant recognition)
  const handleTypingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTypedGuess(val);

    if (checkAnswerCorrectness(val)) {
      triggerSuccess();
    }
  };

  const handleTypingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered) {
      handleNext();
      return;
    }
    if (checkAnswerCorrectness(typedGuess)) {
      triggerSuccess();
    } else {
      const nextWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(nextWrongGuesses);
      setTypedGuess('');
      if (nextWrongGuesses >= guessLimit) {
        setIsAnswered(true);
        setIsCorrect(false);
        setStreak(0);
      }
    }
  };

  const handleChoiceSelect = (choice: string) => {
    if (isAnswered || !currentCountry) return;
    setSelectedChoice(choice);
    setIsAnswered(true);

    const correct = choice === currentCountry.name;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      onEarnXP(25 + nextStreak * 5);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      setStreak(0);
    }
  };

  const triggerSuccess = () => {
    setIsAnswered(true);
    setIsCorrect(true);
    setScore((prev) => prev + 1);
    const nextStreak = streak + 1;
    setStreak(nextStreak);
    onEarnXP(35 + nextStreak * 5);

    confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
  };

  const handleGiveUp = () => {
    setIsAnswered(true);
    setIsCorrect(false);
    setStreak(0);
  };

  const handleNext = () => {
    if (currentIndex + 1 < roundList.length) {
      setCurrentIndex((prev) => prev + 1);
      setTypedGuess('');
      setSelectedChoice(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setShowHint(false);
      setWrongGuesses(0);
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setIsGameOver(true);
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#38bdf8', '#fbbf24', '#34d399'],
      });
      onEarnXP(100);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-950/70 via-slate-900/80 to-slate-950 border border-rose-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Name the Country from Flag
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
              {currentIndex + 1} / {roundList.length}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-rose-300 font-semibold uppercase">
              {difficulty.toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white">Identify the Nation by Banner</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Name every country in the selected region from its flag. Type it out or play multiple choice!
          </p>
        </div>

        {/* Score & Streak */}
        <div className="flex items-center gap-3">
          {/* Question Countdown Timer */}
          {!isLearningMode && (
            <div
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-mono font-bold text-xs ${
                timeLeft <= 2
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                  : timeLeft <= 5
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-950/80 border border-slate-800 text-slate-300'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>
          )}

          <div className="px-3.5 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-right">
            <div className="text-base font-black text-rose-400">
              {score} / {roundList.length}
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Correct</span>
          </div>

          {streak > 1 && (
            <div className="px-3.5 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-black flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-400 fill-current animate-pulse" />
              <span>{streak}x Combo</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Input Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-3 backdrop-blur-md">
        {/* Continent Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Region:</span>
          {['All', 'Europe', 'Asia', 'Africa', 'Americas', 'Oceania'].map((continent) => (
            <button
              key={continent}
              onClick={() => setSelectedContinent(continent)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                selectedContinent === continent
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {continent}
            </button>
          ))}
        </div>

        {/* Input Style Toggle: Type Name vs Multiple Choice */}
        <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setQuizInputType('type')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              quizInputType === 'type'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Type Name</span>
          </button>
          <button
            onClick={() => setQuizInputType('choice')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              quizInputType === 'choice'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Multiple Choice</span>
          </button>
        </div>
      </div>

      {/* Main Game Card */}
      {!isGameOver && currentCountry ? (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl text-center space-y-6">
          {/* Large Flag Presentation */}
          <div className="py-2">
            <FlagImage
              key={currentCountry.code}
              countryCode={currentCountry.code}
              emoji={currentCountry.flag}
              alt={`${currentCountry.name} flag`}
              className="mx-auto h-32 w-48 rounded-lg object-contain shadow-2xl sm:h-40 sm:w-60"
            />
            <div className="mt-3 text-xs text-slate-400">
              Continent: <strong className="text-slate-200">{currentCountry.continent}</strong>
            </div>
          </div>

          {/* Hint Section (Adjusted by Difficulty) */}
          <div className="flex flex-col items-center gap-2">
            {hintsAllowed ? (
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                disabled={isAnswered}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>{showHint ? 'Hide Hint' : 'Need a Clue?'}</span>
              </button>
            ) : (
              <span className="text-[11px] text-rose-400/80 font-medium italic">
                🔒 Hints disabled in Hard Mode
              </span>
            )}

            {showHint && currentCountry && (
              <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs max-w-md animate-in fade-in space-y-1">
                <div>
                  Capital is <strong>{currentCountry.capital}</strong>.
                </div>
                {difficulty === 'easy' && (
                  <div className="text-[11px] text-amber-300/80">
                    Country name starts with letter:{' '}
                    <strong className="text-white text-sm font-mono">{currentCountry.name.charAt(0)}</strong>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MODE 1: TYPE THE COUNTRY NAME */}
          {quizInputType === 'type' ? (
            <form onSubmit={handleTypingSubmit} className="max-w-md mx-auto space-y-4">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  autoFocus
                  disabled={isAnswered}
                  value={typedGuess}
                  onChange={handleTypingChange}
                  placeholder="Type the country name..."
                  className={`w-full bg-slate-950/90 border text-center text-base sm:text-lg font-bold py-3.5 px-4 rounded-2xl placeholder-slate-500 focus:outline-none transition-all shadow-inner ${
                    isAnswered && isCorrect
                      ? 'border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40 bg-emerald-950/20'
                      : isAnswered && !isCorrect
                      ? 'border-rose-500 text-rose-300 ring-2 ring-rose-500/40 bg-rose-950/20'
                      : 'border-slate-700 text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  }`}
                />
              </div>

              {!isAnswered ? (
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleGiveUp}
                    className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition"
                  >
                    Give Up & Reveal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-md shadow-rose-600/30"
                  >
                    Submit Guess
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition active:scale-98"
                >
                  <span>Next Flag</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <p className="text-xs text-slate-400" aria-live="polite">
                {Math.max(0, guessLimit - wrongGuesses)} wrong guesses left
                {wrongGuesses > 0 && wrongGuesses < guessLimit && ' — wrong answer, try again'}
                {isAnswered && !isCorrect && quizInputType === 'type' && ' — answer revealed'}
              </p>
            </form>
          ) : (
            /* MODE 2: MULTIPLE CHOICE BUTTONS */
            <div className="space-y-4 max-w-lg mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {choices.map((choice, i) => {
                  const isSelected = selectedChoice === choice;
                  const isTarget = choice === currentCountry.name;

                  let style =
                    'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-rose-400/50 hover:bg-slate-900';
                  if (isAnswered) {
                    if (isTarget) {
                      style = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isSelected) {
                      style = 'bg-rose-950/80 border-rose-500 text-rose-200';
                    } else {
                      style = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleChoiceSelect(choice)}
                      disabled={isAnswered}
                      className={`p-4 rounded-2xl border text-sm font-bold transition-all flex items-center justify-between ${style}`}
                    >
                      <span>{choice}</span>
                      {isAnswered && isTarget && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {isAnswered && isSelected && !isTarget && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <button
                  onClick={handleNext}
                  className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition active:scale-98"
                >
                  <span>Next Flag</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Feedback & Country Details Card */}
          {isAnswered && (
            <div
              className={`p-4 rounded-2xl border text-left text-xs space-y-2 animate-in fade-in ${
                isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm flex items-center gap-2 text-white">
                  <span>{currentCountry.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                    {currentCountry.code}
                  </span>
                </span>
                <span className="font-bold">
                  {isCorrect
                    ? '✅ Correct (+35 XP)'
                    : selectedChoice === '__TIME_UP__'
                    ? '⏰ Time Ran Out!'
                    : '❌ Answer Revealed'}
                </span>
              </div>
              <div className="text-slate-300 grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-white/10 text-[11px]">
                <div>
                  <span className="text-slate-400">Capital:</span>{' '}
                  <strong className="text-white">{currentCountry.capital}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Currency:</span>{' '}
                  <strong className="text-white">{currentCountry.currency}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Population:</span>{' '}
                  <strong className="text-white">{currentCountry.population}</strong>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 pt-1 italic">{currentCountry.funFact}</p>
            </div>
          )}
        </div>
      ) : (
        /* Round Over Screen */
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
            <Trophy className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-black text-white">Flag Round Finished!</h3>
          <p className="text-sm text-slate-300">
            You identified <strong className="text-amber-400 font-mono text-lg">{score}</strong> out of{' '}
            {roundList.length} sovereign flags correctly on {difficulty.toUpperCase()} mode!
          </p>

          <button
            onClick={startNewRound}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Next Round</span>
          </button>
        </div>
      )}
    </div>
  );
};
