import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Orbit, RotateCcw } from 'lucide-react';
import { useGameSettings } from '../context/GameSettingsContext';
import { getWrongGuessLimit } from '../utils/guessAttempts';

type Question = {
  prompt: string;
  answer: string;
  aliases: string[];
  explanation: string;
};

type QuizCategory = 'constellations' | 'spacecraft' | 'sizes' | 'moons';

type Constellation = {
  name: string;
  aliases: string[];
  points: Array<[number, number]>;
  lines: Array<[number, number]>;
};

type Moon = {
  name: string;
  aliases?: string[];
};

const quizCategories: Array<{ id: QuizCategory; label: string }> = [
  { id: 'constellations', label: 'Constellations' },
  { id: 'spacecraft', label: 'Spacecraft' },
  { id: 'sizes', label: 'Size comparisons' },
  { id: 'moons', label: 'Planetary moons' },
];

const constellations: Constellation[] = [
  {
    name: 'Orion',
    aliases: ['the hunter'],
    points: [[29, 27], [70, 29], [40, 49], [50, 47], [60, 45], [35, 78], [68, 76]],
    lines: [[0, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6]],
  },
  {
    name: 'Ursa Major',
    aliases: ['big dipper', 'the great bear'],
    points: [[18, 35], [31, 27], [45, 33], [54, 47], [70, 54], [82, 65], [94, 72]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]],
  },
  {
    name: 'Cassiopeia',
    aliases: ['the queen'],
    points: [[16, 34], [34, 61], [52, 30], [70, 59], [88, 35]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  {
    name: 'Crux',
    aliases: ['southern cross'],
    points: [[50, 17], [35, 45], [65, 47], [51, 82]],
    lines: [[0, 3], [1, 2]],
  },
  {
    name: 'Cygnus',
    aliases: ['northern cross'],
    points: [[50, 14], [50, 37], [50, 60], [50, 85], [25, 48], [75, 48]],
    lines: [[0, 1], [1, 2], [2, 3], [4, 1], [1, 5]],
  },
];

const majorMoons: Record<string, Moon[]> = {
  Mercury: [],
  Venus: [],
  Earth: [{ name: 'The Moon', aliases: ['moon', 'luna'] }],
  Mars: [{ name: 'Phobos' }, { name: 'Deimos' }],
  Jupiter: [{ name: 'Io' }, { name: 'Europa' }, { name: 'Ganymede' }, { name: 'Callisto' }],
  Saturn: [
    { name: 'Mimas' },
    { name: 'Enceladus' },
    { name: 'Tethys' },
    { name: 'Dione' },
    { name: 'Rhea' },
    { name: 'Titan' },
    { name: 'Iapetus' },
  ],
  Uranus: [{ name: 'Miranda' }, { name: 'Ariel' }, { name: 'Umbriel' }, { name: 'Titania' }, { name: 'Oberon' }],
  Neptune: [{ name: 'Triton' }, { name: 'Proteus' }, { name: 'Nereid' }],
};

const questions: Record<QuizCategory, Question[]> = {
  constellations: [],
  spacecraft: [
    { prompt: 'Which spacecraft became the first to enter interstellar space?', answer: 'Voyager 1', aliases: ['Voyager One'], explanation: 'NASA confirmed Voyager 1 entered interstellar space in 2012.' },
    { prompt: 'Which mission first landed humans on the Moon?', answer: 'Apollo 11', aliases: ['Apollo eleven'], explanation: 'Apollo 11 landed Neil Armstrong and Buzz Aldrin on the Moon in 1969.' },
    { prompt: 'Which NASA rover landed in Jezero Crater on Mars in 2021?', answer: 'Perseverance', aliases: ['Perseverance rover'], explanation: 'Perseverance is exploring Jezero Crater and searching for signs of ancient life.' },
    { prompt: 'Which spacecraft studied Saturn and its moons for more than 13 years?', answer: 'Cassini', aliases: ['Cassini Huygens', 'Cassini-Huygens'], explanation: 'The Cassini mission explored Saturn from 2004 until its planned end in 2017.' },
    { prompt: 'Which spacecraft flew past Pluto in 2015?', answer: 'New Horizons', aliases: [], explanation: 'New Horizons returned the first close-up images of Pluto.' },
  ],
  sizes: [
    { prompt: 'About how many Earths could fit across the Sun’s diameter? Enter the approximate number.', answer: '109', aliases: ['about 109', '109 earths', 'about 109 earths'], explanation: 'The Sun’s diameter is about 109 times Earth’s diameter.' },
    { prompt: 'Which planet is about 11 times wider than Earth?', answer: 'Jupiter', aliases: [], explanation: 'Jupiter’s diameter is roughly 11 times Earth’s diameter.' },
    { prompt: 'About how many times wider is Earth than the Moon? Enter the approximate number.', answer: '3.7', aliases: ['about 3.7', '3.7 times', 'about 3.7 times'], explanation: 'Earth’s diameter is about 12,742 km; the Moon’s is about 3,475 km.' },
    { prompt: 'Which is larger in diameter: Uranus or Neptune?', answer: 'Uranus', aliases: [], explanation: 'Uranus is slightly wider than Neptune, though Neptune is more massive.' },
    { prompt: 'Which planet is the smallest in our solar system?', answer: 'Mercury', aliases: [], explanation: 'Mercury is the smallest of the eight planets.' },
  ],
  moons: [],
};

function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function ConstellationChart({ constellation }: { constellation: Constellation }) {
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label="Star chart showing a constellation"
      className="mx-auto aspect-square w-full max-w-sm rounded-2xl border border-sky-300/20 bg-[#050817]"
    >
      <defs>
        <radialGradient id="star-chart-background">
          <stop offset="0%" stopColor="#111c3d" />
          <stop offset="100%" stopColor="#050817" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#star-chart-background)" />
      {[[12, 17], [82, 13], [89, 46], [17, 79], [77, 87], [9, 53], [61, 15], [34, 87], [91, 24]].map(([x, y], index) => (
        <circle key={index} cx={x} cy={y} r="0.55" fill="#94a3b8" opacity="0.65" />
      ))}
      {constellation.lines.map(([start, end]) => {
        const [x1, y1] = constellation.points[start];
        const [x2, y2] = constellation.points[end];
        return <line key={`${start}-${end}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#38bdf8" strokeOpacity="0.65" strokeWidth="0.65" />;
      })}
      {constellation.points.map(([cx, cy], index) => (
        <g key={index}>
          <circle cx={cx} cy={cy} r="3" fill="#fde68a" opacity="0.16" />
          <circle cx={cx} cy={cy} r={index % 3 === 0 ? '1.5' : '1.1'} fill="#fff7cc" />
        </g>
      ))}
    </svg>
  );
}

function shuffleQuestions(category: QuizCategory): Question[] {
  const shuffled = [...questions[category]];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const otherIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[otherIndex]] = [shuffled[otherIndex], shuffled[index]];
  }
  return shuffled;
}

export const SpaceExplorer: React.FC<{
  onEarnXP: (amount: number) => void;
  onSelectEarth: () => void;
}> = ({ onEarnXP, onSelectEarth }) => {
  const { difficulty, isLearningMode, getTimeLimit } = useGameSettings();
  const [category, setCategory] = useState<QuizCategory>('constellations');
  const [round, setRound] = useState<Question[]>(() => shuffleQuestions('spacecraft'));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [foundMoons, setFoundMoons] = useState<Set<string>>(new Set());
  const [selectedMoonPlanet, setSelectedMoonPlanet] = useState('Jupiter');
  const [typeFeedback, setTypeFeedback] = useState<string | null>(null);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeLimit(120));
  const roundTimeLimit = getTimeLimit(category === 'moons' ? 180 : 120);
  const guessLimit = getWrongGuessLimit(difficulty);
  const guessesRemaining = Math.max(0, guessLimit - wrongGuesses);
  const guessLimitReached = wrongGuesses >= guessLimit;
  const currentConstellation = constellations[questionIndex];
  const moonPool = majorMoons[selectedMoonPlanet];
  const noKnownMoons = category === 'moons' && moonPool.length === 0;
  const finished = category === 'constellations'
    ? questionIndex >= constellations.length || isTimeUp
    : category === 'moons'
      ? isTimeUp || guessLimitReached || (moonPool.length > 0 && foundMoons.size >= moonPool.length)
      : questionIndex >= round.length || isTimeUp;
  const question = round[questionIndex];

  useEffect(() => {
    setTimeLeft(roundTimeLimit);
    setIsTimeUp(false);
  }, [category, selectedMoonPlanet, roundTimeLimit, difficulty]);

  useEffect(() => {
    if (timeLeft === 0 && !isLearningMode && !noKnownMoons) setIsTimeUp(true);
  }, [timeLeft, isLearningMode, noKnownMoons]);

  useEffect(() => {
    if (finished || noKnownMoons || isLearningMode) return;
    const timer = window.setInterval(() => {
      setTimeLeft((remaining) => Math.max(0, remaining - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [finished, noKnownMoons, isLearningMode]);

  const startRound = () => {
    if (category !== 'constellations' && category !== 'moons') setRound(shuffleQuestions(category));
    setQuestionIndex(0);
    setAnswer(null);
    setScore(0);
    setTypedAnswer('');
    setFoundMoons(new Set());
    setTypeFeedback(null);
    setWrongGuesses(0);
    setTimeLeft(roundTimeLimit);
    setIsTimeUp(false);
  };

  const changeCategory = (nextCategory: QuizCategory) => {
    setCategory(nextCategory);
    if (nextCategory !== 'constellations' && nextCategory !== 'moons') setRound(shuffleQuestions(nextCategory));
    setQuestionIndex(0);
    setAnswer(null);
    setScore(0);
    setTypedAnswer('');
    setFoundMoons(new Set());
    setTypeFeedback(null);
    setWrongGuesses(0);
    setTimeLeft(getTimeLimit(nextCategory === 'moons' ? 180 : 120));
    setIsTimeUp(false);
  };

  const submitConstellation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentConstellation || typeFeedback === 'correct' || guessLimitReached) return;
    const guess = normalizeAnswer(typedAnswer);
    const acceptedNames = [currentConstellation.name, ...currentConstellation.aliases].map(normalizeAnswer);
    if (acceptedNames.includes(guess)) {
      setTypeFeedback('correct');
      setScore((previous) => previous + 1);
      onEarnXP(15);
    } else {
      const nextWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(nextWrongGuesses);
      setTypedAnswer('');
      setTypeFeedback(nextWrongGuesses >= guessLimit ? 'out-of-guesses' : 'incorrect');
    }
  };

  const nextConstellation = () => {
    setQuestionIndex((index) => index + 1);
    setTypedAnswer('');
    setTypeFeedback(null);
    setWrongGuesses(0);
  };

  const submitMoon = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (guessLimitReached) return;
    const guess = normalizeAnswer(typedAnswer);
    if (!guess) return;
    const moon = moonPool.find((item) =>
      [item.name, ...(item.aliases ?? [])].map(normalizeAnswer).includes(guess),
    );
    if (!moon) {
      const nextWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(nextWrongGuesses);
      setTypedAnswer('');
      setTypeFeedback(nextWrongGuesses >= guessLimit ? 'out-of-guesses' : 'not-found');
      return;
    }
    if (foundMoons.has(moon.name)) {
      setTypeFeedback('already-found');
      return;
    }
    setFoundMoons((previous) => new Set(previous).add(moon.name));
    setScore((previous) => previous + 1);
    setTypedAnswer('');
    setWrongGuesses(0);
    setTypeFeedback('moon-found');
    onEarnXP(15);
  };

  const changeMoonPlanet = (planet: string) => {
    setSelectedMoonPlanet(planet);
    setFoundMoons(new Set());
    setTypedAnswer('');
    setTypeFeedback(null);
    setWrongGuesses(0);
    setScore(0);
    setTimeLeft(getTimeLimit(180));
    setIsTimeUp(false);
  };

  const submitQuestion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!question || answer !== null || guessLimitReached) return;
    const guess = normalizeAnswer(typedAnswer);
    if (![question.answer, ...question.aliases].map(normalizeAnswer).includes(guess)) {
      const nextWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(nextWrongGuesses);
      setTypedAnswer('');
      if (nextWrongGuesses >= guessLimit) {
        setAnswer(question.answer);
        setTypeFeedback('out-of-guesses');
      } else {
        setTypeFeedback('incorrect');
      }
      return;
    }
    setAnswer(question.answer);
    setTypeFeedback('correct');
    setScore((previous) => previous + 1);
    onEarnXP(15);
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-sky-400/20 bg-gradient-to-r from-slate-950 via-indigo-950/60 to-slate-950 p-5">
        <div>
          <div className="mb-1 flex items-center gap-2 text-sky-300">
            <Orbit className="h-5 w-5" />
            <span className="text-xs font-extrabold uppercase tracking-[0.2em]">GeoMaster · Cosmic Atlas</span>
          </div>
          <h1 className="text-2xl font-black text-white sm:text-3xl">Space quizzes</h1>
          <p className="mt-1 text-sm text-slate-400">Test what you know about constellations, spacecraft, planetary sizes, and moons.</p>
        </div>
        <div className="inline-flex rounded-xl border border-slate-700 bg-slate-950/80 p-1" aria-label="Choose quiz subject">
          <button
            onClick={onSelectEarth}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Earth quizzes
          </button>
          <span className="rounded-lg bg-sky-500/20 px-3 py-2 text-xs font-bold text-sky-200" aria-current="page">
            Space quizzes
          </span>
        </div>
      </div>

      <section className="mx-auto max-w-3xl rounded-3xl border border-sky-400/20 bg-slate-900/80 p-5 shadow-xl sm:p-8">
        <div className="mb-6 flex flex-wrap gap-2" aria-label="Space quiz categories">
          {quizCategories.map((item) => (
            <button
              key={item.id}
              onClick={() => changeCategory(item.id)}
              aria-pressed={category === item.id}
              className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                category === item.id
                  ? 'border-sky-400/50 bg-sky-500/15 text-sky-200'
                  : 'border-slate-700 bg-slate-950/70 text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {noKnownMoons ? (
          <div className="space-y-3 rounded-2xl border border-slate-700 bg-slate-950/60 p-5 text-center">
            <h2 className="text-lg font-bold text-white">{selectedMoonPlanet} has no known natural moons</h2>
            <p className="text-sm text-slate-400">Choose another planet to name its major moons.</p>
          </div>
        ) : finished ? (
          <div className="space-y-4 py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/10 text-emerald-300">
              <Check className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-black text-white">
              {isTimeUp ? 'Time is up!' : guessLimitReached ? 'Out of guesses!' : 'Mission complete!'}
            </h2>
            <p className="text-sm text-slate-300">
              You scored <strong className="text-sky-300">{score} / {category === 'constellations' ? constellations.length : category === 'moons' ? moonPool.length : round.length}</strong>.
              {!isTimeUp && !guessLimitReached && ' Correct answers earned 15 XP each.'}
            </p>
            {category === 'moons' && guessLimitReached && (
              <div className="mx-auto flex max-w-lg flex-wrap justify-center gap-2">
                {moonPool.map((moon) => (
                  <span key={moon.name} className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${
                    foundMoons.has(moon.name)
                      ? 'border-emerald-400/30 bg-emerald-950/30 text-emerald-200'
                      : 'border-sky-400/30 bg-sky-950/30 text-sky-200'
                  }`}>
                    {moon.name}
                  </span>
                ))}
              </div>
            )}
            <button onClick={startRound} className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-500">
              <RotateCcw className="h-4 w-4" /> Launch another round
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sky-300">Mission briefing</div>
                <h2 className="mt-1 text-xl font-black text-white">{quizCategories.find((item) => item.id === category)?.label} Quiz</h2>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs font-bold text-amber-300">
                {category === 'constellations'
                  ? `Image ${questionIndex + 1} / ${constellations.length} · Score ${score}`
                  : category === 'moons'
                    ? `${selectedMoonPlanet} · ${foundMoons.size} / ${moonPool.length} · Score ${score}`
                    : `Question ${questionIndex + 1} / ${round.length} · Score ${score}`}
                {!isLearningMode && ` · ${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`}
                {` · ${guessesRemaining} guesses left`}
              </div>
            </div>
            {category === 'constellations' && currentConstellation ? (
              <div className="space-y-5">
                <p className="text-lg font-bold leading-7 text-slate-100">Name the constellation shown in this star chart.</p>
                <ConstellationChart constellation={currentConstellation} />
                <form onSubmit={submitConstellation} className="space-y-3">
                  <label htmlFor="constellation-answer" className="sr-only">Constellation name</label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      id="constellation-answer"
                      type="text"
                      value={typedAnswer}
                      onChange={(event) => setTypedAnswer(event.target.value)}
                      disabled={typeFeedback === 'correct' || guessLimitReached}
                      placeholder="Type the constellation name"
                      className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
                    />
                    {typeFeedback === 'correct' || guessLimitReached ? (
                      <button type="button" onClick={nextConstellation} className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white hover:bg-sky-500">
                        {typeFeedback === 'correct' ? 'Correct — next image' : `Answer: ${currentConstellation.name} · Next image`}
                      </button>
                    ) : (
                      <button type="submit" disabled={!typedAnswer.trim()} className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white hover:bg-sky-500 disabled:opacity-50">Check answer</button>
                    )}
                  </div>
                </form>
                {typeFeedback === 'incorrect' && <p role="status" className="text-sm text-rose-300">Not quite — {guessesRemaining} guesses left. Try another name.</p>}
                {typeFeedback === 'correct' && <p role="status" className="text-sm text-emerald-300">Correct — {currentConstellation.name}! +15 XP</p>}
                {typeFeedback === 'out-of-guesses' && <p role="status" className="text-sm text-amber-300">No guesses left. The answer was {currentConstellation.name}.</p>}
              </div>
            ) : category === 'moons' ? (
              <div className="space-y-5">
                <label className="block text-sm font-bold text-slate-200">
                  Choose a planet
                  <select
                    value={selectedMoonPlanet}
                    onChange={(event) => changeMoonPlanet(event.target.value)}
                    className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                  >
                    {Object.keys(majorMoons).map((planet) => <option key={planet}>{planet}</option>)}
                  </select>
                </label>
                <div>
                  <p className="mb-3 text-sm text-slate-300">Type every major moon of {selectedMoonPlanet}. Press Enter or submit after each name.</p>
                  <form onSubmit={submitMoon} className="flex flex-col gap-2 sm:flex-row">
                    <label htmlFor="moon-answer" className="sr-only">Moon name</label>
                    <input
                      id="moon-answer"
                      type="text"
                      value={typedAnswer}
                      onChange={(event) => setTypedAnswer(event.target.value)}
                      disabled={guessLimitReached}
                      placeholder="Type a moon name"
                      className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
                    />
                    <button type="submit" disabled={!typedAnswer.trim() || guessLimitReached} className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white hover:bg-sky-500 disabled:opacity-50">Add moon</button>
                  </form>
                  {typeFeedback === 'not-found' && <p role="status" className="mt-2 text-sm text-rose-300">That moon isn’t in this planet’s major-moon list. {guessesRemaining} guesses left.</p>}
                  {typeFeedback === 'already-found' && <p role="status" className="mt-2 text-sm text-amber-300">You already named that moon.</p>}
                  {typeFeedback === 'moon-found' && <p role="status" className="mt-2 text-sm text-emerald-300">Moon added! +15 XP</p>}
                  {typeFeedback === 'out-of-guesses' && <p role="status" className="mt-2 text-sm text-amber-300">No guesses left. The remaining major moons are shown below.</p>}
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {moonPool.map((moon) => (
                    <div key={moon.name} className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                      foundMoons.has(moon.name) ? 'border-emerald-400/30 bg-emerald-950/30 text-emerald-200' : 'border-slate-800 bg-slate-950/60 text-slate-500'
                    }`}>
                      {foundMoons.has(moon.name) || guessLimitReached ? moon.name : '???'}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500">This quiz uses a curated list of major moons, not every small or recently confirmed satellite.</p>
              </div>
            ) : question ? (
              <div className="space-y-5">
                <p className="text-lg font-bold leading-7 text-slate-100">{question.prompt}</p>
                <form onSubmit={submitQuestion} className="flex flex-col gap-2 sm:flex-row">
                  <label htmlFor="space-answer" className="sr-only">Your answer</label>
                  <input
                    id="space-answer"
                    type="text"
                    value={typedAnswer}
                    onChange={(event) => setTypedAnswer(event.target.value)}
                    disabled={answer !== null || guessLimitReached}
                    placeholder="Type your answer"
                    className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
                  />
                  {answer === null ? (
                    <button type="submit" className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white hover:bg-sky-500">Check answer</button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setQuestionIndex((index) => index + 1);
                        setAnswer(null);
                        setTypedAnswer('');
                        setTypeFeedback(null);
                        setWrongGuesses(0);
                      }}
                      className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white hover:bg-sky-500"
                    >
                      {questionIndex + 1 === round.length ? 'Finish mission' : 'Next question'}
                    </button>
                  )}
                </form>
                {typeFeedback === 'incorrect' && <p role="status" className="text-sm text-rose-300">Not quite — {guessesRemaining} guesses left. Try again.</p>}
                {answer !== null && (
                  <div className="rounded-2xl border border-emerald-400/30 bg-emerald-950/30 p-4 text-sm text-emerald-100">
                    <p className="font-bold">{typeFeedback === 'out-of-guesses' ? `No guesses left. The answer was ${question.answer}.` : `Correct — ${question.answer}! +15 XP`}</p>
                    <p className="mt-1 text-xs opacity-80">{question.explanation}</p>
                  </div>
                )}
              </div>
            ) : null}
          </>
        )}
      </section>
    </section>
  );
};
