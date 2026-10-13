import React, { Suspense, useEffect, useState } from 'react';
import { Eye, HelpCircle, CheckCircle2, XCircle, ArrowRight, Lightbulb, Sparkles, Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { createCountryOutlineQuestions } from '../utils/countryOutlineQuiz';
import { useGameSettings } from '../context/GameSettingsContext';
import { FlagImage } from './FlagImage';

const CountryOutlineShape = React.lazy(() =>
  import('./CountryOutlineShape').then((module) => ({ default: module.CountryOutlineShape }))
);

interface CountryOutlineQuizProps {
  onEarnXP: (amount: number) => void;
}

export const CountryOutlineQuiz: React.FC<CountryOutlineQuizProps> = ({ onEarnXP }) => {
  const { difficulty } = useGameSettings();
  const [questions, setQuestions] = useState(() => createCountryOutlineQuestions(difficulty));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = questions[currentIndex];
  const flagCountry = currentItem?.country;

  useEffect(() => {
    setQuestions(createCountryOutlineQuestions(difficulty));
    setCurrentIndex(0);
    setSelectedChoice(null);
    setIsAnswered(false);
    setShowHint(false);
    setScore(0);
    setIsFinished(false);
  }, [difficulty]);

  const handleSelect = (choice: string) => {
    if (isAnswered) return;
    setSelectedChoice(choice);
    setIsAnswered(true);

    const isCorrect = choice === currentItem.country.name;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      onEarnXP(40);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      onEarnXP(150);
    }
  };

  const handleRestart = () => {
    setQuestions(createCountryOutlineQuestions(difficulty));
    setCurrentIndex(0);
    setSelectedChoice(null);
    setIsAnswered(false);
    setShowHint(false);
    setScore(0);
    setIsFinished(false);
  };

  const isCorrect = selectedChoice === currentItem?.country.name;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950/70 via-slate-900/80 to-slate-950 border border-teal-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Shape & Silhouette Recognition
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
              Round {currentIndex + 1} of {questions.length}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white">What Country is Outlined?</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Identify the sovereign nation solely from its geographic land borders and coastal silhouette.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xl font-black text-teal-400">
              {score} / {questions.length}
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Score</span>
          </div>
        </div>
      </div>

      {/* Main Game Card */}
      {!isFinished && currentItem ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Silhouette Viewer (7 Cols) */}
          <div className="md:col-span-7 bg-slate-900/70 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center relative min-h-[380px]">
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-teal-950/80 text-teal-300 border border-teal-800/40">
                World silhouette
              </span>
            </div>

            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold transition"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
              </button>
            </div>

            {/* Actual country boundary from Natural Earth */}
            <div className="w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-4 relative">
              <Suspense fallback={<div className="h-48 w-48 animate-pulse rounded-xl bg-slate-800" />}>
                <CountryOutlineShape countryName={currentItem.country.name} />
              </Suspense>
            </div>

            {showHint && (
              <div className="w-full mt-2 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-center gap-2 animate-fadeIn">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{currentItem.hint}</span>
              </div>
            )}
          </div>

          {/* Options & Explanations (5 Cols) */}
          <div className="md:col-span-5 bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                Select Country Name:
              </h3>

              <div className="space-y-2.5 mb-4">
                {currentItem.options.map((option, i) => {
                  const optionName = option.name;
                  const isSelected = selectedChoice === optionName;
                  const isTarget = optionName === currentItem.country.name;

                  let style =
                    'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-teal-500/50 hover:bg-slate-900';
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
                      key={option.code}
                      onClick={() => handleSelect(optionName)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-2xl border text-left text-sm font-bold transition-all flex items-center justify-between ${style}`}
                    >
                      <span>{optionName}</span>
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
                <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30 text-xs text-teal-200 mb-4 animate-fadeIn">
                  <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                    {flagCountry && (
                      <FlagImage
                        countryCode={flagCountry.code}
                        emoji={currentItem.country.flag}
                        alt={`${currentItem.country.name} flag`}
                        className="h-6 w-9 rounded object-contain"
                      />
                    )}
                    <span>{currentItem.country.name} Verified:</span>
                  </div>
                  <p className="text-slate-300">{currentItem.funFact}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 transition disabled:opacity-40 active:scale-98"
              >
                <span>{currentIndex + 1 === questions.length ? 'See Final Score' : 'Next Silhouette'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Finished Card */
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-xl text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto mb-4 border border-teal-500/30">
            <Trophy className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-black text-white mb-1">Outline Recognition Mastered!</h3>
          <p className="text-sm text-slate-300 mb-6">
            You accurately recognized <strong className="text-teal-400 font-mono text-lg">{score}</strong> out of {questions.length} global silhouettes!
          </p>

          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-teal-600/30 transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
