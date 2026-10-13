/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameSettingsProvider, useGameSettings } from './context/GameSettingsContext';
import { GeoNavbar, GameMode } from './components/GeoNavbar';
import { DifficultySelector } from './components/DifficultySelector';
import { LearningModeView } from './components/LearningModeView';
import { AuthModal } from './components/AuthModal';
import { DailyChallenge } from './components/DailyChallenge';
import { CountryNamingQuiz } from './components/CountryNamingQuiz';
import { WorldCapitalsQuiz } from './components/WorldCapitalsQuiz';
import { CultureCurrencyReligionQuiz } from './components/CultureCurrencyReligionQuiz';
import { CountryOutlineQuiz } from './components/CountryOutlineQuiz';
import { FlagMakerStudio } from './components/FlagMakerStudio';
import { CountryNicknamesQuiz } from './components/CountryNicknamesQuiz';
import { StateNamingQuiz } from './components/StateNamingQuiz';
import { FlagSprintQuiz } from './components/FlagSprintQuiz';
import { PhysicalGeoQuiz } from './components/PhysicalGeoQuiz';
import { GovernmentLeadersQuiz } from './components/GovernmentLeadersQuiz';
import { AICustomQuiz } from './components/AICustomQuiz';
import { WarHistoryQuiz } from './components/WarHistoryQuiz';

const CityLocationQuiz = React.lazy(() =>
  import('./components/CityLocationQuiz').then((module) => ({ default: module.CityLocationQuiz }))
);
const WorldFeaturesQuiz = React.lazy(() =>
  import('./components/WorldFeaturesQuiz').then((module) => ({ default: module.WorldFeaturesQuiz }))
);
import { WorldLeadersQuiz } from './components/WorldLeadersQuiz';
import {
  Globe2,
  Flag,
  MapPin,
  Mountain,
  Zap,
  Sparkles,
  Award,
  Compass,
  Building2,
  Eye,
  Tag,
  Coins,
  Calendar,
  LogIn,
  BookOpen,
  Crown,
  Swords,
  Waves,
} from 'lucide-react';

function AppContent() {
  const { currentUser, userProfile, syncXPAndStreak } = useAuth();
  const { xpMultiplier, isLearningMode, setIsLearningMode } = useGameSettings();
  const [currentMode, setCurrentMode] = useState<GameMode>('countries');
  const [xpPoints, setXpPoints] = useState<number>(0);
  const [streak, setStreak] = useState<number>(1);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync state from local storage or cloud profile
  useEffect(() => {
    try {
      const saved = localStorage.getItem('geomaster_xp');
      if (saved) {
        setXpPoints(parseInt(saved, 10));
      }
      const savedStreak = localStorage.getItem('geomaster_daily_streak');
      if (savedStreak) {
        setStreak(parseInt(savedStreak, 10));
      }
    } catch {}
  }, []);

  // When cloud profile updates, sync local XP if cloud has higher value
  useEffect(() => {
    if (userProfile) {
      if (userProfile.xpPoints > xpPoints) {
        setXpPoints(userProfile.xpPoints);
      }
      if (userProfile.dailyStreak > streak) {
        setStreak(userProfile.dailyStreak);
      }
    }
  }, [userProfile]);

  const handleEarnXP = (baseAmount: number) => {
    const multipliedAmount = Math.round(baseAmount * xpMultiplier);

    setXpPoints((prev) => {
      const updated = prev + multipliedAmount;
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      try {
        localStorage.setItem('geomaster_xp', updated.toString());
        localStorage.setItem('geomaster_daily_streak', nextStreak.toString());
      } catch {}
      // Sync to Firebase Cloud if authenticated
      syncXPAndStreak(updated, nextStreak);
      return updated;
    });
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
      id: 'learning',
      label: 'Atlas & Learn',
      desc: 'Flashcards & 0 Stress Study',
      icon: <BookOpen className="w-5 h-5 text-purple-400" />,
      color: 'hover:border-purple-500/50',
      activeBorder: 'border-purple-500 bg-purple-950/40 ring-1 ring-purple-400/40',
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
      id: 'leaders',
      label: 'Country Leaders',
      desc: 'List All Leaders of Any Nation',
      icon: <Crown className="w-5 h-5 text-amber-400" />,
      color: 'hover:border-amber-500/50',
      activeBorder: 'border-amber-500 bg-amber-950/30',
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
      id: 'city-map',
      label: 'Find the City',
      desc: 'Pinpoint Cities on Satellite',
      icon: <MapPin className="w-5 h-5 text-emerald-400" />,
      color: 'hover:border-emerald-500/50',
      activeBorder: 'border-emerald-500 bg-emerald-950/30',
    },
    {
      id: 'flag-maker',
      label: 'Draw the Flag',
      desc: 'Random Country • Freehand/Paint',
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
      label: 'Name the Flag',
      desc: 'Gives Flag • Name Country',
      icon: <Zap className="w-5 h-5 text-rose-400" />,
      color: 'hover:border-rose-500/50',
      activeBorder: 'border-rose-500 bg-rose-950/30',
    },
    {
      id: 'world-features',
      label: 'Seas & Monuments',
      desc: 'Fill the map with oceans & landmarks',
      icon: <Waves className="w-5 h-5 text-cyan-400" />,
      color: 'hover:border-cyan-500/50',
      activeBorder: 'border-cyan-500 bg-cyan-950/30',
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
      id: 'war-history',
      label: 'War History',
      desc: 'Who fought & when',
      icon: <Swords className="w-5 h-5 text-rose-400" />,
      color: 'hover:border-rose-500/50',
      activeBorder: 'border-rose-500 bg-rose-950/30',
    },
    {
      id: 'government-leaders',
      label: 'Name the Leaders',
      desc: 'Prime Ministers Through History',
      icon: <Crown className="w-5 h-5 text-violet-400" />,
      color: 'hover:border-violet-500/50',
      activeBorder: 'border-violet-500 bg-violet-950/30',
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
        onSelectMode={(mode) => {
          setCurrentMode(mode);
          setIsLearningMode(mode === 'learning');
        }}
        xpPoints={xpPoints}
        streak={streak}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Unauthenticated Cloud Sync Teaser */}
        {!currentUser && (
          <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-purple-950/40 border border-indigo-500/20 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <span className="font-bold text-white">Save your Geography XP & Streaks:</span>{' '}
                <span className="text-slate-400">
                  Sign in with Google or Email to sync achievements across all devices.
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>
        )}

        <DifficultySelector />

        {/* Quick Mode Jump Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
          {modeCards.map((item) => {
            const isActive = currentMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentMode(item.id);
                  setIsLearningMode(item.id === 'learning');
                }}
                className={`p-2.5 rounded-2xl border text-left transition-all backdrop-blur-md shadow-sm ${
                  isActive
                    ? `${item.activeBorder} shadow-lg ring-1 ring-white/10`
                    : `bg-slate-900/50 border-slate-800/80 ${item.color} text-slate-400 hover:text-white`
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1 rounded-xl bg-slate-950/80 border border-slate-800">
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

        {/* Dynamic Quiz & Learning Views */}
        {currentMode === 'learning' ? (
          <LearningModeView
            onStartQuiz={() => {
              setCurrentMode('countries');
              setIsLearningMode(false);
            }}
          />
        ) : (
          <>
            {currentMode === 'daily' && <DailyChallenge onEarnXP={handleEarnXP} />}
            {currentMode === 'countries' && <CountryNamingQuiz onEarnXP={handleEarnXP} />}
            {currentMode === 'city-map' && (
              <Suspense fallback={<div className="mx-auto h-[560px] max-w-6xl animate-pulse rounded-3xl border border-slate-800 bg-slate-900" />}>
                <CityLocationQuiz onEarnXP={handleEarnXP} />
              </Suspense>
            )}
            {currentMode === 'capitals' && <WorldCapitalsQuiz onEarnXP={handleEarnXP} />}
            {currentMode === 'leaders' && <WorldLeadersQuiz onEarnXP={handleEarnXP} />}
            {currentMode === 'government-leaders' && <GovernmentLeadersQuiz onEarnXP={handleEarnXP} />}
            {currentMode === 'culture' && <CultureCurrencyReligionQuiz onEarnXP={handleEarnXP} />}
            {currentMode === 'outlines' && <CountryOutlineQuiz onEarnXP={handleEarnXP} />}
            {currentMode === 'flag-maker' && <FlagMakerStudio onEarnXP={handleEarnXP} />}
            {currentMode === 'nicknames' && <CountryNicknamesQuiz onEarnXP={handleEarnXP} />}
            {currentMode === 'states' && <StateNamingQuiz onEarnXP={handleEarnXP} />}
            {currentMode === 'flag-sprint' && <FlagSprintQuiz onEarnXP={handleEarnXP} />}
            {currentMode === 'physical-geo' && <PhysicalGeoQuiz onEarnXP={handleEarnXP} />}
            {currentMode === 'war-history' && <WarHistoryQuiz onEarnXP={handleEarnXP} />}
            {currentMode === 'world-features' && (
              <Suspense fallback={<div className="mx-auto h-[560px] max-w-6xl animate-pulse rounded-3xl border border-slate-800 bg-slate-900" />}>
                <WorldFeaturesQuiz onEarnXP={handleEarnXP} />
              </Suspense>
            )}
            {currentMode === 'ai-custom' && <AICustomQuiz onEarnXP={handleEarnXP} />}
          </>
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">GeoMaster Complete Atlas & Quiz Arena</span>
            <span>•</span>
            <span>197 Countries, Learning Desk & Adaptive Difficulty</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 font-mono">
              <Award className="w-3.5 h-3.5 text-amber-400" /> {xpPoints} Total XP
            </span>
            {currentUser && (
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Cloud Synced
              </span>
            )}
            <span>Powered by Gemini 3.8 Flash & Firebase</span>
            <span>Coded by Jeremiah Judy "Jj"</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GameSettingsProvider>
        <AppContent />
      </GameSettingsProvider>
    </AuthProvider>
  );
}
