import React, { useState, useEffect, useRef } from 'react';
import {
  Palette,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Lightbulb,
  Trophy,
  HelpCircle,
  Eye,
  EyeOff,
  Shuffle,
  Brush,
  Eraser,
  Flame,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FLAG_CHALLENGES, COLOR_SWATCHES, FlagChallenge } from '../data/geographyData';
import { useGameSettings } from '../context/GameSettingsContext';

interface FlagMakerStudioProps {
  onEarnXP: (amount: number) => void;
}

export const FlagMakerStudio: React.FC<FlagMakerStudioProps> = ({ onEarnXP }) => {
  const { difficulty, hintsAllowed, isLearningMode } = useGameSettings();
  // Random country challenge selection (no manual country picking list with spoiled flag emojis)
  const [currentChallenge, setCurrentChallenge] = useState<FlagChallenge>(() => {
    const randomIndex = Math.floor(Math.random() * FLAG_CHALLENGES.length);
    return FLAG_CHALLENGES[randomIndex];
  });

  const [activeTab, setActiveTab] = useState<'build' | 'freehand'>('build');
  const [streak, setStreak] = useState(0);

  // Studio Construction State
  const [layout, setLayout] = useState<FlagChallenge['requiredLayout']>('horizontal-3');
  const [stripes, setStripes] = useState<string[]>(['#FFFFFF', '#FFFFFF', '#FFFFFF']);
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [emblem, setEmblem] = useState<'none' | 'sun' | 'star' | 'circle' | 'cross'>('none');
  const [hasVerified, setHasVerified] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showSolutionPeek, setShowSolutionPeek] = useState(false);

  // Freehand Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#ED2939');
  const [brushSize, setBrushSize] = useState(12);
  const [isEraser, setIsEraser] = useState(false);

  // Roll a new random country challenge
  const handleNextRandomChallenge = () => {
    let nextIndex = Math.floor(Math.random() * FLAG_CHALLENGES.length);
    // Try to ensure it is different from current
    if (FLAG_CHALLENGES.length > 1 && FLAG_CHALLENGES[nextIndex].id === currentChallenge.id) {
      nextIndex = (nextIndex + 1) % FLAG_CHALLENGES.length;
    }
    const nextChallenge = FLAG_CHALLENGES[nextIndex];
    setCurrentChallenge(nextChallenge);

    // Reset studio state
    setLayout('horizontal-3');
    setStripes(['#FFFFFF', '#FFFFFF', '#FFFFFF']);
    setActiveSlot(0);
    setEmblem('none');
    setHasVerified(false);
    setIsCorrect(false);
    setFeedbackMessage('');
    setShowHint(false);
    setShowSolutionPeek(false);

    // Clear freehand canvas if present
    clearCanvas();
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'freehand' && canvasRef.current) {
      clearCanvas();
    }
  }, [activeTab]);

  const handlePaintColor = (hex: string) => {
    const updated = [...stripes];
    updated[activeSlot] = hex;
    setStripes(updated);
    setHasVerified(false);
  };

  // Compare color similarity
  const hexDistance = (hex1: string, hex2: string) => {
    const parse = (h: string) => {
      const clean = h.replace('#', '');
      return [
        parseInt(clean.slice(0, 2), 16) || 0,
        parseInt(clean.slice(2, 4), 16) || 0,
        parseInt(clean.slice(4, 6), 16) || 0,
      ];
    };
    const [r1, g1, b1] = parse(hex1);
    const [r2, g2, b2] = parse(hex2);
    return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
  };

  const isColorClose = (hex1: string, hex2: string) => {
    return hexDistance(hex1, hex2) < 95; // generous threshold for shades of red/blue/gold
  };

  // Check user flag against target
  const handleVerifyFlag = () => {
    setHasVerified(true);
    const target = currentChallenge;

    // Check layout
    // Allow horizontal-3-emblem to match horizontal-3 if emblem is correct
    let layoutMatches = layout === target.requiredLayout;
    if (target.requiredLayout === 'horizontal-3-emblem' && layout === 'horizontal-3' && emblem !== 'none') {
      layoutMatches = true;
    }

    if (!layoutMatches) {
      setIsCorrect(false);
      setFeedbackMessage(
        `Geometry mismatch! The flag of ${target.countryName} uses a different layout (e.g. stripes orientation or cross). Try switching layouts!`
      );
      return;
    }

    // Check colors
    let colorsMatch = true;
    if (target.requiredLayout === 'horizontal-2') {
      if (!isColorClose(stripes[0], target.colors[0]) || !isColorClose(stripes[1], target.colors[1])) {
        colorsMatch = false;
      }
    } else if (target.requiredLayout === 'center-circle') {
      if (!isColorClose(stripes[0], target.colors[0]) || !isColorClose(stripes[1], target.colors[1])) {
        colorsMatch = false;
      }
    } else if (target.requiredLayout === 'nordic-cross') {
      if (!isColorClose(stripes[0], target.colors[0]) || !isColorClose(stripes[1], target.colors[1])) {
        colorsMatch = false;
      }
    } else {
      // 3 stripes
      for (let i = 0; i < 3; i++) {
        if (target.colors[i] && !isColorClose(stripes[i], target.colors[i])) {
          colorsMatch = false;
          break;
        }
      }
    }

    if (!colorsMatch) {
      setIsCorrect(false);
      setFeedbackMessage(
        `Color mismatch! One or more colors do not match the official flag of ${target.countryName}. Check your pigment choices!`
      );
      return;
    }

    // Check emblem if required
    if (target.hasEmblem && emblem === 'none') {
      setIsCorrect(false);
      setFeedbackMessage(
        `Almost there! The flag of ${target.countryName} has a central symbol/emblem. Try adding an emblem!`
      );
      return;
    }

    // Success!
    setIsCorrect(true);
    setFeedbackMessage(`Perfect 100% Match! You have masterfully constructed the flag of ${target.countryName}!`);
    setStreak((prev) => prev + 1);
    setShowSolutionPeek(true);
    onEarnXP(60 + streak * 10);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: target.colors,
    });
  };

  // Freehand Canvas Event Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (isEraser) {
      ctx.strokeStyle = '#FFFFFF';
    } else {
      ctx.strokeStyle = brushColor;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  // Render flag geometry preview
  const renderFlagCanvas = () => {
    switch (layout) {
      case 'horizontal-3':
      case 'horizontal-3-emblem':
        return (
          <div className="relative w-full h-full flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80">
            {[0, 1, 2].map((slot) => (
              <div
                key={slot}
                onClick={() => setActiveSlot(slot)}
                className={`flex-1 w-full cursor-pointer transition-all relative group ${
                  activeSlot === slot ? 'ring-4 ring-inset ring-sky-400 z-10' : ''
                }`}
                style={{ backgroundColor: stripes[slot] }}
              >
                <span className="absolute top-1 left-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 transition">
                  Stripe {slot + 1}
                </span>
              </div>
            ))}
            {emblem !== 'none' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {emblem === 'sun' && <div className="w-16 h-16 rounded-full bg-amber-400 shadow-md flex items-center justify-center text-amber-950 font-bold text-xs">☀️</div>}
                {emblem === 'star' && <div className="text-4xl text-amber-400 drop-shadow">★</div>}
                {emblem === 'circle' && <div className="w-14 h-14 rounded-full bg-red-600 shadow-md" />}
                {emblem === 'cross' && <div className="text-4xl text-white font-bold drop-shadow">✚</div>}
              </div>
            )}
          </div>
        );

      case 'vertical-3':
        return (
          <div className="relative w-full h-full flex flex-row rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80">
            {[0, 1, 2].map((slot) => (
              <div
                key={slot}
                onClick={() => setActiveSlot(slot)}
                className={`flex-1 h-full cursor-pointer transition-all relative group ${
                  activeSlot === slot ? 'ring-4 ring-inset ring-sky-400 z-10' : ''
                }`}
                style={{ backgroundColor: stripes[slot] }}
              >
                <span className="absolute top-2 left-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 transition">
                  Stripe {slot + 1}
                </span>
              </div>
            ))}
            {emblem !== 'none' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {emblem === 'sun' && <div className="w-16 h-16 rounded-full bg-amber-400 shadow-md flex items-center justify-center text-amber-950 font-bold text-xs">☀️</div>}
                {emblem === 'star' && <div className="text-4xl text-amber-400 drop-shadow">★</div>}
                {emblem === 'circle' && <div className="w-14 h-14 rounded-full bg-red-600 shadow-md" />}
                {emblem === 'cross' && <div className="text-4xl text-white font-bold drop-shadow">✚</div>}
              </div>
            )}
          </div>
        );

      case 'horizontal-2':
        return (
          <div className="relative w-full h-full flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80">
            {[0, 1].map((slot) => (
              <div
                key={slot}
                onClick={() => setActiveSlot(slot)}
                className={`flex-1 w-full cursor-pointer transition-all relative group ${
                  activeSlot === slot ? 'ring-4 ring-inset ring-sky-400 z-10' : ''
                }`}
                style={{ backgroundColor: stripes[slot] }}
              >
                <span className="absolute top-2 left-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 transition">
                  Stripe {slot + 1}
                </span>
              </div>
            ))}
          </div>
        );

      case 'center-circle':
        return (
          <div
            className={`relative w-full h-full flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 cursor-pointer ${
              activeSlot === 0 ? 'ring-4 ring-inset ring-sky-400' : ''
            }`}
            style={{ backgroundColor: stripes[0] }}
            onClick={() => setActiveSlot(0)}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                setActiveSlot(1);
              }}
              className={`w-28 h-28 rounded-full transition-all cursor-pointer ${
                activeSlot === 1 ? 'ring-4 ring-sky-400 scale-105' : ''
              }`}
              style={{ backgroundColor: stripes[1] }}
            />
            <span className="absolute top-2 left-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-white">
              {activeSlot === 0 ? 'Field (Slot 1)' : 'Center Disc (Slot 2)'}
            </span>
          </div>
        );

      case 'nordic-cross':
        return (
          <div
            className={`relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 cursor-pointer ${
              activeSlot === 0 ? 'ring-4 ring-inset ring-sky-400' : ''
            }`}
            style={{ backgroundColor: stripes[0] }}
            onClick={() => setActiveSlot(0)}
          >
            {/* Vertical cross bar */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setActiveSlot(1);
              }}
              className={`absolute top-0 bottom-0 left-[30%] w-10 transition-all cursor-pointer ${
                activeSlot === 1 ? 'ring-2 ring-sky-400' : ''
              }`}
              style={{ backgroundColor: stripes[1] }}
            />
            {/* Horizontal cross bar */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setActiveSlot(1);
              }}
              className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-10 transition-all cursor-pointer ${
                activeSlot === 1 ? 'ring-2 ring-sky-400' : ''
              }`}
              style={{ backgroundColor: stripes[1] }}
            />
            <span className="absolute top-2 left-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-white z-20">
              {activeSlot === 0 ? 'Field (Slot 1)' : 'Cross (Slot 2)'}
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner with RANDOM Country Challenge (NO flag emoji spoil) */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900/80 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Flag Drawing Studio
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                currentChallenge.difficulty === 'Easy'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : currentChallenge.difficulty === 'Medium'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {currentChallenge.difficulty} Challenge
            </span>
          </div>

          {/* Explicit prompt with country name ONLY — no emoji spoil! */}
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <span>Draw the Flag of</span>
            <span className="text-emerald-400 underline decoration-emerald-500/40 underline-offset-4">
              {currentChallenge.countryName}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Can you recreate the official national banner from memory? Pick the geometry and pigment, or switch to freehand drawing!
          </p>
        </div>

        {/* Action Controls: Shuffle Next Country & Streak */}
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <div className="px-3 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <Flame className="w-4 h-4 text-orange-400 fill-current" />
              <span>{streak} Streak</span>
            </div>
          )}

          <button
            onClick={handleNextRandomChallenge}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition-all shadow-md active:scale-95 hover:border-emerald-500/40"
          >
            <Shuffle className="w-4 h-4 text-emerald-400" />
            <span>Next Random Country</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher: Geometry & Paint vs Freehand Canvas */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('build')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'build'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Geometry & Paint Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('freehand')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'freehand'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Brush className="w-4 h-4" />
            <span>Freehand Drawing Canvas</span>
          </button>
        </div>

        {/* Peek Solution & Need a Hint buttons */}
        <div className="flex items-center gap-2">
          {hintsAllowed ? (
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
            </button>
          ) : (
            <span className="text-[11px] text-rose-400 font-medium italic px-2">
              🔒 Hints locked in Hard Mode
            </span>
          )}

          <button
            onClick={() => setShowSolutionPeek(!showSolutionPeek)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {showSolutionPeek ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-rose-400" />
                <span>Hide Solution Flag</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                <span>Peek Real Flag</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Hint Box */}
      {showHint && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3 animate-in fade-in">
          <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-amber-300">Flag Construction Clue:</div>
            <div>{currentChallenge.hint}</div>
            <div className="text-[11px] text-amber-400/80">Colors used: {currentChallenge.colorToleranceNames.join(', ')}</div>
          </div>
        </div>
      )}

      {/* Solution Peek Reveal Box (Only shown if toggled or after solving!) */}
      {showSolutionPeek && (
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-white text-xs flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-4">
            <span className="text-5xl filter drop-shadow">{currentChallenge.flagEmoji}</span>
            <div>
              <div className="font-bold text-base text-white">Official Flag of {currentChallenge.countryName}</div>
              <p className="text-slate-400 text-xs mt-0.5">{currentChallenge.description}</p>
            </div>
          </div>
          <button
            onClick={handleNextRandomChallenge}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
          >
            <span>Try Another Country</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* MAIN VIEW: Geometry & Paint Studio */}
      {activeTab === 'build' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Flag Preview Canvas Area */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center space-y-4">
            <div className="w-full max-w-md aspect-[3/2] relative p-1">{renderFlagCanvas()}</div>

            <div className="text-center">
              <span className="text-xs text-slate-400">
                Click any stripe or field inside the flag above to select it, then tap a pigment below!
              </span>
            </div>

            {/* Verification Result Message */}
            {hasVerified && (
              <div
                className={`w-full p-4 rounded-2xl border text-xs flex items-center gap-3 animate-in fade-in ${
                  isCorrect
                    ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                    : 'bg-rose-950/50 border-rose-500 text-rose-200'
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <div className="flex-1 font-semibold">{feedbackMessage}</div>
                {isCorrect && (
                  <button
                    onClick={handleNextRandomChallenge}
                    className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                  >
                    Next Flag
                  </button>
                )}
              </div>
            )}

            {/* Test & Verify Button */}
            <div className="w-full pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setStripes(['#FFFFFF', '#FFFFFF', '#FFFFFF']);
                  setEmblem('none');
                  setHasVerified(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Canvas</span>
              </button>

              <button
                onClick={handleVerifyFlag}
                className="flex-1 max-w-xs py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Test Flag (+60 XP)</span>
              </button>
            </div>
          </div>

          {/* Controls: Geometry, Palette, & Emblems */}
          <div className="lg:col-span-5 space-y-5">
            {/* 1. Layout Geometry Selector */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 backdrop-blur-xl">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                Step 1: Choose Flag Geometry
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'horizontal-3', label: '3 Horizontal Stripes' },
                  { id: 'vertical-3', label: '3 Vertical Stripes' },
                  { id: 'horizontal-2', label: '2 Horizontal Stripes' },
                  { id: 'nordic-cross', label: 'Nordic Cross' },
                  { id: 'center-circle', label: 'Field + Center Disc' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setLayout(item.id as FlagChallenge['requiredLayout']);
                      setHasVerified(false);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-left transition-all ${
                      layout === item.id
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-1 ring-emerald-400/40'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Color Palette */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Step 2: Paint Active Slot ({activeSlot + 1})
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  Selected: {stripes[activeSlot]}
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {COLOR_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.hex}
                    onClick={() => handlePaintColor(swatch.hex)}
                    title={swatch.name}
                    className="group flex flex-col items-center gap-1 p-2 rounded-xl border border-slate-800 hover:border-slate-600 bg-slate-950/60 transition-all hover:scale-105 active:scale-95"
                  >
                    <div
                      className="w-7 h-7 rounded-lg shadow-md border border-white/10 group-hover:ring-2 group-hover:ring-white/40"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <span className="text-[9px] font-medium text-slate-400 truncate w-full text-center">
                      {swatch.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Emblem / Symbol Overlay */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 backdrop-blur-xl">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                Step 3: Central Emblem (Optional)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'none', label: 'None', icon: '—' },
                  { id: 'sun', label: 'Sun', icon: '☀️' },
                  { id: 'star', label: 'Star', icon: '★' },
                  { id: 'circle', label: 'Circle', icon: '🔴' },
                  { id: 'cross', label: 'Cross', icon: '✚' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setEmblem(item.id as any);
                      setHasVerified(false);
                    }}
                    className={`py-2 px-1 rounded-xl text-center border text-xs font-bold transition-all ${
                      emblem === item.id
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-1 ring-emerald-400/40'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-base mb-0.5">{item.icon}</div>
                    <div className="text-[10px]">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* FREEHAND DRAWING CANVAS MODE */
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Brush className="w-4 h-4 text-emerald-400" />
                <span>Draw the Flag of {currentChallenge.countryName} Freehand</span>
              </h3>
              <p className="text-xs text-slate-400">
                Use the canvas brush to draw stripes, shields, emblems, and colors from memory!
              </p>
            </div>

            {/* Canvas Toolbar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEraser(false)}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  !isEraser
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Brush className="w-4 h-4" />
                <span>Brush</span>
              </button>

              <button
                onClick={() => setIsEraser(true)}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  isEraser
                    ? 'bg-rose-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Eraser className="w-4 h-4" />
                <span>Eraser</span>
              </button>

              <button
                onClick={clearCanvas}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Color Palette & Brush Size for Freehand */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-slate-400 font-bold uppercase mr-1">Colors:</span>
              {[
                '#ED2939', // Red
                '#002654', // Navy
                '#0057B7', // Blue
                '#008751', // Green
                '#FFD700', // Gold/Yellow
                '#000000', // Black
                '#FFFFFF', // White
                '#FF883E', // Orange
                '#74ACDF', // Sky Blue
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setBrushColor(color);
                    setIsEraser(false);
                  }}
                  className={`w-7 h-7 rounded-lg shadow-sm border border-white/20 transition-transform ${
                    brushColor === color && !isEraser ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Brush Size:</span>
              <input
                type="range"
                min="4"
                max="36"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
                className="w-24 accent-emerald-500"
              />
              <span className="text-xs font-mono text-slate-300 w-6">{brushSize}px</span>
            </div>
          </div>

          {/* Canvas Board */}
          <div className="w-full flex justify-center py-2">
            <div className="w-full max-w-2xl aspect-[3/2] border-2 border-slate-700 rounded-2xl overflow-hidden shadow-2xl bg-white cursor-crosshair">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="w-full h-full touch-none"
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onMouseMove={draw}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={draw}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setShowSolutionPeek(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-bold flex items-center gap-2 transition"
            >
              <Eye className="w-4 h-4" />
              <span>Compare with Official Flag</span>
            </button>

            <button
              onClick={() => {
                onEarnXP(50);
                confetti({ particleCount: 70, spread: 60 });
                handleNextRandomChallenge();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Done! Next Random Challenge (+50 XP)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
