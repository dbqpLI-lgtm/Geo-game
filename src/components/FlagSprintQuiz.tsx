import React, { useState, useEffect } from 'react';
import { Zap, Trophy, CheckCircle2, XCircle, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALL_196_COUNTRIES, CountryFullItem } from '../data/all196Countries';

interface FlagSprintQuizProps {
  onEarnXP: (amount: number) => void;
}

export const FlagSprintQuiz: React.FC<FlagSprintQuizProps> = ({ onEarnXP }) => {
  const [shuffledList, setShuffledList] = useState<CountryFullItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Initialize random pool of 10 flags
  const initGame = () => {
    const pool = [...ALL_196_COUNTRIES].sort(() => 0.5 - Math.random()).slice(0, 10);
    setShuffledList(pool);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedChoice(null);
    setIsAnswered(false);
    setIsGameOver(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const currentCountry: CountryFullItem | undefined = shuffledList[currentIndex];

  // Generate 4 multiple choice options
  const choices = React.useMemo(() => {
    if (!currentCountry) return [];
    const others = ALL_196_COUNTRIES.filter((c) => c.name !== currentCountry.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((c) => c.name);

    return [currentCountry.name, ...others].sort(() => 0.5 - Math.random());
  }, [currentCountry, currentIndex]);

  const handleSelect = (choice: string) => {
    if (isAnswered || !currentCountry) return;
    setSelectedChoice(choice);
    setIsAnswered(true);

    const isCorrect = choice === currentCountry.name;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      onEarnXP(25 + streak * 5);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentIndex + 1 < shuffledList.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedChoice(null);
        setIsAnswered(false);
      } else {
        setIsGameOver(true);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
        onEarnXP(100);
      }
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-950/70 via-slate-900/80 to-slate-950 border border-rose-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex items-center justify-between">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Zap className="w-3.5 h-3.5" /> Rapid Flag Blitz
          </span>
          <h2 className="text-xl font-black text-white">Guess the Flag Sprint</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-lg font-black text-rose-400">
              {score} / {shuffledList.length}
            </div>
            <span className="text-[10px] text-slate-400 uppercase">Correct</span>
          </div>
          {streak > 1 && (
            <div className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-extrabold border border-amber-500/30">
              🔥 {streak}x
            </div>
          )}
        </div>
      </div>

      {/* Main Game Area */}
      {!isGameOver && currentCountry ? (
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-xl shadow-xl text-center">
          <div className="text-xs text-slate-400 font-mono mb-4">
            Flag {currentIndex + 1} of {shuffledList.length}
          </div>

          {/* Large Flag Display */}
          <div className="my-6">
            <span className="text-8xl sm:text-9xl filter drop-shadow-2xl animate-float inline-block">
              {currentCountry.flag}
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-6">Which nation flies this banner?</p>

          {/* 4 Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
            {choices.map((choice, i) => {
              const isSelected = selectedChoice === choice;
              const isTarget = choice === currentCountry.name;

              let style = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-rose-400/50 hover:bg-slate-900';
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
                  {isAnswered && isTarget && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                  {isAnswered && isSelected && !isTarget && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Game Over Screen */
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-xl text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
            <Trophy className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-black text-white mb-1">Blitz Complete!</h3>
          <p className="text-sm text-slate-300 mb-6">
            You scored <strong className="text-amber-400 font-mono text-lg">{score}</strong> out of {shuffledList.length}!
          </p>

          <button
            onClick={initGame}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
