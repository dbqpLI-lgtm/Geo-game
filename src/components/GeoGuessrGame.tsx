import React, { useState, useRef } from 'react';
import { Compass, MapPin, Navigation, Sparkles, Trophy, RotateCcw, ArrowRight, Eye, ShieldAlert, Award, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GEOGUESSR_LOCATIONS, GeoGuessrLocation } from '../data/outlinesAndGeoData';

interface GeoGuessrGameProps {
  onEarnXP: (amount: number) => void;
}

// Haversine formula to compute geodesic distance in kilometers between two coordinates
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Convert (latitude, longitude) to (X, Y) coordinates on an equirectangular world map (1000 x 500)
function coordsToMapPosition(lat: number, lon: number): { x: number; y: number } {
  // lon from -180 to 180 -> x from 0 to 1000
  const x = ((lon + 180) / 360) * 1000;
  // lat from 90 to -90 -> y from 0 to 500
  const y = ((90 - lat) / 180) * 500;
  return { x, y };
}

// Convert click (X, Y) back to (lat, lon)
function mapPositionToCoords(x: number, y: number): { lat: number; lon: number } {
  const lon = (x / 1000) * 360 - 180;
  const lat = 90 - (y / 500) * 180;
  return { lat, lon };
}

export const GeoGuessrGame: React.FC<GeoGuessrGameProps> = ({ onEarnXP }) => {
  const [roundList, setRoundList] = useState<GeoGuessrLocation[]>(() =>
    [...GEOGUESSR_LOCATIONS].sort(() => 0.5 - Math.random()).slice(0, 5)
  );
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [guessCoords, setGuessCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [roundScore, setRoundScore] = useState(0);
  const [roundDistanceKm, setRoundDistanceKm] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showClues, setShowClues] = useState(false);

  const mapSvgRef = useRef<SVGSVGElement>(null);

  const currentLocation: GeoGuessrLocation = roundList[currentRoundIndex];

  // Handle click on the world map to drop a pin
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (hasGuessed) return;
    const svg = mapSvgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Scale to internal 1000 x 500 viewBox
    const normalizedX = (clickX / rect.width) * 1000;
    const normalizedY = (clickY / rect.height) * 500;

    const { lat, lon } = mapPositionToCoords(normalizedX, normalizedY);
    setGuessCoords({ lat, lon });
  };

  // Submit guess
  const handleSubmitGuess = () => {
    if (!guessCoords || hasGuessed || !currentLocation) return;

    const distance = calculateDistanceKm(
      guessCoords.lat,
      guessCoords.lon,
      currentLocation.latitude,
      currentLocation.longitude
    );

    // Classic GeoGuessr exponential decay formula (max 5,000 pts per round)
    const points = Math.max(0, Math.round(5000 * Math.exp(-distance / 2000)));

    setRoundDistanceKm(distance);
    setRoundScore(points);
    setTotalScore((prev) => prev + points);
    setHasGuessed(true);
    onEarnXP(Math.round(points / 25));
  };

  const handleNextRound = () => {
    if (currentRoundIndex + 1 < roundList.length) {
      setCurrentRoundIndex((prev) => prev + 1);
      setGuessCoords(null);
      setHasGuessed(false);
      setRoundScore(0);
      setRoundDistanceKm(0);
      setShowClues(false);
    } else {
      setIsGameOver(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
      onEarnXP(250);
    }
  };

  const handleRestart = () => {
    const fresh = [...GEOGUESSR_LOCATIONS].sort(() => 0.5 - Math.random()).slice(0, 5);
    setRoundList(fresh);
    setCurrentRoundIndex(0);
    setGuessCoords(null);
    setHasGuessed(false);
    setRoundScore(0);
    setRoundDistanceKm(0);
    setTotalScore(0);
    setIsGameOver(false);
    setShowClues(false);
  };

  // Calculate coordinates for visual pins on SVG
  const guessPos = guessCoords ? coordsToMapPosition(guessCoords.lat, guessCoords.lon) : null;
  const truePos = currentLocation
    ? coordsToMapPosition(currentLocation.latitude, currentLocation.longitude)
    : null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900/80 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5" /> GeoGuessr Expedition Mode
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
              Round {currentRoundIndex + 1} of 5
            </span>
          </div>
          <h2 className="text-2xl font-black text-white">Where in the World Are You?</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Examine the street panorama, inspect environmental clues, and pinpoint your guess on the world map!
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {totalScore.toLocaleString()} / 25,000
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Total Score</span>
          </div>
        </div>
      </div>

      {!isGameOver && currentLocation ? (
        <div className="space-y-6">
          {/* Main Panorama Stage */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl group">
            <div className="relative h-[340px] sm:h-[420px] w-full overflow-hidden">
              <img
                src={currentLocation.imageUrl}
                alt={currentLocation.locationName}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Panorama floating meta */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" /> Street View Scene
                </span>
                <button
                  onClick={() => setShowClues(!showClues)}
                  className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-semibold hover:bg-black/80 transition flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showClues ? 'Hide Detective Clues' : 'Inspect Detective Clues'}</span>
                </button>
              </div>

              {/* Panorama Description overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <p className="text-xs sm:text-sm text-slate-200 bg-black/50 backdrop-blur-md p-3 rounded-2xl border border-white/10 max-w-2xl leading-relaxed">
                  "{currentLocation.panoramicDescription}"
                </p>
              </div>
            </div>

            {/* Detective Clues Drawer */}
            {showClues && (
              <div className="p-4 bg-slate-900 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs animate-fadeIn">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Driving Side</span>
                  <div className="text-white font-bold mt-0.5">
                    🚗 {currentLocation.deductionClues.drivingSide}-hand traffic
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Language / Script</span>
                  <div className="text-white font-bold mt-0.5 truncate">
                    🔤 {currentLocation.deductionClues.languageScript}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Sun Direction</span>
                  <div className="text-white font-bold mt-0.5 truncate">
                    ☀️ {currentLocation.deductionClues.sunPosition}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Landscape / Biome</span>
                  <div className="text-white font-bold mt-0.5 truncate">
                    🌿 {currentLocation.deductionClues.landscapeAndBiome}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive World Map Guesser Stage */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-rose-500" />
                  <span>World Map Pinpoint Stage</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {hasGuessed
                    ? 'Review your distance result below and proceed to the next round!'
                    : 'Click anywhere on the world map below to drop your pinpoint marker 📍'}
                </p>
              </div>

              {/* Submit Guess / Next Button */}
              <div>
                {!hasGuessed ? (
                  <button
                    onClick={handleSubmitGuess}
                    disabled={!guessCoords}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Guess Location!</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNextRound}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-600 hover:from-indigo-600 hover:to-sky-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition active:scale-95"
                  >
                    <span>Next Round</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* SVG Interactive World Map */}
            <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden border border-slate-700/80 bg-[#0d1626] shadow-inner select-none cursor-crosshair">
              <svg
                ref={mapSvgRef}
                viewBox="0 0 1000 500"
                className="w-full h-full"
                onClick={handleMapClick}
              >
                {/* Lat/Long Grid lines */}
                <g stroke="#1e293b" strokeWidth="0.8" opacity="0.6">
                  {/* Longitude meridians */}
                  {[125, 250, 375, 500, 625, 750, 875].map((x) => (
                    <line key={x} x1={x} y1="0" x2={x} y2="500" />
                  ))}
                  {/* Latitude parallels */}
                  {[100, 175, 250, 325, 400].map((y) => (
                    <line key={y} x1="0" y1={y} x2="1000" y2={y} />
                  ))}
                  {/* Equator (dashed highlighted) */}
                  <line
                    x1="0"
                    y1="250"
                    x2="1000"
                    y2="250"
                    stroke="#38bdf8"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                    opacity="0.8"
                  />
                  {/* Prime Meridian */}
                  <line
                    x1="500"
                    y1="0"
                    x2="500"
                    y2="500"
                    stroke="#38bdf8"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                    opacity="0.8"
                  />
                </g>

                {/* Continental Landmasses (High fidelity equirectangular projection geometry) */}
                <g fill="#1e2d42" stroke="#334155" strokeWidth="1">
                  {/* North America */}
                  <path d="M 120 70 Q 180 50 260 60 Q 320 80 340 120 Q 280 140 240 170 Q 220 220 200 240 L 170 200 Q 140 180 120 130 Z" />
                  {/* Greenland */}
                  <path d="M 330 40 Q 380 35 400 70 Q 370 110 320 90 Z" />
                  {/* South America */}
                  <path d="M 230 250 Q 280 250 340 290 Q 350 370 300 450 Q 270 470 260 410 Q 240 320 220 270 Z" />
                  {/* Europe */}
                  <path d="M 460 100 Q 520 80 570 100 Q 580 150 540 180 Q 480 190 460 140 Z" />
                  {/* Africa */}
                  <path d="M 460 190 Q 540 190 590 240 Q 600 340 550 420 Q 490 420 460 330 Q 440 250 460 190 Z" />
                  {/* Asia */}
                  <path d="M 580 80 Q 750 60 880 110 Q 890 200 820 280 Q 750 280 700 240 Q 640 250 590 190 Z" />
                  {/* Australia */}
                  <path d="M 780 340 Q 860 320 910 360 Q 920 420 860 430 Q 800 430 780 380 Z" />
                  {/* Japan Archipelago */}
                  <path d="M 850 170 Q 870 190 860 210 Q 840 200 850 170 Z" />
                  {/* Madagascar */}
                  <path d="M 610 340 Q 630 350 620 400 Q 600 380 610 340 Z" />
                </g>

                {/* Trajectory Flight Path between guess and true location */}
                {hasGuessed && guessPos && truePos && (
                  <g>
                    <line
                      x1={guessPos.x}
                      y1={guessPos.y}
                      x2={truePos.x}
                      y2={truePos.y}
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeDasharray="6 6"
                      className="animate-pulse"
                    />
                  </g>
                )}

                {/* User's Guessed Pin */}
                {guessPos && (
                  <g transform={`translate(${guessPos.x}, ${guessPos.y})`}>
                    <circle r="8" fill="#ef4444" opacity="0.4" className="animate-ping" />
                    <circle r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                    <text
                      y="-8"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      Your Guess
                    </text>
                  </g>
                )}

                {/* True Location Pin (revealed after guess) */}
                {hasGuessed && truePos && (
                  <g transform={`translate(${truePos.x}, ${truePos.y})`}>
                    <circle r="10" fill="#10b981" opacity="0.4" className="animate-ping" />
                    <circle r="6" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                    <text
                      y="-10"
                      textAnchor="middle"
                      fill="#10b981"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      📍 {currentLocation.countryName}
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Round Feedback Summary Card */}
            {hasGuessed && (
              <div className="mt-4 p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{currentLocation.flagEmoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-base">
                        {currentLocation.locationName}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800/40">
                        {currentLocation.countryName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {currentLocation.cityOrRegion} • {currentLocation.continent}
                    </p>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl">
                      {currentLocation.geographyFact}
                    </p>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-5 shrink-0">
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Distance Error</span>
                    <div className="text-base font-bold text-amber-400 font-mono">
                      {roundDistanceKm.toLocaleString()} km
                    </div>
                  </div>
                  <div className="text-right mt-1">
                    <span className="text-xs text-slate-400">Round Score</span>
                    <div className="text-xl font-black text-emerald-400 font-mono">
                      +{roundScore.toLocaleString()} pts
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Game Over Summary Screen */
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-xl text-center animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
            <Trophy className="w-10 h-10" />
          </div>

          <h3 className="text-3xl font-black text-white mb-2">Expedition Complete!</h3>
          <p className="text-sm text-slate-300 mb-6 max-w-md mx-auto">
            You concluded your 5-round global expedition with a final score of:
          </p>

          <div className="inline-block p-6 rounded-3xl bg-slate-950 border border-emerald-500/30 mb-8">
            <div className="text-5xl font-black text-emerald-400 font-mono">
              {totalScore.toLocaleString()}
            </div>
            <div className="text-xs uppercase font-bold tracking-widest text-slate-400 mt-1">
              out of 25,000 possible points
            </div>
            <div className="mt-3 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold inline-block border border-emerald-500/30">
              Rank: {totalScore > 20000 ? 'Master Cartographer 🌟' : totalScore > 14000 ? 'Seasoned Explorer 🧭' : 'Globe Trotter 🎒'}
            </div>
          </div>

          <div>
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Embark on New Expedition</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
