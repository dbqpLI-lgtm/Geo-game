import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Pause, Play, Sparkles, Music2, Mail, Video, Trophy, Compass, Share2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DayDataPayload, DaySummaryResult } from '../types';

interface WrappedStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayData: DayDataPayload;
  summary: DaySummaryResult;
}

export const WrappedStoryModal: React.FC<WrappedStoryModalProps> = ({
  isOpen,
  onClose,
  dayData,
  summary,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const totalSlides = 5;

  // Auto-advance timer
  useEffect(() => {
    if (!isOpen || isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev < totalSlides - 1) {
          return prev + 1;
        } else {
          return prev;
        }
      });
    }, 6500);

    return () => clearInterval(timer);
  }, [isOpen, isPaused, currentSlide]);

  // Trigger confetti when arriving at the final card
  useEffect(() => {
    if (isOpen && currentSlide === totalSlides - 1) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#6366f1', '#ec4899', '#10b981', '#f59e0b'],
      });
    }
  }, [isOpen, currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyStory = () => {
    const text = `🌟 DayFlow Daily Recap (${dayData.date})\n\n"${summary.headline}"\n\n🎯 Score: ${summary.dayScore}/100 [${summary.vibeCategory}]\n🎵 Spotify: ${dayData.spotify.minutesListened}m | Top: ${dayData.spotify.topTracks[0]?.title} - ${dayData.spotify.topTracks[0]?.artist}\n✉️ Gmail: ${dayData.gmail.receivedCount} received | ${dayData.gmail.stressRating} stress\n📱 TikTok: ${dayData.tiktok.screenTimeMinutes}m | Rabbit hole: ${dayData.tiktok.rabbitHoleTheme}\n🏃 Steps: ${dayData.health.steps.toLocaleString()}\n\nGenerated with DayFlow AI`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6 animate-fadeIn">
      {/* Container simulating a sleek vertical mobile story */}
      <div className="relative w-full max-w-md h-[90vh] max-h-[820px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between select-none border border-white/10">
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 z-30 flex items-center gap-1.5">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <div
              key={idx}
              className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm cursor-pointer"
              onClick={() => setCurrentSlide(idx)}
            >
              <div
                className={`h-full bg-white transition-all duration-300 rounded-full ${
                  idx < currentSlide
                    ? 'w-full'
                    : idx === currentSlide
                    ? 'w-full animate-pulse'
                    : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Top Control Bar */}
        <div className="absolute top-8 left-4 right-4 z-30 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Day Capsule</span>
              <span className="text-white/60">•</span>
              <span className="text-white/80">{currentSlide + 1}/{totalSlides}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 text-white/80 hover:text-white transition"
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 text-white/80 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Content Screens */}
        <div className="relative w-full h-full flex-1 flex flex-col justify-center px-6 pt-20 pb-20 text-white">
          {/* SLIDE 1: Headline & Archetype */}
          {currentSlide === 0 && (
            <div className="flex flex-col items-center text-center animate-fadeIn">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-950 -z-10" />
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-6">
                Your Day in Review
              </div>

              {/* Day Score Circle */}
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full border-4 border-indigo-400/40 flex flex-col items-center justify-center bg-indigo-950/60 backdrop-blur-md shadow-2xl shadow-indigo-500/20">
                  <span className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
                    {summary.dayScore}
                  </span>
                  <span className="text-xs uppercase tracking-wider font-semibold text-indigo-300">
                    Day Score
                  </span>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-[11px] font-bold shadow whitespace-nowrap">
                  {summary.dayScoreTitle}
                </div>
              </div>

              <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 mb-6">
                Archetype: {summary.vibeCategory}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold leading-snug text-white/95 max-w-sm drop-shadow-md">
                "{summary.headline}"
              </h2>

              <p className="mt-6 text-xs text-white/60 tracking-wide font-mono">
                {dayData.userPersonaName} • {dayData.date}
              </p>
            </div>
          )}

          {/* SLIDE 2: Spotify Soundscape */}
          {currentSlide === 1 && (
            <div className="flex flex-col items-center text-center animate-fadeIn">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 -z-10" />

              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
                <Music2 className="w-6 h-6" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-300 mb-2">
                Your Auditory Anchor
              </span>
              <h2 className="text-3xl font-extrabold text-white mb-1">
                {dayData.spotify.minutesListened} Minutes
              </h2>
              <p className="text-xs text-emerald-200/80 mb-6">of focused streaming today</p>

              {/* Vinyl simulation */}
              <div className="w-44 h-44 rounded-full bg-zinc-950 border-4 border-emerald-500/40 p-3 shadow-2xl relative flex items-center justify-center mb-6 animate-spin" style={{ animationDuration: '18s' }}>
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex flex-col items-center justify-center text-center p-2">
                  <div className="w-4 h-4 rounded-full bg-zinc-950 mb-1" />
                  <span className="text-[8px] font-bold uppercase tracking-wider text-black">TOP TRACK</span>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-full text-left">
                <div className="text-xs text-emerald-400 font-semibold mb-1">Top Track of the Day:</div>
                <div className="text-base font-bold text-white truncate">
                  {dayData.spotify.topTracks[0]?.title}
                </div>
                <div className="text-xs text-white/70">
                  by {dayData.spotify.topTracks[0]?.artist} • {dayData.spotify.topGenre}
                </div>
                <div className="mt-2 text-[11px] text-emerald-300/80 italic">
                  "{summary.musicAnalysis.slice(0, 110)}..."
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: Gmail & Meeting Grind */}
          {currentSlide === 2 && (
            <div className="flex flex-col items-center text-center animate-fadeIn">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-950 via-red-900 to-slate-950 -z-10" />

              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-500/10">
                <Mail className="w-6 h-6" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-widest text-rose-300 mb-2">
                Communication Throughput
              </span>
              <h2 className="text-3xl font-extrabold text-white mb-1">
                {dayData.gmail.receivedCount} Emails
              </h2>
              <p className="text-xs text-rose-200/80 mb-6">
                Stress Level: <span className="font-bold text-rose-300">{dayData.gmail.stressRating}</span>
              </p>

              <div className="grid grid-cols-2 gap-3 w-full mb-4">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-left">
                  <span className="text-[10px] text-white/60 uppercase">Sent Replies</span>
                  <div className="text-xl font-bold text-white mt-1">{dayData.gmail.sentCount} sent</div>
                  <span className="text-[10px] text-emerald-400">Response loop cleared</span>
                </div>
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-left">
                  <span className="text-[10px] text-white/60 uppercase">Calendar Sync</span>
                  <div className="text-xl font-bold text-white mt-1">{dayData.calendar.meetingsCount} meetings</div>
                  <span className="text-[10px] text-indigo-300">{dayData.calendar.totalMeetingMinutes}m total time</span>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-md border border-rose-500/30 rounded-2xl p-4 w-full text-left">
                <div className="text-xs font-semibold text-rose-400 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  Primary High-Impact Thread:
                </div>
                <div className="text-xs font-bold text-white truncate">
                  {dayData.gmail.urgentThreads[0]?.subject || 'Inbox Maintenance'}
                </div>
                <p className="text-[11px] text-white/70 mt-1 line-clamp-2">
                  {dayData.gmail.urgentThreads[0]?.summary || 'All key correspondences addressed and accounted for.'}
                </p>
              </div>
            </div>
          )}

          {/* SLIDE 4: TikTok & Screen Time Reality Check */}
          {currentSlide === 3 && (
            <div className="flex flex-col items-center text-center animate-fadeIn">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-950 -z-10" />

              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-4 shadow-lg shadow-cyan-500/10">
                <Video className="w-6 h-6" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300 mb-2">
                The Algorithm Confessional
              </span>
              <h2 className="text-3xl font-extrabold text-white mb-1">
                {dayData.tiktok.screenTimeMinutes} Minutes
              </h2>
              <p className="text-xs text-cyan-200/80 mb-6">
                Across {dayData.tiktok.videosWatched} videos swiped
              </p>

              <div className="bg-black/40 backdrop-blur-md border border-cyan-400/20 rounded-2xl p-4 w-full text-left mb-4">
                <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                  Peak Rabbit Hole Theme:
                </div>
                <div className="text-sm font-bold text-white">
                  "{dayData.tiktok.rabbitHoleTheme}"
                </div>
                <div className="text-xs text-white/60 mt-1">
                  Peak Session: {dayData.tiktok.rabbitHoleTime}
                </div>
              </div>

              {/* Brain rot vs Learning meter */}
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-full">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-pink-400">Pure Entertainment ({dayData.tiktok.brainRotRatio}%)</span>
                  <span className="text-emerald-400">Actionable Intel ({dayData.tiktok.learningRatio}%)</span>
                </div>
                <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-400"
                    style={{ width: `${dayData.tiktok.brainRotRatio}%` }}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                    style={{ width: `${dayData.tiktok.learningRatio}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 5: The Final Verdict & Tomorrow's Quest */}
          {currentSlide === 4 && (
            <div className="flex flex-col items-center text-center animate-fadeIn">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-950 via-purple-950 to-slate-950 -z-10" />

              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-500/10">
                <Trophy className="w-6 h-6" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-widest text-amber-300 mb-1">
                The Daily Verdict
              </span>
              <h2 className="text-2xl font-black text-white mb-4">
                Day Conquered.
              </h2>

              {/* Key Highlights list */}
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-3 w-full text-left space-y-2 mb-4">
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Top Accomplishments:
                </div>
                {summary.keyWins.slice(0, 2).map((win, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-white/90">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{win}</span>
                  </div>
                ))}
              </div>

              {/* Tomorrow's quest */}
              <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-400/30 rounded-2xl p-3.5 w-full text-left mb-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 mb-1">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Strategic Advice for Tomorrow:</span>
                </div>
                <p className="text-xs text-white/90">
                  {summary.tomorrowForecast}
                </p>
              </div>

              <button
                onClick={handleCopyStory}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-purple-500/25 transition active:scale-[0.98]"
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Share Day Capsule'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation tap areas */}
        <div
          className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer"
          onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
        />
        <div
          className="absolute inset-y-0 right-0 w-1/3 z-20 cursor-pointer"
          onClick={() => setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1))}
        />

        {/* Bottom manual stepper arrows */}
        <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className={`pointer-events-auto p-2 rounded-full bg-black/40 backdrop-blur-md text-white/70 hover:text-white transition ${
              currentSlide === 0 ? 'opacity-20 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1))}
            disabled={currentSlide === totalSlides - 1}
            className={`pointer-events-auto p-2 rounded-full bg-black/40 backdrop-blur-md text-white/70 hover:text-white transition ${
              currentSlide === totalSlides - 1 ? 'opacity-20 cursor-not-allowed' : ''
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
