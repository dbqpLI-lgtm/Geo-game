import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Crown,
  Search,
  Trophy,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Flame,
  Clock,
  Eye,
  EyeOff,
  ChevronRight,
  BookOpen,
  Filter,
  Globe2,
  Info,
  Calendar,
  Award,
  Layers,
  ArrowRight,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { COUNTRIES_WITH_LEADERS, CountryLeadersData, LeaderItem } from '../data/worldLeadersData';
import { ALL_196_COUNTRIES } from '../data/all196Countries';
import { useGameSettings } from '../context/GameSettingsContext';

interface WorldLeadersQuizProps {
  onEarnXP: (amount: number) => void;
}

// Simple Web Audio API synthesized feedback sounds
function playAudioTone(type: 'correct' | 'win' | 'hint') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'win') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      osc.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.3); // C6
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'hint') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch (e) {
    // Audio context may be restricted by browser policy before first interaction
  }
}

// Helper to clean and normalize text
function normalizeStr(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9]/g, '') // remove spaces and punctuation
    .trim();
}

export const WorldLeadersQuiz: React.FC<WorldLeadersQuizProps> = ({ onEarnXP }) => {
  const { difficulty, xpMultiplier } = useGameSettings();

  // Selected country
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('US');
  const [activeCountryData, setActiveCountryData] = useState<CountryLeadersData>(
    COUNTRIES_WITH_LEADERS['US']
  );
  const [isLoadingCountry, setIsLoadingCountry] = useState<boolean>(false);

  // Game Mode: 'free-recall' (any order) vs 'chronological' (in order) vs 'study'
  const [gamePlayMode, setGamePlayMode] = useState<'free-recall' | 'chronological' | 'study'>('free-recall');

  // Input & guess state
  const [inputText, setInputText] = useState<string>('');
  const [guessedNumbers, setGuessedNumbers] = useState<Set<number>>(new Set());
  const [revealedNumbers, setRevealedNumbers] = useState<Set<number>>(new Set());
  const [hintedNumbers, setHintedNumbers] = useState<Set<number>>(new Set());
  const [disambiguationMessage, setDisambiguationMessage] = useState<string | null>(null);
  const [lastGuessedLeader, setLastGuessedLeader] = useState<LeaderItem | null>(null);

  // Chronological mode specific pointer
  const [currentChronoIndex, setCurrentChronoIndex] = useState<number>(0);

  // Chrono skip count
  const [skipsLeft, setSkipsLeft] = useState<number>(3);

  // Timing & Game State
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [streak, setStreak] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Biography Detail Modal
  const [selectedBioLeader, setSelectedBioLeader] = useState<LeaderItem | null>(null);

  // Search/Select Country Modal
  const [isCountryModalOpen, setIsCountryModalOpen] = useState<boolean>(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  // Timer configuration based on difficulty and leader count
  const defaultSeconds = useMemo(() => {
    const count = activeCountryData?.leaders?.length || 20;
    if (difficulty === 'easy') return Math.max(600, count * 25); // generous ~10+ min
    if (difficulty === 'hard') return Math.max(180, count * 10); // blitz ~3-7 min
    return Math.max(360, count * 16); // medium ~6-12 min
  }, [difficulty, activeCountryData]);

  const [timeLeft, setTimeLeft] = useState<number>(defaultSeconds);

  // Reset or change country
  const handleSelectCountry = async (countryCode: string, countryName?: string) => {
    setIsCountryModalOpen(false);
    setIsLoadingCountry(true);
    setInputText('');
    setGuessedNumbers(new Set());
    setRevealedNumbers(new Set());
    setHintedNumbers(new Set());
    setStreak(0);
    setIsGameOver(false);
    setIsGameWon(false);
    setLastGuessedLeader(null);
    setDisambiguationMessage(null);
    setCurrentChronoIndex(0);
    setSkipsLeft(3);

    if (COUNTRIES_WITH_LEADERS[countryCode]) {
      setSelectedCountryCode(countryCode);
      setActiveCountryData(COUNTRIES_WITH_LEADERS[countryCode]);
      setIsLoadingCountry(false);
      setTimeout(() => inputRef.current?.focus(), 150);
      return;
    }

    // Otherwise, check if we need to fetch via API for any of the 196 countries
    const targetCountry = ALL_196_COUNTRIES.find((c) => c.code === countryCode || c.name === countryName);
    const targetName = targetCountry ? targetCountry.name : countryName || 'Selected Country';

    try {
      const res = await fetch('/api/country-leaders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ countryName: targetName, countryCode }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.leaders) && data.leaders.length > 0) {
          const formatted: CountryLeadersData = {
            countryName: data.countryName || targetName,
            countryCode: countryCode,
            flag: targetCountry?.flag || '🏛️',
            title: data.title || `Leaders of ${targetName}`,
            totalCount: data.leaders.length,
            intro: data.intro || `Can you name the key leaders of ${targetName}?`,
            leaders: data.leaders.map((l: any, idx: number) => ({
              number: l.number || idx + 1,
              name: l.name,
              term: l.term || 'Historic Term',
              partyOrNote: l.partyOrNote || 'Head of State / Government',
              aliases: Array.isArray(l.aliases) ? l.aliases : [l.name.toLowerCase()],
              bio: l.bio || `Notable political figure of ${targetName}.`,
            })),
          };
          setSelectedCountryCode(countryCode);
          setActiveCountryData(formatted);
          setIsLoadingCountry(false);
          setTimeout(() => inputRef.current?.focus(), 150);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to load leaders from API:', e);
    }

    // Fallback if network or AI unavailable
    setSelectedCountryCode('US');
    setActiveCountryData(COUNTRIES_WITH_LEADERS['US']);
    setIsLoadingCountry(false);
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  // Sync timer when country data changes
  useEffect(() => {
    setTimeLeft(defaultSeconds);
  }, [defaultSeconds]);

  // Timer tick
  useEffect(() => {
    if (isGameOver || isTimerPaused || gamePlayMode === 'study') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGameOverTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameOver, isTimerPaused, gamePlayMode]);

  // When time runs out
  const handleGameOverTimeExpired = () => {
    setIsGameOver(true);
    // Reveal all unrevealed leaders
    const allNums = new Set(activeCountryData.leaders.map((l) => l.number));
    setRevealedNumbers(allNums);

    // Calculate score
    const correctCount = guessedNumbers.size;
    const earned = Math.round(correctCount * 12 * xpMultiplier);
    if (earned > 0) {
      onEarnXP(earned);
    }
  };

  // Give up & reveal all
  const handleGiveUp = () => {
    setIsGameOver(true);
    const allNums = new Set(activeCountryData.leaders.map((l) => l.number));
    setRevealedNumbers(allNums);

    const correctCount = guessedNumbers.size;
    const earned = Math.round(correctCount * 10 * xpMultiplier);
    if (earned > 0) {
      onEarnXP(earned);
    }
  };

  // Reset current game
  const handleResetGame = () => {
    setInputText('');
    setGuessedNumbers(new Set());
    setRevealedNumbers(new Set());
    setHintedNumbers(new Set());
    setStreak(0);
    setIsGameOver(false);
    setIsGameWon(false);
    setLastGuessedLeader(null);
    setDisambiguationMessage(null);
    setCurrentChronoIndex(0);
    setTimeLeft(defaultSeconds);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Check input match against leaders
  const checkAnswer = (rawInput: string) => {
    const cleaned = normalizeStr(rawInput);
    if (!cleaned || cleaned.length < 2) return;

    setDisambiguationMessage(null);

    if (gamePlayMode === 'chronological') {
      // In chronological mode, must guess the current target leader
      const targetLeader = activeCountryData.leaders[currentChronoIndex];
      if (!targetLeader) return;

      const matches =
        normalizeStr(targetLeader.name) === cleaned ||
        targetLeader.aliases.some((alias) => normalizeStr(alias) === cleaned);

      if (matches) {
        // Success
        handleLeaderGuessed(targetLeader);
        setInputText('');
        // Move to next unrevealed
        let nextIdx = currentChronoIndex + 1;
        while (
          nextIdx < activeCountryData.leaders.length &&
          guessedNumbers.has(activeCountryData.leaders[nextIdx].number)
        ) {
          nextIdx++;
        }
        setCurrentChronoIndex(nextIdx);
      }
      return;
    }

    // Free Recall mode: search across ALL unguessed leaders
    const candidates = activeCountryData.leaders.filter(
      (l) => !guessedNumbers.has(l.number)
    );

    const matchedLeaders = candidates.filter((leader) => {
      // Check full name exact normalized
      if (normalizeStr(leader.name) === cleaned) return true;
      // Check aliases
      if (leader.aliases.some((alias) => normalizeStr(alias) === cleaned)) return true;
      return false;
    });

    if (matchedLeaders.length === 1) {
      const leader = matchedLeaders[0];
      handleLeaderGuessed(leader);
      setInputText('');
    } else if (matchedLeaders.length > 1) {
      // Ambiguous (e.g. "Roosevelt" or "Bush" or "Johnson" or "Trudeau")
      const names = matchedLeaders.map((m) => m.name).join(', ');
      setDisambiguationMessage(
        `Multiple leaders match ("${rawInput}"): ${names}. Try specifying first name or popular initials (e.g. "Teddy", "FDR", "W. Bush")!`
      );
    }
  };

  // Handle a successfully matched leader
  const handleLeaderGuessed = (leader: LeaderItem) => {
    const updatedGuessed = new Set(guessedNumbers);
    updatedGuessed.add(leader.number);
    setGuessedNumbers(updatedGuessed);
    setLastGuessedLeader(leader);
    setStreak((prev) => prev + 1);

    if (soundEnabled) {
      playAudioTone('correct');
    }

    // Check if game won
    if (updatedGuessed.size === activeCountryData.leaders.length) {
      setIsGameOver(true);
      setIsGameWon(true);
      if (soundEnabled) {
        playAudioTone('win');
      }
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
      });
      // Award big win XP
      const totalXP = Math.round(
        (activeCountryData.leaders.length * 20 + 200) * xpMultiplier
      );
      onEarnXP(totalXP);
    }
  };

  // Handle Hint
  const handleUseHint = () => {
    if (isGameOver) return;
    const unguessed = activeCountryData.leaders.filter(
      (l) => !guessedNumbers.has(l.number) && !hintedNumbers.has(l.number)
    );
    if (unguessed.length === 0) return;

    // Pick a leader to hint (in chrono mode, current target; in free recall, random unguessed)
    const target =
      gamePlayMode === 'chronological'
        ? activeCountryData.leaders[currentChronoIndex]
        : unguessed[Math.floor(Math.random() * unguessed.length)];

    if (!target) return;

    const newHinted = new Set(hintedNumbers);
    newHinted.add(target.number);
    setHintedNumbers(newHinted);

    if (soundEnabled) {
      playAudioTone('hint');
    }
  };

  // Handle skip in Chronological mode
  const handleSkipChrono = () => {
    if (gamePlayMode !== 'chronological' || skipsLeft <= 0 || isGameOver) return;
    setSkipsLeft((prev) => prev - 1);
    let nextIdx = currentChronoIndex + 1;
    if (nextIdx >= activeCountryData.leaders.length) {
      nextIdx = 0;
    }
    setCurrentChronoIndex(nextIdx);
  };

  // Filtered countries for the Search Country Modal
  const filteredCountries = useMemo(() => {
    if (!countrySearchQuery.trim()) return ALL_196_COUNTRIES;
    const q = countrySearchQuery.toLowerCase();
    return ALL_196_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.continent.toLowerCase().includes(q)
    );
  }, [countrySearchQuery]);

  // Featured preloaded countries for the quick-pills
  const featuredCountryCodes = [
    'US',
    'GB',
    'FR',
    'DE',
    'CA',
    'IN',
    'ZA',
    'RU',
    'JP',
    'AU',
    'MX',
    'BR',
    'KR',
    'ES',
    'AR',
    'EG',
    'IE',
    'CN',
  ];

  const totalCount = activeCountryData.leaders.length;
  const guessedCount = guessedNumbers.size;
  const progressPercent = totalCount > 0 ? Math.round((guessedCount / totalCount) * 100) : 0;

  // Format time MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6">
      {/* Quiz Top Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/70 border border-slate-800 p-6 shadow-2xl backdrop-blur-xl">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Country Title & Flag */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-4xl filter drop-shadow-md">{activeCountryData.flag}</span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {activeCountryData.title}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {totalCount} Total Leaders
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-0.5">
                  {activeCountryData.intro || `Can you name every leader in chronological order?`}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Controls */}
          <div className="flex items-center flex-wrap gap-3">
            {/* Timer */}
            {gamePlayMode !== 'study' && (
              <div
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border font-mono font-bold text-sm ${
                  timeLeft <= 60
                    ? 'bg-rose-950/70 border-rose-500/60 text-rose-300 animate-pulse'
                    : 'bg-slate-950/70 border-slate-800 text-slate-200'
                }`}
              >
                <Clock className="w-4 h-4 text-sky-400" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}

            {/* Streak */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-950/70 border border-slate-800 text-amber-400 text-xs font-bold">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{streak} Streak</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
              className="p-2 rounded-2xl bg-slate-950/70 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Country Selector Modal Trigger */}
            <button
              onClick={() => setIsCountryModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all"
            >
              <Globe2 className="w-4 h-4" />
              <span>Change Country</span>
            </button>
          </div>
        </div>

        {/* Featured Country Quick-Selector Pills */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Popular Leadership Rosters
            </span>
            <button
              onClick={() => setIsCountryModalOpen(true)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <span>View all 196 countries</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {featuredCountryCodes.map((code) => {
              const data = COUNTRIES_WITH_LEADERS[code];
              if (!data) return null;
              const isSelected = selectedCountryCode === code;
              return (
                <button
                  key={code}
                  onClick={() => handleSelectCountry(code)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-sky-400/40 font-bold'
                      : 'bg-slate-950/60 hover:bg-slate-800/80 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span className="text-sm">{data.flag}</span>
                  <span>{data.countryName}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {data.leaders.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mode Switcher & Progress Bar */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Mode Toggles */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => {
                setGamePlayMode('free-recall');
                handleResetGame();
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                gamePlayMode === 'free-recall'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Free Recall (Any Order)
            </button>
            <button
              onClick={() => {
                setGamePlayMode('chronological');
                handleResetGame();
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                gamePlayMode === 'chronological'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Chronological Order
            </button>
            <button
              onClick={() => {
                setGamePlayMode('study');
                const allNums = new Set(activeCountryData.leaders.map((l) => l.number));
                setGuessedNumbers(allNums);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                gamePlayMode === 'study'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Study / Flashcards
            </button>
          </div>

          {/* View Mode Toggle: Grid vs Table */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-400">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  viewMode === 'grid' ? 'bg-slate-800 text-white' : 'hover:text-slate-200'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  viewMode === 'table' ? 'bg-slate-800 text-white' : 'hover:text-slate-200'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              Progress: <strong className="text-white">{guessedCount}</strong> of {totalCount} Guessed
            </span>
            <span className="font-mono font-bold text-sky-400">{progressPercent}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Interactive Play Area */}
      {!isGameOver && gamePlayMode !== 'study' ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
          {/* Chronological mode prompt banner */}
          {gamePlayMode === 'chronological' && (
            <div className="flex items-center justify-between bg-sky-950/40 border border-sky-500/30 rounded-xl p-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-300 font-bold flex items-center justify-center">
                  #{activeCountryData.leaders[currentChronoIndex]?.number || 1}
                </span>
                <div>
                  <span className="text-slate-400">Currently Guessing: </span>
                  <span className="font-bold text-white">
                    Leader #{activeCountryData.leaders[currentChronoIndex]?.number} (
                    {activeCountryData.leaders[currentChronoIndex]?.term})
                  </span>
                </div>
              </div>
              <button
                onClick={handleSkipChrono}
                disabled={skipsLeft <= 0}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-[11px] font-semibold transition-all"
              >
                Skip ({skipsLeft} left)
              </button>
            </div>
          )}

          {/* Interactive Input Form */}
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                checkAnswer(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  checkAnswer(inputText);
                }
              }}
              placeholder={
                gamePlayMode === 'chronological'
                  ? `Type leader #${activeCountryData.leaders[currentChronoIndex]?.number} name...`
                  : `Type a leader's name (e.g. Lincoln, Churchill, Mandela, Macron)...`
              }
              autoFocus
              className="w-full bg-slate-950/90 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-32 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
            />
            {inputText && (
              <button
                onClick={() => setInputText('')}
                className="absolute right-28 p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Quick Action Buttons on right of input */}
            <div className="absolute right-2 flex items-center gap-1.5">
              <button
                onClick={handleUseHint}
                title="Get a hint"
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1 transition-all"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Hint</span>
              </button>
            </div>
          </div>

          {/* Disambiguation or Feedback Messages */}
          {disambiguationMessage && (
            <div className="p-3 bg-amber-950/60 border border-amber-500/50 rounded-xl text-xs text-amber-200 flex items-start gap-2 animate-shake">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{disambiguationMessage}</span>
            </div>
          )}

          {/* Last guessed recognition feedback */}
          {lastGuessedLeader && (
            <div className="flex items-center justify-between p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  Correct! <strong>{lastGuessedLeader.name}</strong> (#{lastGuessedLeader.number},{' '}
                  {lastGuessedLeader.term})
                </span>
              </div>
              <button
                onClick={() => setSelectedBioLeader(lastGuessedLeader)}
                className="text-emerald-400 hover:underline font-semibold text-[11px]"
              >
                View Bio
              </button>
            </div>
          )}

          {/* Game Controls: Give Up */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500">
              Tip: Type surnames or full names. Accents and punctuation are ignored.
            </div>
            <button
              onClick={handleGiveUp}
              className="text-xs text-rose-400 hover:text-rose-300 hover:underline font-semibold flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Give Up & Reveal Answers</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* Game Over / Victory Screen */}
      {isGameOver && (
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950/80 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center mx-auto text-indigo-400">
            {isGameWon ? <Trophy className="w-8 h-8 text-amber-400 animate-bounce" /> : <Award className="w-8 h-8 text-sky-400" />}
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white">
              {isGameWon ? 'Atlas Master! All Leaders Identified!' : 'Challenge Complete!'}
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              You correctly named <strong className="text-emerald-400">{guessedCount}</strong> of{' '}
              <strong className="text-white">{totalCount}</strong> leaders of {activeCountryData.countryName}.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 py-2">
            <div className="px-4 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-xs text-slate-500">Accuracy</div>
              <div className="text-lg font-bold text-white font-mono">{progressPercent}%</div>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
              <div className="text-xs text-amber-400">XP Awarded</div>
              <div className="text-lg font-bold text-amber-300 font-mono">
                +{Math.round((guessedCount * 12 + (isGameWon ? 200 : 0)) * xpMultiplier)} XP
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetGame}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
            <button
              onClick={() => setIsCountryModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-all flex items-center gap-2"
            >
              <Globe2 className="w-4 h-4" />
              <span>Try Another Country</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid or Table of Leaders */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {activeCountryData.leaders.map((leader) => {
            const isGuessed = guessedNumbers.has(leader.number);
            const isRevealed = revealedNumbers.has(leader.number) && !isGuessed;
            const isHinted = hintedNumbers.has(leader.number) && !isGuessed && !isRevealed;

            // Generate hint initials (e.g. "Abraham Lincoln" -> "A. L.")
            const hintInitials = leader.name
              .split(' ')
              .map((w) => w[0]?.toUpperCase() + '.')
              .join(' ');

            return (
              <div
                key={leader.number}
                onClick={() => {
                  if (isGuessed || isRevealed || gamePlayMode === 'study') {
                    setSelectedBioLeader(leader);
                  }
                }}
                className={`relative p-3.5 rounded-2xl border transition-all text-left ${
                  isGuessed
                    ? 'bg-emerald-950/30 border-emerald-500/40 hover:border-emerald-400/70 shadow-sm shadow-emerald-950/50 cursor-pointer'
                    : isRevealed
                    ? 'bg-rose-950/30 border-rose-500/40 text-slate-300 cursor-pointer'
                    : isHinted
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      isGuessed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : isRevealed
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    #{leader.number}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{leader.term}</span>
                </div>

                {/* Leader Name or Mask */}
                <div className="min-h-[28px] flex items-center">
                  {isGuessed ? (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-bold text-white text-sm tracking-tight">{leader.name}</span>
                    </div>
                  ) : isRevealed ? (
                    <div className="flex items-center gap-1.5">
                      <EyeOff className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="font-bold text-rose-200 text-sm">{leader.name}</span>
                    </div>
                  ) : isHinted ? (
                    <div className="flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-mono text-xs text-amber-300 font-bold">
                        Hint: {hintInitials}
                      </span>
                    </div>
                  ) : (
                    <span className="font-mono text-sm tracking-widest text-slate-600">
                      {difficulty === 'easy' ? `Hint: ${hintInitials}` : '••••••••••••'}
                    </span>
                  )}
                </div>

                {/* Subtitle / Party tag */}
                {leader.partyOrNote && (
                  <div className="mt-2 text-[10px] text-slate-400 truncate">
                    {isGuessed || isRevealed || difficulty === 'easy' || gamePlayMode === 'study' ? (
                      <span className="px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800">
                        {leader.partyOrNote}
                      </span>
                    ) : (
                      <span className="text-slate-600 italic">Party hidden</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Leader Name</th>
                <th className="py-3 px-4">Term in Office</th>
                <th className="py-3 px-4">Party / Office</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {activeCountryData.leaders.map((leader) => {
                const isGuessed = guessedNumbers.has(leader.number);
                const isRevealed = revealedNumbers.has(leader.number) && !isGuessed;

                return (
                  <tr
                    key={leader.number}
                    className={`hover:bg-slate-800/30 transition-colors ${
                      isGuessed
                        ? 'bg-emerald-950/20'
                        : isRevealed
                        ? 'bg-rose-950/20'
                        : 'opacity-80'
                    }`}
                  >
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-400">
                      #{leader.number}
                    </td>
                    <td className="py-2.5 px-4 font-semibold">
                      {isGuessed ? (
                        <span className="text-emerald-400 font-bold">{leader.name}</span>
                      ) : isRevealed ? (
                        <span className="text-rose-300 font-bold">{leader.name}</span>
                      ) : (
                        <span className="font-mono text-slate-600">••••••••••••</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-400">{leader.term}</td>
                    <td className="py-2.5 px-4 text-slate-400">{leader.partyOrNote || '—'}</td>
                    <td className="py-2.5 px-4 text-right">
                      {(isGuessed || isRevealed || gamePlayMode === 'study') && (
                        <button
                          onClick={() => setSelectedBioLeader(leader)}
                          className="text-indigo-400 hover:text-indigo-300 font-semibold"
                        >
                          Bio
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Leader Bio Modal */}
      {selectedBioLeader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4 text-left">
            <button
              onClick={() => setSelectedBioLeader(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <span className="text-3xl">{activeCountryData.flag}</span>
              <div>
                <span className="text-xs font-mono font-bold text-indigo-400">
                  Leader #{selectedBioLeader.number} • {activeCountryData.countryName}
                </span>
                <h3 className="text-xl font-extrabold text-white">{selectedBioLeader.name}</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-500">Term in Office</div>
                <div className="font-mono font-bold text-slate-200 mt-0.5">
                  {selectedBioLeader.term}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-500">Affiliation / Title</div>
                <div className="font-bold text-slate-200 mt-0.5 truncate">
                  {selectedBioLeader.partyOrNote || 'Head of State'}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Historical Significance & Achievements</span>
              </div>
              <p className="leading-relaxed">
                {selectedBioLeader.bio ||
                  `${selectedBioLeader.name} served as a pivotal leader for ${activeCountryData.countryName} during the tenure ${selectedBioLeader.term}.`}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedBioLeader(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Close Biography
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Select Any Country Modal (196 countries) */}
      {isCountryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl flex flex-col text-left space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-indigo-400" />
                  <span>Select Any Country (196 Sovereign Nations)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Pick any country to list all its historical & modern leaders!
                </p>
              </div>
              <button
                onClick={() => setIsCountryModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={countrySearchQuery}
                onChange={(e) => setCountrySearchQuery(e.target.value)}
                placeholder="Search countries by name or continent..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Country List Scroll */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[50vh]">
              {filteredCountries.map((country) => {
                const hasPreloaded = !!COUNTRIES_WITH_LEADERS[country.code];
                return (
                  <button
                    key={country.code}
                    onClick={() => handleSelectCountry(country.code, country.name)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{country.flag}</span>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-sky-300">
                          {country.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {country.continent} • Capital: {country.capital}
                        </div>
                      </div>
                    </div>
                    {hasPreloaded ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                        {COUNTRIES_WITH_LEADERS[country.code].leaders.length} Leaders
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                        On-Demand AI
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
