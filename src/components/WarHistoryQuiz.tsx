import React, { useMemo, useState } from 'react';
import { CalendarDays, RotateCcw, Swords, Trophy } from 'lucide-react';
import { DifficultyLevel, useGameSettings } from '../context/GameSettingsContext';
import { WORLD_WARS, WorldWar } from '../data/worldWars';
import { shuffleItems } from '../utils/countryQuizPool';

type WarQuestionMode = 'combatants' | 'dates';

interface WarQuestion {
  war: WorldWar;
  options: string[];
  answer: string;
}

function getQuestionCount(difficulty: DifficultyLevel): number {
  if (difficulty === 'easy') return 5;
  if (difficulty === 'medium') return 10;
  return 15;
}

function createQuestions(difficulty: DifficultyLevel, mode: WarQuestionMode): WarQuestion[] {
  return shuffleItems(WORLD_WARS)
    .slice(0, getQuestionCount(difficulty))
    .map((war) => {
      const answer = mode === 'combatants' ? war.combatants : war.years;
      const distractors = shuffleItems(
        WORLD_WARS.filter((candidate) => candidate.id !== war.id).map((candidate) =>
          mode === 'combatants' ? candidate.combatants : candidate.years
        )
      ).filter((option) => option !== answer);

      return {
        war,
        answer,
        options: shuffleItems([answer, ...distractors.slice(0, 3)]),
      };
    });
}

export const WarHistoryQuiz: React.FC<{ onEarnXP: (amount: number) => void }> = ({ onEarnXP }) => {
  const { difficulty } = useGameSettings();
  const [mode, setMode] = useState<WarQuestionMode>('combatants');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const questions = useMemo(() => createQuestions(difficulty, mode), [difficulty, mode]);
  const currentQuestion = questions[questionIndex];
  const isFinished = questionIndex >= questions.length;

  const resetQuiz = (nextMode = mode) => {
    setMode(nextMode);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
  };

  const chooseAnswer = (answer: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    if (answer === currentQuestion.answer) {
      setScore((current) => current + 1);
      onEarnXP(25);
    }
  };

  const goToNextQuestion = () => {
    setQuestionIndex((current) => current + 1);
    setSelectedAnswer(null);
  };

  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-r from-rose-950/70 via-slate-900/90 to-amber-950/50 p-6 shadow-xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-300">
              <Swords className="h-4 w-4" /> World history quiz
            </div>
            <h2 className="text-2xl font-black text-white">Wars: sides and dates</h2>
            <p className="mt-1 max-w-xl text-xs text-slate-300">
              Identify the sides in each conflict or match a war to the years it was fought.
              {` ${getQuestionCount(difficulty)} questions at ${difficulty} difficulty.`}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs font-bold text-amber-300">
            <Trophy className="h-4 w-4" /> {score} correct
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" aria-label="War quiz mode">
        <button
          type="button"
          aria-pressed={mode === 'combatants'}
          onClick={() => resetQuiz('combatants')}
          className={`rounded-xl border px-4 py-2 text-xs font-bold transition ${
            mode === 'combatants'
              ? 'border-rose-400 bg-rose-600 text-white'
              : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-rose-500'
          }`}
        >
          Who fought?
        </button>
        <button
          type="button"
          aria-pressed={mode === 'dates'}
          onClick={() => resetQuiz('dates')}
          className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold transition ${
            mode === 'dates'
              ? 'border-amber-400 bg-amber-600 text-white'
              : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-amber-500'
          }`}
        >
          <CalendarDays className="h-3.5 w-3.5" /> Match war to date
        </button>
      </div>

      {isFinished ? (
        <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-center">
          <Trophy className="mx-auto h-10 w-10 text-amber-400" />
          <h3 className="text-2xl font-black text-white">Quiz complete</h3>
          <p className="text-sm text-slate-300">
            You got <strong className="text-amber-300">{score}</strong> out of {questions.length} correct.
          </p>
          <button
            type="button"
            onClick={() => resetQuiz()}
            className="mx-auto flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500"
          >
            <RotateCcw className="h-4 w-4" /> Play again
          </button>
        </div>
      ) : currentQuestion && (
        <div className="space-y-5 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Question {questionIndex + 1} of {questions.length}</span>
            <span>{difficulty[0].toUpperCase() + difficulty.slice(1)}</span>
          </div>
          <div>
            <h3 className="text-xl font-black text-white">
              {mode === 'combatants'
                ? `Who fought in the ${currentQuestion.war.name}?`
                : `When was the ${currentQuestion.war.name}?`}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              {mode === 'combatants' ? 'Choose the two main sides.' : 'Choose the conflict’s date range.'}
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {currentQuestion.options.map((option) => {
              const isCorrect = option === currentQuestion.answer;
              const isSelected = option === selectedAnswer;
              return (
                <button
                  key={option}
                  type="button"
                  disabled={selectedAnswer !== null}
                  onClick={() => chooseAnswer(option)}
                  className={`rounded-xl border p-3 text-left text-sm font-semibold transition ${
                    selectedAnswer === null
                      ? 'border-slate-700 bg-slate-950/60 text-slate-200 hover:border-indigo-400 hover:bg-slate-800'
                      : isCorrect
                        ? 'border-emerald-500 bg-emerald-950/60 text-emerald-200'
                        : isSelected
                          ? 'border-rose-500 bg-rose-950/60 text-rose-200'
                          : 'border-slate-800 bg-slate-950/40 text-slate-500'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <div className="space-y-3 rounded-xl border border-slate-700 bg-slate-950/70 p-4">
              <p className="text-sm font-bold text-white">
                {currentQuestion.war.name} · {currentQuestion.war.years}
              </p>
              <p className="text-xs text-slate-300">{currentQuestion.war.summary}</p>
              <button
                type="button"
                onClick={goToNextQuestion}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
              >
                {questionIndex + 1 === questions.length ? 'See results' : 'Next question'}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
