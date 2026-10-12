import React, { useState } from 'react';
import { Flag, Palette, Sparkles, CheckCircle2, RotateCcw, Lightbulb, Trophy, HelpCircle, Eye, EyeOff } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FLAG_CHALLENGES, COLOR_SWATCHES, FlagChallenge } from '../data/geographyData';

interface FlagMakerStudioProps {
  onEarnXP: (amount: number) => void;
}

export const FlagMakerStudio: React.FC<FlagMakerStudioProps> = ({ onEarnXP }) => {
  const [selectedChallengeIndex, setSelectedChallengeIndex] = useState(0);
  const currentChallenge: FlagChallenge = FLAG_CHALLENGES[selectedChallengeIndex];

  // Studio State
  const [layout, setLayout] = useState<FlagChallenge['requiredLayout']>('horizontal-3');
  const [stripes, setStripes] = useState<string[]>(['#FFFFFF', '#FFFFFF', '#FFFFFF']);
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [emblem, setEmblem] = useState<'none' | 'sun' | 'star' | 'circle' | 'cross'>('none');
  const [hasVerified, setHasVerified] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showTargetPeek, setShowTargetPeek] = useState(false);

  // Switch challenge
  const handleSelectChallenge = (index: number) => {
    setSelectedChallengeIndex(index);
    const target = FLAG_CHALLENGES[index];
    // Reset canvas to blank white
    setLayout('horizontal-3');
    setStripes(['#FFFFFF', '#FFFFFF', '#FFFFFF']);
    setActiveSlot(0);
    setEmblem('none');
    setHasVerified(false);
    setIsCorrect(false);
    setFeedbackMessage('');
    setShowHint(false);
    setShowTargetPeek(false);
  };

  const handlePaintColor = (hex: string) => {
    const updated = [...stripes];
    updated[activeSlot] = hex;
    setStripes(updated);
    setHasVerified(false);
  };

  // Check user flag against target
  const handleVerifyFlag = () => {
    setHasVerified(true);
    const target = currentChallenge;

    // 1. Check layout
    if (layout !== target.requiredLayout) {
      setIsCorrect(false);
      setFeedbackMessage(`Layout mismatch! ${target.countryName}'s flag does not use this geometry. Look closely at the stripe orientation.`);
      return;
    }

    // 2. Check colors
    // Normalize hex comparisons
    const normalizeHex = (hex: string) => hex.toLowerCase();
    let colorsMatch = true;

    if (target.requiredLayout === 'horizontal-2') {
      if (
        normalizeHex(stripes[0]) !== normalizeHex(target.colors[0]) ||
        normalizeHex(stripes[1]) !== normalizeHex(target.colors[1])
      ) {
        colorsMatch = false;
      }
    } else if (target.requiredLayout === 'center-circle') {
      if (
        normalizeHex(stripes[0]) !== normalizeHex(target.colors[0]) || // background field
        normalizeHex(stripes[1]) !== normalizeHex(target.colors[1])   // circle disc
      ) {
        colorsMatch = false;
      }
    } else if (target.requiredLayout === 'nordic-cross') {
      if (
        normalizeHex(stripes[0]) !== normalizeHex(target.colors[0]) || // field
        normalizeHex(stripes[1]) !== normalizeHex(target.colors[1])   // cross
      ) {
        colorsMatch = false;
      }
    } else {
      // 3 stripes
      for (let i = 0; i < 3; i++) {
        if (target.colors[i] && normalizeHex(stripes[i]) !== normalizeHex(target.colors[i])) {
          colorsMatch = false;
          break;
        }
      }
    }

    if (!colorsMatch) {
      setIsCorrect(false);
      setFeedbackMessage(`Color mismatch! One or more segments do not match the official colors of ${target.countryName}. Check your palette!`);
      return;
    }

    // 3. Check emblem if needed
    if (target.hasEmblem && target.emblemType) {
      if (emblem !== target.emblemType) {
        setIsCorrect(false);
        setFeedbackMessage(`Almost there! ${target.countryName}'s flag requires a specific central emblem.`);
        return;
      }
    }

    // If passed all tests: PERFECT!
    setIsCorrect(true);
    setFeedbackMessage(`🎉 100% PERFECT MATCH! You successfully built the official flag of ${target.countryName}!`);
    onEarnXP(100);

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
    });
  };

  const handleReset = () => {
    setStripes(['#FFFFFF', '#FFFFFF', '#FFFFFF']);
    setEmblem('none');
    setHasVerified(false);
    setIsCorrect(false);
    setFeedbackMessage('');
  };

  // Render the interactive flag based on layout state
  const renderInteractiveFlag = () => {
    switch (layout) {
      case 'vertical-3':
      case 'vertical-3-emblem':
        return (
          <div className="relative w-full h-full flex rounded-xl overflow-hidden shadow-2xl border border-slate-700">
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
            {emblem === 'sun' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-4xl filter drop-shadow">☀️</span>
              </div>
            )}
            {emblem === 'star' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-4xl text-yellow-300 filter drop-shadow">★</span>
              </div>
            )}
          </div>
        );

      case 'horizontal-3':
      case 'horizontal-3-emblem':
        return (
          <div className="relative w-full h-full flex flex-col rounded-xl overflow-hidden shadow-2xl border border-slate-700">
            {[0, 1, 2].map((slot) => (
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
            {emblem === 'sun' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-4xl filter drop-shadow">☀️</span>
              </div>
            )}
            {emblem === 'star' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-4xl text-yellow-300 filter drop-shadow">★</span>
              </div>
            )}
          </div>
        );

      case 'horizontal-2':
        return (
          <div className="relative w-full h-full flex flex-col rounded-xl overflow-hidden shadow-2xl border border-slate-700">
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
            className={`relative w-full h-full flex items-center justify-center rounded-xl overflow-hidden shadow-2xl border border-slate-700 cursor-pointer ${
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
            className={`relative w-full h-full rounded-xl overflow-hidden shadow-2xl border border-slate-700 cursor-pointer ${
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
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900/80 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Flag Construction Studio
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
              Challenge {selectedChallengeIndex + 1} of {FLAG_CHALLENGES.length}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white">
            Construct the Flag of {currentChallenge.countryName}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {currentChallenge.description} Pick the layout, click each section to apply pigment, and add emblems to recreate history!
          </p>
        </div>

        {/* Challenge selector pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none max-w-md">
          {FLAG_CHALLENGES.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => handleSelectChallenge(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedChallengeIndex === idx
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span>{ch.flagEmoji}</span>
              <span>{ch.countryName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Flag Canvas (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Flag Drawing Board</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTargetPeek(!showTargetPeek)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
                >
                  {showTargetPeek ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showTargetPeek ? 'Hide Target' : 'Peek Target Flag'}</span>
                </button>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 text-amber-300 hover:text-amber-200 text-xs font-semibold transition"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Hint</span>
                </button>
              </div>
            </div>

            {/* Target peek banner */}
            {showTargetPeek && (
              <div className="mb-4 p-3 rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{currentChallenge.flagEmoji}</span>
                  <div>
                    <div className="text-xs font-bold text-white">Official Flag of {currentChallenge.countryName}</div>
                    <div className="text-[11px] text-slate-400">{currentChallenge.hint}</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">Reference</span>
              </div>
            )}

            {/* Hint Box */}
            {showHint && (
              <div className="mb-4 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-center gap-2 animate-fadeIn">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{currentChallenge.hint}</span>
              </div>
            )}

            {/* The Live Interactive Flag Container */}
            <div className="w-full max-w-md mx-auto aspect-[3/2] my-4">
              {renderInteractiveFlag()}
            </div>

            <p className="text-center text-xs text-slate-400 mt-2">
              💡 Click on any stripe or section to select it, then choose a color from the palette below!
            </p>
          </div>

          {/* Action Buttons & Feedback */}
          <div className="mt-6 pt-4 border-t border-slate-800/80">
            {hasVerified && (
              <div
                className={`mb-4 p-4 rounded-2xl border text-xs leading-relaxed flex items-center gap-3 ${
                  isCorrect
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <HelpCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <span>{feedbackMessage}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Clear Canvas</span>
              </button>

              <button
                onClick={handleVerifyFlag}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition active:scale-95"
              >
                <Trophy className="w-4 h-4" />
                <span>Test & Verify Flag (+100 XP)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Studio Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Step 1: Layout Picker */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-xl shadow-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <span>Step 1:</span> Choose Flag Layout
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'vertical-3', label: 'Vertical Tricolor', desc: '3 vertical stripes (France, Italy)' },
                { id: 'horizontal-3', label: 'Horizontal Tricolor', desc: '3 horizontal stripes (Germany, Netherlands)' },
                { id: 'horizontal-2', label: 'Horizontal Bicolor', desc: '2 horizontal stripes (Ukraine, Poland)' },
                { id: 'center-circle', label: 'Central Disc', desc: 'Center circle on field (Japan, Bangladesh)' },
                { id: 'nordic-cross', label: 'Nordic Cross', desc: 'Scandinavian cross (Sweden, Norway)' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLayout(item.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    layout === item.id
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="text-xs font-bold text-white mb-0.5">{item.label}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Color Palette */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-sky-400" />
                <span>Step 2:</span> Paint Selected Segment ({activeSlot + 1})
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/40">
                Active Slot {activeSlot + 1}
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {COLOR_SWATCHES.map((swatch) => (
                <button
                  key={swatch.hex}
                  onClick={() => handlePaintColor(swatch.hex)}
                  title={swatch.name}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-600 transition active:scale-95 group"
                >
                  <div
                    className="w-8 h-8 rounded-lg shadow border border-white/20 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span className="text-[9px] font-medium text-slate-400 truncate max-w-full">
                    {swatch.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Emblems */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-xl shadow-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              <span>Step 3:</span> Optional Emblem Overlay
            </h4>
            <div className="flex items-center gap-2">
              {[
                { id: 'none', label: 'None' },
                { id: 'sun', label: '☀️ Sun of May' },
                { id: 'star', label: '★ Star' },
              ].map((emb) => (
                <button
                  key={emb.id}
                  onClick={() => setEmblem(emb.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    emblem === emb.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {emb.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
