import React, { useEffect, useMemo, useState } from 'react';
import { GeoJSON, MapContainer, CircleMarker, Tooltip } from 'react-leaflet';
import { Compass, Landmark, MapPin, RotateCcw, Waves } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DifficultyLevel, useGameSettings } from '../context/GameSettingsContext';
import { countryBoundaries } from '../data/worldCountryBoundaries';
import { MONUMENT_FEATURES, WATER_FEATURES } from '../data/worldFeatures';
import { shuffleItems } from '../utils/countryQuizPool';
import 'leaflet/dist/leaflet.css';

type FeatureTab = 'water' | 'monuments';
type ViewMode = 'quiz' | 'explore';
type MapFeature = {
  id: string;
  name: string;
  location: string;
  position: [number, number];
  detail: string;
};

function getQuestionCount(difficulty: DifficultyLevel): number {
  if (difficulty === 'easy') return 5;
  if (difficulty === 'medium') return 10;
  return 15;
}

const landStyle = () => ({
  color: '#94a3b8',
  weight: 0.6,
  fillColor: '#e2e8f0',
  fillOpacity: 0.94,
});

export const WorldFeaturesQuiz: React.FC<{ onEarnXP: (amount: number) => void }> = ({ onEarnXP }) => {
  const { difficulty } = useGameSettings();
  const [tab, setTab] = useState<FeatureTab>('water');
  const [viewMode, setViewMode] = useState<ViewMode>('quiz');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const [filledFeatureIds, setFilledFeatureIds] = useState<Set<string>>(() => new Set());
  const [wrongFeatureId, setWrongFeatureId] = useState<string | null>(null);

  const features: MapFeature[] = tab === 'water' ? WATER_FEATURES : MONUMENT_FEATURES;
  const questions = useMemo(
    () => shuffleItems(features).slice(0, Math.min(getQuestionCount(difficulty), features.length)),
    [difficulty, tab]
  );
  const currentQuestion = questions[questionIndex];
  const isFinished = viewMode === 'quiz' && questionIndex >= questions.length;
  const selectedFeature = features.find((feature) => feature.id === selectedFeatureId);
  const selectedKind = tab === 'water'
    ? WATER_FEATURES.find((feature) => feature.id === selectedFeatureId)?.kind
    : MONUMENT_FEATURES.find((feature) => feature.id === selectedFeatureId)?.country;

  useEffect(() => {
    setQuestionIndex(0);
    setScore(0);
    setSelectedFeatureId(null);
    setFilledFeatureIds(new Set());
    setWrongFeatureId(null);
  }, [difficulty, tab]);

  const selectFeature = (featureId: string) => {
    if (viewMode === 'explore') {
      setSelectedFeatureId(featureId);
      return;
    }
    if (!currentQuestion || isFinished) return;

    if (featureId === currentQuestion.id) {
      setSelectedFeatureId(featureId);
      setWrongFeatureId(null);
      setFilledFeatureIds((previous) => new Set(previous).add(featureId));
      setScore((previous) => previous + 1);
      onEarnXP(35);
    } else {
      setWrongFeatureId(featureId);
    }
  };

  const nextQuestion = () => {
    if (questionIndex + 1 === questions.length) {
      setQuestionIndex((previous) => previous + 1);
      setSelectedFeatureId(null);
      onEarnXP(150);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      return;
    }
    setQuestionIndex((previous) => previous + 1);
    setSelectedFeatureId(null);
    setWrongFeatureId(null);
  };

  const resetQuiz = () => {
    setQuestionIndex(0);
    setScore(0);
    setSelectedFeatureId(null);
    setFilledFeatureIds(new Set());
    setWrongFeatureId(null);
  };

  const changeView = (nextView: ViewMode) => {
    setViewMode(nextView);
    resetQuiz();
  };

  const handleTabChange = (nextTab: FeatureTab) => {
    setTab(nextTab);
    setViewMode('quiz');
  };

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <header className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/70 via-slate-900/90 to-indigo-950/60 p-6 shadow-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
              <Compass className="h-4 w-4" /> Interactive world atlas
            </div>
            <h2 className="text-2xl font-black text-white">Oceans, seas & world monuments</h2>
            <p className="mt-1 max-w-2xl text-xs text-slate-300">
              Find each feature on the map to fill it in, or explore the complete map and reference list.
              Map markers show approximate locations.
            </p>
          </div>
          {viewMode === 'quiz' && (
            <div className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-right">
              <div className="text-lg font-black text-amber-300">{score} / {questions.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Correctly located</div>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-wrap gap-2" aria-label="Map feature category">
        <button
          type="button"
          aria-pressed={tab === 'water'}
          onClick={() => handleTabChange('water')}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition ${
            tab === 'water'
              ? 'border-cyan-400 bg-cyan-700 text-white'
              : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-500'
          }`}
        >
          <Waves className="h-4 w-4" /> Seas & oceans ({WATER_FEATURES.length})
        </button>
        <button
          type="button"
          aria-pressed={tab === 'monuments'}
          onClick={() => handleTabChange('monuments')}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition ${
            tab === 'monuments'
              ? 'border-amber-400 bg-amber-700 text-white'
              : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-amber-500'
          }`}
        >
          <Landmark className="h-4 w-4" /> Major monuments ({MONUMENT_FEATURES.length})
        </button>
        <div className="ml-auto flex gap-2">
          {(['quiz', 'explore'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={viewMode === mode}
              onClick={() => changeView(mode)}
              className={`rounded-xl border px-4 py-2 text-xs font-bold capitalize transition ${
                viewMode === mode
                  ? 'border-indigo-400 bg-indigo-600 text-white'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-indigo-500'
              }`}
            >
              {mode === 'quiz' ? 'Fill-the-map quiz' : 'Explore all'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-3 shadow-xl">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-2">
            <div>
              <p className="text-xs font-bold text-slate-200">
                {viewMode === 'quiz'
                  ? isFinished
                    ? 'Challenge complete'
                    : `Find: ${currentQuestion?.name ?? ''}`
                  : `Explore ${features.length} mapped locations`}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {viewMode === 'quiz'
                  ? isFinished
                    ? `You located ${score} of ${questions.length} features.`
                    : `Click the map marker for this ${tab === 'water' ? 'water body' : 'monument'}. Round ${questionIndex + 1} of ${questions.length} (${difficulty} set).`
                  : 'Select any marker or name in the list to view its location and facts.'}
              </p>
            </div>
            {viewMode === 'quiz' && isFinished && (
              <button
                type="button"
                onClick={resetQuiz}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-500"
              >
                <RotateCcw className="h-3.5 w-3.5" /> New set
              </button>
            )}
          </div>
          <div className="relative z-0 isolate h-[360px] overflow-hidden rounded-2xl border border-slate-700 sm:h-[520px]">
            <MapContainer
              center={[39, 0]}
              zoom={0.9}
              minZoom={0.9}
              zoomSnap={0.1}
              maxZoom={8}
              attributionControl={false}
              maxBounds={[[-85.051129, -180], [85.051129, 180]]}
              maxBoundsViscosity={1}
              className="h-full w-full"
              style={{ backgroundColor: '#9bd2e8' }}
            >
              <GeoJSON data={countryBoundaries} style={landStyle} />
              {features.map((feature) => {
                const isFilled = filledFeatureIds.has(feature.id);
                const isWrong = wrongFeatureId === feature.id;
                const isSelected = selectedFeatureId === feature.id;
                return (
                  <CircleMarker
                    key={feature.id}
                    center={feature.position}
                    radius={isFilled || isSelected ? 10 : 7}
                    className={`world-feature-marker world-feature-${feature.id}`}
                    pathOptions={{
                      color: isWrong ? '#e11d48' : isFilled ? '#047857' : '#0f172a',
                      weight: 2,
                      fillColor: isWrong ? '#fb7185' : isFilled ? '#34d399' : tab === 'water' ? '#0284c7' : '#f59e0b',
                      fillOpacity: 0.95,
                    }}
                    eventHandlers={{ click: () => selectFeature(feature.id) }}
                  >
                    {viewMode === 'explore' && isSelected && (
                      <Tooltip direction="top" permanent>
                        {tab === 'water' ? 'Sea or ocean' : 'Monument'}
                      </Tooltip>
                    )}
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 px-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-sky-500" /> Water body</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Monument</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Located</span>
            {wrongFeatureId && <span className="text-rose-300">That is not the requested location. Try another marker.</span>}
          </div>
        </section>

        <aside className="space-y-3">
          {viewMode === 'quiz' && !isFinished ? (
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/30 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Map challenge</p>
              <h3 className="mt-1 text-lg font-black text-white">{currentQuestion?.name}</h3>
              <p className="mt-1 text-xs text-slate-300">
                {tab === 'water' ? 'Find this sea or ocean on the map.' : 'Find this monument on the map.'}
              </p>
              {selectedFeatureId === currentQuestion?.id && (
                <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3">
                  <p className="text-xs font-bold text-emerald-200">{currentQuestion.location}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-300">{currentQuestion.detail}</p>
                  <button
                    type="button"
                    onClick={nextQuestion}
                    className="mt-3 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-500"
                  >
                    {questionIndex + 1 === questions.length ? 'Finish challenge' : 'Next location'}
                  </button>
                </div>
              )}
            </div>
          ) : viewMode === 'quiz' && isFinished ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-4 text-center">
              <MapPin className="mx-auto h-8 w-8 text-emerald-300" />
              <h3 className="mt-2 font-black text-white">Map mastered</h3>
              <p className="mt-1 text-xs text-slate-300">You found {score} of {questions.length} locations.</p>
            </div>
          ) : selectedFeature ? (
            <article className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">{selectedKind}</p>
              <h3 className="mt-1 text-lg font-black text-white">{selectedFeature.name}</h3>
              <p className="mt-1 text-xs text-slate-400">{selectedFeature.location}</p>
              <p className="mt-3 text-xs leading-relaxed text-slate-300">{selectedFeature.detail}</p>
            </article>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-400">
              Select a mapped feature to see where it is and learn more about it.
            </div>
          )}

          {viewMode === 'explore' && (
            <div className="max-h-[410px] space-y-1 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900/70 p-2">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => selectFeature(feature.id)}
                  className={`w-full rounded-xl px-3 py-2 text-left text-xs transition ${
                    selectedFeatureId === feature.id
                      ? 'bg-indigo-600 font-bold text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {feature.name}
                </button>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
