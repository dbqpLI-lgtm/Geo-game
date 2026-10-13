import React, { useState } from 'react';
import { Tag, Sparkles, CheckCircle2, XCircle, ArrowRight, Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { COUNTRY_NICKNAMES_LIST, CountryNicknameItem } from '../data/outlinesAndGeoData';
import { ALL_197_COUNTRIES } from '../data/all197Countries';
import { FlagImage } from './FlagImage';

interface CountryNicknamesQuizProps {
  onEarnXP: (amount: number) => void;
}

export const CountryNicknamesQuiz: React.FC<CountryNicknamesQuizProps> = ({ onEarnXP }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentItem: CountryNicknameItem = COUNTRY_NICKNAMES_LIST[currentIndex];
  const flagCountry = ALL_197_COUNTRIES.find((country) => country.name === currentItem.country);

  const handleSelect = (choice: string) => {
    if (isAnswered) return;
    setSelectedAnswer(choice);
    setIsAnswered(true);

    if (choice === currentItem.country) {
      setScore((prev) => prev + 1);
      onEarnXP(35);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < COUNTRY_NICKNAMES_LIST.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsGameOver(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      onEarnXP(120);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsGameOver(false);
  };

  const isCorrect = selectedAnswer === currentItem?.country;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-950/70 via-slate-900/80 to-slate-950 border border-orange-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex items-center justify-between">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Tag className="w-3.5 h-3.5" /> World Monikers & Nicknames
          </span>
          <h2 className="text-xl font-black text-white">Country Nicknames Trivia</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Can you guess the nation behind each famous cultural & poetic moniker?
          </p>
        </div>

        <div className="text-right">
          <div className="text-xl font-black text-orange-400">
            {score} / {COUNTRY_NICKNAMES_LIST.length}
          </div>
          <span className="text-[10px] text-slate-400 uppercase">Score</span>
        </div>
      </div>

      {/* Question Card */}
      {!isGameOver && currentItem ? (
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-xl shadow-xl text-center">
          <div className="text-xs text-slate-400 font-mono mb-2">
            Question {currentIndex + 1} of {COUNTRY_NICKNAMES_LIST.length}
          </div>

          <div className="my-6">
            <span className="text-xs uppercase font-bold tracking-widest text-orange-400 block mb-2">
              Which country is known as:
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-snug drop-shadow-md">
              "{currentItem.nickname}"
            </h3>
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto my-6 text-left">
            {currentItem.options.map((opt, i) => {
              const isSelected = selectedAnswer === opt;
              const isTarget = opt === currentItem.country;

              let style =
                'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-orange-500/50 hover:bg-slate-900';
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
                  onClick={() => handleSelect(opt)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border text-sm font-bold transition-all flex items-center justify-between ${style}`}
                >
                  <span>{opt}</span>
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

          {/* Explanation Callout */}
          {isAnswered && (
            <div className="max-w-lg mx-auto p-4 rounded-2xl bg-orange-950/40 border border-orange-500/30 text-xs text-orange-200 text-left mb-6 animate-fadeIn">
              <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                {flagCountry ? (
                  <FlagImage
                    countryCode={flagCountry.code}
                    emoji={currentItem.flag}
                    alt={`${currentItem.country} flag`}
                    className="h-6 w-9 rounded object-contain"
                  />
                ) : (
                  <span className="text-xl">{currentItem.flag}</span>
                )}
                <span>{currentItem.country} Origin:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{currentItem.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 transition disabled:opacity-40 active:scale-95"
          >
            <span>{currentIndex + 1 === COUNTRY_NICKNAMES_LIST.length ? 'Finish Quiz' : 'Next Question'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Finished Card */
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-xl text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-4 border border-orange-500/30">
            <Trophy className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-black text-white mb-1">Nicknames Trivia Completed!</h3>
          <p className="text-sm text-slate-300 mb-6">
            You correctly identified <strong className="text-orange-400 font-mono text-lg">{score}</strong> out of {COUNTRY_NICKNAMES_LIST.length} world country nicknames!
          </p>

          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-600/30 transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
