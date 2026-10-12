/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GeoNavbar, GameMode } from './components/GeoNavbar';
import { DailyChallenge } from './components/DailyChallenge';
import { CountryNamingQuiz } from './components/CountryNamingQuiz';
import { WorldCapitalsQuiz } from './components/WorldCapitalsQuiz';
import { CultureCurrencyReligionQuiz } from './components/CultureCurrencyReligionQuiz';
import { CountryOutlineQuiz } from './components/CountryOutlineQuiz';
import { GeoGuessrGame } from './components/GeoGuessrGame';
import { FlagMakerStudio } from './components/FlagMakerStudio';
import { CountryNicknamesQuiz } from './components/CountryNicknamesQuiz';
import { StateNamingQuiz } from './components/StateNamingQuiz';
import { FlagSprintQuiz } from './components/FlagSprintQuiz';
import { PhysicalGeoQuiz } from './components/PhysicalGeoQuiz';
import { AICustomQuiz } from './components/AICustomQuiz';
import { Globe2, Flag, MapPin, Mountain, Zap, Sparkles, Award, Compass, Building2, Eye, Tag, Navigation, Coins, Calendar, Flame } from 'lucide-react';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('countries');
  const [xpPoints, setXpPoints] = useState<number>(0);
  const [streak, setStreak] = useState<number>(1);

  // Load XP from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('geomaster_xp');
      if (saved) {
        setXpPoints(parseInt(saved, 10));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleEarnXP = (amount: number) => {
    setXpPoints((prev) => {
      const updated = prev + amount;
      try {
        localStorage.setItem('geomaster_xp', updated.toString());
      } catch {}
      return updated;
    });
    setStreak((prev) => prev + 1);
  };

  const modeCards: Array<{
    id: GameMode;
    label: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
    activeBorder: string;
  }> = [
    {
      id: 'daily',
      label: 'Daily Quest',
      desc: '24h Reset • +250 Bonus XP',
      icon: <Calendar className="w-5 h-5 text-amber-400" />,
      color: 'hover:border-amber-500/50',
      activeBorder: 'border-amber-500 bg-amber-950/40 ring-1 ring-amber-400/40',
    },
    {
      id: 'countries',
      label: 'Every Country',
      desc: 'Type & Name World Nations',
      icon: <Globe2 className="w-5 h-5 text-indigo-400" />,
      color: 'hover:border-indigo-500/50',
      activeBorder: 'border-indigo-500 bg-indigo-950/30',
    },
    {
      id: 'capitals',
      label: 'Every Capital',
      desc: 'Match All World Capitals',
      icon: <Building2 className="w-5 h-5 text-blue-400" />,
      color: 'hover:border-blue-500/50',
      activeBorder: 'border-blue-500 bg-blue-950/30',
    },
    {
      id: 'culture',
      label: 'Money & Faith',
      desc: 'Currency, Language & Religion',
      icon: <Coins className="w-5 h-5 text-amber-400" />,
      color: 'hover:border-amber-500/50',
      activeBorder: 'border-amber-500 bg-amber-950/30',
    },
    {
      id: 'outlines',
      label: 'Country Outlines',
      desc: 'Identify Country Borders',
      icon: <Eye className="w-5 h-5 text-teal-400" />,
      color: 'hover:border-teal-500/50',
      activeBorder: 'border-teal-500 bg-teal-950/30',
    },
    {
      id: 'geoguessr',
      label: 'GeoGuessr Mode',
      desc: 'Street Panorama & Map Pin',
      icon: <Navigation className="w-5 h-5 text-emerald-400" />,
      color: 'hover:border-emerald-500/50',
      activeBorder: 'border-emerald-500 bg-emerald-950/30',
    },
    {
      id: 'flag-maker',
      label: 'Flag Maker Studio',
      desc: 'Paint & Construct Flags',
      icon: <Flag className="w-5 h-5 text-emerald-400" />,
      color: 'hover:border-emerald-500/50',
      activeBorder: 'border-emerald-500 bg-emerald-950/30',
    },
    {
      id: 'nicknames',
      label: 'Country Nicknames',
      desc: 'Emerald Isle, Rising Sun...',
      icon: <Tag className="w-5 h-5 text-orange-400" />,
      color: 'hover:border-orange-500/50',
      activeBorder: 'border-orange-500 bg-orange-950/30',
    },
    {
      id: 'states',
      label: 'Every State',
      desc: '50 US States, Canada, Aus...',
      icon: <MapPin className="w-5 h-5 text-amber-400" />,
      color: 'hover:border-amber-500/50',
      activeBorder: 'border-amber-500 bg-amber-950/30',
    },
    {
      id: 'flag-sprint',
      label: 'Flag Blitz',
      desc: 'Rapid Flashcard Sprint',
      icon: <Zap className="w-5 h-5 text-rose-400" />,
      color: 'hover:border-rose-500/50',
      activeBorder: 'border-rose-500 bg-rose-950/30',
    },
    {
      id: 'physical-geo',
      label: 'Physical Wonders',
      desc: 'Rivers, Peaks & Deserts',
      icon: <Mountain className="w-5 h-5 text-cyan-400" />,
      color: 'hover:border-cyan-500/50',
      activeBorder: 'border-cyan-500 bg-cyan-950/30',
    },
    {
      id: 'ai-custom',
      label: 'AI Custom Quiz',
      desc: 'Quiz Anything with Gemini',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      color: 'hover:border-purple-500/50',
      activeBorder: 'border-purple-500 bg-purple-950/30',
    },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-white">
      {/* Top Navbar */}
      <GeoNavbar
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode)}
        xpPoints={xpPoints}
        streak={streak}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Quick Mode Jump Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {modeCards.map((item) => {
            const isActive = currentMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentMode(item.id)}
                className={`p-3 rounded-2xl border text-left transition-all backdrop-blur-md shadow-sm ${
                  isActive
                    ? `${item.activeBorder} shadow-lg ring-1 ring-white/10`
                    : `bg-slate-900/50 border-slate-800/80 ${item.color} text-slate-400 hover:text-white`
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    {item.icon}
                  </div>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
                <div className="text-xs font-bold text-white truncate">{item.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">{item.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Quiz Views */}
        {currentMode === 'daily' && <DailyChallenge onEarnXP={handleEarnXP} />}
        {currentMode === 'countries' && <CountryNamingQuiz onEarnXP={handleEarnXP} />}
        {currentMode === 'capitals' && <WorldCapitalsQuiz onEarnXP={handleEarnXP} />}
        {currentMode === 'culture' && <CultureCurrencyReligionQuiz onEarnXP={handleEarnXP} />}
        {currentMode === 'outlines' && <CountryOutlineQuiz onEarnXP={handleEarnXP} />}
        {currentMode === 'geoguessr' && <GeoGuessrGame onEarnXP={handleEarnXP} />}
        {currentMode === 'flag-maker' && <FlagMakerStudio onEarnXP={handleEarnXP} />}
        {currentMode === 'nicknames' && <CountryNicknamesQuiz onEarnXP={handleEarnXP} />}
        {currentMode === 'states' && <StateNamingQuiz onEarnXP={handleEarnXP} />}
        {currentMode === 'flag-sprint' && <FlagSprintQuiz onEarnXP={handleEarnXP} />}
        {currentMode === 'physical-geo' && <PhysicalGeoQuiz onEarnXP={handleEarnXP} />}
        {currentMode === 'ai-custom' && <AICustomQuiz onEarnXP={handleEarnXP} />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">GeoMaster Complete Atlas & Quiz Arena</span>
            <span>•</span>
            <span>Countries, Capitals, Outlines, GeoGuessr, Flags & Nicknames</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 font-mono">
              <Award className="w-3.5 h-3.5 text-amber-400" /> {xpPoints} Total XP
            </span>
            <span>Powered by Gemini 3.8 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
