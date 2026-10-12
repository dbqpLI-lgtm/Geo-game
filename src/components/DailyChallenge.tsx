import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Flame, Award, CheckCircle2, XCircle, ArrowRight, Trophy, RotateCcw, Sparkles, Share2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateDailyChallenge, getTodayDateString, getTimeUntilMidnight, DailyQuestion } from '../utils/dailyChallengeGenerator';

interface DailyChallengeProps {
  onEarnXP: (amount: number) => void;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({ onEarnXP }) => {
  const todayStr = getTodayDateString();
  const [questions, setQuestions] = useState<DailyQuestion[]>(() => generateDailyChallenge(todayStr));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(1);
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight());
  const [copied, setCopied] = useState(false);

  // Check localStorage for daily completion
  useEffect(() => {
    try {
      const savedDate = localStorage.getItem('geomaster_daily_completed_date');
      const savedStreak = localStorage.getItem('geomaster_daily_streak');

      if (savedStreak) {
        setDailyStreak(parseInt(savedStreak, 10));
      }

      if (savedDate === todayStr) {
        setIsCompletedToday(true);
      }
    } catch {}
  }, [todayStr]);

  // Live countdown timer until midnight
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentQ: DailyQuestion = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
      onEarnXP(50); // 50 XP per correct question
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Completed all 5 questions!
      setIsCompletedToday(true);

      // Save streak & completion date
      try {
        const lastDate = localStorage.getItem('geomaster_daily_completed_date');
        let newStreak = dailyStreak;

        // Check if yesterday was completed
        if (lastDate !== todayStr) {
          newStreak = dailyStreak + 1;
          localStorage.setItem('geomaster_daily_streak', newStreak.toString());
          setDailyStreak(newStreak);
        }
        localStorage.setItem('geomaster_daily_completed_date', todayStr);
      } catch {}

      // Trigger massive bonus XP
      onEarnXP(250); // +250 Bonus Completion XP!

      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981'],
      });
    }
  };

  const handleShare = () => {
    const text = `🌍 GeoMaster Daily Challenge (${todayStr})\nScore: ${correctAnswersCount}/5 Correct (+${correctAnswersCount * 50 + 250} XP)\n🔥 Streak: ${dailyStreak} Days\nCan you beat my geography streak?`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCountdown = () => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(timeLeft.hours)}h ${pad(timeLeft.minutes)}m ${pad(timeLeft.seconds)}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900/90 to-purple-950/70 border border-amber-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border border-amber-500/40">
              <Calendar className="w-3.5 h-3.5" /> Daily Geography Quest
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
              {todayStr}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <span>24-Hour Geography Challenge</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              +250 Bonus XP
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
            5 fresh questions picked daily across Capitals, Flags, Currency, Natural Wonders, and Country Nicknames. Resets at midnight!
          </p>
        </div>

        {/* Timer & Streak Badges */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400 fill-current animate-pulse" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase leading-none">Daily Streak</div>
              <div className="text-sm font-black text-white leading-tight">{dailyStreak} Days</div>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase leading-none">Next Reset In</div>
              <div className="text-sm font-black text-white font-mono leading-tight">{formatCountdown()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Challenge Arena */}
      {!isCompletedToday ? (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
          {/* Header Row */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-lg">{currentQ.categoryIcon}</span>
              <span className="font-bold text-white uppercase tracking-wider">{currentQ.category}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {currentQ.categoryBadge}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-slate-300 font-bold">
                Question {currentIndex + 1} of 5
              </span>
              <span className="text-amber-400 font-bold">+50 XP each</span>
            </div>
          </div>

          {/* Question Visual & Text */}
          <div className="text-center my-6">
            {currentQ.flagOrVisual && (
              <div className="text-7xl filter drop-shadow-lg mb-3 inline-block">
                {currentQ.flagOrVisual}
              </div>
            )}
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug max-w-2xl mx-auto">
              {currentQ.question}
            </h3>
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto mb-6">
            {currentQ.options.map((option, i) => {
              const isSelected = selectedOption === i;
              const isTarget = i === currentQ.correctIndex;

              let style =
                'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-amber-500/50 hover:bg-slate-900';
              if (isAnswered) {
                if (isTarget) {
                  style = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                } else if (isSelected) {
                  style = 'bg-rose-950 border-rose-500 text-rose-200';
                } else {
                  style = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-50';
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelectOption(i)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border text-sm font-bold transition-all flex items-center justify-between text-left ${style}`}
                >
                  <span>{option}</span>
                  {isAnswered && isTarget && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isTarget && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Callout */}
          {isAnswered && (
            <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 mb-6 animate-fadeIn">
              <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Fact & Verification:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Next / Finish Button */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 max-w-2xl mx-auto">
            <span className="text-xs text-slate-400">
              Score: <strong className="text-amber-400 font-mono">{correctAnswersCount}</strong> / 5
            </span>

            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition disabled:opacity-40 active:scale-95"
            >
              <span>{currentIndex + 1 === 5 ? 'Claim Bonus XP (+250 XP)' : 'Next Daily Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Completed Today State */
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-xl text-center animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/40 shadow-lg shadow-amber-500/10">
            <Trophy className="w-10 h-10" />
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 border border-emerald-500/30 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" /> Challenge Completed for Today
          </span>

          <h3 className="text-3xl font-black text-white mb-1">Daily Quest Conquered!</h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
            You unlocked today’s bonus rewards! Come back tomorrow when the challenge resets with 5 new questions.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto mb-8">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Accuracy</span>
              <div className="text-xl font-black text-white mt-0.5">{correctAnswersCount} / 5</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30">
              <span className="text-[10px] text-amber-400 uppercase font-bold">Streak Bonus</span>
              <div className="text-xl font-black text-amber-400 mt-0.5">🔥 {dailyStreak} Days</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Next Refresh</span>
              <div className="text-xs font-black text-sky-400 font-mono mt-1.5">{formatCountdown()}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition active:scale-95"
            >
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copied Result!' : 'Share Daily Streak'}</span>
            </button>

            <button
              onClick={() => {
                setIsCompletedToday(false);
                setCurrentIndex(0);
                setSelectedOption(null);
                setIsAnswered(false);
                setCorrectAnswersCount(0);
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Today’s Questions Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
