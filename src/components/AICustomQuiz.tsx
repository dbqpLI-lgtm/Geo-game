import React, { useState } from 'react';
import { Sparkles, Send, BrainCircuit, CheckCircle2, XCircle, Trophy, RotateCcw, ArrowRight, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AICustomQuizProps {
  onEarnXP: (amount: number) => void;
}

interface QuestionItem {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizResult {
  title: string;
  description: string;
  questions: QuestionItem[];
}

export const AICustomQuiz: React.FC<AICustomQuizProps> = ({ onEarnXP }) => {
  const [topicInput, setTopicInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizResult | null>(null);

  // Play state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const curatedTopics = [
    'Volcanoes & Ring of Fire',
    'Landlocked Nations of the World',
    'Capitals with Unusual Names',
    'Pacific Island Nations',
    'Ancient Trade Routes & Silk Road',
    'Bizarre Border Enclaves & Exclaves'
  ];

  const handleGenerate = async (topicToUse: string) => {
    const finalTopic = topicToUse.trim() || 'World Geography Wonders';
    setIsLoading(true);
    setQuizData(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);

    try {
      const res = await fetch('/api/generate-geo-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: finalTopic, difficulty: 'medium', questionCount: 5 })
      });

      const data: QuizResult = await res.json();
      if (data && data.questions && data.questions.length > 0) {
        setQuizData(data);
      }
    } catch (err) {
      console.error('Failed to generate quiz:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentQ = quizData?.questions[currentQuestionIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered || !currentQ) return;
    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
      onEarnXP(30);
    }
  };

  const handleNext = () => {
    if (!quizData) return;
    if (currentQuestionIndex + 1 < quizData.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      onEarnXP(100);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950/70 via-slate-900/80 to-slate-950 border border-purple-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Gemini AI Engine
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
            On-Demand Generator
          </span>
        </div>
        <h2 className="text-2xl font-black text-white">Quiz Anything & Everything in Geography</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">
          Enter any niche geography topic, regional category, or obscure trivia question to generate an instant 5-question verified challenge.
        </p>

        {/* Search input */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="e.g. South American volcanoes, European exclaves, desert oases..."
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-950/90 border border-purple-500/40 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={() => handleGenerate(topicInput)}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition disabled:opacity-50 active:scale-95"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Generate Quiz</span>
          </button>
        </div>

        {/* 1-Click Suggestions */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-medium mr-1">Popular Topics:</span>
          {curatedTopics.map((topic, i) => (
            <button
              key={i}
              onClick={() => {
                setTopicInput(topic);
                handleGenerate(topic);
              }}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-purple-300 border border-purple-900/40 transition"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse">
          <BrainCircuit className="w-10 h-10 text-purple-400 animate-spin mx-auto mb-3" />
          <h4 className="text-base font-bold text-white">Synthesizing Cartographic Questions...</h4>
          <p className="text-xs text-slate-400 mt-1">
            Gemini is formulating verified multiple-choice questions and rich explanations.
          </p>
        </div>
      )}

      {/* Live Quiz Area */}
      {!isLoading && quizData && !isFinished && currentQ && (
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 pb-3 border-b border-slate-800">
            <span className="font-semibold text-purple-400">{quizData.title}</span>
            <span className="font-mono">
              Question {currentQuestionIndex + 1} of {quizData.questions.length}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white my-4 leading-snug">
            {currentQ.question}
          </h3>

          {/* 4 Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {currentQ.options.map((option, i) => {
              const isSelected = selectedAnswer === i;
              const isTarget = i === currentQ.correctIndex;

              let style = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-purple-400/50 hover:bg-slate-900';
              if (isAnswered) {
                if (isTarget) {
                  style = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                } else if (isSelected) {
                  style = 'bg-rose-950/80 border-rose-500 text-rose-200';
                } else {
                  style = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-50';
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelectOption(i)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border text-left text-sm font-semibold transition-all flex items-center justify-between ${style}`}
                >
                  <span>{option}</span>
                  {isAnswered && isTarget && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                  {isAnswered && isSelected && !isTarget && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 mb-6 animate-fadeIn">
              <span className="font-bold text-white block mb-0.5">Educational Insight:</span>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          {/* Footer Next button */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400">
              Score: <strong className="text-white font-mono">{score}</strong> / {quizData.questions.length}
            </span>

            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition disabled:opacity-40"
            >
              <span>{currentQuestionIndex + 1 === quizData.questions.length ? 'Finish Quiz' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Finished Screen */}
      {!isLoading && isFinished && quizData && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-xl text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
            <Trophy className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-black text-white mb-1">Challenge Completed!</h3>
          <p className="text-sm text-slate-300 mb-6">
            You scored <strong className="text-purple-400 font-mono text-lg">{score}</strong> out of {quizData.questions.length} on{' '}
            <span className="text-white font-bold">"{quizData.title}"</span>.
          </p>

          <button
            onClick={() => handleGenerate(topicInput)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Generate Another Quiz</span>
          </button>
        </div>
      )}
    </div>
  );
};
