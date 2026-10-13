import React, { useState } from 'react';
import { ArrowLeft, Check, Orbit, RotateCcw, Sparkles, Telescope } from 'lucide-react';

type Planet = {
  name: string;
  size: number;
  color: string;
  glow: string;
  fact: string;
};

type Question = {
  prompt: string;
  choices: string[];
  answer: string;
  explanation: string;
};

type QuizCategory = 'constellations' | 'spacecraft' | 'sizes' | 'moons';

const quizCategories: Array<{ id: QuizCategory; label: string }> = [
  { id: 'constellations', label: 'Constellations' },
  { id: 'spacecraft', label: 'Spacecraft' },
  { id: 'sizes', label: 'Size comparisons' },
  { id: 'moons', label: 'Planetary moons' },
];

const planets: Planet[] = [
  { name: 'Mercury', size: 18, color: 'radial-gradient(circle at 32% 28%, #d5d1c9, #77716b 72%)', glow: '#a8a29e', fact: 'Mercury is the smallest planet and the closest to the Sun.' },
  { name: 'Venus', size: 25, color: 'radial-gradient(circle at 32% 28%, #ffe2a8, #bc7135 72%)', glow: '#fbbf24', fact: 'Venus has a thick atmosphere that traps heat, making it the hottest planet.' },
  { name: 'Earth', size: 27, color: 'radial-gradient(circle at 32% 28%, #8be9fd, #2874c7 55%, #166534 75%)', glow: '#38bdf8', fact: 'Earth is the only world currently known to support life.' },
  { name: 'Mars', size: 22, color: 'radial-gradient(circle at 32% 28%, #ffb184, #b64225 72%)', glow: '#f97316', fact: 'Mars is home to Olympus Mons, the tallest volcano in the solar system.' },
  { name: 'Jupiter', size: 43, color: 'repeating-linear-gradient(8deg, #eac69b 0 6px, #aa6948 7px 12px, #dcae7d 13px 18px)', glow: '#fb923c', fact: 'Jupiter is the largest planet and has a giant storm called the Great Red Spot.' },
  { name: 'Saturn', size: 38, color: 'radial-gradient(circle at 32% 28%, #ffe4a3, #b18b4f 75%)', glow: '#facc15', fact: 'Saturn’s bright rings are made mostly of pieces of ice and rock.' },
  { name: 'Uranus', size: 31, color: 'radial-gradient(circle at 32% 28%, #c9fbff, #51b5c8 75%)', glow: '#67e8f9', fact: 'Uranus rotates on its side compared with most other planets.' },
  { name: 'Neptune', size: 30, color: 'radial-gradient(circle at 32% 28%, #a6baff, #3149b4 75%)', glow: '#818cf8', fact: 'Neptune is a distant ice giant with some of the fastest winds measured on a planet.' },
];

const questions: Record<QuizCategory, Question[]> = {
  constellations: [
    { prompt: 'Which constellation contains the three stars known as Orion’s Belt?', choices: ['Orion', 'Taurus', 'Gemini', 'Canis Major'], answer: 'Orion', explanation: 'The three bright stars in a row form Orion’s Belt.' },
    { prompt: 'Which constellation is commonly used to help locate Polaris, the North Star?', choices: ['Ursa Major', 'Crux', 'Lyra', 'Scorpius'], answer: 'Ursa Major', explanation: 'The Big Dipper, part of Ursa Major, points toward Polaris.' },
    { prompt: 'Which constellation is also known as the Southern Cross?', choices: ['Crux', 'Cygnus', 'Leo', 'Pegasus'], answer: 'Crux', explanation: 'Crux is a small but distinctive constellation in the southern sky.' },
    { prompt: 'What is the name of the W-shaped constellation associated with a queen in Greek mythology?', choices: ['Cassiopeia', 'Andromeda', 'Aquarius', 'Aries'], answer: 'Cassiopeia', explanation: 'Cassiopeia is easily recognized by its five bright stars forming a W or M.' },
    { prompt: 'Which of these is a constellation of the zodiac?', choices: ['Draco', 'Aquarius', 'Dorado', 'Lyra'], answer: 'Aquarius', explanation: 'Aquarius is one of the twelve constellations along the ecliptic.' },
  ],
  spacecraft: [
    { prompt: 'Which spacecraft became the first to enter interstellar space?', choices: ['Voyager 1', 'Pioneer 10', 'New Horizons', 'Cassini'], answer: 'Voyager 1', explanation: 'NASA confirmed Voyager 1 entered interstellar space in 2012.' },
    { prompt: 'Which mission first landed humans on the Moon?', choices: ['Apollo 8', 'Apollo 11', 'Gemini 4', 'Artemis I'], answer: 'Apollo 11', explanation: 'Apollo 11 landed Neil Armstrong and Buzz Aldrin on the Moon in 1969.' },
    { prompt: 'Which NASA rover landed in Jezero Crater on Mars in 2021?', choices: ['Curiosity', 'Spirit', 'Perseverance', 'Sojourner'], answer: 'Perseverance', explanation: 'Perseverance is exploring Jezero Crater and searching for signs of ancient life.' },
    { prompt: 'Which spacecraft studied Saturn and its moons for more than 13 years?', choices: ['Galileo', 'Cassini', 'Juno', 'Messenger'], answer: 'Cassini', explanation: 'The Cassini mission explored Saturn from 2004 until its planned end in 2017.' },
    { prompt: 'Which spacecraft flew past Pluto in 2015?', choices: ['New Horizons', 'Voyager 2', 'Dawn', 'Parker Solar Probe'], answer: 'New Horizons', explanation: 'New Horizons returned the first close-up images of Pluto.' },
  ],
  sizes: [
    { prompt: 'About how many Earths could fit across the Sun’s diameter?', choices: ['About 11', 'About 50', 'About 109', 'About 1,000'], answer: 'About 109', explanation: 'The Sun’s diameter is about 109 times Earth’s diameter.' },
    { prompt: 'Which planet is about 11 times wider than Earth?', choices: ['Mars', 'Jupiter', 'Venus', 'Mercury'], answer: 'Jupiter', explanation: 'Jupiter’s diameter is roughly 11 times Earth’s diameter.' },
    { prompt: 'About how many times wider is Earth than the Moon?', choices: ['About 1.3 times', 'About 3.7 times', 'About 10 times', 'About 28 times'], answer: 'About 3.7 times', explanation: 'Earth’s diameter is about 12,742 km; the Moon’s is about 3,475 km.' },
    { prompt: 'Which is larger in diameter?', choices: ['Uranus', 'Neptune', 'They are exactly the same', 'It depends on the season'], answer: 'Uranus', explanation: 'Uranus is slightly wider than Neptune, though Neptune is more massive.' },
    { prompt: 'Which planet is the smallest in our solar system?', choices: ['Mars', 'Mercury', 'Venus', 'Earth'], answer: 'Mercury', explanation: 'Mercury is the smallest of the eight planets.' },
  ],
  moons: [
    { prompt: 'Which planet is orbited by Ganymede, the largest moon in the solar system?', choices: ['Saturn', 'Jupiter', 'Uranus', 'Neptune'], answer: 'Jupiter', explanation: 'Ganymede is even larger than the planet Mercury.' },
    { prompt: 'Titan, a moon with lakes of liquid methane, orbits which planet?', choices: ['Jupiter', 'Saturn', 'Mars', 'Neptune'], answer: 'Saturn', explanation: 'Titan is Saturn’s largest moon and has a thick nitrogen-rich atmosphere.' },
    { prompt: 'Which planet has the two small moons Phobos and Deimos?', choices: ['Mars', 'Earth', 'Venus', 'Uranus'], answer: 'Mars', explanation: 'Phobos and Deimos are the two known natural satellites of Mars.' },
    { prompt: 'Which planet is orbited by Triton, a large moon that travels in a retrograde orbit?', choices: ['Neptune', 'Saturn', 'Jupiter', 'Uranus'], answer: 'Neptune', explanation: 'Triton moves around Neptune in the direction opposite to the planet’s rotation.' },
    { prompt: 'Europa, known for an icy crust and a likely subsurface ocean, is a moon of which planet?', choices: ['Jupiter', 'Saturn', 'Neptune', 'Earth'], answer: 'Jupiter', explanation: 'Europa is one of Jupiter’s four large Galilean moons.' },
    { prompt: 'What is the name of Earth’s only natural moon?', choices: ['Luna', 'The Moon', 'Titan', 'Charon'], answer: 'The Moon', explanation: 'Earth’s natural satellite is commonly called the Moon.' },
    { prompt: 'Miranda, known for its unusually varied surface, is a moon of which planet?', choices: ['Uranus', 'Neptune', 'Jupiter', 'Saturn'], answer: 'Uranus', explanation: 'Miranda is one of Uranus’s five major moons.' },
    { prompt: 'Which two planets in our solar system have no natural moons?', choices: ['Mercury and Venus', 'Earth and Mars', 'Jupiter and Saturn', 'Uranus and Neptune'], answer: 'Mercury and Venus', explanation: 'Mercury and Venus are the only planets without known natural satellites.' },
    { prompt: 'Enceladus, which shoots icy plumes into space, orbits which planet?', choices: ['Saturn', 'Jupiter', 'Uranus', 'Mars'], answer: 'Saturn', explanation: 'The plumes from Saturn’s moon Enceladus hint at a global ocean beneath its icy crust.' },
  ],
};

const orbitSizes = [24, 34, 44, 54, 65, 77, 89, 100];

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
  const [selectedPlanet, setSelectedPlanet] = useState<Planet>(planets[2]);
  const [view, setView] = useState<'explore' | 'quiz'>('explore');
  const [category, setCategory] = useState<QuizCategory>('constellations');
  const [round, setRound] = useState<Question[]>(() => shuffleQuestions('constellations'));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const finished = questionIndex >= round.length;
  const question = round[questionIndex];

  const startRound = () => {
    setRound(shuffleQuestions(category));
    setQuestionIndex(0);
    setAnswer(null);
    setScore(0);
  };

  const changeCategory = (nextCategory: QuizCategory) => {
    setCategory(nextCategory);
    setRound(shuffleQuestions(nextCategory));
    setQuestionIndex(0);
    setAnswer(null);
    setScore(0);
  };

  const chooseAnswer = (choice: string) => {
    if (answer !== null || !question) return;
    setAnswer(choice);
    if (choice === question.answer) {
      setScore((previous) => previous + 1);
      onEarnXP(15);
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-sky-400/20 bg-gradient-to-r from-slate-950 via-indigo-950/60 to-slate-950 p-5">
        <div>
          <div className="mb-1 flex items-center gap-2 text-sky-300">
            <Orbit className="h-5 w-5" />
            <span className="text-xs font-extrabold uppercase tracking-[0.2em]">GeoMaster · Cosmic Atlas</span>
          </div>
          <h1 className="text-2xl font-black text-white sm:text-3xl">Explore beyond Earth</h1>
          <p className="mt-1 text-sm text-slate-400">Explore the solar system, then test what you know about space.</p>
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

      <div className="flex gap-2" role="tablist" aria-label="Space explorer view">
        {(['explore', 'quiz'] as const).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={view === tab}
            onClick={() => setView(tab)}
            className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
              view === tab ? 'bg-sky-600 text-white shadow-lg shadow-sky-950/40' : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'explore' ? <><Telescope className="mr-2 inline h-4 w-4" />3D Solar System</> : <><Sparkles className="mr-2 inline h-4 w-4" />Space Quiz</>}
          </button>
        ))}
      </div>

      {view === 'explore' ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.6fr)]">
          <div
            className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-3xl border border-indigo-400/20 bg-[#050817] p-4 sm:min-h-[500px]"
            style={{
              backgroundImage: 'radial-gradient(circle at 12% 22%, #e0f2fe 0 1px, transparent 1.5px), radial-gradient(circle at 75% 19%, #c4b5fd 0 1px, transparent 1.5px), radial-gradient(circle at 82% 78%, #e0f2fe 0 1px, transparent 1.5px), radial-gradient(circle at 29% 73%, #c4b5fd 0 1px, transparent 1.5px), radial-gradient(circle at 47% 13%, #fff 0 1px, transparent 1.5px), radial-gradient(circle at 23% 48%, #fff 0 1px, transparent 1.5px), radial-gradient(circle at 91% 42%, #fff 0 1px, transparent 1.5px), radial-gradient(ellipse at center, #111c3d, #050817 72%)',
            }}
          >
            <div className="relative aspect-square w-full max-w-[min(78vw,470px)] [perspective:900px]">
              {planets.map((planet, index) => (
                <div
                  key={planet.name}
                  className="absolute left-1/2 top-1/2 rounded-[50%] border border-white/10"
                  style={{
                    width: `${orbitSizes[index]}%`,
                    height: `${orbitSizes[index]}%`,
                    transform: 'translate(-50%, -50%) rotateX(67deg)',
                    boxShadow: `0 0 0 1px ${planet.glow}10`,
                  }}
                >
                  <button
                    aria-label={`Explore ${planet.name}`}
                    aria-pressed={selectedPlanet.name === planet.name}
                    onClick={() => setSelectedPlanet(planet)}
                    className="absolute left-1/2 top-0 rounded-full transition-transform hover:scale-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300"
                    style={{
                      width: planet.size,
                      height: planet.size,
                      marginTop: -planet.size / 2,
                      marginLeft: -planet.size / 2,
                      background: planet.color,
                      boxShadow: `0 0 16px ${planet.glow}88, inset -4px -4px 8px #02061799`,
                      transform: 'rotateX(-67deg)',
                    }}
                  >
                    {planet.name === 'Saturn' && (
                      <span className="absolute left-[-25%] top-[35%] h-[30%] w-[150%] -rotate-12 rounded-[50%] border-2 border-amber-100/70" />
                    )}
                  </button>
                </div>
              ))}
              <div
                className="absolute left-1/2 top-1/2 z-10 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-16 sm:w-16"
                style={{
                  background: 'radial-gradient(circle at 35% 32%, #fff7b2, #f59e0b 52%, #ea580c)',
                  boxShadow: '0 0 24px 8px #f59e0b66, 0 0 65px 20px #f9731633',
                }}
                aria-label="The Sun"
              />
            </div>
            <p className="absolute bottom-3 left-0 right-0 text-center text-[10px] text-slate-500">Select a planet to explore · Orbital distances are illustrative</p>
          </div>

          <aside className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.2em] text-sky-300">Planet field notes</div>
            <div className="mb-4 flex items-center gap-3">
              <span
                className="h-12 w-12 shrink-0 rounded-full border border-white/10"
                style={{ background: selectedPlanet.color, boxShadow: `0 0 22px ${selectedPlanet.glow}77` }}
              />
              <div>
                <h2 className="text-2xl font-black text-white">{selectedPlanet.name}</h2>
                <p className="text-xs text-slate-400">Solar system planet</p>
              </div>
            </div>
            <p className="flex-1 text-sm leading-6 text-slate-300">{selectedPlanet.fact}</p>
            <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-4">
              {planets.map((planet) => (
                <button
                  key={planet.name}
                  onClick={() => setSelectedPlanet(planet)}
                  aria-label={`Select ${planet.name}`}
                  aria-pressed={selectedPlanet.name === planet.name}
                  className={`flex h-10 items-center justify-center rounded-xl border transition ${
                    selectedPlanet.name === planet.name ? 'border-sky-400/60 bg-sky-500/15' : 'border-slate-800 bg-slate-950/70 hover:border-slate-600'
                  }`}
                >
                  <span className="h-4 w-4 rounded-full" style={{ background: planet.color, boxShadow: `0 0 10px ${planet.glow}66` }} />
                </button>
              ))}
            </div>
          </aside>
        </div>
      ) : (
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
          {finished ? (
            <div className="space-y-4 py-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/10 text-emerald-300">
                <Check className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-black text-white">Mission complete!</h2>
              <p className="text-sm text-slate-300">You scored <strong className="text-sky-300">{score} / {round.length}</strong>. Correct answers earned 15 XP each.</p>
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
                  Question {questionIndex + 1} / {round.length} · Score {score}
                </div>
              </div>
              <p className="mb-5 text-lg font-bold leading-7 text-slate-100">{question.prompt}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {question.choices.map((choice) => {
                  const isCorrect = choice === question.answer;
                  const isChosen = choice === answer;
                  const style = answer === null
                    ? 'border-slate-700 bg-slate-950/70 text-slate-200 hover:border-sky-400/60 hover:bg-slate-800'
                    : isCorrect
                      ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-200'
                      : isChosen
                        ? 'border-rose-400/60 bg-rose-500/10 text-rose-200'
                        : 'border-slate-800 bg-slate-950/40 text-slate-500';
                  return (
                    <button
                      key={choice}
                      disabled={answer !== null}
                      onClick={() => chooseAnswer(choice)}
                      className={`rounded-2xl border p-4 text-left text-sm font-bold transition disabled:cursor-default ${style}`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
              {answer !== null && (
                <div className={`mt-5 rounded-2xl border p-4 text-sm ${answer === question.answer ? 'border-emerald-400/30 bg-emerald-950/30 text-emerald-100' : 'border-rose-400/30 bg-rose-950/30 text-rose-100'}`}>
                  <p className="font-bold">{answer === question.answer ? 'Correct! +15 XP' : `Not quite — the answer is ${question.answer}.`}</p>
                  <p className="mt-1 text-xs opacity-80">{question.explanation}</p>
                  <button
                    onClick={() => {
                      setQuestionIndex((index) => index + 1);
                      setAnswer(null);
                    }}
                    className="mt-4 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-500"
                  >
                    {questionIndex + 1 === round.length ? 'Finish mission' : 'Next question'}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </section>
  );
};
