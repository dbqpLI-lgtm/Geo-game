import React, { useState, useMemo } from 'react';
import { Coins, Languages, Church, CheckCircle2, XCircle, ArrowRight, Trophy, Sparkles, RotateCcw, Filter, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALL_197_COUNTRIES, CountryFullItem } from '../data/all197Countries';
import { FlagImage } from './FlagImage';
import { getCurrencyDisplayName } from '../utils/currencyName';

interface CultureQuizProps {
  onEarnXP: (amount: number) => void;
}

type QuestionStep = 'currency' | 'language' | 'religion';

export const CultureCurrencyReligionQuiz: React.FC<CultureQuizProps> = ({ onEarnXP }) => {
  const [selectedContinent, setSelectedContinent] = useState<string>('All');
  const [activeCountryIndex, setActiveCountryIndex] = useState(0);
  const [step, setStep] = useState<QuestionStep>('currency');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answersStatus, setAnswersStatus] = useState<{ currency: boolean; language: boolean; religion: boolean }>({
    currency: false,
    language: false,
    religion: false,
  });
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // Filter pool
  const filteredCountries = useMemo(() => {
    return ALL_197_COUNTRIES.filter(
      (c) => selectedContinent === 'All' || c.continent === selectedContinent
    );
  }, [selectedContinent]);

  const currentCountry: CountryFullItem = filteredCountries[activeCountryIndex % filteredCountries.length];

  // Generate 4 randomized options for the current step
  const currentOptions = useMemo(() => {
    if (!currentCountry) return [];

    let targetValue = '';
    let otherValues: string[] = [];

    if (step === 'currency') {
      targetValue = getCurrencyDisplayName(currentCountry.currency);
      otherValues = filteredCountries
        .map((country) => getCurrencyDisplayName(country.currency))
        .filter((currency) => currency !== targetValue);
    } else if (step === 'language') {
      targetValue = currentCountry.language;
      otherValues = filteredCountries
        .filter((c) => c.language !== targetValue)
        .map((c) => c.language);
    } else {
      targetValue = currentCountry.religion;
      otherValues = filteredCountries
        .filter((c) => c.religion !== targetValue)
        .map((c) => c.religion);
    }

    // De-duplicate & sample 3 random distractors
    const uniqueOthers = Array.from(new Set(otherValues)).sort(() => 0.5 - Math.random()).slice(0, 3);
    return [targetValue, ...uniqueOthers].sort(() => 0.5 - Math.random());
  }, [currentCountry, step, activeCountryIndex, filteredCountries]);

  const handleSelectOption = (choice: string) => {
    if (isAnswered) return;
    setSelectedAnswer(choice);
    setIsAnswered(true);

    let isCorrect = false;
    if (step === 'currency') isCorrect = choice === getCurrencyDisplayName(currentCountry.currency);
    else if (step === 'language') isCorrect = choice === currentCountry.language;
    else isCorrect = choice === currentCountry.religion;

    setAnswersStatus((prev) => ({
      ...prev,
      [step]: isCorrect,
    }));

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      onEarnXP(25);
    } else {
      setStreak(0);
    }
  };

  const handleNextStep = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);

    if (step === 'currency') {
      setStep('language');
    } else if (step === 'language') {
      setStep('religion');
    } else {
      // Completed all 3 for this country!
      if (answersStatus.currency && answersStatus.language) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
        onEarnXP(50); // Bonus for full country mastery
      }

      setStep('currency');
      setAnswersStatus({ currency: false, language: false, religion: false });
      setActiveCountryIndex((prev) => (prev + 1) % filteredCountries.length);
    }
  };

  const handleSkipCountry = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setStep('currency');
    setAnswersStatus({ currency: false, language: false, religion: false });
    setActiveCountryIndex((prev) => (prev + 1) % filteredCountries.length);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900/80 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <Languages className="w-3.5 h-3.5 text-sky-400" />
              <Church className="w-3.5 h-3.5 text-purple-400" />
              <span>Country Identity Triad</span>
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
              {selectedContinent}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white">Money, Language & Religion Quiz</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Test your cultural intelligence: Given any country on Earth, name the currency they spend, the language they speak, and the religion they practice!
          </p>
        </div>

        {/* Continent Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['All', 'Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania'].map(
            (cont) => (
              <button
                key={cont}
                onClick={() => {
                  setSelectedContinent(cont);
                  setActiveCountryIndex(0);
                  setStep('currency');
                  setSelectedAnswer(null);
                  setIsAnswered(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedContinent === cont
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cont === 'North America' ? 'N. America' : cont === 'South America' ? 'S. America' : cont}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Question Arena */}
      {currentCountry && (
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
          {/* Country Spotlight Card */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 mb-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <FlagImage
                key={currentCountry.code}
                countryCode={currentCountry.code}
                emoji={currentCountry.flag}
                alt={`${currentCountry.name} flag`}
                className="h-12 w-18 rounded object-contain drop-shadow-md"
              />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Nation:
                </span>
                <h3 className="text-2xl font-black text-white">{currentCountry.name}</h3>
                <span className="text-xs text-emerald-400 font-semibold">
                  Capital: {currentCountry.capital} • {currentCountry.continent} • Pop: {currentCountry.population}
                </span>
              </div>
            </div>

            {/* Step Progress Indicators */}
            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                  step === 'currency'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-2 ring-amber-400/30'
                    : answersStatus.currency
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>1. Money</span>
              </div>

              <div
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                  step === 'language'
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 ring-2 ring-sky-400/30'
                    : answersStatus.language
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
              >
                <Languages className="w-3.5 h-3.5" />
                <span>2. Language</span>
              </div>

              <div
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                  step === 'religion'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 ring-2 ring-purple-400/30'
                    : answersStatus.religion
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
              >
                <Church className="w-3.5 h-3.5" />
                <span>3. Religion</span>
              </div>
            </div>
          </div>

          {/* Prompt Header */}
          <div className="mb-6">
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400 block mb-1">
              {step === 'currency'
                ? 'Question 1: Currency & Money'
                : step === 'language'
                ? 'Question 2: Official Language'
                : 'Question 3: Dominant Faith / Religion'}
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-white">
              {step === 'currency' && `What currency is officially used in ${currentCountry.name}?`}
              {step === 'language' && `What is the primary official language of ${currentCountry.name}?`}
              {step === 'religion' && `What is the predominant religious tradition in ${currentCountry.name}?`}
            </h4>
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {currentOptions.map((option, i) => {
              const isSelected = selectedAnswer === option;
              let isTarget = false;
              if (step === 'currency') isTarget = option === getCurrencyDisplayName(currentCountry.currency);
              else if (step === 'language') isTarget = option === currentCountry.language;
              else isTarget = option === currentCountry.religion;

              let style =
                'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-emerald-500/50 hover:bg-slate-900';
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
                  onClick={() => handleSelectOption(option)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border text-sm font-bold transition-all flex items-center justify-between ${style}`}
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

          {/* Cultural insight card on answer */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200 mb-6 animate-fadeIn">
              <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Geographic & Cultural Fact:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{currentCountry.funFact}</p>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={handleSkipCountry}
              className="text-xs text-slate-400 hover:text-white transition font-medium"
            >
              Skip to Next Country →
            </button>

            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400 font-mono">
                Total Score: <strong className="text-white font-bold">{score}</strong>
              </span>

              <button
                onClick={handleNextStep}
                disabled={!isAnswered}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition disabled:opacity-40 active:scale-95"
              >
                <span>
                  {step === 'religion' ? 'Complete Country & Next' : 'Next Trait →'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
