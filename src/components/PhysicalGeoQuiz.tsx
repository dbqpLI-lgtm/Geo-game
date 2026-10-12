import React, { useState } from 'react';
import { Mountain, Waves, Compass, Trophy, CheckCircle2, XCircle, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { PHYSICAL_GEOGRAPHY_ITEMS, PhysicalGeoItem } from '../data/geographyData';

interface PhysicalGeoQuizProps {
  onEarnXP: (amount: number) => void;
}

export const PhysicalGeoQuiz: React.FC<PhysicalGeoQuizProps> = ({ onEarnXP }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const filteredItems = PHYSICAL_GEOGRAPHY_ITEMS.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  const currentItem: PhysicalGeoItem = filteredItems[currentIndex % filteredItems.length];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);

    if (idx === currentItem.correctIndex) {
      setScore((prev) => prev + 1);
      onEarnXP(35);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const isCorrect = selectedAnswer === currentItem.correctIndex;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950/70 via-slate-900/80 to-slate-950 border border-cyan-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5" /> Physical Geography & Wonders
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
              Question {currentIndex + 1} of {filteredItems.length}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white">Rivers, Mountains, Deserts & Oceans</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Test your knowledge of the planet's most astonishing physical records, geological trenches, and natural superlatives.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['All', 'Rivers', 'Mountains & Peaks', 'Deserts', 'Superlatives'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
                setSelectedAnswer(null);
                setIsAnswered(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-3 border-b border-slate-800">
          <span className="font-semibold text-cyan-400 flex items-center gap-1.5">
            <Compass className="w-4 h-4" /> Category: {currentItem.category}
          </span>
          <span className="text-slate-400 font-mono">Record: {currentItem.record}</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-6 leading-snug">
          {currentItem.quizQuestion}
        </h3>

        {/* 4 Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {currentItem.options.map((opt, i) => {
            const isSelected = selectedAnswer === i;
            const isTarget = i === currentItem.correctIndex;

            let style = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-cyan-500/50 hover:bg-slate-900';
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
                onClick={() => handleSelectOption(i)}
                disabled={isAnswered}
                className={`p-4 rounded-2xl border text-left text-sm font-semibold transition-all flex items-center justify-between ${style}`}
              >
                <span>{opt}</span>
                {isAnswered && isTarget && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                {isAnswered && isSelected && !isTarget && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Educational Detail Callout */}
        {isAnswered && (
          <div
            className={`p-4 rounded-2xl border text-xs leading-relaxed mb-6 animate-fadeIn ${
              isCorrect
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                : 'bg-slate-950 border-cyan-500/30 text-slate-300'
            }`}
          >
            <div className="font-bold text-white mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Geographic Context: {currentItem.name}</span>
            </div>
            <p className="text-slate-300">{currentItem.detail}</p>
            <div className="mt-2 text-[11px] text-cyan-400 font-mono">
              Locations: {currentItem.locations}
            </div>
          </div>
        )}

        {/* Footer Next Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            Total Points Scored: <strong className="text-white font-mono">{score}</strong>
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/25 transition active:scale-95"
          >
            <span>Next Question</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
