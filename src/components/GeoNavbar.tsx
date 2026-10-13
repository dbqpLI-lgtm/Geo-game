import React, { useState } from 'react';
import {
  Globe2,
  Flag,
  MapPin,
  Mountain,
  Sparkles,
  Award,
  Zap,
  Building2,
  Eye,
  Tag,
  Coins,
  Calendar,
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  ChevronDown,
  BookOpen,
  Crown,
  Swords,
  Waves,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DifficultySelector } from './DifficultySelector';

export type GameMode =
  | 'daily'
  | 'learning'
  | 'countries'
  | 'capitals'
  | 'leaders'
  | 'culture'
  | 'outlines'
  | 'city-map'
  | 'flag-maker'
  | 'nicknames'
  | 'states'
  | 'flag-sprint'
  | 'physical-geo'
  | 'war-history'
  | 'world-features'
  | 'government-leaders'
  | 'ai-custom';

interface GeoNavbarProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  xpPoints: number;
  streak: number;
  onOpenAuth: () => void;
}

export const GeoNavbar: React.FC<GeoNavbarProps> = ({
  currentMode,
  onSelectMode,
  xpPoints,
  streak,
  onOpenAuth,
}) => {
  const { currentUser, userProfile, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const getRankTitle = (xp: number) => {
    if (xp >= 2500) return 'Atlas Grandmaster';
    if (xp >= 1000) return 'Master Navigator';
    if (xp >= 500) return 'Global Explorer';
    if (xp >= 150) return 'Junior Cartographer';
    return 'Novice Scout';
  };

  const modes: Array<{ id: GameMode; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'daily', label: 'Daily Challenge', icon: <Calendar className="w-4 h-4 text-amber-400" />, badge: '+250 XP' },
    { id: 'learning', label: 'Atlas & Learn', icon: <BookOpen className="w-4 h-4 text-purple-400" />, badge: 'Study' },
    { id: 'countries', label: '197 Countries', icon: <Globe2 className="w-4 h-4 text-indigo-400" />, badge: 'All' },
    { id: 'capitals', label: 'Capitals', icon: <Building2 className="w-4 h-4 text-blue-400" /> },
    { id: 'leaders', label: 'Country Leaders', icon: <Crown className="w-4 h-4 text-amber-400" />, badge: 'New' },
    { id: 'culture', label: 'Money & Faith', icon: <Coins className="w-4 h-4 text-amber-400" />, badge: 'Triad' },
    { id: 'outlines', label: 'Outlines', icon: <Eye className="w-4 h-4 text-teal-400" />, badge: 'Shapes' },
    { id: 'city-map', label: 'Find the City', icon: <MapPin className="w-4 h-4 text-emerald-400" />, badge: 'Map' },
    { id: 'flag-maker', label: 'Draw the Flag', icon: <Flag className="w-4 h-4 text-emerald-400" />, badge: 'Draw' },
    { id: 'nicknames', label: 'Nicknames', icon: <Tag className="w-4 h-4 text-orange-400" /> },
    { id: 'states', label: 'States', icon: <MapPin className="w-4 h-4 text-amber-400" />, badge: '50 States' },
    { id: 'flag-sprint', label: 'Name the Flag', icon: <Zap className="w-4 h-4 text-rose-400" />, badge: 'Guess' },
    { id: 'physical-geo', label: 'Physical Wonders', icon: <Mountain className="w-4 h-4 text-cyan-400" /> },
    { id: 'war-history', label: 'War History', icon: <Swords className="w-4 h-4 text-rose-400" />, badge: 'Dates' },
    { id: 'world-features', label: 'Seas & Monuments', icon: <Waves className="w-4 h-4 text-cyan-400" />, badge: 'Map' },
    { id: 'government-leaders', label: 'Leaders', icon: <Crown className="w-4 h-4 text-violet-400" />, badge: 'Prime Ministers' },
    { id: 'ai-custom', label: 'AI Custom Quiz', icon: <Sparkles className="w-4 h-4 text-purple-400" />, badge: 'Gemini' },
  ];

  const displayName = userProfile?.displayName || currentUser?.displayName || (currentUser?.isAnonymous ? 'Guest Explorer' : 'Explorer');
  const userInitials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Mobile Stats / Sign-in */}
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
              <p className="text-[11px] text-slate-400">All Countries, Capitals, and Outlines</p>
            </div>
          </div>

          {/* Mobile Right Action */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>{xpPoints} XP</span>
            </div>

            {currentUser ? (
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-sky-500 text-white font-bold text-xs flex items-center justify-center border border-indigo-400/40"
              >
                {userProfile?.photoURL ? (
                  <img src={userProfile.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  userInitials
                )}
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-2.5 py-1 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-indigo-600/30"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
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

        {/* Desktop Difficulty & XP & Profile */}
        <div className="hidden md:flex items-center gap-3">
          <DifficultySelector compact={true} />

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

          {/* User Profile or Sign In Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1 pr-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-left transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden border border-indigo-400/40">
                  {userProfile?.photoURL ? (
                    <img src={userProfile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    userInitials
                  )}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white max-w-[100px] truncate leading-tight">
                    {displayName}
                  </div>
                  <div className="text-[10px] text-indigo-300 font-semibold leading-tight">
                    {getRankTitle(xpPoints)}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-2 border-b border-slate-800/80 mb-2">
                    <div className="text-xs font-bold text-white truncate">{displayName}</div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {currentUser.isAnonymous ? 'Guest Account' : currentUser.email}
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{getRankTitle(xpPoints)}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between px-2 py-1.5 text-slate-300">
                      <span>Total Geography XP</span>
                      <span className="font-mono font-bold text-amber-400">{xpPoints} XP</span>
                    </div>
                    <div className="flex items-center justify-between px-2 py-1.5 text-slate-300">
                      <span>Daily Streak</span>
                      <span className="font-mono font-bold text-rose-400">{streak} Days</span>
                    </div>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-800/80">
                    <button
                      onClick={async () => {
                        setProfileDropdownOpen(false);
                        await logout();
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
