import React from 'react';
import { Globe2, Flag, MapPin, Mountain, Sparkles, Award, Zap, Building2, Eye, Tag, Navigation, Coins, Calendar } from 'lucide-react';

export type GameMode =
  | 'daily'
  | 'countries'
  | 'capitals'
  | 'culture'
  | 'outlines'
  | 'geoguessr'
  | 'flag-maker'
  | 'nicknames'
  | 'states'
  | 'flag-sprint'
  | 'physical-geo'
  | 'ai-custom';

interface GeoNavbarProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  xpPoints: number;
  streak: number;
}

export const GeoNavbar: React.FC<GeoNavbarProps> = ({
  currentMode,
  onSelectMode,
  xpPoints,
  streak,
}) => {
  const modes: Array<{ id: GameMode; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'daily', label: 'Daily Challenge', icon: <Calendar className="w-4 h-4 text-amber-400" />, badge: '+250 XP' },
    { id: 'countries', label: '196 Countries', icon: <Globe2 className="w-4 h-4 text-indigo-400" />, badge: 'All' },
    { id: 'capitals', label: 'Capitals', icon: <Building2 className="w-4 h-4 text-blue-400" /> },
    { id: 'culture', label: 'Money & Faith', icon: <Coins className="w-4 h-4 text-amber-400" />, badge: 'Triad' },
    { id: 'outlines', label: 'Outlines', icon: <Eye className="w-4 h-4 text-teal-400" />, badge: 'Shapes' },
    { id: 'geoguessr', label: 'GeoGuessr', icon: <Navigation className="w-4 h-4 text-emerald-400" />, badge: 'Map' },
    { id: 'flag-maker', label: 'Flag Maker', icon: <Flag className="w-4 h-4 text-emerald-400" />, badge: 'Build' },
    { id: 'nicknames', label: 'Nicknames', icon: <Tag className="w-4 h-4 text-orange-400" /> },
    { id: 'states', label: 'States', icon: <MapPin className="w-4 h-4 text-amber-400" />, badge: '50 States' },
    { id: 'flag-sprint', label: 'Flag Blitz', icon: <Zap className="w-4 h-4 text-rose-400" /> },
    { id: 'physical-geo', label: 'Physical Wonders', icon: <Mountain className="w-4 h-4 text-cyan-400" /> },
    { id: 'ai-custom', label: 'AI Custom Quiz', icon: <Sparkles className="w-4 h-4 text-purple-400" />, badge: 'Gemini' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Globe2 className="w-5 h-5 animate-spin" style={{ animationDuration: '30s' }} />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent">
                  GeoMaster
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  Atlas & Quiz
                </span>
              </div>
              <p className="text-[11px] text-slate-400">All Countries, Capitals, Outlines & GeoGuessr</p>
            </div>
          </div>

          {/* XP & Streak on Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>{xpPoints} XP</span>
            </div>
          </div>
        </div>

        {/* Mode Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {modes.map((mode) => {
            const isActive = currentMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onSelectMode(mode.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-sky-400/30 font-bold'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800/60'
                }`}
              >
                {mode.icon}
                <span>{mode.label}</span>
                {mode.badge && (
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-extrabold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {mode.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop XP & Streak Banner */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-sm">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{xpPoints} XP</span>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold shadow-sm">
              <Zap className="w-4 h-4 text-rose-400 fill-current" />
              <span>{streak} Streak</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
