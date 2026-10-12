import React, { useState, useMemo } from 'react';
import { Building2, Search, CheckCircle2, XCircle, ArrowRight, Trophy, RotateCcw, Filter, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALL_196_COUNTRIES, CountryFullItem } from '../data/all196Countries';

interface WorldCapitalsQuizProps {
  onEarnXP: (amount: number) => void;
}

export const WorldCapitalsQuiz: React.FC<WorldCapitalsQuizProps> = ({ onEarnXP }) => {
  const [selectedContinent, setSelectedContinent] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Filter countries that have capitals defined
  const availableCountries = useMemo(() => {
    return ALL_196_COUNTRIES.filter((c) => {
      if (selectedContinent === 'All') return true;
      if (selectedContinent === 'Americas') return c.continent === 'North America' || c.continent === 'South America';
      return c.continent === selectedContinent;
    });
  }, [selectedContinent]);

  const currentCountry: CountryFullItem = availableCountries[currentIndex % availableCountries.length];

  // Generate 4 multiple-choice capital options
  const choices = useMemo(() => {
    if (!currentCountry) return [];
    const others = availableCountries
      .filter((c) => c.capital !== currentCountry.capital)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((c) => c.capital);

    return [currentCountry.capital, ...others].sort(() => 0.5 - Math.random());
  }, [currentCountry, currentIndex, availableCountries]);

  const handleSelect = (choice: string) => {
    if (isAnswered) return;
    setSelectedChoice(choice);
    setIsAnswered(true);

    const isCorrect = choice === currentCountry.capital;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      onEarnXP(30 + streak * 5);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < availableCountries.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setIsAnswered(false);
    } else {
      setIsGameOver(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
      onEarnXP(200);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedChoice(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
  };

  const isCorrect = selectedChoice === currentCountry?.capital;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950/70 via-slate-900/80 to-slate-950 border border-blue-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> World Capitals Challenge
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
              {selectedContinent}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white">Name Every World Capital</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Can you name the official seat of government for every sovereign nation?
          </p>
        </div>

        {/* Continent Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['All', 'Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania'].map(
            (cont) => (
              <button
                key={cont}
                onClick={() => {
                  setSelectedContinent(cont);
                  setCurrentIndex(0);
                  setSelectedChoice(null);
                  setIsAnswered(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedContinent === cont
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cont === 'North America' ? 'N. America' : cont === 'South America' ? 'S. America' : cont}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Card */}
      {!isGameOver && currentCountry ? (
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-xl shadow-xl text-center">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-3 border-b border-slate-800">
            <span className="font-mono">
              Country {currentIndex + 1} of {availableCountries.length}
            </span>
            <div className="flex items-center gap-3">
              <span className="font-bold text-blue-400 font-mono">Score: {score}</span>
              {streak > 1 && (
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  🔥 {streak} Streak
                </span>
              )}
            </div>
          </div>

          <div className="my-6">
            <span className="text-6xl filter drop-shadow-lg inline-block mb-3">
              {currentCountry.flag}
            </span>
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400 block mb-1">
              What is the capital of:
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {currentCountry.name}
            </h3>
            <span className="text-xs text-blue-400 font-semibold mt-1 inline-block">
              {currentCountry.continent} • Pop: {currentCountry.population}
            </span>
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto my-6 text-left">
            {choices.map((choice, i) => {
              const isSelected = selectedChoice === choice;
              const isTarget = choice === currentCountry.capital;

              let style =
                'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-blue-500/50 hover:bg-slate-900';
              if (isAnswered) {
                if (isTarget) {
                  style = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                } else if (isSelected) {
                  style = 'bg-rose-950 border-rose-500 text-rose-200';
                } else {
                  style = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-50';
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(choice)}
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

          {/* Fact card after answer */}
          {isAnswered && (
            <div className="max-w-lg mx-auto p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 text-left mb-6 animate-fadeIn">
              <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Capital Insight:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{currentCountry.funFact}</p>
            </div>
          )}

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition disabled:opacity-40 active:scale-95"
          >
            <span>
              {currentIndex + 1 === availableCountries.length ? 'Finish Challenge' : 'Next Country'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Finished Card */
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-xl text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
            <Trophy className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-black text-white mb-1">Capitals Challenge Completed!</h3>
          <p className="text-sm text-slate-300 mb-6">
            You scored <strong className="text-blue-400 font-mono text-lg">{score}</strong> out of{' '}
            {availableCountries.length} capitals correctly!
          </p>

          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
