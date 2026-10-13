import React from 'react';
import { ShieldAlert, Zap, Sparkles, BookOpen, Clock, HelpCircle, Check, Flame } from 'lucide-react';
import { useGameSettings, DifficultyLevel } from '../context/GameSettingsContext';

interface DifficultySelectorProps {
  compact?: boolean;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ compact = false }) => {
  const { difficulty, setDifficulty, isLearningMode, setIsLearningMode, xpMultiplier } = useGameSettings();

  const difficulties: Array<{
    id: DifficultyLevel;
    label: string;
    icon: string;
    color: string;
    activeBg: string;
    description: string;
    timerDesc: string;
    hintsDesc: string;
    xpBadge: string;
    questionCount: string;
  }> = [
    {
      id: 'easy',
      label: 'Easy',
      icon: '🌱',
      color: 'text-emerald-400',
      activeBg: 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/40',
      description: 'Generous time limits and full hints unlocked.',
      timerDesc: '1.8x Time Limit',
      hintsDesc: 'Full Hints Unlocked',
      xpBadge: '1.0x XP',
      questionCount: 'Up to 40 country questions',
    },
    {
      id: 'medium',
      label: 'Medium',
      icon: '⚡',
      color: 'text-sky-400',
      activeBg: 'bg-sky-950/80 border-sky-500 text-sky-200 ring-1 ring-sky-500/40',
      description: 'Standard timing with 1 hint per question.',
      timerDesc: 'Standard Timer',
      hintsDesc: '1 Hint Per Question',
      xpBadge: '1.25x XP',
      questionCount: 'Up to 100 country questions',
    },
    {
      id: 'hard',
      label: 'Hard',
      icon: '🔥',
      color: 'text-rose-400',
      activeBg: 'bg-rose-950/80 border-rose-500 text-rose-200 ring-1 ring-rose-500/40',
      description: 'Fast blitz countdown with zero hints allowed!',
      timerDesc: 'Blitz 0.5x Time Limit',
      hintsDesc: 'Zero Hints Allowed',
      xpBadge: '1.75x Bonus XP',
      questionCount: 'Up to all 197 countries',
    },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
        <span className="text-[10px] uppercase font-bold text-slate-500 px-1.5 hidden sm:inline">
          Diff:
        </span>
        {difficulties.map((diff) => {
          const isActive = difficulty === diff.id && !isLearningMode;
          return (
            <button
              key={diff.id}
              onClick={() => {
                setDifficulty(diff.id);
                if (isLearningMode) setIsLearningMode(false);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                isActive
                  ? diff.activeBg
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
              title={`${diff.label}: ${diff.timerDesc}, ${diff.hintsDesc}, ${diff.questionCount} (${diff.xpBadge})`}
            >
              <span>{diff.icon}</span>
              <span>{diff.label}</span>
            </button>
          );
        })}

        {/* Learning Mode Quick Toggle */}
        <button
          onClick={() => setIsLearningMode(!isLearningMode)}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border-l border-slate-800 pl-2 ${
            isLearningMode
              ? 'bg-purple-950/80 border border-purple-500 text-purple-200 ring-1 ring-purple-500/40'
              : 'text-slate-400 hover:text-purple-300'
          }`}
          title="Learning Mode: Study cards, no time limits, and educational guides"
        >
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">Learn</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <ShieldAlert className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quiz Difficulty & Pace
            </h4>
            <p className="text-[11px] text-slate-400">
              Adjust timers, hints, XP, and country-quiz pool sizes.
            </p>
          </div>
        </div>

        {/* Learning Mode Button */}
        <button
          onClick={() => setIsLearningMode(!isLearningMode)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
            isLearningMode
              ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:text-white hover:border-purple-500/40'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-purple-300" />
          <span>{isLearningMode ? '🎓 Learning Mode Active' : 'Enable Learning Mode'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {difficulties.map((diff) => {
          const isActive = difficulty === diff.id && !isLearningMode;
          return (
            <button
              key={diff.id}
              onClick={() => {
                setDifficulty(diff.id);
                if (isLearningMode) setIsLearningMode(false);
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? `${diff.activeBg} shadow-lg`
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                  <span className="text-sm">{diff.icon}</span>
                  <span>{diff.label}</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-bold">
                  {diff.xpBadge}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 leading-tight space-y-0.5">
                <div className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-3 h-3 text-sky-400" />
                  <span>{diff.timerDesc}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <HelpCircle className="w-3 h-3 text-amber-400" />
                  <span>{diff.hintsDesc}</span>
                </div>
                <div className="text-slate-400">{diff.questionCount}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
