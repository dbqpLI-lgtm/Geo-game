import React, { useState } from 'react';
import { ShieldCheck, Compass, CheckCircle2, Circle, Sparkles, TrendingUp, HeartPulse, BrainCircuit } from 'lucide-react';
import { DaySummaryResult } from '../types';

interface BalanceRadarProps {
  summary: DaySummaryResult;
}

export const BalanceRadar: React.FC<BalanceRadarProps> = ({ summary }) => {
  const [completedActions, setCompletedActions] = useState<Record<number, boolean>>({});

  const toggleAction = (idx: number) => {
    setCompletedActions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Digital Equilibrium & Cognitive Load */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Digital Equilibrium Index</h3>
                <p className="text-xs text-slate-400">Balance across stimulation, focus & rest</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              Wellness Metric
            </span>
          </div>

          {/* Three Bars */}
          <div className="space-y-4 mb-6">
            {/* Focus vs Distraction */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Focus vs Algorithmic Distraction
                </span>
                <span className="text-indigo-400 font-mono">
                  {summary.digitalBalanceScore.focusVsDistraction}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${summary.digitalBalanceScore.focusVsDistraction}%` }}
                />
              </div>
            </div>

            {/* Mental Energy Reserve */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-400" /> Mental Battery & Stamina
                </span>
                <span className="text-rose-400 font-mono">
                  {summary.digitalBalanceScore.mentalEnergy}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${summary.digitalBalanceScore.mentalEnergy}%` }}
                />
              </div>
            </div>

            {/* Physical Movement Score */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Physical Mobility Output
                </span>
                <span className="text-emerald-400 font-mono">
                  {summary.digitalBalanceScore.movementScore}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${summary.digitalBalanceScore.movementScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Verdict box */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs">
          <div className="text-indigo-300 font-bold mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Holistic Daily Diagnosis:</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {summary.digitalBalanceScore.verdict}
          </p>
        </div>
      </div>

      {/* 2. Key Accomplishments & Action Items */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/10">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Key Wins & Tomorrow's Agenda</h3>
                <p className="text-xs text-slate-400">Accomplishments logged and forward momentum</p>
              </div>
            </div>
          </div>

          {/* Key Wins */}
          <div className="space-y-2 mb-5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Today's Key Milestones
            </div>
            {summary.keyWins.map((win, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-200"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{win}</span>
              </div>
            ))}
          </div>

          {/* Interactive Tomorrow Action items */}
          <div className="space-y-2 mb-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Action Items Extracted for Tomorrow
            </div>
            {summary.actionItemsForTomorrow.map((item, idx) => {
              const done = !!completedActions[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleAction(idx)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer text-xs select-none ${
                    done
                      ? 'bg-slate-950/40 border-slate-800 text-slate-500 line-through'
                      : 'bg-slate-950/80 border-purple-900/40 text-slate-200 hover:border-purple-600/50'
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  )}
                  <span>{item}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strategic Forecast */}
        <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 text-xs">
          <div className="text-purple-300 font-bold mb-1 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Tomorrow's Strategic Forecast:</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {summary.tomorrowForecast}
          </p>
        </div>
      </div>
    </div>
  );
};
